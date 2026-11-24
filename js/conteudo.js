/* ================= CONTEÚDO ================= */
/* Fonte da bancada: L1 e N (1 fase + neutro, na tensão da rede escolhida em Configurações). Não tem PE: o terra vem da haste, pelo BEP. */
const BAT=()=>C('B','src',45,125,0,{fases:1});
/* Aterramento das missões com massa metálica: haste cravada no solo e BEP (barramento de equipotencialização principal). */
/* BEP e haste um pouco abaixo da fonte: deixa um corredor livre para os fios que saem dos bornes dela */
const ATERRA=()=>[C('BEP','bep',100,200,0),C('H','haste',40,215,0)];
/* Liga o PE nas luminárias que têm borne de terra (pe:true, ex.: luminária metálica). O bocal simples não tem PE. */
function withPE(st){const ls=st.comps.filter(c=>c.type==='lamp'&&c.pe===true);if(!ls.length)return autoColor(st);
  if(!st.comps.some(c=>c.type==='bep')){st.comps.push(...ATERRA());st.wires.push({a:'H.0',b:'BEP.0',cor:'terra'})}
  let prev='BEP.1';ls.forEach(l=>{st.wires.push({a:prev,b:l.id+'.2',e:'h',cor:'terra'});prev=l.id+'.2'});return autoColor(st)}
/* Que condutor é cada rede: fase (qualquer fase da fonte), neutro, terra (haste/BEP) ou retorno. */
const tipoRede=(r,n)=>r.ehFase(n)?'fase':n===r.N?'neutro':r.protecao.has(n)?'terra':'retorno';
function autoColor(st){const r=solve(st.comps.map(c=>c.type==='sw'?Object.assign({},c,{closed:false}):c),st.wires);
  st.wires.forEach(w=>{if(w.cor)return;w.cor=tipoRede(r,r.net(w.a))});return st}
function scSerie(){return withPE({comps:[BAT(),C('L1','lamp',170,45,0),C('L2','lamp',290,125,1)],wires:[W('B.0','L1.0','v'),W('L1.1','L2.0','h'),W('L2.1','B.1')]})}
function scParalelo(){return withPE({comps:[BAT(),C('L1','lamp',170,125,1),C('L2','lamp',280,125,1)],wires:[W('B.0','L1.0'),W('L1.0','L2.0'),W('B.1','L1.1'),W('L1.1','L2.1')]})}
function scAtalho(){const s=scSerie();s.comps.push(C('S1','sw',225,125,1,{closed:false}));s.wires.push(W('L2.0','S1.0'),W('L2.1','S1.1'));s.wires.forEach(w=>{if(w.cor!=='terra')delete w.cor});return autoColor(s)}
function scCurto(){return withPE({comps:[BAT(),C('S1','sw',115,125,1,{closed:false}),C('L1','lamp',200,125,1),C('L2','lamp',290,125,1)],wires:[W('B.0','S1.0'),W('S1.0','L1.0'),W('L1.0','L2.0'),W('B.1','S1.1'),W('S1.1','L1.1'),W('L1.1','L2.1')]})}
function scMisto(){return withPE({comps:[BAT(),C('L1','lamp',130,45,0),C('L2','lamp',220,125,1),C('L3','lamp',300,125,1)],wires:[W('B.0','L1.0','v'),W('L1.1','L2.0','h'),W('L2.0','L3.0'),W('L2.1','L3.1'),W('L2.1','B.1')]})}
/* Curto real (protegeCurto, js/motor.js): o que aconteceu e como religar, no registro de cada nível. */
function msgCurto(ev){
  const nm=ev.nome||ev.quem,dj=/^DJ|^DG/.test(nm)?nm:'disjuntor '+nm;
  const quem=ev.fonte?'a proteção da fonte':'o '+dj,tocar=ev.fonte?'na fonte':'no '+dj;
  if(L())return '⚡ Curto-circuito! A fase encontrou o neutro sem passar pela lâmpada. A corrente subiu de uma vez e '+quem+' desligou para o fio não pegar fogo. Desfaça a ligação errada e toque '+tocar+' para religar.';
  if(S.mode==='moderado')return '⚡ Curto-circuito: a fase chegou ao neutro (ou ao terra, ou a outra fase) sem passar por nenhuma carga. A corrente dispara e '+quem+' desarmou na hora. Corrija a ligação e toque '+tocar+' para rearmar.';
  return '⚡ Curto-circuito: caminho de impedância desprezível entre fase e neutro, terra ou outra fase. A corrente de curto supera muito a nominal e o disparo magnético d'+(ev.fonte?'a proteção da fonte (no quadro real, o disjuntor geral)':'o '+dj)+' abriu o circuito praticamente na hora. Corrija a ligação e rearme '+(ev.fonte?'a fonte':'o '+dj)+'.';
}
const desarmadoMsg=c=>{const nm=c.lab||c.id,dj=/^DJ|^DG/.test(nm)?nm:'disjuntor '+nm;
  return c.type==='src'?(L()?'A fonte está desligada pela proteção. Corrija o curto e toque na fonte para religar.':'A proteção da fonte está desarmada. Elimine o curto e toque na fonte para religar antes de verificar.')
  :(L()?'O '+dj+' está desligado. Toque nele para ligar antes de verificar. Se ele caiu por curto, corrija a ligação primeiro.':'O '+dj+' está desligado. Ligue-o com um toque antes de verificar; se desarmou por curto, elimine o curto primeiro.')};
const breakL=id=>st=>{const c=st.comps.find(x=>x.id===id);c.broken=true;c.show=true};
const closeS=id=>st=>{st.comps.find(x=>x.id===id).closed=true};

function tableCheck(st,rows,strong){
  for(const row of rows){
    const r=sim(st,row.sw);const d=Object.entries(row.sw||{}).map(([k,v])=>k+(v?' ligado':' desligado')).join(' e ');
    const pre=d?'Com '+d+', ':'';
    if(r.short)return L()?'Deu curto'+(d?' com '+d:'')+'! A energia achou um atalho sem passar pelas lâmpadas.':'Curto-circuito'+(d?' com '+d:'')+': existe caminho sem carga entre fase e neutro (ou fase e terra).';
    for(const [id,want] of Object.entries(row.want)){
      const b=r.lamp[id];
      if(want&&b<=0.04)return pre+id+' deveria acender.'+(L()?' A energia sai pela fase, passa pela lâmpada e volta pelo neutro.':' Verifique se o laço está fechado.');
      if(!want&&b>0.04)return pre+id+' deveria ficar apagada.'+(L()?' O botão precisa estar no caminho dela.':' O comando não está em série com essa carga.');
      if(want&&strong&&b<0.9)return L()?'As lâmpadas acenderam fraquinhas: estão em fila, dividindo a energia. Ligue cada uma direto na fase e no neutro.':id+' acende só '+Math.round(b*100)+'%: está em série. Para brilho total cada carga precisa da tensão plena (paralelo).';
    }
  }
  return null;
}

/* Cores de condutor (NBR 5410): neutro azul-claro; proteção (PE) verde-amarelo ou verde; fase e retorno em qualquer outra cor (no jogo: fase vermelha, retorno branco). */
/* Na bancada de corrente contínua (pilhas), a convenção é vermelho no positivo e preto no negativo. */
const CORES={fase:{n:'Fase',c:'var(--fase)'},neutro:{n:'Neutro',c:'var(--neutro)'},retorno:{n:'Retorno',c:'#d9dde3'},terra:{n:'Terra',c:'linear-gradient(90deg,var(--terra) 50%,#f2d22e 50%)'},
  pos:{n:'Positivo (+)',c:'#d33a2c'},neg:{n:'Negativo (−)',c:'#1c1f24'}};
const coresDoNivel=()=>['fase','neutro','retorno','terra'];
function palette(cur,lista){return '<div class="pal" role="group" aria-label="Cor do fio">'+(lista||coresDoNivel()).map(k=>'<button class="btn" data-cor="'+k+'" aria-pressed="'+(cur===k)+'"><span class="sw8" style="background:'+CORES[k].c+'"></span>'+CORES[k].n+'</button>').join('')+'</div>'}
function colorCheck(st){
  const r=solve(st.comps.map(c=>c.type==='sw'?Object.assign({},c,{closed:false}):c),st.wires);
  for(const w of st.wires){
    const kind=tipoRede(r,r.net(w.a));
    if(kind==='terra'&&w.cor!=='terra')return L()?'O fio do terra é verde-amarelo. Troque a cor.':'Condutor de proteção (PE) deve ser verde-amarelo (NBR 5410).';
    if(kind==='neutro'&&w.cor!=='neutro')return L()?'O fio do neutro é azul-claro. Troque a cor.':'Neutro deve ser azul-claro (NBR 5410).';
    if((kind==='fase'||kind==='retorno')&&w.cor==='neutro')return 'Azul-claro é só do neutro. '+(kind==='fase'?'Esse fio é fase.':'Esse fio é retorno (entre interruptor e lâmpada).');
    if((kind==='fase'||kind==='retorno')&&w.cor==='terra')return 'Verde-amarelo é só do terra (PE). Esse fio leva corrente: é '+kind+'.';
  }
  return null;
}
function normCheck(st){
  /* cargas: lâmpadas, motores e bobinas de contatora */
  const lamps=st.comps.filter(c=>c.type==='lamp'||c.type==='motor'),r=solve(st.comps,st.wires);
  const pe=n=>r.protecao.has(n);
  if(pe(r.N)&&lamps.length)return L()?'Terra e neutro não podem ser unidos no circuito. O neutro já chega aterrado pela fonte.':'Terra e neutro não podem ser unidos no circuito: o neutro é aterrado na origem (fonte) e o PE parte do BEP.';
  for(const l of st.comps.filter(c=>c.type==='lamp'||c.type==='motor'||c.type==='kc'||c.type==='ri')){const n=r.net(l.id+'.0'),m=r.net(l.id+'.1');
    if(pe(n)||pe(m))return L()?'O terra não pode levar a corrente de '+l.id+'. Ele só protege.':'O PE está fazendo papel de condutor vivo em '+l.id+'. Pela NBR 5410 o condutor de proteção nunca conduz corrente de serviço.'}
  /* da haste sai só o condutor de aterramento, que vai até o BEP; os PE dos equipamentos saem do BEP */
  for(const h of st.comps.filter(c=>c.type==='haste'))for(const w of st.wires){const t=w.a===h.id+'.0'?w.b:w.b===h.id+'.0'?w.a:null;
    if(t&&(st.comps.find(c=>c.id===t.split('.')[0])||{}).type!=='bep')return L()?'Da haste sai um fio só, e ele vai até o BEP. O terra do equipamento sai do BEP.':'O condutor de aterramento liga a haste ao BEP; os PE dos equipamentos partem do BEP (barramento de equipotencialização principal), não da haste.'}
  const semHaste=n=>pe(n)&&!r.terra.has(n);
  const terraOk=(l,oque)=>{const n=r.net(l.id+'.2');
    if(semHaste(n))return L()?'O terra de '+l.id+' chega no BEP, mas o BEP não está ligado na haste. Ligue o BEP na haste com fio verde-amarelo.':'O PE de '+l.id+' está no BEP, mas o BEP não está ligado ao eletrodo (haste). Sem o condutor de aterramento, a massa não fica aterrada.';
    if(!r.terra.has(n))return oque;return null};
  for(const l of lamps)if(l.type==='motor'){const m=terraOk(l,L()?'O motor '+l.id+' tem carcaça de metal: ligue o terra (verde-amarelo) no borne ⏚. O terra vem da haste, passando pelo BEP.':'Motor '+l.id+' sem condutor de proteção na carcaça. NBR 5410: massas metálicas devem ser ligadas ao PE, que parte do BEP ligado à haste.');if(m)return m}
  for(const l of lamps)if(l.pe===true){const m=terraOk(l,L()?'Falta ligar o terra (verde-amarelo) na luminária '+l.id+'.':'Luminária '+l.id+' sem condutor de proteção. NBR 5410 (5.1.2.2.3.6): todo circuito deve ter PE em toda a sua extensão.');if(m)return m}
  const sws=st.comps.filter(c=>c.type==='sw');
  if(sws.length){const off=sim(st,Object.fromEntries(sws.map(c=>[c.id,0])));
    for(const l of lamps){const v=Math.max(off.vAt(l.id+'.0'),off.vAt(l.id+'.1'));
      if(off.lamp[l.id]<=0.04&&v>1)return L()?'Quase! O interruptor está cortando o fio errado. Ele precisa cortar a fase (fio vermelho). Assim a lâmpada fica sem energia quando desligada.':'O interruptor está no neutro: com ele aberto, '+l.id+' ainda fica com '+Math.round(v)+' V. NBR 5410: o comando deve seccionar a fase.'}}
  /* cada carga tem que ter pelo menos um disjuntor que, aberto, a deixa sem tensão (vale para quadro com vários circuitos) */
  const dj=st.comps.filter(c=>c.type==='fuse');
  if(dj.length)for(const l of lamps){
    const vs=dj.map(d=>{const t=sim(st,Object.fromEntries(sws.map(c=>[c.id,1])),{[d.id]:{broken:true}});return Math.max(t.vAt(l.id+'.0'),t.vAt(l.id+'.1'))});
    if(vs.every(v=>v>1))return L()?'O disjuntor precisa ficar no começo da fase, antes de tudo.':'Com o disjuntor aberto, '+l.id+' ainda recebe '+Math.round(Math.min(...vs))+' V. O disjuntor deve estar em série na fase, protegendo o circuito.'}
  return null;
}

/* ================= CHECAGENS DOS CAPÍTULOS 2 E 3 =================
   Todas trabalham numa cópia do circuito (o estado que o aluno deixou na bancada não interfere). */
function copia(st,mods){return {comps:st.comps.map(c=>Object.assign({},c,mods&&mods[c.id]||{})),wires:st.wires}}
const acesa=(r,id)=>(r.lamp[id]||0)>0.04;
const CURTO=()=>L()?'Deu curto! Tem um caminho da fase direto para o neutro ou para o terra.':'Curto-circuito: existe caminho sem carga entre fase e neutro (ou fase e terra).';
const semTensao=(r,id)=>Math.max(r.vAt(id+'.0'),r.vAt(id+'.1'))<=1;

/* Quadro: DR com fase e neutro passando por ele; cada disjuntor do circuito protege só o seu circuito. */
function quadroCheck(st,lamps,pares){
  const b=copia(st,{DR:{trip:false,porFuga:false}}),r=solve(b.comps,b.wires);
  if(r.short)return CURTO();
  if(b.comps.find(c=>c.id==='DR').trip)return L()?'O DR desarmou! O fio azul da lâmpada tem que voltar pelo borne N de baixo do DR.':'O DR desarmou: o neutro dos circuitos tem que voltar pelo borne N de saída do DR. Neutro voltando por fora (ou ligado ao PE) cria diferença e o DR atua.';
  if(r.net('DR.1')===r.P)return 'No DR a fase entra no borne 1 e o neutro no borne N. Estão trocados.';
  for(const l of lamps)if(!acesa(r,l))return l+(L()?' tem que acender.':' deveria acender com tudo ligado.');
  const t=copia(st,{DR:{trip:true}}),rt=solve(t.comps,t.wires);
  for(const l of lamps)if(acesa(rt,l))return 'Com o DR desligado, '+l+' continua acesa: o circuito tem que passar pelo DR.';
  for(const [d,l] of pares){const s=copia(st,{DR:{trip:false},[d]:{broken:true}}),rr=solve(s.comps,s.wires);
    if(acesa(rr,l))return 'Desliguei o '+d+' e '+l+' continuou acesa. Cada disjuntor protege o seu circuito.';
    for(const o of lamps)if(o!==l&&!acesa(rr,o))return 'Desliguei o '+d+' e '+o+' também apagou. Cada circuito tem o seu disjuntor.'}
  return null;
}
/* Comando de vários pontos (three-way, four-way): mudar QUALQUER interruptor sempre inverte a lâmpada,
   e com a lâmpada apagada ela fica sem tensão (o comando corta a fase). */
function comandoCheck(st,ids,lamp){
  lamp=lamp||'L1';const n=ids.length,est=[];
  for(let m=0;m<(1<<n);m++){const mods={};ids.forEach((id,i)=>mods[id]={pos:(m>>i)&1});const s=copia(st,mods),r=solve(s.comps,s.wires);
    if(r.short)return CURTO();
    const on=acesa(r,lamp);est[m]=on;
    if(!on&&!semTensao(r,lamp))return L()?'Com a luz apagada ainda tem energia nela. A fase tem que entrar no comum (C) do primeiro interruptor.':'Com '+lamp+' apagada ainda há tensão nela: o comando deve seccionar a fase (fase no comum C do primeiro paralelo, neutro direto na lâmpada).'}
  if(est.every(x=>!x))return lamp+(L()?' não acende em nenhuma posição.':' não acende em nenhuma combinação dos interruptores.');
  for(let m=0;m<(1<<n);m++)for(let i=0;i<n;i++)if(est[m]===est[m^(1<<i)]){
    return L()?'Mudei só o '+ids[i]+' e a luz não mudou. Confira os fios de retorno entre os interruptores.':'Mudei só o '+ids[i]+' e '+lamp+' não inverteu. Os retornos entre os interruptores devem ligar 1 com 1 e 2 com 2'+(n>2?' (o intermediário entra no meio dos dois retornos).':'.')}
  return null;
}
/* Fotocélula: fase no L, neutro no N, carga no C; de noite acende, de dia apaga. */
function fotoCheck(st){
  const d=copia(st,{FC:{noite:false}}),rd=solve(d.comps,d.wires),n=copia(st,{FC:{noite:true}}),rn=solve(n.comps,n.wires);
  if(rd.short||rn.short)return CURTO();
  if(rn.net('FC.0')!==rn.P)return 'A fase (fio vermelho) entra no borne L da fotocélula.';
  if(rn.net('FC.1')!==rn.N)return L()?'A fotocélula precisa do neutro (fio azul) no borne N para funcionar.':'Sem neutro no borne N a fotocélula não tem alimentação para o sensor.';
  if(!acesa(rn,'L1'))return L()?'De noite a luz tem que acender. Ligue o borne C na lâmpada.':'À noite L1 deveria acender: o borne C (carga) alimenta a lâmpada.';
  if(acesa(rd,'L1'))return 'De dia a luz tem que ficar apagada: a lâmpada só recebe fase pelo borne C.';
  return null;
}
/* Relé de impulso: cada pulso (apertar e soltar um pulsador) inverte a luz. */
function impulsoCheck(st,puls){
  const mods={RI:{on:false,pulso:false}};puls.forEach(p=>mods[p]={pressed:false});
  const s=copia(st,mods),g=id=>s.comps.find(c=>c.id===id),ver=()=>solve(s.comps,s.wires);
  let r=ver();if(r.short)return CURTO();
  if(acesa(r,'L1'))return 'A luz não pode acender sozinha: ela acende pelo contato 1-2 do relé.';
  let esp=false;
  for(const p of puls.concat(puls)){g(p).pressed=true;r=ver();if(r.short)return CURTO();g(p).pressed=false;r=ver();esp=!esp;
    if(acesa(r,'L1')!==esp)return esp?(L()?'Apertei o '+p+' e a luz não acendeu. O pulsador leva a fase até a bobina (A1), e A2 vai no neutro.':'Pulso no '+p+' e L1 não acendeu. O pulsador leva a fase à bobina (A1-A2) e o contato 1-2 alimenta a lâmpada.'):'Outro pulso no '+p+' e a luz não apagou. Os pulsadores ficam em paralelo, todos na bobina do relé.';
    if(!esp&&!semTensao(r,'L1'))return 'Com a luz apagada ela ainda tem tensão: o contato 1-2 do relé tem que cortar a fase.'}
  return null;
}
/* Partida direta: liga pelo LIGA, segura pelo selo, para no DESLIGA e na sobrecarga (relé térmico). */
function partidaCheck(st,temFT){
  const s=copia(st,{K:{on:false},BL:{pressed:false},BD:{pressed:false},FT:{trip:false}}),g=id=>s.comps.find(c=>c.id===id);
  const on=()=>{const r=solve(s.comps,s.wires);if(r.short)throw 0;return acesa(r,'M')};
  try{
    if(on())return L()?'O motor ligou sozinho! Ele só pode ligar quando apertar o botão verde.':'O motor não pode ligar sozinho: ele só liga pelo LIGA, através do contato 1-2 da contatora.';
    g('BL').pressed=true;if(!on())return L()?'Apertei o botão verde e o motor não girou. O verde leva a fase até a bobina (A1); A2 vai no neutro; o 1-2 da contatora liga o motor.':'LIGA apertado e o motor não girou: a botoeira liga energiza a bobina (A1-A2) e o contato 1-2 alimenta o motor.';
    g('BL').pressed=false;if(!on())return L()?'Soltei o botão verde e o motor parou: falta o selo. Ligue o 13-14 da contatora junto com o botão verde.':'Soltei o LIGA e o motor parou: falta o selo. O contato 13-14 vai em paralelo com a botoeira liga.';
    g('BD').pressed=true;if(on())return L()?'Apertei o vermelho e o motor não parou. O vermelho fica antes do verde e do selo.':'DESLIGA apertado e o motor continuou: a botoeira desliga (NF) vai em série com a bobina, antes do LIGA e do selo.';
    g('BD').pressed=false;if(on())return 'Soltei o DESLIGA e o motor voltou sozinho: o selo tem que ficar depois do DESLIGA.';
    if(temFT){g('BL').pressed=true;on();g('BL').pressed=false;
      const r=solve(s.comps,s.wires);if(r.net('M.0')!==r.net('FT.1')&&r.net('M.1')!==r.net('FT.1'))return 'O motor tem que ser alimentado pelo borne 2 do relé térmico (o 1-2 dele fica no caminho do motor).';
      g('FT').trip=true;if(on())return 'Simulei uma sobrecarga e o motor continuou: o 95-96 do relé térmico vai em série com a bobina.'}
  }catch(e){return CURTO()}
  return null;
}
/* Caixa d'água: com a caixa vazia a bomba liga, cheia desliga; desligada fica sem tensão. */
function boiaCheck(st){
  const v=copia(st,{BO:{vazia:true},K:{on:false}}),rv=solve(v.comps,v.wires),c=copia(st,{BO:{vazia:false},K:{on:false}}),rc=solve(c.comps,c.wires);
  if(rv.short||rc.short)return CURTO();
  if(!acesa(rv,'M'))return L()?'Com a caixa vazia a bomba tem que ligar.':'Caixa vazia e a bomba parada: a boia fecha o comando'+(st.comps.some(x=>x.id==='K')?' da bobina da contatora, e o 1-2 alimenta a bomba.':' da bomba.');
  if(acesa(rc,'M'))return 'Com a caixa cheia a bomba tem que desligar: a boia corta o comando.';
  if(!semTensao(rc,'M'))return 'Com a bomba desligada ela ainda tem tensão: o contato tem que cortar a fase.';
  return null;
}
/* Cenários da fase Sobrecarga! (prever): partida direta montada, com ou sem selo. */
function scPartida(semSelo,estado){
  /* mesmo painel da Partida Direta: relé térmico embaixo da contatora; 95-96 logo antes da bobina */
  const st={comps:[BAT(),C('K','kc',150,76,0),C('FT','ft',150,202,0),C('BD','btn',230,55,0,{nf:true}),C('BL','btn',295,55,0,{nf:false}),C('M','motor',285,190,0),...ATERRA()],
    wires:[W('B.0','BD.0'),W('BD.1','BL.0'),W('BL.1','FT.2'),W('FT.3','K.0'),W('K.1','B.1'),W('B.0','K.2'),W('K.3','FT.0'),W('FT.1','M.0'),W('M.1','B.1'),W('M.2','BEP.1'),W('BEP.0','H.0')]};
  if(!semSelo)st.wires.push(W('BD.1','K.4'),W('K.5','FT.2'));
  autoColor(st);
  st.comps.forEach(c=>Object.assign(c,(estado||{})[c.id]||{}));
  return st;
}
const pecaSet=(id,mods)=>st=>Object.assign(st.comps.find(c=>c.id===id),mods);

