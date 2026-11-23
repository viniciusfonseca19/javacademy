export default {
  id: 'm1l13',
  moduleId: 'm1',
  number: 13,
  title: 'Introdução ao tratamento de erros',
  durationMinutes: 20,

  objectives: [
    'Diferenciar erro de compilação de exceção em tempo de execução',
    'Identificar no stack trace o tipo da exceção, a mensagem e a linha de origem',
    'Proteger trechos de risco com blocos `try` e `catch` do tipo correto',
    'Recuperar de entradas inválidas repetindo a leitura até o dado ser válido',
    'Reconhecer práticas ruins de tratamento de erros e como evitá-las',
  ],

  prerequisites: [
    'Ter concluído as aulas sobre arrays, laços e métodos do módulo 1',
    'Ter visto erros de compilação na prática ao rodar `javac`',
    'Saber usar `Scanner` com `nextLine` e converter texto com `Integer.parseInt`',
    'Conhecer `if`, `while` e a estrutura básica de um programa Java',
  ],

  intro: [
    { t: 'p', text: 'Seu programa de notas funciona lindamente com os dados de teste. Aí chega o usuário final e digita "oito" no campo de nota, ou "0" no divisor, ou aperta Enter sem nada. Sem tratamento de erros, o programa **morre**: aparece um texto técnico no terminal e tudo o que estava sendo feito é perdido. Em aplicação de verdade, isso significa suporte, retrabalho e usuários irritados.' },
    { t: 'p', text: 'O Java tem uma resposta para isso chamada **exceção**: um objeto de erro que é **lançado** quando algo inesperado acontece, interrompendo o fluxo normal. Existe uma estrutura para **capturar** essa exceção, decidir o que fazer e continuar — o `try` e o `catch`. Nesta aula, você vai aprender a reconhecer as exceções mais comuns, ler o famoso *stack trace* sem pânico, proteger trechos de risco e construir uma leitura de dados que **nunca derruba o programa**, pedindo de novo até o valor ser válido.' },
    { t: 'p', text: 'A analogia do dia a dia: ao dirigir, você não prevê cada buraco, mas tem **volante e freio** para reagir quando ele aparece. `try` é onde você dirige sabendo que pode haver buraco; `catch` é a manobra que você faz quando ele vem. Sem isso, o primeiro buraco encerra a viagem.' },
    { t: 'note', kind: 'tip', title: 'Por que agora?', text: 'Esta é a última aula do módulo 1 e fecha a base: você já sabe declarar variáveis, decidir, repetir, organizar em métodos e guardar dados em arrays. Falta apenas **falhar com elegância** — habilidade que os módulos seguintes usarão o tempo todo, inclusive no tratamento global de erros de uma API REST.' },
  ],

  theory: [
    { t: 'h2', text: 'Dois tipos de falha' },
    { t: 'p', text: 'Antes de tratar qualquer erro, é preciso saber **quando** ele aparece. O Java separa falhas em duas grandes categorias, e a diferença muda completamente o que você faz.' },
    { t: 'table', headers: ['', 'Erro de compilação', 'Exceção (erro de execução)'], rows: [
      ['Quando aparece', 'Antes de o programa rodar, na hora do `javac`', 'Durante a execução, com o `java`'],
      ['Quem acusa', 'O compilador, apontando linha e causa', 'A JVM, lançando um objeto de exceção'],
      ['Exemplo típico', 'Chamar método sem `static`, esquecer `;`, tipo incompatível', 'Dividir por zero, índice inválido, texto onde se esperava número'],
      ['Como resolver', 'Corrigir o código-fonte e recompilar', 'Tratar com `try`/`catch` ou corrigir a lógica que provocou o erro'],
    ] },
    { t: 'p', text: 'Um erro de compilação **impede o programa de existir**: o `.class` nem é gerado, então não há o que tratar em tempo de execução — o conserto é sempre no código. Já a exceção nasce de uma situação que o compilador não consegue prever (o valor que o usuário digita, o estado do arquivo, o número que divide). Ela acontece em uma execução específica, com dados específicos — e é por isso que merece tratamento no próprio programa.' },
    { t: 'p', text: 'Você já viu exceções sem saber o nome: ao rodar um programa com entrada não numérica, a falha na linha do `nextInt` era uma exceção; o índice inválido em um array, mencionado na aula de matrizes, também. Agora vamos nomear esses eventos e aprender a reagir a eles.' },

    { t: 'h2', text: 'O que acontece quando algo falha em execução' },
    { t: 'p', text: 'Veja um programa correto que divide dois números. Ele compila sem problemas — mas com divisor zero, a realidade o alcança.' },
    { t: 'code', lang: 'java', caption: 'Divisao.java', code: `import java.util.Scanner;

class Divisao {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        System.out.print("Dividendo: ");
        double a = teclado.nextDouble();
        System.out.print("Divisor: ");
        double b = teclado.nextDouble();

        double resultado = a / b;
        System.out.println("Resultado: " + resultado);
        teclado.close();
    }
}` },
    { t: 'p', text: 'Se o usuário digitar `0` no divisor, a linha `double resultado = a / b;` lança uma **`ArithmeticException`** com a mensagem `/ by zero`. Na hora, o Java interrompe o `main` naquela linha exata: a impressão de `Resultado` **não acontece** e nem `teclado.close()` é alcançado. O programa termina com uma mensagem parecida com esta no terminal:' },
    { t: 'code', lang: 'plaintext', caption: 'Saída de exemplo (stack trace)', code: `Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Divisao.main(Divisao.java:11)` },
    { t: 'p', text: 'Esse bloco é o **stack trace** (rastro de pilha) e vale decodificar: a primeira linha diz **qual** exceção (`java.lang.ArithmeticException`) e a **mensagem** (`/ by zero`); as linhas seguintes dizem **onde** ela subiu, de dentro para fora — `Divisao.main(Divisao.java:11)` significa que o problema está na linha 11 do arquivo `Divisao.java`, dentro do método `main`. Ao depurar, é essa primeira linha que você lê primeiro: **nome da exceção + mensagem**. A pilha completa só ganha sentido em programas com muitos métodos encadeados — e mesmo aí, a linha do seu código é a que importa.' },
    { t: 'note', kind: 'info', title: 'Exceção é um objeto', text: 'A exceção é um objeto criado na hora da falha, com tipo, mensagem e rastro de chamadas. Por ora basta tratá-la como "um evento de erro identificado". A hierarquia completa (`Throwable`, `Exception`, personalizadas) é o tema da aula 6 do módulo 3 — aqui, apenas o essencial para usar `try` e `catch`.' },

    { t: 'h2', text: 'Exceções comuns no dia a dia' },
    { t: 'p', text: 'Você não precisa decorar todas: conhecer as cinco abaixo resolve a grande maioria dos casos do primeiro módulo.' },
    { t: 'table', headers: ['Exceção', 'Quando ocorre', 'Código que provoca'], rows: [
      ['`ArithmeticException`', 'Operação aritmética inválida, como divisão inteira por zero', '`int r = 10 / 0;`'],
      ['`NumberFormatException`', 'Conversão de texto para número com conteúdo inválido', '`Integer.parseInt("abc")`'],
      ['`ArrayIndexOutOfBoundsException`', 'Índice fora do intervalo do array', '`notas[10]` em array de 5 posições'],
      ['`InputMismatchException`', '`Scanner` recebe um tipo diferente do pedido', '`teclado.nextInt()` com letras digitadas'],
      ['`NullPointerException`', 'Uso de uma referência que não aponta para nada', 'variável de objeto nunca preenchida (módulo 2)'],
    ] },
    { t: 'p', text: 'Note a relação com o que você já viu: `NumberFormatException` é a exceção de `Integer.parseInt` e `Double.parseDouble`, as ferramentas de conversão de texto; `ArrayIndexOutOfBoundsException` é a que aparece quando o laço usa `<=` em vez de `<` com arrays. **Cada erro clássico de iniciante tem um nome próprio** — e esse nome é exatamente o que aparece no stack trace.' },

    { t: 'h2', text: 'Protegendo o código com `try` e `catch`' },
    { t: 'p', text: 'A estrutura é simples: coloque o trecho de risco dentro de `try` e o plano B dentro de `catch (TipoDaExcecao e)`. Se nada der errado, o `catch` é ignorado; se der, o Java pula direto para ele **sem executar o restante do `try`**.' },
    { t: 'code', lang: 'java', caption: 'Tratando.java', code: `import java.util.Scanner;

class Tratando {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        System.out.print("Digite um numero inteiro: ");
        String texto = teclado.nextLine();

        try {
            int valor = Integer.parseInt(texto);
            System.out.println("Dobro: " + (valor * 2));
        } catch (NumberFormatException e) {
            System.out.println("Entrada invalida: use apenas digitos, como 42.");
        }

        System.out.println("Programa segue com o fluxo normal.");
        teclado.close();
    }
}` },
    { t: 'p', text: 'Percorra os dois cenários. Com `texto = "42"`, `Integer.parseInt(texto)` converte para `42`, a linha do dobro imprime `Dobro: 84` e o `catch` é **pulado** — depois, `Programa segue com o fluxo normal.` é impresso. Com `texto = "abc"`, a conversão lança `NumberFormatException` na linha do `parseInt`; o restante do `try` (o `println` do dobro) **não executa**, o Java procura um `catch` compatível na sequência, encontra o de `NumberFormatException` e imprime `Entrada invalida: use apenas digitos, como 42.` — e então o fluxo segue normalmente na linha seguinte ao bloco completo.' },
    { t: 'p', text: 'A variável `e` entre parênteses é a própria exceção capturada: `e.getMessage()` devolve o detalhe técnico (`For input string: "abc"`), útil em log do desenvolvedor. E o tipo entre parênteses **precisa corresponder** ao lançado: se você escrevesse `catch (ArithmeticException e)` neste programa, a `NumberFormatException` não seria capturada por ele, o programa não teria outro tratador e continuaria morrendo com o stack trace. Capturar o tipo errado é o mesmo que não capturar.' },
    { t: 'note', kind: 'warn', title: 'O `catch` errado engana', text: 'Um `catch` de tipo diferente do lançado **não gera erro de compilação** — ele simplesmente nunca executa. Se o seu programa continua caindo no stack trace mesmo com `try`/`catch` no lugar, confira no texto da exceção qual é o tipo real e ajuste o `catch`.' },

    { t: 'h2', text: 'Vários tratamentos para riscos diferentes' },
    { t: 'p', text: 'Um mesmo bloco `try` pode ter vários `catch`, um para cada tipo de falha possível. Cada risco recebe a reação adequada — e **apenas um** `catch` executa por exceção, o que corresponde ao tipo lançado.' },
    { t: 'code', lang: 'java', caption: 'VariosCatch.java', code: `import java.util.Scanner;

class VariosCatch {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        System.out.print("Dividendo: ");
        String t1 = teclado.nextLine();
        System.out.print("Divisor: ");
        String t2 = teclado.nextLine();

        try {
            int a = Integer.parseInt(t1);
            int b = Integer.parseInt(t2);
            int resultado = a / b;
            System.out.println("Resultado: " + resultado);
        } catch (NumberFormatException e) {
            System.out.println("Erro: digite apenas numeros inteiros.");
        } catch (ArithmeticException e) {
            System.out.println("Erro: divisao por zero nao e permitida.");
        }

        System.out.println("Obrigado por usar a calculadora.");
        teclado.close();
    }
}` },
    { t: 'p', text: 'O `try` concentra as três operações de risco: as duas conversões (`Integer.parseInt`) e a divisão (`a / b`). Entrada `abc` no dividendo dispara `NumberFormatException` e imprime o primeiro aviso; entradas válidas com divisor `0` disparam `ArithmeticException` e imprimem o segundo. Nos dois casos — e também quando tudo dá certo — a última linha `Obrigado por usar a calculadora.` é executada, porque ela está **fora** do try/catch. Essa é a prova de que o programa se recuperou em vez de morrer.' },
    { t: 'p', text: 'Ao capturar exceções relacionadas (uma herda da outra), a ordem dos `catch` importa: o **mais específico vem primeiro**. Neste exemplo os tipos são irmãos e a ordem não altera o comportamento, mas manter o hábito de ordenar do mais específico para o mais geral evita avisos do compilador e surpresas nos módulos seguintes.' },

    { t: 'h2', text: 'Recuperando: pedindo de novo até acertar' },
    { t: 'p', text: 'A aplicação mais valiosa desta aula é combinar `try`/`catch` com o laço `while` da aula 10: **repetir a leitura enquanto o dado não for válido**. É assim que qualquer formulário sério trata entrada de usuário.' },
    { t: 'code', lang: 'java', caption: 'EntradaSegura.java', code: `import java.util.Scanner;

class EntradaSegura {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        int valor = 0;
        boolean valido = false;

        while (!valido) {
            System.out.print("Digite um numero inteiro: ");
            String texto = teclado.nextLine();
            try {
                valor = Integer.parseInt(texto);
                valido = true;
            } catch (NumberFormatException e) {
                System.out.println("Valor invalido. Tente novamente.");
            }
        }

        System.out.println("Numero aceito: " + valor);
        teclado.close();
    }
}` },
    { t: 'p', text: 'A engenharia da recuperação: `valor` e `valido` são declarados **antes** do laço, para que sejam visíveis depois dele; a condição `while (!valido)` mantém o laço aberto enquanto a flag não confirmar sucesso. Dentro, o `try` tenta a conversão: em caso de sucesso, `valor` recebe o número e `valido = true` encerra o laço na próxima checagem; em caso de falha, o `catch` avisa e **`valido` continua `false`**, fazendo o programa pedir de novo. Repare que nada aqui mata o programa: o usuário pode errar quantas vezes quiser.' },
    { t: 'p', text: 'Compare com a validação da aula 10, que testava intervalos com `if` (`nota < 0 || nota > 10`). As duas técnicas se complementam: **conversão de formato** (o texto vira número?) é papel do `try/catch`; **regra de negócio** (o número está no intervalo?) é papel do `if`. Misturar as duas em um só lugar deixa o código confuso.' },

    { t: 'h2', text: 'O que não fazer (e o que ainda virá)' },
    { t: 'ul', items: [
      '**Catch vazio** — `catch (Exception e) {}` engole o erro em silêncio: o programa segue como se nada houvesse, e o bug aparece depois, longe da origem.',
      '**Capturar tudo para "não travar"** — tratar `Exception` genérica em tudo esconde a causa real e impede a mensagem certa de chegar ao usuário.',
      '**Usar exceção para controle de fluxo normal** — se a falha é esperada e frequente (como um número fora do intervalo), um `if` é mais claro e mais barato que `try`.',
      '**Mostrar stack trace para o usuário final** — o rastro técnico serve ao desenvolvedor; o usuário recebe uma mensagem amigável e acionável.',
      '**Escrever `try` gigante** — quanto maior o bloco, mais difícil saber qual linha falhou; proteja apenas as linhas de risco.',
    ] },
    { t: 'p', text: 'O que ficou de fora desta introdução, por vir no módulo 3: o bloco `finally` (executa sempre, com ou sem exceção), o `throw` para lançar exceções propositalmente, o `throws` na assinatura de métodos, exceções personalizadas do seu domínio e a hierarquia completa. Você tem agora a base para usar `try`/`catch` com segurança nos próximos projetos — inclusive no projeto do módulo 1, que fecha este módulo.' },
    { t: 'quote', text: 'Tratar um erro é decidir, de antemão, o que o programa faz quando a realidade foge do previsto.' },
  ],

  commonMistakes: [
    { title: 'Capturar um tipo diferente do que é lançado', text: 'Se `teclado.nextInt()` recebe letras, a exceção é `InputMismatchException` — capturar `NumberFormatException` ali **não intercepta nada** e o programa morre com o stack trace. O tipo do `catch` precisa corresponder ao da falha real; leia a primeira linha do stack trace, copie o nome da exceção e ajuste. Teste sempre com a entrada que provoca o erro, não apenas com o caminho feliz.' },
    { title: 'Deixar o `catch` vazio', text: 'Escrever `catch (Exception e) {}` faz o erro desaparecer da tela, mas não resolve: variáveis ficam sem valor, contas não são feitas e o problema emerge depois, em outra linha, com outra causa aparente. Ao mínimo, registre a falha (`System.out.println("Falha ao converter: " + e.getMessage());`) e decida o que fazer — repetir, pedir outro dado ou encerrar com mensagem clara.' },
    { title: 'Achar que o restante do `try` continua após a exceção', text: 'Quando a exceção é lançada, **as linhas seguintes do `try` são abandonadas na hora**. Se `int x = Integer.parseInt(t);` falha, qualquer cálculo posterior com `x` não roda — e `x`, declarado dentro do `try`, nem existe fora dele para você usar no `catch`. Coloque dentro do `try` apenas o que depende da operação de risco, e prepare o estado de recuperação antes.' },
    { title: 'Usar `try`/`catch` no lugar da validação simples', text: 'Para verificar `if (nota < 0 || nota > 10)`, um `try` é desnecessário: a condição não lança exceção nenhuma. Reservar `try` para falhas de conversão, divisão, arquivo ou rede evita que o tratamento de exceção se torne o fluxo normal do programa — código assim fica lento de ler e difícil de manter.' },
    { title: 'Esquecer que a exceção pode nascer antes do `try`', text: 'Se a leitura com `teclado.nextInt()` está **fora** do `try` e o usuário digitar letras, a exceção escapa e o programa morre, por mais `catch` que exista abaixo. Proteja a linha exata que pode falhar: leia com `nextLine()` e converta **dentro** do bloco `try`, de modo que a falha aconteça onde há tratador.' },
  ],

  bestPractices: [
    { title: 'Capture apenas o que você sabe tratar', text: 'Cada `catch` deve ter um plano concreto: pedir de novo, imprimir aviso, usar um valor padrão. Se não existe reação possível para uma exceção em determinada camada, deixe-a subir e trate mais acima — nos módulos 4 e 6 isso será feito de forma global na API.' },
    { title: 'Mensagem boa para o usuário, detalhe para o log', text: 'O usuário vê "Erro: divisao por zero nao e permitida."; o desenvolvedor vê `e.getMessage()` com o detalhe técnico. Essa separação evita expor estrutura interna ao usuário e, ao mesmo tempo, preserva a informação necessária para corrigir o bug.' },
    { title: 'Deixe o `try` o menor possível', text: 'Envolva somente as linhas de risco — conversões, divisão, acesso a índice. Um `try` que cobre o `main` inteiro impede saber qual linha falhou e faz o `catch` capturar problemas que você não pretende tratar ali.' },
    { title: 'Valide regra de negócio com `if`, falha técnica com `try`', text: 'Formato do dado (texto vira número? divisor pode ser zero?) é papel da exceção; intervalos, faixas e limites de negócio são papel das condições. Manter essa fronteira separada deixa cada bloco com uma única pergunta e simplifica a evolução para as exceções personalizadas do módulo 3.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Erro de compilação impede o programa de rodar; **exceção** é uma falha em tempo de execução que o compilador não consegue prever.',
      'O stack trace revela **tipo da exceção, mensagem e linha de origem** — leia a primeira linha primeiro.',
      '`try` protege o trecho de risco; `catch (Tipo e)` recebe a exceção correspondente e executa o plano B.',
      'Se a exceção acontecer, o resto do `try` **não executa**; depois do tratamento, o fluxo segue após o bloco.',
      'Capturar o tipo errado não gera erro de compilação — o programa continua morrendo. Teste com a entrada que falha.',
      'Vários `catch` podem coexistir, um por tipo; apenas o correspondente executa.',
      'Recuperação clássica: `while` + `try`/`catch`, pedindo o dado de novo até a conversão dar certo.',
      'Use `try` para falhas técnicas (conversão, divisão) e `if` para regras de negócio (intervalos).',
    ] },
    { t: 'note', kind: 'tip', title: 'Projeto do módulo', text: 'Você chegou ao fim da base do Java. Agora coloque tudo junto no projeto do módulo 1: o **Sistema de Gerenciamento de Alunos pelo terminal**, com cadastro em arrays, médias com métodos, relatórios com `printf` e entrada blindada com `try`/`catch`.' },
  ],

  exercises: [
    {
      id: 'm1l13e1',
      type: 'mc',
      question: 'Qual exceção é lançada quando o trecho `int[] v = new int[3]; v[5] = 1;` é executado?',
      options: [
        'NumberFormatException',
        'ArithmeticException',
        'ArrayIndexOutOfBoundsException',
        'InputMismatchException',
      ],
      answer: 2,
      explanation: 'O array tem 3 posições (índices 0, 1 e 2) e o código acessa o índice **5**, fora do intervalo — é a definição de `ArrayIndexOutOfBoundsException`. `NumberFormatException` aparece em conversões de texto para número (como `Integer.parseInt("abc")`); `ArithmeticException` está ligada a operações inválidas, como divisão por zero; e `InputMismatchException` ocorre quando o `Scanner` recebe um tipo diferente do pedido (letras em `nextInt()`).',
    },
    {
      id: 'm1l13e2',
      type: 'code',
      question: 'Suponha que a variável `texto` vale "12a". Qual é a saída do programa?',
      code: 'try {\n    int n = Integer.parseInt(texto);\n    System.out.println("Valor: " + n);\n} catch (NumberFormatException e) {\n    System.out.println("Conversao falhou");\n}\nSystem.out.println("Fim");',
      lang: 'java',
      options: [
        'Conversao falhou\\nFim',
        'Valor: 12\\nFim',
        'Conversao falhou',
        'Erro de compilacao: texto nao e numero',
      ],
      answer: 0,
      explanation: '`Integer.parseInt("12a")` não consegue converter o texto e lança `NumberFormatException`. Nesse momento, a linha do `println("Valor: ...")` é **abandonada** (não imprime `Valor: 12`), o controle salta para o `catch` correspondente, que imprime `Conversao falhou`. Em seguida, a execução segue após o bloco e imprime `Fim`. Não há erro de compilação: o problema só existe em execução, com esse valor específico. A alternativa com `Valor: 12` só ocorreria com texto como `"12"`.',
    },
    {
      id: 'm1l13e3',
      type: 'tf',
      question: 'Quando uma exceção é lançada dentro de um bloco `try`, as linhas seguintes do mesmo `try` continuam sendo executadas normalmente.',
      answer: false,
      explanation: 'A exceção **interrompe o bloco `try` na hora**: as linhas posteriores à falha não executam. O fluxo só é retomado quando um `catch` compatível trata a exceção — e a continuação acontece **depois** do conjunto try/catch. Por isso é comum ver `Valor não aceito` sem o programa ter chegado ao cálculo seguinte: a exceção derrubou o resto do bloco antes.',
    },
    {
      id: 'm1l13e4',
      type: 'short',
      question: 'Explique, em uma ou duas frases, qual é a diferença entre um erro de compilação e uma exceção em tempo de execução.',
      keywords: [
        ['compilacao', 'compilador', 'javac', 'antes de rodar', 'impede de rodar'],
        ['execucao', 'runtime', 'durante', 'tempo de execucao', 'lanca', 'excecao'],
      ],
      answerText: 'O erro de compilação é detectado pelo compilador antes de o programa rodar e impede a geração do bytecode, exigindo correção no código-fonte. A exceção ocorre durante a execução, quando uma situação inesperada como divisão por zero ou entrada inválida é lançada, e pode ser tratada com try/catch para o programa continuar.',
      explanation: 'A separação essencial é **quando** e **quem detecta**: o compilador só enxerga o que é estático (sintaxe, tipos), enquanto a exceção nasce de dados e estados que só existem rodando. Por isso a correção é diferente — uma exige recompilar, a exige um plano de recuperação no programa.',
    },
    {
      id: 'm1l13e5',
      type: 'code',
      question: 'O usuário digita 20 no dividendo e 0 no divisor. Qual é a saída?',
      code: 'try {\n    int a = Integer.parseInt(t1);\n    int b = Integer.parseInt(t2);\n    System.out.println("Resultado: " + (a / b));\n} catch (NumberFormatException e) {\n    System.out.println("Entrada invalida");\n} catch (ArithmeticException e) {\n    System.out.println("Divisao por zero");\n}\nSystem.out.println("Fim");',
      lang: 'java',
      options: [
        'Divisao por zero\\nFim',
        'Resultado: 0\\nFim',
        'Entrada invalida\\nFim',
        'O programa falha com stack trace, sem imprimir Fim',
      ],
      answer: 0,
      explanation: 'As conversões funcionam ("20" e "0" são válidos), então nenhum `NumberFormatException` ocorre. A expressão `a / b` com `b = 0` em **divisão inteira** lança `ArithmeticException`: a impressão de `Resultado` é abandonada, o segundo `catch` executa e imprime `Divisao por zero`. Depois, o fluxo segue fora do bloco e imprime `Fim`. A opção "Resultado: 0" é errada porque não existe divisão por zero silenciosa em Java — e "Entrada invalida" só apareceria com texto não numérico.',
    },
  ],

  challenge: {
    id: 'm1l13c1',
    title: 'Calculadora à prova de entrada inválida',
    fileName: 'Calculadora.java',
    prompt: 'Escreva `Calculadora.java`: leia dois valores e um operador (`+`, `-`, `*` ou `/`) usando `Scanner` com `nextLine()`, converta os dois valores com `Integer.parseInt` **dentro** de um bloco `try` e realize a operação escolhida com `switch` (ou `if/else`). Trate `NumberFormatException` imprimindo `Erro: informe apenas numeros inteiros.` e trate `ArithmeticException` imprimindo `Erro: divisao por zero.`. Operador desconhecido deve imprimir `Operador desconhecido.`. Em qualquer situação — sucesso ou falha — o programa termina imprimindo a linha `Calculadora encerrada.`, sem nunca exibir stack trace para o usuário.',
    starterCode: 'import java.util.Scanner;\n\nclass Calculadora {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n\n        System.out.print("Primeiro valor: ");\n        String t1 = teclado.nextLine();\n        System.out.print("Operador (+, -, *, /): ");\n        String operador = teclado.nextLine();\n        System.out.print("Segundo valor: ");\n        String t2 = teclado.nextLine();\n\n        // converta e calcule dentro de try, com catch para\n        // NumberFormatException e ArithmeticException\n\n        System.out.println("Calculadora encerrada.");\n        teclado.close();\n    }\n}\n',
    criteria: [
      'As duas conversões `Integer.parseInt` e a operação aritmética estão dentro do mesmo bloco `try`',
      'Existe um `catch (NumberFormatException)` com a mensagem `Erro: informe apenas numeros inteiros.`',
      'Existe um `catch (ArithmeticException)` com a mensagem `Erro: divisao por zero.`',
      'O operador é direcionado por `switch` (ou `if/else`) com os quatro casos e a mensagem `Operador desconhecido.`',
      'A divisão é feita com valores inteiros, de modo que divisor zero lança exceção e é tratada',
      'A linha `Calculadora encerrada.` fica fora do try/catch e é impressa em todos os caminhos',
    ],
    modelSolution: [
      { t: 'p', text: 'A referência abaixo coloca **tudo o que pode falhar** dentro do `try`: as duas conversões e a divisão. Repare que a leitura com `nextLine()` fica fora — ela raramente falha, e manter o `try` pequeno deixa claro onde estão os riscos reais.' },
      { t: 'code', lang: 'java', caption: 'Calculadora.java', code: `import java.util.Scanner;

class Calculadora {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        System.out.print("Primeiro valor: ");
        String t1 = teclado.nextLine();
        System.out.print("Operador (+, -, *, /): ");
        String operador = teclado.nextLine();
        System.out.print("Segundo valor: ");
        String t2 = teclado.nextLine();

        try {
            // Falha aqui se t1 ou t2 nao forem numeros inteiros
            int a = Integer.parseInt(t1);
            int b = Integer.parseInt(t2);

            switch (operador) {
                case "+":
                    System.out.println("Resultado: " + (a + b));
                    break;
                case "-":
                    System.out.println("Resultado: " + (a - b));
                    break;
                case "*":
                    System.out.println("Resultado: " + (a * b));
                    break;
                case "/":
                    // Falha aqui se b for zero: divisao inteira por zero
                    System.out.println("Resultado: " + (a / b));
                    break;
                default:
                    System.out.println("Operador desconhecido.");
            }
        } catch (NumberFormatException e) {
            // Entradas como "abc" ou "10.5" caem aqui
            System.out.println("Erro: informe apenas numeros inteiros.");
        } catch (ArithmeticException e) {
            // Divisao inteira com divisor zero cai aqui
            System.out.println("Erro: divisao por zero.");
        }

        // Fora do try/catch: executa sempre, sucesso ou falha
        System.out.println("Calculadora encerrada.");
        teclado.close();
    }
}` },
      { t: 'p', text: 'Bateria de testes: `10`, `+`, `5` → `Resultado: 15`; `10`, `/`, `0` → `Erro: divisao por zero.`; `abc`, `+`, `5` → `Erro: informe apenas numeros inteiros.`; `10`, `%`, `5` → `Operador desconhecido.`; e em **todos** os casos, a última linha é `Calculadora encerrada.` — se em algum deles aparece um stack trace, existe um caminho de falha fora do `try` (confira se as conversões e a divisão estão dentro dele).' },
      { t: 'p', text: 'Uma observação de precisão: a divisão por zero só é exceção porque os valores são `int`. Com `double`, `10.0 / 0.0` não lança exceção — resulta em `Infinity`, valor especial do ponto flutuante. É um bom exemplo de por que conhecer os tipos muda o comportamento do programa.' },
    ],
  },
}
