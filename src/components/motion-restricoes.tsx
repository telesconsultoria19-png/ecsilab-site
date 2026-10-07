import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Teoria das Restrições, em loop contínuo e sem bordas (cerca de 40 s por ciclo).
 *
 * Um tubo com 6 zonas de larguras diferentes. As bolinhas seguem umas às outras (cada uma precisa de espaço),
 * então a capacidade de cada zona nasce da largura dela e a fila se forma sozinha antes da zona mais estreita.
 * A saída do lado direito é limitada por essa zona: a restrição.
 *
 *   0 s   a zona 4 é a restrição (33 bolinhas/s); a fila cresce antes dela
 *   6 s   ampliamos as zonas 1 e 3: entra mais, a fila engorda, a saída não muda
 *  15 s   a Écsilab amplia a zona 4: a restrição passa para a zona 2 (110/s) e o velocímetro pisca
 *  25 s   a Écsilab vai até a zona 2 e a amplia: a restrição passa para a zona 5 (130/s) e pisca de novo
 *
 * O número mostrado é a velocidade que o sistema suporta (capacidade da restrição), sempre crescente em cada
 * conquista. A vazão medida na saída oscila quando o estoque da fila é solto, por isso não é a exibida.
 *  33 s   o sistema volta suavemente ao começo e o ciclo recomeça
 */

// ---------- geometria (unidades de projeto; o tubo tem 1920 de comprimento) ----------
// No computador o tubo é largo e comprido; no celular (vertical) ele é mais curto, para a história caber numa tela só.
const L_HORIZONTAL = 1920;
const L_VERTICAL = 1180;
let L = L_HORIZONTAL;
const NZ = 6;
let ZL = L / NZ;
const definirGeometria = (vertical: boolean) => {
  L = vertical ? L_VERTICAL : L_HORIZONTAL;
  ZL = L / NZ;
};
// Espaço reservado no palco vertical: legenda em cima e contador embaixo.
const TOPO_V = 92;
const BASE_V = 176;
const BASE = [220, 200, 240, 60, 236, 300];
const R = 7; // raio da bolinha
const DD = R * 2 * 1.55; // diâmetro com folga (bolinhas respiram, mesmo na fila cheia)
const V = 260; // velocidade livre (unidades por segundo)
const CICLO = 40;
const AMARELO = "253,202,10";

type Bola = { u: number; v: number; vel: number };

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

/** Larguras que queremos em cada instante do ciclo (a simulação caminha suavemente até elas). */
function alvos(t: number): number[] {
  const w = [...BASE];
  if (t >= 6 && t < 33.5) {
    w[0] = 300;
    w[2] = 320;
  }
  if (t >= 15 && t < 33.5) w[3] = 270;
  if (t >= 25 && t < 33.5) w[1] = 300;
  return w;
}

/** Largura do tubo na posição u, com transição suave entre zonas. */
function largura(u: number, w: number[]): number {
  const x = Math.min(L, Math.max(0, u));
  const b = Math.round(x / ZL);
  const meia = 55;
  if (b >= 1 && b <= NZ - 1 && Math.abs(x - b * ZL) < meia) {
    const k = suave(b * ZL - meia, b * ZL + meia, x);
    return (w[b - 1] ?? 0) * (1 - k) + (w[b] ?? 0) * k;
  }
  return w[Math.min(NZ - 1, Math.floor(x / ZL))] ?? 0;
}
/** Espaço que cada bolinha ocupa ao longo do tubo: quanto mais largo, mais bolinhas lado a lado. */
const espaco = (u: number, w: number[]) => DD / Math.max(1, largura(u, w) / DD);

function criarSim() {
  const rnd = semente(5);
  const s = {
    t: 0,
    w: [...BASE],
    bolas: [] as Bola[],
    acc: 0,
    saida: 0,
    saidas: [] as number[],
    relogio: 0,
  };

  const passo = (dt: number, avancar = true) => {
    // larguras caminham até o alvo
    const alvo = alvos(s.t);
    const taxa = s.t >= 33.5 ? 0.6 : 1.1;
    for (let i = 0; i < NZ; i++) s.w[i] = (s.w[i] ?? 0) + ((alvo[i] ?? 0) - (s.w[i] ?? 0)) * (1 - Math.exp(-dt * taxa));

    // entrada: o ritmo é a capacidade da zona 1. As novas bolinhas nascem alinhadas atrás da entrada,
    // então várias podem entrar no mesmo quadro sem se sobrepor.
    const c1 = (V * (s.w[0] ?? 0)) / (DD * DD);
    s.acc = Math.min(8, s.acc + 0.92 * c1 * dt);
    while (s.acc >= 1) {
      const ultima = s.bolas[s.bolas.length - 1];
      const uNovo = ultima ? Math.min(0, ultima.u - espaco(0, s.w)) : 0;
      if (uNovo < -V * 0.07) break; // fila de entrada cheia: sem espaço
      s.bolas.push({ u: uNovo, v: (rnd() * 2 - 1) * 0.92, vel: V });
      s.acc -= 1;
    }

    // movimento: cada bolinha segue a da frente
    let lider: Bola | null = null;
    for (const b of s.bolas) {
      const max = V * dt;
      const livre = lider ? lider.u - espaco(b.u, s.w) - b.u : max;
      const adv = Math.max(0, Math.min(max, livre));
      b.u += adv;
      b.vel = adv / dt;
      lider = b;
    }

    // saída
    while (s.bolas[0] && (s.bolas[0].u ?? 0) > L + 90) {
      s.bolas.shift();
      s.saida += 1;
      s.saidas.push(s.relogio);
    }
    if (avancar) {
      s.t += dt;
      s.relogio += dt;
      if (s.t >= CICLO) {
        s.t -= CICLO;
        s.saida = 0;
      }
    }
    while (s.saidas.length && (s.saidas[0] ?? 0) < s.relogio - 2) s.saidas.shift();
  };

  return {
    s,
    passo,
    /** Deixa a fila formada antes do primeiro quadro, para o fundo já nascer "vivo". */
    aquecer(seg: number) {
      for (let k = 0; k < seg * 60; k++) passo(1 / 60, false);
      s.saida = 0;
      s.saidas.length = 0;
    },
    /** Recomeça do zero (usado quando o aparelho troca de orientação e o tubo muda de comprimento). */
    reiniciar() {
      s.t = 0;
      s.w = [...BASE];
      s.bolas = [];
      s.acc = 0;
      s.saida = 0;
      s.saidas.length = 0;
      s.relogio = 0;
      for (let k = 0; k < 16 * 60; k++) passo(1 / 60, false);
      s.saida = 0;
      s.saidas.length = 0;
    },
    vazao: () => s.saidas.length / 2,
    /** Velocidade que o sistema suporta: a capacidade da zona mais estreita (a restrição). */
    capacidade: () => Math.min(...s.w.map((w) => (V * w) / (DD * DD))),
  };
}

// ---------- legendas ----------
type Parte = { t: string; destaque?: boolean };
const LEGENDAS: Array<{ ini: number; fim: number; partes: Parte[] }> = [
  { ini: 0, fim: 6, partes: [{ t: "Toda operação tem uma " }, { t: "restrição.", destaque: true }] },
  { ini: 6, fim: 14.5, partes: [{ t: "Ampliar o que está fora dela só acumula " }, { t: "estoque.", destaque: true }] },
  { ini: 14.5, fim: 24.5, partes: [{ t: "Ampliar a restrição libera o " }, { t: "fluxo.", destaque: true }] },
  { ini: 24.5, fim: 33, partes: [{ t: "Aparece a próxima restrição. E a gente " }, { t: "segue.", destaque: true }] },
  { ini: 33, fim: 40, partes: [{ t: "Uma restrição de cada " }, { t: "vez.", destaque: true }] },
];

export function MotionRestricoes() {
  const raizRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const saidaRef = useRef<HTMLSpanElement>(null);
  const vazaoRef = useRef<HTMLSpanElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const numeroRef = useRef<HTMLParagraphElement>(null);
  const novaRef = useRef<HTMLParagraphElement>(null);
  const [pausado, setPausado] = useState(false);
  const alternarRef = useRef<() => void>(() => {});
  const legendasRef = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    const raiz = raizRef.current;
    const canvas = canvasRef.current;
    if (!raiz || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sim = criarSim();
    const ovelha = new Image();
    ovelha.src = "/ovelha.png";

    let cw = 0;
    let ch = 0;
    let dpr = 1;
    let vertical = false;
    let geometriaVertical = false;
    let sc = 1;
    let raf = 0;
    let rodando = false;
    let anterior = 0;
    let visivel = false; // o palco está na tela?
    let pausadoUsuario = reduzir; // quem pediu para parar (ou prefere menos movimento)
    let vazaoMostrada = 0; // número suavizado, para não "tremer" na tela
    let zrAnterior = -1; // última restrição vista
    let patamar = 0; // velocidade da última conquista (a piscada só vale para um patamar maior)
    let piscadas = 0;

    /** Zona de restrição atual e a velocidade que o sistema suporta. */
    const restricao = () => {
      let z = 0;
      for (let i = 1; i < NZ; i++) if ((sim.s.w[i] ?? 0) < (sim.s.w[z] ?? 0)) z = i;
      return { z, cap: sim.capacidade() };
    };

    /** Nova velocidade conquistada: o velocímetro pisca e uma etiqueta avisa. */
    const piscar = () => {
      piscadas++;
      const n = numeroRef.current;
      const e = novaRef.current;
      n?.animate(
        [
          { opacity: 1, transform: "scale(1)", filter: "brightness(1)" },
          { opacity: 0.2, transform: "scale(1.08)", filter: "brightness(1.8)", offset: 0.16 },
          { opacity: 1, transform: "scale(1.16)", filter: "brightness(1.7)", offset: 0.32 },
          { opacity: 0.25, transform: "scale(1.08)", filter: "brightness(1.8)", offset: 0.48 },
          { opacity: 1, transform: "scale(1.16)", filter: "brightness(1.7)", offset: 0.64 },
          { opacity: 0.35, transform: "scale(1.06)", filter: "brightness(1.5)", offset: 0.8 },
          { opacity: 1, transform: "scale(1)", filter: "brightness(1)" },
        ],
        { duration: 1700, easing: "ease-in-out" },
      );
      e?.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)", offset: 0.12 },
          { opacity: 1, transform: "translateY(0)", offset: 0.82 },
          { opacity: 0, transform: "translateY(-4px)" },
        ],
        { duration: 2600, easing: "ease-out" },
      );
    };

    /** Altura da tela "pequena" do aparelho (com a barra do navegador visível), para o palco caber inteiro. */
    const alturaDaTela = () => {
      const m = document.createElement("div");
      m.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;width:0;height:100svh";
      document.body.appendChild(m);
      const h = m.getBoundingClientRect().height;
      m.remove();
      return h > 100 ? h : window.innerHeight;
    };

    const dimensionar = () => {
      cw = raiz.clientWidth;
      const vert = cw < 640;
      if (vert !== geometriaVertical) {
        geometriaVertical = vert;
        definirGeometria(vert);
        sim.reiniciar();
        zrAnterior = -1;
      }
      vertical = vert;
      if (vertical) {
        // uma tela mostra a ideia toda: legenda, tubo inteiro e contador, abaixo do cabeçalho fixo
        ch = Math.round(Math.min(720, Math.max(540, alturaDaTela() - 76)));
        sc = (ch - TOPO_V - BASE_V) / L;
      } else {
        ch = Math.round(Math.min(800, Math.max(400, cw * 0.5)));
        sc = cw / (L + 160);
      }
      raiz.style.height = `${ch}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    };

    // posição na tela de um ponto do tubo: u ao longo, v de lado
    const P = (u: number, v: number): [number, number] =>
      vertical ? [cw * 0.46 + v * sc, TOPO_V + u * sc] : [80 * sc + u * sc, ch * 0.54 + v * sc];

    const desenhar = () => {
      const { s } = sim;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // zona mais estreita = restrição atual
      let zr = 0;
      for (let i = 1; i < NZ; i++) if ((s.w[i] ?? 0) < (s.w[zr] ?? 0)) zr = i;

      // brilho do resultado acumulado, do lado direito
      const brilho = Math.min(0.32, s.saida / 700) * (1 - suave(36, 39.6, s.t));
      if (brilho > 0.01) {
        const [gx, gy] = P(L + 70, 0);
        const rad = 300 * sc;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
        g.addColorStop(0, `rgba(${AMARELO},${brilho})`);
        g.addColorStop(1, `rgba(${AMARELO},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(gx - rad, gy - rad, rad * 2, rad * 2);
      }

      // paredes do tubo
      const passoU = 10;
      const topo: Array<[number, number]> = [];
      const base: Array<[number, number]> = [];
      for (let u = 0; u <= L; u += passoU) {
        const w = largura(u, s.w);
        topo.push(P(u, -w / 2));
        base.push(P(u, w / 2));
      }
      ctx.beginPath();
      topo.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      for (let i = base.length - 1; i >= 0; i--) {
        const p = base[i];
        if (p) ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.022)";
      ctx.fill();

      const parede = (lista: Array<[number, number]>, ini: number, fim: number) => {
        ctx.beginPath();
        let primeiro = true;
        lista.forEach(([x, y], i) => {
          const u = i * passoU;
          if (u < ini || u > fim) return;
          if (primeiro) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          primeiro = false;
        });
        ctx.stroke();
      };
      ctx.lineWidth = Math.max(1.2, 2.2 * sc);
      ctx.strokeStyle = "rgba(255,255,255,0.26)";
      parede(topo, 0, L);
      parede(base, 0, L);
      // a parede da restrição acende em amarelo
      ctx.strokeStyle = `rgba(${AMARELO},0.95)`;
      ctx.shadowBlur = 16;
      ctx.shadowColor = `rgb(${AMARELO})`;
      parede(topo, zr * ZL - 12, (zr + 1) * ZL + 12);
      parede(base, zr * ZL - 12, (zr + 1) * ZL + 12);
      ctx.shadowBlur = 0;

      // bolinhas (em três faixas de brilho: paradas escurecem, em movimento acendem)
      const faixas: Array<{ a: number; pts: Array<[number, number]> }> = [
        { a: 0.42, pts: [] },
        { a: 0.7, pts: [] },
        { a: 1, pts: [] },
      ];
      for (const b of s.bolas) {
        if (b.u < -2) continue;
        const w = largura(b.u, s.w);
        const p = P(b.u, b.v * Math.max(0, w / 2 - R * 1.1));
        const k = b.vel < V * 0.25 ? 0 : b.vel < V * 0.75 ? 1 : 2;
        faixas[k]?.pts.push(p);
      }
      const raio = Math.max(1.5, R * sc);
      for (const f of faixas) {
        ctx.fillStyle = `rgba(${AMARELO},${f.a})`;
        ctx.beginPath();
        for (const [x, y] of f.pts) {
          ctx.moveTo(x + raio, y);
          ctx.arc(x, y, raio, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // rótulos das zonas
      const fs = Math.max(10, 19 * sc);
      ctx.font = `600 ${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
      ctx.textBaseline = "middle";
      for (let i = 0; i < NZ; i++) {
        const uc = (i + 0.5) * ZL;
        const w = largura(uc, s.w);
        const [x, y] = vertical ? P(uc, w / 2 + 34) : P(uc, w / 2 + 38);
        const eRest = i === zr;
        ctx.fillStyle = eRest ? `rgba(${AMARELO},0.95)` : "rgba(255,255,255,0.38)";
        ctx.textAlign = vertical ? "left" : "center";
        ctx.fillText(`ZONA ${i + 1}`, x, y);
      }

      // etiqueta "RESTRIÇÃO" sobre a zona restrita, pulsando de leve
      {
        const uc = (zr + 0.5) * ZL;
        const w = largura(uc, s.w);
        const [x, y] = vertical ? P(uc, -w / 2 - 14) : P(uc, -w / 2 - 34);
        const pulso = 0.7 + 0.3 * Math.sin(s.relogio * 3.2);
        ctx.fillStyle = `rgba(${AMARELO},${pulso})`;
        ctx.textAlign = vertical ? "right" : "center";
        ctx.font = `800 ${fs * 1.08}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
        ctx.fillText("RESTRIÇÃO", x, y);
      }

      // fase B: "+ capacidade" nas zonas 1 e 3 (o que NÃO é a restrição)
      const fb = suave(6, 7.2, s.t) * (1 - suave(13, 14.5, s.t));
      if (fb > 0.02) {
        ctx.font = `600 ${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
        for (const i of [0, 2]) {
          const uc = (i + 0.5) * ZL;
          const w = largura(uc, s.w);
          const [x, y] = vertical ? P(uc, -w / 2 - 14) : P(uc, -w / 2 - 34);
          ctx.fillStyle = `rgba(255,255,255,${0.75 * fb})`;
          ctx.textAlign = vertical ? "right" : "center";
          ctx.fillText("+ CAPACIDADE", x, y);
        }
      }

      // a Écsilab atuando na restrição
      const apareceC = suave(14.3, 15.2, s.t) * (1 - suave(33, 35, s.t));
      if (apareceC > 0.02 && ovelha.complete) {
        // fica na zona 4 até 24,2 s; depois viaja até a zona 2
        const viagem = suave(24.2, 25.4, s.t);
        const uc = (3.5 - 2 * viagem) * ZL;
        const flutua = Math.sin(s.relogio * 2.4) * 6;
        const w = largura(uc, s.w);
        const [mx, my] = vertical ? P(uc, -w / 2 - 120 + flutua) : P(uc, -w / 2 - 128 + flutua);
        const tam = Math.max(34, 74 * sc * (vertical ? 1.5 : 1.05));
        // facho de luz até a parede
        const [wx, wy] = P(uc, -w / 2);
        const g = ctx.createLinearGradient(mx, my, wx, wy);
        g.addColorStop(0, `rgba(${AMARELO},${0.5 * apareceC})`);
        g.addColorStop(1, `rgba(${AMARELO},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        const aberto = 56 * sc;
        if (vertical) {
          // marcador à esquerda do tubo: o facho abre no sentido vertical
          ctx.moveTo(mx + tam * 0.4, my);
          ctx.lineTo(wx, wy - aberto);
          ctx.lineTo(wx, wy + aberto);
        } else {
          ctx.moveTo(mx - tam * 0.2, my + tam * 0.4);
          ctx.lineTo(wx - aberto, wy);
          ctx.lineTo(wx + aberto, wy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = apareceC;
        ctx.shadowBlur = 24;
        ctx.shadowColor = `rgb(${AMARELO})`;
        ctx.drawImage(ovelha, mx - tam / 2, my - tam / 2, tam, tam);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(${AMARELO},${0.95 * apareceC})`;
        ctx.textAlign = "center";
        ctx.font = `800 ${fs}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
        ctx.fillText("ÉCSILAB", mx, my + tam / 2 + fs * 0.9);
      }

      // textos do DOM: legendas e contador
      if (hudRef.current) hudRef.current.style.opacity = String(s.t < 20 ? suave(0, 1.2, s.t) : 1 - suave(38.4, 39.8, s.t));
      if (saidaRef.current) saidaRef.current.textContent = s.saida.toLocaleString("pt-BR");
      const { z: zAtual, cap } = restricao();
      vazaoMostrada += (cap - vazaoMostrada) * 0.05;
      // a restrição trocou e a velocidade subiu de patamar: é uma conquista
      if (zrAnterior !== -1 && zAtual !== zrAnterior && cap > patamar * 1.05) {
        patamar = cap;
        piscar();
      }
      patamar = Math.min(patamar, cap); // se a velocidade cai (volta ao início), o patamar acompanha
      zrAnterior = zAtual;
      if (vazaoRef.current) vazaoRef.current.textContent = Math.round(vazaoMostrada).toLocaleString("pt-BR");
      LEGENDAS.forEach((l, i) => {
        const el = legendasRef.current[i];
        if (!el) return;
        const op = suave(l.ini, l.ini + 0.7, s.t) * (1 - suave(l.fim - 0.7, l.fim, s.t));
        el.style.opacity = String(op);
        el.style.transform = `translateY(${(1 - op) * 10}px)`;
      });
    };

    const quadro = (agora: number) => {
      if (!rodando) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      // até 2 subpassos mantêm a simulação estável em quadros longos
      const n = dt > 1 / 45 ? 2 : 1;
      for (let k = 0; k < n; k++) sim.passo(dt / n);
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
    // toca só se estiver na tela e ninguém tiver pausado
    const atualizar = () => {
      if (visivel && !pausadoUsuario) tocar();
      else pausar();
    };

    dimensionar();
    sim.aquecer(16);
    sim.s.t = reduzir ? 12 : 0;
    if (reduzir) {
      // quadro fixo: a fila já formada, sem movimento
      for (let k = 0; k < 60 * 6; k++) sim.passo(1 / 60);
    }
    ovelha.onload = desenhar;
    vazaoMostrada = sim.capacidade();
    patamar = vazaoMostrada;
    zrAnterior = restricao().z;
    desenhar();

    const ro = new ResizeObserver(() => {
      dimensionar();
      desenhar();
    });
    ro.observe(raiz);
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = !!e?.isIntersecting;
        atualizar();
      },
      { threshold: 0.05 },
    );
    io.observe(raiz);
    setPausado(reduzir);
    alternarRef.current = () => {
      pausadoUsuario = !pausadoUsuario;
      setPausado(pausadoUsuario);
      atualizar();
    };

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>)["__toc"] = {
        tocar,
        ir: (alvo: number) => {
          pausar();
          const nova = criarSim();
          nova.aquecer(16);
          sim.s.t = nova.s.t;
          sim.s.w = nova.s.w;
          sim.s.bolas = nova.s.bolas;
          sim.s.acc = nova.s.acc;
          sim.s.saida = 0;
          sim.s.saidas = [];
          sim.s.relogio = 0;
          while (sim.s.t < alvo) sim.passo(1 / 60);
          vazaoMostrada = sim.capacidade();
          patamar = sim.capacidade();
          zrAnterior = restricao().z;
          desenhar();
        },
        estado: () => ({ piscadas, capacidade: Math.round(sim.capacidade()), mostrado: Math.round(vazaoMostrada), restricao: restricao().z + 1, t: sim.s.t, bolas: sim.s.bolas.length, saida: sim.s.saida, vazao: sim.vazao(), w: sim.s.w.map((x) => Math.round(x)) }),
      };
    }

    return () => {
      pausar();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={raizRef} className="relative mx-auto h-[420px] w-full max-w-[1920px]">
      <div
        role="img"
        aria-label="Animação em loop da Teoria das Restrições: bolinhas amarelas fluem por um tubo de seis zonas. A zona mais estreita limita a saída. Ampliar as outras só acumula bolinhas antes dela; ao ampliar a restrição, o fluxo aumenta e surge a próxima restrição."
        className="absolute inset-0"
      >
        {/* só o desenho do tubo se dissolve nas bordas; os textos ficam inteiros e legíveis */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        >
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>

        {/* legenda que explica o fluxo: é ela que torna a animação compreensível */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[2.5%] px-5 text-center">
          <div className="relative mx-auto h-[3.4em] max-w-4xl text-[clamp(18px,2.3vw,34px)] leading-tight">
            {LEGENDAS.map((l, i) => (
              <p
                key={i}
                ref={(el) => {
                  legendasRef.current[i] = el;
                }}
                style={{ opacity: 0 }}
                className="absolute inset-x-0 font-extrabold uppercase tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.95)] [text-wrap:balance]"
              >
                {l.partes.map((p, j) =>
                  p.destaque ? (
                    <span key={j} className="font-serif text-[1.12em] font-normal normal-case italic text-accent">
                      {p.t}
                    </span>
                  ) : (
                    <span key={j}>{p.t}</span>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>

        {/* o destaque é a vazão (bolinhas por segundo); o total acumulado fica em segundo plano */}
        <div
          ref={hudRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[3%] left-[46%] -translate-x-1/2 text-center sm:left-auto sm:right-[17%] sm:translate-x-0 sm:text-right"
        >
          <div className="relative inline-block">
            {/* aparece só quando uma nova velocidade é conquistada, ao lado do número */}
            <div className="absolute right-full top-0 mr-[clamp(10px,1.4vw,22px)] flex h-full items-center">
              <p
                ref={novaRef}
                style={{ opacity: 0 }}
                className="whitespace-nowrap text-[clamp(10px,1vw,15px)] font-bold uppercase tracking-[0.2em] text-accent"
              >
                ↑ nova velocidade
              </p>
            </div>
            <p
              ref={numeroRef}
              className="origin-center text-[clamp(38px,5.2vw,78px)] font-extrabold leading-none text-accent drop-shadow-[0_0_22px_rgba(253,202,10,0.5)] sm:origin-right"
            >
              <span ref={vazaoRef}>0</span>
            </p>
          </div>
          <p className="mt-1 text-[clamp(11px,1.15vw,17px)] font-bold uppercase tracking-[0.18em] text-white">
            bolinhas por segundo
          </p>
          <p className="mt-2 text-[clamp(11px,1vw,14px)] text-paper/60">
            Total na saída: <span ref={saidaRef}>0</span>
          </p>
        </div>
      </div>

      {/* controle de acessibilidade: o movimento roda sozinho e precisa poder ser pausado */}
      <button
        type="button"
        onClick={() => alternarRef.current()}
        aria-label={pausado ? "Reproduzir a animação" : "Pausar a animação"}
        className="absolute bottom-[3%] left-[4%] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-paper backdrop-blur transition hover:bg-white/20 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {pausado ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
