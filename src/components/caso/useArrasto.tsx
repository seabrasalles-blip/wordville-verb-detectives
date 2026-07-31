import { useCallback, useRef, useState } from "react";

export type EstadoArrasto = {
  palavra: string;
  x: number;
  y: number;
} | null;

const TOLERANCIA = 24;

/** Encontra a lacuna sob o ponto ou a mais próxima dentro da tolerância. */
function lacunaNoPonto(x: number, y: number): string | null {
  const direto = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-lacuna]");
  if (direto?.dataset.lacuna) return direto.dataset.lacuna;

  let melhor: { id: string; dist: number } | null = null;
  document.querySelectorAll<HTMLElement>("[data-lacuna]").forEach((el) => {
    const r = el.getBoundingClientRect();
    const dx = Math.max(r.left - x, 0, x - r.right);
    const dy = Math.max(r.top - y, 0, y - r.bottom);
    const dist = Math.hypot(dx, dy);
    const id = el.dataset.lacuna;
    if (id && dist <= TOLERANCIA && (!melhor || dist < melhor.dist)) melhor = { id, dist };
  });
  return melhor ? (melhor as { id: string }).id : null;
}

/**
 * Arrastar-e-soltar com Pointer Events (mouse + toque) e, como alternativa,
 * seleção por toque simples: tocar no bloco e depois na lacuna.
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
    setArrasto((atual) => (atual ? { ...atual, x: evento.clientX, y: evento.clientY } : atual));
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
      const alvo = lacunaNoPonto(evento.clientX, evento.clientY);
      if (alvo) {
        soltar(alvo, palavra);
        setSelecionado(null);
      }
      // fora de qualquer lacuna: o bloco simplesmente volta ao banco
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
