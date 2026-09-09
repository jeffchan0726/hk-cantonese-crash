(function () {
  const STORE = "sucheng-hk-v3";
  const TABS = [
    { id: "home", icon: "🏠", label: "今日" },
    { id: "learn", icon: "📘", label: "課程" },
    { id: "drill", icon: "✳️", label: "拆碼" },
    { id: "article", icon: "📝", label: "文章" },
    { id: "me", icon: "👤", label: "我" }
  ];
  const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const LESSONS = [
    { id: "roots", title: "① 廿四字根", blurb: "先認鍵盤。", kind: "roots" },
    { id: "rootquiz", title: "② 字根測驗", blurb: "連中三次。", kind: "rootquiz" },
    { id: "singles", title: "③ 單碼字", blurb: "日=A。", kind: "drill", pool: "singles" },
    { id: "easy2", title: "④ 兩碼常用", blurb: "頭尾兩碼。", kind: "drill", pool: "starter" },
    { id: "cantonese", title: "⑤ 粵語字", blurb: "香港日常。", kind: "drill", pool: "cantonese" },
    { id: "hard", title: "⑥ 難拆字", blurb: "只取頭尾。", kind: "drill", pool: "hard" },
    { id: "timed", title: "⑦ 六十秒", blurb: "一分鐘。", kind: "timed", pool: "starter" },
    { id: "article-guan", title: "⑧ 關你咩事", blurb: "高登經典潮文。", kind: "article", article: "guan" },
    { id: "article-bus", title: "⑨ 巴士阿叔", blurb: "你有壓力我有壓力。", kind: "article", article: "bus" },
    { id: "common3k", title: "⑩ 三千常用", blurb: "倉頡三香港碼 3000 字。", kind: "drill", pool: "all" }
  ];
