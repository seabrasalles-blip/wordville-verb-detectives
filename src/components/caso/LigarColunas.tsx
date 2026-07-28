import { useState } from "react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FORMAS_TELA5, PARES_TELA5 } from "@/lib/caso-conteudo";
import { useCaso } from "./CasoProvider";
import { BalaoLex } from "./BalaoLex";
import { BotaoAudio } from "./BotaoAudio";

/** Tela 5: ligar sujeito → forma verbal por cliques. */
export function LigarColunas() {
  const { estado, despachar, fala } = useCaso();
  const [sujeito, setSujeito] = useState<string | null>(null);
  const [dica, setDica] = useState<string | null>(null);
  const [acerto, setAcerto] = useState<string | null>(null);

  const conectar = (idForma: string, forma: string) => {
    if (!sujeito) return;
    const par = PARES_TELA5.find((p) => p.id === sujeito);
    if (!par) return;

    if (par.forma === forma) {
      despachar({ tipo: "conectar", id: par.id, forma: idForma });
      fala.falar(`${par.sujeito} ${par.forma}`, `par-${par.id}`);
      setDica(null);
      setAcerto(
        par.forma === "goes"
          ? `Conexão feita! '${par.sujeito}' combina com 'goes'. E olhe: 'I', 'We' e 'They' todos combinam com 'go'. Será que existe um padrão aqui?`
          : `Conexão feita! '${par.sujeito}' combina com 'go'. E 'He' e 'She' combinam com 'goes'. Será que existe um padrão aqui?`,
      );
      setSujeito(null);
      return;
    }

    const tentativas = estado.tentativas[par.id] ?? 0;
    despachar({ tipo: "errar", id: par.id });
    setAcerto(null);
    setDica(
      tentativas === 0
        ? `Espera aí... '${par.sujeito}' e '${forma}'? Lembra da nossa pista: quando falamos de outra pessoa (he, she, it), o verbo muda. Qual forma tem o som a mais no final?`
        : `Compare com as conexões que você já fez. Você ligou 'I' a 'go' — certo! Agora, '${par.sujeito}' é parecido com 'I' ou com 'He'?`,
    );
  };

  const formasUsadas = new Set(Object.values(estado.conexoes));

  return (
    <div className="space-y-6">
      <p className="text-xl font-semibold">
        Clique em um sujeito e depois na forma verbal correta para conectá-los.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <ul className="space-y-3">
          {PARES_TELA5.map((par) => {
            const ligado = Boolean(estado.conexoes[par.id]);
            return (
              <li key={par.id}>
                <button
                  type="button"
                  disabled={ligado}
                  onClick={() => setSujeito(par.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border-4 bg-card px-4 py-3 text-xl font-bold shadow-sm transition-colors",
                    ligado
                      ? "border-acerto bg-acerto/15 text-acerto"
                      : sujeito === par.id
                        ? "border-pista bg-pista/40"
                        : "border-investigacao hover:bg-investigacao/10",
                  )}
                >
                  <span aria-hidden="true" className="text-2xl">
                    {par.icone}
                  </span>
                  {par.sujeito}
                  {ligado ? <Check className="ml-auto size-5" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>

        <ul className="space-y-3">
          {FORMAS_TELA5.map((forma) => {
            const usada = formasUsadas.has(forma.id);
            return (
              <li key={forma.id} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={usada}
                  onClick={() => conectar(forma.id, forma.texto)}
                  className={cn(
                    "flex-1 rounded-2xl border-4 border-dashed bg-card px-4 py-3 text-xl font-bold shadow-sm transition-colors",
                    usada
                      ? "border-acerto border-solid bg-acerto/15 text-acerto"
                      : "border-investigacao/60 hover:bg-investigacao/10",
                  )}
                >
                  {forma.texto}
                </button>
                <BotaoAudio texto={forma.texto} id={`forma-${forma.id}`} tamanho="sm" />
              </li>
            );
          })}
        </ul>
      </div>

      {dica ? (
        <BalaoLex tom="reorienta">
          <p className="flex items-start gap-2">
            <Search className="mt-1 size-5 shrink-0 text-reorienta" aria-hidden="true" />
            <span>{dica}</span>
          </p>
        </BalaoLex>
      ) : null}

      {acerto ? (
        <BalaoLex tom="acerto">
          <p>{acerto}</p>
        </BalaoLex>
      ) : null}
    </div>
  );
}
