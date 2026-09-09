(function(){
  try {
    var src = atob((window.__SC1||"") + (window.__SC2||""));
    var el = document.createElement("script");
    el.text = src;
    document.body.appendChild(el);
  } catch (e) {
    var m = document.getElementById("main");
    if (m) m.innerHTML = "<pre class='boot-err'>" + e + "</pre>";
  }
})();
