import { useState, type CSSProperties } from "react";

import { useInView } from "@/lib/use-in-view";

const AMARELO = "#fdca0a";
const BRANCO = "rgba(255,255,255,0.7)";

function d(delay: number): CSSProperties {
  return { animationDelay: `${delay}s` };
}

/** Wrapper: o desenho começa quando o ícone entra na tela. */
function Anim({
  viewBox,
  className = "",
  children,
  label,
}: {
  viewBox: string;
  className?: string;
  children: React.ReactNode;
  label?: string;
}) {
  const [ref, visto] = useInView<SVGSVGElement>(0.6);
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      fill="none"
      stroke={AMARELO}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${visto ? "anim-on" : "anim-off"} ${className}`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {children}
    </svg>
  );
}

/** OKR: alvo cujos anéis se fecham e a seta acerta o centro. */
export function IconOKR({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <Anim viewBox="0 0 64 64" className={className}>
      <circle className="draw" pathLength={1} cx="32" cy="32" r="26" style={d(0)} />
      <circle className="draw" pathLength={1} cx="32" cy="32" r="17" style={d(0.25)} />
      <circle className="draw" pathLength={1} cx="32" cy="32" r="8" style={d(0.5)} />
      <path className="draw" pathLength={1} d="M54 10 L34 30" style={d(0.8)} />
      <path className="draw" pathLength={1} d="M45 10 L54 10 L54 19" style={d(1.1)} />
    </Anim>
  );
}

/** Scrum: ciclo que dá uma volta e fecha. */
export function IconScrum({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <Anim viewBox="0 0 64 64" className={className}>
      <path className="draw" pathLength={1} d="M32 10 A22 22 0 1 1 10 32" style={d(0)} />
      <path className="draw" pathLength={1} d="M4 38 L10 31 L17 38" style={d(1)} />
      <circle className="draw" pathLength={1} cx="32" cy="32" r="4" style={d(1.2)} />
    </Anim>
  );
}

/** Teoria das Restrições: corrente em que o elo mais fraco (o gargalo) acende. */
export function IconCorrente({ className = "h-14 w-[4.5rem]" }: { className?: string }) {
  return (
    <Anim viewBox="0 0 64 48" className={className}>
      <rect className="draw" pathLength={1} x="2" y="17" width="24" height="14" rx="7" stroke={BRANCO} style={d(0)} />
      <rect className="draw" pathLength={1} x="38" y="17" width="24" height="14" rx="7" stroke={BRANCO} style={d(0.3)} />
      <g className="glow-once" style={d(1.1)}>
        <rect className="draw" pathLength={1} x="20" y="17" width="24" height="14" rx="7" style={d(0.6)} />
      </g>
      <path className="draw" pathLength={1} d="M29 12 L32 7 M35 12 L38 8" style={d(1)} />
    </Anim>
  );
}

/** Confirmação: círculo e visto que se desenham. */
export function CheckAnimado({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <Anim viewBox="0 0 64 64" className={className} label="Enviado com sucesso">
      <circle className="draw" pathLength={1} cx="32" cy="32" r="26" style={d(0)} />
      <path className="draw" pathLength={1} d="M20 33 L29 42 L45 24" style={d(0.5)} />
    </Anim>
  );
}

/** Aspas que se desenham antes do depoimento. */
export function AspasAnimadas({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Anim viewBox="0 0 44 48" className={className}>
      <path className="draw" pathLength={1} d="M6 22 a8 8 0 1 1 8 8 c0 6 -3 10 -8 12" style={d(0)} />
      <path className="draw" pathLength={1} d="M28 22 a8 8 0 1 1 8 8 c0 6 -3 10 -8 12" style={d(0.35)} />
    </Anim>
  );
}

/** Nós ligados por linhas; aparecem quando o cartão recebe o mouse (requer `group` no pai). */
export function NosConectados({ className = "h-10 w-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      stroke={AMARELO}
      strokeWidth={1.5}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path className="node-line" pathLength={1} d="M8 30 L30 10" />
      <path className="node-line" pathLength={1} d="M30 10 L56 26" style={{ transitionDelay: "0.15s" }} />
      <path className="node-line" pathLength={1} d="M8 30 L56 26" style={{ transitionDelay: "0.3s" }} />
      {[
        [8, 30],
        [30, 10],
        [56, 26],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} className="node-dot" cx={x} cy={y} r="3" fill={AMARELO} />
      ))}
    </svg>
  );
}

/** Medidor semicircular da relação LTV/CAC. */
function pos(ratio: number) {
  if (ratio < 1) return ratio * 0.2;
  if (ratio < 3) return 0.2 + ((ratio - 1) / 2) * 0.4;
  return 0.6 + Math.min((ratio - 3) / 2, 1) * 0.4;
}
function ponto(p: number, r = 80) {
  return `${(100 - r * Math.cos(Math.PI * p)).toFixed(2)} ${(100 - r * Math.sin(Math.PI * p)).toFixed(2)}`;
}
function arco(a: number, b: number) {
  return `M ${ponto(a)} A 80 80 0 0 1 ${ponto(b)}`;
}

export function Medidor({ ratio, zona }: { ratio: number; zona: 0 | 1 | 2 }) {
  const angulo = -90 + pos(ratio) * 180;
  const faixas = [
    { a: 0, b: 0.2, cor: "#f87171" },
    { a: 0.2, b: 0.6, cor: AMARELO },
    { a: 0.6, b: 1, cor: "#4ade80" },
  ];
  return (
    <svg
      viewBox="0 0 200 118"
      className="mx-auto w-full max-w-[17rem]"
      role="img"
      aria-label={`Medidor: relação LTV/CAC de ${ratio.toFixed(1)}x`}
    >
      {faixas.map((f, i) => (
        <path
          key={f.cor}
          d={arco(f.a + 0.006, f.b - 0.006)}
          stroke={f.cor}
          strokeWidth={12}
          strokeLinecap="round"
          fill="none"
          style={{ opacity: zona === i ? 1 : 0.28, transition: "opacity 0.5s", filter: zona === i ? `drop-shadow(0 0 8px ${f.cor})` : "none" }}
        />
      ))}
      <g style={{ transformOrigin: "100px 100px", transform: `rotate(${angulo}deg)`, transition: "transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
        <line x1="100" y1="100" x2="100" y2="36" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </g>
      <circle cx="100" cy="100" r="7" fill="#fff" />
      <circle cx="100" cy="100" r="3" fill="#000" />
    </svg>
  );
}

/** Funil com a etapa do gargalo acesa. */
export function Funil({ ativa }: { ativa: "traffic" | "conversion" | "process" }) {
  const [ref, visto] = useInView<SVGSVGElement>(0.4);
  const bandas = [
    { id: "traffic" as const, nome: "Tráfego", pts: "8,6 152,6 138,40 22,40", y: 28 },
    { id: "conversion" as const, nome: "Conversão", pts: "24,47 136,47 124,81 36,81", y: 69 },
    { id: "process" as const, nome: "Processo", pts: "40,88 120,88 110,122 50,122", y: 110 },
  ];
  return (
    <svg
      ref={ref}
      viewBox="0 0 160 128"
      className={`${visto ? "anim-on" : "anim-off"} w-full max-w-[12rem]`}
      role="img"
      aria-label={`Funil comercial: o gargalo está em ${bandas.find((b) => b.id === ativa)?.nome}`}
    >
      {bandas.map((b, i) => {
        const on = b.id === ativa;
        return (
          <g key={b.id} className={`fade-in ${on ? "glow-once" : ""}`} style={d(i * 0.25)}>
            <polygon
              points={b.pts}
              fill={on ? AMARELO : "rgba(255,255,255,0.05)"}
              stroke={on ? AMARELO : "rgba(255,255,255,0.22)"}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            <text
              x="80"
              y={b.y}
              textAnchor="middle"
              fontSize="11"
              fontWeight={700}
              fill={on ? "#000" : "rgba(255,255,255,0.5)"}
            >
              {b.nome}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Fio de luz que se estende sob um título. */
export function Fio() {
  const [ref, visto] = useInView<HTMLDivElement>(0.5);
  return (
    <div ref={ref} aria-hidden="true" className="mt-4 h-px w-64 max-w-full">
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-accent via-accent/60 to-transparent shadow-[0_0_12px_#fdca0a]"
        style={{
          transform: visto ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      />
    </div>
  );
}

/** A ovelha do logo: pisca uma vez ao aparecer e de novo ao passar o mouse. */
export function Mascote({ className = "h-20 w-20" }: { className?: string }) {
  const [ref, visto] = useInView<HTMLSpanElement>(0.8);
  const [n, setN] = useState(0);
  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
      onPointerEnter={() => setN((v) => v + 1)}
    >
      <img src="/ovelha.png" alt="Ovelha negra, mascote da Écsilab" className="h-full w-full rounded-lg" />
      {(visto || n > 0) && (
        <span
          key={n}
          aria-hidden="true"
          className="pisca pisca-on absolute rounded-b-full border-b-[3px] border-black bg-[#f6c401]"
          style={{ left: "52%", top: "44.8%", width: "10.2%", height: "6.4%" }}
        />
      )}
    </span>
  );
}
