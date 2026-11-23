import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  BarChart3,
  CheckCircle2,
  Flame,
  GraduationCap,
  History,
  Rocket,
  Target,
  Timer,
  Trophy,
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import {
  ACHIEVEMENTS,
  evaluateAchievements,
  formatStudyTime,
} from '../services/gamification.js'
import { modules } from '../data/curriculum.js'
import { formatDateTime } from '../utils/text.js'
import ProgressBar from '../components/ProgressBar.jsx'

const ICONS = {
  BookOpen: Award,
  Target,
  Flag: Rocket,
  Rocket,
  Trophy,
  GraduationCap,
}

function last7Days(daily) {
  const out = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    out.push({ key, seconds: daily[key] || 0, label: d.toLocaleDateString('pt-BR', { weekday: 'short' }) })
  }
  return out
}

export default function Desempenho() {
  const { state, stats } = useProgress()
  const achievements = evaluateAchievements(state, stats)
  const week = useMemo(() => last7Days(state.dailyStudy || {}), [state.dailyStudy])
  const maxDay = Math.max(...week.map((d) => d.seconds), 60)

  return (
    <div className="page fade-in">
      <header className="page__header">
        <div className="page__eyebrow">Desempenho</div>
        <h1 className="page__title">Sua evolução na formação</h1>
        <p className="page__desc">
          Números reais calculados a partir do seu progresso local — aulas, exercícios, projetos e tempo de estudo.
        </p>
      </header>

      <div className="grid grid--4" style={{ marginBottom: 'var(--sp-5)' }}>
        <div className="stat">
          <span className="stat__icon">
            <BarChart3 size={17} />
          </span>
          <span className="stat__value">{Math.round(stats.overallPercent)}%</span>
          <span className="stat__label">Progresso geral</span>
        </div>
        <div className="stat">
          <span className="stat__icon">
            <CheckCircle2 size={17} />
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
          <span className="stat__label">Exercícios corretos</span>
        </div>
        <div className="stat">
          <span className="stat__icon">
            <Timer size={17} />
          </span>
          <span className="stat__value" style={{ fontSize: 'var(--fs-xl)' }}>
            {formatStudyTime(stats.studySeconds)}
          </span>
          <span className="stat__label">Tempo total de estudo</span>
        </div>
      </div>

      <div className="grid grid--2" style={{ marginBottom: 'var(--sp-5)' }}>
        <section className="card">
          <h2 className="section-title">
            <Award size={18} /> Aproveitamento por módulo
          </h2>
          <div className="chart-bars">
            {stats.moduleStats.map((m) => (
              <div key={m.id} style={{ marginBottom: 14 }}>
                <div className="row-between" style={{ marginBottom: 6 }}>
                  <span className="text-sm">
                    {m.number}. {m.shortTitle}
                  </span>
                  <span className="text-sm muted">
                    {m.completedLessons}/{m.totalLessons} aulas · {Math.round(m.exercisePercent)}% exercícios
                  </span>
                </div>
                <ProgressBar value={m.percent / 100} />
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">
            <Flame size={18} /> Tempo de estudo
          </h2>
          <div className="row" style={{ gap: 'var(--sp-5)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
            <div>
              <div className="stat__value" style={{ fontSize: 'var(--fs-xl)' }}>
                {formatStudyTime(stats.studySeconds)}
              </div>
              <div className="text-sm muted">total acumulado</div>
            </div>
            <div>
              <div className="stat__value" style={{ fontSize: 'var(--fs-xl)' }}>
                {formatStudyTime(stats.todaySeconds)}
              </div>
              <div className="text-sm muted">hoje</div>
            </div>
            <div>
              <div className="stat__value" style={{ fontSize: 'var(--fs-xl)' }}>
                {stats.streak}
              </div>
              <div className="text-sm muted">dias seguidos</div>
            </div>
          </div>
          <div className="chart-bars">
            {week.map((d) => (
              <div className="chart-bar" key={d.key} style={{ gridTemplateColumns: '70px 1fr 64px' }}>
                <span className="chart-bar__label">{d.label}</span>
                <div className="chart-bar__track">
                  <div
                    className="chart-bar__fill"
                    style={{ width: `${Math.min(100, (d.seconds / maxDay) * 100)}%` }}
                  />
                </div>
                <span className="chart-bar__value">{d.seconds ? formatStudyTime(d.seconds) : '—'}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section style={{ marginBottom: 'var(--sp-5)' }}>
        <h2 className="section-title">
          <Trophy size={18} /> Conquistas
        </h2>
        <div className="achievements">
          {achievements.map((a) => {
            const Icon = ICONS[a.icon] || Trophy
            return (
              <div key={a.id} className={`achievement${a.unlocked ? '' : ' achievement--locked'}`}>
                <span className="achievement__icon">
                  <Icon size={19} />
                </span>
                <div>
                  <div className="achievement__title">{a.title}</div>
                  <div className="achievement__desc">{a.description}</div>
                  <div className="achievement__desc" style={{ color: a.unlocked ? 'var(--success)' : 'var(--text-3)' }}>
                    {a.unlocked ? `Obtida em ${formatDateTime(a.earnedAt)}` : 'Bloqueada'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid grid--2">
        <section>
          <h2 className="section-title">
            <Rocket size={18} /> Projetos
          </h2>
          <div className="stack" style={{ gap: 'var(--sp-3)' }}>
            {modules.map((m) => {
              const project = stats.moduleStats.find((s) => s.id === m.id)?.project
              if (!project) return null
              const saved = state.projects[project.id] || {}
              const checked = (saved.checklist || []).filter(Boolean).length
              return (
                <div className="module-row" key={project.id}>
                  <span className={`module-row__num${saved.completedAt ? ' module-row__num--done' : ''}`}>
                    {saved.completedAt ? <CheckCircle2 size={18} /> : `P${m.number}`}
                  </span>
                  <div className="module-row__body">
                    <span className="module-row__title">{project.name}</span>
                    <span className="module-row__meta">
                      <span>
                        {checked}/{project.checklist.length} itens do checklist
                      </span>
                      {saved.link && <span>· link registrado</span>}
                    </span>
                    <div style={{ maxWidth: 300 }}>
                      <ProgressBar value={project.checklist.length ? checked / project.checklist.length : 0} />
                    </div>
                  </div>
                  <div className="module-row__actions">
                    <Link className="btn btn--ghost" to={`/projetos/${project.id}`}>
                      Abrir
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="section-title">
            <History size={18} /> Histórico de atividades
          </h2>
          {(state.activity || []).length === 0 ? (
            <div className="empty card">
              <History size={34} />
              <p className="empty__title">Nada registrado ainda</p>
              <p>Conclua uma aula ou resolva um exercício para começar o histórico.</p>
            </div>
          ) : (
            <div className="timeline card">
              {(state.activity || []).slice(0, 30).map((a, i) => (
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
    </div>
  )
}
