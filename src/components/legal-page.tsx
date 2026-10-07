import { Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dataLegal, RESPONSAVEL, type DocumentoLegal } from "@/lib/legal";

/** Layout comum da Política de Privacidade e dos Termos de Uso. */
export function LegalPage({
  doc,
  outro,
}: {
  doc: DocumentoLegal;
  outro: { to: "/politica-de-privacidade" | "/termos-de-uso"; rotulo: string };
}) {
  const r = RESPONSAVEL;
  const identificacao = [
    ["Responsável", r.nome],
    ["Razão social", r.razaoSocial],
    ["CNPJ", r.cnpj],
    ["Endereço", r.endereco],
    ["E-mail", r.email],
    ["WhatsApp", r.whatsapp],
    ["Site", r.site],
  ].filter(([, v]) => v);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Atualizado em {dataLegal()}
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{doc.titulo}</h1>
        <p className="mt-4 text-lg leading-relaxed text-paper/75">{doc.resumo}</p>

        <nav aria-label="Neste documento" className="glow-card mt-10 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-paper/60">Neste documento</p>
          <ol className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {doc.secoes.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-paper/85 hover:text-accent">
                  {s.titulo}
                </a>
              </li>
            ))}
            <li>
              <a href="#contato-legal" className="text-paper/85 hover:text-accent">
                Contato e identificação
              </a>
            </li>
          </ol>
        </nav>

        <div className="mt-12 space-y-10">
          {doc.secoes.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold leading-snug">{s.titulo}</h2>
              <div className="mt-4 space-y-4 leading-7 text-paper/80">
                {s.paragrafos?.map((p) => <p key={p}>{p}</p>)}
                {s.itens && (
                  <ul className="space-y-2">
                    {s.itens.map((i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.depois?.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          ))}

          <section id="contato-legal" className="glow-card scroll-mt-24 p-7">
            <h2 className="text-2xl font-bold">Contato e identificação</h2>
            <p className="mt-3 leading-7 text-paper/80">
              Para dúvidas, pedidos sobre os seus dados ou para exercer os seus direitos, use o{" "}
              <a href="/#contato" className="font-semibold text-accent hover:underline">
                formulário de contato do Site
              </a>
              {r.email ? " ou o e-mail abaixo." : "."}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {identificacao.map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-28 shrink-0 font-semibold text-paper">{k}</dt>
                  <dd className="text-paper/80">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <p className="mt-12 pt-6 text-sm text-paper/60">
          Leia também:{" "}
          <Link to={outro.to} className="font-semibold text-accent hover:underline">
            {outro.rotulo}
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
