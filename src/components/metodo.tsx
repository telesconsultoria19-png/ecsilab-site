import { ScrollWords } from "@/components/scroll-words";
import { IconCorrente, IconOKR, IconScrum } from "@/components/animated-icons";
import { Eyebrow, GlowCard, SectionHead, Section } from "@/components/ui-bits";

const PILARES = [
  {
    n: "01",
    Icone: IconOKR,
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
    Icone: IconScrum,
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
    Icone: IconCorrente,
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
  return (
    <>
      <section id="gargalos" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="pt-24 sm:pt-32">
            <Eyebrow>A dura realidade do mercado</Eyebrow>
            <ScrollWords
              text="O marketing tradicional virou moda. E moda não paga conta."
              accentFrom={5}
              className="max-w-5xl text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl"
            />
          </div>

          <div className="reveal mt-10 grid gap-8 pb-24 text-lg sm:mt-14 leading-relaxed text-paper/75 lg:grid-cols-2 lg:gap-16">
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

      <Section id="metodo" tone="soft">
        <SectionHead
          eyebrow="Engenharia de processos e growth"
          title="O motor de operação e governança"
          lead="Não trabalhamos no “eu acho”. A Écsilab opera sob três governanças que organizam o fluxo de geração de receita."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {PILARES.map((pl) => (
            <GlowCard as="article" key={pl.n} className="p-8">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-accent">{pl.n}</p>
                <pl.Icone />
              </div>
              <h3 className="mt-3 text-2xl font-bold">{pl.titulo}</h3>
              <p className="mt-4 leading-relaxed text-paper/75">{pl.texto}</p>
              <ul className="mt-6 space-y-2 pt-2 text-sm text-paper/90">
                {pl.itens.map((it) => (
                  <li key={it} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {it}
                  </li>
                ))}
              </ul>
            </GlowCard>
          ))}
        </div>
      </Section>
    </>
  );
}
