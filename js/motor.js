/* ================= MOTOR ELÉTRICO =================
   Fios e interruptores fechados = mesmo nó. Lâmpadas = resistores (1 Ω).
   Análise nodal resolve as tensões; brilho = potência relativa a 1 lâmpada sozinha na fonte. */
const C=(id,type,x,y,v,ex)=>Object.assign({id,type,x,y,v:!!v},ex||{});
const W=(a,b,e)=>({a,b,e});
const NAME={src:'rede',lamp:'luminária',sw:'interruptor',fuse:'disjuntor'};
/* Posição dos bornes. Na vista real (GEOM_REAL, ligada por board()) cada peça tem os bornes onde o
   equipamento tem (js/bancada-real.js). O cálculo só usa o número do borne, então é o mesmo nas duas vistas.
   A lâmpada é bocal com 2 bornes (X1/X2), sem PE; só uma luminária com pe:true teria o 3º borne. */
let GEOM_REAL=false;
function terms(c){const d=26;
  if(GEOM_REAL&&typeof realTerms==='function')return realTerms(c).map(t=>t.p);
  if(c.type==='src')return [[c.x,c.y-30],[c.x,c.y+30],[c.x+28,c.y]];
  const t=c.v?[[c.x,c.y-d],[c.x,c.y+d]]:[[c.x-d,c.y],[c.x+d,c.y]];
  if(c.type==='lamp'&&c.pe===true)t.push(c.v?[c.x+(c.x>250?24:-24),c.y]:[c.x,c.y+(c.y>200?-24:24)]);
  return t}
function tpos(comps,t){const [id,k]=t.split('.');const c=comps.find(x=>x.id===id);return terms(c)[+k]}
function UF(){const p={};const find=x=>{if(p[x]===undefined)p[x]=x;while(p[x]!==x){p[x]=p[p[x]];x=p[x]}return x};return{find,union:(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb)p[ra]=rb}}}
function solve(comps,wires){
  const u=UF();
  comps.forEach(c=>{terms(c).forEach((_,k)=>u.find(c.id+'.'+k));
    if((c.type==='sw'&&c.closed&&!c.broken)||(c.type==='fuse'&&!c.broken))u.union(c.id+'.0',c.id+'.1')});
  wires.forEach(w=>{if(!w.broken)u.union(w.a,w.b)});
  const src=comps.find(c=>c.type==='src'),V=src.V||220;
  const P=u.find(src.id+'.0'),N=u.find(src.id+'.1'),PE=u.find(src.id+'.2');
  const out={V,short:P===N||P===PE,lamp:{},P,N,PE,net:t=>u.find(t)};
  if(out.short){comps.forEach(c=>{if(c.type==='lamp')out.lamp[c.id]=0});out.vAt=()=>0;return out}
  const known=n=>n===P?V:(n===N||n===PE)?0:null;
  const nets=[...new Set(comps.flatMap(c=>[u.find(c.id+'.0'),u.find(c.id+'.1')]))].filter(n=>known(n)===null);
  const idx={};nets.forEach((n,i)=>idx[n]=i);const m=nets.length;
  const G=Array.from({length:m},(_,i)=>{const r=Array(m+1).fill(0);r[i]=1e-9;return r});
  comps.filter(c=>c.type==='lamp'&&!c.broken).forEach(l=>{
    const a=u.find(l.id+'.0'),b=u.find(l.id+'.1'),g=1/(l.R||1);
    [[a,b],[b,a]].forEach(([x,y])=>{if(known(x)!==null)return;const i=idx[x];G[i][i]+=g;if(known(y)!==null)G[i][m]+=g*known(y);else G[i][idx[y]]-=g})});
  for(let c=0;c<m;c++){let p=c;for(let r=c+1;r<m;r++)if(Math.abs(G[r][c])>Math.abs(G[p][c]))p=r;[G[c],G[p]]=[G[p],G[c]];const d=G[c][c];if(Math.abs(d)<1e-15)continue;for(let r=0;r<m;r++){if(r===c)continue;const k=G[r][c]/d;if(k)for(let j=c;j<=m;j++)G[r][j]-=k*G[c][j]}}
  const vn=n=>{const k=known(n);if(k!==null)return k;const i=idx[n];if(i===undefined)return 0;return G[i][i]?G[i][m]/G[i][i]:0};
  out.vAt=t=>vn(u.find(t));
  comps.filter(c=>c.type==='lamp').forEach(l=>{if(l.broken){out.lamp[l.id]=0;return}const dv=out.vAt(l.id+'.0')-out.vAt(l.id+'.1');out.lamp[l.id]=Math.min(1,dv*dv/(l.R||1)/(V*V))});
  return out;
}
function sim(st,sws,mods){return solve(st.comps.map(c=>Object.assign({},c,sws&&(c.id in sws)?{closed:!!sws[c.id]}:{},mods&&mods[c.id]||{})),st.wires)}
const lit=(r,id)=>r.lamp[id]>0.04;
function bright(b){return b<=0.04?'apagada':b>=0.9?'forte':b>=0.2?'média':'fraca'}

/* ---------- Desenho da bancada ---------- */
function wirePath(comps,w){const [x1,y1]=tpos(comps,w.a),[x2,y2]=tpos(comps,w.b);
  if(w.e==='h')return 'M'+x1+' '+y1+' H'+x2+' V'+y2; if(w.e==='v')return 'M'+x1+' '+y1+' V'+y2+' H'+x2;
  return 'M'+x1+' '+y1+' L'+x2+' '+y2}
function compSVG(c,b,o){
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
  let s='<svg viewBox="'+(o.vb||'0 0 340 250')+'" class="'+(r.short?'short':anyLit?'on':'')+(R?' real-v':'')+(o.cls?' '+o.cls:'')+'" role="img" aria-label="Bancada de circuito'+(R?' em vista real':'')+'">';
  if(R)return s+realBoard(st,o,r)+'</svg>';
  if(typeof SW_FLIP!=='undefined')SW_FLIP=null;
  st.wires.forEach((w,i)=>{const d=wirePath(st.comps,w);
    s+='<path class="w '+(w.cor||'cobre')+'" d="'+d+'"/>'+(w.cor==='terra'?'<path class="w2" d="'+d+'"/>':'');if(o.pickWire)s+='<path class="hit" data-w="'+i+'" d="'+d+'"/>'});
  st.comps.forEach(c=>{if(c.type==='lamp'&&c.pe===true){const tp=terms(c)[2],dx=Math.sign(tp[0]-c.x),dy=Math.sign(tp[1]-c.y);s+='<line x1="'+(c.x+dx*14)+'" y1="'+(c.y+dy*14)+'" x2="'+tp[0]+'" y2="'+tp[1]+'" style="stroke:var(--terra)" stroke-width="2.5" stroke-dasharray="3 2"/>'}});
  st.comps.forEach(c=>{s+=compSVG(c,r.lamp[c.id]||0,o);
    if(o.move)s+=(o.selC===c.id?'<rect class="selc" x="'+(c.x-32)+'" y="'+(c.y-32)+'" width="64" height="64" rx="10"/>':'')+'<rect class="mvhit" data-mv="'+c.id+'" x="'+(c.x-(c.v?18:16))+'" y="'+(c.y-(c.v?16:18))+'" width="'+(c.v?36:32)+'" height="'+(c.v?32:36)+'"/>'});
  st.comps.forEach(c=>{
    const lab=c.lab||c.id;
    if(c.type==='src'){const t=terms(c);s+='<text class="lab" x="'+(t[0][0]+12)+'" y="'+(t[0][1]+4)+'" style="fill:var(--fase)">F</text><text class="lab" x="'+(t[1][0]+12)+'" y="'+(t[1][1]+4)+'" style="fill:var(--neutro)">N</text><text class="lab" x="'+(t[2][0]-2)+'" y="'+(t[2][1]+20)+'" style="fill:var(--terra)">PE</text>';return}
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
  return '<div class="status">'+st.comps.filter(c=>c.type==='lamp').map(c=>{const b=r.lamp[c.id];return '<span class="chip'+(b>0.04?' lit':'')+'">'+c.id+': '+(L()?bright(b):bright(b)+(b>0.04?' · '+Math.round(b*100)+'%':''))+'</span>'}).join('')+'</div>';
}
function svgPoint(svg,ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}

