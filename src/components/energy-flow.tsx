import { useEffect, useRef } from "react";

const LINES = 14;
const COLOR = "253, 202, 10";

/**
 * Fundo animado: fitas de luz neon amarela ondulando como água.
 * Desenhado em canvas (sem arquivo externo). Pausa fora da tela e
 * respeita "reduzir movimento" (desenha um único quadro estático).
 */
export function EnergyFlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = reduce ? 4 : (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < LINES; i++) {
        const k = i / (LINES - 1);
        const baseY = height * (0.28 + 0.55 * k);
        const amp = height * (0.07 + 0.1 * Math.sin(k * Math.PI));
        const strength = 0.25 + 0.75 * Math.sin(k * Math.PI);

        const path = new Path2D();
        for (let x = 0; x <= width + 10; x += 10) {
          const p = x / width;
          const y =
            baseY +
            Math.sin(p * 3.2 + t * 0.32 + k * 2.2) * amp +
            Math.sin(p * 5.5 - t * 0.45 + k * 3.1) * amp * 0.4 +
            Math.sin(p * 1.4 + t * 0.18 + k) * amp * 0.6;
          if (x === 0) path.moveTo(x, y);
          else path.lineTo(x, y);
        }

        // Três passadas: halo largo, brilho médio e núcleo fino = efeito neon.
        ctx.strokeStyle = `rgba(${COLOR}, ${(0.05 * strength).toFixed(3)})`;
        ctx.lineWidth = 14;
        ctx.stroke(path);
        ctx.strokeStyle = `rgba(${COLOR}, ${(0.12 * strength).toFixed(3)})`;
        ctx.lineWidth = 5;
        ctx.stroke(path);
        ctx.strokeStyle = `rgba(255, 236, 150, ${(0.55 * strength).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke(path);
      }
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
