/* ---------- Quiz ---------- */
function runQuiz(p,list){
  let i=0,ok=0;const res=[];
  const render=()=>{
    const q=list[i],opts=shuffle(q.o.map((t,k)=>({t,k})));let tries=0;
    frame(p,progBar(list.length,i,res)+'<div class="qcard"><p class="q">'+q.q+'</p><button class="btn ghost sm" id="sp" style="align-self:flex-start">🔊 Ouvir</button></div>'+
      '<div class="opts">'+opts.map(o=>'<button class="btn opt" data-k="'+o.k+'">'+o.t+'</button>').join('')+'</div><div id="fb" class="opts"></div>',
      L()?'Leia com calma e escolha.':'Pergunta '+(i+1)+' de '+list.length);
    document.getElementById('sp').onclick=()=>speak(q.q+'. '+q.o.join('. '));
    app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
      const right=+b.dataset.k===0;tries++;const fb=document.getElementById('fb');
      if(right||!L()){
        app.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.k===0)x.classList.add('right')});
        if(!right)b.classList.add('wrong','shake');
        res[i]=right&&tries===1;if(res[i]){ok++;S.xp+=10;save()}
        fb.innerHTML='<div class="fb '+(right?'good':'bad')+'">'+(right?pick(PRAISE[S.mode])+' ':'')+q.w+'</div>'+nextBtn(i===list.length-1);
        document.getElementById('nx').onclick=()=>{i++;i<list.length?render():finish(p,ok,list.length)};
      }else{b.classList.add('wrong','shake');b.disabled=true;fb.innerHTML='<div class="fb bad">Quase! Pensa de novo.</div>'}
    });
  };
  render();
}

/* ---------- Classificar ---------- */
/* Rótulos padrão (Guardião Verde); outras fases trazem os seus em p.bins, p.certo, p.dica e p.pergunta.
   Com p.fig, cada item mostra uma ilustração que reage à resposta (ex.: o LED do testador). */
function runSort(p,list){
  list=shuffle(list);let i=0,ok=0;const res=[];
  const bins=p.bins||[{r:1,t:'♻️ Renovável'},{r:0,t:'⛔ Não renovável'}];
  const certo=p.certo||['Não é renovável.','É renovável.'];
  const dica=p.dica||'Quase! Pensa: ela pode acabar um dia?';
  const perg=p.pergunta?(L()?p.pergunta.leve:p.pergunta.outro):(L()?'Essa energia acaba ou a natureza repõe?':'Classifique a fonte.');
  const ilustra=(it,estado)=>p.fig&&FIG[p.fig]?'<figure class="lousa sort-fig" aria-hidden="true"><svg viewBox="0 0 320 180">'+FIG[p.fig]({e:it.i,n:it.t,estado})+'</svg></figure>':'';
  const render=()=>{
    const it=list[i];let tries=0;
    frame(p,progBar(list.length,i,res)+'<div id="ilu">'+ilustra(it,null)+'</div><div class="item" id="it"><span class="em">'+it.i+'</span><b>'+it.t+'</b></div>'+
      '<div class="bins">'+bins.map(b=>'<button class="btn bin '+(b.r?'r':'n')+'" data-r="'+b.r+'">'+b.t+'</button>').join('')+'</div><div id="fb" class="opts"></div>',perg);
    app.querySelectorAll('.bin').forEach(b=>b.onclick=()=>{
      tries++;const right=+b.dataset.r===it.r;const fb=document.getElementById('fb');
      if(right||!L()){
        res[i]=right&&tries===1;if(res[i]){ok++;S.xp+=10;save()}
        if(p.fig)document.getElementById('ilu').innerHTML=ilustra(it,it.r?'conduz':'isola');
        app.querySelectorAll('.bin').forEach(x=>x.disabled=true);if(!right)document.getElementById('it').classList.add('shake');
        fb.innerHTML='<div class="fb '+(right?'good':'bad')+'">'+(right?pick(PRAISE[S.mode]):certo[it.r])+' '+it.w+'</div>'+nextBtn(i===list.length-1);
        document.getElementById('nx').onclick=()=>{i++;i<list.length?render():finish(p,ok,list.length)};
      }else{document.getElementById('it').classList.add('shake');b.disabled=true;fb.innerHTML='<div class="fb bad">'+dica+'</div>'}
    });
  };
  render();
}

/* Cartão da missão: só o objetivo. As etiquetas "peça = objeto real" aparecem só no Diagrama,
   onde o aluno precisa traduzir o símbolo; na vista real a própria peça já é o objeto. */
function missao(goal,real,nota,rotulo){return '<div class="goal"><span class="gi">'+(rotulo||'MISSÃO')+'</span><div class="gtx"><span>'+goal+'</span>'+(nota?'<small>'+nota+'</small>':'')+(vistaReal()?'':realHTML(real))+'</div></div>'}
/* Bancada com a cadeia de energia (poste → medidor → quadro) colada em cima e, por cima da bancada,
   os botões pequenos de vista (Real/Diagrama) e de zoom, como num mapa de celular.
   O estado da faixa (energia passando ou curto) vem da classe que board() põe no <svg>. */
/* cc = bancada de corrente contínua (pilhas): sem a faixa do poste e com o aviso do modelo CC */
/* v3 = a vista 3D vai ocupar o centro da bancada: no lugar do SVG fica só a vaga onde o <canvas> é reencaixado */
/* p3 = esta bancada pode ser vista em 3D: aparece o botão para alternar entre 2D e 3D */
function benchWrap(svg,id,zm,cc,v3,p3){const m=/^<svg[^>]*class="(\w*)/.exec(svg),est=m?(m[1]==='curto'?'short':m[1]):'',R=vistaReal();
  const b3=p3?'<button class="btn vbtn" data-3d="'+(v3?'0':'1')+'" aria-label="'+(v3?'Voltar à bancada 2D':'Ver a bancada em 3D')+'">'+(v3?'🔌 2D':'🧊 3D')+'</button>':'';
  const gi=v3?'<button class="btn vbtn" data-girar aria-pressed="'+!!VISTA3D.girar+'" aria-label="'+(VISTA3D.girar?'Parar de girar e voltar a montar':'Girar a vista com o dedo')+'">'+(VISTA3D.girar?'✋ Montar':'🔄 Girar')+'</button>':'';
  const ctl=!zm?'':v3?'<div class="bctl">'+gi+b3+'</div>':'<div class="bctl"><span class="bctl-esq"><button class="btn vbtn" data-vista="'+(R?'simb':'real')+'" aria-label="'+(R?'Ver o diagrama multifilar':'Ver as peças reais')+'">'+(R?'📐 Multifilar':'🔌 Real')+'</button>'+b3+'</span>'+zm.ui()+'</div>';
  return '<div class="benchwrap">'+(cc||v3?'':entrada(est))+'<div class="bench'+(v3?' bench3d':'')+'"'+(id?' id="'+id+'"':'')+'>'+(v3?'<div class="vaga3d" data-vaga3d></div>':svg)+ctl+'</div>'+(cc?avisoCC():avisoModelo())+'</div>'}

/* ---------- Vista 3D persistente ----------
   A tela é redesenhada com innerHTML a cada ação; o <canvas> WebGL não pode nascer de novo a cada toque.
   O nó da cena é criado uma vez (montar), fica guardado aqui e é reencaixado na vaga a cada redesenho
   (atualizar). Quando a tela deixa de ter bancada 3D, ele é destruído (destruir).
   VISTA3D.vista é registrada por js/bancada3d.js: {aceita(st), montar(no,ctx), atualizar(ctx), destruir()}.
   ctx = {st, res, sel, curto, cor, editavel, ctl}; ctl é o contrato de intenções (abaixo). */
const VISTA3D={vista:null,ligada:false,no:null,montagens:0,flag:false,carga:null,erro:null,redesenha:null,girar:false};
/* ?3d=1 liga a vista 3D neste aparelho (fica guardado, inclusive depois do login); ?3d=0 desliga.
   Sem o flag, nada de 3D é baixado: o SVG segue sendo a bancada. */
try{const q=new URLSearchParams(location.search).get('3d');if(q==='1')localStorage.setItem('volt-3d','1');if(q==='0')localStorage.removeItem('volt-3d');
  VISTA3D.flag=localStorage.getItem('volt-3d')==='1'}catch(e){}
/* a montagem abre em 3D (com as peças 3D) sempre que a bancada tem 3D; quem tocar em 🔌 2D fica no 2D neste aparelho */
try{VISTA3D.ligada=localStorage.getItem('volt-vista')!=='2d'}catch(e){VISTA3D.ligada=true}
function escolhe3D(sim){VISTA3D.ligada=sim;try{if(sim)localStorage.removeItem('volt-vista');else localStorage.setItem('volt-vista','2d')}catch(e){}}
/* peças que a vista 3D já desenha: fonte 1F+N, disjuntor, DR e lâmpada sem PE (Laboratório 3D e Quadro Novo).
   As outras bancadas ficam no SVG. */
VISTA3D.suporta=st=>st.comps.every(c=>c.type==='src'||c.type==='fuse'||c.type==='dr'||c.type==='btn'||c.type==='kc'||c.type==='ft'||c.type==='sw'||c.type==='sw3'||c.type==='sw4'||c.type==='foto'||c.type==='ri'||c.type==='pilha'||c.type==='motor'||c.type==='bep'||c.type==='haste'||c.type==='boia'||(c.type==='lamp'&&c.pe!==true));
/* o botão 🧊 3D aparece em toda bancada cujas peças já existem em 3D, com ou sem ?3d=1 (o flag só abre direto em 3D
   e mostra os laboratórios). O Three.js é baixado no primeiro toque no botão. */
function quer3D(st){return !!(VISTA3D.ligada&&VISTA3D.vista&&VISTA3D.vista.aceita(st))}
function pode3D(st){return !VISTA3D.erro&&(VISTA3D.vista?VISTA3D.vista.aceita(st):VISTA3D.suporta(st))}
/* baixa o Three.js e js/bancada3d.js só quando a 3D é pedida (import dinâmico, com o three da importmap do index.html).
   Quando termina, redesenha a bancada aberta, se ainda for a mesma. */
function carrega3D(){
  if(!VISTA3D.carga)VISTA3D.carga=import('./bancada3d.js').then(()=>{if(!VISTA3D.vista&&!VISTA3D.erro)VISTA3D.erro='vista 3D não registrada'})
    .catch(e=>{VISTA3D.erro=e.message||String(e)})
    .then(()=>{const r=VISTA3D.redesenha;if(r&&r.id===BANCADA_ID&&app.querySelector('.bench'))r.f()});
  return VISTA3D.carga;
}
if(VISTA3D.flag)carrega3D();
/* estado da bancada aberta (inspeção e testes de equivalência 2D × 3D) */
const BANCADA={st:null};
/* Laboratório 3D (MVP): fonte, disjuntor e lâmpada. Fica fora dos capítulos; aparece no menu só com ?3d=1. */
const LAB3D={id:'lab3d',nome:'Laboratório 3D',sub:'Fonte, disjuntor e lâmpada',kind:'bancada',tipo:'build',ic:'disjuntor',cor:'#2b4f7a',
  card:{leve:'O disjuntor fica na fase, antes da lâmpada.',moderado:'Disjuntor em série na fase: desligado, a lâmpada fica sem tensão.',full:'Curto depois do disjuntor: o disparo magnético do DJ abre o circuito.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(md=>[md,{
    comps:[BAT(),C('DJ','fuse',150,70,0,{lab:'DJ 10A'}),C('L1','lamp',275,140,0)],
    real:[['DJ','🎚','disjuntor'],['L1','💡','lâmpada'],['Fonte','🔌','rede {V} V']],
    goal:'Ligue a lâmpada L1 na fonte passando pelo disjuntor DJ: ligado, a lâmpada acende; desligado, apaga.',
    check:st=>{const comps=clone(st.comps).map(c=>c.type==='fuse'?Object.assign(c,{trip:false}):c),r=solve(comps,st.wires);
      if(r.short)return 'Curto-circuito: tem caminho sem carga entre fase e neutro.';
      if(!(r.lamp.L1>0.04))return L()?'Com o disjuntor ligado, a lâmpada deveria acender. Feche o caminho: fase, disjuntor, lâmpada e neutro.':'Com o DJ ligado, L1 deveria acender: fase → DJ → L1 → neutro.';
      return null}}]))};
/* Laboratório 3D das botoeiras: a lâmpada acende só enquanto o LIGA (BL, NA) está apertado, e o DESLIGA (BD, NF) corta.
   A conferência aperta e solta as botoeiras numa cópia do circuito (o estado da bancada não muda). */
const LAB3D_BOT={id:'lab3dbot',nome:'Botoeiras 3D',sub:'Liga (NA) e desliga (NF)',kind:'bancada',tipo:'build',ic:'motor',cor:'#2b4f6e',
  card:{leve:'O verde fecha enquanto está apertado; o vermelho abre.',moderado:'LIGA é NA (3-4); DESLIGA é NF (1-2), em série antes do LIGA.',full:'Botoeira NA fecha sob ação; NF abre sob ação: em série, o NF tem prioridade.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(md=>[md,{
    comps:[BAT(),C('DJ','fuse',110,60,0,{lab:'DJ 10A'}),C('BD','btn',180,60,0,{nf:true}),C('BL','btn',245,60,0,{nf:false}),C('L1','lamp',275,165,0)],
    real:[['DJ','🎚','disjuntor'],['BD','🔴','botoeira desliga (NF)'],['BL','🟢','botoeira liga (NA)'],['L1','💡','lâmpada']],
    goal:'A lâmpada L1 acende só enquanto o LIGA (BL) está apertado, e o DESLIGA (BD) corta. Caminho: fase → DJ → BD → BL → L1 → neutro.',
    check:st=>{const r=(bl,bd)=>{const comps=clone(st.comps).map(c=>{if(c.type==='fuse')c.trip=false;if(c.id==='BL')c.pressed=bl;if(c.id==='BD')c.pressed=bd;return c});return solve(comps,st.wires)};
      const a=r(true,false);if(a.short)return 'Curto-circuito: tem caminho sem carga entre fase e neutro.';
      if(!(a.lamp.L1>0.04))return L()?'Apertei o verde e a lâmpada não acendeu. O caminho é fase, disjuntor, vermelho, verde, lâmpada e neutro.':'Com o LIGA apertado, L1 deveria acender: fase → DJ → BD → BL → L1 → neutro.';
      if(r(false,false).lamp.L1>0.04)return L()?'Sem apertar nada a lâmpada ficou acesa: o verde só fecha enquanto está apertado.':'Sem acionar, L1 acesa: o LIGA (NA) precisa estar em série no caminho.';
      if(r(true,true).lamp.L1>0.04)return L()?'Apertando o vermelho junto, a lâmpada deveria apagar. O vermelho vai em série, antes do verde.':'Com o DESLIGA acionado, L1 deveria apagar: o NF em série abre o circuito.';
      return null}}]))};
/* Laboratório 3D de comando: partida com selo usando a lâmpada como carga (o motor 3D vem depois).
   Força: fase → DJ → K 1-2 → FT 1-2 → L1 → neutro. Comando: DJ → FT 95-96 → BD → BL → A1; A2 no neutro; selo 13-14
   em paralelo com o BL. A conferência aperta e solta as botoeiras e desarma o FT numa cópia do circuito. */
const LAB3D_KC={id:'lab3dkc',nome:'Contatora 3D',sub:'Comando com selo e relé térmico',kind:'bancada',tipo:'build',ic:'sobrecarga',cor:'#3d5a7a',
  card:{leve:'Verde liga, o selo segura, vermelho desliga.',moderado:'Selo 13-14 em paralelo com o LIGA; 95-96 em série com a bobina.',full:'Relé térmico: 95-96 NF no comando; o disparo derruba a bobina e o selo.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(md=>[md,{
    comps:[BAT(),C('DJ','fuse',100,60,0,{lab:'DJ 10A'}),C('K','kc',175,60,0),C('FT','ft',255,60,0),C('BD','btn',120,170,0,{nf:true}),C('BL','btn',190,170,0,{nf:false}),C('L1','lamp',280,170,0)],
    real:[['DJ','🎚','disjuntor'],['K','🧲','contatora'],['FT','🌡️','relé térmico'],['BD','🔴','botoeira desliga (NF)'],['BL','🟢','botoeira liga (NA)'],['L1','💡','carga (no lugar do motor)']],
    goal:'L1 liga no verde, continua ao soltar (selo 13-14) e desliga no vermelho ou quando o relé térmico (95-96) desarma. Força pelo 1-2 da contatora e do relé.',
    check:st=>{const s=clone(st.comps).map(c=>{if(c.type==='fuse'||c.type==='ft')c.trip=false;if(c.type==='btn')c.pressed=false;if(c.type==='kc')c.on=false;return c});
      const g=id=>s.find(c=>c.id===id),acesa=()=>{const r=solve(s,st.wires);if(r.short)throw 0;return r.lamp.L1>0.04};
      try{
        g('BL').pressed=true;if(!acesa())return L()?'Apertei o verde e a lâmpada não acendeu. O verde leva a fase até a bobina (A1); o A2 vai no neutro; o 1-2 da contatora liga a lâmpada.':'LIGA apertado e L1 apagada: o BL energiza A1-A2 e o contato 1-2 alimenta a carga.';
        g('BL').pressed=false;if(!acesa())return L()?'Soltei o verde e a lâmpada apagou: falta o selo. Ligue o 13-14 junto com o verde.':'Soltei o LIGA e L1 apagou: falta o selo 13-14 em paralelo com o LIGA.';
        g('BD').pressed=true;if(acesa())return L()?'Apertei o vermelho e a lâmpada não apagou. O vermelho fica antes do verde e do selo.':'DESLIGA acionado e L1 seguiu acesa: o NF vai em série, antes do LIGA e do selo.';
        g('BD').pressed=false;if(acesa())return 'Soltei o DESLIGA e L1 voltou sozinha: o selo tem que ficar depois do DESLIGA.';
        g('BL').pressed=true;acesa();g('BL').pressed=false;g('FT').trip=true;if(acesa())return L()?'O relé térmico desarmou e a lâmpada continuou: o 95-96 tem que estar no caminho da bobina.':'FT desarmado e L1 acesa: o 95-96 (NF) vai em série com a bobina.';
      }catch(e){return 'Curto-circuito: tem caminho sem carga entre fase e neutro.'}
      return null}}]))};
function encaixa3D(ctx){
  const vaga=app.querySelector('[data-vaga3d]');if(!vaga||!VISTA3D.vista)return false;
  /* a cena pertence à bancada que a criou: abrir outra bancada 3D (outra fase, "jogar de novo") monta uma cena nova */
  if(VISTA3D.no&&VISTA3D.noBancada!==ctx.bancada)solta3D();
  if(!VISTA3D.no){VISTA3D.no=document.createElement('div');VISTA3D.no.className='cena3d';VISTA3D.noBancada=ctx.bancada;VISTA3D.vista.montar(VISTA3D.no,ctx);VISTA3D.montagens++}
  vaga.replaceWith(VISTA3D.no);VISTA3D.vista.atualizar(ctx);return true;
}
function solta3D(){if(!VISTA3D.no)return;try{VISTA3D.vista.destruir()}catch(e){}VISTA3D.no=null}
/* saiu da bancada 3D (outra tela foi desenhada): libera o contexto WebGL. Roda depois do redesenho síncrono,
   quando a cena já foi reencaixada se a tela nova também for de bancada 3D. */
new MutationObserver(()=>{if(VISTA3D.no&&!VISTA3D.no.isConnected&&!app.querySelector('[data-vaga3d]'))solta3D()}).observe(app,{childList:true});

/* ---------- Contrato de intenções da bancada ----------
   As vistas (SVG ou 3D) só relatam o gesto do aluno; a regra de negócio fica em quem monta o ctl:
     tocouBorne(idBorne)        toque simples num borne (1º toque seleciona, 2º liga o fio)
     arrastouFio(idBorne, alvo) arrastou um fio de um borne até outro (alvo null = soltou fora)
     acionou(idPeca, lado)      tocou no corpo da peça (lado = posição do toque em relação ao centro)
     tirouFio(indice)           tocou num fio para tirar
   Este ligador é a parte exclusiva do SVG: traduz cliques e arrastos em intenções.
   o = {zm, pos(idBorne)→[x,y], centroX(idPeca), getSvg?, semArrasto?()→bool, ocupadoNoInicio?} */
function ligaSVGBancada(svg,ctl,o){
  const zm=o.zm,getSvg=o.getSvg||(()=>svg);
  svg.querySelectorAll('[data-sw]').forEach(h=>h.addEventListener('click',ev=>{if(zm.busy())return;ctl.acionou(h.dataset.sw,svgPoint(svg,ev).x-o.centroX(h.dataset.sw))}));
  svg.querySelectorAll('[data-w]').forEach(h=>h.addEventListener('click',()=>{if(zm.busy())return;ctl.tirouFio(+h.dataset.w)}));
  svg.querySelectorAll('[data-t]').forEach(h=>h.addEventListener('pointerdown',e=>{
    e.preventDefault();const a=h.dataset.t;
    if(o.ocupadoNoInicio&&zm.busy())return;
    if(o.semArrasto&&o.semArrasto()){ctl.tocouBorne(a);return}
    const p0=o.pos(a);let line=null;
    const move=ev=>{if(zm.busy()){if(line){line.remove();line=null}return}const s2=getSvg(),q=svgPoint(s2,ev);if(!line&&Math.hypot(q.x-p0[0],q.y-p0[1])>12){line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('class','w tmp');line.setAttribute('x1',p0[0]);line.setAttribute('y1',p0[1]);s2.appendChild(line)}if(line){line.setAttribute('x2',q.x);line.setAttribute('y2',q.y)}};
    const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      if(zm.busy()){if(line)line.remove();return}
      if(line){line.remove();const el=document.elementFromPoint(ev.clientX,ev.clientY);ctl.arrastouFio(a,(el&&el.getAttribute&&el.getAttribute('data-t'))||null)}
      else ctl.tocouBorne(a)};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  }));
}
/* Aviso da bancada CC: aqui os valores são calculados, com as premissas do modelo (js/cc.js) */
function avisoCC(){return '<details class="modelo"><summary>ⓘ Modelo de corrente contínua: valores calculados</summary>'+
  '<p>Tensões e correntes são <b>calculadas</b> pela lei de Ohm e pelas leis de Kirchhoff. Premissas: pilha de 1,5 V com resistência interna de 0,2 Ω; '+
  'lâmpada de lanterna de 3 V e 0,3 A tratada como resistor fixo de 10 Ω (no filamento real a resistência sobe com o calor); '+
  'a lâmpada queima acima de 1,35 vez a tensão nominal; regime permanente, sem transitórios.</p></details>'}
/* valores calculados nas lâmpadas da bancada CC: brilho no Leve; tensão e corrente no Técnico e no Profissional */
function chipsCC(st,res){const cc=res.cc;
  return '<div class="status">'+st.comps.filter(c=>c.type==='lamp').map(c=>{const l=cc.lampadas[c.id]||{V:0,I:0,brilho:0};
    if(c.queima)return '<span class="chip">'+c.id+': queimada</span>';
    return '<span class="chip'+(l.brilho>0.04?' lit':'')+'">'+c.id+': '+(L()?bright(l.brilho):ccN(l.V)+' V · '+ccN(l.I)+' A'+(S.mode==='full'?' · '+ccN(l.V*l.I)+' W':''))+'</span>'}).join('')+'</div>'}
/* Aviso fixo em toda bancada: o motor do jogo é qualitativo (Etapa 2 da revisão).
   Não apresentar a bancada como simulador quantitativo enquanto o motor V2 não existir. */
function avisoModelo(){return '<details class="modelo"><summary>ⓘ Modelo didático qualitativo: sem valores reais</summary>'+
  '<p>A bancada mostra se o circuito <b>liga</b>, <b>comanda</b>, <b>protege</b> e segue a norma. '+
  'Ela <b>não calcula</b> corrente, potência nem aquecimento, e as proteções atuam pela lógica da ligação, '+
  'não pelo valor e pelo tempo reais de atuação. O brilho da lâmpada e o giro do motor são ilustrativos.</p></details>'}

/* frame() sobe a tela para o topo. Na bancada, a partir do 2º desenho, volta para onde o aluno estava
   (no celular a bancada fica abaixo da dobra e cada fio ligado fazia a página pular). */
let benchY=0;
function keepScroll(again){if(again)window.scrollTo(0,benchY);benchY=window.scrollY}
window.addEventListener('scroll',()=>{benchY=window.scrollY},{passive:true});

/* Acionar a peça com um toque no corpo: interruptores mudam de posição, botoeira aperta e solta sozinha,
   DR e relé térmico disparam (teste/sobrecarga) ou rearmam, fotocélula vira dia/noite, boia enche/esvazia.
   lx = posição do toque em relação ao centro (no interruptor duplo, esquerda = seção 1).
   depois() redesenha quando a botoeira solta; BANCADA_ID evita redesenhar uma tela que já foi trocada. */
/* troca o número de fases da fonte (1, 2 ou 3 + N); os fios presos em borne de fase que deixou de existir saem.
   Usada pela Oficina e pelas bancadas das fases (a vista 3D pede com acionou(id, 'fases:n')). */
function aplicaFases(st,c,n){c.fases=Math.max(1,Math.min(3,n));st.wires=st.wires.filter(w=>[w.a,w.b].every(t=>{const [id,j]=t.split('.'),x=st.comps.find(y=>y.id===id);return x&&+j<terms(x).length}))}
/* Pontos de conexão da montagem: quantos condutores cada borne recebe no gabarito da fase (TESTE_SOL).
   Usa o gabarito do nível atual; se não houver, o de outro nível com as mesmas peças (todas usadas).
   É dica para o aluno (o que ligar e quantos fios); a conferência continua sendo o check da missão. */
function pontosDaMontagem(pid,st){if(typeof TESTE_SOL==='undefined')return null;
  const existe=t=>{const [id,j]=t.split('.'),c=st.comps.find(x=>x.id===id);return !!c&&+j<terms(c).length};
  for(const md of [S.mode,'leve','moderado','full']){const s=TESTE_SOL[pid+':'+md];if(!s)continue;
    if(!s.every(([a,b])=>existe(a)&&existe(b))||!st.comps.every(c=>s.some(([a,b])=>a.split('.')[0]===c.id||b.split('.')[0]===c.id)))continue;
    const n={};s.forEach(([a,b])=>{n[a]=(n[a]||0)+1;n[b]=(n[b]||0)+1});return n}
  return null}
let BANCADA_ID=0;
function acionarPeca(c,lx,depois){
  /* disjuntor: o toque liga e desliga (depois de um curto, religa; se o curto continuar, desarma de novo).
     Fonte: só religa a proteção depois de um curto. */
  if(c.type==='fuse'){c.trip=!c.trip;SW_FLIP=c.id;return}
  if(c.type==='src'&&c.trip){c.trip=false;return}
  /* lâmpada queimada (bancada CC): o toque troca por uma nova */
  if(c.type==='lamp'&&c.queima){c.queima=false;c.broken=false;c.show=false;return}
  if(c.type==='sw')flipSwitch(c);
  else if(c.type==='sw2'){const k=lx<0?'a':'b';c[k]=!c[k];SW_FLIP=c.id+'.'+k}
  else if(c.type==='sw3'||c.type==='sw4'){c.pos=c.pos?0:1;SW_FLIP=c.id}
  else if(c.type==='foto')c.noite=!c.noite;
  else if(c.type==='boia')c.vazia=!c.vazia;
  /* DR: o botão T ('test') simula a fuga e desarma (não rearma); o toque no corpo arma e desarma */
  else if(c.type==='dr'){if(lx==='test')c.trip=true;else c.trip=!c.trip;c.porFuga=false}
  else if(c.type==='ft')c.trip=!c.trip;
  else if(c.type==='btn'){c.pressed=true;const id=BANCADA_ID;setTimeout(()=>{c.pressed=false;if(id===BANCADA_ID&&document.querySelector('.bench'))depois&&depois()},700)}
}

/* ---------- Bancada: montar ---------- */
function runBuild(p,task){
  /* cc = fase de corrente contínua (pilhas): usa o simulador CC (js/cc.js) e a conferência da própria missão */
  const cc=!!p.cc,resolve=cc?(cs,ws)=>CC.paraBancada(CC.resolver(cs,ws)):solve;
  const st={comps:clone(task.comps),wires:[]};let sel=null,tries=0,msg=null,won=false,cor=cc?'pos':'fase',curto=null;
  /* depois de ligar um fio ou acionar uma peça: se fechou um curto, a proteção desarma e a bancada anima.
     Na bancada CC não há disjuntor: o curto esquenta a pilha e a sobretensão queima a lâmpada (calculados). */
  const checa=onde=>{
    if(!cc){const ev=protegeCurto(st,onde);if(ev){curto=ev;msg=msgCurto(ev)}return}
    const res=CC.resolver(st.comps,st.wires);
    const q=Object.entries(res.lampadas).find(([,l])=>l.queima);
    if(q){st.__vQueima=q[1].V;const c=st.comps.find(x=>x.id===q[0]);Object.assign(c,{broken:true,show:true,queima:true});msg=task.check(st,Math.max(1,tries))}
    else if(res.eventos.includes('curto')){curto={fios:CC.fiosDoCurto(st,res),onde,quem:null,nome:''};msg=task.check(st,Math.max(1,tries))}};
  const zm=benchZoom();let drawn=false,verPlanta=false;BANCADA_ID++;
  /* contrato de intenções: o que cada gesto faz nesta fase (vale igual para o SVG e para a vista 3D) */
  const ctl={
    tocouBorne:a=>{if(won)return;if(sel===null)sel=a;else if(sel===a)sel=null;else{addWire(sel,a);return}render()},
    arrastouFio:(a,b)=>{if(won)return;if(b&&b!==a)addWire(a,b);else render()},
    acionou:(id,lado)=>{const c=st.comps.find(x=>x.id===id);if(!c)return;
      /* fonte: configurar 1F+N, 2F+N ou 3F+N */
      if(c.type==='src'&&typeof lado==='string'&&lado.startsWith('fases:')){aplicaFases(st,c,+lado.slice(6));sel=null;msg=null;render();return}
      acionarPeca(c,lado,render);msg=null;checa(c.id);render()},
    tirouFio:i=>{if(won||!st.wires[i])return;st.wires.splice(i,1);msg=null;render()}
  };
  const bancadaId=BANCADA_ID;BANCADA.st=st;
  const pontos=pontosDaMontagem(p.id,st);/* leve e moderado: contador ligados/esperados; full: só o anel */
  const render=()=>{
    const r=resolve(st.comps,st.wires),R=vistaReal(),v3=quer3D(st),p3=pode3D(st),yAntes=benchY;
    VISTA3D.redesenha={id:bancadaId,f:render};
    if(p3&&VISTA3D.ligada&&!VISTA3D.vista&&!VISTA3D.erro)carrega3D();/* 3D é o padrão: baixa o Three.js na primeira bancada */
    const help='Toque em dois '+(R?'parafusos':'pontos ⚪')+' para ligar um fio.'+(L()?' Toque no fio para tirar.':'');
    const pl=typeof PLANTAS!=='undefined'&&PLANTAS[p.id];
    frame(p,missao(task.goal,task.real)+
      /* fases com projeto: a planta de fiação abre e fecha acima da bancada */
      (pl?'<button class="btn planta-btn" id="vplanta" aria-expanded="'+verPlanta+'">📄 '+(verPlanta?'Fechar a planta':'Ver a planta do projeto')+'</button>'+(verPlanta?plantaHTML(pl):''):'')+
      (won?'':palette(cor,cc?['pos','neg']:null))+benchWrap(v3?'':board(st,{res:r,sel,pickTerm:!won,pickWire:!won,toggle:true,real:R,vb:zm.vb(),curto}),'',zm,cc,v3,p3)+(cc?chipsCC(st,r):statusChips(st,r))+
      (msg?'<div class="fb '+(won?'good':'bad')+'">'+(won?pick(PRAISE[S.mode])+' ':'')+msg+(won&&L()&&!cc?'<br><small>Na vida real, só eletricista mexe na rede, e com tudo desligado.</small>':'')+'</div>':st.wires.length?'':'<p class="help">'+help+'</p>')+
      (won?'<button class="btn main" id="end">Concluir ⚡</button>':'<div class="row"><button class="btn ghost" id="clr">Limpar fios</button><button class="btn main" id="chk">Verificar</button></div>'));
    const curtoAgora=curto,drawnAntes=drawn;keepScroll(drawn);drawn=true;curto=null;/* a animação do curto roda uma vez só */
    if(!v3)zm.bind(app.querySelector('.bench'),app);
    /* modo teste: "Montar pra mim" monta o gabarito e já aprova (não sobra nada para verificar) */
    const ts=document.getElementById('tSol');if(ts)ts.onclick=()=>{st.wires=testeSol(p.id);st.comps.forEach(c=>{if(c.type==='fuse'||c.type==='src')c.trip=false;if(c.queima)Object.assign(c,{queima:false,broken:false,show:false})});sel=null;msg=null;verificar()};
    const vp=document.getElementById('vplanta');if(vp)vp.onclick=()=>{verPlanta=!verPlanta;render()};
    app.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{setVista(b.dataset.vista==='real');render()});
    app.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>{cor=b.dataset.cor;render()});
    app.querySelectorAll('[data-3d]').forEach(b=>b.onclick=()=>{escolhe3D(b.dataset['3d']==='1');if(VISTA3D.ligada&&!VISTA3D.vista)carrega3D();sel=null;render()});
    app.querySelectorAll('[data-girar]').forEach(b=>b.onclick=()=>{VISTA3D.girar=!VISTA3D.girar;sel=null;render()});
    /* centro da bancada: a vista 3D (se ligada) ou o SVG; as duas falam com o mesmo ctl */
    /* a tela é redesenhada inteira: até a cena 3D voltar para a vaga, a página fica mais curta e o navegador puxa
       a rolagem para cima. Depois de encaixar a cena, devolve a rolagem de antes do toque (a bancada não "sobe"). */
    const reencaixa=()=>{if(drawnAntes&&Math.abs(window.scrollY-yAntes)>1){window.scrollTo(0,yAntes)}benchY=window.scrollY};
    if(!(v3&&encaixa3D({st,res:r,sel,curto:curtoAgora,cor,editavel:!won,ctl,bancada:bancadaId,girar:!!VISTA3D.girar,cc,pontos,dica:S.mode==='full'?'ponto':'conta'})))
      ligaSVGBancada(app.querySelector('.bench svg'),ctl,{zm,pos:t=>tpos(st.comps,t),centroX:id=>{const c=st.comps.find(x=>x.id===id);return R?RP(c)[0]:c.x}});
    reencaixa();
    const c=document.getElementById('clr');if(c)c.onclick=()=>{st.wires=[];sel=null;msg=null;render()};
    const k=document.getElementById('chk');if(k)k.onclick=verificar;
    const e=document.getElementById('end');if(e)e.onclick=()=>finish(p,Math.max(1,4-tries),3);
  };
  const verificar=()=>{const desl=st.comps.find(c=>(c.type==='fuse'||c.type==='src')&&c.trip);
    if(desl){msg=desarmadoMsg(desl);render();return}
    tries++;const m=cc?task.check(st,tries):task.check(st)||normCheck(st)||colorCheck(st);if(m){msg=m}else{won=true;st.comps.forEach(c=>{if(c.type==='sw')c.closed=true});/* liga tudo: a luz acende como recompensa */
    /* comandos: um toque no LIGA / pulsador e a caixa vazia, para o motor girar e a luz do relé acender */
    st.comps.forEach(c=>{if(c.type==='ft'||c.type==='dr')c.trip=false;if(c.type==='boia')c.vazia=true;if(c.type==='foto')c.noite=true});
    st.comps.filter(c=>c.type==='btn'&&!c.nf).slice(0,1).forEach(c=>{c.pressed=true;solve(st.comps,st.wires);c.pressed=false;solve(st.comps,st.wires)});msg=cc&&task.sucesso?task.sucesso(st):'Testei todas as posições dos interruptores e conferi as cores: aprovado!';S.xp+=tries===1?30:15;save()}render()};
  const addWire=(a,b)=>{sel=null;msg=null;if(!st.wires.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a))){st.wires.push(Object.assign(W(a,b),{cor}));checa(b)}render()};
  render();
}

/* ---------- Bancada: prever ---------- */
function runPredict(p,list){
  let i=0,ok=0;const res=[];const zm=benchZoom();
  const render=()=>{
    const it=list[i],st=it.sc(),opts=shuffle(it.o.map((t,k)=>({t,k})));
    let after=false;
    const draw=()=>{const r=solve(st.comps,st.wires);return benchWrap(board(st,{res:r,cls:after?'flash':'',real:vistaReal(),vb:zm.vb()}),'',zm)+statusChips(st,r,true)};
    const bindBd=()=>{zm.bind(document.querySelector('#bd .bench'),app);
      app.querySelectorAll('#bd [data-vista]').forEach(b=>b.onclick=()=>{setVista(b.dataset.vista==='real');after=false;document.getElementById('bd').innerHTML=draw();bindBd()})};
    frame(p,progBar(list.length,i,res)+missao(it.acao,[['🔧','🏫','bancada de treino da oficina']],'','AÇÃO')+'<div id="bd">'+draw()+'</div>'+
      '<div class="qcard"><p class="q">'+it.q+'</p></div><div class="opts">'+opts.map(o=>'<button class="btn opt" data-k="'+o.k+'">'+o.t+'</button>').join('')+'</div><div id="fb" class="opts"></div>');
    bindBd();
    app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
      const right=+b.dataset.k===0;
      app.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.k===0)x.classList.add('right')});
      if(!right)b.classList.add('wrong');
      res[i]=right;if(right){ok++;S.xp+=10;save()}
      it.act(st);after=true;document.getElementById('bd').innerHTML=draw();bindBd();
      document.getElementById('fb').innerHTML='<div class="fb '+(right?'good':'bad')+'">'+(right?pick(PRAISE[S.mode])+' ':'Olha o que aconteceu! ')+it.w+'</div>'+nextBtn(i===list.length-1);
      document.getElementById('nx').onclick=()=>{i++;i<list.length?render():finish(p,ok,list.length)};
    });
  };
  render();
}

/* ---------- Multímetro com ponteiras ----------
   O aparelho fica acima da bancada (visor, chave em V~, bornes VΩ e COM); os cabos descem até a bancada
   e o aluno arrasta as pontas até os parafusos. Tocar num parafuso também leva uma ponta até ele. */
function multimetroHTML(v,dica){
  const val=v===null||v===undefined?'– – –':v.toFixed(v<10?2:1).replace('.',',');
  return '<div class="mm"><div class="mm-corpo" aria-label="Multímetro: '+(v===null||v===undefined?'sem leitura':val+' volts')+'">'+
    '<div class="mm-lcd"><b>'+val+'</b><small>V~</small></div>'+
    '<div class="mm-baixo"><div class="mm-dial" aria-hidden="true"><i></i><span>V~</span></div>'+
    '<div class="mm-bornes" aria-hidden="true"><span><i class="vr"></i>VΩ</span><span><i class="pr"></i>COM</span></div></div></div>'+
    '<p class="help">'+dica+'</p></div>'}
function dicaPonteiras(pt){return !pt.r.t&&!pt.k.t?'Arraste a <b style="color:#ff6b5e">ponta vermelha</b> e a <b>ponta preta</b> até dois parafusos (ou toque nos parafusos).'
  :!(pt.r.t&&pt.k.t)?'Agora leve a outra ponta a um parafuso.':'Medindo a tensão entre os dois pontos (CA, valor eficaz). Arraste uma ponta para medir em outro lugar.'}
/* arrastar as pontas: segue o dedo e, ao soltar, encaixa no parafuso mais perto (ou fica solta) */
function ligaPonteiras(svg,comps,pt,mudou,zm){
  svg.querySelectorAll('[data-ponta]').forEach(g=>g.addEventListener('pointerdown',e=>{
    if(zm&&zm.busy())return;e.preventDefault();e.stopPropagation();
    const id=g.dataset.ponta,P=pt[id],p0=pontaPos(comps,P),q0=svgPoint(svg,e),off=[p0[0]-q0.x,p0[1]-q0.y];let andou=false;
    const cabo=svg.querySelector('[data-cabo="'+id+'"]');
    const mv=ev=>{if(zm&&zm.busy())return;const q=svgPoint(svg,ev);P.p=[q.x+off[0],q.y+off[1]];andou=true;
      g.setAttribute('transform','translate('+P.p[0].toFixed(1)+' '+P.p[1].toFixed(1)+')');if(cabo)cabo.setAttribute('d',caboD(id,P.p))};
    const up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      if(!andou)return;const t=bornePerto(comps,P.p);P.t=t;if(t)P.p=tpos(comps,t).slice();mudou(id)};
    window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)}));
}
/* toque num parafuso: leva a ponta que ainda está solta (ou a que não foi a última usada) */
function tocaPonteira(comps,pt,t,ultima){const id=!pt.r.t?'r':!pt.k.t?'k':ultima==='r'?'k':'r';pt[id].t=t;pt[id].p=tpos(comps,t).slice();return id}

/* ---------- Bancada: caça-defeito ---------- */
function diagCircuit(V){return withPE({comps:[BAT(),C('F','fuse',125,48,0,{lab:'DJ'}),C('S1','sw',225,48,0,{closed:true}),C('L1','lamp',300,140,1)],
  wires:[W('B.0','F.0','v'),W('F.1','S1.0'),W('S1.1','L1.0','h'),W('L1.1','B.1','h')]})}
function runDiag(p,d){
  const ROUNDS=2;let round=0,score=0;const zm=benchZoom();
  const startRound=()=>{let drawn=false;
    const st=diagCircuit(d.V||rede().V);const fault=pick(d.cand);
    if(fault[0]==='w')st.wires[+fault.slice(1)].broken=true;else st.comps.find(c=>c.id===fault).broken=true;
    /* multímetro com as duas ponteiras: a medição conta quando as duas pontas estão em parafusos */
    let tool=L()?'test':'meter',pt=novasPonteiras(),ultima=null,tags={},measures=0,wrong=0,fixed=false,msg=null,hint=false;
    const mede=()=>{if(pt.r.t&&pt.k.t)measures++;msg=null};
    const render=()=>{
      const r=solve(st.comps,st.wires);
      const toolNames=L()?['test','🔍 Testar peça']:['meter','📏 Medir tensão'];
      const meter=L()?'':multimetroHTML(leituraPonteiras(st.comps,r,pt),dicaPonteiras(pt));
      frame(p,progBar(ROUNDS,round,[score>=2])+
        missao(L()?'A lâmpada da cozinha não acende. Teste as peças e troque só a que quebrou.':'Cliente relata: a lâmpada da cozinha não acende; o resto da casa funciona. Ache a falha com até '+d.limit+' medições.',
          [['L1','💡','lâmpada da cozinha'],['S1','🔘','interruptor da cozinha'],['DJ','🎚','disjuntor da cozinha no quadro']],'','CHAMADO')+
        '<div class="seg"><button class="btn" id="t1" aria-pressed="'+(tool!=='fix')+'">'+toolNames[1]+'</button><button class="btn" id="t2" aria-pressed="'+(tool==='fix')+'">🔧 '+(S.mode==='full'?'Reparar':'Trocar')+'</button></div>'+
        (tool==='meter'?meter:'')+
        benchWrap(board(st,{res:r,ponteiras:tool==='meter'?pt:null,tags:tool==='test'||tool==='fix'?tags:null,real:vistaReal(),vb:zm.vb(),
           pickTerm:tool==='meter'&&!fixed,pickComp:(tool==='test'||tool==='fix')&&!fixed,pickWire:tool==='fix'&&!fixed&&S.mode==='full'}),'',zm)+
        '<div class="status"><span class="chip">'+(L()?'Testes: ':'Medições: ')+measures+(L()?'':' / '+d.limit)+'</span>'+(wrong?'<span class="chip">Trocas erradas: '+wrong+'</span>':'')+'</div>'+
        (msg?'<div class="fb '+(fixed?'good':msg.bad?'bad':'info')+'">'+msg.t+'</div>':'<p class="help">'+(tool==='fix'?(S.mode==='full'?'Toque na peça ou no fio (conexão frouxa) com defeito.':'Toque na peça que você quer trocar.'):tool==='test'?'Toque numa peça para testar se a energia passa por ela.':'')+'</p>')+
        (fixed?'<button class="btn main" id="nx">'+(round<ROUNDS-1?'Próximo chamado →':'Concluir')+'</button>':(!L()&&!hint&&measures>=2?'<button class="btn ghost sm" id="hint">💡 Dica</button>':'')));
      keepScroll(drawn);drawn=true;
      const svg=app.querySelector('.bench svg');
      zm.bind(app.querySelector('.bench'),app);
      app.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{setVista(b.dataset.vista==='real');render()});
      document.getElementById('t1').onclick=()=>{tool=L()?'test':'meter';msg=null;render()};
      document.getElementById('t2').onclick=()=>{tool='fix';msg=null;render()};
      svg.querySelectorAll('[data-t]').forEach(h=>h.addEventListener('click',()=>{
        if(zm.busy())return;ultima=tocaPonteira(st.comps,pt,h.dataset.t,ultima);mede();render()}));
      if(tool==='meter')ligaPonteiras(svg,st.comps,pt,id=>{ultima=id;mede();render()},zm);
      svg.querySelectorAll('[data-c]').forEach(h=>h.addEventListener('click',()=>{
        if(zm.busy())return;const c=st.comps.find(x=>x.id===h.dataset.c);
        if(tool==='test'){measures++;tags[c.id]=!c.broken;msg=null;speak(c.broken?'não passa':'passa');render();return}
        tryFix(c.broken,()=>{c.broken=false},c.id+' ('+NAME[c.type]+')')}));
      svg.querySelectorAll('[data-w]').forEach(h=>h.addEventListener('click',()=>{if(zm.busy())return;const w=st.wires[+h.dataset.w];tryFix(w.broken,()=>{w.broken=false},'a conexão do fio')}));
      const nx=document.getElementById('nx');if(nx)nx.onclick=()=>{round++;round<ROUNDS?startRound():finish(p,score,ROUNDS*2)};
      const hb=document.getElementById('hint');if(hb)hb.onclick=()=>{hint=true;msg={t:'Num circuito série aberto, quase toda tensão aparece sobre o ponto aberto. Peças boas medem 0 V.'};render()};
    };
    const tryFix=(isBad,repair,label)=>{
      if(isBad){repair();fixed=true;const pts=(wrong===0?1:0)+(measures<=d.limit?1:0);score+=pts;S.xp+=10*pts+5;save();
        msg={t:'Era '+label+'! '+(wrong===0&&measures<=d.limit?'Diagnóstico limpo.':wrong?'Funcionou, mas trocou peça boa antes.':'Achou, mas mediu mais que o necessário.')}}
      else{wrong++;msg={bad:true,t:'Você '+(S.mode==='full'?'mexeu em':'trocou')+' '+label+', mas continua tudo apagado. Essa estava boa.'}}
      render();
    };
    render();
  };
  startRound();
}

/* ---------- Bibliotecas de peças (uma por capítulo da história) ----------
   [chave, ícone, nome]. A chave vira o tipo da peça (as botoeiras são o tipo 'btn' com nf). */
const BIBLIOTECAS={
  fundamentos:{nome:'⚡ Fundamentos',pecas:[['lamp','💡','Lâmpada'],['sw','🔘','Interruptor simples'],['fuse','🎚️','Disjuntor'],['haste','⏚','Haste de aterramento'],['bep','🟫','BEP (barramento de terra)']]},
  predial:{nome:'🏠 Predial',pecas:[['sw2','🔘','Interruptor duplo'],['sw3','🔀','Interruptor paralelo'],['sw4','✖️','Interruptor intermediário'],
    ['dr','🛡️','DR (diferencial)'],['dps','⚡','DPS (surto)'],['foto','🌙','Fotocélula'],['ri','🔁','Relé de impulso'],['btnNA','🟢','Pulsador (NA)']]},
  industrial:{nome:'🏭 Industrial',pecas:[['motor','⚙️','Motor monofásico'],['kc','🧲','Contatora'],['ft','🌡️','Relé térmico'],['btnNA','🟢','Botoeira liga (NA)'],['btnNF','🔴','Botoeira desliga (NF)'],['boia','💧','Boia de nível']]}
};

/* ---------- Oficina livre (sandbox) ---------- */
function runSandbox(){
  setMode();
  let sb=S.sandbox&&S.sandbox.comps&&S.sandbox.comps.some(c=>c.type==='src')?clone(S.sandbox):{comps:[BAT()],wires:[]};
  /* circuitos salvos antes do bocal sem PE: tira fios presos a bornes que não existem mais */
  sb.wires=sb.wires.filter(w=>[w.a,w.b].every(t=>{const [id,k]=t.split('.'),c=sb.comps.find(x=>x.id===id);return c&&+k<terms(c).length}));
  sb.comps.forEach(c=>{if(c.type==='btn')c.pressed=false});
  let tool='build',cor='fase',sel=null,selC=null,pt=novasPonteiras(),ultima=null,msg=null,sure=false,box=false,cat='fundamentos',curto=null;
  const checa=onde=>{const ev=protegeCurto(sb,onde);if(ev){curto=ev;msg={bad:1,t:msgCurto(ev)}}};
  const zm=benchZoom();let drawn=false;BANCADA_ID++;
  const persist=()=>{S.sandbox=sb;save()};
  const SPOTS=[[115,60],[185,60],[255,60],[308,60],[115,165],[185,165],[255,165],[308,165],[150,112],[230,112],[290,112]];
  const acionar=(c,lx)=>acionarPeca(c,lx,()=>{persist();render()});
  const getSvg=()=>document.querySelector('#bench svg');
  const sc=()=>sb.comps.find(c=>c.id===selC);
  const benchHTML=()=>{const r=solve(sb.comps,sb.wires);return benchWrap(board(sb,{res:r,sel,selC,move:tool==='build',pickTerm:true,pickWire:tool==='build',ponteiras:tool==='meter'?pt:null,real:vistaReal(),vb:zm.vb(),curto}),'bench',zm)+statusChips(sb,r)};
  const redrawBench=()=>{document.getElementById('bw').innerHTML=benchHTML();bindBench()};
  const add=key=>{
    if(sb.comps.length>=14){msg={bad:1,t:'Bancada cheia: no máximo 13 peças além da fonte.'};render();return}
    const type=key.startsWith('btn')?'btn':key;
    const pre={lamp:'L',sw:'S',sw2:'SD',sw3:'SP',sw4:'SI',fuse:'DJ',dr:'DR',dps:'DPS',foto:'FC',ri:'RI',boia:'BO',motor:'M',kc:'K',ft:'FT',btnNA:'BL',btnNF:'BD',haste:'H',bep:'BEP'}[key];let n=1;while(sb.comps.some(c=>c.id===pre+n))n++;
    const ex={sw:{closed:false},sw2:{a:false,b:false},sw3:{pos:0},sw4:{pos:0},foto:{noite:false},boia:{vazia:true},btnNA:{nf:false},btnNF:{nf:true}}[key]||{};
    /* haste e BEP vão para o canto de baixo, perto da fonte (a haste fica no solo) */
    const livre=([x,y])=>!sb.comps.some(c=>Math.hypot(c.x-x,c.y-y)<(key==='haste'||key==='bep'?40:60));
    const spot=(key==='haste'?[[45,205],[130,215],[200,215]]:key==='bep'?[[95,192],[100,150]]:[]).concat(SPOTS).find(livre)||[185,112];
    sb.comps.push(C(pre+n,type,spot[0],spot[1],0,ex));selC=pre+n;msg=null;persist();render()};
  const addWire=(a,b)=>{sel=null;msg=null;if(!sb.wires.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a))){sb.wires.push(Object.assign(W(a,b),{cor}));checa(b)}persist();render()};
  /* contrato de intenções da Oficina (mesmo formato do runBuild). No modo Medir, tocar num borne encaixa a ponteira. */
  const ctl={
    tocouBorne:a=>{if(tool==='meter'){ultima=tocaPonteira(sb.comps,pt,a,ultima);render();return}
      if(sel===null)sel=a;else if(sel===a)sel=null;else{addWire(sel,a);return}render()},
    arrastouFio:(a,b)=>{if(b&&b!==a)addWire(a,b);else render()},
    acionou:(id,lado)=>{const c=sb.comps.find(x=>x.id===id);if(!c)return;msg=null;selC=c.id;acionar(c,lado);checa(c.id);persist();render()},
    tirouFio:i=>{if(!sb.wires[i])return;sb.wires.splice(i,1);persist();render()}
  };
  const render=()=>{
    const c=sc();
    /* botões de ação da peça selecionada */
    const acoes=c?({sw:[['x',c.closed?'Abrir':'Fechar']],sw2:[['-1','Seção 1'],['1','Seção 2']],sw3:[['x','Inverter']],sw4:[['x','Inverter']],foto:[['x',c.noite?'Virar dia':'Virar noite']],boia:[['x',c.vazia?'Encher a caixa':'Esvaziar a caixa']],dr:[['x',c.trip?'Rearmar':'Testar']],
      ft:[['x',c.trip?'Rearmar':'Simular sobrecarga']],btn:[['x','Apertar']],fuse:[['x',c.trip?'Ligar':'Desligar']],
      src:[1,2,3].map(n=>['f'+n,(nFases(c)===n?'✓ ':'')+n+(n===1?' fase':' fases')+' + N'])}[c.type]||[]):[];
    const drFuga=sb.comps.find(x=>x.type==='dr'&&x.trip&&x.porFuga);
    frame({nome:'Oficina Livre'},
      /* tudo de montar fica numa caixa de ferramentas; fechada, mostra só o que está sendo feito */
      '<div class="caixa-bar"><button class="btn" id="cx" aria-expanded="'+box+'">🧰 Caixa de ferramentas</button>'+
        '<span class="chip modo">'+(tool==='build'?'<span class="sw8" style="background:'+CORES[cor].c+'"></span>Fio '+CORES[cor].n:'📏 Medindo')+'</span></div>'+
      (box?'<div class="caixa">'+
        '<span class="eyebrow">O que fazer</span><div class="seg"><button class="btn" data-tool="build" aria-pressed="'+(tool==='build')+'">🔌 Montar</button><button class="btn" data-tool="meter" aria-pressed="'+(tool==='meter')+'">📏 Medir</button></div>'+
        '<span class="eyebrow">Cor do fio</span>'+palette(cor)+
        '<span class="eyebrow">Biblioteca de peças</span><div class="seg3">'+Object.entries(BIBLIOTECAS).map(([k,b])=>'<button class="btn" data-cat="'+k+'" aria-pressed="'+(cat===k)+'">'+b.nome+'</button>').join('')+'</div>'+
        '<div class="pecas">'+BIBLIOTECAS[cat].pecas.map(([k,e,n])=>'<button class="btn peca" data-add="'+k+'"><span class="pe">'+e+'</span><span>'+n+'</span></button>').join('')+'</div>'+
        '<button class="btn ghost sm" id="cxf">Fechar a caixa</button></div>':'')+
      (tool==='meter'?multimetroHTML(leituraPonteiras(sb.comps,solve(sb.comps,sb.wires),pt),dicaPonteiras(pt)):'')+
      '<div id="bw">'+benchHTML()+'</div>'+
      (c&&tool==='build'?'<div class="row" style="align-items:center"><span class="chip">'+c.id+'</span>'+(vistaReal()?'':'<button class="btn sm" id="rot">↻ Girar</button>')+acoes.map(([k,t])=>'<button class="btn sm" data-ac="'+k+'">'+t+'</button>').join('')+(c.type!=='src'?'<button class="btn sm danger" id="del">🗑 Remover</button>':'')+'</div>':'')+
      (msg?'<div class="fb '+(msg.bad?'bad':'good')+'">'+msg.t+'</div>':drFuga?'<div class="fb info">🛡️ O '+drFuga.id+' desarmou: tem corrente escapando para o terra. Ache a fuga e toque no DR para rearmar.</div>':tool==='build'&&!sb.wires.length?'<p class="help">Abra a caixa para pegar peças. Toque em dois '+(vistaReal()?'parafusos':'pontos ⚪')+' para ligar um fio.</p>':'')+
      '<div class="row"><button class="btn ghost" id="clr">'+(sure?'Toque de novo para limpar':'Limpar bancada')+'</button><button class="btn main" id="insp">🔎 Inspecionar</button></div>');
    keepScroll(drawn);drawn=true;curto=null;/* a animação do curto roda uma vez só */
    document.getElementById('cx').onclick=()=>{box=!box;render()};
    const cxf=document.getElementById('cxf');if(cxf)cxf.onclick=()=>{box=false;render()};
    app.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{tool=b.dataset.tool;pt=novasPonteiras();sel=null;if(tool==='meter')selC=null;msg=null;box=false;render()});
    app.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{cat=b.dataset.cat;render()});
    app.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{box=false;tool='build';add(b.dataset.add)});
    app.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{setVista(b.dataset.vista==='real');render()});
    app.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>{cor=b.dataset.cor;tool='build';box=false;render()});
    const rot=document.getElementById('rot');if(rot)rot.onclick=()=>{c.v=!c.v;persist();render()};
    app.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>{const k=b.dataset.ac;
      /* fonte: troca o número de fases; fios presos em borne de fase que deixou de existir saem */
      if(k[0]==='f'){aplicaFases(sb,c,+k.slice(1));
        pt=novasPonteiras();msg={t:'Fonte: '+fonteTxt(c)+'.'};persist();render();return}
      acionar(c,k==='-1'?-1:1);checa(c.id);persist();render()});
    const del=document.getElementById('del');if(del)del.onclick=()=>{sb.comps=sb.comps.filter(x=>x!==c);sb.wires=sb.wires.filter(w=>!w.a.startsWith(c.id+'.')&&!w.b.startsWith(c.id+'.'));selC=null;persist();render()};
    document.getElementById('clr').onclick=()=>{if(!sure){sure=true;render();return}sure=false;sb={comps:[BAT()],wires:[]};selC=null;sel=null;pt=novasPonteiras();msg=null;persist();render()};
    document.getElementById('insp').onclick=()=>{
      const r=solve(sb.comps,sb.wires);const nl=Object.values(r.lamp).filter(b=>b>0.04).length;
      const desl=sb.comps.find(c=>(c.type==='fuse'||c.type==='src')&&c.trip);
      if(desl)msg={bad:1,t:desarmadoMsg(desl)};
      else if(!sb.wires.length)msg={bad:1,t:'Ainda não tem nenhum fio na bancada.'};
      else if(r.short)msg={bad:1,t:'Curto-circuito! Há um caminho sem carga entre fase e neutro (ou terra). Na vida real, o disjuntor desarmaria.'};
      else{const m=normCheck(sb)||colorCheck(sb);msg=m?{bad:1,t:m}:{t:'Inspeção aprovada: cores conforme a norma e '+nl+' carga(s) ligada(s) agora.'}}
      if(!msg.bad){S.xp+=2;S.flags.ofi=1;markDaily('ofi');save()}render()};
    bindBench();
  };
  const bindBench=()=>{
    const svg=getSvg();
    zm.bind(document.getElementById('bench'),app);
    if(tool==='meter')ligaPonteiras(svg,sb.comps,pt,id=>{ultima=id;render()},zm);
    /* fios, bornes e acionamento: as mesmas intenções do runBuild */
    ligaSVGBancada(svg,ctl,{zm,getSvg,pos:t=>tpos(sb.comps,t),centroX:id=>{const c=sb.comps.find(x=>x.id===id);return vistaReal()?RP(c)[0]:c.x},
      semArrasto:()=>tool==='meter',ocupadoNoInicio:true});
    /* arrastar peça é só da Oficina (arruma a bancada); um toque sem arrastar aciona a peça */
    svg.querySelectorAll('[data-mv]').forEach(h=>h.addEventListener('pointerdown',e=>{
      e.preventDefault();const c=sb.comps.find(x=>x.id===h.dataset.mv),q0=svgPoint(svg,e),ox=c.x,oy=c.y;let moved=false;
      const move=ev=>{if(zm.busy())return;const q=svgPoint(getSvg(),ev),dx=q.x-q0.x,dy=q.y-q0.y;if(!moved&&Math.hypot(dx,dy)<6)return;moved=true;
        c.x=Math.max(34,Math.min(306,Math.round((ox+dx)/5)*5));c.y=vistaReal()?Math.max(REAL_Y[0],Math.min(REAL_Y[1],Math.round((oy+dy)/5)*5)):Math.max(34,Math.min(216,Math.round((oy+dy)/5)*5));redrawBench()};
      const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
        if(zm.busy()){c.x=ox;c.y=oy;render();return}
        if(!moved)ctl.acionou(c.id,q0.x-(vistaReal()?RP(c)[0]:c.x));else{msg=null;persist();render()}};
      window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)}));
  };
  render();
}

