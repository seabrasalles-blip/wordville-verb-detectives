import { createFileRoute } from "@tanstack/react-router";
import { CasoApp } from "@/components/caso/CasoApp";

const titulo = "O Caso dos Verbos Desaparecidos — inglês para crianças";
const descricao =
  "Jogo educativo em 9 telas com a Inspetora Lex: crianças de 8 a 10 anos descobrem a 3ª pessoa do singular em inglês (go → goes, play → plays) com áudio e pistas.";

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
