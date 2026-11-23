import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileCode2,
  Lightbulb,
  ListChecks,
  Lock,
  Rocket,
  Save,
  ScrollText,
  Target,
  Trophy,
  Wrench,
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import { getProjectContent } from '../content/index.js'
import { getModule } from '../data/curriculum.js'
import BlockRenderer from '../components/BlockRenderer.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import { renderInline } from '../utils/inline.jsx'

export default function ProjectPage() {
  const { projectId } = useParams()
  const { state, actions } = useProgress()
  const project = getProjectContent(projectId)

  const saved = state.projects[projectId] || { checklist: [], notes: '', link: '' }
  const [notes, setNotes] = useState(saved.notes || '')
  const [link, setLink] = useState(saved.link || '')
  const [hintsShown, setHintsShown] = useState(saved.hintsShown || 0)

  useEffect(() => {
    const s = state.projects[projectId] || {}
    setNotes(s.notes || '')
    setLink(s.link || '')
    setHintsShown(s.hintsShown || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  if (!project) {
    return (
      <div className="page fade-in">
        <div className="empty">
          <Rocket size={40} />
          <h1 className="empty__title">Projeto não encontrado</h1>
          <Link className="btn btn--primary" to="/projetos">
            Voltar para projetos
          </Link>
        </div>
      </div>
    )
  }

  const mod = getModule(project.moduleId)
  const done = Boolean(saved.completedAt)
  const checklist = project.checklist.map((_, i) => Boolean(saved.checklist?.[i]))
  const checkedCount = checklist.filter(Boolean).length
  const allChecked = checkedCount === project.checklist.length
  const solutionShown = Boolean(saved.solutionShown)

  const toggleCheck = (idx) => {
    const updated = checklist.map((c, i) => (i === idx ? !c : c))
    actions.updateProject(projectId, { checklist: updated })
  }

  const saveNotes = (value) => {
    setNotes(value)
    actions.updateProject(projectId, { notes: value })
  }

  const saveLink = (value) => {
    setLink(value)
    actions.updateProject(projectId, { link: value })
  }

  const revealSolution = () => {
    if (!solutionShown) {
      const ok = window.confirm(
        'A solução comentada fica visível depois deste aviso. Tentou resolver sozinho primeiro? Confirme para liberar.',
      )
      if (!ok) return
    }
    actions.updateProject(projectId, { solutionShown: true })
  }

  return (
    <div className="page page--narrow fade-in">
      <div className="row-between" style={{ marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
        <Link className="btn btn--ghost" to="/projetos">
          <ArrowLeft size={15} /> Projetos
        </Link>
        <span className="row" style={{ gap: 8 }}>
          <span className="badge badge--accent">Módulo {mod?.number} · {mod?.shortTitle}</span>
          {done && (
            <span className="badge badge--success">
              <CheckCircle2 size={13} /> Concluído
            </span>
          )}
        </span>
      </div>

      <section className="project-hero">
        <div>
          <div className="page__eyebrow">Projeto do módulo</div>
          <h1 className="project-hero__title">{project.name}</h1>
          <p className="page__desc" style={{ marginTop: 8 }}>{project.tagline}</p>
        </div>
        <div className="grid grid--3">
          <div className="info-panel__box">
            <h3>
              <Target size={14} /> Contextualização
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>{project.context}</p>
          </div>
          <div className="info-panel__box">
            <h3>
              <Rocket size={14} /> Objetivo
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>{project.objective}</p>
          </div>
          <div className="info-panel__box">
            <h3>
              <ClipboardList size={14} /> Progresso
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              {checkedCount}/{project.checklist.length} itens do checklist
              {done ? ' — projeto entregue.' : '.'}
            </p>
          </div>
        </div>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <ScrollText size={19} /> Descrição detalhada
        </h2>
        <BlockRenderer blocks={project.description} />
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <ListChecks size={19} /> Requisitos funcionais
        </h2>
        <ol className="req-list">
          {project.functionalRequirements.map((r, i) => (
            <li key={i}>{renderInline(r, `fr${i}`)}</li>
          ))}
        </ol>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <Wrench size={19} /> Requisitos técnicos
        </h2>
        <ol className="req-list">
          {project.technicalRequirements.map((r, i) => (
            <li key={i}>{renderInline(r, `tr${i}`)}</li>
          ))}
        </ol>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <ScrollText size={19} /> Regras de negócio
        </h2>
        <ul className="check-list" style={{ gap: 10 }}>
          {project.businessRules.map((r, i) => (
            <li key={i} style={{ padding: '8px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <strong style={{ color: 'var(--accent-strong)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)' }}>
                RB{i + 1}
              </strong>
              <span>{renderInline(r, `rb${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <FileCode2 size={19} /> Estrutura sugerida
        </h2>
        <CodeBlock code={project.suggestedStructure.code} lang={project.suggestedStructure.lang || 'plaintext'} caption="Árvore de arquivos" />
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <Rocket size={19} /> Etapas de desenvolvimento
        </h2>
        <ol className="steps-list">
          {project.steps.map((s, i) => (
            <li key={i}>{renderInline(s, `step${i}`)}</li>
          ))}
        </ol>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <Award size={19} /> Critérios de avaliação
        </h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Critério</th>
                <th scope="col" style={{ width: 110 }}>Peso</th>
              </tr>
            </thead>
            <tbody>
              {project.evaluationCriteria.map((e, i) => (
                <tr key={i}>
                  <td>{renderInline(e.criterion, `ev${i}`)}</td>
                  <td>{e.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <Lightbulb size={19} /> Dicas progressivas
        </h2>
        <div className="hint-box">
          <div className="hint-box__head">
            <span>Peça ajuda só quando precisar</span>
            <button
              type="button"
              className="btn"
              disabled={hintsShown >= project.hints.length}
              onClick={() => {
                const next = Math.min(hintsShown + 1, project.hints.length)
                setHintsShown(next)
                actions.updateProject(projectId, { hintsShown: next })
              }}
            >
              {hintsShown >= project.hints.length ? 'Todas as dicas exibidas' : `Mostrar dica ${hintsShown + 1}`}
            </button>
          </div>
          {project.hints.slice(0, hintsShown).map((h, i) => (
            <div key={i} className="alert alert--info" style={{ marginTop: 4 }}>
              <Lightbulb size={15} />
              <span>
                <strong>Dica {i + 1}.</strong> {h}
              </span>
            </div>
          ))}
          {hintsShown === 0 && (
            <p className="text-sm muted">As dicas são liberadas uma a uma, da mais geral para a mais específica.</p>
          )}
        </div>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <CheckCircle2 size={19} /> Checklist de conclusão
        </h2>
        <div className="checklist">
          {project.checklist.map((item, i) => (
            <label key={i} className={checklist[i] ? 'checked' : ''}>
              <input type="checkbox" checked={checklist[i]} onChange={() => toggleCheck(i)} />
              <span>{renderInline(item, `cl${i}`)}</span>
            </label>
          ))}
        </div>
        <div className="row-between" style={{ marginTop: 'var(--sp-4)', flexWrap: 'wrap', gap: 12 }}>
          <span className="text-sm muted">
            {checkedCount}/{project.checklist.length} concluídos
            {!allChecked && ' — marque todos para entregar o projeto.'}
          </span>
          {done ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => actions.uncompleteProject(projectId)}
            >
              Reabrir projeto
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              disabled={!allChecked}
              onClick={() => actions.completeProject(projectId, project.name)}
            >
              <Trophy size={16} /> Marcar projeto como concluído
            </button>
          )}
        </div>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <Save size={19} /> Suas anotações e entrega
        </h2>
        <div className="stack">
          <div className="field">
            <label className="field__label" htmlFor="project-notes">Observações do desenvolvimento</label>
            <textarea
              id="project-notes"
              className="textarea"
              style={{ fontFamily: 'var(--font-sans)' }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => saveNotes(notes)}
              placeholder="Anote decisões, dúvidas pendentes e o que você aprendeu neste projeto..."
            />
            <span className="field__hint">Salvo automaticamente ao sair do campo.</span>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="project-link">Link da solução (GitHub ou repositório)</label>
            <input
              id="project-link"
              className="input"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={() => saveLink(link)}
              placeholder="https://github.com/seu-usuario/projeto"
            />
            <span className="field__hint">Opcional. Registrado apenas no seu navegador.</span>
          </div>
        </div>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          <Award size={19} /> Desafios extras
        </h2>
        <ul className="bullet-list">
          {project.extraChallenges.map((c, i) => (
            <li key={i}>{renderInline(c, `ex${i}`)}</li>
          ))}
        </ul>
      </section>

      <section className="project-section">
        <h2 className="project-section__title">
          {solutionShown ? <FileCode2 size={19} /> : <Lock size={19} />} Solução comentada
        </h2>
        {!solutionShown ? (
          <div className="hint-box">
            <div className="hint-box__head">
              <span>Libere somente quando quiser consultar a resposta</span>
              <button type="button" className="btn" onClick={revealSolution}>
                <Eye size={15} /> Ver solução comentada
              </button>
            </div>
            <p className="text-sm muted">
              Tentar primeiro é o que faz o projeto valer. A solução abaixo é uma referência — existem várias
              formas corretas de implementar.
            </p>
          </div>
        ) : (
          <div className="stack">
            <div className="alert alert--warn">
              <Eye size={16} />
              <span>
                <strong>Solução de referência.</strong> Compare a estrutura e as decisões, não linha por linha.
              </span>
            </div>
            <BlockRenderer blocks={project.solution} />
          </div>
        )}
      </section>
    </div>
  )
}
