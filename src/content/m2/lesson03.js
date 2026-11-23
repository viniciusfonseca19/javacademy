export default {
  id: 'm2l03',
  moduleId: 'm2',
  number: 3,
  title: 'Construtores e a palavra-chave this',
  durationMinutes: 30,

  objectives: [
    'Explicar para que serve um construtor e por que ele existe em Java',
    'Declarar construtores com e sem parâmetros seguindo as regras de sintaxe',
    'Antecipar o efeito de remover o construtor padrão ao declarar o próprio',
    'Usar a palavra-chave `this` para desambiguar atributo e parâmetro',
    'Encadear construtores com `this(...)` para evitar repetição de código',
  ],

  prerequisites: [
    'Ter concluído a aula "Classes e objetos: atributos e métodos"',
    'Saber declarar atributos, métodos com retorno e chamadas com `new`',
    'Entender a diferença entre valor padrão (`null`, `0.0`) e valor atribuído',
    'Ter lido o módulo 1 inteiro, incluindo condicionais usadas nos exemplos',
  ],

  intro: [
    { t: 'p', text: 'No final da aula anterior, sua `ContaBancaria` nascia com `titular = null` e `saldo = 0.0` por causa dos valores padrão, e alguém precisava atribuir campo por campo logo depois do `new`. Funciona, mas é frágil: **esquecer uma linha deixa o objeto incompleto rodando pelo sistema** — e um objeto com titular nulo é um problema que só aparece quando alguém imprime o extrato.' },
    { t: 'p', text: 'O Java resolve isso com **construtores**: métodos especiais executados **automaticamente no momento do `new`**, com a missão de deixar o objeto pronto para uso. Nesta aula você vai declarar construtores com e sem parâmetros, descobrir o que acontece quando o construtor padrão "some", e dominar a palavra-chave **`this`**, que aparece em praticamente todo código Java que você ler daqui para frente.' },
    { t: 'p', text: 'Ao final, a `ContaBancaria` do projeto bancário já nascerá com titular, número e saldo inicial corretos em uma única linha — e você entenderá por que `this.saldo = saldo;` não é redundância, mas sim a forma canônica de inicializar um objeto em Java.' },
    { t: 'note', kind: 'tip', title: 'Sugestão de prática', text: 'Digite cada exemplo e depois tente **quebrar de propósito**: mude o nome do construtor, acrescente `void` na frente dele ou chame um construtor que não existe. As mensagens de erro do compilador são o melhor professor de sintaxe desta aula.' },
  ],

  theory: [
    { t: 'h2', text: 'O problema do objeto que nasce incompleto' },
    { t: 'p', text: 'Veja como ficava o uso da classe da aula anterior. Toda vez que uma conta era criada, o `main` precisava lembrar de preencher **todos** os campos — e nada no compilador garantia que isso acontecesse.' },
    { t: 'code', lang: 'java', caption: 'Principal.java (inicialização manual, frágil)', code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria c1 = new ContaBancaria();
        c1.titular = "Ana";
        c1.numero = "0001";
        c1.saldo = 1000.0;

        ContaBancaria c2 = new ContaBancaria();
        c2.titular = "Bruno";
        // esqueceu o numero e o saldo

        System.out.println(c2.numero);   // null
        System.out.println(c2.saldo);    // 0.0 - pode ser saldo real ou esquecimento
    }
}

class ContaBancaria {
    String titular;
    String numero;
    double saldo;
}` },
    { t: 'p', text: 'Nas linhas `c2.titular = "Bruno";` e no comentário `// esqueceu o numero e o saldo`, você vê o problema: **a criação do objeto e a inicialização dele são dois passos separados**, e nada impede executar só o primeiro. A saída `null` para `c2.numero` é a prova — o objeto existe, é válido para o compilador e ainda assim está incompleto para o negócio. Com dezenas de pontos de criação de conta no sistema, a probabilidade de alguém esquecer um campo chega a 100%.' },

    { t: 'h2', text: 'Construtor: o passo que o new executa' },
    { t: 'p', text: 'Um **construtor** é um método com **o mesmo nome da classe** e **sem tipo de retorno** — nem mesmo `void`. Ele é invocado **automaticamente** pela palavra-chave `new`, no instante exato em que o objeto ganha memória. Sua função é única e vitalícia: **deixar o objeto em estado utilizável**.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (primeiro construtor)', code: `public class ContaBancaria {
    String titular;
    String numero;
    double saldo;

    ContaBancaria(String nomeDaPessoa, String numeroDaConta, double valorInicial) {
        titular = nomeDaPessoa;
        numero = numeroDaConta;
        saldo = valorInicial;
        System.out.println("Conta de " + titular + " criada.");
    }

    public static void main(String[] args) {
        ContaBancaria ana = new ContaBancaria("Ana", "0001", 1000.0);
        System.out.println(ana.titular + " - R$ " + ana.saldo);
    }
}` },
    { t: 'p', text: 'Na linha `ContaBancaria(String nomeDaPessoa, ...)` está a declaração: o nome **bate exatamente** com o nome da classe e não há qualquer tipo antes dele — se você escrever `void ContaBancaria(...)`, o compilador acusa erro, porque `void` só é aceito em métodos comuns. Nas linhas `titular = nomeDaPessoa;`, `numero = numeroDaConta;` e `saldo = valorInicial;`, os **parâmetros do construtor** alimentam os **atributos do objeto recém-criado**. Na linha `ContaBancaria ana = new ContaBancaria("Ana", "0001", 1000.0);`, o `new` faz três coisas em sequência: aloca o objeto na memória, **chama o construtor** passando os argumentos e devolve a referência para a variável `ana`. Por isso a mensagem `Conta de Ana criada.` aparece antes de qualquer outra linha do programa.' },
    { t: 'note', kind: 'info', title: 'Construtor não é método comum', text: 'Métodos comuns são chamados pelo objeto: `ana.depositar(50.0)`. Construtores são chamados **apenas pelo `new`**: não existe sintaxe `ana.ContaBancaria(...)` no Java. Também não se pode chamar um construtor antes de existir objeto — ele **é** o momento de criação.' },

    { t: 'h2', text: 'O construtor padrão e o efeito de declarar o seu' },
    { t: 'p', text: 'Enquanto você **não** declara nenhum construtor, o compilador injeta automaticamente um construtor sem parâmetros que apenas aloca o objeto (sem inicializar nada além dos valores padrão). No momento em que você declara **qualquer** construtor, essa generosidade termina: o construtor padrão **não é mais gerado**.' },
    { t: 'code', lang: 'java', caption: 'Principal.java (erro: construtor padrão removido)', code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria c = new ContaBancaria();   // ERRO de compilacao
        c.titular = "Ana";
    }
}

class ContaBancaria {
    String titular;
    String numero;
    double saldo;

    ContaBancaria(String nomeDaPessoa, String numeroDaConta, double valorInicial) {
        titular = nomeDaPessoa;
        numero = numeroDaConta;
        saldo = valorInicial;
    }
}` },
    { t: 'p', text: 'A linha `ContaBancaria c = new ContaBancaria();` **não compila** com a mensagem "no suitable constructor found for ContaBancaria()". O motivo está na declaração do construtor com três parâmetros: assim que você escreveu **um** construtor, o compilador parou de gerar o construtor vazio — e `new ContaBancaria()` passou a procurar um construtor sem parâmetros que **não existe mais**. A correção tem dois caminhos: passar os três argumentos na chamada, ou declarar **também** um construtor sem parâmetros se ele fizer sentido para o seu domínio. Em sistemas reais, a segunda alternativa é comum quando existe um estado neutro razoável (conta "sem titular", por exemplo).' },
    { t: 'p', text: 'Vale registrar uma consequência prática: enquanto a aula anterior criava contas com `new ContaBancaria()` e valores padrão, agora o compilador **obriga** você a fornecer os dados iniciais. Essa é a primeira vitória do construtor — o objeto incompleto deixou de ser possível.' },

    { t: 'h2', text: 'Construtores com e sem parâmetros convivendo' },
    { t: 'p', text: 'Dois construtores de **nomes iguais e listas de parâmetros diferentes** podem coexistir na mesma classe. Essa técnica se chama **sobrecarga** e é perfeitamente legal; veremos a sobrecarga de métodos comuns na aula 9, mas com construtores ela já cabe aqui.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (construtor vazio e construtor completo)', code: `public class ContaBancaria {
    String titular;
    String numero;
    double saldo;

    ContaBancaria() {
        titular = "nao informado";
        numero = "0000";
        saldo = 0.0;
    }

    ContaBancaria(String nomeDaPessoa, String numeroDaConta, double valorInicial) {
        titular = nomeDaPessoa;
        numero = numeroDaConta;
        saldo = valorInicial;
    }

    public static void main(String[] args) {
        ContaBancaria padrao = new ContaBancaria();
        ContaBancaria personalizada = new ContaBancaria("Carla", "0002", 500.0);

        System.out.println(padrao.titular);            // nao informado
        System.out.println(personalizada.titular);     // Carla
    }
}` },
    { t: 'p', text: 'Nas duas declarações `ContaBancaria() {` e `ContaBancaria(String nomeDaPessoa, ...)` o compilador decide **qual construtor usar** pela quantidade e pelos tipos dos argumentos da chamada: `new ContaBancaria()` escolhe o primeiro, `new ContaBancaria("Carla", "0002", 500.0)` escolhe o segundo. Repare também na linha `titular = "nao informado";` do construtor vazio: ela define um **estado inicial coerente** em vez de deixar `null` — decisão de negócio, não de sintaxe. Se você criar uma terceira variante `ContaBancaria("Ana")`, o compilador continuará aceitando: cada lista de parâmetros é uma porta de entrada distinta.' },

    { t: 'h2', text: 'A palavra-chave this: o objeto que está naquele momento' },
    { t: 'p', text: '`this` é uma referência ao **objeto atual** — aquele que está executando o método (ou construtor) agora. Dentro de `ana.depositar(...)`, `this` aponta para `ana`; dentro de `bruno.sacar(...)`, aponta para `bruno`. Ele resolve o problema mais clássico dos construtores: **parâmetro e atributo com o mesmo nome**.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (this na desambiguação)', code: `public class ContaBancaria {
    String titular;
    String numero;
    double saldo;

    ContaBancaria(String titular, String numero, double saldo) {
        this.titular = titular;
        this.numero = numero;
        this.saldo = saldo;
    }

    void depositar(double valor) {
        this.saldo = this.saldo + valor;
    }

    public static void main(String[] args) {
        ContaBancaria ana = new ContaBancaria("Ana", "0001", 1000.0);
        ana.depositar(200.0);
        System.out.println(ana.titular + ": R$ " + ana.saldo);
    }
}` },
    { t: 'p', text: 'Na assinatura `ContaBancaria(String titular, String numero, double saldo)`, os parâmetros receberam **os mesmos nomes** dos atributos — convenção muito comum porque deixa o código limpo. Sem `this`, a linha `titular = titular;` seria inofensiva: leria e gravaria o **parâmetro** em si mesmo, deixando o atributo intacto. Por isso a linha correta é `this.titular = titular;`: à esquerda do `=`, `this.titular` alcança o **atributo do objeto**; à direita, `titular` é o **parâmetro** recebido. O mesmo vale dentro de `depositar`: `this.saldo = this.saldo + valor;` deixa explícito que o saldo alterado é o do objeto dono da chamada.' },
    { t: 'p', text: 'Importante: **`this` não é obrigatório quando não há ambiguidade**. Dentro de `depositar`, escrever apenas `saldo = saldo + valor;` funcionaria idêntico, porque não existe parâmetro chamado `saldo` ali. O uso `this.` é exigido pelo compilador **só** quando o nome do parâmetro colide com o do atributo. Muitos times adotam `this.` sempre, para manter um padrão visual único — as duas posturas são válidas.' },
    { t: 'note', kind: 'warn', title: 'this não é o nome do objeto', text: '`this` **não** substitui o nome da variável: `this.ana` não existe, e `this` dentro de um método `static` também não existe (veremos `static` na aula 6). Para referir-se ao objeto atual, use `this`; para referir-se à variável do `main`, use o nome dela.' },

    { t: 'h2', text: 'Encadeando construtores com this(...)' },
    { t: 'p', text: 'Quando dois construtores fazem a mesma inicialização, repetir as atribuições é um convite ao bug: mudou em um e esqueceu no outro. A forma profissional de evitar é fazer um construtor **chamar o outro** com `this(...)` — desde que essa chamada seja a **primeira instrução** do construtor.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (delegação com this(...))', code: `public class ContaBancaria {
    String titular;
    String numero;
    double saldo;

    ContaBancaria() {
        this("nao informado", "0000", 0.0);
    }

    ContaBancaria(String titular) {
        this(titular, "0000", 0.0);
    }

    ContaBancaria(String titular, String numero, double saldo) {
        this.titular = titular;
        this.numero = numero;
        this.saldo = saldo;
    }

    public static void main(String[] args) {
        ContaBancaria a = new ContaBancaria();
        ContaBancaria b = new ContaBancaria("Bruno");
        System.out.println(a.titular + " | " + b.titular);
    }
}` },
    { t: 'p', text: 'Na linha `this("nao informado", "0000", 0.0);` dentro do construtor sem parâmetros, `this(...)` despacha a chamada para o **construtor de três parâmetros** — que é o único lugar onde as atribuições `this.titular = titular;` estão escritas. O construtor `ContaBancaria(String titular)` faz o mesmo com `this(titular, "0000", 0.0);`, reaproveitando a implementação. Resultado: **uma única fonte de verdade** para a inicialização completa, e variantes apenas resolvem valores de partida. A saída esperada é `nao informado | Bruno`. Se você escrever `this(...)` em qualquer lugar que não seja a primeira linha, o compilador responde com "call to this must be first statement in constructor".' },

    { t: 'h2', text: 'Erros clássicos de construtor' },
    { t: 'p', text: 'Construtores têm regras de sintaxe próprias, e os erros mais frequentes de iniciante são todos previsíveis. Confira a lista com a mensagem que o compilador devolve.' },
    { t: 'ul', items: [
      '**Escrever um tipo de retorno**: `void ContaBancaria(...)` ou `double ContaBancaria(...)` gera "invalid method declaration; return type required" — o compilador interpreta o nome como método comum sem tipo, o que é ilegal. Construtores **nunca** têm tipo de retorno.',
      '**Dar outro nome ao construtor**: `void CriarConta(...)` compila como método comum, e a chamada `new ContaBancaria()` volta a procurar o construtor padrão (que não existe mais). O nome do construtor **precisa** ser exatamente o da classe.',
      '**Retornar valor dentro do construtor**: `return 10;` em construtor é erro de compilação — construtores não devolvem nada, nem mesmo `void` permite retorno.',
      '**Chamar this(...) fora da primeira linha**: como vimos, o encadeamento precisa começar o construtor, senão o estado poderia ser reescrito depois de já inicializado.',
      '**Chamar um construtor da classe sem new**: `conta.ContaBancaria("Ana", ...)` não existe como sintaxe; construtores só são alcançados por `new` (ou por `this(...)`/`super(...)` de outro construtor).',
    ] },
    { t: 'p', text: 'Nenhum desses erros chega ao runtime: todos são **capturados na compilação**. É a tipagem estática trabalhando a seu favor — a JVM nunca verá um objeto criado com construtor errado.' },

    { t: 'h2', text: 'Construtores no projeto bancário' },
    { t: 'p', text: 'Reunindo a aula: a `ContaBancaria` do nosso módulo passa a ter duas portas de entrada — uma completa (para o sistema criar contas de verdade) e uma com valores neutros (para testes e rascunhos) —, com `this` garantindo que os nomes fiquem legíveis e sem duplicação de atribuições. Este é o formato que você reutilizará nas aulas 4 e 5, quando o encapsulamento tornar os atributos `private` e os construtores passarem a ser o **único ponto de entrada** para criar um objeto consistente.' },
    { t: 'note', kind: 'info', title: 'Construtores privados aparecem depois', text: 'Você verá construtores com modificadores de acesso diferentes (inclusive `private`, para impedir instanciação) nas aulas 4 e 5, e um uso avançado deles em padrões de projeto. Por ora, mantenha construtores públicos ou sem modificador: o foco é a mecânica de criação.' },
  ],

  commonMistakes: [
    { title: 'Escrever `void` (ou qualquer tipo) na frente do construtor', text: 'Construtores **não têm** tipo de retorno — nem `void`. `void ContaBancaria(String t)` é lido pelo compilador como um método comum chamado `ContaBancaria` sem tipo declarado, o que gera erro de declaração. Basta remover `void` e manter o nome igual ao da classe.' },
    { title: 'Esquecer que declarar um construtor apaga o padrão', text: 'Assim que você declara `ContaBancaria(String titular, ...)`, a chamada `new ContaBancaria()` deixa de funcionar, porque o construtor vazio automático não é mais gerado. Se ambas as formas forem necessárias, declare as duas — o compilador só insere o padrão quando **nenhum** construtor foi escrito.' },
    { title: 'Achar que `this.saldo = saldo` é redundante', text: 'Na linha `this.saldo = saldo;`, os dois lados têm o mesmo nome mas significados diferentes: `this.saldo` é o **atributo** e `saldo` é o **parâmetro**. Tirar o `this.` da esquerda transforma a linha em `saldo = saldo;`, que não muda o objeto — o atributo continuaria com o valor padrão `0.0`.' },
    { title: 'Chamar `this(...)` depois da primeira linha', text: 'O encadeamento de construtores deve ser a **primeira instrução**, senão o compilador acusa "call to this must be first statement in constructor". A regra existe porque o outro construtor precisa garantir o estado base antes de qualquer coisa acontecer no construtor chamador.' },
    { title: 'Tratar construtor como método e tentar chamá-lo depois', text: '`conta.ContaBancaria("Ana")` não é sintaxe Java: construtores só rodam no instante do `new`. Se você precisa "reconstruir" um objeto depois, o caminho é criar um objeto novo com `new` — o tema dos próximos módulos trará alternativas como fábricas.' },
  ],

  bestPractices: [
    { title: 'Inicialize sempre pelo construtor', text: 'Nunca deixe o chamador preencher campo por campo depois do `new`. O construtor é o único lugar que garante que o objeto **nasce completo**, e o compilador passa a cobrar isso para você em todos os pontos de criação.' },
    { title: 'Adote os nomes de parâmetro iguais aos dos atributos', text: 'Com `this.` de um lado e o parâmetro do outro, a linha `this.titular = titular;` é autoexplicativa e aceita qualquer reordenação de parâmetros sem risco de troca. É o padrão de toda a indústria Java e o que você verá no Spring.' },
    { title: 'Delegue com this(...) em vez de repetir atribuições', text: 'Quando dois construtores fazem quase a mesma coisa, faça o menor chamar o maior. Assim, mudar uma regra de inicialização acontece em um ponto só — exatamente o princípio que guia métodos desde a aula anterior.' },
    { title: 'Mantenha construtores enxutos', text: 'Construtor ideal só **atribui** valores (talvez com uma validação curta). Cálculos longos, leitura de arquivo ou chamadas de rede no construtor tornam o objeto caro de criar e difícil de testar — mova essa lógica para métodos comuns.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Construtor é executado **automaticamente pelo `new`** e tem a função de deixar o objeto pronto para uso.',
      'Sintaxe: **nome igual ao da classe**, **sem tipo de retorno** (nem `void`), com parâmetros livres.',
      'Enquanto você não declara nenhum, o compilador gera um construtor **sem parâmetros**; declarar o seu apaga esse padrão.',
      'Vários construtores convivem se as **listas de parâmetros diferirem** — o compilador escolhe pela chamada.',
      '`this` é a referência ao **objeto atual** e resolve colisão entre parâmetro e atributo (`this.saldo = saldo;`).',
      '`this(...)` faz um construtor **chamar outro da mesma classe**, desde que seja a primeira instrução.',
      'Erros de construtor (`void` no nome, retorno, `this(...)` fora da primeira linha) são todos de **compilação**.',
      'No projeto bancário, o construtor passa a ser o ponto único de criação de `ContaBancaria` consistente.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você esconde os atributos com o modificador `private` e descobre por que o compilador passa a impedir `conta.saldo = -1000;`. É o encapsulamento — o pilar que sustenta getters, setters e validação da aula 5.' },
  ],

  exercises: [
    {
      id: 'm2l03e1',
      type: 'mc',
      question: 'Uma classe declara exatamente este construtor: `ContaBancaria(String titular, double saldo)`. Qual chamada está correta?',
      options: [
        '`new ContaBancaria()`',
        '`new ContaBancaria("Ana", 1000.0)`',
        '`new ContaBancaria(1000.0, "Ana")`',
        '`ContaBancaria("Ana", 1000.0)` sem `new`',
      ],
      answer: 1,
      explanation: 'Com um construtor declarado, o compilador **não** gera mais o padrão — por isso a opção 1 falha. A opção 3 inverte a ordem dos argumentos (`String` antes de `double`) e também não compila. A opção 4 omite o `new`, que é obrigatório para criar o objeto e invocar o construtor. A opção 2 respeita ordem e tipos: `String` recebe `"Ana"` e `double` recebe `1000.0`.',
    },
    {
      id: 'm2l03e2',
      type: 'tf',
      question: 'Ao declarar um construtor com parâmetros em uma classe, o construtor padrão (sem parâmetros) continua disponível automaticamente.',
      answer: false,
      explanation: 'O construtor padrão é gerado **apenas quando a classe não tem nenhum construtor declarado**. Assim que você escreve `ContaBancaria(String titular, ...)`, o padrão deixa de existir e `new ContaBancaria()` passa a gerar erro de compilação. Se a forma vazia for necessária, ela precisa ser declarada explicitamente na classe.',
    },
    {
      id: 'm2l03e3',
      type: 'code',
      question: 'O programa abaixo não compila. Qual é a causa do erro?',
      code: `public class Cliente {
    String nome;
    String email;

    void Cliente(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }

    public static void main(String[] args) {
        Cliente c = new Cliente("Ana", "ana@email.com");
    }
}`,
      lang: 'java',
      options: [
        'Os atributos `nome` e `email` precisam ser `private` para receber `this`',
        'O `void` à frente de `Cliente(...)` faz daquilo um método comum, e o construtor com dois parâmetros não existe',
        'A chamada `new Cliente(...)` exige três argumentos, não dois',
        'O `main` não pode criar objetos da própria classe em que está declarado',
      ],
      answer: 1,
      explanation: 'A linha `void Cliente(String nome, String email)` declara um **método comum** chamado `Cliente` que não retorna nada — construtores nunca têm tipo de retorno. Como nenhum construtor real foi declarado, vale o padrão sem parâmetros, e `new Cliente("Ana", "ana@email.com")` não encontra construtor compatível ("no suitable constructor found"). Corrigindo: remover o `void` transforma a linha em construtor verdadeiro e tudo passa a compilar.',
    },
    {
      id: 'm2l03e4',
      type: 'short',
      question: 'Explique por que um construtor não possui tipo de retorno, nem mesmo `void`.',
      keywords: [
        ['new', 'cria', 'criação', 'criacao', 'instanci', 'momento'],
        ['retorno', 'devolve', 'retorna', 'nao devolve', 'não devolve'],
        ['objeto', 'referencia', 'referência'],
      ],
      answerText: 'O construtor não devolve valor algum porque ele não é chamado para produzir resultado: o `new` já cria o objeto e devolve a referência. Por isso declarar tipo (inclusive `void`) não faz sentido — o compilador rejeita, pois `void` indicaria método comum sem retorno.',
      explanation: 'A resposta certa conecta as duas ideias: **quem devolve a referência é o `new`**, não o construtor; o construtor apenas **inicializa** o objeto já alocado. Um detalhe que completa a explicação: o construtor é identificado pelo nome da classe e pela lista de parâmetros, e qualquer tipo na frente dele faria o compilador ler a declaração como método comum — que aí sim exigiria retorno.',
    },
    {
      id: 'm2l03e5',
      type: 'code',
      question: 'Considere a classe e o `main` abaixo. O que é impresso na saída?',
      code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria a = new ContaBancaria("Ana", "0001", 1000.0);
        ContaBancaria b = new ContaBancaria();
        System.out.println(a.titular + " | " + b.titular);
    }
}

class ContaBancaria {
    String titular;
    String numero;
    double saldo;

    ContaBancaria() {
        this("nao informado", "0000", 0.0);
    }

    ContaBancaria(String titular, String numero, double saldo) {
        this.titular = titular;
        this.numero = numero;
        this.saldo = saldo;
    }
}`,
      lang: 'java',
      options: [
        '`Ana | null`',
        '`Ana | nao informado`',
        'Erro de compilação: o construtor vazio chama this(...) depois da primeira linha',
        'Erro de compilação: dois construtores não podem coexistir na mesma classe',
      ],
      answer: 1,
      explanation: '`new ContaBancaria()` encontra o construtor sem parâmetros, cuja **primeira e única** instrução é `this("nao informado", "0000", 0.0);` — chamada válida porque ocupa a primeira linha. Essa chamada despacha para o construtor completo, que grava os três valores com `this.`. Resultado: `b.titular` vale `nao informado` (não `null`), enquanto `a.titular` vale `Ana`. Vários construtores com listas diferentes de parâmetros convivem normalmente: é sobrecarga.',
    },
  ],

  challenge: {
    id: 'm2l03c1',
    title: 'Clientes criados pelo construtor',
    fileName: 'Cliente.java',
    prompt: 'Crie o arquivo `Cliente.java` com uma classe `public Cliente` que tenha `main` próprio (para rodar com `javac Cliente.java` e `java Cliente`). Atributos: `String nome`, `String email` e `double saldoInicial`, todos iniciados **somente** por construtores — nenhum atributo pode ser preenchido campo a campo no `main`. Implemente três construtores: `Cliente()` que delega para o completo usando `this(...)` passando "sem nome", "sem email" e `0.0`; `Cliente(String nome)` que delega passando o nome informado, "sem email" e `0.0`; e `Cliente(String nome, String email, double saldoInicial)` que faz as atribuições usando `this.nome = nome;` (e analogamente para os outros dois campos). Adicione um método `void exibirDados()` que imprima uma linha no formato `Nome: <nome> - Email: <email> - Saldo inicial: R$ <saldoInicial>`. No `main`, crie os três tipos de cliente e chame `exibirDados()` em cada um.',
    starterCode: `public class Cliente {
    String nome;
    String email;
    double saldoInicial;

    // tres construtores aqui (um delegando para outro com this(...))

    void exibirDados() {
        // imprima os tres dados do objeto
    }

    public static void main(String[] args) {
        // crie um cliente completo, um so com nome e um vazio
    }
}`,
    criteria: [
      'A classe declara os atributos `nome`, `email` e `saldoInicial` e **nenhum** deles é atribuído diretamente no `main`',
      'Existe um construtor de três parâmetros que atribui os campos usando `this.nome`, `this.email` e `this.saldoInicial`',
      'O construtor sem parâmetros usa `this(...)` como **primeira instrução** para delegar ao construtor completo',
      'O construtor com um parâmetro (`String nome`) também delega via `this(...)` com os valores padrão para email e saldo',
      'O método `exibirDados()` imprime nome, email e saldo inicial de cada objeto criado',
      'O programa compila e a saída mostra os três clientes com os valores esperados (inclusive `sem nome` no cliente vazio)',
    ],
    modelSolution: [
      { t: 'p', text: 'Referência da solução: os dois construtores curtos **não repetem** atribuições — eles apenas resolvem os valores de partida e delegam ao construtor completo, que é o único lugar que conhece os nomes dos atributos.' },
      { t: 'code', lang: 'java', caption: 'Cliente.java', code: `public class Cliente {
    String nome;
    String email;
    double saldoInicial;

    Cliente() {
        this("sem nome", "sem email", 0.0);
    }

    Cliente(String nome) {
        this(nome, "sem email", 0.0);
    }

    Cliente(String nome, String email, double saldoInicial) {
        this.nome = nome;
        this.email = email;
        this.saldoInicial = saldoInicial;
    }

    void exibirDados() {
        System.out.println("Nome: " + nome + " - Email: " + email
                + " - Saldo inicial: R$ " + saldoInicial);
    }

    public static void main(String[] args) {
        Cliente completo = new Cliente("Ana", "ana@email.com", 1500.0);
        Cliente apenasNome = new Cliente("Bruno");
        Cliente vazio = new Cliente();

        completo.exibirDados();
        apenasNome.exibirDados();
        vazio.exibirDados();
    }
}` },
      { t: 'p', text: 'A saída esperada é `Nome: Ana - Email: ana@email.com - Saldo inicial: R$ 1500.0`, `Nome: Bruno - Email: sem email - Saldo inicial: R$ 0.0` e `Nome: sem nome - Email: sem email - Saldo inicial: R$ 0.0`. Se algum campo aparecer como `null`, é sinal de que o construtor completo deixou de atribuir aquele campo — repare que todos os caminhos de criação passam por ele.' },
    ],
  },
}
