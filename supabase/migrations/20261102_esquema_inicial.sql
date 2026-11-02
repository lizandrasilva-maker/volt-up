-- Esquema do Volt Up no Supabase (projeto pmhkzxkygvpeyckhnipz, região São Paulo).
-- Estado final das migrações aplicadas em 02/11/2026: esquema_inicial, validade_somente_propria, politicas_sem_recursao.

create table public.turmas (
  id uuid primary key default gen_random_uuid(),
  escola text not null,
  nome text not null,
  professor_id uuid references auth.users(id) on delete set null,
  vagas int not null default 30 check (vagas between 1 and 200),
  valido_ate date not null default (current_date + 90),
  criado_em timestamptz not null default now()
);
create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  apelido text not null default 'Jogador',
  papel text not null default 'aluno' check (papel in ('aluno','professor','admin')),
  turma_id uuid references public.turmas(id) on delete set null,
  codigo text unique,
  criado_em timestamptz not null default now()
);
create table public.acessos (
  user_id uuid primary key references auth.users(id) on delete cascade,
  valido_ate timestamptz not null,
  origem text not null default 'manual',
  atualizado_em timestamptz not null default now()
);
create table public.progresso (
  user_id uuid primary key references auth.users(id) on delete cascade,
  estado jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);
create index on public.perfis (turma_id);
create index on public.turmas (professor_id);

-- Funções auxiliares (security definer: evitam recursão entre as regras)
create or replace function public.eh_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.perfis where id = auth.uid() and papel = 'admin'); $$;
create or replace function public.minha_turma() returns uuid language sql stable security definer set search_path = '' as $$
  select turma_id from public.perfis where id = auth.uid(); $$;
create or replace function public.eh_professor_de(t uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.turmas where id = t and professor_id = auth.uid()); $$;
-- Validade do acesso: o maior entre o acesso individual e a turma. Só a própria (ou o Adm).
create or replace function public.validade_acesso(uid uuid default auth.uid()) returns timestamptz
language sql stable security definer set search_path = '' as $$
  select case when uid = auth.uid() or public.eh_admin() then greatest(
    (select a.valido_ate from public.acessos a where a.user_id = uid),
    (select (t.valido_ate + 1)::timestamptz from public.perfis p join public.turmas t on t.id = p.turma_id where p.id = uid)
  ) end; $$;

create or replace function public.novo_usuario() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfis (id, apelido)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'apelido',''), split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger ao_criar_usuario after insert on auth.users for each row execute function public.novo_usuario();

alter table public.turmas enable row level security;
alter table public.perfis enable row level security;
alter table public.acessos enable row level security;
alter table public.progresso enable row level security;

create policy "perfil: dono lê" on public.perfis for select to authenticated
  using (id = (select auth.uid()) or (select public.eh_admin()) or public.eh_professor_de(turma_id));
create policy "perfil: dono muda apelido" on public.perfis for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "perfil: admin gerencia" on public.perfis for all to authenticated
  using ((select public.eh_admin())) with check ((select public.eh_admin()));
create policy "turma: ver" on public.turmas for select to authenticated
  using ((select public.eh_admin()) or professor_id = (select auth.uid()) or id = (select public.minha_turma()));
create policy "turma: admin gerencia" on public.turmas for all to authenticated
  using ((select public.eh_admin())) with check ((select public.eh_admin()));
create policy "acesso: dono lê" on public.acessos for select to authenticated
  using (user_id = (select auth.uid()) or (select public.eh_admin()));
create policy "acesso: admin gerencia" on public.acessos for all to authenticated
  using ((select public.eh_admin())) with check ((select public.eh_admin()));
create policy "progresso: dono" on public.progresso for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "progresso: admin e professor leem" on public.progresso for select to authenticated
  using ((select public.eh_admin()) or exists (
    select 1 from public.perfis p where p.id = progresso.user_id and public.eh_professor_de(p.turma_id)));

-- Pelo navegador, o usuário só muda o próprio apelido (papel e turma só pelo servidor)
revoke update on public.perfis from authenticated;
grant update (apelido) on public.perfis to authenticated;

revoke execute on function public.eh_admin() from anon, public;
revoke execute on function public.minha_turma() from anon, public;
revoke execute on function public.eh_professor_de(uuid) from anon, public;
revoke execute on function public.validade_acesso(uuid) from anon, public;
grant execute on function public.eh_admin(), public.minha_turma(), public.eh_professor_de(uuid), public.validade_acesso(uuid) to authenticated;
revoke execute on function public.novo_usuario() from anon, authenticated, public;
