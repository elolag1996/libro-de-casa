import { VOCATIVO, PROCEDENCIA, type Origen } from "./origenes";

/**
 * Los mensajes de WhatsApp. Plantilla fija a propósito: sale siempre igual,
 * es instantáneo y no cuesta una llamada a la IA. Si algún día suena rígido,
 * la alternativa está anotada en CONTEXTO.md.
 *
 * Nada de esto se envía solo: compone el texto y abre WhatsApp. El enviar
 * siempre lo pulsa una persona.
 */

type Duda = { numero: number; pregunta: string; respuesta: string | null };

type Receta = {
  titulo: string;
  origen: Origen;
  personas: string | null;
  remojo: string | null;
  tiempoCoccion: string | null;
  ingredientes: { nombre: string; cantidad: string | null; opcional: boolean }[];
  pasos: { texto: string }[];
  notasDeVoz: { cita: string }[];
  dudas: Duda[];
};

/** El mensaje con las dudas abiertas, numeradas. */
export function mensajeDudas(receta: Receta): string | null {
  const abiertas = receta.dudas.filter((d) => !d.respuesta);
  if (abiertas.length === 0) return null;

  const vocativo = VOCATIVO[receta.origen];
  const apertura = vocativo
    ? `${vocativo}, estoy pasando tu ${receta.titulo.toLowerCase()} al libro`
    : `Estoy pasando ${receta.titulo.toLowerCase()} al libro`;

  const cuantas =
    abiertas.length === 1 ? "y me ha salido una duda:" : `y me han salido ${abiertas.length} dudas:`;

  // Se conserva el número que la duda tiene en la página. Si mamá contesta
  // "la 3", tiene que ser la 3 también en el libro.
  const preguntas = abiertas.map((d) => `${d.numero}. ${d.pregunta}`).join("\n");

  return `${apertura} ${cuantas}\n\n${preguntas}\n\nCuando puedas ❤️`;
}

/** La receta ordenada, para quien la vaya a cocinar. */
export function mensajePasos(receta: Receta): string {
  const trozos: string[] = [`*${receta.titulo}* — ${PROCEDENCIA[receta.origen]}`];

  const cabecera = [
    // "para dos" ya trae el "para": no se repite.
    receta.personas &&
      (/^para\b/i.test(receta.personas.trim())
        ? receta.personas.trim().replace(/^p/, "P")
        : `Para ${receta.personas.trim()}`),
    receta.remojo && `Remojo: ${receta.remojo}`,
    receta.tiempoCoccion && `Cocción: ${receta.tiempoCoccion}`,
  ].filter(Boolean);
  if (cabecera.length) trozos.push(cabecera.join("\n"));

  if (receta.ingredientes.length) {
    const lista = receta.ingredientes
      .map((i) => {
        const cantidad = i.cantidad ? ` — ${i.cantidad}` : "";
        const opcional = i.opcional ? " (si tienes)" : "";
        return `· ${i.nombre}${cantidad}${opcional}`;
      })
      .join("\n");
    trozos.push(`*Ingredientes*\n${lista}`);
  }

  if (receta.pasos.length) {
    const lista = receta.pasos.map((p, n) => `${n + 1}. ${p.texto}`).join("\n");
    trozos.push(`*Pasos*\n${lista}`);
  }

  if (receta.notasDeVoz.length) {
    const citas = receta.notasDeVoz.map((n) => `«${n.cita}»`).join("\n");
    trozos.push(`*Lo que dijo*\n${citas}`);
  }

  return trozos.join("\n\n");
}

/** Enlace que abre WhatsApp con el mensaje escrito, sin enviarlo. */
export function enlaceWhatsApp(texto: string): string {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
