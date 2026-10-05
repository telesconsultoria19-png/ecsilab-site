import { EnergyFlow } from "@/components/energy-flow";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="tech-grid pointer-events-none absolute inset-0" />
      <EnergyFlow className="opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Growth, marketing, processos e IA para empresas de serviço
        </p>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Achamos o gargalo que trava o seu faturamento e{" "}
          <span className="shimmer-text">construímos a máquina que o destrava.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/80 sm:text-xl">
          Diagnóstico pela Teoria das Restrições, tráfego e funil de vendas, processos e soluções de
          inteligência artificial, para a sua empresa crescer com previsibilidade.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#contato"
            className="btn-neon rounded-xl bg-accent px-6 py-3.5 text-center font-semibold text-ink"
          >
            Acelerar meu faturamento
          </a>
          <a
            href="#diagnostico"
            className="rounded-xl bg-white/[0.06] px-6 py-3.5 text-center font-semibold text-paper backdrop-blur transition hover:bg-white/10 hover:text-accent"
          >
            Receber diagnóstico grátis
          </a>
        </div>

        <blockquote className="mt-16 max-w-2xl border-l-2 border-accent pl-5">
          <p className="text-lg font-semibold text-paper">
            Enquanto o mercado segue o rebanho, a gente inventa o pasto.
          </p>
          <p className="mt-2 text-paper/70">
            Aqui, ideias não pedem permissão para existir. Tiramos o seu negócio do rebanho
            corporativo com método de engenharia estruturada e processos implacáveis.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
