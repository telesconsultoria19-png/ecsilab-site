import { useState } from "react";

import { Section, SectionHead, PrimaryButton, Field, inputCls } from "@/components/ui-bits";
import { submitLead } from "@/lib/leads";
import { CATEGORIAS, SOLUCOES, type Solucao } from "@/lib/solucoes";

function Interesse({ solucao, onClose }: { solucao: Solucao; onClose: () => void }) {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [erro, setErro] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEstado("enviando");
    const r = await submitLead({
      kind: "solucao",
      solution_slug: solucao.slug,
      name: String(f.get("nome") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("telefone") ?? ""),
      company: String(f.get("empresa") ?? ""),
    });
    if (r.ok) setEstado("ok");
    else {
      setErro(r.error);
      setEstado("erro");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Interesse em ${solucao.nome}`}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-line bg-ink p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Quero esta solução</p>
        <h3 className="mt-2 text-2xl font-bold">{solucao.nome}</h3>

        {estado === "ok" ? (
          <>
            <p className="mt-6 text-paper/80">
              Recebemos o seu interesse. Nossa equipe entrará em contato para entender o seu cenário.
            </p>
            <button onClick={onClose} className="mt-6 text-accent hover:underline">
              Fechar
            </button>
          </>
        ) : (
          <form onSubmit={enviar} className="mt-6 space-y-4">
            <Field label="Seu nome">
              <input name="nome" required className={inputCls} />
            </Field>
            <Field label="E-mail">
              <input name="email" type="email" required className={inputCls} />
            </Field>
            <Field label="WhatsApp">
              <input name="telefone" type="tel" required className={inputCls} />
            </Field>
            <Field label="Empresa">
              <input name="empresa" required className={inputCls} />
            </Field>
            {estado === "erro" && (
              <p className="text-sm text-red-400" role="alert">
                {erro}
              </p>
            )}
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={onClose} className="text-paper/70 hover:text-accent">
                Cancelar
              </button>
              <PrimaryButton type="submit" disabled={estado === "enviando"}>
                {estado === "enviando" ? "Enviando..." : "Enviar"}
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function SolucoesIA() {
  const [aberta, setAberta] = useState<Solucao | null>(null);

  return (
    <Section id="solucoes-ia">
      <SectionHead
        eyebrow="Portfólio ecsilab"
        title="Soluções de inteligência artificial para a sua operação"
        lead="Soluções prontas que implantamos na sua empresa, uma a uma ou em pacotes, para ganhar velocidade em vendas, atendimento, finanças e gestão."
      />

      <div className="space-y-14">
        {CATEGORIAS.map((cat) => (
          <div key={cat}>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-accent">{cat}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SOLUCOES.filter((s) => s.categoria === cat).map((s) => (
                <article key={s.slug} className="flex flex-col rounded-xl border border-line p-6">
                  <h4 className="text-lg font-bold">{s.nome}</h4>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-paper/70">{s.descricao}</p>
                  <button
                    type="button"
                    onClick={() => setAberta(s)}
                    className="mt-5 self-start text-sm font-semibold text-accent hover:underline"
                  >
                    Quero esta solução →
                  </button>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-paper/70">
        Precisa de mais de uma? Montamos um pacote sob medida para o seu cenário.{" "}
        <a href="#contato" className="font-semibold text-accent hover:underline">
          Fale com a gente
        </a>
        .
      </p>

      {aberta && <Interesse solucao={aberta} onClose={() => setAberta(null)} />}
    </Section>
  );
}
