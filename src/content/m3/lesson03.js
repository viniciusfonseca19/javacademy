export default {
  id: 'm3l03',
  moduleId: 'm3',
  number: 3,
  title: 'Map e HashMap: pares chave-valor',
  durationMinutes: 22,

  objectives: [
    'Explicar a diferença entre a hierarquia Collection e a interface Map',
    'Armazenar e recuperar valores com put, get, containsKey e remove',
    'Interpretar o valor devolvido por put e o comportamento de chave duplicada',
    'Percorrer um Map com keySet, values e entrySet',
    'Modelar um controle de estoque por chave com HashMap',
  ],

  prerequisites: [
    'Ter concluído as aulas anteriores sobre List e Set',
    'Saber o que é uma interface e uma classe que a implementa (módulo 2)',
    'Entender o papel de equals e hashCode na igualdade de objetos (aula 2 deste módulo)',
    'Conseguir percorrer coleções com laço for e for-each',
  ],

  intro: [
    { t: 'p', text: 'Consultar o estoque de um produto pelo SKU, achar o usuário pelo e-mail, recuperar a configuração de uma chave de sistema: em todos esses casos você tem um **índice de negócio** e um **valor**. Guardar isso em uma `List` obriga a percorrer a estrutura inteira, comparando elemento por elemento a cada consulta — e a busca fica mais lenta conforme a lista cresce.' },
    { t: 'p', text: 'A estrutura feita para esse formato de dado é o **`Map`**: uma coleção de pares **chave-valor**, onde cada chave é única e aponta para um valor. A implementação padrão, o **`HashMap`**, localiza o valor pelo *hash* da chave — a mesma ideia de desempenho do `HashSet` que você viu na aula anterior, agora aplicada a chaves.' },
    { t: 'p', text: 'Nesta aula você vai entender por que o `Map` fica **fora** da hierarquia `Collection`, usar os métodos essenciais (`put`, `get`, `containsKey`, `remove`), aprender o que o retorno do `put` revela, percorrer as três visões do mapa (`keySet`, `values`, `entrySet`) e montar um **controle de estoque por SKU** — o cenário real do projeto de usuários e produtos deste módulo.' },
    { t: 'note', kind: 'tip', title: 'Chave e valor: papéis fixos', text: 'Pense no mapa telefônico: o **nome** é a chave (único, usado para buscar) e o **número** é o valor (o que você quer). Em Java, `Map<K, V>`: `K` de *key* (chave) e `V` de *value* (valor). As letras entre `<` e `>` são o tema da aula 4.' },
  ],

  theory: [
    { t: 'h2', text: 'Map: um modelo de dado fora da hierarquia Collection' },
    { t: 'p', text: 'O `Collection` agrupa `List` e `Set`: estruturas que guardam **elementos soltos**, um por vez. O `Map` guarda **pares estruturados**: um objeto desempenha o papel de chave e outro o de valor, ligados por um vínculo. Por isso `Map` **não** é subtipo de `Collection` — ele tem métodos próprios (`put`, `get`) e não recebe os métodos de coleção simples, como `add`.' },
    { t: 'table', headers: ['Estrutura', 'O que guarda', 'Acesso principal', 'Repetição'], rows: [
      ['`List`', 'Elementos soltos com posição', 'Por índice: `get(i)`', 'Permitida'],
      ['`Set`', 'Elementos soltos sem posição', 'Busca por presença: `contains`', 'Proibida'],
      ['`Map`', 'Pares **chave-valor**', 'Pela chave: `get(chave)`', 'Valores podem repetir; **chaves não**'],
    ] },
    { t: 'p', text: 'As regras do contrato `Map` são objetivas: **cada chave aparece no máximo uma vez** (se você `put` uma chave que já existe, o valor é substituído) e **valores podem se repetir livremente** (dois produtos podem ter a mesma quantidade em estoque). Não há ordem garantida no `HashMap`, e a chave é sempre usada como referência de busca — nunca percorra o mapa inteiro procurando uma chave quando pode chamá-la diretamente.' },
    { t: 'p', text: 'Os exemplos a partir de agora usam o **estoque por SKU** do sistema de gerenciamento: cada chave é o código único do produto (`"SKU-100"`) e cada valor é a quantidade disponível (`15`). É o formato exato de "dado indexado" que você encontrará o tempo todo em sistemas reais, inclusive nos repositórios de dados dos módulos mais avançados.' },

    { t: 'h2', text: 'HashMap na prática: put e get' },
    { t: 'code', lang: 'java', caption: 'EstoqueSimples.java', code: `import java.util.HashMap;
import java.util.Map;

public class EstoqueSimples {
    public static void main(String[] args) {
        Map<String, Integer> estoque = new HashMap<>();

        estoque.put("SKU-100", 15);
        estoque.put("SKU-200", 40);
        estoque.put("SKU-100", 18);

        System.out.println(estoque.get("SKU-100"));         // 18
        System.out.println(estoque.get("SKU-999"));         // null
        System.out.println(estoque.containsKey("SKU-200")); // true
        System.out.println(estoque.size());                 // 2
    }
}` },
    { t: 'p', text: 'Analise as linhas-chave. A declaração `Map<String, Integer> estoque = new HashMap<>();` segue a regra de programar para a interface: `Map` descreve o contrato, `HashMap` executa. O primeiro `put("SKU-100", 15)` **insere** o par; o terceiro `put("SKU-100", 18)` usa a **mesma chave**, então **substitui** o valor — o estoque não tem dois SKUs-100, tem um com quantidade 18. `get("SKU-100")` devolve `18`, o valor atual. Já `get("SKU-999")` devolve **`null`**: chave inexistente não é erro, é ausência — e é exatamente esse `null` que gera o `NullPointerException` mais comum de quem esquece de checar. `containsKey` responde "a chave existe?", `size()` conta **chaves** (2), não pares repetidos.' },
    { t: 'note', kind: 'warn', title: 'Desempacotar o que pode ser null', text: '`int q = estoque.get("SKU-999");` quebra com `NullPointerException` na conversão automática de `null` para `int`. Antes de usar o resultado numericamente, confirme com `containsKey` ou use `getOrDefault(chave, padrao)` — que devolve o padrão quando a chave não existe.' },

    { t: 'h2', text: 'Os métodos essenciais de Map' },
    { t: 'table', headers: ['Método', 'O que faz', 'Retorno'], rows: [
      ['`put(chave, valor)`', 'Insere; se a chave existir, **substitui** o valor', 'o valor **anterior** ou `null` se era nova'],
      ['`get(chave)`', 'Lê o valor da chave', 'o valor ou `null`'],
      ['`getOrDefault(chave, padrao)`', 'Lê, devolvendo o padrão se a chave não existir', 'o valor ou o padrão'],
      ['`containsKey(chave)` / `containsValue(valor)`', 'Testa existência de chave / valor', '`boolean`'],
      ['`remove(chave)`', 'Remove o par inteiro', 'o valor removido ou `null`'],
      ['`size()` / `isEmpty()` / `clear()`', 'Quantidade de pares / teste / esvaziar', '`int` / `boolean` / `void`'],
      ['`keySet()`', 'Visão com todas as chaves (um `Set`)', '`Set<K>`'],
      ['`values()`', 'Visão com todos os valores (uma `Collection`)', '`Collection<V>`'],
      ['`entrySet()`', 'Visão com os pares `Map.Entry<K, V>`', '`Set<Entry<K, V>>`'],
    ] },
    { t: 'p', text: 'Duas linhas da tabela merecem destaque. `put` **devolve o valor anterior** — informação rica para quem atualiza dados (mostrar o "antes" de uma alteração, detectar a primeira vez que uma chave aparece). E `getOrDefault` elimina o padrão repetido de `containsKey` + `get` em operações de leitura com fallback: uma linha no lugar de três.' },
    { t: 'code', lang: 'java', caption: 'AtualizacaoDeEstoque.java', code: `import java.util.HashMap;
import java.util.Map;

public class AtualizacaoDeEstoque {
    public static void main(String[] args) {
        Map<String, Integer> estoque = new HashMap<>();
        estoque.put("SKU-100", 15);

        Integer anterior = estoque.put("SKU-100", 20);
        System.out.println("Anterior: " + anterior);              // Anterior: 15
        System.out.println("Atual: " + estoque.get("SKU-100"));   // Atual: 20

        estoque.put("SKU-300", 0);
        System.out.println(estoque.get("SKU-300"));   // 0
        System.out.println(estoque.get("SKU-400"));   // null
    }
}` },
    { t: 'p', text: 'A linha `Integer anterior = estoque.put("SKU-100", 20);` guarda o valor que a chave tinha antes da atualização (`15`) — o `put` devolve o antigo e grava o novo. A última comparação é de leitura de negócio: `get("SKU-300")` devolve `0` porque **a chave existe com valor zero**, enquanto `get("SKU-400")` devolve `null` porque **a chave não existe**. Em estoque, essa diferença importa: zero é produto cadastrado e esgotado; `null` é produto desconhecido. Guardar essa distinção evita tratar "esgotado" como "inexistente".' },

    { t: 'h2', text: 'Percorrendo um Map: keySet, values e entrySet' },
    { t: 'p', text: 'O `Map` não é um `Collection`, mas expõe três **visões** sobre si mesmo que permitem percorrê-lo. `keySet()` devolve as chaves (um `Set`, inclusive), `values()` devolve só os valores, e `entrySet()` devolve os **pares completos**. A escolha depende do que você precisa dentro do laço.' },
    { t: 'code', lang: 'java', caption: 'PercorrendoMap.java', code: `import java.util.HashMap;
import java.util.Map;

public class PercorrendoMap {
    public static void main(String[] args) {
        Map<String, Integer> estoque = new HashMap<>();
        estoque.put("SKU-100", 15);
        estoque.put("SKU-200", 40);
        estoque.put("SKU-300", 7);

        for (String sku : estoque.keySet()) {
            System.out.println("Chave: " + sku);
        }

        int soma = 0;
        for (int quantidade : estoque.values()) {
            soma = soma + quantidade;
        }
        System.out.println("Total de unidades: " + soma);   // 62

        for (Map.Entry<String, Integer> par : estoque.entrySet()) {
            System.out.println(par.getKey() + " -> " + par.getValue());
        }
    }
}` },
    { t: 'p', text: 'O primeiro laço varre `estoque.keySet()` e imprime só as chaves — cada volta devolve um `String`. O segundo varre `estoque.values()` e soma as quantidades: `15 + 40 + 7 = 62`, impresso como total de unidades em estoque. O terceiro é o mais completo: `estoque.entrySet()` devolve um conjunto de objetos `Map.Entry<String, Integer>`, e cada `par` oferece `getKey()` e `getValue()`. Quando o laço precisa **tanto da chave quanto do valor**, `entrySet` é a melhor escolha: você acessa os dois com uma única consulta, sem chamar `get(chave)` (que faria uma busca extra por iteração). Em ordem de preferência: `entrySet` para pares, `keySet` para chaves e `values()` para somas e agregações.' },

    { t: 'h2', text: 'Regras do HashMap: chaves, valores e ordem' },
    { t: 'ul', items: [
      '**Chave única**: repetir a chave no `put` substitui o valor anterior; nunca há duas entradas com a mesma chave.',
      '**Uma chave `null` no máximo**: o `HashMap` aceita `null` como chave (uma única) e também como valor, mas isso é raríssimo em sistemas bem modelados.',
      '**Sem ordem garantida**: a sequência de `keySet()`/`entrySet()` segue o cálculo de dispersão e pode mudar; para ordenar, veja o aviso abaixo.',
      '**Desempenho próximo do constante**: `put`, `get`, `containsKey` e `remove` são, em média, rápidos mesmo com milhões de entradas.',
      '**Chaves são objetos**: ao usar uma classe própria como chave, vale a mesma regra da aula 2 — sobrescreva `equals` **e** `hashCode` com os campos de identidade.',
    ] },
    { t: 'note', kind: 'info', title: 'Quando a ordem da chave importa', text: 'Para listar as chaves em ordem alfabética, copie-as para uma lista e ordene: `List<String> chaves = new ArrayList<>(estoque.keySet()); Collections.sort(chaves);` (os imports são `java.util.ArrayList` e `java.util.Collections`). Se a ordem de inserção fosse sempre necessária, a implementação seria `LinkedHashMap`; para ordenação automática por chave, `TreeMap`. No dia a dia, o `HashMap` é o padrão.' },

    { t: 'h2', text: 'Caso realista: um controle de estoque por SKU' },
    { t: 'p', text: 'Vamos montar a classe que o sistema de produtos usa de verdade: um estoque endereçado por SKU, com entrada de mercadoria (somando ao saldo), saída (validando disponibilidade) e listagem dos pares. Repare no uso de `getOrDefault` para somar sem erro quando a chave ainda não existe, e na remoção automática de SKUs que chegam a zero.' },
    { t: 'code', lang: 'java', caption: 'ControleEstoque.java', code: `import java.util.HashMap;
import java.util.Map;

public class ControleEstoque {
    private Map<String, Integer> porSku = new HashMap<>();

    public void adicionar(String sku, int quantidade) {
        porSku.put(sku, quantidade);
    }

    public void darEntrada(String sku, int quantidade) {
        int atual = porSku.getOrDefault(sku, 0);
        porSku.put(sku, atual + quantidade);
    }

    public boolean darSaida(String sku, int quantidade) {
        int atual = porSku.getOrDefault(sku, 0);
        if (atual < quantidade) {
            return false;
        }
        int restante = atual - quantidade;
        if (restante == 0) {
            porSku.remove(sku);
        } else {
            porSku.put(sku, restante);
        }
        return true;
    }

    public void listar() {
        for (Map.Entry<String, Integer> par : porSku.entrySet()) {
            System.out.println(par.getKey() + ": " + par.getValue());
        }
    }
}` },
    { t: 'p', text: 'Leia os métodos em cadeia. `adicionar` é o `put` direto: define o saldo inicial do SKU. `darEntrada` usa `getOrDefault(sku, 0)` — se o SKU ainda não está no mapa, começa de zero — e grava a soma, **acumulando** em vez de substituir (a diferença sutil que separa "entrada de mercadoria" de "apagar o valor antigo"). `darSaida` primeiro testa `atual < quantidade` e devolve `false` quando não há saldo: sem SKU ou sem quantidade suficiente, nada muda. Só depois calcula o restante — e se chegou a zero, **remove** a chave, mantendo o mapa enxuto (SKU sem estoque não precisa ocupar entrada). `listar` percorre `entrySet()` e imprime `chave: valor`, o formato natural de um relatório de estoque.' },
  ],

  commonMistakes: [
    { title: 'Achar que put soma ao valor existente', text: '`put` **substitui** o valor da chave. Em operações de acumulação é preciso ler o valor atual (`get` ou `getOrDefault`) e gravar a soma: `estoque.put(sku, estoque.getOrDefault(sku, 0) + quantidade)`. Esquecer a leitura zera o histórico da chave a cada nova entrada.' },
    { title: 'Usar o resultado de get sem checar null', text: '`get` de chave inexistente devolve `null`, e a conversão automática para `int` explode com `NullPointerException`. Trate antes: `containsKey`, `getOrDefault(chave, padrao)` ou um `if (valor != null)` — principalmente quando a chave pode não existir (consulta de produto digitado pelo usuário).' },
    { title: 'Percorrer com get() dentro do keySet', text: 'Escrever `for (String sku : mapa.keySet()) { int q = mapa.get(sku); }` faz uma **busca extra a cada iteração**. Quando o laço precisa do valor, percorra `entrySet()` e use `par.getKey()`/`par.getValue()`: mesma informação, sem custo adicional de procura.' },
    { title: 'Esperar ordem do HashMap', text: 'O `HashMap` não mantém a ordem de inserção nem ordem alfabética; varrer e imprimir em sequência "parecida" na sua máquina é coincidência. Para relatório ordenado, copie as chaves para uma `List` e use `Collections.sort`, ou use `LinkedHashMap` se a ordem de cadastro for a exigência.' },
    { title: 'Usar Map quando a pergunta é de lista', text: 'Se o dado é "uma sequência de itens com posição", a `List` é a estrutura certa — transformar a lista em mapa de índice para item só complica o código. `Map` resolve quando existe **chave de negócio** (SKU, e-mail, id) usada para buscar; sem essa chave, não há motivo para o mapa.' },
  ],

  bestPractices: [
    { title: 'Declare como Map, instancie como HashMap', text: '`Map<String, Integer> estoque = new HashMap<>();` documenta a intenção (pares chave-valor) e deixa a implementação trocável sem alterar os métodos que já usam a variável.' },
    { title: 'Prefira getOrDefault para leitura com padrão', text: '`getOrDefault(chave, 0)` substitui o par `containsKey` + `get` em operações de soma e fallback, produz código mais curto e elimina o risco de esquecer a checagem de `null`.' },
    { title: 'Use entrySet quando precisar de chave e valor', text: 'É a visão mais eficiente para relatórios e laços de negócio: cada iteração entrega o par completo sem consultas adicionais ao mapa. `keySet` e `values()` ficam para quando uma metade basta.' },
    { title: 'Modele chaves com identidade de negócio', text: 'String de SKU, e-mail normalizado, id numérico: chaves devem ser **únicas por regra de negócio** e estáveis (não mudam ao longo do tempo). Se for usar uma classe própria como chave, sobrescreva `equals` e `hashCode` — a aula 2 mostrou o porquê.' },
    { title: 'Mantenha o mapa coerente com o domínio', text: 'Remover a chave quando o saldo zera, atualizar valores em vez de acumular por engano e distinguir `null` (inexistente) de zero (esgotado) mantêm o dado confiável para quem consome o mapa depois — relatórios e telas agradecem.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      '`Map` guarda **pares chave-valor**, fica **fora** da hierarquia `Collection` e não tem `add`: a operação de escrita é `put`.',
      'Regras do contrato: chave **única** (repetir no `put` substitui o valor) e valor livre para repetir; sem ordem garantida no `HashMap`.',
      '`get(chave)` devolve o valor ou **`null`**; `getOrDefault(chave, padrao)` devolve o padrão; `containsKey` responde pela existência.',
      '`put` devolve o **valor anterior** — informação útil para auditoria e atualização.',
      'Três visões de percurso: `keySet` (chaves), `values` (valores) e `entrySet` (**pares** — a melhor escolha quando o laço precisa dos dois).',
      '`size()` conta chaves; distinguir valor `0` (chave existente) de `null` (chave ausente) evita erros de negócio.',
      'Chaves próprias exigem `equals` e `hashCode` sobrescritos, como em `Set`.',
      'Caso real: o `ControleEstoque` usa `getOrDefault` para somar entradas, valida saídas e remove SKUs zerados — padrão que você reutilizará no projeto.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Nas três últimas aulas você usou `<String, Integer>` sem entender a sintaxe. Na aula seguinte, **generics**: como o compilador garante o tipo de cada coleção e o que acontece quando você tenta colocar o tipo errado.' },
  ],

  exercises: [
    {
      id: 'm3l03e1',
      type: 'mc',
      question: 'Um sistema precisa recuperar a quantidade em estoque de um produto a partir do seu SKU, sem varrer toda a estrutura. Qual é a escolha natural?',
      options: ['`List<Integer>` percorrida com for-each', '`Set<String>`', '`Map<String, Integer>` com `HashMap`', '`ArrayList<String>` com `indexOf`'],
      answer: 2,
      explanation: 'O dado tem **chave de negócio** (SKU) e **valor** (quantidade) — é a definição de `Map`, cujo `get(sku)` resolve a consulta em tempo praticamente constante. `List<Integer>` não saberia a qual produto cada número pertence e exigiria busca linear; `Set` não guarda pares; `ArrayList<String>` com `indexOf` repetiria o problema da lista com um passo a mais.',
    },
    {
      id: 'm3l03e2',
      type: 'code',
      question: 'Analise o trecho. Qual saída a linha final imprime?',
      code: 'Map<String, Integer> mapa = new HashMap<>();\nmapa.put("a", 1);\nmapa.put("a", 2);\nSystem.out.println(mapa.get("a") + " | " + mapa.size());',
      lang: 'java',
      options: ['1 | 1', '2 | 1', '2 | 2', '1 | 2'],
      answer: 1,
      explanation: 'O segundo `put` usa a **mesma chave** `"a"`, então **substitui** o valor: `get("a")` devolve `2`. Como continua havendo uma única chave, `size()` é `1` — o mapa conta pares distintos, não chamadas ao `put`. A saída é `2 | 1`. Se fosse `2 | 2`, estaríamos supondo que o `put` acrescenta uma nova entrada com a chave repetida, o que o contrato de `Map` proíbe.',
    },
    {
      id: 'm3l03e3',
      type: 'tf',
      question: 'Em um `HashMap`, é possível ter duas entradas com a mesma chave desde que os valores sejam diferentes.',
      answer: false,
      explanation: 'A chave é **única** por contrato: chamar `put` com uma chave já existente **substitui** o valor antigo e devolve o valor anterior. Dois pares com chave igual nunca coexistem — é justamente isso que permite buscar em O(1) sem percorrer o mapa. Valores podem repetir à vontade; chaves, não.',
    },
    {
      id: 'm3l03e4',
      type: 'short',
      question: 'Por que `estoque.get("SKU-999")` pode devolver `null`, e o que o programador deve fazer antes de usar esse resultado em uma conta aritmética?',
      keywords: [
        ['nao existe', 'não existe', 'ausente', 'chave', 'containskey'],
        ['null'],
        ['verific', 'getordefault', 'padrao', 'padrão'],
      ],
      answerText: 'get devolve null porque a chave SKU-999 não existe no mapa; antes de usar o resultado em conta, verifique com containsKey, trate o caso null ou use getOrDefault com um valor padrão, evitando NullPointerException na conversão para int.',
      explanation: 'Ao contrário de `List.get` (que lança exceção para índice inválido), `Map.get` de chave ausente devolve `null` — é ausência de dado, não erro. O perigo surge na linha seguinte: `int q = mapa.get(chave);` tenta converter `null` para `int` e a JVM lança `NullPointerException`. As defesas são `containsKey` antes, `if (valor != null)` depois ou `getOrDefault(chave, 0)` desde o começo.',
    },
    {
      id: 'm3l03e5',
      type: 'mc',
      question: 'Dentro de um laço que precisa imprimir o SKU **e** a quantidade de cada produto, qual visão do `Map` é a mais eficiente?',
      options: ['`keySet()` somada a chamadas de `get(chave)`', '`values()`', '`entrySet()`', '`clear()`'],
      answer: 2,
      explanation: 'O `entrySet()` devolve objetos `Map.Entry<K, V>` com `getKey()` e `getValue()` prontos: **uma única consulta** por iteração entrega os dois dados. Varrer `keySet()` e chamar `get` a cada volta faz uma busca extra por elemento — mesmo resultado, mais trabalho. `values()` não traz as chaves, e `clear()` apenas esvazia o mapa.',
    },
  ],

  challenge: {
    id: 'm3l03c1',
    title: 'Controle de estoque por SKU',
    fileName: 'Estoque.java',
    prompt: 'Implemente um controle de estoque em Java 21 no arquivo `Estoque.java`, contendo a classe `Estoque` com um método `main`. Use `Map<String, Integer>` (SKU -> quantidade) e crie os métodos: `adicionar(String sku, int quantidade)` que define o saldo inicial; `consultar(String sku)` que devolve a quantidade ou `0` se o SKU não existir; `darEntrada(String sku, int quantidade)` que **soma** ao saldo atual (usando `getOrDefault`); `darSaida(String sku, int quantidade)` que devolve `false` e não altera nada se não houver saldo suficiente, e ao zerar o saldo **remove** a chave do mapa; e `listar()` que imprime cada par no formato `SKU-100: 15` percorrendo `entrySet()`. No `main`, cadastre 3 SKUs, dê entrada em um, dê saída em outro (e tente uma saída maior que o saldo, imprimindo `Saldo insuficiente.`), liste o resultado e imprima o total de SKUs com `size()`.',
    starterCode: `import java.util.HashMap;
import java.util.Map;

public class Estoque {
    private Map<String, Integer> porSku = new HashMap<>();

    // 1. adicionar(String sku, int quantidade) -> put direto

    // 2. consultar(String sku) -> getOrDefault(sku, 0)

    // 3. darEntrada(String sku, int quantidade) -> soma ao saldo atual

    // 4. darSaida(String sku, int quantidade) -> boolean;
    //    sem saldo devolve false; ao zerar, remove a chave

    // 5. listar() -> percorre entrySet e imprime "chave: valor"

    public static void main(String[] args) {
        // 6. Monte o cenario do enunciado e imprima as mensagens pedidas
    }
}`,
    criteria: [
      'O mapa é declarado como `Map<String, Integer>` instanciado com `new HashMap<>()` (interface à esquerda)',
      'O método `darEntrada` usa `getOrDefault(sku, 0)` (ou equivalente com `containsKey`) para **somar** ao saldo existente, sem substituir o valor por zero',
      'O método `darSaida` compara o saldo antes de decrementar, devolve `false` sem alterar o mapa quando o saldo é insuficiente e usa `remove(sku)` quando o resultado fica zero',
      'O método `listar` percorre `entrySet()` e imprime no formato `SKU-100: 15` usando `getKey()` e `getValue()`',
      'O `main` demonstra: 3 SKUs cadastrados, entrada em um SKU, saída válida em outro, tentativa de saída acima do saldo imprimindo `Saldo insuficiente.`, listagem e contagem final com `size()`',
      'Não usa coleções de aulas futuras (Set como estrutura principal), lambdas, streams nem busca linear por listas no lugar do `get`',
    ],
    modelSolution: [
      { t: 'p', text: 'Abaixo, a solução completa. Os três pontos que merecem atenção: a **soma** em `darEntrada` (nunca um `put` puro), a **validação antes da baixa** em `darSaida` e a **remoção do SKU zerado**, que mantém o mapa apenas com produtos que têm saldo.' },
      { t: 'code', lang: 'java', caption: 'Estoque.java', code: `import java.util.HashMap;
import java.util.Map;

public class Estoque {
    private Map<String, Integer> porSku = new HashMap<>();

    public void adicionar(String sku, int quantidade) {
        porSku.put(sku, quantidade);
    }

    public int consultar(String sku) {
        return porSku.getOrDefault(sku, 0);
    }

    public void darEntrada(String sku, int quantidade) {
        int atual = porSku.getOrDefault(sku, 0);
        porSku.put(sku, atual + quantidade);
    }

    public boolean darSaida(String sku, int quantidade) {
        int atual = porSku.getOrDefault(sku, 0);
        if (atual < quantidade) {
            return false;
        }
        int restante = atual - quantidade;
        if (restante == 0) {
            porSku.remove(sku);
        } else {
            porSku.put(sku, restante);
        }
        return true;
    }

    public void listar() {
        for (Map.Entry<String, Integer> par : porSku.entrySet()) {
            System.out.println(par.getKey() + ": " + par.getValue());
        }
    }

    public int consultarTotal() {
        return porSku.size();
    }

    public static void main(String[] args) {
        Estoque estoque = new Estoque();
        estoque.adicionar("SKU-100", 15);
        estoque.adicionar("SKU-200", 40);
        estoque.adicionar("SKU-300", 7);

        estoque.darEntrada("SKU-100", 5);
        System.out.println("Entrada registrada. Novo saldo SKU-100: "
                + estoque.consultar("SKU-100"));   // 20

        if (estoque.darSaida("SKU-200", 10)) {
            System.out.println("Saida registrada.");
        }

        if (!estoque.darSaida("SKU-300", 100)) {
            System.out.println("Saldo insuficiente.");
        }

        estoque.listar();
        System.out.println("SKUs em estoque: " + estoque.consultarTotal());
    }
}` },
      { t: 'p', text: 'No `main`, a entrada soma `5` ao saldo de 15 (resultado 20 — prova de que `darEntrada` **acumula**); a saída de 10 no SKU-200 devolve `true` e imprime a confirmação; a tentativa de sair de 100 com saldo 7 devolve `false` e imprime `Saldo insuficiente.` **sem tocar no mapa**. A listagem percorre `entrySet()` e mostra os pares. Para o total de SKUs, repare no método `consultarTotal()`, que devolve `porSku.size()` — a quantidade de chaves do próprio mapa. Se você preferiu imprimir `porSku.size()` direto no `main`, também está correto: o critério é o valor ser obtido do mapa, não de um contador paralelo.' },
    ],
  },
}
