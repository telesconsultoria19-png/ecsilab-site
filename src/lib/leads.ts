import { VERSAO_LEGAL } from "./legal";
import { supabase } from "./supabase";

export type LeadKind = "contato" | "diagnostico" | "calculadora" | "solucao" | "material";

export type LeadInput = {
  kind: LeadKind;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  revenue_range?: string;
  message?: string;
  solution_slug?: string;
  payload?: Record<string, unknown>;
};

export type LeadResult = { ok: true } | { ok: false; error: string };

/**
 * Grava um lead no Supabase. Sem Supabase configurado, só aceita em
 * desenvolvimento (para testar o fluxo); em produção avisa que o envio
 * está indisponível, em vez de fingir que gravou.
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  if (!supabase) {
    if (import.meta.env.DEV) {
      console.info("[lead - modo dev, não gravado]", input);
      return { ok: true };
    }
    return { ok: false, error: "O envio está indisponível no momento. Tente novamente em instantes." };
  }

  const { error } = await supabase.from("leads").insert({
    kind: input.kind,
    name: input.name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    company: input.company ?? null,
    revenue_range: input.revenue_range ?? null,
    message: input.message ?? null,
    solution_slug: input.solution_slug ?? null,
    payload: {
      ...(input.payload ?? {}),
      aceite: { politica: VERSAO_LEGAL, termos: VERSAO_LEGAL, em: new Date().toISOString() },
    },
    source_path: typeof window !== "undefined" ? window.location.pathname : null,
  });

  if (error) {
    console.error(error);
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes." };
  }
  return { ok: true };
}

export const FAIXAS_FATURAMENTO = [
  "Até R$ 50 mil / mês",
  "De R$ 50 mil a R$ 100 mil / mês",
  "De R$ 100 mil a R$ 500 mil / mês",
  "Acima de R$ 500 mil / mês",
] as const;
