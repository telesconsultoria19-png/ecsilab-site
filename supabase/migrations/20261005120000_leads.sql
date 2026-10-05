-- Captura de leads do site ecsilab.
-- O visitante (anon) só consegue INSERIR; ninguém lê pela chave pública.
-- A leitura será liberada depois para os administradores (user_roles).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('contato', 'diagnostico', 'calculadora', 'solucao', 'material')),
  name text,
  email text,
  phone text,
  company text,
  revenue_range text,
  message text,
  solution_slug text,
  payload jsonb not null default '{}'::jsonb,
  source_path text
);

create index if not exists leads_kind_created_idx on public.leads (kind, created_at desc);
create index if not exists leads_email_idx on public.leads (lower(email));

alter table public.leads enable row level security;

drop policy if exists "Visitantes inserem leads" on public.leads;
create policy "Visitantes inserem leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    char_length(coalesce(name, '')) <= 200
    and char_length(coalesce(email, '')) <= 320
    and char_length(coalesce(message, '')) <= 4000
  );
