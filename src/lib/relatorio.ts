import {
  CARTOES_TELA5,
  LACUNAS_EXTRA,
  LACUNAS_TELA4,
  LACUNAS_TELA6,
  LACUNAS_TELA7,
  MONTAGENS,
  PALAVRAS_CACA,
  PARES_TELA5,
  PERGUNTAS_TELA8,
  TELAS,
  fraseDaMontagem,
} from "@/lib/caso-conteudo";

/** Recorte do estado que o relatório precisa (evita dependência circular). */
export type EstadoRelatorio = {
  encontradas: readonly string[];
  respostas: Record<string, string>;
  tentativas: Record<string, number>;
  conexoes: Record<string, string>;
  montagens: Record<string, string>;
  metacognicao: Record<string, number>;
  observou: boolean;
  medalha: boolean;
  ramos: Record<string, "aberto" | "concluido">;
  errosRamo: Record<string, number>;
  tempos: Record<string, number>;
  extensao: "pendente" | "feita" | "pulada";
};

/** Ids de exercício de cada tela: base para contar erros e acertos. */
export const IDS_POR_TELA: Record<number, string[]> = {
  4: LACUNAS_TELA4.map((l) => l.id),
  5: PARES_TELA5.map((p) => p.id),
  6: LACUNAS_TELA6.map((l) => l.id),
  7: LACUNAS_TELA7.map((l) => l.id),
  8: PERGUNTAS_TELA8.map((q) => q.id),
  9: MONTAGENS.map((m) => m.id),
  10: LACUNAS_EXTRA.map((l) => l.id),
};

export function errosDaTela(estado: EstadoRelatorio, tela: number) {
  const ids = IDS_POR_TELA[tela] ?? [];
  return ids.reduce((soma, id) => soma + (estado.tentativas[id] ?? 0), 0);
}

/** Quantos itens da tela já estão corretos. */
export function acertosDaTela(estado: EstadoRelatorio, tela: number) {
  switch (tela) {
    case 2:
      return estado.encontradas.length;
    case 4:
      return LACUNAS_TELA4.filter((l) => estado.respostas[l.id] === l.resposta).length;
    case 5:
      return PARES_TELA5.filter((p) => {
        const cartao = CARTOES_TELA5.find((c) => c.id === estado.conexoes[p.id]);
        return cartao?.forma === p.forma;
      }).length;
    case 6:
      return LACUNAS_TELA6.filter((l) => estado.respostas[l.id] === l.resposta).length;
    case 7:
      return LACUNAS_TELA7.filter((l) => estado.respostas[l.id] === l.resposta).length;
    case 8:
      return PERGUNTAS_TELA8.filter((q) => {
        const i = estado.metacognicao[q.id];
        return i !== undefined && q.opcoes[i]?.correta === true;
      }).length;
    case 9:
      return MONTAGENS.filter((m) => estado.montagens[m.id] === fraseDaMontagem(m)).length;
    case 10:
      return LACUNAS_EXTRA.filter((l) => estado.respostas[l.id] === l.resposta).length;
    default:
      return 0;
  }
}

export function totalDaTela(tela: number) {
  switch (tela) {
    case 2:
      return PALAVRAS_CACA.length;
    default:
      return IDS_POR_TELA[tela]?.length ?? 0;
  }
}

/**
 * Estrelas da tela: 3 sem erros, 2 com um erro, 1 com dois ou mais.
 * A tela só recebe estrelas quando todos os itens estão corretos.
 */
export function estrelasDaTela(estado: EstadoRelatorio, tela: number) {
  const total = totalDaTela(tela);
  if (total === 0 || acertosDaTela(estado, tela) < total) return 0;
  const erros = errosDaTela(estado, tela) + (estado.errosRamo[tela] ?? 0);
  if (erros === 0) return 3;
  if (erros === 1) return 2;
  return 1;
}

export const TELAS_COM_ESTRELA = [2, 4, 5, 6, 7, 8, 9, 10];

export function estrelasTotais(estado: EstadoRelatorio) {
  return TELAS_COM_ESTRELA.reduce((s, t) => s + estrelasDaTela(estado, t), 0);
}

export const ESTRELAS_MAXIMAS = TELAS_COM_ESTRELA.length * 3;

/** Selos conquistados, para mostrar à criança. */
export function selos(estado: EstadoRelatorio) {
  const lista: { id: string; titulo: string; icone: string; conquistado: boolean }[] = [
    {
      id: "evidencias",
      titulo: "Caçador de evidências",
      icone: "🔍",
      conquistado: estado.encontradas.length === PALAVRAS_CACA.length,
    },
    {
      id: "observador",
      titulo: "Olho de detetive",
      icone: "👀",
      conquistado: estado.observou,
    },
    {
      id: "goes",
      titulo: "Especialista em goes",
      icone: "🏫",
      conquistado: estrelasDaTela(estado, 4) > 0,
    },
    {
      id: "plays",
      titulo: "Especialista em plays",
      icone: "⚽️",
      conquistado: estrelasDaTela(estado, 6) > 0,
    },
    {
      id: "frases",
      titulo: "Construtor de frases",
      icone: "🧱",
      conquistado: estrelasDaTela(estado, 9) > 0,
    },
    {
      id: "extra",
      titulo: "Detetive de novos verbos",
      icone: "🌟",
      conquistado: estrelasDaTela(estado, 10) > 0,
    },
  ];
  return lista;
}

export type LinhaRelatorio = {
  tela: number;
  titulo: string;
  acertos: number;
  total: number;
  erros: number;
  estrelas: number;
  praticaExtra: "não" | "aberta" | "concluída";
  segundos: number;
};

export function relatorio(estado: EstadoRelatorio): LinhaRelatorio[] {
  return TELAS.filter((t) => totalDaTela(t.n) > 0).map((t) => ({
    tela: t.n,
    titulo: t.titulo,
    acertos: acertosDaTela(estado, t.n),
    total: totalDaTela(t.n),
    erros: errosDaTela(estado, t.n) + (estado.errosRamo[t.n] ?? 0),
    estrelas: estrelasDaTela(estado, t.n),
    praticaExtra:
      estado.ramos[t.n] === "concluido" ? "concluída" : estado.ramos[t.n] === "aberto" ? "aberta" : "não",
    segundos: Math.round((estado.tempos[t.n] ?? 0) / 1000),
  }));
}

export function relatorioCsv(estado: EstadoRelatorio) {
  const linhas = relatorio(estado);
  const cabecalho = "tela;titulo;acertos;total;erros;estrelas;pratica_extra;segundos";
  const corpo = linhas.map((l) =>
    [l.tela, l.titulo, l.acertos, l.total, l.erros, l.estrelas, l.praticaExtra, l.segundos].join(";"),
  );
  return [cabecalho, ...corpo].join("\n");
}
