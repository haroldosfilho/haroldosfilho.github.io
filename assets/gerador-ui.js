(function(){
  "use strict";
  /* Endpoint do banco. Enquanto estiver vazio, nada é enviado:
     o caderno funciona e o resultado fica só na tela. */
  var ENDPOINT = "";

  var LETRAS = ["A","B","C","D","E"];
  function bonito(h){
    if(h.indexOf('class="frac"') >= 0) return h;
    return h.replace(/((?:&radic;|\u221a)?\s*(?:\d+|[a-z]))\u2044(\d+|[a-z])/g, function(_, a, b){
      return '<span class="frac"><span>' + a.trim() + '</span><span>' + b + '</span></span>';
    });
  }
  var form = document.getElementById("entrada");
  var areaQuiz = document.getElementById("area-quiz");
  var alvo = document.getElementById("quiz");
  var placar = document.getElementById("placar");
  var cab = document.getElementById("cab-caderno");
  var fimBox = document.getElementById("fim");
  if(!form || !alvo || !window.SEMENTES) return;

  var Q = [], respondidas = 0, acertos = 0, semente = 0, aluno = {};

  function atualiza(){
    placar.innerHTML = "Respondidas <b>" + respondidas + "</b> de " + Q.length +
      " &middot; acertos <b>" + acertos + "</b>";
  }

  function monta(){
    alvo.innerHTML = "";
    respondidas = 0; acertos = 0; atualiza();
    fimBox.hidden = true; fimBox.innerHTML = "";
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
      var fb = art.querySelector(".fb"), sol = art.querySelector(".sol");
      Array.prototype.forEach.call(botoes, function(b){
        b.addEventListener("click", function(){
          if(art.dataset.feito) return;
          art.dataset.feito = "1";
          var j = Number(b.dataset.j), ok = (j === q.correta);
          q.marcada = j;
          Array.prototype.forEach.call(botoes, function(x){
            x.disabled = true;
            if(Number(x.dataset.j) === q.correta) x.dataset.estado = "certa";
          });
          if(!ok) b.dataset.estado = "errada";
          fb.textContent = ok ? "Certo." : "Não é essa. A resposta é a alternativa " + LETRAS[q.correta] + ".";
          fb.className = "fb " + (ok ? "ok" : "no");
          sol.classList.remove("oculto");
          respondidas++; if(ok) acertos++;
          atualiza();
          if(respondidas === Q.length) encerra();
        });
      });
    });
  }

  function porTema(){
    var m = {};
    Q.forEach(function(q){
      m[q.assunto] = m[q.assunto] || { n:0, c:0 };
      m[q.assunto].n++;
      if(q.marcada === q.correta) m[q.assunto].c++;
    });
    return m;
  }

  function encerra(){
    var m = porTema(), linhas = "", fracos = [];
    Object.keys(m).sort().forEach(function(t){
      var v = m[t];
      linhas += '<tr><td>' + t + '</td><td class="mono">' + v.c + ' de ' + v.n + '</td></tr>';
      if(v.c < v.n) fracos.push(t);
    });
    fimBox.innerHTML =
      '<h3>Resultado</h3>' +
      '<p>Você acertou <b>' + acertos + '</b> de <b>' + Q.length + '</b>.</p>' +
      '<table class="tf"><tbody>' + linhas + '</tbody></table>' +
      (fracos.length
        ? '<p>Os assuntos a revisar primeiro são: <b>' + fracos.join(", ") + '</b>. O <a href="estudar.html#incidencia">mapa de incidência</a> diz quanto cada um pesa na sua banca.</p>'
        : '<p>Caderno inteiro correto. Gere outro: os números mudam a cada vez.</p>') +
      '<p class="meta" id="envio"></p>' +
      '<div class="acoes"><button class="btn cheio" type="button" id="outro">Gerar outro caderno</button>' +
      '<a class="btn" href="treinar.html">Treino por assunto</a></div>';
    fimBox.hidden = false;
    document.getElementById("outro").addEventListener("click", function(){
      semente = Date.now() % 2147483647;
      Q = caderno(semente);
      cab.textContent = "Caderno nº " + semente + " · " + Q.length + " questões";
      monta();
      cab.scrollIntoView({ block:"start" });
    });
    envia();
  }

  function envia(){
    var aviso = document.getElementById("envio");
    if(!ENDPOINT){
      aviso.textContent = "Resultado não enviado: o registro ainda não está ligado neste site.";
      return;
    }
    fetch(ENDPOINT, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        nome: aluno.nome || "", email: aluno.email, semente: semente,
        acertos: acertos, total: Q.length,
        temas: porTema(), quando: new Date().toISOString()
      })
    }).then(function(r){
      aviso.textContent = r.ok ? "Resultado registrado." : "Não foi possível registrar o resultado agora.";
    }).catch(function(){
      aviso.textContent = "Não foi possível registrar o resultado agora.";
    });
  }

  /* mistura: moldes sorteados + questões do banco, uma por área */
  function caderno(s){
    var lista = window.SEMENTES.gerar(s, 1);
    if(!window.BLOCOS) return lista;
    var r = s;
    function prox(){ r = (r * 1103515245 + 12345) >>> 0; return r / 4294967296; }
    window.BLOCOS.forEach(function(b){
      if(!b.q.length) return;
      if(prox() < 0.5) return;                       // nem toda área entra
      var q = b.q[Math.floor(prox() * b.q.length)];
      lista.push({ assunto: b.nome, enun: q.enun, alts: q.alts,
                   correta: q.correta, sol: q.sol || "" });
    });
    for(var i = lista.length - 1; i > 0; i--){
      var j = Math.floor(prox() * (i + 1)), t = lista[i]; lista[i] = lista[j]; lista[j] = t;
    }
    return lista;
  }

  form.addEventListener("submit", function(ev){
    ev.preventDefault();
    aluno = {
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim()
    };
    try{ localStorage.setItem("aluno-gerador", JSON.stringify(aluno)); }catch(e){}
    semente = Date.now() % 2147483647;
    Q = caderno(semente);
    form.hidden = true;
    areaQuiz.hidden = false;
    cab.textContent = "Caderno nº " + semente + " · " + Q.length + " questões"
                      + (aluno.nome ? " · " + aluno.nome : "");
    monta();
  });

  try{
    var g = JSON.parse(localStorage.getItem("aluno-gerador") || "{}");
    if(g.email){ document.getElementById("email").value = g.email; }
    if(g.nome){ document.getElementById("nome").value = g.nome; }
  }catch(e){}
})();
