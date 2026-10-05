import { useEffect, useRef, useState } from "react";

/**
 * Progresso de rolagem (0 a 1) de um elemento.
 * - Elemento mais alto que a tela (cena fixa): 0 quando o topo encosta, 1 quando o fim sai.
 * - Elemento menor: 0 quando entra pela base, 1 quando já passou.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinned = r.height - vh;
      const v = pinned > 40 ? -r.top / pinned : (vh * 0.9 - r.top) / (vh * 0.6 + r.height * 0.4);
      setP(Math.min(1, Math.max(0, v)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };

    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return [ref, p] as const;
}
