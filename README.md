# Volt Up · Neurolytics Modo Eletricista

Game educativo de elétrica, energia e renováveis (SENAI), no modo história do eletricista.

- **Jogar:** abra `index.html` (ou o link do GitHub Pages, quando ativado).
- **Desenvolver:** leia [docs/NEUROLYTICS-handoff.md](docs/NEUROLYTICS-handoff.md): regras de conteúdo (NBR 5410, público jovem), estrutura de pastas e pendências.
- **Rodar local:** `python3 -m http.server` e abra `http://localhost:8000`.
- **Testes automáticos:** `node tests/rodar.js`. Precisa só do Node e do Google Chrome.
  - O que conferem: gabaritos, erros comuns, previsões, quizzes (inclusive as pistas que entregam a resposta), cenas e o desenho de todas as telas.
  - No GitHub, rodam sozinhos a cada push e PR ([.github/workflows/testes.yml](.github/workflows/testes.yml)).
- **Auditorias:** [técnica](docs/AUDITORIA-tecnica.md) (normas) e [pedagógica](docs/AUDITORIA-pedagogica.md) (quizzes e ligação com o plano de curso SENAI).
- **Entrar / painel:** [login.html](login.html) e [admin.html](admin.html), ligados ao Supabase.
- **Protótipos antigos (sem servidor, dados de exemplo):** [login do aluno](prototipos/login-aluno.html) e [painel Adm](prototipos/admin.html).
