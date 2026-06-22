---
title: "Primeros pasos con la API de Anthropic: de cero a tu primera llamada en 10 minutos"
description: "Guía práctica para usar la API de Claude desde TypeScript o Python. Cuenta, instalación, primera llamada, streaming y manejo de errores. Todo lo que necesitas para empezar."
pubDate: 2025-07-10
tags: ["anthropic", "api", "tutorial", "typescript"]
category: tutorial
---

La API de Anthropic da acceso a Claude sin necesidad de usar Claude.ai. Desde tu código puedes enviar mensajes, recibir respuestas, hacer streaming, usar herramientas y gestionar conversaciones con historial. Esta guía cubre los primeros pasos.

## Paso 1: Obtener una API key

Ve a [console.anthropic.com](https://console.anthropic.com), crea una cuenta y genera una API key en la sección "API Keys". Guárdala en una variable de entorno:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Nunca incluyas la API key directamente en el código.

## Paso 2: Instalar el SDK

```bash
# TypeScript/JavaScript
npm install @anthropic-ai/sdk

# Python
pip install anthropic
```

## Paso 3: Primera llamada

**TypeScript:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const message = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: '¿Cuál es la diferencia entre async/await y Promises en JavaScript?'
    }
  ]
});

console.log(message.content[0].text);
```

**Python:**
```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "¿Cuál es la diferencia entre async/await y Promises?"}
    ]
)

print(message.content[0].text)
```

## System prompt: dar contexto al modelo

```typescript
const message = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: 'Eres un experto en TypeScript que responde siempre con ejemplos de código.',
  messages: [{ role: 'user', content: '¿Cómo funciona el tipo ReturnType?' }]
});
```

## Streaming: respuestas en tiempo real

```typescript
const stream = client.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explica los hooks de React' }]
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
```

## Manejo de errores

```typescript
import { APIError } from '@anthropic-ai/sdk';

try {
  const message = await client.messages.create({ ... });
} catch (error) {
  if (error instanceof APIError) {
    console.error(`Error ${error.status}: ${error.message}`);
    // 401: API key inválida
    // 429: Rate limit
    // 529: Sobrecarga del servicio
  }
}
```

## Los modelos disponibles

- `claude-3-5-sonnet-20241022`: el más capaz, precio medio
- `claude-3-5-haiku-20241022`: el más rápido y barato
- `claude-3-opus-20240229`: máxima capacidad, mayor coste

Para la mayoría de casos de uso, Sonnet es el punto de partida correcto.

---

*Documentación oficial: docs.anthropic.com. Los modelos y precios se actualizan con frecuencia.*
