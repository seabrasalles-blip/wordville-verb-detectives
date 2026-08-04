import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { FALAS, LACUNAS_TELA11, PERGUNTAS_TELA8 } from "./caso-conteudo";
import { telaConcluida, type EstadoConclusao } from "./conclusao";
import { estrelasDaTela, errosDaTela, relatorio, type EstadoRelatorio } from "./relatorio";

const base: EstadoConclusao & EstadoRelatorio = {
  encontradas: [],
  respostas: {},
  tentativas: {},
  conexoes: {},
  montagens: {},
  metacognicao: {},
  observou: false,
  medalha: false,
  ramos: {},
  errosRamo: {},
  tempos: {},
  extensao: "pendente",
  config: { extensaoAtiva: true },
};

function arquivosFonte(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return arquivosFonte(caminho);
    return /\.(ts|tsx)$/.test(nome) && !nome.endsWith(".test.ts") ? [caminho] : [];
  });
}

describe("abertura (Tela 1)", () => {
  it("a fala inicial não revela a frase corrigida", () => {
    expect(FALAS.t1.join(" ")).not.toContain("goes");
  });

  it("não conclui sem hipótese registrada", () => {
    expect(telaConcluida(1, base)).toBe(false);
  });

  it("qualquer uma das quatro hipóteses libera a continuação", () => {
    for (const valor of ["he", "go", "to-school", "nao-sei"]) {
      const estado = {
        ...base,
        respostas: { "t1-hipotese": valor, "t1-investigou": "sim" },
      };
      expect(telaConcluida(1, estado)).toBe(true);
      // a hipótese não gera erro nem prática extra
      expect(errosDaTela(estado, 1)).toBe(0);
      expect(estado.ramos[1]).toBeUndefined();
    }
  });
});

describe("Tela 11 — novos cenários", () => {
  const tela = 11;

  it("não conclui com itens vazios", () => {
    expect(telaConcluida(tela, base)).toBe(false);
  });

  it("não conclui com apenas parte dos itens corretos", () => {
    const respostas: Record<string, string> = {};
    respostas[LACUNAS_TELA11[0].id] = LACUNAS_TELA11[0].resposta;
    expect(telaConcluida(tela, { ...base, respostas })).toBe(false);
  });

  it("conclui quando todos os itens estão corretos", () => {
    const respostas = Object.fromEntries(LACUNAS_TELA11.map((l) => [l.id, l.resposta]));
    expect(telaConcluida(tela, { ...base, respostas })).toBe(true);
  });

  it("estado restaurado do localStorage mantém a conclusão", () => {
    const respostas = Object.fromEntries(LACUNAS_TELA11.map((l) => [l.id, l.resposta]));
    const restaurado = JSON.parse(JSON.stringify({ ...base, respostas })) as EstadoConclusao;
    expect(telaConcluida(tela, restaurado)).toBe(true);
  });
});

describe("estrelas não punitivas", () => {
  const completo: EstadoRelatorio = {
    ...base,
    metacognicao: Object.fromEntries(
      PERGUNTAS_TELA8.map((q) => [q.id, q.opcoes.findIndex((o) => o.correta)]),
    ),
  };

  it("tela incompleta retorna zero", () => {
    expect(estrelasDaTela(base, 8)).toBe(0);
  });

  it("tela concluída retorna três", () => {
    expect(estrelasDaTela(completo, 8)).toBe(3);
  });

  it("erros não alteram as estrelas", () => {
    const comErros: EstadoRelatorio = {
      ...completo,
      tentativas: Object.fromEntries(PERGUNTAS_TELA8.map((q) => [q.id, 4])),
      errosRamo: { 8: 3 },
    };
    expect(estrelasDaTela(comErros, 8)).toBe(3);
    // os erros seguem registrados para o professor
    expect(errosDaTela(comErros, 8)).toBeGreaterThan(0);
    const linha = relatorio(comErros).find((l) => l.tela === 8)!;
    expect(linha.erros).toBeGreaterThan(0);
    expect(linha.estrelas).toBe(3);
  });
});

describe("conteúdo pedagógico", () => {
  const proibidos = [
    "sempre combina com goes",
    "sempre combina com plays",
    "'I'. Ele",
    "'We'. Ele",
    "I pede",
    "We pede",
    "He pede",
    "She pede",
  ];

  it("não contém formulações imprecisas", () => {
    for (const arquivo of arquivosFonte("src")) {
      const texto = readFileSync(arquivo, "utf8");
      for (const proibido of proibidos) {
        expect(texto.includes(proibido), `${arquivo} contém "${proibido}"`).toBe(false);
      }
    }
  });
});
