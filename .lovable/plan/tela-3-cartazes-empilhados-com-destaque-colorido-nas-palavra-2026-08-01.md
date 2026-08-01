# Tela 3 — cartazes empilhados com destaque colorido nas palavras

Trocar as etiquetas flutuantes por destaque de cor direto nas palavras, com legenda no topo e os dois cartazes empilhados (um em cima do outro) ocupando toda a largura da área de conteúdo.

## O que a criança vai ver

Zona A (esquerda, 300px) fica como está: Inspetora Lex, balão com os 3 segmentos de fala e o feedback ao acertar. Nenhum texto da Lex muda.

Zona B (direita) passa a ter, de cima para baixo:

1. Rótulo "TELA 3 — OBSERVAÇÃO GUIADA" (azul, maiúsculas, pequeno).
2. Barra de legenda: bolinha azul + "Sujeito", bolinha amarela + "Verbo".
3. Cartaz 1 — "I go to school." em largura total, layout horizontal: emoji 🙋‍♀️ em círculo à esquerda, frase grande no centro, botão 🔊 de inglês à direita. "I" com fundo azul claro e sublinhado azul; "go" com fundo amarelo claro e sublinhado âmbar. Logo abaixo da frase, em fluxo normal, minirrótulos alinhados sob as palavras: "sujeito" (azul) e "verbo = ir" (âmbar).
4. Cartaz 2 — "She goes to school." com o mesmo formato, emoji 👧, destaque em "She" e "goes".
5. Pergunta de comparação (centralizada) e os dois botões de resposta ("go virou goes" / "nada mudou"), lado a lado com espaçamento.

Ritmo dos segmentos, igual ao atual:
- Segmento 1: destaques só no cartaz 1; cartaz 2 em texto simples.
- Segmento 2: destaques aparecem também no cartaz 2.
- Segmento 3: pergunta + botões aparecem; acerto mostra ✅ / erro mostra 🔍 e a dica no rodapé de feedback.
- Ao acertar, o balão da Lex passa ao texto de conclusão e os grupos de sujeitos aparecem, como hoje.

Os cartazes nunca ficam lado a lado; em telas estreitas a Zona A vai para o topo compacta e os cartazes seguem empilhados.

## Detalhes técnicos

- `src/components/caso/PalavraMarcada.tsx`: remover `PalavraMarcada` (etiqueta `position: absolute`, `bottom-full`, `translate-x`, níveis) e o `pt-12` de reserva no cartaz. Reescrever `CartazGuiado` como cartaz horizontal (`flex items-center`) com emoji em círculo, frase e `BotaoAudio`; a frase é montada por segmentos onde sujeito e verbo são `span` com fundo/borda inferior de destaque, e cada palavra destacada carrega o minirrótulo abaixo via coluna `inline-flex flex-col items-center` (fluxo normal, sem absolute). Exportar também um `LegendaCores` para a barra de legenda. Tipo `Marcacao` mantido.
- `src/components/caso/CasoApp.tsx` (`Tela3`): Zona B troca `grid grid-cols-2` por coluna vertical (`flex flex-col gap-3`), adiciona o rótulo da tela e a legenda acima dos cartazes, mantém a lógica de `etapa`, `escolha`, `erro`, `despachar({ tipo: "observou" })` e o `AreaFeedback`. Adiciona ✅ ao lado do botão correto quando escolhido.
- `src/styles.css`: utilitários `destaque-sujeito` e `destaque-verbo` usando os tokens existentes (`--investigacao` para azul, `--pista` para amarelo) com fundo suave, `border-bottom: 3px` e cantos arredondados — sem cores novas fora da paleta.
- Altura: cartaz ~120–140px cada; valido em 1200×675 com Playwright para garantir ausência de rolagem nos 3 segmentos e após o acerto.

## Um ponto do pedido que não se aplica

O pedido pede manter o 🔊 de narração pt-BR da Lex por segmento, mas você pediu antes para remover toda a narração em português e os ícones 🔊 dela. Mantenho removido; o áudio em inglês das frases continua. Se quiser o pt-BR de volta, é só dizer.
