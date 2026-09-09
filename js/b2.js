  function ensureWuse(){
    if(document.getElementById("wuse-css")) return;
    var l=document.createElement("link");
    l.id="wuse-css"; l.rel="stylesheet"; l.href="css/wuse.css?v=19";
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
    if(val===row.sc){ markRight(drill.han); if(drill.timed) drill.got+=1; toast("啲"); startDrill(drill.pool, drill.timed); setTimeout(render,200); }
    else { drill.misses+=1; drill.hint=Math.min(3,drill.misses); markWrong(drill.han); render(); }
  }
  function openLesson(id){
    var l=LESSONS.find(function(x){return x.id===id;});
    if(!l) return go("learn");
    if(l.kind==="roots") return go("roots");
    if(l.kind==="rootquiz"){ quiz=null; startQuiz(); return go("rootquiz"); }
    if(l.kind==="article"){ state.articleId=l.article; state._ai=null; return go("article"); }
    state.pool=l.pool||"starter"; startDrill(state.pool, l.kind==="timed"); go("drill");
  }
  function bindImeKeys(el){
    if(!el) return;
    el.onkeydown=function(e){
      if(e.key===" "){ e.preventDefault(); pickNum(1); }
      else if(e.key==="Enter"){ e.preventDefault(); pickNum(1); }
      else if("123456789".indexOf(e.key)>=0){ e.preventDefault(); pickNum(+e.key); }
      else if(e.key==="=" || e.key==="PageDown"){ e.preventDefault(); var p=pageCands(); candPage=(candPage+1)%p.pages; render(); }
      else if(e.key==="Backspace"){ e.preventDefault(); typed=String(typed||"").slice(0,-1); candPage=0; render(); }
      else if(e.key==="Escape"){ e.preventDefault(); typed=""; candPage=0; render(); }
    };
  }
  function bind(){
    document.querySelectorAll("[data-view]").forEach(function(b){ b.onclick=function(){ if(b.getAttribute("data-pool")) state.pool=b.getAttribute("data-pool"); if(b.getAttribute("data-view")==="drill") startDrill(state.pool||"starter", false); if(b.getAttribute("data-view")==="article") state._ai=null; go(b.getAttribute("data-view")); }; });
    document.querySelectorAll("[data-go]").forEach(function(b){ b.onclick=function(){ openLesson(b.getAttribute("data-go")); }; });
    document.querySelectorAll("[data-pool]").forEach(function(b){ if(b.getAttribute("data-view")) return; b.onclick=function(){ state.pool=b.getAttribute("data-pool"); startDrill(state.pool, !!(drill&&drill.timed)); render(); }; });
    document.querySelectorAll("[data-art]").forEach(function(b){ b.onclick=function(){ state.articleId=b.getAttribute("data-art"); state._ai=null; render(); }; });
    document.querySelectorAll("[data-quiz]").forEach(function(b){ b.onclick=function(){ if(b.getAttribute("data-quiz")===quiz.ans){ quiz.streak+=1; startQuiz(); render(); } else { quiz.streak=0; toast("唔啲 "+quiz.ans); } }; });
    document.querySelectorAll("[data-k]").forEach(function(b){ b.onclick=function(){ typed=(typed+b.getAttribute("data-k")).slice(-2); var box=$("drill-in")||$("art-in"); if(box) box.value=typed; if(state.view==="article") render(); }; });
    document.querySelectorAll("[data-pick]").forEach(function(b){ b.onclick=function(){ var han=b.getAttribute("data-pick"); var n=pageCands().page.indexOf(han)+1; if(n) pickNum(n); else commitHan(han); }; });
    if($("drill-in")){ $("drill-in").focus(); $("drill-form").onsubmit=function(e){ e.preventDefault(); checkDrill(); }; }
    if($("btn-check")) $("btn-check").onclick=checkDrill;
    if($("btn-hint")) $("btn-hint").onclick=function(){ if(drill){ drill.hint=Math.min(3,(drill.hint||0)+1); render(); } };
    if($("btn-skip")) $("btn-skip").onclick=function(){ startDrill(drill.pool, drill.timed); render(); };
    if($("look-in")){ $("look-in").focus(); $("look-in").oninput=function(){ state._q=$("look-in").value; render(); if($("look-in")){ $("look-in").focus(); $("look-in").value=state._q; } }; }
    if($("art-form")) $("art-form").onsubmit=function(e){ e.preventDefault(); pickNum(1); };
    if($("art-in")){
      $("art-in").focus();
      $("art-in").oninput=function(){ typed=$("art-in").value.toLowerCase().replace(/[^a-y]/g,"").slice(0,2); candPage=0; render(); if($("art-in")){ $("art-in").focus(); $("art-in").value=typed; } };
      bindImeKeys($("art-in"));
    }
    if($("btn-use-paste")) $("btn-use-paste").onclick=function(){
      var t=(( $("art-paste") && $("art-paste").value )||"").trim();
      if(!t){ toast("先貼文"); return; }
      state.customArt=t; ARTICLES.custom={title:"自訂",text:t}; state.articleId="custom"; state._ai=null; save(); render(); toast("用自訂篇");
    };
    if($("btn-skip-art")) $("btn-skip-art").onclick=function(){ var art=ARTICLES[state.articleId]||ARTICLES.guan; state._ai=(state._ai||0)+1; render(); };
    if($("btn-reset")) $("btn-reset").onclick=function(){ if(confirm("清進度?")){ state=blank(); save(); render(); } };
  }
  if(!window.SUCHENG||!SUCHENG.chars){ $("main").innerHTML="<p class='boot-err'>字庫載入失敗</p>"; return; }
  render();
})();
