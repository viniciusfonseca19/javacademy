# ESPECIFICAÇÃO DE CONTEÚDO — JAVA ACADEMY

Este documento define, de forma rígida, como todo o conteúdo pedagógico da plataforma
deve ser escrito. **Leia por completo antes de escrever qualquer aula.** O conteúdo é
validado automaticamente por `npm run validate`.

---

## 1. Objetivo e tom

- Idioma: **português brasileiro**, sempre.
- Tom: professor próximo, direto e respeitoso. Trate o estudante por "você".
- **Proibido**: textos genéricos ("aqui você aprenderá sobre Java"), frases de
  preenchimento, promessas vazias, emojis, marketing.
- Cada aula deve **ensinar de verdade**: quem termina consegue aplicar o conceito.
- Proibido afirmar que um código foi compilado/executado quando isso não ocorreu.
  Nunca simule um compilador. Exemplos são apresentados como texto com realce de
  sintaxe, e o estudante os executa na própria máquina.
- Nunca use um conceito **antes** de explicá-lo. Se a aula usa `ArrayList`, o estudante
  já viu `List` e referências na aula anterior — confie na progressão abaixo.

## 2. Progressão pedagógica do curso

O estudante chega com: lógica de programação básica e noções iniciais de Java.
Não presume nada além disso.

| Módulo | Ele já sabe (pode usar) | Só introduz aqui |
|---|---|---|
| m1 Java Fundamentals | lógica básica | tudo de sintaxe Java |
| m2 POO | m1 completo (variáveis, condicionais, laços, métodos, arrays, erros) | classes, herança, interfaces, SOLID |
| m3 Intermediário | m1 + m2 | collections, generics, lambdas, streams, JUnit, Mockito |
| m4 Spring Boot | m1 + m2 + m3 (inclusive testes) | Spring, IoC, HTTP, REST, Maven |
| m5 JPA | m4 (API REST em memória) | SQL, PostgreSQL, JPA, transações |
| m6 Security | m1..m5 | autenticação, JWT, filtros |
| m7 Docker | m1..m6 (API completa) | containers, imagens, compose |

## 3. Versões técnicas padronizadas (use EXATAMENTE)

| Tecnologia | Versão nos exemplos | Observação |
|---|---|---|
| Java | **21 LTS** | `java --version` → 21. Uso de `var`, text blocks, switch expression |
| Spring Boot | **4.1.2** (`spring-boot-starter-parent`) | compatível com Java 17–26; Java 21 é oficialmente suportado |
| Starters Spring Boot 4 | `spring-boot-starter-webmvc` (renomeado de `-web`), `spring-boot-starter-validation`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-test` | **não** use `spring-boot-starter-web` nos exemplos novos |
| Spring Security | 7.x (junto ao Boot 4.1) | DSL lambda; `SecurityFilterChain`; `.and()` não existe mais |
| JUnit (Jupiter) | `org.junit.jupiter:junit-jupiter:5.12.2` em Maven puro; o Spring Boot 4.1 gerencia a linha **6.x** — a API (`org.junit.jupiter.api`) é a mesma | mencione isso em `m3l12` |
| Mockito | `org.mockito:mockito-core:5.15.2` | API: `mock()`, `when().thenReturn()`, `verify()` |
| Maven | 3.9+ (wrapper `mvnw`) | |
| PostgreSQL | driver `org.postgresql:postgresql` (versão gerenciada pelo Boot); imagem `postgres:17-alpine` | |
| JWT | `io.jsonwebtoken:jjwt-api/jjwt-impl/jjwt-jackson` **0.12.6** | API nova: `Jwts.builder().subject(...)`, `Jwts.parser().verifyWith(key)` |
| Docker | Dockerfile multi-stage com `eclipse-temurin:21-jdk` e `eclipse-temurin:21-jre`; Compose v2 sem chave `version:` | |

Regras de consistência (muito importante — os módulos 4 a 7 constroem o MESMO projeto):

- Package base: `com.javacademy.taskflow`
- Projeto: **TaskFlow API** — API REST de tarefas.
- Entidades do projeto: `User` (m6+), `Task` (m5+), enums `TaskStatus`, `Priority`.
- Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/tasks` (+ `/{id}`).
- Nomes de classes devem ser reutilizados exatamente entre módulos.
- Se um módulo anterior mostrou um código, o seguinte pode **evoluí-lo**, sempre
  apontando "o que mudou e por quê".

## 4. Estrutura de arquivo de uma aula

Cada aula é um arquivo em `src/content/mX/lessonNN.js`:

```js
export default {
  id: 'm1l02',            // OBRIGATÓRIO: igual ao nome do arquivo sem ".js"
  moduleId: 'm1',
  number: 2,              // OBRIGATÓRIO: igual ao campo number do lessonIndex em src/data/curriculum.js
  title: 'JDK, JVM e JRE: compilação e execução',   // OBRIGATÓRIO: igual ao title do lessonIndex
  durationMinutes: 22,    // OBRIGATÓRIO: igual ao duration do lessonIndex

  objectives: [           // 3 a 5 objetivos observáveis (verbo no infinitivo)
    'Explicar a diferença entre JDK, JVM e JRE',
  ],
  prerequisites: [        // 3 a 5 frases do que é esperado antes desta aula
    'Ter concluído a aula "Introdução ao Java: história, características e ecossistema"',
    'Conseguir criar e rodar um programa simples seguindo um passo a passo',
  ],

  intro: [ /* blocos */ ],        // introdução ao assunto: motivação + mapa do que virá
  theory: [ /* blocos */ ],       // NÚCLEO: teoria detalhada + exemplos + códigos + explicação dos códigos
  commonMistakes: [               // 3 a 5 itens
    { title: 'Confundir JDK com JRE', text: '...' },
  ],
  bestPractices: [                // 3 a 5 itens
    { title: 'Prefira `var` quando o tipo é óbvio', text: '...' },
  ],
  summary: [ /* blocos */ ],      // resumo: use um parágrafo curto + lista (ul) com 5 a 8 pontos

  exercises: [ /* 4 a 6 exercícios */ ],
  challenge: { /* desafio prático — OBRIGATÓRIO */ },
}
```

## 5. Blocos de conteúdo

`intro`, `theory` e `summary` são arrays de blocos. Tipos aceitos:

```js
{ t: 'p', text: 'Parágrafo com **negrito** e `código` inline.' }
{ t: 'h2', text: 'Título de seção' }      // gera sumário automaticamente
{ t: 'h3', text: 'Subtítulo' }
{ t: 'h4', text: 'Subtítulo menor' }
{ t: 'ul', items: ['item com **negrito**', 'outro'] }
{ t: 'ol', items: ['primeiro passo', 'segundo passo'] }
{ t: 'code', lang: 'java', caption: 'Main.java', code: 'class Main { ... }' }
{ t: 'note', kind: 'info' | 'tip' | 'warn' | 'danger', title: 'Título', text: '...' }
{ t: 'table', headers: ['Coluna', 'Outra'], rows: [['a', 'b'], ['c', 'd']] }
{ t: 'quote', text: 'Citação ou definição importante' }
{ t: 'divider' }
```

Formato inline permitido: `**negrito**` e `código entre crases`. Nada mais.

Linguagens de código aceitas: `java`, `xml`, `json`, `sql`, `bash`, `dockerfile`,
`yaml`, `properties`, `plaintext`.

Regras de bloco de código:
- Sempre com `caption` quando o código pertencer a um arquivo real
  (ex.: `caption: 'TaskService.java'`).
- Cada bloco de código **deve ser explicado** logo abaixo (parágrafo ou lista
  apontando o que as linhas-chave fazem).
- Código completo, compilável em um editor (nunca trechos cortados com `...` sem
  justificativa clara; se for fragmento, diga "fragmento").
- Use Java 21 (pode usar `var`, text block, `switch` com `->`), mas **não** use
  recursos do módulo atual que ainda não foram vistos.

## 6. Exercícios

`exercises` contém de **4 a 6** exercícios. IDs obrigatórios: `m1l02e1`, `m1l02e2`...
(número da aula + `e` + índice). Distribua tipos ao longo da lista:

### 6.1 Múltipla escolha — `type: 'mc'`
```js
{
  id: 'm1l02e1',
  type: 'mc',
  question: 'Qual componente executa o bytecode na máquina virtual?',
  options: ['JDK', 'JVM', 'JRE', 'Compilador'],
  answer: 1,                        // índice da alternativa correta (0-based)
  explanation: 'A **JVM** é quem executa o bytecode; ...',
}
```
3 a 4 alternativas, todas plausíveis. `explanation` sempre explica POR QUE a certa
é certa e por que as principais erradas são erradas.

### 6.2 Verdadeiro ou falso — `type: 'tf'`
```js
{ id: 'm1l02e2', type: 'tf', question: 'O Java é compilado diretamente para código de máquina.', answer: false, explanation: '...' }
```

### 6.3 Análise/identificação em código — `type: 'code'`
```js
{
  id: 'm1l02e3',
  type: 'code',
  question: 'Analise o trecho. Qual afirmação está correta?',
  code: 'int x = 10;\nint y = x / 3;',
  lang: 'java',
  options: ['x e y valem 3', 'y vale 3 porque a divisão é inteira', 'Erro de compilação', 'y vale 3.33'],
  answer: 1,
  explanation: '...',
}
```
Pode também pedir "qual linha tem erro" com as opções sendo linhas.

### 6.4 Resposta aberta conceitual — `type: 'short'`
```js
{
  id: 'm1l02e4',
  type: 'short',
  question: 'Em uma frase, explique qual é a diferença entre compilar e executar um programa Java.',
  keywords: [                        // TODOS os grupos precisam aparecer na resposta
    ['compil', 'bytecode'],          // alternativas dentro do mesmo grupo
    ['jvm', 'executa', 'execução'],
  ],
  answerText: 'Compilar traduz o código-fonte para bytecode (javac); executar roda esse bytecode na JVM.',
  explanation: '...',
}
```
`keywords` é um array de grupos; dentro de cada grupo basta UMA alternativa.
Normalização ignora maiúsculas e acentos. Seja razoável: aceite sinônimos naturais.

### Regras de exercício
- Enunciado **autocontido** (dê contexto, não dependa do texto da aula).
- `explanation` obrigatório em TODOS, com conteúdo real (não repita o enunciado).
- Ao menos 1 exercício de código (`type: 'code'`) por aula.
- Ao menos 1 `short` por aula.
- Alternativas nunca se repetem nem se sobrepõem.

## 7. Desafio de programação (obrigatório em toda aula)

```js
challenge: {
  id: 'm1l02c1',                 // = id da aula + 'c1'
  title: 'Nome curto do desafio',
  fileName: 'Main.java',         // arquivo que o estudante criaria
  prompt: 'Enunciado completo, com entradas e saídas esperadas (quando fizer sentido).',
  starterCode: '// código inicial\n',
  criteria: [                    // 4 a 6 critérios OBJETIVOS, verificáveis olhando o código
    'Declara uma variável de cada tipo usado no enunciado',
    '...',
  ],
  modelSolution: [               // blocos: explicação + code com a solução comentada
    { t: 'p', text: '...' },
    { t: 'code', lang: 'java', caption: 'Main.java', code: '...' },
  ],
}
```

O desafio nunca é executado pela plataforma: o estudante compara a própria solução
com os critérios. Por isso os critérios precisam ser concretos e checáveis.

## 8. Projeto de módulo — `src/content/mX/project.js`

```js
export default {
  id: 'p1',                    // p1..p7
  moduleId: 'm1',
  name: 'Sistema de Gerenciamento de Alunos',
  tagline: 'Uma frase curta sobre o que será construído',
  context: 'Texto de contextualização (parágrafo único, prático, sem enrolação).',
  objective: 'Objetivo claro em uma frase.',
  description: [ /* blocos — detalha o que o sistema faz, com exemplos de uso */ ],
  functionalRequirements: ['...'],   // 6 a 10
  technicalRequirements: ['...'],    // 5 a 8 (linguagem, estrutura, ferramentas)
  businessRules: ['...'],            // 4 a 8 regras de negócio
  suggestedStructure: { lang: 'plaintext', code: 'src/...' },  // árvore de arquivos/pastas
  steps: ['...'],                    // 5 a 8 etapas na ordem certa, progressivas
  evaluationCriteria: [              // soma dos weights = 100
    { criterion: '...', weight: 20 },
  ],
  checklist: ['...'],                // 8 a 12 itens verificáveis
  extraChallenges: ['...'],          // 3 a 5 extras opcionais
  hints: ['...'],                    // 4 a 6 dicas progressivas (a mais óbvia primeiro)
  solution: [ /* blocos com a solução comentada — liberada sob demanda */ ],
}
```

Regras do projeto:
- **Não entregue a solução no description.** O estudante desenvolve sozinho.
- `hints` partem do mais geral para o mais específico.
- `solution` deve existir e ser completa (é revelada apenas a pedido), com comentários.
- Reutilize conceitos dos módulos anteriores e dos temas do módulo atual.

## 9. Qualidade mínima por aula (checklist obrigatório)

- [ ] `intro` com 3+ blocos: por que o assunto importa, o que verá, analogia quando útil.
- [ ] `theory` com, no mínimo, **12 blocos**, incluindo 3+ blocos `code` (Java ou
      outro), cada um explicado em seguida.
- [ ] Progressão: exemplos simples → combinados → caso realista do curso (TaskFlow
      quando aplicável a partir do m4).
- [ ] Explicações de código citam **linhas/construtos específicos**
      ("na linha `int idade = 25;`...").
- [ ] `commonMistakes`: erros reais de iniciantes, com o porquê do erro e como evitar.
- [ ] `bestPractices`: práticas de profissional, não trivialidades.
- [ ] `summary`: 5 a 8 pontos que alguém consegue reler em 1 minuto.
- [ ] 4 a 6 exercícios com `explanation` real + 1 desafio com critérios objetivos.
- [ ] Semântica correta: nenhum código com erro silencioso apresentado como correto.
- [ ] Nenhum placeholder, nenhum "TODO", nenhum texto vazio.

## 10. Formatação JS

- ES modules (`export default`), sem dependências externas, sem JSX.
- Aspas simples, ponto e vírgula, chaves nos blocos.
- **Nada de crases escapadas indevidamente**: strings com quebra de linha usam
  `\n` ou template literal com backticks — mas cuidado: o campo `code` de um bloco
  com aspas e quebras é melhor em template literal. Use o que for mais legível.
- Ao final, rode `npm run validate` e corrija o que ele acusar.
- O arquivo deve importar/apenas exportar o objeto da aula. Nada de `console.log`.

## 11. Erros que derrubam a validação

1. `id`, `number`, `title` ou `durationMinutes` diferentes de `src/data/curriculum.js`.
2. Menos de 4 exercícios ou mais de 6.
3. Exercício sem `explanation`, sem `answer`, ou `answer` fora das alternativas.
4. Desafio sem `criteria` (< 4) ou sem `modelSolution`.
5. `theory` com menos de 12 blocos ou menos de 3 blocos `code`.
6. `summary` ausente ou com menos de 3 blocos.
7. Texto genérico, placeholder ou conteúdo copiado de outro arquivo.
8. Erro de sintaxe JS (o build falha).
