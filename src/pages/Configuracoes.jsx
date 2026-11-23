import { useRef, useState } from 'react'
import {
  AlertTriangle,
  Download,
  Moon,
  Puzzle,
  RefreshCw,
  Sun,
  Trash2,
  Upload,
  User,
} from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import Modal from '../components/Modal.jsx'
import { formatStudyTime } from '../services/gamification.js'

export default function Configuracoes() {
  const { state, stats, actions, notify } = useProgress()
  const [confirmReset, setConfirmReset] = useState(false)
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const fileRef = useRef(null)

  const handleExport = () => {
    const data = actions.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `java-academy-progresso-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    notify('Progresso exportado. Guarde o arquivo para importar em outro navegador.', 'success')
  }

  const handleImportFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = actions.importData(String(reader.result))
      if (!result.ok) notify(result.error, 'error')
      else setShowImport(false)
    }
    reader.onerror = () => notify('Não foi possível ler o arquivo.', 'error')
    reader.readAsText(file)
  }

  const handleImportText = () => {
    const result = actions.importData(importText)
    if (!result.ok) notify(result.error, 'error')
    else {
      setImportText('')
      setShowImport(false)
    }
  }

  return (
    <div className="page page--narrow fade-in">
      <header className="page__header">
        <div className="page__eyebrow">Configurações</div>
        <h1 className="page__title">Preferências e dados</h1>
        <p className="page__desc">
          Tudo é salvo apenas no seu navegador, no localStorage. Nada é enviado para servidores — por isso
          você pode exportar e importar seu progresso manualmente.
        </p>
      </header>

      <section className="settings-group">
        <h2 className="settings-group__title">Aparência</h2>
        <p className="settings-group__desc">O tema escuro é o padrão da plataforma.</p>
        <div className="theme-options">
          <button
            type="button"
            className={`theme-option${state.settings.theme !== 'light' ? ' theme-option--active' : ''}`}
            onClick={() => actions.setSetting('theme', 'dark')}
            aria-pressed={state.settings.theme !== 'light'}
          >
            <span className="theme-option__preview">
              <span style={{ background: '#0e1014' }} />
              <span style={{ background: '#171b23' }} />
              <span style={{ background: '#6d7cff' }} />
            </span>
            <span className="row" style={{ gap: 6 }}>
              <Moon size={14} /> Escuro
            </span>
          </button>
          <button
            type="button"
            className={`theme-option${state.settings.theme === 'light' ? ' theme-option--active' : ''}`}
            onClick={() => actions.setSetting('theme', 'light')}
            aria-pressed={state.settings.theme === 'light'}
          >
            <span className="theme-option__preview">
              <span style={{ background: '#f4f6fa' }} />
              <span style={{ background: '#ffffff' }} />
              <span style={{ background: '#4f5be8' }} />
            </span>
            <span className="row" style={{ gap: 6 }}>
              <Sun size={14} /> Claro
            </span>
          </button>
        </div>
      </section>

      <section className="settings-group">
        <h2 className="settings-group__title">Estudo</h2>
        <p className="settings-group__desc">Personalize a experiência de aprendizado.</p>

        <div className="setting-row">
          <div className="setting-row__info">
            <div className="setting-row__label">
              <User size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
              Seu nome
            </div>
            <div className="setting-row__hint">Aparece na saudação do dashboard e no certificado.</div>
          </div>
          <input
            className="input"
            style={{ maxWidth: 260 }}
            value={state.settings.studentName || ''}
            onChange={(e) => actions.setSetting('studentName', e.target.value)}
            placeholder="Ex.: Ana Souza"
            aria-label="Seu nome"
          />
        </div>

        <div className="setting-row">
          <div className="setting-row__info">
            <div className="setting-row__label">
              <Puzzle size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
              Modo livre (liberar todas as aulas)
            </div>
            <div className="setting-row__hint">
              Desative a ordem obrigatória e abra qualquer aula direto da trilha. Útil para revisar.
            </div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={Boolean(state.settings.freeMode)}
              onChange={(e) => actions.setSetting('freeMode', e.target.checked)}
              aria-label="Ativar modo livre"
            />
            <span className="switch__track" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-row__info">
            <div className="setting-row__label">Tempo de estudo registrado</div>
            <div className="setting-row__hint">
              Contabilizado enquanto você estuda com a aba aberta (pausa após 5 minutos sem atividade).
            </div>
          </div>
          <strong>{formatStudyTime(stats.studySeconds)}</strong>
        </div>
      </section>

      <section className="settings-group">
        <h2 className="settings-group__title">Dados</h2>
        <p className="settings-group__desc">
          Exporte o progresso para levar a outro dispositivo, ou restaure de um arquivo exportado
          anteriormente.
        </p>

        <div className="setting-row">
          <div className="setting-row__info">
            <div className="setting-row__label">Exportar progresso</div>
            <div className="setting-row__hint">
              Baixa um arquivo JSON com aulas, exercícios, projetos, tempo e preferências.
            </div>
          </div>
          <button type="button" className="btn" onClick={handleExport}>
            <Download size={15} /> Exportar
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-row__info">
            <div className="setting-row__label">Importar progresso</div>
            <div className="setting-row__hint">
              Substitui os dados atuais pelo conteúdo do arquivo escolhido.
            </div>
          </div>
          <button type="button" className="btn" onClick={() => setShowImport(true)}>
            <Upload size={15} /> Importar
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-row__info">
            <div className="setting-row__label" style={{ color: 'var(--error)' }}>
              <Trash2 size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
              Reiniciar tudo
            </div>
            <div className="setting-row__hint">
              Apaga aulas concluídas, exercícios, projetos, tempo e conquistas deste navegador.
            </div>
          </div>
          <button type="button" className="btn btn--danger" onClick={() => setConfirmReset(true)}>
            <RefreshCw size={15} /> Reiniciar
          </button>
        </div>
      </section>

      <section className="settings-group">
        <h2 className="settings-group__title">Sobre</h2>
        <p className="settings-group__desc" style={{ marginBottom: 0 }}>
          Java Academy — plataforma de estudo de Java Backend com 7 módulos, {stats.totalLessons} aulas e{' '}
          {stats.totalExercises} exercícios. Conteúdo, correção e armazenamento funcionam 100% no navegador,
          sem servidor e sem dependência de serviços externos.
        </p>
      </section>

      {/* ---------- Importação ---------- */}
      <Modal
        open={showImport}
        title="Importar progresso"
        onClose={() => setShowImport(false)}
        actions={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setShowImport(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleImportText}
              disabled={!importText.trim()}
            >
              Importar do texto
            </button>
          </>
        }
      >
        <div className="alert alert--warn">
          <AlertTriangle size={16} />
          <span>A importação substitui todo o progresso atual deste navegador.</span>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="import-file">Arquivo exportado (.json)</label>
          <input
            ref={fileRef}
            id="import-file"
            className="input"
            type="file"
            accept="application/json,.json"
            onChange={(e) => handleImportFile(e.target.files?.[0])}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="import-text">Ou cole o conteúdo JSON aqui</label>
          <textarea
            id="import-text"
            className="textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{ "version": 1, ... }'
          />
        </div>
      </Modal>

      {/* ---------- Confirmação de reinício ---------- */}
      <Modal
        open={confirmReset}
        title="Reiniciar todo o progresso?"
        onClose={() => setConfirmReset(false)}
        actions={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                actions.resetAll()
                setConfirmReset(false)
                notify('Progresso reiniciado.', 'success')
              }}
            >
              <Trash2 size={15} /> Sim, apagar tudo
            </button>
          </>
        }
      >
        <div className="alert alert--error">
          <AlertTriangle size={16} />
          <span>
            Esta ação não pode ser desfeita: {stats.completedLessons} aulas, {stats.answeredExercises}{' '}
            exercícios respondidos, {stats.projectsDone} projetos e {formatStudyTime(stats.studySeconds)} de
            estudo serão apagados deste navegador. Se quiser guardar, exporte antes.
          </span>
        </div>
        <p className="text-sm muted">
          Dica: use <strong>Exportar progresso</strong> antes de reiniciar para poder restaurar depois.
        </p>
      </Modal>
    </div>
  )
}
