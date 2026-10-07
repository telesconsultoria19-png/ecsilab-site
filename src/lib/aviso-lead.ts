import { SOLUCOES } from "./solucoes.ts";

/** Variáveis lidas a cada requisição (no Cloudflare, vêm dos "Runtime secrets"). */
export type EnvAviso = {
  RESEND_API_KEY?: string | undefined;
  LEAD_WEBHOOK_SECRET?: string | undefined;
  /** Um ou mais e-mails, separados por vírgula. */
  LEAD_NOTIFY_TO?: string | undefined;
  /** Remetente. Padrão: o remetente de teste do Resend. */
  LEAD_NOTIFY_FROM?: string | undefined;
};

type Lead = {
  id?: string;
  created_at?: string;
  kind?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  revenue_range?: string | null;
  message?: string | null;
  solution_slug?: string | null;
  payload?: Record<string, unknown> | null;
  source_path?: string | null;
};

const TIPOS = ["contato", "diagnostico", "calculadora", "solucao", "material"];
const ROTULO: Record<string, string> = {
  contato: "Pedido de diagnóstico",
  diagnostico: "Diagnóstico de gargalo concluído",
  calculadora: "Calculadora",
  solucao: "Interesse em solução de IA",
  material: "Material baixado",
};
const RESULTADO: Record<string, string> = {
  traffic: "Aquisição e tráfego",
  conversion: "Conversão comercial e escala",
  process: "Operação e processos",
};
const EMAIL_OK = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;
const LIMITE_BYTES = 20_000;

export function escaparHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Comparação de senhas em tempo constante (compara os hashes, não o texto). */
export async function senhaConfere(recebida: string, esperada: string) {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(recebida)),
    crypto.subtle.digest("SHA-256", enc.encode(esperada)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let dif = 0;
  for (let i = 0; i < x.length; i++) dif |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return dif === 0;
}

function linkWhatsApp(telefone: string) {
  const d = telefone.replace(/\D/g, "");
  if (d.length < 10 || d.length > 13) return null;
  return `https://wa.me/${d.startsWith("55") && d.length >= 12 ? d : `55${d}`}`;
}

export function montarEmail(lead: Lead) {
  const kind = lead.kind ?? "contato";
  const solucao = SOLUCOES.find((s) => s.slug === lead.solution_slug);
  const quem = lead.company || lead.name || lead.email || "sem nome";
  const resultado = typeof lead.payload?.["resultado"] === "string" ? RESULTADO[lead.payload["resultado"]] : undefined;

  const assunto =
    kind === "solucao"
      ? `Novo lead: interesse em ${solucao?.nome ?? lead.solution_slug ?? "solução"} (${quem})`
      : kind === "diagnostico"
        ? `Novo lead: diagnóstico concluído${resultado ? ` (${resultado})` : ""} · ${quem}`
        : `Novo lead: ${ROTULO[kind] ?? kind} · ${quem}`;

  const linhas: Array<[string, string]> = [
    ["Tipo", ROTULO[kind] ?? kind],
    ["Nome", lead.name ?? ""],
    ["Empresa", lead.company ?? ""],
    ["E-mail", lead.email ?? ""],
    ["WhatsApp", lead.phone ?? ""],
    ["Faturamento", lead.revenue_range ?? ""],
    ["Solução", solucao ? `${solucao.nome} (${solucao.tipo})` : (lead.solution_slug ?? "")],
    ["Resultado do diagnóstico", resultado ?? ""],
    ["Mensagem", lead.message ?? ""],
    ["Página", lead.source_path ?? ""],
    ["Recebido em", lead.created_at ? new Date(lead.created_at).toLocaleString("pt-BR", { timeZone: "America/Belem" }) : ""],
  ];
  const preenchidas = linhas.filter(([, v]) => v);

  const wa = lead.phone ? linkWhatsApp(lead.phone) : null;
  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#000;font-family:Arial,Helvetica,sans-serif;color:#fff">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#fdca0a">Écsilab · novo lead</p>
  <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3">${escaparHtml(assunto.replace(/^Novo lead: /, ""))}</h1>
  <table style="width:100%;border-collapse:collapse;font-size:15px">
    ${preenchidas
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;color:#9a9a9a;white-space:nowrap">${escaparHtml(k)}</td><td style="padding:8px 0;color:#fff;white-space:pre-wrap">${escaparHtml(v)}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:24px 0 0">
    ${wa ? `<a href="${wa}" style="display:inline-block;margin-right:8px;background:#fdca0a;color:#000;font-weight:bold;text-decoration:none;padding:10px 16px;border-radius:8px">Chamar no WhatsApp</a>` : ""}
    ${lead.email && EMAIL_OK.test(lead.email) ? `<a href="mailto:${encodeURI(lead.email)}" style="display:inline-block;color:#fdca0a;text-decoration:none;padding:10px 0">Responder por e-mail</a>` : ""}
  </p>
  <p style="margin:24px 0 0;font-size:12px;color:#777">Todos os leads: Supabase, tabela “leads”.</p>
</div></body></html>`;

  const texto = [`Écsilab · novo lead`, assunto.replace(/^Novo lead: /, ""), "", ...preenchidas.map(([k, v]) => `${k}: ${v}`), wa ? `\nWhatsApp: ${wa}` : ""].join("\n");

  return { assunto, html, texto };
}

type Resposta = { status: number; corpo: Record<string, unknown> };

/** Recebe o aviso do banco e dispara o e-mail. `fetchFn` existe para permitir testes. */
export async function tratarAviso(
  request: Request,
  env: EnvAviso,
  fetchFn: typeof fetch = fetch,
): Promise<Resposta> {
  if (request.method !== "POST") return { status: 405, corpo: { erro: "método não permitido" } };

  const segredo = env.LEAD_WEBHOOK_SECRET;
  const chave = env.RESEND_API_KEY;
  const destinos = (env.LEAD_NOTIFY_TO ?? "").split(",").map((e) => e.trim()).filter((e) => EMAIL_OK.test(e));
  if (!segredo || !chave || destinos.length === 0) {
    console.error("[aviso-lead] configuração incompleta (faltam variáveis do aviso)");
    return { status: 500, corpo: { erro: "serviço não configurado" } };
  }

  const enviada = request.headers.get("x-webhook-secret") ?? "";
  if (!(await senhaConfere(enviada, segredo))) return { status: 401, corpo: { erro: "não autorizado" } };

  const bruto = await request.text();
  if (bruto.length > LIMITE_BYTES) return { status: 413, corpo: { erro: "conteúdo grande demais" } };

  let dados: { type?: string; record?: Lead };
  try {
    dados = JSON.parse(bruto);
  } catch {
    return { status: 400, corpo: { erro: "json inválido" } };
  }
  const lead = dados.record;
  if (dados.type !== "INSERT" || !lead || !TIPOS.includes(lead.kind ?? "")) {
    return { status: 400, corpo: { erro: "evento inesperado" } };
  }

  const { assunto, html, texto } = montarEmail(lead);
  const resp = await fetchFn("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.LEAD_NOTIFY_FROM || "ecsilab <onboarding@resend.dev>",
      to: destinos,
      subject: assunto,
      html,
      text: texto,
      ...(lead.email && EMAIL_OK.test(lead.email) ? { reply_to: lead.email } : {}),
    }),
  });

  if (!resp.ok) {
    console.error(`[aviso-lead] o Resend recusou o envio (status ${resp.status})`);
    return { status: 502, corpo: { erro: "falha ao enviar o e-mail" } };
  }
  return { status: 200, corpo: { ok: true } };
}
