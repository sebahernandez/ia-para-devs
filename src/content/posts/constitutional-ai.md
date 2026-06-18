---
title: "Constitutional AI: cómo Anthropic entrena modelos para alinearse con principios sin feedback humano exhaustivo"
description: "CAI es la técnica de Anthropic para reducir comportamientos dañinos usando al propio modelo como crítico. Explicamos el mecanismo y por qué importa para quienes construyen aplicaciones con LLMs."
pubDate: 2025-02-18
author: "Equipo Blog IA"
tags: ["anthropic", "alineamiento", "constitutional-ai", "seguridad"]
category: investigacion
---

Entrenar un modelo de lenguaje para que sea útil, inofensivo y honesto es difícil. El enfoque más común es RLHF (Reinforcement Learning from Human Feedback): humanos evalúan las respuestas del modelo y esa señal guía el entrenamiento. Funciona, pero escala mal: necesitas miles de anotaciones humanas para cada versión del modelo.

Anthropic publicó Constitutional AI en 2022 como alternativa que reduce la dependencia de feedback humano para el componente de "inofensivo".

## Cómo funciona la "constitución"

La idea central: en lugar de pedirle a humanos que evalúen si una respuesta es dañina, le das al modelo un conjunto de principios (la "constitución") y le pides que evalúe sus propias respuestas.

El proceso tiene dos fases:

**Fase 1 - Supervisión con IA**:
1. El modelo genera respuestas a prompts potencialmente problemáticos
2. El mismo modelo (u otro) critiqua esas respuestas según la constitución
3. El modelo revisa su respuesta para alinearse con los principios
4. Este proceso genera datos de entrenamiento supervisado

**Fase 2 - RLAIF (RL from AI Feedback)**:
1. Se generan pares de respuestas
2. El modelo elige cuál es más consistente con la constitución
3. Esas preferencias alimentan un modelo de recompensa
4. El modelo principal se entrena con ese modelo de recompensa

## La constitución en la práctica

La constitución de Anthropic incluye principios como:
- "Elige la respuesta que sea menos dañina"
- "Elige la respuesta que no ayude a actividades ilegales"
- "Elige la respuesta que sea más honesta"
- Principios del "Contrato Social de Rawls" y la "Declaración Universal de los Derechos Humanos"

El número de principios varía entre 16 y varios cientos dependiendo de la versión.

## Por qué importa para los desarrolladores

Si construyes aplicaciones con Claude o cualquier modelo basado en CAI, tienes algunas garantías sobre el comportamiento base del modelo sin que tengas que implementar todos los guardrails tú mismo.

También hay implicaciones para la personalización: los modelos entrenados con CAI tienen restricciones que no se pueden eliminar fácilmente con el system prompt. Eso es bueno en muchos contextos, pero significa que no puedes sacar ciertos comportamientos sin fine-tuning.

## Limitaciones

CAI no resuelve el problema de alineamiento. Reduce algunos tipos de daño pero crea nuevos sesgos: los modelos entrenados con una constitución específica pueden rechazar solicitudes legítimas que el criterio de la constitución clasifica erróneamente.

---

*Fuentes: Paper original "Constitutional AI" de Anthropic (Bai et al., 2022), blog técnico de Anthropic sobre seguridad de modelos.*
