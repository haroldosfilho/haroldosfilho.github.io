(function(){
  "use strict";
  var LETRAS = ["A","B","C","D","E"];
  function bonito(h){
    // "5\u20442" vira fra\u00e7\u00e3o empilhada; n\u00e3o mexe no que j\u00e1 vem marcado
    if(h.indexOf('class="frac"') >= 0) return h;
    return h.replace(/(\d+|[a-z])\u2044(\d+|[a-z])/g, function(_, a, b){
      return '<span class="frac"><span>' + a + '</span><span>' + b + '</span></span>';
    });
  }
  var alvo = document.getElementById("quiz");
  var abas = document.getElementById("abas");
  if(!alvo || !window.BLOCOS) return;
  var B = window.BLOCOS, atual = 0;
  var placar = document.getElementById("placar");
  var respondidas = 0, acertos = 0, total = 0;

  function atualiza(){
    placar.innerHTML = "Respondidas <b>" + respondidas + "</b> de " + total +
      " &middot; acertos <b>" + acertos + "</b>";
  }

  function monta(){
    var Q = B[atual].q;
    total = Q.length; respondidas = 0; acertos = 0; atualiza();
    alvo.innerHTML = "";
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
      Array.prototype.forEach.call(botoes, function(b){
        b.addEventListener("click", function(){
          if(art.dataset.feito) return;
          art.dataset.feito = "1";
          var j = Number(b.dataset.j), ok = (j === q.correta);
          Array.prototype.forEach.call(botoes, function(x){
            x.disabled = true;
            if(Number(x.dataset.j) === q.correta) x.dataset.estado = "certa";
          });
          if(!ok) b.dataset.estado = "errada";
          fb.textContent = ok ? "Certo." : "Não é essa. A resposta é a alternativa " + LETRAS[q.correta] + ".";
          fb.className = "fb " + (ok ? "ok" : "no");
          if(sol) sol.classList.remove("oculto");
          respondidas++; if(ok) acertos++;
          atualiza();
        });
      });
    });
  }

  function montaAbas(){
    abas.innerHTML = "";
    B.forEach(function(b, i){
      var a = document.createElement("button");
      a.type = "button"; a.className = "aba"; a.textContent = b.nome;
      if(i === atual) a.setAttribute("aria-current","true");
      a.addEventListener("click", function(){
        atual = i;
        Array.prototype.forEach.call(abas.children, function(o){ o.removeAttribute("aria-current"); });
        a.setAttribute("aria-current","true");
        monta();
        document.getElementById("placar").scrollIntoView({block:"start"});
      });
      abas.appendChild(a);
    });
  }

  var refazer = document.getElementById("refazer");
  if(refazer) refazer.addEventListener("click", monta);
  montaAbas(); monta();
})();
