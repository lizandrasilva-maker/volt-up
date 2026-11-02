const STORE='neuro-eletricista-v2';
const FRESH=()=>({mode:null,char:null,name:'',xp:0,cards:[],done:{},seen:{},chap:'cap1',sandbox:null,attr:{},days:[],daily:null,ach:[],flags:{},start:null});
let S=FRESH();
try{const r=localStorage.getItem(STORE)||localStorage.getItem('neuro-eletricista-v1');if(r){const o=JSON.parse(r);S=Object.assign(S,o);if(!localStorage.getItem(STORE)){S.cards=[];S.done={}}}}catch(e){}
ensure();
function ensure(){const f=FRESH();for(const k in f)if(S[k]===undefined||S[k]===null&&f[k]!==null)S[k]=f[k]}
function save(){try{localStorage.setItem(STORE,JSON.stringify(S))}catch(e){}}
const app=document.getElementById('app');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const L=()=>S.mode==='leve';

const MODES={
  leve:{nome:'Leve',sub:'Frases curtas, sem pressa, pode tentar de novo. Mas faz pensar!',c:'var(--terra)',fio:'Terra'},
  moderado:{nome:'Técnico',sub:'Com os termos da área e cálculos simples.',c:'var(--neutro)',fio:'Neutro'},
  full:{nome:'Profissional',sub:'Normas, cálculos e diagnóstico de campo.',c:'var(--fase)',fio:'Fase'}
};
const CHARS=[{id:'aprendiz',nome:'Ana',estilo:'Eletricista'},{id:'eletricista',nome:'Léo',estilo:'Eletricista'},{id:'calango',nome:'Calango Faísca',estilo:'Mascote'},{id:'anime',nome:'Raio',estilo:'Anime'},{id:'avatar',nome:'Bia',estilo:'Avatar'},{id:'3d',nome:'Orbi',estilo:'3D'},{id:'animal',nome:'Gato Volt',estilo:'Animal'},{id:'tecnico',nome:'Téc. Lu',estilo:'Técnico'}];
function charSVG(id){
  if((id==='aprendiz'||id==='eletricista'||id==='calango')&&typeof IMG!=='undefined'&&IMG[id])return picSVG(IMG[id]);
  const s={
  anime:'<circle cx="50" cy="50" r="46" fill="#2a3f63"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#1d2b44"/><path d="M38 80 L50 92 L62 80" fill="#f4c430"/><rect x="44" y="70" width="12" height="10" fill="#e8bfa2"/><path d="M30 46 Q30 72 42 79 Q50 83 58 79 Q70 72 70 46Z" fill="#f7d6bd"/><path d="M22 58 L24 34 L16 28 L30 26 L30 14 L42 22 L50 8 L57 22 L70 12 L70 26 L84 28 L76 36 L78 58 L70 44 L64 50 L60 40 L52 48 L48 38 L40 48 L36 40 L30 50Z" fill="#4c5be0"/><path d="M42 22 L50 8 L52 20 M57 22 L70 12 L66 24" fill="#7d89ff"/><path d="M34 54 Q39 51.5 45 53 M55 53 Q61 51.5 66 54" stroke="#2b2f7a" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="61" rx="5.8" ry="6.8" fill="#fff"/><ellipse cx="40" cy="61.6" rx="4.6" ry="6.2" fill="#3f6fd8"/><ellipse cx="40" cy="62" rx="2.3" ry="4.0" fill="#0c0a1a"/><circle cx="38.3" cy="57.94" r="1.8" fill="#fff"/><circle cx="41.8" cy="63.72" r=".9" fill="#fff"/><path d="M33.4 54.800000000000004 Q40 51.400000000000006 46.9 55.6" stroke="#141030" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="61" rx="5.8" ry="6.8" fill="#fff"/><ellipse cx="60" cy="61.6" rx="4.6" ry="6.2" fill="#3f6fd8"/><ellipse cx="60" cy="62" rx="2.3" ry="4.0" fill="#0c0a1a"/><circle cx="58.3" cy="57.94" r="1.8" fill="#fff"/><circle cx="61.8" cy="63.72" r=".9" fill="#fff"/><path d="M53.4 54.800000000000004 Q60 51.400000000000006 66.9 55.6" stroke="#141030" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="33" cy="70" rx="3.5" ry="2" fill="#f19b9b" opacity=".6"/><ellipse cx="67" cy="70" rx="3.5" ry="2" fill="#f19b9b" opacity=".6"/><path d="M50 67 L49 70" stroke="#d29a80" stroke-width="1.2" stroke-linecap="round"/><path d="M45 74 Q50 78 55 74" stroke="#a5454a" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  avatar:'<circle cx="50" cy="50" r="46" fill="#3a5a40"/><rect x="26" y="30" width="48" height="50" rx="22" fill="#b97a56"/><path d="M24 48 Q24 22 50 22 Q76 22 76 48 L70 40 Q50 30 30 40Z" fill="#2b1d16"/><circle cx="41" cy="54" r="3.5" fill="#22160f"/><circle cx="59" cy="54" r="3.5" fill="#22160f"/><path d="M42 66 Q50 72 58 66" stroke="#22160f" stroke-width="3" fill="none" stroke-linecap="round"/>',
  '3d':'<defs><radialGradient id="g3d" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#f4c430"/><stop offset="1" stop-color="#9a6a10"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="#22324d"/><ellipse cx="50" cy="86" rx="20" ry="3.5" fill="#000" opacity=".3"/><circle cx="50" cy="54" r="30" fill="url(#g3d)"/><ellipse cx="41" cy="52" rx="5" ry="7" fill="#1b1b2a"/><ellipse cx="59" cy="52" rx="5" ry="7" fill="#1b1b2a"/><circle cx="43" cy="49" r="1.8" fill="#fff"/><circle cx="61" cy="49" r="1.8" fill="#fff"/><path d="M43 66 Q50 71 57 66" stroke="#1b1b2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  animal:'<circle cx="50" cy="50" r="46" fill="#4a3358"/><path d="M24 44 L28 18 L44 34Z M76 44 L72 18 L56 34Z" fill="#e8913a"/><path d="M29 24 L31 36 L39 33Z M71 24 L69 36 L61 33Z" fill="#f6c9a0"/><circle cx="50" cy="56" r="28" fill="#e8913a"/><ellipse cx="50" cy="67" rx="12" ry="9" fill="#fbe3cc"/><ellipse cx="40" cy="54" rx="4" ry="6" fill="#1d2440"/><ellipse cx="60" cy="54" rx="4" ry="6" fill="#1d2440"/><path d="M47 63 L53 63 L50 67Z" fill="#c0505a"/><path d="M30 64 L18 61 M30 68 L18 70 M70 64 L82 61 M70 68 L82 70" stroke="#fbe3cc" stroke-width="1.6"/><path d="M52 31 L45 42 L50 42 L47 50 L56 38 L51 38 L54 31Z" fill="#f4c430"/>',
  tecnico:'<circle cx="50" cy="50" r="46" fill="#1e3a5f"/><circle cx="50" cy="60" r="26" fill="#d9a07c"/><path d="M22 50 Q22 22 50 22 Q78 22 78 50Z" fill="#f4c430"/><rect x="16" y="47" width="68" height="7" rx="3.5" fill="#d8a91f"/><rect x="47" y="24" width="6" height="22" rx="3" fill="#ffe27a"/><rect x="30" y="58" width="40" height="11" rx="5.5" fill="#6bb9e8" opacity=".8" stroke="#2b3d55" stroke-width="2"/><path d="M42 77 Q50 82 58 77" stroke="#5a3424" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
  };
  return '<svg viewBox="0 0 100 100" aria-hidden="true">'+(s[id]||s.tecnico)+'</svg>';
}
const ICONS={
  lampada:'<path d="M30 6 a16 16 0 0 1 10 29 v7 h-20 v-7 a16 16 0 0 1 10 -29z" fill="#f4c430" stroke="#eef2f7" stroke-width="2.5"/><rect x="21" y="44" width="18" height="5" rx="1.5" fill="#93a6bf"/><rect x="23" y="50" width="14" height="4" rx="1.5" fill="#93a6bf"/>',
  interruptor:'<circle cx="14" cy="38" r="4" fill="#eef2f7"/><circle cx="46" cy="38" r="4" fill="#eef2f7"/><line x1="14" y1="38" x2="42" y2="22" stroke="#d9894a" stroke-width="4" stroke-linecap="round"/><line x1="3" y1="38" x2="10" y2="38" stroke="#d9894a" stroke-width="3"/><line x1="50" y1="38" x2="57" y2="38" stroke="#d9894a" stroke-width="3"/>',
  previsao:'<circle cx="30" cy="30" r="20" fill="none" stroke="#6bb9e8" stroke-width="4"/><text x="30" y="40" font-size="28" font-weight="900" fill="#f4c430" text-anchor="middle" font-family="Nunito,sans-serif">?</text>',
  paralelo:'<g stroke="#d9894a" stroke-width="3" fill="none"><path d="M8 14 H52 M8 46 H52 M8 14 V46"/></g><circle cx="26" cy="30" r="8" fill="#f4c430"/><circle cx="46" cy="30" r="8" fill="#f4c430"/><path d="M26 22 V14 M26 38 V46 M46 22 V14 M46 38 V46" stroke="#d9894a" stroke-width="3"/>',
  multimetro:'<rect x="14" y="6" width="32" height="48" rx="6" fill="#f2b72e"/><rect x="19" y="11" width="22" height="12" rx="2" fill="#c6d68a"/><circle cx="30" cy="36" r="7" fill="#2a2f36"/><line x1="30" y1="36" x2="34" y2="31" stroke="#eef2f7" stroke-width="2"/>',
  disjuntor:'<rect x="14" y="6" width="32" height="48" rx="5" fill="#e9edf3"/><rect x="24" y="14" width="12" height="20" rx="3" fill="#2f4a6e"/><rect x="26" y="16" width="8" height="8" rx="2" fill="#e24c3f"/><text x="30" y="48" font-size="9" font-weight="900" fill="#2f4a6e" text-anchor="middle" font-family="Nunito,sans-serif">C10</text>',
  sol:'<circle cx="30" cy="30" r="11" fill="#f4c430"/><g stroke="#f4c430" stroke-width="3" stroke-linecap="round"><line x1="30" y1="5" x2="30" y2="12"/><line x1="30" y1="48" x2="30" y2="55"/><line x1="5" y1="30" x2="12" y2="30"/><line x1="48" y1="30" x2="55" y2="30"/><line x1="12" y1="12" x2="17" y2="17"/><line x1="43" y1="43" x2="48" y2="48"/><line x1="12" y1="48" x2="17" y2="43"/><line x1="43" y1="17" x2="48" y2="12"/></g>',
  ohm:'<text x="30" y="45" font-size="40" font-weight="800" fill="#d9894a" text-anchor="middle" font-family="Georgia,serif">Ω</text>'
};
const icon=id=>'<svg viewBox="0 0 60 60" aria-hidden="true">'+ICONS[id]+'</svg>';

