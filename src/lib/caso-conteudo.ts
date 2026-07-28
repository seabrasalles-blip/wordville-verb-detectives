export const TOTAL_TELAS = 9;

export const PALAVRAS_CACA = ["GO", "GOES", "PLAY", "PLAYS"] as const;
export type PalavraCaca = (typeof PALAVRAS_CACA)[number];

export const EVIDENCIAS: Record<
  PalavraCaca,
  { icone: string; fala: string; texto: string }
> = {
  GO: {
    icone: "🚶‍♀️➡️",
    fala: "go",
    texto:
      "Encontrou 'go'! Isso significa 'ir' — como quando você vai para algum lugar. Clique no alto-falante e escute com atenção.",
  },
  GOES: {
    icone: "🚶‍♂️➡️",
    fala: "goes",
    texto:
      "Olha, 'goes'! Parece parente do 'go', não? Escute o som — reparou que termina diferente? Guarde esse som, ele vai ser importante!",
  },
  PLAY: {
    icone: "⚽️🧒",
    fala: "play",
    texto: "'Play'! Isso significa 'brincar' ou 'jogar'. Escute o som dessa palavra.",
  },
  PLAYS: {
    icone: "⚽️👧",
    fala: "plays",
    texto:
      "'Plays'! Escute com atenção... o final soa parecido com 'goes', não soa? Essa é a nossa pista sonora do caso!",
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

export const LACUNAS_TELA4: Lacuna[] = [
  {
    id: "t4-he",
    antes: "He",
    depois: "to the park on Sundays.",
    resposta: "goes",
    ilustracao: "👦",
    acertoTexto:
      "Muito bem! Você colocou 'goes' em 'He ___'. Lembre-se: quando falamos de he, she ou it, o verbo ganha um som a mais no final — vira 'goes'.",
    dicas: {
      conceitual:
        "Hmm, vamos pensar juntos. Quem faz a ação aqui é 'He'. Na nossa pista de antes, quando falávamos de 'She', usamos qual forma mesmo? 'Go' ou 'goes'?",
      procedimental:
        "Tente assim: ouça as duas opções no alto-falante. 'He go to the park' — soa completo? Agora ouça 'He goes to the park'. Qual soa mais natural?",
      atencional:
        "Olhe bem para o sujeito da frase: é 'He', 'We' ou 'She'? Foi isso que mudou o verbo na nossa pista da Tela 3. Quem faz a ação?",
    },
  },
  {
    id: "t4-we",
    antes: "We",
    depois: "to the park on Sundays.",
    resposta: "go",
    ilustracao: "👨‍👩‍👧",
    acertoTexto:
      "Muito bem! Você colocou 'go' em 'We ___'. Com I, we e they o verbo continua do jeitinho que ele é: 'go'.",
    dicas: {
      conceitual:
        "Hmm, vamos pensar juntos. Quem faz a ação aqui é 'We' — mais de uma pessoa, incluindo você. O verbo muda só quando falamos de he, she ou it. Então qual forma fica aqui?",
      procedimental:
        "Tente assim: ouça as duas opções no alto-falante. 'We goes to the park' — soa completo? Agora ouça 'We go to the park'. Qual soa mais natural?",
      atencional:
        "Olhe bem para o sujeito da frase: é 'He', 'We' ou 'She'? Foi isso que mudou o verbo na nossa pista da Tela 3. Quem faz a ação?",
    },
  },
  {
    id: "t4-she",
    antes: "She",
    depois: "to the park on Sundays.",
    resposta: "goes",
    ilustracao: "👧",
    acertoTexto:
      "Muito bem! Você colocou 'goes' em 'She ___'. Lembre-se: quando falamos de he, she ou it, o verbo ganha um som a mais no final — vira 'goes'.",
    dicas: {
      conceitual:
        "Hmm, vamos pensar juntos. Quem faz a ação aqui é 'She'. Na nossa pista da Tela 3, com 'She' usamos qual forma mesmo? 'Go' ou 'goes'?",
      procedimental:
        "Tente assim: ouça as duas opções no alto-falante. 'She go to the park' — soa completo? Agora ouça 'She goes to the park'. Qual soa mais natural?",
      atencional:
        "Olhe bem para o sujeito da frase: é 'He', 'We' ou 'She'? Foi isso que mudou o verbo na nossa pista da Tela 3. Quem faz a ação?",
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
    acertoTexto:
      "Isso! 'She plays' — mesma regra de 'She goes'. Quando falamos de he, she ou it, o verbo ganha esse som a mais no final. 'Plays' e 'goes' seguem o mesmo padrão!",
    dicas: {
      conceitual:
        "Vamos pensar: quem faz a ação na frase 'She ___ soccer'? É 'She'. E o que aprendemos sobre 'she' e o verbo? Ele ganha algo no final...",
      atencional:
        "Compare com o que você já sabe: 'She goes' está certo. Então 'She plays' ou 'She play'? Ouça as duas opções e siga o mesmo padrão!",
    },
  },
  {
    id: "t6-i",
    antes: "I",
    depois: "soccer every weekend.",
    resposta: "play",
    ilustracao: "🧒⚽️",
    acertoTexto:
      "Isso! Com 'I' o verbo fica do jeitinho que ele é: 'I play'. A marca a mais no final aparece só com he, she e it.",
    dicas: {
      conceitual:
        "Vamos pensar: quem faz a ação na frase 'I ___ soccer'? É 'I' — você mesmo. E o verbo muda quando falamos de nós mesmos?",
      atencional:
        "Compare com o que você já sabe: 'I go' está certo, sem som a mais no final. Então com 'I' fica 'play' ou 'plays'? Ouça as duas opções!",
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
    acertoTexto: "Cartaz consertado! Você usou 'goes' corretamente. O caso está quase no fim!",
    dicas: {
      conceitual:
        "Quem faz a ação? 'He'. E o que descobrimos sobre 'he' e o verbo? Ele ganha um som a mais — vira 'goes'.",
      procedimental:
        "Dica de detetive: primeiro identifique quem faz a ação (o sujeito). Depois ouça as duas opções e escolha a que soa certa.",
    },
  },
  {
    id: "t7-2",
    antes: "We",
    depois: "to the park on Sundays.",
    resposta: "go",
    ilustracao: "👨‍👩‍👧🌳",
    acertoTexto: "Cartaz consertado! Você usou 'go' corretamente. O caso está quase no fim!",
    dicas: {
      conceitual:
        "Quem faz a ação? 'We'. E o verbo só ganha o som a mais com he, she ou it. Então aqui ele fica como?",
      procedimental:
        "Dica de detetive: primeiro identifique quem faz a ação (o sujeito). Depois ouça as duas opções e escolha a que soa certa.",
    },
  },
  {
    id: "t7-3",
    antes: "She",
    depois: "soccer every weekend.",
    resposta: "plays",
    ilustracao: "👧⚽️",
    acertoTexto: "Cartaz consertado! Você usou 'plays' corretamente. O caso está quase no fim!",
    dicas: {
      conceitual:
        "Quem faz a ação? 'She'. E o que descobrimos sobre 'she' e o verbo? Ele ganha um som a mais — como em 'goes'.",
      procedimental:
        "Dica de detetive: primeiro identifique quem faz a ação (o sujeito). Depois ouça as duas opções e escolha a que soa certa.",
    },
  },
  {
    id: "t7-4",
    antes: "I",
    depois: "soccer every weekend.",
    resposta: "play",
    ilustracao: "🧒⚽️",
    acertoTexto: "Cartaz consertado! Você usou 'play' corretamente. O caso está quase no fim!",
    dicas: {
      conceitual:
        "Quem faz a ação? 'I'. Quando falamos de nós mesmos, o verbo não ganha nada no final. Então fica como?",
      procedimental:
        "Dica de detetive: primeiro identifique quem faz a ação (o sujeito). Depois ouça as duas opções e escolha a que soa certa.",
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

export const PERGUNTAS_TELA8 = [
  {
    id: "q1",
    titulo: "O que você aprendeu?",
    pergunta: "Quando falamos de he, she ou it, o que acontece com o verbo?",
    opcoes: [
      {
        texto: "O verbo ganha um som/letra a mais no final",
        correta: true,
        feedback: "Exato! He goes, she plays — todos ganham essa marca.",
      },
      {
        texto: "O verbo fica igual",
        correta: false,
        feedback: "Hmm, lembra de 'She goes'? O 'go' mudou para 'goes'. O que aconteceu ali?",
      },
    ],
  },
  {
    id: "q2",
    titulo: "Como você descobre a forma correta?",
    pergunta:
      "Quando você encontrar uma frase para completar, qual é a primeira coisa que você procura?",
    opcoes: [
      {
        texto: "Quem faz a ação (o sujeito)",
        correta: true,
        feedback:
          "Isso! Tudo começa pelo sujeito. E se tiver dúvida, você pode ouvir as opções e comparar o som!",
      },
      {
        texto: "A palavra mais comprida",
        correta: false,
        feedback:
          "Boa tentativa! Mas o tamanho não importa tanto. O que muda o verbo é quem faz a ação. Quem é o sujeito?",
      },
    ],
  },
];
