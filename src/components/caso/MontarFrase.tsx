import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ERRO_MONTAGEM, MONTAGENS, fraseDaMontagem, type Montagem } from "@/lib/caso-conteudo";
import { useCaso } from "./CasoProvider";
import { AreaFeedback, Feedback } from "./Feedback";
import { BotaoAudio } from "./BotaoAudio";

/** Tela 9: montar a frase com blocos ordenados (palavras + ordem são validadas). */
export function MontarFrase() {
  const { estado } = useCaso();
  const concluidas = MONTAGENS.filter((m) => estado.montagens[m.id] === fraseDaMontagem(m)).length;

  return (
    <div className="space-y-2">
      <p className="text-[18px] font-semibold">Monte a frase na ordem certa. Toque nos blocos.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {MONTAGENS.map((m, i) => (
          <Situacao key={m.id} montagem={m} bloqueada={i > 0 && concluidas === 0} />
        ))}
      </div>
    </div>
  );
}

function Situacao({ montagem, bloqueada }: { montagem: Montagem; bloqueada: boolean }) {
  const { estado, despachar, fala } = useCaso();
  const frase = fraseDaMontagem(montagem);
  const pronta = estado.montagens[montagem.id] === frase;

  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [erro, setErro] = useState(false);
  const [processando, setProcessando] = useState(false);

  const texto = (id: string) => montagem.blocos.find((b) => b.id === id)?.texto ?? "";

  const usarBloco = (idBloco: string) => {
    if (pronta || processando || bloqueada) return;
    if (slots.includes(idBloco)) return;
    const vazio = slots.findIndex((s) => s === null);
    if (vazio === -1) return;
    const proximos = [...slots];
    proximos[vazio] = idBloco;
    setSlots(proximos);
    setErro(false);
    if (proximos.every((s) => s !== null)) validar(proximos as string[]);
  };

  const tirarBloco = (indice: number) => {
    if (pronta || processando) return;
    const proximos = [...slots];
    proximos[indice] = null;
    setSlots(proximos);
    setErro(false);
  };

  const validar = (montados: string[]) => {
    setProcessando(true);
    const certo = montados.every((id, i) => id === montagem.solucao[i]);
    if (certo) {
      despachar({ tipo: "montar", id: montagem.id, valor: frase });
      setErro(false);
      fala.falar(frase, `montagem-${montagem.id}`);
      setProcessando(false);
      return;
    }
    despachar({ tipo: "errar", id: montagem.id });
    setErro(true);
    window.setTimeout(() => {
      setSlots([null, null, null]);
      setProcessando(false);
    }, 900);
  };

  const disponiveis = montagem.blocos.filter((b) => !slots.includes(b.id));

  return (
    <div
      className={cn(
        "rounded-2xl border-2 bg-card p-2.5 shadow-sm transition-colors",
        pronta ? "border-acerto bg-acerto/10" : "border-investigacao/30",
        bloqueada && "opacity-60",
      )}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-2xl">
          {montagem.icone}
        </span>
        <p className="text-[16px] text-muted-foreground">{montagem.contexto}</p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {pronta ? (
          <p className="text-[20px] font-bold text-acerto">{frase}</p>
        ) : (
          slots.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => (s ? tirarBloco(i) : undefined)}
              aria-label={s ? `Tirar ${texto(s)} da frase` : `Posição ${i + 1} vazia`}
              className={cn(
                "min-w-24 rounded-lg border-2 px-2 py-1 text-center text-[20px] font-bold",
                s
                  ? "border-investigacao bg-investigacao/10 text-investigacao"
                  : "border-dashed border-investigacao/50 text-muted-foreground",
              )}
            >
              {s ? texto(s) : "_____"}
            </button>
          ))
        )}
      </div>

      {pronta ? (
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-acerto px-2.5 py-0.5 text-[16px] font-bold text-acerto-foreground">
            <Check className="size-4" aria-hidden="true" /> {montagem.acerto}
          </span>
          <BotaoAudio texto={frase} id={`montagem-${montagem.id}`} tamanho="sm" />
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {disponiveis.map((b) => (
            <button
              key={b.id}
              type="button"
              disabled={processando || bloqueada}
              onClick={() => usarBloco(b.id)}
              className="rounded-xl border-2 border-investigacao bg-card px-3 py-1 text-[18px] font-bold text-investigacao shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              {b.texto}
            </button>
          ))}
        </div>
      )}

      <AreaFeedback>
        {bloqueada ? (
          <p className="mt-2 text-[16px] text-muted-foreground">
            Monte a primeira frase para liberar esta.
          </p>
        ) : erro && !pronta ? (
          <Feedback type="error" message={ERRO_MONTAGEM} className="mt-2" />
        ) : null}
      </AreaFeedback>
    </div>
  );
}
