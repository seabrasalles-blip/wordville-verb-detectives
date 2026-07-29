import { useState } from "react";
import { Search } from "lucide-react";
import capa from "@/assets/capa-wordville.jpg";
import lex from "@/assets/lex.png";
import { ComoJogar } from "./ComoJogar";

type Props = { aoIniciar: () => void };

/** Capa do material: entrada oficial da aventura de Wordville. */
export function Capa({ aoIniciar }: Props) {
  const [ajuda, setAjuda] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={capa}
        alt="Rua ilustrada da cidade de Wordville, cheia de cartazes coloridos"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-investigacao/85 via-investigacao/45 to-pista/25"
      />

      <div className="relative grid h-full grid-cols-[1.15fr_0.85fr] items-center gap-4 px-10">
        <div className="space-y-4">
          <span className="etiqueta inline-flex items-center gap-2 border-pista bg-pista text-[16px] text-pista-foreground shadow-md">
            <span aria-hidden="true">🔎</span> Missão 1 · Wordville
          </span>

          <h1 className="text-[54px] leading-[1.05] font-extrabold text-investigacao-foreground drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]">
            O Caso dos Verbos
            <br />
            Desaparecidos
          </h1>

          <p className="max-w-xl rounded-3xl border-2 border-pista/70 bg-card/90 px-4 py-3 text-[20px] font-semibold text-foreground shadow-lg">
            Ajude a Inspetora Lex a descobrir qual verbo combina com cada frase!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={aoIniciar}
              className="botao-fofo inline-flex items-center gap-3 bg-pista px-9 py-4 text-[24px] text-pista-foreground"
            >
              <Search className="size-7" aria-hidden="true" />
              Iniciar investigação
            </button>
            <button
              type="button"
              onClick={() => setAjuda(true)}
              className="botao-fofo border-4 border-card bg-card/85 px-6 py-3 text-[18px] text-investigacao"
            >
              Como jogar
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {["go", "goes", "play", "plays"].map((p, i) => (
              <span
                key={p}
                className="rounded-xl border-2 border-investigacao bg-card px-3 py-1 text-[18px] font-bold text-investigacao shadow-md"
                style={{ transform: `rotate(${i % 2 === 0 ? -3 : 2.5}deg)` }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="relative flex h-full items-end justify-center">
          <div className="absolute top-8 right-0 max-w-[240px] rotate-2 rounded-3xl border-4 border-pista bg-card px-4 py-3 text-[17px] font-semibold shadow-xl">
            <span aria-hidden="true" className="mr-1">
              🕵️‍♀️
            </span>
            Preciso de um assistente-detetive. Vamos resolver este caso juntos?
          </div>
          <img
            src={lex}
            alt="Inspetora Lex, a detetive de Wordville"
            width={768}
            height={1024}
            className="flutua h-[78%] w-auto object-contain drop-shadow-2xl"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-0 grid size-16 -rotate-12 place-items-center rounded-full border-4 border-pista bg-card text-3xl shadow-lg"
          >
            🔍
          </span>
        </div>
      </div>

      <ComoJogar aberto={ajuda} aoFechar={() => setAjuda(false)} />
    </div>
  );
}
