---
title: "Streaming de LLMs en aplicaciones web: implementación completa con SSE y React"
description: "Los streams transforman la experiencia de usuario al mostrar texto mientras se genera. Guía de implementación en el backend (Node.js) y frontend (React) usando Server-Sent Events con OpenAI y Anthropic."
pubDate: 2025-11-22
author: "Equipo Blog IA"
tags: ["streaming", "react", "sse", "tutorial"]
category: tutorial
---

Esperar 5-10 segundos para ver la respuesta completa de un LLM es mala experiencia de usuario. El streaming —mostrar tokens conforme se generan— hace que la aplicación se sienta instantánea. Implementarlo correctamente tiene varios detalles que vale la pena conocer.

## Cómo funciona el streaming de LLMs

Los LLMs generan texto token por token. En lugar de esperar a que el modelo termine, la API puede enviar cada token (o pequeño grupo de tokens) a medida que los produce.

El protocolo estándar para esto en aplicaciones web es Server-Sent Events (SSE): la conexión HTTP permanece abierta y el servidor envía eventos de texto plano. El cliente JavaScript los recibe con la API `EventSource` o con `fetch` y `ReadableStream`.

## Backend: Next.js Route Handler

```typescript
// app/api/chat/route.ts
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true,
  });

  // Convertir el stream de OpenAI a un ReadableStream web
  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) {
          // Formato SSE: "data: {json}\n\n"
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
      }
      
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## Backend con Anthropic

```typescript
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages,
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      stream.on('text', (text) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
        );
      });

      await stream.finalMessage();
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

## Frontend: consumir el stream en React

```typescript
// components/Chat.tsx
import { useState } from 'react';

export function Chat() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(userMessage: string) {
    setResponse('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }]
      }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          const data = JSON.parse(line.slice(6));
          setResponse(prev => prev + data.text);
        }
      }
    }

    setLoading(false);
  }

  return (
    <div>
      <button onClick={() => sendMessage('Explica los closures en JavaScript')}>
        Enviar
      </button>
      <div>{loading && !response ? 'Conectando...' : response}</div>
    </div>
  );
}
```

## La alternativa más simple: Vercel AI SDK

```typescript
// Con useChat del Vercel AI SDK
import { useChat } from 'ai/react';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Enviar</button>
      </form>
    </div>
  );
}
```

El Vercel AI SDK maneja el protocolo SSE, el estado y los errores de reconexión automáticamente.

---

*Fuentes: Documentación de OpenAI Streaming, Anthropic Streaming, Vercel AI SDK, MDN Web Docs sobre Server-Sent Events.*
