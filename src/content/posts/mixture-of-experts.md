---
title: "Mixture of Experts: por qué Mixtral y GPT-4 son más eficientes de lo que parecen"
description: "La arquitectura MoE activa solo una fracción de los parámetros del modelo en cada inferencia. Eso permite modelos enormes que cuestan como modelos pequeños. Explicamos el mecanismo y sus implicaciones."
pubDate: 2025-03-02
tags: ["moe", "arquitectura", "mixtral", "eficiencia"]
category: investigacion
---

Cuando Mistral lanzó Mixtral 8x7B, la reacción fue sorpresa: un modelo de 46.7B parámetros que se comporta en benchmarks como uno de 70B, pero con la velocidad de inferencia de un modelo de 12B. El truco está en la arquitectura Mixture of Experts.

## Cómo funciona MoE

En un transformer denso estándar, todos los parámetros participan en el procesamiento de cada token. En una arquitectura MoE, la capa feed-forward (la parte del transformer que no es atención) se reemplaza por múltiples "expertos" especializados.

Para cada token, un mecanismo de "enrutamiento" (router) decide qué expertos activar. Típicamente, solo 1-2 de los N expertos disponibles procesan cada token.

En Mixtral 8x7B:
- 8 expertos por capa
- 2 expertos activos por token
- Total de parámetros: 46.7B
- Parámetros activos por token: ~12.9B

Eso significa que aunque el modelo tiene 46.7B parámetros, para cada token solo ejecuta el equivalente a 12.9B. La inferencia es tan cara como la de un modelo denso de 12.9B.

## Por qué funciona: especialización emergente

Los experimentos con MoE muestran que los expertos tienden a especializarse en tipos de contenido: algunos son mejores con código, otros con texto narrativo, otros con matemáticas. El router aprende a enviar cada token al experto más apropiado.

Esta especialización no está diseñada explícitamente: emerge del entrenamiento con gradiente estocástico.

## El coste real: memoria vs computación

La trampa de MoE: aunque la computación es como la de un modelo más pequeño, tienes que cargar todos los parámetros en memoria. Mixtral 8x7B necesita ~90GB de VRAM para inferencia en precisión completa, aunque la computación sea comparable a un modelo de 13B.

Esto hace que los modelos MoE sean más prácticos en servidores con mucha VRAM o con cuantización agresiva.

## MoE en los modelos más conocidos

Varios modelos importantes usan MoE:

- **Mixtral 8x7B y 8x22B** (Mistral AI): open weights, bien documentados
- **GPT-4**: OpenAI no lo confirmó oficialmente, pero múltiples fuentes apuntan a arquitectura MoE
- **Gemini 1.5**: Google confirmó el uso de MoE para alcanzar la ventana de 1M de tokens eficientemente

## Implicaciones para los desarrolladores

Si usas Mixtral vía API (Mistral AI, Together AI, Groq), obtienes rendimiento de modelo grande a precio de modelo mediano. Para self-hosting, necesitas hardware con suficiente VRAM aunque la inferencia sea más rápida de lo que el tamaño del modelo sugiere.

---

*Fuentes: Paper de Mixtral 8x7B (Jiang et al., 2024), "Outrageously Large Neural Networks" (Shazeer et al., 2017), Gemini 1.5 technical report de Google.*
