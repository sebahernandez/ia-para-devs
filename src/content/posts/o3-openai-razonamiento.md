---
title: "o3 de OpenAI: el salto de razonamiento que nadie esperaba tan pronto"
description: "o3 supera a o1 en todos los benchmarks relevantes y alcanza rendimiento humano experto en tareas de ciencia. Qué significa esto y qué limitaciones tiene."
pubDate: 2025-12-21
author: "Equipo Blog IA"
tags: ["o3", "openai", "razonamiento", "benchmarks"]
category: modelos
---

OpenAI lanzó o3 y los números son impresionantes. ARC-AGI: 87.5% (los humanos promedian alrededor del 85%). AIME 2024: 96.7%. FrontierMath: resultados que ningún modelo había alcanzado antes. La pregunta que todo el mundo se hace es la misma: ¿es esto un salto cualitativo o más de lo mismo con benchmarks más altos?

## Los números que importan

**ARC-AGI** es el benchmark que más atención ha recibido porque fue diseñado explícitamente para resistir a los LLMs: tareas de razonamiento visual que requieren generalización, no memorización. o3 alcanzó el 87.5% en la versión estándar y el 75.7% en la versión de alta eficiencia computacional. Los humanos están alrededor del 85%.

**AIME 2024** (American Invitational Mathematics Examination): 96.7%. Este examen de matemáticas de competición es notoriamente difícil para los modelos actuales. El resultado de o3 está al nivel de los mejores matemáticos humanos en ese test.

**SWE-bench Verified** (resolución de bugs reales de software): 71.7%, por encima de o1 (48.9%) y Claude 3.5 Sonnet (49%).

## Cómo funciona: "compute escalado en inferencia"

La diferencia técnica central de o3 respecto a modelos anteriores es que escala compute durante la inferencia, no solo durante el entrenamiento. El modelo puede dedicar más pasos de razonamiento a problemas más difíciles.

Esto tiene una implicación práctica importante: o3 tiene dos modos de uso con costes muy diferentes:

- **o3-mini**: eficiente, menos capacidad de razonamiento extendido
- **o3 completo**: mucho más capacidad, pero el coste por query puede ser significativamente más alto que modelos anteriores

Para problemas simples, o3-mini es la opción. Para problemas que genuinamente requieren razonamiento profundo (matemáticas avanzadas, código complejo, análisis científico), o3 completo tiene sentido aunque el coste sea mayor.

## Lo que no cambia

**Las alucinaciones siguen existiendo.** o3 razona mejor, pero no tiene acceso a conocimiento adicional. Si el modelo no sabe algo, el razonamiento extendido no lo inventará correctamente. RAG sigue siendo necesario para tareas con conocimiento factual específico.

**La latencia aumenta con el razonamiento.** Un query que requiere razonamiento extendido puede tardar minutos, no segundos. Para aplicaciones interactivas esto es un problema real.

**Los benchmarks no son el mundo real.** ARC-AGI y AIME miden tipos específicos de razonamiento. Los problemas del mundo real son más ambiguos, más abiertos, y más dependientes de contexto que cualquier benchmark.

## Qué significa para los desarrolladores

o3 abre casos de uso que antes no eran viables:

- **Análisis científico automatizado**: revisar papers, identificar metodologías, proponer experimentos
- **Debugging de sistemas complejos**: razonamiento sobre código que interactúa con infraestructura compleja
- **Matemáticas y estadística avanzada**: resolver problemas que antes requerían especialistas
- **Planificación de proyectos complejos**: descomponer problemas con muchas interdependencias

Para la mayoría de casos de uso de producción (chatbots, generación de contenido, extracción de datos), o3 es excesivo. GPT-4o o Claude 3.5 Sonnet siguen siendo la opción práctica para esos casos.

## El debate sobre AGI

OpenAI afirma que o3 muestra "capacidades de razonamiento de nivel AGI en algunos dominios". El debate sobre qué cuenta como AGI es filosófico y no muy productivo. Lo concreto: o3 resuelve problemas que antes requerían expertos humanos en matemáticas y programación, con una velocidad y consistencia que ningún humano puede igualar.

Si eso cuenta como AGI depende de cómo definas el término. Lo que no está en discusión es que es un avance genuino.

---

*Datos de benchmarks publicados por OpenAI en diciembre 2025.*
