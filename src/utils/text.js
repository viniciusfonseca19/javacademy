/** Utilitários de texto usados pelo conteúdo e pela interface. */

export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

/** Normaliza para comparação: minúsculas, sem acentos e sem espaços extras. */
export function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatMinutes(total) {
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function formatDurationLabel(seconds) {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}h ${m}min`
  if (m > 0) return `${m}min ${s}s`
  return `${s}s`
}

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

export function formatDate(iso) {
  if (!iso) return '—'
  return dateFmt.format(new Date(iso))
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  return dateTimeFmt.format(new Date(iso))
}

export function formatTimeOfDay(iso) {
  if (!iso) return '—'
  return timeFmt.format(new Date(iso))
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Boa madrugada'
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

/** Verifica se uma data é de hoje (para o rótulo do cronômetro). */
export function isToday(iso) {
  if (!iso) return false
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  )
}

/**
 * Grupos de palavras-chave aceitas em respostas abreviadas.
 * Cada item do array é um grupo: basta UMA palavra do grupo aparecer
 * na resposta. TODOS os grupos precisam ser atendidos.
 */
export function matchKeywords(answer, groups) {
  const normalized = normalize(answer)
  if (!normalized) return false
  return groups.every((group) => {
    const options = Array.isArray(group) ? group : [group]
    return options.some((word) => normalized.includes(normalize(word)))
  })
}
