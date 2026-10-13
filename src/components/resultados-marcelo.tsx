import { useEffect, useRef, useState } from "react";

import { CountUp } from "@/components/ui-bits";

// ROI sobre o valor investido, medido em períodos de 12 meses. Do maior para o menor.
const ROIS = [
  { v: 37.1, d: 1, nome: "Gestão 360", tipo: "serviço" },
  { v: 21, d: 0, nome: "MS Consulting", tipo: "serviço" },
  { v: 7, d: 0, nome: "Clínica estética", tipo: "produtos e serviços" },
];
const MAIOR = Math.max(...ROIS.map((r) => r.v));

/** Resultados do Marcelo, em versão minimalista: dois números e barras horizontais que crescem quando aparecem na tela. */
export function ResultadosMarcelo() {
  const raiz = useRef<HTMLDivElement>(null);
  const [cresceu, setCresceu] = useState(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCresceu(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setCresceu(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={raiz} className="mt-10">
      <dl className="flex flex-wrap gap-x-12 gap-y-4">
        <div>
          <dt className="text-4xl font-extrabold text-accent">
            <CountUp value={250} prefix="+" />
          </dt>
          <dd className="mt-0.5 text-sm text-paper/60">consultorias realizadas</dd>
        </div>
        <div>
          <dt className="text-4xl font-extrabold text-accent">
            <CountUp value={11} />
          </dt>
          <dd className="mt-0.5 text-sm text-paper/60">anos de carreira</dd>
        </div>
      </dl>

      <div className="mt-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">
          ROI sobre o valor investido, em 12 meses
        </p>
        <ul className="mt-5 space-y-5">
          {ROIS.map((r, i) => {
            const maior = r.v === MAIOR;
            return (
              <li key={r.nome}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm text-paper/80">
                    <span className="font-semibold text-paper">{r.nome}</span>
                    <span className="text-paper/50"> · {r.tipo}</span>
                  </p>
                  <span
                    className={`text-xl font-extrabold tabular-nums ${maior ? "text-accent" : "text-paper"}`}
                  >
                    <CountUp value={r.v} suffix="x" decimals={r.d} duration={1600 + i * 300} />
                  </span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-white/10" aria-hidden="true">
                  <div
                    className={`h-full rounded-full ${maior ? "bg-accent shadow-[0_0_12px_rgba(253,202,10,0.6)]" : "bg-white/45"}`}
                    style={{
                      width: cresceu ? `${(r.v / MAIOR) * 100}%` : "0%",
                      transition: `width 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.25}s`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
