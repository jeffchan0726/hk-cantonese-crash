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
    { id: "article-hi", title: "\u2467 \u6253\u62db\u547c", blurb: "\u6574\u53e5\u6253\u3002", kind: "article", article: "hi" },
    { id: "article-hk", title: "\u2468 \u9999\u6e2f\u751f\u6d3b", blurb: "\u5730\u9435\u8336\u9910\u5ef3\u3002", kind: "article", article: "hk" }
  ];
  const ARTICLES = {
    hi: { title: "\u6253\u62db\u547c", text: "\u4f60\u597d\u3002\u8acb\u554f\u800c\u5bb6\u5e7e\u9ede\uff1f\u5514\u8a72\u6652\u3002\u5c0d\u5514\u4f4f\u3002\u591a\u8b1d\u4f60\u5e6b\u624b\u3002\u518d\u898b\u3002" },
    hk: { title: "\u9999\u6e2f\u751f\u6d3b", text: "\u6211\u55ba\u9999\u6e2f\u4f4f\u3002\u671d\u65e9\u642d\u5730\u9435\u53bb\u516c\u53f8\u3002\u4e2d\u5348\u98df\u98ef\u98f2\u8336\u3002\u591c\u665a\u8fd4\u5c4b\u4f01\u7747\u96fb\u8996\u3002" },
    food: { title: "\u8336\u9910\u5ef3", text: "\u5514\u8a72\uff0c\u8981\u4e00\u500b\u83e0\u863f\u5305\u3001\u51cd\u6ab8\u8336\u3002\u5c11\u751c\u3002\u57cb\u55ae\u3002" },
    ask: { title: "\u554f\u8def", text: "\u8acb\u554f\u53bb\u706b\u8eca\u7ad9\u9ede\u884c\uff1f\u4e00\u76f4\u884c\u7136\u5f8c\u8f49\u53f3\u3002\u591a\u8b1d\u3002" }
  };
  const PARTS = {"\u884c":"\u5f73/\u4e01","\u8857":"\u5f73/\u572d","\u660e":"\u65e5/\u6708","\u597d":"\u5973/\u5b50","\u4ed6":"\u4ebb/\u4e5f","\u4f60":"\u4ebb/\u5c14","\u8aaa":"\u8a00/\u514c","\u6e2f":"\u6c35/\u5df7","\u9593":"\u9580/\u65e5","\u554f":"\u9580/\u53e3","\u660c":"\u65e5/\u65e5","\u6697":"\u65e5/\u97f3","\u6709":"\u4f0f/\u6708","\u5187":"\u4f0f/\u518c"};
  const blank = function(){ return { view:"home", pool:"starter", articleId:"hi", knownRad:{}, correct:0, wrong:0, streak:0, lastDay:"", todayCount:0, todayDate:"", wrongBook:[], bookmarks:[], lessonsDone:{} }; };
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
  function splitCj(cj){
    var r=String(cj||"").toLowerCase();
    if(r.length<=2) return [r,""];
    if(r.length===3) return [r.slice(0,1), r.slice(1)];
    if(r.length===4) return [r.slice(0,2), r.slice(2)];
    return [r.slice(0,2), r.slice(2)];
  }
  function analyzeOf(han){
    var row=info(han); if(!row) return han;
    if(PARTS[han]) return PARTS[han];
    var pair=splitCj(row.cj);
    var a=rootsStr(pair[0]), b=rootsStr(pair[1]);
    return b ? a+"/"+b : a;
  }
  function pageCands(){
    var all=I.bySc.get(String(typed||"").toLowerCase())||[];
    return {all:all, page:all.slice(candPage*4, candPage*4+4), pages:Math.max(1, Math.ceil(all.length/4))};
  }
  function analysisBox(han){
    if(!han||!info(han)) return "<p class='lede'>\u6253\u5169\u78bc\u4e4b\u5f8c\u7528 1 2 3 4 \u64c7\u5b57\u3002\u7a7a\u767d\u9375\u64c7\u7b2c 1 \u96bb\u3002</p>";
    var row=info(han);
    return "<div class='analyze'><div class='analyze-han'>"+han+"</div><div class='analyze-eq'>"+han+" = "+analyzeOf(han)+"</div><div class='analyze-meta'>\u901f\u6210 "+rootsStr(row.sc)+" "+row.sc.toUpperCase()+" \u00b7 \u5009\u9821 "+rootsStr(row.cj)+"</div></div>";
  }
  function commitHan(han){ if(!han) return; lastHan=han; outText+=han; typed=""; candPage=0; addToday(); render(); }
  function pickNum(n){ var han=pageCands().page[n-1]; if(han) commitHan(han); }
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
  function finishLesson(id){ state.lessonsDone[id]=true; save(); }
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
  function kbHtml(hintKeys){
    var set={};
    String(hintKeys||"").toUpperCase().split("").forEach(function(k){ set[k]=1; });
    return "<div class='kb'>"+KEYS.map(function(row){ return "<div class='kb-row'>"+row.split("").map(function(k){ return "<button type='button' class='k"+(set[k]?" hint":"")+"' data-k='"+k.toLowerCase()+"'><b>"+k+"</b><small>"+(SUCHENG.map[k]||"")+"</small></button>"; }).join("")+"</div>"; }).join("")+"</div>";
  }
  function htmlHome(){
    var next=LESSONS.find(function(l){ return !state.lessonsDone[l.id]; })||LESSONS[0];
    return "<div class='home-grid'><section class='hero'><div class='kicker'>SUCHENG</div><h1>\u53ea\u6253\u982d\u5c3e\u5169\u78bc</h1><p class='lede'>\u300c\u6e2f\u300dEU \u6c34\u5c71\u3002\u300c\u8aaa\u300dYU \u535c\u5c71\u3002\u300c\u884c\u300dHN \u5f73/\u4e01\u3002</p><div class='stats'><div class='stat'><b>"+(state.streak||0)+"</b><span>\u9023\u7e8c\u65e5</span></div><div class='stat'><b>"+(state.correct||0)+"</b><span>\u62c6\u5572</span></div><div class='stat'><b>"+acc()+"%</b><span>\u6e96\u78ba\u7387</span></div></div></section><section class='path'><article class='path-card'><div><h3>\u7e7c\u7e8c\uff1a"+next.title+"</h3><p>"+next.blurb+"</p></div><button class='go' data-go='"+next.id+"'>\u53bb</button></article><article class='path-card'><div><h3>\u8ab2\u7a0b</h3><p>\u5b57\u6839\u2192\u7cb5\u8a9e\u2192\u6587\u7ae0</p></div><button class='go' data-view='learn'>\u53bb</button></article><article class='path-card'><div><h3>\u62c6\u78bc</h3><p>\u5e38\u7528/\u96e3\u5b57</p></div><button class='go' data-view='drill'>\u53bb</button></article><article class='path-card'><div><h3>\u6253\u5b57\u9078\u5b57</h3><p>1 2 3 4 \u64c7\u5b57</p></div><button class='go' data-view='type'>\u53bb</button></article><article class='path-card'><div><h3>\u67e5\u78bc</h3><p>\u6f22\u5b57\u2194\u901f\u6210</p></div><button class='go' data-view='lookup'>\u53bb</button></article></section></div>";
  }
  function htmlLearn(){ return "<section class='panel'><h1>\u8ab2\u7a0b</h1><div class='path'>"+LESSONS.map(function(l){ return "<article class='path-card'><div><h3>"+l.title+"</h3><p>"+l.blurb+"</p></div><button class='go' data-go='"+l.id+"'>\u53bb</button></article>"; }).join("")+"</div></section>"; }
  function htmlRoots(){ return "<section class='panel'><h1>\u5eff\u56db\u5b57\u6839</h1><div class='root-grid'>"+"ABCDEFGHIJKLMNOPQRSTUVWY".split("").map(function(k){ return "<div class='root'><b>"+SUCHENG.map[k]+"</b><span>"+k+"</span></div>"; }).join("")+"</div><div class='row' style='margin-top:16px'><button class='btn' data-go='rootquiz'>\u6e2c\u9a57</button></div></section>"; }
  function startQuiz(){ var keys="ABCDEFGHIJKLMNOPQRSTUVWY".split(""); var ans=pick(keys), opts=[ans]; while(opts.length<4){ var k=pick(keys); if(opts.indexOf(k)<0) opts.push(k);} opts.sort(function(){return Math.random()-0.5;}); quiz={ans:ans,opts:opts,streak:(quiz&&quiz.streak)||0,n:(quiz&&quiz.n)||0}; }
  function htmlQuiz(){ if(!quiz) startQuiz(); return "<section class='panel'><h1>\u300c"+SUCHENG.map[quiz.ans]+"\u300d\u4fc2\u908a\u7c92\u9375\uff1f</h1><div class='quiz-opts'>"+quiz.opts.map(function(k){ return "<button type='button' data-quiz='"+k+"'>"+k+"<br><small>"+SUCHENG.map[k]+"</small></button>"; }).join("")+"</div></section>"; }
  function htmlDrill(){
    if(!drill||!info(drill.han)) startDrill(state.pool||"starter", !!(drill&&drill.timed));
    if(!drill) return "<section class='panel'><p>\u5187\u5b57</p></section>";
    var row=info(drill.han);
    var hintKeys=drill.hint===1?row.sc[0]:(drill.hint>=2?row.sc:"");
    var showAns=drill.hint>=2?row.sc.toUpperCase():(drill.hint===1?row.sc[0].toUpperCase()+"...":"");
    var chips=[["starter","\u5e38\u7528"],["cantonese","\u7cb5\u8a9e"],["hard","\u96e3\u5b57"],["singles","\u55ae\u78bc"],["wrong","\u932f\u5b57\u672c"],["all","\u5168\u90e8"]].map(function(x){ return "<button class='chip"+((state.pool||"starter")===x[0]?" on":"")+"' data-pool='"+x[0]+"'>"+x[1]+"</button>"; }).join("");
    return "<div class='split'><section class='drill-card'><div class='chips'>"+chips+"</div><div class='char'>"+drill.han+"</div><div class='answer'>"+showAns+"</div><form id='drill-form'><input id='drill-in' type='text' maxlength='2' value='"+typed+"'></form><div class='row'><button class='btn' id='btn-check' type='button'>\u6838\u5c0d</button><button class='ghost' id='btn-hint' type='button'>\u63d0\u793a</button><button class='ghost' id='btn-skip' type='button'>\u8df3\u904e</button></div></section><section class='panel'>"+kbHtml(hintKeys)+"</section></div>";
  }
  function htmlType(){
    var pack=pageCands();
    var glyphs=rootsStr(typed);
    var items=pack.page.map(function(h,i){ return "<button class='ime-item' type='button' data-pick='"+h+"'><b>"+(i+1)+"</b><span class='ch'>"+h+"</span></button>"; }).join("");
    var out=(outText||"").split("").map(function(ch){ return ch===lastHan?"<span class='red'>"+ch+"</span>":ch; }).join("");
    return "<div class='split'><section class='panel'><div class='kicker'>\u6253\u5b57 \u00b7 \u901f\u6210\u9078\u5b57</div><h1>\u6253\u5b8c\u78bc\u7528 1 2 3 4 \u64c7\u5b57</h1><div class='outbox'>"+(out||"<span class='lede'>\u5c1a\u672a\u6253\u5b57</span>")+"</div><div class='ime'><div class='ime-comp'>"+(glyphs||"\u2026")+"<span class='raw'>"+(typed.toUpperCase()||"")+"</span></div><div class='ime-cands'>"+(items||"<span class='lede'>\u672a\u6709\u5c0d\u61c9\u5b57</span>")+"</div><p class='ime-hint'>1-4 \u64c7\u5b57 \u00b7 \u7a7a\u767d\u64c7 1 \u00b7 = \u7ffb\u9801 \u00b7 \u7b2c "+(candPage+1)+"/"+pack.pages+" \u9801</p></div><form id='type-form'><input id='type-in' type='text' maxlength='2' autocomplete='off' placeholder='aa / hn / yu' value='"+typed+"'></form></section><section class='panel'>"+analysisBox(lastHan)+kbHtml(typed)+"</section></div>";
  }
  function htmlArticle(){
    var art=ARTICLES[state.articleId]||ARTICLES.hi;
    if(state._ai==null){ var i=[].slice.call(art.text).findIndex(function(c){return I.byHan.has(c);}); state._ai=i<0?0:i; }
    var html=[].slice.call(art.text).map(function(ch,i){ return "<span class='"+(i<state._ai?"done":i===state._ai?"cur":"todo")+"'>"+ch+"</span>"; }).join("");
    var chips=Object.keys(ARTICLES).map(function(id){ return "<button class='chip"+(state.articleId===id?" on":"")+"' data-art='"+id+"'>"+ARTICLES[id].title+"</button>"; }).join("");
    return "<div class='split'><section class='panel'><div class='chips'>"+chips+"</div><div class='passage'>"+html+"</div><form id='art-form'><input id='art-in' type='text' maxlength='2'></form></section><section class='panel'><button class='ghost' id='btn-skip-art' type='button'>\u8df3\u904e</button></section></div>";
  }
  function htmlReview(){
    return "<section class='panel'><h1>\u932f\u5b57\u672c</h1>"+(state.wrongBook.length?state.wrongBook.map(function(h){ var r=info(h); return "<div class='item'><b>"+h+"</b><span>"+(r?r.sc.toUpperCase():"")+"</span></div>"; }).join(""):"<p class='lede'>\u672a\u6709\u932f\u5b57</p>")+"</section>";
  }
  function htmlLookup(){
    var q=(state._q||"").trim(), body="";
    if(q && I.byHan.has(q[0])) body=analysisBox(q[0]);
    else if(q){ var hits=I.bySc.get(q.toLowerCase())||[]; body=hits.map(function(h){return "<span class='cand'>"+h+"</span>";}).join(" "); }
    return "<section class='panel'><h1>\u67e5\u78bc</h1><input id='look-in' type='text' value='"+q+"'>"+body+"<p class='lede'>\u8aaa = YU \u535c\u5c71 \u00b7 \u884c = \u5f73/\u4e01</p></section>";
  }
  function htmlMe(){ return "<section class='panel'><h1>\u9032\u5ea6</h1><div class='stats'><div class='stat'><b>"+(state.streak||0)+"</b><span>\u9023\u7e8c\u65e5</span></div><div class='stat'><b>"+(state.correct||0)+"</b><span>\u62c6\u5572</span></div><div class='stat'><b>"+acc()+"%</b><span>%</span></div></div><button class='ghost' id='btn-reset' type='button'>\u6e05\u9032\u5ea6</button></section>"; }
  function render(){
    if(state.view!=="drill" && timer && !(drill&&drill.timed)){ clearInterval(timer); timer=null; }
    syncChrome();
    var fn={home:htmlHome,learn:htmlLearn,roots:htmlRoots,rootquiz:htmlQuiz,drill:htmlDrill,type:htmlType,article:htmlArticle,review:htmlReview,lookup:htmlLookup,me:htmlMe}[state.view]||htmlHome;
    $("main").innerHTML=fn();
    bind();
  }
  function checkDrill(){
    if(!drill) return;
    var row=info(drill.han);
    var val=(( $("drill-in") && $("drill-in").value )||typed||"").trim().toLowerCase();
    typed=val;
    if(val===row.sc){ markRight(drill.han); if(drill.timed) drill.got+=1; toast("\u5572"); startDrill(drill.pool, drill.timed); setTimeout(render,200); }
    else { drill.misses+=1; drill.hint=Math.min(2,drill.misses); markWrong(drill.han); render(); }
  }
  function openLesson(id){
    var l=LESSONS.find(function(x){return x.id===id;});
    if(!l) return go("learn");
    if(l.kind==="roots") return go("roots");
    if(l.kind==="rootquiz"){ quiz=null; startQuiz(); return go("rootquiz"); }
    if(l.kind==="article"){ state.articleId=l.article; state._ai=null; return go("article"); }
    state.pool=l.pool||"starter"; startDrill(state.pool, l.kind==="timed"); go("drill");
  }
  function bind(){
    document.querySelectorAll("[data-view]").forEach(function(b){ b.onclick=function(){ if(b.getAttribute("data-pool")) state.pool=b.getAttribute("data-pool"); if(b.getAttribute("data-view")==="drill") startDrill(state.pool||"starter", false); if(b.getAttribute("data-view")==="article") state._ai=null; go(b.getAttribute("data-view")); }; });
    document.querySelectorAll("[data-go]").forEach(function(b){ b.onclick=function(){ openLesson(b.getAttribute("data-go")); }; });
    document.querySelectorAll("[data-pool]").forEach(function(b){ if(b.getAttribute("data-view")) return; b.onclick=function(){ state.pool=b.getAttribute("data-pool"); startDrill(state.pool, !!(drill&&drill.timed)); render(); }; });
    document.querySelectorAll("[data-art]").forEach(function(b){ b.onclick=function(){ state.articleId=b.getAttribute("data-art"); state._ai=null; render(); }; });
    document.querySelectorAll("[data-quiz]").forEach(function(b){ b.onclick=function(){ if(b.getAttribute("data-quiz")===quiz.ans){ quiz.streak+=1; startQuiz(); render(); } else { quiz.streak=0; toast("\u5514\u5572 "+quiz.ans); } }; });
    document.querySelectorAll("[data-k]").forEach(function(b){ b.onclick=function(){ typed=(typed+b.getAttribute("data-k")).slice(-2); var box=$("drill-in")||$("type-in")||$("art-in"); if(box) box.value=typed; if(state.view==="type") render(); }; });
    document.querySelectorAll("[data-pick]").forEach(function(b){ b.onclick=function(){ commitHan(b.getAttribute("data-pick")); }; });
    if($("drill-in")){ $("drill-in").focus(); $("drill-form").onsubmit=function(e){ e.preventDefault(); checkDrill(); }; }
    if($("btn-check")) $("btn-check").onclick=checkDrill;
    if($("btn-hint")) $("btn-hint").onclick=function(){ if(drill){ drill.hint=Math.min(2,(drill.hint||0)+1); render(); } };
    if($("btn-skip")) $("btn-skip").onclick=function(){ startDrill(drill.pool, drill.timed); render(); };
    if($("type-form")) $("type-form").onsubmit=function(e){ e.preventDefault(); pickNum(1); };
    if($("type-in")){
      $("type-in").focus();
      $("type-in").oninput=function(){ typed=$("type-in").value.toLowerCase().replace(/[^a-y]/g,"").slice(0,2); candPage=0; render(); if($("type-in")){ $("type-in").focus(); $("type-in").value=typed; } };
      $("type-in").onkeydown=function(e){
        if(e.key===" "){ e.preventDefault(); pickNum(1); }
        else if(e.key==="1"||e.key==="2"||e.key==="3"||e.key==="4"){ e.preventDefault(); pickNum(+e.key); }
        else if(e.key==="="){ e.preventDefault(); var p=pageCands(); candPage=(candPage+1)%p.pages; render(); }
      };
    }
    if($("look-in")){ $("look-in").focus(); $("look-in").oninput=function(){ state._q=$("look-in").value; render(); if($("look-in")){ $("look-in").focus(); $("look-in").value=state._q; } }; }
    if($("art-form")) $("art-form").onsubmit=function(e){ e.preventDefault(); var art=ARTICLES[state.articleId]||ARTICLES.hi; var ch=art.text[state._ai]; var val=($("art-in")&&$("art-in").value||"").trim().toLowerCase(); if(!I.byHan.has(ch)){ state._ai+=1; render(); return;} if(val===info(ch).sc){ markRight(ch); state._ai+=1; while(state._ai<art.text.length && !I.byHan.has(art.text[state._ai])) state._ai+=1; render(); } else { markWrong(ch); render(); } };
    if($("btn-skip-art")) $("btn-skip-art").onclick=function(){ var art=ARTICLES[state.articleId]||ARTICLES.hi; state._ai=(state._ai||0)+1; render(); };
    if($("btn-reset")) $("btn-reset").onclick=function(){ if(confirm("\u6e05\u9032\u5ea6?")){ state=blank(); save(); render(); } };
  }
  if(!window.SUCHENG||!SUCHENG.chars){ $("main").innerHTML="<p class='boot-err'>\u5b57\u5eab\u8f09\u5165\u5931\u6557</p>"; return; }
  render();
})();
