import rawPages from './work-pages.json'
import { WORKS } from './works'

export interface PageContent {
  slug: string
  textTitle: string | null
  textFormat: string
  audio: string | null
  text: string | null
}
export const PAGE_CONTENT: Record<string, PageContent> = rawPages
export const WORK_PAGES = WORKS.map((work) => ({ ...work, ...PAGE_CONTENT[work.id] }))
export type WorkPageData = (typeof WORK_PAGES)[number]
export const workHref = (slug: string) => `${import.meta.env.BASE_URL}${slug}`
