import { useEffect, useRef, type MutableRefObject } from "react";

const AMARELO = "253,202,10";

type Cores = { la: string; cabeca: string; perna: string; brilho: boolean };

const CINZA: Cores = {
  la: "rgba(170,170,176,0.30)",
  cabeca: "rgba(120,120,126,0.55)",
  perna: "rgba(120,120,126,0.5)",
  brilho: false,
};
const OURO: Cores = {
  la: `rgba(${AMARELO},0.95)`,
  cabeca: "#8a6f00",
  perna: "#8a6f00",
  brilho: true,
};

/** Uma ovelha de perfil, de lã em círculos, andando para a direita (dir = 1) ou para a esquerda (dir = -1). */
function ovelha(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  dir: 1 | -1,
  fase: number,
  c: Cores,
) {
  ctx.save();
  ctx.translate(x, y - Math.abs(Math.sin(fase)) * 1.6 * s);
  ctx.scale(dir * s, s);
  ctx.lineCap = "round";
  ctx.strokeStyle = c.perna;
  ctx.lineWidth = 4;
  [-16, -6, 8, 18].forEach((lx, k) => {
    const balanco = Math.sin(fase + (k % 2) * Math.PI) * 5;
    ctx.beginPath();
    ctx.moveTo(lx, -12);
    ctx.lineTo(lx + balanco, 0);
    ctx.stroke();
  });
  if (c.brilho) {
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgb(${AMARELO})`;
  }
  ctx.fillStyle = c.la;
  for (const [cx, cy, r] of [
    [-16, -26, 13],
    [-4, -32, 14],
    [10, -30, 13],
    [-8, -20, 13],
    [6, -20, 13],
    [18, -24, 10],
  ] as const) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = c.cabeca;
  ctx.beginPath();
  ctx.ellipse(29, -24, 8, 6.5, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(24, -30, 4, 2.2, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Faixa do rebanho: ovelhas cinzas seguem a moda, em fila, para a direita. Uma ovelha amarela, a da Écsilab, vai
 * no sentido contrário. Quando `paradoRef.current` é verdadeiro, o rebanho para (o instante em que a moda racha).
 */
export function MotionRebanho({
  paradoRef,
  pausadoRef,
}: {
  paradoRef: MutableRefObject<boolean>;
  pausadoRef: MutableRefObject<boolean>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visivel = false;
    let anterior = 0;
    let t = 0;
    let vel = 1; // 0 = parado, 1 = andando
    // posição (em "espaços"), tamanho e velocidade de cada ovelha: um rebanho, não uma parada militar
    const rebanho = [
      { p: 0, e: 0.85, v: 1.0 },
      { p: 0.9, e: 0.78, v: 1.08 },
      { p: 2.2, e: 0.9, v: 0.95 },
      { p: 3.1, e: 0.8, v: 1.04 },
      { p: 4.5, e: 0.88, v: 1.0 },
      { p: 5.2, e: 0.76, v: 1.1 },
      { p: 6.6, e: 0.9, v: 0.97 },
      { p: 7.3, e: 0.82, v: 1.03 },
    ];

    const medir = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const desenhar = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const esc = w < 640 ? 0.7 : 1;
      const chao = h - 14;
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.1)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, chao, w, 1);

      // o rebanho que segue a moda (para a direita)
      const espaco = 130 * esc;
      const volta = w + 2 * espaco;
      rebanho.forEach((o, i) => {
        const x = ((t * 16 * o.v * esc + o.p * espaco) % volta) - espaco;
        ovelha(ctx, x, chao - 2 - (i % 3) * 2, o.e * esc, 1, t * 5.5 * o.v + i * 1.3, CINZA);
      });
      // a ovelha da Écsilab (para a esquerda), mais perto e maior
      const xo = w - ((t * 11 * esc + w * 0.2) % (w + 160 * esc)) + 80 * esc;
      ovelha(ctx, xo, chao + 4, 1.15 * esc, -1, t * 4.2, OURO);
    };

    const quadro = (agora: number) => {
      raf = 0;
      if (!visivel) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      if (!pausadoRef.current) {
        const alvo = paradoRef.current ? 0 : 1;
        vel += (alvo - vel) * Math.min(1, dt * 3);
        t += dt * vel;
      }
      desenhar();
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      if (reduzir || raf) return;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };

    medir();
    t = reduzir ? 40 : 0;
    desenhar();
    const ro = new ResizeObserver(() => {
      medir();
      desenhar();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visivel = !!e?.isIntersecting;
      if (visivel) tocar();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [paradoRef, pausadoRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none block h-full w-full"
    />
  );
}
