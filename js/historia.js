/* ================= HISTÓRIA ================= */
let _pid=0;function picSVG(src){const id='pc'+(++_pid);return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="'+id+'"><circle cx="50" cy="50" r="46"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="#f4c430"/><image href="'+src+'" x="4" y="4" width="92" height="92" clip-path="url(#'+id+')" preserveAspectRatio="xMidYMid slice"/></svg>'}
const NPC={
  chico:{nome:'Mestre Chico',svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#22324d"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#2f5d8a"/><path d="M20 92 H80" stroke="#e9eef3" stroke-width="3"/><path d="M42 78 L50 88 L58 78" fill="#244b70"/><rect x="44" y="70" width="12" height="10" fill="#a8693f"/><path d="M29 46 Q29 72 41 79 Q50 84 59 79 Q71 72 71 46Z" fill="#b97a52"/><path d="M29 52 L29 62 Q32 58 33 50Z M71 52 L71 62 Q68 58 67 50Z" fill="#c9c9c9"/><path d="M26 47 Q26 22 50 21 Q74 22 74 47 Q50 40 26 47Z" fill="#2f5d8a"/><path d="M48 44 Q72 41 88 47 Q86 52 74 51 Q60 48 50 50Z" fill="#244b70"/><circle cx="50" cy="31" r="5" fill="#f4c430"/><path d="M51 27 L48 32 L51 32 L49 36 L53 30 L50 30Z" fill="#244b70"/><path d="M33 53 Q39 50 45 53 M55 53 Q61 50 67 53" stroke="#d6d6d6" stroke-width="3.2" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="60" rx="5.6" ry="5.2" fill="#fff"/><ellipse cx="40" cy="60.6" rx="4.4" ry="4.6000000000000005" fill="#6b3f1f"/><ellipse cx="40" cy="61" rx="2.2" ry="2.6" fill="#120c0a"/><circle cx="38.4" cy="57.66" r="1.7" fill="#fff"/><circle cx="41.8" cy="62.08" r=".9" fill="#fff"/><path d="M33.5 55.4 Q40 52.199999999999996 46.8 56.199999999999996" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="60" rx="5.6" ry="5.2" fill="#fff"/><ellipse cx="60" cy="60.6" rx="4.4" ry="4.6000000000000005" fill="#6b3f1f"/><ellipse cx="60" cy="61" rx="2.2" ry="2.6" fill="#120c0a"/><circle cx="58.4" cy="57.66" r="1.7" fill="#fff"/><circle cx="61.8" cy="62.08" r=".9" fill="#fff"/><path d="M53.5 55.4 Q60 52.199999999999996 66.8 56.199999999999996" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M32 62 l-3 2 M68 62 l3 2" stroke="#8a5434" stroke-width="1.2" stroke-linecap="round"/><path d="M50 63 L48.5 69 L51 69.5" stroke="#8a5434" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M39 72.5 Q44 69 50 71 Q56 69 61 72.5 Q56 75.5 50 73.8 Q44 75.5 39 72.5Z" fill="#dcdcdc"/><path d="M46 77 Q50 78.5 54 77" stroke="#6e3a25" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>'},
  fatima:{nome:'Dona Fátima',svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#4a2a44"/><g fill="#24140e"><circle cx="27" cy="44" r="13"/><circle cx="35" cy="28" r="14"/><circle cx="50" cy="22" r="15"/><circle cx="65" cy="28" r="14"/><circle cx="73" cy="44" r="13"/><circle cx="24" cy="60" r="10"/><circle cx="76" cy="60" r="10"/><circle cx="50" cy="34" r="16"/></g><path d="M30 30 Q40 22 52 24" stroke="#5a3a2c" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#c2453b"/><g fill="#f4c430"><circle cx="30" cy="90" r="2.5"/><circle cx="44" cy="94" r="2.5"/><circle cx="58" cy="90" r="2.5"/><circle cx="72" cy="94" r="2.5"/></g><rect x="44" y="70" width="12" height="10" fill="#6e432c"/><path d="M31 46 Q31 72 42 79 Q50 83 58 79 Q69 72 69 46 Q60 38 50 38 Q40 38 31 46Z" fill="#8a5a3c"/><path d="M34 53 Q39 50.5 45 52.5 M55 52.5 Q61 50.5 66 53" stroke="#24140e" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="60" rx="5.6" ry="6.6" fill="#fff"/><ellipse cx="40" cy="60.6" rx="4.4" ry="6.0" fill="#5a2f1a"/><ellipse cx="40" cy="61" rx="2.2" ry="3.9999999999999996" fill="#120c0a"/><circle cx="38.4" cy="57.03" r="1.7" fill="#fff"/><circle cx="41.8" cy="62.64" r=".9" fill="#fff"/><path d="M33.5 54.0 Q40 50.8 46.8 54.8" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="60" rx="5.6" ry="6.6" fill="#fff"/><ellipse cx="60" cy="60.6" rx="4.4" ry="6.0" fill="#5a2f1a"/><ellipse cx="60" cy="61" rx="2.2" ry="3.9999999999999996" fill="#120c0a"/><circle cx="58.4" cy="57.03" r="1.7" fill="#fff"/><circle cx="61.8" cy="62.64" r=".9" fill="#fff"/><path d="M53.5 54.0 Q60 50.8 66.8 54.8" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="40" cy="60" r="9" fill="none" stroke="#f4c430" stroke-width="1.8"/><circle cx="60" cy="60" r="9" fill="none" stroke="#f4c430" stroke-width="1.8"/><path d="M49 60 H51 M31 59 L27 57 M69 59 L73 57" stroke="#f4c430" stroke-width="1.8"/><ellipse cx="33" cy="69" rx="3.5" ry="2" fill="#c56a5a" opacity=".55"/><ellipse cx="67" cy="69" rx="3.5" ry="2" fill="#c56a5a" opacity=".55"/><path d="M49 66 Q48.5 69 51 69.5" stroke="#5a3424" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M43 73 Q50 80 57 73 Z" fill="#5a1f1f"/><path d="M45 74 Q50 76 55 74" stroke="#fff" stroke-width="1.6" fill="none"/><circle cx="30" cy="70" r="2.6" fill="#f4c430"/><circle cx="70" cy="70" r="2.6" fill="#f4c430"/></svg>'}
};
/* Para escrever um capítulo novo: crie um item em CHAPTERS (fases + falas). Falas = [quem, texto]; quem = 'chico' | 'fatima' | 'eu'. {nome} vira o nome do jogador. */


NPC.chico.body=IMG.chico_body;NPC.fatima.body=IMG.fatima_body;
NPC.chico.svg=picSVG(IMG.chico);NPC.fatima.svg=picSVG(IMG.fatima);
const CHAPTERS=[
 {id:'cap1',nome:'A Casa Acesa',tema:'Fundamentos e circuitos',fases:['faisca','entrada','primeiro','previsao','paralelo','defeito','renovavel','seguranca','ohm'],
  intro:[['chico','Gente nova na oficina! Boas-vindas, {nome}.'],['eu','Bom dia, Mestre! Pronto pra começar o serviço!'],['chico','Calma. Primeiro a gente treina aqui na bancada da oficina. Depois vamos atender clientes de verdade.'],['chico','Começamos pelo básico: de onde vem a energia e como ela chega até uma lâmpada.']],
  fim:[['fatima','Mestre Chico! Agora a casa inteira apagou! Nenhuma luz e nenhuma tomada funcionam!'],['chico','Quando a casa toda apaga, o problema não é uma lâmpada. Precisamos olhar o quadro de distribuição.'],['eu','Então vamos ver o quadro da casa dela?'],['chico','Esse é o próximo capítulo, {nome}. Lá você vai aprender disjuntor geral e DR.']]},

 {id:'cap2',nome:'O Quadro da Dona Fátima',tema:'Quadro de distribuição, disjuntores e DR',soon:true},
 {id:'cap3',nome:'Sol no Telhado',tema:'Energia solar fotovoltaica',soon:true},
 {id:'cap4',nome:'Ventos do Litoral',tema:'Energia eólica',soon:true}
];
const SCENES={
  faisca:[['chico','Antes de mexer em qualquer coisa, me responde umas perguntas. Quero ver como você pensa.']],
  entrada:[['chico','Olha pela janela da oficina: lá no poste tem o transformador, e na parede tem o medidor.'],['chico','É por esse caminho que a energia chega. {nome}, me mostra que você entendeu.']],
  primeiro:[['chico','Essa é a sua bancada de treino. Tem a energia da rede, um interruptor e uma lâmpada.'],['chico','Ligue do jeito da NBR 5410: neutro azul-claro, terra verde-amarelo e o interruptor cortando a fase.']],
  previsao:[['chico','Ainda na bancada: eletricista bom prevê o que vai acontecer antes de ligar. Topa um desafio?'],['eu','Topo! Vou pensar antes de responder.']],
  paralelo:[['fatima','Bom dia! Sou a Dona Fátima, moro aqui na rua. Quero colocar duas lâmpadas na minha sala.'],['fatima','E quero as duas bem fortes, viu?'],['chico','Primeira cliente, {nome}! Cuidado: tem um jeito de ligar que deixa as duas fraquinhas.']],
  defeito:[['fatima','Mestre, a lâmpada da minha cozinha não acende mais! As outras luzes da casa estão funcionando.'],['chico','Se só a cozinha apagou, o problema está no circuito da cozinha. Vamos testar peça por peça: aqui não se troca nada no chute.']],
  renovavel:[['fatima','Mestre, minha vizinha instalou placa solar. Isso é energia que não acaba?'],['chico','Boa pergunta. {nome}, explica pra ela de onde vem cada energia.']],
  seguranca:[['chico','Antes de qualquer serviço na casa da Dona Fátima, a parte mais importante do ofício.'],['eu','Segurança primeiro!']],
  ohm:[['fatima','E por que a minha conta de luz vem tão alta?'],['chico','Hora de fazer conta: potência, tempo e consumo.']]
};
const chapterOf=pid=>CHAPTERS.find(c=>c.fases&&c.fases.includes(pid));
const phaseById=id=>PHASES.find(p=>p.id===id);
function showScene(lines,done){
  let i=0,typing=null;
  const r=()=>{
    const [who,t]=lines[i],txt=t.replace(/\{nome\}/g,esc(S.name||charOf().nome));
    const me=who==='eu';
    const sp=me?{nome:S.name||charOf().nome,svg:charSVG(S.char),body:(typeof IMG!=='undefined'&&IMG[S.char+'_body'])||null}:NPC[who];
    const fig=sp.body?'<img class="vn-body" src="'+sp.body+'" alt="'+esc(sp.nome)+'">':'<div class="vn-port">'+sp.svg+'</div>';
    app.innerHTML=hud()+'<section class="vn'+(me?' me':'')+'">'+
      '<div class="vn-fig">'+fig+'</div>'+
      '<div class="vn-side">'+
        '<span class="vn-chap">'+(i+1)+' / '+lines.length+'</span>'+
        '<span class="vn-name">'+esc(sp.nome)+'</span>'+
        '<button class="vn-box" id="say" aria-live="polite"><span id="tx"></span><span class="vn-caret">▼</span></button>'+
        '<div class="vn-ctrl"><button class="btn sm ghost" id="skip">Pular</button>'+(L()?'<button class="btn sm ghost" id="sp" aria-label="Ouvir">🔊</button>':'')+'<button class="btn sm main" id="go">'+(i<lines.length-1?'▶':'Bora! ⚡')+'</button></div>'+
      '</div></section>';
    bindHud();
    const tx=document.getElementById('tx'),plain=txt.replace(/<[^>]+>/g,'');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let k=0;clearInterval(typing);
    if(reduce){tx.textContent=plain}else typing=setInterval(()=>{k+=2;tx.textContent=plain.slice(0,k);if(k>=plain.length)clearInterval(typing)},L()?40:22);
    const next=()=>{if(tx.textContent.length<plain.length){clearInterval(typing);tx.textContent=plain;return}clearInterval(typing);i++;i<lines.length?r():done()};
    document.getElementById('say').onclick=next;document.getElementById('go').onclick=next;document.getElementById('skip').onclick=()=>{clearInterval(typing);done()};
    const s2=document.getElementById('sp');if(s2)s2.onclick=()=>speak(plain);
  };
  r();
}

const PHASES=[
 {id:'faisca',nome:'Faísca',sub:'Energia e materiais',kind:'quiz',tipo:'quiz',ic:'lampada',cor:'#2f4a6e',
  card:{leve:'O grafite do lápis conduz eletricidade!',moderado:'A prata conduz melhor que o cobre, mas custa caro.',full:'Alta tensão na transmissão = menos corrente = menos perda I²R.'},
  dados:{
   leve:[{q:'Por que o fio tem uma capa de plástico?',o:['Para a eletricidade não passar para a nossa mão','Para a eletricidade andar mais rápido','Para o fio não enferrujar'],w:'O plástico é isolante: ele segura a eletricidade dentro do fio.'},
         {q:'O celular esquenta quando carrega. Para onde vai parte da energia?',o:['Vira calor','Some para sempre','Volta para a tomada'],w:'Energia não some. Ela muda de forma, e parte vira calor.'},
         {q:'Qual destes deixa a eletricidade passar?',o:['A ponta do lápis (grafite)','A borracha','A folha de papel'],w:'O grafite conduz! Dá para acender um LED com um desenho de lápis.'}],
   moderado:[{q:'Por que um fio fino esquenta quando passa muita corrente?',o:['Efeito Joule: a resistência transforma energia em calor','Porque o cobre é isolante','Porque a tensão acaba no meio do fio'],w:'P = R × I². Fio fino tem mais resistência, então esquenta mais.'},
         {q:'Um carregador indica 5 V e 2 A. A potência máxima é…',o:['10 W','2,5 W','7 W'],w:'P = V × I = 5 × 2 = 10 W.'},
         {q:'Qual metal conduz MELHOR a eletricidade?',o:['Prata','Cobre','Alumínio'],w:'A prata vence, mas é cara. O cobre é o melhor custo-benefício.'}],
   full:[{q:'Por que a transmissão usa alta tensão?',o:['Reduz a corrente e as perdas I²R','A alta tensão é mais segura','Aumenta a frequência da rede'],w:'Para a mesma potência, mais tensão significa menos corrente e menos perda nos cabos.'},
         {q:'220 V eficaz corresponde a um pico de aproximadamente…',o:['311 V','220 V','381 V'],w:'Vpico = Vrms × √2 ≈ 311 V.'},
         {q:'Rede trifásica 220/380 V (como em Fortaleza): tensão entre duas fases?',o:['380 V','220 V','440 V'],w:'Fase-fase = fase-neutro × √3 ≈ 380 V.'}]
  }},
 {id:'entrada',nome:'Do Poste à Tomada',sub:'Transformador, medidor e CA',kind:'quiz',tipo:'quiz',ic:'multimetro',cor:'#2b5a4e',
  card:{leve:'O medidor conta a energia da casa em kWh.',moderado:'Rede no Brasil: corrente alternada em 60 Hz.',full:'Secundário 380/220 V em estrela: 220 V é fase-neutro.'},
  dados:{
   leve:[{q:'Para que serve o medidor (o "relógio de luz") na frente da casa?',o:['Contar quanta energia a casa usa','Produzir a energia da casa','Deixar a luz mais forte'],w:'Ele registra o consumo em kWh. É por ele que a conta é calculada.'},
         {q:'O que faz o transformador lá no poste?',o:['Baixa a tensão para chegar nas casas','Guarda energia, como uma pilha','Mede a conta de luz'],w:'Nos fios mais altos do poste a tensão é muito alta. O transformador baixa para 220 V.'},
         {q:'A energia da tomada é igual à de uma pilha?',o:['Não. A da tomada é alternada, com fase e neutro','Sim, é igualzinha','Não. A tomada não tem energia'],w:'Pilha é corrente contínua, com + e −. A tomada é corrente alternada.'}],
   moderado:[{q:'Qual a frequência da rede elétrica no Brasil?',o:['60 Hz','50 Hz','220 Hz'],w:'O Brasil usa 60 Hz: a corrente muda de sentido 120 vezes por segundo.'},
         {q:'O medidor de energia registra o consumo em…',o:['kWh','kW','V'],w:'kW é potência. kWh é energia: potência × tempo.'},
         {q:'Numa tomada 2P+T, quais são os condutores?',o:['Fase, neutro e terra (PE)','Positivo, negativo e terra','Duas fases e um neutro'],w:'Positivo e negativo são termos de corrente contínua. Na rede CA são fase, neutro e PE.'}],
   full:[{q:'Trafo de distribuição 13,8 kV / 380-220 V, secundário em estrela. O que é o 220 V?',o:['Tensão fase-neutro','Tensão fase-fase','Tensão do primário'],w:'Fase-fase = 380 V. Fase-neutro = 380 ÷ √3 ≈ 220 V.'},
         {q:'Por que o neutro é aterrado no padrão de entrada (esquema TN)?',o:['Para fixar o potencial e permitir que a proteção atue numa falta à terra','Para dispensar o condutor de proteção','Para elevar a tensão de fornecimento'],w:'No TN a falta fase-massa vira um circuito de baixa impedância e o dispositivo de proteção atua.'},
         {q:'O medidor marcou 3 kWh em 2 horas. Potência média?',o:['1,5 kW','6 kW','0,67 kW'],w:'P = E ÷ t = 3 ÷ 2 = 1,5 kW.'}]
  }},
 {id:'primeiro',nome:'Primeiro Circuito',sub:'Bancada de treino',kind:'bancada',tipo:'build',ic:'interruptor',cor:'#7a4a1f',
  card:{leve:'Interruptor sempre na fase. Terra sempre ligado.',moderado:'Rede → disjuntor → interruptor → luminária, com PE.',full:'NBR 5410: comando secciona a fase; todo circuito tem PE.'},
  dados:{
   leve:{comps:[BAT(),C('S1','sw',170,45,0,{closed:false}),C('L1','lamp',290,125,1)],
     real:[['L1','💡','lâmpada da bancada'],['S1','🔘','interruptor'],['Rede','🔌','energia que vem do poste']],
     goal:'Ligue a lâmpada L1 na rede, com o interruptor S1 ligando e desligando. Não esqueça o terra!',
     check:st=>tableCheck(st,[{sw:{S1:1},want:{L1:1}},{sw:{S1:0},want:{L1:0}}])},
   moderado:{comps:[BAT(),C('F','fuse',115,45,0,{lab:'DJ 10A'}),C('S1','sw',225,45,0,{closed:false}),C('L1','lamp',290,135,1)],
     real:[['L1','💡','lâmpada da bancada'],['S1','🔘','interruptor'],['DJ','🎚','disjuntor no quadro'],['Rede','🔌','energia que vem do poste']],
     goal:'S1 comanda L1, o disjuntor protege o circuito e a luminária fica aterrada.',
     check:st=>tableCheck(st,[{sw:{S1:1},want:{L1:1}},{sw:{S1:0},want:{L1:0}}])},
   full:{comps:[BAT(),C('F','fuse',115,45,0,{lab:'DJ 10A'}),C('S1','sw',225,45,0,{closed:false}),C('L1','lamp',290,135,1)],
     real:[['L1','💡','luminária da bancada'],['S1','🔘','interruptor simples'],['DJ','🎚','disjuntor do circuito'],['Rede','🔌','220 V~ do QD']],
     goal:'Circuito de iluminação conforme NBR 5410: proteção na fase, comando seccionando a fase, PE na luminária e cores corretas.',
     check:st=>tableCheck(st,[{sw:{S1:1},want:{L1:1}},{sw:{S1:0},want:{L1:0}}])}
  }},
 {id:'previsao',nome:'Previsão',sub:'Desafio na bancada',kind:'bancada',tipo:'predict',ic:'previsao',cor:'#2b4f6e',
  card:{leve:'Atalho na fiação: a energia sempre escolhe o caminho mais fácil.',moderado:'Em série, uma falha apaga tudo. Em paralelo, cada um segue sozinho.',full:'Curto em parte do circuito redistribui tensões: umas cargas apagam, outras fortalecem.'},
  dados:{
   leve:[{sc:scSerie,act:breakL('L2'),acao:'A lâmpada L2 vai queimar.',q:'As lâmpadas estão em fila. Se a L2 queimar, a L1…',o:['Apaga também','Continua acesa','Fica mais forte'],w:'Em fila, se o caminho abre em um lugar, a energia para em todos.'},
         {sc:scParalelo,act:breakL('L2'),acao:'A lâmpada L2 vai queimar.',q:'Agora cada lâmpada tem seu próprio caminho. Se a L2 queimar, a L1…',o:['Continua acesa igual','Apaga também','Fica mais fraca'],w:'O caminho da L1 continua fechado. Assim funcionam as tomadas da sua casa!'},
         {sc:scAtalho,act:closeS('S1'),acao:'Vamos fechar o botão S1.',q:'O botão S1 faz um atalho por cima da L2. Se ele fechar, a L1…',o:['Fica mais forte','Apaga','Nada muda'],w:'A energia segue pelo atalho e passa por fora da L2. Agora a L1 recebe toda a energia sozinha.'}],
   moderado:[{sc:scSerie,act:breakL('L2'),acao:'O filamento de L2 vai romper.',q:'Circuito série. O filamento de L2 rompe. L1…',o:['Apaga: o circuito abriu','Continua igual','Fica mais forte'],w:'Série tem um único caminho. Abriu em um ponto, a corrente cai a zero.'},
         {sc:scParalelo,act:breakL('L2'),acao:'O filamento de L2 vai romper.',q:'Circuito paralelo. L2 rompe. L1…',o:['Continua com o mesmo brilho','Apaga','Fica mais forte'],w:'L1 continua com a tensão plena da fonte. Só a corrente total diminui.'},
         {sc:scAtalho,act:closeS('S1'),acao:'S1 vai fechar.',q:'S1 está em paralelo com L2. Ao fechar S1, L1…',o:['Fica mais forte','Apaga','Fica igual'],w:'L2 fica em curto e sai do circuito. L1 passa de 25% para 100% da potência.'},
         {sc:scCurto,act:closeS('S1'),acao:'S1 vai fechar.',q:'S1 liga a fase direto no neutro. Ao fechar…',o:['Curto: as lâmpadas apagam e a corrente dispara','As lâmpadas ficam mais fortes','Só L1 apaga'],w:'Sem carga no caminho, a corrente sobe sem limite. É aí que o fusível ou disjuntor precisa atuar.'}],
   full:[{sc:scAtalho,act:closeS('S1'),acao:'S1 vai fechar.',q:'Série de 2 cargas iguais. S1 curto-circuita L2. Potência em L1?',o:['Quadruplica','Dobra','Não muda'],w:'Tensão em L1 vai de V/2 para V. P = V²/R, então ×4.'},
         {sc:scCurto,act:closeS('S1'),acao:'S1 vai fechar.',q:'Fechar S1 cria qual condição?',o:['Curto franco na fonte: atuação magnética da proteção','Sobrecarga leve: atuação térmica lenta','Fuga à terra: atuação do DR'],w:'Curto franco gera corrente muito acima de In: atua o disparo magnético (instantâneo).'},
         {sc:scMisto,act:breakL('L3'),acao:'L3 vai abrir.',q:'L1 em série com (L2 ∥ L3). Se L3 abrir, o que acontece?',o:['L1 enfraquece e L2 fortalece','As duas apagam','L1 fortalece e L2 enfraquece'],w:'Req sobe de 1,5R para 2R: a corrente cai e L1 enfraquece. Mas a tensão em L2 sobe de V/3 para V/2.'}]
  }},
 {id:'paralelo',nome:'Série ou Paralelo',sub:'Sala da Dona Fátima',kind:'bancada',tipo:'build',ic:'paralelo',cor:'#5a4a1f',
  card:{leve:'Cada lâmpada no seu caminho = todas fortes.',moderado:'Interruptores independentes = cargas em paralelo.',full:'Comando geral + comando individual: série com o ramo + paralelo entre ramos.'},
  dados:{
   leve:{comps:[BAT(),C('L1','lamp',200,55,0),C('L2','lamp',200,195,0)],
     real:[['L1','💡','lâmpada 1 da sala'],['L2','💡','lâmpada 2 da sala'],['Rede','🔌','energia da casa']],
     goal:'Acenda as DUAS lâmpadas da sala com brilho forte. Cuidado: tem um jeito que deixa as duas fracas!',
     check:st=>tableCheck(st,[{sw:{},want:{L1:1,L2:1}}],true)},
   moderado:{comps:[BAT(),C('S1','sw',135,55,0,{closed:false}),C('L1','lamp',255,55,0),C('S2','sw',135,195,0,{closed:false}),C('L2','lamp',255,195,0)],
     real:[['L1','💡','lâmpada 1 da sala'],['L2','💡','lâmpada 2 da sala'],['S1','🔘','interruptor da lâmpada 1'],['S2','🔘','interruptor da lâmpada 2']],
     goal:'S1 comanda só L1 e S2 comanda só L2, as duas com brilho total.',
     check:st=>tableCheck(st,[{sw:{S1:1,S2:0},want:{L1:1,L2:0}},{sw:{S1:0,S2:1},want:{L1:0,L2:1}},{sw:{S1:1,S2:1},want:{L1:1,L2:1}},{sw:{S1:0,S2:0},want:{L1:0,L2:0}}],true)},
   full:{comps:[BAT(),C('S0','sw',125,45,0,{closed:false,lab:'S0 geral'}),C('L1','lamp',250,45,0),C('S2','sw',135,205,0,{closed:false}),C('L2','lamp',255,205,0)],
     real:[['L1','💡','lâmpada 1 da sala'],['L2','💡','lâmpada 2 da sala'],['S0','🔘','interruptor geral da sala'],['S2','🔘','interruptor da lâmpada 2']],
     goal:'S0 é o geral: desliga tudo. S2 comanda só L2. Brilho total sempre.',
     check:st=>tableCheck(st,[{sw:{S0:1,S2:1},want:{L1:1,L2:1}},{sw:{S0:1,S2:0},want:{L1:1,L2:0}},{sw:{S0:0,S2:1},want:{L1:0,L2:0}},{sw:{S0:0,S2:0},want:{L1:0,L2:0}}],true)}
  }},
 {id:'defeito',nome:'Caça-Defeito',sub:'Cozinha da Dona Fátima',kind:'bancada',tipo:'diag',ic:'multimetro',cor:'#6b5512',
  card:{leve:'Testar antes de trocar economiza peça.',moderado:'Circuito série aberto: a tensão toda aparece no ponto aberto.',full:'Diagnóstico eficiente: divida o circuito ao meio a cada medição.'},
  dados:{leve:{V:220,cand:['F','S1','L1'],limit:3},moderado:{V:220,cand:['F','S1','L1'],limit:3},full:{V:220,cand:['F','S1','L1','w1','w3'],limit:3}}},
 {id:'renovavel',nome:'Guardião Verde',sub:'Renovável ou não?',kind:'classificar',tipo:'sort',ic:'sol',cor:'#2d6a3a',
  card:{leve:'Lenha pode ser renovável, se replantar!',moderado:'A casca de castanha do Ceará vira energia (biomassa).',full:'Hidrogênio só é verde se a eletricidade da eletrólise for renovável.'},
  dados:{
   leve:[{t:'Sol',i:'☀️',r:1,w:'O sol nasce todo dia.'},{t:'Gás de cozinha',i:'🔥',r:0,w:'Vem do petróleo, que acaba.'},{t:'Lenha de árvore replantada',i:'🪵',r:1,w:'Se replanta, a natureza repõe.'},{t:'Bagaço de cana',i:'🌾',r:1,w:'Sobra da cana, que cresce de novo.'},{t:'Carvão mineral',i:'⚫',r:0,w:'Levou milhões de anos para se formar.'},{t:'Vento',i:'🌬️',r:1,w:'O vento não acaba.'}],
   moderado:[{t:'Biogás de aterro',i:'🗑️',r:1,w:'Vem da decomposição do lixo orgânico.'},{t:'Gás natural',i:'🔥',r:0,w:'Fóssil, mesmo poluindo menos que o carvão.'},{t:'Casca de castanha de caju',i:'🌰',r:1,w:'Biomassa típica do Ceará.'},{t:'Nuclear',i:'⚛️',r:0,w:'Quase não emite CO₂, mas o urânio é finito.'},{t:'Hidrelétrica',i:'💧',r:1,w:'O ciclo da chuva repõe a água.'},{t:'Diesel',i:'🛢️',r:0,w:'Derivado do petróleo.'}],
   full:[{t:'Hidrogênio verde',i:'🫧',r:1,w:'Eletrólise alimentada por fonte renovável.'},{t:'Hidrogênio cinza',i:'🏭',r:0,w:'Produzido a partir de gás natural.'},{t:'Biometano',i:'🐄',r:1,w:'Biogás purificado.'},{t:'Xisto betuminoso',i:'🪨',r:0,w:'Fóssil.'},{t:'Energia das marés',i:'🌊',r:1,w:'Movida pela gravitação lunar.'},{t:'Nuclear (fissão)',i:'⚛️',r:0,w:'Baixo carbono, mas o recurso é finito.'},{t:'Geotérmica',i:'🌋',r:1,w:'Calor interno da Terra.'},{t:'Turfa',i:'🟫',r:0,w:'Renova em milhares de anos: tratada como fóssil.'}]
  }},
 {id:'seguranca',nome:'Mão Segura',sub:'Decisões de segurança',kind:'quiz',tipo:'quiz',ic:'disjuntor',cor:'#7a2a24',
  card:{leve:'Disjuntor que desarma está avisando algo.',moderado:'Azul-claro é do neutro. Verde-amarelo é do terra.',full:'Curva C: disparo magnético entre 5 e 10 × In.'},
  dados:{
   leve:[{q:'O disjuntor desarmou sozinho. O que fazer?',o:['Chamar um adulto para descobrir o motivo','Religar várias vezes até ficar','Prender com fita para não cair mais'],w:'Ele desarma para proteger. Alguma coisa está errada.'},
         {q:'A pipa enroscou no fio do poste. E agora?',o:['Deixar lá e avisar um adulto','Puxar com uma vara de bambu','Subir no muro para alcançar'],w:'Fio de poste é muito perigoso. Quem retira é a companhia de energia.'},
         {q:'O benjamim (T) com 4 aparelhos está quente. Isso é…',o:['Perigoso: pode pegar fogo','Normal, todo plugue esquenta','Bom, economiza tomada'],w:'Calor no plugue é sinal de sobrecarga.'}],
   moderado:[{q:'Fio de 1,5 mm² protegido por disjuntor de 20 A. Está…',o:['Errado: o disjuntor é maior que o fio aguenta','Certo','Certo, se o fio for flexível'],w:'O disjuntor protege o fio. Ele precisa abrir antes do fio superaquecer.'},
         {q:'Por que o interruptor deve cortar a fase, e não o neutro?',o:['Para a lâmpada ficar sem tensão quando desligada','Para economizar energia','Tanto faz, é igual'],w:'Cortando o neutro, a lâmpada desligada continua energizada.'},
         {q:'Qual cor a NBR 5410 reserva ao neutro?',o:['Azul-claro','Verde-amarelo','Branco'],w:'Verde-amarelo (ou verde) é do condutor de proteção.'}],
   full:[{q:'Após seccionar e impedir a reenergização, o próximo passo (NR-10) é…',o:['Constatar a ausência de tensão','Instalar o aterramento temporário','Sinalizar'],w:'Só depois de constatar a ausência de tensão se instala o aterramento temporário.'},
         {q:'O DR de 30 mA atua por…',o:['Corrente diferencial (fuga)','Sobrecarga','Sobretensão'],w:'Compara a corrente de ida e de volta. Diferença de 30 mA, desarma.'},
         {q:'Disjuntor curva C: faixa de disparo magnético',o:['5 a 10 × In','3 a 5 × In','10 a 20 × In'],w:'B: 3–5 × In. C: 5–10 × In. D: 10–20 × In.'}]
  }},
 {id:'ohm',nome:'Mestre Ohm',sub:'Contas que acendem',kind:'quiz',tipo:'quiz',ic:'ohm',cor:'#5a3a6e',
  card:{leve:'Chuveiro é o campeão de gasto na casa.',moderado:'kWh = kW × horas.',full:'E = Pinst × HSP × PR.'},
  dados:{
   leve:[{q:'Uma lâmpada sozinha ou duas em fila, na mesma tomada. Quando cada lâmpada brilha mais?',o:['Sozinha','Em fila','Igual'],w:'Em fila elas dividem a energia.'},
         {q:'Qual gasta mais energia em um mês, numa casa comum?',o:['Chuveiro elétrico','Geladeira','Carregador de celular'],w:'O chuveiro tem potência muito alta, mesmo ligado pouco tempo.'},
         {q:'Para gastar menos no banho, o melhor é…',o:['Banho curto e chave no "verão"','Chave no "inverno" e banho curto','Banho longo e chave no "verão"'],w:'Posição "verão" gasta menos, e menos tempo gasta menos.'}],
   moderado:[{q:'Dois resistores de 10 Ω em paralelo, ligados em 12 V. Corrente total?',o:['2,4 A','1,2 A','0,6 A'],w:'Req = 5 Ω. I = 12 ÷ 5 = 2,4 A.'},
         {q:'Ferro de passar de 1000 W, 30 min por dia, durante 30 dias. Consumo?',o:['15 kWh','30 kWh','1,5 kWh'],w:'1 kW × 0,5 h × 30 = 15 kWh.'},
         {q:'Chuveiro de 5500 W em 220 V. Qual disjuntor faz sentido?',o:['32 A','16 A','63 A'],w:'I = 25 A. O disjuntor fica logo acima, junto com o fio adequado.'}],
   full:[{q:'10 × 550 Wp, HSP 5,5 h, PR 0,8. Energia diária estimada?',o:['24,2 kWh','30,25 kWh','44 kWh'],w:'5,5 kWp × 5,5 h × 0,8 = 24,2 kWh.'},
         {q:'12 módulos, Voc 49,5 V, coef. −0,27 %/°C, célula a 10 °C. Voc da string?',o:['≈ 618 V','594 V','≈ 570 V'],w:'ΔT = −15 °C → +4,05 %. 49,5 × 1,0405 × 12 ≈ 618 V.'},
         {q:'10 A em 30 m de cabo de 4 mm² (ida e volta = 60 m; ρ = 0,0172). Queda em 220 V?',o:['≈ 2,6 V (1,2 %)','≈ 5,2 V (2,3 %)','≈ 0,26 V (0,1 %)'],w:'R = 0,0172 × 60 ÷ 4 ≈ 0,26 Ω. ΔV = 10 × 0,26 ≈ 2,6 V.'}]
  }}
];
const CHEER={leve:['Você consegue!','Pensa com calma.','Sem pressa.'],moderado:['Bora energizar!','Foco no circuito!','Partiu bancada!'],full:['Modo profissional ativado.','Confere a norma!','Cálculo na ponta.']};
const PRAISE={leve:['Muito bem!','Isso aí!','Arrasou!'],moderado:['Mandou bem!','Na mosca!','Certo!'],full:['Correto.','Preciso.','Na norma.']};
const charOf=()=>CHARS.find(c=>c.id===S.char)||CHARS.find(c=>c.id==='tecnico');

function speak(t){try{const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.rate=L()?.9:1;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function talk(text){return '<div class="talk">'+charSVG(S.char)+'<div class="bubble">'+text+'</div></div>'}
function stars(n){let s='';for(let i=1;i<=3;i++)s+=i<=n?'★':'<span class="off">★</span>';return '<span class="stars" aria-label="'+n+' de 3 estrelas">'+s+'</span>'}
function hud(){
  const lvl=Math.floor(S.xp/100)+1,pct=S.xp%100;
  const rk=rankOf(),st=streak();
  return '<header class="hud"><button class="av" id="toFicha" aria-label="Abrir minha ficha">'+charSVG(S.char)+'</button><div class="who"><div class="nm">'+esc(S.name||charOf().nome)+' · '+rk.r.n+'</div><div class="xpbar"><i style="width:'+Math.round(rk.p*100)+'%"></i></div></div>'+(st?'<span class="chip fire" title="dias seguidos">🔥 '+st+'</span>':'')+'<span class="chip">⚡ '+S.xp+'</span><button class="iconbtn" id="toAlbum" aria-label="Álbum de cards">'+S.cards.length+' 🃏</button></header>';
}
function setMode(){document.body.classList.toggle('leve',L())}
function bindHud(){const a=document.getElementById('toAlbum');if(a)a.onclick=showAlbum;const f=document.getElementById('toFicha');if(f)f.onclick=showFicha}

