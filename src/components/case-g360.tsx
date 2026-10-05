import { CountUp, GlowCard, Section, SectionHead } from "@/components/ui-bits";

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
    <Section id="case" tone="soft">
      <SectionHead
        eyebrow="Prova em campo"
        title="O case G360"
        lead="Um recorte real de tráfego pago e do retorno de caixa apresentado à diretoria do grupo, validando o método na prática."
      />

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
  );
}
