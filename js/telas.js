/* ================= TELAS ================= */
function showStart(){
  setMode();
  app.innerHTML='<section class="hero"><span class="eyebrow">Neurolytics · modo história</span><h1>Modo <span class="bolt">Eletricista</span></h1><p class="muted">Escolha como quer jogar. Dá pra trocar depois.</p></section>'+
  '<div class="modes">'+Object.entries(MODES).map(([k,m])=>'<button class="btn mode" data-m="'+k+'" style="--c:'+m.c+'"><span class="wire"></span><span><b>'+m.nome+'</b><small>'+m.sub+'</small></span><span class="tag">'+m.fio+'</span></button>').join('')+'</div>'+
  '<div class="soon">🤟 Modo Libras: em breve</div>'+
  '<a class="btn ghost" href="login.html" style="display:grid;place-items:center;text-decoration:none">🔑 Entrar com login (progresso salvo na nuvem)</a>';
  app.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{S.mode=b.dataset.m;save();S.char?showMap():showChar()});
}
function showChar(){
  setMode();let sel=S.char||'aprendiz';
  app.innerHTML='<section class="hero"><span class="eyebrow">Passo 2 de 2</span><h2>Quem vai pra bancada?</h2></section>'+
  '<div class="chars">'+CHARS.map(c=>'<button class="char" data-c="'+c.id+'" aria-pressed="'+(c.id===sel)+'">'+charSVG(c.id)+'<b>'+c.nome+'</b><small>'+c.estilo+'</small></button>').join('')+'</div>'+
  '<label class="eyebrow" for="nome">Seu nome no jogo</label><input type="text" id="nome" maxlength="18" placeholder="'+CHARS.find(c=>c.id===sel).nome+'" value="'+esc(S.name)+'">'+
  '<div class="row"><button class="btn ghost" id="back">Voltar</button><button class="btn main" id="go">Começar ⚡</button></div>';
  app.querySelectorAll('.char').forEach(b=>b.onclick=()=>{sel=b.dataset.c;app.querySelectorAll('.char').forEach(x=>x.setAttribute('aria-pressed',x===b));document.getElementById('nome').placeholder=CHARS.find(c=>c.id===sel).nome});
  document.getElementById('back').onclick=showStart;
  document.getElementById('go').onclick=()=>{S.char=sel;S.name=document.getElementById('nome').value.trim();save();showMap()};
}
function showMap(){
  setMode();const m=MODES[S.mode];
  const ch=CHAPTERS.find(c=>c.id===S.chap)||CHAPTERS[0];
  const seenKey=S.mode+':'+ch.id+':intro';
  if(!ch.soon&&ch.intro&&!S.seen[seenKey]){S.seen[seenKey]=1;save();showScene(ch.intro,showMap);return}
  const tabs='<div class="chapters">'+CHAPTERS.map((c,k)=>'<button class="btn" data-ch="'+c.id+'" aria-pressed="'+(c.id===ch.id)+'">Cap. '+(k+1)+(c.soon?' 🔒':'')+'</button>').join('')+'</div>';
  let body;
  if(ch.soon){
    body='<div class="soonbox"><span class="eyebrow">Em construção</span><h2>'+ch.nome+'</h2><span>Tema: '+ch.tema+'</span><span>O roteiro deste capítulo ainda vai ser escrito.</span></div>';
  }else{
    let nextFound=false;
    const ids=ch.fases;
    const nodes=ids.map((id,i)=>{const p=phaseById(id);
      const done=S.done[S.mode+':'+p.id]||0,open=i===0||S.done[S.mode+':'+ids[i-1]];
      let cls=done?'done':open?'':'lock';if(open&&!done&&!nextFound){cls+=' next';nextFound=true}
      return '<button class="node '+cls+'" data-i="'+PHASES.indexOf(p)+'"><span class="dot">'+icon(p.ic)+'</span><span class="tt"><b>'+p.nome+'</b><small>'+(open?p.sub:'Bloqueada')+'</small><span class="kind">'+p.kind+'</span></span>'+(done?stars(done):'')+'</button>';
    }).join('');
    body='<div class="map">'+nodes+'</div><button class="btn ghost sm" id="replay">▶ Rever a abertura do capítulo</button>';
  }
  const all=!ch.soon&&ch.fases.every(id=>S.done[S.mode+':'+id]);
  app.innerHTML=hud()+talk(all?'Capítulo completo! Bora pro próximo quando sair.':pick(CHEER[S.mode]))+tabs+
  '<div class="chcard'+(ch.id==='cap1'?' art':'')+'"><span class="eyebrow">Capítulo '+(CHAPTERS.indexOf(ch)+1)+' · '+ch.tema+'</span><div class="world"><h2>'+ch.nome+'</h2><span class="tag" style="--c:'+m.c+'">'+m.nome+'</span></div></div>'+body+
  plantaoHTML()+
  '<div class="quick"><button class="btn" id="sandbox">🛠 Oficina livre</button><button class="btn" id="resp">🌬 Respira e religa</button></div>'+
  '<button class="btn" id="ficha">🪪 Minha ficha de eletricista</button>'+
  '<div class="row"><button class="btn ghost" id="cMode">Trocar nível</button><button class="btn ghost" id="cChar">Trocar personagem</button></div>'+
  '<button class="btn ghost danger" id="reset">Recomeçar do zero</button>';
  bindHud();
  app.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{S.chap=b.dataset.ch;save();showMap()});
  app.querySelectorAll('.node').forEach(n=>n.onclick=()=>{if(!n.classList.contains('lock'))playPhase(+n.dataset.i)});
  const rp=document.getElementById('replay');if(rp)rp.onclick=()=>showScene(ch.intro,showMap);
  document.getElementById('sandbox').onclick=runSandbox;document.getElementById('resp').onclick=()=>showBreath(showMap);document.getElementById('ficha').onclick=showFicha;
  document.getElementById('cMode').onclick=showStart;document.getElementById('cChar').onclick=showChar;
  const r=document.getElementById('reset');
  r.onclick=()=>{if(r.dataset.sure){S=FRESH();save();showStart()}else{r.dataset.sure=1;r.textContent='Toque de novo para apagar tudo'}};
}
function afterPhase(p){
  const ch=chapterOf(p.id);const k=S.mode+':'+ch.id+':fim';
  if(ch.fim&&ch.fases.every(id=>S.done[S.mode+':'+id])&&!S.seen[k]){S.seen[k]=1;save();showScene(ch.fim,showMap)}else showMap();
}
function showAlbum(){
  const own=new Set(S.cards);
  app.innerHTML=hud()+'<div class="world"><h2>Álbum de Cards</h2><span class="chip">'+S.cards.length+' / '+PHASES.length*3+'</span></div>'+
  '<p class="muted">Cada nível tem seus cards. Complete as fases nos 3 níveis!</p>'+
  Object.keys(MODES).map(md=>'<span class="eyebrow">'+MODES[md].nome+'</span><div class="album">'+PHASES.map(p=>own.has(md+':'+p.id)?cardHTML(p,md):'<div class="card lockd"><div class="art">?</div><b>???</b><p>Complete '+p.nome+'.</p></div>').join('')+'</div>').join('')+
  '<button class="btn main" id="bk">Voltar ao mapa</button>';
  bindHud();document.getElementById('bk').onclick=showMap;
}
function cardHTML(p,md,extra){return '<div class="card '+(extra||'')+'" style="--c:'+p.cor+'"><div class="art">'+icon(p.ic)+'</div><b>'+p.nome+'</b><p>'+p.card[md]+'</p></div>'}

function playPhase(i){
  const p=PHASES[i],d=p.dados[S.mode];
  const go=()=>({quiz:runQuiz,sort:runSort,build:runBuild,predict:runPredict,diag:runDiag})[p.tipo](p,d);
  const k=S.mode+':'+p.id+':cena';
  if(SCENES[p.id]&&!S.seen[k]){S.seen[k]=1;save();showScene(SCENES[p.id],go)}else go();
}
function frame(p,inner,bubble){
  app.innerHTML=hud()+'<div class="world"><h2>'+p.nome+'</h2><button class="btn ghost sm" id="quit">Sair</button></div>'+talk(bubble)+inner;
  bindHud();document.getElementById('quit').onclick=showMap;window.scrollTo(0,0);
}
const progBar=(n,i,res)=>'<div class="prog">'+Array.from({length:n},(_,k)=>'<i class="'+(k<i?(res[k]?'ok':'no'):k===i?'cur':'')+'"></i>').join('')+'</div>';
const nextBtn=(last)=>'<button class="btn main" id="nx" style="width:100%">'+(last?'Concluir':'Próxima →')+'</button>';

