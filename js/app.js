(function(){
  Promise.all([
    fetch("js/a.js?v=20").then(function(r){ if(!r.ok) throw new Error("a.js "+r.status); return r.text(); }),
    fetch("js/b1.js?v=20").then(function(r){ if(!r.ok) throw new Error("b1.js "+r.status); return r.text(); }),
    fetch("js/b2.js?v=20").then(function(r){ if(!r.ok) throw new Error("b2.js "+r.status); return r.text(); })
  ]).then(function(parts){
    var el=document.createElement("script");
    el.text=parts[0]+parts[1]+parts[2];
    document.body.appendChild(el);
  }).catch(function(e){
    var m=document.getElementById("main");
    if(m) m.innerHTML="<pre class='boot-err'>"+String(e)+"</pre>";
  });
})();
