import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALVOS_TELA5, GRUPO_DO_SUJEITO, PARES_TELA5 } from "@/lib/caso-conteudo";
import { useCaso } from "./CasoProvider";
import { AreaFeedback, Feedback } from "./Feedback";
import { BotaoAudio } from "./BotaoAudio";

/** Tela 5: ligar sujeito → forma verbal. A validação usa ids, nunca o texto. */
export function LigarColunas() {
  const { estado, despachar, fala } = useCaso();
  const [sujeito, setSujeito] = useState<string | null>(null);
  const [aviso, setAviso] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  const conectar = (idAlvo: string) => {
    const alvo = ALVOS_TELA5.find((a) => a.id === idAlvo);
    if (!alvo) return;
    if (Object.values(estado.conexoes).includes(idAlvo)) return;
    if (!sujeito) {
      setAviso({ tipo: "error", texto: "Escolha primeiro o sujeito, depois o verbo." });
      return;
    }
    const par = PARES_TELA5.find((p) => p.id === sujeito);
    if (!par || estado.conexoes[par.id]) return;

    if (alvo.parId === par.id) {
      despachar({ tipo: "conectar", id: par.id, forma: alvo.id });
      fala.falar(`${par.sujeito} ${alvo.texto}`, `par-${par.id}`);
      setAviso({
        tipo: "success",
        texto: `${par.sujeito} combina com ${alvo.texto}.`,
      });
      setSujeito(null);
      return;
    }

    despachar({ tipo: "errar", id: par.id });
    setAviso({
      tipo: "error",
      texto: `${par.sujeito} não combina com ${alvo.texto}. ${GRUPO_DO_SUJEITO[par.id] ?? "Observe o sujeito antes de escolher."}`,
    });
  };

  const alvosUsados = new Set(Object.values(estado.conexoes));

  return (
    <div className="space-y-2">
      <p className="text-[18px] font-semibold">
        Clique no sujeito e depois no verbo que combina com ele.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <ul className="space-y-1.5">
          {PARES_TELA5.map((par) => {
            const ligado = Boolean(estado.conexoes[par.id]);
            return (
              <li key={par.id}>
                <button
                  type="button"
                  disabled={ligado}
                  onClick={() => setSujeito(par.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl border-2 bg-card px-3 py-1.5 text-[18px] font-bold shadow-sm transition-colors disabled:cursor-not-allowed",
                    ligado
                      ? "border-acerto bg-acerto/15 text-acerto"
                      : sujeito === par.id
                        ? "border-pista bg-pista/40"
                        : "border-investigacao hover:bg-investigacao/10",
                  )}
                >
                  <span aria-hidden="true" className="text-lg">
                    {par.icone}
                  </span>
                  {par.sujeito}
                  {ligado ? <Check className="ml-auto size-4" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>

        <ul className="space-y-1.5">
          {ALVOS_TELA5.map((alvo) => {
            const usado = alvosUsados.has(alvo.id);
            return (
              <li key={alvo.id} className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={usado}
                  onClick={() => conectar(alvo.id)}
                  className={cn(
                    "flex-1 rounded-xl border-2 border-dashed bg-card px-3 py-1.5 text-[18px] font-bold shadow-sm transition-colors disabled:cursor-not-allowed",
                    usado
                      ? "border-acerto border-solid bg-acerto/15 text-acerto"
                      : "border-investigacao/60 hover:bg-investigacao/10",
                  )}
                >
                  {alvo.texto}
                </button>
                <BotaoAudio texto={alvo.texto} id={`forma-${alvo.id}`} tamanho="sm" />
              </li>
            );
          })}
        </ul>
      </div>

      <AreaFeedback>
        {aviso ? (
          <Feedback
            type={aviso.tipo}
            message={aviso.texto}
            onClose={() => setAviso(null)}
            autoClose={aviso.tipo === "success"}
          />
        ) : null}
      </AreaFeedback>
    </div>
  );
}
