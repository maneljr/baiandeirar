import { useEffect, useRef, useState } from 'react'
import { formatQuizDate, loadQuestions, normalizeName, quizError, submitQuiz, validName, type QuizQuestion, type QuizReceipt } from '../lib/quiz'

const STORAGE_KEY = 'baiandeirar-desafio-v1'
interface Attempt { name: string; questions: QuizQuestion[]; answers: Record<string, string>; requestId: string; locked: boolean; receipt?: QuizReceipt }
function restore(): Attempt | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return saved && validName(saved.name) && Array.isArray(saved.questions) && saved.questions.length === 5 && saved.answers && typeof saved.requestId === 'string' ? saved : null
  } catch { return null }
}

export default function ChallengePage() {
  const [attempt, setAttempt] = useState<Attempt | null>(restore)
  const [name, setName] = useState(attempt?.name || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const active = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { document.title = 'Desafio — Baiandeirar' }, [])
  const answered = attempt ? attempt.questions.filter(q => !!attempt.answers[String(q.id)]).length : 0

  function persist(next: Attempt) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setAttempt(next)
  }
  async function start(event: React.FormEvent) {
    event.preventDefault()
    if (active.current) return
    const normalized = normalizeName(name)
    if (!validName(normalized)) { setError('Informe seu nome e sobrenome.'); return }
    active.current = true; setBusy(true); setError('')
    try {
      const questions = await loadQuestions(normalized)
      persist({ name: normalized, questions, answers: {}, requestId: crypto.randomUUID(), locked: false })
      setTimeout(() => heading.current?.focus(), 0)
    } catch (err) { setError(quizError(err)) }
    finally { active.current = false; setBusy(false) }
  }
  function choose(questionId: number, optionId: string) {
    if (!attempt || attempt.locked) return
    try { persist({ ...attempt, answers: { ...attempt.answers, [questionId]: optionId } }); setError('') }
    catch { setError('Não foi possível salvar suas escolhas neste navegador. Verifique se o armazenamento está habilitado.') }
  }
  async function send(event: React.FormEvent) {
    event.preventDefault()
    if (!attempt || answered !== 5 || active.current) return
    active.current = true; setBusy(true); setError('')
    const pending = { ...attempt, locked: true }
    try {
      // Guardado antes da requisição: um retry usa o mesmo ID e as mesmas respostas.
      persist(pending)
      const receipt = await submitQuiz(pending.name, pending.answers, pending.requestId)
      persist({ ...pending, receipt })
      setTimeout(() => heading.current?.focus(), 0)
    } catch (err) { setError(quizError(err) + ' Suas respostas foram mantidas. Toque em “Confirmar envio” para tentar novamente sem duplicar sua participação.') }
    finally { active.current = false; setBusy(false) }
  }

  return <div className="challenge-page">
    <header className="detail-topbar"><a href={import.meta.env.BASE_URL} className="detail-brand">Baiandeirar<span>ARTE, POESIA E MEMÓRIA</span></a><a href={import.meta.env.BASE_URL} className="back-link">← Exposição</a></header>
    <main className="challenge-main">
      <p className="detail-eyebrow">UM CONVITE A OLHAR DE PERTO</p>
      <h1 ref={heading} tabIndex={-1}>{attempt?.receipt ? 'Participação registrada!' : 'Desafio Baiandeirar'}</h1>
      {!attempt ? <>
        <p className="challenge-intro">Cinco pistas, cinco descobertas. Observe as obras da exposição e encontre as respostas.</p>
        <div className="challenge-rules"><strong>Olhe, descubra e participe.</strong><p>Vence quem tiver mais acertos. Em caso de empate, fica à frente quem enviar primeiro, conforme o horário registrado no servidor. A organização fará a conferência do resultado.</p></div>
        <form onSubmit={start} className="challenge-card">
          <label htmlFor="participant-name">Qual é o seu nome completo?</label>
          <input id="participant-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} maxLength={120} required disabled={busy} placeholder="Nome e sobrenome" aria-describedby="name-help" />
          <p id="name-help" className="challenge-help">Seu nome será usado pela organização para identificar sua participação e conferir a premiação.</p>
          <button className="challenge-button" disabled={busy || !validName(normalizeName(name))}>{busy ? 'Preparando as perguntas…' : 'Começar o desafio →'}</button>
          <p className="challenge-help">As perguntas serão liberadas após você informar seu nome completo.</p>
        </form>
      </> : attempt.receipt ? <section className="challenge-card challenge-receipt">
        <span className="receipt-symbol" aria-hidden="true">✓</span>
        <h2>Obrigado, {attempt.receipt.full_name}!</h2>
        <p>Suas respostas foram recebidas. A organização vai conferir o ranking por número de acertos e horário de envio e anunciar o resultado.</p>
        <dl><div><dt>Seu número</dt><dd>#{attempt.receipt.id}</dd></div><div><dt>Registrado em · horário de Brasília</dt><dd>{formatQuizDate(attempt.receipt.submitted_at)}</dd></div></dl>
        <p className="challenge-help">Guarde este comprovante para a conferência da organização.</p>
        <a className="challenge-button" href={import.meta.env.BASE_URL}>Continuar na exposição →</a>
      </section> : <>
        <div className="challenge-participant"><span>PARTICIPANTE</span><strong>{attempt.name}</strong></div>
        <p className="challenge-intro">Escolha uma alternativa em cada pergunta. Confira suas escolhas antes de enviar.</p>
        <div className="challenge-progress"><span>{answered} de 5 respondidas</span><progress max={5} value={answered} aria-label="Perguntas respondidas" /></div>
        <form onSubmit={send}>
          {attempt.questions.map((question, index) => <fieldset className="challenge-question" key={question.id} disabled={busy || attempt.locked}>
            <legend><span>PERGUNTA {String(index + 1).padStart(2, '0')}</span>{question.prompt}</legend>
            {question.options.map(option => <label className="challenge-option" key={option.id}>
              <input type="radio" name={`question-${question.id}`} value={option.id} checked={attempt.answers[question.id] === option.id} onChange={() => choose(question.id, option.id)} required />
              <span>{option.label}</span>
            </label>)}
          </fieldset>)}
          <p className="challenge-help">O horário vale a partir do registro no servidor. Após o envio, as respostas não poderão ser alteradas.</p>
          <button className="challenge-button" disabled={busy || answered !== 5}>{busy ? 'Registrando sua participação…' : attempt.locked ? 'Confirmar envio' : 'Enviar minhas respostas →'}</button>
        </form>
      </>}
      {error && <p className="challenge-error" role="alert">{error}</p>}
    </main>
    <footer className="challenge-footer">BAIANDEIRAR · ARTE QUE APROXIMA<br />Itabira, Minas Gerais</footer>
  </div>
}
