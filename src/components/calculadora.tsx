import { useState } from "react";

import { Section, SectionHead } from "@/components/ui-bits";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Slider({
  label,
  ajuda,
  valor,
  texto,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  ajuda: string;
  valor: number;
  texto: string;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="font-semibold">{label}</label>
        <output className="text-xl font-extrabold text-accent">{texto}</output>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[#fdca0a]"
      />
      <p className="mt-1 text-sm text-paper/60">{ajuda}</p>
    </div>
  );
}

export function Calculadora() {
  const [cac, setCac] = useState(250);
  const [ticket, setTicket] = useState(1000);
  const [freq, setFreq] = useState(3);

  const ltv = ticket * freq;
  const ratio = ltv / cac;

  const estado =
    ratio < 1
      ? {
          titulo: "Ralo de dinheiro crítico",
          texto:
            "Seu LTV é menor que o seu CAC: você perde dinheiro a cada cliente adquirido. A operação precisa de estruturação urgente de processos e oferta para aumentar valor e recorrência.",
          cor: "text-red-400",
        }
      : ratio < 3
        ? {
            titulo: "Zona de alerta e baixo retorno",
            texto:
              "Seu LTV cobre o CAC, mas a margem é apertada e não sustenta os custos gerais. Escalar verba nessas condições, sem consertar os processos, pode quebrar o negócio.",
            cor: "text-accent",
          }
        : {
            titulo: "Máquina de crescimento viável",
            texto:
              "Seu LTV é sustentável e o CAC está otimizado. Há saúde financeira para investir em aquisição e crescer, desde que a operação aguente as entregas sem gargalos.",
            cor: "text-green-400",
          };

  return (
    <Section id="calculadora">
      <SectionHead
        eyebrow="Simulação de saúde financeira"
        title={
          <>
            Calculadora do <span className="text-accent">“ralo de dinheiro”</span> (CAC × LTV)
          </>
        }
        lead="Informe seus números médios e veja se a verba de marketing gera um ativo sustentável ou só movimento."
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8 rounded-xl border border-line p-6 sm:p-8">
          <Slider
            label="Custo de aquisição (CAC)"
            ajuda="Quanto você gasta em marketing e vendas para trazer 1 cliente."
            valor={cac}
            texto={brl(cac)}
            min={50}
            max={2000}
            step={50}
            onChange={setCac}
          />
          <Slider
            label="Ticket médio"
            ajuda="O valor médio de uma venda."
            valor={ticket}
            texto={brl(ticket)}
            min={100}
            max={10000}
            step={100}
            onChange={setTicket}
          />
          <Slider
            label="Frequência de compra (por ano)"
            ajuda="Quantas vezes o mesmo cliente compra de você em 1 ano."
            valor={freq}
            texto={`${freq} ${freq === 1 ? "vez" : "vezes"}`}
            min={1}
            max={12}
            step={1}
            onChange={setFreq}
          />
        </div>

        <div className="flex flex-col rounded-xl border border-line p-6 sm:p-8">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-paper/60">LTV anual</dt>
              <dd className="text-3xl font-extrabold">{brl(ltv)}</dd>
            </div>
            <div>
              <dt className="text-sm text-paper/60">Relação LTV / CAC</dt>
              <dd className={`text-3xl font-extrabold ${estado.cor}`}>{ratio.toFixed(1)}x</dd>
            </div>
          </dl>
          <h3 className={`mt-8 text-2xl font-bold ${estado.cor}`}>{estado.titulo}</h3>
          <p className="mt-3 leading-relaxed text-paper/80">{estado.texto}</p>
          <p className="mt-auto pt-8 text-sm text-paper/60">
            LTV = ticket médio × frequência anual. Estimativa simplificada, sem margem nem churn.
          </p>
          <a
            href="#contato"
            className="mt-4 rounded-md bg-accent px-6 py-3.5 text-center font-semibold text-ink hover:opacity-90"
          >
            Ver o diagnóstico completo
          </a>
        </div>
      </div>
    </Section>
  );
}
