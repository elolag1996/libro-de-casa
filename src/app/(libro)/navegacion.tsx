"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

type Seccion = {
  href: "/" | "/hoy" | "/anadir" | "/despensa";
  /** Lo que devuelve useSelectedLayoutSegment cuando esta sección está abierta. */
  segmento: string | null;
  etiqueta: string;
  /** Dibujo del icono, en una sola línea de SVG. */
  trazo: string;
  destacado?: boolean;
};

/**
 * Barra inferior con las cuatro secciones que se alcanzan con el pulgar.
 * La pantalla de receta no es una sección: se entra desde el índice.
 */
const secciones: Seccion[] = [
  {
    href: "/",
    // En la raíz no hay segmento por debajo de este layout, de ahí el null.
    segmento: null,
    etiqueta: "Libro",
    trazo: "M4 5.5A1.5 1.5 0 0 1 5.5 4H19v15H5.5A1.5 1.5 0 0 0 4 20.5zM4 20.5V5.5M8 8h7",
  },
  {
    href: "/hoy",
    segmento: "hoy",
    etiqueta: "Hoy",
    trazo: "M5 10h14v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3zM3 10h18M9 7c0-1.5 1-1.5 1-3M14 7c0-1.5 1-1.5 1-3",
  },
  {
    href: "/anadir",
    segmento: "anadir",
    etiqueta: "Añadir",
    trazo: "M12 5v14M5 12h14",
    destacado: true,
  },
  {
    href: "/despensa",
    segmento: "despensa",
    etiqueta: "Despensa",
    trazo: "M7 4h10v3H7zM6 7h12v13H6zM9 12h6v4H9z",
  },
];

export default function Navegacion() {
  const activo = useSelectedLayoutSegment();

  return (
    <nav className="tabbar" aria-label="Secciones">
      {secciones.map(({ href, segmento, etiqueta, trazo, destacado }) => (
        <Link
          key={href}
          href={href}
          className={destacado ? "destacado" : undefined}
          aria-current={segmento === activo ? "page" : undefined}
        >
          <span className="ic">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={trazo} />
            </svg>
          </span>
          {etiqueta}
        </Link>
      ))}
    </nav>
  );
}
