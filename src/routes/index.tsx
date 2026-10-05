import { createFileRoute } from "@tanstack/react-router";

import { Calculadora } from "@/components/calculadora";
import { CaseG360 } from "@/components/case-g360";
import { Contato } from "@/components/contato";
import { Diagnostico } from "@/components/diagnostico";
import { Hero } from "@/components/hero";
import { Metodo } from "@/components/metodo";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SolucoesIA } from "@/components/solucoes-ia";
import { Socios } from "@/components/socios";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Metodo />
        <Socios />
        <Diagnostico />
        <Calculadora />
        <CaseG360 />
        <SolucoesIA />
        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
