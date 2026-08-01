# Tela 3 — Observação Guiada em 3 etapas

Hoje a Tela 3 mostra as duas frases lado a lado e pergunta direto o que mudou no verbo. A criança pode não saber o que "go" significa nem qual palavra é o sujeito. Vamos ensinar antes de perguntar.

## O que a criança vai ver

**Etapa 1 — a primeira frase**
Lex explica: "Vamos olhar a primeira frase com atenção de detetive. 'I go to school' significa 'Eu vou para a escola'. Quem faz a ação é 'I' — eu. Esse é o sujeito! E o verbo — a ação — é 'go', que significa 'ir'."
No cartaz da esquerda, "I" ganha moldura azul com a etiqueta "Sujeito — quem faz a ação" e "go" ganha moldura amarela com "Verbo — a ação (ir)". O ícone 🙋‍♀️ do cartaz pulsa em azul nesta etapa. As etiquetas entram com fade-in suave (verbo logo depois do sujeito).

**Etapa 2 — a segunda frase** (após "Continuar")
Lex: "Agora a segunda frase. 'She goes to school' significa 'Ela vai para a escola'. Quem faz a ação é 'She' — ela. O sujeito mudou!" / "E o verbo também: virou 'goes'. Continua significando 'ir', mas a palavra mudou. Estranho, não?"
O cartaz da direita recebe as mesmas marcações (She = azul, goes = amarelo) e o ícone 👧 pulsa. As marcações da frase 1 permanecem.

**Etapa 3 — a pergunta** (após "Continuar")
Lex: "Compare os dois exemplos. O sujeito mudou de 'I' para 'She'. E o verbo? O que mudou quando o sujeito virou 'She'?"
Só aqui aparecem os dois botões de resposta que já existem ("go virou goes" / "nada mudou"), com feedback novo:
- correto: "Isso! Quando o sujeito é 'She' (ela), o verbo 'go' vira 'goes'. Mas os dois significam 'ir' — só mudou a forma, não o significado. Boa observação, detetive!"
- incorreto: "Olhe de novo para os verbos que destacamos. Na primeira frase está 'go'. Na segunda está 'goes'. As palavras são diferentes, não? O que mudou entre elas?"

Depois do acerto, segue como hoje: aparecem os grupos de sujeitos e a fala de conclusão.

## Detalhes técnicos

- `src/lib/caso-conteudo.ts`: `FALAS.t3` passa a ter os 3 segmentos acima (2 frases no máximo por segmento) e ganha os dois textos de feedback da comparação.
- `src/components/caso/CasoApp.tsx` (`Tela3`): passa a acompanhar o segmento atual do `DialogoLex` (novo callback `aoAvancar`/índice exposto pelo componente existente) e libera os botões de resposta apenas no segmento 3. Os cartazes recebem props novas para marcação de sujeito/verbo e destaque do ícone.
- `src/components/caso/DialogoLex.tsx`: expor o índice do segmento atual via prop opcional `aoMudar(indice)`, sem mudar o comportamento do botão "Continuar" nem das outras telas.
- Novo `src/components/caso/PalavraMarcada.tsx`: componente reutilizável que envolve uma palavra da frase com moldura + etiqueta flutuante (`variante: "sujeito" | "verbo"`). Etiqueta em `position: absolute` acima da palavra, com reserva de espaço no topo do cartaz para nunca sobrepor o texto; empilha junto com os cartazes em telas estreitas (`grid` → 1 coluna).
- `src/styles.css`: tokens/classes para as duas etiquetas usando a paleta existente (azul de investigação e amarelo de pista, sem novas cores), mais `pulsa-azul` para o ícone e o fade-in escalonado.
- Mantidos: botão 🔊 de inglês por frase, barra de progresso e contador, Recomeçar, Mapa do Caso, Professor, navegação linear travada até a resposta correta, fallback de `speechSynthesis`.
- Altura: as etiquetas somam ~22px por cartaz; ajusto os espaçamentos internos da Tela 3 para o palco continuar em 1200×675 sem rolagem, validando com Playwright.

## Um ponto a alinhar

O pedido menciona botão 🔊 de áudio pt-BR nas falas da Lex, mas você pediu antes para remover toda a narração em português e os ícones 🔊 dela. Vou manter removido (só áudio em inglês das frases). Se quiser o pt-BR de volta, é só dizer.
