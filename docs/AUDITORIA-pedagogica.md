# Auditoria pedagógica do Volt Up — Etapas 2 e 2b

Data: 20/11/2026.

| Etapa | Branch |
|---|---|
| Etapa 2 | `bancada-vista-real` |
| Etapa 2b | `etapa2b-base-auditavel` |

**Documentos ligados:**
- [REGISTRO-perguntas.md](REGISTRO-perguntas.md): as 72 perguntas, antes e depois, com justificativa e o erro de cada alternativa errada.
- [MATRIZ-curricular.md](MATRIZ-curricular.md): missões × plano de curso SENAI.

## O problema

As perguntas dos quizzes eram fáceis demais em todos os níveis. Muitas podiam ser acertadas sem entender eletricidade: bastava eliminar alternativas absurdas ("Liga a luz", "Some para sempre") ou escolher a alternativa mais longa. Em números, antes da Etapa 2:

- **Perguntas com pista medida:** 46 das 72.
- **Certa mais longa:** 32 das 72 (44 %).

## O critério

1. **Mesmo raciocínio nos três níveis.** Cada fase cobre os mesmos três conceitos em leve, moderado e full. Muda o registro de linguagem:
   - **leve:** situação do dia a dia, sem símbolos;
   - **moderado:** termos da obra (fase, neutro, corrente, kWh, In);
   - **full:** grandezas, contas e itens de norma.

   Esse é o nível de dificuldade pretendido, por decisão do curso.
2. **Cada distrator é um erro de raciocínio real**, registrado pergunta por pergunta no registro. Exemplos:
   - "disjuntor maior resolve";
   - "o DR mede a corrente total";
   - "esqueceu a volta do cabo".
3. **A explicação diz por que o erro tentador está errado.**
4. **Nenhuma pista de forma.** Os testes automáticos (`node tests/rodar.js`) medem e limitam cada tipo:

| Pista | Antes da Etapa 2 | Agora | Limite no teste |
|---|---:|---:|---|
| Certa é a mais longa | 32 de 72 | 13 de 72 (18 %) | ≤ 33 % (acaso) |
| Palavra absoluta só nas erradas ("qualquer", "nunca", "só"…) | 17 (medido na versão da Etapa 2) | 1 | ≤ 4 ou ≤ certa + 3 |
| Só a certa repete palavra do enunciado | 3 | 1 | ≤ 10 % |
| Só a certa traz justificativa (dois-pontos, "porque") | 4 | 1 | ≤ 3 |
| Numéricas: certa é o valor do meio | — | 4 de 13 (31 %) | ≤ 50 % |

As pistas de eco do enunciado e de valor do meio foram **criadas por mim na Etapa 2** e só apareceram quando passei a medir. Na Etapa 2b foram corrigidas 12 perguntas por eco e 2 por valor do meio. Cada correção está registrada com motivo.

Valores do meio que restaram (4) são próprios do raciocínio. Exemplo: Ib ≤ In ≤ Iz pede o disjuntor entre dois limites, então a resposta certa fica naturalmente no meio.

## Afirmações técnicas que estavam sem conferência

As cinco afirmações da revisão anterior foram conferidas na NBR 5410:2004 e nos demais documentos:

| # | Afirmação | Resultado | O que mudou |
|---|---|---|---|
| 1 | DPS da entrada com SPDA é "classe I, ensaiado com onda 10/350 µs" | **Incorreta como escrita.** A NBR 5410 (6.3.5.2.4-d, nota) diz que não há forma de onda fixada para o ensaio de Iimp. | A pergunta (O Quadro · full · 3) agora pede o critério da norma: Iimp, mínimo de 12,5 kA por modo de proteção. "Classe I" fica como nome comercial. |
| 2 | Ligação do DPS de até 0,5 m | **Confirmada:** NBR 5410, 6.3.5.2.9 ("de preferência", "sem curvas ou laços"). | Explicação cita o item. |
| 3 | Uc ≥ 1,1 × U0 em esquema TN | **Confirmada para TN-S** (fase-PE), tabela 49. Em TN-C a ligação é fase-PEN. | Enunciado passou a dizer TN-S. |
| 4 | Magnético do disjuntor-motor entre 12 e 14 × o ajuste | **Sem documento.** A NBR NM 60898 exclui disjuntores de proteção de motor. | Número retirado; a explicação remete ao catálogo do fabricante. |
| 5 | Geladeira consome de 30 a 50 kWh por mês | **Sem documento.** | O consumo agora vem no enunciado (35 kWh, como numa etiqueta); a resposta sai da conta. |

Durante a conferência apareceram mais duas frases sem base. As duas foram corrigidas:

- **"DR com corrente nominal em geral igual ou maior que a do disjuntor":** substituída pelo requisito real da NBR 5410 (6.3.6.2.2-a).
- **"Partida de 6 a 8 × In" (Primeiro Turno, moderado):** retirada.

## Itens de norma citados nas explicações, todos conferidos no texto

- **NBR 5410:** 5.1.3.2.2, 5.3.4.1, 5.5.5, 5.6.6.1.2, 6.2.7.2, 6.3.3.2.5, 6.3.3.2.6 e nota, 6.3.5.2.4 (a, b, d), 6.3.5.2.9, 6.3.6.2.2, tabelas 36 e 49.
- **NR-10:** 10.13.1.
- **NR-12:** 12.6.3 a 12.6.8.
- **NBR NM 60898:** tabelas 2 e 6.

## Para a professora conferir

- As contas do nível full: rendimento, perda no cabo, constante do medidor, custo do banho e L·di/dt. Na conta de L·di/dt, o valor de 1 µH por metro é dado no enunciado como referência; não é valor de norma.
- O nível leve: as situações fazem sentido para o público do curso?
- A matriz curricular, em especial o grau atribuído a cada missão.
- A decisão sobre as **regressões**: conteúdos do plano que deixaram de ser cobrados na Etapa 2 (ver a seção 3 da matriz).
