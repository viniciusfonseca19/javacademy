export default {
  id: 'm2l04',
  moduleId: 'm2',
  number: 4,
  title: 'Encapsulamento e modificadores de acesso',
  durationMinutes: 32,

  objectives: [
    'Aplicar encapsulamento para proteger o estado de uma classe',
    'Separar responsabilidade de leitura e escrita com getters/setters',
    'Usar modificadores de acesso (public, private, protected, package)',
    'Defender invariantes de negocio no ponto de entrada',
  ],

  prerequisites: [
    'Ter concluído m2l03 — Construtores e a palavra-chave this',
    'Entender atributos, métodos e sintaxe de classe',
    'Ter praticado encapsulamento basico na aula anterior',
  ],

  intro: [
    { t: 'p', text: 'Na aula anterior, criamos classes com atributos publicos. Isso funciona, mas viola um dos pilares da POO: encapsulamento.' },
    { t: 'p', text: 'Com atributos diretamente acessiveis, qualquer codigo pode alterar o saldo de uma conta sem validacao. Como evitar que alguem coloque um valor negativo ou acesse um campo que nao deveria ser publico?' },
    { t: 'code', lang: 'java', caption: 'Problema: atributos expostos', code: 'ContaBancaria conta = new ContaBancaria();\nconta.saldo = -100;\nconta.titular = "Banco Central";' },
    { t: 'note', kind: 'tip', title: 'O principio do controle minimo', text: 'Uma classe deve expor apenas o necessario para o problema. Detalhes de implementacao ficam privados. Isso permite mudar internamente sem quebrar codigo que usa a classe.' },
    { t: 'code', lang: 'java', caption: 'Exemplo de problema real', code: 'public class Sensor {\n    public double valor;\n}\n\n// Outro codigo\nSensor s = new Sensor();\ns.valor = -999; // Valor invalido!' },
    { t: 'p', text: 'Esta falta de controle leva a bugs dificeis de rastrear. Se alguem alterar um campo diretamente, a classe nao tem como garantir integridade.' },
  ],

  theory: [
    { t: 'h2', text: 'O que e encapsulamento?' },
    { t: 'p', text: 'Encapsulamento e a tecnica de restringir o acesso direto aos campos de uma classe, expor apenas um comportamento controlado por metodos. Em Java, usamos modificadores de acesso para isso.' },
    { t: 'code', lang: 'java', caption: 'Classe com encapsulamento correto', code: 'public class ContaBancaria {\n    private String titular;\n    private double saldo;\n    \n    public ContaBancaria(String titular) {\n        this.titular = titular;\n        this.saldo = 0.0;\n    }\n    \n    public double getSaldo() {\n        return saldo;\n    }\n    \n    public void depositar(double valor) {\n        if (valor > 0) {\n            saldo += valor;\n        }\n    }\n}' },
    { t: 'p', text: 'Os campos são private: ninguém fora da classe pode mexer diretamente. O saldo só muda através do método depositar, que valida o valor antes de aplicar.' },
    { t: 'h2', text: 'Modificadores de acesso em Java' },
    { t: 'p', text: 'Java possui quatro níveis de visibilidade. Escolha o menor escopo necessário para cada membro.' },
    { t: 'code', lang: 'java', caption: 'Exemplo de modificadores', code: 'public class Exemplo {\n    public int a;        // qualquer um\n    protected int b;     // subclasse\n    int c;                // mesmo pacote\n    private int d;       // somente esta classe\n}' },
    { t: 'h2', text: 'Aplicando encapsulamento na prática' },
    { t: 'p', text: 'Para cada campo que precisa ser lido, crie um getter. Para cada campo que precisa ser alterado, crie um setter com validação.' },
    { t: 'code', lang: 'java', caption: 'Modelo de getter e setter', code: 'public class Conta {\n    private double saldo;\n    \n    public double getSaldo() { return saldo; }\n    \n    public void setSaldo(double saldo) {\n        if (saldo < 0) throw new IllegalArgumentException("Saldo negativo");\n        this.saldo = saldo;\n    }\n}' },
    { t: 'h2', text: 'Boas práticas com encapsulamento' },
    { t: 'p', text: 'Use o menor escopo possível. Campos geralmente são private; metodos public ou protected conforme necessidade.' },
    { t: 'code', lang: 'java', caption: 'Campo final (imutavel)', code: 'public class Pessoa {\n    private final String nome;  // nunca muda\n    private String email;\n    \n    public Pessoa(String nome) { this.nome = nome; }\n    public String getNome() { return nome; }\n    public String getEmail() { return email; }\n    public void setEmail(String email) { this.email = email; }\n}' },
  ],

  commonMistakes: [
    {
      title: 'Declarar getters/setters vazios ou redundantes',
      text: 'Getter que so retorna campo e setter que so atribui nao adicionam validacao. Se precisa de logica, inclua-la. Caso contrario, pense se o campo deveria ser publico ou se vale a pena usar record.',
    },
    {
      title: 'Esquecer de validar no setter',
      text: 'Setter de saldo sem validacao permite valores invalidos. Sempre que um setter existir, pergunte: "que regras de negocio devem ser respeitadas?"',
    },
    {
      title: 'Usar field injection com campos public',
      text: 'Combinar public e @Autowired e anti-padrao. Fields devem ser private e a injecao feita pelo construtor.',
    },
  ],

  bestPractices: [
    {
      title: 'Campos sempre private, metodos sempre public',
      text: 'A convencao Java e que campos internos são private e a API da classe usa public. Isso permite evoluir a classe sem quebrar clientes.',
    },
    {
      title: 'Validar no ponto de entrada',
      text: 'Se um setter ou metodo recebe um valor, valide-o antes de atribuir. Inválidos? Lance IllegalArgumentException com mensagem clara.',
    },
    {
      title: 'Considerar final nos campos',
      text: 'Se um campo nao muda depois do construtor, declare final. Isso ajuda o compilador e comunica intencao de imutabilidade.',
    },
    {
      title: 'Retornar copias em getters de arrays ou listas mutaveis',
      text: 'Se o getter retorna um campo que e mutavel (List, array), retorne uma copia para evitar que quem chama modifique o estado interno.',
    },
  ],

  summary: [
    { t: 'p', text: 'Encapsulamento protege o estado de uma classe usando modificadores de acesso e expõe comportamento por meio de metodos publicos.' },
    { t: 'p', text: 'A convencao Java e: private para campos, public para metodos de acesso, validacao no ponto de mudanca de estado.' },
    { t: 'p', text: 'Com encapsulamento, voce pode mudar a implementacao interna (tipo de campo, algoritmo) sem mexer no codigo que usa a classe.' },
  ],

  exercises: [
    {
      id: 'm2l04e1',
      type: 'mc',
      question: 'Qual é o principal motivo de declarar os campos de uma classe como private?',
      options: [
        { label: 'Para que o compilador gere codigo mais rapido', correct: false },
        { label: 'Para impedir que codigo externo acesse ou modifique o estado diretamente', correct: true },
        { label: 'Para permitir heranca de campos privados', correct: false },
        { label: 'Eh uma convenção estética, não afeta o comportamento', correct: false },
      ],
      answer: 1,
      explanation: 'Campos private garantem que o estado so pode ser alterado por metodos controlados dentro da classe, protegendo invariantes de negocio.',
    },
    {
      id: 'm2l04e2',
      type: 'tf',
      question: 'Se um campo é protected, ele pode ser acessado por subclasses mesmo que elas estejam em outro pacote.',
      answer: true,
      explanation: 'Protected permite acesso de subclasses independentemente do pacote, diferentemente de package-private que so funciona dentro do mesmo pacote.',
    },
    {
      id: 'm2l04e3',
      type: 'code',
      question: 'Complete o metodo setSaldo para validar que o valor está entre -1 e 1',
      code: 'public class FuncaoTriangular {\n    double seno;\n    \n    public double getSeno() {\n        return seno;\n    }\n    \n    public void setSaldo(double seno) {\n        // TODO: validar\n    }\n}',
      lang: 'java',
      options: ['seno < -1 || seno > 1', 'seno >= -1 && seno <= 1', 'Math.abs(seno) <= 1.0', 'seno == 0 || Math.abs(seno) <= 1'],
      answer: 1,
      explanation: 'A condicao seno >= -1 && seno <= 1 verifica se o valor esta dentro do dominio valido. Se for, atribui. Caso contrario, lanca excecao ou ignora.',
    },
    {
      id: 'm2l04e4',
      type: 'short',
      question: 'Qual a diferenca entre um getter e um setter trivial?',
      keywords: [['sem', 'validacao'], ['com', 'logica'], ['retorna', 'atribui'], ['campo', 'valor']],
      answerText: 'Getter retorna um valor (normalmente um campo) e setter atribui um valor. Se o setter faz apenas this.campo = valor sem validacao, ele e trivial.',
      explanation: 'O verdadeiro valor de setter/getter e a validacao. Se nao ha regras de negocio, o campo pode ser privado e a classe testada diretamente, evitando a necessidade.',
    },
    {
      id: 'm2l04e5',
      type: 'mc',
      question: 'Qual modificador de acesso permite acesso apenas dentro do mesmo pacote?',
      options: [
        { label: 'public', correct: false },
        { label: 'private', correct: false },
        { label: 'protected', correct: false },
        { label: 'Nenhum (default/package)', correct: true },
      ],
      answer: 3,
      explanation: 'Em Java, omitir qualquer modificador de acesso permite que membros sejam acessados apenas dentro do mesmo pacote - isso e chamado de acesso por pacote (package-private).',
    },
    {
      id: 'm2l04e6',
      type: 'short',
      question: 'Dê uma analogia simples para encapsulamento.',
      keywords: [['capsicuidade', 'protecao'], ['automovel', 'carro'], ['caixa', 'preparo'], ['medicamento', 'comprimido']],
      answerText: 'O carro encapsula: o motor, o sistema de combustivel e os bancos estao dentro da carroceria. O usuario dirige pelo volante e pedais, sem mexer diretamente nos componentes internos.',
      explanation: 'A analogia do carro e clara: o estado interno (motor, combustivel) e protegido, e o usuario interage por uma interface controlada (volante, acelerador, freio).',
    },
  ],

  challenge: {
    id: 'm2l04c1',
    title: 'Implemente uma classe com encapsulamento robusto',
    fileName: 'ContaBancaria.java',
    prompt: `Crie uma classe ContaBancaria que implemente encapsulamento completo.

Requisitos:
1. Campos titular (String), saldo (double) deve ser private
2. Construtor recebe titular, saldo inicial deve valer 0
3. Metodo depositar(double valor) valida valor positivo
4. Metodo sacar(double valor) valida saldo suficiente
5. Metodo getSaldo() retorna saldo (sem expor campo)
6. Metodo getTitular() retorna titular (somente leitura)
7. toString() mostra titular e saldo formatados`,
    starterCode: `public class ContaBancaria {
    // TODO: declarar campos private (titular, saldo)
    
    // TODO: construtor
    
    // TODO: metodos de acesso e operacao
}`,
    criteria: [
      'Campos titular e saldo sao private',
      'Construtor inicializa titular e saldo em 0',
      'depositar valida valor > 0 antes de adicionar',
      'sacar valida saldo >= valor antes de subtrair',
      'getSaldo e getTitular retornam valores sem expor campos',
    ],
    hints: [
      'Use private String titular; private double saldo;',
      'Construtor: public ContaBancaria(String titular) { this.titular = titular; this.saldo = 0.0; }',
      'No saque, se nao houver saldo suficiente, lance IllegalArgumentException',
      'Para toString, use String.format("Conta: %s - Saldo: R$ %.2f", titular, saldo)',
    ],
    modelSolution: [
      { t: 'p', text: 'Solucao com encapsulamento completo e tratamento de erros.' },
      {
        t: 'code',
        lang: 'java',
        caption: 'ContaBancaria.java',
        code: `public class ContaBancaria {
    private String titular;
    private double saldo;
    
    public ContaBancaria(String titular) {
        this.titular = titular;
        this.saldo = 0.0;
    }
    
    public String getTitular() {
        return titular;
    }
    
    public double getSaldo() {
        return saldo;
    }
    
    public void depositar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        saldo += valor;
    }
    
    public void sacar(double valor) {
        if (saldo < valor) {
            throw new IllegalArgumentException("Saldo insuficiente");
        }
        saldo -= valor;
    }
    
    @Override
    public String toString() {
        return String.format("Titular: %s | Saldo: R$ %.2f", titular, saldo);
    }
}`,
      },
    ],
  }
}