import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Motion "o pasto" (15 s). Roteiro:
 *  0,0  ponto amarelo pulsa e explode
 *  1,5  o rebanho flui para o mesmo lado ........ "ENQUANTO O MERCADO SEGUE O rebanho,"
 *  5,5  a ovelha negra (ponto amarelo) vai contra o fluxo, com rastro
 *  8,0  ela desenha o pasto (traços brotam) ...... "A GENTE INVENTA O pasto."
 * 11,0  "GROWTH. PROCESSOS. ESCALA."
 * 13,0  os pontos formam o logotipo + tagline
 * Sem biblioteca: canvas para os pontos, DOM para os textos, tudo guiado por um relógio único.
 */

// Todo o desenho usa um palco de 1920 x 1080 e é escalado para o tamanho real.
const W = 1920;
const H = 1080;
const N = 640;
const DURACAO = 15;
const AMARELO: [number, number, number] = [253, 202, 10];
const BRANCO: [number, number, number] = [255, 255, 255];

// Logotipo (alvo da cena final), em coordenadas do palco.
const LOGO = { x: 580, y: 316, w: 760, h: 228 };

type Palavra = { texto: string; entra: number; estilo?: "serif" | "amarelo" | "serifAmarelo" };
type Bloco = {
  id: string;
  sai: number;
  classe: string;
  tamanho: string;
  linhas: Palavra[][];
};

const BLOCOS: Bloco[] = [
  {
    id: "rebanho",
    sai: 5.6,
    classe: "inset-0 flex flex-col items-center justify-center",
    tamanho: "text-[6.4cqw]",
    linhas: [
      [
        { texto: "Enquanto", entra: 2.0 },
        { texto: "o", entra: 2.12 },
        { texto: "mercado", entra: 2.24 },
      ],
      [
        { texto: "segue", entra: 2.7 },
        { texto: "o", entra: 2.82 },
        { texto: "rebanho,", entra: 3.1, estilo: "serif" },
      ],
    ],
  },
  {
    id: "pasto",
    sai: 11.0,
    classe: "inset-x-0 top-[12%] flex flex-col items-center",
    tamanho: "text-[6.4cqw]",
    linhas: [
      [
        { texto: "A", entra: 8.3 },
        { texto: "gente", entra: 8.42 },
        { texto: "inventa", entra: 8.54 },
        { texto: "o", entra: 8.66 },
      ],
      [{ texto: "pasto.", entra: 9.1, estilo: "serifAmarelo" }],
    ],
  },
  {
    id: "pilares",
    sai: 13.0,
    classe: "inset-0 flex flex-col items-center justify-center",
    tamanho: "text-[7.2cqw]",
    linhas: [
      [{ texto: "Growth.", entra: 11.3 }],
      [{ texto: "Processos.", entra: 11.75 }],
      [{ texto: "Escala.", entra: 12.2, estilo: "amarelo" }],
    ],
  },
];

const TAGLINE: Palavra[] = [
  { texto: "Growth,", entra: 14.2 },
  { texto: "processos", entra: 14.3 },
  { texto: "e", entra: 14.4 },
  { texto: "escala", entra: 14.5 },
  { texto: "comercial.", entra: 14.6 },
];

// ---------- utilidades ----------
function semente(n: number) {
  let a = n >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const suave = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const saiRapido = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const vaiEVolta = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const chao = (x: number) => 868 + Math.sin(x * 0.006) * 30;

type Ponto = {
  x: number;
  y: number;
  vx: number;
  lane: number;
  fase: number;
  bx: number;
  by: number;
  r: number;
  tx: number;
  ty: number;
  cor: [number, number, number];
};
type Lamina = { x: number; y: number; h: number; t0: number; incl: number };

function criarPontos(): Ponto[] {
  const rnd = semente(7);
  const pts: Ponto[] = [];
  for (let i = 0; i < N; i++) {
    const ang = rnd() * Math.PI * 2;
    const vel = 450 + rnd() * 1000;
    pts.push({
      x: W / 2,
      y: H / 2,
      vx: 120 + rnd() * 170,
      lane: 70 + rnd() * (H - 140),
      fase: rnd() * Math.PI * 2,
      bx: Math.cos(ang) * vel,
      by: Math.sin(ang) * vel,
      r: 2 + rnd() * 3.4,
      tx: W / 2,
      ty: H / 2,
      cor: BRANCO,
    });
  }
  const s = pts[0];
  if (s) {
    s.r = 11;
    s.vx = 200;
    s.lane = 540;
    s.bx = 0;
    s.by = 0;
    s.cor = AMARELO;
  }
  return pts;
}

/** Sorteia, nos pixels do logotipo, o ponto-alvo (e a cor) de cada partícula. */
function amostrarLogo(img: HTMLImageElement, pts: Ponto[]) {
  const c = document.createElement("canvas");
  c.width = LOGO.w;
  c.height = LOGO.h;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return;
  g.drawImage(img, 0, 0, LOGO.w, LOGO.h);
  const dados = g.getImageData(0, 0, LOGO.w, LOGO.h).data;
  const cand: Array<[number, number, [number, number, number]]> = [];
  for (let y = 0; y < LOGO.h; y += 4) {
    for (let x = 0; x < LOGO.w; x += 4) {
      const i = (y * LOGO.w + x) * 4;
      if ((dados[i + 3] ?? 0) > 150) cand.push([LOGO.x + x, LOGO.y + y, [dados[i] ?? 255, dados[i + 1] ?? 255, dados[i + 2] ?? 255]]);
    }
  }
  if (cand.length === 0) return;
  const rnd = semente(11);
  for (let i = cand.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const a = cand[i];
    const b = cand[j];
    if (a && b) {
      cand[i] = b;
      cand[j] = a;
    }
  }
  pts.forEach((p, i) => {
    const c2 = cand[i % cand.length];
    if (!c2) return;
    p.tx = c2[0] + (rnd() - 0.5) * 2;
    p.ty = c2[1] + (rnd() - 0.5) * 2;
    p.cor = i === 0 ? AMARELO : c2[2];
  });
}

export function MotionPasto() {
  const palcoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const palavras = useRef<Array<{ el: HTMLSpanElement; entra: number; sai: number }>>([]);
  const tagRef = useRef<Array<{ el: HTMLSpanElement; entra: number }>>([]);
  const dominioRef = useRef<HTMLParagraphElement>(null);
  const [fim, setFim] = useState(false);
  const controle = useRef<{ reiniciar: () => void } | null>(null);

  useEffect(() => {
    const palco = palcoRef.current;
    const canvas = canvasRef.current;
    const logoEl = logoRef.current;
    if (!palco || !canvas || !logoEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pts = criarPontos();
    let laminas: Lamina[] = [];
    let ultimoXLamina = -999;
    let foto: { x: number; y: number } | null = null;
    let t = 0;
    let rodando = false;
    let terminou = false;
    let raf = 0;
    let anterior = 0;
    let escala = 1;
    let imgLogo: HTMLImageElement | null = null;

    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(palco.clientWidth * dpr);
      canvas.height = Math.round(palco.clientHeight * dpr);
      escala = canvas.width / W;
    };

    const carregarLogo = () => {
      const im = new Image();
      im.onload = () => {
        imgLogo = im;
        amostrarLogo(im, pts);
      };
      im.src = "/logo-ecsilab.png";
    };

    // ---------- simulação ----------
    const passo = (dt: number) => {
      const s = pts[0];
      const cheg = suave(12.9, 14.0, t);
      const explodiu = t >= 1.1;
      const mistura = suave(1.3, 2.3, t);

      pts.forEach((p, i) => {
        const especial = i === 0;

        if (especial && t >= 5.4 && t < 11.2) {
          // trajetória própria da ovelha negra
          if (!foto) foto = { x: p.x, y: p.y };
          if (t < 6.0) {
            // antecipação: quase para
          } else if (t < 7.6) {
            const k = vaiEVolta((t - 6.0) / 1.6);
            p.x = foto.x + (260 - foto.x) * k;
            p.y = foto.y + (540 - foto.y) * k;
          } else if (t < 8.3) {
            const k = vaiEVolta((t - 7.6) / 0.7);
            p.x = 260;
            p.y = 540 + (chao(260) - 540) * k;
          } else {
            const k = clamp01((t - 8.3) / 2.9);
            p.x = 260 + (1960 - 260) * (k * 0.85 + vaiEVolta(k) * 0.15);
            p.y = chao(p.x);
            if (p.x - ultimoXLamina >= 13) {
              ultimoXLamina = p.x;
              laminas.push({ x: p.x, y: p.y, h: 22 + Math.random() * 54, t0: t, incl: (Math.random() - 0.5) * 0.7 });
            }
          }
          return;
        }

        if (t < 1.1) return; // tudo parado no centro até a explosão

        // explosão (decai) + fluxo do rebanho (cresce)
        const decai = Math.exp(-2.4 * (t - 1.1));
        let vx = p.vx;
        if (t > 9.2 && !especial) vx *= 1 - 0.55 * suave(9.2, 11, t);
        const yAlvo = (especial && t >= 11.2 ? chao(p.x) : p.lane) + Math.sin(p.x * 0.004 + p.fase + t * 0.8) * 20;

        if (cheg < 1) {
          const fluxo = (1 - cheg) * mistura;
          p.x += (p.bx * decai + vx * fluxo) * dt;
          p.y += p.by * decai * dt;
          p.y += (yAlvo - p.y) * Math.min(1, dt * 3) * mistura * (1 - cheg);
          if (cheg === 0 && p.x > W + 24) p.x = -24;
        }
        if (cheg > 0) {
          const g = 1 - Math.exp(-dt * (2 + 7 * cheg));
          p.x += (p.tx - p.x) * g;
          p.y += (p.ty - p.y) * g;
        }

        // desvio da ovelha negra
        if (s && !especial && t > 5.8 && t < 11.5 && cheg === 0) {
          const dx = p.x - s.x;
          const dy = p.y - s.y;
          const d = Math.hypot(dx, dy);
          if (d < 130 && d > 0.001) {
            const f = ((130 - d) / 130) * 260 * dt;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }
      });

      // lâminas do pasto murcham quando os pontos formam o logotipo
      if (t > 13.2) laminas = laminas.filter((l) => t - l.t0 < 6);
    };

    // ---------- desenho ----------
    const desenhar = () => {
      ctx.setTransform(escala, 0, 0, escala, 0, 0);
      const cheg = suave(12.9, 14.0, t);
      const somePontos = 1 - suave(14.15, 14.8, t);

      // rastro (eco): apaga só um pouco a cada quadro
      ctx.fillStyle = `rgba(0,0,0,${t < 1.3 ? 0.4 : 0.22})`;
      ctx.fillRect(0, 0, W, H);

      // pasto
      if (t >= 8.3 && t < 14.2) {
        const murcha = 1 - suave(13.2, 13.9, t);
        ctx.lineCap = "round";
        ctx.lineWidth = 3.2;
        for (const l of laminas) {
          const cresce = saiRapido((t - l.t0) / 0.9) * murcha;
          const h = l.h * cresce;
          const balanco = Math.sin(t * 2.2 + l.x * 0.02) * 0.07;
          ctx.strokeStyle = `rgba(${AMARELO.join(",")},${0.35 + 0.55 * cresce})`;
          ctx.beginPath();
          ctx.moveTo(l.x, l.y);
          ctx.lineTo(l.x + (l.incl + balanco) * h, l.y - h);
          ctx.stroke();
        }
      }

      // pontos
      const base = 0.62 + 0.38 * cheg;
      pts.forEach((p, i) => {
        if (t < 1.1 && i !== 0) return;
        const especial = i === 0;
        let r = p.r;
        let a = especial ? 1 : base * somePontos;
        if (especial && t < 1.1) {
          // pulsa e se contrai antes de explodir (antecipação)
          const k = t / 1.1;
          r = 16 + Math.sin(k * Math.PI * 4) * 3 - 7 * suave(0.55, 1.05, t) + 12 * suave(1.0, 1.1, t);
        } else if (especial && t >= 5.4 && t < 6.0) {
          r = 11 + Math.sin(((t - 5.4) / 0.6) * Math.PI * 3) * 2.2;
        }
        if (especial) a *= somePontos > 0 ? 1 : 0;
        if (a <= 0.01) return;
        const cor = especial ? AMARELO : lerp3(BRANCO, AMARELO, suave(9.2, 10.8, t) * (1 - cheg));
        const corFinal = cheg > 0 && !especial ? lerp3(cor, p.cor, cheg) : cor;
        ctx.fillStyle = `rgba(${corFinal[0] | 0},${corFinal[1] | 0},${corFinal[2] | 0},${a})`;
        if (especial) {
          ctx.shadowBlur = 34;
          ctx.shadowColor = `rgb(${AMARELO.join(",")})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (especial) ctx.shadowBlur = 0;
      });

      atualizarTextos();
    };

    const atualizarTextos = () => {
      const px = escala / (window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 2) : 1);
      const aplicar = (el: HTMLElement, entra: number, sai: number) => {
        const pin = saiRapido((t - entra) / 0.55);
        const pout = clamp01((t - sai) / 0.45);
        const op = pin * (1 - pout);
        el.style.opacity = String(op);
        el.style.transform = `translateY(${((1 - pin) * 38 - pout * 22) * px}px)`;
        el.style.filter = `blur(${((1 - pin) * 12 + pout * 10) * px}px)`;
      };
      for (const w of palavras.current) aplicar(w.el, w.entra, w.sai);
      for (const w of tagRef.current) aplicar(w.el, w.entra, 99);
      const lo = clamp01((t - 14.0) / 0.6);
      logoEl.style.opacity = String(lo);
      if (dominioRef.current) dominioRef.current.style.opacity = String(saiRapido((t - 14.9) / 0.1));
    };

    // ---------- relógio ----------
    const quadro = (agora: number) => {
      if (!rodando) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      t += dt;
      passo(dt);
      desenhar();
      if (t >= DURACAO) {
        rodando = false;
        terminou = true;
        t = DURACAO;
        desenhar();
        setFim(true);
        return;
      }
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      if (rodando || terminou) return;
      rodando = true;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };
    const pausar = () => {
      rodando = false;
      cancelAnimationFrame(raf);
    };
    const zerar = () => {
      pausar();
      pts = criarPontos();
      if (imgLogo) amostrarLogo(imgLogo, pts);
      laminas = [];
      ultimoXLamina = -999;
      foto = null;
      t = 0;
      terminou = false;
      setFim(false);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    controle.current = {
      reiniciar: () => {
        zerar();
        tocar();
      },
    };

    // modo de teste (só em desenvolvimento): avança a animação até um instante e congela
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>)["__pasto"] = {
        tocar,
        ir: (alvo: number) => {
          zerar();
          while (t < alvo) {
            t = Math.min(alvo, t + 1 / 60);
            passo(1 / 60);
          }
          for (let k = 0; k < 6; k++) desenhar();
        },
      };
    }

    dimensionar();
    carregarLogo();
    const ro = new ResizeObserver(dimensionar);
    ro.observe(palco);

    let io: IntersectionObserver | null = null;
    if (reduzir) {
      // sem movimento: mostra o quadro final
      t = DURACAO;
      logoEl.style.opacity = "1";
      for (const w of tagRef.current) w.el.style.opacity = "1";
      if (dominioRef.current) dominioRef.current.style.opacity = "1";
      setFim(true);
    } else {
      zerar();
      io = new IntersectionObserver(
        ([e]) => {
          if (e?.isIntersecting) tocar();
          else if (rodando) pausar();
        },
        { threshold: 0.55 },
      );
      io.observe(palco);
    }

    return () => {
      pausar();
      io?.disconnect();
      ro.disconnect();
    };
  }, []);

  let n = 0;
  return (
    <div
      ref={palcoRef}
      role="img"
      aria-label="Animação de 15 segundos: enquanto o mercado segue o rebanho, a gente inventa o pasto. Écsilab: growth, processos e escala comercial."
      className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-[0_0_80px_-30px_rgba(253,202,10,0.45)] [container-type:inline-size]"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

      {BLOCOS.map((b) => (
        <div key={b.id} aria-hidden="true" className={`pointer-events-none absolute text-center ${b.classe}`}>
          {b.linhas.map((linha, li) => (
            <div key={li} className={`flex flex-wrap justify-center gap-x-[1.6cqw] leading-[1.04] ${b.tamanho}`}>
              {linha.map((w) => {
                const i = n++;
                const serif = w.estilo === "serif" || w.estilo === "serifAmarelo";
                const amarelo = w.estilo === "amarelo" || w.estilo === "serifAmarelo";
                return (
                  <span
                    key={`${b.id}-${i}`}
                    ref={(el) => {
                      if (el) palavras.current[i] = { el, entra: w.entra, sai: b.sai };
                    }}
                    style={{ opacity: 0 }}
                    className={`inline-block ${
                      serif ? "font-serif font-normal italic normal-case" : "font-black uppercase tracking-tight"
                    } ${serif && w.estilo === "serifAmarelo" ? "text-[1.25em]" : ""} ${amarelo ? "text-accent" : "text-paper"}`}
                  >
                    {w.texto}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      <img
        ref={logoRef}
        src="/logo-ecsilab.png"
        alt=""
        aria-hidden="true"
        style={{
          opacity: 0,
          left: `${(LOGO.x / W) * 100}%`,
          top: `${(LOGO.y / H) * 100}%`,
          width: `${(LOGO.w / W) * 100}%`,
        }}
        className="pointer-events-none absolute"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[60%] text-center">
        <p className="flex flex-wrap justify-center gap-x-[0.9cqw] text-[2.5cqw] font-bold uppercase tracking-[0.22em] text-paper/85">
          {TAGLINE.map((w, i) => (
            <span
              key={w.texto}
              ref={(el) => {
                if (el) tagRef.current[i] = { el, entra: w.entra };
              }}
              style={{ opacity: 0 }}
              className="inline-block"
            >
              {w.texto}
            </span>
          ))}
        </p>
        <p ref={dominioRef} style={{ opacity: 0 }} className="mt-[1.4cqw] text-[1.9cqw] font-semibold tracking-widest text-accent">
          ecsilab.com.br
        </p>
      </div>

      {fim && (
        <button
          type="button"
          onClick={() => controle.current?.reiniciar()}
          className="absolute bottom-[3cqw] right-[3cqw] flex items-center gap-2 rounded-full bg-white/10 px-[2cqw] py-[1cqw] text-[1.8cqw] font-semibold text-paper backdrop-blur transition hover:bg-white/20 hover:text-accent"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Ver de novo
        </button>
      )}
    </div>
  );
}

function lerp3(a: [number, number, number], b: [number, number, number], k: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}
