# Libro de casa: contexto del proyecto

> Documento vivo. Lo lee Claude al empezar cada sesión y lo lee la autora cuando vuelve al proyecto. Si una decisión cambia, se cambia aquí en el mismo PR.
> Nombre del producto: **A ojo** (descriptor: "tu libro de recetas de casa"). Nombre de trabajo del repo y de esta documentación: **Libro de casa**.

## 1. Qué es

Un libro de recetas familiar moderno. Recupera la humanidad de las recetas de madres y abuelas, hoy dispersas en WhatsApp, audios y vídeos de TikTok, y las convierte en páginas de un libro que se ordena solo **sin perder la voz de quien las escribió**.

Lo perdido que recupera: el cuaderno de recetas de casa, con sus faltas, sus "un puñado" y su "CHIMPUM".
El problema real que resuelve: las recetas viven en sitios que nunca recuerdas, mal escritas o ambiguas, y no sabes qué cocinar con lo que tienes.

## 2. Quién es la autora y cómo trabajamos

- Diseñadora de producto y especialista en automatización e IA no-code (trabaja en una CRO de ensayos clínicos). **Nueva en código y en GitHub.**
- Habla español: toda la comunicación y toda la interfaz, en español.
- Claude actúa como su ingeniero personal: explica cada paso en lenguaje sencillo, dice cada comando antes de ejecutarlo y enseña GitHub sobre la marcha.
- Una rama y un pull request por paso. Nunca hay un paso en el que la app esté rota.
- Las claves (Anthropic, Supabase) nunca van al repositorio ni al chat.

## 3. Principios y qué significan en código

| Principio | Decisión de código |
|---|---|
| El original nunca se toca | `recipes.original_text` se escribe una vez. Sin ruta de actualización; en la base de datos, sin permiso `UPDATE` sobre esa columna (trigger o política). La capa de Claude vive en otras tablas |
| La IA no inventa | El esquema de salida obliga a devolver `doubts` para todo lo ambiguo o ausente. El prompt prohíbe rellenar huecos. Si falta un dato, no hay valor por defecto: hay duda |
| Cantidades vagas se conservan | `quantity_text` es texto libre ("un puñado"), nunca un número. Se pueden mostrar equivalentes aparte, nunca sustituir |
| Se conserva la voz de quien escribe | `voice_notes` guarda citas literales ("las de fabada son carísimas") y consejos de compra, y se muestran con estilo propio |
| Interfaz cálida y en español | Textos de interfaz centralizados, tono con personalidad, nada de app fría de recetas |

## 4. Producto por fases (cada fase funciona sola)

**Fase 1: el libro (MVP)**
- Añadir receta pegando texto y eligiendo origen: Mamá, Abuela, TikTok, Un libro, Mía.
- Claude genera la capa ordenada: personas, tiempos, ingredientes, pasos, notas de voz y dudas.
- Página de receta con dos pestañas: **"Como me la mandó"** (original en estilo libreta, dudas subrayadas) y **"Paso a paso"**.
- Dudas: cada una acepta la respuesta de mamá, que queda como nota en la página.
- **"Preguntar a mamá"**: mensaje de WhatsApp con las dudas numeradas (enlace `wa.me` y botón copiar).
- Índice del libro con puntos, número de página y filtro por origen.

**Fase 2: más entradas**
- Foto de una página (impresa o manuscrita): visión de Claude; se guarda la foto y la transcripción como original.
- Enlace de TikTok: solo la descripción pública (oEmbed). Si la receta no está ahí, se pide una captura. Sin procesar vídeo ni scraping.

**Fase 3: despensa y "Hoy"**
- Foto de la nevera → productos y cantidades agrupados como almacén (Nevera, Verdura y fruta, Despensa seca). Los dudosos salen marcados ("¿Queso fresco?") y la usuaria confirma.
- "Hoy": cruza despensa y recetas ("Tienes 8 de 11"), prioriza las de mamá/abuela, muestra qué falta y dónde comprarlo según las notas.
- En cada receta, ingredientes "En casa" o "Falta".

**Fuera de alcance:** audio/voz (descartado a propósito), procesar vídeo, multiusuario y compartir libro en familia (Fase 4), recomendaciones genéricas, precios y supermercados, app nativa. La inspiración de organizar contenido guardado tipo Albo queda aparcada para más adelante.

## 5. Stack y por qué

| Pieza | Elección | Alternativa descartada y motivo |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | SPA pura: la clave de Claude debe vivir en servidor |
| Estilos | Tailwind con tokens como variables CSS | Colores a mano en componentes: acaban siendo cinco azules distintos |
| Datos y login | Supabase (Postgres, Auth, Storage) con RLS | Backend propio: más piezas sin aportar valor ahora |
| IA | API de Claude (SDK de Anthropic) desde rutas de servidor; modelo en `ANTHROPIC_MODEL`; salida JSON validada con Zod | Llamar desde el navegador: expone la clave |
| Despliegue | Vercel desde el día 1 (app vacía primero) | Desplegar al final: convierte "publicar" en un evento |
| Gestor | npm | pnpm: una herramienta menos que aprender |
| Login | Enlace mágico por email desde el paso 1 | Añadirlo después: obliga a reescribir consultas y migrar datos |

Mobile-first: se usará sobre todo desde el móvil.

## 6. Modelo de datos (borrador)

- `recipes`: id, user_id, title, source_type (`mama|abuela|tiktok|libro|mia`), source_url, **original_text** (inmutable), original_image_path, servings, soak_note, cook_time_note, voice_notes (jsonb), page_number, created_at
- `recipe_ingredients`: recipe_id, position, name, quantity_text, optional, note
- `recipe_steps`: recipe_id, position, text
- `doubts`: id, recipe_id, question, anchor_text (fragmento subrayado del original), answer, answered_at
- `pantry_items`: user_id, name, quantity_text, location (`nevera|verdura|despensa`), confirmed, source (`foto|manual`)
- RLS activada en todas: cada usuario solo ve lo suyo.

## 7. Tareas de IA y sus reglas

1. **structure_recipe(texto | imagen)** → JSON con título, personas, tiempos, ingredientes, pasos, notas de voz y dudas con su fragmento. No inventar cantidades, conservar expresiones, toda ambigüedad es duda, devolver el original intacto.
2. **detect_pantry(imagen)** → productos con nivel de confianza; los de baja confianza van como "¿Queso fresco?".
3. **tiktok_to_recipe(enlace)** → descripción pública; si no hay receta, "necesito una captura".
4. **mom_message(dudas)** → mensaje de WhatsApp natural y breve con preguntas numeradas.
5. **Cruce despensa/recetas** → lógica normal en código (nombres normalizados, coincidencia flexible); Claude solo normaliza nombres si hace falta.

## 8. Diseño

Referencia visual y de flujos: [`docs/prototipo/libro-de-casa.html`](prototipo/libro-de-casa.html) (clicable, 5 pantallas: Libro, Hoy, Añadir, Despensa, Receta).

- **Concepto:** libro de recetas sobre un mantel de cuadros azules (hule); las páginas son papel.
- **Colores:** hule `#2446B0`, papel `#FDFBF6`, tinta `#14203A`, bolígrafo azul `#1D3A98` (voz de mamá), tomate `#D2402A` (dudas y acción principal), mostaza `#B8860B`, verde `#2F7A58`. Un solo tema claro, a propósito.
- **Tipografía:** Young Serif (títulos), Literata (cuerpo), Kalam (manuscrito del original), Barlow Condensed (etiquetas en mayúsculas).
- **Detalles de libro:** índice con puntos y folio, cabecera de página con origen y número, pestañas de papel, dudas con subrayado ondulado rojo.
- **Accesibilidad:** foco visible, contraste legible, respetar `prefers-reduced-motion`.
- El prototipo se hizo sin revisión visual renderizada: puede tener defectos de maquetación. Es referencia, no especificación píxel a píxel.

## 9. Privacidad

Son recetas y fotos de familia, no datos clínicos. No guardar nada innecesario. Único tercero: la API de Claude, para procesar lo que la usuaria sube, y la interfaz lo avisa.

## 10. Ejemplo canónico

La **fabada de mamá** (texto de WhatsApp real, con faltas como "cuéce" y "apades", y "CHIMPUM"). Es el caso de prueba de todo el producto y está en el prototipo. Debe producir 12 ingredientes, 8 pasos y 3 dudas:
1. ¿Cuándo entra la morcilla?
2. ¿Quién es "Tro" y qué se le da?
3. ¿Cuánto rato cuecen las judías la primera vez, antes de tirar el agua?

## 11. Criterio de "Fase 1 hecha"

Pego el texto de la fabada, elijo "Mamá", obtengo las dos pestañas con 3 dudas, genero el mensaje para mamá, guardo una respuesta y la receta aparece en el índice con su número de página.

## 12. Plan de Fase 1 (un PR por paso)

| # | Paso | Cómo se prueba |
|---|---|---|
| 1 | Cuentas y entorno (GitHub, Supabase, Anthropic, Vercel; `gh` autenticado) | `gh auth status` |
| 2 | Repo + Next.js + primer deploy | URL de Vercel abierta en el móvil |
| 3 | Tokens de diseño y tipografías | Pantalla de muestra con colores y tamaños |
| 4 | Navegación y maquetas vacías de las 5 pantallas | Navegar con el pulgar |
| 5 | Supabase: tablas, RLS y login con enlace mágico | Leer sin sesión es denegado |
| 6 | `structure_recipe` con Zod | Fabada y un texto incompleto a propósito |
| 7 | Flujo "Añadir receta" | La fabada aparece en Supabase |
| 8 | Página de receta con dos pestañas | Teclado y lector de pantalla |
| 9 | Dudas: responder | La respuesta persiste al recargar |
| 10 | "Preguntar a mamá" | Te lo mandas a ti misma |
| 11 | Índice del libro + aviso de privacidad | Criterio de "hecha" completo |

## 13. Decisiones pendientes

- [x] Nombre comercial: **A ojo** (casi definitivo; falta validar dominio y App Store). El repo puede llamarse `libro-de-casa` mientras tanto.
- [x] Plan de Fase 1: aprobado (2026-11-13).
- [x] Login con enlace mágico desde el paso 1: aprobado.
- [ ] Modelo de Claude a usar en `ANTHROPIC_MODEL`.
- [ ] Validar el nombre: decirlo por teléfono, buscarlo en App Store y Google con "recetas", dominio `.app` o `.es`.

## 14. Glosario

- **Capa original / capa ordenada:** texto tal cual lo mandó mamá / versión estructurada por Claude.
- **Duda:** pregunta abierta que la receta no resuelve; nunca se rellena por la IA.
- **RLS (Row Level Security):** regla de la base de datos que impide que un usuario vea datos de otro.
- **Walking skeleton:** versión mínima desplegada de punta a punta desde el primer día.
- **PR (pull request):** propuesta de cambio en GitHub que se revisa antes de unirse a la rama principal.
