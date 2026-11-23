/* Ambiente de teste: stubs mínimos para o jsdom. */

globalThis.IS_REACT_ACT_ENVIRONMENT = true

// jsdom não implementa rolagem nem área de transferência.
Element.prototype.scrollIntoView = () => {}
window.scrollTo = () => {}
Object.defineProperty(navigator, 'clipboard', {
  configurable: true,
  value: { writeText: async () => {} },
})

// Confirmações automáticas nos testes (nenhuma caixa de diálogo real).
window.confirm = () => true
window.print = () => {}
