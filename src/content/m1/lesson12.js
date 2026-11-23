export default {
  id: 'm1l12',
  moduleId: 'm1',
  number: 12,
  title: 'Arrays e matrizes',
  durationMinutes: 24,

  objectives: [
    'Declarar, inicializar e acessar elementos de um array com seus índices',
    'Percorrer arrays com laços usando `length` como limite',
    'Representar tabelas com matrizes de duas dimensões e percorrer linhas e colunas',
    'Formatar saídas tabulares com `System.out.printf`',
    'Passar arrays para métodos e devolver resultados calculados',
  ],

  prerequisites: [
    'Ter concluído as aulas sobre laços `for` e `while`',
    'Ter praticado métodos com parâmetros e retorno na aula anterior',
    'Saber montar acumuladores e médias com variáveis simples',
    'Conhecer os tipos primitivos `int` e `double` e a leitura com `Scanner`',
  ],

  intro: [
    { t: 'p', text: 'Se o seu programa precisa guardar as notas de cinco alunos, cinco variáveis funcionam. De trinta, já incomodam. De duzentas, são inviáveis: quem vai lembrar o nome da variável da nota 173? E quando a tarefa for calcular a média de cada aluno, o código de repetição manual seria uma cópia colada de trinta blocos.' },
    { t: 'p', text: 'O **array** resolve isso com uma ideia simples: uma única variável que guarda **vários valores do mesmo tipo**, cada um em uma posição numerada. Com ele, o programa passa a tratar um conjunto de dados com um laço — exatamente a ferramenta que você dominou nas aulas 9 e 10. Nesta aula você declara arrays, percorre com `length`, conhece as **matrizes** (arrays de duas dimensões, para tabelas) e aprende a formatar a saída com `System.out.printf` para relatórios legíveis.' },
    { t: 'p', text: 'Pense em uma **ficha de correspondência com gavetas numeradas**: um armário só, rotulado `notas`, com gavetas 0, 1, 2 e assim por diante. Você não cria um armário por nota — acessa a gaveta certa pelo número. É exatamente assim que o array se comporta, e é por isso que a **posição** (ou índice) é o conceito central desta aula.' },
    { t: 'note', kind: 'tip', title: 'Prática sugerida', text: 'Digite todos os exemplos e **troque os valores** depois: mude o tamanho do array, adicione uma linha na matriz, imprima uma posição diferente. Arrays são o assunto em que mais se aprende errando o índice — e errando barato, no seu próprio terminal.' },
  ],

  theory: [
    { t: 'h2', text: 'O problema de N variáveis' },
    { t: 'p', text: 'Veja o que acontece sem arrays quando temos cinco notas para somar e tirar a média. O código é correto, mas não escala.' },
    { t: 'code', lang: 'java', caption: 'SemArrays.java', code: `class SemArrays {
    public static void main(String[] args) {
        double nota1 = 8.5;
        double nota2 = 7.0;
        double nota3 = 9.5;
        double nota4 = 6.0;
        double nota5 = 8.0;

        double soma = nota1 + nota2 + nota3 + nota4 + nota5;
        double media = soma / 5;
        System.out.println("Media: " + media);
    }
}` },
    { t: 'p', text: 'Cada nota exige uma **variável nova**, um nome novo e uma soma escritada à mão. Para trinta alunos seriam trinta variáveis e uma soma de trinta termos; para aplicar um desconto em todas, seria preciso editar cada linha. Os dados aqui são **homogêneos** (todos são notas) e **ordenados** (1ª, 2ª, 3ª...) — exatamente o perfil que um array atende com uma única declaração.' },
    { t: 'p', text: 'Um array é, portanto, uma estrutura que armazena **uma coleção de valores de um mesmo tipo** em posições consecutivas, acessadas por um número inteiro. Em vez de cinco nomes, você terá **um nome** (`notas`) e cinco **índices** (0 a 4).' },

    { t: 'h2', text: 'Declarando e usando um array' },
    { t: 'p', text: 'A declaração `double[] notas = new double[5];` tem duas partes: `double[] notas` diz que a variável é um **array de `double`**, e `new double[5]` **cria o espaço na memória com 5 posições**. As posições são numeradas a partir de **zero**: 0, 1, 2, 3 e 4. Acessa-se cada elemento com o nome seguido do índice entre colchetes.' },
    { t: 'table', headers: ['Termo', 'No exemplo', 'Significado'], rows: [
      ['Array', '`notas`', 'Nome único da coleção (variável de referência)'],
      ['Tipo dos elementos', '`double`', 'Todos os valores guardados são do mesmo tipo'],
      ['Tamanho', '`5`', 'Quantidade de posições, definida na criação e fixa'],
      ['Índice', '`notas[0]`', 'Posição de 0 a `length - 1`'],
      ['Elemento', '`8.5`', 'Valor armazenado em uma posição'],
    ] },
    { t: 'code', lang: 'java', caption: 'PrimeiroArray.java', code: `class PrimeiroArray {
    public static void main(String[] args) {
        double[] notas = new double[5];

        notas[0] = 8.5;
        notas[1] = 7.0;
        notas[2] = 9.5;
        notas[3] = 6.0;
        notas[4] = 8.0;

        System.out.println("Primeira nota: " + notas[0]);
        System.out.println("Ultima nota: " + notas[4]);
        System.out.println("Posicoes: " + notas.length);
    }
}` },
    { t: 'p', text: 'A linha `double[] notas = new double[5];` reserva as cinco posições e as preenche com os **valores padrão** do tipo — para `double`, isso é `0.0`. Por isso, antes de atribuir, `notas[0]` já retornaria `0.0`, e não um erro. Em seguida, `notas[0] = 8.5;` grava na primeira posição e `notas[4] = 8.0;` na última: repare que **nunca existe `notas[5]`** com um array de tamanho 5. A última posição é sempre `length - 1`.' },
    { t: 'p', text: 'O atributo `length` devolve o tamanho do array. Note a sintaxe: `notas.length` **sem parênteses**, porque é uma propriedade, não um método — a diferença para `String.length()`, que você já usou, aparece na lista de erros comuns desta aula.' },

    { t: 'h2', text: 'Percorrendo um array com laço' },
    { t: 'p', text: 'A verdadeira força do array aparece quando entram os laços: em vez de escrever `notas[0]`, `notas[1]`..., um `for` varre todas as posições mudando apenas o índice. O limite do laço é o próprio `length` — assim, se o tamanho mudar, **nenhuma linha do laço precisa ser editada**.' },
    { t: 'code', lang: 'java', caption: 'Percorrendo.java', code: `import java.util.Scanner;

class Percorrendo {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        double[] notas = new double[5];
        double soma = 0;

        for (int i = 0; i < notas.length; i++) {
            System.out.print("Nota " + (i + 1) + ": ");
            notas[i] = teclado.nextDouble();
            soma = soma + notas[i];
        }

        double media = soma / notas.length;
        System.out.println("Media: " + media);
        teclado.close();
    }
}` },
    { t: 'p', text: 'Analise a linha `for (int i = 0; i < notas.length; i++)`: o contador `i` é usado como **índice**. A condição usa `<` (e não `<=`) porque `i` percorre 0, 1, 2, 3 e 4 — parar em `i = 5` tentaria ler `notas[5]` e derrubaria o programa. Dentro do corpo, `notas[i] = teclado.nextDouble()` grava na posição daquela volta e `soma = soma + notas[i]` acumula; depois do laço, `soma / notas.length` usa o próprio `length` como divisor, o que mantém o programa consistente se o tamanho mudar para 30.' },
    { t: 'note', kind: 'warn', title: 'Índice fora de alcance', text: 'Acessar `notas[5]` em um array de 5 posições gera `ArrayIndexOutOfBoundsException` em tempo de execução — o programa falha no momento em que a linha executa. A regra de ouro: **o último índice válido é sempre `array.length - 1`** e a condição do laço deve ser `i < array.length`. Você verá esse erro tratado na aula 13.' },
    { t: 'p', text: 'Os valores padrão valem para todos os tipos primitivos: `int` → 0, `double` → 0.0, `boolean` → `false` e `char` → o caractere de código zero. Se você esquecer de preencher uma posição, ela não fica "vazia": guarda o padrão silenciosamente — motivo pelo qual preencher sempre o array inteiro é uma disciplina importante.' },

    { t: 'h2', text: 'Inicialização direta e leitura compacta' },
    { t: 'p', text: 'Quando os valores já são conhecidos, dá para declarar e preencher o array em uma linha só, entre chaves. Isso elimina as atribuições `notas[0] = ...` repetidas.' },
    { t: 'code', lang: 'java', caption: 'Direta.java', code: `class Direta {
    public static void main(String[] args) {
        double[] medias = {8.5, 7.0, 9.2, 6.5};
        int[] contadores = new int[] {10, 20, 30};

        for (int i = 0; i < medias.length; i++) {
            System.out.println("Posicao " + i + ": " + medias[i]);
        }

        System.out.println("Total de medias: " + medias.length);
        System.out.println("Segundo contador: " + contadores[1]);
    }
}` },
    { t: 'p', text: 'Em `double[] medias = {8.5, 7.0, 9.2, 6.5};` o tamanho é **deduzido** dos valores: o array nasce com 4 posições e `medias.length` imprime 4. A forma `new int[] {10, 20, 30}` é usada quando você declara a variável primeiro e atribui o array depois — as chaves continuam as mesmas, mas o `new int[]` é obrigatório nesse caso. Note a saída do laço: as posições aparecem numeradas de 0 a 3, confirmando a convenção de índices.' },

    { t: 'h2', text: 'Procurando o maior valor' },
    { t: 'p', text: 'Um uso clássico de array + laço é encontrar o maior elemento (e em que posição ele está). A técnica guarda o "campeão atual" em uma variável e compara cada elemento com ele.' },
    { t: 'code', lang: 'java', caption: 'MaiorNota.java', code: `class MaiorNota {
    public static void main(String[] args) {
        int[] notas = {72, 85, 61, 90, 78};

        int maior = notas[0];
        int posicao = 0;

        for (int i = 1; i < notas.length; i++) {
            if (notas[i] > maior) {
                maior = notas[i];
                posicao = i;
            }
        }

        System.out.println("Maior nota: " + maior);
        System.out.println("Posicao: " + posicao);
    }
}` },
    { t: 'p', text: 'O laço começa em **`i = 1`**, porque o elemento 0 já foi usado para "semear" `maior`. A cada volta, `if (notas[i] > maior)` compara o candidato com o campeão; quando alguém vence, `maior` e `posicao` são atualizados. Terminado o laço, `maior` guarda o maior valor (90) e `posicao` a posição dele (3). Essa estrutura — semear com o primeiro elemento, percorrer do segundo em diante, atualizar quando encontrar melhor — reaparece em inúmeros problemas, inclusive no relatório do projeto do módulo.' },

    { t: 'h2', text: 'Matrizes: linhas e colunas' },
    { t: 'p', text: 'Muitos dados são **tabelas**: alunos nas linhas, provas nas colunas. Para isso existe a matriz, um **array de arrays**: cada posição guarda outro array. A declaração `double[][] turma = new double[3][3];` cria 3 linhas, cada uma com 3 colunas.' },
    { t: 'code', lang: 'java', caption: 'Matriz.java', code: `class Matriz {
    public static void main(String[] args) {
        double[][] turma = {
            {8.0, 7.5, 9.0},
            {6.0, 5.5, 7.0},
            {9.5, 8.5, 10.0}
        };

        for (int aluno = 0; aluno < turma.length; aluno++) {
            double soma = 0;
            for (int prova = 0; prova < turma[aluno].length; prova++) {
                soma = soma + turma[aluno][prova];
            }
            double media = soma / turma[aluno].length;
            System.out.println("Aluno " + (aluno + 1) + ": " + media);
        }
    }
}` },
    { t: 'p', text: 'Na inicialização entre chaves, cada linha interna é um array de provas — a matriz nasce com 3 linhas de 3 elementos. No laço externo, `turma.length` vale **3** (número de linhas); no interno, `turma[aluno].length` vale **3** também (número de colunas daquela linha). A expressão `turma[aluno][prova]` lê a célula: primeiro a linha, depois a coluna. Repare que o laço interno usa `soma` declarada **dentro** da volta do aluno — ela zera automaticamente para cada novo aluno, e é assim que a média individual não contamina as demais.' },
    { t: 'p', text: 'Matrizes no Java são "jagged" (irregulares): como cada linha é um array independente, `new double[3][]` permite linhas com tamanhos diferentes. Nas matrizes regulares criadas com `new double[3][3]`, isso não aparece — mas `turma[aluno].length` continua sendo a forma correta de saber as colunas, porque funciona nos dois casos.' },
    { t: 'note', kind: 'info', title: 'Inverter linha e coluna', text: 'A ordem dos índices é **`turma[linha][coluna]`**, ou aqui `turma[aluno][prova]`. Escrever `turma[prova][aluno]` com 5 alunos e 3 provas tentará acessar a linha 3 de um array de 3 linhas (índice 3 é inválido) — erro garantido. Antes de digitar, escreva no papel o que cada eixo representa.' },

    { t: 'h2', text: 'Formatando a saída com `System.out.printf`' },
    { t: 'p', text: 'Relatórios com `System.out.println` e concatenação ficam desalinhados: "Aluno 1: 8.0", "Aluno 10: 7.5" quebram a coluna. O `printf` resolve montando a saída a partir de um **modelo de texto** com marcadores: `%d` para inteiro, `%f` para decimal, `%s` para texto, e `%.2f` para decimal com duas casas. A quebra de linha é o marcador `%n`.' },
    { t: 'code', lang: 'java', caption: 'Relatorio.java', code: `class Relatorio {
    public static void main(String[] args) {
        int[] notas = {8, 7, 10, 6, 9};
        double soma = 0;

        for (int i = 0; i < notas.length; i++) {
            soma = soma + notas[i];
            System.out.printf("Aluno %d: %d pontos%n", i + 1, notas[i]);
        }

        double media = soma / notas.length;
        System.out.printf("Media da turma: %.2f%n", media);
    }
}` },
    { t: 'p', text: 'Em `System.out.printf("Aluno %d: %d pontos%n", i + 1, notas[i])`, o primeiro `%d` recebe `i + 1` (inteiro) e o segundo recebe `notas[i]` (também inteiro): os valores são substituídos **na ordem dos marcadores**. Na última linha, `%.2f` formata a média com duas casas decimais, e o `%n` garante a quebra de linha. Repare em uma diferença importante em relação ao `println`: o `printf` **não quebra a linha sozinho** — sem `%n` (ou `\n`), a próxima saída continuaria na mesma linha.' },
    { t: 'p', text: 'Os marcadores exigem tipos compatíveis: `%d` com `double` ou `%f` com `String` lança `IllegalFormatConversionException` durante a execução. Confira, ao escrever o modelo, se cada `%` tem um valor correspondente com o tipo certo — e na mesma quantidade.' },

    { t: 'h2', text: 'Arrays e métodos juntos' },
    { t: 'p', text: 'Passar um array para um método é como passar qualquer outro dado: o nome vai como argumento, **sem colchetes** (os colchetes são para acessar um elemento, como `valores[0]`). Como o array é um objeto de referência, o método opera sobre **os mesmos dados** vistos pelo chamador — diferente da cópia de primitivos que você viu na aula anterior.' },
    { t: 'code', lang: 'java', caption: 'SomaArray.java', code: `class SomaArray {
    public static void main(String[] args) {
        int[] valores = {4, 8, 15, 16, 23, 42};

        int total = somar(valores);
        System.out.println("Total: " + total);
        System.out.println("Media: " + (double) total / valores.length);
    }

    public static int somar(int[] numeros) {
        int soma = 0;
        for (int i = 0; i < numeros.length; i++) {
            soma = soma + numeros[i];
        }
        return soma;
    }
}` },
    { t: 'p', text: 'Na chamada `somar(valores)`, o argumento é o **array inteiro**; na assinatura, o parâmetro é `int[] numeros`. Dentro do método, `numeros.length` e `numeros[i]` funcionam exatamente como no `main` — o método enxerga as mesmas posições. O retorno `int` devolve a soma acumulada para a variável `total`. Já a linha `(double) total / valores.length` usa o **cast** `(double)` para forçar a divisão com casas decimais: sem ele, a divisão inteira truncaria o resultado (conceito da aula sobre conversão de tipos).' },
    { t: 'quote', text: 'Array é um nome para muitos valores; o índice é a chave de cada gaveta; o laço é o operador que abre todas, uma por uma.' },

    { t: 'h2', text: 'Síntese: quando usar array e quando usar matriz' },
    { t: 'ul', items: [
      '**Array (1 dimensão)**: uma coleção simples — notas de uma turma, preços de produtos, dígitos de um número.',
      '**Matriz (2 dimensões)**: dados em tabela — alunos × provas, dias × horas de vendas, linhas × colunas de um mapa.',
      '**Nada de tamanho dinâmico**: o tamanho do array é fixado na criação. Para crescer, é preciso criar um array maior e copiar os dados — ou usar as *collections* do módulo 3, feitas para isso.',
      '**Sempre percorra com `length`**: tamanhos fixos escritos à mão (`i < 5`) quebram quando o dado muda e são a origem clássica do índice esquecido.',
    ] },
  ],

  commonMistakes: [
    { title: 'Achar que o índice começa em 1', text: 'O primeiro elemento é `array[0]` e o último é `array[array.length - 1]`. Acessar `notas[5]` em um array de tamanho 5 lança `ArrayIndexOutOfBoundsException` e encerra o programa. Esse "errou por um" é o erro mais frequente da aula: se o laço usa `i <= notas.length`, ele já está errado — use `i < notas.length`.' },
    { title: 'Escrever `array.length()` com parênteses', text: 'Em arrays, `length` é um **atributo**: `notas.length`, sem parênteses. O compilador acusa `cannot find symbol method length()`. A confusão vem do `String`, que usa `texto.length()` com parênteses porque é um método. Decorar essa diferença evita o retrabalho: **array tem atributo, texto tem método**.' },
    { title: 'Deixar posições sem preencher e usar os valores padrão', text: 'Um array de `double` recém-criado está cheio de `0.0`, não de "vazio". Se você preencher apenas 3 de 10 posições e calcular a média por `length` (10), os zeros puxam o resultado para baixo **sem nenhum aviso**. Preencha todas as posições válidas ou controle com uma variável quantas foram realmente usadas, e use essa contagem no cálculo.' },
    { title: 'Inverter linhas e colunas na matriz', text: 'Com `double[][] turma = new double[5][3]` (5 alunos, 3 provas), escrever `turma[prova][aluno]` inverte os eixos: na terceira prova de um aluno de número 4, o acesso `turma[2][4]` pede a coluna 4 de uma linha de 3 colunas e falha. Sempre declare mentalmente o que cada dimensão representa e confira se o primeiro índice cabe em `turma.length` e o segundo em `turma[linha].length`.' },
    { title: 'Achar que atribuir um array a outro duplica os dados', text: 'Em `int[] copia = origem;` não há cópia de elementos: as duas variáveis apontam para **o mesmo** array. Alterar `copia[0]` muda `origem[0]` também. Para uma cópia de verdade, crie um novo array do mesmo tamanho e copie elemento a elemento com um laço — comportamento que verá de forma detalhada no módulo 2, ao estudar tipos de referência.' },
  ],

  bestPractices: [
    { title: 'Use `length` como limite do laço, sempre', text: '`for (int i = 0; i < notas.length; i++)` — nunca `i <= 5` nem `i < 6`. Quando o tamanho do array mudar, o laço se ajusta sozinho. Números mágicos no limite do laço são a principal fonte de índice fora de alcance em código de produção.' },
    { title: 'Dê nomes de eixo às variáveis de índice', text: 'Em matrizes, `aluno` e `prova` comunicam muito mais que `i` e `j`. O custo de digitar um nome maior é minúsculo; o ganho aparece quando você relê o código semanas depois ou quando inverte os eixos por engano e precisa depurar.' },
    { title: 'Monte relatórios com `printf` desde cedo', text: 'Alinhamento, casas decimais e largura fixa de coluna saem prontos com `printf` e formatos como `%d`, `%.2f` e `%s`. Em sistemas reais, tabelas desalinhadas geram chamados de suporte — formatar a saída é parte do programa, não enfeite.' },
    { title: 'Devolva cálculos por retorno e mantenha a apresentação separada', text: 'Métodos como `somar(int[] valores)` devolvem o resultado e não imprimem nada, o que os torna reutilizáveis e testáveis. A impressão fica no `main` ou em um método próprio de apresentação — a mesma organização em entrada, processamento e saída que você aprendeu na aula de métodos.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Um array guarda **vários valores do mesmo tipo** sob um único nome, acessados por **índices de 0 a `length - 1`**.',
      '`double[] notas = new double[5];` cria 5 posições com valor padrão `0.0`; `notas.length` informa o tamanho (**sem parênteses**).',
      'Percorra sempre com `for (int i = 0; i < array.length; i++)` — a condição usa `<`, nunca `<=`.',
      'A inicialização direta `double[] v = {1, 2, 3};` deduz o tamanho dos valores.',
      'Matriz é array de arrays: `turma[linha][coluna]`, com `turma.length` = linhas e `turma[linha].length` = colunas.',
      '`System.out.printf` formata saída com marcadores `%d`, `%f`, `%.2f`, `%s` e `%n` — os valores entram na ordem dos marcadores.',
      'Arrays vão para métodos como `somar(int[] valores)`, sem colchetes na chamada; dentro, use `numeros.length` e `numeros[i]`.',
      'Índice inválido gera `ArrayIndexOutOfBoundsException` em execução — assunto do tratamento de erros na próxima aula.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Seu programa já sabe repetir, calcular e guardar dados — mas ainda não sabe **falhar com elegância**. A aula 13 introduz o tratamento de erros com `try` e `catch`, para que entrada inválida ou divisão por zero não derrubem o programa.' },
  ],

  exercises: [
    {
      id: 'm1l12e1',
      type: 'mc',
      question: 'Em um array criado com `int[] valores = new int[10];`, quais são o índice do último elemento e o valor de `valores.length`?',
      options: [
        'Índice 10 e `length` 10',
        'Índice 9 e `length` 10',
        'Índice 10 e `length` 9',
        'Índice 9 e `length` 9',
      ],
      answer: 1,
      explanation: 'A numeração começa em zero, então 10 posições vão de `valores[0]` até `valores[9]`: o **último índice é `length - 1`, ou seja 9**. O atributo `length` devolve o tamanho total, **10**, independentemente do índice. As demais combinações erram ao tratar `length` como índice (índice 10 já estaria fora do alcance) ou ao subtrair um do tamanho na contagem de posições.',
    },
    {
      id: 'm1l12e2',
      type: 'code',
      question: 'Qual é a saída do programa?',
      code: 'int[] v = {3, 6, 1, 4};\nint total = 0;\nfor (int i = 1; i < v.length; i++) {\n    total = total + v[i];\n}\nSystem.out.println(total);',
      lang: 'java',
      options: ['14', '11', '10', '7'],
      answer: 1,
      explanation: 'O laço começa em `i = 1` e vai até `i < 4`, percorrendo as posições 1, 2 e 3 — **a posição 0 (valor 3) fica de fora**. A soma é 6 + 1 + 4 = **11**. Se o laço começasse em `i = 0`, todos os elementos entrariam e o resultado seria 14; se fosse `i = 0` com `i < 3`, pararia antes do último e daria 10 (3 + 6 + 1); já 7 corresponderia a somar apenas 6 e 1, como se o laço começasse em 1 e parasse antes do último elemento. O ponto de partida e o limite do laço decidem quais elementos entram na conta.',
    },
    {
      id: 'm1l12e3',
      type: 'tf',
      question: 'Para conhecer o tamanho de um array de strings chamado `nomes`, escreve-se `nomes.length()` com parênteses, igual ao método usado em textos.',
      answer: false,
      explanation: '`nomes` é um **array**, e em arrays `length` é um atributo: a forma correta é `nomes.length`, sem parênteses. Escrever `nomes.length()` gera erro de compilação (`cannot find symbol method length()`). Os parênteses valem para `String` (`nomes[0].length()`), porque lá `length` é um método — **array tem atributo, texto tem método**.',
    },
    {
      id: 'm1l12e4',
      type: 'code',
      question: 'Considere a matriz `double[][] m = { {1.5, 2.5, 3.5}, {4.5, 5.5, 6.5} };`. O que a linha `System.out.println(m[1][2]);` imprime?',
      code: 'double[][] m = {\n    {1.5, 2.5, 3.5},\n    {4.5, 5.5, 6.5}\n};\nSystem.out.println(m[1][2]);',
      lang: 'java',
      options: ['3.5', '5.5', '6.5', 'Erro de compilação: matriz exige dois laços'],
      answer: 2,
      explanation: 'O primeiro índice escolhe a **linha**: `m[1]` é a segunda linha, `{4.5, 5.5, 6.5}` (as linhas são contadas de 0). O segundo índice escolhe a coluna dentro dela: `m[1][2]` é o terceiro valor, **6.5**. `3.5` seria `m[0][2]` e `5.5` seria `m[1][1]`. Não há exigência de laços para acessar uma célula isolada — os laços entram quando você precisa percorrer várias.',
    },
    {
      id: 'm1l12e5',
      type: 'short',
      question: 'Explique, em duas frases, por que um array é uma escolha melhor do que trinta variáveis separadas para guardar as notas de uma turma.',
      keywords: [
        ['um nome', 'unica variavel', 'mesmo nome', 'colecao', 'agrupa'],
        ['laco', 'indice', 'posicao', 'percorrer', 'sem repetir', 'dinamico'],
      ],
      answerText: 'Um array reúne as trinta notas em uma única variável, com cada valor em uma posição identificada por índice, em vez de criar trinta nomes diferentes. Assim, um laço percorre todas as posições usando `length`, permitindo somar, buscar ou imprimir sem repetir o mesmo código trinta vezes.',
      explanation: 'As duas vantagens andam juntas: **agrupamento** (um nome para a coleção) e **acesso indexado** (posição conhecida em tempo de execução). Sem isso, qualquer operação sobre todos os valores exigiria trinta linhas escritas à mão — e a manutenção (trocar uma nota, acrescentar um aluno) se tornaria inviável.',
    },
  ],

  challenge: {
    id: 'm1l12c1',
    title: 'Boletim da turma com matriz',
    fileName: 'Boletim.java',
    prompt: 'Escreva `Boletim.java` para uma turma de 5 alunos com 3 provas cada. Use uma matriz `double[5][3]` preenchida com `Scanner` (5 linhas de 3 valores, lidas com laços aninhados). Em seguida: calcule a média de cada aluno com um laço, imprima um relatório com `System.out.printf` no formato `Aluno 1 - Media: 7.83` (média com duas casas decimais), identifique e imprima no final a linha `Maior media: X` com a maior média da turma e, por último, imprima `Media da turma: Y` com a média geral (média das médias dos 5 alunos, também com duas casas decimais). Não use variáveis nomeadas nota1, nota2 etc. — os dados vivem na matriz.',
    starterCode: 'import java.util.Scanner;\n\nclass Boletim {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n        double[][] turma = new double[5][3];\n\n        // preencha a matriz com laços aninhados\n\n        // imprima a media de cada aluno com printf\n\n        // calcule e imprima a maior media e a media da turma\n\n        teclado.close();\n    }\n}\n',
    criteria: [
      'Declara `double[][] turma = new double[5][3]` e preenche as 15 células com dois laços aninhados usando `Scanner`',
      'Calcula a média de cada aluno somando as 3 colunas da linha e dividindo por `turma[aluno].length`',
      'Imprime cada aluno com `System.out.printf` no formato exato `Aluno N - Media: X`, com duas casas decimais',
      'Mantém uma variável de maior média atualizada durante o cálculo, comparando cada média com ela',
      'Imprime `Maior media: ` e `Media da turma: ` depois do relatório individual, ambos com duas casas decimais',
      'O programa não declara variáveis individuais para as notas (nota1, nota2...): todo acesso usa índices da matriz',
    ],
    modelSolution: [
      { t: 'p', text: 'A solução abaixo segue as quatro etapas do enunciado na mesma ordem: preencher, relatar, encontrar a maior média e calcular a média geral. Repare que a maior média é semeada com o valor da primeira linha (`turma[0]`), para que a comparação funcione mesmo com médias negativas.' },
      { t: 'code', lang: 'java', caption: 'Boletim.java', code: `import java.util.Scanner;

class Boletim {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        double[][] turma = new double[5][3];

        // 1) Preenchimento: 5 linhas (alunos) x 3 colunas (provas)
        for (int aluno = 0; aluno < turma.length; aluno++) {
            for (int prova = 0; prova < turma[aluno].length; prova++) {
                System.out.print("Nota do aluno " + (aluno + 1) + ", prova " + (prova + 1) + ": ");
                turma[aluno][prova] = teclado.nextDouble();
            }
        }

        // 2) Media de cada aluno + maior media + soma das medias
        double maiorMedia = turma[0][0] + turma[0][1] + turma[0][2];
        maiorMedia = maiorMedia / 3;
        double somaMedias = 0;

        for (int aluno = 0; aluno < turma.length; aluno++) {
            double soma = 0;
            for (int prova = 0; prova < turma[aluno].length; prova++) {
                soma = soma + turma[aluno][prova];
            }
            double media = soma / turma[aluno].length;

            System.out.printf("Aluno %d - Media: %.2f%n", aluno + 1, media);

            somaMedias = somaMedias + media;
            if (media > maiorMedia) {
                maiorMedia = media;
            }
        }

        // 3) Relatorio final
        System.out.printf("Maior media: %.2f%n", maiorMedia);
        System.out.printf("Media da turma: %.2f%n", somaMedias / turma.length);
        teclado.close();
    }
}` },
      { t: 'p', text: 'Sequência de conferência com notas fixas: se todos os alunos tirarem 8, 9 e 7 (média 8.0 em todos), a saída deve mostrar cinco linhas `Aluno N - Media: 8.00`, depois `Maior media: 8.00` e `Media da turma: 8.00`. Depois teste um caso desigual (médias 6.0, 7.5, 9.0, 5.5 e 8.0) e confira se `Maior media` é 9.00 e a média geral 7.20.' },
      { t: 'p', text: 'Variantes aceitáveis: calcular as médias em um primeiro laço e a maior média em outro (mantendo o critério de não usar variáveis individuais de nota), ou guardar as médias em um array `double[5]` e percorrê-lo — estrutura que você acabou de aprender e que deixa o relatório ainda mais organizado.' },
    ],
  },
}
