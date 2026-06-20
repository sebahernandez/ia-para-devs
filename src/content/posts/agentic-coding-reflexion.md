---
title: "Agentic coding: lo que aprendí después de seis meses dejando que la IA escriba más código"
description: "Reflexión honesta sobre adoptar flujos de trabajo agénticos en desarrollo de software: qué ganamos, qué perdemos, y cuándo es contraproducente dejar que el agente haga demasiado."
pubDate: 2026-03-12
author: "Equipo Blog IA"
tags: ["agentic-coding", "productividad", "reflexión", "opinión"]
category: opinión
---

Durante los últimos seis meses usé Cursor y Windsurf en modo agente para la mayor parte de mi trabajo de código. No solo autocompletado o sugerencias inline: dejé que los agentes planificaran, escribieran, y en muchos casos iteraran sin intervención mía en cada paso. Estos son los resultados honestos.

## Lo que funcionó mejor de lo esperado

**El tiempo en tareas rutinarias cayó dramáticamente.** Escribir tests para código existente, migrar de una librería a otra, añadir manejo de errores, generar tipos TypeScript de esquemas JSON: estas tareas que antes tomaban horas ahora toman minutos. Aquí los agentes son genuinamente buenos y el resultado es confiable.

**El onboarding a codebases desconocidas mejoró.** Cuando toco un proyecto que no conozco, preguntarle al agente "explica qué hace este módulo y cómo se conecta con el resto" me da contexto en segundos que antes requería leer durante 20 minutos.

**Los bugs obvios los encuentra antes que yo.** Durante el desarrollo, los agentes atrapan errores de tipo, edge cases que se me pasan, y inconsistencias en la lógica antes de que lleguen a los tests.

## Lo que funcionó peor de lo esperado

**La arquitectura se resiente si no la guías activamente.** Los agentes son buenos implementando funcionalidades, pero no son buenos diseñando la estructura de alto nivel. Si les dejas libertad en la arquitectura, tienden a acumular deuda técnica invisible: abstracciones innecesarias, patrones inconsistentes, código que funciona pero que nadie querría mantener.

Aprendí esto con dolor: dejar que el agente "construyera la feature completa" en un proyecto nuevo resultó en código que funcionaba perfectamente pero que era difícil de entender y extender. Tuve que refactorizarlo yo.

**El modo agente es peligroso con código de producción sin supervisión.** En un par de ocasiones, el agente hizo cambios en archivos que no debería haber tocado para "hacer funcionar la feature". Los cambios eran técnicamente correctos pero rompían contratos implícitos con otras partes del sistema que el agente no conocía.

La lección: siempre revisa qué archivos modificó el agente, no solo si el resultado funciona.

**La confianza excesiva es real.** Me sorprendí aceptando código del agente sin leerlo bien varias veces. En la mayoría de casos estaba bien, pero en algunos casos el código tenía problemas sutiles que solo noté semanas después. El agente escribe con mucha confianza independientemente de si el código es correcto.

## El cambio más importante en mi forma de trabajar

Empecé a invertir más tiempo en especificar bien lo que quiero antes de dejar que el agente lo implemente. Un prompt de 200 palabras que describe exactamente el comportamiento esperado, los casos edge, y las restricciones produce resultados dramáticamente mejores que "implementa X".

Esto puede parecer que vuelve la velocidad al punto de partida, pero no es así: definir bien el problema es útil de todas formas y ahora lo hago de forma más explícita y pensada.

## Lo que no cambió

**El debugging difícil sigue siendo manual.** Para bugs complejos con múltiples causas posibles y comportamiento dependiente del contexto de producción, los agentes ayudan pero no reemplazan el análisis humano. Te dan hipótesis que explorar, no respuestas.

**Las decisiones de producto son mías.** Qué construir, para quién, con qué trade-offs: eso no lo delego. Y bien.

**La revisión de código no puede automatizarse completamente.** Los agentes pueden revisar código, pero la revisión que importa más (¿hace esto lo que el negocio necesita? ¿encaja con la visión del producto?) requiere contexto que los agentes no tienen.

## Mi configuración actual

Para trabajo diario:
- Modo agente para features nuevas bien especificadas
- Modo chat para debugging y preguntas sobre el código
- Sin modo agente para cambios en código de producción crítico sin revisión explícita
- Revisión de todo commit del agente antes de hacer push

El ratio que funciona: el agente escribe el 60-70% del código, yo escribo el 30-40% más crítico y reviso el 100%.

---

*Experiencia personal. Los flujos de trabajo óptimos varían según el tipo de proyecto y equipo.*
