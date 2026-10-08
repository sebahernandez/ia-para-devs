# Proposal

## Why

El blog tiene un solo autor, pero el nombre con que se firma cada post es texto libre: el formulario del admin trae un campo "Autor" editable, el frontmatter acepta cualquier valor y el valor por defecto en todo el código es `Sebacure`. Nada impide publicar un post con otra firma, y los dos posts actuales salieron con `Sebacure` en lugar de `slagosdev`. Hace falta que la firma sea una regla del sistema y no algo que haya que recordar en cada publicación.

## What Changes

- Todo post se guarda con el autor `slagosdev`. Es el único autor válido mientras el blog no tenga multiusuario ni colaboradores.
- El panel admin y su API rechazan guardar (crear o editar) un post con otro autor. El campo "Autor" deja de ser editable en el formulario.
- El comando de publicación por slug falla sin crear el post si el frontmatter trae un `author` distinto de `slagosdev`. Si el frontmatter no trae `author`, se usa `slagosdev`.
- El valor por defecto del autor pasa de `Sebacure` a `slagosdev` en todos los puntos donde existe (base de datos, formulario, scripts).
- Los posts ya publicados y sus archivos fuente pasan de `Sebacure` a `slagosdev`, para que la regla "todos los artículos" se cumpla también hacia atrás. **Supuesto**: el pedido dice "siempre todos los artículos", así que se incluye el contenido existente; si se prefiere conservar la firma histórica, se quita esa tarea.
- **BREAKING (operación)**: un archivo fuente con `author: Sebacure` (u otro nombre) ya no se puede publicar hasta corregir su frontmatter.

Fuera de alcance: cuentas de usuario, colaboradores o cualquier modelo de autoría múltiple. Cuando eso se integre, este requisito se reemplaza por uno que derive el autor de la cuenta.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `post-publishing`: se agrega el requisito de que todo post se publique con el autor `slagosdev` y que se rechace cualquier otro, tanto por el comando de publicación como por el panel admin.

## Impact

- **Código**: `src/features/posts/schema.ts` (validación del autor), `src/components/admin/PostForm.astro` (campo "Autor"), `scripts/publish-post.ts` (validación del frontmatter), `scripts/migrate-posts.ts` y `src/db/schema.ts` (valor por defecto), `tests/features.test.ts`.
- **Contenido**: frontmatter de los dos archivos en `src/content/posts/`.
- **Base de datos (producción)**: cambia el valor por defecto de `posts.author` y se actualiza el autor de los posts existentes. Escribe en la base real: requiere aprobación explícita.
- **Sitio**: la firma visible en las tarjetas, la página del post y el RSS pasa a `slagosdev` tras el siguiente rebuild (ver `deployment`).
- **Cambios en curso**: `refactor-feature-architecture` e `improve-admin-login` tocan `tests/features.test.ts` y el área de admin; conviene aplicar este cambio después de ellos para evitar conflictos.
