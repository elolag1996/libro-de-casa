import type { Metadata } from "next";
import Hueco from "../hueco";

export const metadata: Metadata = { title: "Añadir al libro" };

export default function AnadirPage() {
  return (
    <>
      <header className="tin">
        <span className="label">Nueva página</span>
        <h1 className="mt-2 font-display text-[30px] leading-[1.08] text-balance">
          Añadir al libro
        </h1>
      </header>

      <Hueco titulo="Pegar la receta y elegir de quién es" llega="Llega en el paso 7">
        El cuadro de texto donde pegas lo que te mandaron y los orígenes (Mamá, Abuela, TikTok,
        Un libro, Mía). Antes, en el paso 6, Claude aprende a ordenar una receta sin inventarse nada.
      </Hueco>

      <Hueco titulo="Foto y enlace de TikTok" llega="Llega en la fase 2">
        Una foto de una página o del cuaderno de la abuela, y el enlace de TikTok leyendo solo su
        descripción pública.
      </Hueco>
    </>
  );
}
