---
title: "Reranking: el paso barato que arregla la mitad de los RAG malos"
description: "Tu retriever trae documentos aproximadamente relevantes. Un reranker los reordena por relevancia real antes de pasarlos al modelo. Cómo y por qué añadirlo."
pubDate: 2026-07-20
tags: ["rag", "reranking", "embeddings", "tutorial"]
category: tutorial
---

La queja más común sobre los RAG es "recupera cosas relevantes pero no las mejores". Casi siempre la causa es la misma: la búsqueda vectorial optimiza para velocidad, no para precisión fina. El reranking es el eslabón que falta, y es sorprendentemente barato de añadir.

## Por qué el retriever solo no basta

Los embeddings comprimen cada documento en un vector y buscas por similitud coseno. Es rapidísimo sobre millones de documentos, pero esa compresión pierde matiz: dos textos pueden quedar cerca en el espacio vectorial sin que uno responda mejor que otro a tu pregunta concreta.

## Qué hace un reranker

Un modelo cross-encoder mira **la pregunta y el documento juntos** y emite un score de relevancia real. Es más caro por par, así que no lo corres sobre toda la base: lo corres sobre los candidatos que ya trajo el retriever.

```text
1. Retriever vectorial  -> top 50 candidatos (rápido, aproximado)
2. Reranker cross-encoder -> reordena esos 50 (lento, preciso)
3. Pasas los top 5 al LLM
```

Recuperas ancho, reordenas fino, entregas estrecho. Lo mejor de los dos mundos.

## El impacto real

En la práctica, subir de top-5 vectorial directo a top-5 tras rerankear sobre 50 candidatos mejora notablemente la faithfulness de las respuestas, porque el modelo ya no tiene que ignorar ruido. Y como el LLM recibe menos documentos y mejores, también bajas el coste de generación.

## Cuándo no lo necesitas

Si tu corpus es pequeño y homogéneo, o si tus consultas son muy directas, el retriever solo ya acierta y el reranker solo añade latencia. Añádelo cuando midas que el problema está en el orden de lo recuperado, no en otra parte. Instrumenta el context recall primero; si ya es alto y las respuestas siguen flojas, entonces sí, rerankea.
