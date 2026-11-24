/* ================= BANCADA 3D =================
   Vista 3D estilizada (cel-shading) da bancada, em Three.js puro (módulo ES, carregado sob demanda por fases.js
   com o "three" da importmap do index.html). Direção de arte e padrões: .claude/skills/voltup-3d-anime/SKILL.md
   Ela só DESENHA e RELATA GESTOS: ligar fio, acionar peça, curto e NBR 5410 continuam no ctl de runBuild
   e no solver (motor.js). Contrato com fases.js: VISTA3D.vista = {aceita, montar, atualizar, destruir, debug}.
   Escala: 1 unidade 3D = 1 cm da bancada; as fases continuam usando c.x e c.y da bancada 2D. */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OutlineEffect} from 'three/addons/effects/OutlineEffect.js';

const reduz=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const pos2d=c=>new THREE.Vector3((c.x-170)/10,-(c.y-125)/10,0);
const SEM_CONTORNO={visible:false};
const cssVar=(n,padrao)=>{try{return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||padrao}catch(e){return padrao}};

/* ---------- bornes: posição local de cada borne, com os MESMOS índices de terms(c) no motor.js ----------
   O construtor de cada peça lê esta tabela para pôr os parafusos; nenhuma peça define borne por conta própria. */
const DIN={W:2.4,H:8,D:4.6,z0:.75};/* módulo DIN estilizado (1 módulo = 2,4) sobre o trilho de 0,75 */
const LARG_DIN={fuse:DIN.W,dr:2*DIN.W,kc:3*DIN.W,ft:2*DIN.W};/* largura de cada peça de trilho: disjuntor 1 módulo, DR e relé térmico 2, contatora 3 */
const RECUO=.7;/* degrau recuado da bobina da contatora (A1/A2) */
const FRENTE=DIN.z0+DIN.D;/* face frontal dos módulos DIN */
const TERM3D={
  src:()=>[[-1.25,-3.6,3.3],[1.25,-3.6,3.3]],                         /* .0 = L1, .1 = N */
  fuse:()=>[[0,3.1,DIN.z0+DIN.D+.05],[0,-2.6,DIN.z0+DIN.D+.05]],      /* .0 = entrada (topo), .1 = saída (base) */
  lamp:()=>[[-1.35,-1.35,.7],[1.35,-1.35,.7]],                        /* .0 = X1, .1 = X2 */
  dr:()=>[[-1.2,3.1,FRENTE+.05],[1.2,3.1,FRENTE+.05],[-1.2,-2.6,FRENTE+.05],[1.2,-2.6,FRENTE+.05]], /* .0 = entrada F, .1 = entrada N, .2 = saída F, .3 = saída N */
  btn:()=>[[-.85,-2.55,1.05],[.85,-2.55,1.05]],
  sw:()=>[[-.85,-2.75,1.0],[.85,-2.75,1.0]],                           /* .0 = L (entrada da fase), .1 = R (retorno) */                      /* .0/.1 = contato (NA 3-4 na BL, NF 1-2 na BD) */
  /* contatora: .0/.1 = A1/A2 (bobina, no degrau recuado), .2/.3 = 1-2 (potência), .4/.5 = 13-14 (selo) */
  kc:()=>[[-2.4,3.1,FRENTE-RECUO+.05],[-2.4,-2.6,FRENTE-RECUO+.05],[0,3.1,FRENTE+.05],[0,-2.6,FRENTE+.05],[2.4,3.1,FRENTE+.05],[2.4,-2.6,FRENTE+.05]],
  /* relé térmico: .0/.1 = 1-2 (força), .2/.3 = 95-96 (NF de comando) */
  ft:()=>[[-1.2,3.1,FRENTE+.05],[-1.2,-2.6,FRENTE+.05],[1.2,3.1,FRENTE+.05],[1.2,-2.6,FRENTE+.05]]
};
const bornesDe=c=>(TERM3D[c.type]?TERM3D[c.type](c):[]).map(p=>new THREE.Vector3(...p));

/* ---------- paleta (skill voltup-3d-anime) ---------- */
const PAL={corpoDIN:0xE6E9EF,frenteDIN:0xD5DAE2,trilho:0x9AA5B4,cavidade:0x1F2933,zinco:0xCBD5E1,fenda:0x3A4048,
  fonte:0x7C8A99,fonteFrente:0x5D6B7A,lcd:0xC6D68A,regua:0x2A2F36,alavanca:0x2F4A6E,pontaAlavanca:0xE24C3F,
  painel:0x1D3550,soquete:0xD9DDE3,base:0xE6E9EF,teste:0xECC94B,armado:0x38A169,desarmado:0xE53E3E,
  botoeiraBase:0x334155,liga:0x2F855A,desliga:0xC53030,janela:0x1F2933,emboloOff:0x94A3B8,emboloOn:0xF97316,rearme:0x3182CE,dial:0x2F4A6E,espelho:0xF1F3F6,tecla:0xE6E9EF,marca:0x2F855A};

/* ---------- cache compartilhado (materiais e texturas estáticos) ----------
   Peças iguais usam o mesmo material; só o que muda com o estado (LED, bulbo, visor) tem material próprio.
   Os fios descartam só a geometria; o cache inteiro é liberado em destruir(). */
let CACHE=null;
const cache=()=>CACHE||(CACHE={mat:new Map(),tex:new Map(),unicos:[]});
function tons(){const C=cache();if(C.tex.has('tons'))return C.tex.get('tons');
  const t=new THREE.DataTexture(new Uint8Array([85,85,85,255,170,170,170,255,255,255,255,255]),3,1,THREE.RGBAFormat);
  t.minFilter=THREE.NearestFilter;t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;C.tex.set('tons',t);return t}
/* material toon compartilhado, pela cor (número ou texto CSS) */
function mat(cor){const C=cache(),k='toon:'+cor;if(!C.mat.has(k))C.mat.set(k,new THREE.MeshToonMaterial({color:new THREE.Color(cor),gradientMap:tons()}));return C.mat.get(k)}
/* material toon só desta peça (muda de cor ou brilho com o estado) */
function matUnico(cor,extra){const m=new THREE.MeshToonMaterial(Object.assign({color:new THREE.Color(cor),gradientMap:tons()},extra||{}));cache().unicos.push(m);return m}
const semContorno=m=>{m.userData.outlineParameters=SEM_CONTORNO;return m};
function canvasTexto(larg,alt,txt,o){const px=128,cv=document.createElement('canvas');cv.width=Math.round(larg*px);cv.height=Math.round(alt*px);pintaTexto(cv,txt,o);return cv}
function pintaTexto(cv,txt,o){const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);if(o.fundo){g.fillStyle=o.fundo;g.fillRect(0,0,cv.width,cv.height)}
  if(o.borda){const lw=Math.round(cv.height*.09);g.lineWidth=lw;g.strokeStyle=o.borda;g.strokeRect(lw/2,lw/2,cv.width-lw,cv.height-lw)}
  g.fillStyle=o.cor||'#1b1a10';g.font='900 '+Math.round(cv.height*(o.esc||.62))+'px Nunito, system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,cv.width/2,cv.height/2+2)}
function texturaDeCanvas(cv){const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
/* rótulo técnico: textura e material em cache pelo texto, cor e tamanho */
function rotulo(txt,larg,alt,o){o=o||{};const C=cache(),k='rot:'+[txt,larg,alt,o.cor,o.fundo,o.esc,o.borda].join('|');
  if(!C.mat.has(k)){const t=texturaDeCanvas(canvasTexto(larg,alt,txt,o));C.tex.set(k,t);C.mat.set(k,semContorno(new THREE.MeshBasicMaterial({map:t,transparent:true})))}
  return new THREE.Mesh(new THREE.PlaneGeometry(larg,alt),C.mat.get(k))}
/* rótulo que muda (visor da fonte): canvas próprio, redesenhado só quando o texto muda */
function rotuloVivo(larg,alt,o){const cv=canvasTexto(larg,alt,'',o),t=texturaDeCanvas(cv),m=semContorno(new THREE.MeshBasicMaterial({map:t,transparent:true}));
  cache().unicos.push(m);const ms=new THREE.Mesh(new THREE.PlaneGeometry(larg,alt),m);ms.userData.vivo={cv,o,txt:''};return ms}
function trocaTexto(ms,txt){const v=ms.userData.vivo;if(v.txt===txt)return;v.txt=txt;pintaTexto(v.cv,txt,v.o);ms.material.map.needsUpdate=true}
function texturaBrilho(k,cor){const C=cache();if(C.tex.has(k))return C.tex.get(k);const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,cor[0]);r.addColorStop(.45,cor[1]);r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);const t=texturaDeCanvas(cv);C.tex.set(k,t);return t}
function sprite(tex,esc){const m=semContorno(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));cache().unicos.push(m);const s=new THREE.Sprite(m);s.scale.setScalar(esc);return s}

/* ---------- cores dos fios: da tabela CORES do 2D (js/conteudo.js), resolvendo var(--x) pelo CSS ---------- */
const PADRAO_FIO={fase:'#e24c3f',neutro:'#6bb9e8',retorno:'#d9dde3',terra:'#43b05c',pos:'#d33a2c',neg:'#1c1f24'};
function coresDoFio(k){const v=(typeof CORES!=='undefined'&&CORES[k]&&CORES[k].c)||PADRAO_FIO[k]||PADRAO_FIO.fase;
  return (v.match(/var\(--[\w-]+\)|#[0-9a-f]{3,8}\b/gi)||[PADRAO_FIO[k]||PADRAO_FIO.fase]).map(x=>x.startsWith('var(')?cssVar(x.slice(4,-1),PADRAO_FIO[k]||'#888'):x)}
/* fio terra: listras nas duas cores de CORES.terra (verde e amarelo), repetidas ao longo do tubo pelas UVs */
function texturaListrada(c1,c2){const C=cache(),k='listra:'+c1+c2;if(C.tex.has(k))return C.tex.get(k);
  const cv=document.createElement('canvas');cv.width=cv.height=32;const g=cv.getContext('2d');g.fillStyle=c1;g.fillRect(0,0,32,32);g.fillStyle=c2;
  for(let x=-32;x<64;x+=16){g.beginPath();g.moveTo(x,0);g.lineTo(x+8,0);g.lineTo(x+40,32);g.lineTo(x+32,32);g.fill()}
  const t=texturaDeCanvas(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;C.tex.set(k,t);return t}
function matFio(k){const C=cache(),ch='fio:'+k;if(C.mat.has(ch))return C.mat.get(ch);const cs=coresDoFio(k);
  const m=cs.length>1?new THREE.MeshToonMaterial({color:0xffffff,map:texturaListrada(cs[0],cs[1]),gradientMap:tons()}):new THREE.MeshToonMaterial({color:new THREE.Color(cs[0]),gradientMap:tons()});
  m.userData.cores=cs;C.mat.set(ch,m);return m}
/* fio esmaecido: quando um borne está selecionado, o que não é do mesmo ponto elétrico fica translúcido */
function matFioApagado(k){const C=cache(),ch='fioApagado:'+k;if(C.mat.has(ch))return C.mat.get(ch);const m=matFio(k).clone();m.transparent=true;m.opacity=.18;m.depthWrite=false;m.userData.cores=matFio(k).userData.cores;C.mat.set(ch,m);return m}
/* curto: material vermelho emissivo compartilhado; o pulso muda só a intensidade dele */
function matCurto(){const C=cache();if(!C.mat.has('curto'))C.mat.set('curto',new THREE.MeshToonMaterial({color:0xff2a2a,emissive:0xff2a2a,emissiveIntensity:1,gradientMap:tons()}));return C.mat.get('curto')}

/* ---------- nomes e plaquetas dos bornes ----------
   O nome de cada borne é o MESMO da bancada 2D (REAL_TERMS em bancada-real.js; botoeira NF: 1-2), para o aluno
   reconhecer o borne nas duas vistas. A plaqueta é legível no celular: texto bold #070c16 sobre #f8fafc, borda
   do --contorno, e inclinada para a câmera 3/4 (gira em X para olhar para cima e para a frente). */
function nomeBorne(c,k){if(c.type==='btn'&&c.nf)return ['1','2'][k];const T=typeof REAL_TERMS!=='undefined'&&REAL_TERMS[c.type];return (T&&T[k]&&T[k].n)||String(k)}
const nomePeca=c=>c.type==='src'?'Fonte':c.id;
const PLAQ={alt:1.1,incl:-.38};
function plaqueta(g,txt,x,y,z){const larg=Math.max(1.1,.62*txt.length+.5);
  const m=rotulo(txt,larg,PLAQ.alt,{fundo:'#f8fafc',cor:'#070c16',borda:cssVar('--contorno','#070c16'),esc:.66});
  m.rotation.x=PLAQ.incl;m.position.set(x,y,z);m.userData.plaqueta=txt;g.add(m);return m}

/* ---------- peças ----------
   Cada construtor devolve {g (grupo), bornes:[Vector3 local], corpo:[malhas tocáveis], extra}. */
function parafuso(){const g=new THREE.Group();
  const cav=new THREE.Mesh(new THREE.CylinderGeometry(.58,.58,.12,20),mat(PAL.cavidade));cav.rotation.x=Math.PI/2;cav.position.z=-.1;g.add(cav);
  const cab=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.28,20),mat(PAL.zinco));cab.rotation.x=Math.PI/2;g.add(cab);
  [0,Math.PI/2].forEach(a=>{const f=new THREE.Mesh(new THREE.BoxGeometry(.58,.1,.06),mat(PAL.fenda));f.rotation.z=a;f.position.z=.16;g.add(f)});/* fenda em cruz */
  return g}
function poeParafusos(g,bornes){bornes.forEach(b=>{const p=parafuso();p.position.copy(b);g.add(p)})}
function fonte(c){const g=new THREE.Group(),bornes=bornesDe(c);
  const caixa=new THREE.Mesh(new THREE.BoxGeometry(6,10,2.4),mat(PAL.fonte));caixa.position.z=1.2;g.add(caixa);
  const frente=new THREE.Mesh(new THREE.BoxGeometry(5.2,6,.2),mat(PAL.fonteFrente));frente.position.set(0,1.4,2.5);g.add(frente);
  const visor=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.4,.1),mat(PAL.lcd));visor.position.set(-.3,2.9,2.62);g.add(visor);
  const tx=rotuloVivo(3.4,1.2,{cor:'#1c240e'});tx.position.set(-.3,2.9,2.69);g.add(tx);
  const led=new THREE.Mesh(new THREE.SphereGeometry(.32,16,12),matUnico(0x43b05c,{emissive:0x1f7a36}));led.position.set(1.95,2.9,2.68);g.add(led);
  const nome=rotulo('FONTE 1F+N',4.6,.8,{cor:'#eef2f7'});nome.position.set(0,.8,2.62);g.add(nome);
  const regua=new THREE.Mesh(new THREE.BoxGeometry(5,1.9,.8),mat(PAL.regua));regua.position.set(0,-3.6,2.8);g.add(regua);
  poeParafusos(g,bornes);
  const cf=coresDoFio('fase')[0],cn=coresDoFio('neutro')[0];
  [[0,'L1',cf],[1,'N',cn]].forEach(([k,t,cor])=>{const anel=new THREE.Mesh(new THREE.TorusGeometry(.66,.09,8,24),mat(cor));anel.position.copy(bornes[k]).add(new THREE.Vector3(0,0,-.06));g.add(anel);
    plaqueta(g,nomeBorne(c,k),bornes[k].x,-1.95,3.55)});
  return {g,bornes,corpo:[caixa,frente,visor],extra:{led,visor:tx}}}
function disjuntor(c){const g=new THREE.Group(),bornes=bornesDe(c),{W,H,D,z0}=DIN;
  const corpo=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),mat(PAL.corpoDIN));corpo.position.z=z0+D/2;g.add(corpo);
  const frente=new THREE.Mesh(new THREE.BoxGeometry(W*.9,H*.46,.7),mat(PAL.frenteDIN));frente.position.set(0,0,z0+D+.35);g.add(frente);
  /* alavanca articulada: gira em torno do eixo X no pino, para cima ligado e para baixo desligado (c.trip) */
  const pino=new THREE.Group();pino.position.set(0,.2,z0+D+.7);g.add(pino);
  const alav=new THREE.Mesh(new THREE.BoxGeometry(1,2,.8),mat(PAL.alavanca));alav.position.y=1;pino.add(alav);
  const ponta=new THREE.Mesh(new THREE.BoxGeometry(1.02,.5,.82),mat(PAL.pontaAlavanca));ponta.position.y=1.8;pino.add(ponta);
  const lab=rotulo(c.lab||c.id,2.2,.8,{cor:'#2f4a6e'});lab.position.set(0,-1.35,z0+D+.71);g.add(lab);
  const curva=rotulo('C10',1.4,.6,{cor:'#2f4a6e'});curva.position.set(0,-3.55,z0+D+.01);g.add(curva);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),W/2+.75,b.y,b.z+.3));
  return {g,bornes,corpo:[corpo,frente,alav,ponta],extra:{pino}}}
/* DR bipolar (2 módulos): alavanca dupla acoplada (as duas caem juntas), botão T de teste e visor armado/desarmado.
   O botão T relata acionou(id, 'test'); o que o teste faz (desarmar) está em acionarPeca. */
function dr(c){const g=new THREE.Group(),bornes=bornesDe(c),{H,D,z0}=DIN,W=LARG_DIN.dr;
  const corpo=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),mat(PAL.corpoDIN));corpo.position.z=z0+D/2;g.add(corpo);
  /* recorte frontal em degrau */
  const frente=new THREE.Mesh(new THREE.BoxGeometry(W*.92,H*.5,.7),mat(PAL.frenteDIN));frente.position.set(0,.1,FRENTE+.35);g.add(frente);
  const pino=new THREE.Group();pino.position.set(0,.5,FRENTE+.7);g.add(pino);
  const alavancas=[-.85,.85].map(x=>{const a=new THREE.Mesh(new THREE.BoxGeometry(.9,2,.8),mat(PAL.alavanca));a.position.set(x,1,0);pino.add(a);return a});
  const barra=new THREE.Mesh(new THREE.BoxGeometry(2.6,.45,.86),mat(PAL.pontaAlavanca));barra.position.y=1.75;pino.add(barra);
  const teste=new THREE.Mesh(new THREE.BoxGeometry(1.1,.7,.36),mat(PAL.teste));teste.position.set(1.35,-1.25,FRENTE+.88);teste.userData.lado='test';g.add(teste);
  const lt=rotulo('T',.6,.6,{cor:'#1b1a10'});lt.position.set(1.35,-1.25,FRENTE+1.07);g.add(lt);
  const visor=new THREE.Mesh(new THREE.BoxGeometry(1.1,.6,.12),matUnico(PAL.armado,{emissive:0x0f4a24}));visor.position.set(-1.2,-1.25,FRENTE+.75);g.add(visor);
  const lab=rotulo((c.lab||c.id)+' 30mA',3.6,.8,{cor:'#2f4a6e'});lab.position.set(0,-3.5,FRENTE+.01);g.add(lab);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),Math.sign(b.x)*(W/2+.65),b.y,b.z+.3));
  return {g,bornes,corpo:[corpo,frente,...alavancas,barra,teste,visor],extra:{pino,visor,teste}}}
/* trilho DIN 35 mm (perfil "chapéu"), extrudado ao longo de X */
function trilho(x0,x1,y){const s=new THREE.Shape(),P=[[-1.35,0],[1.35,0],[1.35,.65],[1.75,.65],[1.75,.75],[1.25,.75],[1.25,.1],[-1.25,.1],[-1.25,.75],[-1.75,.75],[-1.75,.65],[-1.35,.65]];
  s.moveTo(...P[0]);P.slice(1).forEach(p=>s.lineTo(...p));s.closePath();
  const geo=new THREE.ExtrudeGeometry(s,{depth:x1-x0,bevelEnabled:false});
  /* perfil desenhado em (u,v) e extrudado em z → (x = z, y = u, z = v) */
  geo.applyMatrix4(new THREE.Matrix4().set(0,0,1,0, 1,0,0,0, 0,1,0,0, 0,0,0,1));
  const m=new THREE.Mesh(geo,mat(PAL.trilho));m.position.set(x0,y,0);return m}
function lampada(c){const g=new THREE.Group(),bornes=bornesDe(c);
  const base=new THREE.Mesh(new THREE.BoxGeometry(4.2,4.2,.6),mat(PAL.base));base.position.z=.3;g.add(base);
  const soq=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.25,1.8,24),mat(PAL.soquete));soq.rotation.x=Math.PI/2;soq.position.set(0,.5,1.5);g.add(soq);
  const rosca=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,.9,20),mat(PAL.zinco));rosca.rotation.x=Math.PI/2;rosca.position.set(0,.5,2.8);g.add(rosca);
  const bulbo=new THREE.Mesh(new THREE.SphereGeometry(1.75,28,20),matUnico(0x5a6b7d,{emissive:0x000000}));bulbo.position.set(0,.5,4.6);g.add(bulbo);
  const brilho=sprite(texturaBrilho('brilho',['rgba(255,246,200,1)','rgba(255,216,77,.55)']),9);brilho.position.copy(bulbo.position);brilho.visible=false;g.add(brilho);
  const lab=rotulo(c.lab||c.id,2,.9,{cor:'#eef2f7'});lab.position.set(0,2.75,.62);g.add(lab);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,-2.75,.95));
  return {g,bornes,corpo:[base,soq,bulbo],extra:{bulbo,brilho}}}
/* Botoeira em caixa: BL liga (NA, êmbolo verde saliente) e BD desliga (NF, cogumelo vermelho).
   O êmbolo afunda pelo ESTADO c.pressed (os 700 ms de acionarPeca), nunca pelo toque local: 2D e 3D iguais.
   Afunda 0,3 (os 0,12 da especificação original × 2,4, a escala do módulo no MVP). */
const BOTAO={afunda:-.3,z:1.45};
function botoeira(c){const g=new THREE.Group(),bornes=bornesDe(c),nf=!!c.nf,cor=nf?PAL.desliga:PAL.liga;
  const base=new THREE.Mesh(new THREE.BoxGeometry(3.4,3.4,1.2),mat(PAL.botoeiraBase));base.position.set(0,.6,.6);g.add(base);
  [[-1.35,-.75],[1.35,-.75],[-1.35,1.95],[1.35,1.95]].forEach(([x,y])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.12,12),mat(PAL.zinco));p.rotation.x=Math.PI/2;p.position.set(x,y,1.24);g.add(p)});
  const anel=new THREE.Mesh(new THREE.TorusGeometry(1.12,.2,10,32),mat(PAL.zinco));anel.position.set(0,.6,1.32);g.add(anel);/* anel de retenção */
  const colar=new THREE.Mesh(new THREE.CylinderGeometry(.98,.98,.5,24),mat(PAL.cavidade));colar.rotation.x=Math.PI/2;colar.position.set(0,.6,1.45);g.add(colar);
  const embolo=new THREE.Group();embolo.position.set(0,.6,BOTAO.z);g.add(embolo);const partes=[];
  if(nf){const haste=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.7,20),mat(cor));haste.rotation.x=Math.PI/2;haste.position.z=.35;embolo.add(haste);
    const cog=new THREE.Mesh(new THREE.SphereGeometry(1.2,24,12,0,Math.PI*2,0,Math.PI/2),mat(cor));cog.scale.y=.5;cog.rotation.x=Math.PI/2;cog.position.z=.65;embolo.add(cog);partes.push(haste,cog)}
  else{const bot=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,1,24),mat(cor));bot.rotation.x=Math.PI/2;bot.position.z=.5;embolo.add(bot);partes.push(bot)}
  const adesivo=rotulo((c.lab||c.id)+(nf?' · O DESLIGA':' · I LIGA'),3.8,.85,{fundo:nf?'#C53030':'#2F855A',cor:'#f8fafc',esc:.6});adesivo.position.set(0,2.85,.62);g.add(adesivo);
  const bloco=new THREE.Mesh(new THREE.BoxGeometry(3,1.3,1),mat(PAL.cavidade));bloco.position.set(0,-2.55,.5);g.add(bloco);/* bloco de contato */
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,-3.75,.55));
  return {g,bornes,corpo:[base,colar,...partes],extra:{embolo}}}
/* Contatora (3 módulos): degrau recuado com a bobina A1/A2 (etiqueta da tensão da rede), frente com o contato de
   potência 1-2 e o auxiliar 13-14. Janela central com o êmbolo: com c.on (bobina energizada) ele recua e fica laranja.
   Não é acionável à mão (só a bobina liga a contatora): o toque no corpo não muda nada. */
const EMBOLO={z:FRENTE+.35,recuo:-.2};
function contatora(c){const g=new THREE.Group(),bornes=bornesDe(c),{H,D,z0}=DIN,W=LARG_DIN.kc,wd=DIN.W;
  const corpo=new THREE.Mesh(new THREE.BoxGeometry(W-wd,H,D),mat(PAL.corpoDIN));corpo.position.set(wd/2,0,z0+D/2);g.add(corpo);
  const degrau=new THREE.Mesh(new THREE.BoxGeometry(wd,H,D-RECUO),mat(PAL.frenteDIN));degrau.position.set(-W/2+wd/2,0,z0+(D-RECUO)/2);g.add(degrau);
  const janela=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.6,.2),mat(PAL.janela));janela.position.set(1.2,.25,FRENTE+.1);g.add(janela);
  const embolo=new THREE.Mesh(new THREE.BoxGeometry(1.2,.8,.5),mat(PAL.emboloOff));embolo.position.set(1.2,.25,EMBOLO.z);g.add(embolo);
  const lab=rotulo(c.lab||c.id,1.6,.8,{cor:'#2f4a6e'});lab.position.set(1.2,-1.25,FRENTE+.01);g.add(lab);
  const bob=rotulo((typeof rede==='function'?rede().V:220)+' V~',2.1,.62,{fundo:'#2f4a6e',cor:'#f8fafc',esc:.62});bob.position.set(-W/2+wd/2,.25,FRENTE-RECUO+.02);g.add(bob);
  poeParafusos(g,bornes);
  /* plaquetas acima dos bornes de cima e abaixo dos de baixo, deslocadas para o fio não cobrir o texto */
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x+.75,b.y+(b.y>0?1.05:-1.05),b.z+.3));
  return {g,bornes,corpo:[corpo,degrau,janela,embolo],extra:{embolo}}}
/* Relé térmico (2 módulos): dial de ajuste da corrente, botão azul de rearme e visor (verde armado, vermelho disparado).
   O toque no corpo relata acionou(id): em acionarPeca isso simula a sobrecarga ou rearma (c.trip). */
function reletermico(c){const g=new THREE.Group(),bornes=bornesDe(c),{H,D,z0}=DIN,W=LARG_DIN.ft;
  const corpo=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),mat(PAL.corpoDIN));corpo.position.z=z0+D/2;g.add(corpo);
  const frente=new THREE.Mesh(new THREE.BoxGeometry(W*.9,H*.46,.5),mat(PAL.frenteDIN));frente.position.set(0,.2,FRENTE+.25);g.add(frente);
  const dial=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.3,24),mat(PAL.dial));dial.rotation.x=Math.PI/2;dial.position.set(-.95,.9,FRENTE+.65);g.add(dial);
  const ponteiro=new THREE.Mesh(new THREE.BoxGeometry(.12,.6,.1),mat(PAL.zinco));ponteiro.position.set(-.95,1.1,FRENTE+.82);ponteiro.rotation.z=-.6;g.add(ponteiro);
  const rearme=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.5,20),mat(PAL.rearme));rearme.rotation.x=Math.PI/2;rearme.position.set(1,.9,FRENTE+.75);g.add(rearme);
  const visor=new THREE.Mesh(new THREE.BoxGeometry(1.4,.55,.12),matUnico(PAL.armado,{emissive:0x0f4a24}));visor.position.set(0,-.55,FRENTE+.52);g.add(visor);
  const lab=rotulo((c.lab||c.id)+' · 95-96',3.6,.75,{cor:'#2f4a6e'});lab.position.set(0,-1.5,FRENTE+.51);g.add(lab);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),Math.sign(b.x)*(W/2+.7),b.y,b.z+.3));
  return {g,bornes,corpo:[corpo,frente,dial,rearme,visor],extra:{visor,rearme}}}
/* Interruptor simples de parede: espelho, tecla basculante e bloco de bornes L (fase) e R (retorno).
   A tecla inclina pelo estado c.closed (o toque relata acionou; em acionarPeca, flipSwitch inverte). */
const TECLA={on:-.3,off:.3,z:.6};
function interruptor(c){const g=new THREE.Group(),bornes=bornesDe(c);
  const espelho=new THREE.Mesh(new THREE.BoxGeometry(3.4,4.4,.5),mat(PAL.espelho));espelho.position.set(0,.7,.25);g.add(espelho);
  const moldura=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.2,.12),mat(PAL.cavidade));moldura.position.set(0,.7,.52);g.add(moldura);
  const pino=new THREE.Group();pino.position.set(0,.7,TECLA.z);g.add(pino);
  const tecla=new THREE.Mesh(new THREE.BoxGeometry(2.1,2.9,.45),mat(PAL.tecla));tecla.position.z=.2;pino.add(tecla);
  const marca=new THREE.Mesh(new THREE.BoxGeometry(.9,.18,.06),mat(PAL.marca));marca.position.set(0,1.05,.45);pino.add(marca);
  const adesivo=rotulo(c.lab||c.id,2.2,.8,{fundo:'#2f4a6e',cor:'#f8fafc',esc:.62});adesivo.position.set(0,3.4,.52);g.add(adesivo);
  const bloco=new THREE.Mesh(new THREE.BoxGeometry(3,1.2,.9),mat(PAL.cavidade));bloco.position.set(0,-2.75,.45);g.add(bloco);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,-3.95,.55));
  return {g,bornes,corpo:[espelho,moldura,tecla],extra:{pino}}}
const CONSTRUTOR={src:fonte,fuse:disjuntor,lamp:lampada,dr,btn:botoeira,kc:contatora,ft:reletermico,sw:interruptor};

/* ---------- caminho da energia em 3D (faixa no alto do mesmo canvas) ----------
   Poste com transformador → ramal → medidor na fachada → quadro → circuito (lâmpada), na mesma linguagem visual da
   bancada (toon + contorno). Ligado: a energia corre pelos cabos (pontos de luz), o LED do medidor pisca e a lâmpada
   acende. Curto: os cabos piscam em vermelho. Legendas iguais às do SVG (entrada() em motor.js), com a rede escolhida.
   Fica no mesmo contexto WebGL (viewport de cima), sem abrir um segundo canvas no celular. */
const FX={altura:.33,maxAlt:160,ceu:0x10233a,cabo:0x1F2933,fluxo:0xFFE680,larg:41,alt:16.6,centro:[1.2,5.3,0]};
function montaFaixa(){
  const V=THREE.Vector3,sc=new THREE.Scene();sc.background=new THREE.Color(FX.ceu);
  sc.add(new THREE.HemisphereLight(0xDCE6F2,0x3A4A6B,.9));const sol=new THREE.DirectionalLight(0xFFFDF5,2.2);sol.position.set(10,16,24);sc.add(sol);
  const F={scene:sc,camera:new THREE.PerspectiveCamera(26,3,.5,300),cabos:[],pontos:[],estado:'',legendas:[]};
  const box=(w,h,d,cor,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(cor));m.position.set(x,y,z);sc.add(m);return m};
  const cil=(rt,rb,h,cor,x,y,z,deitado)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,18),mat(cor));m.position.set(x,y,z);if(deitado)m.rotation.x=Math.PI/2;sc.add(m);return m};
  /* calçada, fachada e beiral */
  box(48,1.5,6,0x2A3646,1,-1.25,0);/* calçada com meio-fio alto: as legendas ficam pintadas na frente dele */box(31,10.2,.8,0xE8DCC4,4.6,4.3,-1.4);box(31.6,.5,1.4,0xC9B79A,4.6,9.6,-1.1);
  /* poste de concreto com cruzeta, isoladores e a rede de média tensão saindo da tela */
  cil(.3,.5,12.6,0xB8C0CA,-16,5.8,0);box(6.2,.45,.5,0x8A94A3,-16,11.3,0);
  [-18.6,-16,-13.4].forEach(x=>{cil(.17,.24,.8,0xE6E9EF,x,11.9,0);const mt=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new V(x,12.3,0),new V(-21,11.9,0),new V(-27,11.6,0)]),12,.07,6,false),mat(FX.cabo));sc.add(mt)});
  /* transformador no poste: tanque com aletas e 3 buchas */
  cil(1.15,1.15,2.6,0x7C8A99,-14.3,8.1,.9);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2,al=box(.12,2.1,.7,0x6B7889,-14.3+Math.cos(a)*1.25,8.1,.9+Math.sin(a)*1.25);al.rotation.y=-a}
  [-.6,0,.6].forEach(dx=>cil(.14,.2,.6,0xE6E9EF,-14.3+dx,9.7,.9));
  box(.9,.25,.25,0x8A94A3,-15.3,8.1,.4);/* suporte */
  /* medidor (padrão de entrada) na fachada: visor kWh e LED que pisca com consumo */
  box(2.6,3.4,1,0xCBD5E1,-5.4,4.6,-.5);box(2.1,1.9,.12,0x9FB6C9,-5.4,5.1,.05);
  const visor=rotulo('0427 kWh',1.9,.62,{fundo:'#c6d68a',cor:'#1c240e',esc:.58});visor.position.set(-5.4,5.25,.13);sc.add(visor);
  const led=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),matUnico(0x5a1a12,{emissive:0x000000}));led.position.set(-4.6,4.4,.15);sc.add(led);
  /* quadro de distribuição: porta aberta com a fileira de disjuntores */
  box(3.8,4.6,.9,0xEEF2F7,3,4.6,-.55);box(3.2,3.9,.1,0x2A2F36,3,4.6,-.05);
  for(let i=0;i<4;i++){box(.6,1.3,.5,0xE6E9EF,1.8+i*.8,4.6,.2);box(.36,.45,.3,0x2F4A6E,1.8+i*.8,4.9,.5)}
  const porta=box(.15,4.6,3.4,0xEEF2F7,4.95,4.6,1.1);porta.rotation.y=-.35;
  /* circuito: arandela na parede com a lâmpada */
  box(1.2,1.4,.5,0xD9DDE3,13.4,6.2,-.8);cil(.45,.55,.9,0xCBD5E1,13.4,6.2,-.2,true);
  const bulbo=new THREE.Mesh(new THREE.SphereGeometry(.85,20,14),matUnico(0x5a6b7d,{emissive:0x000000}));bulbo.position.set(13.4,6.2,.75);sc.add(bulbo);
  const brilho=sprite(texturaBrilho('brilho',['rgba(255,246,200,1)','rgba(255,216,77,.55)']),6);brilho.position.copy(bulbo.position);brilho.visible=false;sc.add(brilho);
  /* cabos: ramal com barriga (como o de verdade) e, na fachada, em linhas retas até o quadro e a lâmpada */
  const cabo=cur=>{const m=new THREE.Mesh(new THREE.TubeGeometry(cur,64,.13,8,false),mat(FX.cabo));m.userData.cur=cur;sc.add(m);F.cabos.push(m);return m};
  cabo(new THREE.CatmullRomCurve3([new V(-13.7,9.95,.9),new V(-10.5,8.1,.6),new V(-7.6,7.6,.1),new V(-5.4,7.2,-.4),new V(-5.4,6.35,-.4)],false,'catmullrom',.5));
  cabo(caminho([new V(-5.4,2.9,-.3),new V(-5.4,1.7,-.3),new V(3,1.7,-.3),new V(3,2.3,-.3)]));
  cabo(caminho([new V(3,6.9,-.3),new V(3,8.2,-.3),new V(13.4,8.2,-.3),new V(13.4,6.9,-.3)]));
  const pg=new THREE.SphereGeometry(.24,10,8),pm=semContorno(new THREE.MeshBasicMaterial({color:FX.fluxo}));cache().unicos.push(pm);
  F.cabos.forEach((c,ci)=>{for(let i=0;i<4;i++){const p=new THREE.Mesh(pg,pm);p.visible=false;p.userData={cur:c.userData.cur,fase:i/4+ci*.13};sc.add(p);F.pontos.push(p)}});
  /* legendas: as mesmas do SVG */
  const r=typeof rede==='function'?rede():{V:220,Hz:60},leve=typeof L==='function'&&L();
  const textos=leve?['Poste','Medidor','Quadro','Circuito']:['Trafo 13,8 kV→'+r.V+' V','Medidor kWh','Quadro + DJ',r.V+' V~ · '+r.Hz+' Hz'];
  [-15,-5.4,3,13.4].forEach((x,i)=>{const t=textos[i],l=rotulo(t,Math.max(3.4,t.length*.56),1.25,{cor:'#f8fafc',esc:.7});l.position.set(x,-1.25,3.06);sc.add(l);F.legendas.push(t)});
  Object.assign(F,{led,bulbo,brilho});return F}
function enquadraFaixa(){const F=E.faixa,c=new THREE.Vector3(...FX.centro),meia=Math.tan(F.camera.fov*Math.PI/360);
  const d=Math.max(FX.alt,FX.larg/F.camera.aspect)/2/meia;F.camera.position.copy(c).addScaledVector(new THREE.Vector3(.06,.12,1).normalize(),d);F.camera.lookAt(c);F.camera.updateProjectionMatrix()}
/* estado da faixa: 'on' (alguma carga ligada), 'short' (curto agora) ou '' */
function estadoFaixa(est){const F=E.faixa;if(!F||F.estado===est)return;F.estado=est;
  F.pontos.forEach(p=>p.visible=est==='on'&&!reduz());
  F.cabos.forEach(c=>c.material=est==='short'?matCurto():mat(FX.cabo));
  const on=est==='on';F.bulbo.material.color.setHex(on?0xfff2a8:0x5a6b7d);F.bulbo.material.emissive.setRGB(on?1:0,on?.85:0,on?.3:0);F.brilho.visible=on;
  if(!on){F.led.material.emissive.setHex(0x000000)}}
/* energia correndo: pontos andando pelos cabos e LED do medidor piscando */
function animaFaixa(agora){const F=E.faixa;if(!F||F.estado!=='on'||reduz())return false;
  F.pontos.forEach(p=>{const u=(agora/1800+p.userData.fase)%1;p.position.copy(p.userData.cur.getPointAt(u)).add(new THREE.Vector3(0,0,.18))});
  F.led.material.emissive.setHex(Math.floor(agora/350)%2?0xff3b2a:0x000000);return true}

/* ---------- estado da cena (uma bancada 3D por vez) ---------- */
let E=null;

function montar(no,ctx){
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0x13283c,1);
  const cv=renderer.domElement;cv.style.touchAction='none';cv.setAttribute('aria-label','Bancada 3D: toque em dois parafusos para ligar um fio');no.appendChild(cv);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,4/3,.5,300);camera.position.set(6,9,46);
  /* luz principal quente em 3/4 frontal-superior + preenchimento com sombra azulada (skill voltup-3d-anime) */
  scene.add(new THREE.HemisphereLight(0xDCE6F2,0x3A4A6B,.9));
  const sol=new THREE.DirectionalLight(0xFFFDF5,2.2);sol.position.set(10,16,24);scene.add(sol);
  scene.background=new THREE.Color(0x13283c);
  const painel=new THREE.Mesh(new THREE.BoxGeometry(37,28,.6),mat(PAL.painel));painel.position.z=-.3;scene.add(painel);
  const controls=new OrbitControls(camera,cv);controls.target.set(0,-1,2);
  controls.screenSpacePanning=true;
  /* contorno com o --contorno do jogo (mesma lineart do SVG) */
  const contorno=new THREE.Color(cssVar('--contorno','#070c16'));
  const efeito=new OutlineEffect(renderer,{defaultThickness:.0045,defaultColor:[contorno.r,contorno.g,contorno.b],defaultAlpha:1});
  E={no,renderer,scene,camera,controls,efeito,cv,contorno:'#'+contorno.getHexString(),pecas:{},bornes:{},hits:[],fios:[],fioTmp:null,assinaturaFios:'',anim:[],pedido:0,ctx:null,
     sel:null,faisca:null,curtoAte:0,raycaster:new THREE.Raycaster(),tamanho:[0,0]};
  /* anel que marca o borne selecionado (toque-toque) */
  const anel=semContorno(new THREE.MeshBasicMaterial({color:0xf4c430}));cache().unicos.push(anel);
  E.sel=new THREE.Mesh(new THREE.TorusGeometry(.85,.14,10,32),anel);E.sel.visible=false;scene.add(E.sel);
  E.faisca=sprite(texturaBrilho('faisca',['rgba(255,255,255,1)','rgba(255,160,60,.8)']),6);E.faisca.visible=false;scene.add(E.faisca);
  /* badge do borne: aparece acima do dedo durante o toque e o arraste (o polegar cobre a plaqueta) */
  E.faixa=montaFaixa();E.faixaH=0;
  E.badge=document.createElement('div');E.badge.className='badge-borne';E.badge.hidden=true;E.badge.setAttribute('aria-live','polite');no.appendChild(E.badge);
  construir(ctx.st);
  /* caixa que envolve as peças desta bancada: a câmera enquadra o que existe (cada fase tem um arranjo) */
  E.caixa=new THREE.Box3();Object.values(E.pecas).forEach(p=>E.caixa.expandByObject(p.g));
  limites(controls);controls.update();
  controls.addEventListener('change',pede);
  controls.addEventListener('start',()=>{if(E&&E.livre)controls.autoRotate=false});/* tocou: para o giro automático */
  /* modo 360°: solta a câmera para dar a volta na instalação; enquanto ativo, nada na bancada muda */
  E.b360=document.createElement('button');E.b360.type='button';E.b360.className='btn vbtn b360';E.b360.setAttribute('aria-pressed','false');E.b360.textContent='↻ 360°';
  E.b360.addEventListener('click',()=>modo360(!E.livre));no.appendChild(E.b360);
  E.dica=document.createElement('div');E.dica.className='dica360';E.dica.hidden=true;E.dica.textContent='Arraste para dar a volta na instalação. Para montar, toque em ✋.';no.appendChild(E.dica);
  no.addEventListener('pointerdown',aoTocar,true);/* captura: decide antes do OrbitControls */
  E.ro=new ResizeObserver(()=>{if(dimensiona())pede()});E.ro.observe(no);
}
function construir(st){
  /* um trilho para cada linha de peças DIN (mesmo y), cobrindo a largura de todas */
  const linhas={};st.comps.filter(c=>LARG_DIN[c.type]).forEach(c=>{const y=pos2d(c).y;(linhas[y]=linhas[y]||[]).push(c)});
  Object.entries(linhas).forEach(([y,cs])=>{const x0=Math.min(...cs.map(c=>pos2d(c).x-LARG_DIN[c.type]/2)),x1=Math.max(...cs.map(c=>pos2d(c).x+LARG_DIN[c.type]/2));E.scene.add(trilho(x0-1.5,x1+1.5,+y))});
  /* esfera de toque compartilhada (invisível, maior que o parafuso) */
  const toque=semContorno(new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}));cache().unicos.push(toque);E.matToque=toque;const geoToque=new THREE.SphereGeometry(1.2,10,8);
  st.comps.forEach(c=>{const f=CONSTRUTOR[c.type];if(!f)return;
    const p=f(c);p.g.position.copy(pos2d(c));E.scene.add(p.g);p.g.updateMatrixWorld(true);E.pecas[c.id]={c,...p,ang:c.trip?.5:-.5,caixa:new THREE.Box3().setFromObject(p.g)};
    p.corpo.forEach(m=>{m.userData.peca=c.id;E.hits.push(m)});
    p.bornes.forEach((v,k)=>{const id=c.id+'.'+k,w=p.g.localToWorld(v.clone());E.bornes[id]=w;
      const h=new THREE.Mesh(geoToque,toque);h.position.copy(w);h.userData.t=id;E.scene.add(h);E.hits.push(h)})});
}
/* tamanho do canvas acompanha a largura da bancada (4:3, até 520 px de altura) */
/* canvas = faixa do caminho da energia em cima + bancada embaixo (4:3, até 520 px) */
function dimensiona(){const w=Math.max(260,Math.round(E.no.clientWidth||E.no.parentElement&&E.no.parentElement.clientWidth||340)),h=Math.round(Math.min(w*.78,520)),hb=Math.round(Math.min(FX.maxAlt,w*FX.altura));
  if(w===E.tamanho[0]&&h===E.tamanho[1]&&hb===E.faixaH)return false;E.tamanho=[w,h];E.faixaH=hb;E.renderer.setSize(w,h+hb);
  E.camera.aspect=w/h;E.camera.updateProjectionMatrix();E.faixa.camera.aspect=w/hb;enquadraFaixa();enquadra();
  E.b360.style.top=(hb+8)+'px';return true}
/* põe a câmera em 3/4 frontal-superior, longe o bastante para caber todas as peças com folga (reenquadra quando o tamanho muda) */
/* modo de trabalho: a câmera gira pouco, para o quadro nunca ficar de costas */
function limites(c){c.minAzimuthAngle=-.65;c.maxAzimuthAngle=.65;c.minPolarAngle=.95;c.maxPolarAngle=1.95}
function modo360(on){if(!E)return;E.livre=!!on;const c=E.controls;
  if(E.livre){c.minAzimuthAngle=-Infinity;c.maxAzimuthAngle=Infinity;c.minPolarAngle=.08;c.maxPolarAngle=Math.PI-.08;c.maxDistance=(E.dist||40)*2.2;c.autoRotate=!reduz();c.autoRotateSpeed=2.4;escondeBadge()}
  else{c.autoRotate=false;limites(c);enquadra()}
  E.b360.setAttribute('aria-pressed',String(E.livre));E.b360.textContent=E.livre?'✋ Montar':'↻ 360°';E.dica.hidden=!E.livre;E.no.classList.toggle('livre',E.livre);pede()}
function enquadra(){if(!E.caixa||E.caixa.isEmpty())return;const tam=E.caixa.getSize(new THREE.Vector3()),c=E.caixa.getCenter(new THREE.Vector3());
  const meia=Math.tan(E.camera.fov*Math.PI/360),d=Math.max(tam.y*1.25,tam.x*1.15/E.camera.aspect)/2/meia+tam.z;
  E.camera.position.copy(c).addScaledVector(new THREE.Vector3(.13,.2,1).normalize(),d);E.controls.target.copy(c);
  E.dist=d;E.controls.minDistance=d*.45;E.controls.maxDistance=d*(E.livre?2.2:1.6);E.controls.update()}

/* ---------- desenho sob demanda: só há laço enquanto alguma animação está rodando ---------- */
function pede(){if(E&&!E.pedido)E.pedido=requestAnimationFrame(quadro)}
function quadro(){if(!E)return;E.pedido=0;const agora=performance.now();
  E.anim=E.anim.filter(a=>{const k=Math.min(1,(agora-a.t0)/a.dur);a.passo(k,agora);return k<1});
  const gira=E.livre&&E.controls.autoRotate;if(gira)E.controls.update();/* giro automático do 360° */
  const r=E.renderer,[w,h]=E.tamanho,hb=E.faixaH||0;r.setScissorTest(true);
  r.setViewport(0,0,w,h);r.setScissor(0,0,w,h);E.efeito.render(E.scene,E.camera);
  let flui=false;if(hb){flui=animaFaixa(agora);r.setViewport(0,h,w,hb);r.setScissor(0,h,w,hb);E.efeito.render(E.faixa.scene,E.faixa.camera)}
  r.setScissorTest(false);if(E.anim.length||gira||flui)pede()}
const anima=(dur,passo)=>{if(reduz()){passo(1,performance.now());return}E.anim.push({t0:performance.now(),dur,passo});pede()};

/* ---------- fios ----------
   Organizados como num diagrama: finos, em ângulo reto com cantos arredondados, cada um na sua pista.
   O fio sai do borne para a frente, corre pela face da peça até a borda (por cima ou por baixo, conforme o lado do
   borne), mergulha até perto da chapa e segue numa pista própria (altura e profundidade diferentes para cada fio),
   para fios paralelos não se sobreporem. Um tubo invisível mais grosso em volta mantém o toque fácil. */
const FIO={raio:.13,toque:.5,canto:.45,frente:.45,margem:.35,pista:.3,prof:.09,z0:.85,pistas:7};
function saida(id){const T=E.bornes[id],p=E.pecas[id.split('.')[0]],cx=p.caixa,c=cx.getCenter(new THREE.Vector3()),dir=T.y>=c.y?1:-1;
  return {T,dir,borda:dir>0?cx.max.y+FIO.margem:cx.min.y-FIO.margem}}
/* polilinha com cantos arredondados (curva quadrática em cada canto) */
function caminho(pts){const P=pts.filter((p,i)=>i===0||p.distanceTo(pts[i-1])>1e-3),cp=new THREE.CurvePath();let atual=P[0].clone();
  for(let i=1;i<P.length-1;i++){const a=P[i-1],p=P[i],b=P[i+1],li=p.distanceTo(a),lo=b.distanceTo(p),r=Math.min(FIO.canto,li/2,lo/2);
    const ent=p.clone().addScaledVector(p.clone().sub(a).normalize(),-r),sai=p.clone().addScaledVector(b.clone().sub(p).normalize(),r);
    if(atual.distanceTo(ent)>1e-3)cp.add(new THREE.LineCurve3(atual,ent));cp.add(new THREE.QuadraticBezierCurve3(ent,p.clone(),sai));atual=sai}
  cp.add(new THREE.LineCurve3(atual,P[P.length-1].clone()));return cp}
function rota(w,i){const a=saida(w.a),b=saida(w.b),A=a.T,B=b.T,V=THREE.Vector3,pista=i%FIO.pistas;
  const zL=FIO.z0+pista*FIO.prof,yc=a.borda+a.dir*(.45+pista*FIO.pista),zA=A.z+FIO.frente,zB=B.z+FIO.frente;
  return caminho([A,new V(A.x,A.y,zA),new V(A.x,a.borda,zA),new V(A.x,a.borda,zL),new V(A.x,yc,zL),new V(B.x,yc,zL),new V(B.x,b.borda,zL),new V(B.x,b.borda,zB),new V(B.x,B.y,zB),B])}
function tubo(cur,raio,lados){return new THREE.TubeGeometry(cur,Math.max(32,Math.round(cur.getLength()*5)),raio,lados,false)}
function listras(geo,comp){const rep=Math.max(2,Math.round(comp*1.2)),uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*rep)}
/* fio provisório do arraste: reto e fino, do borne até o dedo */
function curvaFio(a,b){const m=a.clone().add(b).multiplyScalar(.5).add(new THREE.Vector3(0,0,1.2));return new THREE.CatmullRomCurve3([a,a.clone().add(new THREE.Vector3(0,0,.8)),m,b],false,'catmullrom',.5)}
function malhaFio(a,b,cor){const cur=curvaFio(a,b),geo=tubo(cur,FIO.raio,8);listras(geo,cur.getLength());const m=new THREE.Mesh(geo,matFio(cor));m.userData.cor=cor;return m}
function tiraMalha(m){E.scene.remove(m);m.geometry.dispose()}/* material e textura são do cache */
function tiraFio(f){const h=f.userData.toque;if(h){E.hits.splice(E.hits.indexOf(h),1);tiraMalha(h)}tiraMalha(f)}
function desenhaFios(st){
  const ass=st.wires.map(w=>w.a+'>'+w.b+':'+(w.cor||'')).join('|');if(ass===E.assinaturaFios)return;E.assinaturaFios=ass;
  E.fios.forEach(tiraFio);E.fios=[];
  st.wires.forEach((w,i)=>{if(!E.bornes[w.a]||!E.bornes[w.b])return;const cor=w.cor||'fase',cur=rota(w,i);
    const geo=tubo(cur,FIO.raio,8);listras(geo,cur.getLength());const m=new THREE.Mesh(geo,matFio(cor));m.userData={w:i,cor,a:w.a};
    const h=new THREE.Mesh(tubo(cur,FIO.toque,6),E.matToque);h.userData.w=i;m.userData.toque=h;
    E.scene.add(m,h);E.fios.push(m);E.hits.push(h)});
}
/* curto: os fios do caminho trocam para o material de curto (pulsa) e a faísca estala onde o curto fechou */
function animaCurto(curto){
  const ms=E.fios.filter(f=>curto.fios.includes(f.userData.w));E.curtoAte=performance.now()+1400;
  const id=curto.onde&&curto.onde.split('.')[0],onde=curto.onde&&(E.bornes[curto.onde]||(E.pecas[id]&&E.pecas[id].g.position));
  if(onde){E.faisca.position.copy(onde).add(new THREE.Vector3(0,0,1.2));E.faisca.visible=true}
  const mc=matCurto();ms.forEach(m=>{m.material=mc});
  anima(1400,k=>{const on=Math.floor(k*9)%2===0&&k<1;mc.emissiveIntensity=on?1:.15;
    E.faisca.scale.setScalar(on?4+Math.random()*4:1.5);E.faisca.material.opacity=1-k;
    if(k>=1){E.faisca.visible=false;ms.forEach(m=>{m.material=matFio(m.userData.cor)})}});
}

function atualizar(ctx){
  if(!E)return;E.ctx=ctx;const st=ctx.st,res=ctx.res||{lamp:{}};
  st.comps.forEach(c=>{const p=E.pecas[c.id];if(!p)return;
    /* disjuntor e DR: a alavanca (no DR, as duas acopladas) cai quando c.trip */
    if(c.type==='fuse'||c.type==='dr'){const alvo=c.trip?.5:-.5;if(p.ang!==alvo){const de=p.extra.pino.rotation.x;p.ang=alvo;anima(180,k=>{p.extra.pino.rotation.x=de+(alvo-de)*k})}else p.extra.pino.rotation.x=alvo}
    /* botoeira: o êmbolo afunda enquanto c.pressed (estado do acionarPeca) e volta quando ele cai */
    /* contatora: o êmbolo recua e fica laranja enquanto a bobina está energizada (c.on, calculado pelo solver) */
    if(c.type==='kc'){const on=!!c.on;if(p.on!==on){p.on=on;const e=p.extra.embolo,de=e.position.z,para=EMBOLO.z+(on?EMBOLO.recuo:0);e.material=mat(on?PAL.emboloOn:PAL.emboloOff);anima(120,k=>{e.position.z=de+(para-de)*k})}}
    /* relé térmico: visor vermelho e botão de rearme saltado quando disparado (c.trip) */
    if(c.type==='ft'){p.extra.visor.material.color.setHex(c.trip?PAL.desarmado:PAL.armado);p.extra.visor.material.emissive.setHex(c.trip?0x6b1a12:0x0f4a24);p.extra.rearme.position.z=FRENTE+(c.trip?1.05:.75)}
    /* interruptor: a tecla inclina para ligado ou desligado (c.closed) */
    if(c.type==='sw'){const alvo=c.closed?TECLA.on:TECLA.off;if(p.tec!==alvo){const pi=p.extra.pino,de=p.tec===undefined?alvo:pi.rotation.x;p.tec=alvo;anima(120,k=>{pi.rotation.x=de+(alvo-de)*k})}}
    if(c.type==='btn'){const alvo=c.pressed?BOTAO.afunda:0;if(p.emb!==alvo){const de=p.extra.embolo.position.z,para=BOTAO.z+alvo;p.emb=alvo;anima(90,k=>{p.extra.embolo.position.z=de+(para-de)*k})}}
    if(c.type==='dr'){p.extra.visor.material.color.setHex(c.trip?PAL.desarmado:PAL.armado);p.extra.visor.material.emissive.setHex(c.trip?0x6b1a12:0x0f4a24)}
    if(c.type==='src'){p.extra.led.material.color.setHex(c.trip?0xe24c3f:0x43b05c);p.extra.led.material.emissive.setHex(c.trip?0x7a1d12:0x1f7a36);
      trocaTexto(p.extra.visor,c.trip?'PROT':(typeof rede==='function'?rede().V:220)+' V~')}
    if(c.type==='lamp'){const b=Math.max(0,Math.min(1,res.lamp[c.id]||0));p.brilho=b;
      p.extra.bulbo.material.color.setHex(b>.04?0xfff2a8:0x5a6b7d);p.extra.bulbo.material.emissive.setRGB(1*b,.85*b,.3*b);
      p.extra.brilho.visible=b>.04;p.extra.brilho.material.opacity=b;p.extra.brilho.scale.setScalar(5+5*b)}});
  desenhaFios(st);
  /* realce do ponto elétrico: com um borne selecionado, só os fios do mesmo potencial ficam cheios */
  const ponto=ctx.sel&&res.net?res.net(ctx.sel):null;E.realce=ponto;
  if(!(ctx.curto&&ctx.curto.fios))E.fios.forEach(f=>{f.material=!ponto||res.net(f.userData.a)===ponto?matFio(f.userData.cor):matFioApagado(f.userData.cor)});
  const sb=ctx.sel&&E.bornes[ctx.sel];E.sel.visible=!!sb;if(sb)E.sel.position.copy(sb).add(new THREE.Vector3(0,0,.3));
  if(ctx.curto&&ctx.curto.fios)animaCurto(ctx.curto);
  /* caminho da energia: ligado se alguma carga está ligada; curto se acabou de haver curto */
  estadoFaixa(ctx.curto?'short':Object.values(res.lamp||{}).some(b=>b>.04)?'on':'');
  dimensiona();const bancada=E.no.parentElement;if(bancada)bancada.style.setProperty('--faixa3d',(E.faixaH||0)+'px');pede();
}

/* ---------- badge do borne (HTML, pointer-events: none) ---------- */
function textoBorne(id){const [pid,k]=id.split('.'),p=E.pecas[pid];return p?nomePeca(p.c)+' · '+nomeBorne(p.c,+k):id}
function mostraBadge(x,y,txt){const r=E.no.getBoundingClientRect(),b=E.badge;clearTimeout(E.badgeT);b.textContent=txt;b.style.left=(x-r.left)+'px';b.style.top=(y-r.top)+'px';b.hidden=false}
function escondeBadge(ms){clearTimeout(E.badgeT);if(ms)E.badgeT=setTimeout(()=>{if(E)E.badge.hidden=true},ms);else E.badge.hidden=true}

/* ---------- toque: raycast nos bornes, peças e fios; o resto vai para o OrbitControls ---------- */
/* retângulo da bancada na tela (o canvas tem a faixa do caminho da energia em cima) */
function areaBancada(){const r=E.cv.getBoundingClientRect(),b=E.faixaH||0;return {left:r.left,top:r.top+b,width:r.width,height:r.height-b}}
const ndc=(x,y,r)=>new THREE.Vector2((x-r.left)/r.width*2-1,-((y-r.top)/r.height)*2+1);
function alvoEm(x,y){const r=areaBancada();if(!r.width||y<r.top)return null;
  /* matrizes em dia mesmo antes do próximo quadro (toque logo depois de ligar um fio, ou nos testes) */
  E.scene.updateMatrixWorld();E.camera.updateMatrixWorld();
  E.raycaster.setFromCamera(ndc(x,y,r),E.camera);
  const it=E.raycaster.intersectObjects(E.hits,false);if(!it.length)return null;
  const t=it.find(i=>i.object.userData.t);if(t)return {t:t.object.userData.t};/* borne tem prioridade (área de toque maior) */
  const u=it[0].object.userData;return u.peca?{peca:u.peca,lado:u.lado}:u.w!==undefined?{w:u.w}:null}
function pontoNoPlano(x,y){const r=areaBancada();
  E.raycaster.setFromCamera(ndc(x,y,r),E.camera);const q=new THREE.Vector3();return E.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),-3),q)?q:null}
function aoTocar(e){
  if(!E||!E.ctx||e.target!==E.cv||E.livre||(e.button!==undefined&&e.button>0))return;
  const alvo=alvoEm(e.clientX,e.clientY);if(!alvo)return;/* espaço vazio: girar, aproximar e arrastar a câmera */
  e.stopPropagation();e.preventDefault();
  const ctl=E.ctx.ctl,ed=E.ctx.editavel!==false,x0=e.clientX,y0=e.clientY;let arrastando=false;
  if(alvo.t)mostraBadge(x0,y0,textoBorne(alvo.t));
  const move=ev=>{if(!alvo.t||!ed)return;if(!arrastando&&Math.hypot(ev.clientX-x0,ev.clientY-y0)<10)return;arrastando=true;
    const sob=alvoEm(ev.clientX,ev.clientY);mostraBadge(ev.clientX,ev.clientY,textoBorne(alvo.t)+' → '+(sob&&sob.t&&sob.t!==alvo.t?textoBorne(sob.t):'…'));
    const q=pontoNoPlano(ev.clientX,ev.clientY);if(!q)return;if(E.fioTmp)tiraMalha(E.fioTmp);E.fioTmp=malhaFio(E.bornes[alvo.t],q,E.ctx.cor||'fase');E.scene.add(E.fioTmp);pede()};
  const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    if(E&&E.fioTmp){tiraMalha(E.fioTmp);E.fioTmp=null;pede()}
    if(E)escondeBadge(arrastando||ev.type==='pointercancel'?0:700);/* toque simples: o nome fica um instante */
    if(ev.type==='pointercancel')return;
    if(arrastando){const fim=alvoEm(ev.clientX,ev.clientY);ctl.arrastouFio(alvo.t,fim&&fim.t||null);return}
    if(alvo.t){if(ed)ctl.tocouBorne(alvo.t)}
    else if(alvo.peca)ctl.acionou(alvo.peca,alvo.lado||0);
    else if(alvo.w!==undefined&&ed)ctl.tirouFio(alvo.w)};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}

/* libera tudo: geometrias da cena, materiais e texturas do cache e o contexto WebGL */
function destruir(){if(!E)return;
  if(E.pedido)cancelAnimationFrame(E.pedido);E.ro.disconnect();E.no.removeEventListener('pointerdown',aoTocar,true);E.controls.dispose();
  E.scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});E.faixa.scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});
  if(CACHE){CACHE.mat.forEach(m=>m.dispose());CACHE.tex.forEach(t=>t.dispose());CACHE.unicos.forEach(m=>{if(m.map)m.map.dispose();m.dispose()});CACHE=null}
  clearTimeout(E.badgeT);E.badge.remove();E.b360.remove();E.dica.remove();
  E.renderer.dispose();try{E.renderer.forceContextLoss()}catch(e){}E.cv.remove();E=null}

/* ---------- inspeção para os testes ---------- */
function naTela(v){const r=areaBancada();E.camera.updateMatrixWorld();const p=v.clone().project(E.camera);return {x:r.left+(p.x+1)/2*r.width,y:r.top+(1-p.y)/2*r.height}}
const debug={
  gl:()=>!!(E&&E.renderer.getContext()),
  contagem:()=>{let n=0;E&&E.scene.traverse(o=>{if(o.isMesh)n++});return n},
  /* materiais distintos usados pelas malhas (o cache faz este número ficar bem abaixo do de malhas) */
  materiais:()=>{const s=new Set();E.scene.traverse(o=>{if(o.isMesh)s.add(o.material)});return s.size},
  bornesTERM3D:c=>bornesDe(c).length,
  contorno:()=>E.contorno,
  corFio:i=>{const f=E.fios.find(m=>m.userData.w===i);return f?f.material.userData.cores:null},
  tela:id=>E.bornes[id]?naTela(E.bornes[id]):naTela(E.pecas[id].corpo[0].getWorldPosition(new THREE.Vector3())),
  telaFio:i=>{const f=E.fios.find(m=>m.userData.w===i),cur=f.geometry.parameters.path;
    for(const u of [.5,.4,.6,.3,.7,.2,.8,.15,.85]){const p=naTela(cur.getPointAt(u)),a=alvoEm(p.x,p.y);if(a&&a.w===i)return p}return naTela(cur.getPointAt(.5))},
  realcados:()=>E.fios.filter(f=>!f.material.transparent).length,
  /* todo trecho reto do fio anda num eixo só (x, y ou z): traçado em ângulo reto, como no diagrama */
  ortogonal:()=>E.fios.every(f=>f.geometry.parameters.path.curves.filter(c=>c.isLineCurve3).every(c=>{const d=c.v2.clone().sub(c.v1);return [d.x,d.y,d.z].filter(v=>Math.abs(v)>1e-6).length<=1})),
  /* pistas: fios diferentes correm em profundidades diferentes (não ficam um sobre o outro) */
  pistas:()=>new Set(E.fios.map(f=>f.geometry.parameters.path.curves.find(c=>c.isLineCurve3&&Math.abs(c.v1.z-c.v2.z)<1e-6&&c.v1.z<2).v1.z.toFixed(2))).size,
  raioFio:()=>E.fios.length?E.fios[0].geometry.parameters.radius:null,
  telaTeste:id=>naTela(E.pecas[id].extra.teste.getWorldPosition(new THREE.Vector3())),
  visorDR:id=>E.pecas[id].extra.visor.material.color.getHex()===PAL.desarmado?'desarmado':'armado',
  emboloAlvo:id=>E.pecas[id].emb||0,
  tecla:id=>E.pecas[id].tec,
  emboloKC:id=>({on:!!E.pecas[id].on,cor:E.pecas[id].extra.embolo.material.color.getHexString()}),
  visorFT:id=>E.pecas[id].extra.visor.material.color.getHex()===PAL.desarmado?'disparado':'armado',
  livre:()=>!!E.livre,
  faixa:()=>({estado:E.faixa.estado,legendas:E.faixa.legendas,altura:E.faixaH,pontos:E.faixa.pontos.filter(p=>p.visible).length,cabos:E.faixa.cabos.length}),
  azimute:()=>[E.controls.minAzimuthAngle,E.controls.maxAzimuthAngle],
  botao360:()=>E.b360,
  badge:()=>({visivel:!E.badge.hidden,texto:E.badge.textContent}),
  plaquetas:pid=>{const o=[];E.pecas[pid].g.traverse(m=>{if(m.userData.plaqueta)o.push({t:m.userData.plaqueta,incl:m.rotation.x,alt:m.geometry.parameters.height})});return o},
  nomeBorne:(pid,k)=>nomeBorne(E.pecas[pid].c,k),
  brilho:id=>E.pecas[id].brilho||0,
  alavanca:id=>E.pecas[id].ang,
  fios:()=>E.fios.length,
  curtoAtivo:()=>performance.now()<E.curtoAte,
  faisca:()=>E.faisca.visible
};

/* registra a vista (só se o aparelho tiver WebGL; sem ele, a bancada segue no SVG) */
const temGL=(()=>{try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}})();
if(temGL)VISTA3D.vista={aceita:st=>VISTA3D.suporta(st),montar,atualizar,destruir,debug};
else VISTA3D.erro='Este aparelho não tem WebGL: a bancada continua em 2D.';
