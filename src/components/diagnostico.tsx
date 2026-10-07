import { useState } from "react";

import { AceitePrivacidade } from "@/components/aceite-privacidade";
import { Funil } from "@/components/animated-icons";
import { GlowCard, Section, SectionHead, PrimaryButton, inputCls } from "@/components/ui-bits";
import { submitLead } from "@/lib/leads";

type Cat = "traffic" | "conversion" | "process";

const PERGUNTAS: Array<{ q: string; opcoes: Array<{ t: string; c: Cat }> }> = [
  {
    q: "Qual o seu principal desafio comercial hoje?",
    opcoes: [
      { t: "Não chegam novos contatos para o comercial.", c: "traffic" },
      { t: "Chegam contatos, mas o comercial não fecha.", c: "conversion" },
      { t: "Fechamos bem, mas a operação interna está caótica ou atrasando.", c: "process" },
    ],
  },
  {
    q: "Como funciona a sua estrutura de tráfego pago?",
    opcoes: [
      { t: "Investimos sem clareza do retorno real e do CAC.", c: "traffic" },
      { t: "Rodamos algumas campanhas, mas sem processo de escala.", c: "conversion" },
      { t: "Não rodamos anúncios e dependemos de indicações esporádicas.", c: "traffic" },
    ],
  },
  {
    q: "Sua empresa tem processos comerciais documentados?",
    opcoes: [
      { t: "Nenhum. Tudo está na cabeça das pessoas ou em planilhas soltas.", c: "process" },
      { t: "Temos CRM, mas ninguém atualiza e operamos sem rotina.", c: "process" },
      { t: "Sim, mas sentimos que o crescimento está bagunçando tudo.", c: "conversion" },
    ],
  },
];

const RESULTADOS: Record<Cat, { titulo: string; texto: string }> = {
  traffic: {
    titulo: "Aquisição e tráfego",
    texto:
      "O seu principal problema está no topo do funil. Você deixa dinheiro na mesa por falta de canais de aquisição previsíveis e otimizados.",
  },
  conversion: {
    titulo: "Conversão comercial e escala",
    texto:
      "Seu marketing atrai pessoas, mas o comercial não tem script, follow-up e ferramentas organizadas para fechar. O dinheiro escorre no atendimento.",
  },
  process: {
    titulo: "Operação e processos",
    texto:
      "Você consegue vender, mas a entrega está sem padrão e dependente de pessoas. Crescer hoje significa bagunçar e estressar a equipe. Falta engenharia de processos antes de trazer mais demanda.",
  },
};

function decidir(score: Record<Cat, number>): Cat {
  // Empate: conversão > processo > tráfego.
  if (score.conversion >= score.traffic && score.conversion >= score.process) return "conversion";
  if (score.process >= score.traffic && score.process >= score.conversion) return "process";
  return "traffic";
}

export function Diagnostico() {
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<Array<number | undefined>>([]);
  const [aviso, setAviso] = useState(false);
  const [resultado, setResultado] = useState<Cat | null>(null);
  const [email, setEmail] = useState("");
  const [aceite, setAceite] = useState(false);
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");

  const pergunta = PERGUNTAS[passo];
  const ultima = passo === PERGUNTAS.length - 1;

  function avancar() {
    if (respostas[passo] === undefined) {
      setAviso(true);
      return;
    }
    setAviso(false);
    if (!ultima) {
      setPasso(passo + 1);
      return;
    }
    const score: Record<Cat, number> = { traffic: 0, conversion: 0, process: 0 };
    PERGUNTAS.forEach((p, i) => {
      const r = respostas[i];
      if (r !== undefined) score[p.opcoes[r]!.c] += 1;
    });
    setResultado(decidir(score));
  }

  function refazer() {
    setPasso(0);
    setRespostas([]);
    setResultado(null);
    setAviso(false);
    setEstado("idle");
    setAceite(false);
  }

  async function enviarEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!resultado) return;
    setEstado("enviando");
    const r = await submitLead({
      kind: "diagnostico",
      email,
      payload: { resultado, respostas },
    });
    setEstado(r.ok ? "ok" : "erro");
  }

  return (
    <Section id="diagnostico" tone="soft">
      <SectionHead
        eyebrow="Autoavaliação de maturidade"
        title="Descubra o gargalo de escala do seu negócio"
        lead="Baseado na Teoria das Restrições. Responda a três perguntas e veja onde o seu crescimento está travado."
      />

      <GlowCard className="max-w-3xl p-6 sm:p-10">
        {!resultado && pergunta && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Pergunta {passo + 1} de {PERGUNTAS.length}
            </p>
            <h3 className="mt-3 text-2xl font-bold">{pergunta.q}</h3>

            <div className="mt-6 space-y-3" role="radiogroup" aria-label={pergunta.q}>
              {pergunta.opcoes.map((o, i) => {
                const ativo = respostas[passo] === i;
                return (
                  <button
                    key={o.t}
                    type="button"
                    role="radio"
                    aria-checked={ativo}
                    onClick={() => {
                      const novo = [...respostas];
                      novo[passo] = i;
                      setRespostas(novo);
                      setAviso(false);
                    }}
                    className={`w-full rounded-xl border px-5 py-4 text-left transition ${
                      ativo
                        ? "border-accent/70 bg-accent/10 text-paper shadow-[0_0_30px_-10px_rgba(253,202,10,0.7)]"
                        : "border-white/10 bg-white/[0.03] text-paper/85 hover:border-accent/50"
                    }`}
                  >
                    {o.t}
                  </button>
                );
              })}
            </div>

            {aviso && (
              <p className="mt-4 text-sm text-accent" role="alert">
                Selecione uma opção para poder avançar.
              </p>
            )}

            <div className="mt-8 flex items-center justify-between">
              {passo > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setPasso(passo - 1);
                    setAviso(false);
                  }}
                  className="text-paper/70 hover:text-accent"
                >
                  Voltar
                </button>
              ) : (
                <span />
              )}
              <PrimaryButton type="button" onClick={avancar}>
                {ultima ? "Gerar diagnóstico" : "Avançar"}
              </PrimaryButton>
            </div>
          </>
        )}

        {resultado && (
          <div>
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
              Restrição crítica detectada
            </span>
            <div className="mt-6 grid items-center gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-3xl font-extrabold">{RESULTADOS[resultado].titulo}</h3>
                <p className="mt-4 text-lg leading-relaxed text-paper/80">{RESULTADOS[resultado].texto}</p>
              </div>
              <Funil ativa={resultado} />
            </div>

            <div className="mt-8 rounded-xl bg-white/[0.05] p-5">
              <p className="font-semibold text-accent">Solução recomendada pela Écsilab</p>
              <p className="mt-2 text-paper/80">
                Estruturamos e rodamos o processo ágil de marketing e vendas da sua empresa, com
                governança por OKR, para quebrar esse gargalo.
              </p>
            </div>

            {estado !== "ok" ? (
              <form onSubmit={enviarEmail} className="mt-8 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail para receber este resultado"
                    className={inputCls}
                  />
                  <PrimaryButton type="submit" disabled={estado === "enviando"}>
                    {estado === "enviando" ? "Enviando..." : "Receber"}
                  </PrimaryButton>
                </div>
                <AceitePrivacidade checked={aceite} onChange={setAceite} />
              </form>
            ) : (
              <p className="mt-8 text-accent">Recebemos o seu e-mail. Entraremos em contato.</p>
            )}
            {estado === "erro" && (
              <p className="mt-3 text-sm text-red-400" role="alert">
                Não foi possível enviar agora. Tente novamente em instantes.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contato"
                className="btn-neon rounded-xl bg-accent px-6 py-3.5 text-center font-semibold text-ink"
              >
                Quebrar esse gargalo agora
              </a>
              <button
                type="button"
                onClick={refazer}
                className="rounded-xl bg-white/[0.06] px-6 py-3.5 font-semibold transition hover:bg-white/10 hover:text-accent"
              >
                Refazer teste
              </button>
            </div>
          </div>
        )}
      </GlowCard>
    </Section>
  );
}
