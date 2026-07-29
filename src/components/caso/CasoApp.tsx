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
            comando="Arraste 'go' ou 'goes' para completar cada frase. Você pode ouvir as opções antes de decidir."
          />
        ) : null}
        {tela === 5 ? <LigarColunas /> : null}
        {tela === 6 ? <Tela6 /> : null}
        {tela === 7 ? (
          <TelaLacunas
            lacunas={LACUNAS_TELA7}
            banco={["go", "goes", "play", "plays"]}
            comando="Últimos cartazes da cidade! Use tudo o que você descobriu. Cada cartaz precisa da palavra certa."
            aoConcluir="Todos os cartazes estão consertados! Vamos até o meu escritório conversar sobre o caso."
          />
        ) : null}
        {tela === 8 ? <Tela8 /> : null}
        {tela === 9 ? <Tela9 /> : null}
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
}: {
  frase: string;
  legenda?: string;
  icone: string;
  tremulando?: boolean;
  audioId?: string;
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
      <div className="mt-2 flex justify-center">
        <BotaoAudio texto={frase} id={audioId} tamanho="sm" />
      </div>
    </div>
  );
}

function Tela1() {
  return (
    <div className="space-y-3">
      <img
        src={wordville}
        alt="Rua principal da cidade de Wordville, cheia de cartazes"
        width={1536}
        height={768}
        className="h-24 w-full rounded-2xl border-2 border-investigacao object-cover shadow-md sm:h-28"
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <Cartaz frase="He go to school" icone="🏫" tremulando audioId="cartaz-1" />
        <span aria-hidden="true" className="mx-auto text-4xl">
          🔍
        </span>
      </div>
      <BalaoLex>
        <p>
          Olá! Eu sou a Inspetora Lex, detetive de Wordville. Algo estranho está acontecendo: as
          palavras nos cartazes estão mudando de forma! Olha só esse cartaz:{" "}
          <Ingles>He go to school</Ingles>. Tem algo esquisito, não tem?
        </p>
        <p>Preciso de um assistente-detetive esperto para me ajudar. Você topa?</p>
      </BalaoLex>
    </div>
  );
}

function Tela3() {
  const [revelado, setRevelado] = useState(false);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Cartaz
          frase="I go to school every day."
          legenda="Uma menina apontando para si mesma"
          icone="🙋‍♀️"
          audioId="t3-a"
        />
        <Cartaz
          frase="She goes to school every day."
          legenda="Outra menina, vista de longe"
          icone="👧"
          audioId="t3-b"
        />
      </div>
      <BalaoLex>
        <p>
          Olhe estas duas pistas com atenção. Ouça as duas frases. Nas duas, alguém vai para a
          escola. Mas repare no verbo: em uma está <Ingles>go</Ingles> e na outra está{" "}
          <Ingles>goes</Ingles>. O que mudou entre as duas frases? Quem faz a ação é a mesma
          pessoa?
        </p>
      </BalaoLex>
      {!revelado ? (
        <button
          type="button"
          onClick={() => setRevelado(true)}
          className="rounded-full bg-pista px-5 py-2 text-sm font-bold text-pista-foreground shadow-md"
        >
          Entendi, continuar.
        </button>
      ) : (
        <BalaoLex tom="pista">
          <p>
            Reparou? Quando falamos de nós mesmos (<Ingles>I</Ingles>), usamos <Ingles>go</Ingles>.
            Quando falamos de outra pessoa (<Ingles>She</Ingles>), a palavra ganhou algo no final e
            virou <Ingles>goes</Ingles>. Primeira pista do caso!
          </p>
        </BalaoLex>
      )}
    </div>
  );
}

function Tela6() {
  return (
    <div className="space-y-3">
      <BalaoLex>
        <p>
          Lembra do som da Tela 2? <Ingles>Goes</Ingles> e <Ingles>plays</Ingles> têm um final
          parecido. Será que a mesma regra vale aqui? Ouça as opções antes de arrastar.
        </p>
      </BalaoLex>
      <TelaLacunas
        lacunas={LACUNAS_TELA6}
        banco={["play", "plays"]}
        comando="Complete os cartazes com 'play' ou 'plays'."
      />
    </div>
  );
}

function Tela8() {
  const { estado, despachar } = useCaso();
  return (
    <div className="space-y-3">
      <p className="text-base font-semibold">
        No escritório da Inspetora Lex tem um quadro branco com duas perguntas.
      </p>
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
  const texto =
    "Caso resolvido! Todos os cartazes de Wordville estão corretos graças a você! Você descobriu que o verbo muda de som e de letra com he, she ou it — e vale para vários verbos, como go e play! Aqui está sua medalha de Assistente-Detetive. Até o próximo caso!";

  return (
    <div className="space-y-2">
      <img
        src={wordville}
        alt="Rua de Wordville com os cartazes corrigidos e a cidade em festa"
        width={1536}
        height={768}
        loading="lazy"
        className="h-16 w-full rounded-2xl border-2 border-acerto object-cover shadow-md sm:h-20"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Cartaz frase="He goes to school." icone="🏫" audioId="final-1" />
        <Cartaz frase="She plays soccer." icone="⚽️" audioId="final-2" />
      </div>
      <BalaoLex tom="acerto">
        <p>{texto}</p>
        <BotaoAudio texto={texto} id="final-fala" rotulo="Ouvir a Inspetora" tamanho="sm" />
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
