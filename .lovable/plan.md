# Correção — feedback de erro travando a Tela 6

## O que foi confirmado no navegador

Reproduzi a Tela 6 no palco 1200×675 e errei uma lacuna de propósito:

- A dica ("Pista da Lex") aparece **dentro do cartão da frase** e faz o cartão crescer.
- A dica **não tem botão de fechar nem fecha sozinha**: só desaparece quando a resposta certa é colocada.
- Como a Tela 6 já tem o balão da Lex + o cartaz de evidência (`The dog plays…`), o crescimento empurra o banco de blocos (`play` / `plays`) e a faixa de feedback para fora da área visível — a `main` tem `overflow-hidden`, então esse conteúdo é cortado.

Resultado prático: depois de um erro, a criança fica sem os blocos para tentar de novo e o botão "Continuar" nunca libera. É o que o relato descreve como feedback "sobreposto" que não sai.

## Correções

1. **A dica deixa de empurrar o layout.** Em `TelaLacunas.tsx`, a dica sai de dentro do cartão da frase e passa a ser exibida em uma faixa única já reservada (a `AreaFeedback` do rodapé da tela), que existe justamente para não alterar a altura. O cartão errado continua sinalizado apenas pela borda de reorientação.
2. **A dica pode ser fechada e sai sozinha.** A faixa ganha botão ✕ e fechamento automático após alguns segundos, além de ser substituída assim que a criança tenta outra resposta.
3. **Banco de blocos sempre visível.** O bloco de blocos e a faixa de feedback ficam fixos na parte de baixo da área de atividade, sem serem deslocados por dicas ou por cartões que crescem.
4. **Verificação nas telas irmãs.** A mesma correção vale para as Telas 4, 7 e o caso extra, que usam o mesmo componente; confiro cada uma em 1200×675.

## Detalhes técnicos

- Arquivo principal: `src/components/caso/TelaLacunas.tsx` — mover o estado `dica` para a `AreaFeedback`, com `onClose` e `autoClose`, e limpar a dica ao acertar ou ao nova tentativa.
- Ajuste leve de espaçamento no cabeçalho da Tela 6 (`CasoApp.tsx`) apenas se a medição mostrar sobra necessária; sem mudança de conteúdo pedagógico.
- Sem alteração de lógica de acerto/erro, contagem de tentativas, estrelas ou ramificação adaptativa.
- Verificação com Playwright em 1200×675 nas Telas 4, 6, 7 e caso extra: erro → dica visível, blocos visíveis, `scrollHeight === clientHeight`, acerto → "Continuar" liberado, sem erros de console.
