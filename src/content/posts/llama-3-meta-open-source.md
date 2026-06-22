---
title: "Llama 3: Meta apuesta fuerte por el open source y pone presión a los modelos propietarios"
description: "Meta publicó Llama 3 con pesos descargables, contexto de 128K tokens y rendimiento competitivo con GPT-4. El ecosistema open source no había visto algo así desde el primer Llama."
pubDate: 2025-02-20
tags: ["meta", "llama", "open-source", "self-hosted"]
category: modelos
---

Meta lanzó Llama 3 en abril de 2024 y lo hizo de forma que pocos esperaban: pesos completamente descargables, licencia de uso comercial para la mayoría de casos y variantes desde 8B hasta 70B parámetros. La versión de 405B llegó meses después.

Para los desarrolladores que quieren control total sobre sus datos y no quieren depender de APIs externas, este lanzamiento cambió el panorama.

## Los tamaños y qué hace cada uno

**Llama 3 8B**: El modelo más pequeño. Corre en consumer hardware (una GPU con 16GB de VRAM o incluso en CPU lenta). Sorprendentemente capaz para tareas de extracción, clasificación y generación de texto simple.

**Llama 3 70B**: El punto dulce para la mayoría de casos de uso corporativo. Requiere varias GPUs o hardware dedicado, pero el rendimiento es comparable a GPT-3.5 Turbo en muchas tareas, con la ventaja de ejecutarse en tu propia infraestructura.

**Llama 3.1 405B**: Lanzado en julio de 2024. El modelo más grande de la familia y el primero open source que compite directamente con GPT-4 y Claude 3.5 Sonnet. Requiere hardware serio: al menos 8 GPUs A100.

## Por qué el open source importa aquí

El primer Llama demostró que se podían destilar capacidades de modelos grandes en modelos más pequeños. El segundo Llama afinó eso. Llama 3 lleva la apuesta más lejos: el modelo base está mejor entrenado desde el principio, con mejor calidad de datos y más tokens de entrenamiento.

Para las empresas, las ventajas son claras:
- Sin dependencia de proveedor externo
- Datos que no salen de tu infraestructura
- Posibilidad de fine-tuning para dominios específicos
- Sin costes por token a largo plazo (solo infraestructura)

## El ecosistema que se construyó alrededor

Llama 3 impulsó una ola de herramientas: Ollama lo soportó desde el primer día, llama.cpp tiene versiones cuantizadas que corren en CPU, y plataformas como Together AI y Groq lo ofrecen como API si no quieres el hosting propio.

El fine-tuning con LoRA y QLoRA también se simplificó: la comunidad publicó recetas probadas para ajustar Llama 3 8B con datos propios en una sola GPU A100 en pocas horas.

---

*Fuentes: Meta AI blog, Hugging Face model card de Llama 3, documentación oficial de la licencia Meta Llama 3.*
