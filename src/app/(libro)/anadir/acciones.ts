"use server";

import { refresh } from "next/cache";
import { clienteServidor } from "@/lib/supabase/servidor";
import { structureRecipe, RecetaNoProcesada } from "@/lib/recetas/structure-recipe";
import { guardarReceta, NoSePudoGuardar } from "@/lib/recetas/guardar";
import { ORIGENES, type Origen } from "@/lib/recetas/origenes";

export type Resultado =
  | { estado: "quieto" }
  | { estado: "error"; mensaje: string }
  | { estado: "hecha"; titulo: string; pagina: number; dudas: number };

export async function anadirReceta(
  _anterior: Resultado,
  datos: FormData,
): Promise<Resultado> {
  // Una acción de servidor se puede invocar por POST directo, sin pasar por
  // la pantalla. Por eso la sesión se comprueba AQUÍ, no solo en proxy.ts.
  const supabase = await clienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { estado: "error", mensaje: "Se ha cerrado tu sesión. Vuelve a entrar." };
  }

  const texto = String(datos.get("texto") ?? "");
  const origen = String(datos.get("origen") ?? "");

  if (!texto.trim()) {
    return { estado: "error", mensaje: "Pega primero la receta." };
  }
  if (!ORIGENES.includes(origen as Origen)) {
    return { estado: "error", mensaje: "Elige de quién es la receta." };
  }

  try {
    const receta = await structureRecipe(texto);
    // Se guarda el texto tal cual llegó, sin recortar ni limpiar: el original
    // no se toca, y eso empieza aquí.
    const { pagina } = await guardarReceta({
      textoOriginal: texto,
      origen: origen as Origen,
      receta,
    });

    refresh();

    return {
      estado: "hecha",
      titulo: receta.titulo,
      pagina,
      dudas: receta.dudas.length,
    };
  } catch (fallo) {
    if (fallo instanceof RecetaNoProcesada || fallo instanceof NoSePudoGuardar) {
      return { estado: "error", mensaje: fallo.message };
    }
    console.error("[anadir] fallo inesperado:", fallo);
    return {
      estado: "error",
      mensaje: "Algo ha fallado al ordenar la receta. Inténtalo otra vez.",
    };
  }
}
