/**
 * Hueco honesto: dice qué irá en ese sitio y cuándo llega.
 * Evita maquetas que parezcan funcionar sin funcionar.
 */
export default function Hueco({
  titulo,
  llega,
  children,
}: {
  titulo: string;
  /** Frase completa, p. ej. "Llega en el paso 8" o "Llega en la fase 2". */
  llega: string;
  children: React.ReactNode;
}) {
  return (
    <section className="paper p-4">
      <h2 className="font-display text-xl leading-tight">{titulo}</h2>
      <p className="mt-1.5 text-sm text-ink-soft">{children}</p>
      <p className="label mt-3">{llega}</p>
    </section>
  );
}
