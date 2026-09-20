-- Execute este arquivo completo no SQL Editor do projeto Supabase.
-- O gabarito permanece no schema privado e nunca é entregue ao navegador.
begin;
create schema if not exists quiz_private;
revoke all on schema quiz_private from public, anon, authenticated;

create table if not exists quiz_private.questions (
  id integer primary key,
  prompt text not null,
  options jsonb not null check (jsonb_array_length(options) = 5),
  correct_option text not null
);
create table if not exists quiz_private.submissions (
  id bigint generated always as identity primary key,
  request_id uuid not null unique,
  full_name text not null,
  answers jsonb not null,
  score integer not null check (score between 0 and 5),
  submitted_at timestamptz not null default clock_timestamp()
);
create index if not exists quiz_ranking_order on quiz_private.submissions (score desc, submitted_at, id);
create table if not exists quiz_private.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table quiz_private.questions enable row level security;
alter table quiz_private.submissions enable row level security;
alter table quiz_private.admins enable row level security;
revoke all on all tables in schema quiz_private from public, anon, authenticated;
revoke all on all sequences in schema quiz_private from public, anon, authenticated;

-- Quatro alternativas incorretas e uma correta por pergunta.
-- A ordem é embaralhada pela função pública; a ordem abaixo não indica acerto.
insert into quiz_private.questions (id, prompt, options, correct_option) values
(1, 'Qual obra apresenta uma mulher de pele perolada e batom escuro?',
 '[{"id":"q1-a","label":"Musa Sandy Dourada"},{"id":"q1-b","label":"Retrato em Aquarela"},{"id":"q1-c","label":"Musa Sandy Perolada"},{"id":"q1-d","label":"Menina das Flores"},{"id":"q1-e","label":"Olhos de Itabira"}]', 'q1-c'),
(2, 'Qual obra apresenta uma serpente de chifres?',
 '[{"id":"q2-a","label":"Cobra Com crista"},{"id":"q2-b","label":"Cobra Com chifres"},{"id":"q2-c","label":"Lagarto do Cauê"},{"id":"q2-d","label":"A Serpente do Rio"},{"id":"q2-e","label":"Monstro da Floresta"}]', 'q2-b'),
(3, 'Qual obra apresenta o uniforme da prefeitura?',
 '[{"id":"q3-a","label":"Retrato Imaginado do Prefeito"},{"id":"q3-b","label":"Os Jogadores de Itabira"},{"id":"q3-c","label":"Trabalhadores da Mina"},{"id":"q3-d","label":"Retrato Imaginado de Newton ou Retrato Imaginado de Vanda"},{"id":"q3-e","label":"O Guarda da Estação"}]', 'q3-d'),
(4, 'Qual obra apresenta um cavalo e pipas?',
 '[{"id":"q4-a","label":"Pipa e Cavalo"},{"id":"q4-b","label":"Pipa e Cavaleiro"},{"id":"q4-c","label":"Cavalos da Serra"},{"id":"q4-d","label":"O Jardim dos Papagaios"},{"id":"q4-e","label":"Brincadeiras na Ponte"}]', 'q4-a'),
(5, 'Qual obra apresenta um policial e um carro?',
 '[{"id":"q5-a","label":"Polícia de Itabirito"},{"id":"q5-b","label":"Caminhos da Cidade"},{"id":"q5-c","label":"O Motorista da Estação"},{"id":"q5-d","label":"A Guarda do Museu"},{"id":"q5-e","label":"Polícia de Itabira"}]', 'q5-e')
on conflict (id) do nothing;

create or replace function quiz_private.clean_name(p_name text)
returns text language plpgsql immutable set search_path = '' as $$
declare v_name text;
begin
  v_name := trim(regexp_replace(coalesce(p_name, ''), '[[:space:]]+', ' ', 'g'));
  if char_length(v_name) < 5 or char_length(v_name) > 120
     or v_name !~ '^[[:alpha:]][[:alpha:] ''.-]* [[:alpha:]][[:alpha:] ''.-]*$' then
    raise exception 'Informe seu nome completo (nome e sobrenome).' using errcode = '22023';
  end if;
  return v_name;
end;
$$;
revoke all on function quiz_private.clean_name(text) from public, anon, authenticated;

create or replace function public.quiz_questions(p_name text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_result jsonb;
begin
  perform quiz_private.clean_name(p_name);
  select jsonb_agg(jsonb_build_object('id', q.id, 'prompt', q.prompt,
    'options', (select jsonb_agg(o.value order by random()) from jsonb_array_elements(q.options) o)) order by q.id)
    into v_result from quiz_private.questions q;
  return coalesce(v_result, '[]'::jsonb);
end;
$$;
revoke all on function public.quiz_questions(text) from public, anon, authenticated;
grant execute on function public.quiz_questions(text) to anon, authenticated;

create or replace function public.quiz_submit(p_name text, p_answers jsonb, p_request_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_name text;
  v_score integer;
  v_record quiz_private.submissions%rowtype;
begin
  v_name := quiz_private.clean_name(p_name);
  if p_request_id is null or p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Envio inválido.' using errcode = '22023';
  end if;
  if (select count(*) from jsonb_object_keys(p_answers)) <> 5
     or (select count(*) from quiz_private.questions) <> 5 then
    raise exception 'Responda às cinco perguntas.' using errcode = '22023';
  end if;
  if exists (select 1 from quiz_private.questions q where
      not (p_answers ? q.id::text) or jsonb_typeof(p_answers -> q.id::text) <> 'string'
      or not exists (select 1 from jsonb_array_elements(q.options) o where o.value ->> 'id' = p_answers ->> q.id::text)) then
    raise exception 'Selecione uma alternativa válida em cada pergunta.' using errcode = '22023';
  end if;
  -- Serializa somente o registro final, para desempate consistente por horário/ID.
  perform pg_advisory_xact_lock(792061);
  select * into v_record from quiz_private.submissions where request_id = p_request_id;
  if found then
    if v_record.full_name <> v_name or v_record.answers <> p_answers then
      raise exception 'Este envio já foi registrado com outras respostas.' using errcode = '22023';
    end if;
  else
    select count(*)::integer into v_score from quiz_private.questions q
      where q.correct_option = p_answers ->> q.id::text;
    insert into quiz_private.submissions (request_id, full_name, answers, score, submitted_at)
      values (p_request_id, v_name, p_answers, v_score, clock_timestamp()) returning * into v_record;
  end if;
  -- Sem pontuação/gabarito público durante a disputa.
  return jsonb_build_object('id', v_record.id::text, 'full_name', v_record.full_name, 'submitted_at', v_record.submitted_at);
end;
$$;
revoke all on function public.quiz_submit(text, jsonb, uuid) from public, anon, authenticated;
grant execute on function public.quiz_submit(text, jsonb, uuid) to anon, authenticated;

create or replace function public.quiz_top_five()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_winners jsonb;
begin
  if auth.uid() is null or not exists(select 1 from quiz_private.admins where user_id = auth.uid()) then
    raise exception 'Acesso restrito à organização.' using errcode = '42501';
  end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', s.id::text, 'full_name', s.full_name,
    'submitted_at', s.submitted_at, 'score', s.score) order by s.score desc, s.submitted_at, s.id), '[]'::jsonb)
    into v_winners from (select id, full_name, submitted_at, score from quiz_private.submissions
      order by score desc, submitted_at, id limit 5) s;
  return jsonb_build_object('winners', v_winners, 'updated_at', clock_timestamp());
end;
$$;
revoke all on function public.quiz_top_five() from public, anon, authenticated;
grant execute on function public.quiz_top_five() to authenticated;
commit;
notify pgrst, 'reload schema';
