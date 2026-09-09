(function () {
  function extras() {
    if (!window.SUCHENG || !SUCHENG.chars) return;
    var seen = {};
    var clean = [];
    SUCHENG.chars.forEach(function (row) {
      if (!row || !row[0]) return;
      row[1] = String(row[1] || "").replace(/\s+/g, "").toLowerCase();
      row[2] = String(row[2] || "").replace(/\s+/g, "").toLowerCase();
      if (row[0].length !== 1) return;
      if (seen[row[0]]) return;
      seen[row[0]] = 1;
      clean.push(row);
    });
    SUCHENG.chars = clean;
    SUCHENG.starter = clean.slice(0, 80).map(function (r) { return r[0]; });
    SUCHENG.hard = clean.filter(function (r) { return String(r[1] || "").length >= 4; }).slice(0, 120).map(function (r) { return r[0]; });
    var canto = ["嘅","喺","咗","冇","係","哋","嗰","嚟","咁","啲","嘢","啦","喎","噉","咩","㗎","嗱","啱","掟","攞","搵","諗","睇","食","飯","飲","茶","撳","掣","靚","晒","搞","掂","多","謝","唔","該","阿","叔","壓","力","港","香","粵","街"];
    SUCHENG.cantonese = canto.filter(function (h) { return seen[h]; });
    window.__BANK_N = clean.length;
  }
  function bootApp() {
    extras();
    var a = document.createElement("script");
    a.src = "js/app.js?v=26";
    document.body.appendChild(a);
  }
  var ticks = 0;
  function wait() {
    var n = (window.SUCHENG && SUCHENG.chars && SUCHENG.chars.length) || 0;
    if (window.__BANK_READY || n >= 2500) { bootApp(); return; }
    ticks += 1;
    if (ticks > 40 && n >= 400) { bootApp(); return; }
    if (ticks > 80 && n > 0) { bootApp(); return; }
    setTimeout(wait, 50);
  }
  wait();
})();
