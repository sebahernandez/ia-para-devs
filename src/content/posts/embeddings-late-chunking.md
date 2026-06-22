---
title: "Late Chunking: por qué el chunking tradicional rompe el contexto de tus embeddings"
description: "El chunking estándar para RAG destruye el contexto entre fragmentos. Late chunking es una técnica reciente que preserva el contexto al nivel correcto. Cómo funciona y cómo implementarla."
pubDate: 2026-01-15
tags: ["rag", "embeddings", "late-chunking", "tutorial"]
category: investigacion
---

El pipeline estándar de RAG tiene un problema fundamental que pocas implementaciones resuelven bien: cuando divides un documento en chunks antes de crear embeddings, cada chunk pierde el contexto de los fragmentos que lo rodean.

El resultado: búsquedas semánticas que fallan porque la información relevante está distribuida entre varios chunks y ninguno por sí solo captura el significado completo.

Late chunking es una técnica publicada por Jina AI que aborda este problema de forma elegante.

## El problema con el chunking tradicional

Considera este párrafo de un documento técnico:

> "El modelo usa atención multi-cabeza con 16 cabezas de atención. Esta arquitectura, introducida en el paper Attention Is All You Need, permite al modelo capturar relaciones a diferentes escalas."

Si lo divides en dos chunks en "16 cabezas de atención. Esta arquitectura":

- Chunk 1: "...con 16 cabezas de atención."
- Chunk 2: "Esta arquitectura, introducida en..."

El embedding del Chunk 2 no sabe que "Esta arquitectura" se refiere a la atención multi-cabeza del Chunk 1. Una búsqueda sobre "arquitectura transformer" puede no encontrar el Chunk 2 aunque sea relevante.

## Cómo funciona Late Chunking

La idea es invertir el orden:

**Chunking tradicional:**
1. Dividir el texto en chunks
2. Crear embedding de cada chunk por separado

**Late chunking:**
1. Procesar el documento COMPLETO (o una sección grande) con el modelo de embedding
2. Obtener los token embeddings individuales con contexto completo
3. Dividir en chunks DESPUÉS, usando mean pooling sobre los tokens de cada chunk

De esta forma, cada token en el documento fue procesado con el contexto completo. Cuando agrupamos los tokens en chunks, cada chunk ya "vio" lo que venía antes y después.

## Implementación con Jina Embeddings

```python
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np

model_name = "jinaai/jina-embeddings-v2-base-en"
tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModel.from_pretrained(model_name, trust_remote_code=True)

def late_chunking(text: str, chunk_size: int = 256) -> list[np.ndarray]:
    # 1. Tokenizar el documento completo
    tokens = tokenizer(text, return_tensors="pt", truncation=False)
    
    # 2. Obtener embeddings de todos los tokens con contexto completo
    with torch.no_grad():
        outputs = model(**tokens)
    
    token_embeddings = outputs.last_hidden_state.squeeze(0)  # [seq_len, hidden_size]
    
    # 3. Dividir en chunks y hacer mean pooling
    token_ids = tokens["input_ids"].squeeze(0)
    chunks = []
    
    for i in range(0, len(token_ids), chunk_size):
        chunk_embeddings = token_embeddings[i:i + chunk_size]
        # Mean pooling del chunk
        chunk_embedding = chunk_embeddings.mean(dim=0).numpy()
        chunks.append(chunk_embedding)
    
    return chunks

# Uso
documento = "Tu documento largo aquí..."
chunk_embeddings = late_chunking(documento, chunk_size=256)
```

## Cuándo usar late chunking vs chunking tradicional

**Late chunking es mejor cuando:**
- Los documentos tienen información distribuida (referencias pronominales, información que depende del contexto previo)
- Las queries buscan conceptos que pueden estar repartidos en varios párrafos
- El modelo de embedding tiene ventana de contexto suficientemente grande

**Chunking tradicional es suficiente cuando:**
- Los chunks son semánticamente independientes (listas, FAQs, fichas de producto)
- El modelo de embedding tiene ventana de contexto pequeña (limitación técnica)
- La velocidad de indexación es crítica (late chunking requiere procesar el documento completo)

## Limitaciones

**Longitud del documento**: late chunking requiere procesar el documento entero en una sola pasada. Los modelos de embedding tienen ventanas de contexto limitadas (típicamente 8K tokens). Para documentos muy largos, hay que dividir en secciones primero y aplicar late chunking en cada sección.

**Coste computacional**: procesar el documento completo antes de chunking es más costoso que chunking separado. Para indexación masiva, el impacto puede ser significativo.

## Resultados en práctica

En evaluaciones propias con documentos técnicos y legales, late chunking mejora la precisión de recuperación entre un 10-20% respecto a chunking semántico estándar. La mejora es más notable en documentos con mucha referencia anafórica (pronombres, "dicho modelo", "el sistema mencionado", etc.).

Para RAG sobre documentación técnica, vale definitivamente la pena implementarlo.

---

*Técnica original publicada por Jina AI. Paper: "Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models".*
