(function () {
  const STORE = "sucheng-hk-v3";
  const TABS = [
    { id: "home", icon: "\ud83c\udfe0", label: "\u4eca\u65e5" },
    { id: "learn", icon: "\ud83d\udcd8", label: "\u8ab2\u7a0b" },
    { id: "drill", icon: "\u2733\ufe0f", label: "\u62c6\u78bc" },
    { id: "type", icon: "\u2328\ufe0f", label: "\u6253\u5b57" },
    { id: "article", icon: "\ud83d\udcdd", label: "\u6587\u7ae0" },
    { id: "me", icon: "\ud83d\udc64", label: "\u6211" }
  ];
  const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const LESSONS = [
    { id: "roots", title: "\u2460 \u5eff\u56db\u5b57\u6839", blurb: "\u5148\u8a8d\u9375\u76e4\u3002", kind: "roots" },
    { id: "rootquiz", title: "\u2461 \u5b57\u6839\u6e2c\u9a57", blurb: "\u9023\u4e2d\u4e09\u6b21\u3002", kind: "rootquiz" },
    { id: "singles", title: "\u2462 \u55ae\u78bc\u5b57", blurb: "\u65e5=A\u3002", kind: "drill", pool: "singles" },
    { id: "easy2", title: "\u2463 \u5169\u78bc\u5e38\u7528", blurb: "\u982d\u5c3e\u5169\u78bc\u3002", kind: "drill", pool: "starter" },
    { id: "cantonese", title: "\u2464 \u7cb5\u8a9e\u5b57", blurb: "\u9999\u6e2f\u65e5\u5e38\u3002", kind: "drill", pool: "cantonese" },
    { id: "hard", title: "\u2465 \u96e3\u62c6\u5b57", blurb: "\u53ea\u53d6\u982d\u5c3e\u3002", kind: "drill", pool: "hard" },
    { id: "timed", title: "\u2466 \u516d\u5341\u79d2", blurb: "\u4e00\u5206\u9418\u3002", kind: "timed", pool: "starter" },
    { id: "article-guan", title: "\u2467 \u95dc\u4f60\u54a9\u4e8b", blurb: "\u9ad8\u767b\u7d93\u5178\u6f6e\u6587\u3002", kind: "article", article: "guan" },
    { id: "article-bus", title: "\u2468 \u5df4\u58eb\u963f\u53d4", blurb: "\u4f60\u6709\u58d3\u529b\u6211\u6709\u58d3\u529b\u3002", kind: "article", article: "bus" }
  ];
  const ARTICLES = {
    guan: { title: "\u95dc\u4f60\u54a9\u4e8b", text: "\u95dc\u4f60\u54a9\u4e8b\u5440\u3002\u6211\u55ba\u9999\u6e2f\u98df\u98ef\u98f2\u8336\uff0c\u95dc\u4f60\u54cb\u73ed\u670b\u53cb\u54a9\u4e8b\u3002\u4f60\u54cb\u5148\u7747\u6e05\u695a\u5587\u3002" },
    bus: { title: "\u5df4\u58eb\u963f\u53d4", text: "\u4f60\u6709\u58d3\u529b\uff0c\u6211\u6709\u58d3\u529b\u3002\u5df4\u58eb\u4e0a\u9762\u5514\u597d\u8b1b\u5622\u3002\u963f\u53d4\u8a71\u4f60\u54cb\u5750\u4f4e\uff0c\u7747\u6e05\u695a\u5148\u3002" },
    rice: { title: "\u98df\u5487\u672a", text: "\u98df\u5487\u98ef\u672a\u5440\u3002\u672a\u3002\u672a\u5440\u3002\u6897\u4fc2\u672a\u5566\u3002\u4eca\u665a\u53bb\u65fa\u89d2\u98df\u98ef\u98f2\u8336\uff0c\u641e\u6382\u672a\u3002" },
    pro: { title: "\u5c08\u696d\u63f5\u98df", text: "\u6211\u54cb\u4fc2\u5c08\u696d\u63f5\u98df\u5605\u3002\u641e\u6382\u5487\u5148\u81f3\u6563\u3002\u591a\u8b1d\u4f60\u54cb\u5e6b\u624b\u3002\u5514\u8a72\u6652\u3002" },
    peanut: { title: "\u82b1\u751f\u53cb", text: "\u6709\u5622\u7747\u5c31\u597d\u3002\u73ed\u82b1\u751f\u53cb\u5750\u4f4e\u5148\u3002\u4f60\u54cb\u7747\u6e05\u695a\uff0c\u5514\u597d\u6210\u65e5\u8b1b\u5622\u3002" },
    alarm: { title: "\u5831\u8b66\u6f6e\u6587", text: "\u8b1b\u771f\uff0c\u6211\u8a8d\u771f\u3002\u4f60\u518d\u653e\u51fa\u5699\u6211\u6703\u5831\u8b66\u3002\u8b66\u5bdf\u4e0a\u4f60\u5c4b\u4f01\u6253\u500b\u8f49\uff0c\u4f60\u5148\u60f3\u6e05\u695a\u3002" }
  };
  const PARTS = {"\u884c":"\u5f73/\u4e01","\u8857":"\u5f73/\u572d","\u660e":"\u65e5/\u6708","\u597d":"\u5973/\u5b50","\u4ed6":"\u4ebb/\u4e5f","\u4f60":"\u4ebb/\u5c14","\u8aaa":"\u8a00/\u514c","\u6e2f":"\u6c35/\u5df7","\u9593":"\u9580/\u65e5","\u554f":"\u9580/\u53e3","\u660c":"\u65e5/\u65e5","\u6697":"\u65e5/\u97f3","\u6709":"\u4f0f/\u6708","\u5187":"\u4f0f/\u518c"};
  const blank = function(){ return { view:"home", pool:"starter", articleId:"guan", knownRad:{}, correct:0, wrong:0, streak:0, lastDay:"", todayCount:0, todayDate:"", wrongBook:[], bookmarks:[], lessonsDone:{} }; };
  function load(){ try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch(e){ return {}; } }
  var state = Object.assign(blank(), load());
  var drill=null, quiz=null, typed="", timer=null, remain=0, outText="", lastHan="", candPage=0;
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
  function pageCands(){
    var all=I.bySc.get(String(typed||"").toLowerCase())||[];
    return {all:all, page:all.slice(candPage*4, candPage*4+4), pages:Math.max(1, Math.ceil(all.length/4))};
  }
  function analysisBox(han){
    if(!han||!info(han)) return "<p class='lede'>\u6253\u982d\u5c3e\u78bc\u4e4b\u5f8c\uff0c\u4e0b\u9762 1 2 3 4 \u4fc2\u64c7\u5b57\u4f4d\u3002\u7a7a\u767d\u9375\u64c7\u7b2c 1 \u96bb\u3002</p>";
    var row=info(han);
    var split=analyzeOf(han);
    return "<div class='analyze'><div class='analyze-han'>"+han+"</div><div class='analyze-eq'><span class='red'>"+han+"</span> = "+split+"</div><div class='analyze-meta'>\u5b57\u9996/\u5b57\u8eab \u00b7 \u901f\u6210 "+rootsStr(row.sc)+" "+row.sc.toUpperCase()+" \u00b7 \u5009\u9821 "+rootsStr(row.cj)+" "+String(row.cj||"").toUpperCase()+"</div></div>";
  }
  function commitHan(han){
    if(!han) return;
    lastHan=han; outText+=han; typed=""; candPage=0; addToday(); render();
  }
  function pickNum(n){
    var han=pageCands().page[n-1];
    if(!han) return;
    if(state.view==="article"){
      var art=ARTICLES[state.articleId]||ARTICLES.guan;
      var ch=art.text[state._ai];
      if(ch===han){
        markRight(han); lastHan=han; typed=""; candPage=0; state._ai+=1;
        while(state._ai<art.text.length && !I.byHan.has(art.text[state._ai])) state._ai+=1;
        render();
      } else { markWrong(ch||han); toast("\u5514\u5572"); }
      return;
    }
    commitHan(han);
  }
  function poolOf(name){
    if(name==="wrong") return state.wrongBook.slice();
    if(name==="all") return SUCHENG.chars.map(function(r){return r[0];}).filter(function(h,i,a){return a.indexOf(h)===i && I.byHan.has(h);});
    return (SUCHENG[name]||SUCHENG.starter).filter(function(h){return I.byHan.has(h);});
  }
  function pick(list){ return list.length ? list[Math.floor(Math.random()*list.length)] : null; }
  function acc(){ var t=state.correct+state.wrong; return t?Math.round(state.correct/t*100):0; }
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
    $("device-pill").textContent=isPc()?"\u96fb\u8166\u7248":"\u624b\u6a5f\u7248";
    $("goal-pill").textContent="\u4eca\u65e5 "+state.todayCount+"/20";
    var html=TABS.map(function(t){ return "<button type='button' data-view='"+t.id+"' class='"+(state.view===t.id||(t.id==="learn"&&(state.view==="roots"||state.view==="rootquiz"))?"on":"")+"'>"+t.icon+" "+t.label+"</button>"; }).join("");
    $("side-tabs").innerHTML=html; $("tabbar").innerHTML=html;
  }
  function go(view){ state.view=view; save(); render(); }
  function startDrill(pool,timed){
    var han=pick(poolOf(pool));
    drill=han?{han:han,pool:pool,misses:0,hint:0,timed:!!timed,got:(drill&&drill.timed&&timed)?drill.got:0}:null;
    typed="";
    if(timed && !timer){
      remain=60;
      timer=setInterval(function(){
        remain-=1;
        if(remain<=0){ clearInterval(timer); timer=null; toast("\u6642\u9593\u5230"); go("home"); }
        else if(state.view==="drill") render();
      },1000);
    }
  }
