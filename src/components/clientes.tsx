import { GlowCard, Section, SectionHead } from "@/components/ui-bits";
import { CLIENTES } from "@/lib/clientes";

export function Clientes() {
  return (
    <Section id="clientes">
      <SectionHead
        eyebrow="Depoimentos e trabalhos construídos"
        title="Empresas que já construíram com a ecsilab"
        lead="Projetos de marketing, processos e tecnologia em negócios de segmentos diferentes."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLIENTES.map((c) => (
          <GlowCard as="article" key={c.nome} className="flex flex-col p-7">
            {c.segmento && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {c.segmento}
              </p>
            )}
            <h3 className={`${c.segmento ? "mt-2" : ""} text-3xl font-extrabold tracking-tight`}>
              {c.nome}
            </h3>

            {c.entregas && (
              <ul className="mt-5 space-y-2 text-sm text-paper/85">
                {c.entregas.map((e) => (
                  <li key={e} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {e}
                  </li>
                ))}
              </ul>
            )}

            {c.depoimento && (
              <blockquote className="mt-5 border-l-2 border-accent pl-4 text-paper/85">
                <p>“{c.depoimento.texto}”</p>
                <footer className="mt-2 text-sm text-paper/60">
                  {c.depoimento.autor}
                  {c.depoimento.cargo ? `, ${c.depoimento.cargo}` : ""}
                </footer>
              </blockquote>
            )}

            {c.detalhe && (
              <a
                href={c.detalhe.href}
                className="mt-auto self-start pt-6 text-sm font-semibold text-accent hover:underline"
              >
                {c.detalhe.rotulo} →
              </a>
            )}
          </GlowCard>
        ))}
      </div>
    </Section>
  );
}
