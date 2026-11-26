/* ================= CAPÍTULO 1 · A Oficina do Mestre Chico (corrente contínua) =================
   Capítulo introdutório: só CC, na bancada da oficina (pilha, bateria, fio, lâmpada pequena).
   Aulas (teoria) se alternam com práticas que validam o que foi visto.
   Ato 1 · O que é eletricidade: energia → fontes → carga → estática → condutor → continuidade → grandezas → lanterna.
   CA, tomada e rede só aparecem no Capítulo 2; o capítulo termina explicando CC × CA. */
/* ---------- Ato 2: bancada de medir (lanterna pronta) e as tarefas por nível ---------- */
/* lanterna montada: 2 pilhas em série, S1 fechado e a lâmpada de 3 V / 0,3 A */
function lanternaMontada(){const st={comps:pecasLanterna(2,true),wires:[W('P1.0','S1.0'),W('S1.1','L1.0'),W('L1.1','P2.1'),W('P1.1','P2.0')]};
  st.comps.find(c=>c.id==='S1').closed=true;st.wires[0].cor=st.wires[1].cor='pos';st.wires[2].cor=st.wires[3].cor='neg';return st}
const s1Aberto=st=>!st.comps.find(c=>c.id==='S1').closed;
const fmtA=x=>x.toFixed(2).replace('.',','),fmtW=x=>x.toFixed(2).replace('.',',');
function tarefasMedir(n){const T={
  leve:['Meça a tensão da pilha P1: ponta vermelha no + dela e preta no −.','Agora meça as duas pilhas juntas: do + da P1 até o − da P2.','Meça a tensão na lâmpada acesa.','Toque no interruptor S1 para abrir e meça a tensão nos dois parafusos dele.'],
  moderado:['Meça a tensão nos bornes da pilha P1, com a lanterna acesa.','Meça a tensão do conjunto em série: + da P1 ao − da P2.','Meça a tensão na lâmpada L1 acesa.','Abra o S1 (toque nele) e meça a tensão entre os bornes do interruptor aberto.'],
  full:['Meça a tensão nos bornes de P1 sob carga (lanterna acesa).','Meça a tensão do arranjo série P1 + P2, sob carga.','Meça a tensão na carga L1.','Abra o S1 e meça a tensão no ponto aberto.']}[n];
  return [
   {id:'p1',t:T[0],entre:['P1.0','P1.1'],dica:'Esses não são os dois lados da pilha P1. Procure os parafusos + e − dela.',
    ok:v=>({leve:'P1 mede '+fmtV(v)+' V. Pilha nova dá 1,5 V; com a lanterna acesa, cai um pouquinho.',moderado:'P1: '+fmtV(v)+' V. Com corrente, a resistência interna derruba um pouco os 1,5 V.',full:'U(P1) = '+fmtV(v)+' V < E = 1,50 V: queda r × I na resistência interna.'})[n]},
   {id:'serie',t:T[1],entre:['P1.0','P2.1'],dica:'Uma ponta no + da P1 e a outra no − da P2: as duas pilhas juntas.',
    ok:v=>({leve:'As duas juntas: '+fmtV(v)+' V. Uma pilha atrás da outra, as tensões somam.',moderado:'Conjunto série: '+fmtV(v)+' V, a soma das duas.',full:'U(série) = '+fmtV(v)+' V = U(P1) + U(P2).'})[n]},
   {id:'lamp',t:T[2],entre:['L1.0','L1.1'],dica:'As pontas vão nos dois parafusos da lâmpada L1.',
    ok:v=>({leve:'A lâmpada recebe '+fmtV(v)+' V: quase toda a tensão das pilhas.',moderado:'L1: '+fmtV(v)+' V, a mesma tensão do conjunto (os fios quase não têm queda).',full:'U(L1) = '+fmtV(v)+' V: igual à do arranjo, com condutores ideais.'})[n]},
   {id:'aberto',t:T[3],entre:['S1.0','S1.1'],estado:s1Aberto,antes:'Primeiro abra o interruptor S1: toque nele na bancada.',dica:'As pontas vão nos dois parafusos do interruptor S1.',
    ok:v=>({leve:'Interruptor aberto: '+fmtV(v)+' V. Sem corrente, toda a tensão aparece onde o caminho abriu.',moderado:'Ponto aberto: '+fmtV(v)+' V, a tensão inteira das pilhas; a lâmpada fica com 0 V.',full:'Com I = 0, não há queda em r nem em L1: o ponto aberto recebe E = '+fmtV(v)+' V.'})[n]},
   {q:m=>({leve:{q:'Com o S1 fechado, a lâmpada mediu '+fmtV(m.lamp)+' V. Aberto, o interruptor mediu '+fmtV(m.aberto)+' V. Por que o interruptor aberto mostra mais?',
       o:['Sem corrente, a pilha não perde nada por dentro','O interruptor aberto guarda a tensão da lâmpada','O multímetro mede a pilha e a lâmpada somadas'],
       w:'Com o caminho aberto não passa corrente, e a pilha não perde tensão por dentro. Por isso aparece a tensão inteira, '+fmtV(m.aberto)+' V. O interruptor não guarda nada, e o multímetro mede só entre as duas pontas.'},
     moderado:{q:'Fechado: L1 = '+fmtV(m.lamp)+' V. Aberto: S1 = '+fmtV(m.aberto)+' V. A diferença de '+fmtV(m.aberto-m.lamp)+' V se explica porque…',
       o:['Sem corrente, some a queda na resistência interna','O interruptor aberto acumula a tensão da lâmpada','O voltímetro mede a tensão de L1 e S1 somadas'],
       w:'Com o circuito fechado, a corrente provoca queda na resistência interna das pilhas. Aberto, I = 0 e essa queda some: aparece a tensão inteira. O interruptor não acumula tensão.'},
     full:{q:'U(L1) fechado = '+fmtV(m.lamp)+' V e U(S1) aberto = '+fmtV(m.aberto)+' V. Com R(L1) = 10 Ω, a resistência interna total das pilhas é de cerca de…',
       o:['0,4 Ω','4 Ω','1,1 Ω'],
       w:'I = '+fmtV(m.lamp)+' ÷ 10 ≈ '+fmtA(m.lamp/10)+' A; r = (E − U) ÷ I = ('+fmtV(m.aberto)+' − '+fmtV(m.lamp)+') ÷ '+fmtA(m.lamp/10)+' ≈ 0,4 Ω (0,2 Ω por pilha). 4 Ω erra a vírgula; 1,1 Ω divide a diferença pela tensão.'}})[n]}]}
function tarefasOhm(n){
  const lamp={id:'lamp',t:{leve:'Meça a tensão na lâmpada acesa.',moderado:'Meça a tensão em L1 com a lanterna acesa.',full:'Meça U(L1) sob carga.'}[n],entre:['L1.0','L1.1'],dica:'As pontas vão nos dois parafusos da lâmpada L1.',ok:v=>'L1: '+fmtV(v)+' V.'};
  const p1={id:'p1',t:{leve:'Agora meça a pilha P1 com a lanterna acesa.',moderado:'Meça a tensão nos bornes de P1 com a lanterna acesa.',full:'Meça U(P1) sob carga.'}[n],entre:['P1.0','P1.1'],dica:'Os dois parafusos da pilha P1: vermelha no +, preta no −.',ok:v=>'P1: '+fmtV(v)+' V.'};
  const I=m=>m.lamp/10;
  return [lamp,
   {q:m=>({q:{leve:'A lâmpada tem 10 Ω e você mediu '+fmtV(m.lamp)+' V nela. Quanta corrente passa?',moderado:'L1 tem 10 Ω e mede '+fmtV(m.lamp)+' V. A corrente é…',full:'Com R(L1) = 10 Ω e U(L1) = '+fmtV(m.lamp)+' V, I vale…'}[n],
     o:[fmtA(I(m))+' A',fmtA(m.lamp*10).replace(/,00$/,'')+' A',fmtA(10/m.lamp)+' A'],
     w:'I = U ÷ R = '+fmtV(m.lamp)+' ÷ 10 ≈ '+fmtA(I(m))+' A. Multiplicar U por R dá '+fmtA(m.lamp*10)+' A; dividir R por U dá '+fmtA(10/m.lamp)+' A. Os dois estão errados.'})},
   {q:m=>({q:{leve:'Com '+fmtV(m.lamp)+' V e '+fmtA(I(m))+' A, quanta potência a lâmpada usa?',moderado:'Potência de L1 com U = '+fmtV(m.lamp)+' V e I = '+fmtA(I(m))+' A:',full:'P(L1) com os valores medidos:'}[n],
     o:[fmtW(m.lamp*I(m))+' W','10 W',fmtW(m.lamp+I(m))+' W'],
     w:'P = U × I = '+fmtV(m.lamp)+' × '+fmtA(I(m))+' ≈ '+fmtW(m.lamp*I(m))+' W. 10 W é U ÷ I, que dá a resistência (em ohm), não a potência; somar tensão e corrente não tem sentido físico.'})},
   p1,
   {q:m=>({leve:{q:'A pilha P1 mede '+fmtV(m.p1)+' V com a lanterna acesa, menos que 1,5 V. Por quê?',o:['Passando corrente, ela perde um pouco por dentro','A lâmpada puxa a tensão de volta para ela','O multímetro gasta um pouco da pilha ao medir'],
       w:'Toda pilha tem uma pequena resistência por dentro. Com corrente passando, um pouco da tensão fica ali e vira calor. O multímetro quase não gasta nada.'},
     moderado:{q:'P1 mede '+fmtV(m.p1)+' V com '+fmtA(I(m))+' A passando. A resistência interna dela é de cerca de…',o:['0,2 Ω',fmtW(m.p1/I(m))+' Ω',fmtW(1.5/I(m))+' Ω'],
       w:'r = (E − U) ÷ I = (1,50 − '+fmtV(m.p1)+') ÷ '+fmtA(I(m))+' ≈ 0,2 Ω. Dividir a tensão medida pela corrente dá outra resistência, não a interna.'},
     full:{q:'Com U(P1) = '+fmtV(m.p1)+' V, I = '+fmtA(I(m))+' A e E = 1,5 V, a potência perdida dentro de P1 é de cerca de…',o:[(.2*I(m)*I(m)).toFixed(3).replace('.',',')+' W',fmtW(m.p1*I(m))+' W',fmtW(1.5-m.p1)+' W'],
       w:'P = r × I² = 0,2 × '+fmtA(I(m))+'² ≈ '+(.2*I(m)*I(m)).toFixed(3).replace('.',',')+' W. '+fmtW(m.p1*I(m))+' W é a potência que P1 entrega à lâmpada; '+fmtW(1.5-m.p1)+' é a queda de tensão (em volt), não potência.'}})[n]}]}
/* ---------- Ato 3: série, paralelo, Kirchhoff e caça-defeito (bancada de pilhas) ---------- */
const LAMP_CC=(id,x,y)=>C(id,'lamp',x,y,0,{Vn:3,In:0.3,lab:id+' 3 V'});
/* duas pilhas (P1, P2), duas lâmpadas (L1, L2) e, se pedido, o interruptor S1 */
function pecasDuas(interruptor){const c=[C('P1','pilha',70,80,0,{V:1.5}),C('P2','pilha',70,175,0,{V:1.5}),LAMP_CC('L1',215,150),LAMP_CC('L2',290,150)];
  if(interruptor)c.push(C('S1','sw',175,60,0,{closed:false}));return c}
const DUAS_REAL=[['P1','🔋','pilha AA de 1,5 V'],['L1','💡','lâmpada de 3 V'],['L2','💡','lâmpada de 3 V'],['S1','🔘','interruptor']];
/* cenas prontas (previsão e medir): pilhas em série com as lâmpadas em série ou em paralelo; pilhas em paralelo */
function cenaSerieCC(){const st={comps:pecasDuas(false),wires:[W('P1.0','L1.0'),W('L1.1','L2.0'),W('L2.1','P2.1'),W('P1.1','P2.0')]};corCC(st);return st}
function cenaParaleloCC(){const st={comps:pecasDuas(false),wires:[W('P1.0','L1.0'),W('P1.0','L2.0'),W('L1.1','P2.1'),W('L2.1','P2.1'),W('P1.1','P2.0')]};corCC(st);return st}
function cenaPilhasPar(){const st={comps:[C('P1','pilha',70,80,0,{V:1.5}),C('P2','pilha',70,175,0,{V:1.5}),LAMP_CC('L1',255,125)],wires:[W('P1.0','L1.0'),W('P2.0','P1.0'),W('P2.1','P1.1'),W('L1.1','P1.1')]};corCC(st);return st}
/* cor dos fios na bancada CC: o que sai do + é vermelho; o resto, preto */
function corCC(st){const r=CC.resolver(st.comps,st.wires),pos=new Set(st.comps.filter(c=>c.type==='pilha').map(c=>r.net(c.id+'.0')));
  const mais=r.net('P1.0');st.wires.forEach(w=>{w.cor=r.net(w.a)===mais||r.net(w.b)===mais?'pos':'neg'})}
const queimaLamp=id=>st=>{const c=st.comps.find(x=>x.id===id);c.broken=true;c.show=true};
/* conferência da montagem em paralelo (L1 e L2 fortes e independentes; com S1, ele comanda as duas) */
const RETORNO_PARALELO={
  aberto:{leve:['Nenhuma lâmpada acendeu. Siga o caminho com o dedo: do + das pilhas, pela lâmpada, até o −.','Falta fechar o caminho. Ligue o − de uma pilha no + da outra e as duas pontas que sobram nas lâmpadas.'],
    moderado:['Nenhuma das duas lâmpadas recebe corrente.','O circuito está aberto: confira a série das pilhas (− de P1 no + de P2) e se cada lâmpada fecha o caminho até as duas pontas do conjunto.'],
    full:['I = 0 nas duas cargas.','Malha aberta: associe P1 e P2 em série e ligue cada lâmpada entre os dois polos do arranjo.']},
  uma:{leve:['Só uma lâmpada acendeu.','A outra lâmpada ficou sem caminho. Cada lâmpada precisa de um fio do + e um fio do −, as duas ligadas nas mesmas pontas.'],
    moderado:['Uma lâmpada está sem corrente.','Um dos ramos está aberto: cada lâmpada vai ligada aos mesmos dois pontos (+ e − do conjunto de pilhas).'],
    full:['Um ramo com I = 0.','Ramo aberto: em paralelo, cada carga é ligada diretamente entre os mesmos dois nós da fonte.']},
  serie:{leve:['As duas acenderam, mas fraquinhas.','Elas estão uma atrás da outra (em série) e dividem a força das pilhas. Ligue cada uma direto nas pilhas: aí cada uma recebe tudo.'],
    moderado:['As duas lâmpadas estão com brilho baixo e dependem uma da outra.','Estão em série: a tensão de 3 V se divide (cerca de 1,5 V em cada). Em paralelo, cada uma recebe a tensão inteira.'],
    full:['U ≈ 1,5 V em cada lâmpada; um ramo único.','Associação série: U(L1) + U(L2) = E. Para 3 V em cada uma, ligue-as em paralelo entre os mesmos dois nós.']},
  fraca:{leve:['As lâmpadas acenderam fracas.','As pilhas não estão somando: o − de uma tem que ir no + da outra. Lado a lado (em paralelo) elas dão só 1,5 V.'],
    moderado:['Brilho baixo nas duas, mesmo em paralelo.','A fonte está com 1,5 V: as pilhas estão em paralelo, ou só uma está no circuito. Em série elas dão 3 V.'],
    full:['U ≈ 1,5 V nos ramos.','Fonte com uma célula efetiva (pilhas em paralelo ou uma só). Associe em série: E = 3 V.']},
  curto:{leve:['Opa! Tem um fio ligando o + direto no −.','É um curto-circuito: a energia não passa pelas lâmpadas e a pilha esquenta. Tire o fio que liga o + direto no −.'],
    moderado:['Curto-circuito na fonte.','Há um caminho sem carga entre os polos: retire o fio do curto. A corrente tem que passar pelas lâmpadas.'],
    full:['Curto: I limitada só por r.','Icc ≈ E ÷ r. Elimine o condutor sem carga entre os polos.']},
  queima:{leve:['Uma lâmpada queimou!','Ela recebeu força demais. Use duas pilhas (3 V) e troque a lâmpada (toque nela).'],
    moderado:['Lâmpada queimada por sobretensão.','Com mais de 3 V a lâmpada de 3 V queima. Use duas pilhas em série e troque a lâmpada (toque nela).'],
    full:['Filamento rompido.','Sobretensão acima de 1,35 × Vn. Fonte de 3 V e troque a lâmpada (toque nela).']},
  invertida:{leve:['Tudo ligado, mas nada acende. Olhe o + e o − das pilhas.','Uma pilha está virada: uma empurra para um lado e a outra para o outro. O − de uma vai no + da outra.'],
    moderado:['Malha fechada e lâmpadas apagadas: polaridade.','Uma pilha invertida anula a outra (1,5 V − 1,5 V = 0 V). Ligue em série aditiva.'],
    full:['U ≈ 0 V com a malha fechada.','Fontes em oposição: Σ fem = 0. Corrija a polaridade (série aditiva).']},
  semComando:{leve:['O interruptor não apaga as duas.','O interruptor tem que ficar no caminho que alimenta as duas lâmpadas, antes de o fio se dividir.'],
    moderado:['S1 aberto e alguma lâmpada continua acesa.','O S1 vai em série com a fonte, antes da divisão dos ramos: assim ele comanda as duas.'],
    full:['S1 não interrompe todos os ramos.','Coloque S1 no trecho comum (série com a fonte), antes do nó de derivação.']}};
function eventoParalelo(st){const sw=st.comps.find(c=>c.type==='sw'),lig=sw?copia(st,{[sw.id]:{closed:true}}):st;
  const r=CC.resolver(lig.comps,lig.wires),l1=r.lampadas.L1||{I:0,brilho:0},l2=r.lampadas.L2||{I:0,brilho:0};
  if(r.eventos.includes('curto'))return 'curto';
  if(st.comps.some(c=>c.queima)||r.eventos.includes('queima'))return 'queima';
  if(l1.I<.01&&l2.I<.01)return CC.pilhaInvertida(lig.comps,lig.wires)?'invertida':'aberto';
  if(l1.I<.01||l2.I<.01)return 'uma';
  const t=copia(lig,{L1:{broken:true}}),r2=CC.resolver(t.comps,t.wires),indep=(r2.lampadas.L2||{I:0}).I>.01;
  if(!indep)return 'serie';
  if(l1.brilho<.5||l2.brilho<.5)return 'fraca';
  if(sw){const des=copia(st,{[sw.id]:{closed:false}}),r3=CC.resolver(des.comps,des.wires);if(Object.values(r3.lampadas).some(l=>l.I>.01))return 'semComando'}
  return null}
function paraleloCheck(st,tentativas){const e=eventoParalelo(st);if(!e)return null;const txt=(RETORNO_PARALELO[e][S.mode]||RETORNO_PARALELO[e].moderado),etapa=Math.max(1,tentativas||1);
  return (etapa<2?'💡 Pista: '+txt[0]:'📘 Explicação: '+txt[1])}
function paraleloSucesso(st){const sw=st.comps.find(c=>c.type==='sw'),lig=sw?copia(st,{[sw.id]:{closed:true}}):st,r=CC.resolver(lig.comps,lig.wires),a=r.lampadas.L1,b=r.lampadas.L2;
  if(L())return 'As duas acesas e fortes! Cada lâmpada tem o seu caminho: se uma queimar, a outra continua.';
  if(S.mode==='moderado')return 'Aprovado: '+ccN(a.V)+' V em cada lâmpada e '+ccN(a.I+b.I)+' A saindo das pilhas (a soma das duas correntes).';
  return 'Aprovado: U = '+ccN(a.V)+' V nos ramos, I1 = '+ccN(a.I)+' A, I2 = '+ccN(b.I)+' A e I = I1 + I2 = '+ccN(a.I+b.I)+' A (Req = 5 Ω).'}
/* Kirchhoff na bancada: as lâmpadas em série (malha) */
function tarefasKirch(n){const T={leve:['Meça a tensão na lâmpada L1.','Meça a tensão na lâmpada L2.','Meça as duas pilhas juntas: do + da P1 ao − da P2.'],
    moderado:['Meça U(L1).','Meça U(L2).','Meça a tensão do conjunto de pilhas (+ de P1 ao − de P2).'],full:['Meça U(L1).','Meça U(L2).','Meça a tensão nos terminais da fonte.']}[n];
  return [
   {id:'l1',t:T[0],entre:['L1.0','L1.1'],dica:'As pontas vão nos dois parafusos da L1.',ok:v=>'L1: '+fmtV(v)+' V.'},
   {id:'l2',t:T[1],entre:['L2.0','L2.1'],dica:'As pontas vão nos dois parafusos da L2.',ok:v=>'L2: '+fmtV(v)+' V.'},
   {id:'pil',t:T[2],entre:['P1.0','P2.1'],dica:'Uma ponta no + da P1, a outra no − da P2.',ok:v=>'Pilhas: '+fmtV(v)+' V.'},
   {q:m=>({leve:{q:'L1 mediu '+fmtV(m.l1)+' V, L2 mediu '+fmtV(m.l2)+' V e as pilhas '+fmtV(m.pil)+' V. Somando as duas lâmpadas, dá…',o:[fmtV(m.l1+m.l2)+' V, a mesma tensão das pilhas',fmtV(m.l1)+' V, porque é igual em cada uma',fmtV(m.l1+m.l2+m.pil)+' V, somando tudo'],
       w:'Dando a volta no caminho, a força das pilhas é usada pelas lâmpadas: '+fmtV(m.l1)+' + '+fmtV(m.l2)+' = '+fmtV(m.l1+m.l2)+' V, igual às pilhas.'},
     moderado:{q:'U(L1) = '+fmtV(m.l1)+' V, U(L2) = '+fmtV(m.l2)+' V e U(pilhas) = '+fmtV(m.pil)+' V. A lei das malhas diz que…',o:['U(pilhas) = U(L1) + U(L2)','U(pilhas) = U(L1) = U(L2)','U(pilhas) = U(L1) − U(L2)'],
       w:'Na malha, a tensão da fonte é igual à soma das quedas: '+fmtV(m.l1)+' + '+fmtV(m.l2)+' = '+fmtV(m.l1+m.l2)+' V. Tensões iguais em tudo é característica do paralelo; subtrair uma lâmpada da outra não tem sentido aqui, porque as duas consomem tensão no mesmo caminho.'},
     full:{q:'Com os valores medidos, a soma algébrica na malha (fonte positiva, quedas negativas) dá…',o:[fmtV(m.pil-m.l1-m.l2)+' V',fmtV(m.pil+m.l1+m.l2)+' V',fmtV(m.pil-m.l1)+' V'],
       w:'LTK: '+fmtV(m.pil)+' − '+fmtV(m.l1)+' − '+fmtV(m.l2)+' = '+fmtV(m.pil-m.l1-m.l2)+' V. Somar tudo ignora os sinais; esquecer a L2 deixa a malha incompleta.'}})[n]},
   {q:m=>({q:{leve:'Cada lâmpada tem 10 Ω. Quanta corrente passa na L2?',moderado:'R(L1) = R(L2) = 10 Ω. A corrente em L2 é…',full:'Com R = 10 Ω, I(L2) vale…'}[n],
     o:[fmtA(m.l2/10)+' A',fmtA(2*m.l2/10)+' A',fmtA(m.l2/20)+' A'],
     w:'I = U ÷ R = '+fmtV(m.l2)+' ÷ 10 ≈ '+fmtA(m.l2/10)+' A, a mesma corrente da L1: em série, um caminho só. O dobro ou a metade não respeitam a lei dos nós (não há divisão de corrente).'})}]}
/* caça-defeito da lanterna de emergência */
const EMERG={
  chamado:{leve:'A lanterna de emergência da escada não acende. Meça com o multímetro e descubra o que estragou.',moderado:'Chamado: lanterna de emergência apagada. Ache o defeito com até 4 medições anotadas.',full:'Lanterna de emergência inoperante. Diagnostique com até 3 medições anotadas.'},
  limite:{leve:99,moderado:4,full:3},
  explica:{
    leve:{P2:'Era a pilha P2: ela está fraca, quase sem força. Em série, uma pilha fraca derruba a lanterna inteira.',S1:'Era o interruptor S1: ele não fecha o contato. Com ele ligado, a tensão inteira aparece nele, como se estivesse aberto.',L1:'Era a lâmpada: o filamento rompeu. A tensão inteira aparece nos parafusos dela, mas nada passa.',fio:'Era o fio entre o S1 e a lâmpada: está rompido por dentro. A tensão aparece entre as duas pontas dele.'},
    moderado:{P2:'P2 descarregada: mede bem abaixo de 1,5 V e a série inteira fica sem tensão suficiente.',S1:'S1 com mau contato: fechado, ele mede a tensão inteira (circuito aberto nele).',L1:'L1 aberta (filamento rompido): a tensão da fonte aparece inteira nos bornes dela.',fio:'Condutor S1–L1 rompido: a tensão da fonte aparece entre as duas pontas do fio.'},
    full:{P2:'P2 com fem baixa: a soma das fem cai e a lâmpada fica praticamente apagada.',S1:'S1 com contato aberto: I = 0 e toda a fem aparece nos bornes dele.',L1:'L1 aberta: I = 0 e U(L1) = E (toda a fem no ponto aberto).',fio:'Condutor aberto entre S1 e L1: U = E entre as extremidades do fio.'}},
  nome:{P1:'a pilha P1',P2:'a pilha P2',S1:'o interruptor S1',L1:'a lâmpada L1',fio:'um fio'},
  errou:{leve:k=>'Não é '+EMERG.nome[k]+'. Procure onde aparece a força inteira das pilhas: ali o caminho está aberto.',
    moderado:k=>'Não é '+EMERG.nome[k]+'. Num circuito série aberto, a tensão da fonte aparece no ponto aberto; peças boas medem quase 0 V.',
    full:k=>'Não é '+EMERG.nome[k]+'. Com I = 0, só o elemento aberto apresenta U = E; os demais medem ≈ 0 V.'}};
function dadosEmergencia(n){return {real:LANTERNA_REAL,circuito:lanternaMontada,cand:['P2','S1','L1','fio'],limite:EMERG.limite[n],chamado:EMERG.chamado[n],explica:EMERG.explica[n],errou:EMERG.errou[n],
  opcoes:[['P1','🔋 P1'],['P2','🔋 P2'],['S1','🔘 S1'],['L1','💡 L1'],['fio','〰️ Um fio']]}}
const PREV=n=>{const t={
  leve:[['Duas lâmpadas em série nas pilhas. A L1 vai queimar.','O que acontece com a L2?',['Apaga também','Continua acesa, com o mesmo brilho','Fica mais forte, porque recebe tudo'],'Em série é um caminho só: a L1 queimada abre o caminho e a L2 apaga também.'],
    ['Agora as duas estão em paralelo. A L1 vai queimar.','E a L2?',['Continua acesa','Apaga também','Pisca e apaga depois de um tempo'],'Em paralelo cada lâmpada tem o seu caminho até as pilhas. A L2 nem percebe que a L1 queimou.'],
    ['Duas pilhas em paralelo acendem a lâmpada. Vamos tirar a P2.','O brilho da lâmpada…',['Fica praticamente igual','Cai pela metade','A lâmpada apaga'],'Lado a lado, as duas pilhas dão a mesma força de uma só (1,5 V). Tirando uma, o brilho quase não muda; a pilha que fica só vai durar menos.']],
  moderado:[['L1 e L2 em série com as pilhas. L1 vai abrir (filamento rompido).','Com L1 aberta, a L2…',['Apaga: a malha abriu','Continua igual, pois tem tensão própria','Brilha mais, recebendo os 3 V'],'Em série a corrente é única. L1 aberta interrompe a malha: I = 0 e a L2 apaga.'],
    ['L1 e L2 em paralelo. L1 vai abrir.','Com L1 aberta, a L2…',['Continua acesa','Apaga: a corrente é a mesma nas duas','Fica com metade da tensão'],'Em paralelo cada ramo é independente: a L2 continua com a tensão das pilhas.'],
    ['Duas pilhas em paralelo alimentam L1. P2 vai ser retirada.','A tensão em L1…',['Praticamente não muda','Cai para cerca de 0,75 V','Cai para zero'],'Pilhas iguais em paralelo mantêm 1,5 V. Retirando uma, a tensão quase não muda (só a resistência interna dobra); muda a capacidade, não a tensão.']],
  full:[['Malha série E = 3 V com L1 e L2. L1 vai abrir.','Após a abertura de L1, U(L2) e U(L1) ficam…',['U(L2) = 0 e U(L1) ≈ E','U(L2) = E e U(L1) = 0','As duas com E ÷ 2'],'Com I = 0, não há queda em L2 (U = R × I = 0) e toda a fem aparece no ponto aberto, que é a L1.'],
    ['L1 e L2 em paralelo, fonte real (r = 0,4 Ω). L1 vai abrir.','A tensão em L2…',['Sobe um pouco','Cai pela metade','Fica exatamente igual'],'Abrindo um ramo, a corrente da fonte cai e a queda em r diminui: U = E − r × I sobe um pouco (de ≈ 2,78 V para ≈ 2,88 V).'],
    ['Duas células iguais em paralelo alimentam L1. P2 vai ser retirada.','Em relação a antes, U(L1)…',['Cai alguns centésimos de volt','Cai pela metade','Não muda nada, em teoria nem na prática'],'Em paralelo, r equivalente = 0,1 Ω; com uma célula só, r = 0,2 Ω. A queda r × I aumenta um pouco e U(L1) cai alguns centésimos.']]}[n];
  const cenas=[cenaSerieCC,cenaParaleloCC,cenaPilhasPar],acts=[queimaLamp('L1'),queimaLamp('L1'),st=>{st.wires=st.wires.filter(w=>!w.a.startsWith('P2.')&&!w.b.startsWith('P2.'))}];
  return t.map(([acao,q,o,w],k)=>({sc:cenas[k],act:acts[k],acao,q,o,w}))};
/* ---------- Ato 4: tarefas das práticas de capacitor e eletroímã ---------- */
const fmt2=x=>x.toFixed(2).replace('.',',');
function tarefasCapacitor(n){const t={
  leve:['Ponha a chave em CARREGAR e espere o capacitor encher.','Agora ponha em DESCARREGAR: o LED vai acender com a carga guardada.'],
  moderado:['Carregue o capacitor pelo resistor (chave em CARREGAR) até quase 3 V.','Descarregue o capacitor pelo LED (chave em DESCARREGAR) até quase zero.'],
  full:['Carregue C através de R até u ≥ 0,95 E (≈ 3τ).','Descarregue C pelo LED até u ≤ 0,05 E.']}[n];
  return [
   {id:'carga',t:t[0],cond:(U,m)=>m==='carga'&&U>=2.85,ok:{leve:'Cheio! Ele encheu rápido no começo e devagar no fim.',moderado:'Carregado: em cerca de 3τ (3 s) ele chega a 95 % da tensão da pilha.',full:'u ≥ 0,95 E: em 3τ restam e⁻³ ≈ 5 % para completar.'}[n]},
   {id:'descarga',t:t[1],cond:(U,m)=>m==='descarga'&&U<=.15,ok:{leve:'O LED acendeu e foi apagando: a carga guardada acabou.',moderado:'Descarregado: a corrente no LED caiu junto com a tensão, também de forma exponencial.',full:'Descarga exponencial: u = U0 × e^(−t/τ); a corrente no LED segue a mesma curva.'}[n]},
   {q:()=>({leve:{q:'Quando você pôs a chave em CARREGAR, a tensão no capacitor…',o:['Subiu rápido no começo e devagar no fim','Subiu no mesmo ritmo do começo até o fim da carga','Pulou num instante direto para 3 V'],w:'No começo o capacitor está vazio e a corrente é grande; conforme ele enche, a corrente diminui e a tensão sobe cada vez mais devagar.'},
     moderado:{q:'Com R = 1 kΩ e C = 1000 µF, a constante de tempo τ = R × C vale…',o:['1 s','1000 s','0,001 s'],w:'τ = 1000 Ω × 0,001 F = 1 s. Em 1τ o capacitor chega a 63 % e em cerca de 5τ está praticamente cheio.'},
     full:{q:'Partindo de 0 V com E = 3 V, depois de 2τ carregando a tensão vale cerca de…',o:['2,59 V','1,90 V','3,00 V'],w:'u = 3 × (1 − e⁻²) ≈ 3 × 0,865 ≈ 2,59 V. 1,90 V é o valor em 1τ; 3,00 V só depois de uns 5τ.'}})[n]},
   {q:()=>({leve:{q:'Se a chave ficar em ABERTA com o capacitor cheio, ele…',o:['Continua guardando a carga','Descarrega na hora','Fica com a metade da carga'],w:'Sem caminho para a corrente, a carga fica nas placas. Por isso um aparelho desligado pode ter capacitor carregado.'},
     moderado:{q:'Por que é perigoso mexer numa fonte desligada que tem capacitores grandes?',o:['Eles podem continuar carregados e dar choque','A fonte desligada puxa energia da tomada','Os capacitores viram curto ao desligar'],w:'Capacitores guardam carga depois de desligados. Antes de mexer, descarregue com resistor e confira com o voltímetro.'},
     full:{q:'A energia armazenada em 1000 µF com 3 V é de…',o:['4,5 mJ','9 mJ','1,5 mJ'],w:'W = ½ × C × U² = 0,5 × 0,001 × 3² = 0,0045 J = 4,5 mJ. 9 mJ esquece o ½; 1,5 mJ usa U em vez de U².'}})[n]}]}
function tarefasEletroima(n){const t={
  leve:['Ligue o eletroímã e segure pelo menos 4 clipes.','Agora segure os 12 clipes de uma vez.','Solte todos os clipes.'],
  moderado:['Segure pelo menos 4 clipes.','Segure os 12 clipes.','Faça os clipes caírem sem mexer na bobina.'],
  full:['Atinja força para 4 clipes.','Atinja a força máxima (12 clipes).','Anule a força magnética.']}[n];
  return [
   {id:'quatro',t:t[0],cond:(c,e)=>e.clipes>=4,ok:{leve:'Pegou! Mais voltas, mais pilhas ou o prego de ferro deixam o ímã mais forte.',moderado:'Força suficiente: ela cresce com N × I e com o núcleo de ferro.',full:'F cresce com a força magnetomotriz N × I e com a permeabilidade do núcleo.'}[n]},
   {id:'todos',t:t[1],cond:(c,e)=>e.clipes>=12,ok:{leve:'Os 12! Com o ferro no meio, o eletroímã fica muito mais forte.',moderado:'Máximo: o núcleo de ferro concentra o campo da bobina.',full:'Saturação do modelo: o núcleo de ferro multiplica B.'}[n]},
   {id:'solta',t:t[2],cond:c=>!c.lig,ok:{leve:'Caíram todos! Sem corrente, o eletroímã não puxa. É assim que a contatora solta.',moderado:'Sem corrente, sem campo: a armadura solta, como na contatora quando a bobina perde a tensão.',full:'I = 0 ⇒ B ≈ 0 (desprezando o magnetismo residual): é o desligamento da contatora.'}[n]},
   {q:m=>({leve:{q:'O que fez o eletroímã pegar mais clipes?',o:['Mais voltas, mais pilhas e o prego de ferro','Menos voltas para a corrente andar mais rápido','Tirar o prego para o ímã ficar mais leve'],w:'Mais voltas e mais corrente somam campo, e o ferro concentra esse campo. Tirar o ferro deixa o eletroímã fraco.'},
     moderado:{q:'Com 2 pilhas (3 V), 40 espiras e o resistor de 10 Ω, a força magnetomotriz N × I é de…',o:['12 A·esp','120 A·esp','1,2 A·esp'],w:'I = 3 V ÷ 10 Ω = 0,3 A; N × I = 40 × 0,3 = 12 A·esp. 120 multiplica 40 por 3 V (tensão, não corrente).'},
     full:{q:'Mantendo a corrente, trocar 10 por 40 espiras (núcleo sem saturar) faz o campo B…',o:['Ficar 4 vezes maior','Dobrar','Ficar 16 vezes maior'],w:'B ≈ μ × N × I ÷ ℓ: proporcional a N. Quatro vezes N, quatro vezes B. 16 vezes seria se dependesse de N².'}})[n]}]}
const CAP1_FASES=[
 {id:'energia',nome:'De Onde Vem a Energia',sub:'Formas de energia',kind:'aula',tipo:'aula',ic:'livro',cor:'#2f4a6e',
  card:{leve:'Energia não some: muda de forma. A pilha transforma química em elétrica.',moderado:'Pilha: energia química → elétrica. Lâmpada: elétrica → luz e calor.',full:'Conservação: Eentrada = Eútil + perdas. Rendimento η = Eútil ÷ Eentrada.'},
  dados:{
   leve:{quadros:[
     {fig:'formas',t:'Energia é o que faz as coisas acontecerem: acender, esquentar, mover. Ela aparece de vários jeitos.'},
     {fig:'pilhaLampada',t:'Dentro da pilha tem uma mistura química. Ela empurra a eletricidade pelo fio até a lâmpada.'},
     {fig:'rendimento',t:'Na lâmpada, a eletricidade vira luz. E vira calor também: encoste perto de uma lâmpada acesa e você sente.'},
     {fig:'fontes',t:'A energia das casas vem de usinas. Algumas usam sol, vento e água, que a natureza repõe. Outras queimam coisas que acabam.'},
     {fig:'formas',t:'Guarda isso, {nome}: a energia não some e não aparece do nada. Ela só muda de forma.'}],
    checa:[
     {q:'A lanterna ficou acesa a noite toda e a pilha "acabou". O que aconteceu com a energia que estava nela?',o:['Virou luz e calor e se espalhou pelo quarto','Ficou guardada na lâmpada, que agora está carregada','Sumiu: energia gasta deixa de existir'],w:'A energia da pilha virou luz e um pouco de calor, que se espalharam. A lâmpada não guarda energia, e energia não some: muda de forma.'},
     {q:'Você chega a mão perto de uma lâmpada de filamento acesa há um tempo e sente calor. Por quê?',o:['Parte da eletricidade virou calor em vez de luz','A luz fica presa dentro do vidro e esquenta ele','A eletricidade escapa pelo vidro e esquenta o ar'],w:'O filamento transforma eletricidade em luz e, junto, em muito calor. O vidro esquenta por causa do filamento. A eletricidade não atravessa o vidro: ele é isolante.'},
     {q:'Qual destas usinas usa uma fonte que a natureza repõe?',o:['A que queima bagaço de cana da colheita','A que queima gás natural tirado do subsolo','A que queima carvão tirado da mina'],w:'A cana é plantada de novo a cada safra. O gás é "natural", mas levou milhões de anos para se formar e acaba, assim como o carvão.'}]},
   moderado:{quadros:[
     {fig:'formas',t:'Energia aparece em várias formas: química, elétrica, térmica, luminosa, mecânica. O eletricista leva a forma elétrica até onde ela vira as outras.'},
     {fig:'pilhaLampada',t:'Na pilha, uma reação química separa cargas e cria uma diferença de potencial entre o + e o −. Fechando o circuito, essa energia vai para a carga.'},
     {fig:'rendimento',t:'Na lâmpada de filamento, só uma pequena parte vira luz: o resto é calor. A parte útil dividida pelo total é o rendimento.'},
     {fig:'fontes',t:'Nas usinas, as fontes são renováveis (sol, vento, água, biomassa) ou não renováveis (petróleo, carvão, gás). As duas geram eletricidade; muda se a fonte acaba.'},
     {fig:'formas',t:'Conservação da energia: tudo o que entra sai, somando a parte útil e as perdas.'}],
    checa:[
     {q:'Uma lanterna fica acesa até a pilha descarregar. A energia química da pilha virou…',o:['Luz e calor, que se espalharam pelo ambiente','Carga elétrica acumulada no filamento da lâmpada','Corrente que voltou para dentro da pilha pelo polo −'],w:'Pela conservação, a energia química virou elétrica e, na lâmpada, luz e calor. O filamento não acumula carga. A corrente volta pelo −, mas a energia ficou na lâmpada e no ambiente.'},
     {q:'Uma lâmpada de filamento recebe 60 W e emite cerca de 3 W em luz. O rendimento dela é de…',o:['5 %; os outros 57 W viram calor','95 %; a maior parte vira luz','3 %; é a potência que vira luz'],w:'η = 3 ÷ 60 = 0,05 = 5 %. Os outros 57 W viram calor. 3 % confunde a potência da luz com a porcentagem; 95 % é a parte perdida.'},
     {q:'Bagaço de cana e gás natural são queimados para gerar eletricidade. Por que só o bagaço é renovável?',o:['A cana cresce de novo a cada safra; o gás levou milhões de anos','A queima do bagaço não solta gás carbônico na chaminé','O gás natural gera eletricidade com rendimento menor'],w:'Renovável é a fonte que se repõe no tempo humano. A queima do bagaço também solta CO₂, e o rendimento não decide se a fonte é renovável.'}]},
   full:{quadros:[
     {fig:'formas',t:'Energia é a capacidade de realizar trabalho, medida em joule (J). Na elétrica também se usa o watt-hora: 1 Wh = 3 600 J.'},
     {fig:'pilhaLampada',t:'A pilha é uma fonte eletroquímica: a oxirredução separa cargas e mantém uma força eletromotriz (fem) de cerca de 1,5 V por célula.'},
     {fig:'rendimento',t:'Conservação: Eentrada = Eútil + Eperdas. Rendimento η = Eútil ÷ Eentrada. Na lâmpada de filamento, o rendimento luminoso fica perto de 5 %.'},
     {fig:'fontes',t:'A geração usa fontes primárias renováveis (hídrica, solar, eólica, biomassa) ou não renováveis (fósseis e nuclear). O critério é a reposição natural, não a emissão.'},
     {fig:'formas',t:'Potência é a rapidez da transformação: P = E ÷ t. 1 W = 1 J por segundo.'}],
    checa:[
     {q:'Uma pilha armazena cerca de 3 Wh. Quantos joules são?',o:['≈ 10 800 J','≈ 180 J','≈ 1 200 J'],w:'1 Wh = 3 600 J, então 3 Wh = 10 800 J. 180 J usa 60 no lugar de 3 600 (segundos em uma hora); 1 200 J divide em vez de multiplicar.'},
     {q:'Uma lâmpada de 40 W fica acesa 2 h com rendimento luminoso de 5 %. Quanta energia vira calor?',o:['76 Wh','80 Wh','4 Wh'],w:'Eentrada = 40 W × 2 h = 80 Wh. Luz = 5 % = 4 Wh. Perdas = 80 − 4 = 76 Wh. 80 Wh é a entrada; 4 Wh é a parte útil.'},
     {q:'Uma usina nuclear quase não emite CO₂. Por que ela não é classificada como renovável?',o:['O urânio é um recurso mineral finito','O rendimento térmico do ciclo dela é baixo','Ela depende de água para resfriar o reator'],w:'O critério é a reposição natural da fonte primária, e o urânio não se repõe na escala humana. Baixa emissão é outro critério (baixo carbono). Rendimento e água de resfriamento não definem a classificação.'}]}
  }},
 {id:'carga',nome:'Carga Elétrica',sub:'Átomo, elétron e atrito',kind:'aula',tipo:'aula',ic:'livro',cor:'#3a2a6e',
  card:{leve:'Cargas iguais se empurram; cargas diferentes se puxam.',moderado:'Corpo carregado ganhou ou perdeu elétrons. O próton não sai do núcleo.',full:'Carga é quantizada: q = n × e, com e ≈ 1,6 × 10⁻¹⁹ C.'},
  dados:{
   leve:{quadros:[
     {fig:'atomo',t:'Tudo é feito de pedacinhos chamados átomos. No meio fica o núcleo; em volta, correm os elétrons.'},
     {fig:'atomo',t:'O núcleo tem carga positiva (+). O elétron tem carga negativa (−). Normalmente os dois se equilibram.'},
     {fig:'atrito',t:'Esfregando o pente no cabelo, elétrons passam do cabelo para o pente. O pente fica com sobra de −; o cabelo, com falta.'},
     {fig:'forcas',t:'Cargas iguais se empurram. Cargas diferentes se puxam. Por isso o pente esfregado puxa pedacinhos de papel.'},
     {fig:'macaneta',t:'Se o seu corpo junta carga e você chega perto de um metal, ela pula de uma vez: é o choquinho da maçaneta.'}],
    checa:[
     {q:'Depois de esfregar o pente no cabelo, o pente fica negativo. O que passou de um para o outro?',o:['Elétrons, do cabelo para o pente','Prótons, do pente para o cabelo','Elétrons, do pente para o cabelo'],w:'Quem se mexe é o elétron. Se o pente ficou negativo, ele ganhou elétrons, que vieram do cabelo. O próton fica preso no núcleo.'},
     {q:'Dois balões esfregados no mesmo pano ficam pendurados lado a lado. O que acontece?',o:['Eles se afastam um do outro','Eles se puxam e grudam um no outro','Eles ficam parados, sem força nenhuma'],w:'Os dois ganharam o mesmo tipo de carga. Cargas iguais se empurram, então os balões se afastam.'},
     {q:'Por que o choquinho da maçaneta aparece mais em dia seco?',o:['No ar seco a carga junta no corpo sem escapar','O ar seco tem mais eletricidade guardada','No dia seco o metal da maçaneta fica carregado'],w:'O ar úmido deixa a carga escapar aos poucos. No seco, ela vai juntando no corpo até pular de uma vez. O ar não guarda eletricidade, e a maçaneta só recebe a carga que pula.'}]},
   moderado:{quadros:[
     {fig:'atomo',t:'O átomo tem núcleo com prótons (+) e nêutrons (sem carga), e elétrons (−) na eletrosfera. Com prótons = elétrons, ele é neutro.'},
     {fig:'atrito',t:'Eletrização por atrito: dois materiais diferentes trocam elétrons. Quem perde fica positivo; quem ganha fica negativo. A carga total se conserva.'},
     {fig:'forcas',t:'Lei das cargas: iguais se repelem, opostas se atraem. A força cresce com a carga e com a proximidade.'},
     {fig:'macaneta',t:'Um corpo carregado perto de um condutor provoca uma descarga: a carga atravessa o ar de uma vez. É a eletricidade estática.'},
     {fig:'atomo',t:'Na estática, a carga fica parada até descarregar. Quando a carga anda de forma contínua por um caminho, temos a corrente elétrica.'}],
    checa:[
     {q:'Um corpo neutro fica positivo depois de atritado. O que aconteceu?',o:['Ele perdeu elétrons','Ele ganhou prótons','Ele perdeu nêutrons'],w:'Prótons ficam presos no núcleo e não passam de um corpo ao outro por atrito. Positivo = falta de elétrons. Nêutrons não têm carga.'},
     {q:'Uma régua atritada atrai pedacinhos de papel neutros. Por quê?',o:['A carga da régua desloca as cargas do papel, e o lado mais perto fica oposto','O papel recebe elétrons da régua pelo ar antes de encostar nela','O papel já tem carga própria, oposta à da régua atritada'],w:'É a indução (polarização): o papel continua neutro, mas as cargas dele se deslocam. O lado mais perto fica com carga oposta e a atração vence. Não há troca de carga antes do contato.'},
     {q:'Qual a diferença entre a faísca da maçaneta e a corrente de uma lanterna?',o:['A carga da faísca escoa de uma vez; a pilha mantém o fluxo','Na faísca andam cargas positivas; na lanterna, elétrons','Na faísca não há elétrons em movimento, só luz e calor'],w:'Nos dois casos há carga em movimento. A diferença é a fonte: a carga estática escoa toda num instante; a pilha mantém a diferença de potencial e o fluxo continua.'}]},
   full:{quadros:[
     {fig:'atomo',t:'Carga elementar: e ≈ 1,6 × 10⁻¹⁹ C. O elétron tem −e; o próton, +e. Toda carga é múltipla de e: q = n × e.'},
     {fig:'atrito',t:'Na eletrização por atrito, a série triboelétrica indica quem tende a perder elétrons (fica +) e quem tende a ganhar (fica −). A carga total se conserva.'},
     {fig:'forcas',t:'Lei de Coulomb: F = k × |q1 × q2| ÷ d², com k ≈ 9 × 10⁹ N·m²/C². Dobrando a distância, a força cai para 1/4.'},
     {fig:'macaneta',t:'Em ar seco o corpo chega a alguns quilovolts em relação à terra. Perto do metal, o campo rompe a rigidez dielétrica do ar: é a descarga eletrostática (ESD).'},
     {fig:'atomo',t:'A ESD é um pulso curto. Corrente elétrica é um fluxo ordenado e sustentado: I = Δq ÷ Δt, em ampère (1 A = 1 C/s).'}],
    checa:[
     {q:'Um corpo recebeu 5 × 10¹² elétrons em excesso. Qual a carga dele?',o:['≈ −0,8 µC','≈ +0,8 µC','≈ −8 µC'],w:'q = n × e = 5 × 10¹² × 1,6 × 10⁻¹⁹ = 8 × 10⁻⁷ C = 0,8 µC, negativa porque são elétrons em excesso. −8 µC erra a potência de dez.'},
     {q:'Duas cargas se repelem com 12 N. Se a distância entre elas dobrar, a força passa a…',o:['3 N','6 N','24 N'],w:'F ∝ 1/d². Com d dobrada, F cai para 1/4: 12 ÷ 4 = 3 N. 6 N trata a relação como linear; 24 N inverte o efeito.'},
     {q:'Por que a descarga da maçaneta, de milhares de volts, não é perigosa como a rede elétrica?',o:['A carga é pequena e escoa em microssegundos','A tensão dela é menor que a da rede elétrica','O corpo humano não conduz descarga estática'],w:'A tensão é alta, mas a carga acumulada é pequena: a energia é de milijoules e o pulso dura microssegundos. A rede mantém a corrente pelo corpo enquanto houver contato. O corpo conduz nos dois casos.'}]}
  }},
 {id:'macaneta',nome:'Choque na Maçaneta',sub:'Eletricidade estática',kind:'quiz',tipo:'quiz',ic:'macaneta',cor:'#5a3a6e',
  card:{leve:'Encostar uma chave de metal antes da mão evita o estalo.',moderado:'Pulseira antiestática ligada à terra escoa a carga aos poucos.',full:'ESD danifica componentes com tensões que a pessoa nem sente.'},
  dados:{
   leve:[{q:'Você arrastou o pé no tapete e vai tocar na maçaneta. O que diminui o choquinho?',o:['Encostar primeiro uma chave de metal na maçaneta','Tocar bem de leve, só com a pontinha do dedo','Esfregar mais o pé no tapete para gastar a carga'],w:'A faísca sai pela ponta da chave, e não pela pele: você nem sente. A ponta do dedo concentra a faísca num ponto pequeno e dói mais. Esfregar mais só junta mais carga.'},
         {q:'Ao tirar a blusa de lã no escuro, aparecem estalinhos de luz. O que são?',o:['Faíscas da carga que se juntou no atrito','Eletricidade da tomada que ficou no tecido','Brilho da lã refletindo a luz do celular'],w:'O atrito da lã com o corpo e o cabelo separa cargas. Quando a diferença fica grande, a carga pula pelo ar em faíscas minúsculas. Nada a ver com a tomada.'},
         {q:'O caminhão de combustível arrasta uma correntinha no chão. Para quê?',o:['Para a carga juntada na viagem escoar para o chão','Para descarregar a bateria quando o motor desliga','Para os outros motoristas ouvirem que ele passa'],w:'Com o atrito do ar e do combustível, o tanque junta carga. A corrente leva essa carga para o chão aos poucos, sem faísca perto do combustível.'}],
   moderado:[{q:'Por que encostar uma chave de metal na maçaneta antes da mão evita o estalo?',o:['A descarga acontece na ponta da chave, longe da pele','A chave isola a mão e a carga fica presa no corpo','O metal da chave neutraliza a carga sem precisar de contato'],w:'A carga sai do corpo pela chave, segurada com a mão inteira: a corrente se espalha e a faísca acontece na ponta da chave. O metal conduz, não isola.'},
         {q:'Na manutenção de placas eletrônicas, o técnico usa pulseira ligada à terra. Por quê?',o:['Para escoar a carga do corpo e proteger os componentes','Para se proteger de choque da rede ao mexer na placa','Para a placa continuar funcionando durante o conserto'],w:'A pulseira tem um resistor alto: a carga escoa devagar, sem faísca. Ela não protege contra a rede (para isso se desliga a alimentação), e a placa não precisa dela para funcionar.'},
         {q:'O caminhão-tanque arrasta uma corrente metálica no asfalto. Qual o motivo?',o:['Escoar para a terra a carga gerada pelo atrito na viagem','Aterrar a bateria do caminhão para evitar curto','Dissipar pelo chão o calor gerado nos freios'],w:'O atrito do ar e do combustível eletriza o tanque. Ligado à terra pela corrente, ele não acumula carga e não faz faísca na hora de descarregar o combustível.'}],
   full:[{q:'Por que componentes eletrônicos vêm em embalagem metalizada antiestática?',o:['Ela forma uma gaiola de Faraday e blinda o campo externo','Ela isola o componente para nenhuma carga chegar a ele','Ela aterra o componente diretamente na prateleira'],w:'A embalagem condutora distribui a carga na superfície e blinda o interior (gaiola de Faraday). Isolar não basta: um campo externo ainda induz cargas. E a embalagem não fica aterrada na prateleira.'},
         {q:'Uma pessoa a 2 kV em relação à terra toca um circuito integrado. Ela não sente nada. O CI…',o:['Pode ser danificado: a ESD rompe o óxido de porta','Fica protegido: abaixo da percepção não há dano','Só é danificado se estiver energizado no momento'],w:'A percepção humana começa por volta de 3 kV, mas o óxido de porta de um MOSFET rompe com dezenas ou centenas de volts. O dano não depende de o circuito estar energizado.'},
         {q:'Na descarga de combustível, o caminhão-tanque é ligado por cabo à malha de terra antes de abrir a válvula. Por quê?',o:['Para equalizar o potencial e evitar faísca nos vapores','Para o combustível escoar mais rápido pela mangueira','Para proteger a bomba do posto contra sobrecorrente'],w:'Ligação equipotencial: tanque, mangueira e posto no mesmo potencial não deixam faísca nos vapores inflamáveis. Vazão e proteção da bomba são outros assuntos.'}]
  }},
 {id:'condutor',nome:'Condutor ou Isolante',sub:'Elétrons livres e presos',kind:'aula',tipo:'aula',ic:'livro',cor:'#2b5a4e',
  card:{leve:'Metal conduz; plástico, borracha e vidro isolam. Na dúvida, teste.',moderado:'Condutor tem elétrons livres; isolante tem elétrons presos.',full:'R = ρ × L ÷ S. Cobre: ρ ≈ 0,0172 Ω·mm²/m a 20 °C.'},
  dados:{
   leve:{quadros:[
     {fig:'cobre',t:'No metal, alguns elétrons ficam soltos e andam de átomo em átomo. Por isso o metal deixa a eletricidade passar: é condutor.'},
     {fig:'borracha',t:'No plástico, na borracha e no vidro, os elétrons ficam presos. A eletricidade não passa: são isolantes.'},
     {fig:'fio',t:'Repara no fio: por dentro é cobre, que conduz. Por fora é plástico, que isola e protege a sua mão.'},
     {fig:'agua',t:'Cuidado com a água: a da torneira e o suor têm sais misturados, e esses sais deixam a eletricidade passar.'},
     {fig:'testador',f:{},t:'Na dúvida, a gente testa: pilha, luzinha e duas pontas. Encostou no material e acendeu, ele conduz.'}],
    checa:[
     {q:'Por que o fio elétrico tem cobre por dentro e plástico por fora?',o:['O cobre leva a eletricidade e o plástico protege quem encosta','O plástico ajuda o cobre a levar mais eletricidade','O cobre esquenta menos quando está coberto de plástico'],w:'O cobre conduz: é o caminho da eletricidade. O plástico isola: segura a eletricidade dentro do fio e protege a mão. Ele não ajuda a conduzir.'},
     {q:'O grafite do lápis é preto e parece pedra. Ele conduz eletricidade?',o:['Conduz: tem elétrons que andam soltos','Não conduz: precisa ser metal para conduzir','Conduz apenas quando está molhado'],w:'Grafite não é metal, mas tem elétrons soltos e conduz. Por isso não dá para julgar pela aparência: o jeito é testar.'},
     {q:'Mexer num aparelho elétrico com a mão molhada é mais perigoso. Por quê?',o:['A água com sais da pele faz um caminho para a eletricidade','A água esfria o fio e faz o plástico rachar na hora','A mão molhada escorrega e encosta no fio sem querer'],w:'Suor e água da torneira têm sais, que conduzem. A pele molhada deixa a eletricidade entrar no corpo com muito mais facilidade. O perigo não é escorregar: é conduzir.'}]},
   moderado:{quadros:[
     {fig:'cobre',t:'Nos metais, os elétrons da camada externa ficam livres e formam uma "nuvem". Com tensão aplicada, eles andam todos para o mesmo lado: é a corrente.'},
     {fig:'borracha',t:'Nos isolantes (PVC, borracha, vidro, porcelana), os elétrons estão presos aos átomos. Só com tensão muito alta eles se soltam: aí o isolante rompe.'},
     {fig:'fio',t:'No fio de instalação, o condutor é cobre e a isolação é PVC. Cada isolação tem uma tensão máxima de trabalho, escrita na capa.'},
     {fig:'agua',t:'Na água com sais, a corrente é levada por íons (átomos com carga). Água destilada tem poucos íons e quase não conduz.'},
     {fig:'testador',f:{},t:'O teste de continuidade mostra se existe caminho: a pilha do testador empurra corrente pelo material e um LED mostra se ela passa.'}],
    checa:[
     {q:'Por que o cobre conduz bem e o PVC não?',o:['O cobre tem elétrons livres; no PVC eles estão presos','O PVC tem mais elétrons, e eles se atrapalham','O cobre tem prótons livres que levam a corrente'],w:'Conduzir depende de cargas livres para andar. No cobre há elétrons livres; no PVC, não. Os prótons ficam no núcleo em qualquer material.'},
     {q:'Um isolante "rompe" quando…',o:['A tensão é tão alta que arranca elétrons e forma um caminho','Ele esquenta até virar metal e passa a conduzir','A corrente é tão baixa que atravessa sem ser notada'],w:'Todo isolante tem uma rigidez dielétrica: acima de certa tensão, os elétrons se soltam e o material conduz, muitas vezes com faísca. Ele não vira metal.'},
     {q:'O testador de continuidade (pilha + LED) acende fraco nas pontas mergulhadas em água da torneira. Isso mostra que…',o:['A água tem íons e conduz, mas com resistência alta','A água está ligada em algum fio da rede elétrica','A água é isolante e o LED está com defeito'],w:'O LED acendeu, então há caminho: os íons dos sais conduzem. Acender fraco indica resistência alta. Não precisa de rede: quem empurra é a pilha do testador.'}]},
   full:{quadros:[
     {fig:'cobre',t:'Nos metais, elétrons de valência ficam na banda de condução. Sob campo elétrico eles derivam a poucos mm/s; o sinal, porém, se propaga quase à velocidade da luz.'},
     {fig:'borracha',t:'Isolantes têm banda proibida larga: os elétrons não chegam à condução. A rigidez dielétrica é o campo que rompe o material (ar seco ≈ 3 kV/mm).'},
     {fig:'fio',t:'Resistência de um condutor: R = ρ × L ÷ S. Cobre: ρ ≈ 0,0172 Ω·mm²/m a 20 °C. Mais comprimento, mais R; mais seção, menos R.'},
     {fig:'agua',t:'Em eletrólitos a corrente é iônica: cátions para um lado, ânions para o outro. A condutividade depende da concentração de sais.'},
     {fig:'testador',f:{},t:'O teste de continuidade verifica se a resistência fica abaixo de um limiar. Sempre com o circuito desenergizado: o instrumento usa a própria bateria.'}],
    checa:[
     {q:'Um fio de cobre de 2,5 mm² tem 50 m. Resistência aproximada?',o:['≈ 0,34 Ω','≈ 0,02 Ω','≈ 3,4 Ω'],w:'R = 0,0172 × 50 ÷ 2,5 ≈ 0,34 Ω. 0,02 Ω é só a resistividade, sem comprimento e seção; 3,4 Ω erra a vírgula.'},
     {q:'Por que o teste de continuidade deve ser feito com o circuito desenergizado?',o:['O instrumento injeta corrente própria; tensão externa falseia a leitura e pode danificá-lo','A continuidade só existe quando não há corrente circulando no circuito','O cobre muda de resistência sempre que há tensão aplicada nele'],w:'O ohmímetro mede pela corrente que ele mesmo injeta. Uma tensão externa se soma à dele: a leitura fica errada e o instrumento pode queimar.'},
     {q:'O ar seco rompe com cerca de 3 kV/mm. Uma descarga estática que salta 5 mm indica uma tensão da ordem de…',o:['15 kV','0,6 kV','3 kV'],w:'E × d ≈ 3 kV/mm × 5 mm ≈ 15 kV (estimativa: o campo real não é uniforme). 0,6 kV divide em vez de multiplicar; 3 kV ignora a distância.'}]}
  }},
 {id:'continuidade',nome:'Testador de Continuidade',sub:'Conduz ou isola?',kind:'classificar',tipo:'sort',ic:'testador',cor:'#6b5512',
  bins:[{r:1,t:'💡 Conduz'},{r:0,t:'⛔ Isola'}],certo:['Isola.','Conduz.'],dica:'Quase! Pensa: esse material tem elétron solto ou íon para levar a corrente?',
  pergunta:{leve:'Encostando as pontas do testador, o LED acende?',outro:'Classifique o material pelo teste de continuidade.'},fig:'testador',
  card:{leve:'Grafite não é metal, mas conduz: na dúvida, teste.',moderado:'Água da torneira conduz pelos íons; a destilada quase não.',full:'Óleo mineral e mica isolam; por isso estão em transformadores e resistências.'},
  dados:{
   leve:[{t:'Chave de metal',i:'🔑',r:1,w:'Metal tem elétrons soltos: o LED acende.'},{t:'Régua de plástico',i:'📏',r:0,w:'No plástico os elétrons ficam presos: o LED não acende.'},
     {t:'Moeda',i:'🪙',r:1,w:'Moeda é de metal: conduz.'},{t:'Grafite do lápis',i:'✏️',r:1,w:'Não é metal, mas conduz! Por isso é preciso testar.'},
     {t:'Palito de madeira seco',i:'🪵',r:0,w:'Madeira seca isola. Molhada, pode conduzir um pouco.'},{t:'Copo de vidro',i:'🥛',r:0,w:'Vidro isola: é usado em isoladores.'}],
   moderado:[{t:'Fio de cobre desencapado',i:'🟠',r:1,w:'Cobre: elétrons livres. É o condutor dos fios.'},{t:'Capa do fio (PVC)',i:'⚪',r:0,w:'PVC é a isolação dos fios de instalação.'},
     {t:'Papel-alumínio',i:'📃',r:1,w:'Alumínio é metal: conduz.'},{t:'Porcelana do isolador',i:'🏺',r:0,w:'Porcelana isola: é usada nos isoladores de poste.'},
     {t:'Água da torneira',i:'🚰',r:1,w:'Os sais dissolvidos formam íons: o LED acende fraco.'},{t:'Fita isolante',i:'🎞️',r:0,w:'Feita de PVC: isola as emendas.'}],
   full:[{t:'Grafite',i:'✏️',r:1,w:'Carbono em camadas, com elétrons deslocalizados: conduz.'},{t:'Água destilada',i:'💧',r:0,w:'Quase sem íons: resistividade muito alta. O LED não acende.'},
     {t:'Óleo mineral isolante',i:'🛢️',r:0,w:'Isola e refrigera os enrolamentos dos transformadores.'},{t:'Aço inox',i:'🥄',r:1,w:'Liga metálica: conduz, com resistividade bem maior que a do cobre.'},
     {t:'Mica',i:'🪨',r:0,w:'Mineral isolante usado em resistências de aquecedores.'},{t:'Solda de estanho',i:'🔩',r:1,w:'Liga metálica: conduz e une os condutores.'},
     {t:'Água salgada',i:'🌊',r:1,w:'Eletrólito: íons Na⁺ e Cl⁻ levam a corrente.'},{t:'Ar seco',i:'🌬️',r:0,w:'Isola até cerca de 3 kV/mm; acima disso rompe e faz faísca.'}]
  }},
 {id:'grandezas',nome:'Tensão, Corrente e Resistência',sub:'O que anda no fio',kind:'aula',tipo:'aula',ic:'livro',cor:'#7a4a1f',
  card:{leve:'Tensão empurra, corrente anda, resistência atrapalha.',moderado:'Tensão em volt (V), corrente em ampère (A), resistência em ohm (Ω).',full:'Sentido convencional: do + para o − por fora da fonte; elétrons ao contrário.'},
  dados:{
   leve:{quadros:[
     {fig:'caixa',t:'Pensa numa caixa-d\'água: quanto mais alta, mais forte a água desce. Na eletricidade, essa força é a tensão.'},
     {fig:'caixa',t:'A água correndo no cano é a corrente. E o cano fino, que atrapalha a passagem, é a resistência.'},
     {fig:'fechado',t:'Para a corrente andar, o caminho tem que ser fechado: sai da pilha, passa pela lâmpada e volta para a pilha.'},
     {fig:'aberto',t:'Abriu o caminho em qualquer ponto, a corrente para em todo lugar. É isso que o interruptor faz.'},
     {fig:'sentido',t:'A pilha tem dois lados, o + e o −. Ligar ao contrário pode atrapalhar, como você vai ver na lanterna.'}],
    checa:[
     {q:'Comparando com a caixa-d\'água, o que é a tensão?',o:['A força que empurra, como a altura da caixa','A quantidade de água passando pelo cano','O cano fino que atrapalha a passagem da água'],w:'Tensão é o empurrão. A água passando é a corrente; o cano fino é a resistência.'},
     {q:'O interruptor apaga a lâmpada porque…',o:['Abre o caminho, e a corrente para em todo o circuito','Guarda dentro dele a eletricidade que ia para a lâmpada','Manda a corrente de volta para a pilha por outro fio'],w:'Com o caminho aberto, não há volta para a pilha, e a corrente para em todos os pontos. O interruptor não guarda eletricidade.'},
     {q:'Uma pilha nova está na gaveta, sem nada ligado. Passa corrente por ela?',o:['Não: tem tensão, mas sem caminho fechado não há corrente','Sim: a pilha vai soltando corrente aos pouquinhos','Sim, mas apenas pelo lado +, que é o lado que empurra'],w:'A pilha tem tensão o tempo todo, pronta para empurrar. Mas corrente só existe com o caminho fechado. Por isso ela dura anos na gaveta.'}]},
   moderado:{quadros:[
     {fig:'unidades',t:'Três grandezas para guardar: tensão (U) em volt, corrente (I) em ampère e resistência (R) em ohm.'},
     {fig:'caixa',t:'Tensão é a diferença de potencial que empurra as cargas: na caixa-d\'água, o desnível. Corrente é quanta carga passa por segundo. Resistência é a oposição à passagem.'},
     {fig:'fechado',t:'Circuito fechado: fonte, condutores e carga formam um caminho contínuo. Num caminho único, a mesma corrente passa por todos os pontos.'},
     {fig:'aberto',t:'Circuito aberto: sem continuidade, I = 0 em todo o circuito. A tensão da fonte continua lá e aparece inteira no ponto aberto.'},
     {fig:'sentido',t:'Por convenção, a corrente sai do + da fonte e volta pelo −. Polaridade importa: pilha invertida subtrai em vez de somar.'}],
    checa:[
     {q:'Num circuito com uma pilha e uma lâmpada, onde a corrente é maior?',o:['É a mesma em todos os pontos do caminho','Na saída do +, antes de passar pela lâmpada','Na volta para o −, depois de passar pela lâmpada'],w:'Num caminho único a carga não se acumula nem some: a corrente é igual em todo ponto. A lâmpada transforma energia, não "gasta" corrente.'},
     {q:'O interruptor está aberto. Entre os dois bornes dele, a tensão é…',o:['A tensão inteira da pilha','Zero, porque não passa corrente','Metade da tensão da pilha'],w:'Sem corrente, a lâmpada não tem queda de tensão; toda a tensão da fonte aparece no ponto aberto. É ali que o voltímetro mostra a tensão cheia.'},
     {q:'Na comparação com a caixa-d\'água, um fio mais fino e mais comprido equivale a…',o:['Um cano estreito e longo: mais resistência','Uma caixa mais alta: mais tensão','Mais água no cano: mais corrente'],w:'Fino e comprido dificulta a passagem: aumenta a resistência. A altura da caixa é a tensão; a vazão é a corrente.'}]},
   full:{quadros:[
     {fig:'unidades',t:'Grandezas e unidades do SI: tensão U em volt (V = J/C), corrente I em ampère (A = C/s), resistência R em ohm (Ω = V/A).'},
     {fig:'caixa',t:'Tensão é energia por unidade de carga: 1 V é 1 J para cada coulomb que atravessa. Corrente é a vazão de carga: I = Δq ÷ Δt.'},
     {fig:'sentido',t:'Sentido convencional: a corrente sai do + e entra no − por fora da fonte. Os elétrons andam ao contrário. Diagramas e normas usam o convencional.'},
     {fig:'fechado',t:'Numa malha única, a corrente é a mesma em todos os elementos: é a continuidade da carga.'},
     {fig:'aberto',t:'Circuito aberto: I = 0, então U = R × I = 0 em cada resistor, e a fem da fonte aparece inteira entre os pontos abertos.'}],
    checa:[
     {q:'Uma corrente de 0,3 A circula por 10 s. Quanta carga atravessou a lâmpada?',o:['3 C','0,03 C','33 C'],w:'Δq = I × Δt = 0,3 × 10 = 3 C. 0,03 C divide em vez de multiplicar; 33 C divide 10 por 0,3.'},
     {q:'Uma pilha de 1,5 V movimenta 2 C pelo circuito. Quanta energia ela entrega?',o:['3 J','0,75 J','1,5 J'],w:'U = E ÷ q, então E = U × q = 1,5 × 2 = 3 J. 0,75 J divide; 1,5 J ignora a carga.'},
     {q:'No diagrama, a seta da corrente sai do + da pilha. Os elétrons, nesse fio…',o:['Andam no sentido contrário ao da seta','Andam no mesmo sentido da seta','Ficam parados: só a energia anda'],w:'A seta usa o sentido convencional. Nos metais quem anda são os elétrons, do − para o + por fora da fonte. Andam devagar, mas andam.'}]}
  }},
 /* ---------------- Ato 2 · Medir e calcular ---------------- */
 {id:'medicao',nome:'Como se Mede',sub:'Voltímetro, amperímetro e ohmímetro',kind:'aula',tipo:'aula',ic:'livro',cor:'#2b4f6e',
  card:{leve:'Tensão se mede por fora; corrente, no caminho; resistência, com tudo desligado.',moderado:'Voltímetro em paralelo, amperímetro em série, ohmímetro sem tensão no circuito.',full:'Voltímetro: resistência interna alta. Amperímetro: quase nula. Ohmímetro: fonte própria.'},
  dados:{
   leve:{quadros:[
     {fig:'escala',t:'Este é o multímetro: um aparelho que mede várias coisas. Antes de encostar as pontas, gire a chave para o que você quer medir.'},
     {fig:'voltimetro',t:'Para medir a tensão, encoste as duas pontas nos dois lados da peça, sem desligar nada. A vermelha vai no + e a preta no −.'},
     {fig:'amperimetro',t:'Para medir a corrente, ela tem que passar por dentro do aparelho: a gente abre o circuito e coloca o medidor no meio do caminho.'},
     {fig:'ampCurto',t:'Cuidado: o medidor de corrente encostado nos dois lados da pilha ou da lâmpada vira um atalho. É um curto.'},
     {fig:'ohmimetro',t:'Para medir a resistência, a peça tem que estar sem energia: tire a pilha ou tire a peça do circuito.'}],
    checa:[
     {q:'Você quer saber se a pilha da lanterna ainda está boa, sem desmontar nada. Como encosta o multímetro?',o:['Uma ponta em cada lado da pilha, na escala de tensão','No meio do fio, abrindo o circuito, na escala de corrente','Uma ponta em cada lado da pilha, na escala de corrente'],w:'Tensão se mede por fora, com as pontas nos dois lados. Abrir o circuito é o jeito de medir corrente. E a escala de corrente nos dois lados da pilha faz um curto.'},
     {q:'O medidor de corrente foi encostado nos dois lados da lâmpada acesa. O que acontece?',o:['A corrente desvia por ele e faz um curto','O visor mostra a corrente da lâmpada certinho','A lâmpada brilha mais, porque recebe ajuda dele'],w:'O medidor de corrente quase não atrapalha a passagem. Encostado dos dois lados, ele vira um atalho: a corrente desvia por ele, a lâmpada apaga e a pilha se esgota (ou o fusível do medidor queima).'},
     {q:'Antes de medir a resistência da lâmpada, o que é preciso fazer?',o:['Tirar a pilha do circuito ou tirar a lâmpada','Deixar a lanterna acesa para a lâmpada esquentar','Trocar a ponta vermelha de lugar com a preta'],w:'O medidor de resistência usa uma pilhinha dele mesmo. Com a pilha da lanterna ligada, a leitura sai errada e o aparelho pode estragar. Trocar as pontas não muda a resistência.'}]},
   moderado:{quadros:[
     {fig:'escala',t:'O multímetro mede tensão (V), corrente (A) e resistência (Ω). Escolha a grandeza e a escala antes de encostar; em corrente contínua, use a posição V⎓.'},
     {fig:'voltimetro',t:'Voltímetro em paralelo: as pontas vão nos dois pontos entre os quais se quer a tensão. Vermelha (VΩ) no +, preta (COM) no −; invertidas, o visor mostra o sinal de menos.'},
     {fig:'amperimetro',t:'Amperímetro em série: abre-se o circuito e o medidor passa a fazer parte do caminho. A ponta vermelha vai para o borne A do aparelho.'},
     {fig:'ampCurto',t:'Amperímetro em paralelo com a carga ou com a fonte é um curto-circuito: a resistência dele é quase zero.'},
     {fig:'ohmimetro',t:'Ohmímetro só com o circuito desenergizado: ele injeta uma corrente pequena própria. Com tensão externa, a leitura é falsa e o aparelho pode queimar.'}],
    checa:[
     {q:'Para medir a corrente da lanterna, onde entra o amperímetro?',o:['Em série, abrindo o circuito entre a pilha e a lâmpada','Em paralelo com a lâmpada, com as pontas nos bornes dela','Em paralelo com as pilhas, entre o + e o − do conjunto'],w:'A corrente precisa atravessar o medidor, então ele entra em série. Nas outras duas posições ele fica em paralelo e vira um curto, porque a resistência dele é quase zero.'},
     {q:'O visor mostra −1,50 V medindo uma pilha. O que isso indica?',o:['As pontas estão invertidas em relação à polaridade','A pilha está descarregada e precisa ser trocada','A chave do multímetro está na posição de corrente'],w:'O sinal de menos mostra que a vermelha está no − e a preta no +. O valor de 1,50 V indica pilha boa. Na posição de corrente, o visor não mostraria volts.'},
     {q:'Por que o ohmímetro não pode medir uma peça com o circuito energizado?',o:['A tensão do circuito entra na conta e falseia a leitura','A peça energizada esfria e a resistência dela some','A ponta preta precisaria ficar no borne de corrente'],w:'O ohmímetro calcula R = U ÷ I com a corrente que ele mesmo injeta. Uma tensão externa entra nessa conta e a leitura fica errada, além de poder danificar o aparelho.'}]},
   full:{quadros:[
     {fig:'escala',t:'Multímetro digital: grandeza e faixa selecionadas antes da conexão. Em CC, posição V⎓; a categoria de medição (CAT) indica até que nível de surto ele é seguro.'},
     {fig:'voltimetro',t:'Voltímetro em paralelo, com resistência interna alta (tipicamente 10 MΩ): quase não desvia corrente e não altera o circuito medido.'},
     {fig:'amperimetro',t:'Amperímetro em série, com resistência interna quase nula (shunt): a queda de tensão nele é desprezível e a corrente do circuito praticamente não muda.'},
     {fig:'ampCurto',t:'Amperímetro em paralelo com a fonte forma um curto: I ≈ E ÷ (r interna + r shunt). Por isso a entrada de corrente tem fusível próprio.'},
     {fig:'ohmimetro',t:'Ohmímetro: mede R = U ÷ I com fonte interna. Exige circuito desenergizado e, de preferência, o componente isolado; senão mede o paralelo com o resto do circuito.'}],
    checa:[
     {q:'Um voltímetro de 10 MΩ mede a lâmpada de 10 Ω da lanterna. Quanto ele altera a corrente do circuito?',o:['Quase nada, desvia cerca de um milionésimo dela','Metade, porque divide a corrente com a lâmpada','Aumenta a corrente, pois soma uma resistência em série'],w:'Em paralelo, a corrente se divide na razão inversa das resistências: 10 Ω contra 10 000 000 Ω. O voltímetro leva cerca de um milionésimo e não muda o circuito. Ele não fica em série.'},
     {q:'Um amperímetro de 0,1 Ω é ligado por engano em paralelo com duas pilhas de 1,5 V em série (resistência interna total de 0,4 Ω). A corrente fica perto de…',o:['6 A','30 A','7,5 A'],w:'I = E ÷ (rint + rshunt) = 3 ÷ (0,4 + 0,1) = 6 A, vinte vezes a corrente da lanterna. 30 A ignora a resistência das pilhas; 7,5 A ignora a do amperímetro.'},
     {q:'Medindo um resistor ainda soldado na placa, o ohmímetro mostra menos que o valor marcado. A explicação mais provável é…',o:['Ele mede o paralelo com outros componentes da placa','O resistor aqueceu e a resistência caiu pela metade','A pilha interna do ohmímetro está com tensão alta'],w:'Soldado, o resistor fica em paralelo com o resto do circuito, e a resistência equivalente de um paralelo é menor que a menor delas. Por isso se mede o componente isolado.'}]}
  }},
 {id:'medir',nome:'Medir de Verdade',sub:'Multímetro na lanterna',kind:'bancada',tipo:'medir',ic:'multimetro',cor:'#1f5a4e',cc:true,
  card:{leve:'Pontas nos dois lados da peça: vermelha no +, preta no −.',moderado:'Em série as tensões das pilhas somam; o ponto aberto recebe a tensão inteira.',full:'Sob carga, U = E − r × I: a pilha mede menos que a fem.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{real:LANTERNA_REAL,circuito:lanternaMontada,tarefas:tarefasMedir(n)}]))},
 {id:'leiohm',nome:'Lei de Ohm e Potência',sub:'U = R × I e P = U × I',kind:'aula',tipo:'aula',ic:'livro',cor:'#5a2a4e',
  card:{leve:'Mais tensão, mais corrente. Mais resistência, menos corrente.',moderado:'U = R × I e P = U × I.',full:'P = U × I = R × I² = U² ÷ R; energia E = P × t.'},
  dados:{
   leve:{quadros:[
     {fig:'caixa',t:'Lembra da caixa-d\'água? Mais altura empurra mais água. Na eletricidade, mais tensão empurra mais corrente.'},
     {fig:'ohm',t:'E mais resistência atrapalha mais: com a mesma tensão, passa menos corrente. Essa é a lei de Ohm.'},
     {fig:'lanternaNumeros',t:'Na lanterna: 3 volts empurram a corrente por uma lâmpada de 10 ohms. Passam 0,3 ampère.'},
     {fig:'potencia',t:'A potência diz quanta energia a lâmpada usa a cada segundo. É a tensão vezes a corrente: 3 × 0,3 = 0,9 watt.'},
     {fig:'ohm',t:'Com uma pilha só, a tensão cai pela metade e a corrente também. A lâmpada fica fraca.'}],
    checa:[
     {q:'A lanterna troca de 2 pilhas para 1 pilha. O que acontece com a corrente na lâmpada?',o:['Cai mais ou menos pela metade','Continua igual, porque a lâmpada é a mesma','Dobra, porque a pilha sozinha empurra mais'],w:'Com metade da tensão empurrando a mesma resistência, passa mais ou menos metade da corrente. Por isso a lâmpada fica fraca.'},
     {q:'Duas lâmpadas recebem a mesma tensão. A de resistência maior…',o:['Deixa passar menos corrente','Deixa passar mais corrente','Recebe mais tensão que a outra'],w:'Resistência maior atrapalha mais: com a mesma tensão, passa menos corrente. E as duas recebem a mesma tensão, como diz a pergunta.'},
     {q:'Qual lâmpada usa mais energia por segundo, ou seja, mais potência?',o:['A de 3 V com 0,5 A','A de 3 V com 0,3 A','A de 1,5 V com 0,5 A'],w:'Potência é tensão vezes corrente: 3 × 0,5 = 1,5 W, contra 0,9 W e 0,75 W das outras.'}]},
   moderado:{quadros:[
     {fig:'ohm',t:'Lei de Ohm: U = R × I. Com R fixo, a corrente é proporcional à tensão; com U fixo, inversamente proporcional à resistência.'},
     {fig:'lanternaNumeros',t:'A lâmpada de 3 V / 0,3 A tem R = U ÷ I = 10 Ω. Com 3 V aplicados, I = 3 ÷ 10 = 0,3 A.'},
     {fig:'potencia',t:'Potência elétrica: P = U × I, em watt. Na lâmpada da lanterna, P = 3 × 0,3 = 0,9 W.'},
     {fig:'caixa',t:'As pilhas também têm resistência interna (cerca de 0,2 Ω cada): com carga, a tensão nos bornes cai um pouco abaixo de 1,5 V.'},
     {fig:'ohm',t:'Sabendo duas grandezas, a lei de Ohm dá a terceira. É a conta que o eletricista faz antes de escolher fio e proteção.'}],
    checa:[
     {q:'Uma lâmpada de lanterna recebe 1,5 V e tem 10 Ω. A corrente é…',o:['0,15 A','15 A','6,7 A'],w:'I = U ÷ R = 1,5 ÷ 10 = 0,15 A. 15 A multiplica U por R; 6,7 A divide R por U.'},
     {q:'Medindo 2,88 V numa lâmpada de 10 Ω, a potência dela é de cerca de…',o:['0,83 W','28,8 W','8,3 W'],w:'I = 2,88 ÷ 10 ≈ 0,29 A e P = U × I = 2,88 × 0,29 ≈ 0,83 W (ou U² ÷ R). 28,8 W multiplica U por R; 8,3 W erra a vírgula.'},
     {q:'Por que a tensão de uma pilha nova cai de 1,5 V para cerca de 1,44 V quando a lanterna acende?',o:['A corrente provoca queda na resistência interna dela','A lâmpada acesa devolve parte da tensão para a pilha','O multímetro consome tensão ao medir com carga'],w:'Com corrente, a resistência interna (≈ 0,2 Ω) derruba uma parte: 0,29 A × 0,2 Ω ≈ 0,06 V. O voltímetro quase não consome nada, e a lâmpada não devolve tensão.'}]},
   full:{quadros:[
     {fig:'ohm',t:'Lei de Ohm (bipolo ôhmico): U = R × I. A resistência depende do material, do comprimento e da seção: R = ρ × L ÷ A.'},
     {fig:'potencia',t:'Potência: P = U × I = R × I² = U² ÷ R. Energia: E = P × t (em joule, ou em Wh na prática).'},
     {fig:'lanternaNumeros',t:'Com fonte real: I = E ÷ (R + r). Duas pilhas (E = 3 V, r = 0,4 Ω) na lâmpada de 10 Ω: I = 3 ÷ 10,4 ≈ 0,288 A.'},
     {fig:'caixa',t:'Tensão nos bornes: U = E − r × I = 3 − 0,4 × 0,288 ≈ 2,88 V. A diferença vira calor dentro das pilhas.'},
     {fig:'ohm',t:'O filamento real não é ôhmico: R cresce com a temperatura. No jogo, a lâmpada é modelada como R fixo (10 Ω).'}],
    checa:[
     {q:'Duas pilhas (E = 3 V, r = 0,4 Ω) alimentam a lâmpada de 10 Ω. A potência dissipada dentro das pilhas é de aproximadamente…',o:['0,033 W','0,83 W','0,12 W'],w:'P = r × I² = 0,4 × 0,288² ≈ 0,033 W. 0,83 W é a potência da lâmpada; 0,12 W confunde a queda de tensão r × I com potência.'},
     {q:'Uma lâmpada de 3 V / 0,9 W é ligada em 4,5 V (três pilhas, sem contar a resistência interna). Com R constante, a potência vai para…',o:['2,0 W','1,35 W','0,9 W'],w:'R = U² ÷ P = 9 ÷ 0,9 = 10 Ω. P = 4,5² ÷ 10 ≈ 2,0 W: com 1,5 vez a tensão, a potência sobe 1,5² = 2,25 vezes. 1,35 W supõe que a potência cresce na mesma proporção da tensão.'},
     {q:'A lanterna (0,83 W) fica acesa 3 h. A energia consumida é de cerca de…',o:['2,5 Wh','0,28 Wh','0,83 Wh'],w:'E = P × t = 0,83 W × 3 h ≈ 2,5 Wh (≈ 9 000 J). 0,28 Wh divide em vez de multiplicar; 0,83 Wh esquece o tempo.'}]}
  }},
 {id:'ohmcc',nome:'Mestre Ohm na Bancada',sub:'Medir e calcular',kind:'bancada',tipo:'medir',ic:'ohm',cor:'#6b3a1f',cc:true,
  card:{leve:'Mediu a tensão e sabe a resistência? Dá para achar a corrente.',moderado:'I = U ÷ R e P = U × I com os valores medidos.',full:'r interna = (E − U) ÷ I, a partir de duas medições.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{real:LANTERNA_REAL,circuito:lanternaMontada,tarefas:tarefasOhm(n)}]))},
 /* ---------------- Ato 3 · Série, paralelo e Kirchhoff ---------------- */
 {id:'seriepar',nome:'Série e Paralelo',sub:'Um caminho ou vários',kind:'aula',tipo:'aula',ic:'livro',cor:'#2b3f6e',
  card:{leve:'Em série: um caminho só. Em paralelo: cada lâmpada tem o seu.',moderado:'Série: mesma corrente, tensões somam. Paralelo: mesma tensão, correntes somam.',full:'Série: Req = R1 + R2. Paralelo: 1 ÷ Req = 1 ÷ R1 + 1 ÷ R2.'},
  dados:{
   leve:{quadros:[
     {fig:'serieLamp',t:'Em série, a corrente passa por uma lâmpada e depois pela outra: é um caminho só.'},
     {fig:'serieQueima',t:'Se uma lâmpada em série queima, o caminho abre e as duas apagam. Era assim nos pisca-piscas antigos de Natal.'},
     {fig:'paraleloLamp',t:'Em paralelo, cada lâmpada tem o seu próprio caminho até as pilhas.'},
     {fig:'paraleloQueima',t:'Se uma lâmpada em paralelo queima, a outra continua acesa. É assim que as lâmpadas de uma casa são ligadas.'},
     {fig:'pilhasArranjo',t:'Pilhas também: uma atrás da outra somam a força; lado a lado, a força é a de uma só, mas elas duram mais.'}],
    checa:[
     {q:'Num pisca-pisca antigo, uma lampadinha queimou e todas apagaram. Como elas estavam ligadas?',o:['Em série, num caminho só','Em paralelo, cada uma no seu caminho','Metade em série e metade em paralelo'],w:'Num caminho só, a lâmpada queimada abre o circuito e a corrente para em todas. Em paralelo, as outras continuariam acesas.'},
     {q:'Duas lâmpadas iguais ligadas em série numa lanterna de 3 V. Como fica o brilho?',o:['Fraco nas duas, que dividem a tensão','Forte nas duas, cada uma recebendo os 3 V','Forte na primeira e fraco na segunda'],w:'Em série, a tensão das pilhas se divide entre as lâmpadas: cerca de 1,5 V em cada. A corrente é a mesma nas duas, então o brilho é igual (e fraco).'},
     {q:'Na sua casa, uma lâmpada queimou e as outras continuam acesas. Por quê?',o:['Cada lâmpada está no seu próprio caminho','Estão num caminho só, como o pisca-pisca','A lâmpada queimada passa a força para as outras'],w:'Em casa, as lâmpadas ficam em paralelo: cada uma tem o seu caminho. Se uma abre, as outras continuam. Lâmpada queimada não passa nada para ninguém.'}]},
   moderado:{quadros:[
     {fig:'serieLamp',t:'Associação em série: um único caminho. A mesma corrente passa por todas as cargas, e a tensão da fonte se divide entre elas.'},
     {fig:'serieQueima',t:'Uma carga aberta em série interrompe o circuito inteiro: I = 0 em todas.'},
     {fig:'paraleloLamp',t:'Associação em paralelo: as cargas ligadas aos mesmos dois pontos. Cada uma recebe a tensão inteira, e as correntes se somam na fonte.'},
     {fig:'paraleloQueima',t:'Em paralelo, uma carga aberta não afeta as outras. Por isso as instalações são em paralelo.'},
     {fig:'pilhasArranjo',t:'Pilhas em série somam tensão (1,5 V + 1,5 V = 3 V). Em paralelo a tensão continua 1,5 V, mas a capacidade aumenta.'}],
    checa:[
     {q:'Duas lâmpadas de 10 Ω em paralelo nas pilhas de 3 V. A corrente total que sai das pilhas é de cerca de…',o:['0,6 A','0,3 A','0,15 A'],w:'Cada lâmpada recebe 3 V e puxa 3 ÷ 10 = 0,3 A; em paralelo as correntes somam: 0,6 A (um pouco menos na prática, por causa da resistência interna). 0,15 A seria em série.'},
     {q:'Duas lâmpadas iguais estão em série com 3 V. A tensão em cada uma é…',o:['1,5 V','3 V','6 V'],w:'Em série a tensão se divide: lâmpadas iguais ficam com metade cada, 1,5 V. 3 V seria em paralelo; 6 V somaria em vez de dividir.'},
     {q:'Por que as lâmpadas e tomadas de uma casa são ligadas em paralelo?',o:['Cada carga recebe a tensão inteira e funciona sozinha','A corrente fica igual nas cargas da casa','A tensão se divide e economiza energia na conta'],w:'Em paralelo, cada carga recebe a tensão nominal e liga ou desliga sem afetar as outras. Corrente igual é característica da série; dividir a tensão faria os aparelhos funcionarem mal.'}]},
   full:{quadros:[
     {fig:'serieLamp',t:'Série: Req = R1 + R2 + … ; corrente única e tensões que se somam: U = U1 + U2 (divisor de tensão: U1 = U × R1 ÷ Req).'},
     {fig:'paraleloLamp',t:'Paralelo: 1 ÷ Req = 1 ÷ R1 + 1 ÷ R2; tensão única e correntes que se somam: I = I1 + I2 (divisor de corrente).'},
     {fig:'serieQueima',t:'Em série, um elemento aberto leva I = 0 na malha, e a fem aparece inteira nos terminais dele.'},
     {fig:'paraleloQueima',t:'Em paralelo, um ramo aberto só zera a própria corrente; com fonte real, a tensão nos outros ramos sobe um pouco (menos queda em r).'},
     {fig:'pilhasArranjo',t:'Associação de fontes: série soma fem e resistências internas; paralelo de células iguais mantém a fem e divide r.'}],
    checa:[
     {q:'Duas lâmpadas de 10 Ω em paralelo, alimentadas por E = 3 V com r = 0,4 Ω. A tensão nos terminais fica perto de…',o:['2,78 V','3,00 V','2,94 V'],w:'Req = 10 ÷ 2 = 5 Ω; I = 3 ÷ (5 + 0,4) ≈ 0,556 A; U = E − r × I ≈ 2,78 V. 3,00 V ignora r; 2,94 V seria com uma lâmpada só.'},
     {q:'Um resistor de 10 Ω em série com um de 20 Ω, ligados em 3 V. A tensão no de 20 Ω é…',o:['2 V','1 V','1,5 V'],w:'Divisor de tensão: U2 = U × R2 ÷ (R1 + R2) = 3 × 20 ÷ 30 = 2 V. 1 V é a do resistor de 10 Ω; 1,5 V dividiria igual, ignorando os valores.'},
     {q:'Duas pilhas iguais (1,5 V; 0,2 Ω) em paralelo alimentam uma carga. Em relação a uma pilha só, o arranjo…',o:['Mantém a fem e reduz a resistência interna à metade','Dobra a fem para 3 V e mantém a resistência interna igual','Dobra a fem e também a resistência interna'],w:'Em paralelo, a fem fica 1,5 V e as resistências internas ficam em paralelo: 0,2 ÷ 2 = 0,1 Ω. Dobrar a fem é coisa da série, que também soma as resistências internas.'}]}
  }},
 {id:'parcc',nome:'Série ou Paralelo na Bancada',sub:'Duas lâmpadas fortes',kind:'bancada',tipo:'build',ic:'paralelo',cor:'#1f4f6e',cc:true,
  card:{leve:'Cada lâmpada no seu caminho: as duas fortes e independentes.',moderado:'Paralelo: 3 V em cada lâmpada; o S1 no trecho comum comanda as duas.',full:'I = I1 + I2 na fonte; Req = 5 Ω com duas lâmpadas de 10 Ω.'},
  dados:{
   leve:{comps:pecasDuas(false),real:DUAS_REAL,goal:'Acenda as duas lâmpadas com brilho forte. Se uma queimar, a outra tem que continuar acesa.',check:paraleloCheck,sucesso:paraleloSucesso},
   moderado:{comps:pecasDuas(true),real:DUAS_REAL,goal:'Monte L1 e L2 em paralelo nas pilhas em série (3 V), com o S1 comandando as duas.',check:paraleloCheck,sucesso:paraleloSucesso},
   full:{comps:pecasDuas(true),real:DUAS_REAL,goal:'Associação paralela de L1 e L2 (3 V / 0,3 A cada) sob E = 3 V, com S1 no trecho comum. Confira I = I1 + I2.',check:paraleloCheck,sucesso:paraleloSucesso}}},
 {id:'prevcc',nome:'Previsão na Bancada CC',sub:'O que acontece se…',kind:'bancada',tipo:'predict',ic:'previsao',cor:'#3a4a6e',cc:true,
  card:{leve:'Em série, uma queimada apaga tudo. Em paralelo, não.',moderado:'Série: malha única. Paralelo: ramos independentes.',full:'Com fonte real, abrir um ramo eleva um pouco a tensão nos outros.'},
  dados:{leve:PREV('leve'),moderado:PREV('moderado'),full:PREV('full')}},
 {id:'kirchhoff',nome:'As Leis de Kirchhoff',sub:'Nós e malhas',kind:'aula',tipo:'aula',ic:'livro',cor:'#4a2a6e',
  card:{leve:'O que entra num ponto sai dele; a força da pilha se divide pelo caminho.',moderado:'Nós: Σ I que entra = Σ I que sai. Malhas: fonte = soma das quedas.',full:'LCK: Σ I = 0 no nó. LTK: Σ U = 0 na malha, com sinal.'},
  dados:{
   leve:{quadros:[
     {fig:'kirchNo',t:'Num ponto onde os fios se encontram, toda a corrente que chega tem que sair. Ela não some nem fica guardada ali.'},
     {fig:'paraleloLamp',t:'No paralelo, a corrente sai das pilhas, se divide entre as lâmpadas e depois se junta de novo.'},
     {fig:'kirchMalha',t:'Dando a volta no caminho, a força que as pilhas dão é usada nas lâmpadas: somando o que cada uma usa, dá a força das pilhas.'},
     {fig:'serieLamp',t:'Com duas lâmpadas iguais em série, cada uma fica com metade: 1,5 V + 1,5 V = 3 V das pilhas.'},
     {fig:'kirchNo',t:'Essas duas regras são as leis de Kirchhoff. Com elas, o eletricista confere se uma medição faz sentido.'}],
    checa:[
     {q:'Num ponto chegam 0,3 A por um fio e 0,3 A por outro. Quanto sai pelo terceiro fio?',o:['0,6 A','0,3 A','0 A'],w:'Tudo o que chega num ponto sai dele: 0,3 + 0,3 = 0,6 A. A corrente não some nem fica parada no ponto.'},
     {q:'Duas lâmpadas em série nas pilhas de 3 V. Uma mede 1 V. Quanto mede a outra?',o:['2 V','3 V','4 V'],w:'Dando a volta, as tensões das lâmpadas somam a das pilhas: 1 + 2 = 3 V. 3 V seria se cada uma recebesse tudo; 4 V passaria da força das pilhas.'},
     {q:'Por que a corrente que volta para a pilha é igual à que sai dela?',o:['A corrente não some pelo caminho; o que a lâmpada usa é a energia','A lâmpada acesa devolve para o fio a corrente que ela usou','A pilha puxa de volta a mesma quantidade que mandou'],w:'A carga elétrica não some: a mesma corrente sai e volta. O que a lâmpada usa é a energia, não a corrente.'}]},
   moderado:{quadros:[
     {fig:'kirchNo',t:'1ª lei de Kirchhoff (nós): a soma das correntes que entram num nó é igual à soma das que saem.'},
     {fig:'paraleloLamp',t:'No paralelo da bancada, a corrente das pilhas se divide entre L1 e L2 e se soma de novo no retorno: I = I1 + I2.'},
     {fig:'kirchMalha',t:'2ª lei (malhas): numa malha fechada, a soma das tensões das fontes é igual à soma das quedas nas cargas.'},
     {fig:'serieLamp',t:'Na série: U(pilhas) = U(L1) + U(L2). Com lâmpadas iguais, cada uma fica com a metade.'},
     {fig:'kirchMalha',t:'As leis servem para conferir medições: se a soma não fecha, há erro de leitura ou defeito no circuito.'}],
    checa:[
     {q:'Num nó entram 0,5 A e saem 0,2 A por um ramo. Quanto sai pelo outro ramo?',o:['0,3 A','0,7 A','0,5 A'],w:'Entra 0,5 A; saem 0,2 A + I. Então I = 0,3 A. 0,7 A soma em vez de subtrair; 0,5 A esquece o outro ramo.'},
     {q:'Pilhas de 3 V em série com L1 e L2. O voltímetro mede 1,8 V em L1. Em L2, ele deve medir cerca de…',o:['1,2 V','1,8 V','3 V'],w:'Pela lei das malhas, 3 = 1,8 + U2, então U2 = 1,2 V (desprezando a resistência interna). 1,8 V seria com lâmpadas iguais; 3 V é a das pilhas.'},
     {q:'Num circuito em série, você mede 1,5 V em L1, 1,5 V em L2 e 1,5 V nas pilhas. O que isso indica?',o:['A soma não fecha, então há erro de leitura ou defeito','O circuito está perfeito, as tensões são iguais','A lei das malhas não vale em corrente contínua'],w:'Em série, U(L1) + U(L2) tem que dar a tensão das pilhas: 1,5 + 1,5 = 3 V, e não 1,5 V. Se não fecha, algo está errado. A lei vale em CC e em CA.'}]},
   full:{quadros:[
     {fig:'kirchNo',t:'LCK (lei das correntes): Σ I = 0 em qualquer nó, consequência da conservação da carga.'},
     {fig:'kirchMalha',t:'LTK (lei das tensões): Σ U = 0 ao longo de qualquer malha, com sinal: elevações (fem) positivas e quedas (R × I) negativas.'},
     {fig:'serieLamp',t:'Malha da bancada: E − r × I − R1 × I − R2 × I = 0, logo I = E ÷ (r + R1 + R2).'},
     {fig:'paraleloLamp',t:'Nó de saída do paralelo: I = I1 + I2, com I1 = U ÷ R1 e I2 = U ÷ R2 (mesma U nos ramos).'},
     {fig:'kirchMalha',t:'Com as duas leis se monta um sistema de equações e se resolve qualquer circuito resistivo (análise nodal ou de malhas).'}],
    checa:[
     {q:'Na malha: E = 3 V, r = 0,4 Ω e L1 = L2 = 10 Ω em série. A corrente é de cerca de…',o:['0,147 A','0,3 A','0,294 A'],w:'LTK: 3 − 0,4 I − 10 I − 10 I = 0, logo I = 3 ÷ 20,4 ≈ 0,147 A. 0,3 A seria com uma lâmpada e fonte ideal; 0,294 A esquece uma das lâmpadas.'},
     {q:'Num nó, I1 = 0,2 A entra, I2 = 0,5 A sai e I3 é desconhecida. Adotando I3 entrando, o valor dela é…',o:['+0,3 A','−0,3 A','+0,7 A'],w:'LCK: I1 + I3 − I2 = 0, logo I3 = 0,5 − 0,2 = +0,3 A (entra mesmo). O sinal negativo indicaria sentido adotado errado; 0,7 A soma em vez de subtrair.'},
     {q:'Por que a soma das tensões medidas numa malha real pode diferir alguns milivolts de zero?',o:['Erro do instrumento e quedas nas conexões','A lei das tensões de Kirchhoff vale apenas em corrente alternada','A energia se perde no meio da malha'],w:'A LTK é exata; a diferença vem da incerteza do multímetro e de pequenas quedas em contatos e fios. Ela vale em CC e em CA.'}]}
  }},
 {id:'kirchcc',nome:'Kirchhoff na Bancada',sub:'Medir e conferir a malha',kind:'bancada',tipo:'medir',ic:'multimetro',cor:'#2a4a5e',cc:true,
  card:{leve:'Somando as lâmpadas, dá a força das pilhas.',moderado:'U(pilhas) = U(L1) + U(L2) e a corrente é a mesma nas duas.',full:'Σ U = 0 na malha medida; I igual em toda a série.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{real:DUAS_REAL,circuito:cenaSerieCC,tarefas:tarefasKirch(n)}]))},
 {id:'emergencia',nome:'Lanterna de Emergência',sub:'Caça-defeito com o multímetro',kind:'bancada',tipo:'cacacc',ic:'multimetro',cor:'#6e2a2a',cc:true,
  card:{leve:'Onde aparece a força inteira das pilhas, ali o caminho está aberto.',moderado:'Série aberta: a tensão da fonte aparece no ponto aberto.',full:'I = 0: só o elemento aberto apresenta U = E.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,dadosEmergencia(n)]))},
 /* ---------------- Ato 4 · Capacitor, ímã e bobina, CC × CA ---------------- */
 {id:'capacitor',nome:'O Capacitor',sub:'Guardar carga',kind:'aula',tipo:'aula',ic:'livro',cor:'#2b5a6e',
  card:{leve:'O capacitor enche rápido no começo e devagar no fim.',moderado:'Q = C × U; τ = R × C dá o ritmo da carga.',full:'u(t) = E × (1 − e^(−t/τ)); W = ½ × C × U².'},
  dados:{
   leve:{quadros:[
     {fig:'capCarga',t:'O capacitor é como uma caixinha que guarda carga elétrica. Ligado na pilha, ele vai enchendo.'},
     {fig:'capCurva',t:'Ele enche rápido no começo e cada vez mais devagar, até ficar com a força da pilha.'},
     {fig:'capDescarga',t:'Depois de cheio, ele pode soltar a carga: acende um LED por alguns instantes, mesmo sem a pilha.'},
     {fig:'capCurva',t:'Cheio, ele não deixa mais passar corrente da pilha: é como um caminho que se fecha sozinho.'},
     {fig:'capPerigo',t:'Atenção: aparelhos desligados podem ter capacitores ainda carregados. Por isso não se abre fonte de TV nem de micro-ondas.'}],
    checa:[
     {q:'Você ligou um capacitor vazio na pilha. Como ele enche?',o:['Rápido no começo e devagar no fim','No mesmo ritmo do começo até o fim da carga','Num instante, de uma vez'],w:'No começo o capacitor está vazio e a corrente é grande; conforme ele enche, a corrente diminui e ele enche cada vez mais devagar.'},
     {q:'O capacitor cheio foi desligado da pilha e ligado num LED. O LED…',o:['Acende e vai apagando aos poucos','Fica aceso enquanto o capacitor existir','Não acende, porque falta a pilha'],w:'O capacitor devolve a carga que guardou: o LED acende e vai apagando conforme ele esvazia. A carga acaba logo.'},
     {q:'Por que não se deve abrir a fonte de uma TV, mesmo desligada da tomada?',o:['Os capacitores podem continuar carregados','A tomada continua mandando energia pelo ar','O plástico da TV guarda eletricidade'],w:'Capacitores grandes guardam carga mesmo com o aparelho desligado e podem dar um choque forte. A tomada desligada não manda nada, e o plástico é isolante.'}]},
   moderado:{quadros:[
     {fig:'capCarga',t:'Capacitor: duas placas condutoras separadas por um isolante (dielétrico). Ligado a uma fonte, acumula cargas opostas nas placas.'},
     {fig:'capCurva',t:'Capacitância C, em farad (F): Q = C × U. Na prática se usa µF. Quanto maior C, mais carga para a mesma tensão.'},
     {fig:'capCurva',t:'Carga por um resistor: a tensão sobe de forma exponencial; τ = R × C é o tempo para chegar a 63 %. Em cerca de 5τ ele está praticamente cheio.'},
     {fig:'capDescarga',t:'Carregado, ele bloqueia a corrente contínua (I = 0) e pode devolver a energia: na descarga, a tensão também cai de forma exponencial.'},
     {fig:'capPerigo',t:'Segurança: descarregue capacitores grandes antes de mexer (resistor de descarga) e confira com o voltímetro.'}],
    checa:[
     {q:'R = 10 kΩ e C = 100 µF. A constante de tempo τ é de…',o:['1 s','10 s','1000 s'],w:'τ = R × C = 10 000 Ω × 0,0001 F = 1 s. Em cerca de 5 s o capacitor fica praticamente cheio.'},
     {q:'Um capacitor de 1000 µF carregado com 3 V guarda uma carga de…',o:['3 mC','30 mC','3 C'],w:'Q = C × U = 0,001 F × 3 V = 0,003 C = 3 mC. 3 C esquece o micro (1 µF = 10⁻⁶ F).'},
     {q:'Com o capacitor totalmente carregado num circuito de corrente contínua, a corrente no ramo dele é…',o:['Praticamente zero','Máxima, igual à da fonte em curto','Igual à metade da inicial'],w:'Carregado, a tensão nele iguala a da fonte e a corrente cai a zero: em regime, o capacitor bloqueia a corrente contínua. Máxima ela é no primeiro instante.'}]},
   full:{quadros:[
     {fig:'capCarga',t:'Capacitância: C = Q ÷ U (F). Placas paralelas: C = ε × A ÷ d (área, distância e dielétrico).'},
     {fig:'capCurva',t:'Carga RC: u(t) = E × (1 − e^(−t/τ)), τ = R × C; i(t) = (E ÷ R) × e^(−t/τ).'},
     {fig:'capDescarga',t:'Descarga: u(t) = U0 × e^(−t/τ). Após 1τ restam 37 %; após 5τ, menos de 1 %.'},
     {fig:'capCurva',t:'Energia armazenada: W = ½ × C × U². Em regime CC, o capacitor é um circuito aberto.'},
     {fig:'capPerigo',t:'Bancos de capacitores e fontes chaveadas retêm tensão perigosa: descarga controlada e verificação de ausência de tensão antes da intervenção.'}],
    checa:[
     {q:'Carga RC partindo de 0 V, E = 3 V. Após t = τ, a tensão no capacitor é de cerca de…',o:['1,9 V','2,6 V','3,0 V'],w:'u = 3 × (1 − e⁻¹) ≈ 3 × 0,632 ≈ 1,9 V. 2,6 V é depois de 2τ; 3,0 V só depois de uns 5τ.'},
     {q:'A energia num capacitor de 1000 µF carregado com 10 V é de…',o:['50 mJ','10 mJ','5 mJ'],w:'W = ½ × C × U² = 0,5 × 0,001 × 10² = 0,05 J = 50 mJ. 10 mJ é C × U (sem o ½ e sem o quadrado); 5 mJ esquece o quadrado.'},
     {q:'Num circuito CC em regime permanente, o capacitor se comporta como…',o:['Circuito aberto','Curto-circuito','Resistor de valor R × C'],w:'Em regime, du/dt = 0 e i = C × du/dt = 0: circuito aberto. Curto é o comportamento no instante inicial da carga (capacitor vazio).'}]}
  }},
 {id:'capbanc',nome:'Capacitor na Bancada',sub:'Carregar e descarregar',kind:'bancada',tipo:'capacitor',ic:'pilha',cor:'#1f5a6e',cc:true,
  card:{leve:'O capacitor guarda a carga e devolve no LED.',moderado:'Em 3τ, 95 % da carga; em 5τ, praticamente cheio.',full:'u(2τ) ≈ 0,865 E; W = ½ C U².'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{tarefas:tarefasCapacitor(n)}]))},
 {id:'imabobina',nome:'Ímã e Bobina',sub:'Eletricidade que vira ímã',kind:'aula',tipo:'aula',ic:'livro',cor:'#5a3a2e',
  card:{leve:'Fio enrolado com corrente vira ímã; sem corrente, solta.',moderado:'Força do eletroímã ∝ N × I; o ferro concentra o campo.',full:'Faraday: só fluxo variável induz tensão.'},
  dados:{
   leve:{quadros:[
     {fig:'ima',t:'O ímã tem dois lados, o norte e o sul. Lados diferentes se puxam; lados iguais se empurram.'},
     {fig:'oersted',t:'A corrente num fio também cria um ímã invisível em volta dele: a agulha da bússola se mexe quando a corrente passa.'},
     {fig:'bobina',t:'Enrolando o fio em muitas voltas, o efeito soma. Com um prego de ferro no meio, vira um eletroímã forte.'},
     {fig:'contatoraIma',t:'Desligou a corrente, o eletroímã solta. É assim que a contatora e o relé ligam e desligam máquinas.'},
     {fig:'inducao',t:'E o contrário também acontece: mexendo um ímã dentro da bobina, aparece eletricidade nela. É o princípio do gerador.'}],
    checa:[
     {q:'Você aproxima o norte de um ímã do norte de outro. O que acontece?',o:['Eles se empurram','Eles se puxam e grudam','Nada, porque são iguais'],w:'Polos iguais se empurram; diferentes se puxam. Por isso dois nortes se afastam.'},
     {q:'Como deixar um eletroímã mais forte?',o:['Mais voltas de fio e um núcleo de ferro','Fio de plástico e menos voltas','Trocar o prego de ferro do meio por um pau de madeira'],w:'Mais voltas somam o efeito, e o ferro concentra o campo. Plástico e madeira não ajudam: o plástico nem conduz.'},
     {q:'Por que a contatora solta quando falta energia na bobina?',o:['Sem corrente, o eletroímã deixa de puxar','A mola de dentro fica sem força elétrica','O ímã dela é desligado por um botão'],w:'A bobina é um eletroímã: só puxa enquanto passa corrente. Sem corrente, a mola devolve os contatos. A mola é mecânica, não elétrica.'}]},
   moderado:{quadros:[
     {fig:'ima',t:'Ímã permanente: polos norte e sul e um campo magnético que sai do norte e entra no sul. Polos iguais se repelem; opostos se atraem.'},
     {fig:'oersted',t:'Experimento de Oersted: um condutor com corrente cria campo magnético em volta dele, e a bússola deflete.'},
     {fig:'bobina',t:'Bobina (solenoide): o campo de cada espira se soma. A força cresce com o número de espiras e com a corrente (ampère-espira); o núcleo de ferro concentra o campo.'},
     {fig:'contatoraIma',t:'Na contatora, a bobina (A1-A2) energizada atrai a armadura e fecha os contatos; desenergizada, a mola abre.'},
     {fig:'inducao',t:'Indução: um campo magnético variando dentro de uma bobina induz tensão nela. Campo parado não induz nada.'}],
    checa:[
     {q:'Uma bobina de 200 espiras com 0,5 A produz quantos ampère-espira?',o:['100 A·esp','400 A·esp','200,5 A·esp'],w:'Força magnetomotriz = N × I = 200 × 0,5 = 100 A·esp. Dividir dá 400; somar não tem sentido físico.'},
     {q:'Um ímã está parado dentro de uma bobina ligada a um voltímetro. O voltímetro mostra…',o:['Zero, com o campo parado','A tensão máxima, enquanto o ímã ficar lá','Uma tensão que cresce com o tempo'],w:'Só há tensão induzida quando o campo varia (ímã em movimento ou corrente variando). Por isso o transformador funciona com corrente alternada.'},
     {q:'O que acontece com os contatos de uma contatora quando a bobina perde a tensão?',o:['Voltam à posição de repouso pela mola','Ficam presos na posição onde estavam, pelo magnetismo','Fecham com mais força'],w:'Sem corrente, o campo da bobina desaparece e a mola devolve os contatos ao repouso (NA abre, NF fecha). O núcleo não fica magnetizado o bastante para segurar.'}]},
   full:{quadros:[
     {fig:'ima',t:'Campo magnético B (tesla). As linhas são fechadas: saem do polo norte e entram no sul; não existem monopolos.'},
     {fig:'oersted',t:'Lei de Ampère: corrente gera campo; no condutor retilíneo, B ∝ I ÷ r, em círculos concêntricos (regra da mão direita).'},
     {fig:'bobina',t:'Solenoide: B ≈ μ × N × I ÷ ℓ. Um núcleo ferromagnético multiplica μ (até saturar).'},
     {fig:'inducao',t:'Lei de Faraday: e = −N × ΔΦ ÷ Δt. Só fluxo variável induz tensão (Lenz: o sinal se opõe à variação).'},
     {fig:'contatoraIma',t:'Contatora: a força de atração da bobina vence a mola de retorno; ao desenergizar, a mola abre os contatos principais e auxiliares.'}],
    checa:[
     {q:'Num solenoide sem saturação, dobrando N e mantendo I, o campo B…',o:['Dobra','Quadruplica','Fica igual'],w:'B ≈ μ × N × I ÷ ℓ: proporcional a N. Quadruplicar seria dobrar N e I juntos.'},
     {q:'Uma bobina de 100 espiras tem o fluxo variando 0,02 Wb em 0,1 s. A fem induzida média é de…',o:['20 V','2 V','0,2 V'],w:'e = N × ΔΦ ÷ Δt = 100 × 0,02 ÷ 0,1 = 20 V. 2 V esquece de dividir pelo tempo; 0,2 V esquece o número de espiras.'},
     {q:'Por que um transformador não funciona ligado a uma bateria (CC)?',o:['O fluxo constante não induz tensão no secundário','A bateria tem tensão baixa demais para o enrolamento primário','O núcleo de ferro bloqueia a corrente contínua'],w:'Pela lei de Faraday, só fluxo variável induz tensão. Com CC, o fluxo fica constante e o secundário fica em 0 V (e o primário pode aquecer muito).'}]}
  }},
 {id:'eletroima',nome:'Eletroímã na Bancada',sub:'Pegar e soltar clipes',kind:'bancada',tipo:'eletroima',ic:'disjuntor',cor:'#6e4a1f',cc:true,
  card:{leve:'Mais voltas, mais pilhas e ferro: mais força. Sem corrente, solta.',moderado:'N × I em ampère-espira; o núcleo de ferro multiplica a força.',full:'B ∝ μ × N × I: a força do eletroímã segue o campo.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{tarefas:tarefasEletroima(n)}]))},
 {id:'ccca',nome:'CC × CA',sub:'Contínua e alternada',kind:'aula',tipo:'aula',ic:'livro',cor:'#2a3a6e',
  card:{leve:'Pilha: corrente contínua. Tomada: corrente alternada.',moderado:'A rede tem {Hz} Hz: {2Hz} inversões de sentido por segundo.',full:'u(t) = Up × sen(2π f t); Uef = Up ÷ √2.'},
  dados:{
   leve:{quadros:[
     {fig:'ccGrafico',t:'Até aqui, toda a energia veio de pilhas: corrente contínua (CC). Ela anda sempre no mesmo sentido.'},
     {fig:'caGrafico',t:'A energia da tomada é diferente: corrente alternada (CA). Ela vai e volta, trocando de sentido {2Hz} vezes por segundo.'},
     {fig:'transmissao',t:'A CA é usada nas casas porque é fácil subir e baixar a tensão com transformadores, para trazer a energia de longe.'},
     {fig:'ccEmCasa',t:'Muitos aparelhos usam CC por dentro: o carregador do celular transforma a CA da tomada em CC.'},
     {fig:'caGrafico',t:'A tomada é muito mais forte que a pilha: {V} volts. No próximo capítulo você vai trabalhar com ela, sempre com segurança.'}],
    checa:[
     {q:'Qual destas dá corrente alternada?',o:['A tomada da casa','A pilha da lanterna','A bateria do celular'],w:'A tomada recebe a CA da rede, que troca de sentido. Pilha e bateria dão CC.'},
     {q:'O carregador do celular é ligado na tomada. O que ele faz?',o:['Transforma a CA da tomada em CC para a bateria','Guarda a energia da tomada até o celular pedir','Passa a CA direto para a bateria do celular'],w:'A bateria só carrega com CC. O carregador baixa a tensão e transforma a CA em CC. Ele não guarda energia.'},
     {q:'Por que as casas recebem corrente alternada, e não contínua?',o:['Com CA é fácil subir e baixar a tensão','A CA não dá choque nas pessoas','A corrente contínua não consegue acender as lâmpadas de casa'],w:'Transformadores só funcionam com CA, e com eles a energia viaja em alta tensão e chega baixa nas casas. CA dá choque sim, e CC também acende lâmpadas (a lanterna é prova).'}]},
   moderado:{quadros:[
     {fig:'ccGrafico',t:'Corrente contínua: polaridade fixa, sentido constante. Pilhas, baterias e painéis solares geram CC.'},
     {fig:'caGrafico',t:'Corrente alternada: a tensão varia em forma de onda senoidal e inverte a polaridade. A rede tem {Hz} Hz: {Hz} ciclos e {2Hz} inversões por segundo.'},
     {fig:'transmissao',t:'A CA permite usar transformadores: a usina eleva a tensão para transmitir com pouca perda, e a distribuição abaixa para {V} V.'},
     {fig:'ccEmCasa',t:'Fontes de aparelhos convertem CA em CC (retificação). Inversores fazem o contrário: a CC do painel solar vira CA para a casa.'},
     {fig:'caGrafico',t:'Os {V} V da tomada são o valor eficaz: equivalem, em aquecimento, a {V} V contínuos. É com esse valor que se calcula na prática.'}],
    checa:[
     {q:'A rede tem {Hz} Hz. Quantas vezes por segundo a corrente inverte o sentido?',o:['{2Hz} vezes','{Hz} vezes','A metade de {Hz} vezes'],w:'Cada ciclo tem duas inversões (vai e volta). Com {Hz} ciclos por segundo, são {2Hz} inversões.'},
     {q:'Um painel solar alimenta as tomadas de uma casa. Qual equipamento é indispensável?',o:['Inversor, que transforma CC em CA','Retificador, que transforma CA em CC','Transformador ligado direto no painel'],w:'O painel gera CC e as tomadas usam CA: o inversor faz a conversão. O retificador faz o contrário, e o transformador não funciona com CC.'},
     {q:'Por que a transmissão de energia é feita em alta tensão?',o:['Menos corrente para a mesma potência, menos perda nos cabos','A energia em alta tensão viaja mais rápido pelos cabos até as cidades','Os cabos de alta tensão não têm resistência'],w:'P = U × I: com tensão alta, a corrente é baixa, e a perda nos cabos (R × I²) cai muito. A velocidade da energia não muda e todo cabo tem resistência.'}]},
   full:{quadros:[
     {fig:'ccGrafico',t:'CC: u(t) = U constante. CA: u(t) = Up × sen(2π × f × t), com f = {Hz} Hz e período T = 1 ÷ f.'},
     {fig:'caGrafico',t:'Valor eficaz (RMS): Uef = Up ÷ √2. Na rede de {V} V eficazes, o pico passa de {V} × 1,41.'},
     {fig:'transmissao',t:'Perdas na transmissão: P = R × I². Para a mesma potência, elevar U reduz I; por isso se transmite em kV e se distribui em {V} V.'},
     {fig:'ccEmCasa',t:'Conversão: retificador (CA → CC) com filtro capacitivo; inversor (CC → CA) com chaveamento eletrônico (PWM).'},
     {fig:'caGrafico',t:'Em CA, além da resistência, bobinas e capacitores criam reatância: assunto dos próximos capítulos.'}],
    checa:[
     comRede(r=>{const T=1000/r.Hz,f=x=>x.toFixed(1).replace('.',',');return {q:'Na rede de '+r.Hz+' Hz, o período da onda é de…',o:[f(T)+' ms',f(2*T)+' ms',r.Hz+' ms'],w:'T = 1 ÷ f = 1 ÷ '+r.Hz+' s ≈ '+f(T)+' ms. '+f(2*T)+' ms seria o período de uma rede de '+(r.Hz/2)+' Hz; '+r.Hz+' ms confunde frequência com tempo.'}}),
     comRede(r=>{const up=Math.round(r.V*Math.SQRT2),meio=Math.round(r.V/Math.SQRT2);return {q:'O pico de tensão da tomada de '+r.V+' V (eficaz) é de cerca de…',o:[up+' V',meio+' V',r.V+' V'],w:'Up = Uef × √2 ≈ '+r.V+' × 1,414 ≈ '+up+' V. '+r.V+' V é o valor eficaz; dividir por √2 inverte a relação.'}}),
     {q:'Uma linha transmite a mesma potência em 13,8 kV e depois em 138 kV. A perda R × I² nos cabos…',o:['Cai para 1/100','Cai para 1/10','Continua a mesma'],w:'Com 10 vezes a tensão, a corrente cai 10 vezes e a perda R × I² cai 100 vezes.'}]}
  }},
 {id:'ccouca',nome:'CC ou CA?',sub:'Classifique a fonte',kind:'classificar',tipo:'sort',ic:'raio',cor:'#3a2a5e',
  bins:[{r:1,t:'⎓ Contínua (CC)'},{r:0,t:'∿ Alternada (CA)'}],certo:['É alternada (CA).','É contínua (CC).'],dica:'Quase! Pense: o sentido da corrente fica o mesmo ou troca o tempo todo?',
  pergunta:{leve:'Essa fonte dá corrente contínua ou alternada?',outro:'Classifique a forma de onda da fonte.'},fig:'formaOnda',
  card:{leve:'Pilha e bateria: CC. Tomada: CA.',moderado:'Inversor: CC → CA. Retificador: CA → CC.',full:'Link CC do inversor: contínua; gerador síncrono: senoidal.'},
  dados:{
   leve:[{t:'Pilha da lanterna',i:'🔋',r:1,w:'A pilha tem + e − fixos.'},{t:'Tomada da casa',i:'🔌',r:0,w:'Vem da rede, que troca de sentido.'},{t:'Bateria do carro',i:'🚗',r:1,w:'Bateria guarda e entrega CC.'},
     {t:'Bateria do celular',i:'📱',r:1,w:'Ela carrega e descarrega em CC.'},{t:'Fio do poste da rua',i:'⚡',r:0,w:'A rede de distribuição é CA.'},{t:'Placa solar',i:'☀️',r:1,w:'A placa gera CC; um aparelho (inversor) transforma em CA.'}],
   moderado:[{t:'Saída do carregador de celular (5 V)',i:'🔌',r:1,w:'O carregador retifica a CA e entrega CC.'},{t:'Chuveiro na tomada',i:'🚿',r:0,w:'Ligado direto na rede: CA.'},{t:'Painel fotovoltaico',i:'☀️',r:1,w:'Célula fotovoltaica gera CC.'},
     {t:'Saída do inversor solar',i:'🔁',r:0,w:'O inversor transforma a CC do painel em CA.'},{t:'Bateria do nobreak',i:'🔋',r:1,w:'Banco de baterias: CC.'},{t:'Secundário de um transformador',i:'🧲',r:0,w:'Transformador só trabalha com CA, nos dois lados.'}],
   full:[{t:'Barramento interno do inversor',i:'⚙️',r:1,w:'Link CC entre o painel (ou retificador) e a ponte inversora.'},{t:'Rede de distribuição de 13,8 kV',i:'🗼',r:0,w:'Média tensão em CA.'},{t:'Banco de baterias de telecom (48 V)',i:'🔋',r:1,w:'Alimentação CC de centrais.'},
     {t:'Gerador da hidrelétrica',i:'💧',r:0,w:'Gerador síncrono: tensão senoidal.'},{t:'Saída de um retificador com filtro',i:'〰️',r:1,w:'Retificado e filtrado: CC com pequena ondulação.'},{t:'Alimentação de um motor de indução',i:'⚙️',r:0,w:'O motor de indução depende do campo girante da CA.'}]}}
];
/* Cenas antes das práticas (as aulas já são conduzidas pelo Mestre Chico) */
const CAP1_CENAS={
  capbanc:[['chico','Pega esse capacitor, {nome}. Ele guarda carga, igual uma pilha pequenininha que enche e esvazia rápido.'],['chico','Carrega, depois descarrega no LED. E presta atenção no ritmo.']],
  eletroima:[['chico','Fio, prego e pilha: dá para fazer um ímã que liga e desliga.'],['chico','É o coração da contatora que você vai ver na fábrica. Bora pegar uns clipes.']],
  ccouca:[['chico','Último teste da oficina: de onde vem cada tipo de corrente.']],
  parcc:[['chico','Duas lâmpadas na bancada, {nome}. Quero as duas fortes.'],['chico','E se uma queimar, a outra continua acesa. Como você liga?']],
  prevcc:[['chico','Antes de mexer, a gente prevê. Eletricista bom sabe o que vai acontecer.']],
  kirchcc:[['chico','Duas lâmpadas em série. Mede cada uma e mede as pilhas.'],['chico','A conta tem que fechar. Se não fechar, tem coisa errada.']],
  emergencia:[['chico','A lanterna de emergência da escada não acende. É a sua primeira caça ao defeito.'],['chico','Não troca nada no chute: mede primeiro. O defeito sempre deixa pista no multímetro.']],
  medir:[['chico','A lanterna está montada. Agora quero ver você medir de verdade.'],['chico','Multímetro na posição V⎓. Lembra: ponta vermelha no +, preta no −.']],
  ohmcc:[['chico','Medir é metade do serviço, {nome}. A outra metade é fazer a conta.'],['chico','Mede, calcula e me diz quanto a lâmpada puxa e quanto a pilha perde.']],
  renovavel:[['chico','Você viu que a eletricidade das casas vem de usinas, e cada usina usa uma fonte.'],['chico','Umas a natureza repõe, outras acabam um dia. {nome}, separa pra mim.']],
  macaneta:[['eu','Ai! Mestre, levei um choquinho na maçaneta da oficina!'],['chico','É a carga que você mesmo juntou andando no piso. Eletricidade estática.'],['chico','Vamos ver se você sabe explicar as situações do dia a dia.']],
  continuidade:[['chico','Toma o testador: uma pilha, um LED e duas pontas.'],['chico','Encosta as pontas no material. Se o LED acender, ele conduz. Antes de testar, me diz o que você acha.']]
};
