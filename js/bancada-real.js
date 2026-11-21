/* ================= VISTA REAL DA BANCADA =================
   Peças desenhadas como o equipamento de verdade (plano "Realismo da bancada"):
   disjuntor DIN com os parafusos no corpo (1 em cima, 2 embaixo), interruptor com régua de bornes,
   bocal de porcelana com lâmpada (X1/X2), tomada de bancada F/N/PE, parafusos com fenda em cruz,
   fios em ângulo reto com anilha numerada. Desenho próprio, genérico, sem marca (marcação IEC).
   Na vista real os bornes ficam em outro lugar (GEOM_REAL em motor.js), mas o motor só usa o NÚMERO
   do borne (.0, .1, .2): o cálculo e as checagens da NBR 5410 são os mesmos nas duas vistas. */

/* Bornes de cada peça na vista real: posição relativa ao centro (p), lado por onde o fio sai (d) e nome impresso (n). */
const REAL_TERMS={
  /* tomada 2P+T: 3 bornes lado a lado embaixo, na ordem dos pinos vistos de frente.
     Terra no meio; fase à direita e neutro à esquerda: convenção DA BANCADA. A NBR 14136 só fixa dimensões
     de pinos e contatos, não o lado da fase (conferido no texto da norma). Sem letra impressa:
     o aluno precisa saber a ligação. Índices do motor: .0 fase, .1 neutro, .2 PE. */
  src:[{p:[17,25],d:[0,1],n:''},{p:[-17,25],d:[0,1],n:''},{p:[0,25],d:[0,1],n:''}],
  fuse:[{p:[0,-26],d:[0,-1],n:'1'},{p:[0,26],d:[0,1],n:'2'}],
  sw:[{p:[-10,26],d:[0,1],n:'L'},{p:[10,26],d:[0,1],n:'R'}],
  lamp:[{p:[-10,27],d:[0,1],n:'X1'},{p:[10,27],d:[0,1],n:'X2'},{p:[22,8],d:[1,0],n:'PE'}],
  /* peças da Oficina */
  sw2:[{p:[-20,26],d:[0,1],n:'L'},{p:[0,26],d:[0,1],n:'1'},{p:[20,26],d:[0,1],n:'2'}],
  sw3:[{p:[-20,26],d:[0,1],n:'C'},{p:[0,26],d:[0,1],n:'1'},{p:[20,26],d:[0,1],n:'2'}],
  dr:[{p:[-10,-26],d:[0,-1],n:'1'},{p:[10,-26],d:[0,-1],n:'N'},{p:[-10,26],d:[0,1],n:'2'},{p:[10,26],d:[0,1],n:'N'}],
  motor:[{p:[-20,27],d:[0,1],n:'1'},{p:[0,27],d:[0,1],n:'2'},{p:[20,27],d:[0,1],n:'⏚'}],
  kc:[{p:[-21,-26],d:[0,-1],n:'A1'},{p:[-21,26],d:[0,1],n:'A2'},{p:[0,-26],d:[0,-1],n:'1'},{p:[0,26],d:[0,1],n:'2'},{p:[21,-26],d:[0,-1],n:'13'},{p:[21,26],d:[0,1],n:'14'}],
  ft:[{p:[-10,-26],d:[0,-1],n:'1'},{p:[-10,26],d:[0,1],n:'2'},{p:[12,-26],d:[0,-1],n:'95'},{p:[12,26],d:[0,1],n:'96'}],
  btn:[{p:[-10,26],d:[0,1],n:'3'},{p:[10,26],d:[0,1],n:'4'}],
  sw4:[{p:[-10,-34],d:[0,-1],n:'1'},{p:[10,-34],d:[0,-1],n:'2'},{p:[-10,26],d:[0,1],n:'3'},{p:[10,26],d:[0,1],n:'4'}],
  dps:[{p:[0,-26],d:[0,-1],n:'L'},{p:[0,26],d:[0,1],n:'⏚'}],
  foto:[{p:[-20,26],d:[0,1],n:'L'},{p:[0,26],d:[0,1],n:'N'},{p:[20,26],d:[0,1],n:'C'}],
  boia:[{p:[-10,26],d:[0,1],n:'1'},{p:[10,26],d:[0,1],n:'2'}],
  ri:[{p:[-10,-26],d:[0,-1],n:'A1'},{p:[-10,26],d:[0,1],n:'A2'},{p:[10,-26],d:[0,-1],n:'1'},{p:[10,26],d:[0,1],n:'2'}]
};
/* Retângulo do corpo de cada peça [x0,y0,x1,y1]: usado para o fio desviar e para a área de toque. */
const REAL_BOX={src:[-27,-30,27,33],fuse:[-14,-36,14,36],sw:[-17,-29,17,33],lamp:[-14,-28,14,34],
  sw2:[-26,-29,26,33],sw3:[-26,-29,26,33],dr:[-21,-36,21,36],motor:[-41,-30,33,34],kc:[-29,-36,29,36],ft:[-23,-36,23,36],btn:[-17,-29,17,33],
  sw4:[-17,-41,17,33],dps:[-14,-36,14,36],foto:[-26,-29,26,33],ri:[-21,-36,21,36],boia:[-22,-34,22,33]};

/* Posição da peça na vista real. As fases foram posicionadas para o diagrama; as peças reais são mais altas
   e os fios saem por baixo, então a altura fica entre 46 e 184 para sobrar canaleta em cima e embaixo. */
const REAL_Y=[46,184];
function RP(c){return [c.x,Math.max(REAL_Y[0],Math.min(REAL_Y[1],c.y))]}
function realTerms(c){const t=c.type==='lamp'?REAL_TERMS.lamp.slice(0,c.pe===true?3:2):REAL_TERMS[c.type];
  const [X,Y]=RP(c);return t.map(o=>({p:[X+o.p[0],Y+o.p[1]],d:o.d,n:o.n}))}
function realDir(c,k){return REAL_TERMS[c.type][k].d}

/* Vista guardada por nível. Padrão: vista real em todos os níveis (o diagrama continua a um toque). */
function vistaReal(){const v=S.vista&&S.vista[S.mode];return (v||'real')==='real'}
function setVista(real){S.vista=Object.assign({},S.vista);S.vista[S.mode]=real?'real':'simb';save()}

/* Gradientes e sombra das peças (um só <defs> por bancada). */
function realDefs(){return '<defs>'+
  '<pattern id="rdots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r=".9" style="fill:var(--line)"/></pattern>'+
  '<linearGradient id="gBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eceff2"/><stop offset="1" stop-color="#c9cfd6"/></linearGradient>'+
  '<linearGradient id="gSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d4d9df"/><stop offset=".2" stop-color="#f6f7f9"/><stop offset=".85" stop-color="#e8ebef"/><stop offset="1" stop-color="#b9c0c8"/></linearGradient>'+
  '<radialGradient id="gScrew" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#cfd5db"/><stop offset="1" stop-color="#7e8791"/></radialGradient>'+
  '<linearGradient id="gLever" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3b4249"/><stop offset=".5" stop-color="#22272c"/><stop offset="1" stop-color="#0f1215"/></linearGradient>'+
  '<linearGradient id="gKey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3e8"/></linearGradient>'+
  '<radialGradient id="gGlass" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".55" stop-color="#e8eef5" stop-opacity=".55"/><stop offset="1" stop-color="#b9c6d4" stop-opacity=".45"/></radialGradient>'+
  '<radialGradient id="gLit" cx=".45" cy=".45" r=".7"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffe680"/><stop offset="1" stop-color="#f4c430"/></radialGradient>'+
  '<radialGradient id="gHalo"><stop offset="0" stop-color="#ffe680" stop-opacity=".85"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient>'+
  '<linearGradient id="gMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8e969f"/><stop offset=".4" stop-color="#eef1f4"/><stop offset="1" stop-color="#7c848d"/></linearGradient>'+
  '<linearGradient id="gMotor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d9cc0"/><stop offset=".5" stop-color="#4f6f94"/><stop offset="1" stop-color="#2f4a6a"/></linearGradient>'+
  '<linearGradient id="gPorc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d4c8"/><stop offset=".35" stop-color="#fdfcf8"/><stop offset="1" stop-color="#cfc9bb"/></linearGradient>'+
  '</defs>'}
const realBg=()=>realDefs()+'<rect width="340" height="250" fill="url(#rdots)" pointer-events="none"/>';

/* ---------- Fios em ângulo reto (como em canaleta) ----------
   O fio sai do parafuso na direção do borne até ficar fora do corpo da peça e, entre algumas rotas
   em L e em Z, fica com a que não atravessa peça nem parafuso, com menos dobras e menor comprimento.
   Não é um "auto fio" completo: com muitas peças juntas ainda pode cruzar um fio ou uma etiqueta. */
function realBounds(c,pad){pad=pad||0;const b=REAL_BOX[c.type],[X,Y]=RP(c);return [X+b[0]-pad,Y+b[1]-pad,X+b[2]+pad,Y+b[3]+pad]}
function segHits(p,q,r){
  if(p[1]===q[1]){const y=p[1],a=Math.min(p[0],q[0]),b=Math.max(p[0],q[0]);return y>r[1]&&y<r[3]&&b>r[0]&&a<r[2]}
  const x=p[0],a=Math.min(p[1],q[1]),b=Math.max(p[1],q[1]);return x>r[0]&&x<r[2]&&b>r[1]&&a<r[3]}
/* Ponta do fio: parafuso (p), ponto logo fora do corpo (s) e distância até ele (out). */
function wireEnd(comps,t,geo){geo=geo||GEO_REAL;const [id,k]=t.split('.'),c=comps.find(x=>x.id===id),T=geo.terms(c)[+k],r=geo.bounds(c);
  const d=T.d,p=T.p;let out=10;
  if(d[1]>0)out=r[3]-p[1]+10;else if(d[1]<0)out=p[1]-r[1]+10;else if(d[0]>0)out=r[2]-p[0]+10;else out=p[0]-r[0]+10;
  out=Math.max(10,out);
  const cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,Math.round(v)));
  return {c,p,out,s:[cl(p[0]+d[0]*out,4,336),cl(p[1]+d[1]*out,4,246)]}}
/* Quanto dois trechos retos andam um em cima do outro (mesma linha, com sobreposição). */
function segOverlap(p,q,a,b){
  const hz=(u,v)=>u[1]===v[1];
  if(hz(p,q)&&hz(a,b)){if(Math.abs(p[1]-a[1])>5)return 0;return Math.max(0,Math.min(Math.max(p[0],q[0]),Math.max(a[0],b[0]))-Math.max(Math.min(p[0],q[0]),Math.min(a[0],b[0])))}
  if(!hz(p,q)&&!hz(a,b)){if(Math.abs(p[0]-a[0])>5)return 0;return Math.max(0,Math.min(Math.max(p[1],q[1]),Math.max(a[1],b[1]))-Math.max(Math.min(p[1],q[1]),Math.min(a[1],b[1])))}
  return 0}
/* taken = trechos dos fios já desenhados: o fio novo evita correr por cima deles. */
/* geo = geometria da vista: bornes com direção de saída (terms) e corpo das peças (bounds). */
const GEO_REAL={terms:c=>realTerms(c),bounds:(c,pad)=>realBounds(c,pad)};
function realWireRoute(comps,w,taken,geo){taken=taken||[];geo=geo||GEO_REAL;
  const cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,Math.round(v)));
  const A=wireEnd(comps,w.a,geo),B=wireEnd(comps,w.b,geo),P=A.s,Q=B.s;
  const boxes=comps.map(c=>geo.bounds(c,2));
  const same=(p,q)=>p[0]===q[0]&&p[1]===q[1];
  comps.forEach(c=>geo.terms(c).forEach(T=>{if(!same(T.p,A.p)&&!same(T.p,B.p))boxes.push([T.p[0]-8,T.p[1]-8,T.p[0]+8,T.p[1]+8])}));
  const lanesY=[(P[1]+Q[1])/2],lanesX=[(P[0]+Q[0])/2];
  [A.c,B.c].forEach(c=>{const r=geo.bounds(c);[12,22,32].forEach(g=>{lanesY.push(r[1]-g,r[3]+g);lanesX.push(r[0]-g,r[2]+g)})});
  /* o fio também pode sair um pouco mais longe da peça (P2/Q2), para não colar no vizinho */
  const ext=(E,k)=>{const d=E.p[0]===E.s[0]?[0,Math.sign(E.s[1]-E.p[1])]:[Math.sign(E.s[0]-E.p[0]),0];return [cl(E.s[0]+d[0]*k,4,336),cl(E.s[1]+d[1]*k,4,246)]};
  const routes=[];
  [[P,Q],[ext(A,10),Q],[P,ext(B,10)],[ext(A,10),ext(B,10)]].forEach(([P,Q])=>{
    const pre=[A.s].concat(same(P,A.s)?[]:[P]),pos=(same(Q,B.s)?[]:[Q]).concat([B.s]);
    const add=m=>routes.push(pre.concat(m).concat(pos));
    add([[Q[0],P[1]]]);add([[P[0],Q[1]]]);
    lanesY.forEach(y=>{y=cl(y,4,246);add([[P[0],y],[Q[0],y]])});
    lanesX.forEach(x=>{x=cl(x,4,336);add([[x,P[1]],[x,Q[1]]])});
  });
  let best=null,bs=Infinity;
  routes.forEach(rt=>{
    const mid=rt.filter((p,i,a)=>i===0||!same(p,a[i-1]));
    let len=0,hits=0,bends=0,lap=0;
    for(let i=1;i<mid.length;i++){len+=Math.abs(mid[i][0]-mid[i-1][0])+Math.abs(mid[i][1]-mid[i-1][1]);boxes.forEach(r=>{if(segHits(mid[i-1],mid[i],r))hits++});
      taken.forEach(([a,b])=>{lap+=segOverlap(mid[i-1],mid[i],a,b)})}
    len+=lap*12;
    const pts=[A.p,...mid,B.p].filter((p,i,a)=>i===0||!same(p,a[i-1]));
    for(let i=2;i<pts.length;i++){const h1=pts[i-1][1]===pts[i-2][1],h2=pts[i][1]===pts[i-1][1];if(h1!==h2)bends++;
      else if((pts[i][0]-pts[i-1][0])*(pts[i-1][0]-pts[i-2][0])<0||(pts[i][1]-pts[i-1][1])*(pts[i-1][1]-pts[i-2][1])<0)len+=200}
    const sc=hits*1000+len+bends*18;if(sc<bs){bs=sc;best=pts}});
  const pts=best.filter((p,i,a)=>i===0||i===a.length-1||!((a[i-1][0]===p[0]&&p[0]===a[i+1][0])||(a[i-1][1]===p[1]&&p[1]===a[i+1][1])));
  return {pts,ea:A.out,eb:B.out};
}
const ptsPath=pts=>'M'+pts.map(p=>p[0]+' '+p[1]).join(' L');
/* Ponto a uma distância d do início da linha, e se o trecho ali é horizontal. */
function alongPts(pts,d){
  for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],len=Math.hypot(bx-ax,by-ay);
    if(d<=len||i===pts.length-1){const t=len?Math.min(1,d/len):0;return {x:ax+(bx-ax)*t,y:ay+(by-ay)*t,h:Math.abs(bx-ax)>=Math.abs(by-ay)}}
    d-=len}
  return {x:pts[0][0],y:pts[0][1],h:true};
}
/* Anilha laranja com o número do condutor, logo depois de sair de cada peça. */
function anilhas(route,n){
  const pts=route.pts;let tot=0;for(let i=1;i<pts.length;i++)tot+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  if(tot<route.ea+route.eb)return '';
  return [alongPts(pts,route.ea-3),alongPts(pts.slice().reverse(),route.eb-3)].map(p=>{const w=p.h?12:10,h=p.h?10:12;
    return '<g class="anel" transform="translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')"><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="1.6"/><text y="2.6" text-anchor="middle">'+n+'</text></g>'}).join('');
}

/* ---------- Peças ---------- */
/* Id do interruptor que acabou de ser tocado: só ele anima no próximo desenho. */
let SW_FLIP=null;
function flipSwitch(c){c.closed=!c.closed;SW_FLIP=c.id}
const shadow=(x,y,w,h,rx)=>'<rect x="'+(x+1.8)+'" y="'+(y+2.4)+'" width="'+w+'" height="'+h+'" rx="'+rx+'" style="fill:#000" opacity=".35"/>';
function realComp(c,b,o){
  let s='';
  if(c.type==='src'){/* tomada 2P+T (padrão brasileiro), genérica e sem marca, alimentada pela rede 220 V~.
       Placa, módulo e o rebaixo com os 3 furos (o do terra um pouco acima, com o símbolo ⏚ como na peça real).
       Embaixo, a régua com os 3 bornes alinhados com os pinos. */
    s=shadow(-27,-30,54,48,6)+'<rect x="-27" y="-30" width="54" height="48" rx="6" class="rbody"/>'+
      '<rect x="-23" y="-20" width="46" height="26" rx="3" style="fill:#f3f5f7;stroke:#b9c0c8" stroke-width="1"/>'+
      '<path d="M-11 -14 H11 L18 -7 L11 0 H-11 L-18 -7 Z" style="fill:#dde1e6;stroke:#a7afb8" stroke-width="1"/>'+
      '<circle cx="-9" cy="-6" r="2.2" class="furo"/><circle cx="9" cy="-6" r="2.2" class="furo"/><circle cx="0" cy="-8.4" r="2.2" class="furo"/>'+
      '<path d="M0 -12.4 V-11 M-2 -11 H2 M-1.3 -10.2 H1.3 M-.6 -9.5 H.6" style="stroke:#6f7882" stroke-width=".6" transform="translate(0 -1)"/>'+
      '<rect x="-26" y="17" width="52" height="16" rx="2" class="janela"/>';
  }
  if(c.type==='fuse'){/* disjuntor DIN unipolar: alavanca em cima = ligado; desarmado = alavanca embaixo */
    const trip=c.broken&&c.show;
    s=shadow(-14,-36,28,72,3)+'<rect x="-14" y="-36" width="28" height="72" rx="3" class="rbody" style="fill:url(#gSide)"/>'+
      '<rect x="-10" y="-34" width="20" height="16" rx="2" class="janela"/><rect x="-10" y="18" width="20" height="16" rx="2" class="janela"/>'+
      '<path d="M-14 -16 H14 M-14 16 H14" style="stroke:#b4bbc3" stroke-width="1"/>'+
      '<rect x="-9" y="-14" width="18" height="2.6" rx="1" style="fill:'+(trip?'var(--fase)':'#43b05c')+'"/>'+
      '<rect x="-6.5" y="-10" width="13" height="19" rx="2" style="fill:#1c2025"/>'+
      '<rect x="-5.5" y="'+(trip?0:-9)+'" width="11" height="9" rx="1.6" style="fill:url(#gLever)"/>'+
      '<text x="0" y="'+(trip?6.2:-2.8)+'" text-anchor="middle" class="ltxt">'+(trip?'OFF':'ON')+'</text>'+
      '<text class="rtxt" y="15.5" text-anchor="middle" style="font-size:5px">C10</text>';
  }
  if(c.type==='sw'){/* interruptor simples em módulo: tecla basculante em cima, régua de bornes embaixo.
       Ao trocar de posição a tecla gira e a metade apertada desliza (animação só no toque: SW_FLIP). */
    const cl=c.closed,fl=SW_FLIP===c.id?(cl?' liga':' desliga'):'';
    s=shadow(-17,-29,34,62,4)+'<rect x="-17" y="-29" width="34" height="62" rx="4" class="rbody"/>'+
      '<rect x="-11" y="-24" width="22" height="32" rx="3" style="fill:#c5ccd4"/>'+
      '<g class="tecla'+fl+'"><rect x="-10" y="-23" width="20" height="30" rx="3" style="fill:url(#gKey);stroke:#aeb5bd" stroke-width="1.2"/>'+
      '<rect class="aperto" x="-9" y="'+(cl?-8:-22)+'" width="18" height="14" rx="2.5" style="fill:#cfd5dc"/>'+
      '<rect x="-3" y="'+(cl?-19:-3)+'" width="6" height="2" rx="1" style="fill:'+(cl?'var(--terra)':'#9aa3ad')+'"/></g>'+
      '<rect x="-16" y="18" width="32" height="15" rx="2" class="janela"/>';
    if(o.toggle)s+='<rect class="chit" data-sw="'+c.id+'" x="-17" y="-29" width="34" height="44"/>';
  }
  if(c.type==='lamp'){/* lâmpada incandescente no bocal de porcelana, bornes X1 e X2 embaixo */
    const on=b>0.04,sh=c.broken&&c.show,k=Math.sqrt(b);
    s=(on?'<circle cy="-14" r="'+(18+16*k).toFixed(1)+'" style="fill:url(#gHalo)" opacity="'+(0.35+0.6*k).toFixed(2)+'"/>':'')+
      shadow(-11,7,22,26,3)+
      '<path d="M-6 0 L-6 -4 C-6 -7 -13 -10 -13 -17 A13 13 0 1 1 13 -17 C13 -10 6 -7 6 -4 L6 0 Z" style="fill:'+(on?'url(#gLit)':'url(#gGlass)')+';stroke:'+(sh?'var(--fase)':on?'#e0a800':'#9aa7b5')+'" stroke-width="1.2" '+(sh?'stroke-dasharray="3 2"':'')+'/>'+
      '<path d="M-2.5 -1 L-3 -15 M2.5 -1 L3 -15" style="stroke:#8d939a" stroke-width=".8"/>'+
      '<path d="M-3 -15 q1 -3 2 0 q1 3 2 0 q1 -3 2 0" style="fill:none;stroke:'+(on?'#fffbe6':'#7a6a48')+'" stroke-width="'+(on?1.4:1)+'"/>'+
      (sh?'<path d="M-6 -27 L-1 -21 L-4 -17 L2 -11" style="fill:none;stroke:var(--fase)" stroke-width="1.3"/>':'')+
      (!on&&!sh?'<path d="M-8 -22 a9 9 0 0 1 5 -6" style="fill:none;stroke:#fff" stroke-width="1.6" opacity=".8" stroke-linecap="round"/>':'')+
      '<rect x="-6.5" y="0" width="13" height="8" rx="1" style="fill:url(#gMetal)"/><path d="M-6.5 2.7 H6.5 M-6.5 5.4 H6.5" style="stroke:#6f7780" stroke-width=".8"/>'+
      '<rect x="-11" y="7" width="22" height="13" rx="3" style="fill:url(#gPorc);stroke:#a39e93" stroke-width="1"/>'+
      '<rect x="-14" y="19" width="28" height="15" rx="2" class="janela"/>';
  }
  /* ---- peças da Oficina ---- */
  const placa=(w)=>shadow(-w,-29,2*w,62,4)+'<rect x="'+(-w)+'" y="-29" width="'+2*w+'" height="62" rx="4" class="rbody"/>';
  const tecla=(x0,w,on,key)=>{const fl=SW_FLIP===key?(on?' liga':' desliga'):'';
    return '<g class="tecla'+fl+'"><rect x="'+x0+'" y="-23" width="'+w+'" height="30" rx="3" style="fill:url(#gKey);stroke:#aeb5bd" stroke-width="1.2"/>'+
      '<rect class="aperto" x="'+(x0+1)+'" y="'+(on?-8:-22)+'" width="'+(w-2)+'" height="14" rx="2.5" style="fill:#cfd5dc"/>'+
      '<rect x="'+(x0+w/2-3)+'" y="'+(on?-19:-3)+'" width="6" height="2" rx="1" style="fill:'+(on?'var(--terra)':'#9aa3ad')+'"/></g>'};
  const din=(w)=>shadow(-w,-36,2*w,72,3)+'<rect x="'+(-w)+'" y="-36" width="'+2*w+'" height="72" rx="3" class="rbody" style="fill:url(#gSide)"/>'+
    '<rect x="'+(2-w)+'" y="-34" width="'+(2*w-4)+'" height="16" rx="2" class="janela"/><rect x="'+(2-w)+'" y="18" width="'+(2*w-4)+'" height="16" rx="2" class="janela"/>'+
    '<path d="M'+(-w)+' -16 H'+w+' M'+(-w)+' 16 H'+w+'" style="stroke:#b4bbc3" stroke-width="1"/>';
  if(c.type==='sw2'){/* interruptor de 2 seções: duas teclas independentes, borne comum L */
    s=placa(26)+'<rect x="-23" y="-24" width="46" height="32" rx="3" style="fill:#c5ccd4"/>'+
      tecla(-22,21,!!c.a,c.id+'.a')+tecla(1,21,!!c.b,c.id+'.b')+'<rect x="-25" y="18" width="50" height="15" rx="2" class="janela"/>'}
  if(c.type==='sw3'){/* interruptor paralelo (three-way): o comum C vai para 1 ou para 2 */
    s=placa(26)+'<rect x="-11" y="-24" width="22" height="32" rx="3" style="fill:#c5ccd4"/>'+tecla(-10,20,!!c.pos,c.id)+
      '<path d="M-20 -12 l3.5 -5 l3.5 5 Z M-20 -4 l3.5 5 l3.5 -5 Z M13 -12 l3.5 -5 l3.5 5 Z M13 -4 l3.5 5 l3.5 -5 Z" style="fill:#9aa3ad"/>'+
      '<rect x="-25" y="18" width="50" height="15" rx="2" class="janela"/>'}
  if(c.type==='dr'){/* interruptor diferencial residual (IDR 2 polos, 30 mA): alavanca, botão TESTE */
    const trip=!!c.trip;
    s=din(21)+'<rect x="-17" y="-10" width="12" height="19" rx="2" style="fill:#1c2025"/>'+
      '<rect x="-16" y="'+(trip?0:-9)+'" width="10" height="9" rx="1.6" style="fill:'+(trip?'url(#gLever)':'#2f6fb0')+'"/>'+
      '<text x="-11" y="'+(trip?6.2:-2.8)+'" text-anchor="middle" class="ltxt">'+(trip?'OFF':'ON')+'</text>'+
      '<rect x="0" y="-8" width="17" height="8" rx="1.5" style="fill:#f2d22e;stroke:#a88f12" stroke-width=".7"/><text x="8.5" y="-2.4" text-anchor="middle" class="rtxt" style="font-size:4.4px">TESTE</text>'+
      '<text x="8.5" y="8" text-anchor="middle" class="rtxt" style="font-size:4.4px">IDR 30mA</text>'}
  if(c.type==='motor'){/* motor monofásico: carcaça aletada, ventoinha atrás, eixo com acoplamento que gira */
    const on=b>0.04;
    s=shadow(-26,-24,58,36,6)+
      '<rect x="-34" y="-12" width="9" height="5" rx="1" style="fill:url(#gMetal)"/>'+
      '<g class="giro'+(on?' gira':'')+'"><circle cx="-36" cy="-9.5" r="5" style="fill:#59616b;stroke:#2b3036" stroke-width=".8"/><path d="M-36 -14.5 V-4.5" style="stroke:#e9edf2" stroke-width="1.4"/></g>'+
      '<rect x="-26" y="-24" width="44" height="30" rx="6" style="fill:url(#gMotor);stroke:#22364d" stroke-width="1"/>'+
      '<path d="M-19 -22 V4 M-13 -22 V4 M-7 -22 V4 M-1 -22 V4 M5 -22 V4 M11 -22 V4" style="stroke:#22364d" stroke-width="1.2" opacity=".5"/>'+
      '<rect x="18" y="-22" width="13" height="26" rx="4" style="fill:#3b4148"/>'+
      '<path d="M20 -18 H29 M20 -14 H29 M20 -10 H29 M20 -6 H29 M20 -2 H29" style="stroke:#6b747e" stroke-width="1"/>'+
      '<rect x="-8" y="-30" width="16" height="7" rx="1.5" style="fill:#22364d"/>'+
      '<rect x="-22" y="6" width="34" height="5" rx="1" style="fill:#3a4048"/>'+
      '<rect x="-31" y="18" width="62" height="16" rx="2" class="janela"/>'}
  if(c.type==='kc'){/* contatora: bobina A1-A2; o indicador (êmbolo) desce e fica laranja quando energizada */
    const on=!!c.on;
    s=din(29)+'<rect x="-14" y="-9" width="28" height="17" rx="2" style="fill:#d9dee4;stroke:#9aa3ad" stroke-width=".8"/>'+
      '<rect x="-8" y="'+(on?-2:-7)+'" width="16" height="7" rx="1.5" class="embolo" style="fill:'+(on?'#f39c12':'#5b646e')+'"/>'+
      '<text x="0" y="'+(on?3.2:-1.8)+'" text-anchor="middle" class="ltxt">'+(on?'I':'O')+'</text>'}
  if(c.type==='ft'){/* relé térmico: ajuste de corrente, botão de rearme e indicador de disparo */
    const trip=!!c.trip;
    s=din(23)+'<circle cx="-8" cy="-1" r="6" style="fill:#eef1f4;stroke:#8b939c" stroke-width=".8"/><path d="M-8 -1 L-11 -5" style="stroke:#2f3a48" stroke-width="1.3"/>'+
      '<circle cx="9" cy="-5" r="4.5" style="fill:#2f6fb0"/><text x="9" y="-3.2" text-anchor="middle" class="ltxt" style="font-size:5px">R</text>'+
      '<rect x="4" y="2" width="10" height="5" rx="1" style="fill:'+(trip?'#f39c12':'#43b05c')+'"/>'}
  if(c.type==='btn'){/* botoeira: verde liga (NA), vermelha desliga (NF); afunda quando apertada */
    const nf=!!c.nf,pr=!!c.pressed;
    s=placa(17)+'<circle cy="-9" r="13" style="fill:#2a2f36"/><circle cy="-9" r="11" style="fill:#c9cfd6"/>'+
      '<circle cy="-9" r="'+(pr?8:9.5)+'" style="fill:'+(nf?'#d33a2c':'#2fa84f')+';stroke:rgba(0,0,0,.35)" stroke-width="1.2"/>'+
      '<text y="-6" text-anchor="middle" class="ltxt" style="font-size:7px">'+(nf?'O':'I')+'</text>'+
      '<text y="12" text-anchor="middle" class="rtxt" style="font-size:5px">'+(nf?'NF':'NA')+'</text>'+
      '<rect x="-16" y="18" width="32" height="15" rx="2" class="janela"/>'}
  if(c.type==='sw4'){/* interruptor intermediário (four-way): 2 bornes em cima, 2 embaixo; a tecla cruza ou não os pares */
    s=shadow(-17,-41,34,74,4)+'<rect x="-17" y="-41" width="34" height="74" rx="4" class="rbody"/>'+
      '<rect x="-16" y="-41" width="32" height="14" rx="2" class="janela"/>'+tecla(-10,20,!!c.pos,c.id)+
      '<path d="M-6 13 L6 9 M-6 9 L6 13" style="stroke:#9aa3ad" stroke-width="1.2" opacity="'+(c.pos?1:.35)+'"/>'+
      '<rect x="-16" y="18" width="32" height="15" rx="2" class="janela"/>'}
  if(c.type==='dps'){/* DPS (protetor contra surtos): linha em cima, terra embaixo; janela verde = protegendo */
    s=din(14)+'<rect x="-8" y="-11" width="16" height="9" rx="1.5" style="fill:#43b05c;stroke:#2c7a3e" stroke-width=".7"/>'+
      '<text y="5" text-anchor="middle" class="rtxt" style="font-size:5.4px">DPS</text><text y="11.5" text-anchor="middle" class="rtxt" style="font-size:4.4px">275 V</text>'}
  if(c.type==='foto'){/* fotocélula (relé fotoelétrico): sensor na cúpula; de noite liga a fase na carga */
    const n=!!c.noite;
    s=placa(26)+'<circle cy="-11" r="13" style="fill:#2a2f36"/><circle cy="-11" r="11" style="fill:'+(n?'#26324a':'#cfe3f2')+';stroke:#8b939c" stroke-width=".8"/>'+
      (n?'<path d="M3 -18 a7 7 0 1 0 0 14 a5.5 5.5 0 1 1 0 -14 Z" style="fill:#f2e6a0"/>':'<circle cy="-11" r="4.5" style="fill:#f4c430"/><path d="M0 -20 V-18 M0 -4 V-2 M-9 -11 H-7 M7 -11 H9" style="stroke:#f4c430" stroke-width="1.2"/>')+
      '<text y="10" text-anchor="middle" class="rtxt" style="font-size:5px">'+(n?'NOITE':'DIA')+'</text>'+
      '<rect x="-25" y="18" width="50" height="15" rx="2" class="janela"/>'}
  if(c.type==='ri'){/* relé de impulso: cada pulso na bobina (A1-A2) inverte o contato 1-2; indicador mostra o estado */
    const on=!!c.on;
    s=din(21)+'<rect x="-12" y="-9" width="24" height="16" rx="2" style="fill:#d9dee4;stroke:#9aa3ad" stroke-width=".8"/>'+
      '<rect x="'+(on?1:-10)+'" y="-6" width="9" height="10" rx="1.5" style="fill:'+(on?'#f39c12':'#5b646e')+'"/>'+
      '<text x="'+(on?5.5:-5.5)+'" y="0.8" text-anchor="middle" class="ltxt">'+(on?'I':'O')+'</text>'}
  if(c.type==='boia'){/* boia de nível dentro da caixa d'água: com a caixa vazia a pera desce e o contato fecha */
    const v=!!c.vazia,nv=v?4:-20;
    s=shadow(-22,-34,44,52,4)+'<rect x="-22" y="-34" width="44" height="52" rx="4" style="fill:#d7dde3;stroke:#8b939c" stroke-width="1"/>'+
      '<rect x="-19" y="'+nv+'" width="38" height="'+(15-nv)+'" rx="2" style="fill:#5aa9e6" opacity=".85"/>'+
      '<path d="M-19 '+nv+' q4.75 -2 9.5 0 t9.5 0 t9.5 0 t9.5 0" style="fill:none;stroke:#cfe8fa" stroke-width="1"/>'+
      '<path d="M12 -34 V'+(nv-6)+'" style="stroke:#2a2f36" stroke-width="1.4"/>'+
      '<ellipse cx="12" cy="'+(nv-2)+'" rx="4.5" ry="6.5" style="fill:#eef3f7;stroke:#59616b" stroke-width="1" transform="rotate('+(v?35:-25)+' 12 '+(nv-2)+')"/>'+
      '<text x="-7" y="-25" text-anchor="middle" class="rtxt" style="font-size:5px">'+(v?'VAZIA':'CHEIA')+'</text>'+
      '<rect x="-21" y="18" width="42" height="15" rx="2" class="janela"/>'}
  /* toque no corpo aciona a peça (o interruptor simples já tem a sua área) */
  if(o.toggle&&typeof ACION!=='undefined'&&ACION[c.type]&&c.type!=='sw'){const r=REAL_BOX[c.type];s+='<rect class="chit" data-sw="'+c.id+'" x="'+r[0]+'" y="'+r[1]+'" width="'+(r[2]-r[0])+'" height="'+(r[3]-r[1]-15)+'"/>'}
  if(o.pickComp&&c.type!=='src'){const r=REAL_BOX[c.type];s+='<rect class="chit" data-c="'+c.id+'" x="'+(r[0]-6)+'" y="'+(r[1]-4)+'" width="'+(r[2]-r[0]+12)+'" height="'+(r[3]-r[1]+8)+'"/>'}
  const [X,Y]=RP(c);return '<g transform="translate('+X+' '+Y+')">'+s+'</g>';
}

/* Parafuso do borne (com fenda em cruz) e o nome impresso ao lado. */
function realScrew(cl,p){return '<circle class="'+cl+'" cx="'+p[0]+'" cy="'+p[1]+'" r="6.2"/><path class="slot" d="M'+(p[0]-3.4)+' '+p[1]+' H'+(p[0]+3.4)+' M'+p[0]+' '+(p[1]-3.4)+' V'+(p[1]+3.4)+'"/>'}
function realBorneLab(c,k,text){
  const T=realTerms(c)[k];if(!T)return '';const [x,y]=T.p,d=T.d;
  let n=text===undefined?T.n:text;if(c.type==='btn'&&c.nf&&text===undefined)n=['1','2'][k];if(!n)return '';
  const st='';
  if(c.type==='src')/* só aparece no Caça-Defeito (letra da medição), acima do parafuso */
    return '<text class="lab bn" x="'+x+'" y="'+(y-10)+'" text-anchor="middle">'+n+'</text>';
  if(c.type==='sw2'||c.type==='sw3'||c.type==='foto')/* 3 bornes embaixo: nome impresso na placa, acima de cada parafuso */
    return '<text class="lab bn bnd" x="'+x+'" y="'+(y-11)+'" text-anchor="middle">'+n+'</text>';
  if(c.type==='motor')return '<text class="lab bn" x="'+x+'" y="'+(y-11)+'" text-anchor="middle">'+n+'</text>';
  if(c.type==='dr'||c.type==='kc'||c.type==='ft'||c.type==='ri')/* módulo DIN de vários polos: marcação impressa no corpo, junto do borne */
    return '<text class="lab bn bnd" x="'+x+'" y="'+(RP(c)[1]+(d[1]<0?-11:15))+'" text-anchor="middle">'+n+'</text>';
  if(c.type==='sw'||c.type==='lamp'||c.type==='btn'||c.type==='sw4'||c.type==='boia')/* pares de bornes: nome por fora de cada parafuso */
    return '<text class="lab bn"'+st+' x="'+(k%2===0?x-9:x+9)+'" y="'+(y+3)+'" text-anchor="'+(k%2===0?'end':'start')+'">'+n+'</text>';
  if(d[0])return '<text class="lab bn"'+st+' x="'+x+'" y="'+(y+(y>200?-10:16))+'" text-anchor="middle">'+n+'</text>';
  /* borne em cima/embaixo: nome do lado de fora do corpo (no disjuntor o corpo é largo) */
  const left=c.x>250,gap=Math.max(10,REAL_BOX[c.type][2]+4);
  return '<text class="lab bn"'+st+' x="'+(RP(c)[0]+(left?-gap:gap))+'" y="'+(y+3)+'" text-anchor="'+(left?'end':'start')+'">'+n+'</text>';
}
/* Nome da peça (L1, S1, DJ...) ao lado do corpo. */
/* O nome procura um lugar livre: à direita, à esquerda, em cima ou embaixo da peça,
   sem cobrir outra peça nem sair da bancada. */
function realCompLab(c,lab,comps,usados){usados=usados||[];const r=REAL_BOX[c.type],[X,Y]=RP(c),w=lab.length*7.2+2,h=11;
  const cands=[[X+r[2]+5,Y-6,'start'],[X+r[0]-5,Y-6,'end'],[X,Y+r[1]-5,'middle'],[X,Y+r[3]+12,'middle']];
  if(c.x>250)cands.unshift(cands.splice(1,1)[0]);
  const caixa=([x,y,a])=>{const x0=a==='start'?x:a==='end'?x-w:x-w/2;return [x0,y-h+2,x0+w,y+2]};
  const cruza=(b,q)=>b[0]<q[2]&&b[2]>q[0]&&b[1]<q[3]&&b[3]>q[1];
  const bate=b=>b[0]<2||b[2]>338||b[1]<2||b[3]>248||(comps||[]).some(o=>o!==c&&cruza(b,realBounds(o,1)))||usados.some(q=>cruza(b,q));
  const pos=cands.find(p=>!bate(caixa(p)))||cands[0],[x,y,a]=pos;usados.push(caixa(pos));
  return '<text class="lab" x="'+x+'" y="'+y+'" text-anchor="'+a+'">'+lab+'</text>'}

/* Bancada inteira na vista real. Ordem de desenho: peças → fios (chegam por cima até o parafuso) → anilhas
   → parafusos e nomes → áreas de toque. Mesmas opções de board(): sel, probes, letters, tags, pick*, move, toggle. */
function realBoard(st,o,r){
  let s=realBg();
  st.comps.forEach(c=>{s+=realComp(c,r.lamp[c.id]||0,o)});
  let rings='',hits='';const taken=[],labs=[];
  st.wires.forEach((w,i)=>{const rt=realWireRoute(st.comps,w,taken),d=ptsPath(rt.pts);
    for(let j=1;j<rt.pts.length;j++)taken.push([rt.pts[j-1],rt.pts[j]]);
    s+='<path class="wo" d="'+d+'"/><path class="w '+(w.cor||'cobre')+'" d="'+d+'"/>'+(w.cor==='terra'?'<path class="w2" d="'+d+'"/>':'');
    rings+=anilhas(rt,i+1);if(o.pickWire)hits+='<path class="hit" data-w="'+i+'" d="'+d+'"/>'});
  s+=rings+hits;
  if(o.move)st.comps.forEach(c=>{const b=realBounds(c,3);
    s+=(o.selC===c.id?'<rect class="selc" x="'+(b[0]-3)+'" y="'+(b[1]-3)+'" width="'+(b[2]-b[0]+6)+'" height="'+(b[3]-b[1]+6)+'" rx="8"/>':'')+
      '<rect class="mvhit" data-mv="'+c.id+'" x="'+b[0]+'" y="'+b[1]+'" width="'+(b[2]-b[0])+'" height="'+(b[3]-b[1]-14)+'"/>'});
  st.comps.forEach(c=>{
    realTerms(c).forEach((T,k)=>{const t=c.id+'.'+k;let cl='term scr';
      if(o.sel===t)cl+=' sel';if(o.probes&&o.probes[0]===t)cl+=' probe-r';if(o.probes&&o.probes[1]===t)cl+=' probe-b';
      s+=realScrew(cl,T.p)+(o.letters&&o.letters[t]?realBorneLab(c,k,'<tspan class="kl">'+o.letters[t]+'</tspan>'):realBorneLab(c,k))});
    if(c.type!=='src')s+=realCompLab(c,c.lab||c.id,st.comps,labs);
    if(o.tags&&o.tags[c.id]!==undefined){const ok=o.tags[c.id],b=realBounds(c);
      /* selo no canto da peça, para não cobrir fio nem etiqueta */
      s+='<g class="selo '+(ok?'ok':'no')+'" transform="translate('+b[2]+' '+b[1]+')"><circle r="8"/><text y="3.6" text-anchor="middle">'+(ok?'✓':'✗')+'</text><title>'+(ok?'passa':'não passa')+'</title></g>'}
  });
  if(o.pickTerm)st.comps.forEach(c=>realTerms(c).forEach((T,k)=>{s+='<circle class="thit" data-t="'+c.id+'.'+k+'" cx="'+T.p[0]+'" cy="'+T.p[1]+'" r="'+(c.type==='src'?8:12)+'"/>'}));
  SW_FLIP=null;
  return s;
}

/* ---------- Barra da bancada: chave Real/Diagrama e zoom ---------- */
function benchBar(zm,toggle){
  const R=vistaReal();
  return '<div class="benchbar">'+(toggle?'<div class="vista" role="group" aria-label="Vista da bancada"><button class="btn" data-vista="real" aria-pressed="'+R+'">🔌 Real</button><button class="btn" data-vista="simb" aria-pressed="'+!R+'">📐 Diagrama</button></div>':'<span></span>')+zm.ui()+'</div>';
}

/* Zoom com pinça, arrastar com um dedo no fundo (quando ampliado), Ctrl+roda no computador e botões.
   O estado vive fora do SVG, então sobrevive aos re-desenhos da bancada. */
function benchZoom(){
  const W0=340,H0=250,MIN=W0/3;
  const z={x:0,y:0,w:W0,until:0,pts:new Map(),g:null,el:null};
  const hgt=()=>z.w*H0/W0;
  const vb=()=>[z.x,z.y,z.w,hgt()].map(v=>+v.toFixed(2)).join(' ');
  const svg=()=>z.el&&z.el.isConnected?z.el.querySelector('svg'):null;
  const apply=()=>{z.w=Math.max(MIN,Math.min(W0,z.w));z.x=Math.max(0,Math.min(W0-z.w,z.x));z.y=Math.max(0,Math.min(H0-hgt(),z.y));
    const s=svg();if(s)s.setAttribute('viewBox',vb());
    if(z.el&&z.el.isConnected)z.el.classList.toggle('zoomed',z.w<W0-0.5)};
  const toSvg=(cx,cy,r,v)=>[v.x+(cx-r.left)/r.width*v.w,v.y+(cy-r.top)/r.height*v.w*H0/W0];
  const zoomAt=(k,cx,cy)=>{const nw=Math.max(MIN,Math.min(W0,z.w/k)),f=nw/z.w;z.x=cx-(cx-z.x)*f;z.y=cy-(cy-z.y)*f;z.w=nw;apply()};
  const mid=()=>{const a=[...z.pts.values()];return [(a[0].x+a[1].x)/2,(a[0].y+a[1].y)/2,Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1]};
  const begin=()=>{const s=svg();if(!s){z.g=null;return}const r=s.getBoundingClientRect(),v={x:z.x,y:z.y,w:z.w};
    if(z.pts.size>=2){const [mx,my,d]=mid();z.g={pinch:1,r,v,d,p:toSvg(mx,my,r,v)}}
    else{const a=z.pts.values().next().value;z.g={r,v,p:toSvg(a.x,a.y,r,v)}}};
  const move=e=>{if(!z.pts.has(e.pointerId))return;z.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});const g=z.g;if(!g)return;
    let cx,cy,w=g.v.w;
    if(g.pinch){if(z.pts.size<2)return;const [mx,my,d]=mid();w=g.v.w*g.d/d;cx=mx;cy=my}
    else{const a=z.pts.values().next().value;cx=a.x;cy=a.y}
    w=Math.max(MIN,Math.min(W0,w));z.w=w;z.x=g.p[0]-(cx-g.r.left)/g.r.width*w;z.y=g.p[1]-(cy-g.r.top)/g.r.height*w*H0/W0;apply()};
  const up=e=>{if(!z.pts.delete(e.pointerId))return;
    if(z.pts.size===0){window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      z.g=null;if(z.until===Infinity)z.until=Date.now()+350}
    else if(z.g&&z.g.pinch)begin()};
  const down=e=>{
    const onPart=e.target.closest&&e.target.closest('[data-t],[data-w],[data-sw],[data-mv],[data-c],button');
    if(z.pts.size===0){window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)}
    z.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(z.pts.size>=2){z.until=Infinity;begin()}
    else if(!onPart&&z.w<W0-0.5){begin();e.preventDefault()}
    else z.g=null};
  const wheel=e=>{if(!e.ctrlKey)return;e.preventDefault();const s=svg();if(!s)return;const p=toSvg(e.clientX,e.clientY,s.getBoundingClientRect(),z);zoomAt(e.deltaY<0?1.15:1/1.15,p[0],p[1])};
  return {
    vb,
    /* true durante a pinça e logo depois: os toques desse gesto não ligam fio nem mexem peça */
    busy:()=>Date.now()<z.until,
    ui:()=>'<div class="zoom" role="group" aria-label="Zoom da bancada"><button class="btn" data-z="-" aria-label="Afastar">−</button><button class="btn" data-z="+" aria-label="Aproximar">+</button><button class="btn" data-z="0" aria-label="Ver a bancada inteira">⤢</button></div>',
    bind(el,root){if(!el)return;z.el=el;el.addEventListener('pointerdown',down,true);el.addEventListener('wheel',wheel,{passive:false});apply();
      (root||document).querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{
        if(b.dataset.z==='0'){z.x=0;z.y=0;z.w=W0;apply();return}
        zoomAt(b.dataset.z==='+'?1.5:1/1.5,z.x+z.w/2,z.y+hgt()/2)})}
  };
}
