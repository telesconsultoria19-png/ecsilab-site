import { useState } from "react";

import { Section, SectionHead, PrimaryButton, Field, inputCls } from "@/components/ui-bits";
import { FAIXAS_FATURAMENTO, submitLead } from "@/lib/leads";

export function Contato() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [erro, setErro] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEstado("enviando");
    const r = await submitLead({
      kind: "contato",
      name: String(f.get("nome") ?? ""),
      phone: String(f.get("telefone") ?? ""),
      company: String(f.get("empresa") ?? ""),
      email: String(f.get("email") ?? ""),
      revenue_range: String(f.get("faturamento") ?? ""),
      message: String(f.get("gargalo") ?? ""),
    });
    if (r.ok) setEstado("ok");
    else {
      setErro(r.error);
      setEstado("erro");
    }
  }

  return (
    <Section id="contato" tone="soft">
      <SectionHead
        eyebrow="Agendamento"
        title="Inicie o seu experimento estratégico"
        lead="Conte rapidamente o seu cenário. Marcelo Teles, Marcos Schneider ou nossa equipe falam com você para validar o melhor próximo passo."
      />

      <div className="max-w-2xl rounded-xl border border-line p-6 sm:p-10">
        {estado === "ok" ? (
          <div>
            <h3 className="text-2xl font-bold text-accent">Recebemos o seu pedido</h3>
            <p className="mt-3 text-paper/80">
              Entraremos em contato pelo WhatsApp para alinhar o melhor horário.
            </p>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Seu nome">
                <input name="nome" required className={inputCls} />
              </Field>
              <Field label="WhatsApp de negócios">
                <input name="telefone" type="tel" required className={inputCls} />
              </Field>
              <Field label="Nome da empresa">
                <input name="empresa" required className={inputCls} />
              </Field>
              <Field label="E-mail">
                <input name="email" type="email" required className={inputCls} />
              </Field>
            </div>
            <Field label="Faturamento médio mensal">
              <select name="faturamento" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Selecione uma faixa
                </option>
                {FAIXAS_FATURAMENTO.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Resumo do seu gargalo comercial ou operacional">
              <textarea name="gargalo" rows={4} className={inputCls} />
            </Field>

            {estado === "erro" && (
              <p className="text-sm text-red-400" role="alert">
                {erro}
              </p>
            )}

            <PrimaryButton type="submit" disabled={estado === "enviando"}>
              {estado === "enviando" ? "Enviando..." : "Agendar diagnóstico"}
            </PrimaryButton>
          </form>
        )}
      </div>
    </Section>
  );
}
