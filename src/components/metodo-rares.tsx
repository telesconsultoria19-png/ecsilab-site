import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { GlowCard, SectionHead } from "@/components/ui-bits";
import {
  FERRAMENTAS_LASTRO,
  PERGUNTAS_LASTRO,
  RARES_BASE,
  RARES_ESTENDIDO,
  RARES_PRONUNCIA,
} from "@/lib/rares";

type Versao = "base" | "estendido";

/** Método Rares: assinatura de Marcelo Teles, desenvolvida pela Écsilab. */
export function MetodoRares() {
  const [versao, setVersao] = useState<Versao>("base");

  return (
    <section id="rares" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-60"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHead
          eyebrow="O método"
          title={
            <>
              Raro é acertar.{" "}
              <span className="font-serif font-normal italic text-accent">Rares é repetir.</span>
            </>
          }
          lead={
            <>
              Rares ({RARES_PRONUNCIA}) é uma assinatura de Marcelo Teles, desenvolvida pela
              Écsilab. Todo resultado precisa deixar lastro suficiente para ser repetido, e a
              empresa precisa crescer sem travar quando ele se repete.
            </>
          }
        />

        <div
          role="tablist"
          aria-label="Versão do método"
          className="mb-10 inline-flex rounded-full bg-white/[0.06] p-1"
        >
          {(
            [
              ["base", "Rares"],
              ["estendido", "Rares Estendido"],
            ] as const
          ).map(([id, rotulo]) => {
            const ativa = versao === id;
            return (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={ativa}
                onClick={() => setVersao(id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  ativa ? "btn-neon bg-accent text-ink" : "text-paper/80 hover:text-accent"
                }`}
              >
                {rotulo}
              </button>
            );
          })}
        </div>

        {versao === "base" ? (
          <div role="tabpanel" className="animate-[tab-in_0.45s_ease]">
            <div className="grid gap-6 md:grid-cols-3">
              {RARES_BASE.map((r) => (
                <GlowCard as="article" reveal={false} key={r.nome} className="p-8">
                  <p
                    aria-hidden="true"
                    className="text-7xl font-extrabold leading-none text-accent drop-shadow-[0_0_24px_rgba(253,202,10,0.45)]"
                  >
                    {r.silaba}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold">{r.nome}</h3>
                  <p className="mt-4 leading-relaxed text-paper/75">{r.texto}</p>
                </GlowCard>
              ))}
            </div>
            <p className="mt-8 text-paper/70">
              Para quem já passou por aqui e quer mais robustez, existe o{" "}
              <button
                type="button"
                onClick={() => setVersao("estendido")}
                className="font-semibold text-accent hover:underline"
              >
                Rares Estendido
              </button>
              .
            </p>
          </div>
        ) : (
          <div role="tabpanel" className="animate-[tab-in_0.45s_ease]">
            <p className="max-w-3xl text-lg leading-relaxed text-paper/80">
              Para empresas que já passaram pelo Rares e estão mais maduras. Cada letra de R-A-R-E-S
              vira um pilar: entram o <strong className="text-paper">Auditável</strong> e o{" "}
              <strong className="text-paper">Sustentável</strong>, com etapas próprias para modelar
              e organizar cada um deles.
            </p>
            <ol className="mt-8 space-y-4">
              {RARES_ESTENDIDO.map((p, i) => (
                <li
                  key={`${p.nome}-${i}`}
                  className={`grid gap-4 rounded-2xl p-6 sm:grid-cols-[5rem_1fr] sm:gap-6 sm:p-8 ${
                    p.novo ? "bg-accent/[0.08] ring-1 ring-accent/40" : "bg-white/[0.04]"
                  }`}
                >
                  <p
                    aria-hidden="true"
                    className="text-6xl font-extrabold leading-none text-accent drop-shadow-[0_0_20px_rgba(253,202,10,0.4)]"
                  >
                    {p.letra}
                  </p>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold">{p.nome}</h3>
                      {p.novo && (
                        <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-ink">
                          Novo na versão estendida
                        </span>
                      )}
                    </div>
                    <p className="mt-2 leading-relaxed text-paper/75">{p.texto}</p>
                    {p.entra && (
                      <ul className="mt-4 space-y-2 text-sm text-paper/90">
                        {p.entra.map((e) => (
                          <li key={e} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {e}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

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
