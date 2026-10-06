export type Depoimento = {
  texto: string;
  autor: string;
  cargo?: string;
  /** Caminho em /public, por exemplo "/clientes/gestao-360.jpg". Só use com autorização. */
  foto?: string;
};

export type Cliente = {
  nome: string;
  segmento?: string;
  /** Só inclua o que foi de fato entregue. */
  entregas?: string[];
  /** A história do que foi construído, um parágrafo por item. */
  historia?: string[];
  /** Só publique com autorização por escrito de quem falou. */
  depoimento?: Depoimento;
  /** Âncora interna com mais detalhes, se existir. */
  detalhe?: { href: string; rotulo: string };
};

// Cada empresa tem espaço reservado para foto e depoimento (esquerda) e história (direita).
export const CLIENTES: Cliente[] = [
  {
    nome: "Gestão 360",
    segmento: "BPO financeiro e contabilidade",
    entregas: [
      "Gestão de tráfego pago",
      "Nutrição da base de contatos por e-mail",
      "Relatório de retorno apresentado à diretoria",
    ],
    historia: [
      "Assumimos a gestão do tráfego pago da Gestão 360 e passamos a medir cada campanha pelo retorno em caixa, e não por métricas de vaidade.",
      "Em 2024, o relatório apresentado à diretoria do grupo mostrou 37,1x de retorno (LTV/CAC) sobre o investimento em mídia.",
      "Além dos anúncios, ativamos a base de contatos já existente: na Black Friday de 2023, cinco fluxos de nutrição por e-mail geraram 13 vendas sem gastar nada a mais em mídia.",
    ],
    detalhe: { href: "#case", rotulo: "Ver os números do case" },
  },
  {
    nome: "Callim Sorveteria",
    segmento: "Sorveteria",
    entregas: [
      "Planejamento de marca",
      "Planejamento de conteúdo para Instagram e TikTok",
      "Auditoria de atendimento",
    ],
    historia: [
      "Para a Callim, unimos em um único planejamento editorial a camada de marca, o arco narrativo e as campanhas comerciais do mês, para Instagram e TikTok.",
      "A ideia foi fazer a marca ocupar a cidade como presença, e não como propaganda, e manter a alma da marca enquanto ela conquista a estação.",
    ],
  },
  { nome: "Marvim Sorveteria", segmento: "Sorveteria" },
  { nome: "MS Consulting", segmento: "Consultoria" },
  { nome: "Mercado Delivery" },
];
