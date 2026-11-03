/* Laboratorio — animacoes em canvas. Sem bibliotecas. */
(function () {
  "use strict";

  function cor(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  }

  /* ajusta o canvas a largura do contenedor, com nitidez em telas retina */
  function ajusta(cv, razao) {
    var larg = cv.parentNode.clientWidth;
    var alt = Math.round(larg / razao);
    var dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(larg * dpr);
    cv.height = Math.round(alt * dpr);
    cv.style.width = larg + "px";
    cv.style.height = alt + "px";
    var ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, W: larg, H: alt };
  }

  function laco(pintar) {
    var rodando = true, t = 0, ultimo = null;
    function quadro(agora) {
      if (ultimo === null) ultimo = agora;
      var dt = (agora - ultimo) / 1000; ultimo = agora;
      if (rodando) t += dt;
      pintar(t);
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
    return {
      alterna: function () { rodando = !rodando; return rodando; },
      ehRodando: function () { return rodando; },
      def: function (v) { t = v; },
      ler: function () { return t; }
    };
  }

  /* ============================================================
     1. O seno como altura no circulo trigonometrico
     ============================================================ */
  function circuloTrig(raiz) {
    var cv = raiz.querySelector("canvas");
    var btn = raiz.querySelector("[data-play]");
    var vel = raiz.querySelector("[data-vel]");
    var cosChk = raiz.querySelector("[data-cos]");
    var leitura = raiz.querySelector("[data-leitura]");

    function pintar(t) {
      var g = ajusta(cv, 2.1), ctx = g.ctx, W = g.W, H = g.H;
      var preto = cor("--tx"), azul = cor("--ac2"), cinza = cor("--mu");
      ctx.clearRect(0, 0, W, H);

      var th = (t * (+vel.value)) % (2 * Math.PI);
      var R = Math.min(H * 0.38, W * 0.17);
      var cx = R + 34, cy = H / 2;
      var x0 = cx + R + 34, x1 = W - 14, esc = (x1 - x0) / (2 * Math.PI);

      /* eixos do circulo */
      ctx.lineWidth = 1; ctx.strokeStyle = cinza; ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - R - 12, cy); ctx.lineTo(cx + R + 12, cy);
      ctx.moveTo(cx, cy - R - 12); ctx.lineTo(cx, cy + R + 12);
      ctx.stroke(); ctx.globalAlpha = 1;

      /* circunferencia */
      ctx.lineWidth = 1.4; ctx.strokeStyle = preto;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

      var px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);

      /* projecoes */
      ctx.save();
      ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.strokeStyle = cinza;
      ctx.beginPath();
      ctx.moveTo(px, py); ctx.lineTo(px, cy);
      ctx.moveTo(px, py); ctx.lineTo(cx, py);
      ctx.stroke();
      ctx.restore();

      /* altura = seno, em azul e cheia */
      ctx.lineWidth = 2.6; ctx.strokeStyle = azul;
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();

      /* raio */
      ctx.lineWidth = 1.6; ctx.strokeStyle = preto;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

      /* arco do angulo */
      ctx.lineWidth = 1.2; ctx.strokeStyle = azul;
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.26, -th, 0, th > 0); ctx.stroke();

      /* ponto P */
      ctx.fillStyle = preto;
      ctx.beginPath(); ctx.arc(px, py, 3.6, 0, 2 * Math.PI); ctx.fill();

      /* eixo da curva */
      ctx.lineWidth = 1; ctx.strokeStyle = cinza; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke();
      ctx.globalAlpha = 1;

      /* marcas em pi/2 */
      ctx.font = "11px 'Source Sans 3', sans-serif";
      ctx.fillStyle = cinza; ctx.textAlign = "center";
      var marcas = [[Math.PI / 2, "π/2"], [Math.PI, "π"],
                    [3 * Math.PI / 2, "3π/2"], [2 * Math.PI, "2π"]];
      ctx.globalAlpha = 0.65;
      for (var i = 0; i < marcas.length; i++) {
        var mx = x0 + marcas[i][0] * esc;
        ctx.beginPath(); ctx.moveTo(mx, cy - 3); ctx.lineTo(mx, cy + 3); ctx.stroke();
        ctx.fillText(marcas[i][1], mx, cy + 16);
      }
      ctx.globalAlpha = 1;

      /* cosseno, opcional */
      if (cosChk.checked) {
        ctx.lineWidth = 1.4; ctx.strokeStyle = cinza;
        ctx.beginPath();
        for (var u = 0; u <= th + 1e-9; u += 0.01) {
          var X = x0 + u * esc, Y = cy - R * Math.cos(u);
          if (u === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();
        ctx.fillStyle = cinza;
        ctx.beginPath(); ctx.arc(x0 + th * esc, cy - R * Math.cos(th), 3, 0, 2 * Math.PI); ctx.fill();
      }

      /* curva do seno */
      ctx.lineWidth = 2.2; ctx.strokeStyle = azul;
      ctx.beginPath();
      for (var v = 0; v <= th + 1e-9; v += 0.01) {
        var Xs = x0 + v * esc, Ys = cy - R * Math.sin(v);
        if (v === 0) ctx.moveTo(Xs, Ys); else ctx.lineTo(Xs, Ys);
      }
      ctx.stroke();

      /* guia horizontal: a altura de P e a ordenada da curva */
      var qx = x0 + th * esc, qy = cy - R * Math.sin(th);
      ctx.save();
      ctx.setLineDash([3, 4]); ctx.lineWidth = 1.1; ctx.strokeStyle = azul;
      ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = azul;
      ctx.beginPath(); ctx.arc(qx, qy, 3.6, 0, 2 * Math.PI); ctx.fill();

      var gr = th * 180 / Math.PI;
      leitura.textContent = "θ = " + gr.toFixed(0) + "°   ·   sen θ = "
        + Math.sin(th).toFixed(3) + (cosChk.checked ? "   ·   cos θ = " + Math.cos(th).toFixed(3) : "");
    }

    var l = laco(pintar);
    btn.addEventListener("click", function () {
      btn.textContent = l.alterna() ? "Pausar" : "Continuar";
    });
    window.addEventListener("resize", function () { pintar(l.ler()); });
  }

  /* ============================================================
     2. Seções planas do cubo
     ============================================================ */
  function secoesCubo(raiz) {
    var cv    = raiz.querySelector("canvas");
    var btn   = raiz.querySelector("[data-play]");
    var sTh   = raiz.querySelector("[data-theta]");
    var sPhi  = raiz.querySelector("[data-phi]");
    var sD    = raiz.querySelector("[data-d]");
    var lido  = raiz.querySelector("[data-leitura]");
    var presets = raiz.querySelectorAll("[data-preset]");

    /* cubo de aresta a = 2, centro na origem */
    var V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
             [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1]];
    var F = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
    var N = [[0,0,-1],[0,0,1],[0,-1,0],[1,0,0],[0,1,0],[-1,0,0]];
    var A = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

    var PRESETS = {
      quadrado:  { th: 0,      phi: 0,    d: 0,
                   nome: "quadrado",            area: "a²" },
      retangulo: { th: 90,     phi: 45,   d: 0,
                   nome: "retângulo de área máxima", area: "a²√2" },
      hexagono:  { th: 54.7356, phi: 45,  d: 0,
                   nome: "hexágono regular",  area: "3a²√3 / 4" },
      triangulo: { th: 54.7356, phi: 45,  d: 0.57735,
                   nome: "triângulo equilátero máximo", area: "a²√3 / 2" },
      pentagono: { th: 24,     phi: 34,   d: -0.40, nome: "pentágono", area: null }
    };

    var girando = true, ang = 0;

    function normal() {
      var th = (+sTh.value) * Math.PI / 180, ph = (+sPhi.value) * Math.PI / 180;
      return [Math.sin(th)*Math.cos(ph), Math.sin(th)*Math.sin(ph), Math.cos(th)];
    }
    function pto(k, n, d) {
      /* d vem normalizado em [-1,1]; o alcance real e a soma dos modulos */
      return d * (Math.abs(n[0]) + Math.abs(n[1]) + Math.abs(n[2]));
    }
    function secao(n, d) {
      var pts = [], i, P, Q, fp, fq, t;
      for (i = 0; i < A.length; i++) {
        P = V[A[i][0]]; Q = V[A[i][1]];
        fp = n[0]*P[0] + n[1]*P[1] + n[2]*P[2] - d;
        fq = n[0]*Q[0] + n[1]*Q[1] + n[2]*Q[2] - d;
        if ((fp > 1e-9 && fq > 1e-9) || (fp < -1e-9 && fq < -1e-9)) continue;
        if (Math.abs(fp - fq) < 1e-12) continue;
        t = fp / (fp - fq);
        if (t < -1e-9 || t > 1 + 1e-9) continue;
        pts.push([P[0] + t*(Q[0]-P[0]), P[1] + t*(Q[1]-P[1]), P[2] + t*(Q[2]-P[2])]);
      }
      /* remove repetidos (vertice tocado por duas arestas) */
      var u = [];
      pts.forEach(function (p) {
        for (var j = 0; j < u.length; j++) {
          if (Math.abs(u[j][0]-p[0]) < 1e-6 && Math.abs(u[j][1]-p[1]) < 1e-6
              && Math.abs(u[j][2]-p[2]) < 1e-6) return;
        }
        u.push(p);
      });
      if (u.length < 3) return { pts: u, plano: [], area: 0 };
      /* base ortonormal do plano */
      var e1 = Math.abs(n[0]) < 0.9 ? [1,0,0] : [0,1,0];
      var ux = [e1[1]*n[2]-e1[2]*n[1], e1[2]*n[0]-e1[0]*n[2], e1[0]*n[1]-e1[1]*n[0]];
      var mu = Math.hypot(ux[0],ux[1],ux[2]); ux = ux.map(function(v){return v/mu;});
      var vx = [n[1]*ux[2]-n[2]*ux[1], n[2]*ux[0]-n[0]*ux[2], n[0]*ux[1]-n[1]*ux[0]];
      var c = [0,0,0];
      u.forEach(function (p) { c[0]+=p[0]/u.length; c[1]+=p[1]/u.length; c[2]+=p[2]/u.length; });
      var pl = u.map(function (p) {
        var w = [p[0]-c[0], p[1]-c[1], p[2]-c[2]];
        return { x: w[0]*ux[0]+w[1]*ux[1]+w[2]*ux[2],
                 y: w[0]*vx[0]+w[1]*vx[1]+w[2]*vx[2], p: p };
      });
      pl.sort(function (a, b) { return Math.atan2(a.y,a.x) - Math.atan2(b.y,b.x); });
      var ar = 0;
      for (var k = 0; k < pl.length; k++) {
        var q = pl[(k+1) % pl.length];
        ar += pl[k].x * q.y - q.x * pl[k].y;
      }
      return { pts: pl.map(function (o) { return o.p; }), plano: pl, area: Math.abs(ar)/2 };
    }
    function nomeia(k) {
      return ({3:"triângulo",4:"quadrilátero",5:"pentágono",6:"hexágono"})[k]
             || (k + " lados");
    }
    function gira(p, a, b) {
      var x = p[0]*Math.cos(a) - p[1]*Math.sin(a);
      var y = p[0]*Math.sin(a) + p[1]*Math.cos(a);
      return [x, y*Math.cos(b) - p[2]*Math.sin(b), y*Math.sin(b) + p[2]*Math.cos(b)];
    }

    function pintar(t) {
      if (girando) ang = t * 0.42;
      var g = ajusta(cv, 2.1), ctx = g.ctx, W = g.W, H = g.H;
      var preto = cor("--tx"), azul = cor("--ac2"), cinza = cor("--mu"), linha = cor("--ln");
      ctx.clearRect(0, 0, W, H);

      var b = 22 * Math.PI / 180;
      var s = Math.min(W * 0.115, H * 0.26), cx = W * 0.34, cy = H / 2;
      var proj = function (p) { var q = gira(p, ang, b); return [cx + q[0]*s, cy - q[2]*s, q[1]]; };

      var n = normal();
      var d = pto(0, n, +sD.value);
      var sec = secao(n, d);

      var P = V.map(proj);
      var vis = N.map(function (m) { return gira(m, ang, b)[1] < -1e-9; });

      /* arestas escondidas */
      var E = {};
      F.forEach(function (f, i) {
        for (var j = 0; j < 4; j++) {
          var u = f[j], w = f[(j+1)%4], ch = Math.min(u,w) + "-" + Math.max(u,w);
          (E[ch] = E[ch] || { a: Math.min(u,w), b: Math.max(u,w), v: false }).v |= vis[i];
        }
      });
      ctx.save();
      ctx.setLineDash([5,4]); ctx.lineWidth = 1.1; ctx.strokeStyle = cinza;
      ctx.beginPath();
      Object.keys(E).forEach(function (c) {
        if (E[c].v) return;
        ctx.moveTo(P[E[c].a][0], P[E[c].a][1]); ctx.lineTo(P[E[c].b][0], P[E[c].b][1]);
      });
      ctx.stroke(); ctx.restore();

      /* a secao */
      if (sec.pts.length >= 3) {
        var S = sec.pts.map(proj);
        ctx.beginPath();
        S.forEach(function (p, i) { i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]); });
        ctx.closePath();
        ctx.fillStyle = azul; ctx.globalAlpha = .30; ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = azul; ctx.lineWidth = 2.1; ctx.stroke();
        ctx.fillStyle = azul;
        S.forEach(function (p) { ctx.beginPath(); ctx.arc(p[0],p[1],3,0,7); ctx.fill(); });
      }

      /* arestas visiveis por cima */
      ctx.lineWidth = 1.8; ctx.strokeStyle = preto; ctx.lineCap = "round";
      ctx.beginPath();
      Object.keys(E).forEach(function (c) {
        if (!E[c].v) return;
        ctx.moveTo(P[E[c].a][0], P[E[c].a][1]); ctx.lineTo(P[E[c].b][0], P[E[c].b][1]);
      });
      ctx.stroke();

      /* a secao em verdadeira grandeza, a direita */
      if (sec.plano.length >= 3) {
        var ox = W * 0.78, oy = H / 2;
        var r = 0; sec.plano.forEach(function (q) { r = Math.max(r, Math.hypot(q.x,q.y)); });
        var e = Math.min(W * 0.17, H * 0.33) / (r || 1);
        ctx.save();
        ctx.strokeStyle = linha; ctx.lineWidth = 1; ctx.setLineDash([3,3]);
        ctx.beginPath(); ctx.arc(ox, oy, Math.min(W*0.19,H*0.37), 0, 7); ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        sec.plano.forEach(function (q, i) {
          var x = ox + q.x*e, y = oy - q.y*e;
          i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
        });
        ctx.closePath();
        ctx.fillStyle = azul; ctx.globalAlpha = .18; ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = azul; ctx.lineWidth = 2; ctx.stroke();
        ctx.font = "600 12px " + getComputedStyle(document.body).fontFamily;
        ctx.fillStyle = cinza; ctx.textAlign = "center";
        ctx.fillText("em verdadeira grandeza", ox, oy + Math.min(W*0.19,H*0.37) + 19);
      }

      var k = sec.pts.length;
      var nota = raiz.getAttribute("data-exata");
      lido.textContent = k < 3
        ? "o plano não corta o cubo"
        : nomeia(k) + "  ·  " + k + " lados  ·  área = "
          + (nota ? nota : (sec.area / 4).toFixed(3) + " a²");
    }

    var l = laco(pintar);
    btn.addEventListener("click", function () {
      girando = l.alterna();
      btn.textContent = girando ? "Pausar a rotação" : "Girar";
    });
    [sTh, sPhi, sD].forEach(function (c) {
      c.addEventListener("input", function () {
        raiz.removeAttribute("data-exata");
        Array.prototype.forEach.call(presets, function (p) { p.removeAttribute("aria-pressed"); });
        pintar(l.ler());
      });
    });
    Array.prototype.forEach.call(presets, function (bt) {
      bt.addEventListener("click", function () {
        var p = PRESETS[bt.getAttribute("data-preset")];
        if (!p) return;
        sTh.value = p.th; sPhi.value = p.phi; sD.value = p.d;
        if (p.area) raiz.setAttribute("data-exata", p.area);
        else raiz.removeAttribute("data-exata");
        Array.prototype.forEach.call(presets, function (o) { o.removeAttribute("aria-pressed"); });
        bt.setAttribute("aria-pressed", "true");
        pintar(l.ler());
      });
    });
    window.addEventListener("resize", function () { pintar(l.ler()); });
  }

  /* ============================================================
     3. DINO: transformacoes lineares no plano
     ============================================================ */
  function dinoLinear(raiz) {
    var cv   = raiz.querySelector("canvas");
    var sA   = raiz.querySelector("[data-alpha]");
    var sK   = raiz.querySelector("[data-k]");
    var lido = raiz.querySelector("[data-leitura]");
    var presets = raiz.querySelectorAll("[data-preset]");

    var D = [[6,4],[3,1],[1,2],[-1,5],[-2,5],[-3,4],[-4,4],[-5,3],[-5,2],[-2,2],
             [-5,1],[-4,0],[-2,1],[-1,0],[0,-3],[-1,-4],[1,-4],[2,-3],[1,-2],[3,-1],[5,1.1474]];

    var PRESETS = {
      identidade: { a: 0,   k: 1,    det: "1" },
      rot90:      { a: 90,  k: 1,    det: "1" },
      central:    { a: 0,   k: -1,   det: "1" },
      dobro:      { a: 0,   k: 2,    det: "4" },
      metade:     { a: 0,   k: 0.5,  det: "1/4" },
      applet:     { a: 141.5, k: -2.1, det: "4,41" }
    };

    function aplica(P, a, k) {
      var c = Math.cos(a), s = Math.sin(a);
      return P.map(function (p) {
        var x = c*p[0] - s*p[1], y = s*p[0] + c*p[1];
        return [k*x, k*y];
      });
    }
    function contorno(ctx, P, f) {
      ctx.beginPath();
      P.forEach(function (p, i) { i ? ctx.lineTo(f(p)[0], f(p)[1]) : ctx.moveTo(f(p)[0], f(p)[1]); });
      ctx.closePath();
    }
    function fmt(x) {
      var r = Math.round(x * 100) / 100;
      return (Math.abs(r) < 5e-3 ? 0 : r).toFixed(2).replace(".", ",");
    }

    function pintar() {
      var g = ajusta(cv, 1.45), ctx = g.ctx, W = g.W, H = g.H;
      var preto = cor("--tx"), azul = cor("--ac2"), cinza = cor("--mu"), linha = cor("--ln");
      ctx.clearRect(0, 0, W, H);

      var a = (+sA.value) * Math.PI / 180, k = +sK.value;
      var P0 = D, P1 = aplica(D, a, 1), P2 = aplica(D, a, k);

      var r = 7;
      P2.concat(P1).forEach(function (p) { r = Math.max(r, Math.abs(p[0]), Math.abs(p[1])); });
      var e = Math.min(W, H) * 0.44 / r, cx = W / 2, cy = H / 2;
      var f = function (p) { return [cx + p[0]*e, cy - p[1]*e]; };

      /* eixos */
      ctx.strokeStyle = linha; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
      ctx.stroke();

      /* imagem por B.A: cinza, atras */
      ctx.save();
      contorno(ctx, P2, f);
      ctx.fillStyle = cinza; ctx.globalAlpha = .18; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = cinza; ctx.lineWidth = 1.9; ctx.stroke();
      ctx.restore();

      /* imagem por A: azul */
      ctx.save();
      contorno(ctx, P1, f);
      ctx.fillStyle = azul; ctx.globalAlpha = .24; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = azul; ctx.lineWidth = 1.9; ctx.stroke();
      ctx.restore();

      /* original: preto tracejado */
      ctx.save();
      ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3; ctx.strokeStyle = preto;
      contorno(ctx, P0, f); ctx.stroke();
      ctx.restore();

      var nota = raiz.getAttribute("data-exata");
      var c = Math.cos(a), s = Math.sin(a);
      lido.innerHTML =
        "A = [" + fmt(c) + "  " + fmt(-s) + " ; " + fmt(s) + "  " + fmt(c) + "]"
        + " · k = " + fmt(k)
        + " · det(BA) = " + (nota ? nota : fmt(k*k));
    }

    [sA, sK].forEach(function (c) {
      c.addEventListener("input", function () {
        raiz.removeAttribute("data-exata");
        Array.prototype.forEach.call(presets, function (p) { p.removeAttribute("aria-pressed"); });
        pintar();
      });
    });
    Array.prototype.forEach.call(presets, function (bt) {
      bt.addEventListener("click", function () {
        var p = PRESETS[bt.getAttribute("data-preset")];
        if (!p) return;
        sA.value = p.a; sK.value = p.k;
        raiz.setAttribute("data-exata", p.det);
        Array.prototype.forEach.call(presets, function (o) { o.removeAttribute("aria-pressed"); });
        bt.setAttribute("aria-pressed", "true");
        pintar();
      });
    });
    window.addEventListener("resize", pintar);
    pintar();
  }

  /* ============================================================
     4. GeoGebra: o applet so carrega quando o visitante pede
     ============================================================ */
  function geogebra() {
    var caixas = document.querySelectorAll("[data-ggb]");
    if (!caixas.length) return;
    var carregado = false;
    function carregaScript(ok) {
      if (carregado) return ok();
      var s = document.createElement("script");
      s.src = "https://www.geogebra.org/apps/deployggb.js";
      s.onload = function () { carregado = true; ok(); };
      document.head.appendChild(s);
    }
    Array.prototype.forEach.call(caixas, function (caixa, i) {
      var btn = caixa.querySelector("[data-abrir]");
      var alvo = caixa.querySelector(".ggb-alvo");
      alvo.id = "ggb-" + i;
      btn.addEventListener("click", function () {
        btn.disabled = true; btn.textContent = "Carregando…";
        carregaScript(function () {
          var app = new GGBApplet({
            material_id: caixa.getAttribute("data-ggb"),
            width: alvo.clientWidth || 800,
            height: Math.round((alvo.clientWidth || 800) * 0.62),
            showToolBar: false, showAlgebraInput: false, showMenuBar: false,
            showResetIcon: true, enableRightClick: false,
            borderColor: "transparent"
          }, true);
          app.inject(alvo.id);
          btn.remove();
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var a = document.getElementById("anim-seno");
    if (a) circuloTrig(a);
    var c = document.getElementById("anim-cubo");
    if (c) secoesCubo(c);
    var dn = document.getElementById("anim-dino");
    if (dn) dinoLinear(dn);
    geogebra();
  });
})();
