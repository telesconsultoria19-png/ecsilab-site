import { useEffect, useRef, useState } from "react";

/**
 * Hero do Enterprise: uma rede neural de departamentos.
 *
 * Dez departamentos (neurônios) em círculo ao redor da empresa do cliente, cada um a uma distância diferente. Entre
 * eles correm axônios finos e ramificados, com colaterais e botões sinápticos; entre o fim de um axônio e o corpo do
 * neurônio seguinte há uma fenda (a sinapse), que o sinal atravessa em uma rajada de pontinhos. No primeiro ciclo, a
 * ovelha da Écsilab liga cada departamento à empresa e depois um departamento ao outro. Em seguida sai de cena, e a
 * rede segue sozinha, com sinais disparando em cascata. Nos ciclos seguintes, a ovelha volta e amplia um departamento
 * diferente. Loop de 18 s. Sem bordas nem botão visível (a pausa existe só para quem navega por teclado).
 */

// Palco de projeto: 1000 x 980, escalado para o tamanho real.
const W = 1000;
const H = 920;
const CX = 500;
const CY = 440;
const N = 10; // departamentos; o índice N é a empresa (núcleo)
const CICLO = 18;
const RS = 15; // raio do corpo de um departamento
const RHUB = 72; // raio do corpo da empresa
const GAP = 15; // fenda sináptica

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

// ---------- cores (escuro = fundo preto; claro = fundo branco, o "negativo") ----------
type Paleta = {
  ouro: string; // "r,g,b" do destaque
  traco: string; // "r,g,b" das conexões em repouso
  alfaTraco: [number, number, number]; // empresa↔dep, vizinhos, cruzamentos
  fundo: string; // cor de fundo (para "furar" o corpo das células)
  texto: string; // "r,g,b" dos nomes
  somaApagada: string; // contorno do neurônio ainda não ligado
  glow: string; // "r,g,b" do brilho dos sinais
  pontoNeutro: string; // luz lenta que volta à empresa
};
const PALETAS: Record<"escuro" | "claro", Paleta> = {
  escuro: {
    ouro: "253,202,10",
    traco: "255,255,255",
    alfaTraco: [0.3, 0.2, 0.14],
    fundo: "#000",
    texto: "255,255,255",
    somaApagada: "rgba(255,255,255,0.3)",
    glow: "253,202,10",
    pontoNeutro: "rgba(255,255,255,0.8)",
  },
  claro: {
    ouro: "184,132,0",
    traco: "20,20,20",
    alfaTraco: [0.42, 0.3, 0.22],
    fundo: "#fff",
    texto: "10,10,10",
    somaApagada: "rgba(0,0,0,0.3)",
    glow: "240,170,0",
    pontoNeutro: "rgba(0,0,0,0.65)",
  },
};

// ---------- geometria ----------
// Cada departamento fica a uma distância diferente da empresa.
const RAIOS = [300, 380, 335, 400, 320, 372, 305, 392, 345, 360];
const angulo = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
const POS: Array<[number, number]> = RAIOS.map((r, i) => [
  CX + r * Math.cos(angulo(i)) * 0.8,
  CY + r * Math.sin(angulo(i)),
]);
// Os corpos flutuam devagar, como células em suspensão, para a rede não parecer rígida.
let deriva = 0;
const pos = (i: number): [number, number] => {
  if (i === N) return [CX + Math.sin(deriva * 0.21) * 3, CY + Math.cos(deriva * 0.17) * 3];
  const [x, y] = POS[i]!;
  return [
    x + Math.sin(deriva * 0.33 + i * 1.7) * 7 + Math.sin(deriva * 0.12 + i * 0.6) * 4,
    y + Math.cos(deriva * 0.29 + i * 2.3) * 7 + Math.cos(deriva * 0.11 + i * 1.1) * 4,
  ];
};
const raioDe = (i: number) => (i === N ? RHUB : RS);
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

// ---------- conexões (axônios) ----------
// 0..9: empresa ↔ departamento · 10..19: departamento ↔ vizinho · 20..29: departamento ↔ departamento a 3 casas
type Colateral = { s: number; lado: 1 | -1; ang: number; comp: number };
type Aresta = {
  a: number;
  b: number;
  tipo: 0 | 1 | 2;
  o: number;
  fase: number;
  colaterais: Colateral[];
};
const ARESTAS: Aresta[] = (() => {
  const r = semente(13);
  // as linhas de conexão não têm ramos laterais: os dendritos ficam só nos corpos (empresa e departamentos)
  const colaterais = (): Colateral[] =>
    Array.from({ length: 0 }, (_, q) => ({
      s: 0.22 + q * 0.34 + r() * 0.2,
      lado: r() < 0.5 ? 1 : -1,
      ang: 0.6 + r() * 0.6,
      comp: 22 + r() * 22,
    }));
  const l: Aresta[] = [];
  for (let i = 0; i < N; i++)
    l.push({
      a: N,
      b: i,
      tipo: 0,
      o: (r() - 0.5) * 120,
      fase: r() * 6.28,
      colaterais: colaterais(),
    });
  for (let i = 0; i < N; i++)
    l.push({
      a: i,
      b: (i + 1) % N,
      tipo: 1,
      o: (r() - 0.5) * 120,
      fase: r() * 6.28,
      colaterais: colaterais(),
    });
  for (let c = 0; c < N; c++)
    l.push({
      a: (3 * c) % N,
      b: (3 * c + 3) % N,
      tipo: 2,
      o: (r() - 0.5) * 150,
      fase: r() * 6.28,
      colaterais: colaterais(),
    });
  return l;
})();
const INCIDENTES: number[][] = Array.from({ length: N + 1 }, () => []);
ARESTAS.forEach((e, k) => {
  INCIDENTES[e.a]!.push(k);
  INCIDENTES[e.b]!.push(k);
});

// dendritos: ramos curtos que saem do corpo de cada neurônio
type Dendrito = { ang: number; comp: number; curva: number; bif: number; bifComp: number };
const DENDRITOS: Dendrito[][] = (() => {
  const r = semente(77);
  return Array.from({ length: N + 1 }, (_, i) => {
    const total = i === N ? 5 : 3;
    return Array.from({ length: total }, (_, q) => ({
      ang: (q / total) * Math.PI * 2 + (r() - 0.5) * 0.5,
      comp: (i === N ? 30 : 18) + r() * (i === N ? 28 : 18),
      curva: (r() - 0.5) * 0.9,
      bif: 0.45 + r() * 0.5,
      bifComp: (i === N ? 14 : 9) + r() * 9,
    }));
  });
})();

type Geo = {
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
  p3: [number, number];
};
const GEO: Geo[] = ARESTAS.map(() => ({ p0: [0, 0], p1: [0, 0], p2: [0, 0], p3: [0, 0] }));
let geoTempo = -1;
/** Recalcula a forma de todos os axônios (uma vez por quadro): curvas cúbicas que balançam de leve. */
const atualizarGeo = () => {
  if (geoTempo === deriva) return;
  geoTempo = deriva;
  ARESTAS.forEach((e, k) => {
    const [x0, y0] = pos(e.a);
    const [x1, y1] = pos(e.b);
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    const dx = (x1 - x0) / L;
    const dy = (y1 - y0) / L;
    const ra = raioDe(e.a) + GAP;
    const rb = raioDe(e.b) + GAP;
    const p0: [number, number] = [x0 + dx * ra, y0 + dy * ra];
    const p3: [number, number] = [x1 - dx * rb, y1 - dy * rb];
    const d = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]);
    const px = -dy;
    const py = dx;
    const o1 =
      e.o + Math.sin(deriva * 0.45 + e.fase) * 16 + Math.sin(deriva * 0.8 + e.fase * 2) * 5;
    const o2 =
      -e.o * 0.8 + Math.cos(deriva * 0.4 + e.fase) * 16 + Math.cos(deriva * 0.7 + e.fase * 3) * 5;
    const g = GEO[k]!;
    g.p0 = p0;
    g.p3 = p3;
    g.p1 = [p0[0] + dx * d * 0.33 + px * o1, p0[1] + dy * d * 0.33 + py * o1];
    g.p2 = [p3[0] - dx * d * 0.33 + px * o2, p3[1] - dy * d * 0.33 + py * o2];
  });
};
const cubica = (g: Geo, s: number): [number, number] => {
  const u = 1 - s;
  return [
    u * u * u * g.p0[0] + 3 * u * u * s * g.p1[0] + 3 * u * s * s * g.p2[0] + s * s * s * g.p3[0],
    u * u * u * g.p0[1] + 3 * u * u * s * g.p1[1] + 3 * u * s * s * g.p2[1] + s * s * s * g.p3[1],
  ];
};
/** Ponto da aresta k, em s (0 = junto ao corpo de `a`, 1 = junto ao corpo de `b`), com uma ondulação fina e viva. */
const pontoDaAresta = (k: number, s: number): [number, number] => {
  atualizarGeo();
  const g = GEO[k]!;
  const [x, y] = cubica(g, s);
  const [qx, qy] = cubica(g, Math.min(1, s + 0.01));
  const [rx, ry] = cubica(g, Math.max(0, s - 0.01));
  const tx = qx - rx;
  const ty = qy - ry;
  const tl = Math.hypot(tx, ty) || 1;
  const f = ARESTAS[k]!.fase;
  const onda =
    (Math.sin(s * 11 + deriva * 1.1 + f) * 3.4 + Math.sin(s * 23 - deriva * 0.8 + f * 2) * 1.5) *
    Math.sin(Math.PI * s);
  return [x - (ty / tl) * onda, y + (tx / tl) * onda];
};

// ---------- roteiro ----------
const T_ESPOCA = (i: number) => 0.6 + 0.38 * i; // quando o axônio da empresa ao departamento i começa a crescer
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

// ---------- simulação (sinais que disparam de um neurônio a outro) ----------
type Sinal = { e: number; u: number; sentido: 1 | -1; dur: number };
type Rajada = { e: number; sentido: 1 | -1; t: number };

function criarSim() {
  const rnd = semente(21);
  const s = {
    t: 0,
    ciclo: 0,
    tl: 0,
    sinais: [] as Sinal[],
    rajadas: [] as Rajada[],
    brilho: new Array<number>(N + 1).fill(0),
    acc: 0,
  };
  const rodando = () => (s.ciclo === 0 ? s.tl > T_SAI : true);

  const lancar = (e: number, de: number) => {
    const ar = ARESTAS[e]!;
    s.sinais.push({ e, u: 0, sentido: ar.a === de ? 1 : -1, dur: 0.7 + rnd() * 0.6 });
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
    for (const sg of s.sinais) sg.u += dt / sg.dur;
    const novos: Sinal[] = [];
    for (const sg of s.sinais) {
      if (sg.u < 1) continue;
      const ar = ARESTAS[sg.e]!;
      const chegou = sg.sentido === 1 ? ar.b : ar.a;
      s.rajadas.push({ e: sg.e, sentido: sg.sentido, t: s.t });
      s.brilho[chegou] = 1;
      // o sinal continua pela rede, como o disparo de um neurônio
      if (s.sinais.length + novos.length < 12 && rnd() < 0.55) {
        const inc = INCIDENTES[chegou]!.filter((x) => x !== sg.e);
        const e2 = inc[Math.floor(rnd() * inc.length)];
        if (e2 !== undefined) {
          const a2 = ARESTAS[e2]!;
          novos.push({ e: e2, u: 0, sentido: a2.a === chegou ? 1 : -1, dur: 0.7 + rnd() * 0.6 });
        }
      }
    }
    s.sinais = s.sinais.filter((sg) => sg.u < 1).concat(novos);
    s.rajadas = s.rajadas.filter((r) => s.t - r.t < 0.6);
    for (let i = 0; i <= N; i++) s.brilho[i] = Math.max(0, (s.brilho[i] ?? 0) - dt * 1.8);
  };
  return { s, passo };
}

export function MotionDepartamentos({
  ativo = true,
  tema = "escuro",
}: {
  ativo?: boolean;
  tema?: "escuro" | "claro";
}) {
  const palcoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const legendasRef = useRef<Array<HTMLParagraphElement | null>>([]);
  const [pausado, setPausado] = useState(false);
  const alternarRef = useRef<() => void>(() => {});
  const ativoRef = useRef(ativo);
  const atualizarRef = useRef<() => void>(() => {});
  const claro = tema === "claro";
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
    const P = PALETAS[tema];
    const OURO = P.ouro;

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

    /** Contorno de célula: um círculo levemente irregular, que respira. */
    const celula = (cx: number, cy: number, r: number, fase: number) => {
      ctx.beginPath();
      const passos = 28;
      for (let q = 0; q <= passos; q++) {
        const t = (q / passos) * Math.PI * 2;
        const rr =
          r *
          (1 +
            0.05 * Math.sin(3 * t + deriva * 1.2 + fase) +
            0.035 * Math.sin(5 * t - deriva * 0.9 + fase * 2));
        const x = cx + Math.cos(t) * rr;
        const y = cy + Math.sin(t) * rr;
        if (q === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    // selo da ovelha em preto, para o fundo branco: o ícone vira uma silhueta escura
    let selo: HTMLCanvasElement | null = null;
    const prepararSelo = () => {
      if (!claro || !ovelha.complete || !ovelha.naturalWidth) return;
      const c = document.createElement("canvas");
      c.width = ovelha.naturalWidth;
      c.height = ovelha.naturalHeight;
      const g = c.getContext("2d");
      if (!g) return;
      g.drawImage(ovelha, 0, 0);
      g.globalCompositeOperation = "source-in";
      g.fillStyle = "#0a0a0a";
      g.fillRect(0, 0, c.width, c.height);
      selo = c;
    };

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

    /** Dendritos (ramos curtos) de um neurônio. */
    const dendritos = (i: number, k: number, forte: number) => {
      if (k < 0.05) return;
      const [cx, cy] = pos(i);
      const r0 = raioDe(i);
      ctx.lineWidth = Math.max(0.8, X(1.5));
      ctx.strokeStyle = `rgba(${forte > 0.05 ? OURO : P.traco},${(forte > 0.05 ? 0.55 : claro ? 0.5 : 0.38) * k})`;
      for (const d of DENDRITOS[i]!) {
        const bal =
          Math.sin(deriva * 0.6 + d.ang * 3) * 0.2 + Math.sin(deriva * 1.3 + d.ang) * 0.06;
        const a = d.ang + bal;
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        const x0 = cx + ux * r0 * 0.9;
        const y0 = cy + uy * r0 * 0.9;
        const comp = d.comp * k;
        const x1 = x0 + Math.cos(a + d.curva) * comp;
        const y1 = y0 + Math.sin(a + d.curva) * comp;
        const mx = x0 + ux * comp * 0.55 + Math.cos(a + 1.57) * d.curva * comp * 0.3;
        const my = y0 + uy * comp * 0.55 + Math.sin(a + 1.57) * d.curva * comp * 0.3;
        ctx.beginPath();
        ctx.moveTo(X(x0), X(y0));
        ctx.quadraticCurveTo(X(mx), X(my), X(x1), X(y1));
        ctx.stroke();
        // bifurcação na ponta
        const bx = lerp(x0, x1, d.bif);
        const by = lerp(y0, y1, d.bif);
        for (const lado of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(X(bx), X(by));
          ctx.lineTo(
            X(bx + Math.cos(a + d.curva + lado * 0.7) * d.bifComp * k),
            X(by + Math.sin(a + d.curva + lado * 0.7) * d.bifComp * k),
          );
          ctx.stroke();
        }
      }
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

      // ---- dendritos (atrás de tudo) ----
      for (let i = 0; i <= N; i++) {
        const forte =
          i < N
            ? Math.max(s.brilho[i] ?? 0, i === ampliado && ov ? ov.ampliando : 0)
            : (s.brilho[N] ?? 0);
        dendritos(i, i < N ? (rede.aceso[i] ?? 0) : rede.nucleo, forte);
      }

      // ---- axônios: finos, afinando até a ponta, com colaterais e botão sináptico em cada extremidade ----
      ARESTAS.forEach((ar, k) => {
        const prog = progressoDaAresta(k, ciclo, tl);
        if (prog <= 0.001) return;
        const bril = Math.max(
          ar.a < N ? (s.brilho[ar.a] ?? 0) : 0,
          ar.b < N ? (s.brilho[ar.b] ?? 0) : 0,
          k === ampliado && ov ? ov.ampliando : 0,
        );
        const base = P.alfaTraco[ar.tipo];
        const lit = bril > 0.04;
        ctx.strokeStyle = lit ? `rgba(${OURO},${base + 0.5 * bril})` : `rgba(${P.traco},${base})`;
        // afina do corpo de origem até o de destino
        const passos = 36;
        const n = Math.max(2, Math.round(passos * Math.min(1, prog)));
        ctx.lineCap = "butt"; // segmentos sem pontas redondas, para o traço não escurecer nas emendas
        let [ax, ay] = pontoDaAresta(k, 0);
        for (let q = 1; q <= n; q++) {
          const f = (q / passos) * Math.min(1, prog);
          const [bx, by] = pontoDaAresta(k, f);
          ctx.lineWidth = Math.max(0.7, X(lerp(3, 1.1, f)) * (lit ? 1.25 : 1));
          ctx.beginPath();
          ctx.moveTo(X(ax), X(ay));
          ctx.lineTo(X(bx), X(by));
          ctx.stroke();
          ax = bx;
          ay = by;
        }
        ctx.lineCap = "round";
        // colaterais: pequenos ramos laterais terminando em botões
        ctx.lineWidth = Math.max(0.7, X(1.1));
        for (const c of ar.colaterais) {
          if (prog < c.s + 0.05) continue;
          const [px, py] = pontoDaAresta(k, c.s);
          const [qx, qy] = pontoDaAresta(k, Math.min(1, c.s + 0.03));
          const ang = Math.atan2(qy - py, qx - px) + c.lado * c.ang;
          const cres = suave(c.s + 0.05, c.s + 0.2, prog);
          const ex = px + Math.cos(ang) * c.comp * cres;
          const ey = py + Math.sin(ang) * c.comp * cres;
          const mx = px + Math.cos(ang + c.lado * 0.4) * c.comp * cres * 0.55;
          const my = py + Math.sin(ang + c.lado * 0.4) * c.comp * cres * 0.55;
          ctx.beginPath();
          ctx.moveTo(X(px), X(py));
          ctx.quadraticCurveTo(X(mx), X(my), X(ex), X(ey));
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(X(ex), X(ey), Math.max(1, X(2.8)), 0, Math.PI * 2);
          ctx.fillStyle = lit ? `rgba(${OURO},0.8)` : `rgba(${P.traco},${base + 0.1})`;
          ctx.fill();
        }
        // botões sinápticos nas duas pontas, com a fenda até o corpo do neurônio
        if (prog >= 0.98) {
          for (const s0 of [0, 1]) {
            const [bx, by] = pontoDaAresta(k, s0);
            ctx.beginPath();
            ctx.arc(X(bx), X(by), Math.max(1.4, X(5)), 0, Math.PI * 2);
            ctx.fillStyle = lit
              ? `rgba(${OURO},0.95)`
              : `rgba(${P.traco},${Math.min(1, base + 0.25)})`;
            ctx.fill();
          }
        }
        // a ponta do axônio que está sendo construído pela ovelha
        if (ciclo === 0 && prog < 1) {
          const [x, y] = pontoDaAresta(k, prog);
          ctx.shadowBlur = 14;
          ctx.shadowColor = `rgb(${P.glow})`;
          ctx.fillStyle = `rgb(${OURO})`;
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(1.8, X(6)), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // ---- sinais (potenciais de ação) e rajadas de neurotransmissores nas sinapses ----
      if (emOperacao) {
        for (const sg of s.sinais) {
          const ue = sg.u * sg.u * (3 - 2 * sg.u) * 0.55 + sg.u * 0.45; // acelera e freia, como um impulso
          const f = sg.sentido === 1 ? ue : 1 - ue;
          // rastro
          for (let q = 6; q >= 1; q--) {
            const ff = clamp01(f - sg.sentido * q * 0.035);
            const [tx, ty] = pontoDaAresta(sg.e, ff);
            ctx.fillStyle = `rgba(${P.glow},${0.07 * (7 - q)})`;
            ctx.beginPath();
            ctx.arc(X(tx), X(ty), Math.max(1.2, X(5 - q * 0.4)), 0, Math.PI * 2);
            ctx.fill();
          }
          const [x, y] = pontoDaAresta(sg.e, f);
          ctx.shadowBlur = 16;
          ctx.shadowColor = `rgb(${P.glow})`;
          ctx.fillStyle = `rgb(${P.glow})`;
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(1.8, X(6.5)), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        for (const rj of s.rajadas) {
          const ar = ARESTAS[rj.e]!;
          const f = clamp01((s.t - rj.t) / 0.5);
          const [bx, by] = pontoDaAresta(rj.e, rj.sentido === 1 ? 1 : 0);
          const destino = rj.sentido === 1 ? ar.b : ar.a;
          const [dx0, dy0] = pos(destino);
          const dist = Math.hypot(dx0 - bx, dy0 - by) || 1;
          const ux = (dx0 - bx) / dist;
          const uy = (dy0 - by) / dist;
          const alvo = GAP + raioDe(destino) * 0.2;
          for (let q = 0; q < 5; q++) {
            const dsp = (q - 2) * 3.2;
            const d = alvo * Math.min(1, f * 1.3);
            ctx.fillStyle = `rgba(${P.glow},${0.85 * (1 - f)})`;
            ctx.beginPath();
            ctx.arc(
              X(bx + ux * d - uy * dsp),
              X(by + uy * d + ux * dsp),
              Math.max(0.9, X(2.2)),
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
        // uma luz lenta volta de cada departamento à empresa
        for (let i = 0; i < N; i++) {
          const u = (s.t * 0.22 + ARESTAS[i]!.fase / 6.28) % 1;
          const [x, y] = pontoDaAresta(i, 1 - u);
          ctx.fillStyle = P.pontoNeutro;
          ctx.beginPath();
          ctx.arc(X(x), X(y), Math.max(1.3, X(3.4)), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- a empresa (corpo central): ondas lentas saem dela ----
      {
        const k = rede.nucleo;
        if (emOperacao) {
          for (let q = 0; q < 3; q++) {
            const f = (s.t * 0.28 + q / 3) % 1;
            ctx.beginPath();
            ctx.arc(X(CX), X(CY), X(RHUB + f * 140), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${OURO},${0.3 * (1 - f)})`;
            ctx.lineWidth = Math.max(1, X(2));
            ctx.stroke();
          }
        }
        const g = ctx.createRadialGradient(X(CX), X(CY), 0, X(CX), X(CY), X(150));
        g.addColorStop(
          0,
          `rgba(${P.glow},${(0.12 + 0.3 * (s.brilho[N] ?? 0)) * k * (claro ? 0.7 : 1)})`,
        );
        g.addColorStop(1, `rgba(${P.glow},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(X(CX - 150), X(CY - 150), X(300), X(300));
        celula(X(pos(N)[0]), X(pos(N)[1]), X(RHUB), 4.2);
        ctx.fillStyle = P.fundo;
        ctx.fill();
        ctx.lineWidth = Math.max(1.4, X(3.5));
        ctx.strokeStyle = `rgba(${OURO},${0.35 + 0.65 * k})`;
        ctx.stroke();
        // núcleo celular
        ctx.beginPath();
        ctx.arc(X(CX), X(CY), X(RHUB * 0.82), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${OURO},${0.16 * k})`;
        ctx.lineWidth = Math.max(1, X(1.5));
        ctx.stroke();
        if (!(ov && ciclo === 0 && ov.a > 0.2 && tl < T_FIM_A)) {
          const fs = Math.max(9, X(24));
          ctx.font = `800 ${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(${P.texto},${0.35 + 0.6 * k})`;
          ctx.fillText("SUA", X(CX), X(CY) - fs * 0.6);
          ctx.fillText("EMPRESA", X(CX), X(CY) + fs * 0.6);
        }
      }

      // ---- departamentos (corpos dos neurônios) e nomes ----
      const fsNome = Math.max(10.5, Math.min(15, cw * 0.026));
      for (let i = 0; i < N; i++) {
        const [nx, ny] = pos(i);
        const k = rede.aceso[i] ?? 0;
        const amp = i === ampliado && ov ? ov.ampliando : 0;
        const forte = Math.max(s.brilho[i] ?? 0, amp);
        const r = X(RS) * (0.55 + 0.45 * k) + X(4) * forte + X(4) * amp;
        if (k > 0.02) {
          const g = ctx.createRadialGradient(X(nx), X(ny), 0, X(nx), X(ny), X(60 + 30 * amp));
          g.addColorStop(0, `rgba(${P.glow},${(0.3 * k + 0.4 * forte) * (claro ? 0.7 : 1)})`);
          g.addColorStop(1, `rgba(${P.glow},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(X(nx - 100), X(ny - 100), X(200), X(200));
        }
        if (amp > 0.02) {
          for (let q = 0; q < 2; q++) {
            const ph = (s.t * 0.9 + q * 0.5) % 1;
            ctx.beginPath();
            ctx.arc(X(nx), X(ny), X(20 + 46 * ph), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${OURO},${0.7 * (1 - ph) * amp})`;
            ctx.lineWidth = Math.max(1, X(2.6));
            ctx.stroke();
          }
        }
        celula(X(nx), X(ny), r, i * 1.3);
        ctx.fillStyle = k > 0.5 ? `rgb(${claro ? "253,202,10" : OURO})` : P.fundo;
        ctx.fill();
        ctx.lineWidth = Math.max(1.2, X(2.4));
        ctx.strokeStyle =
          k > 0.5 ? (claro ? "rgba(20,20,20,0.85)" : `rgb(${OURO})`) : P.somaApagada;
        ctx.stroke();
        // núcleo do neurônio
        if (k > 0.5) {
          ctx.beginPath();
          ctx.arc(X(nx), X(ny), r * 0.38, 0, Math.PI * 2);
          ctx.fillStyle = claro ? "rgba(20,20,20,0.45)" : "rgba(0,0,0,0.35)";
          ctx.fill();
        }

        // nome, em até duas linhas, do lado de fora do neurônio (para longe da empresa)
        const linhas = LINHAS_NOME[i] ?? [DEPARTAMENTOS[i] ?? ""];
        const dx = nx - CX;
        const dy = ny - CY;
        const d = Math.hypot(dx, dy) || 1;
        const ux = dx / d;
        const uy = dy / d;
        const lado: CanvasTextAlign = ux > 0.4 ? "left" : ux < -0.4 ? "right" : "center";
        const folga = r + Math.max(7, X(12)) + X(18) * k; // espaço para os dendritos
        const bx = X(nx) + (lado === "left" ? folga : lado === "right" ? -folga : 0);
        const alt = fsNome * 1.15 * linhas.length;
        const by =
          lado === "center" ? X(ny) + (uy > 0 ? folga + alt / 2 : -folga - alt / 2) : X(ny);
        ctx.font = `700 ${fsNome}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
        ctx.textAlign = lado;
        ctx.textBaseline = "middle";
        ctx.fillStyle = k > 0.5 ? `rgba(${P.texto},0.96)` : `rgba(${P.texto},0.4)`;
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
        ctx.shadowColor = claro ? "rgba(0,0,0,0.35)" : `rgba(${P.glow},0.9)`;
        ctx.drawImage(
          claro && selo ? selo : ovelha,
          X(ox) - tam / 2,
          X(oy) - tam / 2 + boba,
          tam,
          tam,
        );
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
              sp.className = `font-serif text-[1.12em] font-normal normal-case italic ${claro ? "text-[#8a6300]" : "text-accent"}`;
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
    ovelha.onload = () => {
      prepararSelo();
      desenhar();
    };
    prepararSelo();
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
  }, [tema, claro]);

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div
        ref={palcoRef}
        role="img"
        aria-label="Animação em loop: a Écsilab conecta dez departamentos (vendas, marketing, atendimento e CS, financeiro, RH, conteúdo, jurídico, imobiliário, saúde e estética e e-commerce) à empresa do cliente e uns aos outros, como neurônios ligados por sinapses numa rede neural. Depois a Écsilab sai de cena e a rede segue funcionando sozinha, em nome da sua empresa."
        style={{ aspectRatio: `${W} / ${H}` }}
        className={`relative w-full transition-opacity duration-1000 ${ativo ? "opacity-100" : "opacity-0"}`}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none mt-5 px-3 text-center sm:mt-2">
        <div className="relative mx-auto h-[2.6em] max-w-md text-[clamp(16px,2.2vw,26px)] leading-tight">
          {[0, 1, 2].map((q) => (
            <p
              key={q}
              ref={(el) => {
                legendasRef.current[q] = el;
              }}
              style={{ opacity: 0 }}
              className={`absolute inset-x-0 font-extrabold uppercase tracking-tight ${
                claro ? "text-black" : "text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.95)]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* sem botão visível: a pausa aparece só para quem navega pelo teclado */}
      <button
        type="button"
        onClick={() => alternarRef.current()}
        aria-pressed={pausado}
        className={`sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-0 focus-visible:left-0 focus-visible:rounded-full focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold ${
          claro
            ? "focus-visible:bg-black/10 focus-visible:text-black"
            : "focus-visible:bg-white/10 focus-visible:text-paper"
        }`}
      >
        {pausado ? "Reproduzir a animação" : "Pausar a animação"}
      </button>
    </div>
  );
}
