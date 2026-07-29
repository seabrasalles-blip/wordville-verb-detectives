import { useState } from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ERRO_MONTAGEM, MONTAGENS } from "@/lib/caso-conteudo";
import { useCaso } from "./CasoProvider";
import { BalaoLex } from "./BalaoLex";
import { BotaoAudio } from "./BotaoAudio";

/** Tela 9: montar a frase escolhendo o verbo correto. */
export function MontarFrase() {
  const { estado, despachar, fala } = useCaso();
  const [erro, setErro] = useState<string | null>(null);

  const escolher = (id: string, palavra: string, correta: string, frase: string) => {
    if (palavra === correta) {
      despachar({ tipo: "montar", id, valor: palavra });
      setErro(null);
      fala.falar(frase, `montagem-${id}`);
      return;
    }
    despachar({ tipo: "errar", id });
    setErro(id);
  };

  return (
    <div className="space-y-3">
      <p className="text-base font-semibold">Monte a frase. Escolha o verbo correto.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {MONTAGENS.map((m) => {
          const frase = `${m.sujeito} ${m.correta} ${m.fim}`;
          const pronto = estado.montagens[m.id] === m.correta;
          return (
            <div
              key={m.id}
              className={cn(
                "rounded-2xl border-2 bg-card p-2.5 shadow-sm transition-colors",
                pronto ? "border-acerto bg-acerto/10" : "border-investigacao/30",
              )}
            >
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-2xl">
                  {m.icone}
                </span>
                <p className="text-xs text-muted-foreground">{m.contexto}</p>
              </div>

              <p className="mt-2 flex flex-wrap items-center gap-1.5 text-base font-bold sm:text-lg">
                <span className="rounded-lg border-2 border-investigacao bg-investigacao/10 px-2 py-0.5">
                  {m.sujeito}
                </span>
                <span
                  className={cn(
                    "min-w-20 rounded-lg border-2 px-2 py-0.5 text-center",
                    pronto
                      ? "border-acerto bg-acerto text-acerto-foreground"
                      : "border-dashed border-investigacao/60 text-muted-foreground",
                  )}
                >
                  {pronto ? m.correta : "_____"}
                </span>
                <span className="rounded-lg border-2 border-investigacao bg-investigacao/10 px-2 py-0.5">
                  {m.fim}
                </span>
              </p>

              {pronto ? (
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-acerto px-2.5 py-0.5 text-xs font-bold text-acerto-foreground">
                    <Check className="size-3.5" aria-hidden="true" /> {m.acerto}
                  </span>
                  <BotaoAudio texto={frase} id={`montagem-${m.id}`} tamanho="sm" />
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.opcoes.map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => escolher(m.id, op, m.correta, frase)}
                      className="rounded-xl border-2 border-investigacao bg-card px-4 py-1.5 text-base font-bold text-investigacao shadow-md transition-transform active:scale-95"
                    >
                      {op}
                    </button>
                  ))}
                </div>
              )}

              {erro === m.id && !pronto ? (
                <BalaoLex tom="reorienta" className="mt-2">
                  <p className="flex items-start gap-2">
                    <Search className="mt-0.5 size-4 shrink-0 text-reorienta" aria-hidden="true" />
                    <span>
                      {ERRO_MONTAGEM} Tente novamente.
                    </span>
                  </p>
                </BalaoLex>
              ) : null}
            </div>
          );
        })}
      </div>

      {MONTAGENS.every((m) => estado.montagens[m.id] === m.correta) ? (
        <BalaoLex tom="acerto">
          <p>Compare as duas frases: She plays in the park. / They play in the park.</p>
        </BalaoLex>
      ) : null}
    </div>
  );
}
