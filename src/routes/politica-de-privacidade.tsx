import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal-page";
import { seo } from "@/lib/seo";
import { POLITICA } from "@/lib/legal";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => seo({ titulo: "Política de Privacidade | Écsilab", descricao: "Como a Écsilab coleta, usa e protege os seus dados pessoais, em conformidade com a LGPD.", caminho: "/politica-de-privacidade" }),
  component: () => (
    <LegalPage doc={POLITICA} outro={{ to: "/termos-de-uso", rotulo: "Termos de Uso" }} />
  ),
});
