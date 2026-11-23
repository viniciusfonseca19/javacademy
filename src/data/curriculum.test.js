import { describe, it, expect } from 'vitest'
import {
  modules,
  lessonIndex,
  lessonsByModule,
  getModule,
  getLessonMeta,
  lessonPrereq,
  isModuleUnlocked,
  isLessonUnlocked,
} from './curriculum.js'

const ids = lessonIndex.map((l) => l.id)

describe('estrutura do currículo', () => {
  it('tem 7 módulos e 79 aulas', () => {
    expect(modules).toHaveLength(7)
    expect(lessonIndex).toHaveLength(79)
  })

  it('ids de aula são únicos e seguem o padrão mXlNN', () => {
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^m[1-7]l\d{2}$/)
  })

  it('ids de módulo são únicos e cobrem m1..m7', () => {
    expect(new Set(modules.map((m) => m.id)).size).toBe(7)
    expect(modules.map((m) => m.id)).toEqual(['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'])
  })

  it('cada aula referencia um módulo existente e tem metadados válidos', () => {
    for (const l of lessonIndex) {
      expect(getModule(l.moduleId)).toBeTruthy()
      expect(l.number).toBeGreaterThan(0)
      expect(l.title.length).toBeGreaterThan(5)
      expect(l.duration).toBeGreaterThan(0)
    }
  })

  it('os números das aulas são sequenciais dentro de cada módulo', () => {
    for (const m of modules) {
      const list = lessonsByModule(m.id)
      expect(list.length).toBeGreaterThan(0)
      list.forEach((l, i) => expect(l.number).toBe(i + 1))
    }
  })

  it('getLessonMeta encontra a aula e retorna undefined para id inexistente', () => {
    expect(getLessonMeta('m1l01').title).toContain('Introdução ao Java')
    expect(getLessonMeta('nao-existe')).toBeUndefined()
  })

  it('a distribuição de aulas por módulo está completa (13+13+14+12+10+9+8)', () => {
    expect(modules.map((m) => lessonsByModule(m.id).length)).toEqual([13, 13, 14, 12, 10, 9, 8])
  })
})

describe('lessonPrereq (cadeia de desbloqueio)', () => {
  it('a primeira aula do curso não tem pré-requisito', () => {
    expect(lessonPrereq('m1l01')).toBeNull()
  })

  it('dentro do módulo, a aula depende da anterior', () => {
    expect(lessonPrereq('m1l02')).toBe('m1l01')
    expect(lessonPrereq('m1l13')).toBe('m1l12')
    expect(lessonPrereq('m4l07')).toBe('m4l06')
  })

  it('a primeira aula de um módulo depende da última do módulo anterior', () => {
    expect(lessonPrereq('m2l01')).toBe('m1l13')
    expect(lessonPrereq('m3l01')).toBe('m2l13')
    expect(lessonPrereq('m7l01')).toBe('m6l09')
  })

  it('todo pré-requisito aponta para uma aula existente', () => {
    for (const l of lessonIndex) {
      const p = lessonPrereq(l.id)
      if (p) expect(ids).toContain(p)
    }
  })
})

describe('isModuleUnlocked (70% do módulo anterior)', () => {
  it('o módulo 1 é sempre liberado', () => {
    expect(isModuleUnlocked('m1', new Set())).toBe(true)
  })

  it('módulos 2..7 começam bloqueados', () => {
    for (const m of modules.slice(1)) {
      expect(isModuleUnlocked(m.id, new Set())).toBe(false)
    }
  })

  it('m2 desbloqueia ao concluir 70% do m1 (10 de 13 aulas)', () => {
    const m1Ids = lessonsByModule('m1').map((l) => l.id)
    const with9 = new Set(m1Ids.slice(0, 9))
    const with10 = new Set(m1Ids.slice(0, 10))
    expect(isModuleUnlocked('m2', with9)).toBe(false)
    expect(isModuleUnlocked('m2', with10)).toBe(true)
  })

  it('concluir o módulo anterior desbloqueia o próximo (m1→m2→…→m7)', () => {
    const done = new Set()
    for (let i = 0; i < modules.length - 1; i++) {
      const current = modules[i + 1]
      expect(isModuleUnlocked(current.id, done)).toBe(false)
      lessonsByModule(modules[i].id).forEach((l) => done.add(l.id))
      expect(isModuleUnlocked(current.id, done)).toBe(true)
    }
  })

  it('aulas de módulos não adjacentes não contam para o desbloqueio', () => {
    // Só m1 concluído não desbloqueia m3 (cujo pré-requisito é m2).
    const onlyM1 = new Set(lessonsByModule('m1').map((l) => l.id))
    expect(isModuleUnlocked('m3', onlyM1)).toBe(false)
  })
})

describe('isLessonUnlocked', () => {
  it('a primeira aula do curso está sempre liberada', () => {
    expect(isLessonUnlocked('m1l01', new Set())).toBe(true)
  })

  it('uma aula exige a conclusão da pré-requisitada', () => {
    expect(isLessonUnlocked('m1l02', new Set())).toBe(false)
    expect(isLessonUnlocked('m1l02', new Set(['m1l01']))).toBe(true)
  })

  it('a primeira aula de um módulo exige 70% do módulo anterior', () => {
    // Só a última aula do módulo 1 não basta: 1/13 < 70%.
    expect(isLessonUnlocked('m2l01', new Set(['m1l13']))).toBe(false)
    // 11 de 13 (incluindo a última aula) supera 70% e libera.
    const eleven = new Set(lessonsByModule('m1').map((l) => l.id).slice(2))
    expect(isLessonUnlocked('m2l01', eleven)).toBe(true)
  })

  it('freeMode libera tudo sem depender de progresso', () => {
    expect(isLessonUnlocked('m7l08', new Set(), true)).toBe(true)
    expect(isLessonUnlocked('m4l12', new Set(), true)).toBe(true)
  })

  it('id inexistente nunca é liberado', () => {
    expect(isLessonUnlocked('m9l99', new Set())).toBe(false)
  })

  it('libera uma trilha completa quando o progresso é percorrido em ordem', () => {
    const done = new Set()
    for (const l of lessonIndex) {
      expect(isLessonUnlocked(l.id, done)).toBe(true)
      done.add(l.id)
    }
  })
})
