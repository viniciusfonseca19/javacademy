import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Crosshair, Percent, Target, History } from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import { lessonIndex, modules } from '../data/curriculum.js'
import { getLessonContent } from '../content/index.js'
import { formatDateTime } from '../utils/text.js'
import ProgressBar from '../components/ProgressBar.jsx'

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'pending', label: 'Sem iniciar' },
  { id: 'progress', label: 'Em andamento' },
  { id: 'done', label: 'Atingiu 70%' },
]

export default function Exercicios() {
  const { state, stats } = useProgress()
  const [filter, setFilter] = useState('all')

  const rows = useMemo(() => {
    return lessonIndex
      .map((meta) => {
        const content = getLessonContent(meta.id)
        const ids = [
          ...(content?.exercises || []).map((e) => e.id),
          ...(content?.challenge ? [content.challenge.id] : []),
        ]
        const answered = ids.filter((id) => state.exercises[id]).length
        const correct = ids.filter((id) => state.exercises[id]?.correct).length
        const score = ids.length ? (correct / ids.length) * 100 : 0
        const status = answered === 0 ? 'pending' : score >= 70 ? 'done' : 'progress'
        return { meta, content, answered, total: ids.length, correct, score, status }
      })
      .filter((r) => r.total > 0)
  }, [state.exercises])

  const visible = rows.filter((r) => filter === 'all' || r.status === filter)

  const recent = useMemo(() => {
    return (state.activity || [])
      .filter((a) => a.type === 'exercise' || a.type === 'lesson' || a.type === 'challenge')
      .slice(0, 12)
  }, [state.activity])

  const byModule = modules.map((m) => {
    const lessons = rows.filter((r) => r.meta.moduleId === m.id)
    const answered = lessons.reduce((s, r) => s + r.answered, 0)
    const correct = lessons.reduce((s, r) => s + r.correct, 0)
    return { m, answered, correct, pct: answered ? (correct / answered) * 100 : 0 }
  })

  return (
    <div className="page page--narrow fade-in">
      <header className="page__header">
        <div className="page__eyebrow">Exercícios</div>
        <h1 className="page__title">Questões e correções</h1>
        <p className="page__desc">
          Todos os exercícios do curso em um só lugar. A correção é automática, você pode refazer
          quantas vezes quiser e a melhor pontuação de cada questão é mantida.
        </p>
      </header>

      <div className="grid grid--4" style={{ marginBottom: 'var(--sp-5)' }}>
        <div className="stat">
          <span className="stat__icon">
            <Target size={17} />
          </span>
          <span className="stat__value">
            {stats.answeredExercises}
            <span className="muted" style={{ fontSize: 'var(--fs-lg)' }}>/{stats.totalExercises}</span>
          </span>
          <span className="stat__label">Questões respondidas</span>
        </div>
        <div className="stat">
          <span className="stat__icon">
            <CheckCircle2 size={17} />
          </span>
          <span className="stat__value">{stats.correctExercises}</span>
          <span className="stat__label">Respostas corretas</span>
        </div>
        <div className="stat">
          <span className="stat__icon">
            <Crosshair size={17} />
          </span>
          <span className="stat__value">{Math.round(stats.exerciseAccuracy)}%</span>
          <span className="stat__label">Aproveitamento geral</span>
        </div>
        <div className="stat">
          <span className="stat__icon">
            <Percent size={17} />
          </span>
          <span className="stat__value">{Math.round(stats.exerciseHitRate)}%</span>
          <span className="stat__label">Acerto por questão respondida</span>
        </div>
      </div>

      <section style={{ marginBottom: 'var(--sp-5)' }}>
        <h2 className="section-title">Por módulo</h2>
        <div className="chart-bars">
          {byModule.map(({ m, answered, pct }) => (
            <div className="chart-bar" key={m.id}>
              <span className="chart-bar__label">
                {m.number}. {m.shortTitle}
              </span>
              <div className="chart-bar__track">
                <div
                  className={`chart-bar__fill${pct >= 70 ? ' chart-bar__fill--success' : pct > 0 ? ' chart-bar__fill--warn' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="chart-bar__value">{answered ? `${Math.round(pct)}%` : '—'}</span>
            </div>
          ))}
        </div>
        <p className="text-sm muted" style={{ marginTop: 10 }}>
          {stats.correctExercises} corretas de {stats.totalExercises} questões do curso.
        </p>
      </section>

      <section style={{ marginBottom: 'var(--sp-5)' }}>
        <div className="row-between" style={{ marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Questões por aula
          </h2>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`btn ${filter === f.id ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="stack" style={{ gap: 'var(--sp-3)' }}>
          {visible.length === 0 && (
            <div className="empty">
              <Target size={34} />
              <p className="empty__title">Nenhuma aula neste filtro</p>
              <p>Troque o filtro acima para ver outras aulas.</p>
            </div>
          )}
          {visible.map(({ meta, answered, total, correct, score, status }) => (
            <div className="module-row" key={meta.id}>
              <span className="module-row__num">
                {String(meta.number).padStart(2, '0')}
              </span>
              <div className="module-row__body">
                <span className="module-row__title">{meta.title}</span>
                <span className="module-row__meta">
                  <span>{modules.find((m) => m.id === meta.moduleId)?.shortTitle}</span>
                  <span>·</span>
                  <span>
                    {correct}/{total} corretas · {answered}/{total} respondidas
                  </span>
                  {status === 'done' && (
                    <>
                      <span>·</span>
                      <span style={{ color: 'var(--success)' }}>70% atingido</span>
                    </>
                  )}
                </span>
                <div style={{ maxWidth: 300 }}>
                  <ProgressBar value={score / 100} />
                </div>
              </div>
              <div className="module-row__actions">
                <Link className="btn btn--ghost" to={`/aula/${meta.id}#exercicios`}>
                  Responder <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">
          <History size={18} /> Histórico de atividades
        </h2>
        {recent.length === 0 ? (
          <div className="empty">
            <History size={34} />
            <p className="empty__title">Sem atividades registradas</p>
            <p>Conclua aulas e resolva exercícios para montar seu histórico.</p>
          </div>
        ) : (
          <div className="timeline card">
            {recent.map((a, i) => (
              <div className="timeline__item" key={`${a.at}-${i}`}>
                <span className="timeline__dot" />
                <span style={{ flex: 1 }}>{a.label}</span>
                <span className="timeline__time">{formatDateTime(a.at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
