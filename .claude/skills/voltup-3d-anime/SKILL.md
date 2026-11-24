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

**Peças já implementadas:** fonte 1F+N, disjuntor (`fuse`), DR bipolar (`dr`, Quadro Novo) e lâmpada sem PE. Ao incluir uma peça, acrescente o tipo em `VISTA3D.suporta` (`js/fases.js`).

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

---

## 3. Escala e bornes

- **Escala do MVP:** `1 unidade 3D = 1 cm` da bancada, e as fases continuam usando `c.x` e `c.y` da bancada 2D (`posição 3D = ((x − 170)/10, −(y − 125)/10, 0)`).
- **Módulos DIN estilizados para o toque:** 1 módulo = **2,4** de largura (disjuntor unipolar), 2 módulos = 4,8 (DR bipolar), contatora = 3 módulos (7,2). Altura do módulo 8, profundidade 4,6 sobre o trilho (que tem 0,75 de altura).
- **Tabela `TERM3D`** (em `bancada3d.js`): para cada tipo de peça, a posição local de cada borne, com **os mesmos índices do `motor.js`** (`terms(c)`). O construtor da peça lê a `TERM3D` para pôr o parafuso; nunca define borne por conta própria. Os ids ficam `idPeca.indice` (ex.: `DJ.0`).
- **Área de toque:** cada borne tem uma esfera invisível (raio ≥ 1,2) maior que o parafuso, equivalente a pelo menos 44×44 px no celular. O raycast dá prioridade ao borne sobre peça e fio.
- **Fio sem atravessar peça:** a curva `CatmullRomCurve3` sai perpendicular ao borne (+Z) antes de curvar, com barriga para baixo e para a frente.

### Bornes do solver (não invente bornes que o `motor.js` não tem)
| Peça (`type`) | Bornes |
|---|---|
| Fonte `src` (1F+N no MVP) | `.0` = L1, `.1` = N (com 2 e 3 fases: `.2` = L2, `.3` = L3) |
| Disjuntor `fuse` | `.0` = entrada, `.1` = saída |
| Lâmpada `lamp` | `.0` = X1, `.1` = X2 (`.2` = PE só se `c.pe === true`) |
| DR `dr` (bipolar) | `.0` = entrada fase, `.1` = entrada neutro, `.2` = saída fase, `.3` = saída neutro |
| Contatora `kc` | `.0`/`.1` = A1/A2 (bobina), `.2`/`.3` = 13-14 (auxiliar NA, selo), `.4`/`.5` = contato de potência (1 polo) |
| Botoeira `btn` | `.0`/`.1` (NA se `!c.nf`, NF se `c.nf`) |
| Motor `motor` (monofásico) | `.0`/`.1` = força, `.2` = PE (carcaça) |

Os três polos de potência da contatora (`1/L1`, `3/L2`, `5/L3`) e o motor trifásico (`U1`, `V1`, `W1`) só entram quando o solver trifásico de cargas existir.

---

## 4. Especificações das próximas peças

### A. DR (diferencial residual), bipolar
- Largura de 2 módulos (4,8). Corpo DIN com recorte frontal em degrau.
- **Alavanca dupla acoplada:** duas manoplas unidas por uma barra transversal; caem juntas quando `c.trip` fica verdadeiro.
- **Botão de teste `T`:** retângulo amarelo `#ECC94B` na frente, tocável com `acionou(id, 'test')`. O que o teste faz (desarmar) está em `acionarPeca`.
- **Visor de estado:** verde `#38A169` armado, vermelho `#E53E3E` desarmado (`c.trip`).
- Rótulo `DR 30mA`.

### B. Contatora
- 3 módulos (7,2), mais profunda, com **dois níveis de bornes**: frente = contato de potência (`.4/.5`) e auxiliar 13-14 (`.2/.3`); nível recuado = bobina A1/A2 (`.0/.1`) com etiqueta da tensão da bobina (`{V} V~`, da rede escolhida).
- **Êmbolo central:** janela com pino indicador. Com `c.on`, o êmbolo recua 0,08 e o indicador fica laranja/vermelho.

### C. Botoeiras (`BL` liga, NA; `BD` desliga, NF)
- Base cinza-escuro `#334155`, 4 parafusos nos cantos e anel de retenção metálico (`CylinderGeometry`).
- `BL`: êmbolo verde `#2F855A`, saliente, rótulo `I`/`LIGA`. `BD`: êmbolo vermelho `#C53030` (cogumelo ou face plana), rótulo `O`/`DESLIGA`.
- Afunda 0,12 enquanto `c.pressed` for verdadeiro e volta quando ele cai (dirigido pelo estado, nunca pelo `pointerdown` da cena).

### D. Motor monofásico
- Bloco fora do trilho (2,6 de comprimento) sobre base com pés aparafusados.
- Carcaça aletada azul `#2B6CB0` (aletas com `InstancedMesh` ou perfil extrudado), tampas arredondadas com grade de ventilação.
- **Eixo com faixa contrastante** (branca/amarela) que gira quando `res.lamp[id] > 0.04` (velocidade proporcional ao valor de 0 a 1).
- **Caixa de ligação** aberta com os bornes `.0`, `.1` (força) e `.2` (⏚ PE), com porcas sextavadas.

---

## 5. Checklist antes de concluir qualquer peça 3D

1. **`TERM3D`:** todos os bornes da peça estão mapeados com os mesmos índices do `motor.js` (mesma quantidade de `terms(c)`)?
2. **Toque no celular:** cada borne tem esfera invisível maior que o parafuso e é alcançável sem girar a câmera?
3. **Fio:** sai perpendicular ao borne e não atravessa a carcaça?
4. **Estado:** a peça reage a `c.on`, `c.trip`, `c.pressed`, `res.lamp[id]` e `ctx.curto` em `atualizar(ctx)`?
5. **Cache:** materiais e texturas vêm de `mat()`/`textura()`/`rotulo()`; nenhum `new MeshToonMaterial` solto por peça?
6. **Testes:** `VISTA3D.suporta` inclui a peça nova, e `tests/bancada3d.html` cobre os gestos dela com o mesmo resultado no SVG? Rode `node tests/rodar.js`.
