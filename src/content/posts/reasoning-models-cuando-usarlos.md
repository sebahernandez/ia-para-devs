---
title: "Reasoning models: potentes, lentos y caros. ¿Cuándo compensan?"
description: "Los modelos de razonamiento piensan antes de responder y aciertan más en tareas duras. También tardan más y cuestan más. Una guía sin hype para decidir cuándo usarlos."
pubDate: 2026-07-17
tags: ["razonamiento", "modelos", "coste", "opinión"]
category: opinión
---

Los reasoning models —esos que generan una cadena de razonamiento antes de darte la respuesta— se han normalizado. Y con ellos, el reflejo de usarlos para todo "por si acaso". Es un error caro. El razonamiento extendido es una herramienta con un nicho claro, no un upgrade universal.

## Qué pagas por el razonamiento

Esos tokens de pensamiento que no ves también se facturan y se generan de uno en uno. Una respuesta que un modelo normal da en 2 segundos puede tardar 20 con razonamiento extendido, y costar varias veces más. Para una tarea trivial, estás pagando un peaje de autopista para cruzar la calle.

## Dónde gana claramente

- **Matemáticas y lógica multi-paso**: donde un desliz temprano arruina el resultado.
- **Código complejo**: refactors con muchas restricciones, depuración de estado.
- **Planificación de agentes**: descomponer un objetivo en pasos con dependencias.
- **Análisis con trampas**: preguntas donde la respuesta obvia es la incorrecta.

El patrón común: tareas donde **pensar más de verdad cambia la respuesta**.

## Dónde es desperdicio

Clasificación, extracción, reformulación, respuestas factuales directas, cualquier cosa con structured output simple. Aquí el razonamiento no mejora el acierto y solo añade latencia y coste. Peor aún: a veces el modelo "se piensa de más" una respuesta que era obvia y la lía.

## La estrategia que uso: enrutado

No elijas un modelo para toda la app. Enruta por dificultad: un modelo rápido y barato para el 90% de peticiones, y escala a razonamiento solo cuando detectas una tarea dura o cuando el modelo barato expresa baja confianza. Un clasificador ligero delante te ahorra más que cualquier optimización de prompt.

Razonar está bien. Razonar sobre cuándo razonar está mejor.
