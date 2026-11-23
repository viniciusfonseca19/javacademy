/**
 * Gamificação: conquistas, estatísticas derivadas e certificado.
 *
 * Todas as informações são derivadas do documento de progresso —
 * nada é duplicado, o que evita inconsistências.
 */

import { modules } from '../data/curriculum.js'
import { allLessons, allProjects, allExercises } from '../content/index.js'

export const ACHIEVEMENTS = [
  {
    id: 'first-lesson',
    title: 'Primeira aula concluída',
    description: 'Você completou sua primeira aula da formação.',
    icon: 'BookOpen',
  },
  {
    id: 'first-exercise',
    title: 'Primeiro exercício resolvido',
    description: 'Você acertou seu primeiro exercício de fixação.',
    icon: 'Target',
  },
  {
    id: 'first-module',
    title: 'Primeiro módulo finalizado',
    description: 'Você concluiu todas as aulas de um módulo completo.',
    icon: 'Flag',
  },
  {
    id: 'first-project',
    title: 'Primeiro projeto concluído',
    description: 'Você fechou o checklist do seu primeiro projeto prático.',
    icon: 'Rocket',
  },
  {
    id: 'ten-lessons',
    title: '10 aulas concluídas',
    description: 'Dez aulas completas — o ritmo está bom.',
    icon: 'Trophy',
  },
  {
    id: 'course-finished',
    title: 'Curso finalizado',
    description: 'Todas as aulas da formação foram concluídas.',
    icon: 'GraduationCap',
  },
]

/* ---------------- Estatísticas derivadas ---------------- */

export function buildStats(state) {
  const totalLessons = allLessons.length
  const completedLessonIds = Object.keys(state.lessons || {})
  const completedLessons = completedLessonIds.length

  const totalExercises = allExercises.length
  const exerciseEntries = Object.entries(state.exercises || {})
  const answeredExercises = exerciseEntries.length
  const correctExercises = exerciseEntries.filter(([, v]) => v && v.correct).length
  const exerciseAccuracy = answeredExercises > 0 ? (correctExercises / totalExercises) * 100 : 0
  const exerciseHitRate = answeredExercises > 0 ? (correctExercises / answeredExercises) * 100 : 0

  const moduleStats = modules.map((m) => {
    const lessons = allLessons.filter((l) => l.moduleId === m.id)
    const done = lessons.filter((l) => state.lessons[l.id]).length
    const exIds = new Set(
      lessons.flatMap((l) => [...(l.exercises || []).map((e) => e.id), ...(l.challenge ? [l.challenge.id] : [])]),
    )
    const answered = exerciseEntries.filter(([id]) => exIds.has(id))
    const correct = answered.filter(([, v]) => v && v.correct).length
    const project = allProjects.find((p) => p.moduleId === m.id)
    const projectDone = project ? Boolean(state.projects[project.id]?.completedAt) : false
    const lessonPercent = lessons.length ? (done / lessons.length) * 100 : 0
    return {
      ...m,
      lessons,
      totalLessons: lessons.length,
      completedLessons: done,
      lessonPercent,
      answeredExercises: answered.length,
      correctExercises: correct,
      exercisePercent: answered.length ? (correct / answered.length) * 100 : 0,
      project,
      projectDone,
      complete: lessons.length > 0 && done === lessons.length,
      percent: lessonPercent,
    }
  })

  const overallPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const modulesComplete = moduleStats.filter((m) => m.complete).length
  const projectsDone = allProjects.filter((p) => state.projects[p.id]?.completedAt).length

  const daily = state.dailyStudy || {}
  const studySeconds = state.studySeconds || 0
  const today = daily[Object.keys(daily).sort().pop()] || 0

  const streak = computeStreak(daily)

  return {
    totalLessons,
    completedLessons,
    totalExercises,
    answeredExercises,
    correctExercises,
    exerciseAccuracy,
    exerciseHitRate,
    moduleStats,
    overallPercent,
    modulesComplete,
    totalModules: modules.length,
    projectsDone,
    totalProjects: allProjects.length,
    studySeconds,
    todaySeconds: today,
    streak,
    achievements: state.achievements || {},
  }
}

/** Sequência consecutiva de dias com estudo (a partir de hoje para trás). */
function computeStreak(daily) {
  const keys = new Set(Object.keys(daily).filter((k) => daily[k] > 0))
  if (keys.size === 0) return 0
  const cursor = new Date()
  // Se hoje não houve estudo, a sequência pode continuar a partir de ontem.
  if (!keys.has(formatDay(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (keys.has(formatDay(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function formatDay(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/* ---------------- Conquistas ---------------- */

/**
 * Retorna a lista de conquistas com o estado atual (concedida ou não)
 * e a data de obtenção.
 */
export function evaluateAchievements(state, stats) {
  const conditions = {
    'first-lesson': stats.completedLessons >= 1,
    'first-exercise': stats.correctExercises >= 1,
    'first-module': stats.modulesComplete >= 1,
    'first-project': stats.projectsDone >= 1,
    'ten-lessons': stats.completedLessons >= 10,
    'course-finished': stats.completedLessons >= stats.totalLessons && stats.totalLessons > 0,
  }
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: Boolean(state.achievements?.[a.id]),
    justUnlocked: Boolean(state.achievements?.[a.id]) && conditions[a.id],
    earned: conditions[a.id],
    earnedAt: state.achievements?.[a.id] || null,
  }))
}

/** IDs de conquistas que acabaram de ser merecidas e ainda não foram registradas. */
export function pendingAchievements(state, stats) {
  const conditions = {
    'first-lesson': stats.completedLessons >= 1,
    'first-exercise': stats.correctExercises >= 1,
    'first-module': stats.modulesComplete >= 1,
    'first-project': stats.projectsDone >= 1,
    'ten-lessons': stats.completedLessons >= 10,
    'course-finished': stats.completedLessons >= stats.totalLessons && stats.totalLessons > 0,
  }
  return ACHIEVEMENTS.filter((a) => conditions[a.id] && !state.achievements?.[a.id]).map((a) => a.id)
}

/* ---------------- Certificado ---------------- */

/**
 * Requisitos simbólicos do certificado:
 *  - todas as aulas concluídas;
 *  - todos os projetos marcados como concluídos;
 *  - pelo menos 70% de aproveitamento geral nos exercícios.
 */
export function certificateRequirements(state, stats) {
  const allLessonsDone = stats.completedLessons >= stats.totalLessons && stats.totalLessons > 0
  const allProjectsDone = stats.projectsDone >= stats.totalProjects
  const exerciseGoal = stats.totalExercises > 0 ? (stats.correctExercises / stats.totalExercises) * 100 : 0
  const exercisesOk = exerciseGoal >= 70

  return [
    {
      id: 'lessons',
      label: `Concluir todas as aulas (${stats.completedLessons}/${stats.totalLessons})`,
      ok: allLessonsDone,
    },
    {
      id: 'projects',
      label: `Concluir todos os projetos (${stats.projectsDone}/${stats.totalProjects})`,
      ok: allProjectsDone,
    },
    {
      id: 'exercises',
      label: `Atingir 70% de aproveitamento nos exercícios (${exerciseGoal.toFixed(1)}%)`,
      ok: exercisesOk,
    },
  ].map((r) => ({ ...r, all: allLessonsDone && allProjectsDone && exercisesOk && r.ok }))
}

export function isCertificateEligible(state, stats) {
  return certificateRequirements(state, stats).every((r) => r.ok)
}

/* ---------------- Tempo ---------------- */

export function formatStudyTime(seconds) {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}
