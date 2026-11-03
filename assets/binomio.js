// Quiz do capítulo 5 — Binômio de Newton.
// correta: índice da alternativa certa, começando em 0.
window.QUESTOES = [
{
  assunto: "Termo independente",
  enun: "No desenvolvimento de (<i>x</i>&sup2; &minus; 2/<i>x</i>)<sup>9</sup>, o termo independente de <i>x</i> é",
  alts: ["84", "&minus;672", "5376", "672", "&minus;5376"],
  correta: 2,
  sol: "<p>O termo geral é C(9,&nbsp;<i>k</i>)&nbsp;(<i>x</i>&sup2;)<sup>9&minus;<i>k</i></sup>&nbsp;(&minus;2/<i>x</i>)<sup><i>k</i></sup>, isto é, C(9,&nbsp;<i>k</i>)&nbsp;(&minus;2)<sup><i>k</i></sup>&nbsp;<i>x</i><sup>18&minus;3<i>k</i></sup>.</p><p>O expoente de <i>x</i> cai de três em três, não de um em um: é essa a razão de só um termo em cada três ter chance de ser o independente. Fazendo 18&nbsp;&minus;&nbsp;3<i>k</i>&nbsp;=&nbsp;0, vem <i>k</i>&nbsp;=&nbsp;6.</p><p>O termo é C(9,&nbsp;6)&nbsp;(&minus;2)<sup>6</sup>&nbsp;=&nbsp;84&nbsp;&middot;&nbsp;64&nbsp;=&nbsp;5376. O expoente par salva o sinal: com <i>k</i> ímpar o termo sairia negativo.</p><p class=\"resp\">Resposta: 5376</p>"
},
{
  assunto: "Soma dos coeficientes",
  enun: "A soma de todos os coeficientes do desenvolvimento de (<i>x</i> + 2<i>y</i> &minus; 3<i>z</i>)<sup>7</sup> é",
  alts: ["0", "1", "6<sup>7</sup>", "128", "&minus;1"],
  correta: 0,
  sol: "<p>Somar todos os coeficientes é avaliar o polinômio com todas as variáveis iguais a 1 — cada monômio vira o seu próprio coeficiente.</p><p>Com <i>x</i>&nbsp;=&nbsp;<i>y</i>&nbsp;=&nbsp;<i>z</i>&nbsp;=&nbsp;1 o parêntese vale 1&nbsp;+&nbsp;2&nbsp;&minus;&nbsp;3&nbsp;=&nbsp;0, e 0<sup>7</sup>&nbsp;=&nbsp;0.</p><p>Não é preciso desenvolver nada: a soma é zero porque os coeficientes positivos e negativos se cancelam exatamente. Quem soma 1&nbsp;+&nbsp;2&nbsp;+&nbsp;3 esquece que o sinal entra na conta.</p><p class=\"resp\">Resposta: 0</p>"
},
{
  assunto: "Teorema das linhas",
  enun: "Um conjunto tem 10 elementos. Quantos dos seus subconjuntos têm um número par de elementos?",
  alts: ["256", "1024", "512", "511", "1023"],
  correta: 2,
  sol: "<p>O número procurado é C(10,&nbsp;0)&nbsp;+&nbsp;C(10,&nbsp;2)&nbsp;+&nbsp;&middot;&middot;&middot;&nbsp;+&nbsp;C(10,&nbsp;10). Em vez de somar as seis parcelas, use as duas linhas do binômio.</p><p>De (1&nbsp;+&nbsp;1)<sup>10</sup> sai a soma de todos os binomiais: 2<sup>10</sup>. De (1&nbsp;&minus;&nbsp;1)<sup>10</sup> sai a soma alternada, que vale 0 — ou seja, a soma dos de índice par é igual à soma dos de índice ímpar.</p><p>Somando as duas igualdades, o dobro da soma par é 2<sup>10</sup>, e a soma par é 2<sup>9</sup>&nbsp;=&nbsp;512.</p><p>Há um argumento direto: fixe um elemento e escolha livremente os outros nove; cada escolha se completa de exatamente um modo com o elemento fixado, dando paridade par. São 2<sup>9</sup> escolhas.</p><p class=\"resp\">Resposta: 512</p>"
},
{
  assunto: "Filtro das raízes da unidade",
  enun: "O valor de C(12,&nbsp;0) + C(12,&nbsp;3) + C(12,&nbsp;6) + C(12,&nbsp;9) + C(12,&nbsp;12) é",
  alts: ["1365", "1366", "2048", "1368", "1024"],
  correta: 1,
  sol: "<p>Somar de três em três pede o filtro das raízes cúbicas da unidade. Seja &omega; uma raiz primitiva: 1&nbsp;+&nbsp;&omega;&nbsp;+&nbsp;&omega;&sup2;&nbsp;=&nbsp;0.</p><p>A soma dos binomiais com índice múltiplo de 3 é [ (1+1)<sup>12</sup> + (1+&omega;)<sup>12</sup> + (1+&omega;&sup2;)<sup>12</sup> ] / 3.</p><p>Como 1&nbsp;+&nbsp;&omega;&nbsp;=&nbsp;&minus;&omega;&sup2;, tem-se (1+&omega;)<sup>12</sup>&nbsp;=&nbsp;&omega;<sup>24</sup>&nbsp;=&nbsp;1, e o mesmo para a conjugada.</p><p>Logo a soma é (4096&nbsp;+&nbsp;1&nbsp;+&nbsp;1)&nbsp;/&nbsp;3&nbsp;=&nbsp;1366. Conferindo na mão: 1&nbsp;+&nbsp;220&nbsp;+&nbsp;924&nbsp;+&nbsp;220&nbsp;+&nbsp;1&nbsp;=&nbsp;1366.</p><p class=\"resp\">Resposta: 1366</p>"
},
{
  assunto: "Maior coeficiente",
  enun: "O maior coeficiente do desenvolvimento de (1 + 2<i>x</i>)<sup>10</sup> é",
  alts: ["13440", "15360", "11520", "8064", "1024"],
  correta: 1,
  sol: "<p>O coeficiente do termo em <i>x</i><sup><i>k</i></sup> é <i>a</i><sub><i>k</i></sub>&nbsp;=&nbsp;C(10,&nbsp;<i>k</i>)&nbsp;2<sup><i>k</i></sup>. O maior não é o do meio, porque o 2<sup><i>k</i></sup> empurra o pico para a direita.</p><p>Compare termos vizinhos pela razão: <i>a</i><sub><i>k</i>+1</sub>&nbsp;/&nbsp;<i>a</i><sub><i>k</i></sub>&nbsp;=&nbsp;2(10&nbsp;&minus;&nbsp;<i>k</i>)&nbsp;/&nbsp;(<i>k</i>&nbsp;+&nbsp;1).</p><p>Essa razão é maior que 1 enquanto 20&nbsp;&minus;&nbsp;2<i>k</i>&nbsp;&gt;&nbsp;<i>k</i>&nbsp;+&nbsp;1, ou seja, enquanto <i>k</i>&nbsp;&lt;&nbsp;19/3. Os coeficientes crescem até <i>k</i>&nbsp;=&nbsp;7 e decrescem depois.</p><p>O máximo é <i>a</i><sub>7</sub>&nbsp;=&nbsp;C(10,&nbsp;7)&nbsp;&middot;&nbsp;2<sup>7</sup>&nbsp;=&nbsp;120&nbsp;&middot;&nbsp;128&nbsp;=&nbsp;15360. Quem responde 13440 parou em <i>k</i>&nbsp;=&nbsp;6, um passo antes do pico.</p><p class=\"resp\">Resposta: 15360</p>"
},
{
  assunto: "Soma dos quadrados",
  enun: "O valor de C(5,&nbsp;0)&sup2; + C(5,&nbsp;1)&sup2; + C(5,&nbsp;2)&sup2; + C(5,&nbsp;3)&sup2; + C(5,&nbsp;4)&sup2; + C(5,&nbsp;5)&sup2; é",
  alts: ["1024", "120", "126", "252", "32"],
  correta: 3,
  sol: "<p>Some pela contagem, não pelas seis parcelas. Imagine um grupo com 5 homens e 5 mulheres e escolha 5 pessoas.</p><p>Separando pelo número <i>k</i> de homens escolhidos, as escolhas são C(5,&nbsp;<i>k</i>)&nbsp;&middot;&nbsp;C(5,&nbsp;5&nbsp;&minus;&nbsp;<i>k</i>), e como C(5,&nbsp;5&nbsp;&minus;&nbsp;<i>k</i>)&nbsp;=&nbsp;C(5,&nbsp;<i>k</i>), cada parcela é um quadrado.</p><p>O total, contado de uma vez só, é C(10,&nbsp;5)&nbsp;=&nbsp;252. É o caso particular da identidade de Vandermonde.</p><p class=\"resp\">Resposta: 252</p>"
},
{
  assunto: "Soma ponderada",
  enun: "O valor de 0&middot;C(8,&nbsp;0) + 1&middot;C(8,&nbsp;1) + 2&middot;C(8,&nbsp;2) + &middot;&middot;&middot; + 8&middot;C(8,&nbsp;8) é",
  alts: ["256", "1024", "2048", "512", "4096"],
  correta: 1,
  sol: "<p>Conte comissões com um presidente. De um grupo de 8 pessoas, escolher um subconjunto de <i>k</i> pessoas e destacar uma delas dá <i>k</i>&nbsp;&middot;&nbsp;C(8,&nbsp;<i>k</i>) maneiras, e somar em <i>k</i> dá o total procurado.</p><p>Conte o mesmo na ordem inversa: escolha primeiro o presidente, de 8 modos, e depois decida, para cada uma das 7 pessoas restantes, se ela entra ou não — 2<sup>7</sup> modos.</p><p>Logo a soma é 8&nbsp;&middot;&nbsp;2<sup>7</sup>&nbsp;=&nbsp;1024. A mesma identidade sai derivando (1&nbsp;+&nbsp;<i>x</i>)<sup>8</sup> e fazendo <i>x</i>&nbsp;=&nbsp;1.</p><p class=\"resp\">Resposta: 1024</p>"
},
{
  assunto: "Polinômio de Leibniz",
  enun: "No desenvolvimento de (<i>x</i> + <i>y</i> + <i>z</i>)<sup>9</sup>, o coeficiente de <i>x</i>&sup2;<i>y</i>&sup3;<i>z</i><sup>4</sup> é",
  alts: ["504", "2520", "1260", "630", "362880"],
  correta: 2,
  sol: "<p>Cada termo do produto escolhe, em cada um dos nove fatores, uma das três letras. Formar <i>x</i>&sup2;<i>y</i>&sup3;<i>z</i><sup>4</sup> é decidir quais dois fatores entram com <i>x</i>, quais três com <i>y</i> e quais quatro com <i>z</i>.</p><p>É uma permutação com repetição de nove objetos, dois de um tipo, três de outro e quatro de outro:</p><p>9!&nbsp;/&nbsp;(2!&nbsp;&middot;&nbsp;3!&nbsp;&middot;&nbsp;4!)&nbsp;=&nbsp;362&nbsp;880&nbsp;/&nbsp;288&nbsp;=&nbsp;1260.</p><p>O mesmo valor sai por etapas: C(9,&nbsp;2)&nbsp;&middot;&nbsp;C(7,&nbsp;3)&nbsp;=&nbsp;36&nbsp;&middot;&nbsp;35&nbsp;=&nbsp;1260, e o que sobra vai todo para <i>z</i>.</p><p class=\"resp\">Resposta: 1260</p>"
},
{
  assunto: "Teorema de Lucas",
  enun: "Entre os 101 números C(100,&nbsp;0), C(100,&nbsp;1), &middot;&middot;&middot;, C(100,&nbsp;100), quantos são ímpares?",
  alts: ["4", "8", "16", "50", "101"],
  correta: 1,
  sol: "<p>Pelo teorema de Lucas na base 2, C(100,&nbsp;<i>k</i>) é ímpar exatamente quando cada dígito binário de <i>k</i> é menor ou igual ao dígito correspondente de 100.</p><p>Em binário, 100&nbsp;=&nbsp;1100100. Há três dígitos iguais a 1, e nas outras posições o dígito de <i>k</i> é obrigado a ser 0.</p><p>Cada uma das três posições livres aceita 0 ou 1, então são 2&sup3;&nbsp;=&nbsp;8 valores de <i>k</i>. Dito de outro modo: a linha 100 do triângulo de Pascal tem só oito entradas ímpares, e é essa escassez que produz o desenho fractal do triângulo de Sierpiński quando se pintam os ímpares.</p><p class=\"resp\">Resposta: 8</p>"
},
{
  assunto: "Soma com denominador",
  enun: "O valor de C(5,&nbsp;0)/1 + C(5,&nbsp;1)/2 + C(5,&nbsp;2)/3 + C(5,&nbsp;3)/4 + C(5,&nbsp;4)/5 + C(5,&nbsp;5)/6 é",
  alts: ["21", "31/2", "21/2", "63/5", "32/3"],
  correta: 2,
  sol: "<p>O denominador <i>k</i>&nbsp;+&nbsp;1 ao lado de um binomial pede integração. Parta de (1&nbsp;+&nbsp;<i>x</i>)<sup>5</sup>&nbsp;=&nbsp;&sum;&nbsp;C(5,&nbsp;<i>k</i>)&nbsp;<i>x</i><sup><i>k</i></sup>.</p><p>Integrando de 0 a 1, o lado esquerdo dá (2<sup>6</sup>&nbsp;&minus;&nbsp;1)&nbsp;/&nbsp;6 e o direito dá exatamente a soma pedida, porque a integral de <i>x</i><sup><i>k</i></sup> é 1&nbsp;/&nbsp;(<i>k</i>&nbsp;+&nbsp;1).</p><p>Logo a soma vale 63/6&nbsp;=&nbsp;21/2.</p><p>Sem integral: C(5,&nbsp;<i>k</i>)&nbsp;/&nbsp;(<i>k</i>&nbsp;+&nbsp;1)&nbsp;=&nbsp;C(6,&nbsp;<i>k</i>+1)&nbsp;/&nbsp;6, e a soma vira (2<sup>6</sup>&nbsp;&minus;&nbsp;1)&nbsp;/&nbsp;6, que é o mesmo 21/2.</p><p class=\"resp\">Resposta: 21/2</p>"
}
];
