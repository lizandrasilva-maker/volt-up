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

/* webgl: a página precisa de WebGL (bancada 3D): troca o --disable-gpu pelo WebGL por software (SwiftShader) */
function abrir(chrome,url,webgl){return new Promise((ok,falha)=>{
  const perfil=fs.mkdtempSync(path.join(os.tmpdir(),'voltup-teste-'));
  const args=['--headless=new',...(webgl?['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:['--disable-gpu']),'--no-first-run','--no-default-browser-check','--user-data-dir='+perfil,'--virtual-time-budget=20000','--dump-dom',url];
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
    confere('Pistas nos quizzes',p.perguntas===117,'117 perguntas (quizzes e fim das aulas)',p.perguntas+' encontradas');
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
     confere('Curto-circuito',c.dgDesliga===true,'Quadro Novo: tocar na alavanca do DG desliga o disjuntor geral');
     confere('Telas de bancada (desenho e aviso)',c.zoom===true,'zoom: "−" apagado com a bancada inteira; "+" amplia e "−" volta ao tamanho normal');
     confere('Curto-circuito',c.verificaDesarmado===true,'"Verificar" com a proteção desarmada pede para corrigir e religar');}
    {const k=t.cc||{},J=JSON.stringify;
     confere('Corrente contínua (Pilha e Lanterna)',J(k.serie)==='[2.88,0.288]','2 pilhas em série na lâmpada: 3 V ÷ 10,4 Ω → 0,288 A e 2,88 V',J(k.serie));
     confere('Corrente contínua (Pilha e Lanterna)',J(k.umaPilha)==='[1.47,true]'&&k.paralelo&&k.paralelo[1]===true&&Math.abs(k.paralelo[0]-1.49)<0.02,'1 pilha (1,47 V) e pilhas em paralelo (~1,49 V): lâmpada fraca',J(k.umaPilha)+' '+J(k.paralelo));
     confere('Corrente contínua (Pilha e Lanterna)',J(k.invertida)==='[true,"P1"]'||J(k.invertida)==='[true,"P2"]','pilha invertida: tensões se anulam e o jogo aponta a pilha virada',J(k.invertida));
     confere('Corrente contínua (Pilha e Lanterna)',J(k.tres)==='[4.25,true]','3 pilhas em série: 4,5 V × 10 ÷ 10,6 Ω ≈ 4,25 V na lâmpada de 3 V → queima',J(k.tres));
     confere('Corrente contínua (Pilha e Lanterna)',J(k.curto)==='[true,7.5]','fio direto na pilha: curto de 7,5 A (1,5 V ÷ 0,2 Ω)',J(k.curto));
     confere('Corrente contínua (Pilha e Lanterna)',J(k.etapas)==='[true,true,true,true]','retorno em etapas (pista → explicação) e com linguagem diferente por nível',J(k.etapas));
     confere('Corrente contínua (Pilha e Lanterna)',k.troca===true&&k.tela===true,'lâmpada queimada troca com um toque; bancada CC sem a faixa do poste, com aviso do modelo e fios + e −');
     confere('Corrente contínua (Pilha e Lanterna)',k.ordemCap1==='energia,renovavel,carga,macaneta,condutor,continuidade,grandezas,lanterna','Capítulo 1 só de CC, alternando aula e prática (Ato 1)',k.ordemCap1);}
    {const c=t.contrato||{};
     confere('Contrato da bancada (2D/3D)',c.svgLiga===1&&c.svgTira===0,'SVG: toque-toque liga o fio e tocar no fio tira (pelas intenções)');
     confere('Contrato da bancada (2D/3D)',c.semSvg===true,'com a vista 3D ligada, o centro da bancada vira a vaga do canvas (sem SVG)');
     confere('Contrato da bancada (2D/3D)',c.fios3d==='B.0-F.0:fase,F.1-S1.0:fase'&&c.djDesligou===true&&c.tirou===1,'as intenções da vista 3D mudam o st igual ao SVG (ligar, arrastar, acionar, tirar)',c.fios3d);
     confere('Contrato da bancada (2D/3D)',c.mesmoCanvas===true&&c.montagens===1&&c.atualizacoes>=5,'o canvas nasce uma vez e é reencaixado a cada redesenho',c.montagens+' montagem, '+c.atualizacoes+' atualizações');
     confere('Contrato da bancada (2D/3D)',c.drTeste===true,'DR: acionou(id, \'test\') desarma e não rearma; o toque no corpo rearma');
     confere('Contrato da bancada (2D/3D)',c.saiu===true&&c.destruiu===1&&c.liberou===true,'ao sair da bancada, a cena 3D é destruída uma vez');}
    {const r=t.rede||{};
     confere('Rede elétrica',r.chuveiro127===true,'em 127 V a conta do chuveiro de 5500 W dá 43 A, e o erro comum vira 25 A');
     confere('Rede elétrica',r.fonte127===true,'fonte da bancada mostra 127 V (127/220 V com 3 fases)');
     confere('Rede elétrica',r.dps127===true,'DPS em 127 V: Uc mínimo ≈ 140 V, modelo comercial de 175 V');
     confere('Rede elétrica',r.cena127===true,'as falas usam a tensão escolhida');
     confere('Rede elétrica',r.hz50===true&&r.trafo===true,'em 50 Hz a corrente troca de sentido 100 vezes por segundo; trafo em 220 V mede 380 V entre fases');
     confere('Rede elétrica',r.telaRede===true&&r.trocou===true,'tela de rede com 3 tensões e 2 frequências; tocar troca a escolha');}
    {const a=t.aula||{};
     confere('Aulas',a.lousa===true&&a.ultimo===true&&a.quiz===true,'aula mostra ilustração e fala, avança até "Testar o que aprendi" e abre as perguntas');
     confere('Aulas',Array.isArray(a.figsFaltando)&&a.figsFaltando.length===0,'toda ilustração usada nas aulas existe',(a.figsFaltando||[]).join(', '));
     confere('Aulas',a.sortFig===true&&a.sortReage===true,'Testador de Continuidade: ilustração do testador e LED reage à resposta');}
    {const m=t.multimetro||{};
     confere('Multímetro',m.temAparelho===true&&m.semLetras===true,'Caça-Defeito mostra o multímetro com as duas pontas e nenhuma letra nos parafusos');
     confere('Multímetro',m.antes==='– – –'&&m.umaPonta==='– – –','sem as duas pontas nos parafusos, o visor não mede',m.antes+' / '+m.umaPonta);
     confere('Multímetro',/^\d/.test(m.duas||'')&&m.encaixadas===2,'arrastando a vermelha e tocando no parafuso para a preta, as duas encaixam e o visor mede',m.duas+' ('+m.encaixadas+' encaixadas)');}
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
    /* Bancada 3D (Three.js, MVP): cena com WebGL e os mesmos gestos que o SVG, com o mesmo resultado */
    {const b=await abrir(chrome,base+'/tests/bancada3d.html',true),C='Bancada 3D (MVP)';
     confere(C,!b.ERRO&&b.carregou===true,'Three.js carrega sob demanda e a vista 3D registra',b.ERRO||b.erro);
     confere(C,b.canvas===true&&b.webgl===true&&b.semSvg===true&&b.malhas>=30,'cena monta no canvas WebGL no lugar do SVG',b.malhas+' malhas');
     confere(C,b.fios3d===3&&b.acesa===true,'toque-toque e arrastar fio na 3D ligam fonte → DJ → lâmpada → neutro, e a lâmpada acende');
     confere(C,b.djDesligou===true&&b.apagou===true&&b.religou===true,'tocar no disjuntor gira a alavanca: desliga (lâmpada apaga) e religa');
     confere(C,b.curto===true&&b.tirouCurto===true,'curto depois do disjuntor: DJ desarma, fios piscam e a faísca aparece; tocar no fio tira');
     confere(C,b.term3d===true,'TERM3D: cada peça tem na 3D os mesmos bornes que terms(c) no motor.js');
     confere(C,b.materiais-b.materiaisAntes<=2&&b.materiais<b.malhasAgora*0.6,'materiais em cache: 3 fios acrescentam no máximo 2 materiais (fase e neutro) e peças repetidas dividem os seus',(b.materiais-b.materiaisAntes)+' novos; '+b.materiais+' materiais / '+b.malhasAgora+' malhas');
     confere(C,b.contorno==='#070c16','contorno anime com o --contorno do jogo',b.contorno);
     confere(C,b.corFase===true&&b.corNeutro===true&&b.terraListrado===true,'cores dos fios vêm da tabela CORES do 2D; o terra é listrado nas duas cores dela');
     confere(C,b.fioFino===true&&b.ortogonal===true&&b.pistas===3,'fios finos, em ângulo reto e cada um na sua pista (legíveis como diagrama)',b.pistas+' pistas');
     confere(C,b.realce===true&&b.realceSai===true,'realce do ponto elétrico: borne selecionado deixa cheios só os fios do mesmo potencial');
     confere(C,b.faixaOn===true&&b.faixaOff===true&&b.faixaCurto===true,'caminho da energia em 3D (poste, trafo, medidor, quadro, circuito) no mesmo canvas: energia correndo quando ligado, parado quando desligado, cabos vermelhos no curto; legendas iguais às do 2D');
     confere(C,b.mesmoCanvas===true,'o mesmo canvas é reencaixado a cada redesenho (1 montagem)');
     confere(C,b.aprovou3d===true&&b.aprovouSvg===true&&b.equivalente===true&&b.svgVoltou===true,'mesmos gestos na 3D e no SVG deixam a bancada no mesmo estado',b.st3d+' / '+b.stSvg);
     {const q=b.quadro||{};
      confere(C,q.em3d===true&&q.term3d===true,'Quadro Novo (Cap. 2) abre em 3D: DR com os 4 bornes do motor.js');
      confere(C,q.acesa===true,'DG → DR (fase e neutro) → lâmpada ligados na 3D: lâmpada acesa e DR armado (visor verde)');
      confere(C,q.teste===true&&q.testeNaoRearma===true&&q.rearmou===true,"botão T do DR: desarma (alavancas acopladas caem, visor vermelho) e não rearma; tocar no DR rearma");
      confere(C,q.fuga===true&&q.semFuga===true,'neutro voltando por fora do DR: o DR desarma sozinho por fuga; tirar o fio e rearmar resolve');
      confere(C,q.aprovou3d===true&&q.aprovouSvg===true&&q.equivalente===true,'Quadro Novo: mesmos gestos na 3D e no SVG, mesmo estado e aprovação',q.s3+' / '+q.ss);}
     {const t=b.botoeiras||{};
      confere(C,t.em3d===true&&t.term3d===true,'Botoeiras 3D abrem em 3D: BL e BD com os 2 bornes do motor.js');
      confere(C,t.plaquetas===true&&t.nomes2D===true,'plaquetas dos bornes: mesmo nome do 2D (BL 3-4, BD 1-2), inclinadas para a câmera e com altura legível');
      confere(C,!!t.badgeToque&&t.badgeToque.visivel&&t.badgeToque.texto==='BL · 4'&&!!t.badgeArraste&&t.badgeArraste.texto==='BL · 4 → L1 · X1'&&t.badgeSoltou&&t.badgeSoltou.visivel===false,'badge acima do dedo: mostra o borne no toque e origem → alvo no arraste; some ao soltar',JSON.stringify([t.badgeToque,t.badgeArraste]));
      confere(C,t.apagada===true&&t.apertouBL===true&&t.soltouBL===true,'apertar BL: c.pressed afunda o êmbolo e acende L1; depois dos 700 ms ele volta e L1 apaga');
      confere(C,t.bdCorta===true&&t.soltaram===true,'BL e BD apertados juntos: o NF corta e L1 fica apagada');
      confere(C,t.aprovou3d===true&&t.aprovouSvg===true&&t.svgApertou===true&&t.equivalente===true,'Botoeiras: mesmos gestos na 3D e no SVG, mesmo estado e aprovação',t.s3+' / '+t.ss);}
     {const v=b.v360||{};
      confere(C,v.botaoSemFlag===true&&v.abriu===true,'botão 🧊 3D aparece sem ?3d=1 nas bancadas compatíveis e abre a mesma instalação em 3D');
      confere(C,v.livre===true&&v.montaLivre===true,'360° sempre ligado: câmera livre desde o início, sem botão de modo, e montar continua funcionando');}
     {const t=b['traçado']||{};
      confere(C,t.primeiro===true&&t.quadro===true&&t.partida===true,'fios não passam por trás de peça que não é deles (Primeiro Circuito, Quadro Novo, Partida Direta)',JSON.stringify(t));}
     {const k=b.contatora||{};
      confere(C,k.em3d===true&&k.term3d===true&&k.plaquetas===true,'contatora (A1 A2 1 2 13 14) e relé térmico (1 2 95 96) em 3D com os bornes e nomes do motor.js e do 2D');
      confere(C,k.fios===true&&k.liga===true&&k.selo===true&&k.desliga===true,'comando: LIGA energiza a bobina (êmbolo recua laranja), o selo 13-14 segura, DESLIGA derruba');
      confere(C,k.termico===true&&k.rearme===true,'relé térmico: tocar simula a sobrecarga (95-96 abre, visor vermelho, bobina cai); tocar de novo rearma');
      confere(C,k.aprovou3d===true&&k.aprovouSvg===true&&k.equivalente===true,'Contatora 3D: mesmos gestos na 3D e no SVG, mesmo estado e aprovação',k.s3+' / '+k.ss);}
     {const s=b.interruptor||{};
      confere(C,s.em3d===true&&s.term3d===true&&s.plaquetas===true,'interruptor simples em 3D: bornes L e R iguais ao motor.js e ao 2D; Primeiro Circuito abre em 3D');
      confere(C,s.desligado===true&&s.liga===true&&s.desliga===true,'tocar no interruptor inclina a tecla (c.closed) e liga e desliga a lâmpada');
      confere(C,s.aprovou3d===true&&s.aprovouSvg===true&&s.equivalente===true,'Primeiro Circuito: mesmos gestos na 3D e no SVG, mesmo estado e aprovação',s.s3+' / '+s.ss);
      confere(C,s.paralelo===true,'Série ou Paralelo abre em 3D nos 3 níveis');}
     {const m=b.partida||{};
      confere(C,m.em3d===true&&m.term3d===true&&m.plaquetas===true&&m.niveis===true,'Partida Direta (Cap. 3) abre em 3D nos 3 níveis: motor (1 2 ⏚), BEP e haste com os bornes do motor.js');
      confere(C,m.fios===true&&m.gira===true&&m.selo===true&&m.para===true,'gabarito montado na 3D: LIGA faz o eixo girar, o selo mantém, DESLIGA para');
      confere(C,m.aprovou3d===true&&m.giraAprovado===true&&m.aprovouSvg===true&&m.equivalente===true,'Partida Direta: mesmos gestos na 3D e no SVG, mesmo estado e aprovação (motor girando no fim)',m.s3+' / '+m.ss);}
     {const x=b.caixa||{};
      confere(C,x.em3d===true&&x.term3d===true&&x.plaquetas===true&&x.niveis===true,"Caixa d'Água (Cap. 3) abre em 3D nos 3 níveis: boia de nível com os bornes 1 e 2 do motor.js e do 2D");
      confere(C,x.vaziaLiga===true&&x.encheu===true&&x.esvaziou===true,'boia: caixa vazia liga a bomba; tocar enche (água sobe, pera flutua, bomba para); tocar de novo esvazia e a bomba volta');
      confere(C,x.aprovou3d===true&&x.aprovouSvg===true&&x.equivalente===true,"Caixa d'Água: mesmos gestos na 3D e no SVG, mesmo estado e aprovação",x.s3+' / '+x.ss);}
     {const e=b.extras||{};
      confere(C,Array.isArray(e.wagos)&&e.wagos.length>0&&JSON.stringify(e.wagos)===JSON.stringify(e.wagosEsperados),'conector Wago em toda emenda (2 ou mais fios no mesmo borne), com uma alavanca por fio e mais uma para o borne',JSON.stringify(e.wagos));
      confere(C,e.seletor===true&&e.tres===true&&e.ligouL2===true&&e.volta1===true,'fonte: tocar abre o seletor 1F/2F/3F+N; 3F+N cria L2 e L3 (plaquetas L1 N L2 L3); voltar a 1F+N tira os fios de L2/L3');
      confere(C,e.reenquadra===true,'dois toques rápidos no espaço vazio devolvem a câmera ao enquadramento da bancada');}
     {const z=b.zoom||{};
      confere(C,z.roda===true&&z.rodaFixa===true,'roda do mouse sobre um parafuso perto da borda: aproxima e o parafuso fica no mesmo lugar da tela',z.desvioRoda+' px');
      confere(C,z.pinca===true&&z.pincaSemFio===true,'pinça começando em cima de um parafuso: aproxima na direção dos dedos e não cria fio',z.desvioPinca+' px');}
     confere(C,b.padrao3d===true&&b.lembra2d===true,'a montagem abre em 3D por padrão; quem escolhe 2D fica no 2D neste aparelho');
     {const g=b.girar||{};
      confere(C,g.arrastoGira===true&&g.toqueAciona===true,'arrastar começando em cima de uma peça gira a vista (não aciona); o toque parado continua acionando');
      confere(C,g.botao===true&&g.ligou===true&&g.semMontar===true&&g.voltaMontar===true,'botão 🔄 Girar: com ele ligado nenhum toque monta nem aciona; desligado, a montagem volta');}
     {const pc=b.pontos||{};
      confere(C,pc.inicio===true&&pc.completo===true&&pc.sobra===true,'pontos de conexão: cada borne do circuito tem anel e contador ligados/esperados (0/1 → verde ao completar, laranja com fio a mais)');
      confere(C,pc.fullSoAnel===true,'no nível full os pontos aparecem só com o anel, sem o número de condutores');}
     {const l=b.loteC||{};
      for(const [nome,o] of [['Escada',l.escada||{}],['Corredor',l.corredor||{}]]){
        confere(C,o.em3d===true&&o.term3d===true&&o.plaquetas===true&&o.niveis===true,nome+' abre em 3D nos 3 níveis, com os bornes e nomes do motor.js e do 2D');
        confere(C,o.inverte===true,nome+': cada toque em qualquer interruptor inverte a lâmpada (comando de vários pontos)');
        confere(C,o.aprovou3d===true&&o.aprovouSvg===true&&o.equivalente===true,nome+': mesmos gestos na 3D e no SVG, mesmo estado e aprovação');}}
     {const d=b.loteD||{},g=d.garagem||{},h=d.hall||{};
      confere(C,g.em3d===true&&g.term3d===true&&g.plaquetas===true&&g.niveis===true,'Garagem abre em 3D nos 3 níveis: fotocélula com os bornes L, N e C do motor.js e do 2D');
      confere(C,g.dia===true&&g.noite===true&&g.voltaDia===true,'fotocélula: de dia (sol) a luz fica apagada; tocar faz a noite (lua e estrelas) e a luz acende; tocar de novo volta o dia');
      confere(C,g.aprovou3d===true&&g.aprovouSvg===true&&g.equivalente===true,'Garagem: mesmos gestos na 3D e no SVG, mesmo estado e aprovação',g.s3+' / '+g.ss);
      confere(C,h.em3d===true&&h.term3d===true&&h.plaquetas===true&&h.niveis===true,'Hall abre em 3D nos 3 níveis: relé de impulso com A1, A2, 1 e 2 do motor.js e do 2D');
      confere(C,h.apagada===true&&h.pulso1===true&&h.segura===true&&h.pulso2===true,'relé de impulso: pulso no P1 acende (alavanca sobe, visor laranja) e a luz continua acesa ao soltar; pulso no P2 apaga');
      confere(C,h.aprovou3d===true&&h.aprovouSvg===true&&h.equivalente===true,'Hall: mesmos gestos na 3D e no SVG, mesmo estado e aprovação',h.s3+' / '+h.ss);}
     confere(C,b.liberou===true,'ao sair da bancada, o WebGL é liberado');}
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
