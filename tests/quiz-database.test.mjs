import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

const db = new PGlite()
const sql = await readFile(new URL('../supabase/001_desafio.sql', import.meta.url), 'utf8')
await db.exec(`
 create role anon; create role authenticated;
 create schema auth;
 create table auth.users (id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
 $$;
`)
await db.exec(sql)
const correct = { '1': 'q1-c', '2': 'q2-b', '3': 'q3-d', '4': 'q4-a', '5': 'q5-e' }
const key = number => `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`
async function submit(number, name, answers = correct) {
 const result = await db.query('select public.quiz_submit($1, $2::jsonb, $3::uuid) as receipt', [name, JSON.stringify(answers), key(number)])
 return result.rows[0].receipt
}

test('quiz database: validation, server correction, permissions, idempotency and top five', async () => {
 try {
  await db.exec('set role anon')
  await assert.rejects(db.query("select public.quiz_questions('Ana')"))
  const { rows } = await db.query("select public.quiz_questions('João da Silva') as questions")
  assert.equal(rows[0].questions.length, 5)
  for (const q of rows[0].questions) {
   assert.equal(q.options.length, 5)
   assert.deepEqual(Object.keys(q).sort(), ['id','options','prompt'])
   for(const option of q.options) assert.deepEqual(Object.keys(option).sort(), ['id','label'])
  }
  await assert.rejects(db.query('select * from quiz_private.questions'))
  await assert.rejects(db.query('select * from quiz_private.submissions'))
  await assert.rejects(db.query('select public.quiz_top_five()'))
  await assert.rejects(submit(99, 'Nome Inválido', {1:'q1-c'}))
  await assert.rejects(submit(99, 'Nome Inválido', {...correct, 1:'forged'}))
  await assert.rejects(submit(99, 'Nome Inválido', {...correct, 6:'extra'}))
  const wrong = await submit(1, 'Maria dos Santos', {...correct, 1:'q1-a'})
  assert.equal(wrong.id, '1')
  assert.equal(wrong.score, undefined)
  assert.ok(wrong.submitted_at)
  const first = await submit(2, 'João d’Ávila'.replace('’', "'"))
  const retry = await submit(2, 'João d’Ávila'.replace('’', "'"))
  assert.deepEqual(retry, first)
  await assert.rejects(submit(2, 'Outro Participante'))
  for(let n=3;n<=8;n++) await submit(n, `Participante ${['','', '', 'Ana','Bruna','Carla','Diana','Elisa','Fabiana'][n]}`, n <= 4 ? correct : n <= 6 ? {...correct, 1:'q1-a'} : {...correct, 1:'q1-a', 2:'q2-a'})
  await db.exec('reset role')
  const submissions = (await db.query('select * from quiz_private.submissions order by id')).rows
  assert.equal(submissions.length, 8)
  assert.equal(submissions[0].score, 4)
  assert.equal(submissions[1].score, 5)
  assert.equal(new Set(submissions.map(s=>s.request_id)).size, 8)
  const adminId = key(100)
  await db.query('insert into auth.users (id) values ($1)', [adminId])
  await db.query('insert into quiz_private.admins (user_id) values ($1)', [adminId])
  await db.exec('set role authenticated')
  await db.query("select set_config('request.jwt.claim.sub', $1, false)",[key(101)])
  await assert.rejects(db.query('select public.quiz_top_five()'))
  await assert.rejects(db.query('insert into quiz_private.admins values ($1)', [key(101)]))
  await db.query("select set_config('request.jwt.claim.sub', $1, false)",[adminId])
  const ranking = (await db.query('select public.quiz_top_five() as ranking')).rows[0].ranking
  assert.equal(ranking.winners.length, 5)
  assert.deepEqual(ranking.winners.map(w=>w.id), ['2','3','4','1','5'])
  assert.deepEqual(ranking.winners.map(w=>w.score), [5,5,5,4,4])
  assert.ok(ranking.updated_at)
  await assert.rejects(db.query('select * from quiz_private.submissions'))
  await db.exec('reset role')
  const beforeMigration = (await db.query('select * from quiz_private.submissions order by id')).rows
  const migration = await readFile(new URL('../supabase/003_ranking_e_alternativas.sql', import.meta.url), 'utf8')
  await db.exec("update quiz_private.questions set options = jsonb_set(options, '{0,label}', '\"Alternativa antiga\"') where id = 1")
  await db.exec(migration)
  await db.exec(migration)
  assert.deepEqual((await db.query('select * from quiz_private.submissions order by id')).rows, beforeMigration)
  const distractors = (await db.query('select id, options, correct_option from quiz_private.questions order by id')).rows
  const expected = ['Musa Sandy Dourada', 'Cobra Com crista', 'Retrato Imaginado do Prefeito', 'Pipa e Cavaleiro', 'Polícia de Itabirito']
  distractors.forEach((q, i) => {
    assert.equal(q.options.length, 5)
    assert.ok(q.options.some(o => o.label === expected[i] && o.id !== q.correct_option))
    assert.equal(q.correct_option, correct[String(q.id)])
  })
  // Sem 100% de acerto: mantém cinco classificados e usa horário antes do ID.
  await db.exec("update quiz_private.submissions set score = least(score, 4)")
  await db.exec("update quiz_private.submissions set submitted_at = '2026-09-20T12:00:00Z' where id in (2,3)")
  await db.exec('set role authenticated')
  const tied = (await db.query('select public.quiz_top_five() as ranking')).rows[0].ranking
  assert.deepEqual(tied.winners.map(w=>w.id), ['2','3','1','4','5'])
  assert.ok(tied.winners.every(w=>w.score===4))
  await db.exec('reset role')
  await db.exec(sql)
  assert.equal((await db.query('select count(*)::int as n from quiz_private.submissions')).rows[0].n,8)
 } finally { await db.close() }
})
