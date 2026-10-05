import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-accent">ecsilab</p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
        Growth, processos e escala comercial.
      </h1>
      <p className="max-w-xl text-paper/70">Site em construção.</p>
    </main>
  );
}
