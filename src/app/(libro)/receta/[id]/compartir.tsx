"use client";

import { useState } from "react";
import { enlaceWhatsApp } from "@/lib/recetas/mensajes";

/**
 * Abre WhatsApp con el mensaje ya escrito. El enviar lo pulsa la persona:
 * desde aquí no sale ningún mensaje solo.
 */
export default function Compartir({
  dudas,
  pasos,
  aQuien,
}: {
  dudas: string | null;
  pasos: string;
  aQuien: string | null;
}) {
  const [copiado, setCopiado] = useState<"dudas" | "pasos" | null>(null);

  async function copiar(texto: string, cual: "dudas" | "pasos") {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(cual);
      setTimeout(() => setCopiado(null), 2500);
    } catch {
      // Sin permiso de portapapeles no pasa nada: queda el enlace de WhatsApp.
    }
  }

  return (
    <section className="paper p-4" aria-labelledby="compartir">
      <h2 id="compartir" className="font-display text-xl leading-tight">
        Mandarlo por WhatsApp
      </h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Se abre WhatsApp con el mensaje escrito y tú eliges a quién. Enviar lo pulsas tú.
      </p>

      <div className="mt-4 grid gap-4">
        {dudas && (
          <div>
            <div className="flex flex-wrap gap-2">
              <a href={enlaceWhatsApp(dudas)} target="_blank" rel="noopener noreferrer" className="btn btn-hot">
                {aQuien ? `Preguntar a ${aQuien}` : "Preguntar las dudas"}
              </a>
              <button type="button" className="btn btn-alt" onClick={() => copiar(dudas, "dudas")}>
                {copiado === "dudas" ? "Copiado" : "Copiar"}
              </button>
            </div>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap border-l-2 border-[var(--line)] pl-3 font-body text-[13px] text-ink-soft">
              {dudas}
            </pre>
          </div>
        )}

        <div>
          <div className="flex flex-wrap gap-2">
            <a href={enlaceWhatsApp(pasos)} target="_blank" rel="noopener noreferrer" className="btn">
              Mandar los pasos
            </a>
            <button type="button" className="btn btn-alt" onClick={() => copiar(pasos, "pasos")}>
              {copiado === "pasos" ? "Copiado" : "Copiar"}
            </button>
          </div>
          <p className="mt-2 text-[13px] text-ink-soft">
            Va la versión ordenada, para quien la vaya a cocinar. El original se queda en tu libro.
          </p>
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {copiado ? "Mensaje copiado al portapapeles" : ""}
      </p>
    </section>
  );
}
