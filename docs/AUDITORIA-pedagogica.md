# Auditoria pedagógica do Volt Up — Etapa 2

Data: 20/11/2026 · Branch `bancada-vista-real`

## O problema

As perguntas dos quizzes eram fáceis demais em todos os níveis. A maioria podia ser acertada só
eliminando alternativas absurdas ("Liga a luz", "Some para sempre", "Deixar a luz mais forte"), sem
entender eletricidade. Além disso, a alternativa certa era a mais longa em 44 % das perguntas.

## O critério novo

1. **Mesmo raciocínio nos três níveis.** Cada fase cobre os mesmos três conceitos em leve,
   moderado e full. O que muda é a linguagem:
   - **leve:** situação do dia a dia, palavras comuns, sem símbolos;
   - **moderado:** termos da obra (fase, neutro, corrente, kWh, In);
   - **full:** grandezas, contas e itens de norma.
2. **Distrator é um erro real de aluno**, não uma piada. Exemplos: "disjuntor maior resolve",
   "o DR mede 30 A", "esqueceu a volta do cabo", "esqueceu de passar minutos para horas".
3. **A explicação diz por que o erro tentador está errado**, e não só qual é a resposta.
4. **A alternativa certa não pode ser reconhecível por pista de forma.**
   - Tamanho: agora ela é a mais longa em 18 % das perguntas, abaixo do acaso (33 %).
   - Palavras absolutas ("qualquer", "nunca", "só"…): antes apareciam só nas erradas em 17
     perguntas; agora em 1.
   - Os testes automáticos (`node tests/rodar.js`) barram as duas pistas se voltarem.

## Conceitos por fase

| Fase | Conceito 1 | Conceito 2 | Conceito 3 |
|---|---|---|---|
| Faísca | Água e umidade conduzem | Energia vira calor (perdas, rendimento) | Fio fino esquenta mais (R e seção) |
| Do Poste à Tomada | Transformador e níveis de tensão | Energia × potência (kWh) | Fase, neutro e terra |
| Mão Segura | Disjuntor protege o fio | Desligamento seguro (interruptor, NR-10) | DR e choque |
| Mestre Ohm | Série divide a tensão | Consumo e custo | Corrente do aparelho e queda de tensão |
| O Quadro | Quem atua em cada falha | N e PE separados depois do DR | DPS em paralelo, ligado ao PE |
| Raio na Serra | Disjuntor não segura surto | Ligação curta do DPS | Fim de vida e Uc do DPS |
| Primeiro Turno | Bloqueio e etiquetagem | Selo e religamento | Relé térmico e partida |
| Fim de Turno | Reversão por troca de fases | Intertravamento | Estrela-triângulo |

A fase de previsão **Sobrecarga!** manteve as cenas e ganhou distratores plausíveis.

## Ligação com o plano de curso

Referência: Itinerário Nacional SENAI, **Técnico em Eletrotécnica**, versão 2026.1.

Siglas usadas na tabela:
- **MB:** Módulo Básico.
- **MI:** Módulo Introdutório.
- **ME I, ME II, ME III:** Módulos Específicos I, II e III.
- **UC:** Unidade Curricular. O número depois do ponto é o item de conhecimento da UC; "cap." é a capacidade.

| Fase | UC principal | Conhecimentos e capacidades que a fase exercita |
|---|---|---|
| Faísca | MI · UC 1 Fundamentos de Eletricidade | 3.7.1 efeito Joule; 3.8 condutores e isolantes; 3.10 resistência e resistividade |
| Do Poste à Tomada | MI · UC 2 Fundamentos de Sistemas Elétricos | 5.8 valor eficaz e de pico; ME I UC 1: 2.4 regras da concessionária e 10.2.1 TN-C-S |
| Primeiro Circuito | ME I · UC 1 Instalação Predial | 7.1.1 interruptores; 6 iluminação; 9 diagramas |
| Previsão | MI · UC 1 | 6.1 associação série, paralelo e mista; 6.2.4 lei de Ohm |
| Série ou Paralelo | MI · UC 1 e ME I · UC 1 | 6.1 associação; 7.1.1 interruptores |
| Caça-Defeito | ME I · UC 1 | cap. 3 testes de funcionamento; cap. 4 causas e falhas; cap. 12 instrumentos de medição |
| Guardião Verde | MB · UC 6 Sustentabilidade | 1.1.2 e 1.1.3 recursos renováveis e não renováveis |
| Mão Segura | ME I · UC 1 e MB · UC 3 SST | 8 dispositivos de proteção; 15.9 capacidade de condução; cap. 7 e 8 riscos e critérios de segurança |
| Mestre Ohm | MI · UC 1 e ME I · UC 2 Projetos Prediais | 3.2 e 3.3 potência e energia; 6.2.4 Ohm; 9.1.1 queda de tensão |
| O Quadro | ME I · UC 1 | 8.1.2 a 8.1.4 disjuntor, DR e DPS; 5.1.2 quadro de distribuição |
| Quadro Novo | ME I · UC 1 | cap. 28 aterramento; cap. 33 técnicas de instalação; 10.2.1 TN-C-S |
| Luz da Escada e Corredor | ME I · UC 1 e MI · UC 3 Desenho Técnico | 7.1.1 interruptores; 9.3 unifilar e multifilar; 5.1 símbolos gráficos (planta pela NBR 5444) |
| Luz da Garagem | ME I · UC 1 | 7.1.3 sensores |
| Hall com Pulsadores | ME I · UC 1 | 7.1.6 relés |
| Raio na Serra | ME I · UC 1 | 8.1.4 DPS; 10 aterramento; 19 SPDA |
| Primeiro Turno | ME II · UC 3 Manutenção Industrial | 1.5.1 desenergização; 1.5.4 bloqueio e sinalização; ME II UC 4: 4.3 NR-12 |
| Partida Direta | ME II · UC 2 Acionamentos Industriais | 3.1.5 partida direta; 3.3.4 relé térmico; 3.3.6 contatores |
| Sobrecarga! | ME II · UC 2 e UC 3 | 3.3.4 relé térmico; UC 3 cap. 5 diagnóstico de falhas |
| Caixa d'Água | ME II · UC 2 | 3.3 dispositivos de manobra; cap. 15 componentes e suas posições |
| Fim de Turno | ME II · UC 2 e UC 1 Projetos Industriais | 3.1.2 estrela-triângulo; 3.1.4 reversão; UC 1: 9.4.1 métodos de partida |

**Lacunas.** Conteúdos do plano que o jogo ainda não cobre, em ordem de prioridade para as próximas etapas:

1. **Dimensionamento:** quadro de cargas, capacidade de condução (Iz), fator de demanda e seletividade (ME I UC 2, item 9). Vai para as Etapas 3 e 4.
2. **Corrente alternada de verdade:** fasores, reatância, fator de potência e números complexos (MI UC 2, item 5). Etapa 5.
3. **Instrumentos:** multímetro, alicate amperímetro, megômetro e terrômetro (MI UC 1 item 2; ME II UC 3 item 7). É o laboratório virtual sugerido na revisão externa.
4. **Outros esquemas de aterramento** (TT, IT, TN-C), motor monofásico e fusíveis Diazed e NH (ME I UC 1, itens 10 e 11; ME II UC 2, item 3.3.8).
5. **Partidas eletrônicas** (soft-starter, inversor) e **CLP** (ME II UC 2, item 3.2; ME II UC 4).
6. **Solar** (ME III UC 4): o capítulo 4 já está previsto no mapa.

**Validação:** a validação prática é a turma montar os circuitos no celular. Não há fotos da bancada física.

## Para a professora conferir

- As contas do nível full: rendimento, perda no cabo, constante do medidor, custo do banho e L·di/dt.
- O nível leve: as situações fazem sentido para o público do curso?
- Itens de norma citados nas explicações:
  - NBR 5410: 5.1.3.2.2, 5.5.5, 5.6.6.1.2, 6.2.7 e tabela 36;
  - NR-10: 10.13.1;
  - NR-12: 12.6.3 a 12.6.8;
  - NBR NM 60898: 1,45 In.
- **Afirmações que eu não conferi nos documentos.** Estão certas pelo meu conhecimento, mas precisam de confirmação:
  1. **O Quadro, full 3:** com SPDA, a entrada leva DPS classe I, ensaiado com onda 10/350 µs.
  2. **Raio na Serra, moderado 2:** regra usual de até 0,5 m na ligação do DPS.
  3. **Raio na Serra, full 3:** em esquema TN, Uc ≥ 1,1 × U0.
  4. **Primeiro Turno, full 3:** o disparo magnético do disjuntor-motor fica entre 12 e 14 vezes o ajuste.
  5. **Mestre Ohm, leve 2:** a geladeira consome de 30 a 50 kWh por mês.
