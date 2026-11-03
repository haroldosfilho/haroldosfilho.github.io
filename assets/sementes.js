// Gerador de questões a partir de sementes.
// Cada semente é um molde: sorteia os números, calcula a resposta exata
// e monta os distratores a partir dos erros que o aluno costuma cometer.
(function(){
  "use strict";

  /* ---------- sorteio reprodutível ---------- */
  function rng(semente){
    var s = semente >>> 0;
    return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function ri(r, a, b){ return a + Math.floor(r() * (b - a + 1)); }        // inteiro em [a,b]
  function esc(r, v){ return v[Math.floor(r() * v.length)]; }

  /* ---------- aritmética exata ---------- */
  function mdc(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=a%b; a=b; b=t; } return a; }
  function frac(n,d){
    if(d < 0){ n = -n; d = -d; }
    var g = mdc(n,d) || 1; n/=g; d/=g;
    return d === 1 ? String(n) : '<span class="frac"><span>'+n+'</span><span>'+d+'</span></span>';
  }
  // k·√m simplificado; devolve texto exato
  function raiz(m, k){
    k = (k === undefined) ? 1 : k;
    if(m < 0) return "—";
    var fora = 1, dentro = m;
    for(var p = 2; p*p <= dentro; p++){
      while(dentro % (p*p) === 0){ dentro /= p*p; fora *= p; }
    }
    fora *= k;
    if(dentro === 1) return String(fora);
    return (fora === 1 ? "" : fora) + "&radic;" + dentro;
  }
  // (a/b)·√m
  function raizFrac(m, num, den){
    var fora = 1, dentro = m;
    for(var p = 2; p*p <= dentro; p++){
      while(dentro % (p*p) === 0){ dentro /= p*p; fora *= p; }
    }
    num *= fora;
    var g = mdc(num, den) || 1; num/=g; den/=g;
    var r = dentro === 1 ? String(num) : (num === 1 ? "" : num) + "&radic;" + dentro;
    return den === 1 ? r : '<span class="frac"><span>'+r+'</span><span>'+den+'</span></span>';
  }
  function emb(r, certa, outras){
    var v = [certa].concat(outras);
    for(var i = v.length - 1; i > 0; i--){ var j = Math.floor(r() * (i+1)); var t=v[i]; v[i]=v[j]; v[j]=t; }
    return { alts: v, correta: v.indexOf(certa) };
  }
  function unicos(certa, cand){
    var v = [], i;
    for(i = 0; i < cand.length && v.length < 4; i++){
      if(cand[i] !== certa && v.indexOf(cand[i]) < 0) v.push(cand[i]);
    }
    return v;
  }

  /* ================= as sementes ================= */
  var S = [];

  S.push({ tema:"Conjuntos", gera:function(r){
    var ab=ri(r,8,20), ac=ri(r,8,20), bc=ri(r,8,20), abc=ri(r,3,Math.min(ab,ac,bc)-1);
    var a=ri(r,ab+ac-abc+5,ab+ac-abc+40), b=ri(r,ab+bc-abc+5,ab+bc-abc+40), c=ri(r,ac+bc-abc+5,ac+bc-abc+40);
    var u=a+b+c-ab-ac-bc+abc;
    return {
      enun:"Numa turma, "+a+" alunos estudam para o IME, "+b+" para o ITA e "+c+" para a Escola Naval. Estudam para IME e ITA "+ab+"; para IME e Escola Naval "+ac+"; para ITA e Escola Naval "+bc+"; e para as três "+abc+". Quantos alunos há na turma, se todos estudam para pelo menos uma delas?",
      certa:String(u),
      erros:[String(a+b+c), String(a+b+c-ab-ac-bc), String(u+abc), String(a+b+c-abc)],
      sol:"<p>Pelo princípio da inclusão–exclusão, soma-se tudo, tiram-se as interseções duas a duas e devolve-se a tripla, que foi tirada três vezes depois de somada três vezes.</p><p>"+a+" + "+b+" + "+c+" &minus; "+ab+" &minus; "+ac+" &minus; "+bc+" + "+abc+" = <b>"+u+"</b>.</p>"
    };
  }});

  var LOG = [];
  (function(){
    [2,3,5,10].forEach(function(base){
      for(var m=2;m<=6;m++){
        var p=Math.pow(base,m);
        if(p>20000) continue;
        for(var d=1; d*d<p; d++){
          if(p%d) continue;
          var x=p/d;
          if(x-d>=2) LOG.push([base,m,x,x-d]);
        }
      }
    });
  })();
  S.push({ tema:"Logaritmos", gera:function(r){
    var c=esc(r,LOG), base=c[0], m=c[1], x=c[2], k=c[3], p=x*(x-k);
    return {
      enun:"Resolva, em &#8477;, a equação log<sub>"+base+"</sub> <i>x</i> + log<sub>"+base+"</sub> (<i>x</i> &minus; "+k+") = "+m+".",
      certa:"<i>x</i> = "+x,
      erros:["<i>x</i> = "+(x-k), "<i>x</i> = "+(x+k), "<i>x</i> = "+(k-x)+" e <i>x</i> = "+x, "<i>x</i> = "+(2*x)],
      sol:"<p>A condição de existência pede <i>x</i> &gt; "+k+", e isso é o que vai descartar uma das raízes no fim.</p><p>Somando os logaritmos: log<sub>"+base+"</sub> [<i>x</i>(<i>x</i> &minus; "+k+")] = "+m+", isto é, <i>x</i>&sup2; &minus; "+k+"<i>x</i> &minus; "+p+" = 0.</p><p>As raízes são "+x+" e "+(k-x)+"; a negativa não serve, porque não existe logaritmo de número não positivo. Resposta: <b><i>x</i> = "+x+"</b>.</p>"
    };
  }});

  S.push({ tema:"Trigonometria", gera:function(r){
    var a=ri(r,2,12), b=ri(r,2,12);
    var m=a*a+b*b;
    return {
      enun:"O valor máximo de "+a+" sen <i>x</i> + "+b+" cos <i>x</i>, com <i>x</i> real, é",
      certa:raiz(m),
      erros:[String(a+b), String(Math.max(a,b)), raiz(m*2), raiz(a*a)+" + "+raiz(b*b)],
      sol:"<p>Escreva "+a+" sen <i>x</i> + "+b+" cos <i>x</i> como <i>R</i> sen(<i>x</i> + &phi;), com <i>R</i> = &radic;("+a+"&sup2; + "+b+"&sup2;).</p><p>Isso é sempre possível: basta tomar cos &phi; = "+a+"/<i>R</i> e sen &phi; = "+b+"/<i>R</i>, que satisfazem a relação fundamental.</p><p>Como o seno varia entre &minus;1 e 1, o máximo é <i>R</i> = &radic;"+m+" = <b>"+raiz(m)+"</b>.</p>"
    };
  }});

  S.push({ tema:"Sequências", gera:function(r){
    var a1=ri(r,2,15), q=esc(r,[2,3]), n=ri(r,5,9);
    var an=a1*Math.pow(q,n-1), s=a1*(Math.pow(q,n)-1)/(q-1);
    return {
      enun:"Numa progressão geométrica de primeiro termo "+a1+" e razão "+q+", a soma dos "+n+" primeiros termos é",
      certa:String(s),
      erros:[String(an), String(s-an), String(s+an), String(n*a1)],
      sol:"<p>A soma de uma PG finita é <i>S</i><sub><i>n</i></sub> = <i>a</i><sub>1</sub>(<i>q</i><sup><i>n</i></sup> &minus; 1)/(<i>q</i> &minus; 1). Repare no expoente: é <i>n</i>, e não <i>n</i> &minus; 1 — esse é o escorregão comum.</p><p>Aqui: "+a1+"("+q+"<sup>"+n+"</sup> &minus; 1)/("+q+" &minus; 1) = "+a1+" &middot; "+(Math.pow(q,n)-1)+"/"+(q-1)+" = <b>"+s+"</b>.</p>"
    };
  }});

  S.push({ tema:"Polinômios", gera:function(r){
    var r1=ri(r,1,6), r2=ri(r,1,6), r3=ri(r,1,6);
    var e1=r1+r2+r3, e2=r1*r2+r1*r3+r2*r3, e3=r1*r2*r3;
    var q = e1*e1 - 2*e2;   // soma dos quadrados
    return {
      enun:"As raízes de <i>x</i>&sup3; &minus; "+e1+"<i>x</i>&sup2; + "+e2+"<i>x</i> &minus; "+e3+" = 0 são <i>a</i>, <i>b</i> e <i>c</i>. O valor de <i>a</i>&sup2; + <i>b</i>&sup2; + <i>c</i>&sup2; é",
      certa:String(q),
      erros:[String(e1*e1), String(e1*e1+2*e2), String(e2), String(e3)],
      sol:"<p>Não é preciso achar as raízes. Pelas relações de Girard, <i>a</i>+<i>b</i>+<i>c</i> = "+e1+" e <i>ab</i>+<i>ac</i>+<i>bc</i> = "+e2+".</p><p>De (<i>a</i>+<i>b</i>+<i>c</i>)&sup2; = <i>a</i>&sup2;+<i>b</i>&sup2;+<i>c</i>&sup2; + 2(<i>ab</i>+<i>ac</i>+<i>bc</i>) vem</p><p><i>a</i>&sup2;+<i>b</i>&sup2;+<i>c</i>&sup2; = "+e1+"&sup2; &minus; 2&middot;"+e2+" = "+(e1*e1)+" &minus; "+(2*e2)+" = <b>"+q+"</b>.</p>"
    };
  }});

  S.push({ tema:"Números complexos", gera:function(r){
    var n=esc(r,[4,6,8,12]), a=esc(r,[1,-1]), tipo=esc(r,["1+i","1-i"]);
    var mod2=2, pot=Math.pow(2,n/2);
    var ang=(tipo==="1+i"?45:-45)*n, red=((ang%360)+360)%360;
    var txt;
    if(red===0) txt=String(pot);
    else if(red===180) txt=String(-pot);
    else if(red===90) txt=pot+"<i>i</i>";
    else if(red===270) txt="&minus;"+pot+"<i>i</i>";
    else return null;
    return {
      enun:"O valor de ("+(tipo==="1+i"?"1 + <i>i</i>":"1 &minus; <i>i</i>")+")<sup>"+n+"</sup> é",
      certa:txt,
      erros:[String(pot)+"<i>i</i>", String(-pot), String(pot*2), "&minus;"+pot+"<i>i</i>"],
      sol:"<p>Na forma polar, "+(tipo==="1+i"?"1 + <i>i</i>":"1 &minus; <i>i</i>")+" tem módulo &radic;2 e argumento "+(tipo==="1+i"?"45&deg;":"&minus;45&deg;")+".</p><p>Por De Moivre, a potência "+n+" tem módulo (&radic;2)<sup>"+n+"</sup> = "+pot+" e argumento "+ang+"&deg;, que é côngruo a "+red+"&deg;.</p><p>Logo o resultado é <b>"+txt+"</b>.</p>"
    };
  }});

  S.push({ tema:"Matrizes e sistemas", gera:function(r){
    var a=ri(r,1,5), b=ri(r,1,5), c=ri(r,1,5), d=ri(r,1,5);
    var det=a*d-b*c;
    if(det===0) return null;
    var n=ri(r,2,4), detn=Math.pow(det,n);
    return {
      enun:"Seja <i>A</i> a matriz de linhas ("+a+", "+b+") e ("+c+", "+d+"). O determinante de <i>A</i><sup>"+n+"</sup> é",
      certa:String(detn),
      erros:[String(det*n), String(det), String(Math.pow(det,n-1)), String(-detn)],
      sol:"<p>det <i>A</i> = "+a+"&middot;"+d+" &minus; "+b+"&middot;"+c+" = "+det+".</p><p>O determinante é multiplicativo: det(<i>XY</i>) = det <i>X</i> &middot; det <i>Y</i>. Aplicando "+n+" vezes, det(<i>A</i><sup>"+n+"</sup>) = (det <i>A</i>)<sup>"+n+"</sup>.</p><p>Portanto "+det+"<sup>"+n+"</sup> = <b>"+detn+"</b>. Multiplicar o determinante por "+n+" é o erro clássico aqui.</p>"
    };
  }});

  S.push({ tema:"Combinatória", gera:function(r){
    var pal=esc(r,[["ARARA",5,{A:3,R:2}],["BANANA",6,{A:3,N:2,B:1}],["MATEMATICA",10,{M:2,A:3,T:2,E:1,I:1,C:1}],["PARALELA",8,{A:3,L:2,P:1,R:1,E:1}],["ITAIMEENE",9,{I:2,T:1,A:1,M:1,E:3,N:1}]]);
    var fat=function(k){ var v=1; for(var i=2;i<=k;i++) v*=i; return v; };
    var den=1; for(var L in pal[2]) den*=fat(pal[2][L]);
    var n=fat(pal[1])/den;
    return {
      enun:"Quantos anagramas distintos tem a palavra "+pal[0]+"?",
      certa:n.toLocaleString("pt-BR"),
      erros:[fat(pal[1]).toLocaleString("pt-BR"), (n*2).toLocaleString("pt-BR"), Math.round(n/2).toLocaleString("pt-BR"), (fat(pal[1])/2).toLocaleString("pt-BR")],
      sol:"<p>São "+pal[1]+" letras, mas com repetições: permutar entre si letras iguais não muda a palavra.</p><p>O total é "+pal[1]+"! dividido pelos fatoriais das multiplicidades: "+fat(pal[1]).toLocaleString("pt-BR")+" / "+den+" = <b>"+n.toLocaleString("pt-BR")+"</b>.</p>"
    };
  }});

  S.push({ tema:"Geometria plana", gera:function(r){
    var t=esc(r,[[13,14,15,84],[5,12,13,30],[9,10,17,36],[7,15,20,42],[6,25,29,60],[11,13,20,66]]);
    var a=t[0],b=t[1],c=t[2],A=t[3], p=(a+b+c)/2;
    return {
      enun:"Um triângulo tem lados "+a+", "+b+" e "+c+". A sua área é",
      certa:String(A),
      erros:[String(p), String(a*b/2), String(Math.round(A*2)), String(a+b+c)],
      sol:"<p>Com os três lados e nenhum ângulo, o caminho é Heron. O semiperímetro é <i>p</i> = ("+a+" + "+b+" + "+c+")/2 = "+p+".</p><p>A área vale &radic;[<i>p</i>(<i>p</i>&minus;<i>a</i>)(<i>p</i>&minus;<i>b</i>)(<i>p</i>&minus;<i>c</i>)] = &radic;("+p+" &middot; "+(p-a)+" &middot; "+(p-b)+" &middot; "+(p-c)+") = &radic;"+(p*(p-a)*(p-b)*(p-c))+" = <b>"+A+"</b>.</p>"
    };
  }});

  S.push({ tema:"Geometria espacial", gera:function(r){
    var a=ri(r,2,9);
    return {
      enun:"O volume do tetraedro regular de aresta "+a+" é",
      certa:raizFrac(2, a*a*a, 12),
      erros:[raizFrac(2, a*a*a, 6), raizFrac(3, a*a*a, 12), raizFrac(2, a*a*a, 3), String(a*a*a)],
      sol:"<p>Num tetraedro regular de aresta <i>a</i>, a altura cai no baricentro da base, a distância 2/3 da mediana, que mede <i>a</i>&radic;3/2. Logo a projeção vale <i>a</i>&radic;3/3.</p><p>A altura sai de <i>h</i>&sup2; = <i>a</i>&sup2; &minus; <i>a</i>&sup2;/3 = 2<i>a</i>&sup2;/3, isto é, <i>h</i> = <i>a</i>&radic;6/3.</p><p>Com base de área <i>a</i>&sup2;&radic;3/4, o volume é (1/3)(<i>a</i>&sup2;&radic;3/4)(<i>a</i>&radic;6/3) = <i>a</i>&sup3;&radic;2/12. Para <i>a</i> = "+a+": <b>"+raizFrac(2,a*a*a,12)+"</b>.</p>"
    };
  }});

  S.push({ tema:"Geometria analítica", gera:function(r){
    var A=ri(r,2,9), B=ri(r,2,9), C=ri(r,-20,20), x0=ri(r,-8,8), y0=ri(r,-8,8);
    var num=Math.abs(A*x0+B*y0+C), den2=A*A+B*B;
    if(num===0) return null;
    return {
      enun:"A distância do ponto P("+x0+", "+y0+") à reta "+A+"<i>x</i> + "+B+"<i>y</i> "+(C<0?"&minus; "+(-C):"+ "+C)+" = 0 é",
      certa:raizFrac(den2, num, den2),
      erros:[String(num), raizFrac(den2, num, A+B), raizFrac(den2, num*2, den2), raiz(den2)],
      sol:"<p>A distância de um ponto a uma reta é o módulo do valor da equação no ponto, dividido pelo módulo do vetor normal.</p><p>No ponto: |"+A+"&middot;("+x0+") + "+B+"&middot;("+y0+") "+(C<0?"&minus; "+(-C):"+ "+C)+"| = "+num+".</p><p>O normal é ("+A+", "+B+"), de módulo &radic;"+den2+". Logo <i>d</i> = "+num+"/&radic;"+den2+" = <b>"+raizFrac(den2,num,den2)+"</b>.</p>"
    };
  }});

  S.push({ tema:"Cálculo", gera:function(r){
    var n=ri(r,2,5), a=ri(r,1,4), b=ri(r,1,5);
    // integral de (a x^n + b) de 0 a 1  =  a/(n+1) + b
    var num=a + b*(n+1), den=n+1;
    return {
      enun:"O valor de &int;<sub>0</sub><sup>1</sup> ("+a+"<i>x</i><sup>"+n+"</sup> + "+b+") d<i>x</i> é",
      certa:frac(num,den),
      erros:[frac(a,n)+" + "+b, frac(a+b,den), String(a+b), frac(a,den)],
      sol:"<p>Integre termo a termo: a primitiva de "+a+"<i>x</i><sup>"+n+"</sup> é "+a+"<i>x</i><sup>"+(n+1)+"</sup>/"+(n+1)+", e a de "+b+" é "+b+"<i>x</i>.</p><p>Entre 0 e 1 sobra "+a+"/"+(n+1)+" + "+b+" = <b>"+frac(num,den)+"</b>.</p>"
    };
  }});

  /* ---------- montagem do caderno ---------- */
  function gerar(semente, porTema){
    porTema = porTema || 1;
    var r = rng(semente), lista = [];
    S.forEach(function(s){
      var feitos = 0, voltas = 0;
      while(feitos < porTema && voltas < 60){
        voltas++;
        var q = s.gera(r);
        if(!q) continue;
        var outras = unicos(q.certa, q.erros);
        if(outras.length < 4) continue;
        var m = emb(r, q.certa, outras);
        lista.push({ assunto:s.tema, enun:q.enun, alts:m.alts, correta:m.correta, sol:q.sol });
        feitos++;
      }
    });
    return lista;
  }

  window.SEMENTES = { gerar: gerar, temas: S.map(function(s){ return s.tema; }) };
})();
