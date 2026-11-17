import "server-only";
import { clienteServidor } from "@/lib/supabase/servidor";
import type { RecetaEstructurada } from "./esquema";
import type { Origen } from "./origenes";

export class NoSePudoGuardar extends Error {}

/**
 * Guarda una receta: el original tal cual llegó, y encima la capa ordenada.
 *
 * `original_text` se escribe una vez y no se toca nunca más. La base de datos
 * lo impide con un trigger; aquí no hay ninguna ruta que lo actualice.
 */
export async function guardarReceta({
  textoOriginal,
  origen,
  receta,
}: {
  textoOriginal: string;
  origen: Origen;
  receta: RecetaEstructurada;
}): Promise<{ id: string; pagina: number }> {
  const supabase = await clienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new NoSePudoGuardar("Hay que entrar antes de guardar una receta.");
  }

  // El libro va numerando páginas. La primera receta es la página 1.
  const { data: ultima } = await supabase
    .from("recipes")
    .select("page_number")
    .eq("user_id", user.id)
    .order("page_number", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  const pagina = (ultima?.page_number ?? 0) + 1;

  const { data: creada, error: errorReceta } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title: receta.titulo,
      source_type: origen,
      original_text: textoOriginal,
      servings: receta.personas,
      soak_note: receta.remojo,
      cook_time_note: receta.tiempo_coccion,
      voice_notes: receta.notas_de_voz,
      page_number: pagina,
    })
    .select("id")
    .single();

  if (errorReceta || !creada) {
    throw new NoSePudoGuardar(
      errorReceta?.message ?? "No se pudo guardar la receta.",
    );
  }

  // Si algo de lo de abajo falla, se borra la receta entera: Supabase no da
  // transacciones desde aquí, y preferimos nada antes que media receta.
  try {
    if (receta.ingredientes.length) {
      const { error } = await supabase.from("recipe_ingredients").insert(
        receta.ingredientes.map((i, n) => ({
          recipe_id: creada.id,
          position: n + 1,
          name: i.nombre,
          quantity_text: i.cantidad_texto,
          optional: i.opcional,
          note: i.nota,
        })),
      );
      if (error) throw new NoSePudoGuardar(error.message);
    }

    if (receta.pasos.length) {
      const { error } = await supabase.from("recipe_steps").insert(
        receta.pasos.map((p, n) => ({
          recipe_id: creada.id,
          position: n + 1,
          text: p.texto,
        })),
      );
      if (error) throw new NoSePudoGuardar(error.message);
    }

    if (receta.dudas.length) {
      const { error } = await supabase.from("doubts").insert(
        receta.dudas.map((d, n) => ({
          recipe_id: creada.id,
          position: n + 1,
          question: d.pregunta,
          anchor_text: d.fragmento || null,
        })),
      );
      if (error) throw new NoSePudoGuardar(error.message);
    }
  } catch (fallo) {
    await supabase.from("recipes").delete().eq("id", creada.id);
    throw fallo instanceof NoSePudoGuardar
      ? fallo
      : new NoSePudoGuardar("No se pudo guardar la receta entera.");
  }

  return { id: creada.id, pagina };
}
