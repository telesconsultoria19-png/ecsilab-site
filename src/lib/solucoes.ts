export type Solucao = {
  slug: string;
  nome: string;
  categoria: string;
  descricao: string;
};

export const CATEGORIAS = [
  "Atendimento e vendas",
  "Financeiro",
  "Propostas e contratos",
  "Gestão e dados",
] as const;

// Descrições são textos de apresentação; revisar com o time antes de divulgar preços e escopo.
export const SOLUCOES: Solucao[] = [
  {
    slug: "sdr-whatsapp-ia",
    nome: "SDR com IA no WhatsApp",
    categoria: "Atendimento e vendas",
    descricao:
      "Assistente que responde, qualifica e encaminha leads no WhatsApp com rapidez, para o comercial falar só com quem tem potencial.",
  },
  {
    slug: "atendimento-multiagentes",
    nome: "Atendimento multiagentes",
    categoria: "Atendimento e vendas",
    descricao:
      "Central de atendimento no WhatsApp com vários números e atendentes, organizada em um só lugar.",
  },
  {
    slug: "omnichannel",
    nome: "Atendimento omnichannel com IA",
    categoria: "Atendimento e vendas",
    descricao: "Reúne os canais de contato em uma única fila, com apoio de IA nas respostas.",
  },
  {
    slug: "nps-automatizado",
    nome: "Pesquisa de satisfação (NPS) automatizada",
    categoria: "Atendimento e vendas",
    descricao: "Mede a satisfação dos clientes de forma automática e mostra onde agir para reter.",
  },
  {
    slug: "monitor-reputacao",
    nome: "Monitor de reputação",
    categoria: "Atendimento e vendas",
    descricao: "Acompanha avaliações e menções da sua empresa para você responder e agir rápido.",
  },
  {
    slug: "gestao-grupos-whatsapp",
    nome: "Gestão de grupos de WhatsApp",
    categoria: "Atendimento e vendas",
    descricao: "Organiza e automatiza a operação de grupos com clientes e comunidades.",
  },
  {
    slug: "precificador-inteligente",
    nome: "Precificador inteligente",
    categoria: "Financeiro",
    descricao: "Calcula o preço de produtos e serviços a partir dos seus custos e da margem desejada.",
  },
  {
    slug: "agente-cobranca",
    nome: "Agente de cobrança",
    categoria: "Financeiro",
    descricao: "Automatiza lembretes e a régua de cobrança para reduzir a inadimplência.",
  },
  {
    slug: "central-financeira",
    nome: "Central financeira",
    categoria: "Financeiro",
    descricao: "Contas a pagar, orçamento e visão do caixa em um painel único.",
  },
  {
    slug: "assistente-proposta-contrato",
    nome: "Assistente de proposta e contrato",
    categoria: "Propostas e contratos",
    descricao: "Gera propostas e contratos a partir dos dados do cliente, sem retrabalho manual.",
  },
  {
    slug: "assinatura-digital",
    nome: "Assinatura digital de contratos",
    categoria: "Propostas e contratos",
    descricao: "Coleta a assinatura online e acelera o fechamento.",
  },
  {
    slug: "dashboard-resultados",
    nome: "Dashboard de resultados",
    categoria: "Gestão e dados",
    descricao: "Painel com os indicadores que importam para acompanhar e reportar o crescimento.",
  },
  {
    slug: "analise-coortes",
    nome: "Análise de retenção (coortes)",
    categoria: "Gestão e dados",
    descricao: "Mostra como grupos de clientes se comportam ao longo do tempo para decidir sobre retenção.",
  },
  {
    slug: "okrs-metas",
    nome: "OKRs e metas por área",
    categoria: "Gestão e dados",
    descricao: "Define, acompanha e revisa objetivos e resultados-chave com a equipe.",
  },
  {
    slug: "reunioes-ia",
    nome: "Reuniões com IA",
    categoria: "Gestão e dados",
    descricao: "Transcreve reuniões e transforma o que foi dito em tarefas.",
  },
  {
    slug: "gestao-projetos-ia",
    nome: "Gestão de projetos com IA",
    categoria: "Gestão e dados",
    descricao: "Organiza entregas e prazos dos projetos com apoio de IA.",
  },
];
