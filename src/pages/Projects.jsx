import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, CircleDashed, Rocket } from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import { allProjects } from '../content/index.js'
import { getModule } from '../data/curriculum.js'

export default function Projects() {
  const { state } = useProgress()

  return (
    <div className="page page--narrow fade-in">
      <header className="page__header">
        <div className="page__eyebrow">Projetos</div>
        <h1 className="page__title">Sete projetos práticos</h1>
        <p className="page__desc">
          Cada módulo termina com um projeto que reúne o que você aprendeu. Você desenvolve de forma
          independente, com dicas progressivas e uma solução comentada disponível apenas quando pedir.
        </p>
      </header>

      <div className="stack" style={{ gap: 'var(--sp-4)' }}>
        {allProjects.map((p) => {
          const mod = getModule(p.moduleId)
          const saved = state.projects[p.id] || {}
          const done = Boolean(saved.completedAt)
          const checked = (saved.checklist || []).filter(Boolean).length
          const total = (p.checklist || []).length

          return (
            <Link key={p.id} to={`/projetos/${p.id}`} className="card card--link">
              <div className="row-between" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="row" style={{ gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge--accent">Módulo {mod?.number}</span>
                    <span className="badge">{mod?.shortTitle}</span>
                    {done && (
                      <span className="badge badge--success">
                        <CheckCircle2 size={13} /> Concluído
                      </span>
                    )}
                  </div>
                  <h2 className="card__title">{p.name}</h2>
                  <p className="card__text">{p.tagline}</p>
                </div>
                <div className="stack" style={{ gap: 8, alignItems: 'flex-end' }}>
                  <span className="stat__icon" style={{ marginBottom: 0 }}>
                    <Rocket size={17} />
                  </span>
                  <span className="text-sm muted">
                    {done ? 'Entregue' : `${checked}/${total} itens`}
                  </span>
                  <ArrowRight size={17} color="var(--accent-strong)" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="alert alert--info" style={{ marginTop: 'var(--sp-5)' }}>
        <CircleDashed size={16} />
        <span>
          Os projetos dos módulos 4 a 7 fazem parte do <strong>projeto integrador TaskFlow API</strong>: cada
          módulo evolui a mesma aplicação, do CRUD em memória até a versão containerizada com autenticação.
        </span>
      </div>
    </div>
  )
}
