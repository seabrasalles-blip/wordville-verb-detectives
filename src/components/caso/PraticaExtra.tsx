import { useState } from "react";
import { cn } from "@/lib/utils";
import { RAMOS } from "@/lib/caso-conteudo";
import { FALAS } from "@/lib/caso-conteudo";
import { useCaso } from "./CasoProvider";
import { DialogoLex } from "./DialogoLex";
import { BotaoAudio } from "./BotaoAudio";
import { AreaFeedback, Feedback } from "./Feedback";
import { Ingles } from "./BalaoLex";

/**
 * Tela de prática adicional (ramificação). Aparece quando a criança erra
 * demais numa tela de prática e traz itens mais simples, com ajuda direta.
 */
export function PraticaExtra({ tela }: { tela: number }) {
  const { estado, despachar } = useCaso();
  const ramo = RAMOS[tela];
  const [escolhas, setEscolhas] = useState<Record<string, string>>({});
  const [erros, setErros] = useState<Record<string, number>>({});
  const [aviso, setAviso] = useState<{ tipo: "success" | "error" | "hint"; texto: string } | null>(
    null,
  );

  if (!ramo) return null;

  const acertos = ramo.itens.filter((i) => escolhas[i.id] === i.resposta).length;
  const completo = acertos === ramo.itens.length;

  const escolher = (idItem: string, opcao: string) => {
    const item = ramo.itens.find((i) => i.id === idItem);
    if (!item || escolhas[idItem] === item.resposta) return;

    if (opcao === item.resposta) {
      setEscolhas((e) => ({ ...e, [idItem]: opcao }));
      setAviso({
        tipo: "success",
        texto: `Isso! ${item.antes} ${item.resposta} ${item.depois}`,
      });
      return;
    }

    const n = (erros[idItem] ?? 0) + 1;
    setErros((e) => ({ ...e, [idItem]: n }));
    despachar({ tipo: "errarRamo", tela });
    setAviso({
      tipo: n >= 2 ? "hint" : "error",
      texto:
        n >= 2
          ? item.ajuda
          : "Observe quem pratica a ação e escute as duas opções antes de escolher.",
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <DialogoLex segmentos={FALAS.ramo} id={`ramo-${tela}`} tom="pista" />
      <h2 className="text-[18px] font-extrabold text-investigacao">{ramo.titulo}</h2>

      <div className={cn("grid gap-2", ramo.itens.length > 2 ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        {ramo.itens.map((item) => {
          const certo = escolhas[item.id] === item.resposta;
          return (
            <div key={item.id} className="cartao-pista border-investigacao/70 p-2.5">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-xl">
                  {item.ilustracao}
                </span>
                <p className="flex-1 text-[19px] font-bold text-investigacao">
                  <Ingles>
                    {item.antes} {certo ? item.resposta : "____"} {item.depois}
                  </Ingles>
                </p>
                {certo ? (
                  <BotaoAudio
                    texto={`${item.antes} ${item.resposta} ${item.depois}`}
                    id={`ramo-${item.id}`}
                    tamanho="sm"
                  />
                ) : null}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {item.opcoes.map((op) => (
                  <button
                    key={op}
                    type="button"
                    disabled={certo}
                    onClick={() => escolher(item.id, op)}
                    className={cn(
                      "rounded-full border-2 px-4 py-1 text-[18px] font-bold transition-colors disabled:cursor-not-allowed",
                      certo && op === item.resposta
                        ? "border-acerto bg-acerto/20 text-acerto"
                        : "border-investigacao/40 bg-card text-investigacao hover:bg-investigacao/10",
                    )}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AreaFeedback>
        {completo ? (
          <Feedback
            type="success"
            message="Prática concluída! Agora você pode voltar à investigação."
          />
        ) : aviso ? (
          <Feedback type={aviso.tipo} message={aviso.texto} onClose={() => setAviso(null)} />
        ) : null}
      </AreaFeedback>

      <button
        type="button"
        disabled={!completo}
        onClick={() => despachar({ tipo: "concluirRamo", tela })}
        className="botao-fofo mx-auto bg-investigacao px-6 py-2 text-[17px] text-investigacao-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        Voltar à investigação
      </button>
    </div>
  );
}
