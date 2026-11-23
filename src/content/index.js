import m1 from './m1/index.js'
import m2 from './m2/index.js'
import m3 from './m3/index.js'
import m4 from './m4/index.js'
import m5 from './m5/index.js'
import m6 from './m6/index.js'
import m7 from './m7/index.js'

// Agregado de todo o conteúdo pedagógico (aulas, exercícios e projetos).
export const modulesContent = [m1, m2, m3, m4, m5, m6, m7]

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
