import type { ReactNode } from "react";

type Duda = { id: string; numero: number; fragmento: string | null };

/**
 * Subraya en el original los trozos que provocaron cada duda, con su número.
 *
 * Si un fragmento no aparece tal cual en el original, NO se subraya nada y no
 * se toca el texto: antes una duda sin subrayar que un original retocado.
 */
export function subrayarDudas(texto: string, dudas: Duda[]): ReactNode {
  const marcas = dudas
    .filter((d) => d.fragmento && d.fragmento.trim())
    .map((d) => ({ duda: d, desde: texto.indexOf(d.fragmento!) }))
    .filter((m) => m.desde >= 0)
    .sort((a, b) => a.desde - b.desde);

  const trozos: ReactNode[] = [];
  let cursor = 0;

  for (const { duda, desde } of marcas) {
    if (desde < cursor) continue; // se solapa con una anterior: se deja estar
    const hasta = desde + duda.fragmento!.length;
    if (desde > cursor) trozos.push(texto.slice(cursor, desde));
    trozos.push(
      <mark className="duda" key={duda.id}>
        {texto.slice(desde, hasta)}
        <sup>{duda.numero}</sup>
      </mark>,
    );
    cursor = hasta;
  }

  if (cursor < texto.length) trozos.push(texto.slice(cursor));
  return trozos;
}
