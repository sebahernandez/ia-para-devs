---
title: "Ollama: ejecutar LLMs en local con un solo comando"
description: "Ollama simplifica radicalmente correr modelos de lenguaje en tu propia máquina. Un repaso de cómo funciona, qué modelos soporta y cuándo tiene sentido frente a usar una API en la nube."
pubDate: 2025-02-25
author: "Equipo Blog IA"
tags: ["ollama", "local-llm", "self-hosted", "privacidad"]
category: herramientas
---

Instalar y correr un LLM en local era un proceso tedioso hasta hace poco: compilar llama.cpp, gestionar dependencias, configurar parámetros de cuantización, lidiar con errores crípticos. Ollama resolvió casi todo esto en un solo ejecutable.

## Qué hace Ollama

Ollama es una herramienta que:

1. Descarga modelos cuantizados desde su registro
2. Los gestiona localmente (versiones, espacio en disco)
3. Expone una API compatible con OpenAI en `localhost:11434`
4. Maneja la aceleración de GPU automáticamente cuando está disponible

La API compatible con OpenAI es el detalle más práctico: si tu código ya usa el SDK de OpenAI, cambiar a Ollama para modelos locales es reemplazar la URL base. Nada más.

## Instalación y primer modelo

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Descargar y correr Llama 3.1 8B
ollama run llama3.1

# Listar modelos disponibles
ollama list

# Correr en modo API (sin interfaz de chat)
ollama serve
```

La primera ejecución descarga el modelo cuantizado (~4.7GB para Llama 3.1 8B en Q4). Las ejecuciones posteriores son instantáneas.

## Catálogo de modelos disponibles

Ollama soporta la mayoría de modelos open-source relevantes:

- **Llama 3.1** (8B, 70B, 405B)
- **Gemma 2** (2B, 9B, 27B)
- **Mistral** (7B, y variantes)
- **Phi-3** (mini, small, medium)
- **Qwen 2.5** (múltiples tamaños)
- **DeepSeek R1** (distilaciones desde 1.5B hasta 70B)
- **CodeLlama**, **Codestral**, **StarCoder2**

El comando `ollama pull <model>` descarga cualquier modelo del catálogo. También puedes importar modelos GGUF de Hugging Face con un Modelfile.

## Cuándo usar Ollama vs API en la nube

**Usa Ollama cuando:**
- Los datos no pueden salir de tu máquina (datos de salud, financieros, código propietario)
- Experimentas y no quieres acumular costes de API
- Necesitas inferencia offline (demos sin conexión, entornos sin internet)
- Quieres integrar un modelo en un script o aplicación local sin latencia de red

**Usa una API en la nube cuando:**
- Necesitas el mejor modelo disponible (GPT-4o, Claude 3.5 Sonnet)
- El hardware local no aguanta el modelo que necesitas
- El volumen de inferencia es alto y el coste por token es competitivo
- Necesitas el tiempo de respuesta más bajo posible

## Requisitos de hardware

La regla básica: el modelo entero tiene que caber en la RAM o VRAM. Con cuantización Q4:

- Llama 3.1 8B: ~5GB VRAM o ~8GB RAM
- Mistral 7B: ~4.5GB VRAM o ~7GB RAM
- Llama 3.1 70B: ~40GB VRAM (necesitas GPU potente o múltiples)

En Macs con Apple Silicon (M1/M2/M3), la memoria unificada permite correr modelos medianos sin GPU externa, con rendimiento sorprendentemente bueno.

---

*Fuentes: Documentación oficial de Ollama, repositorio en GitHub (ollama/ollama), benchmarks de la comunidad en Reddit /r/LocalLLaMA.*
