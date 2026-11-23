/**
 * Testes de renderização das rotas principais (jsdom).
 * Garantem que cada tela monta sem erro com o ProgressProvider ativo.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { ProgressProvider } from '../hooks/useProgress.jsx'

let container
let root

function renderRoute(path) {
  return act(async () => {
    root = createRoot(container)
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    )
  })
}

beforeEach(() => {
  window.localStorage.clear()
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  if (root) {
    act(() => root.unmount())
    root = null
  }
  container.remove()
})

describe('rotas principais', () => {
  it('Dashboard (/) exibe a saudação e o progresso', async () => {
    await renderRoute('/')
    expect(container.textContent).toContain('Bem-vindo à Java Academy')
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy()
    expect(container.textContent).toContain('Java Academy')
  })

  it('Trilha (/trilha) lista os 7 módulos', async () => {
    await renderRoute('/trilha')
    expect(container.textContent).toContain('7 módulos, do zero à API em produção')
    expect(container.textContent).toContain('Java Fundamentals')
    expect(container.textContent).toContain('Docker e Finalização')
  })

  it('Sala de aula (/aula/m1l01) renderiza a aula liberada', async () => {
    await renderRoute('/aula/m1l01')
    expect(container.textContent).toContain('Introdução ao Java')
    expect(container.textContent).not.toContain('Aula bloqueada')
  })

  it('Aula inexistente mostra o estado vazio', async () => {
    await renderRoute('/aula/nao-existe')
    expect(container.textContent).toContain('Aula não encontrada')
  })

  it('Exercícios (/exercicios) renderiza a página', async () => {
    await renderRoute('/exercicios')
    expect(container.textContent).toContain('Questões e correções')
  })

  it('Projetos (/projetos) lista os sete projetos', async () => {
    await renderRoute('/projetos')
    expect(container.textContent).toContain('Sete projetos práticos')
  })

  it('Página de projeto (/projetos/p1) renderiza o projeto m1', async () => {
    await renderRoute('/projetos/p1')
    expect(container.textContent).toContain('Sistema de Gerenciamento de Alunos')
  })

  it('Desempenho (/desempenho) renderiza métricas', async () => {
    await renderRoute('/desempenho')
    expect(container.textContent).toContain('Sua evolução na formação')
  })

  it('Certificado (/certificado) renderiza requisitos', async () => {
    await renderRoute('/certificado')
    expect(container.textContent).toContain('Certificado de conclusão')
  })

  it('Configurações (/configuracoes) renderiza preferências', async () => {
    await renderRoute('/configuracoes')
    expect(container.textContent).toContain('Preferências e dados')
  })

  it('rota desconhecida cai na página 404', async () => {
    await renderRoute('/qualquer-coisa')
    expect(container.textContent).toContain('Página não encontrada')
  })
})

describe('persistência entre sessões', () => {
  it('aula concluída numa sessão aparece na sessão seguinte', async () => {
    // Simula a sessão 1: grava progresso direto no storage.
    window.localStorage.setItem(
      'java-academy.progress.v1',
      JSON.stringify({
        version: 1,
        settings: { theme: 'dark', freeMode: false, studentName: 'Ana' },
        lessons: { m1l01: { completedAt: '2026-01-01T00:00:00.000Z' } },
        exercises: {},
        challenges: {},
        projects: {},
        studySeconds: 0,
        dailyStudy: {},
        achievements: {},
        activity: [],
        lastLessonId: 'm1l01',
      }),
    )

    // Sessão 2: novo "navegador" lê o que ficou salvo.
    await renderRoute('/')
    expect(container.textContent).toContain('Bom te ver de novo, Ana')
    expect(container.textContent).toContain('1 de 79 aulas')
  })
})
