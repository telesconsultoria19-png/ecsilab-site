const OFICIAL = "ecsilab.com.br";

/**
 * Garante o endereço oficial: o "www" redireciona (301) para o domínio principal.
 * Qualquer outro endereço (localhost, workers.dev) segue servindo normalmente.
 */
export function redirecionarParaOficial(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname === `www.${OFICIAL}`) {
    url.hostname = OFICIAL;
    url.protocol = "https:";
    url.port = "";
    return new Response(null, { status: 301, headers: { Location: url.toString() } });
  }
  return null;
}
