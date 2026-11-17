import Groq from "groq-sdk";
import { z } from "zod";
import { RecetaEstructurada } from "./esquema.ts";
import { INSTRUCCIONES, peticion } from "./prompt.ts";

/**
 * Convierte el texto de una receta en la capa ordenada.
 *
 * Corre SIEMPRE en el servidor: la clave de Groq no lleva prefijo
 * NEXT_PUBLIC_ a propósito, para que no pueda acabar en el navegador.
 *
 * El modelo se elige en GROQ_MODEL. El de por defecto es el único de Groq
 * que admite modo estricto de esquema y además razona antes de responder.
 */

// Ojo: GROQ_MODEL= en .env.local vale cadena vacía, no "sin definir".
// Por eso || y no ??: la cadena vacía también tiene que caer al de por defecto.
const MODELO = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";

export class RecetaNoProcesada extends Error {}

/**
 * El esquema JSON que se le impone al modelo. Zod lo genera con todos los
 * campos obligatorios y sin propiedades extra, que es justo lo que exige el
 * modo estricto. Se quita `$schema`, que ahí sobra.
 */
function esquemaJson() {
  const { $schema, ...resto } = z.toJSONSchema(RecetaEstructurada) as Record<
    string,
    unknown
  >;
  void $schema;
  return resto;
}

export async function structureRecipe(
  textoOriginal: string,
): Promise<RecetaEstructurada> {
  const texto = textoOriginal.trim();
  if (!texto) {
    throw new RecetaNoProcesada("La receta está vacía.");
  }

  if (!process.env.GROQ_API_KEY) {
    throw new RecetaNoProcesada(
      "Falta GROQ_API_KEY. Añádela a .env.local (y a Vercel) como variable secreta.",
    );
  }

  const groq = new Groq();

  const respuesta = await groq.chat.completions.create({
    model: MODELO,
    // gpt-oss razona antes de responder, y ese razonamiento consume cupo.
    // Con el límite por defecto se queda sin sitio y devuelve vacío.
    max_completion_tokens: 16000,
    reasoning_effort: "medium",
    messages: [
      { role: "system", content: INSTRUCCIONES },
      { role: "user", content: peticion(texto) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "receta_estructurada",
        strict: true,
        schema: esquemaJson(),
      },
    },
  });

  const eleccion = respuesta.choices[0];

  if (eleccion?.finish_reason === "length") {
    throw new RecetaNoProcesada(
      "La receta es demasiado larga y la respuesta se ha cortado.",
    );
  }

  const contenido = eleccion?.message?.content;
  if (!contenido) {
    throw new RecetaNoProcesada("El modelo no devolvió nada.");
  }

  let crudo: unknown;
  try {
    crudo = JSON.parse(contenido);
  } catch {
    throw new RecetaNoProcesada("El modelo no devolvió JSON válido.");
  }

  // El modo estricto promete la forma, no el sentido. Se valida igualmente:
  // antes guardar nada a medias, preferimos no guardar nada.
  const comprobado = RecetaEstructurada.safeParse(crudo);
  if (!comprobado.success) {
    throw new RecetaNoProcesada(
      `La respuesta no encajó con el esquema: ${comprobado.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
    );
  }

  return comprobado.data;
}
