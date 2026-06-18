---
title: "Mistral Large 2: el modelo europeo que no pide disculpas por competir con los grandes"
description: "Mistral AI lanzó Large 2 con 123B parámetros, ventana de 128K tokens y rendimiento que rivaliza con GPT-4o. Disponible como pesos descargables y como API, con enfoque en idiomas europeos."
pubDate: 2025-03-05
author: "Equipo Blog IA"
tags: ["mistral", "europa", "llm", "open-weights"]
category: modelos
---

Mistral AI tiene una propuesta clara: modelos de primera línea con acceso a los pesos, sin las restricciones de uso que tienen Meta o Google. Mistral Large 2, lanzado en julio de 2024, es la expresión más completa de esa filosofía hasta el momento.

## Qué es Mistral Large 2

Con 123 mil millones de parámetros, Mistral Large 2 es el modelo más capaz que el laboratorio francés ha publicado. Soporta ventana de contexto de 128.000 tokens y tiene soporte nativo para código y herramientas (function calling).

Los idiomas europeos —francés, alemán, español, italiano, portugués— tienen un tratamiento notablemente mejor que en la mayoría de modelos americanos. Esto no es sorprendente dado el origen del laboratorio, pero sí relevante para proyectos con audiencia europea.

## Benchmarks sin maquillaje

En el momento del lanzamiento, Mistral Large 2 quedó por encima de Llama 3.1 70B en la mayoría de benchmarks estándar y ligeramente por debajo de GPT-4o y Claude 3.5 Sonnet en razonamiento complejo.

Lo relevante: para un modelo con pesos descargables, esto es inédito. Antes de Large 2, los modelos open weights tenían un gap claro frente a los modelos propietarios. Ese gap se está cerrando.

## Acceso y uso

Mistral Large 2 se puede acceder de dos formas:

1. **API de La Plateforme** (plataforma de Mistral): Coste de €2 por millón de tokens de entrada y €6 por millón de salida. Sin compromisos de volumen.

2. **Pesos descargables** en HuggingFace: Bajo licencia Mistral Research License, que permite uso comercial con ciertas condiciones (no redistribución de los pesos como servicio de API).

También está disponible en AWS Bedrock, Google Cloud Vertex AI y Azure AI Studio.

## Codestral: la apuesta por código

Además de Large 2, Mistral publicó Codestral, un modelo especializado en código con soporte para 80+ lenguajes de programación. Con 22B parámetros, está optimizado para completado de código, generación de tests y explicación de funciones.

Para aplicaciones donde el código es el caso de uso principal, Codestral es más eficiente en coste que usar Large 2 para todo.

---

*Fuentes: Mistral AI blog, Hugging Face model card, evaluaciones independientes de LMSYS.*
