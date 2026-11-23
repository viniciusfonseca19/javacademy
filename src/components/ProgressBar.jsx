/** Barra de progresso acessível (role="progressbar"). */
export default function ProgressBar({ value, label, sublabel, variant = 'accent', size = 'md' }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 10) / 10))
  return (
    <div className={`progress${size === 'lg' ? ' progress--lg' : ''}`}>
      {(label || sublabel) && (
        <div className="progress__label">
          <span>{label}</span>
          {sublabel ? <span>{sublabel}</span> : <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progresso'}
      >
        <div
          className={`progress__fill${variant === 'success' ? ' progress__fill--success' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
