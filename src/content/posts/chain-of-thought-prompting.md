---
title: "Chain-of-Thought: la técnica de prompting que cambió qué podemos pedirle a un LLM"
description: "Pedir al modelo que 'piense paso a paso' mejora drásticamente los resultados en problemas de razonamiento. Explicamos por qué funciona, las variantes más efectivas y cuándo no es la herramienta adecuada."
pubDate: 2025-06-18
author: "Equipo Blog IA"
tags: ["prompting", "chain-of-thought", "razonamiento", "técnicas"]
category: investigacion
---

El paper "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" de Google Brain (Wei et al., 2022) demostró algo que ahora parece obvio pero en su momento fue sorprendente: pedir al modelo que muestre su razonamiento paso a paso mejora drásticamente la precisión en problemas matemáticos, lógicos y de sentido común.

## El efecto básico

Sin Chain-of-Thought:
```
Pregunta: Una tienda tiene 15 manzanas. Llegan 8 más. Luego se venden 6. ¿Cuántas quedan?
Respuesta: 17
```

Con Chain-of-Thought:
```
Pregunta: Una tienda tiene 15 manzanas. Llegan 8 más. Luego se venden 6. ¿Cuántas quedan?
Respuesta: Empecemos con las 15 manzanas iniciales. Al llegar 8 más, tenemos 15 + 8 = 23 manzanas. 
Si se venden 6, quedan 23 - 6 = 17 manzanas.
```

En este ejemplo simple el resultado es igual. Pero en problemas con múltiples pasos, dependencias y casos edge, el modelo que razona en voz alta comete significativamente menos errores.

## Las variantes que funcionan

### Zero-shot CoT: "Piensa paso a paso"

La implementación más simple: añadir "Piensa paso a paso" o "Let's think step by step" al final del prompt.

```python
prompt = """
Tengo 3 cajas. En la primera hay 4 pelotas rojas y 2 azules. 
En la segunda, el doble que en la primera. En la tercera, 
la mitad de la segunda más 3. ¿Cuántas pelotas hay en total?

Piensa paso a paso antes de dar la respuesta.
"""
```

Esto funciona sin ejemplos previos. El modelo activa un modo de razonamiento explícito.

### Few-shot CoT: ejemplos con razonamiento mostrado

Más efectivo pero requiere construir los ejemplos:

```python
prompt = """
Ejemplo:
Problema: Un tren va de A a B en 2 horas a 60 km/h. ¿Cuál es la distancia?
Razonamiento: La distancia es velocidad × tiempo. Distancia = 60 km/h × 2 h = 120 km.
Respuesta: 120 km

Ahora resuelve:
Problema: Un ciclista recorre 180 km en 3 horas. ¿A qué velocidad va?
"""
```

### Self-consistency: múltiples caminos, voto mayoritario

En lugar de una cadena de razonamiento, generas varias (temperatura > 0) y te quedas con la respuesta más frecuente. Mejora la precisión en problemas con respuesta discreta.

```python
respuestas = []
for _ in range(5):
    respuesta = llm.generate(prompt, temperature=0.7)
    respuestas.append(extraer_respuesta_final(respuesta))

from collections import Counter
respuesta_final = Counter(respuestas).most_common(1)[0][0]
```

## Los límites del Chain-of-Thought

CoT mejora el razonamiento pero no lo garantiza. Los modelos pueden mostrar un razonamiento que parece correcto pero lleva a una respuesta incorrecta (razonamiento post-hoc). El modelo "decide" la respuesta y luego construye el razonamiento para justificarla.

CoT también no ayuda con tareas que no requieren razonamiento multi-paso: clasificación simple, generación creativa, extracción directa. Añade tokens sin beneficio.

## La conexión con los modelos de razonamiento

Los modelos o1 de OpenAI y R1 de DeepSeek internalizan el Chain-of-Thought: en lugar de que tú lo pidas explícitamente, el modelo genera automáticamente una cadena de razonamiento interna. El resultado es que los beneficios de CoT se aplican siempre, sin que tengas que modificar el prompt.

---

*Fuentes: Paper "Chain-of-Thought Prompting" (Wei et al., 2022), "Self-Consistency Improves CoT Reasoning" (Wang et al., 2022), recopilación de técnicas de Anthropic's Prompt Engineering Guide.*
