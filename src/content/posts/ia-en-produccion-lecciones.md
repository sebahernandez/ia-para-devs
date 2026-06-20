---
title: "Lo que aprendimos desplegando LLMs en producción durante 18 meses"
description: "Lecciones no evidentes de operar sistemas con LLMs en producción: los problemas que nadie documenta, los patrones que funcionan, y los errores que más se repiten."
pubDate: 2026-05-07
author: "Equipo Blog IA"
tags: ["producción", "lecciones", "ingeniería", "opinión"]
category: opinión
---

Desplegar un LLM en producción es la parte fácil. Lo difícil es operarlo durante meses, con usuarios reales, con actualizaciones de modelos que cambian comportamientos, con prompts que se rompen cuando el modelo mejora, con costes que escalan cuando el producto tiene éxito.

Estas son las lecciones que no están en la documentación oficial.

## Los prompts del sistema se rompen cuando el modelo mejora

Nadie habla de esto lo suficiente: cuando el proveedor actualiza el modelo, los comportamientos cambian. Los prompts que funcionaban perfectamente con GPT-4o-2024-05 pueden producir outputs diferentes con GPT-4o-2024-11. Claude 3.5 Sonnet de junio es diferente de Claude 3.5 Sonnet de octubre.

**Lo que aprendimos**: fijar versiones específicas del modelo en producción. No uses el alias genérico (`gpt-4o`) en producción; usa la versión exacta (`gpt-4o-2024-11-20`). Cuando quieras actualizar, hazlo conscientemente después de probar con el nuevo modelo.

Muchos equipos tienen bugs de producción cuya causa raíz fue "el modelo cambió y el prompt dejó de funcionar igual".

## Las alucinaciones son predecibles, no aleatorias

Hay un mito de que las alucinaciones son impredecibles y aleatorias. En la práctica, con suficientes datos de producción, puedes identificar patrones: qué tipos de queries producen alucinaciones con más frecuencia, en qué dominio, con qué tipo de formulación.

**Lo que aprendimos**: analiza los outputs de producción para encontrar clusters de alucinaciones. Una vez que sabes dónde falla el modelo, puedes añadir validaciones específicas, cambiar el prompt para ese caso, o añadir RAG para el tipo de información donde el modelo alucina más.

El monitoreo de alucinaciones requiere un sistema de evaluación, no solo logs de respuestas.

## El coste escala peor de lo que esperas

La estimación de coste en un MVP no escala linealmente cuando el producto crece. Las razones:
- Los usuarios hacen queries más largas que en las pruebas iniciales
- Los casos edge producen respuestas más largas (el modelo razona más cuando el input es ambiguo)
- Los prompts del sistema crecen con el tiempo a medida que añades instrucciones
- El caching no funciona tan bien como en el benchmark si los inputs de usuario varían mucho

**Lo que aprendimos**: añade monitoreo de tokens por request desde el primer día. Pon alertas cuando el percentil 95 de tokens suba. Analiza las queries más caras: suelen ser un subset pequeño que puedes optimizar.

## La latencia percibida importa más que la latencia real

10 segundos de latencia con streaming (el usuario ve la respuesta aparecer palabra a palabra) se percibe como más rápido que 3 segundos sin streaming donde la pantalla está en blanco.

**Lo que aprendimos**: implementa streaming desde el inicio para cualquier interfaz de usuario. El coste de implementarlo después es mayor que hacerlo bien desde el principio.

## Los prompts tienen que versionarse como código

Cuando un prompt cambia en producción, tienes que saber exactamente qué cambió, cuándo, y por qué. Si algo se rompe, necesitas poder revertir.

**Lo que aprendimos**: trata los prompts como código: en control de versiones, con código de review, con tests antes de deployar. Los cambios de prompt son deployments.

Un sistema de A/B testing de prompts es invaluable para validar cambios antes de aplicarlos a todo el tráfico.

## El fallback graceful es obligatorio

Los LLMs fallan: timeouts, errores de la API, respuestas malformadas. En producción, tu sistema tiene que manejar esto sin que el usuario vea un error genérico.

**Lo que aprendimos**: diseña el fallback desde el principio. ¿Qué hace tu aplicación si el LLM no responde en 30 segundos? ¿Si devuelve una respuesta que no pasa la validación? La respuesta no puede ser "muestra un error 500".

## Los límites de rate son más restrictivos de lo que crees

Los límites de rate de las APIs de LLMs son más bajos de lo que parece necesario cuando tienes usuarios concurrentes. En momentos de pico, los errores 429 son más frecuentes de lo esperado.

**Lo que aprendimos**: implementa retry con exponential backoff desde el inicio. Diseña las colas de requests para manejar picos. Considera usar múltiples proveedores como fallback si la disponibilidad es crítica.

## La evaluación humana no puede ignorarse

Los benchmarks automatizados no capturan todo lo que importa. Especialmente para casos donde la "calidad" tiene dimensiones subjetivas (tono, utilidad percibida, alineación con la voz de tu marca).

**Lo que aprendimos**: establece un proceso de evaluación humana regular, aunque sea muestral. 50 respuestas revisadas por alguien del equipo cada semana te dan información que ningún benchmark automatizado puede darte.

## La conclusión que más sorprende

El problema principal de los LLMs en producción no es que los modelos sean malos. Es que son lo suficientemente buenos para que los equipos los desplieguen sin la infraestructura de operación adecuada, y luego tienen que construir esa infraestructura mientras el sistema ya está en producción.

Construir la infraestructura de observabilidad, evaluación, y operación desde el principio, aunque ralentice el MVP, evita deuda técnica muy cara de pagar después.

---

*Experiencias acumuladas operando sistemas con LLMs desde 2024. Los patrones son generalizables aunque los detalles varían por caso.*
