export default {
  id: 'm3l04',
  moduleId: 'm3',
  number: 4,
  title: 'Generics: segurança de tipos em tempo de compilação',
  durationMinutes: 22,

  objectives: [
    'Explicar o problema que os generics resolveram nas coleções',
    'Ler e escrever a sintaxe de parâmetro de tipo em classes e métodos',
    'Criar uma classe genérica reutilizável com mais de um tipo concreto',
    'Distinguir tipo cru, List<Object> e List<?> em situações reais',
    'Reconhecer os limites dos generics em tempo de execução',
  ],

  prerequisites: [
    'Ter concluído as aulas de List, Set e Map deste módulo',
    'Saber declarar métodos, parâmetros e tipos de retorno (módulos 1 e 2)',
    'Entender o que é uma classe e uma interface como tipo de referência (módulo 2)',
    'Conhecer casts (conversões de referência) vistos em tipos de referência',
  ],

  intro: [
    { t: 'p', text: 'Nas três aulas anteriores você digitou `List<String>`, `Set<String>` e `Map<String, Integer>` sem quebrar a cabeça com o que havia entre `<` e `>`. Chegou a hora de entender: **aquela sintaxe é o que impede um `Integer` de entrar numa lista de nomes** — e ela existe porque, antes dos generics, o Java aceitava qualquer coisa em qualquer coleção e só reclamava quando o programa já estava rodando.' },
    { t: 'p', text: 'O histórico é direto: coleções antigas guardavam tudo como `Object`, e você precisava converter cada elemento de volta para o tipo desejado a cada leitura. Se errasse o tipo na conversão, o programa compilava, passava nos testes superficiais e morria com `ClassCastException` na frente do usuário. Os **generics** movem essa verificação para o **momento da compilação**: o erro aparece no editor, na linha errada, antes de qualquer execução.' },
    { t: 'p', text: 'Nesta aula você vai ler a sintaxe por completo, escrever suas próprias **classes genéricas** (um repositório que serve para produtos, usuários e o que mais vier), criar **métodos genéricos**, usar o curinga `?` e conhecer o limite dos generics: o que o compilador sabe, a **JVM nem sempre sabe** — e é por isso que certas coisas continuam proibidas até hoje.' },
    { t: 'note', kind: 'tip', title: 'Por que depois das coleções?', text: 'A ordem das aulas é proposital: primeiro você **usou** generics nas coleções (só copiando a sintaxe), agora vai **entendê-los** com repertório. Conceito abstrato sem prática vira decoração; com prática, vira leitura de código.' },
  ],

  theory: [
    { t: 'h2', text: 'O mundo antes dos generics' },
    { t: 'p', text: 'Até o **Java 5** (2004), as coleções da biblioteca padrão aceitavam qualquer objeto: `ArrayList` guardava `Object`s e devolvia `Object`s. Para usar o elemento com seu tipo real era preciso fazer **cast** na leitura — e o compilador não tinha como saber se o cast estava certo, porque ele já não sabia mais o que estava guardado na lista.' },
    { t: 'code', lang: 'java', caption: 'AntesDosGenerics.java', code: `import java.util.ArrayList;
import java.util.List;

public class AntesDosGenerics {
    public static void main(String[] args) {
        List nomes = new ArrayList();   // tipo cru, sem parametro de tipo
        nomes.add("Ana");
        nomes.add(42);                  // aceito sem nenhuma critica

        String primeiro = (String) nomes.get(0);
        System.out.println(primeiro);   // Ana

        String segundo = (String) nomes.get(1);   // ERRO em tempo de execucao
        System.out.println(segundo);
    }
}` },
    { t: 'p', text: 'Tudo aqui **compila**: a lista é de `Object`s, `add(42)` é permitido e o cast `(String)` também passa pela checagem do compilador, porque `Object` pode ser convertido em qualquer tipo. O problema explode na linha `String segundo = (String) nomes.get(1);`: o elemento é um `Integer`, e a JVM responde com **`ClassCastException`** em execução — no meio da rotina, com dados já carregados. Repare também que, no Java 21 atual, esse código gera apenas um **aviso** de *raw type* (tipo cru), não um erro: os generics aumentaram a segurança, mas continuam opcionais para o compilador.' },
    { t: 'note', kind: 'info', title: 'Do aviso ao erro', text: 'A linguagem não quebrou compatibilidade: código legado sem generics continua compilando (com avisos), para que sistemas antigos continuem rodando. Mas **código novo** deve ser sempre parametrizado: `List<String>`, nunca `List` solto. É o padrão de qualquer equipe séria.' },

    { t: 'h2', text: 'A sintaxe <Tipo> em ação' },
    { t: 'p', text: 'Um **genérico** é um tipo que recebe um **parâmetro de tipo** entre `<` e `>` — como um método recebe um parâmetro de valor, só que em tempo de compilação. `List<String>` é a "lista de String": o parâmetro `String` promete que **só String** pode entrar e que **toda leitura já sai como String**, sem cast.' },
    { t: 'code', lang: 'java', caption: 'ComGenerics.java (a linha marcada nao compila)', code: `import java.util.ArrayList;
import java.util.List;

public class ComGenerics {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add(42);   // ERRO de compilacao: int nao e compativel com String
    }
}` },
    { t: 'p', text: 'Compare com o exemplo anterior: a única mudança é `List<String>` no lugar de `List`. Agora, a linha `nomes.add(42);` **nem chega ao executável** — o compilador interrompe a build apontando exatamente a linha do erro. Essa é a promessa dos generics: **erro de tipo em tempo de compilação**. E o ganho não é só no `add`: na leitura, `String nome = nomes.get(0);` funciona sem nenhum cast, porque o compilador sabe o que a lista devolve. Os casts manuais, com seu risco de erro silencioso, desaparecem do código.' },
    { t: 'p', text: 'Vale fixar a leitura da sintaxe: `List<String>` = "lista de String"; `Set<Produto>` = "conjunto de Produto"; `Map<String, Integer>` = "mapa com chave String e valor Integer". O que vem depois de `<` é o **contrato de conteúdo** daquela variável, e vale para toda a cadeia: se a lista é de `String`, os métodos que recebem `String` e devolvem `String` não permitem outra coisa — nem por cast forçado.' },

    { t: 'h2', text: 'Classes genéricas: escreva uma vez, use com qualquer tipo' },
    { t: 'p', text: 'O parâmetro de tipo não é exclusivo das coleções: **qualquer classe pode declarar o seu**. A ideia é clássica de reutilização — escrever uma única estrutura que funciona com `Produto`, com `Usuario` ou com qualquer outro tipo, mantendo a segurança em cada uso. No sistema de usuários e produtos, o candidato natural é um **repositório**: um contentor que guarda itens de um tipo e oferece as operações básicas de acesso.' },
    { t: 'code', lang: 'java', caption: 'RepositorioApp.java', code: `import java.util.ArrayList;
import java.util.List;

class Produto {
    String nome;

    Produto(String nome) {
        this.nome = nome;
    }
}

class Usuario {
    String email;

    Usuario(String email) {
        this.email = email;
    }
}

class Repositorio<T> {
    private List<T> itens = new ArrayList<>();

    public void adicionar(T item) {
        itens.add(item);
    }

    public T porIndice(int indice) {
        return itens.get(indice);
    }

    public int total() {
        return itens.size();
    }
}

public class RepositorioApp {
    public static void main(String[] args) {
        Repositorio<Produto> produtos = new Repositorio<>();
        produtos.adicionar(new Produto("Teclado"));
        produtos.adicionar(new Produto("Monitor"));

        Repositorio<Usuario> usuarios = new Repositorio<>();
        usuarios.adicionar(new Usuario("ana@exemplo.com"));

        System.out.println(produtos.total());            // 2
        System.out.println(produtos.porIndice(0).nome);  // Teclado
        System.out.println(usuarios.total());            // 1
    }
}` },
    { t: 'p', text: 'Decodifique a classe: `class Repositorio<T>` declara que **`T` é o tipo do conteúdo** — dentro da classe, `T` é tratado como um tipo de verdade. A linha `private List<T> itens = new ArrayList<>();` cria uma lista do mesmo tipo do parâmetro, e `public void adicionar(T item)` só aceita itens do tipo escolhido na instanciação. Em `Repositorio<Produto> produtos`, o `T` vira `Produto`: `produtos.adicionar(new Produto(...))` compila, mas `produtos.adicionar(new Usuario(...))` **não compila** — o compilador sabe que aquele repositório é de produtos. Já `public T porIndice(int indice)` devolve um `Produto` quando chamado em `produtos` e um `Usuario` quando chamado em `usuarios`: **um único método serve para os dois casos, sem cast algum**. Os dois repositórios são instâncias da mesma classe; o que muda é o tipo resolvido em cada uso.' },
    { t: 'note', kind: 'info', title: 'Convenções de nomes', text: 'Por convenção: **`T`** = *type* (tipo geral), **`E`** = *element* (elementos de coleção), **`K`** e **`V`** = *key* e *value* (mapas), **`N`** = número. Seguir as convenções facilita a leitura: ao ver `Map<K, V>`, qualquer desenvolvedor entende na hora.' },

    { t: 'h2', text: 'Métodos genéricos' },
    { t: 'p', text: 'Um método também pode declarar seu próprio parâmetro de tipo, escrito **antes do tipo de retorno**. O tipo é **inferido a partir dos argumentos**: você chama o método com uma lista de `String` e o compilador conclui que `T` é `String` — sem escrever nada entre `<` e `>` na chamada.' },
    { t: 'code', lang: 'java', caption: 'MetodosGenericos.java', code: `import java.util.ArrayList;
import java.util.List;

public class MetodosGenericos {
    public static <T> T primeiro(List<T> lista) {
        return lista.get(0);
    }

    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bruno");

        List<Integer> notas = new ArrayList<>();
        notas.add(7);
        notas.add(9);

        String nome = primeiro(nomes);
        int nota = primeiro(notas);

        System.out.println(nome);   // Ana
        System.out.println(nota);   // 7
    }
}` },
    { t: 'p', text: 'Na assinatura `public static <T> T primeiro(List<T> lista)`, o `<T>` **antes do retorno** é quem declara o parâmetro de tipo do método — sem ele, `T` seria um nome desconhecido e o arquivo não compilaria. No corpo, `return lista.get(0);` é genérico de verdade: o tipo devolvido é o mesmo da lista recebida. Em `primeiro(nomes)`, o compilador infere `T = String` a partir de `List<String>`, então `String nome` recebe o resultado sem cast; em `primeiro(notas)`, infere `T = Integer` e a atribuição para `int` funciona pela conversão automática. Repare que **um método só** atende os dois casos — sem sobrecarga, sem `Object`, sem conversão manual.' },

    { t: 'h2', text: 'Curingas: aceitar variação com segurança' },
    { t: 'p', text: 'Às vezes um método não precisa saber **qual** tipo ele recebe — apenas que é uma lista, qualquer que seja. Para isso existe o **curinga** (`wildcard`): `List<?>` lê-se "lista de **algum tipo que não sei qual**". Você pode **ler** os elementos (como `Object`), mas não pode **adicionar** nada (exceto `null`), porque qualquer valor pode conflitar com o tipo escondido.' },
    { t: 'code', lang: 'java', caption: 'Curingas.java', code: `import java.util.ArrayList;
import java.util.List;

public class Curingas {
    public static void imprimir(List<?> lista) {
        for (Object elemento : lista) {
            System.out.println(elemento);
        }
    }

    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");

        List<Integer> notas = new ArrayList<>();
        notas.add(10);

        imprimir(nomes);   // Ana
        imprimir(notas);   // 10
    }
}` },
    { t: 'p', text: 'Observe por que `List<?>` é diferente de `List<Object>`: se a assinatura fosse `imprimir(List<Object> lista)`, a chamada `imprimir(nomes)` **não compilaria**, porque `List<String>` não é subtipo de `List<Object>` (a regra é: tipos genéricos com parâmetros diferentes são tipos diferentes). Com `List<?>`, qualquer lista serve — o método se declara indiferente ao tipo interno. Em troca da versatilidade, o laço devolve `Object` e você não pode fazer `lista.add("x")`, pois o compilador não sabe se aquela lista é de `String`, de `Integer` ou de outra coisa. Regra prática: **parâmetro que só lê a coleção aceita `List<?>`; quem precisa escrever exige o tipo exato**.' },
    { t: 'note', kind: 'warn', title: 'Existe curinga com limite', text: 'Sintaxes como `List<? extends Number>` ("lista de Number ou de alguma subclasse") e `List<? super Integer>` ("lista de Integer ou de alguma superclasse") restringem o tipo com mais precisão. São úteis em APIs avançadas; enquanto você não se deparar com elas em código de equipe, basta reconhecer `?` como "qualquer tipo".' },

    { t: 'h2', text: 'O limite dos generics: tempo de compilação' },
    { t: 'p', text: 'Os generics são verificados **pelo compilador**, e a JVM trabalha com o tipo original por baixo dos panos — um processo chamado **apagamento de tipos** (*type erasure*). Na prática, `List<String>` e `List<Integer>` são a mesma classe em execução; a informação do parâmetro serve ao compilador e é descartada depois. Isso explica três proibições que assustam quem vem de outras linguagens:' },
    { t: 'ul', items: [
      '`new T()` não existe: você não pode instanciar o tipo genérico, porque em execução ele pode nem estar definido.',
      '`instanceof List<String>` não compila: em execução a JVM não distingue os parâmetros, então comparar com o tipo completo é proibido.',
      '`new T[10]` não compila: criar arrays do tipo genérico também é proibido pelo mesmo motivo.',
    ] },
    { t: 'p', text: 'Isso não diminui o valor dos generics — erros como o `ClassCastException` do exemplo inicial desaparecem. Mas ensina a mentalidade certa: **genérico protege a compilação, não cria tipos novos em execução**. Quando precisar de informação de tipo em tempo de execução (mapeamento de objetos para banco de dados, frameworks), o Java oferece outros mecanismos — anotações e reflexão — que você verá nos módulos avançados.' },
  ],

  commonMistakes: [
    { title: 'Deixar a lista sem parâmetro (tipo cru)', text: '`List nomes = new ArrayList();` compila com aviso e devolve `Object` em cada leitura, mandando você de volta aos casts manuais e ao `ClassCastException`. Escreva sempre `List<String> nomes = new ArrayList<>();` — o custo é um par de caracteres, o ganho é a verificação de tipo inteira.' },
    { title: 'Confundir List<Object> com List<?>', text: '`List<Object>` é uma lista que **aceita qualquer objeto** (e você pode adicionar); `List<?>` é uma lista **de tipo desconhecido** que você apenas **lê**. Trocar um pelo outro quebra a compilação em direções opostas: `List<Object>` recusa `List<String>` como argumento, e `List<?>` não deixa você adicionar elementos.' },
    { title: 'Achar que o tipo existe em tempo de execução', text: 'Em execução, `List<String>` e `List<Integer>` são a mesma classe (apagamento de tipos). Por isso `instanceof List<String>` e `new T()` não compilam, e por isso frameworks usam anotações e reflexão para recuperar informações de tipo. Não tente forçar o compilador com casts a mais: ele está protegendo você.' },
    { title: 'Escrever a classe genérica usando Object por dentro', text: 'Declarar `class Repositorio<T>` e guardar tudo em `List<Object>` derruba a segurança: qualquer coisa entra e a leitura volta com cast. O campo e os métodos precisam usar o próprio `T` (`List<T> itens`, `void adicionar(T item)`, `T porIndice(int)`) — é isso que liga a classe ao tipo escolhido na instanciação.' },
    { title: 'Esperar que List<Integer> seja um List<Number>', text: 'Não há covariância: `List<Number>` e `List<Integer>` são tipos **distintos**, porque um `List<Number>` admitiria adicionar um `Double` que quebraria a lista de inteiros. Se o método aceita "qualquer lista de Number ou subclasse", use o curinga `List<? extends Number>`.' },
  ],

  bestPractices: [
    { title: 'Parametrize sempre', text: '`List<String>`, `Set<Produto>`, `Map<String, Integer>` em todo código novo. Tipo cru só em manutenção legada estritamente necessária — e mesmo assim, elimine ao tocar no arquivo.' },
    { title: 'Use o parâmetro de tipo no corpo inteiro da classe genérica', text: 'Campo, parâmetros e retorno devem usar `T`. Se algum método precisa de um tipo específico diferente, talvez a classe nem devesse ser genérica naquele ponto — repense o desenho antes de recorrer a casts.' },
    { title: 'Declare parâmetros e campos pela interface genérica', text: '`List<T> itens` em vez de `ArrayList<T> itens` como tipo do campo: o contrato é a interface, a implementação é detalhe. Funciona igual ao que você já faz com `List` concreto — agora com o parâmetro de tipo junto.' },
    { title: 'Siga as convenções de nomes de tipo', text: '`T` para tipo geral, `E` para elementos, `K`/`V` para chaves e valores. Código com `class Cache<K, V>` se explica sozinho; `class Cache<X1>` obriga todo mundo a parar para perguntar o que aquilo é.' },
    { title: 'Use List<?> em métodos que só leem', text: 'Um utilitário que imprime, conta ou soma elementos não precisa saber o tipo: `List<?>` aceita qualquer lista e deixa essa intenção explícita no cabeçalho do método. Reserve o tipo exato para quando você realmente vai escrever na coleção.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Antes dos generics, coleções guardavam `Object` e exigiam **cast na leitura** — o `ClassCastException` surgia em execução.',
      'Generics (Java 5) movem a verificação de tipo para a **compilação**: `List<String>` recusa qualquer outra coisa, na linha exata do erro.',
      'A sintaxe `<Tipo>` é um **contrato de conteúdo**: vale para o `add`, para o `get` e para toda a cadeia de chamadas.',
      'Qualquer classe pode ser genérica: `class Repositorio<T>` usa `T` em campo, parâmetros e retorno, e cada instanciação escolhe o tipo (`Repositorio<Produto>`).',
      'Método genérico declara `<T>` **antes do tipo de retorno** e infere o tipo a partir do argumento chamado.',
      '`List<?>` aceita qualquer lista para **leitura**, mas não permite adicionar; `List<Object>` aceita adicionar, mas não recebe `List<String>`.',
      'Generics existem em **tempo de compilação**: por apagamento de tipos, `new T()`, `instanceof List<String>` e `new T[10]` não compilam.',
      'Sempre parametrize — tipo cru (`List` solto) significa voltar ao mundo de casts e erros tardios.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você conhece o **`enum`**: uma estrutura genérica de propósito especial para conjuntos fixos de valores, que substitui as Strings e números mágicos espalhados pelo código.' },
  ],

  exercises: [
    {
      id: 'm3l04e1',
      type: 'mc',
      question: 'Qual declaração garante que o compilador recusará um `Integer` adicionado a uma lista de nomes?',
      options: ['`List nomes = new ArrayList();`', '`List<Object> nomes = new ArrayList<>();`', '`List<String> nomes = new ArrayList<>();`', '`ArrayList nomes;`'],
      answer: 2,
      explanation: '`List<String>` estabelece o contrato de que a lista só aceita `String`: `nomes.add(42)` vira erro de compilação, apontando a linha. A primeira alternativa é tipo cru (aceita tudo, com cast depois); `List<Object>` também aceitaria o `Integer`, só que de propósito — o problema seria achar que protege algo; `ArrayList` sem tipo é o mesmo problema do tipo cru.',
    },
    {
      id: 'm3l04e2',
      type: 'code',
      question: 'Considere as classes e a chamada abaixo. O que acontece na última linha?',
      code: 'class Produto { }\nclass Usuario { }\n\nRepositorio<Produto> produtos = new Repositorio<>();\nprodutos.adicionar(new Usuario());',
      lang: 'java',
      options: [
        'Compila e o Usuario é guardado junto com os produtos',
        'Compila e falha em tempo de execução com ClassCastException',
        'Erro de compilacao: adicionar recebe Produto, nao Usuario',
        'Erro de compilacao: Repositorio precisa de dois parametros, como <K, V>',
      ],
      answer: 2,
      explanation: 'O repositório foi instanciado como `Repositorio<Produto>`, então o compilador resolve `T` para `Produto` e a assinatura do método passa a ser `adicionar(Produto)`. Chamar `adicionar(new Usuario())` **nem chega a compilar** — é exatamente a segurança que os generics adicionam em relação ao exemplo `Object` da aula. Não há dois parâmetros: `Repositorio<T>` foi declarado com um único tipo.',
    },
    {
      id: 'm3l04e3',
      type: 'tf',
      question: 'Em tempo de execução, a JVM consegue distinguir uma `List<String>` de uma `List<Integer>` pelo parâmetro de tipo.',
      answer: false,
      explanation: 'Os generics são apagados em tempo de compilação (*type erasure*): em execução, `List<String>` e `List<Integer>` são a mesma classe `List`. Por isso `instanceof List<String>` não compila e frameworks precisam de anotações/reflexão para recuperar o tipo. A distinção existe **para o compilador**, que é quem garante a segurança.',
    },
    {
      id: 'm3l04e4',
      type: 'short',
      question: 'Explique, em duas frases, qual problema os generics resolveram em comparação com o uso de `Object` e casts.',
      keywords: [
        ['object'],
        ['cast', 'conversion', 'conversão', 'classcastexception'],
        ['compilacao', 'compilação', 'tempo de compilacao', 'tempo de compilação', 'antes'],
      ],
      answerText: 'Sem generics, as coleções guardavam Object e exigiam cast na leitura, e o erro de tipo (ClassCastException) só aparecia em execução. Com generics, o compilador verifica o tipo na hora de compilar, apontando a linha errada antes de o programa rodar.',
      explanation: 'A mudança é de **quando** o erro aparece: antes, o compilador aceitava qualquer coisa e a cobrança vinha em produção; agora, o tipo é verificado em cada `add` e `get` já na compilação. Os casts manuais desaparecem do código e junto com eles a classe de erros silenciosos que só a execução revelava.',
    },
    {
      id: 'm3l04e5',
      type: 'mc',
      question: 'Ao escrever `class Caixa<T>`, o que a letra `T` representa?',
      options: [
        'Um tipo concreto fixo, sempre igual a String',
        'Um parâmetro de tipo: o tipo real é escolhido em quem instancia a classe',
        'Um tipo primitivo obrigatório, como int ou double',
        'Uma sintaxe inválida: classes não aceitam parâmetros',
      ],
      answer: 1,
      explanation: '`T` é um **placeholder** declarado pela classe: `Caixa<String>` e `Caixa<Produto>` são duas resoluções diferentes do mesmo modelo, e dentro da classe `T` é tratado como tipo comum. `String` seria apenas um dos valores possíveis, não o fixo; `T` nunca é primitivo (genéricos só trabalham com tipos de referência); e aceitar parámetro de tipo é justamente a definição de classe genérica.',
    },
  ],

  challenge: {
    id: 'm3l04c1',
    title: 'Repositorio generico para usuarios e produtos',
    fileName: 'Main.java',
    prompt: 'Implemente em Java 21 um repositório genérico reutilizável. No arquivo `Main.java`, declare: a classe `Produto` com o atributo `nome` (com construtor e getter), a classe `Usuario` com o atributo `email` (com construtor e getter) e a classe genérica `Repositorio<T>` com uma `List<T>` interna e os métodos `adicionar(T item)`, `porIndice(int indice)` devolvendo `T`, `total()` devolvendo a quantidade e `listar()` imprimindo cada item com `System.out.println`. No `main`, crie um `Repositorio<Produto>` com 2 produtos e um `Repositorio<Usuario>` com 2 usuários, e imprima no formato: `Produtos: 2`, `Primeiro produto: Teclado mecanico`, `Usuarios: 2`, `Primeiro usuario: ana@exemplo.com`. Deixe no código, comentada, uma chamada que o compilador rejeita (como adicionar um `Usuario` no repositório de produtos), para documentar a proteção.',
    starterCode: `import java.util.ArrayList;
import java.util.List;

// 1. Declare class Produto { String nome; } com construtor e getNome()

// 2. Declare class Usuario { String email; } com construtor e getEmail()

// 3. Declare class Repositorio<T> com:
//    - private List<T> itens = new ArrayList<>();
//    - void adicionar(T item)
//    - T porIndice(int indice)
//    - int total()
//    - void listar()

public class Main {
    public static void main(String[] args) {
        // 4. Instancie Repositorio<Produto> e Repositorio<Usuario> e popule

        // 5. Imprima as 4 linhas no formato exigido

        // 6. Deixe comentada uma chamada que o compilador rejeita
    }
}`,
    criteria: [
      'A classe `Repositorio<T>` declara o parâmetro de tipo e usa `List<T>` internamente (nunca `List<Object>`)',
      'Os métodos usam o parâmetro `T` na assinatura: `adicionar(T item)` e `T porIndice(int indice)`, além de `total()` e `listar()`',
      'O `main` instancia e popula um `Repositorio<Produto>` com 2 produtos e um `Repositorio<Usuario>` com 2 usuários',
      'As 4 linhas de saída aparecem no formato exato pedido, com `Primeiro produto: Teclado mecanico` e `Primeiro usuario: ana@exemplo.com` lidos via `porIndice(0)`',
      'Há no código uma chamada comentada que o compilador rejeitaria (ex.: adicionar um `Usuario` em `Repositorio<Produto>`), com comentário explicando a proteção',
      'Não usa `List<Object>` como substituto de generics, casts de conteúdo nem recursos de aulas futuras (lambdas, streams)',
    ],
    modelSolution: [
      { t: 'p', text: 'A solução abaixo usa **um único** `Repositorio<T>` para dois tipos diferentes de conteúdo. O ponto central é o comentário no `main`: a chamada rejeitada pelo compilador documenta, no próprio código, o que os generics garantem.' },
      { t: 'code', lang: 'java', caption: 'Main.java', code: `import java.util.ArrayList;
import java.util.List;

class Produto {
    private String nome;

    public Produto(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}

class Usuario {
    private String email;

    public Usuario(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}

class Repositorio<T> {
    private List<T> itens = new ArrayList<>();

    public void adicionar(T item) {
        itens.add(item);
    }

    public T porIndice(int indice) {
        return itens.get(indice);
    }

    public int total() {
        return itens.size();
    }

    public void listar() {
        for (T item : itens) {
            System.out.println(item);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Repositorio<Produto> produtos = new Repositorio<>();
        produtos.adicionar(new Produto("Teclado mecanico"));
        produtos.adicionar(new Produto("Monitor 24"));

        Repositorio<Usuario> usuarios = new Repositorio<>();
        usuarios.adicionar(new Usuario("ana@exemplo.com"));
        usuarios.adicionar(new Usuario("bruno@exemplo.com"));

        System.out.println("Produtos: " + produtos.total());
        System.out.println("Primeiro produto: " + produtos.porIndice(0).getNome());
        System.out.println("Usuarios: " + usuarios.total());
        System.out.println("Primeiro usuario: " + usuarios.porIndice(0).getEmail());

        // A linha abaixo NAO compila: o repositorio e de Produto.
        // produtos.adicionar(new Usuario("erro@exemplo.com"));
    }
}` },
      { t: 'p', text: 'A saída é `Produtos: 2`, `Primeiro produto: Teclado mecanico`, `Usuarios: 2` e `Primeiro usuario: ana@exemplo.com`. Note como `porIndice(0)` devolve um `Produto` no primeiro caso e um `Usuario` no segundo, **sem nenhum cast** — o tipo foi resolvido na compilação a partir da instanciação. E repare no último comentário: `produtos.adicionar(new Usuario(...))` falharia com "adicionar(Usuario) não é compatível com adicionar(Produto)", prova de que o `T` está vigiando o conteúdo do repositório inteiro. Um refinamento opcional, quando quiser expor a lista sem permitir que a externa a altere: devolva uma cópia em `listar`-valores (`return new ArrayList<>(itens);`), mantendo o campo interno privado e protegido.' },
    ],
  },
}
