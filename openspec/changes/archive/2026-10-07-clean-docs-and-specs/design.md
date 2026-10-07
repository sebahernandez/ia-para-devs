# Design

## Context

Ver `proposal.md` (Why). Estado observado en el repositorio:

- **Markdown fuera de `openspec/` y `.claude/`**: `DEPLOY.md` (guía operativa, coherente con la spec `deployment`), `categories.md` (explica `src/utils/categories.ts`, que tiene 11 líneas; nada lo referencia salvo un "p. ej." en una tarea archivada) y los dos archivos fuente en `src/content/posts/`. No hay `README.md` ni `CLAUDE.md`.
- **Specs principales**: `deployment`, `post-content` y `posts/gemini-4-argon-launch`. Las tres pasan `openspec validate --all --strict`.
- **Cambios**: `add-sonnet-5-5-post` está completo (10/10) y sin archivar; su delta crearía `posts/sonnet-5-5-launch` al archivarse.
- **Publicación**: `scripts/publish-post.ts <slug>` lee `src/content/posts/<slug>.md`, aborta si el slug existe, crea el post y dispara el rebuild. El guardado quita el destacado a los demás posts en la misma transacción y el sitio público filtra los borradores.
- `.claude/` (comandos, skills, agentes) lo generan las herramientas y no entra en la limpieza.

## Goals / Non-Goals

**Goals:**

- Que `openspec/specs/` contenga solo capacidades duraderas: `deployment`, `post-content`, `post-publishing`.
- Que las reglas reutilizables de las specs por post no se pierdan al eliminarlas.
- Que los próximos cambios de tipo "nuevo post" no vuelvan a crear una spec por artículo.

**Non-Goals:**

- Especificar el panel admin, la autenticación o las páginas públicas (alcance descartado por el usuario).
- Cambiar código, scripts o contenido publicado.
- Limpiar scripts de migración antiguos (`scripts/migrate-posts.ts`, `scripts/verify-migration.ts`), aunque uno conserva un comentario que apunta a un `src/content.config.ts` que ya no existe.
- Crear un `README.md`.

## Decisions

**1. Eliminar `openspec/specs/posts/` directamente, sin delta `REMOVED`.**
Un delta que quite los seis requisitos dejaría una spec `posts/gemini-4-argon-launch` vacía en lugar de borrarla. La carpeta además no está versionada en git, así que borrarla no pierde historial: el contenido íntegro sigue en `openspec/changes/archive/2026-10-07-add-gemini-4-argon-post/specs/`.

**2. Archivar `add-sonnet-5-5-post` con `--skip-specs`.**
Evita que el archivado cree `posts/sonnet-5-5-launch`. Su delta se conserva dentro del cambio archivado. Alternativa descartada: sincronizar y borrar después, que es el mismo resultado con un paso más.

**3. Qué se generaliza y a dónde.**

| Regla en las specs por post | Destino |
| --- | --- |
| Datos coinciden con las fuentes; lo no confirmable se omite | `post-content` |
| Cifras del fabricante atribuidas | `post-content` |
| Video incrustado con crédito y nota de autorización | `post-content` |
| Categoría, `description`, fecha, tags | `post-content` |
| Slug único, un solo destacado, `draft`/`featured` | `post-publishing` |
| Hechos concretos de cada lanzamiento (precios, benchmarks, fechas) | No se generalizan; quedan en el archivo |
| Estilo del post de Sonnet (centrado en beneficios, escaneable, cierre con CTA) | No se promueve (ver Open Questions) |

**4. `post-publishing` describe el comportamiento actual, no uno nuevo.**
Cada requisito corresponde a algo observado en `scripts/publish-post.ts`, `src/lib/admin-posts.ts` y `src/lib/posts.ts`. El escenario de frontmatter incompleto o categoría inexistente se apoya en las restricciones `NOT NULL` y la clave foránea de la tabla `posts`; no se ejecutó contra la base de datos para confirmarlo.

**5. `DEPLOY.md` se queda.**
La spec dice qué debe cumplirse; `DEPLOY.md` tiene el comando exacto. Se le agrega una sección corta "Publicar un post" con `npx tsx scripts/publish-post.ts <slug>`. Alternativa descartada: moverlo a un `README.md` o `CLAUDE.md` nuevo, que es crear archivos que nadie pidió.

**6. Contenido de `openspec/config.yaml`.**

```yaml
schema: spec-driven

context: |
  Blog de IA en español: Astro 5 + Tailwind, desplegado en Netlify.
  Los posts viven en Neon/Postgres (Drizzle); el sitio se genera desde la base de datos en cada build.
  Hay un panel admin en /admin para crear y editar posts.
  Los posts publicados por script tienen su fuente en src/content/posts/<slug>.md
  y se publican con scripts/publish-post.ts (ver spec post-publishing).
  Contenido y artefactos de OpenSpec en español neutral (ver spec post-content).
  Deploy solo con aprobación explícita: GitHub y luego rebuild de Netlify (ver spec deployment y DEPLOY.md).

rules:
  proposal:
    - Las specs describen capacidades duraderas del sistema. No crear una capability por post.
    - Un cambio que solo agrega un post usa skip_specs true en .openspec.yaml, salvo que cambie una regla de post-content o post-publishing.
```

Se quitan los comentarios de ejemplo de la plantilla.

## Risks / Trade-offs

- [Se pierde el listón específico de cada post como spec vigente] → Es intencional: sigue consultable en el archivo y los posts ya están publicados.
- [`--skip-specs` descarta sin aviso un delta que sí importaba] → El delta de Sonnet solo contiene requisitos de ese post; lo generalizable ya está en la tabla de la decisión 3.
- [Los posts ya publicados podrían no cumplir los requisitos nuevos de `post-content`] → Las tareas incluyen revisar los dos archivos fuente contra los tres requisitos nuevos.
- [`post-publishing` no existe como spec principal hasta archivar este cambio] → Esperado en el flujo de OpenSpec; la verificación final lo tiene en cuenta.

## Open Questions

- ¿Las reglas de estilo del post de Sonnet 5.5 (centrado en beneficios, escaneable, cierre con llamada a la acción) deben ser estándar de todos los posts? Si es así, se agregan a `post-content` en un cambio aparte; no altera este.
