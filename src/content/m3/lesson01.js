export default {
  id: 'm3l01',
  moduleId: 'm3',
  number: 1,
  title: 'Collections Framework e a interface List',
  durationMinutes: 24,

  objectives: [
    'Explicar o papel do Collections Framework e a relação entre interface e implementação',
    'Declarar e manipular elementos de uma coleção com a interface List',
    'Escolher o método correto para adicionar, acessar, substituir e remover elementos',
    'Percorrer uma lista com laço com índice e com laço for-each',
    'Reconhecer e evitar os erros de índice e a armadilha da sobrecarga do remove',
  ],

  prerequisites: [
    'Ter concluído o módulo 2, incluindo a aula de Interfaces',
    'Saber declarar arrays e percorrê-los com laço for (aula 12 do módulo 1)',
    'Entender o que é uma interface e o que significa uma classe implementá-la',
    'Ter compilado e executado programas com os comandos javac e java',
  ],

  intro: [
    { t: 'p', text: 'No módulo 1 você aprendeu arrays: ótimos para guardar um número fixo de elementos. O problema é que **toda a vida real cresce**. Um catálogo de produtos começa com 3 itens e termina com 300; uma lista de interessados recebe gente nova a cada minuto. Com array, você precisaria adivinhar o tamanho máximo na hora de declarar, ou reescrever o código toda vez que o tamanho mudasse.' },
    { t: 'p', text: 'O **Collections Framework** resolve isso. É um conjunto de estruturas de dados já prontas, testadas e padronizadas na biblioteca padrão do Java (`java.util`): listas, conjuntos, mapas e as operações sobre eles (adicionar, remover, buscar, percorrer). Em vez de reimplementar a lógica de redimensionamento e de busca, você **instancia a estrutura certa para o problema certo**.' },
    { t: 'p', text: 'Nesta aula você conhece a arquitetura do framework e aprofunda a estrutura mais usada no dia a dia: a interface **`List`**. Verá como declarar uma lista, os métodos essenciais (`add`, `get`, `set`, `remove`, `indexOf`, `contains`, `size`), as duas formas de percorrer os elementos e, no final, a armadilha clássica do `remove` que derruba até gente experiente.' },
    { t: 'note', kind: 'tip', title: 'A sintaxe entre `<` e `>`', text: 'Você verá declarações como `List<String>`. Esse trecho entre `<` e `>` é a sintaxe de **generics** e será explicada em detalhe na aula 4 deste módulo; por ora, basta copiar exatamente como está escrito — a lista guarda apenas elementos do tipo indicado.' },
  ],

  theory: [
    { t: 'h2', text: 'Por que os arrays não bastam' },
    { t: 'p', text: 'Um array em Java tem tamanho **fixo desde a criação**: `String[] nomes = new String[10]` nasce com 10 posições e morre com 10 posições. Ele não tem métodos próprios — para achar um elemento você escreve um laço; para remover alguém você desloca as posições na mão; para crescer você cria um array novo e copia tudo. Tudo isso é código que você escreveria uma e outra vez, e que dá errado com facilidade (um índice a mais, um esquecimento de copiar o último elemento).' },
    { t: 'p', text: 'O **Collections Framework**, disponível no pacote `java.util`, é a resposta da biblioteca padrão. Ele traz duas coisas: (1) **interfaces** que descrevem o comportamento comum (`List`, `Set`, `Map`, `Collection`) e (2) **implementações** prontas de cada interface (`ArrayList`, `HashSet`, `HashMap`, `LinkedList`). Você programa para a interface e escolhe a implementação que melhor se adapta — exatamente o polimorfismo que você estudou no módulo 2, agora aplicado a estruturas de dados.' },
    { t: 'table', headers: ['Interface', 'O que descreve', 'Implementações principais', 'Exemplo de uso'], rows: [
      ['`List`', 'Coleção **ordenada** que aceita elementos repetidos e é acessada por posição', '`ArrayList` (a mais usada), `LinkedList`', 'Lista de produtos de um catálogo'],
      ['`Set`', 'Coleção **sem repetição** e, em geral, sem posição definida', '`HashSet`, `LinkedHashSet`', 'Conjunto de e-mails cadastrados'],
      ['`Map`', 'Conjunto de pares **chave-valor** com chave única', '`HashMap`, `LinkedHashMap`', 'Estoque consultado por SKU'],
      ['`Collection`', 'Raiz comum de `List` e `Set` (não é pai de `Map`)', '—', 'Operações compartilhadas: `size`, `isEmpty`, `clear`'],
    ] },
    { t: 'p', text: 'Guarde esta tabela: ela é o mapa do módulo inteiro. As aulas 2 e 3 tratam de `Set` e `Map`; esta aula trata de `List`. Repare que `Map` fica **fora** da hierarquia de `Collection` — ele tem um modelo próprio de dado (chave e valor) e por isso recebe uma aula separada.' },

    { t: 'h2', text: 'Declarando a primeira lista' },
    { t: 'p', text: 'A regra de ouro é: **declare o tipo como a interface e instancie a implementação**. `List` é a interface que descreve o contrato (listas têm posição, aceitam repetição, são percorríveis na ordem); `ArrayList` é a classe que executa esse contrato na prática, usando um array por baixo dos panos e crescendo sozinha quando necessário.' },
    { t: 'code', lang: 'java', caption: 'CatalogoSimples.java', code: `import java.util.ArrayList;
import java.util.List;

public class CatalogoSimples {
    public static void main(String[] args) {
        List<String> produtos = new ArrayList<>();
        produtos.add("Teclado mecanico");
        produtos.add("Mouse wireless");
        produtos.add("Monitor 24 polegadas");

        System.out.println(produtos.size());   // 3
        System.out.println(produtos.get(0));   // Teclado mecanico
        System.out.println(produtos.get(2));   // Monitor 24 polegadas
    }
}` },
    { t: 'p', text: 'Linha por linha: `import java.util.ArrayList;` e `import java.util.List;` trazem as classes para o arquivo (sem elas, o compilador não as conhece). Na linha `List<String> produtos = new ArrayList<>();` a variável é do **tipo da interface** `List` e o objeto criado é um `ArrayList` — o da direita é sempre um subtipo do da esquerda, então a atribuição é válida. Os três `produtos.add(...)` acrescentam elementos **no final**, na ordem em que foram chamados. `produtos.size()` devolve a quantidade de elementos (3), e `produtos.get(0)` acessa a primeira posição — **índices começam em zero**, a mesma regra dos arrays.' },
    { t: 'note', kind: 'info', title: 'Por que `new ArrayList<>()` com os parênteses vazios?', text: 'Os `<>` vazios são o *diamond operator*: o compilador infere o tipo a partir da esquerda (`List<String>` vira `new ArrayList<String>()`). Escreva sempre assim — é a forma moderna e mais legível.' },

    { t: 'h2', text: 'Os métodos essenciais de List' },
    { t: 'p', text: 'Uma `List` oferece muito mais que `add` e `get`. A tabela abaixo reúne o que você usará em praticamente todo projeto; depois vemos os dois métodos que mais confundem: `set` e `remove`.' },
    { t: 'table', headers: ['Método', 'O que faz', 'Retorno'], rows: [
      ['`add(elemento)`', 'Acrescenta ao final da lista', '`boolean` (`true`, salvo raro caso de falha)'],
      ['`add(indice, elemento)`', 'Insere na posição indicada, deslocando os demais', '`void`'],
      ['`get(indice)`', 'Lê o elemento da posição indicada', 'o elemento'],
      ['`set(indice, elemento)`', '**Substitui** o elemento da posição (não acrescenta)', 'o elemento antigo'],
      ['`remove(indice)`', 'Remove pela **posição** e desloca os próximos', 'o elemento removido'],
      ['`remove(objeto)`', 'Remove a **primeira ocorrência** do elemento informado', '`boolean`'],
      ['`indexOf(objeto)`', 'Primeira posição do elemento, ou `-1` se não existir', '`int`'],
      ['`contains(objeto)`', 'Testa se o elemento existe na lista', '`boolean`'],
      ['`size()` / `isEmpty()`', 'Quantidade de elementos / teste de lista vazia', '`int` / `boolean`'],
      ['`clear()`', 'Esvazia a lista por completo', '`void`'],
    ] },
    { t: 'code', lang: 'java', caption: 'OperacoesDeLista.java', code: `import java.util.ArrayList;
import java.util.List;

public class OperacoesDeLista {
    public static void main(String[] args) {
        List<String> produtos = new ArrayList<>();
        produtos.add("Cabo HDMI");
        produtos.add("Webcam");
        produtos.add("Cabo HDMI");

        produtos.set(1, "Webcam full HD");
        System.out.println(produtos);                        // [Cabo HDMI, Webcam full HD, Cabo HDMI]
        System.out.println(produtos.indexOf("Cabo HDMI"));   // 0
        System.out.println(produtos.contains("Webcam full HD")); // true

        produtos.remove("Cabo HDMI");
        System.out.println(produtos);                        // [Webcam full HD, Cabo HDMI]
        System.out.println(produtos.size());                 // 2
    }
}` },
    { t: 'p', text: 'Observe com atenção o que cada linha faz. `produtos.set(1, "Webcam full HD")` **substitui** o que estava na posição 1: a lista continua com 3 elementos, não ganhou um quarto — para acrescentar você usaria `add`. `indexOf("Cabo HDMI")` devolve `0` porque a lista permite repetição e a primeira ocorrência está na primeira posição; a segunda ocorrência continua lá, no índice 2. `contains("Webcam full HD")` devolve `true` porque a comparação é feita com `equals` (no caso de `String`, conteúdo). Por fim, `remove("Cabo HDMI")` recebe um **objeto**, então remove a primeira ocorrência e desloca os demais para a esquerda: sobram 2 elementos.' },

    { t: 'h2', text: 'Percorrendo a lista' },
    { t: 'p', text: 'Há duas formas idiomáticas de percorrer uma `List`. A primeira usa laço `for` com índice e é obrigatória quando você precisa **da posição** (numerar itens, comparar vizinhos, acessar outro array em paralelo). A segunda é o **for-each**: mais curto, sem contador e sem risco de errar o limite do laço — use-a quando você só precisa *ler* cada elemento.' },
    { t: 'code', lang: 'java', caption: 'Percursos.java', code: `import java.util.ArrayList;
import java.util.List;

public class Percursos {
    public static void main(String[] args) {
        List<Double> precos = new ArrayList<>();
        precos.add(10.5);
        precos.add(20.25);
        precos.add(5.0);

        double total = 0;
        for (int i = 0; i < precos.size(); i++) {
            total = total + precos.get(i);
        }
        System.out.println("Total: " + total);   // Total: 35.75

        for (double preco : precos) {
            System.out.println("Preco: " + preco);
        }

        System.out.println(precos.get(precos.size()));  // ERRO em tempo de execucao
    }
}` },
    { t: 'p', text: 'No primeiro laço, `i` vai de `0` até `precos.size() - 1` — a condição usa `<` (e não `<=`) justamente porque os índices vão até `size() - 1`. Cada iteração lê `precos.get(i)` e acumula no total. No for-each `for (double preco : precos)`, a variável `preco` recebe, a cada volta, o valor do próximo elemento: sem `get`, sem `size`, sem contador. A última linha mostra o erro mais comum de índice: `precos.get(precos.size())` pede a posição `3` em uma lista de 3 elementos (válidas: 0, 1 e 2) e a JVM lança `IndexOutOfBoundsException` em tempo de execução — o programa compila perfeitamente e quebra quando roda.' },
    { t: 'note', kind: 'warn', title: 'for-each não é para modificar a lista', text: 'Dentro de um for-each você pode **ler** os elementos com segurança. Inserir ou remover enquanto o laço percorre a coleção faz o Java detectar a modificação durante a iteração e lançar `ConcurrentModificationException`. Para remover durante o percorso, percorra com índice contando de trás para frente ou reúna os itens a remover em outra coleção.' },

    { t: 'h2', text: 'ArrayList e LinkedList: qual escolher?' },
    { t: 'p', text: '`ArrayList` e `LinkedList` implementam o mesmo contrato `List`, então o código que você escreve funciona com as duas. A diferença está em como cada uma guarda os dados por baixo dos panos — e isso muda o custo de cada operação.' },
    { t: 'table', headers: ['Operação', 'ArrayList', 'LinkedList', 'Quem vence'], rows: [
      ['Ler por índice (`get`)', 'Acesso direto, constantemente rápido', 'Percorre do começo ou do fim até a posição', 'ArrayList'],
      ['Acrescentar no final (`add`)', 'Rápido; dobra a capacidade de vez em quando', 'Rápido (aponta para o último nó)', 'Empate'],
      ['Inserir/remover no meio', 'Desloca os elementos vizinhos', 'Só religa os ponteiros dos vizinhos', 'LinkedList'],
      ['Memória', 'Menos (guarda só os elementos)', 'Mais (cada elemento guarda ponteiros)', 'ArrayList'],
    ] },
    { t: 'p', text: 'Na prática, **`ArrayList` é o padrão**: leituras por índice são tão mais frequentes que a maioria dos sistemas não sente o custo das inserções no meio. `LinkedList` só se paga em filas com muitas inserções/remoções nas extremidades — e mesmo isso hoje é discutível. Regra prática: comece sempre com `ArrayList`; mude apenas se um teste de desempenho provar que é necessário.' },

    { t: 'h2', text: 'A armadilha do remove' },
    { t: 'p', text: 'A interface `List` tem **dois** métodos chamados `remove`, e é aí que mora o erro. Um recebe `int` (remove a **posição**) e o outro recebe `Object` (remove o **elemento**). Quando a lista guarda objetos como `Integer`, os dois parecem possíveis para o mesmo argumento — e o compilador escolhe um deles de forma que quase ninguém espera.' },
    { t: 'code', lang: 'java', caption: 'ArmadilhaDoRemove.java', code: `import java.util.ArrayList;
import java.util.List;

public class ArmadilhaDoRemove {
    public static void main(String[] args) {
        List<Integer> notas = new ArrayList<>();
        notas.add(10);
        notas.add(20);
        notas.add(30);

        notas.remove(0);                    // remove a POSICAO 0 (o valor 10 sai)
        System.out.println(notas);          // [20, 30]

        notas.remove(Integer.valueOf(20));  // remove o ELEMENTO 20
        System.out.println(notas);          // [30]
    }
}` },
    { t: 'p', text: 'Na linha `notas.remove(0)`, o argumento é um `int`. As duas sobrecargas são candidatas: `remove(int indice)` se aplica direto, e `remove(Object)` exigiria *empacotar* `0` em `Integer`. O compilador prefere a versão que não precisa de conversão, então **remove a posição 0** — sai o valor 10, não o "elemento zero". Já em `notas.remove(Integer.valueOf(20))` o argumento é um objeto `Integer`, não mais um `int` primitivo: a única sobrecarga aplicável é `remove(Object)`, que procura o **valor** 20 e o remove. Se você quiser remover por valor em uma lista numérica, use `Integer.valueOf(...)` (ou encontre a posição com `indexOf` e remova pelo índice).' },
    { t: 'note', kind: 'info', title: 'E em `List<String>`?', text: 'Com `List<String>` não existe ambiguidade: `remove(0)` só casa com `remove(int)` (índice) e `remove("texto")` casa com `remove(Object)` (elemento). A confusão aparece quando o tipo dos elementos é numérico ou quando você tem um `int` guardado em variável e queria remover o valor.' },

    { t: 'h2', text: 'Caso realista: um catálogo com remoção segura' },
    { t: 'p', text: 'Vamos juntar tudo em uma peça de verdade do sistema de gerenciamento de usuários e produtos: uma classe de catálogo que mantém a lista encapsulada e oferece operações seguras. Repare que a remoção **verifica a posição antes de remover** — é o padrão que evita o `IndexOutOfBoundsException`.' },
    { t: 'code', lang: 'java', caption: 'CatalogoProdutos.java', code: `import java.util.ArrayList;
import java.util.List;

public class CatalogoProdutos {
    private List<String> nomes = new ArrayList<>();

    public void adicionar(String nome) {
        nomes.add(nome);
    }

    public boolean remover(String nome) {
        int posicao = nomes.indexOf(nome);
        if (posicao >= 0) {
            nomes.remove(posicao);
            return true;
        }
        return false;
    }

    public void listar() {
        if (nomes.isEmpty()) {
            System.out.println("Catalogo vazio.");
            return;
        }
        for (int i = 0; i < nomes.size(); i++) {
            System.out.println((i + 1) + ". " + nomes.get(i));
        }
    }
}` },
    { t: 'p', text: 'Analise as três operações. Em `adicionar`, o `add` da lista faz o trabalho pesado (redimensionamento incluído). Em `remover`, a linha `int posicao = nomes.indexOf(nome);` devolve `-1` quando o nome não existe — por isso a condição `posicao >= 0` garante que só chamamos `nomes.remove(posicao)` com uma posição válida; o retorno `boolean` informa ao chamador se algo foi removido. Em `listar`, o `isEmpty()` trata a lista vazia antes de qualquer laço, e a numeração `(i + 1)` mostra o item em formato legível para o usuário, enquanto `i` continua sendo a posição real usada em `get`. Essa combinação — **consultar antes de acessar** — é o hábito que elimina quase todos os erros de índice.' },
  ],

  commonMistakes: [
    { title: 'Chamar remove pensando em valor em lista numérica', text: 'Em `List<Integer>`, `remove(0)` remove a **posição 0**, não o valor 0. Para remover o valor, use `remove(Integer.valueOf(0))` ou localize a posição com `indexOf` antes. O pior detalhe é que o código compila e "funciona" errado: sai o elemento errado e o bug só aparece depois.' },
    { title: 'Acessar a posição igual a size()', text: 'Em uma lista com 3 elementos as posições válidas são 0, 1 e 2. `get(3)` ou `get(size())` compila sem problema e lança `IndexOutOfBoundsException` em execução. Evite calculando limites com `size() - 1` no laço e verificando `isEmpty()` antes de acessar a primeira posição.' },
    { title: 'Modificar a lista durante o percorrido', text: 'Inserir ou remover elementos dentro de um for-each (ou de um for com índice, sem cuidado) faz a estrutura mudar sob os pés do laço e a JVM responde com `ConcurrentModificationException`. Colete os itens a remover em uma segunda lista e remova depois, ou percorra de trás para frente quando for excluir.' },
    { title: 'Usar set() quando queria acrescentar', text: '`set(indice, elemento)` **substitui** o conteúdo da posição e mantém o tamanho. Se a intenção era adicionar mais um item, o resultado é silenciosamente errado: você perde o valor antigo e não ganha nova posição. Acrescente com `add`, substitua com `set`.' },
    { title: 'Declarar a variável como ArrayList sem necessidade', text: 'Escrever `ArrayList<String> x = new ArrayList<>()` funciona, mas amarra o código a uma implementação específica. Declarar como `List<String>` deixa a escolha da estrutura interna livre para mudar depois sem alterar todo o restante do programa — é o princípio de programar para interface que você viu no módulo 2.' },
  ],

  bestPractices: [
    { title: 'Declare como interface, instancie a implementação', text: 'Use `List<T> lista = new ArrayList<>();`, `Set<T> conjunto = new HashSet<>();` e assim por diante. O tipo à esquerda expressa a **intenção** (preciso de uma lista), o da direita é uma **escolha de implementação** que pode mudar sem quebrar o resto do código.' },
    { title: 'Prefira ArrayList como ponto de partida', text: 'É a implementação mais rápida para leitura por índice e a que a maioria dos projetos usa. Só avalie `LinkedList` (ou outra estrutura) quando houver um problema de desempenho medido — não por antecipação.' },
    { title: 'Use for-each quando não precisar do índice', text: 'Se dentro do laço você apenas lê cada elemento, `for (String nome : nomes)` é mais curto e elimina o risco de errar o limite. Reserve o `for` com índice para quando a posição for realmente necessária (numerar, comparar vizinhos, sincronizar com outro array).' },
    { title: 'Consulte antes de acessar ou remover', text: 'Antes de `get` ou `remove` por posição, confirme com `isEmpty()`/`indexOf`. O retorno de `indexOf` (`-1` para "não encontrado") e o retorno `boolean` de `remove` e `add` são informações baratas que evitam exceções caras em produção.' },
    { title: 'Trate o retorno booleano de add e remove', text: '`add` e `remove` devolvem `boolean`. Quando a regra de negócio depende do resultado ("inserir apenas se não existir", "avisar se nada foi removido"), use essa informação em vez de fazer depois uma busca redundante com `contains`.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'O **Collections Framework** (`java.util`) reúne interfaces prontas (`List`, `Set`, `Map`) e implementações (`ArrayList`, `HashSet`, `HashMap`).',
      'Regra de ouro: **declare pela interface** (`List<T>`) e **instancie a implementação** (`new ArrayList<>()`).',
      '`List` é ordenada, aceita elementos repetidos e é acessada por posição com `get(indice)` — índices começam em zero e vão até `size() - 1`.',
      'Métodos essenciais: `add` acrescenta, `set` substitui, `remove` aceita **índice ou elemento**, `indexOf` devolve a posição (`-1` se não existir), `contains` testa presença.',
      'Duas formas de percorrer: `for` com índice quando a posição importa e for-each quando você só lê os elementos.',
      'A armadilha clássica: em lista numérica, `remove(0)` remove a **posição**; para remover o valor use `Integer.valueOf(0)`.',
      '`ArrayList` é o padrão por ser rápida em leitura por índice; `LinkedList` só paga a pena em operações específicas no meio da estrutura.',
      'Sempre confira `isEmpty()`/`indexOf` antes de acessar ou remover — isso elimina a maioria dos `IndexOutOfBoundsException`.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você conhece a **`Set`**: a coleção que recusa elementos repetidos. Verá por que o HashSet sabe detectar duplicatas — e o papel de `equals` e `hashCode` nessa detecção.' },
  ],

  exercises: [
    {
      id: 'm3l01e1',
      type: 'mc',
      question: 'Um sistema de cadastro precisa guardar os nomes de clientes na ordem em que eles se cadastraram, permitindo que dois clientes tenham o mesmo nome. Qual estrutura é a mais adequada?',
      options: ['`HashSet<String>`', '`ArrayList<String>`', '`HashMap<String, String>`', 'Um array `String[]` de tamanho fixo'],
      answer: 1,
      explanation: 'A exigência é **ordem de inserção + repetição permitida**, exatamente o contrato de `List` — e `ArrayList` é sua implementação padrão. `HashSet` não preserva ordem e ainda recusa repetidos; `HashMap` guarda pares chave-valor, não uma lista de nomes; o array de tamanho fixo voltaria ao problema que motiva o Collections Framework (tamanho pré-definido e sem métodos prontos).',
    },
    {
      id: 'm3l01e2',
      type: 'tf',
      question: 'Em uma `List<String>` criada com `ArrayList`, os elementos ficam na ordem em que foram adicionados e podem se repetir.',
      answer: true,
      explanation: 'Essa é a definição do contrato de `List`: coleção **ordenada** (a ordem de inserção é preservada, a menos que você insira ou remova no meio) e **com repetição permitida**. Por isso `produtos.add("A"); produtos.add("A");` resulta em uma lista com dois elementos "A".',
    },
    {
      id: 'm3l01e3',
      type: 'code',
      question: 'Analise o trecho. O que é impresso na segunda chamada de `System.out.println`?',
      code: 'List<Integer> notas = new ArrayList<>();\nnotas.add(10);\nnotas.add(20);\nnotas.add(30);\nnotas.remove(0);\nSystem.out.println(notas);',
      lang: 'java',
      options: ['[10, 20, 30]', '[20, 30]', '[30]', 'Erro de compilação em notas.remove(0)'],
      answer: 1,
      explanation: 'O argumento `0` é um `int`, então o compilador escolhe a sobrecarga `remove(int indice)` — remove a **posição 0** (o valor 10) e desloca os demais. Sobra `[20, 30]`. Se o objetivo fosse remover o **valor** 0, seria preciso `notas.remove(Integer.valueOf(0))`. Nada aqui é erro de compilação: as duas sobrecargas de `remove` existem e o encaixe é válido.',
    },
    {
      id: 'm3l01e4',
      type: 'short',
      question: 'Uma lista tem 4 elementos. Explique por que a chamada `lista.get(4)` falha em tempo de execução e qual exceção é lançada.',
      keywords: [
        ['indice', 'índice', 'posicao', 'posição'],
        ['quatro', '4', 'size', 'tamanho', 'validos', 'válidos'],
        ['indexoutofbounds', 'fora', 'excecao', 'exceção'],
      ],
      answerText: 'Com 4 elementos os índices válidos vão de 0 a 3; a posição 4 não existe, então get(4) lança IndexOutOfBoundsException em tempo de execução, pois o maior índice é size() - 1.',
      explanation: 'Os índices de uma `List` começam em zero: com `size() == 4`, as posições válidas são 0, 1, 2 e 3. Qualquer acesso fora desse intervalo — inclusive `get(size())` — faz a JVM lançar `IndexOutOfBoundsException`. O erro não aparece na compilação porque o compilador não sabe em tempo de compilação quantos elementos a lista terá quando o programa rodar.',
    },
    {
      id: 'm3l01e5',
      type: 'mc',
      question: 'Qual método de `List` devolve a posição do primeiro elemento igual ao informado (ou -1 se ele não existir)?',
      options: ['`contains`', '`get`', '`indexOf`', '`search`'],
      answer: 2,
      explanation: '`indexOf` é o método de busca posicional: devolve o **índice** da primeira ocorrência ou `-1` quando não encontra. `contains` devolve apenas um `boolean` (existe ou não existe), sem informar a posição; `get` exige que você já conheça o índice; `search` não existe em `List`.',
    },
  ],

  challenge: {
    id: 'm3l01c1',
    title: 'Catálogo de produtos com List',
    fileName: 'Main.java',
    prompt: 'Implemente um pequeno catálogo de produtos em Java 21. Crie a classe `Produto` com os atributos `nome` (String) e `preco` (double), com construtor e getters. Em seguida, crie a classe `Main` com uma lista `List<Produto>` e os métodos: `adicionar(String nome, double preco)` que insere um novo produto no final; `removerPorNome(String nome)` que devolve `true` se removeu e `false` se o nome não existir; e `listar()` que imprime os produtos numerados de 1 a N no formato `1. Teclado mecanico - R$ 250.0`, tratando o caso de lista vazia com a mensagem `Catalogo vazio.`. No `main`, adicione 3 produtos, liste, remova um pelo nome (imprima `Removido com sucesso.` ou `Produto nao encontrado.` conforme o retorno booleano), liste de novo e imprima o total de itens com `size()`.',
    starterCode: `import java.util.ArrayList;
import java.util.List;

public class Main {
    // 1. Declare a classe Produto com nome e preco (atributos, construtor, getters)

    // 2. Declare a lista do catalogo: List<Produto> catalogo = new ArrayList<>();

    // 3. Implemente adicionar(String nome, double preco)

    // 4. Implemente boolean removerPorNome(String nome) usando indexOf

    // 5. Implemente listar() com numeracao e tratamento de lista vazia

    public static void main(String[] args) {
        // 6. Adicione 3 produtos, liste, remova um, liste de novo e imprima o total
    }
}`,
    criteria: [
      'A classe Produto possui os atributos nome e preco, um construtor de dois parâmetros e os métodos getNome() e getPreco()',
      'O catálogo é declarado como `List<Produto>` instanciado com `new ArrayList<>()` (interface à esquerda, implementação à direita)',
      'O método removerPorNome usa indexOf e só chama remove(posicao) quando a posição retornada for maior ou igual a zero, devolvendo boolean',
      'O método listar imprime cada produto numerado de 1 a N usando size() e get(i) no formato exigido e exibe `Catalogo vazio.` quando a lista está vazia',
      'O main demonstra na ordem: adicionar 3 produtos, listar, remover um pelo nome imprimindo a mensagem conforme o retorno booleano, listar de novo e imprimir o total com size()',
      'O programa não usa coleções que ainda não foram vistas (Set, Map), lambdas, streams nem recursos de aulas futuras',
    ],
    modelSolution: [
      { t: 'p', text: 'Uma solução completa está abaixo. Repare em três detalhes que separam um código amador de um código profissional: o catálogo é do tipo da **interface** `List`; a remoção **consulta a posição antes de remover** (evitando `IndexOutOfBoundsException`); e `listar` trata a **lista vazia** antes de entrar no laço.' },
      { t: 'code', lang: 'java', caption: 'Main.java', code: `import java.util.ArrayList;
import java.util.List;

class Produto {
    private String nome;
    private double preco;

    public Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }
}

public class Main {
    private static List<Produto> catalogo = new ArrayList<>();

    public static void adicionar(String nome, double preco) {
        catalogo.add(new Produto(nome, preco));
    }

    public static boolean removerPorNome(String nome) {
        // indexOf() compararia o objeto inteiro com equals; como ainda nao
        // sobrescrevemos equals, percorremos comparando o nome diretamente.
        for (int i = 0; i < catalogo.size(); i++) {
            if (catalogo.get(i).getNome().equals(nome)) {
                catalogo.remove(i);
                return true;
            }
        }
        return false;
    }

    public static void listar() {
        if (catalogo.isEmpty()) {
            System.out.println("Catalogo vazio.");
            return;
        }
        for (int i = 0; i < catalogo.size(); i++) {
            Produto p = catalogo.get(i);
            System.out.println((i + 1) + ". " + p.getNome() + " - R$ " + p.getPreco());
        }
    }

    public static void main(String[] args) {
        adicionar("Teclado mecanico", 250.0);
        adicionar("Mouse wireless", 80.0);
        adicionar("Monitor 24", 950.0);

        listar();

        if (removerPorNome("Mouse wireless")) {
            System.out.println("Removido com sucesso.");
        } else {
            System.out.println("Produto nao encontrado.");
        }

        listar();
        System.out.println("Total de itens: " + catalogo.size());
    }
}` },
      { t: 'p', text: 'A saída esperada é a lista numerada com os 3 produtos, a mensagem `Removido com sucesso.`, a lista com 2 produtos e `Total de itens: 2`. Note que `removerPorNome` percorre a lista comparando o **nome** com `equals` e chama `catalogo.remove(i)` imediatamente seguido de `return` — remover e retornar na mesma iteração evita deslocar índices e continuar percorrendo uma lista que mudou. Se você preferiu usar `indexOf` com um `Produto` novo, lembre-se de que isso só funciona depois que a aula 4 e o próprio módulo 2 mostrarem a importância de sobrescrever `equals`: sem isso, a comparação é por referência e o produto nunca é encontrado.' },
    ],
  },
}
