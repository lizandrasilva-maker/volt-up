#!/usr/bin/env node
/* Roda os testes do Volt Up no Chrome sem janela (headless) e confere os resultados.
   Uso:  node tests/rodar.js [--relatorio arquivo.md]
   Precisa só do Node e do Google Chrome. Para indicar outro Chrome: CHROME=/caminho/do/chrome
   Sai com código 1 se alguma verificação falhar (é isso que bloqueia o PR no GitHub).
   No GitHub Actions, o relatório também vai para o resumo da execução (GITHUB_STEP_SUMMARY). */
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');

const RAIZ=path.resolve(__dirname,'..');
const TIPOS={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
const iRel=process.argv.indexOf('--relatorio'),ARQ_REL=iRel>0?process.argv[iRel+1]:null;

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

/* Cada verificação entra numa categoria, para o relatório mostrar o que foi coberto. */
const CAT={},falhas=[];
const confere=(cat,ok,nome,detalhe)=>{(CAT[cat]=CAT[cat]||{ok:0,total:0}).total++;if(ok)CAT[cat].ok++;else falhas.push('['+cat+'] '+nome+(detalhe?' → '+detalhe:''))};
/* Erros que o jogo aceita de propósito: o three-way funciona com os retornos trocados. */
const ERROS_QUE_FUNCIONAM=new Set(['escada_retornoTrocado']);
let pistas={};

(async()=>{
  const chrome=acharChrome(),srv=await servidor(),base='http://127.0.0.1:'+srv.address().port;
  try{
    const t=await abrir(chrome,base+'/tests/testes.html');
    confere('Execução',!t.ERRO,'página de testes sem exceção',t.ERRO);
    const G=Object.entries(t.gabaritos||{});
    for(const[k,v]of G)confere('Gabaritos de bancada',v==='OK',k,v);
    confere('Gabaritos de bancada',G.length>=27,'pelo menos 27 gabaritos',G.length+' encontrados');
    const E=Object.entries(t.erros||{});
    for(const[k,v]of E)confere('Erros comuns de montagem',ERROS_QUE_FUNCIONAM.has(k)?v==='OK':v!=='OK',k,v);
    confere('Erros comuns de montagem',E.length>=11,'pelo menos 11 erros comuns',E.length+' encontrados');
    for(const[k,v]of Object.entries(t.previsao||{}))confere('Previsões',v==='girando → parado',k,v);
    for(const[k,v]of Object.entries(t.quizzes||{}))confere('Estrutura dos quizzes',v==='3q/333',k,v);
    const p=pistas=t.pistas||{};
    confere('Pistas nos quizzes',p.perguntas===72,'72 perguntas de quiz',p.perguntas+' encontradas');
    confere('Pistas nos quizzes',p.certaMaisLonga/p.perguntas<=1/3,'certa não é a mais longa além do acaso (≤ 33 %)',p.certaMaisLonga+' de '+p.perguntas);
    confere('Pistas nos quizzes',p.absolutaSoNasErradas<=Math.max(4,p.absolutaNaCerta+3),'palavras absolutas não denunciam as erradas',p.absolutaSoNasErradas+' só nas erradas, '+p.absolutaNaCerta+' na certa');
    confere('Pistas nos quizzes',p.ecoDoEnunciado/p.perguntas<=0.10,'certa não é a única a repetir o enunciado (≤ 10 %)',p.ecoDoEnunciado+' de '+p.perguntas);
    confere('Pistas nos quizzes',p.soCertaJustifica<=3,'certa não é a única com justificativa (≤ 3)',String(p.soCertaJustifica));
    confere('Pistas nos quizzes',!p.numericas||p.certaNoMeio/p.numericas<=0.5,'numéricas: certa não é sempre o valor do meio (≤ 50 %)',p.certaNoMeio+' de '+p.numericas);
    confere('Cenas e personagens',(t.faltando||[]).length===0,'cenas, personagens e ícones existem',(t.faltando||[]).join(', '));
    /* Privacidade: a política existe, tem as seções obrigatórias e está ligada nas telas de entrada */
    /* Menu do usuário: a tela depois do login */
    const mn=t.menu||{};
    confere('Menu do usuário',JSON.stringify(mn.cards)===JSON.stringify(['mHist','mPerfil','mConq','mOfi','mCalc','mPlano','mConfig']),'menu com história, perfil, conquistas, oficina, calculadora, plano e configurações',JSON.stringify(mn.cards));
    confere('Menu do usuário',mn.calcDesligada===true,'calculadora aparece como "em breve" (desligada)');
    confere('Menu do usuário',mn.mapaTemVoltar===true,'mapa tem botão para o menu e não tem mais o "Mais opções"');
    confere('Menu do usuário',mn.perfilMelhorar===2,'perfil mostra 2 competências a melhorar',String(mn.perfilMelhorar));
    confere('Menu do usuário',mn.conquistas>=12,'tela de conquistas mostra as medalhas',String(mn.conquistas));
    confere('Menu do usuário',mn.planoSemConta==='Sem conta','plano sem login avisa que o progresso fica no aparelho',mn.planoSemConta);
    confere('Menu do usuário',mn.planoValidador==='Validação','conta de validação aparece como tudo liberado',mn.planoValidador);
    confere('Menu do usuário',mn.voltouAoMenu===true,'configurações voltam ao menu');
    confere('Menu do usuário',mn.semPersonagem===true,'primeira entrada pede o personagem antes do menu');
    confere('Menu do usuário',/location\.replace\('login\.html'\)/.test(fs.readFileSync(path.join(RAIZ,'js/main.js'),'utf8')),'sem login, o jogo abre a tela de login');
    confere('Privacidade',mn.politica===true,'menu tem link para a política');
    confere('Privacidade',mn.configPolitica===true,'configurações têm link para a política');
    const ler=f=>{try{return fs.readFileSync(path.join(RAIZ,f),'utf8')}catch{return ''}};
    const pol=ler('politica-privacidade.html');
    for(const s of ['Quem cuida dos seus dados','Que dados tratamos','Para que usamos','Crianças e adolescentes','Com quem compartilhamos','Por quanto tempo','Seus direitos','Como protegemos'])
      confere('Privacidade',pol.includes(s),'política tem a seção "'+s+'"');
    confere('Privacidade',/politica-privacidade\.html/.test(ler('login.html')),'login e cadastro levam à política');
    confere('Privacidade',/politica-privacidade\.html/.test(ler('admin.html')),'painel de administração leva à política');
    confere('Trava de capítulos',/Bloqueado/.test(t.cap2_semCap1||''),'capítulo 2 travado sem o 1',t.cap2_semCap1);
    confere('Trava de capítulos',/\d+ fases/.test(t.cap2_comCap1||''),'capítulo 2 abre depois do 1',t.cap2_comCap1);
    confere('Trava de capítulos',/Bloqueado/.test(t.cap3_semCap2||''),'capítulo 3 travado sem o 2',t.cap3_semCap2);

    const r=await abrir(chrome,base+'/tests/render.html');
    confere('Telas de bancada (desenho e aviso)',r.total>=73,'72 telas de bancada + oficina',r.total+' telas');
    confere('Telas de bancada (desenho e aviso)',(r.problemas||[]).length===0,'todas desenham bornes e mostram o aviso de modelo didático',JSON.stringify(r.problemas));
    confere('Telas de bancada (desenho e aviso)',/^\d+ bornes$/.test(r.oficina||''),'oficina com todas as peças e o aviso',r.oficina);
  }catch(e){falhas.push('[Execução] '+e.message)}finally{srv.close()}

  const total=Object.values(CAT).reduce((s,c)=>s+c.total,0);
  const linhas=['## Testes do Volt Up','',
    '| Categoria | Passaram | Total |','|---|---:|---:|',
    ...Object.entries(CAT).map(([c,v])=>'| '+c+' | '+v.ok+' | '+v.total+' |'),
    '','Pistas do quiz: `'+JSON.stringify(pistas)+'`','',
    falhas.length?'**✗ '+falhas.length+' de '+total+' verificações falharam:**\n\n- '+falhas.join('\n- '):'**✓ '+total+' verificações passaram.**',''];
  const rel=linhas.join('\n');
  console.log(rel);
  if(ARQ_REL)fs.writeFileSync(ARQ_REL,rel,'utf8');
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,rel+'\n');
  process.exit(falhas.length?1:0);
})();
