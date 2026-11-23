/**
 * Persistência local da Java Academy.
 *
 * Todo o progresso do estudante é guardado no localStorage do navegador.
 * Este mecanismo serve apenas para conforto do usuário (retomar de onde
 * parou) e NÃO é um mecanismo de segurança — nada sensível é armazenado.
 */

export const STORAGE_KEY = 'java-academy.progress.v1'

export const ACTIVITY_LIMIT = 150

/** Cria o documento de progresso vazio (estado padrão). */
export function createInitialState() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    settings: {
      theme: 'dark',
      freeMode: false,
      studentName: '',
    },
    // lessonId -> { completedAt }
    lessons: {},
    // exerciseId -> { correct: boolean, attempts: number, at }
    exercises: {},
    // challengeId -> { code, criteria: boolean[], revealed: boolean, completedAt }
    challenges: {},
    // projectId -> { checklist: boolean[], notes, link, solutionShown, completedAt }
    projects: {},
    studySeconds: 0,
    // 'YYYY-MM-DD' -> segundos
    dailyStudy: {},
    // achievementId -> ISO date
    achievements: {},
    activity: [],
    lastLessonId: null,
  }
}

/** Lê o progresso do localStorage, com proteção contra dados corrompidos. */
export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw)
    return migrate(parsed)
  } catch (err) {
    console.warn('Não foi possível ler o progresso salvo:', err)
    return createInitialState()
  }
}

function migrate(data) {
  const base = createInitialState()
  if (!data || typeof data !== 'object' || data.version !== 1) return base
  return {
    ...base,
    ...data,
    settings: { ...base.settings, ...(data.settings || {}) },
    lessons: data.lessons && typeof data.lessons === 'object' ? data.lessons : {},
    exercises: data.exercises && typeof data.exercises === 'object' ? data.exercises : {},
    challenges: data.challenges && typeof data.challenges === 'object' ? data.challenges : {},
    projects: data.projects && typeof data.projects === 'object' ? data.projects : {},
    dailyStudy: data.dailyStudy && typeof data.dailyStudy === 'object' ? data.dailyStudy : {},
    achievements: data.achievements && typeof data.achievements === 'object' ? data.achievements : {},
    activity: Array.isArray(data.activity) ? data.activity : [],
    studySeconds: Number.isFinite(data.studySeconds) ? data.studySeconds : 0,
    version: 1,
  }
}

/** Grava o progresso. Falhas (quota cheia, modo privado) não derrubam o app. */
export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (err) {
    console.warn('Não foi possível salvar o progresso:', err)
    return false
  }
}

/** Exporta o progresso como string JSON (para transferência manual). */
export function serializeState(state) {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)
}

/**
 * Valida um JSON importado antes de aplicá-lo.
 * Retorna { ok, state } ou { ok: false, error }.
 */
export function parseImportedState(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'O arquivo não é um JSON válido.' }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'O conteúdo não parece um progresso exportado.' }
  }
  if (data.version !== 1) {
    return { ok: false, error: `Versão de dados não suportada (${data.version ?? 'desconhecida'}).` }
  }
  const lessons = data.lessons && typeof data.lessons === 'object' ? data.lessons : {}
  const exercises = data.exercises && typeof data.exercises === 'object' ? data.exercises : {}
  const totalLessons = Object.keys(lessons).length
  const totalExercises = Object.keys(exercises).length
  return { ok: true, state: migrate(data), stats: { totalLessons, totalExercises } }
}

/** Zera todo o progresso (usado apenas com confirmação explícita). */
export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignora */
  }
  return createInitialState()
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
