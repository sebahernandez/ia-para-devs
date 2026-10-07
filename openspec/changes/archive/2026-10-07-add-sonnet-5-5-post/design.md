# Design

## Context

Ver `proposal.md` (Why) para la motivación. El blog es Astro + Neon/Postgres (Drizzle). Los posts son filas en la tabla `posts` (`src/db/schema.ts`), no archivos Markdown. Se crean con `createPost(input: PostInput)` en `src/lib/admin-posts.ts`, que renderiza `content_md` → `content_html` con `renderMarkdown` e inserta en una transacción. La categoría `modelos` ya existe (`scripts/seed-categories.ts`). El estándar de idioma es la capability `post-content` (español neutral, "tú", términos técnicos en inglés). El despliegue post-guardado usa `triggerRebuild()` → Netlify (capability `deployment`).

## Goals / Non-Goals

**Goals:**
- Producir el `content_md` completo y los metadatos del post, listos para `createPost()`.
- Congelar los hechos verificados y sus fuentes para garantizar exactitud (requisito del spec).
- Definir el ángulo editorial que hace el post atractivo y original, no una nota de prensa.

**Non-Goals:**
- No se modifica esquema, componentes, estilos ni el pipeline de render.
- No se cubre el flujo de deploy en detalle (ya lo define `deployment`).
- No se añaden categorías ni tags nuevos al modelo (sí se pueden asignar tags existentes/nuevos vía `PostInput.tags`).

## Decisions

**Mecanismo de creación: `createPost()` / panel admin, no un archivo Markdown.**
Los posts viven en la DB; escribir un `.md` en `src/content/posts` no publicaría nada. Alternativa descartada: seed script dedicado — innecesario para un post único, el admin o una llamada puntual a `createPost` basta.

**Ángulo editorial: "casi Opus, misma factura".** El gancho central es el mejor argumento del lanzamiento para el lector: rendimiento cercano a Opus 5.5 sin subir el precio de Sonnet 5. Se estructura por beneficios (velocidad → agentes más baratos; costo → más iteraciones por dólar; escritura/diseño → mejores docs, slides y UI; seguridad → primer Sonnet con salvaguardas cyber). Alternativa descartada: cronología del anuncio — aburrida y menos útil.

**Estructura del cuerpo:** título con gancho → entrada breve que plantea el "casi Opus, mismo precio" → sección de beneficios con subtítulos → tabla comparativa Sonnet 5 vs Sonnet 5.5 (y referencia a Opus 5.5) → casos de uso concretos (bug fixing, docs/slides, agentes) → nota de seguridad y marca de agua → cierre con llamada a la acción.

**Hechos y fuentes (congelados):**
- Lanzamiento: 28-09-2026; segundo modelo de la familia Claude 5.5 tras Opus 5.5.
- Velocidad: >30% más rápido que Sonnet 5. Costo por tarea: hasta 30% menos (usa menos tokens).
- Precio (igual a Sonnet 5): $2/M entrada, $10/M salida, $0.20/M lectura de caché.
- Comparable a Opus 5.5 en varias evals a máximo esfuerzo; no avanza la frontera.
- Benchmark: Terminal-Bench 4.0 ≈ 70.6%. Primer Sonnet en pasar Pokémon Red solo con capturas.
- Seguridad: primer Sonnet con salvaguardas cyber tipo modelos superiores; marca de agua invisible en texto.
- Fuentes:
  - The New Stack — https://thenewstack.io/claude-sonnet-55-launch/
  - SiliconANGLE — https://siliconangle.com/2026/09/28/anthropic-debuts-claude-sonnet-5-5-running-30-faster-than-the-previous-generation-ai-model/
  - CNBC — https://www.cnbc.com/2026/09/28/anthropic-sonnet-5-5-launch.html
  - 9to5Mac — https://9to5mac.com/2026/09/28/anthropic-upgrades-claude-with-new-sonnet-5-5-model-details-here/
  - Contexto de Sonnet 5 (base de comparación) — https://www.anthropic.com/news/claude-sonnet-5

**Metadatos propuestos:** `slug: claude-sonnet-5-5-casi-opus-mismo-precio` (verificar unicidad con `slugExists`); `category_slug: modelos`; `pub_date: 2026-09-28`; `author: Sebacure` (default); `draft: false`; `featured` a criterio del autor; `tags`: `Claude`, `Anthropic`, `Sonnet 5.5`, `LLM`.

## Risks / Trade-offs

- **Cifras imprecisas o desactualizadas** → Solo se publican datos confirmados contra las fuentes listadas; lo no confirmable se omite (requisito del spec).
- **Sonar a nota de prensa** → El ángulo por beneficios y los casos de uso concretos evitan el tono corporativo.
- **Colisión de slug** → Verificar con `slugExists()` antes de crear; ajustar si es necesario.
- **Filtración de voseo/regionalismos** → Revisar contra `post-content` antes de marcar `draft: false`.

## Open Questions

- ¿Se marca el post como `featured`? Puede decidirse al publicar sin afectar specs ni tareas.
