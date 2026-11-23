import { AlertTriangle, CheckCircle2, Info, Lightbulb, Quote, XCircle } from 'lucide-react'
import CodeBlock from './CodeBlock.jsx'
import { renderInline } from '../utils/inline.jsx'
import { slugify } from '../utils/text.js'

const NOTE_ICONS = {
  info: Info,
  tip: CheckCircle2,
  warn: AlertTriangle,
  danger: XCircle,
}

const NOTE_TITLES = {
  info: 'Informação',
  tip: 'Dica',
  warn: 'Atenção',
  danger: 'Erro comum',
}

/**
 * Renderiza a lista de blocos pedagógicos de uma aula.
 * Blocos suportados: p, h2, h3, h4, ul, ol, code, note, table, quote, divider.
 */
export default function BlockRenderer({ blocks }) {
  if (!Array.isArray(blocks)) return null
  return (
    <div className="prose">
      {blocks.map((block, i) => (
        <Block key={i} block={block} index={i} />
      ))}
    </div>
  )
}

function Block({ block, index }) {
  if (!block || typeof block !== 'object') return null

  switch (block.t) {
    case 'p':
      return <p>{renderInline(block.text, `p${index}`)}</p>

    case 'h2':
      return (
        <h2 id={slugify(block.text)} key={index}>
          {renderInline(block.text, `h2${index}`)}
        </h2>
      )

    case 'h3':
      return <h3 id={slugify(block.text)}>{renderInline(block.text, `h3${index}`)}</h3>

    case 'h4':
      return <h4>{renderInline(block.text, `h4${index}`)}</h4>

    case 'ul':
      return (
        <ul>
          {(block.items || []).map((item, i) => (
            <li key={i}>{renderInline(item, `li${index}-${i}`)}</li>
          ))}
        </ul>
      )

    case 'ol':
      return (
        <ol>
          {(block.items || []).map((item, i) => (
            <li key={i}>{renderInline(item, `oli${index}-${i}`)}</li>
          ))}
        </ol>
      )

    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} caption={block.caption} />

    case 'note': {
      const Icon = NOTE_ICONS[block.kind] || Info
      return (
        <aside className={`note note--${block.kind || 'info'}`}>
          <Icon size={18} aria-hidden="true" />
          <div className="note__body">
            <span className="note__title">{block.title || NOTE_TITLES[block.kind] || 'Nota'}</span>
            <span>{renderInline(block.text, `note${index}`)}</span>
          </div>
        </aside>
      )
    }

    case 'table':
      return (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {(block.headers || []).map((h, i) => (
                  <th key={i} scope="col">
                    {renderInline(h, `th${index}-${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows || []).map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{renderInline(cell, `td${index}-${r}-${c}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'quote':
      return <blockquote>{renderInline(block.text, `q${index}`)}</blockquote>

    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

    default:
      console.warn('Bloco de conteúdo desconhecido:', block.t)
      return null
  }
}

/** Extrai os títulos h2 de um bloco para montar o sumário da aula. */
export function collectHeadings(blocks) {
  if (!Array.isArray(blocks)) return []
  return blocks.filter((b) => b && b.t === 'h2').map((b) => ({ id: slugify(b.text), text: b.text }))
}
