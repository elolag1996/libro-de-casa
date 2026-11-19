"use client";

import { useId, useRef, useState, type ReactNode } from "react";

/**
 * Las dos pestañas de papel. Se manejan con teclado como manda el patrón de
 * pestañas: flechas para moverse, Inicio y Fin para ir a los extremos.
 */
export default function Capas({
  original,
  ordenada,
}: {
  original: ReactNode;
  ordenada: ReactNode;
}) {
  const [abierta, setAbierta] = useState<0 | 1>(0);
  const base = useId();
  const botones = useRef<(HTMLButtonElement | null)[]>([]);

  const titulos = ["Como me la mandó", "Paso a paso"] as const;

  function alPulsarTecla(e: React.KeyboardEvent) {
    const siguiente =
      e.key === "ArrowRight" ? (abierta + 1) % 2
      : e.key === "ArrowLeft" ? (abierta + 1) % 2
      : e.key === "Home" ? 0
      : e.key === "End" ? 1
      : null;

    if (siguiente === null) return;
    e.preventDefault();
    setAbierta(siguiente as 0 | 1);
    botones.current[siguiente]?.focus();
  }

  return (
    <>
      <div className="layers" role="tablist" aria-label="Capas de la receta" onKeyDown={alPulsarTecla}>
        {titulos.map((titulo, i) => (
          <button
            key={titulo}
            ref={(el) => {
              botones.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-pestana-${i}`}
            aria-selected={abierta === i}
            aria-controls={`${base}-capa-${i}`}
            tabIndex={abierta === i ? 0 : -1}
            data-activa={abierta === i}
            className="layer-tab"
            onClick={() => setAbierta(i as 0 | 1)}
          >
            {titulo}
          </button>
        ))}
      </div>

      {titulos.map((titulo, i) => (
        <div
          key={titulo}
          role="tabpanel"
          id={`${base}-capa-${i}`}
          aria-labelledby={`${base}-pestana-${i}`}
          hidden={abierta !== i}
          tabIndex={0}
        >
          {i === 0 ? original : ordenada}
        </div>
      ))}
    </>
  );
}
