export default {
  id: 'm2l11',
  moduleId: 'm2',
  number: 11,
  title: 'Interfaces',
  durationMinutes: 32,

  objectives: [
    'Definir uma interface em Java e declarar nela um contrato de métodos',
    'Implementar interfaces com as palavras-chave implements e @Override',
    'Distinguir interface de classe abstrata e escolher a ferramenta adequada',
    'Usar uma interface como tipo de referência para aplicar polimorfismo',
    'Modelar capacidades de um sistema bancário como interfaces',
  ],

  prerequisites: [
    'Ter concluído a aula "Classes abstratas"',
    'Saber declarar atributos privados, métodos e construtores em uma classe',
    'Compreender herança, sobrescrita de métodos e polimorfismo',
    'Ter compilado e executado programas com os comandos javac e java',
  ],

  intro: [
    { t: 'p', text: 'Imagine que você fabrica carregadores. Se cada aparelho exigisse um conector diferente, você precisaria de um molde novo para cada modelo. O padrão USB-C resolve isso: **quem fabrica o aparelho e quem fabrica o carregador seguem o mesmo contrato**, e qualquer combinação funciona. Ninguém precisa conhecer o projeto interno do outro — apenas a forma do conector e as regras de energia.' },
    { t: 'p', text: 'Interfaces faz exatamente isso no Java. Ela declara **o que um objeto pode fazer, sem dizer como ele faz**. Quem implementa a interface assume o contrato por escrito; quem usa a interface pode confiar no contrato sem conhecer as classes concretas. É o mecanismo que permite trocar uma `ContaCorrente` por uma `ContaPoupanca` em um mesmo trecho de código sem reescrever nada.' },
    { t: 'p', text: 'Nesta aula você vai aprender a declarar interfaces, a implementá-las com `implements`, a entender as regras de sintaxe (incluindo atributos constantes e métodos `default`), a implementar mais de um contrato na mesma classe e a usar a interface como **tipo de referência** para aplicar polimorfismo. No final, você compara interface com a classe abstrata que viu na aula anterior e entende em qual situação usar cada uma.' },
    { t: 'note', kind: 'tip', title: 'Contexto do módulo', text: 'Todos os exemplos usam o domínio bancário que acompanha o módulo: `Tributavel`, `ContaCorrente` e `ContaPoupanca`. Os mesmos nomes reaparecem no projeto do módulo, o Sistema Bancário.' },
  ],

  theory: [
    { t: 'h2', text: 'O que é uma interface' },
    { t: 'p', text: 'Uma **interface** é um tipo definido em Java com a palavra-chave `interface` que declara um conjunto de métodos **sem corpo** — apenas a assinatura (nome, parâmetros e tipo de retorno). Ela funciona como um contrato: quem implementa a interface promete cumprir todos os métodos declarados, e quem usa a interface pode chamá-los sem saber qual classe está por trás.' },
    { t: 'p', text: 'Perceba a diferença em relação ao que você já viu. Uma **classe** modela *o que um objeto é* e guarda estado (atributos). Uma **interface** modela *o que um objeto pode fazer*, sem estado algum. Por isso uma interface não tem construtores, não guarda dados de instância e não executa nada por conta própria: ela só descreve capacidades.' },
    { t: 'p', text: 'No sistema bancário, a capacidade "calcular tributo sobre o saldo" interessa a qualquer tipo de conta, mas cada tipo calcula de um jeito. Em vez de exigir que todo mundo conheça `ContaCorrente` e `ContaPoupanca`, declaramos uma única interface.' },
    { t: 'code', lang: 'java', caption: 'Tributavel.java', code: `public interface Tributavel {
    double calcularTributo();
}` },
    { t: 'p', text: 'Vamos à leitura linha por linha: na primeira linha, `public interface Tributavel` declara o tipo — repare que a palavra `class` é substituída por `interface`, e o arquivo se chama `Tributavel.java` (mesma regra de nome do arquivo que já conhecemos). Na segunda linha, `double calcularTributo();` é a declaração de um método: ele tem retorno `double`, não recebe parâmetros e **termina com ponto e vírgula porque não tem corpo**. Não há chave `{}` de implementation aqui — o corpo ficará nas classes que implementarem o contrato.' },
    { t: 'note', kind: 'info', title: 'Por que "Tributavel"?', text: 'Em Java, interfaces costumam receber nomes de **capacidade** no feminino ou com o sufixo `-vel`: `Tributavel`, `Exportavel`, `Notificavel`, `Comparable`. O nome lê-se "algo que pode ser tributável" — ou seja, qualquer objeto que cumpre esse contrato sabe calcular o próprio tributo.' },

    { t: 'h2', text: 'Implementando o contrato com implements' },
    { t: 'p', text: 'Uma classe assume um contrato com a palavra-chave **`implements`**, escrita logo após o nome da classe (depois de `extends`, quando existir herança). Na prática, a classe precisa fornecer o corpo de **todos** os métodos abstratos da interface — e é aí que a promessa vira código.' },
    { t: 'code', lang: 'java', caption: 'ContaCorrente.java', code: `public class ContaCorrente implements Tributavel {
    private double saldo;

    public ContaCorrente(double saldoInicial) {
        this.saldo = saldoInicial;
    }

    public double getSaldo() {
        return saldo;
    }

    @Override
    public double calcularTributo() {
        return saldo * 0.01;   // 1% do saldo
    }
}` },
    { t: 'p', text: 'Linha por linha: `public class ContaCorrente implements Tributavel` declara que a classe cumpre o contrato — a partir desse momento o compilador **exige** `calcularTributo()` dentro dela. `private double saldo` mantém o estado encapsulado (aula 4), e o construtor `ContaCorrente(double saldoInicial)` apenas inicializa esse estado. O método `getSaldo()` expõe o saldo para leitura. Por fim, `@Override` (a anotação com `@` que já vimos na sobrescrita) marca que `calcularTributo()` substitui a declaração abstrata da interface; dentro dele, `saldo * 0.01` aplica a taxa de 1% diretamente na fórmula — daqui a pouco veremos como transformar esse número em uma constante da própria interface.' },
    { t: 'p', text: 'Se você esquecer o `implements`, nada acontece: a classe compila normalmente, só que ela **não é** um `Tributavel`. Agora o contrário é impossível: se a classe declara `implements Tributavel` e não escreve `calcularTributo()`, o compilador para a build com uma mensagem direta — *"ContaCorrente não é abstrata e não implementa o método abstrato calcularTributo()"*. Essa verificação é a grande vantagem do contrato: **o erro aparece na compilação, não em produção**.' },
    { t: 'note', kind: 'warn', title: 'Anotação @Override é opcional, mas recomendável', text: 'Você não é obrigado a escrever `@Override` em métodos que implementam uma interface. Porém, escrevê-la faz o compilador conferir a assinatura: se você errar um nome ou esquecer um parâmetro, o erro aparece imediatamente em vez de virar uma classe abstrata não implementada.' },

    { t: 'h2', text: 'Regras de declaração de uma interface' },
    { t: 'p', text: 'Interfaces seguem regras próprias de sintaxe. Algumas você já deve ter notado nas linhas anteriores; outras aparecem quando o contrato precisa de um pouco mais do que métodos abstratos.' },
    { t: 'ul', items: [
      '**Métodos são `public` e `abstract` por padrão**: você não escreve essas palavras, mas elas existem implicitamente. Não é possível declarar um método de interface com visibilidade `private` ou protegida (a partir do Java 9 existem apenas métodos `private` auxiliares, com corpo, para reaproveitar código dentro da própria interface).',
      '**Atributos são constantes**: qualquer campo declarado em uma interface é automaticamente `public static final` — ou seja, pertence à interface (não a cada objeto) e não pode ser alterado depois.',
      '**Não há construtores**: como não existe estado de instância, não faz sentido criar objetos da interface; só as classes implementadoras são instanciadas.',
      '**Uma classe pode implementar vários contratos**: diferente da herança de classes, que é única, `implements` aceita uma lista separada por vírgulas.',
      '**Interfaces também podem herdar**: uma interface pode usar `extends` para combinar com outras interfaces (uma forma de reuso de contrato).',
      '**Desde o Java 8 existem métodos com corpo**: os `default` e `static`. Desde o Java 9, também métodos `private` auxiliares.',
    ] },
    { t: 'code', lang: 'java', caption: 'Tributavel.java (com constante e método default)', code: `public interface Tributavel {
    // Constante da interface: implicitamente public static final
    double TAXA_PADRAO = 0.01;

    // Contrato que cada implementadora precisa cumprir
    double calcularTributo();

    // Método com corpo, disponível para quem implementa
    default double aplicarTributoPadrao(double valor) {
        return valor * TAXA_PADRAO;
    }
}` },
    { t: 'p', text: 'Neste exemplo, a linha `double TAXA_PADRAO = 0.01;` declara uma **constante**: ela pertence à interface, é acessível como `Tributavel.TAXA_PADRAO` e nenhuma implementadora consegue alterá-la. Já `double calcularTributo();` continua sendo o contrato sem corpo. A novidade está no bloco `default double aplicarTributoPadrao(double valor)`: o método **já vem com implementação** e é herdado por todas as classes que implementam a interface — elas podem usá-lo como estão ou sobrescrevê-lo se quiserem um cálculo diferente. É como um contrato que já traz uma cláusula pronta.' },
    { t: 'p', text: 'Por que métodos `default` existem? Antes do Java 8, acrescentar um método a uma interface quebrava todas as classes que já a implementavam (o compilador passaria a exigir o novo método). Com `default`, a evolução do contrato não quebra ninguém: quem já implementa continua compilando e só passa a usar o novo comportamento se fizer sentido.' },

    { t: 'h2', text: 'Uma classe, vários contratos' },
    { t: 'p', text: 'Java não permite herança múltipla de classes (`class A extends B, C` não existe), mas **permite implementar várias interfaces**. Isso é o que resolve a limitação: em vez de herdar comportamento de vários pais, a classe assume várias capacidades independentes. Uma conta, por exemplo, pode ser ao mesmo tempo tributável e exportável para relatório.' },
    { t: 'code', lang: 'java', caption: 'Exportavel.java e ContaCorrente.java', code: `// ---- Arquivo: Exportavel.java ----
public interface Exportavel {
    String gerarRelatorio();
}

// ---- Arquivo: ContaCorrente.java ----
public class ContaCorrente implements Tributavel, Exportavel {
    private double saldo;

    public ContaCorrente(double saldoInicial) {
        this.saldo = saldoInicial;
    }

    @Override
    public double calcularTributo() {
        return saldo * Tributavel.TAXA_PADRAO;
    }

    @Override
    public String gerarRelatorio() {
        return "Conta corrente com saldo de " + saldo;
    }
}` },
    { t: 'p', text: 'Observe a lista em `implements Tributavel, Exportavel`: são dois contratos separados por vírgula, e a classe precisa cumprir os dois — por isso aparecem os dois métodos com `@Override`, um vindo de cada interface. Se `ContaCorrente` implementasse apenas `calcularTributo()` e deixasse `gerarRelatorio()` de fora, a compilação falharia com a mesma mensagem de "não implementa o método abstrato". Os arquivos `Exportavel.java` e `ContaCorrente.java` ficam em pastas diferentes, mas podem ser compilados juntos com um único comando `javac` recebendo os dois caminhos.' },
    { t: 'p', text: 'Repare também na ordem do `implements` quando há herança: `class ContaCorrente extends Conta implements Tributavel, Exportavel` — `extends` vem primeiro, `implements` depois, sempre nessa ordem. Você usará exatamente essa linha no projeto do módulo.' },

    { t: 'h2', text: 'Interface como tipo: polimorfismo de verdade' },
    { t: 'p', text: 'Até agora você usou polimorfismo com classes abstratas: uma variável do tipo `Conta` apontava para `ContaCorrente` ou `ContaPoupanca`. A mesma mecânica funciona com interfaces — e é aqui que elas pagam o pedágio. Uma variável declarada com o tipo da interface aceita **qualquer objeto que cumpra o contrato**, venha de onde vier.' },
    { t: 'code', lang: 'java', caption: 'ContaPoupanca.java', code: `public class ContaPoupanca implements Tributavel {
    private double saldo;

    public ContaPoupanca(double saldoInicial) {
        this.saldo = saldoInicial;
    }

    public double getSaldo() {
        return saldo;
    }

    @Override
    public double calcularTributo() {
        return saldo * 0.005;
    }
}` },
    { t: 'p', text: 'A `ContaPoupanca` repete a estrutura da corrente, mas o corpo de `calcularTributo()` é diferente: aplica **0,5%** em vez de 1%. Os dois objetos passam a ser intercambiáveis em qualquer lugar que espere um `Tributavel` — o compilador não sabe (nem precisa saber) de qual tipo concreto se trata; ele apenas confia no contrato.' },
    { t: 'code', lang: 'java', caption: 'Main.java', code: `public class Main {
    public static void main(String[] args) {
        Tributavel[] contas = {
            new ContaCorrente(1000.0),
            new ContaPoupanca(2000.0)
        };

        double total = 0.0;
        for (int i = 0; i < contas.length; i++) {
            total = total + contas[i].calcularTributo();
        }

        System.out.println("Total de tributos: " + total);
    }
}` },
    { t: 'p', text: 'Analisando o `Main`: a linha `Tributavel[] contas = { ... }` declara um **vetor cujo tipo é a interface**, preenchido com um objeto de cada classe concreta — é a alocação de objetos com `new` que você já domina, só que gravados num vetor de contrato. No laço `for`, a chamada `contas[i].calcularTributo()` executa o método da classe real de cada posição: na primeira volta roda o cálculo de 1% da corrente (1000 × 0,01 = 10), na segunda o de 0,5% da poupança (2000 × 0,005 = 10). A última linha imprime `Total de tributos: 20.0`. Repare no ponto decisivo: **o laço não tem um `if` dizendo qual tipo é a conta** — ele confia inteiramente no contrato, e é por isso que adicionar um terceiro tipo de conta não exige nenhuma alteração aqui.' },
    { t: 'note', kind: 'info', title: 'Duas vantagens na prática', text: 'Primeira: quem chama o código não depende de classes concretas — isso reduz o acoplamento. Segunda: novos tipos entram sem tocar no código que já existe (você formalizará isso como princípio Aberto/Fechado na aula 13).' },

    { t: 'h2', text: 'Interface ou classe abstrata?' },
    { t: 'p', text: 'Na aula anterior você aprendeu que uma classe abstrata pode ter métodos abstratos *e* métodos com corpo, além de atributos e construtores. Interfaces também podem ter métodos com corpo (os `default`). Então, qual usar? A resposta não é "qualquer uma": as duas ferramentas resolvem problemas diferentes, e escolher errado é uma das causas mais comuns de código difícil de manter.' },
    { t: 'table', headers: ['Aspecto', 'Interface', 'Classe abstrata'], rows: [
      ['Propósito', 'Declara uma capacidade (o que o objeto faz)', 'Define uma base comum de estado e comportamento (o que o objeto é)'],
      ['Atributos de instância', 'Não tem: só constantes `public static final`', 'Pode ter atributos privados usados por toda a hierarquia'],
      ['Construtores', 'Não tem', 'Pode ter construtores, chamados com `super` na subclasse'],
      ['Herança múltipla', 'Uma classe implementa várias interfaces', 'Uma classe só estende uma classe'],
      ['Métodos com corpo', 'Só `default` e `static` (e `private` auxiliares)', 'Qualquer método, inclusive protegido e de instância'],
      ['Indicação de uso', 'Contrato entre partes independentes', 'Reuso de código e estado entre classes "parecidas"'],
    ] },
    { t: 'p', text: 'A heurística prática é simples: pergunte **"é um tipo de...?"** e **"pode fazer...?"**. Se as classes formam uma família com estado compartilhado (`ContaCorrente` e `ContaPoupanca` *são tipos de* `Conta`, com saldo e titular em comum), a classe abstrata é o lugar certo para esse núcleo. Se você está descrevendo uma capacidade que classes de famílias diferentes podem ter (`Tributavel`, `Exportavel` — uma conta e um cliente podem ser exportáveis), a interface é o instrumento certo. Na prática, os dois se complementam: uma classe concreta pode estender uma classe abstrata **e** implementar interfaces ao mesmo tempo — é exatamente o desenho que você usará no projeto do módulo.' },
    { t: 'p', text: 'Vale uma observação sobre o futuro do curso: no módulo 3 você conhecerá *functional interfaces* (interfaces com exatamente um método abstrato) e *lambdas*, e a partir do módulo 4 o Spring usará interfaces o tempo todo para desacoplar as partes de uma API. O vocabulário que você está construindo agora — contrato, implementação, tipo de referência — é a base de tudo isso.' },
    { t: 'divider' },
    { t: 'quote', text: 'Interface define o CONTRATO (o que), a classe define a IMPLEMENTAÇÃO (como). Quem programa contra o contrato pode trocar a implementação sem mudar uma linha de quem consome.' },
  ],

  commonMistakes: [
    { title: 'Declarar a interface na classe, mas esquecer o implements', text: 'Escrever `class ContaCorrente { ... calcularTributo() ... }` sem `implements Tributavel` compila sem erro — e é pior: você acredita que a classe é tributável, mas ela não é, e qualquer tentativa de atribuí-la a uma variável do tipo `Tributavel` falhará na compilação. Escreva `implements` junto com o nome da classe no mesmo momento em que criar o arquivo.' },
    { title: 'Achar que interface guarda dados de instância', text: 'Um campo declarado dentro de interface é `public static final`: uma única constante compartilhada, sem valor por objeto e sem alteração. Se você precisa que cada conta tenha um saldo diferente, esse dado pertence à **classe** implementadora. Tentar criar "atributo da interface" é sinal de que a solução deveria ser uma classe abstrata.' },
    { title: 'Considerar qualquer método parecido como implementação', text: 'O compilador exige a assinatura **exata**: mesmo nome, mesmos parâmetros e mesmo tipo de retorno. Um método `calcularTributo(double saldo)` não satisfaz o contrato `calcularTributo()` — e um método que retorna `int` também não. Use `@Override` sempre: ele transforma esse erro de lógica em erro imediato de compilação.' },
    { title: 'Usar extends em classe para "ganhar" uma interface', text: '`class Conta extends Tributavel` não existe: `extends` liga classe a classe (ou interface a interface), e `implements` liga classe a interface. Em uma classe, a palavra correta é `implements`; em uma interface que quer combinar com outra, usa-se `extends`.' },
  ],

  bestPractices: [
    { title: 'Marque sempre com @Override', text: 'A anotação é gratuita e cobra o compilador para você: qualquer divergência de assinatura num método que deveria sobrescrever vira erro na hora, em vez de uma classe que deixa de ser instanciada por causa de um método abstrato esquecido.' },
    { title: 'Nomeie interfaces por capacidade', text: 'Escolha substantivos que descrevam o que o objeto faz: `Tributavel`, `Exportavel`, `Notificavel`, `Validavel`. O prefixo `I` (como `ITributavel`) é tradição de outras linguagens; em Java o padrão é o nome limpo da capacidade.' },
    { title: 'Programe contra a interface, não contra a classe', text: 'Quando o tipo concreto não importa para o chamador, declare parâmetros, variáveis e retornos com o tipo da interface: `void registrar(Tributavel conta)`. Assim o método aceita qualquer implementação futura sem alteração — e fica pronto para receber um objeto criado em teste ou em outro pacote.' },
    { title: 'Mantenha interfaces pequenas e coesas', text: 'Um contrato com dez métodos obriga quem implementa a escrever dez corpos, mesmo que só use dois. Prefira interfaces curtas que descrevem uma capacidade só; se aparecerem métodos que nem toda implementadora usa, separe em contratos menores (o princípio Interface Segregation, da aula 13, formaliza isso).' },
    { title: 'Combine herança e interface com propósito', text: 'Use `extends` para reuso de estado e comportamento entre classes parecidas, e `implements` para capacidades que atravessam famílias. Uma classe concreta pode fazer as duas coisas: `extends Conta implements Tributavel, Exportavel` — núcleo comum na hierarquia, capacidades soltas na interface.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Interface é um tipo declarado com `interface` que reúne **métodos sem corpo**: um contrato do que o objeto faz.',
      'Uma classe assume o contrato com **`implements`** e precisa implementar todos os métodos abstratos — o compilador garante isso.',
      'Atributos de interface são **constantes** (`public static final`); interface não tem construtores nem estado de instância.',
      'Desde o Java 8, interfaces podem ter métodos **`default`** (com corpo), permitindo evoluir o contrato sem quebrar implementações existentes.',
      'Uma classe implementa **várias interfaces** ao mesmo tempo; na hierarquia de classes, a herança continua sendo única.',
      'Usar a interface como **tipo de referência** permite polimorfismo entre classes não relacionadas: `Tributavel t = new ContaPoupanca(2000.0)`.',
      'Escolha pela função: **classe abstrata** para estado e comportamento comum ("é um tipo de"), **interface** para capacidade independente ("pode fazer").',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você deixa de olhar uma classe isolada e começa a ligar objetos entre si: `Conta` com `Cliente`, `Banco` com suas `Conta`s e histórico de `Transacao`s — associação, composição e dependência.' },
  ],

  exercises: [
    {
      id: 'm2l11e1',
      type: 'mc',
      question: 'Em Java, qual palavra-chave uma classe usa ao lado do seu nome para declarar que cumpre um contrato definido em uma interface?',
      options: ['extends', 'implements', 'inherits', 'override'],
      answer: 1,
      explanation: 'A palavra é **`implements`**: `public class ContaCorrente implements Tributavel`. O `extends` é usado para herança de classes (ou de interfaces, de interface para interface); `inherits` nem existe em Java; `@Override` é uma anotação que marca métodos que já existem em uma superclasse ou interface — ela não declara contrato nenhum.',
    },
    {
      id: 'm2l11e2',
      type: 'tf',
      question: 'Uma interface pode declarar atributos de instância que cada classe implementadora preenche no próprio construtor.',
      answer: false,
      explanation: 'Todo campo declarado em uma interface é **`public static final`**: uma constante única, pertencente à interface, sem valor por objeto e sem possibilidade de alteração. Interfaces não têm estado de instância nem construtores. Dados variáveis por objeto (como o saldo de cada conta) pertencem às classes que implementam o contrato.',
    },
    {
      id: 'm2l11e3',
      type: 'code',
      question: 'Analise o código abaixo. Qual é o problema que impede a compilação?',
      code: 'interface Tributavel {\n    double calcularTributo();\n}\n\nclass ContaPoupanca implements Tributavel {\n    @Override\n    public double calcularTributo(double saldo) {\n        return saldo * 0.005;\n    }\n}',
      lang: 'java',
      options: [
        'Nenhum: o código compila normalmente',
        'A interface não pode ser declarada sem a palavra-chave public',
        'ContaPoupanca não implementa calcularTributo() sem parâmetros, e o @Override não encontra método para sobrescrever',
        'O método calcularTributo(double saldo) deveria retornar int em vez de double',
      ],
      answer: 2,
      explanation: 'O contrato exige a assinatura **exata** `calcularTributo()` — sem parâmetros. O método escrito recebe `double saldo`, então **não** é uma implementação: continua havendo um método abstrato pendente e a classe concreta não compila. Além disso, o `@Override` não encontra nenhum método correspondente na hierarquia para sobrescrever, o que também gera erro. A saída seria criar `public double calcularTributo()` sem parâmetros e, dentro dele, usar o saldo que a própria classe guarda. Declarar `public` na interface é dispensado (os métodos são `public` por padrão), e o tipo de retorno `double` está correto na declaração.',
    },
    {
      id: 'm2l11e4',
      type: 'short',
      question: 'Explique, com suas palavras, qual é a diferença entre usar extends e implements na declaração de uma classe.',
      keywords: [
        ['implements'],
        ['interface', 'contrato'],
        ['extends', 'heranca'],
      ],
      answerText: 'extends herda de uma classe (ou de outra interface), reaproveutando código e estado; implements declara que a classe cumpre o contrato de uma interface, obrigando-a a implementar todos os métodos abstratos dela.',
      explanation: 'Os dois atendem a finalidades distintas: **`extends` é reuso de uma base** — em classe, a herança é única e traz atributos e métodos prontos; **`implements` é assumição de um contrato** — a classe promete comportamentos que serão implementados do seu jeito e pode assumir vários contratos de uma vez. Uma mesma classe pode usar os dois: `extends Conta implements Tributavel`.',
    },
    {
      id: 'm2l11e5',
      type: 'code',
      question: 'Considere que ContaPoupanca implements Tributavel e calcula 0,5% do saldo. O que este programa imprime?',
      code: 'public class Main {\n    public static void main(String[] args) {\n        Tributavel t = new ContaPoupanca(2000.0);\n        System.out.println(t.calcularTributo());\n    }\n}',
      lang: 'java',
      options: [
        'Erro de compilação: não se cria objeto com tipo de interface',
        '10.0',
        '2000.0',
        '0.5',
      ],
      answer: 1,
      explanation: 'A variável `t` tem o tipo da **interface** (é a referência), mas o objeto criado com `new ContaPoupanca(2000.0)` é da classe concreta — declarar `Tributavel t = new ...` é permitido justamente porque `ContaPoupanca` cumpre o contrato. A chamada `t.calcularTributo()` executa o corpo da poupança: 2000 × 0,005 = **10.0**, impresso como double com `.0`. A opção "0.5" confunde a taxa com o resultado, e "2000.0" seria o saldo, não o tributo.',
    },
  ],

  challenge: {
    id: 'm2l11c1',
    title: 'Contrato Tributavel no banco',
    fileName: 'Main.java',
    prompt: 'Crie quatro arquivos: Tributavel.java, ContaCorrente.java, ContaPoupanca.java e Main.java. A interface Tributavel declara a constante TAXA_PADRAO (0.01) e o método calcularTributo(), sem corpo. ContaCorrente e ContaPoupanca usam implements Tributavel: a corrente tributa 1% do saldo (usando Tributavel.TAXA_PADRAO) e a poupança tributa 0,5%; saldo zero ou negativo gera tributo 0.0. Cada conta guarda o saldo em atributo privado, expõe getSaldo() e ignora saldo inicial negativo (mantém 0.0 no construtor). No Main, crie duas contas correntes com saldo 1000.0 e 500.0 e uma poupança com 2000.0, declare um vetor do tipo Tributavel, percorra-o com laço for somando os tributos e imprima a linha "Total de tributos: " seguida do total — a saída esperada é "Total de tributos: 25.0". Não use collections, exceções nem lambdas.',
    starterCode: '// Tributavel.java\npublic interface Tributavel {\n}\n\n// ContaCorrente.java\npublic class ContaCorrente {\n}\n\n// ContaPoupanca.java\npublic class ContaPoupanca {\n}\n\n// Main.java\npublic class Main {\n    public static void main(String[] args) {\n    }\n}\n',
    criteria: [
      'A interface Tributavel declara a constante TAXA_PADRAO e o método calcularTributo() sem corpo',
      'ContaCorrente e ContaPoupanca usam implements Tributavel e sobrescrevem calcularTributo() com @Override e assinatura exata',
      'O saldo é um atributo private em cada conta e só é alterado pelos métodos da própria classe',
      'A corrente retorna saldo × 0.01 e a poupança saldo × 0.005, retornando 0.0 quando o saldo é zero ou negativo',
      'O construtor das contas ignora saldo inicial negativo e inicializa o saldo em 0.0',
      'O Main usa um vetor de Tributavel percorrido com laço for, somando tributos sem distinguir o tipo concreto',
    ],
    modelSolution: [
      { t: 'p', text: 'Uma possível solução, arquivo por arquivo. Repare que o `Main` só conhece o contrato `Tributavel` — nenhuma linha dele menciona qual cálculo roda em cada conta.' },
      { t: 'code', lang: 'java', caption: 'Tributavel.java', code: `public interface Tributavel {
    // Constante implicitamente public static final
    double TAXA_PADRAO = 0.01;

    // Contrato: sem corpo, implementado por cada conta
    double calcularTributo();
}` },
      { t: 'code', lang: 'java', caption: 'ContaCorrente.java', code: `public class ContaCorrente implements Tributavel {
    private double saldo;

    public ContaCorrente(double saldoInicial) {
        if (saldoInicial >= 0) {
            this.saldo = saldoInicial;
        } else {
            this.saldo = 0.0;
        }
    }

    public double getSaldo() {
        return saldo;
    }

    @Override
    public double calcularTributo() {
        if (saldo <= 0) {
            return 0.0;
        }
        return saldo * Tributavel.TAXA_PADRAO;
    }
}` },
      { t: 'code', lang: 'java', caption: 'ContaPoupanca.java', code: `public class ContaPoupanca implements Tributavel {
    // Tributo menor que o da corrente
    private static final double TAXA_POUPANCA = 0.005;

    private double saldo;

    public ContaPoupanca(double saldoInicial) {
        if (saldoInicial >= 0) {
            this.saldo = saldoInicial;
        } else {
            this.saldo = 0.0;
        }
    }

    public double getSaldo() {
        return saldo;
    }

    @Override
    public double calcularTributo() {
        if (saldo <= 0) {
            return 0.0;
        }
        return saldo * TAXA_POUPANCA;
    }
}` },
      { t: 'code', lang: 'java', caption: 'Main.java', code: `public class Main {
    public static void main(String[] args) {
        // Vetor do tipo contrato: recebe objetos de classes diferentes
        Tributavel[] contas = {
            new ContaCorrente(1000.0),
            new ContaCorrente(500.0),
            new ContaPoupanca(2000.0)
        };

        double total = 0.0;
        for (int i = 0; i < contas.length; i++) {
            total = total + contas[i].calcularTributo();
        }

        System.out.println("Total de tributos: " + total);
    }
}` },
      { t: 'p', text: 'Com os saldos do enunciado, o cálculo dá 1000 × 0,01 = 10, 500 × 0,01 = 5 e 2000 × 0,005 = 10, totalizando **25.0**, exatamente a saída pedida. Se o seu programa imprimir `25.0`, os contratos estão corretos; se imprimir algo diferente, confira primeiro a assinatura dos métodos (`@Override` ajuda a localizar o erro) e depois as taxas de cada classe.' },
    ],
  },
}
