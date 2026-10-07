import { useEffect, useRef } from "react";

/**
 * Teoria das Restrições, em loop contínuo e sem bordas (cerca de 40 s por ciclo).
 *
 * Um tubo com 6 zonas de larguras diferentes. As bolinhas seguem umas às outras (cada uma precisa de espaço),
 * então a capacidade de cada zona nasce da largura dela e a fila se forma sozinha antes da zona mais estreita.
 * A saída do lado direito é limitada por essa zona: a restrição.
 *
 *   0 s   a zona 4 é a restrição; a fila cresce antes dela
 *   6 s   ampliamos as zonas 1 e 3: entra mais, a fila engorda, a saída não muda
 *  15 s   a Écsilab amplia a zona 4: o fluxo à direita aumenta
 *  25 s   a próxima restrição (zona 2) aparece; a Écsilab vai até lá e a amplia
 *  33 s   o sistema volta suavemente ao começo e o ciclo recomeça
 */

// ---------- geometria (unidades de projeto; o tubo tem 1920 de comprimento) ----------
const L = 1920;
const NZ = 6;
const ZL = L / NZ;
const BASE = [220, 150, 240, 60, 200, 230];
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
  if (t >= 15 && t < 33.5) w[3] = 210;
  if (t >= 25 && t < 33.5) w[1] = 260;
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
    vazao: () => s.saidas.length / 2,
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
    let sc = 1;
    let raf = 0;
    let rodando = false;
    let anterior = 0;

    const dimensionar = () => {
      cw = raiz.clientWidth;
      vertical = cw < 640;
      ch = vertical ? Math.round(130 + L * 0.4 + 130) : Math.round(Math.min(640, Math.max(380, cw * 0.46)));
      raiz.style.height = `${ch}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      sc = vertical ? 0.4 : cw / (L + 160);
    };

    // posição na tela de um ponto do tubo: u ao longo, v de lado
    const P = (u: number, v: number): [number, number] =>
      vertical ? [cw * 0.46 + v * sc, 130 + u * sc] : [80 * sc + u * sc, ch * 0.585 + v * sc];

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
      if (vazaoRef.current) vazaoRef.current.textContent = Math.round(sim.vazao()).toLocaleString("pt-BR");
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
      if (rodando || reduzir) return;
      rodando = true;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };
    const pausar = () => {
      rodando = false;
      cancelAnimationFrame(raf);
    };

    dimensionar();
    sim.aquecer(16);
    sim.s.t = reduzir ? 12 : 0;
    if (reduzir) {
      // quadro fixo: a fila já formada, sem movimento
      for (let k = 0; k < 60 * 6; k++) sim.passo(1 / 60);
    }
    ovelha.onload = desenhar;
    desenhar();

    const ro = new ResizeObserver(() => {
      dimensionar();
      desenhar();
    });
    ro.observe(raiz);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) tocar();
        else pausar();
      },
      { threshold: 0.05 },
    );
    io.observe(raiz);

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
          desenhar();
        },
        estado: () => ({ t: sim.s.t, bolas: sim.s.bolas.length, saida: sim.s.saida, vazao: sim.vazao(), w: sim.s.w.map((x) => Math.round(x)) }),
      };
    }

    return () => {
      pausar();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={raizRef}
      role="img"
      aria-label="Animação em loop da Teoria das Restrições: bolinhas amarelas fluem por um tubo de seis zonas. A zona mais estreita limita a saída. Ampliar as outras só acumula bolinhas antes dela; ao ampliar a restrição, o fluxo aumenta e surge a próxima restrição."
      className="relative mx-auto h-[420px] w-full max-w-[1920px]"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

      <div ref={hudRef} aria-hidden="true" className="pointer-events-none absolute bottom-[4%] right-[12%] text-right">
        <p className="text-[clamp(10px,1vw,14px)] font-semibold uppercase tracking-[0.25em] text-paper/50">Saída</p>
        <p className="text-[clamp(26px,3.4vw,52px)] font-extrabold leading-none text-accent drop-shadow-[0_0_18px_rgba(253,202,10,0.45)]">
          <span ref={saidaRef}>0</span>
        </p>
        <p className="mt-1 text-[clamp(10px,0.95vw,13px)] text-paper/55">
          <span ref={vazaoRef}>0</span> bolinhas por segundo
        </p>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[2.5%] px-6 text-center">
        <div className="relative mx-auto h-[3.1em] max-w-3xl text-[clamp(14px,1.6vw,24px)] leading-tight">
          {LEGENDAS.map((l, i) => (
            <p
              key={i}
              ref={(el) => {
                legendasRef.current[i] = el;
              }}
              style={{ opacity: 0 }}
              className="absolute inset-x-0 font-extrabold uppercase tracking-tight text-paper"
            >
              {l.partes.map((p, j) =>
                p.destaque ? (
                  <span key={j} className="font-serif font-normal normal-case italic text-accent">
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
    </div>
  );
}
