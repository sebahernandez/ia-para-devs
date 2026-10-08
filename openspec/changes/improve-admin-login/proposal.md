# Proposal

## Why

El login del panel pide solo una contraseña: quien la adivine entra, y los gestores de contraseñas no la asocian bien a una cuenta porque no hay campo de usuario. La pantalla, además, es un campo suelto sin etiquetas ni identidad del sitio. Es la única puerta al panel que publica en producción, así que conviene que pida credenciales completas y se vea cuidada.

## What Changes

- El login pasa a pedir **usuario y contraseña**. Sigue habiendo una sola cuenta de administrador.
- El usuario se configura con una variable de entorno nueva, `ADMIN_USERNAME`, junto al `ADMIN_PASSWORD_HASH` actual. Sin cambios en la base de datos.
- **BREAKING (operación)**: `ADMIN_USERNAME` debe existir en Netlify y en el `.env` local antes de desplegar; sin ella el login falla.
- El mensaje de error es único ("Usuario o contraseña incorrectos") y no revela cuál de los dos falló.
- Rediseño de la pantalla de login: tarjeta centrada con la identidad del sitio, campos con etiqueta visible, atributos para gestores de contraseñas, error anunciado a lectores de pantalla, estados de foco claros, botón para mostrar u ocultar la contraseña, enlace de vuelta al sitio, y correcto en modo claro y oscuro.
- Las sesiones abiertas siguen siendo válidas: el formato de la cookie no cambia.

Queda fuera: varias cuentas, roles, recuperación de contraseña, límite de intentos y cambio de contraseña desde el panel.

## Capabilities

### New Capabilities

- `admin-auth`: acceso al panel de administración — qué credenciales se piden, qué rutas exigen sesión, cuánto dura la sesión y cómo se cierra. Hoy ese comportamiento existe pero no tiene spec; este cambio la crea e incluye el requisito nuevo de usuario.

### Modified Capabilities

Ninguna.

## Impact

- **Código**: `src/pages/admin/login.astro` (UI), `src/pages/api/admin/login.ts` (lee y verifica el usuario), `src/features/auth/` (verificación de credenciales), `src/lib/env.ts` (variable nueva), `tests/features.test.ts`.
- **Configuración**: `ADMIN_USERNAME` en Netlify, en `.env` y en `.env.example`.
- **Sin cambios**: base de datos, middleware, cookie de sesión, logout, resto del panel.
- **Dependencia**: se apoya en la estructura de `refactor-feature-architecture`, que está aplicada en el árbol de trabajo pero sin commit. Ese cambio debe quedar confirmado antes o junto con este.
- **Deploy**: cambio de código; commit, push y rebuild con aprobación explícita, y la variable creada en Netlify **antes** del rebuild.
