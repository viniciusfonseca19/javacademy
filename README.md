# Java Academy

Plataforma web 100% frontend de ensino de Java Backend.  
Formação de 7 módulos, ~79 aulas + exercícios autocorrigidos + projetos + gamificação.

> **⚠️ Aviso**: Este projeto é um **protótipo frontend**. Não contém backend, servidores, APIs ou execução real de código. Todo o progresso é salvo localmente em `localStorage`.

---

## Tecnologias

- **Vite 6** + **React 19** + **JavaScript (JSX)**
- **React Router 7**
- **Lucide React** (ícones)
- **highlight.js** (realce de código)
- **CSS puro** — sem frameworks, sem dependências externas

---

## Instalação e Execução

```bash
# 1. Clone / abra a pasta
cd JavAcademy

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: http://localhost:5173

---

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Hot Reload) |
| `npm run build` | Build de produção (output em `dist/`) |
| `npm run lint` | Lint com ESLint |
| `npm run validate` | Valida o conteúdo pedagógico do curso |
| `npm test` | Executa todos os testes (Vitest) |

---

## Estrutura do Curso

### Módulos (7)

| Módulo | Título | Duração | Aulas |
|--------|--------|---------|-------|
| 1 | Java Fundamentals | 4h | 13 |
| 2 | Programação Orientada a Objetos | 7h | 13 |
| 3 | Java Intermediário, JUnit 5 e Mockito | 5h | 14 |
| 4 | Spring Boot e Spring Web | 7h | 12 |
| 5 | Spring Data JPA e PostgreSQL | 6h | 10 |
| 6 | Spring Security e JWT | 5h | 9 |
| 7 | Docker e Finalização | 5h | 8 |

### Projetos Práticos (7)

Cada módulo termina com um projeto integrador:

- **P1** — Sistema de Gerenciamento de Alunos (M1)
- **P2** — Sistema de Vendas com POO (M2)
- **P3** — API de Usuários com Testes (M3)
- **P4** — TaskFlow API Controllers (M4)
- **P5** — TaskFlow API JPA (M5)
- **P6** — TaskFlow Auth JWT (M6)
- **P7** — TaskFlow Dockerizado (M7)

---

## Recursos Pedagógicos

Cada aula inclui:

- Objetivos e pré-requisitos
- Introdução motivacional
- Teoria detalhada com exemplos em Java
- Erros comuns e boas práticas
- Resumo
- 4–6 exercícios de fixação (múltipla escolha, verdadeiro/falso, código, curto)
- Desafio prático com solução sob demanda

### Exercícios

- **Autocorreção automática**
- **Retry ilimitado** até acertar
- **Melhor pontuação** salva no localStorage

### Gamificação

- 6 conquistas desbloqueáveis
- Progresso visual por módulo
- Tempo de estudo registrado
- Certificado (requer 100% de aulas, 100% de projetos e 70% de acerto nos exercícios)

---

## Persistência

Tudo é salvo em `localStorage` (não em servidor):

- **Progresso**: aulas concluídas, exercícios acertados, desafios resolvidos
- **Tempo de estudo**: total e por dia
- **Preferências**: tema, nome do estudante, modo livre
- **Exportar/Importar**: backup manual via JSON

---

## Desenvolvimento

### Pré-requisitos

- Node.js 18+ (recomendado: 20+)
- npm 10+

### Testes

```bash
npm test           # Roda todos os testes
```

Testes cobrem:
- Serialização e migração de estado
- Regras de desbloqueio (70% módulo anterior)
- Renderização das rotas principais (jsdom)
- Estatísticas de progresso e streak

### Validação de Conteúdo

O diretório `src/content/` contém stubs. Use o script de validação para garantir qualidade:

```bash
node scripts/validate-content.mjs m1l01   # Valida uma aula
node scripts/validate-content.mjs p1      # Valida um projeto
```

---

## Roadmap

- [x] Arquitetura e estrutura frontend
- [x] Sistema de persistência (localStorage)
- [x] Gamificação e estatísticas
- [x] 16 aulas piloto (+ projeto p1) validadas
- [ ] 63 aulas restantes
- [ ] 6 projetos restantes
- [ ] Testes de integração

---

## Licença

Este projeto é de código aberto e gratuito para fins educacionais.  
Não contém funcionalidades pagas nem dependências de terceiros.

---

## Autor

Projeto desenvolvido como protótipo pedagógico para a formação **Java Academy**.  
Conteúdo técnico baseado nas versões atuais do ecossistema Java (Java 21 LTS, Spring Boot 4.1.2, JUnit 5.12.2, Mockito 5.15.2).