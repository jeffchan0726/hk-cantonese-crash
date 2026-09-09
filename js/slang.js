(function () {
  function extras() {
    if (!window.SUCHENG || !SUCHENG.chars) return;
    SUCHENG.chars.forEach(function (row) {
      if (!row) return;
      row[1] = String(row[1] || "").replace(/\s+/g, "").toLowerCase();
      row[2] = String(row[2] || "").replace(/\s+/g, "").toLowerCase();
    });
    var extra = [
      ["港","etcu","eu"],["哔","rgpd","rd"],["專","jidi","ji"],["業","tctd","td"],["掴","qwot","qt"],
      ["花","top","tp"],["真","jbmc","jc"],["報","gjsle","ge"],["壓","mkg","mg"],
      ["力","ks","ks"],["咇","rph","rh"],["坐","oog","og"],["管","hjrr","hr"],
      ["齩","rhhe","re"],["佢","oss","os"],["阿","nlmnr","nr"],["叔","yfe","ye"],
      ["梗","dmlk","dk"],["喇","rdln","rn"],["班","mghlg","mg"],["連","yjwj","yj"],
      ["高","yrbr","yr"],["登","nomrt","nt"],["膠","bsmh","bh"],["放","ysok","yk"],
      ["假","orye","oe"],["戲","yti","yi"],["情","pqmb","pb"],["歌","mrno","mo"],
      ["散","tbok","tk"],["頂","mnmbc","mc"],["勁","mmks","ms"],["打","qmn","qn"],
      ["低","ohpm","om"],["車","jwj","jj"],["線","vfhae","ve"],["馬","sqsf","sf"],
      ["質","hlbuc","hc"],["喺","rohf","rf"],["嘅","raiu","ru"],["唔","rmmr","rr"]
    ];
    extra.forEach(function (row) {
      var exists = SUCHENG.chars.some(function (r) { return r[0] === row[0]; });
      if (!exists) SUCHENG.chars.push(row);
    });
    SUCHENG.cantonese = (SUCHENG.cantonese || []).concat(
      ["哔","佢","齩","咇","喇","真","花","專","業","掴","報","壓","力","阿","叔","梗","班","膠","散","打","港","喺","嘅","唔"]
    );
  }
  function bootApp() {
    extras();
    var a = document.createElement("script");
    a.src = "js/app.js?v=18";
    document.body.appendChild(a);
  }
  if (!window.SUCHENG || !SUCHENG.chars || SUCHENG.chars.length < 1000) {
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/gh/jeffchan0726/hk-cantonese-crash@2c4a94f56b2d5e77dca32b2f715382d9490b25fa/js/data.js";
    s.onload = bootApp;
    s.onerror = bootApp;
    document.head.appendChild(s);
  } else {
    bootApp();
  }
})();
