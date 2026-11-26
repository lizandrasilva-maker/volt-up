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
/* partícula com sinal e brilho: s > 0 próton/íon positivo, s < 0 elétron/íon negativo, s = 0 nêutron */
const fCarga=(x,y,s,r)=>{r=r||8;return '<g transform="translate('+x+' '+y+')"><circle r="'+r+'" class="'+(s>0?'af-pos':s<0?'af-neg':'af-neu')+'"/>'+
  '<ellipse cx="'+(-r*.35)+'" cy="'+(-r*.4)+'" rx="'+(r*.32)+'" ry="'+(r*.22)+'" class="af-brilho"/>'+
  (s?'<text y="'+(r*.42).toFixed(1)+'" class="af-t af-escuro" text-anchor="middle" style="font-size:'+Math.round(r*1.35)+'px">'+(s>0?'+':'−')+'</text>':'')+'</g>'};
/* círculo como caminho (para partículas que andam por offset-path) e partícula que percorre um caminho */
const fCirc=(cx,cy,r)=>'M'+(cx+r)+' '+cy+' a'+r+' '+r+' 0 1 1 '+(-2*r)+' 0 a'+r+' '+r+' 0 1 1 '+(2*r)+' 0';
const fAnda=(d,s,r,dur,atraso,cls)=>'<g class="'+(cls||'af-anda')+'" style="offset-path:path(\''+d+'\');animation-duration:'+dur+'s;animation-delay:'+(-atraso).toFixed(2)+'s">'+fCarga(0,0,s,r)+'</g>';

/* medidor redondo com a letra da grandeza (V, A ou Ω) */
const fMed=(x,y,l,cls)=>'<g transform="translate('+x+' '+y+')"><circle r="17" class="af-bola'+(cls?' '+cls:'')+'"/>'+fT(0,7,l,{s:18,c:'af-amb'})+'</g>';
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
  /* átomo (modelo de camadas, como o lítio): núcleo com prótons e nêutrons; elétrons girando devagar em duas camadas */
  atomo:()=>{const cx=160,cy=80;
    return fDefs+'<circle cx="'+cx+'" cy="'+cy+'" r="36" class="af-orb"/><circle cx="'+cx+'" cy="'+cy+'" r="62" class="af-orb"/>'+
      '<circle cx="'+cx+'" cy="'+cy+'" r="24" class="af-nucleo"/>'+
      [[-11,-6.5,1],[0,-6.5,0],[11,-6.5,1],[-11,6.5,0],[0,6.5,1],[11,6.5,0]].map(([x,y,s])=>fCarga(cx+x,cy+y,s,7)).join('')+
      fAnda(fCirc(cx,cy,36),-1,7,7,0)+fAnda(fCirc(cx,cy,36),-1,7,7,3.5)+fAnda(fCirc(cx,cy,62),-1,7,12,4)+
      fCarga(78,160,1,6)+fT(88,164,'próton',{a:'start',c:'af-sub'})+fCarga(146,160,0,6)+fT(156,164,'nêutron',{a:'start',c:'af-sub'})+
      fCarga(222,160,-1,6)+fT(232,164,'elétron',{a:'start',c:'af-sub'})},
  /* pente passado no cabelo: os fios ficam arrepiados na direção do pente e os elétrons saltam do cabelo para ele */
  atrito:()=>{const fios=Array.from({length:9},(_,k)=>{const a=Math.PI*(1.12+k*0.095),x=96+38*Math.cos(a),y=118+38*Math.sin(a);
      return '<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+' C'+(x+4).toFixed(1)+' '+(y-26).toFixed(1)+' '+(x+34+k*3).toFixed(1)+' '+(y-34).toFixed(1)+' '+(x+52+k*5).toFixed(1)+' '+(y-48-k).toFixed(1)+'" class="af-fio-cabelo"/>'}).join('');
    return fDefs+fios+'<circle cx="96" cy="118" r="38" class="af-pele"/>'+
      '<path d="M60 110 Q62 82 96 80 Q130 82 132 110 Q114 96 96 96 Q78 96 60 110 Z" class="af-cabelo-topo"/>'+
      '<path d="M82 124 q5 -4 10 0 M104 124 q5 -4 10 0" class="af-dobra"/><path d="M88 138 q8 7 16 0" class="af-dobra"/>'+
      '<rect x="168" y="22" width="124" height="14" rx="4" class="af-pente"/>'+Array.from({length:14},(_,k)=>'<rect x="'+(172+k*8.6)+'" y="35" width="4" height="18" rx="1.5" class="af-pente"/>').join('')+
      [[192,14],[222,14],[252,14],[280,14]].map(([x,y])=>fCarga(x,y,-1,5)).join('')+
      [[70,94],[100,86],[124,96]].map(([x,y])=>fCarga(x,y,1,5)).join('')+
      [0,1,2].map(k=>'<g class="af-salta" style="animation-delay:'+(k*.6)+'s">'+fCarga(150+k*12,72-k*4,-1,5)+'</g>').join('')+
      fT(96,174,'cabelo: perdeu elétrons (+)',{c:'af-sub'})+fT(262,100,'pente: ganhou',{c:'af-sub'})+fT(262,114,'elétrons (−)',{c:'af-sub'})},
  forcas:()=>fDefs+'<g class="af-afasta">'+fCarga(110,55,1,12)+'</g><g class="af-afasta r">'+fCarga(210,55,1,12)+'</g>'+fSeta(92,55,62,55)+fSeta(228,55,258,55)+fT(160,90,'iguais se empurram')+
    '<g class="af-junta">'+fCarga(110,135,1,12)+'</g><g class="af-junta r">'+fCarga(210,135,-1,12)+'</g>'+fSeta(128,135,150,135)+fSeta(192,135,170,135)+fT(160,170,'diferentes se puxam'),
  /* mão apontando o dedo (saindo da manga) perto da maçaneta de alavanca de uma porta de madeira; a faísca salta no vão */
  macaneta:()=>fDefs+
    /* porta: folha de madeira com almofada, espelho metálico e maçaneta de alavanca */
    '<rect x="224" y="-4" width="100" height="188" rx="3" class="af-porta"/><rect x="262" y="18" width="48" height="60" rx="3" class="af-porta-almofada"/><rect x="262" y="112" width="48" height="56" rx="3" class="af-porta-almofada"/>'+
    '<rect x="234" y="66" width="20" height="62" rx="6" class="af-metal"/><circle cx="244" cy="116" r="3.5" class="af-fechadura"/>'+
    '<rect x="196" y="85" width="52" height="13" rx="6.5" class="af-metal"/><path d="M202 88 H240" class="af-reflexo"/><circle cx="244" cy="91.5" r="9" class="af-metal"/>'+
    /* manga da camisa e punho */
    '<rect x="-6" y="72" width="66" height="60" rx="10" class="af-manga"/><rect x="50" y="74" width="12" height="56" rx="4" class="af-punho"/>'+
    /* mão: dorso, dedo indicador esticado e os outros dobrados; polegar por cima */
    '<path d="M60 82 C72 75 94 75 108 81 L150 83 C159 83 165 87 165 93 C165 99 159 102 150 102 L120 102 C127 105 127 113 118 114 C125 117 123 125 113 125 C118 129 114 135 104 134 C90 136 72 132 60 124 Z" class="af-pele"/>'+
    '<path d="M150 87 q8 0 9 6 q-1 5 -9 5" class="af-unha"/>'+
    '<path d="M108 106 q6 1 9 -1 M104 118 q6 1 9 -2 M98 128 q5 1 8 -2" class="af-dobra"/>'+
    '<path d="M92 82 C100 71 118 69 128 75 C134 79 130 86 121 86 L106 88 C100 88 95 86 92 82 Z" class="af-pele"/>'+
    /* carga negativa acumulada no corpo */
    [[24,88],[38,112],[78,92],[94,116],[130,92]].map(([x,y])=>fCarga(x,y,-1,5)).join('')+
    /* faísca no vão entre a ponta do dedo e a maçaneta */
    '<g class="af-faisca"><circle cx="181" cy="92" r="26" fill="url(#afBrilho)"/>'+
    ['af-raio-halo','af-raio'].map(c=>'<path d="M165 93 L172 80 L176 101 L183 78 L187 104 L192 84 L197 92" class="'+c+'"/>').join('')+
    '<path d="M178 70 l-4 -8 M186 112 l3 8 M170 108 l-5 6" class="af-raio fino"/></g>'+
    fT(70,54,'corpo com carga (−)',{c:'af-sub'})+fT(160,166,'a carga pula pelo ar: faísca',{c:'af-sub'}),
  /* metal: íons de cobre (+) fixos na rede cristalina e elétrons livres (−) passeando entre eles, todos para o mesmo lado */
  cobre:()=>{const onda=y=>'M-14 '+y+Array.from({length:15},(_,k)=>' q12 '+(k%2?7:-7)+' 24 0').join('');
    return fDefs+fT(160,20,'metal: íons fixos e elétrons livres',{c:'af-tit'})+
      '<clipPath id="afClipCobre"><rect x="12" y="30" width="296" height="124" rx="8"/></clipPath>'+
      '<rect x="12" y="30" width="296" height="124" rx="8" class="af-cristal"/>'+
      [48,92,136].map(y=>[0,1,2,3,4,5].map(k=>'<g transform="translate('+(40+k*48)+' '+y+')"><circle r="12" class="af-ion-cobre"/><text y="5" class="af-t af-escuro" text-anchor="middle" style="font-size:15px">+</text></g>').join('')).join('')+
      '<g clip-path="url(#afClipCobre)">'+[[70,0],[70,3.3],[70,6.6],[114,1.6],[114,5],[114,8.2],[34,4.2],[150,2.4]].map(([y,a])=>fAnda(onda(y),-1,5,10,a)).join('')+'</g>'+
      fSeta(116,170,204,170,'af-info')+fT(110,174,'elétrons',{a:'end',c:'af-sub'})},
  /* isolante: cada elétron gira preso ao seu átomo; não há elétron livre para andar */
  borracha:()=>fDefs+fT(160,20,'isolante: cada elétron preso ao seu átomo',{c:'af-tit'})+
    Array.from({length:15},(_,k)=>{const x=48+(k%5)*56,y=54+Math.floor(k/5)*44;
      return '<circle cx="'+x+'" cy="'+y+'" r="15" class="af-orb"/>'+fCarga(x,y,1,8)+fAnda(fCirc(x,y,15),-1,4.5,3.2+(k%3)*.4,k*.37)}).join('')+
    fT(160,174,'não sobra elétron livre para andar',{c:'af-sub'}),
  fio:()=>fDefs+'<circle cx="110" cy="92" r="62" class="af-capa"/><circle cx="110" cy="92" r="38" class="af-cobre"/>'+
    Array.from({length:7},(_,k)=>{const a=k*Math.PI/3;return '<circle cx="'+(110+(k?20*Math.cos(a):0))+'" cy="'+(92+(k?20*Math.sin(a):0))+'" r="11" class="af-cobre fio"/>'}).join('')+
    fSeta(220,60,152,80)+fT(226,56,'cobre: conduz',{a:'start'})+fSeta(220,130,168,118)+fT(226,140,'capa: isola',{a:'start'}),
  /* água com sal entre dois eletrodos ligados a uma pilha: íons + vão para o eletrodo −, íons − vão para o eletrodo + */
  agua:()=>fDefs+fPilha(160,24,0)+'<path d="M134 24 H108 V64" class="af-fio"/><path d="M191 24 H212 V64" class="af-fio"/>'+
    '<path d="M84 46 v100 q0 14 14 14 h124 q14 0 14 -14 v-100" class="af-copo"/><rect x="87" y="70" width="146" height="87" rx="10" class="af-agua"/>'+
    '<rect x="102" y="60" width="12" height="84" rx="3" class="af-metal"/><rect x="206" y="60" width="12" height="84" rx="3" class="af-metal"/>'+
    fT(96,58,'−',{s:16})+fT(226,58,'+',{s:16})+
    [[86,0,1],[104,2.1,1],[124,4.2,1],[96,3.2,-1],[116,1,-1],[136,5,-1]].map(([y,a,s])=>fAnda(s>0?'M200 '+y+' H120':'M120 '+y+' H200',s,6.5,6.3,a,'af-ion')).join('')+
    fT(160,176,'íons + vão para o polo −; íons − vão para o +',{c:'af-sub'}),
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
    return '<g class="af-entra" style="animation-delay:'+(k*.15)+'s"><rect x="'+(x-46)+'" y="30" width="92" height="120" rx="12" class="af-cartao"/>'+fT(x,58,n,{c:'af-tit'})+fT(x,96,s,{s:30,c:'af-amb'})+fT(x,122,u)+fT(x,140,d,{c:'af-sub'})+'</g>'}).join(''),
  /* ---- Ato 2: como se mede ---- */
  escala:()=>fDefs+'<rect x="112" y="14" width="96" height="152" rx="12" class="af-cartao"/><rect x="124" y="26" width="72" height="28" rx="4" class="af-barra"/>'+fT(160,46,'1,50',{c:'af-escuro'})+
    '<circle cx="160" cy="100" r="26" class="af-bola"/>'+fSeta(160,100,160,80,'af-amb')+fT(160,68,'V⎓',{s:12})+fT(196,104,'A',{s:12,a:'start'})+fT(124,104,'Ω',{s:12,a:'end'})+fT(160,140,'desl.',{s:10})+
    '<circle cx="132" cy="152" r="6" class="af-pos"/><circle cx="160" cy="152" r="6" class="af-neg"/><circle cx="188" cy="152" r="6" class="af-pos"/>'+
    fT(40,60,'1º escolha',{c:'af-sub'})+fT(40,76,'a grandeza',{c:'af-sub'})+fT(280,60,'2º encoste',{c:'af-sub'})+fT(280,76,'as pontas',{c:'af-sub'})+fT(160,178,'VΩ · COM · A',{c:'af-sub'}),
  voltimetro:()=>fDefs+fPilha(50,92,-90)+fLamp(230,80,true)+fFluxo('M50 62 V30 H230 V60',false)+fFluxo('M50 122 V156 H230 V100',true)+
    '<path d="M230 42 H292 V63" class="af-fio vermelho"/><path d="M230 140 H292 V97" class="af-fio"/>'+fMed(292,80,'V')+fT(150,176,'voltímetro em paralelo: mede sem abrir o circuito',{c:'af-sub'}),
  amperimetro:()=>fDefs+fPilha(50,92,-90)+fLamp(250,80,true)+fFluxo('M50 62 V30 H133',false)+fMed(150,30,'A')+fFluxo('M167 30 H250 V60',false)+fFluxo('M50 122 V156 H250 V100',true)+
    fT(150,70,'o circuito abre e o medidor entra no caminho',{c:'af-sub'})+fT(160,176,'amperímetro em série: a corrente passa por dentro dele',{c:'af-sub'}),
  ampCurto:()=>fDefs+fPilha(50,92,-90)+fLamp(230,80,false)+'<path d="M50 62 V30 H230 V60" class="af-fio"/><path d="M50 122 V156 H230 V100" class="af-fio"/>'+
    fFluxo('M230 42 H292 V63',false)+fFluxo('M292 97 V140 H230',false)+fMed(292,80,'A','af-erro')+'<path d="M262 66 l10 -6 l-2 8 l12 -4" class="af-raio af-pisca"/>'+
    fT(160,176,'amperímetro em paralelo: vira um curto',{c:'af-erro'}),
  ohmimetro:()=>fDefs+fLamp(110,78,false)+'<path d="M104 98 V132 H222 V97" class="af-fio vermelho"/><path d="M116 98 V120 H238 V97" class="af-fio"/>'+fMed(230,80,'Ω')+
    fEmo(262,36,'🔋',20)+'<path d="M250 22 l26 28 M276 22 l-26 28" class="af-seta af-erro"/>'+fT(160,176,'ohmímetro: peça sem energia (pilha fora)',{c:'af-sub'}),
  /* ---- Ato 4: capacitor, ímã e bobina, CC × CA ---- */
  capCarga:()=>fDefs+fPilha(40,100,-90)+fFluxo('M40 70 V30 H150',false)+'<rect x="150" y="22" width="40" height="16" rx="3" class="af-cartao"/>'+fT(170,52,'R',{c:'af-sub'})+fFluxo('M190 30 H250 V72',false)+
    '<rect x="226" y="72" width="48" height="7" rx="2" class="af-metal"/><rect x="226" y="90" width="48" height="7" rx="2" class="af-metal"/>'+fFluxo('M250 97 V160 H40 V130',true)+
    [0,1,2,3].map(k=>fCarga(234+k*12,66,1,4)).join('')+[0,1,2,3].map(k=>fCarga(234+k*12,103,-1,4)).join('')+fT(160,176,'as placas vão juntando carga',{c:'af-sub'}),
  capCurva:()=>fDefs+'<path d="M40 150 H290 M40 150 V24" class="af-cota"/><path d="M40 150 C80 60 140 40 290 34" class="af-fio vermelho"/><line x1="40" y1="34" x2="290" y2="34" class="af-cota"/>'+
    '<line x1="90" y1="150" x2="90" y2="78" class="af-cota"/>'+fT(90,166,'τ',{c:'af-amb'})+fT(96,74,'63 %',{a:'start',c:'af-amb'})+fT(286,28,'tensão da pilha',{a:'end',c:'af-sub'})+fT(292,166,'tempo',{a:'end',c:'af-sub'})+fT(150,120,'rápido no começo, devagar no fim',{c:'af-sub'}),
  capDescarga:()=>fDefs+'<rect x="56" y="72" width="48" height="7" rx="2" class="af-metal"/><rect x="56" y="90" width="48" height="7" rx="2" class="af-metal"/>'+
    [0,1,2].map(k=>fCarga(66+k*14,66,1,4)).join('')+[0,1,2].map(k=>fCarga(66+k*14,103,-1,4)).join('')+fFluxo('M80 72 V30 H240 V58',false)+fFluxo('M240 100 V150 H80 V97',true)+fLamp(240,80,true)+
    fT(160,176,'sem pilha: o capacitor devolve a carga e o LED vai apagando',{c:'af-sub'}),
  capPerigo:()=>fDefs+'<rect x="70" y="30" width="180" height="110" rx="10" class="af-cartao"/>'+'<rect x="96" y="70" width="34" height="50" rx="6" class="af-metal"/><rect x="146" y="70" width="34" height="50" rx="6" class="af-metal"/>'+
    fEmo(220,62,'⚠️',26)+fEmo(214,120,'🔌',20)+'<path d="M200 108 l26 26 M226 108 l-26 26" class="af-seta af-erro"/>'+fT(160,22,'fonte desligada da tomada',{c:'af-sub'})+fT(160,166,'os capacitores podem continuar carregados',{c:'af-erro'}),
  ima:()=>fDefs+'<rect x="110" y="74" width="50" height="34" rx="4" class="af-pos"/><rect x="160" y="74" width="50" height="34" rx="4" class="af-neg"/>'+fT(135,97,'N',{s:16,c:'af-escuro'})+fT(185,97,'S',{s:16})+
    [18,34,50].map(d=>'<path d="M110 91 C'+(110-d*2)+' '+(91-d*1.6)+' '+(210+d*2)+' '+(91-d*1.6)+' 210 91" class="af-cota" style="fill:none"/><path d="M110 91 C'+(110-d*2)+' '+(91+d*1.6)+' '+(210+d*2)+' '+(91+d*1.6)+' 210 91" class="af-cota" style="fill:none"/>').join('')+
    fT(160,174,'o campo sai do norte e entra no sul',{c:'af-sub'}),
  oersted:()=>fDefs+fFluxo('M30 90 H290',false)+'<ellipse cx="160" cy="90" rx="44" ry="16" class="af-cota" style="fill:none"/><ellipse cx="160" cy="90" rx="70" ry="26" class="af-cota" style="fill:none"/>'+
    '<g transform="translate(160 140)"><circle r="20" class="af-bola"/><g class="af-gira"><path d="M0 -15 L5 0 L0 15 L-5 0 Z" class="af-pos"/></g></g>'+fT(160,24,'corrente no fio cria campo em volta dele',{c:'af-sub'}),
  bobina:()=>fDefs+'<rect x="80" y="70" width="160" height="28" rx="5" class="af-metal"/>'+Array.from({length:9},(_,k)=>'<ellipse cx="'+(96+k*16)+'" cy="84" rx="7" ry="22" class="af-fio vermelho"/>').join('')+
    fPilha(160,150,0)+'<path d="M134 150 H70 V84 H89 M186 150 H250 V84 H231" class="af-fio"/>'+[0,1,2].map(k=>'<g class="af-pula" style="animation-delay:'+(k*.3)+'s">'+fEmo(264,108+k*16,'📎',14)+'</g>').join('')+
    fT(160,30,'muitas voltas + ferro no meio = eletroímã forte',{c:'af-sub'}),
  inducao:()=>fDefs+Array.from({length:7},(_,k)=>'<ellipse cx="'+(150+k*16)+'" cy="90" rx="7" ry="24" class="af-fio vermelho"/>').join('')+
    '<g class="af-afasta r"><rect x="60" y="78" width="30" height="24" rx="3" class="af-pos"/><rect x="90" y="78" width="30" height="24" rx="3" class="af-neg"/></g>'+fLamp(290,60,true)+'<path d="M150 66 V40 H290 M246 114 V150 H300 V82" class="af-fio"/>'+
    fT(160,176,'ímã mexendo dentro da bobina: aparece tensão',{c:'af-sub'}),
  contatoraIma:()=>fDefs+'<rect x="60" y="100" width="100" height="44" rx="6" class="af-metal"/>'+Array.from({length:6},(_,k)=>'<ellipse cx="'+(74+k*14)+'" cy="122" rx="6" ry="20" class="af-fio vermelho"/>').join('')+
    '<g class="af-pula"><rect x="60" y="62" width="100" height="14" rx="3" class="af-metal"/></g>'+'<path d="M110 62 V36 H210" class="af-fio"/><circle cx="214" cy="36" r="5" class="af-metal"/><line x1="220" y1="36" x2="262" y2="36" class="af-chave"/><circle cx="266" cy="36" r="5" class="af-metal"/>'+
    fT(110,164,'bobina A1-A2',{c:'af-sub'})+fT(240,62,'contato fecha',{c:'af-ok'})+fT(160,176,'sem corrente, a mola abre',{c:'af-sub'}),
  ccGrafico:()=>fDefs+'<path d="M30 110 H296 M40 170 V20" class="af-cota"/><line x1="40" y1="54" x2="290" y2="54" class="af-fio vermelho"/>'+fT(46,46,'+1,5 V',{a:'start',c:'af-amb'})+fT(292,126,'tempo',{a:'end',c:'af-sub'})+fT(160,160,'contínua: o mesmo sentido o tempo todo',{c:'af-sub'}),
  caGrafico:()=>fDefs+'<path d="M30 92 H296 M40 170 V14" class="af-cota"/><path d="M40 92 C60 22 80 22 100 92 S140 162 160 92 S200 22 220 92 S260 162 280 92" class="af-fio vermelho"/>'+
    fT(70,34,'+',{c:'af-amb'})+fT(130,160,'−',{c:'af-amb'})+fT(292,108,'tempo',{a:'end',c:'af-sub'})+fT(160,178,'alternada: vai e volta {Hz} vezes por segundo',{c:'af-sub'}),
  transmissao:()=>fDefs+fEmo(30,70,'🏭',24)+fEmo(100,70,'🔺',20)+fEmo(200,70,'🔻',20)+fEmo(276,70,'🏠',24)+'<path d="M46 70 H86 M114 70 H186 M214 70 H260" class="af-fio vermelho"/>'+
    fT(100,104,'eleva',{c:'af-sub'})+fT(150,58,'alta tensão',{c:'af-amb'})+fT(200,104,'abaixa',{c:'af-sub'})+fT(276,104,'{V} V',{c:'af-amb'})+fT(160,160,'transformador só funciona com corrente alternada',{c:'af-sub'}),
  ccEmCasa:()=>fDefs+fEmo(40,90,'🔌',26)+'<path d="M58 90 H100" class="af-fio vermelho"/><rect x="100" y="64" width="90" height="52" rx="8" class="af-cartao"/>'+fT(145,86,'CA → CC',{c:'af-amb'})+fT(145,104,'carregador',{c:'af-sub'})+
    '<path d="M190 90 H240" class="af-fio"/>'+fEmo(262,92,'📱',30)+fT(80,130,'CA',{c:'af-sub'})+fT(215,130,'CC',{c:'af-sub'})+fT(160,170,'muitos aparelhos usam CC por dentro',{c:'af-sub'}),
  /* forma de onda da fonte (classificar CC ou CA): "?" antes, reta (CC) ou senoide (CA) depois */
  formaOnda:(f)=>{const e=f.estado;return fDefs+fEmo(46,60,f.e||'❓',30)+'<path d="M90 100 H300 M100 160 V30" class="af-cota"/>'+
    (e==='conduz'?'<line x1="100" y1="58" x2="296" y2="58" class="af-fio vermelho"/>'+fT(200,48,'contínua (CC)',{c:'af-ok'})
     :e==='isola'?'<path d="M100 100 C116 40 132 40 148 100 S180 160 196 100 S228 40 244 100 S276 160 292 100" class="af-fio vermelho"/>'+fT(200,30,'alternada (CA)',{c:'af-ok'})
     :fT(200,90,'?',{s:34,c:'af-amb'}))},
  /* ---- Ato 3: série, paralelo e Kirchhoff ---- */
  serieLamp:()=>fDefs+fPilha(40,100,-90)+fFluxo('M40 70 V30 H290 V160 H40 V130',false)+fLamp(130,30,true)+fLamp(220,30,true)+fT(160,110,'a mesma corrente passa pelas duas',{c:'af-sub'})+fT(160,176,'série: um caminho só',{c:'af-sub'}),
  serieQueima:()=>fDefs+fPilha(40,100,-90)+'<path d="M40 70 V30 H290 V160 H40 V130" class="af-fio"/>'+fLamp(130,30,false)+'<path d="M122 14 l7 7 l-5 4 l9 7" class="af-raio af-pisca"/>'+fLamp(220,30,false)+fT(160,176,'uma abre, as duas apagam',{c:'af-erro'}),
  paraleloLamp:()=>fDefs+fPilha(40,100,-90)+fFluxo('M40 70 V30 H260',false)+fFluxo('M260 160 H40 V130',true)+fFluxo('M160 30 V75',false)+fFluxo('M160 115 V160',false)+fFluxo('M260 30 V75',false)+fFluxo('M260 115 V160',false)+
    fLamp(160,95,true)+fLamp(260,95,true)+fT(160,176,'paralelo: um caminho para cada',{c:'af-sub'}),
  paraleloQueima:()=>fDefs+fPilha(40,100,-90)+fFluxo('M40 70 V30 H260',false)+fFluxo('M260 160 H40 V130',true)+'<path d="M160 30 V75 M160 115 V160" class="af-fio"/>'+fFluxo('M260 30 V75',false)+fFluxo('M260 115 V160',false)+
    fLamp(160,95,false)+'<path d="M152 79 l7 7 l-5 4 l9 7" class="af-raio af-pisca"/>'+fLamp(260,95,true)+fT(160,176,'uma abre, a outra continua',{c:'af-ok'}),
  pilhasArranjo:()=>fDefs+fT(80,20,'série',{c:'af-tit'})+fT(240,20,'paralelo',{c:'af-tit'})+fPilha(80,62,0)+fPilha(80,104,0)+'<path d="M111 62 H120 V83 H44 V104 H54" class="af-fio"/>'+
    fPilha(240,62,0)+fPilha(240,104,0)+'<path d="M214 62 H204 V104 H214 M266 62 H276 V104 H266" class="af-fio"/>'+fT(80,146,'1,5 + 1,5 = 3 V')+fT(240,146,'1,5 V, dura mais')+fT(160,176,'soma tensão · soma duração',{c:'af-sub'}),
  kirchNo:()=>fDefs+'<circle cx="160" cy="90" r="7" class="af-metal"/>'+fSeta(50,50,150,84,'af-amb')+fSeta(50,130,150,96,'af-amb')+fSeta(170,90,280,90,'af-ok')+
    fT(70,40,'I1 = 0,3 A',{a:'start'})+fT(70,150,'I2 = 0,3 A',{a:'start'})+fT(224,80,'I1 + I2 = 0,6 A',{c:'af-ok'})+fT(160,176,'tudo o que entra no nó sai dele',{c:'af-sub'}),
  kirchMalha:()=>fDefs+fPilha(40,100,-90)+fFluxo('M40 70 V30 H290 V160 H40 V130',false)+fLamp(130,30,true)+fLamp(220,30,true)+
    fT(56,104,'+3 V',{a:'start',c:'af-ok'})+fT(130,68,'−1,5 V',{c:'af-erro'})+fT(220,68,'−1,5 V',{c:'af-erro'})+fT(160,176,'volta na malha: +3 − 1,5 − 1,5 = 0',{c:'af-amb'}),
  /* ---- Ato 2: lei de Ohm e potência ---- */
  ohm:()=>fDefs+'<path d="M160 22 L74 152 H246 Z" class="af-cartao"/><line x1="104" y1="104" x2="216" y2="104" class="af-cota"/><line x1="160" y1="104" x2="160" y2="152" class="af-cota"/>'+
    fT(160,90,'U',{s:30,c:'af-amb'})+fT(126,138,'R',{s:26})+fT(194,138,'I',{s:26})+fT(160,174,'U = R × I · I = U ÷ R · R = U ÷ I',{c:'af-sub'}),
  lanternaNumeros:()=>fDefs+fPilha(50,92,-90)+fLamp(230,80,true)+fFluxo('M50 62 V30 H230 V60',false)+fFluxo('M50 122 V156 H230 V100',true)+
    fT(92,96,'U = 3 V',{a:'start'})+fT(262,84,'R = 10 Ω',{a:'start',s:12})+fT(150,20,'I = U ÷ R = 0,3 A',{c:'af-amb'})+fT(160,176,'a mesma corrente passa pela pilha e pela lâmpada',{c:'af-sub'}),
  potencia:()=>fDefs+fLamp(80,84,true)+fT(214,58,'P = U × I',{s:22,c:'af-amb'})+fT(214,94,'3 V × 0,3 A')+fT(214,126,'= 0,9 W',{s:20,c:'af-ok'})+
    fT(160,176,'potência: quanta energia por segundo',{c:'af-sub'})
};
