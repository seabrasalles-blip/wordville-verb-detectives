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
/** 8 grades 8x8 pré-validadas: GO, GOES, PLAY e PLAYS aparecem apenas na horizontal (esquerda→direita) ou na vertical (cima→baixo), sem ocorrências acidentais em outras direções. */
export const GRADES_CACA: GradeCaca[] = [
  {
    id: "g1",
    letras: [
      ["D", "M", "D", "W", "C", "F", "M", "C"],
      ["V", "C", "M", "C", "H", "Q", "G", "W"],
      ["H", "F", "Q", "J", "F", "K", "O", "T"],
      ["P", "L", "A", "Y", "F", "D", "C", "K"],
      ["Z", "W", "R", "X", "X", "T", "Q", "M"],
      ["J", "M", "D", "Q", "G", "O", "E", "S"],
      ["Z", "R", "X", "P", "L", "A", "Y", "S"],
      ["Q", "D", "F", "W", "J", "R", "H", "Z"],
    ],
  },
  {
    id: "g2",
    letras: [
      ["Z", "G", "D", "C", "Q", "X", "Q", "V"],
      ["T", "O", "P", "L", "A", "Y", "S", "B"],
      ["X", "T", "J", "F", "Z", "G", "C", "K"],
      ["Q", "H", "M", "V", "V", "O", "Z", "D"],
      ["J", "X", "V", "N", "H", "E", "W", "P"],
      ["N", "W", "T", "V", "M", "S", "H", "L"],
      ["D", "J", "H", "M", "M", "B", "Z", "A"],
      ["J", "N", "Q", "B", "H", "W", "T", "Y"],
    ],
  },
  {
    id: "g3",
    letras: [
      ["F", "R", "C", "F", "B", "H", "F", "T"],
      ["G", "B", "D", "K", "V", "H", "N", "T"],
      ["O", "T", "Z", "F", "F", "Z", "X", "Z"],
      ["P", "L", "A", "Y", "Z", "Q", "D", "H"],
      ["F", "R", "N", "Z", "J", "B", "G", "K"],
      ["T", "H", "B", "Q", "D", "N", "O", "T"],
      ["J", "T", "M", "R", "M", "K", "E", "M"],
      ["V", "P", "L", "A", "Y", "S", "S", "M"],
    ],
  },
  {
    id: "g4",
    letras: [
      ["T", "D", "G", "O", "E", "S", "M", "F"],
      ["M", "Z", "K", "R", "K", "Z", "B", "Z"],
      ["T", "D", "F", "P", "V", "K", "Z", "J"],
      ["W", "R", "D", "L", "V", "P", "X", "V"],
      ["D", "J", "J", "A", "H", "L", "B", "H"],
      ["X", "H", "Z", "Y", "T", "A", "H", "H"],
      ["B", "B", "F", "H", "W", "Y", "K", "K"],
      ["B", "N", "G", "O", "K", "S", "Q", "M"],
    ],
  },
  {
    id: "g5",
    letras: [
      ["X", "J", "G", "O", "E", "S", "B", "H"],
      ["J", "H", "Z", "F", "C", "R", "Z", "F"],
      ["P", "L", "A", "Y", "S", "C", "G", "M"],
      ["K", "N", "C", "F", "X", "B", "O", "D"],
      ["X", "R", "K", "N", "X", "Z", "P", "M"],
      ["N", "K", "X", "H", "W", "F", "L", "V"],
      ["X", "R", "D", "M", "W", "D", "A", "K"],
      ["Q", "F", "H", "T", "H", "N", "Y", "H"],
    ],
  },
  {
    id: "g6",
    letras: [
      ["C", "J", "W", "D", "P", "N", "B", "D"],
      ["N", "D", "M", "D", "L", "N", "F", "P"],
      ["X", "B", "G", "O", "A", "R", "W", "L"],
      ["N", "H", "C", "M", "Y", "F", "J", "A"],
      ["N", "C", "J", "K", "S", "Q", "Q", "Y"],
      ["K", "Q", "X", "J", "N", "T", "B", "N"],
      ["C", "B", "G", "O", "E", "S", "B", "K"],
      ["Z", "M", "X", "F", "W", "Z", "V", "Q"],
    ],
  },
  {
    id: "g7",
    letras: [
      ["X", "B", "N", "T", "R", "R", "M", "P"],
      ["C", "Q", "K", "T", "J", "B", "R", "L"],
      ["V", "D", "P", "L", "A", "Y", "S", "A"],
      ["Z", "N", "K", "M", "B", "D", "N", "Y"],
      ["D", "H", "V", "G", "C", "V", "B", "Q"],
      ["Q", "M", "D", "O", "H", "V", "R", "Z"],
      ["H", "Q", "H", "E", "C", "W", "G", "O"],
      ["H", "B", "M", "S", "D", "B", "C", "H"],
    ],
  },
  {
    id: "g8",
    letras: [
      ["D", "D", "D", "Z", "N", "D", "G", "P"],
      ["N", "M", "K", "M", "X", "Z", "O", "L"],
      ["V", "D", "Z", "Q", "C", "K", "D", "A"],
      ["H", "R", "N", "P", "L", "A", "Y", "Y"],
      ["G", "Q", "H", "B", "Z", "C", "Z", "S"],
      ["O", "N", "F", "K", "Z", "Q", "Q", "X"],
      ["E", "X", "X", "F", "K", "Q", "D", "Z"],
      ["S", "B", "Q", "X", "D", "X", "N", "V"],
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

/**
 * Feedback da revisão mista: analisa significado (família do verbo) e
 * concordância (forma) separadamente, com dicas graduais por tentativa.
 */
export function feedbackLacuna(lacuna: Lacuna, palavra: string, tentativa: number) {
  const escolha = palavra.trim().toLowerCase();
  const familiaEscolhida = familiaDaPalavra(escolha);
  const familiaCorreta = familiaEscolhida === lacuna.familia;
  const sujeito = lacuna.antes.trim().toLowerCase();
  const base = lacuna.familia;
  const flexionada = base === "go" ? "goes" : "plays";
  const terceira = grupoDoSujeito(sujeito) === "terceira";

  if (familiaCorreta) {
    return `O verbo está certo, mas com ${sujeito} usamos ${lacuna.resposta}.`;
  }

  // família errada, mas a terminação já combina com o sujeito
  const marcada = escolha === "goes" || escolha === "plays";
  if (marcada === terceira && tentativa === 0) {
    return `A terminação combina com ${sujeito}, mas o verbo não combina com a ação. ${lacuna.acao} pede ${base}.`;
  }

  if (tentativa === 0) {
    return `A frase fala em ${lacuna.acao}. Procure uma forma do verbo ${base}.`;
  }
  if (tentativa === 1) {
    return `Primeiro escolha o verbo ${base}. Agora observe o sujeito ${sujeito}.`;
  }
  return `Para essa frase, escolha entre ${base} e ${flexionada}.`;
}
