import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal-page";
import { TERMOS } from "@/lib/legal";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso | ecsilab" },
      {
        name: "description",
        content: "As regras para usar o site e as ferramentas gratuitas da ecsilab.",
      },
    ],
  }),
  component: () => (
    <LegalPage doc={TERMOS} outro={{ to: "/politica-de-privacidade", rotulo: "Política de Privacidade" }} />
  ),
});
