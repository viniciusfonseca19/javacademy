import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  loadState,
  saveState,
  clearState,
  serializeState,
  parseImportedState,
  createInitialState,
  todayKey,
} from '../services/storage.js'
import { buildStats, pendingAchievements, ACHIEVEMENTS } from '../services/gamification.js'
import { getLessonMeta } from '../data/curriculum.js'

const ProgressContext = createContext(null)

/** Registra um evento no histórico (limitado para não inflar o storage). */
function pushActivity(state, entry) {
  const activity = [{ at: new Date().toISOString(), ...entry }, ...(state.activity || [])].slice(0, 150)
  return { ...state, activity }
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => loadState())
  const [toasts, setToasts] = useState([])
  const firstRender = useRef(true)

  // Persistência: grava cada alteração imediatamente.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    saveState(state)
  }, [state])

  // Tema aplicado ao documento.
  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme === 'light' ? 'light' : 'dark'
  }, [state.settings.theme])

  const stats = useMemo(() => buildStats(state), [state])

  const notify = useCallback((message, kind = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((t) => [...t, { id, message, kind }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  // Conquistas: concede automaticamente e avisa o estudante.
  useEffect(() => {
    const pending = pendingAchievements(state, stats)
    if (pending.length === 0) return
    const now = new Date().toISOString()
    setState((prev) => {
      const achievements = { ...prev.achievements }
      pending.forEach((id) => {
        if (!achievements[id]) achievements[id] = now
      })
      return { ...prev, achievements }
    })
    const ach = ACHIEVEMENTS.find((a) => a.id === pending[0])
    if (ach) {
      window.setTimeout(() => notify(`Conquista desbloqueada: ${ach.title}`, 'achievement'), 400)
    }
  }, [state, stats, notify])

  /* ---------------- Ações ---------------- */

  const setLastLesson = useCallback((lessonId) => {
    setState((prev) => (prev.lastLessonId === lessonId ? prev : { ...prev, lastLessonId: lessonId }))
  }, [])

  const completeLesson = useCallback(
    (lessonId) => {
      setState((prev) => {
        if (prev.lessons[lessonId]) return prev
        const meta = getLessonMeta(lessonId)
        const next = {
          ...prev,
          lessons: { ...prev.lessons, [lessonId]: { completedAt: new Date().toISOString() } },
          lastLessonId: lessonId,
        }
        return pushActivity(next, {
          type: 'lesson',
          label: `Aula concluída: ${meta?.title ?? lessonId}`,
        })
      })
      const meta = getLessonMeta(lessonId)
      notify(`Aula concluída: ${meta?.title ?? ''}`, 'success')
    },
    [notify],
  )

  const uncompleteLesson = useCallback((lessonId) => {
    setState((prev) => {
      if (!prev.lessons[lessonId]) return prev
      const lessons = { ...prev.lessons }
      delete lessons[lessonId]
      return { ...prev, lessons }
    })
  }, [])

  const recordExercise = useCallback((exerciseId, correct) => {
    setState((prev) => {
      const prevResult = prev.exercises[exerciseId]
      const wasCorrect = Boolean(prevResult?.correct)
      const result = {
        correct: wasCorrect || correct,
        attempts: (prevResult?.attempts || 0) + 1,
        at: new Date().toISOString(),
      }
      const next = { ...prev, exercises: { ...prev.exercises, [exerciseId]: result } }
      if (correct && !wasCorrect) {
        return pushActivity(next, { type: 'exercise', label: 'Exercício acertado' })
      }
      return next
    })
  }, [])

  /** Zera as respostas de todos os exercícios de uma aula (refazer). */
  const resetExercises = useCallback((lessonId, exerciseIds) => {
    setState((prev) => {
      const exercises = { ...prev.exercises }
      exerciseIds.forEach((id) => delete exercises[id])
      return { ...prev, exercises }
    })
  }, [])

  const saveChallenge = useCallback((challengeId, patch) => {
    setState((prev) => {
      const current = prev.challenges[challengeId] || { code: '', criteria: [], revealed: false }
      const merged = { ...current, ...patch }
      if (merged.completedAt && !current.completedAt) {
        return pushActivity(
          { ...prev, challenges: { ...prev.challenges, [challengeId]: merged } },
          { type: 'challenge', label: 'Desafio de programação concluído' },
        )
      }
      return { ...prev, challenges: { ...prev.challenges, [challengeId]: merged } }
    })
  }, [])

  const updateProject = useCallback(
    (projectId, patch) => {
      setState((prev) => {
        const current = prev.projects[projectId] || {
          checklist: [],
          notes: '',
          link: '',
          solutionShown: false,
        }
        const merged = { ...current, ...patch }
        if (merged.completedAt && !current.completedAt) {
          return pushActivity(
            { ...prev, projects: { ...prev.projects, [projectId]: merged } },
            { type: 'project', label: 'Projeto concluído' },
          )
        }
        return { ...prev, projects: { ...prev.projects, [projectId]: merged } }
      })
    },
    [],
  )

  const completeProject = useCallback(
    (projectId, projectName) => {
      setState((prev) => {
        const current = prev.projects[projectId] || { checklist: [], notes: '', link: '' }
        const merged = { ...current, completedAt: new Date().toISOString() }
        return pushActivity(
          { ...prev, projects: { ...prev.projects, [projectId]: merged } },
          { type: 'project', label: `Projeto concluído: ${projectName}` },
        )
      })
      notify(`Projeto concluído: ${projectName}`, 'success')
    },
    [notify],
  )

  const uncompleteProject = useCallback((projectId) => {
    setState((prev) => {
      const current = prev.projects[projectId]
      if (!current) return prev
      const { completedAt: _removed, ...rest } = current
      void _removed
      return { ...prev, projects: { ...prev.projects, [projectId]: rest } }
    })
  }, [])

  const addStudyTime = useCallback((seconds) => {
    if (!seconds || seconds <= 0) return
    setState((prev) => {
      const key = todayKey()
      return {
        ...prev,
        studySeconds: (prev.studySeconds || 0) + seconds,
        dailyStudy: { ...prev.dailyStudy, [key]: (prev.dailyStudy[key] || 0) + seconds },
      }
    })
  }, [])

  const setSetting = useCallback((key, value) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }))
  }, [])

  const resetAll = useCallback(() => {
    setState(clearState())
  }, [])

  const exportData = useCallback(() => serializeState(state), [state])

  const importData = useCallback(
    (text) => {
      const result = parseImportedState(text)
      if (!result.ok) return result
      setState(result.state)
      notify('Progresso importado com sucesso.', 'success')
      return result
    },
    [notify],
  )

  const value = useMemo(
    () => ({
      state,
      stats,
      toasts,
      notify,
      actions: {
        setLastLesson,
        completeLesson,
        uncompleteLesson,
        recordExercise,
        resetExercises,
        saveChallenge,
        updateProject,
        completeProject,
        uncompleteProject,
        addStudyTime,
        setSetting,
        resetAll,
        exportData,
        importData,
      },
    }),
    [
      state,
      stats,
      toasts,
      notify,
      setLastLesson,
      completeLesson,
      uncompleteLesson,
      recordExercise,
      resetExercises,
      saveChallenge,
      updateProject,
      completeProject,
      uncompleteProject,
      addStudyTime,
      setSetting,
      resetAll,
      exportData,
      importData,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress deve ser usado dentro de <ProgressProvider>')
  return ctx
}

/** Estado inicial exportado para testes/validação. */
export { createInitialState }
