---
title: "Prompt caching en Anthropic: cómo ahorrar 90% en costes con contexto estático"
description: "El caching de Anthropic permite reutilizar contexto largo entre llamadas. Guía de implementación con TypeScript para system prompts, documentos de referencia y herramientas definidas."
pubDate: 2025-08-28
tags: ["anthropic", "optimización", "costes", "tutorial"]
category: tutorial
---

El prompt caching de Anthropic resuelve un problema concreto: si tienes un system prompt largo o un documento de referencia que envías en cada llamada, estás pagando por tokenizar ese contexto en cada request. Con caching, lo tokenizas una vez y las llamadas posteriores cuestan 90% menos para esa parte.

## Cómo funciona

Marcas un fragmento del prompt con `cache_control: { type: "ephemeral" }`. En la primera llamada, Anthropic tokeniza ese fragmento y lo guarda en caché durante 5 minutos (renovable). En las llamadas siguientes dentro de esa ventana, cobran $0.30 por millón de tokens en lugar de $3.

La primera llamada (cache miss) cuesta $3.75 por millón de tokens de entrada, un poco más que el precio estándar. Pero si haces varias llamadas en 5 minutos con el mismo contexto, el ahorro es inmediato.

## Implementación básica: system prompt cacheado

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `
  Eres un asistente técnico especializado en React y TypeScript.
  
  Sigue estas guías de estilo:
  - Usa componentes funcionales, nunca clases
  - Los hooks personalizados empiezan con 'use'
  - Tipar siempre con TypeScript estricto
  - Documenta los props con JSDoc
  
  [...documento de guías de estilo muy largo...]
`;

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: SYSTEM_PROMPT,
      cache_control: { type: 'ephemeral' }  // Cachea este bloque
    }
  ],
  messages: [
    { role: 'user', content: '¿Cómo creo un hook para fetch de datos?' }
  ]
});
```

## Cachear documentos de referencia en el prompt de usuario

```typescript
const documentoEspecificacion = await fs.readFile('especificacion.md', 'utf-8');

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 2048,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Aquí está la especificación del proyecto:\n\n${documentoEspecificacion}`,
          cache_control: { type: 'ephemeral' }
        },
        {
          type: 'text',
          text: '¿Cuáles son los endpoints de autenticación definidos?'
        }
      ]
    }
  ]
});
```

## Cachear definiciones de herramientas

Si usas muchas herramientas con definiciones largas:

```typescript
const tools = [
  {
    name: 'consultar_base_datos',
    description: 'Ejecuta consultas SQL...',
    input_schema: { /* schema largo */ },
  },
  // ... más herramientas
];

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  tools: tools.map((tool, i) => ({
    ...tool,
    // Marcar el último tool para cachear todo el bloque
    ...(i === tools.length - 1 ? { cache_control: { type: 'ephemeral' } } : {})
  })),
  messages: [{ role: 'user', content: 'Lista los usuarios activos' }]
});
```

## Verificar si el cache funcionó

```typescript
const response = await client.messages.create({ ... });

console.log({
  input_tokens: response.usage.input_tokens,
  cache_creation_tokens: response.usage.cache_creation_input_tokens,
  cache_read_tokens: response.usage.cache_read_input_tokens,
});

// Si cache_read_tokens > 0, el cache funcionó
```

## Cuándo vale la pena implementarlo

- System prompts de más de 1.000 tokens que se usan frecuentemente
- Documentos de referencia que se incluyen en múltiples llamadas
- Conversaciones con contexto fijo largo que se reutiliza
- Definiciones de herramientas extensas

Con less de 1.000 tokens el ahorro es mínimo. Para llamadas únicas también.

---

*Fuentes: Documentación oficial de Prompt Caching de Anthropic, guía de optimización de costes.*
