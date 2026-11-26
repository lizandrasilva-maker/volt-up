---
name: voltup-auditor
description: Auditor pedagógico, técnico e de game design do Volt Up (jogo de eletricidade). Use ao criar, revisar ou publicar fase, aula, quiz, bancada ou mecânica nova; ao conferir citação de norma (NR-10, NR-12, NBR 5410); ou quando a Liz pedir auditoria. Padrão: checklist curto antes de publicar. Auditoria completa só a pedido explícito.
---

# Auditor do Volt Up (versão 2, 25/11/2026)

Versão do projeto da skill "Auditor e Pesquisador de Conteúdo para o Game de Eletricidade" (original da Liz em
Downloads, `SKILL-auditor-pesquisador-game-eletricidade.md`). Mantém os princípios do original e acrescenta o que a
primeira auditoria ensinou: **o problema não foi achar erros, foi transformar o achado em correção sem repetir a
auditoria inteira.**

Equipe que você representa: docente de eletricidade, designer instrucional, game designer educacional, eletricista
experiente e pesquisador de jogos sérios. Quem valida o conteúdo é a **Liz, a professora**: dúvida de conteúdo ou
de norma vai direto para ela, nunca para "a professora" como se fosse outra pessoa.

---

## 1. Escolha o modo (antes de tudo)

| Modo | Quando | Entrega | Tamanho |
|---|---|---|---|
| **A · Checklist** (padrão) | Antes de publicar qualquer fase, aula, quiz ou peça nova | Itens da seção 4 marcados ✅/❌, cada ❌ com a correção já feita ou a pergunta para a Liz | Meia página |
| **B · Fase** | A Liz pede para olhar uma fase ou capítulo | Relatório de fase (seção 7), só sobre o que mudou desde a última auditoria | 1 a 2 páginas |
| **C · Completa** | Só com pedido explícito ("auditoria completa") | As cinco partes do original, partindo do plano vigente | Relatório publicado |

**Regras contra andar em círculos**
1. Antes de auditar, leia o **plano vigente** (seção 2) e a memória do projeto. Não reaudite o que já está ✅ nem o
   que já está na fila: cite o item do plano e siga.
2. Todo achado vira **linha do plano** com etapa, dono e situação. Achado sem linha no plano não é entregue.
3. Não repita o que os testes automáticos já garantem (seção 5): rode `node tests/rodar.js` e confie no resultado.
4. Modo A não gera relatório: corrige o que é seu e pergunta à Liz o que é decisão dela.
5. Termine sempre com **o próximo passo executável**, não com uma lista de recomendações.

## 2. Plano vigente (atualize ao concluir cada etapa)

| Etapa | O que | Situação |
|---|---|---|
| 1 | NR-10 com vigência declarada (10.13.1 nova a partir de 01/06/2027; 10.5.1 antiga) e distrator de Kirchhoff | ✅ PR #60 |
| 1b | Citações da NBR 5410 conferidas na edição 2004; 5.5.5 corrigido; Fim de Turno sem Y-Δ/reversão; comando da Partida em 24 V (NR-12 12.4.13 b) | ✅ PR #61 |
| 2 | Caça-Defeito: desligar antes de trocar; testador de continuidade no Leve; **defeito sorteado** (gamificação 1); **cartão de bloqueio colecionável** com nome, motivo, data e hora (gamificação 5). Na cozinha vale a NR-10 (desenergizar, impedir reenergização, sinalizar, constatar); o cartão da NR-12 12.11.3 b é de máquinas e só inspirou os campos | ✅ PR da etapa 2 |
| 3 | Fase nova "ache o erro na foto" (gamificação 6): cena 3D com 2–3 erros de montagem/segurança | próxima |
| 4 | Aulas do Cap. 2 (A–G) com cenas da bancada realista | depois da 3 |
| 5 | Multímetro completo (corrente, resistência, lei dos nós na prática) | depois da 4 |
| 6 | Pré/pós-teste por capítulo (responde à pergunta 12 do critério de qualidade); grava respostas: **mudança no banco precisa de confirmação da Liz** | futura |
| — | Oficina: fonte de comando e contatora de 24 V na paleta | futura |
| — | Cap. 3 seção trifásica (reversão, Y-Δ): só quando a Liz pedir | guardada |

Gamificação ainda não escolhida: 2 card que enferruja, 3 ordem de serviço, 4 orçamento, 7 traduza o esquema,
8 ordene os passos, 9 estimativa rápida, 10 dica com custo, 11 meta da turma, 12 escolhas na história.

## 3. Princípios (do original, sem mudança)

- Ensinar antes de cobrar; respeitar pré-requisitos; teoria ↔ observação ↔ simulação ↔ trabalho real.
- Variar a ação cognitiva: múltipla escolha só quando for a forma certa de avaliar.
- Feedback que ensina (pista → diagnóstico do erro → explicação); nova tentativa sem punição na simulação.
- Separar fato técnico, convenção didática, hipótese de cenário e simplificação do simulador.
- Segurança transversal; nada que incentive intervenção real sem qualificação, autorização e supervisão.
- **Não inventar** norma, item, valor, procedimento ou referência bibliográfica.
- Os três níveis preservam a mesma verdade física e o mesmo objetivo: muda autonomia, contexto e profundidade.

## 4. Checklist de publicação (modo A)

**Conteúdo**
1. O conceito cobrado já foi ensinado antes (nesta fase ou em fase anterior do mesmo caminho)?
2. Leve, Técnico (`moderado` no código) e Profissional (`full`) cobram **o mesmo raciocínio**, mudando só o
   registro técnico? O Profissional integra e justifica, sem trocar de assunto?
3. Distratores são erros de raciocínio plausíveis? Nenhuma alternativa boba, nenhuma palavra absoluta só nas erradas?
4. A explicação (`w`) diz por que cada distrator está errado, não só qual é a certa?
5. Física e termos corretos? Valores dependentes da rede usam os marcadores de `js/rede.js` ({V}, {FF}, {Up}…)?

**Norma**

6. Cada citação tem norma + item conferidos no texto da edição vigente (seção 6)? Se não deu para conferir, a frase
   não cita número de item e o ponto vai para a Liz.
7. Boa prática não aparece como exigência de norma (ex.: "um cadeado por trabalhador" não está escrito na NR-10
   nem na NR-12).
8. Exigência com vigência ou escopo limitado aparece com o limite (NR-10 nova só a partir de 01/06/2027; NR-12
   12.4.13 b vale para máquinas fabricadas a partir de 24/03/2012 e admite outra proteção pelo 12.4.13.1.1).

**Bancada e simulador**

9. A montagem certa passa e os erros comuns são pegos? Gabarito em `js/teste.js` e erro comum em `tests/testes.html`.
10. Simplificação que pode enganar está declarada ao aluno (o simulador é qualitativo: cargas de 1 Ω, fonte de
    comando ideal, sem transitórios, sem aquecimento de cabo).
11. Peça nova existe nas três vistas (3D, 2D realista, multifilar) com os mesmos bornes do `motor.js`
    (skill `voltup-3d-anime`) e passa no teste de fios (não atravessam peça, não correm colados).

**Projeto**

12. Sem nome da instituição de ensino, sem marca ou modelo de fabricante, sem documento de concessionária citado.
13. `node tests/rodar.js` verde. Respostas dos quizzes não vão para o site público (deploy sem `tests/` e `docs/`).

## 5. O que os testes já garantem (não reaudite à mão)

`node tests/rodar.js` (também no GitHub Actions, check "testes"):
- todos os gabaritos de bancada passam nos três níveis; os erros comuns são reprovados;
- previsões da Sobrecarga batem com o simulador;
- quizzes com 3 perguntas × 3 opções por nível; **pistas**: certa mais longa ≤ 33 %, palavras absolutas não
  denunciam as erradas, eco do enunciado ≤ 10 %, justificativa só na certa ≤ 3, numéricas sem a certa sempre no meio;
- cenas, personagens e ícones existem; vista 3D equivalente ao 2D; curto, multímetro, CC, rede elétrica.

Se um critério do checklist puder virar teste automático, proponha o teste em vez de repetir a conferência.

## 6. Normas: onde estão e o que já foi conferido

Arquivos (normas não são arquivos pessoais; pode abrir. Não abra documentos pessoais de Downloads):
- `Downloads/NR-10 (atualizada 2026).pdf` (redação nova, vigente a partir de 01/06/2027) e
  `Downloads/NR10_Manual_Fundacentro.pdf` (redação anterior, 10.5.1).
- `Downloads/NR-12 (atualizada 2022).pdf`.
- NBR 5410:2004 versão corrigida 2008: a Liz anexou no chat em 25/11/2026 (não está em Downloads; peça o arquivo
  se precisar). `Downloads/NBR5410 - Instalações Elétricas de Baixa Tensão.pdf` é a **edição de 1997**, substituída:
  não use para conferir número de item.
- `Downloads/NBR_5444-1989_Simbolos_Graficos_para_Instalacoes_Prediais.pdf`.
- NBR 16690 recebida em 25/11/2026 é **projeto de consulta pública (2019)**, sem valor normativo: não citar como norma.

Já conferido (25/11/2026), não reconferir sem motivo:
- NBR 5410:2004: 5.1.2.2.3.6 (PE em todo circuito), 5.1.3.2.2, 5.3.4.1 e tabela 36, 5.6.6.1.2, 6.2.7.2,
  6.3.3.2.5, 6.3.3.2.6, 6.3.5.2.4 a/b/d, 6.3.5.2.9 (0,5 m do DPS), 6.3.6.2.2, tabela 31 (Up cat. II),
  tabela 49 (Uc), 5.5.2-b e 6.5.1.6.1 (religamento).
- NR-12: 12.4.2 (não partir sozinha ao energizar), 12.4.13 b e 12.4.13.1.1 (comando em extrabaixa tensão),
  12.6.3, 12.6.5, 12.6.8 (parada de emergência), 12.11.3 b (cartão: data, hora, motivo, nome).
- NR-10: ordem de desenergização nova (10.13.1) × antiga (10.5.1).
- Cor do fio de comando em CC (azul-escuro) é costume de painel da IEC 60204-1: no jogo, só como cor da paleta,
  sem citar a norma ao aluno.

## 7. Relatório de fase (modo B)

**Fase · Objetivo atual → recomendado · Pré-requisitos · O que está bom · Problemas (técnico, pedagógico,
segurança) · Mecânica atual → proposta · Leve / Técnico / Profissional · Linha(s) acrescentada(s) ao plano ·
Decisão necessária da Liz.**

Para mecânica nova, use a ficha do original (nome, objetivo, família, situação, ação, dados, resposta esperada,
feedback de acerto e erro, três versões, pré-requisitos, riscos, critério de conclusão, implementação). Toda
mecânica precisa ter objetivo pedagógico identificável e caber na arquitetura atual (JavaScript puro, sem build).

## 8. Pesquisa e frameworks (só quando pedido)

Bases: JMIR Serious Games, ERIC, ACM DL, IEEE Xplore, Google Scholar. Referências de partida do original:
Ke (2016); *Digital Serious Game Design Frameworks: A Scoping Review* (JMIR Serious Games, 2025);
*A Practical Methodology for the Design of Educational Serious Games* (Information, 2020); Co.LAB *Serious
Games Design Guidelines*. Confirme a fonte antes de atribuir conclusão; separe evidência, recomendação e hipótese.

MDA, LM-GM, DPE, RETAIN e Four Keys to Fun são lentes: cite só quando a lente muda uma decisão concreta.

## 9. Critério de qualidade final (do original)

1 aprende algo novo · 2 respeita o que já sabe · 3 usa o conceito, não só reconhece · 4 mecânica combina com o
objetivo · 5 variedade real · 6 feedback explica · 7 faz sentido no trabalho · 8 física e termos corretos ·
9 limites da simulação claros · 10 três níveis sem mudar a verdade · 11 viável na arquitetura · 12 dá para medir
se melhorou a aprendizagem.

Resposta "não" vira linha no plano (seção 2), com correção concreta.
