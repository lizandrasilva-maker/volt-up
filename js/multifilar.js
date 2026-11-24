/* ================= DIAGRAMA MULTIFILAR =================
   A outra vista da bancada (botão "Multifilar"): o mesmo circuito desenhado como diagrama multifilar,
   com símbolos normalizados (estilo IEC 60617 / ensino brasileiro), cada condutor separado, fios em
   ângulo reto e na cor do condutor (neutro azul-claro, terra verde-amarelo...). Cada contato aparece
   na posição em que está: o aluno aciona a peça e vê o contato mudar no diagrama.
   Usa os bornes da vista de símbolo (terms() com GEOM_REAL desligado); o cálculo é o mesmo. */

/* Corpo de cada símbolo [x0,y0,x1,y1] em relação ao centro (peças que giram: sw, fuse, lamp). */
const SYM_BOX={pilha:[-14,-14,14,14],src:[-18,-20,18,20],haste:[-12,-16,12,14],bep:[-24,-8,24,8],lamp:[-12,-12,12,12],sw:[-14,-15,14,6],fuse:[-14,-14,14,6],sw2:[-14,-17,14,17],sw3:[-14,-17,14,17],sw4:[-14,-17,14,17],
  dr:[-21,-16,21,16],dps:[-9,-13,9,13],foto:[-17,-13,17,13],ri:[-22,-15,22,15],kc:[-40,-15,38,15],ft:[-21,-13,23,13],btn:[-14,-17,14,6],motor:[-15,-15,15,15],boia:[-14,-17,14,6]};
const GIRA={sw:1,fuse:1,lamp:1};
function symBounds(c,pad){pad=pad||0;const o=SYM_BOX[c.type];
  /* peça girada 90°: (x,y) vira (-y,x) */
  const b=GIRA[c.type]&&c.v?[-o[3],o[0],-o[1],o[2]]:o;
  return [c.x+b[0]-pad,c.y+b[1]-pad,c.x+b[2]+pad,c.y+b[3]+pad]}
/* Bornes com a direção de saída do fio (pelo eixo dominante em relação ao centro). */
function symTerms(c){return terms(c).map(p=>{const dx=p[0]-c.x,dy=p[1]-c.y;return {p,d:Math.abs(dx)>=Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)]}})}
const GEO_MULTI={terms:symTerms,bounds:symBounds};

/* ---------- Símbolos ---------- */
const ln=(x1,y1,x2,y2,cl)=>'<line class="'+(cl||'ms')+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';
const pto=(x,y)=>'<circle class="mpt" cx="'+x+'" cy="'+y+'" r="2.2"/>';
/* contato: de (x1,y1) até (x2,y2); aberto = lâmina levantada 30° */
function contato(x1,y1,x2,y2,fechado){
  if(fechado)return ln(x1,y1,x2,y2,'ms mc on');
  const dx=x2-x1,dy=y2-y1,a=Math.atan2(dy,dx)-0.5,L=Math.hypot(dx,dy)*0.92;
  return ln(x1,y1,(x1+Math.cos(a)*L).toFixed(1),(y1+Math.sin(a)*L).toFixed(1),'ms mc');
}
const elo=(x1,y1,x2,y2)=>ln(x1,y1,x2,y2,'ms elo');   /* ligação mecânica (tracejada) */
function multiSym(c,b,o){
  let s='';const on=b>0.04;
  switch(c.type){
    case 'src':{const nf=nFases(c);
      s='<rect x="-18" y="-20" width="36" height="40" rx="5" class="mbody"/><path d="M-9 -7 q4.5 -8 9 0 t9 0" class="ms" style="stroke:var(--amber)"/>'+
        '<text y="6" text-anchor="middle" class="mtx">'+(nf===1?'1F+N':nf+'F+N')+'</text><text y="15" text-anchor="middle" class="mtx"'+(c.trip?' style="fill:var(--fase)"':'')+'>'+(c.trip?'PROT':(c.V||220)+' V~')+'</text>'+
        ln(0,-30,0,-20)+ln(0,20,0,30)+(nf>=2?ln(18,-10,28,-10):'')+(nf>=3?ln(18,10,28,10):'');break}
    /* pilha: traço longo = polo positivo, traço curto e grosso = polo negativo */
    case 'pilha':s=ln(-26,0,-4,0)+ln(4,0,26,0)+'<path d="M-4 -12 V12" class="ms"/><path d="M4 -6 V6" class="ms" style="stroke-width:4"/>'+
      '<text x="-12" y="-6" text-anchor="middle" class="mtx" style="fill:var(--fase)">+</text><text x="12" y="-6" text-anchor="middle" class="mtx">−</text>'+
      '<text y="22" text-anchor="middle" class="mtx">'+ccN(c.V||1.5)+' V</text>';break;
    /* haste: símbolo de terra (três traços decrescentes) */
    case 'haste':s=ln(0,-26,0,-4)+'<path d="M-12 -4 H12 M-8 2 H8 M-4 8 H4" class="ms"/>';break;
    /* BEP: barra com os bornes embaixo */
    case 'bep':s='<rect x="-24" y="-6" width="48" height="12" rx="2" class="mbody" style="fill:color-mix(in srgb,var(--copper) 45%,var(--panel2))"/>'+
      [-18,-6,6,18].map(x=>ln(x,6,x,16)).join('')+'<text y="3.5" text-anchor="middle" class="mtx">BEP</text>';break;
    case 'lamp':{const sh=c.broken&&c.show;
      s=(on?'<circle r="20" style="fill:var(--amber)" opacity="'+(0.15+0.35*Math.sqrt(b)).toFixed(2)+'"/>':'')+ln(-26,0,-12,0)+ln(12,0,26,0)+
        '<circle r="12" class="mbody" style="'+(on?'fill:color-mix(in srgb,var(--amber) 55%,var(--panel2));':'')+(sh?'stroke:var(--fase);stroke-dasharray:3 3':'')+'"/>'+
        '<path d="M-8.5 -8.5 L8.5 8.5 M8.5 -8.5 L-8.5 8.5" class="ms"/>';break}
    case 'sw':s=ln(-26,0,-12,0)+ln(12,0,26,0)+pto(-12,0)+pto(12,0)+contato(-12,0,12,0,!!c.closed&&!(c.broken&&c.show))+/* defeito escondido no Caça-Defeito: o aluno descobre medindo */
      (o.toggle?'<rect class="chit" data-sw="'+c.id+'" x="-22" y="-20" width="44" height="30"/>':'');break;
    case 'fuse':{const tr=(c.broken&&c.show)||!!c.trip;
      s=ln(-26,0,-12,0)+ln(12,0,26,0)+pto(-12,0)+contato(-12,0,12,0,!tr)+'<path d="M9 -3 L15 3 M15 -3 L9 3" class="ms"/>'+
        '<rect x="-4" y="-13" width="8" height="5" class="ms" style="fill:none"/>'+elo(0,-8,0,-2);break}
    case 'sw2':s=ln(-26,0,-12,0)+pto(-12,0)+ln(10,-14,26,-14)+ln(10,14,26,14)+pto(10,-14)+pto(10,14)+
      contato(-12,0,10,-14,!!c.a)+contato(-12,0,10,14,!!c.b);break;
    case 'sw3':s=ln(-26,0,-12,0)+pto(-12,0)+ln(10,-14,26,-14)+ln(10,14,26,14)+pto(10,-14)+pto(10,14)+
      (c.pos?contato(-12,0,10,14,true):contato(-12,0,10,-14,true));break;
    case 'sw4':s=ln(-26,-12,-10,-12)+ln(-26,12,-10,12)+ln(10,-12,26,-12)+ln(10,12,26,12)+[[-10,-12],[-10,12],[10,-12],[10,12]].map(([x,y])=>pto(x,y)).join('')+
      (c.pos?ln(-10,-12,10,12,'ms mc on')+ln(-10,12,10,-12,'ms mc on'):ln(-10,-12,10,-12,'ms mc on')+ln(-10,12,10,12,'ms mc on'))+
      '<rect x="-14" y="-17" width="28" height="34" rx="3" class="ms elo" style="fill:none"/>';break;
    case 'dr':{const f=!c.trip;
      s=ln(-12,-30,-12,-14)+ln(12,-30,12,-14)+pto(-12,-14)+pto(12,-14)+contato(-12,-14,-12,0,f)+contato(12,-14,12,0,f)+
        ln(-12,0,-12,30)+ln(12,0,12,30)+'<rect x="-21" y="2" width="42" height="12" rx="2" class="mbody"/><text y="11" text-anchor="middle" class="mtx">IΔn 30mA</text>'+elo(-12,-7,12,-7);break}
    case 'dps':s=ln(0,-26,0,-13)+ln(0,13,0,26)+'<rect x="-8" y="-13" width="16" height="26" rx="2" class="mbody"/>'+ln(-6,9,6,-9)+ln(6,-9,6,-4)+
      '<path d="M-6 30 H6 M-4 33 H4 M-2 36 H2" class="ms"/>';break;
    case 'foto':{const n=!!c.noite;
      s=ln(-26,0,-17,0)+ln(17,0,26,0)+ln(0,13,0,26)+'<rect x="-17" y="-13" width="34" height="26" rx="3" class="mbody"/>'+
        pto(-9,4)+pto(9,4)+contato(-9,4,9,4,n)+'<path d="M-12 -18 l5 6 M-4 -20 l5 6" class="ms" style="stroke:var(--amber)"/><text x="0" y="-4" text-anchor="middle" class="mtx">'+(n?'☾':'☀')+'</text>';break}
    case 'ri':s=ln(-12,-30,-12,-9)+ln(-12,9,-12,30)+'<rect x="-21" y="-9" width="18" height="18" rx="1" class="mbody" style="'+(c.on?'fill:color-mix(in srgb,var(--amber) 40%,var(--panel2))':'')+'"/>'+
      '<path d="M-17 4 V-3 H-12 V4 H-7" class="ms" style="stroke-width:1.4"/>'+ln(12,-30,12,-12)+ln(12,12,12,30)+pto(12,-12)+pto(12,12)+contato(12,-12,12,12,!!c.on)+elo(-3,0,8,0);break;
    case 'kc':{const k=!!c.on;
      s=ln(-30,-30,-30,-9)+ln(-30,9,-30,30)+'<rect x="-39" y="-9" width="18" height="18" rx="1" class="mbody" style="'+(k?'fill:color-mix(in srgb,var(--amber) 45%,var(--panel2))':'')+'"/>'+
        '<text x="-30" y="3.5" text-anchor="middle" class="mtx">K</text>'+
        ln(0,-30,0,-12)+ln(0,12,0,30)+pto(0,-12)+pto(0,12)+contato(0,-12,0,12,k)+
        ln(30,-30,30,-12)+ln(30,12,30,30)+pto(30,-12)+pto(30,12)+contato(30,-12,30,12,k)+elo(-21,0,30,0);break}
    case 'ft':{const t=!!c.trip;
      s=ln(-12,-30,-12,-10)+ln(-12,10,-12,30)+'<rect x="-20" y="-10" width="16" height="20" rx="1" class="mbody"/><path d="M-12 -7 h4 v4 h-8 v4 h8 v4 h-4" class="ms" style="stroke-width:1.4;fill:none"/>'+
        ln(14,-30,14,-12)+ln(14,12,14,30)+pto(14,-12)+pto(14,12)+contato(14,-12,14,12,!t)+'<path d="M9 -2 H19" class="ms"/>'+elo(-4,0,9,0);break}
    case 'btn':{const fechado=c.nf?!c.pressed:!!c.pressed;
      s=ln(-26,0,-12,0)+ln(12,0,26,0)+pto(-12,0)+pto(12,0)+contato(-12,0,12,0,fechado)+
        elo(0,fechado?0:-6,0,-13)+'<path d="M-6 -13 H6 M-6 -13 v-3 M6 -13 v-3" class="ms"/>'+(c.nf?'<path d="M10 0 V-7" class="ms"/>':'');break}
    case 'motor':s=ln(-26,0,-15,0)+ln(15,0,26,0)+ln(0,15,0,26)+'<circle r="15" class="mbody" style="'+(on?'fill:color-mix(in srgb,var(--amber) 40%,var(--panel2))':'')+'"/>'+
      '<text y="-1" text-anchor="middle" class="mtx" style="font-size:11px">M</text><text y="9" text-anchor="middle" class="mtx">1~</text>';break;
    case 'boia':s=ln(-26,0,-12,0)+ln(12,0,26,0)+pto(-12,0)+pto(12,0)+contato(-12,0,12,0,!!c.vazia)+elo(0,c.vazia?0:-6,0,-12)+
      '<circle cy="-15" r="3.5" class="ms" style="fill:none"/>';break;
  }
  if(o.toggle&&(ACION[c.type]||((c.type==='fuse'||c.type==='src')&&c.trip)||(c.type==='lamp'&&c.queima))&&c.type!=='sw'){const r=SYM_BOX[c.type];s+='<rect class="chit" data-sw="'+c.id+'" x="'+r[0]+'" y="'+r[1]+'" width="'+(r[2]-r[0])+'" height="'+(r[3]-r[1])+'"/>'}
  if(o.pickComp&&c.type!=='src'){const r=SYM_BOX[c.type];s+='<rect class="chit" data-c="'+c.id+'" x="'+(r[0]-6)+'" y="'+(r[1]-6)+'" width="'+(r[2]-r[0]+12)+'" height="'+(r[3]-r[1]+12)+'"/>'}
  return '<g transform="translate('+c.x+' '+c.y+')'+(GIRA[c.type]&&c.v?' rotate(90)':'')+'">'+s+'</g>';
}
/* Nome do borne no multifilar (o mesmo impresso na peça real; a fonte mostra L1, L2, L3 e N). */
function multiBorne(c,k){if(c.type==='src')return bFonte(k);if(c.type==='pilha')return k?'−':'+';if(c.type==='bep'||c.type==='haste')return '';if(c.type==='btn'&&c.nf)return ['1','2'][k];
  if(c.type==='lamp')return '';const T=REAL_TERMS[c.type]&&REAL_TERMS[c.type][k];return T?T.n:''}

/* Bancada inteira em multifilar: condutores → símbolos → bornes e nomes → áreas de toque. */
function multiBoard(st,o,r){
  let s='<defs><pattern id="mgrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0 H0 V10" style="fill:none;stroke:var(--line)" stroke-width=".4"/></pattern></defs><rect width="340" height="250" fill="url(#mgrid)" opacity=".7" pointer-events="none"/>';
  let hits='';const taken=[],labs=[];
  st.wires.forEach((w,i)=>{const rt=realWireRoute(st.comps,w,taken,GEO_MULTI),d=ptsPath(rt.pts);
    for(let j=1;j<rt.pts.length;j++)taken.push([rt.pts[j-1],rt.pts[j]]);
    s+='<path class="mw '+(w.cor||'cobre')+(w.broken&&w.show?' rompido':'')+'" d="'+d+'"/>'+(w.cor==='terra'?'<path class="mw2" d="'+d+'"/>':'')+
      (o.curto&&o.curto.fios.includes(i)?'<path class="wcurto" d="'+d+'"/>':'');
    if(o.pickWire)hits+='<path class="hit" data-w="'+i+'" d="'+d+'"/>'});
  st.comps.forEach(c=>{s+=multiSym(c,r.lamp[c.id]||0,o)});
  s+=hits;
  if(o.move)st.comps.forEach(c=>{const b=symBounds(c,4);
    s+=(o.selC===c.id?'<rect class="selc" x="'+b[0]+'" y="'+b[1]+'" width="'+(b[2]-b[0])+'" height="'+(b[3]-b[1])+'" rx="6"/>':'')+
      '<rect class="mvhit" data-mv="'+c.id+'" x="'+b[0]+'" y="'+b[1]+'" width="'+(b[2]-b[0])+'" height="'+(b[3]-b[1])+'"/>'});
  /* 1º os bornes e as marcações deles (guardando onde ficaram), 2º os nomes das peças desviando de tudo */
  st.comps.forEach(c=>terms(c).forEach((p,k)=>{const t=c.id+'.'+k;let cl='term mt';
      if(o.sel===t)cl+=' sel';if(o.probes&&o.probes[0]===t)cl+=' probe-r';if(o.probes&&o.probes[1]===t)cl+=' probe-b';
      s+='<circle class="'+cl+'" cx="'+p[0]+'" cy="'+p[1]+'" r="4.2"/>';labs.push([p[0]-5,p[1]-5,p[0]+5,p[1]+5]);
      const n=o.letters&&o.letters[t]?o.letters[t]:multiBorne(c,k);
      if(n){const dx=p[0]-c.x,dy=p[1]-c.y,hz=Math.abs(dx)>=Math.abs(dy),x=hz?p[0]:p[0]+7,y=hz?p[1]-7:p[1]+(dy<0?-3:9),w=n.length*5.5+2;
        labs.push(hz?[x-w/2,y-8,x+w/2,y+1]:[x,y-8,x+w,y+1]);
        s+='<text class="lab mb'+(o.letters&&o.letters[t]?' mk':'')+(c.type==='src'?' src'+k:'')+'" x="'+x+'" y="'+y+'" text-anchor="'+(hz?'middle':'start')+'">'+n+'</text>'}}));
  st.comps.forEach(c=>{
    if(c.type!=='src'&&c.type!=='bep'){const lab=c.lab||c.id,b=symBounds(c),w=lab.length*7.2+2;
      const cands=[[b[2]+5,c.y-4,'start'],[b[0]-5,c.y-4,'end'],[c.x,b[1]-6,'middle'],[c.x,b[3]+13,'middle']];
      const caixa=([x,y,a])=>{const x0=a==='start'?x:a==='end'?x-w:x-w/2;return [x0,y-9,x0+w,y+2]};
      const cruza=(p,q)=>p[0]<q[2]&&p[2]>q[0]&&p[1]<q[3]&&p[3]>q[1];
      const pos=cands.find(q=>{const k=caixa(q);return !(k[0]<2||k[2]>338||k[1]<2||k[3]>248||st.comps.some(x=>x!==c&&cruza(k,symBounds(x,2)))||labs.some(l=>cruza(k,l)))})||cands[0];
      labs.push(caixa(pos));s+='<text class="lab" x="'+pos[0]+'" y="'+pos[1]+'" text-anchor="'+pos[2]+'">'+lab+'</text>'}
    if(o.tags&&o.tags[c.id]!==undefined){const ok=o.tags[c.id],b=symBounds(c);
      s+='<g class="selo '+(ok?'ok':'no')+'" transform="translate('+b[2]+' '+b[1]+')"><circle r="8"/><text y="3.6" text-anchor="middle">'+(ok?'✓':'✗')+'</text></g>'}
  });
  if(o.curto){const pt=pontoCurto(st.comps,o.curto.onde);if(pt)s+=faiscaSVG(pt[0],pt[1])}
  if(o.pickTerm)st.comps.forEach(c=>terms(c).forEach((p,k)=>{s+='<circle class="thit" data-t="'+c.id+'.'+k+'" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(c.type==='src'?11:10)+'"/>'}));
  if(typeof SW_FLIP!=='undefined')SW_FLIP=null;
  return s;
}
