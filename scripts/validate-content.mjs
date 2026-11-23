/**
 * Valida todo o conteúdo pedagógico contra as regras de CONTENT_SPEC.md.
 *
 * Uso: npm run validate
 * Sai com código 1 se houver qualquer erro.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const errors = []
const warnings = []
const err = (where, msg) => errors.push(`[${where}] ${msg}`)
const warn = (where, msg) => warnings.push(`[${where}] ${msg}`)

const BLOCK_TYPES = new Set(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'code', 'note', 'table', 'quote', 'divider'])
const EX_TYPES = new Set(['mc', 'tf', 'code', 'short'])
const LANGS = new Set(['java', 'xml', 'json', 'sql', 'bash', 'dockerfile', 'yaml', 'properties', 'plaintext'])
const NOTE_KINDS = new Set(['info', 'tip', 'warn', 'danger'])
const PLACEHOLDER = /STUB PENDENTE|FIXME|lorem ipsum|aqui você aprenderá/i

// ---------- carrega currículo e conteúdo (arquivo a arquivo) ----------
const { lessonIndex, modules } = await import('../src/data/curriculum.js')

const toPath = (rel) => new URL(`../src/content/${rel}`, import.meta.url).href

async function safeImport(rel) {
  try {
    return await import(toPath(rel))
  } catch (e) {
    err(rel, `falha ao importar o arquivo: ${e.message.split('\n')[0]}`)
    return null
  }
}

const lessons = []
for (const meta of lessonIndex) {
  const file = `${meta.moduleId}/lesson${meta.id.slice(meta.id.lastIndexOf('l') + 1)}.js`
  const mod = await safeImport(file)
  if (mod?.default) lessons.push(mod.default)
}

const projects = []
for (const mod of modules) {
  const modContent = await safeImport(`${mod.id}/project.js`)
  if (modContent?.default) projects.push(modContent.default)
}

const lessonsById = new Map(lessons.map((l) => [l.id, l]))
const projectsById = new Map(projects.map((p) => [p.id, p]))

function checkBlocks(blocks, where, opts = {}) {
  const { min = 0, needCode = 0, needH2 = 0, label = 'blocos' } = opts
  if (!Array.isArray(blocks)) {
    err(where, `${label} deve ser um array`)
    return { code: 0, h2: 0, chars: 0 }
  }
  if (blocks.length < min) err(where, `${label}: ${blocks.length} encontrados, mínimo ${min}`)
  let code = 0
  let h2 = 0
  let chars = 0
  blocks.forEach((b, i) => {
    const at = `${where} ${label}[${i}]`
    if (!b || typeof b !== 'object') return err(at, 'bloco inválido')
    if (!BLOCK_TYPES.has(b.t)) return err(at, `tipo desconhecido: "${b.t}"`)
    switch (b.t) {
      case 'p':
      case 'quote':
      case 'h2':
      case 'h3':
      case 'h4':
        if (typeof b.text !== 'string' || !b.text.trim()) return err(at, 'text vazio')
        chars += b.text.length
        break
      case 'ul':
      case 'ol':
        if (!Array.isArray(b.items) || b.items.length < 1) return err(at, 'items vazio')
        else b.items.forEach((it, j) => {
          if (typeof it !== 'string' || !it.trim()) err(`${at}.items[${j}]`, 'item vazio')
          else chars += it.length
        })
        break
      case 'code':
        code++
        if (typeof b.code !== 'string' || !b.code.trim()) return err(at, 'code vazio')
        chars += b.code.length
        if (!b.lang || !LANGS.has(b.lang)) err(at, `lang inválida: "${b.lang}"`)
        if (b.code.includes('...') && !/fragmento/i.test(b.caption || '')) {
          warn(at, 'código com "..." — garanta que o contexto está claro')
        }
        break
      case 'note':
        if (!NOTE_KINDS.has(b.kind)) err(at, `kind inválido: "${b.kind}"`)
        if (typeof b.text !== 'string' || !b.text.trim()) err(at, 'note sem texto')
        if (b.title !== undefined && typeof b.title !== 'string') err(at, 'title inválido')
        chars += (b.text || '').length
        break
      case 'table':
        if (!Array.isArray(b.headers) || b.headers.length < 1) err(at, 'headers ausentes')
        if (!Array.isArray(b.rows) || b.rows.length < 1) err(at, 'rows ausentes')
        else b.rows.forEach((row, r) => {
          if (!Array.isArray(row)) return err(`${at}.rows[${r}]`, 'linha inválida')
          if (b.headers && row.length !== b.headers.length) {
            err(`${at}.rows[${r}]`, `tem ${row.length} células, headers têm ${b.headers.length}`)
          }
          row.forEach((c, ci) => {
            if (typeof c !== 'string') err(`${at}.rows[${r}][${ci}]`, 'célula não é texto')
            else chars += c.length
          })
        })
        break
      case 'divider':
        break
      default:
        break
    }
  })
  if (code < needCode) err(where, `${label}: ${code} blocos de código, mínimo ${needCode}`)
  if (h2Count(blocks) < needH2) err(where, `${label}: ${h2Count(blocks)} títulos h2, mínimo ${needH2}`)
  return { code, h2, chars }
}

function h2Count(blocks) {
  return Array.isArray(blocks) ? blocks.filter((b) => b && b.t === 'h2').length : 0
}

function checkText(text, where, { min = 0 } = {}) {
  if (typeof text !== 'string' || !text.trim()) return err(where, 'texto ausente')
  if (text.trim().length < min) err(where, `texto curto demais (${text.trim().length} < ${min})`)
  if (PLACEHOLDER.test(text)) err(where, 'texto com placeholder/preenchimento')
  return text.length
}

// ---------- aulas ----------
const seenExerciseIds = new Set()
const seenLessonIds = new Set()
let totalExercises = 0

for (const meta of lessonIndex) {
  const where = meta.id
  const lesson = lessonsById.get(meta.id)

  if (!lesson) {
    err(where, 'aula não encontrada no conteúdo')
    continue
  }
  if (seenLessonIds.has(meta.id)) err(where, 'id de aula duplicado')
  seenLessonIds.add(meta.id)

  if (lesson.id !== meta.id) err(where, `id "${lesson.id}" difere do currículo`)
  if (lesson.moduleId !== meta.moduleId) err(where, 'moduleId divergente')
  if (lesson.number !== meta.number) err(where, `number ${lesson.number} != ${meta.number}`)
  if (lesson.title !== meta.title) err(where, `title difere: "${lesson.title}"`)
  if (lesson.durationMinutes !== meta.duration) err(where, `durationMinutes ${lesson.durationMinutes} != ${meta.duration}`)

  const source = readFileSync(join(root, 'src', 'content', meta.moduleId, `lesson${meta.id.slice(meta.id.lastIndexOf('l') + 1)}.js`), 'utf8')
  if (PLACEHOLDER.test(source)) err(where, 'arquivo ainda é um stub/contém placeholder')

  if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 3) err(where, `objectives: mínimo 3 (tem ${lesson.objectives?.length ?? 0})`)
  if (!Array.isArray(lesson.prerequisites) || lesson.prerequisites.length < 3) err(where, `prerequisites: mínimo 3 (tem ${lesson.prerequisites?.length ?? 0})`)

  checkBlocks(lesson.intro, where, { min: 3, label: 'intro' })
  checkBlocks(lesson.theory, where, { min: 12, needCode: 3, needH2: 2, label: 'theory' })
  checkBlocks(lesson.summary, where, { min: 3, label: 'summary' })

  if (!Array.isArray(lesson.commonMistakes) || lesson.commonMistakes.length < 3) {
    err(where, `commonMistakes: mínimo 3 (tem ${lesson.commonMistakes?.length ?? 0})`)
  } else {
    lesson.commonMistakes.forEach((m, i) => {
      checkText(m?.title, `${where} commonMistakes[${i}].title`, { min: 8 })
      checkText(m?.text, `${where} commonMistakes[${i}].text`, { min: 40 })
    })
  }

  if (!Array.isArray(lesson.bestPractices) || lesson.bestPractices.length < 3) {
    err(where, `bestPractices: mínimo 3 (tem ${lesson.bestPractices?.length ?? 0})`)
  } else {
    lesson.bestPractices.forEach((m, i) => {
      checkText(m?.title, `${where} bestPractices[${i}].title`, { min: 8 })
      checkText(m?.text, `${where} bestPractices[${i}].text`, { min: 40 })
    })
  }

  // exercícios
  const exercises = lesson.exercises || []
  totalExercises += exercises.length
  if (exercises.length < 4 || exercises.length > 6) {
    err(where, `exercises: ${exercises.length} (mínimo 4, máximo 6)`)
  }
  const types = new Set()
  exercises.forEach((ex, i) => {
    const at = `${where} exercises[${i}]`
    if (!ex || typeof ex !== 'object') return err(at, 'exercício inválido')
    if (!ex.id || !ex.id.startsWith(`${meta.id}e`)) err(at, `id "${ex.id}" deve começar com "${meta.id}e"`)
    if (seenExerciseIds.has(ex.id)) err(at, `id duplicado: ${ex.id}`)
    seenExerciseIds.add(ex.id)
    if (!EX_TYPES.has(ex.type)) return err(at, `type inválido: "${ex.type}"`)
    types.add(ex.type)
    checkText(ex.question, `${at}.question`, { min: 15 })
    checkText(ex.explanation, `${at}.explanation`, { min: 30 })

    if (ex.type === 'mc' || ex.type === 'code') {
      if (!Array.isArray(ex.options) || ex.options.length < 3) err(at, 'options: mínimo 3 alternativas')
      else if (ex.options.length > 5) err(at, 'options: máximo 5 alternativas')
      if (!Number.isInteger(ex.answer) || ex.answer < 0 || ex.answer >= (ex.options?.length ?? 0)) {
        err(at, `answer ${ex.answer} fora das alternativas`)
      }
      if (ex.type === 'code') {
        if (typeof ex.code !== 'string' || !ex.code.trim()) err(at, 'exercício code sem campo code')
        if (ex.lang && !LANGS.has(ex.lang)) err(at, `lang inválida: "${ex.lang}"`)
      }
    } else if (ex.type === 'tf') {
      if (typeof ex.answer !== 'boolean') err(at, 'answer deve ser boolean')
    } else if (ex.type === 'short') {
      if (!Array.isArray(ex.keywords) || ex.keywords.length < 2) err(at, 'keywords: mínimo 2 grupos')
      else ex.keywords.forEach((g, gi) => {
        const arr = Array.isArray(g) ? g : [g]
        if (arr.length < 1 || arr.some((k) => typeof k !== 'string' || !k.trim())) {
          err(`${at}.keywords[${gi}]`, 'grupo inválido')
        }
      })
      checkText(ex.answerText, `${at}.answerText`, { min: 15 })
    }
  })
  if (!types.has('code')) err(where, 'exercícios: falta pelo menos 1 type "code"')
  if (!types.has('short')) err(where, 'exercícios: falta pelo menos 1 type "short"')

  // desafio
  const ch = lesson.challenge
  if (!ch) {
    err(where, 'desafio ausente')
  } else {
    const at = `${where} challenge`
    if (ch.id !== `${meta.id}c1`) err(at, `id "${ch.id}" deve ser "${meta.id}c1"`)
    checkText(ch.title, `${at}.title`, { min: 5 })
    checkText(ch.fileName, `${at}.fileName`, { min: 3 })
    checkText(ch.prompt, `${at}.prompt`, { min: 60 })
    if (typeof ch.starterCode !== 'string' || !ch.starterCode.trim()) err(at, 'starterCode ausente')
    if (!Array.isArray(ch.criteria) || ch.criteria.length < 4) {
      err(at, `criteria: mínimo 4 (tem ${ch.criteria?.length ?? 0})`)
    } else {
      ch.criteria.forEach((c, i) => checkText(c, `${at}.criteria[${i}]`, { min: 15 }))
    }
    checkBlocks(ch.modelSolution, at, { min: 2, needCode: 1, label: 'modelSolution' })
  }
}

// ---------- projetos ----------
for (const mod of modules) {
  const p = projectsById.get(mod.project)
  const where = `projeto ${mod.project}`
  if (!p) {
    err(where, 'projeto não encontrado')
    continue
  }
  const source = readFileSync(join(root, 'src', 'content', mod.id, 'project.js'), 'utf8')
  if (PLACEHOLDER.test(source)) err(where, 'arquivo ainda é um stub/contém placeholder')

  if (p.moduleId !== mod.id) err(where, 'moduleId divergente')
  checkText(p.name, `${where}.name`, { min: 8 })
  checkText(p.tagline, `${where}.tagline`, { min: 15 })
  checkText(p.context, `${where}.context`, { min: 80 })
  checkText(p.objective, `${where}.objective`, { min: 30 })
  checkBlocks(p.description, where, { min: 4, needCode: 1, label: 'description' })

  const arrays = [
    ['functionalRequirements', 6],
    ['technicalRequirements', 5],
    ['businessRules', 4],
    ['steps', 5],
    ['checklist', 8],
    ['extraChallenges', 3],
    ['hints', 4],
  ]
  for (const [key, min] of arrays) {
    const arr = p[key]
    if (!Array.isArray(arr) || arr.length < min) {
      err(where, `${key}: mínimo ${min} (tem ${Array.isArray(arr) ? arr.length : 0})`)
    } else {
      arr.forEach((item, i) => checkText(item, `${where}.${key}[${i}]`, { min: 10 }))
    }
  }

  if (!p.suggestedStructure || typeof p.suggestedStructure.code !== 'string' || !p.suggestedStructure.code.trim()) {
    err(where, 'suggestedStructure ausente')
  }

  const evals = p.evaluationCriteria
  if (!Array.isArray(evals) || evals.length < 3) err(where, 'evaluationCriteria: mínimo 3')
  else {
    const sum = evals.reduce((s, e) => s + (Number(e.weight) || 0), 0)
    if (sum !== 100) err(where, `evaluationCriteria soma ${sum}, deveria ser 100`)
    evals.forEach((e, i) => checkText(e.criterion, `${where}.evaluationCriteria[${i}].criterion`, { min: 10 }))
  }

  checkBlocks(p.solution, where, { min: 3, needCode: 1, label: 'solution' })
}

// ---------- relatório ----------
const stubCount = lessons.filter((l) => (l.objectives || []).length === 0).length
const filter = process.argv[2] || null
const match = (s) => !filter || s.includes(filter)
const shownErrors = errors.filter(match)
const shownWarnings = warnings.filter(match)

console.log('──────────────────────────────────────────────')
console.log(' Java Academy — validação de conteúdo')
console.log('──────────────────────────────────────────────')
console.log(` Módulos........ ${modules.length}`)
console.log(` Aulas.......... ${lessons.length} (${lessonIndex.length} no currículo)`)
console.log(` Exercícios..... ${totalExercises} (+ ${lessons.filter((l) => l.challenge).length} desafios)`)
console.log(` Projetos....... ${projects.length}`)
if (stubCount > 0) console.log(` AULAS PENDENTES ${stubCount}`)
console.log('──────────────────────────────────────────────')

if (shownWarnings.length) {
  console.log(`\n⚠ ${shownWarnings.length} aviso(s):`)
  shownWarnings.slice(0, 40).forEach((w) => console.log('  · ' + w))
}

if (shownErrors.length) {
  console.log(`\n✖ ${shownErrors.length} erro(s)${filter ? ` (filtro: "${filter}")` : ''}:`)
  shownErrors.slice(0, 200).forEach((e) => console.log('  · ' + e))
  if (shownErrors.length > 200) console.log(`  ... e mais ${shownErrors.length - 200}`)
  process.exit(1)
}

console.log(`\n✔ Conteúdo íntegro${filter ? ` (filtro: "${filter}")` : ''}. Todas as regras atendidas.`)
