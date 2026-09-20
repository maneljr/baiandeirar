export type ValueKey = 'respeito' | 'cidadania' | 'solidariedade'
export type FilterKey = 'todos' | ValueKey

export interface Work {
  id: string
  number: string
  title: string
  author: string
  technique: string
  valueKey: ValueKey
  valueLabel: string
  phrase: string
  poemTitle: string | null
  poemExcerpt: string | null
}

export const WORKS: Work[] = [
  { id: 'w1', number: '01', title: 'O Trem que Leva Minas', author: 'Arte e memória de Itabira', technique: 'Uma obra em diálogo com a música', valueKey: 'cidadania', valueLabel: 'Cidadania', phrase: '"As coisas do passado tem gosto de saudade"', poemTitle: 'O TREM QUE LEVA MINAS', poemExcerpt: '"O trem que leva Minas mudou nossa cidade"' },
  { id: 'w2', number: '02', title: 'Bustos em Papietagem', author: 'Trabalho em grupo · uma escultura por escola', technique: 'Papel machê / papietagem', valueKey: 'respeito', valueLabel: 'Respeito', phrase: '"Respeitar é reconhecer a beleza e a história de cada pessoa."', poemTitle: 'MUSA — NEWTON BAIANDEIRA', poemExcerpt: '"Os olhos dela são templos, deuses e ventos cantam a música."' },
  { id: 'w3', number: '03', title: 'Serpenteando', author: 'Trabalho individual · lápis de cor', technique: 'Ilustração — ref. Onde Vivem os Monstros, Maurice Sendak', valueKey: 'cidadania', valueLabel: 'Cidadania', phrase: '"Cidadania também é conhecer e preservar as histórias da nossa cidade."', poemTitle: 'SERPENTEANDO', poemExcerpt: '"Tem uma serpente em Itabira, no subsolo — dizem que se o minério acabar, ela arrasa a cidade."' },
  { id: 'w4', number: '04', title: 'Rabiolas', author: 'Trabalho individual · aquarela', technique: 'Ilustração — ref. A Fada que Tinha Ideias', valueKey: 'solidariedade', valueLabel: 'Solidariedade', phrase: '"Sonhos voam mais alto quando são compartilhados."', poemTitle: 'RABIOLAS', poemExcerpt: '"Dar asa ao sonho, dar linha à vida, dar corda ao mundo — voar, voar, voar."' },
  { id: 'w5', number: '05', title: 'Pinguelas', author: 'Trabalho individual · giz pastel oleoso', technique: 'Ilustração — ref. A Casa Sonolenta, Don Wood', valueKey: 'solidariedade', valueLabel: 'Solidariedade', phrase: '"Solidariedade é construir pontes quando o caminho se torna difícil."', poemTitle: 'PINGUELAS', poemExcerpt: '"A água passa por cima da ponte. Só a pinguela mais alta escapou da chuva."' },
  { id: 'w6', number: '06', title: 'Dó da Mula', author: 'Trabalho individual · nanquim sobre kraft', technique: 'Natureza-morta — ref. Alice no País das Maravilhas, John Tenniel', valueKey: 'respeito', valueLabel: 'Respeito', phrase: '"Respeito é reconhecer a dignidade de todos os seres."', poemTitle: 'DÓ DA MULA', poemExcerpt: '"Homem e balaios no lombo, freio na boca — tamanha gula, eu só tinha dó da mula."' },
  { id: 'w7', number: '07', title: 'Cabô Cauê', author: 'Trabalho em grupo · um trabalho por turma', technique: 'Tintas naturais — minério de ferro e terra · ref. José Assunção', valueKey: 'cidadania', valueLabel: 'Cidadania', phrase: '"Cidadania é cuidar do lugar onde vivemos."', poemTitle: 'CABÔ CAUÊ', poemExcerpt: '"Por mão de homem sem dó, Cauê era pedra, virou pó."' },
  { id: 'w8', number: '08', title: 'Cara a Cara com o Gol', author: 'Trabalho em grupo · guache', technique: 'Ilustração — ref. Heitor dos Prazeres', valueKey: 'respeito', valueLabel: 'Respeito', phrase: '"O esporte ensina que vencer é importante, mas respeitar o outro é fundamental."', poemTitle: 'CARA A CARA COM O GOL', poemExcerpt: '"Lá estava a bola, mais redonda que nunca. Olhava pra mim, eu olhava pra ela."' },
]

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'respeito', label: 'Respeito' },
  { key: 'cidadania', label: 'Cidadania' },
  { key: 'solidariedade', label: 'Solidariedade' },
]

export const VALUE_STYLES = {
  respeito: { background: '#f6e6df', color: '#7c3421' },
  cidadania: { background: '#e3ecf3', color: '#2f5c86' },
  solidariedade: { background: '#f7ecd2', color: '#8a6314' },
}

export const WORK_IMAGES: Record<string, { src: string; scale: number; x: number; y: number }> = {
  "w1": {
    "src": "images/works/o-trem-que-leva-minas.png",
    "scale": 1,
    "x": 0,
    "y": 0
  },
  "w2": {
    "src": "images/works/w2.webp",
    "scale": 1,
    "x": 0,
    "y": 0
  },
  "w3": {
    "src": "images/works/w3.webp",
    "scale": 1,
    "x": 0,
    "y": 0
  },
  "w4": {
    "src": "images/works/w4.webp",
    "scale": 1,
    "x": 0,
    "y": -33.5180265654649
  },
  "w5": {
    "src": "images/works/w5.webp",
    "scale": 1,
    "x": -1.1102230246251565e-14,
    "y": -23.613595706618963
  },
  "w6": {
    "src": "images/works/w6.webp",
    "scale": 1,
    "x": -1.1102230246251565e-14,
    "y": 24.68832112707553
  },
  "w7": {
    "src": "images/works/w7.webp",
    "scale": 1,
    "x": 0,
    "y": 0
  },
  "w8": {
    "src": "images/works/w8.webp",
    "scale": 1,
    "x": 0,
    "y": 0
  }
}
