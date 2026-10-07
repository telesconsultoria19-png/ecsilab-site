import { createFileRoute } from "@tanstack/react-router";

import { Clientes } from "@/components/clientes";
import { Calculadora } from "@/components/calculadora";
import { CaseG360 } from "@/components/case-g360";
import { Contato } from "@/components/contato";
import { Diagnostico } from "@/components/diagnostico";
import { Hero } from "@/components/hero";
import { Gargalos, Metodo } from "@/components/metodo";
import { MotionRestricoes } from "@/components/motion-restricoes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SolucoesIA } from "@/components/solucoes-ia";
import { SectionHead } from "@/components/ui-bits";
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
        <Gargalos />
        <section id="restricoes" className="relative overflow-hidden pt-20 sm:pt-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead
              eyebrow="Teoria das Restrições"
              title={
                <>
                  O resultado só cresce onde está a{" "}
                  <span className="font-serif font-normal italic text-accent">restrição.</span>
                </>
              }
              lead="Todo sistema tem um ponto que limita o que sai do outro lado. Ampliar qualquer outra parte só acumula estoque. A Écsilab encontra esse ponto, amplia, e passa para o próximo."
            />
          </div>
          <MotionRestricoes />
        </section>
        <Socios />
        <Diagnostico />
        <Metodo />
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
