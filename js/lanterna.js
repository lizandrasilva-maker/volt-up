/* ================= MISSÃO: PILHA E LANTERNA (Capítulo 1, Ato 1) =================
   Conteúdo pedagógico da missão: peças, objetivo, conferência e o retorno em 3 etapas
   (1 pista → 2 diagnóstico → 3 explicação, conforme as tentativas) nos 3 níveis.
   A física é a mesma nos 3 níveis (js/cc.js); muda a linguagem, a profundidade e a exigência. */

/* peças da bancada: n pilhas AA (1,5 V), lâmpada de lanterna de 3 V / 0,3 A e, se pedido, o interruptor S1 */
function pecasLanterna(n,interruptor){
  const c=[C('P1','pilha',70,80,0,{V:1.5}),C('P2','pilha',70,175,0,{V:1.5})];
  if(n>2)c.push(C('P3','pilha',165,180,0,{V:1.5}));
  if(interruptor)c.push(C('S1','sw',175,70,0,{closed:false}));
  c.push(C('L1','lamp',275,125,1,{Vn:3,In:0.3,lab:'L1 3 V'}));
  return c}
const LANTERNA_REAL=[['P1','🔋','pilha AA de 1,5 V'],['L1','💡','lâmpada de lanterna (3 V)'],['S1','🔘','botão da lanterna']];
const LANTERNA_GOAL={
  leve:'Acenda a lanterna com brilho forte usando as duas pilhas.',
  moderado:'Monte a lanterna: 2 pilhas de 1,5 V em série, a lâmpada de 3 V e o interruptor S1 comandando.',
  full:'Lanterna de 3 V com o S1: escolha quantas das 3 pilhas usar, sem sobretensão na lâmpada de 3 V / 0,3 A.'};

/* retorno por evento, nível e etapa (1 pista, 2 diagnóstico, 3 explicação); d = valores calculados */
const RETORNO_LANTERNA={
  aberto:{
    leve:[d=>'A lâmpada não acendeu. Siga o caminho com o dedo: ele sai do + da pilha e volta para o −?',
      d=>'O caminho está aberto em algum ponto: falta um fio entre a lâmpada e as pilhas, ou entre as duas pilhas.',
      d=>'A energia só anda num caminho fechado: + da pilha → lâmpada → − da pilha. Com duas pilhas, o − de uma liga no + da outra, e as duas pontas que sobram vão na lâmpada.'],
    moderado:[d=>'Não passa corrente pela lâmpada. Confira se o circuito está fechado.',
      d=>'Circuito aberto: falta ligação em algum ponto entre o + e o − das pilhas.',
      d=>'Corrente só circula em malha fechada. Em série: + de P1 → S1 → X1 da lâmpada; X2 → − de P2; e o − de P1 no + de P2.'],
    full:[d=>'I = 0 A na lâmpada.',
      d=>'Malha aberta: a lâmpada não forma caminho fechado com a fonte.',
      d=>'Sem malha fechada não há corrente. Associe P1 e P2 em série e feche a malha pela lâmpada e pelo S1.']},
  invertida:{
    leve:[d=>'Tudo ligado, mas a lâmpada não acende. Olhe os sinais + e − das pilhas.',
      d=>'Uma pilha está virada ao contrário: uma empurra a energia para um lado e a outra para o outro.',
      d=>'Em série, o − de uma pilha vai no + da outra. Assim as duas empurram para o mesmo lado e a lâmpada acende forte.'],
    moderado:[d=>'Malha fechada e lâmpada apagada: confira a polaridade das pilhas.',
      d=>'Uma pilha está invertida: as tensões se anulam (1,5 V − 1,5 V = 0 V).',
      d=>'Em série aditiva, o − de uma pilha liga no + da outra: 1,5 V + 1,5 V = 3 V. Invertida, uma cancela a outra.'],
    full:[d=>'V ≈ 0 V na lâmpada com a malha fechada.',
      d=>'Pilhas em oposição: na malha, a soma das forças eletromotrizes é 1,5 V − 1,5 V = 0 V.',
      d=>'Pela lei das malhas de Kirchhoff, as tensões somam com sinal. Ligue em série aditiva (− de uma no + da outra) para ter 3 V.']},
  fraca:{
    leve:[d=>'Acendeu, mas fraquinha.',
      d=>'A lâmpada é de 3 V e está recebendo só cerca de '+ccN(d.V,1)+' V: é a força de uma pilha só.',
      d=>'Duas pilhas em série somam: 1,5 V + 1,5 V = 3 V. Ligue o − de uma no + da outra e a lâmpada nas duas pontas que sobram.'],
    moderado:[d=>'A lâmpada acendeu com brilho baixo: ela recebe cerca de '+ccN(d.V,1)+' V.',
      d=>'Com '+ccN(d.V,1)+' V numa lâmpada de 3 V: ou só uma pilha está no circuito, ou as duas estão em paralelo.',
      d=>'Em paralelo a tensão continua 1,5 V. Em série as tensões somam: 1,5 V + 1,5 V = 3 V.'],
    full:[d=>'V = '+ccN(d.V)+' V na lâmpada (nominal 3 V).',
      d=>'Com '+ccN(d.V)+' V, a potência cai para cerca de '+ccN((d.V/3)**2*100,0)+' % da nominal.',
      d=>'P = V² ÷ R: com metade da tensão, um quarto da potência. Associe as pilhas em série para 3 V.']},
  curto:{
    leve:[d=>'Opa! O fio esquentou: a energia achou um atalho sem passar pela lâmpada.',
      d=>'Tem um fio ligando o + direto no − (curto-circuito). A pilha esquenta e se gasta rápido.',
      d=>'Num curto a energia não passa pela lâmpada e a pilha se gasta à toa. Tire o fio que liga o + direto no −.'],
    moderado:[d=>'Curto-circuito na pilha.',
      d=>'Existe um caminho sem carga entre o + e o −: a corrente só é limitada pela resistência interna da pilha.',
      d=>'Sem carga, I = 1,5 V ÷ 0,2 Ω ≈ 7,5 A: a pilha esquenta e descarrega. Retire o fio do curto; a corrente tem que passar pela lâmpada.'],
    full:[d=>'Curto: a corrente fica limitada só pela resistência interna (r).',
      d=>'Icc ≈ E ÷ r = 1,5 V ÷ 0,2 Ω ≈ 7,5 A, contra 0,3 A da lâmpada.',
      d=>'No curto, a potência vai para a resistência interna (P = I² · r ≈ 11 W por pilha): aquecimento e risco de vazamento. Elimine o curto.']},
  queima:{
    leve:[d=>'A lâmpada queimou!',
      d=>'Ela recebeu força demais: três pilhas dão 4,5 V, e a lâmpada é de 3 V.',
      d=>'Use só duas pilhas (3 V). Toque na lâmpada para trocar por uma nova e ligue de novo.'],
    moderado:[d=>'A lâmpada queimou.',
      d=>'Sobretensão: cerca de '+ccN(d.V,1)+' V numa lâmpada de 3 V.',
      d=>'Três pilhas em série dão 4,5 V. A lâmpada é de 3 V: use 2 pilhas e troque a lâmpada (toque nela).'],
    full:[d=>'Filamento rompido.',
      d=>'Sobretensão: '+ccN(d.V)+' V numa lâmpada de 3 V (o modelo queima acima de 1,35 × Vn ≈ 4 V).',
      d=>'P = V² ÷ R ≈ '+ccN(d.V*d.V/10,1)+' W contra 0,9 W nominais: o filamento superaquece. Use 2 pilhas (3 V) e troque a lâmpada (toque nela).']},
  semComando:{
    leve:[d=>'A lâmpada não apaga!',d=>'O botão não está no caminho da energia.',d=>'O botão tem que ficar no meio do caminho: desligado, ele abre o caminho e a lâmpada apaga.'],
    moderado:[d=>'A lâmpada continua acesa com o S1 desligado.',
      d=>'O interruptor não está em série com a lâmpada.',
      d=>'O interruptor vai em série: a corrente passa por ele. Aberto, ele interrompe a malha e a lâmpada apaga.'],
    full:[d=>'S1 aberto e a lâmpada acesa.',
      d=>'S1 não interrompe a malha da lâmpada (está fora dela, ou em paralelo).',
      d=>'Coloque o S1 em série na malha: aberto, I = 0 A em toda a malha.']}
};
/* evento que explica o problema (ou null se a lanterna está certa); ligado = com o S1 fechado */
function eventoLanterna(st){
  const sw=st.comps.find(c=>c.type==='sw');
  const lig=sw?copia(st,{[sw.id]:{closed:true}}):st;
  const r=CC.resolver(lig.comps,lig.wires),L1=r.lampadas.L1||{V:0,I:0};
  if(r.eventos.includes('curto'))return {ev:'curto',d:L1};
  if(st.comps.some(c=>c.queima)||r.eventos.includes('queima'))return {ev:'queima',d:{V:st.__vQueima||L1.V}};
  if(r.eventos.includes('aberto'))return {ev:CC.pilhaInvertida(lig.comps,lig.wires)?'invertida':'aberto',d:L1};
  if(r.eventos.includes('fraca'))return {ev:'fraca',d:L1};
  if(sw){const des=copia(st,{[sw.id]:{closed:false}}),r2=CC.resolver(des.comps,des.wires);
    if(Object.values(r2.lampadas).some(l=>l.I>0.01))return {ev:'semComando',d:L1}}
  return null}
/* conferência da missão: tentativas definem a etapa do retorno (1 pista, 2 diagnóstico, 3 explicação) */
function lanternaCheck(st,tentativas){
  const e=eventoLanterna(st);if(!e)return null;
  const etapa=Math.min(3,Math.max(1,tentativas||1)),txt=RETORNO_LANTERNA[e.ev][S.mode]||RETORNO_LANTERNA[e.ev].moderado;
  return ['','💡 Pista: ','🔎 Diagnóstico: ','📘 Explicação: '][etapa]+txt[etapa-1](e.d)}
/* resumo do que foi aprendido, com os valores calculados */
function lanternaSucesso(st){
  const r=CC.resolver(st.comps,st.wires),l=r.lampadas.L1||{V:0,I:0,P:0};
  if(L())return 'Lanterna acesa e forte! Duas pilhas em série: 1,5 V + 1,5 V = 3 V.';
  if(S.mode==='moderado')return 'Aprovado: L1 com '+ccN(l.V)+' V e '+ccN(l.I)+' A. Em série, 1,5 V + 1,5 V = 3 V; o S1 abre e fecha a malha.';
  return 'Aprovado: V = '+ccN(l.V)+' V, I = '+ccN(l.I)+' A e P = '+ccN(l.P)+' W (R = 10 Ω). Faltam '+ccN(3-l.V)+' V para os 3 V: ficam na resistência interna das pilhas (2 × 0,2 Ω).'}
