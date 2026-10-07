/** Caixa de concordância obrigatória dos formulários. */
export function AceitePrivacidade({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const controle = onChange ? { checked: checked ?? false, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked) } : {};
  return (
    <label className="flex items-start gap-3 text-sm leading-6 text-paper/75">
      <input
        type="checkbox"
        name="aceite"
        required
        className="mt-1 h-4 w-4 shrink-0 accent-[#fdca0a]"
        {...controle}
      />
      <span>
        Li e concordo com a{" "}
        <a
          href="/politica-de-privacidade"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          Política de Privacidade
        </a>
        .
      </span>
    </label>
  );
}
