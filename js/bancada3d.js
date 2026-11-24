/* ================= BANCADA 3D (MVP) =================
   Vista 3D estilizada (cel-shading) da bancada, em Three.js puro (módulo ES, carregado sob demanda por fases.js
   com o "three" da importmap do index.html).
   Ela só DESENHA e RELATA GESTOS: ligar fio, acionar disjuntor, curto e NBR 5410 continuam no ctl de runBuild
   e no solver (motor.js). Contrato com fases.js: VISTA3D.vista = {aceita, montar, atualizar, destruir, debug}.
   MVP: fonte 1F+N (régua L1/N), disjuntor em trilho DIN 35 mm, lâmpada em soquete e fios em tubo.
   Escala: 1 unidade 3D = 10 unidades da bancada 2D (as fases continuam usando c.x e c.y). */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {OutlineEffect} from 'three/addons/effects/OutlineEffect.js';

const COR3D={fase:0xe24c3f,neutro:0x6bb9e8,retorno:0xd9dde3,terra:0x43b05c,pos:0xd33a2c,neg:0x1c1f24};
const reduz=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const pos2d=c=>new THREE.Vector3((c.x-170)/10,-(c.y-125)/10,0);
const SEM_CONTORNO={visible:false};

/* ---------- materiais: toon de 3 tons (NearestFilter = degraus duros, sem degradê) ---------- */
let TONS=null;
function tons(){if(TONS)return TONS;const d=new Uint8Array([85,85,85,255,170,170,170,255,255,255,255,255]);
  TONS=new THREE.DataTexture(d,3,1,THREE.RGBAFormat);TONS.minFilter=THREE.NearestFilter;TONS.magFilter=THREE.NearestFilter;TONS.generateMipmaps=false;TONS.needsUpdate=true;return TONS}
const toon=(cor,extra)=>new THREE.MeshToonMaterial(Object.assign({color:cor,gradientMap:tons()},extra||{}));
const semContorno=m=>{m.userData.outlineParameters=SEM_CONTORNO;return m};
/* texto pintado num canvas (rótulos das peças) */
function rotulo(txt,larg,alt,o){o=o||{};const px=128,cv=document.createElement('canvas');cv.width=Math.round(larg*px);cv.height=Math.round(alt*px);
  const g=cv.getContext('2d');if(o.fundo){g.fillStyle=o.fundo;g.fillRect(0,0,cv.width,cv.height)}
  g.fillStyle=o.cor||'#1b1a10';g.font='900 '+Math.round(cv.height*(o.esc||.62))+'px Nunito, system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,cv.width/2,cv.height/2+2);
  const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(larg,alt),semContorno(new THREE.MeshBasicMaterial({map:t,transparent:true})))}
/* fio terra: listras verde-amarelo que se repetem ao longo do tubo */
function texturaTerra(){const cv=document.createElement('canvas');cv.width=64;cv.height=16;const g=cv.getContext('2d');
  g.fillStyle='#43b05c';g.fillRect(0,0,64,16);g.fillStyle='#f2d22e';for(let x=-16;x<80;x+=32){g.beginPath();g.moveTo(x,0);g.lineTo(x+16,0);g.lineTo(x+32,16);g.lineTo(x+16,16);g.fill()}
  const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t}
/* brilho e faísca: sprites com degradê radial */
function texturaBrilho(cor){const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,cor[0]);r.addColorStop(.45,cor[1]);r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t}
const sprite=(tex,esc)=>{const s=new THREE.Sprite(semContorno(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));s.scale.setScalar(esc);return s};

/* ---------- peças ----------
   Cada construtor devolve {g (grupo), bornes:{k: posição local}, corpo:[malhas tocáveis], extra}.
   O borne tem uma esfera invisível maior (área de toque de ~44 px no celular). */
function parafuso(){const g=new THREE.Group();
  const cab=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.28,20),toon(0xc9cfd8));cab.rotation.x=Math.PI/2;g.add(cab);
  const fenda=new THREE.Mesh(new THREE.BoxGeometry(.62,.1,.06),toon(0x3a4048));fenda.position.z=.16;g.add(fenda);return g}
function fonte(c){const g=new THREE.Group();
  const caixa=new THREE.Mesh(new THREE.BoxGeometry(6,10,2.4),toon(0x7c8a99));caixa.position.z=1.2;g.add(caixa);
  const frente=new THREE.Mesh(new THREE.BoxGeometry(5.2,6,.2),toon(0x5d6b7a));frente.position.set(0,1.4,2.5);g.add(frente);
  const visor=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.4,.1),toon(0xc6d68a));visor.position.set(-.3,2.9,2.62);g.add(visor);
  const tx=rotulo('',3.4,1.2,{cor:'#1c240e'});tx.position.set(-.3,2.9,2.69);g.add(tx);
  const led=new THREE.Mesh(new THREE.SphereGeometry(.32,16,12),toon(0x43b05c,{emissive:0x1f7a36}));led.position.set(1.95,2.9,2.68);g.add(led);
  const nome=rotulo('FONTE 1F+N',4.6,.8,{cor:'#eef2f7'});nome.position.set(0,.8,2.62);g.add(nome);
  const regua=new THREE.Mesh(new THREE.BoxGeometry(5,1.9,.8),toon(0x2a2f36));regua.position.set(0,-3.6,2.8);g.add(regua);
  const bornes={0:new THREE.Vector3(-1.25,-3.6,3.3),1:new THREE.Vector3(1.25,-3.6,3.3)};
  [[0,'L1','#ff8a7a',0xe24c3f],[1,'N','#9fd6ff',0x6bb9e8]].forEach(([k,t,cs,cor])=>{const p=parafuso();p.position.copy(bornes[k]);g.add(p);
    const anel=new THREE.Mesh(new THREE.TorusGeometry(.6,.09,8,24),toon(cor));anel.position.copy(bornes[k]).add(new THREE.Vector3(0,0,-.08));g.add(anel);
    const l=rotulo(t,1.4,.8,{cor:cs});l.position.set(bornes[k].x,-2.1,3.22);g.add(l)});
  return {g,bornes,corpo:[caixa,frente,visor],extra:{led,visor:tx}}}
function disjuntor(c){const g=new THREE.Group(),W=2.4,H=8,D=4.6,z0=.75;
  const corpo=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),toon(0xeef2f7));corpo.position.z=z0+D/2;g.add(corpo);
  const frente=new THREE.Mesh(new THREE.BoxGeometry(W*.9,H*.46,.7),toon(0xdfe4ea));frente.position.set(0,0,z0+D+.35);g.add(frente);
  /* alavanca articulada: gira em torno do eixo X no pino, para cima ligado e para baixo desligado */
  const pino=new THREE.Group();pino.position.set(0,.2,z0+D+.7);g.add(pino);
  const alav=new THREE.Mesh(new THREE.BoxGeometry(1,2,.8),toon(0x2f4a6e));alav.position.y=1;pino.add(alav);
  const ponta=new THREE.Mesh(new THREE.BoxGeometry(1.02,.5,.82),toon(0xe24c3f));ponta.position.y=1.8;pino.add(ponta);
  const lab=rotulo(c.lab||c.id,2.2,.7,{cor:'#2f4a6e'});lab.position.set(0,-1.35,z0+D+.71);g.add(lab);
  const curva=rotulo('C10',1.4,.6,{cor:'#2f4a6e'});curva.position.set(0,-3.4,z0+D+.01);g.add(curva);
  const bornes={0:new THREE.Vector3(0,3.1,z0+D+.05),1:new THREE.Vector3(0,-2.6,z0+D+.05)};
  [0,1].forEach(k=>{const p=parafuso();p.position.copy(bornes[k]);g.add(p)});
  return {g,bornes,corpo:[corpo,frente,alav,ponta],extra:{pino}}}
/* trilho DIN 35 mm (perfil "chapéu", em escala de 1 unidade = 1 cm), extrudado ao longo de X */
function trilho(x0,x1,y){const s=new THREE.Shape(),P=[[-1.35,0],[1.35,0],[1.35,.65],[1.75,.65],[1.75,.75],[1.25,.75],[1.25,.1],[-1.25,.1],[-1.25,.75],[-1.75,.75],[-1.75,.65],[-1.35,.65]];
  s.moveTo(...P[0]);P.slice(1).forEach(p=>s.lineTo(...p));s.closePath();
  const L=x1-x0,geo=new THREE.ExtrudeGeometry(s,{depth:L,bevelEnabled:false});
  /* perfil desenhado em (u,v) e extrudado em z → (x = z, y = u, z = v) */
  geo.applyMatrix4(new THREE.Matrix4().set(0,0,1,0, 1,0,0,0, 0,1,0,0, 0,0,0,1));
  const m=new THREE.Mesh(geo,toon(0xb8c0ca));m.position.set(x0,y,0);return m}
function lampada(c){const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.BoxGeometry(4.2,4.2,.6),toon(0xeef2f7));base.position.z=.3;g.add(base);
  const soq=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.25,1.8,24),toon(0xd9dde3));soq.rotation.x=Math.PI/2;soq.position.set(0,.5,1.5);g.add(soq);
  const rosca=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,.9,20),toon(0xc9cfd8));rosca.rotation.x=Math.PI/2;rosca.position.set(0,.5,2.8);g.add(rosca);
  const bulbo=new THREE.Mesh(new THREE.SphereGeometry(1.75,28,20),toon(0x5a6b7d,{emissive:0x000000}));bulbo.position.set(0,.5,4.6);g.add(bulbo);
  const brilho=sprite(texturaBrilho(['rgba(255,246,200,1)','rgba(255,216,77,.55)']),9);brilho.position.copy(bulbo.position);brilho.visible=false;g.add(brilho);
  const lab=rotulo(c.lab||c.id,2,.8,{cor:'#eef2f7'});lab.position.set(0,-2.7,.62);g.add(lab);
  const bornes={0:new THREE.Vector3(-1.35,-1.35,.7),1:new THREE.Vector3(1.35,-1.35,.7)};
  [0,1].forEach(k=>{const p=parafuso();p.position.copy(bornes[k]);g.add(p)});
  [['X1',-1.35],['X2',1.35]].forEach(([t,x])=>{const l=rotulo(t,1.2,.55,{cor:'#2f4a6e'});l.position.set(x,-.45,.61);g.add(l)});
  return {g,bornes,corpo:[base,soq,bulbo],extra:{bulbo,brilho}}}

/* ---------- estado da cena (uma bancada 3D por vez) ---------- */
let E=null;

function montar(no,ctx){
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0x13283c,1);
  const cv=renderer.domElement;cv.style.touchAction='none';cv.setAttribute('aria-label','Bancada 3D: toque em dois parafusos para ligar um fio');no.appendChild(cv);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,4/3,.5,300);camera.position.set(6,9,46);
  scene.add(new THREE.HemisphereLight(0xdfe8ff,0x1b2433,1.15));
  const sol=new THREE.DirectionalLight(0xffffff,1.7);sol.position.set(10,16,24);scene.add(sol);
  const painel=new THREE.Mesh(new THREE.BoxGeometry(37,28,.6),toon(0x1d3550));painel.position.z=-.3;scene.add(painel);
  const controls=new OrbitControls(camera,cv);controls.target.set(0,-1,2);
  controls.minDistance=22;controls.maxDistance=70;controls.minAzimuthAngle=-.65;controls.maxAzimuthAngle=.65;controls.minPolarAngle=.95;controls.maxPolarAngle=1.95;
  controls.screenSpacePanning=true;controls.update();
  const efeito=new OutlineEffect(renderer,{defaultThickness:.0045,defaultColor:[.03,.05,.09],defaultAlpha:1});
  E={no,renderer,scene,camera,controls,efeito,cv,pecas:{},bornes:{},hits:[],fios:[],fioTmp:null,assinaturaFios:'',anim:[],pedido:0,ctx:null,
     sel:null,faisca:null,curtoAte:0,raycaster:new THREE.Raycaster(),tamanho:[0,0]};
  /* anel que marca o borne selecionado (toque-toque) */
  E.sel=new THREE.Mesh(new THREE.TorusGeometry(.85,.14,10,32),semContorno(new THREE.MeshBasicMaterial({color:0xf4c430})));E.sel.visible=false;scene.add(E.sel);
  E.faisca=sprite(texturaBrilho(['rgba(255,255,255,1)','rgba(255,160,60,.8)']),6);E.faisca.visible=false;scene.add(E.faisca);
  construir(ctx.st);
  controls.addEventListener('change',pede);
  no.addEventListener('pointerdown',aoTocar,true);/* captura: decide antes do OrbitControls */
  E.ro=new ResizeObserver(()=>{if(dimensiona())pede()});E.ro.observe(no);
}
function construir(st){
  const fus=st.comps.filter(c=>c.type==='fuse');
  if(fus.length){const xs=fus.map(c=>pos2d(c).x),y=pos2d(fus[0]).y;E.scene.add(trilho(Math.min(...xs)-3.5,Math.max(...xs)+3.5,y))}
  st.comps.forEach(c=>{const f={src:fonte,fuse:disjuntor,lamp:lampada}[c.type];if(!f)return;
    const p=f(c);p.g.position.copy(pos2d(c));E.scene.add(p.g);p.g.updateMatrixWorld(true);E.pecas[c.id]={c,...p,ang:c.trip?.5:-.5};
    p.corpo.forEach(m=>{m.userData.peca=c.id;E.hits.push(m)});
    Object.entries(p.bornes).forEach(([k,v])=>{const id=c.id+'.'+k,w=p.g.localToWorld(v.clone());E.bornes[id]=w;
      const h=new THREE.Mesh(new THREE.SphereGeometry(1.2,10,8),semContorno(new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false})));
      h.position.copy(w);h.userData.t=id;E.scene.add(h);E.hits.push(h)})});
}
/* tamanho do canvas acompanha a largura da bancada (4:3, até 520 px de altura) */
function dimensiona(){const w=Math.max(260,Math.round(E.no.clientWidth||E.no.parentElement&&E.no.parentElement.clientWidth||340)),h=Math.round(Math.min(w*.78,520));
  if(w===E.tamanho[0]&&h===E.tamanho[1])return false;E.tamanho=[w,h];E.renderer.setSize(w,h);E.camera.aspect=w/h;E.camera.updateProjectionMatrix();return true}

/* ---------- desenho sob demanda: só há laço enquanto alguma animação está rodando ---------- */
function pede(){if(E&&!E.pedido)E.pedido=requestAnimationFrame(quadro)}
function quadro(t){if(!E)return;E.pedido=0;const agora=performance.now();
  E.anim=E.anim.filter(a=>{const k=Math.min(1,(agora-a.t0)/a.dur);a.passo(k,agora);return k<1});
  E.efeito.render(E.scene,E.camera);if(E.anim.length)pede()}
const anima=(dur,passo)=>{if(reduz()){passo(1,performance.now());return}E.anim.push({t0:performance.now(),dur,passo});pede()};

/* ---------- fios: tubo sobre curva Catmull-Rom com barriga para baixo e para a frente ---------- */
function curvaFio(a,b){const d=a.distanceTo(b),sag=1+d*.16;
  const m=a.clone().add(b).multiplyScalar(.5).add(new THREE.Vector3(0,-sag,2.4+d*.04));
  return new THREE.CatmullRomCurve3([a,a.clone().add(new THREE.Vector3(0,0,1.3)),m,b.clone().add(new THREE.Vector3(0,0,1.3)),b],false,'catmullrom',.5)}
function materialFio(cor,comp){if(cor==='terra'){const t=texturaTerra();t.repeat.set(Math.max(2,Math.round(comp*1.2)),1);return toon(0xffffff,{map:t})}return toon(COR3D[cor]||COR3D.fase)}
function malhaFio(a,b,cor){const cur=curvaFio(a,b),geo=new THREE.TubeGeometry(cur,56,.26,10,false);return new THREE.Mesh(geo,materialFio(cor,cur.getLength()))}
function limpa(m){E.scene.remove(m);m.geometry.dispose();const mt=m.material;if(mt.map)mt.map.dispose();mt.dispose()}
function desenhaFios(st){
  const ass=st.wires.map(w=>w.a+'>'+w.b+':'+(w.cor||'')).join('|');if(ass===E.assinaturaFios)return;E.assinaturaFios=ass;
  E.fios.forEach(f=>{E.hits.splice(E.hits.indexOf(f),1);limpa(f)});E.fios=[];
  st.wires.forEach((w,i)=>{const a=E.bornes[w.a],b=E.bornes[w.b];if(!a||!b)return;const m=malhaFio(a,b,w.cor||'fase');m.userData.w=i;E.scene.add(m);E.fios.push(m);E.hits.push(m)});
}
/* curto: os fios do caminho piscam em vermelho e a faísca estala onde o curto fechou */
function animaCurto(curto){
  const ms=E.fios.filter(f=>curto.fios.includes(f.userData.w));const t0=performance.now();E.curtoAte=t0+1400;
  const onde=curto.onde&&(E.bornes[curto.onde]||(E.pecas[curto.onde.split('.')[0]]&&E.pecas[curto.onde.split('.')[0]].g.position));
  if(onde){E.faisca.position.copy(onde).add(new THREE.Vector3(0,0,1.2));E.faisca.visible=true}
  ms.forEach(m=>{m.material.emissive=new THREE.Color(0xff2a10)});
  anima(1400,k=>{const on=Math.floor(k*9)%2===0&&k<1;ms.forEach(m=>{if(m.material)m.material.emissiveIntensity=on?1:.15});
    E.faisca.scale.setScalar(on?4+Math.random()*4:1.5);E.faisca.material.opacity=1-k;if(k>=1){E.faisca.visible=false;ms.forEach(m=>{if(m.material)m.material.emissiveIntensity=0})}});
}

function atualizar(ctx){
  if(!E)return;E.ctx=ctx;const st=ctx.st,res=ctx.res||{lamp:{}};
  st.comps.forEach(c=>{const p=E.pecas[c.id];if(!p)return;
    if(c.type==='fuse'){const alvo=c.trip?.5:-.5;if(p.ang!==alvo){const de=p.extra.pino.rotation.x;p.ang=alvo;anima(180,k=>{p.extra.pino.rotation.x=de+(alvo-de)*k})}else p.extra.pino.rotation.x=alvo}
    if(c.type==='src'){p.extra.led.material.color.setHex(c.trip?0xe24c3f:0x43b05c);p.extra.led.material.emissive.setHex(c.trip?0x7a1d12:0x1f7a36);
      atualizaVisor(p,c.trip?'PROT':(typeof rede==='function'?rede().V:220)+' V~')}
    if(c.type==='lamp'){const b=Math.max(0,Math.min(1,res.lamp[c.id]||0));p.brilho=b;
      p.extra.bulbo.material.color.setHex(b>.04?0xfff2a8:0x5a6b7d);p.extra.bulbo.material.emissive.setRGB(1*b,.85*b,.3*b);
      p.extra.brilho.visible=b>.04;p.extra.brilho.material.opacity=b;p.extra.brilho.scale.setScalar(5+5*b)}});
  desenhaFios(st);
  const sb=ctx.sel&&E.bornes[ctx.sel];E.sel.visible=!!sb;if(sb)E.sel.position.copy(sb).add(new THREE.Vector3(0,0,.3));
  if(ctx.curto&&ctx.curto.fios)animaCurto(ctx.curto);
  dimensiona();pede();
}
function atualizaVisor(p,txt){if(p.visorTxt===txt)return;p.visorTxt=txt;const v=p.extra.visor,cv=v.material.map.image,g=cv.getContext('2d');
  g.clearRect(0,0,cv.width,cv.height);g.fillStyle='#1c240e';g.font='900 '+Math.round(cv.height*.62)+'px Nunito, system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,cv.width/2,cv.height/2+2);v.material.map.needsUpdate=true}

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
    const q=pontoNoPlano(ev.clientX,ev.clientY);if(!q)return;if(E.fioTmp)limpa(E.fioTmp);E.fioTmp=malhaFio(E.bornes[alvo.t],q,E.ctx.cor||'fase');E.scene.add(E.fioTmp);pede()};
  const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    if(E&&E.fioTmp){limpa(E.fioTmp);E.fioTmp=null;pede()}
    if(ev.type==='pointercancel')return;
    if(arrastando){const fim=alvoEm(ev.clientX,ev.clientY);ctl.arrastouFio(alvo.t,fim&&fim.t||null);return}
    if(alvo.t){if(ed)ctl.tocouBorne(alvo.t)}
    else if(alvo.peca)ctl.acionou(alvo.peca,0);
    else if(alvo.w!==undefined&&ed)ctl.tirouFio(alvo.w)};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}

function destruir(){if(!E)return;
  if(E.pedido)cancelAnimationFrame(E.pedido);E.ro.disconnect();E.no.removeEventListener('pointerdown',aoTocar,true);E.controls.dispose();
  E.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();const m=o.material;if(m){(Array.isArray(m)?m:[m]).forEach(x=>{if(x.map)x.map.dispose();x.dispose()})}});
  E.renderer.dispose();try{E.renderer.forceContextLoss()}catch(e){}E.cv.remove();E=null}

/* ---------- inspeção para os testes (posições na tela, brilho, alavanca, curto) ---------- */
function naTela(v){const r=E.cv.getBoundingClientRect();E.camera.updateMatrixWorld();const p=v.clone().project(E.camera);return {x:r.left+(p.x+1)/2*r.width,y:r.top+(1-p.y)/2*r.height}}
const debug={
  gl:()=>!!(E&&E.renderer.getContext()),
  contagem:()=>{let n=0;E&&E.scene.traverse(o=>{if(o.isMesh)n++});return n},
  tela:id=>E.bornes[id]?naTela(E.bornes[id]):naTela(E.pecas[id].corpo[0].getWorldPosition(new THREE.Vector3())),
  telaFio:i=>{const f=E.fios.find(m=>m.userData.w===i);const c=f.geometry.parameters.path.getPoint(.5);return naTela(c)},
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
