import { useState } from "react";

import { AceitePrivacidade } from "@/components/aceite-privacidade";
import { Funil } from "@/components/animated-icons";
import { GlowCard, Section, SectionHead, PrimaryButton, inputCls } from "@/components/ui-bits";
import { submitLead } from "@/lib/leads";

type Cat = "traffic" | "conversion" | "process";
type Pergunta = { q: string; opcoes: Array<{ t: string; c: Cat }> };
type Resultado = Record<Cat, { titulo: string; texto: string }>;

type Nivel = {
  id: "inicio" | "crescimento" | "estruturado";
  rotulo: string;
  descricao: string;
  perguntas: Pergunta[];
  resultados: Resultado;
  recomendacao: string;
};

const RESULTADOS_ESTRUTURADO: Resultado = {
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

const RECOMENDACAO_PADRAO =
  "Estruturamos e rodamos o processo ágil de marketing e vendas da sua empresa, com governança por OKR, para quebrar esse gargalo.";

const NIVEIS: Nivel[] = [
  {
    id: "inicio",
    rotulo: "Estou começando",
    descricao: "Poucos clientes, vendas por contato direto ou indicação, sem anúncios nem sistema ainda.",
    perguntas: [
      {
        q: "Qual é o seu maior desafio hoje?",
        opcoes: [
          { t: "Não consigo encontrar novos clientes ou conseguir recomendações.", c: "traffic" },
          { t: "Converso com interessados, mas poucos viram clientes.", c: "conversion" },
          { t: "Vendo, mas me atrapalho para entregar e organizar o dia a dia.", c: "process" },
        ],
      },
      {
        q: "Como as pessoas conhecem o seu negócio hoje?",
        opcoes: [
          { t: "Quase ninguém conhece, fora do meu círculo de amigos e família.", c: "traffic" },
          { t: "Chegam por indicação, mas de forma irregular.", c: "traffic" },
          { t: "Tenho Instagram ou WhatsApp ativos, mas poucos viram clientes.", c: "conversion" },
        ],
      },
      {
        q: "Como você controla suas vendas e seus clientes?",
        opcoes: [
          { t: "Na memória e no WhatsApp, sem nenhum registro.", c: "process" },
          { t: "Em caderno ou planilha simples, que eu quase não atualizo.", c: "process" },
          { t: "Tenho algum controle, mas ainda não sei quais números olhar.", c: "conversion" },
        ],
      },
    ],
    resultados: {
      traffic: {
        titulo: "Chegar até os primeiros clientes",
        texto:
          "O seu maior obstáculo agora é ser encontrado. Falta um caminho simples e constante para que as pessoas certas conheçam o seu negócio, em vez de depender da sorte e de indicações esporádicas.",
      },
      conversion: {
        titulo: "Transformar conversas em vendas",
        texto:
          "Já existe interesse, mas ele não vira dinheiro. Faltam uma abordagem clara, um acompanhamento dos contatos e uma oferta bem apresentada para fechar mais.",
      },
      process: {
        titulo: "Organizar a casa para crescer",
        texto:
          "Você já vende, mas sem um jeito de fazer as coisas. Antes de buscar mais clientes, vale montar uma rotina simples de vendas e entrega, para crescer sem se perder.",
      },
    },
    recomendacao:
      "Montamos o básico bem feito: posicionamento, presença digital e um processo simples de vendas, para você começar a crescer com previsibilidade.",
  },
  {
    id: "crescimento",
    rotulo: "Em crescimento",
    descricao: "Já vendo com regularidade e tenho presença digital, mas ainda sem processo definido.",
    perguntas: [
      {
        q: "Qual o seu principal desafio comercial hoje?",
        opcoes: [
          { t: "Os contatos que chegam são poucos e instáveis.", c: "traffic" },
          { t: "Chegam contatos, mas poucos fecham.", c: "conversion" },
          { t: "Fecho, mas a entrega e a rotina ficam desorganizadas conforme eu cresço.", c: "process" },
        ],
      },
      {
        q: "Como você atrai clientes hoje?",
        opcoes: [
          { t: "Impulsiono posts ou anúncios sem acompanhar o custo por cliente.", c: "traffic" },
          { t: "Rodo algumas campanhas, mas sem rotina de acompanhamento e escala.", c: "conversion" },
          { t: "Dependo de indicações e do boca a boca.", c: "traffic" },
        ],
      },
      {
        q: "Sua empresa tem processos comerciais definidos?",
        opcoes: [
          { t: "Não. Tudo está na cabeça das pessoas ou em planilhas soltas.", c: "process" },
          { t: "Temos um sistema ou CRM, mas a equipe não atualiza.", c: "process" },
          { t: "Temos uma rotina, mas o crescimento está bagunçando tudo.", c: "conversion" },
        ],
      },
    ],
    resultados: RESULTADOS_ESTRUTURADO,
    recomendacao: RECOMENDACAO_PADRAO,
  },
  {
    id: "estruturado",
    rotulo: "Já estruturado",
    descricao: "Invisto em tráfego pago, tenho CRM e equipe comercial, e quero escalar com previsibilidade.",
    perguntas: [
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
    ],
    resultados: RESULTADOS_ESTRUTURADO,
    recomendacao: RECOMENDACAO_PADRAO,
  },
];

function decidir(score: Record<Cat, number>): Cat {
  // Empate: conversão > processo > tráfego.
  if (score.conversion >= score.traffic && score.conversion >= score.process) return "conversion";
  if (score.process >= score.traffic && score.process >= score.conversion) return "process";
  return "traffic";
}

export function Diagnostico() {
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState<Array<number | undefined>>([]);
  const [aviso, setAviso] = useState(false);
  const [resultado, setResultado] = useState<Cat | null>(null);
  const [email, setEmail] = useState("");
  const [aceite, setAceite] = useState(false);
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");

  const perguntas = nivel?.perguntas ?? [];
  const pergunta = perguntas[passo];
  const ultima = passo === perguntas.length - 1;

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
    perguntas.forEach((p, i) => {
      const r = respostas[i];
      if (r !== undefined) score[p.opcoes[r]!.c] += 1;
    });
    setResultado(decidir(score));
  }

  function escolherNivel(n: Nivel) {
    setNivel(n);
    setPasso(0);
    setRespostas([]);
    setAviso(false);
  }

  function refazer() {
    setNivel(null);
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
      payload: { nivel: nivel?.id, resultado, respostas },
    });
    setEstado(r.ok ? "ok" : "erro");
  }

  return (
    <Section id="diagnostico" tone="soft">
      <SectionHead
        eyebrow="Autoavaliação de maturidade"
        title="Descubra o gargalo de crescimento do seu negócio"
        lead="Baseado na Teoria das Restrições. Escolha o momento do seu negócio, responda a três perguntas e veja onde o seu crescimento está travado."
      />

      <GlowCard className="max-w-3xl p-6 sm:p-10">
        {!nivel && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Antes de começar</p>
            <h3 className="mt-3 text-2xl font-bold">Em que momento está o seu negócio?</h3>
            <div className="mt-6 space-y-3" role="group" aria-label="Nível de maturidade do negócio">
              {NIVEIS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => escolherNivel(n)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-accent/60 hover:bg-accent/[0.06]"
                >
                  <span className="block text-lg font-bold text-paper">{n.rotulo}</span>
                  <span className="mt-1 block text-sm text-paper/70">{n.descricao}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {nivel && !resultado && pergunta && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Pergunta {passo + 1} de {perguntas.length}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNivel(null);
                  setPasso(0);
                  setRespostas([]);
                  setAviso(false);
                }}
                className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-paper/80 transition hover:text-accent"
              >
                {nivel.rotulo} · alterar
              </button>
            </div>
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

        {nivel && resultado && (
          <div>
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
              Restrição crítica detectada
            </span>
            <div className="mt-6 grid items-center gap-8 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-3xl font-extrabold">{nivel.resultados[resultado].titulo}</h3>
                <p className="mt-4 text-lg leading-relaxed text-paper/80">{nivel.resultados[resultado].texto}</p>
              </div>
              <Funil ativa={resultado} />
            </div>

            <div className="mt-8 rounded-xl bg-white/[0.05] p-5">
              <p className="font-semibold text-accent">Solução recomendada pela Écsilab</p>
              <p className="mt-2 text-paper/80">
                {nivel.recomendacao}
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
