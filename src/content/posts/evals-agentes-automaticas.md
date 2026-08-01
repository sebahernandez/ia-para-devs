---
title: "Evaluar agentes es más difícil que evaluar modelos (y por qué importa)"
description: "Un modelo se evalúa por respuesta. Un agente se evalúa por trayectoria: los pasos, las herramientas, el estado final. Cómo montar evals para sistemas que actúan."
pubDate: 2026-07-24
tags: ["evaluacion", "agentes", "investigacion", "produccion"]
category: investigacion
---

Evaluar un LLM es relativamente sencillo: entrada, salida, comparas contra una referencia. Evaluar un agente —algo que planifica, llama herramientas y modifica estado a lo largo de varios turnos— es otra bestia. No basta con mirar la respuesta final; el agente pudo llegar a la respuesta correcta por el camino equivocado, o al revés.

## Los tres niveles que hay que medir

1. **Resultado final**: ¿el estado del mundo quedó como debía? (el registro se creó, el email se envió, el ticket se cerró).
2. **Trayectoria**: ¿usó las herramientas adecuadas en un orden razonable, o dio veinte vueltas para algo de dos pasos?
3. **Coste del camino**: número de turnos, tokens y llamadas a herramientas. Un agente que acierta pero gasta diez veces más no es un agente que acierta.

Medir solo el resultado final oculta agentes frágiles que aciertan por suerte. Medir solo la trayectoria castiga soluciones creativas que funcionan. Necesitas los tres.

## El problema de la referencia

Para una pregunta factual hay una respuesta correcta. Para una tarea agéntica suele haber **varias trayectorias válidas**. Comparar contra una única secuencia "de oro" penaliza caminos alternativos correctos. Dos salidas a esto:

- **Evaluar por asserts sobre el estado final**, no por igualdad de pasos. ¿Se cumplió la postcondición? Da igual cómo.
- **LLM-as-judge sobre la trayectoria**, con una rúbrica clara de qué cuenta como razonable.

## Empieza pequeño y determinista

Antes de montar un juez con LLM, escribe un puñado de casos con postcondiciones verificables por código: "tras esta tarea, la base de datos contiene X". Son baratos, deterministas y atrapan las regresiones más groseras. El juez con LLM viene después, para lo que no puedes assertar mecánicamente.

Un agente sin evals no es un agente en producción: es un experimento en producción.
