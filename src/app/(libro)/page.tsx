import Link from "next/link";
import Hueco from "./hueco";

export default function LibroPage() {
  return (
    <>
      <header className="tin">
        <span className="label">Cuaderno de la familia</span>
        <h1 className="mt-2 font-display text-[30px] leading-[1.08] text-balance">
          El libro de casa
        </h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Aún no hay recetas de verdad: esto es la maqueta de la pantalla.
        </p>
      </header>

      <section className="paper p-4">
        <h2 className="font-display text-xl leading-tight">Índice</h2>
        <span className="label mt-1 block">Una entrada de ejemplo, para poder navegar</span>
        <ul className="idx mt-3">
          <li>
            <Link href="/receta">
              <span className="row">
                <span className="name">Fabada</span>
                <span className="dots" />
                <span className="pg">14</span>
              </span>
              <span className="tag mt-1.5">
                <i />
                De mamá
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <Hueco titulo="Capítulos por origen" llega="Llega en el paso 11">
        Los filtros de Mamá, Abuela, TikTok, Un libro y Mía, con el número de recetas de cada uno.
      </Hueco>
    </>
  );
}
