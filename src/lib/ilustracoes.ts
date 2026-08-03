import basketball from "@/assets/cenarios/basketball.png";
import beach from "@/assets/cenarios/beach.png";
import garden from "@/assets/cenarios/garden.png";
import guitar from "@/assets/cenarios/guitar.png";
import hide from "@/assets/cenarios/hide.png";
import park from "@/assets/cenarios/park.png";
import piano from "@/assets/cenarios/piano.png";
import school from "@/assets/cenarios/school.png";
import soccer from "@/assets/cenarios/soccer.png";
import swimming from "@/assets/cenarios/swimming.png";
import tennis from "@/assets/cenarios/tennis.png";
import violin from "@/assets/cenarios/violin.png";
import zoo from "@/assets/cenarios/zoo.png";

/** Cenários ilustrados dos cartazes de Wordville. */
export const ILUSTRACOES = {
  basketball,
  beach,
  garden,
  guitar,
  hide,
  park,
  piano,
  school,
  soccer,
  swimming,
  tennis,
  violin,
  zoo,
} as const;

export type CenarioId = keyof typeof ILUSTRACOES;

/** Texto alternativo em português de cada cenário. */
export const ALT_CENARIO: Record<CenarioId, string> = {
  basketball: "bola e cesta de basquete",
  beach: "praia com palmeira e castelo de areia",
  garden: "jardim com flores e regador",
  guitar: "violão",
  hide: "criança brincando de esconde-esconde atrás de uma árvore",
  park: "parque com árvore, banco e balanço",
  piano: "piano com uma nota musical",
  school: "prédio da escola",
  soccer: "bola de futebol e trave",
  swimming: "criança nadando",
  tennis: "raquete e bolinha de tênis",
  violin: "violino com arco",
  zoo: "zoológico com girafa e leão",
};
