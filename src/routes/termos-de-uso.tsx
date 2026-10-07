import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal-page";
import { seo } from "@/lib/seo";
import { TERMOS } from "@/lib/legal";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => seo({ titulo: "Termos de Uso | Écsilab", descricao: "As regras para usar o site e as ferramentas gratuitas da Écsilab.", caminho: "/termos-de-uso" }),
  component: () => (
    <LegalPage doc={TERMOS} outro={{ to: "/politica-de-privacidade", rotulo: "Política de Privacidade" }} />
  ),
});
