import { useCallback, useEffect, useState } from "react";

let vozEn: SpeechSynthesisVoice | null = null;
let vozPt: SpeechSynthesisVoice | null = null;

function escolherVoz() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const vozes = window.speechSynthesis.getVoices();
  vozEn =
    vozes.find((v) => v.lang === "en-US") ??
    vozes.find((v) => v.lang === "en-GB") ??
    vozes.find((v) => v.lang.startsWith("en")) ??
    null;
  vozPt =
    vozes.find((v) => v.lang === "pt-BR" || v.lang === "pt_BR") ??
    vozes.find((v) => v.lang.startsWith("pt")) ??
    null;
}

/**
 * Web Speech API (speechSynthesis) em inglês (frases do caso) e em português
 * (falas da Inspetora Lex). `suportado` fica false quando o navegador não tem
 * TTS — nesse caso os botões de áudio somem.
 */
export function useFala() {
  const [suportado, setSuportado] = useState(false);
  const [falandoId, setFalandoId] = useState<string | null>(null);
  const [temVozPt, setTemVozPt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSuportado(true);
    const sincronizar = () => {
      escolherVoz();
      setTemVozPt(vozPt !== null);
    };
    sincronizar();
    window.speechSynthesis.addEventListener("voiceschanged", sincronizar);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", sincronizar);
      window.speechSynthesis.cancel();
    };
  }, []);

  const dizer = useCallback(
    (texto: string, id: string | undefined, idioma: "en" | "pt") => {
      if (!suportado) return;
      const sintese = window.speechSynthesis;
      sintese.cancel();
      const voz = idioma === "pt" ? vozPt : vozEn;
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = voz?.lang ?? (idioma === "pt" ? "pt-BR" : "en-US");
      if (voz) fala.voice = voz;
      // um pouco mais devagar que o normal: é leitura para crianças
      fala.rate = idioma === "pt" ? 0.95 : 0.85;
      fala.pitch = idioma === "pt" ? 1.1 : 1.05;
      const marca = id ?? texto;
      fala.onstart = () => setFalandoId(marca);
      fala.onend = () => setFalandoId((atual) => (atual === marca ? null : atual));
      fala.onerror = () => setFalandoId((atual) => (atual === marca ? null : atual));
      setFalandoId(marca);
      sintese.speak(fala);
    },
    [suportado],
  );

  /** Frases do caso, em inglês. */
  const falar = useCallback(
    (texto: string, id?: string) => dizer(texto, id, "en"),
    [dizer],
  );

  /** Falas da Inspetora Lex, em português. */
  const falarPt = useCallback(
    (texto: string, id?: string) => dizer(texto, id, "pt"),
    [dizer],
  );

  const parar = useCallback(() => {
    if (!suportado) return;
    window.speechSynthesis.cancel();
    setFalandoId(null);
  }, [suportado]);

  return { suportado, temVozPt, falar, falarPt, parar, falandoId };
}
