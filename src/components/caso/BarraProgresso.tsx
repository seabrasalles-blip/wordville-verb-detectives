import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ESTRELAS_MAXIMAS, estrelasDaTela, estrelasTotais, totalDaTela } from "@/lib/relatorio";
import { useCaso } from "./CasoProvider";

/**
 * Barra de progresso do caso com estrelas por tela e total conquistado.
 * As estrelas dependem do número de erros: 3 sem erros, 2 com um, 1 com dois+.
 */
export function BarraProgresso({ concluidas }: { concluidas: boolean[] }) {
  const { estado } = useCaso();
  const total = concluidas.length;
  const tela = estado.tela;
  const estrelas = estrelasTotais(estado);
  const feitas = concluidas.filter(Boolean).length;
  const porcento = Math.round((feitas / total) * 100);

  return (
    <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 pb-1.5">
      <div className="flex flex-1 items-center gap-1.5">
        {concluidas.map((ok, i) => {
          const n = i + 1;
          const estrelasTela = totalDaTela(n) > 0 ? estrelasDaTela(estado, n) : 0;
          return (
            <span
              key={n}
              title={`Tela ${n}${totalDaTela(n) > 0 ? ` · ${estrelasTela} de 3 estrelas` : ""}`}
              className={cn(
                "relative h-2.5 flex-1 rounded-full transition-colors",
                ok ? "bg-acerto" : n === tela ? "bg-pista ring-2 ring-investigacao/40" : "bg-secondary",
              )}
            >
              {estrelasTela > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-[7px] left-1/2 -translate-x-1/2 text-[11px] leading-none"
                >
                  {estrelasTela === 3 ? "⭐️" : ""}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
      <span
        className="inline-flex items-center gap-1 rounded-full bg-pista px-2.5 py-0.5 text-[14px] font-bold text-pista-foreground"
        aria-label={`${estrelas} de ${ESTRELAS_MAXIMAS} estrelas conquistadas`}
      >
        <Star className="size-3.5 fill-current" aria-hidden="true" /> {estrelas}/{ESTRELAS_MAXIMAS}
      </span>
      <span className="rounded-full bg-investigacao px-2.5 py-0.5 text-[14px] font-bold text-investigacao-foreground">
        {porcento}%
      </span>
    </div>
  );
}
