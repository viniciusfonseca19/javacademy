import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  STORAGE_KEY,
  createInitialState,
  loadState,
  saveState,
  serializeState,
  parseImportedState,
  clearState,
  todayKey,
  ACTIVITY_LIMIT,
} from './storage.js'

const KEY = STORAGE_KEY

beforeEach(() => {
  window.localStorage.clear()
})

describe('createInitialState', () => {
  it('cria a versão 1 com todas as coleções vazias', () => {
    const s = createInitialState()
    expect(s.version).toBe(1)
    expect(s.settings.theme).toBe('dark')
    expect(s.settings.freeMode).toBe(false)
    expect(s.lessons).toEqual({})
    expect(s.exercises).toEqual({})
    expect(s.challenges).toEqual({})
    expect(s.projects).toEqual({})
    expect(s.studySeconds).toBe(0)
    expect(s.activity).toEqual([])
    expect(s.lastLessonId).toBeNull()
  })

  it('gera documentos distintos (createdAt não é compartilhado)', () => {
    expect(createInitialState()).not.toBe(createInitialState())
  })
})

describe('saveState / loadState (roundtrip)', () => {
  it('preserva o progresso após salvar e recarregar', () => {
    const state = createInitialState()
    state.lessons.m1l01 = { completedAt: '2026-01-01T10:00:00.000Z' }
    state.exercises.m1l01e1 = { correct: true, attempts: 2, at: '2026-01-01T10:05:00.000Z' }
    state.projects.p1 = { checklist: [true, false], notes: 'minhas notas', link: '' }
    state.studySeconds = 3600
    state.dailyStudy['2026-01-01'] = 3600
    state.lastLessonId = 'm1l01'

    expect(saveState(state)).toBe(true)
    const loaded = loadState()
    expect(loaded.lessons.m1l01.completedAt).toBe('2026-01-01T10:00:00.000Z')
    expect(loaded.exercises.m1l01e1).toEqual({
      correct: true,
      attempts: 2,
      at: '2026-01-01T10:05:00.000Z',
    })
    expect(loaded.projects.p1.notes).toBe('minhas notas')
    expect(loaded.studySeconds).toBe(3600)
    expect(loaded.dailyStudy['2026-01-01']).toBe(3600)
    expect(loaded.lastLessonId).toBe('m1l01')
    expect(loaded.settings.theme).toBe('dark')
  })

  it('retorna o estado inicial quando não há nada salvo', () => {
    const s = loadState()
    expect(s.version).toBe(1)
    expect(Object.keys(s.lessons)).toHaveLength(0)
  })

  it('protege contra JSON corrompido no localStorage', () => {
    window.localStorage.setItem(KEY, '{isso não é json')
    const s = loadState()
    expect(s.version).toBe(1)
    expect(s.lessons).toEqual({})
  })

  it('ignora versões desconhecidas e dados de tipos errados', () => {
    const wrongVersion = JSON.stringify({ version: 99, lessons: { m1l01: {} } })
    window.localStorage.setItem(KEY, wrongVersion)
    expect(loadState().lessons).toEqual({})

    const wrongTypes = JSON.stringify({
      version: 1,
      lessons: 'não é objeto',
      exercises: null,
      activity: 'não é array',
      studySeconds: 'abc',
    })
    window.localStorage.setItem(KEY, wrongTypes)
    const s = loadState()
    expect(s.lessons).toEqual({})
    expect(s.activity).toEqual([])
    expect(s.studySeconds).toBe(0)
  })

  it('completa campos ausentes preservando os presentes (migrate)', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ version: 1, lessons: { m1l01: { completedAt: 'x' } } }),
    )
    const s = loadState()
    expect(s.lessons.m1l01).toEqual({ completedAt: 'x' })
    expect(s.settings.theme).toBe('dark')
    expect(s.activity).toEqual([])
  })

  it('saveState não lança mesmo quando o storage recusa (quota)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    try {
      expect(saveState(createInitialState())).toBe(false)
    } finally {
      spy.mockRestore()
    }
  })
})

describe('serializeState / parseImportedState (export/import)', () => {
  it('roundtrip export → import preserva o progresso', () => {
    const state = createInitialState()
    state.lessons.m1l01 = { completedAt: '2026-02-02T00:00:00.000Z' }
    state.exercises.m1l01e1 = { correct: false, attempts: 1, at: '2026-02-02T00:01:00.000Z' }
    state.settings.studentName = 'Ana'
    state.studySeconds = 500

    const exported = serializeState(state)
    const result = parseImportedState(exported)
    expect(result.ok).toBe(true)
    expect(result.state.lessons.m1l01.completedAt).toBe('2026-02-02T00:00:00.000Z')
    expect(result.state.exercises.m1l01e1.correct).toBe(false)
    expect(result.state.settings.studentName).toBe('Ana')
    expect(result.state.studySeconds).toBe(500)
    expect(result.stats.totalLessons).toBe(1)
    expect(result.stats.totalExercises).toBe(1)
  })

  it('o exportado carrega exportedAt mas o importado volta ao formato interno', () => {
    const exported = serializeState(createInitialState())
    expect(JSON.parse(exported).exportedAt).toBeTruthy()
    const result = parseImportedState(exported)
    expect(result.ok).toBe(true)
    expect(result.state.version).toBe(1)
  })

  it('recusa JSON inválido', () => {
    const r = parseImportedState('nada aqui')
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/JSON válido/)
  })

  it('recusa conteúdo que não é um objeto de progresso', () => {
    expect(parseImportedState('[1,2,3]').ok).toBe(false)
    expect(parseImportedState('"texto"').ok).toBe(false)
    expect(parseImportedState('null').ok).toBe(false)
  })

  it('recusa versão de dados diferente de 1', () => {
    const r = parseImportedState(JSON.stringify({ version: 2, lessons: {} }))
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/Versão/)
  })
})

describe('clearState', () => {
  it('remove a chave salva e devolve estado zerado', () => {
    const state = createInitialState()
    state.lessons.m1l01 = { completedAt: 'x' }
    saveState(state)
    const cleared = clearState()
    expect(window.localStorage.getItem(KEY)).toBeNull()
    expect(cleared.lessons).toEqual({})
    expect(cleared.studySeconds).toBe(0)
  })
})

describe('todayKey', () => {
  it('formata a data como YYYY-MM-DD com zeros à esquerda', () => {
    expect(todayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(todayKey(new Date(2026, 10, 23))).toBe('2026-11-23')
  })
})

describe('ACTIVITY_LIMIT', () => {
  it('define um limite de histórico que evita inflar o storage', () => {
    expect(ACTIVITY_LIMIT).toBeGreaterThan(0)
    expect(ACTIVITY_LIMIT).toBeLessThanOrEqual(500)
  })
})
