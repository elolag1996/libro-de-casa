import { Suspense } from "react";
import Navegacion from "./navegacion";
import { BarraSecciones } from "./secciones";

/**
 * Armazón del libro: una columna de 430 px centrada sobre el mantel,
 * con la barra de secciones pegada abajo. La muestra de diseño
 * (/diseno) queda fuera de este grupo y por tanto sin barra.
 */
export default function LibroLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex w-full max-w-book flex-1 flex-col">
      <main className="flex flex-1 flex-col gap-3.5 px-3.5 pt-4 pb-7">{children}</main>
      {/* Saber qué sección está abierta exige esperar a la petición en las
          direcciones con número de receta. Mientras tanto se pinta la barra
          sin marcar nada, para que no parpadee. */}
      <Suspense fallback={<BarraSecciones />}>
        <Navegacion />
      </Suspense>
    </div>
  );
}
