import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  PlayCircle,
  Rocket,
  Target,
  Trophy,
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import { formatStudyTime } from '../services/gamification.js'
import { lessonIndex, modules, isLessonUnlocked } from '../data/curriculum.js'
import { getLessonContent } from '../content/index.js'
import { greeting, formatMinutes } from '../utils/text.js'
import ProgressBar from '../components/ProgressBar.jsx'

function ProgressRing({ percent }) {
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="progress-ring" aria-hidden="true">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="9" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * percent) / 100}
          transform="rotate(-90 48 48)"
          style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <span className="progress-ring__value">{Math.round(percent)}%</span>
    </div>
  )
}

export default function Dashboard() {
  const { state, stats } = useProgress()
  const completedSet = new Set(Object.keys(state.lessons))

  const lastLesson = state.lastLessonId
    ? lessonIndex.find((l) => l.id === state.lastLessonId) || null
    : null
  const nextLesson = lessonIndex.find((l) => !completedSet.has(l.id)) || null
  const resume = lastLesson || nextLesson

  // Próxima atividade: exercícios pendentes da última aula ou a próxima aula.
  const resumeContent = resume ? getLessonContent(resume.id) : null
  const pendingExercises = resumeContent
    ? (resumeContent.exercises || []).filter((e) => !state.exercises[e.id]).length
    : 0
  const lastLessonIncomplete = lastLesson && !completedSet.has(lastLesson.id)
  const nextActivity = lastLessonIncomplete
    ? {
        label: 'Exercícios pendentes',
        lesson: lastLesson,
        detail:
          pendingExercises > 0
            ? `${pendingExercises} questão(ões) em aberto`
            : 'falta marcar a aula como concluída',
      }
    : nextLesson
      ? { label: 'Próxima aula', lesson: nextLesson, detail: nextLesson.title }
      : null

  const unlockedNext = nextLesson
    ? isLessonUnlocked(nextLesson.id, completedSet, state.settings.freeMode)
    : false

  return (
    <div className="page fade-in">
      <header className="page__header hello">
        <div>
          <div className="page__eyebrow">{greeting()}</div>
          <h1 className="hello__title">
            {state.settings.studentName ? `Bom te ver de novo, ${state.settings.studentName}` : 'Bem-vindo à Java Academy'}
          </h1>
          <p className="hello__sub">
            {stats.completedLessons === 0
              ? 'Comece pela trilha de aprendizado e conclua sua primeira aula hoje.'
              : `Você já concluiu ${stats.completedLessons} de ${stats.totalLessons} aulas. Continue de onde parou.`}
          </p>
        </div>
        <div className="hello__time">
          <Clock size={15} />
          {formatStudyTime(stats.studySeconds)} de estudo
        </div>
      </header>

      <div className="stack" style={{ gap: 'var(--sp-5)' }}>
        <section className="progress-hero" aria-label="Progresso geral">
          <div className="progress-hero__top">
            <ProgressRing percent={stats.overallPercent} />
            <div className="progress-hero__info">
              <h2>Progresso da formação</h2>
              <p>
                {stats.completedLessons} aulas concluídas · {stats.modulesComplete}/{stats.totalModules} módulos
                finalizados · {stats.projectsDone}/{stats.totalProjects} projetos entregues
              </p>
              <div style={{ marginTop: 12, maxWidth: 420 }}>
                <ProgressBar value={stats.overallPercent / 100} label="Aulas do curso" />
              </div>
            </div>
          </div>
        </section>

        {resume && (
          <section className="resume-card" aria-label="Continuar estudando">
            <span className="resume-card__icon" aria-hidden="true">
              <PlayCircle size={22} />
            </span>
            <div className="resume-card__body">
              <div className="resume-card__label">
                {lastLessonIncomplete ? 'Continue de onde parou' : 'Comece agora'}
              </div>
              <div className="resume-card__title">
                Aula {resume.number} · {resume.title}
              </div>
              <div className="text-sm muted">
                {modules.find((m) => m.id === resume.moduleId)?.title} · {formatMinutes(resume.duration)}
                {lastLessonIncomplete ? ` · ${pendingExercises} exercício(s) em aberto` : ''}
              </div>
            </div>
            <Link className="btn btn--primary" to={`/aula/${resume.id}`}>
              {lastLessonIncomplete ? 'Retomar aula' : 'Abrir aula'} <ArrowRight size={16} />
            </Link>
          </section>
        )}

        <section className="grid grid--4" aria-label="Estatísticas">
          <div className="stat">
            <span className="stat__icon">
              <BookOpen size={17} />
            </span>
            <span className="stat__value">
              {stats.completedLessons}
              <span className="muted" style={{ fontSize: 'var(--fs-lg)' }}>/{stats.totalLessons}</span>
            </span>
            <span className="stat__label">Aulas concluídas</span>
          </div>
          <div className="stat">
            <span className="stat__icon">
              <Target size={17} />
            </span>
            <span className="stat__value">{Math.round(stats.exerciseAccuracy)}%</span>
            <span className="stat__label">
              Exercícios corretos ({stats.correctExercises}/{stats.totalExercises})
            </span>
          </div>
          <div className="stat">
            <span className="stat__icon">
              <Flame size={17} />
            </span>
            <span className="stat__value">{stats.streak}</span>
            <span className="stat__label">{stats.streak === 1 ? 'dia seguido' : 'dias seguidos'}</span>
          </div>
          <div className="stat">
            <span className="stat__icon">
              <Clock size={17} />
            </span>
            <span className="stat__value" style={{ fontSize: 'var(--fs-xl)' }}>
              {formatStudyTime(stats.todaySeconds)}
            </span>
            <span className="stat__label">Estudado hoje</span>
          </div>
        </section>

        {nextActivity && (
          <section aria-label="Próxima atividade">
            <h2 className="section-title">
              <ArrowRight size={18} /> Próxima atividade
            </h2>
            <div className="module-row">
              <span className="module-row__num">
                {String(nextActivity.lesson.number).padStart(2, '0')}
              </span>
              <div className="module-row__body">
                <span className="module-row__title">{nextActivity.lesson.title}</span>
                <span className="module-row__meta">
                  <span>{nextActivity.label}</span>
                  <span>·</span>
                  <span>{nextActivity.detail}</span>
                  <span>·</span>
                  <span>{formatMinutes(nextActivity.lesson.duration)}</span>
                  {!unlockedNext && <span>· libere concluindo a anterior</span>}
                </span>
              </div>
              <div className="module-row__actions">
                <Link className={`btn ${unlockedNext ? 'btn--primary' : ''}`} to={`/aula/${nextActivity.lesson.id}`}>
                  {unlockedNext ? 'Abrir' : 'Ver pré-requisito'}
                </Link>
              </div>
            </div>
          </section>
        )}

        <section aria-label="Resumo dos módulos">
          <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              <Rocket size={18} /> Módulos
            </h2>
            <Link className="btn btn--ghost" to="/trilha">
              Ver trilha completa <ArrowRight size={15} />
            </Link>
          </div>
          <div className="stack" style={{ gap: 'var(--sp-3)' }}>
            {stats.moduleStats.map((m) => (
              <div className="module-row" key={m.id}>
                <span className={`module-row__num${m.complete ? ' module-row__num--done' : ''}`}>
                  {m.complete ? <CheckCircle2 size={18} /> : String(m.number).padStart(2, '0')}
                </span>
                <div className="module-row__body">
                  <span className="module-row__title">{m.title}</span>
                  <span className="module-row__meta">
                    <span>
                      {m.completedLessons}/{m.totalLessons} aulas
                    </span>
                    <span>·</span>
                    <span>{m.duration}</span>
                    {m.projectDone && (
                      <>
                        <span>·</span>
                        <span style={{ color: 'var(--success)' }}>projeto concluído</span>
                      </>
                    )}
                  </span>
                  <div style={{ maxWidth: 320 }}>
                    <ProgressBar value={m.percent / 100} />
                  </div>
                </div>
                <div className="module-row__actions">
                  <Link className="btn btn--ghost" to={`/trilha#${m.id}`}>
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Conquistas">
          <div className="row-between" style={{ marginBottom: 'var(--sp-4)' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              <Trophy size={18} /> Conquistas
            </h2>
            <Link className="btn btn--ghost" to="/desempenho">
              Ver desempenho <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid--3">
            {[
              { id: 'first-lesson', label: 'Primeira aula concluída', icon: BookOpen },
              { id: 'first-exercise', label: 'Primeiro exercício resolvido', icon: Target },
              { id: 'ten-lessons', label: '10 aulas concluídas', icon: Award },
            ].map(({ id, label, icon: Icon }) => {
              const done = Boolean(state.achievements[id])
              return (
                <div className={`achievement${done ? '' : ' achievement--locked'}`} key={id}>
                  <span className="achievement__icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="achievement__title">{label}</div>
                    <div className="achievement__desc">{done ? 'Desbloqueada' : 'Ainda não desbloqueada'}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
