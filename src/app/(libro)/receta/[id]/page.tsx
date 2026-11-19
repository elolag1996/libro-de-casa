import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { leerReceta } from "@/lib/recetas/leer";
import { NOMBRE_ORIGEN } from "@/lib/recetas/origenes";
import Capas from "./capas";
import { subrayarDudas } from "./subrayar";

export default function RecetaPage({ params }: PageProps<"/receta/[id]">) {
  return (
    <>
      <Link href="/" className="back">
        ← Índice
      </Link>
      <Suspense fallback={<p className="label">Abriendo la página…</p>}>
        <Pagina params={params} />
      </Suspense>
    </>
  );
}

async function Pagina({ params }: { params: PageProps<"/receta/[id]">["params"] }) {
  const { id } = await params;
  const receta = await leerReceta(id);
  if (!receta) notFound();

  const sinSubrayar = receta.dudas.filter(
    (d) => d.fragmento && !receta.original.includes(d.fragmento),
  ).length;

  return (
    <>
      <Capas
        original={
          <article className="paper p-4">
            <Cabecera receta={receta} />
            {/* El original, tal cual llegó. Esta es la única verdad. */}
            <div className="lined whitespace-pre-wrap">
              {subrayarDudas(receta.original, receta.dudas)}
            </div>
            {receta.dudas.length > 0 && (
              <p className="mt-4 border-t border-[var(--line)] pt-3 text-[13px] text-ink-soft">
                Lo subrayado en rojo es lo que no queda claro.
                {sinSubrayar > 0 &&
                  ` (${sinSubrayar} ${sinSubrayar === 1 ? "duda no se pudo" : "dudas no se pudieron"} señalar en el texto.)`}
              </p>
            )}
          </article>
        }
        ordenada={
          <article className="paper p-4">
            <Cabecera receta={receta} />

            {(receta.personas || receta.remojo || receta.tiempoCoccion) && (
              <dl className="mb-4 grid gap-1.5 border-b border-[var(--line)] pb-4 text-sm">
                {receta.personas && <Dato nombre="Para" valor={receta.personas} />}
                {receta.remojo && <Dato nombre="Remojo" valor={receta.remojo} />}
                {receta.tiempoCoccion && <Dato nombre="Cocción" valor={receta.tiempoCoccion} />}
              </dl>
            )}

            <h2 className="label">Ingredientes</h2>
            <ul className="mt-2 grid gap-1.5">
              {receta.ingredientes.map((i) => (
                <li key={i.id} className="flex gap-2 text-[15px]">
                  <span aria-hidden="true" className="text-ink-soft">
                    ·
                  </span>
                  <span>
                    {i.nombre}
                    {i.cantidad && <span className="text-ink-soft"> — {i.cantidad}</span>}
                    {i.opcional && <span className="text-ink-soft"> (si tienes)</span>}
                    {i.nota && <span className="text-ink-soft"> · {i.nota}</span>}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="label mt-5">Pasos</h2>
            <ol className="mt-2 grid gap-2.5">
              {receta.pasos.map((p, n) => (
                <li key={p.id} className="flex gap-2.5 text-[15px] leading-[1.5]">
                  <span className="pg shrink-0 text-ink-soft">{n + 1}</span>
                  <span>{p.texto}</span>
                </li>
              ))}
            </ol>

            {receta.notasDeVoz.length > 0 && (
              <>
                <h2 className="label mt-5">Lo que dijo</h2>
                <ul className="mt-2 grid gap-2.5">
                  {receta.notasDeVoz.map((n, i) => (
                    <li key={i} className="font-hand text-[18px] leading-[1.45] text-pen">
                      «{n.cita}»
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-5 border-t border-[var(--line)] pt-3 text-[13px] text-ink-soft">
              Esta versión la ordenó la app. La buena es la otra pestaña.
            </p>
          </article>
        }
      />

      {receta.dudas.length > 0 && (
        <section className="paper p-4" aria-labelledby="dudas">
          <h2 id="dudas" className="font-display text-xl leading-tight">
            {receta.dudas.length === 1 ? "Queda una duda" : `Quedan ${receta.dudas.length} dudas`}
          </h2>
          <ol className="mt-3 grid gap-3">
            {receta.dudas.map((d) => (
              <li key={d.id} className="border-t border-[var(--line)] pt-3 text-[15px]">
                <span className="pg mr-1.5 text-tomato">{d.numero}</span>
                {d.pregunta}
                {d.respuesta && (
                  <p className="mt-1.5 font-hand text-[18px] text-pen">{d.respuesta}</p>
                )}
              </li>
            ))}
          </ol>
          <p className="label mt-4">Responder y preguntar a mamá: pasos 9 y 10</p>
        </section>
      )}
    </>
  );
}

function Cabecera({ receta }: { receta: { titulo: string; pagina: number | null; origen: keyof typeof NOMBRE_ORIGEN } }) {
  return (
    <>
      <div className="runhead">
        <span className="label">De {NOMBRE_ORIGEN[receta.origen]}</span>
        <span className="label">Pág. {receta.pagina ?? "—"}</span>
      </div>
      <h1 className="mb-4 font-display text-[26px] leading-[1.1] text-balance">{receta.titulo}</h1>
    </>
  );
}

function Dato({ nombre, valor }: { nombre: string; valor: string }) {
  return (
    <div className="flex gap-2">
      <dt className="label shrink-0 pt-0.5">{nombre}</dt>
      <dd className="m-0">{valor}</dd>
    </div>
  );
}
