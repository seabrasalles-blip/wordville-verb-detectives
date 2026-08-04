import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TELAS } from "@/lib/caso-conteudo";
import { estrelasDaTela, selos, totalDaTela } from "@/lib/relatorio";
import { useCaso } from "./CasoProvider";

/** Mapa do Caso: permite revisitar telas já concluídas e mostra os selos. */
export function MapaCaso({
  aberto,
  aoFechar,
  concluidas,
}: {
  aberto: boolean;
  aoFechar: () => void;
  concluidas: boolean[];
}) {
  const { estado, despachar } = useCaso();
  if (!aberto) return null;

  const lista = selos(estado);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mapa do Caso"
      className="absolute inset-0 z-30 flex items-center justify-center bg-investigacao/40 p-4"
    >
      <div className="cartao-pista max-h-full w-full max-w-3xl overflow-auto border-investigacao p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[22px] font-extrabold text-investigacao">🗺️ Mapa do Caso</h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar o mapa do caso"
            className="ml-auto rounded-full p-1.5 hover:bg-investigacao/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1 text-[16px] text-muted-foreground">
          Você pode voltar às telas que já investigou. As próximas abrem quando você termina a tela
          atual.
        </p>

        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {TELAS.map((t) => {
            const feita = concluidas[t.n - 1];
            const anteriorFeita = t.n === 1 || concluidas[t.n - 2];
            const liberada = feita || anteriorFeita || t.n === estado.tela;
            const estrelas = totalDaTela(t.n) > 0 ? estrelasDaTela(estado, t.n) : 0;
            return (
              <li key={t.n}>
                <button
                  type="button"
                  disabled={!liberada}
                  onClick={() => {
                    despachar({ tipo: "ir", tela: t.n });
                    aoFechar();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-2xl border-2 px-3 py-1.5 text-left text-[17px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                    t.n === estado.tela
                      ? "border-investigacao bg-investigacao/10"
                      : feita
                        ? "border-acerto bg-acerto/10"
                        : "border-investigacao/30 bg-card hover:bg-investigacao/10",
                  )}
                >
                  <span aria-hidden="true">{t.icone}</span>
                  <span className="flex-1">
                    {t.n}. {t.titulo}
                  </span>
                  {totalDaTela(t.n) > 0 ? (
                    <span
                      className="flex items-center gap-0.5"
                      aria-label={`${estrelas} de 3 estrelas`}
                    >
                      {[0, 1, 2].map((i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-4",
                            i < estrelas ? "fill-pista text-pista" : "text-muted-foreground/40",
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <h3 className="mt-4 text-[18px] font-extrabold text-investigacao">🏅 Seus selos</h3>
        <ul className="mt-1.5 flex flex-wrap gap-2">
          {lista.map((s) => (
            <li
              key={s.id}
              className={cn(
                "etiqueta border-2 text-[16px]",
                s.conquistado
                  ? "border-acerto bg-acerto/15 text-acerto"
                  : "border-muted bg-muted text-muted-foreground",
              )}
            >
              <span aria-hidden="true">{s.icone}</span> {s.titulo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
