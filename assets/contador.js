/* Contador de visitas — GoatCounter (sem cookies, sem rastreio pessoal).
   Conta: haroldofilho.goatcounter.com. O número só aparece com a opção
   "allow using the visitor counter" ligada em Settings. */
(function () {
  "use strict";
  var CODIGO = "haroldofilho";
  if (CODIGO === "SEU" + "CODIGO") return;      // ainda não configurado
  var base = "https://" + CODIGO + ".goatcounter.com";

  // 1. registra a visita
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", base + "/count");
  document.head.appendChild(s);

  // 2. mostra o total acumulado
  var alvo = document.getElementById("visitas");
  if (!alvo) return;
  fetch(base + "/counter/TOTAL.json")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (d) {
      var n = parseInt(String(d.count).replace(/\D/g, ""), 10);
      if (!isFinite(n)) return;
      alvo.querySelector("b").textContent = n.toLocaleString("pt-BR");
      alvo.hidden = false;
    })
    .catch(function () { /* silencioso: nada aparece se o serviço falhar */ });
})();
