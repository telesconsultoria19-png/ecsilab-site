import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { VERSAO_LEGAL } from "@/lib/legal";

const CHAVE = "ecsilab-consentimento";
export const EVENTO_ABRIR_CONSENTIMENTO = "abrir-consentimento";

/** Aviso de privacidade e cookies. Volta a aparecer quando os documentos mudam de versão. */
export function ConsentBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAVE);
      const salvo = raw ? (JSON.parse(raw) as { versao?: string }) : null;
      setVisivel(!salvo || salvo.versao !== VERSAO_LEGAL);
    } catch {
      setVisivel(true);
    }
    const abrir = () => setVisivel(true);
    window.addEventListener(EVENTO_ABRIR_CONSENTIMENTO, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_CONSENTIMENTO, abrir);
  }, []);

  function aceitar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ versao: VERSAO_LEGAL, aceitoEm: new Date().toISOString() }));
    } catch {
      /* sem armazenamento: o aviso volta na próxima visita */
    }
    setVisivel(false);
  }

  if (!visivel) return null;
  return (
    <div
      role="dialog"
      aria-label="Aviso de privacidade e cookies"
      className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl bg-[#0c0c0c]/95 p-5 shadow-[0_0_60px_-15px_rgba(253,202,10,0.35)] backdrop-blur-xl sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-6 text-paper/85">
          Este site usa apenas o armazenamento do navegador para lembrar que você viu este aviso, e não usa cookies
          de publicidade nem de análise. Ao continuar, você concorda com a nossa{" "}
          <Link to="/politica-de-privacidade" className="font-semibold text-accent hover:underline">
            Política de Privacidade
          </Link>{" "}
          e com os{" "}
          <Link to="/termos-de-uso" className="font-semibold text-accent hover:underline">
            Termos de Uso
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={aceitar}
          className="btn-neon shrink-0 rounded-xl bg-accent px-6 py-3 font-semibold text-ink"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
