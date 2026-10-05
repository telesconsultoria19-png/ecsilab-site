import type { ReactNode } from "react";

export function Section({
  id,
  children,
  tone = "default",
}: {
  id?: string;
  children: ReactNode;
  tone?: "default" | "soft";
}) {
  return (
    <section
      {...(id ? { id } : {})}
      className={`border-b border-line ${tone === "soft" ? "bg-[#0a0a0a]" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">{children}</div>
    </section>
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
    <header className="mb-12 max-w-3xl">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-paper/75">{lead}</p>}
    </header>
  );
}

export const inputCls =
  "w-full rounded-md border border-paper/25 bg-ink px-4 py-3 text-paper placeholder:text-paper/40 focus:border-accent focus:outline-none";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
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
      className="rounded-md bg-accent px-6 py-3.5 font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
