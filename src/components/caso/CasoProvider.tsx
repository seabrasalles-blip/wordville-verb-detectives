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
  GRADES_VALIDAS,
  PALAVRAS_CACA,
  TOTAL_TELAS,
  gradeEhValida,
  gradePorId,
  mesmoCaminho,
  sortearGradeId,
  type PalavraCaca,
} from "@/lib/caso-conteudo";
import { useFala } from "@/hooks/use-fala";

const CHAVE = "caso-verbos-desaparecidos-v1";

export type ModoCaca = "arrasto" | "toque";
export type Dificuldade = "facilitada" | "padrao" | "desafio";

export type ConfigCaso = {
  /** Narração das falas da Lex em português. */
  audioLex: boolean;
  /** Áudio das palavras e frases em inglês. */
  audioIngles: boolean;
  /** Interação do caça-palavras. */
  modoCaca: ModoCaca;
  /** "facilitada" abre prática extra com 1 erro; "desafio" desliga a prática extra. */
  dificuldade: Dificuldade;
  /** Mostra a tela opcional de novos verbos (like, watch, read). */
  extensaoAtiva: boolean;
};

const configInicial: ConfigCaso = {
  audioLex: true,
  audioIngles: true,
  modoCaca: "arrasto",
  dificuldade: "padrao",
  extensaoAtiva: true,
};

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
  config: ConfigCaso;
  /** Estado da prática extra de cada tela: aberta ou já concluída. */
  ramos: Record<string, "aberto" | "concluido">;
  /** Erros cometidos dentro da prática extra de cada tela. */
  errosRamo: Record<string, number>;
  /** Tempo acumulado em cada tela, em milissegundos. */
  tempos: Record<string, number>;
  /** Situação da tela opcional de novos verbos. */
  extensao: "pendente" | "feita" | "pulada";
};

const inicial: EstadoCaso = {
  iniciou: false,
  tela: 1,
  encontradas: [],
  gradeId: GRADES_VALIDAS[0].id,
  caminhos: {},
  respostas: {},
  tentativas: {},
  conexoes: {},
  montagens: {},
  metacognicao: {},
  observou: false,
  medalha: false,
  config: configInicial,
  ramos: {},
  errosRamo: {},
  tempos: {},
  extensao: "pendente",
};

type Acao =
  | { tipo: "iniciar" }
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
  | { tipo: "config"; mudanca: Partial<ConfigCaso> }
  | { tipo: "abrirRamo"; tela: number }
  | { tipo: "concluirRamo"; tela: number }
  | { tipo: "errarRamo"; tela: number }
  | { tipo: "tempo"; tela: number; ms: number }
  | { tipo: "extensao"; valor: EstadoCaso["extensao"] }
  | { tipo: "restaurar"; estado: EstadoCaso }
  | { tipo: "reiniciar" };

function reducer(estado: EstadoCaso, acao: Acao): EstadoCaso {
  switch (acao.tipo) {
    case "iniciar":
      return { ...estado, iniciou: true };
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
    case "config":
      return { ...estado, config: { ...estado.config, ...acao.mudanca } };
    case "abrirRamo":
      return estado.ramos[acao.tela]
        ? estado
        : { ...estado, ramos: { ...estado.ramos, [acao.tela]: "aberto" } };
    case "concluirRamo":
      return { ...estado, ramos: { ...estado.ramos, [acao.tela]: "concluido" } };
    case "errarRamo":
      return {
        ...estado,
        errosRamo: {
          ...estado.errosRamo,
          [acao.tela]: (estado.errosRamo[acao.tela] ?? 0) + 1,
        },
      };
    case "tempo":
      return {
        ...estado,
        tempos: { ...estado.tempos, [acao.tela]: (estado.tempos[acao.tela] ?? 0) + acao.ms },
      };
    case "extensao":
      return { ...estado, extensao: acao.valor };
    case "restaurar":
      return acao.estado;
    case "reiniciar":
      // as preferências do professor sobrevivem ao recomeço do caso
      return { ...inicial, config: estado.config, gradeId: sortearGradeId(estado.gradeId) };
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

  const booleano = (v: unknown, padrao: boolean) => (typeof v === "boolean" ? v : padrao);

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

  // grade antiga/inválida é trocada por uma válida, preservando as outras telas
  const gradeId =
    typeof d.gradeId === "string" && gradeEhValida(d.gradeId) ? d.gradeId : sortearGradeId();
  const grade = gradePorId(gradeId);

  // só continua registrada a palavra cujo caminho salvo bate com o caminho
  // planejado da grade atual; o resto volta a ficar disponível para busca
  const caminhosValidos: Record<string, { linha: number; coluna: number }[]> = {};
  for (const [palavra, caminho] of Object.entries(caminhos)) {
    const planejado = grade.palavras.find((p) => p.palavra === palavra);
    if (planejado && mesmoCaminho(caminho, planejado.caminho)) caminhosValidos[palavra] = caminho;
  }

  const c = (d.config ?? {}) as Record<string, unknown>;
  const config: ConfigCaso = {
    audioLex: booleano(c.audioLex, configInicial.audioLex),
    audioIngles: booleano(c.audioIngles, configInicial.audioIngles),
    modoCaca: c.modoCaca === "toque" ? "toque" : "arrasto",
    dificuldade:
      c.dificuldade === "facilitada" || c.dificuldade === "desafio"
        ? (c.dificuldade as Dificuldade)
        : "padrao",
    extensaoAtiva: booleano(c.extensaoAtiva, configInicial.extensaoAtiva),
  };

  const ramos: Record<string, "aberto" | "concluido"> = {};
  if (d.ramos && typeof d.ramos === "object") {
    for (const [k, v] of Object.entries(d.ramos as Record<string, unknown>)) {
      if (v === "aberto" || v === "concluido") ramos[k] = v;
    }
  }

  return {
    iniciou: d.iniciou === true,
    tela,
    encontradas: encontradas.filter((p) => caminhosValidos[p]),
    gradeId,
    caminhos: caminhosValidos,
    respostas: registro(d.respostas),
    tentativas: numeros(d.tentativas),
    conexoes: registro(d.conexoes),
    montagens: registro(d.montagens),
    metacognicao: numeros(d.metacognicao),
    observou: d.observou === true,
    medalha: d.medalha === true,
    config,
    ramos,
    errosRamo: numeros(d.errosRamo),
    tempos: numeros(d.tempos),
    extensao:
      d.extensao === "feita" || d.extensao === "pulada" ? (d.extensao as "feita" | "pulada") : "pendente",
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
