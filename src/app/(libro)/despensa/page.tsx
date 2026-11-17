import type { Metadata } from "next";
import Hueco from "../hueco";

export const metadata: Metadata = { title: "Despensa" };

export default function DespensaPage() {
  return (
    <>
      <header className="tin">
        <span className="label">Tu almacén</span>
        <h1 className="mt-2 font-display text-[30px] leading-[1.08] text-balance">Despensa</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Harás una foto a la nevera y Claude lo ordenará por estantes. Lo dudoso lo confirmas tú.
        </p>
      </header>

      <Hueco titulo="Nevera, verdura y fruta, despensa seca" llega="Llega en la fase 3">
        Los tres estantes con lo que hay en casa, y los productos dudosos marcados con interrogación
        («¿Queso fresco?») hasta que los confirmes.
      </Hueco>
    </>
  );
}
