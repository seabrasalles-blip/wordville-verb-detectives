export const TOTAL_TELAS = 10;

export const PALAVRAS_CACA = ["GO", "GOES", "PLAY", "PLAYS"] as const;
export type PalavraCaca = (typeof PALAVRAS_CACA)[number];

export const EVIDENCIAS: Record<
  PalavraCaca,
  { icone: string; fala: string; texto: string }
> = {
  GO: {
    icone: "🚶‍♀️➡️",
    fala: "go",
    texto: "Você achou 'go'! Significa 'ir'. Clique no alto-falante e escute.",
  },
  GOES: {
    icone: "🚶‍♂️➡️",
    fala: "goes",
    texto: "Achou 'goes'! Compare com 'go': aqui aparece ES no final. Escute a palavra.",
  },
  PLAY: {
    icone: "⚽️🧒",
    fala: "play",
    texto: "'Play'! Significa 'brincar' ou 'jogar'. Escute a palavra.",
  },
  PLAYS: {
    icone: "⚽️👧",
    fala: "plays",
    texto: "'Plays'! Compare com 'play': aqui aparece S no final. Essa é a nossa pista!",
  },
};

export type CelulaGrade = { linha: number; coluna: number };
export type PalavraNaGrade = { palavra: PalavraCaca; caminho: CelulaGrade[] };
export type GradeCaca = { id: string; letras: string[][]; palavras: PalavraNaGrade[] };

/**
 * 8 grades 8x8 pré-validadas: cada palavra tem um caminho planejado próprio e
 * disjunto (nenhuma célula compartilhada), sempre na horizontal esquerda→direita
 * ou na vertical cima→baixo. GO e GOES (assim como PLAY e PLAYS) ocupam posições
 * diferentes: a palavra curta nunca é registrada dentro do caminho da longa.
 */
export const GRADES_CACA: GradeCaca[] = [
  {
    id: "g1",
    letras: [
      ["X", "R", "R", "T", "K", "N", "C", "F"],
      ["W", "B", "Z", "Q", "T", "W", "M", "X"],
      ["Z", "P", "L", "A", "Y", "N", "F", "Z"],
      ["C", "C", "C", "J", "X", "N", "P", "J"],
      ["Q", "G", "O", "E", "S", "X", "L", "T"],
      ["B", "V", "Q", "V", "N", "R", "A", "B"],
      ["T", "Q", "G", "D", "W", "J", "Y", "B"],
      ["J", "Z", "O", "F", "X", "D", "S", "M"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 6, coluna: 2 }, { linha: 7, coluna: 2 }] },
      { palavra: "GOES", caminho: [{ linha: 4, coluna: 1 }, { linha: 4, coluna: 2 }, { linha: 4, coluna: 3 }, { linha: 4, coluna: 4 }] },
      { palavra: "PLAY", caminho: [{ linha: 2, coluna: 1 }, { linha: 2, coluna: 2 }, { linha: 2, coluna: 3 }, { linha: 2, coluna: 4 }] },
      { palavra: "PLAYS", caminho: [{ linha: 3, coluna: 6 }, { linha: 4, coluna: 6 }, { linha: 5, coluna: 6 }, { linha: 6, coluna: 6 }, { linha: 7, coluna: 6 }] },
    ],
  },
  {
    id: "g2",
    letras: [
      ["Z", "N", "J", "T", "W", "V", "W", "Q"],
      ["C", "R", "C", "Z", "G", "O", "M", "W"],
      ["W", "M", "W", "R", "K", "N", "X", "P"],
      ["J", "J", "Q", "H", "R", "F", "K", "L"],
      ["K", "H", "Z", "M", "M", "G", "F", "A"],
      ["P", "L", "A", "Y", "C", "O", "M", "Y"],
      ["T", "K", "H", "Q", "N", "E", "V", "S"],
      ["W", "R", "Z", "J", "X", "S", "T", "H"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 1, coluna: 4 }, { linha: 1, coluna: 5 }] },
      { palavra: "GOES", caminho: [{ linha: 4, coluna: 5 }, { linha: 5, coluna: 5 }, { linha: 6, coluna: 5 }, { linha: 7, coluna: 5 }] },
      { palavra: "PLAY", caminho: [{ linha: 5, coluna: 0 }, { linha: 5, coluna: 1 }, { linha: 5, coluna: 2 }, { linha: 5, coluna: 3 }] },
      { palavra: "PLAYS", caminho: [{ linha: 2, coluna: 7 }, { linha: 3, coluna: 7 }, { linha: 4, coluna: 7 }, { linha: 5, coluna: 7 }, { linha: 6, coluna: 7 }] },
    ],
  },
  {
    id: "g3",
    letras: [
      ["M", "J", "P", "L", "A", "Y", "Q", "V"],
      ["H", "C", "G", "O", "E", "S", "M", "Q"],
      ["X", "W", "C", "M", "K", "X", "C", "D"],
      ["H", "N", "M", "T", "Q", "P", "Q", "H"],
      ["T", "X", "Z", "C", "C", "L", "Z", "B"],
      ["X", "G", "O", "F", "N", "A", "H", "V"],
      ["C", "Q", "D", "N", "H", "Y", "Q", "N"],
      ["Z", "R", "D", "J", "N", "S", "Z", "H"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 5, coluna: 1 }, { linha: 5, coluna: 2 }] },
      { palavra: "GOES", caminho: [{ linha: 1, coluna: 2 }, { linha: 1, coluna: 3 }, { linha: 1, coluna: 4 }, { linha: 1, coluna: 5 }] },
      { palavra: "PLAY", caminho: [{ linha: 0, coluna: 2 }, { linha: 0, coluna: 3 }, { linha: 0, coluna: 4 }, { linha: 0, coluna: 5 }] },
      { palavra: "PLAYS", caminho: [{ linha: 3, coluna: 5 }, { linha: 4, coluna: 5 }, { linha: 5, coluna: 5 }, { linha: 6, coluna: 5 }, { linha: 7, coluna: 5 }] },
    ],
  },
  {
    id: "g4",
    letras: [
      ["P", "H", "M", "M", "F", "C", "R", "F"],
      ["L", "C", "P", "L", "A", "Y", "S", "X"],
      ["A", "Q", "Z", "G", "O", "V", "N", "F"],
      ["Y", "W", "K", "Z", "N", "Q", "M", "F"],
      ["N", "F", "G", "O", "E", "S", "J", "B"],
      ["C", "M", "R", "J", "W", "H", "M", "K"],
      ["C", "H", "D", "X", "X", "H", "M", "Z"],
      ["W", "X", "H", "Z", "V", "R", "R", "T"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 2, coluna: 3 }, { linha: 2, coluna: 4 }] },
      { palavra: "GOES", caminho: [{ linha: 4, coluna: 2 }, { linha: 4, coluna: 3 }, { linha: 4, coluna: 4 }, { linha: 4, coluna: 5 }] },
      { palavra: "PLAY", caminho: [{ linha: 0, coluna: 0 }, { linha: 1, coluna: 0 }, { linha: 2, coluna: 0 }, { linha: 3, coluna: 0 }] },
      { palavra: "PLAYS", caminho: [{ linha: 1, coluna: 2 }, { linha: 1, coluna: 3 }, { linha: 1, coluna: 4 }, { linha: 1, coluna: 5 }, { linha: 1, coluna: 6 }] },
    ],
  },
  {
    id: "g5",
    letras: [
      ["K", "P", "K", "C", "Z", "F", "K", "F"],
      ["G", "L", "V", "P", "V", "N", "N", "J"],
      ["O", "A", "T", "L", "B", "M", "M", "K"],
      ["H", "Y", "Z", "A", "X", "V", "X", "W"],
      ["K", "G", "Q", "Y", "J", "N", "F", "W"],
      ["V", "O", "H", "S", "C", "X", "V", "W"],
      ["Q", "E", "R", "T", "C", "T", "Q", "N"],
      ["D", "S", "W", "J", "Q", "N", "Q", "F"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 1, coluna: 0 }, { linha: 2, coluna: 0 }] },
      { palavra: "GOES", caminho: [{ linha: 4, coluna: 1 }, { linha: 5, coluna: 1 }, { linha: 6, coluna: 1 }, { linha: 7, coluna: 1 }] },
      { palavra: "PLAY", caminho: [{ linha: 0, coluna: 1 }, { linha: 1, coluna: 1 }, { linha: 2, coluna: 1 }, { linha: 3, coluna: 1 }] },
      { palavra: "PLAYS", caminho: [{ linha: 1, coluna: 3 }, { linha: 2, coluna: 3 }, { linha: 3, coluna: 3 }, { linha: 4, coluna: 3 }, { linha: 5, coluna: 3 }] },
    ],
  },
  {
    id: "g6",
    letras: [
      ["M", "J", "B", "N", "W", "F", "N", "T"],
      ["N", "P", "L", "A", "Y", "S", "M", "K"],
      ["F", "D", "D", "W", "H", "Z", "J", "G"],
      ["X", "H", "X", "H", "K", "D", "V", "O"],
      ["G", "O", "D", "N", "X", "K", "H", "E"],
      ["X", "K", "C", "R", "R", "R", "C", "S"],
      ["T", "T", "K", "V", "B", "K", "X", "W"],
      ["M", "C", "P", "L", "A", "Y", "D", "D"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 4, coluna: 0 }, { linha: 4, coluna: 1 }] },
      { palavra: "GOES", caminho: [{ linha: 2, coluna: 7 }, { linha: 3, coluna: 7 }, { linha: 4, coluna: 7 }, { linha: 5, coluna: 7 }] },
      { palavra: "PLAY", caminho: [{ linha: 7, coluna: 2 }, { linha: 7, coluna: 3 }, { linha: 7, coluna: 4 }, { linha: 7, coluna: 5 }] },
      { palavra: "PLAYS", caminho: [{ linha: 1, coluna: 1 }, { linha: 1, coluna: 2 }, { linha: 1, coluna: 3 }, { linha: 1, coluna: 4 }, { linha: 1, coluna: 5 }] },
    ],
  },
  {
    id: "g7",
    letras: [
      ["V", "V", "R", "F", "R", "M", "B", "K"],
      ["D", "Q", "C", "P", "L", "A", "Y", "F"],
      ["R", "K", "W", "N", "Q", "J", "G", "V"],
      ["Q", "G", "Z", "N", "B", "K", "O", "V"],
      ["J", "O", "V", "R", "M", "H", "Z", "Q"],
      ["F", "E", "X", "N", "Z", "M", "R", "Z"],
      ["X", "S", "N", "Z", "V", "T", "X", "R"],
      ["R", "V", "V", "P", "L", "A", "Y", "S"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 2, coluna: 6 }, { linha: 3, coluna: 6 }] },
      { palavra: "GOES", caminho: [{ linha: 3, coluna: 1 }, { linha: 4, coluna: 1 }, { linha: 5, coluna: 1 }, { linha: 6, coluna: 1 }] },
      { palavra: "PLAY", caminho: [{ linha: 1, coluna: 3 }, { linha: 1, coluna: 4 }, { linha: 1, coluna: 5 }, { linha: 1, coluna: 6 }] },
      { palavra: "PLAYS", caminho: [{ linha: 7, coluna: 3 }, { linha: 7, coluna: 4 }, { linha: 7, coluna: 5 }, { linha: 7, coluna: 6 }, { linha: 7, coluna: 7 }] },
    ],
  },
  {
    id: "g8",
    letras: [
      ["P", "K", "C", "C", "K", "X", "B", "C"],
      ["L", "J", "D", "Z", "H", "G", "O", "F"],
      ["A", "V", "W", "T", "Q", "M", "Q", "D"],
      ["Y", "V", "F", "W", "F", "B", "T", "Q"],
      ["K", "W", "J", "T", "X", "N", "B", "G"],
      ["D", "H", "B", "N", "W", "B", "F", "O"],
      ["N", "Q", "F", "Z", "J", "C", "N", "E"],
      ["D", "F", "P", "L", "A", "Y", "S", "S"],
    ],
    palavras: [
      { palavra: "GO", caminho: [{ linha: 1, coluna: 5 }, { linha: 1, coluna: 6 }] },
      { palavra: "GOES", caminho: [{ linha: 4, coluna: 7 }, { linha: 5, coluna: 7 }, { linha: 6, coluna: 7 }, { linha: 7, coluna: 7 }] },
      { palavra: "PLAY", caminho: [{ linha: 0, coluna: 0 }, { linha: 1, coluna: 0 }, { linha: 2, coluna: 0 }, { linha: 3, coluna: 0 }] },
      { palavra: "PLAYS", caminho: [{ linha: 7, coluna: 2 }, { linha: 7, coluna: 3 }, { linha: 7, coluna: 4 }, { linha: 7, coluna: 5 }, { linha: 7, coluna: 6 }] },
    ],
  },
];

const DIRECOES_PERMITIDAS = [
  { dl: 0, dc: 1 },
  { dl: 1, dc: 0 },
];

const chaveCelula = (c: CelulaGrade) => `${c.linha}-${c.coluna}`;

export const mesmoCaminho = (a: CelulaGrade[], b: CelulaGrade[]) =>
  a.length === b.length && a.every((c, i) => c.linha === b[i].linha && c.coluna === b[i].coluna);

export const prefixoDeCaminho = (parcial: CelulaGrade[], caminho: CelulaGrade[]) =>
  parcial.length > 0 &&
  parcial.length < caminho.length &&
  parcial.every((c, i) => c.linha === caminho[i].linha && c.coluna === caminho[i].coluna);

/** Retorna a lista de problemas encontrados na grade (vazia = grade válida). */
export function validarGrade(grade: GradeCaca): string[] {
  const erros: string[] = [];
  const n = grade.letras.length;

  for (const palavra of PALAVRAS_CACA) {
    const ocorrencias = grade.palavras.filter((p) => p.palavra === palavra);
    if (ocorrencias.length !== 1) {
      erros.push(`${grade.id}: ${palavra} precisa de exatamente um caminho planejado`);
      continue;
    }
    const caminho = ocorrencias[0].caminho;
    if (caminho.length !== palavra.length) {
      erros.push(`${grade.id}: caminho de ${palavra} tem tamanho errado`);
      continue;
    }
    // dentro da grade e formando a palavra
    const letras = caminho
      .map((c) =>
        c.linha >= 0 && c.linha < n && c.coluna >= 0 && c.coluna < grade.letras[c.linha].length
          ? grade.letras[c.linha][c.coluna]
          : "?",
      )
      .join("");
    if (letras !== palavra) {
      erros.push(`${grade.id}: caminho de ${palavra} forma "${letras}"`);
    }
    // direção única e permitida
    const dl = caminho[1].linha - caminho[0].linha;
    const dc = caminho[1].coluna - caminho[0].coluna;
    const direcaoOk = DIRECOES_PERMITIDAS.some((d) => d.dl === dl && d.dc === dc);
    const contigua = caminho.every(
      (c, i) =>
        i === 0 ||
        (c.linha - caminho[i - 1].linha === dl && c.coluna - caminho[i - 1].coluna === dc),
    );
    if (!direcaoOk || !contigua) {
      erros.push(`${grade.id}: caminho de ${palavra} não é contínuo em direção permitida`);
    }
  }

  // caminhos totalmente disjuntos entre as quatro palavras
  const vistas = new Map<string, PalavraCaca>();
  for (const { palavra, caminho } of grade.palavras) {
    for (const celula of caminho) {
      const k = chaveCelula(celula);
      const dona = vistas.get(k);
      if (dona && dona !== palavra) {
        erros.push(`${grade.id}: ${palavra} e ${dona} compartilham a célula ${k}`);
      }
      vistas.set(k, palavra);
    }
  }

  // a palavra curta nunca pode ser o prefixo posicional da longa
  const pares: [PalavraCaca, PalavraCaca][] = [
    ["GO", "GOES"],
    ["PLAY", "PLAYS"],
  ];
  for (const [curta, longa] of pares) {
    const a = grade.palavras.find((p) => p.palavra === curta)?.caminho;
    const b = grade.palavras.find((p) => p.palavra === longa)?.caminho;
    if (a && b && a.every((c, i) => b[i] && c.linha === b[i].linha && c.coluna === b[i].coluna)) {
      erros.push(`${grade.id}: ${curta} é o prefixo do caminho de ${longa}`);
    }
  }

  return erros;
}

/** Só grades aprovadas pelo validador chegam à criança. */
export const GRADES_VALIDAS: GradeCaca[] = GRADES_CACA.filter(
  (g) => validarGrade(g).length === 0,
);

export function gradeEhValida(id: string) {
  return GRADES_VALIDAS.some((g) => g.id === id);
}

export function sortearGradeId(atual?: string) {
  const opcoes = GRADES_VALIDAS.filter((g) => g.id !== atual);
  const lista = opcoes.length > 0 ? opcoes : GRADES_VALIDAS;
  return lista[Math.floor(Math.random() * lista.length)].id;
}

export function gradePorId(id: string): GradeCaca {
  return GRADES_VALIDAS.find((g) => g.id === id) ?? GRADES_VALIDAS[0];
}

/** Os dois grupos de sujeitos, usados na observação e na síntese final. */
export const GRUPOS = [
  {
    id: "g1",
    titulo: "I, you, we, they",
    formas: "go · play",
    exemplos: ["We go to school.", "They play in the park."],
    icone: "👫",
  },
  {
    id: "g2",
    titulo: "He, she, it",
    formas: "goes · plays",
    exemplos: ["He goes to school.", "She plays in the park."],
    icone: "👧",
  },
] as const;

export type TipoDica = "conceitual" | "procedimental" | "atencional";

export type FamiliaVerbal = "go" | "play";

export type Lacuna = {
  id: string;
  antes: string;
  depois: string;
  resposta: string;
  /** Verbo pedido pelo significado da frase. */
  familia: FamiliaVerbal;
  /** Ação descrita pela frase, usada nos feedbacks de significado. */
  acao: string;
  ilustracao: string;
  acertoTexto: string;
  dicas: Partial<Record<TipoDica, string>>;
};

const DICA_SUJEITO =
  "Observe quem pratica a ação. A frase começa com I, you, we, they, he, she ou it?";

export const LACUNAS_TELA4: Lacuna[] = [
  {
    id: "t4-he",
    antes: "He",
    depois: "to the park on Sundays.",
    resposta: "goes",
    familia: "go",
    acao: "ir ao parque",
    ilustracao: "👦",
    acertoTexto: "Muito bem! 'He' está no grupo de he, she e it. Por isso: go recebe ES → goes.",
    dicas: {
      conceitual: "Quem pratica a ação é 'He'. Ele está no grupo de he, she e it. Qual forma usamos?",
      procedimental: DICA_SUJEITO,
      atencional: "Compare os grupos: I, you, we, they → go. He, she, it → goes.",
    },
  },
  {
    id: "t4-we",
    antes: "We",
    depois: "to the park on Sundays.",
    resposta: "go",
    familia: "go",
    acao: "ir ao parque",
    ilustracao: "👨‍👩‍👧",
    acertoTexto: "Muito bem! 'We' está no grupo de I, you, we e they. O verbo fica 'go'.",
    dicas: {
      conceitual: "Quem pratica a ação é 'We'. Ele está no grupo de I, you, we e they. Qual forma usamos?",
      procedimental: DICA_SUJEITO,
      atencional: "Compare os grupos: I, you, we, they → go. He, she, it → goes.",
    },
  },
  {
    id: "t4-she",
    antes: "She",
    depois: "to the park on Sundays.",
    resposta: "goes",
    familia: "go",
    acao: "ir ao parque",
    ilustracao: "👧",
    acertoTexto: "Muito bem! 'She' está no grupo de he, she e it. Por isso: go recebe ES → goes.",
    dicas: {
      conceitual: "Quem pratica a ação é 'She'. Ela está no grupo de he, she e it. Qual forma usamos?",
      procedimental: DICA_SUJEITO,
      atencional: "Compare os grupos: I, you, we, they → go. He, she, it → goes.",
    },
  },
];

export const LACUNAS_TELA6: Lacuna[] = [
  {
    id: "t6-she",
    antes: "She",
    depois: "soccer every weekend.",
    resposta: "plays",
    familia: "play",
    acao: "jogar futebol",
    ilustracao: "👧⚽️",
    acertoTexto: "Isso! 'She' está no grupo de he, she e it. Na escrita, play recebe S → plays.",
    dicas: {
      conceitual: "Quem pratica a ação é 'She'. Ela está no grupo de he, she e it. Qual forma usamos?",
      atencional: "Compare com 'She goes'. Escolha o verbo correto para 'She'.",
    },
  },
  {
    id: "t6-i",
    antes: "I",
    depois: "soccer every weekend.",
    resposta: "play",
    familia: "play",
    acao: "jogar futebol",
    ilustracao: "🧒⚽️",
    acertoTexto: "Isso! 'I' está no grupo de I, you, we e they. O verbo fica 'play'.",
    dicas: {
      conceitual: "Quem pratica a ação é 'I'. Ele está no grupo de I, you, we e they. Qual forma usamos?",
      atencional: "Compare com 'I go'. Escolha o verbo correto para 'I'.",
    },
  },
  {
    id: "t6-it",
    antes: "It",
    depois: "in the garden.",
    resposta: "plays",
    familia: "play",
    acao: "brincar no jardim",
    ilustracao: "🐶",
    acertoTexto: "Isso mesmo! Com it, usamos plays.",
    dicas: {
      conceitual: "Observe o sujeito: it pertence ao grupo de he e she.",
      atencional: "O cachorro é 'it'. Compare com 'She plays'. Escolha o verbo correto.",
    },
  },
];

export const LACUNAS_TELA7: Lacuna[] = [
  {
    id: "t7-1",
    antes: "He",
    depois: "to school every day.",
    resposta: "goes",
    familia: "go",
    acao: "ir à escola",
    ilustracao: "👦🏫",
    acertoTexto: "Cartaz consertado! 'He' pede 'goes'.",
    dicas: {
      conceitual: "Quem pratica a ação é 'He'. Ele está no grupo de he, she e it.",
      procedimental: DICA_SUJEITO,
    },
  },
  {
    id: "t7-2",
    antes: "We",
    depois: "to the park on Sundays.",
    resposta: "go",
    familia: "go",
    acao: "ir ao parque",
    ilustracao: "👨‍👩‍👧🌳",
    acertoTexto: "Cartaz consertado! 'We' pede 'go'.",
    dicas: {
      conceitual: "Quem pratica a ação é 'We'. Ele está no grupo de I, you, we e they.",
      procedimental: DICA_SUJEITO,
    },
  },
  {
    id: "t7-3",
    antes: "She",
    depois: "soccer every weekend.",
    resposta: "plays",
    familia: "play",
    acao: "jogar futebol",
    ilustracao: "👧⚽️",
    acertoTexto: "Cartaz consertado! 'She' pede 'plays'.",
    dicas: {
      conceitual: "Quem pratica a ação é 'She'. Ela está no grupo de he, she e it.",
      procedimental: DICA_SUJEITO,
    },
  },
  {
    id: "t7-4",
    antes: "I",
    depois: "soccer every weekend.",
    resposta: "play",
    familia: "play",
    acao: "jogar futebol",
    ilustracao: "🧒⚽️",
    acertoTexto: "Cartaz consertado! 'I' pede 'play'.",
    dicas: {
      conceitual: "Quem pratica a ação é 'I'. Ele está no grupo de I, you, we e they.",
      procedimental: DICA_SUJEITO,
    },
  },
];

export type FormaVerbal = "go" | "goes";

export const PARES_TELA5: {
  id: string;
  sujeito: string;
  icone: string;
  forma: FormaVerbal;
}[] = [
  { id: "p-i", sujeito: "I", icone: "🙋", forma: "go" },
  { id: "p-she", sujeito: "She", icone: "👧", forma: "goes" },
  { id: "p-we", sujeito: "We", icone: "👨‍👩‍👧", forma: "go" },
  { id: "p-he", sujeito: "He", icone: "👦", forma: "goes" },
  { id: "p-they", sujeito: "They", icone: "👫", forma: "go" },
];

/**
 * Cartões da tela 5. O `id` serve só para controlar qual cartão foi usado;
 * a correção linguística usa exclusivamente a `forma` (go / goes).
 */
export const CARTOES_TELA5: { id: string; forma: FormaVerbal }[] = [
  { id: "c1", forma: "goes" },
  { id: "c2", forma: "go" },
  { id: "c3", forma: "goes" },
  { id: "c4", forma: "go" },
  { id: "c5", forma: "go" },
];


/** Tela 9: montar a frase com blocos ordenados. */
export type Montagem = {
  id: string;
  icone: string;
  contexto: string;
  /** Blocos disponíveis, em ordem fixa (inclui distrator). */
  blocos: { id: string; texto: string }[];
  /** Ids dos blocos na ordem correta da frase. */
  solucao: string[];
  acerto: string;
};

export const MONTAGENS: Montagem[] = [
  {
    id: "m-she",
    icone: "👧",
    contexto: "Uma menina brincando no parque.",
    blocos: [
      { id: "b1", texto: "in the park." },
      { id: "b2", texto: "plays" },
      { id: "b3", texto: "She" },
      { id: "b4", texto: "play" },
    ],
    solucao: ["b3", "b2", "b1"],
    acerto: "Correto! Com she, usamos plays.",
  },
  {
    id: "m-they",
    icone: "👫",
    contexto: "Duas crianças brincando no parque.",
    blocos: [
      { id: "c1", texto: "play" },
      { id: "c2", texto: "They" },
      { id: "c3", texto: "in the park." },
      { id: "c4", texto: "plays" },
    ],
    solucao: ["c2", "c1", "c3"],
    acerto: "Correto! Com they, usamos play.",
  },
];

export function fraseDaMontagem(m: Montagem) {
  return m.solucao
    .map((id) => m.blocos.find((b) => b.id === id)?.texto ?? "")
    .join(" ");
}

export const ERRO_MONTAGEM = "Observe a ordem das palavras e a forma do verbo.";

export type OpcaoReflexao = {
  id: string;
  texto: string;
  correta: boolean;
  feedback: string;
};

export const PERGUNTAS_TELA8: {
  id: string;
  titulo: string;
  pergunta: string;
  opcoes: OpcaoReflexao[];
}[] = [
  {
    id: "q1",
    titulo: "O que você aprendeu?",
    pergunta: "Com he, she e it, o que acontece com o verbo?",
    opcoes: [
      {
        id: "q1-a",
        texto: "O verbo muda: play vira plays e go vira goes",
        correta: true,
        feedback: "Exato! Na escrita, play recebe S e go recebe ES.",
      },
      {
        id: "q1-b",
        texto: "O verbo fica igual",
        correta: false,
        feedback:
          "Vamos observar mais uma vez: he, she e it formam um grupo diferente. Compare 'I go' e 'He goes'.",
      },
    ],
  },
  {
    id: "q2",
    titulo: "Como descobrir a forma certa?",
    pergunta: "O que você observa primeiro em uma frase?",
    opcoes: [
      {
        id: "q2-a",
        texto: "Quem pratica a ação (o sujeito)",
        correta: true,
        feedback: "Isso! Veja o sujeito e depois escolha o verbo.",
      },
      {
        id: "q2-b",
        texto: "A palavra mais comprida",
        correta: false,
        feedback: "O tamanho não importa. Observe quem pratica a ação e tente de novo.",
      },
    ],
  },
];


/** Grupo do sujeito, para os feedbacks de concordância. */
export function grupoDoSujeito(sujeito: string): "base" | "terceira" {
  return ["he", "she", "it"].includes(sujeito.trim().toLowerCase()) ? "terceira" : "base";
}

export function familiaDaPalavra(palavra: string): FamiliaVerbal {
  const p = palavra.trim().toLowerCase();
  return p === "go" || p === "goes" ? "go" : "play";
}

/** Sentido do verbo dentro da frase, em português. */
function ideiaDoVerbo(lacuna: Lacuna) {
  if (lacuna.familia === "go") return "ir";
  return lacuna.acao.includes("jogar") ? "jogar" : "brincar";
}

/**
 * Feedback da revisão mista: primeiro o significado da ação, depois o sujeito
 * e só então a comparação completa. Nunca apenas a lista de alternativas.
 */
export function feedbackLacuna(lacuna: Lacuna, palavra: string, tentativa: number) {
  const escolha = palavra.trim().toLowerCase();
  const familiaEscolhida = familiaDaPalavra(escolha);
  const familiaCorreta = familiaEscolhida === lacuna.familia;
  const sujeito = lacuna.antes.trim().toLowerCase();
  const base = lacuna.familia;
  const ideia = ideiaDoVerbo(lacuna);
  const terceira = grupoDoSujeito(sujeito) === "terceira";
  const terminacao = base === "go" ? "ES" : "S";
  const flexionada = base === "go" ? "goes" : "plays";
  const frase = `${lacuna.antes} ${lacuna.resposta} ${lacuna.depois}`;

  // 1) Verbo certo, forma errada: reconhece o que a criança já entendeu.
  if (familiaCorreta) {
    const inicio = `Você encontrou o verbo certo: ${base} significa ${ideia}.`;
    return terceira
      ? `${inicio} Agora observe o sujeito ${lacuna.antes}. Com ${sujeito}, usamos ${flexionada}.`
      : `${inicio} Mas com ${lacuna.antes}, usamos ${base} sem ${terminacao}.`;
  }

  // 2) Terminação já combina com o sujeito, mas o verbo é o outro.
  const marcada = escolha === "goes" || escolha === "plays";
  if (marcada === terceira && tentativa === 0) {
    return `Você percebeu que ${sujeito} pede essa forma, mas observe a ação: a frase fala sobre ${lacuna.acao}. O verbo necessário é ${base}.`;
  }

  // 3) Erro de significado, com progressão pedagógica.
  if (tentativa === 0) {
    return `A frase fala sobre ${lacuna.acao}. Em inglês, usamos o verbo ${base} para expressar a ideia de ${ideia}.`;
  }
  if (tentativa === 1) {
    return terceira
      ? `Você já sabe que o verbo é ${base}. Agora observe o sujeito ${lacuna.antes}: com ${sujeito}, ${base} vira ${flexionada}.`
      : `Você já sabe que o verbo é ${base}. Com ${lacuna.antes}, usamos ${base} sem ${terminacao}.`;
  }
  return `Compare: ${frase}`;
}

