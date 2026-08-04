import { useEffect } from "react";
import { Check, Search, Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedbackType = "success" | "error" | "hint";

export interface FeedbackProps {
  type: FeedbackType;
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  /** Desliga o alto-falante do feedback (usado em avisos muito curtos). */
  semAudio?: boolean;
  className?: string;
}

const estilos: Record<FeedbackType, string> = {
  success: "border-acerto bg-acerto/10",
  error: "border-reorienta bg-reorienta/15",
  hint: "border-pista bg-pista/25",
};

const icones: Record<FeedbackType, typeof Check> = {
  success: Check,
  error: Search,
  hint: Lightbulb,
};

const titulos: Record<FeedbackType, string> = {
  success: "Boa investigação!",
  error: "Vamos observar de novo",
  hint: "Pista da Lex",
};

/**
 * Componente único de feedback usado em todas as telas.
 * Fica sempre no fluxo do layout: nunca usa position fixed/absolute nem portal.
 */
export function Feedback({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  semAudio = false,
  className,
}: FeedbackProps) {
  useEffect(() => {
    if (!autoClose || !onClose) return;
    const t = window.setTimeout(onClose, 2800);
    return () => window.clearTimeout(t);
  }, [autoClose, onClose, message, type]);

  const Icone = icones[type];
  const titulo = title ?? titulos[type];

  return (
    <div
      className={cn(
        "surge flex items-start gap-2 rounded-2xl border-2 px-3 py-2 text-[17px] leading-snug shadow-sm transition-opacity duration-300",
        estilos[type],
        className,
      )}
    >
      <Icone className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p className="line-clamp-2 flex-1 font-semibold">
        <span className="mr-1 font-bold">{titulo}</span>
        {message}
      </p>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar aviso"
          className="shrink-0 rounded-full p-1 hover:bg-black/5"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

/**
 * Espaço reservado para o feedback da atividade.
 * Mantém a altura mesmo sem mensagem (evita saltos de layout) e nunca sobrepõe
 * outros elementos: participa do fluxo normal da tela.
 */
export function FeedbackSlot({
  children,
  tom = "polite",
  className,
}: {
  children?: React.ReactNode;
  /** "assertive" para erros que pedem atenção imediata. */
  tom?: "polite" | "assertive";
  className?: string;
}) {
  const urgente = tom === "assertive";
  return (
    <div
      role={urgente ? "alert" : "status"}
      aria-live={urgente ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn("flex w-full min-h-[60px] items-center", className)}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}

/** Alias histórico do espaço reservado de feedback. */
export function AreaFeedback({
  children,
  tom,
}: {
  children?: React.ReactNode;
  tom?: "polite" | "assertive";
}) {
  return <FeedbackSlot tom={tom}>{children}</FeedbackSlot>;
}
