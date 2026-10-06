export type Cliente = {
  nome: string;
  segmento?: string;
  /** Só inclua o que foi de fato entregue. */
  entregas?: string[];
  /** Só publique com autorização por escrito do depoente. */
  depoimento?: { texto: string; autor: string; cargo?: string };
  /** Âncora interna com mais detalhes, se existir. */
  detalhe?: { href: string; rotulo: string };
};

export const CLIENTES: Cliente[] = [
  {
    nome: "Gestão 360",
    segmento: "BPO financeiro e contabilidade",
    entregas: [
      "Gestão de tráfego pago",
      "Nutrição da base de contatos por e-mail",
      "Relatório de retorno apresentado à diretoria",
    ],
    detalhe: { href: "#case", rotulo: "Ver o resultado" },
  },
  {
    nome: "Callim Sorveteria",
    segmento: "Sorveteria",
    entregas: [
      "Planejamento de marca",
      "Planejamento de conteúdo para Instagram e TikTok",
      "Auditoria de atendimento",
    ],
  },
  { nome: "Marvim Sorveteria", segmento: "Sorveteria" },
  { nome: "MS Consulting", segmento: "Consultoria" },
  { nome: "Mercado Delivery" },
];
