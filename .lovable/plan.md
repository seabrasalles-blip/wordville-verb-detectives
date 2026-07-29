## Diagnóstico (verificado no código)

- `src/components/caso/CacaPalavras.tsx` valida a seleção como **conjunto** (`alvo.every(...) && selecao.every(...)`), ignorando ordem, direção e continuidade; e a seleção errada some sem qualquer devolutiva.
- `src/lib/caso-conteudo.ts` define `FORMAS_TELA5` com textos repetidos (`go` três vezes, `goes` duas) e `LigarColunas.tsx` compara **pelo texto** (`par.forma === forma`), não por identificador do par; a liberação da tela 5 usa apenas "existe conexão" (`estado.conexoes[p.id]`), sem checar se está correta.
- `CasoApp.tsx`: a Tela 8 (reflexão) libera o avanço com qualquer alternativa marcada (`estado.metacognicao[q.id] !== undefined`), inclusive a incorreta; a Tela 1 libera sem revelar a frase correta.
- O botão "Recomeçar" chama `reiniciar()` direto, apagando o progresso sem confirmação.
- `CasoProvider.tsx` restaura o localStorage com `{ ...inicial, ...dados }` sem validar tipo/faixa (`tela` fora de 1..10 ou campos corrompidos entram no estado).
- Não há trava contra clique duplo em "Continuar" nem contra reenvio durante o feedback.
- `MontarFrase.tsx` valida só a escolha do verbo; não há validação de ordem de palavras.
- Tamanhos atuais (`text-xs`/`text-sm`, 12–14 px) estão abaixo dos mínimos pedidos (18/20/17 px).

## 1. Validação do caça-palavras

Reescrever a detecção em `CacaPalavras.tsx`:

- Registrar a seleção como **caminho ordenado** (célula inicial + direção fixa, derivada da segunda célula).
- Só aceitar direções horizontal e vertical nos dois sentidos (as palavras da grade são horizontais; manter vertical apenas se a grade não gerar ambiguidade — hoje todas são horizontais, então restringir a horizontal e recusar diagonal).
- Bloquear mudança de direção no meio do arrasto e saltos entre células (cada nova célula precisa ser a próxima na direção travada).
- Comparar a string formada com a palavra alvo, na ordem exata (`P→L→A→Y`), inclusive letra inicial.
- Seleção incorreta: destacar em laranja, mostrar "Essas letras ainda não formam o verbo. Procure uma sequência ligada." e limpar **somente** a seleção errada após ~1,5 s, preservando as palavras já achadas.
- Seleção correta: fixa o destaque, marca na lista, toca o áudio (comportamento atual), atualiza o contador "x/4".

## 2. Atividade de associação (Tela 5)

- Substituir `FORMAS_TELA5` por uma lista de alvos com identificador próprio ligado ao par correto, eliminando a coincidência por texto.
- `conectar` passa a validar `idAlvo` × `idSujeito`; feedback gerado dinamicamente a partir da escolha real: acerto "Boa investigação! He combina com goes."; erro "Observe o sujeito antes de escolher. They pertence ao grupo de I, you e we."
- Erro não desfaz nem embaralha as combinações já corretas; acerto trava o par (não pode ser alterado) e mantém tudo visível.
- Liberação da tela 5 passa a exigir todas as conexões **corretas**.

## 3. Progressão e travas de avanço

Em `CasoApp.tsx`, regra por tela:

| Tela | Critério |
|---|---|
| 1 | revelar a frase correta |
| 2 | 4 palavras encontradas |
| 3 | observação concluída (já existe) |
| 4/6/7 | todas as lacunas corretas |
| 5 | todos os pares corretos |
| 8 | escolha correta nas duas perguntas, após devolutiva |
| 9 | duas frases montadas corretamente |

- Botão continua visível, com `disabled`, `aria-disabled`, `cursor-not-allowed` e contraste reduzido.
- Trava anti-duplo-clique: `isProcessing` no rodapé (libera após a troca de tela) e `onKeyDown` que não dispara avanço com Enter quando desabilitado.

## 4. Escolhas, lacunas e reflexão

- Alternativas passam a ter `id` próprio e a validação usa o `id`, não o texto.
- Bloqueio de novo envio enquanto o feedback está sendo processado; após acerto, a alternativa fica marcada e travada; após erro, nova tentativa livre.
- Progressão de dicas por tentativa (1ª: "Observe quem pratica a ação."; 2ª: "Compare o sujeito com os grupos da pista."; 3ª: regra explícita) — reaproveita `dicas` já existentes em `caso-conteudo.ts`.
- Lacunas (`TelaLacunas.tsx`): normalizar `trim().toLowerCase()` na comparação, destacar só a lacuna errada, preservar as corretas, recusar respostas parciais.
- Tela 8 (reflexão): escolha incorreta mostra "Vamos observar mais uma vez: he, she e it formam um grupo diferente.", reexibe os exemplos e pede nova resposta; avanço só com a ideia correta.

## 5. Arrastar e soltar

Em `useArrasto.tsx`:

- Manter o fluxo alternativo por toque/clique (já existe) e deixá-lo evidente com destaque da lacuna quando há bloco selecionado.
- Detecção do alvo com tolerância: além de `elementFromPoint`, procurar a lacuna cujo retângulo esteja a até ~24 px do ponto solto (área lógica maior sem crescer a área visual).
- Erro: bloco volta ao banco, os demais permanecem, feedback curto, nova tentativa.
- Acerto: bloco fixado, arraste desativado, progresso atualizado.
- Cancelar arraste (`pointercancel`, sair do palco) sem alterar respostas.

## 6. Montagem de frases (Tela 9)

- Frase montada por **blocos ordenados**: `She | play/plays | in the park.` com validação de posição e de forma verbal; distratores não são aceitos; cada bloco ocupa uma posição só, sem duplicar nem sumir.
- Erro: "Observe a ordem das palavras e a forma do verbo." sem reorganizar os blocos.
- Acerto: frase permanece visível, feedback específico ("Correto! Com she, usamos plays."), segunda situação liberada; com as duas corretas, libera a síntese final.

## 7. Componente único de feedback

Novo `src/components/caso/Feedback.tsx` com a interface pedida (`type`, `title?`, `message`, `onClose?`, `autoClose?`), reaproveitando `BalaoLex` e a paleta atual (acerto/reorienta/pista). Área fixa reservada abaixo da atividade em cada tela, sem cobrir a resposta; auto-fechamento em ~2,8 s ou fechamento manual.

## 8. Reiniciar com confirmação

- Novo diálogo modal compacto e centralizado: título "Reiniciar a investigação?", mensagem "Seu progresso será apagado e você voltará ao início.", botões "Continuar investigação" (foco inicial) e "Reiniciar".
- Fecha com Escape, bloqueia interação com o fundo, cabe em 1200×675 sem rolagem.

## 9. Progresso e persistência

- Em `CasoProvider.tsx`, validar o estado salvo antes de restaurar: `tela` inteiro entre 1 e `TOTAL_TELAS`, campos obrigatórios com o tipo esperado, `encontradas` só com palavras válidas; dados corrompidos são ignorados e o app volta ao estado inicial, sem mensagem técnica.
- Barra de progresso reflete apenas telas efetivamente concluídas; nunca ultrapassa 100%; reiniciar zera.

## 10. Layout 1200×675 sem rolagem

- Elevar as fontes aos mínimos: instruções 18 px, alternativas 18 px, inglês 20 px, feedback 17 px, botões 17 px (utilitários `text-[18px]`/`text-[20px]`/`text-[17px]` no lugar de `text-xs`/`text-sm`).
- Para caber, recomposição por tela: cabeçalho de instrução mais compacto, Lex em painel lateral estreito, blocos em duas colunas, banco de palavras em linha única, ilustrações de Wordville com altura reduzida, área fixa de feedback (não empilha).
- `overflow: hidden` só no palco e no `main`, depois de conferir que tudo cabe.
- Verificação por medição em Playwright nas 10 telas (estados vazio, com erro exibido e concluído), conferindo `scrollHeight <= clientHeight` e ausência de rolagem horizontal.

## Testes a executar

Fluxos de erro→acerto, associação parcial, caça-palavras (ordem errada, caminho descontínuo, caminho correto), montagem com verbo/ordem errados, navegação bloqueada + duplo clique, e reinício com cancelar/confirmar. Ao final, `tsgo` e relatório com os arquivos alterados.

## Detalhes técnicos

Arquivos previstos: `src/lib/caso-conteudo.ts` (ids das formas e das alternativas, blocos da montagem, textos de feedback), `src/components/caso/CacaPalavras.tsx`, `LigarColunas.tsx`, `TelaLacunas.tsx`, `MontarFrase.tsx`, `CasoApp.tsx`, `CasoProvider.tsx`, `useArrasto.tsx`, e dois novos: `Feedback.tsx` e `DialogoReiniciar.tsx`. Sem refatoração de arquitetura, sem tocar em assets, paleta, personagem ou sequência das telas; a chave do localStorage é mantida.
