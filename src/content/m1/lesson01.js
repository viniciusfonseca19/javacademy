export default {
  id: 'm1l01',
  moduleId: 'm1',
  number: 1,
  title: 'Introdução ao Java: história, características e ecossistema',
  durationMinutes: 20,

  objectives: [
    'Explicar de onde veio o Java e qual problema ele resolveu',
    'Descrever as principais características da linguagem e em quais situações elas importam',
    'Identificar as ferramentas do ecossistema Java usadas no desenvolvimento backend',
    'Distinguir o que é linguagem, plataforma e ecossistema no contexto do Java',
  ],

  prerequisites: [
    'Noções básicas de lógica de programação (variáveis, condições e repetição em qualquer linguagem)',
    'Ter instalado um editor de código e conhecer o básico de linha de comando',
    'Não é necessário já conhecer Java: esta aula é o ponto de partida do curso',
  ],

  intro: [
    { t: 'p', text: 'Java é uma das linguagens mais usadas do mundo para sistemas que precisam **rodar por muito tempo, atender muitas pessoas e não podem cair**. Bancos, sistemas de pagamento, portais de governo, lojas online e serviços que você usa todo dia costumam ter Java no servidor.' },
    { t: 'p', text: 'Antes de escrever a primeira linha de código, você precisa entender **o que o Java é, por que ele existe e quais peças formam o ambiente de desenvolvimento**. Pular essa parte costuma gerar dúvidas muito mais caras depois: por que o programa não roda, por qual motivo o servidor de aplicação se comporta diferente da sua máquina, ou o que significa "atualizar o JDK".' },
    { t: 'p', text: 'Nesta aula você vai percorrer a história do Java, conhecer suas características principais e mapear o ecossistema que será usado do início ao fim desta formação. Ao final, você saberá explicar, com suas palavras, **por que o Java continua relevante para backend** e quais ferramentas precisa dominar.' },
    { t: 'note', kind: 'tip', title: 'Como aproveitar esta aula', text: 'Leia com calma e faça as pausas sugeridas. Os conceitos aqui aparecerão em todos os módulos: guarde os nomes e o papel de cada peça (JDK, JVM, JRE, compilador, bytecode).' },
  ],

  theory: [
    { t: 'h2', text: 'De onde veio o Java' },
    { t: 'p', text: 'O Java nasceu em **1991**, na Sun Microsystems, liderado por James Gosling e uma equipe que na época tentava construir um aparelho doméstico inteligente (uma espécie de televisão interativa chamada de projeto *Green*). A exigência central era que o mesmo software rodasse em qualquer aparelho, independentemente do processador.' },
    { t: 'p', text: 'A solução encontrada foi criar uma linguagem que **não gerasse código para um chip específico**. Em vez disso, o programa seria compilado para uma representação neutra — o *bytecode* — e cada aparelho teria uma máquina virtual capaz de executar aquele bytecode. Essa decisão, tomada por motivos de hardware, acabou definindo a linguagem como a conhecemos.' },
    { t: 'p', text: 'Em **1995**, o Java foi apresentado ao público junto com o navegador HotJava. A promessa **"escreva uma vez, execute em qualquer lugar"** (*Write Once, Run Anywhere*) fez sucesso imediato, porque resolvia um problema real: em meados dos anos 90, software compilado para Windows não rodava em Unix, e vice-versa.' },
    { t: 'p', text: 'A partir dos anos 2000, o Java migrou do navegador para o **servidor**. Foi quando ganhou escala: grandes empresas perceberam que podiam rodar sistemas críticos em máquinas diferentes, com a mesma base de código. A Sun foi adquirida pela Oracle em 2010, e hoje o Java é mantido pela comunidade em um processo aberto de evolução (o JEP — *JDK Enhancement Proposal*).' },
    { t: 'note', kind: 'info', title: 'E o que isso significa para você?', text: 'O mesmo código que você escreve hoje no seu computador roda em servidores Linux, em contêineres Docker e em nuvem sem reescrita. Essa é a promessa histórica do Java — e ela continua valendo para backend.' },

    { t: 'h2', text: 'Características principais do Java' },
    { t: 'p', text: 'As características abaixo não são "lista para decorar": cada uma resolve um problema concreto que você encontrará no dia a dia de desenvolvimento.' },
    { t: 'table', headers: ['Característica', 'O que significa', 'Por que importa no backend'], rows: [
      ['Orientação a objetos', 'Dados e comportamentos vivem juntos, dentro de objetos', 'Sistemas grandes ficam organizados em módulos reutilizáveis (módulo 2 inteiro trata disso)'],
      ['Independência de plataforma', 'Compila para bytecode, executado pela JVM', 'O mesmo build roda em Windows, Linux e nuvem'],
      ['Tipagem estática', 'O compilador exige que o tipo de cada variável seja conhecido', 'Erros de tipo aparecem antes de o programa chegar em produção'],
      ['Gerenciamento automático de memória', 'A JVM limpa objetos que não são mais usados (coleta de lixo)', 'Você se concentra na lógica, sem free/manual em cada alocação'],
      ['Segurança', 'A JVM valida o código antes de executar e isola a aplicação', 'Reduz riscos em sistemas que rodam com acesso limitado'],
      ['Multithread nativo', 'Vários fluxos de execução no mesmo programa', 'Servidores atendem muitas requisições em paralelo'],
      ['Forte ecossistema', 'Bibliotecas, frameworks e ferramentas maduras', 'Spring, JUnit, Maven e Docker são padrão de mercado'],
    ] },
    { t: 'p', text: 'Vamos detalhar as três que mais aparecem em entrevistas e na prática.' },
    { t: 'h3', text: 'Tipagem estática' },
    { t: 'p', text: 'Em linguagens dinâmicas, você declara uma variável e o tipo pode mudar em tempo de execução. No Java, o tipo é declarado e **verificado na compilação**. Se você tentar somar um texto a um número sem conversão, o programa nem é gerado — o erro aparece no seu editor, não no servidor em produção.' },
    { t: 'code', lang: 'java', caption: 'Compilacao.java', code: 'class Compilacao {\n    public static void main(String[] args) {\n        int idade = 25;\n        String nome = "Ana";\n\n        String saudacao = nome + " tem " + idade + " anos";  // OK: concatenar texto\n        int erro = idade + nome;  // ERRO de compilacao: int + String nao existe\n    }\n}' },
    { t: 'p', text: 'No exemplo, a linha `String saudacao = ...` é **válida** porque somar texto a um número converte o número em caractere — a concatenação é permitida. Já `int erro = idade + nome;` não compila: não existe operação aritmética entre `int` e `String`. Repare que o erro aparece **na compilação**, antes de o programa rodar — essa é a tipagem estática em ação. Você verá a fundo os tipos primitivos e de referência na aula 4.' },
    { t: 'h3', text: 'Independência de plataforma' },
    { t: 'p', text: 'O Java possui duas máquinas: o **compilador** (`javac`), que transforma o seu código-fonte (`.java`) em bytecode (`.class`), e a **JVM**, que executa esse bytecode. O bytecode não é código de um processador específico: é uma instrução para a JVM. Cera sistema operacional tem a sua JVM, traduzindo aquelas instruções para o hardware real.' },
    { t: 'code', lang: 'plaintext', caption: 'Fluxo de um programa Java', code: 'Seu codigo-fonte          Bytecode              Execucao\n-----------------        --------------        --------------------\nMain.java   --javac-->   Main.class   --JVM-->   Codigo da CPU\n(codigo humano)          (neutro)               (Windows, Linux etc.)' },
    { t: 'p', text: 'É por isso que a extensão `.class` é a mesma em qualquer sistema operacional, e é por isso que o **mesmo arquivo JAR** pode ser publicado em servidores diferentes.' },
    { t: 'h3', text: 'Gerenciamento de memória' },
    { t: 'p', text: 'A JVM mantém um espaço chamado **heap**, onde os objetos vivem. Quando um objeto não é mais acessável, a JVM o remove em um processo chamado **coleta de lixo** (*garbage collection*). Você não precisa liberar memória manualmente, mas precisa **evitar vazamentos** (objetos mantidos vivos sem necessidade) — um tema que aparece quando falamos de performance em servidor.' },

    { t: 'h2', text: 'Linguagem, plataforma ou ecossistema?' },
    { t: 'p', text: 'As pessoas usam "Java" para coisas diferentes. Vale separar desde já:' },
    { t: 'ul', items: [
      '**Linguagem Java**: o conjunto de palavras-chave e regras que você escreve (`class`, `int`, `for`).',
      '**Plataforma Java**: a JVM + as bibliotecas padrão (`java.util`, `java.lang`) que acompanham cada execução.',
      '**Ecossistema Java**: tudo ao redor — ferramentas de build (Maven), frameworks (Spring), testes (JUnit, Mockito), bancos (PostgreSQL) e infraestrutura (Docker).',
    ] },
    { t: 'p', text: 'Esta formação cobre os três. Você aprende a **linguagem** (módulos 1 a 3), a **plataforma** em uso real com Spring Boot (módulos 4 a 6) e o **ecossistema** de entrega com Docker (módulo 7).' },

    { t: 'h2', text: 'O ecossistema que vamos usar' },
    { t: 'p', text: 'Todo o curso gira em torno de uma ferramenta central e de algumas peças de apoio. Este é o mapa — não é preciso decorar agora, apenas reconhecer o papel de cada uma.' },
    { t: 'table', headers: ['Ferramenta', 'Papel', 'Quando você usa'], rows: [
      ['JDK 21 LTS', 'Compilador, ferramentas de linha de comando e bibliotecas padrão', 'Sempre que compilar ou rodar um programa Java'],
      ['IDE (VS Code, IntelliJ, Eclipse)', 'Editor com realce, autocompletar e depuração', 'Durante todo o desenvolvimento'],
      ['Maven', 'Dependências e build do projeto', 'Módulo 4 em diante (e já no projeto do módulo 3)'],
      ['JUnit 5 + Mockito', 'Testes automatizados', 'Módulo 3 em diante'],
      ['Spring Boot', 'Framework para criar APIs REST rapidamente', 'Módulos 4 a 6'],
      ['PostgreSQL', 'Banco de dados relacional', 'Módulo 5'],
      ['Spring Security + JWT', 'Autenticação e autorização', 'Módulo 6'],
      ['Docker', 'Ambiente reproduzível em qualquer máquina', 'Módulo 7'],
    ] },
    { t: 'note', kind: 'info', title: 'Por que LTS?', text: '**LTS** significa *Long-Term-Support*: versões com suporte estendido de segurança. O Java 21 e o Java 25 são LTS; versões intermediárias recebem correções por menos tempo. Em produção, sempre se usa uma versão LTS — por isso o curso adota o **Java 21**.' },

    { t: 'h2', text: 'Seu primeiro programa (visão geral)' },
    { t: 'p', text: 'Para fechar o mapa, veja como é um programa Java completo. Não se preocupe em entender cada palavra agora: a **aula 3** destrincha a estrutura linha por linha. Aqui você apenas reconhece as peças que acabamos de citar.' },
    {
      t: 'code',
      lang: 'java',
      caption: 'OlaMundo.java',
      code: `public class OlaMundo {
    public static void main(String[] args) {
        String nome = "estudante";
        System.out.println("Ola, " + nome + "!");
    }
}`,
    },
    { t: 'p', text: 'O arquivo se chama `OlaMundo.java` (o nome do arquivo **precisa** ser igual ao nome da classe). Duas comandos resolvem tudo:' },
    { t: 'code', lang: 'bash', caption: 'Terminal', code: 'javac OlaMundo.java    # compila: gera OlaMundo.class (bytecode)\njava OlaMundo          # executa: a JVM roda o bytecode' },
    { t: 'p', text: 'O primeiro comando é o **compilador** (`javac`) transformando seu texto em bytecode; o segundo é a **JVM** executando aquele bytecode. Se tudo der certo, o terminal imprime `Ola, estudante!`. Repare na diferença: ao compilar você informa a **extensão** do arquivo; ao executar, você informa o **nome da classe**, sem extensão.' },
    { t: 'note', kind: 'warn', title: 'Execução real', text: 'Este código não foi executado aqui — ele é um exemplo para você rodar na sua máquina depois de instalar o JDK (aula 2). Escreva, compile e execute você mesmo: essa é a melhor forma de fixar o ciclo compilar/executar.' },

    { t: 'h2', text: 'Onde o Java é usado hoje' },
    { t: 'p', text: 'Para você que quer atuar como desenvolvedor backend, conhecer os contextos de uso ajuda a decidir onde estudar mais fundo.' },
    { t: 'ol', items: [
      '**APIs e microsserviços**: o coração do backend moderno — é exatamente o foco desta formação com Spring Boot.',
      '**Sistemas transacionais**: bancos, seguros e pagamentos exigem consistência e histórico auditável.',
      '**Big data e streaming**: ferramentas como Apache Kafka e Flink têm núcleo em Java.',
      '**Android**: aplicações móveis (fora do escopo deste curso, mas é o maior número de dispositivos Java).',
      '**Aplicações corporativas legadas**: milhares de sistemas em bancos e indústrias, muitos em modernização.',
    ] },
    { t: 'p', text: 'O ponto em comum: **longevidade**. Sistemas Java de 15 anos atrás continuam em produção e evoluindo. Isso cria demanda constante por profissionais que entendam a linguagem a fundo — não apenas a sintaxe.' },

    { t: 'h2', text: 'O caminho deste curso' },
    { t: 'p', text: 'A formação está organizada em sete módulos, cada um fechando com um projeto prático. O projeto principal, a **TaskFlow API**, é construído em camadas: começa no módulo 4 e ganha banco de dados, segurança e contêineres nos módulos seguintes.' },
    { t: 'ul', items: [
      '**Módulo 1 — Java Fundamentals**: sintaxe, tipos, estruturas e métodos (é aqui que você está).',
      '**Módulo 2 — POO**: classes, herança, polimorfismo e princípios SOLID.',
      '**Módulo 3 — Java Intermediário**: collections, streams, exceções e **testes com JUnit e Mockito**.',
      '**Módulo 4 — Spring Boot e Spring Web**: primeira versão da TaskFlow API.',
      '**Módulo 5 — Spring Data JPA e PostgreSQL**: persistência real.',
      '**Módulo 6 — Spring Security e JWT**: cadastro, login e proteção de endpoints.',
      '**Módulo 7 — Docker**: a API e o banco rodando em contêineres.',
    ] },
    { t: 'p', text: 'Com cerca de **6 horas semanais**, você conclui a formação em aproximadamente **45 dias**, totalizando cerca de **39 horas** de estudo. O dashboard guarda seu progresso — pode fechar o navegador e voltar depois de onde parou.' },
  ],

  commonMistakes: [
    { title: 'Achar que "Java" e "JavaScript" são parecidos', text: 'As duas linguagens compartilham o nome por causa de um acordo de marketing dos anos 90 e nada mais. JavaScript roda no navegador com tipos dinâmicos; Java é tipada, compilada para bytecode e roda na JVM. Se você já programou em JavaScript, reapenda a lógica de tipagem: **o compilador do Java decide antes do programa rodar**.' },
    { title: 'Instalar apenas um editor e esperar que "o Java" já esteja lá', text: 'Editor de código e JDK são coisas diferentes. Sem o JDK instalado e no `PATH`, os comandos `javac` e `java` não existem no terminal — e a mensagem de erro será "comando não encontrado". A aula 2 mostra a instalação correta.' },
    { title: 'Quer pular direto para o Spring Boot', text: 'É tentador, mas o Spring gera código para você usando exatamente os conceitos dos módulos 1 a 3 (objetos, interfaces, exceções, coleções). Pular a base significa copiar receitas sem conseguir depurar quando algo quebrar — e algo sempre quebra.' },
    { title: 'Achar que Java é lento "por natureza"', text: 'A JVM moderna otimiza o código em tempo de execução (JIT). Hoje o gargalo raramente é a linguagem: é o acesso a banco de dados, rede e algoritmos mal escritos. Entender performance depois fica muito mais fácil com essa base.' },
  ],

  bestPractices: [
    { title: 'Adote uma LTS desde o início', text: 'Use o **Java 21 LTS** nesta formação. Evitar versões experimentais evita problemas de compatibilidade com frameworks e bibliotecas — a mesma lógica vale para o Spring Boot.' },
    { title: 'Aprenda o ciclo compilar/executar pelo terminal', text: 'Antes de delegar tudo à IDE, rode `javac` e `java` algumas vezes. Quando a IDE falhar de forma estranha, você entenderá **onde** o problema acontece (compilação ou execução).' },
    { title: 'Documente suas versões', text: 'Anote JDK, Maven e versões das bibliotecas do seu projeto. Grande parte dos problemas de "na minha máquina não funciona" vem de versões divergentes.' },
    { title: 'Pratique a explicação em voz alta', text: 'Se você consegue explicar a diferença entre JDK, JVM e JRE para outra pessoa, entendeu a aula. Se trava, volte para o mapa da seção "Linguagem, plataforma ou ecossistema?".' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'O Java nasceu em 1991 na Sun e foi público em 1995, com a promessa de **escrever uma vez e rodar em qualquer lugar**.',
      'A chave dessa promessa é o **bytecode**: o código é compilado para uma representação neutra, executada pela **JVM** em cada sistema.',
      'Java é **orientado a objetos**, de **tipagem estática**, com **gerenciamento automático de memória** e forte foco em segurança.',
      'Separe os três termos: **linguagem** (o que você escreve), **plataforma** (JVM + bibliotecas) e **ecossistema** (Maven, Spring, JUnit, Docker).',
      'O **JDK** reúne compilador, ferramentas e bibliotecas; a **JVM** executa; o **JRE** é apenas a parte de execução.',
      'Usaremos **Java 21 LTS** do início ao fim, por ser uma versão com suporte de longo prazo.',
      'A formação tem 7 módulos e cerca de 39 horas; o projeto integrador é a **TaskFlow API**, que você constrói a partir do módulo 4.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você instala o **JDK 21**, entende a diferença entre JDK, JVM e JRE na prática e compila o primeiro programa pelo terminal. Tenha o computador em mãos: vamos executar de verdade.' },
  ],

  exercises: [
    {
      id: 'm1l01e1',
      type: 'mc',
      question: 'Em que ano o Java foi apresentado publicamente ao mundo?',
      options: ['1985', '1991', '1995', '2000'],
      answer: 2,
      explanation: 'O projeto começou em 1991, mas o **lançamento público aconteceu em 1995**, junto com o navegador HotJava. As outras datas marcam eventos de outras tecnologias: 1985 é a época dos primeiros PCs populares e 2000 é o auge do Java no servidor.',
    },
    {
      id: 'm1l01e2',
      type: 'tf',
      question: 'O bytecode gerado pelo compilador Java é código de máquina específico de um processador (x86, ARM etc.).',
      answer: false,
      explanation: 'O **bytecode não é código de máquina**: é um conjunto de instruções para a JVM. É justamente por isso que o mesmo `.class` roda em qualquer sistema que tenha uma JVM — se fosse código de x86, não executaria em ARM sem nova compilação.',
    },
    {
      id: 'm1l01e3',
      type: 'code',
      question: 'Um colega enviou este comando no terminal: `javac OlaMundo.class`. Qual é a descrição correta do problema?',
      code: 'javac OlaMundo.class\njava OlaMundo.class',
      lang: 'bash',
      options: [
        'O comando está correto: sempre se informa a extensão',
        'O compilador recebe o arquivo-fonte (.java); a execução recebe o nome da classe, sem extensão',
        'O erro é apenas de maiúsculas e minúsculas',
        'javac só funciona em sistemas Linux',
      ],
      answer: 1,
      explanation: 'O ciclo correto é `javac OlaMundo.java` (compilador recebe o **código-fonte**) e depois `java OlaMundo` (a JVM recebe o **nome da classe**, sem `.class`). Passar a extensão na execução é um dos erros mais comuns de quem está começando.',
    },
    {
      id: 'm1l01e4',
      type: 'short',
      question: 'Explique, em uma ou duas frases, qual é a diferença entre o JDK e a JVM.',
      keywords: [
        ['jdk', 'kit', 'desenvolv'],
        ['jvm', 'executa', 'execução', 'máquina virtual'],
        ['compilador', 'javac', 'ferramentas'],
      ],
      answerText: 'O JDK é o kit de desenvolvimento: reúne compilador (javac), ferramentas e bibliotecas para criar programas. A JVM é a máquina virtual que executa o bytecode já compilado. Sem o JDK não se programa; sem a JVM não se executa.',
      explanation: 'A distinção essencial é **desenvolver × executar**. O JDK contém a JVM (entre outras ferramentas) e permite também compilar; quem apenas roda uma aplicação muitas vezes instala apenas a JRE, que é a parte de execução da JVM com as bibliotecas.',
    },
    {
      id: 'm1l01e5',
      type: 'mc',
      question: 'Por que o Java é considerado uma linguagem de tipagem estática?',
      options: [
        'Porque roda em servidores',
        'Porque o tipo de cada variável é definido e verificado em tempo de compilação',
        'Porque usa muitas interfaces',
        'Porque não permite criar métodos',
      ],
      answer: 1,
      explanation: 'Tipagem estática significa que **o compilador conhece e valida o tipo de cada variável e expressão** antes de o programa rodar. Isso faz aparecer erros de tipo já no editor, em vez de em produção. Rodar em servidor ou usar interfaces são características de outras naturezas (ambiente e arquitetura).',
    },
    {
      id: 'm1l01e6',
      type: 'code',
      question: 'Considere o fluxo abaixo. Qual etapa produz o arquivo `Main.class`?',
      code: 'Main.java  -->  [ ? ]  -->  Main.class  -->  [ JVM ]  -->  Execução',
      lang: 'plaintext',
      options: ['A JVM', 'O compilador javac', 'O Maven', 'O sistema operacional'],
      answer: 1,
      explanation: 'O **compilador `javac`** transforma o código-fonte `.java` em bytecode `.class`. A JVM aparece depois, no passo de execução. O Maven, que veremos no módulo 4, apenas **organiza** a chamada dessas ferramentas e as dependências do projeto — ele não compila por conta própria.',
    },
  ],

  challenge: {
    id: 'm1l01c1',
    title: 'Mapa do ecossistema',
    fileName: 'notas.md',
    prompt: 'Sem consultar o texto, escreva (em Markdown) um mapa pessoal do ecossistema Java com três seções: (1) uma linha sobre a história do Java; (2) a diferença entre linguagem, plataforma e ecossistema; (3) uma tabela com as 8 ferramentas usadas nesta formação e o papel de cada uma. Em seguida, instale o JDK 21 LTS na sua máquina e confirme com `java --version` — cole o resultado no final do arquivo.',
    starterCode: '# Mapa do ecossistema Java\n\n## 1. História em uma linha\n\n## 2. Linguagem, plataforma e ecossistema\n\n## 3. Ferramentas da formação\n\n| Ferramenta | Papel |\n|---|---|\n\n## 4. Verificacao do ambiente\n\n```\n$ java --version\n```\n',
    criteria: [
      'A seção 1 menciona o ano de lançamento público (1995) e a origem na Sun Microsystems',
      'A seção 2 distingue claramente os três termos (linguagem, plataforma, ecossistema) em frases próprias',
      'A tabela 3 possui as 8 ferramentas listadas na aula (JDK, IDE, Maven, JUnit/Mockito, Spring Boot, PostgreSQL, Spring Security/JWT, Docker) com um papel coerente para cada uma',
      'A seção 4 traz a saída real do comando `java --version` indicando a versão 21',
      'O arquivo está no formato Markdown, com seções numeradas e sem texto de preenchimento',
    ],
    modelSolution: [
      { t: 'p', text: 'Abaixo, uma versão de referência. O importante é que as três ideias centrais estejam separadas e corretas — o formato exato pode variar.' },
      { t: 'code', lang: 'plaintext', caption: 'notas.md', code: '# Mapa do ecossistema Java\n\n## 1. Historia em uma linha\nO Java foi criado na Sun Microsystems em 1991 e apresentado publicamente em 1995,\ncom a promessa de escrever uma vez e rodar em qualquer lugar.\n\n## 2. Linguagem, plataforma e ecossistema\n- Linguagem: as regras e palavras-chave que escrevemos (class, int, for).\n- Plataforma: a JVM e as bibliotecas padrão que executam e sustentam o codigo.\n- Ecossistema: Maven, Spring, JUnit, Docker e todo o entorno de ferramentas.\n\n## 3. Ferramentas da formacao\n| Ferramenta | Papel |\n|---|---|\n| JDK 21 LTS | Compilador, ferramentas de linha de comando e bibliotecas |\n| IDE | Editor com autocompletar e depuracao |\n| Maven | Dependencias e build do projeto |\n| JUnit + Mockito | Testes automatizados |\n| Spring Boot | Framework de APIs REST |\n| PostgreSQL | Banco de dados relacional |\n| Spring Security + JWT | Autenticacao e autorizacao |\n| Docker | Ambiente reproduzivel em qualquer maquina |\n\n## 4. Verificacao do ambiente\n```\n$ java --version\nopenjdk 21.0.5 2024-10-15\nOpenJDK Runtime Environment Temurin-21.0.5+11\n```' },
      { t: 'p', text: 'Se a sua saída do `java --version` mostrar outra versão LTS (como 25), tudo bem — o essencial é ter um **LTS** instalado e saber onde verificar. No módulo 7, esse mesmo ambiente será embutido em uma imagem Docker.' },
    ],
  },
}
