import { useEffect, useRef, useState } from "react";

import { CountUp } from "@/components/ui-bits";

// ROI sobre o valor investido, medido em períodos de 12 meses. Em ordem crescente, para formar a escada.
const ROIS = [
  { v: 7, d: 0, nome: "Clínica estética", tipo: "produtos e serviços" },
  { v: 21, d: 0, nome: "MS Consulting", tipo: "serviço" },
  { v: 37.1, d: 1, nome: "Gestão 360", tipo: "serviço", href: "/#case" },
];
const MAIOR = Math.max(...ROIS.map((r) => r.v));
const ALTURA_BARRA = 150; // px da barra mais alta

/** Faixa de resultados do Marcelo: números grandes e uma escada de ROI que sobe quando aparece na tela. */
export function ResultadosMarcelo() {
  const raiz = useRef<HTMLDivElement>(null);
  const [subiu, setSubiu] = useState(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSubiu(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSubiu(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={raiz} className="mt-10 rounded-2xl bg-white/[0.04] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Resultados</p>

      <dl className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <dt className="text-5xl font-extrabold text-accent drop-shadow-[0_0_14px_rgba(253,202,10,0.45)]">
            <CountUp value={250} prefix="+" />
          </dt>
          <dd className="mt-1 text-sm text-paper/70">consultorias realizadas</dd>
        </div>
        <div>
          <dt className="text-5xl font-extrabold text-accent drop-shadow-[0_0_14px_rgba(253,202,10,0.45)]">
            <CountUp value={11} />
          </dt>
          <dd className="mt-1 text-sm text-paper/70">anos de carreira</dd>
        </div>
      </dl>

      <div className="mt-9">
        <p className="text-sm font-semibold text-paper">ROI sobre o valor investido, em 12 meses</p>
        <ol className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
          {ROIS.map((r, i) => {
            const maior = r.v === MAIOR;
            return (
              <li key={r.nome} className="flex flex-col items-center justify-end text-center">
                <span
                  className={`mb-2 text-3xl font-extrabold sm:text-4xl ${maior ? "text-accent drop-shadow-[0_0_16px_rgba(253,202,10,0.6)]" : "text-paper"}`}
                >
                  <CountUp value={r.v} suffix="x" decimals={r.d} duration={1800 + i * 300} />
                </span>
                <div
                  className="flex w-full items-end justify-center"
                  style={{ height: ALTURA_BARRA }}
                >
                  <div
                    aria-hidden="true"
                    className={`w-full rounded-t-xl ${maior ? "bg-gradient-to-t from-accent/40 to-accent shadow-[0_0_30px_-4px_rgba(253,202,10,0.6)]" : "bg-gradient-to-t from-white/10 to-white/35"}`}
                    style={{
                      height: subiu ? Math.max(14, (r.v / MAIOR) * ALTURA_BARRA) : 0,
                      transition: `height 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.25}s`,
                    }}
                  />
                </div>
                <p className="mt-3 text-sm font-bold leading-tight text-paper">{r.nome}</p>
                <p className="text-xs leading-tight text-paper/60">{r.tipo}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-xs leading-relaxed text-paper/50">
          Resultados de clientes específicos, medidos em períodos de 12 meses. Cada caso depende do
          cenário e da execução.
        </p>
        <a
          href="/#case"
          className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
        >
          Ver o case Gestão 360 →
        </a>
      </div>
    </div>
  );
}
