---
title: "LoRA y QLoRA: cómo hacer fine-tuning de LLMs sin necesitar un datacenter"
description: "Low-Rank Adaptation permite adaptar modelos grandes a dominios específicos entrenando menos del 1% de sus parámetros. Con QLoRA, cabe en una sola GPU de consumo. Aquí el estado del arte práctico."
pubDate: 2025-02-01
tags: ["fine-tuning", "lora", "qlora", "entrenamiento"]
category: investigacion
---

El fine-tuning de un LLM grande desde cero requiere decenas de GPUs A100 y días de entrenamiento. Para la mayoría de equipos, eso no es práctico. LoRA (Low-Rank Adaptation) y su variante cuantizada QLoRA hacen que el fine-tuning sea accesible en hardware razonable.

## La idea detrás de LoRA

Los LLMs tienen matrices de peso enormes. LoRA parte de una observación empírica: durante el fine-tuning, los cambios en los pesos tienden a tener un "rango intrínseco" bajo, es decir, se pueden representar como el producto de dos matrices mucho más pequeñas.

En lugar de actualizar la matriz de pesos completa W (que puede ser de dimensión 4096×4096 = 16M parámetros), LoRA añade dos matrices pequeñas A y B tal que ΔW = A·B, donde A es 4096×r y B es r×4096, con r típicamente entre 4 y 64.

Resultado: si r=16, en lugar de entrenar 16M parámetros, entrenas 2×(4096×16) = 131.072 parámetros. Una reducción de más de 100x.

## QLoRA: LoRA + cuantización

QLoRA, publicado por Tim Dettmers et al. en 2023, combina LoRA con cuantización del modelo base en 4 bits (NF4). Esto permite cargar un modelo de 65B parámetros en menos de 48GB de VRAM, haciendo el fine-tuning factible en hardware con una o dos GPUs de consumo.

La técnica tiene tres componentes:
1. **NF4 quantization**: cuantización de 4 bits que preserva mejor la distribución de los pesos
2. **Double quantization**: cuantiza los propios constantes de cuantización para ahorrar más memoria
3. **Paged optimizers**: usa la RAM del sistema cuando la VRAM se llena

## Hardware necesario en la práctica

| Modelo | Método | VRAM necesaria |
|--------|--------|---------------|
| Llama 3 8B | QLoRA 4-bit | ~12 GB |
| Llama 3 70B | QLoRA 4-bit | ~48 GB |
| Mistral 7B | QLoRA 4-bit | ~10 GB |

Una RTX 4090 (24GB) es suficiente para hacer fine-tuning de modelos hasta 13B parámetros con QLoRA.

## Cuándo tiene sentido hacer fine-tuning

Fine-tuning no es la primera solución a probar. Antes de llegar ahí:

1. ¿Mejora el prompt engineering o few-shot? Si sí, no necesitas fine-tuning.
2. ¿Necesitas conocimiento que no está en el modelo? RAG es más apropiado.
3. ¿Necesitas un estilo o formato muy específico y consistente? Fine-tuning empieza a tener sentido.
4. ¿Necesitas comportamiento muy específico en dominio técnico especializado? Fine-tuning es la herramienta.

Las herramientas más usadas para QLoRA en 2025: Hugging Face TRL con la clase `SFTTrainer`, Axolotl, y LLaMA-Factory.

---

*Fuentes: Paper original de LoRA (Hu et al., 2021), QLoRA paper (Dettmers et al., 2023), guías prácticas de Hugging Face.*
