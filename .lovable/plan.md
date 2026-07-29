## Objetivo

Redesign visual e estrutural de Wordville para crianças de 8–10 anos, com capa inicial, Lex protagonista e paleta vibrante — sem tocar nas atividades, validações, áudios, progresso e textos pedagógicos já corrigidos, e mantendo 1200×675 px sem rolagem.

## 1. Capa inicial (nova tela de entrada)

Novo componente `src/components/caso/Capa.tsx`, exibido antes da Tela 1 e controlado por um estado próprio (`iniciou`) no `CasoProvider`, persistido no localStorage. Assim as 10 telas e toda a lógica de `telaConcluida` continuam idênticas.

Composição no mesmo palco 1200×675:
- fundo: cenário de Wordville tratado (recorte + overlay colorido + vinheta), não como banner solto;
- esquerda: título **O Caso dos Verbos Desaparecidos** em Baloo 2, subtítulo **Ajude a Inspetora Lex a descobrir qual verbo combina com cada frase!**, botão grande **Iniciar investigação** e botão secundário **Como jogar**;
- direita: Lex grande em destaque com balão curto de convite;
- adereços leves: lupa, selo "Missão 1", etiquetas de pista, cartazes com go/goes e play/plays.

"Como jogar" abre um pop-up curto (4 passos ilustrados) dimensionado para caber sem rolagem interna.

Nova arte gerada só para a capa: um painel ilustrado de fundo (cidade Wordville em estilo cartoon infantil) e, se necessário, uma lupa/selo em PNG transparente. Lex, medalha e wordville.jpg atuais são preservados.

## 2. Direção de arte e paleta

Reescrita apenas dos tokens em `src/styles.css` (nenhum componente ganha cor hardcoded):
- azul vivo alegre como `--investigacao`/`--primary`;
- amarelo dourado como `--pista` (destaques e botões secundários);
- laranja quente como `--reorienta` amigável;
- verde claro para `--acerto`;
- coral suave para erro/atenção;
- `--background` em creme/azul claro levemente colorido, com um gradiente e textura suave atrás do palco;
- `--radius` maior (cantos mais infantis) e novas variáveis de sombra/gradiente lúdicas.

Novos utilitários CSS: `superficie-pista`, `etiqueta`, `fita-adesiva`, `sombra-fofa` e uma animação leve de "carimbo" para acertos.

## 3. Componentes mais lúdicos

Ajustes de estilo (sem mudar lógica) em: `Cartaz`, `Grupos`, `BalaoLex`, `Feedback`, `TelaLacunas`, `CacaPalavras`, `LigarColunas`, `MontarFrase`, `DialogoReiniciar`, `BotaoAudio`.
- cards viram "cartões de evidência"/"placas de pista": cantos bem arredondados, borda dupla, leve rotação em elementos decorativos, ícone-selo no topo;
- caça-palavras com aparência de mural de investigação;
- feedbacks como etiquetas de detetive (verde = pista confirmada, coral = pista errada), mantendo a área reservada que evita salto de layout.

## 4. Lex protagonista

- `BalaoLex` ganha variante `lateral`: Lex maior, ancorada em uma coluna própria à direita, com o balão preso a ela por um rabicho.
- Tela 1 recomposta: esquerda/centro com a frase-problema "He go to school.", a pergunta e o botão; direita com painel de Lex + balão. A frase incorreta continua sem áudio.
- Nas demais telas, Lex fica em faixa de apoio fixa (comentadora), sem cobrir a atividade.

## 5. Barra de progresso como trilha de pistas

Cabeçalho reformulado com a mesma altura atual: 10 marcadores em forma de pegadas/lupas ligados por uma trilha pontilhada; concluído = selo verde, atual = lupa pulsante, futuro = marcador apagado. Mantém o contador "n/10" legível.

## 6. Botões e controles

Variantes consistentes: primário (azul, grande, sombra sólida inferior, animação de "afundar" no clique), destaque (amarelo), neutro (contorno grosso). Aplicado a Iniciar investigação, Continuar, Voltar, Ver frase correta, Recomeçar, fechar feedback e botões de áudio (que viram botões redondos com ícone de alto-falante).

## 7. Legibilidade e limite de 675 px

Mínimos mantidos: instruções 18px, alternativas 18px, inglês 20px, feedback 17px, botões 17px. O espaço extra vem de composição em duas colunas e de decoração posicionada em áreas vazias — não de redução de texto.

Verificação final com Playwright: capa + 10 telas, medindo `scrollHeight`/`scrollWidth` de cada contêiner para garantir zero rolagem (inclusive dentro de cards e do pop-up), com screenshots.

## Arquivos afetados

- Novos: `src/components/caso/Capa.tsx`, `src/components/caso/ComoJogar.tsx`, `src/components/caso/PainelLex.tsx`, arte de fundo da capa em `src/assets/`.
- Editados (estilo/composição): `src/styles.css`, `CasoApp.tsx`, `BalaoLex.tsx`, `Feedback.tsx`, `TelaLacunas.tsx`, `CacaPalavras.tsx`, `LigarColunas.tsx`, `MontarFrase.tsx`, `DialogoReiniciar.tsx`, `BotaoAudio.tsx`, `CasoProvider.tsx` (apenas o flag `iniciou`).
- Intocados: `src/lib/caso-conteudo.ts` (conteúdo pedagógico, grades, feedbacks), `use-fala.ts`, `useArrasto.tsx`, critérios de conclusão.
