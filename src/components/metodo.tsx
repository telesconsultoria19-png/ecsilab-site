import { Section, SectionHead } from "@/components/ui-bits";

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
  return (
    <>
      <Section id="gargalos">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              A dura realidade do mercado
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              O marketing tradicional virou moda.{" "}
              <span className="text-accent">E moda não paga conta.</span>
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-paper/75">
            <p>
              Enquanto muita agência vende relatório de curtida e template de story, nós focamos no
              que mantém a empresa viva: <strong className="text-paper">processos previsíveis de crescimento</strong>.
            </p>
            <p>
              Se o seu serviço já é validado, você não precisa de mais burocracia criativa. Precisa
              de inteligência de mercado e de marketing e vendas que gerem aumento direto de
              faturamento.
            </p>
            <p className="border-l-2 border-accent pl-5 text-paper">
              Injetar tráfego sem entender onde está o gargalo é rasgar dinheiro. Consertamos o fluxo
              primeiro e aceleramos em seguida. Acelerar no rumo errado só serve para se perder mais
              rápido.
            </p>
          </div>
        </div>
      </Section>

      <Section id="metodo" tone="soft">
        <SectionHead
          eyebrow="Engenharia de processos e growth"
          title="O motor de operação e governança"
          lead="Não trabalhamos no “eu acho”. A ecsilab opera sob três governanças que organizam o fluxo de geração de receita."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {PILARES.map((p) => (
            <article key={p.n} className="rounded-xl border border-line p-7">
              <p className="text-sm font-semibold text-accent">{p.n}</p>
              <h3 className="mt-3 text-2xl font-bold">{p.titulo}</h3>
              <p className="mt-4 leading-relaxed text-paper/75">{p.texto}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-paper/90">
                {p.itens.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
