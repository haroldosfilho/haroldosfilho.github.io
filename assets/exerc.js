(function(){
  var LETRAS = ["A","B","C","D","E"];
  function bonito(h){
    if(h.indexOf('class="frac"') >= 0) return h;
    return h.replace(/((?:&radic;|\u221a)?\s*(?:\d+|[a-z]))\u2044(\d+|[a-z])/g, function(_, a, b){
      return '<span class="frac"><span>' + a.trim() + '</span><span>' + b + '</span></span>';
    });
  }
  var alvo = document.getElementById("quiz");
  if(!alvo || !window.QUESTOES) return;
  var Q = window.QUESTOES, total = Q.length;
  var respondidas = 0, acertos = 0;

  var placar = document.getElementById("placar");
  function atualiza(){
    placar.innerHTML = "Respondidas <b>" + respondidas + "</b> de " + total +
      " &middot; acertos <b>" + acertos + "</b>";
  }

  function monta(){
    alvo.innerHTML = "";
    respondidas = 0; acertos = 0; atualiza();
    Q.forEach(function(q, i){
      var art = document.createElement("article");
      art.className = "q";
      var textos = q.alts.map(function(a){ return a.replace(/<[^>]+>/g,""); });
      var curtas = textos.every(function(t){ return t.length <= 14; });
      var alts = q.alts.map(function(a, j){
        return '<li><button class="alt" type="button" data-j="' + j + '">' +
               '<span class="letra">(' + LETRAS[j] + ')</span><span>' + bonito(a) + '</span></button></li>';
      }).join("");
      art.innerHTML =
        '<div class="qcab"><span class="qn">' + (i+1) + '&ordf; QUEST\u00c3O</span>' +
        '<span class="qt">' + (q.assunto || "") + '</span></div>' +
        '<div class="qcorpo"><p class="enun">' + bonito(q.enun) + '</p>' +
        '<ul class="alts' + (curtas ? ' curtas' : '') + '">' + alts + '</ul>' +
        '<p class="fb oculto"></p>' +
        (q.sol ? '<div class="sol oculto"><h4>Resolu\u00e7\u00e3o</h4>' + bonito(q.sol) + '</div>' : '') +
        '</div>';
      alvo.appendChild(art);

      var botoes = art.querySelectorAll(".alt");
      var fb = art.querySelector(".fb");
      var sol = art.querySelector(".sol");
      botoes.forEach(function(b){
        b.addEventListener("click", function(){
          if(art.dataset.feito) return;
          art.dataset.feito = "1";
          var j = Number(b.dataset.j), ok = (j === q.correta);
          botoes.forEach(function(x){
            x.disabled = true;
            if(Number(x.dataset.j) === q.correta) x.dataset.estado = "certa";
          });
          if(!ok) b.dataset.estado = "errada";
          fb.textContent = ok ? "Certo." : "Não é essa. A resposta é a alternativa " + LETRAS[q.correta] + ".";
          fb.className = "fb " + (ok ? "ok" : "no");
          sol.classList.remove("oculto");
          respondidas++; if(ok) acertos++;
          atualiza();
        });
      });
    });
  }

  var refazer = document.getElementById("refazer");
  if(refazer) refazer.addEventListener("click", function(){
    monta(); window.scrollTo({top:0, behavior:"smooth"});
  });

  monta();
})();
