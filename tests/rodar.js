#!/usr/bin/env node
/* Roda os testes do Volt Up no Chrome sem janela (headless) e confere os resultados.
   Uso:  node tests/rodar.js
   Precisa só do Node e do Google Chrome. Para indicar outro Chrome: CHROME=/caminho/do/chrome
   Sai com código 1 se algum teste falhar (é isso que o GitHub Actions usa). */
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');

const RAIZ=path.resolve(__dirname,'..');
const TIPOS={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};

function acharChrome(){
  if(process.env.CHROME)return process.env.CHROME;
  const cands=process.platform==='win32'
    ?['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',path.join(process.env.LOCALAPPDATA||'','Google\\Chrome\\Application\\chrome.exe')]
    :process.platform==='darwin'?['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    :['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'];
  const c=cands.find(f=>{try{return fs.statSync(f).isFile()}catch{return false}});
  if(!c)throw new Error('Chrome não encontrado. Defina a variável CHROME com o caminho do executável.');
  return c;
}

function servidor(){return new Promise(ok=>{
  const s=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';
    const f=path.join(RAIZ,p);if(!f.startsWith(RAIZ)){r.writeHead(403);return r.end()}
    fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':TIPOS[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});r.end(d)})});
  s.listen(0,'127.0.0.1',()=>ok(s));
})}

function abrir(chrome,url){return new Promise((ok,falha)=>{
  const perfil=fs.mkdtempSync(path.join(os.tmpdir(),'voltup-teste-'));
  const args=['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--user-data-dir='+perfil,'--virtual-time-budget=20000','--dump-dom',url];
  if(process.env.CI||process.platform==='linux')args.unshift('--no-sandbox');
  const p=spawn(chrome,args,{stdio:['ignore','pipe','ignore']});let html='';
  const t=setTimeout(()=>{p.kill();falha(new Error('Chrome demorou demais em '+url))},90000);
  p.stdout.on('data',d=>html+=d);
  p.on('close',()=>{clearTimeout(t);try{fs.rmSync(perfil,{recursive:true,force:true})}catch{}
    const m=html.match(/<pre id="out">([\s\S]*?)<\/pre>/);
    if(!m)return falha(new Error('A página não devolveu resultado: '+url));
    const txt=m[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
    try{ok(JSON.parse(txt))}catch{falha(new Error('Resultado não é JSON em '+url+': '+txt.slice(0,300)))}});
})}

const falhas=[];let total=0;
const confere=(ok,nome,detalhe)=>{total++;if(!ok)falhas.push(nome+(detalhe?' → '+detalhe:''))};
/* Erros que o jogo aceita de propósito: o three-way funciona com os retornos trocados. */
const ERROS_QUE_FUNCIONAM=new Set(['escada_retornoTrocado']);

(async()=>{
  const chrome=acharChrome(),srv=await servidor(),base='http://127.0.0.1:'+srv.address().port;
  try{
    const t=await abrir(chrome,base+'/tests/testes.html');
    confere(!t.ERRO,'página de testes sem exceção',t.ERRO);
    for(const[k,v]of Object.entries(t.gabaritos||{}))confere(v==='OK','gabarito '+k,v);
    confere(Object.keys(t.gabaritos||{}).length>=27,'pelo menos 27 gabaritos',Object.keys(t.gabaritos||{}).length+' encontrados');
    for(const[k,v]of Object.entries(t.erros||{}))confere(ERROS_QUE_FUNCIONAM.has(k)?v==='OK':v!=='OK','erro comum detectado: '+k,v);
    for(const[k,v]of Object.entries(t.previsao||{}))confere(v==='girando → parado','previsão '+k,v);
    for(const[k,v]of Object.entries(t.quizzes||{}))confere(v==='3q/333','quiz '+k,v);
    const p=t.pistas||{};
    confere(p.perguntas>0&&p.certaMaisLonga/p.perguntas<=1/3,'certa não é a mais longa além do acaso (≤ 33 %)',p.certaMaisLonga+' de '+p.perguntas);
    confere(p.absolutaSoNasErradas<=Math.max(4,p.absolutaNaCerta+3),'palavras absolutas não denunciam as erradas',JSON.stringify(p));
    confere((t.faltando||[]).length===0,'cenas, personagens e ícones existem',(t.faltando||[]).join(', '));
    confere(/Bloqueado/.test(t.cap2_semCap1||''),'capítulo 2 travado sem o 1',t.cap2_semCap1);
    confere(/\d+ fases/.test(t.cap2_comCap1||''),'capítulo 2 abre depois do 1',t.cap2_comCap1);
    confere(/Bloqueado/.test(t.cap3_semCap2||''),'capítulo 3 travado sem o 2',t.cap3_semCap2);

    const r=await abrir(chrome,base+'/tests/render.html');
    confere(r.total>=70,'telas de bancada desenhadas',r.total+' telas');
    confere((r.problemas||[]).length===0,'todas as telas têm bornes',JSON.stringify(r.problemas));
    confere(/^\d+ bornes$/.test(r.oficina||''),'oficina com todas as peças',r.oficina);

    console.log('Pistas do quiz: '+JSON.stringify(p));
  }catch(e){falhas.push(e.message)}finally{srv.close()}
  if(falhas.length){console.error('\n✗ '+falhas.length+' de '+total+' verificações falharam:\n  - '+falhas.join('\n  - '));process.exit(1)}
  console.log('✓ '+total+' verificações passaram.');
})();
