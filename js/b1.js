  function kbHtml(hintKeys){
    var raw=String(hintKeys||"").toUpperCase();
    var first=raw.charAt(0), last=raw.length>1?raw.charAt(raw.length-1):"";
    return "<div class='kb-dock'><div class='kb'>"+KEYS.map(function(row){ return "<div class='kb-row'>"+row.split("").map(function(k){ var cls="k"+(k===first?" hint h0":"")+(last&&k===last&&k!==first?" hint h1":"")+(last&&k===last&&k===first?" h1":""); return "<button type='button' class='"+cls+"' data-k='"+k.toLowerCase()+"'><b>"+k+"</b><small>"+(SUCHENG.map[k]||"")+"</small></button>"; }).join("")+"</div>"; }).join("")+"</div></div>";
  }
  function wchip(k,i){
    k=String(k||"").toUpperCase();
    return "<span class='wchip c"+(i%5)+"'><b>"+(SUCHENG.map[k]||k)+"</b><small>"+k+"</small></span>";
  }
  function codeChips(han, level){
    var row=info(han); if(!row||!level) return "";
    var sc=String(row.sc||"").toUpperCase();
    var cj=String(row.cj||"").toUpperCase();
    var html="";
    if(level>=1 && sc[0]) html+=wchip(sc[0],0);
    if(level>=2){
      if(sc.length>1) html+=wchip(sc[sc.length-1],1);
      else if(sc[0]) html+=wchip(sc[0],1);
    }
    if(level>=3){
      html+="<div class='wfull'>";
      cj.split("").forEach(function(k,i){ html+=wchip(k,i); });
      html+="</div><div class='wpart'>"+analyzeOf(han)+"</div>";
    }
    return "<div class='wchips'>"+html+"</div>";
  }
  function htmlHome(){
    var next=LESSONS.find(function(l){ return !state.lessonsDone[l.id]; })||LESSONS[0];
    return "<div class='home-grid'><section class='hero'><div class='kicker'>SUCHENG</div><h1>只打頭尾兩碼</h1><p class='lede'>「港」EU 水山。「說」YU 卜山。「行」HN 彳/丁。</p><div class='stats'><div class='stat'><b>"+(state.streak||0)+"</b><span>連續日</span></div><div class='stat'><b>"+(state.correct||0)+"</b><span>拆啦</span></div><div class='stat'><b>"+acc()+"%</b><span>準確率</span></div></div></section><section class='path'><article class='path-card'><div><h3>繼續："+next.title+"</h3><p>"+next.blurb+"</p></div><button class='go' data-go='"+next.id+"'>去</button></article><article class='path-card'><div><h3>課程</h3><p>字根→粵語→文章</p></div><button class='go' data-view='learn'>去</button></article><article class='path-card'><div><h3>拆碼</h3><p>大字分色，錯一次提頭碼</p></div><button class='go' data-view='drill'>去</button></article><article class='path-card'><div><h3>文章</h3><p>潮文／自訂篇，對字打碼</p></div><button class='go' data-view='article'>去</button></article><article class='path-card'><div><h3>查碼</h3><p>漢字↔速成</p></div><button class='go' data-view='lookup'>去</button></article></section></div>";
  }
  function htmlLearn(){ return "<section class='panel'><h1>課程</h1><div class='path'>"+LESSONS.map(function(l){ return "<article class='path-card'><div><h3>"+l.title+"</h3><p>"+l.blurb+"</p></div><button class='go' data-go='"+l.id+"'>去</button></article>"; }).join("")+"</div></section>"; }
  function htmlRoots(){ return "<section class='panel'><h1>廿四字根</h1><div class='root-grid'>"+"ABCDEFGHIJKLMNOPQRSTUVWY".split("").map(function(k){ return "<div class='root'><b>"+SUCHENG.map[k]+"</b><span>"+k+"</span></div>"; }).join("")+"</div><div class='row' style='margin-top:16px'><button class='btn' data-go='rootquiz'>測驗</button></div></section>"; }
  function startQuiz(){ var keys="ABCDEFGHIJKLMNOPQRSTUVWY".split(""); var ans=pick(keys), opts=[ans]; while(opts.length<4){ var k=pick(keys); if(opts.indexOf(k)<0) opts.push(k);} opts.sort(function(){return Math.random()-0.5;}); quiz={ans:ans,opts:opts,streak:(quiz&&quiz.streak)||0,n:(quiz&&quiz.n)||0}; }
  function htmlQuiz(){ if(!quiz) startQuiz(); return "<section class='panel'><h1>「"+SUCHENG.map[quiz.ans]+"」係邊粒鍵？</h1><div class='quiz-opts'>"+quiz.opts.map(function(k){ return "<button type='button' data-quiz='"+k+"'>"+k+"<br><small>"+SUCHENG.map[k]+"</small></button>"; }).join("")+"</div></section>"; }
  function htmlDrill(){
    if(!drill||!info(drill.han)) startDrill(state.pool||"starter", !!(drill&&drill.timed));
    if(!drill) return "<section class='panel'><p>冇字</p></section>";
    var row=info(drill.han);
    var hintKeys=drill.hint===0?"":(drill.hint===1?row.sc[0]:row.sc);
    var chips=[["starter","常用"],["cantonese","粵語"],["hard","難字"],["singles","單碼"],["wrong","錯字本"],["all","全部"]].map(function(x){ return "<button class='chip"+((state.pool||"starter")===x[0]?" on":"")+"' data-pool='"+x[0]+"'>"+x[1]+"</button>"; }).join("");
    var bar=drill.timed?("<div class='speedbar'><b>"+(remain||0)+"s</b><span>"+(drill.got||0)+" 字</span><span>"+wpmOf(drill.got,drill.t0)+" 字/分</span></div>"):"";
    var layer=drill.hint===0?"未提示":(drill.hint===1?"第 1 層：頭碼":(drill.hint===2?"第 2 層：頭+尾":"第 3 層：全拆"));
    return "<div class='split'><section class='drill-card wuse'><div class='chips'>"+chips+"</div>"+bar+"<div class='wuse-stage'><div class='char'>"+drill.han+"</div>"+codeChips(drill.han, drill.hint)+"<div class='wlayer'>"+layer+"</div></div><form id='drill-form'><input id='drill-in' type='text' maxlength='2' value='"+typed+"' placeholder='打頭尾兩碼' autocomplete='off'></form><div class='row'><button class='btn' id='btn-check' type='button'>核對</button><button class='ghost' id='btn-hint' type='button'>提示</button><button class='ghost' id='btn-skip' type='button'>跳過</button></div></section>"+kbHtml(hintKeys)+"</div>";
  }
  function htmlArticle(){
    if(state.customArt) ARTICLES.custom={title:"自訂",text:state.customArt};
    var art=ARTICLES[state.articleId]||ARTICLES.guan;
    if(state._ai==null){ var i=[].slice.call(art.text).findIndex(function(c){return I.byHan.has(c);}); state._ai=i<0?0:i; }
    skipUnknown();
    var html=[].slice.call(art.text).map(function(ch,i){ return "<span class='"+(i<state._ai?"done":i===state._ai?"cur":"todo")+"'>"+ch+"</span>"; }).join("");
    var ids=Object.keys(ARTICLES);
    var chips=ids.map(function(id){ return "<button class='chip"+(state.articleId===id?" on":"")+"' data-art='"+id+"'>"+ARTICLES[id].title+"</button>"; }).join("");
    var cur=art.text[state._ai]||"";
    var row=cur?info(cur):null;
    var hint=state._ahint||0;
    var hintKeys=(!row||hint===0)?"":(hint===1?row.sc[0]:row.sc);
    var layer=hint===0?"對住黃色嗰隻打頭尾碼":(hint===1?"第 1 層：頭碼":(hint===2?"第 2 層：頭+尾":"第 3 層：全拆"));
    var done=state._ai||0, total=art.text.length;
    var speed="<div class='speedbar'><span>"+done+"/"+total+"</span></div>";
    var doneBox=state._ai>=art.text.length?"<p class='lede'>打完呢篇。</p>":"";
    return "<div class='split'><section class='panel'><div class='chips'>"+chips+"</div>"+speed+"<div class='passage'>"+html+"</div>"+codeChips(cur, hint)+"<div class='wlayer'>"+layer+"</div>"+doneBox+"<form id='art-form'><input id='art-in' type='text' maxlength='2' autocomplete='off' value='"+typed+"' placeholder='打頭尾兩碼'></form><div class='row'><button class='btn' id='btn-check-art' type='button'>核對</button><button class='ghost' id='btn-hint-art' type='button'>提示</button><button class='ghost' id='btn-skip-art' type='button'>跳過</button></div><textarea id='art-paste' rows='3' placeholder='貼一篇自己嘅文來打'>"+(state.customArt||"")+"</textarea><div class='row'><button class='btn' id='btn-use-paste' type='button'>用呢篇打</button></div></section>"+analysisBox(lastHan)+kbHtml(hintKeys)+"</div>";
  }
  function htmlReview(){
    return "<section class='panel'><h1>錯字本</h1>"+(state.wrongBook.length?state.wrongBook.map(function(h){ var r=info(h); return "<div class='item'><b>"+h+"</b><span>"+(r?r.sc.toUpperCase():"")+"</span></div>"; }).join(""):"<p class='lede'>未有錯字</p>")+"</section>";
  }
  function htmlLookup(){
    var q=(state._q||"").trim(), body="";
    if(q && I.byHan.has(q[0])) body=analysisBox(q[0]);
    else if(q){ var hits=I.bySc.get(q.toLowerCase())||[]; body=hits.map(function(h){return "<span class='cand'>"+h+"</span>";}).join(" "); }
    return "<section class='panel'><h1>查碼</h1><input id='look-in' type='text' value='"+q+"'>"+body+"<p class='lede'>說 = YU 卜山 · 行 = 彳/丁</p></section>";
  }
  function htmlMe(){ return "<section class='panel'><h1>進度</h1><div class='stats'><div class='stat'><b>"+(state.streak||0)+"</b><span>連續</span></div><div class='stat'><b>"+(state.correct||0)+"</b><span>拆啦</span></div><div class='stat'><b>"+acc()+"%</b><span>%</span></div></div><button class='ghost' id='btn-reset' type='button'>清進度</button></section>"; }
