const STORE = "canto-hk-v1";

const state = {
  view: "home",
  lessonId: 1,
  line: 0,
  step: "show",
  quizI: 0,
  quizScore: 0,
  flipped: false,
  recText: "",
  recording: false
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch { return {}; }
}
function save(patch) {
  const cur = Object.assign({
    doneLessons: {}, known: {}, srs: {}, streak: 0, lastDay: "",
    spoken: 0, hideHan: false, slow: false
  }, load(), patch || {});
  localStorage.setItem(STORE, JSON.stringify(cur));
  return cur;
}
function today() { return new Date().toISOString().slice(0, 10); }
function bumpStreak() {
  const p = load();
  const d = today();
  if (p.lastDay === d) return save();
  const y = new Date(); y.setDate(y.getDate() - 1);
  const ys = y.toISOString().slice(0, 10);
  const streak = p.lastDay === ys ? (p.streak || 0) + 1 : 1;
  return save({ streak, lastDay: d });
}

function speak(text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const prefer =
    voices.find((v) => /zh-HK|yue-HK|Hong Kong/i.test(v.lang + v.name)) ||
    voices.find((v) => /zh-TW|yue/i.test(v.lang + v.name)) ||
    voices.find((v) => /zh/i.test(v.lang));
  if (prefer) u.voice = prefer;
  u.lang = prefer ? prefer.lang : "zh-HK";
  u.rate = save().slow ? 0.72 : 0.92;
  speechSynthesis.speak(u);
}
function speakSlow(jyut) {
  const parts = String(jyut || "").split(/[\s/,]+/).filter(Boolean);
  if (!parts.length) return;
  speechSynthesis.cancel();
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p.replace(/[0-9]/g, ""));
    u.lang = "zh-HK"; u.rate = 0.6;
    setTimeout(() => speechSynthesis.speak(u), i * 650);
  });
}
function listenOnce(cb) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { cb(null, "呢個瀏覽器未支援語音辨識，用 Chrome 開會穩陣啲。"); return null; }
  const rec = new SR();
  rec.lang = "zh-HK"; rec.interimResults = false; rec.maxAlternatives = 3;
  rec.onresult = (e) => cb([...e.results[0]].map((x) => x.transcript), null);
  rec.onerror = () => cb(null, "聽唔到，試下再講一次。");
  rec.start();
  return rec;
}
function scoreUtterance(heard, line) {
  const norm = (s) => String(s || "").toLowerCase().replace(/[.,!?。，！？\s]/g, "");
  const pool = [line.han].concat(line.ok || []).map(norm);
  return (heard || []).some((h) => pool.some((p) => norm(h).includes(p) || p.includes(norm(h))));
}
function nextLessonId(p) {
  const undone = CANTO.lessons.find((l) => !p.doneLessons[l.id]);
  return (undone || CANTO.lessons[0]).id;
}
function dueCards(p) {
  const now = Date.now();
  const items = [];
  const unlocked = CANTO.lessons.filter((ls) => p.doneLessons[ls.id] || ls.id === nextLessonId(p));
  unlocked.forEach((ls) => ls.lines.forEach((ln, i) => {
    const id = ls.id + "-" + i;
    const card = p.srs[id] || { due: 0 };
    if (card.due <= now) items.push(Object.assign({ id }, ln, { lesson: ls.id }));
  }));
  return items.slice(0, 16);
}
function reviewCard(id, grade) {
  const p = save();
  const now = Date.now();
  const prev = p.srs[id] || { ivl: 0 };
  let ivl = prev.ivl || 0;
  if (grade === "again") ivl = 0.01;
  else if (grade === "ok") ivl = ivl < 1 ? 1 : ivl * 2;
  else ivl = ivl < 1 ? 3 : ivl * 3;
  p.srs[id] = { due: now + ivl * 86400000, ivl };
  localStorage.setItem(STORE, JSON.stringify(p));
}
function $(id) { return document.getElementById(id); }
function go(view, extra) {
  state.view = view;
  Object.assign(state, extra || {});
  render();
}
function render() {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  const el = $("view-" + state.view);
  if (el) el.classList.remove("hidden");
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("on", t.dataset.view === state.view || (t.dataset.view === "home" && state.view === "lesson"));
  });
  const map = { home: renderHome, lessons: renderLessons, lesson: renderLesson, tones: renderTones, cards: renderCards, dict: renderDict, me: renderMe };
  (map[state.view] || renderHome)();
}
function renderHome() {
  const p = bumpStreak();
  const done = Object.keys(p.doneLessons || {}).length;
  const nid = nextLessonId(p);
  const les = CANTO.lessons.find((l) => l.id === nid);
  const due = dueCards(p).length;
  $("stat-streak").textContent = p.streak || 0;
  $("stat-done").textContent = done + "/12";
  $("stat-spoken").textContent = p.spoken || 0;
  $("next-lesson-title").textContent = les.emoji + " " + les.title;
  $("next-lesson-sub").textContent = les.goal + " · " + les.mins + " 分鐘";
  $("due-count").textContent = due ? due + " 張到期" : "而家冇卡，去上堂先";
  $("home-continue").onclick = () => startLesson(nid);
  $("home-review").onclick = () => go("cards");
  $("home-tones").onclick = () => go("tones");
  $("home-speak").onclick = () => startLesson(nid, true);
}
function renderLessons() {
  const p = load();
  const box = $("lesson-grid");
  box.innerHTML = CANTO.lessons.map((l) => {
    const done = !!p.doneLessons[l.id];
    return `<button class="card ${done ? "done" : ""}" data-id="${l.id}">
      <div class="emoji">${l.emoji}</div><h3>${l.title}</h3><p>${l.goal}</p>
      <div class="progress-mini"><i style="width:${done ? 100 : 0}%"></i></div></button>`;
  }).join("");
  box.querySelectorAll("button").forEach((b) => { b.onclick = () => startLesson(Number(b.dataset.id)); });
}
function startLesson(id, challenge) {
  state.lessonId = id; state.line = 0; state.step = challenge ? "speak" : "show"; go("lesson");
}
function currentLine() {
  const les = CANTO.lessons.find((l) => l.id === state.lessonId);
  return { les, line: les.lines[state.line], total: les.lines.length };
}
function renderLesson() {
  const { les, line, total } = currentLine();
  $("lesson-back").onclick = () => go("lessons");
  $("lesson-kicker").textContent = les.emoji + " 第 " + les.id + " 課 · " + (state.line + 1) + "/" + total;
  $("lesson-title").textContent = les.title;
  $("lesson-note").textContent = les.point;
  const hide = load().hideHan;
  $("phrase-han").textContent = hide && state.step !== "show" ? "　　　" : line.han;
  $("phrase-jyut").textContent = line.jyut;
  $("phrase-en").textContent = line.en;
  $("fb").textContent = ""; $("fb").className = "feedback";
  $("btn-speak").onclick = () => speak(line.han);
  $("btn-slow").onclick = () => speakSlow(line.jyut);
  $("btn-next").onclick = nextLine;
  $("btn-prev").onclick = () => { if (state.line > 0) { state.line -= 1; renderLesson(); } };
  $("mic").onclick = practiceSpeak;
  if (state.step === "speak") speak(line.han);
}
function nextLine() {
  const { les, total } = currentLine();
  if (state.line + 1 < total) { state.line += 1; state.step = "show"; renderLesson(); return; }
  const p = save(); p.doneLessons[les.id] = true;
  localStorage.setItem(STORE, JSON.stringify(p));
  bumpStreak(); go("home");
  alert("搞掂！完成「" + les.title + "」。");
}
function practiceSpeak() {
  const { line } = currentLine();
  const fb = $("fb");
  $("mic").classList.add("rec"); fb.textContent = "講啦…";
  listenOnce((texts, err) => {
    $("mic").classList.remove("rec");
    if (err) { fb.className = "feedback bad"; fb.textContent = err; return; }
    const ok = scoreUtterance(texts, line);
    fb.className = "feedback" + (ok ? "" : " bad");
    fb.textContent = ok ? "得！聽到：" + texts[0] : "差唔多 — 你講：「" + texts[0] + "」。目標：「" + line.han + "」";
    if (ok) { const p = save(); save({ spoken: (p.spoken || 0) + 1 }); }
  });
}
function renderTones() {
  const box = $("tone-list");
  box.innerHTML = CANTO.tones.map((t) => `<div class="tone">
    <div class="n">${t.n}</div>
    <div><b>${t.ex} ${t.jyut}</b><div class="tiny">${t.name} · ${t.contour}<br>${t.tip}</div></div>
    <button class="btn" data-han="${t.ex}">聽</button></div>`).join("");
  box.querySelectorAll("button").forEach((b) => { b.onclick = () => speak(b.dataset.han); });
  $("particle-box").innerHTML = CANTO.particles.map((p) => `<div class="tone">
    <div class="n">${p.han}</div>
    <div><b>${p.jyut}</b><div class="tiny">${p.mean} · ${p.eg}<br>${p.note}</div></div>
    <button class="btn" data-han="${p.eg}">聽</button></div>`).join("");
  $("particle-box").querySelectorAll("button").forEach((b) => { b.onclick = () => speak(b.dataset.han); });
  renderToneQuiz();
}
function renderToneQuiz() {
  const q = CANTO.toneQuiz[state.quizI % CANTO.toneQuiz.length];
  $("quiz-word").textContent = q.han + "  " + q.jyut;
  $("quiz-meta").textContent = "聽完擇聲調 · 已答啲 " + state.quizScore;
  $("quiz-play").onclick = () => speak(q.han);
  const ch = $("quiz-choices");
  ch.innerHTML = [1,2,3,4,5,6].map((n) => `<button data-n="${n}">${n}</button>`).join("");
  ch.querySelectorAll("button").forEach((b) => {
    b.onclick = () => {
      const n = Number(b.dataset.n);
      const good = n === q.tone;
      b.className = good ? "good" : "bad";
      if (good) state.quizScore += 1;
      setTimeout(() => { state.quizI += 1; renderToneQuiz(); }, 450);
    };
  });
}
function renderCards() {
  const p = save();
  const cards = dueCards(p);
  $("card-meta").textContent = cards.length ? "剩 " + cards.length + " 張" : "今日卡清晒，去上堂解鎖新句。";
  if (!cards.length) {
    $("flip-card").innerHTML = "<div class='tiny'>冇到期卡</div>";
    $("srs-actions").classList.add("hidden"); return;
  }
  const c = cards[0]; state.flipped = false;
  const draw = () => {
    $("flip-card").innerHTML = state.flipped
      ? `<div class="han">${c.han}</div><div class="jyut">${c.jyut}</div><div class="en">${c.en}</div>`
      : `<div class="tiny">撞卡揭曉</div><div class="jyut">${c.jyut}</div>`;
  };
  draw();
  $("flip-card").onclick = () => { state.flipped = !state.flipped; draw(); if (state.flipped) speak(c.han); };
  $("srs-actions").classList.remove("hidden");
  $("srs-again").onclick = () => { reviewCard(c.id, "again"); renderCards(); };
  $("srs-ok").onclick = () => { reviewCard(c.id, "ok"); renderCards(); };
  $("srs-easy").onclick = () => { reviewCard(c.id, "easy"); renderCards(); };
}
function renderDict() {
  const q = ($("dict-q").value || "").trim().toLowerCase();
  const list = CANTO.dict.filter((d) => !q || [d.han, d.jyut, d.mean, d.tag].join(" ").toLowerCase().includes(q));
  $("dict-list").innerHTML = list.slice(0, 80).map((d) => `<div class="dict-item">
    <div><b>${d.han}</b> <span class="tiny">${d.jyut}</span><div class="tiny">${d.mean}</div></div>
    <div><span class="tag">${d.tag}</span> <button class="btn" data-han="${d.han}">聽</button></div>
  </div>`).join("");
  $("dict-list").querySelectorAll("button").forEach((b) => { b.onclick = () => speak(b.dataset.han); });
}
function renderMe() {
  const p = save();
  $("me-streak").textContent = (p.streak || 0) + " 日";
  $("me-spoken").textContent = p.spoken || 0;
  $("hide-han").checked = !!p.hideHan;
  $("slow-mode").checked = !!p.slow;
  $("hide-han").onchange = () => save({ hideHan: $("hide-han").checked });
  $("slow-mode").onchange = () => save({ slow: $("slow-mode").checked });
  $("reset-data").onclick = () => { if (confirm("確定清進度？")) { localStorage.removeItem(STORE); render(); } };
}
window.addEventListener("DOMContentLoaded", () => {
  save();
  document.querySelectorAll(".tab").forEach((t) => { t.onclick = () => go(t.dataset.view); });
  const brand = $("brand-btn"); if (brand) brand.onclick = () => go("me");
  $("dict-q").addEventListener("input", renderDict);
  if (speechSynthesis.getVoices().length === 0) speechSynthesis.onvoiceschanged = () => {};
  render();
});
