import { useState } from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaso } from "./CasoProvider";
import { BotaoAudio } from "./BotaoAudio";
import { BalaoLex } from "./BalaoLex";
import { Fantasma, useArrasto } from "./useArrasto";
import type { Lacuna, TipoDica } from "@/lib/caso-conteudo";

const ORDEM_DICAS: TipoDica[] = ["conceitual", "procedimental", "atencional"];

type Props = {
  lacunas: Lacuna[];
  banco: string[];
  comando: string;
  aoConcluir?: string;
};

/** Telas 4, 6 e 7: completar lacunas arrastando (ou tocando) os blocos. */
export function TelaLacunas({ lacunas, banco, comando, aoConcluir }: Props) {
  const { estado, despachar, fala } = useCaso();
  const [dica, setDica] = useState<{ id: string; texto: string } | null>(null);
  const [ultimoAcerto, setUltimoAcerto] = useState<Lacuna | null>(null);

  const soltar = (idLacuna: string, palavra: string) => {
    const lacuna = lacunas.find((l) => l.id === idLacuna);
    if (!lacuna || estado.respostas[lacuna.id] === lacuna.resposta) return;

    if (palavra === lacuna.resposta) {
      despachar({ tipo: "responder", id: lacuna.id, valor: palavra });
      setDica(null);
      setUltimoAcerto(lacuna);
      fala.falar(`${lacuna.antes} ${lacuna.resposta} ${lacuna.depois}`, `frase-${lacuna.id}`);
      return;
    }

    const tentativas = estado.tentativas[lacuna.id] ?? 0;
    despachar({ tipo: "errar", id: lacuna.id });
    const disponiveis = ORDEM_DICAS.filter((t) => lacuna.dicas[t]);
    const escolhida = disponiveis[Math.min(tentativas, disponiveis.length - 1)];
    setDica({ id: lacuna.id, texto: lacuna.dicas[escolhida] ?? "" });
    setUltimoAcerto(null);
  };

  const arrasto = useArrasto(soltar);
  const tudoCerto = lacunas.every((l) => estado.respostas[l.id] === l.resposta);

  return (
    <div className="space-y-3">
      <p className="text-base font-semibold text-foreground">{comando}</p>

      <div className={cn("grid gap-2", lacunas.length >= 4 && "sm:grid-cols-2")}>
        {lacunas.map((lacuna) => {
          const resposta = estado.respostas[lacuna.id];
          const certo = resposta === lacuna.resposta;
          return (
            <div
              key={lacuna.id}
              className={cn(
                "rounded-2xl border-2 bg-card p-2.5 shadow-sm transition-colors",
                certo ? "border-acerto bg-acerto/10" : "border-investigacao/30",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span aria-hidden="true" className="text-xl">
                  {lacuna.ilustracao}
                </span>
                <p className="flex flex-wrap items-center gap-1.5 text-base font-semibold sm:text-lg">
                  <span>{lacuna.antes}</span>
                  <button
                    type="button"
                    data-lacuna={lacuna.id}
                    onClick={() => arrasto.aoClicarLacuna(lacuna.id)}
                    aria-label={`Lacuna da frase ${lacuna.antes} ... ${lacuna.depois}`}
                    className={cn(
                      "min-w-24 rounded-lg border-2 border-dashed px-2.5 py-1 text-center text-sm transition-colors",
                      certo
                        ? "border-acerto border-solid bg-acerto text-acerto-foreground"
                        : "border-investigacao/60 bg-investigacao/5 text-muted-foreground",
                      arrasto.selecionado && !certo && "border-pista bg-pista/30",
                    )}
                  >
                    {certo ? lacuna.resposta : "_____"}
                  </button>
                  <span>{lacuna.depois}</span>
                </p>
                {certo ? (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-acerto px-2.5 py-0.5 text-xs font-bold text-acerto-foreground">
                    <Check className="size-3.5" aria-hidden="true" /> Consertado
                  </span>
                ) : null}
              </div>

              {certo ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <BotaoAudio
                    texto={`${lacuna.antes} ${lacuna.resposta} ${lacuna.depois}`}
                    id={`frase-${lacuna.id}`}
                    rotulo="Repetir"
                    tamanho="sm"
                  />
                </div>
              ) : null}

              {dica?.id === lacuna.id ? (
                <BalaoLex tom="reorienta" className="mt-2">
                  <p className="flex items-start gap-2">
                    <Search className="mt-0.5 size-4 shrink-0 text-reorienta" aria-hidden="true" />
                    <span>{dica.texto}</span>
                  </p>
                </BalaoLex>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border-2 border-dashed border-investigacao/40 bg-secondary/60 p-2.5">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Blocos de palavras — arraste até a lacuna ou toque no bloco e depois na lacuna. Ouça
          antes de decidir!
        </p>
        <div className="flex flex-wrap gap-2">
          {banco.map((palavra) => (
            <div key={palavra} className="flex items-center gap-1.5">
              <button
                type="button"
                {...arrasto.propsBloco(palavra)}
                aria-pressed={arrasto.selecionado === palavra}
                className={cn(
                  "cursor-grab rounded-xl border-2 bg-card px-4 py-1.5 text-base font-bold text-investigacao shadow-md transition-transform select-none active:scale-95",
                  arrasto.selecionado === palavra
                    ? "border-pista bg-pista/40"
                    : "border-investigacao",
                )}
              >
                {palavra}
              </button>
              <BotaoAudio texto={palavra} tamanho="sm" />
            </div>
          ))}
        </div>
      </div>

      {ultimoAcerto ? (
        <BalaoLex tom="acerto">
          <p>{ultimoAcerto.acertoTexto}</p>
        </BalaoLex>
      ) : null}

      {tudoCerto && aoConcluir ? (
        <BalaoLex tom="acerto">
          <p>{aoConcluir}</p>
        </BalaoLex>
      ) : null}

      <Fantasma arrasto={arrasto.arrasto} />
    </div>
  );
}
