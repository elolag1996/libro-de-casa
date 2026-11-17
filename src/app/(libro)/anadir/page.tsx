import type { Metadata } from "next";
import Formulario from "./formulario";
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

      <Formulario />

      <Hueco titulo="Foto y enlace de TikTok" llega="Llega en la fase 2">
        Una foto de una página o del cuaderno de la abuela, y el enlace de TikTok leyendo solo su
        descripción pública.
      </Hueco>
    </>
  );
}
