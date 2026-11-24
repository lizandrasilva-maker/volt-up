---
name: voltup-3d-anime
description: Direção de arte anime (cel-shading) e padrões de geometria 3D procedural em Three.js para as peças elétricas da bancada 3D do Volt Up (fonte, disjuntor, DR, contatora, botoeiras, motor, lâmpada e cabos NBR 5410). Use sempre que criar, editar ou revisar peças em js/bancada3d.js.
---

# Direção de arte e geometria 3D do Volt Up (estilo anime)

Padroniza o visual e a construção das peças 3D da bancada (`js/bancada3d.js`), mantendo consistência entre peças, legibilidade no celular e compatibilidade total com o solver (`js/motor.js`) e com a bancada 2D (SVG), que continua sendo o padrão e o fallback.

---

## 1. Regras de arquitetura (invioláveis)

1. **Zero etapa de build.** Three.js via ES Modules (`import * as THREE from 'three'`, `three/addons/...`) resolvidos pela `importmap` do `index.html` (versão fixa `three@0.160.0`). O módulo só é baixado sob demanda (`carrega3D()` em `js/fases.js`, com `?3d=1`).
2. **Desacoplamento do solver.** A 3D só LÊ o estado (`ctx.st`, `ctx.res`, `ctx.sel`, `ctx.curto`, `ctx.cor`, `ctx.editavel`) e EMITE as quatro intenções do contrato (`ctx.ctl`):
   - `tocouBorne(idBorne)`: toque simples num borne;
   - `arrastouFio(idBorne, alvo)`: arrastou um fio até outro borne (`alvo = null` se soltou fora);
   - `acionou(idPeca, lado)`: tocou no corpo da peça (`lado` = deslocamento do toque, ou `'test'` no botão T do DR);
   - `tirouFio(indice)`: tocou num fio.
   Nunca calcule lógica elétrica em `bancada3d.js`. Regra nova de peça (ex.: o que `'test'` faz) entra em `acionarPeca` (`js/fases.js`), não na cena.
3. **Estado dirige a animação.** Toda animação segue o estado depois de `atualizar(ctx)`: `c.trip`, `c.on`, `c.pressed`, `c.closed`, `res.lamp[id]`, `ctx.curto`. Não anime no `pointerdown` local (ex.: a botoeira afunda porque `c.pressed` ficou verdadeiro pelos 700 ms do `acionarPeca`, não porque o dedo encostou).
4. **Cache e memória no celular.** Materiais e texturas estáticos vêm do cache compartilhado (`mat()`, `textura()`, `rotulo()` com cache por texto). Geometrias dinâmicas de fio (`TubeGeometry`) são descartadas com `.dispose()` ao reconstruir; materiais do cache nunca são descartados por peça, só em `destruir()`.
5. **Canvas persistente.** A cena nasce uma vez por bancada (`montar`), é reencaixada a cada redesenho (`atualizar`) e liberada em `destruir` (contrato de `VISTA3D` em `js/fases.js`). Abrir outra bancada 3D (`ctx.bancada` diferente) monta uma cena nova. Desenho sob demanda: só há laço de quadros enquanto houver animação.
6. **Câmera enquadra a bancada.** `enquadra()` calcula a caixa das peças da fase e põe a câmera em 3/4 frontal-superior com folga; não fixe posição de câmera por fase.

**Peças já implementadas:** fonte 1F+N, disjuntor (`fuse`), DR bipolar (`dr`, Quadro Novo), botoeiras (`btn`, BL e BD), contatora (`kc`), relé térmico (`ft`), interruptor simples (`sw`: espelho, tecla basculante que inclina com `c.closed`, bornes L e R), motor monofásico (`motor`: eixo gira com `res.lamp[id]`), BEP (`bep`), haste (`haste`), boia de nível (`boia`: caixa d'água em corte com `matDupla`, nível da água e pera seguem `c.vazia`) e lâmpada sem PE. Interruptor paralelo (`sw3`) e intermediário (`sw4`) usam o mesmo construtor do simples (`interruptor()`), com um bloco de bornes por fileira da TERM3D; a tecla segue `c.pos`. Fotocélula (`foto`: céu atrás com sol de dia e lua e estrelas de noite, janela do sensor escurece, segue `c.noite`; o toque troca dia e noite) e relé de impulso (`ri`, 2 módulos no trilho: alavanca sobe e visor fica laranja com `c.on`, que o solver inverte a cada pulso na bobina; não é acionado à mão). Pilha AA (`pilha`, bancada CC: corpo vermelho e brilho de calor quando `ctx.res.cc.pilhas[id].I > CC.I_CURTO`; a lâmpada queimada (`c.broken`) fica escura). Na bancada CC (`ctx.cc`) não há faixa do poste (`E.semFaixa`, altura 0). Fases do jogo que já abrem em 3D: Pilha e Lanterna (Cap. 1), Primeiro Circuito, Série ou Paralelo, Quadro Novo, Escada, Corredor, Garagem e Hall (Cap. 2, todas as bancadas), Partida Direta e Caixa d'Água (Cap. 3). BEP e haste têm bornes sem nome no 2D: na 3D o nome é `⏚`. Laboratórios (menu, com `?3d=1`): "Laboratório 3D", "Botoeiras 3D" e "Contatora 3D".

**Peças de painel (comportamento fixo):** contatora e relé térmico seguem a skill `cadesimu-industrial-panel-builder` (seção 0 com as regras do Volt Up): `carcaca3()` em 3 níveis (altura `ALT3N` = 9), bornes no degrau (`DEGRAU`), serigrafia por fora do parafuso, `tag()` com o código da peça. Contatora: em cima 1L1, 13NO, A1; embaixo 2T1, 14NO, A2. Nas peças de `VERTICAL` (trilho) o fio entra por dentro do nicho e sai pela borda com ponteira (`entrada()`, `ponteira()`). Todos os parafusos são Phillips rebaixados. `rotulo()` nunca corta o texto (a largura cresce até caber; passe `'auto'` quando não houver largura de layout).

**Traçado dos fios (comportamento fixo):** busca de caminho numa grade de 0,25 (A*, `traca()`/`aEstrela()`): as caixas das peças são paredes (fio NUNCA passa por cima nem por trás de peça), curva custa, correr a menos de `FIO.sep` de fio de outro ponto elétrico custa muito, cruzar custa pouco e ganha um **salto** (arco no plano e levantado em Z, `comSaltos()`). Fios do mesmo borne podem correr juntos (emenda no Wago). Os mais curtos são traçados primeiro. O teste `colados()` exige zero pares colados em todos os gabaritos; se uma fase nova falhar, abra espaço no arranjo das peças em vez de afrouxar a regra.

**Vistas (comportamento fixo):** três vistas da bancada, guardadas em `localStorage['volt-vista']`: `3d` (padrão, câmera livre), `plano` (o 2D: a MESMA cena e as mesmas peças, câmera de frente com fov 20, sem girar; arrastar move a vista e a pinça aproxima; `ctx.plano`, troca sem remontar em `configuraModo()`) e `multi` (diagrama multifilar em SVG). O SVG "real" antigo só aparece sem WebGL. Não existe mais faixa do caminho da energia (poste → quadro) no canvas nem no SVG: no lugar dela há a etiqueta HTML `.redechip` ("⚡ V~ · Hz", acesa com energia passando, vermelha no curto) no canto da bancada; o canvas inteiro é da montagem (`h = min(w·1,05; 600)`).

**Montagem (comportamento fixo):** a 3D é o padrão em toda bancada que ela suporta (`VISTA3D.ligada`, o 🔌 2D fica guardado em `localStorage['volt-vista']='2d'`). Arrastar começando em peça ou fio NÃO é capturado (o OrbitControls gira a vista); só o toque parado aciona. Só o arraste que começa num borne vira fio. O botão 🔄 Girar (`ctx.girar`) desliga toda a montagem e deixa qualquer arraste girar. Pontos de conexão: `ctx.pontos` (condutores por borne, do gabarito `TESTE_SOL` via `pontosDaMontagem`) desenha um anel em cada borne usado (azul-claro faltando, verde completo, laranja com fio a mais) e, nos níveis leve e moderado (`ctx.dica==='conta'`), o contador `ligados/esperados` voltado para dentro da peça. Alavancas de módulo DIN (disjuntor, DR, relé de impulso) saem da frente pelo eixo +Z, por uma fenda escura, e giram em X: `-0,5` = para cima (ligado), `+0,5` = para baixo (desligado); nunca as desenhe ao longo de +Y (entram no corpo ao girar).

7. **Botão 🧊 3D sem flag.** Aparece em toda bancada cujas peças estão em `VISTA3D.suporta`; o Three.js só é baixado no primeiro toque. `?3d=1` apenas abre direto em 3D e mostra os laboratórios.
9. **Caminho da energia em 3D (`montaFaixa()`).** Na vista 3D, a faixa poste → transformador → ramal → medidor → quadro → circuito é desenhada no alto do MESMO canvas (viewport de cima, cena e câmera próprias; nunca um segundo contexto WebGL). Estado: `on` (alguma carga em `res.lamp` > 0,04: pontos de luz correm pelos cabos, LED do medidor pisca, lâmpada acende), `short` (`ctx.curto`: cabos com `matCurto`) ou parado. Legendas iguais às de `entrada()` no SVG, com a rede escolhida. Toque, raycast e projeção usam só a área da bancada (`areaBancada()`). No 2D a faixa continua em SVG.
10. **Emendas com Wago (`poeWagos()`).** Quando 2 ou mais fios chegam ao mesmo borne, um conector de alavancas (corpo `#DDE3EA`, uma alavanca laranja `#F28C28` por fio e mais uma para o borne) aparece no ponto em que os caminhos se separam, na borda da peça.
11. **Fonte 1F/2F/3F+N.** Tocar na fonte (com a proteção armada) abre o seletor HTML `1F+N · 2F+N · 3F+N`; a escolha vai por `acionou(id, 'fases:n')` e a regra `aplicaFases()` (`js/fases.js`, a mesma da Oficina) troca as fases e tira os fios de bornes que deixaram de existir. A peça é refeita (`refazPeca`) com a régua L1 L2 L3 N, como no 2D, e o visor mostra `V/FF V~`.
12. **Dois toques rápidos no espaço vazio** devolvem a câmera ao enquadramento (sem botão).
13. **Zoom no ponto (`zoomNoPonto`).** Pinça e roda do mouse aproximam câmera e alvo na direção do ponto entre os dedos (ou do cursor), que fica parado na tela; o zoom do OrbitControls fica desligado (o `zoomToCursor` do r160 mistura `pageX` com a posição na janela e não conhece a faixa do caminho da energia no alto do canvas). Um segundo dedo cancela o toque em andamento (nada de fio por engano). Distância mínima `0,18 ×` a de enquadramento.
8. **360° sempre ligado (sem botão).** A câmera gira livre o tempo todo (`limites()`: azimute sem limite, polar quase completo). Arrastar no espaço vazio gira; tocar em borne, peça ou fio continua montando (toque sem movimento vai para o `ctl`). Na bancada fica só o botão "🔌 2D".

---

## 2. Padrão visual anime (cel-shading)

### Iluminação
- **Principal (`DirectionalLight`):** branco levemente quente `#FFFDF5`, intensidade `2.2`, em 3/4 frontal-superior, para marcar o relevo de trilho e bornes.
- **Preenchimento (`HemisphereLight`):** céu `#DCE6F2`, sombra fria `#3A4A6B`, intensidade `0.9`. Sombra azulada, não cinza.

### Materiais e contorno
- **Toon:** sempre `THREE.MeshToonMaterial` com o `gradientMap` compartilhado de **3 faixas** (`DataTexture` 3×1 px):
  ```javascript
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;
  gradientMap.needsUpdate = true;
  ```
- **Contorno (lineart):** `OutlineEffect` com a cor do **`--contorno` do jogo**, lida via `getComputedStyle(document.documentElement).getPropertyValue('--contorno')`, com fallback `#070c16`. Rótulos, áreas de toque e brilhos ficam sem contorno (`material.userData.outlineParameters = {visible:false}`).

### Paleta
- **Corpo de módulos DIN (disjuntor, DR, contatora):** off-white industrial `#E6E9EF` (nunca `#FFFFFF`, para a faixa clara do toon não estourar).
- **Trilho DIN 35 mm:** aço escovado `#9AA5B4`.
- **Bornes:** cavidade escura `#1F2933` e parafuso zinco `#CBD5E1` (ou latão `#D99B26`) com **fenda em cruz** visível.
- **Cabos (`TubeGeometry`):** cores lidas da tabela global **`CORES`** do 2D (`js/conteudo.js`), resolvendo `var(--x)` pelo CSS, para 2D e 3D nunca divergirem:
  - fase `--fase` (`#e24c3f`), neutro `--neutro` (azul-claro `#6bb9e8`), retorno `#d9dde3`;
  - terra (PE): textura procedural listrada (`CanvasTexture` com `RepeatWrapping`) em `--terra` (`#43b05c`) e amarelo `#f2d22e`, as mesmas cores do gradiente de `CORES.terra`;
  - CC: positivo `#d33a2c`, negativo `#1c1f24`.
- **Alerta de curto:** os fios de `ctx.curto.fios` trocam para um material vermelho emissivo `#FF2A2A` pulsante e uma faísca (sprite) estala em `ctx.curto.onde`.

### Rótulos
- Texto técnico (`C10`, `DR 30mA`, `A1`, `A2`, `13`, `14`, `LIGA`, `DESLIGA`, `L1`, `N`, `X1`, `X2`) desenhado num `<canvas>` 2D e convertido em `THREE.CanvasTexture`, com fonte sans-serif bold (Nunito 900), fundo transparente ou adesivo colorido e `texture.anisotropy = 4`.
- Rótulo de borne legível no celular: altura mínima de `0,8` unidade na cena.

### Plaquetas dos bornes (legibilidade no celular)
- Todo borne tem uma **plaqueta** criada por `plaqueta(g, nomeBorne(c, k), x, y, z)`: texto bold `#070c16` sobre `#f8fafc`, borda do `--contorno`, altura `1,1`, `anisotropy = 4`, **inclinada** `-0,38` rad em X (olha para a câmera 3/4) e um pouco à frente da peça para não cortar a face.
- O texto é **o mesmo nome do 2D**: `nomeBorne(c, k)` lê `REAL_TERMS` (`js/bancada-real.js`); botoeira NF usa `1`/`2`. Nunca escreva nome de borne à mão na peça.
- A plaqueta fica fora do caminho do fio e da alavanca: ao lado do parafuso (disjuntor à direita, DR do lado de fora) ou abaixo (fonte, lâmpada, botoeira).
- **Badge acima do dedo:** durante o toque num borne e o arraste de fio, um `<div class="badge-borne">` (HTML, `pointer-events: none`) aparece acima do ponto tocado com `Peça · borne` (ex.: `BL · 4`) e, no arraste, `origem → alvo` (ex.: `BL · 4 → L1 · X1`). Some ao soltar (toque simples: fica 0,7 s).

---

## 3. Escala e bornes

- **Escala do MVP:** `1 unidade 3D = 1 cm` da bancada, e as fases continuam usando `c.x` e `c.y` da bancada 2D (`posição 3D = ((x − 170)/10, −(y − 125)/10, 0)`).
- **Módulos DIN estilizados para o toque:** 1 módulo = **2,4** de largura (disjuntor unipolar), 2 módulos = 4,8 (DR bipolar), contatora = 3 módulos (7,2). Altura do módulo 8, profundidade 4,6 sobre o trilho (que tem 0,75 de altura).
- **Tabela `TERM3D`** (em `bancada3d.js`): para cada tipo de peça, a posição local de cada borne, com **os mesmos índices do `motor.js`** (`terms(c)`). O construtor da peça lê a `TERM3D` para pôr o parafuso; nunca define borne por conta própria. Os ids ficam `idPeca.indice` (ex.: `DJ.0`).
- **Área de toque:** cada borne tem uma esfera invisível (raio ≥ 1,2) maior que o parafuso, equivalente a pelo menos 44×44 px no celular. O raycast dá prioridade ao borne sobre peça e fio.
- **Fios legíveis como diagrama (`rota()` em `bancada3d.js`):** nada de arco grosso cruzando a bancada.
  - **Finos:** raio `0,13` (`FIO.raio`); um tubo invisível de raio `0,5` em volta (material de toque) mantém o toque fácil.
  - **Em ângulo reto com cantos arredondados:** o fio sai do borne para a frente, corre pela face da peça até a borda (por cima se o borne está na metade de cima da peça, por baixo se está na de baixo), mergulha até perto da chapa e segue em trechos horizontais e verticais (`CurvePath` de `LineCurve3` com uma `QuadraticBezierCurve3` em cada canto).
  - **Caminho sem passar por trás de peça (`rota()`):** busca o caminho mais curto do tipo origem → corredor perto dela (yA) → coluna (xr) → corredor perto do destino (yB) → destino, testando alturas a partir da borda de cada peça e colunas nas bordas das peças; nenhum trecho junto à chapa pode entrar na caixa de outra peça (`livreH`/`livreV`). Se a bancada estiver cheia a ponto de não haver caminho, usa o corredor simples.
  - **Cada fio na sua pista:** a profundidade muda por fio (`FIO.prof`) e o afastamento preferido do corredor também (`FIO.pista`), mas só como preferência de custo, nunca bloqueando o caminho.
  - **Realce do ponto elétrico:** com um borne selecionado (`ctx.sel`), os fios do mesmo potencial (`ctx.res.net`) ficam cheios e os outros ficam translúcidos (`matFioApagado`, do cache).
  - Toda peça nova precisa da `caixa` (`Box3` do grupo) para o fio saber por onde sair.

### Bornes do solver (não invente bornes que o `motor.js` não tem)
| Peça (`type`) | Bornes |
|---|---|
| Fonte `src` (1, 2 ou 3 fases + N) | `.0` = L1, `.1` = N, `.2` = L2, `.3` = L3; na régua, da esquerda para a direita: L1 L2 L3 N |
| Disjuntor `fuse` | `.0` = entrada, `.1` = saída |
| Lâmpada `lamp` | `.0` = X1, `.1` = X2 (`.2` = PE só se `c.pe === true`) |
| DR `dr` (bipolar) | `.0` = entrada fase, `.1` = entrada neutro, `.2` = saída fase, `.3` = saída neutro |
| Contatora `kc` | `.0`/`.1` = A1/A2 (bobina), `.2`/`.3` = 1-2 (contato de potência, 1 polo), `.4`/`.5` = 13-14 (auxiliar NA, selo) |
| Relé térmico `ft` | `.0`/`.1` = 1-2 (força), `.2`/`.3` = 95-96 (NF de comando) |
| Interruptor simples `sw` | `.0` = L (entrada da fase), `.1` = R (retorno) |
| Interruptor paralelo `sw3` | `.0` = C (comum), `.1` = 1, `.2` = 2 (`c.pos` liga C no 1 ou no 2) |
| Interruptor intermediário `sw4` | `.0`/`.1` = 1-2 (em cima), `.2`/`.3` = 3-4 (embaixo); `c.pos` cruza ou não |
| Fotocélula `foto` | `.0` = L (fase), `.1` = N, `.2` = C (carga); de noite (`c.noite`) liga L em C |
| Relé de impulso `ri` | `.0`/`.1` = A1/A2 (bobina), `.2`/`.3` = 1-2 (contato; `c.on` inverte a cada pulso) |
| Pilha `pilha` | `.0` = +, `.1` = − (régua embaixo; fios `pos` e `neg`) |
| Boia `boia` | `.0`/`.1` = 1-2 (fecha com a caixa vazia, `c.vazia`) |
| Botoeira `btn` | `.0`/`.1`: NA 3-4 se `!c.nf` (BL), NF 1-2 se `c.nf` (BD) |
| Motor `motor` (monofásico) | `.0`/`.1` = força, `.2` = PE (carcaça) |

Confira sempre a tabela contra os gabaritos (`TESTE_SOL` em `js/teste.js`) e os nomes do 2D (`REAL_TERMS`): na partida direta, `K.2`→`K.3` alimenta o motor e `K.4`/`K.5` faz o selo.

Os três polos de potência da contatora (`1/L1`, `3/L2`, `5/L3`) e o motor trifásico (`U1`, `V1`, `W1`) só entram quando o solver trifásico de cargas existir.

---

## 4. Especificações das próximas peças

### A. DR (diferencial residual), bipolar — implementado
- Largura de 2 módulos (4,8). Corpo DIN com recorte frontal em degrau.
- **Alavanca dupla acoplada:** duas manoplas unidas por uma barra transversal; caem juntas quando `c.trip` fica verdadeiro.
- **Botão de teste `T`:** retângulo amarelo `#ECC94B` na frente, tocável com `acionou(id, 'test')`. O que o teste faz (desarmar) está em `acionarPeca`.
- **Visor de estado:** verde `#38A169` armado, vermelho `#E53E3E` desarmado (`c.trip`).
- Rótulo `DR 30mA`.

### B. Contatora — implementada
- 3 módulos (7,2), mais profunda, com **dois níveis de bornes**: frente = contato de potência 1-2 (`.2/.3`) e auxiliar 13-14 (`.4/.5`); nível recuado = bobina A1/A2 (`.0/.1`) com etiqueta da tensão da bobina (`{V} V~`, da rede escolhida).
- **Êmbolo central:** janela com pino indicador. Com `c.on` (calculado pelo solver, com o selo), o êmbolo recua **0,2** (0,08 × 2,4 da escala do MVP) e fica laranja `#F97316`; desligado, cinza `#94A3B8`.
- Não é acionável à mão: só a bobina liga a contatora (`kc` não está em `ACION`).

### B2. Relé térmico — implementado
- 2 módulos (4,8), dial de ajuste, botão de rearme azul `#3182CE` e visor verde (armado) / vermelho (disparado, `c.trip`); o rearme salta quando disparado.
- Bornes `.0/.1` = 1-2 (força) e `.2/.3` = 95-96 (NF de comando). O toque no corpo relata `acionou(id)`; em `acionarPeca` isso simula a sobrecarga ou rearma.

### C. Botoeiras (`BL` liga, NA; `BD` desliga, NF) — implementadas
- Base cinza-escuro `#334155`, 4 parafusos nos cantos e anel de retenção metálico (`CylinderGeometry`).
- `BL`: êmbolo verde `#2F855A`, saliente, rótulo `I`/`LIGA`. `BD`: êmbolo vermelho `#C53030` (cogumelo ou face plana), rótulo `O`/`DESLIGA`.
- Afunda **0,3** (os 0,12 da especificação original × 2,4, a escala do módulo no MVP) enquanto `c.pressed` for verdadeiro e volta quando ele cai (dirigido pelo estado, nunca pelo `pointerdown` da cena).
- Bornes no bloco de contato abaixo da caixa, com plaquetas `3`/`4` (BL) ou `1`/`2` (BD); adesivo colorido `BL · I LIGA` / `BD · O DESLIGA` acima.

### D. Motor monofásico — implementado
- Bloco fora do trilho (2,6 de comprimento) sobre base com pés aparafusados.
- Carcaça aletada azul `#2B6CB0` (aletas com `InstancedMesh` ou perfil extrudado), tampas arredondadas com grade de ventilação.
- **Eixo com faixa contrastante** (branca/amarela) que gira quando `res.lamp[id] > 0.04` (velocidade proporcional ao valor de 0 a 1).
- **Caixa de ligação** aberta com os bornes `.0`, `.1` (força) e `.2` (⏚ PE), com porcas sextavadas.

---

## 5. Checklist antes de concluir qualquer peça 3D

1. **`TERM3D`:** todos os bornes da peça estão mapeados com os mesmos índices do `motor.js` (mesma quantidade de `terms(c)`)?
2. **Toque no celular:** cada borne tem esfera invisível maior que o parafuso, plaqueta com o nome do 2D e é alcançável sem girar a câmera?
3. **Fio:** sai pela borda da peça, corre em ângulo reto na sua pista e não esconde os bornes vizinhos?
4. **Estado:** a peça reage a `c.on`, `c.trip`, `c.pressed`, `res.lamp[id]` e `ctx.curto` em `atualizar(ctx)`?
5. **Cache:** materiais e texturas vêm de `mat()`/`textura()`/`rotulo()`; nenhum `new MeshToonMaterial` solto por peça?
6. **Testes:** `VISTA3D.suporta` inclui a peça nova, e `tests/bancada3d.html` cobre os gestos dela com o mesmo resultado no SVG? Rode `node tests/rodar.js`.
