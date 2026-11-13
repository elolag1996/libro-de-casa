# Libro de casa: brief para Cursor

## Qué es
Un libro de recetas familiar moderno. Recupera la humanidad de las recetas de madres y abuelas (hoy dispersas en WhatsApp, audios y vídeos de TikTok) y las convierte en páginas de un libro que se ordena solo, sin perder la voz original de quien las escribió.

Autora: diseñadora de producto, nivel no-code avanzado, **nueva en código y en GitHub**. Explica cada paso técnico en lenguaje sencillo y no des nada por sabido (git, ramas, variables de entorno, despliegue).

## Principios (no negociables)
1. **El original nunca se toca.** El texto tal como lo envió mamá (con faltas, orden y muletillas como "CHIMPUM") se guarda inmutable. Lo que Claude genera es una segunda capa al lado.
2. **No inventar.** Si la receta no dice cuándo entra la morcilla o cuánta agua es "cubrir", la IA lo detecta y lo convierte en una **duda**, nunca rellena un hueco por su cuenta.
3. **Las cantidades vagas se conservan** ("un puñado", "una punta de cucharita"). Se pueden sugerir equivalentes, nunca sustituir.
4. **Los consejos de quien la escribió se conservan con su voz** (p. ej. "las de fabada son carísimas", dónde comprar cada cosa).
5. Interfaz en **español**. Tono cálido y con personalidad, no de app fría de recetas.

## Funcionalidades (por fases; cada fase debe funcionar sola)

### Fase 1: el libro (MVP)
- Añadir receta pegando texto y eligiendo **origen**: Mamá, Abuela, TikTok, Un libro, Mía.
- Claude genera la capa ordenada: para cuántos, tiempos, ingredientes, pasos, notas de voz y **dudas**.
- Página de receta con dos pestañas: **"Como me la mandó"** (original, estilo libreta, con las dudas subrayadas) y **"Paso a paso"** (versión ordenada).
- **Dudas**: lista de preguntas abiertas; cada una acepta la respuesta de mamá, que queda como nota en la página.
- **"Preguntar a mamá"**: genera un mensaje de WhatsApp con las dudas (enlace `wa.me` y botón copiar).
- Índice del libro con números de página y filtro por origen.

### Fase 2: más entradas
- **Foto de una página** (libro impreso o libreta manuscrita): Claude lee la imagen (visión), guarda la foto y el texto transcrito como original.
- **Enlace de TikTok**: leer solo la descripción pública (oEmbed). Si ahí no está la receta, pedir una captura de pantalla. No procesar vídeo ni hacer scraping.

### Fase 3: despensa y "qué cocino hoy"
- **Foto de la nevera** → Claude propone productos y cantidades, agrupados como un almacén (Nevera, Verdura y fruta, Despensa seca). Los dudosos salen marcados y el usuario confirma o corrige.
- **Hoy**: cruza despensa y recetas ("Tienes 8 de 11 ingredientes"), prioriza las de mamá/abuela y muestra qué falta, con las notas de dónde comprarlo.
- En cada receta, ingredientes marcados "En casa" o "Falta".

### Fuera de alcance por ahora
Audio/voz, procesar vídeo, multiusuario y compartir libro en familia (Fase 4), recomendaciones genéricas, precios o supermercados, app nativa.

## Stack propuesto (confirma o propón alternativa y explica por qué)
- **Next.js** (App Router, TypeScript) + **Tailwind** o CSS propio con tokens.
- **Supabase**: Postgres, Auth y Storage (fotos).
- **API de Claude** (Anthropic SDK) desde rutas del servidor. Modelo en variable de entorno (`ANTHROPIC_MODEL`), con visión para las fotos. Salida estructurada en JSON validada con un esquema (por ejemplo Zod).
- Despliegue en Vercel. Repositorio en GitHub, ramas por funcionalidad y pull requests.
- **Claves** (Anthropic, Supabase) solo en `.env.local`, nunca en el repositorio ni en el chat. Incluir `.env.example` sin valores y `.gitignore` correcto.
- Diseñar **mobile-first** (se usará sobre todo desde el móvil).

## Modelo de datos (borrador)
- `recipes`: id, user_id, title, source_type (`mama|abuela|tiktok|libro|mia`), source_url, **original_text** (inmutable), original_image_path, servings, soak_note, cook_time_note, voice_notes (jsonb: citas con su voz y consejos de compra), page_number, created_at.
- `recipe_ingredients`: recipe_id, position, name, quantity_text (texto libre, "un puñado"), optional (bool), note.
- `recipe_steps`: recipe_id, position, text.
- `doubts`: id, recipe_id, question, anchor_text (fragmento subrayado del original), answer, answered_at.
- `pantry_items`: user_id, name, quantity_text, location (`nevera|verdura|despensa`), confirmed (bool), source (`foto|manual`).
- Row Level Security activada: cada usuario solo ve lo suyo.

## Tareas de IA (con reglas)
1. **structure_recipe(texto | imagen)** → JSON: título, personas, tiempos, ingredientes, pasos, notas de voz, dudas con su fragmento. Reglas: no inventar cantidades, conservar expresiones, marcar como duda todo lo ambiguo o ausente, devolver siempre el original sin modificar.
2. **detect_pantry(imagen)** → productos con nivel de confianza; los de baja confianza van como "¿Queso fresco?" para confirmar.
3. **tiktok_to_recipe(enlace)** → obtiene la descripción pública; si no hay receta, devuelve "necesito una captura".
4. **mom_message(dudas)** → mensaje de WhatsApp natural y breve con las preguntas numeradas.
5. **Cruce despensa/recetas**: lógica normal en código (nombres normalizados, coincidencia flexible); Claude solo normaliza nombres si hace falta.

## Dirección de diseño
Hay un prototipo clicable del diseño: `libro-de-casa.html` (adjunto). Úsalo como referencia visual y de flujos; las pantallas son **Libro, Hoy, Añadir, Despensa y Receta**.
- **Concepto**: libro de recetas sobre un mantel de cuadros azules (hule); las páginas son papel.
- **Colores**: azul hule `#2446B0`, papel `#FDFBF6`, tinta `#14203A`, bolígrafo azul `#1D3A98` (voz de mamá), rojo tomate `#D2402A` (dudas y acción principal), mostaza `#B8860B`, verde `#2F7A58`. Un solo tema claro, a propósito.
- **Tipografía**: Young Serif (títulos), Literata (cuerpo), Kalam (manuscrito de la receta original), Barlow Condensed (etiquetas en mayúsculas).
- **Detalles de libro**: índice con puntos y número de página, cabecera de página (origen y folio), pestañas de papel para alternar original y ordenada, dudas subrayadas con línea ondulada roja.
- Accesibilidad: foco visible, contraste legible, respetar `prefers-reduced-motion`.

## Privacidad
Son recetas y fotos de familia, no datos clínicos. No guardes nada innecesario, no compartas datos con terceros salvo la API de Claude para procesar lo que el usuario sube, y avisa de ello en la interfaz.

## Cómo quiero trabajar contigo
1. Antes de programar, propón el plan de la Fase 1 en pasos pequeños y espera mi visto bueno.
2. Cada paso: explícame qué has hecho y por qué, y cómo lo probaría yo.
3. Enséñame GitHub sobre la marcha: crea una rama por funcionalidad, haz commits con mensajes claros y abre pull requests, diciéndome cada comando antes de ejecutarlo.
4. Criterio de "hecha" de la Fase 1: pego el texto de la fabada, elijo "Mamá", obtengo las dos pestañas, 3 dudas, genero el mensaje para mamá, guardo una respuesta y la receta aparece en el índice con su página.
