import { useCallback, useRef, useState } from "react";

export type EstadoArrasto = {
  palavra: string;
  x: number;
  y: number;
} | null;

/**
 * Arrastar-e-soltar com Pointer Events (mouse + toque) e, como alternativa
 * acessível, seleção por toque simples: tocar no bloco e depois na lacuna.
 */
export function useArrasto(soltar: (idLacuna: string, palavra: string) => void) {
  const [arrasto, setArrasto] = useState<EstadoArrasto>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const inicio = useRef<{ x: number; y: number } | null>(null);
  const moveu = useRef(false);

  const aoPressionar = useCallback((evento: React.PointerEvent, palavra: string) => {
    if (evento.button !== undefined && evento.button !== 0) return;
    inicio.current = { x: evento.clientX, y: evento.clientY };
    moveu.current = false;
    setArrasto({ palavra, x: evento.clientX, y: evento.clientY });
    (evento.currentTarget as HTMLElement).setPointerCapture?.(evento.pointerId);
  }, []);

  const aoMover = useCallback((evento: React.PointerEvent) => {
    if (!inicio.current) return;
    const dx = evento.clientX - inicio.current.x;
    const dy = evento.clientY - inicio.current.y;
    if (Math.hypot(dx, dy) > 8) moveu.current = true;
    setArrasto((atual) =>
      atual ? { ...atual, x: evento.clientX, y: evento.clientY } : atual,
    );
  }, []);

  const aoSoltar = useCallback(
    (evento: React.PointerEvent, palavra: string) => {
      (evento.currentTarget as HTMLElement).releasePointerCapture?.(evento.pointerId);
      inicio.current = null;
      setArrasto(null);
      if (!moveu.current) {
        setSelecionado((atual) => (atual === palavra ? null : palavra));
        return;
      }
      const alvo = document
        .elementFromPoint(evento.clientX, evento.clientY)
        ?.closest<HTMLElement>("[data-lacuna]");
      if (alvo?.dataset.lacuna) {
        soltar(alvo.dataset.lacuna, palavra);
        setSelecionado(null);
      }
    },
    [soltar],
  );

  const aoClicarLacuna = useCallback(
    (idLacuna: string) => {
      if (!selecionado) return;
      soltar(idLacuna, selecionado);
      setSelecionado(null);
    },
    [selecionado, soltar],
  );

  return {
    arrasto,
    selecionado,
    limparSelecao: () => setSelecionado(null),
    propsBloco: (palavra: string) => ({
      onPointerDown: (e: React.PointerEvent) => aoPressionar(e, palavra),
      onPointerMove: aoMover,
      onPointerUp: (e: React.PointerEvent) => aoSoltar(e, palavra),
      onPointerCancel: () => {
        inicio.current = null;
        setArrasto(null);
      },
      style: { touchAction: "none" as const },
    }),
    aoClicarLacuna,
  };
}

export function Fantasma({ arrasto }: { arrasto: EstadoArrasto }) {
  if (!arrasto) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-4 border-investigacao bg-card px-4 py-2 text-xl font-bold text-investigacao shadow-xl"
      style={{ left: arrasto.x, top: arrasto.y }}
    >
      {arrasto.palavra}
    </span>
  );
}
