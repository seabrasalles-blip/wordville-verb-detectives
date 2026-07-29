## Objetivo

Reorganizar estruturalmente a Tela 1 (abertura): Lex grande + balão integrado à esquerda, painel único de evidência à direita, tudo dentro de 1200×675 sem rolagem. Nenhuma outra tela e nenhuma lógica pedagógica é alterada.

## Estrutura atual vs. nova

```text
ANTES                              DEPOIS
[ faixa Wordville h-24 ]           [ faixa Wordville mais baixa ]
[ cartaz+pergunta | Lex pequena ]  [ Lex + balão (38%) | painel evidência (62%) ]
[ área inferior vazia ]            [ colunas com alturas equilibradas ]
```

## 1. Coluna esquerda (38%)

- Balão de fala no topo, largura limitada à coluna, com rabicho apontando para baixo/esquerda em direção à cabeça de Lex.
- Texto curto: "Olá! Eu sou a Inspetora Lex. Os verbos dos cartazes de Wordville estão errados. Você me ajuda a encontrar as pistas?" (18px, entrelinha confortável).
- Lex ancorada na base da coluna, altura ~220–240px, proporção preservada, sem cortes e sem encostar nas bordas; leve deslocamento para que a personagem "olhe" para a direita.
- Balão e personagem formam um bloco só (mesmo container, sem gap grande), nunca um card solto.

## 2. Coluna direita (62%)

Um único painel de investigação centralizado verticalmente, contendo, em ordem:

- rótulo "🔎 Evidência encontrada" (16px, etiqueta);
- frase "He go to school." em destaque (24px);
- pergunta "Algo está errado nesta frase. Você consegue descobrir o quê?" (18px);
- botão "Ver a frase correta" (18px).

Após o clique, a frase correta "He goes to school." aparece dentro do mesmo painel (com áudio), no lugar do botão — mesma altura de bloco, sem deslocar Lex nem crescer a tela.

Estilo: cantos bem arredondados, contorno colorido duplo, sombra suave, fundo claro, inclinação no máximo ~1°.

## 3. Implementação

- `src/components/caso/CasoApp.tsx`: reescrita apenas do componente `Tela1` — grid `[38%_62%]`, altura total do main ocupada com `h-full`, faixa Wordville reduzida (~72–80px) para liberar altura, painel de evidência montado inline (reaproveitando `Cartaz` para a frase correta ou markup próprio).
- `src/components/caso/BalaoLex.tsx`: nova variante `apresentacao` — balão acima, Lex grande embaixo, rabicho conectando os dois; as variantes `linha` e `lateral` usadas nas outras telas ficam intactas.
- Sem mudanças no `CasoProvider`, no conteúdo pedagógico, no cabeçalho, no rodapé ou na lógica de liberação do botão "Vamos investigar!" (continua dependendo de `t1-visto`).

## 4. Verificação

Playwright em 1200×675: screenshot da Tela 1 antes e depois do clique em "Ver a frase correta", medindo `scrollHeight` vs `clientHeight` do palco, do main, do balão e do painel para confirmar zero rolagem, além da altura renderizada de Lex e da checagem do botão de avanço habilitando corretamente.
