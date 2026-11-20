/* ================= VISTA REAL DA BANCADA =================
   Etapa 1 do plano "Realismo da bancada": peças desenhadas como o equipamento de verdade,
   bornes com o nome impresso, fios em ângulo reto com anilha numerada, chave Símbolo/Real e zoom.
   Só muda o DESENHO: terminais (terms), cálculo (solve) e checagens da NBR 5410 continuam os mesmos.
   Peças genéricas, sem marca, com marcação de bornes no padrão IEC. */

/* Nome impresso em cada borne (índice = terminal .0, .1, .2). A rede usa F, N e PE, desenhados em board(). */
const BORNE={fuse:['1','2'],sw:['L','R'],lamp:['F/R','N','PE']};
/* Meia largura e meia altura do corpo de cada peça: o "rabicho" sai do borne até essa borda. */
const REAL_BOX={src:[18,22],fuse:[12,19],sw:[15,18],lamp:[8,8]};

/* Vista guardada por nível. Padrão: Leve abre na vista real; Técnico e Profissional, no símbolo. */
function vistaReal(){const v=S.vista&&S.vista[S.mode];return (v||(L()?'real':'simb'))==='real'}
function setVista(real){S.vista=Object.assign({},S.vista);S.vista[S.mode]=real?'real':'simb';save()}

/* Para que lado o borne k sai da peça: [dx,dy] com -1, 0 ou 1. */
function realDir(c,k){const p=terms(c)[k];return [Math.sign(Math.round(p[0]-c.x)),Math.sign(Math.round(p[1]-c.y))]}

/* ---------- Fios em ângulo reto (como em canaleta) ----------
   O fio sai reto do borne (12 px) e, entre algumas rotas em L e em Z, fica com a que não atravessa
   o corpo de nenhuma peça, com menos dobras e menor comprimento. Não é um "auto fio" completo:
   com muitas peças juntas ainda pode cruzar uma delas. */
function realBounds(c){/* retângulo ocupado pelo corpo da peça (a lâmpada inclui o bulbo) */
  if(c.type==='lamp'){const b=lampBulbDir(c),r=[-14,-14,14,14];
    if(b[0]>0)r[2]=30;if(b[0]<0)r[0]=-30;if(b[1]>0)r[3]=30;if(b[1]<0)r[1]=-30;
    return [c.x+r[0],c.y+r[1],c.x+r[2],c.y+r[3]]}
  const [hw,hh]=REAL_BOX[c.type];return [c.x-hw-4,c.y-hh-4,c.x+hw+4,c.y+hh+4]}
function lampBulbDir(c){if(c.pe!==false){const d=realDir(c,2);return [-d[0],-d[1]]}return c.v?[-1,0]:[0,-1]}
function segHits(p,q,r){
  if(p[1]===q[1]){const y=p[1],a=Math.min(p[0],q[0]),b=Math.max(p[0],q[0]);return y>r[1]&&y<r[3]&&b>r[0]&&a<r[2]}
  const x=p[0],a=Math.min(p[1],q[1]),b=Math.max(p[1],q[1]);return x>r[0]&&x<r[2]&&b>r[1]&&a<r[3]}
function realWirePts(comps,w){
  const cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,Math.round(v)));
  const end=t=>{const [id,k]=t.split('.'),c=comps.find(x=>x.id===id),p=terms(c)[+k],d=realDir(c,+k);
    return {c,p,s:[cl(p[0]+d[0]*12,4,336),cl(p[1]+d[1]*12,4,246)]}};
  const A=end(w.a),B=end(w.b),P=A.s,Q=B.s;
  const boxes=comps.map(realBounds);
  /* os outros bornes também são obstáculos (o fio não passa por cima de um parafuso) */
  const same=(p,q)=>p[0]===q[0]&&p[1]===q[1];
  comps.forEach(c=>terms(c).forEach(p=>{if(!same(p,A.p)&&!same(p,B.p))boxes.push([p[0]-8,p[1]-8,p[0]+8,p[1]+8])}));
  const lanesY=[(P[1]+Q[1])/2],lanesX=[(P[0]+Q[0])/2];
  [A.c,B.c].forEach(c=>{const r=realBounds(c);[12,22].forEach(g=>{lanesY.push(r[1]-g,r[3]+g);lanesX.push(r[0]-g,r[2]+g)})});
  const routes=[[P,[Q[0],P[1]],Q],[P,[P[0],Q[1]],Q]];
  lanesY.forEach(y=>{y=cl(y,4,246);routes.push([P,[P[0],y],[Q[0],y],Q])});
  lanesX.forEach(x=>{x=cl(x,4,336);routes.push([P,[x,P[1]],[x,Q[1]],Q])});
  let best=null,bs=Infinity;
  routes.forEach(rt=>{
    const pts=[A.p,...rt,B.p].filter((p,i,a)=>i===0||p[0]!==a[i-1][0]||p[1]!==a[i-1][1]);
    let len=0,hits=0,bends=0;
    for(let i=1;i<pts.length;i++){len+=Math.abs(pts[i][0]-pts[i-1][0])+Math.abs(pts[i][1]-pts[i-1][1]);
      boxes.forEach(r=>{if(segHits(pts[i-1],pts[i],r))hits++})}
    for(let i=2;i<pts.length;i++){const h1=pts[i-1][1]===pts[i-2][1],h2=pts[i][1]===pts[i-1][1];if(h1!==h2)bends++;
      else if((pts[i][0]-pts[i-1][0])*(pts[i-1][0]-pts[i-2][0])<0||(pts[i][1]-pts[i-1][1])*(pts[i-1][1]-pts[i-2][1])<0)len+=200}
    const sc=hits*1000+len+bends*18;if(sc<bs){bs=sc;best=pts}});
  /* tira pontos no meio de trechos retos */
  return best.filter((p,i,a)=>i===0||i===a.length-1||!((a[i-1][0]===p[0]&&p[0]===a[i+1][0])||(a[i-1][1]===p[1]&&p[1]===a[i+1][1])));
}
const ptsPath=pts=>'M'+pts.map(p=>p[0]+' '+p[1]).join(' L');
/* Ponto a uma distância d do início da linha, e se o trecho ali é horizontal. */
function alongPts(pts,d){
  for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],len=Math.hypot(bx-ax,by-ay);
    if(d<=len||i===pts.length-1){const t=len?Math.min(1,d/len):0;return {x:ax+(bx-ax)*t,y:ay+(by-ay)*t,h:Math.abs(bx-ax)>=Math.abs(by-ay)}}
    d-=len}
  return {x:pts[0][0],y:pts[0][1],h:true};
}
/* Anilha amarela com o número do condutor, perto de cada ponta. */
function anilhas(pts,n){
  let tot=0;for(let i=1;i<pts.length;i++)tot+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  if(tot<34)return '';
  return [alongPts(pts,11),alongPts(pts.slice().reverse(),11)].map(p=>{const w=p.h?12:9,h=p.h?9:12;
    return '<g class="anel" transform="translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')"><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="1.5"/><text y="2.4" text-anchor="middle">'+n+'</text></g>'}).join('');
}

/* ---------- Peças ---------- */
function realLeads(c){const [hw,hh]=REAL_BOX[c.type];
  return terms(c).map((p,k)=>{const [dx,dy]=realDir(c,k);const e=dx?[c.x+dx*hw,p[1]]:[p[0],c.y+dy*hh];
    return '<line class="rlead" x1="'+p[0]+'" y1="'+p[1]+'" x2="'+e[0]+'" y2="'+e[1]+'"/>'}).join('')}

function realComp(c,b,o){
  let s='';
  if(c.type==='src'){/* tomada de bancada 2P+T alimentada pela rede 220 V~ */
    s='<rect class="rbody" x="-18" y="-22" width="36" height="44" rx="5"/>'+
      '<circle cx="0" cy="-3" r="12" style="fill:#f8f9fb;stroke:#9aa3ae" stroke-width="1.5"/>'+
      '<circle cx="-5.5" cy="-5" r="2" class="furo"/><circle cx="5.5" cy="-5" r="2" class="furo"/><circle cx="0" cy="1.5" r="2" class="furo"/>'+
      '<text class="rtxt" y="17" text-anchor="middle">220 V~</text>';
  }
  if(c.type==='fuse'){/* disjuntor DIN unipolar: alavanca em cima = ligado */
    const trip=c.broken&&c.show;
    s='<rect class="rbody" x="-12" y="-19" width="24" height="38" rx="3"/>'+
      '<rect x="-12" y="-19" width="24" height="8" rx="3" class="rcap"/><rect x="-12" y="11" width="24" height="8" rx="3" class="rcap"/>'+
      '<text class="rtxt" y="-12.6" text-anchor="middle" style="font-size:5.5px">C10</text>'+
      '<rect x="-5" y="-9" width="10" height="17" rx="2" style="fill:#39424e"/>'+
      '<rect class="alav" x="-4" y="'+(trip?-0.5:-8)+'" width="8" height="7.5" rx="1.5" style="fill:'+(trip?'var(--fase)':'#2f4a6e')+'"/>'+
      '<text class="rtxt" x="9.5" y="'+(trip?6:-3)+'" text-anchor="middle" style="font-size:5px">'+(trip?'O':'I')+'</text>';
  }
  if(c.type==='sw'){/* interruptor simples de embutir: a metade apertada da tecla fica mais escura */
    const cl=c.closed;
    s='<rect class="rbody" x="-15" y="-18" width="30" height="36" rx="4" style="fill:#f4f5f7"/>'+
      '<rect x="-8" y="-12" width="16" height="24" rx="2.5" style="fill:#ffffff;stroke:#9aa3ae" stroke-width="1.5"/>'+
      '<rect x="-7" y="'+(cl?0:-11)+'" width="14" height="11" rx="2" style="fill:#d3d9e1"/>'+
      '<circle cx="0" cy="'+(cl?-6:6)+'" r="1.6" style="fill:'+(cl?'var(--terra)':'#9aa3ae')+'"/>';
    if(o.toggle)s+='<rect class="chit" data-sw="'+c.id+'" x="-19" y="-22" width="38" height="44"/>';
  }
  if(c.type==='lamp'){/* bocal com lâmpada; o bulbo aponta para o lado oposto ao PE */
    const on=b>0.04,sh=c.broken&&c.show,bd=lampBulbDir(c);
    const rot=bd[1]<0?0:bd[1]>0?180:bd[0]>0?90:-90;
    s='<g transform="rotate('+rot+')">'+
      (on?'<circle cy="-16" r="22" style="fill:var(--amber)" opacity="'+(0.15+0.4*Math.sqrt(b)).toFixed(2)+'"/>':'')+
      '<path d="M-5 -7 L-5 -10 A9.5 9.5 0 1 1 5 -10 L5 -7 Z" style="fill:'+(on?'#ffe27a':'#cfd8e3')+';fill-opacity:'+(on?(0.55+0.45*Math.sqrt(b)).toFixed(2):0.35)+';stroke:'+(sh?'var(--fase)':on?'#f4c430':'#9aa3ae')+'" stroke-width="1.6" '+(sh?'stroke-dasharray="3 2"':'')+'/>'+
      '<path d="M-3 -10 L-3 -15 L-1 -18 L1 -15 L3 -18 L3 -10" style="fill:none;stroke:'+(on?'#fff6c8':'#8a7a55')+'" stroke-width="1"/>'+
      (sh?'<path d="M-4 -22 L0 -17 L-2 -14 L3 -9" style="fill:none;stroke:var(--fase)" stroke-width="1.4"/>':'')+
      '<rect x="-8" y="-6" width="16" height="12" rx="2" style="fill:#efe9dd;stroke:#3d4652" stroke-width="2"/>'+
      '<path d="M-5 -2 H5 M-5 2 H5" style="stroke:#a99f8c" stroke-width="1"/></g>';
  }
  if(o.pickComp&&c.type!=='src')s+='<rect class="chit" data-c="'+c.id+'" x="-28" y="-26" width="56" height="52"/>';
  return realLeads(c)+'<g transform="translate('+c.x+' '+c.y+')">'+s+'</g>';
}

/* Nome impresso ao lado do borne: em cima se o borne sai de lado, ao lado se sai em cima/embaixo. */
function realBorneLab(c,k,p){const n=(BORNE[c.type]||[])[k];if(!n)return '';const [dx]=realDir(c,k);
  if(dx)return '<text class="lab bn" x="'+p[0]+'" y="'+(p[1]-9)+'" text-anchor="middle">'+n+'</text>';
  const left=c.x>250;return '<text class="lab bn" x="'+(p[0]+(left?-9:9))+'" y="'+(p[1]+3)+'" text-anchor="'+(left?'end':'start')+'">'+n+'</text>'}

const realBg=()=>'<defs><pattern id="rdots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r=".9" style="fill:var(--line)"/></pattern></defs><rect width="340" height="250" fill="url(#rdots)" pointer-events="none"/>';

/* ---------- Barra da bancada: chave Símbolo/Real e zoom ---------- */
function benchBar(zm,toggle){
  const R=vistaReal();
  return '<div class="benchbar">'+(toggle?'<div class="vista" role="group" aria-label="Vista da bancada"><button class="btn" data-vista="simb" aria-pressed="'+!R+'">📐 Símbolo</button><button class="btn" data-vista="real" aria-pressed="'+R+'">🔌 Real</button></div>':'<span></span>')+zm.ui()+'</div>';
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
    const onPart=e.target.closest&&e.target.closest('[data-t],[data-w],[data-sw],[data-mv],[data-c]');
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
