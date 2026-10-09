import { Fio } from "@/components/animated-icons";
import { CountUp, Section } from "@/components/ui-bits";

const TIME = [
  {
    foto: "/marcelo-teles-ceo.jpg" as string | null,
    /** a foto já traz nome, cargo e áreas de conhecimento escritos: o texto lateral não repete isso */
    fotoComTexto: true,
    iniciais: "MT",
    nome: "Marcelo Teles",
    cargo: "CEO",
    territorio: "Growth, Marketing e processos, com a Teoria das Restrições",
    historia: [
      "Marcelo é engenheiro de produção e levou para o Marketing uma pergunta que a fábrica ensina cedo: onde está o gargalo? Em vez de apostar em mais um canal, mais uma campanha, mais verba, ele aprendeu a procurar o ponto que realmente limita o faturamento.",
      "Em mais de 250 consultorias, o cenário se repetiu: empresas injetando dinheiro em tráfego sem saber o que travava o próprio crescimento. Ele passou a fazer o contrário. Primeiro diagnostica o fluxo, depois quebra a restrição, e só então acelera.",
      "Dessa forma de trabalhar nasceu o Rares, método que ele desenvolveu ao lado de Marcos Schneider e que deixa cada decisão com lastro para ser repetida e escalada. E os números mostram o que acontece quando o esforço vai para o lugar certo:",
    ],
    resumo: "",
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
    fotoComTexto: false,
    historia: [] as string[],
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
                  className={`w-full rounded-3xl object-cover shadow-[0_0_80px_-30px_rgba(253,202,10,0.45)] ${
                    s.fotoComTexto
                      ? "aspect-[2/3] object-[50%_50%]"
                      : "aspect-[4/5] object-[50%_20%]"
                  }`}
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
              {s.fotoComTexto ? (
                <>
                  {/* nome, cargo e áreas já estão na foto; o título fica só para leitores de tela */}
                  <h3 className="sr-only">
                    {s.nome}, {s.cargo}. {s.territorio}
                  </h3>
                  <div className="space-y-5 text-lg leading-relaxed text-paper/80 sm:text-xl">
                    {s.historia.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}

              {s.numeros.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 gap-4 pt-2">
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
