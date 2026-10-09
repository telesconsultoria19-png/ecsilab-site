import { useEffect, useRef } from "react";

type Dados = { w: number; h: number; p: number[] };

const AMARELO = "253,202,10";
const BRANCO = "255,255,255";

/**
 * A ovelha da Écsilab feita de partículas: elas voam de pontos aleatórios e se montam, depois respiram e flutuam.
 * O mouse (ou o toque) afasta as partículas, uma onda de luz atravessa a ovelha de tempos em tempos e, ao rolar a
 * página para além da hero, a ovelha se desfaz e se dispersa. Não tem bordas: faz parte do fundo.
 * Os pontos vêm de /ovelha-particulas.json, gerado a partir de /ovelha.png.
 */
export function OvelhaParticulas({ className = "" }: { className?: string }) {
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const caixa = caixaRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!caixa || !canvas || !ctx) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let vivo = true;
    let cw = 0;
    let ch = 0;
    let dpr = 1;
    let raf = 0;
    let visivel = false;
    let tempo = 0;
    let anterior = 0;
    let dtq = 1 / 60;
    const mouse = { x: -9999, y: -9999 };

    // partículas (arrays tipados, para ficar leve)
    let n = 0;
    let nx: Float32Array, ny: Float32Array; // posição de repouso, em unidades da ovelha (-0.5 a 0.5)
    let x: Float32Array, y: Float32Array; // posição atual
    let ang: Float32Array, rnd: Float32Array, asm: Float32Array, vel: Float32Array;
    let tipo: Uint8Array;

    const medir = () => {
      const r = caixa.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = r.width;
      ch = r.height;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    };

    const desenhar = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      if (n === 0) return;
      const S = Math.min(cw, ch) * 1.08;
      const cx = cw / 2;
      const cy = ch / 2;
      const respira = 1 + Math.sin(tempo * 0.9) * 0.012;

      // dispersão ao rolar para além da hero
      const r = caixa.getBoundingClientRect();
      const disp = reduzir
        ? 0
        : Math.min(
            1,
            Math.max(
              0,
              (window.innerHeight * 0.18 - r.top - r.height * 0.35) / (window.innerHeight * 0.5),
            ),
          );

      // onda de luz: a cada 7 s, um anel que cresce a partir do centro
      const fase = (tempo % 7) / 2.4;
      const raioOnda = fase < 1 ? fase * S * 0.62 : -1;
      const raioMouse = Math.max(48, S * 0.13);

      const tam = Math.max(1.1, S / 250);
      for (let i = 0; i < n; i++) {
        const a = ang[i]!;
        const q = rnd[i]!;
        let tx = cx + nx[i]! * S * respira + Math.sin(tempo * 0.8 + a * 3) * 0.9;
        let ty = cy + ny[i]! * S * respira + Math.cos(tempo * 0.6 + a * 2) * 0.9;

        let brilho = 0;
        if (raioOnda >= 0) {
          const dx0 = tx - cx;
          const dy0 = ty - cy;
          const d0 = Math.hypot(dx0, dy0);
          const f = 1 - Math.min(1, Math.abs(d0 - raioOnda) / (S * 0.07));
          if (f > 0) {
            brilho = f;
            tx += (dx0 / (d0 || 1)) * f * S * 0.02;
            ty += (dy0 / (d0 || 1)) * f * S * 0.02;
          }
        }
        if (disp > 0) {
          tx += Math.cos(a) * disp * S * (0.3 + q * 0.7);
          ty += Math.sin(a) * disp * S * (0.3 + q * 0.7) - disp * S * 0.25;
        }

        if (asm[i]! < 1) asm[i] = Math.min(1, asm[i]! + vel[i]! * dtq * 60);
        const e = 1 - Math.pow(1 - asm[i]!, 3);
        const k = reduzir ? 1 : 0.02 + e * 0.05;
        x[i] = x[i]! + (tx - x[i]!) * k;
        y[i] = y[i]! + (ty - y[i]!) * k;

        // o mouse empurra
        const mx = x[i]! - mouse.x;
        const my = y[i]! - mouse.y;
        const d2 = mx * mx + my * my;
        if (d2 < raioMouse * raioMouse && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = (raioMouse - d) / raioMouse;
          x[i] = x[i]! + (mx / d) * f * 11;
          y[i] = y[i]! + (my / d) * f * 11;
        }

        const amarela = tipo[i] === 1;
        const alfa = Math.min(
          1,
          ((amarela ? 0.85 : 0.62) + q * 0.3 + brilho * 0.5) * e * (1 - disp),
        );
        if (alfa <= 0.01) continue;
        ctx.fillStyle = `rgba(${amarela ? AMARELO : BRANCO},${alfa})`;
        const s = tam * (0.8 + q * 0.7) * (1 + brilho * 0.6);
        ctx.fillRect(x[i]! - s / 2, y[i]! - s / 2, s, s);
      }
    };

    const quadro = (agora: number) => {
      raf = 0;
      if (!vivo || !visivel) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      tempo += dt;
      dtq = dt;
      desenhar();
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      if (reduzir || raf || !vivo) return;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    medir();
    fetch("/ovelha-particulas.json")
      .then((res) => res.json() as Promise<Dados>)
      .then((d) => {
        if (!vivo) return;
        n = d.p.length / 3;
        nx = new Float32Array(n);
        ny = new Float32Array(n);
        x = new Float32Array(n);
        y = new Float32Array(n);
        ang = new Float32Array(n);
        rnd = new Float32Array(n);
        asm = new Float32Array(n);
        vel = new Float32Array(n);
        tipo = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          nx[i] = d.p[i * 3]! / d.w - 0.5;
          ny[i] = d.p[i * 3 + 1]! / d.w - 0.5 * (d.h / d.w);
          tipo[i] = d.p[i * 3 + 2]!;
          ang[i] = Math.random() * Math.PI * 2;
          rnd[i] = Math.random();
          x[i] = Math.random() * cw;
          y[i] = Math.random() * ch;
          vel[i] = 0.0025 + Math.random() * 0.006;
          asm[i] = reduzir ? 1 : 0;
          if (reduzir) {
            x[i] = cw / 2 + nx[i]! * Math.min(cw, ch) * 1.08;
            y[i] = ch / 2 + ny[i]! * Math.min(cw, ch) * 1.08;
          }
        }
        desenhar();
        if (visivel) tocar();
      })
      .catch(() => {});

    if (import.meta.env.DEV) {
      // só em desenvolvimento: avança a animação sem depender do relógio do navegador
      (window as unknown as Record<string, unknown>)["__ovelha"] = {
        ir: (seg: number) => {
          for (let k = 0; k < seg * 60; k++) {
            tempo += 1 / 60;
            dtq = 1 / 60;
            desenhar();
          }
        },
      };
    }

    const ro = new ResizeObserver(() => {
      medir();
      desenhar();
    });
    ro.observe(caixa);
    const io = new IntersectionObserver(([e]) => {
      visivel = !!e?.isIntersecting;
      if (visivel) tocar();
    });
    io.observe(caixa);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={caixaRef}
      role="img"
      aria-label="A ovelha da Écsilab, formada por partículas de luz"
      className={`relative aspect-square w-full ${className}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
