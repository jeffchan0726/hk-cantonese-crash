function htmlHome() {
  const p = load();
  const next = (LESSONS.find((l) => !(p.lessonsDone || {})[l.id]) || LESSONS[0]);
  const wrongN = Object.keys(p.wrongBook || {}).length;
  return `<div class="home-grid"><div class="hero">
      <div class="k">SUCHENG / QUICK</div>
      <h2>只打頭碼同尾碼<br>就打到繁體中文。</h2>
      <p class="tiny">速成 = 倉頡簡化版。記住 24 個字根，再練拆頭尾。例如「港」倉頡 <b>水廿金山</b>，速成就係 <b>水山 EU</b>。</p>
      <p class="tiny pc-only">電腦版：左側選單切頁，拆碼／打字可用實體鍵盤。</p>
      <p class="tiny phone-only">手機版：撟底下 tab，用螢幕鍵盤入碼。</p>
      <div class="stats">
        <div class="stat"><b>${p.streak || 0}</b><span>連續日</span></div>
        <div class="stat"><b>${p.correct || 0}</b><span>拆啾</span></div>
        <div class="stat"><b>${acc(p)}%</b><span>準確率</span></div>
      </div>
      <div class="bar"><i style="width:${Math.min(100, ((p.todayCount || 0) / DAILY_GOAL) * 100)}%"></i></div>
      <p class="tiny">今日目標 ${p.todayCount || 0} / ${DAILY_GOAL}</p>
    </div>
    <div class="path">
      <button class="task" data-go="next"><div><b>繼續：${next.title}</b><span>${next.blurb}</span></div><em>去</em></button>
      <button class="task" data-go="learn"><div><b>課程路徑</b><span>字根 → 單碼 → 常用 → 粵語 → 限時 → 文章</span></div><em>去</em></button>
      <button class="task" data-go="drill"><div><b>自由拆碼</b><span>常用 / 全部 / 難字 / 錯字本</span></div><em>去</em></button>
      <button class="task" data-go="article"><div><b>文章練習</b><span>內建香港情景，可貼自訂文</span></div><em>去</em></button>
      <button class="task" data-go="review"><div><b>錯字本 ${wrongN}</b><span>打錯自動收，打啾除名</span></div><em>去</em></button>
      <button class="task" data-go="lookup"><div><b>查碼</b><span>漢字 ↔ 速成／倉頡</span></div><em>去</em></button>
    </div></div>`;
}
function renderHome() {
  $("view-home").innerHTML = htmlHome();
  $("view-home").querySelectorAll("[data-go]").forEach((b) => {
    b.onclick = () => {
      const g = b.dataset.go;
      if (g === "next") startLesson(LESSONS.find((l) => !(load().lessonsDone || {})[l.id]) || LESSONS[0]);
      else if (g === "article") { state.article = { key: "hi", i: 0, misses: 0, typed: "" }; go("article"); }
      else go(g);
    };
  });
}
function renderLearn() {
  const p = load();
  $("view-learn").innerHTML = `<h3>跟住條路徑學</h3><p class="tiny">先記字根，再拆碼，最後打整句。</p><div class="path lessons">${LESSONS.map((l) => { const done = p.lessonsDone && p.lessonsDone[l.id]; return `<button class="lesson ${done ? "done" : ""}" data-id="${l.id}"><div><b>${l.title}</b><span>${l.blurb}</span></div><em>${done ? "重溫" : "開始"}</em></button>`; }).join("")}</div>`;
  $("view-learn").querySelectorAll("[data-id]").forEach((b) => { b.onclick = () => startLesson(LESSONS.find((x) => x.id === b.dataset.id)); });
}
function startLesson(lesson) {
  state.lesson = lesson; state.i = 0; state.misses = 0; state.hintLevel = 0;
  if (lesson.kind === "roots") { state.rootCat = "ALL"; go("learn"); renderRootsLesson(); return; }
  if (lesson.kind === "rootquiz") { state.quiz = { i: 0, q: null }; go("learn"); renderRootQuiz(); return; }
  if (lesson.kind === "drill") { state.mode = lesson.pool; go("drill"); return; }
  if (lesson.kind === "timed") { state.mode = lesson.pool || "starter"; startTimer(lesson.secs || 60); go("drill"); return; }
  if (lesson.kind === "article") { state.article = { key: lesson.article || "hi", i: 0, misses: 0, typed: "" }; go("article"); }
}
function renderRootsLesson() {
  const p = load();
  const keys = Object.keys(SUCHENG.map);
  const show = keys.filter((k) => state.rootCat === "ALL" || state.rootCat.includes(k));
  const cats = [["全部", "ALL"]].concat((SUCHENG.cats || []).map((c) => [c[0], c[1]]));
  $("view-learn").innerHTML = `<h3>廿四字根鍵盤</h3><p class="tiny">撟一下標已記。已記 ${Object.keys(p.knownRad || {}).filter((k) => p.knownRad[k]).length} / 25。</p><div class="chips">${cats.map(([n, k]) => `<button class="chip ${state.rootCat === k ? "on" : ""}" data-cat="${k}">${n}</button>`).join("")}</div><div class="root-grid">${show.map((k) => `<button class="root ${p.knownRad[k] ? "known" : ""}" data-k="${k}"><b>${k}</b><span>${SUCHENG.map[k]}</span><i>${SUCHENG.aux[k] || ""}</i></button>`).join("")}</div><div class="row"><button class="btn primary" id="to-quiz">去測驗</button><button class="btn ghost" id="mark-all">全部標已記</button></div>`;
  $("view-learn").querySelectorAll("[data-cat]").forEach((b) => { b.onclick = () => { state.rootCat = b.dataset.cat; renderRootsLesson(); }; });
  $("view-learn").querySelectorAll("[data-k]").forEach((b) => {
    b.onclick = () => {
      const cur = save();
      cur.knownRad[b.dataset.k] = !cur.knownRad[b.dataset.k];
      localStorage.setItem(STORE, JSON.stringify(cur));
      if (Object.keys(cur.knownRad).filter((k) => cur.knownRad[k]).length >= 24) finishLesson("roots");
      renderRootsLesson();
    };
  });
  $("to-quiz").onclick = () => startLesson(LESSONS.find((l) => l.id === "rootquiz"));
  $("mark-all").onclick = () => { const known = {}; keys.forEach((k) => known[k] = true); save({ knownRad: known }); finishLesson("roots"); renderRootsLesson(); };
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function makeQuiz() {
  const keys = Object.keys(SUCHENG.map);
  const k = keys[Math.floor(Math.random() * keys.length)];
  const askKey = Math.random() < 0.5;
  const opts = new Set([k]);
  while (opts.size < 4) opts.add(keys[Math.floor(Math.random() * keys.length)]);
  return { k, askKey, opts: shuffle([...opts]) };
}
function renderRootQuiz() {
  if (!state.quiz.q) state.quiz.q = makeQuiz();
  const q = state.quiz.q;
  $("view-learn").innerHTML = `<h3>字根測驗　${state.quiz.i + 1}/20</h3><div class="card flash">${q.askKey ? `<div class="tiny">呢個鍵係邊個字根？</div><div class="keyname">${q.k}</div>` : `<div class="tiny">呢個字根係邊個鍵？</div><div class="rad">${SUCHENG.map[q.k]}</div>`}</div><div class="choices">${q.opts.map((k) => `<button class="choice" data-k="${k}">${q.askKey ? SUCHENG.map[k] : k + "　" + SUCHENG.map[k]}</button>`).join("")}</div>`;
  $("view-learn").querySelectorAll(".choice").forEach((b) => {
    b.onclick = () => {
      const ok = b.dataset.k === q.k;
      const p = save();
      save({ correct: (p.correct || 0) + (ok ? 1 : 0), wrong: (p.wrong || 0) + (ok ? 0 : 1) });
      addToday(1);
      toast(ok ? "啾！" : "係 " + q.k + "＝" + SUCHENG.map[q.k]);
      setTimeout(() => { state.quiz.i += 1; if (state.quiz.i >= 20) { finishLesson("rootquiz"); go("home"); return; } state.quiz.q = null; renderRootQuiz(); }, 400);
    };
  });
}
function kbHtml(typed, nextKeys) {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const typedU = (typed || "").toUpperCase();
  const next = (nextKeys || []).map((k) => k.toUpperCase());
  return rows.map((row) => `<div class="kb-row">${[...row].map((k) => { const rad = SUCHENG.map[k]; return `<button type="button" class="key ${typedU.includes(k) ? "on" : ""} ${next.includes(k) ? "next" : ""}" data-k="${k}" ${rad ? "" : "disabled"}>${k}<i>${rad || ""}</i></button>`; }).join("")}</div>`).join("");
}
function bindKb(box, inp) {
  if (!box || !inp) return;
  box.querySelectorAll("button[data-k]").forEach((b) => { b.onclick = () => { if (inp.value.length >= 2) inp.value = ""; inp.value += b.dataset.k; inp.focus(); }; });
}
function renderDrill() {
  const list = pool();
  if (!list.length) { $("view-drill").innerHTML = `<div class="card"><p>呢個字庫暫時冇字。</p></div>`; return; }
  if (state.i >= list.length) state.i = 0;
  const han = list[state.i];
  const rec = idx().byHan[han];
  const modes = [["starter", "常用"], ["cantonese", "粵語"], ["singles", "單碼"], ["hard", "難字"], ["all", "全部"], ["wrong", "錯字本"], ["mark", "書籤"]];
  const nextKeys = [];
  if (state.hintLevel >= 1 && rec.sc[0]) nextKeys.push(rec.sc[0]);
  if (state.hintLevel >= 2 && rec.sc[1]) nextKeys.push(rec.sc[1]);
  const marked = load().bookmarks && load().bookmarks[han];
  $("view-drill").innerHTML = `<div class="chips">${modes.map(([k, n]) => `<button class="chip ${state.mode === k ? "on" : ""}" data-mode="${k}">${n}</button>`).join("")}<button class="chip ${state.timed.running ? "on" : ""}" id="timed-btn">60秒</button></div>${state.timed.running ? `<div class="timer" id="timer-lab">${state.timed.left}s　${state.timed.ok} 啾</div>` : ""}<div class="split"><div class="drill-card"><div class="tiny">${(modes.find((m) => m[0] === state.mode) || [])[1] || ""} ${state.i + 1}/${list.length}</div><div class="big" id="drill-char">${han}</div><form id="drill-form"><input class="box" id="drill-input" maxlength="2" autocapitalize="off" autocomplete="off" inputmode="text" placeholder="頭尾碼，例如 EU" /><div class="row"><button class="btn primary" type="submit">核對</button><button class="btn" type="button" id="drill-show">睇答案</button><button class="btn ghost" type="button" id="drill-next">下一字</button><button class="btn ghost" type="button" id="drill-mark">${marked ? "★" : "☆"}</button></div></form><div class="feedback" id="drill-ans"></div></div><div class="kb-pane"><div class="kb" id="drill-kb">${kbHtml("", nextKeys)}</div><p class="tiny rule">只取倉頡<strong>第一碼 + 最後一碼</strong>。錯一次亮頭碼，兩次亮全碼。</p><p class="tiny pc-only">電腦：打英文字母，Enter 核對，Esc 睇答案。</p><p class="tiny phone-only">手機：撟下面字根鍵入碼。</p></div></div>`;
  $("view-drill").querySelectorAll("[data-mode]").forEach((c) => { c.onclick = () => { state.mode = c.dataset.mode; state.i = 0; state.misses = 0; state.hintLevel = 0; renderDrill(); }; });
  $("timed-btn").onclick = () => { state.timed.running ? stopTimer() : startTimer(60); renderDrill(); };
  bindKb($("drill-kb"), $("drill-input"));
  $("drill-show").onclick = () => { state.hintLevel = 2; $("drill-ans").innerHTML = `<b>${rec.sc.toUpperCase()}</b>　${labelCode(rec.sc)}<div class="tiny">倉頡 ${rec.cj.toUpperCase()}</div>`; $("drill-kb").innerHTML = kbHtml("", rec.sc.split("")); bindKb($("drill-kb"), $("drill-input")); };
  $("drill-next").onclick = () => { state.i += 1; state.misses = 0; state.hintLevel = 0; renderDrill(); };
  $("drill-mark").onclick = () => { toggleMark(han); renderDrill(); };
  $("drill-form").onsubmit = (e) => {
    e.preventDefault();
    const guess = $("drill-input").value.trim().toLowerCase().replace(/[^a-z]/g, "");
    const ok = guess === rec.sc;
    const cur = save();
    save({ correct: (cur.correct || 0) + (ok ? 1 : 0), wrong: (cur.wrong || 0) + (ok ? 0 : 1) });
    if (ok) {
      markRight(han); addToday(1); if (state.timed.running) state.timed.ok += 1;
      if (state.lesson && state.lesson.kind === "drill" && state.lesson.goal && state.i + 1 >= Math.min(state.lesson.goal, list.length)) finishLesson(state.lesson.id);
      setTimeout(() => { state.i += 1; state.misses = 0; state.hintLevel = 0; renderDrill(); }, 350);
    } else {
      markWrong(han); state.misses += 1; if (state.timed.running) state.timed.bad += 1;
      state.hintLevel = Math.min(2, state.misses);
      $("drill-ans").innerHTML = state.misses >= 2 ? `<span class="bad">唔係 ${guess.toUpperCase() || "空白"}</span> → <b>${rec.sc.toUpperCase()}</b>　${labelCode(rec.sc)}` : `<span class="bad">再試。頭碼已經亮咗。</span>`;
      $("drill-kb").innerHTML = kbHtml("", rec.sc.split("").slice(0, state.hintLevel));
      bindKb($("drill-kb"), $("drill-input"));
    }
  };
  setTimeout(() => { const i = $("drill-input"); if (i) i.focus(); }, 20);
}
function startTimer(secs) {
  stopTimer();
  state.timed = { left: secs, ok: 0, bad: 0, running: true, id: null };
  state.i = Math.floor(Math.random() * Math.max(1, pool().length));
  state.misses = 0; state.hintLevel = 0;
  state.timed.id = setInterval(() => {
    state.timed.left -= 1;
    const lab = $("timer-lab");
    if (lab) lab.textContent = state.timed.left + "s　" + state.timed.ok + " 啾";
    if (state.timed.left <= 0) { stopTimer(); finishLesson("timed"); toast("時間到：啾 " + state.timed.ok); go("home"); }
  }, 1000);
}
function stopTimer() {
  if (state.timed.id) clearInterval(state.timed.id);
  state.timed.running = false; state.timed.id = null;
}
function renderType() {
  $("view-type").innerHTML = `<div class="chips"><button class="chip on">網頁鍵盤</button><button class="chip" id="to-art">文章練習</button></div><div class="split"><div><div class="out" id="out"></div><div class="tiny" id="code-now">未入碼</div><div class="cands" id="cands"></div><div class="row"><button class="btn" id="type-bs">刪</button><button class="btn" id="type-space">清碼</button><button class="btn" id="copy-out">複製</button><button class="btn ghost" id="type-clear">清空</button></div></div><div class="kb-pane"><div class="kb" id="kb">${kbHtml(state.typed, [])}</div><p class="tiny pc-only">電腦：實體鍵盤打碼，數字鍵 1–9 擇字，空白鍵清碼。</p><p class="tiny phone-only">手機：撟字根鍵，再擇候選字。</p></div></div>`;
  $("to-art").onclick = () => go("article");
  $("kb").querySelectorAll("button[data-k]").forEach((b) => { b.onclick = () => { if (state.typed.length >= 2) state.typed = ""; state.typed += b.dataset.k.toLowerCase(); renderType(); }; });
  const code = state.typed.toLowerCase();
  $("code-now").textContent = code ? code.toUpperCase() + "　" + labelCode(code) : "未入碼";
  const list = code ? (idx().bySc[code] || []) : [];
  $("cands").innerHTML = list.slice(0, 24).map((han, i) => `<button class="cand" data-h="${han}"><em>${i + 1}</em>${han}</button>`).join("") || (code ? "<span class='tiny'>呢個碼字庫未收</span>" : "");
  $("cands").querySelectorAll("button").forEach((b) => { b.onclick = () => { state.picked.push(b.dataset.h); state.typed = ""; save({ typedChars: (load().typedChars || 0) + 1 }); addToday(1); renderType(); }; });
  $("out").textContent = state.picked.join("") || "打頭尾碼，再擇字";
  $("type-clear").onclick = () => { state.typed = ""; state.picked = []; renderType(); };
  $("type-bs").onclick = () => { if (state.typed) state.typed = state.typed.slice(0, -1); else state.picked.pop(); renderType(); };
  $("type-space").onclick = () => { state.typed = ""; renderType(); };
  $("copy-out").onclick = () => { const t = state.picked.join(""); if (t) navigator.clipboard.writeText(t); };
}
function articleChars() { return [...((ARTICLES[state.article.key] && ARTICLES[state.article.key].text) || "")]; }
function renderArticle() {
  const art = ARTICLES[state.article.key] || ARTICLES.hi;
  const chars = articleChars();
  if (state.article.i >= chars.length) {
    if (state.article.key === "hi") finishLesson("article-hi");
    if (state.article.key === "hk") finishLesson("article-hk");
    $("view-article").innerHTML = `<div class="card"><h3>打完「${art.title}」</h3><div class="row"><button class="btn primary" id="again">再打一次</button><button class="btn" id="back-home">返今日</button></div></div>`;
    $("again").onclick = () => { state.article.i = 0; state.article.misses = 0; renderArticle(); };
    $("back-home").onclick = () => go("home");
    return;
  }
  const ch = chars[state.article.i];
  const rec = idx().byHan[ch];
  if (!rec && /[\s.,!?。，、！？：:；;「」『』（）()…—\-—]/.test(ch)) { state.article.i += 1; renderArticle(); return; }
  const nextKeys = rec && state.article.misses >= 1 ? rec.sc.split("").slice(0, state.article.misses >= 2 ? 2 : 1) : [];
  $("view-article").innerHTML = `<div class="chips">${Object.keys(ARTICLES).map((k) => `<button class="chip ${state.article.key === k ? "on" : ""}" data-k="${k}">${ARTICLES[k].title}</button>`).join("")}</div><div class="split"><div><div class="passage">${chars.map((c, i) => `<span class="${i < state.article.i ? "done" : i === state.article.i ? "cur" : "todo"}">${c}</span>`).join("")}</div><p class="tiny">${art.title}　${state.article.i + 1}/${chars.length}${rec ? "" : "　標點跳過"}</p><input class="box" id="art-input" maxlength="2" autocapitalize="off" autocomplete="off" inputmode="text" placeholder="${rec ? "輸入頭尾碼" : "撟下一字"}" /><div class="row"><button class="btn primary" id="art-ok">${rec ? "核對" : "下一字"}</button><button class="btn" id="art-hint">提示</button><button class="btn ghost" id="art-skip">跳過</button></div><textarea class="box" id="custom-art" placeholder="貼一段繁體中文"></textarea><div class="row"><button class="btn" id="use-custom">用呢段</button></div></div><div class="kb-pane"><div class="kb" id="art-kb">${kbHtml("", nextKeys)}</div><p class="tiny pc-only">電腦：打頭尾碼再 Enter。標點會自動跳過。</p><p class="tiny phone-only">手機：撟字根鍵，再撟核對。</p></div></div>`;
  $("view-article").querySelectorAll("[data-k]").forEach((b) => { b.onclick = () => { state.article = { key: b.dataset.k, i: 0, misses: 0, typed: "" }; renderArticle(); }; });
  bindKb($("art-kb"), $("art-input"));
  $("art-ok").onclick = () => checkArticle(true);
  $("art-hint").onclick = () => { if (!rec) return; state.article.misses = 2; toast(rec.sc.toUpperCase()); renderArticle(); };
  $("art-skip").onclick = () => { state.article.i += 1; state.article.misses = 0; renderArticle(); };
  $("art-input").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); checkArticle(true); } };
  $("use-custom").onclick = () => { const t = $("custom-art").value.trim(); if (!t) return; ARTICLES.custom = { title: "自訂", text: t }; state.article = { key: "custom", i: 0, misses: 0, typed: "" }; renderArticle(); };
  if (rec) setTimeout(() => $("art-input").focus(), 20);
}
function checkArticle(force) {
  const ch = articleChars()[state.article.i];
  const rec = idx().byHan[ch];
  if (!rec) { state.article.i += 1; renderArticle(); return; }
  const guess = ($("art-input").value || "").trim().toLowerCase().replace(/[^a-z]/g, "");
  if (guess === rec.sc) { markRight(ch); addToday(1); save({ typedChars: (load().typedChars || 0) + 1, correct: (load().correct || 0) + 1 }); state.article.i += 1; state.article.misses = 0; renderArticle(); return; }
  if (!force && guess.length < 2) return;
  markWrong(ch); save({ wrong: (load().wrong || 0) + 1 }); state.article.misses += 1; toast("再試"); renderArticle();
}
function renderReview() {
  const p = load();
  const wrong = Object.entries(p.wrongBook || {}).sort((a, b) => b[1].n - a[1].n);
  const marks = Object.keys(p.bookmarks || {});
  $("view-review").innerHTML = `<h3>錯字本</h3><div class="wrap">${wrong.length ? wrong.map(([h]) => `<b>${h}</b>`).join(" ") : "<span class='tiny'>未有錯字</span>"}</div><div class="row"><button class="btn primary" id="drill-wrong">練錯字</button></div><h3>書籤</h3><div class="wrap">${marks.length ? marks.map((h) => `<b>${h}</b>`).join(" ") : "<span class='tiny'>拆碼可加書籤</span>"}</div><div class="row"><button class="btn" id="drill-mark">練書籤</button></div>`;
  $("drill-wrong").onclick = () => { state.mode = "wrong"; state.i = 0; go("drill"); };
  $("drill-mark").onclick = () => { state.mode = "mark"; state.i = 0; go("drill"); };
}
function renderLookup() {
  $("view-lookup").innerHTML = `<h3>查碼</h3><input class="search" id="q" placeholder="查漢字或速成碼，例如 香 或 HA" /><div id="look-res"></div>`;
  const run = () => {
    const q = ($("q").value || "").trim();
    const box = $("look-res");
    if (!q) { box.innerHTML = "<p class='tiny'>輸入漢字或一至兩個英文字母</p>"; return; }
    const low = q.toLowerCase();
    if (/^[a-z]{1,2}$/.test(low)) { const list = idx().bySc[low] || []; box.innerHTML = `<p>${low.toUpperCase()}　${labelCode(low)}　${list.length} 字</p><div class="wrap">${list.map((h) => `<b>${h}</b>`).join(" ")}</div>`; return; }
    box.innerHTML = [...q].map((ch) => { const rec = idx().byHan[ch]; return rec ? `<div class="look-item"><b>${ch}</b><div>速成 <strong>${rec.sc.toUpperCase()}</strong>　${labelCode(rec.sc)}</div><div class="tiny">倉頡 ${rec.cj.toUpperCase()}</div></div>` : `<div class="look-item"><b>${ch}</b> 未收錄</div>`; }).join("");
  };
  $("q").addEventListener("input", run); run();
}
function renderMe() {
  const p = save();
  $("view-me").innerHTML = `<h3>進度</h3><div class="stats"><div class="stat"><b>${p.streak || 0}</b><span>連續日</span></div><div class="stat"><b>${p.correct || 0}</b><span>拆啾</span></div><div class="stat"><b>${acc(p)}%</b><span>準確率</span></div></div><p class="tiny">打字 ${p.typedChars || 0} 字　今日 ${p.todayCount || 0}/${DAILY_GOAL}　字庫 ${unique(SUCHENG.chars.map((x) => x[0]).filter((h) => h && h.length === 1)).length} 字</p><div class="path"><button class="task" id="go-look"><div><b>查碼</b><span>漢字 ↔ 速成／倉頡</span></div><em>去</em></button><button class="task" id="go-rev"><div><b>錯字本／書籤</b><span>${Object.keys(p.wrongBook || {}).length} 隻錯字</span></div><em>去</em></button></div><button class="btn ghost" id="reset">清除進度</button>`;
  $("go-look").onclick = () => go("lookup");
  $("go-rev").onclick = () => go("review");
  $("reset").onclick = () => { if (confirm("清進度？")) { localStorage.removeItem(STORE); render(); } };
}
window.addEventListener("DOMContentLoaded", () => {
  save(); idx();
  document.querySelectorAll(".tab").forEach((t) => { t.onclick = () => { if (t.dataset.view === "learn") state.lesson = null; go(t.dataset.view); }; });
  const goHome = () => go("home");
  if ($("brand-btn")) $("brand-btn").onclick = goHome;
  if ($("side-brand")) $("side-brand").onclick = goHome;
  if ($("goal-pill")) $("goal-pill").onclick = () => go("learn");
  window.addEventListener("resize", () => { const pill = $("device-pill"); if (pill) pill.textContent = isPc() ? "電腦版" : "手機版"; });
  document.addEventListener("keydown", (e) => {
    if (e.target && (e.target.tagName === "TEXTAREA" || e.target.id === "q" || e.target.id === "custom-art")) return;
    if (state.view === "drill") {
      if (e.key === "Escape") { const b = $("drill-show"); if (b) b.click(); }
      if (e.key === "Enter" && e.target && e.target.id !== "drill-input") { const f = $("drill-form"); if (f) f.requestSubmit(); }
      return;
    }
    if (state.view === "article") { if (e.key === "Enter") { e.preventDefault(); checkArticle(true); } return; }
    if (state.view !== "type") return;
    if (e.key === "Backspace") { e.preventDefault(); const b = $("type-bs"); if (b) b.click(); }
    if (e.key === " ") { e.preventDefault(); const b = $("type-space"); if (b) b.click(); }
    const k = e.key.toUpperCase();
    if (SUCHENG.map[k]) { e.preventDefault(); if (state.typed.length >= 2) state.typed = ""; state.typed += k.toLowerCase(); renderType(); }
    if (/^[1-9]$/.test(e.key)) { const btns = $("cands") ? $("cands").querySelectorAll("button") : []; if (btns[Number(e.key) - 1]) btns[Number(e.key) - 1].click(); }
  });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  render();
});
