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

export type GradeCaca = { id: string; letras: string[][] };

/** 8 grades 8x8 pré-validadas: cada uma contém GO, GOES, PLAY e PLAYS. */
export const GRADES_CACA: GradeCaca[] = [
  {
    id: "g1",
    letras: [
    ["P", "L", "A", "Y", "V", "K", "W", "B"],
    ["M", "X", "Z", "M", "G", "T", "M", "M"],
    ["X", "Q", "B", "W", "O", "F", "J", "Q"],
    ["F", "R", "W", "K", "E", "Q", "Q", "Z"],
    ["V", "C", "Z", "M", "S", "V", "W", "J"],
    ["T", "T", "D", "X", "O", "F", "J", "V"],
    ["T", "Z", "B", "G", "Z", "C", "Q", "V"],
    ["J", "J", "M", "S", "Y", "A", "L", "P"],
    ],
  },
  {
    id: "g2",
    letras: [
    ["Y", "J", "R", "J", "H", "T", "J", "X"],
    ["A", "G", "O", "E", "S", "W", "T", "T"],
    ["L", "T", "X", "J", "V", "X", "M", "Z"],
    ["P", "N", "Z", "T", "X", "X", "T", "X"],
    ["Z", "L", "M", "R", "J", "N", "Z", "Q"],
    ["Q", "W", "A", "Q", "K", "Z", "T", "D"],
    ["R", "B", "K", "Y", "F", "C", "G", "C"],
    ["N", "M", "F", "H", "S", "N", "O", "M"],
    ],
  },
  {
    id: "g3",
    letras: [
    ["B", "N", "J", "R", "F", "K", "N", "Q"],
    ["F", "D", "Z", "Z", "D", "T", "S", "D"],
    ["W", "H", "B", "G", "Q", "E", "W", "W"],
    ["F", "C", "O", "C", "O", "P", "V", "S"],
    ["R", "N", "M", "G", "L", "C", "Q", "Y"],
    ["B", "D", "F", "A", "C", "K", "W", "A"],
    ["Q", "N", "Y", "H", "C", "R", "R", "L"],
    ["T", "H", "V", "V", "X", "V", "F", "P"],
    ],
  },
  {
    id: "g4",
    letras: [
    ["Q", "K", "W", "W", "P", "Q", "W", "X"],
    ["J", "S", "M", "Q", "S", "L", "N", "C"],
    ["D", "E", "C", "X", "Y", "N", "A", "Z"],
    ["R", "O", "G", "H", "A", "K", "D", "Y"],
    ["W", "G", "K", "O", "L", "X", "N", "J"],
    ["T", "W", "R", "K", "P", "R", "F", "C"],
    ["M", "N", "M", "F", "R", "J", "Q", "X"],
    ["B", "C", "T", "D", "Q", "R", "B", "R"],
    ],
  },
  {
    id: "g5",
    letras: [
    ["J", "V", "J", "S", "D", "H", "X", "H"],
    ["H", "B", "E", "B", "K", "P", "K", "J"],
    ["J", "O", "Q", "R", "K", "L", "K", "O"],
    ["G", "J", "K", "V", "Y", "A", "G", "Q"],
    ["B", "T", "W", "J", "A", "Y", "H", "N"],
    ["D", "R", "Q", "B", "L", "S", "R", "D"],
    ["Q", "T", "Q", "Z", "P", "R", "J", "Z"],
    ["Z", "J", "C", "N", "B", "T", "V", "B"],
    ],
  },
  {
    id: "g6",
    letras: [
    ["K", "N", "P", "L", "A", "Y", "S", "D"],
    ["W", "R", "D", "T", "W", "N", "X", "F"],
    ["K", "Q", "F", "C", "K", "T", "Z", "K"],
    ["B", "Y", "T", "M", "W", "Q", "T", "F"],
    ["D", "A", "K", "F", "N", "Q", "O", "K"],
    ["V", "L", "Z", "M", "H", "G", "K", "B"],
    ["K", "P", "J", "B", "R", "Q", "T", "V"],
    ["V", "S", "E", "O", "G", "Q", "H", "Z"],
    ],
  },
  {
    id: "g7",
    letras: [
    ["Y", "A", "L", "P", "Z", "W", "R", "X"],
    ["X", "G", "O", "E", "S", "T", "Q", "M"],
    ["J", "P", "M", "D", "Q", "Z", "R", "X"],
    ["Q", "D", "L", "F", "W", "J", "R", "H"],
    ["Z", "O", "W", "A", "C", "D", "R", "R"],
    ["T", "G", "Z", "X", "Y", "D", "D", "N"],
    ["Z", "D", "C", "Q", "X", "S", "Q", "V"],
    ["T", "B", "X", "T", "J", "F", "Z", "C"],
    ],
  },
  {
    id: "g8",
    letras: [
    ["F", "C", "R", "M", "D", "Z", "K", "H"],
    ["D", "C", "Z", "K", "H", "X", "X", "Q"],
    ["T", "W", "O", "G", "H", "J", "S", "F"],
    ["P", "R", "T", "Z", "K", "Q", "E", "H"],
    ["L", "T", "Q", "D", "M", "T", "O", "M"],
    ["A", "B", "Q", "R", "M", "N", "G", "C"],
    ["Y", "W", "N", "Y", "A", "L", "P", "V"],
    ["S", "Q", "W", "J", "V", "F", "J", "B"],
    ],
  },
];

export function sortearGradeId(atual?: string) {
  const opcoes = GRADES_CACA.filter((g) => g.id !== atual);
  const lista = opcoes.length > 0 ? opcoes : GRADES_CACA;
  return lista[Math.floor(Math.random() * lista.length)].id;
}

export function gradePorId(id: string): GradeCaca {
  return GRADES_CACA.find((g) => g.id === id) ?? GRADES_CACA[0];
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

/**
 * Alvos da tela 5: cada alvo tem identificador próprio e pertence a um único par.
 * A validação usa `parId`, nunca o texto (que se repete entre alvos).
 */
export const ALVOS_TELA5: { id: string; texto: string; parId: string }[] = [
  { id: "a1", texto: "goes", parId: "p-she" },
  { id: "a2", texto: "go", parId: "p-i" },
  { id: "a3", texto: "goes", parId: "p-he" },
  { id: "a4", texto: "go", parId: "p-they" },
  { id: "a5", texto: "go", parId: "p-we" },
];

/** Grupo a que cada sujeito pertence, para feedbacks dinâmicos. */
export const GRUPO_DO_SUJEITO: Record<string, string> = {
  "p-i": "I pertence ao grupo de you, we e they.",
  "p-we": "We pertence ao grupo de I, you e they.",
  "p-they": "They pertence ao grupo de I, you e we.",
  "p-she": "She pertence ao grupo de he e it.",
  "p-he": "He pertence ao grupo de she e it.",
};

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

