export function ArtistSection() {
  return (
    <section id="artista" className="artist-section" aria-labelledby="artist-title">
      <div className="artist-layout">
        <figure className="artist-portrait">
          <img
            src={`${import.meta.env.BASE_URL}images/newton-baiandeira.jpg`}
            alt="Newton Baiandeira no palco, segurando um violão sob luzes coloridas"
            width="228"
            height="320"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Newton Baiandeira, entre música e poesia.</figcaption>
        </figure>
        <div className="artist-content">
          <p className="artist-eyebrow">SOBRE O ARTISTA</p>
          <h2 id="artist-title">Newton Baiandeira</h2>
          <p className="artist-role">Poeta, cantor, compositor e artista plástico</p>
          <div className="artist-bio">
            <p>
              Newton Reis Rocha, conhecido como Newton Baiandeira, nasceu em
              Acesita, hoje Timóteo, em 1952. Mudou-se ainda criança para Itabira,
              cidade com a qual construiu uma profunda relação de afeto e pertencimento.
            </p>
            <p>
              Sua trajetória reuniu música, poesia, artes plásticas e a escrita em
              jornais. Em suas criações, levou o nome de Itabira a diferentes palcos
              e abordou questões sociais, culturais e ambientais. Entre suas canções
              está O Trem que Leva Minas.
            </p>
            <p>
              Na exposição Baiandeirar, suas palavras encontram novas formas e cores
              nas produções dos estudantes. A homenagem aproxima sua obra das novas
              gerações, conectando a memória da cidade ao respeito, à cidadania e à
              solidariedade.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
