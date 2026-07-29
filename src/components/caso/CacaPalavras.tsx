import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  EVIDENCIAS,
  GRADE_CACA,
  PALAVRAS_CACA,
  POSICOES_CACA,
  type PalavraCaca,
} from "@/lib/caso-conteudo";
import { useCaso } from "./CasoProvider";
import { BotaoAudio } from "./BotaoAudio";
import { BalaoLex } from "./BalaoLex";

function chave(l: number, c: number) {
  return `${l}-${c}`;
}

function palavraDaSelecao(selecao: string[]): PalavraCaca | null {
  for (const palavra of PALAVRAS_CACA) {
    const alvo = POSICOES_CACA[palavra].map(([l, c]) => chave(l, c));
    if (alvo.length !== selecao.length) continue;
    const igual =
      alvo.every((k) => selecao.includes(k)) && selecao.every((k) => alvo.includes(k));
    if (igual) return palavra;
  }
  return null;
}

export function CacaPalavras() {
  const { estado, despachar, fala } = useCaso();
  const [selecao, setSelecao] = useState<string[]>([]);
  const arrastando = useRef(false);
  const selecaoRef = useRef<string[]>([]);

  const encontradas = new Set<string>(
    estado.encontradas.flatMap((p) => POSICOES_CACA[p].map(([l, c]) => chave(l, c))),
  );

  const atualizarSelecao = (proxima: string[]) => {
    selecaoRef.current = proxima;
    setSelecao(proxima);
  };

  const finalizar = useCallback(() => {
    if (!arrastando.current) return;
    arrastando.current = false;
    const palavra = palavraDaSelecao(selecaoRef.current);
    selecaoRef.current = [];
    setSelecao([]);
    if (palavra) {
      despachar({ tipo: "encontrou", palavra });
      fala.falar(EVIDENCIAS[palavra].fala, `evid-${palavra}`);
    }
  }, [despachar, fala]);

  const marcar = (l: number, c: number) => {
    const k = chave(l, c);
    if (selecaoRef.current.includes(k)) return;
    atualizarSelecao([...selecaoRef.current, k]);
  };


  const completo = estado.encontradas.length === PALAVRAS_CACA.length;

  return (
    <div className="space-y-3">
      <p className="text-base font-semibold">
        Arraste o dedo (ou o mouse) sobre as letras para encontrar as palavras escondidas.
      </p>

      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div
          className="mx-auto w-full max-w-[260px] touch-none rounded-2xl border-2 border-investigacao bg-card p-2 shadow-md select-none"
          onPointerUp={finalizar}
          onPointerLeave={finalizar}
        >
          <div className="grid grid-cols-8 gap-1">
            {GRADE_CACA.map((linha, l) =>
              linha.map((letra, c) => {
                const k = chave(l, c);
                const achada = encontradas.has(k);
                const ativa = selecao.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    aria-label={`Letra ${letra}`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      arrastando.current = true;
                      atualizarSelecao([k]);
                    }}
                    onPointerEnter={() => {
                      if (arrastando.current) marcar(l, c);
                    }}
                    className={cn(
                      "aspect-square rounded-md text-sm font-bold transition-colors",
                      achada
                        ? "bg-acerto text-acerto-foreground"
                        : ativa
                          ? "bg-pista text-pista-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-investigacao/15",
                    )}
                  >
                    {letra}
                  </button>
                );
              }),
            )}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Procurando: GO · GOES · PLAY · PLAYS
          </p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-pista bg-pista/15 p-2.5">
          <h2 className="mb-2 text-base font-bold">🔎 Mural de evidências</h2>
          {estado.encontradas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma evidência ainda. Encontre as palavras na grade!
            </p>
          ) : (
            <ul className="space-y-2">
              {estado.encontradas.map((palavra) => {
                const ev = EVIDENCIAS[palavra];
                return (
                  <li
                    key={palavra}
                    className="surge flex items-start gap-2 rounded-xl bg-card p-2 shadow-sm"
                  >
                    <span aria-hidden="true" className="text-xl">
                      {ev.icone}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-investigacao">
                        {palavra.toLowerCase()}
                      </p>
                      <p className="text-xs">{ev.texto}</p>
                    </div>
                    <BotaoAudio texto={ev.fala} id={`evid-${palavra}`} tamanho="sm" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {completo ? (
        <BalaoLex tom="acerto">
          <p>
            Excelente trabalho, detetive! Agora temos nossas evidências. Reparou que 'goes' e
            'plays' têm um som parecido no final? Vai ser importante. Vamos investigar!
          </p>
        </BalaoLex>
      ) : null}
    </div>
  );
}
