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

/** Grade 8x8 com GO, GOES, PLAY e PLAYS escondidas. */
export const GRADE_CACA: string[][] = [
  ["G", "O", "E", "S", "R", "T", "M", "B"],
  ["K", "P", "L", "A", "Y", "S", "D", "N"],
  ["W", "C", "F", "H", "J", "V", "Z", "Q"],
  ["G", "O", "X", "R", "L", "T", "P", "E"],
  ["N", "B", "M", "K", "W", "C", "L", "H"],
  ["P", "L", "A", "Y", "D", "F", "R", "S"],
  ["V", "Z", "Q", "T", "N", "B", "K", "M"],
  ["H", "J", "C", "W", "X", "R", "D", "F"],
];

/** Posições (linha, coluna) de cada palavra na grade. */
export const POSICOES_CACA: Record<PalavraCaca, [number, number][]> = {
  GOES: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  PLAYS: [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
  ],
  GO: [
    [3, 0],
    [3, 1],
  ],
  PLAY: [
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
  ],
};

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

export type Lacuna = {
  id: string;
  antes: string;
  depois: string;
  resposta: string;
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
    ilustracao: "🧒⚽️",
    acertoTexto: "Cartaz consertado! 'I' pede 'play'.",
    dicas: {
      conceitual: "Quem pratica a ação é 'I'. Ele está no grupo de I, you, we e they.",
      procedimental: DICA_SUJEITO,
    },
  },
];

export const PARES_TELA5: { id: string; sujeito: string; icone: string; forma: string }[] = [
  { id: "p-i", sujeito: "I", icone: "🙋", forma: "go" },
  { id: "p-she", sujeito: "She", icone: "👧", forma: "goes" },
  { id: "p-we", sujeito: "We", icone: "👨‍👩‍👧", forma: "go" },
  { id: "p-he", sujeito: "He", icone: "👦", forma: "goes" },
  { id: "p-they", sujeito: "They", icone: "👫", forma: "go" },
];

export const FORMAS_TELA5 = [
  { id: "f1", texto: "goes" },
  { id: "f2", texto: "go" },
  { id: "f3", texto: "go" },
  { id: "f4", texto: "goes" },
  { id: "f5", texto: "go" },
];

/** Tela 9: montar a frase com blocos. */
export type Montagem = {
  id: string;
  icone: string;
  contexto: string;
  sujeito: string;
  fim: string;
  opcoes: string[];
  correta: string;
  acerto: string;
};

export const MONTAGENS: Montagem[] = [
  {
    id: "m-she",
    icone: "👧",
    contexto: "Uma menina brincando no parque.",
    sujeito: "She",
    fim: "in the park.",
    opcoes: ["play", "plays"],
    correta: "plays",
    acerto: "Correto! Com she, usamos plays.",
  },
  {
    id: "m-they",
    icone: "👫",
    contexto: "Duas crianças brincando no parque.",
    sujeito: "They",
    fim: "in the park.",
    opcoes: ["play", "plays"],
    correta: "play",
    acerto: "Correto! Com they, usamos play.",
  },
];

export const ERRO_MONTAGEM = "Observe quem pratica a ação antes de escolher o verbo.";

export const PERGUNTAS_TELA8 = [
  {
    id: "q1",
    titulo: "O que você aprendeu?",
    pergunta: "Com he, she e it, o que acontece com o verbo?",
    opcoes: [
      {
        texto: "O verbo muda: play vira plays e go vira goes",
        correta: true,
        feedback: "Exato! Na escrita, play recebe S e go recebe ES.",
      },
      {
        texto: "O verbo fica igual",
        correta: false,
        feedback: "Compare: 'I go' e 'He goes'. O que mudou no verbo?",
      },
    ],
  },
  {
    id: "q2",
    titulo: "Como descobrir a forma certa?",
    pergunta: "O que você observa primeiro em uma frase?",
    opcoes: [
      {
        texto: "Quem pratica a ação (o sujeito)",
        correta: true,
        feedback: "Isso! Veja o sujeito e depois escolha o verbo.",
      },
      {
        texto: "A palavra mais comprida",
        correta: false,
        feedback: "O tamanho não importa. Observe quem pratica a ação.",
      },
    ],
  },
];
