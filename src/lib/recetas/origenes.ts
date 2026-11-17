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
