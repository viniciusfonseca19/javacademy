import { Award, CheckCircle2, Info, XCircle } from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  achievement: Award,
  info: Info,
}

/** Avisos flutuantes (conquistas e confirmações). */
export default function Toasts() {
  const { toasts } = useProgress()
  if (!toasts.length) return null

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: 'min(360px, calc(100vw - 40px))',
      }}
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.kind] || Info
        const color =
          t.kind === 'achievement'
            ? 'var(--warn)'
            : t.kind === 'error'
              ? 'var(--error)'
              : 'var(--success)'
        return (
          <div
            key={t.id}
            className="fade-in"
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'var(--surface)',
              border: `1px solid ${color}`,
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-2)',
              fontSize: 'var(--fs-sm)',
              color: 'var(--text)',
            }}
          >
            <Icon size={18} style={{ color, flexShrink: 0 }} />
            <span>{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
