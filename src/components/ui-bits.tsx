import { useEffect, useRef, useState, type ReactNode } from "react";

export function Section({
  id,
  children,
  tone = "default",
  bg,
}: {
  id?: string;
  children: ReactNode;
  tone?: "default" | "soft";
  bg?: ReactNode;
}) {
  return (
    <section {...(id ? { id } : {})} className="relative overflow-hidden">
      {tone === "soft" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-accent/[0.07] blur-[120px]"
        />
      )}
      {tone === "default" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/3 h-[24rem] w-[24rem] rounded-full bg-accent/[0.04] blur-[120px]"
        />
      )}
      {bg}
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, claro = false }: { children: ReactNode; claro?: boolean }) {
  return (
    <p
      className={`mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] ${claro ? "text-[#8a6300]" : "text-accent"}`}
    >
      <span
        className={`eyebrow-line h-px w-8 bg-gradient-to-r from-transparent ${claro ? "to-[#8a6300]" : "to-accent shadow-[0_0_10px_#fdca0a]"}`}
      />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <header className="reveal mb-12 max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-paper/75">{lead}</p>}
    </header>
  );
}

/** Cartão de vidro escuro; a luz amarela acompanha o mouse. */
export function GlowCard({
  children,
  className = "",
  as: Tag = "div",
  reveal = true,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
  reveal?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`glow-card ${reveal ? "reveal" : ""} ${className}`}
      {...rest}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </Tag>
  );
}

/** Número que conta de zero até o valor quando entra na tela. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1600,
  onDone,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Duração total em milissegundos. Começa rápido e desacelera até o valor final. */
  duration?: number;
  /** Chamado uma vez, quando o número termina de subir. */
  onDone?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = duration;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setN(value * (1 - Math.pow(1 - p, 2)));
          if (p < 1) raf = requestAnimationFrame(tick);
          else doneRef.current?.();
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-paper placeholder:text-paper/40 transition focus:border-accent/70 focus:bg-white/[0.07] focus:shadow-[0_0_24px_-6px_rgba(253,202,10,0.6)] focus:outline-none";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-paper/80">{label}</span>
      {children}
    </label>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="btn-neon rounded-xl bg-accent px-6 py-3.5 font-semibold text-ink disabled:opacity-50"
    >
      {children}
    </button>
  );
}
