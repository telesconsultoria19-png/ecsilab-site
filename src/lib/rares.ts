// Conteúdo do método Rares: assinatura de Marcelo Teles, desenvolvida pela Écsilab.
// Versão base: Rastreável, Replicável, Escalável (RA-RE-ES).
// Versão avançada (para quem já passou pela base): R-A-R-E-S, com Auditável e Sustentável.

export const RARES_PRONUNCIA = "rá-res";
/** Nome comercial da versão avançada: troque aqui para mudar em todo o site. */
export const NOME_AVANCADO = "Rares Black";

export const RARES_BASE = [
  {
    silaba: "Ra",
    nome: "Rastreável",
    texto:
      "Toda atividade da empresa deixa lastro. Se alguém quiser entender o que foi feito para o negócio mudar de rumo, encontra o caminho inteiro registrado: o que se decidiu, com base em quê, o que se executou, quanto custou e o que provocou a virada.",
  },
  {
    silaba: "Re",
    nome: "Replicável",
    texto:
      "Rastrear é o que permite repetir. Com o registro completo do que funcionou, temos parâmetros para fazer de novo: o resultado deixa de ser um acaso feliz e passa a ser um procedimento que se reproduz.",
  },
  {
    silaba: "Es",
    nome: "Escalável",
    texto:
      "Construímos soluções, produtos e estruturas que suportam o crescimento sendo replicado, de novo e de novo. O negócio escala sem travar, de forma constante, nas restrições de capacidade de crescimento.",
  },
];

export type PilarEstendido = {
  letra: string;
  nome: string;
  texto: string;
  novo?: boolean;
  entra?: string[];
};

export const RARES_ESTENDIDO: PilarEstendido[] = [
  {
    letra: "R",
    nome: "Rastreável",
    texto: "Cada decisão, dado, ação e orçamento deixa lastro, do começo ao fim.",
  },
  {
    letra: "A",
    nome: "Auditável",
    novo: true,
    texto:
      "O que foi registrado pode ser conferido. Qualquer pessoa autorizada verifica o que foi decidido, por quem e com base em quê, sem depender da memória de quem estava lá.",
    entra: [
      "Modelagem de quem decide o quê, e de como cada decisão é aprovada",
      "Padrões de registro e organização do histórico de decisões, dados e orçamentos",
      "Rotina de revisão para manter os registros confiáveis ao longo do tempo",
    ],
  },
  {
    letra: "R",
    nome: "Replicável",
    texto: "O que funcionou vira parâmetro para fazer de novo, com o mesmo resultado esperado.",
  },
  {
    letra: "E",
    nome: "Escalável",
    texto: "Estruturas que suportam o crescimento sendo repetido, sem travar nas restrições de capacidade.",
  },
  {
    letra: "S",
    nome: "Sustentável",
    novo: true,
    texto:
      "Crescer sem quebrar o que foi construído. O crescimento se sustenta nos números: caixa saudável, equipe sem sobrecarga e capacidade que acompanha a demanda.",
    entra: [
      "Modelagem da capacidade da operação e do ritmo de crescimento que ela suporta",
      "Organização dos indicadores de saúde financeira e de caixa ligados ao crescimento",
      "Limites e alertas para crescer sem criar um novo gargalo",
    ],
  },
];

export const PERGUNTAS_LASTRO = [
  "Quais decisões foram tomadas?",
  "Quais dados foram analisados?",
  "Quais ações foram colocadas em prática?",
  "Quais orçamentos foram usados?",
  "O que determinou a virada?",
];

export const FERRAMENTAS_LASTRO = [
  "Documentação dos processos",
  "Relatórios periódicos",
  "Dashboards de indicadores",
  "Logs de decisões",
  "Registro de ações e de orçamentos",
  "Playbooks para repetir o que funcionou",
];
