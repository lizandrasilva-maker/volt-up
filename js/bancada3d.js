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
const TERM3D={
  src:()=>[[-1.25,-3.6,3.3],[1.25,-3.6,3.3]],                         /* .0 = L1, .1 = N */
  fuse:()=>[[0,3.1,DIN.z0+DIN.D+.05],[0,-2.6,DIN.z0+DIN.D+.05]],      /* .0 = entrada (topo), .1 = saída (base) */
  lamp:()=>[[-1.35,-1.35,.7],[1.35,-1.35,.7]]                         /* .0 = X1, .1 = X2 */
};
const bornesDe=c=>(TERM3D[c.type]?TERM3D[c.type](c):[]).map(p=>new THREE.Vector3(...p));

/* ---------- paleta (skill voltup-3d-anime) ---------- */
const PAL={corpoDIN:0xE6E9EF,frenteDIN:0xD5DAE2,trilho:0x9AA5B4,cavidade:0x1F2933,zinco:0xCBD5E1,fenda:0x3A4048,
  fonte:0x7C8A99,fonteFrente:0x5D6B7A,lcd:0xC6D68A,regua:0x2A2F36,alavanca:0x2F4A6E,pontaAlavanca:0xE24C3F,
  painel:0x1D3550,soquete:0xD9DDE3,base:0xE6E9EF};

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
  g.fillStyle=o.cor||'#1b1a10';g.font='900 '+Math.round(cv.height*(o.esc||.62))+'px Nunito, system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,cv.width/2,cv.height/2+2)}
function texturaDeCanvas(cv){const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
/* rótulo técnico: textura e material em cache pelo texto, cor e tamanho */
function rotulo(txt,larg,alt,o){o=o||{};const C=cache(),k='rot:'+[txt,larg,alt,o.cor,o.fundo,o.esc].join('|');
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
/* curto: material vermelho emissivo compartilhado; o pulso muda só a intensidade dele */
function matCurto(){const C=cache();if(!C.mat.has('curto'))C.mat.set('curto',new THREE.MeshToonMaterial({color:0xff2a2a,emissive:0xff2a2a,emissiveIntensity:1,gradientMap:tons()}));return C.mat.get('curto')}

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
    const l=rotulo(t,1.6,.9,{cor});l.position.set(bornes[k].x,-2.05,3.22);g.add(l)});
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
  return {g,bornes,corpo:[corpo,frente,alav,ponta],extra:{pino}}}
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
  [['X1',0],['X2',1]].forEach(([t,k])=>{const l=rotulo(t,1.4,.8,{cor:'#eef2f7'});l.position.set(bornes[k].x,-2.6,.62);g.add(l)});
  return {g,bornes,corpo:[base,soq,bulbo],extra:{bulbo,brilho}}}
const CONSTRUTOR={src:fonte,fuse:disjuntor,lamp:lampada};

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
  const painel=new THREE.Mesh(new THREE.BoxGeometry(37,28,.6),mat(PAL.painel));painel.position.z=-.3;scene.add(painel);
  const controls=new OrbitControls(camera,cv);controls.target.set(0,-1,2);
  controls.minDistance=22;controls.maxDistance=70;controls.minAzimuthAngle=-.65;controls.maxAzimuthAngle=.65;controls.minPolarAngle=.95;controls.maxPolarAngle=1.95;
  controls.screenSpacePanning=true;controls.update();
  /* contorno com o --contorno do jogo (mesma lineart do SVG) */
  const contorno=new THREE.Color(cssVar('--contorno','#070c16'));
  const efeito=new OutlineEffect(renderer,{defaultThickness:.0045,defaultColor:[contorno.r,contorno.g,contorno.b],defaultAlpha:1});
  E={no,renderer,scene,camera,controls,efeito,cv,contorno:'#'+contorno.getHexString(),pecas:{},bornes:{},hits:[],fios:[],fioTmp:null,assinaturaFios:'',anim:[],pedido:0,ctx:null,
     sel:null,faisca:null,curtoAte:0,raycaster:new THREE.Raycaster(),tamanho:[0,0]};
  /* anel que marca o borne selecionado (toque-toque) */
  const anel=semContorno(new THREE.MeshBasicMaterial({color:0xf4c430}));cache().unicos.push(anel);
  E.sel=new THREE.Mesh(new THREE.TorusGeometry(.85,.14,10,32),anel);E.sel.visible=false;scene.add(E.sel);
  E.faisca=sprite(texturaBrilho('faisca',['rgba(255,255,255,1)','rgba(255,160,60,.8)']),6);E.faisca.visible=false;scene.add(E.faisca);
  construir(ctx.st);
  controls.addEventListener('change',pede);
  no.addEventListener('pointerdown',aoTocar,true);/* captura: decide antes do OrbitControls */
  E.ro=new ResizeObserver(()=>{if(dimensiona())pede()});E.ro.observe(no);
}
function construir(st){
  const fus=st.comps.filter(c=>c.type==='fuse');
  if(fus.length){const xs=fus.map(c=>pos2d(c).x);E.scene.add(trilho(Math.min(...xs)-3.5,Math.max(...xs)+3.5,pos2d(fus[0]).y))}
  /* esfera de toque compartilhada (invisível, maior que o parafuso) */
  const toque=semContorno(new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}));cache().unicos.push(toque);const geoToque=new THREE.SphereGeometry(1.2,10,8);
  st.comps.forEach(c=>{const f=CONSTRUTOR[c.type];if(!f)return;
    const p=f(c);p.g.position.copy(pos2d(c));E.scene.add(p.g);p.g.updateMatrixWorld(true);E.pecas[c.id]={c,...p,ang:c.trip?.5:-.5};
    p.corpo.forEach(m=>{m.userData.peca=c.id;E.hits.push(m)});
    p.bornes.forEach((v,k)=>{const id=c.id+'.'+k,w=p.g.localToWorld(v.clone());E.bornes[id]=w;
      const h=new THREE.Mesh(geoToque,toque);h.position.copy(w);h.userData.t=id;E.scene.add(h);E.hits.push(h)})});
}
/* tamanho do canvas acompanha a largura da bancada (4:3, até 520 px de altura) */
function dimensiona(){const w=Math.max(260,Math.round(E.no.clientWidth||E.no.parentElement&&E.no.parentElement.clientWidth||340)),h=Math.round(Math.min(w*.78,520));
  if(w===E.tamanho[0]&&h===E.tamanho[1])return false;E.tamanho=[w,h];E.renderer.setSize(w,h);E.camera.aspect=w/h;E.camera.updateProjectionMatrix();return true}

/* ---------- desenho sob demanda: só há laço enquanto alguma animação está rodando ---------- */
function pede(){if(E&&!E.pedido)E.pedido=requestAnimationFrame(quadro)}
function quadro(){if(!E)return;E.pedido=0;const agora=performance.now();
  E.anim=E.anim.filter(a=>{const k=Math.min(1,(agora-a.t0)/a.dur);a.passo(k,agora);return k<1});
  E.efeito.render(E.scene,E.camera);if(E.anim.length)pede()}
const anima=(dur,passo)=>{if(reduz()){passo(1,performance.now());return}E.anim.push({t0:performance.now(),dur,passo});pede()};

/* ---------- fios: tubo sobre curva Catmull-Rom; sai perpendicular ao borne (+Z) e faz barriga ---------- */
function curvaFio(a,b){const d=a.distanceTo(b),sag=1+d*.16;
  const m=a.clone().add(b).multiplyScalar(.5).add(new THREE.Vector3(0,-sag,2.4+d*.04));
  return new THREE.CatmullRomCurve3([a,a.clone().add(new THREE.Vector3(0,0,1.3)),m,b.clone().add(new THREE.Vector3(0,0,1.3)),b],false,'catmullrom',.5)}
function malhaFio(a,b,cor){const cur=curvaFio(a,b),geo=new THREE.TubeGeometry(cur,56,.26,10,false);
  /* listras do terra: repete a textura compartilhada pelo comprimento, escalando as UVs da própria geometria */
  const rep=Math.max(2,Math.round(cur.getLength()*1.2)),uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,uv.getX(i)*rep);
  const m=new THREE.Mesh(geo,matFio(cor));m.userData.cor=cor;return m}
function tiraMalha(m){E.scene.remove(m);m.geometry.dispose()}/* material e textura são do cache */
function desenhaFios(st){
  const ass=st.wires.map(w=>w.a+'>'+w.b+':'+(w.cor||'')).join('|');if(ass===E.assinaturaFios)return;E.assinaturaFios=ass;
  E.fios.forEach(f=>{E.hits.splice(E.hits.indexOf(f),1);tiraMalha(f)});E.fios=[];
  st.wires.forEach((w,i)=>{const a=E.bornes[w.a],b=E.bornes[w.b];if(!a||!b)return;const m=malhaFio(a,b,w.cor||'fase');m.userData.w=i;E.scene.add(m);E.fios.push(m);E.hits.push(m)});
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
    if(c.type==='fuse'){const alvo=c.trip?.5:-.5;if(p.ang!==alvo){const de=p.extra.pino.rotation.x;p.ang=alvo;anima(180,k=>{p.extra.pino.rotation.x=de+(alvo-de)*k})}else p.extra.pino.rotation.x=alvo}
    if(c.type==='src'){p.extra.led.material.color.setHex(c.trip?0xe24c3f:0x43b05c);p.extra.led.material.emissive.setHex(c.trip?0x7a1d12:0x1f7a36);
      trocaTexto(p.extra.visor,c.trip?'PROT':(typeof rede==='function'?rede().V:220)+' V~')}
    if(c.type==='lamp'){const b=Math.max(0,Math.min(1,res.lamp[c.id]||0));p.brilho=b;
      p.extra.bulbo.material.color.setHex(b>.04?0xfff2a8:0x5a6b7d);p.extra.bulbo.material.emissive.setRGB(1*b,.85*b,.3*b);
      p.extra.brilho.visible=b>.04;p.extra.brilho.material.opacity=b;p.extra.brilho.scale.setScalar(5+5*b)}});
  desenhaFios(st);
  const sb=ctx.sel&&E.bornes[ctx.sel];E.sel.visible=!!sb;if(sb)E.sel.position.copy(sb).add(new THREE.Vector3(0,0,.3));
  if(ctx.curto&&ctx.curto.fios)animaCurto(ctx.curto);
  dimensiona();pede();
}

/* ---------- toque: raycast nos bornes, peças e fios; o resto vai para o OrbitControls ---------- */
function alvoEm(x,y){const r=E.cv.getBoundingClientRect();if(!r.width)return null;
  /* matrizes em dia mesmo antes do próximo quadro (toque logo depois de ligar um fio, ou nos testes) */
  E.scene.updateMatrixWorld();E.camera.updateMatrixWorld();
  const p=new THREE.Vector2((x-r.left)/r.width*2-1,-((y-r.top)/r.height)*2+1);E.raycaster.setFromCamera(p,E.camera);
  const it=E.raycaster.intersectObjects(E.hits,false);if(!it.length)return null;
  const t=it.find(i=>i.object.userData.t);if(t)return {t:t.object.userData.t};/* borne tem prioridade (área de toque maior) */
  const u=it[0].object.userData;return u.peca?{peca:u.peca}:u.w!==undefined?{w:u.w}:null}
function pontoNoPlano(x,y){const r=E.cv.getBoundingClientRect(),p=new THREE.Vector2((x-r.left)/r.width*2-1,-((y-r.top)/r.height)*2+1);
  E.raycaster.setFromCamera(p,E.camera);const q=new THREE.Vector3();return E.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),-3),q)?q:null}
function aoTocar(e){
  if(!E||!E.ctx||(e.button!==undefined&&e.button>0))return;
  const alvo=alvoEm(e.clientX,e.clientY);if(!alvo)return;/* espaço vazio: girar, aproximar e arrastar a câmera */
  e.stopPropagation();e.preventDefault();
  const ctl=E.ctx.ctl,ed=E.ctx.editavel!==false,x0=e.clientX,y0=e.clientY;let arrastando=false;
  const move=ev=>{if(!alvo.t||!ed)return;if(!arrastando&&Math.hypot(ev.clientX-x0,ev.clientY-y0)<10)return;arrastando=true;
    const q=pontoNoPlano(ev.clientX,ev.clientY);if(!q)return;if(E.fioTmp)tiraMalha(E.fioTmp);E.fioTmp=malhaFio(E.bornes[alvo.t],q,E.ctx.cor||'fase');E.scene.add(E.fioTmp);pede()};
  const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    if(E&&E.fioTmp){tiraMalha(E.fioTmp);E.fioTmp=null;pede()}
    if(ev.type==='pointercancel')return;
    if(arrastando){const fim=alvoEm(ev.clientX,ev.clientY);ctl.arrastouFio(alvo.t,fim&&fim.t||null);return}
    if(alvo.t){if(ed)ctl.tocouBorne(alvo.t)}
    else if(alvo.peca)ctl.acionou(alvo.peca,0);
    else if(alvo.w!==undefined&&ed)ctl.tirouFio(alvo.w)};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}

/* libera tudo: geometrias da cena, materiais e texturas do cache e o contexto WebGL */
function destruir(){if(!E)return;
  if(E.pedido)cancelAnimationFrame(E.pedido);E.ro.disconnect();E.no.removeEventListener('pointerdown',aoTocar,true);E.controls.dispose();
  E.scene.traverse(o=>{if(o.geometry)o.geometry.dispose()});
  if(CACHE){CACHE.mat.forEach(m=>m.dispose());CACHE.tex.forEach(t=>t.dispose());CACHE.unicos.forEach(m=>{if(m.map)m.map.dispose();m.dispose()});CACHE=null}
  E.renderer.dispose();try{E.renderer.forceContextLoss()}catch(e){}E.cv.remove();E=null}

/* ---------- inspeção para os testes ---------- */
function naTela(v){const r=E.cv.getBoundingClientRect();E.camera.updateMatrixWorld();const p=v.clone().project(E.camera);return {x:r.left+(p.x+1)/2*r.width,y:r.top+(1-p.y)/2*r.height}}
const debug={
  gl:()=>!!(E&&E.renderer.getContext()),
  contagem:()=>{let n=0;E&&E.scene.traverse(o=>{if(o.isMesh)n++});return n},
  /* materiais distintos usados pelas malhas (o cache faz este número ficar bem abaixo do de malhas) */
  materiais:()=>{const s=new Set();E.scene.traverse(o=>{if(o.isMesh)s.add(o.material)});return s.size},
  bornesTERM3D:c=>bornesDe(c).length,
  contorno:()=>E.contorno,
  corFio:i=>{const f=E.fios.find(m=>m.userData.w===i);return f?f.material.userData.cores:null},
  tela:id=>E.bornes[id]?naTela(E.bornes[id]):naTela(E.pecas[id].corpo[0].getWorldPosition(new THREE.Vector3())),
  telaFio:i=>{const f=E.fios.find(m=>m.userData.w===i);return naTela(f.geometry.parameters.path.getPoint(.5))},
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
