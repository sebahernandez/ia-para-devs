---
title: "Modelos multimodales en 2025: qué puede hacer realmente la visión por IA"
description: "Los LLMs con capacidad visual ya no son novedad, pero sus capacidades reales varían mucho. Repasamos qué funciona bien en visión, dónde fallan todavía y las arquitecturas que lo hacen posible."
pubDate: 2025-04-25
author: "Equipo Blog IA"
tags: ["multimodal", "visión", "gpt-4v", "llava"]
category: investigacion
---

La visión por computadora y los modelos de lenguaje se unieron de forma práctica con GPT-4V en 2023. En 2024 y 2025, prácticamente todos los modelos de primera línea son multimodales por defecto. Pero "soporta imágenes" no significa "entiende imágenes igual de bien en todos los casos".

## Lo que los modelos de visión hacen bien

**Descripción general de escenas**: Describir qué hay en una imagen, identificar objetos, personas, escenarios. Los modelos modernos son muy buenos en esto.

**Lectura de texto en imágenes (OCR)**: GPT-4o, Claude 3.5 Sonnet y Gemini 1.5 leen texto en imágenes con alta precisión, incluso con tipos de letra poco comunes.

**Análisis de gráficas y diagramas**: Interpretar gráficas de barras, líneas, y diagramas de flujo. Funciona bien para gráficas simples. Las muy complejas o con mucha información densa causan errores.

**Comparación visual**: "¿En qué se diferencian estas dos interfaces?" o "¿Qué cambió entre estos dos screenshots?" funciona bien.

**Code generation desde mockup**: Dar un mockup o diseño y pedir el código HTML/CSS correspondiente. GPT-4o y Claude 3.5 Sonnet producen resultados usables.

## Las limitaciones que persisten

**Conteo de objetos**: Los modelos fallan con frecuencia al contar objetos en imágenes, especialmente si hay muchos y están superpuestos.

**Razonamiento espacial preciso**: "¿Qué objeto está exactamente a 3cm a la derecha del botón azul?" no es algo que los modelos hagan bien.

**Gráficas con muchos datos**: Tablas y gráficas densas causan errores de extracción. Para análisis de tablas complejas, extraer el texto primero (con OCR) y luego procesarlo con el LLM es más fiable.

**Detección de detalles sutiles en imágenes médicas**: Los modelos no están entrenados ni validados para diagnóstico médico.

## Cómo funciona la arquitectura

Los modelos de visión modernos conectan un encoder visual (como ViT, Vision Transformer) con el LLM. El encoder convierte la imagen en una secuencia de "visual tokens" que el LLM procesa junto con el texto.

GPT-4o va más allá: el modelo fue entrenado de forma nativa con imagen, audio y texto desde el principio, en lugar de añadir visión como módulo separado. Esto produce mejor comprensión de la relación entre texto e imagen.

## Modelos de visión open-source

Para casos donde no quieres enviar imágenes a APIs externas:

- **LLaVA 1.6**: el estándar de referencia para modelos de visión open-source
- **Qwen-VL**: excelente con texto en imágenes y documentos
- **Phi-3 Vision**: sorprendentemente capaz para su tamaño (4.2B)

Disponibles en Ollama y HuggingFace.

---

*Fuentes: "LLaVA: Visual Instruction Tuning" (Liu et al.), evaluaciones de Roboflow Vision AI, documentación de GPT-4V de OpenAI.*
