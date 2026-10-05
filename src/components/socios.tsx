import { Section, SectionHead } from "@/components/ui-bits";

const SOCIOS = [
  {
    foto: "/marcelo-teles.jpg" as string | null,
    iniciais: "MT",
    nome: "Marcelo Teles",
    cargo: "Co-founder e CEO",
    territorio: "Growth, marketing e processos, com a Teoria das Restrições",
    resumo:
      "Engenheiro de produção que aplica a Teoria das Restrições em estratégias de marketing e growth. Antes de acelerar qualquer canal, encontra o gargalo que realmente limita o faturamento.",
    competencias: [
      "Diagnóstico de gargalos comerciais e operacionais",
      "Método RRE: processos rastreáveis, replicáveis e escaláveis",
      "Tráfego, funil e máquina de vendas",
    ],
    numeros: [
      { v: "+250", l: "consultorias realizadas" },
      { v: "+R$ 30 mi", l: "gerenciados em tráfego" },
    ],
  },
  {
    foto: null as string | null,
    iniciais: "MS",
    nome: "Marcos Schneider",
    cargo: "Co-founder e CPO · CEO do Grupo MS",
    territorio: "Growth, marketing, finanças e modelagem de negócio",
    resumo:
      "CEO do Grupo MS, traz a visão de quem constrói e escala empresas por dentro: como o crescimento se sustenta nos números, no caixa e no desenho do negócio.",
    competencias: [
      "Finanças e saúde do caixa no crescimento",
      "Modelagem de negócio e de receita",
      "Governança comercial de quem opera um grupo",
    ],
    numeros: [],
  },
];

export function Socios() {
  return (
    <Section id="socios">
      <SectionHead
        eyebrow="Quem comanda o laboratório"
        title="Dois sócios, dois territórios, um objetivo: receita previsível"
        lead="A ecsilab junta duas formas complementares de enxergar o crescimento: a engenharia dos processos e a lógica dos números do negócio."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {SOCIOS.map((s) => (
          <article key={s.nome} className="flex flex-col">
            {s.foto ? (
              <img
                src={s.foto}
                alt={`${s.nome}, ${s.cargo}`}
                loading="lazy"
                className="mb-6 aspect-[4/3] w-full rounded-2xl object-cover object-[50%_20%]"
              />
            ) : (
              <div
                role="img"
                aria-label={`Foto de ${s.nome} em breve`}
                className="mb-6 flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-[#0f0f0f]"
              >
                <span className="text-5xl font-extrabold text-accent/60">{s.iniciais}</span>
              </div>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{s.cargo}</p>
            <h3 className="mt-3 text-3xl font-extrabold">{s.nome}</h3>
            <p className="mt-2 font-medium text-accent">{s.territorio}</p>
            <p className="mt-5 leading-relaxed text-paper/75">{s.resumo}</p>

            <ul className="mt-6 mb-8 space-y-2 text-sm text-paper/90">
              {s.competencias.map((c) => (
                <li key={c} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>

            {s.numeros.length > 0 && (
              <dl className="mt-auto grid grid-cols-2 gap-4 pt-8">
                {s.numeros.map((n) => (
                  <div key={n.l}>
                    <dt className="text-2xl font-extrabold text-accent">{n.v}</dt>
                    <dd className="mt-1 text-sm text-paper/70">{n.l}</dd>
                  </div>
                ))}
              </dl>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
