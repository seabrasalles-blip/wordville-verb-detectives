import { cn } from "@/lib/utils";
import { BotaoAudio } from "./BotaoAudio";

type Variante = "sujeito" | "verbo";

const estilos: Record<Variante, { destaque: string; rotulo: string; bolinha: string }> = {
  sujeito: {
    destaque: "destaque-sujeito",
    rotulo: "text-investigacao",
    bolinha: "bg-investigacao",
  },
  verbo: {
    destaque: "destaque-verbo",
    rotulo: "text-pista-foreground",
    bolinha: "bg-pista",
  },
};

/**
 * Palavra com destaque de cor no próprio texto e minirrótulo logo abaixo,
 * tudo em fluxo normal (sem etiquetas flutuantes).
 */
function PalavraDestacada({
  children,
  variante,
  rotulo,
  atraso = 0,
}: {
  children: string;
  variante: Variante;
  rotulo: string;
  /** Atraso do fade-in, em segundos. */
  atraso?: number;
}) {
  const estilo = estilos[variante];
  return (
    <span
      className="surge inline-flex flex-col items-center leading-tight"
      style={{ animationDelay: `${atraso}s` }}
    >
      <span className={cn("font-bold", estilo.destaque)} lang="en">
        {children}
      </span>
      <span className={cn("mt-0.5 text-[11px] font-bold whitespace-nowrap", estilo.rotulo)}>
        {rotulo}
      </span>
    </span>
  );
}

/** Barra de legenda: bolinha azul = Sujeito, bolinha amarela = Verbo. */
export function LegendaCores({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {(
        [
          ["sujeito", "Sujeito"],
          ["verbo", "Verbo"],
        ] as const
      ).map(([variante, texto]) => (
        <span key={variante} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={cn("size-3 rounded-full", estilos[variante].bolinha)}
          />
          <span className={cn("text-[12px] font-bold", estilos[variante].rotulo)}>{texto}</span>
        </span>
      ))}
    </div>
  );
}

export type Marcacao = {
  /** Trecho antes do sujeito (normalmente vazio). */
  antes?: string;
  sujeito: string;
  /** Trecho entre sujeito e verbo. */
  meio?: string;
  verbo: string;
  /** Trecho depois do verbo. */
  depois?: string;
  /** Complemento da etiqueta do verbo, ex.: "ir". */
  traducaoVerbo: string;
};

/**
 * Cartaz de frase da observação guiada, em largura total:
 * [emoji] — frase com palavras destacadas — [botão de áudio].
 */
export function CartazGuiado({
  icone,
  frase,
  marcacao,
  marcado,
  destacarIcone,
  audioId,
}: {
  icone: string;
  frase: string;
  marcacao: Marcacao;
  marcado: boolean;
  destacarIcone: boolean;
  audioId?: string;
}) {
  return (
    <div className="cartao-pista flex items-center gap-3 border-investigacao px-3 py-2.5">
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-[50px] shrink-0 items-center justify-center rounded-full bg-secondary/60 text-2xl",
          destacarIcone && "pulsa ring-2 ring-investigacao",
        )}
      >
        {icone}
      </span>

      <p className="flex flex-1 flex-wrap items-start justify-center gap-x-2 gap-y-1 text-center text-[24px] font-bold text-investigacao">
        {marcado ? (
          <>
            {marcacao.antes ? <span lang="en">{marcacao.antes}</span> : null}
            <PalavraDestacada variante="sujeito" rotulo="sujeito">
              {marcacao.sujeito}
            </PalavraDestacada>
            {marcacao.meio ? <span lang="en">{marcacao.meio}</span> : null}
            <PalavraDestacada
              variante="verbo"
              rotulo={`verbo = ${marcacao.traducaoVerbo}`}
              atraso={0.25}
            >
              {marcacao.verbo}
            </PalavraDestacada>
            {marcacao.depois ? <span lang="en">{marcacao.depois}</span> : null}
          </>
        ) : (
          <span lang="en">{frase}</span>
        )}
      </p>

      <BotaoAudio texto={frase} id={audioId} tamanho="sm" className="shrink-0" />
    </div>
  );
}
