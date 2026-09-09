  function ensureWuse(){
    if(document.getElementById("wuse-css")) return;
    var l=document.createElement("link");
    l.id="wuse-css"; l.rel="stylesheet"; l.href="css/wuse.css?v=20";
    document.head.appendChild(l);
  }
  function render(){
    ensureWuse();
    if(state.view==="type") state.view="article";
    if(state.view!=="drill" && timer && !(drill&&drill.timed)){ clearInterval(timer); timer=null; }
    syncChrome();
    var pages={home:htmlHome,learn:htmlLearn,roots:htmlRoots,rootquiz:htmlQuiz,drill:htmlDrill,article:htmlArticle,review:htmlReview,lookup:htmlLookup,me:htmlMe};
    var fn=pages[state.view]||htmlHome;
    $("main").innerHTML=fn();
    bind();
  }
  function checkDrill(){
    if(!drill) return;
    var row=info(drill.han);
    var val=(( $("drill-in") && $("drill-in").value )||typed||"").trim().toLowerCase();
    typed=val;
    if(val===row.sc){ markRight(drill.han); if(drill.timed) drill.got+=1; toast("啦"); startDrill(drill.pool, drill.timed); setTimeout(render,200); }
    else { drill.misses+=1; drill.hint=Math.min(3,drill.misses); markWrong(drill.han); render(); }
  }
  function checkArticle(){
    var art=ARTICLES[state.articleId]||ARTICLES.guan;
    if(state._ai==null) state._ai=0;
    skipUnknown();
    var ch=art.text[state._ai];
    if(!ch){ toast("打完"); render(); return; }
    var row=info(ch);
    var val=(( $("art-in") && $("art-in").value )||typed||"").trim().toLowerCase().replace(/[^a-y]/g,"").slice(0,2);
    typed=val;
    if(!row){ state._ai+=1; skipUnknown(); typed=""; state._ahint=0; render(); return; }
    if(val===row.sc){
      markRight(ch); lastHan=ch; typed=""; state._ahint=0; state._ai+=1; skipUnknown(); toast("啦"); render();
    } else {
      markWrong(ch); state._ahint=Math.min(3,(state._ahint||0)+1); toast("唔啦"); render();
    }
  }
  function openLesson(id){
    var l=LESSONS.find(function(x){return x.id===id;});
    if(!l) return go("learn");
    if(l.kind==="roots") return go("roots");
    if(l.kind==="rootquiz"){ quiz=null; startQuiz(); return go("rootquiz"); }
    if(l.kind==="article"){ state.articleId=l.article; state._ai=null; state._ahint=0; lastHan=""; return go("article"); }
    state.pool=l.pool||"starter"; startDrill(state.pool, l.kind==="timed"); go("drill");
  }
  function bind(){
    document.querySelectorAll("[data-view]").forEach(function(b){ b.onclick=function(){ if(b.getAttribute("data-pool")) state.pool=b.getAttribute("data-pool"); if(b.getAttribute("data-view")==="drill") startDrill(state.pool||"starter", false); if(b.getAttribute("data-view")==="article"){ state._ai=null; state._ahint=0; } go(b.getAttribute("data-view")); }; });
    document.querySelectorAll("[data-go]").forEach(function(b){ b.onclick=function(){ openLesson(b.getAttribute("data-go")); }; });
    document.querySelectorAll("[data-pool]").forEach(function(b){ if(b.getAttribute("data-view")) return; b.onclick=function(){ state.pool=b.getAttribute("data-pool"); startDrill(state.pool, !!(drill&&drill.timed)); render(); }; });
    document.querySelectorAll("[data-art]").forEach(function(b){ b.onclick=function(){ state.articleId=b.getAttribute("data-art"); state._ai=null; state._ahint=0; lastHan=""; typed=""; render(); }; });
    document.querySelectorAll("[data-quiz]").forEach(function(b){ b.onclick=function(){ if(b.getAttribute("data-quiz")===quiz.ans){ quiz.streak+=1; startQuiz(); render(); } else { quiz.streak=0; toast("唔啦 "+quiz.ans); } }; });
    document.querySelectorAll("[data-k]").forEach(function(b){ b.onclick=function(){
      typed=(typed+b.getAttribute("data-k")).slice(-2);
      var box=$("drill-in")||$("art-in");
      if(box) box.value=typed;
    }; });
    if($("drill-in")){ $("drill-in").focus(); $("drill-form").onsubmit=function(e){ e.preventDefault(); checkDrill(); }; }
    if($("btn-check")) $("btn-check").onclick=checkDrill;
    if($("btn-hint")) $("btn-hint").onclick=function(){ if(drill){ drill.hint=Math.min(3,(drill.hint||0)+1); render(); } };
    if($("btn-skip")) $("btn-skip").onclick=function(){ startDrill(drill.pool, drill.timed); render(); };
    if($("look-in")){ $("look-in").focus(); $("look-in").oninput=function(){ state._q=$("look-in").value; render(); if($("look-in")){ $("look-in").focus(); $("look-in").value=state._q; } }; }
    if($("art-form")) $("art-form").onsubmit=function(e){ e.preventDefault(); checkArticle(); };
    if($("art-in")){
      $("art-in").focus();
      $("art-in").oninput=function(){ typed=$("art-in").value.toLowerCase().replace(/[^a-y]/g,"").slice(0,2); $("art-in").value=typed; };
    }
    if($("btn-check-art")) $("btn-check-art").onclick=checkArticle;
    if($("btn-hint-art")) $("btn-hint-art").onclick=function(){ state._ahint=Math.min(3,(state._ahint||0)+1); render(); };
    if($("btn-use-paste")) $("btn-use-paste").onclick=function(){
      var t=(( $("art-paste") && $("art-paste").value )||"").trim();
      if(!t){ toast("先貼文"); return; }
      state.customArt=t; ARTICLES.custom={title:"自訂",text:t}; state.articleId="custom"; state._ai=null; state._ahint=0; lastHan=""; save(); render(); toast("用自訂篇");
    };
    if($("btn-skip-art")) $("btn-skip-art").onclick=function(){ state._ai=(state._ai||0)+1; state._ahint=0; typed=""; skipUnknown(); render(); };
    if($("btn-reset")) $("btn-reset").onclick=function(){ if(confirm("清進度?")){ state=blank(); save(); render(); } };
  }
  if(!window.SUCHENG||!SUCHENG.chars){ $("main").innerHTML="<p class='boot-err'>字庫載入失敗</p>"; return; }
  render();
})();
