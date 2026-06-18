---
title: "Qwen 2.5: Alibaba publica modelos que compiten en multilingüe y código"
description: "La familia Qwen 2.5 de Alibaba incluye variantes especializadas en código y matemáticas, con soporte sobresaliente para idiomas asiáticos y rendimiento competitivo en benchmarks occidentales."
pubDate: 2025-05-20
author: "Equipo Blog IA"
tags: ["alibaba", "qwen", "multilingüe", "open-weights"]
category: modelos
---

Alibaba ha estado publicando modelos de lenguaje desde 2023 con la familia Qwen, y la versión 2.5 lanzada en septiembre de 2024 es la más completa hasta ahora. Lo que hace interesante a esta familia no es solo el rendimiento general, sino las variantes especializadas y el soporte genuinamente bueno para idiomas fuera del inglés.

## La familia completa

Qwen 2.5 viene en varios formatos:

- **Qwen 2.5** (modelos base): desde 0.5B hasta 72B parámetros
- **Qwen 2.5-Coder**: especializado en generación y análisis de código (1.5B hasta 32B)
- **Qwen 2.5-Math**: optimizado para matemáticas y cálculo (1.5B hasta 72B)

Todos disponibles en Hugging Face bajo licencia Apache 2.0, lo que permite uso comercial sin restricciones.

## Qwen 2.5-Coder: la sorpresa

Qwen 2.5-Coder 32B es el modelo de código open-source más capaz disponible a finales de 2024. En HumanEval y benchmarks de completado de código, supera a Code Llama, StarCoder 2 y CodeGemma con margen significativo.

En la práctica, Qwen 2.5-Coder maneja bien la generación de código en múltiples lenguajes, incluyendo Go, Rust y TypeScript, que a veces son puntos ciegos de modelos entrenados principalmente con Python y JavaScript.

## Multilingüe de verdad

La mayoría de los LLMs occidentales tienen soporte "multilingüe" que en realidad es bastante mediocre fuera del inglés. Qwen 2.5 fue entrenado con datos de alta calidad en chino, árabe, francés, español y otros idiomas.

Para proyectos que necesitan generación o comprensión de texto en idiomas no ingleses, Qwen 2.5 72B es una alternativa seria a Llama 3.1 70B o Mistral Large 2.

## Cómo acceder

Los pesos están en Hugging Face. Para ejecutarlos localmente, Ollama tiene soporte para varios modelos de la familia. Para API, Alibaba Cloud ofrece Qwen a través de su plataforma DashScope a precios competitivos.

---

*Fuentes: Alibaba Cloud blog, Hugging Face model cards de Qwen 2.5, EvalPlus leaderboard.*
