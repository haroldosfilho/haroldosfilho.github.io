(function(){
  "use strict";
  var LETRAS = ["A","B","C","D","E"];
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
      var alts = q.alts.map(function(a, j){
        return '<li><button class="alt" type="button" data-j="' + j + '">' +
               '<span class="letra">' + LETRAS[j] + '</span><span>' + a + '</span></button></li>';
      }).join("");
      art.innerHTML =
        '<p class="num">Questão ' + (i+1) + ' &middot; ' + q.assunto + '</p>' +
        '<p class="enun">' + q.enun + '</p>' +
        '<ul class="alts">' + alts + '</ul>' +
        '<p class="fb oculto"></p>' +
        (q.sol ? '<div class="sol oculto"><h4>Resolução</h4>' + q.sol + '</div>' : '');
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
