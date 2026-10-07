import { createFileRoute } from "@tanstack/react-router";

import { tratarAviso } from "@/lib/aviso-lead";

// Chamado pelo banco (Supabase) sempre que um lead novo é gravado.
// Protegido por uma senha compartilhada no cabeçalho `x-webhook-secret`.
async function responder(request: Request) {
  const { status, corpo } = await tratarAviso(request, {
    RESEND_API_KEY: process.env["RESEND_API_KEY"],
    LEAD_WEBHOOK_SECRET: process.env["LEAD_WEBHOOK_SECRET"],
    LEAD_NOTIFY_TO: process.env["LEAD_NOTIFY_TO"],
    LEAD_NOTIFY_FROM: process.env["LEAD_NOTIFY_FROM"],
  });
  return Response.json(corpo, { status, headers: { "Cache-Control": "no-store" } });
}

export const Route = createFileRoute("/api/novo-lead")({
  server: {
    handlers: {
      GET: ({ request }) => responder(request),
      POST: ({ request }) => responder(request),
    },
  },
});
