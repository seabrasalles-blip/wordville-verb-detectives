import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const PASSOS = [
  { icone: "👀", texto: "Observe as frases dos cartazes de Wordville." },
  { icone: "🔎", texto: "Descubra qual verbo combina com cada frase." },
  { icone: "🖐️", texto: "Arraste, clique e investigue as pistas." },
  { icone: "🏅", texto: "Complete a missão com a Inspetora Lex!" },
];

type Props = { aberto: boolean; aoFechar: () => void };

/** Pop-up curto e visual com as regras do jogo. */
export function ComoJogar({ aberto, aoFechar }: Props) {
  const fecharRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    fecharRef.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        aoFechar();
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center bg-investigacao/50 p-6"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-como-jogar"
        className="surge cartao-pista w-full max-w-2xl border-pista p-5"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-3xl">
            🔍
          </span>
          <h2 id="titulo-como-jogar" className="text-2xl font-bold text-investigacao">
            Como jogar
          </h2>
          <button
            ref={fecharRef}
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="ml-auto grid size-10 place-items-center rounded-full border-2 border-investigacao/30 text-investigacao hover:bg-investigacao/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {PASSOS.map((p, i) => (
            <li
              key={p.texto}
              className="flex items-center gap-3 rounded-2xl border-2 border-investigacao/25 bg-pista/20 px-3 py-2.5"
            >
              <span aria-hidden="true" className="text-2xl">
                {p.icone}
              </span>
              <p className="text-[18px] font-semibold">
                <span className="mr-1 font-bold text-investigacao">{i + 1}.</span>
                {p.texto}
              </p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={aoFechar}
          className="botao-fofo mx-auto mt-5 block bg-investigacao px-8 py-2.5 text-[18px] text-investigacao-foreground"
        >
          Entendi!
        </button>
      </div>
    </div>
  );
}
