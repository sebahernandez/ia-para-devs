---
title: "LM Studio: la interfaz gráfica para correr LLMs en local sin tocar la terminal"
description: "LM Studio ofrece una alternativa a Ollama con interfaz gráfica: descarga modelos desde HuggingFace, los gestiona y expone una API local compatible con OpenAI. Ideal para quien no quiere configurar nada manualmente."
pubDate: 2025-05-28
tags: ["lm-studio", "local-llm", "self-hosted", "herramientas"]
category: herramientas
---

Ollama es excelente si te sientes cómodo en la terminal. LM Studio apunta a un perfil diferente: ofrece una interfaz gráfica completa para descargar, gestionar y usar modelos de lenguaje en local, sin comandos.

Pero incluso si prefieres la terminal, LM Studio tiene características que lo hacen interesante para desarrolladores.

## Qué hace LM Studio

LM Studio es una aplicación de escritorio para macOS, Windows y Linux que:

- Busca y descarga modelos desde Hugging Face directamente desde la app
- Ofrece una interfaz de chat para probar modelos sin código
- Expone un servidor local compatible con la API de OpenAI
- Muestra el uso de RAM/VRAM en tiempo real durante la inferencia
- Permite ajustar parámetros (temperatura, top-p, longitud máxima) visualmente

## La ventaja sobre Ollama: acceso directo a HuggingFace

Ollama tiene su propio registro de modelos con los más populares. LM Studio conecta directamente con Hugging Face, lo que significa acceso a cualquier modelo en formato GGUF —el formato cuantizado optimizado para inferencia en CPU/GPU de consumo.

Si necesitas un modelo específico que Ollama no tiene en su registro, LM Studio puede descargarlo directamente.

## El servidor local compatible con OpenAI

El caso de uso principal para desarrolladores: LM Studio expone un servidor en `http://localhost:1234/v1` con la misma interfaz que la API de OpenAI.

```python
from openai import OpenAI

# Conectar a LM Studio en lugar de a OpenAI
client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio",
)

response = client.chat.completions.create(
    model="meta-llama-3.1-8b-instruct",  # El modelo que tengas cargado
    messages=[
        {"role": "user", "content": "Explica cómo funciona JWT"}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
```

Esto significa que puedes desarrollar contra una "API local" de LM Studio y después cambiar a OpenAI real en producción con solo cambiar la URL base y la API key.

## LM Studio vs Ollama: cuándo elegir cada uno

**LM Studio**: mejor para exploración, cuando quieres ver y comparar modelos visualmente, o cuando prefieres la interfaz gráfica para ajustar configuraciones.

**Ollama**: mejor para integración en scripts y aplicaciones, cuando quieres gestionar modelos desde la línea de comandos, o en servidores sin interfaz gráfica.

No son mutuamente excluyentes: muchos developers tienen ambos instalados y usan cada uno según la tarea.

## Rendimiento y formatos de cuantización

LM Studio soporta GGUF con todos los niveles de cuantización: Q2_K (más pequeño, menor calidad), Q4_K_M (buen equilibrio), Q8_0 (casi sin pérdida de calidad, más grande). La aplicación muestra el tamaño del archivo y la memoria necesaria para cada variante.

En Macs con Apple Silicon, LM Studio usa el Metal Performance Shaders framework para aceleración GPU, con un rendimiento comparable a Ollama en la misma máquina.

---

*Fuentes: Documentación oficial de LM Studio, comparativas de la comunidad en /r/LocalLLaMA.*
