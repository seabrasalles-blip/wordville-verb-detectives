import {
  CARTOES_TELA5,
  LACUNAS_EXTRA,
  LACUNAS_TELA11,
  LACUNAS_TELA4,
  LACUNAS_TELA6,
  LACUNAS_TELA7,
  MONTAGENS,
  PALAVRAS_CACA,
  PARES_TELA5,
  PERGUNTAS_TELA8,
  TELA_CENARIOS,
  TELA_EXTRA,
  TELA_FINAL,
  fraseDaMontagem,
} from "@/lib/caso-conteudo";

/** Recorte do estado necessário para decidir se a tela está concluída. */
export type EstadoConclusao = {
  encontradas: readonly string[];
  respostas: Record<string, string>;
  conexoes: Record<string, string>;
  montagens: Record<string, string>;
  metacognicao: Record<string, number>;
  observou: boolean;
  medalha: boolean;
  ramos: Record<string, "aberto" | "concluido">;
  extensao: "pendente" | "feita" | "pulada";
  config: { extensaoAtiva: boolean };
};

/** Critério pedagógico de conclusão de cada tela. */
export function telaConcluida(tela: number, estado: EstadoConclusao): boolean {
  // enquanto a prática extra está aberta, a tela não avança
  if (estado.ramos[tela] === "aberto") return false;
  switch (tela) {
    case 1:
      // apenas o registro da hipótese inicial; não há certo nem errado
      return estado.respostas["t1-investigou"] === "sim";
    case 2:
      return estado.encontradas.length === PALAVRAS_CACA.length;
    case 3:
      return estado.observou;
    case 4:
      return LACUNAS_TELA4.every((l) => estado.respostas[l.id] === l.resposta);
    case 5:
      return PARES_TELA5.every((p) => {
        const cartao = CARTOES_TELA5.find((c) => c.id === estado.conexoes[p.id]);
        return cartao?.forma === p.forma;
      });
    case 6:
      return LACUNAS_TELA6.every((l) => estado.respostas[l.id] === l.resposta);
    case 7:
      return LACUNAS_TELA7.every((l) => estado.respostas[l.id] === l.resposta);
    case 8:
      return PERGUNTAS_TELA8.every((q) => {
        const i = estado.metacognicao[q.id];
        return i !== undefined && q.opcoes[i]?.correta === true;
      });
    case 9:
      return MONTAGENS.every((m) => estado.montagens[m.id] === fraseDaMontagem(m));
    case TELA_EXTRA:
      if (!estado.config.extensaoAtiva) return true;
      if (estado.extensao === "pulada") return true;
      return LACUNAS_EXTRA.every((l) => estado.respostas[l.id] === l.resposta);
    case TELA_CENARIOS:
      return LACUNAS_TELA11.every((l) => estado.respostas[l.id] === l.resposta);
    case TELA_FINAL:
      return estado.medalha;
    default:
      return true;
  }
}
