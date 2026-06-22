---
title: "DeepSeek R1: el modelo chino que igualó a o1 a una fracción del coste"
description: "DeepSeek publicó R1 con pesos abiertos y rendimiento equivalente a OpenAI o1 en matemáticas y código. El impacto en el mercado fue inmediato y la discusión sobre eficiencia en el entrenamiento se reabrió."
pubDate: 2025-03-18
tags: ["deepseek", "razonamiento", "open-source", "china"]
category: modelos
---

DeepSeek R1 llegó en enero de 2025 y provocó una de las reacciones más visibles del sector tecnológico en años: las acciones de NVIDIA cayeron un 17% en un día. La razón: un laboratorio chino había publicado un modelo de razonamiento comparable a OpenAI o1, con pesos abiertos y un coste de entrenamiento reportado de $6 millones, frente a los cientos de millones que se estiman para o1.

## Qué es un modelo de razonamiento y por qué importa

Los modelos de razonamiento como o1 o R1 no responden directamente a una pregunta: primero generan una "cadena de pensamiento" interna, paso a paso, y luego dan la respuesta. Esto consume más tokens pero produce resultados significativamente mejores en matemáticas, lógica y código complejo.

DeepSeek R1 aplica reinforcement learning (aprendizaje por refuerzo) para enseñar al modelo a razonar: se premia al modelo cuando llega a la respuesta correcta, y aprende qué patrones de pensamiento funcionan.

## Los números

En las benchmarks publicadas por DeepSeek y verificadas por terceros:

- **AIME 2024** (competición de matemáticas): 79.8%, comparable a OpenAI o1 (79.2%)
- **Codeforces** (problemas de programación competitiva): percentil 96.3
- **MATH-500**: 97.3%

Para razonamiento puro, R1 es equivalente a o1. Para código general y seguimiento de instrucciones, o1 todavía tiene ventaja.

## El acceso a los pesos: qué cambia

DeepSeek R1 publicó los pesos del modelo bajo licencia MIT, incluyendo versiones destiladas desde 1.5B hasta 70B parámetros. Esto significa:

1. Puedes ejecutarlo localmente con Ollama o llama.cpp
2. Puedes hacer fine-tuning con tus datos
3. Plataformas como Together AI y Groq lo ofrecen como API barata

La API de DeepSeek también está disponible a precios agresivos: $0.55 por millón de tokens de entrada para R1, frente a $15 para o1 en OpenAI.

## La pregunta que dejó en el aire

La eficiencia del entrenamiento de DeepSeek generó mucha discusión. El laboratorio usó menos chips H100 de los esperados para este nivel de rendimiento. Parte de esto se explica por técnicas como la atención por grupos (GQA) y mezcla de expertos más eficiente, pero sigue siendo un resultado llamativo que cuestionó las asunciones sobre las economías de escala en el entrenamiento de LLMs.

---

*Fuentes: DeepSeek R1 paper técnico (arXiv:2501.12948), análisis de Epoch AI, verificación independiente de benchmarks por Scale AI.*
