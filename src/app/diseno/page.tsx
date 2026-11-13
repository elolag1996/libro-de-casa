import type { Metadata } from "next";

export const metadata: Metadata = { title: "Diseño · A ojo" };

const colores = [
  { nombre: "Hule", clase: "bg-hule", hex: "#2446B0", uso: "El mantel" },
  { nombre: "Papel", clase: "bg-paper border border-paper-edge", hex: "#FDFBF6", uso: "Las páginas" },
  { nombre: "Tinta", clase: "bg-ink", hex: "#14203A", uso: "Texto" },
  { nombre: "Bolígrafo", clase: "bg-pen", hex: "#1D3A98", uso: "La voz de mamá" },
  { nombre: "Tomate", clase: "bg-tomato", hex: "#D2402A", uso: "Dudas y acción principal" },
  { nombre: "Mostaza", clase: "bg-mustard", hex: "#B8860B", uso: "Solo puntos, nunca texto" },
  { nombre: "Verde", clase: "bg-green", hex: "#2F7A58", uso: "En casa" },
];

const origenes = [
  { nombre: "Mamá", color: "var(--color-tomato)" },
  { nombre: "Abuela", color: "var(--color-mustard)" },
  { nombre: "TikTok", color: "var(--color-ink)" },
  { nombre: "Un libro", color: "var(--color-hule)" },
  { nombre: "Mía", color: "var(--color-green)" },
];

export default function Diseno() {
  return (
    <main className="mx-auto flex w-full max-w-book flex-col gap-4 px-3.5 pb-8 pt-5">
      <header className="tin">
        <span className="label">Muestra de diseño</span>
        <h1 className="mt-2 font-display text-[32px] leading-[1.08] text-balance">Sistema de A ojo</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Todo lo que hay en esta página sale de los tokens de <code>globals.css</code>.
        </p>
      </header>

      <section className="paper p-[18px]" aria-labelledby="colores">
        <h2 id="colores" className="font-display text-2xl leading-[1.1]">Colores</h2>
        <ul className="mt-3 flex flex-col">
          {colores.map((c) => (
            <li key={c.nombre} className="flex items-center gap-3 border-t border-(--line) py-2.5">
              <span className={`size-9 shrink-0 rounded-sm ${c.clase}`} aria-hidden="true" />
              <span className="flex-1">
                <b className="font-semibold">{c.nombre}</b>
                <span className="block text-sm text-ink-soft">{c.uso}</span>
              </span>
              <span className="label tabular-nums">{c.hex}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="paper p-[18px]" aria-labelledby="tipos">
        <h2 id="tipos" className="font-display text-2xl leading-[1.1]">Tipografías</h2>
        <div className="mt-3 flex flex-col gap-4">
          <div>
            <span className="label">Young Serif · títulos</span>
            <p className="font-display text-[38px] leading-[1.05]">Fabada</p>
          </div>
          <div>
            <span className="label">Literata · cuerpo</span>
            <p className="font-medium">Compra judías blancas en la frutería de la plaza.</p>
            <p className="text-sm italic text-ink-soft">Mandada por WhatsApp el 11 de noviembre</p>
          </div>
          <div>
            <span className="label">Kalam · la voz de mamá</span>
            <p className="font-hand text-xl font-light text-pen">
              Un puñado de judías por persona, si es para dos pon 4 así os quedan.
            </p>
          </div>
          <div>
            <span className="label">Barlow Condensed · etiquetas</span>
            <p className="label mt-1 text-ink">Pág. 14 · De mamá · En casa</p>
          </div>
        </div>
      </section>

      <section className="paper p-[18px]" aria-labelledby="piezas">
        <h2 id="piezas" className="font-display text-2xl leading-[1.1]">Piezas</h2>

        <span className="label mt-4 block">Origen</span>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {origenes.map((o) => (
            <span key={o.nombre} className="tag" style={{ "--dot": o.color } as React.CSSProperties}>
              <i />
              {o.nombre}
            </span>
          ))}
        </div>

        <span className="label mt-5 block">Filtros</span>
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5">
          <button className="chip" aria-pressed="true">Todas</button>
          <button className="chip" aria-pressed="false">Mamá</button>
          <button className="chip" aria-pressed="false">Abuela</button>
          <button className="chip" aria-pressed="false">TikTok</button>
        </div>

        <span className="label mt-5 block">Botones</span>
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="btn btn-hot">Preguntar a mamá</button>
          <button className="btn">Guardar</button>
          <button className="btn btn-alt">Cerrar</button>
        </div>

        <span className="label mt-5 block">Como me la mandó</span>
        <div className="lined mt-2">
          <p>
            El compango (chorizo tocino y <mark className="duda">morcilla<sup>1</sup></mark> lo venden en el plaza y
            Ahorramás) cuéce el chorizo y tocino a parte.
          </p>
        </div>
        <p className="label mt-3">Lo subrayado en rojo es lo que no queda claro.</p>

        <span className="label mt-5 block">En casa o falta</span>
        <div className="mt-2 flex gap-2">
          <span className="rounded-sm border border-(--line) px-1.5 py-1 font-label text-[11px] font-semibold uppercase leading-none tracking-widest text-green">
            En casa
          </span>
          <span className="rounded-sm border border-tomato px-1.5 py-1 font-label text-[11px] font-semibold uppercase leading-none tracking-widest text-tomato">
            Falta
          </span>
        </div>
      </section>
    </main>
  );
}
