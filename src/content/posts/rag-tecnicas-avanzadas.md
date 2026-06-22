---
title: "RAG en 2025: más allá del vector search básico"
description: "La recuperación aumentada evolucionó. RAG híbrido, reranking, chunking inteligente y grafos de conocimiento son técnicas que marcan la diferencia entre un RAG que funciona y uno que falla en producción."
pubDate: 2025-01-12
tags: ["rag", "vector-search", "arquitectura", "embeddings"]
category: investigacion
---

El RAG básico —chunk, embed, search, generate— funciona como prototipo. En producción, empieza a fallar en casos que importan: preguntas que requieren combinar información de múltiples documentos, queries con términos técnicos específicos, o recuperación que depende de contexto que el usuario no incluye en la pregunta.

En 2024 y 2025, la investigación y la práctica avanzaron bastante en lo que podríamos llamar RAG de segunda generación.

## El problema con el vector search puro

Los embeddings son buenos para similitud semántica. Si preguntas "¿cómo funciona la autenticación?" y el documento habla de "gestión de sesiones de usuario", el embedding los conecta aunque las palabras exactas no coincidan.

Pero los embeddings fallan con términos exactos: nombres de funciones, identificadores, acrónimos técnicos, versiones específicas. "¿Qué hace la función `handleAuthCallback`?" puede no encontrar el fragmento relevante si el embedding semantiza demasiado.

## RAG híbrido: vectores + BM25

La solución más adoptada en producción: combinar búsqueda por embeddings con búsqueda léxica (BM25/keyword search). El resultado fusionado capta tanto la similitud semántica como la coincidencia exacta de términos.

```python
from langchain.retrievers import EnsembleRetriever
from langchain.retrievers import BM25Retriever
from langchain_community.vectorstores import FAISS

bm25_retriever = BM25Retriever.from_documents(docs)
bm25_retriever.k = 5

faiss_retriever = FAISS.from_documents(docs, embeddings).as_retriever(k=5)

ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, faiss_retriever],
    weights=[0.4, 0.6]
)
```

En benchmarks de recuperación, el RAG híbrido consistentemente supera al vector search puro entre un 10-20% en recall@k.

## Reranking: el segundo filtro que importa

El retriever inicial devuelve N candidatos. Un reranker evalúa cada par (query, candidato) con un modelo más preciso y reordena los resultados. Los primeros K candidatos reordenados van al contexto del LLM.

Cohere Rerank y los modelos cross-encoder de Hugging Face son las opciones más usadas. El coste es bajo comparado con la llamada al LLM principal, pero el impacto en calidad es significativo.

## Chunking estratégico

La granularidad del chunk importa más de lo que parece. Chunks demasiado pequeños pierden contexto. Chunks demasiado grandes diluyen la relevancia.

Estrategias que funcionan mejor que el chunking por tamaño fijo:

- **Sentence-window retrieval**: chunks pequeños para búsqueda, pero se recupera la ventana de oraciones alrededor del chunk encontrado
- **Parent document retrieval**: índices de resúmenes de sección, pero se recupera la sección completa
- **Semantic chunking**: dividir por cambios semánticos en lugar de por número de tokens

## GraphRAG: cuando las relaciones importan

Microsoft publicó GraphRAG en 2024, una arquitectura que construye un grafo de conocimiento a partir del corpus de documentos antes de hacer cualquier búsqueda. Las consultas pueden entonces explorar relaciones entre entidades que el vector search no captaría.

Es más costoso de construir pero mejora notablemente en preguntas que requieren síntesis de múltiples conceptos relacionados.

---

*Fuentes: Paper de RAG de Hugging Face (Lewis et al.), blog técnico de LlamaIndex, GraphRAG paper de Microsoft Research.*
