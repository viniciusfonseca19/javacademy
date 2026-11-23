export default {
  id: 'm4l02',
  moduleId: 'm4',
  number: 2,
  title: 'Inversão de Controle (IoC) e Injeção de Dependências (DI)',
  durationMinutes: 34,

  objectives: [
    'Entender o conceito de Inversão de Controle e sua razão de existir',
    'Diferenciar as formas de implementação de injeção de dependências',
    'Identificar os benefícios do Dependency Injection na manutenção de código',
    'Reconhecer o papel do Spring Container na gestão de beans',
  ],

  prerequisites: [
    'Ter concluído m4l01 — Ecossistema Spring: Spring Framework e Spring Boot',
    'Saber criar um controller REST simples com @RestController',
    'Entender o conceito de beans e escopo de vida em Spring',
  ],

  intro: [
    { t: 'p', text: 'Na aula anterior, vimos como o Spring Boot simplifica a configuração de um projeto Java e abrimos caminho para entender o coração do Spring: o controle de objetos.' },
    { t: 'p', text: 'Mas você provavelmente já se pegou "Manualmente criando objetos new MinhaClasse()" em seus códigos. Esse padrão funciona, mas gera acoplamento pesado. O que acontece quando MinhaClasse depende de outra classe?' },
    { t: 'code', lang: 'java', caption: 'Código com alto acoplamento', code: `public class PedidosService {
    private RelatorioGerador relatorio = new RelatorioGerador();
    
    public void processar(Pedido p) {
        relatorio.gerar(p);
    }
}` },
    { t: 'p', text: 'O PedidosService é fortemente acoplado ao RelatorioGerador. Qualquer mudança na classe do relatório exige alteração direta no service. A Inversão de Controle resolve isso: em vez de uma classe criar os objetos, eles são injetados.' },
    { t: 'note', kind: 'tip', title: 'A analogia', text: 'Pense no Spring Container como um restaurante: o garçom (service) pede sua comida (dependência) ao cozinheiro, em vez de cozinhar sozinho. O cozinheiro (container) sabe como preparar tudo.' },
  ],

  theory: [
    { t: 'h2', text: 'O que é Inversão de Controle?' },
    { t: 'p', text: 'Inversão de Controle (IoC) é um princípio de design que transferi o controle da criação e vida útil dos objetos de uma classe para um container externo. Em vez de uma classe gerenciar suas dependências, elas são injetadas.' },
    { t: 'code', lang: 'java', caption: 'Constructor Injection (recomendado)', code: `@Service
public class ProdutoService {
    private final ProdutoRepositorio rep;
    
    public ProdutoService(ProdutoRepositorio rep) {
        this.rep = rep;
    }
    
    public List<Produto> listar() {
        return rep.findAll();
    }
}` },
    { t: 'p', text: 'O Spring DataJPA já cria uma implementação de ProdutoRepositorio. O service recebe essa implementação pelo construtor sem precisar new. Isto é a forma mais recomendada.' },
    { t: 'h2', text: 'Tipos de Injeção de Dependências' },
    { t: 'code', lang: 'java', caption: 'Setter Injection', code: `@Service
public class VendaService {
    private ProdutoRepositorio rep;
    
    @Autowired
    public void setRepositorio(ProdutoRepositorio rep) {
        this.rep = rep;
    }
}` },
    { t: 'code', lang: 'java', caption: 'Field Injection (não recomendado)', code: `@Service
public class EstoqueService {
    @Autowired
    private ProdutoRepositorio rep;
}` },
    { t: 'p', text: 'A recomendação do Spring Boot 3 e Java 17+ é usar **constructor injection** como padrão. Ela facilita testes unitários e deixa as dependências explícitas.' },
    { t: 'h2', text: 'O Spring Container na Prática' },
    { t: 'code', lang: 'java', caption: 'Ciclo de vida de um bean', code: `@SpringBootApplication
public class TaskflowApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskflowApplication.class, args);
    }
}

@Service
class UsuarioService {}

@Component
class EmailService {}` },
    { t: 'p', text: 'O main() inicia o container. O Spring cria instâncias únicas de UsuarioService e EmailService, e injeta automaticamente uma na outra se houver dependência. Você jamais escreveu "new JpaTaskRepository()".' },
    { t: 'code', lang: 'java', code: `// Por padrão, os beans são singleton — uma única instância por aplicação
// Use @Scope("prototype") ou @Scope("request") para mudar` },
    { t: 'p', text: 'A injeção funciona apenas com tipos conhecidos pelo container. Quando você precisa de uma classe que não declara anotações Spring, use @Component ou registre manualmente via @Configuration.' },
    { t: 'h2', text: 'Benefícios concretos da IoC/DI' },
    { t: 'code', lang: 'java', caption: 'Refatoração: removendo acoplamento', code: `// Antes
ProdutoRepositorio rep = new ProdutoRepositorioMemoria();

// Depois - Spring injeta automaticamente
@Repository
class ProdutoRepositorioBanco implements ProdutoRepositorio {}` },
    { t: 'p', text: 'O código que usa ProdutoRepositorio não muda. Spring injeta a nova implementação automaticamente. Além disso, em testes unitários você passa mocks pelos construtores sem envolver o container.' },
    { t: 'h2', text: 'Exemplo completo: TaskFlow API' },
    { t: 'code', lang: 'java', caption: 'TaskFlow - sem new', code: `@RestController
@RequestMapping("/api/tarefas")
class TaskController {
    private final TaskService service;
    
    public TaskController(TaskService service) {
        this.service = service;
    }
    
    @GetMapping
    public ResponseEntity<List<DTO.TarefaResposta>> listar() {
        return ResponseEntity.ok(service.listarTarefas());
    }
}

@Service
@Transactional
class TaskService {
    private final TaskRepository repo;
    
    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }
    
    public List<Tarefa> listarTarefas() {
        return repo.findAll();
    }
}

@Repository
interface TaskRepository extends JpaRepository<Tarefa, Long> {}` },
  ],

  commonMistakes: [
    {
      title: 'Usar field injection (@Autowired no campo)',
      text: 'Dificulta testes unitários e esconde dependências. A classe parece "completa", mas exige Spring para funcionar. Prefira constructor injection. As dependências ficam visíveis e testáveis.',
    },
    {
      title: 'Esquecer @Transactional no service',
      text: 'Operações no banco sem transação causam erros de inconsistência se ocorrer exceção. Marque métodos que alteram dados com @Transactional. O Spring gerencia commit/rollback.',
    },
    {
      title: 'Usar tipo de classe concreta no construtor em vez de interface',
      text: 'Spring só injeta implementações por proxy. Interface é obrigatória para JpaRepository. Use interface como parâmetro do construtor.',
    },
  ],

  bestPractices: [
    {
      title: 'Prefira constructor injection em todos os casos',
      text: 'Facilita testes unitários, deixa dependências explícitas e evita problemas com campos final.',
    },
    {
      title: 'Marque classes service como @Service e repository como @Repository',
      text: 'Documenta a intenção e permite que o Spring faça scan automático de exceções específicas.',
    },
    {
      title: 'Não acesse static fields ou methods da mesma forma que instância',
      text: 'Static breaka o conceito de IoC e pode causar problemas em ambientes multi-thread.',
    },
    {
      title: 'Use @Primary ou @Qualifier quando houver múltiplas implementações',
      text: 'Evita ambiguidade na injeção. @Qualifier usa nome do bean, @Primary define preferência.',
    },
  ],

  summary: [
    { t: 'p', text: 'Inversão de Controle e Injeção de Dependências são pilares do Spring. O container gerencia objetos e injeta-os de forma transparente.' },
    { t: 'p', text: 'Constructor injection é a forma recomendada de DI no Spring Boot moderno. Ela deixa o código testável e explícito.' },
    { t: 'p', text: 'Com IoC, sua TaskFlow API terá controllers e services desacoplados, fáceis de testar e manter.' },
  ],

  exercises: [
    {
      id: 'm4l02e1',
      type: 'mc',
      question: 'Qual é a principal diferença entre field injection e constructor injection no Spring?',
      options: [
        { label: 'A injeção por campo é mais rápida em execução', correct: false },
        { label: 'A injeção por construtor exige menos código', correct: false },
        { label: 'A injeção por construtor deixa dependências explícitas e facilita testes', correct: true },
        { label: 'A injeção por campo permite uso de campos final', correct: false },
      ],
      answer: 2,
      explanation:
        'Constructor injection expõe as dependências no construtor, permitindo testes unitários sem Spring. Field injection esconde as dependências e dificulta testes isolados.',
    },
    {
      id: 'm4l02e2',
      type: 'tf',
      question: 'No Spring, o padrão singleton significa que existe apenas uma instância em memória.',
      answer: true,
      explanation:
        'Spring cria um único bean por padrão (singleton). Essa instância é compartilhada em toda a aplicação, reduzindo overhead de criação.',
    },
    {
      id: 'm4l02e3',
      type: 'code',
      question: 'Analise o programa. Qual é a saída esperada na tela?',
      code: `public class Principal {
    public static void main(String[] args) {
        ContaBancaria a = new ContaBancaria();
        a.saldo = 300.0;

        ContaBancaria b = a;
        b.saldo = 900.0;

        ContaBancaria c = new ContaBancaria();
        c.saldo = 50.0;

        System.out.println(a.saldo);
    }
}

class ContaBancaria {
    double saldo;
}`,
      lang: 'java',
      options: ['300.0', '900.0', '50.0', 'Erro de compilação'],
      answer: 1,
      explanation:
        'Na linha `ContaBancaria b = a;`, b passa a apontar para o mesmo objeto de a. Quando `b.saldo = 900.0` executa, o campo do objeto compartilhado muda — e a.saldo também passa a ser 900.0. O objeto c é independente. Não há erro de compilação.',
    },
    {
      id: 'm4l02e4',
      type: 'short',
      question: 'Explique, com suas palavras e uma analogia, a diferença entre classe e objeto em Java.',
      keywords: [
        ['classe', 'molde', 'descricao', 'descrição', 'projeto', 'planta'],
        ['objeto', 'instancia', 'instância', 'exemplar', 'criado', 'new'],
      ],
      answerText:
        'A classe é a descrição (molde, projeto ou planta) que define quais atributos e métodos existirão; o objeto é o exemplar concreto criado a partir dessa classe com `new`, com valores próprios — assim como o projeto de casa é um só e cada casa construída tem moradores e cores diferentes.',
      explanation: 'O essencial é marcar que a classe **descreve** e o objeto **existe com estado próprio**. Dizer apenas "classe é o código e objeto é a variável" fica incompleto: a variável é a **referência**, não o objeto.',
    },
    {
      id: 'm4l02e5',
      type: 'mc',
      question: 'O que a anotação @Autowired faz no construtor por padrão?',
      options: [
        { label: 'Faz o Spring buscar um bean pelo nome', correct: false },
        { label: 'Marca o construtor para receber uma dependência automaticamente', correct: true },
        { label: 'Marca o método para ser executado depois da injeção', correct: false },
        { label: 'Permite múltiplas implementações da mesma interface', correct: false },
      ],
      answer: 1,
      explanation: 'Em construtores únicos, o Spring injeta automaticamente as dependências sem precisar de @Autowired explícito. Quando há mais de um construtor elegível, a anotação é obrigatória para esclarecer.',
    },
    {
      id: 'm4l02e6',
      type: 'mc',
      question: 'Como você resolve a ambiguidade quando há múltiplas implementações de uma interface?',
      options: [
        { label: 'Usar @Autowired(required = false)', correct: false },
        { label: 'Anotar a classe correta com @Primary', correct: true },
        { label: 'Excluir as outras implementações', correct: false },
        { label: 'Declarar @Qualifier no construtor', correct: false },
      ],
      answer: 1,
      explanation:
        'Você pode usar @Primary na implementação preferida ou @Qualifier("nome") no construtor para escolher especificamente.',
    },
  ],

  challenge: {
    id: 'm4l02c1',
    title: 'Refatore para DI',
    fileName: 'PedidoService.java',
    prompt: `Você herdou um código com classes fortemente acopladas. Refatore para usar a Inversão de Controle do Spring.

Código a refatorar:

@Component
public class PedidoService {
    private final NotaFiscalService nfs = new NotaFiscalService();
    private final EmailService email = new EmailService();
    
    public void processar(Pedido p) {
        nfs.gerar(p);
        email.enviar(p.getCliente().getEmail(), "Pedido " + p.getId());
    }
}

class NotaFiscalService {
    public void gerar(Pedido p) { /* gera NF */ }
}

class EmailService {
    public void enviar(String para, String assunto) { /* envia */ }
}`,
    starterCode: `package com.javacademy.taskflow;

import org.springframework.stereotype.Service;

@Service
public class PedidoService {
    
    // TODO: injetar dependências pelo construtor
    
    public void processar(Pedido p) {
        // TODO: chamar os serviços
    }
}

// TODO: transformar em bean Spring
class NotaFiscalService {
    public void gerar(Pedido p) { }
}

// TODO: transformar em bean Spring
class EmailService {
    public void enviar(String para, String assunto) { }
}`,
    criteria: [
      'Não usar "new NotaFiscalService()" nem "new EmailService()" dentro de PedidoService',
      'As dependências devem ser recebidas via construtor',
      'Ambas as classes de serviço devem ter uma anotação Spring (ex: @Component)',
      'O código compila e segue padrão Spring DI',
      'Código está legível e bem formatado',
    ],
    modelSolution: [
      { t: 'p', text: 'Solução refinada: removemos todos os "new", criamos o construtor com injeção de dependências e adicionamos @Service às classes auxiliares. O Spring vai injetar automaticamente as implementações ao iniciar.' },
      {
        t: 'code',
        lang: 'java',
        caption: 'PedidoService.java',
        code: `package com.javacademy.taskflow;

import org.springframework.stereotype.Service;

@Service
public class PedidoService {
    private final NotaFiscalService nfs;
    private final EmailService email;
    
    public PedidoService(NotaFiscalService nfs, EmailService email) {
        this.nfs = nfs;
        this.email = email;
    }
    
    public void processar(Pedido p) {
        nfs.gerar(p);
        email.enviar(p.getCliente().getEmail(), "Pedido " + p.getId());
    }
}

@Service
class NotaFiscalService {
    public void gerar(Pedido p) { /* gera NF */ }
}

@Service
class EmailService {
    public void enviar(String para, String assunto) { /* envia */ }
}`,
      },
    ],
  }
}