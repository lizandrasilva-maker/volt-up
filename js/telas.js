/* ================= TELAS ================= */
/* Para onde o jogo vai depois do login: escolhe nível e personagem na primeira vez, depois o menu. */
function abrirInicio(){if(!S.mode)showStart();else if(!S.char)showChar();else showHome()}
const conta=()=>window.CONTA||null;

function showStart(){
  setMode();const trocando=!!S.mode;
  app.innerHTML='<section class="hero"><span class="eyebrow">'+(trocando?'Configurações':'Passo 1 de 2')+'</span><h1>Modo <span class="bolt">Eletricista</span></h1><p class="muted">Escolha como quer jogar. Dá pra trocar depois.</p></section>'+
  '<div class="modes">'+Object.entries(MODES).map(([k,m])=>'<button class="btn mode" data-m="'+k+'" style="--c:'+m.c+'"'+(S.mode===k?' aria-pressed="true"':'')+'><span class="wire"></span><span><b>'+m.nome+'</b><small>'+m.sub+'</small></span><span class="tag">'+m.fio+'</span></button>').join('')+'</div>'+
  '<div class="soon">🤟 Modo Libras: em breve</div>'+
  (trocando?'<button class="btn ghost" id="back">Voltar</button>':'');
  app.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{S.mode=b.dataset.m;save();S.char?showHome():showChar()});
  const bk=document.getElementById('back');if(bk)bk.onclick=showConfig;
}

/* ---------- Menu do usuário (tela depois do login) ---------- */
function planoResumo(){
  const c=conta();
  if(window.VOLT_TESTE||(c&&c.papel==='validador'))return{ic:'🧪',t:'Validação',s:'Tudo liberado para revisão'};
  if(c&&c.papel==='admin')return{ic:'🛠',t:'Administradora',s:'Acesso completo'};
  if(c&&c.validade&&new Date(c.validade)>new Date()){const dias=Math.ceil((new Date(c.validade)-new Date())/864e5);return{ic:dias<=7?'⏳':'🔓',t:'Até '+new Date(c.validade).toLocaleDateString('pt-BR'),s:'Faltam '+dias+' dias',warn:dias<=7}}
  if(c)return{ic:'🎟',t:'Grátis',s:'Capítulo 1 e Oficina'};
  return{ic:'📱',t:'Sem conta',s:'Progresso só neste aparelho'};
}
function showHome(){
  setMode();
  const ch=CHAPTERS.find(c=>c.id===S.chap)||CHAPTERS[0];
  const fases=ch.soon?[]:ch.fases,feitas=fases.filter(id=>S.done[S.mode+':'+id]).length;
  const rk=rankOf(),pl=planoResumo(),c=conta();
  const card=(id,ic,t,s,extra)=>'<button class="mcard'+(extra||'')+'" id="'+id+'"><span class="mi">'+ic+'</span><span class="mt"><b>'+t+'</b><small>'+s+'</small></span></button>';
  const tb=typeof testeBarHTML==='function'?testeBarHTML():'';
  app.innerHTML=hud()+tb+
  '<section class="saudacao">'+charSVG(S.char)+'<div><span class="eyebrow">Menu do eletricista</span><h2>Oi, <span class="bolt">'+esc(S.name||charOf().nome)+'</span>!</h2><small class="muted">'+rk.r.n+' · '+MODES[S.mode].nome+'</small></div></section>'+
  '<div class="menu">'+
    '<button class="mcard hist" id="mHist" style="--i:0"><span class="mi">🗺</span><span class="mt"><span class="eyebrow">Modo história · Capítulo '+(CHAPTERS.indexOf(ch)+1)+'</span><b>'+ch.nome+'</b>'+
      (fases.length?'<span class="mprog"><i style="width:'+Math.round(feitas/fases.length*100)+'%"></i></span><small>'+feitas+' de '+fases.length+' fases · tocar para continuar ▶</small>':'<small>Em construção</small>')+'</span></button>'+
    card('mPerfil','🪪','Meu perfil','XP, competências e carreira','" style="--i:1')+
    card('mConq','🏆','Conquistas',S.ach.length+'/'+ACH.length+' · '+S.cards.length+' cards','" style="--i:2')+
    card('mOfi','🛠','Oficina','Monte o que quiser','" style="--i:3')+
    card('mCalc','🧮','Calculadora','Caderno de contas do Mestre Chico','" style="--i:4')+
    card('mPlano',pl.ic,'Meu plano',pl.t+' · '+pl.s,(pl.warn?' warn':'')+'" style="--i:5')+
    card('mConfig','⚙️','Configurações','Nível, personagem, conta','" style="--i:6')+
    (typeof VISTA3D!=='undefined'&&VISTA3D.flag?card('mLab3d','🧊','Laboratório 3D','Bancada 3D em teste','" style="--i:7')+card('mLab3dBot','🟢','Botoeiras 3D','Liga e desliga em 3D','" style="--i:8'):'')+
  '</div>'+
  plantaoHTML()+
  (c&&(c.papel==='admin'||c.papel==='professor')?'<a class="btn ghost" href="admin.html" style="display:grid;place-items:center;text-decoration:none">Abrir o painel Adm</a>':'')+
  '<p class="small" style="text-align:center;margin:0"><a class="link" href="politica-privacidade.html">Política de privacidade</a></p>';
  bindHud();if(tb)bindTesteBar();
  const on=(id,f)=>{const b=document.getElementById(id);if(b)b.onclick=f};
  on('mHist',showMap);on('mPerfil',showFicha);on('mConq',showConquistas);on('mOfi',runSandbox);on('mCalc',()=>showCalc());on('mPlano',showPlano);on('mConfig',showConfig);
  on('mLab3d',()=>runBuild(LAB3D,comARede(LAB3D.dados[S.mode])));on('mLab3dBot',()=>runBuild(LAB3D_BOT,comARede(LAB3D_BOT.dados[S.mode])));
}
function showPlano(){
  setMode();const pl=planoResumo(),c=conta();
  app.innerHTML=hud()+'<p class="big">Meu <em>plano</em></p>'+
  '<div class="valid'+(pl.warn?' warn':'')+'"><span style="font-size:28px">'+pl.ic+'</span><div><b>'+pl.t+'</b><span class="small">'+pl.s+'</span></div></div>'+
  '<div class="soonbox"><span class="eyebrow">O que está incluído</span><ul class="prev">'+
    (pl.t==='Grátis'||pl.t==='Sem conta'?'<li>Capítulo 1 completo, nos 3 níveis</li><li>Oficina para testar circuitos</li>':'<li>Todos os capítulos liberados</li><li>Oficina completa</li>')+
    '<li>Progresso '+(c?'salvo na nuvem':'salvo só neste aparelho')+'</li></ul></div>'+
  '<div class="soonbox"><span class="eyebrow">Planos pagos</span><span>Em breve. Por enquanto, o acesso completo é liberado pela escola ou pelo professor.</span></div>'+
  (c?'':'<a class="btn main" href="login.html" style="display:grid;place-items:center;text-decoration:none">Entrar ou criar conta</a>')+
  '<button class="btn ghost" id="bk">Voltar ao menu</button>';
  bindHud();window.scrollTo(0,0);document.getElementById('bk').onclick=showHome;
}
function showConfig(){
  setMode();const c=conta();
  app.innerHTML=hud()+'<p class="big"><em>Configurações</em></p>'+
  '<div class="mais-in">'+
    '<button class="btn" id="cMode">🎚 Nível: '+MODES[S.mode].nome+' <small class="muted">· trocar</small></button>'+
    '<button class="btn" id="cRede">⚡ Rede: '+redeTxt()+' <small class="muted">· trocar</small></button>'+
    '<button class="btn" id="cChar">🧑‍🔧 Personagem e nome <small class="muted">· trocar</small></button>'+
    '<button class="btn pausa" id="resp"><span>🌬 Pausa para respirar</span><small>1 minuto para acalmar antes de voltar à bancada</small></button>'+
    '<a class="btn ghost" href="politica-privacidade.html" style="display:grid;place-items:center;text-decoration:none">🔒 Política de privacidade</a>'+
    (c?'<button class="btn ghost" id="sair">Sair da conta</button>':'<a class="btn ghost" href="login.html" style="display:grid;place-items:center;text-decoration:none">🔑 Entrar com login</a>')+
    '<button class="btn ghost danger" id="reset">Recomeçar do zero</button>'+
  '</div>'+
  '<button class="btn main" id="bk">Voltar ao menu</button>';
  bindHud();window.scrollTo(0,0);
  document.getElementById('bk').onclick=showHome;document.getElementById('cMode').onclick=showStart;document.getElementById('cChar').onclick=showChar;document.getElementById('cRede').onclick=showRede;
  document.getElementById('resp').onclick=()=>showBreath(showConfig);
  const sa=document.getElementById('sair');
  if(sa)sa.onclick=async()=>{sa.disabled=true;try{await nuvem.auth.signOut()}catch(e){}
    /* aparelho compartilhado na escola: o próximo aluno não vê o jogo de quem saiu */
    try{localStorage.removeItem(STORE);sessionStorage.removeItem('volt-convidado');sessionStorage.removeItem('volt-teste-on');sessionStorage.removeItem('volt-tela')}catch(e){}
    location.href='login.html'};
  const r=document.getElementById('reset');
  r.onclick=()=>{if(r.dataset.sure){S=FRESH();save();showStart()}else{r.dataset.sure=1;r.textContent='Toque de novo para apagar tudo'}};
}
function showChar(){
  setMode();let sel=S.char||'aprendiz';
  app.innerHTML='<section class="hero"><span class="eyebrow">Passo 2 de 2</span><h2>Quem vai pra bancada?</h2></section>'+
  '<div class="chars">'+CHARS.map(c=>'<button class="char" data-c="'+c.id+'" aria-pressed="'+(c.id===sel)+'">'+charSVG(c.id)+'<b>'+c.nome+'</b><small>'+c.estilo+'</small></button>').join('')+'</div>'+
  '<label class="eyebrow" for="nome">Seu nome no jogo</label><input type="text" id="nome" maxlength="18" placeholder="'+CHARS.find(c=>c.id===sel).nome+'" value="'+esc(S.name)+'">'+
  '<div class="row"><button class="btn ghost" id="back">Voltar</button><button class="btn main" id="go">'+(S.char?'Salvar':'Começar ⚡')+'</button></div>';
  app.querySelectorAll('.char').forEach(b=>b.onclick=()=>{sel=b.dataset.c;app.querySelectorAll('.char').forEach(x=>x.setAttribute('aria-pressed',x===b));document.getElementById('nome').placeholder=CHARS.find(c=>c.id===sel).nome});
  const vinhaDoMenu=!!S.char;
  document.getElementById('back').onclick=vinhaDoMenu?showConfig:showStart;
  document.getElementById('go').onclick=()=>{S.char=sel;S.name=document.getElementById('nome').value.trim();save();showHome()};
}
function showMap(){
  setMode();const m=MODES[S.mode];
  const ch=CHAPTERS.find(c=>c.id===S.chap)||CHAPTERS[0];
  /* um capítulo só abre quando o anterior (jogável) estiver completo no nível atual; no modo teste tudo abre */
  /* capítulo completo: todas as fases feitas, ou o aluno já viu o final dele (fase nova inserida depois
     não trava de novo o capítulo seguinte para quem já tinha concluído) */
  const completo=c=>!c.soon&&(c.fases.every(id=>S.done[S.mode+':'+id])||!!S.seen[S.mode+':'+c.id+':fim']);
  const fechado=c=>{const k=CHAPTERS.indexOf(c);return !window.VOLT_TESTE&&!c.soon&&k>0&&!completo(CHAPTERS[k-1])};
  const seenKey=S.mode+':'+ch.id+':intro';
  if(!ch.soon&&!fechado(ch)&&ch.intro&&!S.seen[seenKey]){S.seen[seenKey]=1;save();showScene(ch.intro,showMap);return}
  const tabs='<div class="chapters">'+CHAPTERS.map((c,k)=>'<button class="btn" data-ch="'+c.id+'" aria-pressed="'+(c.id===ch.id)+'">Cap. '+(k+1)+(c.soon||fechado(c)?' 🔒':'')+'</button>').join('')+'</div>';
  let body;
  if(ch.soon){
    body='<div class="soonbox"><span class="eyebrow">Em construção</span><h2>'+ch.nome+'</h2><span>Tema: '+ch.tema+'</span>'+(ch.enredo?'<span>'+ch.enredo+'</span>':'')+
      (ch.previstas?'<ul class="prev">'+ch.previstas.map(f=>'<li>'+f+'</li>').join('')+'</ul>':'<span>O roteiro deste capítulo ainda vai ser escrito.</span>')+'</div>';
  }else if(fechado(ch)){
    const k=CHAPTERS.indexOf(ch);
    body='<div class="soonbox"><span class="eyebrow">🔒 Bloqueado</span><h2>'+ch.nome+'</h2><span>Tema: '+ch.tema+'</span><span>Complete o Capítulo '+k+' ('+CHAPTERS[k-1].nome+') para abrir esta história.</span></div>';
  }else{
    let nextFound=false;
    const ids=ch.fases;
    const nodes=ids.map((id,i)=>{const p=phaseById(id);
      /* aberta: a primeira, a que já foi feita, ou a seguinte a uma feita (uma fase nova no meio não trava as já feitas) */
      const done=S.done[S.mode+':'+p.id]||0,open=window.VOLT_TESTE||i===0||done||S.done[S.mode+':'+ids[i-1]];
      let cls=done?'done':open?'':'lock';if(open&&!done&&!nextFound){cls+=' next';nextFound=true}
      /* fase bloqueada: só o nome e o cadeado, sem subtítulo nem tipo */
      return '<button class="node '+cls+'" data-i="'+PHASES.indexOf(p)+'"><span class="dot">'+icon(p.ic)+'</span><span class="tt"><b>'+p.nome+'</b>'+(open?'<small>'+p.sub+'</small><span class="kind">'+p.kind+'</span>':'')+'</span>'+(done?stars(done):open?'':'<span class="cad" aria-label="bloqueada">🔒</span>')+'</button>';
    }).join('');
    body='<div class="map">'+nodes+'</div>'+
      (ch.breve?'<div class="soonbox"><span class="eyebrow">Em breve neste capítulo</span><ul class="prev">'+ch.breve.map(f=>'<li>'+f+'</li>').join('')+'</ul></div>':'')+
      '<button class="btn ghost sm" id="replay">▶ Rever a abertura do capítulo</button>';
  }
  const all=!ch.soon&&!fechado(ch)&&ch.fases.every(id=>S.done[S.mode+':'+id]);
  const tb=typeof testeBarHTML==='function'?testeBarHTML():'';
  /* o balão do personagem só aparece quando tem algo a dizer (capítulo completo) */
  app.innerHTML=hud()+tb+'<button class="btn ghost sm" id="toMenu">☰ Menu</button>'+(all?talk(CHAPTERS[CHAPTERS.indexOf(ch)+1]&&!CHAPTERS[CHAPTERS.indexOf(ch)+1].soon?'Capítulo completo! O próximo já está aberto lá em cima.':'Capítulo completo! O próximo está em construção.'):'')+tabs+
  '<div class="chcard'+(ch.id==='cap1'?' art':'')+'"><span class="eyebrow">Capítulo '+(CHAPTERS.indexOf(ch)+1)+' · '+ch.tema+'</span><div class="world"><h2>'+ch.nome+'</h2><span class="tag" style="--c:'+m.c+'">'+m.nome+'</span></div></div>'+body;
  /* oficina, perfil e configurações ficam no menu: o mapa mostra só o caminho das fases */
  bindHud();if(tb)bindTesteBar();
  document.getElementById('toMenu').onclick=showHome;
  app.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{S.chap=b.dataset.ch;save();showMap()});
  app.querySelectorAll('.node').forEach(n=>n.onclick=()=>{if(!n.classList.contains('lock'))playPhase(+n.dataset.i)});
  const rp=document.getElementById('replay');if(rp)rp.onclick=()=>showScene(ch.intro,showMap);
}
function afterPhase(p){
  const ch=chapterOf(p.id);if(!ch){showHome();return}/* fase fora dos capítulos (ex.: Laboratório 3D) */
  const k=S.mode+':'+ch.id+':fim';
  if(ch.fim&&ch.fases.every(id=>S.done[S.mode+':'+id])&&!S.seen[k]){S.seen[k]=1;save();showScene(ch.fim,showMap)}else showMap();
}
function showAlbum(){
  const own=new Set(S.cards);
  app.innerHTML=hud()+'<div class="world"><h2>Álbum de Cards</h2><span class="chip">'+S.cards.length+' / '+PHASES.length*3+'</span></div>'+
  '<p class="muted">Cada nível tem seus cards. Complete as fases nos 3 níveis!</p>'+
  Object.keys(MODES).map(md=>'<span class="eyebrow">'+MODES[md].nome+'</span><div class="album">'+PHASES.map(p=>own.has(md+':'+p.id)?cardHTML(p,md):'<div class="card lockd"><div class="art">?</div><b>???</b><p>Complete '+p.nome+'.</p></div>').join('')+'</div>').join('')+
  '<button class="btn main" id="bk">Voltar</button>';
  bindHud();window.scrollTo(0,0);document.getElementById('bk').onclick=showConquistas;
}
function cardHTML(p,md,extra){return '<div class="card '+(extra||'')+'" style="--c:'+p.cor+'"><div class="art">'+icon(p.ic)+'</div><b>'+p.nome+'</b><p>'+rd(p.card[md])+'</p></div>'}

function playPhase(i){
  const p=PHASES[i],d=comARede(p.dados[S.mode]);
  const go=()=>({quiz:runQuiz,sort:runSort,build:runBuild,predict:runPredict,diag:runDiag,aula:runAula})[p.tipo](p,d);
  const k=S.mode+':'+p.id+':cena';
  /* no modo teste a cena aparece sempre, para revisar a história */
  const cena=cenaDe(p.id);
  if(cena&&(window.VOLT_TESTE||!S.seen[k])){S.seen[k]=1;save();showScene(cena,go)}else go();
}
function frame(p,inner,bubble){
  const tf=typeof testePhaseHTML==='function'?testePhaseHTML(p):'';
  /* o céu acompanha o capítulo da fase (no roteiro do modo teste dá para abrir fase de outro capítulo) */
  if(p.id)ceu(p.id);
  app.innerHTML=hud()+'<div class="world"><h2>'+p.nome+'</h2><button class="btn ghost sm" id="quit">Sair</button></div>'+tf+(bubble?talk(bubble):'')+inner;
  /* a Oficina (sem id) volta ao menu; as fases voltam ao mapa */
  bindHud();document.getElementById('quit').onclick=p.id?showMap:showHome;if(tf)bindTestePhase(p);window.scrollTo(0,0);
}
const progBar=(n,i,res)=>'<div class="prog">'+Array.from({length:n},(_,k)=>'<i class="'+(k<i?(res[k]?'ok':'no'):k===i?'cur':'')+'"></i>').join('')+'</div>';
const nextBtn=(last)=>'<button class="btn main" id="nx" style="width:100%">'+(last?'Concluir':'Próxima →')+'</button>';

