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
