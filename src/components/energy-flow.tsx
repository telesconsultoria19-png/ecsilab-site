import { useEffect, useRef } from "react";

const LINES = 26;
const COLOR = "253, 202, 10";

/**
 * Fundo animado: fitas de energia amarelas fluindo na horizontal.
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
      ctx.lineWidth = 1.2;

      for (let i = 0; i < LINES; i++) {
        const k = i / (LINES - 1);
        const baseY = height * (0.3 + 0.5 * k);
        const amp = height * (0.05 + 0.08 * Math.sin(k * Math.PI));
        const alpha = 0.12 + 0.5 * Math.sin(k * Math.PI);
        ctx.strokeStyle = `rgba(${COLOR}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        for (let x = 0; x <= width + 8; x += 8) {
          const p = x / width;
          const y =
            baseY +
            Math.sin(p * 5 + t * 0.6 + k * 2.4) * amp +
            Math.sin(p * 9 - t * 0.9 + k * 4) * amp * 0.45 +
            Math.sin(p * 2 + t * 0.3) * amp * 0.7;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
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
