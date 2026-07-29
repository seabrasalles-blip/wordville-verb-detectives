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
import { AreaFeedback, Feedback } from "./Feedback";

type Celula = { l: number; c: number };

function chave(l: number, c: number) {
  return `${l}-${c}`;
}

/** Confere caminho exato: mesma ordem, mesma sequência de células. */
function palavraDoCaminho(caminho: Celula[]): PalavraCaca | null {
  if (caminho.length < 2) return null;
  for (const palavra of PALAVRAS_CACA) {
    const alvo = POSICOES_CACA[palavra];
    if (alvo.length !== caminho.length) continue;
    const igual = alvo.every(([l, c], i) => caminho[i].l === l && caminho[i].c === c);
    if (igual) return palavra;
  }
  return null;
}

export function CacaPalavras() {
  const { estado, despachar, fala } = useCaso();
  const [caminho, setCaminho] = useState<Celula[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const arrastando = useRef(false);
  const caminhoRef = useRef<Celula[]>([]);
  const direcao = useRef<{ dl: number; dc: number } | null>(null);
  const limpando = useRef<number | null>(null);

  const encontradas = new Set<string>(
    estado.encontradas.flatMap((p) => POSICOES_CACA[p].map(([l, c]) => chave(l, c))),
  );

  const atualizar = (proximo: Celula[]) => {
    caminhoRef.current = proximo;
    setCaminho(proximo);
  };

  const finalizar = useCallback(() => {
    if (!arrastando.current) return;
    arrastando.current = false;
    const atual = caminhoRef.current;
    const palavra = palavraDoCaminho(atual);
    direcao.current = null;

    if (palavra && !estado.encontradas.includes(palavra)) {
      caminhoRef.current = [];
      setCaminho([]);
      setErro(null);
      despachar({ tipo: "encontrou", palavra });
      fala.falar(EVIDENCIAS[palavra].fala, `evid-${palavra}`);
      return;
    }

    if (atual.length > 1) {
      setErro("Essas letras ainda não formam o verbo. Procure uma sequência ligada, na ordem.");
      if (limpando.current) window.clearTimeout(limpando.current);
      limpando.current = window.setTimeout(() => {
        caminhoRef.current = [];
        setCaminho([]);
        setErro(null);
      }, 1500);
      return;
    }

    caminhoRef.current = [];
    setCaminho([]);
  }, [despachar, estado.encontradas, fala]);

  const marcar = (l: number, c: number) => {
    const atual = caminhoRef.current;
    const ultima = atual[atual.length - 1];
    if (!ultima) return;
    if (atual.some((p) => p.l === l && p.c === c)) return;

    const dl = l - ultima.l;
    const dc = c - ultima.c;
    // sem saltos e apenas horizontal/vertical
    if (Math.abs(dl) + Math.abs(dc) !== 1) return;

    if (!direcao.current) {
      direcao.current = { dl, dc };
    } else if (direcao.current.dl !== dl || direcao.current.dc !== dc) {
      return; // mudança de direção no meio da palavra não é permitida
    }

    atualizar([...atual, { l, c }]);
  };

  const iniciar = (l: number, c: number) => {
    if (limpando.current) window.clearTimeout(limpando.current);
    setErro(null);
    arrastando.current = true;
    direcao.current = null;
    atualizar([{ l, c }]);
  };

  const total = PALAVRAS_CACA.length;
  const achadas = estado.encontradas.length;
  const completo = achadas === total;
  const selecionadas = new Set(caminho.map((p) => chave(p.l, p.c)));

  return (
    <div className="space-y-2">
      <p className="text-[18px] font-semibold">
        Arraste sobre as letras, na ordem, para encontrar as palavras.
      </p>

      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div
          className="mx-auto w-full max-w-[250px] touch-none rounded-2xl border-2 border-investigacao bg-card p-2 shadow-md select-none"
          onPointerUp={finalizar}
          onPointerLeave={finalizar}
        >
          <div className="grid grid-cols-8 gap-1">
            {GRADE_CACA.map((linha, l) =>
              linha.map((letra, c) => {
                const k = chave(l, c);
                const achada = encontradas.has(k);
                const ativa = selecionadas.has(k);
                return (
                  <button
                    key={k}
                    type="button"
                    aria-label={`Letra ${letra}`}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      iniciar(l, c);
                    }}
                    onPointerEnter={() => {
                      if (arrastando.current) marcar(l, c);
                    }}
                    className={cn(
                      "aspect-square rounded-md text-[17px] font-bold transition-colors",
                      achada
                        ? "bg-acerto text-acerto-foreground"
                        : ativa
                          ? erro
                            ? "bg-reorienta text-reorienta-foreground"
                            : "bg-pista text-pista-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-investigacao/15",
                    )}
                  >
                    {letra}
                  </button>
                );
              }),
            )}
          </div>
          <p className="mt-1.5 text-center text-[15px] font-semibold text-muted-foreground">
            {achadas}/{total} · GO · GOES · PLAY · PLAYS
          </p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-pista bg-pista/15 p-2.5">
          <h2 className="mb-1.5 text-[17px] font-bold">🔎 Mural de evidências</h2>
          {achadas === 0 ? (
            <p className="text-[17px] text-muted-foreground">
              Nenhuma evidência ainda. Encontre as palavras na grade!
            </p>
          ) : (
            <ul className="space-y-1.5">
              {estado.encontradas.map((palavra) => {
                const ev = EVIDENCIAS[palavra];
                return (
                  <li
                    key={palavra}
                    className="surge flex items-start gap-2 rounded-xl bg-card p-1.5 shadow-sm"
                  >
                    <span aria-hidden="true" className="text-xl">
                      {ev.icone}
                    </span>
                    <div className="flex-1">
                      <p className="text-[17px] font-bold text-investigacao">
                        {palavra.toLowerCase()}
                      </p>
                      <p className="text-[15px]">{ev.texto}</p>
                    </div>
                    <BotaoAudio texto={ev.fala} id={`evid-${palavra}`} tamanho="sm" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <AreaFeedback>
        {erro ? (
          <Feedback type="error" message={erro} />
        ) : completo ? (
          <Feedback
            type="success"
            message="Todas as evidências reunidas! Repare no final de 'goes' e 'plays'."
          />
        ) : null}
      </AreaFeedback>
    </div>
  );
}
