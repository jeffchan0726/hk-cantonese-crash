(function () {
  function extras() {
    if (!window.SUCHENG || !SUCHENG.chars) return;
    SUCHENG.chars.forEach(function (row) {
      if (!row) return;
      row[1] = String(row[1] || "").replace(/\s+/g, "").toLowerCase();
      row[2] = String(row[2] || "").replace(/\s+/g, "").toLowerCase();
    });
  }
  function bootApp() {
    extras();
    var a = document.createElement("script");
    a.src = "js/app.js?v=23";
    document.body.appendChild(a);
  }
  bootApp();
})();
