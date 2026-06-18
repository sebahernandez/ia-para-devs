---
title: "Embeddings en 2025: qué modelo de vectores elegir para tu aplicación"
description: "text-embedding-3-large de OpenAI, Cohere Embed v3, y los modelos de HuggingFace como BGE o E5 tienen rendimiento y costes muy distintos. Guía práctica para elegir según el caso de uso."
pubDate: 2025-03-20
author: "Equipo Blog IA"
tags: ["embeddings", "vector-search", "openai", "rag"]
category: investigacion
---

Los embeddings son el cimiento de cualquier sistema RAG: transforman texto en vectores numéricos que capturan significado semántico. Elegir mal el modelo de embedding puede sabotear todo lo que venga después, independientemente de cuán bueno sea el LLM final.

## Los modelos principales en 2025

### OpenAI text-embedding-3-large y small

OpenAI lanzó su tercera generación de embeddings en enero de 2024. Los cambios más importantes:

- **Dimensionalidad variable**: puedes truncar el vector a dimensiones menores sin perder mucha calidad. Útil para reducir costes de almacenamiento.
- **Mejor rendimiento en MTEB**: el benchmark estándar para embeddings.
- **Precio más bajo**: text-embedding-3-small cuesta $0.02 por millón de tokens, 5x más barato que ada-002.

`text-embedding-3-large` (3072 dimensiones) es la opción de máxima calidad. `text-embedding-3-small` (1536 dimensiones) ofrece buen rendimiento a menor coste.

### Cohere Embed v3

Cohere tiene la ventaja de ofrecer embeddings multilingües de alta calidad. Embed v3 soporta más de 100 idiomas con rendimiento consistente, algo que los modelos de OpenAI no igualan en idiomas no ingleses.

También tiene un parámetro `input_type` que permite especificar si el texto es un documento o una query, produciendo vectores optimizados para cada tipo.

### Modelos open-source: BGE, E5, GTE

Para quienes no quieren dependencia de APIs externas, los modelos de Hugging Face son serios competidores:

- **BGE-M3 (BAAI)**: multilingüe, 100+ idiomas, rivaliza con Cohere en rendimiento. Gratuito.
- **E5-large-v2 (Microsoft)**: excelente rendimiento en inglés, buen equilibrio tamaño/calidad.
- **GTE-large (Alibaba)**: muy buen rendimiento en benchmarks MTEB.

La desventaja: tienes que alojar el modelo tú mismo o usar un proveedor como Hugging Face Inference.

## Cómo elegir

**Usa OpenAI si**: ya estás en el ecosistema de OpenAI, priorizas la simplicidad de infraestructura y el inglés es tu idioma principal.

**Usa Cohere si**: necesitas multilingüe de alta calidad o tienes un caso de uso donde distinguir query de documento importa.

**Usa BGE-M3 o similar si**: quieres control total, no quieres pagar por token de embedding, o necesitas un modelo que puedas ejecutar on-premise.

## La métrica que importa: MTEB

El Massive Text Embedding Benchmark evalúa modelos en 58 datasets y 8 categorías: clasificación, clustering, retrieval, reranking, etc. Es el benchmark estándar de la industria para comparar embeddings.

No elijas un modelo de embedding solo por su puntuación MTEB general. Fíjate en la subcategoría que corresponde a tu caso de uso, especialmente si es retrieval o similarity.

---

*Fuentes: MTEB leaderboard de HuggingFace, documentación de OpenAI Embeddings, paper de BGE-M3 (Chen et al., 2024).*
