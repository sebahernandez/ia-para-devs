# Design

## Context

Motivación en `proposal.md` — Why. Estado observado en el código:

- El autor es una columna de texto libre (`posts.author`, `src/db/schema.ts`) con valor por defecto `Sebacure`.
- Hay dos caminos de escritura. El panel admin valida el JSON con `postInputSchema` (`src/features/posts/schema.ts`), donde `author` es `z.string().min(1)`. El comando `scripts/publish-post.ts` no pasa por ese esquema: llama a `createPost()` directo con `data.author ?? 'Sebacure'`.
- El literal `'Sebacure'` está repetido en `PostForm.astro` (dos veces), `publish-post.ts`, `migrate-posts.ts`, `src/db/schema.ts` y el test.
- No hay carpeta de migraciones de Drizzle; el esquema se aplica contra Neon con `drizzle-kit`.

## Goals / Non-Goals

**Goals:**

- Un solo lugar donde vive el nombre del autor válido.
- Que los dos caminos de escritura rechacen otro autor.
- Dejar los datos existentes coherentes con la regla.

**Non-Goals:**

- Modelo de usuarios, tabla de autores o relación post–autor.
- Hacer el autor configurable por variable de entorno: es un valor que no cambia.

## Decisions

**1. Una constante `POST_AUTHOR = 'slagosdev'` exportada desde `src/features/posts/schema.ts`.**
Reemplaza todos los literales `'Sebacure'`. Alternativa descartada: variable de entorno — agrega configuración para un valor fijo y abre la puerta a publicar con otro nombre por un `.env` mal puesto.

**2. Panel admin: `author: z.literal(POST_AUTHOR).default(POST_AUTHOR)` en `postInputSchema`.**
Una línea; la API ya responde con error de validación cuando el esquema falla, así que crear y editar quedan cubiertos sin tocar los endpoints. El `default` permite que el formulario deje de enviar el campo.

**3. Formulario: se quita el `<input>` de autor y el `author` del payload.**
Un campo que solo admite un valor no es un campo. Alternativa descartada: dejarlo `readonly` — más marcado para mostrar algo que el lector ya ve en el sitio.

**4. Comando de publicación: comparación explícita antes de crear.**
Si `data.author` existe y es distinto de `POST_AUTHOR`, el script aborta con un mensaje claro, igual que hace hoy con el slug duplicado; luego pasa `POST_AUTHOR` a `createPost()`. Alternativa descartada: poner la validación dentro de `createPost()`/`updatePost()` para cubrir ambos caminos con un solo guard — duplicaría la validación del esquema en el camino del admin y daría un error 500 en vez de uno de validación.

**5. Base de datos: solo cambia el `default` de la columna; sin `CHECK`.**
Los únicos escritores son los dos caminos anteriores. Un `CHECK (author = 'slagosdev')` sería la garantía más fuerte, pero habría que quitarlo con otra migración el día que llegue multiusuario, y no mejora los mensajes de error. Si aparece un tercer camino de escritura, es el momento de agregarlo.

**6. Datos existentes: un `UPDATE posts SET author = 'slagosdev' WHERE author <> 'slagosdev'` y edición del frontmatter de los dos archivos fuente.**
Sin script dedicado: es una sentencia de una sola vez.

## Risks / Trade-offs

- [Editar un post antiguo con autor `Sebacure` antes de correr el `UPDATE`] → No rompe: el formulario ya no envía el autor y el esquema guarda `slagosdev`. El orden de despliegue no es crítico.
- [El `UPDATE` y el cambio de `default` escriben en la base de producción] → Se ejecutan solo con aprobación explícita; antes se cuenta cuántas filas cambian con un `SELECT`.
- [Conflictos con `refactor-feature-architecture` e `improve-admin-login`, que tocan los mismos archivos] → Aplicar este cambio después de ellos.
- [La regla no la impone la base de datos] → Aceptado; ver decisión 5.

## Migration Plan

1. Código y tests (sin efecto en producción hasta desplegar).
2. Con aprobación: aplicar el nuevo `default` y correr el `UPDATE` sobre los posts existentes.
3. Deploy y rebuild según `DEPLOY.md` para que el sitio muestre la firma nueva.

Rollback: revertir el commit y, si hiciera falta, `UPDATE posts SET author = 'Sebacure'`; el cambio de `default` es inocuo.
