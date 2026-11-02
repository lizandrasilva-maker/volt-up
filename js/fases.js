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
function runSort(p,list){
  list=shuffle(list);let i=0,ok=0;const res=[];
  const render=()=>{
    const it=list[i];let tries=0;
    frame(p,progBar(list.length,i,res)+'<div class="item" id="it"><span class="em">'+it.i+'</span><b>'+it.t+'</b></div>'+
      '<div class="bins"><button class="btn bin r" data-r="1">♻️ Renovável</button><button class="btn bin n" data-r="0">⛔ Não renovável</button></div><div id="fb" class="opts"></div>',
      L()?'Essa energia acaba ou a natureza repõe?':'Classifique a fonte.');
    app.querySelectorAll('.bin').forEach(b=>b.onclick=()=>{
      tries++;const right=+b.dataset.r===it.r;const fb=document.getElementById('fb');
      if(right||!L()){
        res[i]=right&&tries===1;if(res[i]){ok++;S.xp+=10;save()}
        app.querySelectorAll('.bin').forEach(x=>x.disabled=true);if(!right)document.getElementById('it').classList.add('shake');
        fb.innerHTML='<div class="fb '+(right?'good':'bad')+'">'+(right?pick(PRAISE[S.mode]):(it.r?'É renovável.':'Não é renovável.'))+' '+it.w+'</div>'+nextBtn(i===list.length-1);
        document.getElementById('nx').onclick=()=>{i++;i<list.length?render():finish(p,ok,list.length)};
      }else{document.getElementById('it').classList.add('shake');b.disabled=true;fb.innerHTML='<div class="fb bad">Quase! Pensa: ela pode acabar um dia?</div>'}
    });
  };
  render();
}

/* ---------- Bancada: montar ---------- */
function runBuild(p,task){
  const st={comps:clone(task.comps),wires:[]};let sel=null,tries=0,msg=null,won=false,cor='fase';
  const help=L()?'Toque num ponto ⚪ e depois em outro para ligar um fio (ou arraste). Toque no fio para tirar. Toque no interruptor para abrir e fechar.':'Toque/arraste entre terminais para ligar. Toque no fio para remover. Toque na chave para comutar e testar ao vivo.';
  const render=()=>{
    const r=solve(st.comps,st.wires);
    frame(p,'<div class="goal"><span class="gi">MISSÃO</span><span>'+task.goal+(L()?'<br><small>Cores: fase vermelha · neutro azul · terra verde-amarelo. Na vida real, só eletricista mexe na rede, com tudo desligado.</small>':' Cores da NBR 5410: neutro azul-claro, PE verde-amarelo.')+'</span></div>'+
      realHTML(task.real)+(won?'':palette(cor))+entrada()+'<div class="bench">'+board(st,{res:r,sel,pickTerm:!won,pickWire:!won,toggle:true})+'</div>'+statusChips(st,r)+
      (msg?'<div class="fb '+(won?'good':'bad')+'">'+msg+'</div>':'<p class="help">'+help+'</p>')+
      (won?'<button class="btn main" id="end">Concluir ⚡</button>':'<div class="row"><button class="btn ghost" id="clr">Limpar fios</button><button class="btn main" id="chk">Verificar</button></div>'),
      won?pick(PRAISE[S.mode])+' Missão cumprida!':tries?'Teste mexendo nos interruptores.':pick(CHEER[S.mode]));
    const svg=app.querySelector('.bench svg');
    app.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>{cor=b.dataset.cor;render()});
    svg.querySelectorAll('[data-sw]').forEach(h=>h.addEventListener('click',()=>{const c=st.comps.find(x=>x.id===h.dataset.sw);c.closed=!c.closed;msg=null;render()}));
    svg.querySelectorAll('[data-w]').forEach(h=>h.addEventListener('click',()=>{st.wires.splice(+h.dataset.w,1);msg=null;render()}));
    svg.querySelectorAll('[data-t]').forEach(h=>h.addEventListener('pointerdown',e=>{
      e.preventDefault();const a=h.dataset.t,p0=tpos(st.comps,a);let line=null;
      const move=ev=>{const q=svgPoint(svg,ev);if(!line&&Math.hypot(q.x-p0[0],q.y-p0[1])>12){line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('class','w tmp');line.setAttribute('x1',p0[0]);line.setAttribute('y1',p0[1]);svg.appendChild(line)}if(line){line.setAttribute('x2',q.x);line.setAttribute('y2',q.y)}};
      const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
        if(line){line.remove();const el=document.elementFromPoint(ev.clientX,ev.clientY);const b=el&&el.getAttribute&&el.getAttribute('data-t');if(b&&b!==a)addWire(a,b);else render()}
        else{if(sel===null)sel=a;else if(sel===a)sel=null;else{addWire(sel,a);return}render()}};
      window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
    }));
    const c=document.getElementById('clr');if(c)c.onclick=()=>{st.wires=[];sel=null;msg=null;render()};
    const k=document.getElementById('chk');if(k)k.onclick=()=>{tries++;const m=task.check(st)||normCheck(st)||colorCheck(st);if(m){msg=m}else{won=true;msg='Testei todas as posições dos interruptores e conferi as cores: aprovado!';S.xp+=tries===1?30:15;save()}render()};
    const e=document.getElementById('end');if(e)e.onclick=()=>finish(p,Math.max(1,4-tries),3);
  };
  const addWire=(a,b)=>{sel=null;msg=null;if(!st.wires.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a)))st.wires.push(Object.assign(W(a,b),{cor}));render()};
  render();
}

/* ---------- Bancada: prever ---------- */
function runPredict(p,list){
  let i=0,ok=0;const res=[];
  const render=()=>{
    const it=list[i],st=it.sc(),opts=shuffle(it.o.map((t,k)=>({t,k})));let tries=0;
    const draw=(after)=>{const r=solve(st.comps,st.wires);return '<div class="bench">'+board(st,{res:r,cls:after?'flash':''})+'</div>'+statusChips(st,r)};
    frame(p,progBar(list.length,i,res)+realHTML([['🔧','🏫','bancada de treino da oficina']])+entrada()+'<div id="bd">'+draw()+'</div><div class="goal"><span class="gi">AÇÃO</span><span>'+it.acao+'</span></div>'+
      '<div class="qcard"><p class="q">'+it.q+'</p></div><div class="opts">'+opts.map(o=>'<button class="btn opt" data-k="'+o.k+'">'+o.t+'</button>').join('')+'</div><div id="fb" class="opts"></div>',
      L()?'Olhe o circuito e aposte! Depois a gente vê.':'Preveja antes de ver.');
    app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
      tries++;const right=+b.dataset.k===0;
      app.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.k===0)x.classList.add('right')});
      if(!right)b.classList.add('wrong');
      res[i]=right;if(right){ok++;S.xp+=10;save()}
      it.act(st);document.getElementById('bd').innerHTML=draw(true);
      document.getElementById('fb').innerHTML='<div class="fb '+(right?'good':'bad')+'">'+(right?pick(PRAISE[S.mode])+' ':'Olha o que aconteceu! ')+it.w+'</div>'+nextBtn(i===list.length-1);
      document.getElementById('nx').onclick=()=>{i++;i<list.length?render():finish(p,ok,list.length)};
    });
  };
  render();
}

/* ---------- Bancada: caça-defeito ---------- */
function diagCircuit(V){return withPE({comps:[BAT(),C('F','fuse',125,40,0,{lab:'DJ'}),C('S1','sw',225,40,0,{closed:true}),C('L1','lamp',300,140,1)],
  wires:[W('B.0','F.0','v'),W('F.1','S1.0'),W('S1.1','L1.0','h'),W('L1.1','B.1','h')]})}
function runDiag(p,d){
  const ROUNDS=2;let round=0,score=0;
  const startRound=()=>{
    const st=diagCircuit(d.V);const fault=pick(d.cand);
    if(fault[0]==='w')st.wires[+fault.slice(1)].broken=true;else st.comps.find(c=>c.id===fault).broken=true;
    const letters={};let n=0;st.comps.forEach(c=>[0,1].forEach(k=>letters[c.id+'.'+k]='ABCDEFGHIJKLMNOPQR'[n++]));
    let tool=L()?'test':'meter',probes=[],reading=null,tags={},measures=0,wrong=0,fixed=false,msg=null,hint=false;
    const render=()=>{
      const r=solve(st.comps,st.wires);
      const toolNames=L()?['test','🔍 Testar peça']:['meter','📏 Medir tensão'];
      const meter=L()?'':'<div class="meter"><div><small>MULTÍMETRO</small><small>V~ (CA)</small></div><div class="lcd">'+(reading===null?'– – –':reading.toFixed(2).replace('.',',')+' V')+'</div></div>'+
        '<p class="help">'+(probes.length===0?'Toque no 1º ponto (ponta vermelha).':probes.length===1?'Agora o 2º ponto (ponta preta).':'Pontas em '+letters[probes[0]]+' e '+letters[probes[1]]+' (CA: valor eficaz). Toque em outro ponto para nova medição.')+'</p>';
      frame(p,progBar(ROUNDS,round,[score>=2])+
        '<div class="goal"><span class="gi">CHAMADO</span><span>'+(L()?'A lâmpada da cozinha não acende. Teste as peças e troque só a que quebrou.':'Cliente relata: a lâmpada da cozinha não acende; o resto da casa funciona. Ache a falha com até '+d.limit+' medições.')+'</span></div>'+
        '<div class="seg"><button class="btn" id="t1" aria-pressed="'+(tool!=='fix')+'">'+toolNames[1]+'</button><button class="btn" id="t2" aria-pressed="'+(tool==='fix')+'">🔧 '+(S.mode==='full'?'Reparar':'Trocar')+'</button></div>'+
        realHTML([['L1','💡','lâmpada da cozinha'],['S1','🔘','interruptor da cozinha'],['DJ','🎚','disjuntor da cozinha no quadro']])+(tool==='meter'?meter:'')+entrada()+
        '<div class="bench">'+board(st,{res:r,letters:tool==='meter'?letters:null,probes,tags:tool==='test'||tool==='fix'?tags:null,
           pickTerm:tool==='meter'&&!fixed,pickComp:(tool==='test'||tool==='fix')&&!fixed,pickWire:tool==='fix'&&!fixed&&S.mode==='full'})+'</div>'+
        '<div class="status"><span class="chip">'+(L()?'Testes: ':'Medições: ')+measures+(L()?'':' / '+d.limit)+'</span>'+(wrong?'<span class="chip">Trocas erradas: '+wrong+'</span>':'')+'</div>'+
        (msg?'<div class="fb '+(fixed?'good':msg.bad?'bad':'info')+'">'+msg.t+'</div>':'<p class="help">'+(tool==='fix'?(S.mode==='full'?'Toque na peça ou no fio (conexão frouxa) com defeito.':'Toque na peça que você quer trocar.'):tool==='test'?'Toque numa peça para testar se a energia passa por ela.':'')+'</p>')+
        (fixed?'<button class="btn main" id="nx">'+(round<ROUNDS-1?'Próximo chamado →':'Concluir')+'</button>':(!L()&&!hint&&measures>=2?'<button class="btn ghost sm" id="hint">💡 Dica</button>':'')),
        fixed?pick(PRAISE[S.mode])+' Luz de volta!':L()?'Detetive da elétrica!':'Raciocine antes de medir.');
      const svg=app.querySelector('.bench svg');
      document.getElementById('t1').onclick=()=>{tool=L()?'test':'meter';msg=null;render()};
      document.getElementById('t2').onclick=()=>{tool='fix';msg=null;render()};
      svg.querySelectorAll('[data-t]').forEach(h=>h.addEventListener('click',()=>{
        if(probes.length>=2)probes=[];probes.push(h.dataset.t);
        if(probes.length===2){measures++;const rr=solve(st.comps,st.wires);reading=Math.abs(rr.vAt(probes[0])-rr.vAt(probes[1]))}else reading=null;msg=null;render()}));
      svg.querySelectorAll('[data-c]').forEach(h=>h.addEventListener('click',()=>{
        const c=st.comps.find(x=>x.id===h.dataset.c);
        if(tool==='test'){measures++;tags[c.id]=!c.broken;msg=null;speak(c.broken?'não passa':'passa');render();return}
        tryFix(c.broken,()=>{c.broken=false},c.id+' ('+NAME[c.type]+')')}));
      svg.querySelectorAll('[data-w]').forEach(h=>h.addEventListener('click',()=>{const w=st.wires[+h.dataset.w];tryFix(w.broken,()=>{w.broken=false},'a conexão do fio')}));
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

/* ---------- Oficina livre (sandbox) ---------- */
function runSandbox(){
  setMode();
  let sb=S.sandbox&&S.sandbox.comps&&S.sandbox.comps.some(c=>c.type==='src')?clone(S.sandbox):{comps:[BAT()],wires:[]};
  let tool='build',cor='fase',sel=null,selC=null,probes=[],reading=null,msg=null,sure=false;
  const persist=()=>{S.sandbox=sb;save()};
  const SPOTS=[[170,55],[280,55],[170,195],[280,195],[120,125],[225,125],[300,125],[110,55],[110,195],[225,55]];
  const getSvg=()=>document.querySelector('#bench svg');
  const sc=()=>sb.comps.find(c=>c.id===selC);
  const benchHTML=()=>{const r=solve(sb.comps,sb.wires);return '<div class="bench" id="bench">'+board(sb,{res:r,sel,selC,move:tool==='build',pickTerm:true,pickWire:tool==='build',probes:tool==='meter'?probes:null})+'</div>'+statusChips(sb,r)};
  const redrawBench=()=>{document.getElementById('bw').innerHTML=benchHTML();bindBench()};
  const add=type=>{
    if(sb.comps.length>=9){msg={bad:1,t:'Bancada cheia: no máximo 8 peças além da bateria.'};render();return}
    const pre={lamp:'L',sw:'S',fuse:'DJ'}[type];let n=1;while(sb.comps.some(c=>c.id===pre+n))n++;
    const spot=SPOTS.find(([x,y])=>!sb.comps.some(c=>Math.hypot(c.x-x,c.y-y)<50))||[170,125];
    sb.comps.push(C(pre+n,type,spot[0],spot[1],0,type==='sw'?{closed:false}:{}));selC=pre+n;msg=null;persist();render()};
  const addWire=(a,b)=>{sel=null;msg=null;if(a.split('.')[0]!==b.split('.')[0]||true){if(!sb.wires.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a)))sb.wires.push(Object.assign(W(a,b),{cor}))}persist();render()};
  const render=()=>{
    const c=sc();
    frame({nome:'Oficina Livre'},
      '<div class="seg"><button class="btn" id="tb" aria-pressed="'+(tool==='build')+'">🔌 Montar</button><button class="btn" id="tm" aria-pressed="'+(tool==='meter')+'">📏 Medir</button></div>'+
      (tool==='build'?'<div class="row"><button class="btn sm" data-add="lamp">+ Lâmpada</button><button class="btn sm" data-add="sw">+ Interruptor</button><button class="btn sm" data-add="fuse">+ Disjuntor</button></div>'+palette(cor)
        :'<div class="meter"><div><small>MULTÍMETRO</small><small>V~ (CA)</small></div><div class="lcd">'+(reading===null?'– – –':reading.toFixed(2).replace('.',',')+' V')+'</div></div><p class="help">'+(probes.length===1?'Agora o 2º ponto (ponta preta).':'Toque em dois terminais para medir a tensão entre eles.')+'</p>')+
      entrada()+'<div id="bw">'+benchHTML()+'</div>'+
      (c&&tool==='build'?'<div class="row" style="align-items:center"><span class="chip">'+c.id+'</span><button class="btn sm" id="rot">↻ Girar</button>'+(c.type==='sw'?'<button class="btn sm" id="tog">'+(c.closed?'Abrir':'Fechar')+'</button>':'')+(c.type!=='bat'?'<button class="btn sm danger" id="del">🗑 Remover</button>':'')+'</div>':'')+
      (msg?'<div class="fb '+(msg.bad?'bad':'good')+'">'+msg.t+'</div>':'<p class="help">'+(tool==='build'?'Arraste as peças pelo corpo. Toque numa peça para selecionar (no interruptor, isso também liga e desliga). Ligue fios entre os terminais ⚪. Toque no fio para tirar.':'')+'</p>')+
      '<div class="row"><button class="btn ghost" id="clr">'+(sure?'Toque de novo para limpar':'Limpar bancada')+'</button><button class="btn main" id="insp">🔎 Inspecionar</button></div>',
      'Aqui é livre! Invente, teste e meça.');
    document.getElementById('tb').onclick=()=>{tool='build';probes=[];reading=null;msg=null;render()};
    document.getElementById('tm').onclick=()=>{tool='meter';sel=null;selC=null;msg=null;render()};
    app.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(b.dataset.add));
    app.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>{cor=b.dataset.cor;render()});
    const rot=document.getElementById('rot');if(rot)rot.onclick=()=>{c.v=!c.v;persist();render()};
    const tog=document.getElementById('tog');if(tog)tog.onclick=()=>{c.closed=!c.closed;persist();render()};
    const del=document.getElementById('del');if(del)del.onclick=()=>{sb.comps=sb.comps.filter(x=>x!==c);sb.wires=sb.wires.filter(w=>!w.a.startsWith(c.id+'.')&&!w.b.startsWith(c.id+'.'));selC=null;persist();render()};
    document.getElementById('clr').onclick=()=>{if(!sure){sure=true;render();return}sure=false;sb={comps:[BAT()],wires:[]};selC=null;sel=null;probes=[];reading=null;msg=null;persist();render()};
    document.getElementById('insp').onclick=()=>{
      const r=solve(sb.comps,sb.wires);const nl=Object.values(r.lamp).filter(b=>b>0.04).length;
      if(!sb.wires.length)msg={bad:1,t:'Ainda não tem nenhum fio na bancada.'};
      else if(r.short)msg={bad:1,t:'Curto-circuito! Há um caminho sem carga entre fase e neutro (ou terra). Na vida real, o disjuntor desarmaria.'};
      else{const m=normCheck(sb)||colorCheck(sb);msg=m?{bad:1,t:m}:{t:'Inspeção aprovada: cores conforme a norma e '+nl+' lâmpada(s) acesa(s) agora.'}}
      if(!msg.bad){S.xp+=2;S.flags.ofi=1;markDaily('ofi');save()}render()};
    bindBench();
  };
  const bindBench=()=>{
    const svg=getSvg();
    svg.querySelectorAll('[data-w]').forEach(h=>h.addEventListener('click',()=>{sb.wires.splice(+h.dataset.w,1);persist();render()}));
    svg.querySelectorAll('[data-mv]').forEach(h=>h.addEventListener('pointerdown',e=>{
      e.preventDefault();const c=sb.comps.find(x=>x.id===h.dataset.mv),q0=svgPoint(svg,e),ox=c.x,oy=c.y;let moved=false;
      const move=ev=>{const q=svgPoint(getSvg(),ev),dx=q.x-q0.x,dy=q.y-q0.y;if(!moved&&Math.hypot(dx,dy)<6)return;moved=true;
        c.x=Math.max(34,Math.min(306,Math.round((ox+dx)/5)*5));c.y=Math.max(34,Math.min(216,Math.round((oy+dy)/5)*5));redrawBench()};
      const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
        if(!moved){selC=c.id;if(c.type==='sw')c.closed=!c.closed}msg=null;persist();render()};
      window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)}));
    svg.querySelectorAll('[data-t]').forEach(h=>h.addEventListener('pointerdown',e=>{
      e.preventDefault();const a=h.dataset.t;
      if(tool==='meter'){if(probes.length>=2)probes=[];probes.push(a);if(probes.length===2){const r=solve(sb.comps,sb.wires);reading=Math.abs(r.vAt(probes[0])-r.vAt(probes[1]))}else reading=null;render();return}
      const p0=tpos(sb.comps,a);let line=null;
      const move=ev=>{const s2=getSvg(),q=svgPoint(s2,ev);if(!line&&Math.hypot(q.x-p0[0],q.y-p0[1])>12){line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('class','w tmp');line.setAttribute('x1',p0[0]);line.setAttribute('y1',p0[1]);s2.appendChild(line)}if(line){line.setAttribute('x2',q.x);line.setAttribute('y2',q.y)}};
      const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
        if(line){line.remove();const el=document.elementFromPoint(ev.clientX,ev.clientY);const b=el&&el.getAttribute&&el.getAttribute('data-t');if(b&&b!==a)addWire(a,b);else render()}
        else{if(sel===null)sel=a;else if(sel===a)sel=null;else{addWire(sel,a);return}render()}};
      window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up)}));
  };
  render();
}

