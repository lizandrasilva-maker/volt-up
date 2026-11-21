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
    confere('Menu do usuário',mn.calcAbre===true,'card da calculadora abre o caderno de contas');
    /* Cálculo com valores reais (Etapa 3): resultados batem com contas feitas à mão */
    const k=t.calc||{};
    confere('Cálculo com valores reais',k.chuveiro===true,'chuveiro de 5500 W em 220 V → 25 A');
    confere('Cálculo com valores reais',k.potencia===true&&k.resistencia===true,'P = U × I (220 V × 10 A = 2200 W) e R = U ÷ I (220 V ÷ 25 A = 8,8 Ω)');
    confere('Cálculo com valores reais',k.quedaV===2.58&&k.quedaOk===true,'cabo de 4 mm², 10 A, 30 m → 2,58 V (dentro de 4 %)',k.quedaV+' V');
    confere('Cálculo com valores reais',k.quedaLonga===14.4&&k.quedaLongaOk===false,'1,5 mm², 20 A, 40 m em 127 V → 14,4 %: acima do limite',k.quedaLonga+' %');
    confere('Cálculo com valores reais',k.kwh===82.5&&k.custo===70.13,'5500 W, 30 min por dia, 30 dias → 82,5 kWh; a R$ 0,85 → R$ 70,13',k.kwh+' kWh / R$ '+k.custo);
    confere('Cálculo com valores reais',JSON.stringify(k.dj)==='[20,true,25,false,null]','disjuntor: Ib 18 A e Iz 24 A → 20 A; Ib 25 A passa do Iz; acima de 63 A não há padrão',JSON.stringify(k.dj));
    confere('Cálculo com valores reais',k.invalidos===true,'entradas impossíveis (tensão 0, seção 0, 30 h por dia) não geram resultado');
    confere('Cálculo com valores reais',k.telaQueda==='2,58 V · 1,17 %'&&k.telaQueda20==='5,16 V · 2,35 %','a folha mostra o resultado e atualiza ao digitar',k.telaQueda+' → '+k.telaQueda20);
    confere('Cálculo com valores reais',k.aviso===true,'aviso "não substitui projeto nem ART"');
    confere('Menu do usuário',mn.mapaTemVoltar===true,'mapa tem botão para o menu e não tem mais o "Mais opções"');
    confere('Menu do usuário',mn.perfilMelhorar===2,'perfil mostra 2 competências a melhorar',String(mn.perfilMelhorar));
    confere('Menu do usuário',mn.conquistas>=12,'tela de conquistas mostra as medalhas',String(mn.conquistas));
    confere('Menu do usuário',mn.planoSemConta==='Sem conta','plano sem login avisa que o progresso fica no aparelho',mn.planoSemConta);
    confere('Menu do usuário',mn.planoValidador==='Validação','conta de validação aparece como tudo liberado',mn.planoValidador);
    confere('Menu do usuário',mn.voltouAoMenu===true,'configurações voltam ao menu');
    confere('Menu do usuário',mn.semPersonagem===true,'primeira entrada pede o personagem antes do menu');
    confere('Menu do usuário',/location\.replace\('login\.html'\)/.test(fs.readFileSync(path.join(RAIZ,'js/main.js'),'utf8')),'sem login, o jogo abre a tela de login');
    {const c=t.curto||{};
     confere('Curto-circuito',c.fonte===true&&c.desligada===true,'sem disjuntor no caminho, a proteção da fonte desarma e tudo fica sem tensão');
     confere('Curto-circuito',c.religa===true&&c.desarmaDeNovo===true,'tocar na fonte religa; se o curto continua, desarma de novo');
     confere('Curto-circuito',c.jumper===true&&c.normal===true,'fase nos dois bornes da lâmpada sem neutro não é curto; circuito certo também não');
     confere('Curto-circuito',c.seletivo==='D1'&&c.l2acesa===true,'curto na lâmpada L1 do quadro: desarma o D1 (não o geral) e L2 continua acesa',String(c.seletivo));
     confere('Curto-circuito',c.fios>=2&&c.desenho===true&&c.desenhoDiagrama===true,'a bancada desenha a faísca e os fios incandescentes (real e diagrama)',c.fios+' fios');
     confere('Curto-circuito',c.msg===true,'mensagem explica o curto');
     confere('Curto-circuito',c.tela===true,'na bancada: ligar L1 direto no N mostra a faísca e a mensagem');
     confere('Curto-circuito',c.djLigaDesliga===true&&c.djTocavel===true,'o disjuntor liga e desliga com um toque (a lâmpada apaga e acende)');
     confere('Curto-circuito',c.verificaDesarmado===true,'"Verificar" com a proteção desarmada pede para corrigir e religar');}
    {const M=Object.entries(t.montar||{});
     confere('Modo teste',M.length>=27&&M.every(([,v])=>v==='aprovou'),'"Montar pra mim" monta e já aprova em todas as fases de montar (3 níveis)',M.filter(([,v])=>v!=='aprovou').map(([k,v])=>k+': '+v).join('; ')||M.length+' fases');}
    confere('Menu do usuário',JSON.stringify(t.ceu)==='["cap2","cap1","cap3"]','céu acompanha o capítulo (mapa e fase)',JSON.stringify(t.ceu));
    {const css=fs.readFileSync(path.join(RAIZ,'css/estilo.css'),'utf8');
     confere('Menu do usuário',/@media \(prefers-reduced-motion:reduce\)\{\*\{animation:none!important;transition:none!important\}\}/.test(css),'"movimento reduzido" desliga animações e transições');}
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
    confere('Telas de bancada (desenho e aviso)',/^\d+ bornes$/.test(r.oficina||''),'oficina com todas as peças e o aviso (diagrama)',r.oficina);
    confere('Telas de bancada (desenho e aviso)',/^\d+ bornes$/.test(r.oficinaReal||''),'oficina com todas as peças e o aviso (vista real)',r.oficinaReal);
    /* Fonte e aterramento: a fonte não tem PE; o terra vem da haste pelo BEP */
    const fa=t.fonte||{};
    confere('Fonte e aterramento',fa.bornes1F==='2 bornes'&&fa.bornes3F==='4 bornes','fonte 1F+N tem 2 bornes e 3F+N tem 4 (sem PE)',fa.bornes1F+' / '+fa.bornes3F);
    confere('Fonte e aterramento',fa.lampadaFN===true,'lâmpada entre L1 e N acende');
    confere('Fonte e aterramento',fa.lampadaEntreFases===true,'lâmpada entre duas fases também acende (tensões defasadas)');
    confere('Fonte e aterramento',fa.medeFN===220&&fa.medeFF===381,'multímetro: 220 V entre fase e neutro e 381 V entre fases',fa.medeFN+' V / '+fa.medeFF+' V');
    confere('Fonte e aterramento',fa.curtoFaseHaste===true,'fase ligada direto na haste é curto-circuito');
    confere('Fonte e aterramento',/haste/i.test(fa.bepSemHaste||''),'motor no BEP sem a haste: avisa que falta ligar a haste',fa.bepSemHaste);
    confere('Fonte e aterramento',/BEP/.test(fa.motorDiretoNaHaste||''),'motor ligado direto na haste: avisa que o PE sai do BEP',fa.motorDiretoNaHaste);
    confere('Fonte e aterramento',/neutro/i.test(fa.neutroNoBEP||''),'neutro unido ao BEP é recusado',fa.neutroNoBEP);
    confere('Fonte e aterramento',fa.drComHaste===true&&fa.drSemHaste===false,'fuga para a massa: o DR atua com a haste e não atua sem ela',fa.drComHaste+' / '+fa.drSemHaste);
    confere('Fonte e aterramento',fa.oficinaTiraFio===true,'na Oficina, reduzir de 3 para 1 fase tira os fios de L2 e L3');
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
