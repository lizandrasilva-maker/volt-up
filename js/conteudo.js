/* ================= CONTEÚDO ================= */
const BAT=()=>C('B','src',45,125,0,{V:220});
function withPE(st){const ls=st.comps.filter(c=>c.type==='lamp');let prev='B.2';ls.forEach(l=>{st.wires.push({a:prev,b:l.id+'.2',e:'h',cor:'terra'});prev=l.id+'.2'});return autoColor(st)}
function autoColor(st){const r=solve(st.comps.map(c=>c.type==='sw'?Object.assign({},c,{closed:false}):c),st.wires);
  st.wires.forEach(w=>{if(w.cor)return;const n=r.net(w.a);w.cor=n===r.P?'fase':n===r.N?'neutro':n===r.PE?'terra':'retorno'});return st}
function scSerie(){return withPE({comps:[BAT(),C('L1','lamp',170,45,0),C('L2','lamp',290,125,1)],wires:[W('B.0','L1.0','v'),W('L1.1','L2.0','h'),W('L2.1','B.1')]})}
function scParalelo(){return withPE({comps:[BAT(),C('L1','lamp',170,125,1),C('L2','lamp',280,125,1)],wires:[W('B.0','L1.0'),W('L1.0','L2.0'),W('B.1','L1.1'),W('L1.1','L2.1')]})}
function scAtalho(){const s=scSerie();s.comps.push(C('S1','sw',225,125,1,{closed:false}));s.wires.push(W('L2.0','S1.0'),W('L2.1','S1.1'));s.wires.forEach(w=>{if(w.cor!=='terra')delete w.cor});return autoColor(s)}
function scCurto(){return withPE({comps:[BAT(),C('S1','sw',115,125,1,{closed:false}),C('L1','lamp',200,125,1),C('L2','lamp',290,125,1)],wires:[W('B.0','S1.0'),W('S1.0','L1.0'),W('L1.0','L2.0'),W('B.1','S1.1'),W('S1.1','L1.1'),W('L1.1','L2.1')]})}
function scMisto(){return withPE({comps:[BAT(),C('L1','lamp',130,45,0),C('L2','lamp',220,125,1),C('L3','lamp',300,125,1)],wires:[W('B.0','L1.0','v'),W('L1.1','L2.0','h'),W('L2.0','L3.0'),W('L2.1','L3.1'),W('L2.1','B.1')]})}
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
const CORES={fase:{n:'Fase',c:'var(--fase)'},neutro:{n:'Neutro',c:'var(--neutro)'},retorno:{n:'Retorno',c:'#d9dde3'},terra:{n:'Terra',c:'linear-gradient(90deg,var(--terra) 50%,#f2d22e 50%)'}};
const coresDoNivel=()=>['fase','neutro','retorno','terra'];
function palette(cur){return '<div class="pal" role="group" aria-label="Cor do fio">'+coresDoNivel().map(k=>'<button class="btn" data-cor="'+k+'" aria-pressed="'+(cur===k)+'"><span class="sw8" style="background:'+CORES[k].c+'"></span>'+CORES[k].n+'</button>').join('')+'</div>'}
function colorCheck(st){
  const r=solve(st.comps.map(c=>c.type==='sw'?Object.assign({},c,{closed:false}):c),st.wires);
  for(const w of st.wires){
    const n=r.net(w.a),kind=n===r.P?'fase':n===r.N?'neutro':n===r.PE?'terra':'retorno';
    if(kind==='terra'&&w.cor!=='terra')return L()?'O fio do terra é verde-amarelo. Troque a cor.':'Condutor de proteção (PE) deve ser verde-amarelo (NBR 5410).';
    if(kind==='neutro'&&w.cor!=='neutro')return L()?'O fio do neutro é azul-claro. Troque a cor.':'Neutro deve ser azul-claro (NBR 5410).';
    if((kind==='fase'||kind==='retorno')&&w.cor==='neutro')return 'Azul-claro é só do neutro. '+(kind==='fase'?'Esse fio é fase.':'Esse fio é retorno (entre interruptor e lâmpada).');
    if((kind==='fase'||kind==='retorno')&&w.cor==='terra')return 'Verde-amarelo é só do terra (PE). Esse fio leva corrente: é '+kind+'.';
  }
  return null;
}
function normCheck(st){
  const lamps=st.comps.filter(c=>c.type==='lamp'),r=solve(st.comps,st.wires);
  for(const l of lamps){const n=r.net(l.id+'.0'),m=r.net(l.id+'.1');
    if(n===r.PE||m===r.PE)return L()?'O terra não pode levar a corrente da lâmpada. Ele só protege.':'O PE está fazendo papel de condutor vivo em '+l.id+'. Pela NBR 5410 o condutor de proteção nunca conduz corrente de serviço.'}
  for(const l of lamps)if(l.pe!==false&&r.net(l.id+'.2')!==r.PE)return L()?'Falta ligar o terra (verde-amarelo) na luminária '+l.id+'.':'Luminária '+l.id+' sem condutor de proteção. NBR 5410: todo circuito deve ter PE.';
  if(r.PE===r.N&&lamps.length)return 'Terra e neutro não podem ser unidos no circuito. Eles só se encontram no padrão de entrada.';
  const sws=st.comps.filter(c=>c.type==='sw');
  if(sws.length){const off=sim(st,Object.fromEntries(sws.map(c=>[c.id,0])));
    for(const l of lamps){const v=Math.max(off.vAt(l.id+'.0'),off.vAt(l.id+'.1'));
      if(off.lamp[l.id]<=0.04&&v>1)return L()?'Quase! O interruptor está cortando o fio errado. Ele precisa cortar a fase (fio vermelho). Assim a lâmpada fica sem energia quando desligada.':'O interruptor está no neutro: com ele aberto, '+l.id+' ainda fica com '+Math.round(v)+' V. NBR 5410: o comando deve seccionar a fase.'}}
  const dj=st.comps.filter(c=>c.type==='fuse');
  for(const d of dj){const t=sim(st,Object.fromEntries(sws.map(c=>[c.id,1])),{[d.id]:{broken:true}});
    for(const l of lamps){const v=Math.max(t.vAt(l.id+'.0'),t.vAt(l.id+'.1'));
      if(v>1)return L()?'O disjuntor precisa ficar no começo da fase, antes de tudo.':'Com o disjuntor '+d.id+' aberto, '+l.id+' ainda recebe '+Math.round(v)+' V. Ele deve estar em série na fase, protegendo todo o circuito.'}}
  return null;
}

