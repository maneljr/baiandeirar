import savedImages from '../data/page-images.json'
import type { Work } from '../data/works'

const images: Record<string, { src: string; alt: string }> = savedImages

export function WorkImage({ work }: { work: Work }) {
  const image = images[work.id]

  return (
    <div className="work-image">
      {image ? (
        <img
          src={import.meta.env.BASE_URL + image.src}
          alt={image.alt || work.title}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', left: '50%', top: '50%', objectFit: 'contain' }}
        />
      ) : (
        <div className="image-placeholder">Imagem da obra em breve</div>
      )}
    </div>
  )
}
