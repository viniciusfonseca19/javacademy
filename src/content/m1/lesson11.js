export default {
  id: 'm1l11',
  moduleId: 'm1',
  number: 11,
  title: 'Métodos: parâmetros, retorno e organização',
  durationMinutes: 24,

  objectives: [
    'Explicar a estrutura de um método Java e o papel de cada elemento da assinatura',
    'Escrever métodos que recebem parâmetros e devolvem valores com `return`',
    'Diferenciar parâmetro de argumento e prever o efeito da passagem por valor',
    'Decompor um programa em métodos pequenos com responsabilidade única',
    'Chamar métodos a partir do `main` usando a forma `static` correta',
  ],

  prerequisites: [
    'Ter concluído as aulas sobre laços `for`, `while` e `do-while`',
    'Saber usar `if` e `else` e montar expressões aritméticas',
    'Ter escrito programas com entrada de dados e impressão de resultados',
    'Conhecer a estrutura de um arquivo Java com classe e método `main`',
  ],

  intro: [
    { t: 'p', text: 'Até aqui, praticamente tudo o que você escreveu ficou dentro do `main`. Funciona em exemplos pequenos, mas conforme o programa cresce o método principal vira um bloco de 100 linhas com leitura, cálculo, validação e impressão misturados — e a mesma regra de cálculo aparece repetida em vários pontos. Se a fórmula da média mudar de `7` para `6.5`, você terá de localizar e editar cada cópia.' },
    { t: 'p', text: 'A solução é antiga e vale para toda linguagem: **quebrar o problema em pedaços com nome**. Em Java, o pedaço com nome é o **método** — um bloco de instruções identificado, que você chama quando precisa, recebe dados de entrada (parâmetros) e pode devolver um resultado (`return`). Nesta aula você vai montar a estrutura de um método, entender como os dados entram e saem, ver na prática o que é a passagem por valor e, por fim, usar métodos para reorganizar um programa de médias em partes claras: entrada, cálculo e apresentação.' },
    { t: 'p', text: 'Uma analogia útil: um método é uma **caixa-preta com etiqueta**. Você sabe o que a etiqueta promete (`calcularMedia` calcula a média), sabe quais insumos ela pede (três notas) e o que ela devolve (um número). Você pode usar a caixa quantas vezes quiser sem reabrir — e se um dia o processo interno mudar, o rótulo continua o mesmo para quem a chama.' },
    { t: 'note', kind: 'tip', title: 'O que muda no seu código', text: 'Depois desta aula, seu `main` deve ficar pequeno: apenas orquestrar a leitura, chamar métodos e mostrar resultados. Se você perceber um `main` longo com blocos repetidos, é sinal de que falta extrair um método.' },
  ],

  theory: [
    { t: 'h2', text: 'O problema que os métodos resolvem' },
    { t: 'p', text: 'Veja um programa que imprime a média de três alunos com a lógica de cálculo repetida três vezes. Funciona, mas o custo de manutenção é alto: qualquer mudança na fórmula exige três edições.' },
    { t: 'code', lang: 'java', caption: 'SemMetodos.java', code: `import java.util.Scanner;

class SemMetodos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        System.out.println("Aluno 1:");
        double a1 = teclado.nextDouble();
        double b1 = teclado.nextDouble();
        double c1 = teclado.nextDouble();
        double media1 = (a1 + b1 + c1) / 3;
        System.out.println("Media: " + media1);

        System.out.println("Aluno 2:");
        double a2 = teclado.nextDouble();
        double b2 = teclado.nextDouble();
        double c2 = teclado.nextDouble();
        double media2 = (a2 + b2 + c2) / 3;
        System.out.println("Media: " + media2);

        System.out.println("Aluno 3:");
        double a3 = teclado.nextDouble();
        double b3 = teclado.nextDouble();
        double c3 = teclado.nextDouble();
        double media3 = (a3 + b3 + c3) / 3;
        System.out.println("Media: " + media3);

        teclado.close();
    }
}` },
    { t: 'p', text: 'Repare nas três linhas `double mediaX = (aX + bX + cX) / 3;`: a mesma fórmula escrita três vezes, com os números do aluno trocados. A estrutura se repete inteira (pedir três notas, calcular, imprimir). Se o requisito virar "média com peso 30%, 30% e 40%", são três pontos de edição — e o risco de esquecer um deles é real. Agora veja o mesmo programa com a lógica extraída para um método.' },
    { t: 'code', lang: 'java', caption: 'ComMetodos.java', code: `import java.util.Scanner;

class ComMetodos {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        System.out.println("Aluno 1:");
        double m1 = calcularMedia(teclado.nextDouble(), teclado.nextDouble(), teclado.nextDouble());
        System.out.println("Media: " + m1);

        System.out.println("Aluno 2:");
        double m2 = calcularMedia(teclado.nextDouble(), teclado.nextDouble(), teclado.nextDouble());
        System.out.println("Media: " + m2);

        System.out.println("Aluno 3:");
        double m3 = calcularMedia(teclado.nextDouble(), teclado.nextDouble(), teclado.nextDouble());
        System.out.println("Media: " + m3);

        teclado.close();
    }

    public static double calcularMedia(double n1, double n2, double n3) {
        return (n1 + n2 + n3) / 3;
    }
}` },
    { t: 'p', text: 'A fórmula agora existe **uma única vez**, no corpo de `calcularMedia`. Cada chamada como `calcularMedia(...)` entrega três valores e recebe de volta o resultado. Mudar a regra de cálculo significa editar uma linha só. Note onde o método foi escrito: **fora do `main`, mas dentro da classe**, após o fechamento do método principal — em Java, métodos convivem lado a lado dentro da mesma classe.' },

    { t: 'h2', text: 'Anatomia de um método' },
    { t: 'p', text: 'A declaração `public static double calcularMedia(double n1, double n2, double n3)` reúne tudo o que define um método. Cada elemento tem função própria — juntos, eles formam o que se chama **assinatura** (nome + tipos dos parâmetros).' },
    { t: 'table', headers: ['Elemento', 'No exemplo', 'Papel'], rows: [
      ['Modificador de acesso', '`public`', 'Controla quem pode chamar; por ora use `public`'],
      ['`static`', '`static`', 'Permite chamar o método sem criar um objeto (obrigatório enquanto o chamador é o `main`)'],
      ['Tipo de retorno', '`double`', 'Diz que o método devolve um número decimal; `void` indica que não devolve nada'],
      ['Nome', '`calcularMedia`', 'Identifica o método; em camelCase e, de preferência, um verbo'],
      ['Parâmetros', '`double n1, double n2, double n3`', 'Os dados de entrada que a chamada precisa fornecer, cada um com tipo'],
      ['Corpo', '`{ return ...; }`', 'As instruções executadas quando o método é chamado'],
    ] },
    { t: 'p', text: 'O nome é a **promessa** e os parâmetros são os **insumos**. Ao ler `calcularMedia(8.5, 7, 9.2)`, qualquer pessoa entende sem abrir o corpo o que o método faz e o que ele precisa receber. Essa legibilidade é a razão nº1 de extrair métodos — a economia de linhas é consequência.' },
    { t: 'p', text: 'Os parâmetros são **variáveis locais** do método: `n1`, `n2` e `n3` existem apenas enquanto o método executa. Não há conflito se o `main` também tiver uma variável chamada `n1` — são espaços separados. Essa separação é o que permite reutilizar o método quantas vezes for preciso, com dados diferentes a cada chamada.' },

    { t: 'h2', text: 'Parâmetros e argumentos: a passagem por valor' },
    { t: 'p', text: 'Vamos separar dois termos que se confundem: **parâmetro** é a variável declarada na assinatura (`double n1`); **argumento** é o valor concreto enviado na chamada (`8.5`). Na hora da chamada, o Java **copia** o valor do argumento para dentro do parâmetro — é a chamada passagem por valor. O exemplo abaixo mostra a consequência prática dessa cópia.' },
    { t: 'code', lang: 'java', caption: 'Passagem.java', code: `class Passagem {
    public static void main(String[] args) {
        int x = 10;
        dobrar(x);
        System.out.println("Depois da chamada: " + x);

        int y = dobrarDeVolta(x);
        System.out.println("Com retorno: " + y);
    }

    public static void dobrar(int valor) {
        valor = valor * 2;
        System.out.println("Dentro do metodo: " + valor);
    }

    public static int dobrarDeVolta(int valor) {
        return valor * 2;
    }
}` },
    { t: 'p', text: 'Percorra a execução: `x` vale 10 e `dobrar(x)` copia 10 para a variável local `valor`. Dentro do método, `valor = valor * 2` muda **apenas a cópia** — `x` continua 10, como confirma o primeiro `println` (`Depois da chamada: 10`), embora o segundo imprima `Dentro do metodo: 20`. Para que a mudança "volte" para fora, o método precisa **devolver o novo valor**: é o que faz `dobrarDeVolta`, cujo retorno é guardado em `y` (20). Essa é a regra que vale para sempre: **método `void` altera apenas o que lhe foi passado por dentro; para produzir efeito no chamador, retorne o resultado**.' },

    { t: 'h2', text: 'Retorno de valores' },
    { t: 'p', text: 'A palavra-chave `return` encerra o método **imediatamente** e entrega o valor ao chamador. O tipo declarado na assinatura e o valor devolvido precisam ser compatíveis: um método `double` devolve decimal, um `int` devolve inteiro, e um `void` não usa `return` com valor (apenas `return;` para sair antes do fim, quando necessário). Se um caminho do código não retornar nada, o compilador acusa o método.' },
    { t: 'code', lang: 'java', caption: 'Retorno.java', code: `class Retorno {
    public static void main(String[] args) {
        int melhor = maior(7, 12);
        System.out.println("Maior: " + melhor);

        int dobro = dobrar(maior(3, 9)) * 2;
        System.out.println("Dobro do maior: " + dobro);
    }

    public static int maior(int a, int b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    public static int dobrar(int valor) {
        return valor * 2;
    }
}` },
    { t: 'p', text: 'No método `maior`, os dois `return` cobrem os dois caminhos possíveis do `if`: se `a > b`, devolve `a` e **sai na hora** — a linha `return b;` não é nem alcançada; caso contrário, devolve `b`. Já na linha `int dobro = dobrar(maior(3, 9)) * 2;`, as chamadas se encaixam como peças: `maior(3, 9)` devolve 9, `dobrar(9)` devolve 18, e `* 2` produz 36. Chamar um método **dentro de uma expressão** é perfeitamente legal: o retorno é apenas um valor.' },
    { t: 'note', kind: 'info', title: '`void` não é um valor', text: 'Um método `void` executa uma ação (imprimir, acumular, configurar) e nada devolve. Tentar usá-lo em expressão, como `int z = imprimir();`, gera erro de compilação. Pergunte sempre ao método: "você faz ou você devolve?" — e escolha `void` ou um tipo de retorno coerente.' },

    { t: 'h2', text: 'Chamando métodos de dentro do `main`' },
    { t: 'p', text: 'O `main` é um método `static`, e um método `static` só pode chamar diretamente outros métodos `static`. Por isso, enquanto você escreve programas com uma única classe, **declare todos os seus métodos com `static`** — é o caso de todos os exemplos desta aula. Quando você tentar chamar um método sem `static` a partir do `main`, o compilador responde `non-static method cannot be referenced from a static context`.' },
    { t: 'p', text: 'A chamada usa o nome seguido dos argumentos entre parênteses, na **mesma ordem e com tipos compatíveis** com os parâmetros: `calcularMedia(8, 7, 9)` entrega 8 para `n1`, 7 para `n2` e 9 para `n3`. Trocar a ordem dos argumentos compila (se os tipos batem), mas entrega os valores nos lugares errados — um erro silencioso que muda o resultado sem nenhum aviso. Aprofundar em `static`, objetos e a razão disso acontecer é o tema do módulo 2.' },

    { t: 'h2', text: 'Organizando um programa de verdade' },
    { t: 'p', text: 'Chegou a hora de combinar tudo. O padrão de organização que funciona é dividir o programa em três papéis: **entrada** (ler dados), **processamento** (calcular com métodos) e **saída** (mostrar resultados). O `main` fica responsável apenas por coordenar essas etapas.' },
    { t: 'code', lang: 'java', caption: 'Boletim.java', code: `import java.util.Scanner;

class Boletim {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        System.out.print("Digite 3 notas: ");
        double n1 = teclado.nextDouble();
        double n2 = teclado.nextDouble();
        double n3 = teclado.nextDouble();

        double media = calcularMedia(n1, n2, n3);
        String situacao = classificar(media);
        imprimirResultado(media, situacao);

        teclado.close();
    }

    public static double calcularMedia(double a, double b, double c) {
        return (a + b + c) / 3;
    }

    public static String classificar(double media) {
        if (media >= 7) {
            return "Aprovado";
        }
        if (media >= 5) {
            return "Recuperacao";
        }
        return "Reprovado";
    }

    public static void imprimirResultado(double media, String situacao) {
        System.out.println("Media: " + media);
        System.out.println("Situacao: " + situacao);
    }
}` },
    { t: 'p', text: 'Leia o `main` de cima para baixo: ele lê três notas, calcula a média com `calcularMedia`, descobre a situação com `classificar` e imprime com `imprimirResultado`. Cada linha traduz uma frase da regra de negócio — quem lê entende o fluxo sem entrar em detalhes de fórmula. Note que `classificar` devolve `String`: métodos podem retornar textos, e o tipo de retorno da assinatura (`String`) acompanha isso.' },
    { t: 'p', text: 'Os três métodos são pequenos e fazem **uma coisa cada**: um calcula, outro classifica, o terceiro apresenta. Essa é a responsabilidade única: se amanhã a impressão mudar para `printf`, você edita apenas `imprimirResultado`; se as faixas de nota mudarem, apenas `classificar`; se a fórmula mudar, apenas `calcularMedia`. O `main`, que antes concentrava tudo, virou um roteiro de oito linhas.' },
    { t: 'p', text: 'Um último detalhe de boas práticas: os métodos foram escritos **depois** do `main`, na ordem em que são chamados? Não importa a ordem dentro da classe — todos são igualmente visíveis. O que importa é manter o `main` no topo, como sumário do programa, e os métodos auxiliares abaixo, na sequência lógica em que se usa (cálculo, classificação, apresentação).' },
    { t: 'quote', text: 'Método bom é método com nome que diz o que faz, parâmetros que dizem o que precisa e retorno que diz o que entrega.' },
  ],

  commonMistakes: [
    { title: 'Esquecer o `static` nos métodos chamados pelo `main`', text: 'Enquanto o chamador é o `main` (que é `static`), todo método que ele invoca precisa ser `static` também. Sem isso, o compilador acusa `non-static method cannot be referenced from a static context`. É o erro mais frequente de quem está extraindo o primeiro método: a lógica está correta, só falta a palavra na assinatura. O módulo 2 explica a fundo o que `static` significa — por ora, adote o hábito de escrevê-lo.' },
    { title: 'Declarar o tipo de retorno errado ou esquecer o `return`', text: 'Um método declarado `double` **precisa** devolver um número decimal em todos os caminhos. Se o `if` tem `return` e o resto do corpo não tem, o compilador aponta `missing return statement`. Um método `void` não pode ser usado em expressão (`int x = imprimir();` não compila). Antes de fechar o método, pergunte: o tipo da assinatura bate com o que `return` entrega?' },
    { title: 'Inverter a ordem dos argumentos na chamada', text: 'Em `calcularMedia(n3, n1, n2)` os tipos são todos `double`, então **compila sem erro** — e entrega os valores nos parâmetros errados, gerando resultado incorreto em silêncio. Confira a chamada parâmetro a parâmetro contra a assinatura, na ordem. Se os nomes ajudam (`media(notaProva1, notaProva2, notaProva3)`), mantenha-os consistentes entre declaração e chamada.' },
    { title: 'Achar que o método altera a variável do chamador', text: 'Na passagem por valor, o que chega ao método é uma **cópia**. Escrever `dobrar(x)` dentro de um método `void` que dobra o parâmetro não muda `x` no `main` — a impressão seguinte mostrará o valor antigo. Para propagar a mudança, devolva o novo valor com `return` e atribua no chamador: `x = dobrar(x);`. Exceções a essa regra envolvem objetos de referência e pertencem ao módulo 2.' },
    { title: 'Criar métodos gigantes que fazem tudo ao mesmo tempo', text: 'Trocar um `main` de 100 linhas por um único método de 100 linhas não organiza nada. Cada método deve responder por **uma** responsabilidade clara (calcular, validar, exibir) e caber em poucas dezenas de linhas. Se o nome do método usa "e" para anunciar duas ações diferentes (`calcularEImprimir`), divida em dois.' },
  ],

  bestPractices: [
    { title: 'Dê nomes de verbo, em camelCase, que descrevam a ação', text: '`calcularMedia`, `classificar`, `imprimirResultado`, `buscarAluno`. Nomes como `metodo1`, `dados` ou `processaCalculaMostra` atrapalham a leitura: a primeira linha que o colega lê do seu programa é a lista de métodos, e ela funciona como sumário.' },
    { title: 'Mantenha o `main` como orquestrador', text: 'O método principal deve ser lido em segundos: ler, chamar, mostrar. Toda lógica de cálculo, validação e formatação vive em métodos próprios. Quando o `main` passar de umas 15 linhas de lógica, é hora de extrair — o custo de uma extração tardia é bem menor do que o de manter tudo amontado.' },
    { title: 'Prefira poucos parâmetros com nome claro', text: 'Um a três parâmetros costumam ser o ponto ideal. Com mais que isso, a ordem na chamada vira fonte de erro silencioso — nesse caso, repense o desenho: talvez o método peça uma coisa por vez ou receba dados que deveriam ser lidos dentro dele. Nunca use parâmetros como "muleta" para esconder que o método tem duas responsabilidades.' },
    { title: 'Devolva resultados, não imprima dentro do cálculo', text: 'Métodos de cálculo devolvem valores (`return (a + b + c) / 3;`) e deixam a impressão para um método de apresentação. Isso torna o cálculo reutilizável e testável: você pode chamar `calcularMedia` de qualquer lugar sem produzir saída indesejada na tela — pré-requisito direto dos testes automatizados do módulo 3.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Um método tem **modificador**, `static`, **tipo de retorno**, **nome**, **parâmetros** e **corpo**; nome + tipos dos parâmetros formam a **assinatura**.',
      '`void` indica que o método não devolve nada; qualquer outro tipo (`int`, `double`, `String`) exige `return` com valor compatível em **todos** os caminhos.',
      '**Parâmetro** é a variável da assinatura; **argumento** é o valor enviado na chamada, na mesma ordem.',
      'A passagem por valor copia o dado: alterar o parâmetro **não** muda a variável do chamador — para isso, use `return` e atribua no chamador.',
      '`return` encerra o método imediatamente; o valor pode ser usado direto em expressões, inclusive chamando outro método.',
      'Chamado pelo `main`, o método precisa ser `static` — é a regra enquanto não vimos objetos (módulo 2).',
      'Organize o programa em **entrada, processamento e apresentação**, mantendo o `main` pequeno e cada método com uma única responsabilidade.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Métodos prontos, falta o dado: na aula 12 você conhece **arrays e matrizes**, estruturas que guardam muitos valores em uma única variável e se deixam percorrer com os laços que já sabe — a base para notas de turma, listas e tabelas.' },
  ],

  exercises: [
    {
      id: 'm1l11e1',
      type: 'mc',
      question: 'Qual declaração de método está correta para um método que recebe dois números inteiros e devolve a média como número decimal?',
      options: [
        'public static double media(int a, int b) { ... }',
        'public double media(int a, int b) { ... }',
        'public static int media(int a, int b) { ... }',
        'public static void media(int a, int b) { ... }',
      ],
      answer: 0,
      explanation: 'A assinatura precisa ter **`static`** (para ser chamado pelo `main`), **`double`** como tipo de retorno (média de inteiros pode ter casas decimais, como 7.5) e os dois parâmetros `int`. A segunda alternativa perde o `static` e não pode ser chamada do `main`. A terceira devolveria `int`, truncando 7.5 para 7. A quarta é `void`: não devolveria nada, impossibilitando guardar a média em uma variável.',
    },
    {
      id: 'm1l11e2',
      type: 'code',
      question: 'Qual é a saída do programa?',
      code: 'public static void main(String[] args) {\n    int x = 10;\n    dobrar(x);\n    System.out.println(x);\n}\n\npublic static void dobrar(int valor) {\n    valor = valor * 2;\n}',
      lang: 'java',
      options: ['20', '10', 'Erro de compilação: `void` não pode alterar parâmetros', 'O programa não imprime nada'],
      answer: 1,
      explanation: 'A passagem por valor copia o conteúdo de `x` (10) para a variável local `valor`. O método dobra **a cópia** (`valor` vira 20) e termina; `x` nunca é tocada, então `System.out.println(x)` imprime **10**. Não há erro de compilação: alterar parâmetro dentro do método é perfeitamente válido, apenas não afeta o chamador. Para que `x` virasse 20, o método precisaria devolver o novo valor (`x = dobrar(x);`).',
    },
    {
      id: 'm1l11e3',
      type: 'tf',
      question: 'Um método declarado com retorno `void` pode ser usado dentro de uma expressão aritmética, desde que a expressão esteja dentro do próprio método.',
      answer: false,
      explanation: '`void` significa que o método **não devolve valor algum**. Em nenhum contexto ele pode aparecer em expressão: `int z = imprimir();` ou `int r = calcular() + 1;` não compilam, dentro ou fora do método. Se você precisa de um resultado em uma expressão, o tipo de retorno deve ser o do dado produzido (`int`, `double`, `String` etc.) e o corpo deve contê-lo com `return`.',
    },
    {
      id: 'm1l11e4',
      type: 'short',
      question: 'Explique a diferença entre parâmetro e argumento, citando um exemplo com o método `calcularMedia(double n1, double n2, double n3)` chamado com três notas.',
      keywords: [
        ['parametro', 'parametros', 'declarado na assinatura', 'na definicao', 'variavel local'],
        ['argumento', 'argumentos', 'valor enviado', 'chamada', 'passado na chamada'],
      ],
      answerText: 'Parâmetros são as variáveis declaradas na assinatura do método (n1, n2 e n3 em calcularMedia); argumentos são os valores concretos enviados na chamada, por exemplo as notas 8.5, 7 e 9.2, que são copiados para os parâmetros na ordem correspondente.',
      explanation: 'A separação evita confusões de depuração: o erro pode estar **na declaração** (tipos ou quantidade de parâmetros) ou **na chamada** (argumentos na ordem errada ou com tipo incompatível). Como o Java copia o argumento para o parâmetro, o método trabalha sempre com a sua própria cópia — é a passagem por valor vista na aula.',
    },
    {
      id: 'm1l11e5',
      type: 'code',
      question: 'Qual linha impede a compilação do programa abaixo?',
      code: 'public static void main(String[] args) {\n    int dobro = dobrar(5);\n    System.out.println(dobro);\n}\n\npublic static void imprimir(int valor) {\n    System.out.println(valor * 2);\n}',
      lang: 'java',
      options: [
        'A linha `System.out.println(dobro);`',
        'A linha `int dobro = dobrar(5);` — não existe método `dobrar` e `imprimir` é `void`',
        'A linha `public static void imprimir(int valor) {` — falta o `return`',
        'Nenhuma: o programa compila e imprime 10',
      ],
      answer: 1,
      explanation: 'A linha `int dobro = dobrar(5);` falha porque o único método auxiliar definido é `imprimir`: a chamada `dobrar(5)` não corresponde a nenhuma declaração. E mesmo que o chamado fosse `imprimir(5)`, a atribuição continuaria errada — sendo `void`, ele não devolve valor para guardar em `dobro`. Uma chamada a `imprimir(5)` só seria válida como instrução isolada (`imprimir(5);`). Já `System.out.println(dobro);` está perfeito, e um método `void` não exige `return` — o corpo pode terminar normalmente.',
    },
  ],

  challenge: {
    id: 'm1l11c1',
    title: 'Refatoração: um boletim organizado em métodos',
    fileName: 'Boletim.java',
    prompt: 'Reescreva o programa `Boletim.java` para que ele leia as três notas de três alunos e imprima, para cada um, a média e a situação — mas com a lógica extraída em métodos. São obrigatórios estes métodos, com exatamente estas assinaturas: `public static double calcularMedia(double a, double b, double c)` que devolve a média aritmética simples; `public static String classificar(double media)` que devolve "Aprovado" quando a média for maior ou igual a 7, "Recuperacao" quando for maior ou igual a 5 e menor que 7, e "Reprovado" abaixo de 5; e `public static void imprimirResultado(int numeroAluno, double media, String situacao)` que imprime no formato `Aluno 1 - Media: 8.67 - Aprovado`. O `main` deve apenas ler os dados, chamar os métodos na ordem e não conter fórmulas nem comparações de nota.',
    starterCode: 'import java.util.Scanner;\n\nclass Boletim {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n\n        // leia as 3 notas do aluno 1, calcule, classifique e imprima\n        // repita para os alunos 2 e 3\n\n        teclado.close();\n    }\n\n    // declare aqui calcularMedia, classificar e imprimirResultado\n}\n',
    criteria: [
      'Existe o método `public static double calcularMedia(double a, double b, double c)` devolvendo a soma dividida por 3',
      'Existe o método `public static String classificar(double media)` com as três faixas 7, 5 e abaixo de 5 nos formatos exatos de texto pedidos',
      'Existe o método `public static void imprimirResultado(int numeroAluno, double media, String situacao)` imprimindo no formato `Aluno N - Media: X - Situacao`',
      'O `main` não contém aritmética de média nem comparações de nota: apenas leitura, chamadas e atribuições',
      'Os três alunos são processados reutilizando os mesmos métodos, sem duplicar a lógica de cálculo',
      'Os métodos são `static` e o programa compila e roda sem erros',
    ],
    modelSolution: [
      { t: 'p', text: 'A referência abaixo segue exatamente as assinaturas do enunciado. Repare no `main`: ele não tem nenhuma fórmula e nenhuma comparação — só leitura, chamadas e o repasse dos resultados para o método de impressão. É esse o teste de qualidade da refatoração.' },
      { t: 'code', lang: 'java', caption: 'Boletim.java', code: `import java.util.Scanner;

class Boletim {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        for (int aluno = 1; aluno <= 3; aluno++) {
            System.out.println("Notas do aluno " + aluno + ":");
            double n1 = teclado.nextDouble();
            double n2 = teclado.nextDouble();
            double n3 = teclado.nextDouble();

            double media = calcularMedia(n1, n2, n3);
            String situacao = classificar(media);
            imprimirResultado(aluno, media, situacao);
        }

        teclado.close();
    }

    // Recebe as tres notas e devolve a media aritmetica simples
    public static double calcularMedia(double a, double b, double c) {
        return (a + b + c) / 3;
    }

    // Converte a media em texto de situacao segundo as faixas
    public static String classificar(double media) {
        if (media >= 7) {
            return "Aprovado";
        }
        if (media >= 5) {
            return "Recuperacao";
        }
        return "Reprovado";
    }

    // Apenas apresenta: nao calcula nem classifica
    public static void imprimirResultado(int numeroAluno, double media, String situacao) {
        System.out.println("Aluno " + numeroAluno + " - Media: " + media + " - " + situacao);
    }
}` },
      { t: 'p', text: 'O `main` ainda usa um laço `for` para repetir o mesmo roteiro três vezes — os laços das aulas 9 e 10 continuam úteis dentro da organização em métodos. Se a sua versão tem a fórmula `(a + b + c) / 3` escrita dentro do `main`, o critério "sem aritmética no principal" não foi atendido: mova-a para `calcularMedia` e chame o método.' },
      { t: 'p', text: 'Teste com notas 8, 7 e 9 (esperado média 8.0 e `Aprovado`), depois 6, 6 e 6 (média 6.0 e `Recuperacao`) e 4, 5 e 5 (média 4.666... e `Reprovado`). Para conferir as faixas exatas, teste também 7.0 e 5.0 — os limites pertencem à faixa superior, como define o `>=` da classificação.' },
    ],
  },
}
