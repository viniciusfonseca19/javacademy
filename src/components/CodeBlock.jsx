import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { highlight } from '../utils/highlight.js'

const LANG_LABELS = {
  java: 'java',
  xml: 'xml',
  json: 'json',
  sql: 'sql',
  bash: 'bash',
  dockerfile: 'dockerfile',
  yaml: 'yaml',
  properties: 'properties',
  plaintext: 'texto',
}

/**
 * Bloco de código com realce de sintaxe e botão de copiar.
 * Nunca simula execução: exibe apenas o código como texto destacado.
 */
export default function CodeBlock({ code, lang = 'plaintext', caption, showLineNumbers = false }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const html = highlight(code, lang)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Fallback para navegadores sem API de área de transferência.
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  const lines = showLineNumbers ? code.split('\n') : null

  return (
    <figure className="code-block">
      <figcaption className="code-block__header">
        <span className="row" style={{ gap: '10px', minWidth: 0 }}>
          {caption ? <span className="code-block__caption">{caption}</span> : null}
          <span className="code-block__lang">{LANG_LABELS[lang] || lang}</span>
        </span>
        <button
          type="button"
          className={`code-block__copy${copied ? ' code-block__copy--done' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Código copiado' : 'Copiar código'}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </figcaption>
      <pre>
        {lines ? (
          <code>
            {lines.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: '2.2em',
                    color: 'var(--text-3)',
                    userSelect: 'none',
                    opacity: 0.55,
                  }}
                >
                  {i + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: line ? highlight(line, lang) : '&nbsp;' }} />
              </span>
            ))}
          </code>
        ) : (
          <code dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </pre>
    </figure>
  )
}
