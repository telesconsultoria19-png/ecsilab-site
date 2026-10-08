import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Hero do Enterprise: a rede de departamentos.
 *
 * Dez departamentos em volta de um núcleo (a sua empresa). Num primeiro ciclo, a ovelha da Écsilab percorre a rede
 * acendendo cada departamento e, ao fim, entra no núcleo e sai de cena: a rede segue rodando sozinha, com bolinhas
 * trocando informações entre os departamentos. Nos ciclos seguintes, ela volta, amplia um departamento diferente
 * a cada vez e sai de novo. O movimento nunca para (loop de 16 s), mas pode ser pausado.
 *
 * Ciclo 0:  0,5 s a ovelha começa a ligar a rede · 7,2 s entra no núcleo e some · 7,5 s a rede roda sozinha
 * Ciclos 1+: 0,6 s a ovelha vai até um departamento · 1,8–3,4 s o amplia · 4,9 s some · rede rodando
 */

// Palco de projeto: 1000 x 1000, escalado para o tamanho real.
const W = 1000;
const CX = 500;
const CY = 455;
const R = 268;
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

// ---------- geometria ----------
const angulo = (i: number) => (i * 2 * Math.PI) / N;
const noPos = (i: number): [number, number] => [CX + R * Math.sin(angulo(i)), CY - R * Math.cos(angulo(i))];
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Do núcleo (s = 0) ao departamento i (s = 1). */
const raio = (i: number, s: number): [number, number] => {
  const [x, y] = noPos(i);
  return [lerp(CX, x, s), lerp(CY, y, s)];
};
/** Do departamento i (s = 0) ao seguinte (s = 1), em curva puxada para o centro. */
const anel = (i: number, s: number): [number, number] => {
  const [x0, y0] = noPos(i);
  const [x1, y1] = noPos((i + 1) % N);
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const cx = mx + (CX - mx) * 0.32;
  const cy = my + (CY - my) * 0.32;
  const u = 1 - s;
  return [u * u * x0 + 2 * u * s * cx + s * s * x1, u * u * y0 + 2 * u * s * cy + s * s * y1];
};

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
const vaiEVolta = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const saiRapido = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const cresce = (t: number) => {
  // entra com um leve excesso, como uma mola
  const x = clamp01(t);
  const c1 = 1.70158;
  return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// ---------- roteiro ----------
const T_CHEGADA = (i: number) => 0.5 + 0.6 * (i + 1); // ciclo 0: quando a ovelha chega ao departamento i (0,5 + 0,6 · (i+1))
const T_NUCLEO = 7.2; // ciclo 0: ovelha entra no núcleo
const departamentoAmpliado = (ciclo: number) => (ciclo * 3 + 2) % N;

type Ponto2 = [number, number];
/** Posição e transparência da ovelha em (ciclo, instante do ciclo). Nula quando ela não está em cena. */
function ovelhaEm(ciclo: number, tl: number): { p: Ponto2; a: number; e: number; ampliando: number } | null {
  if (ciclo === 0) {
    if (tl < 0.3 || tl > 7.5) return null;
    const entra = suave(0.3, 0.6, tl);
    const sai = 1 - suave(7.2, 7.5, tl);
    let p: Ponto2 = [CX, CY];
    if (tl < 1.1) p = raio(0, vaiEVolta((tl - 0.5) / 0.6));
    else if (tl < T_CHEGADA(9)) {
      const i = Math.min(8, Math.floor((tl - T_CHEGADA(0)) / 0.6));
      p = anel(i, vaiEVolta((tl - T_CHEGADA(i)) / 0.6));
    } else if (tl <= T_NUCLEO) {
      const [x, y] = noPos(9);
      const k = vaiEVolta((tl - T_CHEGADA(9)) / (T_NUCLEO - T_CHEGADA(9)));
      p = [lerp(x, CX, k), lerp(y, CY, k)];
    }
    return { p, a: entra * sai, e: 1, ampliando: 0 };
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
  return { p, a: entra * sai, e: 1, ampliando };
}

type Legenda = { partes: Array<{ t: string; d?: boolean }>; ini: number; fim: number };
const legendasDoCiclo = (ciclo: number): Legenda[] =>
  ciclo === 0
    ? [
        { partes: [{ t: "A Écsilab " }, { t: "tece.", d: true }], ini: 0.3, fim: 7.3 },
        { partes: [{ t: "E deixa " }, { t: "rodando.", d: true }], ini: 7.7, fim: 12.5 },
        { partes: [{ t: "Em nome da " }, { t: "sua empresa.", d: true }], ini: 12.9, fim: 16 },
      ]
    : [
        { partes: [{ t: "A Écsilab " }, { t: "amplia.", d: true }], ini: 0.3, fim: 5.0 },
        { partes: [{ t: "E tudo segue " }, { t: "rodando.", d: true }], ini: 5.4, fim: 11 },
        { partes: [{ t: "Em nome da " }, { t: "sua empresa.", d: true }], ini: 11.4, fim: 16 },
      ];

// ---------- simulação (o que se move sozinho: bolinhas e brilhos) ----------
type Trecho = { f: (s: number) => Ponto2; dur: number };
type Bolinha = { caminho: Trecho[]; trecho: number; s: number; destino: number; rastro: Ponto2[] };

function criarSim() {
  const rnd = semente(21);
  const s = {
    t: 0,
    ciclo: 0,
    tl: 0,
    bolinhas: [] as Bolinha[],
    brilho: new Array<number>(N + 1).fill(0), // N = núcleo
    acc: 0,
  };

  const rodando = () => (s.ciclo === 0 ? s.tl > 7.6 : s.tl > 5.2);

  const novoEvento = () => {
    const a = Math.floor(rnd() * N);
    let b = Math.floor(rnd() * N);
    if (b === a) b = (a + 1) % N;
    let caminho: Trecho[];
    if (rnd() < 0.5) {
      // vizinho de anel
      if (rnd() < 0.5) {
        b = (a + 1) % N;
        caminho = [{ f: (u) => anel(a, u), dur: 0.95 }];
      } else {
        b = (a + N - 1) % N;
        caminho = [{ f: (u) => anel(b, 1 - u), dur: 0.95 }];
      }
    } else {
      caminho = [
        { f: (u) => raio(a, 1 - u), dur: 0.8 },
        { f: (u) => raio(b, u), dur: 0.8 },
      ];
    }
    s.bolinhas.push({ caminho, trecho: 0, s: 0, destino: b, rastro: [] });
  };

  const passo = (dt: number) => {
    s.t += dt;
    s.ciclo = Math.floor(s.t / CICLO);
    s.tl = s.t - s.ciclo * CICLO;

    if (rodando()) {
      s.acc += dt * 1.7;
      while (s.acc >= 1) {
        s.acc -= 1;
        if (s.bolinhas.length < 9) novoEvento();
      }
    }
    for (const b of s.bolinhas) {
      const tr = b.caminho[b.trecho];
      if (!tr) continue;
      b.s += dt / tr.dur;
      b.rastro.push(tr.f(Math.min(1, b.s)));
      if (b.rastro.length > 7) b.rastro.shift();
      if (b.s >= 1) {
        // chegou ao fim do trecho; se passa pelo núcleo, ele brilha
        if (b.trecho < b.caminho.length - 1) s.brilho[N] = 1;
        b.trecho += 1;
        b.s = 0;
      }
    }
    // chegadas
    for (const b of s.bolinhas) if (b.trecho >= b.caminho.length) s.brilho[b.destino] = 1;
    s.bolinhas = s.bolinhas.filter((b) => b.trecho < b.caminho.length);
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
    let dpr = 1;
    let sc = 1;
    let raf = 0;
    let rodando = false;
    let anterior = 0;
    let visivel = false;
    let pausadoUsuario = reduzir;
    let rotulos: Array<{ nome: string; x0: number; x1: number; y0: number; y1: number }> = [];

    const dimensionar = () => {
      cw = palco.clientWidth;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(cw * dpr);
      sc = cw / W;
    };

    const X = (v: number) => v * sc;

    /** Estado de cada departamento no instante atual: aceso (0..1) e progresso dos fios. */
    const estadoDaRede = (ciclo: number, tl: number) => {
      const aceso = new Array<number>(N).fill(1);
      const raioProg = new Array<number>(N).fill(1);
      const anelProg = new Array<number>(N).fill(1);
      let nucleo = 1;
      if (ciclo === 0) {
        for (let i = 0; i < N; i++) {
          const t0 = T_CHEGADA(i);
          aceso[i] = cresce((tl - t0) / 0.45);
          if (tl < t0) aceso[i] = 0;
          raioProg[i] = clamp01((tl - t0) / 0.5);
          anelProg[i] = i === 0 ? clamp01((tl - T_CHEGADA(9) - 0.1) / 0.5) : clamp01((tl - T_CHEGADA(i)) / 0.6);
        }
        nucleo = tl < T_NUCLEO ? 0 : cresce((tl - T_NUCLEO) / 0.6);
      }
      return { aceso, raioProg, anelProg, nucleo };
    };

    const texto = (t: string, x: number, y: number, fonte: number, cor: string, alinhar: CanvasTextAlign, peso = 600) => {
      ctx.font = `${peso} ${fonte}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = cor;
      ctx.textAlign = alinhar;
      ctx.textBaseline = "middle";
      ctx.fillText(t, x, y);
    };

    const desenhar = () => {
      const { s } = sim;
      const { ciclo, tl } = s;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, cw);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const rede = estadoDaRede(ciclo, tl);
      const ov = ovelhaEm(ciclo, tl);
      rotulos = [];

      // ---- fios ----
      // fio de lã: duas pontas trançadas em torno do caminho
      const fio = (pts: Ponto2[], prog: number, forte: number) => {
        if (prog <= 0) return;
        const n = Math.max(2, Math.round(prog * pts.length));
        ctx.lineWidth = Math.max(1.2, X(3));
        for (const [fase, alfa] of [
          [0, 0.5],
          [Math.PI, 0.36],
        ] as const) {
          ctx.beginPath();
          for (let k = 0; k < n; k++) {
            const p = pts[k];
            const a0 = pts[Math.max(0, k - 1)];
            const a1 = pts[Math.min(pts.length - 1, k + 1)];
            if (!p || !a0 || !a1) continue;
            const dx = a1[0] - a0[0];
            const dy = a1[1] - a0[1];
            const len = Math.hypot(dx, dy) || 1;
            const off = Math.sin(k * 0.75 + fase) * 4.5;
            const x = X(p[0] - (dy / len) * off);
            const y = X(p[1] + (dx / len) * off);
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(${AMARELO},${alfa + 0.3 * forte})`;
          ctx.stroke();
        }
      };
      /** Novelo de lã: bola amarela com voltas de fio por cima. */
      const novelo = (x: number, y: number, r: number, k: number) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${AMARELO},${0.95 * k})`;
        ctx.fill();
        if (k > 0.4) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.clip();
          ctx.strokeStyle = "rgba(0,0,0,0.42)";
          ctx.lineWidth = Math.max(1, r * 0.1);
          for (const rot of [0.5, -0.7, 1.6]) {
            ctx.beginPath();
            ctx.ellipse(x, y, r * 1.15, r * 0.5, rot, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
        ctx.lineWidth = Math.max(1.2, X(2.4));
        ctx.strokeStyle = k > 0.5 ? `rgba(${AMARELO},1)` : "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      };
      for (let i = 0; i < N; i++) {
        const pts: Ponto2[] = [];
        for (let k = 0; k <= 40; k++) pts.push(raio(i, k / 40));
        fio(pts, rede.raioProg[i] ?? 0, s.brilho[i] ?? 0);
        const pa: Ponto2[] = [];
        for (let k = 0; k <= 40; k++) pa.push(anel(i, k / 40));
        fio(pa, rede.anelProg[i] ?? 0, Math.max(s.brilho[i] ?? 0, s.brilho[(i + 1) % N] ?? 0));
      }

      // ---- bolinhas em movimento ----
      for (const b of s.bolinhas) {
        const tr = b.caminho[b.trecho];
        if (!tr) continue;
        b.rastro.forEach((p, k) => {
          const a = ((k + 1) / b.rastro.length) * 0.5;
          ctx.fillStyle = `rgba(${AMARELO},${a})`;
          ctx.beginPath();
          ctx.arc(X(p[0]), X(p[1]), Math.max(1.2, X(4.2)) * ((k + 1) / b.rastro.length), 0, Math.PI * 2);
          ctx.fill();
        });
        const p = tr.f(Math.min(1, b.s));
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgb(${AMARELO})`;
        ctx.fillStyle = `rgb(${AMARELO})`;
        ctx.beginPath();
        ctx.arc(X(p[0]), X(p[1]), Math.max(2, X(7)), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ---- núcleo (a sua empresa) ----
      {
        const k = rede.nucleo;
        const pulso = 0.5 + 0.5 * Math.sin(s.t * 2);
        const r = X(36) * (0.9 + 0.1 * k);
        if (k > 0.02) {
          const g = ctx.createRadialGradient(X(CX), X(CY), 0, X(CX), X(CY), X(120));
          g.addColorStop(0, `rgba(${AMARELO},${(0.2 + 0.1 * pulso + 0.35 * (s.brilho[N] ?? 0)) * k})`);
          g.addColorStop(1, `rgba(${AMARELO},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(X(CX - 120), X(CY - 120), X(240), X(240));
        }
        novelo(X(CX), X(CY), r, k);
        const fs = Math.max(10, X(23));
        texto("SUA EMPRESA", X(CX), X(CY) + r + fs * 1.1, fs, k > 0.5 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)", "center", 700);
      }

      // ---- departamentos e nomes ----
      const fs = Math.max(11.5, Math.min(18, X(26)));
      for (let i = 0; i < N; i++) {
        const [nx, ny] = noPos(i);
        const k = rede.aceso[i] ?? 0;
        const amp = ov && ciclo > 0 && departamentoAmpliado(ciclo) === i ? ov.ampliando : 0;
        const r = X(17) * (0.55 + 0.45 * k) + X(5) * (s.brilho[i] ?? 0) + X(4) * amp;
        if (k > 0.02 || amp > 0) {
          const g = ctx.createRadialGradient(X(nx), X(ny), 0, X(nx), X(ny), X(52 + 30 * amp));
          g.addColorStop(0, `rgba(${AMARELO},${(0.28 * k + 0.4 * (s.brilho[i] ?? 0) + 0.45 * amp)})`);
          g.addColorStop(1, `rgba(${AMARELO},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(X(nx - 90), X(ny - 90), X(180), X(180));
        }
        // anéis da ampliação
        if (amp > 0.02 && ov) {
          for (let q = 0; q < 2; q++) {
            const ph = ((s.t * 0.9 + q * 0.5) % 1);
            ctx.beginPath();
            ctx.arc(X(nx), X(ny), X(20 + 46 * ph), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${AMARELO},${0.7 * (1 - ph) * amp})`;
            ctx.lineWidth = Math.max(1, X(2.6));
            ctx.stroke();
          }
        }
        novelo(X(nx), X(ny), r, k);

        // nome do departamento, em até duas linhas, do lado de fora do anel
        const palavras = (DEPARTAMENTOS[i] ?? "").split(" ");
        const linhas = palavras.length > 1 && (DEPARTAMENTOS[i] ?? "").length > 9 ? [palavras[0] ?? "", palavras.slice(1).join(" ")] : [DEPARTAMENTOS[i] ?? ""];
        const sx = Math.sin(angulo(i));
        const cy = -Math.cos(angulo(i));
        const lado: CanvasTextAlign = sx > 0.35 ? "left" : sx < -0.35 ? "right" : "center";
        const off = r + Math.max(8, X(14));
        const bx = X(nx) + (lado === "left" ? off : lado === "right" ? -off : 0);
        const by = X(ny) + (Math.abs(sx) <= 0.35 ? (cy < 0 ? -off - fs * (linhas.length - 1) * 0.55 : off + fs * 0.4) : 0);
        const cor = k > 0.5 ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.42)";
        linhas.forEach((ln, q) => {
          const yy = by + (q - (linhas.length - 1) / 2) * fs * 1.12;
          texto(ln, bx, yy, fs, cor, lado, 700);
          const w = ctx.measureText(ln).width;
          const x0 = lado === "left" ? bx : lado === "right" ? bx - w : bx - w / 2;
          rotulos.push({ nome: ln, x0, x1: x0 + w, y0: yy - fs / 2, y1: yy + fs / 2 });
        });
      }

      // ---- ovelha ----
      if (ov && ov.a > 0.01 && ovelha.complete) {
        const [ox, oy] = ov.p;
        const tam = X(78);
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
        const [a, b] = l.partes;
        if (a && b && el.dataset["ciclo"] !== String(ciclo === 0 ? 0 : 1)) {
          el.dataset["ciclo"] = String(ciclo === 0 ? 0 : 1);
          el.innerHTML = "";
          for (const p of l.partes) {
            const sp = document.createElement("span");
            sp.textContent = p.t;
            if (p.d) sp.className = "font-serif text-[1.12em] font-normal normal-case italic text-accent";
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
    // primeira imagem: com "reduzir movimento", um quadro fixo da rede já pronta; sem isso, a abertura (ciclo 0)
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
          bolinhas: sim.s.bolinhas.length,
          rotulos: rotulos.map((r) => ({ ...r })),
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
        aria-label="Animação em loop: a Écsilab tece um fio de lã ligando dez departamentos (vendas, marketing, atendimento e CS, financeiro, RH, conteúdo, jurídico, imobiliário, saúde e estética e e-commerce) a um núcleo que é a sua empresa. Depois a Écsilab sai de cena e a rede segue funcionando sozinha, em nome da sua empresa."
        className={`relative aspect-square w-full transition-opacity duration-1000 ${ativo ? "opacity-100" : "opacity-0"}`}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[2%] px-3 text-center">
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
