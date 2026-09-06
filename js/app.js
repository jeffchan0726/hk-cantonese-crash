const STORE = "sucheng-hk-v1";
const state = { view: "home", i: 0, mode: "starter", typed: "", picked: [], rootCat: "ALL" };

function load() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch { return {}; }
}
function save(patch) {
  const cur = Object.assign({
    knownRad: {}, correct: 0, wrong: 0, streak: 0, lastDay: "", typedChars: 0
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
  const streak = p.lastDay === y.toISOString().slice(0, 10) ? (p.streak || 0) + 1 : 1;
  return save({ streak, lastDay: d });
}
function $(id) { return document.getElementById(id); }
function go(v) { state.view = v; render(); }
function acc(p) {
  const t = (p.correct || 0) + (p.wrong || 0);
  return t ? Math.round((p.correct / t) * 100) : 0;
}
function idx() {
  if (!SUCHENG._idx) {
    const byHan = {}, bySc = {};
    SUCHENG.chars.forEach((row) => {
      const [han, cj, sc] = row;
      if (!byHan[han]) byHan[han] = { han, cj, sc };
      if (!bySc[sc]) bySc[sc] = [];
      if (bySc[sc].length < 48) bySc[sc].push(han);
    });
    SUCHENG._idx = { byHan, bySc };
  }
  return SUCHENG._idx;
}
function labelCode(code) {
  return String(code || "").toUpperCase().split("").map((k) => (SUCHENG.map[k] || k) + k).join(" ");
}
function pool() {
  if (state.mode === "hard") return SUCHENG.hard.filter((h) => idx().byHan[h]);
  if (state.mode === "all") return SUCHENG.chars.map((x) => x[0]);
  return SUCHENG.starter.filter((h) => idx().byHan[h]);
}

function render() {
  document.querySelectorAll(".view").forEach((el) => el.classList.add("hidden"));
  const el = $("view-" + state.view);
  if (el) el.classList.remove("hidden");
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.view === state.view));
  ({ home: renderHome, roots: renderRoots, drill: renderDrill, type: renderType, lookup: renderLookup, me: renderMe }[state.view] || renderHome)();
}

function renderHome() {
  const p = bumpStreak();
  $("stat-streak").textContent = p.streak || 0;
  $("stat-ok").textContent = p.correct || 0;
  $("stat-acc").textContent = acc(p) + "%";
  $("go-roots").onclick = () => go("roots");
  $("go-drill").onclick = () => { state.mode = "starter"; state.i = 0; go("drill"); };
  $("go-type").onclick = () => go("type");
  $("go-hard").onclick = () => { state.mode = "hard"; state.i = 0; go("drill"); };
  $("go-lookup").onclick = () => go("lookup");
}

function renderRoots() {
  const p = load();
  const cats = [["全部", "ALL"]].concat((SUCHENG.cats || []).map((c) => [c[0], c[1]]));
  $("root-cats").innerHTML = cats.map(([name, key]) =>
    `<button class="chip ${state.rootCat === key ? "on" : ""}" data-cat="${key}">${name}</button>`
  ).join("");
  $("root-cats").querySelectorAll("button").forEach((b) => {
    b.onclick = () => { state.rootCat = b.dataset.cat; renderRoots(); };
  });
  const keys = Object.keys(SUCHENG.map).filter((k) => state.rootCat === "ALL" || state.rootCat.includes(k));
  $("root-grid").innerHTML = keys.map((k) => {
    const on = p.knownRad[k] ? "known" : "";
    return `<button class="root ${on}" data-k="${k}"><b>${k}</b><span>${SUCHENG.map[k]}</span><i>${SUCHENG.aux[k] || ""}</i></button>`;
  }).join("");
  $("root-grid").querySelectorAll("button").forEach((b) => {
    b.onclick = () => {
      const cur = save();
      cur.knownRad[b.dataset.k] = !cur.knownRad[b.dataset.k];
      localStorage.setItem(STORE, JSON.stringify(cur));
      renderRoots();
    };
  });
  const n = Object.keys(p.knownRad || {}).filter((k) => p.knownRad[k]).length;
  $("root-hint").textContent = "撚過變綠。已記 " + n + " / 25。速成用呢啲字根，只取頭尾兩碼。";
}

function renderDrill() {
  document.querySelectorAll("#drill-modes .chip").forEach((c) => {
    c.classList.toggle("on", c.dataset.mode === state.mode);
    c.onclick = () => { state.mode = c.dataset.mode; state.i = 0; renderDrill(); };
  });
  const list = pool();
  if (!list.length) return;
  if (state.i >= list.length) state.i = 0;
  const han = list[state.i];
  const rec = idx().byHan[han];
  $("drill-char").textContent = han;
  const label = state.mode === "hard" ? "難字" : state.mode === "all" ? "全部" : "常用";
  $("drill-meta").textContent = label + "  " + (state.i + 1) + "/" + list.length;
  $("drill-ans").textContent = "";
  $("drill-input").value = "";
  $("drill-input").focus();
  $("drill-show").onclick = () => {
    $("drill-ans").innerHTML = `<b>${rec.sc.toUpperCase()}</b>　${labelCode(rec.sc)}<div class="tiny">倉頭全碼 ${rec.cj.toUpperCase()}　${labelCode(rec.cj)}</div>`;
  };
  $("drill-next").onclick = () => { state.i += 1; renderDrill(); };
  $("drill-form").onsubmit = (e) => {
    e.preventDefault();
    const guess = $("drill-input").value.trim().toLowerCase().replace(/[^a-z]/g, "");
    const ok = guess === rec.sc;
    const p = save();
    save({ correct: (p.correct || 0) + (ok ? 1 : 0), wrong: (p.wrong || 0) + (ok ? 0 : 1) });
    $("drill-ans").innerHTML = ok
      ? `<span class="ok">啲！</span> ${rec.sc.toUpperCase()}　${labelCode(rec.sc)}`
      : `<span class="bad">唔係 ${guess.toUpperCase() || "空白"}</span> → <b>${rec.sc.toUpperCase()}</b>　${labelCode(rec.sc)}<div class="tiny">倉頭 ${rec.cj.toUpperCase()}</div>`;
    if (ok) setTimeout(() => { state.i += 1; renderDrill(); }, 450);
  };
}

function renderType() {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  $("kb").innerHTML = rows.map((row) => `<div class="kb-row">${[...row].map((k) => {
    const rad = SUCHENG.map[k];
    const on = state.typed.toUpperCase().includes(k) ? "on" : "";
    return `<button type="button" class="key ${on}" data-k="${k}" ${rad ? "" : "disabled"}>${k}<i>${rad || ""}</i></button>`;
  }).join("")}</div>`).join("");
  $("kb").querySelectorAll("button[data-k]").forEach((b) => {
    b.onclick = () => {
      if (state.typed.length >= 2) state.typed = "";
      state.typed += b.dataset.k.toLowerCase();
      renderType();
    };
  });
  const code = state.typed.toLowerCase();
  $("code-now").textContent = code ? code.toUpperCase() + "　" + labelCode(code) : "未入碼";
  const list = code ? (idx().bySc[code] || []) : [];
  $("cands").innerHTML = list.slice(0, 24).map((han, i) =>
    `<button type="button" class="cand" data-h="${han}"><em>${i + 1}</em>${han}</button>`
  ).join("") || (code ? "<span class='tiny'>呢個碼字庫未收</span>" : "");
  $("cands").querySelectorAll("button").forEach((b) => {
    b.onclick = () => {
      state.picked.push(b.dataset.h);
      state.typed = "";
      const p = save();
      save({ typedChars: (p.typedChars || 0) + 1 });
      renderType();
    };
  });
  $("out").textContent = state.picked.join("") || "打頭尾碼，再擬字";
  $("type-clear").onclick = () => { state.typed = ""; state.picked = []; renderType(); };
  $("type-bs").onclick = () => {
    if (state.typed) state.typed = state.typed.slice(0, -1);
    else state.picked.pop();
    renderType();
  };
  $("type-space").onclick = () => { state.typed = ""; renderType(); };
  $("copy-out").onclick = () => {
    const t = state.picked.join("");
    if (t) navigator.clipboard.writeText(t);
  };
}

function renderLookup() {
  const q = ($("q").value || "").trim();
  const box = $("look-res");
  if (!q) { box.innerHTML = "<p class='tiny'>輸入漢字或者速成碼（一至兩個英文字母）</p>"; return; }
  const low = q.toLowerCase();
  if (/^[a-z]{1,2}$/.test(low)) {
    const list = idx().bySc[low] || [];
    box.innerHTML = `<p>${low.toUpperCase()}　${labelCode(low)}　${list.length} 字</p><div class="wrap">${list.map((h) => `<b>${h}</b>`).join(" ")}</div>`;
    return;
  }
  box.innerHTML = [...q].map((ch) => {
    const rec = idx().byHan[ch];
    if (!rec) return `<div class="look-item"><b>${ch}</b> 未收錄</div>`;
    return `<div class="look-item"><b>${ch}</b><div>速成 <strong>${rec.sc.toUpperCase()}</strong>　${labelCode(rec.sc)}</div><div class="tiny">倉頭 ${rec.cj.toUpperCase()}　${labelCode(rec.cj)}</div></div>`;
  }).join("");
}

function renderMe() {
  const p = save();
  $("me-streak").textContent = (p.streak || 0) + " 日";
  $("me-ok").textContent = p.correct || 0;
  $("me-acc").textContent = acc(p) + "%";
  $("me-type").textContent = p.typedChars || 0;
  $("me-n").textContent = (SUCHENG.chars || []).length;
  $("reset").onclick = () => { if (confirm("清進度？")) { localStorage.removeItem(STORE); render(); } };
}

window.addEventListener("DOMContentLoaded", () => {
  save();
  document.querySelectorAll(".tab").forEach((t) => { t.onclick = () => go(t.dataset.view); });
  $("q").addEventListener("input", renderLookup);
  $("brand-btn").onclick = () => go("me");
  document.addEventListener("keydown", (e) => {
    if (state.view === "drill") {
      if (e.key === "Escape") { $("drill-show").click(); }
      return;
    }
    if (state.view !== "type") return;
    if (e.key === "Backspace") { e.preventDefault(); $("type-bs").click(); return; }
    if (e.key === " ") { e.preventDefault(); $("type-space").click(); return; }
    const k = e.key.toUpperCase();
    if (SUCHENG.map[k]) {
      e.preventDefault();
      if (state.typed.length >= 2) state.typed = "";
      state.typed += k.toLowerCase();
      renderType();
    }
    if (/^[1-9]$/.test(e.key)) {
      const btns = $("cands").querySelectorAll("button");
      const n = Number(e.key) - 1;
      if (btns[n]) btns[n].click();
    }
  });
  render();
});
