import Link from "next/link";
import { Suspense } from "react";
import { listarRecetas } from "@/lib/recetas/leer";
import { PROCEDENCIA } from "@/lib/recetas/origenes";
import Hueco from "./hueco";

/** Leer de la base de datos exige esperar a la petición: va dentro de Suspense. */
async function Indice() {
  const recetas = await listarRecetas();

  if (recetas.length === 0) {
    return (
      <section className="paper p-4">
        <h2 className="font-display text-xl leading-tight">Tu libro está en blanco</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          Empieza por una que te sepas de memoria, o busca en WhatsApp la última que te
          mandaron. Pégala tal cual, con sus faltas.
        </p>
        <Link href="/anadir" className="btn mt-4 inline-block">
          Añadir la primera
        </Link>
      </section>
    );
  }

  return (
    <section className="paper p-4">
      <h2 className="font-display text-xl leading-tight">Índice</h2>
      <ul className="idx mt-3">
        {recetas.map((r) => (
          <li key={r.id}>
            <Link href={`/receta/${r.id}`}>
              <span className="row">
                <span className="name">{r.titulo}</span>
                <span className="dots" />
                <span className="pg">{r.pagina ?? "—"}</span>
              </span>
              <span className="tag mt-1.5">
                <i />
                {PROCEDENCIA[r.origen]}
                {r.dudasAbiertas > 0 &&
                  ` · ${r.dudasAbiertas} ${r.dudasAbiertas === 1 ? "duda abierta" : "dudas abiertas"}`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IndiceCargando() {
  return (
    <section className="paper p-4">
      <h2 className="font-display text-xl leading-tight">Índice</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Abriendo el libro…</p>
    </section>
  );
}

export default function LibroPage() {
  return (
    <>
      <header className="tin">
        <span className="label">Cuaderno de la familia</span>
        <h1 className="mt-2 font-display text-[30px] leading-[1.08] text-balance">
          El libro de casa
        </h1>
      </header>

      <Suspense fallback={<IndiceCargando />}>
        <Indice />
      </Suspense>

      <Hueco titulo="Capítulos por origen" llega="Llega en el paso 11">
        Los filtros de Mamá, Abuela, TikTok, Un libro y Mía, con el número de recetas de cada uno.
      </Hueco>
    </>
  );
}
