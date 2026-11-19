import { z } from "zod";

/**
 * La forma que el modelo está obligado a devolver. No es documentación: la API
 * valida contra esto, así que lo que no quepa aquí no puede llegar.
 *
 * Dos reglas viven dentro del esquema, no solo en el prompt:
 * - `cantidad_texto` es texto, nunca número: "un puñado" se conserva entero.
 * - Lo que falta es `null`, y lo que es `null` suele tener su duda al lado.
 */

export const Ingrediente = z.object({
  nombre: z.string().describe("El ingrediente, tal como lo nombra el original."),
  cantidad_texto: z
    .string()
    .nullable()
    .describe(
      'Copiada literal: "un puñado", "una cabeza de ajo", "media hora antes". ' +
        "Nunca un número inventado ni una conversión a gramos. Si el original no " +
        "dice cantidad, null; no te la inventes.",
    ),
  opcional: z
    .boolean()
    .describe('true solo si el original lo marca, por ejemplo "si tienes".'),
  nota: z
    .string()
    .nullable()
    .describe("Aclaración que da el propio original sobre este ingrediente."),
});

export const Paso = z.object({
  texto: z
    .string()
    .describe(
      "Una acción, en orden. Puedes separar en pasos lo que venía junto, pero " +
        "no añadas acciones que el original no diga ni rellenes huecos.",
    ),
});

export const NotaDeVoz = z.object({
  cita: z
    .string()
    .describe(
      "Palabras literales de quien escribió la receta, con sus faltas si las " +
        'tiene. Por ejemplo: "las de fabada son carísimas". No la corrijas.',
    ),
  tipo: z.enum(["compra", "consejo", "advertencia", "cariño", "otro"]),
});

export const Duda = z.object({
  pregunta: z
    .string()
    .describe(
      "Pregunta corta y concreta, en español y en segunda persona, lista para " +
        'mandarle a quien escribió la receta: "¿Cuándo entra la morcilla?".',
    ),
  fragmento: z
    .string()
    .describe(
      "El trozo EXACTO del original que provoca la duda, copiado carácter a " +
        "carácter para poder subrayarlo. Si la duda es por algo que NO está " +
        "escrito, cadena vacía.",
    ),
});

export const RecetaEstructurada = z.object({
  titulo: z
    .string()
    .describe(
      "El nombre del plato. Si el original no lo dice pero se deduce sin lugar " +
        'a dudas, ponlo. Si no se deduce, "Sin título" y añade una duda.',
    ),
  personas: z
    .string()
    .nullable()
    .describe('Texto libre: "para dos", "4 personas". Si no lo dice, null.'),
  remojo: z
    .string()
    .nullable()
    .describe("Lo que el original diga sobre poner a remojo. Si no dice, null."),
  tiempo_coccion: z
    .string()
    .nullable()
    .describe('Literal: "2 horas o 2 y media". Si no lo dice, null.'),
  ingredientes: z.array(Ingrediente),
  pasos: z.array(Paso),
  notas_de_voz: z.array(NotaDeVoz),
  dudas: z
    .array(Duda)
    .describe(
      "Todo lo ambiguo, contradictorio o ausente. Una lista vacía significa que " +
        "la receta no deja ninguna pregunta abierta, lo cual es raro.",
    ),
});

export type RecetaEstructurada = z.infer<typeof RecetaEstructurada>;
