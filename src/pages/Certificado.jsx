import { Link } from 'react-router-dom'
import { Award, CheckCircle2, GraduationCap, Lock, Printer, XCircle } from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import {
  certificateRequirements,
  formatStudyTime,
  isCertificateEligible,
} from '../services/gamification.js'
import { formatDate } from '../utils/text.js'

export default function Certificado() {
  const { state, stats } = useProgress()
  const requirements = certificateRequirements(state, stats)
  const eligible = isCertificateEligible(state, stats)
  const studentName = state.settings.studentName?.trim() || 'Estudante Java Academy'

  return (
    <div className="page page--narrow fade-in">
      <header className="page__header no-print">
        <div className="page__eyebrow">Certificado</div>
        <h1 className="page__title">Certificado de conclusão</h1>
        <p className="page__desc">
          O certificado é gerado no seu navegador quando os três requisitos do curso são cumpridos. Ele é
          simbólico — a prova real do seu estudo é o progresso e os projetos entregues.
        </p>
      </header>

      {!eligible && (
        <section className="card no-print" style={{ marginBottom: 'var(--sp-5)' }}>
          <h2 className="section-title">
            <Lock size={18} /> Requisitos pendentes
          </h2>
          <ul className="check-list">
            {requirements.map((r) => (
              <li key={r.id}>
                {r.ok ? (
                  <CheckCircle2 size={18} color="var(--success)" />
                ) : (
                  <XCircle size={18} color="var(--text-3)" />
                )}
                <span style={{ color: r.ok ? 'var(--text-2)' : 'var(--text)' }}>{r.label}</span>
              </li>
            ))}
          </ul>
          <div className="row" style={{ marginTop: 'var(--sp-4)', flexWrap: 'wrap', gap: 10 }}>
            <Link className="btn btn--primary" to="/trilha">
              Continuar estudando
            </Link>
            <Link className="btn btn--ghost" to="/desempenho">
              Ver desempenho
            </Link>
          </div>
        </section>
      )}

      <article className="certificate" aria-label="Certificado de conclusão">
        <div className="certificate__brand">Java Academy · Formação Java Backend</div>
        <h2 className="certificate__title">Certificado de Conclusão</h2>
        <p className="certificate__text">
          Certificamos que este estudante concluiu a formação completa de Java Backend, cobrindo fundamentos
          da linguagem, programação orientada a objetos, testes automatizados, APIs REST com Spring Boot,
          persistência com JPA e PostgreSQL, autenticação JWT e ambientes Docker.
        </p>
        <div className="certificate__name">{studentName}</div>
        <div className="certificate__text">
          {eligible ? (
            <>
              Emitido em <strong>{formatDate(new Date().toISOString())}</strong>, após conclusão de todas as
              aulas, projetos e exercícios do curso.
            </>
          ) : (
            <>Emissão disponível após o cumprimento de todos os requisitos do curso.</>
          )}
        </div>
        <div className="certificate__meta">
          <span>
            <strong>{stats.completedLessons}/{stats.totalLessons}</strong>
            aulas
          </span>
          <span>
            <strong>{stats.projectsDone}/{stats.totalProjects}</strong>
            projetos
          </span>
          <span>
            <strong>{Math.round(stats.exerciseAccuracy)}%</strong>
            em exercícios
          </span>
          <span>
            <strong>{formatStudyTime(stats.studySeconds)}</strong>
            de estudo
          </span>
        </div>
        <div className="row no-print" style={{ justifyContent: 'center', marginTop: 'var(--sp-6)' }}>
          <span className="row" style={{ gap: 8, color: 'var(--text-3)', fontSize: 'var(--fs-xs)' }}>
            <Award size={14} />
            Certificado simbólico gerado localmente — nenhum dado sai do seu navegador.
          </span>
        </div>
      </article>

      <div className="row no-print" style={{ marginTop: 'var(--sp-5)', flexWrap: 'wrap', gap: 10 }}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => window.print()}
          disabled={!eligible}
          title={eligible ? 'Imprimir ou salvar em PDF' : 'Conclua o curso para liberar a impressão'}
        >
          <Printer size={16} /> Imprimir / salvar em PDF
        </button>
        <Link className="btn btn--ghost" to="/trilha">
          <GraduationCap size={16} /> Voltar à trilha
        </Link>
      </div>
    </div>
  )
}
