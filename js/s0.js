(function () {
  window.SUCHENG = window.SUCHENG || {};
  SUCHENG.chars = SUCHENG.chars || [];
  if ((SUCHENG.chars && SUCHENG.chars.length) >= 2500) {
    window.__BANK_READY = true;
    window.__BANK_N = SUCHENG.chars.length;
  }
})();
