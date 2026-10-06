import { useEffect, useRef, useState } from "react";

/** Diz se o elemento já apareceu na tela (uma única vez). */
export function useInView<T extends HTMLElement | SVGElement>(threshold = 0.5) {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visto] as const;
}
