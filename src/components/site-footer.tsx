import { Link } from "@tanstack/react-router";

import { Mascote } from "@/components/animated-icons";
import { EVENTO_ABRIR_CONSENTIMENTO } from "@/components/consent-banner";
import { WHATSAPP_EXIBICAO, linkWhatsApp } from "@/lib/contato";
import { RESPONSAVEL } from "@/lib/legal";

export function SiteFooter() {
  const r = RESPONSAVEL;
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <a href="/" aria-label="Écsilab, página inicial">
            <img src="/logo-ecsilab.png" alt="Écsilab" className="h-7 w-auto" />
          </a>
          <p className="mt-3 text-sm text-paper/60">Growth, processos e escala comercial.</p>
          <p className="mt-2 text-sm text-paper/70">
            WhatsApp:{" "}
            <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
              {WHATSAPP_EXIBICAO}
            </a>
          </p>
          <nav aria-label="Informações legais" className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70">
            <Link to="/politica-de-privacidade" className="hover:text-accent">
              Política de Privacidade
            </Link>
            <Link to="/termos-de-uso" className="hover:text-accent">
              Termos de Uso
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR_CONSENTIMENTO))}
              className="hover:text-accent"
            >
              Preferências de cookies
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <p className="text-sm text-paper/50">
            © {new Date().getFullYear()} Écsilab.
            {r.razaoSocial ? ` ${r.razaoSocial}${r.cnpj ? `, CNPJ ${r.cnpj}` : ""}.` : ""} Todos os direitos
            reservados.
          </p>
          <Mascote className="h-16 w-16 shrink-0" />
        </div>
      </div>
    </footer>
  );
}
