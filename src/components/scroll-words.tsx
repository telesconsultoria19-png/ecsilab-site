import { useEffect, useState } from "react";

import { useScrollProgress } from "@/lib/use-scroll";

/** Texto grande cujas palavras acendem uma a uma conforme a rolagem. */
export function ScrollWords({
  text,
  accentFrom,
  className = "",
  como: Tag = "h2",
}: {
  text: string;
  accentFrom?: number;
  className?: string;
  como?: "h1" | "h2";
}) {
  const [ref, p] = useScrollProgress<HTMLHeadingElement>();
  const [animar, setAnimar] = useState(false);
  const palavras = text.split(" ");

  useEffect(() => {
    setAnimar(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {palavras.map((w, i) => {
        const inicio = i / palavras.length;
        const op = animar ? Math.min(1, Math.max(0.14, (p * 1.25 - inicio) * palavras.length * 0.6 + 0.14)) : 1;
        const accent = accentFrom !== undefined && i >= accentFrom;
        return (
          <span
            key={`${w}-${i}`}
            className={accent ? "text-accent" : ""}
            style={{ opacity: op, transition: "opacity 0.25s linear" }}
          >
            {w}{" "}
          </span>
        );
      })}
    </Tag>
  );
}
