import { useEffect, useRef } from "react";

type Dados = { w: number; h: number; p: number[] };

/** Duração da construção da ovelha: o relógio é elevado a uma potência, então começa bem devagar e acelera. */
const TEMPO_CONSTRUCAO = 4.6;
const AMARELO = "253,202,10";
const BRANCO = "255,255,255";

/**
 * A ovelha da Écsilab feita de partículas: elas voam de pontos aleatórios e se montam, depois respiram e flutuam.
 * O mouse (ou o toque) afasta as partículas, uma onda de luz atravessa a ovelha de tempos em tempos e, ao rolar a
 * página para além da hero, a ovelha se desfaz e se dispersa. Não tem bordas: faz parte do fundo.
 * Os pontos vêm de /ovelha-particulas.json, gerado a partir de /ovelha.png.
 */
export function OvelhaParticulas({ className = "" }: { className?: string }) {
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const caixa = caixaRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!caixa || !canvas || !ctx) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let vivo = true;
    let cw = 0;
    let ch = 0;
    let dpr = 1;
    let raf = 0;
    let visivel = false;
    let tempo = 0;
    let anterior = 0;
    let dtq = 1 / 60;
    const mouse = { x: -9999, y: -9999 };

    // partículas (arrays tipados, para ficar leve)
    let n = 0;
    let nx: Float32Array, ny: Float32Array; // posição de repouso, em unidades da ovelha (-0.5 a 0.5)
    let x: Float32Array, y: Float32Array; // posição atual
    let ang: Float32Array,
      rnd: Float32Array,
      ini: Float32Array,
      dur: Float32Array,
      lim: Float32Array;
    let tipo: Uint8Array;

    // o canvas cobre a seção inteira (a poeira vem de todo lado); a ovelha se forma onde está a caixa
    const secao = caixa.closest("section") ?? caixa;
    let ox = 0;
    let oy = 0;
    let sBase = 1;
    const medir = () => {
      const r = caixa.getBoundingClientRect();
      const sr = secao.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = sr.width;
      ch = sr.height;
      canvas.style.left = `${sr.left - r.left}px`;
      canvas.style.top = `${sr.top - r.top}px`;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ox = r.left + r.width / 2 - sr.left;
      oy = r.top + r.height / 2 - sr.top;
      sBase = Math.min(r.width, r.height) * 1.08;
    };

    const desenhar = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      if (n === 0) return;
      const S = sBase;
      const cx = ox;
      const cy = oy;
      const respira = 1 + Math.sin(tempo * 0.9) * 0.012;
      const G = reduzir ? 1 : Math.min(1, Math.pow(tempo / TEMPO_CONSTRUCAO, 1.6));

      // dispersão ao rolar para além da hero
      const r = caixa.getBoundingClientRect();
      const disp = reduzir
        ? 0
        : Math.min(
            1,
            Math.max(
              0,
              (window.innerHeight * 0.18 - r.top - r.height * 0.35) / (window.innerHeight * 0.5),
            ),
          );

      // onda de luz: a cada 7 s, um anel que cresce a partir do centro
      const fase = (tempo % 7) / 2.4;
      const raioOnda = fase < 1 ? fase * S * 0.62 : -1;
      const raioMouse = Math.max(48, S * 0.13);

      const tam = Math.max(0.85, S / 480);
      for (let i = 0; i < n; i++) {
        const a = ang[i]!;
        const q = rnd[i]!;
        let tx = cx + nx[i]! * S * respira + Math.sin(tempo * 0.8 + a * 3) * 0.9;
        let ty = cy + ny[i]! * S * respira + Math.cos(tempo * 0.6 + a * 2) * 0.9;

        let brilho = 0;
        if (raioOnda >= 0) {
          const dx0 = tx - cx;
          const dy0 = ty - cy;
          const d0 = Math.hypot(dx0, dy0);
          const f = 1 - Math.min(1, Math.abs(d0 - raioOnda) / (S * 0.07));
          if (f > 0) {
            brilho = f;
            tx += (dx0 / (d0 || 1)) * f * S * 0.02;
            ty += (dy0 / (d0 || 1)) * f * S * 0.02;
          }
        }
        if (disp > 0) {
          tx += Math.cos(a) * disp * S * (0.3 + q * 0.7);
          ty += Math.sin(a) * disp * S * (0.3 + q * 0.7) - disp * S * 0.25;
        }

        // construção: começa devagar (poucas partículas, do rosto para a lã) e acelera até a ovelha estar completa
        if (ini[i]! < 0 && G >= lim[i]!) ini[i] = tempo;
        const asm = ini[i]! < 0 ? 0 : Math.min(1, (tempo - ini[i]!) / dur[i]!);
        const e = 1 - Math.pow(1 - asm, 3);
        if (ini[i]! < 0) {
          // poeira: as partículas ainda soltas vagam de leve e quase não se veem
          x[i] = x[i]! + Math.sin(tempo * 0.5 + a * 5) * 0.12;
          y[i] = y[i]! + Math.cos(tempo * 0.4 + a * 3) * 0.12;
        } else {
          const k = reduzir ? 1 : 1 - Math.exp(-(1.4 + e * 3.2) * dtq);
          x[i] = x[i]! + (tx - x[i]!) * k;
          y[i] = y[i]! + (ty - y[i]!) * k;
        }

        // o mouse empurra
        const mx = x[i]! - mouse.x;
        const my = y[i]! - mouse.y;
        const d2 = mx * mx + my * my;
        if (d2 < raioMouse * raioMouse && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = (raioMouse - d) / raioMouse;
          x[i] = x[i]! + (mx / d) * f * 11;
          y[i] = y[i]! + (my / d) * f * 11;
        }

        const amarela = tipo[i] === 1;
        const alfa = Math.min(
          1,
          (((amarela ? 0.95 : 0.82) + q * 0.2 + brilho * 0.5) * e + 0.22 * (1 - e)) * (1 - disp),
        );
        if (alfa <= 0.01) continue;
        ctx.fillStyle = `rgba(${amarela ? AMARELO : BRANCO},${alfa})`;
        const s = tam * (0.8 + q * 0.7) * (1 + brilho * 0.6);
        ctx.fillRect(x[i]! - s / 2, y[i]! - s / 2, s, s);
      }
    };

    const quadro = (agora: number) => {
      raf = 0;
      if (!vivo || !visivel) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      tempo += dt;
      dtq = dt;
      desenhar();
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      if (reduzir || raf || !vivo) return;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    medir();
    fetch("/ovelha-particulas.json")
      .then((res) => res.json() as Promise<Dados>)
      .then((dados) => {
        let d = dados;
        if (!vivo) return;
        // "BLACK SHEEP" no pescoço da ovelha, como espaço vazio: as partículas que cairiam sobre as letras não existem
        const mascara = document.createElement("canvas");
        mascara.width = d.w;
        mascara.height = d.h;
        const mc = mascara.getContext("2d", { willReadFrequently: true });
        let letras: Uint8ClampedArray | null = null;
        if (mc) {
          mc.fillStyle = "#000";
          mc.strokeStyle = "#000";
          mc.lineWidth = 1.4;
          mc.textAlign = "center";
          mc.textBaseline = "middle";
          mc.font = `800 ${d.h * 0.05}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`;
          try {
            (mc as unknown as { letterSpacing: string }).letterSpacing = `${d.h * 0.012}px`;
          } catch {
            /* sem suporte a espaçamento entre letras */
          }
          for (const [txt, fy] of [
            ["BLACK", 0.752],
            ["SHEEP", 0.806],
          ] as const) {
            mc.fillText(txt, d.w * 0.5, d.h * fy);
            mc.strokeText(txt, d.w * 0.5, d.h * fy);
          }
          letras = mc.getImageData(0, 0, d.w, d.h).data;
        }
        const pts: number[] = [];
        for (let k = 0; k < d.p.length; k += 3) {
          const px = Math.min(d.w - 1, Math.max(0, Math.round(d.p[k]!)));
          const py = Math.min(d.h - 1, Math.max(0, Math.round(d.p[k + 1]!)));
          if (letras && letras[(py * d.w + px) * 4 + 3]! > 40) continue;
          pts.push(d.p[k]!, d.p[k + 1]!, d.p[k + 2]!);
        }
        d = { ...d, p: pts };
        n = d.p.length / 3;
        nx = new Float32Array(n);
        ny = new Float32Array(n);
        x = new Float32Array(n);
        y = new Float32Array(n);
        ang = new Float32Array(n);
        rnd = new Float32Array(n);
        ini = new Float32Array(n);
        dur = new Float32Array(n);
        lim = new Float32Array(n);
        tipo = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          nx[i] = d.p[i * 3]! / d.w - 0.5;
          ny[i] = d.p[i * 3 + 1]! / d.w - 0.5 * (d.h / d.w);
          tipo[i] = d.p[i * 3 + 2]!;
          ang[i] = Math.random() * Math.PI * 2;
          rnd[i] = Math.random();
          x[i] = Math.random() * cw;
          y[i] = Math.random() * ch;
          dur[i] = 1.2 + Math.random() * 1.0;
          ini[i] = reduzir ? 0 : -1;
          // ordem de construção: do centro (rosto) para fora (lã), com um pouco de acaso
          lim[i] = Math.min(1, Math.hypot(nx[i]!, ny[i]!) / 0.5) * 0.82 + Math.random() * 0.18;
          if (reduzir) {
            x[i] = ox + nx[i]! * sBase;
            y[i] = oy + ny[i]! * sBase;
          }
        }
        desenhar();
        if (visivel) tocar();
      })
      .catch(() => {});

    if (import.meta.env.DEV) {
      // só em desenvolvimento: avança a animação sem depender do relógio do navegador
      (window as unknown as Record<string, unknown>)["__ovelha"] = {
        ir: (seg: number) => {
          for (let k = 0; k < seg * 60; k++) {
            tempo += 1 / 60;
            dtq = 1 / 60;
            desenhar();
          }
        },
      };
    }

    const ro = new ResizeObserver(() => {
      medir();
      desenhar();
    });
    ro.observe(caixa);
    ro.observe(secao);
    const io = new IntersectionObserver(([e]) => {
      visivel = !!e?.isIntersecting;
      if (visivel) tocar();
    });
    io.observe(caixa);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={caixaRef}
      role="img"
      aria-label="A ovelha da Écsilab, formada por partículas de luz"
      className={`relative aspect-square w-full ${className}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute -z-10" />
    </div>
  );
}
