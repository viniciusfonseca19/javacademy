import { useMemo, useState } from 'react'
import { CheckCircle2, Info, RotateCcw, Target, XCircle } from 'lucide-react'
import CodeBlock from './CodeBlock.jsx'
import { renderInline } from '../utils/inline.jsx'
import { matchKeywords } from '../utils/text.js'
import { useProgress } from '../hooks/useProgress.jsx'

const TYPE_LABELS = {
  mc: 'Múltipla escolha',
  tf: 'Verdadeiro ou falso',
  code: 'Análise de código',
  short: 'Resposta aberta',
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Player de exercícios de uma aula.
 * - mc / tf / code: correção automática em JavaScript;
 * - short: comparação por palavras-chave com resposta modelo.
 * A pontuação guarda o MELHOR resultado por exercício (pode refazer).
 */
export default function ExercisePlayer({ lesson }) {
  const {
    state,
    actions: { recordExercise, resetExercises },
  } = useProgress()

  const exercises = useMemo(() => lesson.exercises || [], [lesson])
  const challenge = lesson.challenge || null
  const allIds = useMemo(
    () => [...exercises.map((e) => e.id), ...(challenge ? [challenge.id] : [])],
    [exercises, challenge],
  )

  const answeredCount = allIds.filter((id) => state.exercises[id]).length
  const correctCount = allIds.filter((id) => state.exercises[id]?.correct).length
  const total = allIds.length
  const score = total > 0 ? (correctCount / total) * 100 : 100
  const passed = score >= 70
  const allAnswered = answeredCount >= total

  const handleReset = () => {
    if (
      window.confirm(
        'Refazer os exercícios desta aula? Suas respostas anteriores serão apagadas e a pontuação será recalculada.',
      )
    ) {
      resetExercises(lesson.id, exercises.map((e) => e.id))
    }
  }

  return (
    <div className="exercise-player">
      <div className="score-bar">
        <div>
          <div className="text-sm muted">Aproveitamento da aula</div>
          <div className={`score-bar__value ${passed ? 'score-bar__value--pass' : 'score-bar__value--fail'}`}>
            {Math.round(score)}%
          </div>
          <div className="text-sm muted">
            {correctCount} de {total} corretas · {answeredCount}/{total} respondidas
          </div>
        </div>
        <div className="stack" style={{ gap: 10, minWidth: 220, flex: 1 }}>
          <div className={`alert ${passed ? 'alert--success' : 'alert--warn'}`}>
            {passed ? <CheckCircle2 size={16} /> : <Info size={16} />}
            <span>
              {passed
                ? 'Meta de 70% atingida. Você já pode marcar a aula como concluída.'
                : 'Aproveite pelo menos 70% das questões para liberar a conclusão da aula.'}
            </span>
          </div>
          {answeredCount > 0 && (
            <button type="button" className="btn btn--ghost" onClick={handleReset}>
              <RotateCcw size={15} /> Refazer exercícios
            </button>
          )}
        </div>
      </div>

      {exercises.map((exercise, i) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={i + 1}
          result={state.exercises[exercise.id]}
          onAnswer={(correct) => recordExercise(exercise.id, correct)}
        />
      ))}

      {!allAnswered && (
        <p className="text-sm muted" style={{ textAlign: 'center' }}>
          Responda todas as questões para ver a pontuação final da aula.
        </p>
      )}
    </div>
  )
}

function ExerciseCard({ exercise, index, result, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [text, setText] = useState('')
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const previouslyCorrect = Boolean(result?.correct)

  const verify = () => {
    let correct = false
    if (exercise.type === 'mc' || exercise.type === 'code') {
      correct = selected === exercise.answer
    } else if (exercise.type === 'tf') {
      correct = selected === exercise.answer
    } else if (exercise.type === 'short') {
      correct = matchKeywords(text, exercise.keywords || [])
    }
    setIsCorrect(correct)
    setChecked(true)
    setAttempts((a) => a + 1)
    onAnswer(correct)
  }

  const retry = () => {
    setSelected(null)
    setText('')
    setChecked(false)
    setIsCorrect(false)
  }

  const canVerify =
    exercise.type === 'short' ? text.trim().length > 0 : selected !== null

  return (
    <article className="exercise-card">
      <div className="exercise-card__head">
        <span className="exercise-card__index">
          Questão {index} · {TYPE_LABELS[exercise.type] || 'Exercício'}
        </span>
        <span className="row" style={{ gap: 8 }}>
          {previouslyCorrect ? (
            <span className="badge badge--success">
              <CheckCircle2 size={13} /> Acertou
            </span>
          ) : result ? (
            <span className="badge badge--warn">Reponder</span>
          ) : null}
          {result?.attempts > 1 && (
            <span className="badge">{result.attempts} tentativas</span>
          )}
        </span>
      </div>

      <div className="exercise-card__question">
        {renderInline(exercise.question, `q-${exercise.id}`)}
      </div>

      {exercise.code && <CodeBlock code={exercise.code} lang={exercise.lang || 'java'} />}

      {exercise.type === 'short' ? (
        <div className="field">
          <label className="field__label" htmlFor={`answer-${exercise.id}`}>
            Sua resposta
          </label>
          <textarea
            id={`answer-${exercise.id}`}
            className="textarea"
            style={{ fontFamily: 'var(--font-sans)', minHeight: 90 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua resposta com as palavras-chave do conceito..."
            disabled={checked}
          />
        </div>
      ) : exercise.type === 'tf' ? (
        <div className="options">
          {[true, false].map((value) => (
            <button
              key={String(value)}
              type="button"
              className={`option${selected === value ? ' option--selected' : ''}${
                checked && value === exercise.answer ? ' option--correct' : ''
              }${checked && selected === value && value !== exercise.answer ? ' option--wrong' : ''}`}
              onClick={() => setSelected(value)}
              disabled={checked}
            >
              <span className="option__marker">{value ? 'V' : 'F'}</span>
              <span>{value ? 'Verdadeiro' : 'Falso'}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="options">
          {(exercise.options || []).map((option, i) => {
            const isSelected = selected === i
            const isAnswer = exercise.answer === i
            return (
              <button
                key={i}
                type="button"
                className={`option${isSelected ? ' option--selected' : ''}${
                  checked && isAnswer ? ' option--correct' : ''
                }${checked && isSelected && !isAnswer ? ' option--wrong' : ''}`}
                onClick={() => setSelected(i)}
                disabled={checked}
              >
                <span className="option__marker">{LETTERS[i]}</span>
                <span>
                  {exercise.type === 'code' ? (
                    <code style={{ fontSize: '0.9em' }}>{option}</code>
                  ) : (
                    renderInline(option, `o-${exercise.id}-${i}`)
                  )}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {checked && (
        <div className={`feedback ${isCorrect ? 'feedback--correct' : 'feedback--wrong'}`}>
          {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <div>
            <span className="feedback__title">{isCorrect ? 'Correto!' : 'Ainda não.'}</span>
            <span className="feedback__explanation">
              {renderInline(exercise.explanation, `e-${exercise.id}`)}
            </span>
            {!isCorrect && exercise.answerText && exercise.type === 'short' && (
              <div style={{ marginTop: 8 }}>
                <strong>Resposta modelo:</strong> {exercise.answerText}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        {!checked ? (
          <button type="button" className="btn btn--primary" onClick={verify} disabled={!canVerify}>
            <Target size={15} /> Verificar resposta
          </button>
        ) : (
          <>
            {!isCorrect && (
              <button type="button" className="btn" onClick={retry}>
                <RotateCcw size={15} /> Tentar novamente
              </button>
            )}
            {attempts > 0 && (
              <span className="text-sm muted">
                {isCorrect
                  ? 'Registrado como correto — sua melhor pontuação foi mantida.'
                  : 'Esta questão ainda não conta pontos. Reveja a explicação e tente de novo.'}
              </span>
            )}
          </>
        )}
      </div>
    </article>
  )
}
