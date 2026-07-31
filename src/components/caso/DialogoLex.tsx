import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import lex from "@/assets/lex.png";

type Props = {
  /** Falas curtas da Lex: no máximo 2 frases por segmento. */
  segmentos: string[];
  /** Identificador estável para reiniciar o diálogo. */
  id: string;
  tom?: "investigacao" | "acerto" | "pista";
  /** "compacta" mostra apenas um segmento por vez, sem a imagem da Lex. */
  variante?: "compacta" | "apresentacao";
  /** Chamado quando a criança revela o último segmento. */
  aoTerminar?: () => void;
  className?: string;
};


const tons = {
  investigacao: "border-investigacao/40 bg-card",
  acerto: "border-acerto bg-acerto/10",
  pista: "border-pista bg-pista/25",
} as const;

/**
 * Diálogo da Inspetora Lex em segmentos, com botão "Continuar".
 * A criança controla o ritmo da leitura.
 */
export function DialogoLex({
  segmentos,
  id,
  tom = "investigacao",
  variante = "compacta",
  aoTerminar,
  className,
}: Props) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    setIndice(0);
  }, [id]);

  const atual = segmentos[Math.min(indice, segmentos.length - 1)] ?? "";
  const ultimo = indice >= segmentos.length - 1;

  useEffect(() => {
    if (ultimo) aoTerminar?.();
    // aoTerminar é chamado sempre que o último segmento aparece
  }, [ultimo, aoTerminar]);

  const balao = useMemo(
    () => (
      <div className={cn("cartao-pista relative flex-1 border-[3px] p-2.5", tons[tom])}>
        <div className="flex items-start gap-2">
          <span aria-hidden="true" className="text-xl">
            🕵️‍♀️
          </span>
          <p className="flex-1 text-[18px] leading-snug font-semibold">{atual}</p>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[14px] font-bold text-muted-foreground">
            {indice + 1}/{segmentos.length}
          </span>
          {!ultimo ? (
            <button
              type="button"
              onClick={() => setIndice((i) => Math.min(segmentos.length - 1, i + 1))}
              className="botao-fofo ml-auto inline-flex items-center gap-1 bg-investigacao px-4 py-1 text-[16px] text-investigacao-foreground"
            >
              Continuar <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : segmentos.length > 1 ? (
            <button
              type="button"
              onClick={() => setIndice(0)}
              className="ml-auto rounded-full px-3 py-1 text-[15px] font-bold text-investigacao hover:bg-investigacao/10"
            >
              Ler de novo
            </button>
          ) : null}
        </div>
      </div>
    ),
    [atual, id, indice, segmentos.length, tom, ultimo],
  );

  if (variante === "apresentacao") {
    return (
      <div className={cn("surge flex h-full flex-col justify-end", className)}>
        <div className="relative w-full">
          {balao}
          <span
            aria-hidden="true"
            className="absolute -bottom-3 left-10 size-6 rotate-45 border-r-[3px] border-b-[3px] border-investigacao/40 bg-card"
          />
        </div>
        <img
          src={lex}
          alt="Inspetora Lex, a detetive de Wordville"
          width={768}
          height={1024}
          className="mt-2 h-[230px] w-auto self-start object-contain drop-shadow-xl"
        />
      </div>
    );
  }

  return <div className={cn("surge flex", className)}>{balao}</div>;
}
