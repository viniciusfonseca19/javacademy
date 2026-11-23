export default {
  id: 'm4l01',
  moduleId: 'm4',
  number: 1,
  title: 'Ecossistema Spring: Spring Framework e Spring Boot',
  durationMinutes: 30,

  objectives: [
    'Explicar qual problema o Spring Framework resolveu no Java corporativo',
    'Distinguir o Spring Framework do Spring Boot e indicar o papel de cada um',
    'Identificar os starters que serão usados na TaskFlow API',
    'Descrever o que acontece quando a classe principal de uma aplicação Spring Boot é executada',
    'Relacionar as peças do ecossistema Spring com o mapa das aulas deste módulo',
  ],

  prerequisites: [
    'Ter concluído o módulo 3, inclusive os testes com JUnit e Mockito',
    'Conseguir compilar e executar um programa Java pelo terminal com javac e java',
    'Entender classes, interfaces e polimorfismo, vistos no módulo 2',
    'Reconhecer um arquivo XML básico (tags, atributos e texto entre tags), usado no pom.xml',
  ],

  intro: [
    { t: 'p', text: 'Você já escreveu Java o suficiente para perceber que um programa de verdade é mais do que lógica: ele precisa de **servidor web, leitura de configuração, banco de dados, segurança e testes**. Montar isso tudo na mão consumiria semanas antes da primeira linha de negócio ser escrita. É exatamente esse o terreno onde o Spring atua.' },
    { t: 'p', text: 'Dois nomes aparecem o tempo todo e quase ninguém separa direito no começo: **Spring Framework** e **Spring Boot**. O primeiro é o conjunto de bibliotecas que resolve os problemas de infraestrutura; o segundo é a forma oficial de montar, configurar e rodar uma aplicação com essas bibliotecas sem afogar em XML e versões conflitantes. Entender essa divisão evita que você copie receitas sem saber qual peça está usando.' },
    { t: 'p', text: 'Nesta aula você vai ver o problema histórico que criou o Spring, a anatomia dos projetos que o compõem, o que o Spring Boot adiciona por cima e como uma aplicação Boot sobe no seu computador. Ao final, você reconhecerá cada peça do ecossistema e saberá o papel dela dentro da **TaskFlow API**, o projeto que você constrói deste módulo até o módulo 7.' },
    { t: 'note', kind: 'tip', title: 'Como estudar esta aula', text: 'Este é um capítulo de mapa, não de código para copiar. Guarde os nomes e a função de cada peça (Framework, Boot, starter, auto-configuração, classe principal). Nas próximas cinco aulas você monta cada uma delas na prática.' },
  ],

  theory: [
    { t: 'h2', text: 'O problema que o Spring resolveu' },
    { t: 'p', text: 'No início dos anos 2000, o Java corporativo girava em torno dos **EJB** (Enterprise Java Beans). Para publicar um serviço simples, você escrevia interfaces, herança de classes fornecidas pelo servidor de aplicação, arquivos de configuração extensos e ainda precisava de um servidor comercial caro para rodar o resultado. O ciclo de desenvolvimento era curto em código e longo em espera: cada teste exigia empacotar e publicar tudo de novo.' },
    { t: 'p', text: 'Em 2002, o engenheiro **Rod Johnson** publicou o livro *Expert One-on-One J2EE Design and Development* com um framework leve junto: a semente do que viria a ser o Spring. A proposta era invertida em relação ao EJB: em vez de herdar de classes do servidor, você escreveria **objetos Java comuns (POJOs)**, e um container cuidaria de conectá-los e de oferecer serviços transversais como transação, segurança e injeção de dependência.' },
    { t: 'p', text: 'O projeto nasceu na empresa Interface21, que mudou de nome para SpringSource, foi adquirida pela VMware e hoje o portfólio é mantido sob o guarda-chuva da Broadcom, com contribuições abertas sob licença Apache 2.0. O nome carrega a brincadeira da época: enquanto o EJB era o "inverno" pesado da Java enterprise, o Spring seria a estação de renascimento.' },
    { t: 'note', kind: 'info', title: 'Por que isso importa para você', text: 'O Spring não é mais uma alternativa entre várias: é o padrão de mercado para backend Java. Vagas de desenvolvedor Java pressupõem conhecimento dele, e os conceitos que ele codifica (inversão de controle, injeção de dependência, camadas) valem para qualquer framework que você venha a usar depois.' },

    { t: 'h2', text: 'Spring Framework: a base do ecossistema' },
    { t: 'p', text: 'Quando alguém diz "Spring", geralmente está se referindo a **uma família de projetos**, e não a um único arquivo. O **Spring Framework** é o projeto de núcleo: o container de IoC, o suporte a transações, o acesso a dados, o MVC web e as demais funcionalidades de baixo nível. Os demais projetos (Boot, Data, Security, Cloud) construem sobre ele.' },
    { t: 'table', headers: ['Projeto', 'Papel', 'Presença nesta formação'], rows: [
      ['Spring Framework', 'Núcleo: container IoC, transações, JDBC, MVC, web', 'Base de tudo, usado em todos os módulos de 4 a 7'],
      ['Spring Boot', 'Convenção, auto-configuração e execução simplificada', 'Módulo 4 inteiro: é a porta de entrada'],
      ['Spring Data', 'Repositórios e integração com bancos (JPA)', 'Módulo 5: persistência da TaskFlow'],
      ['Spring Security', 'Autenticação, autorização e proteção de endpoints', 'Módulo 6: registro, login e JWT'],
      ['Spring Test', 'Suporte a testes de aplicações Spring', 'Módulos 4 a 6: testes do contexto e dos endpoints'],
      ['Spring Cloud', 'Infraestrutura para microsserviços (descoberta, config)', 'Fora do escopo desta formação'],
    ] },
    { t: 'p', text: 'Dentro do próprio Framework há módulos que você vai usar sem perceber: o **container IoC** (aula 2 desta série), o **Spring MVC** para atender requisições HTTP (aulas 7 e 8), a integração com **Jackson** para converter objetos em JSON (aula 6) e o **Spring Test**, que traz o suporte ao JUnit que você já domina do módulo 3.' },
    { t: 'ul', items: [
      '**IoC/DI**: o container cria e conecta os objetos da sua aplicação (aula 2).',
      '**Spring Web/MVC**: recebe requisições HTTP e direciona para o seu código (aulas 5, 6 e 7).',
      '**Conversão de dados**: transforma objetos Java em JSON e vice-versa (aula 6).',
      '**Transação e persistência**: gerencia acesso a banco de forma segura (módulo 5).',
      '**Segurança**: filtra requisições e valida tokens (módulo 6).',
    ] },
    { t: 'p', text: 'Não é preciso decorar a lista completa. O ponto é reconhecer que o Framework é **modular**: você puxa apenas os módulos de que precisa, e é o Spring Boot quem decide, na prática, quais puxar.' },

    { t: 'h2', text: 'Spring Boot: convenção acima de configuração' },
    { t: 'p', text: 'O Spring Framework, sozinho, ainda exigia bastante trabalho de montagem: escolher versões compatíveis de dezenas de bibliotecas, escrever XML de configuração e entender cada módulo antes de conseguir subir um servidor. O **Spring Boot**, lançado em 2014, atacou exatamente isso com a filosofia **"convention over configuration"** (convenção acima de configuração): você aceita padrões sensíveis e começa a escrever código de negócio.' },
    { t: 'ul', items: [
      '**Starters**: dependências pré-montadas por funcionalidade, com versões já testadas entre si (seção seguinte).',
      '**Auto-configuração**: o Boot analisa o que está no classpath e configura o que faz sentido, sem você escrever XML.',
      '**Servidor embutido**: a aplicação já nasce com um servidor HTTP (Tomcat por padrão) dentro do próprio JAR.',
      '**Recursos de produção**: logs estruturados, métricas e checagem de saúde prontos para uso.',
    ] },
    { t: 'table', headers: ['Aspecto', 'Spring Framework (sozinho)', 'Spring Boot'], rows: [
      ['Configuração', 'Manual, frequente uso de XML e classes de configuração', 'Mínima: convenções e propriedades simples'],
      ['Dependências', 'Você escolhe e versiona cada biblioteca', 'Starters com versões compatíveis entre si'],
      ['Servidor', 'Empacotado e instalado à parte (WildFly, Tomcat externo)', 'Embutido: o servidor vai dentro do JAR'],
      ['Como inicia', 'Publicado no servidor de aplicação', 'Executando a classe principal com um main'],
      ['Curva de entrada', 'Alta: exige conhecer a configuração antes de rodar', 'Baixa: roda com poucas linhas de código'],
    ] },
    { t: 'p', text: 'A frase que resume a relação: **o Spring Boot não substitui o Spring Framework, ele o configura**. Por baixo do capô continuam rodando o container IoC, o Spring MVC e os demais módulos; o Boot apenas elimina o trabalho repetitivo de ligar tudo isso manualmente.' },
    { t: 'quote', text: 'Spring Framework é o motor; Spring Boot é a chave de ignição, o painel e o manual que diz como ligar o motor sem errar as peças.' },

    { t: 'h2', text: 'Anatomia de uma aplicação Spring Boot' },
    { t: 'p', text: 'Toda aplicação Spring Boot começa por uma classe com um método `main` — o mesmo ponto de partida de qualquer programa Java que você já escreveu nos módulos 1 a 3. A diferença é o que esse `main` faz: ele devolve o controle para o Boot, que monta o container e sobe o servidor.' },
    {
      t: 'code',
      lang: 'java',
      caption: 'TaskFlowApplication.java',
      code: `package com.javacademy.taskflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskFlowApplication.class, args);
    }
}`,
    },
    { t: 'p', text: 'Linha por linha: o `package` declara a pasta onde a classe vive (neste caso, a pasta `com/javacademy/taskflow`); a anotação `@SpringBootApplication` marca esta classe como o ponto de partida da configuração; e `SpringApplication.run(TaskFlowApplication.class, args)` cria o contexto do Spring, aplica a auto-configuração e inicializa o servidor embutido. Os detalhes de cada parte da anotação você verá nas aulas 7 e 8 — aqui basta reconhecer o formato.' },
    { t: 'ol', items: [
      'O `main` chama `SpringApplication.run`, que cria o **container de beans** (aula 2).',
      'O container lê a configuração da aplicação e aplica a **auto-configuração** com base nas dependências do projeto.',
      'O Spring MVC é configurado e o **Tomcat embutido** é iniciado em uma porta (8080 por padrão).',
      'O processo principal passa a aguardar requisições: a aplicação fica viva até você parar o programa.',
    ] },
    { t: 'p', text: 'Ao rodar a aplicação, o console imprime uma saída que confirma cada etapa. O trecho abaixo é a parte relevante de uma execução real (o banner decorativo do Spring foi suprimido):' },
    { t: 'code', lang: 'plaintext', caption: 'Saída do console ao iniciar (fragmento)', code: `  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
...
 :: Spring Boot ::                (v4.1.2)

... INFO 7214 --- [           main] c.j.t.TaskFlowApplication          : Starting TaskFlowApplication using Java 21
... INFO 7214 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8080 (http)
... INFO 7214 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (http) with context path "/"
... INFO 7214 --- [           main] c.j.t.TaskFlowApplication          : Started TaskFlowApplication in 1.843 seconds` },
    { t: 'p', text: 'Três linhas merecem atenção: **`Starting TaskFlowApplication`** marca o início do processo; **`Tomcat initialized with port 8080 (http)`** confirma que o servidor embutido subiu na porta padrão; e **`Started TaskFlowApplication in 1.843 seconds`** indica que a aplicação está pronta para receber requisições. Se você vir qualquer uma dessas linhas, o Boot fez o trabalho dele.' },
    { t: 'code', lang: 'bash', caption: 'Terminal — duas formas de rodar a aplicação', code: `./mvnw spring-boot:run                  # recompila e roda a partir do código-fonte
java -jar target/taskflow-0.0.1-SNAPSHOT.jar   # roda o JAR já empacotado` },
    { t: 'p', text: 'O primeiro comando usa o **plugin do Spring Boot no Maven** para compilar e executar a aplicação em uma única etapa — é o que você usará na maior parte do módulo 4. O segundo executa o JAR gerado por `./mvnw package`: é exatamente o artefato que será enviado a um servidor ou para uma imagem Docker no módulo 7. Repare que os dois caminhos terminam no mesmo `main`.' },
    { t: 'note', kind: 'warn', title: 'Não corra para decorar a anotação', text: '`@SpringBootApplication` concentra três comportamentos (configuração, varredura de componentes e auto-configuração). As aulas 7 a 12 destrinchem cada um. Nesta aula, trate-a como um marcador: "esta é a classe que inicia tudo".' },

    { t: 'h2', text: 'Starters: a unidade de funcionalidade do Boot' },
    { t: 'p', text: 'O mecanismo que permite ao Boot configurar sozinho é o **starter**: um pequeno POM que agrega todas as bibliotecas necessárias para uma funcionalidade, já com versões compatíveis entre si. Em vez de você somar cinco dependências manualmente e rezar para não haver conflito, declara uma única linha no `pom.xml`.' },
    { t: 'table', headers: ['Starter', 'O que ele traz', 'Onde entra na TaskFlow'], rows: [
      ['spring-boot-starter-webmvc', 'Spring MVC, Tomcat embutido e Jackson (JSON)', 'Aulas 7 e 8: endpoints e atendimento de requisições'],
      ['spring-boot-starter-validation', 'Bean Validation com Hibernate Validator', 'Aula 10: validação dos dados de entrada'],
      ['spring-boot-starter-data-jpa', 'Spring Data JPA e Hibernate', 'Módulo 5: persistência em PostgreSQL'],
      ['spring-boot-starter-security', 'Spring Security 7', 'Módulo 6: autenticação e autorização'],
      ['spring-boot-starter-test', 'JUnit, Mockito, AssertJ e suporte a testes Spring', 'Desde já: os testes gerados e os que você escrever'],
    ] },
    { t: 'p', text: 'Duas informações de versão valem guardar: usamos o **Spring Boot 4.1.2**, e a linha 4.x é compatível com **Java 17 a 26**, com o Java 21 LTS oficialmente suportado — que é a versão desta formação. O Boot 4 também **modularizou os starters**: o antigo `spring-boot-starter-web` foi renomeado para `spring-boot-starter-webmvc`, e várias funcionalidades que antes vinham "grátis" passaram a ter starter próprio. Por isso, em todos os exemplos novos desta formação você verá `spring-boot-starter-webmvc`.' },
    { t: 'code', lang: 'xml', caption: 'pom.xml (fragmento dos starters do projeto)', code: `<dependencies>
  <!-- Atende requisicoes HTTP e converte objetos em JSON -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
  </dependency>

  <!-- Suporte a testes: JUnit 5, Mockito e cia. (escopo test) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>` },
    { t: 'p', text: 'Repare em dois detalhes do fragmento: as dependências de starter **não têm `<version>`** — a versão (4.1.2) vem herdada do `spring-boot-starter-parent`, que você estudará linha a linha na aula 4; e o segundo starter traz `<scope>test</scope>`, o que significa que ele existe apenas durante os testes e **não vai para o JAR de produção**.' },

    { t: 'h2', text: 'O mapa deste módulo e a TaskFlow API' },
    { t: 'p', text: 'A partir desta aula, tudo o que você aprender tem destino: a **TaskFlow API**, uma API REST de tarefas que nasce em memória neste módulo, ganha banco de dados no módulo 5, segurança no módulo 6 e contêiner no módulo 7. Os endpoints do projeto serão `/api/tasks` (lista e criação de tarefas), `/api/tasks/{id}` (uma tarefa específica) e, mais adiante, `/api/auth/register` e `/api/auth/login`.' },
    { t: 'ul', items: [
      '**Aula 1** (você está aqui): o mapa do ecossistema Spring e do Spring Boot.',
      '**Aula 2**: inversão de controle e injeção de dependência — a teoria que sustenta todo o resto.',
      '**Aula 3**: gerar o projeto no Spring Initializr e entender a árvore de pastas.',
      '**Aula 4**: ler o `pom.xml` e dominar o gerenciamento de dependências.',
      '**Aula 5**: HTTP e REST do zero — o protocolo que sua API falará.',
      '**Aula 6**: métodos HTTP, códigos de status e JSON — o vocabulário completo da conversa.',
    ] },
    { t: 'p', text: 'Depois disso, as aulas 7 a 12 traduzem tudo em código: controllers, services, DTOs, validação, tratamento de exceções e a arquitetura em camadas do projeto. Cada aula reaproveita o que veio antes — por isso esta sequência conceitual não deve ser pulada.' },

    { t: 'h2', text: 'Por que o Spring domina (e quando ele não é a escolha)' },
    { t: 'p', text: 'Três fatores mantêm o Spring no topo do backend Java: **maturidade** (mais de duas décadas de evolução e produção em bancos, varejo e governo), **ecossistema** (Spring Data, Security e Cloud resolvem problemas que aparecem logo depois de subir a primeira API) e **mercado** (a maioria das vagas Java pede Spring). Alternativas como Jakarta EE, Micronaut e Quarkus existem e são boas — Micronaut e Quarkus, inclusive, brilham em inicialização rápida e consumo baixo de memória, cenários onde o Spring tradicional pesa mais.' },
    { t: 'p', text: 'Também vale dizer o contrário: **nem todo programa precisa de Spring**. Uma biblioteca reutilizável, um script de automação ou um daemon pequeno costumam ser melhores como Java puro, sem o custo de memória e tempo de inicialização de um container. Escolher Spring é escolher quando o problema envolve servidor HTTP, múltiplas camadas, segurança e integração com banco — exatamente o caso da TaskFlow API.' },
    { t: 'note', kind: 'tip', title: 'O que transferir para outros projetos', text: 'Os conceitos deste módulo — IoC, DI, starters, ciclo requisição/resposta, códigos de status — não são exclusivos do Spring. Qualquer framework REST que você use depois (ou uma API escrita à mão) trabalha com as mesmas ideias. Estude o princípio, não apenas a anotação.' },
  ],

  commonMistakes: [
    { title: 'Tratar Spring Boot como uma linguagem ou biblioteca separada do Spring', text: 'Spring Boot é uma **camada de convenção por cima do Spring Framework**: ele não tem sintaxe própria, e o código que você escreve continua sendo Java com anotações do Spring. Quando algo falha, o erro quase sempre está no Framework ou na configuração — procurar "erro do Boot" costuma levar a lugares errados.' },
    { title: 'Copiar `spring-boot-starter-web` de tutoriais antigos', text: 'Com o Spring Boot 4, esse starter foi **renomeado para `spring-boot-starter-webmvc`**. Usar o nome antigo gera dependência depreciada e confunde o entendimento sobre o que a aplicação realmente inclui. Em projetos novos, escreva sempre `spring-boot-starter-webmvc` — é o que esta formação usa.' },
    { title: 'Achar que `@SpringBootApplication` faz mágica sem explicação', text: 'A anotação só marca a classe de configuração principal e ativa mecanismos que você verá nas aulas 7 a 8. Se você espera que "estar anotado" resolva problemas de lógica de negócio, vai se frustrar: **a lógica continua sendo sua**, escrita em classes comuns do módulo 2.' },
    { title: 'Deixar o console de erro passar enquanto a aplicação "sobe mesmo assim"', text: 'Muita gente para de ler o log assim que vê `Started TaskFlowApplication`. Erros de auto-configuração, porta ocupada e dependência faltando aparecem **antes** dessa linha. Ler o console de cima a baixo, procurando por `ERROR` e `WARNING`, economiza horas de depuração.' },
    { title: 'Escolher o starter pela metade', text: 'Precisar de validação no módulo 10 e esquecer o `spring-boot-starter-validation` é um erro clássico: a anotação existe na biblioteca, mas a dependência não está no projeto e o código nem compila. A regra é simples: **toda funcionalidade nova começa no `pom.xml`**, depois no código.' },
  ],

  bestPractices: [
    { title: 'Separe sempre Framework, Boot e projeto seu', text: 'Ao ler qualquer trecho de código ou documentação, classifique: isto é do Spring Framework (biblioteca), do Spring Boot (convenção/auto-configuração) ou do meu código de negócio? Essa separação acelera o entendimento de erros e de documentação oficial.' },
    { title: 'Leia o log de inicialização até o fim', text: 'A linha `Started ... in X seconds` é o marco de sucesso; qualquer coisa antes dela merece atenção. Confira também a porta anunciada (`Tomcat started on port 8080`) — metade dos erros "connection refused" no início são porta errada ou aplicação que não subiu.' },
    { title: 'Fixe as versões e documente o ambiente', text: 'Esta formação usa **Java 21 LTS** e **Spring Boot 4.1.2**. Anote as versões do seu JDK e do projeto; quando algo falhar em uma máquina e funcionar em outra, a comparação de versões é o primeiro teste a fazer.' },
    { title: 'Estude os conceitos na ordem em que são apresentados', text: 'IoC e DI (aula 2) parecem abstratos até você ver o container funcionando; HTTP (aulas 5 e 6) parece burocrático até o primeiro `curl` responder. Pular etapas cria lacunas que voltam como bugs difíceis de diagnosticar.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'O **Spring Framework** nasceu em 2002 como alternativa leve aos EJB: POJOs + container IoC + serviços transversais, sob licença Apache 2.0.',
      '"Spring" é uma **família de projetos**: Framework (núcleo), Boot, Data, Security, Test e Cloud.',
      'O **Spring Boot** (2014) aplica convenção sobre configuração: starters, auto-configuração, servidor embutido e recursos de produção.',
      'Boot **não substitui** o Framework: ele o configura e o faz subir com um comando só.',
      'Uma aplicação Boot começa em uma classe com `@SpringBootApplication` e `SpringApplication.run`, que cria o container e inicia o Tomcat na porta 8080.',
      'Os **starters** são dependências agregadas por funcionalidade; no Boot 4, `spring-boot-starter-web` virou `spring-boot-starter-webmvc`.',
      'Versões desta formação: **Java 21 LTS** e **Spring Boot 4.1.2** (linha compatível com Java 17 a 26).',
      'Tudo o que vier será aplicado na **TaskFlow API** (`/api/tasks`, `/api/tasks/{id}`).',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você entende a peça que sustenta o Spring inteiro — inversão de controle e injeção de dependência — começando por código Java puro, sem nenhuma anotação, para depois reconhecer o mesmo padrão dentro do container.' },
  ],

  exercises: [
    {
      id: 'm4l01e1',
      type: 'mc',
      question: 'Qual é a relação correta entre Spring Framework e Spring Boot?',
      options: [
        'São o mesmo produto com nomes diferentes',
        'O Spring Boot é um framework independente que substitui o Spring Framework',
        'O Spring Boot configura e simplifica o uso do Spring Framework',
        'O Spring Framework é a interface gráfica do Spring Boot',
      ],
      answer: 2,
      explanation: 'O **Spring Boot é uma camada de convenção por cima do Spring Framework**: ele resolve versões, escreve a configuração padrão e sobe o servidor embutido, mas quem executa o trabalho (container IoC, MVC, transações) é o Framework. Por isso a opção 1 está errada (nomes distintos para peças distintas), a 2 inverte a relação e a 4 descreve algo que não existe — não há interface gráfica no pacote.',
    },
    {
      id: 'm4l01e2',
      type: 'tf',
      question: 'Uma aplicação Spring Boot precisa de um servidor de aplicação externo (como WildFly ou Tomcat instalado à parte) instalado na máquina para funcionar.',
      answer: false,
      explanation: 'O Spring Boot traz **Tomcat embutido dentro do próprio JAR**: o servidor faz parte da aplicação e inicia junto com ela, como mostram as linhas `Tomcat initialized with port 8080` no log. É por isso que o deploy padrão é simplesmente executar `java -jar`. Servidores externos continuam existindo como opção, mas não são requisito.',
    },
    {
      id: 'm4l01e3',
      type: 'code',
      question: 'Um colega abriu o `pom.xml` do projeto TaskFlow e enviou o trecho abaixo. Qual afirmação está correta?',
      code: `<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>`,
      lang: 'xml',
      options: [
        'O trecho está correto: é o starter padrão para aplicações web',
        'O trecho é válido, mas usa um starter depreciado no Spring Boot 4; o equivalente atual é spring-boot-starter-webmvc',
        'O trecho não compila porque falta a tag <version>',
        'O trecho está errado porque starter nenhum pode ficar sem <scope>',
      ],
      answer: 1,
      explanation: 'No Spring Boot 4 o `spring-boot-starter-web` foi **renomeado para `spring-boot-starter-webmvc`** (a modularização também separou o suporte a WebFlux). A versão não é obrigatória porque vem herdada do `spring-boot-starter-parent`, o que derruba a alternativa 3; e starters funcionam perfeitamente sem `<scope>` — o padrão é escopo de compilação, derrubando a alternativa 4. O código até rodaria hoje (o antigo ainda existe como depreciado), mas não é o padrão desta formação.',
    },
    {
      id: 'm4l01e4',
      type: 'short',
      question: 'Explique, em duas frases, o que a linha `SpringApplication.run(TaskFlowApplication.class, args)` faz quando o main é executado.',
      keywords: [
        ['container', 'contexto', 'applicationcontext'],
        ['inicia', 'sobe', 'executa', 'cria'],
        ['servidor', 'tomcat', 'aplicação', 'aplicacao'],
      ],
      answerText: 'Ela inicializa o container do Spring (o contexto de beans), aplica a auto-configuração de acordo com as dependências do projeto e inicia o servidor embutido, deixando a aplicação aguardando requisições HTTP.',
      explanation: 'O método estático `run` é o ponto de partida do Spring Boot: ele cria o **container de beans** (conceito da aula 2), lê a configuração, executa a auto-configuração e sobe o **Tomcat embutido** na porta 8080. Depois disso, o processo principal apenas mantém a aplicação viva — por isso a última linha do log é `Started TaskFlowApplication`.',
    },
    {
      id: 'm4l01e5',
      type: 'mc',
      question: 'Você precisa adicionar validação de dados de entrada (anotações de restrição em campos) na TaskFlow API. Qual starter você inclui no pom.xml?',
      options: [
        'spring-boot-starter-test',
        'spring-boot-starter-validation',
        'spring-boot-starter-security',
        'spring-boot-starter-data-jpa',
      ],
      answer: 1,
      explanation: 'O **`spring-boot-starter-validation`** traz o Bean Validation com o Hibernate Validator, que é exatamente o que fornece as anotações de restrição de campos. O `spring-boot-starter-test` serve para testes (JUnit/Mockito), o `security` cuida de autenticação e autorização (módulo 6) e o `data-jpa` é de persistência (módulo 5) — nenhum deles valida dados de entrada por conta própria.',
    },
  ],

  challenge: {
    id: 'm4l01c1',
    title: 'Relatório do ecossistema Spring',
    fileName: 'EcossistemaSpring.java',
    prompt: 'Crie a classe `EcossistemaSpring` com um `main` que monte um relatório dos projetos do ecossistema Spring usados nesta formação. Modele cada projeto com um record chamado `ProjetoSpring` com três componentes: `nome` (texto), `papel` (texto curto) e `usadoNoCurso` (booleano). O programa deve conter uma lista com pelo menos 6 projetos (Framework, Boot, Data, Security, Test e Cloud), imprimir uma tabela alinhada com nome, papel e marcador "sim"/"nao" de uso no curso, e terminar com um resumo no formato `Usados no curso: X de Y`. Use Java 21 (records, `var`, `List.of`) e não use nenhuma classe do Spring: o objetivo é fixar o mapa conceitual.',
    starterCode: `import java.util.List;

public class EcossistemaSpring {

    record ProjetoSpring(String nome, String papel, boolean usadoNoCurso) {
    }

    public static void main(String[] args) {
        List<ProjetoSpring> projetos = List.of(
            // declare ao menos 6 projetos aqui
        );

        // imprima a tabela e o resumo
    }
}`,
    criteria: [
      'Declara o record ProjetoSpring com exatamente três componentes (nome, papel e usadoNoCurso booleano)',
      'A lista de projetos contém pelo menos 6 itens, incluindo Spring Framework, Spring Boot, Spring Data e Spring Security',
      'Existe laço (for, forEach ou stream) que percorre a lista imprimindo as três informações de cada projeto',
      'O marcador de uso no curso é derivado do booleano (valores "sim"/"nao" ou equivalente), e não digitado à mão por linha',
      'O programa imprime no final uma contagem no formato Usados no curso: X de Y, calculada a partir da lista',
      'O código compila em Java 21 sem dependências externas e não contém nenhuma anotação ou import do Spring',
    ],
    modelSolution: [
      { t: 'p', text: 'Abaixo, uma versão de referência. O essencial é a modelagem com record, a percorrerção da lista e a contagem calculada — o formato exato da tabela pode variar.' },
      {
        t: 'code',
        lang: 'java',
        caption: 'EcossistemaSpring.java',
        code: `import java.util.List;

public class EcossistemaSpring {

    record ProjetoSpring(String nome, String papel, boolean usadoNoCurso) {
    }

    public static void main(String[] args) {
        List<ProjetoSpring> projetos = List.of(
            new ProjetoSpring("Spring Framework", "Container IoC e nucleo web", true),
            new ProjetoSpring("Spring Boot", "Convencao e auto-configuracao", true),
            new ProjetoSpring("Spring Data", "Persistencia com JPA", true),
            new ProjetoSpring("Spring Security", "Autenticacao e autorizacao", true),
            new ProjetoSpring("Spring Test", "Suporte a testes integrados", true),
            new ProjetoSpring("Spring Cloud", "Infra para microservicos", false)
        );

        System.out.println("%-18s %-32s %s".formatted("PROJETO", "PAPEL", "NO CURSO"));
        for (ProjetoSpring p : projetos) {
            String marca = p.usadoNoCurso() ? "sim" : "nao";
            System.out.printf("%-18s %-32s %s%n", p.nome(), p.papel(), marca);
        }

        long usados = projetos.stream().filter(ProjetoSpring::usadoNoCurso).count();
        System.out.println("Usados no curso: " + usados + " de " + projetos.size());
    }
}`,
      },
      { t: 'p', text: 'Repare que a contagem usa `filter` sobre o booleano do record, então acrescentar ou remover projetos da lista atualiza o resumo automaticamente — é o tipo de detalhe que separa um relatório que se mantém de um que quebra na primeira mudança.' },
    ],
  },
}
