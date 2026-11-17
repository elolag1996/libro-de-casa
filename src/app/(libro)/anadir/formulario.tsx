"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { anadirReceta, type Resultado } from "./acciones";
import { ORIGENES, NOMBRE_ORIGEN, type Origen } from "@/lib/recetas/origenes";

const INICIO: Resultado = { estado: "quieto" };

export default function Formulario() {
  const [origen, setOrigen] = useState<Origen>("mama");
  const [resultado, enviar, enviando] = useActionState(anadirReceta, INICIO);

  if (resultado.estado === "hecha") {
    return (
      <section className="paper p-4">
        <span className="label">Página {resultado.pagina} de tu libro</span>
        <h2 className="mt-2 font-display text-[26px] leading-[1.1] text-balance">
          {resultado.titulo}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {resultado.dudas === 0
            ? "Guardada. No quedó ninguna duda, que es raro: míralas por si acaso."
            : resultado.dudas === 1
              ? "Guardada, con 1 duda que preguntarle a quien te la mandó."
              : `Guardada, con ${resultado.dudas} dudas que preguntarle a quien te la mandó.`}
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          El texto original se ha guardado tal cual te llegó. No se toca nunca.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/" className="btn">
            Ver el libro
          </Link>
          <button type="button" className="btn btn-alt" onClick={() => location.reload()}>
            Añadir otra
          </button>
        </div>
      </section>
    );
  }

  return (
    <form action={enviar} className="paper flex flex-col gap-4 p-4">
      <fieldset className="border-0 p-0">
        <legend className="label">¿De quién es?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ORIGENES.map((o) => (
            <button
              key={o}
              type="button"
              className="chip"
              aria-pressed={origen === o}
              onClick={() => setOrigen(o)}
            >
              {NOMBRE_ORIGEN[o]}
            </button>
          ))}
        </div>
        <input type="hidden" name="origen" value={origen} />
      </fieldset>

      <div>
        <label className="label" htmlFor="texto">
          Pega aquí lo que te mandaron
        </label>
        <textarea
          id="texto"
          name="texto"
          required
          rows={10}
          placeholder="Compra judías blancas en la frutería del plaza…"
          className="mt-2 w-full resize-y rounded-sm border-[1.5px] border-ink bg-paper p-3 font-hand text-[19px] leading-[1.6] text-pen"
        />
        <p className="mt-2 text-[13px] text-ink-soft">
          Pégalo con sus faltas y sus rarezas. No lo corrijas: eso es lo que
          hace que la receta sea suya.
        </p>
      </div>

      {resultado.estado === "error" && (
        <p role="alert" className="text-sm text-tomato">
          {resultado.mensaje}
        </p>
      )}

      <button type="submit" className="btn self-start" disabled={enviando}>
        {enviando ? "Ordenándola…" : "Añadir al libro"}
      </button>

      {enviando && (
        <p role="status" className="text-[13px] text-ink-soft">
          Claude está leyéndola. Tarda unos segundos.
        </p>
      )}
    </form>
  );
}
