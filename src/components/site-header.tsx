import { useState } from "react";
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

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" aria-label="ecsilab, página inicial" className="flex items-center">
          <img src="/logo-ecsilab.png" alt="ecsilab" className="h-8 w-auto" />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-paper/80 transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contato"
            className="hidden rounded-md bg-accent px-4 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90 sm:inline-block"
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

      {open && (
        <nav className="border-t border-line bg-ink px-4 py-4 md:hidden" aria-label="Menu móvel">
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
