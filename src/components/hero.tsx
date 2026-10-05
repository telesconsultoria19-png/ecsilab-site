export function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Growth, processos e escala comercial
        </p>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Enquanto o mercado segue o rebanho,{" "}
          <span className="text-accent">a gente inventa o pasto.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/80 sm:text-xl">
          A ecsilab é o laboratório onde engenharia de processos, estratégia de growth, marketing e
          máquinas de vendas se unem para tirar a sua empresa do improviso.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#contato"
            className="rounded-md bg-accent px-6 py-3.5 text-center font-semibold text-ink transition-opacity hover:opacity-90"
          >
            Acelerar meu faturamento
          </a>
          <a
            href="#diagnostico"
            className="rounded-md border border-paper/40 px-6 py-3.5 text-center font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
          >
            Receber diagnóstico grátis
          </a>
        </div>

        <blockquote className="mt-16 max-w-2xl border-l-2 border-accent pl-5 text-paper/70">
          Aqui, ideias não pedem permissão para existir. Tiramos o seu negócio do rebanho corporativo
          com método de engenharia estruturada e processos implacáveis.
        </blockquote>
      </div>
    </section>
  );
}
