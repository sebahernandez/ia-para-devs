---
title: "Tutorial: observabilidad de LLMs en producción con OpenTelemetry"
description: "Desplegar un LLM sin observabilidad es volar a ciegas. Cómo instrumentar tus llamadas con estándares abiertos para saber qué pasa cuando algo falla."
pubDate: 2026-07-02
tags: ["observabilidad", "opentelemetry", "tutorial", "produccion"]
category: tutorial
---

Cuando un LLM en producción da una respuesta mala, la pregunta es siempre la misma: ¿qué pasó exactamente? Qué prompt recibió, qué contexto, cuántos tokens, cuánto tardó, cuánto costó. Sin instrumentación, no tienes ninguna de esas respuestas. Este tutorial va sobre conseguirlas usando estándares abiertos, no una herramienta propietaria que te encierre.

## Por qué OpenTelemetry y no una plataforma cerrada

Hay muchas plataformas de "LLM observability" con dashboards bonitos. El problema es el lock-in: instrumentas para su SDK y quedas atado. OpenTelemetry (OTel) es el estándar de la industria para trazas y métricas, y existe una convención semántica para GenAI. Instrumentas una vez y exportas a donde quieras: Grafana, Datadog, un backend propio.

Rung correcto de la escalera: usa el estándar que ya existe antes de adoptar un SDK propietario.

## Los tres datos que importan

Para cada llamada a un LLM quieres registrar, como mínimo:

1. **Latencia** — cuánto tardó, separando tiempo hasta el primer token.
2. **Tokens y coste** — entrada, salida y el coste derivado.
3. **Contenido** — el prompt y la respuesta (con cuidado de PII).

## Instrumentación básica

La idea es envolver cada llamada en un span de OTel con atributos GenAI:

```python
from opentelemetry import trace

tracer = trace.get_tracer("mi-app.llm")

def chat(messages, model):
    with tracer.start_as_current_span("llm.chat") as span:
        span.set_attribute("gen_ai.system", "anthropic")
        span.set_attribute("gen_ai.request.model", model)
        resp = client.messages.create(model=model, messages=messages)
        span.set_attribute("gen_ai.usage.input_tokens", resp.usage.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", resp.usage.output_tokens)
        return resp
```

Con eso, cada llamada aparece como una traza con su modelo, tokens y duración. Multiplica por tu volumen y ya tienes coste agregado por modelo, por endpoint, por usuario.

## Trazas que atraviesan el pipeline

El valor real aparece cuando el span del LLM es hijo de un span de la petición completa. En un RAG, quieres ver: petición → retrieval → generación, todo bajo la misma traza. Cuando algo tarde 8 segundos, verás de un vistazo si fue el retriever o el modelo.

OTel propaga el contexto automáticamente si usas spans anidados. No hay que reinventar el paso de contexto.

## Cuidado con los datos sensibles

Registrar prompts y respuestas es utilísimo para depurar y peligrosísimo para la privacidad. Dos reglas:

- Nunca loguees contenido en claro si contiene PII sin una capa de redacción.
- Haz que el logging de contenido sea configurable por entorno: completo en staging, redactado o desactivado en producción.

## El pago diferido que evitas

Instrumentar cuesta una tarde. No instrumentar cuesta el día completo que pasarás depurando a ciegas el primer incidente serio, sin datos, adivinando. La observabilidad no es un lujo de sistemas maduros: es lo que hace que un sistema pueda madurar.
