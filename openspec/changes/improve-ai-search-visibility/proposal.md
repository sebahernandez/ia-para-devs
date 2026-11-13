# Proposal: improve-ai-search-visibility

## Why

El objetivo del blog es Google y los buscadores con IA (ChatGPT, AI Overviews de Google). Search Console (últimos 3 meses, ver `improve-seo-discoverability`) muestra dos posts cerca de la primera página para búsquedas con volumen real:

| Post | Impresiones | Posición | Búsqueda principal |
|---|---|---|---|
| `mcp-servidores-propios-tutorial` | 86 | 18,7 | "cómo construir un servidor mcp" (48, pos. 24) |
| `vector-search-pgvector` | 82 | 12,9 | "pg vector", "postgresql + pgvector", "pgvector" |

Problemas observados en producción:

- **El tutorial de MCP no tiene código.** Son 853 palabras y ningún bloque de código, aunque la búsqueda pide "cómo construir". Su título ("Escribir tu propio servidor MCP: menos magia de la que crees") no repite la búsqueda.
- **El post de pgvector sí tiene código** (7 bloques, 1.199 palabras), pero el título no nombra la búsqueda más común y no responde en la introducción qué es pgvector ni cuándo usarlo.
- **No se puede medir el tráfico de buscadores con IA.** ChatGPT agrega `utm_source=chatgpt.com` a sus enlaces, pero Search Console solo cubre Google y el sitio no tiene analítica.
- **No hay forma de editar un post publicado desde su archivo fuente.** `scripts/publish-post.ts` rechaza un slug que ya existe (spec `post-publishing`), y estos dos posts solo viven en la base de datos.

Los rastreadores de IA ya pueden entrar: OAI-SearchBot, GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot y Google-Extended reciben 200 y `robots.txt` permite todo. No hace falta cambiar nada ahí.

## What Changes

- **Analítica con Umami Cloud** en las páginas públicas: sin cookies ni banner de consentimiento, con referrers y parámetros UTM. El script se carga solo si está configurado el ID del sitio.
- **Comando `scripts/update-post.ts <slug>`** que actualiza un post existente desde `src/content/posts/<slug>.md` y fija `updatedDate`. No crea posts.
- **Reescribir los dos posts** con un formato que Google y los buscadores con IA puedan citar: título que repite la búsqueda, respuesta directa en la introducción, encabezados en forma de pregunta, pasos numerados y código completo que se puede ejecutar. Se mantiene el slug para no perder la posición ganada.
- **Enlaces internos** hacia esos dos posts desde los posts relacionados.

## Non-Goals

- `llms.txt`: no hay evidencia de que ChatGPT o Google lo usen.
- Datos estructurados `FAQPage`: Google limita sus resultados enriquecidos a sitios de gobierno y salud.
- Bing Webmaster Tools: el usuario decidió que no es su objetivo.
- Reescribir otros posts. Si estos dos suben, se repite el método en otro cambio.

## Capabilities

### New Capabilities

- `site-analytics`: medición de visitas y de su origen en las páginas públicas.

### Modified Capabilities

- `post-publishing`: agrega el comando para actualizar un post existente desde su archivo fuente.

## Impact

- `src/layouts/BaseLayout.astro` (script de Umami)
- `scripts/update-post.ts` (nuevo)
- `src/content/posts/mcp-servidores-propios-tutorial.md`, `src/content/posts/vector-search-pgvector.md` y los posts que reciben enlaces internos (nuevos archivos fuente)
- Variable de entorno `PUBLIC_UMAMI_WEBSITE_ID` en Netlify (la configura el usuario)
- Contenido de posts en Neon. Rollback del contenido: el archivo fuente exportado antes de editar guarda la versión anterior en el historial de git.
