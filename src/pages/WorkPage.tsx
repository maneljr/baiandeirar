import { useEffect } from 'react'
import { AudioPlayer } from '../components/AudioPlayer'
import { PageImage } from '../components/PageImage'
import { WORK_PAGES, workHref, type WorkPageData } from '../data/pages'
import { VALUE_STYLES } from '../data/works'

export function WorkPage({ work }: { work: WorkPageData }) {
  const index = WORK_PAGES.findIndex((item) => item.id === work.id)
  const next = WORK_PAGES[(index + 1) % WORK_PAGES.length]
  useEffect(() => {
    document.title = `${work.title} — Baiandeirar`
    const description = document.querySelector('meta[name="description"]')
    description?.setAttribute('content', `${work.title}: arte dos estudantes e literatura de Newton Baiandeira na exposição Baiandeirar.`)
  }, [work.title])

  return <div className="work-page">
    <header className="detail-topbar"><a href={import.meta.env.BASE_URL} className="detail-brand">Baiandeirar<span>ARTE, POESIA E MEMÓRIA</span></a><a href={`${import.meta.env.BASE_URL}#trabalhos`} className="back-link">← Exposição</a></header>
    <main className="detail-main" id="conteudo">
      <header className="detail-heading">
        <div className="detail-meta"><span>OBRA {work.number} / {String(WORK_PAGES.length).padStart(2, '0')}</span><span className="value-tag" style={VALUE_STYLES[work.valueKey]}>{work.valueLabel}</span></div>
        <h1>{work.title}</h1>
        <p>{work.textFormat === 'lyrics' ? 'Uma canção sobre a memória de Itabira e os caminhos de Minas.' : work.textTitle ? <>Um encontro com <em>{work.textTitle}</em>, de Newton Baiandeira.</> : 'A cidade como espaço de todos, pela arte dos estudantes.'}</p>
      </header>
      {work.audio ? <AudioPlayer src={import.meta.env.BASE_URL + work.audio} title={work.textTitle || work.title} isSong={work.textFormat === 'lyrics'} /> : <section className="audio-pending"><p className="detail-eyebrow">A VOZ DOS ALUNOS</p><p>A gravação desta obra estará disponível em breve.</p></section>}
      <PageImage id={work.id} title={work.title} />
      {work.text ? <article className="literary-text" aria-labelledby="poem-title">
        <p className="detail-eyebrow">{work.textFormat === 'lyrics' ? 'LETRA DA MÚSICA' : work.textFormat === 'prose' ? 'PARA LER E SENTIR' : 'O POEMA'}</p>
        <h2 id="poem-title">{work.textTitle}</h2>
        {work.textFormat !== 'lyrics' && <p className="poem-author">Newton Baiandeira</p>}
        <div className={work.textFormat !== 'prose' ? 'poem-verses' : 'poem-prose'}>{work.text.split('\n\n').map((stanza, i) => <p key={i}>{stanza}</p>)}</div>
      </article> : null}
      <aside className="work-context"><p className="detail-eyebrow">DA PALAVRA À ARTE</p><blockquote>{work.phrase}</blockquote><p>{work.author}</p><p>{work.technique}</p></aside>
      <nav className="detail-navigation" aria-label="Continuar na exposição"><a href={workHref(next.slug)}><span>PRÓXIMA OBRA →</span><strong>{next.title}</strong></a><a href={`${import.meta.env.BASE_URL}#trabalhos`}>Ver todas as obras</a></nav>
    </main>
    <footer className="detail-footer">BAIANDEIRAR · ITABIRA, MG<br />Uma homenagem a Newton Baiandeira<br /><a href={`${import.meta.env.BASE_URL}#curadoria`}>Curadoria: Caroline Vaz</a></footer>
  </div>
}
