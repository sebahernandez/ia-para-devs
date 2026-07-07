---
title: "La fatiga del hype de agentes: por qué prometimos demasiado"
description: "Después de dos años de demos espectaculares, el discurso de los agentes autónomos empieza a chocar con la realidad de producción. Una reflexión sobre la brecha."
pubDate: 2026-06-27
tags: ["agentes", "hype", "opinión", "produccion"]
category: opinión
---

Cada conferencia de 2024 y 2025 tuvo su demo de agente autónomo. Un modelo que reservaba vuelos, escribía código, gestionaba tu calendario y, en el escenario, todo salía perfecto. A mitad de 2026, el entusiasmo se ha enfriado, y creo que es sano entender por qué.

## La demo es fácil, producción es difícil

Una demo de agente es un entorno controlado: la tarea está elegida para que funcione, el estado inicial es limpio, y si falla, se corta y se repite la toma. Producción es lo contrario: entradas impredecibles, estados corruptos, casos borde que nadie previó, y sin nadie cortando la toma cuando el agente se equivoca.

La brecha entre esos dos mundos no se cerró en dos años. Sigue ahí, y es más grande de lo que las demos sugieren.

## El problema de la acumulación de error

Un agente que toma diez decisiones con 95% de acierto cada una tiene un 60% de probabilidad de completar la cadena entera sin error. Baja a veinte pasos y estás por debajo del 40%. La autonomía multiplica los puntos de fallo, y los errores se componen.

Por eso los agentes que sí funcionan en producción son los que **acotan drásticamente el número de pasos autónomos** y meten verificación humana o determinista en los puntos críticos. No son "agentes autónomos". Son flujos con IA en pasos concretos.

## No es fracaso, es recalibración

Quiero ser claro: esto no significa que los agentes sean humo. Significa que la versión que se vendió (autonomía general sin supervisión) no era realista, y la versión que funciona (autonomía acotada con verificación) es menos espectacular pero genuinamente útil.

Los sistemas multi-agente en dominios cerrados (procesar facturas, triar tickets, generar y testear código en un scope definido) funcionan hoy y aportan valor real. Lo que no funciona es el "agente que hace todo".

## Lo que deberíamos haber dicho

En vez de "los agentes reemplazarán trabajos completos", el mensaje honesto habría sido: "los agentes automatizan subtareas bien definidas dentro de flujos que un humano diseña y supervisa". Menos titular, más cierto.

La fatiga del hype no es mala. Es el momento en que dejamos de vender la fantasía y empezamos a construir lo que de verdad aporta valor. Ese momento siempre llega después de la euforia, y siempre es cuando el trabajo serio empieza.
