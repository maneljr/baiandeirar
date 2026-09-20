import { useState } from 'react'
import { FILTERS, WORKS, VALUE_STYLES, type FilterKey } from './data/works'
import { WorkImage } from './components/WorkImage'
import { ArtistSection } from './components/ArtistSection'
import { PAGE_CONTENT, workHref } from './data/pages'
import './App.css'

export default function HomePage() {
  const [filter, setFilter] = useState<FilterKey>('todos')
  const filteredWorks = filter === 'todos' ? WORKS : WORKS.filter((work) => work.valueKey === filter)

  return (
<main style={{"fontFamily":"'Playfair Display', serif","color":"#2a2118","background":"#fdf7e8","overflow":"hidden"}}>

  <a className="skip-link" href="#trabalhos">Pular para os trabalhos</a>
  {/* HERO */}
  <section className="hero-grid" style={{"position":"relative","display":"grid","gridTemplateColumns":"1fr min(260px, 26vw)","minHeight":"100vh","background":"linear-gradient(155deg, #f8e9b8 0%, #f0d488 55%, #e7c264 100%)","overflow":"hidden"}}>
    <div style={{"padding":"14vw 6vw 10vw 6vw","display":"flex","flexDirection":"column","justifyContent":"center","gap":"24px","maxWidth":"720px","boxSizing":"border-box"}}>
      <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"14px","letterSpacing":"0.18em","color":"#8a5a1f","fontWeight":"700"}}>EXPOSIÇÃO DE ARTES PLÁSTICAS</div>
      <h1 style={{"margin":"0","fontSize":"clamp(52px, 9vw, 108px)","lineHeight":"0.95","fontWeight":"800","color":"#6b2b1a","letterSpacing":"0.01em"}}>Baiandeirar</h1>
      <div style={{"height":"2px","width":"120px","background":"#2f5c86"}}></div>
      <p style={{"margin":"0","fontSize":"19px","lineHeight":"1.6","color":"#4a3c26","maxWidth":"520px"}}>Uma mostra de artes plásticas nascida da poesia de Newton Baiandeira e da memória de Itabira — obras de três escolas municipais unidas por três valores: <b>respeito</b>, <b>cidadania</b> e <b>solidariedade</b>.</p>
      <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"13px","lineHeight":"1.9","color":"#6b2b1a","letterSpacing":"0.03em","marginTop":"8px"}}>
        ESCOLA MUNICIPAL PROFESSORA ANTONINA MOREIRA<br/>
        ESCOLA MUNICIPAL JOSÉ GOMES VIEIRA<br/>
        ESCOLA MUNICIPAL MARINA BRAGANÇA DE MENDONÇA
      </div>
      <a href="#trabalhos" style={{"marginTop":"12px","display":"inline-flex","alignSelf":"flex-start","alignItems":"center","gap":"10px","background":"#6b2b1a","color":"#f8e9b8","fontFamily":"'Space Mono', monospace","fontSize":"13px","letterSpacing":"0.1em","fontWeight":"700","padding":"16px 28px","borderRadius":"999px","textDecoration":"none","boxShadow":"0 8px 24px rgba(107,43,26,0.3)"}}>VER OS TRABALHOS →</a>
    </div>
    <div className="hero-tile" style={{"position":"relative","background":"#2e2e32"}}>
      <img src={`${import.meta.env.BASE_URL}images/tile-strip-full.png`} alt="" style={{"position":"absolute","inset":"0","width":"100%","height":"100%","objectFit":"cover"}}/>
    </div>
  </section>

  {/* SOBRE */}
  <section style={{"padding":"8vw 6vw","background":"#fdf7e8"}}>
    <div style={{"maxWidth":"880px","margin":"0 auto"}}>
      <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"13px","letterSpacing":"0.15em","color":"#8a5a1f","fontWeight":"700","marginBottom":"18px"}}>SOBRE A MOSTRA</div>
      <h2 style={{"margin":"0 0 24px","fontSize":"clamp(28px, 4vw, 42px)","fontWeight":"700","color":"#6b2b1a","lineHeight":"1.2"}}>Poesia, arte e valores em diálogo</h2>
      <p style={{"fontSize":"18px","lineHeight":"1.75","color":"#3d3222","margin":"0 0 18px","textWrap":"pretty"}}>Cada trabalho da exposição parte de uma canção, poema ou crônica de Newton Baiandeira — versos sobre trens, pipas, pontes, mineração e futebol — e o traduz em pintura, ilustração ou escultura. Estudantes de três escolas municipais deram forma a essas palavras, encontrando em cada uma um valor para viver em comunidade.</p>
      <p style={{"fontSize":"18px","lineHeight":"1.75","color":"#3d3222","margin":"0","textWrap":"pretty"}}>O resultado é um mosaico de técnicas — papel machê, aquarela, nanquim, tintas naturais de minério — organizado em torno de três eixos: <b style={{"color":"#7c3421"}}>respeito</b>, <b style={{"color":"#2f5c86"}}>cidadania</b> e <b style={{"color":"#8a6314"}}>solidariedade</b>.</p>
    </div>
  </section>

  {/* TRABALHOS */}
  <section id="trabalhos" style={{"padding":"8vw 6vw","background":"#fbf3dc","borderTop":"1px solid #e7d4a0","borderBottom":"1px solid #e7d4a0"}}>
    <div style={{"maxWidth":"1180px","margin":"0 auto"}}>
      <div style={{"display":"flex","justifyContent":"space-between","alignItems":"flex-end","gap":"24px","flexWrap":"wrap","marginBottom":"40px"}}>
        <div>
          <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"13px","letterSpacing":"0.15em","color":"#8a5a1f","fontWeight":"700","marginBottom":"18px"}}>OS TRABALHOS</div>
          <h2 style={{"margin":"0","fontSize":"clamp(28px, 4vw, 42px)","fontWeight":"700","color":"#6b2b1a"}}>Oito obras, três valores</h2>
        </div>
        <div style={{"display":"flex","gap":"10px","flexWrap":"wrap"}}>
          {FILTERS.map((f) => (
            <button key={f.key} type="button" onClick={() => setFilter(f.key)} aria-pressed={filter === f.key} aria-controls="works-grid" className="filter-pill" style={filter === f.key ? { background: '#6b2b1a', color: '#f8e9b8', borderColor: '#6b2b1a' } : f.key === 'todos' ? { background: '#f4ecd6', color: '#6b2b1a' } : VALUE_STYLES[f.key]}>{f.label}</button>
          ))}
        </div>
      </div>

      <div id="works-grid" style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit, minmax(min(300px, 100%), 1fr))","gap":"28px"}}>
        {filteredWorks.map((w) => (
          <div key={w.id} className="work-card" style={{"background":"#fffaee","border":"1px solid #e7d4a0","borderRadius":"4px","overflow":"hidden","display":"flex","flexDirection":"column"}}>
            <div style={{"aspectRatio":"4/3"}}>
              <WorkImage work={w} />
            </div>
            <div style={{"padding":"26px 26px 30px","display":"flex","flexDirection":"column","gap":"14px","flex":"1"}}>
              <div style={{"display":"flex","justifyContent":"space-between","alignItems":"flex-start","gap":"12px"}}>
                <span style={{"fontFamily":"'Space Mono', monospace","fontSize":"12px","color":"#9c8654","letterSpacing":"0.1em"}}>{w.number}</span>
                <span className="value-tag" style={VALUE_STYLES[w.valueKey]}>{w.valueLabel}</span>
              </div>
              <h3 style={{"margin":"0","fontSize":"23px","fontWeight":"700","color":"#6b2b1a","lineHeight":"1.25"}}><a className="work-title-link" href={workHref(PAGE_CONTENT[w.id].slug)}>{w.title}</a></h3>
              <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"12px","color":"#7a6a45","lineHeight":"1.6"}}>{w.author}</div>
              <div style={{"fontSize":"14px","color":"#6a5c3d","lineHeight":"1.5"}}>{w.technique}</div>
              <p style={{"margin":"4px 0 0","fontSize":"16px","fontStyle":"italic","color":"#3d3222","lineHeight":"1.55","borderLeft":"2px solid #d1ad55","paddingLeft":"14px"}}>{w.phrase}</p>
              <a className="work-detail-link" href={workHref(PAGE_CONTENT[w.id].slug)}>CONHECER A OBRA →</a>
              {w.poemTitle && (
                <div style={{"marginTop":"6px","paddingTop":"14px","borderTop":"1px dashed #e0cd94"}}>
                  <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"11px","letterSpacing":"0.08em","color":"#9c8654","marginBottom":"6px"}}>{w.poemTitle}</div>
                  <p style={{"margin":"0","fontSize":"14px","color":"#55482e","lineHeight":"1.55"}}>{w.poemExcerpt}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <ArtistSection />

  {/* CURADORIA */}
  <section id="curadoria" style={{"position":"relative","padding":"8vw 6vw","background":"#2b2b30","color":"#f3e6c2","overflow":"hidden"}}>
    <img src={`${import.meta.env.BASE_URL}images/tile-strip-dark.png`} alt="" style={{"position":"absolute","top":"0","right":"0","height":"100%","width":"min(220px, 22vw)","objectFit":"cover","opacity":"0.9"}}/>
    <div style={{"maxWidth":"780px","margin":"0 auto","position":"relative"}}>
      <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"13px","letterSpacing":"0.15em","color":"#d1ad55","fontWeight":"700","marginBottom":"18px"}}>CURADORIA E REALIZAÇÃO</div>
      <h2 style={{"margin":"0 0 22px","fontSize":"clamp(26px, 3.6vw, 38px)","fontWeight":"700","color":"#f3e6c2"}}>Caroline Vaz</h2>
          <address className="artist-contacts curatorship-contacts" aria-label="Contatos de Caroline Vaz">
            <a href="https://www.instagram.com/carollvaaz/" target="_blank" rel="noopener noreferrer">
              <span>INSTAGRAM ↗</span>
              @carollvaaz
            </a>
            <a href="mailto:carolfernandda@hotmail.com">
              <span>E-MAIL</span>
              carolfernandda@hotmail.com
            </a>
            <a href="tel:+55319921936597">
              <span>TELEFONE</span>
              (31) 9921936597
            </a>
          </address>
      <p style={{"fontSize":"17px","lineHeight":"1.75","color":"#d9c9a0","margin":"0 0 32px","maxWidth":"560px"}}>A curadoria reúne as produções das três escolas em um só percurso, aproximando poesia, história local e educação em valores em uma experiência única de exposição.</p>
      <div style={{"display":"flex","flexWrap":"wrap","gap":"40px","fontFamily":"'Space Mono', monospace","fontSize":"13px","lineHeight":"1.9","color":"#b9a878"}}>
        <div>
          <div style={{"color":"#d1ad55","marginBottom":"8px","letterSpacing":"0.08em"}}>REALIZAÇÃO</div>
          Secretaria Municipal de Educação de Itabira<br/>
          Programa CRES@ARTE
        </div>
        <div>
          <div style={{"color":"#d1ad55","marginBottom":"8px","letterSpacing":"0.08em"}}>ESCOLAS PARTICIPANTES</div>
          E. M. Professora Antonina Moreira<br/>
          E. M. José Gomes Vieira<br/>
          E. M. Marina Bragança de Mendonça
        </div>
      </div>
    </div>
  </section>

  {/* VISITE */}
  <section style={{"position":"relative","padding":"7vw 6vw","background":"linear-gradient(140deg, #b17a26 0%, #8a5a1f 100%)","color":"#fdf3d9","overflow":"hidden"}}>
    <img src={`${import.meta.env.BASE_URL}images/tile-strip-brown.png`} alt="" style={{"position":"absolute","top":"0","right":"0","height":"100%","width":"min(200px, 20vw)","objectFit":"cover","opacity":"0.55"}}/>
    <div style={{"maxWidth":"780px","margin":"0 auto","position":"relative","display":"flex","flexDirection":"column","gap":"20px"}}>
      <div style={{"fontFamily":"'Space Mono', monospace","fontSize":"13px","letterSpacing":"0.15em","color":"#fdf3d9","fontWeight":"700"}}>VISITE A EXPOSIÇÃO</div>
      <h2 style={{"margin":"0","fontSize":"clamp(30px, 4.5vw, 46px)","fontWeight":"700","color":"#fffaef"}}>Itabira, Minas Gerais</h2>
      <p id="visit-date" style={{"margin":"0","fontSize":"18px","lineHeight":"1.7","color":"#fbe9c3","maxWidth":"540px"}}>Fundação Cultural Carlos Drummond de Andrade<br/>Data e horário a confirmar</p>
      <button type="button" disabled aria-describedby="visit-date" className="calendar-button" style={{"marginTop":"8px","display":"inline-flex","alignSelf":"flex-start","alignItems":"center","gap":"10px","background":"#2b2b30","color":"#f3e6c2","fontFamily":"'Space Mono', monospace","fontSize":"13px","letterSpacing":"0.1em","fontWeight":"700","padding":"16px 28px","borderRadius":"999px","textDecoration":"none"}}>ADICIONAR AO CALENDÁRIO →</button>
    </div>
  </section>

  {/* FOOTER */}
  <footer style={{"padding":"32px 6vw","background":"#221f1a","color":"#9c8f76","fontFamily":"'Space Mono', monospace","fontSize":"12px","letterSpacing":"0.04em","display":"flex","justifyContent":"space-between","flexWrap":"wrap","gap":"8px 24px"}}>
    <div>BAIANDEIRAR — EXPOSIÇÃO DE ARTES PLÁSTICAS · 2026</div>
    <div>CURADORIA: CAROLINE VAZ</div>
  </footer>

</main>
  )
}
