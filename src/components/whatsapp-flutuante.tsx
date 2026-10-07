import { MessageCircle } from "lucide-react";

import { linkWhatsApp } from "@/lib/contato";

/** Botão fixo no canto da tela, em todas as páginas. */
export function WhatsAppFlutuante() {
  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Écsilab no WhatsApp"
      className="btn-neon group fixed bottom-5 right-5 z-40 flex items-center gap-0 rounded-full bg-accent p-4 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
    >
      <MessageCircle size={26} strokeWidth={2.2} aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[10rem] group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-[10rem] group-focus-visible:opacity-100">
        Falar no WhatsApp
      </span>
    </a>
  );
}
