import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  GRADES_CACA,
  PALAVRAS_CACA,
  TOTAL_TELAS,
  sortearGradeId,
  type PalavraCaca,
} from "@/lib/caso-conteudo";
import { useFala } from "@/hooks/use-fala";

const CHAVE = "caso-verbos-desaparecidos-v1";

export type EstadoCaso = {
  /** Falso enquanto a criança está na capa. */
  iniciou: boolean;
  tela: number;
  encontradas: PalavraCaca[];
  /** Grade sorteada para a tentativa atual do caça-palavras. */
  gradeId: string;
  /** Caminho de células de cada palavra encontrada na grade atual. */
  caminhos: Record<string, { linha: number; coluna: number }[]>;
  respostas: Record<string, string>;
  tentativas: Record<string, number>;
  conexoes: Record<string, string>;
  montagens: Record<string, string>;
  metacognicao: Record<string, number>;
  observou: boolean;
  medalha: boolean;
};

const inicial: EstadoCaso = {
  iniciou: false,
  tela: 1,
  encontradas: [],
  gradeId: GRADES_CACA[0].id,
  caminhos: {},
  respostas: {},
  tentativas: {},
  conexoes: {},
  montagens: {},
  metacognicao: {},
  observou: false,
  medalha: false,
};


type Acao =
  | { tipo: "ir"; tela: number }
  | { tipo: "avancar" }
  | { tipo: "voltar" }
  | { tipo: "encontrou"; palavra: PalavraCaca; caminho: { linha: number; coluna: number }[] }
  | { tipo: "novaGrade" }
  | { tipo: "responder"; id: string; valor: string }
  | { tipo: "errar"; id: string }
  | { tipo: "conectar"; id: string; forma: string }
  | { tipo: "montar"; id: string; valor: string }
  | { tipo: "observou" }
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
        : {
            ...estado,
            encontradas: [...estado.encontradas, acao.palavra],
            caminhos: { ...estado.caminhos, [acao.palavra]: acao.caminho },
          };
    case "novaGrade":
      return {
        ...estado,
        gradeId: sortearGradeId(estado.gradeId),
        encontradas: [],
        caminhos: {},
      };
    case "responder":
      return { ...estado, respostas: { ...estado.respostas, [acao.id]: acao.valor } };
    case "errar":
      return {
        ...estado,
        tentativas: { ...estado.tentativas, [acao.id]: (estado.tentativas[acao.id] ?? 0) + 1 },
      };
    case "conectar":
      return { ...estado, conexoes: { ...estado.conexoes, [acao.id]: acao.forma } };
    case "montar":
      return { ...estado, montagens: { ...estado.montagens, [acao.id]: acao.valor } };
    case "observou":
      return { ...estado, observou: true };
    case "metacognicao":
      return { ...estado, metacognicao: { ...estado.metacognicao, [acao.id]: acao.indice } };
    case "medalha":
      return { ...estado, medalha: true };
    case "restaurar":
      return acao.estado;
    case "reiniciar":
      return { ...inicial, gradeId: sortearGradeId(estado.gradeId) };
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

/** Aceita apenas dados salvos com a forma esperada; ignora o que estiver corrompido. */
function sanear(dados: unknown): EstadoCaso {
  if (!dados || typeof dados !== "object") return inicial;
  const d = dados as Record<string, unknown>;

  const registro = (v: unknown): Record<string, string> => {
    if (!v || typeof v !== "object") return {};
    const saida: Record<string, string> = {};
    for (const [k, valor] of Object.entries(v as Record<string, unknown>)) {
      if (typeof valor === "string") saida[k] = valor;
    }
    return saida;
  };

  const numeros = (v: unknown): Record<string, number> => {
    if (!v || typeof v !== "object") return {};
    const saida: Record<string, number> = {};
    for (const [k, valor] of Object.entries(v as Record<string, unknown>)) {
      if (typeof valor === "number" && Number.isFinite(valor)) saida[k] = valor;
    }
    return saida;
  };

  const tela =
    typeof d.tela === "number" && Number.isInteger(d.tela) && d.tela >= 1 && d.tela <= TOTAL_TELAS
      ? d.tela
      : 1;

  const encontradas = Array.isArray(d.encontradas)
    ? (d.encontradas.filter(
        (p): p is PalavraCaca => typeof p === "string" && (PALAVRAS_CACA as readonly string[]).includes(p),
      ) as PalavraCaca[])
    : [];

  const caminhos: Record<string, { linha: number; coluna: number }[]> = {};
  if (d.caminhos && typeof d.caminhos === "object") {
    for (const [k, v] of Object.entries(d.caminhos as Record<string, unknown>)) {
      if (!Array.isArray(v)) continue;
      const celulas = v.filter(
        (c): c is { linha: number; coluna: number } =>
          !!c &&
          typeof c === "object" &&
          Number.isInteger((c as { linha: unknown }).linha) &&
          Number.isInteger((c as { coluna: unknown }).coluna),
      );
      if (celulas.length > 0 && encontradas.includes(k as PalavraCaca)) caminhos[k] = celulas;
    }
  }

  const gradeId =
    typeof d.gradeId === "string" && GRADES_CACA.some((g) => g.id === d.gradeId)
      ? d.gradeId
      : GRADES_CACA[0].id;

  return {
    tela,
    encontradas: encontradas.filter((p) => caminhos[p]),
    gradeId,
    caminhos,
    respostas: registro(d.respostas),
    tentativas: numeros(d.tentativas),
    conexoes: registro(d.conexoes),
    montagens: registro(d.montagens),
    metacognicao: numeros(d.metacognicao),
    observou: d.observou === true,
    medalha: d.medalha === true,
  };
}

export function CasoProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducer, inicial);
  const fala = useFala();

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE);
      if (salvo) {
        despachar({ tipo: "restaurar", estado: sanear(JSON.parse(salvo)) });
      } else {
        despachar({ tipo: "novaGrade" });
      }
    } catch {
      /* localStorage indisponível ou corrompido: começa do início */
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
  }, [fala]);

  const voltar = useCallback(() => {
    fala.parar();
    despachar({ tipo: "voltar" });
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
