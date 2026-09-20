import { useEffect, useRef, useState } from 'react'

const timeLabel = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

export function AudioPlayer({ src, title, isSong = false }: { src: string; title: string; isSong?: boolean }) {
  const audio = useRef<HTMLAudioElement>(null)
  const panel = useRef<HTMLElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const element = panel.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  async function toggle() {
    const element = audio.current
    if (!element) return
    if (!element.paused) { element.pause(); return }
    setError('')
    setLoading(true)
    if (element.error) element.load()
    try {
      await element.play()
    } catch {
      setLoading(false)
      setError('Não foi possível iniciar. Confira sua conexão e toque para tentar novamente.')
    }
  }

  return (
    <>
      <section className="audio-panel" ref={panel} aria-label={`Ouvir ${title}`}>
        <p className="detail-eyebrow">{isSong ? 'OUÇA A MÚSICA' : 'POESIA NA VOZ DOS ALUNOS'}</p>
        <button type="button" className="audio-main-button" onClick={toggle} aria-label={playing ? 'Pausar áudio' : (isSong ? 'Ouvir a música' : 'Ouvir a voz dos alunos')}>
          <span className="audio-play-icon" aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
          <span>{playing ? 'Pausar a gravação' : started ? 'Continuar ouvindo' : (isSong ? 'Ouvir a música' : 'Ouvir a voz dos alunos')}</span>
        </button>
        <p className="audio-hint">Ajuste o volume do celular. Se puder, use fones de ouvido.</p>
        <div className="audio-timeline">
          <span>{timeLabel(elapsed)}</span>
          <input type="range" aria-label="Posição do áudio" aria-valuetext={`${timeLabel(elapsed)} de ${timeLabel(duration)}`} min="0" max={duration || 1} step="0.1" value={elapsed} disabled={!duration} onChange={(event) => {
            const value = Number(event.target.value)
            if (audio.current) audio.current.currentTime = value
            setElapsed(value)
          }} />
          <span>{timeLabel(duration)}</span>
        </div>
        <p className="audio-status" role="status">{error || (loading ? 'Carregando áudio…' : playing ? 'Reproduzindo · acompanhe o texto abaixo' : started ? 'Toque no play para ouvir novamente ou continuar.' : (isSong ? 'Ouça e acompanhe a letra abaixo.' : 'Uma leitura gravada pelos estudantes.'))}</p>
        <audio ref={audio} src={src} preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
          onPlay={() => { setPlaying(true); setStarted(true) }}
          onPlaying={() => { setLoading(false); setError('') }}
          onPause={() => { setPlaying(false); setLoading(false) }}
          onWaiting={() => setLoading(true)}
          onEnded={() => { setPlaying(false); setStarted(false); setLoading(false) }}
          onError={() => { setPlaying(false); setLoading(false); setError('Áudio indisponível. Confira sua conexão e toque no play para tentar novamente.') }} />
      </section>
      {started && !visible && <div className="audio-dock" role="region" aria-label="Controles da gravação">
        <div><span>VOCÊ ESTÁ OUVINDO</span><strong>{title}</strong></div>
        <button type="button" onClick={toggle} aria-label={playing ? 'Pausar áudio' : 'Continuar áudio'}>{playing ? 'Ⅱ Pausar' : '▶ Ouvir'}</button>
      </div>}
    </>
  )
}
