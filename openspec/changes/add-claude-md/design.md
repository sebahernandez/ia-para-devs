# Design

## Context

Ver `proposal.md` (Why). Dónde vive hoy cada cosa:

| Tema | Archivo |
| --- | --- |
| Reglas editoriales de un post | `openspec/specs/post-content/spec.md` |
| Cómo se publica un post | `openspec/specs/post-publishing/spec.md` |
| Cuándo y en qué orden se despliega | `openspec/specs/deployment/spec.md` |
| Comandos de deploy y de publicación | `DEPLOY.md` |
| Stack y reglas para generar propuestas | `openspec/config.yaml` |

Hechos observados en el código que condicionan las secuencias:

- Las páginas públicas se generan en el build consultando Neon; solo `/admin` y `/api/admin` corren bajo demanda (`prerender = false`).
- `scripts/publish-post.ts` crea el post y dispara el rebuild, pero aborta si el slug ya existe: no sirve para corregir un post publicado.
- Guardar, editar, borrar o destacar un post desde el panel admin ya dispara el rebuild (al crear, solo si no es borrador).
- El build local necesita `DATABASE_URL` en `.env`, porque consulta la base de datos.
- No hay carpeta `drizzle/` con migraciones ni un script de `package.json` para aplicar cambios de esquema.

## Goals / Non-Goals

**Goals:**

- Que `CLAUDE.md` responda "¿qué hago y en qué orden?" para un post nuevo y para una feature nueva.
- Que cada regla tenga una sola fuente: si cambia, se edita un solo archivo.

**Non-Goals:**

- Repetir requisitos de las specs, comandos de `DEPLOY.md` o el contexto de `openspec/config.yaml`.
- Documentar la arquitectura completa, el panel admin o el esquema de la base de datos.
- Fusionar `DEPLOY.md` dentro de `CLAUDE.md`.
- Definir un proceso de migraciones de base de datos (ver Open Questions).

## Decisions

**1. `CLAUDE.md` contiene secuencias; las specs contienen reglas.**
Cada paso nombra la spec que lo gobierna en vez de citar su texto. Prueba para cualquier línea del archivo: si una spec o `DEPLOY.md` ya lo dice, se reemplaza por una referencia. Alternativa descartada: un resumen de cada spec, que es justo la duplicación que se pidió evitar y queda desactualizado al primer cambio.

**2. `DEPLOY.md` sigue siendo el único lugar con comandos de deploy.**
`CLAUDE.md` dice "publica con el comando de `DEPLOY.md`" sin copiarlo. Alternativa descartada: mover `DEPLOY.md` dentro de `CLAUDE.md`; lo referencian la spec `post-publishing` y `openspec/config.yaml`, y moverlo no aporta nada.

**3. En un post nuevo, el commit y push de la fuente van antes de publicar.**
El script publica y dispara el rebuild en un solo paso. Subir primero `src/content/posts/<slug>.md` mantiene el orden GitHub → rebuild de `deployment` y evita que quede un post publicado cuya fuente no está en el remoto.

**4. Corregir un post publicado se hace desde el panel admin.**
Es la única vía que actualiza un post existente. La secuencia añade actualizar también el `.md` fuente, para que no diverja de lo publicado.

**5. Contenido propuesto de `CLAUDE.md`.**

````markdown
# blog-ia

Blog de IA en español (iaparadevs.com): Astro estático sobre Neon/Postgres, desplegado en Netlify.

Este archivo indica **en qué orden** se trabaja. Las reglas viven en las specs y no se repiten aquí: léelas antes de actuar.

| Tema | Fuente de verdad |
| --- | --- |
| Reglas editoriales de un post | `openspec/specs/post-content/spec.md` |
| Cómo se publica un post | `openspec/specs/post-publishing/spec.md` |
| Cuándo y en qué orden se despliega | `openspec/specs/deployment/spec.md` |
| Comandos de deploy y de publicación | `DEPLOY.md` |

Si una regla cambia, se cambia en su spec mediante un cambio de OpenSpec, no en este archivo.

## Siempre

- Todo trabajo pasa por OpenSpec: `/opsx:propose` → `/opsx:apply` → `/opsx:archive`.
- Commit, push, rebuild y publicación de posts requieren el visto bueno explícito del usuario en ese momento.
- Las páginas públicas se generan en el build. Ningún cambio de código o de contenido se ve en el sitio hasta que termina un rebuild.

## Publicar un post nuevo

1. **Proponer** el cambio con `skip_specs: true` en su `.openspec.yaml`. No se crea una spec por post; solo lleva delta si cambia una regla de `post-content` o `post-publishing`.
2. **Investigar** y dejar las fuentes en el `design.md` del cambio.
3. **Escribir** `src/content/posts/<slug>.md`. Frontmatter: `title`, `description`, `pubDate`, `author`, `category`, `tags`, `draft`, `featured`.
4. **Revisar** el borrador completo contra `post-content` antes de pedir aprobación.
5. **Pedir el visto bueno** del usuario para publicar.
6. **Commit y push** del archivo fuente.
7. **Publicar** con el comando de `DEPLOY.md`. Crea el post en la base de datos y dispara el rebuild.
8. **Verificar** el deploy como indica `deployment`.
9. **Archivar** el cambio.

### Corregir un post ya publicado

El comando de publicación no actualiza: aborta si el slug existe.

1. Editar el post en `/admin`. Guardar dispara el rebuild.
2. Aplicar la misma corrección en `src/content/posts/<slug>.md`, para que la fuente no diverja de lo publicado.
3. Commit y push de la fuente, con visto bueno.

## Integrar una feature nueva

1. **Proponer** el cambio. Si altera comportamiento observable, lleva delta de specs; `skip_specs: true` es solo para refactors, documentación o herramientas.
2. **Implementar** las tareas en orden, marcando cada una al terminarla.
3. **Verificar en local**: `npx astro check` y `npm run build` (necesita `DATABASE_URL` en `.env`, porque el build consulta la base de datos). Revisar la página afectada con `npm run dev`.
4. **Pedir el visto bueno** del usuario para desplegar.
5. **Desplegar** en el orden de `deployment`, con los comandos de `DEPLOY.md`.
6. **Verificar** el deploy.
7. **Archivar** el cambio, sincronizando sus specs.

## Convenciones del código

- Una ruta que deba ejecutarse bajo demanda (`/admin`, `/api/admin`) declara `export const prerender = false`. Sin eso se genera como página estática en el build.
- Un cambio en `src/db/schema.ts` afecta a la base de datos de producción: se describe en el `design.md` del cambio y no se aplica sin visto bueno.
````

## Risks / Trade-offs

- [`CLAUDE.md` puede quedar desactualizado si cambia una secuencia] → Solo contiene orden y referencias, así que un cambio de regla en una spec no lo invalida. Si cambia el orden, el mismo cambio de OpenSpec actualiza `CLAUDE.md`.
- [Solapamiento con el `context` de `openspec/config.yaml`] → Se limita a una línea de presentación; el resto del contexto no se repite.
- [`npx astro check` nunca se ejecutó en este proyecto durante estas sesiones] → La primera tarea lo ejecuta junto con el build antes de dejarlo escrito; si falla por errores previos, se quita del paso 3 y se reporta.

## Open Questions

- No hay un proceso definido para aplicar cambios de esquema a Neon (no existe carpeta de migraciones ni script). `CLAUDE.md` solo exige visto bueno; definir el comando queda para cuando una feature toque el esquema.
