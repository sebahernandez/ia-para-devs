---
title: "Un millón de tokens de contexto: qué haces con ellos (y qué no)"
description: "Las ventanas de contexto gigantes ya son normales. La pregunta no es si caben tus documentos, sino si el modelo los usa bien. Lo que aprendí metiendo repos enteros."
pubDate: 2026-07-15
tags: ["contexto", "modelos", "rag", "coste"]
category: modelos
---

Meter un millón de tokens en una petición ya no es exótico. Cabe un repositorio mediano, un libro entero o meses de logs. La tentación es obvia: para qué montar un RAG si puedo pasarle todo. La respuesta corta: porque "cabe" y "lo aprovecha" no son lo mismo.

## El problema del centro perdido

Los modelos siguen prestando más atención al principio y al final del contexto que al medio. Con 1M de tokens, un dato crítico enterrado en el 40% del prompt puede pasar desapercibido aunque técnicamente esté ahí. Los benchmarks de "aguja en el pajar" mejoran cada versión, pero el efecto no ha desaparecido.

Consecuencia práctica: **coloca lo importante al principio o al final**, no lo entierres.

## El coste escala con lo que metes, no con lo que usas

Pagas por cada token de entrada, uses o no la información. Pasar un repo de 800K tokens para que el modelo conteste sobre una función cuesta lo mismo que si fuera relevante todo. Un RAG que recupera los 8K tokens que importan cuesta cien veces menos y muchas veces responde mejor.

## Cuándo la ventana gigante gana

- **Exploración sin índice**: "resume este código que veo por primera vez". No hay tiempo de montar retrieval.
- **Razonamiento cruzado**: preguntas que tocan muchas partes a la vez y no sabrías qué recuperar de antemano.
- **Prototipos**: antes de invertir en RAG, un contexto grande valida si la tarea es siquiera viable.

## Cuándo pierde

Producción con documentos estables y consultas repetidas. Ahí el RAG con caching es más barato, más rápido y más preciso. La ventana grande es una navaja suiza cara: úsala para lo que un cuchillo específico no cubre.

La ventana de 1M no mató al RAG. Lo volvió opcional para el prototipo y obligatorio para la escala.
