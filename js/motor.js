/* ================= MOTOR ELÉTRICO =================
   Fios e interruptores fechados = mesmo nó. Lâmpadas = resistores (1 Ω).
   Análise nodal resolve as tensões; brilho = potência relativa a 1 lâmpada sozinha na fonte. */
const C=(id,type,x,y,v,ex)=>Object.assign({id,type,x,y,v:!!v},ex||{});
const W=(a,b,e)=>({a,b,e});
const NAME={src:'rede',lamp:'luminária',sw:'interruptor',fuse:'disjuntor'};
function terms(c){const d=26;
  if(c.type==='src')return [[c.x,c.y-30],[c.x,c.y+30],[c.x+28,c.y]];
  const t=c.v?[[c.x,c.y-d],[c.x,c.y+d]]:[[c.x-d,c.y],[c.x+d,c.y]];
  if(c.type==='lamp'&&c.pe!==false)t.push(c.v?[c.x+(c.x>250?24:-24),c.y]:[c.x,c.y+(c.y>200?-24:24)]);
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
function board(st,o){
  o=o||{};const r=o.res||solve(st.comps,st.wires);
  const anyLit=Object.values(r.lamp).some(b=>b>0.04);
  let s='<svg viewBox="0 0 340 250" class="'+(r.short?'short':anyLit?'on':'')+(o.cls?' '+o.cls:'')+'" role="img" aria-label="Bancada de circuito">';
  st.wires.forEach((w,i)=>{const d=wirePath(st.comps,w);s+='<path class="w '+(w.cor||'cobre')+'" d="'+d+'"/>'+(w.cor==='terra'?'<path class="w2" d="'+d+'"/>':'');if(o.pickWire)s+='<path class="hit" data-w="'+i+'" d="'+d+'"/>'});
  st.comps.forEach(c=>{if(c.type==='lamp'&&c.pe!==false){const tp=terms(c)[2],dx=Math.sign(tp[0]-c.x),dy=Math.sign(tp[1]-c.y);s+='<line x1="'+(c.x+dx*14)+'" y1="'+(c.y+dy*14)+'" x2="'+tp[0]+'" y2="'+tp[1]+'" style="stroke:var(--terra)" stroke-width="2.5" stroke-dasharray="3 2"/>'}});
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
function entrada(){
  const t=L()?['Poste','Medidor','Quadro','Circuito']:['Trafo 13,8 kV→220 V','Medidor kWh','Quadro + DJ','220 V~ · 60 Hz'];
  return '<div class="entrada" aria-label="Caminho da energia: '+t.join(', ')+'"><svg viewBox="0 0 340 58" aria-hidden="true">'+
   '<path d="M40 30 H300" style="stroke:var(--fase)" stroke-width="3" stroke-dasharray="6 5"/>'+
   '<g transform="translate(40 26)"><rect x="-3" y="-20" width="6" height="40" style="fill:var(--muted)"/><circle cx="-6" cy="-2" r="9" style="fill:none;stroke:var(--amber)" stroke-width="2.5"/><circle cx="6" cy="-2" r="9" style="fill:none;stroke:var(--amber)" stroke-width="2.5"/></g>'+
   '<g transform="translate(125 28)"><rect x="-15" y="-16" width="30" height="32" rx="4" style="fill:var(--panel2);stroke:var(--ink)" stroke-width="2"/><rect x="-10" y="-11" width="20" height="9" rx="1" style="fill:var(--lcd)"/><text y="11" text-anchor="middle" style="fill:var(--ink);font:900 8px var(--body)">kWh</text></g>'+
   '<g transform="translate(210 28)"><rect x="-15" y="-16" width="30" height="32" rx="3" style="fill:#e9edf3;stroke:var(--ink)" stroke-width="2"/><rect x="-9" y="-10" width="5" height="14" style="fill:#2f4a6e"/><rect x="-2" y="-10" width="5" height="14" style="fill:#2f4a6e"/><rect x="5" y="-10" width="5" height="14" style="fill:var(--terra)"/></g>'+
   '<g transform="translate(298 28)"><circle r="13" style="fill:var(--amber)" opacity=".85"/><path d="M-6 -6 L6 6 M6 -6 L-6 6" style="stroke:#3a2a00" stroke-width="2.5"/></g>'+
   [[6,'start'],[125,'middle'],[210,'middle'],[336,'end']].map(([x,an],i)=>'<text x="'+x+'" y="56" text-anchor="'+an+'" class="lab" style="font-size:'+(L()?10:8.5)+'px">'+t[i]+'</text>').join('')+
   '</svg></div>'}
function statusChips(st,r){
  if(r.short)return '<div class="status"><span class="chip sc">⚡ Curto-circuito!</span></div>';
  return '<div class="status">'+st.comps.filter(c=>c.type==='lamp').map(c=>{const b=r.lamp[c.id];return '<span class="chip'+(b>0.04?' lit':'')+'">'+c.id+': '+(L()?bright(b):bright(b)+(b>0.04?' · '+Math.round(b*100)+'%':''))+'</span>'}).join('')+'</div>';
}
function svgPoint(svg,ev){const p=svg.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}

