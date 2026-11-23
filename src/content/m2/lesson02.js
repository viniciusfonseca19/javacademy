export default {
  id: 'm2l02',
  moduleId: 'm2',
  number: 2,
  title: 'Classes e objetos: atributos e métodos',
  durationMinutes: 32,

  objectives: [
    'Decompor uma classe em atributos, métodos e a declaração que os contém',
    'Declarar atributos com os tipos corretos e explicar seus valores padrão',
    'Escrever métodos com parâmetros, retorno e uso correto de `return`',
    'Distinguir variável local de atributo dentro de um método',
    'Explicar o que acontece ao passar primitivos e objetos como parâmetro',
  ],

  prerequisites: [
    'Ter concluído a aula "Fundamentos da Programação Orientada a Objetos"',
    'Dominar tipos primitivos, declaração de variáveis e conversões do módulo 1',
    'Saber escrever métodos com parâmetros e retorno, conforme a aula "Métodos" do módulo 1',
    'Ter praticado arrays e laços, pois os exemplos usam arrays de movimentações',
  ],

  intro: [
    { t: 'p', text: 'Na aula anterior você viu uma classe `ContaBancaria` de apenas quatro linhas: dois atributos e um método. Funcionou como prova de conceito, mas uma classe real precisa de muito mais critério — **que tipos usar nos atributos, que nomes adotar, como um método devolve um valor e o que acontece quando ele não devolve nada**.' },
    { t: 'p', text: 'Esta aula é a **anatomia** da classe. Você vai declarar atributos e descobrir que a JVM já atribui um valor padrão a cada tipo; escrever métodos que devolvem resultado (`return`) e métodos que apenas executam (`void`); separar o que é variável local do que é atributo; e entender o que é copiado — e o que não é — quando você passa um objeto por parâmetro.' },
    { t: 'p', text: 'O exemplo principal continua sendo o sistema bancário: vamos montar uma `ContaBancaria` com titular, número, saldo e extrato, e um `main` que movimenta duas contas em paralelo. No final, você terá um modelo capaz de depositar, sacar e listar movimentações — a base que os construtores da aula 3 vão proteger.' },
    { t: 'note', kind: 'tip', title: 'Experimento sugerido', text: 'Para cada bloco de código desta aula, faça uma alteração pequena antes de seguir: troque o tipo de um atributo, adicione um parâmetro ou inverta a ordem das linhas no `main`. Observar o compilador reclamar é a forma mais rápida de fixar a sintaxe de classe.' },
  ],

  theory: [
    { t: 'h2', text: 'Anatomia de uma classe' },
    { t: 'p', text: 'Toda classe Java tem a mesma estrutura de casa: uma **declaração** que a nomeia, **atributos** que guardam o estado, **métodos** que oferecem comportamento e — veremos na aula 3 — **construtores** que inicializam o objeto. Tudo o que está entre as chaves de `class ContaBancaria { ... }` pertence a essa classe e é compartilhado por **todos** os objetos criados a partir dela.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (esqueleto anatômico)', code: `public class ContaBancaria {
    // 1) ATRIBUTOS - o estado de cada objeto
    String titular;
    String numero;
    double saldo;

    // 2) METODOS - o comportamento que o objeto oferece
    void depositar(double valor) {
        saldo = saldo + valor;
    }

    double consultarSaldo() {
        return saldo;
    }
}` },
    { t: 'p', text: 'Na primeira linha, `public class ContaBancaria {` é a **declaração**: `public` diz que a classe é acessível de fora do arquivo (detalhes dos modificadores na aula 4) e o nome segue a convenção **PascalCase**, com a inicial maiúscula e sem espaços. As linhas `String titular;`, `String numero;` e `double saldo;` são **atributos**: valores que cada objeto carrega consigo. Já `void depositar(double valor) { ... }` e `double consultarSaldo() { ... }` são **métodos**: rotinas que operam sobre esses atributos.' },
    { t: 'p', text: 'Repare na diferença entre as duas assinaturas de método: `depositar` é `void` porque apenas **muda** o estado e não precisa devolver nada; `consultarSaldo` declara `double` antes do nome porque tem a obrigação de **devolver um número** com `return`. Essa palavra na frente do nome do método é o **tipo de retorno** — e o compilador fiscaliza se todos os caminhos do método cumprem a promessa.' },

    { t: 'h2', text: 'Convenções de nome que a equipe inteira segue' },
    { t: 'p', text: 'Java não impõe esses nomes por compilador, mas toda a comunidade os segue — e códigos que fogem parecem código de outra linguagem para quem lê. As convenções valem desde o seu primeiro projeto e se repetem no Spring Boot do módulo 4.' },
    { t: 'table', headers: ['Elemento', 'Convenção', 'Exemplo correto', 'Contra-exemplo'], rows: [
      ['Classe', 'PascalCase (inicial maiúscula, sem espaços)', '`ContaBancaria`, `ExtratoDigital`', '`contaBancaria`, `conta_bancaria`'],
      ['Atributo', 'camelCase (inicial minúscula)', '`saldo`, `titular`, `numeroDaConta`', '`Saldo`, `NUMERO`'],
      ['Método', 'camelCase, verbo no imperativo', '`depositar`, `consultarSaldo`', '`Depositar`, `fazDeposito`'],
      ['Variável local', 'camelCase e descritiva', '`valorDepositado`', '`v1`, `x`'],
      ['Método `main`', '`main` sempre em minúsculas e com a assinatura exata', '`public static void main(String[] args)`', '`Main`, `MAIN`'],
    ] },
    { t: 'p', text: 'Nomes de método funcionam como **verbos** (`depositar`, `sacar`, `listarExtrato`) e nomes de atributo como **substantivos** (`saldo`, `titular`). Se você escrever um método chamado `saldoAtual`, pergunte-se: isso é uma ação ou um dado? Se for dado, provavelmente é um atributo; se for ação, o nome certo seria `consultarSaldo`.' },

    { t: 'h2', text: 'Atributos: a JVM já dá um valor inicial' },
    { t: 'p', text: 'Diferente das variáveis **locais** — que exigem atribuição antes do uso —, atributos de classe são inicializados automaticamente com um valor padrão do tipo. Isso significa que `new ContaBancaria()` já devolve um objeto com números em zero e referências em `null`, sem você escrever uma linha sequer.' },
    { t: 'code', lang: 'java', caption: 'Principal.java (valores padrão dos atributos)', code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria c = new ContaBancaria();

        System.out.println(c.saldo);      // 0.0
        System.out.println(c.titular);    // null
        System.out.println(c.ativa);      // false

        // int idade = idade + 1;   // ERRO de compilacao: variavel local sem valor
    }
}

class ContaBancaria {
    double saldo;      // padrao: 0.0
    String titular;    // padrao: null
    boolean ativa;     // padrao: false
    int agencia;       // padrao: 0
}` },
    { t: 'p', text: 'Nas linhas `System.out.println(c.saldo);` e companhia, você confirma os padrões: `double` nasce como `0.0`, `String` (tipo de referência) nasce como `null` e `boolean` nasce como `false`. A linha comentada `// int idade = idade + 1;` recorda a regra do módulo 1: **variável local não recebe valor automático** — usá-la antes de atribuir é erro de compilação. Essa assimetria (atributo tem padrão, local não) evita que objetos surjam com campos de leitura impossível, mas não evita o `null` em texto — por isso preencher os dados logo de cara será trabalho do construtor na aula 3.' },
    { t: 'table', headers: ['Tipo do atributo', 'Valor padrão', 'Observação'], rows: [
      ['`int`, `long`, `short`, `byte`', '`0`', 'Números inteiros nascem zerados'],
      ['`double`, `float`', '`0.0`', 'Números decimais nascem zerados'],
      ['`char`', '`\\u0000`', 'O caractere de código zero (não é espaço nem texto)'],
      ['`boolean`', '`false`', 'Toda condição começa desligada'],
      ['Qualquer referência (`String`, classe própria, array)', '`null`', 'Acessar membros de `null` gera `NullPointerException`'],
    ] },

    { t: 'h2', text: 'Métodos com retorno: devolvendo um valor' },
    { t: 'p', text: 'Um método com tipo de retorno diferente de `void` é um **contrato**: ele promete devolver um valor daquele tipo por **todos** os caminhos possíveis. O compilador interrompe a compilação se existir qualquer caminho que chegue ao fim do método sem executar um `return`.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (métodos com retorno)', code: `class ContaBancaria {
    String titular;
    double saldo;

    double consultarSaldo() {
        return saldo;
    }

    double calcularSaldoComJuros(double taxa) {
        double rendimento = saldo * taxa;
        return saldo + rendimento;
    }

    double saldoAposDeposito(double valor) {
        if (valor > 0) {
            return saldo + valor;
        }
        return saldo;
    }
}` },
    { t: 'p', text: 'No método `consultarSaldo()`, a linha `return saldo;` envia o valor do atributo para quem chamou — e **encerra** a execução do método. Em `calcularSaldoComJuros(double taxa)`, a linha `double rendimento = saldo * taxa;` cria uma variável **local** só dentro do método, e `return saldo + rendimento;` devolve o resultado da soma. Em `saldoAposDeposito(double valor)`, repare nos dois `return`: o primeiro está dentro do `if` e só executa se `valor > 0`; o segundo é a saída dos demais casos. Como **todo** caminho termina em `return`, o código compila.' },
    { t: 'p', text: 'O valor usado após o `return` pode ser qualquer expressão válida: atributo, variável local, parâmetro ou operação entre eles. E o resultado pode ser **usado diretamente** em uma chamada, como em `double novoSaldo = conta.saldoAposDeposito(100.0);` — a chamada é substituída pelo valor devolvido.' },

    { t: 'h2', text: 'Métodos void: executar sem devolver' },
    { t: 'p', text: 'Quando o objetivo do método é **mudar algo** ou **produzir efeito** (imprimir, gravar, atualizar estado), ele é `void` — do latim "vazio": não devolve valor algum. Um método `void` **não pode** ser usado em expressão nem receber o resultado em uma variável.' },
    { t: 'code', lang: 'java', caption: 'Principal.java (método void em uso)', code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria conta = new ContaBancaria();
        conta.titular = "Ana";
        conta.saldo = 800.0;

        conta.depositar(200.0);              // efeito: saldo vira 1000.0
        conta.exibirResumo();                // efeito: imprime na tela

        // double x = conta.depositar(50.0);  // ERRO: void nao devolve valor
    }
}

class ContaBancaria {
    String titular;
    double saldo;

    void depositar(double valor) {
        saldo = saldo + valor;
    }

    void exibirResumo() {
        System.out.println(titular + " tem R$ " + saldo);
    }
}` },
    { t: 'p', text: 'Na linha `conta.depositar(200.0);`, o efeito esperado é o atributo `saldo` do objeto `conta` passar de `800.0` para `1000.0` — o método age sobre o próprio estado. A linha comentada `// double x = conta.depositar(50.0);` é **erro de compilação** porque `depositar` é `void`: não existe valor para guardar em `x`. A mensagem do compilador será do tipo "cannot assign a value from void". Para devolver um número, o método precisa declarar `double` e usar `return`.' },

    { t: 'h2', text: 'Parâmetro, argumento e escopo' },
    { t: 'p', text: 'Dois nomes parecidos, significados diferentes: **parâmetro** é a variável declarada na assinatura do método (`double valor`); **argumento** é o valor concreto passado na chamada (`200.0`). E dentro do método existe um terceiro território: as **variáveis locais**, que enxergam apenas o que está entre as chaves daquele método.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (parâmetros e locais)', code: `class ContaBancaria {
    String titular;
    double saldo;

    void depositar(double valor) {
        if (valor > 0) {
            saldo = saldo + valor;
        }
    }

    void transferirPara(ContaBancaria destino, double valor) {
        double taxa = 1.5;
        if (valor > 0 && saldo >= valor + taxa) {
            saldo = saldo - valor - taxa;
            destino.saldo = destino.saldo + valor;
        }
    }
}` },
    { t: 'p', text: 'Em `void depositar(double valor)`, `valor` é o **parâmetro**; quando alguém escreve `conta.depositar(200.0)`, o `200.0` é o **argumento** que preenche esse parâmetro na chamada. Dentro de `transferirPara`, a linha `double taxa = 1.5;` cria uma **variável local**: ela nasce a cada chamada, vive só enquanto o método executa e desaparece ao final — ninguém de fora consegue ler `taxa`. Já `saldo` e `destino.saldo` são **atributos de objetos**: `saldo` pertence à conta que recebeu a chamada, e `destino.saldo` acessa um atributo de **outro objeto** passado como parâmetro.' },
    { t: 'note', kind: 'warn', title: 'Atributo x variável local com o mesmo nome', text: 'Se um método declarar `double saldo = 10.0;` dentro dele, essa local **sombra** (esconde) o atributo: todas as leituras de `saldo` dentro daquele método enxergam a local, e o atributo fica intocável até sair do método. É um erro silencioso muito comum — por isso dê nomes distintos às locais, como `valorSaldo` ou `novoSaldo`.' },

    { t: 'h2', text: 'O que é copiado ao passar parâmetros' },
    { t: 'p', text: 'Java passa **tudo por valor**, mas o que muda é o que esse valor contém. Para primitivos (`int`, `double`, `boolean`...), o valor é o número em si. Para objetos, o valor é a **referência** — o endereço. Essa distinção explica por que um método altera a conta de quem chamou, mas não consegue trocar a variável do chamador.' },
    { t: 'code', lang: 'java', caption: 'Principal.java (primitivo x objeto por parâmetro)', code: `public class Principal {
    public static void main(String[] args) {
        int tentativas = 3;
        ContaBancaria conta = new ContaBancaria();
        conta.saldo = 100.0;

        incrementar(tentativas);
        depositarNaConta(conta, 50.0);

        System.out.println(tentativas);      // 3: local nao afeta o original
        System.out.println(conta.saldo);     // 150.0: objeto foi alterado
    }

    static void incrementar(int valor) {
        valor = valor + 1;
    }

    static void depositarNaConta(ContaBancaria c, double v) {
        c.saldo = c.saldo + v;
    }
}

class ContaBancaria {
    double saldo;
}` },
    { t: 'p', text: 'Em `incrementar(tentativas)`, a linha `valor = valor + 1;` altera **a cópia local** que o método recebeu — por isso, depois da chamada, `System.out.println(tentativas);` ainda imprime `3`. Em `depositarNaConta(conta, 50.0)`, o parâmetro `c` recebe uma **cópia da referência**: é outro nome para o **mesmo objeto**. A linha `c.saldo = c.saldo + v;` modifica o campo do objeto compartilhado, e por isso `System.out.println(conta.saldo);` imprime `150.0`. Repare nos comentários: a primeira saída é `3`, a segunda é `150.0` — mesmo mecanismo de passagem, resultados diferentes porque um caso mexe em número e o outro em objeto referenciado.' },
    { t: 'p', text: 'Consequência prática: um método `void` com objeto por parâmetro é a forma idiomática de **devolver efeito sem usar `return`**. Já para reatribuir a referência do chamador (fazer `conta` apontar para outro objeto), o método precisaria devolver uma `ContaBancaria` — padrão que você usará quando houver retorno de objetos, como em `consultarSaldo`, que devolve um número.' },

    { t: 'h2', text: 'Um modelo de conta com extrato' },
    { t: 'p', text: 'Para fechar a aula, um exemplo que combina tudo: atributos de vários tipos, método `void` que altera estado, método com retorno que devolve um valor e uso de **array** — o único recurso do módulo 1 que ainda não havia aparecido dentro de uma classe.' },
    { t: 'code', lang: 'java', caption: 'ContaBancaria.java (modelo completo da aula)', code: `public class ContaBancaria {
    String titular;
    String numero;
    double saldo;
    double[] extrato = new double[10];
    int quantidadeDeMovimentacoes = 0;

    void depositar(double valor) {
        if (valor > 0) {
            saldo = saldo + valor;
            registrarMovimentacao(valor);
        }
    }

    void sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo = saldo - valor;
            registrarMovimentacao(-valor);
        }
    }

    void registrarMovimentacao(double valor) {
        extrato[quantidadeDeMovimentacoes] = valor;
        quantidadeDeMovimentacoes = quantidadeDeMovimentacoes + 1;
    }

    double consultarSaldo() {
        return saldo;
    }

    int contarMovimentacoes() {
        return quantidadeDeMovimentacoes;
    }
}` },
    { t: 'p', text: 'Os atributos `double[] extrato = new double[10];` e `int quantidadeDeMovimentacoes = 0;` já nascem inicializados, porque atributos podem ter valor na própria declaração. O método `depositar` chama `registrarMovimentacao(valor);` — **método chamando método** da mesma classe, uma organização que mantém a regra de registrar movimentação em um único lugar. Em `registrarMovimentacao`, a linha `extrato[quantidadeDeMovimentacoes] = valor;` grava na primeira posição livre e a seguinte incrementa o contador, preparando a próxima. Os métodos `consultarSaldo()` e `contarMovimentacoes()` são **leituras** com retorno: devolvem o estado sem modificá-lo.' },
    { t: 'note', kind: 'info', title: 'Limites deste modelo', text: 'O array fixo de dez posições transborda se houver mais movimentações, e nenhum método impede saldo negativo ainda. Esses dois pontos são propositalmente abertos: a **validação de dados** fecha o primeiro na aula 5, e a evolução para coleções dinâmicas acontece no módulo 3. O objetivo aqui é a estrutura, não a robustez final.' },

    { t: 'h2', text: 'Erros de compilação mais comuns nesta aula' },
    { t: 'p', text: 'Como quase toda aula nova de sintaxe, esta gera três mensagens de erro que você vai ver repetidamente. Conhecer a mensagem economiza meia hora de pesquisa.' },
    { t: 'ul', items: [
      '**"missing return statement"**: o método declara tipo de retorno (ex.: `double`) mas existe um caminho sem `return`. Corrija devolvendo um valor em todos os ramos ou convertendo o método para `void` se ele não precisava devolver nada.',
      '**"cannot assign a value from void"**: você tentou guardar em variável o resultado de um método `void`. Ou mude a variável para uso do efeito (sem atribuição), ou acrescente retorno ao método.',
      '**"method X cannot be applied to given types"**: a chamada passou número errado de argumentos ou tipos incompatíveis. Confira a assinatura: `depositar(double)` não recebe `String`, nem aceita dois argumentos.',
      '**"variable might not have been initialized"**: você usou uma variável local antes de atribuir valor — lembre-se de que só atributos têm valor padrão.',
    ] },
    { t: 'p', text: 'Todos eles são **erros de compilação**: o `javac` os reporta antes de o programa rodar, graças à tipagem estática que você conheceu na aula 1 do módulo 1. Nenhum deles depende de execução — basta ler a mensagem, localizar a linha citada e conferir assinatura, retorno e inicialização.' },
  ],

  commonMistakes: [
    { title: 'Achar que variável local nasce com valor padrão', text: 'Só **atributos** recebem valores automáticos (`0`, `false`, `null`). Dentro de um método, `double taxa;` fica sem valor até você atribuir, e usá-la antes gera erro de compilação. Se a intenção era um valor de partida, escreva `double taxa = 1.0;` na própria declaração.' },
    { title: 'Declarar uma local com o mesmo nome do atributo', text: 'Se `depositar` contiver `double saldo = 0.0;`, a local **esconde** o atributo e o depósito deixa de alterar o objeto — o programa compila, mas o saldo nunca muda. Prefira nomes como `novoSaldo` ou `valorDepositado` para as variáveis locais.' },
    { title: 'Esperar que um método void seja usado em expressão', text: 'Linhas como `double x = conta.depositar(50.0);` não compilam porque `depositar` é `void`. Se você precisa de um valor de volta, o método precisa declarar o tipo (`double depositar(...)`) e usar `return` — ou crie um método de consulta separado, como `consultarSaldo()`.' },
    { title: 'Copiar a assinatura do método errado na chamada', text: 'Passar argumentos a mais, a menos ou de tipo trocado produz "method cannot be applied to given types". Confira sempre a declaração: `void transferirPara(ContaBancaria destino, double valor)` exige **dois** argumentos, nessa ordem, e o primeiro é uma conta, não um número.' },
    { title: 'Esperar que o método troque a referência do chamador', text: 'Passar `conta` por parâmetro copia a referência: o método consegue **alterar o objeto**, mas não faz a variável do `main` apontar para outro objeto. Para isso, o método precisaria devolver uma referência nova — padrão que aparecerá nas aulas seguintes.' },
  ],

  bestPractices: [
    { title: 'Um método, uma responsabilidade clara', text: 'Métodos como `depositar`, `sacar` e `registrarMovimentacao` devem fazer uma coisa só e ter nome de verbo. Quando um método começa a imprimir, calcular e atualizar ao mesmo tempo, divida-o: métodos curtos são fáceis de testar, ler e reutilizar — e é assim que o serviço do módulo 4 será escrito.' },
    { title: 'Devolva o resultado, não imprima dentro do método de cálculo', text: 'Separe `consultarSaldo()` (devolve `double`) de `exibirResumo()` (imprime). Assim o mesmo cálculo serve para a tela, para um arquivo ou para um teste futuro, sem depender de `System.out`.' },
    { title: 'Use os tipos primitivos nos atributos de valor', text: '`double saldo` é preferível a `String saldo` para valores monetários nesta fase: o compilador impede somar texto a dinheiro e o padrão já é `0.0`. O tipo `String` fica reservado para dados textuais como `titular` e `numero`.' },
    { title: 'Valide cedo, dentro do próprio método', text: 'Os métodos `depositar` e `sacar` deste exemplo já ignoram valores não positivos com `if`. Essa postura — **nunca deixar o estado entrar em condição inválida** — é a mesma que guiará os setters da aula 5. Prefira um `if` silencioso no começo a descobrir saldo negativo no fim.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Classe = **declaração** + **atributos** (estado) + **métodos** (comportamento); o construtor vem na aula 3.',
      'Convenções: classe em **PascalCase**, atributos e métodos em **camelCase**, métodos com nome de verbo.',
      'Atributos nascem com valor padrão (`0`, `0.0`, `false`, `null`); **variáveis locais não**.',
      'Método com tipo de retorno exige `return` em **todos** os caminhos; método `void` executa sem devolver valor.',
      '**Parâmetro** é o da assinatura; **argumento** é o valor passado na chamada.',
      'Java passa tudo **por valor**: primitivos chegam copiados como número, objetos chegam como **referência** — por isso um método altera a conta do chamador.',
      'Método pode chamar outro método da mesma classe (`depositar` chama `registrarMovimentacao`), mantendo cada regra em um único lugar.',
      'Erros clássicos: local sem inicialização, local sombreando atributo, usar resultado de `void` e assinatura trocada na chamada.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você elimina o problema de nascer com `null`: os **construtores** garantem que todo objeto comece com titular, número e saldo válidos, e a palavra-chave `this` resolve o embate entre parâmetro e atributo de mesmo nome.' },
  ],

  exercises: [
    {
      id: 'm2l02e1',
      type: 'mc',
      question: 'Na declaração `void depositar(double valor) { ... }`, qual é o parâmetro e qual é o tipo de retorno?',
      options: [
        'Parâmetro é `valor` e tipo de retorno é `void`',
        'Parâmetro é `depositar` e tipo de retorno é `double`',
        'Parâmetro é `void` e tipo de retorno é `valor`',
        'Parâmetro é `double valor` entendido como retorno, e não há tipo de retorno',
      ],
      answer: 0,
      explanation: '`valor` é a **variável parâmetro**, declarada entre parânteses com seu tipo `double`. O texto antes do nome do método, `void`, é o **tipo de retorno** — e `void` indica que o método não devolve valor algum. `depositar` é o nome do método, não parâmetro nem retorno.',
    },
    {
      id: 'm2l02e2',
      type: 'tf',
      question: 'Atributos de um objeto recebem valores padrão da JVM (como 0.0, false e null), mas variáveis locais declaradas dentro de um método também recebem esses valores automaticamente.',
      answer: false,
      explanation: 'Só **atributos** têm inicialização automática. Variáveis locais nascem sem valor, e usá-las antes de atribuir gera o erro "variable might not have been initialized". Se você declarar `double taxa;` dentro de um método e imprimi-la antes de qualquer atribuição, o `javac` nem gera o `.class`.',
    },
    {
      id: 'm2l02e3',
      type: 'code',
      question: 'O programa abaixo tem um erro de compilação. Qual linha o provoca?',
      code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria c = new ContaBancaria();
        c.saldo = 500.0;
        double novo = c.depositar(100.0);
        System.out.println(novo);
    }
}

class ContaBancaria {
    double saldo;

    void depositar(double valor) {
        saldo = saldo + valor;
    }
}`,
      lang: 'java',
      options: [
        'A linha `c.saldo = 500.0;`',
        'A linha `double novo = c.depositar(100.0);`',
        'A linha `saldo = saldo + valor;` dentro do método',
        'A linha `System.out.println(novo);`',
      ],
      answer: 1,
      explanation: '`depositar` foi declarado como **`void`**: ele executa o efeito (somar ao saldo) e não devolve valor algum. Tentar guardar o resultado em `double novo` gera erro do tipo "cannot assign a value from void". Para funcionar, ou o método passaria a devolver `double` com `return saldo;`, ou a chamada seria apenas `c.depositar(100.0);`, sem atribuição. As demais linhas estão sintaticamente corretas.',
    },
    {
      id: 'm2l02e4',
      type: 'short',
      question: 'Explique a diferença entre parâmetro e argumento usando o método `void depositar(double valor)` e uma chamada `conta.depositar(200.0)`.',
      keywords: [
        ['parametro', 'parâmetro', 'declarac', 'declaraç', 'assinatura', 'metodo', 'método'],
        ['argumento', 'valor passado', 'chamada', '200'],
      ],
      answerText: '`valor` é o parâmetro: a variável declarada na assinatura do método `depositar(double valor)`. Já `200.0` é o argumento: o valor concreto enviado na chamada `conta.depositar(200.0)`, que preenche o parâmetro durante a execução do método.',
      explanation: 'A distinção é **declaração x chamada**: o parâmetro existe no corpo do código do método e é sempre uma variável com tipo; o argumento é o que se escreve no momento de chamar e pode ser qualquer expressão compatível com aquele tipo (`saldo`, `100.0 + 50.0` ou `conta.consultarSaldo()`). Trocar os termos na conversa não quebra o código, mas trava a leitura de mensagens de erro do compilador, que sempre citam "parameters" e "arguments" separadamente.',
    },
    {
      id: 'm2l02e5',
      type: 'code',
      question: 'Considere o programa. O que é impresso na segunda linha de saída?',
      code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria a = new ContaBancaria();
        a.saldo = 100.0;
        mover(a);
        System.out.println(a.saldo);

        int x = 7;
        dobrar(x);
        System.out.println(x);
    }

    static void mover(ContaBancaria c) {
        c.saldo = c.saldo + 50.0;
    }

    static void dobrar(int n) {
        n = n * 2;
    }
}

class ContaBancaria {
    double saldo;
}`,
      lang: 'java',
      options: ['7', '14', '150.0', 'Erro de compilação'],
      answer: 0,
      explanation: 'A segunda `System.out.println` imprime **`7`**: em `dobrar(x)`, o parâmetro `n` recebe uma **cópia do valor** `7`, e `n = n * 2;` altera apenas essa cópia local — a variável `x` do `main` permanece `7`. A primeira saída, por sua vez, seria `150.0`, porque `mover(a)` copiou a **referência** e o método alterou o objeto compartilhado. O programa compila sem problemas: os dois métodos `void` são chamados apenas pelo efeito.',
    },
  ],

  challenge: {
    id: 'm2l02c1',
    title: 'Conta bancária com extrato',
    fileName: 'ContaBancaria.java',
    prompt: 'Escreva o arquivo `ContaBancaria.java` contendo uma classe `public` chamada `ContaBancaria` com `main` dentro dela, para que `javac ContaBancaria.java` e `java ContaBancaria` funcionem direto. A classe deve ter os atributos `String titular`, `String numero`, `double saldo`, `double[] extrato = new double[10]` e `int quantidadeDeMovimentacoes = 0`. Implemente os métodos `void depositar(double valor)`, que só executa se `valor > 0`, soma ao saldo e registra o valor no extrato; `void sacar(double valor)`, que só executa se `valor > 0` e `valor <= saldo`, subtrai do saldo e registra o valor negativo no extrato; `double consultarSaldo()`, que devolve o saldo; e `int contarMovimentacoes()`, que devolve quantas movimentações já foram registradas. No `main`, crie duas contas diferentes (Ana com saldo inicial 1000,0 e Bruno com saldo inicial 300,0), faça dois depósitos e um saque na conta da Ana, um saque na conta do Bruno, e imprima o saldo de cada uma e a quantidade de movimentações de cada uma — os valores impressos devem refletir apenas as operações da própria conta.',
    starterCode: `public class ContaBancaria {
    // atributos

    // metodos depositar, sacar, consultarSaldo e contarMovimentacoes

    public static void main(String[] args) {
        // crie as duas contas e movimente cada uma
    }
}`,
    criteria: [
      'Declara os cinco atributos pedidos: `titular`, `numero`, `saldo`, `extrato` (array de 10 posições) e `quantidadeDeMovimentacoes` iniciado em 0',
      '`depositar` só altera estado quando `valor > 0` e também registra a movimentação no extrato',
      '`sacar` exige `valor > 0` **e** `valor <= saldo` antes de subtrair, registrando o valor negativo',
      '`consultarSaldo()` e `contarMovimentacoes()` são métodos com retorno (`double` e `int`) que usam `return`',
      'O `main` cria dois objetos distintos com `new` e movimenta cada um de forma independente',
      'A saída imprime saldo e quantidade de movimentações das duas contas, com números coerentes com as operações executadas',
    ],
    modelSolution: [
      { t: 'p', text: 'Abaixo, a versão de referência. Repare que cada conta guarda o próprio extrato e o próprio contador, e que `depositar` reaproveita a checagem de valor positivo antes de registrar.' },
      { t: 'code', lang: 'java', caption: 'ContaBancaria.java', code: `public class ContaBancaria {
    String titular;
    String numero;
    double saldo;
    double[] extrato = new double[10];
    int quantidadeDeMovimentacoes = 0;

    void depositar(double valor) {
        if (valor > 0) {
            saldo = saldo + valor;
            registrarMovimentacao(valor);
        }
    }

    void sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo = saldo - valor;
            registrarMovimentacao(-valor);
        }
    }

    void registrarMovimentacao(double valor) {
        extrato[quantidadeDeMovimentacoes] = valor;
        quantidadeDeMovimentacoes = quantidadeDeMovimentacoes + 1;
    }

    double consultarSaldo() {
        return saldo;
    }

    int contarMovimentacoes() {
        return quantidadeDeMovimentacoes;
    }

    public static void main(String[] args) {
        ContaBancaria ana = new ContaBancaria();
        ana.titular = "Ana";
        ana.numero = "0001";
        ana.saldo = 1000.0;

        ContaBancaria bruno = new ContaBancaria();
        bruno.titular = "Bruno";
        bruno.numero = "0002";
        bruno.saldo = 300.0;

        ana.depositar(200.0);
        ana.depositar(150.0);
        ana.sacar(350.0);
        bruno.sacar(100.0);
        bruno.sacar(9999.0);   // recusado: saldo insuficiente

        System.out.println(ana.titular + ": R$ " + ana.consultarSaldo()
                + " | movimentacoes: " + ana.contarMovimentacoes());
        System.out.println(bruno.titular + ": R$ " + bruno.consultarSaldo()
                + " | movimentacoes: " + bruno.contarMovimentacoes());
    }
}` },
      { t: 'p', text: 'A saída esperada é `Ana: R$ 1000.0 | movimentacoes: 3` e `Bruno: R$ 200.0 | movimentacoes: 1` — o saque recusado de Bruno não altera saldo nem contador. Se os números divergirem, confira primeiro se `sacar` valida **antes** de subtrair e se cada objeto está chamando os métodos da conta certa.' },
    ],
  },
}
