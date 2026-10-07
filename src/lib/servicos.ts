export type GrupoServicos = { titulo: string; itens: string[] };

// Serviços da Écsilab (antes um carrossel no topo do site), agrupados por área.
export const SERVICOS: GrupoServicos[] = [
  {
    titulo: "Marca e comunicação",
    itens: [
      "Planejamento de marca",
      "Estratégia de brand",
      "Campanha publicitária",
      "Planejamento de conteúdo de marketing",
      "Publicações em carrossel",
    ],
  },
  {
    titulo: "Aquisição e relacionamento",
    itens: [
      "Gestão de tráfego pago",
      "Inbound marketing",
      "Nutrição de leads por e-mail",
      "Gestão do Google Meu Negócio",
      "Gestão de CRM",
    ],
  },
  {
    titulo: "Processos e time comercial",
    itens: [
      "Estruturação de processos comerciais",
      "Estruturação de time comercial",
      "Planejamento de metas por OKR",
    ],
  },
  {
    titulo: "Estratégia e crescimento",
    itens: [
      "Raio-X do marketing",
      "Consultoria de growth",
      "Planejamento de expansão",
      "Plano de ação para dominar o mercado",
    ],
  },
  {
    titulo: "Sites e ferramentas",
    itens: [
      "Criação de site",
      "Criação de blog",
      "Criação de ferramentas para consultores",
      "Implantação de ferramentas de IA",
    ],
  },
];

export const TOTAL_SERVICOS = SERVICOS.reduce((n, g) => n + g.itens.length, 0);
