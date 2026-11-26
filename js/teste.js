/* ================= MODO TESTE (para quem cria o jogo) =================
   Libera todas as fases, sempre mostra a cena da história, mostra o roteiro inteiro em texto
   e tem atalhos: "Concluir fase" e "Montar pra mim" nas bancadas.
   Usa um PERFIL SEPARADO (chave própria no navegador) e nunca envia nada para a nuvem:
   o progresso real do jogador não é tocado.
   Quem vê o botão: quem abre o jogo com ?teste=1 no endereço, ou quem está logado como admin ou professor.
   ?teste=0 esconde o botão de novo. */
const TESTE_STORE='neuro-eletricista-teste';
window.VOLT_TESTE=false;      // modo teste ligado agora
window.VOLT_TESTE_OK=false;   // o botão pode aparecer

(function(){
  try{const q=new URLSearchParams(location.search).get('teste');
    if(q==='1')sessionStorage.setItem('volt-teste-ok','1');
    if(q==='0'){sessionStorage.removeItem('volt-teste-ok');sessionStorage.removeItem('volt-teste-on')}
    VOLT_TESTE_OK=sessionStorage.getItem('volt-teste-ok')==='1';
  }catch(e){}
  /* admin ou professor logado também pode testar */
  if(typeof nuvemUsuario==='function')nuvemUsuario().then(async u=>{
    if(!u||VOLT_TESTE_OK)return;
    try{const {data}=await nuvem.from('perfis').select('papel').eq('id',u.id).maybeSingle();
      if(data&&['admin','professor','validador'].includes(data.papel)){VOLT_TESTE_OK=true;if(document.querySelector('.map'))showMap();else if(document.querySelector('.menu'))showHome()}}catch(e){}
  });
})();

/* save() passa a gravar no perfil de teste enquanto o modo estiver ligado (e não vai para a nuvem). */
(function(){const _save=save;save=function(){if(VOLT_TESTE){try{localStorage.setItem(TESTE_STORE,JSON.stringify(S))}catch(e){}return}_save()}})();

function lerPerfil(key){const s=FRESH();try{const r=localStorage.getItem(key);if(r)Object.assign(s,JSON.parse(r))}catch(e){}return s}
function entrarTeste(depois){
  const real=S;let t=lerPerfil(TESTE_STORE);
  if(!t.mode){t.mode=real.mode||'leve';t.char=real.char||'aprendiz';t.name=real.name||(window.CONTA&&CONTA.apelido)||''}
  VOLT_TESTE=true;S=t;ensure();save();
  try{sessionStorage.setItem('volt-teste-on','1')}catch(e){}
  (typeof depois==='function'?depois:showMap)();
}
function sairTeste(){
  VOLT_TESTE=false;try{sessionStorage.removeItem('volt-teste-on')}catch(e){}
  S=lerPerfil(STORE);ensure();
  abrirInicio();
}
function zerarTeste(){const keep={mode:S.mode,char:S.char,name:S.name};S=Object.assign(FRESH(),keep);save();showMap()}
/* Se a página recarregar com o modo ligado, continua no perfil de teste. */
try{if(VOLT_TESTE_OK&&sessionStorage.getItem('volt-teste-on')==='1'){VOLT_TESTE=true;S=lerPerfil(TESTE_STORE);ensure()}}catch(e){}

/* Faixa no topo do mapa */
function testeBarHTML(){
  if(!VOLT_TESTE_OK)return '';
  if(!VOLT_TESTE)return '<button class="btn ghost sm teste-in" id="tIn">🧪 Entrar no modo teste</button>';
  return '<div class="teste"><div class="teste-h"><b>🧪 MODO TESTE</b><span>Tudo liberado · progresso separado, não vai para a nuvem</span></div>'+
    '<div class="teste-b"><button class="btn sm" id="tRot">📜 Roteiro</button><button class="btn sm" id="tZero">↺ Zerar teste</button><button class="btn sm" id="tOut">Sair</button></div></div>';
}
function bindTesteBar(){
  const a=document.getElementById('tIn');if(a)a.onclick=()=>entrarTeste(document.querySelector('.menu')?showHome:showMap);
  const r=document.getElementById('tRot');if(r)r.onclick=showRoteiro;
  const z=document.getElementById('tZero');if(z)z.onclick=zerarTeste;
  const o=document.getElementById('tOut');if(o)o.onclick=sairTeste;
}
/* Atalhos dentro de uma fase */
function testePhaseHTML(p){
  if(!VOLT_TESTE||!p||!p.id)return '';
  return '<div class="teste teste-f"><b>🧪</b>'+(testeSol(p.id)?'<button class="btn sm" id="tSol">🔧 Montar pra mim</button>':'')+'<button class="btn sm" id="tSkip">⏭ Concluir fase</button></div>';
}
function bindTestePhase(p){const k=document.getElementById('tSkip');if(k)k.onclick=()=>finish(p,1,1)}

/* Gabaritos das bancadas de montar (conferidos com normCheck, colorCheck e o check da missão). */
const TESTE_SOL={
  'primeiro:leve':[['B.0','S1.0','fase'],['S1.1','L1.0','retorno'],['L1.1','B.1','neutro']],
  'primeiro:moderado':[['B.0','F.0','fase'],['F.1','S1.0','fase'],['S1.1','L1.0','retorno'],['L1.1','B.1','neutro']],
  'paralelo:leve':[['B.0','L1.0','fase'],['B.0','L2.0','fase'],['L1.1','B.1','neutro'],['L2.1','B.1','neutro']],
  'paralelo:moderado':[['B.0','S1.0','fase'],['B.0','S2.0','fase'],['S1.1','L1.0','retorno'],['S2.1','L2.0','retorno'],['L1.1','B.1','neutro'],['L2.1','B.1','neutro']],
  'paralelo:full':[['B.0','S0.0','fase'],['S0.1','L1.0','retorno'],['S0.1','S2.0','retorno'],['S2.1','L2.0','retorno'],['L1.1','B.1','neutro'],['L2.1','B.1','neutro']]
};
TESTE_SOL['primeiro:full']=TESTE_SOL['primeiro:moderado'];
/* Pilha e Lanterna (bancada CC): pilhas em série (− de P1 no + de P2) e a lâmpada nas pontas; com o S1 no + */
TESTE_SOL['lanterna:leve']=[['P1.0','L1.0','pos'],['L1.1','P2.1','neg'],['P1.1','P2.0','neg']];
TESTE_SOL['lanterna:moderado']=TESTE_SOL['lanterna:full']=[['P1.0','S1.0','pos'],['S1.1','L1.0','pos'],['L1.1','P2.1','neg'],['P1.1','P2.0','neg']];
/* capítulo 2 */
Object.assign(TESTE_SOL,{
  /* capítulo 1 · Ato 3: duas lâmpadas em paralelo (com o S1 no trecho comum nos níveis moderado e full) */
  'parcc:leve':[['P1.0','L1.0','pos'],['P1.0','L2.0','pos'],['L1.1','P2.1','neg'],['L2.1','P2.1','neg'],['P1.1','P2.0','neg']],
  'parcc:moderado':[['P1.0','S1.0','pos'],['S1.1','L1.0','pos'],['S1.1','L2.0','pos'],['L1.1','P2.1','neg'],['L2.1','P2.1','neg'],['P1.1','P2.0','neg']],
  'parcc:full':[['P1.0','S1.0','pos'],['S1.1','L1.0','pos'],['S1.1','L2.0','pos'],['L1.1','P2.1','neg'],['L2.1','P2.1','neg'],['P1.1','P2.0','neg']],  'quadronovo:leve':[['B.0','DG.0','fase'],['DG.1','DR.0','fase'],['B.1','DR.1','neutro'],['DR.2','L1.0','fase'],['L1.1','DR.3','neutro']],
  'quadronovo:moderado':[['B.0','DG.0','fase'],['DG.1','DR.0','fase'],['B.1','DR.1','neutro'],['DR.2','D1.0','fase'],['DR.2','D2.0','fase'],['D1.1','L1.0','fase'],['D2.1','L2.0','fase'],['L1.1','DR.3','neutro'],['L2.1','DR.3','neutro']],
  'escada:leve':[['B.0','SP1.0','fase'],['SP1.1','SP2.1','retorno'],['SP1.2','SP2.2','retorno'],['SP2.0','L1.0','retorno'],['L1.1','B.1','neutro']],
  'corredor:leve':[['B.0','SP1.0','fase'],['SP1.1','SI.0','retorno'],['SP1.2','SI.1','retorno'],['SI.2','SP2.1','retorno'],['SI.3','SP2.2','retorno'],['SP2.0','L1.0','retorno'],['L1.1','B.1','neutro']],
  'garagem:leve':[['B.0','FC.0','fase'],['B.1','FC.1','neutro'],['FC.2','L1.0','retorno'],['L1.1','B.1','neutro']],
  'impulso:leve':[['B.0','P1.0','fase'],['P1.1','RI.0','retorno'],['RI.1','B.1','neutro'],['B.0','RI.2','fase'],['RI.3','L1.0','retorno'],['L1.1','B.1','neutro']],
  'impulso:moderado':[['B.0','P1.0','fase'],['B.0','P2.0','fase'],['P1.1','RI.0','retorno'],['P2.1','RI.0','retorno'],['RI.1','B.1','neutro'],['B.0','RI.2','fase'],['RI.3','L1.0','retorno'],['L1.1','B.1','neutro']],
  /* capítulo 3 */
  /* comando em 24 V⎓ (fonte de comando T1, NR-12 12.4.13 b): +24 → DESLIGA → LIGA (com o selo 13-14 em paralelo) → [95-96] → A1;
     A2 → 0V. Força pela rede: contatora → [relé térmico] → motor */
  'partida:leve':[['B.0','T1.0','fase'],['B.1','T1.1','neutro'],['T1.2','BD.0','cmd'],['BD.1','BL.0','cmd'],['BL.1','K.0','cmd'],['K.1','T1.3','cmd'],['BD.1','K.4','cmd'],['K.5','K.0','cmd'],['B.0','K.2','fase'],['K.3','M.0','retorno'],['M.1','B.1','neutro'],['M.2','BEP.1','terra'],['BEP.0','H.0','terra']],
  'partida:moderado':[['B.0','T1.0','fase'],['B.1','T1.1','neutro'],['T1.2','BD.0','cmd'],['BD.1','BL.0','cmd'],['BD.1','K.4','cmd'],['BL.1','FT.2','cmd'],['K.5','FT.2','cmd'],['FT.3','K.0','cmd'],['K.1','T1.3','cmd'],['B.0','K.2','fase'],['K.3','FT.0','retorno'],['FT.1','M.0','retorno'],['M.1','B.1','neutro'],['M.2','BEP.1','terra'],['BEP.0','H.0','terra']],
  'partida:full':[['B.0','DJ.0','fase'],['DJ.1','T1.0','fase'],['B.1','T1.1','neutro'],['T1.2','BD.0','cmd'],['BD.1','BL.0','cmd'],['BD.1','K.4','cmd'],['BL.1','FT.2','cmd'],['K.5','FT.2','cmd'],['FT.3','K.0','cmd'],['K.1','T1.3','cmd'],['DJ.1','K.2','fase'],['K.3','FT.0','retorno'],['FT.1','M.0','retorno'],['M.1','B.1','neutro'],['M.2','BEP.1','terra'],['BEP.0','H.0','terra']],
  'caixa:leve':[['B.0','BO.0','fase'],['BO.1','M.0','retorno'],['M.1','B.1','neutro'],['M.2','BEP.1','terra'],['BEP.0','H.0','terra']],
  'caixa:moderado':[['B.0','T1.0','fase'],['B.1','T1.1','neutro'],['T1.2','BO.0','cmd'],['BO.1','K.0','cmd'],['K.1','T1.3','cmd'],['B.0','K.2','fase'],['K.3','M.0','retorno'],['M.1','B.1','neutro'],['M.2','BEP.1','terra'],['BEP.0','H.0','terra']]
});
['escada','corredor','garagem'].forEach(f=>{TESTE_SOL[f+':moderado']=TESTE_SOL[f+':full']=TESTE_SOL[f+':leve']});
TESTE_SOL['quadronovo:full']=TESTE_SOL['quadronovo:moderado'];TESTE_SOL['impulso:full']=TESTE_SOL['impulso:moderado'];TESTE_SOL['caixa:full']=TESTE_SOL['caixa:moderado'];
function testeSol(pid){const s=TESTE_SOL[pid+':'+S.mode];return s?s.map(([a,b,cor])=>Object.assign(W(a,b),{cor})):null}

/* ---------- Roteiro: a história inteira em texto, com atalho para ver cada cena ou jogar a fase ---------- */
const TIPO_NOME={aula:'Aula',quiz:'Quiz',sort:'Classificar',build:'Bancada: montar',medir:'Bancada: medir',cacacc:'Bancada: caça-defeito (CC)',capacitor:'Bancada: capacitor',eletroima:'Bancada: eletroímã',predict:'Bancada: prever',diag:'Bancada: diagnóstico'};
function falasHTML(lines){
  const nm=esc(S.name||charOf().nome);
  return '<div class="falas">'+lines.map(([who,t])=>'<p><b>'+(who==='eu'?nm:NPC[who].nome)+':</b> '+esc(rd(t)).replace(/\{nome\}/g,nm)+'</p>').join('')+'</div>';
}
function showRoteiro(){
  setMode();
  const lv='<div class="seg3">'+Object.entries(MODES).map(([k,m])=>'<button class="btn sm" data-lv="'+k+'" aria-pressed="'+(S.mode===k)+'">'+m.nome+'</button>').join('')+'</div>';
  let body='';
  CHAPTERS.forEach((ch,ci)=>{
    body+='<section class="rot-cap"><span class="eyebrow">Capítulo '+(ci+1)+' · '+ch.tema+'</span><h2>'+ch.nome+'</h2>';
    if(ch.soon){body+='<p class="muted">Em construção: ainda sem roteiro.</p></section>';return}
    if(ch.intro)body+='<div class="rot-item"><div class="rot-h"><b>Abertura</b><button class="btn sm" data-cena="intro:'+ch.id+'">▶ Ver cena</button></div>'+falasHTML(ch.intro)+'</div>';
    ch.fases.forEach((id,i)=>{const p=phaseById(id),sc=cenaDe(id);
      body+='<div class="rot-item"><div class="rot-h"><b>'+(i+1)+'. '+p.nome+'</b><span class="chip">'+TIPO_NOME[p.tipo]+'</span></div>'+
        '<p class="help">'+p.sub+'</p>'+(sc?falasHTML(sc):'<p class="help">Sem cena antes da fase.</p>')+
        (p.tipo==='aula'?'<p class="help">Aula:</p>'+falasHTML(p.dados[S.mode].quadros.map(q=>[q.who||'chico',q.t])):'')+'<p class="rot-card">🃏 '+rd(p.card[S.mode])+'</p>'+
        '<div class="row">'+(sc?'<button class="btn sm" data-cena="fase:'+id+'">▶ Ver cena</button>':'')+'<button class="btn sm main" data-jogar="'+PHASES.indexOf(p)+'">🎮 Jogar</button></div></div>'});
    if(ch.fim)body+='<div class="rot-item"><div class="rot-h"><b>Fim do capítulo</b><button class="btn sm" data-cena="fim:'+ch.id+'">▶ Ver cena</button></div>'+falasHTML(ch.fim)+'</div>';
    body+='</section>';
  });
  app.innerHTML=hud()+'<div class="world"><h2>📜 Roteiro</h2><button class="btn ghost sm" id="bk">Mapa</button></div>'+
    '<p class="help">Nível das perguntas e dos cards:</p>'+lv+body+'<button class="btn main" id="bk2">Voltar ao mapa</button>';
  bindHud();window.scrollTo(0,0);
  document.getElementById('bk').onclick=showMap;document.getElementById('bk2').onclick=showMap;
  app.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{S.mode=b.dataset.lv;save();showRoteiro()});
  app.querySelectorAll('[data-cena]').forEach(b=>b.onclick=()=>{const [k,id]=b.dataset.cena.split(':');
    const lines=k==='fase'?cenaDe(id):CHAPTERS.find(c=>c.id===id)[k];showScene(lines,showRoteiro)});
  app.querySelectorAll('[data-jogar]').forEach(b=>b.onclick=()=>playPhase(+b.dataset.jogar));
}
