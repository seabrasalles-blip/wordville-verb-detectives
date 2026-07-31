import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import lex from "@/assets/lex.png";
import { BotaoAudio } from "./BotaoAudio";

type Tom = "investigacao" | "acerto" | "reorienta" | "pista";

const tons: Record<Tom, string> = {
  investigacao: "border-investigacao/40 bg-card",
  acerto: "border-acerto bg-acerto/10",
  reorienta: "border-reorienta bg-reorienta/15",
  pista: "border-pista bg-pista/25",
};

const icones: Record<Tom, string> = {
  investigacao: "🕵️‍♀️",
  acerto: "✅",
  reorienta: "🔍",
  pista: "🔎",
};

type Props = {
  children: ReactNode;
  tom?: Tom;
  /** Frase em inglês para o alto-falante opcional do balão. */
  audio?: string;
  /** "lateral" coloca Lex grande embaixo do balão, em coluna própria.
   *  "apresentacao" usa Lex bem grande, ancorada na base, com balão preso acima. */
  variante?: "linha" | "lateral" | "apresentacao";
  className?: string;
};

/** Balão de fala da Inspetora Lex, consistente em todas as telas. */
export function BalaoLex({
  children,
  tom = "investigacao",
  audio,
  variante = "linha",
  className,
}: Props) {
  const balao = (
    <div className={cn("cartao-pista relative flex-1 p-3 text-[17px] leading-snug", tons[tom])}>
      <span
        aria-hidden="true"
        className="absolute -top-4 left-3 grid size-8 place-items-center rounded-full border-2 border-current bg-card text-base shadow-sm"
      >
        {icones[tom]}
      </span>
      <div className="mt-2 space-y-2">{children}</div>
      {audio ? (
        <div className="mt-2">
          <BotaoAudio texto={audio} tamanho="sm" rotulo="Ouvir" />
        </div>
      ) : null}
    </div>
  );

  if (variante === "apresentacao") {
    return (
      <div className={cn("surge flex h-full flex-col justify-end", className)}>
        <div className="relative w-full">
          {balao}
          {/* rabicho ligando o balão à cabeça de Lex */}
          <span
            aria-hidden="true"
            className="absolute -bottom-3 left-10 size-6 rotate-45 border-r-[3px] border-b-[3px] border-investigacao/40 bg-card"
          />
        </div>
        <img
          src={lex}
          alt="Inspetora Lex, a detetive de Wordville"
          width={768}
          height={1024}
          className="mt-2 h-[230px] w-auto self-start object-contain drop-shadow-xl"
        />
      </div>
    );
  }

  if (variante === "lateral") {
    return (
      <div className={cn("surge flex h-full flex-col items-center justify-end gap-1", className)}>
        {balao}
        <img
          src={lex}
          alt="Inspetora Lex, a detetive de Wordville"
          width={768}
          height={1024}
          loading="lazy"
          className="w-28 shrink-0 drop-shadow-xl md:w-32"
        />
      </div>
    );
  }

  return (
    <div className={cn("surge flex items-end gap-2.5", className)}>
      <img
        src={lex}
        alt="Inspetora Lex, a detetive de Wordville"
        width={768}
        height={1024}
        loading="lazy"
        className="hidden w-16 shrink-0 drop-shadow-md sm:block md:w-20"
      />
      {balao}
    </div>
  );
}

/** Frase em inglês destacada dentro dos textos em português. */
export function Ingles({ children }: { children: ReactNode }) {
  return (
    <em className="rounded-lg bg-pista/50 px-1.5 py-0.5 font-semibold text-pista-foreground not-italic">
      {children}
    </em>
  );
}
