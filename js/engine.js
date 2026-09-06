const STORE = "sucheng-hk-v2";
const DAILY_GOAL = 20;
const state = {
  view: "home",
  i: 0,
  mode: "starter",
  typed: "",
  picked: [],
  rootCat: "ALL",
  misses: 0,
  hintLevel: 0,
  lesson: null,
  quiz: { i: 0, q: null },
  timed: { left: 60, ok: 0, bad: 0, running: false, id: null },
  article: { key: "hi", i: 0, misses: 0, typed: "" }
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch { return {}; }
}
function blank() {
  return {
    knownRad: {}, correct: 0, wrong: 0, streak: 0, lastDay: "",
    typedChars: 0, todayDate: "", todayCount: 0,
    wrongBook: {}, bookmarks: {}, lessonsDone: {}, rootStreak: {}
  };
}
function save(patch) {
  const cur = Object.assign(blank(), load(), patch || {});
  localStorage.setItem(STORE, JSON.stringify(cur));
  return cur;
}
function today() { return new Date().toISOString().slice(0, 10); }
function bumpStreak() {
  const p = load();
  const d = today();
  if (p.lastDay === d) return save(p.todayDate === d ? {} : { todayDate: d, todayCount: 0 });
  const y = new Date(); y.setDate(y.getDate() - 1);
  const streak = p.lastDay === y.toISOString().slice(0, 10) ? (p.streak || 0) + 1 : 1;
  return save({ streak, lastDay: d, todayDate: d, todayCount: p.todayDate === d ? p.todayCount : 0 });
}
function addToday(n) {
  const p = save();
  const d = today();
  const count = (p.todayDate === d ? (p.todayCount || 0) : 0) + n;
  return save({ todayDate: d, todayCount: count });
}
function $(id) { return document.getElementById(id); }
function go(v) {
  stopTimer();
  state.view = v;
  render();
}
function acc(p) {
  const t = (p.correct || 0) + (p.wrong || 0);
  return t ? Math.round((p.correct / t) * 100) : 0;
}
function idx() {
  if (!SUCHENG._idx) {
    const byHan = {}, bySc = {};
    SUCHENG.chars.forEach((row) => {
      const [han, cj, sc] = row;
      if (!han || han.length !== 1) return;
      if (!byHan[han]) byHan[han] = { han, cj, sc };
      if (!bySc[sc]) bySc[sc] = [];
      if (!bySc[sc].includes(han) && bySc[sc].length < 48) bySc[sc].push(han);
    });
    SUCHENG._idx = { byHan, bySc };
  }
  return SUCHENG._idx;
}
function labelCode(code) {
  return String(code || "").toUpperCase().split("").map((k) => (SUCHENG.map[k] || k) + k).join(" ");
}
function poolOf(name) {
  if (name === "hard") return SUCHENG.hard.filter((h) => idx().byHan[h]);
  if (name === "all") return unique(SUCHENG.chars.map((x) => x[0]).filter((h) => h && h.length === 1 && idx().byHan[h]));
  if (name === "singles") return SUCHENG.singles.filter((h) => idx().byHan[h]);
  if (name === "cantonese") return SUCHENG.cantonese.filter((h) => idx().byHan[h]);
  if (name === "wrong") return Object.keys(load().wrongBook || {}).filter((h) => idx().byHan[h]);
  if (name === "mark") return Object.keys(load().bookmarks || {}).filter((h) => idx().byHan[h]);
  return SUCHENG.starter.filter((h) => idx().byHan[h]);
}
function unique(arr) { return [...new Set(arr)]; }
function pool() { return poolOf(state.mode); }
function toast(msg) {
  let el = $("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 1400);
}
function markWrong(han) {
  const p = save();
  const book = Object.assign({}, p.wrongBook || {});
  book[han] = { n: ((book[han] && book[han].n) || 0) + 1, last: Date.now() };
  save({ wrongBook: book });
}
function markRight(han) {
  const p = save();
  const book = Object.assign({}, p.wrongBook || {});
  if (book[han]) {
    book[han].n = Math.max(0, book[han].n - 1);
    if (book[han].n === 0) delete book[han];
    save({ wrongBook: book });
  }
}
function toggleMark(han) {
  const p = save();
  const marks = Object.assign({}, p.bookmarks || {});
  if (marks[han]) delete marks[han];
  else marks[han] = true;
  save({ bookmarks: marks });
}
function finishLesson(id) {
  if (!id) return;
  const p = save();
  const done = Object.assign({}, p.lessonsDone || {});
  done[id] = true;
  save({ lessonsDone: done });
}

function render() {
  document.querySelectorAll(".view").forEach((el) => el.classList.add("hidden"));
  const el = $("view-" + state.view);
  if (el) el.classList.remove("hidden");
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.view === state.view));
  const p = bumpStreak();
  const goal = $("goal-pill");
  if (goal) goal.textContent = "今日 " + (p.todayCount || 0) + "/" + DAILY_GOAL;
  if (state.view === "learn") {
    if (state.lesson && state.lesson.kind === "roots") renderRootsLesson();
    else if (state.lesson && state.lesson.kind === "rootquiz") renderRootQuiz();
    else renderLearn();
    return;
  }
  const fn = {
    home: renderHome, drill: renderDrill, type: renderType,
    article: renderArticle, review: renderReview, lookup: renderLookup, me: renderMe
  }[state.view];
  if (fn) fn();
}
