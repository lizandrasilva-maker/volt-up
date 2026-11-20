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
| **NBR 5410** (instalações de baixa tensão) | **Não disponível.** Itens que dependem dela estão na seção 3 |

> A NBR 5444 é de 1989. Confirmar com a escola se ela ainda é a referência de símbolos usada no curso
> ou se a escola segue a IEC 60617.

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

## 2. Conferido e mantido

| Regra do motor | Situação |
|---|---|
| "Cada carga precisa de disjuntor individual" (crítica externa) | **O jogo não exige isso.** A regra é: pelo menos um disjuntor, aberto, deixa a carga sem tensão. "Cada circuito com o seu disjuntor" só é cobrado na fase do quadro, que pede circuitos separados |
| "O PE nunca conduz" (crítica externa) | A mensagem diz "nunca conduz corrente **de serviço**", o que está correto. Em falta, ele conduz, e é isso que faz o DR atuar |
| Lâmpada apagada "sem tensão" | O motor mede a tensão de cada borne em relação à terra (PE = N = 0 V, esquema TN). Então "sem tensão" quer dizer sem tensão em relação ao PE, que é a condição certa. Não quer dizer "seguro para intervir": isso agora aparece no texto (item 7) |
| NR-12: parada de emergência | Prioridade, retenção e rearme intencional conferidos nos itens 12.6.3 a 12.6.8 |
| Ligações dos 27 gabaritos | São as ligações clássicas: three-way, four-way, relé de impulso (A1/A2), selo 13-14 em paralelo com o LIGA, 95-96 em série com a bobina, boia cortando a fase. **Ressalva:** o teste automático confere o gabarito com o próprio motor, o que é circular. A validação independente é a revisão humana |

## 3. Pendente: depende da NBR 5410 (pedir à escola)

| Prioridade | Afirmação do jogo | O que conferir |
|---|---|---|
| **Alta** | Mensagem: "NBR 5410: todo circuito deve ter PE". Mas o bocal não tem PE e a planta da luz não leva terra | Se todo circuito precisa de PE em toda a extensão, a planta deve levar o terra até o ponto de luz, mesmo com bocal sem borne. O projeto de referência enviado aterra todas as luminárias. **Hoje o jogo é incoerente aqui** |
| Média | Neutro azul-claro; PE verde-amarelo ou verde | Item de identificação de condutores |
| Média | 1,5 mm² com disjuntor de 20 A está errado (capacidade de cerca de 17,5 A, método B1) | Tabela de capacidade de condução |
| Média | Lista de locais com DR ≤ 30 mA obrigatório | Item da proteção adicional |
| Média | Curvas B 3–5, C 5–10, D 10–20 × In | Isso vem da norma de disjuntores (NBR NM 60898), não da 5410 |
| Baixa | "Verde liga, vermelho desliga" (nível leve) | Costume comum no Brasil, mas a IEC 60204-1 recomenda outras cores para LIGA/DESLIGA e reserva o vermelho à emergência. Decidir com a professora o que ensinar |

## 4. Limites do motor (vão para as Etapas 3 e 4)

- Toda carga é um resistor de 1 Ω. Brilho e "girando" são proporcionais, sem ampère real (220 V em 1 Ω seriam 220 A).
- O DR desarma com qualquer fuga, sem limiar de 15–30 mA.
- O relé térmico desarma por ação do aluno, não por I²t.
- O DPS não tem efeito elétrico.
- Não há cabo, seção, queda de tensão, curva de disjuntor nem trifásico.

O jogo deve deixar claro, na tela, que a bancada é um **modelo lógico**: mostra se o circuito liga,
comanda e protege; não mostra valores reais de corrente.
