(function () {
  const S = window.SUCHENG;
  S.mnemonics = {
    A:"太陽／日字旁", B:"月亮／肉月旁", C:"金屬／八字頭", D:"樹木／木字旁",
    E:"水滴／三點水", F:"火焰／四點火", G:"土地／土字旁", H:"竹葉／撇",
    I:"戈矛／點、廣", J:"十字／寶蓋", K:"大人／交叉", L:"中間一竪",
    M:"橫一／廠字頭", N:"彎弓／竪鉤", O:"人字／單人旁", P:"心形／竪心",
    Q:"手掌／提手旁", R:"嘴巴", S:"屍／框", T:"二十／草字頭",
    U:"山峰", V:"女子", W:"田字格", Y:"卜卦／走之底", X:"難字鍵"
  };
  S.cantonese = ["嘅","喺","啲","咩","嘢","呢","嗰","唔","冇","乜","睇","聽","講","傾","返","去","買","搞","掂","咪"];
  S.singles = ["日","月","金","木","水","火","土","竹","戈","十","大","中","一","弓","人","心","手","口","尸","廿","山","女","田","卜"];
  const extra = [
    ["今","oin","on"],["天","mk","mk"],["氣","onfd","od"],["請","yrqmb","yb"],
    ["幾","vihi","vi"],["點","wfyr","wr"],["分","csh","ch"],["午","oj","oj"],
    ["夜","yonk","yk"],["搭","qtor","qr"],["租","hdbm","hm"],["加","ksr","kr"],
    ["冰","ime","ie"],["美","tgk","tk"],["幫","gihab","gb"],["護","yrtoe","ye"],
    ["警","tkymr","tr"],["察","jbof","jf"],["消","efb","eb"],["局","ssr","sr"],
    ["郵","hmnl","hl"],["圖","wrjw","ww"],["書","lga","la"],["館","oijrr","or"],
    ["貨","opbuc","oc"],["辦","yjksj","yj"],["處","yphen","yn"],["廈","imue","ie"],
    ["呀","rmvh","rh"],["未","jd","jd"],["細","vfw","vw"],["路","rmher","rr"],
    ["記","yrsu","yu"],["清","eqmb","eb"],["楚","ddnyo","do"],["忙","pyv","pv"],
    ["晒","amcw","aw"],["嚙","rhhe","re"],["先","hghu","hu"],["至","mig","mg"],
    ["咪","rfd","rd"],["急","nmp","np"],["啦","rqyt","rt"],["再","mgb","mb"],
    ["鍾","chjg","cg"],["鐘","cytg","cg"]
  ];
  extra.forEach((row) => S.chars.push(row));
})();

window.LESSONS = [
  { id:"roots", title:"① 廿四字根", blurb:"先認鍵盤：一鍵一個字根。記住先，先好拆字。", kind:"roots", goal:24 },
  { id:"rootquiz", title:"② 字根測驗", blurb:"睇字根擇鍵、睇鍵擇字根。連中三次當記住。", kind:"rootquiz", goal:20 },
  { id:"singles", title:"③ 單碼字", blurb:"字根本身就係字：日=A、水=E。打一至兩下同一個鍵。", kind:"drill", pool:"singles", goal:24 },
  { id:"easy2", title:"④ 兩碼常用", blurb:"明=日月 AB、好=女子 VD。頭尾兩碼。", kind:"drill", pool:"starter", goal:30 },
  { id:"cantonese", title:"⑤ 粵語口語字", blurb:"嘅喺啲咩嘢唔冇乜睇。香港日常先練呢批。", kind:"drill", pool:"cantonese", goal:20 },
  { id:"hard", title:"⑥ 難拆字", blurb:"長碼字只取頭尾。睇完倉頡全碼再縮。", kind:"drill", pool:"hard", goal:20 },
  { id:"timed", title:"⑦ 六十秒衝刺", blurb:"一分鐘拆幾多隻。練肌肉記憶，唔好諗太耐。", kind:"timed", pool:"starter", secs:60 },
  { id:"article-hi", title:"⑧ 文章：打招呼", blurb:"整句打。錯兩次先出提示，學打字練習簿。", kind:"article", article:"hi" },
  { id:"article-hk", title:"⑨ 文章：香港生活", blurb:"地鐵、茶餐廳、問路。貼近日常用字。", kind:"article", article:"hk" }
];

window.ARTICLES = {
  hi: { title: "打招呼", text: "你好。請問而家幾點？唔該晒。對唔住。多謝你幫手。再見。" },
  hk: { title: "香港生活", text: "我喺香港住。朝早搭地鐵去公司。中午食飯飲茶。夜晚返屋企睇電視。" },
  food: { title: "茶餐廳", text: "唔該，要一個菠蘿包、凍檸茶。少甜。埋單。" },
  ask: { title: "問路", text: "請問去火車站點行？一直行然後轉右。多謝。" }
};
