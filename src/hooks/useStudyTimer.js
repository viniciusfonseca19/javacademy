import { useEffect, useRef } from 'react'
import { useProgress } from './useProgress.jsx'

const TICK_MS = 30_000
const IDLE_MS = 5 * 60_000

/**
 * Cronômetro de estudo: soma o tempo em que a aba está visível e o
 * estudante está interagindo (sem atividade por 5 minutos o relógio pausa).
 * A cada 30 segundos o acumulado é gravado no localStorage.
 */
export function useStudyTimer() {
  const {
    actions: { addStudyTime },
  } = useProgress()
  const lastInteraction = useRef(Date.now())
  const pending = useRef(0)

  useEffect(() => {
    const markActive = () => {
      lastInteraction.current = Date.now()
    }
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart']
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }))

    const interval = window.setInterval(() => {
      if (document.hidden) return
      if (Date.now() - lastInteraction.current > IDLE_MS) return
      pending.current += TICK_MS / 1000
      if (pending.current >= 30) {
        addStudyTime(pending.current)
        pending.current = 0
      }
    }, TICK_MS)

    const flush = () => {
      if (pending.current > 0) {
        addStudyTime(pending.current)
        pending.current = 0
      }
    }

    document.addEventListener('visibilitychange', flush)
    window.addEventListener('pagehide', flush)

    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive))
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', flush)
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [addStudyTime])
}
