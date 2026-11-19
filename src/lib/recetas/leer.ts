import "server-only";
import { clienteServidor } from "@/lib/supabase/servidor";
import type { Origen } from "./origenes";

export type NotaDeVoz = { cita: string; tipo: string };

export type EntradaIndice = {
  id: string;
  titulo: string;
  pagina: number | null;
  origen: Origen;
  dudasAbiertas: number;
};

export type RecetaCompleta = {
  id: string;
  titulo: string;
  pagina: number | null;
  origen: Origen;
  original: string;
  personas: string | null;
  remojo: string | null;
  tiempoCoccion: string | null;
  notasDeVoz: NotaDeVoz[];
  creada: string;
  ingredientes: {
    id: string;
    nombre: string;
    cantidad: string | null;
    opcional: boolean;
    nota: string | null;
  }[];
  pasos: { id: string; texto: string }[];
  dudas: {
    id: string;
    numero: number;
    pregunta: string;
    fragmento: string | null;
    respuesta: string | null;
  }[];
};

/** Las recetas de quien pregunta. La RLS se encarga de que no haya otras. */
export async function listarRecetas(): Promise<EntradaIndice[]> {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, page_number, source_type, doubts(id, answered_at)")
    .order("page_number", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((r) => ({
    id: r.id,
    titulo: r.title,
    pagina: r.page_number,
    origen: r.source_type as Origen,
    dudasAbiertas: (r.doubts ?? []).filter((d) => d.answered_at === null).length,
  }));
}

/** Una receta entera. Devuelve null si no existe o no es tuya. */
export async function leerReceta(id: string): Promise<RecetaCompleta | null> {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `id, title, page_number, source_type, original_text, servings, soak_note,
       cook_time_note, voice_notes, created_at,
       recipe_ingredients(id, position, name, quantity_text, optional, note),
       recipe_steps(id, position, text),
       doubts(id, position, question, anchor_text, answer)`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const porPosicion = <T extends { position: number }>(xs: T[]) =>
    [...xs].sort((a, b) => a.position - b.position);

  return {
    id: data.id,
    titulo: data.title,
    pagina: data.page_number,
    origen: data.source_type as Origen,
    original: data.original_text,
    personas: data.servings,
    remojo: data.soak_note,
    tiempoCoccion: data.cook_time_note,
    notasDeVoz: Array.isArray(data.voice_notes) ? (data.voice_notes as NotaDeVoz[]) : [],
    creada: data.created_at,
    ingredientes: porPosicion(data.recipe_ingredients ?? []).map((i) => ({
      id: i.id,
      nombre: i.name,
      cantidad: i.quantity_text,
      opcional: i.optional,
      nota: i.note,
    })),
    pasos: porPosicion(data.recipe_steps ?? []).map((p) => ({ id: p.id, texto: p.text })),
    dudas: porPosicion(data.doubts ?? []).map((d) => ({
      id: d.id,
      numero: d.position,
      pregunta: d.question,
      fragmento: d.anchor_text,
      respuesta: d.answer,
    })),
  };
}
