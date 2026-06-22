---
title: "NotebookLM: Google crea la herramienta de investigación con IA que tiene sentido usar"
description: "NotebookLM deja subir tus propios documentos y hace preguntas sobre ellos con contexto real. El modo Audio Overviews que genera podcasts a partir de PDFs fue inesperadamente viral. Repasamos qué hace bien."
pubDate: 2025-06-12
tags: ["google", "notebooklm", "rag", "productividad"]
category: herramientas
---

La mayoría de herramientas de IA te dan respuestas genéricas basadas en lo que el modelo aprendió durante el entrenamiento. NotebookLM hace algo diferente: solo responde sobre los documentos que tú subes. No mezcla conocimiento general salvo para contextualizar.

Para investigación, análisis de documentos legales, revisión de código de un repositorio o síntesis de bibliografía académica, este enfoque tiene ventajas claras.

## Cómo funciona

Creas un "notebook" y subes fuentes: PDFs, documentos de Google Docs, páginas web, vídeos de YouTube, notas de texto. NotebookLM indexa el contenido y lo usa como contexto para responder tus preguntas.

La diferencia con un RAG genérico: cada respuesta viene con citas exactas al fragmento del documento donde está la información. Puedes hacer clic en la cita y ver el pasaje original. Si el modelo no encuentra la información en tus documentos, lo dice en lugar de inventarse algo.

## El motor: Gemini 1.5 Pro

NotebookLM usa Gemini 1.5 Pro como modelo de base, lo que le da acceso a la ventana de contexto larga. En la práctica, puedes subir decenas de documentos densos y el modelo los maneja.

El límite actual es de 50 fuentes por notebook, hasta 500.000 palabras o 200MB por fuente.

## Audio Overviews: el detalle viral

En septiembre de 2024, Google añadió Audio Overviews: la capacidad de generar un podcast de 10-20 minutos a partir de los documentos del notebook. Dos voces sintéticas discuten los puntos clave como si fueran presentadores de un programa.

La calidad de la conversación generada es sorprendentemente natural. Las voces hacen seguimiento del contexto, se interrumpen, expresan sorpresa. El uso de esta función se disparó inesperadamente porque muchas personas encuentran más fácil procesar información en formato auditivo.

Para desarrolladores: es útil para convertir documentación técnica densa o papers en algo que puedes escuchar mientras haces otra cosa.

## Qué no hace

NotebookLM no es un agente. No puede buscar en internet, no ejecuta código, no tiene memoria entre notebooks. Es una herramienta de lectura aumentada, no de producción de código.

También tiene limitaciones con tablas y datos numéricos: los procesa como texto, así que análisis cuantitativos complejos requieren otro enfoque.

## Disponibilidad

Gratuito con Google Account. NotebookLM Plus (de pago, parte de Google One AI Premium) da más notebooks, más fuentes por notebook y Audio Overviews en mayor calidad.

---

*Fuentes: Blog de Google Labs, documentación oficial de NotebookLM, reseñas de The Verge y Wired.*
