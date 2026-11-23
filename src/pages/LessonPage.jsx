import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Lock,
  Target,
  Zap,
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import { getLessonContent } from '../content/index.js'
import { lessonIndex, getModule, isLessonUnlocked } from '../data/curriculum.js'
import { formatMinutes } from '../utils/text.js'
import BlockRenderer, { collectHeadings } from '../components/BlockRenderer.jsx'
import ExercisePlayer from '../components/ExercisePlayer.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import { renderInline } from '../utils/inline.jsx'

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { state, actions } = useProgress()

  const meta = lessonIndex.find((l) => l.id === lessonId)
  const content = getLessonContent(lessonId)

  useEffect(() => {
    if (meta) actions.setLastLesson(lessonId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  const completedSet = useMemo(() => new Set(Object.keys(state.lessons)), [state.lessons])
  const unlocked = meta ? isLessonUnlocked(meta.id, completedSet, state.settings.freeMode) : false

  if (!meta || !content) {
    return (
      <div className="page fade-in">
        <div className="empty">
          <BookOpen size={40} />
          <h1 className="empty__title">Aula não encontrada</h1>
          <p>O endereço acessado não corresponde a nenhuma aula do curso.</p>
          <Link className="btn btn--primary" to="/trilha">
            Voltar para a trilha
          </Link>
        </div>
      </div>
    )
  }

  if (!unlocked) {
    const prevId = lessonIndex[lessonIndex.findIndex((l) => l.id === meta.id) - 1]?.id
    const prevMeta = lessonIndex.find((l) => l.id === prevId)
    return (
      <div className="page page--narrow fade-in">
        <div className="empty">
          <Lock size={40} />
          <h1 className="empty__title">Aula bloqueada</h1>
          <p>
            Para liberar esta aula, conclua a anterior: <strong>{prevMeta?.title}</strong>.
          </p>
          <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="btn btn--primary" to={`/aula/${prevId}`}>
              Ir para a aula anterior
            </Link>
            <Link className="btn btn--ghost" to="/trilha">
              Ver trilha
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const module = getModule(meta.moduleId)
  const position = lessonIndex.findIndex((l) => l.id === meta.id)
  const prev = lessonIndex[position - 1]
  const next = lessonIndex[position + 1]
  const isDone = Boolean(state.lessons[meta.id])

  const allIds = [
    ...(content.exercises || []).map((e) => e.id),
    ...(content.challenge ? [content.challenge.id] : []),
  ]
  const correct = allIds.filter((id) => state.exercises[id]?.correct).length
  const total = allIds.length
  const score = total > 0 ? (correct / total) * 100 : 0
  const canComplete = score >= 70

  const theoryHeadings = collectHeadings(content.theory)
  const toc = [
    { id: 'introducao', text: 'Introdução' },
    ...theoryHeadings,
    { id: 'erros-comuns', text: 'Erros comuns' },
    { id: 'boas-praticas', text: 'Boas práticas' },
    { id: 'resumo', text: 'Resumo da aula' },
    { id: 'exercicios', text: 'Exercícios' },
    { id: 'desafio', text: 'Desafio prático' },
  ]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page page--narrow fade-in">
      <header className="lesson-header">
        <div className="lesson-header__meta">
          <span className="badge badge--accent">
            Módulo {module?.number} · {module?.shortTitle}
          </span>
          <span className="badge">Aula {meta.number} de {lessonIndex.filter((l) => l.moduleId === meta.moduleId).length}</span>
          <span className="badge">
            <Clock size={13} /> {formatMinutes(meta.duration)}
          </span>
          {isDone ? (
            <span className="badge badge--success">
              <CheckCircle2 size={13} /> Concluída
            </span>
          ) : (
            <span className="badge">Em andamento</span>
          )}
        </div>

        <div className="lesson-header__row">
          <h1 className="lesson-header__title">{meta.title}</h1>
        </div>

        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn btn--ghost" to="/trilha">
            <ArrowLeft size={15} /> Trilha
          </Link>
          <span className="text-sm muted">
            {correct}/{total} exercícios corretos · aproveitamento {Math.round(score)}%
          </span>
        </div>
      </header>

      <div className="info-panel">
        <div className="info-panel__box">
          <h3>
            <Target size={14} /> Objetivos de aprendizagem
          </h3>
          <ul className="bullet-list">
            {content.objectives.map((o, i) => (
              <li key={i}>{renderInline(o, `obj${i}`)}</li>
            ))}
          </ul>
        </div>
        <div className="info-panel__box">
          <h3>
            <ListChecks size={14} /> Pré-requisitos
          </h3>
          <ul className="bullet-list">
            {content.prerequisites.map((p, i) => (
              <li key={i}>{renderInline(p, `pre${i}`)}</li>
            ))}
          </ul>
        </div>
      </div>

      <nav className="toc" aria-label="Sumário da aula">
        <div className="toc__title">Sumário da aula</div>
        <ol>
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(item.id)
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ---------- Introdução ---------- */}
      <section className="lesson-section" id="introducao" style={{ marginTop: 0 }}>
        <h2 className="lesson-section__title">
          <BookOpen size={20} /> Introdução
        </h2>
        <BlockRenderer blocks={content.intro} />
      </section>

      {/* ---------- Teoria, exemplos e códigos ---------- */}
      <section className="lesson-section" id="teoria">
        <h2 className="lesson-section__title">
          <Zap size={20} /> Explicação e exemplos
        </h2>
        <BlockRenderer blocks={content.theory} />
      </section>

      {/* ---------- Erros comuns ---------- */}
      <section className="lesson-section" id="erros-comuns">
        <h2 className="lesson-section__title">
          <HelpCircle size={20} /> Erros comuns
        </h2>
        <div className="item-list">
          {content.commonMistakes.map((m, i) => (
            <div className="item-card item-card--error" key={i}>
              <HelpCircle size={17} />
              <div>
                <strong className="item-card__title">{m.title}</strong>
                {renderInline(m.text, `mist${i}`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Boas práticas ---------- */}
      <section className="lesson-section" id="boas-praticas">
        <h2 className="lesson-section__title">
          <Lightbulb size={20} /> Boas práticas
        </h2>
        <div className="item-list">
          {content.bestPractices.map((m, i) => (
            <div className="item-card item-card--good" key={i}>
              <Lightbulb size={17} />
              <div>
                <strong className="item-card__title">{m.title}</strong>
                {renderInline(m.text, `bp${i}`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Resumo ---------- */}
      <section className="lesson-section" id="resumo">
        <h2 className="lesson-section__title">
          <ListChecks size={20} /> Resumo da aula
        </h2>
        <BlockRenderer blocks={content.summary} />
      </section>

      {/* ---------- Exercícios ---------- */}
      <section className="lesson-section" id="exercicios">
        <h2 className="lesson-section__title">
          <Target size={20} /> Exercícios de fixação
        </h2>
        <p className="text-sm muted" style={{ marginBottom: 'var(--sp-4)' }}>
          Responda, receba a correção imediata e refaça quantas vezes quiser. Você precisa de pelo menos
          <strong> 70% de aproveitamento</strong> para concluir a aula.
        </p>
        <ExercisePlayer lesson={content} />
      </section>

      {/* ---------- Desafio ---------- */}
      {content.challenge && (
        <section className="lesson-section" id="desafio">
          <h2 className="lesson-section__title">
            <Award size={20} /> Desafio prático
          </h2>
          <ChallengeCard lesson={content} />
        </section>
      )}

      {/* ---------- Conclusão ---------- */}
      <div className="complete-bar">
        <div className="complete-bar__text">
          {isDone ? (
            <>
              <strong>Aula concluída.</strong> Bom trabalho — sua pontuação ficou em{' '}
              <strong>{Math.round(score)}%</strong>.
            </>
          ) : canComplete ? (
            <>
              <strong>Você atingiu {Math.round(score)}%.</strong> Pode marcar a aula como concluída para
              liberar a próxima.
            </>
          ) : (
            <>
              Faltam exercícios para chegar a 70% — atualmente você está em <strong>{Math.round(score)}%</strong>.
            </>
          )}
        </div>
        <div className="row" style={{ gap: 10 }}>
          {isDone ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => actions.uncompleteLesson(meta.id)}
            >
              Desmarcar conclusão
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              disabled={!canComplete}
              onClick={() => actions.completeLesson(meta.id)}
            >
              <CheckCircle2 size={16} /> Marcar aula como concluída
            </button>
          )}
        </div>
      </div>

      {isDone && next && (
        <div className="goal-burst" style={{ marginTop: 'var(--sp-4)' }}>
          <CheckCircle2 size={18} />
          <span>
            Próxima aula desbloqueada: <strong>{next.title}</strong>
          </span>
        </div>
      )}

      {/* ---------- Navegação ---------- */}
      <nav className="lesson-nav" aria-label="Navegação entre aulas">
        {prev ? (
          <Link className="lesson-nav__btn" to={`/aula/${prev.id}`}>
            <ArrowLeft size={18} />
            <span>
              <small>Aula anterior</small>
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            className="lesson-nav__btn lesson-nav__btn--next"
            to={`/aula/${next.id}`}
            onClick={(e) => {
              if (!isDone && !state.settings.freeMode) {
                const ok = window.confirm(
                  'Você ainda não concluiu esta aula. A próxima pode estar bloqueada. Deseja continuar mesmo assim?',
                )
                if (!ok) e.preventDefault()
              }
            }}
          >
            <ArrowRight size={18} />
            <span>
              <small>Próxima aula</small>
              {next.title}
            </span>
          </Link>
        ) : (
          <button
            type="button"
            className="lesson-nav__btn lesson-nav__btn--next"
            onClick={() => navigate('/projetos')}
          >
            <Rocket size={18} />
            <span>
              <small>Fim do módulo</small>
              Ir para os projetos
            </span>
          </button>
        )}
      </nav>
    </div>
  )
}
