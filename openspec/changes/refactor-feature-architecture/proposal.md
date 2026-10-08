# Proposal

## Why

La lógica del blog vive en `src/lib/` sin un criterio de responsabilidades: `admin-posts.ts` mezcla tipos, lecturas, escrituras y el webhook de Netlify; `auth.ts` mezcla contraseñas y sesiones; el esquema de validación del post está copiado en dos rutas API; y las variables de entorno se leen con `process.env.X!` desde cinco archivos. Con el tamaño actual todavía se sostiene, pero cada feature nueva (comentarios, newsletter, más roles) no tiene un lugar obvio donde ir y tiende a engordar esos mismos archivos.

## What Changes

Refactor sin cambio de comportamiento: mismas rutas, mismas respuestas, misma base de datos.

- Organizar la lógica por feature en `src/features/<feature>/`, con un archivo por responsabilidad:
  - `features/posts/`: `types.ts` (tipos), `schema.ts` (validación de entrada), `queries.ts` (lecturas del sitio público), `admin.ts` (lecturas y escrituras del panel), `markdown.ts` (render).
  - `features/auth/`: `password.ts` (hash y verificación), `session.ts` (cookie firmada y sus opciones).
- Dejar `src/lib/` solo para infraestructura sin reglas de negocio: clientes de base de datos (sin mover), `env.ts` (único punto de lectura de variables de entorno), `http.ts` (respuestas JSON y parseo de id) y `rebuild.ts` (webhook de Netlify).
- Eliminar duplicación existente: un solo esquema de validación de post para las dos rutas API, y un solo bloque para "sincronizar tags" y "un solo destacado" en crear y editar.
- Fijar una regla de dependencias de un solo sentido: `pages`/`components`/`scripts` → `features` → `lib` → `db`.
- Usar el alias `~/` (ya declarado en `tsconfig.json`, hoy sin uso) en lugar de rutas relativas largas.
- Agregar un único archivo de pruebas para las rutas críticas (contraseña, sesión, validación de post) con el runner integrado de Node; sin dependencias nuevas.
- Mover `zod` y `@astrojs/markdown-remark` de `devDependencies` a `dependencies`: las rutas del admin los usan en tiempo de ejecución.

Única diferencia observable: si falta una variable de entorno obligatoria, el error nombra la variable en lugar de fallar con un mensaje genérico.

Queda fuera, a propósito: capas de dominio/aplicación/infraestructura, interfaces de repositorio e inyección de dependencias. Con una sola implementación de cada cosa serían archivos sin función; se agregan cuando exista una segunda implementación real.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

Ninguna. Es un refactor puro: ningún requisito de `post-content`, `post-publishing` ni `deployment` cambia. `.openspec.yaml` declara `skip_specs: true`. La estructura y sus reglas quedan en `design.md` y, como convención duradera, en `CLAUDE.md`.

## Impact

- **Código que se mueve o divide**: `src/lib/posts.ts`, `src/lib/admin-posts.ts`, `src/lib/auth.ts`, `src/lib/markdown.ts`.
- **Código que solo cambia imports**: `src/middleware.ts`, las 5 rutas de `src/pages/api/admin/`, las páginas y componentes que leen posts, `src/pages/rss.xml.js`, y los scripts `publish-post.ts`, `hash-password.ts` y `migrate-posts.ts`.
- **Sin cambios**: `src/db/schema.ts`, la base de datos, las URLs del sitio y del admin, el formato de la cookie de sesión (las sesiones abiertas siguen siendo válidas), `drizzle.config.ts`, `astro.config.mjs`, `netlify.toml`.
- **Dependencias**: ninguna nueva. `package.json` gana un script `test` y reubica dos paquetes.
- **Relación con `add-claude-md`** (pendiente, sin aplicar): ese cambio documenta convenciones de código. El que se aplique segundo debe reflejar las rutas de este.
- **Deploy**: es un cambio de código; requiere commit, push y rebuild con aprobación explícita, según `deployment`.
