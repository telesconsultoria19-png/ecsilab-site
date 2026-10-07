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

/**
 * O endereço técnico (workers.dev) mostra o mesmo conteúdo do site oficial.
 * Pedimos aos buscadores que não o indexem, para só o ecsilab.com.br aparecer no Google.
 */
export function marcarNoindexEmEnderecoTecnico(request: Request, response: Response): Response {
  if (!new URL(request.url).hostname.endsWith(".workers.dev")) return response;
  const nova = new Response(response.body, response);
  nova.headers.set("X-Robots-Tag", "noindex, nofollow");
  return nova;
}
