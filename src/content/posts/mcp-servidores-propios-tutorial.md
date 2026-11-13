---
title: 'Cómo crear un servidor MCP paso a paso (TypeScript)'
description: >-
  Tutorial para crear tu propio servidor MCP en TypeScript: instalación del SDK,
  una herramienta con validación, manejo de errores y conexión con Claude.
  Código completo y probado.
pubDate: '2026-07-30'
category: tutorial
tags:
  - mcp
  - agentes
  - tool-use
  - tutorial
author: slagosdev
---

Un servidor MCP es un programa que expone herramientas y datos a un modelo de IA usando el **Model Context Protocol**, el estándar abierto que crearon en Anthropic y que hoy soportan Claude, ChatGPT, editores como Cursor y VS Code y muchos agentes. Lo escribes una vez y cualquier cliente compatible lo puede usar.

En este tutorial vas a crear un servidor MCP en TypeScript con una herramienta real, en unas 40 líneas de código, y conectarlo a Claude. El código está probado con la versión 1.32 del SDK oficial (`@modelcontextprotocol/sdk`).

## ¿Qué puede exponer un servidor MCP?

Tres tipos de cosas, y conviene no confundirlas:

- **Tools (herramientas)**: acciones que el modelo puede invocar, como consultar tu API, escribir en tu base de datos o lanzar un job. Tienen efectos.
- **Resources (recursos)**: datos que el modelo puede leer, como un archivo, un registro o el resultado de una consulta. Son de solo lectura.
- **Prompts**: plantillas reutilizables que el usuario puede invocar.

Las tools *hacen* y los resources *informan*. Exponer una acción con efectos como resource es una fuente clásica de sorpresas. En este tutorial nos enfocamos en una tool, que es lo que más se usa.

## Paso 1: crear el proyecto e instalar el SDK

Necesitas Node.js 18 o superior.

```bash
mkdir servidor-mcp && cd servidor-mcp
npm init -y
npm pkg set type=module
npm install @modelcontextprotocol/sdk zod
npm install -D tsx
```

`zod` define y valida los parámetros de cada herramienta. `tsx` ejecuta TypeScript sin un paso de compilación.

## Paso 2: escribir el servidor con una herramienta

Crea `server.ts`. El ejemplo expone una herramienta `buscar_pedido` que devuelve el estado de un pedido. Los datos están en memoria para que el ejemplo funcione tal cual; en tu caso, ahí iría tu base de datos o tu API.

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Datos de ejemplo: en tu caso, aquí iría tu base de datos o tu API.
const pedidos: Record<string, { estado: string; total: number }> = {
  'A-1001': { estado: 'enviado', total: 59.9 },
  'A-1002': { estado: 'pendiente de pago', total: 120 },
};

const server = new McpServer({ name: 'pedidos', version: '1.0.0' });

server.registerTool(
  'buscar_pedido',
  {
    description:
      'Devuelve el estado y el total de un pedido. Úsala cuando el usuario pregunte por un pedido concreto y dé su ID (formato A-1234).',
    inputSchema: { id_pedido: z.string().describe('ID del pedido, por ejemplo A-1001') },
  },
  async ({ id_pedido }) => {
    const pedido = pedidos[id_pedido];
    if (!pedido) {
      return {
        content: [{ type: 'text', text: `No existe un pedido con ID ${id_pedido}. Pide al usuario que lo confirme.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: 'text', text: `Pedido ${id_pedido}: ${pedido.estado}, total ${pedido.total} USD.` }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

Qué hace cada parte:

- `McpServer` es el servidor. El `name` es el que verá el cliente.
- `registerTool` registra la herramienta con su nombre, una descripción, el esquema de entrada y la función que se ejecuta.
- `StdioServerTransport` hace que el servidor se comunique por la entrada y salida estándar. Es el transporte para servidores locales: el cliente lanza el proceso y habla con él por JSON-RPC.

## Paso 3: probarlo con MCP Inspector

Antes de conectarlo a un modelo, prueba el servidor con el inspector oficial:

```bash
npx @modelcontextprotocol/inspector npx tsx server.ts
```

Se abre una interfaz web donde puedes listar las herramientas y llamarlas con distintos parámetros. Prueba `A-1001` y un ID que no existe para ver las dos respuestas.

## Paso 4: conectarlo a Claude

**En Claude Code**, desde la carpeta del proyecto:

```bash
claude mcp add pedidos -- npx tsx "$(pwd)/server.ts"
```

**En Claude Desktop**, agrega el servidor a `claude_desktop_config.json` (en Ajustes → Desarrollador → Editar configuración) y reinicia la app:

```json
{
  "mcpServers": {
    "pedidos": {
      "command": "npx",
      "args": ["tsx", "/ruta/completa/a/servidor-mcp/server.ts"]
    }
  }
}
```

Luego pregunta "¿En qué estado está el pedido A-1002?". El modelo verá la herramienta, la llamará con el ID y responderá con el resultado.

## ¿Cómo escribir una buena descripción de herramienta?

El modelo elige qué herramienta usar leyendo su **descripción**. Esa descripción es tu interfaz real, más que la firma de la función:

- Di **cuándo** usarla, no solo qué hace: "Úsala cuando el usuario pregunte por un pedido concreto".
- Usa nombres y parámetros explícitos. `buscar_pedido(id_pedido)` es mejor que `query(q)`.
- Describe cada parámetro con `.describe()`, incluido el formato esperado.
- Pocas herramientas bien definidas funcionan mejor que treinta que se solapan. El modelo se confunde al elegir entre opciones ambiguas.

## ¿Cómo manejar los errores?

Cuando una herramienta falla, no lances una excepción: devuelve el error como resultado con `isError: true` y un texto que el modelo pueda entender y sobre el que pueda actuar. "No existe un pedido con ese ID, pide al usuario que lo confirme" es mucho más útil que un stack trace. El servidor no habla con una persona; habla con un modelo que va a leer ese texto y decidir el siguiente paso.

## Empieza con una sola herramienta

No diseñes el servidor definitivo de entrada. Expón una herramienta real, conéctala a un cliente, mira cómo la usa el modelo y ajusta la descripción según lo que veas. Ese ciclo corto te enseña más que cualquier especificación previa.

## Preguntas frecuentes

**¿Qué lenguaje necesito para crear un servidor MCP?**
Hay SDK oficiales para TypeScript, Python, Java, Kotlin, C#, Go y otros. Este tutorial usa TypeScript; la estructura es la misma en todos.

**¿Cuál es la diferencia entre stdio y HTTP?**
Con stdio el cliente lanza el servidor como un proceso local; es lo más simple para herramientas en tu máquina. Con HTTP el servidor corre aparte y varios clientes se conectan por red; es lo que usas para un servidor remoto o compartido.

**¿Un servidor MCP funciona con ChatGPT y otros clientes?**
Sí. MCP es un estándar abierto: el mismo servidor funciona con cualquier cliente compatible, sin cambiar código.

**¿Es seguro conectar un servidor MCP a mi base de datos?**
El modelo puede llamar a la herramienta con cualquier argumento, así que valida cada entrada y da al servidor solo los permisos que necesita. Si una herramienta tiene efectos, como borrar o pagar, pide confirmación en el cliente.
