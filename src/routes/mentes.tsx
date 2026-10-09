import { createFileRoute } from "@tanstack/react-router";

import { MentesPage } from "@/components/mentes-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/mentes")({
  head: () =>
    seo({
      titulo: "Mentes | Quem está por trás do método Écsilab",
      descricao:
        "Conheça Marcelo Teles e Marcos Schneider, as mentes por trás da Écsilab e do método RRE (rastreável, replicável e escalável), potencializadas por inteligência artificial.",
      caminho: "/mentes",
    }),
  component: MentesPage,
});
