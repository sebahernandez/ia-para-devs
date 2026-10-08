# Design

## Context

Ver `proposal.md` para la motivación. Estado observado en el código:

| Archivo | Líneas | Qué mezcla hoy |
|---|---|---|
| `src/lib/admin-posts.ts` | 160 | 3 tipos, 3 lecturas, 4 escrituras y `triggerRebuild` (Netlify) |
| `src/lib/posts.ts` | 110 | 3 tipos y las lecturas del sitio público |
| `src/lib/auth.ts` | 45 | hash de contraseña y cookie de sesión |
| `src/pages/api/admin/posts/index.ts` y `[id].ts` | 49 / 66 | el mismo `postInputSchema` copiado, y el mismo mapeo campo a campo hacia `PostInput` |
| `src/pages/api/admin/login.ts` | 23 | las opciones de la cookie de sesión |

Otras observaciones que condicionan el diseño:

- `createPost` y `updatePost` repiten el bucle de tags y la regla "un solo destacado".
- `process.env.X!` se lee en `db.ts`, `db-write.ts`, `auth.ts`, `admin-posts.ts` y `login.ts`.
- Las tres rutas API con `[id]` repiten `Number(params.id)` + respuesta 400, y todas construyen `new Response(JSON.stringify(...))` a mano.
- `tsconfig.json` ya declara el alias `~/*` → `src/*`, pero ningún archivo lo usa.
- `drizzle.config.ts` apunta a `./src/db/schema.ts`, y tres scripts lo importan por ruta relativa.
- No hay pruebas ni runner configurado.
- El `.env` local apunta a la base de datos real, y borrar o editar un post desde el admin dispara el rebuild de Netlify.

## Goals / Non-Goals

**Goals:**

- Que cada archivo tenga una sola razón para cambiar y un nombre que diga cuál.
- Que una feature nueva tenga un lugar obvio: una carpeta en `src/features/`.
- Que la dirección de dependencias sea única y comprobable con un `grep`.
- Cero cambios de comportamiento observables, salvo el mensaje de error por variable de entorno ausente.

**Non-Goals:**

- Arquitectura por capas (dominio / aplicación / infraestructura), interfaces de repositorio, inyección de dependencias o casos de uso como clases. Cada pieza tiene hoy una sola implementación.
- Cambiar el esquema de la base de datos, las URLs, el formato de la cookie o las respuestas de la API.
- Unificar `getCatClass()` (`src/utils/categories.ts`) con la columna `accentClass` de la base de datos. Es duplicación real, pero quitarla toca cinco plantillas y exige revisión visual; va en un cambio aparte.
- Escribir la spec de autenticación del admin, que hoy no existe. Este cambio no altera ese comportamiento.
- Endurecer `scripts/publish-post.ts` con el esquema de validación. Cambiaría cuándo falla el comando, que es comportamiento de `post-publishing`.
- Refactorizar los scripts de migración ya ejecutados (`migrate-posts.ts`, `verify-migration.ts`, `seed-categories.ts`) más allá de arreglar sus imports.

## Decisions

### 1. Organizar por feature, no por capa técnica

```
src/
├── db/
│   └── schema.ts            # sin cambios
├── lib/                     # infraestructura: no conoce posts ni sesiones
│   ├── db.ts                # lecturas (driver HTTP)
│   ├── db-write.ts          # escrituras con transacción (driver websocket)
│   ├── env.ts               # NUEVO  única lectura de variables de entorno
│   ├── http.ts              # NUEVO  json() y parseId()
│   └── rebuild.ts           # triggerRebuild(), sale de admin-posts.ts
├── features/
│   ├── posts/
│   │   ├── types.ts         # Category, PostSummary, Post, PostInput, AdminPostRow, PostForEdit
│   │   ├── schema.ts        # postInputSchema + toPostInput()
│   │   ├── queries.ts       # lecturas del sitio público (ex lib/posts.ts)
│   │   ├── admin.ts         # lecturas y escrituras del panel (ex lib/admin-posts.ts)
│   │   └── markdown.ts      # renderMarkdown()
│   └── auth/
│       ├── password.ts      # hashPassword(), verifyPassword()
│       └── session.ts       # nombre, duración y opciones de la cookie; crear y verificar
├── middleware.ts            # sigue decidiendo qué rutas exigen sesión
├── pages/ components/ layouts/ styles/
└── utils/categories.ts      # sin cambios
tests/
└── features.test.ts         # NUEVO
```

**Por qué:** las preguntas reales al crecer son "¿dónde va lo de comentarios?" y "¿qué toca un cambio en auth?". Una carpeta por feature responde ambas. Carpetas globales `types/`, `interfaces/`, `services/` obligan a abrir cuatro carpetas para entender una sola feature, y con dos features solo reparten los mismos archivos en más sitios.

**Alternativa descartada — Clean Architecture completa** (`domain/`, `application/`, `infrastructure/`, repositorios tras interfaces): aísla del ORM y facilita dobles de prueba, pero aquí hay una base de datos, un ORM y unas 600 líneas de lógica. Serían unos 15 archivos más cuyo único contenido es reenviar llamadas. Si un día hay una segunda fuente de datos, `queries.ts` y `admin.ts` ya son la frontera donde extraer la interfaz.

### 2. Regla de dependencias de un solo sentido

`pages` / `components` / `layouts` / `scripts` → `features` → `lib` → `db`

- `lib/` nunca importa de `features/`.
- Una feature no importa de otra. Si dos necesitan lo mismo, baja a `lib/`.
- `pages/` y `components/` no importan `drizzle-orm`, `~/lib/db*` ni `~/db/schema`: piden datos a una feature.
- `types.ts` y `schema.ts` no importan el cliente de base de datos, para poder usarse y probarse sin conexión.

Se comprueba con `grep`, sin herramienta nueva. Una regla de lint de fronteras se justifica cuando haya varios colaboradores.

### 3. Tipos e interfaces: junto a su feature, escritos a mano

`features/posts/types.ts` reúne los seis tipos que hoy están repartidos entre `posts.ts` y `admin-posts.ts`. Se mantienen como `type` explícitos, no derivados del esquema de Drizzle: son el contrato con las plantillas, y derivarlos haría que un cambio de columna se propagara a la UI sin pasar por una decisión.

No se crean interfaces para funciones (`IPostRepository`). Una interfaz con una sola implementación no aporta nada que la firma de la función no dé ya.

### 4. Un solo esquema de validación de entrada

`features/posts/schema.ts` exporta `postInputSchema` (el que hoy está copiado en dos rutas, sin cambios) y `toPostInput(datos, updatedDate)`, que hace el mapeo `content → contentMd`, `category → categorySlug` que hoy repiten ambas rutas. El formulario sigue enviando el mismo JSON.

**Alternativa descartada:** renombrar los campos del formulario para que coincidan con `PostInput` y eliminar el mapeo. Toca `PostForm.astro` y su script de cliente sin beneficio para este cambio.

### 5. Autenticación: dos archivos, y el middleware como único guardián

- `password.ts`: `hashPassword`, `verifyPassword`. Lo usa el login y `scripts/hash-password.ts`.
- `session.ts`: `SESSION_COOKIE_NAME`, `SESSION_MAX_AGE`, `SESSION_COOKIE_OPTIONS` (hoy escritas en `login.ts`), `createSessionCookieValue`, `verifySessionCookieValue`.
- `middleware.ts` conserva la decisión de qué rutas se protegen. Las rutas API no vuelven a comprobar la sesión.

Los algoritmos (scrypt, HMAC-SHA256, comparación en tiempo constante) y el formato del valor de la cookie se copian tal cual. Así las sesiones abiertas y el `ADMIN_PASSWORD_HASH` actual siguen siendo válidos.

### 6. `lib/env.ts`: una función, sin esquema

```ts
export function env(name: 'DATABASE_URL' | 'SESSION_SECRET' | 'ADMIN_PASSWORD_HASH'): string
```

Devuelve el valor o lanza `Falta la variable de entorno <name>`. `NETLIFY_BUILD_HOOK_URL` es opcional y se sigue leyendo directo en `rebuild.ts`. La lectura es perezosa (al llamar, no al importar) en `session.ts` y en el login, para poder probar sin `.env`.

**Alternativa descartada:** validar todo el entorno con un esquema al arrancar. Son tres variables; la unión de literales ya da autocompletado y evita erratas.

### 7. `lib/http.ts`: dos helpers

- `json(body, status = 200)`: `Response` con `Content-Type: application/json`.
- `parseId(valor)`: número o `null`.

Las rutas quedan con el mismo cuerpo y el mismo código de estado. Diferencia menor: las respuestas de las rutas de posts hoy no envían `Content-Type`; pasarán a enviarlo. El cliente del admin ya las interpreta como JSON, así que no cambia nada visible.

### 8. Alias `~/` dentro de `src/`; rutas relativas en `scripts/`

Los imports entre carpetas de `src/` usan `~/features/...` y `~/lib/...`. Los imports dentro de la misma carpeta siguen relativos (`./types`). Los scripts siguen entrando por ruta relativa (`../src/features/posts/admin`).

### 9. Una sola suite de pruebas, con lo que ya está instalado

`tests/features.test.ts` con `node:test` y `node:assert`, ejecutada con `tsx --test` (`tsx` ya es dependencia). Cubre solo lo que rompe en silencio:

- contraseña: verifica la correcta, rechaza la incorrecta y un hash mal formado;
- sesión: acepta una recién creada; rechaza una manipulada, una mal formada y una vacía;
- esquema de post: acepta una entrada válida; rechaza un slug inválido y un título vacío;
- `parseId`: número válido y valor no numérico.

Ninguna toca la base de datos. Las lecturas y escrituras se verifican con `astro check`, el build y una prueba manual del admin.

### 10. Mover en pasos que compilan

Orden: infraestructura → auth → posts → consumidores → borrar los archivos viejos. Tras cada grupo, `npx astro check` debe quedar igual que la línea base tomada al inicio. Así un fallo señala un solo grupo.

## Risks / Trade-offs

- **`tsx` no resuelve el alias `~/` al ejecutar scripts o pruebas** → se comprueba en la primera tarea, antes de mover nada. Si falla, `features/` y `lib/` usan rutas relativas entre sí y el alias queda solo para `pages/`, `components/` y `layouts/`.
- **Un import roto solo aparece en tiempo de ejecución en una ruta del admin** → `astro check` más `npm run build` cubren el tipado y el empaquetado; la prueba manual del admin cubre login, crear, editar, destacar y borrar.
- **La prueba manual escribe en la base de datos real y puede disparar un deploy** → se hace con `NETLIFY_BUILD_HOOK_URL` vacío, con un post en borrador que se elimina al terminar, y solo con el visto bueno del usuario.
- **Copiar mal el código de sesión invalida sesiones o, peor, acepta cookies falsas** → el código se mueve sin editar y las pruebas de sesión manipulada y mal formada se escriben en el mismo grupo.
- **Conflicto con `add-claude-md`** → la última tarea actualiza `CLAUDE.md` si existe, o deja la convención anotada en ese cambio si no.
- **Trade-off:** más archivos pequeños (de 6 a 12 en `lib/` + `features/`). Se acepta porque cada uno queda por debajo de unas 130 líneas y con un único motivo de cambio.

## Migration Plan

1. Aplicar las tareas en orden; cada grupo deja el proyecto compilando.
2. Con aprobación: commit, push y, después, rebuild de Netlify (`deployment`).
3. Verificar en producción que la portada carga y que `/admin` redirige a login sin sesión y entra con ella.

**Rollback:** `git revert` del commit y nuevo rebuild. No hay migración de datos ni cambio de variables de entorno que deshacer.
