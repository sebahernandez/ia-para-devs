# Design

## Context

Ver `proposal.md`. Las tarjetas (`src/components/PostCard.astro`) y la página del post (`src/layouts/PostLayout.astro`) reciben un `PostSummary` / `Post` con `title` y `category.slug`; con eso basta para elegir el logo. La tarjeta ya es `relative` y su enlace cubre toda la tarjeta con `before:absolute before:inset-0`. El tema se controla con la clase `light` en `<html>` (oscuro por defecto). La lógica de dominio vive en `src/features/posts/` y las pruebas en `tests/features.test.ts` con `node:test`.

## Goals / Non-Goals

**Goals:**
- Elegir el logo con una función pura y probada, a partir del título y la categoría.
- Mostrarlo en tarjeta y cabecera sin tapar contenido y sin romper el clic de la tarjeta.
- Servir los SVG desde el propio sitio.

**Non-Goals:**
- Campo nuevo en la base de datos o en el admin para elegir el logo.
- Logos en otras categorías, en el RSS o en imágenes Open Graph.
- Componente genérico de logos o sistema de temas nuevo.

## Decisions

**Deducir el logo del título, no guardarlo.** Un mapa en `src/features/posts/model-logo.ts` y una función `getModelLogo({ title, category })` que devuelve `{ name, light, dark } | null`. Busca cada alias en el título (sin distinguir mayúsculas, como palabra completa) y elige el de menor posición. Devuelve `null` si la categoría no es `modelos` o no hay coincidencia. Alternativa descartada: una columna `model` en `posts`, que exige migración, cambio en admin y en el script de publicación, para un dato que el título ya trae.

**Mapa inicial** (alias → archivo de svgl):

| Logo | Alias | Archivo(s) en svgl |
|---|---|---|
| Claude | claude, fable, opus, sonnet, haiku, mythos | `claude-ai-icon.svg` |
| Gemini | gemini | `gemini.svg` |
| Google | gemma | `google.svg` (svgl no tiene logo de Gemma; decisión del usuario) |
| OpenAI | gpt, chatgpt, openai | `openai.svg` (claro) / `openai_dark.svg` (oscuro) |
| Mistral | mistral | `mistral-ai_logo.svg` |
| DeepSeek | deepseek | `deepseek.svg` |
| Grok | grok | `grok-light.svg` / `grok-dark.svg` |
| Meta | llama | `meta.svg` |
| Qwen | qwen | `qwen_light.svg` / `qwen_dark.svg` |

Phi (Microsoft) queda sin logo a propósito: svgl no tiene logo de Phi y el usuario decidió no usar el de Microsoft.

URL base: `https://svgl.app/library/<archivo>` (consultado vía `https://api.svgl.app?search=<nombre>`). "GPT" se busca como prefijo de palabra para cubrir "GPT-6". "Meta" no es alias porque es una palabra común en español ("la meta"); Llama sí lo es. Si `light` y `dark` son el mismo archivo, el logo tiene una sola variante.

**Archivos estáticos en `public/logos/`.** Se descargan una vez con `curl` y se commitean. Alternativa descartada: enlazar a svgl.app en caliente, porque agrega una dependencia externa a cada carga de página y viola el spec.

**Variantes por tema con dos `<img>` y CSS.** Para logos con dos variantes: un `<img>` con la variante para fondo oscuro, visible por defecto, y otro para fondo claro, visible bajo `html.light`. En svgl, `light` es el logo para fondo claro y `dark` para fondo oscuro. Alternativa descartada: incrustar el SVG inline y recolorear con `currentColor`, porque los logos de marca tienen colores propios.

**Ubicación y accesibilidad.** En la tarjeta: `absolute top-6 right-6` (alineado con el `p-6`; `md:top-8 md:right-8` en la destacada), tamaño 28 px, `pointer-events-none` para que el clic llegue al enlace, `alt=""` y `aria-hidden="true"`. La fila de categoría y fecha y el título reciben `pr-10` solo cuando hay logo, para que el texto no quede debajo. En la cabecera del post: `header` pasa a `relative`, logo de 40 px arriba a la derecha y `pr-14` en la fila de categoría y en el `h1` cuando hay logo. Los `<img>` llevan `width`/`height` para no mover el layout al cargar.

## Risks / Trade-offs

- **Falsos positivos por palabras comunes** (p. ej. "opus" o "haiku" fuera de contexto) → La regla solo aplica en `modelos` y se buscan palabras completas; un caso real se corrige quitando el alias.
- **El título no nombra al modelo principal** → No se muestra logo; es preferible a mostrar uno equivocado. Si se vuelve común, se agrega un campo explícito en otro cambio.
- **Contraste de logos de una sola variante en algún tema** → Revisar los ocho logos en ambos temas; si uno no contrasta, buscar su otra variante en svgl o poner un fondo sutil detrás.
- **Cambios en svgl** → Los SVG quedan versionados en el repo; no hay dependencia en tiempo de ejecución.
- **Rollback** → Revertir el commit; no hay datos que migrar.
