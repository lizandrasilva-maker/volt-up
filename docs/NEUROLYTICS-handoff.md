# Neurolytics · Modo Eletricista — Documento de passagem

Atualizado em 02/11/2026. Para continuar o desenvolvimento em outra conta ou conversa do Claude.

## Como retomar
1. O código mora no GitHub: `github.com/lizandrasilva-maker/volt-up`. As duas contas do Claude trabalham no mesmo repositório (em projetos do Claude Code com esse repositório configurado).
2. Peça: *"Leia docs/NEUROLYTICS-handoff.md e vamos continuar o game."*
3. Cada mudança entra por um pull request. Depois do merge na `main`, o GitHub Pages atualiza o jogo no link fixo (o progresso dos jogadores fica salvo no navegador por causa do link fixo).
4. **Modo teste** (para revisar sem jogar tudo): abra o jogo com `?teste=1` no fim do endereço (ex.: `.../volt-up/?teste=1`) ou entre com conta admin/professor, e toque em "🧪 Entrar no modo teste" no mapa.
   - Libera todas as fases, mostra a cena da história toda vez, tem a tela **📜 Roteiro** (capítulo inteiro em texto, com "Ver cena" e "Jogar") e os atalhos "⏭ Concluir fase" e "🔧 Montar pra mim" (bancadas de montar).
   - Usa um perfil separado (`neuro-eletricista-teste` no navegador) e não envia nada para a nuvem. "Sair" volta ao progresso real intacto; "Zerar teste" recomeça o perfil de teste. `?teste=0` esconde o botão.
   - Ao criar uma fase de montar nova, acrescente o gabarito em `TESTE_SOL` (`js/teste.js`).
5. Para testar localmente: `python3 -m http.server` na pasta do repositório e abrir `http://localhost:8000`. Abrir o `index.html` direto do disco também funciona.

## O que é o projeto
Game educativo de elétrica, energia e renováveis no modo história do eletricista, para o SENAI. Tem 3 níveis de público:
- **Leve:** crianças ou adultos atípicos. Frases curtas, letra maior, pode tentar de novo, áudio 🔊.
- **Técnico:** jargão moderado e cálculos simples.
- **Profissional:** normas, cálculos e diagnóstico de campo.

Instruções do projeto:
- Tom jovial e totalmente gamificado, sem textos longos.
- Sempre ser honesto sobre as limitações e sempre sugerir melhorias.
- Modo Libras planejado para o futuro.

## Regras de conteúdo (decididas com a professora, obrigatórias)
- **NBR 5410 respeitada em todos os níveis, inclusive no Leve.**
- **A bancada é corrente alternada:** rede 220 V~ 60 Hz, com terminais F, N e PE.
  - Positivo e negativo só aparecem em conteúdo de CC real (pilha, carregador, string fotovoltaica).
  - Nunca misturar fase e neutro com pilha.
- **A cadeia de energia aparece em toda bancada:** transformador do poste (13,8 kV → 380/220 V), medidor em kWh, quadro com disjuntor e o circuito.
- **Checagens automáticas da bancada** (`normCheck` + `colorCheck`):
  - O interruptor secciona a fase. Se cortar o neutro, a lâmpada desligada continua com 220 V.
  - A lâmpada é um **bocal simples com 2 bornes (X1/X2), sem PE**, como no equipamento real (decisão da Liz em 20/11/2026, substituindo "toda luminária tem PE"). O PE continua na tomada de bancada e volta a ser cobrado quando entrar luminária metálica ou tomada (`pe:true` no componente). O PE nunca conduz corrente de serviço. PE e neutro não se unem no circuito.
  - O disjuntor fica em série na fase, antes de tudo.
  - Cores: neutro azul-claro, PE verde-amarelo, fase e retorno em qualquer outra cor. No jogo a fase é vermelha e o retorno é branco (convenção, não exigência da NBR).
  - Curto fase-neutro e curto fase-terra são detectados.
- **A história precisa ser coerente com a atividade.** O aluno atípico precisa ver a ligação entre o problema da cena e o circuito da tela.
  - Cada missão mostra etiquetas "peça = objeto real" (ex.: L1 💡 lâmpada da cozinha).
  - Não apresentar um problema de "casa toda apagada" quando a atividade é uma lâmpada só.
- **Público jovem:**
  - Nada de expressões de duplo sentido (ex.: "pegar no fio" foi removido).
  - Nada de aposta.
  - Roupas adequadas (a Dona Fátima foi refeita com gola fechada).
- **Direitos autorais:** não usar personagens de terceiros (o Pikachu foi recusado). O mascote é original: o Calango Faísca.

## Elenco (artes geradas no Canva, estilo anime; arquivos em `img/`)
| Personagem | Papel | Arte |
|---|---|---|
| Mestre Chico | Eletricista veterano, mentor | Meio corpo, braços cruzados, multímetro no cinto |
| Dona Fátima | Primeira cliente (vizinha) | Meio corpo, gola fechada, bolsa de palha |
| Ana | Avatar do jogador | Capacete amarelo, luvas isolantes, multímetro |
| Léo | Avatar do jogador | Capacete branco, óculos, alicate isolado |
| Calango Faísca | Mascote, avatar do jogador | Calango do sertão com uniforme e EPI completos |
| Raio, Bia, Orbi, Gato Volt, Téc. Lu | Avatares antigos | Desenhados em SVG no código |

Os originais em alta estão no Canva da conta atual, no design **"Neurolytics – artes anime"**. As páginas 3 (vazia) e 8 (antes a capivara) podem ser apagadas. Os recortes sem fundo foram feitos em código, porque o removedor de fundo do Canva é pago.

## Estrutura do Capítulo 1 · A Casa Acesa
| # | Fase | Tipo | Cena (onde acontece) |
|---|---|---|---|
| 1 | Faísca | Quiz | Oficina, perguntas do Mestre Chico |
| 2 | Do Poste à Tomada | Quiz | Janela da oficina: transformador e medidor |
| 3 | Primeiro Circuito | Bancada: montar | Bancada de treino |
| 4 | Previsão | Bancada: prever | Desafio na bancada de treino |
| 5 | Série ou Paralelo | Bancada: montar | Sala da Dona Fátima (2 lâmpadas) |
| 6 | Caça-Defeito | Bancada: diagnóstico | Cozinha da Dona Fátima (1 lâmpada) |
| 7 | Guardião Verde | Classificar | Placa solar da vizinha |
| 8 | Mão Segura | Quiz | Segurança antes do serviço |
| 9 | Mestre Ohm | Quiz | Conta de luz alta |

O fim do capítulo é um gancho: "a casa inteira apagou". Ele leva ao **Cap. 2 · O Quadro da Dona Fátima** (disjuntor geral, DR).

Capítulos previstos, ainda "em construção":
- Cap. 2: Quadro e DR.
- Cap. 3: Sol no Telhado, com bancada própria de CC (+/−, cabo solar, string box, inversor).
- Cap. 4: Ventos do Litoral.

## Sistemas do jogo
- **Progressão:** XP, plano de carreira (Aprendiz → Ajudante → Eletricista → Eletricista Sênior → Responsável Técnico) e cards por fase e nível (álbum).
- **Ficha do eletricista:** atributos (Conceito, Montagem, Diagnóstico, Segurança, Cálculo) e perfil.
- **Rotina:** Plantão de hoje (3 missões, +30 XP), 🔥 dias seguidos e 12 conquistas.
- **Pausa:** "Pausa para respirar" (antes "Respira e religa"), 3 respirações guiadas, dentro de "☰ Mais opções" no mapa.
- **Telas (menos informação, para o aluno ficar tranquilo):**
  - Mapa: só as fases, "Rever a abertura" e a Oficina; Plantão, Ficha, Pausa, trocar nível/personagem e Recomeçar ficam em "☰ Mais opções". Sem balão do personagem (só aparece com o capítulo completo). Fase bloqueada mostra só o nome e 🔒.
  - Bancadas: Missão em uma frase → cores → bancada (faixa poste→medidor→quadro colada em cima; botões "Diagrama/Real" e zoom − + ⤢ no rodapé da própria bancada) → resultado → botões. Sem balão do personagem.
  - As etiquetas "peça = objeto real" e os chips de brilho das lâmpadas só aparecem no Diagrama (na vista real a peça já é o objeto e a lâmpada mostra se acendeu); a Previsão mantém o brilho, que é a resposta. O curto sempre aparece.
  - A ajuda é uma linha só e some depois do primeiro fio. O aviso "só eletricista mexe na rede" aparece na vitória do nível Leve.
- **Oficina livre:** sandbox com rede, luminárias, interruptores e disjuntores, multímetro V~ e botão Inspecionar.
- **Cenas em estilo visual novel:** personagem de meio corpo de um lado e a fala do outro. O texto aparece letra por letra (instantâneo com movimento reduzido).
- **Decisões de design** (estudo de referência de apps de hábito gamificados):
  - Sem ranking público.
  - Sem culpa ao perder a sequência de dias.
- **Progresso salvo no navegador** (localStorage, chave `neuro-eletricista-v2`). Trocar de URL zera o progresso dos jogadores.

## Estrutura de pastas
| Caminho | Conteúdo |
|---|---|
| `index.html` | Página do jogo: só o esqueleto e a lista de scripts, na ordem certa. |
| `css/estilo.css` | Todo o visual (paleta de cores de fio, bancada, cenas, ficha). |
| `js/estado.js` | Estado do jogador `S`, `save()` (localStorage), utilitários, `CHARS`. |
| `js/motor.js` | Motor elétrico e desenho da bancada. |
| `js/bancada-real.js` | Vista real da bancada (peças como o equipamento, bornes com nome, fios em ângulo reto com anilha), chave Símbolo/Real e zoom. |
| `js/conteudo.js` | Cenários de previsão e checagens NBR 5410 (`normCheck`, `colorCheck`). |
| `js/imagens.js` | Mapa `IMG` → arquivos em `img/`. |
| `js/historia.js` | `NPC`, `CHAPTERS`, `PHASES`, `SCENES`, `showScene()`. |
| `js/telas.js` | HUD, início, escolha de personagem, mapa, cards. |
| `js/fases.js` | Quiz, classificar, bancadas (montar, prever, caça-defeito), oficina livre. |
| `js/carreira.js` | Carreira, atributos, plantão, conquistas, fim de fase. |
| `js/teste.js` | Modo teste: perfil separado, tudo liberado, Roteiro, gabaritos das bancadas (`TESTE_SOL`). |
| `js/main.js` | Liga o jogo (sempre o último script). |
| `img/*.webp` | Artes dos personagens e da oficina. Para trocar, substitua o arquivo mantendo o nome; para uma arte nova, coloque em `img/` e acrescente o nome em `js/imagens.js`. |

Os scripts são clássicos (sem `import`), então tudo é global e a ordem no `index.html` importa: um arquivo só pode usar, no carregamento, o que veio antes.

## Mapa do código
- `/* MOTOR ELÉTRICO */`: `C()` cria componentes (`src`, `lamp`, `sw`, `fuse`=disjuntor) e `W()` cria fios.
  - `terms()`: terminais (`.0`/`.1` e `.2` = PE).
  - `solve()`: análise nodal (lâmpadas resistivas, valores eficazes).
  - `sim()`: simula posições de interruptor ou defeitos.
- Desenho da bancada: `board()`, `compSVG()`, `entrada()` (faixa poste → medidor → quadro) e `realHTML()` (etiquetas da vida real).
  - `board(st,{real:true})` desenha a vista real (`realBoard()` em `js/bancada-real.js`). Na vista real os bornes ficam onde o equipamento tem (`REAL_TERMS`, ligado por `GEOM_REAL` em `terms()`), mas o motor só usa o número do borne: o cálculo e as checagens são os mesmos nas duas vistas.
  - Peças: rede como **tomada 2P+T** genérica (placa, rebaixo do padrão brasileiro, 3 furos com ⏚ no do meio) e 3 bornes lado a lado embaixo, **sem letra impressa e sem fio pré-ligado** (para não dar o gabarito). Ordem vista de frente: neutro à esquerda, terra no meio, fase à direita (recomendação usual da NBR 14136, ensinada pelo Mestre Chico na cena do Primeiro Circuito; vale confirmar com a professora). Se o aluno trocar fase e neutro, o `normCheck` acusa "interruptor no neutro". disjuntor DIN (1 em cima, 2 embaixo, alavanca ON/OFF), interruptor em módulo (L e R na régua de baixo; a tecla anima quando o aluno toca, via `flipSwitch()`), lâmpada no bocal de porcelana (X1 e X2 embaixo). Parafusos com fenda em cruz, anilhas laranja numeradas. No Caça-Defeito o teste de peça aparece como selo ✓/✗ no canto da peça.
  - Na vista real a altura das peças fica entre 46 e 184 (`REAL_Y`), para os fios terem canaleta. Os fios desviam de peças, de parafusos e dos fios já desenhados.
  - A vista escolhida fica em `S.vista[nível]`. Padrão: vista real em todos os níveis e em todas as bancadas; o botão "Diagrama" mostra o esquema.
  - `benchZoom()`: pinça, arrastar com um dedo no fundo quando ampliado, Ctrl+roda e botões − + ⤢. Durante a pinça (`zm.busy()`) os toques não ligam fio nem mexem peça.
- `/* CONTEÚDO */`:
  - Cenários de previsão `sc*()`, com `withPE()` e `autoColor()`.
  - Checagens: `tableCheck()`, `normCheck()`, `colorCheck()`.
- `/* HISTÓRIA */`: `IMG` (imagens base64), `NPC`, `CHAPTERS` (intro e fim), `SCENES` (cena antes de cada fase) e `showScene()`.
- `PHASES`: cada fase tem `id`, `tipo` (`quiz` | `sort` | `build` | `predict` | `diag`), `card` por nível e `dados` por nível.
  - Missões `build`: `comps`, `goal`, `real` (etiquetas), `check`.
- Telas: `showStart`, `showChar`, `showMap`, `showAlbum`, `showFicha`, `showBreath`, `runSandbox`.

### Como adicionar um capítulo
1. Criar as fases em `PHASES`, com dados para `leve`, `moderado` e `full`.
2. Adicionar em `CHAPTERS` o `{id, nome, tema, fases:[...], intro:[...], fim:[...]}` e retirar `soon:true`.
3. Escrever uma cena em `SCENES[idDaFase]` que descreva exatamente o que o aluno vai fazer.
4. Mapear o atributo da fase em `PH_ATTR`.

## Servidor (Supabase)
- Projeto `volt-up` (id `pmhkzxkygvpeyckhnipz`, região São Paulo, plano grátis), organização "Neurolytics".
- Tabelas: `perfis` (apelido, papel aluno/professor/admin, turma, código), `turmas` (escola, nome, vagas, validade), `acessos` (acesso individual), `progresso` (o objeto `S` do jogo em JSON). Todas com RLS. Esquema em `supabase/migrations/`.
- Função `criar-alunos` (`supabase/functions/`): o Adm ou o professor da turma gera os logins dos alunos. O aluno entra com um código (ex.: `TURMA7-K8SDQP`); por baixo, o login é `<codigo>@aluno.volt-up.app` com o código como senha.
- No navegador: `js/vendor/supabase-2.45.4.js` (cópia local da biblioteca) e `js/nuvem.js` (chave publishable, que pode ficar pública). Cada `save()` do jogo também envia o progresso para a nuvem, se houver login.
- Telas: `login.html` (aluno e e-mail) e `admin.html` (painel). Os arquivos em `prototipos/` são só os desenhos iniciais.
- Para virar admin: a conta é criada em `login.html` e o papel `admin` é definido no banco (`update perfis set papel='admin' where id=...`).
- Ainda não implementado: painel do professor, pagamento (Mercado Pago), bloqueio dos capítulos pagos (só o Cap. 1 existe).

## Capítulos e bibliotecas de peças (decisão da Liz, 20/11/2026)
Cada capítulo é uma história própria e tem a sua biblioteca de peças (`BIBLIOTECAS` em `js/fases.js`; na Oficina Livre ficam na "🧰 Caixa de ferramentas").
| Cap. | História | Biblioteca | Situação |
|---|---|---|---|
| 1 | A Casa Acesa · fundamentos | ⚡ Fundamentos: lâmpada, interruptor, disjuntor | jogável |
| 2 | O Quadro da Dona Fátima · predial | 🏠 Predial: interruptor duplo, paralelo (three-way), intermediário (four-way), DR, DPS, fotocélula, relé de impulso, pulsador | peças prontas na Oficina; fases por escrever |
| 3 | Chão de Fábrica · industrial | 🏭 Industrial: motor monofásico, contatora (A1-A2, 1-2, 13-14), relé térmico (1-2, 95-96), botoeiras NA/NF | peças monofásicas prontas; fases por escrever |
| 4 | Sol no Telhado | (CC fotovoltaica) | por fazer |
| 5 | Ventos do Litoral | (eólica) | por fazer |

Lógica das peças (em `solve()`, `js/motor.js`): `links()` diz quais bornes cada contato liga por dentro; `loadsOf()` diz quais são cargas. A contatora energiza quando a bobina tem tensão e o selo (13-14) a mantém; o relé de impulso inverte a cada pulso; o DR desarma com fuga para o PE ou neutro unido ao PE depois dele; a fotocélula liga L em C à noite. Testado: partida direta com selo e relé térmico, DR com fuga, three-way + four-way, relé de impulso, fotocélula.

Próximo passo do industrial: **motor de cálculo trifásico** (contatora 3 polos + blocos auxiliares, relé térmico 3 polos 95-96/97-98, disjuntor-motor, motor de 6 pontas U1…W2) para partida direta trifásica, reversão e estrela-triângulo; e boia de nível para a caixa d'água.

## Plano "Realismo da bancada: SimuCir x Volt Up" (20/11/2026)
- [x] Etapa 1 · Bancada real básica: vista real da tomada de bancada, disjuntor, interruptor e luminária; bornes com nome; fios em ângulo reto com anilha numerada; chave Símbolo/Real; zoom com pinça. Ativa no Primeiro Circuito e na Oficina Livre. O zoom vale em todas as bancadas de montar.
- [ ] Etapa 2 · Simulação viva: Montar/Simular, potência real nas cargas, corrente em A, disjuntor desarma com faísca, borne errado pisca, multímetro e alicate na vista real.
- [ ] Etapa 3 · Quadro residencial: trilho DIN, caixa, IDR, DPS, tomada, three-way, medidor kWh contando.
- [ ] Etapa 4 · Todas as bancadas do Capítulo 1 na vista real.
- [ ] Etapa 5 · Comandos elétricos (contator, botoeira, relé térmico, motor), com lógica simplificada.
- Limite conhecido da Etapa 1: a rota do fio desvia de peças e bornes por algumas opções de L e Z, mas com muitas peças juntas o fio ainda pode cruzar uma etiqueta ou outro fio.

## Pendências e próximos passos sugeridos
- [ ] Falas por nível: Leve com frases de até 8 palavras e imagem do cômodo.
- [ ] Capítulo 2: chamado da casa toda apagada (QD, disjuntor geral, DR, barramentos N e PE).
- [ ] Capítulo 3: bancada de CC fotovoltaica e conversão no inversor.
- [ ] Expressões dos personagens (feliz, pensativo, preocupado) no meio corpo.
- [ ] Revisão técnica da RT nas perguntas (esquema TN, chuveiro/disjuntor, perguntas de CC).
- [ ] Modo Libras (vídeos gravados por intérprete).
- [ ] Futuro: perfil de professora e progresso online (precisa de hospedagem própria e cuidado com a LGPD).
- [ ] Futuro: bancada 3D (three.js/Babylon) e um piloto em WebXR.

## Documentos relacionados (na conta atual)
- Panorama de Concorrentes (doc Claude).
- `claude/estudo-referencia-gamificacao.md` (no projeto "Neurolytics (?)").
