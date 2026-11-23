export default {
  id: 'm1l09',
  moduleId: 'm1',
  number: 9,
  title: 'Repetição com laço for',
  durationMinutes: 22,

  objectives: [
    'Explicar a estrutura do laço `for` e a função de cada uma de suas três partes',
    'Escrever laços que contam de forma crescente, decrescente e com passo personalizado',
    'Combinar dois laços aninhados para gerar tabuadas e tabelas',
    'Aplicar `break` e `continue` para controlar a execução de um laço',
    'Acumular valores de várias leituras usando um laço com `Scanner`',
  ],

  prerequisites: [
    'Ter concluído as aulas sobre variáveis, tipos primitivos e operadores aritméticos',
    'Saber usar `if` e `else` para tomar decisões dentro de um programa',
    'Conseguir compilar e rodar um programa com `javac` e `java` pelo terminal',
    'Ter praticado a leitura de entrada com `Scanner` e a impressão com `System.out.println`',
  ],

  intro: [
    { t: 'p', text: 'Imagine que seu programa precisa imprimir os números de 1 a 1000. Escrever 1000 linhas de `System.out.println` é inviável: qualquer correção obrigaria você a editar centenas de linhas, uma por uma. Estruturas de repetição existem exatamente para esse caso — **descrever o padrão uma vez e deixar o computador executar quantas vezes forem necessárias**.' },
    { t: 'p', text: 'O laço `for` é a estrutura de repetição mais usada do Java quando você **sabe de antemão quantas voltas serão dadas**: contar de 1 a 10, percorrer as linhas de uma tabela, somar uma sequência de notas. Nesta aula você vai dissecar a sintaxe `for (inicio; condicao; passo)`, aprender a contar para trás e com saltos, combinar dois laços (o famoso caso da tabuada), controlar a execução com `break` e `continue` e fechar com um caso realista: a média de cinco notas lidas do teclado.' },
    { t: 'p', text: 'Uma analogia para fixar: pense em um robô de cozinha programado para bater massa. Ele precisa saber **onde começar** (contagem em 1), **enquanto não chegar a 100 voltas continua batendo** (condição) e **a cada volta soma uma batida** (passo). Troque "batidas" por "voltas do laço" e você tem a estrutura completa do `for`.' },
    { t: 'note', kind: 'tip', title: 'Como estudar esta aula', text: 'Digite cada exemplo na sua máquina em vez de apenas ler, e antes de rodar **preveja a saída no papel**. Depois altere os limites (`5` virando `3`, `i++` virando `i += 2`) e observe o que muda. Essa troca entre previsão e resultado é o que transforma sintaxe em lógica.' },
  ],

  theory: [
    { t: 'h2', text: 'O problema que o `for` resolve' },
    { t: 'p', text: 'Comece por uma versão ingênua do problema: imprimir cinco mensagens de aula. Funciona, mas repare no que há de ruim nessa abordagem.' },
    { t: 'code', lang: 'java', caption: 'RepeticaoManual.java', code: `class RepeticaoManual {
    public static void main(String[] args) {
        System.out.println("Aula 1");
        System.out.println("Aula 2");
        System.out.println("Aula 3");
        System.out.println("Aula 4");
        System.out.println("Aula 5");
    }
}` },
    { t: 'p', text: 'As cinco linhas de `System.out.println` são **o mesmo comando com um número diferente**. Se a solicitação virar "imprimir as 200 aulas", o arquivo cresce para 200 linhas quase idênticas; se o texto mudar para "Conteudo", são 200 edições. A informação realmente importante está em três perguntas: **de onde começa, até quando continua e como avança**. O laço `for` guarda exatamente essas três respostas em um lugar só.' },
    { t: 'p', text: 'A estrutura geral é `for (inicio; condicao; passo) { corpo }`. O que está entre os parênteses controla a repetição; o que está entre as chaves é o conjunto de instruções que se repete. Vamos ver o programa acima reescrito com laço.' },

    { t: 'h2', text: 'Anatomia do laço `for`' },
    { t: 'code', lang: 'java', caption: 'Contador.java', code: `class Contador {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("i vale " + i);
        }
        System.out.println("Fim do laco");
    }
}` },
    { t: 'p', text: 'Na linha `for (int i = 1; i <= 5; i++)` cabem as três partes, separadas por **ponto e vírgula**. A primeira, `int i = 1`, executa **uma única vez**, antes de tudo: é a inicialização da variável de controle `i`. A segunda, `i <= 5`, é a condição, testada **antes de cada volta**: enquanto for verdadeira, o corpo executa; quando ficar falsa, o laço termina e o programa segue para a linha seguinte às chaves. A terceira, `i++`, é o passo, executado **ao final de cada volta**, depois do corpo — é ele que faz a condição mudar ao longo do tempo.' },
    { t: 'p', text: 'Assim, a ordem de execução é: inicializar `i` com 1 → testar `i <= 5` (verdadeiro) → imprimir `i vale 1` → executar `i++` (agora `i` é 2) → testar de novo → ... → quando `i` chega a 6, `6 <= 5` é falso e o laço encerra. O corpo executa **exatamente 5 vezes**, imprimindo `i vale 1` até `i vale 5`. Note também que a linha `System.out.println("Fim do laco")` roda uma vez só, depois do laço — ela não faz parte do corpo.' },
    { t: 'table', headers: ['Parte do `for`', 'Quando executa', 'Exemplo'], rows: [
      ['Inicialização', 'Uma única vez, antes do primeiro teste', '`int i = 1`'],
      ['Condição', 'Antes de cada volta; se for falsa, o laço termina', '`i <= 5`'],
      ['Passo', 'Ao final de cada volta, depois do corpo', '`i++`'],
      ['Corpo', 'Cada vez que a condição é verdadeira', '`System.out.println(...)`'],
    ] },
    { t: 'p', text: 'Repare que a variável `i` é declarada **dentro** do `for`. Isso significa que ela só existe entre as chaves do laço: tentar imprimir `i` depois do fechamento das chaves gera erro de compilação `cannot find symbol`. Se você precisar do valor final de `i` fora do laço, declare a variável antes (`int i;`) e use `for (i = 1; i <= 5; i++)` — mas na maioria dos casos o valor interessa apenas dentro do corpo.' },
    { t: 'note', kind: 'info', title: 'Contagem começa em 0 ou em 1?', text: 'Os dois casos aparecem o tempo todo. **Comece em 1** quando estiver contando ocorrências ("1ª nota", "3º aluno") e **comece em 0** quando o número representar uma posição ou índice — essa convenção volta com força total na aula de arrays, onde as posições começam em zero.' },

    { t: 'h2', text: 'Contagem para trás e passos personalizados' },
    { t: 'p', text: 'O `for` não obriga a contar para frente. Basta combinar uma inicialização maior, uma condição compatível com a direção e um passo negativo. Abaixo, dois casos: a contagem regressiva de um semáforo e a soma dos números pares de 2 a 20.' },
    { t: 'code', lang: 'java', caption: 'Passos.java', code: `class Passos {
    public static void main(String[] args) {
        for (int i = 5; i >= 1; i--) {
            System.out.println("Contagem regressiva: " + i);
        }
        System.out.println("Placar!");

        int soma = 0;
        for (int i = 2; i <= 20; i += 2) {
            soma = soma + i;
        }
        System.out.println("Soma dos pares de 2 a 20: " + soma);
    }
}` },
    { t: 'p', text: 'No primeiro laço, `int i = 5` define o ponto de partida, `i >= 1` é a condição compatível com a direção descendente e `i--` diminui uma unidade por volta — a saída é 5, 4, 3, 2, 1 e depois `Placar!`. Se você trocar a condição para `i <= 1` mantendo o início em 5, o laço **não executa nem uma vez**: `5 <= 1` já é falso no primeiro teste. Essa inversão é um dos erros mais comuns desta aula.' },
    { t: 'p', text: 'No segundo laço, `i += 2` é um passo personalizado: em vez de pular de 1 em 1, pula de 2 em 2, percorrendo apenas os pares. A variável `soma` é um **acumulador**: ela é declarada e zerada **antes** do laço e recebe `soma = soma + i` a cada volta. O resultado é 2 + 4 + 6 + ... + 20 = **110**. Repare em um detalhe decisivo: se `int soma = 0;` estivesse dentro das chaves do `for`, ele seria recriado e zerado em toda volta, e o programa imprimiria apenas o último valor (20).' },
    { t: 'p', text: 'O passo pode ser qualquer expressão que altere a variável de controle: `i += 3` pula de 3 em 3, `i -= 1` também funciona no sentido decrescente. Cuidado com `i += 0`: o valor nunca muda, a condição nunca fica falsa e o laço **nunca termina** — veremos essa armadilha na aula seguinte, quando o `while` entrar em cena.' },

    { t: 'h2', text: 'Laços aninhados: tabuada e tabelas' },
    { t: 'p', text: 'Quando um laço está dentro de outro, dizemos que estão **aninhados**. A regra de leitura é simples e vale para sempre: **para cada volta do laço externo, o laço interno percorre o seu ciclo inteiro**. Isso permite montar linhas e colunas de uma tabela — o caso clássico é a tabuada.' },
    { t: 'code', lang: 'java', caption: 'Tabuada.java', code: `class Tabuada {
    public static void main(String[] args) {
        for (int n = 1; n <= 3; n++) {
            for (int t = 1; t <= 10; t++) {
                System.out.println(n + " x " + t + " = " + (n * t));
            }
            System.out.println("---");
        }
    }
}` },
    { t: 'p', text: 'O laço externo (`n`) percorre 1, 2 e 3. Para cada `n`, o laço interno (`t`) percorre 1 a 10 inteiro, imprimindo as dez multiplicações; só então a linha `System.out.println("---")` separa os blocos e `n` avança para o próximo valor. O total de linhas de multiplicação é 3 × 10 = **30**, além dos três separadores. Note que `t` é **reiniciada em 1 a cada volta de `n`** — a inicialização do laço interno acontece de novo sempre que ele é alcançado.' },
    { t: 'p', text: 'Os parênteses em `(n * t)` explicitam que a multiplicação acontece antes da concatenação de textos. O Java já resolveria assim por causa da precedência de operadores, mas embrulhar a expressão aritmética deixa a intenção óbvia para quem lê o código — e evita dúvidas quando a expressão crescer.' },
    { t: 'p', text: 'Os nomes `n` e `t` foram escolhidos de propósito: em laços aninhados, usar `i` nos dois níveis cria confusão quase garantida. Dê a cada contador um nome que explique o papel dele naquele contexto.' },

    { t: 'h2', text: '`break` e `continue`: controlando o laço' },
    { t: 'p', text: 'Até aqui o laço terminava apenas quando a condição ficava falsa. Duas palavras-chave permitem interferir no meio da execução: **`break` encerra o laço imediatamente** e **`continue` pula direto para a próxima volta**, descartando o restante do corpo da volta atual.' },
    { t: 'code', lang: 'java', caption: 'BreakContinue.java', code: `class BreakContinue {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 7) {
                break;
            }
            if (i % 2 != 0) {
                continue;
            }
            System.out.println("Par encontrado: " + i);
        }
        System.out.println("Fim da busca");
    }
}` },
    { t: 'p', text: 'Percorra o código mentalmente: quando `i` é 1, 3, 5 (impares), a condição `i % 2 != 0` é verdadeira e `continue` faz o laço pular o `println`, indo direto para `i++`. Quando `i` é 2, 4 ou 6, a linha `Par encontrado: ...` é impressa. Ao chegar em 7, `break` **sai do laço por completo** — as iterações 8, 9 e 10 nunca acontecem — e a execução retoma na linha `System.out.println("Fim da busca")`, que imprime uma única vez. A saída final é: `Par encontrado: 2`, `Par encontrado: 4`, `Par encontrado: 6`, `Fim da busca`.' },
    { t: 'p', text: 'Dois detalhes de comportamento: o `break` afeta apenas o laço **mais interno** em que está escrito (com laços aninhados, ele não encerra os externos), e tanto `break` quanto `continue` dependem de uma condição com `if` — sozinhos, eles não fazem sentido dentro do corpo.' },
    { t: 'note', kind: 'warn', title: 'Use com moderação', text: '`break` e `continue` são ferramentas legítimas, mas abusar deles deixa o fluxo do laço difícil de seguir. Antes de usar, pergunte: a condição normal do `for` não resolveria? Muitas vezes um `if` bem colocado dentro do corpo evita o `continue` inteiro.' },

    { t: 'h2', text: 'Caso realista: média de notas com acumulador' },
    { t: 'p', text: 'Fechemos com um problema de verdade: ler cinco notas e imprimir a média. O padrão é o mesmo do acumulador da seção anterior — **declarar o total antes do laço, somar dentro, calcular o resultado depois**.' },
    { t: 'p', text: 'Se você ainda não mexeu com entrada de dados, estas três linhas resolvem: `import java.util.Scanner;` avisa o compilador de onde vem a classe; `Scanner teclado = new Scanner(System.in);` cria um leitor de entradas do teclado; e `teclado.nextDouble()` lê um número decimal a cada chamada.' },
    { t: 'code', lang: 'java', caption: 'MediaNotas.java', code: `import java.util.Scanner;

class MediaNotas {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        double soma = 0;

        for (int i = 1; i <= 5; i++) {
            System.out.print("Nota " + i + ": ");
            double nota = teclado.nextDouble();
            soma = soma + nota;
        }

        double media = soma / 5;
        System.out.println("Media: " + media);
        teclado.close();
    }
}` },
    { t: 'p', text: 'A linha `double soma = 0;` vem **antes** do `for`, porque o acumulador precisa sobreviver às voltas. Dentro do corpo, `System.out.print` (sem o `l` final) mantém o cursor na mesma linha para digitar a nota, `double nota = teclado.nextDouble()` guarda a leitura e `soma = soma + nota` adiciona ao total. Como `nota` é declarada dentro do laço, ela é descartada a cada volta — é exatamente o que queremos: cada nota é usada ali mesmo. Depois do fechamento das chaves, `double media = soma / 5;` divide a soma acumulada pelo número fixo de notas.' },
    { t: 'p', text: 'O número `5` repetido no `for` e na divisão é um candidato a variável: `int totalNotas = 5;` declarada no início permite mudar o programa de 5 para 30 notas alterando **um único lugar**. Essa é a mesma filosofia do método, que você verá na aula 11.' },
    { t: 'quote', text: 'Um laço `for` bem escrito responde três perguntas de forma inequívoca: onde começa, enquanto o que for verdadeiro e como avança.' },

    { t: 'h2', text: 'Escolhendo o limite certo' },
    { t: 'p', text: 'Antes de escrever qualquer `for`, faça a conta das voltas na cabeça. Com início em `inicio`, fim em `fim` e passo `passo`, o número de execuções do corpo é `(fim - inicio) / passo + 1`, desde que a divisão seja exata. Para `int i = 1; i <= 5; i++` temos (5 - 1) / 1 + 1 = 5 voltas; para `int i = 2; i <= 20; i += 2` temos (20 - 2) / 2 + 1 = 10 voltas.' },
    { t: 'p', text: 'Se o resultado da conta não bater com o esperado, o erro está em uma das três partes: início fora do alvo, condição usando `<` quando o limite deveria estar incluído (ou vice-versa), ou passo incompatível com a direção. Essa verificação rápida economiza minutos de depuração — e evita a pergunta clássica do iniciante: "por que meu laço executou uma vez a menos?".' },
  ],

  commonMistakes: [
    { title: 'Separar as partes do `for` com vírgula ou esquecer o ponto e vírgula', text: 'A sintaxe do Java exige **ponto e vírgula** entre as três partes: `for (int i = 1; i <= 5; i++)`. Escrever `for (int i = 1, i <= 5, i++)` (como em C) ou trocar por dois-pontos não compila. Outra variante do mesmo problema é deixar a terceira parte vazia (`for (int i = 1; i <= 5;)`) e esquecer o `i++` dentro do corpo: o laço nunca termina. Ao ver a mensagem de erro apontando o `for`, confira os separadores antes de qualquer outra coisa.' },
    { title: 'Condição invertida: o laço não executa nem uma vez', text: 'Ao contar para trás, muitos mantêm a condição de contagem crescente. Em `for (int i = 5; i <= 1; i--)` o primeiro teste (`5 <= 1`) já é falso e o corpo nunca roda — o programa não falha, simplesmente **não faz nada**, o que confunde quem esperava uma saída. A regra: o valor inicial precisa satisfazer a condição, e a direção do passo precisa ser a mesma da condição (conta decrescente → use `>=`).' },
    { title: 'Declarar o acumulador dentro do laço', text: 'Se `int soma = 0;` é colocado dentro das chaves do `for`, ele é recriado e zerado a cada volta: no final, `soma` guardará apenas o último valor somado. Acumuladores (soma, contagem, maior valor) sempre são **declarados e inicializados antes do laço**, e usados dentro dele. O mesmo vale para a média: divida a soma depois que o laço terminar, não dentro dele.' },
    { title: 'Usar `=` onde se quer comparar', text: 'Dentro da condição, escrever `for (int i = 0; i = 5; i++)` não compila: `i = 5` é uma atribuição que resulta em `int`, e o Java exige um valor booleano na condição. Comparação de igualdade usa **dois** iguais (`==`). Se aparecer `incompatible types: int cannot be converted to boolean` apontando para o `for`, revise os operadores da condição.' },
    { title: 'Esquecer que o passo acontece depois do corpo', text: 'Em `for (int i = 1; i <= 5; i++)` o corpo vê `i` com o valor daquela volta **antes** do incremento. Quem espera que `i++` rode antes do `println` prevê a saída começando em 2 e erra. Para lembrar a ordem, decore o ciclo: teste → corpo → passo → teste. Quando o corpo contiver `continue`, esse ciclo se mantém: o passo é executado mesmo quando o resto do corpo é pulado.' },
  ],

  bestPractices: [
    { title: 'Nomeie o contador de acordo com o papel dele', text: '`i` é a escolha padrão para índice ou posição genérico. Em laços aninhados ou com significado próprio, prefira `n` e `t` na tabuada, `linha` e `coluna` em tabelas, `nota` em leituras. Dois laços com `i` no mesmo bloco de código são receita para trocar o contador errado na hora de depurar.' },
    { title: 'Confirme o número de voltas antes de rodar', text: 'Calcule mentalmente `(fim - inicio) / passo + 1` e compare com o esperado. Se a conta diz 10 voltas e o programa imprime 9, a condição está excluindo o limite (`<` em vez de `<=`) ou o passo pula o valor final. Essa checagem de 10 segundos substitui minutos de inspeção linha a linha.' },
    { title: 'Isole a lógica de repetição do resto do programa', text: 'O corpo do `for` deve conter apenas o que se repete. Entrada de dados, acumulação e impressão ficam na ordem em que o problema acontece, e o cálculo do resultado (como a média) vem **depois** do laço. Quando o corpo começar a crescer demais, extraia partes para métodos — exatamente o que a aula 11 ensina.' },
    { title: 'Prefira uma condição clara a uma fuga com `break`', text: 'Uma condição de parada legível no próprio `for` faz o laço se explicar sozinho. `break` é bom quando existe um evento pontual de parada (chegou ao fim da busca), mas escondê-lo em meio a muitas condições obriga quem lê a reconstruir o fluxo na cabeça. Se você usa `break` mais de uma vez no mesmo laço, reavalie a condição.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'O laço `for` tem três partes separadas por ponto e vírgula: **inicialização** (uma vez), **condição** (antes de cada volta) e **passo** (depois do corpo).',
      'A condição é testada **antes** do corpo: se já for falsa no primeiro teste, o laço não executa nenhuma vez.',
      'Contar para trás exige início maior, condição `>=` e passo decrescente (`i--`); passos como `i += 2` percorrem apenas valores de 2 em 2.',
      'Em laços **aninhados**, o interno percorre o ciclo inteiro para cada volta do externo — é assim que a tabuada é montada.',
      '`break` encerra o laço na hora; `continue` pula para a próxima volta; ambos dependem de um `if` e o `break` só afeta o laço mais interno.',
      'Acumuladores (soma, contagem) são declarados **antes** do laço e atualizados dentro dele; o resultado final é calculado depois.',
      'A variável declarada no `for` só existe dentro dele — para usá-la depois, declare antes da estrutura.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Nem sempre sabemos quantas voltas um laço dará: "leia notas até o usuário digitar -1" não tem número conhecido. Na aula seguinte você estuda `while` e `do-while`, feitos para esse tipo de condição — e aprende a evitar o temido laço infinito.' },
  ],

  exercises: [
    {
      id: 'm1l09e1',
      type: 'mc',
      question: 'Qual fragmento imprime os números de 1 a 5, um por linha?',
      options: [
        'for (int i = 5; i >= 1; i++) { System.out.println(i); }',
        'for (int i = 1; i <= 5; i++) { System.out.println(i); }',
        'for (int i = 0; i < 5; i++) { System.out.println(i); }',
        'for (int i = 1; i < 5; i++) { System.out.println(i); }',
      ],
      answer: 1,
      explanation: 'O laço correto começa em `1`, testa `i <= 5` (incluindo o limite) e avança com `i++`, imprimindo 1, 2, 3, 4 e 5. A primeira alternativa **desce** de 5 para 1; a terceira começa em **0** e para antes do 5 (imprime 0 a 4); a quarta tem início correto, mas usa `<`, que **exclui** o 5 — a saída é 1 a 4. Confundir `<` com `<=` é o erro de contagem mais frequente desta aula.',
    },
    {
      id: 'm1l09e2',
      type: 'code',
      question: 'Qual é a saída exata do programa abaixo?',
      code: 'for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= i; j++) {\n        System.out.print(j + "");\n    }\n    System.out.println();\n}',
      lang: 'java',
      options: [
        '1\\n12\\n123',
        '123\\n123\\n123',
        '1\\n2\\n3',
        '123',
      ],
      answer: 0,
      explanation: 'O laço externo varre `i` de 1 a 3 e, para cada `i`, o interno varre `j` de 1 até `i`. Assim, a primeira linha imprime `1`, a segunda imprime `12` (j = 1 e j = 2) e a terceira imprime `123`. O `System.out.print` (sem `l`) não quebra a linha, por isso os dígitos aparecem colados; o `println()` vazio depois do laço interno avança para a nova linha. A saída é um triângulo: 1, depois 12, depois 123.',
    },
    {
      id: 'm1l09e3',
      type: 'tf',
      question: 'A variável `i` declarada na inicialização de `for (int i = 0; i < 10; i++)` continua acessível nas linhas seguintes ao fechamento das chaves do laço.',
      answer: false,
      explanation: 'A declaração `int i = 0` dentro do `for` cria uma variável com **escopo limitado ao laço**: ela nasce ali e morre no fechamento das chaves. Tentar ler `i` depois gera erro de compilação `cannot find symbol`. Se o valor final for necessário fora, declare a variável antes do `for` e deixe a inicialização vazia na primeira parte da estrutura.',
    },
    {
      id: 'm1l09e4',
      type: 'short',
      question: 'Em uma ou duas frases, explique o que faz cada uma das três partes de um laço `for` e em que ordem elas executam.',
      keywords: [
        ['inicializ', 'declara a variavel', 'comeca', 'cria a variavel'],
        ['condicao', 'testa', 'enquanto for verdadeira'],
        ['passo', 'incremento', 'atualiza a variavel', 'depois do corpo'],
      ],
      answerText: 'A inicialização executa uma única vez e cria a variável de controle; a condição é testada antes de cada volta e encerra o laço quando fica falsa; o passo (por exemplo `i++`) atualiza a variável ao final de cada volta, depois do corpo, e o ciclo teste-corpo-passo se repete.',
      explanation: 'A ordem é essencial: **inicialização → teste do corpo → passo → novo teste**. Errar a ordem explica dois problemas clássicos: prever a saída começando pelo valor incrementado (o passo roda depois do corpo) e laços que não executam (a condição é falsa já no primeiro teste, antes de qualquer coisa).',
    },
    {
      id: 'm1l09e5',
      type: 'code',
      question: 'Qual número o programa imprime?',
      code: 'int soma = 0;\nfor (int i = 1; i <= 5; i++) {\n    if (i % 2 == 0) {\n        continue;\n    }\n    soma = soma + i;\n}\nSystem.out.println(soma);',
      lang: 'java',
      options: ['9', '6', '15', '4'],
      answer: 0,
      explanation: '`continue` pula o restante do corpo quando `i` é par, então os valores **2 e 4** nunca entram na soma. Os ímpares 1, 3 e 5 são somados: 1 + 3 + 5 = **9**. A alternativa 6 seria o resultado se apenas os pares fossem somados (2 + 4); 15 seria a soma de todos os valores (1 + 2 + 3 + 4 + 5); e 4 corresponderia a somar somente o último ímpar válido, indicando que o acumulador foi zerado dentro do laço.',
    },
  ],

  challenge: {
    id: 'm1l09c1',
    title: 'Tabuada com soma dos pares',
    fileName: 'Tabuada.java',
    prompt: 'Escreva o programa `Tabuada.java` que lê um número inteiro positivo N e imprime a tabuada de N de 1 a 10, uma linha por multiplicador, no formato exato `N x t = resultado` (exemplo com N = 3: a primeira linha é `3 x 1 = 3` e a última é `3 x 10 = 30`). Depois de fechar o laço da tabuada, imprima a linha `Soma dos pares: X`, em que X é a soma de todos os resultados da tabuada que são números pares (com N = 3, os pares são 6, 12, 18, 24 e 30, portanto X = 90). Use um laço `for` para gerar as 10 linhas e outro laço `for` (ou o mesmo, acumulando) para calcular a soma; o acumulador deve ser declarado antes do laço.',
    starterCode: 'import java.util.Scanner;\n\nclass Tabuada {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n        System.out.print("Digite um numero: ");\n        int n = teclado.nextInt();\n\n        // seu laco da tabuada aqui\n\n        // sua soma dos resultados pares aqui\n\n        teclado.close();\n    }\n}\n',
    criteria: [
      'Lê o inteiro N com `Scanner` antes dos laços e usa o valor lido como base de todas as linhas',
      'Usa um laço `for` com contador de 1 a 10 (condição `t <= 10`) que produz exatamente 10 linhas',
      'Monta cada linha com concatenação no formato `N x t = resultado`, sem espaços extras',
      'Declara o acumulador da soma antes do laço e soma apenas os resultados com resto zero na divisão por 2',
      'Imprime `Soma dos pares: ` seguido do total, depois do laço da tabuada e antes de `teclado.close()`',
    ],
    modelSolution: [
      { t: 'p', text: 'A solução abaixo usa dois laços `for`: o primeiro monta as linhas, o segundo varre de novo os multiplicadores para acumular apenas os pares. A separação em dois laços mantém cada bloco com uma única responsabilidade e facilita conferir o enunciado item a item.' },
      { t: 'code', lang: 'java', caption: 'Tabuada.java', code: `import java.util.Scanner;

class Tabuada {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        System.out.print("Digite um numero: ");
        int n = teclado.nextInt();

        // Laço 1: imprime as 10 linhas da tabuada
        for (int t = 1; t <= 10; t++) {
            int resultado = n * t;
            System.out.println(n + " x " + t + " = " + resultado);
        }

        // Acumulador declarado ANTES do laço, zerado
        int somaPares = 0;

        // Laço 2: percorre os mesmos multiplicadores somando só os pares
        for (int t = 1; t <= 10; t++) {
            int resultado = n * t;
            if (resultado % 2 == 0) {
                somaPares = somaPares + resultado;
            }
        }

        System.out.println("Soma dos pares: " + somaPares);
        teclado.close();
    }
}` },
      { t: 'p', text: 'Com N = 3, a primeira rotina imprime as dez linhas de `3 x 1 = 3` até `3 x 10 = 30`; a segunda detecta os pares (6, 12, 18, 24 e 30) e acumula 90, exibindo `Soma dos pares: 90`. Teste também com N = 4: todos os resultados são pares (4, 8, ..., 40), então a soma é 220. Se os seus números não baterem, confira se o acumulador está fora do `for` e se o teste é `resultado % 2 == 0`.' },
      { t: 'p', text: 'Variante válida: um único laço pode imprimir a linha e acumular a soma ao mesmo tempo, desde que o acumulador continue declarado antes. As duas versões passam nos critérios — escolha a que deixar o código mais legível para você.' },
    ],
  },
}
