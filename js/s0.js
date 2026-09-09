(function () {
  window.SUCHENG = window.SUCHENG || {};
  SUCHENG.chars = SUCHENG.chars || [];
  window.__BANK_READY = false;
  var i = 0, N = 30;
  function step() {
    if (i >= N) { window.__BANK_READY = true; return; }
    var s = document.createElement("script");
    var id = (i < 10 ? "0" : "") + i;
    s.src = "js/p" + id + ".js?v=23";
    s.onload = function () { i += 1; step(); };
    s.onerror = function () { i += 1; step(); };
    document.head.appendChild(s);
  }
  step();
})();
