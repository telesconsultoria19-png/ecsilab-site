import { Cpu, Gauge, Target } from "lucide-react";

import { Mentes } from "@/components/mentes";
import { MentesHero } from "@/components/mentes-hero";
import { MetodoRares } from "@/components/metodo-rares";
import { Contato } from "@/components/contato";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GlowCard, Section, SectionHead } from "@/components/ui-bits";

const COMO_ENTREGAMOS = [
  {
    Icone: Target,
    titulo: "Quem desenhou o método conduz",
    texto:
      "Diagnóstico, estratégia e decisões críticas passam pelos dois fundadores. Nada importante é delegado a quem não construiu o método.",
  },
  {
    Icone: Cpu,
    titulo: "A tecnologia dá escala à execução",
    texto:
      "Agentes autônomos, Software House e o melhor do talento humano cuidam de análise, produção, automação e acompanhamento, com velocidade que um time tradicional não alcança.",
  },
  {
    Icone: Gauge,
    titulo: "Tudo medido e rastreável",
    texto:
      "Metas por OKR, ciclos curtos e indicadores ligados ao resultado financeiro. A entrega é acompanhada de ponta a ponta, não apenas relatada no fim.",
  },
];

export function MentesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <MentesHero />

        <Mentes />
        <MetodoRares />

        <Section tone="soft">
          <SectionHead
            eyebrow="Como entregamos"
            title={
              <>
                Comando de quem criou. Escala de quem{" "}
                <span className="font-serif font-normal italic text-accent">automatiza.</span>
              </>
            }
            lead="O que sustenta a entrega não é só o talento de duas pessoas: é um sistema de trabalho desenhado por elas."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {COMO_ENTREGAMOS.map((c) => (
              <GlowCard as="article" key={c.titulo} className="p-8">
                <c.Icone className="h-8 w-8 text-accent" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-bold">{c.titulo}</h3>
                <p className="mt-4 leading-relaxed text-paper/75">{c.texto}</p>
              </GlowCard>
            ))}
          </div>
        </Section>

        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
