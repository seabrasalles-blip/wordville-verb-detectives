import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaso } from "./CasoProvider";

type Props = {
  texto: string;
  id?: string;
  rotulo?: string;
  className?: string;
  tamanho?: "sm" | "md";
};

/** Alto-falante clicável (TTS em inglês). Some quando o navegador não suporta
 *  ou quando o professor desliga o áudio em inglês. */
export function BotaoAudio({ texto, id, rotulo, className, tamanho = "md" }: Props) {
  const { estado, fala } = useCaso();
  if (!fala.suportado || !estado.config.audioIngles) return null;

  const marca = id ?? texto;
  const tocando = fala.falandoId === marca;

  return (
    <button
      type="button"
      onClick={() => fala.falar(texto, marca)}
      aria-label={rotulo ?? `Ouvir ${texto} em inglês`}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full bg-investigacao font-semibold text-investigacao-foreground shadow-md transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-investigacao/40 focus-visible:outline-none",
        tamanho === "md" ? "h-12 min-w-12 px-3 text-base" : "h-10 min-w-10 px-2.5 text-sm",
        tocando && "pulsa",
        className,
      )}
    >
      <Volume2 className={tamanho === "md" ? "size-6" : "size-5"} aria-hidden="true" />
      {rotulo ? <span className="pr-1">{rotulo}</span> : null}
    </button>
  );
}
