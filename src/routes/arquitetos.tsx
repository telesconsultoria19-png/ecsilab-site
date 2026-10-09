import { createFileRoute } from "@tanstack/react-router";

import { ArquitetosPage } from "@/components/arquitetos-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/arquitetos")({
  head: () =>
    seo({
      titulo: "Arquitetos | As mentes por trás do método Écsilab",
      descricao:
        "Conheça Marcelo Teles e Marcos Schneider, os arquitetos da Écsilab: a engenharia dos processos e a lógica dos números, potencializadas por inteligência artificial.",
      caminho: "/arquitetos",
    }),
  component: ArquitetosPage,
});
