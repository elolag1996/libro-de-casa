"use client";

import { useActionState, useId } from "react";
import { responderDuda, type RespuestaGuardada } from "./acciones";

const INICIO: RespuestaGuardada = { estado: "quieto" };

type Duda = {
  id: string;
  numero: number;
  pregunta: string;
  respuesta: string | null;
};

function UnaDuda({ duda, quien }: { duda: Duda; quien: string | null }) {
  const [resultado, enviar, guardando] = useActionState(responderDuda, INICIO);
  const campo = useId();

  return (
    <li className="border-t border-[var(--line)] pt-3">
      <p className="text-[15px]">
        <span className="pg mr-1.5 text-tomato">{duda.numero}</span>
        {duda.pregunta}
      </p>

      {duda.respuesta && (
        <p className="mt-2 font-hand text-[19px] leading-[1.45] text-pen">
          {duda.respuesta}
        </p>
      )}

      <form action={enviar} className="mt-2 flex flex-wrap items-center gap-2">
        <input type="hidden" name="duda" value={duda.id} />
        <label className="sr-only" htmlFor={campo}>
          {duda.respuesta
            ? `Cambiar la respuesta a la duda ${duda.numero}`
            : quien
              ? `Respuesta de ${quien} a la duda ${duda.numero}`
              : `Aclaración para la duda ${duda.numero}`}
        </label>
        <input
          id={campo}
          name="respuesta"
          type="text"
          defaultValue={duda.respuesta ?? ""}
          placeholder={quien ? `Lo que contestó ${quien}` : "Lo que faltaba por aclarar"}
          className="min-w-0 flex-1 rounded-sm border-[1.5px] border-ink bg-paper px-2.5 py-2 text-[15px]"
        />
        <button type="submit" className="btn btn-alt" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </form>

      {resultado.estado === "error" && (
        <p role="alert" className="mt-1.5 text-sm text-tomato">
          {resultado.mensaje}
        </p>
      )}
    </li>
  );
}

export default function Dudas({ dudas, quien }: { dudas: Duda[]; quien: string | null }) {
  const abiertas = dudas.filter((d) => !d.respuesta).length;

  return (
    <section className="paper p-4" aria-labelledby="dudas">
      <h2 id="dudas" className="font-display text-xl leading-tight">
        {abiertas === 0
          ? "Todas las dudas resueltas"
          : abiertas === 1
            ? "Queda una duda"
            : `Quedan ${abiertas} dudas`}
      </h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        {abiertas === 0
          ? "Lo que te contestaron queda escrito aquí, en la página."
          : quien
            ? `Pregúntaselo a ${quien} y apunta aquí lo que te diga.`
            : "Apunta aquí lo que falte, para que no se pierda."}
      </p>

      <ol className="mt-3 grid gap-3">
        {dudas.map((d) => (
          <UnaDuda key={d.id} duda={d} quien={quien} />
        ))}
      </ol>
    </section>
  );
}
