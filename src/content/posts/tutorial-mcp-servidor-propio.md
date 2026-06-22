---
title: "Tutorial: construye tu propio servidor MCP en menos de 100 líneas"
description: "El Model Context Protocol de Anthropic permite a los LLMs conectarse con herramientas externas. Construimos un servidor MCP funcional paso a paso con TypeScript."
pubDate: 2026-01-03
tags: ["mcp", "tutorial", "typescript", "herramientas"]
category: tutorial
---

MCP (Model Context Protocol) es el estándar que Anthropic propuso para que los LLMs se conecten con herramientas externas de forma estandarizada. En lugar de cada proveedor implementar su propio formato, MCP define un protocolo común que cualquier cliente (Claude, Cursor, y otros) puede usar.

En este tutorial construimos un servidor MCP que expone una herramienta para consultar el clima y otra para buscar en una base de datos local. Menos de 100 líneas, TypeScript.

## Instalación

```bash
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx
```

## La estructura básica

Un servidor MCP tiene tres partes:
1. Definición de herramientas (qué puede hacer)
2. Handler de las herramientas (cómo las ejecuta)
3. Transporte (cómo se comunica con el cliente)

```typescript
// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
  { name: "mi-servidor-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);
```

## Definir las herramientas

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "obtener_clima",
      description: "Obtiene el clima actual de una ciudad",
      inputSchema: {
        type: "object",
        properties: {
          ciudad: {
            type: "string",
            description: "Nombre de la ciudad",
          },
        },
        required: ["ciudad"],
      },
    },
    {
      name: "buscar_producto",
      description: "Busca un producto en el catálogo local",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Término de búsqueda",
          },
        },
        required: ["query"],
      },
    },
  ],
}));
```

## Implementar los handlers

```typescript
// Simulamos una base de datos local
const productos = [
  { id: 1, nombre: "Laptop Pro", precio: 1299 },
  { id: 2, nombre: "Teclado mecánico", precio: 149 },
  { id: 3, nombre: "Monitor 4K", precio: 499 },
];

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "obtener_clima") {
    const { ciudad } = z.object({ ciudad: z.string() }).parse(args);
    // En producción aquí iría una llamada real a una API de clima
    return {
      content: [
        {
          type: "text",
          text: `Clima en ${ciudad}: 18°C, parcialmente nublado. Humedad: 65%.`,
        },
      ],
    };
  }

  if (name === "buscar_producto") {
    const { query } = z.object({ query: z.string() }).parse(args);
    const resultados = productos.filter((p) =>
      p.nombre.toLowerCase().includes(query.toLowerCase())
    );
    return {
      content: [
        {
          type: "text",
          text:
            resultados.length > 0
              ? JSON.stringify(resultados, null, 2)
              : "No se encontraron productos.",
        },
      ],
    };
  }

  throw new Error(`Herramienta desconocida: ${name}`);
});
```

## Iniciar el servidor

```typescript
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP iniciado"); // stderr para no interferir con el protocolo
}

main().catch(console.error);
```

## Conectarlo con Claude Desktop

Añade esto a tu configuración de Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json` en Mac):

```json
{
  "mcpServers": {
    "mi-servidor": {
      "command": "npx",
      "args": ["tsx", "/ruta/a/tu/proyecto/src/server.ts"]
    }
  }
}
```

Reinicia Claude Desktop y las herramientas aparecerán disponibles automáticamente.

## Probarlo

Con el servidor conectado, puedes preguntarle a Claude cosas como:
- "¿Qué tiempo hace en Madrid?"
- "Busca laptops en el catálogo"

Claude detectará que tiene herramientas disponibles y las usará cuando corresponda.

## Próximos pasos

El servidor que acabamos de construir es completamente funcional. Para producción, considera:

- **Autenticación**: si el servidor accede a datos sensibles, añade validación de que el cliente es quien dice ser
- **Manejo de errores**: los errores deben devolver `isError: true` en la respuesta
- **Logging**: usa stderr para logs, nunca stdout (interfiere con el protocolo)
- **Tipo de transporte**: para servidores remotos, HTTP+SSE en lugar de stdio

El código completo son unas 80 líneas. MCP está diseñado para ser simple.

---

*Documentación oficial en modelcontextprotocol.io. SDK disponible en npm: @modelcontextprotocol/sdk.*
