-- Atualização: alternativas próximas e ranking por acertos + horário.
-- Não altera respostas, notas, datas ou IDs das participações existentes.
begin;

update quiz_private.questions q
set options = (
  select jsonb_agg(
    case when option.value ->> 'id' = replacement.option_id
      then jsonb_set(option.value, '{label}', to_jsonb(replacement.label))
      else option.value
    end order by option.ordinality
  )
  from jsonb_array_elements(q.options) with ordinality as option(value, ordinality)
)
from (values
  (1, 'q1-a', 'Musa Sandy Dourada'),
  (2, 'q2-a', 'Cobra Com crista'),
  (3, 'q3-a', 'Retrato Imaginado do Prefeito'),
  (4, 'q4-b', 'Pipa e Cavaleiro'),
  (5, 'q5-a', 'Polícia de Itabirito')
) as replacement(question_id, option_id, label)
where q.id = replacement.question_id;

create index if not exists quiz_ranking_order
on quiz_private.submissions (score desc, submitted_at, id);

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
