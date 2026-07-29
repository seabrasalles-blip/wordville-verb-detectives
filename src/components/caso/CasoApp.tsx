import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, HelpCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import wordville from "@/assets/wordville.jpg";
import medalha from "@/assets/medalha.png";
import {
  CARTOES_TELA5,
  GRUPOS,
  LACUNAS_TELA4,
  LACUNAS_TELA6,
  LACUNAS_TELA7,
  MONTAGENS,
  PALAVRAS_CACA,
  PARES_TELA5,
  PERGUNTAS_TELA8,
  TOTAL_TELAS,
  fraseDaMontagem,
} from "@/lib/caso-conteudo";
import { CasoProvider, useCaso } from "./CasoProvider";
import { BalaoLex, Ingles } from "./BalaoLex";
import { BotaoAudio } from "./BotaoAudio";
import { Capa } from "./Capa";
import { ComoJogar } from "./ComoJogar";
import { CacaPalavras } from "./CacaPalavras";
import { DialogoReiniciar } from "./DialogoReiniciar";
import { AreaFeedback, Feedback } from "./Feedback";
import { LigarColunas } from "./LigarColunas";
import { MontarFrase } from "./MontarFrase";
import { TelaLacunas } from "./TelaLacunas";

const TITULOS = [
  "Abertura",
  "Caça-palavras",
  "Observação guiada",
  "go ou goes?",
  "Sujeito → verbo",
  "Agora com play",
  "Revisão mista",
  "O que você aprendeu",
  "Monte a frase",
  "Caso resolvido",
];

export function CasoApp() {
  return (
    <CasoProvider>
      <Casca />
    </CasoProvider>
  );
}

/** Critério pedagógico de conclusão de cada tela. */
function telaConcluida(tela: number, estado: ReturnType<typeof useCaso>["estado"]) {
  switch (tela) {
    case 1:
      return estado.respostas["t1-visto"] === "sim";
    case 2:
      return estado.encontradas.length === PALAVRAS_CACA.length;
    case 3:
      return estado.observou;
    case 4:
      return LACUNAS_TELA4.every((l) => estado.respostas[l.id] === l.resposta);
    case 5:
      return PARES_TELA5.every((p) => {
        const cartao = CARTOES_TELA5.find((c) => c.id === estado.conexoes[p.id]);
        return cartao?.forma === p.forma;
      });
    case 6:
      return LACUNAS_TELA6.every((l) => estado.respostas[l.id] === l.resposta);
    case 7:
      return LACUNAS_TELA7.every((l) => estado.respostas[l.id] === l.resposta);
    case 8:
      return PERGUNTAS_TELA8.every((q) => {
        const i = estado.metacognicao[q.id];
        return i !== undefined && q.opcoes[i]?.correta === true;
      });
    case 9:
      return MONTAGENS.every((m) => estado.montagens[m.id] === fraseDaMontagem(m));
    case 10:
      return estado.medalha;
    default:
      return true;
  }
}

function Casca() {
  const { estado, despachar, avancar, voltar, reiniciar } = useCaso();
  const tela = estado.tela;
  const [confirmando, setConfirmando] = useState(false);
  const [ajuda, setAjuda] = useState(false);
  const [processando, setProcessando] = useState(false);
  const travaRef = useRef(false);

  const liberado = telaConcluida(tela, estado);

  // libera a trava assim que a tela muda
  useEffect(() => {
    travaRef.current = false;
    setProcessando(false);
  }, [tela]);

  const navegar = (acao: () => void) => {
    if (travaRef.current) return;
    travaRef.current = true;
    setProcessando(true);
    acao();
  };

  const concluidas = Array.from({ length: TOTAL_TELAS }, (_, i) =>
    telaConcluida(i + 1, estado),
  );

  return (
    <div className="ceu-wordville flex min-h-screen items-center justify-center p-0 [@media(min-height:707px)]:p-2 [@media(min-height:743px)]:p-4">
      <div className="relative flex h-[675px] w-full max-w-[1200px] flex-col overflow-hidden rounded-[2rem] border-4 border-investigacao/25 bg-background shadow-2xl">
        {!estado.iniciou ? (
          <Capa aoIniciar={() => despachar({ tipo: "iniciar" })} />
        ) : (
          <>
            <header className="shrink-0 border-b-4 border-investigacao/20 bg-card">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-1.5">
                <h1 className="flex items-center gap-2 text-lg font-extrabold text-investigacao">
                  <span aria-hidden="true">🕵️‍♀️</span> O Caso dos Verbos Desaparecidos
                </h1>
                <span className="etiqueta hidden border-pista bg-pista text-[14px] text-pista-foreground sm:inline-block">
                  Wordville
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setAjuda(true)}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[15px] font-bold text-investigacao hover:bg-investigacao/10"
                  >
                    <HelpCircle className="size-4" aria-hidden="true" /> Como jogar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmando(true)}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[15px] font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    <RotateCcw className="size-4" aria-hidden="true" /> Recomeçar
                  </button>
                </div>
              </div>
              <div className="mx-auto flex max-w-5xl items-center gap-1.5 px-4 pb-1.5">
                {concluidas.map((ok, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      "h-2 flex-1 rounded-full transition-colors",
                      ok
                        ? "bg-acerto"
                        : i + 1 === tela
                          ? "bg-pista ring-2 ring-investigacao/40"
                          : "bg-secondary",
                    )}
                  />
                ))}
                <span className="ml-2 rounded-full bg-investigacao px-2.5 py-0.5 text-[14px] font-bold text-investigacao-foreground">
                  {tela}/{TOTAL_TELAS}
                </span>
              </div>
            </header>

            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-4 py-1.5">
              <p className="mb-1 flex items-center gap-2 text-[13px] font-extrabold tracking-wide text-investigacao uppercase">
                <span aria-hidden="true">🔎</span> Tela {tela} — {TITULOS[tela - 1]}
              </p>
              {tela === 1 ? <Tela1 /> : null}
              {tela === 2 ? <CacaPalavras /> : null}
              {tela === 3 ? <Tela3 /> : null}
              {tela === 4 ? (
                <TelaLacunas
                  lacunas={LACUNAS_TELA4}
                  banco={["go", "goes"]}
                  comando="Observe quem pratica a ação e escolha a forma correta do verbo."
                />
              ) : null}
              {tela === 5 ? <LigarColunas /> : null}
              {tela === 6 ? <Tela6 /> : null}
              {tela === 7 ? (
                <TelaLacunas
                  lacunas={LACUNAS_TELA7}
                  banco={["go", "goes", "play", "plays"]}
                  comando="Observe quem pratica a ação e escolha a forma correta do verbo."
                  aoConcluir="Todos os cartazes estão consertados! Vamos ao escritório."
                />
              ) : null}
              {tela === 8 ? <Tela8 /> : null}
              {tela === 9 ? <MontarFrase /> : null}
              {tela === 10 ? <Tela10 /> : null}
            </main>

            <footer className="shrink-0 border-t-4 border-investigacao/20 bg-card/95">
              <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-1.5">
                <button
                  type="button"
                  onClick={() => navegar(voltar)}
                  disabled={tela === 1 || processando}
                  aria-disabled={tela === 1 || processando}
                  className="botao-fofo inline-flex items-center gap-1.5 border-2 border-investigacao/40 bg-card px-4 py-1.5 text-[17px] text-investigacao disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
                </button>
                {tela < TOTAL_TELAS ? (
                  <div className="ml-auto flex items-center gap-2">
                    {!liberado ? (
                      <span className="text-[15px] font-semibold text-muted-foreground">
                        Termine a investigação desta tela para continuar
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => navegar(avancar)}
                      disabled={!liberado || processando}
                      aria-disabled={!liberado || processando}
                      className="botao-fofo inline-flex items-center gap-1.5 bg-investigacao px-6 py-2 text-[17px] text-investigacao-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {tela === 1 ? "Vamos investigar!" : "Continuar"}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            </footer>

            <ComoJogar aberto={ajuda} aoFechar={() => setAjuda(false)} />
          </>
        )}

        <DialogoReiniciar
          aberto={confirmando}
          aoCancelar={() => setConfirmando(false)}
          aoConfirmar={() => {
            setConfirmando(false);
            reiniciar();
          }}
        />
      </div>
    </div>
  );
}


function Cartaz({
  frase,
  legenda,
  icone,
  tremulando,
  audioId,
  semAudio,
}: {
  frase: string;
  legenda?: string;
  icone: string;
  tremulando?: boolean;
  audioId?: string;
  semAudio?: boolean;
}) {
  return (
    <div
      className={cn(
        "cartao-pista border-investigacao p-2 text-center",
        tremulando && "tremula border-reorienta",
      )}
    >
      <span aria-hidden="true" className="text-2xl">
        {icone}
      </span>
      <p className="mt-0.5 text-[20px] font-bold text-investigacao">
        <Ingles>{frase}</Ingles>
      </p>
      {legenda ? <p className="mt-0.5 text-[15px] text-muted-foreground">{legenda}</p> : null}
      {semAudio ? null : (
        <div className="mt-1.5 flex justify-center">
          <BotaoAudio texto={frase} id={audioId} tamanho="sm" />
        </div>
      )}
    </div>
  );
}

/** Os dois grupos de sujeitos, base da regra. */
function Grupos() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {GRUPOS.map((g) => (
        <div key={g.id} className="cartao-pista border-investigacao p-2">
          <p className="etiqueta inline-block border-pista bg-pista text-[16px] text-pista-foreground">
            <span aria-hidden="true">{g.icone}</span> {g.titulo}
          </p>
          <p className="mt-0.5 text-[20px] font-bold">
            <Ingles>{g.formas}</Ingles>
          </p>
          <ul className="mt-1 space-y-0.5">
            {g.exemplos.map((ex) => (
              <li key={ex} className="flex items-center gap-2 text-[18px] font-semibold">
                <span>{ex}</span>
                <BotaoAudio texto={ex} tamanho="sm" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Tela1() {
  const { estado, despachar } = useCaso();
  const visto = estado.respostas["t1-visto"] === "sim";
  return (
    <div className="space-y-2">
      <img
        src={wordville}
        alt="Rua principal da cidade de Wordville, cheia de cartazes"
        width={1536}
        height={768}
        className="h-24 w-full rounded-3xl border-4 border-pista object-cover shadow-md"
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_0.75fr] sm:items-center">
        <div className="space-y-1.5">
          <Cartaz frase="He go to school." icone="🏫" tremulando semAudio />
          <p className="text-center text-[17px] font-semibold text-reorienta">
            Algo está errado nesta frase. Você consegue descobrir o quê?
          </p>
          {!visto ? (
            <button
              type="button"
              onClick={() => despachar({ tipo: "responder", id: "t1-visto", valor: "sim" })}
              className="botao-fofo mx-auto block bg-pista px-5 py-2 text-[17px] text-pista-foreground"
            >
              Ver a frase correta
            </button>
          ) : (
            <Cartaz frase="He goes to school." icone="✅" audioId="cartaz-correto" />
          )}
        </div>
        <BalaoLex variante="lateral">

          <p className="text-[17px]">
            Olá! Eu sou a Inspetora Lex, detetive de Wordville. Os verbos dos cartazes estão
            errados.
          </p>
          <p className="text-[17px]">Preciso de um assistente-detetive. Você topa?</p>
        </BalaoLex>
      </div>
    </div>
  );
}

function Tela3() {
  const { estado, despachar } = useCaso();
  const [erro, setErro] = useState(false);
  const [escolha, setEscolha] = useState<"certa" | "errada" | null>(null);
  const revelado = estado.observou;
  const neutro =
    "rounded-full border-2 border-investigacao/40 bg-card px-4 py-1.5 text-[18px] font-bold text-investigacao transition-colors hover:bg-investigacao/10";

  return (
    <div className="space-y-2">
      <p className="text-[18px] font-semibold">Observe as frases. Quem pratica a ação?</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Cartaz frase="I go to school." icone="🙋‍♀️" audioId="t3-a" />
        <Cartaz frase="She goes to school." icone="👧" audioId="t3-b" />
      </div>

      {!revelado ? (
        <div className="space-y-2">
          <p className="text-[18px] font-semibold">Compare os dois exemplos. O que mudou no verbo?</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={escolha === "certa"}
              onClick={() => {
                setEscolha("certa");
                setErro(false);
                despachar({ tipo: "observou" });
              }}
              className={cn(neutro, escolha === "certa" && "border-pista bg-pista text-pista-foreground")}
            >
              go virou goes
            </button>
            <button
              type="button"
              aria-pressed={escolha === "errada"}
              onClick={() => {
                setEscolha("errada");
                setErro(true);
              }}
              className={cn(
                neutro,
                escolha === "errada" && "border-reorienta bg-reorienta/20 text-reorienta",
              )}
            >
              nada mudou
            </button>
          </div>

          <AreaFeedback>
            {erro ? (
              <Feedback
                type="error"
                message="Olhe o verbo das duas frases. Compare go e goes. Tente novamente."
                onClose={() => setErro(false)}
              />
            ) : null}
          </AreaFeedback>
        </div>
      ) : (
        <>
          <Grupos />
          <BalaoLex tom="pista">
            <p className="text-[17px]">
              Com <Ingles>he</Ingles>, <Ingles>she</Ingles> e <Ingles>it</Ingles>, o verbo muda.
              Play vira plays e go vira goes. Com <Ingles>I</Ingles>, <Ingles>you</Ingles>,{" "}
              <Ingles>we</Ingles> e <Ingles>they</Ingles>, usamos play e go sem mudança.
            </p>
          </BalaoLex>
        </>
      )}
    </div>
  );
}

function Tela6() {
  return (
    <div className="space-y-2">
      <div className="cartao-pista flex flex-wrap items-center gap-2 border-pista px-3 py-1.5">
        <span aria-hidden="true" className="text-2xl">
          🐶
        </span>
        <p className="text-[20px] font-bold text-investigacao">
          <Ingles>The dog plays in the garden.</Ingles>
        </p>
        <BotaoAudio texto="The dog plays in the garden." id="t6-dog" tamanho="sm" />
        <p className="text-[20px] font-bold text-investigacao">
          <Ingles>It plays in the garden.</Ingles>
        </p>
        <BotaoAudio texto="It plays in the garden." id="t6-it-frase" tamanho="sm" />
        <p className="w-full text-[15px] font-semibold text-muted-foreground">
          Na escrita, algumas palavras recebem S e outras recebem ES: play → plays, go → goes.
        </p>
      </div>

      <TelaLacunas
        lacunas={LACUNAS_TELA6}
        banco={["play", "plays"]}
        comando="Observe quem pratica a ação e escolha o verbo correto."
      />
    </div>
  );
}

function Tela8() {
  const { estado, despachar } = useCaso();
  return (
    <div className="space-y-2">
      <p className="text-[18px] font-semibold">Responda as duas perguntas do quadro da Lex.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {PERGUNTAS_TELA8.map((q) => {
          const escolhida = estado.metacognicao[q.id];
          const opcao = escolhida !== undefined ? q.opcoes[escolhida] : undefined;
          const certa = opcao?.correta === true;
          return (
            <div key={q.id} className="cartao-pista border-investigacao/70 p-2.5">
              <h2 className="etiqueta inline-block border-pista bg-pista text-[16px] text-pista-foreground">{q.titulo}</h2>
              <p className="mt-0.5 text-[18px]">{q.pergunta}</p>
              <div className="mt-2 grid gap-2">
                {q.opcoes.map((op, i) => (
                  <button
                    key={op.id}
                    type="button"
                    disabled={certa}
                    onClick={() => despachar({ tipo: "metacognicao", id: q.id, indice: i })}
                    className={cn(
                      "rounded-xl border-2 px-3 py-1.5 text-left text-[18px] font-semibold transition-colors disabled:cursor-not-allowed",
                      escolhida === i
                        ? op.correta
                          ? "border-acerto bg-acerto/15"
                          : "border-reorienta bg-reorienta/15"
                        : "border-investigacao/40 hover:bg-investigacao/10",
                    )}
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
              <AreaFeedback>
                {opcao ? (
                  <Feedback
                    type={certa ? "success" : "error"}
                    message={
                      certa ? opcao.feedback : `${opcao.feedback} Escolha novamente.`
                    }
                    className="mt-2"
                  />
                ) : null}
              </AreaFeedback>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tela10() {
  const { estado, despachar, fala } = useCaso();

  return (
    <div className="space-y-2">
      <img
        src={wordville}
        alt="Rua de Wordville com os cartazes corrigidos e a cidade em festa"
        width={1536}
        height={768}
        loading="lazy"
        className="h-14 w-full rounded-2xl border-2 border-acerto object-cover shadow-md"
      />
      <Grupos />
      <BalaoLex tom="acerto">
        <p className="text-[17px]">
          Você descobriu a pista! Com <Ingles>he</Ingles>, <Ingles>she</Ingles> e{" "}
          <Ingles>it</Ingles>, usamos goes e plays. Com <Ingles>I</Ingles>, <Ingles>you</Ingles>,{" "}
          <Ingles>we</Ingles> e <Ingles>they</Ingles>, usamos go e play.
        </p>
      </BalaoLex>

      {estado.medalha ? (
        <div className="medalha-anima flex items-center justify-center gap-3">
          <img
            src={medalha}
            alt="Medalha de Assistente-Detetive"
            width={768}
            height={768}
            loading="lazy"
            className="w-14 drop-shadow-xl"
          />
          <p className="text-[18px] font-bold text-acerto">
            Assistente-Detetive de Wordville! 🎉
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            despachar({ tipo: "medalha" });
            fala.falar("He goes to school.", "final-1");
          }}
          className="botao-fofo mx-auto block bg-acerto px-7 py-2 text-[17px] text-acerto-foreground"
        >
          Receber medalha!
        </button>
      )}
    </div>
  );
}
