"use server";

import { refresh } from "next/cache";
import { clienteServidor } from "@/lib/supabase/servidor";

export type RespuestaGuardada =
  | { estado: "quieto" }
  | { estado: "error"; mensaje: string }
  | { estado: "hecha" };

/**
 * Guarda lo que contestó quien mandó la receta.
 *
 * La sesión se comprueba aquí dentro: una acción de servidor se alcanza por
 * POST directo, sin pasar por la pantalla. Que la duda sea de una receta tuya
 * lo garantiza la RLS de la base de datos.
 */
export async function responderDuda(
  _anterior: RespuestaGuardada,
  datos: FormData,
): Promise<RespuestaGuardada> {
  const supabase = await clienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { estado: "error", mensaje: "Se ha cerrado tu sesión. Vuelve a entrar." };
  }

  const id = String(datos.get("duda") ?? "");
  const texto = String(datos.get("respuesta") ?? "").trim();

  if (!id) {
    return { estado: "error", mensaje: "No sé a qué duda responder." };
  }

  // Vaciar el campo borra la respuesta: la duda vuelve a estar abierta.
  const { error, data } = await supabase
    .from("doubts")
    .update({
      answer: texto || null,
      answered_at: texto ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("id");

  if (error) {
    return { estado: "error", mensaje: error.message };
  }
  if (!data || data.length === 0) {
    return { estado: "error", mensaje: "Esa duda no es de ninguna receta tuya." };
  }

  refresh();
  return { estado: "hecha" };
}
