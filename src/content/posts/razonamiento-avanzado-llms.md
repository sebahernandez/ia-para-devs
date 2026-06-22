---
title: "Razonamiento en LLMs: qué funciona más allá del chain-of-thought básico"
description: "Chain-of-thought fue el primer paso. Ahora hay una familia de técnicas más sofisticadas para extraer razonamiento real de los modelos. Cuáles usar y cuándo."
pubDate: 2025-12-13
tags: ["razonamiento", "chain-of-thought", "prompting", "investigacion"]
category: investigacion
---

Chain-of-thought (CoT) cambió cómo usamos los LLMs: pedir al modelo que "piense paso a paso" mejora resultados en tareas complejas de forma consistente. Pero CoT básico tiene límites claros, y la investigación de los últimos dos años ha producido variantes más sofisticadas que vale la pena conocer.

## Por qué CoT básico se queda corto

El problema fundamental: CoT estándar genera un único camino de razonamiento. Si ese camino empieza con una premisa incorrecta, el modelo la sigue hasta una conclusión incorrecta con toda la confianza del mundo.

Además, el razonamiento visible en el output no siempre refleja el razonamiento interno real del modelo. Los modelos pueden "racionalizar" en lugar de razonar: generar una explicación plausible del resultado que ya habían decidido, no el proceso que llevó a él.

## Técnicas que mejoran los resultados

### Self-Consistency

En lugar de generar un único razonamiento, se generan múltiples cadenas independientes (con temperatura > 0) y se elige la respuesta más frecuente entre ellas.

```python
responses = [llm.generate(prompt, temperature=0.7) for _ in range(10)]
# Extraer respuesta final de cada uno y hacer votación por mayoría
final = most_common([extract_answer(r) for r in responses])
```

Self-consistency mejora significativamente en tareas de matemáticas y lógica. El coste: N llamadas al modelo en lugar de 1.

### Tree of Thoughts (ToT)

En lugar de una cadena lineal, el modelo explora un árbol de posibilidades: genera varios "pensamientos" candidatos en cada paso, evalúa cuáles son más prometedores, y sigue explorando las ramas más prometedoras.

Es más complejo de implementar pero útil para problemas donde el espacio de soluciones es amplio y hay que explorar varias estrategias.

### Least-to-Most Prompting

Descomponer el problema en subproblemas más simples, resolver cada uno en orden, y usar las respuestas previas para resolver los siguientes. La diferencia con CoT estándar es que la descomposición es explícita y jerárquica.

Funciona especialmente bien en tareas de composición: cuando la respuesta final depende de combinar varias respuestas parciales.

### Step-Back Prompting

Antes de resolver el problema específico, pedir al modelo que identifique los principios o conceptos generales relevantes. Luego usar esos principios para resolver el caso concreto.

```
Pregunta: "¿Qué temperatura tiene el núcleo del Sol?"
Step-back: "¿Cuáles son los procesos físicos que determinan la temperatura del núcleo estelar?"
→ Luego aplicar esos principios a la pregunta original
```

### Razonamiento con verificación

Pedir al modelo que resuelva el problema y luego que verifique su propia solución como si fuera otra persona revisando el trabajo. El prompt de verificación puede ser explícito sobre qué errores buscar.

## Modelos con razonamiento nativo

o1 de OpenAI y Grok 3 en modo Think implementan razonamiento extendido a nivel de modelo, no de prompt. El modelo genera cadenas de pensamiento internas (no siempre visibles) antes de producir el output final.

La ventaja: el razonamiento está integrado y el modelo ha sido entrenado específicamente para ello. La desventaja: más latencia, más coste por token, y menos control sobre el proceso.

## Qué técnica usar según el caso

| Tarea | Técnica recomendada |
|-------|-------------------|
| Matemáticas, lógica | Self-Consistency o modelo con reasoning nativo |
| Problemas de búsqueda | Tree of Thoughts |
| Tareas compuestas | Least-to-Most |
| Conocimiento conceptual | Step-Back |
| Verificación de resultados | Razonamiento con verificación |

## El límite real

Ninguna de estas técnicas resuelve el problema de alucinación en conocimiento factual. Si el modelo no sabe un dato, más razonamiento no lo inventará correctamente. Estas técnicas mejoran el razonamiento sobre lo que el modelo ya sabe, no añaden conocimiento nuevo.

Para conocimiento factual, la combinación correcta sigue siendo RAG más razonamiento, no razonamiento solo.

---

*Referencias: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (Wei et al.), "Tree of Thoughts" (Yao et al.), "Self-Consistency Improves Chain of Thought Reasoning" (Wang et al.).*
