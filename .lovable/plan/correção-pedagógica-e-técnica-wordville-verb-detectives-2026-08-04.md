# Correção pedagógica e técnica — Wordville Verb Detectives

Alterações cirúrgicas sobre o projeto atual (12 telas). Nenhuma nova biblioteca, nenhuma mudança de stack, identidade visual e assets preservados.

## 1. Abertura como hipótese (Tela 1)

O cartaz `He go to school.` continua visível. Substituir o botão "Ver a frase correta" (e o bloco que hoje revela `He goes to school.`) por um grupo de escolha acessível com quatro opções: **He**, **go**, **to school**, **Ainda não sei**.

- Grupo em `fieldset`/`legend` com `input type="radio"` reais (foco visível, navegação por teclado, seleção marcada por borda + ícone, não só cor).
- Após a seleção: fala neutra da Lex — "Hipótese registrada! Ainda não vamos corrigir o cartaz. Primeiro, precisamos procurar pistas e comparar outras frases."
- Botão "Procurar pistas" só habilita quando a fala inicial terminou **e** existe hipótese.
- Nenhuma classificação de certo/errado, nenhum erro contabilizado, nenhuma prática extra.
- Fala inicial da Lex (`FALAS.t1`) reescrita conforme o texto aprovado, sem revelar a forma correta.
- A frase corrigida não aparece nem é falada na Tela 1 (segue existindo apenas nas telas de investigação e no encerramento).

Estado: `t1-visto` sai; entram `t1-hipotese` (`he` | `go` | `to-school` | `nao-sei`) e `t1-investigou: "sim"`, gravados nas `respostas` já persistidas. `telaConcluida(1)` passa a checar `t1-investigou`. O saneamento do localStorage aceita os novos ids (chave de armazenamento mantida; estados antigos simplesmente pedem a hipótese de novo).

## 2. Explicações gramaticais contextualizadas

Busca global em `src/lib/caso-conteudo.ts` e componentes por "sempre combina", "pede goes", "pede plays" e trocar por formulações que citem sujeito **e** verbo:

- "Vou te ajudar: it sempre combina com goes." → "Nesta frase, o verbo é go. Com it, go muda para goes."
- "…he sempre combina com goes. Vamos colocar juntos!" → "Nesta frase, o verbo é go. Com he, go muda para goes. Vamos completar juntos!"
- padrão para play: "Nesta frase, o verbo é play. Com she, acrescentamos -s: play vira plays."

Escopo mantido em go→goes e play→plays; sem has/have, does, negativas, interrogativas ou outras regras.

## 3. Português correto nos textos

Trocar as construções "Quem pratica a ação é 'I'. Ele está no grupo…" (aparecem em dicas conceituais, atencionais e ramos de prática) por formas neutras:

- "O sujeito da frase é We. Esse sujeito pertence ao grupo de I, you, we e they."
- "I faz parte do grupo que usa play."

Revisão nas dicas, feedbacks de acerto e erro, práticas extras, revisão mista, Tela 11, falas da Lex e sínteses. Frases em inglês intactas.

## 4. Tela 11 exige conclusão

`telaConcluida` no caso `TELA_CENARIOS` deixa de retornar `true` e passa a exigir `LACUNAS_TELA11.every((l) => estado.respostas[l.id] === l.resposta)`. Mensagem de bloqueio: "Complete todos os cartazes dos novos cenários para continuar." Sem avanço automático nem pular; respostas continuam persistidas e preenchidas ao voltar.

## 5. Caça-palavras maior

Grade sai de `max-w-[250px]` para largura responsiva (~360 px em espaço amplo, ~320 px intermediário, ~300 px em alturas curtas), células `aspect-square` com alvo de 40–44 px e letras de 22 px. Mural de evidências e rodapé reorganizados para caber; validação por caminho exato, ausência de diagonais/inversão, prefixos (GO em GOES, PLAY em PLAYS) e modo Toque preservados. Layout conferido em 1200×675 sem rolagem.

## 6. Documentação

`README.md` e o comentário de topo de `src/lib/caso-conteudo.ts` passam a descrever 12 telas, listando a sequência e marcando o que é percurso principal, prática adaptativa, extensão, novos cenários e encerramento. Numeração interna intacta.

## 7. Estrelas não punitivas

`estrelasDaTela` em `src/lib/relatorio.ts`: 0 quando a tela não está completa, 3 quando está — erros deixam de reduzir. Erros, tentativas, tempo e prática extra continuam no relatório (`relatorio`/`relatorioCsv`). Comentários e textos sobre "3 sem erros / 2 com um erro" atualizados.

## 8. Tamanhos de texto

Elevar para o mínimo de 16 px os textos funcionais abaixo disso (rótulos do caça-palavras e do mural em 15 px, botões de cabeçalho, mensagens de bloqueio, opções). Comandos principais 18–20 px, alternativas ≥18 px, frases em inglês ≥22 px quando houver espaço — sem criar rolagem.

## 9. Testes e verificação

Adicionar `"test": "vitest run"` e `"test:watch": "vitest"` ao `package.json` (vitest já é dependência de dev). Novos testes:

- **conteúdo**: nenhum arquivo contém "sempre combina", "pede goes", "pede plays" nem "'I'. Ele" / "'We'. Ele".
- **estrelas**: incompleta → 0; completa → 3; erros não alteram; erros seguem no relatório.
- **Tela 11**: vazia e parcialmente correta não concluem; todas corretas concluem; estado restaurado mantém a conclusão (extraindo `telaConcluida` para um módulo testável).
- **abertura**: sem `He goes to school.` e sem "Ver a frase correta"; continuação bloqueada sem hipótese; qualquer das quatro hipóteses libera.

Testes existentes das grades preservados. Rodar `bun run test`, `bun run build` e `bun run lint`, além de conferência visual em 1200×675 via Playwright.

## Observação

O "Modo Professor" foi removido a pedido em rodada anterior; os dados pedagógicos (erros, tempo, prática extra) continuam sendo registrados no estado e em `src/lib/relatorio.ts`, sem interface de professor. Não vou reintroduzi-la nesta rodada.
