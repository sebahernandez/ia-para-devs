---
title: "Interpretabilidad mecanicista en 2026: qué hemos aprendido de mirar dentro"
description: "El campo que intenta entender qué pasa realmente dentro de un modelo ha avanzado mucho. Un repaso accesible a los resultados que importan y a lo que aún no sabemos."
pubDate: 2026-06-29
tags: ["interpretabilidad", "investigacion", "seguridad", "llms"]
category: investigacion
---

Durante años tratamos a los LLMs como cajas negras: entra texto, sale texto, y en medio pasan cosas que nadie entiende del todo. La interpretabilidad mecanicista es el intento de abrir esa caja y describir los mecanismos internos. En 2026 el campo ha madurado lo suficiente como para que valga la pena un balance.

## Qué se busca exactamente

La pregunta central es simple de enunciar y difícil de responder: **¿qué representa cada parte del modelo y cómo se combinan esas representaciones para producir una respuesta?** No "qué predice", sino "por qué predice eso".

## El avance de los sparse autoencoders

El resultado más importante de los últimos dos años son los sparse autoencoders (SAE). La idea: las activaciones de un modelo son una superposición densa de muchos conceptos mezclados, y un SAE aprende a descomponerlas en features individuales e interpretables.

Con ellos se han identificado features que se activan ante conceptos concretos: un idioma, un tono emocional, la presencia de código, hasta conceptos abstractos como "engaño" o "sicofancia". Y no solo identificar: **manipular**. Amplificar o suprimir una feature cambia el comportamiento del modelo de forma predecible.

## Por qué esto importa más allá de la curiosidad

Si puedes identificar la feature que corresponde a "el modelo está dando una respuesta que cree que el usuario quiere oír en vez de la verdad", tienes una herramienta de seguridad real. Puedes detectar sicofancia, monitorizar si un modelo "sabe" que algo es falso mientras lo afirma, o auditar por qué tomó una decisión.

Esto convierte la interpretabilidad de un ejercicio académico en infraestructura de governance.

## Lo que todavía no sabemos

Seamos honestos sobre los límites:

- **No escala del todo.** Interpretar features en un modelo pequeño es una cosa; hacerlo exhaustivamente en un modelo de frontera con miles de millones de parámetros sigue siendo parcial.
- **Las features no son limpias.** Muchas son polisemánticas o se solapan de formas que complican la interpretación.
- **Entender ≠ controlar.** Saber qué hace un mecanismo no garantiza poder corregir un comportamiento no deseado sin efectos colaterales.

## Dónde estamos de verdad

Hemos pasado de "no tenemos ni idea de qué pasa dentro" a "tenemos herramientas para inspeccionar partes concretas y a veces intervenir". Es un progreso enorme respecto a 2023, y a la vez estamos lejos de una comprensión completa.

Lo que más me esperanza no es un resultado concreto, sino que la interpretabilidad dejó de ser un nicho para convertirse en una prioridad de los grandes labs. Cuando el objetivo pasa de "hacer el modelo más capaz" a "entender el modelo que ya tenemos", el campo madura. Y madurar es exactamente lo que necesitamos.
