---
title: "Construir un chatbot con Vercel AI SDK y Next.js App Router en 30 minutos"
description: "Tutorial completo: interfaz de chat con streaming, historial de mensajes, cambio de modelo y manejo de errores. Usando el Vercel AI SDK con Next.js 14 App Router y TypeScript."
pubDate: 2025-10-18
author: "Equipo Blog IA"
tags: ["vercel", "next.js", "chatbot", "tutorial"]
category: tutorial
---

El Vercel AI SDK simplifica construir interfaces de chat con LLMs. En este tutorial construimos un chatbot completo con streaming, historial de conversación, y soporte para múltiples modelos.

## Setup del proyecto

```bash
npx create-next-app@latest mi-chatbot --typescript --tailwind --app
cd mi-chatbot
npm install ai @ai-sdk/openai @ai-sdk/anthropic
```

## La API Route: backend del chat

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model = 'gpt-4o' } = await req.json();

  // Seleccionar el modelo basado en el parámetro
  const selectedModel = model.startsWith('claude') 
    ? anthropic(model)
    : openai(model);

  const result = streamText({
    model: selectedModel,
    system: 'Eres un asistente técnico para desarrolladores. Responde siempre con ejemplos de código cuando sea relevante.',
    messages,
    maxTokens: 2048,
  });

  return result.toDataStreamResponse();
}
```

## El componente de chat

```typescript
// app/page.tsx
'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

const MODELOS = [
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
];

export default function Chat() {
  const [modelo, setModelo] = useState('gpt-4o');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: { model: modelo },
  });

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Selector de modelo */}
      <div className="mb-4 flex gap-2">
        {MODELOS.map(m => (
          <button
            key={m.id}
            onClick={() => setModelo(m.id)}
            className={`px-3 py-1 rounded text-sm ${
              modelo === m.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Historial de mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-8">
            Escribe algo para empezar la conversación
          </p>
        )}
        
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-500">
              Generando respuesta...
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-sm">
            Error: {error.message}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
```

## Variables de entorno

```bash
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Despliegue en Vercel

```bash
# Instalar CLI de Vercel
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en el dashboard de Vercel
# o via CLI:
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
```

Con esta estructura tienes un chatbot funcional en producción en menos de 30 minutos, con streaming real, soporte multi-modelo y manejo básico de errores.

---

*Fuentes: Documentación del Vercel AI SDK, Next.js App Router docs, guías oficiales de integración.*
