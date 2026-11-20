/* ================= HISTÓRIA ================= */
let _pid=0;function picSVG(src){const id='pc'+(++_pid);return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="'+id+'"><circle cx="50" cy="50" r="46"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="#f4c430"/><image href="'+src+'" x="4" y="4" width="92" height="92" clip-path="url(#'+id+')" preserveAspectRatio="xMidYMid slice"/></svg>'}
const NPC={
  chico:{nome:'Mestre Chico',svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#22324d"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#2f5d8a"/><path d="M20 92 H80" stroke="#e9eef3" stroke-width="3"/><path d="M42 78 L50 88 L58 78" fill="#244b70"/><rect x="44" y="70" width="12" height="10" fill="#a8693f"/><path d="M29 46 Q29 72 41 79 Q50 84 59 79 Q71 72 71 46Z" fill="#b97a52"/><path d="M29 52 L29 62 Q32 58 33 50Z M71 52 L71 62 Q68 58 67 50Z" fill="#c9c9c9"/><path d="M26 47 Q26 22 50 21 Q74 22 74 47 Q50 40 26 47Z" fill="#2f5d8a"/><path d="M48 44 Q72 41 88 47 Q86 52 74 51 Q60 48 50 50Z" fill="#244b70"/><circle cx="50" cy="31" r="5" fill="#f4c430"/><path d="M51 27 L48 32 L51 32 L49 36 L53 30 L50 30Z" fill="#244b70"/><path d="M33 53 Q39 50 45 53 M55 53 Q61 50 67 53" stroke="#d6d6d6" stroke-width="3.2" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="60" rx="5.6" ry="5.2" fill="#fff"/><ellipse cx="40" cy="60.6" rx="4.4" ry="4.6000000000000005" fill="#6b3f1f"/><ellipse cx="40" cy="61" rx="2.2" ry="2.6" fill="#120c0a"/><circle cx="38.4" cy="57.66" r="1.7" fill="#fff"/><circle cx="41.8" cy="62.08" r=".9" fill="#fff"/><path d="M33.5 55.4 Q40 52.199999999999996 46.8 56.199999999999996" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="60" rx="5.6" ry="5.2" fill="#fff"/><ellipse cx="60" cy="60.6" rx="4.4" ry="4.6000000000000005" fill="#6b3f1f"/><ellipse cx="60" cy="61" rx="2.2" ry="2.6" fill="#120c0a"/><circle cx="58.4" cy="57.66" r="1.7" fill="#fff"/><circle cx="61.8" cy="62.08" r=".9" fill="#fff"/><path d="M53.5 55.4 Q60 52.199999999999996 66.8 56.199999999999996" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M32 62 l-3 2 M68 62 l3 2" stroke="#8a5434" stroke-width="1.2" stroke-linecap="round"/><path d="M50 63 L48.5 69 L51 69.5" stroke="#8a5434" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M39 72.5 Q44 69 50 71 Q56 69 61 72.5 Q56 75.5 50 73.8 Q44 75.5 39 72.5Z" fill="#dcdcdc"/><path d="M46 77 Q50 78.5 54 77" stroke="#6e3a25" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>'},
  fatima:{nome:'Dona Fátima',svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#4a2a44"/><g fill="#24140e"><circle cx="27" cy="44" r="13"/><circle cx="35" cy="28" r="14"/><circle cx="50" cy="22" r="15"/><circle cx="65" cy="28" r="14"/><circle cx="73" cy="44" r="13"/><circle cx="24" cy="60" r="10"/><circle cx="76" cy="60" r="10"/><circle cx="50" cy="34" r="16"/></g><path d="M30 30 Q40 22 52 24" stroke="#5a3a2c" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#c2453b"/><g fill="#f4c430"><circle cx="30" cy="90" r="2.5"/><circle cx="44" cy="94" r="2.5"/><circle cx="58" cy="90" r="2.5"/><circle cx="72" cy="94" r="2.5"/></g><rect x="44" y="70" width="12" height="10" fill="#6e432c"/><path d="M31 46 Q31 72 42 79 Q50 83 58 79 Q69 72 69 46 Q60 38 50 38 Q40 38 31 46Z" fill="#8a5a3c"/><path d="M34 53 Q39 50.5 45 52.5 M55 52.5 Q61 50.5 66 53" stroke="#24140e" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="60" rx="5.6" ry="6.6" fill="#fff"/><ellipse cx="40" cy="60.6" rx="4.4" ry="6.0" fill="#5a2f1a"/><ellipse cx="40" cy="61" rx="2.2" ry="3.9999999999999996" fill="#120c0a"/><circle cx="38.4" cy="57.03" r="1.7" fill="#fff"/><circle cx="41.8" cy="62.64" r=".9" fill="#fff"/><path d="M33.5 54.0 Q40 50.8 46.8 54.8" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="60" rx="5.6" ry="6.6" fill="#fff"/><ellipse cx="60" cy="60.6" rx="4.4" ry="6.0" fill="#5a2f1a"/><ellipse cx="60" cy="61" rx="2.2" ry="3.9999999999999996" fill="#120c0a"/><circle cx="58.4" cy="57.03" r="1.7" fill="#fff"/><circle cx="61.8" cy="62.64" r=".9" fill="#fff"/><path d="M53.5 54.0 Q60 50.8 66.8 54.8" stroke="#1a100c" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="40" cy="60" r="9" fill="none" stroke="#f4c430" stroke-width="1.8"/><circle cx="60" cy="60" r="9" fill="none" stroke="#f4c430" stroke-width="1.8"/><path d="M49 60 H51 M31 59 L27 57 M69 59 L73 57" stroke="#f4c430" stroke-width="1.8"/><ellipse cx="33" cy="69" rx="3.5" ry="2" fill="#c56a5a" opacity=".55"/><ellipse cx="67" cy="69" rx="3.5" ry="2" fill="#c56a5a" opacity=".55"/><path d="M49 66 Q48.5 69 51 69.5" stroke="#5a3424" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M43 73 Q50 80 57 73 Z" fill="#5a1f1f"/><path d="M45 74 Q50 76 55 74" stroke="#fff" stroke-width="1.6" fill="none"/><circle cx="30" cy="70" r="2.6" fill="#f4c430"/><circle cx="70" cy="70" r="2.6" fill="#f4c430"/></svg>'}
};
/* Personagens dos capítulos 2 e 3 (retratos em SVG; dá para trocar por arte do Canva depois, como no Chico e na Fátima). */
const rosto=(pele,olho)=>'<path d="M30 46 Q30 72 42 79 Q50 83 58 79 Q70 72 70 46Z" fill="'+pele+'"/>'+
  '<ellipse cx="41" cy="57" rx="4.6" ry="5" fill="#fff"/><ellipse cx="41" cy="57.6" rx="3.2" ry="3.8" fill="'+olho+'"/><circle cx="40" cy="55.6" r="1.2" fill="#fff"/>'+
  '<ellipse cx="59" cy="57" rx="4.6" ry="5" fill="#fff"/><ellipse cx="59" cy="57.6" rx="3.2" ry="3.8" fill="'+olho+'"/><circle cx="58" cy="55.6" r="1.2" fill="#fff"/>';
const npcSvg=s=>'<svg viewBox="0 0 100 100" aria-hidden="true">'+s+'</svg>';
Object.assign(NPC,{
  /* Cap. 2 · engenheira responsável técnica (mentora): capacete branco, óculos, cabelo preso */
  lia:{nome:'Eng.ª Lia',svg:npcSvg('<circle cx="50" cy="50" r="46" fill="#1f3d4a"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#2b4f7a"/><path d="M41 78 L50 89 L59 78" fill="#eef2f7"/><rect x="44" y="68" width="12" height="11" fill="#8a5a3c"/>'+rosto('#a8714c','#2a1a12')+
    '<path d="M28 52 Q27 36 50 35 Q73 36 72 52 Q66 43 50 43 Q34 43 28 52Z" fill="#1a1412"/><path d="M23 41 Q23 18 50 17 Q77 18 77 41Z" fill="#f3f5f7"/><rect x="19" y="39" width="62" height="5" rx="2.5" fill="#cfd5dc"/>'+
    '<circle cx="41" cy="57" r="7.5" fill="none" stroke="#2a2f36" stroke-width="2"/><circle cx="59" cy="57" r="7.5" fill="none" stroke="#2a2f36" stroke-width="2"/><path d="M48.5 57 H51.5" stroke="#2a2f36" stroke-width="2"/>'+
    '<path d="M43 70 Q50 75 57 70" stroke="#6e3a25" stroke-width="2.2" fill="none" stroke-linecap="round"/>')},
  /* Cap. 2 · síndica do Condomínio Mandacaru: cabelo grisalho em coque, brincos */
  socorro:{nome:'Dona Socorro',svg:npcSvg('<circle cx="50" cy="50" r="46" fill="#4a3a2a"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#7a3f6b"/><g fill="#f4c430"><circle cx="34" cy="92" r="2.4"/><circle cx="50" cy="95" r="2.4"/><circle cx="66" cy="92" r="2.4"/></g><rect x="44" y="68" width="12" height="11" fill="#b8896a"/>'+
    '<circle cx="50" cy="24" r="10" fill="#c9c9cf"/><path d="M27 54 Q24 30 50 29 Q76 30 73 54 Q68 40 50 39 Q32 40 27 54Z" fill="#c9c9cf"/>'+rosto('#d1a07e','#4a2c1a')+
    '<path d="M34 50 Q40 48 46 50 M54 50 Q60 48 66 50" stroke="#8a8a90" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="30" cy="66" r="2.6" fill="#f4c430"/><circle cx="70" cy="66" r="2.6" fill="#f4c430"/>'+
    '<path d="M43 71 Q50 76 57 71" stroke="#8a3a3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>')},
  /* Cap. 2 · porteiro do condomínio: boné, bigode, camisa azul-clara */
  raimundo:{nome:'Seu Raimundo',svg:npcSvg('<circle cx="50" cy="50" r="46" fill="#25384f"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#7fa7c9"/><path d="M42 78 L50 87 L58 78" fill="#5c87ad"/><rect x="44" y="68" width="12" height="11" fill="#7a4e33"/>'+rosto('#8f5c3c','#1e120c')+
    '<path d="M26 44 Q26 22 50 21 Q74 22 74 44Z" fill="#1f4e86"/><path d="M50 40 Q72 37 86 44 Q84 49 72 48 Q60 45 50 46Z" fill="#163a66"/><rect x="45" y="27" width="10" height="6" rx="1.5" fill="#f4c430"/>'+
    '<path d="M39 68 Q50 63 61 68 Q56 72 50 70 Q44 72 39 68Z" fill="#2a1a12"/><path d="M45 75 Q50 77 55 75" stroke="#5a2f1f" stroke-width="1.6" fill="none" stroke-linecap="round"/>')},
  /* Cap. 3 · dono da beneficiadora de castanha: chapéu de couro, barba grisalha, camisa xadrez */
  damiao:{nome:'Seu Damião',svg:npcSvg('<circle cx="50" cy="50" r="46" fill="#3f2a1c"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#a33b2b"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="none" stroke="#6b2219" stroke-width="2" stroke-dasharray="4 4"/><rect x="44" y="68" width="12" height="11" fill="#9a6a4a"/>'+rosto('#b37b55','#2a1a12')+
    '<path d="M33 66 Q35 82 50 84 Q65 82 67 66 Q60 74 50 74 Q40 74 33 66Z" fill="#d2d2d6"/><path d="M42 70 Q50 73 58 70" stroke="#7a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>'+
    '<path d="M14 43 Q50 30 86 43 Q78 48 50 46 Q22 48 14 43Z" fill="#7a4a23"/><path d="M30 42 Q31 18 50 18 Q69 18 70 42Z" fill="#8f5a2c"/><path d="M31 36 Q50 30 69 36" stroke="#f4c430" stroke-width="1.6" fill="none" stroke-dasharray="3 2"/>')},
  /* Cap. 3 · técnica de manutenção industrial (mentora): capacete amarelo, cabelo cacheado, protetor auricular */
  rayane:{nome:'Rayane',svg:npcSvg('<circle cx="50" cy="50" r="46" fill="#2a2440"/><path d="M14 100 Q16 80 50 78 Q84 80 86 100Z" fill="#e67e22"/><path d="M20 92 H80" stroke="#f2f2f2" stroke-width="3"/><rect x="44" y="68" width="12" height="11" fill="#6b4226"/>'+
    '<g fill="#2a1a12"><circle cx="26" cy="54" r="9"/><circle cx="74" cy="54" r="9"/><circle cx="24" cy="66" r="7"/><circle cx="76" cy="66" r="7"/></g>'+rosto('#7a4b2c','#1a0f08')+
    '<path d="M24 42 Q24 17 50 16 Q76 17 76 42Z" fill="#f4c430"/><rect x="20" y="40" width="60" height="5" rx="2.5" fill="#d8a91f"/><rect x="47" y="18" width="6" height="20" rx="3" fill="#ffe27a"/>'+
    '<rect x="18" y="52" width="8" height="14" rx="3" fill="#d33a2c"/><rect x="74" y="52" width="8" height="14" rx="3" fill="#d33a2c"/>'+
    '<path d="M43 70 Q50 76 57 70" stroke="#4a1f12" stroke-width="2.2" fill="none" stroke-linecap="round"/>')}
});
/* Para escrever um capítulo novo: crie um item em CHAPTERS (fases + falas). Falas = [quem, texto]; quem = chave de NPC ou 'eu'. {nome} vira o nome do jogador. */


NPC.chico.body=IMG.chico_body;NPC.fatima.body=IMG.fatima_body;
NPC.chico.svg=picSVG(IMG.chico);NPC.fatima.svg=picSVG(IMG.fatima);
const CHAPTERS=[
 {id:'cap1',nome:'A Casa Acesa',tema:'Fundamentos e circuitos',fases:['faisca','entrada','primeiro','previsao','paralelo','defeito','renovavel','seguranca','ohm'],
  intro:[['chico','Gente nova na oficina! Boas-vindas, {nome}.'],['eu','Bom dia, Mestre! Pronto pra começar o serviço!'],['chico','Calma. Primeiro a gente treina aqui na bancada da oficina. Depois vamos atender clientes de verdade.'],['chico','Começamos pelo básico: de onde vem a energia e como ela chega até uma lâmpada.']],
  fim:[['fatima','Mestre Chico! Agora a casa inteira apagou! Nenhuma luz e nenhuma tomada funcionam!'],['chico','Quando a casa toda apaga, o problema não é uma lâmpada. Precisamos olhar o quadro de distribuição.'],['eu','Então vamos ver o quadro da casa dela?'],['chico','Esse é o próximo capítulo, {nome}. Lá você vai aprender disjuntor geral e DR.']]},

 /* Cada capítulo é uma história própria, com personagens e biblioteca de peças (BIBLIOTECAS em fases.js).
    Um capítulo só abre quando o anterior estiver completo (no modo teste, tudo abre). */
 {id:'cap2',nome:'Do Quadro ao Condomínio',tema:'Instalação predial',fases:['quadro','quadronovo','escada','corredor','garagem','impulso','surto'],
  intro:[['fatima','Que alívio ver vocês! Desde ontem a casa toda está apagada.'],
    ['lia','Bom dia, Dona Fátima. Sou a Engenheira Lia, responsável técnica da obra do condomínio aqui da rua.'],
    ['lia','O Mestre Chico me falou de você, {nome}. O quadro dela é antigo: não tem DR nem DPS. Vamos montar um quadro novo, do jeito da norma.'],
    ['eu','Quadro novo, com DR e DPS. Bora!'],
    ['lia','Depois, a síndica do Condomínio Mandacaru precisa da gente: escada, corredor, garagem e hall.']],
  fim:[['socorro','Escada, corredor, garagem e hall funcionando. O Mandacaru inteiro agradece, {nome}!'],
    ['lia','Você está pronto para coisa maior. Um amigo meu tem uma fábrica de castanha de caju, e a esteira vive parando.'],
    ['eu','Fábrica? Motor, contatora, botoeira... bora!'],
    ['lia','Próximo capítulo: Chão de Fábrica.']]},
 {id:'cap3',nome:'Chão de Fábrica',tema:'Instalação industrial e comandos',fases:['turno','partida','sobrecarga','caixa','fimturno'],
  breve:['Partida com reversão (motor trifásico)','Partida estrela-triângulo'],
  intro:[['damiao','Seja bem-vindo à Caju Dourado! Sou o Damião. Aqui a castanha vira emprego para o sertão inteiro.'],
    ['rayane','E eu sou a Rayane, da manutenção. Aqui é motor, contatora e botoeira o dia todo.'],
    ['rayane','Regra número um da fábrica: máquina em manutenção fica desligada, travada e sinalizada. Ninguém liga sem querer.'],
    ['eu','Entendido, Rayane. Segurança primeiro.']],
  fim:[['damiao','Esteira girando e caixa d\'água cheia. A Caju Dourado não para mais!'],
    ['rayane','Os motores trifásicos chegam em breve. Aí vamos fazer reversão e estrela-triângulo de verdade.'],
    ['eu','Vou estar pronto!']]},
 {id:'cap4',nome:'Sol no Telhado',tema:'Energia solar fotovoltaica',soon:true,
  enredo:'A Professora Iara quer energia solar na escola rural do Assentamento Boa Esperança.',
  previstas:['Placas, cabo solar e string box (corrente contínua)','Inversor e conexão à rede','Medidor bidirecional e economia na conta']},
 {id:'cap5',nome:'Ventos do Litoral',tema:'Energia eólica',soon:true,
  enredo:'Seu Zé Maré quer luz na colônia de pescadores de Icapuí com a força do vento.',
  previstas:['Aerogerador e controlador de carga','Banco de baterias','Inversor off-grid para a colônia']}
];
const SCENES={
  faisca:[['chico','Antes de mexer em qualquer coisa, me responde umas perguntas. Quero ver como você pensa.']],
  entrada:[['chico','Olha pela janela da oficina: lá no poste tem o transformador, e na parede tem o medidor.'],['chico','É por esse caminho que a energia chega. {nome}, me mostra que você entendeu.']],
  primeiro:[['chico','Essa é a sua bancada de treino. Tem a energia da rede, um interruptor e uma lâmpada.'],['chico','Olhando a tomada de frente: o pino do meio é o terra. Nesta bancada a fase fica à direita e o neutro à esquerda.'],['chico','A norma da tomada não diz de que lado fica a fase. Na obra, quem diz é o instrumento: confira antes de ligar.'],['chico','Ligue do jeito da NBR 5410: fase no interruptor, retorno até a lâmpada e neutro azul-claro direto no bocal.']],
  previsao:[['chico','Ainda na bancada: eletricista bom prevê o que vai acontecer antes de ligar. Topa um desafio?'],['eu','Topo! Vou pensar antes de responder.']],
  paralelo:[['fatima','Bom dia! Sou a Dona Fátima, moro aqui na rua. Quero colocar duas lâmpadas na minha sala.'],['fatima','E quero as duas bem fortes, viu?'],['chico','Primeira cliente, {nome}! Cuidado: tem um jeito de ligar que deixa as duas fraquinhas.']],
  defeito:[['fatima','Mestre, a lâmpada da minha cozinha não acende mais! As outras luzes da casa estão funcionando.'],['chico','Se só a cozinha apagou, o problema está no circuito da cozinha. Vamos testar peça por peça: aqui não se troca nada no chute.']],
  renovavel:[['fatima','Mestre, minha vizinha instalou placa solar. Isso é energia que não acaba?'],['chico','Boa pergunta. {nome}, explica pra ela de onde vem cada energia.']],
  seguranca:[['chico','Antes de qualquer serviço na casa da Dona Fátima, a parte mais importante do ofício.'],['eu','Segurança primeiro!']],
  ohm:[['fatima','E por que a minha conta de luz vem tão alta?'],['chico','Hora de fazer conta: potência, tempo e consumo.']],
  /* Cap. 2 */
  quadro:[['lia','Antes de abrir o quadro, me diga: para que serve cada peça dele?']],
  quadronovo:[['lia','O quadro novo: disjuntor geral (DG) na entrada, depois o DR, e um disjuntor para cada circuito.'],['lia','Atenção: o neutro dos circuitos volta pelo DR. Se voltar por fora, ele desarma.']],
  escada:[['socorro','Sou a Socorro, síndica do Mandacaru. O povo sobe a escada no escuro!'],['socorro','Quero acender embaixo e apagar lá em cima. E o contrário também.'],['lia','Isso é o interruptor paralelo, o three-way: um em cada ponta da escada.']],
  corredor:[['socorro','E o corredor comprido? Tem porta nas duas pontas e uma no meio.'],['lia','Três pontos de comando: um paralelo em cada ponta e um intermediário, o four-way, no meio.']],
  garagem:[['raimundo','Boa tarde! Sou o Raimundo, porteiro. Todo dia eu esqueço a luz da garagem acesa.'],['lia','Uma fotocélula resolve: ela acende sozinha quando escurece e apaga de manhã.']],
  impulso:[['socorro','No hall tem dois pulsadores. Cada toque deve acender ou apagar a luz.'],['lia','Isso é o relé de impulso: cada pulso na bobina inverte o contato.']],
  surto:[['raimundo','Ontem caiu um raio perto e queimou o interfone!'],['lia','Faltava DPS. Vamos ver se você sabe como ele protege a instalação.']],
  /* Cap. 3 */
  turno:[['rayane','Antes do primeiro turno, uma conversa rápida sobre segurança e comandos.']],
  partida:[['damiao','A esteira da castanha parou! Sem ela, a fábrica toda para.'],['rayane','O painel queimou. Vamos montar de novo a partida direta: botoeira liga, botoeira desliga e contatora com selo.']],
  sobrecarga:[['rayane','Agora o painel está funcionando. Eu mexo nele, e você prevê o que acontece com o motor.']],
  caixa:[['damiao','A caixa d\'água da fábrica secou de novo. Alguém esqueceu a bomba desligada.'],['rayane','Com uma boia de nível a bomba liga sozinha quando a caixa esvazia e desliga quando enche.']],
  fimturno:[['rayane','Fim de turno! Logo chegam os motores grandes: reversão e estrela-triângulo.'],['damiao','Me mostra que você já sabe a teoria.']]
};
const chapterOf=pid=>CHAPTERS.find(c=>c.fases&&c.fases.includes(pid));
const phaseById=id=>PHASES.find(p=>p.id===id);
function showScene(lines,done){
  let i=0,typing=null;
  const r=()=>{
    const [who,t]=lines[i],txt=t.replace(/\{nome\}/g,esc(S.name||charOf().nome));
    const me=who==='eu';
    const sp=me?{nome:S.name||charOf().nome,svg:charSVG(S.char),body:(typeof IMG!=='undefined'&&IMG[S.char+'_body'])||null}:NPC[who];
    const fig=sp.body?'<img class="vn-body" src="'+sp.body+'" alt="'+esc(sp.nome)+'">':'<div class="vn-port">'+sp.svg+'</div>';
    app.innerHTML=hud()+'<section class="vn'+(me?' me':'')+'">'+
      '<div class="vn-fig">'+fig+'</div>'+
      '<div class="vn-side">'+
        '<span class="vn-chap">'+(i+1)+' / '+lines.length+'</span>'+
        '<span class="vn-name">'+esc(sp.nome)+'</span>'+
        '<button class="vn-box" id="say" aria-live="polite"><span id="tx"></span><span class="vn-caret">▼</span></button>'+
        '<div class="vn-ctrl"><button class="btn sm ghost" id="skip">Pular</button>'+(L()?'<button class="btn sm ghost" id="sp" aria-label="Ouvir">🔊</button>':'')+'<button class="btn sm main" id="go">'+(i<lines.length-1?'▶':'Bora! ⚡')+'</button></div>'+
      '</div></section>';
    bindHud();
    const tx=document.getElementById('tx'),plain=txt.replace(/<[^>]+>/g,'');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let k=0;clearInterval(typing);
    if(reduce){tx.textContent=plain}else typing=setInterval(()=>{k+=2;tx.textContent=plain.slice(0,k);if(k>=plain.length)clearInterval(typing)},L()?40:22);
    const next=()=>{if(tx.textContent.length<plain.length){clearInterval(typing);tx.textContent=plain;return}clearInterval(typing);i++;i<lines.length?r():done()};
    document.getElementById('say').onclick=next;document.getElementById('go').onclick=next;document.getElementById('skip').onclick=()=>{clearInterval(typing);done()};
    const s2=document.getElementById('sp');if(s2)s2.onclick=()=>speak(plain);
  };
  r();
}

const PHASES=[
 {id:'faisca',nome:'Faísca',sub:'Energia e materiais',kind:'quiz',tipo:'quiz',ic:'lampada',cor:'#2f4a6e',
  card:{leve:'O grafite do lápis conduz eletricidade!',moderado:'A prata conduz melhor que o cobre, mas custa caro.',full:'Alta tensão na transmissão = menos corrente = menos perda I²R.'},
  dados:{
   leve:[{q:'Por que o fio tem uma capa de plástico?',o:['Para a eletricidade não passar para a nossa mão','Para a eletricidade andar mais rápido','Para o fio não enferrujar'],w:'O plástico é isolante: ele segura a eletricidade dentro do fio.'},
         {q:'O celular esquenta quando carrega. Para onde vai parte da energia?',o:['Vira calor','Some para sempre','Volta para a tomada'],w:'Energia não some. Ela muda de forma, e parte vira calor.'},
         {q:'Qual destes deixa a eletricidade passar?',o:['A ponta do lápis (grafite)','A borracha','A folha de papel'],w:'O grafite conduz! Dá para acender um LED com um desenho de lápis.'}],
   moderado:[{q:'Por que um fio fino esquenta quando passa muita corrente?',o:['Efeito Joule: a resistência transforma energia em calor','Porque o cobre é isolante','Porque a tensão acaba no meio do fio'],w:'P = R × I². Fio fino tem mais resistência, então esquenta mais.'},
         {q:'Um carregador indica 5 V e 2 A. A potência máxima é…',o:['10 W','2,5 W','7 W'],w:'P = V × I = 5 × 2 = 10 W.'},
         {q:'Qual metal conduz MELHOR a eletricidade?',o:['Prata','Cobre','Alumínio'],w:'A prata vence, mas é cara. O cobre é o melhor custo-benefício.'}],
   full:[{q:'Por que a transmissão usa alta tensão?',o:['Reduz a corrente e as perdas I²R','A alta tensão é mais segura','Aumenta a frequência da rede'],w:'Para a mesma potência, mais tensão significa menos corrente e menos perda nos cabos.'},
         {q:'220 V eficaz corresponde a um pico de aproximadamente…',o:['311 V','220 V','381 V'],w:'Vpico = Vrms × √2 ≈ 311 V.'},
         {q:'Rede trifásica 220/380 V (como em Fortaleza): tensão entre duas fases?',o:['380 V','220 V','440 V'],w:'Fase-fase = fase-neutro × √3 ≈ 380 V.'}]
  }},
 {id:'entrada',nome:'Do Poste à Tomada',sub:'Transformador, medidor e CA',kind:'quiz',tipo:'quiz',ic:'multimetro',cor:'#2b5a4e',
  card:{leve:'O medidor conta a energia da casa em kWh.',moderado:'Rede no Brasil: corrente alternada em 60 Hz.',full:'Secundário 380/220 V em estrela: 220 V é fase-neutro.'},
  dados:{
   leve:[{q:'Para que serve o medidor (o "relógio de luz") na frente da casa?',o:['Contar quanta energia a casa usa','Produzir a energia da casa','Deixar a luz mais forte'],w:'Ele registra o consumo em kWh. É por ele que a conta é calculada.'},
         {q:'O que faz o transformador lá no poste?',o:['Baixa a tensão para chegar nas casas','Guarda energia, como uma pilha','Mede a conta de luz'],w:'Nos fios mais altos do poste a tensão é muito alta. O transformador baixa para 220 V.'},
         {q:'A energia da tomada é igual à de uma pilha?',o:['Não. A da tomada é alternada, com fase e neutro','Sim, é igualzinha','Não. A tomada não tem energia'],w:'Pilha é corrente contínua, com + e −. A tomada é corrente alternada.'}],
   moderado:[{q:'Qual a frequência da rede elétrica no Brasil?',o:['60 Hz','50 Hz','220 Hz'],w:'O Brasil usa 60 Hz: a corrente muda de sentido 120 vezes por segundo.'},
         {q:'O medidor de energia registra o consumo em…',o:['kWh','kW','V'],w:'kW é potência. kWh é energia: potência × tempo.'},
         {q:'Numa tomada 2P+T, quais são os condutores?',o:['Fase, neutro e terra (PE)','Positivo, negativo e terra','Duas fases e um neutro'],w:'Positivo e negativo são termos de corrente contínua. Na rede CA são fase, neutro e PE.'}],
   full:[{q:'Trafo de distribuição 13,8 kV / 380-220 V, secundário em estrela. O que é o 220 V?',o:['Tensão fase-neutro','Tensão fase-fase','Tensão do primário'],w:'Fase-fase = 380 V. Fase-neutro = 380 ÷ √3 ≈ 220 V.'},
         {q:'Por que o neutro é aterrado no padrão de entrada (esquema TN)?',o:['Para fixar o potencial e permitir que a proteção atue numa falta à terra','Para dispensar o condutor de proteção','Para elevar a tensão de fornecimento'],w:'No TN a falta fase-massa vira um circuito de baixa impedância e o dispositivo de proteção atua.'},
         {q:'O medidor marcou 3 kWh em 2 horas. Potência média?',o:['1,5 kW','6 kW','0,67 kW'],w:'P = E ÷ t = 3 ÷ 2 = 1,5 kW.'}]
  }},
 {id:'primeiro',nome:'Primeiro Circuito',sub:'Bancada de treino',kind:'bancada',tipo:'build',ic:'interruptor',cor:'#7a4a1f',
  card:{leve:'Interruptor sempre na fase. Neutro direto na lâmpada.',moderado:'Rede → disjuntor → interruptor → retorno → lâmpada → neutro.',full:'NBR 5410: o comando secciona a fase; o neutro vai direto à carga.'},
  dados:{
   leve:{comps:[BAT(),C('S1','sw',170,45,0,{closed:false}),C('L1','lamp',290,125,1)],
     real:[['L1','💡','lâmpada da bancada'],['S1','🔘','interruptor'],['Rede','🔌','energia que vem do poste']],
     goal:'Ligue a lâmpada L1 na rede, com o interruptor S1 ligando e desligando.',
     check:st=>tableCheck(st,[{sw:{S1:1},want:{L1:1}},{sw:{S1:0},want:{L1:0}}])},
   moderado:{comps:[BAT(),C('F','fuse',115,45,0,{lab:'DJ 10A'}),C('S1','sw',225,45,0,{closed:false}),C('L1','lamp',290,135,1)],
     real:[['L1','💡','lâmpada da bancada'],['S1','🔘','interruptor'],['DJ','🎚','disjuntor no quadro'],['Rede','🔌','energia que vem do poste']],
     goal:'S1 comanda L1 e o disjuntor protege o circuito.',
     check:st=>tableCheck(st,[{sw:{S1:1},want:{L1:1}},{sw:{S1:0},want:{L1:0}}])},
   full:{comps:[BAT(),C('F','fuse',115,45,0,{lab:'DJ 10A'}),C('S1','sw',225,45,0,{closed:false}),C('L1','lamp',290,135,1)],
     real:[['L1','💡','luminária da bancada'],['S1','🔘','interruptor simples'],['DJ','🎚','disjuntor do circuito'],['Rede','🔌','220 V~ do QD']],
     goal:'Circuito de iluminação conforme NBR 5410: proteção na fase, comando seccionando a fase e cores corretas.',
     check:st=>tableCheck(st,[{sw:{S1:1},want:{L1:1}},{sw:{S1:0},want:{L1:0}}])}
  }},
 {id:'previsao',nome:'Previsão',sub:'Desafio na bancada',kind:'bancada',tipo:'predict',ic:'previsao',cor:'#2b4f6e',
  card:{leve:'Atalho na fiação: a energia sempre escolhe o caminho mais fácil.',moderado:'Em série, uma falha apaga tudo. Em paralelo, cada um segue sozinho.',full:'Curto em parte do circuito redistribui tensões: umas cargas apagam, outras fortalecem.'},
  dados:{
   leve:[{sc:scSerie,act:breakL('L2'),acao:'A lâmpada L2 vai queimar.',q:'As lâmpadas estão em fila. Se a L2 queimar, a L1…',o:['Apaga também','Continua acesa','Fica mais forte'],w:'Em fila, se o caminho abre em um lugar, a energia para em todos.'},
         {sc:scParalelo,act:breakL('L2'),acao:'A lâmpada L2 vai queimar.',q:'Agora cada lâmpada tem seu próprio caminho. Se a L2 queimar, a L1…',o:['Continua acesa igual','Apaga também','Fica mais fraca'],w:'O caminho da L1 continua fechado. Assim funcionam as tomadas da sua casa!'},
         {sc:scAtalho,act:closeS('S1'),acao:'Vamos fechar o botão S1.',q:'O botão S1 faz um atalho por cima da L2. Se ele fechar, a L1…',o:['Fica mais forte','Apaga','Nada muda'],w:'A energia segue pelo atalho e passa por fora da L2. Agora a L1 recebe toda a energia sozinha.'}],
   moderado:[{sc:scSerie,act:breakL('L2'),acao:'O filamento de L2 vai romper.',q:'Circuito série. O filamento de L2 rompe. L1…',o:['Apaga: o circuito abriu','Continua igual','Fica mais forte'],w:'Série tem um único caminho. Abriu em um ponto, a corrente cai a zero.'},
         {sc:scParalelo,act:breakL('L2'),acao:'O filamento de L2 vai romper.',q:'Circuito paralelo. L2 rompe. L1…',o:['Continua com o mesmo brilho','Apaga','Fica mais forte'],w:'L1 continua com a tensão plena da fonte. Só a corrente total diminui.'},
         {sc:scAtalho,act:closeS('S1'),acao:'S1 vai fechar.',q:'S1 está em paralelo com L2. Ao fechar S1, L1…',o:['Fica mais forte','Apaga','Fica igual'],w:'L2 fica em curto e sai do circuito. L1 passa de 25% para 100% da potência.'},
         {sc:scCurto,act:closeS('S1'),acao:'S1 vai fechar.',q:'S1 liga a fase direto no neutro. Ao fechar…',o:['Curto: as lâmpadas apagam e a corrente dispara','As lâmpadas ficam mais fortes','Só L1 apaga'],w:'Sem carga no caminho, a corrente sobe sem limite. É aí que o fusível ou disjuntor precisa atuar.'}],
   full:[{sc:scAtalho,act:closeS('S1'),acao:'S1 vai fechar.',q:'Série de 2 cargas iguais. S1 curto-circuita L2. Potência em L1?',o:['Quadruplica','Dobra','Não muda'],w:'Tensão em L1 vai de V/2 para V. P = V²/R, então ×4.'},
         {sc:scCurto,act:closeS('S1'),acao:'S1 vai fechar.',q:'Fechar S1 cria qual condição?',o:['Curto franco na fonte: atuação magnética da proteção','Sobrecarga leve: atuação térmica lenta','Fuga à terra: atuação do DR'],w:'Curto franco gera corrente muito acima de In: atua o disparo magnético (instantâneo).'},
         {sc:scMisto,act:breakL('L3'),acao:'L3 vai abrir.',q:'L1 em série com (L2 ∥ L3). Se L3 abrir, o que acontece?',o:['L1 enfraquece e L2 fortalece','As duas apagam','L1 fortalece e L2 enfraquece'],w:'Req sobe de 1,5R para 2R: a corrente cai e L1 enfraquece. Mas a tensão em L2 sobe de V/3 para V/2.'}]
  }},
 {id:'paralelo',nome:'Série ou Paralelo',sub:'Sala da Dona Fátima',kind:'bancada',tipo:'build',ic:'paralelo',cor:'#5a4a1f',
  card:{leve:'Cada lâmpada no seu caminho = todas fortes.',moderado:'Interruptores independentes = cargas em paralelo.',full:'Comando geral + comando individual: série com o ramo + paralelo entre ramos.'},
  dados:{
   leve:{comps:[BAT(),C('L1','lamp',200,55,0),C('L2','lamp',200,195,0)],
     real:[['L1','💡','lâmpada 1 da sala'],['L2','💡','lâmpada 2 da sala'],['Rede','🔌','energia da casa']],
     goal:'Acenda as DUAS lâmpadas da sala com brilho forte. Cuidado: tem um jeito que deixa as duas fracas!',
     check:st=>tableCheck(st,[{sw:{},want:{L1:1,L2:1}}],true)},
   moderado:{comps:[BAT(),C('S1','sw',135,55,0,{closed:false}),C('L1','lamp',255,55,0),C('S2','sw',135,195,0,{closed:false}),C('L2','lamp',255,195,0)],
     real:[['L1','💡','lâmpada 1 da sala'],['L2','💡','lâmpada 2 da sala'],['S1','🔘','interruptor da lâmpada 1'],['S2','🔘','interruptor da lâmpada 2']],
     goal:'S1 comanda só L1 e S2 comanda só L2, as duas com brilho total.',
     check:st=>tableCheck(st,[{sw:{S1:1,S2:0},want:{L1:1,L2:0}},{sw:{S1:0,S2:1},want:{L1:0,L2:1}},{sw:{S1:1,S2:1},want:{L1:1,L2:1}},{sw:{S1:0,S2:0},want:{L1:0,L2:0}}],true)},
   full:{comps:[BAT(),C('S0','sw',125,45,0,{closed:false,lab:'S0 geral'}),C('L1','lamp',250,45,0),C('S2','sw',135,205,0,{closed:false}),C('L2','lamp',255,205,0)],
     real:[['L1','💡','lâmpada 1 da sala'],['L2','💡','lâmpada 2 da sala'],['S0','🔘','interruptor geral da sala'],['S2','🔘','interruptor da lâmpada 2']],
     goal:'S0 é o geral: desliga tudo. S2 comanda só L2. Brilho total sempre.',
     check:st=>tableCheck(st,[{sw:{S0:1,S2:1},want:{L1:1,L2:1}},{sw:{S0:1,S2:0},want:{L1:1,L2:0}},{sw:{S0:0,S2:1},want:{L1:0,L2:0}},{sw:{S0:0,S2:0},want:{L1:0,L2:0}}],true)}
  }},
 {id:'defeito',nome:'Caça-Defeito',sub:'Cozinha da Dona Fátima',kind:'bancada',tipo:'diag',ic:'multimetro',cor:'#6b5512',
  card:{leve:'Testar antes de trocar economiza peça.',moderado:'Circuito série aberto: a tensão toda aparece no ponto aberto.',full:'Diagnóstico eficiente: divida o circuito ao meio a cada medição.'},
  dados:{leve:{V:220,cand:['F','S1','L1'],limit:3},moderado:{V:220,cand:['F','S1','L1'],limit:3},full:{V:220,cand:['F','S1','L1','w1','w3'],limit:3}}},
 {id:'renovavel',nome:'Guardião Verde',sub:'Renovável ou não?',kind:'classificar',tipo:'sort',ic:'sol',cor:'#2d6a3a',
  card:{leve:'Lenha pode ser renovável, se replantar!',moderado:'A casca de castanha do Ceará vira energia (biomassa).',full:'Hidrogênio só é verde se a eletricidade da eletrólise for renovável.'},
  dados:{
   leve:[{t:'Sol',i:'☀️',r:1,w:'O sol nasce todo dia.'},{t:'Gás de cozinha',i:'🔥',r:0,w:'Vem do petróleo, que acaba.'},{t:'Lenha de árvore replantada',i:'🪵',r:1,w:'Se replanta, a natureza repõe.'},{t:'Bagaço de cana',i:'🌾',r:1,w:'Sobra da cana, que cresce de novo.'},{t:'Carvão mineral',i:'⚫',r:0,w:'Levou milhões de anos para se formar.'},{t:'Vento',i:'🌬️',r:1,w:'O vento não acaba.'}],
   moderado:[{t:'Biogás de aterro',i:'🗑️',r:1,w:'Vem da decomposição do lixo orgânico.'},{t:'Gás natural',i:'🔥',r:0,w:'Fóssil, mesmo poluindo menos que o carvão.'},{t:'Casca de castanha de caju',i:'🌰',r:1,w:'Biomassa típica do Ceará.'},{t:'Nuclear',i:'⚛️',r:0,w:'Quase não emite CO₂, mas o urânio é finito.'},{t:'Hidrelétrica',i:'💧',r:1,w:'O ciclo da chuva repõe a água.'},{t:'Diesel',i:'🛢️',r:0,w:'Derivado do petróleo.'}],
   full:[{t:'Hidrogênio verde',i:'🫧',r:1,w:'Eletrólise alimentada por fonte renovável.'},{t:'Hidrogênio cinza',i:'🏭',r:0,w:'Produzido a partir de gás natural.'},{t:'Biometano',i:'🐄',r:1,w:'Biogás purificado.'},{t:'Xisto betuminoso',i:'🪨',r:0,w:'Fóssil.'},{t:'Energia das marés',i:'🌊',r:1,w:'Movida pela gravitação lunar.'},{t:'Nuclear (fissão)',i:'⚛️',r:0,w:'Baixo carbono, mas o recurso é finito.'},{t:'Geotérmica',i:'🌋',r:1,w:'Calor interno da Terra.'},{t:'Turfa',i:'🟫',r:0,w:'Renova em milhares de anos: tratada como fóssil.'}]
  }},
 {id:'seguranca',nome:'Mão Segura',sub:'Decisões de segurança',kind:'quiz',tipo:'quiz',ic:'disjuntor',cor:'#7a2a24',
  card:{leve:'Disjuntor que desarma está avisando algo.',moderado:'Azul-claro é do neutro. Verde-amarelo é do terra.',full:'Curva C: disparo magnético entre 5 e 10 × In.'},
  dados:{
   leve:[{q:'O disjuntor desarmou sozinho. O que fazer?',o:['Chamar um adulto para descobrir o motivo','Religar várias vezes até ficar','Prender com fita para não cair mais'],w:'Ele desarma para proteger. Alguma coisa está errada.'},
         {q:'A pipa enroscou no fio do poste. E agora?',o:['Deixar lá e avisar um adulto','Puxar com uma vara de bambu','Subir no muro para alcançar'],w:'Fio de poste é muito perigoso. Quem retira é a companhia de energia.'},
         {q:'O benjamim (T) com 4 aparelhos está quente. Isso é…',o:['Perigoso: pode pegar fogo','Normal, todo plugue esquenta','Bom, economiza tomada'],w:'Calor no plugue é sinal de sobrecarga.'}],
   moderado:[{q:'Fio de 1,5 mm² protegido por disjuntor de 20 A. Está…',o:['Errado: o disjuntor é maior que o fio aguenta','Certo','Certo, se o fio for flexível'],w:'O disjuntor protege o fio. Ele precisa abrir antes do fio superaquecer.'},
         {q:'Por que o interruptor deve cortar a fase, e não o neutro?',o:['Para a lâmpada ficar sem tensão quando desligada','Para economizar energia','Tanto faz, é igual'],w:'Cortando o neutro, a lâmpada desligada continua energizada. Mas atenção: para trocar a lâmpada, desligue o disjuntor. Interruptor não é desligamento seguro.'},
         {q:'Qual cor a NBR 5410 reserva ao neutro?',o:['Azul-claro','Verde-amarelo','Branco'],w:'Verde-amarelo (ou verde) é do condutor de proteção.'}],
   full:[{q:'Pela NR-10, logo depois de seccionar o circuito, o próximo passo é…',o:['Constatar a ausência de tensão','Instalar o aterramento temporário','Sinalizar a área'],w:'NR-10 (10.13.1): seccionar → constatar ausência de tensão → impedir reenergização → constatar de novo e aterrar temporariamente → proteger partes vivas próximas → sinalizar o impedimento → delimitar a área.'},
         {q:'O DR de 30 mA atua por…',o:['Corrente diferencial (fuga)','Sobrecarga','Sobretensão'],w:'Compara a corrente de ida e de volta. Não pode atuar abaixo de 15 mA de diferença e tem que atuar até 30 mA. Ele não protege contra sobrecarga.'},
         {q:'Disjuntor curva C: faixa de disparo magnético',o:['5 a 10 × In','3 a 5 × In','10 a 20 × In'],w:'B: 3–5 × In. C: 5–10 × In. D: 10–20 × In.'}]
  }},
 {id:'ohm',nome:'Mestre Ohm',sub:'Contas que acendem',kind:'quiz',tipo:'quiz',ic:'ohm',cor:'#5a3a6e',
  card:{leve:'Chuveiro é o campeão de gasto na casa.',moderado:'kWh = kW × horas.',full:'E = Pinst × HSP × PR.'},
  dados:{
   leve:[{q:'Uma lâmpada sozinha ou duas em fila, na mesma tomada. Quando cada lâmpada brilha mais?',o:['Sozinha','Em fila','Igual'],w:'Em fila elas dividem a energia.'},
         {q:'Qual gasta mais energia em um mês, numa casa comum?',o:['Chuveiro elétrico','Geladeira','Carregador de celular'],w:'O chuveiro tem potência muito alta, mesmo ligado pouco tempo.'},
         {q:'Para gastar menos no banho, o melhor é…',o:['Banho curto e chave no "verão"','Chave no "inverno" e banho curto','Banho longo e chave no "verão"'],w:'Posição "verão" gasta menos, e menos tempo gasta menos.'}],
   moderado:[{q:'Dois resistores de 10 Ω em paralelo, ligados em 12 V. Corrente total?',o:['2,4 A','1,2 A','0,6 A'],w:'Req = 5 Ω. I = 12 ÷ 5 = 2,4 A.'},
         {q:'Ferro de passar de 1000 W, 30 min por dia, durante 30 dias. Consumo?',o:['15 kWh','30 kWh','1,5 kWh'],w:'1 kW × 0,5 h × 30 = 15 kWh.'},
         {q:'Chuveiro de 5500 W em 220 V. Qual disjuntor faz sentido?',o:['32 A','16 A','63 A'],w:'I = 25 A. O disjuntor fica logo acima, junto com o fio adequado.'}],
   full:[{q:'10 × 550 Wp, HSP 5,5 h, PR 0,8. Energia diária estimada?',o:['24,2 kWh','30,25 kWh','44 kWh'],w:'5,5 kWp × 5,5 h × 0,8 = 24,2 kWh.'},
         {q:'12 módulos, Voc 49,5 V, coef. −0,27 %/°C, célula a 10 °C. Voc da string?',o:['≈ 618 V','594 V','≈ 570 V'],w:'ΔT = −15 °C → +4,05 %. 49,5 × 1,0405 × 12 ≈ 618 V.'},
         {q:'10 A em 30 m de cabo de 4 mm² (ida e volta = 60 m; ρ = 0,0172). Queda em 220 V?',o:['≈ 2,6 V (1,2 %)','≈ 5,2 V (2,3 %)','≈ 0,26 V (0,1 %)'],w:'R = 0,0172 × 60 ÷ 4 ≈ 0,26 Ω. ΔV = 10 × 0,26 ≈ 2,6 V.'}]
  }},

 /* ===================== CAPÍTULO 2 · Do Quadro ao Condomínio (predial) ===================== */
 {id:'quadro',nome:'O Quadro',sub:'Disjuntor geral, DR e DPS',kind:'quiz',tipo:'quiz',ic:'quadro',cor:'#2b4f7a',
  card:{leve:'DR protege as pessoas do choque.',moderado:'DR compara a corrente que vai e a que volta.',full:'Depois do DR, N e PE nunca se unem.'},
  dados:{
   leve:[{q:'Para que serve o disjuntor geral do quadro?',o:['Desligar a casa toda de uma vez','Deixar a energia mais forte','Economizar luz'],w:'Ele fica na entrada do quadro e corta todos os circuitos.'},
         {q:'O DR protege as pessoas de quê?',o:['Do choque elétrico','Da conta alta','Da falta de luz'],w:'Se a corrente escapa para o corpo ou para o terra, ele desliga rápido.'},
         {q:'Qual fio vai na barra do terra (PE) do quadro?',o:['O verde-amarelo','O azul-claro','O vermelho'],w:'Verde-amarelo é o terra. Azul-claro é o neutro.'}],
   moderado:[{q:'Qual a função do DPS no quadro?',o:['Desviar surtos de tensão, como os de raio, para o terra','Desligar na sobrecarga','Medir o consumo'],w:'O DPS protege contra sobretensões transitórias.'},
         {q:'O DR de 30 mA desliga quando…',o:['A corrente que vai pela fase é diferente da que volta pelo neutro','A tensão cai','A corrente passa de 30 A'],w:'Ele compara a ida e a volta: a diferença é a fuga.'},
         {q:'Depois do DR, neutro e terra (PE) podem ser ligados juntos?',o:['Não: o DR desarma e a proteção se perde','Sim, é a mesma coisa','Só no circuito de tomadas'],w:'Depois do DR, N e PE ficam separados. Eles só se encontram no padrão de entrada.'}],
   full:[{q:'Onde a NBR 5410 exige DR de alta sensibilidade (≤ 30 mA)?',o:['Banheiros, áreas externas, cozinhas, lavanderias, áreas de serviço e garagens, entre outros','Só no chuveiro','Só em instalação industrial'],w:'A norma lista os locais onde o DR ≤ 30 mA é obrigatório como proteção adicional.'},
         {q:'Casa sem para-raios (SPDA): classe usual do DPS no quadro de distribuição?',o:['Classe II','Classe I','Classe III'],w:'Classe I é para onde há risco de descarga direta (com SPDA). No quadro da casa, normalmente classe II.'},
         {q:'Por que o condutor PE não passa pelo DR?',o:['A fuga precisa voltar por fora do DR para ele medir a diferença','O DR não tem borne para ele','O PE nunca tem tensão'],w:'O DR mede fase e neutro. A corrente de fuga volta pelo PE, por fora, e cria a diferença.'}]
  }},
 {id:'quadronovo',nome:'Quadro Novo',sub:'Casa da Dona Fátima',kind:'bancada',tipo:'build',ic:'quadro',cor:'#2f6fb0',
  card:{leve:'Disjuntor geral, depois o DR, depois os circuitos.',moderado:'Um disjuntor para cada circuito; neutro volta pelo DR.',full:'QD: DG → DR (F e N) → DJs; N e PE separados após o DR.'},
  dados:{
   leve:{comps:[BAT(),C('DG','fuse',115,60,0,{lab:'DG'}),C('DR','dr',200,60,0),C('L1','lamp',270,170,0)],
     real:[['DG','🎚','disjuntor geral'],['DR','🛡️','DR, protege contra choque'],['L1','💡','luz da sala']],
     goal:'Ligue a luz da sala passando pelo disjuntor geral (DG) e pelo DR.',
     check:st=>quadroCheck(st,['L1'],[])},
   moderado:{comps:[BAT(),C('DG','fuse',105,60,0,{lab:'DG'}),C('DR','dr',172,60,0),C('D1','fuse',240,60,0,{lab:'DJ1'}),C('D2','fuse',305,60,0,{lab:'DJ2'}),C('L1','lamp',225,170,0),C('L2','lamp',300,170,0)],
     real:[['DG','🎚','disjuntor geral'],['DR','🛡️','DR'],['DJ1','🎚','disjuntor da sala'],['DJ2','🎚','disjuntor da cozinha'],['L1','💡','luz da sala'],['L2','💡','luz da cozinha']],
     goal:'Quadro com DG, DR e dois circuitos: DJ1 para L1 e DJ2 para L2. O neutro volta pelo DR.',
     check:st=>quadroCheck(st,['L1','L2'],[['D1','L1'],['D2','L2']])},
   full:{comps:[BAT(),C('DG','fuse',105,60,0,{lab:'DG'}),C('DR','dr',172,60,0),C('D1','fuse',240,60,0,{lab:'DJ1'}),C('D2','fuse',305,60,0,{lab:'DJ2'}),C('L1','lamp',225,170,0),C('L2','lamp',300,170,0)],
     real:[['DG','🎚','disjuntor geral'],['DR','🛡️','IDR 30 mA'],['DJ1','🎚','circuito 1'],['DJ2','🎚','circuito 2'],['L1','💡','iluminação sala'],['L2','💡','iluminação cozinha']],
     goal:'Monte o QD: DG → DR (fase e neutro) → DJ1 e DJ2. Cada disjuntor protege só o seu circuito.',
     check:st=>quadroCheck(st,['L1','L2'],[['D1','L1'],['D2','L2']])}
  }},
 {id:'escada',nome:'Luz da Escada',sub:'Condomínio Mandacaru',kind:'bancada',tipo:'build',ic:'escada',cor:'#5a4a1f',
  card:{leve:'Dois interruptores, uma luz: acende embaixo, apaga em cima.',moderado:'Three-way: fase no comum de um, retorno no comum do outro.',full:'Paralelo: os retornos 1-1 e 2-2 ligam os dois interruptores.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{comps:[BAT(),C('SP1','sw3',120,60,0,{pos:0}),C('SP2','sw3',270,60,0,{pos:0}),C('L1','lamp',195,170,0)],
     real:[['SP1','🔀','interruptor de baixo'],['SP2','🔀','interruptor de cima'],['L1','💡','luz da escada']],
     goal:{leve:'Faça a luz da escada acender e apagar pelos dois interruptores.',moderado:'Three-way: SP1 e SP2 comandam L1, cada um invertendo o estado da luz.',full:'Comando three-way: fase no comum de SP1, retornos 1-1 e 2-2, comum de SP2 na lâmpada.'}[n],
     check:st=>comandoCheck(st,['SP1','SP2'])}]))},
 {id:'corredor',nome:'Corredor Comprido',sub:'Condomínio Mandacaru',kind:'bancada',tipo:'build',ic:'escada',cor:'#6b5512',
  card:{leve:'Três interruptores para a mesma luz.',moderado:'Four-way fica no meio dos dois paralelos.',full:'Intermediário: direto 1-3/2-4, cruzado 1-4/2-3.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{comps:[BAT(),C('SP1','sw3',105,60,0,{pos:0}),C('SI','sw4',190,60,0,{pos:0}),C('SP2','sw3',275,60,0,{pos:0}),C('L1','lamp',190,170,0)],
     real:[['SP1','🔀','interruptor da ponta 1'],['SI','✖️','interruptor do meio'],['SP2','🔀','interruptor da ponta 2'],['L1','💡','luz do corredor']],
     goal:{leve:'Os três interruptores do corredor têm que acender e apagar a mesma luz.',moderado:'Four-way: SP1 e SP2 nas pontas, SI no meio. Qualquer um inverte L1.',full:'Comando de 3 pontos: paralelos nas pontas, intermediário entre os dois retornos.'}[n],
     check:st=>comandoCheck(st,['SP1','SI','SP2'])}]))},
 {id:'garagem',nome:'Luz da Garagem',sub:'Seu Raimundo',kind:'bancada',tipo:'build',ic:'lua',cor:'#26324a',
  card:{leve:'Fotocélula acende sozinha quando escurece.',moderado:'Fotocélula: L na fase, N no neutro, C na carga.',full:'Relé fotoelétrico precisa de neutro para alimentar o sensor.'},
  dados:Object.fromEntries(['leve','moderado','full'].map(n=>[n,{comps:[BAT(),C('FC','foto',150,60,0,{noite:false}),C('L1','lamp',255,170,0)],
     real:[['FC','🌙','fotocélula'],['L1','💡','luz da garagem']],
     goal:{leve:'Ligue a fotocélula para a luz da garagem acender sozinha de noite.',moderado:'Fotocélula comandando L1: fase no L, neutro no N, carga no C.',full:'Relé fotoelétrico: alimentação L-N e saída C para a carga. Teste dia e noite.'}[n],
     check:st=>fotoCheck(st)}]))},
 {id:'impulso',nome:'Hall com Pulsadores',sub:'Condomínio Mandacaru',kind:'bancada',tipo:'build',ic:'impulso',cor:'#2b4f6e',
  card:{leve:'Cada toque no botão liga ou desliga a luz.',moderado:'Relé de impulso: pulsadores em paralelo na bobina.',full:'Telerruptor: cada pulso na bobina inverte o contato 1-2.'},
  dados:{
   leve:{comps:[BAT(),C('P1','btn',130,60,0,{nf:false}),C('RI','ri',230,60,0),C('L1','lamp',230,170,0)],
     real:[['P1','🟢','pulsador do hall'],['RI','🔁','relé de impulso no quadro'],['L1','💡','luz do hall']],
     goal:'Cada toque no pulsador P1 tem que acender ou apagar a luz do hall.',check:st=>impulsoCheck(st,['P1'])},
   moderado:{comps:[BAT(),C('P1','btn',110,60,0,{nf:false}),C('P2','btn',175,60,0,{nf:false}),C('RI','ri',250,60,0),C('L1','lamp',250,170,0)],
     real:[['P1','🟢','pulsador da entrada'],['P2','🟢','pulsador da escada'],['RI','🔁','relé de impulso'],['L1','💡','luz do hall']],
     goal:'Relé de impulso: P1 e P2 em paralelo na bobina; cada pulso inverte L1.',check:st=>impulsoCheck(st,['P1','P2'])},
   full:{comps:[BAT(),C('P1','btn',110,60,0,{nf:false}),C('P2','btn',175,60,0,{nf:false}),C('RI','ri',250,60,0),C('L1','lamp',250,170,0)],
     real:[['P1','🟢','pulsador 1'],['P2','🟢','pulsador 2'],['RI','🔁','telerruptor'],['L1','💡','iluminação do hall']],
     goal:'Telerruptor: pulsadores NA em paralelo comandando A1-A2; contato 1-2 secciona a fase da carga.',check:st=>impulsoCheck(st,['P1','P2'])}
  }},
 {id:'surto',nome:'Raio na Serra',sub:'DPS e aterramento',kind:'quiz',tipo:'quiz',ic:'raio',cor:'#3a2a6e',
  card:{leve:'O DPS manda o surto do raio para o terra.',moderado:'DPS fica entre os condutores vivos e o PE, com fio curto.',full:'Uc: tensão máxima contínua que o DPS suporta sem conduzir.'},
  dados:{
   leve:[{q:'Dia de tempestade com raios. O que fazer com os aparelhos?',o:['Tirar da tomada quando der','Ligar todos','Mexer no quadro'],w:'Surto de raio pode queimar aparelhos.'},
         {q:'O DPS manda o surto para onde?',o:['Para o terra','Para o vizinho','Para o chuveiro'],w:'O terra escoa o excesso de energia com segurança.'},
         {q:'A haste de aterramento fica…',o:['Enterrada no chão','Em cima do telhado','Dentro da parede'],w:'Ela precisa de contato com o solo.'}],
   moderado:[{q:'O DPS fica ligado entre…',o:['Fase (e neutro) e o PE','Duas fases de circuitos diferentes','Neutro e a carga'],w:'Ele fica em paralelo, entre os condutores vivos e o terra.'},
         {q:'Por que o fio que liga o DPS ao PE deve ser curto?',o:['Fio longo aumenta a tensão que chega aos aparelhos no surto','Fio curto é mais barato','Senão o DR desarma'],w:'Quanto mais longo o fio, maior a queda indutiva no surto.'},
         {q:'A janela do DPS ficou vermelha. Isso indica…',o:['Que ele chegou ao fim da vida útil e precisa ser trocado','Que está funcionando','Que falta neutro'],w:'Muitos DPS sinalizam: verde protegendo, vermelho trocar.'}],
   full:[{q:'DPS com Uc = 275 V numa rede de 220 V fase-neutro. Uc significa…',o:['A tensão máxima que ele suporta continuamente sem conduzir','A potência máxima protegida','A tensão em que ele desliga o circuito'],w:'Uc é a máxima tensão de operação contínua.'},
         {q:'Em esquema TN-S, o DPS no quadro é ligado…',o:['Entre cada fase e o PE, e entre neutro e PE','Somente entre fases','Entre o neutro e a carga'],w:'Ligação típica em TN-S: L-PE e N-PE.'},
         {q:'O DPS classe II do quadro deve ter…',o:['A proteção de retaguarda indicada pelo fabricante','Nenhuma proteção','Um DR exclusivo de 300 mA em série'],w:'O fabricante indica o disjuntor ou fusível de retaguarda do DPS.'}]
  }},

 /* ===================== CAPÍTULO 3 · Chão de Fábrica (industrial) ===================== */
 {id:'turno',nome:'Primeiro Turno',sub:'Segurança e comandos',kind:'quiz',tipo:'quiz',ic:'capacete',cor:'#7a4a1f',
  card:{leve:'Máquina em manutenção: desligada, travada e sinalizada.',moderado:'O selo 13-14 segura a contatora ligada.',full:'Emergência tem prioridade e exige rearme intencional.'},
  dados:{
   leve:[{q:'Antes de mexer no motor da máquina, o eletricista…',o:['Desliga, trava e sinaliza o painel','Mexe com ele ligado, rápido','Pede para alguém segurar o botão'],w:'Bloqueio e etiqueta: ninguém liga sem querer.'},
         {q:'O botão verde da máquina serve para…',o:['Ligar','Desligar','Emergência'],w:'Verde liga. Vermelho desliga.'},
         {q:'A contatora é como…',o:['Um interruptor que liga sozinho quando a bobina recebe energia','Uma lâmpada','Um fio grosso'],w:'A bobina puxa os contatos e o motor liga.'}],
   moderado:[{q:'Para que serve o contato de selo (13-14) na partida direta?',o:['Manter a bobina ligada depois de soltar a botoeira liga','Proteger contra curto','Inverter o sentido do motor'],w:'Ele fica em paralelo com a botoeira liga.'},
         {q:'O relé térmico desarma quando…',o:['O motor puxa corrente acima do ajuste por um tempo (sobrecarga)','Falta neutro','A tensão sobe'],w:'Ele aquece com a corrente; acima do ajuste, abre o 95-96.'},
         {q:'A botoeira desliga é NF porque…',o:['Se o fio dela romper, a máquina para','É mais barata','Gasta menos energia'],w:'Comando por contato NF: a falha leva ao desligamento, o lado seguro.'}],
   full:[{q:'NR-12: a parada de emergência deve…',o:['Ter prioridade sobre as outras funções e exigir rearme intencional','Ficar escondida para não ser apertada à toa','Religar a máquina ao soltar'],w:'NR-12 (12.6.3, 12.6.5 e 12.6.8): prevalece sobre os outros comandos, o botão fica retido e o rearme é manual, depois de corrigir o problema. A cor vermelho sobre amarelo vem da norma de equipamento elétrico de máquinas (IEC 60204-1).'},
         {q:'Na partida direta, a corrente de partida de um motor de indução fica em torno de…',o:['6 a 8 vezes a nominal','Igual à nominal','Metade da nominal'],w:'Por isso existem partidas que reduzem o pico, como a estrela-triângulo.'},
         {q:'O relé térmico é ajustado pela…',o:['Corrente nominal do motor (placa)','Potência da lâmpada do painel','Tensão da bobina'],w:'Ajusta-se pela corrente nominal da placa do motor.'}]
  }},
 {id:'partida',nome:'Partida Direta',sub:'Esteira da castanha',kind:'bancada',tipo:'build',ic:'motor',cor:'#4f6f94',
  card:{leve:'Verde liga, vermelho desliga, e o selo segura.',moderado:'LIGA em paralelo com o selo; DESLIGA (NF) antes dos dois.',full:'Partida direta: 95-96 em série com a bobina; motor pelo 1-2 da contatora e do relé.'},
  dados:{
   leve:{comps:[BAT(),C('BD','btn',130,60,0,{nf:true}),C('BL','btn',210,60,0,{nf:false}),C('K','kc',160,170,0),C('M','motor',272,170,0)],
     real:[['BL','🟢','botão liga'],['BD','🔴','botão desliga'],['K','🧲','contatora'],['M','⚙️','motor da esteira']],
     goal:'O motor liga no verde, continua ligado ao soltar e para no vermelho. Não esqueça o terra do motor!',check:st=>partidaCheck(st,false)},
   moderado:{comps:[BAT(),C('FT','ft',115,60,0),C('BD','btn',190,60,0,{nf:true}),C('BL','btn',265,60,0,{nf:false}),C('K','kc',160,170,0),C('M','motor',272,170,0)],
     real:[['BL','🟢','botoeira liga'],['BD','🔴','botoeira desliga'],['K','🧲','contatora'],['FT','🌡️','relé térmico'],['M','⚙️','motor da esteira']],
     goal:'Partida direta com selo e relé térmico: o 95-96 corta a bobina na sobrecarga.',check:st=>partidaCheck(st,true)},
   full:{comps:[BAT(),C('DJ','fuse',100,60,0),C('FT','ft',168,60,0),C('BD','btn',235,60,0,{nf:true}),C('BL','btn',300,60,0,{nf:false}),C('K','kc',160,170,0),C('M','motor',272,170,0)],
     real:[['DJ','🎚','disjuntor do circuito'],['BL','🟢','botoeira liga'],['BD','🔴','botoeira desliga'],['K','🧲','contatora'],['FT','🌡️','relé térmico'],['M','⚙️','motor da esteira']],
     goal:'Partida direta completa: DJ, comando com selo, 95-96 em série com a bobina e motor pelo 1-2 da contatora e do relé, com PE.',check:st=>partidaCheck(st,true)}
  }},
 {id:'sobrecarga',nome:'Sobrecarga!',sub:'Desafio no painel',kind:'bancada',tipo:'predict',ic:'sobrecarga',cor:'#7a2a24',
  card:{leve:'Sem selo, o motor para quando solta o botão.',moderado:'Relé térmico abre o 95-96 e derruba o selo.',full:'Depois do disparo, religar exige rearme e novo comando.'},
  dados:{
   leve:[{sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('FT',{trip:true}),acao:'A esteira travou e o relé térmico vai desarmar.',q:'O que acontece com o motor?',o:['Para','Continua girando','Gira mais rápido'],w:'O relé térmico protege o motor: ele corta a bobina e o motor para.'},
         {sc:()=>scPartida(true,{BL:{pressed:true}}),act:pecaSet('BL',{pressed:false}),acao:'Este painel está sem o selo. O operador vai soltar o botão verde.',q:'Ao soltar o verde, o motor…',o:['Para','Continua ligado','Liga a luz'],w:'Sem o selo, a contatora só fica ligada enquanto o botão está apertado.'},
         {sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('BD',{pressed:true}),acao:'O operador vai apertar o botão vermelho.',q:'Ao apertar o vermelho, o motor…',o:['Para','Continua girando','Liga de novo sozinho'],w:'O vermelho corta a bobina, e o selo solta junto.'}],
   moderado:[{sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('FT',{trip:true}),acao:'Sobrecarga: o relé térmico vai abrir o 95-96.',q:'Com o 95-96 aberto, o motor…',o:['Para, e só volta apertando LIGA depois de rearmar','Continua girando','Para e volta sozinho em seguida'],w:'O 95-96 corta a bobina; o selo cai junto. Religar exige rearme e novo LIGA.'},
         {sc:()=>scPartida(true,{BL:{pressed:true}}),act:pecaSet('BL',{pressed:false}),acao:'Painel sem o contato de selo. O operador vai soltar o LIGA.',q:'Ao soltar o LIGA…',o:['O motor desliga','O motor continua ligado','O relé térmico desarma'],w:'Sem o 13-14 em paralelo com o LIGA, a bobina só fica energizada com o botão apertado.'},
         {sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('BD',{pressed:true}),acao:'O operador vai apertar o DESLIGA (NF).',q:'Ao apertar o DESLIGA…',o:['A bobina perde a tensão e o motor para','Nada acontece','O motor acelera'],w:'O NF abre e corta a bobina; o selo cai junto.'}],
   full:[{sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('FT',{trip:true}),acao:'Rotor travado: o relé térmico vai atuar.',q:'Após a atuação do relé térmico…',o:['Bobina desenergizada; religamento exige rearme e novo comando LIGA','Motor continua até apertar DESLIGA','Contatora religa sozinha quando o bimetal esfriar'],w:'O 95-96 abre o circuito de comando; o selo cai e não há religamento automático.'},
         {sc:()=>scPartida(true,{BL:{pressed:true}}),act:pecaSet('BL',{pressed:false}),acao:'Comando montado sem o contato de selo. LIGA vai ser solto.',q:'Esse comando funciona como…',o:['Comando por impulso (jog): o motor só gira com o botão apertado','Partida direta normal','Reversão'],w:'Sem selo, a bobina só fica energizada enquanto o NA está fechado: é o comando "jog".'},
         {sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('BD',{pressed:true}),acao:'DESLIGA vai ser pressionado com o motor em regime.',q:'Por que a botoeira desliga é NF e fica antes do selo?',o:['Para cortar a bobina mesmo com o selo fechado; e se o fio romper, a máquina para','Para consumir menos corrente','Para permitir religar sem o LIGA'],w:'Em série antes do conjunto LIGA/selo, o NF desliga sempre, e a falha do fio leva ao lado seguro.'}]
  }},
 {id:'caixa',nome:'Caixa d\'Água',sub:'Bomba da fábrica',kind:'bancada',tipo:'build',ic:'agua',cor:'#2d6a8a',
  card:{leve:'Boia desce, bomba liga. Boia sobe, bomba desliga.',moderado:'A boia comanda a bobina; a contatora liga a bomba.',full:'Controle de nível: boia em série com A1-A2; bomba com PE.'},
  dados:{
   leve:{comps:[BAT(),C('BO','boia',140,60,0,{vazia:true}),C('M','motor',260,170,0)],
     real:[['BO','💧','boia da caixa d\'água'],['M','⚙️','bomba d\'água']],
     goal:'A bomba tem que ligar com a caixa vazia e desligar com a caixa cheia. Toque na caixa para testar.',check:st=>boiaCheck(st)},
   moderado:{comps:[BAT(),C('BO','boia',125,60,0,{vazia:true}),C('K','kc',200,170,0),C('M','motor',290,170,0)],
     real:[['BO','💧','boia da caixa d\'água'],['K','🧲','contatora da bomba'],['M','⚙️','bomba d\'água']],
     goal:'A boia comanda a bobina da contatora, e a contatora liga a bomba.',check:st=>boiaCheck(st)},
   full:{comps:[BAT(),C('BO','boia',125,60,0,{vazia:true}),C('K','kc',200,170,0),C('M','motor',290,170,0)],
     real:[['BO','💧','chave-boia de nível'],['K','🧲','contatora'],['M','⚙️','motobomba']],
     goal:'Controle automático de nível: boia em série com A1-A2, bomba pelo 1-2 da contatora, carcaça no PE.',check:st=>boiaCheck(st)}
  }},
 {id:'fimturno',nome:'Fim de Turno',sub:'Reversão e estrela-triângulo',kind:'quiz',tipo:'quiz',ic:'motor',cor:'#3d5a7a',
  card:{leve:'Frente e trás nunca ao mesmo tempo.',moderado:'Reversão: troca duas fases.',full:'Y-Δ reduz a corrente de partida a 1/3.'},
  dados:{
   leve:[{q:'Para a esteira andar para trás, o motor precisa…',o:['Girar ao contrário','Ficar mais forte','Desligar'],w:'Reversão é trocar o sentido de giro.'},
         {q:'Por que não se pode ligar "frente" e "trás" ao mesmo tempo?',o:['Dá curto e pode queimar tudo','Fica mais rápido','Nada acontece'],w:'Por isso existe o intertravamento.'},
         {q:'Motor grande puxa muita energia na partida. Para ajudar, usamos…',o:['Partida estrela-triângulo','Mais lâmpadas','Fio mais fino'],w:'Ela diminui o pico de corrente na partida.'}],
   moderado:[{q:'Na reversão de um motor trifásico, o que se troca?',o:['Duas das três fases','As três fases','A fase pelo neutro'],w:'Trocar duas fases inverte o campo girante.'},
         {q:'O intertravamento da reversão é feito com…',o:['Um contato NF de uma contatora em série com a bobina da outra','Dois disjuntores','Um DR'],w:'Assim as duas contatoras nunca ligam juntas.'},
         {q:'Na estrela-triângulo, o motor parte em…',o:['Estrela e depois passa para triângulo','Triângulo e depois estrela','Estrela o tempo todo'],w:'Em estrela cada bobina recebe a tensão dividida por √3: menos corrente na partida.'}],
   full:[{q:'A estrela-triângulo reduz a corrente de partida da linha para cerca de…',o:['1/3 da partida direta','1/2 da partida direta','1/√3 da corrente nominal'],w:'Corrente de linha em estrela = 1/3 da partida direta em triângulo. O torque também cai a 1/3.'},
         {q:'Motor 380/660 V numa rede de 380 V pode partir em estrela-triângulo?',o:['Sim: em triângulo ele trabalha em 380 V','Não, precisa de 660 V','Só com inversor de frequência'],w:'Para Y-Δ, a tensão da rede tem que ser a tensão de triângulo do motor.'},
         {q:'Quantos terminais o motor precisa ter para estrela-triângulo?',o:['6 (U1, V1, W1, U2, V2, W2)','3','4'],w:'As duas pontas de cada bobina saem para o painel.'}]
  }}
];
const CHEER={leve:['Você consegue!','Pensa com calma.','Sem pressa.'],moderado:['Bora energizar!','Foco no circuito!','Partiu bancada!'],full:['Modo profissional ativado.','Confere a norma!','Cálculo na ponta.']};
const PRAISE={leve:['Muito bem!','Isso aí!','Arrasou!'],moderado:['Mandou bem!','Na mosca!','Certo!'],full:['Correto.','Preciso.','Na norma.']};
const charOf=()=>CHARS.find(c=>c.id===S.char)||CHARS.find(c=>c.id==='tecnico');

function speak(t){try{const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.rate=L()?.9:1;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function talk(text){return '<div class="talk">'+charSVG(S.char)+'<div class="bubble">'+text+'</div></div>'}
function stars(n){let s='';for(let i=1;i<=3;i++)s+=i<=n?'★':'<span class="off">★</span>';return '<span class="stars" aria-label="'+n+' de 3 estrelas">'+s+'</span>'}
function hud(){
  const lvl=Math.floor(S.xp/100)+1,pct=S.xp%100;
  const rk=rankOf(),st=streak();
  return '<header class="hud"><button class="av" id="toFicha" aria-label="Abrir minha ficha">'+charSVG(S.char)+'</button><div class="who"><div class="nm">'+esc(S.name||charOf().nome)+' · '+rk.r.n+'</div><div class="xpbar"><i style="width:'+Math.round(rk.p*100)+'%"></i></div></div>'+(window.VOLT_TESTE?'<span class="chip teste-chip" title="Modo teste: progresso separado">🧪</span>':'')+(st?'<span class="chip fire" title="dias seguidos">🔥 '+st+'</span>':'')+'<span class="chip">⚡ '+S.xp+'</span><button class="iconbtn" id="toAlbum" aria-label="Álbum de cards">'+S.cards.length+' 🃏</button></header>';
}
function setMode(){document.body.classList.toggle('leve',L())}
function bindHud(){const a=document.getElementById('toAlbum');if(a)a.onclick=showAlbum;const f=document.getElementById('toFicha');if(f)f.onclick=showFicha}

