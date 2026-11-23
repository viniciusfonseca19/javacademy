/**
 * Índice do currículo Java Academy.
 *
 * Este arquivo contém apenas METADADOS (módulos, títulos, durações,
 * ordem e pré-requisitos de desbloqueio). O conteúdo pedagógico real
 * (texto das aulas, exercícios e projetos) fica em src/content/.
 */

export const modules = [
  {
    id: 'm1',
    number: 1,
    title: 'Java Fundamentals',
    shortTitle: 'Java Fundamentals',
    duration: '4 horas',
    color: '#6d7cff',
    description:
      'Da história da linguagem ao tratamento de erros: variáveis, tipos, operadores, condicionais, repetições, métodos e arrays — a base sobre a qual todo o resto se apoia.',
    project: 'p1',
  },
  {
    id: 'm2',
    number: 2,
    title: 'Programação Orientada a Objetos',
    shortTitle: 'POO',
    duration: '7 horas',
    color: '#8b7dff',
    description:
      'Classes, objetos, encapsulamento, herança, polimorfismo, interfaces, composição e uma introdução sólida aos princípios SOLID.',
    project: 'p2',
  },
  {
    id: 'm3',
    number: 3,
    title: 'Java Intermediário, JUnit 5 e Mockito',
    shortTitle: 'Java Intermediário',
    duration: '5 horas',
    color: '#5aa7ff',
    description:
      'Collections, generics, enums, exceções, Optional, lambdas e Stream API — e o passo decisivo para o mercado: testes automatizados com JUnit 5 e Mockito.',
    project: 'p3',
  },
  {
    id: 'm4',
    number: 4,
    title: 'Spring Boot e Spring Web',
    shortTitle: 'Spring Boot',
    duration: '7 horas',
    color: '#3ddc97',
    description:
      'IoC, injeção de dependências, Maven, HTTP e REST: construa a primeira versão da TaskFlow API com controllers, services, DTOs, validação e tratamento global de erros.',
    project: 'p4',
  },
  {
    id: 'm5',
    number: 5,
    title: 'Spring Data JPA e PostgreSQL',
    shortTitle: 'Spring Data JPA',
    duration: '6 horas',
    color: '#4ec9d4',
    description:
      'SQL, PostgreSQL, entidades JPA, repositories, relacionamentos e transações: a TaskFlow API deixa de guardar dados em memória e ganha persistência real.',
    project: 'p5',
  },
  {
    id: 'm6',
    number: 6,
    title: 'Spring Security e JWT',
    shortTitle: 'Spring Security',
    duration: '5 horas',
    color: '#f5b942',
    description:
      'Autenticação e autorização com Spring Security, hash de senhas com BCrypt, emissão e validação de JWT e proteção dos endpoints da TaskFlow API.',
    project: 'p6',
  },
  {
    id: 'm7',
    number: 7,
    title: 'Docker e Finalização',
    shortTitle: 'Docker',
    duration: '5 horas',
    color: '#ff6b6b',
    description:
      'Containers, imagens, Dockerfile, volumes, redes e Docker Compose: a TaskFlow API e o PostgreSQL rodando em ambiente reproduzível — e a revisão final da arquitetura.',
    project: 'p7',
  },
]

/**
 * Aulas do curso, em ordem. O campo `prereq` indica qual aula precisa
 * estar concluída para a atual ser liberada (null = sempre liberada).
 */
export const lessonIndex = [
  // ---------- MÓDULO 1 ----------
  { id: 'm1l01', moduleId: 'm1', number: 1, title: 'Introdução ao Java: história, características e ecossistema', duration: 20 },
  { id: 'm1l02', moduleId: 'm1', number: 2, title: 'JDK, JVM e JRE: compilação e execução', duration: 22 },
  { id: 'm1l03', moduleId: 'm1', number: 3, title: 'Estrutura de um programa Java e o método main', duration: 22 },
  { id: 'm1l04', moduleId: 'm1', number: 4, title: 'Variáveis e tipos primitivos', duration: 25 },
  { id: 'm1l05', moduleId: 'm1', number: 5, title: 'Tipos de referência e conversão de tipos', duration: 22 },
  { id: 'm1l06', moduleId: 'm1', number: 6, title: 'Operadores aritméticos, relacionais e lógicos', duration: 24 },
  { id: 'm1l07', moduleId: 'm1', number: 7, title: 'Estruturas condicionais com if e else', duration: 22 },
  { id: 'm1l08', moduleId: 'm1', number: 8, title: 'A estrutura switch e as switch expressions', duration: 20 },
  { id: 'm1l09', moduleId: 'm1', number: 9, title: 'Repetição com laço for', duration: 22 },
  { id: 'm1l10', moduleId: 'm1', number: 10, title: 'Repetição com while e do-while', duration: 20 },
  { id: 'm1l11', moduleId: 'm1', number: 11, title: 'Métodos: parâmetros, retorno e organização', duration: 24 },
  { id: 'm1l12', moduleId: 'm1', number: 12, title: 'Arrays e matrizes', duration: 24 },
  { id: 'm1l13', moduleId: 'm1', number: 13, title: 'Introdução ao tratamento de erros', duration: 20 },

  // ---------- MÓDULO 2 ----------
  { id: 'm2l01', moduleId: 'm2', number: 1, title: 'Fundamentos da Programação Orientada a Objetos', duration: 28 },
  { id: 'm2l02', moduleId: 'm2', number: 2, title: 'Classes e objetos: atributos e métodos', duration: 32 },
  { id: 'm2l03', moduleId: 'm2', number: 3, title: 'Construtores e a palavra-chave this', duration: 30 },
  { id: 'm2l04', moduleId: 'm2', number: 4, title: 'Encapsulamento e modificadores de acesso', duration: 32 },
  { id: 'm2l05', moduleId: 'm2', number: 5, title: 'Getters, setters e validação de dados', duration: 28 },
  { id: 'm2l06', moduleId: 'm2', number: 6, title: 'static e final', duration: 30 },
  { id: 'm2l07', moduleId: 'm2', number: 7, title: 'Herança e a palavra-chave super', duration: 34 },
  { id: 'm2l08', moduleId: 'm2', number: 8, title: 'Polimorfismo', duration: 32 },
  { id: 'm2l09', moduleId: 'm2', number: 9, title: 'Sobrecarga e sobrescrita de métodos', duration: 30 },
  { id: 'm2l10', moduleId: 'm2', number: 10, title: 'Classes abstratas', duration: 30 },
  { id: 'm2l11', moduleId: 'm2', number: 11, title: 'Interfaces', duration: 32 },
  { id: 'm2l12', moduleId: 'm2', number: 12, title: 'Composição e associação entre objetos', duration: 30 },
  { id: 'm2l13', moduleId: 'm2', number: 13, title: 'Pacotes, boas práticas de POO e princípios SOLID', duration: 34 },

  // ---------- MÓDULO 3 ----------
  { id: 'm3l01', moduleId: 'm3', number: 1, title: 'Collections Framework e a interface List', duration: 24 },
  { id: 'm3l02', moduleId: 'm3', number: 2, title: 'Set e HashSet: elementos sem repetição', duration: 20 },
  { id: 'm3l03', moduleId: 'm3', number: 3, title: 'Map e HashMap: pares chave-valor', duration: 22 },
  { id: 'm3l04', moduleId: 'm3', number: 4, title: 'Generics: segurança de tipos em tempo de compilação', duration: 22 },
  { id: 'm3l05', moduleId: 'm3', number: 5, title: 'Enumerações com enum', duration: 20 },
  { id: 'm3l06', moduleId: 'm3', number: 6, title: 'Exceções: try, catch, finally, throw e throws', duration: 26 },
  { id: 'm3l07', moduleId: 'm3', number: 7, title: 'Exceções personalizadas e hierarquia de erros', duration: 22 },
  { id: 'm3l08', moduleId: 'm3', number: 8, title: 'Optional: tratando valores ausentes', duration: 20 },
  { id: 'm3l09', moduleId: 'm3', number: 9, title: 'Lambda Expressions e Functional Interfaces', duration: 24 },
  { id: 'm3l10', moduleId: 'm3', number: 10, title: 'Stream API: filter, map e collect', duration: 26 },
  { id: 'm3l11', moduleId: 'm3', number: 11, title: 'Reduce, ordenação e resultado de operações em streams', duration: 22 },
  { id: 'm3l12', moduleId: 'm3', number: 12, title: 'Introdução aos testes automatizados com JUnit 5', duration: 26 },
  { id: 'm3l13', moduleId: 'm3', number: 13, title: 'Ciclo de vida dos testes: @BeforeEach e @AfterEach', duration: 22 },
  { id: 'm3l14', moduleId: 'm3', number: 14, title: 'Mockito: mocks, when/thenReturn e verify', duration: 28 },

  // ---------- MÓDULO 4 ----------
  { id: 'm4l01', moduleId: 'm4', number: 1, title: 'Ecossistema Spring: Spring Framework e Spring Boot', duration: 30 },
  { id: 'm4l02', moduleId: 'm4', number: 2, title: 'Inversão de Controle (IoC) e Injeção de Dependências (DI)', duration: 34 },
  { id: 'm4l03', moduleId: 'm4', number: 3, title: 'Spring Initializr, estrutura do projeto e Maven', duration: 36 },
  { id: 'm4l04', moduleId: 'm4', number: 4, title: 'pom.xml e gerenciamento de dependências', duration: 30 },
  { id: 'm4l05', moduleId: 'm4', number: 5, title: 'HTTP e as bases de uma API REST', duration: 34 },
  { id: 'm4l06', moduleId: 'm4', number: 6, title: 'Métodos HTTP, códigos de status e JSON', duration: 34 },
  { id: 'm4l07', moduleId: 'm4', number: 7, title: 'Controllers e mapeamento de endpoints', duration: 36 },
  { id: 'm4l08', moduleId: 'm4', number: 8, title: 'Services e injeção de dependência por construtor', duration: 34 },
  { id: 'm4l09', moduleId: 'm4', number: 9, title: 'DTOs: separando request e response', duration: 32 },
  { id: 'm4l10', moduleId: 'm4', number: 10, title: 'Bean Validation: validando dados de entrada', duration: 30 },
  { id: 'm4l11', moduleId: 'm4', number: 11, title: 'Tratamento global de exceções com @RestControllerAdvice', duration: 34 },
  { id: 'm4l12', moduleId: 'm4', number: 12, title: 'Organização em camadas e arquitetura da TaskFlow API', duration: 34 },

  // ---------- MÓDULO 5 ----------
  { id: 'm5l01', moduleId: 'm5', number: 1, title: 'Bancos relacionais e fundamentos de SQL', duration: 36 },
  { id: 'm5l02', moduleId: 'm5', number: 2, title: 'PostgreSQL: tipos de dados e configuração da conexão', duration: 36 },
  { id: 'm5l03', moduleId: 'm5', number: 3, title: 'ORM, JPA e Hibernate: criando entidades', duration: 38 },
  { id: 'm5l04', moduleId: 'm5', number: 4, title: 'Repositories e JpaRepository', duration: 36 },
  { id: 'm5l05', moduleId: 'm5', number: 5, title: 'Derived queries e consultas personalizadas', duration: 34 },
  { id: 'm5l06', moduleId: 'm5', number: 6, title: 'JPQL introdutório', duration: 32 },
  { id: 'm5l07', moduleId: 'm5', number: 7, title: 'Relacionamentos: @ManyToOne e @OneToMany', duration: 40 },
  { id: 'm5l08', moduleId: 'm5', number: 8, title: '@OneToOne, @ManyToMany, FetchType e cascades', duration: 38 },
  { id: 'm5l09', moduleId: 'm5', number: 9, title: 'Transações e @Transactional', duration: 36 },
  { id: 'm5l10', moduleId: 'm5', number: 10, title: 'Persistindo a TaskFlow: evoluindo a API para o PostgreSQL', duration: 38 },

  // ---------- MÓDULO 6 ----------
  { id: 'm6l01', moduleId: 'm6', number: 1, title: 'Fundamentos de segurança: authentication e authorization', duration: 32 },
  { id: 'm6l02', moduleId: 'm6', number: 2, title: 'Spring Security e a SecurityFilterChain', duration: 36 },
  { id: 'm6l03', moduleId: 'm6', number: 3, title: 'PasswordEncoder, BCrypt e hash de senhas', duration: 30 },
  { id: 'm6l04', moduleId: 'm6', number: 4, title: 'Introdução ao JWT: header, payload e signature', duration: 34 },
  { id: 'm6l05', moduleId: 'm6', number: 5, title: 'Geração e validação de tokens JWT', duration: 36 },
  { id: 'm6l06', moduleId: 'm6', number: 6, title: 'Filtros de autenticação e OncePerRequestFilter', duration: 34 },
  { id: 'm6l07', moduleId: 'm6', number: 7, title: 'Endpoints públicos e privados com estado stateless', duration: 34 },
  { id: 'm6l08', moduleId: 'm6', number: 8, title: 'Controle de acesso: autorização por papel e por dono do recurso', duration: 34 },
  { id: 'm6l09', moduleId: 'm6', number: 9, title: 'Boas práticas de segurança em APIs Java', duration: 30 },

  // ---------- MÓDULO 7 ----------
  { id: 'm7l01', moduleId: 'm7', number: 1, title: 'Introdução ao Docker: containers e imagens', duration: 36 },
  { id: 'm7l02', moduleId: 'm7', number: 2, title: 'Volumes e redes no Docker', duration: 36 },
  { id: 'm7l03', moduleId: 'm7', number: 3, title: 'Dockerfile: construindo imagens', duration: 40 },
  { id: 'm7l04', moduleId: 'm7', number: 4, title: 'Executando containers: run, portas, logs e processo', duration: 36 },
  { id: 'm7l05', moduleId: 'm7', number: 5, title: 'Docker Compose', duration: 40 },
  { id: 'm7l06', moduleId: 'm7', number: 6, title: 'Variáveis de ambiente e comunicação entre serviços', duration: 36 },
  { id: 'm7l07', moduleId: 'm7', number: 7, title: 'Containerizando a TaskFlow API com PostgreSQL', duration: 42 },
  { id: 'm7l08', moduleId: 'm7', number: 8, title: 'Revisão da arquitetura e testes finais', duration: 38 },
]

export const lessonsByModule = (moduleId) => lessonIndex.filter((l) => l.moduleId === moduleId)

export const getModule = (moduleId) => modules.find((m) => m.id === moduleId)

export const getLessonMeta = (lessonId) => lessonIndex.find((l) => l.id === lessonId)

/** Aula que libera a informada (null = aula sempre disponível). */
export function lessonPrereq(lessonId) {
  const meta = getLessonMeta(lessonId)
  if (!meta) return null
  const list = lessonsByModule(meta.moduleId)
  const pos = list.findIndex((l) => l.id === lessonId)
  if (pos <= 0) {
    // Primeira aula do módulo: depende do módulo anterior.
    if (meta.number === 1 && meta.moduleId !== 'm1') {
      const prev = lessonsByModule(modules[modules.findIndex((m) => m.id === meta.moduleId) - 1]?.id || '')
      return prev.length ? prev[prev.length - 1].id : null
    }
    return null
  }
  return list[pos - 1].id
}

/** Módulo desbloqueado quando o anterior atingir 70% das aulas. */
export function isModuleUnlocked(moduleId, completedSet) {
  if (moduleId === 'm1') return true
  const idx = modules.findIndex((m) => m.id === moduleId)
  if (idx <= 0) return true
  const prev = modules[idx - 1]
  const prevLessons = lessonsByModule(prev.id)
  if (prevLessons.length === 0) return true
  const done = prevLessons.filter((l) => completedSet.has(l.id)).length
  return done / prevLessons.length >= 0.7
}

export function isLessonUnlocked(lessonId, completedSet, freeMode = false) {
  if (freeMode) return true
  const prereq = lessonPrereq(lessonId)
  if (!prereq) {
    const meta = getLessonMeta(lessonId)
    return meta ? isModuleUnlocked(meta.moduleId, completedSet) : false
  }
  if (!completedSet.has(prereq)) return false
  const meta = getLessonMeta(lessonId)
  if (meta && getLessonMeta(prereq)?.moduleId !== meta.moduleId) {
    return isModuleUnlocked(meta.moduleId, completedSet)
  }
  return true
}
