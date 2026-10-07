import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Mascote } from "../components/animated-icons";
import { ConsentBanner } from "../components/consent-banner";
import appCss from "../styles.css?url";

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Mascote className="h-28 w-28" />
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <p className="text-paper/70">Esta página não existe ou foi movida.</p>
      <Link to="/" className="rounded-md bg-accent px-4 py-2 font-medium text-ink">
        Voltar ao início
      </Link>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Écsilab | Growth, processos e escala comercial" },
      {
        name: "description",
        content:
          "Écsilab: laboratório de growth, marketing e processos para empresas de serviço que querem crescer com previsibilidade.",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/ovelha.png" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ConsentBanner />
    </QueryClientProvider>
  );
}
