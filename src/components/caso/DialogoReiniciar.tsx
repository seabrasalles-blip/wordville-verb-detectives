import { useEffect, useRef } from "react";

type Props = {
  aberto: boolean;
  aoCancelar: () => void;
  aoConfirmar: () => void;
};

/** Confirmação antes de apagar o progresso. Compacto e centralizado no palco. */
export function DialogoReiniciar({ aberto, aoCancelar, aoConfirmar }: Props) {
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    cancelarRef.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        aoCancelar();
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoCancelar]);

  if (!aberto) return null;

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-black/45 p-4"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) aoCancelar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-reiniciar"
        className="w-full max-w-md rounded-2xl border-2 border-investigacao bg-card p-4 shadow-2xl"
      >
        <h2 id="titulo-reiniciar" className="text-lg font-bold text-investigacao">
          Reiniciar a investigação?
        </h2>
        <p className="mt-1 text-[17px]">Seu progresso será apagado e você voltará ao início.</p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelarRef}
            type="button"
            onClick={aoCancelar}
            className="rounded-full bg-investigacao px-4 py-2 text-[17px] font-bold text-investigacao-foreground shadow-md"
          >
            Continuar investigação
          </button>
          <button
            type="button"
            onClick={aoConfirmar}
            className="rounded-full border-2 border-reorienta px-4 py-2 text-[17px] font-bold text-reorienta"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
