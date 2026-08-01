---
title: "Fine-tuning en 2026: casi nunca lo necesitas (y cuándo sí)"
description: "Con modelos base tan capaces, el fine-tuning dejó de ser el primer recurso. Cuándo un buen prompt basta, cuándo RAG es la respuesta y cuándo entrenar de verdad compensa."
pubDate: 2026-07-29
tags: ["fine-tuning", "prompting", "rag", "opinión"]
category: opinión
---

Hace dos años, la respuesta a "el modelo no hace lo que quiero" era fine-tuning. Hoy, con modelos base que siguen instrucciones complejas y ventanas de contexto enormes, el fine-tuning se ha convertido en el último recurso, no el primero. La mayoría de equipos que "necesitan fine-tuning" en realidad necesitan un mejor prompt o un RAG.

## El orden correcto de intentos

1. **Prompt engineering**. Instrucciones claras, ejemplos few-shot, formato de salida definido. Resuelve más de lo que la gente cree y su ciclo de iteración es de segundos.
2. **RAG**. Si el problema es *conocimiento que el modelo no tiene* —tus documentos, tus datos—, no lo metas por entrenamiento, recupéralo en contexto. Se actualiza sin reentrenar.
3. **Fine-tuning**. Solo si lo anterior no basta.

Saltarse los dos primeros pasos y entrenar directamente es pagar mucho para resolver mal lo que un prompt resolvía bien.

## Cuándo el fine-tuning sí gana

El fine-tuning enseña **comportamiento y forma**, no hechos. Compensa cuando:

- Necesitas un **formato o estilo muy específico** de forma consistente y describirlo en el prompt se vuelve enorme.
- Tienes una **tarea estrecha y de alto volumen** donde recortar tokens de prompt en cada llamada ahorra dinero real a escala.
- Quieres **destilar** un modelo grande y caro en uno pequeño y barato para una tarea concreta.

Fíjate que ninguno es "el modelo no sabe sobre mi dominio". Eso es trabajo de RAG.

## El coste que no está en la factura de entrenamiento

Un modelo fine-tuneado es tuyo para mantener. Cuando salga el siguiente modelo base —mejor y más barato— tu versión afinada se queda atrás y toca reentrenar. Un sistema basado en prompts y RAG se actualiza cambiando una línea de config. Ese coste de mantenimiento a menudo supera cualquier ahorro del fine-tuning.

Entrena cuando hayas agotado lo barato, no antes.
