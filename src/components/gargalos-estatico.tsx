import { Eyebrow } from "@/components/ui-bits";

/** Primeira seção da Home, em versão estática: "A dura realidade do mercado". (A versão em motion está em gargalos-hero.tsx.) */
export function GargalosEstatico() {
  return (
    <section id="gargalos" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0"
        style={{ ["--grade-opacidade" as string]: 0.11 }}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28">
        <Eyebrow>A dura realidade do mercado</Eyebrow>
        <h1 className="max-w-5xl text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
          O marketing tradicional virou moda.{" "}
          <span className="text-accent">E moda não paga conta.</span>
        </h1>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-paper/70 sm:text-xl">
          Enquanto muita agência vende relatório de curtida e template de story, nós focamos no que
          mantém a empresa viva:{" "}
          <strong className="font-bold text-accent">PROCESSOS PREVISÍVEIS DE CRESCIMENTO</strong>.
        </p>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-paper/70 sm:text-xl">
          Se o seu serviço já é validado, você não precisa de mais burocracia criativa. Precisa de
          Inteligência de Mercado e de Marketing e Vendas que gerem{" "}
          <strong className="font-bold text-accent">AUMENTO DIRETO DE FATURAMENTO</strong>.
        </p>
      </div>
    </section>
  );
}
