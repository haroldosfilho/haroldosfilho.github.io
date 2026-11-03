(function(){
  "use strict";
  var alvo = document.getElementById("teoria");
  if(!alvo || !window.TEORIA) return;
  var T = window.TEORIA, temas = [];
  T.forEach(function(t){ if(temas.indexOf(t.tema) < 0) temas.push(t.tema); });
  temas.sort(function(a,b){ return a.localeCompare(b,"pt-BR"); });
  var html = "";
  temas.forEach(function(tema){
    html += '<h3 class="grupo">' + tema + '</h3>';
    T.filter(function(t){ return t.tema === tema; }).forEach(function(t){
      html += '<details class="teo"><summary>' + t.titulo + '</summary><div class="teo-corpo">' +
              t.corpo +
              (t.exemplo ? '<p class="teo-ex"><b>Exemplo.</b> ' + t.exemplo + '</p>' : '') +
              '</div></details>';
    });
  });
  alvo.innerHTML = html;
})();
