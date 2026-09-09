(function () {
  window.SUCHENG = window.SUCHENG || {};
  SUCHENG.chars = SUCHENG.chars || [];
  window.__BANK_READY = false;
  var left = 30;
  function done() {
    left -= 1;
    if (left <= 0) window.__BANK_READY = true;
  }
  for (var i = 0; i < 30; i++) {
    var s = document.createElement("script");
    var id = (i < 10 ? "0" : "") + i;
    s.src = "js/p" + id + ".js?v=25";
    s.onload = done;
    s.onerror = done;
    document.head.appendChild(s);
  }
})();
