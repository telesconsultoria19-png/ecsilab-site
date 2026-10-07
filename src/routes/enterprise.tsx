import { createFileRoute } from "@tanstack/react-router";

import { EnterprisePage } from "@/components/enterprise-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/enterprise")({
  head: () =>
    seo({
      titulo: "Écsilab Enterprise | Departamentos inteiros operando com IA, com a infraestrutura sua",
      descricao:
        "Implantamos departamentos inteiros com inteligência artificial na sua empresa: pagamento único, infraestrutura em nome da sua empresa e sem mensalidade nossa para continuar funcionando.",
      caminho: "/enterprise",
    }),
  component: EnterprisePage,
});
