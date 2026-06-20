---
title: "Cómo evaluar LLMs para tu caso de uso: más allá de los benchmarks públicos"
description: "Los benchmarks públicos son útiles pero no dicen nada sobre si un modelo funciona para tu problema específico. Metodología práctica para evaluar modelos con tus propios datos."
pubDate: 2026-01-31
author: "Equipo Blog IA"
tags: ["evaluación", "benchmarks", "metodología", "llms"]
category: investigacion
---

Cada lanzamiento de modelo viene con una tabla de benchmarks que lo muestra mejor que todo lo anterior en todo. Y luego lo pruebas en tu caso de uso real y los resultados no cuadran con los números. Esto pasa porque los benchmarks públicos miden capacidades generales, no tu problema específico.

La única evaluación que importa es la que haces con tus propios datos y tus propios criterios de éxito.

## El problema con los benchmarks públicos

**MMLU, HellaSwag, HumanEval**: son benchmarks que miden conocimiento general, razonamiento de sentido común, y generación de código genérico. Si tu aplicación hace algo específico (resumir contratos legales, generar SQL para tu esquema, clasificar reviews de tu producto), la correlación con estos benchmarks puede ser baja.

**Contaminación de datos**: algunos modelos pueden haber visto los datos de evaluación durante el entrenamiento, lo que infla artificialmente los resultados. Es difícil detectar esto externamente.

**El benchmark mide el benchmark**: un modelo puede ser entrenado para rendir bien en MMLU específicamente sin que eso refleje capacidad real de razonamiento general.

## Construir tu propia evaluación

### Paso 1: Define qué es "correcto"

Antes de evaluar, necesitas saber qué cuenta como una buena respuesta. Esto parece obvio pero es sorprendentemente difícil.

Para clasificación: la respuesta correcta está bien definida (etiqueta A o B).

Para generación de texto: necesitas criterios. ¿"Correcto" significa factualmente preciso? ¿Conciso? ¿En el tono adecuado? ¿Que no mencione ciertos temas?

Documenta los criterios antes de empezar a evaluar, no después.

### Paso 2: Crea un golden dataset

Necesitas ejemplos de inputs con outputs esperados verificados por humanos. Cuántos depende del caso:

- Para clasificación binaria: 200-500 ejemplos son suficientes para detectar diferencias significativas
- Para generación de texto: 50-100 ejemplos evaluados cuidadosamente son mejor que 500 evaluados deprisa
- Para casos de uso críticos: usa la fórmula estadística para el tamaño de muestra que te dé el power que necesitas

```python
# Tamaño de muestra para detectar diferencia del 5% con 80% de poder estadístico
from scipy import stats
import numpy as np

def sample_size_for_proportion_test(p1, p2, alpha=0.05, power=0.80):
    effect_size = abs(p1 - p2) / np.sqrt((p1 * (1 - p1) + p2 * (1 - p2)) / 2)
    n = stats.norm.ppf(1 - alpha/2) + stats.norm.ppf(power)
    return int(np.ceil((n / effect_size) ** 2))

# Para detectar diferencia entre modelo A (75% precisión) y modelo B (80%)
n = sample_size_for_proportion_test(0.75, 0.80)
print(f"Necesitas al menos {n} ejemplos")  # ~800 ejemplos
```

### Paso 3: Métricas según el tipo de tarea

**Clasificación y extracción**: precisión, recall, F1. Straightforward.

**Generación de texto corto** (resúmenes, respuestas): ROUGE y BLEU son convenientes pero malos indicadores de calidad real. Mejor usar evaluación LLM-as-judge.

**Generación de código**: ejecución de tests. Si el código pasa los tests, está bien. Si no pasa, no está bien.

**Seguimiento de instrucciones**: evalúa si el output cumple cada restricción especificada (longitud, formato, tono, qué incluir/excluir).

### Paso 4: LLM-as-judge

Para tareas donde la "corrección" es difícil de automatizar, usar un LLM como evaluador escala mejor que la evaluación humana.

```python
def evaluate_with_llm(question: str, model_answer: str, reference_answer: str) -> dict:
    prompt = f"""Evalúa la respuesta del modelo comparándola con la respuesta de referencia.

Pregunta: {question}
Respuesta de referencia: {reference_answer}
Respuesta del modelo: {model_answer}

Evalúa en estas dimensiones (1-5):
1. Precisión factual: ¿Es factualmente correcta?
2. Completitud: ¿Cubre los puntos clave?
3. Concisión: ¿Es apropiadamente concisa?

Responde SOLO con JSON: {{"precision": X, "completitud": X, "concision": X, "razon": "..."}}"""
    
    response = evaluator_llm.generate(prompt)
    return json.loads(response)
```

**Trampa a evitar**: usar el mismo modelo que estás evaluando como juez. Usa un modelo diferente como evaluador.

### Paso 5: Comparación estadística

Una diferencia del 2% entre modelos puede ser ruido o puede ser real. Usa tests estadísticos:

```python
from scipy.stats import chi2_contingency, wilcoxon

# Para métricas binarias (correcto/incorrecto)
def compare_models_binary(results_a, results_b):
    contingency = [[sum(results_a), len(results_a) - sum(results_a)],
                   [sum(results_b), len(results_b) - sum(results_b)]]
    chi2, p_value, _, _ = chi2_contingency(contingency)
    return p_value  # p < 0.05 = diferencia estadísticamente significativa

# Para métricas continuas (scores)
def compare_models_continuous(scores_a, scores_b):
    _, p_value = wilcoxon(scores_a, scores_b)
    return p_value
```

## Herramientas

- **Promptfoo**: evaluación automatizada de prompts con múltiples modelos
- **LangSmith**: trazabilidad y evaluación integrada con LangChain
- **Weave de Weights & Biases**: evaluación y trazabilidad modelo-agnóstica
- **Braintrust**: plataforma de evaluación con soporte para LLM-as-judge

## El resultado más común

Después de hacer una evaluación seria, la mayoría de equipos descubren que:

1. El mejor modelo del benchmark no es el mejor para su caso específico
2. La diferencia entre el mejor y el segundo modelo es menor de lo esperado
3. El prompt importa más que la elección del modelo para diferencias del 5-10%

Evalúa tus prompts junto con los modelos.

---

*Recursos adicionales: HELM (Holistic Evaluation of Language Models) de Stanford para benchmarks multi-dimensionales.*
