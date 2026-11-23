/**
 * Gera a estrutura de conteúdo:
 *  - stubs para aulas que ainda não foram escritas (sobrescritos depois);
 *  - src/content/mX/index.js (agrupa aulas + projeto do módulo);
 *  - src/content/index.js (agregado geral para a aplicação).
 *
 * Uso: node scripts/init-content.mjs
 */
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = join(root, 'src', 'content')

// Lê o índice do currículo (mesmo arquivo usado pelo app) sem depender de build.
const curriculumSrc = readFileSync(join(root, 'src', 'data', 'curriculum.js'), 'utf8')
const moduleIds = [...curriculumSrc.matchAll(/id: '(m[1-7])'/g)].map((m) => m[1])
const lessonIndex = [...curriculumSrc.matchAll(/\{ id: '(m\d+l\d+)', moduleId: '(m\d)', number: (\d+), title: '([^']+)', duration: (\d+) \}/g)].map(
  (m) => ({ id: m[1], moduleId: m[2], number: Number(m[3]), title: m[4].replace(/\\'/g, "'"), duration: Number(m[5]) }),
)

if (lessonIndex.length === 0) {
  console.error('Nenhuma aula encontrada em src/data/curriculum.js')
  process.exit(1)
}

const lessonFile = (id) => `lesson${id.slice(id.lastIndexOf('l') + 1)}.js`

for (const moduleId of moduleIds) {
  const dir = join(contentDir, moduleId)
  mkdirSync(dir, { recursive: true })
  const lessons = lessonIndex.filter((l) => l.moduleId === moduleId)

  for (const lesson of lessons) {
    const file = join(dir, lessonFile(lesson.id))
    if (existsSync(file)) continue
    const stub = `// STUB PENDENTE — este arquivo será substituído pela aula completa.
// Ver CONTENT_SPEC.md para o formato exigido.
export default {
  id: '${lesson.id}',
  moduleId: '${lesson.moduleId}',
  number: ${lesson.number},
  title: ${JSON.stringify(lesson.title)},
  durationMinutes: ${lesson.duration},
  objectives: [],
  prerequisites: [],
  intro: [],
  theory: [],
  commonMistakes: [],
  bestPractices: [],
  summary: [],
  exercises: [],
  challenge: null,
}
`
    writeFileSync(file, stub, 'utf8')
    console.log(`stub: ${moduleId}/${lessonFile(lesson.id)}`)
  }

  const projectFile = join(dir, 'project.js')
  if (!existsSync(projectFile)) {
    writeFileSync(
      projectFile,
      `// STUB PENDENTE — projeto do módulo ainda não escrito.
export default {
  id: 'p${moduleId.slice(1)}',
  moduleId: '${moduleId}',
  name: 'Projeto pendente',
  tagline: '',
  context: '',
  objective: '',
  description: [],
  functionalRequirements: [],
  technicalRequirements: [],
  businessRules: [],
  suggestedStructure: { lang: 'plaintext', code: '' },
  steps: [],
  evaluationCriteria: [],
  checklist: [],
  extraChallenges: [],
  hints: [],
  solution: [],
}
`,
      'utf8',
    )
    console.log(`stub: ${moduleId}/project.js`)
  }

  const imports = lessons
    .map((l) => `import ${l.id} from './${lessonFile(l.id).replace('.js', '')}.js'`)
    .join('\n')
  const list = lessons.map((l) => `  ${l.id},`).join('\n')
  const index = `${imports}
import project from './project.js'

// Conteúdo do módulo ${moduleId} — gerado por scripts/init-content.mjs.
export default {
  id: '${moduleId}',
  lessons: [
${list}
  ],
  project,
}
`
  writeFileSync(join(dir, 'index.js'), index, 'utf8')
}

const topImports = moduleIds.map((id) => `import ${id} from './${id}/index.js'`).join('\n')
const topContent = `${topImports}

// Agregado de todo o conteúdo pedagógico (aulas, exercícios e projetos).
export const modulesContent = [${moduleIds.join(', ')}]

export const allLessons = modulesContent.flatMap((m) => m.lessons)

export const allProjects = modulesContent.map((m) => m.project).filter(Boolean)

export const allExercises = allLessons.flatMap((lesson) => [
  ...(lesson.exercises || []).map((e) => e.id),
  ...(lesson.challenge ? [lesson.challenge.id] : []),
])

export function getLessonContent(lessonId) {
  return allLessons.find((l) => l.id === lessonId) || null
}

export function getProjectContent(projectId) {
  return allProjects.find((p) => p.id === projectId) || null
}
`
writeFileSync(join(contentDir, 'index.js'), topContent, 'utf8')

console.log(`\nOK: ${lessonIndex.length} aulas indexadas em 7 módulos.`)
