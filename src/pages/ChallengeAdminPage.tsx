import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase, supabase } from '../lib/supabase'
import { formatQuizDate, loadRanking, quizError, type Ranking } from '../lib/quiz'

export default function ChallengeAdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(!!supabase)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(supabase ? '' : 'A conexão do desafio ainda não foi configurada.')
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const request = useRef(0)
  const refreshing = useRef(false)
  const refresh = useCallback(async () => {
    if (refreshing.current) return
    refreshing.current = true
    const current = ++request.current
    setBusy(true); setError('')
    try { const result = await loadRanking(); if (request.current === current) setRanking(result) }
    catch (err) { if (request.current === current) { setRanking(null); setError(quizError(err)) } }
    finally { refreshing.current = false; if (request.current === current) setBusy(false) }
  }, [])

  useEffect(() => {
    document.title = 'Organização do desafio — Baiandeirar'
    let alive = true
    if (supabase) {
      const client = supabase
      client.auth.getSession().then(({ data, error: authError }) => {
        if (!alive) return
        setSession(data.session); setChecking(false)
        if (authError) setError('Não foi possível verificar o acesso. Entre novamente.')
      }).catch(() => { if (alive) { setChecking(false); setError('Não foi possível verificar o acesso.') } })
      const { data } = client.auth.onAuthStateChange((_event, next) => {
        if (!alive) return
        setSession(next)
        if (!next) { request.current++; setRanking(null); setBusy(false) }
      })
      return () => { alive = false; data.subscription.unsubscribe() }
    }
  }, [])
  useEffect(() => {
    if (!session?.user.id) return
    let cancelled = false
    const current = ++request.current
    loadRanking().then(result => {
      if (!cancelled && current === request.current) { setRanking(result); setError('') }
    }).catch(err => {
      if (!cancelled && current === request.current) { setRanking(null); setError(quizError(err)) }
    })
    return () => { cancelled = true }
  }, [session?.user.id])

  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const { error: authError } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password })
      if (authError) setError('Não foi possível entrar. Confira seu e-mail e senha.')
      else setPassword('')
    } catch { setError('Não foi possível conectar. Tente novamente.') }
    finally { setBusy(false) }
  }
  async function logout() {
    request.current++; setRanking(null); setBusy(true); setError('')
    try { const { error: authError } = await getSupabase().auth.signOut({ scope: 'local' }); if (authError) throw authError; setSession(null) }
    catch { setError('Não foi possível sair. Tente novamente.') }
    finally { setBusy(false) }
  }

  return <div className="challenge-page">
    <header className="detail-topbar"><a className="detail-brand" href={import.meta.env.BASE_URL}>Baiandeirar<span>ORGANIZAÇÃO DA EXPOSIÇÃO</span></a><a className="back-link" href={`${import.meta.env.BASE_URL}desafio`}>Ver desafio ↗</a></header>
    <main className="challenge-main challenge-admin">
      <p className="detail-eyebrow">PAINEL DA ORGANIZAÇÃO</p><h1>Ranking do desafio</h1>
      {checking ? <p role="status">Verificando acesso…</p> : !session ? <form onSubmit={login} className="challenge-card">
        <h2>Acesso da organização</h2>
        <label htmlFor="admin-email">E-mail</label><input id="admin-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required disabled={busy} />
        <label htmlFor="admin-password">Senha</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required disabled={busy} />
        <button className="challenge-button" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        <p className="challenge-help">Apenas contas autorizadas podem consultar os participantes.</p>
      </form> : <>
        <p className="challenge-intro">As cinco melhores participações, da maior para a menor pontuação. Em caso de empate, fica à frente quem enviou primeiro. Se o horário também for igual, vale o menor ID.</p>
        <div className="ranking-actions"><button type="button" className="challenge-button" onClick={refresh} disabled={busy}>{busy ? 'Consultando…' : '↻ Atualizar resultados'}</button><button type="button" className="challenge-secondary" onClick={logout} disabled={busy}>Sair</button></div>
        {ranking && <>
          <p className="challenge-help" role="status">Atualizado em {formatQuizDate(ranking.updated_at)} · horário de Brasília. Toque em Atualizar para consultar novos envios.</p>
          {ranking.winners.length === 0 ? <div className="challenge-card"><h2>Aguardando as primeiras participações</h2><p>Nenhuma participação foi registrada ainda.</p></div> : <ol className="ranking-list">
            {ranking.winners.map((winner, index) => <li key={winner.id} className={index === 0 ? 'ranking-first' : ''}>
              <span className="ranking-position">{index + 1}º</span><div><span className="detail-eyebrow">{index === 0 ? '1º LUGAR NO RANKING' : 'CLASSIFICAÇÃO GERAL'}</span><h2>{winner.full_name}</h2><p>Participação #{winner.id} · {winner.score}/5 acertos</p><time dateTime={winner.submitted_at}>{formatQuizDate(winner.submitted_at)}</time></div>
            </li>)}
          </ol>}
          <p className="challenge-help">Confira o nome e o número da participação antes da premiação. Pessoas com o mesmo nome ou novas tentativas não são identificadas automaticamente.</p>
        </>}
      </>}
      {error && <p className="challenge-error" role="alert">{error}</p>}
    </main>
  </div>
}
