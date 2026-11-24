-- Papel "validador": conta usada para revisar o jogo inteiro.
-- No jogo, entra direto no modo teste (tudo liberado, progresso separado que não vai para a nuvem).
-- Não ganha nenhum poder de administradora ou de professor: as regras (RLS) só dão acesso extra a 'admin'
-- e ao professor dono da turma.
alter table public.perfis drop constraint if exists perfis_papel_check;
alter table public.perfis add constraint perfis_papel_check check (papel in ('aluno','professor','admin','validador'));
