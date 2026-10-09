import { Fio } from "@/components/animated-icons";
import { CountUp, Section } from "@/components/ui-bits";

const TIME = [
  {
    foto: "/marcelo-teles.jpg" as string | null,
    iniciais: "MT",
    nome: "Marcelo Teles",
    cargo: "CEO",
    territorio: "Growth, Marketing e processos, com a Teoria das Restrições",
    resumo:
      "Engenheiro de produção que aplica a Teoria das Restrições em estratégias de Marketing e Growth. Antes de acelerar qualquer canal, encontra o gargalo que realmente limita o faturamento.",
    competencias: [
      "Diagnóstico de gargalos comerciais e operacionais",
      "Método Rares: processos rastreáveis, replicáveis e escaláveis",
      "Tráfego, funil e máquina de vendas",
    ],
    numeros: [{ v: 250, prefix: "+", suffix: "", d: 0, l: "consultorias realizadas" }],
    roi: [
      { v: 9, d: 0 },
      { v: 21, d: 0 },
      { v: 37.1, d: 1 },
    ] as Array<{ v: number; d: number }> | undefined,
  },
  {
    foto: "/marcos-schneider.jpg" as string | null,
    iniciais: "MS",
    nome: "Marcos Schneider",
    cargo: "COO",
    territorio: "Growth, Marketing, finanças e modelagem de negócio",
    resumo:
      "Cuida da operação da Écsilab e do território de Growth, Marketing, finanças e modelagem de negócio: como o crescimento se sustenta nos números, no caixa e no desenho do negócio.",
    competencias: [
      "Finanças e saúde do caixa no crescimento",
      "Modelagem de negócio e de receita",
      "Operação e governança do crescimento",
    ],
    numeros: [] as Array<{ v: number; prefix: string; suffix: string; d: number; l: string }>,
    roi: undefined as Array<{ v: number; d: number }> | undefined,
  },
];

export function Mentes() {
  return (
    <Section id="mentes">
      <div className="space-y-16 md:space-y-28">
        {TIME.map((s, i) => (
          <article
            key={s.nome}
            className="reveal grid items-center gap-8 md:min-h-[70vh] md:grid-cols-2 md:gap-16"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              {s.foto ? (
                <img
                  src={s.foto}
                  alt={`${s.nome}, ${s.cargo}`}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-3xl object-cover object-[50%_20%] shadow-[0_0_80px_-30px_rgba(253,202,10,0.45)]"
                />
              ) : (
                <div
                  role="img"
                  aria-label={`Foto de ${s.nome} em breve`}
                  className="flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-[#0f0f0f]"
                >
                  <span className="text-7xl font-extrabold text-accent/60">{s.iniciais}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                {s.cargo}
              </p>
              <h3 className="nome-espelho mt-3 w-fit pb-1 text-4xl font-extrabold sm:text-5xl">
                {s.nome}
              </h3>
              <Fio />
              <p className="mt-3 text-lg font-medium text-accent">{s.territorio}</p>
              <p className="mt-6 text-lg leading-relaxed text-paper/75">{s.resumo}</p>

              <ul className="mb-8 mt-6 space-y-2 text-paper/90">
                {s.competencias.map((c) => (
                  <li key={c} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>

              {s.numeros.length > 0 && (
                <dl className="grid grid-cols-2 gap-4 pt-2">
                  {s.numeros.map((n) => (
                    <div key={n.l}>
                      <dt className="text-4xl font-extrabold text-accent drop-shadow-[0_0_14px_rgba(253,202,10,0.45)]">
                        <CountUp value={n.v} prefix={n.prefix} suffix={n.suffix} decimals={n.d} />
                      </dt>
                      <dd className="mt-1 text-sm text-paper/70">{n.l}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {s.roi && (
                <div className="mt-6">
                  <p className="text-sm text-paper/70">
                    Escalabilidade de negócios alcançada, com ROI de
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-4xl font-extrabold text-accent drop-shadow-[0_0_14px_rgba(253,202,10,0.45)]">
                    {s.roi.map((r) => (
                      <span key={r.v}>
                        <CountUp value={r.v} suffix="x" decimals={r.d} duration={2200} />
                      </span>
                    ))}
                  </p>
                  <p className="mt-1 text-sm text-paper/70">o valor investido</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
