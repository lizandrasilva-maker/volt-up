/* ================= AULA: fase de teoria =================
   Uma aula é uma sequência de quadros (ilustração animada + fala do mestre) e termina com
   perguntas rápidas que validam o que foi visto (as mesmas do quiz). As estrelas vêm das perguntas.
   dados[nível] = {quadros:[{fig:'nome',t:'texto',who:'chico'}], checa:[{q,o,w}]}
   As ilustrações (FIG) são SVG em viewBox 0 0 320 180; as animações ficam no CSS (classes af-*)
   e param sozinhas com "movimento reduzido". */
function runAula(p,d){
  let i=0;const Q=d.quadros;
  const render=()=>{
    const q=Q[i],quem=NPC[q.who||'chico'],fig=FIG[q.fig]?FIG[q.fig](q.f||{}):'';
    const ult=i===Q.length-1;
    frame(p,'<section class="aula">'+
      '<div class="aula-pontos" aria-hidden="true">'+Q.map((_,k)=>'<i class="'+(k<i?'ok':k===i?'cur':'')+'"></i>').join('')+'</div>'+
      '<figure class="lousa" aria-hidden="true"><svg viewBox="0 0 320 180">'+fig+'</svg></figure>'+
      '<div class="aula-fala"><span class="aula-quem">'+quem.svg+'<b>'+esc(quem.nome)+'</b></span><p>'+rd(q.t).replace(/\{nome\}/g,esc(S.name||charOf().nome))+'</p>'+
        '<button class="btn ghost sm" id="sp">🔊 Ouvir</button></div>'+
      '<div class="row"><button class="btn ghost" id="ant"'+(i?'':' disabled')+'>← Voltar</button>'+
        '<button class="btn main" id="prox">'+(ult?'Testar o que aprendi ✔':'Próximo →')+'</button></div>'+
    '</section>',L()?'Aula: vá no seu ritmo.':'Aula '+(i+1)+' de '+Q.length);
    document.getElementById('sp').onclick=()=>speak(rd(q.t).replace(/<[^>]+>/g,''));
    document.getElementById('ant').onclick=()=>{if(i){i--;render()}};
    document.getElementById('prox').onclick=()=>{if(ult)runQuiz(p,d.checa);else{i++;render()}};
  };
  render();
}

/* ---------- Ilustrações ---------- */
const fT=(x,y,t,o)=>'<text x="'+x+'" y="'+y+'" class="af-t'+(o&&o.c?' '+o.c:'')+'" text-anchor="'+((o&&o.a)||'middle')+'"'+(o&&o.s?' style="font-size:'+o.s+'px"':'')+'>'+t+'</text>';
const fEmo=(x,y,e,s)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" style="font-size:'+(s||26)+'px">'+e+'</text>';
const fSeta=(x1,y1,x2,y2,c)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="af-seta'+(c?' '+c:'')+'" marker-end="url(#afPonta)"/>';
const fDefs='<defs><marker id="afPonta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="currentColor"/></marker>'+
  '<radialGradient id="afBrilho"><stop offset="0" stop-color="#fff6c8"/><stop offset=".5" stop-color="#ffd84d" stop-opacity=".7"/><stop offset="1" stop-color="#ffd84d" stop-opacity="0"/></radialGradient></defs>';
/* pilha deitada: + à direita */
const fPilha=(x,y,rot)=>'<g transform="translate('+x+' '+y+')'+(rot?' rotate('+rot+')':'')+'"><rect x="-26" y="-12" width="52" height="24" rx="4" class="af-pilha"/><rect x="-26" y="-12" width="16" height="24" rx="3" class="af-pilha-neg"/><rect x="26" y="-5" width="5" height="10" rx="1.5" class="af-metal"/>'+
  '<text x="16" y="5" class="af-t af-escuro" text-anchor="middle" style="font-size:13px">+</text><text x="-18" y="5" class="af-t" text-anchor="middle" style="font-size:13px">−</text></g>';
const fLamp=(x,y,acesa)=>'<g transform="translate('+x+' '+y+')">'+(acesa?'<circle r="30" fill="url(#afBrilho)" class="af-pulsa"/>':'')+
  '<path d="M0 -20 a14 14 0 0 1 9 25 v6 h-18 v-6 a14 14 0 0 1 9 -25z" class="'+(acesa?'af-bulbo on':'af-bulbo')+'"/><path d="M-5 -2 q5 -8 10 0" class="af-fil'+(acesa?' on':'')+'"/>'+
  '<rect x="-9" y="11" width="18" height="9" rx="2" class="af-metal"/></g>';
/* fluxo de pontos ao longo de um caminho (corrente) */
const fFluxo=(d,rev,cls)=>'<path d="'+d+'" class="af-fio"/><path d="'+d+'" class="af-fluxo'+(rev?' rev':'')+(cls?' '+cls:'')+'"/>';
const fCarga=(x,y,s,r)=>'<g transform="translate('+x+' '+y+')"><circle r="'+(r||8)+'" class="'+(s>0?'af-pos':'af-neg')+'"/><text y="4" class="af-t af-escuro" text-anchor="middle" style="font-size:'+((r||8)+3)+'px">'+(s>0?'+':'−')+'</text></g>';

const FIG={
  formas:()=>fDefs+fT(160,22,'A energia muda de forma',{c:'af-tit'})+
    [['🔋','química'],['⚡','elétrica'],['💡','luz'],['🔥','calor'],['⚙️','movimento']].map(([e,n],k)=>{const x=36+k*62;
      return '<g class="af-entra" style="animation-delay:'+(k*.15)+'s"><circle cx="'+x+'" cy="86" r="25" class="af-bola"/>'+fEmo(x,96,e,26)+fT(x,132,n)+'</g>'+(k<4?fSeta(x+27,86,x+35,86):'')}).join('')+
    fT(160,166,'nada se perde: só se transforma',{c:'af-sub'}),
  pilhaLampada:()=>fDefs+fPilha(70,90,-90)+fLamp(250,78,true)+
    fFluxo('M70 60 V30 H250 V58',false)+fFluxo('M70 120 V150 H250 V98',true)+
    fT(70,176,'química',{c:'af-sub'})+fT(160,22,'elétrica',{c:'af-sub'})+fT(250,128,'luz + calor',{c:'af-sub'}),
  rendimento:()=>fDefs+fT(160,22,'Lâmpada de filamento: para onde vai a energia',{c:'af-tit'})+
    '<rect x="30" y="44" width="260" height="26" rx="5" class="af-barra"/>'+fT(160,62,'100 % de energia elétrica entra',{c:'af-escuro'})+
    '<rect x="30" y="104" width="13" height="26" rx="4" class="af-barra luz af-cresce"/><rect x="47" y="104" width="243" height="26" rx="5" class="af-barra calor af-cresce"/>'+
    fT(36,150,'≈ 5 % luz',{a:'start'})+fT(290,150,'≈ 95 % calor',{a:'end'})+fSeta(160,74,160,100),
  fontes:()=>fDefs+fT(70,20,'a natureza repõe',{c:'af-ok'})+fT(250,20,'acaba um dia',{c:'af-erro'})+
    fEmo(40,60,'☀️',22)+fEmo(95,60,'🌬️',22)+fEmo(40,110,'💧',22)+fEmo(95,110,'🌾',22)+
    fEmo(225,60,'🛢️',22)+fEmo(280,60,'⚫',22)+fEmo(250,110,'🔥',22)+
    '<circle cx="160" cy="150" r="20" class="af-bola"/>'+fEmo(160,159,'⚡',22)+fT(160,178,'eletricidade',{c:'af-sub'})+
    fSeta(70,124,142,145,'af-ok')+fSeta(250,124,178,145,'af-erro'),
  /* elétrons correm pelas órbitas (CSS offset-path) */
  atomo:()=>{const orb='M80 88 a80 24 0 1 0 160 0 a80 24 0 1 0 -160 0';
    return fDefs+[0,60,-60].map((g,k)=>'<g transform="rotate('+g+' 160 88)"><ellipse cx="160" cy="88" rx="80" ry="24" class="af-orb"/>'+
      '<circle r="7" class="af-neg af-eletron" style="offset-path:path(\''+orb+'\');animation-delay:'+(-k*1.3)+'s"/></g>').join('')+
    fCarga(152,82,1,9)+'<circle cx="168" cy="84" r="9" class="af-neu"/>'+fCarga(160,97,1,9)+'<circle cx="149" cy="98" r="8" class="af-neu"/>'+
    fT(160,174,'núcleo (+) e elétrons (−) em volta',{c:'af-sub'})},
  atrito:()=>fDefs+'<g transform="translate(70 95)"><path d="M-40 -40 q10 -20 40 -18 q30 -2 40 18 q4 30 -4 52 h-72 q-8 -22 -4 -52z" class="af-cabelo"/></g>'+
    '<rect x="170" y="70" width="110" height="16" rx="3" class="af-pente"/>'+Array.from({length:11},(_,k)=>'<rect x="'+(174+k*10)+'" y="86" width="4" height="22" class="af-pente"/>').join('')+
    [0,1,2].map(k=>'<g class="af-pula" style="animation-delay:'+(k*.5)+'s">'+fCarga(115,70+k*14,-1,6)+'</g>').join('')+
    fT(70,170,'cabelo: perdeu elétrons (+)',{c:'af-sub'})+fT(225,170,'pente: ganhou elétrons (−)',{c:'af-sub'}),
  forcas:()=>fDefs+'<g class="af-afasta">'+fCarga(110,55,1,12)+'</g><g class="af-afasta r">'+fCarga(210,55,1,12)+'</g>'+fSeta(92,55,62,55)+fSeta(228,55,258,55)+fT(160,90,'iguais se empurram')+
    '<g class="af-junta">'+fCarga(110,135,1,12)+'</g><g class="af-junta r">'+fCarga(210,135,-1,12)+'</g>'+fSeta(128,135,150,135)+fSeta(192,135,170,135)+fT(160,170,'diferentes se puxam'),
  macaneta:()=>fDefs+'<path d="M20 60 q40 -10 90 20 l20 14 q6 8 -2 12 l-30 -6 q-50 10 -78 -10z" class="af-mao"/>'+
    [0,1,2,3].map(k=>fCarga(40+k*18,74+(k%2)*8,-1,5)).join('')+
    '<rect x="230" y="20" width="20" height="150" class="af-porta"/><circle cx="210" cy="96" r="14" class="af-metal"/><rect x="210" y="90" width="22" height="12" class="af-metal"/>'+
    '<path d="M135 98 l18 -8 l-4 10 l20 -6 l-6 8 l26 -4" class="af-raio af-pisca"/>'+fT(160,150,'a carga pula pelo ar: faísca',{c:'af-sub'}),
  cobre:()=>fDefs+fT(160,22,'metal: elétrons livres',{c:'af-tit'})+
    Array.from({length:15},(_,k)=>'<circle cx="'+(50+(k%5)*55)+'" cy="'+(60+Math.floor(k/5)*45)+'" r="11" class="af-neu"/>').join('')+
    '<g class="af-deriva">'+Array.from({length:14},(_,k)=>'<circle cx="'+(30+((k*37)%260))+'" cy="'+(48+((k*29)%100))+'" r="4.5" class="af-neg"/>').join('')+'</g>'+fSeta(120,172,200,172,'af-info'),
  borracha:()=>fDefs+fT(160,22,'plástico e borracha: elétrons presos',{c:'af-tit'})+
    Array.from({length:15},(_,k)=>{const x=50+(k%5)*55,y=60+Math.floor(k/5)*45;return '<circle cx="'+x+'" cy="'+y+'" r="11" class="af-neu"/><g class="af-treme" style="animation-delay:'+(k*.07)+'s"><circle cx="'+(x+15)+'" cy="'+(y-6)+'" r="4.5" class="af-neg"/></g>'}).join(''),
  fio:()=>fDefs+'<circle cx="110" cy="92" r="62" class="af-capa"/><circle cx="110" cy="92" r="38" class="af-cobre"/>'+
    Array.from({length:7},(_,k)=>{const a=k*Math.PI/3;return '<circle cx="'+(110+(k?20*Math.cos(a):0))+'" cy="'+(92+(k?20*Math.sin(a):0))+'" r="11" class="af-cobre fio"/>'}).join('')+
    fSeta(220,60,152,80)+fT(226,56,'cobre: conduz',{a:'start'})+fSeta(220,130,168,118)+fT(226,140,'capa: isola',{a:'start'}),
  agua:()=>fDefs+'<path d="M90 40 v110 q0 14 14 14 h112 q14 0 14 -14 v-110" class="af-copo"/><rect x="93" y="70" width="134" height="91" rx="10" class="af-agua"/>'+
    '<g class="af-deriva">'+[[110,90,1],[150,120,-1],[185,95,1],[205,140,-1],[125,140,-1],[170,80,-1]].map(([x,y,s])=>fCarga(x,y,s,7)).join('')+'</g>'+
    fT(160,24,'água com sais: os íons levam a corrente',{c:'af-sub'}),
  testador:(f)=>{const est=f.estado,on=est==='conduz';
    /* LED do testador: cúpula sobre a base, com as duas perninhas */
    const led='<g transform="translate(60 62)">'+(on?'<circle r="26" fill="url(#afBrilho)" class="af-pulsa"/>':'')+
      '<path d="M-9 6 v-10 a9 9 0 0 1 18 0 v10z" class="af-led'+(on?' on':'')+'"/><rect x="-11" y="6" width="22" height="4" rx="1" class="af-metal"/>'+
      '<line x1="-4" y1="10" x2="-4" y2="18" class="af-perna"/><line x1="4" y1="10" x2="4" y2="18" class="af-perna"/>'+fT(22,-6,'LED',{a:'start',c:'af-sub'})+'</g>';
    return fDefs+fPilha(60,140,0)+led+fFluxo('M60 80 V118',false,on?'':'parado')+
      '<path d="M86 140 H150 V112" class="af-fio vermelho"/><path d="M34 140 H20 V30 H190 V112" class="af-fio"/>'+
      '<rect x="136" y="112" width="90" height="40" rx="8" class="af-amostra"/>'+fEmo(160,141,f.e||'❓',20)+fT(205,138,f.n?'':'?',{})+
      '<line x1="150" y1="104" x2="150" y2="118" class="af-ponta"/><line x1="190" y1="104" x2="190" y2="118" class="af-ponta"/>'+
      fT(250,60,est?(on?'LED acende':'LED apagado'):'conduz?',{c:est?(on?'af-ok':'af-erro'):'af-sub'})+
      (f.n?fT(181,170,f.n,{c:'af-sub'}):'')},
  /* caixa-d'água: altura = tensão, água correndo = corrente, cano fino = resistência */
  caixa:()=>fDefs+'<rect x="56" y="22" width="70" height="58" rx="4" class="af-caixa"/><rect x="59" y="36" width="64" height="41" class="af-agua"/>'+
    '<path d="M126 72 H170 V148 H222" class="af-cano"/><path d="M222 148 H300" class="af-cano fino"/>'+
    '<path d="M126 72 H170 V148 H222" class="af-fluxo agua"/><path d="M222 148 H300" class="af-fluxo agua fina"/>'+
    '<line x1="40" y1="36" x2="40" y2="148" class="af-cota"/>'+fT(40,24,'tensão',{c:'af-amb'})+
    fT(180,112,'corrente',{a:'start',c:'af-sub'})+fT(262,132,'resistência',{c:'af-sub'})+fT(160,176,'altura empurra · água anda · cano fino atrapalha',{c:'af-sub'}),
  fechado:()=>fDefs+fPilha(60,92,-90)+fLamp(250,80,true)+fFluxo('M60 62 V30 H150',false)+'<circle cx="150" cy="30" r="4" class="af-metal"/><line x1="150" y1="30" x2="190" y2="30" class="af-chave"/><circle cx="190" cy="30" r="4" class="af-metal"/>'+
    fFluxo('M190 30 H250 V60',false)+fFluxo('M60 122 V156 H250 V100',true)+fT(170,18,'chave fechada',{c:'af-sub'})+fT(160,176,'caminho fechado: a corrente anda',{c:'af-ok'}),
  aberto:()=>fDefs+fPilha(60,92,-90)+fLamp(250,80,false)+'<path d="M60 62 V30 H150" class="af-fio"/><circle cx="150" cy="30" r="4" class="af-metal"/><line x1="150" y1="30" x2="184" y2="8" class="af-chave"/><circle cx="190" cy="30" r="4" class="af-metal"/>'+
    '<path d="M190 30 H250 V60" class="af-fio"/><path d="M60 122 V156 H250 V100" class="af-fio"/>'+fT(170,52,'chave aberta',{c:'af-sub'})+fT(160,176,'caminho aberto: nada anda',{c:'af-erro'}),
  sentido:()=>fDefs+fPilha(60,92,-90)+fLamp(250,80,true)+fFluxo('M60 62 V30 H250 V60',true)+fFluxo('M60 122 V156 H250 V100',false)+
    fSeta(120,44,190,44,'af-amb')+fT(155,60,'sentido convencional: + → −',{c:'af-sub'})+fSeta(190,142,120,142,'af-info')+fT(155,136,'elétrons: − → +',{c:'af-sub'}),
  unidades:()=>fDefs+[['Tensão','U','volt (V)','empurra'],['Corrente','I','ampère (A)','anda'],['Resistência','R','ohm (Ω)','atrapalha']].map(([n,s,u,d],k)=>{const x=58+k*102;
    return '<g class="af-entra" style="animation-delay:'+(k*.15)+'s"><rect x="'+(x-46)+'" y="30" width="92" height="120" rx="12" class="af-cartao"/>'+fT(x,58,n,{c:'af-tit'})+fT(x,96,s,{s:30,c:'af-amb'})+fT(x,122,u)+fT(x,140,d,{c:'af-sub'})+'</g>'}).join('')
};
