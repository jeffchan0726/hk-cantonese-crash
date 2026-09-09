(function () {
  if (!window.SUCHENG || !SUCHENG.chars) return;
  var extra = [
    ["哋","rgpd","rd"],["專","jidi","ji"],["業","tctd","td"],["揵","qwot","qt"],
    ["花","top","tp"],["真","jbmc","jc"],["報","gjsle","ge"],["壓","mkg","mg"],
    ["力","ks","ks"],["咇","rkm","rm"],["坐","oog","og"],["管","hjrr","hr"],
    ["嚙","rhhe","re"],["佢","oss","os"],["阿","nlmnr","nr"],["叔","yfe","ye"],
    ["梗","dmlk","dk"],["喇","rdln","rn"],["班","mgilg","mg"],["連","yjwj","yj"],
    ["高","ybrr","yr"],["登","nomrt","nt"],["膠","bsmh","bh"],["放","ysok","yk"],
    ["假","orye","oe"],["戲","yti","yi"],["情","pqmb","pb"],["歌","mrno","mo"],
    ["散","tbok","tk"],["頂","mnmbc","mc"],["勁","mmks","ms"],["打","qmn","qn"],
    ["低","ohpm","om"]
  ];
  extra.forEach(function (row) { SUCHENG.chars.push(row); });
  SUCHENG.cantonese = (SUCHENG.cantonese || []).concat(
    ["哋","佢","嚙","咇","喇","真","花","專","業","揵","報","壓","力","阿","叔","梗","班","膠","散","打"]
  );
})();
