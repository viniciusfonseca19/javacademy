export default {
  id: 'm3l06',
  moduleId: 'm3',
  number: 6,
  title: 'Exceções: try, catch, finally, throw e throws',
  durationMinutes: 26,

  objectives: [
    'Distinguir Error, exceções checked e unchecked na hierarquia Throwable',
    'Usar try, catch e finally com segurança, inclusive em métodos com return',
    'Lançar exceções com throw e declarar riscos com throws na assinatura',
    'Escolher a ordem correta dos blocos catch e evitar erros que engolem a causa',
    'Aplicar try-with-resources em recursos que precisam ser fechados',
  ],

  prerequisites: [
    'Ter concluído a aula 13 do módulo 1, Introdução ao tratamento de erros',
    'Usar try, catch e finally e distinguir throw de throws em código simples',
    'Ter concluído as aulas de List, Set, Map e enum deste módulo (os exemplos usam essas estruturas)',
    'Entender assinatura de métodos, parâmetros e retorno (módulos 1 e 2)',
  ],

  intro: [
    { t: 'p', text: 'No módulo 1 você aprendeu o básico: capturar uma exceção, relançar uma e liberar recursos com `finally`. Esta aula é o **aproveitamento** desses fundamentos. O objetivo é sair do exemplo isolado para o código de produção: saber **qual** exceção capturar, **em que ordem**, **quando** lançar em vez de tratar, **o que** declarar na assinatura do método e por que o `finally` executa mesmo quando existe `return` no meio.' },
    { t: 'p', text: 'Tratar erros é o que separa um programa de demonstração de um sistema que aguenta entrada suja, dados ausentes e falhas de recurso sem derrubar o servidor. Toda API REST que você construirá a partir do módulo 4 depende dessa base: os `try`/`catch` das camadas de serviço, a validação que lança exceção e o tratamento global que devolve a resposta correta ao cliente.' },
    { t: 'p', text: 'Nesta aula você percorre a hierarquia `Throwable` (e aprende a diferença entre `Error`, exceções *checked* e *unchecked*), aprofunda o ciclo `try`/`catch`/`finally`, usa `throw` para validar dados de negócio, usa `throws` para avisar quem chama, entende a regra da **ordem dos blocos `catch`** e conhece o `try-with-resources`, o padrão que fecha recursos sozinho.' },
    { t: 'note', kind: 'info', title: 'O que fica para a frente', text: 'Criar **exceções personalizadas** do domínio (como `ProdutoNaoEncontradoException`) é o tema da aula 7. Aqui trabalhamos com as exceções que o Java já traz — `IllegalArgumentException`, `NumberFormatException`, `ParseException` e companhia.' },
  ],

  theory: [
    { t: 'h2', text: 'A hierarquia Throwable: Error, Exception e RuntimeException' },
    { t: 'p', text: 'Uma **exceção** é um evento que interrompe o fluxo normal de execução: algo inesperado aconteceu e o Java "joga" um objeto de exceção do ponto da falha até o ponto que souber tratá-lo. Todos esses objetos descendem de `java.lang.Throwable`, e a árvore tem três ramos que você precisa distinguir na hora de decidir o que fazer.' },
    { t: 'table', headers: ['Categoria', 'Exemplos', 'O que fazer'], rows: [
      ['`Error`', '`OutOfMemoryError`, `StackOverflowError`', 'Falha grave da JVM ou do sistema: **não se trata**; o programa deve morrer e a causa ser investigada'],
      ['`RuntimeException` (unchecked)', '`NullPointerException`, `IndexOutOfBoundsException`, `IllegalArgumentException`, `NumberFormatException`, `ArithmeticException`', 'Erros de programação ou de dados: o compilador **não exige** tratamento; trate só quando puder reagir'],
      ['Demais `Exception` (checked)', '`IOException`, `ParseException`, `SQLException`', 'Falhas previsíveis de ambiente: o compilador **exige** `try/catch` ou `throws`'],
    ] },
    { t: 'p', text: 'As *checked* (verificáveis) recebem esse nome porque **o compilador verifica o tratamento**: se um método pode lançar `ParseException` e ninguém trata nem declara, o build nem começa. Já as *unchecked* são opcionais — mas "opcional" não significa "ignorável": significa que a decisão de tratar é sua, conforme a situação. A regra de bolso: **`Error` não se trata, `checked` se resolve obrigatoriamente, `unchecked` se trata quando há reação útil** (se não há, deixar propagar é legítimo).' },
    { t: 'note', kind: 'tip', title: 'De onde vêm as unchecked', text: 'Praticamente todas as exceções de uso errado de API (índice inválido, argumento nulo, número malformado) são `RuntimeException`. Elas indicam **bug no código** ou **entrada inválida**, não falha de infraestrutura — por isso o compilador não força você a cercá-las em cada chamada.' },

    { t: 'h2', text: 'try, catch e finally: o fluxo completo' },
    { t: 'p', text: 'A estrutura tem três blocos com papéis distintos. O `try` **cercia** o código arriscado; se uma exceção acontecer ali, a execução pula para o `catch` compatível; o `finally` é executado **sempre** — com exceção, sem exceção, mesmo com `return` pendurado. Ele é o lugar de limpeza (fechar recurso, encerrar mensagem, liberar trava).' },
    { t: 'code', lang: 'java', caption: 'LeituraDePrecos.java', code: `public class LeituraDePrecos {
    public static void main(String[] args) {
        String entrada = "12,50";

        try {
            double preco = Double.parseDouble(entrada);
            System.out.println("Preco: " + preco);
        } catch (NumberFormatException e) {
            System.out.println("Numero invalido: " + entrada);
        } finally {
            System.out.println("Fim da leitura.");
        }
    }
}` },
    { t: 'p', text: 'Veja o percurso linha a linha: a linha `double preco = Double.parseDouble(entrada);` tenta converter `"12,50"` — como o Java espera ponto, não vírgula, o método lança `NumberFormatException` **ali mesmo**. A execução descontinua o `try` (a linha seguinte nunca roda) e procura um `catch` compatível: `NumberFormatException` casa, e a mensagem `Numero invalido: 12,50` é impressa. Em seguida, **independentemente do caminho**, o `finally` roda e imprime `Fim da leitura.`. Se a entrada fosse `"12.50"`, o `try` completaria, a linha de preço imprimiria `Preco: 12.5` e o `finally` continuaria rodando — ele não é "plano B do erro", é **garantia de execução**.' },
    { t: 'p', text: 'Dois detalhes de projeto neste exemplo: o `catch` é **específico** (`NumberFormatException`, não `Exception`), então ele trata exatamente o tipo de falha que aquele bloco pode produzir; e a variável `e` dá acesso à causa (`e.getMessage()`, `e.toString()`), informação essencial para depuração — descartá-la transforma um erro rastreável em um mistério.' },
    { t: 'p', text: 'A promessa do `finally` é tão forte que sobrevive até a decisão de sair do método com `return`. Esse comportamento tem duas consequências: uma boa (limpeza garantida) e uma péssima (é possível sabotar o retorno de propósito, sem querer).' },
    { t: 'code', lang: 'java', caption: 'ArmadilhaDoFinally.java', code: `public class ArmadilhaDoFinally {
    static int exemplo() {
        try {
            return 10;
        } finally {
            System.out.println("finally executou");
        }
    }

    static int armadilha() {
        try {
            return 10;
        } finally {
            return 20;   // EVITE: sobrescreve o retorno do try
        }
    }

    public static void main(String[] args) {
        System.out.println(exemplo());    // imprime "finally executou" e devolve 10
        System.out.println(armadilha());  // devolve 20, sem imprimir nada
    }
}` },
    { t: 'p', text: 'Em `exemplo()`, a ordem real é: o `try` prepara o retorno `10`; antes de entregar, o `finally` executa e imprime `finally executou`; só então o método devolve `10`. Ou seja, **`finally` roda entre a decisão de retornar e a entrega do valor**. Já `armadilha()` mostra o perigo: um `return` **dentro do `finally` sobrescreve** o valor do `try` — o método devolve `20` e nem imprime nada (o `return` do `finally` cancela a pendência do `try`). Use `finally` para **limpeza** (fechar, avisar, registrar); valores de retorno devem sair do `try` ou do `catch`.' },

    { t: 'h2', text: 'throw: quem lança a exceção' },
    { t: 'p', text: 'Até aqui as exceções vinham dos métodos da biblioteca. Agora você as **produz**: a palavra-chave **`throw`** (sem `s`, uma) cria a exceção e interrompe a execução naquele ponto — o restante do bloco não roda e o controle procura um `catch`. Para argumentos inválidos, a escolha padrão é `IllegalArgumentException`: a mensagem deve dizer **o que** falhou e **com qual valor**.' },
    { t: 'code', lang: 'java', caption: 'EstoqueValidado.java', code: `public class EstoqueValidado {
    public static void registrarEntrada(String sku, int quantidade) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU obrigatorio");
        }
        if (quantidade <= 0) {
            throw new IllegalArgumentException(
                    "Quantidade invalida: " + quantidade);
        }
        System.out.println("Entrada registrada: " + quantidade + " un. de " + sku);
    }

    public static void main(String[] args) {
        try {
            registrarEntrada("SKU-100", 10);
            registrarEntrada("SKU-200", -5);
        } catch (IllegalArgumentException e) {
            System.out.println("Dados rejeitados: " + e.getMessage());
        } finally {
            System.out.println("Processamento encerrado.");
        }
    }
}` },
    { t: 'p', text: 'Leia a execução: a primeira chamada passa nas duas validações e imprime `Entrada registrada: 10 un. de SKU-100`. Na segunda, `quantidade <= 0` é `true`, então a linha `throw new IllegalArgumentException(...)` executa — **a linha `System.out.println` seguinte é pulada**, e o controle sobe para o `try` do `main`, que encontra o `catch` compatível e imprime `Dados rejeitados: Quantidade invalida: -5` (o texto veio de `e.getMessage()`). Por fim, o `finally` imprime `Processamento encerrado.`. Note que `IllegalArgumentException` é **unchecked**: por isso `registrarEntrada` não declara `throws` nenhum — a linguagem não exige. Repare também que a primeira condição usa `sku.isBlank()`, que devolve `true` para string vazia ou só com espaços.' },
    { t: 'p', text: 'Há um princípio importante em jogo: **lançar é mais honesto do que devolver código de erro**. Se `registrarEntrada` devolvesse `false` para quantidade negativa, o chamador poderia seguir trabalhando como se nada houvesse; com exceção, a execução **para** até alguém reagir. E há um custo correspondente: quem lança assume que o chamador sabe tratar — por isso existe a outra palavra-chave.' },

    { t: 'h2', text: 'throws: declarando o risco na assinatura' },
    { t: 'p', text: 'A palavra **`throws`** (com `s`) não lança nada: ela **avisa na assinatura do método** que ele pode propagar exceções *checked*. O compilador propaga essa obrigação para o chamador, que decide: tratar ali ou declarar na própria assinatura, repassando mais para cima. É o contrato que impede falha ignorada.' },
    { t: 'code', lang: 'java', caption: 'CadastroComData.java', code: `import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CadastroComData {
    public static Date lerDataCadastro(String texto) throws ParseException {
        SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
        formato.setLenient(false);
        return formato.parse(texto);
    }

    public static void main(String[] args) {
        try {
            Date data = lerDataCadastro("31/12/2026");
            System.out.println("Data aceita: " + data);
        } catch (ParseException e) {
            System.out.println("Data invalida: " + e.getMessage());
        }
    }
}` },
    { t: 'p', text: 'A linha `public static Date lerDataCadastro(String texto) throws ParseException {` é o anúncio: este método converte texto em data **e pode falhar** com `ParseException`. Dentro, `SimpleDateFormat` é o formatador da biblioteca (`dd/MM/yyyy` define o padrão) e `formato.setLenient(false)` torna a validação **rigorosa** — sem isso, `31/02/2026` seria "aceito" virando 2 de março, um erro silencioso. A linha `return formato.parse(texto);` é quem lança de fato a exceção quando o texto não casa com o padrão. Agora a parte central: o `main` envolve a chamada em `try` e trata com `catch (ParseException e)`. Se você **removesse** o `try/catch` e não escrevesse `throws` no `main`, o compilador pararia a build com *"unreported exception ParseException; must be caught or declared"* — é essa obrigação automática que caracteriza as exceções *checked*.' },
    { t: 'note', kind: 'info', title: 'Por que ParseException, e não outra?', text: '`ParseException` é uma escolha didática: é *checked* e nasce de um caso real (conversão de data). A API moderna `java.time.LocalDate.parse(texto)` lança `DateTimeParseException`, que é *unchecked* — a mesma ideia de validação, tratamento opcional. Nos módulos de Spring, verá `SQLException` e exceções de framework; a lógica de propagar com `throws` e capturar no ponto certo é a mesma.' },

    { t: 'h2', text: 'A ordem dos catch: da específica para a geral' },
    { t: 'p', text: 'Vários blocos `catch` podem coexistir, e **a ordem importa**: o Java testa de cima para baixo e para no primeiro que casar. Se a geral vier primeiro, a específica fica **inalcançável** — e o compilador recusa o código. A regra é simples: **da subclasse para a superclasse**.' },
    { t: 'code', lang: 'java', caption: 'OrdemDosCatch.java (nao compila)', code: `public class OrdemDosCatch {
    public static void main(String[] args) {
        String entrada = "abc";

        try {
            int numero = Integer.parseInt(entrada);
            System.out.println(100 / numero);
        } catch (Exception e) {
            System.out.println("Erro geral");
        } catch (NumberFormatException e) {
            System.out.println("Numero invalido");
        }
    }
}` },
    { t: 'p', text: 'Este arquivo **não compila**. `NumberFormatException` é subclasse de `Exception`; como o `catch (Exception e)` aparece primeiro, qualquer falha já seria capturada por ele, e o bloco seguinte nunca teria chance de rodar. O compilador acusa: *"exception NumberFormatException is already caught by the corresponding handler of type Exception"*. A versão correta inverte a ordem: `catch (NumberFormatException e)` antes de `catch (Exception e)`. Quando o tipo de falha é o mesmo em ramos diferentes, o Java aceita **multi-catch** — `catch (NumberFormatException | IndexOutOfBoundsException e)` — unindo os casos em um bloco só, desde que as exceções não tenham relação de subclasse entre si.' },
    { t: 'p', text: 'Da ordem nasce a segunda regra: **capture o mais específico que você sabe tratar**. Um `catch (Exception)` genérico no meio do caminho engole as particularidades de cada falha e transforma o tratamento em uma frase genérica. Ele só tem lugar em pontos finais de propagação — como o tratador global de erros que você montará no módulo 4 com `@RestControllerAdvice` —, e mesmo lá ele registra a causa completa antes de responder.' },

    { t: 'h2', text: 'Nunca engole o erro' },
    { t: 'p', text: 'O pior código de tratamento não é o que propaga errado — é o que **finge que nada aconteceu**. Um `catch` vazio mantém o programa rodando com o dado inconsistente e apaga a única pista do problema. Pelo menos registre a causa; melhor ainda, reaja ou propague.' },
    { t: 'ul', items: [
      '**Catch vazio** (`catch (Exception e) { }`): o erro desaparece sem rastro — proibido em código sério.',
      '**Registrar sem reagir** (só imprimir e seguir): aceitável apenas quando o fluxo realmente pode continuar sem aquele dado.',
      '**Capturar e relançar genérico** (`catch (Exception e) { throw new RuntimeException(e); }`) sem necessidade: perde o contexto e empilha ruído.',
      '**Tratar `Error`**: `OutOfMemoryError` não é problema de dado inválido; tratá-lo costuma mascarar o sintoma de um vazamento de memória.',
    ] },
    { t: 'note', kind: 'danger', title: 'A causa importa mais que a mensagem', text: 'Ao registrar ou relançar, **preserve a causa**: `throw new RuntimeException("falha ao processar", e)` e `e.printStackTrace()` mantêm a pilha original. Uma mensagem digitada à mão sem a causa não diz onde o problema começou — e é exatamente quando mais se precisa disso.' },

    { t: 'h2', text: 'try-with-resources: fechamento garantido' },
    { t: 'p', text: 'Recursos como leitores, escritores e conexões de banco precisam ser **fechados**, mesmo quando algo dá errado no meio. O padrão manual (abrir no `try`, fechar no `finally`) funciona, mas é verboso e propenso a esquecimento. Desde o Java 7 existe o **try-with-resources**: o recurso declarado entre parênteses após `try` é **fechado automaticamente** ao terminar o bloco — com ou sem exceção.' },
    { t: 'code', lang: 'java', caption: 'LeituraComRecurso.java', code: `import java.util.Scanner;

public class LeituraComRecurso {
    public static void main(String[] args) {
        String dados = "42 100";

        try (Scanner scanner = new Scanner(dados)) {
            int numero = scanner.nextInt();
            int limite = scanner.nextInt();
            System.out.println("numero=" + numero + ", limite=" + limite);
        } finally {
            System.out.println("Recurso encerrado.");
        }
    }
}` },
    { t: 'p', text: 'A linha `try (Scanner scanner = new Scanner(dados))` declara o recurso **na própria abertura**: o `Scanner` (classe da biblioteca padrão que lê texto e o converte em números, entre outras coisas) nasce ali e é **fechado sozinho** quando o bloco termina — nem que uma exceção interrompa a execução. Você não escreve `scanner.close()` em lugar nenhum, e não há risco de esquecer. O `finally` do exemplo continua opcional e livre para fazer outra limpeza (aqui, a mensagem). Em contrapartida, os recursos fechados automaticamente precisam implementar `AutoCloseable` — e é o caso justamente do que você usará nos módulos adiante: leitores de arquivo, streams e a **conexão de banco de dados** do módulo 5.' },
    { t: 'note', kind: 'info', title: 'A sintaxe completa', text: 'O formato aceita `catch` e `finally` depois do bloco de recursos: `try (Recurso r = abrir()) { ... } catch (Excecao e) { ... } finally { ... }`. Vários recursos podem ser declarados, separados por ponto e vírgula, e são fechados na ordem inversa da abertura.' },

    { t: 'h2', text: 'Quando tratar e quando propagar' },
    { t: 'p', text: 'A decisão que separa código maduro de código amador: **só trate uma exceção se você puder reagir de forma útil** (corrigir, compensar, informar o usuário com clareza). Caso contrário, propague — deixe quem tem contexto decidir. Em camadas de sistema, o padrão é a exceção subir até um ponto único de tratamento.' },
    { t: 'table', headers: ['Situação', 'Decisão'], rows: [
      ['Argumento inválido recebido pelo método', '`throw new IllegalArgumentException` com o valor na mensagem'],
      ['Falha que o chamador pode corrigir (texto malformado, data inválida)', 'Tratar no ponto e pedir nova entrada, ou propagar com `throws` se o chamador decide'],
      ['Falha de recurso externo (arquivo, rede, banco)', 'Propagar com `throws` até quem sabe se a operação pode ser repetida'],
      ['Erro interno do programa (null indevido, índice errado)', 'Corrigir o bug — a exceção é sintoma, não a doença'],
      ['Falha grave da JVM (`Error`)', 'Não tratar; deixar o processo falhar e investigar'],
    ] },
    { t: 'p', text: 'Em síntese: **`throw`** é a sua ação de alerta no corpo do método; **`throws`** é o aviso formal na assinatura; **`catch`** é a reação; **`finally`** é a limpeza garantida; e o **try-with-resources** automatiza o fechamento de recursos. Combinados, essas cinco peças descrevem qualquer tratamento de erro bem-feito que você verá daqui para frente — inclusive no tratamento global de exceções da API REST do módulo 4.' },
  ],

  commonMistakes: [
    { title: 'Colocar return dentro do finally', text: 'Um `return` no `finally` **sobrescreve** o valor de retorno do `try` e do `catch`, e ainda cancela exceções pendentes de serem lançadas. O método devolve algo que ninguém esperava, sem qualquer aviso. Deixe o `finally` apenas para limpeza e mensagens; valores saem do `try`/`catch`.' },
    { title: 'Deixar o catch vazio', text: '`catch (Exception e) { }` apaga o erro e mantém o programa rodando com estado possivelmente inconsistente — o bug aparecerá depois, longe da causa. Pelo menos registre a exceção com a causa (`e.printStackTrace()` em protótipo, log em produção); se não há nada a fazer ali, propague.' },
    { title: 'Inverter a ordem dos catch', text: 'Capturar `Exception` antes de `NumberFormatException` é erro de compilação: a específica nunca seria alcançável. Anote da subclasse para a superclasse — e quando os tipos forem irmãos, uni-los com multi-catch (`catch (A | B e)`) em vez de duplicar o corpo.' },
    { title: 'Achar que finally executa só quando há erro', text: 'O `finally` roda **sempre**: com exceção, sem exceção e até com `return` pendente (entre a decisão e a entrega). Quem escreve código de limpeza condicional dentro do `try` acaba deixando recursos abertos no caminho feliz — exatamente onde menos se espera problema.' },
    { title: 'Tratar checked e unchecked do mesmo jeito', text: 'Capturar `ParseException` só para reescrever a mensagem e deixar o fluxo falhar em silêncio é tão ruim quanto ignorar `NullPointerException`. Cada exceção pede uma reação: corrigir entrada, avisar quem chamou, registrar para auditoria ou simplesmente propagar — nunca apenas "passar por cima".' },
  ],

  bestPractices: [
    { title: 'Capture o mais específico possível', text: '`catch (NumberFormatException)` diz exatamente o que falhou e permite reagir de forma precisa. Reserve `catch (Exception)` para pontos finais de tratamento (globais), onde a tarefa é registrar tudo e responder ao cliente.' },
    { title: 'Preserve a causa ao relançar', text: 'Quando converter uma exceção em outra, passe a original: `throw new RuntimeException("falha ao processar pedido", e)`. A pilha da causa é o que permite reconstruir o histórico do erro na produção.' },
    { title: 'Use finally para limpeza, não para negócio', text: 'Fechar recursos, liberar travas, imprimir encerramento: o `finally` é o lugar de garantir que algo acontece. Lógica de valor (o que retornar, o que responder) fica no `try` e no `catch`.' },
    { title: 'Prefira try-with-resources para recursos', text: 'Leitores, escritores e conexões declarados entre parênteses do `try` são fechados automaticamente, mesmo com exceção. É menos código, menos esquecimento e menos vazamento de file handle ou conexão.' },
    { title: 'Lance IllegalArgumentException para argumentos inválidos', text: 'É a convenção do próprio Java: null indevido, número fora da faixa, formato errado. Inclua o valor recebido na mensagem — "Quantidade invalida: -5" diagnostica em segundos o que "argumento inválido" levaria minutos.' },
  ],

  summary: [
    { t: 'p', text: 'Resumo da aula em um minuto:' },
    { t: 'ul', items: [
      'Em `Throwable` há três ramos: **`Error`** (não tratar), **`RuntimeException`** (unchecked, opcional tratar) e as **demais checked** (compilador exige `try/catch` ou `throws`).',
      '`try` cerca o código arriscado, `catch` reage ao tipo capturado e **`finally` executa sempre** — inclusive com `return` pendente.',
      '**`throw`** (sem `s`) lança no corpo do método; o padrão para argumento inválido é `throw new IllegalArgumentException(...)` com o valor na mensagem.',
      '**`throws`** (com `s`) declara na assinatura que o método propaga exceção *checked*, transferindo a obrigação ao chamador.',
      'A exceção **sobe a pilha de chamadas** até encontrar um `catch` compatível; sem ninguém que trate, o programa termina com o erro.',
      'Blocos `catch` vão da **subclasse para a superclasse** — o contrário é erro de compilação; multi-catch une tipos irmãos em um bloco só.',
      'Nunca engole o erro: catch vazio é proibido; preserve a causa ao registrar ou relançar.',
      '`try (Recurso r = ...)` fecha automaticamente o recurso, mesmo com exceção — é o padrão para qualquer coisa que implementa `AutoCloseable`.',
    ] },
    { t: 'note', kind: 'tip', title: 'Próximo passo', text: 'Na aula seguinte você cria suas **prórias exceções de domínio** (`ProdutoNaoEncontradoException` e companhia) e entende a hierarquia de erros personalizada que as APIs do módulo 4 usarão.' },
  ],

  exercises: [
    {
      id: 'm3l06e1',
      type: 'mc',
      question: 'Qual exceção é lançada em tempo de execução quando `Integer.parseInt("12a")` é executado?',
      options: ['`NumberFormatException`', '`IndexOutOfBoundsException`', '`ParseException`', '`IOException`'],
      answer: 0,
      explanation: '`Integer.parseInt` converte texto para número e lança **`NumberFormatException`** (uma `RuntimeException`) quando o texto não representa um inteiro válido. `IndexOutOfBoundsException` trata posição de coleção/array; `ParseException` vem de APIs de data/texto como `SimpleDateFormat` e é *checked*; `IOException` trata falhas de entrada e saída de arquivos — nada disso está presente na chamada.',
    },
    {
      id: 'm3l06e2',
      type: 'code',
      question: 'Considere o método e a chamada `System.out.println(calcular());`. Qual saída o programa imprime?',
      code: 'static int calcular() {\n    try {\n        return 10;\n    } finally {\n        System.out.println("fim");\n    }\n}',
      lang: 'java',
      options: ['Primeiro "fim" e depois 10', 'Primeiro 10 e depois "fim"', 'Apenas 10, sem imprimir "fim"', 'Erro em tempo de execução: return no try'],
      answer: 0,
      explanation: 'O `finally` executa **entre** a decisão de retornar e a entrega do valor: o `try` prepara o retorno `10`, o `finally` imprime `fim` e só então o método devolve `10`, impresso pelo `println` do chamador. A ordem é portanto `fim` e depois `10`. Não há erro algum em ter `return` no `try` — o cuidado é não colocar `return` **dentro do `finally`**, que sobrescreveria o valor.',
    },
    {
      id: 'm3l06e3',
      type: 'tf',
      question: 'Se um método declara `throws ParseException` e o chamador não trata a exceção nem declara `throws` na própria assinatura, o programa não compila.',
      answer: true,
      explanation: 'Essa é a definição de exceção ***checked***: o compilador acompanha a obrigação de tratamento até o fim da cadeia. Ou o chamador envolve a chamada em `try/catch`, ou repassa com `throws ParseException` na própria assinatura — se fizer as duas coisas, o build falha apontando a linha. Sem nenhuma das duas, o erro é *"unreported exception"*. Exceções `RuntimeException`, como `NullPointerException`, não impõem essa exigência.',
    },
    {
      id: 'm3l06e4',
      type: 'short',
      question: 'Explique a diferença entre `throw` e `throws` em Java, indicando onde cada um aparece no código.',
      keywords: [
        ['throw'],
        ['throws'],
        ['assinatura', 'declara', 'metodo', 'método', 'corpo', 'lanca', 'lança'],
      ],
      answerText: 'throw é usado no corpo do método para criar e lançar uma exceção naquele ponto, interrompendo a execução. throws aparece na assinatura do método, depois dos parâmetros e antes das chaves, declarando que o método pode propagar exceções, que o chamador deverá tratar ou repassar.',
      explanation: 'A distinção é **ação × aviso**: `throw new IllegalArgumentException("...")` é a linha que efetiva a falha; `throws ParseException` é parte do contrato visível a quem chama, exigindo que o tratamento aconteça em algum lugar da cadeia. Errar um pelo outro (escrever `throws` no meio do corpo, ou `throw` na assinatura) é erro de compilação imediato.',
    },
    {
      id: 'm3l06e5',
      type: 'code',
      question: 'O que acontece com este arquivo quando você tenta compilar?',
      code: 'try {\n    int n = Integer.parseInt(entrada);\n    System.out.println(100 / n);\n} catch (Exception e) {\n    System.out.println("geral");\n} catch (NumberFormatException e) {\n    System.out.println("numero");\n}',
      lang: 'java',
      options: [
        'Compila e trata corretamente cada tipo de falha',
        'Erro de compilacao: NumberFormatException ja e coberta pelo catch de Exception',
        'Erro de compilacao: excecoes checked exigem throws na assinatura',
        'Compila, mas o segundo catch nunca e executado por causa do runtime',
      ],
      answer: 1,
      explanation: '`NumberFormatException` é **subclasse** de `Exception`. Como o `catch (Exception e)` aparece primeiro, ele já cobriria qualquer falha — e o Java **proíbe** um catch posterior de um tipo já capturado: o compilador acusa *"exception NumberFormatException is already caught"*. A correção é inverter a ordem (específica primeiro, geral depois). Não se trata de exceção checked (ambas aqui são unchecked) nem de código que compila com ramo morto: é recusa de compilação mesmo.',
    },
  ],

  challenge: {
    id: 'm3l06c1',
    title: 'Importador de produtos com validacao',
    fileName: 'Main.java',
    prompt: 'Em Java 21, implemente a validação de dados de um produto recebidos como texto. O arquivo `Main.java` deve conter: (1) o método `converterPreco(String texto)` que usa `Double.parseDouble`, deixa a `NumberFormatException` **propagar** quando o texto não for número e, após converter, lança `throw new IllegalArgumentException("Preco invalido: " + preco)` quando o valor for menor ou igual a zero; (2) o método `lerDataCadastro(String texto) throws ParseException`, usando `SimpleDateFormat` com padrão `dd/MM/yyyy` e `setLenient(false)`; (3) um método `processar(String precoTexto, String dataTexto)` com `try` envolvendo as duas chamadas, **três blocos `catch` distintos e nesta ordem** — `NumberFormatException`, depois `IllegalArgumentException`, depois `ParseException` — e um `finally` que sempre imprime `Processamento encerrado.`; (4) um `main` que chama `processar` pelo menos duas vezes, demonstrando um cenário de sucesso (`199.90` com `31/12/2026`) e um cenário de erro com preço não numérico, imprimindo mensagens que identifiquem cada falha.',
    starterCode: `import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Main {
    // 1. converterPreco(String texto) -> double
    //    - Double.parseDouble pode lancar NumberFormatException (deixe propagar)
    //    - preco <= 0 -> throw new IllegalArgumentException("Preco invalido: " + preco)

    // 2. lerDataCadastro(String texto) throws ParseException
    //    - SimpleDateFormat("dd/MM/yyyy") com setLenient(false)

    // 3. processar(String precoTexto, String dataTexto)
    //    - try com as duas chamadas
    //    - catch (NumberFormatException), catch (IllegalArgumentException),
    //      catch (ParseException) — sempre nessa ordem
    //    - finally imprimindo: Processamento encerrado.

    public static void main(String[] args) {
        // 4. Cenario de sucesso: processar("199.90", "31/12/2026")
        // 5. Cenario de erro: processar("abc", "31/12/2026")
    }
}`,
    criteria: [
      'O método `converterPreco` usa `Double.parseDouble` sem capturar a `NumberFormatException` (ela propaga) e lança `IllegalArgumentException` com `throw` quando o preço é menor ou igual a zero, incluindo o valor inválido na mensagem',
      'O método `lerDataCadastro` declara `throws ParseException`, usa `SimpleDateFormat` com o padrão `dd/MM/yyyy` e chama `setLenient(false)` antes do `parse`',
      'O método `processar` possui três blocos `catch` distintos e exatamente nessa ordem: `NumberFormatException`, `IllegalArgumentException` e `ParseException` (subclasse antes da superclasse)',
      'Há um bloco `finally` em `processar` que imprime `Processamento encerrado.` e que executa tanto no sucesso quanto no erro',
      'O `main` demonstra ao menos dois cenários: um válido (`199.90` com `31/12/2026`) e um com preço não numérico (`abc`), com mensagens que identificam a falha',
      'O programa não define exceções personalizadas (o tema da aula seguinte) nem usa recursos de aulas futuras como lambdas e streams',
    ],
    modelSolution: [
      { t: 'p', text: 'A solução abaixo separa as responsabilidades: `converterPreco` **propaga** o erro de formato e **lança** o erro de regra de negócio; `lerDataCadastro` **declara** o risco; `processar` **reage** a cada caso e **garante** o encerramento no `finally`.' },
      { t: 'code', lang: 'java', caption: 'Main.java', code: `import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Main {

    public static double converterPreco(String texto) {
        double preco = Double.parseDouble(texto);   // NumberFormatException propaga
        if (preco <= 0) {
            throw new IllegalArgumentException("Preco invalido: " + preco);
        }
        return preco;
    }

    public static Date lerDataCadastro(String texto) throws ParseException {
        SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
        formato.setLenient(false);                  // 31/02/2026 vira erro, nao 2 de marco
        return formato.parse(texto);
    }

    public static void processar(String precoTexto, String dataTexto) {
        try {
            double preco = converterPreco(precoTexto);
            Date data = lerDataCadastro(dataTexto);
            System.out.println("Produto registrado: preco=" + preco
                    + ", cadastro=" + data);
        } catch (NumberFormatException e) {
            System.out.println("Preco nao numerico: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        } catch (ParseException e) {
            System.out.println("Data invalida: " + e.getMessage());
        } finally {
            System.out.println("Processamento encerrado.");
        }
    }

    public static void main(String[] args) {
        processar("199.90", "31/12/2026");
        System.out.println("---");
        processar("abc", "31/12/2026");
        System.out.println("---");
        processar("-5.00", "31/12/2026");
        System.out.println("---");
        processar("199.90", "31/02/2026");
    }
}` },
      { t: 'p', text: 'Confira as saídas: a primeira chamada imprime `Produto registrado: preco=199.90, cadastro=...` e fecha com `Processamento encerrado.`; a segunda cai em `NumberFormatException` (`Preco nao numerico: For input string: "abc"`) e ainda assim imprime o `finally`; a terceira demonstra o `throw` de `IllegalArgumentException` com `Preco invalido: -5.0`; a quarta mostra o `ParseException` da data rigorosa. Em todas as quatro, `Processamento encerrado.` aparece — prova do `finally`. Repare na ordem dos `catch`: `NumberFormatException` vem **antes** de `IllegalArgumentException` porque é subclasse dela; invertendo, o build falharia. E `catch (ParseException)` é obrigatório ali: como `lerDataCadastro` declara `throws`, ou o `processar` trata, ou precisa repassar — e neste desenho, o ponto de reação é exatamente esse.' },
    ],
  },
}
