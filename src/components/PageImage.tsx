import { useState, type ChangeEvent } from 'react'
import savedImages from '../data/page-images.json'

interface ImageRecord { src: string; alt: string }
const images: Record<string, ImageRecord> = savedImages

export function PageImage({ id, title }: { id: string; title: string }) {
  const [image, setImage] = useState<ImageRecord | undefined>(images[id])
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setStatus('Escolha uma imagem JPG, PNG ou WebP de até 10 MB.')
      input.value = ''
      return
    }
    setSaving(true)
    setStatus('Salvando imagem…')
    try {
      const response = await fetch(`/__artwork-image/${id}`, {
        method: 'PUT', headers: { 'Content-Type': file.type, 'X-Artwork-Upload': '1' }, body: file,
      })
      if (!response.ok) throw new Error('Upload failed')
      const record: ImageRecord = await response.json()
      setImage(record)
      setStatus('Imagem salva no projeto. Ela será incluída na próxima publicação.')
    } catch { setStatus('Não foi possível salvar. Tente novamente com o servidor local em execução.') }
    finally { setSaving(false); input.value = '' }
  }

  return <section className="page-image-section" aria-label="Imagem da obra">
    <figure className={`page-image-frame ${image ? '' : 'is-empty'}`}>
      {image ? <img src={import.meta.env.BASE_URL + image.src} alt={image.alt || title} loading="lazy" /> : <div className="image-placeholder">
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="48" height="48" rx="2"/><circle cx="23" cy="23" r="5"/><path d="m8 46 16-14 11 10 9-8 12 12"/></svg>
        <span>A arte também conta esta história.</span>
        <small>Imagem da obra em breve</small>
      </div>}
    </figure>
    {import.meta.env.DEV && <div className="image-editor">
      <label className="upload-label">{saving ? 'Salvando…' : image ? 'Trocar imagem da obra' : 'Adicionar imagem da obra'}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={saving} />
      </label>
      <p>Uma imagem por obra · JPG, PNG ou WebP · até 10 MB. Disponível apenas na edição local.</p>
      <p role="status">{status}</p>
    </div>}
  </section>
}
