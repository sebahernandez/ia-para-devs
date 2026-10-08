# Tasks

## 1. Línea base e infraestructura

- [x] 1.1 Ejecutar `npx astro check` y `npm run build` antes de tocar nada y anotar el resultado como línea base; verificar que se conoce la lista exacta de errores previos (idealmente ninguno)
- [x] 1.2 Agregar el script `"test": "tsx --test tests/*.test.ts"` a `package.json` y crear `tests/features.test.ts` con una prueba que importe un módulo de `src/` que use el alias `~/`; verificar con `npm test` que `tsx` resuelve el alias. Si no lo resuelve, aplicar el plan alternativo de la decisión 8 de `design.md` (rutas relativas dentro de `features/` y `lib/`) y dejarlo anotado aquí
- [x] 1.3 Crear `src/lib/env.ts` con `env(name)` (decisión 6) y usarlo en `src/lib/db.ts` y `src/lib/db-write.ts`; verificar con `grep -rn "process.env" src/lib` que solo quedan `env.ts` y la lectura de `NETLIFY_BUILD_HOOK_URL`
- [x] 1.4 Crear `src/lib/http.ts` con `json()` y `parseId()` (decisión 7) y agregar sus casos a `tests/features.test.ts` (id numérico, id no numérico); verificar que `npm test` pasa
- [x] 1.5 Mover `triggerRebuild` de `src/lib/admin-posts.ts` a `src/lib/rebuild.ts` y reexportarlo temporalmente desde `admin-posts.ts`; verificar que `npx astro check` iguala la línea base

## 2. Feature auth

- [x] 2.1 Crear `src/features/auth/password.ts` con `hashPassword` y `verifyPassword` copiados sin cambios de `src/lib/auth.ts`, y agregar las pruebas de contraseña (correcta, incorrecta, hash mal formado); verificar que `npm test` pasa
- [x] 2.2 Crear `src/features/auth/session.ts` con las constantes, `SESSION_COOKIE_OPTIONS` (tomadas de `login.ts`) y las funciones de crear y verificar copiadas sin cambios, leyendo `SESSION_SECRET` con `env()` al llamar; agregar las pruebas de sesión (recién creada, manipulada, mal formada, vacía) y verificar que `npm test` pasa
- [x] 2.3 Apuntar `src/middleware.ts`, `src/pages/api/admin/login.ts`, `src/pages/api/admin/logout.ts` y `scripts/hash-password.ts` a los módulos nuevos; `login.ts` usa `SESSION_COOKIE_OPTIONS` y `env('ADMIN_PASSWORD_HASH')`. Verificar que `npx tsx scripts/hash-password.ts prueba` imprime un hash con formato `salt:hash`
- [x] 2.4 Borrar `src/lib/auth.ts`; verificar con `grep -rn "lib/auth" src scripts` que no quedan referencias y que `npx astro check` iguala la línea base

## 3. Feature posts

- [x] 3.1 Crear `src/features/posts/types.ts` con los seis tipos (`Category`, `PostSummary`, `Post`, `PostInput`, `AdminPostRow`, `PostForEdit`); verificar que el archivo no importa nada de `~/lib` ni de `drizzle-orm`
- [x] 3.2 Crear `src/features/posts/schema.ts` con `postInputSchema` (idéntico al actual) y `toPostInput()`, y agregar las pruebas de esquema (entrada válida, slug inválido, título vacío); verificar que `npm test` pasa sin `DATABASE_URL` definida
- [x] 3.3 Mover `src/lib/markdown.ts` a `src/features/posts/markdown.ts` y actualizar `scripts/migrate-posts.ts`; verificar con `grep -rn "lib/markdown" src scripts` que no quedan referencias
- [x] 3.4 Crear `src/features/posts/queries.ts` con las lecturas públicas de `src/lib/posts.ts`, importando los tipos de `./types`; verificar que exporta `getAllPosts`, `getAllPostsWithContent`, `getPostBySlug`, `getAllCategoryDefs`, `getCategoriesWithCounts` y `getFeaturedPost`
- [x] 3.5 Crear `src/features/posts/admin.ts` con las lecturas y escrituras de `src/lib/admin-posts.ts`, extrayendo dos funciones privadas para la sincronización de tags y la regla de un solo destacado, usadas por crear y editar; verificar que el archivo no contiene `fetch(` ni `process.env`
- [x] 3.6 Mover `zod` y `@astrojs/markdown-remark` a `dependencies` con `npm install zod @astrojs/markdown-remark --save-prod`; verificar que ambos aparecen en `dependencies` y que las versiones no cambiaron

## 4. Consumidores y limpieza

- [x] 4.1 Reescribir las rutas `src/pages/api/admin/posts/index.ts`, `[id].ts` y `[id]/featured.ts` para usar `postInputSchema`, `toPostInput`, `json`, `parseId` y `triggerRebuild` desde sus módulos nuevos, conservando los mismos códigos de estado y mensajes; verificar con `grep -rn "z.object" src/pages` que solo queda el esquema de `featured.ts`
- [x] 4.2 Actualizar los imports de páginas, componentes, layouts y `src/pages/rss.xml.js` a `~/features/posts/queries`, `~/features/posts/admin` y `~/features/posts/types`; verificar con `grep -rnE "lib/(posts|admin-posts)" src` que no quedan referencias
- [x] 4.3 Actualizar el import dinámico de `scripts/publish-post.ts` a `../src/features/posts/admin` y `../src/lib/rebuild`; verificar con `npx tsx --env-file=.env -e "await import('./src/features/posts/admin.ts'); await import('./src/lib/rebuild.ts')"` que carga sin error. No ejecutar el script: publicaría un post
- [x] 4.4 Borrar `src/lib/posts.ts` y `src/lib/admin-posts.ts`; verificar que `src/lib/` contiene solo `db.ts`, `db-write.ts`, `env.ts`, `http.ts` y `rebuild.ts`

## 5. Integración y cierre

- [x] 5.1 Comprobar la regla de dependencias: `grep -rn "features/" src/lib` sin resultados, `grep -rnE "drizzle-orm|lib/db|db/schema" src/pages src/components src/layouts` sin resultados, y `grep -rn "features/auth" src/features/posts` y `grep -rn "features/posts" src/features/auth` sin resultados
- [x] 5.2 Ejecutar `npm test`, `npx astro check` y `npm run build`; verificar que las pruebas pasan, que `astro check` iguala la línea base de 1.1 y que el build genera las mismas rutas que antes
- [ ] 5.3 Con el visto bueno del usuario (escribe en la base de datos real), arrancar `NETLIFY_BUILD_HOOK_URL= npm run dev` y probar en `/admin`: acceso sin sesión redirige a login, contraseña incorrecta muestra error, login correcto entra, crear un post en borrador, editarlo, marcarlo y desmarcarlo como destacado restaurando el destacado anterior, y borrarlo. Verificar que cada paso responde igual que antes y que el borrador ya no existe al terminar
- [x] 5.4 Dejar la convención como referencia duradera: si `CLAUDE.md` existe, agregar a sus convenciones de código la estructura `features/` + `lib/` y la regla de dependencias (decisiones 1 y 2), y corregir cualquier ruta antigua que cite; si no existe, agregar esa tarea a `openspec/changes/add-claude-md/tasks.md`. Verificar que una de las dos quedó hecha
- [x] 5.5 Ejecutar `openspec validate --all --strict`; verificar que no hay fallos
- [x] 5.6 Con el visto bueno explícito del usuario para desplegar: commit, `git push` y, después, rebuild de Netlify según `DEPLOY.md`. Verificar que el build hook responde 2xx, que la portada carga y que `/admin` redirige a login sin sesión
