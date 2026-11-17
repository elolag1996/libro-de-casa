import type { Metadata } from "next";
import Hueco from "../hueco";

export const metadata: Metadata = { title: "Hoy" };

export default function HoyPage() {
  return (
    <>
      <header className="tin">
        <span className="label">Con lo que hay en tu despensa</span>
        <h1 className="mt-2 font-display text-[30px] leading-[1.08] text-balance">
          ¿Qué cocino hoy?
        </h1>
      </header>

      <Hueco titulo="Recetas que puedes hacer ya" llega="Llega en la fase 3">
        El cruce entre tu despensa y tu libro: «tienes 8 de 11», qué falta y dónde comprarlo
        según las notas de mamá. Primero tiene que haber recetas y despensa.
      </Hueco>
    </>
  );
}
