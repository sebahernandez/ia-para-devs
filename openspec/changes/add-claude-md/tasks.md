# Tasks

## 1. Comprobar los comandos antes de escribirlos

- [ ] 1.1 Ejecutar `npx astro check` y `npm run build` en local; verificar que ambos terminan sin error. Si `astro check` falla por errores que ya existían, quitarlo del paso 3 de "Integrar una feature nueva" y reportar los errores sin corregirlos

## 2. Crear CLAUDE.md

- [ ] 2.1 Crear `CLAUDE.md` en la raíz con el contenido de la decisión 5 de `design.md` (ajustado según 1.1); verificar que existe y tiene las secciones "Siempre", "Publicar un post nuevo", "Corregir un post ya publicado", "Integrar una feature nueva" y "Convenciones del código"
- [ ] 2.2 Comprobar que no duplica: verificar que `CLAUDE.md` no contiene `SHALL`, ningún bloque `#### Scenario`, ni los comandos `publish-post.ts` o `NETLIFY_BUILD_HOOK_URL`, con `grep -nE "SHALL|Scenario|publish-post|NETLIFY_BUILD_HOOK_URL" CLAUDE.md` sin resultados
- [ ] 2.3 Comprobar las referencias: verificar que cada ruta citada en `CLAUDE.md` (`openspec/specs/*/spec.md`, `DEPLOY.md`, `src/content/posts/`, `src/db/schema.ts`) existe en el repositorio
- [ ] 2.4 Contrastar la secuencia de publicación con `scripts/publish-post.ts` y la de corrección con `src/pages/api/admin/posts/[id].ts`; verificar que los campos de frontmatter listados son los que lee el script y que guardar desde el admin dispara el rebuild
- [ ] 2.5 Incluir en "Convenciones del código" la estructura de `refactor-feature-architecture` (decisiones 1 y 2 de su `design.md`): lógica por feature en `src/features/<feature>/`, infraestructura sin reglas de negocio en `src/lib/`, y dependencias en un solo sentido `pages`/`components`/`scripts` → `features` → `lib` → `db`; verificar que las rutas citadas existen

## 3. Cierre

- [ ] 3.1 Ejecutar `openspec validate --all --strict`; verificar que no hay fallos
- [ ] 3.2 Con el visto bueno del usuario, hacer commit de `CLAUDE.md` y del cambio; verificar con `git status` que el árbol queda limpio. No se dispara rebuild: el sitio publicado no cambia
