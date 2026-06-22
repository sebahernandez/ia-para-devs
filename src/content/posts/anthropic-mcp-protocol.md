---
title: "Model Context Protocol: el estándar abierto que Anthropic propuso para conectar LLMs con herramientas"
description: "MCP define cómo los modelos de lenguaje se conectan con fuentes de datos, herramientas externas y sistemas. Anthropic lo publicó como estándar abierto y varios proveedores lo están adoptando."
pubDate: 2025-05-10
tags: ["anthropic", "mcp", "agentes", "integraciones"]
category: herramientas
---

El problema de conectar LLMs con herramientas externas no estaba estandarizado. Cada plataforma tenía su forma de hacerlo: OpenAI con function calling, LangChain con sus propias abstracciones, cada integración construida desde cero. En noviembre de 2024, Anthropic publicó el Model Context Protocol (MCP) como intento de estandarizar esto.

## Qué define MCP

MCP es un protocolo cliente-servidor que especifica cómo:

1. Un modelo de IA (cliente) puede descubrir qué herramientas y fuentes de datos están disponibles
2. Un servidor de herramientas puede exponer sus capacidades de forma estándar
3. El modelo puede invocar herramientas y recibir resultados

La analogía más usada: MCP es para LLMs lo que LSP (Language Server Protocol) es para los IDEs. En lugar de que cada editor tenga su propio sistema para autocompletado y diagnósticos, LSP estandarizó la interfaz. MCP intenta lo mismo para herramientas de IA.

## La arquitectura básica

```
[Aplicación de IA]
       |
    [Cliente MCP]
       |
  [Protocolo MCP]
       |
  [Servidores MCP]
  /    |    \
[DB] [Git] [Slack]
```

Un servidor MCP expone tres tipos de recursos:
- **Resources**: datos que el modelo puede leer (archivos, registros de BD)
- **Tools**: funciones que el modelo puede invocar
- **Prompts**: plantillas reutilizables con contexto

## Implementación básica de un servidor MCP

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'mi-servidor-mcp',
  version: '1.0.0',
});

server.tool('consultar-base-datos', {
  descripcion: 'Ejecuta una consulta SQL de lectura',
  inputSchema: z.object({
    query: z.string().describe('Consulta SQL'),
  }),
  handler: async ({ query }) => {
    const result = await db.query(query);
    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  },
});
```

## Adopción actual

Desde su publicación, varios proveedores y plataformas han implementado MCP:

- **Claude Desktop**: los primeros usuarios del protocolo
- **Cursor**: soporte nativo desde principios de 2025
- **Zed**: el editor añadió compatibilidad en su versión 0.143
- **Sourcegraph Cody**: integración en roadmap público

Hay una lista creciente de servidores MCP open source para GitHub, Slack, Notion, bases de datos y sistemas de archivos.

## Por qué importa para los desarrolladores

Si construyes una herramienta que quieres que los LLMs puedan usar, MCP te da una forma estándar de exponerla. En lugar de escribir integraciones para cada plataforma de IA, escribes un servidor MCP una vez y cualquier cliente que implemente el protocolo puede usarlo.

El ecosistema todavía es joven, pero la adopción inicial ha sido más rápida de lo esperado.

---

*Fuentes: Repositorio oficial de MCP en GitHub (modelcontextprotocol), blog de Anthropic, documentación oficial del protocolo.*
