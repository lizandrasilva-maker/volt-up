# Auditoria técnica do Volt Up — Etapa 1

Data: 20/11/2026 · Branch `bancada-vista-real`

Este documento lista o que o jogo afirma sobre eletricidade e normas e diz, para cada ponto, se foi
**conferido no texto da norma**, **corrigido**, ou se **depende de material que ainda não temos**.
Serve de roteiro para a revisão da professora.

## Fontes usadas

| Documento | Situação |
|---|---|
| NBR 5444:1989 (símbolos para instalações prediais) | Texto e tabelas lidos |
| NBR 14136 (plugues e tomadas) | Texto lido |
| NR-10 (texto atualizado 2026) | Texto lido |
| NR-12 (texto atualizado 2022) | Itens de parada de emergência lidos |
| NBR 5410:2004 (instalações de baixa tensão) | Itens citados abaixo lidos no texto |
| Especificação técnica de fornecimento da Enel CE (CNC-OMBR-MAT-18-0124) | Esquema de aterramento e limites de motor lidos |
| NBR 16690 (projeto de 2019, sistemas fotovoltaicos) | Fora do escopo do jogo hoje; guardada para uma fase solar futura |
| NBR NM 60898:2004 (disjuntores) | Tabelas 2 e 6 e seção 6 lidas |

> A NBR 5444 é de 1989. **Decisão:** o jogo segue a NBR 5444, que é a referência usada no curso.

## 1. Corrigido nesta etapa

| # | O que estava | Fonte | O que mudou |
|---|---|---|---|
| 1 | Planta: todos os condutores com o mesmo traço, diferenciados só pela cor | NBR 5444, tabela 2 (5.6–5.9) | Fase cruza o eletroduto; neutro cruza com gancho; retorno é meio traço; terra é meio traço com "T". A cor ficou como ajuda extra |
| 2 | Planta: interruptores paralelo e intermediário como círculo vazio com texto "S3w/S4w" | NBR 5444, tabela 4 (7.1–7.5) | Simples = vazio; paralelo = cheio; intermediário = meio cheio; pulsador = círculo com ponto |
| 3 | Planta: ponto de luz com círculo duplo | NBR 5444, tabela 5 (8.1 e 8.3) | Círculo duplo significa luminária **embutida**. Agora é um círculo, com -circuito- ao lado, letra de comando e potência |
| 4 | Chico: "a fase fica à direita" apresentado como regra | NBR 14136 | A norma só define dimensões de pinos e contatos, não o lado da fase. A fala agora diz que é o padrão **da bancada** e que, na obra, confere-se com instrumento |
| 5 | Pergunta NR-10: "após seccionar e impedir a reenergização…" (ordem antiga) | NR-10, 10.13.1 | Nova ordem: seccionar → constatar ausência de tensão → impedir reenergização → constatar e aterrar temporariamente → proteger partes vivas → sinalizar → delimitar. Pergunta reescrita |
| 6 | DR "com 30 mA de diferença desarma" | Regra de ensaio do DR (IEC 61008) | Não pode atuar abaixo de 15 mA e tem que atuar até 30 mA; não protege contra sobrecarga |
| 7 | Interruptor na fase: sem aviso de segurança | Ponto 4 da revisão externa | Explicação acrescenta: para trocar a lâmpada, desligue o disjuntor. Interruptor não é desligamento seguro |
| 8 | Emergência: "vermelho sobre amarelo" atribuído à NR-12 | NR-12, 12.6.3 d, 12.6.5 e 12.6.8 | Prioridade, retenção e rearme manual: confirmados na NR-12. A cor é da IEC 60204-1 e agora está atribuída a ela |
| 9 | Mensagem "todo circuito deve ter PE", mas a planta da luz não levava terra (**incoerência alta**) | NBR 5410, 5.1.2.2.3.6 | As quatro plantas agora levam o terra (T) do QD até a caixa do ponto de luz, e as notas dizem isso. O bocal continua sem borne de PE (o bocal simples não tem); a nota explica que uma luminária metálica seria ligada nele. A mensagem do jogo cita o item |
| 10 | "1,5 mm² com 20 A está errado" sem número | NBR 5410, tabela 36 | A explicação agora diz: em eletroduto na parede (B1), 1,5 mm² conduz 17,5 A, então 20 A não protege o fio |

## 2. Conferido e mantido

| Regra do motor | Situação |
|---|---|
| "Cada carga precisa de disjuntor individual" (crítica externa) | **O jogo não exige isso.** A regra é: pelo menos um disjuntor, aberto, deixa a carga sem tensão. "Cada circuito com o seu disjuntor" só é cobrado na fase do quadro, que pede circuitos separados |
| "O PE nunca conduz" (crítica externa) | A mensagem diz "nunca conduz corrente **de serviço**", o que está correto. Em falta, ele conduz, e é isso que faz o DR atuar |
| Lâmpada apagada "sem tensão" | O motor mede a tensão de cada borne em relação à terra (PE = N = 0 V, esquema TN). Então "sem tensão" quer dizer sem tensão em relação ao PE, que é a condição certa. Não quer dizer "seguro para intervir": isso agora aparece no texto (item 7) |
| NR-12: parada de emergência | Prioridade, retenção e rearme intencional conferidos nos itens 12.6.3 a 12.6.8 |
| Cores: neutro azul-claro; PE verde-amarelo (ou verde) | NBR 5410, 6.1.5.3.1 a 6.1.5.3.4. Confere. A norma não fixa cor de fase nem de retorno: são convenção da bancada |
| Seção mínima 1,5 mm² iluminação / 2,5 mm² tomadas | NBR 5410, tabela 47. Confere |
| Interruptor na fase, nunca no neutro; PE nunca seccionado | NBR 5410, 5.6.6.1.2 e 5.6.2.2. Confere |
| Rosca do bocal ligada ao neutro | NBR 5410, 6.5.5.2.4. Confere |
| DR ≤ 30 mA em banheiro, tomadas externas, cozinha, copa, lavanderia, área de serviço, garagem e local molhado | NBR 5410, 5.1.3.2.2. Confere. O condutor PE passa **fora** do DR (6.3.3.2.5) |
| DR: não atua abaixo de 50% de IΔn | NBR 5410, 6.3.3.2.6 confirma o item 6 da seção 1 |
| Selo do contator (sem religar sozinho após falta de tensão) | NBR 5410, 6.5.1.6.1 e 5.5.5. Confere |
| Parada de emergência | NBR 5410, 6.3.7.4.4 e 6.3.7.4.6, além da NR-12. Confere |
| Circuitos separados de iluminação e tomadas | NBR 5410, 4.2.5.5 e 9.5.3.3. Confere |
| Tomada com contato de terra | NBR 5410, 6.5.3.1. Confere |
| Esquema TN-C-S, neutro aterrado no padrão de entrada | Especificação da Enel CE. Confere com o motor (PE = N = 0 V) |
| Motores: até 3 CV monofásico; partida direta trifásica até 5 CV; acima disso, estrela-triângulo, soft-starter ou inversor; FP ≥ 0,92 | Especificação da Enel CE. Ainda não aparece no jogo; entra na Etapa 5 |
| Ligações dos 27 gabaritos | São as ligações clássicas: three-way, four-way, relé de impulso (A1/A2), selo 13-14 em paralelo com o LIGA, 95-96 em série com a bobina, boia cortando a fase. **Ressalva:** o teste automático confere o gabarito com o próprio motor, o que é circular. A validação independente é a revisão humana |

## 3. Decidido (antes pendente)

| Afirmação do jogo | Decisão |
|---|---|
| Curvas B 3–5, C 5–10, D 10–20 × In | **Confere** com a NBR NM 60898, tabela 2. A faixa D de 10 a 20 × In é a nota Mercosul (a IEC permite até 50 × In). A tabela 6 dá os valores que a Etapa 4 vai usar: 1,13 In não atua em 1 h; 1,45 In atua em menos de 1 h; 2,55 In atua entre 1 s e 60 s (até 32 A) |
| "Verde liga, vermelho desliga" | **Mantido como costume no Brasil.** Coerente com a NM 60898, seção 6: em disjuntor de duas botoeiras, só a de abrir pode ser vermelha. A emergência continua vermelha sobre amarelo, como na IEC 60204-1 |
| Símbolos da planta | **NBR 5444**, por decisão do curso |

## 4. Limites do motor (vão para as Etapas 3 e 4)

- Toda carga é um resistor de 1 Ω. Brilho e "girando" são proporcionais, sem ampère real (220 V em 1 Ω seriam 220 A).
- O DR desarma com qualquer fuga, sem limiar de 15–30 mA.
- O relé térmico desarma por ação do aluno, não por I²t.
- O DPS não tem efeito elétrico.
- Não há cabo, seção, queda de tensão, curva de disjuntor nem trifásico. Quando entrarem, usar a
  tabela 36 (capacidade), a tabela 47 (seção mínima) e o limite de queda de 4% (6.2.7) da NBR 5410.

O jogo deve deixar claro, na tela, que a bancada é um **modelo lógico**: mostra se o circuito liga,
comanda e protege; não mostra valores reais de corrente.
