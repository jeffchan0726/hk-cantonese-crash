(function () {
  var C = window.SUCHENG = window.SUCHENG || {};
  C.chars = C.chars || [];
  C.starter = C.chars.slice(0, 80).map(function (r) { return r[0]; });
  C.hard = C.chars.filter(function (r) { return String(r[1] || "").length >= 4; }).slice(0, 120).map(function (r) { return r[0]; });
  var canto = ["嘅", "喺", "咯", "冇", "係", "哋", "嗰", "嚟", "咁", "啲", "嘢", "啦", "喎", "噉", "咩", "㗎", "嗱", "啱", "掟", "攞", "搵", "諗", "睇", "食", "飯", "飲", "茶", "撳", "掣", "靚", "晒", "搞", "掂", "多", "謝", "唔", "該", "阿", "叔", "壓", "力", "港", "香", "粵", "街"];
  var have = {};
  C.chars.forEach(function (r) { have[r[0]] = 1; });
  C.cantonese = canto.filter(function (h) { return have[h]; });
})();
