---
title: "Vercel AI SDK: la capa de abstracción que hace sensato trabajar con múltiples LLMs"
description: "El AI SDK de Vercel unifica la interfaz para OpenAI, Anthropic, Google y otros proveedores. Streaming, generación de objetos estructurados y herramientas con una API consistente."
pubDate: 2025-03-10
author: "Equipo Blog IA"
tags: ["vercel", "ai-sdk", "typescript", "next.js"]
category: herramientas
---

El problema con las APIs de los distintos proveedores de LLMs no es que sean malas. Es que son todas diferentes. El streaming funciona distinto, las herramientas se definen diferente, el manejo de errores varía. Si cambias de proveedor o quieres probar varios, reescribes parte de tu código.

El AI SDK de Vercel resuelve esto con una capa de abstracción diseñada específicamente para aplicaciones web modernas.

## La filosofía del SDK

El AI SDK no es solo un wrapper de APIs. Tiene opiniones sobre cómo debe estructurarse el código que trabaja con LLMs:

- **Proveedor independiente**: el mismo código funciona con OpenAI, Anthropic, Google, Mistral y más
- **Streaming nativo**: los streams están integrados desde el principio, no añadidos después
- **TypeScript primero**: tipos generados automáticamente para respuestas estructuradas
- **React hooks incluidos**: `useChat` y `useCompletion` para interfaces de usuario

## Los dos paquetes principales

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic
```

**`ai`**: El core del SDK. Funciones como `generateText`, `streamText`, `generateObject`, `streamObject`.

**`@ai-sdk/<provider>`**: Paquetes específicos por proveedor. Cambiar de proveedor es cambiar el import.

## Ejemplo básico: streaming con cualquier modelo

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// Con OpenAI
const { textStream } = await streamText({
  model: openai('gpt-4o'),
  prompt: 'Explica qué es un transformer en 3 párrafos',
});

// Con Anthropic — mismo código, diferente modelo
const { textStream } = await streamText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  prompt: 'Explica qué es un transformer en 3 párrafos',
});
```

## Generación de objetos estructurados: la killer feature

Esto es lo que diferencia al AI SDK de un simple wrapper:

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4o'),
  schema: z.object({
    nombre: z.string(),
    tecnologias: z.array(z.string()),
    experiencia: z.enum(['junior', 'mid', 'senior']),
  }),
  prompt: 'Extrae la información del siguiente CV: ...',
});

// object está tipado automáticamente
console.log(object.nombre); // string
console.log(object.experiencia); // 'junior' | 'mid' | 'senior'
```

El SDK usa los Structured Outputs de OpenAI o el modo JSON de Anthropic según el proveedor, con fallback a parsing si el modelo no soporta outputs estructurados nativamente.

## Integración con Next.js y React

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });
  return result.toDataStreamResponse();
}
```

```typescript
// app/chat/page.tsx
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  // ...
}
```

Diez líneas de código para un chat funcional con streaming.

---

*Fuentes: Documentación oficial del Vercel AI SDK, repositorio en GitHub (vercel/ai), changelog de versiones.*
