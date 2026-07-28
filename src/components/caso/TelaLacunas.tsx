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
    <div className="space-y-6">
      <p className="text-xl font-semibold text-foreground">{comando}</p>

      <div className="grid gap-5">
        {lacunas.map((lacuna) => {
          const resposta = estado.respostas[lacuna.id];
          const certo = resposta === lacuna.resposta;
          return (
            <div
              key={lacuna.id}
              className={cn(
                "rounded-3xl border-4 bg-card p-4 shadow-sm transition-colors sm:p-5",
                certo ? "border-acerto bg-acerto/10" : "border-investigacao/30",
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span aria-hidden="true" className="text-3xl">
                  {lacuna.ilustracao}
                </span>
                <p className="flex flex-wrap items-center gap-2 text-xl font-semibold sm:text-2xl">
                  <span>{lacuna.antes}</span>
                  <button
                    type="button"
                    data-lacuna={lacuna.id}
                    onClick={() => arrasto.aoClicarLacuna(lacuna.id)}
                    aria-label={`Lacuna da frase ${lacuna.antes} ... ${lacuna.depois}`}
                    className={cn(
                      "min-w-28 rounded-xl border-4 border-dashed px-3 py-1.5 text-center transition-colors",
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
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-acerto px-3 py-1 text-sm font-bold text-acerto-foreground">
                    <Check className="size-4" aria-hidden="true" /> Consertado
                  </span>
                ) : null}
              </div>

              {certo ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <BotaoAudio
                    texto={`${lacuna.antes} ${lacuna.resposta} ${lacuna.depois}`}
                    id={`frase-${lacuna.id}`}
                    rotulo="Repetir comigo"
                    tamanho="sm"
                  />
                </div>
              ) : null}

              {dica?.id === lacuna.id ? (
                <BalaoLex tom="reorienta" className="mt-4">
                  <p className="flex items-start gap-2">
                    <Search className="mt-1 size-5 shrink-0 text-reorienta" aria-hidden="true" />
                    <span>{dica.texto}</span>
                  </p>
                </BalaoLex>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border-4 border-dashed border-investigacao/40 bg-secondary/60 p-4">
        <p className="mb-3 text-base font-semibold text-muted-foreground">
          Blocos de palavras — arraste até a lacuna ou toque no bloco e depois na lacuna. Ouça
          antes de decidir!
        </p>
        <div className="flex flex-wrap gap-3">
          {banco.map((palavra) => (
            <div key={palavra} className="flex items-center gap-2">
              <button
                type="button"
                {...arrasto.propsBloco(palavra)}
                aria-pressed={arrasto.selecionado === palavra}
                className={cn(
                  "cursor-grab rounded-2xl border-4 bg-card px-5 py-2.5 text-xl font-bold text-investigacao shadow-md transition-transform select-none active:scale-95",
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
