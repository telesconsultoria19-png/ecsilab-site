import { OvelhaParticulas } from "@/components/ovelha-particulas";
import { Eyebrow } from "@/components/ui-bits";

/** Primeira seção da Home: "A dura realidade do mercado", com a ovelha da Écsilab formada por partículas. */
export function HomeHero() {
  return (
    <section id="gargalos" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0"
        style={{ ["--grade-opacidade" as string]: 0.11 }}
      />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pb-24 lg:pt-20">
        <div>
          <Eyebrow>A dura realidade do mercado</Eyebrow>
          <h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            O Marketing tradicional virou moda.{" "}
            <span className="text-accent">E moda não paga conta!</span>
          </h1>
          <p className="mt-10 max-w-2xl text-xl leading-relaxed text-paper/80 sm:text-2xl">
            Se o seu negócio já é validado, você não precisa de mais burocracia criativa. Precisa de
            Inteligência de Mercado, Marketing e Vendas que geram o{" "}
            <strong className="font-bold text-accent">AUMENTO DIRETO DE FATURAMENTO</strong>!
          </p>
        </div>
        <OvelhaParticulas className="mx-auto max-w-[560px]" />
      </div>
    </section>
  );
}
