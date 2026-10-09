import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import { MotionRebanho } from "@/components/motion-rebanho";
import { Eyebrow } from "@/components/ui-bits";

/**
 * Primeira seção da Home: "A dura realidade do mercado".
 * O título entra palavra a palavra; a segunda "moda" racha; "conta" é carimbada; as frases de apoio entram.
 * Com tudo à mostra, o texto fica parado por 10 s; então a palavra se recompõe e racha de novo (loop).
 * Embaixo, o rebanho segue a moda, e a ovelha da Écsilab vai no sentido contrário.
 */

const TEXTO_H1 = "O marketing tradicional virou moda. E moda não paga conta.";
const PAUSA_FINAL = 10000;

type Fase = "inteiro" | "rachando" | "rachado" | "curando";

// Pedaços da palavra rachada (em % da caixa da palavra) e o quanto cada um se afasta (em em).
const PEDACOS: Array<{ poly: string; mov: [number, number, number] }> = [
  { poly: "0% 0%, 46% 0%, 52% 18%, 44% 34%, 26% 46%, 0% 44%", mov: [-0.045, -0.035, -2] },
  { poly: "0% 44%, 26% 46%, 44% 34%, 55% 52%, 47% 70%, 24% 62%, 0% 66%", mov: [-0.05, 0.005, 1.2] },
  { poly: "0% 66%, 24% 62%, 47% 70%, 53% 86%, 49% 100%, 0% 100%", mov: [-0.03, 0.05, -1.5] },
  { poly: "46% 0%, 100% 0%, 100% 32%, 78% 26%, 52% 18%", mov: [0.04, -0.04, 1.8] },
  {
    poly: "52% 18%, 78% 26%, 100% 32%, 100% 70%, 74% 66%, 55% 52%, 44% 34%",
    mov: [0.055, 0.0, -1],
  },
  {
    poly: "55% 52%, 74% 66%, 100% 70%, 100% 100%, 49% 100%, 53% 86%, 47% 70%",
    mov: [0.04, 0.055, 2.2],
  },
];
const RACHADURAS = [
  "M46 0 L52 18 L44 34 L55 52 L47 70 L53 86 L49 100",
  "M52 18 L78 26 L100 32",
  "M44 34 L26 46 L0 44",
  "M55 52 L74 66 L100 70",
  "M47 70 L24 62 L0 66",
];

const FRASE_APOIO: Array<{ t: string; d?: boolean }> = [
  {
    t: "Se o seu serviço já é validado, você não precisa de mais burocracia criativa. Precisa de Inteligência de Mercado e de Marketing e Vendas que gerem ",
  },
  { t: "AUMENTO DIRETO DE FATURAMENTO", d: true },
  { t: "." },
];

function ModaRachada({ fase }: { fase: Fase }) {
  const rachado = fase === "rachado";
  const desenhando = fase === "rachando" || fase === "rachado";
  return (
    <span className="relative inline-block">
      <span className="invisible font-serif font-normal italic">moda</span>
      {PEDACOS.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="moda-brilho absolute inset-0 font-serif font-normal italic transition-[transform,opacity,filter] duration-[900ms] ease-out"
          style={
            {
              clipPath: `polygon(${p.poly})`,
              transform: rachado
                ? `translate(${p.mov[0]}em, ${p.mov[1]}em) rotate(${p.mov[2]}deg)`
                : "translate(0, 0) rotate(0deg)",
              opacity: rachado ? 0.72 : 1,
              filter: rachado ? "brightness(0.8)" : "none",
            } as CSSProperties
          }
        >
          moda
        </span>
      ))}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        {RACHADURAS.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            fill="none"
            stroke="#fdca0a"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: desenhando ? 0 : 1,
              transition: `stroke-dashoffset ${desenhando ? 0.5 : 0.6}s ease-out ${desenhando ? i * 0.07 : 0}s`,
              filter: "drop-shadow(0 0 5px #fdca0a)",
            }}
          />
        ))}
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[7em] w-[14em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(253,202,10,0.35),transparent)] transition-opacity duration-500"
        style={{ opacity: fase === "rachando" ? 1 : 0 }}
      />
    </span>
  );
}

export function GargalosHero() {
  const [rev, setRev] = useState(10);
  const [fase, setFase] = useState<Fase>("rachado");
  const [conta, setConta] = useState(true);
  const [contaKey, setContaKey] = useState(0);
  const [p1, setP1] = useState(true);
  const [p2, setP2] = useState(true);
  const [movimento, setMovimento] = useState(false);
  const pausadoRef = useRef(false);
  const paradoRef = useRef(false);
  const [pausadoUi, setPausadoUi] = useState(false);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMovimento(true);
    setRev(0);
    setFase("inteiro");
    setConta(false);
    setP1(false);
    setP2(false);
  }, []);

  useEffect(() => {
    if (!movimento) return;
    let vivo = true;
    /** Dorme `ms` milissegundos, contando só o tempo em que a animação não está pausada. */
    const dorme = async (ms: number) => {
      let falta = ms;
      while (vivo && falta > 0) {
        await new Promise((r) => setTimeout(r, 50));
        if (!pausadoRef.current) falta -= 50;
      }
    };
    const rachar = async () => {
      paradoRef.current = true;
      setFase("rachando");
      await dorme(650);
      setFase("rachado");
      await dorme(600);
      setConta(true);
      setContaKey((k) => k + 1);
      await dorme(1500);
      paradoRef.current = false;
    };

    (async () => {
      for (let i = 1; i <= 9; i++) {
        await dorme(i === 1 ? 500 : 170);
        if (!vivo) return;
        setRev(i);
      }
      await dorme(700);
      await rachar();
      await dorme(500);
      setP1(true);
      await dorme(800);
      setP2(true);
      await dorme(2000);
      while (vivo) {
        await dorme(PAUSA_FINAL);
        if (!vivo) return;
        setFase("curando");
        setConta(false);
        await dorme(1000);
        setFase("inteiro");
        await dorme(900);
        await rachar();
        await dorme(1500);
      }
    })();
    return () => {
      vivo = false;
      paradoRef.current = false;
    };
  }, [movimento]);

  const palavra = (i: number): CSSProperties => ({
    opacity: rev > i ? 1 : 0,
    transform: rev > i ? "none" : "translateY(0.35em)",
    filter: rev > i ? "none" : "blur(8px)",
    transition: "opacity .6s ease, transform .6s ease, filter .6s ease",
  });
  const PAL = "inline-block will-change-transform";

  const apoio = FRASE_APOIO.flatMap((f, bloco) =>
    (f.t.match(/\S+\s*/g) ?? []).map((w, k) => ({ w, d: f.d, id: `${bloco}-${k}` })),
  );

  return (
    <section id="gargalos" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0"
        style={{ ["--grade-opacidade" as string]: 0.11 }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-44 pt-20 sm:px-6 sm:pb-52 sm:pt-28">
        <Eyebrow>A dura realidade do mercado</Eyebrow>

        <h1 className="max-w-5xl text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="sr-only">{TEXTO_H1}</span>
          <span aria-hidden="true">
            <span className={PAL} style={palavra(0)}>
              O
            </span>{" "}
            <span className={PAL} style={palavra(1)}>
              marketing
            </span>{" "}
            <span className={PAL} style={palavra(2)}>
              tradicional
            </span>{" "}
            <span className={PAL} style={palavra(3)}>
              virou
            </span>{" "}
            <span className={PAL} style={palavra(4)}>
              <span className="moda-brilho font-serif font-normal italic">moda</span>.
            </span>{" "}
            <span className={PAL} style={palavra(5)}>
              E
            </span>{" "}
            <span className={PAL} style={palavra(6)}>
              <ModaRachada fase={fase} />
            </span>{" "}
            <span className={PAL} style={palavra(7)}>
              não
            </span>{" "}
            <span className={PAL} style={palavra(8)}>
              paga
            </span>{" "}
            <span
              key={contaKey}
              className={`${PAL} text-accent ${movimento && conta ? "animate-[conta-carimbo_0.9s_cubic-bezier(.2,1.4,.4,1)_both]" : ""}`}
              style={{ opacity: conta ? 1 : 0 }}
            >
              conta.
            </span>
          </span>
        </h1>

        <p
          className="mt-10 max-w-3xl text-lg leading-relaxed text-paper/70 transition-all duration-1000 sm:text-xl"
          style={{ opacity: p1 ? 1 : 0, transform: p1 ? "none" : "translateY(14px)" }}
        >
          Enquanto muita agência vende relatório de curtida e template de story, nós focamos no que
          mantém a empresa viva:{" "}
          <strong className="font-bold text-accent">PROCESSOS PREVISÍVEIS DE CRESCIMENTO</strong>.
        </p>

        <p
          className={`mt-8 max-w-3xl border-l-2 pl-5 text-2xl font-semibold leading-snug text-paper transition-colors duration-1000 sm:pl-7 sm:text-3xl lg:text-4xl ${p2 ? "border-accent" : "border-transparent"}`}
        >
          <span className="sr-only">{FRASE_APOIO.map((f) => f.t).join("")}</span>
          <span aria-hidden="true">
            {apoio.map((a, i) => (
              <span
                key={a.id}
                className={`inline-block whitespace-pre ${a.d ? "text-accent" : ""}`}
                style={{
                  opacity: p2 ? 1 : 0,
                  transform: p2 ? "none" : "translateY(0.4em)",
                  transition: "opacity .6s ease, transform .6s ease",
                  transitionDelay: p2 ? `${i * 45}ms` : "0ms",
                }}
              >
                {a.w}
              </span>
            ))}
          </span>
        </p>

        {movimento && (
          <button
            type="button"
            onClick={() => {
              pausadoRef.current = !pausadoRef.current;
              setPausadoUi(pausadoRef.current);
            }}
            aria-pressed={pausadoUi}
            className="sr-only focus-visible:not-sr-only focus-visible:mt-6 focus-visible:rounded-full focus-visible:bg-white/10 focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-paper"
          >
            {pausadoUi ? "Reproduzir a animação" : "Pausar a animação"}
          </button>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <MotionRebanho paradoRef={paradoRef} pausadoRef={pausadoRef} />
      </div>
    </section>
  );
}
