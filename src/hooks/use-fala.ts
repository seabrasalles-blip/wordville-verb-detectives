import { useCallback, useEffect, useState } from "react";

let vozEn: SpeechSynthesisVoice | null = null;

function escolherVoz() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const vozes = window.speechSynthesis.getVoices();
  vozEn =
    vozes.find((v) => v.lang === "en-US") ??
    vozes.find((v) => v.lang === "en-GB") ??
    vozes.find((v) => v.lang.startsWith("en")) ??
    null;
}

/**
 * Web Speech API (speechSynthesis) em inglês.
 * `suportado` fica false quando o navegador não tem TTS — os botões somem.
 */
export function useFala() {
  const [suportado, setSuportado] = useState(false);
  const [falandoId, setFalandoId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSuportado(true);
    escolherVoz();
    window.speechSynthesis.addEventListener("voiceschanged", escolherVoz);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", escolherVoz);
      window.speechSynthesis.cancel();
    };
  }, []);

  const falar = useCallback(
    (texto: string, id?: string) => {
      if (!suportado) return;
      const sintese = window.speechSynthesis;
      sintese.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = vozEn?.lang ?? "en-US";
      if (vozEn) fala.voice = vozEn;
      fala.rate = 0.85;
      fala.pitch = 1.05;
      const marca = id ?? texto;
      fala.onstart = () => setFalandoId(marca);
      fala.onend = () => setFalandoId((atual) => (atual === marca ? null : atual));
      fala.onerror = () => setFalandoId((atual) => (atual === marca ? null : atual));
      setFalandoId(marca);
      sintese.speak(fala);
    },
    [suportado],
  );

  const parar = useCallback(() => {
    if (!suportado) return;
    window.speechSynthesis.cancel();
    setFalandoId(null);
  }, [suportado]);

  return { suportado, falar, parar, falandoId };
}
