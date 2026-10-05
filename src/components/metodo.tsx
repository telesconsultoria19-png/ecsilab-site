import { ScrollWords } from "@/components/scroll-words";
import { Eyebrow } from "@/components/ui-bits";
import { useScrollProgress } from "@/lib/use-scroll";

const PILARES = [
  {
    n: "01",
    titulo: "Gestão por OKR",
    texto:
      "Não medimos sucesso por tarefas executadas. Alinhamos os objetivos de crescimento aos indicadores financeiros que realmente importam para a sua empresa.",
    itens: [
      "Foco no lucro líquido real",
      "KRs trimestrais por canal",
      "Fim das métricas de vaidade",
    ],
  },
  {
    n: "02",
    titulo: "Execução ágil com Scrum",
    texto:
      "O mercado muda rápido demais para planos engessados de seis meses. Rodamos sprints curtos: explorar, testar, errar, acertar e evoluir.",
    itens: [
      "Ciclos rápidos de validação",
      "Erro barato e controlado",
      "Escala só do que foi validado",
    ],
  },
  {
    n: "03",
    titulo: "Teoria das Restrições",
    texto:
      "Antes de otimizar tudo, achamos a única etapa que trava o crescimento e concentramos o esforço ali até ela deixar de ser o gargalo.",
    itens: [
      "Identificar o elo mais fraco do funil",
      "Foco total na restrição",
      "Elevar a capacidade a cada gargalo resolvido",
    ],
  },
];

export function Metodo() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const ativo = Math.min(PILARES.length - 1, Math.floor(p * PILARES.length));

  return (
    <>
      <section id="gargalos" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex min-h-[85vh] flex-col justify-center py-24">
            <Eyebrow>A dura realidade do mercado</Eyebrow>
            <ScrollWords
              text="O marketing tradicional virou moda. E moda não paga conta."
              accentFrom={5}
              className="max-w-5xl text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl"
            />
          </div>

          <div className="reveal grid gap-8 pb-24 text-lg leading-relaxed text-paper/75 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-5">
              <p>
                Enquanto muita agência vende relatório de curtida e template de story, nós focamos no
                que mantém a empresa viva:{" "}
                <strong className="text-paper">processos previsíveis de crescimento</strong>.
              </p>
              <p>
                Se o seu serviço já é validado, você não precisa de mais burocracia criativa. Precisa
                de inteligência de mercado e de marketing e vendas que gerem aumento direto de
                faturamento.
              </p>
            </div>
            <p className="border-l-2 border-accent pl-5 text-paper">
              Injetar tráfego sem entender onde está o gargalo é rasgar dinheiro. Consertamos o fluxo
              primeiro e aceleramos em seguida. Acelerar no rumo errado só serve para se perder mais
              rápido.
            </p>
          </div>
        </div>
      </section>

      {/* Cena fixa: no desktop o título fica parado e os pilares entram um a um. */}
      <section id="metodo" ref={ref} className="relative md:h-[320vh]">
        <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-accent/[0.07] blur-[120px]"
          />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.15fr] md:items-center md:py-0">
            <div>
              <Eyebrow>Engenharia de processos e growth</Eyebrow>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                O motor de operação e governança
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-paper/75">
                Não trabalhamos no “eu acho”. A ecsilab opera sob três governanças que organizam o
                fluxo de geração de receita.
              </p>
              <ol className="mt-10 hidden gap-3 md:flex" aria-label="Pilares do método">
                {PILARES.map((pl, i) => (
                  <li
                    key={pl.n}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      i <= ativo ? "bg-accent shadow-[0_0_14px_#fdca0a]" : "bg-white/10"
                    }`}
                    aria-current={i === ativo}
                  />
                ))}
              </ol>
            </div>

            <div className="grid gap-6 md:[&>*]:[grid-area:1/1]">
              {PILARES.map((pl, i) => (
                <article
                  key={pl.n}
                  data-ativo={i === ativo}
                  className="glow-card p-8 transition-all duration-700 md:data-[ativo=false]:pointer-events-none md:data-[ativo=false]:translate-y-8 md:data-[ativo=false]:opacity-0 md:data-[ativo=true]:opacity-100"
                >
                  <p className="text-sm font-semibold text-accent">{pl.n}</p>
                  <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{pl.titulo}</h3>
                  <p className="mt-4 leading-relaxed text-paper/75">{pl.texto}</p>
                  <ul className="mt-6 space-y-2 pt-2 text-sm text-paper/90">
                    {pl.itens.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
