export default {
  id: 'm3l02',
  moduleId: 'm3',
  number: 2,
  title: 'Set e HashSet: elementos sem repetição',
  durationMinutes: 20,

  objectives: [
    'Explicar o contrato da interface Set e como ele difere de List',
    'Criar conjuntos com HashSet e interpretar o retorno booleano do add',
    'Percorrer e consultar um conjunto com contains, remove e for-each',
    'Explicar o papel de equals e hashCode na detecção de duplicatas',
    'Aplicar Set para garantir dados únicos, como e-mails de usuários',
  ],

  prerequisites: [
    'Ter concluído a aula anterior sobre Collections Framework e a interface List',
    'Saber declarar e percorrer uma lista com laço for e for-each',
    'Conhecer a sobrescrita de métodos com @Override (módulo 2)',
    'Entender o que a comparação com equals faz em objetos (módulo 2)',
  ],

  intro: [
    { t: 'p', text: 'Imagine o formulário de cadastro de uma loja: o usuário digita o mesmo e-mail duas vezes, com espaços e maiúsculas misturadas (`Ana@Loja.COM ` e `ana@loja.com`). Se o sistema aceitar tudo, você terá **contas duplicadas, e-mails de notificação enviados em dobro e relatórios errados**. Impedir isso tarde demais (consultando o banco depois de salvar) custa caro: o dado sujo já entrou.' },
    { t: 'p', text: 'A estrutura certa resolve o problema **na origem**: enquanto os dados são inseridos, a coleção recusa o que já existe. É exatamente o que faz a interface **`Set`** — e sua implementação mais usada, o **`HashSet`**. Em vez de você escrever `if (!lista.contains(email)) lista.add(email)` em toda parte, a própria coleção executa essa verificação em tempo de inserção.' },
    { t: 'p', text: 'Nesta aula você vai entender o contrato de `Set` (sem repetição, sem posição), usar o `HashSet` no dia a dia, interpretar o retorno `boolean` do `add` — uma informação que a maioria dos iniciantes descarta — e descobrir **como o HashSet sabe que dois objetos são "iguais"**: aí moram `equals` e `hashCode`, os dois métodos que decidem o que é duplicata.' },
    { t: 'note', kind: 'tip', title: 'Conjunto na matemática', text: 'Um conjunto matemático não tem ordem e não repete elemento: {A, B, A} = {A, B}. O `Set` do Java segue a mesma ideia, com uma diferença prática: ele guarda **objetos** e usa `equals`/`hashCode` para decidir o que é repetição — detalhe que veremos na última parte da aula.' },
  ],

  theory: [
    { t: 'h2', text: 'O contrato da interface Set' },
    { t: 'p', text: 'A interface `Set` descreve uma coleção que **recusa elementos repetidos**. Se você chamar `add` com um elemento já existente, nada muda: a coleção mantém o tamanho e o elemento original. Ao contrário de `List`, o `Set` **não tem posição** — não existe `get(1)`, `indexOf` ou "primeiro elemento": você pensa em conjunto, não em fila.' },
    { t: 'table', headers: ['Característica', 'List', 'Set'], rows: [
      ['Repetição', 'Permitida', 'Proibida: cada valor aparece no máximo uma vez'],
      ['Posição/índice', 'Sim: `get(i)`, `indexOf`', 'Não: não há ordem nem índice garantidos'],
      ['Método para ler', '`get(indice)`', 'Só a percorrer: `for-each` (ou iterator)'],
      ['Busca de presença', '`contains(objeto)`', '`contains(objeto)`'],
      ['Caso típico', 'Catálogo, fila, histórico', 'E-mails, CPFs, SKUs, tags, permissões'],
    ] },
    { t: 'p', text: 'A escolha é semântica: use `List` quando a **ordem importa** e repetição faz sentido (itens de um pedido podem repetir); use `Set` quando a pergunta é "**existe ou não existe?**" e valores repetidos seriam um bug. Guardar os e-mails dos usuários em um `List` permitiria duplicatas; guardá-los em um `Set` as impede em todas as camadas do programa.' },

    { t: 'h2', text: 'HashSet: a implementação do dia a dia' },
    { t: 'p', text: 'O `HashSet` guarda cada elemento em uma estrutura de **tabela de dispersão** (*hash table*): cada objeto recebe um número (o seu `hashCode`) que indica em qual "gaveta" ele entra. Como o endereço é calculado em tempo de inserção, `add`, `contains` e `remove` são **muito rápidos** — em média constantes, independentemente do tamanho do conjunto. Em troca, o `HashSet` **não garante ordem alguma**: os elementos podem aparecer em qualquer ordem na percorrida, e essa ordem pode mudar conforme o conjunto cresce.' },
    { t: 'note', kind: 'info', title: 'Precisa de ordem? LinkedHashSet', text: 'Se a ordem de inserção importar mas a não-repetição também, use `LinkedHashSet`, que mantém os elementos na ordem em que entraram com o mesmo desempenho do `HashSet`. O `TreeSet`, que mantém **ordem natural** (alfabética/numérica), é útil quando você precisa varrer sempre ordenado — é uma implementação mais pesada que só paga a pena quando a ordenação é exigência real.' },
    { t: 'code', lang: 'java', caption: 'CadastroEmails.java', code: `import java.util.HashSet;
import java.util.Set;

public class CadastroEmails {
    public static void main(String[] args) {
        Set<String> emails = new HashSet<>();

        boolean primeiro = emails.add("ana@exemplo.com");
        boolean segundo = emails.add("ana@exemplo.com");
        boolean terceiro = emails.add("bruno@exemplo.com");

        System.out.println(primeiro);      // true
        System.out.println(segundo);       // false
        System.out.println(terceiro);      // true
        System.out.println(emails.size()); // 2
    }
}` },
    { t: 'p', text: 'Leia o que cada linha revela: na linha `boolean primeiro = emails.add("ana@exemplo.com");`, o e-mail entra e o `add` devolve **`true`** ("inserido"). Na linha seguinte, o mesmo e-mail é enviado de novo: o `HashSet` detecta a repetição, **não insere** e devolve **`false`**. O terceiro `add` devolve `true` porque "bruno@exemplo.com" é novo. Por fim, `emails.size()` é `2`: o conjunto conta **valores distintos**, não tentativas de inserção. É esse retorno `boolean` que transforma o `Set` em um validador de duplicatas — você sabe se o dado era novo ou repetido sem precisar de nenhuma busca extra.' },

    { t: 'h2', text: 'Operações de um conjunto' },
    { t: 'p', text: 'A superfície de um `Set` é menor que a de uma `List` — não existe acesso por índice — mas cobre tudo o que a rotina pede.' },
    { t: 'table', headers: ['Método', 'O que faz', 'Retorno'], rows: [
      ['`add(elemento)`', 'Insere se ainda não existir; ignora a tentativa se existir', '`boolean`: `true` se inseriu'],
      ['`contains(elemento)`', 'Testa pertinência no conjunto', '`boolean`'],
      ['`remove(elemento)`', 'Remove o elemento, se presente', '`boolean`: `true` se removeu'],
      ['`size()` / `isEmpty()`', 'Quantidade de distintos / teste de vazio', '`int` / `boolean`'],
      ['`clear()`', 'Esvazia o conjunto', '`void`'],
      ['`for-each`', 'Percorre todos os elementos (ordem não garantida)', '—'],
    ] },
    { t: 'code', lang: 'java', caption: 'OperacoesDeConjunto.java', code: `import java.util.HashSet;
import java.util.Set;

public class OperacoesDeConjunto {
    public static void main(String[] args) {
        Set<String> tags = new HashSet<>();
        tags.add("promocao");
        tags.add("novo");
        tags.add("promocao");

        System.out.println(tags.contains("novo"));    // true
        System.out.println(tags.contains("gratis"));  // false

        for (String tag : tags) {
            System.out.println("Tag: " + tag);
        }

        tags.remove("novo");
        System.out.println(tags.size());     // 1
        System.out.println(tags.isEmpty());  // false
    }
}` },
    { t: 'p', text: 'Repare que a segunda `tags.add("promocao")` não gera erro nem duplicata: o conjunto permanece com 2 elementos antes do `remove`. O laço `for (String tag : tags)` é a forma correta de percorrer — como não há índice, o for-each é a única opção natural. A ordem das impressões do laço **não** é obrigatoriamente "promocao, novo": o `HashSet` decide a disposição internamente, e por isso você jamais deve depender dela (se depender, é `LinkedHashSet`). Depois do `remove("novo")`, `size()` cai para 1 e `isEmpty()` continua `false` — o conjunto tem um elemento, não está vazio.' },
    { t: 'note', kind: 'warn', title: 'Nada de get(i) em Set', text: 'Tentar `tags.get(0)` não compila: `Set` não declara `get`. Se o seu código pede "o elemento da posição 3", você quer uma `List`. Forçar um `Set` a se comportar como lista obriga a converter para lista a cada percurso e é sinal de escolha errada de estrutura.' },

    { t: 'h2', text: 'Como o HashSet descobre a duplicata: equals e hashCode' },
    { t: 'p', text: 'Até aqui trabalhamos com `String`, e o Java sabe que `"ana@exemplo.com".equals("ana@exemplo.com")` é `true`. Mas e quando o elemento é um **objeto seu**, como um `Produto`? Padrão de objetos diferentes, com os mesmos dados, são referências diferentes na memória — e o `equals` herdado de `Object` compara **referências**. Resultado: o HashSet não enxerga a duplicata.' },
    { t: 'code', lang: 'java', caption: 'ConjuntoSemEquals.java', code: `import java.util.HashSet;
import java.util.Set;

class Produto {
    String sku;
    String nome;

    Produto(String sku, String nome) {
        this.sku = sku;
        this.nome = nome;
    }
}

public class ConjuntoSemEquals {
    public static void main(String[] args) {
        Set<Produto> produtos = new HashSet<>();
        produtos.add(new Produto("SKU-1", "Teclado"));
        produtos.add(new Produto("SKU-1", "Teclado"));

        System.out.println(produtos.size()); // 2: a duplicata passou
    }
}` },
    { t: 'p', text: 'Os dois `new Produto("SKU-1", "Teclado")` criam **objetos distintos**, com endereços de memória diferentes. Como a classe `Produto` não sobrescreveu `equals`, vale o padrão de `Object`: igualdade por referência — e `this == outro` é `false`. O `HashSet` pergunta "esse objeto já existe?" e recebe "não", então aceita os dois. O `size()` imprime `2`, mesmo sendo o mesmo produto duas vezes: **o bug está no seu modelo, não na coleção**.' },
    { t: 'p', text: 'A solução é sobrescrever os dois métodos **juntos**, porque o `HashSet` usa uma dupla de buscas: primeiro calcula o `hashCode` do objeto novo e procura na "gaveta" correspondente; só então compara, dentro da gaveta, com `equals`. Se dois objetos são iguais pelo seu critério de negócio, seus `hashCode` **precisam** ser iguais (caso contrário caem em gavetas diferentes e nunca são comparados) e seus `equals` também precisam devolver `true`. Escrever apenas um dos dois deixa o conjunto inconsistente.' },
    { t: 'code', lang: 'java', caption: 'ConjuntoComEquals.java', code: `import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

class Produto {
    String sku;
    String nome;

    Produto(String sku, String nome) {
        this.sku = sku;
        this.nome = nome;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }
        if (outro == null || getClass() != outro.getClass()) {
            return false;
        }
        Produto outroProduto = (Produto) outro;
        return sku.equals(outroProduto.sku);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sku);
    }
}

public class ConjuntoComEquals {
    public static void main(String[] args) {
        Set<Produto> produtos = new HashSet<>();
        produtos.add(new Produto("SKU-1", "Teclado"));
        produtos.add(new Produto("SKU-1", "Mouse"));

        System.out.println(produtos.size()); // 1
    }
}` },
    { t: 'p', text: 'Os detalhes do `equals`: a linha `if (this == outro)` resolve o caso trivial (mesma referência) com uma comparação barata; `if (outro == null || getClass() != outro.getClass())` recusa `null` e objetos de outras classes; a linha `(Produto) outro` faz o *cast* para o tipo concreto; e `return sku.equals(outroProduto.sku)` aplica o **critério de negócio**: aqui, dois produtos são iguais quando o **SKU** coincide. O `hashCode` correspondente usa `Objects.hash(sku)`, que combina os campos usados no `equals` em um número único. Repare no resultado: o segundo `add` traz o mesmo SKU com outro nome — o HashSet o considera repetido e o descarta, e `size()` imprime `1`. Note também que, nesse critério, o **nome é ignorado**: defina igualdade pelo campo que identifica o produto no sistema e mude o critério só se a regra de negócio mudar.' },
    { t: 'note', kind: 'info', title: 'Regra de ouro', text: 'Sempre que uma classe for usada como elemento de `Set` **ou como chave de `Map`**, sobrescreva `equals` **e** `hashCode` com o mesmo conjunto de campos. Deixar isso para depois é a origem de um dos bugs mais difíceis de caçar: "a duplicata só aparece quando o sistema cresce".' },

    { t: 'h2', text: 'Caso realista: e-mails únicos de usuários' },
    { t: 'p', text: 'Volte ao formulário de cadastro. A defesa contra duplicatas tem duas camadas: **normalizar** a entrada (remover espaços das pontas e padronizar maiúsculas, já que `Ana@X.com` e `ana@x.com` são o mesmo e-mail) e **confiar no `Set`** para recusar repetições. O retorno do `add` informa qual inscrição era duplicata — material perfeito para avisar o usuário ou para métricas.' },
    { t: 'code', lang: 'java', caption: 'InscritosEvento.java', code: `import java.util.LinkedHashSet;
import java.util.Set;

public class InscritosEvento {
    public static void main(String[] args) {
        String[] inscricoes = {
            " Ana@Exemplo.COM ", "ana@exemplo.com", "bruno@exemplo.com", "ANA@exemplo.com"
        };

        Set<String> emails = new LinkedHashSet<>();
        int duplicados = 0;

        for (String bruto : inscricoes) {
            String normalizado = bruto.trim().toLowerCase();
            boolean inserido = emails.add(normalizado);
            if (!inserido) {
                duplicados++;
                System.out.println("Duplicado descartado: " + normalizado);
            }
        }

        System.out.println("Unicos: " + emails.size());   // 2
        System.out.println("Duplicados: " + duplicados);  // 2
        for (String email : emails) {
            System.out.println(" - " + email);
        }
    }
}` },
    { t: 'p', text: 'O laço processa as quatro inscrições: `bruto.trim().toLowerCase()` remove espaços das pontas e converte para minúsculas, produzindo a chave normalizada (`ana@exemplo.com` na primeira e na segunda chamada). Na primeira, `emails.add(...)` devolve `true` e o e-mail entra; na segunda e na quarta, devolve `false`, o `duplicados` é incrementado e a mensagem identifica o que caiu. Ao final, `emails.size()` é `2` (Ana e Bruno) e `duplicados` é `2` — os dados sujos nem chegaram ao restante do sistema. O uso de `LinkedHashSet` aqui é proposital: como o evento pode precisar da **lista de inscritos na ordem de chegada**, ele combina a garantia de unicidade com a ordem de inserção.' },
  ],

  commonMistakes: [
    { title: 'Esperar ordem de inserção do HashSet', text: 'O `HashSet` não garante nenhuma ordem: os elementos podem sair em qualquer sequência e essa ordem muda conforme o conjunto cresce. Se o seu código depende da ordem (numerar inscritos na chegada, por exemplo), você quer `LinkedHashSet` — nunca confie na disposição atual do `HashSet`.' },
    { title: 'Usar objetos sem equals e hashCode como elementos', text: 'Sem sobrescrever os dois métodos, a igualdade é por referência e cada `new` passa como elemento novo: o `Set` enche de "duplicatas" e ninguém entende por quê. Escreva `equals` e `hashCode` com os **mesmos campos** (no nosso caso, o `sku`) antes de guardar objetos próprios em um conjunto.' },
    { title: 'Descartar o retorno booleano do add', text: 'Escrever apenas `emails.add(email)` perde a informação de que o dado era repetido — o sistema segue como se tudo fosse novo. Quando a regra depende disso ("avisar o usuário", "contar duplicatas"), guarde o retorno: `boolean inserido = emails.add(...)`.' },
    { title: 'Tentar acessar elemento por índice', text: '`Set` não tem `get(i)` nem `indexOf`: a tentativa nem compila. Para ler os elementos use o `for-each`. Se você constantemente sente falta de índice, a estrutura pedida é uma `List`, não um conjunto.' },
    { title: 'Comparar e-mails sem normalizar', text: '`Ana@Loja.COM`, ` ana@loja.com ` e `ana@loja.com` são três `String`s diferentes para o `equals`, apesar de serem o mesmo endereço. Sem `trim().toLowerCase()` antes do `add`, o `Set` guarda as três — e a unicidade vira decoração. Normalize sempre na fronteira de entrada de dados.' },
  ],

  bestPractices: [
    { title: 'Use Set para o que é conjunto de verdade', text: 'Identificadores únicos — e-mail, CPF, SKU, tag, permissão — pertencem a `Set`. A não-repetição passa a ser garantia da estrutura em vez de regra espalhada por `if`s que alguém esquece de escrever.' },
    { title: 'Normalize antes de adicionar', text: 'Aplique `trim()` e `toLowerCase()` (ou a regra do seu domínio) **antes** do `add`. Normalizar depois é tarde: a duplicata já entrou e agora você precisa de um processo de limpeza de dados.' },
    { title: 'Declare como Set, instancie como HashSet (ou LinkedHashSet)', text: '`Set<String> emails = new HashSet<>();` deixa a intenção explícita (unicidade) e a implementação trocável. Se a ordem de inserção virar requisito, a mudança é de uma palavra: `new LinkedHashSet<>()`.' },
    { title: 'Escreva equals e hashCode juntos, sempre', text: 'São uma dupla indivisível na prática: `equals` define o critério de igualdade e `hashCode` garante que objetos iguais caiam na mesma gaveta. Sobrescrever só um produz comportamento errado e difícil de rastrear.' },
    { title: 'Use o retorno de add como sinalização', text: '`boolean inserido = conjunto.add(x)` substitui uma busca extra com `contains` (que seria trabalho dobrado). É a forma mais barata de saber se o dado era novo — e o motivo de `add` devolver `boolean`.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      '`Set` é a coleção **sem repetição e sem posição**: não há índice, a percorrida é feita com `for-each`.',
      '`HashSet` é a implementação padrão — baseada em tabela de dispersão, com operações muito rápidas e **ordem não garantida**.',
      'Use `LinkedHashSet` quando a unicidade importa **e** a ordem de inserção também; `TreeSet` mantém ordem natural.',
      '`add` devolve `boolean`: `true` se o elemento era novo e entrou, `false` se já existia e foi recusado.',
      '`contains`, `remove`, `size`, `isEmpty` e `clear` completam o arsenal; `get(i)` **não existe** em `Set`.',
      'Para objetos próprios, o HashSet usa `equals` **e** `hashCode`: sobrescreva os dois com os mesmos campos ou as duplicatas passam.',
      'Em dados de entrada como e-mails, normalize com `trim().toLowerCase()` antes do `add` — unicidade sem normalização é ilusão.',
      'O caso real desta aula (inscritos de um evento) mostra a dupla defesa: normalizar a entrada e deixar o conjunto recusar repetições.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você conhece o **`Map`**: a estrutura que guarda pares **chave-valor**, perfeita para consultar estoque por SKU ou cadastro por e-mail com desempenho constante.' },
  ],

  exercises: [
    {
      id: 'm3l02e1',
      type: 'mc',
      question: 'Um sistema precisa guardar os e-mails de usuários cadastrados garantindo que nenhum endereço se repita, sem se importar com a ordem. Qual é a escolha mais adequada?',
      options: ['`ArrayList<String>`', '`HashMap<String, String>`', '`HashSet<String>`', '`List<String>` com verificação manual em toda inserção'],
      answer: 2,
      explanation: 'O `HashSet` **recusa duplicatas por contrato** e não se preocupa com ordem — exatamente as exigências do enunciado. `ArrayList` e `List` permitem repetição; a última alternativa até funciona, mas transforma a regra de unicidade em código manual espalhado, que alguém esquece de reescrever em um novo ponto de inserção. `HashMap` guarda pares chave-valor; para e-mails como **valores** sem chave definida ele não é o modelo certo.',
    },
    {
      id: 'm3l02e2',
      type: 'code',
      question: 'Analise o trecho. Qual saída as três primeiras linhas imprimem, na ordem?',
      code: 'Set<String> tags = new HashSet<>();\nboolean a = tags.add("oferta");\nboolean b = tags.add("oferta");\nSystem.out.println(a + " | " + b + " | " + tags.size());',
      lang: 'java',
      options: ['true | true | 2', 'true | false | 1', 'false | false | 0', 'Erro de compilação: add não devolve valor'],
      answer: 1,
      explanation: 'O primeiro `add` insere "oferta" e devolve `true`; o segundo encontra a duplicata, **não insere** e devolve `false`. Como só há um elemento distinto no conjunto, `size()` devolve `1` — a saída é `true | false | 1`. Nada aqui é erro de compilação: `add` de `Set` retorna `boolean` justamente para informar se a inserção ocorreu.',
    },
    {
      id: 'm3l02e3',
      type: 'tf',
      question: 'Um `HashSet` mantém os elementos na ordem exata em que foram inseridos e essa ordem é garantida mesmo com o conjunto crescendo.',
      answer: false,
      explanation: 'O `HashSet` **não guarda ordem**: os elementos ficam dispostos de acordo com o cálculo de `hashCode`, e a sequência pode mudar a cada inserção. Quem precisa da ordem de chegada deve usar `LinkedHashSet`; quem precisa de ordem alfabética/numérica, `TreeSet`. Confiar na ordem atual do `HashSet` é escrever um bug adormecido.',
    },
    {
      id: 'm3l02e4',
      type: 'short',
      question: 'Duas instâncias de uma classe `Produto` com os mesmos dados foram adicionadas ao mesmo `HashSet` e o tamanho do conjunto ficou 2. Explique a causa e o que precisa ser feito na classe.',
      keywords: [
        ['equals'],
        ['hashcode'],
        ['referencia', 'referência', 'objeto', 'padrao', 'padrão', 'object'],
      ],
      answerText: 'Sem sobrescrever os métodos, vale o equals padrão de Object, que compara referências: como são objetos diferentes na memória, o HashSet não os considera iguais. É preciso sobrescrever equals e hashCode na classe Produto usando os campos de identidade, como o SKU.',
      explanation: 'A detecção de duplicatas do `HashSet` depende de `hashCode` (localizar a gaveta) e `equals` (comparar dentro dela). Herdados de `Object`, eles tratam cada `new` como algo único — por isso os dois produtos passaram. A correção é sobrescrever **os dois**, com os mesmos campos do critério de negócio (por exemplo, o `sku`): objetos iguais produzem o mesmo `hashCode` e o `equals` devolve `true`, fazendo o segundo `add` ser recusado.',
    },
    {
      id: 'm3l02e5',
      type: 'mc',
      question: 'Após chamar `boolean inserido = emails.add(novoEmail);`, a variável `inserido` vale `false`. O que isso significa para o programa?',
      options: [
        'O e-mail já existia no conjunto e não foi adicionado de novo',
        'O conjunto atingiu o limite máximo de elementos',
        'O e-mail foi adicionado, mas de forma oculta',
        'Há erro de compilação: add de Set não tem retorno',
      ],
      answer: 0,
      explanation: 'Em `Set`, `add` devolve `false` quando o elemento **já está presente**: a inserção é recusada silenciosamente e o tamanho não muda. Essa é a informação que permite detectar duplicatas sem uma chamada extra de `contains`. Não existe limite de tamanho (o `Set` cresce conforme a memória permite) e `add` de `Set` retorna `boolean` desde sempre.',
    },
  ],

  challenge: {
    id: 'm3l02c1',
    title: 'Validador de inscritos sem duplicatas',
    fileName: 'Main.java',
    prompt: 'Implemente um validador de inscrições de evento em Java 21. O `main` recebe um array `String[] inscricoes` com e-mails brutos (com espaços, maiúsculas e repetições). Para cada inscrição: aplique `trim().toLowerCase()` para normalizar, tente inserir em um `Set<String>` e use o retorno booleano do `add` para detectar duplicatas, imprimindo `Duplicado descartado: <email>` quando o retorno for `false`. Ao processar tudo, imprima `Unicos: <tamanho>` com `size()` e liste todos os e-mails únicos com um laço for-each no formato ` - <email>`. Com as entradas do enunciado, a saída esperada termina com `Unicos: 3` e lista ana@loja.com, carlos@loja.com e diana@loja.com (a ordem pode variar).',
    starterCode: `import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        String[] inscricoes = {
            " Ana@Loja.COM ", "ana@loja.com", "carlos@loja.com",
            "ANA@LOJA.COM", "diana@loja.com", "carlos@loja.com "
        };

        Set<String> emailsUnicos = new HashSet<>();
        int duplicados = 0;

        // 1. Percorra o array normalizando cada inscricao com trim().toLowerCase()
        // 2. Use o retorno booleano de add; quando false, incremente duplicados
        //    e imprima: Duplicado descartado: <email normalizado>
        // 3. Ao final imprima "Unicos: <size>" e liste os emails com for-each

        System.out.println("Duplicados: " + duplicados);
    }
}`,
    criteria: [
      'Percorre o array com laço e normaliza cada inscrição chamando `trim().toLowerCase()` antes de qualquer comparação',
      'Guarda os e-mails em um `Set<String>` instanciado como `HashSet` (não em uma `List`)',
      'Usa o retorno booleano do `add`: quando for `false`, incrementa o contador de duplicados e imprime a linha `Duplicado descartado:` com o e-mail normalizado',
      'Ao final, imprime `Unicos:` seguido do `size()` do conjunto e lista os e-mails com laço for-each no formato ` - <email>`',
      'Com as entradas fornecidas, o resultado é 3 e-mails únicos (ana@loja.com, carlos@loja.com, diana@loja.com) e 3 duplicados descartados',
      'Não usa coleções de aulas futuras (Map), lambdas, streams nem verificações manuais de duplicidade antes do add',
    ],
    modelSolution: [
      { t: 'p', text: 'A solução abaixo concentra a lógica no retorno do `add`: é ele — e não uma busca prévia com `contains` — quem diz se a inscrição era nova. Repare que a normalização acontece **antes** do `add`, para que `ANA@LOJA.COM` e ` ana@loja.com ` se apresentem ao conjunto com a mesma chave.' },
      { t: 'code', lang: 'java', caption: 'Main.java', code: `import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        String[] inscricoes = {
            " Ana@Loja.COM ", "ana@loja.com", "carlos@loja.com",
            "ANA@LOJA.COM", "diana@loja.com", "carlos@loja.com "
        };

        Set<String> emailsUnicos = new HashSet<>();
        int duplicados = 0;

        for (String bruto : inscricoes) {
            String normalizado = bruto.trim().toLowerCase();
            boolean inserido = emailsUnicos.add(normalizado);
            if (!inserido) {
                duplicados++;
                System.out.println("Duplicado descartado: " + normalizado);
            }
        }

        System.out.println("Unicos: " + emailsUnicos.size());
        for (String email : emailsUnicos) {
            System.out.println(" - " + email);
        }
        System.out.println("Duplicados: " + duplicados);
    }
}` },
      { t: 'p', text: 'Com as entradas do enunciado, o laço normaliza tudo para `ana@loja.com`, `carlos@loja.com` e `diana@loja.com`; as três repetições (`ana` na 1ª e 2ª, `ANA` na 4ª e `carlos` na 3ª e 6ª) retornam `false` do `add` e alimentam o contador — total de 3 duplicados. O `size()` final é `3`. Note que a ordem impressa pelo for-each pode não ser a ordem do array: isso é esperado em `HashSet`. Se a ordem de chegada fosse exigência, trocaria apenas a instanciação por `new LinkedHashSet<>()` — sem tocar no restante do código, porque a variável é declarada pela interface `Set`.' },
    ],
  },
}
