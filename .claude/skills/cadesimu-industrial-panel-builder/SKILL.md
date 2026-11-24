---
name: cadesimu-industrial-panel-builder
description: Modela e desenha componentes eletricos industriais de comandos e paineis (disjuntores-motores, contatores, reles termicos, botoeiras, fontes, barramentos BEP e motores) com precisao mecanica realista em 2D (SVG) ou 3D (Three.js/WebGL). Use sempre que o usuario pedir para criar, corrigir ou detalhar componentes de comandos eletricos, diagramas estilo CADe_SIMU, quadros eletricos ou simuladores de montagem industrial.
---

# CADe_SIMU Industrial Panel Builder

Gera componentes eletricos industriais e paineis de comando com fidelidade mecanica, serigrafia normativa IEC 60947 e roteamento limpo de condutores (em SVG 2D ou Three.js 3D).

## 0. Regras do Volt Up (prevalecem sobre o resto desta skill)

Esta skill complementa a `voltup-3d-anime` (arquitetura, contrato de intencoes, cache, testes). No Volt Up:

- **Sem marca de fabricante.** Nada de `WEG`, `Schneider` ou codigos de modelo comerciais (`CWC07`, `RW27`, `GV2-M07`). Use serigrafia generica: categoria (`AC-3`), tensao da bobina da rede escolhida (`rede().V`), faixa de ajuste (`2,5 · 3 · 4 A`) e norma (`IEC 60947-4-1`).
- **So os bornes que o solver tem** (`terms(c)` no `motor.js`, tabela `TERM3D`). A contatora do jogo tem 1 polo de potencia: `1L1`/`2T1`, auxiliar `13NO`/`14NO` e bobina `A1`/`A2`. O rele termico: `1L1`/`2T1` e `95NC`/`96NC`. Nao desenhe 3L2, 5L3 etc. enquanto o solver trifasico nao existir.
- **Cores dos fios** continuam vindo da tabela `CORES` do jogo (mesmas do 2D). As cores desta skill valem para as **ponteiras** (terminal tubular): fase `#C92A2A`, neutro `#1C7ED6`, retorno `#E9ECEF`, terra `#FCC419`.
- **Roteamento:** o do jogo e a busca em grade (A*) com salto nos cruzamentos (ver `voltup-3d-anime`). Fio nunca passa por cima nem por tras de peca.
- **Serigrafia dos bornes** fica no degrau, do lado de fora do parafuso (o fio entra por dentro do nicho e so aparece fora da peca). A marcacao guarda `userData.plaqueta` com o nome do borne do 2D, para os testes.
- O que ja segue esta skill em `js/bancada3d.js`: `carcaca3()` (3 niveis, travas DIN, divisorias, frontal com chanfro via `RoundedBoxGeometry`), `parafuso()` (Phillips rebaixado), `serigrafia()`, `tag()`, `entrada()`/`ponteira()` (entrada vertical com terminal tubular nas pecas de trilho: `VERTICAL`) e `rotulo()` que nunca corta o texto.

## 1. Geometria Escalonada Obrigatoria (Nunca Bloco Liso)

Todo dispositivo modular DIN (contator, disjuntor-motor, rele termico, fonte) deve ser construido em **3 niveis de profundidade** distintos:

1. **Nivel 1 - Base e Trava DIN (Fundo):**
   - Cor antracite `#1F2328`.
   - Inclui abas/dentes de travamento para trilho DIN TS-35 visiveis nas extremidades superior e inferior.
2. **Nivel 2 - Degraus de Bornes (Topo e Base, ~65% da profundidade):**
   - Superficie rebaixada onde ficam os parafusos.
   - **Paredes divisoras obrigatorias:** Crie aletas verticais de isolacao plastica entre cada borne (espessura `1.5mm` a `2mm`) para formar nichos individuais e impedir aspecto de caixa lisa.
   - **Pocos de parafuso:** Cada borne possui um rebaixo cilindrico escuro (`#2B3036`) contendo arruela metalica e cabeca abaulada de parafuso Phillips com fenda cruzada rotacionada (`15deg` a `35deg`).
3. **Nivel 3 - Frontal Elevado (Centro, 100% da profundidade):**
   - Bloco central saliente com chanfros nas bordas.
   - Recebe serigrafia (no Volt Up, sem marca: ver secao 0), norma (`IEC 60947`), visor mecanico de estado (`I | O`), botoes de teste/reset e dial giratorio de corrente com escala graduada.

## 2. Mecanica de Bornes e Entrada de Condutores

- **Proibido conectar fios na face frontal do parafuso.**
- **Entrada axial (Topo/Base):** Os condutores devem entrar verticalmente pela abertura superior (`+Y`) ou inferior (`-Y`) do nicho do borne, logo atras da cabeca do parafuso.
- **Terminal Tubular (Ilhos):** Adicione uma ponteira cilindrica colorida na extremidade de cada fio antes de entrar no borne (vermelho/branco/azul/amarelo conforme bitola).
- **Cores padrao de fiacao** (no Volt Up valem para as ponteiras; o fio usa `CORES`):
  - Fase / Comando: Vermelho `#C92A2A` ou Branco/Cinza claro `#E9ECEF`
  - Neutro: Azul claro `#1C7ED6`
  - Terra (PE): Listra helicoidal/alternada Verde `#2B8A3E` e Amarelo `#FCC419`

## 3. Serigrafia Direta vs. Etiquetas (Zero Sobreposicao)

- **Numeracao de Bornes (Direto na carcaca):** Renderize `1L1`, `13NO`, `A1`, `95NC`, `96NC`, `2T1`, `14NO`, `A2` diretamente sobre o plastico do degrau do borne em fonte condensada escura (`#111315`, negrito). Nunca use caixas flutuantes sobre os bornes.
- **Etiqueta de Identificacao (Tag):** Use apenas uma etiqueta branca com borda fina (`#22252A`) para o codigo funcional do componente (`Q1`, `K1`, `FT1`, `S0`, `S1`, `M1`), posicionada na lateral direita ou em slot dedicado do frontal.
- **Regra de Z-Index / Oclusao:** Fios nunca podem passar por cima de etiquetas ou serigrafias. Calcule a largura dos textos antes de renderizar e aplique padding interno para evitar cortes nas bordas (ex: `BD - O DESLIGA`).

## 4. Detalhamento por Componente Especial

- **Botoeiras (`BD - O DESLIGA` / `BL - I LIGA`):**
  - Moldura quadrada antracite com 4 parafusos nos cantos + anel frontal metalico chanfrado (`#ADB5BD`) + atuador cilindrico fosco (vermelho `#C92A2A` ou verde `#2B8A3E`).
  - Bloco de contato acoplado com bornes claramente visiveis (`1-2 NC` em vermelho, `3-4 NO` em verde).
- **Motor Eletrico (`M 1~` ou `M 3~`):**
  - Carcaca cilindrica azul industrial (`#1864AB`) com aletas longitudinais de refrigeracao, tampas frontal/traseira com parafusos, pes de fixacao na base e ponta de eixo metalica chavetada.
  - **Caixa de ligacao superior aberta:** Placa de bornes interna com pinos de latao (`U1`, `V1`, `PE`) bem espacados, onde os fios chegam por prensa-cabos lateral/frontal sem cobrir as letras.
- **Barramento de Equipotencializacao (`BEP`) e Haste:**
  - Barra de cobre/latao (`#D98A2B`) apoiada sobre dois isoladores vermelhos/laranjas nas pontas, com 5 a 7 parafusos de latao alinhados e conexoes inferiores limpas.
- **Conectores de Derivacao (Tipo Wago):**
  - Corpo cinza translucido (`#CED4DA`) com alavancas laranjas (`#F76707`) articuladas e entrada frontal alinhada ao eixo dos fios.

## 5. Roteamento Ortogonal de Fios (Canaletas Virtuais)

- Trace todos os condutores em caminhos ortogonais (horizontal/vertical) com curvas suaves (`radius = 6px` a `10px`).
- Em ambientes 3D, separe os planos de profundidade (`Z`) para evitar colisoes visuais:
  - Plano Aterramento (PE): mais proximo da placa de montagem.
  - Plano Potencia: camada intermediaria alinhada aos bornes de forca.
  - Plano Comando: camada frontal alinhada aos contatos auxiliares e botoeiras, mergulhando em `Z` apenas no ponto exato de entrada do borne.
