---
title: "Gemma 2: los modelos ligeros de Google que corren en tu laptop"
description: "Google publicó Gemma 2 con variantes de 2B, 9B y 27B parámetros. El modelo de 9B supera a Llama 3 8B en benchmarks clave y corre en consumer hardware sin grandes concesiones."
pubDate: 2025-04-02
author: "Equipo Blog IA"
tags: ["google", "gemma", "on-device", "open-weights"]
category: modelos
---

Google tiene una familia de modelos abiertos que no recibe tanta atención como Gemini pero que merece más: Gemma. Con el lanzamiento de Gemma 2 en junio de 2024, Google publicó modelos que corren en hardware accesible y tienen un rendimiento que supera a la competencia en su rango de tamaño.

## Los tres tamaños y cuándo usar cada uno

**Gemma 2 2B**: Diseñado para dispositivos con recursos muy limitados. Corre en CPUs modernas y en dispositivos móviles con hardware de IA (Pixel 8 Pro, por ejemplo). Útil para tareas de inferencia on-device donde la privacidad es crítica.

**Gemma 2 9B**: El punto dulce de la familia. Supera a Llama 3 8B en la mayoría de benchmarks y requiere ~20GB de VRAM (una GPU RTX 4090 o dos GPUs de gama media). Para servidores, es una opción sólida con buen ratio calidad/coste.

**Gemma 2 27B**: El modelo más capaz de la familia. Compite con Llama 3 70B en código y razonamiento. Requiere hardware más serio, pero sigue siendo alcanzable con 2-4 GPUs A100.

## Por qué el rendimiento de 9B sorprende

El tamaño de un modelo no es el único factor que determina su calidad. Gemma 2 9B usa técnicas de destilación del conocimiento desde modelos más grandes de Google, lo que le da capacidades desproporcionadas para su tamaño.

En MMLU, MT-Bench y benchmarks de código, Gemma 2 9B está por encima de Llama 3 8B con un margen significativo. Esto importa si el hardware es el cuello de botella.

## Restricciones de la licencia

A diferencia de Llama 3, la licencia de Gemma 2 tiene restricciones más específicas. No puedes usarla para entrenar otros modelos de lenguaje de más de 5B parámetros. Para uso comercial en productos, hay que revisar los términos de uso específicos de Google.

Esto no es un problema para la mayoría de aplicaciones productivas, pero sí lo es si el objetivo es hacer fine-tuning para luego publicar el modelo derivado.

## Disponibilidad

Gemma 2 está disponible en Hugging Face, Kaggle, y directamente en Google AI Studio. Ollama también lo soporta, lo que simplifica la instalación local con un solo comando.

---

*Fuentes: Google DeepMind blog, Hugging Face model card de Gemma 2, benchmarks comparativos publicados en el paper técnico.*
