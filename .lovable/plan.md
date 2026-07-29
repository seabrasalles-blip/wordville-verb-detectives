## Objetivo

Revisar a precisão conceitual e os textos do app, mantendo narrativa, Lex, assets, paleta, componentes, progresso e localStorage. Sem refatoração técnica e sem redução de fontes.

## 1. Regra central em dois grupos (Tela 3)

Substituir a explicação "quando falamos de outra pessoa" por dois quadros visuais, usando os componentes já existentes (`Cartaz`, `BalaoLex`):

```text
Grupo 1 — I, you, we, they      Grupo 2 — he, she, it
go / play                        goes / plays
I go to school.                  He goes to school.
They play in the park.           She plays in the park.
```

Síntese curta da Lex: "Com he, she e it, o verbo muda. Play vira plays e go vira goes." + "Com I, you, we e they, usamos play e go sem mudança."

Sem o termo "terceira pessoa do singular" nas telas do aluno.

## 2. Explicação de S e ES

Trocar "o verbo ganha um som/letra a mais" (aparece nos textos de acerto e dicas das Telas 4, 6, 7, 8 e 9) por: "Na escrita, algumas palavras recebem S e outras recebem ES." com os exemplos `play → plays`, `go → goes` e a observação "Neste caso, play recebe S e go recebe ES." Sem outras regras ortográficas.

## 3. Frase incorreta sem áudio (Tela 1)

O cartaz `He go to school` perde o botão de áudio (nova prop `semAudio` no componente `Cartaz`) e recebe a marcação visual: "Algo está errado nesta frase. Você consegue descobrir o quê?". Após a observação da criança, exibir e permitir ouvir `He goes to school.`

## 4. Instruções baseadas no sujeito, não no som

Reescrever comandos e dicas que dizem "qual soa mais natural" (dicas procedimentais das Telas 4, 6 e 7) para: "Observe quem pratica a ação. A frase começa com I, you, we, they, he, she ou it?" e "Observe quem pratica a ação e escolha a forma correta do verbo." O áudio continua disponível como apoio.

## 5. Prática com IT (Tela 6)

Adicionar exemplo visual "The dog plays in the garden." → "It plays in the garden." (emoji 🐶 no padrão atual dos cartazes) e uma nova lacuna:

```text
It ___ in the garden.     opções: play | plays
acerto: "Isso mesmo! Com it, usamos plays."
erro:   "Observe o sujeito: it pertence ao grupo de he e she."
```

## 6. Tela de observação obrigatória (Tela 3)

O botão Continuar do rodapé fica desabilitado até a criança concluir a observação (revelar/selecionar a diferença). Isso exige registrar a conclusão no estado do caso (novo campo booleano simples no reducer, sem mudar a estrutura de persistência) para que `liberado` na `Casca` leia a Tela 3. Estado desabilitado já tem estilo visual (`disabled:opacity-40`), que será reforçado com o aviso já existente.

## 7. Nova tela "Monte a frase" (antes da conclusão)

Nova tela inserida entre a atual Tela 8 e a Tela 9 (`TOTAL_TELAS` passa de 9 para 10). Componente novo `MontarFrase.tsx`, reaproveitando o padrão visual de blocos das telas existentes:

```text
Situação 1 (👧 no parque):  She | play | plays | in the park.  → She plays in the park.
Situação 2 (👫 no parque):  They | play | plays | in the park. → They play in the park.
```

Acerto 1: "Correto! Com she, usamos plays." Acerto 2: "Correto! Com they, usamos play." Erro: "Observe quem pratica a ação antes de escolher o verbo." Tentativas ilimitadas; a frase correta não é revelada no primeiro erro. Contraste final visível entre as duas frases. Avanço liberado só com as duas montadas.

## 8. Linguagem por faixa etária

Revisar todos os comandos para frases curtas com uma ação: "Observe as frases.", "Quem pratica a ação?", "Escolha o verbo correto.", "Compare os dois exemplos.", "Monte a frase.", "Tente novamente."

## 9. Síntese final (Tela 9)

Antes da medalha, um bloco em dois grupos (I/you/we/they → go, play; He/she/it → goes, plays) com os pares contrastivos `They play in the park.` / `She plays in the park.` e `We go to school.` / `He goes to school.` Texto de fechamento: "Você descobriu a pista! Com he, she e it, usamos goes e plays. Com I, you, we e they, usamos go e play." Sem regras novas.

## 10. GO TO

Manter `go to school`. Não há hoje nenhum texto no projeto afirmando que o app não usa "go to", então nada a corrigir; se algum comentário surgir durante a edição, será ajustado para a formulação indicada.

## Detalhes técnicos

- Arquivos alterados: `src/lib/caso-conteudo.ts` (textos, dicas, nova lacuna de `it`, conteúdo das novas telas), `src/components/caso/CasoApp.tsx` (Telas 1, 3, 6, 9, títulos, roteamento da nova tela, regra de liberação), `src/components/caso/BalaoLex.tsx` (nenhuma mudança prevista), `src/components/caso/CasoProvider.tsx` (campo de observação concluída + estado da montagem), novo `src/components/caso/MontarFrase.tsx`, e ajuste de `head()` em `src/routes/index.tsx` se o texto descritivo citar a regra antiga.
- Caça-palavras, arrasto e persistência não são tocados (a chave do localStorage é mantida; campos novos entram com valor padrão via `{ ...inicial, ...dados }`).
- Como o palco é fixo em 1200×675 px, os novos blocos serão dimensionados para caber sem rolagem, sem reduzir as fontes atuais — verificação por medição de altura em cada tela.
- Ao final: typecheck e passagem completa pelas 10 telas para checar ausência de regressões.
