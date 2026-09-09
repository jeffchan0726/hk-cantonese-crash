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
    if(val===row.sc){ markRight(drill.han); if(drill.timed) drill.got+=1; toast("啲"); startDrill(drill.pool, drill.timed); setTimeout(render,200); }
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
    document.querySelectorAll("[data-quiz]").forEach(function(b){ b.onclick=function(){ if(b.getAttribute("data-quiz")===quiz.ans){ quiz.streak+=1; startQuiz(); render(); } else { quiz.streak=0; toast("唔啲 "+quiz.ans); } }; });
    document.querySelectorAll("[data-k]").forEach(function(b){ b.onclick=function(){ typed=(typed+b.getAttribute("data-k")).slice(-2); var box=$("drill-in")||$("type-in")||$("art-in"); if(box) box.value=typed; if(state.view==="type"||state.view==="article") render(); }; });
    document.querySelectorAll("[data-pick]").forEach(function(b){ b.onclick=function(){ var han=b.getAttribute("data-pick"); var n=pageCands().page.indexOf(han)+1; if(n) pickNum(n); else commitHan(han); }; });
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
    if($("art-form")) $("art-form").onsubmit=function(e){ e.preventDefault(); pickNum(1); };
    if($("art-in")){
      $("art-in").focus();
      $("art-in").oninput=function(){ typed=$("art-in").value.toLowerCase().replace(/[^a-y]/g,"").slice(0,2); candPage=0; render(); if($("art-in")){ $("art-in").focus(); $("art-in").value=typed; } };
      $("art-in").onkeydown=function(e){
        if(e.key===" "){ e.preventDefault(); pickNum(1); }
        else if(e.key==="1"||e.key==="2"||e.key==="3"||e.key==="4"){ e.preventDefault(); pickNum(+e.key); }
        else if(e.key==="="){ e.preventDefault(); var p=pageCands(); candPage=(candPage+1)%p.pages; render(); }
      };
    }
    if($("btn-skip-art")) $("btn-skip-art").onclick=function(){ var art=ARTICLES[state.articleId]||ARTICLES.guan; state._ai=(state._ai||0)+1; render(); };
    if($("btn-reset")) $("btn-reset").onclick=function(){ if(confirm("清進度?")){ state=blank(); save(); render(); } };
  }
  if(!window.SUCHENG||!SUCHENG.chars){ $("main").innerHTML="<p class='boot-err'>字庫載入失敗</p>"; return; }
  render();
})();
