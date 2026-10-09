import { Contato } from "@/components/contato";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SolucoesIA } from "@/components/solucoes-ia";

export function SolucoesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <SolucoesIA />
        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
