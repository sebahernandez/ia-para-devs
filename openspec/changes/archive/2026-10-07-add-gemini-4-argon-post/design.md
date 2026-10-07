# Design

## Context

Ver `proposal.md` (Why). Los posts son filas en `posts` (Neon/Postgres), no archivos; se crean con `createPost()` en `src/lib/admin-posts.ts`, que renderiza `content_md` → `content_html` y, si `featured` es verdadero, quita el destacado a los demás posts en la misma transacción. El post de Sonnet 5.5 dejó el patrón a reutilizar: fuente en `src/content/posts/<slug>.md` con frontmatter, publicación con `scripts/publish-sonnet-post.ts` (slug fijo en el código) y video incrustado como `<iframe>` responsivo seguido de un `<small>` con el crédito.

## Goals / Non-Goals

**Goals:**
- Congelar los hechos verificados y sus fuentes.
- Definir estructura, ángulo y metadatos del post.
- Publicar reutilizando el flujo existente, sin código nuevo más allá de parametrizar el script.

**Non-Goals:**
- Cambios de esquema, componentes, estilos o pipeline de render.
- Un CLI de publicación general (validación, edición, despublicar): solo se parametriza el slug.

## Decisions

**Ángulo: "el mejor en los benchmarks, pero todavía no puedes usarlo".** El lector llega preguntando cómo usarlo y en qué plan está; la respuesta honesta es que hoy casi nadie puede. El post lo dice arriba y luego explica el orden de despliegue y cómo prepararse. Alternativa descartada: redactarlo como si ya estuviera disponible — sería falso y viola el spec.

**Estructura:** gancho → video + nota de autorización → qué es Argon → disponibilidad y planes (tabla: quién / cuándo) → precios → cómo usarlo (vías anunciadas, qué hacer hoy, para qué tareas conviene) → tabla de benchmarks → dónde no gana → cierre con CTA.

**Video:** mismo bloque HTML que el post de Sonnet 5.5, con `src="https://www.youtube.com/embed/MHr2L3N27Vw?start=14"` (el enlace entregado trae `t=14s`) y título "Google acaba de soltar su IA más POTENTE hasta ahora". Debajo: `<small>Video de [Vitoria Ferreira](https://www.youtube.com/@viviwsd), compartido con autorización de su creadora.</small>`.

**Publicación:** renombrar `scripts/publish-sonnet-post.ts` a `scripts/publish-post.ts` y leer el slug de `process.argv[2]` (error y salida si falta). Alternativa descartada: copiar el script por post — duplicación que crece con cada artículo. El script sigue siendo idempotente (aborta si el slug existe).

**Hechos congelados:**
- Anuncio: 30-09-2026, Google DeepMind, "Gemini 4 Argon: our next era of frontier intelligence".
- Acceso hoy: defensores de ciberseguridad verificados vía Fairwind Program (gobiernos, autoridades nacionales de ciberseguridad, infraestructura crítica, plataformas tecnológicas base). Google participa en un proceso voluntario de pruebas de seguridad con el gobierno de EE. UU.
- Siguiente: clientes de API de pago y suscriptores de Google AI Ultra "lo antes posible"; luego desarrolladores, empresas y consumidores. Sin fecha.
- Precio introductorio: $2 / $10 por millón de tokens (entrada / salida); entrada en caché con 95% de descuento ($0.10). Después: $4 / $20. Duración del periodo introductorio no definida.
- Límite de salida: 1 millón de tokens (antes 64K).
- No publicado: ventana de contexto, ID del modelo, model card, disponibilidad en AI Pro o plan gratuito.
- Benchmarks (reportados por Google; Argon / GPT-6 Astra / Claude Opus 5.5):

  | Benchmark | Argon | GPT-6 Astra | Opus 5.5 |
  |---|---|---|---|
  | DeepSWE v1.1 | 77.9% | 74.1% | 74.2% |
  | AutomationBench | 51.3% | 41.4% | 42.5% |
  | GraphWalks | 84.2% | 71.8% | 66.8% |
  | Vals Finance Agent v2 | 65.4% | 53.5% | 58.6% |
  | Harvey Legal Agent | 19.6% | 5.4% | 3.8% |
  | LVBench | 91.7% | 87.5% | 83.7% |
  | CWE-bench v1 | 68% | 68% | 67% |
  | FrontierSWE v2 | 55.0% | 65.5% | — |
  | Terminal-Bench Science 0.1 | 57.6% | 68.1% | — |
  | Terminal-Bench 4.0 | 57.4% | — | 66.4% |
  | PostTrainBench | 45.3% | — | 49.3% |
  | Gray Swan (inyección indirecta, menor es mejor) | 0.7% | 8.5% | 1.0% |

  Resumen: lidera 12 de 18, empata 1 (CWE-bench v1); GPT-6 Astra lidera 3 y Opus 5.5 lidera 2.
- Fuentes:
  - VentureBeat — https://venturebeat.com/technology/google-unveils-gemini-4-argon-retaking-benchmark-lead-over-openai-and-anthropic-but-in-limited-release
  - CNBC — https://www.cnbc.com/2026/10/01/google-gemini-4-arrives-as-wall-street-shifts-to-personal-agents.html
  - Digital Applied — https://www.digitalapplied.com/blog/gemini-4-argon-price-benchmarks-availability
  - OfficeChai — https://officechai.com/ai/gemini-4-argon-benchmarks/

**Metadatos:** `slug: gemini-4-argon-como-usarlo-planes-benchmarks`; `category: modelos`; `pubDate: 2026-10-07`; `author: Sebacure`; `draft: false`; `featured: true`; `tags`: `Gemini`, `Google`, `Gemini 4 Argon`, `LLM`.

## Risks / Trade-offs

- **La disponibilidad cambia rápido** → Volver a consultar las fuentes justo antes de publicar; si Google abrió el acceso, actualizar la sección de planes y `design.md`.
- **Benchmarks reportados por el propio Google** → Atribuirlos en el texto e incluir las filas donde pierde.
- **Comparar con cifras de otros posts** (p. ej. Terminal-Bench 4.0 del post de Sonnet 5.5) → No cruzar tablas de fuentes distintas; pueden usar configuraciones diferentes.
- **El destacado actual se desmarca** → Comportamiento esperado de `createPost()`; se revierte desde el admin.
- **`?start=14` puede no ser intencional** → Si el `t=14s` venía solo por copiar el enlace, quitar el parámetro es un cambio de una línea.
- **Rollback** → Borrar o pasar a borrador el post desde el admin y volver a disparar el rebuild.
