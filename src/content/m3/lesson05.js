export default {
  id: 'm3l05',
  moduleId: 'm3',
  number: 5,
  title: 'Enumerações com enum',
  durationMinutes: 20,

  objectives: [
    'Declarar um enum e explicar por que ele é uma classe especial do Java',
    'Usar values(), valueOf() e comparar constantes com o operador ==',
    'Adicionar campos, construtor e métodos a uma enumeração',
    'Aplicar switch expression sobre constantes de enum',
    'Substituir constantes String espalhadas por um enum tipado no modelo de produtos',
  ],

  prerequisites: [
    'Ter concluído as aulas de List, Set, Map e Generics deste módulo',
    'Saber o que é classe, atributo, construtor e método (módulo 2)',
    'Conhecer a estrutura switch e as switch expressions do módulo 1',
    'Entender o que significa comparar objetos com == e com equals',
  ],

  intro: [
    { t: 'p', text: 'Um produto pode estar `"ATIVO"`, `"ativo"`, `"Ativo "` ou `"ATV"` — quatro strings que significam a mesma coisa para o usuário e coisas diferentes para o Java. Quando o status mora em texto livre, o erro de digitação passa pela validação silencioso e vira um produto "fantasma" no relatório. Trocar por números (`1`, `2`, `3`) troca o problema pela falta de leitura: ninguém sabe o que significa `status = 3` seis meses depois.' },
    { t: 'p', text: 'O **`enum`** fecha essa porta. Uma enumeração declara, **uma única vez**, o conjunto completo de valores permitidos — `ATIVO`, `ESGOTADO`, `DESCONTINUADO` — e o compilador passa a tratar cada um como um tipo próprio: não existe "status qualquer coisa", não existe digitação errada, não existe número mágico.' },
    { t: 'p', text: 'Nesta aula você vai declarar seu primeiro enum, conhecer `values()` e `valueOf()`, entender por que comparar constantes com `==` é seguro (e comparar com `String` é armadilha), adicionar **estado e comportamento** às constantes e usá-las em `switch expression`. No final, o `StatusProduto` do catálogo do módulo estará pronto para as próximas aulas.' },
    { t: 'note', kind: 'tip', title: 'Já é uma classe', text: 'Um `enum` não é "um grupo de constantes" — é uma **classe final** gerada pelo compilador, com métodos herdados de `java.lang.Enum`. Por isso ele pode ter atributos, construtor e métodos próprios, exatamente como você aprendeu no módulo 2.' },
  ],

  theory: [
    { t: 'h2', text: 'O problema das constantes mágicas' },
    { t: 'p', text: 'Sem enum, o conjunto fechado de valores é representado de duas formas ruins. A primeira é a **string livre**: cada ponto do programa escreve o texto do seu jeito e nada impede erros. A segunda é o **número mágico**: `status = 2` compila, mas esconde o significado atrás de uma legenda que só existe na cabeça de quem escreveu.' },
    { t: 'table', headers: ['Abordagem', 'Exemplo', 'O que pode dar errado'], rows: [
      ['String livre', '`produto.setStatus("ATIV0")`', 'Vírgula no lugar do O passa reto; comparações falham em silêncio'],
      ['Número mágico', '`produto.setStatus(2)`', 'Ninguém lembra o que é 2; `setStatus(9)` também compila'],
      ['`enum`', '`produto.setStatus(StatusProduto.ATIVO)`', 'Só as constantes declaradas existem; o erro aparece na compilação'],
    ] },
    { t: 'p', text: 'Com enum, o conjunto de valores é **declarado no tipo**: `StatusProduto` só tem os três que foram escritos no bloco `enum`. Tentar `StatusProduto.valueOf("ATIV0")` falha em execução e atribuir qualquer outra coisa ao campo gera erro de compilação. A informação passa a morar no **código de uma vez só** — no lugar da declaração — em vez de estar repetida em dezenas de pontos de digitação.' },

    { t: 'h2', text: 'Declarando e usando um enum' },
    { t: 'p', text: 'A declaração usa a palavra-chave `enum` no lugar de `class`. As constantes ficam em **maiúsculas com sublinhado**, separadas por vírgula, dentro das chaves. Cada constante é um objeto do próprio tipo — e você a acessa pelo nome, como `StatusProduto.ATIVO`.' },
    { t: 'code', lang: 'java', caption: 'StatusProduto.java', code: `public enum StatusProduto {
    ATIVO,
    ESGOTADO,
    DESCONTINUADO
}

class Main {
    public static void main(String[] args) {
        StatusProduto status = StatusProduto.ATIVO;

        if (status == StatusProduto.ATIVO) {
            System.out.println("Produto disponivel para venda");
        }

        status = StatusProduto.ESGOTADO;
        System.out.println(status);   // ESGOTADO
    }
}` },
    { t: 'p', text: 'Nas linhas do `enum`, `ATIVO`, `ESGOTADO` e `DESCONTINUADO` são **declarações de constantes**, não chamadas de método: o compilador cria uma instância fixa de cada uma. No `main`, `StatusProduto.ATIVO` acessa a constante pelo nome — leia como "o ATIVO do tipo StatusProduto". A comparação `status == StatusProduto.ATIVO` funciona porque **existem apenas três instâncias no mundo**: não há "outro ATIVO" para confundir (por isso `==` é seguro aqui, ao contrário do que acontece com `String` ou com objetos comuns). Por fim, `System.out.println(status)` imprime `ESGOTADO`: ao concatenar, o enum devolve o **nome da constante**.' },
    { t: 'note', kind: 'info', title: 'Por que funciona o == ?', text: 'Cada constante de enum é um objeto **único e imutável**, criado uma vez pela JVM. `==` compara referências — e como só existe uma referência para `ATIVO`, a comparação é exata. Com `String`, `==` compararia endereços de memória e falharia mesmo com texto igual; com enum, `==` é a forma correta e barata.' },

    { t: 'h2', text: 'values(), valueOf() e a ordem das constantes' },
    { t: 'p', text: 'O compilador gera dois métodos automáticos para todo enum: **`values()`**, que devolve um array com todas as constantes **na ordem em que foram declaradas**, e **`valueOf(nome)`**, que devolve a constante cujo nome corresponde ao texto informado. São as ferramentas para percorrer e converter sem escrever a lista na mão.' },
    { t: 'code', lang: 'java', caption: 'PercorrendoEnum.java', code: `public class PercorrendoEnum {
    public static void main(String[] args) {
        StatusProduto[] todos = StatusProduto.values();
        System.out.println("Total de status: " + todos.length);   // 3

        for (StatusProduto atual : todos) {
            System.out.println(atual.ordinal() + " -> " + atual);
        }

        StatusProduto escolhido = StatusProduto.valueOf("DESCONTINUADO");
        System.out.println(escolhido == StatusProduto.DESCONTINUADO);   // true
    }
}` },
    { t: 'p', text: 'A linha `StatusProduto.values()` devolve o array completo — repare que o laço percorre com for-each, porque é um array, não uma coleção. `atual.ordinal()` devolve a **posição** da constante (começa em zero, na ordem de declaração): `0 -> ATIVO`, `1 -> ESGOTADO`, `2 -> DESCONTINUADO`. A linha `valueOf("DESCONTINUADO")` devolve a constante correspondente, e a comparação com `==` confirma `true`. Se o texto não corresponder a nenhuma constante, `valueOf` lança **`IllegalArgumentException`** em tempo de execução — o tratamento desse tipo de erro será aprofundado na próxima aula; por ora, guarde que nomes errados não passam em silêncio.' },
    { t: 'note', kind: 'warn', title: 'ordinal não é identificador', text: 'Use `ordinal()` apenas para exibir a posição em debug. Ele é a ordem de declaração: inserir uma constante no meio do enum **rearranja todos os números** e quebra qualquer coisa que os tenha salvo. Para identificar, guarde o `name()` ou um código de negócio próprio.' },

    { t: 'h2', text: 'Campos, construtor e métodos no enum' },
    { t: 'p', text: 'Aqui o enum deixa de ser "lista de nomes" e vira objeto de verdade. Assim como em qualquer classe do módulo 2, uma enumeração pode ter **atributos finais**, um **construtor** (chamado automaticamente para cada constante) e **métodos**. O caso clássico: cada status carrega uma descrição de negócio e responde por conta própria se o produto pode ser vendido.' },
    { t: 'code', lang: 'java', caption: 'StatusProduto.java', code: `public enum StatusProduto {
    ATIVO("Disponivel para venda"),
    ESGOTADO("Sem estoque no momento"),
    DESCONTINUADO("Fora de linha");

    private final String descricao;

    StatusProduto(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean isVendavel() {
        return this == ATIVO || this == ESGOTADO;
    }
}` },
    { t: 'p', text: 'Decodifique: a linha `ATIVO("Disponivel para venda"),` **invoca o construtor** passando a descrição — cada constante nasce com seu texto já preenchido. O ponto-e-vírgula após a última constante é obrigatório **quando há membros depois dela**; sem ele, o compilador reclama que esperava `;`. O campo `private final String descricao` mantém o valor imutável (encapsulamento do módulo 2) e o construtor `StatusProduto(String descricao)` recebe o texto na criação. O método `isVendavel()` usa `this == ATIVO` — comparação segura entre constantes — e devolve `true` para os dois status que permitem venda. A grande diferença em relação a um `if` espalhado: **a regra de negócio viaja junto com o dado**, em vez de morar em um método gigante que alguém esquece de atualizar quando um status novo aparece.' },
    { t: 'note', kind: 'info', title: 'Métodos abstratos por constante', text: 'Um enum também pode declarar métodos abstratos e obrigar cada constante a implementá-los — o chamado *strategy* de enum (cada constante com o próprio comportamento). É um padrão poderoso, mas use-o quando o comportamento realmente divergir por constante; para descrições e consultas simples, o estado + método daqui em cima basta.' },

    { t: 'h2', text: 'Switch expression com enum' },
    { t: 'p', text: 'O `switch` é a estrutura que mais combina com enum: um `case` por constante, sem comparação manual encadeada. Nas **switch expressions** do Java 21 (que você viu no módulo 1), a forma com `->` elimina os `break` e o compilador ainda **verifica se todas as constantes foram cobertas**.' },
    { t: 'code', lang: 'java', caption: 'RotuloDoStatus.java', code: `public class RotuloDoStatus {
    public static String rotulo(StatusProduto status) {
        return switch (status) {
            case ATIVO -> "Disponivel para venda";
            case ESGOTADO -> "Sem estoque no momento";
            case DESCONTINUADO -> "Fora de linha";
            default -> "Status desconhecido";
        };
    }

    public static void main(String[] args) {
        System.out.println(rotulo(StatusProduto.ATIVO));        // Disponivel para venda
        System.out.println(rotulo(StatusProduto.DESCONTINUADO)); // Fora de linha
    }
}` },
    { t: 'p', text: 'A linha `return switch (status) {` transforma o `switch` em **expressão**: cada ramo `case X -> "texto"` entrega um valor diretamente, sem `break` (o ramo escolhido já é o fim). A atribuição/retorno acontece em uma leitura só. Repare que o método recebe `StatusProduto`, então só faz sentido chamar `rotulo` com um status válido — os três casos cobrem o domínio inteiro, e o `default` é rede de segurança para qualquer mudança futura do enum. Compare com a alternativa antiga: uma cascata de `if (status == X) ... else if ...` que o compilador **não** audita quando um valor novo é adicionado ao enum. Aqui, esquecer um `case` em um `switch` sem `default` é erro de compilação — mais uma guarda a favor do enum.' },

    { t: 'h2', text: 'O enum no modelo de usuários e produtos' },
    { t: 'p', text: 'O encaixe final: o atributo do modelo **tipado pelo enum**. Em vez de `String status` no `Produto`, o campo é `StatusProduto status` — e quem chama o setter não tem como passar lixo. O mesmo vale para perfis de usuário: `PerfilUsuario.ADMIN` em vez de `"admin"` perdido em cada camada.' },
    { t: 'code', lang: 'java', caption: 'Usuario.java', code: `enum PerfilUsuario {
    ADMIN,
    EDITOR,
    LEITOR
}

public class Usuario {
    private String email;
    private PerfilUsuario perfil;

    public Usuario(String email, PerfilUsuario perfil) {
        this.email = email;
        this.perfil = perfil;
    }

    public String getEmail() {
        return email;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public boolean podeEditar() {
        return perfil == PerfilUsuario.ADMIN || perfil == PerfilUsuario.EDITOR;
    }
}` },
    { t: 'p', text: 'Nas linhas da classe, `private PerfilUsuario perfil;` declara o campo com o **tipo do enum** — `usuario.setPerfil("qualquercoisa")` nem existiria como hipótese. O construtor recebe `PerfilUsuario perfil` e guarda a referência direta. Em `podeEditar()`, a regra de permissão é lida em uma linha: admin e editor editam, leitor não. Repare na coerência com o módulo 2: os atributos seguem privados, os getters expõem leitura, e a decisão de negócio fica **na classe que possui o dado**. Quando você integrar usuários e produtos com as coleções das aulas anteriores, nada muda na sintaxe: `Set<String>` vira `Set<PerfilUsuario>`, `List<Produto>` ganha `StatusProduto` no modelo, e o compilador continua garantindo o conteúdo.' },
  ],

  commonMistakes: [
    { title: 'Comparar enum com String usando equals', text: '`status.equals("ATIVO")` **compila** (o método recebe `Object`) e devolve sempre `false`, porque um enum nunca é igual a uma `String`. O resultado é um `if` que nunca entra, sem nenhum aviso. Compare com `==` entre constantes do mesmo enum, ou use `StatusProduto.valueOf(texto)` antes de comparar.' },
    { title: 'Usar ordinal como identificador persistido', text: 'Salvar `status.ordinal()` em banco ou arquivo e depois inserir uma constante no meio do enum muda a posição de todos: os números gravados passam a significar outro status. Para identificar, guarde `name()` (o texto da constante) ou um código de negócio explícito no construtor.' },
    { title: 'Instanciar o enum com new', text: '`new StatusProduto()` não compila: as constantes são criadas pelo próprio Java e a classe é `final`. Não há como fabricar um "quarto status" fora da lista declarada — e isso é o propósito, não uma limitação.' },
    { title: 'Espalhar if/else em vez de switch no enum', text: 'Uma cascata de `if (s == A) ... else if (s == B)` não é auditada pelo compilador: ao adicionar uma constante, todos os pontos de decisão precisam ser caçados manualmente. O `switch` sobre o enum avisa quando falta ramo (em switch expression sem `default`) e deixa a decisão visível em um bloco só.' },
    { title: 'Manter o status como String "por simplicidade"', text: 'O que parece simples custa caro: validação repetida, textos divergentes entre telas e comparações que falham em silêncio. Com enum, a validação é **grátis** (o tipo garante) e a leitura do código não depende de ninguém lembrar qual grafia está correta.' },
  ],

  bestPractices: [
    { title: 'Use enum para qualquer conjunto fixo de valores', text: 'Status, perfis, prioridades, categorias, fases: sempre que o domínio tem um número finito e definido de opções, o enum é a escolha — mais do que String validada e muito mais do que int com legenda.' },
    { title: 'Declare constantes em maiúsculas com sublinhado', text: '`ATIVO`, `EM_ANDAMENTO`: a convenção deixa a constante visível em meio ao código e a distingue imediatamente de variáveis locais, atributos e métodos.' },
    { title: 'Compare com == e nunca com equals/String', text: 'Entre constantes do mesmo enum, `==` é correto, barato e à prova de nulo (`null == StatusProduto.ATIVO` é `false`, sem exceção). `equals` com texto é a porta de entrada do bug silencioso.' },
    { title: 'Leve estado e comportamento para dentro do enum', text: 'Descrição, regra de transição, rótulo de tela: quando a informação pertence à constante, coloque-a no enum com campo e método. O `switch` diminui e o novo status passa a exigir exatamente o que precisa ser implementado.' },
    { title: 'Guarde o name(), não o ordinal()', text: '`name()` é estável mesmo com mudanças na ordem de declaração; `ordinal()` não é. Se precisar de um identificador numérico para persistência, declare um campo de código no próprio enum e o controle inteiro continua no seu domínio.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      '`enum` declara um **conjunto fixo de constantes** e o compilador vira o guardião dos valores permitidos.',
      'Por baixo, o enum é uma **classe final** com instâncias únicas — por isso `==` é a comparação correta entre constantes.',
      '`values()` devolve o array na **ordem de declaração**; `valueOf(nome)` converte texto em constante (e lança `IllegalArgumentException` se não achar).',
      'Enums aceitam **atributo final, construtor e método**: `ATIVO("Disponivel para venda")` já nasce com descrição e comportamento.',
      '`ordinal()` é posição, não identificador: não persista — use `name()` ou um código de negócio.',
      'Em `switch` com `->`, cada constante vira um ramo; esquecer um caso sem `default` é **erro de compilação**.',
      'No modelo, tipar o campo (`StatusProduto status`, `PerfilUsuario perfil`) elimina textos inválidos de ponta a ponta.',
      'Substituir `"ATIVO"` e `2` por `StatusProduto.ATIVO` troca validação espalhada por uma verificação feita uma vez, no compilador.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você aprofunda o tratamento de erros já visto no módulo 1: hierarquia de exceções, `try`/`catch`/`finally`, `throw` e `throws` em métodos de verdade — inclusive o `IllegalArgumentException` que o `valueOf` lança.' },
  ],

  exercises: [
    {
      id: 'm3l05e1',
      type: 'mc',
      question: 'Qual é o principal motivo para representar o status de um produto com `enum` em vez de `String`?',
      options: [
        'Enums são executados mais rápido que Strings',
        'O compilador limita os valores às constantes declaradas, eliminando textos inválidos',
        'String não pode ser usada como atributo de classe',
        'Enum ocupa menos memória em disco',
      ],
      answer: 1,
      explanation: 'O ganho é **segurança e legibilidade**: só as constantes existem no tipo, o compilador recusa qualquer outra coisa e o leitor do código vê o domínio inteiro declarado em um lugar. Velocidade e tamanho de memória podem até diferir, mas não são a razão de adotar enum — e `String` é perfeitamente válida como atributo, apenas sem a proteção do tipo.',
    },
    {
      id: 'm3l05e2',
      type: 'code',
      question: 'Analise o trecho. Qual saída a linha final imprime?',
      code: 'enum StatusProduto { ATIVO, INATIVO, DESCONTINUADO }\n\nStatusProduto s = StatusProduto.valueOf("INATIVO");\nSystem.out.println(s + " | " + StatusProduto.values().length + " | " + (s == StatusProduto.INATIVO));',
      lang: 'java',
      options: ['INATIVO | 3 | true', 'INATIVO | 3 | false', 'null | 3 | true', 'Erro em tempo de execução: valueOf não existe'],
      answer: 0,
      explanation: '`valueOf("INATIVO")` devolve a constante correspondente, que na concatenação aparece como `INATIVO`. `values().length` conta as constantes declaradas: `3`. E `s == StatusProduto.INATIVO` é `true` — é a mesma instância. A saída é `INATIVO | 3 | true`. O método `valueOf` existe em todo enum (é gerado pelo compilador).',
    },
    {
      id: 'm3l05e3',
      type: 'tf',
      question: 'O array devolvido por `values()` apresenta as constantes na mesma ordem em que foram declaradas no bloco do enum.',
      answer: true,
      explanation: 'A ordem de declaração é preservada: se o enum declara `ATIVO, ESGOTADO, DESCONTINUADO`, `values()` devolve nessa sequência — e `ordinal()` devolve 0, 1 e 2 respectivamente. Essa ordem é estável **enquanto ninguém mexer na declaração**; por isso ela serve para exibição, mas não como identificador persistido.',
    },
    {
      id: 'm3l05e4',
      type: 'short',
      question: 'Explique por que `status.equals("ATIVO")` é perigoso em Java e qual é a comparação correta entre constantes de enum.',
      keywords: [
        ['compila', 'falso', 'false'],
        ['string', 'texto'],
        ['==', 'iguais', 'referencia', 'referência', 'mesma instancia', 'mesma instância'],
      ],
      answerText: 'status.equals("ATIVO") compila porque equals aceita Object, mas compara um enum com uma String e devolve sempre false, fazendo o if nunca entrar. A comparação correta é usar == entre as constantes do mesmo enum, já que cada constante é uma instância única.',
      explanation: 'O perigo é o **erro silencioso**: sem mensagem de compilação e sem exceção, o programa simplesmente não entra no ramo esperado e o bug só aparece na auditoria do comportamento. `==` é seguro entre constantes (instâncias únicas) e ainda trata `null` sem lançar exceção. Se a comparação parte de um texto, converta primeiro com `StatusProduto.valueOf(texto)` e depois compare com `==`.',
    },
    {
      id: 'm3l05e5',
      type: 'code',
      question: 'Qual valor a variável `acao` recebe no final?',
      code: 'enum Perfil { ADMIN, EDITOR, LEITOR }\n\nPerfil p = Perfil.EDITOR;\nString acao = switch (p) {\n    case ADMIN -> "gerenciar usuarios";\n    case EDITOR -> "editar conteudo";\n    default -> "somente leitura";\n};\nSystem.out.println(acao);',
      lang: 'java',
      options: ['gerenciar usuarios', 'editar conteudo', 'somente leitura', 'Erro de compilacao: falta break em cada caso'],
      answer: 1,
      explanation: 'A switch expression com `->` escolhe o ramo correspondente ao valor: `p` vale `Perfil.EDITOR`, então o ramo `case EDITOR` entrega `"editar conteudo"`. A forma com `->` **não exige `break`** (cada ramo termina sozinho), e como há `default`, a expressão é completa mesmo que um valor novo apareça. Se `p` fosse `LEITOR`, o `default` responderia "somente leitura".',
    },
  ],

  challenge: {
    id: 'm3l05c1',
    title: 'Status do produto no catalogo',
    fileName: 'Main.java',
    prompt: 'Em Java 21, crie o sistema de status do catálogo de produtos. No arquivo `Main.java`, declare o enum `StatusProduto` com as constantes `ATIVO`, `ESGOTADO` e `DESCONTINUADO`, cada uma recebendo no construtor uma `descricao` (String final, com getter). Crie a classe `Produto` com `nome` (String), `preco` (double) e `status` (**do tipo `StatusProduto`**, não String), com construtor e getters. Crie no `Main` um método `rotulo(StatusProduto)` que use **switch expression com `->`**, cobrindo todas as constantes mais `default`, devolvendo um texto por status. No `main`, monte uma lista com pelo menos 4 produtos em status diferentes, imprima cada um no formato `Teclado mecanico - Disponivel para venda` (nome + descrição via getter), e conte/imprima a quantidade de produtos em cada status nas linhas `ATIVO: n`, `ESGOTADO: n` e `DESCONTINUADO: n`.',
    starterCode: `import java.util.ArrayList;
import java.util.List;

// 1. Declare enum StatusProduto com ATIVO, ESGOTADO, DESCONTINUADO,
//    campo descricao final, construtor e getDescricao()

// 2. Declare class Produto com nome, preco e status (tipo StatusProduto)

public class Main {
    // 3. String rotulo(StatusProduto s) -> switch expression com -> e default

    public static void main(String[] args) {
        // 4. Lista com ao menos 4 produtos em status diferentes

        // 5. Imprimir "nome - descricao" de cada produto

        // 6. Contar e imprimir ATIVO: n / ESGOTADO: n / DESCONTINUADO: n
    }
}`,
    criteria: [
      'O enum `StatusProduto` declara exatamente as constantes ATIVO, ESGOTADO e DESCONTINUADO em maiúsculas, com campo `descricao` final, construtor recebendo a String e método `getDescricao()`',
      'A classe `Produto` possui o atributo `status` declarado como `StatusProduto` (não `String`), com construtor e getters',
      'O método `rotulo` usa switch expression com `->` (sem break), cobrindo as três constantes e mantendo um ramo `default`',
      'O `main` cria uma lista com ao menos 4 produtos distribuídos entre os três status e imprime cada um no formato `nome - descricao` usando `getDescricao()`',
      'O programa conta e imprime as três linhas `ATIVO: n`, `ESGOTADO: n` e `DESCONTINUADO: n` com os totais corretos',
      'Nenhuma comparação é feita com String (uso de `==` entre constantes ou switch) e não há lambdas, streams nem recursos de aulas futuras',
    ],
    modelSolution: [
      { t: 'p', text: 'A solução reúne enum com estado, modelo tipado e switch expression. A contagem por status usa três contadores simples — com `Map` (aula 3) você também poderia, mas o objetivo aqui é fixar o enum e o `switch`.' },
      { t: 'code', lang: 'java', caption: 'Main.java', code: `import java.util.ArrayList;
import java.util.List;

enum StatusProduto {
    ATIVO("Disponivel para venda"),
    ESGOTADO("Sem estoque no momento"),
    DESCONTINUADO("Fora de linha");

    private final String descricao;

    StatusProduto(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}

class Produto {
    private String nome;
    private double preco;
    private StatusProduto status;

    public Produto(String nome, double preco, StatusProduto status) {
        this.nome = nome;
        this.preco = preco;
        this.status = status;
    }

    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }

    public StatusProduto getStatus() {
        return status;
    }
}

public class Main {
    public static String rotulo(StatusProduto status) {
        return switch (status) {
            case ATIVO -> "Disponivel para venda";
            case ESGOTADO -> "Sem estoque no momento";
            case DESCONTINUADO -> "Fora de linha";
            default -> "Status desconhecido";
        };
    }

    public static void main(String[] args) {
        List<Produto> produtos = new ArrayList<>();
        produtos.add(new Produto("Teclado mecanico", 250.0, StatusProduto.ATIVO));
        produtos.add(new Produto("Monitor 24", 950.0, StatusProduto.ATIVO));
        produtos.add(new Produto("Mouse wireless", 80.0, StatusProduto.ESGOTADO));
        produtos.add(new Produto("Leitor de DVD", 150.0, StatusProduto.DESCONTINUADO));

        int ativo = 0;
        int esgotado = 0;
        int descontinuado = 0;

        for (Produto produto : produtos) {
            System.out.println(produto.getNome() + " - " + produto.getStatus().getDescricao());
            if (produto.getStatus() == StatusProduto.ATIVO) {
                ativo++;
            } else if (produto.getStatus() == StatusProduto.ESGOTADO) {
                esgotado++;
            } else {
                descontinuado++;
            }
        }

        System.out.println("ATIVO: " + ativo);
        System.out.println("ESGOTADO: " + esgotado);
        System.out.println("DESCONTINUADO: " + descontinuado);
        System.out.println("Rotulo do primeiro: "
                + rotulo(produtos.get(0).getStatus()));
    }
}` },
      { t: 'p', text: 'A saída lista os quatro produtos com suas descrições (`Teclado mecanico - Disponivel para venda`, `Mouse wireless - Sem estoque no momento`, `Leitor de DVD - Fora de linha`) e fecha com `ATIVO: 2`, `ESGOTADO: 1`, `DESCONTINUADO: 1`. Repare em `produto.getStatus().getDescricao()`: o getter devolve a constante e a constante responde com a própria descrição — estado e comportamento juntos, como a aula previu. As comparações usam `==` entre constantes, e a chamada final mostra o `rotulo` (switch expression) funcionando como função pura sobre o enum. Se quiser testar a proteção do tipo, tente passar uma `String` ao construtor de `Produto`: o compilador recusa na hora.' },
    ],
  },
}
