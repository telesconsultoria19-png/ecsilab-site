import { CountUp, Eyebrow, GlowCard, Section } from "@/components/ui-bits";

type Item = { v: number; d?: number; prefix?: string; suffix?: string; l: string };

const AMOSTRA: Item[] = [
  { v: 16, l: "campanhas na amostra" },
  { v: 258989, prefix: "R$ ", l: "investido no recorte" },
  { v: 5358, l: "leads gerados" },
  { v: 3.1, d: 1, suffix: " mi", l: "alcance acumulado" },
];

const RETORNO: Item[] = [
  { v: 108000, prefix: "R$ ", l: "vendas pontuais" },
  { v: 1603092, prefix: "R$ ", l: "projeção anual em receita recorrente" },
  { v: 46142, prefix: "R$ ", l: "investidos em anúncios no ano" },
  { v: 37.1, d: 1, suffix: "x", l: "relação LTV / CAC do período" },
];

function Grid({ itens }: { itens: Item[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {itens.map((i) => (
        <GlowCard key={i.l} className="p-6">
          <dt className="text-2xl font-extrabold text-accent drop-shadow-[0_0_14px_rgba(253,202,10,0.45)] sm:text-3xl">
            <CountUp value={i.v} decimals={i.d ?? 0} prefix={i.prefix ?? ""} suffix={i.suffix ?? ""} />
          </dt>
          <dd className="mt-2 text-sm text-paper/70">{i.l}</dd>
        </GlowCard>
      ))}
    </dl>
  );
}

export function CaseG360() {
  return (
    <>
      <section id="case" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[130px]"
        />
        <div className="reveal relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <div className="flex justify-center">
            <Eyebrow>Prova em campo · case G360</Eyebrow>
          </div>
          <p
            className="text-[5.5rem] font-extrabold leading-none tracking-tight text-accent drop-shadow-[0_0_40px_rgba(253,202,10,0.45)] sm:text-[9rem] lg:text-[13rem]"
            aria-label="37,1 vezes"
          >
            <CountUp value={37.1} decimals={1} suffix="x" duration={3000} />
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold sm:text-4xl">
            de retorno sobre cada real investido em mídia paga
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-paper/70">
            Relação LTV / CAC do ano-base 2024, apresentada à diretoria do grupo.
          </p>
        </div>
      </section>

      <Section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-paper/60">
          Amostra de tráfego pago · recorte de múltiplos anos
        </h3>
        <Grid itens={AMOSTRA} />

        <h3 className="mb-4 mt-12 text-sm font-semibold uppercase tracking-widest text-paper/60">
          Retorno apresentado à diretoria · ano-base 2024
        </h3>
        <Grid itens={RETORNO} />

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-paper/60">
          Amostragem de um recorte do período; não representa o total de verba gerenciada. O cálculo
          de LTV/CAC considera vendas pontuais e a projeção anual de receita recorrente sobre o
          investimento total em mídia paga no ano; o setup não entra na conta.
        </p>
      </Section>
    </>
  );
}
