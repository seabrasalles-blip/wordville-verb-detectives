# Ampliação de vocabulário e cenários (go/play)

Mesma gramática, cenários novos: praia, zoológico, jardim, basquete, tênis, piano, violão, esconde-esconde. Nenhum verbo novo — só go/goes e play/plays em todo o app.

## O que muda para a criança

**Telas de prática ganham cenários variados** (hoje quase tudo é "the park" e "soccer"):
- Tela 4 (go/goes): "He ___ to the beach on Sundays." · "We ___ to the zoo on Sundays." · "She ___ to the park with her family."
- Tela 6 (play/plays): "She ___ basketball every weekend." · "I ___ tennis with my brother." · "It ___ in the garden." (mantida)
- Tela 7 (revisão mista): "He ___ to the beach every Saturday." · "We ___ to the zoo on Sundays." · "She ___ the piano at home." · "I ___ hide and seek in the yard."

**Tela 10 deixa de usar like/watch/read.** Vira "Caso extra: novos cartazes", com go/play em contextos novos: "He ___ the guitar in the band." · "We ___ the violin on Fridays." (forma we/play) · "She ___ swimming at the beach." · "I ___ to the zoo with my family." Assim o escopo fica só go/play, como o documento pede.

**Nova Tela 11 — "O Caso dos Novos Cenários"** (bônus opcional), antes do fechamento:
- Fala da Lex: "Novos lugares, mesma regra! Descubra qual verbo combina com cada cartaz."
- Usa o `TelaLacunas` existente, banco de blocos go / goes / play / plays com áudio.
- 4 cartazes ilustrados (praia, zoológico, jardim, piano).
- Ao concluir: "Você resolveu o caso em todos os cantos de Wordville! A regra funciona em qualquer lugar."
- A criança pode pular, como já acontece com a tela extra atual.

**Tela 12 — "Caso resolvido"** passa a ser o fechamento (era a 11). O caso agora tem 12 telas, refletidas na barra de progresso e no Mapa do Caso.

**Ilustrações**: cada novo cenário ganha um ícone ilustrado (PNG transparente, estilo do app — praia, zoológico, jardim, basquete, tênis, piano, violão, esconde-esconde), usado nos cartazes das telas 4, 6, 7, 10 e 11 em lugar dos emojis. Tela 2 recebe os mesmos ícones no mural lateral de evidências, sem tocar na grade 8x8.

**Novo selo**: "Explorador de Wordville" 🌐, conquistado ao concluir a nova tela bônus. O relatório do Modo Professor inclui automaticamente a linha da nova tela (acertos, erros, estrelas, tempo).

## Detalhes técnicos

- `src/lib/caso-conteudo.ts`:
  - `TOTAL_TELAS` 11 → 12; `TELAS` reordenado (10 = novos cartazes go/play, 11 = novos cenários, 12 = caso resolvido).
  - Reescrever `depois`/`acao`/`ilustracao` de `LACUNAS_TELA4`, `LACUNAS_TELA6`, `LACUNAS_TELA7` com os contextos acima; textos de acerto e dicas seguem a mesma estrutura (grupo do sujeito), só o contexto muda.
  - `LACUNAS_EXTRA` reescrito para famílias `go`/`play`; `BANCO_EXTRA` passa a `["go","goes","play","plays"]`. `FamiliaVerbal` reduz para `"go" | "play"`; remover `t10watch` e ajustar `FALAS.t10`, `FALA_FINAL_EXTRA`.
  - Novos `LACUNAS_TELA11` + `BANCO_TELA11` e `FALAS.t11cenarios` / feedback final; `FALAS.t11` vira `FALAS.t12`.
- `src/lib/relatorio.ts`: `IDS_POR_TELA` ganha a chave 11 e renumera; `TELAS_COM_ESTRELA` inclui 11; novo selo `explorador`; selos que citavam like/watch/read passam a citar os cenários.
- `src/components/caso/CasoApp.tsx`: `TelaFinal` move para `tela === 12`; nova `Tela11Cenarios` reutilizando `TelaLacunas`; `telaConcluida` ganha a regra da nova tela (concluída, pulada ou desativada nas configs); botão "Pular" reaproveitado.
- `src/components/caso/CasoProvider.tsx`: `sanear` migra estados salvos (tela > limites, ids `tx-*` antigos de like/watch/read descartados) e adiciona `cenarios: "pendente" | "feita" | "pulada"` no mesmo padrão de `extensao`; bump da chave de storage para `caso-verbos-desaparecidos-v2` para não herdar respostas de verbos removidos.
- `src/components/caso/MapaCaso.tsx` / `BarraProgresso.tsx`: seguem `TELAS`, sem números fixos — conferir se há literais 11.
- Ilustrações: `imagegen` com `transparent_background`, ~512px, salvas em `src/assets/cenarios/`, importadas por um mapa `ILUSTRACOES` e renderizadas em ~48–56px onde hoje há emoji (mesma caixa, sem crescer o palco).
- Áudio: as frases novas entram no `BotaoAudio`/`useFala` já existentes; blocos go/goes/play/plays já têm áudio.
- Testes: `src/lib/caso-conteudo.test.ts` ganha checagens de que nenhuma lacuna usa verbo fora de go/play e de que cada tela de prática tem ao menos 3 contextos distintos.
- Validação com Playwright em 1200×675 nas telas 4, 6, 7, 10, 11 e 12: sem rolagem, ilustrações carregando, fontes ≥16px.
