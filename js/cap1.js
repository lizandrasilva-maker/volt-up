/* ================= CAPÍTULO 1 · A Oficina do Mestre Chico (corrente contínua) =================
   Capítulo introdutório: só CC, na bancada da oficina (pilha, bateria, fio, lâmpada pequena).
   Aulas (teoria) se alternam com práticas que validam o que foi visto.
   Ato 1 · O que é eletricidade: energia → fontes → carga → estática → condutor → continuidade → grandezas → lanterna.
   CA, tomada e rede só aparecem no Capítulo 2; o capítulo termina explicando CC × CA. */
const CAP1_FASES=[
 {id:'energia',nome:'De Onde Vem a Energia',sub:'Formas de energia',kind:'aula',tipo:'aula',ic:'livro',cor:'#2f4a6e',
  card:{leve:'Energia não some: muda de forma. A pilha transforma química em elétrica.',moderado:'Pilha: energia química → elétrica. Lâmpada: elétrica → luz e calor.',full:'Conservação: Eentrada = Eútil + perdas. Rendimento η = Eútil ÷ Eentrada.'},
  dados:{
   leve:{quadros:[
     {fig:'formas',t:'Energia é o que faz as coisas acontecerem: acender, esquentar, mover. Ela aparece de vários jeitos.'},
     {fig:'pilhaLampada',t:'Dentro da pilha tem uma mistura química. Ela empurra a eletricidade pelo fio até a lâmpada.'},
     {fig:'rendimento',t:'Na lâmpada, a eletricidade vira luz. E vira calor também: encoste perto de uma lâmpada acesa e você sente.'},
     {fig:'fontes',t:'A energia das casas vem de usinas. Algumas usam sol, vento e água, que a natureza repõe. Outras queimam coisas que acabam.'},
     {fig:'formas',t:'Guarda isso, {nome}: a energia não some e não aparece do nada. Ela só muda de forma.'}],
    checa:[
     {q:'A lanterna ficou acesa a noite toda e a pilha "acabou". O que aconteceu com a energia que estava nela?',o:['Virou luz e calor e se espalhou pelo quarto','Ficou guardada na lâmpada, que agora está carregada','Sumiu: energia gasta deixa de existir'],w:'A energia da pilha virou luz e um pouco de calor, que se espalharam. A lâmpada não guarda energia, e energia não some: muda de forma.'},
     {q:'Você chega a mão perto de uma lâmpada de filamento acesa há um tempo e sente calor. Por quê?',o:['Parte da eletricidade virou calor em vez de luz','A luz fica presa dentro do vidro e esquenta ele','A eletricidade escapa pelo vidro e esquenta o ar'],w:'O filamento transforma eletricidade em luz e, junto, em muito calor. O vidro esquenta por causa do filamento. A eletricidade não atravessa o vidro: ele é isolante.'},
     {q:'Qual destas usinas usa uma fonte que a natureza repõe?',o:['A que queima bagaço de cana da colheita','A que queima gás natural tirado do subsolo','A que queima carvão tirado da mina'],w:'A cana é plantada de novo a cada safra. O gás é "natural", mas levou milhões de anos para se formar e acaba, assim como o carvão.'}]},
   moderado:{quadros:[
     {fig:'formas',t:'Energia aparece em várias formas: química, elétrica, térmica, luminosa, mecânica. O eletricista leva a forma elétrica até onde ela vira as outras.'},
     {fig:'pilhaLampada',t:'Na pilha, uma reação química separa cargas e cria uma diferença de potencial entre o + e o −. Fechando o circuito, essa energia vai para a carga.'},
     {fig:'rendimento',t:'Na lâmpada de filamento, só uma pequena parte vira luz: o resto é calor. A parte útil dividida pelo total é o rendimento.'},
     {fig:'fontes',t:'Nas usinas, as fontes são renováveis (sol, vento, água, biomassa) ou não renováveis (petróleo, carvão, gás). As duas geram eletricidade; muda se a fonte acaba.'},
     {fig:'formas',t:'Conservação da energia: tudo o que entra sai, somando a parte útil e as perdas.'}],
    checa:[
     {q:'Uma lanterna fica acesa até a pilha descarregar. A energia química da pilha virou…',o:['Luz e calor, que se espalharam pelo ambiente','Carga elétrica acumulada no filamento da lâmpada','Corrente que voltou para dentro da pilha pelo polo −'],w:'Pela conservação, a energia química virou elétrica e, na lâmpada, luz e calor. O filamento não acumula carga. A corrente volta pelo −, mas a energia ficou na lâmpada e no ambiente.'},
     {q:'Uma lâmpada de filamento recebe 60 W e emite cerca de 3 W em luz. O rendimento dela é de…',o:['5 %; os outros 57 W viram calor','95 %; a maior parte vira luz','3 %; é a potência que vira luz'],w:'η = 3 ÷ 60 = 0,05 = 5 %. Os outros 57 W viram calor. 3 % confunde a potência da luz com a porcentagem; 95 % é a parte perdida.'},
     {q:'Bagaço de cana e gás natural são queimados para gerar eletricidade. Por que só o bagaço é renovável?',o:['A cana cresce de novo a cada safra; o gás levou milhões de anos','A queima do bagaço não solta gás carbônico na chaminé','O gás natural gera eletricidade com rendimento menor'],w:'Renovável é a fonte que se repõe no tempo humano. A queima do bagaço também solta CO₂, e o rendimento não decide se a fonte é renovável.'}]},
   full:{quadros:[
     {fig:'formas',t:'Energia é a capacidade de realizar trabalho, medida em joule (J). Na elétrica também se usa o watt-hora: 1 Wh = 3 600 J.'},
     {fig:'pilhaLampada',t:'A pilha é uma fonte eletroquímica: a oxirredução separa cargas e mantém uma força eletromotriz (fem) de cerca de 1,5 V por célula.'},
     {fig:'rendimento',t:'Conservação: Eentrada = Eútil + Eperdas. Rendimento η = Eútil ÷ Eentrada. Na lâmpada de filamento, o rendimento luminoso fica perto de 5 %.'},
     {fig:'fontes',t:'A geração usa fontes primárias renováveis (hídrica, solar, eólica, biomassa) ou não renováveis (fósseis e nuclear). O critério é a reposição natural, não a emissão.'},
     {fig:'formas',t:'Potência é a rapidez da transformação: P = E ÷ t. 1 W = 1 J por segundo.'}],
    checa:[
     {q:'Uma pilha armazena cerca de 3 Wh. Quantos joules são?',o:['≈ 10 800 J','≈ 180 J','≈ 1 200 J'],w:'1 Wh = 3 600 J, então 3 Wh = 10 800 J. 180 J usa 60 no lugar de 3 600 (segundos em uma hora); 1 200 J divide em vez de multiplicar.'},
     {q:'Uma lâmpada de 40 W fica acesa 2 h com rendimento luminoso de 5 %. Quanta energia vira calor?',o:['76 Wh','80 Wh','4 Wh'],w:'Eentrada = 40 W × 2 h = 80 Wh. Luz = 5 % = 4 Wh. Perdas = 80 − 4 = 76 Wh. 80 Wh é a entrada; 4 Wh é a parte útil.'},
     {q:'Uma usina nuclear quase não emite CO₂. Por que ela não é classificada como renovável?',o:['O urânio é um recurso mineral finito','O rendimento térmico do ciclo dela é baixo','Ela depende de água para resfriar o reator'],w:'O critério é a reposição natural da fonte primária, e o urânio não se repõe na escala humana. Baixa emissão é outro critério (baixo carbono). Rendimento e água de resfriamento não definem a classificação.'}]}
  }},
 {id:'carga',nome:'Carga Elétrica',sub:'Átomo, elétron e atrito',kind:'aula',tipo:'aula',ic:'livro',cor:'#3a2a6e',
  card:{leve:'Cargas iguais se empurram; cargas diferentes se puxam.',moderado:'Corpo carregado ganhou ou perdeu elétrons. O próton não sai do núcleo.',full:'Carga é quantizada: q = n × e, com e ≈ 1,6 × 10⁻¹⁹ C.'},
  dados:{
   leve:{quadros:[
     {fig:'atomo',t:'Tudo é feito de pedacinhos chamados átomos. No meio fica o núcleo; em volta, correm os elétrons.'},
     {fig:'atomo',t:'O núcleo tem carga positiva (+). O elétron tem carga negativa (−). Normalmente os dois se equilibram.'},
     {fig:'atrito',t:'Esfregando o pente no cabelo, elétrons passam do cabelo para o pente. O pente fica com sobra de −; o cabelo, com falta.'},
     {fig:'forcas',t:'Cargas iguais se empurram. Cargas diferentes se puxam. Por isso o pente esfregado puxa pedacinhos de papel.'},
     {fig:'macaneta',t:'Se o seu corpo junta carga e você chega perto de um metal, ela pula de uma vez: é o choquinho da maçaneta.'}],
    checa:[
     {q:'Depois de esfregar o pente no cabelo, o pente fica negativo. O que passou de um para o outro?',o:['Elétrons, do cabelo para o pente','Prótons, do pente para o cabelo','Elétrons, do pente para o cabelo'],w:'Quem se mexe é o elétron. Se o pente ficou negativo, ele ganhou elétrons, que vieram do cabelo. O próton fica preso no núcleo.'},
     {q:'Dois balões esfregados no mesmo pano ficam pendurados lado a lado. O que acontece?',o:['Eles se afastam um do outro','Eles se puxam e grudam um no outro','Eles ficam parados, sem força nenhuma'],w:'Os dois ganharam o mesmo tipo de carga. Cargas iguais se empurram, então os balões se afastam.'},
     {q:'Por que o choquinho da maçaneta aparece mais em dia seco?',o:['No ar seco a carga junta no corpo sem escapar','O ar seco tem mais eletricidade guardada','No dia seco o metal da maçaneta fica carregado'],w:'O ar úmido deixa a carga escapar aos poucos. No seco, ela vai juntando no corpo até pular de uma vez. O ar não guarda eletricidade, e a maçaneta só recebe a carga que pula.'}]},
   moderado:{quadros:[
     {fig:'atomo',t:'O átomo tem núcleo com prótons (+) e nêutrons (sem carga), e elétrons (−) na eletrosfera. Com prótons = elétrons, ele é neutro.'},
     {fig:'atrito',t:'Eletrização por atrito: dois materiais diferentes trocam elétrons. Quem perde fica positivo; quem ganha fica negativo. A carga total se conserva.'},
     {fig:'forcas',t:'Lei das cargas: iguais se repelem, opostas se atraem. A força cresce com a carga e com a proximidade.'},
     {fig:'macaneta',t:'Um corpo carregado perto de um condutor provoca uma descarga: a carga atravessa o ar de uma vez. É a eletricidade estática.'},
     {fig:'atomo',t:'Na estática, a carga fica parada até descarregar. Quando a carga anda de forma contínua por um caminho, temos a corrente elétrica.'}],
    checa:[
     {q:'Um corpo neutro fica positivo depois de atritado. O que aconteceu?',o:['Ele perdeu elétrons','Ele ganhou prótons','Ele perdeu nêutrons'],w:'Prótons ficam presos no núcleo e não passam de um corpo ao outro por atrito. Positivo = falta de elétrons. Nêutrons não têm carga.'},
     {q:'Uma régua atritada atrai pedacinhos de papel neutros. Por quê?',o:['A carga da régua desloca as cargas do papel, e o lado mais perto fica oposto','O papel recebe elétrons da régua pelo ar antes de encostar nela','O papel já tem carga própria, oposta à da régua atritada'],w:'É a indução (polarização): o papel continua neutro, mas as cargas dele se deslocam. O lado mais perto fica com carga oposta e a atração vence. Não há troca de carga antes do contato.'},
     {q:'Qual a diferença entre a faísca da maçaneta e a corrente de uma lanterna?',o:['A carga da faísca escoa de uma vez; a pilha mantém o fluxo','Na faísca andam cargas positivas; na lanterna, elétrons','Na faísca não há elétrons em movimento, só luz e calor'],w:'Nos dois casos há carga em movimento. A diferença é a fonte: a carga estática escoa toda num instante; a pilha mantém a diferença de potencial e o fluxo continua.'}]},
   full:{quadros:[
     {fig:'atomo',t:'Carga elementar: e ≈ 1,6 × 10⁻¹⁹ C. O elétron tem −e; o próton, +e. Toda carga é múltipla de e: q = n × e.'},
     {fig:'atrito',t:'Na eletrização por atrito, a série triboelétrica indica quem tende a perder elétrons (fica +) e quem tende a ganhar (fica −). A carga total se conserva.'},
     {fig:'forcas',t:'Lei de Coulomb: F = k × |q1 × q2| ÷ d², com k ≈ 9 × 10⁹ N·m²/C². Dobrando a distância, a força cai para 1/4.'},
     {fig:'macaneta',t:'Em ar seco o corpo chega a alguns quilovolts em relação à terra. Perto do metal, o campo rompe a rigidez dielétrica do ar: é a descarga eletrostática (ESD).'},
     {fig:'atomo',t:'A ESD é um pulso curto. Corrente elétrica é um fluxo ordenado e sustentado: I = Δq ÷ Δt, em ampère (1 A = 1 C/s).'}],
    checa:[
     {q:'Um corpo recebeu 5 × 10¹² elétrons em excesso. Qual a carga dele?',o:['≈ −0,8 µC','≈ +0,8 µC','≈ −8 µC'],w:'q = n × e = 5 × 10¹² × 1,6 × 10⁻¹⁹ = 8 × 10⁻⁷ C = 0,8 µC, negativa porque são elétrons em excesso. −8 µC erra a potência de dez.'},
     {q:'Duas cargas se repelem com 12 N. Se a distância entre elas dobrar, a força passa a…',o:['3 N','6 N','24 N'],w:'F ∝ 1/d². Com d dobrada, F cai para 1/4: 12 ÷ 4 = 3 N. 6 N trata a relação como linear; 24 N inverte o efeito.'},
     {q:'Por que a descarga da maçaneta, de milhares de volts, não é perigosa como a rede elétrica?',o:['A carga é pequena e escoa em microssegundos','A tensão dela é menor que a da rede elétrica','O corpo humano não conduz descarga estática'],w:'A tensão é alta, mas a carga acumulada é pequena: a energia é de milijoules e o pulso dura microssegundos. A rede mantém a corrente pelo corpo enquanto houver contato. O corpo conduz nos dois casos.'}]}
  }},
 {id:'macaneta',nome:'Choque na Maçaneta',sub:'Eletricidade estática',kind:'quiz',tipo:'quiz',ic:'macaneta',cor:'#5a3a6e',
  card:{leve:'Encostar uma chave de metal antes da mão evita o estalo.',moderado:'Pulseira antiestática ligada à terra escoa a carga aos poucos.',full:'ESD danifica componentes com tensões que a pessoa nem sente.'},
  dados:{
   leve:[{q:'Você arrastou o pé no tapete e vai tocar na maçaneta. O que diminui o choquinho?',o:['Encostar primeiro uma chave de metal na maçaneta','Tocar bem de leve, só com a pontinha do dedo','Esfregar mais o pé no tapete para gastar a carga'],w:'A faísca sai pela ponta da chave, e não pela pele: você nem sente. A ponta do dedo concentra a faísca num ponto pequeno e dói mais. Esfregar mais só junta mais carga.'},
         {q:'Ao tirar a blusa de lã no escuro, aparecem estalinhos de luz. O que são?',o:['Faíscas da carga que se juntou no atrito','Eletricidade da tomada que ficou no tecido','Brilho da lã refletindo a luz do celular'],w:'O atrito da lã com o corpo e o cabelo separa cargas. Quando a diferença fica grande, a carga pula pelo ar em faíscas minúsculas. Nada a ver com a tomada.'},
         {q:'O caminhão de combustível arrasta uma correntinha no chão. Para quê?',o:['Para a carga juntada na viagem escoar para o chão','Para descarregar a bateria quando o motor desliga','Para os outros motoristas ouvirem que ele passa'],w:'Com o atrito do ar e do combustível, o tanque junta carga. A corrente leva essa carga para o chão aos poucos, sem faísca perto do combustível.'}],
   moderado:[{q:'Por que encostar uma chave de metal na maçaneta antes da mão evita o estalo?',o:['A descarga acontece na ponta da chave, longe da pele','A chave isola a mão e a carga fica presa no corpo','O metal da chave neutraliza a carga sem precisar de contato'],w:'A carga sai do corpo pela chave, segurada com a mão inteira: a corrente se espalha e a faísca acontece na ponta da chave. O metal conduz, não isola.'},
         {q:'Na manutenção de placas eletrônicas, o técnico usa pulseira ligada à terra. Por quê?',o:['Para escoar a carga do corpo e proteger os componentes','Para se proteger de choque da rede ao mexer na placa','Para a placa continuar funcionando durante o conserto'],w:'A pulseira tem um resistor alto: a carga escoa devagar, sem faísca. Ela não protege contra a rede (para isso se desliga a alimentação), e a placa não precisa dela para funcionar.'},
         {q:'O caminhão-tanque arrasta uma corrente metálica no asfalto. Qual o motivo?',o:['Escoar para a terra a carga gerada pelo atrito na viagem','Aterrar a bateria do caminhão para evitar curto','Dissipar pelo chão o calor gerado nos freios'],w:'O atrito do ar e do combustível eletriza o tanque. Ligado à terra pela corrente, ele não acumula carga e não faz faísca na hora de descarregar o combustível.'}],
   full:[{q:'Por que componentes eletrônicos vêm em embalagem metalizada antiestática?',o:['Ela forma uma gaiola de Faraday e blinda o campo externo','Ela isola o componente para nenhuma carga chegar a ele','Ela aterra o componente diretamente na prateleira'],w:'A embalagem condutora distribui a carga na superfície e blinda o interior (gaiola de Faraday). Isolar não basta: um campo externo ainda induz cargas. E a embalagem não fica aterrada na prateleira.'},
         {q:'Uma pessoa a 2 kV em relação à terra toca um circuito integrado. Ela não sente nada. O CI…',o:['Pode ser danificado: a ESD rompe o óxido de porta','Fica protegido: abaixo da percepção não há dano','Só é danificado se estiver energizado no momento'],w:'A percepção humana começa por volta de 3 kV, mas o óxido de porta de um MOSFET rompe com dezenas ou centenas de volts. O dano não depende de o circuito estar energizado.'},
         {q:'Na descarga de combustível, o caminhão-tanque é ligado por cabo à malha de terra antes de abrir a válvula. Por quê?',o:['Para equalizar o potencial e evitar faísca nos vapores','Para o combustível escoar mais rápido pela mangueira','Para proteger a bomba do posto contra sobrecorrente'],w:'Ligação equipotencial: tanque, mangueira e posto no mesmo potencial não deixam faísca nos vapores inflamáveis. Vazão e proteção da bomba são outros assuntos.'}]
  }},
 {id:'condutor',nome:'Condutor ou Isolante',sub:'Elétrons livres e presos',kind:'aula',tipo:'aula',ic:'livro',cor:'#2b5a4e',
  card:{leve:'Metal conduz; plástico, borracha e vidro isolam. Na dúvida, teste.',moderado:'Condutor tem elétrons livres; isolante tem elétrons presos.',full:'R = ρ × L ÷ S. Cobre: ρ ≈ 0,0172 Ω·mm²/m a 20 °C.'},
  dados:{
   leve:{quadros:[
     {fig:'cobre',t:'No metal, alguns elétrons ficam soltos e andam de átomo em átomo. Por isso o metal deixa a eletricidade passar: é condutor.'},
     {fig:'borracha',t:'No plástico, na borracha e no vidro, os elétrons ficam presos. A eletricidade não passa: são isolantes.'},
     {fig:'fio',t:'Repara no fio: por dentro é cobre, que conduz. Por fora é plástico, que isola e protege a sua mão.'},
     {fig:'agua',t:'Cuidado com a água: a da torneira e o suor têm sais misturados, e esses sais deixam a eletricidade passar.'},
     {fig:'testador',f:{},t:'Na dúvida, a gente testa: pilha, luzinha e duas pontas. Encostou no material e acendeu, ele conduz.'}],
    checa:[
     {q:'Por que o fio elétrico tem cobre por dentro e plástico por fora?',o:['O cobre leva a eletricidade e o plástico protege quem encosta','O plástico ajuda o cobre a levar mais eletricidade','O cobre esquenta menos quando está coberto de plástico'],w:'O cobre conduz: é o caminho da eletricidade. O plástico isola: segura a eletricidade dentro do fio e protege a mão. Ele não ajuda a conduzir.'},
     {q:'O grafite do lápis é preto e parece pedra. Ele conduz eletricidade?',o:['Conduz: tem elétrons que andam soltos','Não conduz: precisa ser metal para conduzir','Conduz apenas quando está molhado'],w:'Grafite não é metal, mas tem elétrons soltos e conduz. Por isso não dá para julgar pela aparência: o jeito é testar.'},
     {q:'Mexer num aparelho elétrico com a mão molhada é mais perigoso. Por quê?',o:['A água com sais da pele faz um caminho para a eletricidade','A água esfria o fio e faz o plástico rachar na hora','A mão molhada escorrega e encosta no fio sem querer'],w:'Suor e água da torneira têm sais, que conduzem. A pele molhada deixa a eletricidade entrar no corpo com muito mais facilidade. O perigo não é escorregar: é conduzir.'}]},
   moderado:{quadros:[
     {fig:'cobre',t:'Nos metais, os elétrons da camada externa ficam livres e formam uma "nuvem". Com tensão aplicada, eles andam todos para o mesmo lado: é a corrente.'},
     {fig:'borracha',t:'Nos isolantes (PVC, borracha, vidro, porcelana), os elétrons estão presos aos átomos. Só com tensão muito alta eles se soltam: aí o isolante rompe.'},
     {fig:'fio',t:'No fio de instalação, o condutor é cobre e a isolação é PVC. Cada isolação tem uma tensão máxima de trabalho, escrita na capa.'},
     {fig:'agua',t:'Na água com sais, a corrente é levada por íons (átomos com carga). Água destilada tem poucos íons e quase não conduz.'},
     {fig:'testador',f:{},t:'O teste de continuidade mostra se existe caminho: a pilha do testador empurra corrente pelo material e um LED mostra se ela passa.'}],
    checa:[
     {q:'Por que o cobre conduz bem e o PVC não?',o:['O cobre tem elétrons livres; no PVC eles estão presos','O PVC tem mais elétrons, e eles se atrapalham','O cobre tem prótons livres que levam a corrente'],w:'Conduzir depende de cargas livres para andar. No cobre há elétrons livres; no PVC, não. Os prótons ficam no núcleo em qualquer material.'},
     {q:'Um isolante "rompe" quando…',o:['A tensão é tão alta que arranca elétrons e forma um caminho','Ele esquenta até virar metal e passa a conduzir','A corrente é tão baixa que atravessa sem ser notada'],w:'Todo isolante tem uma rigidez dielétrica: acima de certa tensão, os elétrons se soltam e o material conduz, muitas vezes com faísca. Ele não vira metal.'},
     {q:'O testador de continuidade (pilha + LED) acende fraco nas pontas mergulhadas em água da torneira. Isso mostra que…',o:['A água tem íons e conduz, mas com resistência alta','A água está ligada em algum fio da rede elétrica','A água é isolante e o LED está com defeito'],w:'O LED acendeu, então há caminho: os íons dos sais conduzem. Acender fraco indica resistência alta. Não precisa de rede: quem empurra é a pilha do testador.'}]},
   full:{quadros:[
     {fig:'cobre',t:'Nos metais, elétrons de valência ficam na banda de condução. Sob campo elétrico eles derivam a poucos mm/s; o sinal, porém, se propaga quase à velocidade da luz.'},
     {fig:'borracha',t:'Isolantes têm banda proibida larga: os elétrons não chegam à condução. A rigidez dielétrica é o campo que rompe o material (ar seco ≈ 3 kV/mm).'},
     {fig:'fio',t:'Resistência de um condutor: R = ρ × L ÷ S. Cobre: ρ ≈ 0,0172 Ω·mm²/m a 20 °C. Mais comprimento, mais R; mais seção, menos R.'},
     {fig:'agua',t:'Em eletrólitos a corrente é iônica: cátions para um lado, ânions para o outro. A condutividade depende da concentração de sais.'},
     {fig:'testador',f:{},t:'O teste de continuidade verifica se a resistência fica abaixo de um limiar. Sempre com o circuito desenergizado: o instrumento usa a própria bateria.'}],
    checa:[
     {q:'Um fio de cobre de 2,5 mm² tem 50 m. Resistência aproximada?',o:['≈ 0,34 Ω','≈ 0,02 Ω','≈ 3,4 Ω'],w:'R = 0,0172 × 50 ÷ 2,5 ≈ 0,34 Ω. 0,02 Ω é só a resistividade, sem comprimento e seção; 3,4 Ω erra a vírgula.'},
     {q:'Por que o teste de continuidade deve ser feito com o circuito desenergizado?',o:['O instrumento injeta corrente própria; tensão externa falseia a leitura e pode danificá-lo','A continuidade só existe quando não há corrente circulando no circuito','O cobre muda de resistência sempre que há tensão aplicada nele'],w:'O ohmímetro mede pela corrente que ele mesmo injeta. Uma tensão externa se soma à dele: a leitura fica errada e o instrumento pode queimar.'},
     {q:'O ar seco rompe com cerca de 3 kV/mm. Uma descarga estática que salta 5 mm indica uma tensão da ordem de…',o:['15 kV','0,6 kV','3 kV'],w:'E × d ≈ 3 kV/mm × 5 mm ≈ 15 kV (estimativa: o campo real não é uniforme). 0,6 kV divide em vez de multiplicar; 3 kV ignora a distância.'}]}
  }},
 {id:'continuidade',nome:'Testador de Continuidade',sub:'Conduz ou isola?',kind:'classificar',tipo:'sort',ic:'testador',cor:'#6b5512',
  bins:[{r:1,t:'💡 Conduz'},{r:0,t:'⛔ Isola'}],certo:['Isola.','Conduz.'],dica:'Quase! Pensa: esse material tem elétron solto ou íon para levar a corrente?',
  pergunta:{leve:'Encostando as pontas do testador, o LED acende?',outro:'Classifique o material pelo teste de continuidade.'},fig:'testador',
  card:{leve:'Grafite não é metal, mas conduz: na dúvida, teste.',moderado:'Água da torneira conduz pelos íons; a destilada quase não.',full:'Óleo mineral e mica isolam; por isso estão em transformadores e resistências.'},
  dados:{
   leve:[{t:'Chave de metal',i:'🔑',r:1,w:'Metal tem elétrons soltos: o LED acende.'},{t:'Régua de plástico',i:'📏',r:0,w:'No plástico os elétrons ficam presos: o LED não acende.'},
     {t:'Moeda',i:'🪙',r:1,w:'Moeda é de metal: conduz.'},{t:'Grafite do lápis',i:'✏️',r:1,w:'Não é metal, mas conduz! Por isso é preciso testar.'},
     {t:'Palito de madeira seco',i:'🪵',r:0,w:'Madeira seca isola. Molhada, pode conduzir um pouco.'},{t:'Copo de vidro',i:'🥛',r:0,w:'Vidro isola: é usado em isoladores.'}],
   moderado:[{t:'Fio de cobre desencapado',i:'🟠',r:1,w:'Cobre: elétrons livres. É o condutor dos fios.'},{t:'Capa do fio (PVC)',i:'⚪',r:0,w:'PVC é a isolação dos fios de instalação.'},
     {t:'Papel-alumínio',i:'📃',r:1,w:'Alumínio é metal: conduz.'},{t:'Porcelana do isolador',i:'🏺',r:0,w:'Porcelana isola: é usada nos isoladores de poste.'},
     {t:'Água da torneira',i:'🚰',r:1,w:'Os sais dissolvidos formam íons: o LED acende fraco.'},{t:'Fita isolante',i:'🎞️',r:0,w:'Feita de PVC: isola as emendas.'}],
   full:[{t:'Grafite',i:'✏️',r:1,w:'Carbono em camadas, com elétrons deslocalizados: conduz.'},{t:'Água destilada',i:'💧',r:0,w:'Quase sem íons: resistividade muito alta. O LED não acende.'},
     {t:'Óleo mineral isolante',i:'🛢️',r:0,w:'Isola e refrigera os enrolamentos dos transformadores.'},{t:'Aço inox',i:'🥄',r:1,w:'Liga metálica: conduz, com resistividade bem maior que a do cobre.'},
     {t:'Mica',i:'🪨',r:0,w:'Mineral isolante usado em resistências de aquecedores.'},{t:'Solda de estanho',i:'🔩',r:1,w:'Liga metálica: conduz e une os condutores.'},
     {t:'Água salgada',i:'🌊',r:1,w:'Eletrólito: íons Na⁺ e Cl⁻ levam a corrente.'},{t:'Ar seco',i:'🌬️',r:0,w:'Isola até cerca de 3 kV/mm; acima disso rompe e faz faísca.'}]
  }},
 {id:'grandezas',nome:'Tensão, Corrente e Resistência',sub:'O que anda no fio',kind:'aula',tipo:'aula',ic:'livro',cor:'#7a4a1f',
  card:{leve:'Tensão empurra, corrente anda, resistência atrapalha.',moderado:'Tensão em volt (V), corrente em ampère (A), resistência em ohm (Ω).',full:'Sentido convencional: do + para o − por fora da fonte; elétrons ao contrário.'},
  dados:{
   leve:{quadros:[
     {fig:'caixa',t:'Pensa numa caixa-d\'água: quanto mais alta, mais forte a água desce. Na eletricidade, essa força é a tensão.'},
     {fig:'caixa',t:'A água correndo no cano é a corrente. E o cano fino, que atrapalha a passagem, é a resistência.'},
     {fig:'fechado',t:'Para a corrente andar, o caminho tem que ser fechado: sai da pilha, passa pela lâmpada e volta para a pilha.'},
     {fig:'aberto',t:'Abriu o caminho em qualquer ponto, a corrente para em todo lugar. É isso que o interruptor faz.'},
     {fig:'sentido',t:'A pilha tem dois lados, o + e o −. Ligar ao contrário pode atrapalhar, como você vai ver na lanterna.'}],
    checa:[
     {q:'Comparando com a caixa-d\'água, o que é a tensão?',o:['A força que empurra, como a altura da caixa','A quantidade de água passando pelo cano','O cano fino que atrapalha a passagem da água'],w:'Tensão é o empurrão. A água passando é a corrente; o cano fino é a resistência.'},
     {q:'O interruptor apaga a lâmpada porque…',o:['Abre o caminho, e a corrente para em todo o circuito','Guarda dentro dele a eletricidade que ia para a lâmpada','Manda a corrente de volta para a pilha por outro fio'],w:'Com o caminho aberto, não há volta para a pilha, e a corrente para em todos os pontos. O interruptor não guarda eletricidade.'},
     {q:'Uma pilha nova está na gaveta, sem nada ligado. Passa corrente por ela?',o:['Não: tem tensão, mas sem caminho fechado não há corrente','Sim: a pilha vai soltando corrente aos pouquinhos','Sim, mas apenas pelo lado +, que é o lado que empurra'],w:'A pilha tem tensão o tempo todo, pronta para empurrar. Mas corrente só existe com o caminho fechado. Por isso ela dura anos na gaveta.'}]},
   moderado:{quadros:[
     {fig:'unidades',t:'Três grandezas para guardar: tensão (U) em volt, corrente (I) em ampère e resistência (R) em ohm.'},
     {fig:'caixa',t:'Tensão é a diferença de potencial que empurra as cargas: na caixa-d\'água, o desnível. Corrente é quanta carga passa por segundo. Resistência é a oposição à passagem.'},
     {fig:'fechado',t:'Circuito fechado: fonte, condutores e carga formam um caminho contínuo. Num caminho único, a mesma corrente passa por todos os pontos.'},
     {fig:'aberto',t:'Circuito aberto: sem continuidade, I = 0 em todo o circuito. A tensão da fonte continua lá e aparece inteira no ponto aberto.'},
     {fig:'sentido',t:'Por convenção, a corrente sai do + da fonte e volta pelo −. Polaridade importa: pilha invertida subtrai em vez de somar.'}],
    checa:[
     {q:'Num circuito com uma pilha e uma lâmpada, onde a corrente é maior?',o:['É a mesma em todos os pontos do caminho','Na saída do +, antes de passar pela lâmpada','Na volta para o −, depois de passar pela lâmpada'],w:'Num caminho único a carga não se acumula nem some: a corrente é igual em todo ponto. A lâmpada transforma energia, não "gasta" corrente.'},
     {q:'O interruptor está aberto. Entre os dois bornes dele, a tensão é…',o:['A tensão inteira da pilha','Zero, porque não passa corrente','Metade da tensão da pilha'],w:'Sem corrente, a lâmpada não tem queda de tensão; toda a tensão da fonte aparece no ponto aberto. É ali que o voltímetro mostra a tensão cheia.'},
     {q:'Na comparação com a caixa-d\'água, um fio mais fino e mais comprido equivale a…',o:['Um cano estreito e longo: mais resistência','Uma caixa mais alta: mais tensão','Mais água no cano: mais corrente'],w:'Fino e comprido dificulta a passagem: aumenta a resistência. A altura da caixa é a tensão; a vazão é a corrente.'}]},
   full:{quadros:[
     {fig:'unidades',t:'Grandezas e unidades do SI: tensão U em volt (V = J/C), corrente I em ampère (A = C/s), resistência R em ohm (Ω = V/A).'},
     {fig:'caixa',t:'Tensão é energia por unidade de carga: 1 V é 1 J para cada coulomb que atravessa. Corrente é a vazão de carga: I = Δq ÷ Δt.'},
     {fig:'sentido',t:'Sentido convencional: a corrente sai do + e entra no − por fora da fonte. Os elétrons andam ao contrário. Diagramas e normas usam o convencional.'},
     {fig:'fechado',t:'Numa malha única, a corrente é a mesma em todos os elementos: é a continuidade da carga.'},
     {fig:'aberto',t:'Circuito aberto: I = 0, então U = R × I = 0 em cada resistor, e a fem da fonte aparece inteira entre os pontos abertos.'}],
    checa:[
     {q:'Uma corrente de 0,3 A circula por 10 s. Quanta carga atravessou a lâmpada?',o:['3 C','0,03 C','33 C'],w:'Δq = I × Δt = 0,3 × 10 = 3 C. 0,03 C divide em vez de multiplicar; 33 C divide 10 por 0,3.'},
     {q:'Uma pilha de 1,5 V movimenta 2 C pelo circuito. Quanta energia ela entrega?',o:['3 J','0,75 J','1,5 J'],w:'U = E ÷ q, então E = U × q = 1,5 × 2 = 3 J. 0,75 J divide; 1,5 J ignora a carga.'},
     {q:'No diagrama, a seta da corrente sai do + da pilha. Os elétrons, nesse fio…',o:['Andam no sentido contrário ao da seta','Andam no mesmo sentido da seta','Ficam parados: só a energia anda'],w:'A seta usa o sentido convencional. Nos metais quem anda são os elétrons, do − para o + por fora da fonte. Andam devagar, mas andam.'}]}
  }}
];
/* Cenas antes das práticas (as aulas já são conduzidas pelo Mestre Chico) */
const CAP1_CENAS={
  renovavel:[['chico','Você viu que a eletricidade das casas vem de usinas, e cada usina usa uma fonte.'],['chico','Umas a natureza repõe, outras acabam um dia. {nome}, separa pra mim.']],
  macaneta:[['eu','Ai! Mestre, levei um choquinho na maçaneta da oficina!'],['chico','É a carga que você mesmo juntou andando no piso. Eletricidade estática.'],['chico','Vamos ver se você sabe explicar as situações do dia a dia.']],
  continuidade:[['chico','Toma o testador: uma pilha, um LED e duas pontas.'],['chico','Encosta as pontas no material. Se o LED acender, ele conduz. Antes de testar, me diz o que você acha.']]
};
