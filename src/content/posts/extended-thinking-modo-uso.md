---
title: "Guía práctica de Extended Thinking: patrones de uso y antipatrones"
description: "Después de implementar Extended Thinking en varios proyectos, compilamos los patrones que funcionan y los errores que más se cometen al integrarlo en aplicaciones de producción."
pubDate: 2026-03-08
tags: ["extended-thinking", "claude", "tutorial", "producción"]
category: tutorial
---

Extended Thinking en Claude 3.7 Sonnet es una herramienta poderosa que es fácil usar mal. Después de implementarlo en aplicaciones reales, estos son los patrones que producen buenos resultados y los antipatrones que cuestan dinero sin mejorar la calidad.

## Patrón 1: Presupuesto adaptativo según complejidad

No uses el mismo presupuesto de tokens para todas las queries. Define niveles según la complejidad esperada:

```python
def get_thinking_budget(query_type: str) -> dict:
    budgets = {
        "simple": {"type": "disabled"},
        "medium": {"type": "enabled", "budget_tokens": 2000},
        "complex": {"type": "enabled", "budget_tokens": 8000},
        "critical": {"type": "enabled", "budget_tokens": 16000},
    }
    return budgets.get(query_type, budgets["simple"])

# Clasificar queries antes de llamar al modelo
async def classify_and_respond(query: str):
    complexity = await classify_complexity(query)  # modelo pequeño y rápido
    thinking = get_thinking_budget(complexity)
    return await claude.messages.create(
        model="claude-sonnet-4-5",
        thinking=thinking,
        messages=[{"role": "user", "content": query}]
    )
```

Usa un modelo pequeño (Haiku) para clasificar la complejidad y así no pagas el coste completo de Extended Thinking en queries sencillas.

## Patrón 2: Streaming para mejorar la UX

Extended Thinking añade latencia. Si el usuario espera la respuesta completa, 10-15 segundos se sienten eternos. Usa streaming para mostrar la respuesta mientras se genera:

```python
async def stream_with_thinking(query: str):
    with client.messages.stream(
        model="claude-sonnet-4-5",
        max_tokens=8000,
        thinking={"type": "enabled", "budget_tokens": 5000},
        messages=[{"role": "user", "content": query}]
    ) as stream:
        thinking_done = False
        for event in stream:
            if hasattr(event, 'type'):
                if event.type == 'content_block_start':
                    if event.content_block.type == 'thinking':
                        yield {"type": "status", "text": "Analizando..."}
                    elif event.content_block.type == 'text':
                        thinking_done = True
                        yield {"type": "status", "text": "Preparando respuesta..."}
                elif event.type == 'content_block_delta':
                    if thinking_done and hasattr(event.delta, 'text'):
                        yield {"type": "text", "content": event.delta.text}
```

Muestra un indicador de "pensando..." mientras el modelo razona, y empieza a mostrar la respuesta en streaming cuando comienza la parte de texto.

## Patrón 3: Caché de respuestas para queries similares

Extended Thinking es caro. Si las queries se repiten (o son variaciones de lo mismo), cachea los resultados:

```python
import hashlib
import json
from functools import lru_cache

def query_key(query: str) -> str:
    return hashlib.sha256(query.encode()).hexdigest()[:16]

# Usa Redis en producción
response_cache = {}

async def cached_thinking_response(query: str, budget: int = 5000):
    key = query_key(query)
    if key in response_cache:
        return response_cache[key]
    
    response = await client.messages.create(
        model="claude-sonnet-4-5",
        thinking={"type": "enabled", "budget_tokens": budget},
        messages=[{"role": "user", "content": query}]
    )
    
    response_cache[key] = response
    return response
```

## Patrón 4: Separar razonamiento de respuesta

A veces quieres el razonamiento para auditarlo o mostrárselo al usuario:

```python
def extract_thinking_and_response(response) -> tuple[str, str]:
    thinking = ""
    answer = ""
    
    for block in response.content:
        if block.type == "thinking":
            thinking = block.thinking
        elif block.type == "text":
            answer = block.text
    
    return thinking, answer

# Uso para debugging o transparencia
thinking, answer = extract_thinking_and_response(response)
print(f"El modelo razonó así:\n{thinking[:500]}...")
print(f"\nRespuesta final:\n{answer}")
```

## Antipatrón 1: Activar Extended Thinking para todo

El error más común y caro. Extended Thinking no mejora la generación de contenido, clasificación simple, extracción de datos estructurados, o resúmenes de texto.

**No hagas esto:**
```python
# Cada request tiene Extended Thinking aunque no lo necesite
response = client.messages.create(
    thinking={"type": "enabled", "budget_tokens": 10000},  # ❌
    messages=[{"role": "user", "content": "Resume este email en 3 puntos"}]
)
```

**Haz esto:**
```python
response = client.messages.create(
    thinking={"type": "disabled"},  # ✓ para tareas simples
    messages=[{"role": "user", "content": "Resume este email en 3 puntos"}]
)
```

## Antipatrón 2: Budget demasiado alto por defecto

budget_tokens=16000 no siempre produce mejor resultado que budget_tokens=5000. La calidad se aplana rápidamente. Empieza con 2000-5000 y sube solo si los resultados no son suficientes.

## Antipatrón 3: Mostrar el razonamiento sin filtrar

Si expones el bloque de pensamiento al usuario, puede contener razonamiento que parece incorrecto aunque la conclusión final sea correcta. El proceso de razonamiento interno puede explorar hipótesis falsas antes de descartarlas. No asumas que el pensamiento es siempre "limpio".

## Antipatrón 4: No medir si ayuda

Implementa métricas para saber si Extended Thinking mejora la calidad en tu caso de uso específico. En algunos dominios, la diferencia es marginal y no justifica el coste.

```python
# Evalúa con y sin thinking en tu dataset de test
results_with_thinking = evaluate_model(queries, thinking_enabled=True)
results_without_thinking = evaluate_model(queries, thinking_enabled=False)

improvement = results_with_thinking.accuracy - results_without_thinking.accuracy
cost_ratio = results_with_thinking.cost / results_without_thinking.cost

print(f"Mejora de calidad: {improvement:.1%}")
print(f"Factor de coste: {cost_ratio:.1f}x")
# Decide si vale la pena
```

---

*Patrones derivados de implementaciones en producción durante Q1 2026.*
