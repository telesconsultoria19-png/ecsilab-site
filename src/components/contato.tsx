import { MessageCircle } from "lucide-react";

import { EnergyFlow } from "@/components/energy-flow";
import { Section, SectionHead } from "@/components/ui-bits";
import { WHATSAPP_EXIBICAO, linkWhatsApp } from "@/lib/contato";

/** Contato: só o WhatsApp (o formulário foi retirado). */
export function Contato() {
  return (
    <Section
      id="contato"
      tone="soft"
      bg={
        <EnergyFlow className="opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      }
    >
      <SectionHead
        eyebrow="Agendamento"
        title="Inicie o seu experimento estratégico"
        lead="Conte rapidamente o seu cenário. Marcelo Teles, Marcos Schneider ou nossa equipe respondem pelo WhatsApp para validar o melhor próximo passo."
      />

      <div className="reveal flex flex-col items-start gap-5">
        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neon inline-flex items-center gap-3 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-ink"
        >
          <MessageCircle size={22} aria-hidden="true" />
          Chamar no WhatsApp
        </a>
        <p className="text-paper/70">
          ou salve o WhatsApp <span className="font-semibold text-paper">{WHATSAPP_EXIBICAO}</span>
        </p>
      </div>
    </Section>
  );
}
