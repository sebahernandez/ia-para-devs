---
title: "Agentes de IA: arquitecturas que funcionan en producción (y las que no)"
description: "El concepto de agente de IA existe desde hace años, pero las implementaciones prácticas que realmente funcionan son pocas. Repasamos los patrones que están dando resultados y los antipatrones más comunes."
pubDate: 2025-05-15
author: "Equipo Blog IA"
tags: ["agentes", "arquitectura", "llm", "producción"]
category: investigacion
---

"Agente de IA" es uno de los términos más usados y menos definidos del ecosistema actual. Para este artículo, usamos una definición práctica: un sistema donde un LLM toma decisiones sobre qué acciones ejecutar, en qué orden, basándose en el objetivo y el estado actual.

## Los patrones que funcionan

### ReAct: Razonar y Actuar en bucle

ReAct (Reasoning + Acting) es el patrón más probado. El modelo alterna entre:
- **Thought**: razonamiento sobre el estado actual y qué hacer
- **Action**: ejecutar una herramienta
- **Observation**: procesar el resultado de la herramienta

```
Thought: Necesito saber el precio actual de la acción
Action: search_stock_price(symbol="AAPL")
Observation: AAPL cotiza a $187.43
Thought: Ahora puedo calcular el cambio respecto al día anterior
Action: get_previous_close(symbol="AAPL")
...
```

ReAct funciona bien para tareas con pasos claros y herramientas bien definidas. Falla cuando el espacio de decisiones es muy amplio o los pasos son muy interdependientes.

### Plan-and-Execute: planificación separada de ejecución

En lugar de planificar y ejecutar en el mismo bucle, este patrón tiene dos fases:

1. Un LLM crea un plan completo de pasos
2. Otro LLM (o el mismo) ejecuta cada paso

La ventaja: el plan puede revisarse antes de ejecutarse. La desventaja: los planes generados antes de ejecutar nada pueden quedar obsoletos cuando las condiciones cambian.

### Multi-agent: agentes especializados coordinados

Varios agentes con responsabilidades diferentes que se pasan información. Un agente "orchestrator" delega tareas a agentes "worker" especializados.

Funciona cuando las subtareas son suficientemente independientes. Añade complejidad significativa: gestión de estado entre agentes, fallos en cascada, debugging difícil.

## Los antipatrones más comunes

**El agente todopoderoso**: darle al agente acceso a demasiadas herramientas. Más herramientas significa más superficie para errores y más dificultad para que el modelo elija bien.

**Sin estado ni memoria**: agentes que no recuerdan lo que hicieron dos pasos antes. Produce bucles y trabajo duplicado.

**Sin límites de iteración**: un agente sin un máximo de pasos puede ejecutarse indefinidamente en bucles. Siempre pon límites explícitos.

**Herramientas no idempotentes sin confirmación**: si una herramienta tiene efectos secundarios (enviar email, modificar base de datos), el agente debe confirmar antes de ejecutarla, no hacerlo automáticamente.

## El estado del arte en frameworks

**LangGraph**: el framework más maduro para agentes con estado. Usa un grafo donde los nodos son funciones y las aristas son transiciones condicionales.

**CrewAI**: para multi-agent con roles definidos. Más opinionado, menos flexible.

**Autogen de Microsoft**: enfocado en colaboración entre agentes, con soporte para conversaciones entre múltiples modelos.

Para empezar, la recomendación es implementar ReAct a mano antes de adoptar un framework: entender qué hace cada pieza es esencial para debuggear cuando falle.

---

*Fuentes: Paper "ReAct: Synergizing Reasoning and Acting" (Yao et al., 2023), documentación de LangGraph, análisis de Anthropic sobre patrones de agentes.*
