# Design

## Context

Ver `proposal.md` (Why). Los posts son filas en `posts`; la fuente vive en `src/content/posts/<slug>.md` y se publica con `scripts/publish-post.ts <slug>`, que valida el frontmatter (autor `slagosdev`, categoría existente), aborta si el slug ya existe, crea el post con `createPost()` (que deja un solo destacado) y dispara el rebuild. Los posts de Sonnet 5.5 y Gemini 4 Argon fijan el tono y la estructura: gancho corto, "lo que ganas tú", tablas, sección honesta de "dónde no gana" y cierre.

## Goals / Non-Goals

**Goals:**
- Congelar los hechos verificados y sus fuentes.
- Definir ángulo, estructura y metadatos del post.
- Publicar con el flujo existente, sin código nuevo.

**Non-Goals:**
- Cambios de esquema, componentes, estilos o scripts.
- Cubrir Claude Mythos 5.2 más allá de una mención (solo para organizaciones verificadas).

## Decisions

**Ángulo: "más capaz y más barato, pero revisa tu plan".** Es el primer Fable que baja de precio y sube en casi todo; la letra chica está en el acceso. El post responde arriba "¿lo tengo en mi plan?" con una tabla, y luego explica las novedades. Alternativa descartada: un post solo de benchmarks; no responde la pregunta del lector.

**Estructura:** gancho → resumen en 30 segundos → qué es Fable 5.2 → qué trae de nuevo (capacidades) → benchmarks (tabla atribuida a Anthropic) → precio → en qué planes está (tabla) → oferta de lanzamiento (con fechas) → novedades para desarrolladores → dónde no gana / letra chica → cierre con CTA.

**Hechos congelados:**
- Lanzamiento: 9-11-2026, "Introducing Claude Fable 5.2". Anthropic lo describe como su modelo más capaz para trabajo técnico. ID: `claude-fable-5-2`. Lo acompaña Claude Mythos 5.2, solo para organizaciones verificadas.
- Capacidades destacadas por Anthropic (en citas de clientes, atribuirlas así): ejecuciones autónomas más largas (trabajo de ingeniería ambiguo "durante días"), coordinación de cientos de subagentes, mejor autoverificación.
- Precio API: $8 entrada / $40 salida por millón de tokens (Fable 5.1: $10 / $50). Lectura de caché: $0.20 por millón. Fast mode: $16 / $80, hasta 2.5x más rápido; disponible también en Claude Code. Inferencia solo en EE. UU.: 1.1x.
- Especificaciones (documentación de la API): contexto de 1M tokens, salida máxima de 128K tokens. El thinking siempre está activo; la profundidad se controla con `effort` (`low` a `max`).
- Plataformas: Claude Platform, marketplaces, Amazon Web Services, Google Cloud y Microsoft Foundry.
- Benchmarks (reportados por Anthropic; Fable 5.2 / Fable 5.1 / Opus 5.5 / GPT-6 Astra / Gemini 4 Carbon):

  | Benchmark | Fable 5.2 | Fable 5.1 | Opus 5.5 | GPT-6 Astra | Gemini 4 Carbon |
  |---|---|---|---|---|---|
  | FrontierCode 2.0 | 49.1% | 32.4% | 45.5% | 42.8% | 41.1% |
  | FrontierSWE v2 | 69.9% | 56.3% | 62.3% | 65.5% | 61.2% |
  | AutomationBench | 51.4% | 31.4% | 42.5% | 41.4% | 53.9% |
  | Terminal-Bench-Science 0.1 | 74.6% | 52.6% | 58.7% | 68.1% | 64.8% |
  | OSWorld 2.1 (parcial) | 89.3% | 83.5% | 87.2% | 79.5% | 81.5% |
  | RoboDojo Sim | 64.9% | 27.6% | 39.4% | 29.8% | — |
  | AA-Briefcase (rúbrica) | 66.1% | 61.5% | 61.2% | 52.0% | 61.8% |
  | AA-Briefcase (Elo) | 1785 | 1669 | 1800 | 1569 | 1611 |
  | Remote Labor Index | 41.3% | 17.9% | 21.3% | 20.8% | — |
  | Humanity's Last Exam (con herramientas) | 74.2% | 65.6% | 67.7% | 57.2% | — |
  | Chartography (sin herramientas) | 73.4% | 44.8% | 64.4% | 71.0% | 72.5% |

  No lidera en AutomationBench (Gemini 4 Carbon, 53.9%) ni en AA-Briefcase Elo (Opus 5.5, 1800). Algunas cifras usan niveles de esfuerzo distintos (FrontierCode con `xhigh`, Remote Labor Index con `high`); indicarlo en una nota.
- Planes en claude.ai:

  | Plan / asiento | Acceso a Fable 5.2 |
  |---|---|
  | Free | No disponible |
  | Pro | Con créditos de uso (fuera de los límites del plan), salvo la oferta de lanzamiento |
  | Max y Ultra | Incluido, hasta el 50% de los límites semanales; después, créditos de uso u otro modelo |
  | Team, asiento premium | Incluido, hasta el 50% de los límites semanales |
  | Team, asiento estándar | Con créditos de uso, como Pro |
  | Enterprise por asientos, premium | Incluido, hasta el 50% de los límites semanales |
  | Enterprise por asientos, estándar | Con créditos de uso, si la organización los habilitó |
  | Enterprise por uso | Se cobra a tarifas estándar de la API |

  En Enterprise, Fable 5.2 queda apagado hasta que un admin lo habilita; siete días después del lanzamiento se agrega a todo rol que ya tenga algún modelo Fable habilitado, salvo que el admin lo excluya.
- Oferta de lanzamiento (del 9 al 16-11-2026, 11:59 p. m. PT):
  - Pro y asientos estándar de Team: una semana de todos los modelos Fable hasta el 50% del límite semanal sin costo extra, más un reinicio del límite de Fable.
  - Max, Ultra, asientos premium de Team y asientos premium de Enterprise por asientos (legacy): de uno a tres reinicios según antigüedad (menos de 6 meses: 1; de 6 a 12: 2; más de 12: 3). Vencen el 8-03-2027.
  - Excluidos: Free, asientos estándar de Enterprise legacy, Enterprise self-serve y por uso, y Enterprise HIPAA-ready (sin reinicios).
  - Los reinicios solo aplican a cuentas con facturación pagada activa antes del 9-11-2026 a las 10:00 a. m. PT. La oferta cubre Fable 5.2, 5.1 y 5.
- Claude Code: versión mínima 2.1.321 para usar Fable 5.2.
- Novedades para desarrolladores (documentación de la API; mantener en una sección corta): el thinking no se puede desactivar; `tool_choice` forzado (`any` / `tool`) devuelve error; el chequeo de edición del historial con thinking preservado aplica a todas las cuentas; computer use solo con `computer_toolset_20260801` (salvo Amazon Bedrock); fast mode en la Messages API sin beta.
- Letra chica: requiere retención de datos de 30 días (Enterprise Frontier Safeguards es la opción compatible con ZDR); consultas de ciberseguridad o biología marcadas por las salvaguardas pueden derivarse a modelos menos capaces.
- Fuentes:
  - Anthropic — https://www.anthropic.com/claude/fable
  - Claude Help Center, planes — https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan
  - Claude Help Center, oferta de lanzamiento — https://support.claude.com/en/articles/17506494-claude-fable-5-2-launch-offers
  - Documentación de la API (modelos y migración a Fable 5.2) — platform.claude.com

**Metadatos:** `slug: claude-fable-5-2-novedades-planes-precio`; `title`: "Claude Fable 5.2: qué trae de nuevo, cuánto cuesta y en qué planes está"; `category: modelos`; `pubDate: 2026-11-12`; `author: slagosdev`; `draft: false`; `featured: true`; `tags`: `Claude`, `Anthropic`, `Fable 5.2`, `LLM`.

## Risks / Trade-offs

- **La oferta vence el 16-11-2026** → Escribirla con fechas absolutas ("hasta el 16 de noviembre") y no como "esta semana".
- **Benchmarks del propio Anthropic** → Atribuirlos en el texto e incluir las filas donde no gana.
- **Contradicciones entre fuentes de terceros** (p. ej. "Enterprise con acceso total") → Usar solo las páginas de Anthropic y su centro de ayuda.
- **El destacado actual se desmarca** → Comportamiento esperado de `createPost()`; se revierte desde el admin.
- **Rollback** → Pasar a borrador o borrar el post desde el admin y volver a disparar el rebuild.
