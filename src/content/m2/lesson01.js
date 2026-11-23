export default {
  id: 'm2l01',
  moduleId: 'm2',
  number: 1,
  title: 'Fundamentos da Programação Orientada a Objetos',
  durationMinutes: 28,

  objectives: [
    'Explicar a diferença entre classe e objeto com exemplos concretos',
    'Identificar estado (atributos) e comportamento (métodos) em uma classe',
    'Criar uma primeira classe em Java e instanciar objetos a partir dela',
    'Distinguir referência e objeto na memória da JVM',
    'Descrever os benefícios da orientação a objetos diante de um código procedural',
  ],

  prerequisites: [
    'Ter concluído o módulo 1 "Java Fundamentals" (sintaxe, tipos, laços, métodos, arrays e try/catch básico)',
    'Conseguir declarar variáveis, chamar métodos e usar `System.out.println` sem travar',
    'Saber compilar com `javac` e executar com `java` conforme mostrado no módulo 1',
    'Entender que variáveis de tipo de referência guardam o acesso a um objeto (aula 5 do módulo 1)',
  ],

  intro: [
    { t: 'p', text: 'No módulo 1 você escreveu programas em que os **dados viviam em variáveis soltas** e a **lógica vivia em métodos soltos**, quase sempre dentro de um `main` que crescia linha após linha. Funcionava para números, laços e arrays — mas não escala para um sistema de verdade, com dezenas de regras e estados que precisam ficar juntos.' },
    { t: 'p', text: 'A **orientação a objetos (POO)** propõe uma mudança de organização: em vez de espalhar dados e regras, você cria **unidades que juntam as duas coisas**. Uma conta bancária, por exemplo, passa a carregar junto o próprio saldo **e** os métodos que movimentam esse saldo. Este é o primeiro passo de um módulo inteiro dedicado a construir bem essas unidades.' },
    { t: 'p', text: 'Nesta aula você vai entender **o que é uma classe e o que é um objeto**, separar **estado de comportamento**, escrever a sua primeira classe completa e enxergar como referência e objeto se distribuem na memória da JVM. Também vai ver, lado a lado, um código procedural e o mesmo problema resolvido com POO — a comparação é o que faz o conceito finalmente fixar.' },
    { t: 'note', kind: 'tip', title: 'Como estudar esta aula', text: 'Todos os códigos desta aula são pequenos e devem ser digitados e executados por você. Crie um arquivo, compile e observe a saída antes de seguir para o próximo bloco: em POO, o conceito só assenta quando você vê **dois objetos distintos** respondendo de forma independente.' },
  ],

  theory: [
    { t: 'h2', text: 'O limite do código procedural' },
    { t: 'p', text: 'Imagine o começo de um sistema bancário escrito como você faria no módulo 1: dois arrays paralelos, um para titulares e outro para saldos, mais métodos que recebem um **índice** para dizer em qual conta mexer. O código abaixo é funcional e usa apenas conceitos que você já domina.' },
    {
      t: 'code',
      lang: 'java',
      caption: 'Principal.java (versão procedural)',
      code: `public class Principal {
    public static void main(String[] args) {
        String[] titulares = {"Ana", "Bruno", "Carla"};
        double[] saldos = {1000.0, 500.0, 250.0};

        depositar(saldos, 1, 200.0);

        System.out.println(titulares[1] + " tem R$ " + saldos[1]);
    }

    static void depositar(double[] saldos, int indice, double valor) {
        saldos[indice] = saldos[indice] + valor;
    }
}`,
    },
    { t: 'p', text: 'Analisando o problema em detalhes: na linha `depositar(saldos, 1, 200.0);` o número `1` é o que decide **qual** conta recebe o depósito — se você trocar por `2`, o dinheiro cai na conta errada e o compilador não diz nada. Na linha `saldos[indice] = saldos[indice] + valor;` a regra de depósito fica separada dos dados que ela protege: quem chama o método precisa **carregar o array inteiro junto** para conseguir usar uma regra de negócio. E nada impede chamar `depositar(saldos, 1, -500.0)` ou passar um índice fora da faixa.' },
    { t: 'p', text: 'O padrão que aparece aqui se repete em todo sistema procedural: **os dados viajam soltos, as regras viajam soltas, e a coordenação entre elas fica na conta de quem chama**. Com três contas isso é inconveniente; com três mil contas, transferências, tarifas e extratos, é fonte certa de bug. A orientação a objetos ataca exatamente isso.' },

    { t: 'h2', text: 'Classe e objeto: molde e exemplar' },
    { t: 'p', text: 'Os dois termos centrais da aula se confundem o tempo todo em conversas informais, mas a diferença é simples e decisiva. Uma **classe** é a **descrição** de uma coisa: quais dados ela tem e o que ela faz. Um **objeto** é um **exemplar** criado a partir dessa descrição, com valores próprios.' },
    { t: 'table', headers: ['Termo', 'O que é', 'Exemplo no contexto bancário'], rows: [
      ['Classe', 'O molde: define atributos e comportamentos comuns', 'A classe `ContaBancaria` descreve o conceito de conta'],
      ['Objeto', 'Um exemplar concreto, criado com `new`, com estado próprio', 'A conta da Ana e a conta do Bruno são dois objetos'],
      ['Estado', 'Os valores dos atributos em um momento específico', 'Saldo de 1500,00 da conta da Ana agora de manhã'],
      ['Comportamento', 'Os métodos que o objeto oferece para ler ou mudar o estado', '`depositar`, `sacar` e `consultarSaldo`'],
    ] },
    { t: 'p', text: 'A analogia clássica é a da **casa e o projeto da casa**: o projeto (classe) descreve quartos, portas e janelas; cada casa construída a partir dele (objeto) tem móveis, cores e moradores diferentes. Outra boa analogia é a do **molde de biscoito**: o molde é um só, mas cada biscoito sai com formato próprio — e você pode comer um sem afetar os outros.' },
    { t: 'p', text: 'Em Java, a palavra-chave `new` é o que transforma molde em exemplar: ela **pede memória à JVM, cria o objeto e devolve uma referência** apontando para ele. Você já usou `new` no módulo 1 ao criar arrays (`new int[10]`); agora o mesmo operador passa a criar objetos de classes que você mesmo escreve.' },
    { t: 'note', kind: 'info', title: 'Uma classe é um tipo', text: 'Depois de declarar `class ContaBancaria`, o nome `ContaBancaria` vira um **tipo de referência** para a linguagem, do mesmo jeito que `String` ou `int`. Isso significa que você pode declarar variáveis, passar contas por parâmetro e devolver contas de métodos — exatamente como já fazia com `String`.' },

    { t: 'h2', text: 'Estado e comportamento vivem juntos' },
    { t: 'p', text: 'Uma classe bem dividida tem duas partes. Os **atributos** (também chamados de campos ou *fields*) guardam o estado: dados que descrevem o objeto naquele instante. Os **métodos** descrevem o comportamento: o que o objeto sabe fazer com esse estado.' },
    { t: 'ul', items: [
      '**Atributos de `ContaBancaria`**: `String titular` (quem é o dono), `String numero` (identificador da conta) e `double saldo` (quanto há nela).',
      '**Métodos de `ContaBancaria`**: `depositar(double valor)` soma ao saldo, `sacar(double valor)` retira do saldo e `consultarSaldo()` devolve o saldo atual.',
      '**Atributos de `Cliente`**: `String nome` e `String email` — dados que identificam a pessoa.',
      '**Métodos de `Cliente`**: por enquanto, um método que exibe os dados na tela; nas próximas aulas ele ganhará cadastro, busca e atualização.',
    ] },
    { t: 'p', text: 'A grande mudança em relação ao código procedural é de **proximidade**: a regra `saldo = saldo + valor` deixa de ficar num método avulso recebendo um índice e passa a morar **dentro** da própria conta. Quem usa a conta não precisa saber como o saldo é guardado — só precisa chamar `depositar`. Essa ideia de esconder detalhes e expor apenas o necessário é o **encapsulamento**, que terá a aula 4 inteira dedicada a ele.' },
    { t: 'note', kind: 'tip', title: 'Os quatro pilares do módulo', text: 'Este módulo constrói os pilares na ordem: **encapsulamento** (aula 4), **herança** (aula 7), **polimorfismo** (aula 8) e **abstração** com interfaces e classes abstratas (aulas 10 e 11). Agora você só precisa das bases: classe, objeto, estado e comportamento.' },

    { t: 'h2', text: 'Sua primeira classe completa' },
    { t: 'p', text: 'O código abaixo resolve o mesmo problema do início da aula, mas com a organização nova. Ele é **um único arquivo** contendo duas classes: a classe `Principal`, que é `public` e por isso precisa ter o mesmo nome do arquivo, e a classe `ContaBancaria`, que é auxiliar e pode ficar no mesmo arquivo sem modificador de acesso.' },
    {
      t: 'code',
      lang: 'java',
      caption: 'Principal.java',
      code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria contaAna = new ContaBancaria();
        ContaBancaria contaBruno = new ContaBancaria();

        contaAna.titular = "Ana";
        contaAna.saldo = 1000.0;

        contaBruno.titular = "Bruno";
        contaBruno.saldo = 500.0;

        contaAna.depositar(250.0);

        System.out.println(contaAna.titular + ": R$ " + contaAna.saldo);
        System.out.println(contaBruno.titular + ": R$ " + contaBruno.saldo);
    }
}

class ContaBancaria {
    String titular;
    double saldo;

    void depositar(double valor) {
        saldo = saldo + valor;
    }
}`,
    },
    { t: 'p', text: 'Vamos à leitura linha a linha. A linha `ContaBancaria contaAna = new ContaBancaria();` declara uma **variável de referência** chamada `contaAna` do tipo `ContaBancaria` e, em seguida, `new` cria o objeto em memória e devolve o acesso para a variável guardar. As linhas `contaAna.titular = "Ana";` e `contaAna.saldo = 1000.0;` usam o **ponto** para alcançar um campo do objeto e gravar um valor nele — repare que `contaBruno` recebe valores completamente diferentes e nenhum dos dois interfere no outro.' },
    { t: 'p', text: 'Dentro da classe, a linha `String titular;` **declara o atributo**: cada objeto terá o seu. A linha `void depositar(double valor) {` declara um método que não devolve nada (`void`) e recebe um número como parâmetro. A linha `saldo = saldo + valor;` é o coração do exemplo: ela lê o campo `saldo` **do objeto que recebeu a chamada**, soma o valor e grava de volta. Quando você executa `contaAna.depositar(250.0);`, o `saldo` alterado é o da Ana; o de Bruno continua 500,0.' },
    { t: 'code', lang: 'bash', caption: 'Terminal', code: 'javac Principal.java    # compila: gera Principal.class e ContaBancaria.class\njava Principal           # executa: chama o main da classe Principal' },
    { t: 'p', text: 'O primeiro comando gera **um arquivo `.class` por classe** encontrada no arquivo-fonte — é esperado ver `Principal.class` **e** `ContaBancaria.class` na pasta depois da compilação. O segundo comando executa informando o nome da classe que contém o `main`. A saída esperada é `Ana: R$ 1250.0` e `Bruno: R$ 500.0`: apenas a conta da Ana mudou, porque cada objeto tem o seu próprio estado.' },

    { t: 'h2', text: 'Referência, objeto e memória' },
    { t: 'p', text: 'A linha `ContaBancaria contaAna = new ContaBancaria();` merece ser decomposta, porque ela mistura **duas coisas diferentes**: uma variável (que fica na pilha da thread) e um objeto (que fica no heap, a área onde a JVM guarda objetos). A variável não é o objeto: ela é apenas um **endereço** que aponta para ele.' },
    { t: 'code', lang: 'plaintext', caption: 'Memória após criar as duas contas', code: 'Pilha (variáveis)                 Heap (objetos)\n------------------          ------------------------------\ncontaAna    ------------->   | titular: "Ana"    |\n                             | saldo: 1000.0     |\ncontaBruno  ------------->   | depositar()       |\n                             |-------------------|\n                             | titular: "Bruno"  |\n                             | saldo: 500.0      |\n                             | depositar()       |\n                             ------------------------------' },
    { t: 'p', text: 'O diagrama mostra por que os dois objetos são independentes: existem **dois blocos distintos no heap**, cada um com seus próprios campos, e as variáveis apontam para blocos diferentes. Se você atribuir uma referência à outra, por exemplo `ContaBancaria copia = contaAna;`, não haverá terceiro objeto — `copia` passará a apontar para o **mesmo** bloco da Ana, e qualquer alteração por um dos lados será vista pelo outro.' },
    {
      t: 'code',
      lang: 'java',
      caption: 'Principal.java (referência compartilhada x objetos independentes)',
      code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria contaAna = new ContaBancaria();
        contaAna.titular = "Ana";
        contaAna.saldo = 1000.0;

        ContaBancaria copia = contaAna;   // copia aponta para o MESMO objeto
        copia.depositar(100.0);           // altera o objeto da Ana

        ContaBancaria outra = new ContaBancaria();  // objeto novo, estado proprio
        outra.titular = "Carla";
        outra.saldo = 1000.0;
        outra.depositar(100.0);           // nao afeta a Ana

        System.out.println("Ana: " + contaAna.saldo);      // 1100.0
        System.out.println("Carla: " + outra.saldo);       // 1100.0
    }
}

class ContaBancaria {
    String titular;
    double saldo;

    void depositar(double valor) {
        saldo = saldo + valor;
    }
}`,
    },
    { t: 'p', text: 'Nas linhas `ContaBancaria copia = contaAna;` e `copia.depositar(100.0);`, a variável `copia` não recebeu uma cópia do objeto: recebeu o **mesmo endereço**. Por isso `contaAna.saldo` passa a valer `1100.0`, mesmo sem ninguém ter tocado em `contaAna` diretamente. Já nas linhas `ContaBancaria outra = new ContaBancaria();` e `outra.depositar(100.0);`, um `new` separado gerou um bloco novo no heap — e as duas contas evoluem sem relação. Essa distinção (**atribuir referência copia o acesso; `new` cria objeto novo**) aparece em vários exercícios deste módulo.' },
    { t: 'note', kind: 'warn', title: 'Cuidado ao esperar "cópia"', text: 'Esperar que `ContaBancaria copia = contaAna;` duplique o saldo da Ana é um erro conceitual muito comum. Em Java, atribuir uma variável de referência copia **a referência**, não o objeto. Para criar um estado independente você precisa de um `new` (ou de um método de cópia que veremos mais adiante).' },

    { t: 'h2', text: 'Por que a POO organiza melhor' },
    { t: 'p', text: 'Voltando ao código procedural do início, dá para listar com precisão o que a versão com classe melhora. Nada aqui é opinião: são consequências diretas de colocar dados e comportamento no mesmo lugar.' },
    { t: 'ol', items: [
      '**Coesão**: o saldo e o método que altera o saldo estão na mesma unidade. Não existe mais o risco de chamar o método de depósito passando o array da tabela errada.',
      '**Menos parâmetros soltos**: `depositar` recebe apenas o valor, porque o objeto já "carrega" consigo o titular, o número e o saldo.',
      '**Estado protegido por comportamento**: quem precisa mexer no saldo é obrigado a passar pelos métodos da conta — base do encapsulamento da aula 4.',
      '**Reutilização**: a mesma classe `ContaBancaria` serve para a conta da Ana, do Bruno e de milhares de clientes, sem duplicar lógica.',
      '**Trocas localizadas**: se a regra de depósito mudar, você altera um único método e todo o sistema passa a usar a nova regra.',
    ] },
    { t: 'p', text: 'Vale uma honestidade técnica: POO **não é bala de prata**. Para um script de dez linhas, um `main` procedural é perfeitamente adequado — e é o que você escreveu no módulo 1. A vantagem aparece quando o problema cresce e passa a ter **múltiplos estados coerentes que mudam ao longo do tempo**, que é exatamente o caso de um sistema bancário, de um e-commerce ou da TaskFlow API que você construirá no módulo 4.' },

    { t: 'h2', text: 'Como o módulo 2 está dividido' },
    { t: 'p', text: 'Você acabou de adquirir o vocabulário mínimo: classe, objeto, atributo, método, referência. As próximas aulas aprofundam cada peça antes de qualquer tema avançado.' },
    { t: 'ol', items: [
      '**Aula 2**: anatomia completa de classes e objetos — atributos, métodos, parâmetros, retorno e valores padrão.',
      '**Aula 3**: construtores, para garantir que todo objeto já nasça com estado válido, e a palavra-chave `this`.',
      '**Aula 4**: encapsulamento e os quatro modificadores de acesso (`public`, `private`, `protected` e pacote).',
      '**Aula 5**: getters e setters no padrão Java, com validação de dados no ponto de entrada.',
      '**Aula 6**: `static` e `final` — membros de classe, constantes e restrições de imutabilidade.',
      '**Aulas 7 a 13**: herança, polimorfismo, sobrecarga, abstração, interfaces, composição, pacotes e princípios SOLID.',
    ] },
    { t: 'p', text: 'O projeto do módulo é um **sistema bancário**: à medida que avançar, você reutilizará `ContaBancaria` e `Cliente` de cada aula, acrescentando camadas de qualidade. Guarde bem os nomes usados aqui — eles vão voltar.' },
  ],

  commonMistakes: [
    { title: 'Confundir a classe com o objeto', text: 'A classe `ContaBancaria` **não tem saldo algum**: ela é apenas a descrição. Saldo, titular e número só existem em **objetos** criados com `new`. Frases como "a classeConta tem saldo de 1000" indicam que a distinção ainda não fixou — pratiche nomeando em voz alta: "o **objeto** `contaAna`, criado a partir da **classe** `ContaBancaria`, tem saldo de 1000".' },
    { title: 'Achar que `ContaBancaria copia = contaAna;` duplica o objeto', text: 'Essa linha copia apenas a **referência**: `copia` e `contaAna` passam a apontar para o mesmo objeto no heap. Alterar por um lado altera o outro. Para obter estado independente, é preciso criar um objeto novo com `new` e transferir os valores campo a campo (ou usar um construtor de cópia, tema das próximas aulas).' },
    { title: 'Esperar que atributos de referência iniciem com texto vazio', text: 'Quando você declara `String titular;` e não atribui, o valor inicial é **`null`**, não `""`. Imprimir `conta.titular` antes de preencher mostra a palavra `null` na tela. O mesmo vale para objetos: uma referência sem `new` também é `null`, e usá-la gera `NullPointerException`.' },
    { title: 'Tentar rodar a classe errada no terminal', text: 'Depois de compilar `Principal.java`, execute `java Principal` (a classe que contém o `main`), não `java Principal.java` nem `java ContaBancaria`. Se você renomear o arquivo, o nome da classe `public` precisa acompanhar — o compilador acusa imediatamente.' },
    { title: 'Declarar tudo dentro do main e chamar de "objeto"', text: 'Variáveis locais dentro do `main` não são objetos: são apenas valores soltos. Para praticar POO, crie a **classe fora** do `main`, instancie com `new` e faça o `main` apenas **coordenar** as chamadas. Se todo o código continuar dentro do `main`, você continua no módulo 1 com outro nome.' },
  ],

  bestPractices: [
    { title: 'Comece modelando substantivos do domínio', text: 'No sistema bancário, os substantivos são `Conta`, `Cliente`, `Movimentação`. Escolher bem os nomes de classe deixa o código legível para qualquer pessoa da equipe e reduz retrabalho: renomear uma classe cedo é barato, tarde é doloroso.' },
    { title: 'Mantenha o main apenas coordenando', text: 'O `main` deve instanciar objetos e chamar métodos, sem regras de negócio embutidas. Quando a lógica começa a aparecer dentro do `main`, é sinal de que ela pertence a um método da classe correspondente — mova-a para lá.' },
    { title: 'Nomeie referências pelo papel, não pela classe', text: 'Prefira `contaAna` e `contaBruno` a `conta1` e `conta2`. Referências bem nomeadas tornam o `main` autoexplicativo e evitam o erro clássico de usar a variável errada em meio a várias contas.' },
    { title: 'Desenhe antes de codificar', text: 'Para cada classe, escreva em um rascunho: quais **atributos** ela precisa e quais **métodos** ela oferece. Um minuto de desenho evita descobrir no meio do código que faltou um dado ou que uma regra foi parar na classe errada.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      '**Classe** é o molde (descrição de dados e comportamentos); **objeto** é o exemplar criado com `new`, com estado próprio.',
      '**Atributos** guardam o estado (`titular`, `saldo`); **métodos** descrevem o comportamento (`depositar`, `sacar`).',
      'Em Java, cada objeto tem seus **próprios campos**: duas contas criadas com `new` nunca compartilham saldo automaticamente.',
      'A variável de `ContaBancaria contaAna = new ...` é uma **referência** (endereço no heap), não o objeto em si.',
      'Atribuir `copia = contaAna` copia a **referência**; dois `new` criam objetos **independentes**.',
      'A vantagem da POO é **coesão**: a regra de negócio mora junto com o dado que ela protege, o que reduz erros de coordenação.',
      'Este módulo avança em ordem: classes e objetos (2 e 3), encapsulamento (4 e 5), `static`/`final` (6) e os pilares (7 a 13).',
      'O projeto do módulo é um **sistema bancário** — `ContaBancaria` e `Cliente` serão reutilizados e aprimorados a cada aula.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você abre uma classe por dentro: verá como declarar atributos com os tipos certos, escrever métodos com parâmetros e retorno, e entenderá os valores padrão que a JVM dá a cada tipo. Traga o arquivo `Principal.java` desta aula para evoluí-lo.' },
  ],

  exercises: [
    {
      id: 'm2l01e1',
      type: 'mc',
      question: 'Em um sistema bancário em Java, qual afirmação melhor descreve a relação entre a classe `ContaBancaria` e o objeto criado por `ContaBancaria c1 = new ContaBancaria();`?',
      options: [
        'A classe é o objeto em si e `c1` é uma cópia da classe',
        'A classe é a descrição (molde) e `c1` é um exemplar criado a partir dela',
        '`c1` é a classe e o objeto é o que existe dentro do heap da classe',
        'A classe só existe depois que `c1` é criado, e `c1` a apaga ao final do main',
      ],
      answer: 1,
      explanation: 'A **classe** é declarada uma única vez no código e descreve atributos e métodos; cada `new` produz um **objeto** (exemplar) com estado próprio, e `c1` guarda apenas a referência a ele. A alternativa 1 inverte os papéis; a 3 confunde variável com classe; a 4 é falsa porque a classe continua existindo após o `main` terminar — é a classe que permite criar novos objetos depois.',
    },
    {
      id: 'm2l01e2',
      type: 'tf',
      question: 'Se `contaAna` e `contaBruno` foram criadas com `new` separados, depositar valor em `contaAna` pode alterar o saldo de `contaBruno`.',
      answer: false,
      explanation: 'Cada `new ContaBancaria()` aloca um **bloco próprio no heap**, com seus próprios campos `titular` e `saldo`. Por isso `contaAna.depositar(250.0)` altera exclusivamente o objeto da Ana. O único modo de os dois "compartilharem" estado é atribuir a referência de um à outra (`contaBruno = contaAna`), o que faria as duas variáveis apontarem para o mesmo objeto.',
    },
    {
      id: 'm2l01e3',
      type: 'code',
      question: 'Analise o programa. Qual é a saída esperada na tela?',
      code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria a = new ContaBancaria();
        a.saldo = 300.0;

        ContaBancaria b = a;
        b.saldo = 900.0;

        ContaBancaria c = new ContaBancaria();
        c.saldo = 50.0;

        System.out.println(a.saldo);
    }
}

class ContaBancaria {
    double saldo;
}`,
      lang: 'java',
      options: ['300.0', '900.0', '50.0', 'Erro de compilação'],
      answer: 1,
      explanation: 'A linha `ContaBancaria b = a;` **não cria um objeto novo**: `b` passa a apontar para o mesmo objeto de `a`. Quando `b.saldo = 900.0;` executa, o campo do objeto compartilhado muda — e `a.saldo` também passa a ser `900.0`. O objeto `c` é independente (tem seu próprio `new`), mas sua atribuição não influencia `a`. Não há erro de compilação: `saldo` é `double` e está acessível dentro do próprio arquivo.',
    },
    {
      id: 'm2l01e4',
      type: 'short',
      question: 'Explique, com suas palavras e uma analogia, a diferença entre classe e objeto em Java.',
      keywords: [
        ['classe', 'molde', 'descricao', 'descrição', 'projeto', 'planta'],
        ['objeto', 'instancia', 'instância', 'exemplar', 'criado', 'new'],
      ],
      answerText: 'A classe é a descrição (molde, projeto ou planta) que define quais atributos e métodos existirão; o objeto é o exemplar concreto criado a partir dessa classe com `new`, com valores próprios — assim como o projeto de casa é um só e cada casa construída tem moradores e cores diferentes.',
      explanation: 'O essencial é marcar que a classe **descreve** e o objeto **existe com estado próprio**. Uma resposta forte ainda cita `new` como o mecanismo que cria o objeto e menciona que várias instâncias podem sair da mesma classe sem se interferir. Dizer apenas "classe é o código e objeto é a variável" fica incompleto: a variável é a **referência**, não o objeto.',
    },
    {
      id: 'm2l01e5',
      type: 'mc',
      question: 'O que a linha `ContaBancaria conta = new ContaBancaria();` faz exatamente?',
      options: [
        'Declara uma variável chamada ContaBancaria e cria uma cópia do modelo na variável conta',
        'Cria um objeto da classe ContaBancaria no heap e faz a variável conta guardar a referência para ele',
        'Transforma a classe ContaBancaria em um objeto permanente que existe mesmo fora do main',
        'Reserva espaço para dez objetos, como acontece com new int[10]',
      ],
      answer: 1,
      explanation: 'A instrução tem duas partes: `ContaBancaria conta` declara a **variável de referência** e `new ContaBancaria()` **instancia** o objeto no heap, devolvendo o endereço para a variável guardar. A alternativa 1 confunde tipo com valor; a 3 é falsa porque o objeto vive enquanto houver referência a ele (a JVM o remove depois pela coleta de lixo); a 4 descreve `new int[10]`, que cria **um** array de dez posições, não dez objetos.',
    },
  ],

  challenge: {
    id: 'm2l01c1',
    title: 'Modelar um cliente do banco',
    fileName: 'Principal.java',
    prompt: 'Crie o arquivo `Principal.java` com duas classes: `Cliente` (sem modificador de acesso, auxiliar) e `Principal` (pública, com o `main`). A classe `Cliente` deve ter dois atributos, `String nome` e `String email`, e um método `void exibirDados()` que imprime uma linha no formato `Nome: <nome> - Email: <email>` usando `System.out.println`. No `main`, crie dois clientes distintos com `new`, atribua valores diferentes a cada um (por exemplo, Ana com ana@email.com e Bruno com bruno@email.com), chame `exibirDados()` nos dois e imprima também uma frase confirmando que os objetos são distintos. Compile com `javac Principal.java` e execute com `java Principal`; a saída deve mostrar os dados dos dois clientes em linhas separadas.',
    starterCode: `public class Principal {
    public static void main(String[] args) {
        // crie dois clientes aqui
    }
}

class Cliente {
    // declare os atributos aqui

    // declare o metodo exibirDados() aqui
}`,
    criteria: [
      'A classe `Cliente` declara os atributos `String nome` e `String email`',
      'O `main` cria dois objetos de `Cliente` com `new` em instruções separadas',
      'Os dois objetos recebem valores de nome e email diferentes entre si',
      'A classe `Cliente` possui um método `void exibirDados()` que usa `System.out.println`',
      'O método `exibirDados()` é chamado para os dois objetos e a saída mostra as duas linhas de dados',
      'O arquivo compila com `javac Principal.java` e executa com `java Principal` sem erros',
    ],
    modelSolution: [
      { t: 'p', text: 'Uma versão de referência: repare que `main` só instancia e chama — toda a apresentação dos dados mora dentro da classe `Cliente`, e cada objeto imprime os próprios valores.' },
      { t: 'code', lang: 'java', caption: 'Principal.java', code: `public class Principal {
    public static void main(String[] args) {
        Cliente ana = new Cliente();
        ana.nome = "Ana";
        ana.email = "ana@email.com";

        Cliente bruno = new Cliente();
        bruno.nome = "Bruno";
        bruno.email = "bruno@email.com";

        ana.exibirDados();
        bruno.exibirDados();
        System.out.println("Objetos distintos: " + (ana != bruno));
    }
}

class Cliente {
    String nome;
    String email;

    void exibirDados() {
        System.out.println("Nome: " + nome + " - Email: " + email);
    }
}` },
      { t: 'p', text: 'A saída esperada é `Nome: Ana - Email: ana@email.com`, `Nome: Bruno - Email: bruno@email.com` e `Objetos distintos: true`. Se aparecer `null` em algum campo, significa que a atribuição (`ana.nome = "Ana";`) foi esquecida ou escrita depois da chamada de `exibirDados()` — o valor padrão de um atributo `String` não atribuído é `null`.' },
    ],
  },
}
