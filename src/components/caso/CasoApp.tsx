import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, HelpCircle, Map, RotateCcw, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import wordville from "@/assets/wordville.jpg";
import medalha from "@/assets/medalha.png";
import {
  BANCO_EXTRA,
  CARTOES_TELA5,
  FALAS,
  FALA_FINAL_EXTRA,
  FEEDBACK_T3,

  GRUPOS,
  LACUNAS_EXTRA,
  LACUNAS_TELA4,
  LACUNAS_TELA6,
  LACUNAS_TELA7,
  MONTAGENS,
  PALAVRAS_CACA,
  PARES_TELA5,
  PERGUNTAS_TELA8,
  TELAS,
  TELAS_COM_RAMO,
  TELA_EXTRA,
  TOTAL_TELAS,
  fraseDaMontagem,
} from "@/lib/caso-conteudo";
import { errosDaTela } from "@/lib/relatorio";
import { CasoProvider, useCaso } from "./CasoProvider";
import { BalaoLex, Ingles } from "./BalaoLex";
import { BarraProgresso } from "./BarraProgresso";
import { BotaoAudio } from "./BotaoAudio";
import { CartazGuiado } from "./PalavraMarcada";

import { Capa } from "./Capa";
import { ComoJogar } from "./ComoJogar";
import { CacaPalavras } from "./CacaPalavras";
import { DialogoLex } from "./DialogoLex";
import { DialogoReiniciar } from "./DialogoReiniciar";
import { AreaFeedback, Feedback } from "./Feedback";
import { LigarColunas } from "./LigarColunas";
import { MapaCaso } from "./MapaCaso";
import { ModoProfessor } from "./ModoProfessor";
import { MontarFrase } from "./MontarFrase";
import { PraticaExtra } from "./PraticaExtra";
import { TelaLacunas } from "./TelaLacunas";

const TITULOS = TELAS.map((t) => t.titulo);

export function CasoApp() {
  return (
    <CasoProvider>
      <Casca />
    </CasoProvider>
  );
}

/** Critério pedagógico de conclusão de cada tela. */
function telaConcluida(tela: number, estado: ReturnType<typeof useCaso>["estado"]) {
  // enquanto a prática extra está aberta, a tela não avança
  if (estado.ramos[tela] === "aberto") return false;
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
    case TELA_EXTRA:
      if (!estado.config.extensaoAtiva) return true;
      if (estado.extensao === "pulada") return true;
      return LACUNAS_EXTRA.every((l) => estado.respostas[l.id] === l.resposta);
    case 11:
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
  const [mapa, setMapa] = useState(false);
  const [professor, setProfessor] = useState(false);
  const [processando, setProcessando] = useState(false);
  const travaRef = useRef(false);

  const liberado = telaConcluida(tela, estado);
  const ramoAberto = estado.ramos[tela] === "aberto";

  // libera a trava assim que a tela muda
  useEffect(() => {
    travaRef.current = false;
    setProcessando(false);
  }, [tela]);

  // tempo em cada tela, para o relatório do professor
  useEffect(() => {
    const inicio = Date.now();
    return () => despachar({ tipo: "tempo", tela, ms: Date.now() - inicio });
  }, [tela, despachar]);

  // prática adicional depois de erros repetidos na mesma tela
  const dificuldade = estado.config.dificuldade;
  useEffect(() => {
    if (dificuldade === "desafio") return;
    if (!TELAS_COM_RAMO.includes(tela)) return;
    if (estado.ramos[tela]) return;
    const limiar = dificuldade === "facilitada" ? 1 : 2;
    if (errosDaTela(estado, tela) >= limiar) despachar({ tipo: "abrirRamo", tela });
  }, [dificuldade, estado, tela, despachar]);

  const navegar = (acao: () => void) => {
    if (travaRef.current) return;
    travaRef.current = true;
    setProcessando(true);
    acao();
  };

  const concluidas = Array.from({ length: TOTAL_TELAS }, (_, i) => telaConcluida(i + 1, estado));

  return (
    <div className="ceu-wordville flex min-h-screen items-center justify-center p-0 [@media(min-height:707px)]:p-2 [@media(min-height:743px)]:p-4">
      <div className="relative flex h-[675px] w-full max-w-[1200px] flex-col overflow-hidden rounded-[2rem] border-4 border-investigacao/25 bg-background shadow-2xl">
        {!estado.iniciou ? (
          <Capa aoIniciar={() => despachar({ tipo: "iniciar" })} />
        ) : (
          <>
            <header className="shrink-0 border-b-4 border-investigacao/20 bg-card">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-1.5">
                <h1 className="flex items-center gap-2 text-lg font-extrabold text-investigacao">
                  <span aria-hidden="true">🕵️‍♀️</span> O Caso dos Verbos Desaparecidos
                </h1>
                <span className="etiqueta hidden border-pista bg-pista text-[14px] text-pista-foreground sm:inline-block">
                  Wordville
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMapa(true)}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[15px] font-bold text-investigacao hover:bg-investigacao/10"
                  >
                    <Map className="size-4" aria-hidden="true" /> Mapa do Caso
                  </button>
                  <button
                    type="button"
                    onClick={() => setAjuda(true)}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[15px] font-bold text-investigacao hover:bg-investigacao/10"
                  >
                    <HelpCircle className="size-4" aria-hidden="true" /> Como jogar
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfessor(true)}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[15px] font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    <GraduationCap className="size-4" aria-hidden="true" /> Professor
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
              <BarraProgresso concluidas={concluidas} />
            </header>

            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-4 py-1.5">
              <p className="mb-1 flex items-center gap-2 text-[13px] font-extrabold tracking-wide text-investigacao uppercase">
                <span aria-hidden="true">🔎</span> Tela {tela} — {TITULOS[tela - 1]}
                {ramoAberto ? " · prática extra" : ""}
              </p>
              {ramoAberto ? (
                <PraticaExtra tela={tela} />
              ) : (
                <>
                  {tela === 1 ? <Tela1 /> : null}
                  {tela === 2 ? (
                    <>
                      <DialogoLex segmentos={FALAS.t2} id="t2" className="mb-2" />
                      <CacaPalavras />
                    </>
                  ) : null}
                  {tela === 3 ? <Tela3 /> : null}
                  {tela === 4 ? (
                    <>
                      <DialogoLex segmentos={FALAS.t4} id="t4" className="mb-2" />
                      <TelaLacunas
                        lacunas={LACUNAS_TELA4}
                        banco={["go", "goes"]}
                        comando="Observe quem pratica a ação e escolha a forma correta do verbo."
                      />
                    </>
                  ) : null}
                  {tela === 5 ? (
                    <>
                      <DialogoLex segmentos={FALAS.t5} id="t5" className="mb-2" />
                      <LigarColunas />
                    </>
                  ) : null}
                  {tela === 6 ? <Tela6 /> : null}
                  {tela === 7 ? (
                    <>
                      <DialogoLex segmentos={FALAS.t7} id="t7" className="mb-2" />
                      <TelaLacunas
                        lacunas={LACUNAS_TELA7}
                        banco={["go", "goes", "play", "plays"]}
                        comando="Observe quem pratica a ação e escolha a forma correta do verbo."
                        aoConcluir="Todos os cartazes estão consertados! Vamos ao escritório."
                      />
                    </>
                  ) : null}
                  {tela === 8 ? <Tela8 /> : null}
                  {tela === 9 ? (
                    <>
                      <DialogoLex segmentos={FALAS.t9} id="t9" className="mb-2" />
                      <MontarFrase />
                    </>
                  ) : null}
                  {tela === TELA_EXTRA ? <TelaExtra /> : null}
                  {tela === 11 ? <TelaFinal /> : null}
                </>
              )}
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
                        {ramoAberto
                          ? "Termine a prática extra para continuar"
                          : "Termine a investigação desta tela para continuar"}
                      </span>
                    ) : null}
                    {tela === TELA_EXTRA &&
                    estado.config.extensaoAtiva &&
                    estado.extensao !== "feita" ? (
                      <button
                        type="button"
                        onClick={() => {
                          despachar({ tipo: "extensao", valor: "pulada" });
                          navegar(avancar);
                        }}
                        className="botao-fofo border-2 border-investigacao/40 bg-card px-4 py-1.5 text-[16px] text-investigacao"
                      >
                        Pular caso extra
                      </button>
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
            <MapaCaso aberto={mapa} aoFechar={() => setMapa(false)} concluidas={concluidas} />
            <ModoProfessor aberto={professor} aoFechar={() => setProfessor(false)} />
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
  const [ouviuTudo, setOuviuTudo] = useState(false);
  const terminar = useCallback(() => setOuviuTudo(true), []);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <img
        src={wordville}
        alt="Rua principal da cidade de Wordville, cheia de cartazes"
        width={1536}
        height={768}
        className="h-[74px] w-full shrink-0 rounded-3xl border-4 border-pista object-cover shadow-md"
      />
      <div className="grid min-h-0 flex-1 grid-cols-[38%_1fr] gap-4">
        <DialogoLex segmentos={FALAS.t1} id="t1" variante="apresentacao" aoTerminar={terminar} />

        <div className="flex min-h-0 items-center">
          <section className="cartao-pista w-full rotate-[-0.6deg] border-investigacao bg-card p-4">
            <p className="etiqueta inline-block border-pista bg-pista text-[16px] text-pista-foreground">
              <span aria-hidden="true">🔎</span> Evidência encontrada
            </p>
            <div className="mt-3 rounded-3xl border-[3px] border-dashed border-reorienta/70 bg-reorienta/10 px-4 py-3 text-center">
              <span aria-hidden="true" className="text-2xl">
                🏫
              </span>
              <p className="tremula mt-1 text-[26px] leading-tight font-extrabold text-investigacao">
                <Ingles>He go to school.</Ingles>
              </p>
            </div>
            <p className="mt-3 text-center text-[18px] font-semibold text-reorienta">
              Algo está errado nesta frase. Você consegue descobrir o quê?
            </p>
            <div className="mt-3 flex min-h-[74px] items-center justify-center">
              {!visto ? (
                <button
                  type="button"
                  disabled={!ouviuTudo}
                  onClick={() => despachar({ tipo: "responder", id: "t1-visto", valor: "sim" })}
                  className="botao-fofo bg-pista px-6 py-2.5 text-[18px] text-pista-foreground disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {ouviuTudo ? "Ver a frase correta" : "Ouça a Inspetora Lex primeiro"}
                </button>
              ) : (
                <div className="surge flex w-full items-center justify-center gap-3 rounded-3xl border-[3px] border-acerto bg-acerto/10 px-4 py-2">
                  <span aria-hidden="true" className="text-2xl">
                    ✅
                  </span>
                  <p className="text-[24px] font-extrabold text-investigacao">
                    <Ingles>He goes to school.</Ingles>
                  </p>
                  <BotaoAudio texto="He goes to school." id="cartaz-correto" tamanho="sm" />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Tela3() {
  const { estado, despachar } = useCaso();
  const [erro, setErro] = useState(false);
  const [escolha, setEscolha] = useState<"certa" | "errada" | null>(null);
  const [etapa, setEtapa] = useState(0);
  const revelado = estado.observou;
  const neutro =
    "rounded-full border-2 border-investigacao/40 bg-card px-4 py-1.5 text-[18px] font-bold text-investigacao transition-colors hover:bg-investigacao/10";

  const explicou = revelado || etapa >= 2;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row">
      {/* Zona A — Inspetora Lex */}
      <aside className="flex w-full shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-secondary/40 p-2 md:w-[300px] md:border-r-2 md:border-investigacao/15">
        <img
          src={lex}
          alt="Inspetora Lex, a detetive de Wordville"
          width={768}
          height={1024}
          className="hidden h-[150px] w-auto object-contain drop-shadow-xl md:block"
        />
        <DialogoLex
          segmentos={revelado ? FALAS.t3fim : FALAS.t3}
          id={revelado ? "t3fim" : "t3"}
          tom={revelado ? "pista" : "investigacao"}
          aoMudar={revelado ? undefined : setEtapa}
          className="w-full"
        />
      </aside>

      {/* Zona B — cartazes, pergunta e respostas */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
        {!revelado ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <CartazGuiado
                icone="🙋‍♀️"
                frase="I go to school."
                audioId="t3-a"
                marcado
                destacarIcone={etapa === 0}
                marcacao={{ sujeito: "I", verbo: "go", depois: "to school.", traducaoVerbo: "ir" }}
              />
              <CartazGuiado
                icone="👧"
                frase="She goes to school."
                audioId="t3-b"
                marcado={etapa >= 1}
                destacarIcone={etapa === 1}
                marcacao={{
                  sujeito: "She",
                  verbo: "goes",
                  depois: "to school.",
                  traducaoVerbo: "ir",
                }}
              />
            </div>

            {explicou ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  aria-pressed={escolha === "certa"}
                  onClick={() => {
                    setEscolha("certa");
                    setErro(false);
                    despachar({ tipo: "observou" });
                  }}
                  className={cn(
                    neutro,
                    escolha === "certa" && "border-pista bg-pista text-pista-foreground",
                  )}
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
                {escolha === "errada" ? (
                  <span aria-hidden="true" className="text-2xl">
                    🔍
                  </span>
                ) : null}
              </div>
            ) : null}

            <AreaFeedback>
              {erro ? (
                <Feedback
                  type="error"
                  message={FEEDBACK_T3.errado}
                  onClose={() => setErro(false)}
                />
              ) : null}
            </AreaFeedback>
          </>
        ) : (
          <>
            <AreaFeedback>
              <Feedback type="success" message={FEEDBACK_T3.certo} />
            </AreaFeedback>
            <Grupos />
          </>
        )}
      </div>
    </div>
  );
}



function Tela6() {
  return (
    <div className="space-y-2">
      <DialogoLex segmentos={FALAS.t6} id="t6" />
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
      </div>

      <TelaLacunas
        lacunas={LACUNAS_TELA6}
        banco={["play", "plays"]}
        comando="Observe quem pratica a ação e escolha o verbo correto: play → plays, go → goes."
      />
    </div>
  );
}

function Tela8() {
  const { estado, despachar } = useCaso();
  return (
    <div className="space-y-2">
      <DialogoLex segmentos={FALAS.t8} id="t8" />

      <div className="grid gap-3 sm:grid-cols-2">
        {PERGUNTAS_TELA8.map((q) => {
          const escolhida = estado.metacognicao[q.id];
          const opcao = escolhida !== undefined ? q.opcoes[escolhida] : undefined;
          const certa = opcao?.correta === true;
          return (
            <div key={q.id} className="cartao-pista border-investigacao/70 p-2.5">
              <h2 className="etiqueta inline-block border-pista bg-pista text-[16px] text-pista-foreground">
                {q.titulo}
              </h2>
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
                    message={certa ? opcao.feedback : `${opcao.feedback} Escolha novamente.`}
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

/** Tela opcional: a mesma regra com like, watch e read. */
function TelaExtra() {
  const { estado, despachar } = useCaso();
  const feita = LACUNAS_EXTRA.every((l) => estado.respostas[l.id] === l.resposta);
  const watchOk = estado.respostas["tx-watches"] === "watches";

  useEffect(() => {
    if (feita && estado.extensao !== "feita") despachar({ tipo: "extensao", valor: "feita" });
  }, [feita, estado.extensao, despachar]);

  if (!estado.config.extensaoAtiva) {
    return (
      <div className="space-y-2">
        <DialogoLex segmentos={FALAS.t10} id="t10-off" tom="pista" />
        <p className="text-[18px] font-semibold">
          O caso extra está desligado nas configurações do professor. Você pode continuar para o
          fechamento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DialogoLex
        segmentos={watchOk ? FALAS.t10watch : FALAS.t10}
        id={watchOk ? "t10w" : "t10"}
        tom="pista"
      />
      <TelaLacunas
        lacunas={LACUNAS_EXTRA}
        banco={BANCO_EXTRA}
        colunas={3}
        comando="Novos verbos, mesma regra: observe quem pratica a ação."
        aoConcluir="Você provou que a regra vale para outros verbos também!"
      />
    </div>
  );
}

function TelaFinal() {
  const { estado, despachar, fala } = useCaso();
  const comExtra = estado.extensao === "feita";

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
      <DialogoLex
        segmentos={comExtra ? FALA_FINAL_EXTRA : FALAS.t11}
        id={comExtra ? "t11x" : "t11"}
        tom="acerto"
      />

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
          <p className="text-[18px] font-bold text-acerto">Assistente-Detetive de Wordville! 🎉</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            despachar({ tipo: "medalha" });
            if (estado.config.audioIngles) fala.falar("He goes to school.", "final-1");
          }}
          className="botao-fofo mx-auto block bg-acerto px-7 py-2 text-[17px] text-acerto-foreground"
        >
          Receber medalha!
        </button>
      )}
    </div>
  );
}
