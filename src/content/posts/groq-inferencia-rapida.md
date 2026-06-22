---
title: "Groq: inferencia a 500 tokens por segundo y lo que cambia cuando el modelo va rápido"
description: "Groq usa chips LPU propios en lugar de GPUs para inferencia de LLMs. El resultado: velocidades que hacen que la generación de texto parezca instantánea. Revisamos cuándo esto importa y cuándo no."
pubDate: 2025-04-08
tags: ["groq", "inferencia", "velocidad", "api"]
category: herramientas
---

Hay una diferencia cualitativa entre esperar 3 segundos para la primera palabra de una respuesta y ver el texto aparecer prácticamente al instante. Groq explota esa diferencia con hardware especializado para inferencia.

## Qué es un LPU y por qué importa

Groq diseñó sus propios chips llamados LPU (Language Processing Units), optimizados específicamente para la operación más costosa en inferencia de LLMs: la multiplicación de matrices en secuencia.

Las GPUs son buenas en computación paralela masiva, lo que las hace ideales para entrenamiento. La inferencia autoregresiva de LLMs —generar un token a la vez, donde cada token depende del anterior— no es tan paralelizable. Los LPUs de Groq están optimizados para exactamente este patrón de acceso secuencial.

El resultado: velocidades de 500-800 tokens por segundo para modelos de 8B parámetros, comparado con 50-100 tokens/s en infraestructura GPU estándar.

## Qué modelos están disponibles

Groq no entrena sus propios modelos. Ofrece modelos open-source en sus chips:

- **Llama 3.1** (8B, 70B, 405B)
- **Mixtral 8x7B y 8x22B**
- **Gemma 2** (9B, 27B)
- **DeepSeek R1** (distilaciones)

La API es compatible con el formato de OpenAI, por lo que migrar código existente es trivial.

## Pricing

Groq compite agresivamente en precio:

- Llama 3.1 8B: $0.05 por millón de tokens
- Llama 3.1 70B: $0.59 por millón de tokens
- Mixtral 8x7B: $0.24 por millón de tokens

Para volúmenes altos con modelos open-source, Groq es frecuentemente la opción más barata disponible.

## Cuándo la velocidad cambia el diseño

La velocidad de Groq no es solo una mejora cosmética. Cambia lo que es práctico construir:

**Interfaces de voz**: Con latencias de 100-200ms para la primera respuesta, las conversaciones de voz con LLMs se vuelven fluidas. Con infraestructura GPU estándar, el lag es perceptible.

**Agents con muchos pasos**: Si un agente ejecuta 10 llamadas a un LLM en secuencia, la velocidad de cada llamada multiplica su impacto.

**Prototipos rápidos**: Poder iterar en prompts con respuestas casi instantáneas cambia el flujo de trabajo.

## Las limitaciones

Groq no tiene acceso a GPT-4o, Claude 3.5 Sonnet ni Gemini 1.5 Pro. Si necesitas los mejores modelos en calidad, tienes que ir a OpenAI o Anthropic directamente. Groq es para casos donde un buen modelo open-source es suficiente y la velocidad importa.

El límite de contexto también es menor que en algunos competidores.

---

*Fuentes: Groq blog técnico, documentación de la API de Groq, benchmarks de velocidad publicados en el sitio oficial.*
