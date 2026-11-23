export default {
  id: 'p1',
  moduleId: 'm1',
  name: 'Sistema de Gerenciamento de Alunos',
  tagline: 'Um sistema de notas no terminal, feito com arrays, métodos e tratamento de erros.',
  context:
    'Imagine que um professor precisa controlar as notas de uma turma sem planilha: cadastrar alunos, saber a média de cada um, quem está aprovado e qual o desempenho geral da turma. Abrir um editor de texto e fazer contas de cabeça não escala — e é exatamente o tipo de problema que um programa resolve bem. Este projeto é o fechamento do módulo 1: você vai reunir em um único sistema tudo o que aprendeu até aqui, do primeiro `System.out.println` ao tratamento de exceções, e sair do módulo com um programa completo, funcional e apresentável.',
  objective:
    'Construir pelo terminal um sistema que cadastra alunos com três notas, calcula médias, classifica a situação, consulta por nome e emite relatórios da turma, usando apenas os recursos vistos no módulo 1.',
  description: [
    { t: 'p', text: 'O **Sistema de Gerenciamento de Alunos** é um programa de console que mantém os dados de uma turma **em memória** enquanto estiver rodando. Ele exibe um menu, lê as escolhas do usuário e executa cinco operações: cadastrar, listar, consultar por nome, gerar relatório e sair. Nada é salvo em arquivo ou banco — isso é proposital: o foco é consolidar a lógica, e a persistência chega nos módulos 5 e 7.' },
    { t: 'ul', items: [
      '**Cadastro**: nome do aluno e três notas, com validação de nota entre 0 e 10, nome não vazio e impedimento de duplicidade.',
      '**Listagem**: todos os alunos cadastrados, com a média calculada e a situação classificada em Aprovado, Recuperação ou Reprovado.',
      '**Consulta**: busca de um aluno pelo nome exato e exibição das três notas, da média e da situação.',
      '**Relatório da turma**: maior média (com o nome de quem conquistou), média geral da turma e contagem de alunos por situação.',
      '**Sair**: encerra o programa com mensagem de despedida, sem derrubar a janela do terminal.',
    ] },
    { t: 'code', lang: 'plaintext', caption: 'Sessão de exemplo no terminal', code: `=== Sistema de Gerenciamento de Alunos ===
1 - Cadastrar aluno
2 - Listar alunos
3 - Consultar por nome
4 - Relatorio da turma
0 - Sair
Opcao: 1
Nome do aluno: Ana Souza
Nota da prova 1 (0 a 10): 8.5
Nota da prova 2 (0 a 10): 9
Nota da prova 3 (0 a 10): abc
Valor invalido: digite numeros como 8.5 ou 7.
Nota da prova 3 (0 a 10): 7.5
Aluno cadastrado: Ana Souza

Opcao: 2
1) Ana Souza - Media: 8.33 - Aprovado

Opcao: 4
Maior media: 8.33 (Ana Souza)
Media da turma: 8.33
Aprovados: 1
Recuperacao: 0
Reprovados: 0

Opcao: 0
Ate logo!` },
    { t: 'p', text: 'A sessão acima mostra o comportamento esperado em cada ponto de contato: o menu se repete até a opção 0; o cadastro **não aceita** a nota `abc` e pede de novo, mantendo o programa vivo; a listagem formata a média com duas casas decimais; e o relatório resume a turma. Repare que, após a entrada inválida, nada se perdeu — o aluno foi cadastrado com a nota corrigida. É esse comportamento "à prova de erro" que o `try`/`catch` da aula 13 garante.' },
    { t: 'table', headers: ['Opção', 'Ação', 'Conceitos do módulo em jogo'], rows: [
      ['1', 'Cadastrar aluno (nome + 3 notas validadas)', 'Arrays, `while` de validação, `try`/`catch`, métodos'],
      ['2', 'Listar todos com média e situação', 'Laço `for` com `length`, `printf`, retorno de métodos'],
      ['3', 'Consultar por nome', 'Busca sequencial, laço com `return` antecipado'],
      ['4', 'Relatório da turma', 'Acumuladores, maior valor, média geral, contagem'],
      ['0', 'Sair', '`do-while` de menu e `switch` de direcionamento'],
    ] },
    { t: 'p', text: 'Os dados vivem em **estruturas paralelas**: um array de nomes e uma matriz de notas, em que a mesma posição representa o mesmo aluno. Essa decisão é sua — a aula 12 mostrou os dois formatos — e ela define quase todo o restante do programa. Se preferir, vale desenhar no papel como ficará a "ficha" de cada aluno antes de abrir o editor.' },
  ],

  functionalRequirements: [
    'Exibir um menu numerado (cadastrar, listar, consultar, relatório, sair) e ler a opção a cada volta até o usuário escolher 0',
    'Cadastrar um aluno com nome e três notas, aceitando apenas nomes não vazios e notas no intervalo de 0 a 10',
    'Impedir o cadastro de dois alunos com o mesmo nome e recusar novos cadastros quando a capacidade máxima de 50 alunos for atingida',
    'Listar todos os alunos cadastrados com número, nome, média com duas casas decimais e situação (Aprovado, Recuperação ou Reprovado)',
    'Consultar um aluno pelo nome exato e exibir as três notas, a média e a situação, ou a mensagem de aluno não encontrado',
    'Gerar relatório com a maior média e o nome do aluno, a média geral da turma e a quantidade de alunos em cada situação',
    'Aceitar entrada de dado inválido sem encerrar o programa, pedindo novamente até o valor ser válido',
    'Encerrar apenas pela opção 0, imprimindo mensagem de despedida e liberando o recurso de leitura',
  ],

  technicalRequirements: [
    'Java 21 compilado e executado pelo terminal com `javac SistemaAlunos.java` e `java SistemaAlunos`',
    'Programa em uma única classe `SistemaAlunos` contendo o `main` e ao menos cinco métodos `static` auxiliares (cadastro, listagem, consulta, relatório, busca, cálculo e classificação)',
    'Dados armazenados em `String[]` para nomes e `double[][]` para as notas, com o total de alunos controlado por um contador `int`',
    'Laços `for` para percorrer arrays com `length`, `do-while` para o menu e `switch` para direcionar as opções',
    'Métodos com parâmetros e retorno, incluindo um que recebe um array de notas e devolve a média e outro que devolve a situação em `String`',
    'Leitura feita com `nextLine()` e conversões protegidas por `try`/`catch` (`NumberFormatException`), com validação de intervalo por `if`',
    'Saídas tabulares formatadas com `System.out.printf` usando `%d`, `%s` e `%.2f`',
  ],

  businessRules: [
    'A média do aluno é a soma das três notas dividida por 3, sempre com duas casas decimais na exibição',
    'Situação: Aprovado quando a média for maior ou igual a 7; Recuperação quando maior ou igual a 5 e menor que 7; Reprovado quando menor que 5',
    'Nota válida está entre 0 e 10, inclusive; qualquer valor fora disso ou texto não numérico é recusado e a nota é relida',
    'O nome do aluno não pode ser vazio nem repetido na turma (comparação exata, sem variações de caixa ou acento)',
    'A turma tem capacidade máxima de 50 alunos; ao atingir o limite, o cadastro é recusado com aviso claro',
    'A consulta e a listagem consideram apenas os alunos já cadastrados (do índice 0 ao total - 1), e não as posições vazias do array',
  ],

  suggestedStructure: {
    lang: 'plaintext',
    code: `sistema-alunos/
├── SistemaAlunos.java   # unica classe: main + metodos auxiliares
│                        #   main .............. menu e direcionamento
│                        #   cadastrarAluno .... entrada validada
│                        #   listarAlunos ...... impressao com printf
│                        #   consultarAluno .... busca por nome
│                        #   relatorio ......... estatisticas da turma
│                        #   buscarIndice ...... busca sequencial
│                        #   calcularMedia ..... media de um array de notas
│                        #   classificar ....... media -> situacao
├── README.md            # como compilar, rodar e testar o sistema
└── casos-de-teste.txt   # entradas e saidas esperadas para conferencia`,
  },

  steps: [
    'Modele os dados: declare no `main` um `String[] nomes` de 50 posições, uma `double[][] notas` de 50x3 e um `int totalAlunos = 0` — o contador diz quantas posições estão realmente em uso',
    'Monte o menu com `do-while` e `switch`: leia a opção com `nextLine()` + `Integer.parseInt` dentro de `try`, e mantenha o laço até a opção 0',
    'Escreva `calcularMedia(double[] notasAluno)` e `classificar(double media)` primeiro, pois listagem, consulta e relatório dependem deles — cálculo puro, sem impressão',
    'Implemente `buscarIndice(String[] nomes, int total, String nome)` com laço `for` e `return i` quando encontrar; devolva -1 ao final se não encontrar',
    'Construa `cadastrarAluno` com todas as validações na ordem: capacidade, nome vazio, nome repetido e, por fim, as três notas com `while` + `try`/`catch` garantindo o intervalo 0 a 10',
    'Implemente `listarAlunos` e `consultarAluno` usando `printf` para alinhar a saída e percorrendo apenas de 0 a `totalAlunos - 1`',
    'Implemente `relatorio` com acumuladores: maior média (semeada com a do primeiro aluno), soma das médias para a média geral e contadores por situação',
    'Teste a bateria completa: caminho feliz, nota `abc`, nota 11, divisor de menu não numérico, aluno repetido, consulta inexistente, turma vazia e encerramento',
  ],

  evaluationCriteria: [
    { criterion: 'Menu funcional com do-while, switch e saída apenas pela opção 0', weight: 15 },
    { criterion: 'Cadastro correto: validação de nome, duplicidade, capacidade e notas no intervalo 0 a 10', weight: 20 },
    { criterion: 'Cálculo de média e classificação nas três faixas exatas (7, 5 e abaixo de 5)', weight: 20 },
    { criterion: 'Organização em métodos static com parâmetros e retorno, sem lógica repetida no main', weight: 20 },
    { criterion: 'Listagem, consulta por nome e relatório completos e formatados com printf', weight: 15 },
    { criterion: 'Entrada protegida com try/catch, mensagens amigáveis e nenhum stack trace exposto', weight: 10 },
  ],

  checklist: [
    'O menu aparece ao iniciar e volta a aparecer após cada operação, encerrando somente com a opção 0',
    'Cadastrar com nota `abc` mostra mensagem de erro e relê a nota, sem derrubar o programa',
    'Cadastrar nota 11 ou -1 é recusado, e notas 0 e 10 são aceitas',
    'Cadastrar dois alunos com o mesmo nome é recusado com aviso de duplicidade',
    'Listagem mostra todos os alunos reais, com média em duas casas decimais e situação correta',
    'Aluno com média 6.9 aparece como Reprovado, 7.0 como Aprovado e 5.0 como Recuperação',
    'Consulta de nome inexistente imprime a mensagem de aluno não encontrado e volta ao menu',
    'Relatório mostra maior média com o nome certo, média geral e contagem por situação',
    'Os arrays são percorridos com `length` ou com o contador `totalAlunos`, nunca com limite fixo digitado à mão',
    'O `main` está organizado em chamadas, sem fórmulas de média nem comparações de nota escritas nele',
    'O programa compila com `javac` e roda de ponta a ponta sem exceção não tratada',
    'Existe um `README.md` com os comandos de compilação e execução e ao menos três casos de teste',
  ],

  extraChallenges: [
    'Remoção de aluno: adicione a opção 5 para remover um aluno pelo nome, deslocando os elementos seguintes para preencher a lacuna',
    'Ordenação por média: liste os alunos do maior para o menor média usando o algoritmo de troca (bubble sort) sobre o array de médias',
    'Exportação em texto: grave o relatório da turma em um arquivo `relatorio.txt` com `PrintWriter` (pesquise a forma com `new PrintWriter("relatorio.txt")`)',
    'Pesos nas provas: altere o cálculo para notas com peso 30%, 30% e 40%, mantendo a classificação e o restante do sistema funcionando',
    'Estatísticas extras: informe também a menor média, a quantidade de reprovações e a nota mais alta individual da turma',
  ],

  hints: [
    'Guarde o estado da turma em três estruturas alinhadas — `nomes`, `notas` e o contador `totalAlunos` — e trate a posição `i` como a mesma ficha em todas elas',
    'Percorra apenas de 0 até `totalAlunos - 1`: as posições restantes do array estão com valores padrão (`null` em nomes e `0.0` em notas) e não devem aparecer',
    'O menu é o caso de uso do `do-while` da aula 10: o corpo executa ao menos uma vez e a condição de parada é `opcao != 0`, com o `switch` escolhendo a operação',
    'Separe primeiro os métodos puros (`calcularMedia`, `classificar`, `buscarIndice`) — depois, listagem, consulta e relatório ficam montados sobre eles em poucas linhas',
    'Para comparar nomes use `nome.equals(outro)`, e não `==` (que compara referências); leia tudo com `nextLine()` e converta com `parseDouble`/`parseInt` dentro de `try` para que entrada inválida vire aviso em vez de exceção',
  ],

  solution: [
    { t: 'p', text: 'Abaixo, uma implementação completa de referência, com comentários indicando a decisão de cada bloco. Ela usa exatamente os recursos do módulo 1: arrays paralelos, laços, `do-while` com `switch`, métodos `static` com retorno, `printf` e `try`/`catch`. Se você já terminou o seu, use este código apenas para comparar decisões — e para conferir os casos de teste.' },
    { t: 'code', lang: 'java', caption: 'SistemaAlunos.java', code: `import java.util.Scanner;

class SistemaAlunos {

    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);

        // Estruturas paralelas: a mesma posicao representa o mesmo aluno
        String[] nomes = new String[50];
        double[][] notas = new double[50][3];
        int totalAlunos = 0;
        int opcao = -1;

        do {
            System.out.println();
            System.out.println("=== Sistema de Gerenciamento de Alunos ===");
            System.out.println("1 - Cadastrar aluno");
            System.out.println("2 - Listar alunos");
            System.out.println("3 - Consultar por nome");
            System.out.println("4 - Relatorio da turma");
            System.out.println("0 - Sair");
            System.out.print("Opcao: ");
            String textoOpcao = teclado.nextLine();

            // Leitura textual + conversao protegida: letra nao derruba o menu
            boolean digitouNumero = false;
            try {
                opcao = Integer.parseInt(textoOpcao);
                digitouNumero = true;
            } catch (NumberFormatException e) {
                System.out.println("Opcao invalida: digite um numero de 0 a 4.");
            }

            if (digitouNumero) {
                switch (opcao) {
                    case 1:
                        totalAlunos = cadastrarAluno(teclado, nomes, notas, totalAlunos);
                        break;
                    case 2:
                        listarAlunos(nomes, notas, totalAlunos);
                        break;
                    case 3:
                        consultarAluno(teclado, nomes, notas, totalAlunos);
                        break;
                    case 4:
                        relatorio(nomes, notas, totalAlunos);
                        break;
                    case 0:
                        System.out.println("Ate logo!");
                        break;
                    default:
                        System.out.println("Opcao invalida.");
                }
            }
        } while (opcao != 0);

        teclado.close();
    }

    // Cadastra um aluno e devolve o novo total (o main guarda o retorno)
    public static int cadastrarAluno(Scanner teclado, String[] nomes, double[][] notas, int total) {
        if (total >= nomes.length) {
            System.out.println("Turma cheia: limite de " + nomes.length + " alunos.");
            return total;
        }

        System.out.print("Nome do aluno: ");
        String nome = teclado.nextLine().trim();

        if (nome.isEmpty()) {
            System.out.println("O nome nao pode ficar vazio.");
            return total;
        }

        if (buscarIndice(nomes, total, nome) >= 0) {
            System.out.println("Ja existe um aluno com esse nome: " + nome);
            return total;
        }

        // Notas: valida formato (try) e intervalo (regra de negocio com if)
        for (int prova = 0; prova < notas[total].length; prova++) {
            boolean aceita = false;
            while (!aceita) {
                System.out.print("Nota da prova " + (prova + 1) + " (0 a 10): ");
                String textoNota = teclado.nextLine();
                try {
                    double nota = Double.parseDouble(textoNota);
                    if (nota < 0 || nota > 10) {
                        System.out.println("Nota fora do intervalo: use valores de 0 a 10.");
                    } else {
                        notas[total][prova] = nota;
                        aceita = true;
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Valor invalido: digite numeros como 8.5 ou 7.");
                }
            }
        }

        nomes[total] = nome;
        total++;
        System.out.println("Aluno cadastrado: " + nome);
        return total;
    }

    // Percorre apenas as posicoes realmente preenchidas
    public static void listarAlunos(String[] nomes, double[][] notas, int total) {
        if (total == 0) {
            System.out.println("Nenhum aluno cadastrado ainda.");
            return;
        }

        for (int i = 0; i < total; i++) {
            double media = calcularMedia(notas[i]);
            String situacao = classificar(media);
            System.out.printf("%d) %s - Media: %.2f - %s%n", i + 1, nomes[i], media, situacao);
        }
    }

    // Busca sequencial: devolve a posicao ou -1 quando nao encontra
    public static int buscarIndice(String[] nomes, int total, String nome) {
        for (int i = 0; i < total; i++) {
            if (nomes[i].equals(nome)) {
                return i;
            }
        }
        return -1;
    }

    public static void consultarAluno(Scanner teclado, String[] nomes, double[][] notas, int total) {
        System.out.print("Nome do aluno: ");
        String nome = teclado.nextLine().trim();
        int indice = buscarIndice(nomes, total, nome);

        if (indice < 0) {
            System.out.println("Aluno nao encontrado: " + nome);
            return;
        }

        System.out.println("Aluno: " + nomes[indice]);
        for (int prova = 0; prova < notas[indice].length; prova++) {
            System.out.printf("  Prova %d: %.2f%n", prova + 1, notas[indice][prova]);
        }
        double media = calcularMedia(notas[indice]);
        System.out.printf("  Media: %.2f - %s%n", media, classificar(media));
    }

    // Estatisticas gerais em unica passagem pelos dados
    public static void relatorio(String[] nomes, double[][] notas, int total) {
        if (total == 0) {
            System.out.println("Sem dados para gerar relatorio.");
            return;
        }

        double maiorMedia = calcularMedia(notas[0]);
        String melhorAluno = nomes[0];
        double somaMedias = 0;
        int aprovados = 0;
        int recuperacao = 0;
        int reprovados = 0;

        for (int i = 0; i < total; i++) {
            double media = calcularMedia(notas[i]);
            somaMedias = somaMedias + media;

            if (media > maiorMedia) {
                maiorMedia = media;
                melhorAluno = nomes[i];
            }

            String situacao = classificar(media);
            if (situacao.equals("Aprovado")) {
                aprovados++;
            } else if (situacao.equals("Recuperacao")) {
                recuperacao++;
            } else {
                reprovados++;
            }
        }

        System.out.printf("Maior media: %.2f (%s)%n", maiorMedia, melhorAluno);
        System.out.printf("Media da turma: %.2f%n", somaMedias / total);
        System.out.println("Aprovados: " + aprovados);
        System.out.println("Recuperacao: " + recuperacao);
        System.out.println("Reprovados: " + reprovados);
    }

    // Recebe um array de notas e devolve a media (metodo puro, sem println)
    public static double calcularMedia(double[] notasAluno) {
        double soma = 0;
        for (int i = 0; i < notasAluno.length; i++) {
            soma = soma + notasAluno[i];
        }
        return soma / notasAluno.length;
    }

    // Converte a media em texto de situacao segundo as faixas do contrato
    public static String classificar(double media) {
        if (media >= 7) {
            return "Aprovado";
        }
        if (media >= 5) {
            return "Recuperacao";
        }
        return "Reprovado";
    }
}` },
    { t: 'p', text: 'Como testar: cadastre três alunos (um com média acima de 7, um entre 5 e 7 e um abaixo de 5) e confira a listagem e o relatório; tente cadastrar o mesmo nome de novo; digite `abc` na opção do menu e em uma nota; peça a consulta de um aluno que não existe; e, por fim, encerre com 0. Em nenhum desses passos deve aparecer stack trace — se aparecer, encontre a linha culpada no stack trace (tipo + mensagem + linha) e mova-a para dentro de um `try` ou corrija a condição.' },
    { t: 'ul', items: [
      '**Decisão de design**: `calcularMedia` e `classificar` não imprimem nada — devolvem valores. Isso permite usá-los em listagem, consulta e relatório sem repetir fórmula, exatamente como ensinou a aula 11.',
      '**Por que `totalAlunos`**: o array tem 50 posições, mas só as primeiras têm dados. Todo laço usa `i < totalAlunos`, evitando exibir `null` e `0.0` das vagas livres.',
      '**Por que `buscarIndice` devolve -1**: o valor -1 é um sinal inequívoco de "não encontrado" (um índice válido nunca é negativo), e ele centraliza a busca usada por cadastro (duplicidade) e consulta.',
      '**Próximo passo**: guarde este projeto — nos módulos 4 a 7 você construirá a TaskFlow API, e a disciplina de separar entrada, processamento e apresentação será a mesma, com classes e banco de dados no lugar dos arrays.',
    ] },
  ],
}
