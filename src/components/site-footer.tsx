export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <img src="/logo-ecsilab.png" alt="ecsilab" className="h-7 w-auto" />
          <p className="mt-3 text-sm text-paper/60">Growth, processos e escala comercial.</p>
        </div>
        <p className="text-sm text-paper/50">
          © {new Date().getFullYear()} ecsilab. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
