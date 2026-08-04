# Wordville Verb Detectives

Prompt para o Lovable — "O Caso dos Verbos Desaparecidos" (versão núcleo + áudio)

Copie e cole o conteúdo abaixo diretamente no Lovable.

PROMPT

Construa um aplicativo web educacional interativo, standalone e offline-capable (HTML/CSS/JS, sem dependências de backend), para crianças brasileiras de 8 a 10 anos que estão começando a aprender inglês. O tema é gramatical: a 3ª pessoa do singular no presente simples (go→goes, play→plays), incluindo um canal de áudio/pronúncia em todas as telas relevantes.

Personagem mediadora

Inspetora Lex — detetive curiosa, divertida e atenta. Nunca dá a resposta pronta; sempre guia a criança a deduzir através de perguntas orientadoras. Fala em português (as frases de exemplo em inglês ficam destacadas visualmente, ex.: itálico ou caixa colorida).

Narrativa central

Alguém está trocando as formas verbais nos cartazes da cidade de Wordville. A Inspetora Lex recruta a criança como assistente-detetive para investigar e restaurar as formas corretas.

Requisitos técnicos gerais

App em HTML/CSS/JS puro, um único arquivo (ou estrutura simples com pasta /assets), sem necessidade de servidor.

Áudio/TTS obrigatório: usar a Web Speech API do navegador (speechSynthesis), configurada para inglês (en-US ou en-GB), em todos os botões de alto-falante especificados abaixo. Não depender de arquivos de áudio externos.

Ícone de alto-falante (🔊 ou SVG equivalente) clicável, com estado visual de "tocando" (ex.: pulsando) enquanto o áudio reproduz.

Suporte a touch e mouse em todas as interações de arrastar-e-soltar.

Paleta de cores acessível: azul (investigação), amarelo (evidências/pistas), verde (acerto), laranja (reorientação). Nunca vermelho para erro — evita associação punitiva.

Feedback de acerto/erro deve combinar cor e ícone (ex.: ✓ verde / lupa laranja), nunca cor isolada, por acessibilidade a daltonismo.

Tipografia sans-serif, mínimo 16px para texto corrido, 20px para comandos de tela.

Áreas de "drop" em drag-and-drop com borda tracejada, claramente demarcadas.

Progresso salvo em localStorage (ou window.storage se disponível), permitindo à criança fechar e retomar de onde parou.

Estrutura de estado centralizada (ex.: um objeto de estado único por tela, ou Context/Zustand se for React) para evitar bugs entre as telas de arrastar-e-soltar e ligar-colunas.

12 telas ao todo, navegação linear com possibilidade de voltar.

Estrutura atual (12 telas)

1. Abertura investigativa — percurso principal (registro de hipótese, sem correção)
2. Caça-palavras — percurso principal
3. Observação guiada — percurso principal
4. Go ou goes — percurso principal (com prática adaptativa)
5. Sujeito e forma verbal — percurso principal (com prática adaptativa)
6. Play ou plays — percurso principal (com prática adaptativa)
7. Revisão mista — percurso principal (com prática adaptativa)
8. Metacognição — percurso principal
9. Montagem de frases — percurso principal
10. Extensão com novos cartazes — extensão opcional
11. Novos cenários — novos cenários (conclusão obrigatória dos itens)
12. Encerramento e medalha — encerramento

As estrelas indicam conclusão (0 ou 3 por tela); erros não reduzem estrelas, mas
tentativas, tempo e prática adicional continuam registrados no relatório.

Escopo de conteúdo (IMPORTANTE — não expandir)

Ensinar apenas:

3ª pessoa do singular com -s: go → goes

Generalização do mesmo padrão para outro verbo: play → plays

Não incluir nesta versão: has/have, preposição "go to", ride/rides, negativa com don't/doesn't. Esses ficam para uma unidade futura.

TELA 1 — Abertura

Cenário: Rua principal de Wordville, cartazes espalhados, um deles piscando/tremulando: "He go to school". Lupa gigante brilhando no canto.

Texto da Inspetora Lex:

"Olá! Eu sou a Inspetora Lex, detetive de Wordville. Algo estranho está acontecendo na nossa cidade: as palavras nos cartazes estão mudando de forma! Olha só esse cartaz aqui: 'He go to school'. Tem algo esquisito, não tem? Eu preciso de um assistente-detetive esperto para me ajudar a investigar. Você topa?"

Áudio: botão de alto-falante ao lado do cartaz tremulando, lendo "He go to school" em voz alta.

Botão de ação: "Vamos investigar!"

TELA 2 — Caça-Palavras com Ancoragem Semântica e Sonora

Cenário: Grade de letras (~8x8), estilo "quadro de pistas". Ao lado, um "mural de evidências" vazio que se preenche conforme a criança encontra palavras.

Palavras escondidas na grade: GO · GOES · PLAY · PLAYS

Comando: "Arraste o dedo (ou o mouse) sobre as letras para encontrar as palavras escondidas."

Feedback ao encontrar GO:

Imagem: pessoa caminhando em direção a um lugar (seta de movimento).

Botão de áudio toca: "go" (TTS, /goʊ/).

Texto: "Encontrou 'go'! Isso significa 'ir' — como quando você vai para algum lugar. Clique no alto-falante e escute com atenção."

Feedback ao encontrar GOES:

Imagem: mesmo ícone de movimento, outra pessoa (não "eu").

Botão de áudio toca: "goes" (TTS, /goʊz/).

Texto: "Olha, 'goes'! Parece parente do 'go', não? Escute o som — reparou que termina diferente? Guarde esse som, ele vai ser importante!"

Feedback ao encontrar PLAY:

Imagem: bola / criança brincando.

Botão de áudio toca: "play" (TTS, /pleɪ/).

Texto: "'Play'! Isso significa 'brincar' ou 'jogar'. Escute o som dessa palavra."

Feedback ao encontrar PLAYS:

Imagem: mesma cena, com destaque diferente (ex.: outra criança).

Botão de áudio toca: "plays" (TTS, /pleɪz/).

Texto: "'Plays'! Escute com atenção... o final soa parecido com 'goes', não soa? Essa é a nossa pista sonora do caso!"

Feedback ao concluir todas:

"Excelente trabalho, detetive! Agora temos nossas evidências. Reparou que 'goes' e 'plays' têm um som parecido no final? Isso vai ser importante. Vamos investigar!"

TELA 3 — Observação Guiada: go vs. goes

Cenário: Dois cartazes lado a lado.

Cartaz A: "I go to school every day." (foto de menina apontando para si mesma)

Cartaz B: "She goes to school every day." (foto de outra menina)

Cada cartaz tem um botão de alto-falante que lê a frase completa em voz alta.

Texto da Inspetora Lex:

"Olhe estas duas pistas com atenção de detetive. Ouça as duas frases. Nas duas, alguém vai para a escola. Mas repare no verbo: em uma está 'go' e na outra está 'goes'. O que mudou entre as duas frases? Quem está fazendo a ação é a mesma pessoa?"

Comando: tela de observação, sem resposta ativa. Botão: "Entendi, continuar."

Texto após o botão:

"Reparou? Quando falamos de nós mesmos (I), usamos 'go'. Quando falamos de outra pessoa (She), a palavra ganhou algo no final e virou 'goes'. Essa é nossa primeira pista do caso!"

TELA 4 — Arrastar e Soltar: go ou goes?

Cenário: Três cartazes com frases incompletas, blocos arrastáveis go e goes abaixo de cada um. Cada bloco tem botão de escuta próprio (ouvir antes de decidir).

Frases:

"He \_\_\_ to the park on Sundays."

"We \_\_\_ to the park on Sundays."

"She \_\_\_ to the park on Sundays."

Comando: "Arraste 'go' ou 'goes' para completar cada frase. Você pode ouvir as opções antes de decidir."

Ao acertar: a frase completa é lida em voz alta automaticamente, e aparece um botão extra "🔊 Repetir comigo" (convite à repetição oral livre, sem gravação/avaliação).

Feedback — Correto:

"Muito bem! Você colocou '[goes]' em 'He \_\_\_'. Lembre-se: quando falamos de he, she ou it, o verbo ganha um som a mais no final — vira 'goes'."

Feedback — Incorreto (Conceitual):

"Hmm, vamos pensar juntos. Quem faz a ação aqui é 'He'. Na nossa pista de antes, quando falávamos de 'She', usamos qual forma mesmo? 'Go' ou 'goes'?"

Feedback — Incorreto (Procedimental):

"Tente assim: ouça as duas opções no alto-falante. 'He go to the park' — soa completo? Agora ouça 'He goes to the park'. Qual soa mais natural?"

Feedback — Incorreto (Atencional):

"Olhe bem para o sujeito da frase: é 'He', 'We' ou 'She'? Foi isso que mudou o verbo na nossa pista da Tela 3. Quem faz a ação?"

TELA 5 — Ligar Colunas: Sujeito → Forma Verbal

Cenário: Duas colunas. Esquerda: sujeitos com ícones (I, She, We, He, They). Direita: formas verbais (goes, go, go, goes, go).

Comando: "Clique em um sujeito e depois na forma verbal correta para conectá-los."

Ao conectar corretamente: toca o par completo em áudio (ex.: "She goes").

Feedback — Correto:

"Conexão feita! 'She' combina com 'goes'. E olhe: 'I', 'We' e 'They' todos combinam com 'go'. Será que existe um padrão aqui?"

Feedback — Incorreto (Conceitual):

"Espera aí... 'She' e 'go'? Lembra da nossa pista: quando falamos de outra pessoa (he, she, it), o verbo muda. Qual forma tem o som a mais no final?"

Feedback — Incorreto (Atencional):

"Compare com as conexões que você já fez. Você ligou 'I' a 'go' — certo! Agora, 'She' é parecido com 'I' ou com 'He'?"

TELA 6 — Completar Lacunas: Generalizando para plays

Cenário: Novos cartazes.

Cartaz 1: "She \_\_\_ soccer every weekend." (menina chutando bola)

Cartaz 2: "I \_\_\_ soccer every weekend." (outra criança com bola)

Blocos arrastáveis: play · plays (cada um com botão de escuta).

Texto da Inspetora Lex:

"Lembra do som que você ouviu na Tela 2? 'Goes' e 'plays' têm um final parecido. Será que a mesma regra vale aqui? Ouça as opções antes de arrastar."

Feedback — Correto:

"Isso! 'She plays' — mesma regra de 'She goes'. Quando falamos de he, she ou it, o verbo ganha esse som a mais no final. 'Plays' e 'goes' seguem o mesmo padrão!"

Feedback — Incorreto (Conceitual):

"Vamos pensar: quem faz a ação na frase 'She \_\_\_ soccer'? É 'She'. E o que aprendemos sobre 'she' e o verbo? Ele ganha algo no final..."

Feedback — Incorreto (Atencional):

"Compare com o que você já sabe: 'She goes' está certo. Então 'She plays' ou 'She play'? Ouça as duas opções e siga o mesmo padrão!"

TELA 7 — Completar Lacunas: Revisão Mista

Cenário: Últimos cartazes da cidade, banco único de blocos: go · goes · play · plays (todos com botão de escuta).

Frases:

"He \_\_\_ to school every day." → goes

"We \_\_\_ to the park on Sundays." → go

"She \_\_\_ soccer every weekend." → plays

"I \_\_\_ soccer every weekend." → play

Comando: "Últimos cartazes da cidade! Use tudo o que você descobriu. Cada cartaz precisa da palavra certa."

Ao acertar cada frase: ela é lida em voz alta por completo.

Feedback — Correto:

"Cartaz consertado! Você usou [a palavra] corretamente. O caso está quase no fim!"

Feedback — Incorreto (Conceitual, ex. frase 1):

"Quem faz a ação? 'He'. E o que descobrimos sobre 'he' e o verbo? Ele ganha um som a mais — vira 'goes'."

Feedback — Incorreto (Procedimental):

"Dica de detetive: primeiro identifique quem faz a ação (o sujeito). Depois ouça as duas opções e escolha a que soa certa."

TELA 8 — Momento de Metacognição

Cenário: Escritório da Inspetora Lex, quadro branco com duas perguntas.

Pergunta 1 — "O que você aprendeu?"

"Quando falamos de he, she ou it, o que acontece com o verbo?"

Opção A: "O verbo ganha um som/letra a mais no final" → "Exato! He goes, she plays — todos ganham essa marca."

Opção B: "O verbo fica igual" → "Hmm, lembra de 'She goes'? O 'go' mudou para 'goes'. O que aconteceu ali?"

Pergunta 2 — "Como você descobre a forma correta?"

"Quando você encontrar uma frase para completar, qual é a primeira coisa que você procura?"

Opção A: "Quem faz a ação (o sujeito)" → "Isso! Tudo começa pelo sujeito. E se tiver dúvida, você pode ouvir as opções e comparar o som!"

Opção B: "A palavra mais comprida" → "Boa tentativa! Mas o tamanho não importa tanto. O que muda o verbo é quem faz a ação. Quem é o sujeito?"

TELA 9 — Encerramento

Cenário: Rua principal de Wordville, cartazes corretos e estáveis, personagens comemorando. Inspetora Lex com medalha de "Assistente-Detetive".

Texto da Inspetora Lex:

"Caso resolvido! Todos os cartazes de Wordville estão corretos, e tudo graças a você! Você descobriu que o verbo muda de som e de letra quando falamos de he, she ou it — e que essa regra vale para vários verbos, como go e play! Aqui está sua medalha de Assistente-Detetive. Até o próximo caso!"

Áudio: botão de alto-falante lê a frase de encerramento e o cartaz final corrigido ("He goes to school.").

Botão de ação: "Receber medalha!" → animação simples de medalha sendo entregue.

Observações finais para o Lovable

Todos os textos de feedback acima devem aparecer em caixas de diálogo estilo "balão de fala" da Inspetora Lex, consistentes visualmente em todas as telas.

Priorize a implementação da Web Speech API logo no início do desenvolvimento (Tela 2 em diante depende dela).

Ao testar, verificar se speechSynthesis está disponível no navegador antes de renderizar os botões de áudio; se não estiver, ocultar o botão graciosamente (fallback sem quebrar a experiência).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6a3f9e0b-25c2-40f1-9228-0dfd89e75e44).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
