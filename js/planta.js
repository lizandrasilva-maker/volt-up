/* ================= PLANTA DE FIAÇÃO (unifilar em planta) =================
   O "projeto" que a Eng.ª Lia entrega nas fases do Cap. 2. Segue a convenção de projeto elétrico
   predial usada no ensino e no mercado:
   - ponto de luz: círculo duplo com nº do circuito, letra do comando e potência ("1 / a / 24W");
   - interruptores junto à parede com o tipo (S simples, S3w paralelo, S4w intermediário) e o comando;
   - eletroduto: linha laranja (curva = teto), com um tracinho por condutor, nº do circuito em cima
     e seção embaixo; terra em forma de "T";
   - cores dos tracinhos iguais às da bancada (fase vermelha, neutro azul-claro, terra verde); o retorno,
     que na bancada é branco, fica cinza para aparecer no papel.
   Símbolos simplificados para o jogo: a professora deve conferir com a NBR 5444 / padrão da escola. */

const COND={f:{cor:'var(--fase)',n:'fase'},n:{cor:'var(--neutro)',n:'neutro'},r:{cor:'#7d8794',n:'retorno'},t:{cor:'var(--terra)',n:'terra'}};

/* Traço de cada condutor, como na NBR 5444 (tabela 2, 5.6 a 5.9): a FORMA identifica o condutor
   (a cor é só uma ajuda a mais). (nx,ny) = normal ao duto, (tx,ty) = direção do duto.
   fase: cruza o duto · neutro: cruza, com gancho na ponta · retorno: meio traço · terra: meio traço com "T". */
function plantaTraco(c,qx,qy,nx,ny,tx,ty){
  const h=5.5,g=2.8,ln=(x1,y1,x2,y2)=>'<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" class="ptick" style="stroke:'+COND[c].cor+'"/>';
  const topo=[qx+nx*h,qy+ny*h];
  if(c==='f')return ln(qx-nx*h,qy-ny*h,topo[0],topo[1]);
  if(c==='n')return ln(qx-nx*h,qy-ny*h,topo[0],topo[1])+ln(topo[0],topo[1],topo[0]-tx*g,topo[1]-ty*g);
  if(c==='r')return ln(qx,qy,topo[0],topo[1]);
  return ln(qx,qy,topo[0],topo[1])+ln(topo[0]-tx*g,topo[1]-ty*g,topo[0]+tx*g,topo[1]+ty*g);
}
/* Símbolos de comando para a planta (NBR 5444, tabela 4). FC não existe na norma: quadrado com "FC". */
function plantaCmdSym(tipo,x,y){
  const r=4.5,c='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="pcmdsym"/>';
  if(tipo==='S3w')return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="pcmdsym cheio"/>';
  if(tipo==='S4w')return c+'<path d="M'+x+' '+(y-r)+' a'+r+' '+r+' 0 0 0 0 '+(2*r)+'z" class="pcmdmeio"/>';
  if(tipo==='P')return c+'<circle cx="'+x+'" cy="'+y+'" r="1.4" class="pcmdmeio"/>';
  if(tipo==='FC')return '<rect x="'+(x-5)+'" y="'+(y-5)+'" width="10" height="10" rx="2" class="pcmdsym"/><text class="ptx pfc" x="'+x+'" y="'+(y+2.4)+'" text-anchor="middle">FC</text>';
  return c;
}
/* eletroduto de a até b; curva = no teto. Os tracinhos ficam no meio, perpendiculares ao duto. */
function plantaDuto(d){
  const [x1,y1]=d.a,[x2,y2]=d.b,mx=(x1+x2)/2,my=(y1+y2)/2,L=Math.hypot(x2-x1,y2-y1)||1,nx=-(y2-y1)/L,ny=(x2-x1)/L;
  const k=d.curva===false?0:L*0.18*(d.lado||1),cx=mx+nx*k,cy=my+ny*k;
  let s='<path d="M'+x1+' '+y1+' Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+x2+' '+y2+'" class="pduto'+(d.curva===false?' parede':'')+'"/>';
  /* ponto e direção no meio da curva (t = 0,5) */
  const px=0.25*x1+0.5*cx+0.25*x2,py=0.25*y1+0.5*cy+0.25*y2,tx=(x2-x1)/L,ty=(y2-y1)/L;
  const n=d.cond.length;
  d.cond.forEach((c,i)=>{const o=(i-(n-1)/2)*5.6;s+=plantaTraco(c,px+tx*o,py+ty*o,nx,ny,tx,ty)});
  /* circuito em cima, seção embaixo (do lado de fora da curva) */
  const sx=nx*(k>=0?-1:1),sy=ny*(k>=0?-1:1);
  s+='<text class="ptx pcirc" x="'+(px+sx*11).toFixed(1)+'" y="'+(py+sy*11+3).toFixed(1)+'" text-anchor="middle">'+(d.circ||'1')+'</text>'+
     '<text class="ptx psec" x="'+(px-sx*11).toFixed(1)+'" y="'+(py-sy*11+3).toFixed(1)+'" text-anchor="middle">'+(d.sec||'1.5')+'</text>';
  /* diâmetro do eletroduto a 1/4 do caminho, longe dos tracinhos */
  if(d.diam){const qx=0.5625*x1+0.375*cx+0.0625*x2,qy=0.5625*y1+0.375*cy+0.0625*y2;s+='<text class="ptx pdiam" x="'+(qx+sx*8).toFixed(1)+'" y="'+(qy+sy*8+3).toFixed(1)+'" text-anchor="middle">ø'+d.diam+'</text>'}
  return s;
}
function plantaSVG(p){
  let s='<svg viewBox="0 0 340 '+(p.h||200)+'" class="plantasvg" role="img" aria-label="Planta de fiação: '+p.titulo+'">';
  /* cômodos */
  (p.salas||[]).forEach(r=>{s+='<rect x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" class="psala"/>'+
    '<text class="ptx pnome" x="'+(r.x+5)+'" y="'+(r.y+11)+'">'+r.nome+'</text>'+(r.area?'<text class="ptx parea" x="'+(r.x+5)+'" y="'+(r.y+19)+'">'+r.area+' m²</text>':'')});
  (p.portas||[]).forEach(([x,y,w,vert])=>{s+=vert?'<path d="M'+x+' '+y+' v'+w+'" class="pporta"/><path d="M'+x+' '+y+' a'+w+' '+w+' 0 0 1 '+w+' '+w+'" class="parco"/>'
    :'<path d="M'+x+' '+y+' h'+w+'" class="pporta"/><path d="M'+x+' '+y+' a'+w+' '+w+' 0 0 0 '+w+' '+(-w)+'" class="parco"/>'});
  (p.dutos||[]).forEach(d=>{s+=plantaDuto(d)});
  /* quadro */
  if(p.qd){const q=p.qd;s+='<rect x="'+(q.x-9)+'" y="'+(q.y-5)+'" width="18" height="10" class="pqd"/><path d="M'+(q.x-9)+' '+(q.y+5)+' l10 -10 M'+(q.x-3)+' '+(q.y+5)+' l10 -10 M'+(q.x+3)+' '+(q.y+5)+' l6 -6" class="pqdh"/>'+
    '<text class="ptx pid" x="'+q.x+'" y="'+(q.y-8)+'" text-anchor="middle">'+(q.nome||'QD')+'</text>'}
  /* pontos de luz */
  /* NBR 5444 8.1: um círculo (o duplo é luminária embutida); -circuito- à esquerda, letra de comando
     no alto à direita, potência embaixo à direita. Ponto de luz maior que o interruptor. */
  (p.luz||[]).forEach(l=>{s+='<circle cx="'+l.x+'" cy="'+l.y+'" r="8" class="pluz"/>'+
    '<text class="ptx pcirc" x="'+(l.x+(l.cp||[-10])[0])+'" y="'+(l.y+(l.cp||[0,3])[1])+'" text-anchor="'+((l.cp||[])[2]||'end')+'">-'+l.circ+'-</text><text class="ptx pcmd" x="'+(l.x+8)+'" y="'+(l.y-7)+'">'+l.cmd+'</text><text class="ptx ppot" x="'+(l.x+9)+'" y="'+(l.y+12)+'">'+l.pot+'</text>'});
  /* interruptores, pulsadores, fotocélula: símbolo + letra do ponto comandado + identificação */
  (p.cmds||[]).forEach(c=>{
    s+=plantaCmdSym(c.tipo,c.x,c.y)+
      '<text class="ptx ptipo" x="'+(c.x+(c.dx||8))+'" y="'+(c.y+(c.dy||-3))+'" text-anchor="'+((c.dx||8)<0?'end':'start')+'">'+(c.cmd||'')+'</text>'+
      (c.nome?'<text class="ptx pid" x="'+(c.x+(c.dx||8))+'" y="'+(c.y+(c.dy||-3)+8)+'" text-anchor="'+((c.dx||8)<0?'end':'start')+'">'+c.nome+'</text>':'')});
  return s+'</svg>';
}
function plantaHTML(p){
  return '<div class="planta"><div class="planta-h"><b>📄 '+p.titulo+'</b><span>Eng.ª Lia · escala livre</span></div>'+plantaSVG(p)+
    '<div class="planta-leg">'+['f','n','r','t'].map(k=>'<span><svg viewBox="-9 -8 18 14" class="pleg">'+'<line x1="-9" y1="0" x2="9" y2="0" class="pduto"/>'+plantaTraco(k,0,0,0,-1,1,0)+'</svg>'+COND[k].n+'</span>').join('')+
    '<span>nº de um lado = circuito · do outro = seção (mm²)</span>'+
    [['S','simples'],['S3w','paralelo'],['S4w','intermediário'],['P','pulsador'],['FC','fotocélula']].map(([t,n])=>'<span><svg viewBox="-7 -7 14 14" class="pleg">'+plantaCmdSym(t,0,0)+'</svg>'+n+'</span>').join('')+
    '</div>'+
    (p.nota?'<p class="help">'+p.nota+'</p>':'')+'</div>';
}

/* ---------- Plantas das fases do Cap. 2 ---------- */
const PLANTAS={
  escada:{titulo:'Escada · Condomínio Mandacaru',h:190,
    salas:[{x:60,y:20,w:220,h:150,nome:'ESCADA',area:'9,6'},{x:8,y:70,w:52,h:60,nome:'HALL'}],
    portas:[[60,140,20,true]],qd:{x:30,y:104,nome:'QD'},
    luz:[{x:170,y:95,circ:'1',cmd:'a',pot:'24W',cp:[-7,-9]}],
    cmds:[{x:72,y:150,tipo:'S3w',cmd:'a',nome:'SP1 (térreo)',dx:9,dy:-6},{x:268,y:32,tipo:'S3w',cmd:'a',nome:'SP2 (1º andar)',dx:-9,dy:12}],
    dutos:[{a:[39,104],b:[161,97],cond:['f','n'],diam:'3/4"'},{a:[164,102],b:[76,146],cond:['f','r','r'],lado:-1},{a:[178,90],b:[264,35],cond:['r','r','r']}],
    nota:'A fase desce no comum do SP1; dois retornos ligam SP1 e SP2; o retorno do comum do SP2 volta à lâmpada.'},
  corredor:{titulo:'Corredor · Condomínio Mandacaru',h:180,
    salas:[{x:20,y:60,w:300,h:80,nome:'CORREDOR',area:'18,0'},{x:20,y:10,w:70,h:50,nome:'HALL'}],
    portas:[[20,100,22,true],[300,100,20,true],[160,140,20,false]],qd:{x:55,y:28,nome:'QD'},
    luz:[{x:170,y:92,circ:'1',cmd:'a',pot:'24W',cp:[-9,17]}],
    cmds:[{x:30,y:128,tipo:'S3w',cmd:'a',nome:'SP1',dx:8,dy:-4},{x:184,y:136,tipo:'S4w',cmd:'a',nome:'SI',dx:8,dy:-6},{x:310,y:128,tipo:'S3w',cmd:'a',nome:'SP2',dx:-8,dy:-4}],
    dutos:[{a:[64,30],b:[162,88],cond:['f','n'],diam:'3/4"'},{a:[162,97],b:[34,124],cond:['f','r','r']},{a:[172,101],b:[183,131],cond:['r','r','r','r'],curva:false},{a:[178,96],b:[306,124],cond:['r','r','r'],lado:-1}],
    nota:'Paralelos nas pontas e o intermediário no meio: entre eles passam só retornos (4 no duto do SI).'},
  garagem:{titulo:'Garagem · Condomínio Mandacaru',h:180,
    salas:[{x:30,y:15,w:280,h:150,nome:'GARAGEM',area:'42,0'}],portas:[[130,165,60,false]],qd:{x:48,y:150,nome:'QD'},
    luz:[{x:170,y:85,circ:'2',cmd:'f',pot:'24W'}],
    cmds:[{x:298,y:30,tipo:'FC',cmd:'f',nome:'fotocélula (fachada)',dx:-9,dy:4}],
    dutos:[{a:[56,146],b:[162,90],cond:['f','n'],circ:'2',diam:'3/4"'},{a:[178,80],b:[292,34],cond:['f','n','r'],circ:'2'}],
    nota:'A fotocélula recebe fase e neutro e devolve o retorno (carga) para o ponto de luz.'},
  impulso:{titulo:'Hall de entrada · Condomínio Mandacaru',h:180,
    salas:[{x:40,y:15,w:260,h:150,nome:'HALL',area:'21,5'}],portas:[[40,40,22,true],[300,120,22,true]],qd:{x:62,y:150,nome:'QD (relé de impulso)'},
    luz:[{x:170,y:85,circ:'3',cmd:'i',pot:'24W',cp:[0,20,'middle']}],
    cmds:[{x:52,y:72,tipo:'P',cmd:'i',nome:'P1 (entrada)',dx:8,dy:-4},{x:288,y:110,tipo:'P',cmd:'i',nome:'P2 (escada)',dx:-8,dy:-6}],
    dutos:[{a:[70,146],b:[162,90],cond:['f','n','r','r'],circ:'3',diam:'3/4"'},{a:[162,80],b:[57,72],cond:['f','r'],circ:'3',lado:-1},{a:[178,88],b:[284,108],cond:['f','r'],circ:'3'}],
    nota:'O relé fica no quadro. Do quadro ao ponto de luz sobem fase, neutro, o retorno da lâmpada (contato do relé) e o retorno da bobina; da caixa do ponto descem fase e retorno para cada pulsador.'}
};
