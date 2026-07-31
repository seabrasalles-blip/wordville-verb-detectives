import { useState } from "react";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ESTRELAS_MAXIMAS, estrelasTotais, relatorio, relatorioCsv } from "@/lib/relatorio";
import { useCaso } from "./CasoProvider";

const SENHA = "prof2026";

/** Painel do Modo Professor: relatório de aprendizagem e configurações. */
export function ModoProfessor({ aberto, aoFechar }: { aberto: boolean; aoFechar: () => void }) {
  const { estado, despachar } = useCaso();
  const [senha, setSenha] = useState("");
  const [liberado, setLiberado] = useState(false);
  const [erro, setErro] = useState(false);

  if (!aberto) return null;

  const fechar = () => {
    setSenha("");
    setErro(false);
    setLiberado(false);
    aoFechar();
  };

  const linhas = relatorio(estado);
  const config = estado.config;

  const baixar = (nome: string, conteudo: string, tipo: string) => {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Modo Professor"
      className="absolute inset-0 z-40 flex items-center justify-center bg-investigacao/50 p-4"
    >
      <div className="cartao-pista max-h-full w-full max-w-4xl overflow-auto border-investigacao p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[22px] font-extrabold text-investigacao">👩‍🏫 Modo Professor</h2>
          <button
            type="button"
            onClick={fechar}
            aria-label="Sair do Modo Professor"
            className="ml-auto rounded-full p-1.5 hover:bg-investigacao/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {!liberado ? (
          <form
            className="mt-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (senha === SENHA) {
                setLiberado(true);
                setErro(false);
              } else {
                setErro(true);
              }
            }}
          >
            <label htmlFor="senha-prof" className="block text-[17px] font-semibold">
              Digite a senha do professor para ver o relatório.
            </label>
            <input
              id="senha-prof"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full max-w-xs rounded-xl border-2 border-investigacao/40 bg-card px-3 py-2 text-[17px]"
            />
            {erro ? (
              <p className="text-[16px] font-semibold text-reorienta">Senha incorreta.</p>
            ) : null}
            <button
              type="submit"
              className="botao-fofo bg-investigacao px-5 py-1.5 text-[17px] text-investigacao-foreground"
            >
              Entrar
            </button>
          </form>
        ) : (
          <div className="mt-3 space-y-4">
            <section>
              <h3 className="text-[18px] font-extrabold text-investigacao">
                Relatório de aprendizagem
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-[16px] font-semibold">
                <Star className="size-4 fill-pista text-pista" aria-hidden="true" />
                {estrelasTotais(estado)}/{ESTRELAS_MAXIMAS} estrelas
              </p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-[15px]">
                  <thead>
                    <tr className="border-b-2 border-investigacao/30 font-bold">
                      <th className="py-1 pr-2">Tela</th>
                      <th className="py-1 pr-2">Acertos</th>
                      <th className="py-1 pr-2">Erros</th>
                      <th className="py-1 pr-2">Estrelas</th>
                      <th className="py-1 pr-2">Prática extra</th>
                      <th className="py-1">Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((l) => (
                      <tr key={l.tela} className="border-b border-investigacao/10">
                        <td className="py-1 pr-2 font-semibold">
                          {l.tela}. {l.titulo}
                        </td>
                        <td className="py-1 pr-2">
                          {l.acertos}/{l.total}
                        </td>
                        <td className="py-1 pr-2">{l.erros}</td>
                        <td className="py-1 pr-2">{l.estrelas}</td>
                        <td className="py-1 pr-2">{l.praticaExtra}</td>
                        <td className="py-1">{l.segundos}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    baixar(
                      "relatorio-wordville.csv",
                      relatorioCsv(estado),
                      "text/csv;charset=utf-8",
                    )
                  }
                  className="botao-fofo bg-pista px-4 py-1.5 text-[16px] text-pista-foreground"
                >
                  Baixar CSV
                </button>
                <button
                  type="button"
                  onClick={() =>
                    baixar(
                      "relatorio-wordville.json",
                      JSON.stringify({ estrelas: estrelasTotais(estado), telas: linhas }, null, 2),
                      "application/json",
                    )
                  }
                  className="botao-fofo bg-pista px-4 py-1.5 text-[16px] text-pista-foreground"
                >
                  Baixar JSON
                </button>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-[18px] font-extrabold text-investigacao">Configurações</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                <Alternador
                  rotulo="Narração das falas da Lex (português)"
                  ativo={config.audioLex}
                  aoMudar={(v) => despachar({ tipo: "config", mudanca: { audioLex: v } })}
                />
                <Alternador
                  rotulo="Áudio das palavras em inglês"
                  ativo={config.audioIngles}
                  aoMudar={(v) => despachar({ tipo: "config", mudanca: { audioIngles: v } })}
                />
                <Alternador
                  rotulo="Caso extra com novos verbos"
                  ativo={config.extensaoAtiva}
                  aoMudar={(v) => despachar({ tipo: "config", mudanca: { extensaoAtiva: v } })}
                />
                <Alternador
                  rotulo="Caça-palavras no modo Toque"
                  ativo={config.modoCaca === "toque"}
                  aoMudar={(v) =>
                    despachar({ tipo: "config", mudanca: { modoCaca: v ? "toque" : "arrasto" } })
                  }
                />
              </div>
              <fieldset>
                <legend className="text-[16px] font-bold">Nível de apoio</legend>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(
                    [
                      { v: "facilitada", t: "Facilitado (prática extra após 1 erro)" },
                      { v: "padrao", t: "Padrão (prática extra após 2 erros)" },
                      { v: "desafio", t: "Desafio (sem prática extra)" },
                    ] as const
                  ).map((op) => (
                    <button
                      key={op.v}
                      type="button"
                      onClick={() => despachar({ tipo: "config", mudanca: { dificuldade: op.v } })}
                      className={cn(
                        "rounded-full border-2 px-3 py-1 text-[15px] font-bold",
                        config.dificuldade === op.v
                          ? "border-investigacao bg-investigacao text-investigacao-foreground"
                          : "border-investigacao/40 bg-card text-investigacao hover:bg-investigacao/10",
                      )}
                    >
                      {op.t}
                    </button>
                  ))}
                </div>
              </fieldset>
            </section>

            <button
              type="button"
              onClick={fechar}
              className="botao-fofo bg-investigacao px-5 py-1.5 text-[17px] text-investigacao-foreground"
            >
              Sair do Modo Professor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Alternador({
  rotulo,
  ativo,
  aoMudar,
}: {
  rotulo: string;
  ativo: boolean;
  aoMudar: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border-2 border-investigacao/30 px-3 py-1.5 text-[16px] font-semibold">
      <input
        type="checkbox"
        checked={ativo}
        onChange={(e) => aoMudar(e.target.checked)}
        className="size-5 accent-[var(--investigacao)]"
      />
      {rotulo}
    </label>
  );
}
