import { createFileRoute } from "@tanstack/react-router";

import { SolucoesPage } from "@/components/solucoes-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solucoes")({
  head: () =>
    seo({
      titulo: "Soluções | Serviços e soluções de IA da Écsilab",
      descricao:
        "Serviços conduzidos pela Écsilab e soluções de inteligência artificial prontas para implantar na sua operação: vendas, atendimento, finanças e gestão.",
      caminho: "/solucoes",
    }),
  component: SolucoesPage,
});
