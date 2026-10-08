# Design

## Context

Ver `proposal.md` para la motivación. Estado observado:

- `src/pages/admin/login.astro` (31 líneas): un `<h1>`, un `<input type="password">` con placeholder y sin `<label>`, un botón. El error es un `<p>` rojo fijo ("Contraseña incorrecta.") que aparece con `?error=1`.
- `src/pages/api/admin/login.ts`: lee `password` del formulario, llama a `verifyPassword(password, env('ADMIN_PASSWORD_HASH'))`, y con éxito pone la cookie con `SESSION_COOKIE_OPTIONS`.
- `src/features/auth/password.ts` y `session.ts` existen por `refactor-feature-architecture` (aplicado en el árbol de trabajo, sin commit).
- La cookie de sesión guarda solo `{ exp }` firmado; no identifica a nadie.
- `src/lib/env.ts` acepta `DATABASE_URL`, `SESSION_SECRET` y `ADMIN_PASSWORD_HASH`.
- `AdminLayout` con `showNav={false}` no muestra cabecera ni el botón de tema; el tema se toma de `localStorage`, compartido con el sitio público.
- El proyecto usa Tailwind con la paleta `ink-*` y la clase `theme-cta`; el modo claro se activa con `html.light`.

Decisión del usuario: un solo administrador, con el usuario en variable de entorno.

## Goals / Non-Goals

**Goals:**

- Pedir usuario y contraseña sin tocar la base de datos ni invalidar sesiones abiertas.
- No filtrar, ni por mensaje ni por tiempo de respuesta, cuál de los dos datos falló.
- Una pantalla de login con identidad del sitio, accesible y cómoda con gestores de contraseñas.

**Non-Goals:**

- Varias cuentas, roles o tabla de usuarios.
- Guardar el usuario dentro de la sesión. Con una sola cuenta no hay nada que distinguir.
- Límite de intentos o bloqueo por fuerza bruta. Es una mejora de seguridad real, pero necesita almacenamiento compartido entre funciones de Netlify; va en un cambio aparte.
- "Recordarme" y recuperación de contraseña.
- Rediseñar el resto del panel.

## Decisions

### 1. `ADMIN_USERNAME` como variable de entorno obligatoria

Se agrega a la unión de `env()` y se lee en la ruta de login.

**Alternativa descartada — hacerla opcional** (si falta, aceptar solo contraseña): evita romper el login si se olvida configurarla, pero deja un modo en el que el campo de usuario se ignora en silencio. Es preferible un fallo visible y un paso de despliegue explícito.

### 2. Verificación en una función pura y sin atajos

Nuevo `src/features/auth/credentials.ts`:

```ts
verifyCredentials(
  input: { username: string; password: string },
  expected: { username: string; passwordHash: string },
): boolean
```

- Normaliza ambos usuarios con `trim().toLowerCase()`.
- Compara los usuarios con `timingSafeEqual` sobre su SHA-256 (así los búferes siempre miden lo mismo).
- Ejecuta **siempre** `verifyPassword`, aunque el usuario ya no coincida, y combina los dos resultados al final. Sin retorno temprano, el coste dominante (scrypt) ocurre en todos los casos y el tiempo no delata si el usuario existe.

Recibe los valores esperados por parámetro, no lee el entorno: se prueba sin `.env`. `password.ts` no cambia.

**Por qué sin distinguir mayúsculas:** los teclados móviles capitalizan la primera letra; un usuario es un identificador, no un secreto.

### 3. Un solo mensaje de error

La ruta sigue redirigiendo a `/admin/login?error=1` en cualquier fallo, incluido un campo vacío. La pantalla muestra "Usuario o contraseña incorrectos." No se reenvía el usuario escrito en la URL: quedaría en el historial y en los registros.

### 4. La sesión no cambia

Mismo formato de cookie, misma firma, mismas opciones. Las sesiones abiertas siguen valiendo tras el deploy y el middleware no se toca.

### 5. Pantalla de login

Solo cambia `src/pages/admin/login.astro`; sin componentes nuevos. El único JavaScript de cliente es el del botón de mostrar contraseña.

```
┌──────────────────────────────────────┐
│                                      │
│          ADMIN · BLOG IA             │  marca, mono en versalitas (igual que la cabecera del panel)
│   ┌──────────────────────────────┐   │
│   │ Iniciar sesión               │   │  h1
│   │ Accede para gestionar posts. │   │
│   │                              │   │
│   │ ⚠ Usuario o contraseña…      │   │  solo con ?error=1, role="alert"
│   │                              │   │
│   │ Usuario                      │   │  label visible
│   │ [__________________________] │   │
│   │ Contraseña                   │   │
│   │ [__________________________] │   │
│   │                              │   │
│   │ [          Entrar          ] │   │  theme-cta, ancho completo
│   └──────────────────────────────┘   │
│          ← Volver al sitio           │
└──────────────────────────────────────┘
```

- **Disposición:** tarjeta de `max-w-sm` centrada vertical y horizontalmente, con borde `ink-800`, fondo `ink-900/60` y esquinas redondeadas; relleno cómodo en móvil.
- **Campo usuario:** `name="username"`, `autocomplete="username"`, `autocapitalize="none"`, `autocorrect="off"`, `spellcheck="false"`, `required`, `autofocus`.
- **Campo contraseña:** `name="password"`, `autocomplete="current-password"`, `required`.
- **Mostrar contraseña:** botón con icono de ojo dentro del campo, a la derecha. Alterna el campo entre oculto y visible con un script en línea de pocas líneas, y actualiza `aria-pressed` y `aria-label` ("Mostrar contraseña" / "Ocultar contraseña"). Es `type="button"`, así que no envía el formulario. Agregado a pedido del usuario durante la implementación.
- **Etiquetas:** `<label for>` visibles sobre cada campo; se quitan los placeholders como única pista.
- **Error:** bloque con `role="alert"`, borde y fondo rojos tenues y texto legible en ambos temas, encima de los campos.
- **Foco:** anillo visible en campos, botón y enlace.
- **Tema:** se reutilizan `ink-*` y `theme-cta`, que ya tienen variante `html.light`. Si el rojo del error o el borde de la tarjeta no contrastan en claro, se agrega la regla mínima en `src/styles/global.css`.

**Alternativa descartada — componente `LoginForm.astro`:** el formulario se usa en una sola página.

### 6. Pruebas

Se agregan a `tests/features.test.ts` los casos de `verifyCredentials`: correctas; usuario con otra capitalización y espacios; contraseña incorrecta; usuario incorrecto con contraseña correcta; campos vacíos. La pantalla se verifica en el navegador, en ambos temas.

## Risks / Trade-offs

- **Desplegar sin `ADMIN_USERNAME` en Netlify deja el panel sin acceso** (el login respondería con error) → la variable se crea en Netlify antes del rebuild, como tarea explícita con confirmación del usuario; el sitio público no se ve afectado porque no lee esa variable.
- **Sigue sin haber límite de intentos** → queda anotado como no-objetivo; el usuario añade un segundo dato que adivinar, pero no sustituye a un límite.
- **El nombre de usuario viaja en variable de entorno, no cifrado** → no es un secreto; el secreto sigue siendo la contraseña, guardada como hash scrypt.
- **Depende de un refactor sin commit** → la primera tarea comprueba que `src/features/auth/` existe y que la línea base está en verde antes de empezar.

## Migration Plan

1. Elegir el nombre de usuario y agregarlo al `.env` local y a `.env.example` (sin valor real).
2. Implementar y verificar en local.
3. Crear `ADMIN_USERNAME` en Netlify (Site configuration → Environment variables).
4. Con aprobación: commit, push y, después, rebuild (`deployment`).
5. Verificar en producción el login con usuario y contraseña.

**Rollback:** `git revert` y rebuild. La variable `ADMIN_USERNAME` puede quedarse en Netlify sin efecto.

## Open Questions

- Qué nombre de usuario usar. Lo elige el usuario al aplicar el cambio; no afecta al diseño.
