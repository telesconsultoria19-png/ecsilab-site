import { GlowCard, Section, SectionHead } from "@/components/ui-bits";
import { CLIENTES, type Cliente } from "@/lib/clientes";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function Completo({ c }: { c: Cliente }) {
  const d = c.depoimento;
  return (
    <article className="reveal">
      <header className="mb-6">
        {c.segmento && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{c.segmento}</p>
        )}
        <h3 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{c.nome}</h3>
      </header>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* Esquerda: depoimento com foto (ou, sem depoimento, as entregas) */}
        <GlowCard reveal={false} className="flex flex-col p-7 sm:p-9">
          {d ? (
            <>
              <blockquote className="text-xl leading-relaxed text-paper sm:text-2xl">
                <span aria-hidden="true" className="mr-1 text-4xl leading-none text-accent">“</span>
                {d.texto}
              </blockquote>
              <footer className="mt-8 flex items-center gap-4">
                {d.foto ? (
                  <img
                    src={d.foto}
                    alt={d.autor}
                    loading="lazy"
                    className="h-16 w-16 rounded-full object-cover shadow-[0_0_30px_-8px_rgba(253,202,10,0.6)]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-xl font-bold text-accent"
                  >
                    {iniciais(d.autor)}
                  </span>
                )}
                <div>
                  <p className="font-semibold">{d.autor}</p>
                  {d.cargo && <p className="text-sm text-paper/60">{d.cargo}</p>}
                </div>
              </footer>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-paper/60">
                O que entregamos
              </p>
              <ul className="mt-5 space-y-3 text-paper/90">
                {(c.entregas ?? []).map((e) => (
                  <li key={e} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {e}
                  </li>
                ))}
              </ul>
            </>
          )}
        </GlowCard>

        {/* Direita: a história do que foi construído */}
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            O que construímos
          </p>
          <div className="space-y-4 text-lg leading-relaxed text-paper/80">
            {(c.historia ?? []).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {d && c.entregas && (
            <ul className="mt-6 space-y-2 text-sm text-paper/85">
              {c.entregas.map((e) => (
                <li key={e} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {e}
                </li>
              ))}
            </ul>
          )}
          {c.detalhe && (
            <a
              href={c.detalhe.href}
              className="mt-6 self-start text-sm font-semibold text-accent hover:underline"
            >
              {c.detalhe.rotulo} →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Clientes() {
  const completos = CLIENTES.filter((c) => c.historia || c.depoimento);
  const demais = CLIENTES.filter((c) => !c.historia && !c.depoimento);

  return (
    <Section id="clientes">
      <SectionHead
        eyebrow="Depoimentos e trabalhos construídos"
        title="Empresas que já construíram com a ecsilab"
        lead="Projetos de marketing, processos e tecnologia em negócios de segmentos diferentes."
      />

      <div className="space-y-20 md:space-y-28">
        {completos.map((c) => (
          <Completo key={c.nome} c={c} />
        ))}
      </div>

      {demais.length > 0 && (
        <div className="reveal mt-20 md:mt-28">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">
            Também construímos com
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demais.map((c) => (
              <li key={c.nome}>
                <GlowCard reveal={false} className="p-6">
                  {c.segmento && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {c.segmento}
                    </p>
                  )}
                  <p className={`${c.segmento ? "mt-2" : ""} text-2xl font-extrabold`}>{c.nome}</p>
                </GlowCard>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
