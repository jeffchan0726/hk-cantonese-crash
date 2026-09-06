/* 開口講 — 香港廣東話速成內容 */
window.CANTO = {
  tones: [
    { n: 1, name: "陰平", contour: "高平", ex: "詩", jyut: "si1", tip: "高而平，好似唱高音拉長" },
    { n: 2, name: "陰上", contour: "高升", ex: "史", jyut: "si2", tip: "由中升到高，好似問句尾音" },
    { n: 3, name: "陰去", contour: "中平", ex: "試", jyut: "si3", tip: "中間高度，平平哋" },
    { n: 4, name: "陽平", contour: "低降", ex: "時", jyut: "si4", tip: "低同向下沉" },
    { n: 5, name: "陽上", contour: "低升", ex: "市", jyut: "si5", tip: "由低輕輕升" },
    { n: 6, name: "陽去", contour: "低平", ex: "是", jyut: "si6", tip: "低而平，唔好升" }
  ],
  toneQuiz: [
    { han: "詩", jyut: "si1", tone: 1 }, { han: "史", jyut: "si2", tone: 2 }, { han: "試", jyut: "si3", tone: 3 },
    { han: "時", jyut: "si4", tone: 4 }, { han: "市", jyut: "si5", tone: 5 }, { han: "是", jyut: "si6", tone: 6 },
    { han: "夫", jyut: "fu1", tone: 1 }, { han: "苦", jyut: "fu2", tone: 2 }, { han: "副", jyut: "fu3", tone: 3 },
    { han: "扶", jyut: "fu4", tone: 4 }, { han: "婦", jyut: "fu5", tone: 5 }, { han: "父", jyut: "fu6", tone: 6 },
    { han: "衣", jyut: "ji1", tone: 1 }, { han: "倚", jyut: "ji2", tone: 2 }, { han: "意", jyut: "ji3", tone: 3 },
    { han: "而", jyut: "ji4", tone: 4 }, { han: "耳", jyut: "ji5", tone: 5 }, { han: "二", jyut: "ji6", tone: 6 }
  ],
  particles: [
    { han: "啦", jyut: "laa1", mean: "建議／催促／完成", eg: "走啦！", note: "軟化命令，好常用" },
    { han: "喎", jyut: "wo3", mean: "新資訊／原來如此", eg: "原來你嚟咗喎。", note: "帶少少驚訝" },
    { han: "啲", jyut: "ze1", mean: "不過如此、減輕", eg: "玩吓啲。", note: "「只是而已」" },
    { han: "囉", jyut: "lo1", mean: "理所當然", eg: "係囉。", note: "認同對方" },
    { han: "吓", jyut: "haa5", mean: "試吓／輕微", eg: "等我睇吓。", note: "動作加「吓」變輕" },
    { han: "咋", jyut: "zaa3", mean: "僅僅、只有", eg: "得三個咋。", note: "強調數量少" },
    { han: "嘅", jyut: "ge3", mean: "的／強調", eg: "我嘅電話。", note: "口語「的」" },
    { han: "呀", jyut: "aa3", mean: "語氣緩和", eg: "係呀。", note: "打招呼、回應都用" },
    { han: "喺", jyut: "hai2", mean: "在", eg: "我喺東涌。", note: "位置介詞，唔用「在」" },
    { han: "嚟", jyut: "lai4", mean: "來", eg: "你幾時嚟？", note: "口語「來」" }
  ],
  lessons: [
    { id: 1, emoji: "👋", title: "打招呼", goal: "見面同自我介紹", mins: 8, point: "香港好少講「你好嗎」，多數「你好呀／近排點」。", lines: [
      { han: "你好呀。", jyut: "nei5 hou2 aa3", en: "Hi.", ok: ["你好", "你好呀", "哈囉"] },
      { han: "我叫 Jeff。", jyut: "ngo5 giu3 Jeff", en: "My name is Jeff.", ok: ["我叫", "我嘅名"] },
      { han: "近排點呀？", jyut: "gan6 paai4 dim2 aa3", en: "How have you been?", ok: ["近排點", "最近點"] },
      { han: "幾好呀，你呢？", jyut: "gei2 hou2 aa3, nei5 ne1", en: "Pretty good, you?", ok: ["幾好", "都幾好"] },
      { han: "多謝。", jyut: "do1 ze6", en: "Thank you (gift / big help).", ok: ["多謝"] },
      { han: "唔該。", jyut: "m4 goi1", en: "Thanks / excuse me (service).", ok: ["唔該"] }
    ]},
    { id: 2, emoji: "🙏", title: "唔該同對唔住", goal: "禮貌三件套", mins: 7, point: "服務場合用「唔該」；收禮物用「多謝」。", lines: [
      { han: "唔該借歪。", jyut: "m4 goi1 ze3 waai1", en: "Excuse me, coming through.", ok: ["唔該借歪", "借歪"] },
      { han: "對唔住。", jyut: "deoi3 m4 zyu6", en: "Sorry.", ok: ["對唔住", "唔好意思"] },
      { han: "唔好意思。", jyut: "m4 hou2 ji3 si1", en: "Excuse me / sorry.", ok: ["唔好意思"] },
      { han: "唔使客氣。", jyut: "m4 sai2 haak3 hei3", en: "You're welcome.", ok: ["唔使客氣", "唔使"] },
      { han: "麻煩你。", jyut: "maa4 faan4 nei5", en: "Could I trouble you…", ok: ["麻煩你"] }
    ]},
    { id: 3, emoji: "🔢", title: "數字同錢", goal: "報價、電話、幾多錢", mins: 10, point: "10 讀「sap6」；塊錢口語「蚊」。", lines: [
      { han: "幾多錢呀？", jyut: "gei2 do1 cin2 aa3", en: "How much is it?", ok: ["幾多錢", "幾錢"] },
      { han: "二十蚊。", jyut: "ji6 sap6 man1", en: "Twenty dollars.", ok: ["二十蚊", "廿蚊"] },
      { han: "可唔可以平啲？", jyut: "ho2 m4 ho2 ji5 peng4 di1", en: "Can it be cheaper?", ok: ["平啲", "可唔可以平"] },
      { han: "我個電話係…", jyut: "ngo5 go3 din6 waa2 hai6", en: "My number is…", ok: ["電話"] },
      { han: "找錢，唔該。", jyut: "zaau2 cin2, m4 goi1", en: "Change, please.", ok: ["找錢"] }
    ]},
    { id: 4, emoji: "🚇", title: "問路同港鐵", goal: "問站、轉車、出口", mins: 9, point: "東涌 Tung Chung 讀 dung1 cung1。", lines: [
      { han: "請問東涌點去？", jyut: "cing2 man6 dung1 cung1 dim2 heoi3", en: "How do I get to Tung Chung?", ok: ["東涌點去", "點去東涌"] },
      { han: "搭港鐵啦。", jyut: "daap3 gong2 tit3 laa1", en: "Take the MTR.", ok: ["搭港鐵"] },
      { han: "要轉車嗎？", jyut: "jiu3 zyun3 ce1 maa3", en: "Do I need to transfer?", ok: ["轉車"] },
      { han: "去邊個出口？", jyut: "heoi3 bin1 go3 ceot1 hau2", en: "Which exit?", ok: ["邊個出口", "出口"] },
      { han: "唔該，呢度係咪旺角？", jyut: "m4 goi1, ni1 dou6 hai6 mai6 wong6 gok3", en: "Is this Mong Kok?", ok: ["係咪旺角", "旺角"] }
    ]},
    { id: 5, emoji: "🍽️", title: "茶餐廳落單", goal: "叫飲、叫餐、埋單", mins: 10, point: "走甜 = no sugar；凍／熱要講清楚。", lines: [
      { han: "唔該，凍檪茶。", jyut: "m4 goi1, dung3 ning4 caa4", en: "Iced lemon tea, please.", ok: ["凍檪茶"] },
      { han: "奶茶走甜。", jyut: "naai5 caa4 zau2 tim4", en: "Milk tea, no sugar.", ok: ["奶茶走甜", "走甜"] },
      { han: "要個菠蘿包。", jyut: "jiu3 go3 bo1 lo4 baau1", en: "A pineapple bun.", ok: ["菠蘿包"] },
      { han: "少冰，唔該。", jyut: "siu2 bing1, m4 goi1", en: "Less ice, please.", ok: ["少冰"] },
      { han: "埋單，唔該。", jyut: "maai4 daan1, m4 goi1", en: "Bill, please.", ok: ["埋單"] }
    ]},
    { id: 6, emoji: "🛒", title: "超市同街市", goal: "買餾、問有冇", mins: 8, point: "「有冇」= do you have。", lines: [
      { han: "有冇菜心？", jyut: "jau5 mou5 coi3 sam1", en: "Do you have choy sum?", ok: ["有冇菜心", "菜心"] },
      { han: "呢啲幾錢一斤？", jyut: "ni1 di1 gei2 cin2 jat1 gan1", en: "How much per catty?", ok: ["幾錢一斤", "一斤"] },
      { han: "要兩斤。", jyut: "jiu3 loeng5 gan1", en: "Two catties.", ok: ["兩斤"] },
      { han: "可唔可以擁？", jyut: "ho2 m4 ho2 ji5 gaan2", en: "Can I choose?", ok: ["可唔可以擁"] },
      { han: "唔該袋埋。", jyut: "m4 goi1 doi6 maai4", en: "Bag it up, please.", ok: ["袋埋"] }
    ]},
    { id: 7, emoji: "🕐", title: "時間同預約", goal: "講鐘數、約人", mins: 8, point: "而家 = now；陣間 = later today。", lines: [
      { han: "而家幾點？", jyut: "ji4 gaa1 gei2 dim2", en: "What time is it now?", ok: ["而家幾點", "幾點"] },
      { han: "尋日／今日／聽日。", jyut: "cam4 jat6 / gam1 jat6 / ting1 jat6", en: "Yesterday / today / tomorrow.", ok: ["今日", "聽日", "尋日"] },
      { han: "陣間得唔得？", jyut: "zan6 gaan1 dak1 m4 dak1", en: "Is later OK?", ok: ["陣間"] },
      { han: "我想約星期三。", jyut: "ngo5 soeng2 joek3 sing1 kei4 saam1", en: "I want to book Wednesday.", ok: ["約星期三", "星期三"] },
      { han: "遲到十分鐘。", jyut: "ci4 dou3 sap6 fan1 zung1", en: "10 minutes late.", ok: ["遲到"] }
    ]},
    { id: 8, emoji: "🌧️", title: "天氣", goal: "講熱、凍、落雨", mins: 6, point: "好熱／好凍已經好夠用。", lines: [
      { han: "今日好熱。", jyut: "gam1 jat6 hou2 jit6", en: "It's hot today.", ok: ["好熱"] },
      { han: "好似要落雨。", jyut: "hou2 ci5 jiu3 lok6 jyu5", en: "Looks like rain.", ok: ["落雨"] },
      { han: "凍到震。", jyut: "dung3 dou3 zan3", en: "Freezing.", ok: ["好凍", "凍到震"] },
      { han: "帶把遮啦。", jyut: "daai3 baa2 ze1 laa1", en: "Bring an umbrella.", ok: ["帶遮", "把遮"] }
    ]},
    { id: 9, emoji: "🏥", title: "身體同睇醫生", goal: "講唔舒服", mins: 8, point: "痛要講位置：頭痛、肚痛、喉嚨痛。", lines: [
      { han: "我有啲唔舒服。", jyut: "ngo5 jau5 di1 m4 syu1 fuk6", en: "I'm a bit unwell.", ok: ["唔舒服"] },
      { han: "我頭痛。", jyut: "ngo5 tau4 tung3", en: "I have a headache.", ok: ["頭痛"] },
      { han: "可唔可以睇醫生？", jyut: "ho2 m4 ho2 ji5 tai2 ji1 sang1", en: "Can I see a doctor?", ok: ["睇醫生"] },
      { han: "我過敏。", jyut: "ngo5 gwo3 man5", en: "I have an allergy.", ok: ["過敏"] },
      { han: "要唔要去急症室？", jyut: "jiu3 m4 jiu3 heoi3 gap1 zing3 sat1", en: "Need A&E?", ok: ["急症室"] }
    ]},
    { id: 10, emoji: "💬", title: "傾偈開場", goal: "同人寒暄", mins: 8, point: "「食咗飯未」係打招呼。", lines: [
      { han: "食咗飯未？", jyut: "sik6 zo2 faan6 mei6", en: "Have you eaten? (hi)", ok: ["食咗飯未", "食飯未"] },
      { han: "你做緊乜呀？", jyut: "nei5 zou6 gan2 mat1 aa3", en: "What are you doing?", ok: ["做緊乜"] },
      { han: "得閒飲茶。", jyut: "dak1 haan4 jam2 caa4", en: "Let's yum cha when free.", ok: ["得閒飲茶"] },
      { han: "我住東涌。", jyut: "ngo5 zyu6 dung1 cung1", en: "I live in Tung Chung.", ok: ["住東涌"] },
      { han: "下次再傾。", jyut: "haa6 ci3 zoi3 king1", en: "Talk next time.", ok: ["下次再傾"] }
    ]},
    { id: 11, emoji: "🧾", title: "改單同投訴", goal: "講錯單、換嘢", mins: 8, point: "先講「唔好意思」，再講問題。", lines: [
      { han: "唔好意思，叫錯咗。", jyut: "m4 hou2 ji3 si1, giu3 co3 zo2", en: "Sorry, I ordered wrong.", ok: ["叫錯"] },
      { han: "呢杯唔係凍嘅。", jyut: "ni1 bui1 m4 hai6 dung3 ge3", en: "This isn't iced.", ok: ["唔係凍"] },
      { han: "可唔可以換？", jyut: "ho2 m4 ho2 ji5 wun6", en: "Can I change it?", ok: ["可唔可以換"] },
      { han: "我要熱嘅。", jyut: "ngo5 jiu3 jit6 ge3", en: "I want it hot.", ok: ["要熱"] },
      { han: "搞掂，唔該。", jyut: "gaau2 dim6, m4 goi1", en: "All set, thanks.", ok: ["搞掂"] }
    ]},
    { id: 12, emoji: "📱", title: "日常短句", goal: "開口最高頻 8 句", mins: 8, point: "呢啲句每日都會用到。", lines: [
      { han: "得閒。", jyut: "dak1 haan4", en: "I'm free.", ok: ["得閒"] },
      { han: "唔得閒。", jyut: "m4 dak1 haan4", en: "I'm busy.", ok: ["唔得閒"] },
      { han: "唔使。", jyut: "m4 sai2", en: "No need.", ok: ["唔使"] },
      { han: "得，冇問題。", jyut: "dak1, mou5 man6 tai4", en: "OK, no problem.", ok: ["冇問題", "得"] },
      { han: "點算呀？", jyut: "dim2 syun3 aa3", en: "What now?", ok: ["點算"] },
      { han: "求其啦。", jyut: "kau4 kei4 laa1", en: "Whatever / anything's fine.", ok: ["求其"] },
      { han: "慢慢嚟。", jyut: "maan6 maan2 lai4", en: "Take it easy.", ok: ["慢慢嚟"] },
      { han: "拜拜。", jyut: "baai1 baai3", en: "Bye.", ok: ["拜拜"] }
    ]}
  ]
};

window.CANTO.dict = (function () {
  const rows = [];
  const add = (han, jyut, mean, tag) => rows.push({ han, jyut, mean, tag });
  CANTO.lessons.forEach((ls) => ls.lines.forEach((ln) => add(ln.han, ln.jyut, ln.en, "課文")));
  CANTO.particles.forEach((p) => add(p.han, p.jyut, p.mean, "助詞"));
  [
    ["而家", "ji4 gaa1", "現在", "口語"], ["陣間", "zan6 gaan1", "稍後（今日）", "口語"],
    ["屋企", "uk1 kei2", "家", "口語"], ["食飯", "sik6 faan6", "吃飯", "口語"],
    ["飲茶", "jam2 caa4", "去茶樓／聚會", "口語"], ["搞掂", "gaau2 dim6", "完成、OK", "口語"],
    ["得閒", "dak1 haan4", "有空", "口語"], ["唔該晒", "m4 goi1 saai3", "非常謝謝（服務）", "口語"],
    ["邊度", "bin1 dou6", "哪裡", "口語"], ["呢度", "ni1 dou6", "這裡", "口語"],
    ["嗰度", "go2 dou6", "那裡", "口語"], ["點解", "dim2 gaai2", "為什麼", "口語"],
    ["做咩", "zou6 me1", "幹嘛", "口語"], ["唔使客氣", "m4 sai2 haak3 hei3", "別客氣", "口語"],
    ["八達通", "baat3 daat6 tung1", "Octopus card", "香港"], ["港鐵", "gong2 tit3", "MTR", "香港"],
    ["茶餐廳", "caa4 caan1 teng1", "Hong Kong diner", "香港"], ["凍檪茶", "dung3 ning4 caa4", "iced lemon tea", "香港"],
    ["菠蘿包", "bo1 lo4 baau1", "pineapple bun", "香港"], ["走甜", "zau2 tim4", "no sugar", "香港"],
    ["埋單", "maai4 daan1", "bill please", "香港"], ["東涌", "dung1 cung1", "Tung Chung", "地名"],
    ["旺角", "wong6 gok3", "Mong Kok", "地名"], ["中環", "zung1 waan4", "Central", "地名"],
    ["尖沙咀", "zim1 saa1 zeoi2", "Tsim Sha Tsui", "地名"]
  ].forEach((r) => add(r[0], r[1], r[2], r[3]));
  return rows;
})();
