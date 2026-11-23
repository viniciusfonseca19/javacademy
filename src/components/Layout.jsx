import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Award,
  BarChart3,
  BookOpen,
  GraduationCap,
  Menu,
  Layers,
  Rocket,
  Settings,
  X,
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import { useStudyTimer } from '../hooks/useStudyTimer.js'
import { formatStudyTime } from '../services/gamification.js'
import { modules } from '../data/curriculum.js'

const NAV = [
  { to: '/', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/trilha', label: 'Trilha de aprendizado', icon: Layers },
  { to: '/projetos', label: 'Projetos', icon: Rocket },
  { to: '/desempenho', label: 'Desempenho', icon: Award },
  { to: '/certificado', label: 'Certificado', icon: GraduationCap },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

/** Casca da aplicação: sidebar fixa, barra mobile e área de conteúdo. */
export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { stats } = useProgress()
  useStudyTimer()

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname])

  return (
    <div className="app">
      <button
        type="button"
        className={`sidebar__overlay${open ? '' : ' visually-hidden'}`}
        onClick={() => setOpen(false)}
        aria-label="Fechar menu"
        tabIndex={open ? 0 : -1}
      />

      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Navegação principal">
        <div className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            <GraduationCap size={19} />
          </span>
          <span>
            <span className="sidebar__title">Java Academy</span>
            <br />
            <span className="sidebar__subtitle">Formação Java Backend</span>
          </span>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            style={{ marginLeft: 'auto' }}
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            aria-hidden={!open}
            tabIndex={open ? 0 : -1}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          <div className="sidebar__section">Módulos</div>
          {modules.map((m) => {
            const mod = stats.moduleStats.find((s) => s.id === m.id)
            return (
              <NavLink
                key={m.id}
                to={`/trilha#${m.id}`}
                className={({ isActive }) => `nav-item${isActive && location.hash === `#${m.id}` ? ' active' : ''}`}
                title={m.title}
              >
                <BookOpen size={17} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.number}. {m.shortTitle}
                </span>
                <span className="nav-item__badge">{Math.round(mod?.percent ?? 0)}%</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="progress">
            <div className="progress__label">
              <span>Progresso geral</span>
              <span>{Math.round(stats.overallPercent)}%</span>
            </div>
            <div
              className="progress__track"
              role="progressbar"
              aria-valuenow={Math.round(stats.overallPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso geral"
            >
              <div className="progress__fill" style={{ width: `${stats.overallPercent}%` }} />
            </div>
          </div>
          <div className="text-sm muted" style={{ marginTop: 8 }}>
            {stats.completedLessons}/{stats.totalLessons} aulas · {formatStudyTime(stats.studySeconds)} estudadas
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="topbar__menu"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu de navegação"
          >
            <Menu size={20} />
          </button>
          <span className="row" style={{ gap: 8 }}>
            <span className="sidebar__logo" style={{ width: 30, height: 30 }} aria-hidden="true">
              <GraduationCap size={16} />
            </span>
            <strong style={{ fontSize: 'var(--fs-sm)' }}>Java Academy</strong>
          </span>
          <span className="badge badge--accent" style={{ marginLeft: 'auto' }}>
            {Math.round(stats.overallPercent)}%
          </span>
        </header>

        <Outlet />
      </div>
    </div>
  )
}
