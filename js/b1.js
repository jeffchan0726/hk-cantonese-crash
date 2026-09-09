  function kbHtml(hintKeys){
    var set={};
    String(hintKeys||"").toUpperCase().split("").forEach(function(k){ set[k]=1; });
    return "<div class='kb-dock'><div class='kb'>"+KEYS.map(function(row){ return "<div class='kb-row'>"+row.split("").map(function(k){ return "<button type='button' class='k"+(set[k]?" hint":"")+"' data-k='"+k.toLowerCase()+"'><b>"+k+"</b><small>"+(SUCHENG.map[k]||"")+"</small></button>"; }).join("")+"</div>"; }).join("")+"</div></div>";
  }
  function htmlHome(){
    var next=LESSONS.find(function(l){ return !state.lessonsDone[l.id]; })||LESSONS[0];
    return "<div class='home-grid'><section class='hero'><div class='kicker'>SUCHENG</div><h1>只打頭尾兩碼</h1><p class='lede'>「港」EU 水山。「說」YU 卜山。「行」HN 彳/丁。</p><div class='stats'><div class='stat'><b>"+(state.streak||0)+"</b><span>連續日</span></div><div class='stat'><b>"+(state.correct||0)+"</b><span>拆啲</span></div><div class='stat'><b>"+acc()+"%</b><span>準確率</span></div></div></section><section class='path'><article class='path-card'><div><h3>繼續："+next.title+"</h3><p>"+next.blurb+"</p></div><button class='go' data-go='"+next.id+"'>去</button></article><article class='path-card'><div><h3>課程</h3><p>字根→粵語→文章</p></div><button class='go' data-view='learn'>去</button></article><article class='path-card'><div><h3>拆碼</h3><p>常用/難字</p></div><button class='go' data-view='drill'>去</button></article><article class='path-card'><div><h3>打字選字</h3><p>1–9 擇字</p></div><button class='go' data-view='type'>去</button></article><article class='path-card'><div><h3>查碼</h3><p>漢字↔速成</p></div><button class='go' data-view='lookup'>去</button></article></section></div>";
  }
  function htmlLearn(){ return "<section class='panel'><h1>課程</h1><div class='path'>"+LESSONS.map(function(l){ return "<article class='path-card'><div><h3>"+l.title+"</h3><p>"+l.blurb+"</p></div><button class='go' data-go='"+l.id+"'>去</button></article>"; }).join("")+"</div></section>"; }
  function htmlRoots(){ return "<section class='panel'><h1>廿四字根</h1><div class='root-grid'>"+"ABCDEFGHIJKLMNOPQRSTUVWY".split("").map(function(k){ return "<div class='root'><b>"+SUCHENG.map[k]+"</b><span>"+k+"</span></div>"; }).join("")+"</div><div class='row' style='margin-top:16px'><button class='btn' data-go='rootquiz'>測驗</button></div></section>"; }
  function startQuiz(){ var keys="ABCDEFGHIJKLMNOPQRSTUVWY".split(""); var ans=pick(keys), opts=[ans]; while(opts.length<4){ var k=pick(keys); if(opts.indexOf(k)<0) opts.push(k);} opts.sort(function(){return Math.random()-0.5;}); quiz={ans:ans,opts:opts,streak:(quiz&&quiz.streak)||0,n:(quiz&&quiz.n)||0}; }
  function htmlQuiz(){ if(!quiz) startQuiz(); return "<section class='panel'><h1>「"+SUCHENG.map[quiz.ans]+"」係邊粒鍵？</h1><div class='quiz-opts'>"+quiz.opts.map(function(k){ return "<button type='button' data-quiz='"+k+"'>"+k+"<br><small>"+SUCHENG.map[k]+"</small></button>"; }).join("")+"</div></section>"; }
  function htmlDrill(){
    if(!drill||!info(drill.han)) startDrill(state.pool||"starter", !!(drill&&drill.timed));
    if(!drill) return "<section class='panel'><p>冇字</p></section>";
    var row=info(drill.han);
    var hintKeys=drill.hint===1?row.sc[0]:(drill.hint>=2?row.sc:"");
    var showAns=drill.hint>=2?row.sc.toUpperCase():(drill.hint===1?row.sc[0].toUpperCase()+"...":"");
    var chips=[["starter","常用"],["cantonese","粵語"],["hard","難字"],["singles","單碼"],["wrong","錯字本"],["all","全部"]].map(function(x){ return "<button class='chip"+((state.pool||"starter")===x[0]?" on":"")+"' data-pool='"+x[0]+"'>"+x[1]+"</button>"; }).join("");
    return "<div class='split'><section class='drill-card'><div class='chips'>"+chips+"</div><div class='char'>"+drill.han+"</div><div class='answer'>"+showAns+"</div><form id='drill-form'><input id='drill-in' type='text' maxlength='2' value='"+typed+"'></form><div class='row'><button class='btn' id='btn-check' type='button'>核對</button><button class='ghost' id='btn-hint' type='button'>提示</button><button class='ghost' id='btn-skip' type='button'>跳過</button></div></section>"+kbHtml(hintKeys)+"</div>";
  }
  function imeSlots(){
    var pack=pageCands();
    var slots="";
    for(var i=0;i<9;i++){
      var h=pack.page[i];
      var on=i===0&&h?" on":"";
      if(h) slots+="<button class='ime-item"+on+"' type='button' data-pick='"+h+"'><b>"+(i+1)+"</b><span class='ch'>"+h+"</span></button>";
      else slots+="<div class='ime-item empty'><b>"+(i+1)+"</b><span class='ch'></span></div>";
    }
    var dots="";
    for(var p=0;p<pack.pages;p++) dots+="<i class='"+(p===candPage?"on":"")+"'></i>";
    var glyphs=rootsStr(typed);
    var win=pack.all.length?("<div class='ime-win'><div class='ime-col'><div class='ime-cands'>"+slots+"</div></div><div class='ime-dots'>"+dots+"</div></div>"):"";
    return "<div class='ime'><div class='ime-comp'><span class='comp-han'>"+(glyphs||"")+"</span><span class='raw'>"+(typed.toUpperCase()||"")+"</span></div>"+win+"</div>";
  }
  function htmlType(){
    var out=(outText||"").split("").map(function(ch){ return ch===lastHan?"<span class='red'>"+ch+"</span>":ch; }).join("");
    return "<div class='split'><section class='panel'><div class='kicker'>打字 · 速成 IME</div><h1>打完碼用 1–9 擇字</h1><div class='outbox'>"+(out||"<span class='lede'>尚未打字</span>")+"</div>"+imeSlots()+"<form id='type-form'><input id='type-in' type='text' maxlength='2' autocomplete='off' placeholder='aa / hn / yu' value='"+typed+"'></form></section>"+analysisBox(lastHan)+kbHtml(typed)+"</div>";
  }
  function htmlArticle(){
    var art=ARTICLES[state.articleId]||ARTICLES.guan;
    if(state._ai==null){ var i=[].slice.call(art.text).findIndex(function(c){return I.byHan.has(c);}); state._ai=i<0?0:i; }
    var html=[].slice.call(art.text).map(function(ch,i){ return "<span class='"+(i<state._ai?"done":i===state._ai?"cur":"todo")+"'>"+ch+"</span>"; }).join("");
    var chips=Object.keys(ARTICLES).map(function(id){ return "<button class='chip"+(state.articleId===id?" on":"")+"' data-art='"+id+"'>"+ARTICLES[id].title+"</button>"; }).join("");
    var cur=art.text[state._ai]||"";
    return "<div class='split'><section class='panel'><div class='chips'>"+chips+"</div><div class='passage'>"+html+"</div>"+imeSlots()+"<form id='art-form'><input id='art-in' type='text' maxlength='2' autocomplete='off' value='"+typed+"'></form></section>"+analysisBox(cur||lastHan)+"<div class='row skip-row'><button class='ghost' id='btn-skip-art' type='button'>跳過</button></div>"+kbHtml(typed)+"</div>";
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
  function htmlMe(){ return "<section class='panel'><h1>進度</h1><div class='stats'><div class='stat'><b>"+(state.streak||0)+"</b><span>連續日</span></div><div class='stat'><b>"+(state.correct||0)+"</b><span>拆啲</span></div><div class='stat'><b>"+acc()+"%</b><span>%</span></div></div><button class='ghost' id='btn-reset' type='button'>清進度</button></section>"; }
