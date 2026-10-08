# Proposal

## Why

Las reglas del proyecto ya están en las specs (`post-content`, `post-publishing`, `deployment`) y los comandos en `DEPLOY.md`, pero ningún archivo dice en qué orden se aplican cuando se publica un post o se integra una feature. No existe `CLAUDE.md`, así que cada sesión reconstruye esa secuencia a partir del código y de los cambios archivados.

## What Changes

- Crear `CLAUDE.md` en la raíz con:
  - un índice que indica qué archivo es la fuente de verdad de cada tema;
  - las reglas que aplican siempre (todo pasa por OpenSpec, nada se despliega sin visto bueno, el sitio no cambia hasta el rebuild);
  - la secuencia para publicar un post nuevo y para corregir uno ya publicado;
  - la secuencia para integrar una feature nueva;
  - las pocas convenciones de código que no se deducen leyendo un solo archivo.
- `CLAUDE.md` enlaza a las specs y a `DEPLOY.md` en lugar de repetir su contenido: no copia requisitos, escenarios ni comandos de deploy.

No cambia ningún comportamiento del sitio ni ninguna regla existente.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

Ninguna. Es un cambio solo de documentación; `.openspec.yaml` declara `skip_specs: true`.

## Impact

- **Archivo nuevo**: `CLAUDE.md`.
- **Sin cambios**: código, base de datos, specs, `DEPLOY.md`, `openspec/config.yaml`.
- **Deploy**: no requiere rebuild; el sitio publicado no cambia.
- **Sesiones futuras**: Claude Code carga `CLAUDE.md` automáticamente, así que sus instrucciones pasan a aplicarse en cada sesión del proyecto.
