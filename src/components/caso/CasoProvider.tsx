import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { TOTAL_TELAS, type PalavraCaca } from "@/lib/caso-conteudo";
import { useFala } from "@/hooks/use-fala";

const CHAVE = "caso-verbos-desaparecidos-v1";

export type EstadoCaso = {
  tela: number;
  encontradas: PalavraCaca[];
  respostas: Record<string, string>;
  tentativas: Record<string, number>;
  conexoes: Record<string, string>;
  metacognicao: Record<string, number>;
  medalha: boolean;
};

const inicial: EstadoCaso = {
  tela: 1,
  encontradas: [],
  respostas: {},
  tentativas: {},
  conexoes: {},
  metacognicao: {},
  medalha: false,
};

type Acao =
  | { tipo: "ir"; tela: number }
  | { tipo: "avancar" }
  | { tipo: "voltar" }
  | { tipo: "encontrou"; palavra: PalavraCaca }
  | { tipo: "responder"; id: string; valor: string }
  | { tipo: "errar"; id: string }
  | { tipo: "conectar"; id: string; forma: string }
  | { tipo: "metacognicao"; id: string; indice: number }
  | { tipo: "medalha" }
  | { tipo: "restaurar"; estado: EstadoCaso }
  | { tipo: "reiniciar" };

function reducer(estado: EstadoCaso, acao: Acao): EstadoCaso {
  switch (acao.tipo) {
    case "ir":
      return { ...estado, tela: Math.min(TOTAL_TELAS, Math.max(1, acao.tela)) };
    case "avancar":
      return { ...estado, tela: Math.min(TOTAL_TELAS, estado.tela + 1) };
    case "voltar":
      return { ...estado, tela: Math.max(1, estado.tela - 1) };
    case "encontrou":
      return estado.encontradas.includes(acao.palavra)
        ? estado
        : { ...estado, encontradas: [...estado.encontradas, acao.palavra] };
    case "responder":
      return { ...estado, respostas: { ...estado.respostas, [acao.id]: acao.valor } };
    case "errar":
      return {
        ...estado,
        tentativas: { ...estado.tentativas, [acao.id]: (estado.tentativas[acao.id] ?? 0) + 1 },
      };
    case "conectar":
      return { ...estado, conexoes: { ...estado.conexoes, [acao.id]: acao.forma } };
    case "metacognicao":
      return { ...estado, metacognicao: { ...estado.metacognicao, [acao.id]: acao.indice } };
    case "medalha":
      return { ...estado, medalha: true };
    case "restaurar":
      return acao.estado;
    case "reiniciar":
      return inicial;
    default:
      return estado;
  }
}

type ContextoCaso = {
  estado: EstadoCaso;
  despachar: React.Dispatch<Acao>;
  avancar: () => void;
  voltar: () => void;
  reiniciar: () => void;
  fala: ReturnType<typeof useFala>;
};

const Contexto = createContext<ContextoCaso | null>(null);

export function CasoProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducer, inicial);
  const fala = useFala();

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE);
      if (salvo) {
        const dados = JSON.parse(salvo) as Partial<EstadoCaso>;
        despachar({ tipo: "restaurar", estado: { ...inicial, ...dados } });
      }
    } catch {
      /* localStorage indisponível: segue sem retomada */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
      /* ignora quota/modo privado */
    }
  }, [estado]);

  const avancar = useCallback(() => {
    fala.parar();
    despachar({ tipo: "avancar" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fala]);

  const voltar = useCallback(() => {
    fala.parar();
    despachar({ tipo: "voltar" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fala]);

  const reiniciar = useCallback(() => {
    fala.parar();
    despachar({ tipo: "reiniciar" });
  }, [fala]);

  const valor = useMemo(
    () => ({ estado, despachar, avancar, voltar, reiniciar, fala }),
    [estado, avancar, voltar, reiniciar, fala],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCaso() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useCaso precisa estar dentro de <CasoProvider>");
  return ctx;
}
