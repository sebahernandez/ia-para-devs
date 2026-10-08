# Tasks

## 1. Regla del autor en el código

- [x] 1.1 En `src/features/posts/schema.ts`, exportar `POST_AUTHOR = 'slagosdev'` y cambiar `author` a `z.literal(POST_AUTHOR).default(POST_AUTHOR)`. En `tests/features.test.ts`, usar `slagosdev` en la entrada válida y agregar las aserciones: sin `author` el resultado trae `slagosdev`; con `author: 'Sebacure'` el esquema falla. Verificar con `npm test`
- [x] 1.2 En `src/components/admin/PostForm.astro`, quitar el `<input>` "Autor" y el `author` del payload que arma el script del formulario. Verificar con `npx astro check` que no quedan referencias rotas y con `grep -n author src/components/admin/PostForm.astro` que no hay resultados
- [x] 1.3 En `scripts/publish-post.ts`, abortar con mensaje de error y `process.exit(1)` si `data.author` existe y es distinto de `POST_AUTHOR`, antes de crear el post; pasar `POST_AUTHOR` a `createPost()`. Verificar leyendo el flujo: el chequeo ocurre antes de `createPost()` y de `triggerRebuild()`
- [x] 1.4 Cambiar el valor por defecto `'Sebacure'` por `'slagosdev'` en `src/db/schema.ts` y `scripts/migrate-posts.ts`. Verificar con `grep -rn Sebacure src scripts tests` que no quedan resultados fuera de `src/content/posts/`

## 2. Contenido y datos existentes

- [x] 2.1 Cambiar `author: Sebacure` por `author: slagosdev` en el frontmatter de los dos archivos de `src/content/posts/`. Verificar con `grep -rn "^author:" src/content/posts` que ambos dicen `slagosdev`
- [x] 2.2 Con el visto bueno explícito del usuario (escribe en la base de datos real): contar las filas afectadas con `SELECT count(*) FROM posts WHERE author <> 'slagosdev'`, aplicar el nuevo `default` de la columna con `drizzle-kit` y ejecutar `UPDATE posts SET author = 'slagosdev' WHERE author <> 'slagosdev'`. Verificar que el `SELECT` devuelve 0 después

## 3. Verificación de integración

- [x] 3.1 Correr `npm test` y `npm run build` y verificar que ambos terminan sin errores y que las páginas generadas en `dist/` muestran `slagosdev` como autor
- [ ] 3.2 Con el visto bueno explícito del usuario para desplegar: commit, `git push` y rebuild de Netlify según `DEPLOY.md`. Verificar que un post publicado y el RSS muestran `slagosdev`
