import { createFileRoute } from "@tanstack/react-router";

import { Clientes } from "@/components/clientes";
import { Calculadora } from "@/components/calculadora";
import { CaseG360 } from "@/components/case-g360";
import { Contato } from "@/components/contato";
import { Diagnostico } from "@/components/diagnostico";
import { Hero } from "@/components/hero";
import { Metodo } from "@/components/metodo";
import { MotionPasto } from "@/components/motion-pasto";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SolucoesIA } from "@/components/solucoes-ia";
import { Eyebrow, Section } from "@/components/ui-bits";
import { Socios } from "@/components/socios";
import { SECOES_VISIVEIS } from "@/lib/secoes";
import { DESCRICAO_PADRAO, TITULO_PADRAO, seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo({ titulo: TITULO_PADRAO, descricao: DESCRICAO_PADRAO, caminho: "/" }),
  component: Home,
});

function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Metodo />
        <Section id="manifesto">
          <div className="reveal">
            <Eyebrow>A Écsilab em 15 segundos</Eyebrow>
            <MotionPasto />
          </div>
        </Section>
        <Socios />
        <Diagnostico />
        <Calculadora />
        <CaseG360 />
        {SECOES_VISIVEIS.clientes && <Clientes />}
        <SolucoesIA />
        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
