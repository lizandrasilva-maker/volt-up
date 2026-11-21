/* ================= VISTA REAL DA BANCADA =================
   Peças desenhadas como o equipamento de verdade (plano "Realismo da bancada"):
   disjuntor DIN com os parafusos no corpo (1 em cima, 2 embaixo), interruptor com régua de bornes,
   bocal de porcelana com lâmpada (X1/X2), fonte de bancada L1/L2/L3/N, haste de aterramento e BEP, parafusos com fenda em cruz,
   fios em ângulo reto com anilha numerada. Desenho próprio, genérico, sem marca (marcação IEC).
   Na vista real os bornes ficam em outro lugar (GEOM_REAL em motor.js), mas o motor só usa o NÚMERO
   do borne (.0, .1, .2): o cálculo e as checagens da NBR 5410 são os mesmos nas duas vistas. */

/* Bornes de cada peça na vista real: posição relativa ao centro (p), lado por onde o fio sai (d) e nome impresso (n). */
const REAL_TERMS={
  /* fonte: régua de bornes embaixo, da esquerda para a direita L1, L2, L3, N (marcação impressa).
     A posição depende de quantas fases a fonte tem (realTerms calcula). Índices do motor: .0 L1, .1 N, .2 L2, .3 L3. */
  src:[{p:[0,25],d:[0,1],n:'L1'},{p:[0,25],d:[0,1],n:'N'},{p:[0,25],d:[0,1],n:'L2'},{p:[0,25],d:[0,1],n:'L3'}],
  /* haste: conector no topo, por onde chega o condutor de aterramento */
  haste:[{p:[0,-20],d:[0,-1],n:''}],
  /* BEP: barra de cobre com 4 parafusos; os condutores saem por baixo, pela canaleta */
  bep:[{p:[-18,5],d:[0,1],n:''},{p:[-6,5],d:[0,1],n:''},{p:[6,5],d:[0,1],n:''},{p:[18,5],d:[0,1],n:''}],
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
const REAL_BOX={src:[-30,-30,30,33],haste:[-12,-26,12,30],bep:[-27,-12,27,14],fuse:[-14,-36,14,36],sw:[-17,-29,17,33],lamp:[-14,-28,14,34],
  sw2:[-26,-29,26,33],sw3:[-26,-29,26,33],dr:[-21,-36,21,36],motor:[-41,-30,33,34],kc:[-29,-36,29,36],ft:[-23,-36,23,36],btn:[-17,-29,17,33],
  sw4:[-17,-41,17,33],dps:[-14,-36,14,36],foto:[-26,-29,26,33],ri:[-21,-36,21,36],boia:[-22,-34,22,33]};

/* Posição da peça na vista real. As fases foram posicionadas para o diagrama; as peças reais são mais altas
   e os fios saem por baixo, então a altura fica entre 46 e 184 para sobrar canaleta em cima e embaixo. */
const REAL_Y=[46,184];
/* a haste fica cravada no chão: pode descer até a borda de baixo da bancada */
function RP(c){return [c.x,Math.max(REAL_Y[0],Math.min(c.type==='haste'?214:REAL_Y[1],c.y))]}
function realTerms(c){
  if(c.type==='src'){/* bornes da fonte lado a lado: L1, L2, L3 (as que existem) e o N por último */
    const nf=nFases(c),ordem=[0,2,3].slice(0,nf).concat(1),[X,Y]=RP(c),passo=nf===1?24:15,x0=-(ordem.length-1)*passo/2;
    const t=[];ordem.forEach((k,i)=>{t[k]={p:[X+x0+i*passo,Y+25],d:[0,1],n:bFonte(k)}});return t}
  const t=c.type==='lamp'?REAL_TERMS.lamp.slice(0,c.pe===true?3:2):REAL_TERMS[c.type];
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
  /* pintura do motor: cilindro (claro em cima, escuro embaixo) e tampas */
  '<linearGradient id="gPaint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9db6cf"/><stop offset=".22" stop-color="#5f7fa3"/><stop offset=".6" stop-color="#3f5f84"/><stop offset="1" stop-color="#22374f"/></linearGradient>'+
  '<linearGradient id="gPaintE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c4563"/><stop offset=".45" stop-color="#58789c"/><stop offset="1" stop-color="#2c4563"/></linearGradient>'+
  '<linearGradient id="gFan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f8a96"/><stop offset=".5" stop-color="#4c5560"/><stop offset="1" stop-color="#2a3038"/></linearGradient>'+
  '<linearGradient id="gShaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".5" stop-color="#aab2bb"/><stop offset="1" stop-color="#6b737c"/></linearGradient>'+
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
  if(c.type==='src'){/* fonte de bancada (genérica, sem marca): caixa metálica, visor com a tensão, LED de ligado,
       etiqueta com o número de fases e a régua de bornes L1/L2/L3/N embaixo. Não tem PE: o terra vem da haste. */
    /* depois de um curto sem disjuntor no caminho, a proteção da fonte desarma: visor "PROT", LED vermelho piscando */
    const on=!c.trip;
    s=shadow(-30,-30,60,48,5)+'<rect x="-30" y="-30" width="60" height="48" rx="5" style="fill:#5b6672;stroke:#2f363d" stroke-width="1.2"/>'+
      '<rect x="-27" y="-27" width="54" height="42" rx="3" style="fill:#6c7884"/>'+
      '<rect x="-22" y="-23" width="30" height="13" rx="2" style="fill:'+(on?'var(--lcd)':'#e3b2a8')+'"/><text x="-7" y="-13.6" text-anchor="middle" class="rtxt" style="font-size:7.5px;fill:'+(on?'var(--lcdink)':'#7a1d12')+'">'+(on?(c.V||220)+' V~':'PROT')+'</text>'+
      '<circle cx="17" cy="-16.5" r="3"'+(on?'':' class="led-pisca"')+' style="fill:'+(on?'#43d36b':'#e24c3f')+'"/><text x="17" y="-8" text-anchor="middle" class="rtxt" style="font-size:4px;fill:#e9edf3">'+(on?'ON':'TOQUE')+'</text>'+
      '<text x="0" y="-1" text-anchor="middle" class="rtxt" style="font-size:6px;fill:#ffffff;letter-spacing:.5px">FONTE</text>'+
      '<text x="0" y="8" text-anchor="middle" class="rtxt" style="font-size:5.5px;fill:#f4c430">'+fonteTxt(c)+'</text>'+
      '<rect x="-29" y="17" width="58" height="16" rx="2" class="janela"/>';
  }
  if(c.type==='haste'){/* haste de aterramento cobreada cravada no solo, com o conector (grampo) no topo */
    s='<rect x="-13" y="6" width="26" height="24" rx="2" style="fill:#5a4632"/>'+
      '<path d="M-13 10 l6 -4 M-5 14 l8 -6 M3 20 l9 -7 M-11 24 l7 -5" style="stroke:#7a6248" stroke-width="1.2"/>'+
      '<rect x="-2.2" y="-14" width="4.4" height="42" rx="1.5" style="fill:#c8743d;stroke:#8a4a22" stroke-width=".8"/>'+
      '<rect x="-7" y="-24" width="14" height="11" rx="2" style="fill:#b8bec5;stroke:#6f7882" stroke-width="1"/>'+
      '<text x="0" y="40" text-anchor="middle" class="rtxt" style="font-size:5px;fill:var(--muted)">SOLO</text>';
  }
  if(c.type==='bep'){/* BEP: caixa com a barra de cobre sobre dois isoladores e 4 parafusos */
    s=shadow(-27,-12,54,26,3)+'<rect x="-27" y="-12" width="54" height="26" rx="3" style="fill:#e9edf3;stroke:#8b939c" stroke-width="1"/>'+
      '<text x="0" y="-4.5" text-anchor="middle" class="rtxt" style="font-size:6px">BEP</text>'+
      '<path d="M-6 -3 H6" style="stroke:var(--terra)" stroke-width="1.6"/><path d="M-6 -3 H6" style="stroke:#f2d22e" stroke-width="1.6" stroke-dasharray="2 2"/>'+
      '<rect x="-25" y="-1" width="7" height="3" rx=".8" style="fill:#3a4048"/><rect x="18" y="-1" width="7" height="3" rx=".8" style="fill:#3a4048"/>'+
      '<rect x="-25" y="1" width="50" height="9" rx="1.5" style="fill:#c8743d;stroke:#8a4a22" stroke-width=".8"/>';
  }
  /* ---- módulos de quadro (trilho DIN): carcaça com os "ombros" dos bornes em cima e embaixo e a frente
     elevada no meio, onde ficam alavanca, janelas e marcações (como nos módulos reais de 18 mm) ---- */
  const din=(w)=>shadow(-w,-36,2*w,72,3)+'<rect x="'+(-w)+'" y="-36" width="'+2*w+'" height="72" rx="2.5" class="rbody" style="fill:url(#gSide)"/>'+
    '<rect x="'+(1-w)+'" y="-35" width="'+(2*w-2)+'" height="19" rx="2" style="fill:#d9dee3"/><rect x="'+(1-w)+'" y="16" width="'+(2*w-2)+'" height="19" rx="2" style="fill:#d9dee3"/>'+
    '<rect x="'+(2-w)+'" y="-34" width="'+(2*w-4)+'" height="16" rx="2" class="janela"/><rect x="'+(2-w)+'" y="18" width="'+(2*w-4)+'" height="16" rx="2" class="janela"/>'+
    '<rect x="'+(2.5-w)+'" y="-16.5" width="'+(2*w-5)+'" height="33" rx="2" style="fill:#000;opacity:.12" transform="translate(.8 1.2)"/>'+
    '<rect x="'+(2.5-w)+'" y="-16.5" width="'+(2*w-5)+'" height="33" rx="2" style="fill:url(#gKey);stroke:#b4bbc3" stroke-width=".7"/>'+
    '<path d="M'+(3.5-w)+' -15 V15" style="stroke:#fff" stroke-width="1" opacity=".8"/>';
  /* alavanca de módulo: rasgo escuro, alavanca com estrias (em cima = ligado) e janela de posição dos contatos
     (vermelho = contatos fechados, verde = abertos), como nos disjuntores reais */
  /* compacto: para módulos com marcação dos bornes impressa na frente (DR, relé de impulso), a alavanca fica
     só na faixa do meio e deixa livres as faixas de cima e de baixo */
  /* caiu = acabou de desarmar por curto: a alavanca desce com um tranco (animação única) */
  const alavanca=(x,ligado,w,compacto,caiu)=>{w=w||12;const k=compacto?{s0:-8.5,sh:12,lh:7,y1:-9.5,y0:-2.6,iw:4.4}:{s0:-13,sh:16,lh:9.5,y1:-15.5,y0:-5,iw:4.2};
    const y=ligado?k.y1:k.y0;
    return '<rect x="'+(x-w/2)+'" y="'+k.s0+'" width="'+w+'" height="'+k.sh+'" rx="1.6" style="fill:#14171b"/>'+
      '<g'+(caiu===true||caiu==='cai'?' class="alav-cai"':caiu==='sobe'?' class="alav-sobe"':'')+'><rect x="'+(x-w/2+1)+'" y="'+y+'" width="'+(w-2)+'" height="'+k.lh+'" rx="1.6" style="fill:url(#gLever);stroke:#0b0d0f" stroke-width=".5"/>'+
      '<path d="M'+(x-w/2+2.5)+' '+(y+1.8)+' H'+(x+w/2-2.5)+' M'+(x-w/2+2.5)+' '+(y+3.2)+' H'+(x+w/2-2.5)+'" style="stroke:#4b535c" stroke-width=".5"/>'+
      '<text x="'+x+'" y="'+(y+k.lh-1.3)+'" text-anchor="middle" class="ltxt" style="font-size:3.4px">'+(ligado?'I':'O')+'</text></g>'+
      '<rect x="'+(x-w/2+.5)+'" y="'+k.iw+'" width="'+(w-1)+'" height="3.4" rx=".6" style="fill:#1f2328"/><rect x="'+(x-w/2+1.2)+'" y="'+(k.iw+.6)+'" width="'+(w-2.4)+'" height="2.2" rx=".4" style="fill:'+(ligado?'#d33a2c':'#43b05c')+'"/>'};
  if(c.type==='fuse'){/* disjuntor DIN unipolar (curva C, 10 A): alavanca em cima = ligado; desarmado = alavanca embaixo
       e janela verde (contatos abertos). Marcação impressa: C10 e a capacidade de interrupção em caixa (6000). */
    /* alavanca anima quando desarma por curto ou quando o aluno liga/desliga com um toque (SW_FLIP) */
    const trip=(c.broken&&c.show)||!!c.trip,toque=SW_FLIP===c.id,caiu=!!(o.curto&&o.curto.quem===c.id)||(toque&&trip);
    s=din(14)+alavanca(0,!trip,12,false,caiu?'cai':toque?'sobe':'')+
      '<text class="rtxt" y="12.4" text-anchor="middle" style="font-size:5.4px">C10</text>'+
      '<rect x="-4.6" y="13.2" width="9.2" height="2.8" rx=".3" style="fill:none;stroke:#46505b" stroke-width=".35"/><text class="rtxt" y="15.4" text-anchor="middle" style="font-size:2.4px">6000</text>';
  }
  if(c.type==='sw'){/* interruptor simples em módulo: tecla basculante em cima, régua de bornes embaixo.
       Ao trocar de posição a tecla gira e a metade apertada desliza (animação só no toque: SW_FLIP). */
    s=placa(17)+tecla(-10,20,!!c.closed,c.id)+'<rect x="-16" y="18" width="32" height="15" rx="2" class="janela"/>';
    if(o.toggle)s+='<rect class="chit" data-sw="'+c.id+'" x="-17" y="-29" width="34" height="44"/>';
  }
  /* ---- interruptores de embutir: espelho (placa da parede) com bisel, suporte e módulo com tecla basculante.
     A metade apertada da tecla fica mais funda e escura; a outra fica saliente e clara.
     Ao trocar de posição a tecla gira e a metade apertada desliza (animação só no toque: SW_FLIP). ---- */
  function placa(w){return shadow(-w,-29,2*w,62,4)+'<rect x="'+(-w)+'" y="-29" width="'+2*w+'" height="62" rx="5" class="rbody"/>'+
    '<rect x="'+(1.6-w)+'" y="-27.4" width="'+(2*w-3.2)+'" height="44" rx="4" style="fill:none;stroke:#fff" stroke-width="1" opacity=".9"/>'+
    '<rect x="'+(2.6-w)+'" y="-26.4" width="'+(2*w-5.2)+'" height="42" rx="3.4" style="fill:none;stroke:#c3c9d0" stroke-width=".6"/>'}
  function tecla(x0,w,on,key){const fl=SW_FLIP===key?(on?' liga':' desliga'):'';
    return '<rect x="'+(x0-1.6)+'" y="-24.6" width="'+(w+3.2)+'" height="33.2" rx="3.4" style="fill:#b9c0c8"/>'+
      '<g class="tecla'+fl+'"><rect x="'+x0+'" y="-23" width="'+w+'" height="30" rx="3" style="fill:url(#gKey);stroke:#a7afb8" stroke-width=".9"/>'+
      '<rect class="aperto" x="'+(x0+.8)+'" y="'+(on?-8:-22.2)+'" width="'+(w-1.6)+'" height="14.4" rx="2.4" style="fill:#c4cad1"/>'+
      '<path d="M'+(x0+1.4)+' '+(on?-7.4:6.2)+' H'+(x0+w-1.4)+'" style="stroke:#a4acb5" stroke-width=".8"/>'+
      '<path d="M'+(x0+2)+' '+(on?-21:-6.4)+' H'+(x0+w-2)+'" style="stroke:#fff" stroke-width="1.2" opacity=".9"/>'+
      '<path d="M'+(x0+1)+' -8 H'+(x0+w-1)+'" style="stroke:#9aa3ad" stroke-width=".5" opacity=".7"/></g>'}
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
  if(c.type==='sw2'){/* interruptor de 2 seções: duas teclas independentes no mesmo espelho, borne comum L */
    s=placa(26)+tecla(-22,21,!!c.a,c.id+'.a')+tecla(1,21,!!c.b,c.id+'.b')+'<rect x="-25" y="18" width="50" height="15" rx="2" class="janela"/>'}
  if(c.type==='sw3'){/* interruptor paralelo (three-way): por fora é igual ao simples; a diferença está nos 3 bornes (C, 1, 2) */
    s=placa(26)+tecla(-10,20,!!c.pos,c.id)+'<rect x="-25" y="18" width="50" height="15" rx="2" class="janela"/>'}
  if(c.type==='dr'){/* interruptor diferencial residual (IDR 2 polos, 25 A, IΔn 30 mA): alavanca com janela de posição,
       botão de teste T e as marcações impressas */
    const trip=!!c.trip;
    s=din(21)+alavanca(-9,!trip,13,true)+
      '<circle cx="9" cy="-4.4" r="3.9" style="fill:#c9cfd6;stroke:#7e8791" stroke-width=".7"/><circle cx="9" cy="-4.4" r="2.9" style="fill:url(#gKey)"/><text x="9" y="-3" text-anchor="middle" class="rtxt" style="font-size:4px">T</text>'+
      '<text x="9" y="3.4" text-anchor="middle" class="rtxt" style="font-size:3.2px">IΔn 30mA</text>'+
      '<text x="9" y="7.9" text-anchor="middle" class="rtxt" style="font-size:4.2px">25A</text>'}
  if(c.type==='motor'){/* motor de indução fechado (carcaça aletada), visto de lado, genérico e sem marca:
       eixo com chaveta e acoplamento à esquerda (gira quando o motor liga), tampa dianteira, carcaça com aletas
       ao longo do eixo, olhal de içamento, caixa de ligação em cima (o cabo desce até a régua de bornes),
       placa de identificação, tampa defletora com grade da ventoinha atrás e pés sobre a base. */
    const on=b>0.04;
    const aletas=[-17,-13.5,-10,-6.5,-3,0.5,4].map(y=>'<path d="M-22 '+y+' H11" style="stroke:#1c2e44" stroke-width="1.1" opacity=".55"/><path d="M-22 '+(y+0.9)+' H11" style="stroke:#b9cde0" stroke-width=".5" opacity=".45"/>').join('');
    const grade=[15,17.6,20.2,22.8,25.4].map(x=>'<path d="M'+x+' -15 V3" style="stroke:#1e242b" stroke-width="1.2"/>').join('');
    s='<ellipse cx="-4" cy="14" rx="34" ry="3" style="fill:#000" opacity=".35"/>'+
      /* base e pés */
      '<path d="M-24 9 H14 V12.5 H-24 Z" style="fill:#2b3138"/><path d="M-21 5 H-13 L-12 9 H-22 Z M3 5 H11 L12 9 H2 Z" style="fill:#33506f;stroke:#1c2e44" stroke-width=".6"/>'+
      /* eixo, chaveta e acoplamento */
      '<rect x="-39" y="-9.2" width="11" height="4.4" rx=".8" style="fill:url(#gShaft);stroke:#5d656e" stroke-width=".5"/>'+
      '<rect x="-36.5" y="-9.6" width="5" height="1.3" rx=".4" style="fill:#4b535c"/>'+
      '<g class="giro'+(on?' gira':'')+'"><circle cx="-38.5" cy="-7" r="4.2" style="fill:#6b737c;stroke:#2b3036" stroke-width=".7"/><circle cx="-38.5" cy="-7" r="1.4" style="fill:#2b3036"/><path d="M-38.5 -11.2 V-8.4" style="stroke:#f4f6f8" stroke-width="1.3"/></g>'+
      /* tampa dianteira (mancal) */
      '<path d="M-28 -16 Q-30 -7 -28 2 H-23 V-16 Z" style="fill:url(#gPaintE);stroke:#1c2e44" stroke-width=".7"/>'+
      '<rect x="-30" y="-10.5" width="2.4" height="7" rx=".6" style="fill:#2c4563"/>'+
      /* carcaça aletada */
      '<rect x="-23" y="-21" width="35" height="28" rx="3.5" style="fill:url(#gPaint);stroke:#1c2e44" stroke-width=".9"/>'+aletas+
      /* placa de identificação */
      '<rect x="-19" y="-14.5" width="12" height="8" rx=".8" style="fill:#dfe4e9;stroke:#8b939c" stroke-width=".5"/>'+
      '<path d="M-17.5 -12.4 H-9 M-17.5 -10.6 H-11 M-17.5 -8.8 H-10" style="stroke:#7b848e" stroke-width=".55"/>'+
      /* olhal de içamento */
      '<path d="M-10 -21 V-23.5" style="stroke:#59616b" stroke-width="1.6"/><circle cx="-10" cy="-26" r="2.6" style="fill:none;stroke:#8e969f" stroke-width="1.4"/>'+
      /* caixa de ligação, prensa-cabo e cabo até a régua */
      '<rect x="-4" y="-29" width="13" height="8.5" rx="1.4" style="fill:url(#gPaint);stroke:#1c2e44" stroke-width=".7"/>'+
      '<path d="M-3 -26.6 H8" style="stroke:#1c2e44" stroke-width=".5" opacity=".7"/><circle cx="-2" cy="-27.6" r=".7" style="fill:#c9cfd6"/><circle cx="7" cy="-27.6" r=".7" style="fill:#c9cfd6"/>'+
      '<rect x="9" y="-26.4" width="3" height="3.4" rx=".6" style="fill:#2b3036"/>'+
      '<path d="M12 -24.7 C27 -25 31 -22 31 -12 V17" style="fill:none;stroke:#1f2328;stroke-width:2.4;stroke-linecap:round"/>'+
      '<path d="M12 -24.7 C27 -25 31 -22 31 -12 V17" style="fill:none;stroke:#59616b;stroke-width:.8;stroke-linecap:round"/>'+
      /* tampa defletora com a grade da ventoinha */
      '<path d="M12 -19 H24 Q29 -19 29 -13 V1 Q29 7 24 7 H12 Z" style="fill:url(#gFan);stroke:#1e242b" stroke-width=".8"/>'+grade+
      '<rect x="-31" y="18" width="62" height="16" rx="2" class="janela"/>'}
  if(c.type==='kc'){/* contatora (genérica, sem marca): corpo em dois níveis, réguas de bornes em cima e embaixo,
       frente elevada com a janela do indicador (o êmbolo desce e fica laranja com a bobina energizada),
       etiqueta da tensão da bobina, porta-etiqueta e aletas de ventilação. */
    const on=!!c.on;
    s=shadow(-29,-36,58,72,3)+'<rect x="-29" y="-36" width="58" height="72" rx="3" class="rbody" style="fill:url(#gSide)"/>'+
      '<rect x="-27" y="-34" width="54" height="16" rx="2" class="janela"/><rect x="-27" y="18" width="54" height="16" rx="2" class="janela"/>'+
      '<path d="M-29 -17 H29 M-29 17 H29" style="stroke:#a9b1ba" stroke-width="1"/>'+
      /* frente elevada */
      '<rect x="-21" y="-8" width="42" height="16" rx="2.5" style="fill:#4a525c;opacity:.25" transform="translate(1 1.4)"/>'+
      '<rect x="-21" y="-8" width="42" height="16" rx="2.5" style="fill:url(#gKey);stroke:#9aa3ad" stroke-width=".8"/>'+
      '<rect x="-8" y="-6.5" width="16" height="8.5" rx="1.5" style="fill:#2a3038;stroke:#14181c" stroke-width=".6"/>'+
      '<rect x="-6.5" y="'+(on?-2.2:-5.4)+'" width="13" height="4" rx=".8" class="embolo" style="fill:'+(on?'#f39c12':'#6b747e')+'"/>'+
      '<text x="0" y="'+(on?0.9:-2.3)+'" text-anchor="middle" class="ltxt" style="font-size:3.6px">'+(on?'I':'O')+'</text>'+
      '<path d="M-18 -5.5 V5.5 M-15.5 -5.5 V5.5 M15.5 -5.5 V5.5 M18 -5.5 V5.5" style="stroke:#aeb6bf" stroke-width="1"/>'+
      '<text x="0" y="6.4" text-anchor="middle" class="rtxt" style="font-size:3.2px">220V~</text>'}
  if(c.type==='ft'){/* relé térmico (genérico): dial de ajuste de corrente com escala, botão azul de rearme (R),
       botão vermelho de teste/desliga, janela do indicador de disparo (verde = normal, laranja = disparado) */
    const trip=!!c.trip;
    const escala=[-140,-105,-70,-35,0].map(a=>{const r=a*Math.PI/180;return '<path d="M'+(-9+Math.cos(r)*5.4).toFixed(2)+' '+(Math.sin(r)*5.4).toFixed(2)+' L'+(-9+Math.cos(r)*6.6).toFixed(2)+' '+(Math.sin(r)*6.6).toFixed(2)+'" style="stroke:#2f3a48" stroke-width=".55"/>'}).join('');
    s=din(23)+'<rect x="-21" y="-8" width="42" height="16" rx="2" style="fill:url(#gKey);stroke:#9aa3ad" stroke-width=".7"/>'+
      '<circle cx="-9" cy="0" r="7" style="fill:#f4f6f8;stroke:#8b939c" stroke-width=".7"/>'+escala+
      '<circle cx="-9" cy="0" r="3.6" style="fill:#d6dbe1;stroke:#7e8791" stroke-width=".7"/><path d="M-9 0 L-11.6 -2.9" style="stroke:#1c2025;stroke-width:1.3;stroke-linecap:round"/>'+
      '<circle cx="6" cy="-2.6" r="3.6" style="fill:#2f6fb0;stroke:#1d4a7a" stroke-width=".7"/><circle cx="5.2" cy="-3.6" r="1.1" style="fill:#fff;opacity:.35"/><text x="6" y="-1.2" text-anchor="middle" class="ltxt" style="font-size:4px">R</text>'+
      '<rect x="12" y="-5.6" width="6" height="6" rx="1" style="fill:#d33a2c;stroke:#8f2219" stroke-width=".5"/>'+
      '<rect x="3" y="2.4" width="15" height="4.4" rx=".8" style="fill:#2a3038"/><rect x="3.8" y="3.1" width="13.4" height="3" rx=".5" style="fill:'+(trip?'#f39c12':'#43b05c')+'"/>'}
  if(c.type==='btn'){/* botoeira de 22 mm em caixa (genérica): aro cromado, botão que afunda ao apertar,
       plaqueta LIGA/DESLIGA e o bloco de contato atrás (verde NA, vermelho NF) */
    const nf=!!c.nf,pr=!!c.pressed,cor=nf?'#d33a2c':'#2fa84f',esc2=nf?'#8f2219':'#1d6e34';
    s=shadow(-17,-29,34,62,4)+'<rect x="-17" y="-29" width="34" height="62" rx="4" style="fill:#c3c9d0;stroke:#7e8791" stroke-width="1"/>'+
      '<rect x="-15" y="-27" width="30" height="40" rx="3" style="fill:#d6dbe1"/>'+
      '<circle cy="-11" r="12.5" style="fill:#5b646e"/><circle cy="-11" r="11.2" style="fill:url(#gMetal)"/><circle cy="-11" r="9" style="fill:#2a2f36"/>'+
      '<circle cy="'+(pr?-10.4:-11)+'" r="'+(pr?7.2:8)+'" style="fill:'+cor+';stroke:'+esc2+'" stroke-width="1"/>'+
      '<ellipse cx="-2.4" cy="'+(pr?-13:-14)+'" rx="3.6" ry="2.2" style="fill:#fff;opacity:.3"/>'+
      '<text y="'+(pr?-8.2:-8.8)+'" text-anchor="middle" class="ltxt" style="font-size:6.4px">'+(nf?'O':'I')+'</text>'+
      '<rect x="-12" y="3" width="24" height="7" rx="1" style="fill:#1f2328"/><text y="8.2" text-anchor="middle" class="rtxt" style="font-size:4.4px;fill:#f4f6f8">'+(nf?'DESLIGA':'LIGA')+'</text>'+
      '<rect x="-13" y="12.5" width="26" height="5.5" rx="1" style="fill:#eef1f4;stroke:#9aa3ad" stroke-width=".5"/><rect x="-13" y="12.5" width="4" height="5.5" rx="1" style="fill:'+cor+'"/>'+
      '<text x="2" y="16.6" text-anchor="middle" class="rtxt" style="font-size:3.6px">'+(nf?'NF':'NA')+'</text>'+
      '<rect x="-16" y="18" width="32" height="15" rx="2" class="janela"/>'}
  if(c.type==='sw4'){/* interruptor intermediário (four-way): 2 bornes em cima, 2 embaixo; a tecla cruza ou não os pares */
    /* por fora parece um interruptor comum; tem 4 bornes (2 em cima, 2 embaixo) e fica entre dois paralelos */
    s=shadow(-17,-41,34,74,4)+'<rect x="-16" y="-41" width="32" height="14" rx="2" class="janela"/>'+placa(17)+tecla(-10,20,!!c.pos,c.id)+
      '<text y="13.5" text-anchor="middle" class="rtxt" style="font-size:3.2px;fill:#8b939c">INTERMED.</text>'+
      '<rect x="-16" y="18" width="32" height="15" rx="2" class="janela"/>'}
  if(c.type==='dps'){/* DPS (protetor contra surtos): linha em cima, terra embaixo; janela verde = protegendo */
    /* módulo com cartucho de encaixe (estrias para puxar), janela de estado (verde = protegendo) e marcações:
       Uc = máxima tensão contínua de operação; In = corrente nominal de descarga */
    s=din(14)+'<rect x="-11.5" y="-15.5" width="23" height="30.5" rx="2" style="fill:#f4f6f8;stroke:#9aa3ad" stroke-width=".7"/>'+
      '<path d="M-8 -13.4 H8 M-8 -11.8 H8 M-8 -10.2 H8" style="stroke:#aeb6bf" stroke-width=".6"/>'+
      '<rect x="-7" y="-7.6" width="14" height="5" rx="1" style="fill:#1f2328"/><rect x="-6.2" y="-6.9" width="12.4" height="3.6" rx=".5" style="fill:#43b05c"/>'+
      '<text y="2.6" text-anchor="middle" class="rtxt" style="font-size:5px">DPS</text>'+
      '<text y="7.6" text-anchor="middle" class="rtxt" style="font-size:3.3px">Uc 275V~</text><text y="11.8" text-anchor="middle" class="rtxt" style="font-size:3.3px">In 5kA</text>'}
  if(c.type==='foto'){/* fotocélula (relé fotoelétrico): sensor na cúpula; de noite liga a fase na carga */
    /* relé fotoelétrico (genérico): corpo cinza com a janela translúcida do sensor no topo, preso numa base;
       os 3 fios saem por baixo até a régua: preto = L (fase), branco = N, vermelho = C (carga).
       O céu atrás (sol ou lua) mostra se é dia ou noite. */
    const n=!!c.noite;
    s=/* céu */'<rect x="-26" y="-29" width="52" height="34" rx="5" style="fill:'+(n?'#1b2740':'#bfe0f7')+'"/>'+
      (n?'<path d="M18.5 -25 a5 5 0 1 0 4 8 a4 4 0 1 1 -4 -8 Z" style="fill:#f2e6a0"/><circle cx="-18" cy="-22" r=".7" style="fill:#fff"/><circle cx="-12" cy="-16" r=".5" style="fill:#fff"/><circle cx="-20" cy="-9" r=".6" style="fill:#fff"/>'
        :'<circle cx="18" cy="-20" r="4" style="fill:#f4c430"/><path d="M18 -27 V-25.4 M18 -14.6 V-13 M11 -20 H12.6 M23.4 -20 H25 M13 -25 L14.2 -23.8 M21.8 -16.2 L23 -15" style="stroke:#f4c430" stroke-width="1"/>')+
      /* placa de montagem (atrás dos fios) e base de fixação */
      '<rect x="-26" y="4" width="52" height="16" rx="2" style="fill:#d6dbe1;stroke:#9aa3ad" stroke-width=".6"/>'+
      '<rect x="-14" y="2" width="28" height="4" rx="1" style="fill:#59616b"/>'+
      /* corpo e janela do sensor */
      '<path d="M-11 2 V-14 Q-11 -24 0 -24 Q11 -24 11 -14 V2 Z" style="fill:url(#gFan);stroke:#1e242b" stroke-width=".8"/>'+
      '<path d="M-7 -14 Q-7 -21 0 -21 Q7 -21 7 -14 V-11 H-7 Z" style="fill:'+(n?'#3a4a66':'#e8f2fa')+';stroke:#9aa7b5" stroke-width=".6" opacity=".9"/>'+
      '<rect x="-2.4" y="-16.4" width="4.8" height="3.4" rx=".6" style="fill:#c0392b"/><path d="M-1.6 -14.7 h.8 v-1 h.8 v1 h.8 v-1 h.8" style="fill:none;stroke:#f5d7a1" stroke-width=".35"/>'+
      '<text y="-4" text-anchor="middle" class="ltxt" style="font-size:3.2px">220V~</text>'+
      /* fios até a régua */
      '<path d="M-4 6 C-4 12 -20 11 -20 18" style="fill:none;stroke:#1a1d21;stroke-width:1.8"/>'+
      '<path d="M0 6 V18" style="fill:none;stroke:#eef1f4;stroke-width:1.8"/><path d="M0 6 V18" style="fill:none;stroke:#9aa3ad;stroke-width:.4"/>'+
      '<path d="M4 6 C4 12 20 11 20 18" style="fill:none;stroke:#c0392b;stroke-width:1.8"/>'+
      '<text x="-23" y="-23" class="rtxt" style="font-size:4px;fill:'+(n?'#e9edf3':'#1d4a7a')+'">'+(n?'NOITE':'DIA')+'</text>'+
      '<rect x="-25" y="18" width="50" height="15" rx="2" class="janela"/>'}
  if(c.type==='ri'){/* relé de impulso: cada pulso na bobina (A1-A2) inverte o contato 1-2; indicador mostra o estado */
    /* módulo DIN com a alavanca de comando manual (sobe quando o contato está fechado) e as marcações da bobina */
    const on=!!c.on;
    s=din(21)+alavanca(-9,on,11,true)+
      '<text x="8" y="-3.4" text-anchor="middle" class="rtxt" style="font-size:4.6px">RI</text>'+
      '<rect x="2.5" y="-1" width="11" height="6.6" rx="1" style="fill:none;stroke:#46505b" stroke-width=".4"/><path d="M4.3 4 V1 H7.8 V4 H11.6" style="fill:none;stroke:#46505b" stroke-width=".5"/>'+
      '<text x="8" y="8.6" text-anchor="middle" class="rtxt" style="font-size:2.8px">220V~</text>'}
  if(c.type==='boia'){/* boia de nível dentro da caixa d'água: com a caixa vazia a pera desce e o contato fecha */
    /* caixa d'água de polietileno (genérica) em corte: tampa, parede mais larga em cima, água com nível,
       boia tipo pera pendurada pelo cabo, que sai pela tampa e desce até a régua de bornes.
       Vazia: a pera tomba para baixo e o contato fecha; cheia: a pera flutua para cima e o contato abre. */
    const v=!!c.vazia,nv=v?6:-14;
    const parede='M-19 -26 L-15 14 Q-15 16 -13 16 H13 Q15 16 15 14 L19 -26 Z';
    s='<ellipse cx="0" cy="17.5" rx="18" ry="2.2" style="fill:#000" opacity=".35"/>'+
      '<path d="'+parede+'" style="fill:#1f4f86;stroke:#12355e" stroke-width="1"/>'+
      '<clipPath id="cxa'+c.id+'"><path d="M-17 -24 L-13.4 13.6 H13.4 L17 -24 Z"/></clipPath>'+
      '<g clip-path="url(#cxa'+c.id+')"><rect x="-20" y="-24" width="40" height="40" style="fill:#d9e4ee"/>'+
        '<rect x="-20" y="'+nv+'" width="40" height="'+(20-nv)+'" style="fill:#5aa9e6" opacity=".9"/>'+
        '<path d="M-20 '+nv+' q5 -2 10 0 t10 0 t10 0 t10 0" style="fill:none;stroke:#d6efff" stroke-width="1"/></g>'+
      '<path d="M-17 -24 L-13.4 13.6 M17 -24 L13.4 13.6" style="stroke:#3a6fae" stroke-width="1.6"/>'+
      /* tampa */
      '<path d="M-22 -26 Q0 -34 22 -26 L21 -24 H-21 Z" style="fill:#2a66a8;stroke:#12355e" stroke-width=".9"/>'+
      '<path d="M-14 -29.4 Q0 -33 14 -29.4" style="fill:none;stroke:#7fb1e3" stroke-width=".8" opacity=".7"/>'+
      /* cabo da boia: sai pela tampa, desce por fora até a régua */
      '<path d="M7 -30 C7 -36 24 -36 24 -24 V18" style="fill:none;stroke:#1f2328;stroke-width:2;stroke-linecap:round"/>'+
      '<path d="M7 -24 V'+(nv-7)+'" style="stroke:#1f2328" stroke-width="1.3"/>'+
      '<ellipse cx="7" cy="'+(nv-2)+'" rx="3.6" ry="6" style="fill:#eef3f7;stroke:#59616b" stroke-width=".9" transform="rotate('+(v?30:-35)+' 7 '+(nv-7)+')"/>'+
      '<text x="-5" y="-17" text-anchor="middle" class="rtxt" style="font-size:4.6px;fill:#12355e">'+(v?'VAZIA':'CHEIA')+'</text>'+
      '<rect x="-21" y="18" width="42" height="15" rx="2" class="janela"/>'}
  /* toque no corpo aciona a peça (o interruptor simples já tem a sua área) */
  /* disjuntor ou fonte desarmados por curto também aceitam um toque (para religar) */
  if(o.toggle&&typeof ACION!=='undefined'&&(ACION[c.type]||((c.type==='fuse'||c.type==='src')&&c.trip))&&c.type!=='sw'){const r=REAL_BOX[c.type];s+='<rect class="chit" data-sw="'+c.id+'" x="'+r[0]+'" y="'+r[1]+'" width="'+(r[2]-r[0])+'" height="'+(r[3]-r[1]-15)+'"/>'}
  if(o.pickComp&&c.type!=='src'){const r=REAL_BOX[c.type];s+='<rect class="chit" data-c="'+c.id+'" x="'+(r[0]-6)+'" y="'+(r[1]-4)+'" width="'+(r[2]-r[0]+12)+'" height="'+(r[3]-r[1]+8)+'"/>'}
  const [X,Y]=RP(c);return '<g transform="translate('+X+' '+Y+')">'+s+'</g>';
}

/* Parafuso do borne (com fenda em cruz) e o nome impresso ao lado. */
function realScrew(cl,p){return '<circle class="'+cl+'" cx="'+p[0]+'" cy="'+p[1]+'" r="6.2"/><path class="slot" d="M'+(p[0]-3.4)+' '+p[1]+' H'+(p[0]+3.4)+' M'+p[0]+' '+(p[1]-3.4)+' V'+(p[1]+3.4)+'"/>'}
function realBorneLab(c,k,text){
  const T=realTerms(c)[k];if(!T)return '';const [x,y]=T.p,d=T.d;
  let n=text===undefined?T.n:text;if(c.type==='btn'&&c.nf&&text===undefined)n=['1','2'][k];if(!n)return '';
  const st='';
  if(c.type==='src')/* marcação impressa na régua, acima do parafuso (no Caça-Defeito, a letra da medição) */
    return '<text class="lab bn bnd" x="'+x+'" y="'+(y-10)+'" text-anchor="middle"'+(text===undefined?' style="fill:'+(k===1?'#2f6fb0':'#b8322a')+'"':'')+'>'+n+'</text>';
  if(c.type==='foto')/* fotocélula: o fio desce até o parafuso, então o nome fica ao lado do fio */
    return '<text class="lab bn bnd" x="'+(x+(k===2?-3:3))+'" y="'+(y-12)+'" text-anchor="'+(k===2?'end':'start')+'">'+n+'</text>';
  if(c.type==='sw2'||c.type==='sw3')/* 3 bornes embaixo: nome impresso na placa, acima de cada parafuso */
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
  const oc=Object.assign({},o,{res:r});
  st.comps.forEach(c=>{s+=realComp(c,r.lamp[c.id]||0,oc)});
  let rings='',hits='';const taken=[],labs=[];
  st.wires.forEach((w,i)=>{const rt=realWireRoute(st.comps,w,taken),d=ptsPath(rt.pts);
    for(let j=1;j<rt.pts.length;j++)taken.push([rt.pts[j-1],rt.pts[j]]);
    s+='<path class="wo" d="'+d+'"/><path class="w '+(w.cor||'cobre')+'" d="'+d+'"/>'+(w.cor==='terra'?'<path class="w2" d="'+d+'"/>':'')+
      (o.curto&&o.curto.fios.includes(i)?'<path class="wcurto" d="'+d+'"/>':'');/* fio do caminho do curto fica incandescente */
    rings+=anilhas(rt,i+1);if(o.pickWire)hits+='<path class="hit" data-w="'+i+'" d="'+d+'"/>'});
  s+=rings+hits;
  if(o.move)st.comps.forEach(c=>{const b=realBounds(c,3);
    s+=(o.selC===c.id?'<rect class="selc" x="'+(b[0]-3)+'" y="'+(b[1]-3)+'" width="'+(b[2]-b[0]+6)+'" height="'+(b[3]-b[1]+6)+'" rx="8"/>':'')+
      '<rect class="mvhit" data-mv="'+c.id+'" x="'+b[0]+'" y="'+b[1]+'" width="'+(b[2]-b[0])+'" height="'+(b[3]-b[1]-14)+'"/>'});
  st.comps.forEach(c=>{
    realTerms(c).forEach((T,k)=>{const t=c.id+'.'+k;let cl='term scr';
      if(o.sel===t)cl+=' sel';if(o.probes&&o.probes[0]===t)cl+=' probe-r';if(o.probes&&o.probes[1]===t)cl+=' probe-b';
      s+=realScrew(cl,T.p)+(o.letters&&o.letters[t]?realBorneLab(c,k,'<tspan class="kl">'+o.letters[t]+'</tspan>'):realBorneLab(c,k))});
    if(c.type!=='src'&&c.type!=='bep')s+=realCompLab(c,c.lab||c.id,st.comps,labs);
    if(o.tags&&o.tags[c.id]!==undefined){const ok=o.tags[c.id],b=realBounds(c);
      /* selo no canto da peça, para não cobrir fio nem etiqueta */
      s+='<g class="selo '+(ok?'ok':'no')+'" transform="translate('+b[2]+' '+b[1]+')"><circle r="8"/><text y="3.6" text-anchor="middle">'+(ok?'✓':'✗')+'</text><title>'+(ok?'passa':'não passa')+'</title></g>'}
  });
  if(o.curto){const pt=pontoCurto(st.comps,o.curto.onde);if(pt)s+=faiscaSVG(pt[0],pt[1])}
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
