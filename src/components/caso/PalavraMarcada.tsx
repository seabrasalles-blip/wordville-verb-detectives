import { cn } from "@/lib/utils";
import { BotaoAudio } from "./BotaoAudio";

type Variante = "sujeito" | "verbo";

const estilos: Record<Variante, { caixa: string; etiqueta: string }> = {
  sujeito: {
    caixa: "border-investigacao bg-investigacao/10 text-investigacao",
    etiqueta: "border-investigacao bg-investigacao/15 text-investigacao",
  },
  verbo: {
    caixa: "border-pista bg-pista/40 text-foreground",
    etiqueta: "border-pista bg-pista text-pista-foreground",
  },
};

/**
 * Envolve uma palavra da frase com moldura colorida e etiqueta flutuante
 * ("Sujeito — quem faz a ação" / "Verbo — a ação").
 * A etiqueta fica em position absolute acima da palavra e nunca cobre o texto,
 * porque o cartaz reserva espaço no topo quando há marcações.
 */
export function PalavraMarcada({
  children,
  variante,
  etiqueta,
  atraso = 0,
  nivel = 0,
}: {
  children: string;
  variante: Variante;
  etiqueta: string;
  /** Atraso do fade-in, em segundos. */
  atraso?: number;
  /** 0 = etiqueta logo acima da palavra; 1 = uma fileira mais alta (evita sobreposição). */
  nivel?: 0 | 1;
}) {
  const estilo = estilos[variante];
  return (
    <span className="relative inline-block align-baseline">
      <span
        className={cn(
          "surge absolute bottom-full left-1/2 -translate-x-1/2 rounded-full border-2 px-2 py-[1px] text-[14px] leading-tight font-bold whitespace-nowrap",
          estilo.etiqueta,
        )}
        style={{ animationDelay: `${atraso}s`, marginBottom: nivel === 1 ? 32 : 4 }}
      >
        {etiqueta}
      </span>
      <span
        className={cn("rounded-lg border-2 px-1.5 py-[1px] font-bold", estilo.caixa)}
        lang="en"
      >
        {children}
      </span>
    </span>
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
 * Cartaz de frase da observação guiada: mostra a frase com marcações de
 * sujeito e verbo quando `marcado`, e destaca o ícone durante a explicação.
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
    <div
      className={cn(
        "cartao-pista border-investigacao p-2 text-center transition-[padding]",
        marcado && "pt-12",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block rounded-full text-2xl",
          destacarIcone && "pulsa ring-2 ring-investigacao",
        )}
      >
        {icone}
      </span>

      <p className="mt-0.5 flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-2 text-[20px] font-bold text-investigacao">
        {marcado ? (
          <>
            {marcacao.antes ? <span lang="en">{marcacao.antes}</span> : null}
            <PalavraMarcada variante="sujeito" etiqueta="Sujeito — quem faz a ação" nivel={1}>
              {marcacao.sujeito}
            </PalavraMarcada>
            {marcacao.meio ? <span lang="en">{marcacao.meio}</span> : null}
            <PalavraMarcada
              variante="verbo"
              etiqueta={`Verbo — a ação (${marcacao.traducaoVerbo})`}
              atraso={0.25}
            >
              {marcacao.verbo}
            </PalavraMarcada>
            {marcacao.depois ? <span lang="en">{marcacao.depois}</span> : null}
          </>
        ) : (
          <span lang="en">{frase}</span>
        )}
      </p>

      <div className="mt-1.5 flex justify-center">
        <BotaoAudio texto={frase} id={audioId} tamanho="sm" />
      </div>
    </div>
  );
}
