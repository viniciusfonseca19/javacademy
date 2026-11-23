import { describe, it, expect } from 'vitest'
import {
  ACHIEVEMENTS,
  buildStats,
  evaluateAchievements,
  pendingAchievements,
  certificateRequirements,
  isCertificateEligible,
  formatStudyTime,
} from './gamification.js'
import { createInitialState, todayKey } from './storage.js'
import { modules, lessonIndex } from '../data/curriculum.js'
import { allLessons, allProjects, allExercises } from '../content/index.js'

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return todayKey(d)
}

describe('buildStats com estado vazio', () => {
  it('reflete o currículo completo sem progresso', () => {
    const stats = buildStats(createInitialState())
    expect(stats.totalLessons).toBe(lessonIndex.length)
    expect(stats.completedLessons).toBe(0)
    expect(stats.overallPercent).toBe(0)
    expect(stats.moduleStats).toHaveLength(modules.length)
    expect(stats.modulesComplete).toBe(0)
    expect(stats.projectsDone).toBe(0)
    expect(stats.answeredExercises).toBe(0)
    expect(stats.exerciseAccuracy).toBe(0)
    expect(stats.streak).toBe(0)
    expect(stats.studySeconds).toBe(0)
  })

  it('os agregados batem com o índice de conteúdo', () => {
    const stats = buildStats(createInitialState())
    expect(stats.totalLessons).toBe(allLessons.length)
    expect(stats.totalProjects).toBe(allProjects.length)
    expect(stats.totalExercises).toBe(allExercises.length)
    expect(stats.totalModules).toBe(modules.length)
  })

  it('cada módulo calcula percentual e estado de projeto', () => {
    const stats = buildStats(createInitialState())
    for (const m of stats.moduleStats) {
      expect(m.totalLessons).toBeGreaterThan(0)
      expect(m.lessonPercent).toBe(0)
      expect(m.complete).toBe(false)
      expect(m.projectDone).toBe(false)
    }
  })
})

describe('buildStats com progresso', () => {
  it('conta aulas concluídas e percentual geral', () => {
    const state = createInitialState()
    lessonIndex.slice(0, 13).forEach((l) => {
      state.lessons[l.id] = { completedAt: '2026-01-01T00:00:00.000Z' }
    })
    const stats = buildStats(state)
    expect(stats.completedLessons).toBe(13)
    expect(stats.overallPercent).toBeCloseTo((13 / 79) * 100, 5)
    expect(stats.moduleStats[0].complete).toBe(true)
    expect(stats.moduleStats[0].lessonPercent).toBe(100)
    expect(stats.modulesComplete).toBe(1)
  })

  it('calcula acerto e aproveitamento dos exercícios', () => {
    const state = createInitialState()
    state.exercises.a = { correct: true, attempts: 1 }
    state.exercises.b = { correct: false, attempts: 2 }
    state.exercises.c = { correct: true, attempts: 1 }
    const stats = buildStats(state)
    expect(stats.answeredExercises).toBe(3)
    expect(stats.correctExercises).toBe(2)
    expect(stats.exerciseHitRate).toBeCloseTo((2 / 3) * 100, 5)
    expect(stats.exerciseAccuracy).toBeCloseTo((2 / stats.totalExercises) * 100, 5)
  })

  it('projeto concluído conta em projectsDone e no módulo', () => {
    const state = createInitialState()
    state.projects.p1 = { checklist: [], completedAt: '2026-01-01T00:00:00.000Z' }
    const stats = buildStats(state)
    expect(stats.projectsDone).toBe(1)
    expect(stats.moduleStats[0].projectDone).toBe(true)
  })

  it('soma tempo de estudo global e do dia', () => {
    const state = createInitialState()
    state.studySeconds = 7200
    state.dailyStudy[todayKey()] = 900
    const stats = buildStats(state)
    expect(stats.studySeconds).toBe(7200)
    expect(stats.todaySeconds).toBe(900)
  })
})

describe('sequência de estudo (streak)', () => {
  it('retorna 0 sem dias registrados', () => {
    expect(buildStats(createInitialState()).streak).toBe(0)
  })

  it('conta dias consecutivos incluindo hoje', () => {
    const state = createInitialState()
    state.dailyStudy[daysAgo(0)] = 600
    state.dailyStudy[daysAgo(1)] = 600
    state.dailyStudy[daysAgo(2)] = 600
    expect(buildStats(state).streak).toBe(3)
  })

  it('suspensa a sequência, recua para o último dia estudado', () => {
    const state = createInitialState()
    state.dailyStudy[daysAgo(1)] = 600
    state.dailyStudy[daysAgo(2)] = 600
    expect(buildStats(state).streak).toBe(2)
  })

  it('quebra no primeiro dia sem estudo', () => {
    const state = createInitialState()
    state.dailyStudy[daysAgo(0)] = 600
    state.dailyStudy[daysAgo(2)] = 600
    expect(buildStats(state).streak).toBe(1)
  })

  it('ignora dias com zero segundos', () => {
    const state = createInitialState()
    state.dailyStudy[daysAgo(0)] = 0
    expect(buildStats(state).streak).toBe(0)
  })
})

describe('conquistas', () => {
  it('tem 6 conquistas com ids únicos', () => {
    expect(ACHIEVEMENTS).toHaveLength(6)
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(6)
  })

  it('nenhuma conquista é merecida no estado vazio', () => {
    const state = createInitialState()
    const stats = buildStats(state)
    expect(pendingAchievements(state, stats)).toEqual([])
    for (const a of evaluateAchievements(state, stats)) {
      expect(a.earned).toBe(false)
      expect(a.unlocked).toBe(false)
    }
  })

  it('primeira aula concede first-lesson', () => {
    const state = createInitialState()
    state.lessons.m1l01 = { completedAt: 'x' }
    const stats = buildStats(state)
    expect(pendingAchievements(state, stats)).toContain('first-lesson')
  })

  it('não repete conquista já registrada', () => {
    const state = createInitialState()
    state.lessons.m1l01 = { completedAt: 'x' }
    state.achievements['first-lesson'] = '2026-01-01T00:00:00.000Z'
    const stats = buildStats(state)
    expect(pendingAchievements(state, stats)).not.toContain('first-lesson')
    const entry = evaluateAchievements(state, stats).find((a) => a.id === 'first-lesson')
    expect(entry.unlocked).toBe(true)
    expect(entry.earnedAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('curso finalizado só dispara com todas as aulas', () => {
    const state = createInitialState()
    lessonIndex.forEach((l) => {
      state.lessons[l.id] = { completedAt: 'x' }
    })
    const stats = buildStats(state)
    expect(stats.completedLessons).toBe(stats.totalLessons)
    expect(pendingAchievements(state, stats)).toContain('course-finished')
  })
})

describe('certificado', () => {
  it('sem progresso, nenhum requisito é atendido', () => {
    const reqs = certificateRequirements(createInitialState(), buildStats(createInitialState()))
    expect(reqs).toHaveLength(3)
    expect(reqs.every((r) => !r.ok)).toBe(true)
    expect(isCertificateEligible(createInitialState(), buildStats(createInitialState()))).toBe(false)
  })

  it('exige aulas, projetos e 70% nos exercícios', () => {
    const state = createInitialState()
    lessonIndex.forEach((l) => {
      state.lessons[l.id] = { completedAt: 'x' }
    })
    allProjects.forEach((p) => {
      state.projects[p.id] = { checklist: [], completedAt: 'x' }
    })
    // Marca 70% dos exercícios como corretos (mínimo inteiro para atingir 70%).
    const need = Math.ceil(state && allExercises.length * 0.7)
    allExercises.slice(0, need).forEach((id, i) => {
      state.exercises[id] = { correct: true, attempts: 1, at: `2026-01-01T00:00:${String(i).padStart(2, '0')}.000Z` }
    })

    const stats = buildStats(state)
    const reqs = certificateRequirements(state, stats)
    expect(reqs.find((r) => r.id === 'lessons').ok).toBe(true)
    expect(reqs.find((r) => r.id === 'projects').ok).toBe(true)
    expect(reqs.find((r) => r.id === 'exercises').ok).toBe(true)
    expect(isCertificateEligible(state, stats)).toBe(true)
  })
})

describe('formatStudyTime', () => {
  it('formata horas e minutos', () => {
    expect(formatStudyTime(0)).toBe('0min')
    expect(formatStudyTime(90)).toBe('1min')
    expect(formatStudyTime(120)).toBe('2min')
    expect(formatStudyTime(3600)).toBe('1h')
    expect(formatStudyTime(3660)).toBe('1h 1min')
    expect(formatStudyTime(7200)).toBe('2h')
    expect(formatStudyTime(9000)).toBe('2h 30min')
  })

  it('nunca retorna valores negativos', () => {
    expect(formatStudyTime(-100)).toBe('0min')
  })
})
