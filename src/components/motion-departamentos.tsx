import {
  Building2,
  Handshake,
  Headset,
  HeartPulse,
  Megaphone,
  PenTool,
  Scale,
  ShoppingCart,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Hero do Enterprise: o ecossistema, no mesmo desenho do site da Tittanium.
 *
 * Os departamentos ficam em cartões que flutuam sobre uma órbita ao redor da empresa do cliente. Atrás deles, um canvas
 * liga cada cartão ao centro por um caminho de dois pontos intermediários que balançam, fecha uma teia fina entre os
 * vizinhos e faz uma bolinha viajar de cada cartão até o centro, em loop contínuo. A cor é o negativo do original
 * (linhas escuras sobre o fundo branco da hero).
 */

const ITENS: Array<{ nome: string; linhas: string[]; Icone: LucideIcon }> = [
  { nome: "Vendas", linhas: ["Vendas"], Icone: Handshake },
  { nome: "Marketing", linhas: ["Marketing"], Icone: Megaphone },
  { nome: "Atendimento e CS", linhas: ["Atendimento", "e CS"], Icone: Headset },
  { nome: "Financeiro", linhas: ["Financeiro"], Icone: Wallet },
  { nome: "RH", linhas: ["RH"], Icone: Users },
  { nome: "Conteúdo", linhas: ["Conteúdo"], Icone: PenTool },
  { nome: "Jurídico", linhas: ["Jurídico"], Icone: Scale },
  { nome: "Imobiliário", linhas: ["Imobiliário"], Icone: Building2 },
  { nome: "Saúde & Estética", linhas: ["Saúde &", "Estética"], Icone: HeartPulse },
  { nome: "E-commerce", linhas: ["E-commerce"], Icone: ShoppingCart },
];
const N = ITENS.length;
// ritmo de flutuação de cada cartão (como no original: cada um com sua duração e seu atraso)
const DURACOES = [3.8, 4.3, 3.6, 4.8, 4.1, 3.9, 4.5, 4.0, 4.4, 4.2];
const ATRASOS = [0, -1.2, -2.5, -0.7, -3.1, -1.8, -0.4, -2.0, -2.8, -1.5];

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

export function MotionDepartamentos({
  ativo = true,
}: {
  ativo?: boolean;
  tema?: "escuro" | "claro";
}) {
  const secaoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centroRef = useRef<HTMLDivElement>(null);
  const cartoesRef = useRef<Array<HTMLDivElement | null>>([]);
  const [pausado, setPausado] = useState(false);
  const pausadoRef = useRef(false);
  const retomarRef = useRef<() => void>(() => {});

  useEffect(() => {
    const secao = secaoRef.current;
    const canvas = canvasRef.current;
    const centro = centroRef.current;
    const ctx = canvas?.getContext("2d");
    if (!secao || !canvas || !centro || !ctx) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // caminhos: cada cartão tem dois pontos intermediários, com desvios e pulsos próprios
    const r = semente(7);
    const caminhos = Array.from({ length: N }, () => ({
      offset1: (r() - 0.5) * 80,
      offset2: (r() - 0.5) * 80,
      dist1: 0.35 + r() * 0.1,
      dist2: 0.65 + r() * 0.1,
      pulse: r() * Math.PI * 2,
    }));

    let w = 0;
    let h = 0;
    let raf = 0;
    let visivel = false;
    let tempo = reduzir ? 1.3 : 0;
    let anterior = 0;

    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = secao.offsetWidth;
      h = secao.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const centroDe = (el: Element) => {
      const a = el.getBoundingClientRect();
      const b = secao.getBoundingClientRect();
      return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
    };

    const desenhar = () => {
      ctx.clearRect(0, 0, w, h);
      const c = centroDe(centro);
      const cartoes = cartoesRef.current.map((el) => (el ? centroDe(el) : c));

      const nos = cartoes.map((card, i) => {
        const dx = card.x - c.x;
        const dy = card.y - c.y;
        const ang = Math.atan2(dy, dx);
        const pAng = ang + Math.PI / 2;
        const caminho = caminhos[i]!;
        const a1 = caminho.offset1 + Math.sin(tempo + caminho.pulse) * 15;
        const a2 = caminho.offset2 + Math.cos(tempo + caminho.pulse) * 15;
        return {
          card,
          caminho,
          p1: {
            x: c.x + dx * caminho.dist1 + Math.cos(pAng) * a1,
            y: c.y + dy * caminho.dist1 + Math.sin(pAng) * a1,
          },
          p2: {
            x: c.x + dx * caminho.dist2 + Math.cos(pAng) * a2,
            y: c.y + dy * caminho.dist2 + Math.sin(pAng) * a2,
          },
        };
      });

      nos.forEach((no, i) => {
        const prox = nos[(i + 1) % nos.length]!;

        // conexão principal: cartão → p2 → p1 → centro
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 1;
        ctx.moveTo(no.card.x, no.card.y);
        ctx.lineTo(no.p2.x, no.p2.y);
        ctx.lineTo(no.p1.x, no.p1.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();

        // conexão secundária: a teia fina entre os vizinhos
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(no.p1.x, no.p1.y);
        ctx.lineTo(prox.p1.x, prox.p1.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(no.p2.x, no.p2.y);
        ctx.lineTo(prox.p2.x, prox.p2.y);
        ctx.stroke();

        // nó externo entre os cartões, para fechar os 360 graus
        const p3 = {
          x: (no.card.x + prox.card.x) / 2 + Math.cos(tempo + no.caminho.pulse) * 10,
          y: (no.card.y + prox.card.y) / 2 + Math.sin(tempo + no.caminho.pulse) * 10,
        };
        ctx.beginPath();
        ctx.moveTo(no.p2.x, no.p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(prox.p2.x, prox.p2.y);
        ctx.stroke();

        // pontos de interseção
        for (const p of [no.p1, no.p2, p3]) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // a bolinha que viaja do cartão até o centro (t: 0 no cartão, 1 no centro)
        const t = (tempo * 0.8 + no.caminho.pulse / (Math.PI * 2)) % 1;
        const { dist1, dist2 } = no.caminho;
        let x: number;
        let y: number;
        if (t < 1 - dist2) {
          const s = t / (1 - dist2);
          x = no.card.x + (no.p2.x - no.card.x) * s;
          y = no.card.y + (no.p2.y - no.card.y) * s;
        } else if (t < 1 - dist1) {
          const s = (t - (1 - dist2)) / (dist2 - dist1);
          x = no.p2.x + (no.p1.x - no.p2.x) * s;
          y = no.p2.y + (no.p1.y - no.p2.y) * s;
        } else {
          const s = (t - (1 - dist1)) / dist1;
          x = no.p1.x + (c.x - no.p1.x) * s;
          y = no.p1.y + (c.y - no.p1.y) * s;
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(184, 132, 0, 0.95)";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(184, 132, 0, 0.6)";
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const quadro = (agora: number) => {
      raf = 0;
      if (!visivel || pausadoRef.current) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      tempo += dt * 0.3; // o original avança 0,005 por quadro a 60 quadros por segundo
      desenhar();
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      if (reduzir || raf || !visivel || pausadoRef.current) return;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };
    retomarRef.current = tocar;

    dimensionar();
    desenhar();
    const ro = new ResizeObserver(() => {
      dimensionar();
      desenhar();
    });
    ro.observe(secao);
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = !!e?.isIntersecting;
        if (visivel) tocar();
      },
      { threshold: 0.1 },
    );
    io.observe(secao);

    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>)["__eco"] = {
        ir: (seg: number) => {
          tempo += seg * 0.3;
          desenhar();
        },
      };
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div
        ref={secaoRef}
        role="img"
        aria-label="Animação em loop: dez departamentos (vendas, marketing, atendimento e CS, financeiro, RH, conteúdo, jurídico, imobiliário, saúde e estética e e-commerce) em cartões que flutuam ao redor da empresa do cliente, ligados a ela e uns aos outros por fios finos, com pontos de luz viajando até o centro."
        style={{ ["--card" as string]: "clamp(62px, 17vw, 90px)" }}
        className={`relative flex w-full items-center justify-center overflow-visible px-[calc(var(--card)/2)] py-[calc(var(--card)/2+8px)] transition-opacity duration-1000 ${
          ativo ? "opacity-100" : "opacity-0"
        }`}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
        />
        <div
          aria-hidden="true"
          className="relative aspect-square w-[clamp(240px,70vw,420px)] rounded-full border border-dashed border-black/[0.08]"
        >
          <div
            ref={centroRef}
            className="absolute left-1/2 top-1/2 z-10 flex aspect-square w-[31%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-black/[0.08] bg-white text-center shadow-[inset_0_0_30px_rgba(0,0,0,0.05),0_0_30px_rgba(0,0,0,0.06)]"
          >
            <span className="text-[10px] font-extrabold leading-tight tracking-wide text-black sm:text-[13px]">
              SUA
              <br />
              EMPRESA
            </span>
          </div>
          {ITENS.map((it, i) => (
            <div
              key={it.nome}
              className="eco-item"
              style={{ ["--angulo" as string]: `${-90 + (360 / N) * i}deg` }}
            >
              <div
                ref={(el) => {
                  cartoesRef.current[i] = el;
                }}
                className="eco-card"
                style={{ animationDuration: `${DURACOES[i]}s`, animationDelay: `${ATRASOS[i]}s` }}
              >
                <it.Icone className="h-4 w-4 text-[#8a6300] sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="px-1 text-center text-[8.5px] font-bold leading-[1.15] text-black/85 sm:text-[11px]">
                  {it.linhas.map((l, q) => (
                    <span key={q} className="block whitespace-nowrap">
                      {l}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* sem botão visível: a pausa aparece só para quem navega pelo teclado */}
      <button
        type="button"
        onClick={() => {
          pausadoRef.current = !pausadoRef.current;
          setPausado(pausadoRef.current);
          if (!pausadoRef.current) retomarRef.current();
        }}
        aria-pressed={pausado}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-0 focus-visible:left-0 focus-visible:rounded-full focus-visible:bg-black/10 focus-visible:px-4 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-black"
      >
        {pausado ? "Reproduzir a animação" : "Pausar a animação"}
      </button>
    </div>
  );
}
