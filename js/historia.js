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


/* personagens com arte própria (img/<id>.webp e img/<id>_body.webp); os outros seguem com o desenho simples */
['chico','fatima','lia','socorro','damiao','rayane','raimundo'].forEach(k=>{if(IMG[k]&&IMG[k+'_body']){NPC[k].body=IMG[k+'_body'];NPC[k].svg=picSVG(IMG[k])}});
const CHAPTERS=[
 {id:'cap1',nome:'A Casa Acesa',tema:'Fundamentos e circuitos',fases:['faisca','lanterna','entrada','seguranca','primeiro','previsao','paralelo','defeito','ohm','renovavel'],
  intro:[['chico','Gente nova na oficina! Boas-vindas, {nome}.'],['eu','Bom dia, Mestre! Pronto pra começar o serviço!'],['chico','Calma. Primeiro a gente treina aqui na bancada da oficina. Depois vamos atender clientes de verdade.'],['chico','Começamos pelo básico: de onde vem a energia e como ela chega até uma lâmpada.']],
  fim:[['fatima','Mestre Chico! Agora a casa inteira apagou! Nenhuma luz e nenhuma tomada funcionam!'],['chico','Quando a casa toda apaga, o problema não é uma lâmpada. Precisamos olhar o quadro de distribuição.'],['eu','Então vamos ver o quadro da casa dela?'],['chico','Esse é o próximo capítulo, {nome}. Lá você vai aprender disjuntor geral e DR.']]},

 /* Cada capítulo é uma história própria, com personagens e biblioteca de peças (BIBLIOTECAS em fases.js).
    Um capítulo só abre quando o anterior estiver completo (no modo teste, tudo abre). */
 {id:'cap2',nome:'Do Quadro ao Condomínio',tema:'Instalação predial',fases:['quadro','quadronovo','escada','corredor','garagem','impulso','surto'],
  intro:[['fatima','Que alívio ver vocês! Desde ontem a casa toda está apagada.'],
    ['chico','Hoje eu trouxe reforço, Dona Fátima. {nome}, este serviço você faz com a Engenheira Lia.'],
    ['lia','Bom dia, Dona Fátima. Sou a Engenheira Lia, responsável técnica da obra do condomínio aqui da rua.'],
    ['lia','O Mestre Chico me falou de você, {nome}. O quadro dela é antigo: não tem DR nem DPS. Hoje montamos o quadro novo com o DR; o DPS a gente estuda com calma depois.'],
    ['eu','Quadro novo, com DR. Bora!'],
    ['lia','Depois, a síndica do Condomínio Mandacaru precisa da gente: escada, corredor, garagem e hall.']],
  fim:[['socorro','Escada, corredor, garagem e hall funcionando. O Mandacaru inteiro agradece, {nome}!'],
    ['lia','Você está pronto para coisa maior. Um amigo meu tem uma fábrica de castanha de caju, e a esteira vive parando.'],
    ['eu','Fábrica? Motor, contatora, botoeira... bora!'],
    ['lia','Próximo capítulo: Chão de Fábrica.']]},
 {id:'cap3',nome:'Chão de Fábrica',tema:'Instalação industrial e comandos',fases:['turno','partida','sobrecarga','caixa','fimturno'],
  breve:['Partida com reversão (motor trifásico)','Partida estrela-triângulo'],
  intro:[['damiao','Seja bem-vindo à Caju Dourado! Sou o Damião. A Engenheira Lia falou muito bem de você.'],
    ['damiao','Aqui a castanha vira emprego para o sertão inteiro.'],
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
  lanterna:{
   leve:[['chico','Agora a primeira montagem: uma lanterna. Duas pilhas, uma lâmpada e fio.'],['chico','Pilha tem dois lados, o + e o −. A energia sai de um, passa pela lâmpada e volta pelo outro.'],['eu','Então o caminho tem que ser fechado, de ponta a ponta!'],['chico','Isso. E com as duas pilhas certinhas, a lâmpada acende forte. Bora ver?']],
   moderado:[['chico','Primeira montagem, em corrente contínua: duas pilhas de 1,5 V e uma lâmpada de lanterna de 3 V.'],['chico','Na pilha a corrente sai pelo + e volta pelo −. Polaridade importa.'],['eu','Para dar 3 V, as pilhas vão em série: o − de uma no + da outra.'],['chico','Exato. Põe o interruptor no caminho e me mostra a lanterna acesa.']],
   full:[['chico','Lanterna de 3 V: lâmpada de 3 V e 0,3 A. Na caixa tem três pilhas de 1,5 V.'],['chico','Monte com o interruptor e decida quantas pilhas usar. Tensão demais rompe o filamento.'],['eu','Duas em série dão 3 V. Pela lei de Ohm, a lâmpada tem uns 10 Ω e puxa uns 0,3 A.'],['chico','Então prova na bancada.']]},
  entrada:[['chico','Pilha dá para a lanterna. A energia da casa inteira vem de mais longe: do poste.'],['chico','Olha pela janela da oficina: lá no poste tem o transformador, e na parede tem o medidor.'],['chico','É por esse caminho que a energia chega. {nome}, me mostra que você entendeu.']],
  primeiro:[['chico','Agora a bancada é de 220 V, igual à rede da casa: fonte, interruptor e lâmpada.'],['chico','Na régua da fonte, L1 é a fase e N é o neutro. O neutro já chega aterrado pela fonte.'],['chico','A fonte não tem terra. Quando precisar, você crava a haste no chão e liga no BEP. E na obra, confira a fase com o instrumento antes de ligar.'],['chico','Ligue do jeito da NBR 5410: fase no interruptor, retorno até a lâmpada e neutro azul-claro direto no bocal.']],
  previsao:[['chico','Ainda na bancada: eletricista bom prevê o que vai acontecer antes de ligar. Topa um desafio?'],['eu','Topo! Vou pensar antes de responder.']],
  paralelo:[['fatima','Bom dia! Sou a Dona Fátima, moro aqui na rua. Quero colocar duas lâmpadas na minha sala.'],['fatima','E quero as duas bem fortes, viu?'],['chico','Primeira cliente, {nome}! Cuidado: tem um jeito de ligar que deixa as duas fraquinhas.']],
  defeito:[['fatima','Mestre, a lâmpada da minha cozinha não acende mais! As outras luzes da casa estão funcionando.'],['chico','Se só a cozinha apagou, o problema está no circuito da cozinha. Vamos testar peça por peça: aqui não se troca nada no chute.']],
  renovavel:[['fatima','Mestre, com a conta alta desse jeito... Minha vizinha instalou placa solar. Isso é energia que não acaba?'],['chico','Boa pergunta. {nome}, explica pra ela de onde vem cada energia.']],
  seguranca:[['chico','A rede de 220 V machuca de verdade. Antes de mexer nela, a parte mais importante do ofício.'],['eu','Segurança primeiro!']],
  ohm:[['fatima','E por que a minha conta de luz vem tão alta?'],['chico','Hora de fazer conta: potência, tempo e consumo.']],
  /* Cap. 2 */
  quadro:[['lia','Antes de abrir o quadro, me diga: para que serve cada peça dele?']],
  quadronovo:[['lia','O quadro novo: disjuntor geral (DG) na entrada, depois o DR, e um disjuntor para cada circuito.'],['lia','Atenção: o neutro dos circuitos volta pelo DR. Se voltar por fora, ele desarma.']],
  escada:[['socorro','Sou a Socorro, síndica do Mandacaru. O povo sobe a escada no escuro!'],['socorro','Quero acender embaixo e apagar lá em cima. E o contrário também.'],['lia','Isso é o interruptor paralelo, o three-way: um em cada ponta da escada.']],
  corredor:[['socorro','E o corredor comprido? Tem porta nas duas pontas e uma no meio.'],['lia','Três pontos de comando: um paralelo em cada ponta e um intermediário, o four-way, no meio.']],
  garagem:[['raimundo','Boa tarde! Sou o Raimundo, porteiro. Todo dia eu esqueço a luz da garagem acesa.'],['lia','Uma fotocélula resolve: ela acende sozinha quando escurece e apaga de manhã.']],
  impulso:[['socorro','No hall tem dois pulsadores. Cada toque deve acender ou apagar a luz.'],['lia','Isso é o relé de impulso: cada pulso na bobina inverte o contato.']],
  surto:[['raimundo','Ontem caiu um raio perto e queimou o interfone!'],['lia','Faltava o DPS, aquele que eu falei no quadro da Dona Fátima. Vamos ver se você sabe como ele protege a instalação.']],
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
  let i=0,typing=null;if(!document.body.dataset.cap)ceu();
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
  card:{leve:'Água com sais conduz: mão molhada e eletricidade não combinam.',moderado:'Fio mais fino tem mais resistência e esquenta mais: P = R × I².',full:'Rendimento é medido sobre a entrada: perdas = Pentrada − Psaída.'},
  dados:{
   leve:[{q:'A capa da extensão rachou e o chão está molhado. Por que isso é perigoso, mesmo sem tocar no cobre?',o:['A água conduz e leva a eletricidade até você','O plástico rachado passa a conduzir eletricidade também','A umidade aumenta a força da eletricidade na tomada'],w:'O plástico continua isolante, mesmo rachado. O perigo é a água: ela tem sais e conduz, e faz a ponte entre o cobre e você. A tomada continua com a mesma tensão.'},
         {q:'O carregador ficou na tomada sem o celular e continua morno horas depois. O que isso mostra?',o:['Ele ainda puxa um pouco de energia, que vira calor','Ele está guardando energia para a próxima carga','Ele ainda não esfriou da última vez que carregou'],w:'Calor aparece quando energia se transforma. Morno horas depois quer dizer que ele está consumindo agora: é o consumo em espera. Carregador não guarda energia; quem guarda é a bateria.'},
         {q:'Duas extensões do mesmo tamanho, uma de fio fino e outra de fio grosso, ligam o mesmo aquecedor. Qual esquenta mais?',o:['A de fio fino','A de fio grosso, porque tem mais cobre','As duas igual, porque o aquecedor é o mesmo'],w:'Pelas duas passa a mesma corrente. O fio fino oferece mais dificuldade a ela e transforma mais energia em calor. Mais cobre não esquenta mais: dá mais espaço para a corrente.'}],
   moderado:[{q:'Água destilada quase não conduz. Por que a água da torneira é perigosa perto da eletricidade?',o:['Os sais dissolvidos formam íons, que conduzem corrente','O oxigênio da água é condutor, como o cobre','O cloro do tratamento é que conduz a corrente'],w:'A água pura tem pouquíssimas cargas livres. Os sais da água comum se separam em íons, e são eles que levam a corrente. Por isso áreas molhadas pedem DR.'},
         {q:'Um carregador puxa 12 W da tomada e entrega 10 W ao celular. O que acontece com os 2 W?',o:['Viram calor no carregador','Voltam para a rede pelo neutro','Ficam guardados no transformador do carregador'],w:'Energia não some nem fica guardada no carregador: os 2 W são perdas em calor. Rendimento = 10 ÷ 12 ≈ 83 %. Pelo neutro volta corrente, não energia que sobrou.'},
         {q:'Mesma corrente em 1,5 mm² e em 2,5 mm², mesmo comprimento. Qual dissipa mais calor?',o:['O de 1,5 mm²: tem maior resistência','O de 2,5 mm²: tem mais cobre para aquecer','Os dois igual: a corrente é a mesma'],w:'R = ρ × L ÷ S: seção menor, resistência maior. Com a mesma corrente, P = R × I² é maior no fio fino.'}],
   full:[{q:'Por que a NBR 5410 exige DR ≤ 30 mA em locais com banheira ou chuveiro?',o:['Pele molhada tem resistência menor e passa mais corrente','A umidade eleva a tensão da rede nesses locais','O disjuntor termomagnético não consegue atuar em ambiente úmido'],w:'I = U ÷ R. Pele molhada tem resistência bem menor que seca: com 127 ou 220 V, a corrente no corpo pode passar de 30 mA. O DR atua com fuga até 30 mA; o disjuntor nem percebe correntes tão pequenas (NBR 5410, 5.1.3.2.2).'},
         {q:'Uma fonte com rendimento de 80 % entrega 40 W à carga. Quanto ela dissipa em calor?',o:['10 W','32 W','50 W'],w:'Pentrada = 40 ÷ 0,8 = 50 W. Perdas = 50 − 40 = 10 W. 50 W é a potência de entrada, não a perda; 32 W aplica o rendimento sobre a saída (40 × 0,8), o erro mais comum.'},
         {q:'Circuito de 30 m (ida e volta = 60 m) em 2,5 mm², ρ = 0,0172 Ω·mm²/m, com 20 A. Potência perdida no cabo?',o:['≈ 165 W','≈ 83 W','≈ 8 W'],w:'R = 0,0172 × 60 ÷ 2,5 ≈ 0,41 Ω. P = R × I² = 0,41 × 400 ≈ 165 W. Esquecer a volta dá 83 W; esquecer o quadrado dá 8 W.'}]
  }},
 {id:'lanterna',nome:'Pilha e Lanterna',sub:'Fonte CC e polaridade',kind:'bancada',tipo:'build',ic:'pilha',cor:'#b5651d',cc:true,
  card:{leve:'Pilha tem + e −: em série, o − de uma no + da outra.',moderado:'Pilhas em série somam tensão: 1,5 V + 1,5 V = 3 V.',full:'I = V ÷ R: 3 V numa lâmpada de 10 Ω dão cerca de 0,3 A.'},
  dados:{
   leve:{comps:pecasLanterna(2,false),real:LANTERNA_REAL,goal:LANTERNA_GOAL.leve,check:lanternaCheck,sucesso:lanternaSucesso},
   moderado:{comps:pecasLanterna(2,true),real:LANTERNA_REAL,goal:LANTERNA_GOAL.moderado,check:lanternaCheck,sucesso:lanternaSucesso},
   full:{comps:pecasLanterna(3,true),real:LANTERNA_REAL,goal:LANTERNA_GOAL.full,check:lanternaCheck,sucesso:lanternaSucesso}}},
 {id:'entrada',nome:'Do Poste à Tomada',sub:'Transformador, medidor e CA',kind:'quiz',tipo:'quiz',ic:'multimetro',cor:'#2b5a4e',
  card:{leve:'Gasto = força do aparelho × tempo ligado.',moderado:'kW é potência; kWh é energia. Minutos viram horas antes de multiplicar.',full:'Em estrela, fase-fase = fase-neutro × √3: 380 V, não 440 V.'},
  dados:{
   leve:[{q:'Qual a diferença entre os fios do alto do poste e os que chegam na sua casa?',o:['Os do alto têm tensão muito maior; o transformador baixa','Os do alto são de telefone e internet','São iguais; o transformador guarda energia para a noite'],w:'No alto do poste passa a média tensão, milhares de volts. O transformador baixa para a tensão das casas. Ele não guarda energia, e os cabos de telefone e internet ficam mais embaixo.'},
         {q:'Lâmpada de 10 W acesa 10 horas, ou secador de 2000 W ligado 5 minutos. Qual pesa mais na conta?',o:['O secador, mesmo ligado pouco tempo','A lâmpada, porque ficou muito mais tempo acesa','Os dois igual: um compensa o outro'],w:'Gasto = força × tempo. Lâmpada: 10 W × 10 h = 100 Wh. Secador: 2000 W × 5 min ≈ 167 Wh. Tempo longo não basta: a potência pesa muito.'},
         {q:'Por que a tomada não tem "+" e "−", como a pilha?',o:['A corrente da tomada troca de sentido o tempo todo','O "+" da tomada fica escondido em um dos furos','Um furo tem energia e o outro é o terra'],w:'A tomada é corrente alternada: o sentido troca 120 vezes por segundo (60 Hz). Por isso se fala em fase e neutro. O neutro não é o terra: o terra é o terceiro furo.'}],
   moderado:[{q:'Por que a rede chega ao poste em 13,8 kV, e não em 220 V?',o:['Mais tensão, menos corrente: perde menos nos cabos','Porque 13,8 kV é mais seguro para quem está na rua','Porque a usina gera a energia direto em 13,8 kV'],w:'P = U × I. Subindo a tensão, a corrente cai, e a perda nos cabos (R × I²) cai com o quadrado. Não é mais seguro: por isso fica no alto. E a usina usa transformadores para chegar a esse nível.'},
         {q:'Um aparelho de 2 kW fica ligado 15 minutos. O medidor soma…',o:['0,5 kWh','30 kWh','2 kWh'],w:'15 min = 0,25 h. E = 2 kW × 0,25 h = 0,5 kWh. Multiplicar por 15 esquece de passar minutos para horas; 2 kWh confunde potência com energia.'},
         {q:'Na tomada 2P+T, qual contato tem tensão em relação ao terra?',o:['A fase; o neutro fica perto de 0 V','O neutro, porque a corrente volta por ele','Fase e neutro, cada um com metade'],w:'O neutro leva a corrente de volta, mas é aterrado na entrada e fica perto de 0 V. A tensão em relação ao terra está na fase. Metade em cada um seria uma ligação entre duas fases, não fase e neutro.'}],
   full:[{q:'Trafo 13,8 kV / 380-220 V, secundário em estrela aterrada. Entre duas fases do secundário você mede…',o:['380 V','220 V','440 V'],w:'Fase-neutro = 220 V. As fases estão defasadas 120°, então a diferença entre duas é 220 × √3 ≈ 380 V, e não a soma 440 V.'},
         {q:'Medidor com constante de 1 pulso por Wh. Com o chuveiro ligado, o LED pisca 90 vezes em 1 minuto. Potência do chuveiro?',o:['5,4 kW','1,5 kW','90 W'],w:'90 pulsos = 90 Wh em 1/60 h. P = 90 Wh ÷ (1/60 h) = 5400 W. Dividir 90 por 60 confunde as unidades; 90 W esquece que a contagem foi de só 1 minuto.'},
         {q:'Por que a distribuidora aterra o neutro no padrão de entrada (TN-C-S)?',o:['Para a falta fase-massa virar curto e a proteção atuar','Para o neutro poder fazer também o papel do PE na casa','Para o neutro deixar de levar corrente de volta'],w:'Com o neutro aterrado e as massas no PE, uma falta fase-massa fecha um caminho de baixa impedância: a corrente sobe e o disjuntor ou o DR atua. Depois da entrada, N e PE seguem separados, e o neutro continua levando a corrente de retorno.'}]
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
  card:{leve:'Disjuntor que desarma está avisando algo.',moderado:'O DR vê a diferença entre ida e volta, não a corrente total.',full:'Ib ≤ In ≤ Iz: o disjuntor protege o cabo.'},
  dados:{
   leve:[{q:'O disjuntor do chuveiro desarma toda vez que liga no "inverno". O que fazer?',o:['Chamar um eletricista para ver se fio e disjuntor aguentam','Trocar o disjuntor por um maior, que não desarma mais à toa','Usar no "verão", que puxa menos, e deixar como está'],w:'O disjuntor protege o fio. Um maior, com o mesmo fio, deixa o fio esquentar sem proteção: é assim que começam incêndios. Usar só no verão esconde o problema.'},
         {q:'Vai trocar a lâmpada do quarto. O que é seguro?',o:['Desligar o disjuntor daquele circuito antes','Apagar no interruptor, que já corta a energia','Usar luva de cozinha e trocar com a luz apagada'],w:'Se o interruptor estiver ligado no fio errado, o bocal fica com energia mesmo com a luz apagada. Seguro é desligar o disjuntor. Luva de cozinha não é luva isolante.'},
         {q:'A carcaça de uma máquina de lavar com defeito dá choque. Quem desliga rápido para proteger a pessoa?',o:['O DR, que percebe a corrente escapando','O disjuntor comum, que desarma no curto','O interruptor da parede da lavanderia'],w:'A corrente que passa pelo corpo é pequena demais para o disjuntor comum perceber. O DR compara o que vai e o que volta e desliga com diferença de até 30 mA.'}],
   moderado:[{q:'Fio de 1,5 mm² protegido por disjuntor de 20 A. Está…',o:['Errado: com 20 A o fio esquenta antes de o disjuntor abrir','Certo: o disjuntor maior evita desarmes à toa com muita carga','Certo, se a carga ligada puxar menos de 15 A'],w:'O disjuntor protege o fio. Em eletroduto na parede, 1,5 mm² conduz 17,5 A (NBR 5410, tabela 36). Mesmo com carga pequena hoje, nada impede de ligarem mais aparelhos: o disjuntor tem que proteger o fio sozinho.'},
         {q:'Por que o interruptor tem que cortar a fase, e não o neutro?',o:['Para o bocal ficar sem tensão com a lâmpada apagada','Porque cortando o neutro a lâmpada não apaga','Para o disjuntor conseguir atuar num curto'],w:'Cortando o neutro a lâmpada apaga do mesmo jeito, mas o bocal continua na fase: quem encosta toma choque. O disjuntor atua igual nos dois casos. E, para trocar a lâmpada, desligue o disjuntor (NBR 5410, 5.6.6.1.2).'},
         {q:'Uma pessoa isolada do chão encosta na fase e no neutro ao mesmo tempo. O DR de 30 mA…',o:['Não atua: tudo que entra pela fase volta pelo neutro','Atua, porque a fase manda corrente pelo corpo da pessoa','Atua só se a corrente passar de 30 A'],w:'O DR só vê diferença entre ida e volta. Entre fase e neutro, a corrente que passa pelo corpo volta inteira pelo neutro: ele não percebe. Por isso o DR não substitui isolamento nem desligamento.'}],
   full:[{q:'Circuito de tomadas com Ib = 18 A, cabo 2,5 mm² em eletroduto embutido (Iz = 24 A, método B1). Qual disjuntor atende?',o:['20 A','25 A','16 A'],w:'NBR 5410 (5.3.4.1): Ib ≤ In ≤ Iz. 16 A desarmaria com a carga normal; 25 A passa dos 24 A que o cabo conduz (tabela 36, B1, dois condutores carregados). Com disjuntor da NBR NM 60898, a atuação garantida em 1,45 In também atende I2 ≤ 1,45 Iz.'},
         {q:'Pela NR-10, logo depois de seccionar o circuito, o próximo passo é…',o:['Constatar a ausência de tensão','Instalar o aterramento temporário','Sinalizar o impedimento'],w:'NR-10 (10.13.1): seccionar → constatar ausência de tensão → impedir reenergização → constatar de novo e aterrar temporariamente → proteger partes vivas próximas → sinalizar o impedimento → delimitar a área.'},
         {q:'DR com IΔn = 30 mA. Há uma fuga de 12 mA para o PE. O DR…',o:['Fica ligado: abaixo de 50 % de IΔn não deve atuar','Tem que atuar: fuga para o PE já caracteriza uma falta','Atua se a fuga durar mais de 5 s'],w:'O DR não deve atuar abaixo de 50 % de IΔn (15 mA) e tem que atuar até IΔn. Com 12 mA, fica ligado. Por isso a NBR 5410 (6.3.3.2.6 e nota) manda dividir os circuitos para que a fuga normal de cada um não passe de 50 % da corrente do DR que o protege.'}]
  }},
 {id:'ohm',nome:'Mestre Ohm',sub:'Contas que acendem',kind:'quiz',tipo:'quiz',ic:'ohm',cor:'#5a3a6e',
  card:{leve:'Em fila, as lâmpadas dividem a tensão e brilham bem menos.',moderado:'I = P ÷ U, com a tensão do próprio aparelho.',full:'Queda de tensão em circuito terminal: no máximo 4 % (NBR 5410, 6.2.7.2).'},
  dados:{
   leve:[{q:'Duas lâmpadas iguais em fila na mesma tomada. Comparando com uma lâmpada sozinha, cada uma brilha…',o:['Bem menos que a metade','Igual: a tomada é a mesma','Metade, e as duas juntas brilham como uma'],w:'Em fila, cada lâmpada fica com metade da tensão. Com metade da tensão, recebe só um quarto da potência: as duas juntas brilham menos que uma sozinha.'},
         {q:'Chuveiro de 5500 W ligado 30 minutos por dia, ou geladeira cuja etiqueta diz 35 kWh por mês. Qual pesa mais na conta?',o:['O chuveiro, mesmo ligado pouco tempo','A geladeira, que fica ligada dia e noite','Os dois gastam parecido no fim do mês'],w:'Gasto = força do aparelho × tempo. Chuveiro: 5,5 kW × 0,5 h × 30 dias ≈ 82 kWh no mês, mais que o dobro dos 35 kWh da geladeira. Ficar ligada o dia todo não basta: a geladeira tem potência baixa, e o motor dela liga e desliga.'},
         {q:'O chuveiro novo é bem mais forte que o antigo. Basta trocar o chuveiro?',o:['Não: é preciso ver se o fio e o disjuntor aguentam','Sim: o fio que já está na parede aguenta o chuveiro novo','Basta trocar o disjuntor por um maior'],w:'Chuveiro mais forte puxa mais corrente. Fio fino esquenta, e um disjuntor maior sozinho deixa o fio sem proteção. Fio e disjuntor se escolhem juntos.'}],
   moderado:[{q:'Dois resistores de 10 Ω em paralelo, ligados em 12 V. Corrente total?',o:['2,4 A','1,2 A','0,6 A'],w:'Req = 10 ÷ 2 = 5 Ω. I = 12 ÷ 5 = 2,4 A. 1,2 A é a corrente de um resistor só; 0,6 A seria com os dois em série.'},
         {q:'Ferro de passar de 1000 W, 30 min por dia, durante 30 dias. Consumo?',o:['15 kWh','30 kWh','900 kWh'],w:'1 kW × 0,5 h × 30 = 15 kWh. 30 kWh esquece que 30 min é meia hora; 900 kWh usa os minutos como se fossem horas.'},
         {q:'Chuveiro de 5500 W / 220 V. Corrente de projeto?',o:['25 A','43 A','0,04 A'],w:'I = P ÷ U = 5500 ÷ 220 = 25 A. 43 A sai de dividir por 127 V, que não é a tensão desse chuveiro. 0,04 A inverte a conta (U ÷ P).'}],
   full:[{q:'Duas cargas de 60 W / 220 V ligadas em série em 220 V. Potência total?',o:['30 W','60 W','120 W'],w:'R de cada = 220² ÷ 60 ≈ 807 Ω. Em série, 1613 Ω: P = 220² ÷ 1613 ≈ 30 W. 120 W só em paralelo. (Considerando R constante; o filamento real muda com a temperatura.)'},
         {q:'Chuveiro de 7500 W, 4 banhos de 8 min por dia, 30 dias, tarifa de R$ 0,80/kWh. Custo no mês?',o:['R$ 96','R$ 24','R$ 3,20'],w:'E = 7,5 kW × (32 ÷ 60) h × 30 = 120 kWh. Custo = 120 × 0,80 = R$ 96. R$ 24 seria um banho por dia; R$ 3,20 é um dia só.'},
         {q:'10 A em 30 m de cabo 4 mm² (ida e volta = 60 m; ρ = 0,0172 Ω·mm²/m). Queda em 220 V?',o:['≈ 2,6 V (1,2 %)','≈ 1,3 V (0,6 %)','≈ 0,26 V (0,1 %)'],w:'R = 0,0172 × 60 ÷ 4 ≈ 0,26 Ω. ΔV = 10 × 0,26 ≈ 2,6 V: dentro do limite de 4 % dos circuitos terminais (NBR 5410, 6.2.7.2). 1,3 V esquece a volta do cabo (usa 30 m); 0,26 V esquece de multiplicar pela corrente.'}]
  }},

 /* ===================== CAPÍTULO 2 · Do Quadro ao Condomínio (predial) ===================== */
 {id:'quadro',nome:'O Quadro',sub:'Disjuntor geral, DR e DPS',kind:'quiz',tipo:'quiz',ic:'quadro',cor:'#2b4f7a',
  card:{leve:'Disjuntor: excesso de corrente. DR: fuga. DPS: surto.',moderado:'O DPS fica em paralelo, entre os vivos e o PE.',full:'Depois do DR, N e PE nunca se unem.'},
  dados:{
   leve:[{q:'Muitos aparelhos ligados fazem um fio esquentar. Quem desliga esse circuito no quadro?',o:['O disjuntor que protege aquele fio','O DR, que protege contra choque e sobrecarga','O DPS, que segura os excessos'],w:'Excesso de aparelhos é sobrecarga: quem cuida é o disjuntor. O DR só percebe corrente escapando para o terra. O DPS cuida de surtos rápidos, como o de um raio.'},
         {q:'Depois do DR, alguém juntou o fio azul (neutro) com o verde-amarelo (terra). O que acontece?',o:['O DR desarma: parte da volta foge pelo terra','Continua normal: neutro e terra vão para o chão igual','A proteção melhora: são dois fios de segurança'],w:'O DR compara o que vai pela fase com o que volta pelo neutro. Juntando neutro e terra depois dele, parte da volta escapa por fora: ele vê diferença e desarma. Neutro e terra só se juntam na entrada.'},
         {q:'Por que o DPS precisa estar ligado ao fio terra?',o:['É pelo terra que ele manda embora o excesso do raio','Ele usa o terra para medir a energia da casa','Ele não precisa: funciona sozinho no quadro'],w:'O DPS desvia o surto para o terra. Sem terra ligado, ele não tem para onde mandar o excesso e não protege nada.'}],
   moderado:[{q:'Sobrecarga, fuga à terra e surto de raio. Quem atua em cada caso, nessa ordem?',o:['Disjuntor, DR e DPS','DR, disjuntor e DPS','DPS, DR e disjuntor'],w:'Sobrecarga é corrente acima do previsto: disjuntor. Fuga é diferença entre ida e volta: DR. Surto é sobretensão de microssegundos: DPS.'},
         {q:'O DR desarma ao ligar o chuveiro novo. O neutro desse circuito foi tirado da barra de neutro antes do DR. Por quê?',o:['A volta não passa pelo DR: para ele, tudo é fuga','O chuveiro puxa mais de 30 mA e passa do limite','O DR mede a corrente total, e o chuveiro é forte demais'],w:'O DR compara ida e volta que passam por dentro dele. Se a volta usa um neutro de fora, para ele é como se toda a corrente estivesse fugindo. Os 30 mA são de diferença, não de consumo.'},
         {q:'O DPS é ligado em série ou em paralelo com o circuito?',o:['Paralelo: entre os condutores vivos e o PE','Série: a corrente da casa passa por ele e é filtrada','Série, no condutor neutro'],w:'Em serviço normal, o DPS quase não conduz. No surto, ele vira um caminho fácil para o PE, em paralelo com a instalação. Em série, teria que conduzir a corrente da casa toda.'}],
   full:[{q:'Interruptor DR de 25 A, depois de um disjuntor geral de 40 A, alimenta circuitos que somam 35 A. Qual o problema?',o:['O DR não abre por sobrecorrente e vai aquecer','Não há problema: o DR desarma sozinho acima de 25 A','O DR entende os 35 A como fuga e desarma'],w:'Interruptor DR não tem disparador de sobrecorrente: com 35 A ele aquece sem abrir. A NBR 5410 (6.3.6.2.2) exige que outro dispositivo garanta essa proteção, e o geral de 40 A deixa passar os 35 A.'},
         {q:'Por que o condutor PE não passa por dentro do DR?',o:['A fuga tem que voltar por fora para criar a diferença','O PE não tem tensão nenhuma, então não precisa passar','O DR não suporta a corrente de falta no PE'],w:'O DR soma fase e neutro. A corrente de fuga volta pelo PE, por fora dele, e é isso que cria a diferença que ele mede. Se o PE passasse por dentro, a fuga se anularia. NBR 5410 (6.3.3.2.5): o circuito magnético do DR envolve os condutores vivos, mas nenhum condutor de proteção.'},
         {q:'Prédio com SPDA (para-raios). Pela NBR 5410, o DPS da entrada deve ser escolhido por…',o:['Corrente de impulso Iimp, para a descarga direta','Corrente nominal In de 5 kA, como numa casa','Tensão Uc maior, sem olhar a corrente do raio'],w:'Com risco de descarga direta, como num prédio com SPDA, o DPS da entrada tem que suportar a corrente de impulso Iimp: calculada pela IEC 61312-1 ou, sem esse cálculo, no mínimo 12,5 kA por modo de proteção (NBR 5410, 6.3.5.2.4-d). In de 5 kA (8/20 µs) é o mínimo para surtos que chegam pela linha. Uc trata da tensão contínua, não da energia do raio. No comércio, esse DPS costuma ser chamado de classe I.'}]
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
  card:{leve:'DPS com janela vermelha não protege mais: troque.',moderado:'O disjuntor não segura surto: ele dura microssegundos.',full:'Cada metro de fio do DPS soma cerca de 1 kV num surto.'},
  dados:{
   leve:[{q:'Dia de tempestade com raios. Qual atitude protege mais os aparelhos?',o:['Tirar da tomada a TV e o computador','Apagar a luz no interruptor da sala','Deixar ligado: o disjuntor desarma no raio'],w:'O surto de um raio é rápido demais para o disjuntor. O interruptor da luz não desliga TV nem computador. Fora da tomada, o surto não chega ao aparelho.'},
         {q:'Para o DPS funcionar bem, o fio dele até o terra deve ser…',o:['O mais curto e reto possível','Longo, para o surto perder força no caminho','Enrolado, para a sobra caber no quadro'],w:'Fio longo ou enrolado atrapalha a passagem rápida do surto e deixa chegar mais tensão aos aparelhos. Curto e reto é o certo.'},
         {q:'A janelinha do DPS ficou vermelha, mas a luz da casa funciona. O que fazer?',o:['Trocar o DPS: ele parou de proteger','Deixar como está: se a luz funciona, ele funciona','Desligar e religar o DPS para voltar ao verde'],w:'A casa funciona porque o DPS fica ao lado do circuito, não no caminho. O vermelho indica fim da vida útil: ele não protege mais e não rearma. Tem que trocar.'}],
   moderado:[{q:'O disjuntor protege os aparelhos contra o surto de um raio?',o:['Não: é rápido demais para ele abrir','Sim: o disparo magnético é instantâneo','Sim, se for curva B, que é mais rápida'],w:'O surto dura microssegundos. O disjuntor protege contra sobrecorrente; quem limita a sobretensão é o DPS, desviando o surto para o PE.'},
         {q:'Por que a ligação do DPS ao PE deve ser curta?',o:['Fio longo soma tensão indutiva, que chega aos aparelhos','Fio longo esquenta com o surto e acaba queimando o DPS logo','Fio curto evita que o DR desarme junto com o surto'],w:'No surto a corrente muda muito rápido, e a indutância do fio cria tensão extra, que se soma à do DPS e chega aos aparelhos. A NBR 5410 (6.3.5.2.9) pede ligações o mais curtas possível, sem curvas ou laços, de preferência até 0,5 m no total.'},
         {q:'Rede de 220 V fase-neutro. Por que não usar um DPS de Uc = 175 V, que "protege mais cedo"?',o:['Ele conduziria com a tensão normal e se destruiria','Ele protegeria melhor os aparelhos, mas custa mais caro','Ele faria o disjuntor geral desarmar no surto'],w:'Uc é a maior tensão que o DPS aguenta continuamente sem conduzir. Com 220 V e as variações da rede, um de 175 V conduziria o tempo todo, aqueceria e falharia.'}],
   full:[{q:'O DPS tem Up = 1,5 kV. O que isso significa para os equipamentos?',o:['Recebem até 1,5 kV mais a queda nos fios do DPS','Recebem no máximo os 220 V da rede durante o surto','O DPS desliga o circuito acima de 1,5 kV'],w:'Up é o nível de proteção: a tensão que sobra nos bornes do DPS durante o surto. O equipamento recebe Up mais a queda indutiva dos fios de ligação. A NBR 5410 (6.3.5.2.4-a) limita Up a 2,5 kV numa instalação 220/380 V. O DPS não desliga: conduz e depois volta a isolar.'},
         {q:'No surto, a corrente sobe 1 kA por microssegundo, e cada metro de fio tem cerca de 1 µH. Quanto 1 m a mais de fio soma?',o:['≈ 1 kV','≈ 1 V','≈ 1 mV'],w:'U = L × di/dt = 1 µH × 1 kA/µs = 1000 V por metro. Por isso a ligação do DPS deve ser a mais curta possível.'},
         {q:'Rede 220/380 V em esquema TN-S. Qual o Uc mínimo do DPS entre fase e PE?',o:['≈ 242 V (1,1 × U0)','220 V (igual a U0)','380 V (tensão entre fases)'],w:'Tabela 49 da NBR 5410 (6.3.5.2.4-b): em TN-S, entre fase e PE, Uc ≥ 1,1 × U0 = 1,1 × 220 ≈ 242 V; o modelo comercial de 275 V atende. Sem essa folga, as variações da rede fariam o DPS conduzir. 380 V seria para ligação entre fases.'}]
  }},

 /* ===================== CAPÍTULO 3 · Chão de Fábrica (industrial) ===================== */
 {id:'turno',nome:'Primeiro Turno',sub:'Segurança e comandos',kind:'quiz',tipo:'quiz',ic:'capacete',cor:'#7a4a1f',
  card:{leve:'Máquina em manutenção: desligada, travada e sinalizada.',moderado:'Relé térmico se ajusta pela corrente da placa do motor.',full:'Bloqueio é pessoal: um cadeado por trabalhador.'},
  dados:{
   leve:[{q:'O eletricista desligou o painel da esteira. Por que ainda coloca cadeado e etiqueta?',o:['Para ninguém religar sem saber que tem gente mexendo','Para mostrar ao chefe que o serviço foi feito','Porque o cadeado corta a energia melhor que a chave'],w:'Desligar não basta: outra pessoa pode religar. Cadeado e etiqueta impedem isso e mostram quem está trabalhando.'},
         {q:'O botão verde da esteira volta quando a gente solta. O que mantém a esteira girando?',o:['Um contato da contatora que segura a ligação (o selo)','O motor, que depois de girar não precisa de comando','O botão, que guarda que foi apertado'],w:'Ao ligar, a contatora fecha um contato extra que faz o papel do botão: é o selo. Se faltar energia, o selo solta e a máquina não volta sozinha.'},
         {q:'A esteira travou e o motor começou a esquentar. Quem desliga o motor antes de queimar?',o:['O relé térmico, que sente a corrente alta','O botão vermelho, que solta sozinho quando esquenta','A contatora, que derrete o contato e abre'],w:'Motor travado puxa corrente alta. O relé térmico aquece com ela e, depois de um tempo, abre o contato que desliga a contatora. O botão vermelho só age quando alguém aperta.'}],
   moderado:[{q:'Painel desligado e bloqueado com cadeado. Antes de tocar nos bornes do motor, falta…',o:['Testar com instrumento que não há tensão','Pode tocar: com o cadeado, está seguro','Avisar o operador para não apertar o LIGA'],w:'O bloqueio impede religar, mas não garante que a chave certa foi aberta nem que não há outra fonte. Por isso se constata a ausência de tensão (NR-10, 10.13.1).'},
         {q:'Faltou energia com a esteira ligada. Quando a energia volta, a esteira…',o:['Fica parada até alguém apertar o LIGA','Volta a girar sozinha: o selo estava fechado','Gira enquanto alguém segurar o LIGA'],w:'Sem tensão, a bobina solta e o selo 13-14 abre. Na volta da energia, nada fecha o circuito da bobina: precisa de novo LIGA. É a proteção contra religamento automático (NBR 5410, 5.5.5).'},
         {q:'Motor com 10 A na placa. Onde se ajusta o relé térmico?',o:['Em 10 A, a corrente nominal','Em 15 A, para dar folga na partida','Em 70 A, a corrente de partida'],w:'Ajusta-se pela corrente nominal da placa. A partida, de 6 a 8 × In, é curta, e o relé térmico demora para atuar. Ajuste acima da placa deixa o motor sem proteção.'}],
   full:[{q:'Duas equipes vão trabalhar no mesmo motor. Como fica o bloqueio?',o:['Cada trabalhador põe o próprio cadeado','Um cadeado do supervisor vale para as duas equipes','A primeira equipe bloqueia; a segunda confere'],w:'Bloqueio é pessoal: com uma garra de vários cadeados, cada um põe o seu e guarda a chave. Só se religa quando o último retirar o dele.'},
         {q:'NR-12: a parada de emergência deve…',o:['Ter prioridade e exigir rearme intencional','Desligar o motor e manter o comando pronto','Voltar ao normal quando o botão for solto'],w:'NR-12 (12.6.3, 12.6.5 e 12.6.8): prevalece sobre os outros comandos, o botão fica retido e o rearme é manual, depois de corrigir o problema. A cor vermelho sobre amarelo vem da norma de equipamento elétrico de máquinas (IEC 60204-1).'},
         {q:'Motor de In = 10 A, partida direta com Ip = 7 × In. Por que o disjuntor-motor não desarma nos 70 A da partida?',o:['A partida é curta e fica abaixo das curvas de disparo','O disjuntor-motor reconhece que é motor e ignora o pico','70 A ainda não é curto-circuito, e o disjuntor espera o curto'],w:'O pico de partida dura poucos segundos: fica abaixo da curva térmica, e o disparo magnético do disjuntor-motor é ajustado acima da corrente de partida (o valor exato está no catálogo do fabricante). Se o motor travar, a corrente alta continua e o térmico atua.'}]
  }},
 {id:'partida',nome:'Partida Direta',sub:'Esteira da castanha',kind:'bancada',tipo:'build',ic:'motor',cor:'#4f6f94',
  card:{leve:'Verde liga, vermelho desliga, e o selo segura.',moderado:'LIGA em paralelo com o selo; DESLIGA (NF) antes dos dois.',full:'Partida direta: 95-96 em série com a bobina; motor pelo 1-2 da contatora e do relé.'},
  dados:{
   leve:{comps:[BAT(),C('BD','btn',130,60,0,{nf:true}),C('BL','btn',210,60,0,{nf:false}),C('K','kc',160,170,0),C('M','motor',272,170,0),...ATERRA()],
     real:[['BL','🟢','botão liga'],['BD','🔴','botão desliga'],['K','🧲','contatora'],['M','⚙️','motor da esteira']],
     goal:'O motor liga no verde, continua ligado ao soltar e para no vermelho. Não esqueça o terra do motor: haste no BEP, BEP no motor!',check:st=>partidaCheck(st,false)},
   moderado:{comps:[BAT(),C('FT','ft',115,60,0),C('BD','btn',190,60,0,{nf:true}),C('BL','btn',265,60,0,{nf:false}),C('K','kc',160,170,0),C('M','motor',272,170,0),...ATERRA()],
     real:[['BL','🟢','botoeira liga'],['BD','🔴','botoeira desliga'],['K','🧲','contatora'],['FT','🌡️','relé térmico'],['M','⚙️','motor da esteira']],
     goal:'Partida direta com selo e relé térmico: o 95-96 corta a bobina na sobrecarga.',check:st=>partidaCheck(st,true)},
   full:{comps:[BAT(),C('DJ','fuse',100,60,0),C('FT','ft',168,60,0),C('BD','btn',235,60,0,{nf:true}),C('BL','btn',300,60,0,{nf:false}),C('K','kc',160,170,0),C('M','motor',272,170,0),...ATERRA()],
     real:[['DJ','🎚','disjuntor do circuito'],['BL','🟢','botoeira liga'],['BD','🔴','botoeira desliga'],['K','🧲','contatora'],['FT','🌡️','relé térmico'],['M','⚙️','motor da esteira']],
     goal:'Partida direta completa: DJ, comando com selo, 95-96 em série com a bobina e motor pelo 1-2 da contatora e do relé, com PE.',check:st=>partidaCheck(st,true)}
  }},
 {id:'sobrecarga',nome:'Sobrecarga!',sub:'Desafio no painel',kind:'bancada',tipo:'predict',ic:'sobrecarga',cor:'#7a2a24',
  card:{leve:'Sem selo, o motor para quando solta o botão.',moderado:'Relé térmico abre o 95-96 e derruba o selo.',full:'Depois do disparo, religar exige rearme e novo comando.'},
  dados:{
   leve:[{sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('FT',{trip:true}),acao:'A esteira travou e o relé térmico vai desarmar.',q:'O que acontece com o motor?',o:['Para','Continua girando: o verde já foi apertado','Para e volta sozinho quando esfriar'],w:'O relé térmico protege o motor: ele corta a bobina e o motor para.'},
         {sc:()=>scPartida(true,{BL:{pressed:true}}),act:pecaSet('BL',{pressed:false}),acao:'Este painel está sem o selo. O operador vai soltar o botão verde.',q:'Ao soltar o verde, o motor…',o:['Para','Continua girando: já tinha ligado','Continua até alguém apertar o vermelho'],w:'Sem o selo, a contatora só fica ligada enquanto o botão está apertado.'},
         {sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('BD',{pressed:true}),acao:'O operador vai apertar o botão vermelho.',q:'Ao apertar o vermelho, o motor…',o:['Para','Para, mas volta sozinho ao soltar o vermelho','Continua: o selo segura a contatora'],w:'O vermelho corta a bobina, e o selo solta junto.'}],
   moderado:[{sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('FT',{trip:true}),acao:'Sobrecarga: o relé térmico vai abrir o 95-96.',q:'Com o 95-96 aberto, o motor…',o:['Para, e só volta apertando LIGA depois de rearmar','Continua girando','Para e volta sozinho em seguida'],w:'O 95-96 corta a bobina; o selo cai junto. Religar exige rearme e novo LIGA.'},
         {sc:()=>scPartida(true,{BL:{pressed:true}}),act:pecaSet('BL',{pressed:false}),acao:'Painel sem o contato de selo. O operador vai soltar o LIGA.',q:'Ao soltar o LIGA…',o:['O motor desliga','O motor continua ligado','O relé térmico desarma'],w:'Sem o 13-14 em paralelo com o LIGA, a bobina só fica energizada com o botão apertado.'},
         {sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('BD',{pressed:true}),acao:'O operador vai apertar o DESLIGA (NF).',q:'Ao apertar o DESLIGA…',o:['A bobina perde a tensão e o motor para','O motor para, mas volta ao soltar o DESLIGA','O selo mantém a bobina e o motor segue'],w:'O NF abre e corta a bobina; o selo cai junto.'}],
   full:[{sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('FT',{trip:true}),acao:'Rotor travado: o relé térmico vai atuar.',q:'Após a atuação do relé térmico…',o:['Bobina desenergizada; religamento exige rearme e novo comando LIGA','Motor continua até apertar DESLIGA','Contatora religa sozinha quando o bimetal esfriar'],w:'O 95-96 abre o circuito de comando; o selo cai e não há religamento automático.'},
         {sc:()=>scPartida(true,{BL:{pressed:true}}),act:pecaSet('BL',{pressed:false}),acao:'Comando montado sem o contato de selo. LIGA vai ser solto.',q:'Esse comando funciona como…',o:['Comando por impulso (jog)','Partida direta com retenção','Partida com religamento automático'],w:'Sem selo, a bobina só fica energizada enquanto o NA está fechado: é o comando "jog".'},
         {sc:()=>scPartida(false,{K:{on:true}}),act:pecaSet('BD',{pressed:true}),acao:'DESLIGA vai ser pressionado com o motor em regime.',q:'Por que a botoeira desliga é NF e fica antes do selo?',o:['Corta a bobina mesmo com o selo fechado; fio rompido também para','NF consome menos corrente que um NA na bobina','Assim o selo pode religar sozinho depois'],w:'Em série antes do conjunto LIGA/selo, o NF desliga sempre, e a falha do fio leva ao lado seguro.'}]
  }},
 {id:'caixa',nome:'Caixa d\'Água',sub:'Bomba da fábrica',kind:'bancada',tipo:'build',ic:'agua',cor:'#2d6a8a',
  card:{leve:'Boia desce, bomba liga. Boia sobe, bomba desliga.',moderado:'A boia comanda a bobina; a contatora liga a bomba.',full:'Controle de nível: boia em série com A1-A2; bomba com PE.'},
  dados:{
   leve:{comps:[BAT(),C('BO','boia',140,60,0,{vazia:true}),C('M','motor',260,170,0),...ATERRA()],
     real:[['BO','💧','boia da caixa d\'água'],['M','⚙️','bomba d\'água']],
     goal:'A bomba tem que ligar com a caixa vazia e desligar com a caixa cheia. Toque na caixa para testar.',check:st=>boiaCheck(st)},
   moderado:{comps:[BAT(),C('BO','boia',125,60,0,{vazia:true}),C('K','kc',200,170,0),C('M','motor',290,170,0),...ATERRA()],
     real:[['BO','💧','boia da caixa d\'água'],['K','🧲','contatora da bomba'],['M','⚙️','bomba d\'água']],
     goal:'A boia comanda a bobina da contatora, e a contatora liga a bomba.',check:st=>boiaCheck(st)},
   full:{comps:[BAT(),C('BO','boia',125,60,0,{vazia:true}),C('K','kc',200,170,0),C('M','motor',290,170,0),...ATERRA()],
     real:[['BO','💧','chave-boia de nível'],['K','🧲','contatora'],['M','⚙️','motobomba']],
     goal:'Controle automático de nível: boia em série com A1-A2, bomba pelo 1-2 da contatora, carcaça no PE.',check:st=>boiaCheck(st)}
  }},
 {id:'fimturno',nome:'Fim de Turno',sub:'Reversão e estrela-triângulo',kind:'quiz',tipo:'quiz',ic:'motor',cor:'#3d5a7a',
  card:{leve:'Frente e trás nunca ao mesmo tempo.',moderado:'Reversão: cada troca de duas fases inverte o giro.',full:'Y-Δ reduz corrente e torque de partida a cerca de 1/3.'},
  dados:{
   leve:[{q:'Para a esteira andar para trás, o que o eletricista troca na ligação do motor?',o:['Dois dos três fios de força','Os três fios, cada um no lugar do outro','Um fio de força pelo fio terra'],w:'Trocando dois fios, o motor gira ao contrário. Trocar os três em roda deixa o mesmo sentido. E o terra nunca leva a corrente do motor.'},
         {q:'Por que a máquina não deixa ligar "frente" e "trás" ao mesmo tempo?',o:['Os dois juntos dariam curto entre os fios de força','O motor ficaria parado, travado entre os dois sentidos','A esteira tentaria andar para os dois lados e quebraria'],w:'As duas contatoras juntas ligam duas fases uma na outra: é um curto. O intertravamento impede.'},
         {q:'Por que um motor grande parte primeiro de um jeito e depois de outro (estrela-triângulo)?',o:['Para não puxar um pico enorme de corrente','Para gastar menos energia o dia inteiro de trabalho','Para o motor ter mais força no arranque pesado'],w:'Na estrela, cada parte do motor recebe menos tensão: o pico de corrente cai, mas a força no arranque também. Depois de embalar, ele passa para triângulo. No dia a dia, o gasto é o mesmo.'}],
   moderado:[{q:'Num motor trifásico, você troca L1 com L2 e depois L2 com L3. O sentido final…',o:['Volta ao original: duas trocas se cancelam','Fica invertido, porque houve troca de fases','Muda de velocidade, porque as fases mudaram'],w:'Cada troca de duas fases inverte o giro. Duas trocas: inverte e desinverte. A ordem final L3-L1-L2 é a mesma sequência L1-L2-L3, só começando em outro ponto.'},
         {q:'O intertravamento elétrico da reversão usa…',o:['Um NF de cada contatora em série com a bobina da outra','Um NA de cada contatora em paralelo com a bobina da outra','Um disjuntor separado para cada sentido'],w:'Quando uma contatora liga, o NF dela abre e corta a bobina da outra. Assim as duas nunca fecham juntas.'},
         {q:'Na partida estrela-triângulo, o torque de partida…',o:['Cai para cerca de 1/3 do da partida direta','Aumenta, porque a corrente de partida é menor','Fica igual ao da partida direta'],w:'Em estrela, cada bobina recebe U ÷ √3. Corrente de linha e torque caem para cerca de 1/3. Por isso Y-Δ é para máquinas que partem leves, como bombas e ventiladores.'}],
   full:[{q:'Com L1-L2-L3 em U-V-W, o motor gira no sentido horário. Ligando L2-L3-L1 em U-V-W, ele…',o:['Gira no mesmo sentido: a sequência só foi deslocada','Gira no sentido anti-horário: as três fases mudaram','Não parte: perdeu a referência de fase'],w:'O sentido depende da sequência de fases. L2-L3-L1 é a mesma sequência L1-L2-L3 começando em outro ponto. Para inverter, trocam-se só duas.'},
         {q:'Por que muitos painéis de reversão têm intertravamento mecânico além do elétrico?',o:['Se um auxiliar falhar, o mecânico ainda impede as duas','Porque o elétrico falha com o motor em movimento','Porque a NBR 5410 proíbe usar só o elétrico'],w:'O intertravamento elétrico depende de o contato auxiliar NF abrir de fato. Se ele falhar, ou as duas bobinas receberem tensão por erro de fiação, o mecânico ainda bloqueia fisicamente uma das contatoras.'},
         {q:'Motor 380/660 V numa rede de 380 V pode partir em estrela-triângulo?',o:['Sim: em triângulo ele trabalha em 380 V','Não: precisaria de rede de 660 V','Sim, mas fica em estrela no regime'],w:'Para Y-Δ, a tensão da rede tem que ser a de triângulo do motor. Em 380 V ele parte em estrela (cada bobina com 220 V) e trabalha em triângulo, com 380 V em cada bobina.'}]
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
/* nível (letra maior no Leve) e céu do capítulo atual (css: body[data-cap]) */
function setMode(){document.body.classList.toggle('leve',L());ceu()}
/* céu do capítulo: o da fase indicada, ou o capítulo aberto no mapa */
function ceu(pid){const ch=pid?chapterOf(pid):null;document.body.dataset.cap=(ch&&ch.id)||S.chap||'cap1'}
function bindHud(){const a=document.getElementById('toAlbum');if(a)a.onclick=showAlbum;const f=document.getElementById('toFicha');if(f)f.onclick=showFicha}


/* Cena da fase: lista única de falas ou uma lista por nível ({leve,moderado,full}), quando o texto muda com o nível */
function cenaDe(id){const s=SCENES[id];return !s?null:Array.isArray(s)?s:(s[S.mode]||s.moderado||s.leve)}
/* Todas as falas de uma cena (todos os níveis), para conferir personagens */
function todasFalas(id){const s=SCENES[id];return !s?[]:Array.isArray(s)?s:Object.values(s).flat()}
