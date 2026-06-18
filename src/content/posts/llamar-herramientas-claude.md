---
title: "Cómo implementar tool use con Claude: guía práctica de function calling"
description: "Tool use permite que Claude invoque funciones definidas por ti para obtener información externa o ejecutar acciones. Implementación completa con TypeScript, manejo del ciclo de herramientas y patrones de error."
pubDate: 2025-11-05
author: "Equipo Blog IA"
tags: ["anthropic", "tool-use", "agentes", "tutorial"]
category: tutorial
---

Tool use (también llamado function calling) permite que Claude solicite la ejecución de funciones definidas por ti cuando necesita información que no tiene o cuando debe tomar una acción externa. Es la base para construir agentes de IA que interactúan con sistemas reales.

## El ciclo de tool use

El flujo tiene varios pasos:

1. Envías el mensaje del usuario junto con las definiciones de herramientas disponibles
2. Claude responde con `stop_reason: "tool_use"` y una lista de herramientas que quiere invocar
3. Tú ejecutas las herramientas y recopilas los resultados
4. Envías los resultados de vuelta a Claude
5. Claude responde con el mensaje final

## Definición de herramientas

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: 'obtener_clima',
    description: 'Obtiene el clima actual para una ciudad específica',
    input_schema: {
      type: 'object',
      properties: {
        ciudad: {
          type: 'string',
          description: 'Nombre de la ciudad, ej: "Madrid"'
        },
        unidades: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Unidades de temperatura'
        }
      },
      required: ['ciudad']
    }
  },
  {
    name: 'buscar_vuelos',
    description: 'Busca vuelos disponibles entre dos ciudades',
    input_schema: {
      type: 'object',
      properties: {
        origen: { type: 'string' },
        destino: { type: 'string' },
        fecha: { type: 'string', description: 'Formato YYYY-MM-DD' }
      },
      required: ['origen', 'destino', 'fecha']
    }
  }
];
```

## El ciclo completo implementado

```typescript
async function runWithTools(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage }
  ];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      tools,
      messages
    });

    // Si no hay tool use, tenemos la respuesta final
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock?.text ?? '';
    }

    // Procesar tool use
    if (response.stop_reason === 'tool_use') {
      // Añadir la respuesta del asistente al historial
      messages.push({ role: 'assistant', content: response.content });

      // Ejecutar cada herramienta solicitada
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          const result = await executeToolCall(block.name, block.input);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result)
          });
        }
      }

      // Añadir resultados al historial
      messages.push({ role: 'user', content: toolResults });
    }
  }
}

// Simulación de ejecución de herramientas
async function executeToolCall(name: string, input: unknown) {
  switch (name) {
    case 'obtener_clima':
      return { temperatura: 22, condicion: 'soleado', ciudad: (input as any).ciudad };
    case 'buscar_vuelos':
      return { vuelos: [{ hora: '10:30', precio: 150, aerolinea: 'Iberia' }] };
    default:
      throw new Error(`Herramienta desconocida: ${name}`);
  }
}

// Uso
const resultado = await runWithTools(
  '¿Qué clima hace en Madrid hoy y hay vuelos desde Barcelona para mañana?'
);
console.log(resultado);
```

## Tool choice: controlar cuándo se usan las herramientas

```typescript
// Forzar que Claude use una herramienta específica
const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  tools,
  tool_choice: { type: 'tool', name: 'obtener_clima' },
  messages: [{ role: 'user', content: '¿Cómo está el tiempo?' }]
});
```

## Errores comunes

**No manejar el ciclo completo**: Si hay múltiples herramientas o el modelo quiere varias iteraciones, necesitas el bucle `while`.

**Tool results sin el `tool_use_id`**: Cada resultado debe referenciar el ID de la herramienta que lo solicitó.

**No limitar las iteraciones**: Añade un contador máximo al bucle para evitar loops infinitos.

---

*Fuentes: Documentación oficial de Tool Use de Anthropic, guía de mejores prácticas para agentes.*
