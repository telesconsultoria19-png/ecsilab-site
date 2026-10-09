import { Cpu, Gauge, Target } from "lucide-react";

import { Mentes } from "@/components/mentes";
import { MetodoRares } from "@/components/metodo-rares";
import { Contato } from "@/components/contato";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Eyebrow, GlowCard, Section, SectionHead } from "@/components/ui-bits";

const COMO_ENTREGAMOS = [
  {
    Icone: Target,
    titulo: "Quem desenhou o método conduz",
    texto:
      "Diagnóstico, estratégia e decisões críticas passam pelos dois fundadores. Nada importante é delegado a quem não construiu o método.",
  },
  {
    Icone: Cpu,
    titulo: "A IA dá escala à execução",
    texto:
      "Uma estrutura de execução apoiada por inteligência artificial, e por uma equipe, cuida de análise, produção, automação e acompanhamento, com velocidade que um time tradicional não alcança.",
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
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="tech-grid pointer-events-none absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-6 pt-20 sm:px-6 sm:pt-28">
            <Eyebrow>As mentes por trás do método</Eyebrow>
            <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Duas mentes no comando.{" "}
              <span className="shimmer-text">Uma operação inteira com IA por trás.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-paper/80 sm:text-xl">
              A Écsilab é a junção de duas formas complementares de enxergar o crescimento: a
              engenharia dos processos e a lógica dos números do negócio. Somos a força motriz por
              trás de cada resultado, e temos uma estrutura potencializada por inteligência
              artificial para garantir cada entrega.
            </p>
          </div>
        </section>

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
