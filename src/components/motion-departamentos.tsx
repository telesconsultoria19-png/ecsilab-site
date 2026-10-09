import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Hero do Enterprise: um hub de conexões.
 *
 * Dez departamentos, em duas colunas de cartões, ligados por fios finos a um núcleo central: a sua empresa. No primeiro
 * ciclo, a ovelha da Écsilab conecta um departamento de cada vez ao núcleo, depois sai de cena e a rede segue sozinha,
 * com pulsos de luz indo e vindo pelos fios. Nos ciclos seguintes, ela volta, amplia um departamento diferente a cada
 * vez e sai de novo. Loop de 16 s, que nunca para (mas pode ser pausado).
 */

// Palco de projeto: 1000 x 780, escalado para o tamanho real.
const W = 1000;
const H = 780;
const CX = 500;
const CY = 326;
const CARD_W = 304;
const CARD_H = 78;
const N = 10;
const CICLO = 16;
const AMARELO = "253,202,10";

const DEPARTAMENTOS = [
  "Vendas",
  "Marketing",
  "Atendimento e CS",
  "Financeiro",
  "RH",
  "Conteúdo",
  "Jurídico",
  "Imobiliário",
  "Saúde & Estética",
  "E-commerce",
];
// A ovelha liga um cartão da esquerda e um da direita, alternando, de cima para baixo.
const ORDEM = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9];

// ---------- geometria ----------
const lado = (i: number) => (i < 5 ? -1 : 1); // -1 = coluna da esquerda, 1 = coluna da direita
const linha = (i: number) => i % 5;
const cardCentro = (i: number): [number, number] => [
  lado(i) < 0 ? 20 + CARD_W / 2 : W - 20 - CARD_W / 2,
  70 + linha(i) * 128,
];
/** A "porta" do cartão: o ponto da borda de onde o fio sai, virado para o núcleo. */
const porta = (i: number): [number, number] => {
  const [x, y] = cardCentro(i);
  return [x - lado(i) * (CARD_W / 2), y]; // coluna da esquerda: borda direita; da direita: borda esquerda
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

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
const vaiEVolta = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const cresce = (t: number) => {
  const x = clamp01(t);
  const c1 = 1.70158;
  return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// Cada fio sai do núcleo, faz uma curva suave e chega à porta do cartão; os pontos de controle balançam devagar.
const FIO = (() => {
  const r = semente(9);
  return Array.from({ length: N }, () => ({
    o1: (r() - 0.5) * 120,
    o2: (r() - 0.5) * 120,
    fase: r() * Math.PI * 2,
  }));
})();
let deriva = 0;

/** Do núcleo (s = 0) ao cartão i (s = 1), em curva de Bézier cúbica. */
const raio = (i: number, s: number): [number, number] => {
  const [px, py] = porta(i);
  const f = FIO[i]!;
  const d = lado(i);
  const a1 = f.o1 + Math.sin(deriva * 0.7 + f.fase) * 14;
  const a2 = f.o2 + Math.cos(deriva * 0.6 + f.fase) * 14;
  const c1x = CX + d * 120;
  const c1y = CY + a1;
  const c2x = px - d * 130;
  const c2y = py + a2;
  const u = 1 - s;
  return [
    u * u * u * CX + 3 * u * u * s * c1x + 3 * u * s * s * c2x + s * s * s * px,
    u * u * u * CY + 3 * u * u * s * c1y + 3 * u * s * s * c2y + s * s * s * py,
  ];
};

// ---------- roteiro ----------
const T_INICIO = (k: number) => 0.7 + 0.55 * k; // quando o fio da posição k na ordem começa a crescer
const T_FIM_FIOS = T_INICIO(N - 1) + 0.5;
const T_SAI = T_FIM_FIOS + 0.5; // a ovelha deixa o núcleo
const departamentoAmpliado = (ciclo: number) => (ciclo * 3 + 2) % N;

type Ponto2 = [number, number];
/** Posição e transparência da ovelha em (ciclo, instante do ciclo). Nula quando ela não está em cena. */
function ovelhaEm(ciclo: number, tl: number): { p: Ponto2; a: number; ampliando: number } | null {
  if (ciclo === 0) {
    if (tl < 0.2 || tl > T_SAI + 0.4) return null;
    const entra = suave(0.2, 0.6, tl);
    const sai = 1 - suave(T_SAI - 0.2, T_SAI + 0.4, tl);
    return { p: [CX, CY - 4], a: entra * sai, ampliando: 0 };
  }
  const k = departamentoAmpliado(ciclo);
  if (tl < 0.4 || tl > 5.0) return null;
  const entra = suave(0.4, 0.7, tl);
  const sai = 1 - suave(4.6, 5.0, tl);
  let p: Ponto2;
  if (tl < 1.8) p = raio(k, vaiEVolta((tl - 0.6) / 1.2));
  else if (tl < 3.4) p = raio(k, 1);
  else p = raio(k, 1 - vaiEVolta((tl - 3.4) / 1.2));
  const ampliando = suave(1.8, 2.1, tl) * (1 - suave(3.1, 3.4, tl));
  return { p, a: entra * sai, ampliando };
}

type Legenda = { partes: Array<{ t: string; d?: boolean }>; ini: number; fim: number };
const legendasDoCiclo = (ciclo: number): Legenda[] =>
  ciclo === 0
    ? [
        { partes: [{ t: "A Écsilab " }, { t: "conecta.", d: true }], ini: 0.3, fim: T_SAI + 0.2 },
        { partes: [{ t: "E deixa " }, { t: "rodando.", d: true }], ini: T_SAI + 0.6, fim: 12.5 },
        { partes: [{ t: "Em nome da " }, { t: "sua empresa.", d: true }], ini: 12.9, fim: 16 },
      ]
    : [
        { partes: [{ t: "A Écsilab " }, { t: "amplia.", d: true }], ini: 0.3, fim: 5.0 },
        { partes: [{ t: "E tudo segue " }, { t: "rodando.", d: true }], ini: 5.4, fim: 11 },
        { partes: [{ t: "Em nome da " }, { t: "sua empresa.", d: true }], ini: 11.4, fim: 16 },
      ];

// ---------- simulação (o que se move sozinho: pacotes de luz e brilhos) ----------
type Pacote = { j: number; u: number; saida: boolean };

function criarSim() {
  const rnd = semente(21);
  const s = {
    t: 0,
    ciclo: 0,
    tl: 0,
    pacotes: [] as Pacote[],
    brilho: new Array<number>(N + 1).fill(0), // N = núcleo
    acc: 0,
  };
  const rodando = () => (s.ciclo === 0 ? s.tl > T_SAI + 0.4 : s.tl > 5.2 || s.tl < 0.4);

  const passo = (dt: number) => {
    s.t += dt;
    s.ciclo = Math.floor(s.t / CICLO);
    s.tl = s.t - s.ciclo * CICLO;
    if (rodando()) {
      s.acc += dt * 1.15;
      while (s.acc >= 1) {
        s.acc -= 1;
        if (s.pacotes.length < 6)
          s.pacotes.push({ j: Math.floor(rnd() * N), u: 0, saida: rnd() < 0.5 });
      }
    }
    for (const p of s.pacotes) p.u += dt / 1.0;
    for (const p of s.pacotes) if (p.u >= 1) s.brilho[p.saida ? p.j : N] = 1;
    s.pacotes = s.pacotes.filter((p) => p.u < 1);
    for (let i = 0; i <= N; i++) s.brilho[i] = Math.max(0, (s.brilho[i] ?? 0) - dt * 1.9);
  };
  return { s, passo };
}

export function MotionDepartamentos({ ativo = true }: { ativo?: boolean }) {
  const palcoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const legendasRef = useRef<Array<HTMLParagraphElement | null>>([]);
  const [pausado, setPausado] = useState(false);
  const alternarRef = useRef<() => void>(() => {});
  const ativoRef = useRef(ativo);
  const atualizarRef = useRef<() => void>(() => {});
  useEffect(() => {
    ativoRef.current = ativo;
    atualizarRef.current();
  }, [ativo]);

  useEffect(() => {
    const palco = palcoRef.current;
    const canvas = canvasRef.current;
    if (!palco || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sim = criarSim();
    const ovelha = new Image();
    ovelha.src = "/ovelha.png";

    let cw = 0;
    let ch = 0;
    let dpr = 1;
    let sc = 1;
    let raf = 0;
    let rodando = false;
    let anterior = 0;
    let visivel = false;
    let pausadoUsuario = reduzir;

    const dimensionar = () => {
      cw = palco.clientWidth;
      ch = (cw * H) / W;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      sc = cw / W;
    };
    const X = (v: number) => v * sc;

    const retangulo = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    /** Estado de cada fio e cartão no instante atual: aceso (0..1) e progresso do fio. */
    const estadoDaRede = (ciclo: number, tl: number) => {
      const fio = new Array<number>(N).fill(1);
      const aceso = new Array<number>(N).fill(1);
      let nucleo = 1;
      if (ciclo === 0) {
        ORDEM.forEach((i, k) => {
          const t0 = T_INICIO(k);
          fio[i] = suave(t0, t0 + 0.5, tl);
          aceso[i] = tl < t0 + 0.5 ? 0 : cresce((tl - t0 - 0.5) / 0.45);
        });
        nucleo = tl < T_SAI ? 0.25 : 0.25 + 0.75 * cresce((tl - T_SAI) / 0.6);
      }
      return { fio, aceso, nucleo };
    };

    const desenhar = () => {
      const { s } = sim;
      const { ciclo, tl } = s;
      deriva = s.t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const rede = estadoDaRede(ciclo, tl);
      const ov = ovelhaEm(ciclo, tl);
      const emOperacao = ciclo > 0 || tl > T_SAI + 0.4;

      // ---- fios (finos, como num diagrama de conexões) ----
      for (let i = 0; i < N; i++) {
        const prog = rede.fio[i] ?? 0;
        if (prog <= 0.001) continue;
        const forte = Math.max(
          s.brilho[i] ?? 0,
          ov && ciclo > 0 && departamentoAmpliado(ciclo) === i ? ov.ampliando : 0,
        );
        ctx.beginPath();
        const passos = 44;
        const n = Math.max(2, Math.round(passos));
        for (let k = 0; k <= n; k++) {
          const [x, y] = raio(i, (k / passos) * prog);
          if (k === 0) ctx.moveTo(X(x), X(y));
          else ctx.lineTo(X(x), X(y));
        }
        ctx.strokeStyle =
          forte > 0.02 ? `rgba(${AMARELO},${0.2 + 0.55 * forte})` : "rgba(255,255,255,0.24)";
        ctx.lineWidth = Math.max(1, X(forte > 0.02 ? 3 : 2));
        ctx.stroke();
        // pontos de interseção ao longo do fio
        if (prog >= 1) {
          for (const u of [0.34, 0.68]) {
            const [x, y] = raio(i, u);
            ctx.beginPath();
            ctx.arc(X(x), X(y), Math.max(1.4, X(4)), 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.28)";
            ctx.fill();
          }
        }
        // a ponta do fio que cresce, com um brilho
        if (prog < 1) {
          const [x, y] = raio(i, prog);
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgb(${AMARELO})`;
          ctx.fillStyle = `rgb(${AMARELO})`;
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(2, X(7)), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ---- pulsos: uma luz branca volta de cada cartão ao núcleo, sem parar; pacotes amarelos saem e entram ----
      if (emOperacao) {
        for (let i = 0; i < N; i++) {
          const u = (s.t * 0.3 + FIO[i]!.fase / (Math.PI * 2)) % 1;
          const [x, y] = raio(i, 1 - u);
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255,255,255,0.8)";
          ctx.fillStyle = "rgba(255,255,255,0.92)";
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(1.6, X(5)), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        for (const p of s.pacotes) {
          const [x, y] = raio(p.j, p.saida ? p.u : 1 - p.u);
          ctx.shadowBlur = 16;
          ctx.shadowColor = `rgb(${AMARELO})`;
          ctx.fillStyle = `rgb(${AMARELO})`;
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(2, X(8)), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ---- núcleo (a sua empresa): ondas lentas saem dele, como de um hub ----
      {
        const k = rede.nucleo;
        const pulso = s.t * 0.33;
        if (emOperacao) {
          for (let q = 0; q < 3; q++) {
            const f = (pulso + q / 3) % 1;
            ctx.beginPath();
            ctx.arc(X(CX), X(CY), X(76 + f * 110), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${AMARELO},${0.3 * (1 - f)})`;
            ctx.lineWidth = Math.max(1, X(2));
            ctx.stroke();
          }
        }
        const g = ctx.createRadialGradient(X(CX), X(CY), 0, X(CX), X(CY), X(150));
        g.addColorStop(0, `rgba(${AMARELO},${(0.12 + 0.3 * (s.brilho[N] ?? 0)) * k})`);
        g.addColorStop(1, `rgba(${AMARELO},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(X(CX - 150), X(CY - 150), X(300), X(300));
        ctx.beginPath();
        ctx.arc(X(CX), X(CY), X(76), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10,10,10,0.9)";
        ctx.fill();
        ctx.lineWidth = Math.max(1.4, X(3.5));
        ctx.strokeStyle = `rgba(${AMARELO},${0.35 + 0.65 * k})`;
        ctx.stroke();
        if (!(ov && ciclo === 0 && ov.a > 0.2)) {
          const fs = Math.max(10, X(25));
          ctx.font = `800 ${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.6 * k})`;
          ctx.fillText("SUA", X(CX), X(CY) - fs * 0.62);
          ctx.fillText("EMPRESA", X(CX), X(CY) + fs * 0.62);
        }
      }

      // ---- cartões dos departamentos ----
      for (let i = 0; i < N; i++) {
        const [cx, cy] = cardCentro(i);
        const k = rede.aceso[i] ?? 0;
        const amp = ov && ciclo > 0 && departamentoAmpliado(ciclo) === i ? ov.ampliando : 0;
        const forte = Math.max(s.brilho[i] ?? 0, amp);
        const esc = 1 + 0.1 * amp;
        const w = CARD_W * esc;
        const h = CARD_H * esc;
        ctx.save();
        if (forte > 0.02) {
          ctx.shadowBlur = 24 * forte;
          ctx.shadowColor = `rgba(${AMARELO},0.8)`;
        }
        retangulo(X(cx - w / 2), X(cy - h / 2), X(w), X(h), X(20));
        ctx.fillStyle = `rgba(255,255,255,${0.04 + 0.05 * k + 0.06 * forte})`;
        ctx.fill();
        ctx.restore();
        retangulo(X(cx - w / 2), X(cy - h / 2), X(w), X(h), X(20));
        ctx.lineWidth = Math.max(1, X(2.2));
        ctx.strokeStyle =
          k > 0.5 ? `rgba(${AMARELO},${0.5 + 0.5 * forte})` : "rgba(255,255,255,0.14)";
        ctx.stroke();
        // porta de conexão
        const [px, py] = porta(i);
        ctx.beginPath();
        ctx.arc(X(px), X(py), Math.max(2, X(7)), 0, Math.PI * 2);
        ctx.fillStyle = k > 0.5 ? `rgba(${AMARELO},1)` : "rgba(255,255,255,0.3)";
        ctx.fill();
        // nome
        const fs = Math.max(10, X(28 * (1 + 0.06 * amp)));
        ctx.font = `700 ${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = k > 0.5 ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.4)";
        ctx.fillText(DEPARTAMENTOS[i] ?? "", X(cx), X(cy));
      }

      // ---- ovelha ----
      if (ov && ov.a > 0.01 && ovelha.complete) {
        const [ox, oy] = ov.p;
        const tam = X(ciclo === 0 ? 120 : 84);
        const boba = Math.sin(s.t * 3.2) * X(3);
        ctx.globalAlpha = ov.a;
        ctx.shadowBlur = 26;
        ctx.shadowColor = `rgb(${AMARELO})`;
        ctx.drawImage(ovelha, X(ox) - tam / 2, X(oy) - tam / 2 + boba, tam, tam);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // ---- legendas (DOM) ----
      legendasRef.current.forEach((el, q) => {
        const l = legendasDoCiclo(ciclo)[q];
        if (!el || !l) return;
        const op = suave(l.ini, l.ini + 0.6, tl) * (1 - suave(l.fim - 0.6, l.fim, tl));
        el.style.opacity = String(op);
        el.style.transform = `translateY(${(1 - op) * 8}px)`;
        const chave = `${ciclo === 0 ? 0 : 1}-${q}`;
        if (el.dataset["chave"] !== chave) {
          el.dataset["chave"] = chave;
          el.innerHTML = "";
          for (const p of l.partes) {
            const sp = document.createElement("span");
            sp.textContent = p.t;
            if (p.d)
              sp.className = "font-serif text-[1.12em] font-normal normal-case italic text-accent";
            el.appendChild(sp);
          }
        }
      });
    };

    // ---------- relógio ----------
    const quadro = (agora: number) => {
      if (!rodando) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      sim.passo(dt);
      desenhar();
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      if (rodando) return;
      rodando = true;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };
    const pausar = () => {
      rodando = false;
      cancelAnimationFrame(raf);
    };
    const atualizar = () => {
      if (visivel && ativoRef.current && !pausadoUsuario) tocar();
      else pausar();
    };

    atualizarRef.current = atualizar;
    dimensionar();
    // com "reduzir movimento", um quadro fixo da rede já pronta; sem isso, a abertura (ciclo 0)
    if (reduzir) {
      sim.s.t = CICLO + 12;
      for (let k = 0; k < 60 * 6; k++) sim.passo(1 / 60);
      sim.s.t = CICLO + 14;
    }
    ovelha.onload = desenhar;
    desenhar();

    const ro = new ResizeObserver(() => {
      dimensionar();
      desenhar();
    });
    ro.observe(palco);
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = !!e?.isIntersecting;
        atualizar();
      },
      { threshold: 0.2 },
    );
    io.observe(palco);
    setPausado(reduzir);
    alternarRef.current = () => {
      pausadoUsuario = !pausadoUsuario;
      setPausado(pausadoUsuario);
      atualizar();
    };

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>)["__dep"] = {
        tocar,
        ir: (alvo: number) => {
          pausar();
          sim = criarSim();
          while (sim.s.t < alvo) sim.passo(1 / 60);
          desenhar();
        },
        estado: () => ({
          t: sim.s.t,
          ciclo: sim.s.ciclo,
          tl: sim.s.tl,
          pacotes: sim.s.pacotes.length,
          largura: cw,
        }),
      };
    }

    return () => {
      pausar();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div
        ref={palcoRef}
        role="img"
        aria-label="Animação em loop: a Écsilab conecta dez departamentos (vendas, marketing, atendimento e CS, financeiro, RH, conteúdo, jurídico, imobiliário, saúde e estética e e-commerce) a um núcleo que é a sua empresa. Depois a Écsilab sai de cena e a rede segue funcionando sozinha, em nome da sua empresa."
        style={{ aspectRatio: `${W} / ${H}` }}
        className={`relative w-full transition-opacity duration-1000 ${ativo ? "opacity-100" : "opacity-0"}`}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[1%] px-3 text-center"
        >
          <div className="relative mx-auto h-[2.6em] max-w-md text-[clamp(16px,2.2vw,26px)] leading-tight">
            {[0, 1, 2].map((q) => (
              <p
                key={q}
                ref={(el) => {
                  legendasRef.current[q] = el;
                }}
                style={{ opacity: 0 }}
                className="absolute inset-x-0 font-extrabold uppercase tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.95)]"
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => alternarRef.current()}
        aria-label={pausado ? "Reproduzir a animação" : "Pausar a animação"}
        className="absolute bottom-0 left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur transition hover:bg-white/20 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {pausado ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
