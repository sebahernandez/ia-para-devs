---
title: "Tool-use paralelo: el detalle que hace a los agentes usables"
description: "Los modelos actuales piden varias herramientas a la vez en un solo turno. Suena menor, pero cambia por completo la latencia y el diseño de tus agentes."
pubDate: 2026-07-13
tags: ["agentes", "tool-use", "latencia", "arquitectura"]
category: herramientas
---

Hasta hace poco, un agente que consultaba tres APIs las consultaba en serie: pensar, llamar a una, esperar, pensar, llamar a otra, esperar. Tres round-trips al modelo más tres a las herramientas. Con tool-use paralelo, el modelo emite las tres llamadas en un único turno y tú las ejecutas a la vez.

## Qué cambia en la práctica

El modelo devuelve un array de tool calls en la misma respuesta. Tu runtime las lanza en paralelo (`Promise.all` y punto) y devuelve todos los resultados juntos en el siguiente turno. Un flujo que eran 6 round-trips secuenciales pasa a 2.

```js
const calls = response.tool_calls; // [clima, calendario, tráfico]
const results = await Promise.all(
  calls.map(c => ejecutarHerramienta(c.name, c.args))
);
// devuelves los tres resultados en un solo turno
```

## Dónde te muerde

El paralelismo asume que las llamadas son **independientes**. Si la herramienta B necesita el resultado de A, el modelo debería encadenarlas en turnos distintos, pero a veces se equivoca y las pide juntas. Dos defensas:

1. Describe bien las dependencias en la descripción de cada herramienta.
2. Haz tus herramientas idempotentes y tolerantes a orden. Si una escribe estado, que no dependa de que otra haya corrido antes.

## El coste oculto: errores en lote

Si lanzas cinco llamadas y dos fallan, tienes que devolver los cinco resultados —éxitos y errores— para que el modelo decida. No abortes todo el turno por un fallo parcial; devuelve el error como resultado de esa herramienta y deja que el modelo reaccione. Tratar cada fallo como excepción global rompe la conversación.

## Cuándo importa de verdad

En agentes que hacen fan-out —buscar en varias fuentes, validar contra varios servicios, enriquecer un registro desde varias APIs— el paralelismo recorta la latencia percibida a la mitad o más. En agentes lineales de un paso, no cambia nada. Como siempre: mídelo antes de celebrarlo.
