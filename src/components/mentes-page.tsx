import { ArrowRight, Cpu, Gauge, Target } from "lucide-react";

import { Mentes } from "@/components/mentes";
import { Contato } from "@/components/contato";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Eyebrow, GlowCard, Section, SectionHead } from "@/components/ui-bits";

const COMO_ENTREGAMOS = [
  {
    Icone: Target,
    titulo: "Quem desenhou o método conduz",
    texto:
      "Diagnóstico, estratégia e decisões críticas passam pelos dois fundadores. Nada importante é delegado a quem não construiu o método.",
  },
  {
    Icone: Cpu,
    titulo: "A IA dá escala à execução",
    texto:
      "Uma estrutura de execução apoiada por inteligência artificial, e por uma equipe, cuida de análise, produção, automação e acompanhamento, com velocidade que um time tradicional não alcança.",
  },
  {
    Icone: Gauge,
    titulo: "Tudo medido e rastreável",
    texto:
      "Metas por OKR, ciclos curtos e indicadores ligados ao resultado financeiro. A entrega é acompanhada de ponta a ponta, não apenas relatada no fim.",
  },
];

const PERGUNTAS_LASTRO = [
  "Quais decisões foram tomadas?",
  "Quais dados foram analisados?",
  "Quais ações foram colocadas em prática?",
  "Quais orçamentos foram usados?",
  "O que determinou a virada?",
];

const RRE = [
  {
    letra: "R",
    nome: "Rastreável",
    texto:
      "Toda atividade da empresa deixa lastro. Se alguém quiser entender o que foi feito para o negócio mudar de rumo, encontra o caminho inteiro registrado: o que se decidiu, com base em quê, o que se executou, quanto custou e o que provocou a virada.",
  },
  {
    letra: "R",
    nome: "Replicável",
    texto:
      "Rastrear é o que permite repetir. Com o registro completo do que funcionou, temos parâmetros para fazer de novo: o resultado deixa de ser um acaso feliz e passa a ser um procedimento que se reproduz.",
  },
  {
    letra: "E",
    nome: "Escalável",
    texto:
      "Construímos soluções, produtos e estruturas que suportam o crescimento sendo replicado, de novo e de novo. O negócio escala sem travar, de forma constante, nas restrições de capacidade de crescimento.",
  },
];

const FERRAMENTAS_LASTRO = [
  "Documentação dos processos",
  "Relatórios periódicos",
  "Dashboards de indicadores",
  "Logs de decisões",
  "Registro de ações e de orçamentos",
  "Playbooks para repetir o que funcionou",
];

/** O método RRE: assinatura de Marcelo Teles, desenvolvido pela Écsilab. */
function MetodoRRE() {
  return (
    <section id="rre" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-60"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHead
          eyebrow="O método"
          title={
            <>
              RRE: rastreável, replicável e{" "}
              <span className="font-serif font-normal italic text-accent">escalável.</span>
            </>
          }
          lead="Uma assinatura de Marcelo Teles, desenvolvida pela Écsilab. É o critério por trás de tudo o que a gente constrói para uma empresa."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {RRE.map((r) => (
            <GlowCard as="article" key={r.nome} className="p-8">
              <p
                aria-hidden="true"
                className="text-7xl font-extrabold leading-none text-accent drop-shadow-[0_0_24px_rgba(253,202,10,0.45)]"
              >
                {r.letra}
              </p>
              <h3 className="mt-4 text-2xl font-bold">{r.nome}</h3>
              <p className="mt-4 leading-relaxed text-paper/75">{r.texto}</p>
            </GlowCard>
          ))}
        </div>

        <div className="reveal mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            O lastro de cada virada
          </p>
          <h3 className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight sm:text-3xl">
            Para qualquer mudança de rumo, a empresa consegue responder:
          </h3>
          <ol className="mt-8 grid gap-3 md:grid-cols-5">
            {PERGUNTAS_LASTRO.map((q, i) => (
              <li key={q} className="relative rounded-xl bg-white/[0.04] p-5">
                <span className="text-sm font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-medium leading-snug text-paper">{q}</p>
                {i < PERGUNTAS_LASTRO.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -right-3.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-accent md:block"
                  />
                )}
              </li>
            ))}
          </ol>

          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Como o lastro é construído
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {FERRAMENTAS_LASTRO.map((f) => (
              <li
                key={f}
                className="rounded-full bg-accent/[0.1] px-4 py-2 text-sm font-medium text-paper/90"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function MentesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="tech-grid pointer-events-none absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-6 pt-20 sm:px-6 sm:pt-28">
            <Eyebrow>As mentes por trás do método</Eyebrow>
            <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Duas mentes no comando.{" "}
              <span className="shimmer-text">Uma operação inteira com IA por trás.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-paper/80 sm:text-xl">
              A Écsilab é a junção de duas formas complementares de enxergar o crescimento: a
              engenharia dos processos e a lógica dos números do negócio. Somos a força motriz por
              trás de cada resultado, e temos uma estrutura potencializada por inteligência
              artificial para garantir cada entrega.
            </p>
          </div>
        </section>

        <Mentes />
        <MetodoRRE />

        <Section tone="soft">
          <SectionHead
            eyebrow="Como entregamos"
            title={
              <>
                Comando de quem criou. Escala de quem{" "}
                <span className="font-serif font-normal italic text-accent">automatiza.</span>
              </>
            }
            lead="O que sustenta a entrega não é só o talento de duas pessoas: é um sistema de trabalho desenhado por elas."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {COMO_ENTREGAMOS.map((c) => (
              <GlowCard as="article" key={c.titulo} className="p-8">
                <c.Icone className="h-8 w-8 text-accent" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-bold">{c.titulo}</h3>
                <p className="mt-4 leading-relaxed text-paper/75">{c.texto}</p>
              </GlowCard>
            ))}
          </div>
        </Section>

        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
