/* ---------- Carreira, atributos, plantão, conquistas ---------- */
const ATTR={
  conceito:{n:'Conceito',i:'🧠',c:'var(--neutro)'},
  montagem:{n:'Montagem',i:'🔌',c:'var(--copper)'},
  diagnostico:{n:'Diagnóstico',i:'🔍',c:'var(--amber)'},
  seguranca:{n:'Segurança',i:'🦺',c:'var(--terra)'},
  calculo:{n:'Cálculo',i:'Ω',c:'var(--fase)'}
};
const PH_ATTR={entrada:'conceito',faisca:'conceito',renovavel:'conceito',primeiro:'montagem',paralelo:'montagem',previsao:'diagnostico',defeito:'diagnostico',seguranca:'seguranca',ohm:'calculo'};
const KLASS={conceito:'Mente Teórica',montagem:'Mão na Massa',diagnostico:'Detetive de Falhas',seguranca:'Guardião da Segurança',calculo:'Calculista'};
const RANKS=[{n:'Aprendiz',xp:0},{n:'Ajudante',xp:150},{n:'Eletricista',xp:400},{n:'Eletricista Sênior',xp:800},{n:'Responsável Técnico',xp:1400}];
function rankOf(){let i=0;RANKS.forEach((r,k)=>{if(S.xp>=r.xp)i=k});const nx=RANKS[i+1];return{i,r:RANKS[i],nx,p:nx?(S.xp-RANKS[i].xp)/(nx.xp-RANKS[i].xp):1}}
function gainAttr(p,ok,st){const a=PH_ATTR[p.id]||'conceito',v=ok*3+st*4;S.attr[a]=(S.attr[a]||0)+v;return{a,v}}
function klass(){const e=Object.entries(S.attr).sort((x,y)=>y[1]-x[1]);return e.length&&e[0][1]>0?KLASS[e[0][0]]:'Ainda descobrindo'}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function playedToday(){if(!S.start)S.start=today();if(!S.days.includes(today()))S.days.push(today())}
function streak(){const set=new Set(S.days||[]);let d=new Date(),n=0;if(!set.has(today()))d.setDate(d.getDate()-1);
  for(;;){const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(!set.has(k))break;n++;d.setDate(d.getDate()-1)}return n}
const DAILY=[['fase','Conclua 1 fase'],['tres','Faça 3 estrelas em alguma fase'],['ofi','Tenha um circuito aprovado na Oficina']];
function daily(){if(!S.daily||S.daily.d!==today())S.daily={d:today(),ok:{},paid:false};return S.daily}
function markDaily(k){const d=daily();d.ok[k]=1;if(!d.paid&&DAILY.every(([x])=>d.ok[x])){d.paid=true;S.xp+=30;S.flags.plantao=(S.flags.plantao||0)+1}}
function plantaoHTML(){const d=daily(),n=DAILY.filter(([k])=>d.ok[k]).length;
  return '<div class="plantao"><div class="head"><span class="eyebrow">Plantão de hoje</span><span class="chip">'+(d.paid?'✓ +30 XP':n+'/3 · vale 30 XP')+'</span></div>'+
  DAILY.map(([k,t])=>'<div class="miss'+(d.ok[k]?' ok':'')+'"><span class="box">'+(d.ok[k]?'✓':'')+'</span><span>'+t+'</span></div>').join('')+'</div>'}
const ACH=[
  {id:'a1',e:'⚡',n:'Primeira faísca',t:()=>Object.keys(S.done).length>=1},
  {id:'a2',e:'💡',n:'Luz acesa',t:()=>Object.keys(S.done).some(k=>k.endsWith(':primeiro'))},
  {id:'a3',e:'🔍',n:'Detetive',t:()=>Object.keys(S.done).some(k=>k.endsWith(':defeito'))},
  {id:'a4',e:'⭐',n:'Três estrelas',t:()=>Object.values(S.done).some(v=>v===3)},
  {id:'a5',e:'🏠',n:'Casa acesa',t:()=>Object.keys(MODES).some(m=>CHAPTERS[0].fases.every(id=>S.done[m+':'+id]))},
  {id:'a6',e:'🎚',n:'Três níveis',t:()=>PHASES.some(p=>Object.keys(MODES).every(m=>S.done[m+':'+p.id]))},
  {id:'a7',e:'🛠',n:'Inventor',t:()=>!!S.flags.ofi},
  {id:'a8',e:'🌬',n:'Respiro',t:()=>!!S.flags.resp},
  {id:'a9',e:'📋',n:'Plantonista',t:()=>(S.flags.plantao||0)>=1},
  {id:'a10',e:'🔥',n:'3 dias seguidos',t:()=>streak()>=3},
  {id:'a11',e:'🎖',n:'Eletricista',t:()=>S.xp>=400},
  {id:'a12',e:'🃏',n:'Colecionador',t:()=>S.cards.length>=10}
];
function checkAch(){const n=[];ACH.forEach(a=>{if(!S.ach.includes(a.id)&&a.t()){S.ach.push(a.id);n.push(a)}});return n}

function showFicha(){
  setMode();const rk=rankOf(),max=Math.max(40,...Object.values(S.attr));
  const done=Object.keys(S.done).length;
  app.innerHTML=hud()+
  '<p class="big">Sua <em>ficha</em> de eletricista</p>'+
  '<div class="idcard">'+charSVG(S.char)+'<div><div class="nm">'+esc(S.name||charOf().nome)+'</div><span class="rank">🎖 '+rk.r.n+'</span><div class="klass">Perfil: '+klass()+'</div></div></div>'+
  '<div><span class="eyebrow">Plano de carreira</span><div class="ladder" style="margin-top:6px">'+RANKS.map((r,k)=>'<i class="'+(k<rk.i?'on':k===rk.i?'cur':'')+'" style="--p:'+(k===rk.i?Math.round(rk.p*100):0)+'%"></i>').join('')+'</div>'+
  '<p class="help" style="margin-top:6px">'+(rk.nx?'Faltam '+(rk.nx.xp-S.xp)+' XP para '+rk.nx.n+'.':'Topo da carreira. Parabéns!')+'</p></div>'+
  '<div class="tiles"><div class="tile"><small>Dias seguidos</small><b>🔥 '+streak()+'</b></div><div class="tile"><small>Fases feitas</small><b>'+done+'</b></div><div class="tile"><small>Cards</small><b>'+S.cards.length+'</b></div><div class="tile"><small>XP total</small><b>'+S.xp+'</b></div></div>'+
  '<span class="eyebrow">Atributos</span><div class="attrs">'+Object.entries(ATTR).map(([k,a])=>{const v=S.attr[k]||0;return '<div class="attr" style="--c:'+a.c+'"><span class="ai">'+a.i+'</span><span class="an">'+a.n+'</span><b>'+v+'</b><span class="bar"><i style="width:'+Math.round(v/max*100)+'%"></i></span></div>'}).join('')+'</div>'+
  '<div class="world"><span class="eyebrow">Conquistas</span><span class="chip">'+S.ach.length+' / '+ACH.length+'</span></div>'+
  '<div class="achs">'+ACH.map(a=>S.ach.includes(a.id)?'<div class="ach on"><span class="e">'+a.e+'</span><small>'+a.n+'</small></div>':'<div class="ach" aria-label="Conquista bloqueada"><span class="q">?</span></div>').join('')+'</div>'+
  (S.start?'<p class="help">Na bancada desde '+S.start.split('-').reverse().join('/')+'.</p>':'')+
  '<button class="btn main" id="bk">Voltar ao mapa</button>';
  bindHud();window.scrollTo(0,0);document.getElementById('bk').onclick=showMap;
}

function showBreath(done){
  setMode();let cyc=0,phase=0,timer=null;const total=3;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  app.innerHTML=hud()+'<section class="breath"><p class="big" style="text-align:center">Respira e <em>religa</em></p><p class="muted" style="text-align:center">'+(L()?'Vamos respirar juntos, bem devagar.':'Três respirações antes de voltar à bancada.')+'</p>'+
    '<div class="ring" id="ring"><b id="rt">Pronto?</b></div><p class="help" id="rc">'+total+' respirações · 4 segundos cada parte</p>'+
    '<div class="row" style="width:100%"><button class="btn ghost" id="sk">Voltar</button><button class="btn main" id="st">Começar</button></div></section>';
  bindHud();
  const ring=document.getElementById('ring'),rt=document.getElementById('rt'),rc=document.getElementById('rc');
  const step=()=>{
    if(cyc>=total){rt.textContent='Pronto!';ring.classList.remove('in');rc.textContent='Energia religada.';S.flags.resp=1;checkAch();save();
      document.getElementById('st').textContent='Continuar';document.getElementById('st').onclick=done;document.getElementById('st').disabled=false;return}
    const inhale=phase===0;rt.textContent=inhale?'Inspira':'Solta';ring.classList.toggle('in',inhale);
    if(L()&&!reduce)speak(inhale?'Inspira':'Solta');
    rc.textContent='Respiração '+(cyc+1)+' de '+total;
    phase=1-phase;if(phase===0)cyc++;timer=setTimeout(step,4000);
  };
  document.getElementById('st').onclick=()=>{document.getElementById('st').disabled=true;step()};
  document.getElementById('sk').onclick=()=>{clearTimeout(timer);done()};
}

/* ---------- Fim de fase ---------- */
function finish(p,ok,total){
  const r=ok/total,st=r>=.99?3:r>=.6?2:1;
  const key=S.mode+':'+p.id,novo=!S.cards.includes(key);
  const before=rankOf().i;
  S.done[key]=Math.max(S.done[key]||0,st);if(novo){S.cards.push(key);S.xp+=20}
  const g=gainAttr(p,ok,st);playedToday();markDaily('fase');if(st===3)markDaily('tres');
  const newAch=checkAch();save();
  const up=rankOf().i>before;
  app.innerHTML=hud()+'<section class="result"><span class="eyebrow">Fase concluída</span><h2>'+p.nome+'</h2>'+stars(st)+
  '<p class="muted">'+ok+' de '+total+' pontos'+(novo?' · +20 XP de bônus':'')+'</p>'+
  '<div class="gain"><span class="chip">'+ATTR[g.a].i+' '+ATTR[g.a].n+' +'+g.v+'</span></div>'+
  (up?'<div class="toast"><span class="e">🎖</span><span>Promoção! Agora você é <b>'+rankOf().r.n+'</b>.</span></div>':'')+
  newAch.map(a=>'<div class="toast"><span class="e">'+a.e+'</span><span>Conquista: <b>'+a.n+'</b></span></div>').join('')+
  (novo?'<span class="eyebrow">Card novo!</span>'+cardHTML(p,S.mode,'reveal'):'<p class="muted">Você já tem esse card. Busque as 3 estrelas!</p>')+
  '<div class="row" style="width:100%"><button class="btn ghost" id="again">Jogar de novo</button><button class="btn main" id="map">Mapa →</button></div></section>';
  bindHud();window.scrollTo(0,0);
  document.getElementById('again').onclick=()=>playPhase(PHASES.indexOf(p));
  document.getElementById('map').onclick=()=>afterPhase(p);
  if(L())speak('Muito bem! Fase concluída.');
}
