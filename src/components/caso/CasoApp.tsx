import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import wordville from "@/assets/wordville.jpg";
import medalha from "@/assets/medalha.png";
import {
  GRUPOS,
  LACUNAS_TELA4,
  LACUNAS_TELA6,
  LACUNAS_TELA7,
  MONTAGENS,
  PALAVRAS_CACA,
  PARES_TELA5,
  PERGUNTAS_TELA8,
  TOTAL_TELAS,
} from "@/lib/caso-conteudo";
import { CasoProvider, useCaso } from "./CasoProvider";
import { BalaoLex, Ingles } from "./BalaoLex";
import { BotaoAudio } from "./BotaoAudio";
import { CacaPalavras } from "./CacaPalavras";
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

function Casca() {
  const { estado, avancar, voltar, reiniciar } = useCaso();
  const tela = estado.tela;

  const liberado = (() => {
    switch (tela) {
      case 2:
        return estado.encontradas.length === PALAVRAS_CACA.length;
      case 3:
        return estado.observou;
      case 4:
        return LACUNAS_TELA4.every((l) => estado.respostas[l.id] === l.resposta);
      case 5:
        return PARES_TELA5.every((p) => estado.conexoes[p.id]);
      case 6:
        return LACUNAS_TELA6.every((l) => estado.respostas[l.id] === l.resposta);
      case 7:
        return LACUNAS_TELA7.every((l) => estado.respostas[l.id] === l.resposta);
      case 8:
        return PERGUNTAS_TELA8.every((q) => estado.metacognicao[q.id] !== undefined);
      case 9:
        return MONTAGENS.every((m) => estado.montagens[m.id] === m.correta);
      default:
        return true;
    }
  })();


  return (
    <div className="flex min-h-screen items-center justify-center bg-black/5 p-2 sm:p-4">
    <div className="relative flex h-[675px] w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl border border-investigacao/20 bg-background shadow-2xl">
      <header className="shrink-0 border-b-4 border-investigacao/20 bg-card">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-2">
          <h1 className="text-base font-bold text-investigacao sm:text-lg">
            🕵️‍♀️ O Caso dos Verbos Desaparecidos
          </h1>
          <button
            type="button"
            onClick={reiniciar}
            className="ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-secondary"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" /> Recomeçar
          </button>
        </div>
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 pb-2">
          {Array.from({ length: TOTAL_TELAS }, (_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i + 1 < tela ? "bg-acerto" : i + 1 === tela ? "bg-investigacao" : "bg-secondary",
              )}
            />
          ))}
          <span className="ml-2 text-xs font-semibold text-muted-foreground">
            {tela}/{TOTAL_TELAS}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden px-4 py-2">
        <p className="mb-1 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
          Tela {tela} — {TITULOS[tela - 1]}
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
        {tela === 10 ? <Tela9 /> : null}
      </main>


      <footer className="shrink-0 border-t-4 border-investigacao/20 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-2">
          <button
            type="button"
            onClick={voltar}
            disabled={tela === 1}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-investigacao/40 px-3.5 py-1.5 text-sm font-bold text-investigacao disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Voltar
          </button>
          {tela < TOTAL_TELAS ? (
            <div className="ml-auto flex items-center gap-2">
              {!liberado ? (
                <span className="hidden text-xs text-muted-foreground sm:block">
                  Termine a investigação desta tela para continuar
                </span>
              ) : null}
              <button
                type="button"
                onClick={avancar}
                disabled={!liberado}
                className="inline-flex items-center gap-1.5 rounded-full bg-investigacao px-5 py-2 text-base font-bold text-investigacao-foreground shadow-lg transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-40"
              >
                {tela === 1 ? "Vamos investigar!" : "Continuar"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </footer>
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
        "rounded-2xl border-2 border-investigacao bg-card p-2.5 text-center shadow-md",
        tremulando && "tremula border-reorienta",
      )}
    >
      <span aria-hidden="true" className="text-3xl">
        {icone}
      </span>
      <p className="mt-1 text-base font-bold text-investigacao sm:text-lg">
        <Ingles>{frase}</Ingles>
      </p>
      {legenda ? <p className="mt-0.5 text-xs text-muted-foreground">{legenda}</p> : null}
      {semAudio ? null : (
        <div className="mt-2 flex justify-center">
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
        <div key={g.id} className="rounded-2xl border-2 border-investigacao bg-card p-2.5">
          <p className="text-sm font-bold text-investigacao">
            <span aria-hidden="true">{g.icone}</span> {g.titulo}
          </p>
          <p className="mt-0.5 text-base font-bold">
            <Ingles>{g.formas}</Ingles>
          </p>
          <ul className="mt-1 space-y-0.5">
            {g.exemplos.map((ex) => (
              <li key={ex} className="flex items-center gap-2 text-sm font-semibold">
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
  const [visto, setVisto] = useState(false);
  return (
    <div className="space-y-3">
      <img
        src={wordville}
        alt="Rua principal da cidade de Wordville, cheia de cartazes"
        width={1536}
        height={768}
        className="h-24 w-full rounded-2xl border-2 border-investigacao object-cover shadow-md sm:h-28"
      />
      <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
        <div className="space-y-1.5">
          <Cartaz frase="He go to school." icone="🏫" tremulando semAudio />
          <p className="text-center text-xs font-semibold text-reorienta">
            Algo está errado nesta frase. Você consegue descobrir o quê?
          </p>
          {!visto ? (
            <button
              type="button"
              onClick={() => setVisto(true)}
              className="mx-auto block rounded-full bg-pista px-4 py-1.5 text-sm font-bold text-pista-foreground shadow-md"
            >
              Ver a frase correta
            </button>
          ) : (
            <Cartaz frase="He goes to school." icone="✅" audioId="cartaz-correto" />
          )}
        </div>
        <BalaoLex>
          <p>
            Olá! Eu sou a Inspetora Lex, detetive de Wordville. Os verbos dos cartazes estão
            errados.
          </p>
          <p>Preciso de um assistente-detetive. Você topa?</p>
        </BalaoLex>
      </div>
    </div>
  );
}

function Tela3() {
  const { estado, despachar } = useCaso();
  const [erro, setErro] = useState(false);
  const revelado = estado.observou;

  return (
    <div className="space-y-2.5">
      <p className="text-base font-semibold">Observe as frases. Quem pratica a ação?</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Cartaz frase="I go to school." icone="🙋‍♀️" audioId="t3-a" />
        <Cartaz frase="She goes to school." icone="👧" audioId="t3-b" />
      </div>

      {!revelado ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Compare os dois exemplos. O que mudou no verbo?</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => despachar({ tipo: "observou" })}
              className="rounded-full bg-pista px-4 py-1.5 text-sm font-bold text-pista-foreground shadow-md"
            >
              go virou goes
            </button>
            <button
              type="button"
              onClick={() => setErro(true)}
              className="rounded-full border-2 border-investigacao/40 px-4 py-1.5 text-sm font-bold text-investigacao"
            >
              nada mudou
            </button>
          </div>
          {erro ? (
            <BalaoLex tom="reorienta">
              <p>Olhe o verbo das duas frases. Compare go e goes. Tente novamente.</p>
            </BalaoLex>
          ) : null}
        </div>
      ) : (
        <>
          <Grupos />
          <BalaoLex tom="pista">
            <p>
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
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-investigacao bg-card px-3 py-2 shadow-sm">
        <span aria-hidden="true" className="text-2xl">
          🐶
        </span>
        <p className="text-base font-bold text-investigacao">
          <Ingles>The dog plays in the garden.</Ingles>
        </p>
        <BotaoAudio texto="The dog plays in the garden." id="t6-dog" tamanho="sm" />
        <p className="text-base font-bold text-investigacao">
          <Ingles>It plays in the garden.</Ingles>
        </p>
        <BotaoAudio texto="It plays in the garden." id="t6-it-frase" tamanho="sm" />
        <p className="w-full text-xs font-semibold text-muted-foreground">
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
    <div className="space-y-3">
      <p className="text-base font-semibold">Responda as duas perguntas do quadro da Lex.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {PERGUNTAS_TELA8.map((q) => {
          const escolhida = estado.metacognicao[q.id];
          return (
            <div key={q.id} className="rounded-2xl border-2 border-investigacao bg-card p-3">
              <h2 className="text-base font-bold text-investigacao">{q.titulo}</h2>
              <p className="mt-0.5 text-sm">{q.pergunta}</p>
              <div className="mt-2 grid gap-2">
                {q.opcoes.map((op, i) => (
                  <button
                    key={op.texto}
                    type="button"
                    onClick={() => despachar({ tipo: "metacognicao", id: q.id, indice: i })}
                    className={cn(
                      "rounded-xl border-2 px-3 py-1.5 text-left text-sm font-semibold transition-colors",
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
              {escolhida !== undefined ? (
                <BalaoLex
                  tom={q.opcoes[escolhida].correta ? "acerto" : "reorienta"}
                  className="mt-2"
                >
                  <p>{q.opcoes[escolhida].feedback}</p>
                </BalaoLex>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tela9() {
  const { estado, despachar, fala } = useCaso();

  return (
    <div className="space-y-2">
      <img
        src={wordville}
        alt="Rua de Wordville com os cartazes corrigidos e a cidade em festa"
        width={1536}
        height={768}
        loading="lazy"
        className="h-14 w-full rounded-2xl border-2 border-acerto object-cover shadow-md sm:h-16"
      />
      <Grupos />
      <BalaoLex tom="acerto">
        <p>
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
            className="w-16 drop-shadow-xl"
          />
          <p className="text-base font-bold text-acerto">Assistente-Detetive de Wordville! 🎉</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            despachar({ tipo: "medalha" });
            fala.falar("He goes to school.", "final-1");
          }}
          className="rounded-full bg-acerto px-6 py-2 text-base font-bold text-acerto-foreground shadow-lg transition-transform hover:scale-105"
        >
          Receber medalha!
        </button>
      )}
    </div>
  );
}
