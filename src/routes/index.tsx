import { createFileRoute } from "@tanstack/react-router";
import { CasoApp } from "@/components/caso/CasoApp";

const titulo = "O Caso dos Verbos Desaparecidos — inglês para crianças";
const descricao =
  "Jogo educativo em 10 telas com a Inspetora Lex: crianças de 8 a 10 anos aprendem go/goes e play/plays em inglês, com áudio, pistas e atividades.";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CasoApp />;
}
