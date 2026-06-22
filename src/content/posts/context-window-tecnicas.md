---
title: "Ventanas de contexto largas vs RAG: no es una elección binaria"
description: "Con modelos que aceptan 1M de tokens, ¿sigue teniendo sentido construir pipelines de RAG? La respuesta depende del caso de uso. Aquí el análisis técnico honesto."
pubDate: 2025-06-18
tags: ["context-window", "rag", "arquitectura", "gemini"]
category: investigacion
---

Cuando Google anunció que Gemini 1.5 Pro aceptaba 1 millón de tokens de contexto, muchos plantearon la pregunta obvia: ¿para qué construir un sistema RAG complejo si puedes meter toda la base de conocimiento en el prompt?

La respuesta corta: ventanas largas y RAG resuelven problemas diferentes. La respuesta larga requiere entender los trade-offs reales.

## Qué ventana larga hace mejor

**Documentos que necesitas procesar en su totalidad**: Si el análisis requiere coherencia a lo largo de todo el documento (contratos legales, código complejo con dependencias, transcripciones de sesiones largas), meter todo en contexto es más fiable que hacer retrieval fragmentado.

**Cuando no sabes de antemano qué vas a necesitar**: RAG requiere que la query identifique los fragmentos relevantes. Si el análisis es exploratorio y no sabrás qué buscar hasta que leas, contexto completo gana.

**Corpus pequeño-mediano**: Si tu base de conocimiento tiene cientos de páginas (no miles), meterla completa en contexto es factible y elimina la complejidad de un pipeline de retrieval.

## Qué RAG hace mejor

**Escalabilidad**: Un corpus de millones de documentos no cabe en ninguna ventana de contexto. RAG escala a colecciones arbitrariamente grandes.

**Coste**: Llenar una ventana de 1M tokens en Gemini 1.5 Pro cuesta ~$7 por llamada. Para sistemas con muchas queries, es caro. RAG solo envía los fragmentos relevantes al modelo.

**Actualización del conocimiento**: Añadir o actualizar documentos en un índice vectorial es inmediato. Con contexto largo, tienes que incluir los nuevos documentos manualmente en cada llamada.

**Verificabilidad**: RAG con citas te dice exactamente de qué fragmento viene cada parte de la respuesta. Con contexto completo, el modelo puede combinar información de múltiples partes sin trazar la procedencia.

## El patrón híbrido que está emergiendo

En producción, el patrón más efectivo combina ambos:

1. RAG recupera los N documentos más relevantes
2. Esos N documentos se meten completos en una ventana de contexto grande

No solo los fragmentos del RAG, sino los documentos completos. Esto combina la eficiencia del retrieval con la comprensión holística de cada documento.

## El fenómeno "lost in the middle"

La investigación de Liu et al. (Stanford, 2023) demostró que los LLMs tienden a recordar mejor la información al principio y al final del contexto que en el medio. Para ventanas de 1M tokens, este sesgo puede ser significativo.

Si usas ventana larga, estructura el contexto poniendo la información más crítica al principio o al final del prompt.

---

*Fuentes: "Lost in the Middle" (Liu et al., Stanford 2023), paper técnico de Gemini 1.5, análisis de coste comparativo de contexto largo vs RAG de la comunidad LlamaIndex.*
