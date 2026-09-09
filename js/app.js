(function(){
  fetch("js/app.src.js?v=13").then(function(r){
    if(!r.ok) throw new Error("app.src "+r.status);
    return r.text();
  }).then(function(src){
    var el=document.createElement("script");
    el.text=src;
    document.body.appendChild(el);
  }).catch(function(e){
    var m=document.getElementById("main");
    if(m) m.innerHTML="<pre class='boot-err'>"+String(e)+"</pre>";
  });
})();
