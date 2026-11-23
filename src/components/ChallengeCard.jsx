import { useEffect, useState } from 'react'
import { CheckCircle2, Eye, Lightbulb, Save, Terminal } from 'lucide-react'
import BlockRenderer from './BlockRenderer.jsx'
import { useProgress } from '../hooks/useProgress.jsx'

/**
 * Desafio de programação da aula.
 *
 * O estudante escreve a solução em um editor local, avalia-se contra
 * critériios objetivos e pode consultar a solução comentada.
 * Importante: o código NÃO é executado nem compilado aqui — a correção
 * é declarada pelo próprio estudante com base nos critérios.
 */
export default function ChallengeCard({ lesson }) {
  const challenge = lesson.challenge
  const {
    state,
    actions: { saveChallenge, recordExercise },
  } = useProgress()

  const saved = state.challenges[challenge.id] || {}
  const [code, setCode] = useState(saved.code ?? challenge.starterCode ?? '')
  const [criteria, setCriteria] = useState(saved.criteria || [])
  const [revealed, setRevealed] = useState(Boolean(saved.revealed))
  const [savedFlash, setSavedFlash] = useState(false)

  const totalCriteria = challenge.criteria.length
  const checkedCount = criteria.filter(Boolean).length
  const codeFilled = code.trim().length > 40
  const completed = Boolean(saved.completedAt) || (checkedCount === totalCriteria && codeFilled)

  // Sincroniza quando o estudante muda de aula.
  useEffect(() => {
    const s = state.challenges[challenge.id] || {}
    setCode(s.code ?? challenge.starterCode ?? '')
    setCriteria(s.criteria || [])
    setRevealed(Boolean(s.revealed))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id])

  const persist = (patch) => {
    const next = { code, criteria, revealed, ...patch }
    saveChallenge(challenge.id, next)
    return next
  }

  const toggleCriterion = (idx) => {
    const nextCriteria = criteria.map((c, i) => (i === idx ? !c : c))
    setCriteria(nextCriteria)
    const allChecked = nextCriteria.filter(Boolean).length === totalCriteria
    const nextCode = code
    const nowComplete = allChecked && nextCode.trim().length > 40
    const previousComplete = Boolean(saved.completedAt)
    persist({ criteria: nextCriteria, completedAt: nowComplete || previousComplete ? saved.completedAt || new Date().toISOString() : undefined })
    if (nowComplete && !previousComplete) {
      recordExercise(challenge.id, true)
    }
  }

  const handleSave = () => {
    persist({})
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1600)
  }

  const handleReveal = () => {
    if (
      !revealed &&
      !window.confirm(
        'Ver a solução comentada antes de terminar ajuda menos do que tentar sozinho primeiro. Deseja continuar?',
      )
    ) {
      return
    }
    const next = persist({ revealed: true })
    setRevealed(next.revealed ?? true)
  }

  return (
    <article className="exercise-card">
      <div className="exercise-card__head">
        <span className="exercise-card__index">
          <Terminal size={13} style={{ verticalAlign: '-2px' }} /> Desafio de programação
        </span>
        <span className={`badge ${completed ? 'badge--success' : ''}`}>
          {completed ? (
            <>
              <CheckCircle2 size={13} /> Concluído
            </>
          ) : (
            `${checkedCount}/${totalCriteria} critérios`
          )}
        </span>
      </div>

      <div className="exercise-card__question">
        <p>{challenge.prompt}</p>
      </div>

      <div className="challenge-editor">
        <div className="challenge-editor__header">
          <span>Sua solução — {challenge.fileName || 'Solucao.java'}</span>
          <span>salvo localmente</span>
        </div>
        <label className="visually-hidden" htmlFor={`challenge-${challenge.id}`}>
          Editor de código do desafio {challenge.title}
        </label>
        <textarea
          id={`challenge-${challenge.id}`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-describedby={`challenge-hint-${challenge.id}`}
        />
      </div>
      <p id={`challenge-hint-${challenge.id}`} className="text-sm muted">
        Seu código não é executado nesta plataforma. Compare sua solução com os critériios abaixo e,
        quando todos forem atendidos, marque o desafio como concluído.
      </p>

      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={handleSave}>
          <Save size={15} /> {savedFlash ? 'Salvo!' : 'Salvar solução'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={handleReveal}>
          <Eye size={15} /> {revealed ? 'Solução comentada' : 'Ver solução comentada'}
        </button>
      </div>

      <div>
        <h4 style={{ fontSize: 'var(--fs-sm)', marginBottom: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Lightbulb size={15} color="var(--warn)" /> Critérios de correção
        </h4>
        <div className="criteria-list">
          {challenge.criteria.map((criterion, i) => (
            <label key={i} className={criteria[i] ? 'checked' : ''}>
              <input
                type="checkbox"
                checked={Boolean(criteria[i])}
                onChange={() => toggleCriterion(i)}
              />
              <span>{criterion}</span>
            </label>
          ))}
        </div>
      </div>

      {revealed && challenge.modelSolution && (
        <div className="stack">
          <div className="alert alert--info">
            <Lightbulb size={16} />
            <span>
              <strong>Solução comentada.</strong> Existem várias formas corretas de resolver este desafio —
              compare a lógica, não linha por linha.
            </span>
          </div>
          <BlockRenderer blocks={challenge.modelSolution} />
        </div>
      )}
    </article>
  )
}
