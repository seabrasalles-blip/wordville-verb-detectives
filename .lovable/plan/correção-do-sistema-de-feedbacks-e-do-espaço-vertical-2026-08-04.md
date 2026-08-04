# Correção do sistema de feedbacks e do espaço vertical

## Diagnóstico (verificado no código)

- Nenhum feedback usa `position: fixed` ou portal. `Feedback.tsx` + `AreaFeedback` já ficam no fluxo (`min-h-[52px]`), e `AreaFeedback` é o último bloco da coluna de cada atividade.
- O que parece "barra flutuante sobre a grade" na Tela 2 é falta de espaço vertical: em `CacaPalavras.tsx` a grade é fixa (`size-[348px] shrink-0`) e o palco tem `overflow-hidden` (`CasoApp.tsx` linha 109), então a área de feedback comprime/corta as últimas linhas em vez de sobrepor.
- O shell já é `header / main flex-1 / footer` dentro do palco 1200×675 — nada a corrigir aí além de garantir que o conteúdo caiba.
- `DialogoLex.tsx` usa o rótulo "Continuar" no balão da Lex, igual ao botão de avanço de tela no rodapé.
- `styles.css` não tem bloco `prefers-reduced-motion`.

## O que será feito

### 1. Componente `FeedbackSlot`
Novo componente em `src/components/caso/Feedback.tsx` (mantendo `Feedback`):
- largura 100%, altura reservada de 60px (`min-h-[60px]`), sem `fixed`/`absolute`;
- espaço sempre reservado, visualmente neutro quando vazio (sem `display:none`);
- transição suave de entrada/saída, mensagem em até 2 linhas, fonte ≥16px;
- acessibilidade: `role="status" aria-live="polite" aria-atomic="true"` para acerto/dica e `role="alert" aria-live="assertive" aria-atomic="true"` para erro (anúncio único).
`AreaFeedback` passa a ser um alias fino de `FeedbackSlot` para não quebrar as telas existentes.

### 2. Tela 2 — feedback dentro do Mural de evidências
Em `CacaPalavras.tsx`, a ordem interna do mural passa a ser: título → `FeedbackSlot` (mensagem temporária) → lista de cartões encontrados. A área de feedback ao pé da atividade sai da Tela 2.
- Mensagens de acerto por palavra: GO "Boa investigação! Você encontrou GO.", GOES "Muito bem! ...", PLAY "Ótima pista! ...", PLAYS "Excelente! ..."; some em ~2,8s, mantendo apenas o cartão permanente no mural (sem redundância prolongada).
- Erros/tentativas inválidas usam o mesmo slot, tom de atenção com ícone, ~3s, limpando a seleção e preservando as palavras já encontradas.

### 3. Grade responsiva à altura disponível
Grade quadrada com `clamp(300px, 42vh, 348px)` (largura e altura) e células com alvo confortável, garantindo as 8 linhas visíveis, sem corte e sem rolagem; o cabeçalho de instruções da tela fica compacto.

### 4. Duplicidade de "Continuar"
Em `DialogoLex.tsx`, o botão do balão passa a se chamar "Próxima fala". "Continuar" fica exclusivo do rodapé (avanço de tela).

### 5. Demais telas
`TelaLacunas`, `LigarColunas`, `MontarFrase`, metacognição (Tela 8 em `CasoApp.tsx`) e `PraticaExtra` continuam com área reservada no fluxo, agora via `FeedbackSlot`, posicionada no bloco contextual da atividade (abaixo das frases/colunas/opções, dentro do cartão da prática). Nenhum toast global.

### 6. Movimento reduzido
Bloco `@media (prefers-reduced-motion: reduce)` em `src/styles.css` desligando `surge`, `tremula`, `pulsa`, `flutua` e a transição do feedback.

## Verificação
- Playwright em 1200×675, 1366×768 e 1024×576: 8 linhas visíveis, feedback dentro do mural, rodapé visível, `scrollWidth/scrollHeight` sem rolagem, feedback de acerto e de erro capturados em imagem.
- `bunx vitest run` e checagem de tipos/lint.

## Relatório final
Ao concluir, informo: causa real da sobreposição, classes/estilos alterados, onde o `FeedbackSlot` entrou em cada tela, como a duplicidade de "Continuar" foi resolvida, dimensões testadas e resultado de build/lint/testes.
