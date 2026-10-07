# Tasks

## 1. Limpieza de Markdown en la raíz

- [x] 1.1 Eliminar `categories.md`; verificar con `grep -rn "categories.md" . --exclude-dir=node_modules --exclude-dir=.git` que solo quedan menciones dentro de `openspec/changes/`
- [x] 1.2 Agregar a `DEPLOY.md` una sección "Publicar un post" con `npx tsx scripts/publish-post.ts <slug>`, aclarando que lee `src/content/posts/<slug>.md`, que aborta si el slug ya existe y que dispara el rebuild; verificar que el comando y la ruta coinciden con `scripts/publish-post.ts`

## 2. Orden de las specs de OpenSpec

- [x] 2.1 Archivar el cambio terminado con `openspec archive add-sonnet-5-5-post --skip-specs -y`; verificar que `openspec list --json` ya no lo muestra y que existe en `openspec/changes/archive/`
- [x] 2.2 Eliminar `openspec/specs/posts/` tras confirmar que `openspec/changes/archive/2026-10-07-add-gemini-4-argon-post/specs/posts/gemini-4-argon-launch/spec.md` conserva los seis requisitos; verificar que `openspec list --specs` muestra solo `deployment` y `post-content`
- [x] 2.3 Reemplazar `openspec/config.yaml` por el contenido de la decisión 6 de `design.md`; verificar que `openspec instructions proposal --change clean-docs-and-specs --json` devuelve el `context` y las `rules` nuevas

## 3. Comprobación de los requisitos nuevos

- [x] 3.1 Revisar los dos archivos de `src/content/posts/` contra los tres requisitos nuevos de `post-content` (datos atribuidos, nota de crédito bajo el video, metadatos completos con categoría existente y tags); verificar leyendo el frontmatter y el bloque del video de cada uno, y reportar cualquier incumplimiento sin editar el contenido
- [x] 3.2 Contrastar cada requisito de `specs/post-publishing/spec.md` con `scripts/publish-post.ts`, `src/lib/admin-posts.ts` y `src/lib/posts.ts`; verificar que no hay ningún escenario que el código contradiga y, si lo hay, corregir la spec (no el código)

## 4. Verificación final

- [x] 4.1 Ejecutar `openspec validate --all --strict`; verificar que no hay fallos
- [x] 4.2 Ejecutar `find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.claude/*" -not -path "./openspec/*"`; verificar que solo quedan `DEPLOY.md` y los dos posts de `src/content/posts/`
- [x] 4.3 Con el visto bueno del usuario, hacer commit de la limpieza junto con los archivos aún sin versionar (`src/content/`, `scripts/publish-post.ts`, `openspec/`); verificar con `git status` que el árbol queda limpio. No se dispara rebuild: el sitio publicado no cambia
