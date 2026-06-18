---
title: "Claude 3.5 Sonnet: el modelo que cambió la vara de los benchmarks"
description: "Anthropic lanzó Claude 3.5 Sonnet y superó a GPT-4o en la mayoría de pruebas de razonamiento y código. Qué cambia para los desarrolladores y qué limitaciones sigue teniendo."
pubDate: 2025-01-15
author: "Equipo Blog IA"
tags: ["claude", "anthropic", "benchmarks", "llm"]
category: modelos
featured: true
---

Anthropic publicó Claude 3.5 Sonnet en junio de 2024 y desde entonces se convirtió en el punto de referencia para comparar modelos de lenguaje. No porque lo diga Anthropic, sino porque los números en evaluaciones independientes así lo muestran.

## Qué mejoró respecto a Claude 3 Opus

El modelo anterior de Anthropic en la gama alta era Claude 3 Opus. El problema: era lento y caro. 3.5 Sonnet resuelve exactamente eso: ofrece resultados similares o superiores en razonamiento y código, a la mitad del precio y con latencia notablemente menor.

En términos concretos para desarrolladores:

- **HumanEval (código)**: 92% frente al 84.9% de GPT-4o en el momento del lanzamiento
- **MMLU (conocimiento general)**: 88.7%
- **Graduate-Level Reasoning (GPQA)**: 59.4%, superando a humanos expertos con acceso a internet

Estos números son una foto fija. Lo relevante es la experiencia en producción.

## Lo que realmente diferencia al modelo

Claude 3.5 Sonnet tiene una capacidad de seguimiento de instrucciones más precisa que versiones anteriores. Si le das un formato específico, lo respeta. Si defines restricciones, las mantiene durante conversaciones largas.

El manejo de contexto de 200.000 tokens también está más maduro. No solo acepta documentos largos, sino que los procesa con mayor coherencia que Claude 3 Opus en textos extensos.

La característica que más impacto tuvo en herramientas externas fue **Computer Use**, lanzada en versión beta en octubre de 2024: la capacidad de operar interfaces gráficas mediante capturas de pantalla. Todavía imprecisa, pero funcional para tareas repetitivas de navegación.

## Limitaciones que persisten

El modelo sigue sin tener acceso a internet en tiempo real. Su fecha de corte de conocimiento es principios de 2024. Para aplicaciones que requieren información actualizada, la recuperación aumentada (RAG) sigue siendo obligatoria.

El precio tampoco es despreciable para volumen alto: $3 por millón de tokens de entrada y $15 por millón de salida en la API directa de Anthropic. Hay casos donde GPT-4o Mini o Gemini Flash son más económicos para tareas de menor complejidad.

## Cuándo elegirlo

Claude 3.5 Sonnet es el modelo a usar cuando el razonamiento complejo y la precisión en instrucciones son prioritarios sobre el coste. Para agentes que ejecutan código, analizan documentos técnicos o generan contenido estructurado, sigue siendo la referencia en 2025.

Para tareas simples de clasificación o extracción, hay alternativas más baratas que funcionan perfectamente.

---

*Fuentes: Anthropic model card de Claude 3.5 Sonnet, LMSYS Chatbot Arena leaderboard, evaluaciones publicadas en el paper técnico oficial.*
