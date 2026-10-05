import { Section, SectionHead } from "@/components/ui-bits";

const AMOSTRA = [
  { v: "16", l: "campanhas na amostra" },
  { v: "R$ 258.989", l: "investido no recorte" },
  { v: "5.358", l: "leads gerados" },
  { v: "3,1 mi", l: "alcance acumulado" },
];

const RETORNO = [
  { v: "R$ 108.000", l: "vendas pontuais" },
  { v: "R$ 1.603.092", l: "projeção anual em receita recorrente" },
  { v: "R$ 46.142", l: "investidos em anúncios no ano" },
  { v: "37,1x", l: "relação LTV / CAC do período" },
];

function Grid({ itens }: { itens: Array<{ v: string; l: string }> }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
      {itens.map((i) => (
        <div key={i.l} className="bg-ink p-6">
          <dt className="text-2xl font-extrabold text-accent sm:text-3xl">{i.v}</dt>
          <dd className="mt-2 text-sm text-paper/70">{i.l}</dd>
        </div>
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
