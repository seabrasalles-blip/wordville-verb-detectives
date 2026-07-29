import { describe, expect, it } from "vitest";
import { GRADES_CACA, GRADES_VALIDAS, PALAVRAS_CACA, validarGrade } from "./caso-conteudo";

describe("grades do caça-palavras", () => {
  it("todas as grades passam no validador", () => {
    for (const grade of GRADES_CACA) {
      expect(validarGrade(grade)).toEqual([]);
    }
  });

  it("mantém entre 6 e 10 grades válidas", () => {
    expect(GRADES_VALIDAS.length).toBeGreaterThanOrEqual(6);
    expect(GRADES_VALIDAS.length).toBeLessThanOrEqual(10);
  });

  it("cada grade tem as quatro palavras em caminhos disjuntos", () => {
    for (const grade of GRADES_VALIDAS) {
      const celulas = new Set<string>();
      for (const palavra of PALAVRAS_CACA) {
        const alvo = grade.palavras.find((p) => p.palavra === palavra);
        expect(alvo, `${grade.id} sem ${palavra}`).toBeTruthy();
        for (const c of alvo!.caminho) celulas.add(`${c.linha}-${c.coluna}`);
      }
      expect(celulas.size).toBe(2 + 4 + 4 + 5);
    }
  });
});
