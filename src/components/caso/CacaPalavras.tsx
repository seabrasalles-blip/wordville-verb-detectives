import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  EVIDENCIAS,
  PALAVRAS_CACA,
  gradePorId,
  type PalavraCaca,
} from "@/lib/caso-conteudo";
import { useCaso } from "./CasoProvider";
import { BotaoAudio } from "./BotaoAudio";
import { AreaFeedback, Feedback } from "./Feedback";

type Celula = { linha: number; coluna: number };

function chave(l: number, c: number) {
  return `${l}-${c}`;
}

export function CacaPalavras() {
  const { estado, despachar, fala } = useCaso();
  const grade = gradePorId(estado.gradeId);
  const [caminho, setCaminho] = useState<Celula[]>([]);
  const [aviso, setAviso] = useState<{ tipo: "success" | "error" | "hint"; texto: string } | null>(
    null,
  );
  const arrastando = useRef(false);
  const caminhoRef = useRef<Celula[]>([]);
  const direcao = useRef<{ dl: number; dc: number } | null>(null);
  const limpando = useRef<number | null>(null);
  const contínuo = useRef(true);
  const direcaoInvalida = useRef(false);


  const encontradas = new Set<string>(
    Object.values(estado.caminhos).flatMap((cs) => cs.map((p) => chave(p.linha, p.coluna))),
  );

  const atualizar = (proximo: Celula[]) => {
    caminhoRef.current = proximo;
    setCaminho(proximo);
  };

  const limparDepois = (ms = 1600) => {
    if (limpando.current) window.clearTimeout(limpando.current);
    limpando.current = window.setTimeout(() => {
      caminhoRef.current = [];
      setCaminho([]);
      setAviso(null);
    }, ms);
  };

  const finalizar = useCallback(() => {
    if (!arrastando.current) return;
    arrastando.current = false;
    const atual = caminhoRef.current;
    direcao.current = null;
    if (atual.length < 2) {
      caminhoRef.current = [];
      setCaminho([]);
      return;
    }

    const texto = atual.map((p) => grade.letras[p.linha][p.coluna]).join("").toUpperCase();

    if (!contínuo.current) {
      setAviso({
        tipo: "error",
        texto: direcaoInvalida.current
          ? "Leia da esquerda para a direita ou de cima para baixo."
          : "As letras precisam estar ligadas e na ordem.",
      });
      limparDepois();
      return;
    }


    const palavra = (PALAVRAS_CACA as readonly string[]).includes(texto)
      ? (texto as PalavraCaca)
      : null;

    if (palavra && estado.encontradas.includes(palavra)) {
      setAviso({ tipo: "hint", texto: "Essa evidência já está no mural. Procure outra palavra." });
      limparDepois();
      return;
    }

    if (palavra) {
      caminhoRef.current = [];
      setCaminho([]);
      setAviso({ tipo: "success", texto: `Você encontrou ${palavra}!` });
      despachar({ tipo: "encontrou", palavra, caminho: atual });
      fala.falar(EVIDENCIAS[palavra].fala, `evid-${palavra}`);
      return;
    }

    const prefixo = PALAVRAS_CACA.some((p) => p.startsWith(texto) && p !== texto);
    setAviso(
      prefixo
        ? {
            tipo: "hint",
            texto: "Você encontrou o começo de uma palavra. Observe se falta alguma letra.",
          }
        : {
            tipo: "error",
            texto:
              "Essa sequência ainda não é uma das palavras do mural. Observe as letras e tente novamente.",
          },
    );
    limparDepois();
  }, [despachar, estado.encontradas, fala, grade]);

  const marcar = (linha: number, coluna: number) => {
    const atual = caminhoRef.current;
    const ultima = atual[atual.length - 1];
    if (!ultima) return;
    if (atual.some((p) => p.linha === linha && p.coluna === coluna)) return;

    const dl = linha - ultima.linha;
    const dc = coluna - ultima.coluna;
    // apenas horizontal esquerda→direita e vertical cima→baixo
    const permitida = (dl === 0 && dc === 1) || (dl === 1 && dc === 0);

    if (!permitida) {
      contínuo.current = false;
      direcaoInvalida.current = true;
      atualizar([...atual, { linha, coluna }]);
      return;
    }
    if (!direcao.current) {
      direcao.current = { dl, dc };
    } else if (direcao.current.dl !== dl || direcao.current.dc !== dc) {
      contínuo.current = false;
      direcaoInvalida.current = true;
    }
    atualizar([...atual, { linha, coluna }]);
  };


  const iniciar = (linha: number, coluna: number) => {
    if (limpando.current) window.clearTimeout(limpando.current);
    setAviso(null);
    arrastando.current = true;
    direcao.current = null;
    contínuo.current = true;
    direcaoInvalida.current = false;

    atualizar([{ linha, coluna }]);
  };

  const total = PALAVRAS_CACA.length;
  const achadas = estado.encontradas.length;
  const completo = achadas === total;
  const selecionadas = new Set(caminho.map((p) => chave(p.linha, p.coluna)));
  const erroAtivo = aviso?.tipo === "error";

  return (
    <div className="space-y-2">
      <p className="text-[18px] font-semibold">
        Encontre as palavras na horizontal ou na vertical. Leia da esquerda para a direita ou de
        cima para baixo.

      </p>

      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div
          className="mx-auto w-full max-w-[250px] touch-none rounded-2xl border-2 border-investigacao bg-card p-2 shadow-md select-none"
          onPointerUp={finalizar}
          onPointerLeave={finalizar}
        >
          <div className="grid grid-cols-8 gap-1">
            {grade.letras.map((linha, l) =>
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
                          ? erroAtivo
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
        {completo ? (
          <Feedback
            type="success"
            message="Todas as evidências reunidas! Repare no final de 'goes' e 'plays'."
          />
        ) : aviso ? (
          <Feedback type={aviso.tipo} message={aviso.texto} onClose={() => setAviso(null)} />
        ) : null}
      </AreaFeedback>
    </div>
  );
}
