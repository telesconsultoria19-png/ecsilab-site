import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal-page";
import { POLITICA } from "@/lib/legal";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | ecsilab" },
      {
        name: "description",
        content:
          "Como a ecsilab coleta, usa e protege os seus dados pessoais, em conformidade com a LGPD.",
      },
    ],
  }),
  component: () => (
    <LegalPage doc={POLITICA} outro={{ to: "/termos-de-uso", rotulo: "Termos de Uso" }} />
  ),
});
