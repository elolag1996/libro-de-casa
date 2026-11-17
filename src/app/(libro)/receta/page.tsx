import type { Metadata } from "next";
import Link from "next/link";
import Hueco from "../hueco";

export const metadata: Metadata = { title: "Receta" };

export default function RecetaPage() {
  return (
    <>
      <Link href="/" className="back">
        ← Índice
      </Link>

      {/* Muestra visual de las pestañas. Todavía no cambian de capa: eso es el paso 8,
          y hasta entonces no se anuncian como pestañas a los lectores de pantalla. */}
      <div className="layers" aria-hidden="true">
        <span className="layer-tab" data-activa="true">
          Como me la mandó
        </span>
        <span className="layer-tab">Paso a paso</span>
      </div>

      <article className="paper page p-4">
        <div className="runhead">
          <span className="label">De mamá</span>
          <span className="label">Pág. 14</span>
        </div>
        <h1 className="font-display text-[26px] leading-[1.1] text-balance">Fabada</h1>
        <p className="byline">Maqueta de la página de receta</p>
        <p className="text-sm text-ink-soft">
          Aquí vivirán las dos capas: el original tal cual lo mandó mamá, en estilo libreta y con
          las dudas subrayadas, y la versión ordenada en ingredientes y pasos. El original no se
          toca nunca.
        </p>
      </article>

      <Hueco titulo="Las dos pestañas, funcionando" llega="Llega en el paso 8">
        «Como me la mandó» y «Paso a paso», con teclado y lector de pantalla.
      </Hueco>

      <Hueco titulo="Dudas y «Preguntar a mamá»" llega="Llega en los pasos 9 y 10">
        Cada duda con su respuesta guardada, y el mensaje de WhatsApp con las preguntas numeradas.
      </Hueco>
    </>
  );
}
