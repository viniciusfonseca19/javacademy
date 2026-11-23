export default {
  id: 'm1l10',
  moduleId: 'm1',
  number: 10,
  title: 'Repetição com while e do-while',
  durationMinutes: 20,

  objectives: [
    'Diferenciar os laços `for`, `while` e `do-while` e escolher o adequado para cada problema',
    'Escrever laços `while` cuja condição dependa de dados fornecidos pelo usuário',
    'Identificar e corrigir laços infinitos causados por condições que nunca mudam',
    'Usar `do-while` em menus e validações que precisam executar ao menos uma vez',
  ],

  prerequisites: [
    'Ter concluído a aula "Repetição com laço for"',
    'Saber montar condições com operadores relacionais e lógicos',
    'Conseguir ler valores com `Scanner` e imprimir com `System.out.println`',
    'Ter praticado `if` e `else` para desviar o fluxo do programa',
  ],

  intro: [
    { t: 'p', text: 'O laço `for` é ideal quando você **sabe de antemão quantas voltas serão dadas**: dez multiplicações, cinco notas, cem linhas de tabela. Mas boa parte dos problemas reais não tem esse número na mão. "Leia notas até o usuário digitar -1", "peça a senha até acertar", "mostre o menu enquanto a opção não for sair" — em todos, **a parada depende de um dado que só existe em tempo de execução**.' },
    { t: 'p', text: 'Para esses casos existe o laço `while`, que testa uma condição antes de cada volta e não se importa com contadores. Nesta aula você também conhece o `do-while`, uma variação que executa o corpo **ao menos uma vez** antes de testar — perfeita para menus, em que a primeira exibição é obrigatória. Ao final, você saberá escolher entre `for`, `while` e `do-while`, e identificará em segundos a armadilha número um destes laços: o **loop infinito**.' },
    { t: 'p', text: 'Pense em dirigir: você não planeja quantos quilômetros vai rodar antes de sair de casa. Você dirige **enquanto** o tanque não está vazio e a estrada continua. Essa é a diferença essencial — o `for` conta o percurso, o `while` dirige enquanto a condição durar.' },
    { t: 'note', kind: 'tip', title: 'Prática sugerida', text: 'Todos os exemplos abaixo leem dados do teclado. Rodar cada um deles interativamente é metade do aprendizado: digite valores-limite (o primeiro já encerra o laço, o último ainda dentro do intervalo) e observe o comportamento.' },
  ],

  theory: [
    { t: 'h2', text: 'Quando o número de repetições é desconhecido' },
    { t: 'p', text: 'Imagine um programa que soma valores digitados e encerra quando o usuário digita 0. Com `for`, você precisaria de um número fixo de leituras — mas aqui ninguém sabe quantas virão antes. A condição de parada é "o valor digitado é zero", e ela só pode ser avaliada **depois** de cada leitura. É exatamente o cenário do `while`.' },
    { t: 'code', lang: 'java', caption: 'SomaAteZero.java', code: `import java.util.Scanner;

class SomaAteZero {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        double soma = 0;
        double valor = -1;

        while (valor != 0) {
            System.out.print("Digite um valor (0 para encerrar): ");
            valor = teclado.nextDouble();
            soma = soma + valor;
        }

        System.out.println("Soma total: " + soma);
        teclado.close();
    }
}` },
    { t: 'p', text: 'A linha `while (valor != 0)` é testada antes de cada volta. Como `valor` foi inicializado com -1 (um valor que certamente não é 0), a primeira execução acontece garantida. Dentro do corpo, a leitura `valor = teclado.nextDouble()` **atualiza a condição** — é ela que, em algum momento, fará `valor != 0` ficar falso e encerrará o laço. Repare que o 0 digitado também entra na soma (`soma = soma + valor`), o que não altera o total: somar zero não muda nada. Se o usuário digitar 0 logo de cara, o laço executa uma vez e para.' },
    { t: 'note', kind: 'info', title: 'A estrutura geral', text: '`while (condicao) { corpo }` — se a condição já chegar falsa, o corpo **não executa nenhuma vez** (diferente do `do-while`, que veremos adiante). Por isso a inicialização da variável controladora importa: ela define o estado inicial testado.' },

    { t: 'h2', text: 'Anatomia do `while`' },
    { t: 'p', text: 'O `while` tem apenas dois elementos: a condição entre parênteses e o corpo entre chaves. A diferença em relação ao `for` é que **não há lugar dedicado para inicializar nem para atualizar a variável** — quem cria e quem muda a variável de controle é o seu código, espalhado antes e dentro do corpo. Essa flexibilidade é a força e o risco da estrutura.' },
    { t: 'table', headers: ['Laço', 'Quando escolher', 'Teste da condição', 'Mínimo de execuções'], rows: [
      ['`for`', 'Número de voltas conhecido ou contador definido', 'Antes de cada volta', '0 (se a condição já nascer falsa)'],
      ['`while`', 'Condição depende de dados de execução (entrada, estado)', 'Antes de cada volta', '0 (se a condição já nascer falsa)'],
      ['`do-while`', 'O corpo precisa rodar ao menos uma vez (menus, pedir senha)', 'Depois de cada volta', '1 (sempre)'],
    ] },
    { t: 'p', text: 'Repare na última coluna: `while` pode executar **zero vezes**, `do-while` sempre executa **pelo menos uma**. Essa única diferença decide qual estrutura usar quando a primeira interação é obrigatória.' },
    { t: 'p', text: 'Para escrever um `while` seguro, três perguntas respondem tudo: (1) **qual variável** representa o estado que muda? (2) **onde essa variável é atualizada** dentro do corpo? (3) **existe algum caminho** em que ela deixa de mudar? Se a resposta para a última pergunta for "sim", o laço tem risco de nunca terminar.' },

    { t: 'h2', text: '`do-while`: ao menos uma vez' },
    { t: 'p', text: 'O `do-while` inverte a ordem do teste: o corpo executa primeiro e **só depois** a condição é avaliada. Se ela ainda for verdadeira, repete. A sintaxe tem um detalhe que derruba muita prova: o **ponto e vírgula depois do `while (condicao)`**.' },
    { t: 'code', lang: 'java', caption: 'MenuSimples.java', code: `import java.util.Scanner;

class MenuSimples {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int opcao;

        do {
            System.out.println("1 - Cadastrar aluno");
            System.out.println("2 - Listar alunos");
            System.out.println("0 - Sair");
            System.out.print("Opcao: ");
            opcao = teclado.nextInt();

            if (opcao == 1) {
                System.out.println(">> cadastro em andamento");
            } else if (opcao == 2) {
                System.out.println(">> listagem em andamento");
            }
        } while (opcao != 0);

        System.out.println("Programa encerrado.");
        teclado.close();
    }
}` },
    { t: 'p', text: 'Observe a linha `} while (opcao != 0);`: o bloco `do { ... }` mostra o menu e lê a opção, e então a condição decide se o menu aparece de novo. Como o teste acontece **depois**, o menu é exibido sempre — mesmo que a primeira opção digitada seja 0, o estudante vê as opções antes de sair. Note também que `opcao` é declarada **antes** do `do`: se fosse declarada dentro das chaves, a condição `while` não conseguiria lê-la e o código não compilaria.' },
    { t: 'p', text: 'Por que isso importa em menus? Com um `while (opcao != 0)` tradicional, você teria que inicializar `opcao` com um valor "não-saída" (como -1) só para passar no primeiro teste, e o menu só apareceria na segunda linha de execução se o valor inicial fosse o de saída. O `do-while` elimina esse artifício: o corpo é a primeira coisa que roda.' },

    { t: 'h2', text: 'A mesma lógica em `while` e em `do-while`' },
    { t: 'p', text: 'Vale ver as duas estruturas lado a lado para perceber o custo de cada escolha. O programa abaixo pede um número e o dobra, repetindo enquanto o usuário não digitar 0 — uma vez com `while` e uma vez com `do-while`.' },
    { t: 'code', lang: 'java', caption: 'Comparacao.java', code: `import java.util.Scanner;

class Comparacao {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        // Versao com while: exige valor inicial fora da condicao
        double valor = -1;
        while (valor != 0) {
            System.out.print("[while] numero (0 sai): ");
            valor = teclado.nextDouble();
            System.out.println("Dobro: " + (valor * 2));
        }

        // Versao com do-while: le primeiro, testa depois
        double entrada;
        do {
            System.out.print("[do-while] numero (0 sai): ");
            entrada = teclado.nextDouble();
            System.out.println("Dobro: " + (entrada * 2));
        } while (entrada != 0);

        teclado.close();
    }
}` },
    { t: 'p', text: 'Na versão `while`, a linha `double valor = -1;` existe **apenas** para garantir que o primeiro teste passe — um valor de "muleta". Na versão `do-while`, `double entrada;` é declarado sem valor porque ele será preenchido dentro do corpo **antes** de qualquer teste. Repare ainda que o corpo das duas é idêntico: o `do-while` não muda o que acontece dentro, muda apenas **quando** a condição é verificada.' },
    { t: 'p', text: 'Uma observação de comportamento: nas duas versões, digitar 0 imprime `Dobro: 0.0` antes de encerrar, porque o corpo roda com o valor digitado. Se o enunciado pedisse **não** processar o 0, o `println` do dobro sairia de dentro do `if (entrada != 0)` — a estrutura de repetição continuaria a mesma, mudaria a posição do conteúdo.' },

    { t: 'h2', text: 'Laços infinitos: a armadilha clássica' },
    { t: 'p', text: 'Um laço infinito ocorre quando a condição **nunca fica falsa**. No `while`, isso acontece quando a variável de controle não é atualizada, ou é atualizada de forma que não se aproxima do fim. O programa a seguir mostra a versão quebrada e, logo abaixo, a correção — compare as duas com atenção.' },
    { t: 'code', lang: 'java', caption: 'ContadorSeguro.java', code: `// VERSAO QUEBRADA: a condicao nunca muda
// int contador = 1;
// while (contador <= 5) {
//     System.out.println("Contagem: " + contador);
//     // falta atualizar contador: imprime "Contagem: 1" para sempre
// }

// VERSAO CORRETA
class ContadorSeguro {
    public static void main(String[] args) {
        int contador = 1;
        while (contador <= 5) {
            System.out.println("Contagem: " + contador);
            contador = contador + 1;
        }
        System.out.println("Fim.");
    }
}` },
    { t: 'p', text: 'Na versão quebrada (comentada), `contador` nasce com 1 e a condição `contador <= 5` é sempre verdadeira: nada no corpo altera o valor, então a mesma linha é impressa infinitamente. A versão correta acrescenta `contador = contador + 1;`, que faz `contador` crescer a cada volta até chegar a 6, momento em que `6 <= 5` fica falso e o laço termina normalmente, imprimindo `Fim.`. A atualização pode ser `contador++` — o formato `contador = contador + 1` aparece aqui para deixar o mecanismo explícito.' },
    { t: 'note', kind: 'warn', title: 'E se travar o terminal?', text: 'Ao rodar um laço infinito, o programa imprime sem parar e não responde. Interrompa com **Ctrl+C** no terminal. Depois, não tente "rodar de novo" sem entender a causa: localize a variável da condição e verifique se ela é atualizada dentro do corpo em todos os caminhos possíveis.' },
    { t: 'p', text: 'Existe um segundo tipo de laço infinito, mais sutil: a variável é atualizada, mas **não na direção certa**. Em `while (contador < 10) { contador = contador - 1; }` partindo de 1, o valor só diminui — a condição nunca ficará falsa. Por isso as três perguntas da seção "Anatomia do `while`" são obrigatórias antes de rodar qualquer laço novo.' },

    { t: 'h2', text: 'Caso realista: validação de entrada' },
    { t: 'p', text: 'O padrão mais útil do `while` em aplicação real é **pedir de novo até o valor ser válido**. A condição do laço é justamente o estado de inválidez: enquanto a nota estiver fora do intervalo permitido, continue pedindo.' },
    { t: 'code', lang: 'java', caption: 'LeituraValida.java', code: `import java.util.Scanner;

class LeituraValida {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        System.out.print("Digite a nota do aluno (0 a 10): ");
        double nota = teclado.nextDouble();

        while (nota < 0 || nota > 10) {
            System.out.println("Valor invalido! Digite uma nota entre 0 e 10.");
            System.out.print("Nota: ");
            nota = teclado.nextDouble();
        }

        System.out.println("Nota aceita: " + nota);
        teclado.close();
    }
}` },
    { t: 'p', text: 'A condição `nota < 0 || nota > 10` descreve o que é **errado**: o laço repete enquanto o valor estiver fora do intervalo. Na prática, digitar -3 ou 15 mostra a mensagem e relê; digitar 7.5 encerra o laço e a nota aceita é impressa. Repare que a primeira leitura acontece **antes** do `while`: sem ela, `nota` não teria valor para testar. Essa leitura inicial + repetição de recuperação é o mesmo formato do `do-while`, que você usará na próxima seção para menus.' },
    { t: 'p', text: 'Uma limitação honesta deste código: se o usuário digitar letras em vez de números, o `Scanner` lança uma exceção e o programa falha — tratar isso exige `try` e `catch`, assunto da aula 13. Por ora, mantenha os testes com valores numéricos.' },

    { t: 'h2', text: 'Escolhendo entre `for`, `while` e `do-while`' },
    { t: 'ul', items: [
      '**`for`**: você conhece o número de voltas ou tem um contador claro (tabuada, somatório de 1 a N, leitura fixa de notas).',
      '**`while`**: a parada depende de uma condição que muda durante a execução e pode ser avaliada antes de cada volta (leitura até sentinela, tentativas até acertar, validação de entrada).',
      '**`do-while`**: o corpo precisa rodar ao menos uma vez, normalmente para mostrar algo e pedir uma escolha (menus, confirmações, pedir senha).',
    ] },
    { t: 'p', text: 'Regra prática: comece perguntando **"quantas vezes isso roda?"**. Se a resposta for um número, `for`. Se for "até acontecer alguma coisa", `while`. Se for "sempre pelo menos uma vez e depois até o usuário decidir parar", `do-while`. Nenhum dos três é mais poderoso que os outros — todos expressam repetição; a diferença está em qual informação o código comunica de forma mais clara.' },
    { t: 'quote', text: 'Um laço é correto quando a sua condição tem uma vida útil limitada: algo dentro do corpo garante que, em algum momento, ela ficará falsa.' },
  ],

  commonMistakes: [
    { title: 'Esquecer de atualizar a variável da condição', text: 'É o erro nº1 do `while`. Se o corpo não altera a variável testada (ou altera apenas em um dos ramos do `if`), a condição permanece verdadeira para sempre e o programa trava imprimindo sem parar. Antes de rodar, localize a variável da condição e confirme que **todos os caminhos do corpo** a atualizam na direção certa. Em caso de dúvida, interrompa com Ctrl+C e leia a última linha repetida.' },
    { title: 'Usar `while` onde o corpo precisa rodar uma vez obrigatoriamente', text: 'Em um menu escrito com `while (opcao != 0)`, se `opcao` for inicializado com 0 por engano, o menu nunca aparece. Se a primeira execução é obrigatória (exibir opções, pedir a senha uma vez), o `do-while` é a estrutura correta — ele testa depois de executar. Inicializar a variável com um valor "de muleta" só para contornar isso esconde a intenção do código.' },
    { title: 'Declarar a variável controladora dentro do bloco', text: 'Em `do { int entrada = teclado.nextInt(); } while (entrada != 0);` a variável morre no fechamento das chaves e a condição não enxerga — o resultado é erro de compilação `cannot find symbol`. Declare a variável **antes** do `do` (ou antes do `while`), de modo que corpo e condição compartilhem o mesmo valor. O mesmo vale para laços `while` em que a variável nasce dentro: ela será recriada a cada volta, anulando o estado acumulado.' },
    { title: 'Esquecer o ponto e vírgula no `do-while`', text: 'A sintaxe é `do { ... } while (condicao);` — o ponto e vírgula final é obrigatório e não existe no `while` comum. Sem ele, o compilador aponta erro na linha seguinte, o que pode confundir quem procura o problema no corpo do laço. Ao escrever `do`, digite já o fechamento completo (`} while (condicao);`) antes de preencher o meio.' },
    { title: 'Condição invertida no `while`', text: 'Escrever `while (valor != 0)` quando o objetivo é "continuar enquanto o valor **for** zero" (ou o contrário) inverte o comportamento: ou o laço não executa nem uma vez, ou encerra imediatamente após a primeira volta. Leia a condição em voz alta como uma frase completa — "enquanto a nota for inválida, peça de novo" — e confira se o corpo corresponde a essa frase.' },
  ],

  bestPractices: [
    { title: 'Inicialize a variável de controle com um estado bem definido', text: 'No `while`, o valor inicial decide se o laço começa. Use um valor que represente claramente o estado antes da primeira interação (como `-1` para "ainda não digitado") ou faça a primeira leitura antes do laço. Evite valores que coincidam com a condição de saída por acidente — isso silencia o laço inteiro.' },
    { title: 'Deixe a condição descrever o estado, não os detalhes', text: '`while (nota < 0 || nota > 10)` comunica "enquanto a nota for inválida". Condições cheias de detalhes de laço (`while (contador != totalLidos + 1)`) funcionam, mas obrigam quem lê a decifrar a relação entre variáveis. Uma condição legível reduz a chance de laço infinito e facilita a revisão por outra pessoa.' },
    { title: 'Use `do-while` para menus e pedidas repetidas de senha', text: 'Quando o conteúdo precisa ser exibido antes da resposta, o `do-while` remove inicializações artificiais e deixa a intenção explícita: "execute e depois pergunte se continua". Reserve o `while` para casos em que testar antes é natural, como somar até o usuário digitar a sentinela.' },
    { title: 'Separe leitura, validação e processamento', text: 'Em validação com laço, mantenha o padrão: ler, testar, repetir se inválido, processar só quando válido. Misturar cálculos dentro do laço de validação torna difícil saber em que momento o dado está confiável. Quando o programa crescer, essa lógica vira um método — a aula 11 mostra como extrair.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'O `while` testa a condição **antes** de cada volta e pode executar **zero vezes**; o `do-while` testa **depois** e sempre executa **pelo menos uma**.',
      'Escolha `for` quando o número de voltas é conhecido, `while` quando a parada depende de dados de execução e `do-while` quando o corpo precisa rodar uma vez obrigatoriamente (menus).',
      'No `while`, quem inicializa e quem atualiza a variável de controle é o seu código — esquecer a atualização gera **laço infinito**.',
      'Laço infinito também nasce de condição na direção errada (contar para baixo com teste `<=`): confira se a variável caminha para o fim da condição.',
      'Declare a variável controladora **antes** do `do`/`while` para que corpo e condição compartilhem o mesmo valor.',
      'No `do-while`, não esqueça o **ponto e vírgula** depois de `while (condicao)`.',
      'Validação de entrada segue o padrão: ler → testar → repetir se inválido → processar quando válido.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Você já sabe repetir; agora vai organizar. A aula 11 apresenta **métodos**: como extrair trechos repetidos em funções com parâmetros e retorno, deixando o `main` pequeno e o programa fácil de evoluir.' },
  ],

  exercises: [
    {
      id: 'm1l10e1',
      type: 'mc',
      question: 'Um programa precisa pedir a senha do usuário repetidamente até ele acertar (máximo ilimitado de tentativas, encerrando quando a senha correta for digitada). Qual laço descreve melhor o problema?',
      options: [
        'Um `for` de 1 a 10, porque toda repetição usa contador',
        'Um `while` cuja condição indica "senha ainda não confere"',
        'Um `for` com passo `i += 2`, para percorrer as tentativas',
        'Um `do-while` com condição sempre verdadeira, pois as tentativas são ilimitadas',
      ],
      answer: 1,
      explanation: 'O número de tentativas **não é conhecido antes**: a parada depende de um dado de execução (a senha estar correta), que é exatamente o cenário do `while`. Um `for` de 1 a 10 fixaria o limite em 10 tentativas; o `for` com `i += 2` nem sequer se relaciona com o problema; e um `do-while` com condição sempre verdadeira é a definição de laço infinito — ele nunca encerraria, mesmo com a senha correta.',
    },
    {
      id: 'm1l10e2',
      type: 'code',
      question: 'O usuário digita os valores 4, 7 e 0. Qual é a saída do programa?',
      code: '// teclado ja e um Scanner criado antes deste trecho\ndouble soma = 0;\ndouble v = -1;\nwhile (v != 0) {\n    v = teclado.nextDouble();\n    soma = soma + v;\n}\nSystem.out.println(soma);',
      lang: 'java',
      options: ['11.0', '4.0', '0.0', 'O laço não executa nenhuma vez'],
      answer: 0,
      explanation: 'A condição é testada antes de cada volta, mas `v` começa com -1 (diferente de 0), então o laço roda. Na 1ª volta `v` vira 4 e `soma` fica 4.0; na 2ª, `v` vira 7 e `soma` fica 11.0; na 3ª, `v` vira 0 e `soma` continua 11.0 (somar zero não altera o total) — agora `v != 0` fica falso e o laço encerra, imprimindo 11.0. Se `v` fosse inicializado com 0, a alternativa "não executa" seria a correta.',
    },
    {
      id: 'm1l10e3',
      type: 'tf',
      question: 'Em um `do-while`, se a condição for falsa logo no primeiro teste, o corpo do laço ainda executa uma vez.',
      answer: true,
      explanation: 'Essa é a definição da estrutura: o `do` executa o corpo **primeiro** e só depois avalia `while (condicao)`. Por isso o `do-while` garante ao menos uma execução — vantagem decisiva em menus, em que as opções precisam aparecer antes de qualquer escolha. Já o `while` comum testa antes e pode não executar nem uma vez.',
    },
    {
      id: 'm1l10e4',
      type: 'code',
      question: 'Qual é o problema do trecho abaixo e qual linha corrige o laço?',
      code: 'int contador = 1;\nwhile (contador <= 5) {\n    System.out.println("Volta " + contador);\n}',
      lang: 'java',
      options: [
        'Erro de compilação: `while` exige um `do` correspondente',
        'Laço infinito: falta atualizar `contador` dentro do corpo, por exemplo com `contador = contador + 1;`',
        'Laço infinito: a condição deveria ser `contador < 1`',
        'O programa imprime 1 a 5 corretamente, sem problemas',
      ],
      answer: 1,
      explanation: 'Nada no corpo altera `contador`, então `contador <= 5` permanece verdadeira para sempre e a linha `Volta 1` se repete infinitamente. Acrescentar `contador = contador + 1;` (ou `contador++`) dentro das chaves faz o valor crescer até 6 e encerra o laço. A opção com `contador < 1` pioraria a situação: com `contador = 1`, a condição já nasceria falsa e nada seria impresso. A ideia de que `while` exige `do` também está errada — são estruturas independentes.',
    },
    {
      id: 'm1l10e5',
      type: 'short',
      question: 'Explique, em duas frases, quando você escolheria um `do-while` em vez de um `while`.',
      keywords: [
        ['do-while', 'ao menos uma vez', 'uma vez', 'primeiro'],
        ['menu', 'exibir', 'mostrar', 'corpo executa antes', 'testa depois', 'depois'],
      ],
      answerText: 'Escolho `do-while` quando o corpo precisa executar ao menos uma vez antes de qualquer teste, como exibir um menu ou pedir uma senha e só então verificar a condição. O `while` é preferido quando a condição pode ser avaliada antes e é possível que o laço não rode nenhuma vez.',
      explanation: 'A decisão gira em torno de uma pergunta: **a primeira execução é obrigatória?** Com `do-while` o teste vem depois do corpo, garantindo a execução mínima e evitando inicializar a variável da condição com um valor artificial só para passar no primeiro teste. Com `while`, você ganha a clareza de testar antes — útil quando o dado ainda não existe e pode nem chegar a ser pedido.',
    },
  ],

  challenge: {
    id: 'm1l10c1',
    title: 'Menu de operações com saída controlada',
    fileName: 'Menu.java',
    prompt: 'Escreva `Menu.java`, um menu de operações que fica aparecendo até o usuário escolher sair. A cada volta, imprima as opções `1 - Dobrar um numero`, `2 - Triplicar um numero` e `0 - Sair`, leia a opção com `Scanner` e direcione a execução: para a opção 1, leia um número decimal e imprima `Dobro: X`; para a opção 2, leia um número decimal e imprima `Triplo: X`; para 0, encerre imprimindo `Programa encerrado.`; para qualquer outra opção, imprima `Opcao invalida.` sem pedir número algum. O menu deve usar `do-while` (o corpo executa ao menos uma vez) e a leitura do número só pode acontecer nas opções 1 e 2.',
    starterCode: 'import java.util.Scanner;\n\nclass Menu {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n        int opcao;\n\n        // monte o menu com do-while e use switch ou if/else\n        // para direcionar as opcoes 0, 1 e 2\n\n        teclado.close();\n    }\n}\n',
    criteria: [
      'O menu é montado dentro de um laço `do-while` cuja condição encerra apenas quando a opção digitada for 0',
      'A opção é lida com `Scanner` a cada volta, dentro do corpo do `do-while`',
      'As opções 0, 1 e 2 são direcionadas por `switch` (ou cadeia de `if/else`) com as três saídas previstas',
      'A opção inválida imprime `Opcao invalida.` e não solicita leitura de número',
      'O número só é lido quando a opção é 1 ou 2, e a saída usa exatamente os rótulos `Dobro: ` e `Triplo: `',
      'Após a opção 0, o programa imprime `Programa encerrado.` e encerra o laço',
    ],
    modelSolution: [
      { t: 'p', text: 'A solução usa `do-while` porque o menu precisa aparecer antes da primeira escolha, e `switch` para direcionar as opções — a estrutura de escolha da aula 8. Repare que a leitura do número está **dentro** de cada caso, e não no corpo genérico: isso garante que opção inválida e saída não pedem dado algum.' },
      { t: 'code', lang: 'java', caption: 'Menu.java', code: `import java.util.Scanner;

class Menu {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int opcao;

        do {
            System.out.println("1 - Dobrar um numero");
            System.out.println("2 - Triplicar um numero");
            System.out.println("0 - Sair");
            System.out.print("Opcao: ");
            opcao = teclado.nextInt();

            switch (opcao) {
                case 1:
                    System.out.print("Numero: ");
                    double valor1 = teclado.nextDouble();
                    System.out.println("Dobro: " + (valor1 * 2));
                    break;
                case 2:
                    System.out.print("Numero: ");
                    double valor2 = teclado.nextDouble();
                    System.out.println("Triplo: " + (valor2 * 3));
                    break;
                case 0:
                    System.out.println("Programa encerrado.");
                    break;
                default:
                    System.out.println("Opcao invalida.");
            }
        } while (opcao != 0);

        teclado.close();
    }
}` },
      { t: 'p', text: 'O ciclo de execução é: imprimir o menu → ler a opção → despachar no `switch` → testar `while (opcao != 0)`. Com a opção 0, o caso `case 0` imprime a mensagem de despedida e a condição fica falsa, encerrando o laço. Com uma opção como 9, o `default` avisa `Opcao invalida.` e o menu aparece de novo sem nenhuma leitura extra.' },
      { t: 'p', text: 'Teste de bancada recomendado: digite 1 e um valor (confira o dobro), depois 2 e um valor (confira o triplo), em seguida 5 (esperada a mensagem de opção inválida) e, por fim, 0 para sair. Se, ao digitar 5, o programa pedir um número, a leitura está fora dos casos — mova-a para dentro de `case 1` e `case 2`.' },
    ],
  },
}
