import { Link, useLocation } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronDown,
  Lock,
  PlayCircle,
  Rocket,
  Target,
  Unlock,
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import { modules, lessonsByModule, isModuleUnlocked, isLessonUnlocked } from '../data/curriculum.js'
import { formatMinutes } from '../utils/text.js'
import ProgressBar from '../components/ProgressBar.jsx'
import { getLessonContent } from '../content/index.js'
import { useEffect, useState } from 'react'

export default function Trilha() {
  const { state, stats } = useProgress()
  const { hash } = useLocation()
  const completedSet = new Set(Object.keys(state.lessons))
  const [open, setOpen] = useState(() => {
    const first = stats.moduleStats.find((m) => !m.complete)
    return first ? first.id : 'm1'
  })

  // Rola até o módulo quando a rota traz uma âncora (ex.: /trilha#m3).
  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    setOpen(id)
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }, [hash])

  return (
    <div className="page page--narrow fade-in">
      <header className="page__header">
        <div className="page__eyebrow">Trilha de aprendizado</div>
        <h1 className="page__title">7 módulos, do zero à API em produção</h1>
        <p className="page__desc">
          Cada aula libera a próxima. O módulo seguinte é liberado quando você conclui 70% das aulas do
          anterior — e pode liberar tudo nas configurações, se preferir estudar sem ordem.
        </p>
      </header>

      <div className="track">
        {modules.map((m) => {
          const modStats = stats.moduleStats.find((s) => s.id === m.id)
          const unlocked = isModuleUnlocked(m.id, completedSet) || state.settings.freeMode
          const lessons = lessonsByModule(m.id)
          const isOpen = open === m.id
          const project = modStats.project

          return (
            <section
              className={`track-item${unlocked ? '' : ' track-item--locked'}`}
              key={m.id}
              id={m.id}
            >
              <div className="track-item__head">
                <span
                  className={`track-item__badge${
                    modStats.complete ? ' track-item__badge--done' : unlocked ? '' : ' track-item__badge--locked'
                  }`}
                >
                  {modStats.complete ? <CheckCircle2 size={22} /> : unlocked ? String(m.number).padStart(2, '0') : <Lock size={20} />}
                </span>

                <div className="track-item__info">
                  <h2 className="track-item__title">
                    Módulo {m.number} · {m.title}
                  </h2>
                  <p className="track-item__desc">{m.description}</p>
                  <div className="track-item__tags">
                    <span className="badge">{m.duration}</span>
                    <span className="badge">
                      {modStats.completedLessons}/{modStats.totalLessons} aulas
                    </span>
                    <span className={`badge ${modStats.exercisePercent >= 70 ? 'badge--success' : ''}`}>
                      {Math.round(modStats.exercisePercent)}% nos exercícios
                    </span>
                    {modStats.projectDone && <span className="badge badge--accent">projeto concluído</span>}
                    {!unlocked && <span className="badge badge--warn">módulo bloqueado</span>}
                  </div>
                  <div style={{ maxWidth: 420 }}>
                    <ProgressBar value={modStats.percent / 100} label="Progresso do módulo" />
                  </div>
                </div>

                <div className="module-row__actions">
                  {project && (
                    <Link className="btn btn--ghost" to={`/projetos/${project.id}`}>
                      <Rocket size={15} /> Projeto
                    </Link>
                  )}
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setOpen(isOpen ? null : m.id)}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Ocultar aulas' : 'Ver aulas'}
                    <ChevronDown size={15} style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>
              </div>

              {isOpen && (
                <ul className="lesson-list">
                  {lessons.map((lesson) => {
                    const done = Boolean(state.lessons[lesson.id])
                    const lessonUnlocked = isLessonUnlocked(lesson.id, completedSet, state.settings.freeMode)
                    const exIds = getLessonContent(lesson.id)?.exercises || []
                    const answered = exIds.filter((e) => state.exercises[e.id]?.correct).length
                    const score = exIds.length ? Math.round((answered / exIds.length) * 100) : null

                    return (
                      <li key={lesson.id}>
                        {lessonUnlocked ? (
                          <Link className="lesson-list__item" to={`/aula/${lesson.id}`}>
                            <span className="lesson-list__num">
                              {String(lesson.number).padStart(2, '0')}
                            </span>
                            <span className="lesson-list__title">{lesson.title}</span>
                            <span className="lesson-list__status">
                              {score !== null && score > 0 && (
                                <span className="lesson-list__score">{score}%</span>
                              )}
                              <span className="lesson-list__score">{formatMinutes(lesson.duration)}</span>
                              {done ? (
                                <CheckCircle2 size={17} color="var(--success)" />
                              ) : (
                                <PlayCircle size={17} color="var(--accent-strong)" />
                              )}
                            </span>
                          </Link>
                        ) : (
                          <span className="lesson-list__item lesson-list__item--locked">
                            <span className="lesson-list__num">
                              {String(lesson.number).padStart(2, '0')}
                            </span>
                            <span className="lesson-list__title">{lesson.title}</span>
                            <span className="lesson-list__status">
                              <Lock size={15} />
                            </span>
                          </span>
                        )}
                      </li>
                    )
                  })}
                  {project && (
                    <li>
                      <Link
                        className="lesson-list__item"
                        to={`/projetos/${project.id}`}
                        style={{ marginTop: 6, color: 'var(--accent-strong)' }}
                      >
                        <span className="lesson-list__num">P{m.number}</span>
                        <span className="lesson-list__title">
                          <strong>Projeto do módulo:</strong> {project.name}
                        </span>
                        <span className="lesson-list__status">
                          {modStats.projectDone ? (
                            <CheckCircle2 size={17} color="var(--success)" />
                          ) : (
                            <Target size={17} />
                          )}
                        </span>
                      </Link>
                    </li>
                  )}
                  {!unlocked && (
                    <li>
                      <span className="lesson-list__item lesson-list__item--locked">
                        <Unlock size={15} />
                        <span className="lesson-list__title">
                          Conclua 70% das aulas do módulo anterior para liberar este módulo.
                        </span>
                      </span>
                    </li>
                  )}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
