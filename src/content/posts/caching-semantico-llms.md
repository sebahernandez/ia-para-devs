---
title: "Caching semántico para LLMs: reduce costes un 40-60% en aplicaciones de producción"
description: "El caching estándar no funciona con LLMs porque las queries son siempre ligeramente diferentes. El caching semántico detecta queries similares y reutiliza respuestas. Cómo implementarlo."
pubDate: 2026-03-28
author: "Equipo Blog IA"
tags: ["caching", "costes", "producción", "optimización"]
category: investigacion
---

El caching tradicional es simple: si la clave exacta ya fue procesada, devuelve el valor guardado. Con LLMs no funciona porque "¿cuál es la capital de Francia?" y "dime cuál es la capital de Francia" son la misma pregunta pero strings diferentes.

El caching semántico resuelve esto: compara la similitud semántica de las queries y reutiliza respuestas cuando la similitud supera un umbral. En aplicaciones de producción con queries repetitivas, puede reducir el coste en LLM un 40-60%.

## Cuándo funciona el caching semántico

Funciona bien cuando:
- Muchos usuarios hacen preguntas similares (FAQ, soporte, Q&A sobre documentación)
- Las preguntas son sobre información estable (no cambia cada hora)
- La varianza en el phrasing de la misma pregunta es alta (usuarios distintos formulan lo mismo de formas distintas)

No funciona bien cuando:
- Las queries son altamente personalizadas (contexto específico del usuario)
- La información cambia frecuentemente
- La diversidad de queries es muy alta (pocas repeticiones)

## Implementación básica

```python
from anthropic import Anthropic
from sentence_transformers import SentenceTransformer
import numpy as np
import json
import time

client = Anthropic()
embedder = SentenceTransformer("all-MiniLM-L6-v2")

class SemanticCache:
    def __init__(self, similarity_threshold: float = 0.92, ttl_seconds: int = 3600):
        self.threshold = similarity_threshold
        self.ttl = ttl_seconds
        self.cache: list[dict] = []  # ponytail: lista en memoria, usa Redis en producción
    
    def find_similar(self, query_embedding: np.ndarray) -> dict | None:
        now = time.time()
        for entry in self.cache:
            # Verificar TTL
            if now - entry["timestamp"] > self.ttl:
                continue
            # Calcular similitud coseno
            similarity = np.dot(query_embedding, entry["embedding"]) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(entry["embedding"])
            )
            if similarity >= self.threshold:
                return entry
        return None
    
    def store(self, query: str, embedding: np.ndarray, response: str):
        self.cache.append({
            "query": query,
            "embedding": embedding,
            "response": response,
            "timestamp": time.time(),
        })
        # Limpiar entradas expiradas periódicamente
        if len(self.cache) % 100 == 0:
            self._cleanup()
    
    def _cleanup(self):
        now = time.time()
        self.cache = [e for e in self.cache if now - e["timestamp"] <= self.ttl]

cache = SemanticCache(similarity_threshold=0.92)

def cached_llm_call(query: str) -> tuple[str, bool]:
    """Devuelve (respuesta, fue_cache_hit)"""
    # Obtener embedding de la query
    query_embedding = embedder.encode(query)
    
    # Buscar en cache
    cached = cache.find_similar(query_embedding)
    if cached:
        return cached["response"], True
    
    # Llamar al LLM si no hay cache hit
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": query}]
    )
    answer = response.content[0].text
    
    # Guardar en cache
    cache.store(query, query_embedding, answer)
    
    return answer, False
```

## Ajustar el umbral de similitud

El umbral es el parámetro más importante. Demasiado bajo: respuestas incorrectas para queries que no son tan similares. Demasiado alto: muy pocos cache hits.

```python
def calibrate_threshold(test_pairs: list[tuple[str, str, bool]]) -> float:
    """
    test_pairs: [(query1, query2, son_equivalentes), ...]
    Encuentra el umbral que maximiza precision en queries equivalentes
    y minimiza falsos positivos
    """
    results = []
    for q1, q2, expected_equivalent in test_pairs:
        e1 = embedder.encode(q1)
        e2 = embedder.encode(q2)
        similarity = np.dot(e1, e2) / (np.linalg.norm(e1) * np.linalg.norm(e2))
        results.append((similarity, expected_equivalent))
    
    # Ordenar por similitud para encontrar umbral óptimo
    results.sort(key=lambda x: x[0])
    
    # El umbral óptimo está donde la precisión es más alta
    # (simplificado - en producción usa F1 o la métrica que importa para tu caso)
    for threshold in np.arange(0.80, 0.99, 0.01):
        tp = sum(1 for s, e in results if s >= threshold and e)
        fp = sum(1 for s, e in results if s >= threshold and not e)
        if fp == 0 and tp > 0:
            return threshold
    
    return 0.92  # valor por defecto conservador

# Ejemplos de pares para calibrar
test_pairs = [
    ("¿Cuál es el precio del plan Pro?", "¿Cuánto cuesta el plan Pro?", True),
    ("¿Cómo cancelo mi suscripción?", "¿Qué pasos sigo para cancelar?", True),
    ("¿Cuál es el precio del plan Pro?", "¿Cómo cancelo mi suscripción?", False),
]
```

## Caching con Anthropic prompt caching

Si usas Claude, Anthropic también ofrece prompt caching nativo para el system prompt y el contexto:

```python
response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "Eres un asistente de soporte para...",
            "cache_control": {"type": "ephemeral"}  # Anthropic cachea este bloque
        }
    ],
    messages=[{"role": "user", "content": query}]
)
```

El prompt caching de Anthropic reduce el coste de los tokens del system prompt en ~90%. Combinar prompt caching (para el contexto fijo) + caching semántico (para queries repetidas) maximiza el ahorro.

## Resultados esperados

Para una aplicación de Q&A sobre documentación con tráfico real:

| Configuración | Coste relativo | Cache hit rate |
|--------------|----------------|----------------|
| Sin caching | 100% | 0% |
| Solo prompt caching | 60-70% | — |
| Caching semántico | 40-60% | 35-50% |
| Ambos combinados | 25-40% | — |

Los números varían mucho según el dominio y el patrón de queries. Mide en tu caso específico antes de hacer suposiciones.

---

*Implementación basada en producción real. Ajusta umbrales según tus datos.*
