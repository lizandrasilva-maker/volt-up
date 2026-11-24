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
const LARG_DIN={fuse:DIN.W,dr:2*DIN.W,kc:3*DIN.W,ft:2*DIN.W,ri:2*DIN.W};/* largura de cada peça de trilho: disjuntor 1 módulo, DR e relé térmico 2, contatora 3 */
const RECUO=.7;/* degrau recuado da bobina da contatora (A1/A2) */
const FRENTE=DIN.z0+DIN.D;/* face frontal dos módulos DIN */
const TERM3D={
  /* fonte: índices do motor.js .0 = L1, .1 = N, .2 = L2, .3 = L3; na régua, da esquerda para a direita, L1 L2 L3 N (como no 2D) */
  src:c=>{const n=typeof nFases==='function'?nFases(c):1,ordem=[0,...(n>=2?[2]:[]),...(n>=3?[3]:[]),1],pos=[];
    ordem.forEach((k,i)=>{pos[k]=[(i-(ordem.length-1)/2)*1.25,-3.6,3.3]});return pos},
  fuse:()=>[[0,3.1,DIN.z0+DIN.D+.05],[0,-2.6,DIN.z0+DIN.D+.05]],      /* .0 = entrada (topo), .1 = saída (base) */
  lamp:()=>[[-1.35,-1.35,.7],[1.35,-1.35,.7]],                        /* .0 = X1, .1 = X2 */
  dr:()=>[[-1.2,3.1,FRENTE+.05],[1.2,3.1,FRENTE+.05],[-1.2,-2.6,FRENTE+.05],[1.2,-2.6,FRENTE+.05]], /* .0 = entrada F, .1 = entrada N, .2 = saída F, .3 = saída N */
  btn:()=>[[-.85,-2.55,1.05],[.85,-2.55,1.05]],
  sw:()=>[[-.85,-2.75,1.0],[.85,-2.75,1.0]],
  sw3:()=>[[-1.1,-2.75,1.0],[0,-2.75,1.0],[1.1,-2.75,1.0]],          /* paralelo (three-way): .0 = C (comum), .1 = 1, .2 = 2 */
  sw4:()=>[[-.85,4.15,1.0],[.85,4.15,1.0],[-.85,-2.75,1.0],[.85,-2.75,1.0]], /* intermediário (four-way): .0/.1 = 1-2 em cima, .2/.3 = 3-4 embaixo */
  motor:()=>[[-1,2.75,3.25],[0,2.75,3.25],[1,2.75,3.25]],             /* caixa de ligação: .0 = 1, .1 = 2 (força), .2 = ⏚ (PE da carcaça) */
  bep:()=>[[-1.8,0,.95],[-.6,0,.95],[.6,0,.95],[1.8,0,.95]],          /* barra de cobre: 4 bornes unidos */
  haste:()=>[[0,.45,.85]],
  boia:()=>[[-.85,-4.35,1.0],[.85,-4.35,1.0]],                        /* régua da boia: .0 = 1, .1 = 2 (fecha com a caixa vazia) */                                           /* conector no topo da haste */                           /* .0 = L (entrada da fase), .1 = R (retorno) */                      /* .0/.1 = contato (NA 3-4 na BL, NF 1-2 na BD) */
  /* contatora: .0/.1 = A1/A2 (bobina, no degrau recuado), .2/.3 = 1-2 (potência), .4/.5 = 13-14 (selo) */
  kc:()=>[[-2.4,3.1,FRENTE-RECUO+.05],[-2.4,-2.6,FRENTE-RECUO+.05],[0,3.1,FRENTE+.05],[0,-2.6,FRENTE+.05],[2.4,3.1,FRENTE+.05],[2.4,-2.6,FRENTE+.05]],
  /* relé térmico: .0/.1 = 1-2 (força), .2/.3 = 95-96 (NF de comando) */
  ft:()=>[[-1.2,3.1,FRENTE+.05],[-1.2,-2.6,FRENTE+.05],[1.2,3.1,FRENTE+.05],[1.2,-2.6,FRENTE+.05]],
  /* pilha AA no suporte: régua embaixo, .0 = + (esquerda), .1 = − (direita) */
  pilha:()=>[[-1.2,-2.6,1.0],[1.2,-2.6,1.0]],
  /* fotocélula: régua embaixo, .0 = L (fase), .1 = N, .2 = C (carga) */
  foto:()=>[[-1.1,-3.2,1.0],[0,-3.2,1.0],[1.1,-3.2,1.0]],
  /* relé de impulso: .0/.1 = A1/A2 (bobina, à esquerda), .2/.3 = 1-2 (contato, à direita) */
  ri:()=>[[-1.2,3.1,FRENTE+.05],[-1.2,-2.6,FRENTE+.05],[1.2,3.1,FRENTE+.05],[1.2,-2.6,FRENTE+.05]]
};
const bornesDe=c=>(TERM3D[c.type]?TERM3D[c.type](c):[]).map(p=>new THREE.Vector3(...p));

/* ---------- paleta (skill voltup-3d-anime) ---------- */
const PAL={corpoDIN:0xE6E9EF,frenteDIN:0xD5DAE2,trilho:0x9AA5B4,cavidade:0x1F2933,zinco:0xCBD5E1,fenda:0x3A4048,
  fonte:0x7C8A99,fonteFrente:0x5D6B7A,lcd:0xC6D68A,regua:0x2A2F36,alavanca:0x2F4A6E,pontaAlavanca:0xE24C3F,
  painel:0x1D3550,soquete:0xD9DDE3,base:0xE6E9EF,teste:0xECC94B,armado:0x38A169,desarmado:0xE53E3E,
  botoeiraBase:0x334155,liga:0x2F855A,desliga:0xC53030,janela:0x1F2933,emboloOff:0x94A3B8,emboloOn:0xF97316,rearme:0x3182CE,dial:0x2F4A6E,espelho:0xF1F3F6,tecla:0xE6E9EF,marca:0x2F855A,wago:0xDDE3EA,alavancaWago:0xF28C28,
  motor:0x2B6CB0,motorTampa:0x245A94,eixo:0xCBD5E1,faixaEixo:0xECC94B,cobre:0xC87533,isolador:0x2A2F36,solo:0x6B4A2E,
  ceuDia:0xBFE0F7,ceuNoite:0x1B2740,sol:0xF4C430,lua:0xF2E6A0,estrela:0xFFFFFF,corpoFoto:0x8C96A3,placaFoto:0xD6DBE1,baseFoto:0x59616B,sensor:0xC0392B,
  suportePilha:0x2B3036,pilha:0x3B4252,pilhaQuente:0xC0392B,polo:0xC9A227,
  fioPreto:0x1A1D21,fioBranco:0xEEF1F4,fioVermelho:0xC0392B,riOff:0x94A3B8,riOn:0xF97316,
  caixaAgua:0x1F4F86,tampa:0x2A66A8,agua:0x5AA9E6,aguaCorte:0x8CC8F2,pera:0xEEF3F7,caboBoia:0x1F2328};

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
/* toon de dupla face (peças em corte, como a caixa d'água): mostra o lado de dentro */
function matDupla(cor){const C=cache(),k='toon2:'+cor;if(!C.mat.has(k))C.mat.set(k,new THREE.MeshToonMaterial({color:new THREE.Color(cor),gradientMap:tons(),side:THREE.DoubleSide}));return C.mat.get(k)}
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
function nomeBorne(c,k){if(c.type==='btn'&&c.nf)return ['1','2'][k];const T=typeof REAL_TERMS!=='undefined'&&REAL_TERMS[c.type];if(T&&T[k])return T[k].n||'⏚';return String(k)}
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
  const nf=typeof nFases==='function'?nFases(c):1,nome=rotulo('FONTE '+nf+'F+N',4.6,.8,{cor:'#eef2f7'});nome.position.set(0,.8,2.62);g.add(nome);
  const regua=new THREE.Mesh(new THREE.BoxGeometry(5,1.9,.8),mat(PAL.regua));regua.position.set(0,-3.6,2.8);g.add(regua);
  poeParafusos(g,bornes);
  const cf=coresDoFio('fase')[0],cn=coresDoFio('neutro')[0];
  bornes.map((_,k)=>[k,nomeBorne(c,k),k===1?cn:cf]).forEach(([k,t,cor])=>{const anel=new THREE.Mesh(new THREE.TorusGeometry(.66,.09,8,24),mat(cor));anel.position.copy(bornes[k]).add(new THREE.Vector3(0,0,-.06));g.add(anel);
    plaqueta(g,nomeBorne(c,k),bornes[k].x,-1.95,3.55)});
  return {g,bornes,corpo:[caixa,frente,visor,regua],extra:{led,visor:tx},fases:nf}}
function disjuntor(c){const g=new THREE.Group(),bornes=bornesDe(c),{W,H,D,z0}=DIN;
  const corpo=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),mat(PAL.corpoDIN));corpo.position.z=z0+D/2;g.add(corpo);
  const frente=new THREE.Mesh(new THREE.BoxGeometry(W*.9,H*.46,.7),mat(PAL.frenteDIN));frente.position.set(0,0,z0+D+.35);g.add(frente);
  /* alavanca articulada: sai da frente (eixo +Z) por uma fenda e gira em torno do eixo X no pino:
     inclinada para cima = ligado, para baixo = desligado (c.trip) */
  const fenda=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.3,.06),mat(PAL.cavidade));fenda.position.set(0,.2,z0+D+.72);g.add(fenda);
  const pino=new THREE.Group();pino.position.set(0,.2,z0+D+.7);g.add(pino);
  const alav=new THREE.Mesh(new THREE.BoxGeometry(.95,.75,1.5),mat(PAL.alavanca));alav.position.z=.75;pino.add(alav);
  const ponta=new THREE.Mesh(new THREE.BoxGeometry(.97,.77,.45),mat(PAL.pontaAlavanca));ponta.position.z=1.4;pino.add(ponta);
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
  const fenda=new THREE.Mesh(new THREE.BoxGeometry(2.9,1.3,.06),mat(PAL.cavidade));fenda.position.set(0,.5,FRENTE+.72);g.add(fenda);
  const pino=new THREE.Group();pino.position.set(0,.5,FRENTE+.7);g.add(pino);
  const alavancas=[-.85,.85].map(x=>{const a=new THREE.Mesh(new THREE.BoxGeometry(.85,.75,1.5),mat(PAL.alavanca));a.position.set(x,0,.75);pino.add(a);return a});
  const barra=new THREE.Mesh(new THREE.BoxGeometry(2.6,.77,.45),mat(PAL.pontaAlavanca));barra.position.z=1.4;pino.add(barra);
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
function interruptor(c){const g=new THREE.Group(),bornes=bornesDe(c),fileiras=[...new Set(bornes.map(b=>b.y))];
  const espelho=new THREE.Mesh(new THREE.BoxGeometry(3.4,4.4,.5),mat(PAL.espelho));espelho.position.set(0,.7,.25);g.add(espelho);
  const moldura=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.2,.12),mat(PAL.cavidade));moldura.position.set(0,.7,.52);g.add(moldura);
  const pino=new THREE.Group();pino.position.set(0,.7,TECLA.z);g.add(pino);
  const tecla=new THREE.Mesh(new THREE.BoxGeometry(2.1,2.9,.45),mat(PAL.tecla));tecla.position.z=.2;pino.add(tecla);
  const marca=new THREE.Mesh(new THREE.BoxGeometry(.9,.18,.06),mat(PAL.marca));marca.position.set(0,1.05,.45);pino.add(marca);
  const tipo={sw:'',sw3:' · paralelo',sw4:' · intermed.'}[c.type]||'',topo=Math.max(...fileiras);
  const adesivo=rotulo((c.lab||c.id)+tipo,tipo?3.4:2.2,.8,{fundo:'#2f4a6e',cor:'#f8fafc',esc:.6});adesivo.position.set(0,topo>0?topo+2.35:3.4,.52);g.add(adesivo);
  /* um bloco de bornes por fileira; plaquetas por fora (abaixo da fileira de baixo, acima da de cima) */
  fileiras.forEach(y=>{const n=bornes.filter(b=>b.y===y).length,bl=new THREE.Mesh(new THREE.BoxGeometry(Math.max(3,n*1.1+.8),1.2,.9),mat(PAL.cavidade));bl.position.set(0,y,.45);g.add(bl)});
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,b.y>0?b.y+1.2:b.y-1.2,.55));
  return {g,bornes,corpo:[espelho,moldura,tecla],extra:{pino}}}
/* Motor monofásico: carcaça azul aletada deitada sobre pés, tampas, eixo com faixa amarela que GIRA quando o motor
   está ligado (res.lamp[id], 0 a 1: velocidade proporcional) e caixa de ligação em cima com os bornes 1, 2 e ⏚. */
function motorEl(c){const g=new THREE.Group(),bornes=bornesDe(c),zc=1.9;
  const carc=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.8,4.6,28),mat(PAL.motor));carc.rotation.z=Math.PI/2;carc.position.set(0,0,zc);g.add(carc);
  const aleta=new THREE.BoxGeometry(4.2,.16,.5);for(let i=0;i<10;i++){const a=i/10*Math.PI*2,m=new THREE.Mesh(aleta,mat(PAL.motorTampa));m.position.set(0,Math.cos(a)*1.85,zc+Math.sin(a)*1.85);m.rotation.x=-a;g.add(m)}
  [-2.45,2.45].forEach(x=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.75,.35,28),mat(PAL.motorTampa));t.rotation.z=Math.PI/2;t.position.set(x,0,zc);g.add(t)});
  const grade=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.1,24),mat(PAL.cavidade));grade.rotation.z=Math.PI/2;grade.position.set(-2.66,0,zc);g.add(grade);
  /* eixo: gira em torno de X; a faixa amarela deixa a rotação visível */
  const eixo=new THREE.Group();eixo.position.set(3,0,zc);g.add(eixo);
  const haste=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,1.4,16),mat(PAL.eixo));haste.rotation.z=Math.PI/2;haste.position.x=.7;eixo.add(haste);
  const faixa=new THREE.Mesh(new THREE.BoxGeometry(1.2,.12,.7),mat(PAL.faixaEixo));faixa.position.x=.75;eixo.add(faixa);
  [-1.6,1.6].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(1.1,.5,3),mat(PAL.motorTampa));p.position.set(x,-2,zc);g.add(p)});/* pés */
  const caixa=new THREE.Mesh(new THREE.BoxGeometry(3.4,1.3,2.6),mat(PAL.motorTampa));caixa.position.set(0,2.4,zc);g.add(caixa);
  const placa=rotulo((c.lab||c.id)+' · 1~',2.6,.7,{fundo:'#f8fafc',cor:'#070c16',esc:.6});placa.position.set(0,.2,zc+1.85);g.add(placa);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,b.y+1.15,b.z+.2));
  return {g,bornes,corpo:[carc,caixa],extra:{eixo}}}
/* BEP: barra de cobre sobre dois isoladores, 4 parafusos (todos o mesmo ponto: equipotencialização) */
function bep(c){const g=new THREE.Group(),bornes=bornesDe(c);
  [-2.1,2.1].forEach(x=>{const i=new THREE.Mesh(new THREE.CylinderGeometry(.3,.35,.6,14),mat(PAL.isolador));i.rotation.x=Math.PI/2;i.position.set(x,0,.3);g.add(i)});
  const barra=new THREE.Mesh(new THREE.BoxGeometry(5,.9,.35),mat(PAL.cobre));barra.position.set(0,0,.75);g.add(barra);
  const lab=rotulo('BEP ⏚',2.4,.75,{fundo:'#f8fafc',cor:'#070c16',esc:.6});lab.position.set(0,1.15,.62);g.add(lab);
  poeParafusos(g,bornes);
  return {g,bornes,corpo:[barra],extra:{}}}
/* Haste de aterramento cravada no solo, com o conector no topo (de onde sai o condutor até o BEP) */
function haste(c){const g=new THREE.Group(),bornes=bornesDe(c);
  const solo=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.2,1.6),mat(PAL.solo));solo.position.set(0,-3.6,.8);g.add(solo);
  const vara=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,5,14),mat(PAL.cobre));vara.position.set(0,-2,.85);g.add(vara);
  const conector=new THREE.Mesh(new THREE.BoxGeometry(.9,.8,.6),mat(PAL.zinco));conector.position.set(0,.3,.85);g.add(conector);
  const lab=rotulo((c.lab||c.id)+' · haste',2.4,.7,{fundo:'#f8fafc',cor:'#070c16',esc:.6});lab.position.set(1.9,-1,.62);g.add(lab);
  poeParafusos(g,bornes);
  return {g,bornes,corpo:[vara,conector,solo],extra:{}}}
/* Boia de nível na caixa d'água em corte: meia carcaça (vista por dentro), seção da água cujo nível sobe e desce,
   e a pera pendurada pelo cabo. Vazia (c.vazia): a pera tomba para baixo e o contato 1-2 fecha (a bomba liga);
   cheia: a pera flutua e o contato abre. O toque relata acionou(id): em acionarPeca isso enche ou esvazia a caixa. */
const CAIXA={fundo:-2.1,topo:3.7,raio:2.2,cheia:4.6,vazia:.9};
function boiaEl(c){const g=new THREE.Group(),bornes=bornesDe(c),{fundo,topo,raio}=CAIXA,h=topo-fundo,yc=(topo+fundo)/2;
  const casca=new THREE.Mesh(new THREE.CylinderGeometry(raio+.15,raio-.15,h,32,1,true,Math.PI/2,Math.PI),matDupla(PAL.caixaAgua));casca.position.set(0,yc,.6);g.add(casca);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(raio-.15,raio-.15,.25,32,1,false,Math.PI/2,Math.PI),mat(PAL.caixaAgua));base.position.set(0,fundo+.12,.6);g.add(base);
  const tampa=new THREE.Mesh(new THREE.CylinderGeometry(raio+.35,raio+.25,.4,32),mat(PAL.tampa));tampa.position.set(0,topo+.2,.6);g.add(tampa);
  /* água: seção (face do corte) + volume atrás; a altura muda com o nível */
  const agua=new THREE.Group();agua.position.set(0,fundo+.25,.6);g.add(agua);
  const vol=new THREE.Mesh(new THREE.CylinderGeometry(raio-.2,raio-.25,1,32,1,false,Math.PI/2,Math.PI),mat(PAL.agua));vol.position.y=.5;agua.add(vol);
  const corte=new THREE.Mesh(new THREE.BoxGeometry(2*(raio-.22),1,.06),mat(PAL.aguaCorte));corte.position.set(0,.5,.02);agua.add(corte);
  /* pera e o cabo que desce da tampa */
  const pera=new THREE.Group();g.add(pera);
  const corpo=new THREE.Mesh(new THREE.SphereGeometry(.55,18,14),mat(PAL.pera));corpo.scale.set(1,1.55,1);corpo.position.y=-.75;pera.add(corpo);
  const cabo=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1,8),mat(PAL.caboBoia));g.add(cabo);
  const fora=new THREE.Mesh(new THREE.TubeGeometry(caminho([new THREE.Vector3(.9,topo+.4,.6),new THREE.Vector3(.9,topo+1,.6),new THREE.Vector3(raio+.9,topo+1,.6),new THREE.Vector3(raio+.9,-3.6,.6),new THREE.Vector3(.85,-3.6,.6)]),40,.09,6,false),mat(PAL.caboBoia));g.add(fora);
  const bloco=new THREE.Mesh(new THREE.BoxGeometry(3,1.2,.9),mat(PAL.cavidade));bloco.position.set(0,-4.35,.45);g.add(bloco);
  const adesivo=rotulo((c.lab||c.id)+' · boia',2.6,.75,{fundo:'#2f4a6e',cor:'#f8fafc',esc:.6});adesivo.position.set(0,topo+1.05,.62);g.add(adesivo);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,-5.55,.55));
  return {g,bornes,corpo:[casca,tampa,vol,corte,corpo],extra:{agua,pera,cabo}}}
/* põe o nível da água e a pera (k de 0 a 1 entre o estado anterior e o novo) */
function poeNivel(p,nivel,inclina){const e=p.extra,{fundo,topo}=CAIXA;e.agua.scale.y=nivel;
  const yPera=Math.max(fundo+1.5,fundo+.25+nivel-.1),ponto=new THREE.Vector3(.9,topo-.1,.6),fim=new THREE.Vector3(.9,yPera,.9);
  e.pera.position.copy(fim);e.pera.rotation.z=inclina;
  const dir=fim.clone().sub(ponto),comp=dir.length();e.cabo.scale.y=comp;e.cabo.position.copy(ponto).addScaledVector(dir,.5);e.cabo.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize())}
/* Pilha AA (1,5 V) deitada no suporte preto, com o polo + (faixa dourada e o "botão") à esquerda, sobre o borne +.
   Embaixo, a régua com os bornes + e −. Em curto (corrente acima de CC.I_CURTO, do simulador CC em ctx.res.cc)
   o corpo fica vermelho e sobe um brilho de calor. Não é acionada à mão. */
function pilhaEl(c){const g=new THREE.Group(),bornes=bornesDe(c);
  const suporte=new THREE.Mesh(new THREE.BoxGeometry(5.2,3.8,.8),mat(PAL.suportePilha));suporte.position.set(0,.5,.4);g.add(suporte);
  [-2.15,2.15].forEach(x=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.4,2,.5),mat(PAL.zinco));m.position.set(x,.6,1);g.add(m)});
  const celula=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,3.4,24),mat(PAL.pilha));celula.rotation.z=Math.PI/2;celula.position.set(.2,.6,1.6);g.add(celula);
  const polo=new THREE.Mesh(new THREE.CylinderGeometry(.92,.92,.95,24),mat(PAL.polo));polo.rotation.z=Math.PI/2;polo.position.set(-1.05,.6,1.6);g.add(polo);
  const botao=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.3,16),mat(PAL.zinco));botao.rotation.z=Math.PI/2;botao.position.set(-1.65,.6,1.6);g.add(botao);
  const mais=rotulo('+',.6,.6,{cor:'#1c1f24'});mais.position.set(-1.05,.6,2.53);g.add(mais);
  const tensao=rotulo((typeof ccN==='function'?ccN(c.V||1.5):String(c.V||1.5))+'V',1.5,.55,{cor:'#eef2f7'});tensao.position.set(.75,.6,2.51);g.add(tensao);
  const adesivo=rotulo((c.lab||c.id)+' · pilha',2.8,.7,{fundo:'#2f4a6e',cor:'#f8fafc',esc:.6});adesivo.position.set(0,2.95,.82);g.add(adesivo);
  const calor=sprite(texturaBrilho('calor',['rgba(255,150,70,.95)','rgba(255,60,30,0)']),4);calor.position.set(.2,1.9,1.8);calor.visible=false;g.add(calor);
  const regua=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.2,.9),mat(PAL.cavidade));regua.position.set(0,-2.6,.45);g.add(regua);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,-3.8,.55));
  return {g,bornes,corpo:[suporte,celula,polo,regua],extra:{celula,calor}}}
/* Fotocélula (relé fotoelétrico): corpo cinza com cúpula e a janela do sensor, preso numa placa; os 3 fios
   (preto = L, branco = N, vermelho = C) descem até a régua. O céu atrás mostra se é dia (sol) ou noite (lua e
   estrelas). O toque relata acionou(id): em acionarPeca isso troca dia e noite (c.noite). */
const SENSOR={dia:0xE8F2FA,noite:0x3A4A66};
function fotocelula(c){const g=new THREE.Group(),bornes=bornesDe(c),V=THREE.Vector3;
  const ceu=new THREE.Mesh(new THREE.BoxGeometry(5.2,3.6,.2),mat(PAL.ceuDia));ceu.position.set(0,1.5,.1);g.add(ceu);
  const sol=new THREE.Mesh(new THREE.SphereGeometry(.5,16,12),mat(PAL.sol));sol.position.set(1.75,2.55,.45);g.add(sol);
  const lua=new THREE.Group();lua.position.set(1.75,2.55,.45);g.add(lua);
  lua.add(new THREE.Mesh(new THREE.SphereGeometry(.45,16,12),mat(PAL.lua)));
  const sombra=new THREE.Mesh(new THREE.SphereGeometry(.4,16,12),mat(PAL.ceuNoite));sombra.position.set(.24,.16,.12);lua.add(sombra);/* lua crescente */
  const estrelas=new THREE.Group();g.add(estrelas);
  [[-1.9,2.2],[-1.25,1.55],[-2.1,.75],[1.0,1.35]].forEach(([x,y])=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.08,8,6),mat(PAL.estrela));e.position.set(x,y,.3);estrelas.add(e)});
  const txt=rotuloVivo(1.9,.6,{cor:'#1d4a7a'});txt.position.set(-1.35,2.95,.22);g.add(txt);
  const placa=new THREE.Mesh(new THREE.BoxGeometry(5.2,1.7,.3),mat(PAL.placaFoto));placa.position.set(0,-1.05,.15);g.add(placa);
  const base=new THREE.Mesh(new THREE.BoxGeometry(2.8,.45,.7),mat(PAL.baseFoto));base.position.set(0,-.2,.6);g.add(base);
  const corpo=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,1.8,24),mat(PAL.corpoFoto));corpo.position.set(0,.85,1.2);g.add(corpo);
  const cupula=new THREE.Mesh(new THREE.SphereGeometry(1.1,24,12,0,Math.PI*2,0,Math.PI/2),mat(PAL.corpoFoto));cupula.position.set(0,1.75,1.2);g.add(cupula);
  const janela=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.2,20),matUnico(SENSOR.dia));janela.rotation.x=Math.PI/2;janela.position.set(0,1.7,2.25);g.add(janela);
  const chip=new THREE.Mesh(new THREE.BoxGeometry(.5,.34,.08),mat(PAL.sensor));chip.position.set(0,1.7,2.38);g.add(chip);
  const tensao=rotulo((typeof rede==='function'?rede().V:220)+'V~',1.4,.5,{cor:'#eef2f7'});tensao.position.set(0,.55,2.32);g.add(tensao);
  const adesivo=rotulo((c.lab||c.id)+' · fotocélula',4,.75,{fundo:'#2f4a6e',cor:'#f8fafc',esc:.6});adesivo.position.set(0,3.75,.3);g.add(adesivo);
  /* fios de saída até a régua */
  [[-.4,PAL.fioPreto],[0,PAL.fioBranco],[.4,PAL.fioVermelho]].forEach(([x,cor],k)=>{const b=bornes[k];
    const f=new THREE.Mesh(new THREE.TubeGeometry(caminho([new V(x,0,1.2),new V(x,-1.5,1.2),new V(b.x,-1.5,1.2),new V(b.x,-2.55,1.2)]),40,.1,6,false),mat(cor));g.add(f)});
  const regua=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.2,.9),mat(PAL.cavidade));regua.position.set(0,-3.2,.45);g.add(regua);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),b.x,-4.4,.55));
  return {g,bornes,corpo:[ceu,placa,corpo,cupula,janela],extra:{ceu,sol,lua,estrelas,janela,txt}}}
/* Relé de impulso (telerruptor, 2 módulos): à esquerda a bobina A1/A2 e a alavanca de comando manual, que sobe
   quando o contato 1-2 está fechado; visor laranja com o contato fechado. Não é acionado à mão no jogo: cada pulso
   na bobina inverte c.on (calculado pelo solver), e a peça só mostra o estado. */
function releImpulso(c){const g=new THREE.Group(),bornes=bornesDe(c),{H,D,z0}=DIN,W=LARG_DIN.ri;
  const corpo=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),mat(PAL.corpoDIN));corpo.position.z=z0+D/2;g.add(corpo);
  const frente=new THREE.Mesh(new THREE.BoxGeometry(W*.9,H*.46,.5),mat(PAL.frenteDIN));frente.position.set(0,.2,FRENTE+.25);g.add(frente);
  const fenda=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.3,.06),mat(PAL.cavidade));fenda.position.set(-1.1,.1,FRENTE+.52);g.add(fenda);
  const pino=new THREE.Group();pino.position.set(-1.1,.1,FRENTE+.5);g.add(pino);
  const alav=new THREE.Mesh(new THREE.BoxGeometry(.9,.75,1.4),mat(PAL.alavanca));alav.position.z=.7;pino.add(alav);
  const ponta=new THREE.Mesh(new THREE.BoxGeometry(.92,.77,.45),mat(PAL.teste));ponta.position.z=1.3;pino.add(ponta);
  const nome=rotulo('RI',1.2,.7,{cor:'#2f4a6e'});nome.position.set(1.1,1.45,FRENTE+.51);g.add(nome);
  const bob=rotulo((typeof rede==='function'?rede().V:220)+' V~',1.9,.55,{fundo:'#2f4a6e',cor:'#f8fafc',esc:.62});bob.position.set(1.1,.6,FRENTE+.51);g.add(bob);
  const visor=new THREE.Mesh(new THREE.BoxGeometry(1.4,.55,.12),matUnico(PAL.riOff,{emissive:0x000000}));visor.position.set(1.1,-.3,FRENTE+.52);g.add(visor);
  const lab=rotulo((c.lab||c.id)+' · impulso',3.6,.7,{cor:'#2f4a6e'});lab.position.set(0,-1.3,FRENTE+.51);g.add(lab);
  poeParafusos(g,bornes);
  bornes.forEach((b,k)=>plaqueta(g,nomeBorne(c,k),Math.sign(b.x)*(W/2+.7),b.y,b.z+.3));
  return {g,bornes,corpo:[corpo,frente,alav,ponta,visor],extra:{pino,visor}}}
const CONSTRUTOR={src:fonte,fuse:disjuntor,lamp:lampada,dr,btn:botoeira,kc:contatora,ft:reletermico,sw:interruptor,sw3:interruptor,sw4:interruptor,motor:motorEl,bep,haste,boia:boiaEl,foto:fotocelula,ri:releImpulso,pilha:pilhaEl};

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
  E.faixaH=0;E.plano=!!ctx.plano;configuraModo();
  E.badge=document.createElement('div');E.badge.className='badge-borne';E.badge.hidden=true;E.badge.setAttribute('aria-live','polite');no.appendChild(E.badge);
  construir(ctx.st);
  /* caixa que envolve as peças desta bancada: a câmera enquadra o que existe (cada fase tem um arranjo) */
  E.caixa=new THREE.Box3();Object.values(E.pecas).forEach(p=>E.caixa.expandByObject(p.g));
  limites(controls);controls.update();
  /* o zoom é nosso (zoomNoPonto): o OrbitControls aproxima sempre o centro; aqui o ponto entre os dedos fica parado */
  controls.enableZoom=false;
  controls.addEventListener('change',pede);
  /* modo 360°: solta a câmera para dar a volta na instalação; enquanto ativo, nada na bancada muda */

  E.ponteiros=new Map();E.pinca=null;
  no.addEventListener('pointerdown',rastreia,true);/* antes de aoTocar: conta os dedos na tela */
  no.addEventListener('pointerdown',aoTocar,true);/* captura: decide antes do OrbitControls */
  window.addEventListener('pointermove',moveDedos);window.addEventListener('pointerup',soltaDedo);window.addEventListener('pointercancel',soltaDedo);
  cv.addEventListener('wheel',rodaMouse,{passive:false});
  E.ro=new ResizeObserver(()=>{if(dimensiona())pede()});E.ro.observe(no);
}
function construir(st){
  /* um trilho para cada linha de peças DIN (mesmo y), cobrindo a largura de todas */
  const linhas={};st.comps.filter(c=>LARG_DIN[c.type]).forEach(c=>{const y=pos2d(c).y;(linhas[y]=linhas[y]||[]).push(c)});
  Object.entries(linhas).forEach(([y,cs])=>{const x0=Math.min(...cs.map(c=>pos2d(c).x-LARG_DIN[c.type]/2)),x1=Math.max(...cs.map(c=>pos2d(c).x+LARG_DIN[c.type]/2));E.scene.add(trilho(x0-1.5,x1+1.5,+y))});
  /* esfera de toque compartilhada (invisível, maior que o parafuso) */
  const toque=semContorno(new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}));cache().unicos.push(toque);E.matToque=toque;const geoToque=new THREE.SphereGeometry(1.2,10,8);
  E.geoToque=geoToque;st.comps.forEach(constroiPeca);
}
function constroiPeca(c){const f=CONSTRUTOR[c.type];if(!f)return;
  const p=f(c);p.g.position.copy(pos2d(c));E.scene.add(p.g);p.g.updateMatrixWorld(true);E.pecas[c.id]={c,...p,toques:[],ang:c.trip?.5:-.5,caixa:new THREE.Box3().setFromObject(p.g)};
  p.corpo.forEach(m=>{m.userData.peca=c.id;E.hits.push(m)});
  p.bornes.forEach((v,k)=>{const id=c.id+'.'+k,w=p.g.localToWorld(v.clone());E.bornes[id]=w;
    const h=new THREE.Mesh(E.geoToque,E.matToque);h.position.copy(w);h.userData.t=id;E.scene.add(h);E.hits.push(h);E.pecas[c.id].toques.push(h)})}
/* refaz uma peça (ex.: a fonte que passou de 1 para 3 fases): tira a antiga, monta a nova e redesenha os fios */
function refazPeca(c){const p=E.pecas[c.id];if(!p)return;E.scene.remove(p.g);p.g.traverse(o=>{if(o.geometry)o.geometry.dispose()});
  E.hits=E.hits.filter(h=>h.userData.peca!==c.id&&!(h.userData.t&&h.userData.t.split('.')[0]===c.id));(p.toques||[]).forEach(h=>E.scene.remove(h));
  Object.keys(E.bornes).forEach(k=>{if(k.split('.')[0]===c.id)delete E.bornes[k]});delete E.pecas[c.id];constroiPeca(c);E.assinaturaFios=''}
/* tamanho do canvas acompanha a largura da bancada; o espaço que era da faixa do poste agora é da montagem */
function dimensiona(){const w=Math.max(260,Math.round(E.no.clientWidth||E.no.parentElement&&E.no.parentElement.clientWidth||340)),h=Math.round(Math.min(w*1.05,600));
  if(w===E.tamanho[0]&&h===E.tamanho[1])return false;E.tamanho=[w,h];E.renderer.setSize(w,h);
  E.camera.aspect=w/h;E.camera.updateProjectionMatrix();enquadra();
  return true}
/* 2D: a mesma cena e as mesmas peças, vistas de frente e paradas (não gira; arrastar move a vista, pinça aproxima).
   3D: câmera livre. A troca não remonta a cena: só muda a câmera e os gestos. */
function configuraModo(){const c=E.controls,p=!!E.plano;c.enableRotate=!p;c.touches.ONE=p?THREE.TOUCH.PAN:THREE.TOUCH.ROTATE;c.mouseButtons.LEFT=p?THREE.MOUSE.PAN:THREE.MOUSE.ROTATE;
  E.camera.fov=p?20:34;E.camera.updateProjectionMatrix()}
/* põe a câmera em 3/4 frontal-superior, longe o bastante para caber todas as peças com folga (reenquadra quando o tamanho muda) */
/* câmera sempre livre (360°): arrastar no espaço vazio dá a volta na instalação; tocar em borne, peça ou fio continua
   montando (o toque sem movimento vai para o ctl, o arraste no vazio vai para a câmera). Sem botão de modo. */
function limites(c){c.minAzimuthAngle=-Infinity;c.maxAzimuthAngle=Infinity;c.minPolarAngle=.08;c.maxPolarAngle=Math.PI-.08}
function enquadra(){if(!E.caixa||E.caixa.isEmpty())return;const tam=E.caixa.getSize(new THREE.Vector3()),c=E.caixa.getCenter(new THREE.Vector3());
  const meia=Math.tan(E.camera.fov*Math.PI/360),d=Math.max(tam.y*1.25,tam.x*1.15/E.camera.aspect)/2/meia+tam.z;
  E.camera.position.copy(c).addScaledVector(E.plano?new THREE.Vector3(0,0,1):new THREE.Vector3(.13,.2,1).normalize(),d);E.controls.target.copy(c);
  E.dist=d;E.controls.minDistance=d*.18;E.controls.maxDistance=d*2.2;E.controls.update()}

/* ---------- desenho sob demanda: só há laço enquanto alguma animação está rodando ---------- */
function pede(){if(E&&!E.pedido)E.pedido=requestAnimationFrame(quadro)}
function quadro(){if(!E)return;E.pedido=0;const agora=performance.now();
  E.anim=E.anim.filter(a=>{const k=Math.min(1,(agora-a.t0)/a.dur);a.passo(k,agora);return k<1});
  E.efeito.render(E.scene,E.camera);
  let rodando=false;if(!reduz())Object.values(E.pecas).forEach(p=>{if(p.c.type==='motor'&&p.gira>.04){p.extra.eixo.rotation.x+=.35*p.gira;rodando=true}});
  if(E.anim.length||rodando)pede()}
const anima=(dur,passo)=>{if(reduz()){passo(1,performance.now());return}E.anim.push({t0:performance.now(),dur,passo});pede()};

/* ---------- fios ----------
   Organizados como num diagrama: finos, em ângulo reto com cantos arredondados, cada um na sua pista.
   O fio sai do borne para a frente, corre pela face da peça até a borda (por cima ou por baixo, conforme o lado do
   borne), mergulha até perto da chapa e segue numa pista própria (altura e profundidade diferentes para cada fio),
   para fios paralelos não se sobreporem. Um tubo invisível mais grosso em volta mantém o toque fácil. */
const FIO={raio:.13,toque:.5,canto:.45,frente:.45,margem:.35,pista:.3,prof:.09,z0:.85,pistas:7};
/* ---------- pontos de conexão (dica da montagem) ----------
   Anel em volta de cada parafuso que o circuito usa: azul-claro enquanto faltam condutores, verde quando tem o número
   certo, laranja quando tem fio a mais. Nos níveis leve e moderado, um contador "ligados/esperados" ao lado. */
const DICA={falta:0x5CE1E6,ok:0x43B05C,sobra:0xFF6B3D};
function matDica(est){const C=cache(),k='dica:'+est;if(!C.mat.has(k))C.mat.set(k,semContorno(new THREE.MeshBasicMaterial({color:DICA[est]})));return C.mat.get(k)}
function poeDicas(ctx){(E.dicas||[]).forEach(m=>{E.scene.remove(m);if(m.userData.propria)m.geometry.dispose()});E.dicas=[];E.estadoDicas={};
  const esp=ctx.pontos;if(!esp||ctx.editavel===false)return;
  if(!E.geoDica)E.geoDica=new THREE.TorusGeometry(.8,.11,8,28);
  const n={};ctx.st.wires.forEach(w=>[w.a,w.b].forEach(t=>{n[t]=(n[t]||0)+1}));
  Object.entries(esp).forEach(([t,q])=>{const B=E.bornes[t];if(!B)return;const k=n[t]||0,est=k<q?'falta':k===q?'ok':'sobra';
    const anel=new THREE.Mesh(E.geoDica,matDica(est));anel.position.copy(B).add(new THREE.Vector3(0,0,.12));E.scene.add(anel);E.dicas.push(anel);
    let txt='';
    if(ctx.dica==='conta'){txt=k+'/'+q;
      /* contador para dentro da peça (as plaquetas com o nome ficam por fora) */
      const dir=saida(t).dir,r=rotulo(txt,1.35,.72,{fundo:'#'+new THREE.Color(DICA[est]).getHexString(),cor:'#0b1220',esc:.72});
      r.position.copy(B).add(new THREE.Vector3(1.05,-dir*1.0,.8));r.userData.propria=true;r.renderOrder=2;E.scene.add(r);E.dicas.push(r)}
    E.estadoDicas[t]=est+(txt?' '+txt:'')})}
function saida(id){const T=E.bornes[id],p=E.pecas[id.split('.')[0]],cx=p.caixa,c=cx.getCenter(new THREE.Vector3()),dir=T.y>=c.y?1:-1;
  return {T,dir,borda:dir>0?cx.max.y+FIO.margem:cx.min.y-FIO.margem}}
/* polilinha com cantos arredondados (curva quadrática em cada canto) */
function caminho(pts){const P=pts.filter((p,i)=>i===0||p.distanceTo(pts[i-1])>1e-3),cp=new THREE.CurvePath();let atual=P[0].clone();
  for(let i=1;i<P.length-1;i++){const a=P[i-1],p=P[i],b=P[i+1],li=p.distanceTo(a),lo=b.distanceTo(p),r=Math.min(FIO.canto,li/2,lo/2);
    const ent=p.clone().addScaledVector(p.clone().sub(a).normalize(),-r),sai=p.clone().addScaledVector(b.clone().sub(p).normalize(),r);
    if(atual.distanceTo(ent)>1e-3)cp.add(new THREE.LineCurve3(atual,ent));cp.add(new THREE.QuadraticBezierCurve3(ent,p.clone(),sai));atual=sai}
  cp.add(new THREE.LineCurve3(atual,P[P.length-1].clone()));return cp}
/* Caminho do fio sem passar por trás de nenhuma peça (caixas de todas as peças da bancada):
   - os dois bornes saem para o mesmo lado: o corredor horizontal fica além das DUAS peças e, se cruzar outra peça,
     vai se afastando até achar uma altura livre;
   - saem para lados opostos: cada ponta usa o seu corredor, e os dois se ligam por uma coluna vertical livre ao lado
     das peças (à esquerda ou à direita do destino ou da origem).
   Fios diferentes ficam em pistas diferentes (altura e profundidade). */
const caixas=()=>Object.values(E.pecas).map(p=>p.caixa);
function livreH(y,x0,x1,cxs){const a=Math.min(x0,x1),b=Math.max(x0,x1);return cxs.every(c=>!(y>c.min.y-.1&&y<c.max.y+.1&&b>c.min.x&&a<c.max.x))}
function livreV(x,y0,y1,cxs){const a=Math.min(y0,y1),b=Math.max(y0,y1);return cxs.every(c=>!(x>c.min.x-.1&&x<c.max.x+.1&&b>c.min.y&&a<c.max.y))}
/* Busca, para cada fio, o caminho mais curto do tipo: sai da origem até um corredor perto dela (altura yA), anda até
   uma coluna (xr), sobe ou desce até um corredor perto do destino (yB) e chega ao destino. Testa algumas alturas de
   corredor em cada ponta e colunas nas bordas das peças; fica com a mais curta em que nenhum trecho passa por uma peça.
   Se nada servir (bancada muito cheia), usa o caminho simples. */
function rota(w,i){const a=saida(w.a),b=saida(w.b),A=a.T,B=b.T,V=THREE.Vector3,pista=i%FIO.pistas,folga=.45+pista*FIO.pista;
  const zL=FIO.z0+pista*FIO.prof,zA=A.z+FIO.frente,zB=B.z+FIO.frente,cxs=caixas(),off=.7+pista*.25;
  /* alturas de corredor: começam coladas na peça; o afastamento da pista (folga) é só preferência, para os fios
     paralelos se separarem quando há espaço, sem bloquear o caminho quando a bancada está apertada */
  const ys=p=>Array.from({length:42},(_,k)=>({y:p.borda+p.dir*(.35+k*.3),pref:Math.abs(.35+k*.3-folga)}));
  const yAs=ys(a),yBs=ys(b);
  const xs=[A.x,B.x,(A.x+B.x)/2];cxs.forEach(c=>xs.push(c.min.x-off,c.max.x+off));
  let melhor=null,custo=Infinity;
  for(const {y:yA,pref:pa} of yAs){if(!livreV(A.x,a.borda,yA,cxs))break;
    for(const {y:yB,pref:pb} of yBs){if(!livreV(B.x,b.borda,yB,cxs))break;
      for(const xr of xs){const c=Math.abs(yA-a.borda)+Math.abs(xr-A.x)+Math.abs(yA-yB)+Math.abs(B.x-xr)+Math.abs(yB-b.borda)+.8*(pa+pb);
        if(c>=custo)continue;
        if(livreH(yA,A.x,xr,cxs)&&livreV(xr,yA,yB,cxs)&&livreH(yB,xr,B.x,cxs)){custo=c;melhor=[yA,xr,yB]}}}}
  rota.ultima={melhor,borda:[a.borda,b.borda],A:[A.x,A.y],B:[B.x,B.y],yAs,yBs,caixas:cxs.map(c=>[c.min.x,c.min.y,c.max.x,c.max.y].map(v=>+v.toFixed(2)))};
  const pts=[A,new V(A.x,A.y,zA),new V(A.x,a.borda,zA),new V(A.x,a.borda,zL)];
  if(melhor){const[yA,xr,yB]=melhor;pts.push(new V(A.x,yA,zL),new V(xr,yA,zL),new V(xr,yB,zL),new V(B.x,yB,zL))}
  else{const y=a.dir===b.dir?(a.dir<0?Math.min(a.borda,b.borda):Math.max(a.borda,b.borda))+a.dir*folga:a.borda+a.dir*folga;pts.push(new V(A.x,y,zL),new V(B.x,y,zL))}
  pts.push(new V(B.x,b.borda,zL),new V(B.x,b.borda,zB),new V(B.x,B.y,zB),B);
  return caminho(pts)}
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
    const geo=tubo(cur,FIO.raio,8);listras(geo,cur.getLength());const m=new THREE.Mesh(geo,matFio(cor));m.userData={w:i,cor,a:w.a,rota:rota.ultima};
    const h=new THREE.Mesh(tubo(cur,FIO.toque,6),E.matToque);h.userData.w=i;m.userData.toque=h;
    E.scene.add(m,h);E.fios.push(m);E.hits.push(h)});
  poeWagos(st);
}
/* Emenda com conector Wago: quando 2 ou mais fios chegam ao mesmo borne, eles se juntam num conector de alavancas
   (uma alavanca laranja por fio, mais uma para o fio que segue até o borne), no ponto em que os caminhos se separam. */
function poeWagos(st){(E.wagos||[]).forEach(w=>{E.scene.remove(w);w.traverse(o=>{if(o.geometry)o.geometry.dispose()})});E.wagos=[];
  const conta={};st.wires.forEach(w=>[w.a,w.b].forEach(t=>{if(E.bornes[t])conta[t]=(conta[t]||0)+1}));
  Object.entries(conta).filter(([,n])=>n>=2).forEach(([t,n])=>{const s=saida(t),T=s.T,vias=n+1,g=new THREE.Group();
    const corpo=new THREE.Mesh(new THREE.BoxGeometry(.55*vias+.2,.75,.85),mat(PAL.wago));g.add(corpo);
    for(let i=0;i<vias;i++){const al=new THREE.Mesh(new THREE.BoxGeometry(.38,.3,.62),mat(PAL.alavancaWago));al.position.set((i-(vias-1)/2)*.55,.5,0);g.add(al)}
    g.position.set(T.x,s.borda,T.z+FIO.frente);g.userData={wago:t,vias};E.scene.add(g);E.wagos.push(g)})}
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
  if(E.plano!==!!ctx.plano){E.plano=!!ctx.plano;configuraModo();enquadra()}/* troca 2D ↔ 3D sem remontar */E.cv.style.cursor=ctx.girar?'grab':'';E.no.classList.toggle('girando',!!ctx.girar);
  /* fonte que mudou de número de fases: refaz a peça antes de atualizar o estado */
  st.comps.forEach(c=>{const p=E.pecas[c.id];if(p&&c.type==='src'&&p.fases!==nFases(c))refazPeca(c)});
  st.comps.forEach(c=>{const p=E.pecas[c.id];if(!p)return;
    /* disjuntor e DR: a alavanca (no DR, as duas acopladas) cai quando c.trip */
    if(c.type==='fuse'||c.type==='dr'){const alvo=c.trip?.5:-.5;if(p.ang!==alvo){const de=p.extra.pino.rotation.x;p.ang=alvo;anima(180,k=>{p.extra.pino.rotation.x=de+(alvo-de)*k})}else p.extra.pino.rotation.x=alvo}
    /* botoeira: o êmbolo afunda enquanto c.pressed (estado do acionarPeca) e volta quando ele cai */
    /* contatora: o êmbolo recua e fica laranja enquanto a bobina está energizada (c.on, calculado pelo solver) */
    if(c.type==='kc'){const on=!!c.on;if(p.on!==on){p.on=on;const e=p.extra.embolo,de=e.position.z,para=EMBOLO.z+(on?EMBOLO.recuo:0);e.material=mat(on?PAL.emboloOn:PAL.emboloOff);anima(120,k=>{e.position.z=de+(para-de)*k})}}
    /* relé térmico: visor vermelho e botão de rearme saltado quando disparado (c.trip) */
    if(c.type==='ft'){p.extra.visor.material.color.setHex(c.trip?PAL.desarmado:PAL.armado);p.extra.visor.material.emissive.setHex(c.trip?0x6b1a12:0x0f4a24);p.extra.rearme.position.z=FRENTE+(c.trip?1.05:.75)}
    /* interruptor: a tecla inclina para ligado ou desligado (c.closed) */
    /* motor: gira enquanto alimentado (res.lamp[id] de 0 a 1 vira a velocidade do eixo) */
    /* boia: caixa vazia (contato fechado) ou cheia (aberto); a água sobe ou desce e a pera tomba ou flutua */
    if(c.type==='boia'){const alvo=c.vazia?CAIXA.vazia:CAIXA.cheia,inc=c.vazia?.55:-.6;if(p.nivel===undefined){p.nivel=alvo;p.inc=inc;poeNivel(p,alvo,inc)}
      else if(p.nivel!==alvo){const n0=p.nivel,i0=p.inc;p.nivel=alvo;p.inc=inc;anima(450,k=>poeNivel(p,n0+(alvo-n0)*k,i0+(inc-i0)*k))}}
    if(c.type==='motor')p.gira=Math.max(0,Math.min(1,res.lamp[c.id]||0));
    /* fotocélula: céu de dia (sol) ou de noite (lua e estrelas), janela do sensor escura de noite (c.noite) */
    if(c.type==='foto'){const n=!!c.noite,e=p.extra;if(p.noite!==n){p.noite=n;e.ceu.material=mat(n?PAL.ceuNoite:PAL.ceuDia);e.sol.visible=!n;e.lua.visible=e.estrelas.visible=n;
      e.janela.material.color.setHex(n?SENSOR.noite:SENSOR.dia);e.txt.userData.vivo.o.cor=n?'#e9edf3':'#1d4a7a';trocaTexto(e.txt,n?'NOITE':'DIA')}}
    /* relé de impulso: a alavanca sobe e o visor fica laranja com o contato 1-2 fechado (c.on, do solver) */
    if(c.type==='ri'){const on=!!c.on,alvo=on?-.5:.5,e=p.extra;if(p.angRI!==alvo){const de=p.angRI===undefined?alvo:e.pino.rotation.x;p.angRI=alvo;anima(150,k=>{e.pino.rotation.x=de+(alvo-de)*k})}
      e.visor.material.color.setHex(on?PAL.riOn:PAL.riOff);e.visor.material.emissive.setHex(on?0x7a3a0a:0x000000)}
    if(c.type==='sw'||c.type==='sw3'||c.type==='sw4'){const alvo=(c.type==='sw'?c.closed:c.pos)?TECLA.on:TECLA.off;if(p.tec!==alvo){const pi=p.extra.pino,de=p.tec===undefined?alvo:pi.rotation.x;p.tec=alvo;anima(120,k=>{pi.rotation.x=de+(alvo-de)*k})}}
    if(c.type==='btn'){const alvo=c.pressed?BOTAO.afunda:0;if(p.emb!==alvo){const de=p.extra.embolo.position.z,para=BOTAO.z+alvo;p.emb=alvo;anima(90,k=>{p.extra.embolo.position.z=de+(para-de)*k})}}
    if(c.type==='dr'){p.extra.visor.material.color.setHex(c.trip?PAL.desarmado:PAL.armado);p.extra.visor.material.emissive.setHex(c.trip?0x6b1a12:0x0f4a24)}
    if(c.type==='src'){p.extra.led.material.color.setHex(c.trip?0xe24c3f:0x43b05c);p.extra.led.material.emissive.setHex(c.trip?0x7a1d12:0x1f7a36);
      const r=typeof rede==='function'?rede():{V:220,FF:380};trocaTexto(p.extra.visor,c.trip?'PROT':(nFases(c)>1?r.V+'/'+r.FF:r.V)+' V~')}
    /* pilha: em curto (corrente acima do limite do simulador CC) fica vermelha e solta calor */
    if(c.type==='pilha'){const pc=res.cc&&res.cc.pilhas&&res.cc.pilhas[c.id],q=!!(pc&&typeof CC!=='undefined'&&pc.I>CC.I_CURTO);
      if(p.quente!==q){p.quente=q;p.extra.celula.material=mat(q?PAL.pilhaQuente:PAL.pilha);p.extra.calor.visible=q}}
    if(c.type==='lamp'){const b=Math.max(0,Math.min(1,res.lamp[c.id]||0));p.brilho=b;p.queimada=!!c.broken;
      p.extra.bulbo.material.color.setHex(c.broken?0x2d2f33:b>.04?0xfff2a8:0x5a6b7d);p.extra.bulbo.material.emissive.setRGB(1*b,.85*b,.3*b);
      p.extra.brilho.visible=b>.04;p.extra.brilho.material.opacity=b;p.extra.brilho.scale.setScalar(5+5*b)}});
  desenhaFios(st);poeDicas(ctx);
  /* realce do ponto elétrico: com um borne selecionado, só os fios do mesmo potencial ficam cheios */
  const ponto=ctx.sel&&res.net?res.net(ctx.sel):null;E.realce=ponto;
  if(!(ctx.curto&&ctx.curto.fios))E.fios.forEach(f=>{f.material=!ponto||res.net(f.userData.a)===ponto?matFio(f.userData.cor):matFioApagado(f.userData.cor)});
  const sb=ctx.sel&&E.bornes[ctx.sel];E.sel.visible=!!sb;if(sb)E.sel.position.copy(sb).add(new THREE.Vector3(0,0,.3));
  if(ctx.curto&&ctx.curto.fios)animaCurto(ctx.curto);
  dimensiona();pede();
}

/* ---------- badge do borne (HTML, pointer-events: none) ---------- */
function textoBorne(id){const [pid,k]=id.split('.'),p=E.pecas[pid];return p?nomePeca(p.c)+' · '+nomeBorne(p.c,+k):id}
function mostraBadge(x,y,txt){const r=E.no.getBoundingClientRect(),b=E.badge;clearTimeout(E.badgeT);b.textContent=txt;b.style.left=(x-r.left)+'px';b.style.top=(y-r.top)+'px';b.hidden=false}
function escondeBadge(ms){clearTimeout(E.badgeT);if(ms)E.badgeT=setTimeout(()=>{if(E)E.badge.hidden=true},ms);else E.badge.hidden=true}

/* ---------- seletor de fases da fonte (HTML sobre a cena) ---------- */
function abreFases(c,x,y){fechaFases();const r=E.no.getBoundingClientRect(),d=document.createElement('div');d.className='fases3d';d.setAttribute('role','group');d.setAttribute('aria-label','Fases da fonte');
  d.innerHTML='<b>Fonte</b>'+[1,2,3].map(n=>'<button type="button" class="btn" data-f="'+n+'" aria-pressed="'+(nFases(c)===n)+'">'+n+'F+N</button>').join('');
  d.style.left=Math.max(8,Math.min(r.width-230,x-r.left-110))+'px';d.style.top=Math.max(8,y-r.top-70)+'px';
  d.querySelectorAll('[data-f]').forEach(b=>b.addEventListener('click',()=>{const ctl=E.ctx.ctl;fechaFases();ctl.acionou(c.id,'fases:'+b.dataset.f)}));
  E.no.appendChild(d);E.seletor=d}
function fechaFases(){if(E&&E.seletor){E.seletor.remove();E.seletor=null}}
/* dois toques rápidos no mesmo ponto do espaço vazio: volta a câmera ao enquadramento da bancada (sem botão) */
function toqueVazio(e){if(e.isPrimary===false)return;const t0=performance.now(),x0=e.clientX,y0=e.clientY;
  const up=ev=>{window.removeEventListener('pointerup',up);if(!E||performance.now()-t0>300||Math.hypot(ev.clientX-x0,ev.clientY-y0)>12)return;
    const u=E.ultimoToqueVazio;E.ultimoToqueVazio={t:performance.now(),x:x0,y:y0};
    if(u&&performance.now()-u.t<400&&Math.hypot(u.x-x0,u.y-y0)<30){E.ultimoToqueVazio=null;enquadra();pede()}};
  window.addEventListener('pointerup',up)}

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
/* ---------- zoom no ponto ----------
   Aproxima (ou afasta) câmera e alvo na direção de um ponto P da bancada: P fica parado na tela e o resto cresce
   em volta. Assim dá para chegar perto de uma peça na borda. Pinça com dois dedos e roda do mouse usam isto;
   girar (um dedo) e arrastar (dois dedos) continuam com o OrbitControls. */
function pontoDaTela(x,y){const r=areaBancada();if(!r.width||y<r.top||y>r.top+r.height)return null;E.raycaster.setFromCamera(ndc(x,y,r),E.camera);
  const q=new THREE.Vector3();return E.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),-2),q)?q:null}
function zoomNoPonto(x,y,fator){const P=pontoDaTela(x,y);if(!P)return;const c=E.controls,cam=E.camera.position,alvo=c.target,d=cam.distanceTo(alvo);
  const f=Math.min(Math.max(fator,c.minDistance/d),c.maxDistance/d);if(Math.abs(f-1)<1e-4)return;
  cam.sub(P).multiplyScalar(f).add(P);alvo.sub(P).multiplyScalar(f).add(P);c.update();pede()}
function rodaMouse(e){if(!E)return;e.preventDefault();zoomNoPonto(e.clientX,e.clientY,Math.exp(e.deltaY*.0015))}
function rastreia(e){if(!E)return;E.ponteiros.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(E.ponteiros.size===2){const [a,b]=[...E.ponteiros.values()];E.pinca={d:Math.hypot(a.x-b.x,a.y-b.y)};E.gestos=(E.gestos||0)+1;escondeBadge();fechaFases()}}
function moveDedos(e){if(!E||!E.ponteiros.has(e.pointerId))return;E.ponteiros.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(E.pinca&&E.ponteiros.size===2){const [a,b]=[...E.ponteiros.values()],d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d>10&&E.pinca.d>10)zoomNoPonto((a.x+b.x)/2,(a.y+b.y)/2,E.pinca.d/d);E.pinca.d=d}}
function soltaDedo(e){if(!E)return;E.ponteiros.delete(e.pointerId);if(E.ponteiros.size<2)E.pinca=null}

function aoTocar(e){
  if(!E||!E.ctx||e.target!==E.cv||(e.button!==undefined&&e.button>0))return;
  if(E.ponteiros.size>1)return;/* segundo dedo: é gesto (pinça ou arraste), não toque em peça */
  fechaFases();
  if(E.ctx.girar){toqueVazio(e);return}/* botão 🔄 Girar ligado: todo arraste gira a vista e nenhum toque mexe na montagem */
  const alvo=alvoEm(e.clientX,e.clientY);if(!alvo){toqueVazio(e);return}/* espaço vazio: girar, aproximar e arrastar a câmera */
  /* peça ou fio: o toque NÃO é capturado; o OrbitControls também recebe, então arrastar gira a vista.
     Só o toque parado (sem arrastar e sem segundo dedo) aciona a peça ou tira o fio. */
  if(!alvo.t){const x0=e.clientX,y0=e.clientY,g0=E.gestos||0;let longe=false;
    const mv=ev=>{if(Math.hypot(ev.clientX-x0,ev.clientY-y0)>10)longe=true};
    const up=ev=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      if(!E||longe||ev.type==='pointercancel'||(E.gestos||0)!==g0||Math.hypot(ev.clientX-x0,ev.clientY-y0)>10)return;
      const ctl=E.ctx.ctl,ed=E.ctx.editavel!==false;
      if(alvo.peca){const pc=E.pecas[alvo.peca];if(pc&&pc.c.type==='src'&&!pc.c.trip&&ed)abreFases(pc.c,ev.clientX,ev.clientY);else ctl.acionou(alvo.peca,alvo.lado||0)}
      else if(alvo.w!==undefined&&ed)ctl.tirouFio(alvo.w)};
    window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);return}
  e.stopPropagation();e.preventDefault();
  const ctl=E.ctx.ctl,ed=E.ctx.editavel!==false,x0=e.clientX,y0=e.clientY;let arrastando=false,cancelado=false;
  /* se um segundo dedo chegar (pinça), o toque em andamento é cancelado: nada de fio nem acionamento */
  const virouGesto=()=>{if(cancelado||!E||E.ponteiros.size<2)return cancelado;cancelado=true;if(E.fioTmp){tiraMalha(E.fioTmp);E.fioTmp=null}escondeBadge();pede();return true};
  if(alvo.t)mostraBadge(x0,y0,textoBorne(alvo.t));
  const move=ev=>{if(virouGesto()||!alvo.t||!ed)return;if(!arrastando&&Math.hypot(ev.clientX-x0,ev.clientY-y0)<10)return;arrastando=true;
    const sob=alvoEm(ev.clientX,ev.clientY);mostraBadge(ev.clientX,ev.clientY,textoBorne(alvo.t)+' → '+(sob&&sob.t&&sob.t!==alvo.t?textoBorne(sob.t):'…'));
    const q=pontoNoPlano(ev.clientX,ev.clientY);if(!q)return;if(E.fioTmp)tiraMalha(E.fioTmp);E.fioTmp=malhaFio(E.bornes[alvo.t],q,E.ctx.cor||'fase');E.scene.add(E.fioTmp);pede()};
  const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    if(E&&E.fioTmp){tiraMalha(E.fioTmp);E.fioTmp=null;pede()}
    if(E)escondeBadge(arrastando||ev.type==='pointercancel'?0:700);/* toque simples: o nome fica um instante */
    if(ev.type==='pointercancel'||cancelado)return;
    if(arrastando){const fim=alvoEm(ev.clientX,ev.clientY);ctl.arrastouFio(alvo.t,fim&&fim.t||null);return}
    if(alvo.t){if(ed)ctl.tocouBorne(alvo.t)}
    else if(alvo.peca){const pc=E.pecas[alvo.peca];if(pc&&pc.c.type==='src'&&!pc.c.trip&&ed)abreFases(pc.c,ev.clientX,ev.clientY);else ctl.acionou(alvo.peca,alvo.lado||0)}
    else if(alvo.w!==undefined&&ed)ctl.tirouFio(alvo.w)};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}

/* libera tudo: geometrias da cena, materiais e texturas do cache e o contexto WebGL */
function destruir(){if(!E)return;
  if(E.pedido)cancelAnimationFrame(E.pedido);E.ro.disconnect();E.no.removeEventListener('pointerdown',aoTocar,true);E.no.removeEventListener('pointerdown',rastreia,true);
  window.removeEventListener('pointermove',moveDedos);window.removeEventListener('pointerup',soltaDedo);window.removeEventListener('pointercancel',soltaDedo);E.cv.removeEventListener('wheel',rodaMouse);E.controls.dispose();
  E.scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});
  if(CACHE){CACHE.mat.forEach(m=>m.dispose());CACHE.tex.forEach(t=>t.dispose());CACHE.unicos.forEach(m=>{if(m.map)m.map.dispose();m.dispose()});CACHE=null}
  clearTimeout(E.badgeT);E.badge.remove();fechaFases();
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
  /* nenhum trecho do corredor (horizontal, junto à chapa) passa por dentro da caixa de uma peça que não é dele */
  /* trechos junto à chapa (z constante) que passam por dentro da caixa de uma peça que não é ponta do fio */
  atravessados:()=>{const o=[];E.fios.forEach(f=>{const w=E.ctx.st.wires[f.userData.w],pontas=[w.a,w.b].map(t=>t.split('.')[0]);
    f.geometry.parameters.path.curves.filter(c=>c.isLineCurve3&&Math.abs(c.v1.z-c.v2.z)<1e-6&&c.v1.z<2).forEach(c=>Object.entries(E.pecas).forEach(([id,p])=>{if(pontas.includes(id))return;const cx=p.caixa;
      const x0=Math.min(c.v1.x,c.v2.x),x1=Math.max(c.v1.x,c.v2.x),y0=Math.min(c.v1.y,c.v2.y),y1=Math.max(c.v1.y,c.v2.y);
      if(x1>cx.min.x&&x0<cx.max.x&&y1>cx.min.y&&y0<cx.max.y)o.push(w.a+'-'+w.b+' por '+id)}))});return o},
  semAtravessar:()=>debug.atravessados().length===0,
  rotaDe:(a,b)=>{const f=E.fios.find(m=>{const w=E.ctx.st.wires[m.userData.w];return w.a===a&&w.b===b});return f&&f.userData.rota},
  azimute:()=>[E.controls.minAzimuthAngle,E.controls.maxAzimuthAngle],
  /* todo trecho reto do fio anda num eixo só (x, y ou z): traçado em ângulo reto, como no diagrama */
  ortogonal:()=>E.fios.every(f=>f.geometry.parameters.path.curves.filter(c=>c.isLineCurve3).every(c=>{const d=c.v2.clone().sub(c.v1);return [d.x,d.y,d.z].filter(v=>Math.abs(v)>1e-6).length<=1})),
  /* pistas: fios diferentes correm em profundidades diferentes (não ficam um sobre o outro) */
  pistas:()=>new Set(E.fios.map(f=>f.geometry.parameters.path.curves.find(c=>c.isLineCurve3&&Math.abs(c.v1.z-c.v2.z)<1e-6&&c.v1.z<2).v1.z.toFixed(2))).size,
  raioFio:()=>E.fios.length?E.fios[0].geometry.parameters.radius:null,
  telaTeste:id=>naTela(E.pecas[id].extra.teste.getWorldPosition(new THREE.Vector3())),
  visorDR:id=>E.pecas[id].extra.visor.material.color.getHex()===PAL.desarmado?'desarmado':'armado',
  emboloAlvo:id=>E.pecas[id].emb||0,
  dicas:()=>E.estadoDicas||{},
  wagos:()=>(E.wagos||[]).map(w=>w.userData.wago+':'+w.userData.vias).sort(),
  seletorFases:()=>E.seletor,
  camera:()=>E.camera.position.toArray().map(v=>+v.toFixed(2)),
  distancia:()=>E.camera.position.distanceTo(E.controls.target),
  giraCamera:()=>{E.camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),1.1);E.camera.lookAt(E.controls.target);E.controls.update()},
  tecla:id=>E.pecas[id].tec,
  motorGira:id=>E.pecas[id].gira||0,
  nivel:id=>E.pecas[id].nivel,
  emboloKC:id=>({on:!!E.pecas[id].on,cor:E.pecas[id].extra.embolo.material.color.getHexString()}),
  noite:id=>{const e=E.pecas[id].extra;return {lua:e.lua.visible,sol:e.sol.visible,ceu:e.ceu.material.color.getHex()===PAL.ceuNoite,texto:e.txt.userData.vivo.txt}},
  releImpulso:id=>{const p=E.pecas[id];return {alavanca:p.angRI,visor:p.extra.visor.material.color.getHex()===PAL.riOn?'fechado':'aberto'}},
  visorFT:id=>E.pecas[id].extra.visor.material.color.getHex()===PAL.desarmado?'disparado':'armado',
  faixa:()=>({altura:E.faixaH||0}),
  plano:()=>({plano:!!E.plano,gira:E.controls.enableRotate,fov:E.camera.fov,frente:Math.abs(E.camera.position.x-E.controls.target.x)<.01&&Math.abs(E.camera.position.y-E.controls.target.y)<.01}),
  badge:()=>({visivel:!E.badge.hidden,texto:E.badge.textContent}),
  plaquetas:pid=>{const o=[];E.pecas[pid].g.traverse(m=>{if(m.userData.plaqueta)o.push({t:m.userData.plaqueta,incl:m.rotation.x,alt:m.geometry.parameters.height})});return o},
  nomeBorne:(pid,k)=>nomeBorne(E.pecas[pid].c,k),
  brilho:id=>E.pecas[id].brilho||0,
  pilhaQuente:id=>!!E.pecas[id].quente,
  queimada:id=>!!E.pecas[id].queimada,
  alavanca:id=>E.pecas[id].ang,
  fios:()=>E.fios.length,
  curtoAtivo:()=>performance.now()<E.curtoAte,
  faisca:()=>E.faisca.visible
};

/* registra a vista (só se o aparelho tiver WebGL; sem ele, a bancada segue no SVG) */
const temGL=(()=>{try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(e){return false}})();
if(temGL)VISTA3D.vista={aceita:st=>VISTA3D.suporta(st),montar,atualizar,destruir,debug};
else VISTA3D.erro='Este aparelho não tem WebGL: a bancada continua em 2D.';
