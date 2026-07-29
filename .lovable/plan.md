# Eliminar a barra de rolagem (palco fixo 1200×675)

## Contexto confirmado
O palco tem **675px** de altura. Hoje:
- Cabeçalho = 92px, Rodapé = 80px → área de conteúdo ≈ **503px**
- Tela 1 (medida): conteúdo = **966px** (estoura ~460px)
- Cada tela usa `space-y-6`, `p-4/p-5`, `text-xl/2xl`, imagens em largura total 16:9 (~448px de altura), balões grandes e cartões generosos.

Sem compactar, é impossível caber em ~503px. O plano abaixo reduz densidade em **todos** os componentes para que cada tela (estado base + feedback dinâmico) caiba sem rolagem.

## Orçamento-alvo por tela
- Cabeçalho compacto: **~56px** (título `text-base`, `py-2`, barra de progresso `h-2`)
- Rodapé compacto: **~56px** (botões `py-2 text-base`)
- Área de conteúdo: **~563px**
- Cada tela deve usar ≤ ~470px no estado base, deixando ~90px de folga para os balões de dica/acerto que aparecem dinamicamente.

## Etapa 1 — Casca (CasoApp.tsx)
- Header: `py-2`, título `text-base sm:text-lg`, barra de progresso `h-2`, padding `pb-2`.
- Footer: `py-2`, botões `px-5 py-2 text-base` (sem `text-lg py-3`).
- Main: trocar `overflow-y-auto` → **`overflow-hidden`**; `py-3 px-4`; garantir que nada ultrapasse.
- Manter `max-w-4xl` centralizado dentro dos 1200px.

## Etapa 2 — Componentes base (densidade global)
- **BalaoLex**: avatar `w-16` (era `w-24/32`), balão `p-3 text-sm leading-snug` (era `p-5 text-lg`), `space-y-2`.
- **Cartaz**: emoji `text-3xl` (era `5xl`), frase `text-lg` (era `xl/2xl`), `p-3`, legenda `text-sm`.
- **BotaoAudio**: manter, mas `tamanho="sm"` como padrão nas telas compactadas.

## Etapa 3 — Por tela
- **Tela 1**: imagem `h-28 object-cover rounded-2xl` (era largura total ~448px); Cartaz + lupa em linha compacta; balão enxuto.
- **Tela 2 (CacaPalavras)**: grade limitada a `max-w-[260px]` (células menores, ~260px de altura) ao lado do mural de evidências (já em `lg:grid-cols`); instrução `text-base`; balão de conclusão compacto. Tudo cabe lado a lado.
- **Tela 3**: 2 cartazes em `grid-cols-2` (linha ~110px) + balão + botão/revelação; `space-y-3`.
- **Tela 4 / 6 / 7 (TelaLacunas)**: cartões `p-2 gap-2 text-lg`, ilustração `text-xl`, badge "Consertado" inline; banco de palavras `p-2 gap-2 px-3 py-1.5 text-lg`; `space-y-3`. Na **Tela 7 (4 lacunas)**, dispor os cartões em **`grid-cols-2`** para caber em 2 linhas; banco compacto abaixo.
- **Tela 5 (LigarColunas)**: linhas `py-2 text-lg` (5×~42px ≈ 210px); colunas lado a lado; feedback compacto.
- **Tela 8**: dispor as **2 perguntas em `grid-cols-2`** (lado a lado), opções `py-2 text-base`, feedback `text-sm` enxuto. Cada coluna ~280px.
- **Tela 9**: imagem `h-28 object-cover`; 2 cartazes em `grid-cols-2`; balão + medalha `w-24`. Botão "Receber medalha" `py-2`.

## Etapa 4 — Garantir folga para feedback dinâmico
- Dicas/acertos (TelaLacunas, LigarColunas, Tela8) aparecem *somando* altura. O estado base de cada tela será dimensionado para deixar ~90px livres; se algum texto de feedback for muito longo, **encurtar** o texto em `caso-conteudo.ts` (sem mudar o significado pedagógico) para caber.

## Etapa 5 — Verificação
Após implementar, medir via Playwright: para **cada uma das 9 telas** (navegando e completando os exercícios para revelar feedback), confirmar `main.scrollHeight ≤ main.clientHeight` (sem overflow). Ajustar qualquer tela que ainda estourar.

## Arquivos afetados
- `src/components/caso/CasoApp.tsx` (casca + telas 1, 3, 8, 9)
- `src/components/caso/BalaoLex.tsx`
- `src/components/caso/CacaPalavras.tsx`
- `src/components/caso/LigarColunas.tsx`
- `src/components/caso/TelaLacunas.tsx`
- `src/lib/caso-conteudo.ts` (apenas encurtar textos de feedback longos, se necessário)

## Observação
A compactação reduz um pouco o tamanho dos textos/elementos, mas mantém todo o conteúdo pedagógico e a legibilidade adequada para crianças de 8–10 anos. Nenhuma funcionalidade (áudio, arrastar, dicas, progresso) é alterada — apenas o layout.