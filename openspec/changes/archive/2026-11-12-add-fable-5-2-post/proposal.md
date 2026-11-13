# Proposal

## Why

Anthropic lanzó Claude Fable 5.2 el 9 de noviembre de 2026: su modelo más capaz para trabajo técnico, con mejoras grandes sobre Fable 5.1 en casi todos los benchmarks que publicó y un precio más bajo ($8 / $40 por millón de tokens, antes $10 / $50). La pregunta que más se repite es "¿en qué plan lo tengo?", y la respuesta es enredada: depende del plan, del tipo de asiento y de una oferta de lanzamiento que vence el 16 de noviembre. El blog puede dar esa respuesta clara en español mientras el tema está vigente.

## What Changes

- Se agrega un post nuevo en la categoría `modelos` sobre el lanzamiento de Claude Fable 5.2 que cubre: qué es, qué trae de nuevo (capacidades, benchmarks y precio frente a Fable 5.1), novedades para desarrolladores, en qué planes está disponible y la oferta de lanzamiento.
- El post incluye una tabla de disponibilidad por plan (Free, Pro, Max, Ultra, Team, Enterprise) y una tabla de benchmarks atribuida a Anthropic, con las filas donde Fable 5.2 no lidera.
- **Supuesto**: el post se publica con `featured: true` y `draft: false`, como el último lanzamiento. Efecto colateral: el post de Gemini 4 Argon deja de estar destacado. Si se prefiere mantener a Argon, basta con `featured: false`.
- **Supuesto**: no se incrusta video, porque no se entregó ninguno con autorización.
- Se publica con el script existente `scripts/publish-post.ts <slug>`; no hay código nuevo.

## Capabilities

### New Capabilities

Ninguna. Es un cambio de contenido: `skip_specs: true`.

### Modified Capabilities

Ninguna. Aplican sin cambios `post-content` (español neutral, datos verificados, metadatos), `post-publishing` (publicación por slug, autor `slagosdev`, un solo destacado) y `deployment`.

## Impact

- **Contenido / datos**: una fila nueva en `posts` (Neon/Postgres) con `featured = true`; el destacado actual pasa a `false` en la misma transacción.
- **Archivos**: `src/content/posts/claude-fable-5-2-novedades-planes-precio.md`.
- **Publicación**: rebuild de Netlify según `deployment`; requiere aprobación explícita.
- **Sin cambios** de esquema, componentes, scripts ni APIs.
- **Vigencia**: la oferta de lanzamiento vence el 16-11-2026 y el ajuste de Enterprise ocurre siete días después del lanzamiento; el texto debe fecharlos para no quedar desactualizado.
