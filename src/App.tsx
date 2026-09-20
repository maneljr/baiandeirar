import { lazy, Suspense } from 'react'
import HomePage from './HomePage'
import { WorkPage } from './pages/WorkPage'
import { WORK_PAGES } from './data/pages'
import './work-page.css'
import './challenge.css'

const ChallengePage = lazy(() => import('./pages/ChallengePage'))
const ChallengeAdminPage = lazy(() => import('./pages/ChallengeAdminPage'))

export default function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  let pathname: string
  try { pathname = decodeURIComponent(window.location.pathname) } catch { pathname = '' }
  const path = pathname.slice(base.length).replace(/^\/+|\/+$/g, '')
  if (pathname && (!path || path === 'index.html')) return <HomePage />
  if (path === 'desafio') return <Suspense fallback={<p className="challenge-main">Carregando desafio…</p>}><ChallengePage /></Suspense>
  if (path === 'desafio/admin') return <Suspense fallback={<p className="challenge-main">Carregando painel…</p>}><ChallengeAdminPage /></Suspense>
  const work = WORK_PAGES.find((item) => item.slug === path)
  if (work) return <WorkPage key={work.id} work={work} />
  return <main className="not-found"><p className="detail-eyebrow">BAIANDEIRAR</p><h1>Obra não encontrada</h1><p>Confira o endereço ou escolha uma obra na exposição.</p><a href={import.meta.env.BASE_URL}>Voltar à exposição →</a></main>
}
