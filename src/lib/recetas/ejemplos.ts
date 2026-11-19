/**
 * Casos de prueba. La fabada es el ejemplo canónico del proyecto: texto real
 * de WhatsApp, con sus faltas ("hierba", "apades", "judias") y su CHIMPUM.
 * Debe producir 12 ingredientes, 8 pasos y 3 dudas.
 */
export const FABADA = `Compra judías blancas en la frutería del plaza, las de fabada son carísimas.
Pones la noche anterior a remojo con agua fría y un puñado de sal (un puñado de judias por persona, si es para dos pon 4 así os quedan)
Pon a cocer cubriéndolas de agua fria que no hierba fuerte que si no se despellejan):tira el agua cuando estén calientes. Vuelve a poner agua fría con las judias, una cabeza de ajo, una cebolla pequeña y una hoja de laurel.
El compango (chorizo tocino y morcilla lo venden en el plaza y Ahorramás en un paquete (frente a charcutería) cuéce el chorizo y tocino a parte para desengrasar. una zanahoria pelada, una patata pequeña, (media hora antes de hacer el sofrito) luego se lo das a Tro, un trocito de jamón (si tienes).
Lo pones a cocer 2 horas o 2 y media. Cuando quede media hora echas la sal y haces sofrito con un trozo de cebolla. Lo apartas del fuego y echa una punta de una cucharita de pimentón. Le echas un poco caldo de las judías lo apades a la cacerola y CHIMPUM.
A comer`;

/**
 * Incompleta a propósito: sin cantidades, sin tiempos y con un ingrediente
 * (el perejil) que se compra pero no se usa nunca. Si el modelo devuelve esto
 * sin dudas, el prompt está fallando.
 */
export const INCOMPLETA = `Croquetas como las de la abuela.
Haces una bechamel espesa con el jamón picado muy fino. Compra también perejil.
La dejas enfriar y luego las fríes.`;
