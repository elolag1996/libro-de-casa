/**
 * De dónde viene una receta. Vive aparte del guardado a propósito: esta lista
 * la necesita también el navegador, y `guardar.ts` es solo de servidor.
 */
export const ORIGENES = ["mama", "abuela", "tiktok", "libro", "mia"] as const;

export type Origen = (typeof ORIGENES)[number];

export const NOMBRE_ORIGEN: Record<Origen, string> = {
  mama: "Mamá",
  abuela: "Abuela",
  tiktok: "TikTok",
  libro: "Un libro",
  mia: "Mía",
};

/**
 * A quién se le preguntan las dudas, según de dónde venga la receta.
 * `null` cuando no hay nadie a quien preguntar: la receta es tuya.
 */
export const A_QUIEN_PREGUNTAR: Record<Origen, string | null> = {
  mama: "mamá",
  abuela: "la abuela",
  tiktok: "quien la subió",
  libro: "quien te la pasó",
  mia: null,
};

/**
 * Cómo se empieza un WhatsApp a esa persona. `null` cuando no hay un nombre
 * natural con el que empezar («Oye, quien la subió a TikTok…» no se dice).
 */
export const VOCATIVO: Record<Origen, string | null> = {
  mama: "Mamá",
  abuela: "Abuela",
  tiktok: null,
  libro: null,
  mia: null,
};

/**
 * El origen dicho dentro de una frase. `NOMBRE_ORIGEN` sirve para botones
 * sueltos; esto para escribir: «de la abuela», no «de Abuela».
 */
export const PROCEDENCIA: Record<Origen, string> = {
  mama: "de mamá",
  abuela: "de la abuela",
  tiktok: "de TikTok",
  libro: "de un libro",
  mia: "mía",
};
