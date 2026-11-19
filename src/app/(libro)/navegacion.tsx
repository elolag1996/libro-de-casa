"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { BarraSecciones } from "./secciones";

/** Marca la sección abierta. La pantalla de receta no es sección: no marca ninguna. */
export default function Navegacion() {
  return <BarraSecciones activo={useSelectedLayoutSegment()} />;
}
