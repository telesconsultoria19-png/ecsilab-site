export type Solucao = {
  slug: string;
  nome: string;
  tipo: string;
  categoria: string;
  descricao: string;
};

export const CATEGORIAS = [
  "Comercial",
  "Marketing",
  "Atendimento e CS",
  "Gestão e dados",
  "Financeiro",
  "Propostas e contratos",
  "RH",
] as const;

// Descrições são textos de apresentação escritos a partir do nome de cada solução;
// revisar com o time antes de divulgar escopo e preços.
export const SOLUCOES: Solucao[] = [
  // Comercial
  {
    slug: "sdr-whatsapp-ia",
    nome: "Lexia",
    tipo: "SDR com IA no WhatsApp",
    categoria: "Comercial",
    descricao:
      "Assistente que responde, qualifica e encaminha leads no WhatsApp com rapidez, para o comercial falar só com quem tem potencial.",
  },
  {
    slug: "lexia-talks",
    nome: "Lexia Voice",
    tipo: "SDR por voz",
    categoria: "Comercial",
    descricao: "SDR com IA que conversa por voz para abordar e qualificar leads.",
  },
  {
    slug: "flow-crm",
    nome: "Redil",
    tipo: "CRM",
    categoria: "Comercial",
    descricao: "CRM para organizar contatos, funil e o acompanhamento de cada negociação.",
  },
  {
    slug: "cso-autonomo",
    nome: "Alfredo",
    tipo: "Diretor comercial autônomo",
    categoria: "Comercial",
    descricao: "Agente de IA que apoia a estratégia e a rotina comercial da empresa.",
  },
  {
    slug: "livecoach",
    nome: "Pulso",
    tipo: "Coach comercial com IA",
    categoria: "Comercial",
    descricao: "Coach com IA que orienta o time comercial no dia a dia.",
  },
  {
    slug: "treinador-ias-vendas",
    nome: "Forja",
    tipo: "Treinamento de agentes de vendas",
    categoria: "Comercial",
    descricao: "Treina e aperfeiçoa os agentes de IA que atuam nas vendas.",
  },
  {
    slug: "roleplay-vendas",
    nome: "Arena",
    tipo: "Simulador de vendas",
    categoria: "Comercial",
    descricao: "Simulações de conversas de venda para o time treinar antes de falar com o cliente.",
  },
  {
    slug: "playbook-ai",
    nome: "Códice",
    tipo: "Playbook comercial",
    categoria: "Comercial",
    descricao: "Cria e mantém o playbook comercial da empresa.",
  },
  {
    slug: "planejador-funil-vendas",
    nome: "Rota",
    tipo: "Planejamento de funil de vendas",
    categoria: "Comercial",
    descricao: "Desenha e organiza as etapas do funil de vendas.",
  },
  {
    slug: "painel-preditivo-metas",
    nome: "Horizonte",
    tipo: "Previsão de metas",
    categoria: "Comercial",
    descricao: "Projeta se as metas serão atingidas e antecipa desvios a tempo de agir.",
  },

  // Marketing
  {
    slug: "cmo-autonomo",
    nome: "Maestro",
    tipo: "Diretor de marketing autônomo",
    categoria: "Marketing",
    descricao: "Agente de IA que apoia o planejamento e a execução do marketing.",
  },
  {
    slug: "gestor-trafego-meta-ads",
    nome: "Alvo",
    tipo: "Gestão de tráfego no Meta Ads",
    categoria: "Marketing",
    descricao: "Apoio de IA na gestão das campanhas de anúncios no Meta.",
  },
  {
    slug: "blog-post-4",
    nome: "Tinta",
    tipo: "Artigos de blog com IA",
    categoria: "Marketing",
    descricao: "Produz artigos de blog pensados para buscadores, com apoio de IA.",
  },
  {
    slug: "instareply",
    nome: "Eco",
    tipo: "Atendimento no Instagram",
    categoria: "Marketing",
    descricao: "Respostas e atendimento automatizados no Instagram.",
  },
  {
    slug: "typeflow",
    nome: "Ponte",
    tipo: "Fluxos conversacionais",
    categoria: "Marketing",
    descricao: "Fluxos conversacionais para captar e qualificar contatos.",
  },
  {
    slug: "monitor-reputacao",
    nome: "Vigia",
    tipo: "Monitoramento de reputação",
    categoria: "Marketing",
    descricao: "Acompanha avaliações e menções da sua empresa para você responder e agir rápido.",
  },

  // Atendimento e CS
  {
    slug: "atendimento-multiagentes",
    nome: "Malha",
    tipo: "Atendimento multiagentes",
    categoria: "Atendimento e CS",
    descricao: "Central de atendimento no WhatsApp com vários números e atendentes, organizada em um só lugar.",
  },
  {
    slug: "omnichannel",
    nome: "Nexo",
    tipo: "Atendimento omnichannel",
    categoria: "Atendimento e CS",
    descricao: "Reúne os canais de contato em uma única fila, com apoio de IA nas respostas.",
  },
  {
    slug: "resumo-conversas-whatsapp",
    nome: "Síntese",
    tipo: "Resumo de conversas",
    categoria: "Atendimento e CS",
    descricao: "Resume conversas do WhatsApp para o time entender cada cliente rapidamente.",
  },
  {
    slug: "briefbot",
    nome: "Escopo",
    tipo: "Briefing automatizado",
    categoria: "Atendimento e CS",
    descricao: "Assistente que coleta e organiza briefings de clientes e projetos.",
  },
  {
    slug: "nps-automatizado",
    nome: "Bússola",
    tipo: "Pesquisa de satisfação (NPS)",
    categoria: "Atendimento e CS",
    descricao: "Mede a satisfação dos clientes de forma automática e mostra onde agir para reter.",
  },
  {
    slug: "analise-coortes",
    nome: "Estrato",
    tipo: "Análise de retenção",
    categoria: "Atendimento e CS",
    descricao: "Mostra como grupos de clientes se comportam ao longo do tempo para decidir sobre retenção.",
  },
  {
    slug: "gestao-grupos-whatsapp",
    nome: "Aldeia",
    tipo: "Gestão de grupos de WhatsApp",
    categoria: "Atendimento e CS",
    descricao: "Organiza e automatiza a operação de grupos com clientes e comunidades.",
  },

  // Gestão e dados
  {
    slug: "okrs-metas",
    nome: "Norte",
    tipo: "Gestão de OKRs com IA",
    categoria: "Gestão e dados",
    descricao: "Define, acompanha e revisa objetivos e resultados-chave com a equipe.",
  },
  {
    slug: "dashboard-resultados",
    nome: "Cabine",
    tipo: "Dashboard de resultados",
    categoria: "Gestão e dados",
    descricao: "Painel com os indicadores que importam para acompanhar e reportar o crescimento.",
  },
  {
    slug: "reunioes-ia",
    nome: "Ata",
    tipo: "Reuniões com IA",
    categoria: "Gestão e dados",
    descricao: "Transcreve reuniões e transforma o que foi dito em tarefas.",
  },
  {
    slug: "gestao-projetos-ia",
    nome: "Cadência",
    tipo: "Gestão de projetos com IA",
    categoria: "Gestão e dados",
    descricao: "Organiza entregas e prazos dos projetos com apoio de IA.",
  },

  // Financeiro
  {
    slug: "precificador-inteligente",
    nome: "Régua",
    tipo: "Precificação inteligente",
    categoria: "Financeiro",
    descricao: "Calcula o preço de produtos e serviços a partir dos seus custos e da margem desejada.",
  },
  {
    slug: "agente-cobranca",
    nome: "Retorno",
    tipo: "Cobrança automática",
    categoria: "Financeiro",
    descricao: "Automatiza lembretes e a régua de cobrança para reduzir a inadimplência.",
  },
  {
    slug: "central-financeira",
    nome: "Cofre",
    tipo: "Central financeira",
    categoria: "Financeiro",
    descricao: "Contas a pagar, orçamento e visão do caixa em um painel único.",
  },

  // Propostas e contratos
  {
    slug: "assistente-proposta-contrato",
    nome: "Minuta",
    tipo: "Propostas e contratos",
    categoria: "Propostas e contratos",
    descricao: "Gera propostas e contratos a partir dos dados do cliente, sem retrabalho manual.",
  },
  {
    slug: "assinatura-digital",
    nome: "Selo",
    tipo: "Assinatura digital",
    categoria: "Propostas e contratos",
    descricao: "Coleta a assinatura online e acelera o fechamento.",
  },

  // RH
  {
    slug: "flowpdi",
    nome: "Degrau",
    tipo: "Plano de desenvolvimento individual",
    categoria: "RH",
    descricao: "Plano de desenvolvimento individual das pessoas da equipe, com apoio de IA.",
  },
];
