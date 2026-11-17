import type { Metadata } from "next";
import { Suspense } from "react";
import Formulario from "./formulario";

export const metadata: Metadata = { title: "Entrar" };

/**
 * Leer la dirección obliga a esperar a la petición, así que va aparte y
 * dentro de un Suspense: el resto de la pantalla se pregenera igualmente.
 */
async function Aviso({ busqueda }: { busqueda: PageProps<"/entrar">["searchParams"] }) {
  const { fallo } = await busqueda;
  if (!fallo) return null;

  const mensaje =
    fallo === "caducado"
      ? "Ese enlace ya no vale: cada enlace sirve una sola vez y caduca. Si pediste varios, solo funciona el del último correo. Pide otro y abre el más reciente."
      : "No hemos podido entrar con ese enlace. Pide otro y ábrelo desde el correo, sin copiarlo ni pegarlo.";

  return (
    <p role="alert" className="mt-3 text-sm text-tomato">
      {mensaje}
    </p>
  );
}

export default function EntrarPage({ searchParams }: PageProps<"/entrar">) {
  return (
    <main className="mx-auto flex w-full max-w-book flex-1 flex-col justify-center gap-4 p-4">
      <div className="tin">
        <span className="label">Tu libro de recetas de casa</span>
        <h1 className="mt-2 font-display text-[30px] leading-[1.08] text-balance">A ojo</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Sin contraseña: te mandamos un enlace al correo y entras con un clic.
        </p>
        <Suspense fallback={null}>
          <Aviso busqueda={searchParams} />
        </Suspense>
        <Formulario />

        <p className="mt-4 border-t border-[var(--line)] pt-3 text-[13px] text-ink-soft">
          Tus recetas son tuyas. Nadie más que tú puede verlas.
        </p>
      </div>
    </main>
  );
}
