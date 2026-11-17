/**
 * Prueba manual del paso 6. Se ejecuta con:
 *   node --env-file=.env.local scripts/probar-receta.ts
 *
 * Gasta dinero de verdad: cada ejecución son dos llamadas a la API.
 */
import { structureRecipe } from "../src/lib/recetas/structure-recipe.ts";
import { FABADA, INCOMPLETA } from "../src/lib/recetas/ejemplos.ts";

function pintar(titulo: string, receta: Awaited<ReturnType<typeof structureRecipe>>) {
  console.log(`\n${"=".repeat(70)}\n${titulo}\n${"=".repeat(70)}`);
  console.log(`\nTítulo: ${receta.titulo}`);
  console.log(`Personas: ${receta.personas ?? "— (no lo dice)"}`);
  console.log(`Remojo: ${receta.remojo ?? "— (no lo dice)"}`);
  console.log(`Cocción: ${receta.tiempo_coccion ?? "— (no lo dice)"}`);

  console.log(`\nINGREDIENTES (${receta.ingredientes.length})`);
  for (const i of receta.ingredientes) {
    const cantidad = i.cantidad_texto ?? "sin cantidad";
    console.log(`  · ${i.nombre} — ${cantidad}${i.opcional ? " (opcional)" : ""}`);
  }

  console.log(`\nPASOS (${receta.pasos.length})`);
  receta.pasos.forEach((p, n) => console.log(`  ${n + 1}. ${p.texto}`));

  console.log(`\nNOTAS DE VOZ (${receta.notas_de_voz.length})`);
  for (const n of receta.notas_de_voz) {
    console.log(`  · [${n.tipo}] «${n.cita}»`);
  }

  console.log(`\nDUDAS (${receta.dudas.length})`);
  receta.dudas.forEach((d, n) => {
    console.log(`  ${n + 1}. ${d.pregunta}`);
    console.log(`     subraya: «${d.fragmento || "(no está escrito)"}»`);
  });
}

/** Comprueba que las citas y los fragmentos existen tal cual en el original. */
function comprobarLiteralidad(original: string, receta: Awaited<ReturnType<typeof structureRecipe>>) {
  const fallos: string[] = [];
  for (const n of receta.notas_de_voz) {
    if (!original.includes(n.cita)) fallos.push(`nota de voz inventada o retocada: «${n.cita}»`);
  }
  for (const d of receta.dudas) {
    if (d.fragmento && !original.includes(d.fragmento)) {
      fallos.push(`fragmento que no está en el original: «${d.fragmento}»`);
    }
  }
  for (const i of receta.ingredientes) {
    if (i.cantidad_texto && /^\s*\d+\s*(g|gr|gramos|kg|ml|l)\b/i.test(i.cantidad_texto)) {
      fallos.push(`cantidad convertida a peso: ${i.nombre} → «${i.cantidad_texto}»`);
    }
  }
  console.log(`\nLITERALIDAD: ${fallos.length === 0 ? "bien, nada inventado" : "FALLOS"}`);
  fallos.forEach((f) => console.log(`  ✗ ${f}`));
  return fallos.length === 0;
}

const fabada = await structureRecipe(FABADA);
pintar("LA FABADA DE MAMÁ (caso canónico: 12 ingredientes, 8 pasos, 3 dudas)", fabada);
const limpia = comprobarLiteralidad(FABADA, fabada);

const incompleta = await structureRecipe(INCOMPLETA);
pintar("RECETA INCOMPLETA A PROPÓSITO (sin cantidades, sin tiempos, perejil huérfano)", incompleta);
const limpia2 = comprobarLiteralidad(INCOMPLETA, incompleta);

console.log(`\n${"=".repeat(70)}`);
console.log(`Fabada: ${fabada.ingredientes.length} ingredientes, ${fabada.pasos.length} pasos, ${fabada.dudas.length} dudas`);
console.log(`Incompleta: ${incompleta.dudas.length} dudas (si son 0, el prompt falla)`);
if (!limpia || !limpia2) process.exitCode = 1;
