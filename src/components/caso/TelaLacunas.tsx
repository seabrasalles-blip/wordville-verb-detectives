import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaso } from "./CasoProvider";
import { BotaoAudio } from "./BotaoAudio";
import { AreaFeedback, Feedback } from "./Feedback";
import { Fantasma, useArrasto } from "./useArrasto";
import { familiaDaPalavra, feedbackLacuna } from "@/lib/caso-conteudo";
import type { Lacuna, TipoDica } from "@/lib/caso-conteudo";

const ORDEM_DICAS: TipoDica[] = ["conceitual", "procedimental", "atencional"];

const normalizar = (v: string) => v.trim().toLowerCase();

type Props = {
  lacunas: Lacuna[];
  banco: string[];
  comando: string;
  aoConcluir?: string;
  /** Número de colunas do quadro de frases (2 por padrão). */
  colunas?: 2 | 3;
};

/** Telas 4, 6, 7 e caso extra: completar lacunas arrastando (ou tocando) os blocos. */
export function TelaLacunas({ lacunas, banco, comando, aoConcluir, colunas = 2 }: Props) {
  const { estado, despachar, fala } = useCaso();
  const [dica, setDica] = useState<{ id: string; texto: string } | null>(null);
  const [ultimoAcerto, setUltimoAcerto] = useState<Lacuna | null>(null);
  const [processando, setProcessando] = useState(false);
  const bancoMisto = new Set(banco.map(familiaDaPalavra)).size > 1;

  const soltar = (idLacuna: string, palavra: string) => {
    if (processando) return;
    const lacuna = lacunas.find((l) => l.id === idLacuna);
    if (!lacuna) return;
    // resposta já correta fica travada
    if (normalizar(estado.respostas[lacuna.id] ?? "") === normalizar(lacuna.resposta)) return;

    setProcessando(true);
    window.setTimeout(() => setProcessando(false), 250);

    if (normalizar(palavra) === normalizar(lacuna.resposta)) {
      despachar({ tipo: "responder", id: lacuna.id, valor: lacuna.resposta });
      setDica(null);
      setUltimoAcerto(lacuna);
      if (estado.config.audioIngles) {
        fala.falar(`${lacuna.antes} ${lacuna.resposta} ${lacuna.depois}`, `frase-${lacuna.id}`);
      }
      return;
    }

    const tentativas = estado.tentativas[lacuna.id] ?? 0;
    despachar({ tipo: "errar", id: lacuna.id });
    if (bancoMisto) {
      // revisão mista: separa erro de significado (go × play) de erro de concordância
      setDica({ id: lacuna.id, texto: feedbackLacuna(lacuna, palavra, tentativas) });
    } else {
      const disponiveis = ORDEM_DICAS.filter((t) => lacuna.dicas[t]);
      const escolhida = disponiveis[Math.min(tentativas, disponiveis.length - 1)];
      setDica({ id: lacuna.id, texto: lacuna.dicas[escolhida] ?? "Observe quem pratica a ação." });
    }
    setUltimoAcerto(null);
  };

  const arrasto = useArrasto(soltar);
  const tudoCerto = lacunas.every(
    (l) => normalizar(estado.respostas[l.id] ?? "") === normalizar(l.resposta),
  );

  return (
    <div className="space-y-2">
      <p className="text-[18px] font-semibold text-foreground">{comando}</p>

      <div
        className={cn(
          "grid gap-2",
          lacunas.length >= 3 && (colunas === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"),
        )}
      >
        {lacunas.map((lacuna) => {
          const certo =
            normalizar(estado.respostas[lacuna.id] ?? "") === normalizar(lacuna.resposta);
          const errada = dica?.id === lacuna.id && !certo;
          return (
            <div
              key={lacuna.id}
              className={cn(
                "rounded-2xl border-2 bg-card p-2 shadow-sm transition-colors",
                certo
                  ? "border-acerto bg-acerto/10"
                  : errada
                    ? "border-reorienta"
                    : "border-investigacao/30",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                {lacuna.imagem ? (
                  <img
                    src={ILUSTRACOES[lacuna.imagem]}
                    alt={ALT_CENARIO[lacuna.imagem]}
                    width={512}
                    height={512}
                    loading="lazy"
                    className="size-9 shrink-0 object-contain"
                  />
                ) : (
                  <span aria-hidden="true" className="text-xl">
                    {lacuna.ilustracao}
                  </span>
                )}
                <p className="flex flex-wrap items-center gap-1.5 text-[20px] font-semibold">
                  <span>{lacuna.antes}</span>
                  <button
                    type="button"
                    data-lacuna={lacuna.id}
                    onClick={() => arrasto.aoClicarLacuna(lacuna.id)}
                    aria-label={`Lacuna da frase ${lacuna.antes} ... ${lacuna.depois}`}
                    className={cn(
                      "min-w-24 rounded-lg border-2 border-dashed px-2.5 py-0.5 text-center text-[20px] transition-colors",
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
                  <span
                    aria-label="Consertado"
                    className="ml-auto inline-flex items-center rounded-full bg-acerto p-1 text-acerto-foreground"
                  >
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
                {certo ? (
                  <BotaoAudio
                    texto={`${lacuna.antes} ${lacuna.resposta} ${lacuna.depois}`}
                    id={`frase-${lacuna.id}`}
                    tamanho="sm"
                  />
                ) : null}
              </div>

            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border-2 border-dashed border-investigacao/40 bg-secondary/60 p-2">
        <p className="mb-1.5 text-[15px] font-semibold text-muted-foreground">
          Arraste o bloco até a lacuna ou toque no bloco e depois na lacuna.
        </p>

        <div className="flex flex-wrap gap-2">
          {banco.map((palavra) => (
            <div key={palavra} className="flex items-center gap-1.5">
              <button
                type="button"
                {...arrasto.propsBloco(palavra)}
                aria-pressed={arrasto.selecionado === palavra}
                className={cn(
                  "cursor-grab rounded-xl border-2 bg-card px-4 py-1 text-[18px] font-bold text-investigacao shadow-md transition-transform select-none active:scale-95",
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

      <AreaFeedback>
        {dica && !tudoCerto ? (
          <Feedback
            type="hint"
            message={dica.texto}
            onClose={() => setDica(null)}
            autoClose
          />
        ) : tudoCerto ? (
          <Feedback
            type="success"
            message={aoConcluir ?? "Correto! Todas as frases estão completas."}
          />
        ) : ultimoAcerto ? (
          <Feedback
            type="success"
            message={ultimoAcerto.acertoTexto}
            onClose={() => setUltimoAcerto(null)}
            autoClose
          />
        ) : null}
      </AreaFeedback>

      <Fantasma arrasto={arrasto.arrasto} />
    </div>
  );
}
