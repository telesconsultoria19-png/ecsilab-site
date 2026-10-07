export const SITE = "https://ecsilab.com.br";

export const TITULO_PADRAO = "Écsilab | Growth, processos e escala comercial";
export const DESCRICAO_PADRAO =
  "A Écsilab é onde Marketing, Engenharia de Processos, Estratégia de Growth e Máquinas de Vendas se unem para tirar o seu negócio do improviso.";

/** Etiquetas de busca e de compartilhamento próprias de cada página. */
export function seo({
  titulo,
  descricao,
  caminho,
}: {
  titulo: string;
  descricao: string;
  caminho: string;
}) {
  return {
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:url", content: `${SITE}${caminho}` },
      { name: "twitter:title", content: titulo },
      { name: "twitter:description", content: descricao },
    ],
    links: [{ rel: "canonical", href: `${SITE}${caminho}` }],
  };
}
