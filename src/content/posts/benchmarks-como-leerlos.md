---
title: "Cómo leer los benchmarks de LLMs sin dejarte engañar por los números"
description: "MMLU, HumanEval, GPQA, MT-Bench, LMSYS Arena: cada benchmark mide algo diferente y tiene sus propias trampas. Una guía para interpretar los resultados antes de elegir un modelo."
pubDate: 2025-06-01
tags: ["benchmarks", "evaluación", "llm", "metodología"]
category: investigacion
---

Cada nuevo modelo se presenta con una tabla de benchmarks que lo pone por encima de la competencia. Y muchas veces los números son ciertos: el modelo sí obtiene ese resultado en esa prueba específica. El problema es que el resultado de un benchmark no siempre se traduce en utilidad para tu caso de uso.

Aquí explicamos los benchmarks más citados, qué miden y dónde fallan.

## MMLU: conocimiento general amplio

Massive Multitask Language Understanding evalúa conocimiento en 57 materias: matemáticas, historia, ley, medicina, ciencia, y más. Son preguntas de opción múltiple.

**Qué mide bien**: conocimiento factual amplio, capacidad para razonar sobre temas académicos.

**Las trampas**: Las preguntas son de opción múltiple, que los modelos responden mejor que preguntas abiertas. Hay evidencia de que algunos modelos están optimizados para el formato específico de MMLU. Un modelo con 85% en MMLU no necesariamente es mejor que uno con 82% en tareas del mundo real.

## HumanEval: código Python

HumanEval de OpenAI es la prueba de código más citada: 164 problemas de programación donde el modelo escribe una función Python que debe pasar un conjunto de tests unitarios.

**Qué mide bien**: generación de código Python para problemas algorítmicos clásicos.

**Las trampas**: Solo Python. Solo problemas algorítmicos relativamente cortos. No mide comprensión de codebases reales, debugging, o generación de código en otros lenguajes. Los modelos entrenados específicamente en el formato de HumanEval pueden inflar su puntuación.

## GPQA Diamond: razonamiento de nivel experto

Graduate-Level Google-Proof Q&A contiene preguntas de biología, física y química diseñadas por expertos con doctorado. Son tan difíciles que los propios expertos en el dominio no las responden bien sin ayuda externa.

**Por qué importa**: A diferencia de MMLU, estas preguntas no pueden responderse con búsquedas simples. Requieren razonamiento real sobre el dominio.

**Los números de referencia**: Expertos humanos con acceso a internet: 73.2%. Claude 3.5 Sonnet: 59.4%. GPT-4o: 53.6%.

## LMSYS Chatbot Arena: la evaluación humana

En lugar de tests automatizados, el Arena pide a usuarios reales que comparen dos respuestas de modelos anónimos y voten cuál es mejor. La puntuación Elo resultante es un ranking basado en miles de evaluaciones humanas.

**Qué mide bien**: preferencia humana real en tareas del mundo real.

**Las trampas**: Los usuarios del Arena no son representativos de todos los casos de uso. Los modelos con respuestas más largas y mejor formateadas tienden a ganar aunque no sean necesariamente más correctos.

## Cómo elegir el modelo correcto para tu caso

El mejor enfoque: define 10-20 casos de uso reales de tu aplicación, crea un conjunto de evaluación propio, y mide los modelos candidatos directamente. Ningún benchmark público reemplaza la evaluación en tu dominio específico.

Los benchmarks son útiles para hacer un primer filtrado. La decisión final siempre debe validarse con datos propios.

---

*Fuentes: Papers originales de MMLU, HumanEval y GPQA, documentación de LMSYS Chatbot Arena, análisis de Epoch AI sobre saturación de benchmarks.*
