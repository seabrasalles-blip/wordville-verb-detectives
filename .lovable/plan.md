## Causa técnica

Hoje as grades em `src/lib/caso-conteudo.ts` guardam apenas as letras (`{ id, letras }`) e o `CacaPalavras.tsx` valida **só pelo texto** formado no arrasto. Como toda ocorrência de `PLAYS` contém as letras `PLAY` (e `GOES` contém `GO`), selecionar as 4 primeiras letras da ocorrência de PLAYS registra "PLAY" naquele caminho errado; a partir daí a ocorrência própria de PLAY responde "essa evidência já está no mural" e o mural mostra o destaque no lugar errado. Nada na estrutura de dados impede que uma grade tenha só a palavra longa.

## 1. Dados: caminhos planejados por grade

Alterar o tipo em `src/lib/caso-conteudo.ts`:

```ts
type Celula = { linha: number; coluna: number };
type PalavraNaGrade = { palavra: PalavraCaca; caminho: Celula[] };
export type GradeCaca = { id: string; letras: string[][]; palavras: PalavraNaGrade[] };
```

As 8 grades passam a declarar explicitamente os 4 caminhos (GO, GOES, PLAY, PLAYS).

## 2. Regeração das grades (script Python descartável)

Gerar 8 grades 8×8 novas, todas com:
- as 4 palavras em caminhos **disjuntos** (nenhuma célula compartilhada — a opção mais segura para 8–10 anos);
- apenas horizontal esquerda→direita e vertical cima→baixo;
- preenchimento aleatório verificado para **não** criar ocorrências acidentais de nenhuma das 4 palavras em nenhuma das 8 direções fora dos caminhos planejados;
- GO nunca sendo o prefixo posicional de GOES, idem PLAY/PLAYS.

O resultado é colado como literal em `caso-conteudo.ts` (nada gerado em runtime).

## 3. Validador de grade

Função exportada `validarGrade(grade): string[]` que rejeita quando:
- falta ou sobra caminho para qualquer das 4 palavras;
- o caminho não é contínuo em direção permitida;
- as letras do caminho não formam a palavra;
- o caminho de GO é prefixo do de GOES (ou PLAY do de PLAYS), ou há células compartilhadas;
- existe ocorrência da palavra fora do caminho planejado.

`GRADES_CACA` é filtrada por esse validador na exportação (`GRADES_VALIDAS`), e um teste em `src/lib/caso-conteudo.test.ts` roda o validador sobre todas as grades para que uma grade inválida quebre o build de testes.

## 4. Validação por caminho no componente

Em `src/components/caso/CacaPalavras.tsx`:
- ao soltar, comparar o caminho selecionado com os `grade.palavras`: acerto só quando o caminho coincide **exatamente** com um caminho planejado ainda não encontrado;
- caminho que é prefixo de um caminho planejado (ex.: 4 primeiras células de PLAYS) → dica "Você encontrou o começo de uma palavra. Observe se há mais alguma letra.", sem registrar nada;
- caminho igual a um já encontrado → "essa evidência já está no mural";
- células destacadas continuam clicáveis: o destaque `encontradas` é só visual, nenhum `disabled`/`pointer-events-none`, e `iniciar()` limpa apenas a seleção temporária;
- mural e contador continuam por palavra (1/4 ao achar PLAY, PLAYS independente).

## 5. Estado salvo

Em `src/components/caso/CasoProvider.tsx`, o `sanear` passa a:
- descartar `gradeId` que não exista mais ou não passe no validador, sorteando uma grade válida;
- manter em `caminhos`/`encontradas` apenas as palavras cujo caminho salvo bate com um caminho planejado da grade atual; o resto é limpo;
- preservar intactos o progresso das demais telas.

Assim quem tem estado antigo volta à Tela 2 numa grade válida e consegue concluir.

## 6. Verificação

Playwright em 1200×675, script que, para cada grade válida, executa arrasto célula a célula nas 4 ordens exigidas (GO→GOES→PLAY→PLAYS, GOES→GO→PLAYS→PLAY, PLAY→PLAYS→GO→GOES, PLAYS→PLAY→GOES→GO), confirmando 4/4 e 4 itens no mural; mais um teste de recarregamento (2 palavras → reload → mesma grade, 2 registradas, outras 2 achaveis) e um de nova tentativa. Em todos os passos, checagem de `scrollHeight === clientHeight === 675` e largura 1200, sem erros de console.

## Arquivos afetados

- `src/lib/caso-conteudo.ts` (tipo, 8 grades novas com caminhos, `validarGrade`, `sortearGradeId` restrito a grades válidas)
- `src/components/caso/CacaPalavras.tsx` (validação por caminho, células nunca bloqueadas)
- `src/components/caso/CasoProvider.tsx` (saneamento/migração do estado do caça-palavras)
- `src/lib/caso-conteudo.test.ts` (novo, valida as 8 grades)

Layout, fontes e todas as correções pedagógicas anteriores ficam intactos.
