const ENTREGAS = [
  "Planejamento de marca",
  "Estratégia de brand",
  "Campanha publicitária",
  "Gestão de tráfego pago",
  "Gestão de CRM",
  "Planejamento de conteúdo de marketing",
  "Publicações em carrossel",
  "Gestão do Google Meu Negócio",
  "Estruturação de processos comerciais",
  "Estruturação de time comercial",
  "Planejamento de metas por OKR",
  "Consultoria de growth",
  "Planejamento de expansão",
  "Plano de ação para dominar o mercado",
  "Raio-X do marketing",
  "Inbound marketing",
  "Nutrição de leads por e-mail",
  "Criação de site",
  "Criação de blog",
  "Implantação de ferramentas de IA",
  "Criação de ferramentas para consultores",
];

function Lista({ oculta = false }: { oculta?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" {...(oculta ? { "aria-hidden": true } : {})}>
      {ENTREGAS.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-8 text-sm font-semibold uppercase tracking-[0.18em] text-paper sm:text-base">
            {t}
          </span>
          <span className="h-2 w-2 rotate-45 bg-accent shadow-[0_0_12px_#fdca0a]" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

/** Letreiro com as entregas da ecsilab, correndo de um lado ao outro da tela. */
export function Marquee() {
  return (
    <div
      className="marquee relative z-10 bg-white/[0.04] py-5 backdrop-blur-sm"
      role="region"
      aria-label="O que a ecsilab entrega"
    >
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track flex w-max">
          <Lista />
          <Lista oculta />
        </div>
      </div>
    </div>
  );
}
