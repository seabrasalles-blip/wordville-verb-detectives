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

/** Componente único de feedback usado em todas as telas. */
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
      role="status"
      aria-live="polite"
      className={cn(
        "surge flex items-start gap-2 rounded-2xl border-2 px-3 py-2 text-[17px] leading-snug shadow-sm",
        estilos[type],
        className,
      )}
    >
      <Icone className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 font-semibold">
        <span className="mr-1 font-bold">{titulo}</span>
        {message}
      </p>
      {semAudio ? null : <FalaLex texto={`${titulo}. ${message}`} rotulo="Ouvir o aviso da Lex" />}

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

/** Área reservada: mantém a altura mesmo sem feedback, evitando saltos de layout. */
export function AreaFeedback({ children }: { children?: React.ReactNode }) {
  return <div className="min-h-[52px]">{children}</div>;
}
