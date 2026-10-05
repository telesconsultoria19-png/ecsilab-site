import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export const NAV = [
  { href: "#metodo", label: "Método" },
  { href: "#socios", label: "Sócios" },
  { href: "#diagnostico", label: "Diagnóstico" },
  { href: "#solucoes-ia", label: "Soluções de IA" },
  { href: "#contato", label: "Contato" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [ativa, setAtiva] = useState("");
  const [progresso, setProgresso] = useState(0);

  // Destaca no menu a seção que está na tela.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setAtiva(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Barra de leitura: quanto da página já foi percorrido.
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgresso(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" aria-label="ecsilab, página inicial" className="flex items-center">
          <img src="/logo-ecsilab.png" alt="ecsilab" className="h-8 w-auto" />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={ativa === item.href.slice(1) ? "location" : undefined}
              className={`text-sm transition-colors hover:text-accent ${
                ativa === item.href.slice(1) ? "text-accent" : "text-paper/80"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contato"
            className="hidden btn-neon rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-ink sm:inline-block"
          >
            Agendar diagnóstico
          </a>
          <button
            type="button"
            className="rounded-md p-2 text-paper md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent shadow-[0_0_12px_#fdca0a]"
        style={{ transform: `scaleX(${progresso})` }}
      />

      {open && (
        <nav className="border-t border-white/5 bg-ink px-4 py-4 md:hidden" aria-label="Menu móvel">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-paper/90 hover:bg-line"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contato"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-accent px-3 py-3 text-center font-semibold text-ink"
              >
                Agendar diagnóstico
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
