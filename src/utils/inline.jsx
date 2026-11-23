import { Fragment } from 'react'

/**
 * Formatação inline mínima usada nos textos das aulas:
 *   **negrito**  e  `código`.
 * Evita depender de um parser Markdown completo (menos peso, mais previsível).
 */
export function renderInline(text, keyPrefix = 'i') {
  if (text == null) return null
  const source = String(text)
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g
  const parts = source.split(regex)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (!part) return <Fragment key={key} />
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={key}>{renderInline(part.slice(2, -2), key)}</strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={key}>{part.slice(1, -1)}</code>
    }
    return <Fragment key={key}>{part}</Fragment>
  })
}
