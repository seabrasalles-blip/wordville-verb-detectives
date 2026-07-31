# Wordville v2 — 9 melhorias

O app hoje tem **10 telas** (1 abertura, 2 caça-palavras, 3 observação, 4 lacunas go/goes, 5 ligar colunas, 6 lacunas play/plays, 7 revisão mista, 8 reflexão, 9 montar frase, 10 fechamento). As telas de prática citadas no prompt (4, 5, 6, 7) correspondem exatamente. Nada é reescrito do zero: tudo entra como mudança incremental. Todo o texto da Lex continua em pt-BR.

Como o palco é fixo em 1200×675 sem rolagem, cada novo elemento global tem orçamento vertical definido abaixo.

## Fase A — Falas e feedbacks (Melhorias 3, 5, 1)

- **Falas em segmentos**: novo `InspectorDialogue` (`DialogoLex.tsx`) recebe `segments: string[]`, mostra 1 segmento, botão "Continuar ▸" revela o próximo com fade; o botão de ação da tela só aparece no último segmento. Segmentos já revelados continuam visíveis.
- **Reescrita**: todas as falas e feedbacks passam a arrays de no máximo 2 frases curtas (≤15 palavras). Feedback correto: 1–2 segmentos; erro conceitual: pergunta-guia + dica; erro atencional: 1 segmento.
- **Melhoria 5**: eliminar toda formulação de julgamento ("soa completo/natural/certo"). Padrão novo: oferecer os dois áudios, apontar a diferença concreta ("o som a mais no final de *goes*") e ligar à pista já aprendida (he/she/it).
- **Melhoria 1 — TTS pt-BR**: novo `FalaLex` (botão azul da Inspetora, ícone alto-falante + silhueta) distinto do botão amarelo de exemplos em inglês. Um botão por segmento. `pt-BR`, `rate 0.9`, `pitch 1.1`, pulso enquanto fala, reinicia se clicado durante a fala, oculto sem `speechSynthesis`. O hook `use-fala` ganha suporte a dois idiomas.

## Fase B — Caça-palavras acessível (Melhoria 9)

Toggle no topo da Tela 2: **Modo Detetive** (arrasto atual, intacto) e **Modo Toque** (botões GO/GOES/PLAY/PLAYS abaixo da grade; ao tocar, as letras do caminho planejado acendem em sequência). Feedback pedagógico idêntico nos dois modos. Padrão sugerido = Toque em dispositivos `pointer: coarse`; preferência salva no localStorage.

## Fase C — Recompensas, mapa do caso (Melhorias 7, 8)

- **Barra de progresso** no cabeçalho existente (sem altura extra): "Caso 3 de 10", ícones por tela que acendem, bônus dourado quando a tela extra existir; contador "⭐ 7/15" no canto.
- **Estrelas** nas telas 4, 5, 6, 7, 9 e extra: 3 = sem erro, 2 = até 1 erro, 1 = concluída. Pop + brilho em CSS. Telas de observação (1, 2, 3, 8, 10) ganham **selos de pista** — no caça-palavras, 1 selo por palavra encontrada.
- **Micro-celebrações**: confete CSS leve e brilho verde no cartaz "consertado".
- **Mapa do Caso**: botão flutuante 📋 no canto superior direito (oculto na capa/Tela 1), overlay com lista de telas (número, nome curto, ícone, ✅/🔵/🔒 e estrelas). Telas concluídas revisitáveis em **modo revisão** (só leitura/áudio, sem refazer, sem alterar estrelas), com "Voltar ao caso". Fecha por ✕ ou clique fora.

## Fase D — Ramificação adaptativa (Melhoria 4)

Estado por tela passa a registrar `errors` e `branchTriggered`. Com 2 erros numa tela de prática (4, 5, 6, 7), abre-se antes do avanço o "Quadro de Pistas Extra" (mesma paleta, moldura amarela) com a fala da Lex e 2 exercícios novos no mesmo formato, com frases/sujeitos diferentes:

- Tela 4: "It ___ to school every day." → goes; "They ___ …" → go
- Tela 5: It → goes, He → goes
- Tela 6: "He ___ soccer on Saturdays." → plays; "We ___ …" → play
- Tela 7: She → goes, I → play, He → goes, They → play

Basta 1 acerto para seguir. Contador zera ao entrar no ramo; com 2 erros no ramo, a Lex dá a resposta e libera o avanço (sem loop de frustração). O disparo fica salvo no relatório.

## Fase E — Modo Professor (Melhoria 10)

Botão discreto "👨‍🏫 Professor" no rodapé, senha fixa `prof2026` (só evita acesso acidental). Overlay em 3 seções:

- **A — Configurações**: áudio da Inspetora on/off; áudio em inglês on/off; modo do caça-palavras auto/arrasto/toque; dificuldade Padrão (2 erros) / Facilitada (1 erro, dicas diretas) / Desafio (sem ramo, só feedback atencional); tela de extensão on/off; zerar progresso.
- **B — Relatório**: tela atual, tabela por tela (tentativas, erros, acerto de primeira, estrelas, ramo disparado, tempo), resumo geral e exportação JSON/CSV via download local.
- **C — Sair** e voltar exatamente à tela da criança.

Estado central passa a gravar tentativas, erros, acertos e tempo em cada interação, no formato `LearningData` do prompt.

## Fase F — Tela extra de verbos (Melhoria 6)

Nova tela opcional entre a reflexão e o fechamento: "Caso Extra: Novos Suspeitos", com like/likes, watch/watches, read/reads em 6 lacunas de arrasto e banco de blocos com áudio próprio. A Lex destaca que *watch* leva **-es**, mas o som é o mesmo das pistas. Botão "Pular caso extra". Se concluída, o fechamento menciona go, play, like, watch e read.

## Detalhes técnicos

- Novos arquivos: `DialogoLex.tsx`, `FalaLex.tsx`, `MapaDoCaso.tsx`, `BarraProgresso.tsx`, `PraticaExtra.tsx`, `PainelProfessor.tsx`, `TelaVerbosExtra.tsx`, `src/lib/relatorio.ts`.
- Alterados: `caso-conteudo.ts` (falas em segmentos, feedbacks, conteúdo do ramo e dos verbos extra), `CasoProvider.tsx` (métricas, estrelas, config, ramo, migração do localStorage v1→v2 preservando progresso), `CasoApp.tsx` (barra, mapa, rodapé, roteamento com ramo e tela extra), `CacaPalavras.tsx`, `TelaLacunas.tsx`, `LigarColunas.tsx`, `MontarFrase.tsx`, `use-fala.ts`, `styles.css` (confete, pop de estrela, brilho).
- Sem backend, sem CDN: só CSS/transform nas animações, mouse+touch em tudo, paleta atual (sem vermelho), feedback cor+ícone, 16/20px mínimos, fallback silencioso de TTS.
- Verificação por fase com Playwright em 1200×675: `scrollHeight === clientHeight === 675`, sem erros de console, incluindo overlays abertos, ramo disparado e tela extra.

## Ordem de entrega

Fases A → B → C → D → E → F, na ordem recomendada pelo prompt. É um volume grande; cada fase é entregue verificada antes de começar a seguinte.
