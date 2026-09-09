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
  const ARTICLES = {
    guan: { title: "關你咩事", text: "關你咩事呀。我喎香港食飯飲茶，關你哔班朋友咩事。你哔先睇清楚喇。" },
    bus: { title: "巴士阿叔", text: "你有壓力，我有壓力。巴士上面唔好講嘢。阿叔話你哔坐低，睇清楚先。" },
    rice: { title: "食哒未", text: "食哒飯未呀。未。未呀。梗係未啦。今晚去旺角食飯飲茶，搞掂未。" },
    pro: { title: "專業揪食", text: "我哔係專業揪食嘅。搞掂哒先至散。多謝你哔幫手。唔該晒。" },
    peanut: { title: "花生友", text: "有嘢睇就好。班花生友坐低先。你哔睇清楚，唔好成日講嘢。" },
    alarm: { title: "報警潮文", text: "講真，我認真。你再放出嚕我會報警。警察上你屋企打個轉，你先想清楚。" }
  };
  const PARTS = {"行":"彳/丁","街":"彳/圭","明":"日/月","好":"女/子","他":"亻/也","你":"亻/尔","說":"言/兌","港":"氵/巷","間":"門/日","問":"門/口","昌":"日/日","暗":"日/音","有":"伏/月","冇":"伏/册"};
  const blank = function(){ return { view:"home", pool:"starter", articleId:"guan", knownRad:{}, correct:0, wrong:0, streak:0, lastDay:"", todayCount:0, todayDate:"", wrongBook:[], bookmarks:[], lessonsDone:{}, customArt:"" }; };
  function load(){ try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch(e){ return {}; } }
  var state = Object.assign(blank(), load());
  if(state.view==="type") state.view="article";
  var drill=null, quiz=null, typed="", timer=null, remain=0, lastHan="";
  function save(){ try { localStorage.setItem(STORE, JSON.stringify(state)); } catch(e){} }
  function $(id){ return document.getElementById(id); }
  function isPc(){ return window.matchMedia("(min-width: 860px)").matches; }
  function today(){ return new Date().toISOString().slice(0,10); }
  function toast(msg){ var el=$("toast"); el.hidden=false; el.textContent=msg; clearTimeout(toast._t); toast._t=setTimeout(function(){ el.hidden=true; },1600); }
  function esc(s){ return String(s); }
  function idx(){
    var byHan=new Map(), bySc=new Map();
    (SUCHENG.chars||[]).forEach(function(row){
      var han=row[0], cj=row[1], sc=(row[2]||"").toLowerCase();
      if(han.length!==1) return;
      if(!byHan.has(han)) byHan.set(han,{han:han,cj:cj,sc:sc});
      if(!bySc.has(sc)) bySc.set(sc,[]);
      bySc.get(sc).push(han);
    });
    return {byHan:byHan,bySc:bySc};
  }
  var I = idx();
  function info(han){ return I.byHan.get(han); }
  function rootsStr(code){ return String(code||"").toUpperCase().split("").map(function(k){ return SUCHENG.map[k]||k; }).join(""); }
  function analyzeOf(han){
    var row=info(han); if(!row) return han;
    if(PARTS[han]) return PARTS[han];
    var cj=String(row.cj||"").toLowerCase();
    if(!cj) return han;
    if(cj.length===1) return rootsStr(cj);
    return rootsStr(cj.charAt(0))+"/"+rootsStr(cj.charAt(cj.length-1));
  }
  function analysisBox(han){
    if(!han||!info(han)) return "<p class='lede'>對住黃色嗰隻字打頭尾兩碼，Enter 核對。</p>";
    var row=info(han);
    var split=analyzeOf(han);
    return "<div class='analyze'><div class='analyze-han'>"+han+"</div><div class='analyze-eq'><span class='red'>"+han+"</span> = "+split+"</div><div class='analyze-meta'>字首/字身 · 速成 "+rootsStr(row.sc)+" "+row.sc.toUpperCase()+" · 倉頡 "+rootsStr(row.cj)+" "+String(row.cj||"").toUpperCase()+"</div></div>";
  }
  function artCur(){
    var art=ARTICLES[state.articleId]||ARTICLES.guan;
    return art.text[state._ai]||"";
  }
  function skipUnknown(){
    var art=ARTICLES[state.articleId]||ARTICLES.guan;
    while(state._ai<art.text.length && !I.byHan.has(art.text[state._ai])) state._ai+=1;
  }
  function poolOf(name){
    if(name==="wrong") return state.wrongBook.slice();
    if(name==="all") return SUCHENG.chars.map(function(r){return r[0];}).filter(function(h,i,a){return a.indexOf(h)===i && I.byHan.has(h);});
    return (SUCHENG[name]||SUCHENG.starter).filter(function(h){return I.byHan.has(h);});
  }
  function pick(list){ return list.length ? list[Math.floor(Math.random()*list.length)] : null; }
  function acc(){ var t=state.correct+state.wrong; return t?Math.round(state.correct/t*100):0; }
  function wpmOf(n, t0){
    var sec=Math.max(1,(Date.now()-(t0||Date.now()))/1000);
    return Math.round((n||0)*60/sec);
  }
  function bumpDay(){
    var d=today();
    if(state.todayDate!==d){ state.todayDate=d; state.todayCount=0; }
    if(state.lastDay!==d){
      var y=new Date(Date.now()-86400000).toISOString().slice(0,10);
      state.streak=state.lastDay===y?(state.streak||0)+1:1;
      state.lastDay=d;
    }
  }
  function addToday(){ bumpDay(); state.todayCount+=1; save(); syncChrome(); }
  function markRight(han){ state.correct+=1; state.wrongBook=state.wrongBook.filter(function(x){return x!==han;}); addToday(); }
  function markWrong(han){ state.wrong+=1; if(han && state.wrongBook.indexOf(han)<0) state.wrongBook.push(han); save(); }
  function syncChrome(){
    bumpDay();
    $("device-pill").textContent=isPc()?"電腦版":"手機版";
    $("goal-pill").textContent="今日 "+state.todayCount+"/20";
    var html=TABS.map(function(t){ return "<button type='button' data-view='"+t.id+"' class='"+(state.view===t.id||(t.id==="learn"&&(state.view==="roots"||state.view==="rootquiz"))?"on":"")+"'>"+t.icon+" "+t.label+"</button>"; }).join("");
    $("side-tabs").innerHTML=html; $("tabbar").innerHTML=html;
  }
  function go(view){ if(view==="type") view="article"; state.view=view; save(); render(); }
  function startDrill(pool,timed){
    var han=pick(poolOf(pool));
    var keep=drill&&drill.timed&&timed;
    drill=han?{han:han,pool:pool,misses:0,hint:0,timed:!!timed,got:keep?drill.got:0,t0:keep&&drill.t0?drill.t0:Date.now()}:null;
    typed="";
    if(timed && !timer){
      remain=60;
      timer=setInterval(function(){
        remain-=1;
        if(remain<=0){ clearInterval(timer); timer=null; toast((drill?drill.got:0)+" 字 · "+wpmOf(drill?drill.got:0, drill&&drill.t0)+" 字/分"); go("home"); }
        else if(state.view==="drill") render();
      },1000);
    }
  }
