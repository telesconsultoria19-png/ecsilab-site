import { UserRound } from "lucide-react";

import { AspasAnimadas } from "@/components/animated-icons";
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
        {/* Esquerda: espaço reservado para a foto e o depoimento do empresário */}
        <GlowCard reveal={false} className="flex flex-col p-5 sm:p-6">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
            {d?.foto ? (
              <img
                src={d.foto}
                alt={d.autor}
                loading="lazy"
                className="h-full w-full object-cover object-[50%_20%]"
              />
            ) : (
              <div
                role="img"
                aria-label={`Foto do empresário da ${c.nome} em breve`}
                className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0f0f0f] text-paper/40"
              >
                <UserRound size={56} strokeWidth={1.25} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Foto do empresário
                </span>
              </div>
            )}
          </div>

          <blockquote className="mt-6 min-h-[7rem] text-xl leading-relaxed sm:text-2xl">
            <AspasAnimadas className="mb-3 h-9 w-9" />
            {d ? (
              <>
                <span className="text-paper">{d.texto}</span>
              </>
            ) : (
              <span className="italic text-paper/35">O depoimento do empresário entra aqui.</span>
            )}
          </blockquote>

          <footer className="mt-4">
            {d ? (
              <>
                <p className="font-semibold">{d.autor}</p>
                {d.cargo && <p className="text-sm text-paper/60">{d.cargo}</p>}
              </>
            ) : (
              <>
                <p className="font-semibold text-paper/35">Nome do empresário</p>
                <p className="text-sm text-paper/30">Cargo, {c.nome}</p>
              </>
            )}
          </footer>
        </GlowCard>

        {/* Direita: a história do que foi construído */}
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            O que construímos
          </p>
          <div className="space-y-4 text-lg leading-relaxed text-paper/80">
            {c.historia ? (
              c.historia.map((p) => <p key={p}>{p}</p>)
            ) : (
              <p className="italic text-paper/35">
                A história do que construímos para a {c.nome} entra aqui.
              </p>
            )}
          </div>
          {c.entregas && (
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
  return (
    <Section id="clientes">
      <SectionHead
        eyebrow="Depoimentos e trabalhos construídos"
        title="Empresas que já construíram com a Écsilab"
        lead="Projetos de marketing, processos e tecnologia em negócios de segmentos diferentes."
      />

      <div className="space-y-20 md:space-y-28">
        {CLIENTES.map((c) => (
          <Completo key={c.nome} c={c} />
        ))}
      </div>
    </Section>
  );
}
