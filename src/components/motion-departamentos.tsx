import { useEffect, useRef, useState } from "react";

/**
 * Hero do Enterprise: uma rede neural de departamentos.
 *
 * Dez departamentos em círculo ao redor da empresa do cliente, cada um a uma distância diferente. No primeiro ciclo, a
 * ovelha da Écsilab liga cada departamento à empresa e depois percorre a rede ligando um departamento ao outro (vizinhos
 * e cruzamentos). Em seguida sai de cena, e a rede segue sozinha: sinais de luz disparam de um departamento a outro,
 * como numa rede neural. Nos ciclos seguintes, a ovelha volta, amplia um departamento diferente e sai de novo.
 * Loop de 18 s. Sem bordas nem botão visível: faz parte do fundo (a pausa existe só para quem navega por teclado).
 */

// Palco de projeto: 1000 x 980, escalado para o tamanho real.
const W = 1000;
const H = 980;
const CX = 500;
const CY = 440;
const N = 10; // departamentos; o índice N é a empresa (núcleo)
const CICLO = 18;
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
// nomes em até duas linhas
const LINHAS_NOME: string[][] = [
  ["Vendas"],
  ["Marketing"],
  ["Atendimento", "e CS"],
  ["Financeiro"],
  ["RH"],
  ["Conteúdo"],
  ["Jurídico"],
  ["Imobiliário"],
  ["Saúde &", "Estética"],
  ["E-commerce"],
];

// ---------- geometria ----------
// Cada departamento fica a uma distância diferente da empresa.
const RAIOS = [300, 380, 335, 400, 320, 372, 305, 392, 345, 360];
const angulo = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
const POS: Array<[number, number]> = RAIOS.map((r, i) => [
  CX + r * Math.cos(angulo(i)) * 0.8,
  CY + r * Math.sin(angulo(i)),
]);
const pos = (i: number): [number, number] => (i === N ? [CX, CY] : POS[i]!);
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

// ---------- conexões ----------
// 0..9: empresa ↔ departamento · 10..19: departamento ↔ vizinho · 20..29: departamento ↔ departamento a 3 casas (cruzamento)
type Aresta = { a: number; b: number; tipo: 0 | 1 | 2; o: number; fase: number };
const ARESTAS: Aresta[] = (() => {
  const r = semente(13);
  const l: Aresta[] = [];
  for (let i = 0; i < N; i++)
    l.push({ a: N, b: i, tipo: 0, o: (r() - 0.5) * 70, fase: r() * 6.28 });
  for (let i = 0; i < N; i++)
    l.push({ a: i, b: (i + 1) % N, tipo: 1, o: (r() - 0.5) * 80, fase: r() * 6.28 });
  for (let c = 0; c < N; c++)
    l.push({ a: (3 * c) % N, b: (3 * c + 3) % N, tipo: 2, o: (r() - 0.5) * 110, fase: r() * 6.28 });
  return l;
})();
const INCIDENTES: number[][] = Array.from({ length: N + 1 }, () => []);
ARESTAS.forEach((e, k) => {
  INCIDENTES[e.a]!.push(k);
  INCIDENTES[e.b]!.push(k);
});
let deriva = 0;

/** Ponto da aresta k, em s (0 = na ponta `a`, 1 = na ponta `b`): curva quadrática que balança de leve. */
const pontoDaAresta = (k: number, s: number): [number, number] => {
  const e = ARESTAS[k]!;
  const [x0, y0] = pos(e.a);
  const [x1, y1] = pos(e.b);
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const off = e.o + Math.sin(deriva * 0.6 + e.fase) * 12;
  const cx = mx - (dy / len) * off;
  const cy = my + (dx / len) * off;
  const u = 1 - s;
  return [u * u * x0 + 2 * u * s * cx + s * s * x1, u * u * y0 + 2 * u * s * cy + s * s * y1];
};

// ---------- roteiro ----------
const T_ESPOCA = (i: number) => 0.6 + 0.38 * i; // quando o fio da empresa ao departamento i começa a crescer
const T_FIM_A = T_ESPOCA(N - 1) + 0.45; // todos ligados à empresa
const T_ANEL = T_FIM_A + 0.55; // a ovelha chega ao departamento 0 e começa a ligar um ao outro
const PASSO = 0.28;
const T_CRUZA = T_ANEL + PASSO * N;
const T_FIM_B = T_CRUZA + PASSO * N;
const T_VOLTA = T_FIM_B + 0.5; // a ovelha volta à empresa
const T_SAI = T_VOLTA + 0.5;
const departamentoAmpliado = (ciclo: number) => (ciclo * 3 + 2) % N;

/** Progresso (0..1) de cada aresta no ciclo 0. Depois do ciclo 0, todas estão prontas. */
function progressoDaAresta(k: number, ciclo: number, tl: number): number {
  if (ciclo > 0) return 1;
  if (k < N) return suave(T_ESPOCA(k), T_ESPOCA(k) + 0.45, tl);
  if (k < 2 * N) return clamp01((tl - (T_ANEL + PASSO * (k - N))) / PASSO);
  return clamp01((tl - (T_CRUZA + PASSO * (k - 2 * N))) / PASSO);
}

type Ponto2 = [number, number];
/** Posição e transparência da ovelha em (ciclo, instante do ciclo). Nula quando ela não está em cena. */
function ovelhaEm(ciclo: number, tl: number): { p: Ponto2; a: number; ampliando: number } | null {
  if (ciclo === 0) {
    if (tl < 0.2 || tl > T_SAI + 0.4) return null;
    const entra = suave(0.2, 0.6, tl);
    const sai = 1 - suave(T_SAI - 0.1, T_SAI + 0.4, tl);
    let p: Ponto2 = [CX, CY];
    if (tl >= T_FIM_A && tl < T_ANEL) {
      const [x, y] = pos(0);
      const k = vaiEVolta((tl - T_FIM_A) / (T_ANEL - T_FIM_A));
      p = [lerp(CX, x, k), lerp(CY, y, k)];
    } else if (tl >= T_ANEL && tl < T_CRUZA) {
      const e = Math.min(N - 1, Math.floor((tl - T_ANEL) / PASSO));
      p = pontoDaAresta(N + e, clamp01((tl - T_ANEL - e * PASSO) / PASSO));
    } else if (tl >= T_CRUZA && tl < T_FIM_B) {
      const e = Math.min(N - 1, Math.floor((tl - T_CRUZA) / PASSO));
      p = pontoDaAresta(2 * N + e, clamp01((tl - T_CRUZA - e * PASSO) / PASSO));
    } else if (tl >= T_FIM_B) {
      const [x, y] = pos(0);
      const k = vaiEVolta((tl - T_FIM_B) / (T_VOLTA - T_FIM_B));
      p = [lerp(x, CX, clamp01(k)), lerp(y, CY, clamp01(k))];
    }
    return { p, a: entra * sai, ampliando: 0 };
  }
  const k = departamentoAmpliado(ciclo);
  if (tl < 0.4 || tl > 5.0) return null;
  const entra = suave(0.4, 0.7, tl);
  const sai = 1 - suave(4.6, 5.0, tl);
  let p: Ponto2;
  if (tl < 1.8) p = pontoDaAresta(k, vaiEVolta((tl - 0.6) / 1.2));
  else if (tl < 3.4) p = pontoDaAresta(k, 1);
  else p = pontoDaAresta(k, 1 - vaiEVolta((tl - 3.4) / 1.2));
  const ampliando = suave(1.8, 2.1, tl) * (1 - suave(3.1, 3.4, tl));
  return { p, a: entra * sai, ampliando };
}

type Legenda = { partes: Array<{ t: string; d?: boolean }>; ini: number; fim: number };
const legendasDoCiclo = (ciclo: number): Legenda[] =>
  ciclo === 0
    ? [
        { partes: [{ t: "A Écsilab " }, { t: "conecta.", d: true }], ini: 0.3, fim: T_SAI },
        { partes: [{ t: "E deixa " }, { t: "rodando.", d: true }], ini: T_SAI + 0.5, fim: 15 },
        { partes: [{ t: "Em nome da " }, { t: "sua empresa.", d: true }], ini: 15.4, fim: CICLO },
      ]
    : [
        { partes: [{ t: "A Écsilab " }, { t: "amplia.", d: true }], ini: 0.3, fim: 5.0 },
        { partes: [{ t: "E tudo segue " }, { t: "rodando.", d: true }], ini: 5.4, fim: 11.5 },
        { partes: [{ t: "Em nome da " }, { t: "sua empresa.", d: true }], ini: 12, fim: CICLO },
      ];

// ---------- simulação (sinais que disparam de um departamento a outro) ----------
type Sinal = { e: number; u: number; sentido: 1 | -1 };

function criarSim() {
  const rnd = semente(21);
  const s = {
    t: 0,
    ciclo: 0,
    tl: 0,
    sinais: [] as Sinal[],
    brilho: new Array<number>(N + 1).fill(0),
    acc: 0,
  };
  const rodando = () => (s.ciclo === 0 ? s.tl > T_SAI : true);

  const lancar = (e: number, de: number) => {
    const ar = ARESTAS[e]!;
    s.sinais.push({ e, u: 0, sentido: ar.a === de ? 1 : -1 });
  };

  const passo = (dt: number) => {
    s.t += dt;
    s.ciclo = Math.floor(s.t / CICLO);
    s.tl = s.t - s.ciclo * CICLO;
    if (rodando()) {
      s.acc += dt * 0.9;
      while (s.acc >= 1) {
        s.acc -= 1;
        if (s.sinais.length < 12) {
          const de = Math.floor(rnd() * (N + 1));
          const inc = INCIDENTES[de]!;
          lancar(inc[Math.floor(rnd() * inc.length)]!, de);
        }
      }
    }
    for (const sg of s.sinais) sg.u += dt / 0.75;
    const novos: Sinal[] = [];
    for (const sg of s.sinais) {
      if (sg.u < 1) continue;
      const ar = ARESTAS[sg.e]!;
      const chegou = sg.sentido === 1 ? ar.b : ar.a;
      s.brilho[chegou] = 1;
      // o sinal continua pela rede, como o disparo de um neurônio
      if (s.sinais.length + novos.length < 12 && rnd() < 0.55) {
        const inc = INCIDENTES[chegou]!.filter((x) => x !== sg.e);
        const e2 = inc[Math.floor(rnd() * inc.length)];
        if (e2 !== undefined) {
          const a2 = ARESTAS[e2]!;
          novos.push({ e: e2, u: 0, sentido: a2.a === chegou ? 1 : -1 });
        }
      }
    }
    s.sinais = s.sinais.filter((sg) => sg.u < 1).concat(novos);
    for (let i = 0; i <= N; i++) s.brilho[i] = Math.max(0, (s.brilho[i] ?? 0) - dt * 1.8);
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

    /** Estado dos neurônios e do núcleo no instante atual. */
    const estadoDaRede = (ciclo: number, tl: number) => {
      const aceso = new Array<number>(N).fill(1);
      let nucleo = 1;
      if (ciclo === 0) {
        for (let i = 0; i < N; i++)
          aceso[i] = tl < T_ESPOCA(i) + 0.45 ? 0 : cresce((tl - T_ESPOCA(i) - 0.45) / 0.45);
        nucleo = tl < T_VOLTA ? 0.25 : 0.25 + 0.75 * cresce((tl - T_VOLTA) / 0.7);
      }
      return { aceso, nucleo };
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
      const emOperacao = ciclo > 0 || tl > T_SAI;
      const ampliado = ov && ciclo > 0 ? departamentoAmpliado(ciclo) : -1;

      // ---- conexões ----
      ARESTAS.forEach((ar, k) => {
        const prog = progressoDaAresta(k, ciclo, tl);
        if (prog <= 0.001) return;
        const bril = Math.max(
          ar.a < N ? (s.brilho[ar.a] ?? 0) : 0,
          ar.b < N ? (s.brilho[ar.b] ?? 0) : 0,
          k === ampliado && ov ? ov.ampliando : 0,
        );
        ctx.beginPath();
        const passos = 40;
        const n = Math.max(2, Math.round(passos * Math.min(1, prog)));
        for (let q = 0; q <= n; q++) {
          const [x, y] = pontoDaAresta(k, (q / passos) * Math.min(1, prog));
          if (q === 0) ctx.moveTo(X(x), X(y));
          else ctx.lineTo(X(x), X(y));
        }
        const base = ar.tipo === 0 ? 0.26 : ar.tipo === 1 ? 0.17 : 0.12;
        ctx.strokeStyle =
          bril > 0.04 ? `rgba(${AMARELO},${base + 0.5 * bril})` : `rgba(255,255,255,${base})`;
        ctx.lineWidth = Math.max(0.8, X(bril > 0.04 ? 2.6 : 1.8));
        ctx.stroke();
        // a ponta do fio que está sendo construído pela ovelha
        if (ciclo === 0 && prog < 1) {
          const [x, y] = pontoDaAresta(k, prog);
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgb(${AMARELO})`;
          ctx.fillStyle = `rgb(${AMARELO})`;
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(1.8, X(6)), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // ---- sinais: luzes que correm pelas conexões ----
      if (emOperacao) {
        for (const sg of s.sinais) {
          const [x, y] = pontoDaAresta(sg.e, sg.sentido === 1 ? sg.u : 1 - sg.u);
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgb(${AMARELO})`;
          ctx.fillStyle = `rgb(${AMARELO})`;
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(1.8, X(6.5)), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        // uma luz branca lenta volta de cada departamento à empresa
        for (let i = 0; i < N; i++) {
          const u = (s.t * 0.22 + ARESTAS[i]!.fase / 6.28) % 1;
          const [x, y] = pontoDaAresta(i, 1 - u);
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(1.3, X(3.6)), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- a empresa (núcleo): ondas lentas saem dela ----
      {
        const k = rede.nucleo;
        if (emOperacao) {
          for (let q = 0; q < 3; q++) {
            const f = (s.t * 0.28 + q / 3) % 1;
            ctx.beginPath();
            ctx.arc(X(CX), X(CY), X(72 + f * 140), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${AMARELO},${0.28 * (1 - f)})`;
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
        ctx.arc(X(CX), X(CY), X(72), 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.lineWidth = Math.max(1.4, X(3.5));
        ctx.strokeStyle = `rgba(${AMARELO},${0.35 + 0.65 * k})`;
        ctx.stroke();
        if (!(ov && ciclo === 0 && ov.a > 0.2 && tl < T_FIM_A)) {
          const fs = Math.max(9, X(24));
          ctx.font = `800 ${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.6 * k})`;
          ctx.fillText("SUA", X(CX), X(CY) - fs * 0.6);
          ctx.fillText("EMPRESA", X(CX), X(CY) + fs * 0.6);
        }
      }

      // ---- departamentos (neurônios) e nomes ----
      const fsNome = Math.max(10.5, Math.min(15, cw * 0.026));
      for (let i = 0; i < N; i++) {
        const [nx, ny] = POS[i]!;
        const k = rede.aceso[i] ?? 0;
        const amp = i === ampliado && ov ? ov.ampliando : 0;
        const forte = Math.max(s.brilho[i] ?? 0, amp);
        const r = X(15) * (0.55 + 0.45 * k) + X(4) * forte + X(4) * amp;
        if (k > 0.02) {
          const g = ctx.createRadialGradient(X(nx), X(ny), 0, X(nx), X(ny), X(60 + 30 * amp));
          g.addColorStop(0, `rgba(${AMARELO},${0.32 * k + 0.4 * forte})`);
          g.addColorStop(1, `rgba(${AMARELO},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(X(nx - 100), X(ny - 100), X(200), X(200));
        }
        if (amp > 0.02) {
          for (let q = 0; q < 2; q++) {
            const ph = (s.t * 0.9 + q * 0.5) % 1;
            ctx.beginPath();
            ctx.arc(X(nx), X(ny), X(20 + 46 * ph), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${AMARELO},${0.7 * (1 - ph) * amp})`;
            ctx.lineWidth = Math.max(1, X(2.6));
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(X(nx), X(ny), r, 0, Math.PI * 2);
        ctx.fillStyle = k > 0.5 ? `rgba(${AMARELO},${0.9 + 0.1 * forte})` : "#000";
        ctx.fill();
        ctx.lineWidth = Math.max(1.2, X(2.4));
        ctx.strokeStyle = k > 0.5 ? `rgb(${AMARELO})` : "rgba(255,255,255,0.3)";
        ctx.stroke();

        // nome, em até duas linhas, do lado de fora do neurônio (para longe da empresa)
        const linhas = LINHAS_NOME[i] ?? [DEPARTAMENTOS[i] ?? ""];
        const dx = nx - CX;
        const dy = ny - CY;
        const d = Math.hypot(dx, dy) || 1;
        const ux = dx / d;
        const uy = dy / d;
        const lado: CanvasTextAlign = ux > 0.4 ? "left" : ux < -0.4 ? "right" : "center";
        const folga = r + Math.max(7, X(12));
        const bx = X(nx) + (lado === "left" ? folga : lado === "right" ? -folga : 0);
        const alt = fsNome * 1.15 * linhas.length;
        const by =
          lado === "center" ? X(ny) + (uy > 0 ? folga + alt / 2 : -folga - alt / 2) : X(ny);
        ctx.font = `700 ${fsNome}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
        ctx.textAlign = lado;
        ctx.textBaseline = "middle";
        ctx.fillStyle = k > 0.5 ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.4)";
        linhas.forEach((ln, q) =>
          ctx.fillText(ln, bx, by + (q - (linhas.length - 1) / 2) * fsNome * 1.15),
        );
      }

      // ---- ovelha ----
      if (ov && ov.a > 0.01 && ovelha.complete) {
        const [ox, oy] = ov.p;
        const tam = X(ciclo === 0 && tl < T_FIM_A ? 130 : 84);
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
          sinais: sim.s.sinais.length,
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
        aria-label="Animação em loop: a Écsilab conecta dez departamentos (vendas, marketing, atendimento e CS, financeiro, RH, conteúdo, jurídico, imobiliário, saúde e estética e e-commerce) à empresa do cliente e uns aos outros, como numa rede neural. Depois a Écsilab sai de cena e a rede segue funcionando sozinha, em nome da sua empresa."
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
          className="pointer-events-none absolute inset-x-0 bottom-[0.5%] px-3 text-center"
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

      {/* sem botão visível: a pausa aparece só para quem navega pelo teclado */}
      <button
        type="button"
        onClick={() => alternarRef.current()}
        aria-pressed={pausado}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-0 focus-visible:left-0 focus-visible:rounded-full focus-visible:bg-white/10 focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-paper"
      >
        {pausado ? "Reproduzir a animação" : "Pausar a animação"}
      </button>
    </div>
  );
}
