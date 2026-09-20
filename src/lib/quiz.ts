import { getSupabase } from './supabase'

export interface QuizQuestion { id: number; prompt: string; options: { id: string; label: string }[] }
export interface QuizReceipt { id: string; full_name: string; submitted_at: string }
export interface QuizWinner extends QuizReceipt { score: number }
export interface Ranking { winners: QuizWinner[]; updated_at: string }
export const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ')
export const validName = (name: string) => name.length >= 5 && name.length <= 120 && /^[\p{L}][\p{L} '.-]* [\p{L}][\p{L} '.-]*$/u.test(name)
export function quizError(error: unknown) {
  const item = error as { code?: string; message?: string }
  if (item?.code === 'PGRST202') return 'O desafio está sendo preparado. Tente novamente em instantes.'
  if (item?.code === '42501') return 'Esta conta não tem acesso aos resultados. Consulte a organização.'
  if (item?.code === '22023') return item.message || 'Confira os dados antes de enviar.'
  return 'Não foi possível conectar. Confira sua internet e tente novamente.'
}
export async function loadQuestions(name: string): Promise<QuizQuestion[]> {
  const { data, error } = await getSupabase().rpc('quiz_questions', { p_name: name })
  if (error) throw error
  if (!Array.isArray(data) || data.length !== 5 || data.some(q => !Array.isArray(q.options) || q.options.length !== 5)) throw new Error('Invalid quiz')
  return data
}
export async function submitQuiz(name: string, answers: Record<string, string>, requestId: string): Promise<QuizReceipt> {
  const { data, error } = await getSupabase().rpc('quiz_submit', { p_name: name, p_answers: answers, p_request_id: requestId })
  if (error) throw error
  if (!data?.id || !data?.submitted_at) throw new Error('Missing receipt')
  return data
}
export async function loadRanking(): Promise<Ranking> {
  const { data, error } = await getSupabase().rpc('quiz_top_five')
  if (error) throw error
  return data
}
export const formatQuizDate = (date: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'America/Sao_Paulo' }).format(new Date(date))
