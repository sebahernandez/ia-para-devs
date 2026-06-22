---
title: "Cuantización de LLMs en la práctica: GGUF, GPTQ, AWQ y cuándo usar cada uno"
description: "Ejecutar modelos grandes en hardware modesto requiere cuantización. Comparamos los formatos más usados con resultados concretos de calidad y velocidad."
pubDate: 2026-02-12
tags: ["cuantización", "gguf", "gptq", "llms-local", "tutorial"]
category: tutorial
---

Desplegar un modelo de 70B parámetros requiere unos 140GB de VRAM en FP16. Eso está fuera del alcance de cualquier hardware doméstico razonable. La cuantización reduce el tamaño reduciendo la precisión numérica de los pesos. El resultado: un modelo que cabe en hardware accesible con una pérdida de calidad controlada.

Hay tres formatos dominantes: GGUF, GPTQ y AWQ. Cada uno tiene sus ventajas.

## Conceptos básicos

Los pesos de un LLM se almacenan como números de punto flotante. FP16 (16 bits por peso) es el estándar para entrenamiento. La cuantización los convierte a representaciones de menor precisión:

- **INT8** (8 bits): ~50% menos memoria, pérdida mínima de calidad
- **INT4** (4 bits): ~75% menos memoria, algo más de pérdida
- **Q2_K** (2-3 bits): ~85% menos memoria, pérdida notable

La magia está en hacer esta reducción de forma inteligente, preservando los pesos más importantes a mayor precisión.

## GGUF (llama.cpp)

**Qué es**: formato desarrollado por llama.cpp, el proyecto de inferencia en CPU más popular.

**Ventajas**:
- Funciona en CPU (sin GPU)
- Offloading mixto CPU+GPU: parte del modelo en GPU, parte en CPU
- Muy fácil de usar con Ollama, LM Studio, Jan
- Muchos modelos disponibles en Hugging Face

**Variantes principales**:
- `Q4_K_M`: el equilibrio recomendado para uso general (calidad buena, tamaño razonable)
- `Q5_K_M`: mejor calidad, algo más grande
- `Q8_0`: casi sin pérdida de calidad, el doble de tamaño que Q4
- `Q2_K`: muy pequeño, calidad notablemente inferior

```bash
# Descargar y ejecutar con Ollama
ollama pull llama3.1:8b-instruct-q4_K_M
ollama run llama3.1:8b-instruct-q4_K_M
```

**Cuándo usarlo**: tienes CPU decente o GPU con VRAM limitada, usas Ollama/LM Studio, o necesitas offloading mixto.

## GPTQ

**Qué es**: cuantización post-entrenamiento basada en el algoritmo Optimal Brain Quantization.

**Ventajas**:
- Mejor calidad que GGUF a la misma tasa de bits
- Bien integrado con transformers de Hugging Face
- Soporte maduro con AutoGPTQ

**Desventajas**:
- Requiere GPU (no funciona en CPU de forma eficiente)
- El proceso de cuantización es lento (horas para modelos grandes)

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from auto_gptq import AutoGPTQForCausalLM

model_name = "TheBloke/Llama-3.1-8B-Instruct-GPTQ"

model = AutoGPTQForCausalLM.from_quantized(
    model_name,
    model_basename="model",
    use_safetensors=True,
    device="cuda:0",
)

tokenizer = AutoTokenizer.from_pretrained(model_name)
```

**Cuándo usarlo**: tienes GPU con VRAM suficiente y priorizas calidad sobre facilidad de uso.

## AWQ (Activation-aware Weight Quantization)

**Qué es**: cuantización que preserva los pesos más importantes para la activación del modelo.

**Ventajas**:
- Mejor calidad que GPTQ a INT4 en muchos benchmarks
- Velocidad de inferencia muy buena en GPU modernas
- Bien soportado en vLLM y TGI para despliegue en servidor

```python
from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model_path = "casperhansen/llama-3-8b-instruct-awq"
model = AutoAWQForCausalLM.from_quantized(model_path, fuse_layers=True)
tokenizer = AutoTokenizer.from_pretrained(model_path)
```

**Cuándo usarlo**: servidor de inferencia con GPU, priorizas calidad y velocidad de inferencia, usas vLLM o TGI.

## Comparativa de rendimiento

Para Llama 3.1 8B en una RTX 3090 (24GB VRAM):

| Formato | Tamaño | VRAM | Tokens/s | Calidad relativa |
|---------|--------|------|----------|-----------------|
| FP16 | 16GB | 18GB | 45 t/s | 100% (baseline) |
| GPTQ INT4 | 4.5GB | 6GB | 85 t/s | ~97% |
| AWQ INT4 | 4.5GB | 5.5GB | 95 t/s | ~98% |
| GGUF Q4_K_M | 4.8GB | 5GB | 50 t/s | ~95% |
| GGUF Q4_K_M (CPU) | 4.8GB | — | 8 t/s | ~95% |

AWQ gana en calidad+velocidad en GPU. GGUF gana si necesitas CPU o offloading.

## Recomendación según hardware

**Solo CPU (portátil o servidor sin GPU)**:
→ GGUF Q4_K_M con Ollama

**GPU con 8GB VRAM (RTX 3070, 4060 Ti)**:
→ GGUF Q4_K_M o AWQ INT4, modelos hasta 7-8B

**GPU con 16-24GB VRAM**:
→ AWQ INT4 para modelos hasta 34B, o GPTQ si priorizas calidad
→ FP16 para modelos de 7-13B

**Servidor multi-GPU**:
→ AWQ con vLLM para throughput máximo

---

*Benchmarks medidos en enero 2026. Los resultados varían según modelo y hardware.*
