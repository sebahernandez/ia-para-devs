---
title: "El ecosistema MCP en 2026: qué servidores usar y cuáles evitar"
description: "MCP creció rápidamente y ahora hay cientos de servidores disponibles. Revisamos cuáles han madurado lo suficiente para producción y cuáles son mejores evitar."
pubDate: 2026-04-05
tags: ["mcp", "herramientas", "ecosistema", "producción"]
category: herramientas
---

El ecosistema MCP pasó de una docena de servidores en 2024 a cientos en 2026. Eso es bueno y malo: bueno porque hay más opciones, malo porque no todos tienen la misma calidad. Después de probar docenas de servidores en proyectos reales, aquí está la guía de cuáles son sólidos.

## Los servidores que funcionan bien en producción

### Filesystem

El servidor de filesystem oficial de Anthropic es el más básico pero también el más usado. Lee y escribe archivos, lista directorios, busca en archivos.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/ruta/permitida"]
    }
  }
}
```

**Estado**: maduro, estable, recomendado.

### PostgreSQL

Permite al LLM hacer queries SQL a tu base de datos. Muy útil para análisis exploratorio de datos o cuando quieres que el modelo genere queries sobre tu esquema real.

**Estado**: estable. Ten cuidado con los permisos: usa un usuario de solo lectura a menos que quieras que el modelo pueda escribir.

### GitHub

Accede a repositorios, issues, PRs, y contenido de archivos en GitHub. Muy útil para análisis de código o gestión de issues.

**Estado**: estable. Necesitas personal access token con los permisos adecuados.

### Brave Search

Búsqueda web via Brave Search API. Útil para dar al modelo acceso a información reciente.

**Estado**: estable. Requiere API key de Brave Search.

### Fetch

El más simple: hace requests HTTP y devuelve el contenido. Útil para que el modelo lea páginas web o APIs REST.

**Estado**: estable. Úsalo con cuidado si el modelo puede determinar la URL (riesgo de SSRF si los inputs vienen de usuarios no confiables).

## Servidores con caveats importantes

### Servidores de bases de datos con escritura

Varios servidores MCP para bases de datos permiten tanto lectura como escritura. En producción, esto es arriesgado: un prompt mal diseñado o un usuario malicioso podría modificar datos.

**Recomendación**: usa usuarios de BD con permisos mínimos. Si solo necesitas lectura, crea un usuario de solo lectura.

### Servidores de ejecución de código

Algunos servidores permiten al modelo ejecutar código arbitrario. Útil en entornos controlados (notebooks de datos), potencialmente peligroso en aplicaciones expuestas a usuarios.

**Recomendación**: solo en entornos aislados (contenedores, sandboxes). Nunca directamente en producción con inputs de usuarios.

### Servidores de terceros sin auditoría

El ecosistema de servidores de la comunidad creció rápido pero la calidad es variable. Algunos servidores de terceros:
- No manejan errores correctamente
- Exponen más información de la necesaria
- No tienen actualizaciones de seguridad

**Recomendación**: antes de usar un servidor de terceros en producción, revisa el código fuente. La mayoría son cientos de líneas de TypeScript; se puede auditar en 15 minutos.

## Cómo gestionar múltiples servidores MCP

Para aplicaciones con varios servidores, la configuración puede crecer:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/proyectos"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://readonly_user:pass@localhost/mydb"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "tu-api-key"
      }
    }
  }
}
```

## Los servidores que más espero que mejoren

**Email**: hay varios servidores MCP para email pero todos tienen limitaciones. El acceso a Gmail o Outlook via MCP existe pero la experiencia no es robusta todavía.

**Calendar**: similar a email. La integración con calendarios existe pero el manejo de timezones, recurrencias, y conflictos necesita más trabajo.

**Slack/Teams**: para uso de empresa, la integración con mensajería es muy útil. Los servidores existentes son funcionales pero no tan pulidos como los oficiales de filesystem o GitHub.

## Seguridad: lo que no puedes ignorar

MCP expone capacidades reales a los LLMs. Hay que tratarlo con el mismo cuidado que cualquier API de tu infraestructura:

1. **Principio de mínimo privilegio**: dale al servidor MCP solo los permisos que necesita
2. **Auditoría**: registra qué herramientas usa el modelo y cuándo
3. **Rate limiting**: si el servidor MCP llama a APIs externas, añade rate limiting para evitar uso accidental excesivo
4. **Validación de inputs**: si los inputs del usuario llegan a las herramientas MCP, valídalos

El ecosistema MCP maduró mucho en 2025-2026. La calidad de los servidores más usados es buena. El trabajo pendiente está en la cola larga de integraciones menos populares.

---

*Estado del ecosistema a abril 2026. El inventario de servidores disponibles cambia rápidamente.*
