import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'
import pageData from './src/data/work-pages.json' with { type: 'json' }

// Editing is local-only. Production builds contain no upload service.
function exhibitionPages(): Plugin {
  let root = ''
  let outDir = ''
  let queue: Promise<void> = Promise.resolve()
  return {
    name: 'baiandeirar-pages',
    configResolved(config) { root = config.root; outDir = path.resolve(root, config.build.outDir) },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__artwork-image/')) return next()
        const id = req.url.slice('/__artwork-image/'.length)
        const fail = (code: number, message: string) => { res.statusCode = code; res.end(message) }
        const host = req.headers.host || ''
        const remote = req.socket.remoteAddress || ''
        if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote)
          || !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)
          || req.headers.origin !== `http://${host}`
          || req.headers['x-artwork-upload'] !== '1') return fail(403, 'Local editing only')
        if (req.method !== 'PUT') return fail(405, 'Method not allowed')
        if (!Object.hasOwn(pageData, id)) return fail(404, 'Unknown work')
        const mime = req.headers['content-type']
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime || '')) return fail(415, 'Unsupported image')
        try {
          const chunks: Buffer[] = []
          let size = 0
          for await (const part of req) {
            size += part.length
            if (size > 10 * 1024 * 1024) return fail(413, 'Image too large')
            chunks.push(Buffer.from(part))
          }
          const buffer = Buffer.concat(chunks)
          const ext = mime === 'image/jpeg' && buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ? 'jpg'
            : mime === 'image/png' && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? 'png'
            : mime === 'image/webp' && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP' ? 'webp' : null
          if (!ext) return fail(415, 'Invalid image')
          const fingerprint = createHash('sha256').update(buffer).digest('hex').slice(0, 12)
          const filename = `${id}-${fingerprint}.${ext}`
          const record = { src: `images/pages/${filename}`, alt: `Imagem da obra ${pageData[id as keyof typeof pageData].textTitle || 'Espaços de Convivência'}` }
          const save = async () => {
            await mkdir(path.join(root, 'public/images/pages'), { recursive: true })
            await writeFile(path.join(root, 'public/images/pages', filename), buffer)
            const manifest = path.join(root, 'src/data/page-images.json')
            const data = JSON.parse(await readFile(manifest, 'utf8'))
            data[id] = record
            await writeFile(manifest + '.tmp', JSON.stringify(data, null, 2) + '\n')
            await rename(manifest + '.tmp', manifest)
          }
          const task = queue.then(save)
          queue = task.catch(() => {})
          await task
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(record))
        } catch { fail(500, 'Unable to save image') }
      })
    },
    async closeBundle() {
      const index = await readFile(path.join(outDir, 'index.html'), 'utf8')
      for (const page of Object.values(pageData)) {
        const folder = path.join(outDir, page.slug)
        await mkdir(folder, { recursive: true })
        const title = `${page.textTitle || 'Espaços de Convivência'} — Baiandeirar`
        const html = index.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        await writeFile(path.join(folder, 'index.html'), html)
      }
      for (const slug of ['desafio', 'desafio/admin']) {
        const folder = path.join(outDir, slug)
        await mkdir(folder, { recursive: true })
        await writeFile(path.join(folder, 'index.html'), index.replace(/<title>.*?<\/title>/, '<title>Desafio — Baiandeirar</title>'))
      }
      await writeFile(path.join(outDir, '404.html'), index)
    },
  }
}

export default defineConfig({
  plugins: [react(), exhibitionPages()],
})
