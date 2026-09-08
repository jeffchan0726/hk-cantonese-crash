(function () {
  const STORE = "sucheng-hk-v3";
  const TABS = [
    { id: "home", icon: "\ud83c\udfe0", label: "\u4eca\u65e5" },
    { id: "learn", icon: "\ud83d\udcd8", label: "\u8ab2\u7a0b" },
    { id: "drill", icon: "\u2733\ufe0f", label: "\u62c6\u78bc" },
    { id: "type", icon: "\u2328\ufe0f", label: "\u6253\u5b57" },
    { id: "article", icon: "\ud83d\udcdd", label: "\u6587\u7ae0" },
    { id: "me", icon: "\ud83d\udc64", label: "\u6211" }
  ];
  const LESSONS = [
    { id: "roots", title: "\u2460 \u5eff\u56db\u5b57\u6839", blurb: "\u5148\u8a8d\u9375\u76e4\u3002", kind: "roots", goal: 24 },
    { id: "rootquiz", title: "\u2461 \u5b57\u6839\u6e2c\u9a57", blurb: "\u9023\u4e2d\u4e09\u6b21\u7576\u8a18\u4f4f\u3002", kind: "rootquiz", goal: 20 },
    { id: "singles", title: "\u2462 \u55ae\u78bc\u5b57", blurb: "\u65e5=A\u3001\u6c34=E\u3002", kind: "drill", pool: "singles", goal: 24 },
    { id: "easy2", title: "\u2463 \u5169\u78bc\u5e38\u7528", blurb: "\u982d\u5c3e\u5169\u78bc\u3002", kind: "drill", pool: "starter", goal: 30 },
    { id: "cantonese", title: "\u2464 \u7cb5\u8a9e\u53e3\u8a9e\u5b57", blurb: "\u9999\u6e2f\u65e5\u5e38\u5b57\u3002", kind: "drill", pool: "cantonese", goal: 20 },
    { id: "hard", title: "\u2465 \u96e3\u62c6\u5b57", blurb: "\u9577\u78bc\u53ea\u53d6\u982d\u5c3e\u3002", kind: "drill", pool: "hard", goal: 20 },
    { id: "timed", title: "\u2466 \u516d\u5341\u79d2\u885d\u523a", blurb: "\u4e00\u5206\u9418\u62c6\u5e7e\u591a\u96bb\u3002", kind: "timed", pool: "starter", secs: 60 },
    { id: "article-hi", title: "\u2467 \u6587\u7ae0\uff1a\u6253\u62db\u547c", blurb: "\u6574\u53e5\u6253\u3002", kind: "article", article: "hi" },
    { id: "article-hk", title: "\u2468 \u6587\u7ae0\uff1a\u9999\u6e2f\u751f\u6d3b", blurb: "\u5730\u9435\u3001\u8336\u9910\u5ef3\u3002", kind: "article", article: "hk" }
  ];
  const ARTICLES = {
    hi: { title: "\u6253\u62db\u547c", text: "\u4f60\u597d\u3002\u8acb\u554f\u800c\u5bb6\u5e7e\u9ede\uff1f\u5514\u8a72\u6652\u3002\u5c0d\u5514\u4f4f\u3002\u591a\u8b1d\u4f60\u5e6b\u624b\u3002\u518d\u898b\u3002" },
    hk: { title: "\u9999\u6e2f\u751f\u6d3b", text: "\u6211\u55ba\u9999\u6e2f\u4f4f\u3002\u671d\u65e9\u642d\u5730\u9435\u53bb\u516c\u53f8\u3002\u4e2d\u5348\u98df\u98ef\u98f2\u8336\u3002\u591c\u665a\u8fd4\u5c4b\u4f01\u7747\u96fb\u8996\u3002" },
    food: { title: "\u8336\u9910\u5ef3", text: "\u5514\u8a72\uff0c\u8981\u4e00\u500b\u83e0\u863f\u5305\u3001\u51cd\u6ab8\u8336\u3002\u5c11\u751c\u3002\u57cb\u55ae\u3002" },
    ask: { title: "\u554f\u8def", text: "\u8acb\u554f\u53bb\u706b\u8eca\u7ad9\u9ede\u884c\uff1f\u4e00\u76f4\u884c\u7136\u5f8c\u8f49\u53f3\u3002\u591a\u8b1d\u3002" }
  };
  const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const blank = () => ({ view:"home", pool:"starter", articleId:"hi", knownRad:{}, correct:0, wrong:0, streak:0, lastDay:"", todayCount:0, todayDate:"", wrongBook:[], bookmarks:[], lessonsDone:{} });
  function load() { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return {}; } }
  let state = Object.assign(blank(), load());
  let drill = null, quiz = null, typed = "", timer = null, remain = 0;
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function isPc() { return window.matchMedia("(min-width: 860px)").matches; }
  function today() { return new Date().toISOString().slice(0, 10); }
  function toast(msg) { const el = $("toast"); el.hidden = false; el.textContent = msg; clearTimeout(toast._t); toast._t = setTimeout(() => { el.hidden = true; }, 1600); }
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&", "<":"<", ">":">", '"':""", "'":"&#39;" }[c])); }
  function idx() {
    const byHan = new Map(), bySc = new Map();
    (SUCHENG.chars || []).forEach((row) => {
      const han = row[0], cj = row[1], sc = (row[2] || "").toLowerCase();
      if (han.length !== 1) return;
      if (!byHan.has(han)) byHan.set(han, { han, cj, sc });
      if (!bySc.has(sc)) bySc.set(sc, []);
      bySc.get(sc).push(han);
    });
    return { byHan, bySc };
  }
  const I = idx();
  function info(han) { return I.byHan.get(han); }
  function labelCode(sc) { if (!sc) return ""; return sc.toUpperCase().split("").map((k) => (SUCHENG.map[k] || "") + k).join(" "); }
  function poolOf(name) {
    if (name === "wrong") return state.wrongBook.slice();
    if (name === "mark") return state.bookmarks.slice();
    if (name === "all") return SUCHENG.chars.map((r) => r[0]).filter((h, i, a) => a.indexOf(h) === i && I.byHan.has(h));
    return (SUCHENG[name] || SUCHENG.starter).filter((h) => I.byHan.has(h));
  }
  function pick(list) { return list.length ? list[Math.floor(Math.random() * list.length)] : null; }
  function acc() { const t = state.correct + state.wrong; return t ? Math.round((state.correct / t) * 100) : 0; }
  function bumpDay() {
    const d = today();
    if (state.todayDate !== d) { state.todayDate = d; state.todayCount = 0; }
    if (state.lastDay !== d) {
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      state.streak = state.lastDay === y ? (state.streak || 0) + 1 : 1;
      state.lastDay = d;
    }
  }
  function addToday() { bumpDay(); state.todayCount += 1; save(); syncChrome(); }
  function markRight(han) { state.correct += 1; state.wrongBook = state.wrongBook.filter((x) => x !== han); addToday(); }
  function markWrong(han) { state.wrong += 1; if (han && !state.wrongBook.includes(han)) state.wrongBook.push(han); save(); }
  function toggleMark(han) { const i = state.bookmarks.indexOf(han); if (i >= 0) state.bookmarks.splice(i, 1); else state.bookmarks.push(han); save(); }
  function finishLesson(id) { state.lessonsDone[id] = true; save(); }
  function syncChrome() {
    bumpDay();
    $("device-pill").textContent = isPc() ? "\u96fb\u8166\u7248" : "\u624b\u6a5f\u7248";
    $("goal-pill").textContent = "\u4eca\u65e5 " + state.todayCount + "/20";
    const html = TABS.map((t) => `<button type="button" data-view="${t.id}" class="${state.view === t.id || (t.id === "learn" && ["roots","rootquiz"].includes(state.view)) ? "on" : ""}">${t.icon} ${t.label}</button>`).join("");
    $("side-tabs").innerHTML = html;
    $("tabbar").innerHTML = html;
  }
  function go(view) { state.view = view; save(); render(); }
  function startDrill(pool, timed) {
    const han = pick(poolOf(pool));
    drill = han ? { han, pool, misses: 0, hint: 0, timed: !!timed, got: (drill && drill.timed && timed) ? drill.got : 0 } : null;
    typed = "";
    if (timed && !timer) {
      remain = 60;
      timer = setInterval(() => {
        remain -= 1;
        if (remain <= 0) { clearInterval(timer); timer = null; toast("\u6642\u9593\u5230\uff1a\u62c6\u5572 " + (drill ? drill.got : 0) + " \u96bb"); go("home"); }
        else if (state.view === "drill") render();
      }, 1000);
    }
  }
  function kbHtml(hintKeys) {
    const set = new Set((hintKeys || "").toUpperCase().split(""));
    return `<div class="kb">${KEYS.map((row) => `<div class="kb-row">${row.split("").map((k) => `<button type="button" class="k${set.has(k) ? " hint" : ""}" data-k="${k.toLowerCase()}"><b>${k}</b><small>${SUCHENG.map[k] || ""}</small></button>`).join("")}</div>`).join("")}</div>`;
  }
  function htmlHome() {
    const next = LESSONS.find((l) => !state.lessonsDone[l.id]) || LESSONS[0];
    return `<div class="home-grid"><section class="hero"><div class="kicker">SUCHENG / QUICK</div><h1>\u53ea\u6253\u982d\u78bc\u540c\u5c3e\u78bc<br>\u5c31\u6253\u5230\u7e41\u9ad4\u4e2d\u6587\u3002</h1><p class="lede">\u901f\u6210 = \u5009\u9821\u7c21\u5316\u7248\u3002\u300c\u6e2f\u300d\u901f\u6210 <b>\u6c34\u5c71 EU</b>\u3002\u300c\u8aaa\u300d\u901f\u6210 <b>\u535c\u5c71 YU</b>\u3002</p><div class="stats"><div class="stat"><b>${state.streak || 0}</b><span>\u9023\u7e8c\u65e5</span></div><div class="stat"><b>${state.correct || 0}</b><span>\u62c6\u5572</span></div><div class="stat"><b>${acc()}%</b><span>\u6e96\u78ba\u7387</span></div></div><p class="lede" style="margin:14px 0 0">\u4eca\u65e5\u76ee\u6a19 ${state.todayCount || 0} / 20</p></section><section class="path"><article class="path-card"><div><h3>\u7e7c\u7e8c\uff1a${esc(next.title)}</h3><p>${esc(next.blurb)}</p></div><button class="go" data-go="${next.id}">\u53bb</button></article><article class="path-card"><div><h3>\u8ab2\u7a0b\u8def\u5f91</h3><p>\u5b57\u6839 \u2192 \u55ae\u78bc \u2192 \u5e38\u7528 \u2192 \u7cb5\u8a9e \u2192 \u9650\u6642 \u2192 \u6587\u7ae0</p></div><button class="go" data-view="learn">\u53bb</button></article><article class="path-card"><div><h3>\u81ea\u7531\u62c6\u78bc</h3><p>\u5e38\u7528 / \u5168\u90e8 / \u96e3\u5b57 / \u932f\u5b57\u672c</p></div><button class="go" data-view="drill">\u53bb</button></article><article class="path-card"><div><h3>\u6587\u7ae0\u7df4\u7fd2</h3><p>\u5167\u5efa\u9999\u6e2f\u60c5\u666f</p></div><button class="go" data-view="article">\u53bb</button></article><article class="path-card"><div><h3>\u932f\u5b57\u672c ${state.wrongBook.length}</h3><p>\u6253\u932f\u81ea\u52d5\u6536</p></div><button class="go" data-view="review">\u53bb</button></article><article class="path-card"><div><h3>\u67e5\u78bc</h3><p>\u6f22\u5b57 \u2194 \u901f\u6210\uff0f\u5009\u9821</p></div><button class="go" data-view="lookup">\u53bb</button></article></section></div>`;
  }
  function htmlLearn() {
    return `<section class="panel"><div class="kicker">\u8ab2\u7a0b</div><h1>\u4e5d\u8ab2\u7531\u6dfa\u5165\u6df1</h1><div class="path">${LESSONS.map((l) => `<article class="path-card"><div><h3>${esc(l.title)} ${state.lessonsDone[l.id] ? "\u2713" : ""}</h3><p>${esc(l.blurb)}</p></div><button class="go" data-go="${l.id}">\u53bb</button></article>`).join("")}</div></section>`;
  }
  function htmlRoots() {
    return `<section class="panel"><div class="kicker">\u5b57\u6839</div><h1>\u5eff\u56db\u5b57\u6839</h1><p class="lede">X \u4fc2\u96e3\u5b57\u9375\uff0c\u6b63\u5e38\u5514\u4f7f\u6253\u982d\u5c3e\u3002</p><div class="root-grid">${"ABCDEFGHIJKLMNOPQRSTUVWY".split("").map((k) => `<div class="root"><b>${SUCHENG.map[k]}</b><span>${k} \u00b7 ${esc(SUCHENG.mnemonics[k] || "")}</span></div>`).join("")}</div><div class="row" style="margin-top:16px"><button class="btn" data-go="rootquiz">\u53bb\u6e2c\u9a57</button><button class="ghost" data-view="learn">\u8fd4\u8ab2\u7a0b</button></div></section>`;
  }
  function startQuiz() {
    const keys = "ABCDEFGHIJKLMNOPQRSTUVWY".split("");
    const ans = pick(keys); const opts = [ans];
    while (opts.length < 4) { const k = pick(keys); if (!opts.includes(k)) opts.push(k); }
    opts.sort(() => Math.random() - 0.5);
    quiz = { ans, opts, streak: (quiz && quiz.streak) || 0, n: (quiz && quiz.n) || 0 };
  }
  function htmlQuiz() {
    if (!quiz) startQuiz();
    return `<section class="panel"><div class="kicker">\u5b57\u6839\u6e2c\u9a57</div><h1>\u300c${SUCHENG.map[quiz.ans]}\u300d\u4fc2\u908a\u7c92\u9375\uff1f</h1><p class="lede">${esc(SUCHENG.mnemonics[quiz.ans] || "")} \u00b7 \u9023\u4e2d ${quiz.streak} \u6b21</p><div class="quiz-opts">${quiz.opts.map((k) => `<button type="button" data-quiz="${k}">${k}<br><small>${SUCHENG.map[k]}</small></button>`).join("")}</div></section>`;
  }
  function htmlDrill() {
    if (!drill || !info(drill.han)) startDrill(state.pool || "starter", !!(drill && drill.timed));
    if (!drill) return `<section class="panel"><p>\u5462\u500b\u5b57\u5eab\u66ab\u6642\u5187\u5b57\u3002</p></section>`;
    const row = info(drill.han);
    const hintKeys = drill.hint === 1 ? row.sc[0] : drill.hint >= 2 ? row.sc : "";
    const showAns = drill.hint >= 2 ? row.sc.toUpperCase() + " \u00b7 " + labelCode(row.sc) : drill.hint === 1 ? row.sc[0].toUpperCase() + "\u2026" : "";
    return `<div class="split"><section class="drill-card"><div class="chips">${[["starter","\u5e38\u7528"],["cantonese","\u7cb5\u8a9e"],["hard","\u96e3\u5b57"],["singles","\u55ae\u78bc"],["wrong","\u932f\u5b57\u672c"],["all","\u5168\u90e8"]].map(([id, lab]) => `<button class="chip${(state.pool||"starter")===id?" on":""}" data-pool="${id}">${lab}</button>`).join("")}</div>${drill.timed ? `<p class="lede">\u5269 ${remain}s \u00b7 \u5df2\u62c6\u5572 ${drill.got}</p>` : ""}<div class="char">${drill.han}</div><div class="meta">${drill.hint >= 2 ? "\u5009\u9821 " + row.cj.toUpperCase() : "\u932f\u4e00\u6b21\u4eae\u982d\u78bc\uff0c\u932f\u5169\u6b21\u51fa\u7b54\u6848"}</div><div class="answer">${esc(showAns)}</div><form id="drill-form"><input id="drill-in" type="text" maxlength="4" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="\u6253\u982d\u5c3e\u78bc\uff0c\u4f8b\u5982 yu" value="${esc(typed)}"></form><p class="feedback" id="drill-fb"></p><div class="row"><button class="btn" id="btn-check" type="button">\u6838\u5c0d</button><button class="ghost" id="btn-hint" type="button">\u63d0\u793a</button><button class="ghost" id="btn-skip" type="button">\u8df3\u904e</button><button class="ghost" id="btn-mark" type="button">${state.bookmarks.includes(drill.han) ? "\u5df2\u6536\u85cf" : "\u6536\u85cf"}</button></div></section><section class="panel"><p class="lede">\u96fb\u8166\u7248\u53ef\u76f4\u63a5\u7528\u9375\u76e4\u3002Esc \u7747\u7b54\u6848\u3002</p>${kbHtml(hintKeys)}</section></div>`;
  }
  function htmlType() {
    const hits = I.bySc.get(typed.toLowerCase()) || [];
    return `<div class="split"><section class="panel"><div class="kicker">\u6253\u5b57</div><h1>\u8f38\u5165\u901f\u6210\u78bc</h1><input id="type-in" type="text" maxlength="4" autocomplete="off" placeholder="\u4f8b\u5982 eu = \u6e2f" value="${esc(typed)}"><div class="cands">${hits.slice(0, 12).map((h) => `<span class="cand">${h}</span>`).join("") || "<span class='lede'>\u672a\u6709\u5c0d\u61c9\u5b57</span>"}</div></section><section class="panel">${kbHtml(typed)}</section></div>`;
  }
  function htmlArticle() {
    const art = ARTICLES[state.articleId] || ARTICLES.hi;
    if (state._ai == null) {
      const i = [...art.text].findIndex((c) => I.byHan.has(c));
      state._ai = i < 0 ? 0 : i; state._amiss = 0;
    }
    const cur = art.text[state._ai] || "";
    const row = info(cur);
    const html = [...art.text].map((ch, i) => `<span class="${i < state._ai ? "done" : i === state._ai ? "cur" : "todo"}">${esc(ch)}</span>`).join("");
    return `<div class="split"><section class="panel"><div class="chips">${Object.keys(ARTICLES).map((id) => `<button class="chip${state.articleId===id?" on":""}" data-art="${id}">${esc(ARTICLES[id].title)}</button>`).join("")}</div><div class="passage">${html}</div><form id="art-form"><input id="art-in" type="text" maxlength="4" autocomplete="off" placeholder="${row ? "\u6253 " + cur + " \u5605\u901f\u6210\u78bc" : "\u6a19\u9ede\u53ef\u8df3\u904e"}"></form></section><section class="panel"><p class="lede">${row ? cur + " \u2192 " + (state._amiss >= 2 ? row.sc.toUpperCase() + " " + labelCode(row.sc) : "\u932f\u5169\u6b21\u5148\u51fa\u63d0\u793a") : "\u6a19\u9ede\uff0f\u672a\u6536\u9304\u5b57\u53ef\u8df3\u904e"}</p>${kbHtml(state._amiss >= 1 && row ? (state._amiss >= 2 ? row.sc : row.sc[0]) : "")}<div class="row" style="margin-top:12px"><button class="ghost" id="btn-skip-art" type="button">\u8df3\u904e\u5462\u96bb</button></div></section></div>`;
  }
  function htmlReview() {
    const rowOf = (h) => { const r = info(h); return `<div class="item"><b>${h}</b><span>${r ? r.sc.toUpperCase() + " \u00b7 " + labelCode(r.sc) : ""}</span></div>`; };
    return `<section class="panel"><div class="kicker">\u8907\u7fd2</div><h1>\u932f\u5b57\u672c</h1>${state.wrongBook.length ? `<div class="list">${state.wrongBook.map(rowOf).join("")}</div><div class="row" style="margin-top:14px"><button class="btn" data-pool="wrong" data-view="drill">\u958b\u59cb\u8907\u7fd2</button></div>` : "<p class='lede'>\u672a\u6709\u932f\u5b57\u3002</p>"}<h1 style="margin-top:24px">\u6536\u85cf</h1>${state.bookmarks.length ? `<div class="list">${state.bookmarks.map(rowOf).join("")}</div>` : "<p class='lede'>\u672a\u6709\u6536\u85cf\u3002</p>"}</section>`;
  }
  function htmlLookup() {
    const q = (state._q || "").trim();
    let body = "";
    if (q) {
      if (I.byHan.has(q[0])) { const r = info(q[0]); body = `<div class="char">${q[0]}</div><p class="answer">${r.sc.toUpperCase()}</p><p class="lede">\u901f\u6210 ${labelCode(r.sc)}<br>\u5009\u9821 ${r.cj.toUpperCase()}</p>`; }
      else { const hits = I.bySc.get(q.toLowerCase()) || []; body = hits.length ? `<div class="cands">${hits.map((h) => `<span class="cand">${h}</span>`).join("")}</div>` : "<p class='lede'>\u641e\u5514\u5230\u3002</p>"; }
    }
    return `<section class="panel"><div class="kicker">\u67e5\u78bc</div><h1>\u6f22\u5b57 \u2194 \u901f\u6210</h1><input id="look-in" type="text" placeholder="\u8f38\u5165\u300c\u8aaa\u300d\u6216 yu" value="${esc(q)}">${body}<p class="lede">\u300c\u8aaa\u300d\u6b63\u78ba\u901f\u6210\u4fc2 YU\uff08\u535c\u5c71\uff09\u3002</p></section>`;
  }
  function htmlMe() {
    return `<section class="panel"><div class="kicker">\u6211</div><h1>\u9032\u5ea6</h1><div class="stats"><div class="stat"><b>${state.streak || 0}</b><span>\u9023\u7e8c\u65e5</span></div><div class="stat"><b>${state.correct || 0}</b><span>\u62c6\u5572</span></div><div class="stat"><b>${acc()}%</b><span>\u6e96\u78ba\u7387</span></div></div><p class="lede">\u932f\u5b57\u672c ${state.wrongBook.length} \u00b7 \u6536\u85cf ${state.bookmarks.length} \u00b7 \u4eca\u65e5 ${state.todayCount}/20</p><div class="row"><button class="ghost" data-view="review">\u7747\u932f\u5b57\u672c</button><button class="ghost" data-view="lookup">\u67e5\u78bc</button><button class="ghost" id="btn-reset" type="button">\u6e05\u9032\u5ea6</button></div></section>`;
  }
  function render() {
    if (state.view !== "drill" && timer && !(drill && drill.timed)) { clearInterval(timer); timer = null; }
    syncChrome();
    const fn = { home: htmlHome, learn: htmlLearn, roots: htmlRoots, rootquiz: htmlQuiz, drill: htmlDrill, timed: htmlDrill, type: htmlType, article: htmlArticle, review: htmlReview, lookup: htmlLookup, me: htmlMe }[state.view] || htmlHome;
    $("main").innerHTML = fn();
    bind();
  }
  function checkDrill() {
    if (!drill) return;
    const row = info(drill.han);
    const val = (($("drill-in") && $("drill-in").value) || typed || "").trim().toLowerCase();
    typed = val;
    if (val === row.sc) { markRight(drill.han); if (drill.timed) drill.got += 1; toast("\u5572"); startDrill(drill.pool, drill.timed); setTimeout(render, 240); }
    else { drill.misses += 1; drill.hint = Math.min(2, drill.misses); markWrong(drill.han); render(); }
  }
  function advanceArt() {
    const art = ARTICLES[state.articleId] || ARTICLES.hi;
    let i = (state._ai || 0) + 1;
    while (i < art.text.length && !I.byHan.has(art.text[i])) i += 1;
    state._ai = i; state._amiss = 0; typed = "";
    if (i >= art.text.length) { finishLesson(state.articleId === "hk" ? "article-hk" : "article-hi"); toast("\u6253\u5b8c\u4e00\u7bc7"); go("home"); }
  }
  function checkArt() {
    const art = ARTICLES[state.articleId] || ARTICLES.hi;
    const ch = art.text[state._ai];
    if (!I.byHan.has(ch)) { advanceArt(); render(); return; }
    const val = (($("art-in") && $("art-in").value) || "").trim().toLowerCase();
    if (val === info(ch).sc) { markRight(ch); advanceArt(); render(); }
    else { state._amiss = (state._amiss || 0) + 1; markWrong(ch); render(); }
  }
  function openLesson(id) {
    const l = LESSONS.find((x) => x.id === id);
    if (!l) return go("learn");
    if (l.kind === "roots") return go("roots");
    if (l.kind === "rootquiz") { quiz = null; startQuiz(); return go("rootquiz"); }
    if (l.kind === "article") { state.articleId = l.article; state._ai = null; return go("article"); }
    state.pool = l.pool || "starter"; startDrill(state.pool, l.kind === "timed"); go("drill");
  }
  function bind() {
    document.querySelectorAll("[data-view]").forEach((b) => b.onclick = () => {
      if (b.dataset.pool) state.pool = b.dataset.pool;
      if (b.dataset.view === "drill") startDrill(state.pool || "starter", false);
      if (b.dataset.view === "article") state._ai = null;
      go(b.dataset.view);
    });
    document.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => openLesson(b.dataset.go));
    document.querySelectorAll("[data-pool]").forEach((b) => { if (b.dataset.view) return; b.onclick = () => { state.pool = b.dataset.pool; startDrill(state.pool, !!(drill && drill.timed)); render(); }; });
    document.querySelectorAll("[data-art]").forEach((b) => b.onclick = () => { state.articleId = b.dataset.art; state._ai = null; render(); });
    document.querySelectorAll("[data-quiz]").forEach((b) => b.onclick = () => {
      if (b.dataset.quiz === quiz.ans) { quiz.streak += 1; quiz.n += 1; if (quiz.n >= 20) finishLesson("rootquiz"); startQuiz(); render(); }
      else { quiz.streak = 0; toast("\u5514\u5572\uff0c\u6b63\u78ba\u4fc2 " + quiz.ans); }
    });
    document.querySelectorAll("[data-k]").forEach((b) => b.onclick = () => {
      typed = (typed + b.dataset.k).slice(-4);
      const box = $("drill-in") || $("type-in") || $("art-in");
      if (box) box.value = typed;
      if (state.view === "type") render();
    });
    if ($("drill-in")) { $("drill-in").focus(); $("drill-in").oninput = () => { typed = $("drill-in").value.toLowerCase(); }; $("drill-form").onsubmit = (e) => { e.preventDefault(); checkDrill(); }; }
    if ($("btn-check")) $("btn-check").onclick = checkDrill;
    if ($("btn-hint")) $("btn-hint").onclick = () => { if (drill) { drill.hint = Math.min(2, (drill.hint || 0) + 1); render(); } };
    if ($("btn-skip")) $("btn-skip").onclick = () => { startDrill(drill.pool, drill.timed); render(); };
    if ($("btn-mark")) $("btn-mark").onclick = () => { toggleMark(drill.han); render(); };
    if ($("type-in")) { $("type-in").focus(); $("type-in").oninput = () => { typed = $("type-in").value.toLowerCase(); render(); $("type-in").focus(); $("type-in").value = typed; }; }
    if ($("look-in")) { $("look-in").focus(); $("look-in").oninput = () => { state._q = $("look-in").value; render(); const n = $("look-in"); if (n) { n.focus(); n.value = state._q; } }; }
    if ($("art-in")) { $("art-in").focus(); $("art-form").onsubmit = (e) => { e.preventDefault(); checkArt(); }; }
    if ($("btn-skip-art")) $("btn-skip-art").onclick = () => { advanceArt(); render(); };
    if ($("btn-reset")) $("btn-reset").onclick = () => { if (confirm("\u6e05\u6652\u672c\u5730\u9032\u5ea6\uff1f")) { state = blank(); save(); render(); } };
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drill && state.view === "drill") { drill.hint = 2; render(); } });
  window.addEventListener("resize", () => syncChrome());
  if (!window.SUCHENG || !SUCHENG.chars) { $("main").innerHTML = "<p class='boot-err'>\u5b57\u5eab\u8f09\u5165\u5931\u6557</p>"; return; }
  render();
})();
