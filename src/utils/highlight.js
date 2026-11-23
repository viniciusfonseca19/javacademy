import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import yaml from 'highlight.js/lib/languages/yaml'
import properties from 'highlight.js/lib/languages/properties'
import plaintext from 'highlight.js/lib/languages/plaintext'

// Núcleo enxuto: só as linguagens usadas no curso (menor bundle, sem CSS externo).
hljs.registerLanguage('java', java)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('properties', properties)
hljs.registerLanguage('plaintext', plaintext)
hljs.configure({ ignoreUnescapedHTML: true })

const ALIASES = {
  shell: 'bash',
  sh: 'bash',
  console: 'bash',
  terminal: 'bash',
  docker: 'dockerfile',
  yml: 'yaml',
  txt: 'plaintext',
  text: 'plaintext',
  '': 'plaintext',
}

export function highlight(code, lang) {
  const language = ALIASES[lang] || lang || 'plaintext'
  try {
    if (hljs.getLanguage(language)) {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value
    }
  } catch (err) {
    console.warn('Falha ao realçar código:', err)
  }
  return escapeHtml(code)
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default hljs
