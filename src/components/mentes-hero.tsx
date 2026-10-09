import { Pause, Play } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Eyebrow } from "@/components/ui-bits";

const PARTE_1 = "Duas mentes no comando. ";
const PARTE_2 = "Um objetivo claro: Aumentar o seu FATURAMENTO!";
const TEXTO = PARTE_1 + PARTE_2;

const dorme = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Hero da página Mentes: o título é escrito como numa máquina de escrever; depois passa uma luz, como a de
 * uma linha sob a porta; então o texto se apaga e tudo recomeça. Sem bordas: faz parte do fundo.
 * Com "reduzir movimento", o título aparece pronto e a luz fica parada.
 */
export function MentesHero() {
  const [n, setN] = useState(TEXTO.length);
  const [luz, setLuz] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [reduzido, setReduzido] = useState(false);
  const pausadoRef = useRef(false);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduzido(true);
      setPausado(true);
      pausadoRef.current = true;
      return;
    }
    setN(0);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let vivo = true;
    const espera = async () => {
      while (vivo && pausadoRef.current) await dorme(150);
    };
    (async () => {
      while (vivo) {
        for (let i = 1; i <= TEXTO.length; i++) {
          await espera();
          if (!vivo) return;
          setN(i);
          await dorme(TEXTO[i - 1] === " " ? 70 : 38 + Math.random() * 55);
        }
        await dorme(500);
        await espera();
        setLuz((k) => k + 1);
        await dorme(3600);
        await dorme(10000);
        for (let i = TEXTO.length; i >= 0; i -= 2) {
          await espera();
          if (!vivo) return;
          setN(Math.max(0, i));
          await dorme(22);
        }
        setN(0);
        await dorme(600);
      }
    })();
    return () => {
      vivo = false;
    };
  }, []);

  const alternar = () => {
    pausadoRef.current = !pausadoRef.current;
    setPausado(pausadoRef.current);
  };

  const digitando = n > 0 && n < TEXTO.length;
  const t1 = TEXTO.slice(0, Math.min(n, PARTE_1.length));
  const t2 = TEXTO.slice(PARTE_1.length, n);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0"
        style={{ ["--grade-opacidade" as string]: 0.11 }}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-20 sm:px-6 sm:pt-28">
        <Eyebrow>As mentes por trás do método</Eyebrow>

        <div className="relative max-w-5xl pb-5">
          <h1 className="text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="sr-only">{TEXTO}</span>
            <span aria-hidden="true" className="relative block">
              <span className="invisible">{TEXTO}</span>
              <span className="absolute inset-0">
                {t1}
                {t2 && <span className="shimmer-text">{t2}</span>}
                <span
                  className={`ml-1 inline-block h-[0.85em] w-[0.07em] translate-y-[0.08em] bg-accent ${
                    digitando || n === 0 ? "" : "animate-[pisca-cursor_1s_steps(1)_infinite]"
                  }`}
                />
              </span>
            </span>
          </h1>

          {/* a luz sob a porta: uma linha fina que corre pela base do título, com um clarão suave acima */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-x-clip"
          >
            {reduzido ? (
              <div className="mx-auto h-full w-1/3 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            ) : (
              <div
                key={luz}
                className={`relative h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent ${
                  luz > 0 ? "animate-[luz-porta_3.4s_ease-in-out_forwards]" : "opacity-0"
                }`}
              >
                <div className="absolute inset-x-0 bottom-full h-16 bg-[radial-gradient(ellipse_at_bottom,rgba(253,202,10,0.3),transparent_70%)]" />
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-paper/80 sm:text-xl">
          A Écsilab é a junção de duas formas complementares de enxergar o crescimento: a engenharia
          dos processos e a lógica dos números do negócio. Somos a força motriz por trás de cada
          resultado, e temos uma estrutura potencializada por agentes autônomos, Software House e o
          melhor do talento humano, para garantir cada entrega.
        </p>

        {!reduzido && (
          <button
            type="button"
            onClick={alternar}
            aria-label={pausado ? "Reproduzir a animação do título" : "Pausar a animação do título"}
            className="mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur transition hover:bg-white/20 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {pausado ? (
              <Play size={18} aria-hidden="true" />
            ) : (
              <Pause size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
