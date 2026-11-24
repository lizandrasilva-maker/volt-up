/* ================= MOTOR ELÉTRICO =================
   Fios e interruptores fechados = mesmo nó. Lâmpadas = resistores (1 Ω).
   Análise nodal resolve as tensões; brilho = potência relativa a 1 lâmpada sozinha na fonte. */
const C=(id,type,x,y,v,ex)=>Object.assign({id,type,x,y,v:!!v},ex||{});
const W=(a,b,e)=>({a,b,e});
const NAME={src:'fonte',haste:'haste de aterramento',bep:'BEP',pilha:'pilha',lamp:'luminária',sw:'interruptor',fuse:'disjuntor',sw2:'interruptor duplo',sw3:'interruptor paralelo',sw4:'interruptor intermediário',dr:'DR',dps:'DPS',foto:'fotocélula',ri:'relé de impulso',boia:'boia de nível',motor:'motor',kc:'contatora',ft:'relé térmico',btn:'botoeira'};
/* Posição dos bornes. Na vista real (GEOM_REAL, ligada por board()) cada peça tem os bornes onde o
   equipamento tem (js/bancada-real.js). O cálculo só usa o número do borne, então é o mesmo nas duas vistas.
   A lâmpada é bocal com 2 bornes (X1/X2), sem PE; só uma luminária com pe:true teria o 3º borne.
   Peças da Oficina (bornes, na ordem do motor):
     sw2 interruptor duplo: L, 1, 2 (seção a = L-1, seção b = L-2)   sw3 paralelo: C, 1, 2 (C liga em 1 ou 2)
     dr: entrada F, entrada N, saída F, saída N                         motor: 1, 2, PE (carcaça)
     kc contatora: A1, A2 (bobina), 1, 2 (contato principal), 13, 14 (auxiliar NA, para o selo)
     ft relé térmico: 1, 2 (passagem), 95, 96 (NF que abre na sobrecarga)   btn botoeira: 2 bornes (nf = desliga)
     sw4 intermediário (four-way): 1, 2 (de um lado), 3, 4 (do outro); direto 1-3/2-4 ou cruzado 1-4/2-3
     dps: L (linha) e PE; não conduz em serviço normal          foto fotocélula: L (fase), N, C (carga); de noite liga L em C
     ri relé de impulso: A1, A2 (bobina), 1, 2 (contato); cada pulso na bobina inverte o contato
   Fonte (src): L1, N, L2, L3 (c.fases = 1, 2 ou 3; sempre com neutro). Não tem PE: o neutro chega aterrado
   pela própria fonte (esquema TT) e o terra da instalação é criado pela haste.
     haste de aterramento: 1 borne (conector no topo)       bep (barramento de equipotencialização principal): 4 bornes unidos */
/* pilha (bancada CC): borne 0 = +, borne 1 = − */
const SYM_TERMS={pilha:[[-26,0],[26,0]],haste:[[0,-26]],bep:[[-18,16],[-6,16],[6,16],[18,16]],sw2:[[-26,0],[26,-14],[26,14]],sw3:[[-26,0],[26,-14],[26,14]],dr:[[-12,-30],[12,-30],[-12,30],[12,30]],
  boia:[[-26,0],[26,0]],sw4:[[-26,-12],[-26,12],[26,-12],[26,12]],dps:[[0,-26],[0,26]],foto:[[-26,0],[0,26],[26,0]],ri:[[-12,-30],[-12,30],[12,-30],[12,30]],
  motor:[[-26,0],[26,0],[0,26]],kc:[[-30,-30],[-30,30],[0,-30],[0,30],[30,-30],[30,30]],ft:[[-12,-30],[-12,30],[14,-30],[14,30]],btn:[[-26,0],[26,0]]};
let GEOM_REAL=false;
function terms(c){const d=26;
  if(GEOM_REAL&&typeof realTerms==='function')return realTerms(c).map(t=>t.p);
  if(c.type==='src'){const nf=nFases(c),t=[[c.x,c.y-30],[c.x,c.y+30]];if(nf>=2)t.push([c.x+28,c.y-10]);if(nf>=3)t.push([c.x+28,c.y+10]);return t}
  if(SYM_TERMS[c.type])return SYM_TERMS[c.type].map(([x,y])=>[c.x+x,c.y+y]);
  const t=c.v?[[c.x,c.y-d],[c.x,c.y+d]]:[[c.x-d,c.y],[c.x+d,c.y]];
  if(c.type==='lamp'&&c.pe===true)t.push(c.v?[c.x+(c.x>250?24:-24),c.y]:[c.x,c.y+(c.y>200?-24:24)]);
  return t}
function tpos(comps,t){const [id,k]=t.split('.');const c=comps.find(x=>x.id===id);return terms(c)[+k]}
function UF(){const p={};const find=x=>{if(p[x]===undefined)p[x]=x;while(p[x]!==x){p[x]=p[p[x]];x=p[x]}return x};return{find,union:(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb)p[ra]=rb}}}
/* Pares de bornes ligados por dentro da peça (contato fechado). */
function links(c){
  switch(c.type){
    case 'sw':return c.closed&&!c.broken?[[0,1]]:[];
    case 'fuse':return c.broken||c.trip?[]:[[0,1]];
    case 'sw2':return [c.a?[0,1]:0,c.b?[0,2]:0].filter(Boolean);
    case 'sw3':return [[0,c.pos?2:1]];
    case 'dr':return c.trip?[]:[[0,2],[1,3]];
    case 'btn':return (c.nf?!c.pressed:c.pressed)?[[0,1]]:[];
    case 'kc':return c.on?[[2,3],[4,5]]:[];
    case 'ft':return c.trip?[[0,1]]:[[0,1],[2,3]];
    case 'sw4':return c.pos?[[0,3],[1,2]]:[[0,2],[1,3]];
    case 'foto':return c.noite?[[0,2]]:[];
    case 'ri':return c.on?[[2,3]]:[];
    case 'boia':return c.vazia?[[0,1]]:[];
    case 'bep':return [[0,1],[0,2],[0,3]];
  }
  return [];
}
/* Fonte: quantas fases (1 a 3) e em que borne está cada uma (o borne 1 é sempre o neutro). */
const nFases=c=>Math.max(1,Math.min(3,c.fases||1));
const FASE_BORNE=[0,2,3],FASE_NOME=['L1','L2','L3'];
/* Ângulo de cada fase: as tensões são defasadas de 120°, por isso uma carga entre duas fases também liga.
   O modelo segue qualitativo: não calcula corrente real nem mostra fasores. */
const FASE_ANG=[0,-2*Math.PI/3,2*Math.PI/3];
const CPX={add:(a,b)=>[a[0]+b[0],a[1]+b[1]],sub:(a,b)=>[a[0]-b[0],a[1]-b[1]],mul:(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],
  div:(a,b)=>{const d=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d]},abs:a=>Math.hypot(a[0],a[1])};
/* Cargas: [borne A, borne B]. Lâmpada, motor e bobinas (contatora, relé de impulso) são resistores (1 Ω no modelo). */
const BOBINA={kc:1,ri:1};
const loadsOf=c=>c.broken?[]:(c.type==='lamp'||c.type==='motor'||BOBINA[c.type])?[[0,1]]:[];
function solveOnce(comps,wires){
  const u=UF();
  comps.forEach(c=>{terms(c).forEach((_,k)=>u.find(c.id+'.'+k));links(c).forEach(([a,b])=>u.union(c.id+'.'+a,c.id+'.'+b))});
  wires.forEach(w=>{if(!w.broken)u.union(w.a,w.b)});
  const src=comps.find(c=>c.type==='src'),V=src.V||220;
  const fases=FASE_BORNE.slice(0,nFases(src)).map(k=>u.find(src.id+'.'+k));
  const P=fases[0],N=u.find(src.id+'.1');
  /* terra = o que está ligado a uma haste; rede de proteção = terra + BEP (mesmo que o BEP ainda não esteja na haste) */
  const terra=new Set(comps.filter(c=>c.type==='haste').map(c=>u.find(c.id+'.0')));
  const PE=terra.size?[...terra][0]:null;
  const protecao=new Set([...terra,...comps.filter(c=>c.type==='bep').map(c=>u.find(c.id+'.0'))]);
  const short=new Set(fases).size<fases.length||fases.some(f=>f===N||terra.has(f));
  const out={V,short,lamp:{},coil:{},P,N,PE,fases,terra,protecao,net:t=>u.find(t),ehFase:n=>fases.includes(n)};
  const cargas=comps.filter(c=>loadsOf(c).length||c.type==='lamp'||c.type==='motor'||BOBINA[c.type]);
  const setPow=(c,v)=>{if(BOBINA[c.type])out.coil[c.id]=v;else out.lamp[c.id]=v};
  /* fonte com a proteção desarmada (depois de um curto): nada tem tensão até religar */
  if(src.trip){cargas.forEach(c=>setPow(c,0));out.short=false;out.desligada=true;out.vAt=()=>0;out.vDiff=()=>0;return out}
  if(out.short){cargas.forEach(c=>setPow(c,0));out.vAt=()=>0;out.vDiff=()=>0;return out}
  /* tensão conhecida: cada fase com o seu ângulo; neutro e terra em 0 V */
  const known=n=>{const i=fases.indexOf(n);if(i>=0)return [V*Math.cos(FASE_ANG[i]),V*Math.sin(FASE_ANG[i])];return (n===N||terra.has(n))?[0,0]:null};
  const nets=[...new Set(cargas.flatMap(c=>[u.find(c.id+'.0'),u.find(c.id+'.1')]))].filter(n=>known(n)===null);
  const idx={};nets.forEach((n,i)=>idx[n]=i);const m=nets.length;
  const G=Array.from({length:m},(_,i)=>{const r=Array.from({length:m+1},()=>[0,0]);r[i]=[1e-9,0];return r});
  cargas.forEach(l=>loadsOf(l).forEach(([ka,kb])=>{
    const a=u.find(l.id+'.'+ka),b=u.find(l.id+'.'+kb),g=1/(l.R||1);
    [[a,b],[b,a]].forEach(([x,y])=>{if(known(x)!==null)return;const i=idx[x];G[i][i][0]+=g;const ky=known(y);
      if(ky!==null)G[i][m]=CPX.add(G[i][m],[g*ky[0],g*ky[1]]);else G[i][idx[y]][0]-=g})}));
  for(let c=0;c<m;c++){let p=c;for(let r=c+1;r<m;r++)if(CPX.abs(G[r][c])>CPX.abs(G[p][c]))p=r;[G[c],G[p]]=[G[p],G[c]];const d=G[c][c];if(CPX.abs(d)<1e-15)continue;
    for(let r=0;r<m;r++){if(r===c)continue;const k=CPX.div(G[r][c],d);if(k[0]||k[1])for(let j=c;j<=m;j++)G[r][j]=CPX.sub(G[r][j],CPX.mul(k,G[c][j]))}}
  const vn=n=>{const k=known(n);if(k!==null)return k;const i=idx[n];if(i===undefined)return [0,0];return CPX.abs(G[i][i])?CPX.div(G[i][m],G[i][i]):[0,0]};
  /* vAt: tensão do ponto em relação ao neutro (valor eficaz); vDiff: tensão entre dois pontos (o que o multímetro mede) */
  out.vAt=t=>CPX.abs(vn(u.find(t)));
  out.vDiff=(a,b)=>CPX.abs(CPX.sub(vn(u.find(a)),vn(u.find(b))));
  cargas.forEach(l=>{if(l.broken){setPow(l,0);return}const dv=out.vDiff(l.id+'.0',l.id+'.1');setPow(l,Math.min(1,dv*dv/(l.R||1)/(V*V)))});
  return out;
}
/* Resolve o circuito com a lógica de comando:
   - contatora: bobina com tensão fecha os contatos; contatos fechados podem manter a bobina (selo).
     O estado (c.on) fica guardado na peça, então a contatora continua ligada depois que a botoeira solta.
   - DR: desarma (c.trip) se, com ele ligado, houver carga entre a saída dele e o terra (fuga)
     ou se o neutro depois dele estiver unido ao PE. */
function solve(comps,wires,_fundo){
  let out;
  for(let it=0;it<8;it++){
    out=solveOnce(comps,wires);let mudou=false;
    comps.forEach(c=>{const en=!out.short&&(out.coil[c.id]||0)>0.2;
      if(c.type==='kc'&&!!c.on!==en){c.on=en;mudou=true}
      /* relé de impulso: inverte o contato só na subida do pulso (bobina passa de sem tensão para com tensão) */
      if(c.type==='ri'){if(en&&!c.pulso){c.on=!c.on;mudou=true}c.pulso=en}});
    if(!mudou)break;
  }
  if((_fundo||0)<3&&!out.short)for(const d of comps.filter(c=>c.type==='dr'&&!c.trip)){
    if(out.vAt(d.id+'.0')<1)continue;
    const aberto=solveOnce(comps.map(x=>x===d?Object.assign({},x,{trip:true}):x),wires);
    const jusante=t=>out.vAt(t)>1&&aberto.vAt(t)<=1;
    let fuga=out.protecao.has(out.net(d.id+'.3'));
    /* carga alimentada pela saída do DR cuja volta não passa pelo DR (vai direto ao neutro da fonte ou ao terra):
       a corrente de ida e a de volta ficam diferentes e o DR atua */
    const foraDoDR=t=>aberto.net(t)===aberto.N||aberto.terra.has(aberto.net(t));
    comps.forEach(l=>loadsOf(l).forEach(([a,b])=>{const ta=l.id+'.'+a,tb=l.id+'.'+b;
      if((jusante(ta)&&foraDoDR(tb))||(jusante(tb)&&foraDoDR(ta)))fuga=true}));
    if(fuga){d.trip=true;d.porFuga=true;return solve(comps,wires,(_fundo||0)+1)}
  }
  return out;
}
/* Curto real: a fase encontrou o neutro, o terra ou outra fase sem passar por carga.
   A proteção atua: desarma o disjuntor que acaba com o curto deixando mais coisa ligada (o mais perto do curto,
   como num quadro seletivo); sem disjuntor no caminho, desarma a proteção da fonte.
   Devolve o que a tela precisa para animar: fios do caminho do curto, onde foi a faísca e quem desarmou. */
function protegeCurto(st,onde){
  const r=solve(st.comps,st.wires);if(!r.short)return null;
  const curtas=new Set(r.fases.filter(f=>f===r.N||r.terra.has(f)||r.fases.filter(g=>g===f).length>1));
  const fios=st.wires.map((w,i)=>i).filter(i=>!st.wires[i].broken&&curtas.has(r.net(st.wires[i].a)));
  let quem=null,melhor=-1;
  for(const f of st.comps.filter(c=>c.type==='fuse'&&!c.trip&&!c.broken)){f.trip=true;const t=solve(st.comps,st.wires);f.trip=false;
    if(t.short)continue;const vivos=st.comps.filter(c=>loadsOf(c).length&&t.vAt(c.id+'.0')+t.vAt(c.id+'.1')>1).length;
    if(vivos>melhor){melhor=vivos;quem=f}}
  if(!quem)quem=st.comps.find(c=>c.type==='src');
  quem.trip=true;
  return {fios,onde:onde||(fios.length?st.wires[fios[fios.length-1]].b:null),quem:quem.id,nome:quem.lab||quem.id,fonte:quem.type==='src'};
}
function sim(st,sws,mods){return solve(st.comps.map(c=>Object.assign({},c,sws&&(c.id in sws)?{closed:!!sws[c.id]}:{},mods&&mods[c.id]||{})),st.wires)}
const lit=(r,id)=>r.lamp[id]>0.04;
/* Nome do borne da fonte: 0 → L1, 1 → N, 2 → L2, 3 → L3 */
const bFonte=k=>k===1?'N':FASE_NOME[FASE_BORNE.indexOf(k)];
/* Rótulo da fonte: fases + neutro e tensões (fase-neutro; entre fases = √3 × fase-neutro) */
function fonteTxt(c){const nf=nFases(c),V=c.V||220;return (nf===1?'1F+N':nf+'F+N')+' · '+(nf===1?V+' V':V+'/'+Math.round(V*Math.sqrt(3))+' V')}
function bright(b){return b<=0.04?'apagada':b>=0.9?'forte':b>=0.2?'média':'fraca'}

/* ---------- Desenho da bancada ---------- */
function wirePath(comps,w){const [x1,y1]=tpos(comps,w.a),[x2,y2]=tpos(comps,w.b);
  if(w.e==='h')return 'M'+x1+' '+y1+' H'+x2+' V'+y2; if(w.e==='v')return 'M'+x1+' '+y1+' V'+y2+' H'+x2;
  return 'M'+x1+' '+y1+' L'+x2+' '+y2}
/* Símbolo das peças da Oficina (Diagrama): caixa com a letra de identificação e os condutores até os bornes. */
/* peças que o aluno aciona com um toque (interruptores, botoeiras, DR/relé em teste, fotocélula, boia) */
const ACION={sw:1,sw2:1,sw3:1,sw4:1,btn:1,dr:1,ft:1,foto:1,boia:1,fuse:1};
const SYM_TXT={pilha:'1,5V',haste:'⏚',bep:'BEP',boia:'BÓIA',sw2:'S 2×',sw3:'S ⇅',sw4:'S ⤨',dr:'DR',dps:'DPS',foto:'FC',ri:'RI',motor:'M',kc:'K',ft:'FT',btn:'B'};
function symGeneric(c,b,o){
  const hw=c.type==='kc'?22:c.type==='motor'?14:16,hh=c.type==='kc'||c.type==='dr'||c.type==='ft'||c.type==='ri'?18:12;
  let s=SYM_TERMS[c.type].map(([x,y])=>{const ex=Math.max(-hw,Math.min(hw,x)),ey=Math.max(-hh,Math.min(hh,y));return '<line class="sym" x1="'+x+'" y1="'+y+'" x2="'+ex+'" y2="'+ey+'"/>'}).join('');
  const ativo=c.type==='motor'?b>0.04:c.type==='kc'||c.type==='ri'?!!c.on:c.type==='foto'?!!c.noite:c.type==='boia'?!!c.vazia:c.type==='dps'?false:c.type==='dr'||c.type==='ft'?!c.trip:c.type==='btn'?!!c.pressed:c.type==='sw2'?(c.a||c.b):!!c.pos;
  const shape=c.type==='motor'?'<circle r="'+hw+'" style="fill:'+(ativo?'color-mix(in srgb,var(--amber) 35%,var(--panel2))':'var(--panel2)')+';stroke:var(--ink)" stroke-width="2.5"/>'
    :'<rect x="'+(-hw)+'" y="'+(-hh)+'" width="'+2*hw+'" height="'+2*hh+'" rx="3" style="fill:'+(ativo?'color-mix(in srgb,var(--terra) 30%,var(--panel2))':'var(--panel2)')+';stroke:var(--ink)" stroke-width="2"/>';
  const txt=c.type==='btn'?(c.nf?'B NF':'B NA'):SYM_TXT[c.type];
  s+=shape+'<text y="4" text-anchor="middle" style="fill:var(--ink);font:900 '+(txt.length>2?9:12)+'px var(--body)">'+txt+'</text>';
  if(o.pickComp)s+='<rect class="chit" data-c="'+c.id+'" x="-28" y="-24" width="56" height="48"/>';
  else if(o.toggle&&ACION[c.type])s+='<rect class="chit" data-sw="'+c.id+'" x="'+(-hw-4)+'" y="'+(-hh-4)+'" width="'+(2*hw+8)+'" height="'+(2*hh+8)+'"/>';
  return '<g transform="translate('+c.x+' '+c.y+')">'+s+'</g>';
}
function compSVG(c,b,o){
  if(SYM_TERMS[c.type])return symGeneric(c,b,o);
  const leads='<line class="sym" x1="-26" y1="0" x2="-14" y2="0"/><line class="sym" x1="14" y1="0" x2="26" y2="0"/>';
  let s='';
  if(c.type==='src')return '<g transform="translate('+c.x+' '+c.y+')"><line class="sym" x1="0" y1="-30" x2="0" y2="-20"/><line class="sym" x1="0" y1="20" x2="0" y2="30"/><line class="sym" x1="18" y1="0" x2="28" y2="0"/>'+
    '<rect x="-18" y="-20" width="36" height="40" rx="6" style="fill:var(--panel2);stroke:var(--ink)" stroke-width="2.5"/><path d="M-9 -4 q4.5 -8 9 0 t9 0" style="stroke:var(--amber);fill:none" stroke-width="2.5"/><text x="0" y="13" text-anchor="middle" style="fill:var(--ink);font:900 9px var(--body)">220V</text></g>';
  if(c.type==='lamp'){const on=b>0.04,sh=c.broken&&c.show;
    s=(on?'<circle r="28" style="fill:var(--amber)" opacity="'+(0.12+0.4*Math.sqrt(b)).toFixed(2)+'"/>':'')+leads+
      '<circle r="14" style="fill:'+(on?'var(--amber)':'var(--panel2)')+';fill-opacity:'+(on?(0.35+0.65*Math.sqrt(b)).toFixed(2):1)+';stroke:'+(sh?'var(--fase)':'var(--ink)')+'" stroke-width="2.5" '+(sh?'stroke-dasharray="4 4"':'')+'/>'+
      '<path class="sym" d="M-9 -9 L9 9 M9 -9 L-9 9" '+(on?'style="stroke:#3a2a00"':'')+'/>'}
  if(c.type==='sw'){const cl=c.closed;
    s=leads+'<circle cx="-14" r="3.5" style="fill:var(--ink)"/><circle cx="14" r="3.5" style="fill:var(--ink)"/><line x1="-14" y1="0" x2="'+(cl?14:9)+'" y2="'+(cl?0:-15)+'" style="stroke:var(--copper)" stroke-width="4" stroke-linecap="round"/>'+
      (o.toggle?'<rect class="chit" data-sw="'+c.id+'" x="-22" y="-26" width="44" height="36"/>':'')}
  if(c.type==='fuse'){const sh=c.broken&&c.show;
    s=leads+'<rect x="-14" y="-10" width="28" height="20" rx="3" style="fill:#e9edf3;stroke:var(--ink)" stroke-width="2"/><rect x="-5" y="'+(sh?1:-7)+'" width="10" height="7" rx="1.5" style="fill:'+(sh?'var(--fase)':'#2f4a6e')+'"/>'}
  if(o.pickComp&&c.type!=='src')s+='<rect class="chit" data-c="'+c.id+'" x="-28" y="-24" width="56" height="48"/>';
  return '<g transform="translate('+c.x+' '+c.y+')'+(c.v?' rotate(90)':'')+'">'+s+'</g>';
}
/* o.real = vista real (js/bancada-real.js). o.vb = viewBox do zoom. */
function board(st,o){
  o=o||{};const R=!!o.real;GEOM_REAL=R;
  const r=o.res||solve(st.comps,st.wires);
  const anyLit=Object.values(r.lamp).some(b=>b>0.04);
  let s='<svg viewBox="'+(o.vb||'0 0 340 250')+'" class="'+(o.curto?'curto':r.short?'short':anyLit?'on':'')+(R?' real-v':'')+(o.cls?' '+o.cls:'')+'" role="img" aria-label="Bancada de circuito'+(R?' em vista real':'')+'">';
  if(R)return s+realBoard(st,o,r)+ponteirasSVG(st.comps,o.ponteiras)+'</svg>';
  /* a outra vista é o diagrama multifilar (js/multifilar.js); o desenho antigo abaixo fica só de reserva */
  if(typeof multiBoard==='function')return s+multiBoard(st,o,r)+ponteirasSVG(st.comps,o.ponteiras)+'</svg>';
  if(typeof SW_FLIP!=='undefined')SW_FLIP=null;
  st.wires.forEach((w,i)=>{const d=wirePath(st.comps,w);
    s+='<path class="w '+(w.cor||'cobre')+'" d="'+d+'"/>'+(w.cor==='terra'?'<path class="w2" d="'+d+'"/>':'');if(o.pickWire)s+='<path class="hit" data-w="'+i+'" d="'+d+'"/>'});
  st.comps.forEach(c=>{if(c.type==='lamp'&&c.pe===true){const tp=terms(c)[2],dx=Math.sign(tp[0]-c.x),dy=Math.sign(tp[1]-c.y);s+='<line x1="'+(c.x+dx*14)+'" y1="'+(c.y+dy*14)+'" x2="'+tp[0]+'" y2="'+tp[1]+'" style="stroke:var(--terra)" stroke-width="2.5" stroke-dasharray="3 2"/>'}});
  st.comps.forEach(c=>{s+=compSVG(c,r.lamp[c.id]||0,o);
    if(o.move)s+=(o.selC===c.id?'<rect class="selc" x="'+(c.x-32)+'" y="'+(c.y-32)+'" width="64" height="64" rx="10"/>':'')+'<rect class="mvhit" data-mv="'+c.id+'" x="'+(c.x-(c.v?18:16))+'" y="'+(c.y-(c.v?16:18))+'" width="'+(c.v?36:32)+'" height="'+(c.v?32:36)+'"/>'});
  st.comps.forEach(c=>{
    const lab=c.lab||c.id;
    if(c.type==='src'){terms(c).forEach((p,k)=>{s+='<text class="lab" x="'+(p[0]+12)+'" y="'+(p[1]+4)+'" style="fill:var(--'+(k===1?'neutro':'fase')+')">'+bFonte(k)+'</text>'});return}
    s+=c.v?'<text class="lab" x="'+(c.x+(c.x>250?-36:36))+'" y="'+(c.y+4)+'" text-anchor="'+(c.x>250?'end':'start')+'">'+lab+'</text>':'<text class="lab" x="'+c.x+'" y="'+(c.y+(c.y>200?34:-22))+'" text-anchor="middle">'+lab+'</text>';
    if(o.tags&&o.tags[c.id]!==undefined){const ok=o.tags[c.id];s+='<text class="lab '+(ok?'ok':'no')+'" x="'+c.x+'" y="'+(c.v?c.y+44:c.y+(c.y>200?-20:30))+'" text-anchor="middle">'+(ok?'✓ passa':'✗ não passa')+'</text>'}
  });
  st.comps.forEach(c=>terms(c).forEach((p,k)=>{const t=c.id+'.'+k;
    let cl='term';if(o.sel===t)cl+=' sel';if(o.probes&&o.probes[0]===t)cl+=' probe-r';if(o.probes&&o.probes[1]===t)cl+=' probe-b';
    s+='<circle class="'+cl+'" cx="'+p[0]+'" cy="'+p[1]+'" r="6"/>';
    if(o.letters)s+='<text class="lab k" x="'+(p[0]+(c.v?-13:0))+'" y="'+(p[1]+(c.v?4:-10))+'" text-anchor="middle">'+o.letters[t]+'</text>';
    if(o.pickTerm)s+='<circle class="thit" data-t="'+t+'" cx="'+p[0]+'" cy="'+p[1]+'" r="17"/>'}));
  return s+'</svg>';
}
/* ---------- Ponteiras do multímetro (vermelha no VΩ, preta no COM) ----------
   O cabo sai do multímetro (acima da bancada, entra pela borda de baixo) e a ponta metálica fica em (x,y).
   Ponta encaixada num borne segue o borne quando a vista muda (real ou diagrama). */
const PARQUE={r:[284,236],k:[314,236]};
function novasPonteiras(){return {r:{p:PARQUE.r.slice(),t:null},k:{p:PARQUE.k.slice(),t:null}}}
const caboD=(id,p)=>{const x0=id==='r'?150:186;return 'M'+x0+' 262 C'+x0+' '+(p[1]+40).toFixed(1)+' '+p[0].toFixed(1)+' '+(p[1]+20).toFixed(1)+' '+p[0].toFixed(1)+' '+(p[1]-24).toFixed(1)};
/* posição da ponta: no borne em que está encaixada (se a peça ou o borne sumiram, a ponta fica solta) */
function pontaPos(comps,P){if(P.t){const [id,k]=P.t.split('.'),c=comps.find(x=>x.id===id);if(c&&+k<terms(c).length)return tpos(comps,P.t);P.t=null}return P.p}
/* leitura ao vivo do multímetro: tensão entre as duas pontas, se as duas estiverem em parafusos */
function leituraPonteiras(comps,res,pt){if(!pt)return null;pontaPos(comps,pt.r);pontaPos(comps,pt.k);return pt.r.t&&pt.k.t?res.vDiff(pt.r.t,pt.k.t):null}
function ponteirasSVG(comps,pt){if(!pt)return '';let s='';
  [['r','#d33a2c','#8f2219'],['k','#2a2f36','#0d0f12']].forEach(([id,c,e])=>{const p=pontaPos(comps,pt[id]);
    s+='<path class="cabo-ponta" data-cabo="'+id+'" d="'+caboD(id,p)+'" style="stroke:'+c+'"/>'+
      '<g class="ponta'+(pt[id].t?' no-borne':'')+'" data-ponta="'+id+'" transform="translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')">'+
      '<rect class="ponta-hit" x="-13" y="-36" width="26" height="40"/>'+
      (pt[id].t?'<circle r="5.5" class="ponta-ok"/>':'')+
      '<path d="M0 0 L-1.7 -2.2 V-9 H1.7 V-2.2 Z" style="fill:#e3e7eb;stroke:#6b737c;stroke-width:.5"/>'+
      '<rect x="-4.6" y="-11.4" width="9.2" height="2.6" rx="1" style="fill:'+c+';stroke:'+e+';stroke-width:.5"/>'+
      '<rect x="-3.3" y="-26" width="6.6" height="15" rx="2.6" style="fill:'+c+';stroke:'+e+';stroke-width:.6"/>'+
      '<path d="M-1.6 -23 V-14" style="stroke:#fff;stroke-width:.8;opacity:.35"/></g>'});
  return s}
/* borne mais perto de um ponto (para a ponta encaixar), dentro do raio */
function bornePerto(comps,p,raio){let best=null,bd=raio||16;comps.forEach(c=>terms(c).forEach((q,k)=>{const d=Math.hypot(q[0]-p[0],q[1]-p[1]);if(d<bd){bd=d;best=c.id+'.'+k}}));return best}
/* Faísca do curto: clarão, raios, fagulhas, fumaça subindo e uma marca escura de queimado (animação única). */
function faiscaSVG(x,y){let s='<g class="faisca" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')" aria-hidden="true"><ellipse class="fz-marca" rx="7" ry="4"/><circle class="fz-flash" r="22"/>';
  for(let i=0;i<10;i++){const a=(i*36+(i%2?14:0))*Math.PI/180,L=i%2?15:24;s+='<line class="fz-raio" x1="0" y1="0" x2="'+(Math.cos(a)*L).toFixed(1)+'" y2="'+(Math.sin(a)*L).toFixed(1)+'" style="animation-delay:'+(i*14)+'ms"/>'}
  for(let i=0;i<9;i++){const a=(i*40+15)*Math.PI/180,D=16+(i%3)*9;s+='<circle class="fz-part" r="1.5" style="--dx:'+(Math.cos(a)*D).toFixed(1)+'px;--dy:'+(Math.sin(a)*D+8).toFixed(1)+'px;animation-delay:'+(30+i*10)+'ms"/>'}
  return s+'<circle class="fz-fumaca" r="6" style="animation-delay:.25s"/><circle class="fz-fumaca" r="5" cx="5" style="animation-delay:.45s"/><circle class="fz-fumaca" r="7" cx="-4" style="animation-delay:.65s"/></g>'}
/* Ponto da faísca: o borne que acabou de ser ligado ("X2.1") ou o centro da peça acionada ("S1"). */
function pontoCurto(comps,onde){if(!onde)return null;if(onde.includes('.'))return tpos(comps,onde);
  const c=comps.find(x=>x.id===onde);if(!c)return null;return GEOM_REAL&&typeof RP==='function'?RP(c):[c.x,c.y]}
function realHTML(list){if(!list)return '';return '<div class="real" aria-label="O que cada peça é na vida real">'+list.map(([k,e,t])=>'<span class="rchip"><b>'+k+'</b><span>'+e+' '+t+'</span></span>').join('')+'</div>'}
/* Caminho da energia até a bancada, desenhado como os equipamentos reais:
   poste com transformador → medidor de energia → quadro de distribuição → circuito (lâmpada).
   estado: 'on' (alguma lâmpada acesa: a energia corre pelo cabo, o medidor pisca, a lâmpada acende),
   'short' (curto: o cabo pisca em vermelho) ou '' (parado). */
function entrada(estado){
  const on=estado==='on',sc=estado==='short';
  const t=L()?['Poste','Medidor','Quadro','Circuito']:['Trafo 13,8 kV→220 V','Medidor kWh','Quadro + DJ','220 V~ · 60 Hz'];
  const cabo='M66 33 H111 M139 33 H193 M227 33 H289';
  return '<div class="entrada'+(on?' on':sc?' short':'')+'" aria-label="Caminho da energia: '+t.join(', ')+(on?' (energia passando)':sc?' (curto-circuito)':'')+'"><svg viewBox="0 0 340 66" aria-hidden="true">'+
   '<defs><linearGradient id="eMetal" x1="0" x2="1"><stop offset="0" stop-color="#7c858f"/><stop offset=".45" stop-color="#d7dce1"/><stop offset="1" stop-color="#6c747d"/></linearGradient>'+
   '<linearGradient id="eBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c9cfd6"/></linearGradient>'+
   '<radialGradient id="eHalo"><stop offset="0" stop-color="#ffe680" stop-opacity=".9"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs>'+
   /* cabo de ligação (por trás das peças) */
   '<path d="'+cabo+'" class="ecabo-o"/><path d="'+cabo+'" class="ecabo"/>'+(on?'<path d="'+cabo+'" class="eflow"/>':sc?'<path d="'+cabo+'" class="esc"/>':'')+
   /* poste de concreto com cruzeta, isoladores e transformador */
   '<g><path d="M38 52 L40.5 4 H44.5 L47 52 Z" style="fill:url(#eMetal)"/>'+
   '<rect x="24" y="8" width="38" height="3" rx="1" style="fill:#5d666f"/>'+
   '<path d="M28 8 v-3 M42.5 8 v-3 M57 8 v-3" style="stroke:#a5c6dc" stroke-width="2.4" stroke-linecap="round"/>'+
   '<path d="M20 4 Q42 9 64 4" style="fill:none;stroke:#2b3036" stroke-width="1"/>'+
   '<rect x="47" y="16" width="17" height="22" rx="4" style="fill:url(#eMetal);stroke:#4f5760" stroke-width=".8"/>'+
   '<path d="M50 19 v16 M53.5 19 v16 M57 19 v16 M60.5 19 v16" style="stroke:#5f6871" stroke-width=".7"/>'+
   '<rect x="50" y="12.5" width="3" height="4" rx="1" style="fill:#a5c6dc"/><rect x="58" y="12.5" width="3" height="4" rx="1" style="fill:#a5c6dc"/>'+
   '<path d="M64 33 H66" style="stroke:#2b3036" stroke-width="2"/></g>'+
   /* medidor de energia: caixa, visor LCD com kWh e LED de pulso */
   '<g><rect x="111" y="9" width="28" height="42" rx="3" style="fill:url(#eBody);stroke:#8b939c" stroke-width="1"/>'+
   '<rect x="114" y="13" width="22" height="26" rx="2" style="fill:#dde4ea;stroke:#a9b2bb" stroke-width=".8"/>'+
   '<rect x="116" y="16" width="18" height="8" rx="1" style="fill:var(--lcd)"/>'+
   '<text x="125" y="22.4" text-anchor="middle" class="elcd">0427</text>'+
   '<text x="125" y="31" text-anchor="middle" class="etxt">kWh</text>'+
   '<circle cx="131" cy="35.5" r="1.6" class="eled'+(on?' pisca':'')+'"/>'+
   '<rect x="118" y="42" width="14" height="6" rx="1" style="fill:#3a4048"/></g>'+
   /* quadro de distribuição com a porta aberta e disjuntores no trilho */
   '<g><rect x="193" y="7" width="34" height="46" rx="2.5" style="fill:url(#eBody);stroke:#8b939c" stroke-width="1"/>'+
   '<rect x="197" y="11" width="26" height="38" rx="1.5" style="fill:#3a4048"/>'+
   '<rect x="197" y="25" width="26" height="3" style="fill:#9aa3ad"/>'+
   [200,206.5,213,219.5].map((x,i)=>'<rect x="'+x+'" y="19" width="5.5" height="15" rx="1" style="fill:#f1f3f5"/><rect x="'+(x+1.4)+'" y="'+(i===3&&sc?26:21)+'" width="2.7" height="4" rx=".6" style="fill:'+(i===3&&sc?'var(--fase)':'#22272c')+'"/>').join('')+
   '<path d="M227 9 l7 3 v38 l-7 3" style="fill:#e3e7eb;stroke:#8b939c" stroke-width=".8"/></g>'+
   /* circuito: lâmpada que acende junto com a bancada */
   '<g transform="translate(301 30)">'+(on?'<circle cy="-6" r="20" style="fill:url(#eHalo)"/>':'')+
   '<path d="M-4 6 L-4 3 C-4 1 -9 -1 -9 -7 A9 9 0 1 1 9 -7 C9 -1 4 1 4 3 L4 6 Z" style="fill:'+(on?'#ffe680':'#cfd8e3')+';fill-opacity:'+(on?1:.45)+';stroke:'+(on?'#e0a800':'#9aa7b5')+'" stroke-width="1"/>'+
   '<rect x="-4.5" y="6" width="9" height="6" rx="1" style="fill:url(#eMetal)"/><path d="M-12 3 H-4" style="stroke:#2b3036" stroke-width="2"/></g>'+
   [[6,'start'],[125,'middle'],[210,'middle'],[336,'end']].map(([x,an],i)=>'<text x="'+x+'" y="63" text-anchor="'+an+'" class="lab" style="font-size:'+(L()?10:8.5)+'px">'+t[i]+'</text>').join('')+
   '</svg></div>'}
/* Chips de brilho das lâmpadas. Na vista real a lâmpada desenhada já mostra se acendeu, então só o curto
   aparece (a não ser que sempre=true, como na Previsão, onde o brilho é a resposta). */
function statusChips(st,r,sempre){
  if(r.short)return '<div class="status"><span class="chip sc">⚡ Curto-circuito!</span></div>';
  if(!sempre&&typeof vistaReal==='function'&&vistaReal())return '';
  return '<div class="status">'+st.comps.filter(c=>c.type==='lamp'||c.type==='motor').map(c=>{const b=r.lamp[c.id];
    if(c.type==='motor')return '<span class="chip'+(b>0.04?' lit':'')+'">'+c.id+': '+(b>0.04?'girando':'parado')+'</span>';
    return '<span class="chip'+(b>0.04?' lit':'')+'">'+c.id+': '+(L()?bright(b):bright(b)+(b>0.04?' · '+Math.round(b*100)+'%':''))+'</span>'}).join('')+'</div>';
}
function svgPoint(svg,ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}

