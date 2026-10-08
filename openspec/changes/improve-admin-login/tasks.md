# Tasks

## 1. Preparación

- [x] 1.1 Comprobar el punto de partida: verificar que existen `src/features/auth/password.ts`, `src/features/auth/session.ts` y `src/lib/env.ts`, y que `npm test` y `npx astro check` terminan sin errores. Si no, detenerse: falta `refactor-feature-architecture`
- [x] 1.2 Pedir al usuario el nombre de usuario del administrador y que lo agregue a su `.env` local como `ADMIN_USERNAME=<valor>`; agregar `ADMIN_USERNAME=` (sin valor real) a `.env.example`. Verificar con `grep -c "^ADMIN_USERNAME=" .env .env.example` que aparece en ambos

## 2. Verificación de credenciales

- [x] 2.1 Agregar `'ADMIN_USERNAME'` a la unión de `env()` en `src/lib/env.ts`; verificar que `npx astro check` no da errores
- [x] 2.2 Crear `src/features/auth/credentials.ts` con `verifyCredentials(input, expected)` según la decisión 2 de `design.md` (usuario normalizado, comparación en tiempo constante, `verifyPassword` siempre ejecutado, sin leer el entorno); verificar que el archivo no contiene `process.env` ni un `return` anterior a la llamada a `verifyPassword`
- [x] 2.3 Agregar a `tests/features.test.ts` los casos de `verifyCredentials`: correctas, usuario con otra capitalización y espacios, contraseña incorrecta, usuario incorrecto con contraseña correcta, y campos vacíos; verificar que `npm test` pasa
- [x] 2.4 Actualizar `src/pages/api/admin/login.ts` para leer `username` y `password` del formulario y usar `verifyCredentials` con `env('ADMIN_USERNAME')` y `env('ADMIN_PASSWORD_HASH')`, manteniendo la redirección a `/admin/login?error=1` en cualquier fallo y la misma cookie en el éxito. Verificar con el servidor de desarrollo y `curl` que usuario incorrecto, contraseña incorrecta y campos vacíos devuelven los tres la misma redirección, y que no se emite cookie

## 3. Pantalla de login

- [x] 3.1 Rediseñar `src/pages/admin/login.astro` según la decisión 5 de `design.md`: tarjeta centrada, marca del sitio, título y subtítulo, campos de usuario y contraseña con `<label>` visible y sus atributos (`autocomplete`, `autocapitalize`, `autofocus` en usuario), botón de ancho completo y enlace "Volver al sitio". Verificar en el HTML servido que existen `name="username"` con `autocomplete="username"` y `name="password"` con `autocomplete="current-password"`, cada uno con su `<label for>`
- [x] 3.2 Cambiar el mensaje de error a "Usuario o contraseña incorrectos." dentro de un bloque con `role="alert"`; verificar que `/admin/login?error=1` lo muestra y que `/admin/login` no
- [x] 3.3 Revisar la pantalla en el navegador en modo oscuro y en modo claro, en ancho de escritorio y de móvil (375 px): verificar que texto, campos, botón y error se leen con contraste suficiente, que no hay desplazamiento horizontal y que Tab recorre usuario, contraseña y botón con el foco visible. Si algo no contrasta en claro, agregar la regla mínima en `src/styles/global.css`
- [x] 3.4 Agregar dentro del campo de contraseña un botón para mostrarla u ocultarla, con `aria-label` y `aria-pressed` actualizados en cada pulsación; verificar en el navegador que alterna el campo entre oculto y visible sin perder lo escrito ni enviar el formulario, y que se ve bien en ambos temas

## 4. Integración y cierre

- [x] 4.1 Ejecutar `npm test`, `npx astro check` y `npm run build`; verificar que los tres terminan sin errores
- [x] 4.2 Probar el flujo completo en local con `NETLIFY_BUILD_HOOK_URL= npm run dev`: login con credenciales correctas entra al listado, "Cerrar sesión" vuelve al login, y `/admin` sin sesión redirige. Verificar además que una sesión iniciada antes del cambio sigue siendo válida. No crea ni modifica posts
- [x] 4.3 Ejecutar `openspec validate --all --strict`; verificar que no hay fallos
- [x] 4.4 Pedir al usuario que cree `ADMIN_USERNAME` en Netlify con el mismo valor que en local; verificar que confirma haberlo hecho antes de continuar
- [ ] 4.5 Con el visto bueno explícito del usuario para desplegar: commit, `git push` y, después, rebuild de Netlify según `DEPLOY.md`. Verificar que el build hook responde 2xx, que la portada carga y que el login en producción entra con usuario y contraseña y rechaza un usuario incorrecto
