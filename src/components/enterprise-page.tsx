import { Check, Minus, Plus } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import { MotionDepartamentos } from "@/components/motion-departamentos";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Eyebrow, GlowCard, Section, SectionHead } from "@/components/ui-bits";
import { linkWhatsApp } from "@/lib/contato";
import {
  COMPARATIVO,
  DEPARTAMENTOS,
  ETAPAS,
  FICA_COM_VOCE,
  FORA_DO_PROJETO,
  PARA_QUEM,
  PERGUNTAS,
  type Departamento,
} from "@/lib/enterprise";

const MSG_GERAL =
  "Olá! Vim pela página Enterprise da Écsilab e quero conversar sobre automatizar um departamento da minha empresa.";
const msgDepartamento = (nome: string) =>
  `Olá! Vim pela página Enterprise da Écsilab e tenho interesse em "${nome}" para a minha empresa. Podemos conversar?`;

const BOTAO_PRIMARIO = "btn-neon rounded-xl bg-accent px-7 py-4 text-center font-semibold text-ink";

const TEXTO_HERO =
  "Projetamos, construímos e deixamos rodando a automação de departamentos inteiros da sua empresa. Não é assinatura: é infraestrutura própria, em nome da sua empresa, sem mensalidade nossa para continuar funcionando.";

const reduzMovimento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Abertura da hero: o título entra em blocos, grande e centralizado; depois vai para a esquerda, a animação dos
 * departamentos começa à direita e o parágrafo é escrito. O HTML do servidor já traz tudo no estado final
 * (sem JavaScript, ou com "reduzir movimento", nada se move).
 */
function Hero() {
  const secaoRef = useRef<HTMLElement>(null);
  const blocosRef = useRef<Array<HTMLSpanElement | null>>([]);
  const [fase, setFase] = useState<"final" | "titulo" | "escrevendo">("final");
  const [escrito, setEscrito] = useState(TEXTO_HERO.length);
  const [animacao, setAnimacao] = useState(true);

  useLayoutEffect(() => {
    if (reduzMovimento()) return;
    const secao = secaoRef.current;
    const blocos = blocosRef.current.filter((b): b is HTMLSpanElement => !!b);
    if (!secao || blocos.length === 0) return;
    setFase("titulo");
    setEscrito(0);
    setAnimacao(false);
    blocos.forEach((b) => {
      b.style.transition = "none";
      b.style.opacity = "0";
    });

    const timers: number[] = [];
    const em = (ms: number, f: () => void) => timers.push(window.setTimeout(f, ms));
    let cancelado = false;
    const iniciar = () => {
      if (cancelado) return;
      // posição inicial de cada bloco: grande e empilhado no centro da seção
      const rs = secao.getBoundingClientRect();
      const alvos = blocos.map((b) => b.getBoundingClientRect());
      const maior = Math.max(...alvos.map((r) => r.width));
      const escala = Math.min(1.45, (rs.width - 32) / maior);
      const alturas = alvos.map((r) => r.height * escala);
      const total = alturas.reduce((a, b) => a + b, 0);
      const topo = Math.max(rs.top, 64);
      const base = Math.min(rs.bottom, window.innerHeight);
      let y = (topo + base) / 2 - total / 2;
      blocos.forEach((b, i) => {
        const r = alvos[i];
        const h = alturas[i];
        if (!r || h === undefined) return;
        const dx = rs.left + rs.width / 2 - (r.left + r.width / 2);
        const dy = y + h / 2 - (r.top + r.height / 2);
        y += h;
        b.style.transition = "none";
        b.style.transform = `translate(${dx}px, ${dy}px) scale(${escala})`;
        b.style.opacity = "0";
        b.style.filter = "blur(10px)";
      });
      secao.getBoundingClientRect(); // força o layout antes de ligar as transições

      blocos.forEach((b, i) => {
        em(250 + i * 750, () => {
          b.style.transition = "opacity .8s ease, filter .8s ease";
          b.style.opacity = "1";
          b.style.filter = "blur(0)";
        });
      });
      const T_MOVE = 250 + blocos.length * 750 + 1100;
      em(T_MOVE, () => {
        blocos.forEach((b) => {
          b.style.transition = "transform 1.1s cubic-bezier(.7,0,.2,1)";
          b.style.transform = "none";
        });
      });
      em(T_MOVE + 900, () => {
        setFase("escrevendo");
        setAnimacao(true);
        let n = 0;
        const id = window.setInterval(() => {
          n += 2;
          setEscrito(Math.min(n, TEXTO_HERO.length));
          if (n >= TEXTO_HERO.length) window.clearInterval(id);
        }, 26);
        timers.push(id);
      });
    };
    // espera fontes e estilos assentarem antes de medir
    const fontes = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontes, new Promise((r) => setTimeout(r, 900))]).then(() => em(80, iniciar));
    return () => {
      cancelado = true;
      timers.forEach((t) => (window.clearTimeout(t), window.clearInterval(t)));
    };
  }, []);

  const pronto = escrito >= TEXTO_HERO.length;
  const revela = `transition-all duration-1000 ${pronto ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`;
  const bloco = "block w-fit max-w-full will-change-transform";

  return (
    <section ref={secaoRef} className="ardosia relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div>
            <div
              className={`transition-opacity duration-700 ${fase === "titulo" ? "opacity-0" : "opacity-100"}`}
            >
              <Eyebrow>Écsilab Enterprise</Eyebrow>
            </div>
            <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl xl:text-6xl">
              <span
                ref={(el) => {
                  blocosRef.current[0] = el;
                }}
                className={bloco}
              >
                Departamentos inteiros operando com IA.
              </span>
              <span
                ref={(el) => {
                  blocosRef.current[1] = el;
                }}
                className={`${bloco} shimmer-text`}
              >
                A infraestrutura é sua,
              </span>
              <span
                ref={(el) => {
                  blocosRef.current[2] = el;
                }}
                className={`${bloco} shimmer-text`}
              >
                para sempre.
              </span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-paper/80 sm:text-xl">
              <span className="relative block">
                <span className="opacity-0">{TEXTO_HERO}</span>
                <span aria-hidden="true" className="absolute inset-0">
                  {TEXTO_HERO.slice(0, escrito)}
                  {!pronto && escrito > 0 && (
                    <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-accent" />
                  )}
                </span>
              </span>
            </p>

            <div className={`mt-10 flex flex-col gap-3 sm:flex-row ${revela}`}>
              <a
                href={linkWhatsApp(MSG_GERAL)}
                target="_blank"
                rel="noopener noreferrer"
                className={BOTAO_PRIMARIO}
              >
                Falar no WhatsApp
              </a>
              <a
                href="#departamentos"
                className="rounded-xl bg-white/[0.06] px-7 py-4 text-center font-semibold text-paper backdrop-blur transition hover:bg-white/10 hover:text-accent"
              >
                Ver os departamentos
              </a>
            </div>
          </div>
          <MotionDepartamentos ativo={animacao} />
        </div>

        <ul
          className={`mt-14 grid gap-3 text-sm text-paper/85 sm:grid-cols-2 lg:grid-cols-4 ${revela}`}
        >
          {[
            "Implantação sob medida",
            "Pagamento único por projeto",
            "Contas e acessos em nome da sua empresa",
            "Documentação e treinamento da equipe",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Comparativo() {
  return (
    <Section id="modelo" tone="soft">
      <SectionHead
        eyebrow="O modelo"
        title={
          <>
            Assinatura aluga. Infraestrutura própria{" "}
            <span className="font-serif font-normal italic text-accent">fica.</span>
          </>
        }
        lead="A maior parte das ferramentas de IA funciona como aluguel: você paga todo mês e, se parar, perde o que construiu. Aqui é o contrário."
      />

      {/* telas grandes: tabela */}
      <div className="reveal hidden md:block">
        <table className="w-full border-separate border-spacing-y-3 text-left">
          <caption className="sr-only">
            Comparação entre assinatura de software e infraestrutura própria
          </caption>
          <thead>
            <tr className="text-sm uppercase tracking-[0.18em]">
              <th scope="col" className="w-[24%] px-5 pb-1 font-semibold text-paper/50">
                <span className="sr-only">Critério</span>
              </th>
              <th scope="col" className="w-[34%] px-5 pb-1 font-semibold text-paper/60">
                Assinatura de software
              </th>
              <th scope="col" className="w-[42%] px-5 pb-1 font-semibold text-accent">
                Infraestrutura própria Écsilab
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARATIVO.map((l) => (
              <tr key={l.tema} className="text-lg">
                <th
                  scope="row"
                  className="rounded-l-2xl bg-white/[0.04] px-5 py-5 font-semibold text-paper"
                >
                  {l.tema}
                </th>
                <td className="bg-white/[0.04] px-5 py-5 text-paper/60">{l.assinatura}</td>
                <td className="rounded-r-2xl bg-accent/[0.09] px-5 py-5 font-semibold text-paper shadow-[inset_0_0_0_1px_rgba(253,202,10,0.22)]">
                  {l.propria}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* celular: um cartão por critério */}
      <div className="grid gap-4 md:hidden">
        {COMPARATIVO.map((l) => (
          <GlowCard key={l.tema} as="article" className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-paper/60">
              {l.tema}
            </h3>
            <p className="mt-4 flex gap-3 text-paper/60">
              <Minus size={18} className="mt-1 shrink-0" aria-hidden="true" />
              <span>
                <span className="sr-only">Assinatura: </span>
                {l.assinatura}
              </span>
            </p>
            <p className="mt-3 flex gap-3 font-semibold text-paper">
              <Check size={18} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <span className="sr-only">Infraestrutura própria: </span>
                {l.propria}
              </span>
            </p>
          </GlowCard>
        ))}
      </div>

      <p className="reveal mt-8 max-w-3xl text-sm text-paper/60">
        Os custos de infraestrutura e de APIs de terceiros continuam existindo, mas são pagos por
        você diretamente aos provedores, em contas da sua empresa.
      </p>
    </Section>
  );
}

function CartaoDepartamento({ d }: { d: Departamento }) {
  return (
    <GlowCard as="article" className="flex flex-col p-7 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {d.componentes.length} soluções integradas
      </p>
      <h4 className="mt-2 text-2xl font-extrabold tracking-tight">{d.nome}</h4>
      <p className="mt-3 leading-relaxed text-paper/75">{d.resumo}</p>

      <ul className="mt-6 space-y-2.5 text-sm text-paper/85">
        {d.componentes.map(([nome, texto]) => (
          <li key={`${nome}-${texto}`} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>
              {nome && <strong className="font-bold text-paper">{nome}</strong>}
              {nome && <span className="text-paper/60">: </span>}
              {texto}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={linkWhatsApp(msgDepartamento(d.nome))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar no WhatsApp sobre ${d.nome}`}
        className="mt-auto self-start pt-8 text-sm font-semibold text-accent hover:underline"
      >
        Quero este departamento, pelo WhatsApp →
      </a>
    </GlowCard>
  );
}

function Departamentos() {
  const corporativos = DEPARTAMENTOS.filter((d) => d.grupo === "corporativo");
  const verticais = DEPARTAMENTOS.filter((d) => d.grupo === "vertical");
  return (
    <Section id="departamentos">
      <SectionHead
        eyebrow="O que implantamos"
        title="Dez departamentos prontos para operar com IA"
        lead="Cada departamento reúne as soluções que, juntas, entregam mais do que a soma das partes. Você pode começar por um e expandir no seu ritmo. Se algum fizer sentido para a sua empresa, a conversa é direta, no WhatsApp."
      />

      <h3 className="reveal mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-paper/60">
        Departamentos corporativos
      </h3>
      <div className="grid gap-5 lg:grid-cols-2">
        {corporativos.map((d) => (
          <CartaoDepartamento key={d.id} d={d} />
        ))}
      </div>

      <h3 className="reveal mb-6 mt-16 text-sm font-semibold uppercase tracking-[0.25em] text-paper/60">
        Verticais de mercado
      </h3>
      <div className="grid gap-5 lg:grid-cols-2">
        {verticais.map((d) => (
          <CartaoDepartamento key={d.id} d={d} />
        ))}
      </div>

      <p className="reveal mt-12 max-w-3xl text-paper/70">
        Não encontrou o departamento que procura? Montamos combinações sob medida.{" "}
        <a
          href={linkWhatsApp(MSG_GERAL)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          Fale com a gente no WhatsApp
        </a>
        .
      </p>
    </Section>
  );
}

function ComoFunciona() {
  return (
    <Section id="como-funciona" tone="soft">
      <SectionHead
        eyebrow="Como funciona"
        title="Do diagnóstico à entrega, em cinco etapas"
        lead="Um projeto com começo, meio e fim. No final, o departamento está rodando e é seu."
      />
      <ol className="grid gap-4 lg:grid-cols-5">
        {ETAPAS.map((e, i) => (
          <li key={e.titulo}>
            <GlowCard className="h-full p-6">
              <p className="text-4xl font-extrabold text-accent drop-shadow-[0_0_14px_rgba(253,202,10,0.45)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg font-bold leading-snug">{e.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">{e.texto}</p>
            </GlowCard>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Propriedade() {
  return (
    <Section id="propriedade">
      <SectionHead
        eyebrow="O que é seu"
        title="Quando o projeto termina, tudo fica com a sua empresa"
        lead="Sem refém de plataforma e sem depender da Écsilab para o departamento continuar funcionando."
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <GlowCard className="p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Fica com a sua empresa
          </h3>
          <ul className="mt-6 space-y-4 text-lg">
            {FICA_COM_VOCE.map((t) => (
              <li key={t} className="flex gap-3">
                <Check size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </GlowCard>
        <GlowCard className="p-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-paper/60">
            Fora do projeto
          </h3>
          <ul className="mt-6 space-y-4 text-paper/80">
            {FORA_DO_PROJETO.map((t) => (
              <li key={t} className="flex gap-3">
                <Minus size={20} className="mt-1 shrink-0 text-paper/50" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-paper/55">
            Os termos exatos de cada projeto constam no contrato.
          </p>
        </GlowCard>
      </div>
    </Section>
  );
}

function ParaQuem() {
  return (
    <Section id="para-quem" tone="soft">
      <SectionHead eyebrow="Para quem é" title="Feito para quem decide pela empresa" />
      <ul className="grid gap-4 sm:grid-cols-2">
        {PARA_QUEM.map((t) => (
          <li key={t}>
            <GlowCard className="flex h-full gap-4 p-6 text-lg">
              <Check size={22} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
              {t}
            </GlowCard>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Perguntas() {
  return (
    <Section id="perguntas">
      <SectionHead eyebrow="Perguntas frequentes" title="O que as diretorias costumam perguntar" />
      <div className="mx-auto max-w-3xl space-y-3">
        {PERGUNTAS.map((q) => (
          <details key={q.p} className="group rounded-2xl bg-white/[0.045] open:bg-white/[0.07]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {q.p}
              <Plus
                size={22}
                className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <p className="px-6 pb-6 leading-relaxed text-paper/75">{q.r}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function ChamadaFinal() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.09] blur-[130px]"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Qual departamento da sua empresa pesa mais hoje?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-paper/75">
          Conte o seu cenário. A conversa é direta, no WhatsApp, com a liderança da Écsilab, e
          termina em uma proposta para o seu departamento.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={linkWhatsApp(MSG_GERAL)}
            target="_blank"
            rel="noopener noreferrer"
            className={BOTAO_PRIMARIO}
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function EnterprisePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Comparativo />
        <Departamentos />
        <ComoFunciona />
        <Propriedade />
        <ParaQuem />
        <Perguntas />
        <ChamadaFinal />
      </main>
      <SiteFooter />
    </>
  );
}
