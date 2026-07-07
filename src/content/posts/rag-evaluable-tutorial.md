---
title: "Tutorial: cómo hacer que tu pipeline RAG sea evaluable desde el día uno"
description: "Montar un RAG es fácil. Saber si funciona es lo difícil. Un tutorial práctico para instrumentar la evaluación antes de que el sistema esté en producción."
pubDate: 2026-06-23
tags: ["rag", "evaluacion", "tutorial", "produccion"]
category: tutorial
---

La mayoría de tutoriales de RAG terminan cuando el sistema devuelve una respuesta. El problema es que "devuelve una respuesta" y "devuelve una buena respuesta" son cosas muy distintas, y sin evaluación no puedes distinguirlas. Este tutorial va sobre lo segundo.

## El error de empezar sin métricas

El flujo típico es: montar el retriever, conectar el LLM, probar tres preguntas a mano, ver que "funciona" y desplegar. Un mes después alguien reporta respuestas malas y no tienes forma de saber si el problema es el retrieval, el prompt o el modelo.

La solución no es compleja: define métricas antes de escribir la lógica de generación.

## Las tres métricas mínimas

Para un RAG necesitas medir tres cosas separadas, porque fallan por motivos distintos:

1. **Context recall**: ¿el retriever trajo los documentos que contienen la respuesta? Si esto falla, ningún LLM te salva.
2. **Faithfulness**: ¿la respuesta se apoya en el contexto recuperado o el modelo se lo inventó?
3. **Answer relevance**: ¿la respuesta contesta realmente la pregunta?

## Montando el dataset de evaluación

No necesitas miles de ejemplos. Empieza con 30-50 pares pregunta/respuesta representativos de tu dominio. Guárdalos en un JSON simple:

```json
[
  {
    "question": "¿Cuál es la política de reembolso?",
    "ground_truth": "30 días desde la compra con recibo.",
    "relevant_docs": ["politica-reembolsos.md"]
  }
]
```

Este archivo es tu contrato. Cada cambio en el pipeline se valida contra él.

## Instrumentando la evaluación

La idea clave es que cada componente devuelva metadata evaluable. El retriever no solo devuelve texto: devuelve qué documentos usó. La generación no solo devuelve la respuesta: registra qué contexto recibió.

```python
def rag_query(question):
    docs = retriever.search(question, k=5)
    answer = llm.generate(question, context=docs)
    return {
        "answer": answer,
        "retrieved_ids": [d.id for d in docs],  # para context recall
        "context": [d.text for d in docs],       # para faithfulness
    }
```

Con esa metadata, calcular context recall es comparar `retrieved_ids` con `relevant_docs`. Faithfulness y relevance se pueden medir con un LLM como juez sobre `context` y `answer`.

## El bucle que importa

Una vez tienes esto, cada cambio (subir `k`, cambiar el embedding, tocar el prompt) se ejecuta contra el dataset y te da tres números. Si el faithfulness baja al cambiar el modelo, lo sabes en minutos, no en un incidente de producción.

## La parte aburrida que nadie hace

Ejecuta esta evaluación en CI. No como algo manual que corres "cuando te acuerdas". Un umbral mínimo de context recall que bloquee el merge convierte la evaluación de intención en garantía.

Montar el RAG te lleva una tarde. Hacerlo evaluable te lleva otra tarde. Esa segunda tarde es la que separa un prototipo de un sistema en el que puedes confiar.
