# Registro das perguntas dos quizzes

Este registro documenta, pergunta por pergunta, as mudanças nos quizzes feitas nas Etapas 2 e 2b da revisão.

- **Antes:** versão anterior à Etapa 2 (commit `0d4d650`).
- **Depois:** versão atual.
- **✔** marca a alternativa certa. O jogo embaralha as alternativas na tela.
- **Pistas medidas** são calculadas automaticamente, com o mesmo critério dos testes (`tests/testes.html`): certa mais longa, palavra absoluta só nas erradas, só a certa repete o enunciado, só a certa traz justificativa.
- **Erro representado** é o raciocínio equivocado que cada alternativa errada simula.

O critério de nível vem da decisão do curso. Os três níveis cobram o mesmo raciocínio; muda o registro de linguagem:

- **leve:** dia a dia;
- **moderado:** termos da obra;
- **full:** grandezas e norma.

A posição (1, 2, 3) é só a ordem no arquivo. Quando o tema de uma posição antiga passou para outra posição, isso aparece em "Problema da versão anterior".

## Faísca

### Faísca · leve · 1

**Antes:** Por que o fio tem uma capa de plástico?

- ✔ Para a eletricidade não passar para a nossa mão
- ✗ Para a eletricidade andar mais rápido
- ✗ Para o fio não enferrujar

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores sem relação com o fenômeno ("andar mais rápido").

**Depois:** A capa da extensão rachou e o chão está molhado. Por que isso é perigoso, mesmo sem tocar no cobre?

- ✔ A água conduz e leva a eletricidade até você
- ✗ O plástico rachado passa a conduzir eletricidade também *(erro representado: Achar que o isolante rachado passa a conduzir)*
- ✗ A umidade aumenta a força da eletricidade na tomada *(erro representado: Achar que a umidade aumenta a tensão da tomada)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Mesmo tema (isolante e condutor), agora numa situação de risco real: o perigo vem da água, não do plástico rachado.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("chão"). Tirada da certa.

### Faísca · leve · 2

**Antes:** O celular esquenta quando carrega. Para onde vai parte da energia?

- ✔ Vira calor
- ✗ Some para sempre
- ✗ Volta para a tomada

Pistas medidas antes: palavra absoluta só nas erradas.

**Problema da versão anterior:** Distratores absurdos ("Some para sempre", "Volta para a tomada").

**Depois:** O carregador ficou na tomada sem o celular e continua morno horas depois. O que isso mostra?

- ✔ Ele ainda puxa um pouco de energia, que vira calor
- ✗ Ele está guardando energia para a próxima carga *(erro representado: Achar que o carregador armazena energia)*
- ✗ Ele ainda não esfriou da última vez que carregou *(erro representado: Atribuir o calor à carga anterior, sem pensar no tempo)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Mesmo conceito (energia se transforma), agora exigindo interpretar um sinal observável: calor horas depois indica consumo em espera.

### Faísca · leve · 3

**Antes:** Qual destes deixa a eletricidade passar?

- ✔ A ponta do lápis (grafite)
- ✗ A borracha
- ✗ A folha de papel

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Reconhecimento de material (grafite), sem raciocínio sobre corrente.

**Depois:** Duas extensões do mesmo tamanho, uma de fio fino e outra de fio grosso, ligam o mesmo aquecedor. Qual esquenta mais?

- ✔ A de fio fino
- ✗ A de fio grosso, porque tem mais cobre *(erro representado: Achar que mais cobre gera mais calor)*
- ✗ As duas igual, porque o aquecedor é o mesmo *(erro representado: Achar que o aquecimento depende só do aparelho)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Troca por fio fino × grosso com a mesma carga: exige relacionar seção com aquecimento.

### Faísca · moderado · 1

**Antes:** Por que um fio fino esquenta quando passa muita corrente?

- ✔ Efeito Joule: a resistência transforma energia em calor
- ✗ Porque o cobre é isolante
- ✗ Porque a tensão acaba no meio do fio

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distrator absurdo ("o cobre é isolante").

**Depois:** Água destilada quase não conduz. Por que a água da torneira é perigosa perto da eletricidade?

- ✔ Os sais dissolvidos formam íons, que conduzem corrente
- ✗ O oxigênio da água é condutor, como o cobre *(erro representado: Atribuir a condução a um elemento errado (cloro))*
- ✗ O cloro do tratamento é que conduz a corrente *(erro representado: Ignorar a diferença entre água pura e com sais)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Condução na água explicada por íons: o aluno precisa saber por que a água comum conduz e a destilada quase não.

### Faísca · moderado · 2

**Antes:** Um carregador indica 5 V e 2 A. A potência máxima é…

- ✔ 10 W
- ✗ 2,5 W
- ✗ 7 W

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Conta direta P = V × I, sem interpretação.

**Depois:** Um carregador puxa 12 W da tomada e entrega 10 W ao celular. O que acontece com os 2 W?

- ✔ Viram calor no carregador
- ✗ Voltam para a rede pelo neutro *(erro representado: Achar que a energia que sobra volta pelo neutro)*
- ✗ Ficam guardados no transformador do carregador *(erro representado: Achar que o carregador guarda energia)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Balanço de energia num carregador real: perdas viram calor; exige conservação de energia e noção de rendimento.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("carregador"). Repetida também num distrator.

### Faísca · moderado · 3

**Antes:** Qual metal conduz MELHOR a eletricidade?

- ✔ Prata
- ✗ Cobre
- ✗ Alumínio

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Memorização (qual metal conduz melhor).

**Depois:** Mesma corrente em 1,5 mm² e em 2,5 mm², mesmo comprimento. Qual dissipa mais calor?

- ✔ O de 1,5 mm²: tem maior resistência
- ✗ O de 2,5 mm²: tem mais cobre para aquecer *(erro representado: Achar que mais cobre esquenta mais)*
- ✗ Os dois igual: a corrente é a mesma *(erro representado: Ignorar a resistência e olhar só a corrente)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Comparação entre seções com a mesma corrente: aplica R = ρL/S e P = RI².

### Faísca · full · 1

**Antes:** Por que a transmissão usa alta tensão?

- ✔ Reduz a corrente e as perdas I²R
- ✗ A alta tensão é mais segura
- ✗ Aumenta a frequência da rede

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Alternativa certa reconhecível pelo tamanho; distratores fracos.

**Depois:** Por que a NBR 5410 exige DR ≤ 30 mA em locais com banheira ou chuveiro?

- ✔ Pele molhada tem resistência menor e passa mais corrente
- ✗ A umidade eleva a tensão da rede nesses locais *(erro representado: Achar que a umidade altera a tensão da rede)*
- ✗ O disjuntor termomagnético não consegue atuar em ambiente úmido *(erro representado: Achar que o disjuntor falha por umidade, sem perceber que nunca detectaria mA)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Mesmo princípio (resistência e corrente pelo corpo) aplicado ao requisito da NBR 5410 sobre DR em áreas molhadas.

### Faísca · full · 2

**Antes:** 220 V eficaz corresponde a um pico de aproximadamente…

- ✔ 311 V
- ✗ 220 V
- ✗ 381 V

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Conversão direta Vpico = Vrms × √2 (conteúdo de MI UC 2, 5.8, que deixou de ser cobrado; ver pendências).

**Depois:** Uma fonte com rendimento de 80 % entrega 40 W à carga. Quanto ela dissipa em calor?

- ✔ 10 W
- ✗ 32 W *(erro representado: Aplicar o rendimento sobre a saída (40 × 0,8))*
- ✗ 50 W *(erro representado: Confundir potência de entrada com perda)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Rendimento de fonte: exige identificar que o rendimento incide sobre a entrada.

**Ajuste da Etapa 2b:** Pista corrigida (valor do meio): a certa era o valor intermediário. O distrator de 8 W foi trocado por 50 W (confundir potência de entrada com perda), que também é erro real; o de 32 W ficou.

### Faísca · full · 3

**Antes:** Rede trifásica 220/380 V (como em Fortaleza): tensão entre duas fases?

- ✔ 380 V
- ✗ 220 V
- ✗ 440 V

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Fase-fase em rede 220/380 (mantido no tema da fase "Do Poste à Tomada").

**Depois:** Circuito de 30 m (ida e volta = 60 m) em 2,5 mm², ρ = 0,0172 Ω·mm²/m, com 20 A. Potência perdida no cabo?

- ✔ ≈ 165 W
- ✗ ≈ 83 W *(erro representado: Esquecer o condutor de volta)*
- ✗ ≈ 8 W *(erro representado: Esquecer o quadrado da corrente)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Perda Joule no cabo com ida e volta: integra resistividade, comprimento e corrente.

## Do Poste à Tomada

### Do Poste à Tomada · leve · 1

**Antes:** Para que serve o medidor (o "relógio de luz") na frente da casa?

- ✔ Contar quanta energia a casa usa
- ✗ Produzir a energia da casa
- ✗ Deixar a luz mais forte

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores absurdos sobre o medidor ("Produzir a energia").

**Depois:** Qual a diferença entre os fios do alto do poste e os que chegam na sua casa?

- ✔ Os do alto têm tensão muito maior; o transformador baixa
- ✗ Os do alto são de telefone e internet *(erro representado: Confundir cabos de energia com os de telecomunicação)*
- ✗ São iguais; o transformador guarda energia para a noite *(erro representado: Achar que o transformador armazena energia)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Troca por níveis de tensão no poste: exige entender a função do transformador.

### Do Poste à Tomada · leve · 2

**Antes:** O que faz o transformador lá no poste?

- ✔ Baixa a tensão para chegar nas casas
- ✗ Guarda energia, como uma pilha
- ✗ Mede a conta de luz

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores absurdos ("Guarda energia, como uma pilha").

**Depois:** Lâmpada de 10 W acesa 10 horas, ou secador de 2000 W ligado 5 minutos. Qual pesa mais na conta?

- ✔ O secador, mesmo ligado pouco tempo
- ✗ A lâmpada, porque ficou muito mais tempo acesa *(erro representado: Achar que o tempo ligado decide sozinho)*
- ✗ Os dois igual: um compensa o outro *(erro representado: Achar que os consumos se compensam)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Comparação de consumo com dados: potência alta por pouco tempo contra potência baixa por muito tempo.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("ligado"). O distrator da lâmpada passou a repetir "acesa", do enunciado.

### Do Poste à Tomada · leve · 3

**Antes:** A energia da tomada é igual à de uma pilha?

- ✔ Não. A da tomada é alternada, com fase e neutro
- ✗ Sim, é igualzinha
- ✗ Não. A tomada não tem energia

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distrator absurdo ("A tomada não tem energia").

**Depois:** Por que a tomada não tem "+" e "−", como a pilha?

- ✔ A corrente da tomada troca de sentido o tempo todo
- ✗ O "+" da tomada fica escondido em um dos furos *(erro representado: Achar que existe polaridade fixa na tomada)*
- ✗ Um furo tem energia e o outro é o terra *(erro representado: Confundir neutro com terra)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Mesmo tema (CA × CC), agora corrigindo a confusão comum entre neutro e terra.

### Do Poste à Tomada · moderado · 1

**Antes:** Qual a frequência da rede elétrica no Brasil?

- ✔ 60 Hz
- ✗ 50 Hz
- ✗ 220 Hz

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Memorização (60 Hz).

**Depois:** Por que a rede chega ao poste em 13,8 kV, e não em 220 V?

- ✔ Mais tensão, menos corrente: perde menos nos cabos
- ✗ Porque 13,8 kV é mais seguro para quem está na rua *(erro representado: Achar que tensão maior é mais segura)*
- ✗ Porque a usina gera a energia direto em 13,8 kV *(erro representado: Achar que a usina gera direto em 13,8 kV)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Por que a distribuição usa média tensão: P = U × I e perda R × I².

### Do Poste à Tomada · moderado · 2

**Antes:** O medidor de energia registra o consumo em…

- ✔ kWh
- ✗ kW
- ✗ V

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Memorização da unidade (kWh).

**Depois:** Um aparelho de 2 kW fica ligado 15 minutos. O medidor soma…

- ✔ 0,5 kWh
- ✗ 30 kWh *(erro representado: Multiplicar por minutos sem converter)*
- ✗ 2 kWh *(erro representado: Confundir potência (kW) com energia (kWh))*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Cálculo de energia com conversão de minutos para horas.

### Do Poste à Tomada · moderado · 3

**Antes:** Numa tomada 2P+T, quais são os condutores?

- ✔ Fase, neutro e terra (PE)
- ✗ Positivo, negativo e terra
- ✗ Duas fases e um neutro

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Distratores fracos sobre nomes dos condutores.

**Depois:** Na tomada 2P+T, qual contato tem tensão em relação ao terra?

- ✔ A fase; o neutro fica perto de 0 V
- ✗ O neutro, porque a corrente volta por ele *(erro representado: Achar que o neutro tem tensão porque leva corrente)*
- ✗ Fase e neutro, cada um com metade *(erro representado: Confundir fase-neutro com ligação entre duas fases)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Qual condutor tem tensão em relação ao terra: exige entender o neutro aterrado.

### Do Poste à Tomada · full · 1

**Antes:** Trafo de distribuição 13,8 kV / 380-220 V, secundário em estrela. O que é o 220 V?

- ✔ Tensão fase-neutro
- ✗ Tensão fase-fase
- ✗ Tensão do primário

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Pergunta mantida no conceito (fase-neutro × fase-fase), reformulada para pedir a tensão entre fases.

**Depois:** Trafo 13,8 kV / 380-220 V, secundário em estrela aterrada. Entre duas fases do secundário você mede…

- ✔ 380 V
- ✗ 220 V *(erro representado: Confundir fase-fase com fase-neutro)*
- ✗ 440 V *(erro representado: Somar as tensões sem considerar a defasagem de 120°)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Exige a relação √3 entre tensões em estrela.

### Do Poste à Tomada · full · 2

**Antes:** Por que o neutro é aterrado no padrão de entrada (esquema TN)?

- ✔ Para fixar o potencial e permitir que a proteção atue numa falta à terra
- ✗ Para dispensar o condutor de proteção
- ✗ Para elevar a tensão de fornecimento

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Conta direta E ÷ t.

**Depois:** Medidor com constante de 1 pulso por Wh. Com o chuveiro ligado, o LED pisca 90 vezes em 1 minuto. Potência do chuveiro?

- ✔ 5,4 kW
- ✗ 1,5 kW *(erro representado: Dividir pulsos por minutos confundindo as unidades)*
- ✗ 90 W *(erro representado: Esquecer que a contagem foi de só 1 minuto)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Leitura da constante do medidor (pulsos por Wh) para obter potência: conversão de energia em potência com tempo curto.

### Do Poste à Tomada · full · 3

**Antes:** O medidor marcou 3 kWh em 2 horas. Potência média?

- ✔ 1,5 kW
- ✗ 6 kW
- ✗ 0,67 kW

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Pergunta mantida no conceito (neutro aterrado no TN), com distratores reescritos.

**Depois:** Por que a distribuidora aterra o neutro no padrão de entrada (TN-C-S)?

- ✔ Para a falta fase-massa virar curto e a proteção atuar
- ✗ Para o neutro poder fazer também o papel do PE na casa *(erro representado: Achar que o neutro pode substituir o PE na casa)*
- ✗ Para o neutro deixar de levar corrente de volta *(erro representado: Achar que o aterramento elimina a corrente de retorno)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Distratores agora representam confusões reais entre N e PE.

## Mão Segura

### Mão Segura · leve · 1

**Antes:** O disjuntor desarmou sozinho. O que fazer?

- ✔ Chamar um adulto para descobrir o motivo
- ✗ Religar várias vezes até ficar
- ✗ Prender com fita para não cair mais

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distrator absurdo ("Prender com fita").

**Depois:** O disjuntor do chuveiro desarma toda vez que liga no "inverno". O que fazer?

- ✔ Chamar um eletricista para ver se fio e disjuntor aguentam
- ✗ Trocar o disjuntor por um maior, que não desarma mais à toa *(erro representado: Trocar o disjuntor por um maior (perde a proteção do fio))*
- ✗ Usar no "verão", que puxa menos, e deixar como está *(erro representado: Esconder o problema mudando o uso)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Situação real do chuveiro que desarma; o erro tentador é trocar o disjuntor por um maior.

### Mão Segura · leve · 2

**Antes:** A pipa enroscou no fio do poste. E agora?

- ✔ Deixar lá e avisar um adulto
- ✗ Puxar com uma vara de bambu
- ✗ Subir no muro para alcançar

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Situação (pipa) sem distrator plausível.

**Depois:** Vai trocar a lâmpada do quarto. O que é seguro?

- ✔ Desligar o disjuntor daquele circuito antes
- ✗ Apagar no interruptor, que já corta a energia *(erro representado: Confiar no interruptor como seccionamento)*
- ✗ Usar luva de cozinha e trocar com a luz apagada *(erro representado: Achar que luva comum isola)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Troca de lâmpada: interruptor não é desligamento seguro.

### Mão Segura · leve · 3

**Antes:** O benjamim (T) com 4 aparelhos está quente. Isso é…

- ✔ Perigoso: pode pegar fogo
- ✗ Normal, todo plugue esquenta
- ✗ Bom, economiza tomada

Pistas medidas antes: palavra absoluta só nas erradas; só a certa justifica.

**Problema da versão anterior:** Distratores fracos ("Bom, economiza tomada").

**Depois:** A carcaça de uma máquina de lavar com defeito dá choque. Quem desliga rápido para proteger a pessoa?

- ✔ O DR, que percebe a corrente escapando
- ✗ O disjuntor comum, que desarma no curto *(erro representado: Achar que o disjuntor percebe correntes de choque)*
- ✗ O interruptor da parede da lavanderia *(erro representado: Achar que o interruptor protege)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Quem protege contra choque: diferencia DR de disjuntor.

### Mão Segura · moderado · 1

**Antes:** Fio de 1,5 mm² protegido por disjuntor de 20 A. Está…

- ✔ Errado: o disjuntor é maior que o fio aguenta
- ✗ Certo
- ✗ Certo, se o fio for flexível

Pistas medidas antes: certa é a mais longa; só a certa repete o enunciado; só a certa justifica.

**Problema da versão anterior:** Pergunta mantida (1,5 mm² com 20 A), com distratores reescritos.

**Depois:** Fio de 1,5 mm² protegido por disjuntor de 20 A. Está…

- ✔ Errado: com 20 A o fio esquenta antes de o disjuntor abrir
- ✗ Certo: o disjuntor maior evita desarmes à toa com muita carga *(erro representado: Achar que disjuntor maior só evita desarme)*
- ✗ Certo, se a carga ligada puxar menos de 15 A *(erro representado: Achar que a carga atual justifica o disjuntor)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Distratores agora representam justificativas reais para o erro.

### Mão Segura · moderado · 2

**Antes:** Por que o interruptor deve cortar a fase, e não o neutro?

- ✔ Para a lâmpada ficar sem tensão quando desligada
- ✗ Para economizar energia
- ✗ Tanto faz, é igual

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores fracos ("Tanto faz").

**Depois:** Por que o interruptor tem que cortar a fase, e não o neutro?

- ✔ Para o bocal ficar sem tensão com a lâmpada apagada
- ✗ Porque cortando o neutro a lâmpada não apaga *(erro representado: Achar que a lâmpada não apaga se cortar o neutro)*
- ✗ Para o disjuntor conseguir atuar num curto *(erro representado: Atribuir a regra ao disjuntor)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Mesmo tema, com o mito real: "cortando o neutro a lâmpada não apaga".

### Mão Segura · moderado · 3

**Antes:** Qual cor a NBR 5410 reserva ao neutro?

- ✔ Azul-claro
- ✗ Verde-amarelo
- ✗ Branco

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Memorização (cor do neutro). A regra de cores continua cobrada nas montagens.

**Depois:** Uma pessoa isolada do chão encosta na fase e no neutro ao mesmo tempo. O DR de 30 mA…

- ✔ Não atua: tudo que entra pela fase volta pelo neutro
- ✗ Atua, porque a fase manda corrente pelo corpo da pessoa *(erro representado: Achar que toda corrente pelo corpo faz o DR atuar)*
- ✗ Atua só se a corrente passar de 30 A *(erro representado: Confundir mA com A)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Limite do DR: contato fase-neutro sem fuga à terra.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("fase", "neutro"). O distrator principal passou a falar da fase e da pessoa, como no enunciado.

### Mão Segura · full · 1

**Antes:** Pela NR-10, logo depois de seccionar o circuito, o próximo passo é…

- ✔ Constatar a ausência de tensão
- ✗ Instalar o aterramento temporário
- ✗ Sinalizar a área

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Sequência da NR-10 (mantida em seguranca:full:1).

**Depois:** Circuito de tomadas com Ib = 18 A, cabo 2,5 mm² em eletroduto embutido (Iz = 24 A, método B1). Qual disjuntor atende?

- ✔ 20 A
- ✗ 25 A *(erro representado: Escolher o disjuntor acima da capacidade do cabo)*
- ✗ 16 A *(erro representado: Escolher o disjuntor abaixo da corrente de projeto)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Coordenação Ib ≤ In ≤ Iz com valor da tabela 36.

**Ajuste da Etapa 2b:** Explicação completada com os itens conferidos (5.3.4.1 e tabela 36).

### Mão Segura · full · 2

**Antes:** O DR de 30 mA atua por…

- ✔ Corrente diferencial (fuga)
- ✗ Sobrecarga
- ✗ Sobretensão

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Pergunta mantida (NR-10, 10.13.1); um distrator trocado por outro passo real da sequência.

**Depois:** Pela NR-10, logo depois de seccionar o circuito, o próximo passo é…

- ✔ Constatar a ausência de tensão
- ✗ Instalar o aterramento temporário *(erro representado: Aterrar antes de constatar a ausência de tensão)*
- ✗ Sinalizar o impedimento *(erro representado: Sinalizar antes de constatar)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Todos os distratores são passos verdadeiros fora de ordem.

### Mão Segura · full · 3

**Antes:** Disjuntor curva C: faixa de disparo magnético

- ✔ 5 a 10 × In
- ✗ 3 a 5 × In
- ✗ 10 a 20 × In

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Memorização da faixa da curva C (conteúdo de ME I UC 1, 8.1.2; ver pendências).

**Depois:** DR com IΔn = 30 mA. Há uma fuga de 12 mA para o PE. O DR…

- ✔ Fica ligado: abaixo de 50 % de IΔn não deve atuar
- ✗ Tem que atuar: fuga para o PE já caracteriza uma falta *(erro representado: Achar que qualquer fuga faz atuar)*
- ✗ Atua se a fuga durar mais de 5 s *(erro representado: Inventar um critério de tempo)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Limiar de não atuação do DR (50 % de IΔn), conferido na NBR 5410.

**Ajuste da Etapa 2b:** Explicação completada com o item conferido (6.3.3.2.6 e nota), que traz exatamente essa regra.

## Mestre Ohm

### Mestre Ohm · leve · 1

**Antes:** Uma lâmpada sozinha ou duas em fila, na mesma tomada. Quando cada lâmpada brilha mais?

- ✔ Sozinha
- ✗ Em fila
- ✗ Igual

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Distratores fracos ("Igual").

**Depois:** Duas lâmpadas iguais em fila na mesma tomada. Comparando com uma lâmpada sozinha, cada uma brilha…

- ✔ Bem menos que a metade
- ✗ Igual: a tomada é a mesma *(erro representado: Achar que a tomada dá a mesma energia a cada lâmpada)*
- ✗ Metade, e as duas juntas brilham como uma *(erro representado: Achar que a soma das duas brilha como uma)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Mesmo conceito (série divide a tensão), pedindo comparação quantitativa qualitativa.

### Mestre Ohm · leve · 2

**Antes:** Qual gasta mais energia em um mês, numa casa comum?

- ✔ Chuveiro elétrico
- ✗ Geladeira
- ✗ Carregador de celular

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Pergunta mantida no conceito; dado da geladeira agora vem no enunciado (afirmação não conferida retirada).

**Depois:** Chuveiro de 5500 W ligado 30 minutos por dia, ou geladeira cuja etiqueta diz 35 kWh por mês. Qual pesa mais na conta?

- ✔ O chuveiro, mesmo ligado pouco tempo
- ✗ A geladeira, que fica ligada dia e noite *(erro representado: Achar que ligado o dia todo gasta mais)*
- ✗ Os dois gastam parecido no fim do mês *(erro representado: Achar que os consumos se igualam)*

Pistas medidas depois: só a certa repete o enunciado.

**Justificativa:** Comparação de consumo com dados fornecidos.

**Ajuste da Etapa 2b:** Afirmação não conferida retirada. A versão anterior dava como fato que uma geladeira gasta "de 30 a 50 kWh por mês". Agora o consumo da geladeira vem no enunciado (35 kWh, como numa etiqueta), e a resposta sai da conta. O raciocínio cobrado continua o mesmo: potência alta por pouco tempo contra potência baixa por muito tempo.

### Mestre Ohm · leve · 3

**Antes:** Para gastar menos no banho, o melhor é…

- ✔ Banho curto e chave no "verão"
- ✗ Chave no "inverno" e banho curto
- ✗ Banho longo e chave no "verão"

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Distratores óbvios sobre o banho.

**Depois:** O chuveiro novo é bem mais forte que o antigo. Basta trocar o chuveiro?

- ✔ Não: é preciso ver se o fio e o disjuntor aguentam
- ✗ Sim: o fio que já está na parede aguenta o chuveiro novo *(erro representado: Achar que o fio aguenta qualquer carga)*
- ✗ Basta trocar o disjuntor por um maior *(erro representado: Trocar só o disjuntor)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Chuveiro mais forte exige rever fio e disjuntor.

### Mestre Ohm · moderado · 1

**Antes:** Dois resistores de 10 Ω em paralelo, ligados em 12 V. Corrente total?

- ✔ 2,4 A
- ✗ 1,2 A
- ✗ 0,6 A

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Pergunta mantida; explicação ampliada com o erro de cada distrator.

**Depois:** Dois resistores de 10 Ω em paralelo, ligados em 12 V. Corrente total?

- ✔ 2,4 A
- ✗ 1,2 A *(erro representado: Calcular a corrente de um resistor só)*
- ✗ 0,6 A *(erro representado: Calcular como se fosse série)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Associação em paralelo e lei de Ohm.

### Mestre Ohm · moderado · 2

**Antes:** Ferro de passar de 1000 W, 30 min por dia, durante 30 dias. Consumo?

- ✔ 15 kWh
- ✗ 30 kWh
- ✗ 1,5 kWh

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Pergunta mantida; distrator 1,5 kWh trocado por 900 kWh (usar minutos como horas).

**Depois:** Ferro de passar de 1000 W, 30 min por dia, durante 30 dias. Consumo?

- ✔ 15 kWh
- ✗ 30 kWh *(erro representado: Esquecer que 30 min é meia hora)*
- ✗ 900 kWh *(erro representado: Usar minutos como horas)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Energia com conversão de tempo.

### Mestre Ohm · moderado · 3

**Antes:** Chuveiro de 5500 W em 220 V. Qual disjuntor faz sentido?

- ✔ 32 A
- ✗ 16 A
- ✗ 63 A

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Escolha de disjuntor sem dado de cabo (resposta discutível).

**Depois:** Chuveiro de 5500 W / 220 V. Corrente de projeto?

- ✔ 25 A
- ✗ 43 A *(erro representado: Usar a tensão errada (127 V))*
- ✗ 0,04 A *(erro representado: Inverter a divisão (U ÷ P))*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Corrente de projeto do chuveiro, com erros de tensão e de inversão.

### Mestre Ohm · full · 1

**Antes:** 10 × 550 Wp, HSP 5,5 h, PR 0,8. Energia diária estimada?

- ✔ 24,2 kWh
- ✗ 30,25 kWh
- ✗ 44 kWh

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Energia solar diária (capítulo solar ainda não existe; ver pendências).

**Depois:** Duas cargas de 60 W / 220 V ligadas em série em 220 V. Potência total?

- ✔ 30 W
- ✗ 60 W *(erro representado: Achar que cada uma mantém sua potência)*
- ✗ 120 W *(erro representado: Somar as potências)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Potência em série com R constante: exige P = U²/R.

### Mestre Ohm · full · 2

**Antes:** 12 módulos, Voc 49,5 V, coef. −0,27 %/°C, célula a 10 °C. Voc da string?

- ✔ ≈ 618 V
- ✗ 594 V
- ✗ ≈ 570 V

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Voc de string solar (capítulo solar ainda não existe; ver pendências).

**Depois:** Chuveiro de 7500 W, 4 banhos de 8 min por dia, 30 dias, tarifa de R$ 0,80/kWh. Custo no mês?

- ✔ R$ 96
- ✗ R$ 24 *(erro representado: Contar só um banho por dia)*
- ✗ R$ 3,20 *(erro representado: Calcular só um dia)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Custo mensal do chuveiro: energia, conversão de tempo e tarifa.

### Mestre Ohm · full · 3

**Antes:** 10 A em 30 m de cabo de 4 mm² (ida e volta = 60 m; ρ = 0,0172). Queda em 220 V?

- ✔ ≈ 2,6 V (1,2 %)
- ✗ ≈ 5,2 V (2,3 %)
- ✗ ≈ 0,26 V (0,1 %)

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Pergunta mantida (queda de tensão); distrator sem erro identificável trocado.

**Depois:** 10 A em 30 m de cabo 4 mm² (ida e volta = 60 m; ρ = 0,0172 Ω·mm²/m). Queda em 220 V?

- ✔ ≈ 2,6 V (1,2 %)
- ✗ ≈ 1,3 V (0,6 %) *(erro representado: Esquecer a volta do cabo)*
- ✗ ≈ 0,26 V (0,1 %) *(erro representado: Esquecer de multiplicar pela corrente)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Queda de tensão com ida e volta e limite de 4 % (NBR 5410, 6.2.7.2).

**Ajuste da Etapa 2b:** Pista corrigida (valor do meio). O distrator de 5,2 V não correspondia a um erro identificável; foi trocado por 1,3 V (esquecer a volta do cabo). Número do item corrigido para 6.2.7.2.

## O Quadro

### O Quadro · leve · 1

**Antes:** Para que serve o disjuntor geral do quadro?

- ✔ Desligar a casa toda de uma vez
- ✗ Deixar a energia mais forte
- ✗ Economizar luz

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores absurdos ("Deixar a energia mais forte").

**Depois:** Muitos aparelhos ligados fazem um fio esquentar. Quem desliga esse circuito no quadro?

- ✔ O disjuntor que protege aquele fio
- ✗ O DR, que protege contra choque e sobrecarga *(erro representado: Achar que o DR protege contra sobrecarga)*
- ✗ O DPS, que segura os excessos *(erro representado: Achar que o DPS limita corrente)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Qual dispositivo atua em sobrecarga.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("circuito"). Reescrita a certa.

### O Quadro · leve · 2

**Antes:** O DR protege as pessoas de quê?

- ✔ Do choque elétrico
- ✗ Da conta alta
- ✗ Da falta de luz

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores absurdos ("Da conta alta").

**Depois:** Depois do DR, alguém juntou o fio azul (neutro) com o verde-amarelo (terra). O que acontece?

- ✔ O DR desarma: parte da volta foge pelo terra
- ✗ Continua normal: neutro e terra vão para o chão igual *(erro representado: Achar que neutro e terra são equivalentes)*
- ✗ A proteção melhora: são dois fios de segurança *(erro representado: Achar que unir os dois reforça a proteção)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Consequência de unir N e PE depois do DR.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("terra"). O distrator "nada muda" passou a citar neutro e terra.

### O Quadro · leve · 3

**Antes:** Qual fio vai na barra do terra (PE) do quadro?

- ✔ O verde-amarelo
- ✗ O azul-claro
- ✗ O vermelho

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Memorização de cor.

**Depois:** Por que o DPS precisa estar ligado ao fio terra?

- ✔ É pelo terra que ele manda embora o excesso do raio
- ✗ Ele usa o terra para medir a energia da casa *(erro representado: Achar que o DPS mede energia)*
- ✗ Ele não precisa: funciona sozinho no quadro *(erro representado: Achar que o DPS funciona sem caminho para o surto)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Por que o DPS precisa do terra.

### O Quadro · moderado · 1

**Antes:** Qual a função do DPS no quadro?

- ✔ Desviar surtos de tensão, como os de raio, para o terra
- ✗ Desligar na sobrecarga
- ✗ Medir o consumo

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Definição do DPS (memorização).

**Depois:** Sobrecarga, fuga à terra e surto de raio. Quem atua em cada caso, nessa ordem?

- ✔ Disjuntor, DR e DPS
- ✗ DR, disjuntor e DPS *(erro representado: Trocar disjuntor e DR)*
- ✗ DPS, DR e disjuntor *(erro representado: Inverter os três)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Associar cada falha ao dispositivo certo.

### O Quadro · moderado · 2

**Antes:** O DR de 30 mA desliga quando…

- ✔ A corrente que vai pela fase é diferente da que volta pelo neutro
- ✗ A tensão cai
- ✗ A corrente passa de 30 A

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Definição do DR (memorização).

**Depois:** O DR desarma ao ligar o chuveiro novo. O neutro desse circuito foi tirado da barra de neutro antes do DR. Por quê?

- ✔ A volta não passa pelo DR: para ele, tudo é fuga
- ✗ O chuveiro puxa mais de 30 mA e passa do limite *(erro representado: Achar que 30 mA é limite de consumo)*
- ✗ O DR mede a corrente total, e o chuveiro é forte demais *(erro representado: Achar que o DR mede a corrente total)*

Pistas medidas depois: só a certa justifica.

**Justificativa:** Diagnóstico: DR que desarma por neutro tirado antes dele.

### O Quadro · moderado · 3

**Antes:** Depois do DR, neutro e terra (PE) podem ser ligados juntos?

- ✔ Não: o DR desarma e a proteção se perde
- ✗ Sim, é a mesma coisa
- ✗ Só no circuito de tomadas

Pistas medidas antes: certa é a mais longa; palavra absoluta só nas erradas; só a certa justifica.

**Problema da versão anterior:** Pergunta sobre N e PE (o conceito foi para quadro:leve:1).

**Depois:** O DPS é ligado em série ou em paralelo com o circuito?

- ✔ Paralelo: entre os condutores vivos e o PE
- ✗ Série: a corrente da casa passa por ele e é filtrada *(erro representado: Achar que o DPS filtra em série)*
- ✗ Série, no condutor neutro *(erro representado: Achar que vai no neutro)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Ligação do DPS em paralelo.

### O Quadro · full · 1

**Antes:** Onde a NBR 5410 exige DR de alta sensibilidade (≤ 30 mA)?

- ✔ Banheiros, áreas externas, cozinhas, lavanderias, áreas de serviço e garagens, entre outros
- ✗ Só no chuveiro
- ✗ Só em instalação industrial

Pistas medidas antes: certa é a mais longa; palavra absoluta só nas erradas.

**Problema da versão anterior:** Lista de locais de DR com distrator absurdo ("Só no chuveiro").

**Depois:** Interruptor DR de 25 A, depois de um disjuntor geral de 40 A, alimenta circuitos que somam 35 A. Qual o problema?

- ✔ O DR não abre por sobrecorrente e vai aquecer
- ✗ Não há problema: o DR desarma sozinho acima de 25 A *(erro representado: Achar que o DR abre por sobrecorrente)*
- ✗ O DR entende os 35 A como fuga e desarma *(erro representado: Confundir sobrecorrente com fuga)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Interruptor DR sem proteção de sobrecorrente (NBR 5410, 6.3.6.2.2).

**Ajuste da Etapa 2b:** Afirmação corrigida. A explicação dizia que o DR deve ter corrente nominal "em geral, igual ou maior" que a do disjuntor, frase que não está na norma. Agora cita o requisito da NBR 5410 (6.3.6.2.2-a).

### O Quadro · full · 2

**Antes:** Casa sem para-raios (SPDA): classe usual do DPS no quadro de distribuição?

- ✔ Classe II
- ✗ Classe I
- ✗ Classe III

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Classe do DPS sem SPDA (o tema foi para quadro:full:2, no critério da norma).

**Depois:** Por que o condutor PE não passa por dentro do DR?

- ✔ A fuga tem que voltar por fora para criar a diferença
- ✗ O PE não tem tensão nenhuma, então não precisa passar *(erro representado: Achar que o PE não precisa de atenção)*
- ✗ O DR não suporta a corrente de falta no PE *(erro representado: Atribuir a regra a limite de corrente do DR)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Por que o PE fica fora do DR (NBR 5410, 6.3.3.2.5).

**Ajuste da Etapa 2b:** Explicação completada com o item da norma (6.3.3.2.5), conferido.

### O Quadro · full · 3

**Antes:** Por que o condutor PE não passa pelo DR?

- ✔ A fuga precisa voltar por fora do DR para ele medir a diferença
- ✗ O DR não tem borne para ele
- ✗ O PE nunca tem tensão

Pistas medidas antes: certa é a mais longa; palavra absoluta só nas erradas.

**Problema da versão anterior:** Por que o PE não passa no DR (tema foi para quadro:full:1).

**Depois:** Prédio com SPDA (para-raios). Pela NBR 5410, o DPS da entrada deve ser escolhido por…

- ✔ Corrente de impulso Iimp, para a descarga direta
- ✗ Corrente nominal In de 5 kA, como numa casa *(erro representado: Dimensionar só por In, como sem risco de descarga direta)*
- ✗ Tensão Uc maior, sem olhar a corrente do raio *(erro representado: Achar que Uc resolve a energia do raio)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Especificação do DPS de entrada com SPDA pelo critério da NBR 5410 (Iimp).

**Ajuste da Etapa 2b:** Afirmação não conferida corrigida. A versão anterior dizia que o DPS da entrada é "ensaiado com onda 10/350 µs". A NBR 5410 (6.3.5.2.4-d, nota) diz que não há forma de onda fixada para o ensaio de Iimp. A pergunta passou a usar o critério da norma (Iimp, mínimo de 12,5 kA). "Classe I" ficou só como o nome usado no comércio.

## Raio na Serra

### Raio na Serra · leve · 1

**Antes:** Dia de tempestade com raios. O que fazer com os aparelhos?

- ✔ Tirar da tomada quando der
- ✗ Ligar todos
- ✗ Mexer no quadro

Pistas medidas antes: certa é a mais longa; palavra absoluta só nas erradas.

**Problema da versão anterior:** Distratores absurdos ("Mexer no quadro").

**Depois:** Dia de tempestade com raios. Qual atitude protege mais os aparelhos?

- ✔ Tirar da tomada a TV e o computador
- ✗ Apagar a luz no interruptor da sala *(erro representado: Achar que apagar a luz desliga os aparelhos)*
- ✗ Deixar ligado: o disjuntor desarma no raio *(erro representado: Achar que o disjuntor segura o raio)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Proteção prática dos aparelhos numa tempestade.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("aparelhos"). A certa passou a dar o exemplo concreto.

### Raio na Serra · leve · 2

**Antes:** O DPS manda o surto para onde?

- ✔ Para o terra
- ✗ Para o vizinho
- ✗ Para o chuveiro

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Distratores absurdos ("Para o vizinho").

**Depois:** Para o DPS funcionar bem, o fio dele até o terra deve ser…

- ✔ O mais curto e reto possível
- ✗ Longo, para o surto perder força no caminho *(erro representado: Achar que fio longo "cansa" o surto)*
- ✗ Enrolado, para a sobra caber no quadro *(erro representado: Enrolar a sobra do fio)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Fio do DPS curto e reto (NBR 5410, 6.3.5.2.9 proíbe curvas e laços).

### Raio na Serra · leve · 3

**Antes:** A haste de aterramento fica…

- ✔ Enterrada no chão
- ✗ Em cima do telhado
- ✗ Dentro da parede

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Memorização (onde fica a haste).

**Depois:** A janelinha do DPS ficou vermelha, mas a luz da casa funciona. O que fazer?

- ✔ Trocar o DPS: ele parou de proteger
- ✗ Deixar como está: se a luz funciona, ele funciona *(erro representado: Achar que, se funciona, está protegido)*
- ✗ Desligar e religar o DPS para voltar ao verde *(erro representado: Achar que o DPS rearma)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Leitura do indicador de fim de vida do DPS.

### Raio na Serra · moderado · 1

**Antes:** O DPS fica ligado entre…

- ✔ Fase (e neutro) e o PE
- ✗ Duas fases de circuitos diferentes
- ✗ Neutro e a carga

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Onde o DPS é ligado (tema foi para quadro:moderado:2).

**Depois:** O disjuntor protege os aparelhos contra o surto de um raio?

- ✔ Não: é rápido demais para ele abrir
- ✗ Sim: o disparo magnético é instantâneo *(erro representado: Achar que o magnético pega qualquer surto)*
- ✗ Sim, se for curva B, que é mais rápida *(erro representado: Achar que curva B resolve)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Disjuntor × surto: escala de tempo.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("surto"). Reescrita a certa.

### Raio na Serra · moderado · 2

**Antes:** Por que o fio que liga o DPS ao PE deve ser curto?

- ✔ Fio longo aumenta a tensão que chega aos aparelhos no surto
- ✗ Fio curto é mais barato
- ✗ Senão o DR desarma

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Pergunta mantida (fio curto), agora com o item da norma.

**Depois:** Por que a ligação do DPS ao PE deve ser curta?

- ✔ Fio longo soma tensão indutiva, que chega aos aparelhos
- ✗ Fio longo esquenta com o surto e acaba queimando o DPS logo *(erro representado: Achar que o problema é aquecimento)*
- ✗ Fio curto evita que o DR desarme junto com o surto *(erro representado: Associar ao DR)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Indutância do fio e tensão extra no surto.

**Ajuste da Etapa 2b:** Afirmação conferida (6.3.5.2.9). A explicação dizia "regra usual de 0,5 m"; agora cita o item da norma, que também proíbe curvas e laços (o que confirma o distrator "fio enrolado" do nível leve como erro real).

### Raio na Serra · moderado · 3

**Antes:** A janela do DPS ficou vermelha. Isso indica…

- ✔ Que ele chegou ao fim da vida útil e precisa ser trocado
- ✗ Que está funcionando
- ✗ Que falta neutro

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Janela vermelha (tema foi para surto:leve:2).

**Depois:** Rede de 220 V fase-neutro. Por que não usar um DPS de Uc = 175 V, que "protege mais cedo"?

- ✔ Ele conduziria com a tensão normal e se destruiria
- ✗ Ele protegeria melhor os aparelhos, mas custa mais caro *(erro representado: Achar que Uc menor só protege melhor)*
- ✗ Ele faria o disjuntor geral desarmar no surto *(erro representado: Associar Uc ao disjuntor geral)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Por que não escolher Uc baixo demais.

### Raio na Serra · full · 1

**Antes:** DPS com Uc = 275 V numa rede de 220 V fase-neutro. Uc significa…

- ✔ A tensão máxima que ele suporta continuamente sem conduzir
- ✗ A potência máxima protegida
- ✗ A tensão em que ele desliga o circuito

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Definição de Uc (tema foi para surto:full:2, com a tabela 49).

**Depois:** O DPS tem Up = 1,5 kV. O que isso significa para os equipamentos?

- ✔ Recebem até 1,5 kV mais a queda nos fios do DPS
- ✗ Recebem no máximo os 220 V da rede durante o surto *(erro representado: Achar que o DPS segura a tensão na nominal)*
- ✗ O DPS desliga o circuito acima de 1,5 kV *(erro representado: Achar que o DPS desliga o circuito)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Significado de Up e limite de 2,5 kV (NBR 5410, 6.3.5.2.4-a).

**Ajuste da Etapa 2b:** Explicação completada com o limite de Up da NBR 5410 (6.3.5.2.4-a, nota 1).

### Raio na Serra · full · 2

**Antes:** Em esquema TN-S, o DPS no quadro é ligado…

- ✔ Entre cada fase e o PE, e entre neutro e PE
- ✗ Somente entre fases
- ✗ Entre o neutro e a carga

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Ligação do DPS em TN-S (memorização).

**Depois:** No surto, a corrente sobe 1 kA por microssegundo, e cada metro de fio tem cerca de 1 µH. Quanto 1 m a mais de fio soma?

- ✔ ≈ 1 kV
- ✗ ≈ 1 V *(erro representado: Erro de ordem de grandeza (µ × k))*
- ✗ ≈ 1 mV *(erro representado: Erro de ordem de grandeza duplo)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Tensão induzida L·di/dt por metro de fio (valor de indutância dado no enunciado).

### Raio na Serra · full · 3

**Antes:** O DPS classe II do quadro deve ter…

- ✔ A proteção de retaguarda indicada pelo fabricante
- ✗ Nenhuma proteção
- ✗ Um DR exclusivo de 300 mA em série

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Proteção de retaguarda do DPS (resposta "a indicada pelo fabricante", sem raciocínio).

**Depois:** Rede 220/380 V em esquema TN-S. Qual o Uc mínimo do DPS entre fase e PE?

- ✔ ≈ 242 V (1,1 × U0)
- ✗ 220 V (igual a U0) *(erro representado: Usar U0 sem folga)*
- ✗ 380 V (tensão entre fases) *(erro representado: Usar a tensão entre fases)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Uc mínimo pela tabela 49 da NBR 5410.

**Ajuste da Etapa 2b:** Afirmação conferida (tabela 49). O enunciado dizia "esquema TN"; a tabela separa TN-C (fase-PEN) de TN-S (fase-PE). O enunciado agora diz TN-S, e a explicação cita o item.

## Primeiro Turno

### Primeiro Turno · leve · 1

**Antes:** Antes de mexer no motor da máquina, o eletricista…

- ✔ Desliga, trava e sinaliza o painel
- ✗ Mexe com ele ligado, rápido
- ✗ Pede para alguém segurar o botão

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores absurdos ("Pede para alguém segurar o botão").

**Depois:** O eletricista desligou o painel da esteira. Por que ainda coloca cadeado e etiqueta?

- ✔ Para ninguém religar sem saber que tem gente mexendo
- ✗ Para mostrar ao chefe que o serviço foi feito *(erro representado: Achar que é só burocracia)*
- ✗ Porque o cadeado corta a energia melhor que a chave *(erro representado: Achar que o cadeado corta a energia)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Por que bloquear além de desligar.

### Primeiro Turno · leve · 2

**Antes:** O botão verde da máquina serve para…

- ✔ Ligar
- ✗ Desligar
- ✗ Emergência

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Memorização ("verde liga").

**Depois:** O botão verde da esteira volta quando a gente solta. O que mantém a esteira girando?

- ✔ Um contato da contatora que segura a ligação (o selo)
- ✗ O motor, que depois de girar não precisa de comando *(erro representado: Achar que o motor dispensa comando)*
- ✗ O botão, que guarda que foi apertado *(erro representado: Achar que o botão tem memória)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Selo: o que mantém a máquina ligada.

### Primeiro Turno · leve · 3

**Antes:** A contatora é como…

- ✔ Um interruptor que liga sozinho quando a bobina recebe energia
- ✗ Uma lâmpada
- ✗ Um fio grosso

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores absurdos ("Uma lâmpada").

**Depois:** A esteira travou e o motor começou a esquentar. Quem desliga o motor antes de queimar?

- ✔ O relé térmico, que sente a corrente alta
- ✗ O botão vermelho, que solta sozinho quando esquenta *(erro representado: Achar que o botão de parada é automático)*
- ✗ A contatora, que derrete o contato e abre *(erro representado: Achar que a contatora derrete e protege)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Quem protege o motor travado.

### Primeiro Turno · moderado · 1

**Antes:** Para que serve o contato de selo (13-14) na partida direta?

- ✔ Manter a bobina ligada depois de soltar a botoeira liga
- ✗ Proteger contra curto
- ✗ Inverter o sentido do motor

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Definição do selo (tema foi para turno:leve:1 e turno:moderado:1).

**Depois:** Painel desligado e bloqueado com cadeado. Antes de tocar nos bornes do motor, falta…

- ✔ Testar com instrumento que não há tensão
- ✗ Pode tocar: com o cadeado, está seguro *(erro representado: Achar que o cadeado garante a ausência de tensão)*
- ✗ Avisar o operador para não apertar o LIGA *(erro representado: Trocar procedimento por aviso verbal)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Bloqueio não substitui constatar ausência de tensão (NR-10).

### Primeiro Turno · moderado · 2

**Antes:** O relé térmico desarma quando…

- ✔ O motor puxa corrente acima do ajuste por um tempo (sobrecarga)
- ✗ Falta neutro
- ✗ A tensão sobe

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Definição do relé térmico.

**Depois:** Faltou energia com a esteira ligada. Quando a energia volta, a esteira…

- ✔ Fica parada até alguém apertar o LIGA
- ✗ Volta a girar sozinha: o selo estava fechado *(erro representado: Achar que o selo "lembra" o estado)*
- ✗ Gira enquanto alguém segurar o LIGA *(erro representado: Confundir com comando por impulso)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Falta de energia e religamento: o selo impede religar sozinho (NBR 5410, 5.5.5).

### Primeiro Turno · moderado · 3

**Antes:** A botoeira desliga é NF porque…

- ✔ Se o fio dela romper, a máquina para
- ✗ É mais barata
- ✗ Gasta menos energia

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Por que a botoeira desliga é NF (tema foi para sobrecarga:full:2).

**Depois:** Motor com 10 A na placa. Onde se ajusta o relé térmico?

- ✔ Em 10 A, a corrente nominal
- ✗ Em 15 A, para dar folga na partida *(erro representado: Dar folga acima da placa)*
- ✗ Em 70 A, a corrente de partida *(erro representado: Ajustar pela corrente de partida)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Ajuste do relé térmico pela corrente nominal.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("placa"). Reescrita a certa.

### Primeiro Turno · full · 1

**Antes:** NR-12: a parada de emergência deve…

- ✔ Ter prioridade sobre as outras funções e exigir rearme intencional
- ✗ Ficar escondida para não ser apertada à toa
- ✗ Religar a máquina ao soltar

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** NR-12 emergência (tema foi para turno:full:1).

**Depois:** Duas equipes vão trabalhar no mesmo motor. Como fica o bloqueio?

- ✔ Cada trabalhador põe o próprio cadeado
- ✗ Um cadeado do supervisor vale para as duas equipes *(erro representado: Confiar num cadeado coletivo)*
- ✗ A primeira equipe bloqueia; a segunda confere *(erro representado: Delegar a conferência a outra equipe)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Bloqueio com várias equipes: um cadeado por trabalhador.

### Primeiro Turno · full · 2

**Antes:** Na partida direta, a corrente de partida de um motor de indução fica em torno de…

- ✔ 6 a 8 vezes a nominal
- ✗ Igual à nominal
- ✗ Metade da nominal

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Corrente de partida "6 a 8 × In" (número não conferido nos documentos).

**Depois:** NR-12: a parada de emergência deve…

- ✔ Ter prioridade e exigir rearme intencional
- ✗ Desligar o motor e manter o comando pronto *(erro representado: Desligar só o motor mantendo o comando pronto)*
- ✗ Voltar ao normal quando o botão for solto *(erro representado: Achar que a emergência volta sozinha)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** NR-12: prioridade e rearme da emergência (12.6.3 a 12.6.8).

### Primeiro Turno · full · 3

**Antes:** O relé térmico é ajustado pela…

- ✔ Corrente nominal do motor (placa)
- ✗ Potência da lâmpada do painel
- ✗ Tensão da bobina

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Ajuste do relé "pela potência da lâmpada do painel" (absurdo).

**Depois:** Motor de In = 10 A, partida direta com Ip = 7 × In. Por que o disjuntor-motor não desarma nos 70 A da partida?

- ✔ A partida é curta e fica abaixo das curvas de disparo
- ✗ O disjuntor-motor reconhece que é motor e ignora o pico *(erro representado: Achar que o disjuntor "reconhece" motor)*
- ✗ 70 A ainda não é curto-circuito, e o disjuntor espera o curto *(erro representado: Achar que só curto faz desarmar)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Por que o disjuntor-motor não desarma na partida.

**Ajuste da Etapa 2b:** Afirmação não conferida retirada. A versão anterior dizia que o magnético do disjuntor-motor fica "em geral entre 12 e 14 vezes o ajuste", número que não está em nenhum documento disponível (a NBR NM 60898 exclui disjuntores de proteção de motor). A explicação agora remete ao catálogo do fabricante. A pergunta e as alternativas não mudaram.

## Fim de Turno

### Fim de Turno · leve · 1

**Antes:** Para a esteira andar para trás, o motor precisa…

- ✔ Girar ao contrário
- ✗ Ficar mais forte
- ✗ Desligar

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores fracos ("Ficar mais forte").

**Depois:** Para a esteira andar para trás, o que o eletricista troca na ligação do motor?

- ✔ Dois dos três fios de força
- ✗ Os três fios, cada um no lugar do outro *(erro representado: Trocar os três em roda (mantém o sentido))*
- ✗ Um fio de força pelo fio terra *(erro representado: Usar o terra como condutor)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Reversão: trocar dois fios.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("motor"). Reescrita a certa.

### Fim de Turno · leve · 2

**Antes:** Por que não se pode ligar "frente" e "trás" ao mesmo tempo?

- ✔ Dá curto e pode queimar tudo
- ✗ Fica mais rápido
- ✗ Nada acontece

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Distratores fracos ("Nada acontece").

**Depois:** Por que a máquina não deixa ligar "frente" e "trás" ao mesmo tempo?

- ✔ Os dois juntos dariam curto entre os fios de força
- ✗ O motor ficaria parado, travado entre os dois sentidos *(erro representado: Achar que o motor só trava)*
- ✗ A esteira tentaria andar para os dois lados e quebraria *(erro representado: Pensar no efeito mecânico e não no curto)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Por que não ligar frente e trás juntos.

**Ajuste da Etapa 2b:** Pista corrigida (eco do enunciado): só a alternativa certa repetia uma palavra do enunciado ("ligar"). Reescrita a certa.

### Fim de Turno · leve · 3

**Antes:** Motor grande puxa muita energia na partida. Para ajudar, usamos…

- ✔ Partida estrela-triângulo
- ✗ Mais lâmpadas
- ✗ Fio mais fino

Pistas medidas antes: certa é a mais longa; só a certa repete o enunciado.

**Problema da versão anterior:** Distratores absurdos ("Mais lâmpadas", "Fio mais fino").

**Depois:** Por que um motor grande parte primeiro de um jeito e depois de outro (estrela-triângulo)?

- ✔ Para não puxar um pico enorme de corrente
- ✗ Para gastar menos energia o dia inteiro de trabalho *(erro representado: Achar que economiza energia em regime)*
- ✗ Para o motor ter mais força no arranque pesado *(erro representado: Achar que aumenta o torque de partida)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Objetivo da estrela-triângulo.

### Fim de Turno · moderado · 1

**Antes:** Na reversão de um motor trifásico, o que se troca?

- ✔ Duas das três fases
- ✗ As três fases
- ✗ A fase pelo neutro

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Reversão "troca duas fases" (memorização).

**Depois:** Num motor trifásico, você troca L1 com L2 e depois L2 com L3. O sentido final…

- ✔ Volta ao original: duas trocas se cancelam
- ✗ Fica invertido, porque houve troca de fases *(erro representado: Achar que qualquer troca inverte)*
- ✗ Muda de velocidade, porque as fases mudaram *(erro representado: Associar troca de fases à velocidade)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Duas trocas sucessivas se cancelam.

### Fim de Turno · moderado · 2

**Antes:** O intertravamento da reversão é feito com…

- ✔ Um contato NF de uma contatora em série com a bobina da outra
- ✗ Dois disjuntores
- ✗ Um DR

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Pergunta mantida (intertravamento), com distratores melhores.

**Depois:** O intertravamento elétrico da reversão usa…

- ✔ Um NF de cada contatora em série com a bobina da outra
- ✗ Um NA de cada contatora em paralelo com a bobina da outra *(erro representado: Inverter NA/NF e série/paralelo)*
- ✗ Um disjuntor separado para cada sentido *(erro representado: Usar proteção no lugar de intertravamento)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** NF em série com a bobina da outra.

### Fim de Turno · moderado · 3

**Antes:** Na estrela-triângulo, o motor parte em…

- ✔ Estrela e depois passa para triângulo
- ✗ Triângulo e depois estrela
- ✗ Estrela o tempo todo

Pistas medidas antes: certa é a mais longa; palavra absoluta só nas erradas.

**Problema da versão anterior:** Sequência estrela → triângulo (memorização).

**Depois:** Na partida estrela-triângulo, o torque de partida…

- ✔ Cai para cerca de 1/3 do da partida direta
- ✗ Aumenta, porque a corrente de partida é menor *(erro representado: Achar que menos corrente dá mais torque)*
- ✗ Fica igual ao da partida direta *(erro representado: Achar que nada muda)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Consequência no torque de partida.

### Fim de Turno · full · 1

**Antes:** A estrela-triângulo reduz a corrente de partida da linha para cerca de…

- ✔ 1/3 da partida direta
- ✗ 1/2 da partida direta
- ✗ 1/√3 da corrente nominal

Pistas medidas antes: nenhuma medida.

**Problema da versão anterior:** Redução a 1/3 (o conceito foi para fimturno:moderado:2).

**Depois:** Com L1-L2-L3 em U-V-W, o motor gira no sentido horário. Ligando L2-L3-L1 em U-V-W, ele…

- ✔ Gira no mesmo sentido: a sequência só foi deslocada
- ✗ Gira no sentido anti-horário: as três fases mudaram *(erro representado: Achar que mudar todas as fases inverte)*
- ✗ Não parte: perdeu a referência de fase *(erro representado: Achar que perde referência)*

Pistas medidas depois: nenhuma medida.

**Justificativa:** Sequência de fases deslocada não inverte o giro.

### Fim de Turno · full · 2

**Antes:** Motor 380/660 V numa rede de 380 V pode partir em estrela-triângulo?

- ✔ Sim: em triângulo ele trabalha em 380 V
- ✗ Não, precisa de 660 V
- ✗ Só com inversor de frequência

Pistas medidas antes: certa é a mais longa; palavra absoluta só nas erradas; só a certa repete o enunciado; só a certa justifica.

**Problema da versão anterior:** Motor 380/660 em rede 380 (mantido em fimturno:full:2).

**Depois:** Por que muitos painéis de reversão têm intertravamento mecânico além do elétrico?

- ✔ Se um auxiliar falhar, o mecânico ainda impede as duas
- ✗ Porque o elétrico falha com o motor em movimento *(erro representado: Inventar limitação do elétrico)*
- ✗ Porque a NBR 5410 proíbe usar só o elétrico *(erro representado: Atribuir à norma uma proibição que não existe)*

Pistas medidas depois: certa é a mais longa; palavra absoluta só nas erradas.

**Justificativa:** Redundância do intertravamento mecânico.

### Fim de Turno · full · 3

**Antes:** Quantos terminais o motor precisa ter para estrela-triângulo?

- ✔ 6 (U1, V1, W1, U2, V2, W2)
- ✗ 3
- ✗ 4

Pistas medidas antes: certa é a mais longa.

**Problema da versão anterior:** Seis terminais para Y-Δ (conteúdo de ME II UC 2, 6.2.7; ver pendências).

**Depois:** Motor 380/660 V numa rede de 380 V pode partir em estrela-triângulo?

- ✔ Sim: em triângulo ele trabalha em 380 V
- ✗ Não: precisaria de rede de 660 V *(erro representado: Exigir rede de 660 V)*
- ✗ Sim, mas fica em estrela no regime *(erro representado: Achar que fica em estrela no regime)*

Pistas medidas depois: certa é a mais longa.

**Justificativa:** Pergunta 380/660 mantida, com distratores reescritos.

## Sobrecarga! (fase de previsão)

As cenas e as respostas certas não mudaram: o teste confere que a resposta certa bate com a simulação. Mudaram só os distratores absurdos.

| Nível | Antes (distratores) | Depois (distratores) | Justificativa |
|---|---|---|---|
| leve 1 | Continua girando; Gira mais rápido | Continua girando: o verde já foi apertado; Para e volta sozinho quando esfriar | "Gira mais rápido" não é erro plausível; religamento automático é |
| leve 2 | Continua ligado; Liga a luz | Continua girando: já tinha ligado; Continua até alguém apertar o vermelho | "Liga a luz" era absurdo; os novos confundem botão com retenção |
| leve 3 | Continua girando; Liga de novo sozinho | Para, mas volta sozinho ao soltar o vermelho; Continua: o selo segura a contatora | Mantém a ideia de religamento e acrescenta o erro "selo segura mesmo com o desliga" |
| moderado 3 | Nada acontece; O motor acelera | O motor para, mas volta ao soltar o DESLIGA; O selo mantém a bobina e o motor segue | "O motor acelera" era absurdo |
| full 2 | Partida direta normal; Reversão (certa muito mais longa) | Partida direta com retenção; Partida com religamento automático | Certa encurtada para "Comando por impulso (jog)"; distratores agora são comandos parecidos |
| full 3 | Para consumir menos corrente; Para permitir religar sem o LIGA (certa muito mais longa) | NF consome menos corrente que um NA na bobina; Assim o selo pode religar sozinho depois | Tamanhos equilibrados e erros técnicos plausíveis |

## Resumo

- Perguntas de quiz registradas: 72.
- Com alguma pista medida: 46 antes e 15 depois.
- Pistas que restaram depois: aparecem pergunta por pergunta acima. Os testes limitam cada tipo de pista no conjunto (ver `tests/rodar.js`).
