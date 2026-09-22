# Proposal

## Why

Hoy el paso de "publicar" un cambio aprobado se hace de memoria y de forma inconsistente: a veces se commitea sin pushear, se dispara el rebuild de Netlify antes de pushear (y se construye un commit viejo), o se olvida el deploy. Falta una regla clara de qué hacer, y en qué orden, una vez que un cambio está aprobado.

## What Changes

- Se define el **proceso de release**: una vez que un cambio está aprobado, se ejecuta en orden **GitHub → deploy**:
  1. **GitHub**: commit de los cambios y `git push` al remoto.
  2. **Rebuild / deploy**: se dispara el build de Netlify (`NETLIFY_BUILD_HOOK_URL`) *después* del push, para que se construya el commit ya publicado.
- Se establece qué significa "aprobado": las tareas del cambio están completas y el usuario dio su visto bueno explícito.
- Se define el manejo de contenido guardado solo en la base de datos (posts): un cambio de contenido en Neon requiere disparar el rebuild aunque no haya commit de código.

## Capabilities

### New Capabilities
- `deployment`: el proceso por el cual un cambio aprobado llega a producción (commit/push a GitHub y rebuild/deploy en Netlify), incluyendo el orden y las precondiciones.

### Modified Capabilities
<!-- Ninguna. -->

## Impact

- **Proceso**: aplica a cualquier cambio aprobado, sea de código o de contenido (posts en Neon).
- **Código**: sin cambios obligatorios de implementación; ya existen `triggerRebuild` (usa `NETLIFY_BUILD_HOOK_URL`) y el flujo de git. La spec formaliza cómo y cuándo usarlos.
- **Dependencias**: requiere `NETLIFY_BUILD_HOOK_URL` configurada y acceso push al remoto de GitHub.
