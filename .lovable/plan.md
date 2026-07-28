## O Caso dos Verbos Desaparecidos — app educativo em 9 telas

Aplicativo web infantil (8–10 anos) com a Inspetora Lex guiando a criança pela regra da 3ª pessoa do singular (go→goes, play→plays), com áudio TTS em inglês.

### Observação sobre o formato
O pedido menciona "um único arquivo HTML/CSS/JS". Este projeto roda em React + TanStack Start, então vou entregar o mesmo comportamento como app React de página única (uma rota `/`, todas as 9 telas dentro dela, sem backend). Funciona offline após o primeiro carregamento e não depende de servidor para a lógica. O áudio usa a Web Speech API do navegador, exatamente como pedido.

### Estrutura
```
/  (src/routes/index.tsx)
   └── <Caso> — estado central + navegação linear (voltar/avançar)
        ├── Tela1 Abertura ... Tela9 Encerramento
        └── Componentes: BalaoLex, BotaoAudio, BlocoArrastavel, ZonaDrop, MuralEvidencias, CacaPalavras, LigarColunas
```

- **Estado central**: um único objeto (React Context + reducer) com `telaAtual`, palavras encontradas, respostas por tela, tentativas e tipo de dica já mostrada. Persistido em `localStorage` a cada mudança, com retomada automática ao reabrir.
- **Áudio**: hook `useFala()` sobre `speechSynthesis`, voz `en-US`, estado "tocando" (ícone pulsando), fila para evitar sobreposição. Se `speechSynthesis` não existir, os botões simplesmente não são renderizados.
- **Drag-and-drop**: implementação própria com Pointer Events (mouse + toque), zonas de drop com borda tracejada; alternativa por clique (selecionar bloco → tocar na lacuna) para acessibilidade.

### Conteúdo das telas
1. **Abertura** — rua de Wordville, cartaz "He go to school" tremulando, botão de áudio, CTA "Vamos investigar!".
2. **Caça-palavras 8x8** — GO, GOES, PLAY, PLAYS; seleção por arraste; mural de evidências que se preenche com ilustração + áudio + texto de cada palavra; mensagem final sobre o som /z/.
3. **Observação guiada** — dois cartazes (I go / She goes), cada um com áudio da frase completa; texto de conclusão após "Entendi, continuar".
4. **Arrastar go/goes** — 3 frases (He / We / She); blocos com áudio; ao acertar, leitura automática + botão "🔊 Repetir comigo"; três variantes de dica (conceitual → procedimental → atencional) conforme a tentativa.
5. **Ligar colunas** — I, She, We, He, They ↔ go/goes por clique; linha desenhada entre os pares; áudio do par ao acertar; dicas conceitual/atencional.
6. **Generalização play/plays** — 2 cartazes, blocos com áudio, feedback ligando ao padrão de "goes".
7. **Revisão mista** — 4 frases com banco único (go, goes, play, plays), leitura da frase ao acertar.
8. **Metacognição** — 2 perguntas de múltipla escolha com as respostas exatas do roteiro em balão da Lex.
9. **Encerramento** — cartazes corrigidos, áudio de fechamento + "He goes to school.", botão "Receber medalha!" com animação da medalha.

Todos os textos de feedback vão nos balões de fala da Lex, idênticos aos do roteiro; frases em inglês destacadas em caixa colorida/itálico.

### Design
- Paleta em tokens semânticos: azul (investigação), amarelo (pistas), verde (acerto), laranja (reorientação) — sem vermelho.
- Feedback sempre cor + ícone (✓ verde / 🔍 laranja).
- Sans-serif arredondada, corpo ≥16px, comandos ≥20px; layout responsivo para tablet e desktop.
- Ilustrações: gero as cenas necessárias (rua de Wordville, Inspetora Lex, ícones de go/goes/play/plays, medalha) como imagens do projeto.

### Detalhes técnicos
- Sem backend, sem banco de dados; progresso só em `localStorage` com fallback silencioso se indisponível.
- Barra de progresso 1–9 e botão voltar em todas as telas.
- Metadados de head próprios da rota inicial (título/descrição do caso).
