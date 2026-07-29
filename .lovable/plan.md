## O que foi verificado no código

- `src/lib/caso-conteudo.ts` tem **uma única grade** (`GRADE_CACA`) e um mapa fixo `POSICOES_CACA`. `CacaPalavras.tsx` valida com `palavraDoCaminho()`, que compara o caminho selecionado com essas coordenadas exatas — por isso P→L→A→Y dentro de PLAYS é recusado (não existe PLAY naquelas coordenadas) e as palavras ficam sempre no mesmo lugar.
- Tela 5: `ALVOS_TELA5` amarra cada cartão a um `parId` (`a2→p-i`, `a4→p-they`, `a5→p-we`), e `LigarColunas.tsx` aceita só `alvo.parId === par.id`. Logo, "We + cartão go do I" é recusado, e o feedback de erro usa `GRUPO_DO_SUJEITO`, gerando frases como "I não combina com go".
- Tela 7: `LACUNAS_TELA7` guarda só `resposta` e dicas fixas por sujeito; `TelaLacunas.tsx` compara a palavra com `resposta` e mostra a dica da vez — sem distinguir erro de significado (família go/play) de erro de concordância.
- Tela 3 (`Tela3` em `CasoApp.tsx`): a revelação depende de `estado.observou`, restaurado do localStorage. Não confirmei ainda por que a alternativa aparece marcada numa tentativa nova — **o primeiro passo da implementação é reproduzir em 1200×675 e identificar a origem exata** (estado persistido antigo, ausência de reset, ou marcação visual indevida) antes de alterar.

## 1. Caça-palavras

**Validação por palavra formada** (`CacaPalavras.tsx`):
- Manter o caminho como sequência contínua, direção única travada na segunda célula (8 sentidos: horizontais, verticais e diagonais), sem saltos nem repetição de célula.
- Ao soltar: montar a string das letras na ordem, em maiúsculas, e comparar com as palavras ainda não encontradas. Nada de coordenadas pré-definidas — PLAY dentro de PLAYS passa a valer.
- Registrar `{ palavra, caminho: {linha, coluna}[] }` no estado; o destaque visual usa esse caminho.

**Feedbacks** (mensagens exatas do pedido):
- palavra válida: "Você encontrou PLAY!"
- prefixo de palavra: "Você encontrou o começo de uma palavra. Observe se falta alguma letra."
- já encontrada: "Essa evidência já está no mural. Procure outra palavra."
- caminho quebrado/fora de ordem: "As letras precisam estar ligadas e na ordem."
- sem correspondência: "Essa sequência ainda não é uma das palavras do mural. Observe as letras e tente novamente."

**Variação de grades**: criar **8 grades 8×8** validadas em `caso-conteudo.ts`, cada uma com GO, GOES, PLAY e PLAYS em posições/direções diferentes (incluindo trás-para-frente e verticais), mesma densidade de letras e mesmo tamanho de célula. Sorteio apenas quando começa uma tentativa nova (reiniciar confirmado, primeira sessão sem progresso, ou início após conclusão). O `gradeId` vai para o estado persistido, então recarregar a página, sair e voltar à tela ou errar não troca a grade.

## 2. Tela 3

- Reproduzir o problema, corrigir a origem e garantir estado inicial `null`/`false`: nenhuma alternativa marcada, nenhuma borda de acerto, síntese oculta, "Continuar" desativado até um clique real.
- Sanear no `CasoProvider`: `observou` e a escolha da Tela 3 só são restauradas se coerentes com a tentativa salva; dados antigos/incompatíveis voltam ao estado inicial.
- Reiniciar apaga a resposta da Tela 3 junto com o resto.

## 3. Ligar colunas (Tela 5)

- Cartões passam a ter `id` (controle de uso) + `forma: "go" | "goes"` (correção linguística). O `parId` deixa de existir.
- Correção: comparar o grupo do sujeito (I/We/They → `go`; He/She → `goes`) com a **forma do cartão clicado**. Qualquer cartão GO serve para I, We e They; qualquer GOES serve para He e She.
- Acerto consome só o cartão clicado; erro não consome nem bloqueia nada, e conexões corretas anteriores permanecem.
- Feedbacks montados com o sujeito e a forma realmente escolhidos: "Isso mesmo! I combina com go." / "Observe o sujeito. Com I, usamos go." / "Correto! She combina com goes." / "Observe o sujeito. Com she, usamos goes."

## 4. Feedbacks da revisão mista (Tela 7)

- Cada lacuna ganha `familiaEsperada: "go" | "play"` além da `resposta`.
- Na entrega da palavra, duas checagens: família (significado) e forma (concordância). O feedback segue a matriz do pedido, com progressão por tentativa: 1º erro aponta o significado da ação, 2º aponta o grupo do sujeito, 3º indica as duas opções relevantes — sem preencher a lacuna.
- Combinações cobertas: He+go/play/plays, We+goes/play/plays, She+play/go/goes, I+plays/go/goes.
- Acertos anteriores continuam travados e visíveis após um erro.

## 5. Layout 1200×675

Feedbacks mais longos (item 4) são o principal risco de estouro. Medidas: mensagem em uma área de altura reservada com 2 linhas máximas de texto compacto (17px), redução de espaços verticais entre cards, e verificação por medição em Playwright no viewport 1200×675 nas 10 telas, em três estados (vazio, com erro, concluída), checando `scrollWidth/scrollHeight` do palco, do `main` e de cada card, sem recorrer a `overflow: hidden` para esconder conteúdo.

## Testes

Caça-palavras (PLAY dentro de PLAYS, PLAYS completo, letras fora de ordem, reload mantendo grade, reiniciar sorteando outra), Tela 3 (nada marcado antes do clique), ligar colunas (todas as combinações válidas e inválidas listadas), revisão mista (as 10 combinações listadas) e layout. Ao final, `tsgo` e relatório com arquivos alterados, causa/solução de cada problema, número de grades, forma de persistência e confirmação de 1200×675 sem barras de rolagem.

## Detalhes técnicos

Arquivos previstos: `src/lib/caso-conteudo.ts` (grades, cartões da Tela 5 por forma, `familiaEsperada` e matriz de feedback da Tela 7), `src/components/caso/CacaPalavras.tsx`, `LigarColunas.tsx`, `TelaLacunas.tsx`, `CasoProvider.tsx` (novos campos `gradeId` e caminhos encontrados, saneamento) e `CasoApp.tsx` (Tela 3). Sem mudança de arquitetura, assets, paleta, personagem, áudio ou sequência de telas.