---
title: "Gemini 1.5 Pro y la ventana de contexto de 1 millón de tokens"
description: "Google amplió el contexto de Gemini 1.5 Pro a 1 millón de tokens y, en versión experimental, a 2 millones. Qué cambia cuando puedes meter un codebase entero en el prompt."
pubDate: 2025-02-10
tags: ["google", "gemini", "context-window", "multimodal"]
category: modelos
---

Cuando Google anunció que Gemini 1.5 Pro aceptaría hasta 1 millón de tokens de contexto, la reacción inicial fue escepticismo. Una ventana tan grande, ¿realmente funciona? ¿O el modelo pierde el hilo en los textos largos?

La respuesta, después de varios meses de pruebas en producción, es matizada: funciona mejor de lo esperado, pero tiene patrones de degradación específicos que hay que conocer.

## Qué cabe en 1 millón de tokens

Para hacerlo concreto:

- ~750.000 palabras de texto (unas 10 novelas)
- 1 hora de vídeo
- 11 horas de audio
- 30.000 líneas de código

Esto abre casos de uso que antes requerían arquitecturas de recuperación complejas. Puedes meter un repositorio completo, hacer preguntas sobre él y obtener respuestas coherentes sin construir un pipeline de embeddings.

## Arquitectura: por qué es posible

Gemini 1.5 usa una arquitectura Mixture of Experts (MoE) con atención eficiente. En lugar de escalar cuadráticamente con el contexto como hacen los transformers convencionales, el coste crece de forma más lineal.

Esto no es magia: el modelo activa solo un subconjunto de parámetros por token, lo que permite el procesamiento de secuencias largas sin hacer explotar la memoria.

## Dónde funciona bien y dónde no

**Funciona bien:**
- Buscar información específica en documentos extensos ("¿en qué función se inicializa la conexión a la base de datos?")
- Resumir conjuntos de documentos relacionados
- Analizar transcripciones largas de reuniones

**Funciona peor:**
- Razonamiento que requiere mantener coherencia a lo largo de todo el contexto
- El modelo tiende a dar más peso al principio y al final del documento (el fenómeno "lost in the middle")
- Tareas que requieren comparar elementos distantes entre sí

## Precio y disponibilidad

Gemini 1.5 Pro está disponible en la API de Google AI Studio y en Vertex AI. El precio base es $3.50 por millón de tokens para contextos hasta 128.000, y $7.00 para contextos más largos. Para llamadas de más de 128K tokens el coste sube, lo que hay que tener en cuenta para las aplicaciones que metan repositorios completos de forma regular.

Gemini 1.5 Flash es la alternativa rápida y barata: menos capacidad, más velocidad, $0.075 por millón de tokens.

---

*Fuentes: Paper técnico de Gemini 1.5, documentación de Google AI Studio, benchmark "Lost in the Middle" de Stanford.*
