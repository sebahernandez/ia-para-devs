---
title: "Gemini 4 Argon: lidera los benchmarks, pero todavía no puedes usarlo"
description: "Google presentó Gemini 4 Argon: gana 12 de 18 benchmarks frente a GPT-6 Astra y Claude Opus 5.5. Te cuento quién puede usarlo hoy, en qué planes llegará, cuánto cuesta y cómo prepararte."
pubDate: 2026-10-07
author: Sebacure
category: modelos
tags:
  - Gemini
  - Google
  - Gemini 4 Argon
  - LLM
draft: false
featured: true
---

Google acaba de presentar su modelo más potente y la primera pregunta de todo el mundo es la misma: ¿dónde lo pruebo? La respuesta corta es incómoda: por ahora, casi en ningún lado.

El 30 de septiembre de 2026, Google DeepMind anunció **Gemini 4 Argon**, el primer modelo de la generación Gemini 4. En los números que publicó Google, Argon queda primero en 12 de 18 benchmarks frente a GPT-6 Astra y Claude Opus 5.5. Pero el lanzamiento es restringido: hoy solo lo usa un grupo muy acotado. Aquí tienes qué es, quién tiene acceso, en qué planes va a llegar, cuánto cuesta y qué puedes hacer mientras tanto.

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5rem 0;border-radius:0.5rem;">
  <iframe src="https://www.youtube.com/embed/MHr2L3N27Vw?start=14" title="Google acaba de soltar su IA más POTENTE hasta ahora" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" loading="lazy" allowfullscreen></iframe>
</div>

<small>Video de [Vitoria Ferreira](https://www.youtube.com/@viviwsd), compartido con autorización de su creadora.</small>

## Qué es Gemini 4 Argon

Es el nuevo modelo de frontera de Google, pensado para trabajo largo y autónomo: programar, analizar documentos y video, automatizar flujos y, sobre todo, ciberseguridad. Google lo describe como capaz de encontrar, validar y corregir vulnerabilidades críticas por su cuenta.

El cambio técnico más llamativo es el límite de salida: **hasta 1 millón de tokens por respuesta**, cuando antes el tope era de 64K. En la práctica, eso significa que puede entregar de una sola vez una migración completa de código o un informe muy extenso, sin que tengas que pedírselo por partes.

Lo que Google **todavía no ha publicado**: la ventana de contexto, el ID del modelo en la API y la model card. Si ves esas cifras por ahí, tómalas con cautela.

## En qué planes está disponible

Esta es la parte que más confusión genera, así que vamos directo:

| Quién | ¿Tiene acceso? |
| --- | --- |
| Defensores de ciberseguridad verificados (Fairwind Program) | **Sí, hoy** |
| Clientes de la API de pago | Siguiente etapa, sin fecha |
| Suscriptores de Google AI Ultra | Siguiente etapa, sin fecha |
| Desarrolladores, empresas y consumidores en general | Después, sin fecha |
| Google AI Pro y plan gratuito | Google no ha dicho nada |

El **Fairwind Program** es el nivel de acceso de Google para gobiernos, autoridades nacionales de ciberseguridad, operadores de infraestructura crítica y plataformas tecnológicas de base. Además, Google está participando en un proceso voluntario de pruebas de seguridad con el gobierno de Estados Unidos antes de abrir el modelo.

Google dice que lo ampliará "lo antes posible", empezando por los clientes de la API de pago y los suscriptores de Google AI Ultra. No hay fecha pública para ninguna de esas etapas. Si hoy tienes el plan gratuito o AI Pro, Argon no está en tu cuenta.

## Cuánto cuesta

Google ya publicó los precios de la API, con un periodo introductorio:

| | Precio introductorio | Precio posterior |
| --- | --- | --- |
| Entrada | $2 / millón de tokens | $4 / millón de tokens |
| Salida | $10 / millón de tokens | $20 / millón de tokens |
| Entrada en caché | $0.10 / millón de tokens (95% de descuento) | 95% de descuento sobre la entrada |

Google no ha definido cuánto dura el periodo introductorio. Si piensas construir algo sobre Argon, calcula tu presupuesto con el precio posterior: así, si la oferta termina antes de lo que esperas, no te toma por sorpresa.

## Cómo usarlo

Hoy no hay un botón para activarlo, pero sí sabes por dónde va a llegar y puedes dejar todo listo.

**Las dos puertas de entrada anunciadas:**

- **API de pago de Gemini.** Será la vía para integrarlo en tus aplicaciones y agentes. Necesitas una cuenta con facturación activa; el nivel gratuito de la API no está en la primera etapa.
- **Google AI Ultra.** Será la vía para usarlo sin programar, desde los productos de Google incluidos en esa suscripción.

**Qué puedes hacer desde ya:**

1. **Activa la facturación en tu cuenta de la API de Gemini.** Cuando Google abra la etapa de pago, no vas a perder tiempo en trámites.
2. **Arma tu propio set de pruebas.** Reúne de 10 a 20 tareas reales de tu trabajo con el resultado que esperas. El día que tengas acceso, sabrás en una tarde si Argon te conviene, sin depender de benchmarks ajenos.
3. **No dejes fijo el nombre del modelo en tu código.** Ponlo en una variable de configuración. El ID de Argon aún no se publica y cambiarlo debería ser cosa de una línea.
4. **Si trabajas en ciberseguridad defensiva**, revisa si tu organización califica para el Fairwind Program: es la única vía abierta hoy.

**Para qué tareas conviene, según los resultados publicados:**

- **Agentes que automatizan flujos de trabajo** (AutomationBench, Vals Finance Agent, Harvey Legal Agent): es donde saca más ventaja.
- **Ingeniería de software sobre repositorios grandes** (DeepSWE) y migraciones largas, gracias al límite de salida de 1 millón de tokens.
- **Análisis de video largo** (LVBench).
- **Búsqueda y corrección de vulnerabilidades**, el caso de uso con el que Google eligió estrenarlo.

## Los benchmarks

Estas cifras las reportó Google en su anuncio; todavía no hay verificación independiente amplia. De las 18 comparaciones publicadas, estas son las más relevantes:

| Benchmark | Gemini 4 Argon | GPT-6 Astra | Claude Opus 5.5 |
| --- | --- | --- | --- |
| DeepSWE v1.1 | **77.9%** | 74.1% | 74.2% |
| AutomationBench | **51.3%** | 41.4% | 42.5% |
| GraphWalks | **84.2%** | 71.8% | 66.8% |
| Vals Finance Agent v2 | **65.4%** | 53.5% | 58.6% |
| Harvey Legal Agent | **19.6%** | 5.4% | 3.8% |
| LVBench | **91.7%** | 87.5% | 83.7% |
| CWE-bench v1 | **68%** | **68%** | 67% |
| FrontierSWE v2 | 55.0% | **65.5%** | — |
| Terminal-Bench Science 0.1 | 57.6% | **68.1%** | — |
| Terminal-Bench 4.0 | 57.4% | — | **66.4%** |
| PostTrainBench | 45.3% | — | **49.3%** |
| Gray Swan, inyección indirecta de prompts (menor es mejor) | **0.7%** | 8.5% | 1.0% |

El resumen: Argon lidera 12 de las 18 comparaciones y empata una (CWE-bench v1, con GPT-6 Astra). GPT-6 Astra gana tres y Claude Opus 5.5 gana dos.

Un dato que importa si vas a darle herramientas a un agente: en la prueba de Gray Swan, los ataques de inyección indirecta de prompts funcionaron solo el 0.7% de las veces. Es la tasa más baja de los tres, y significa menos riesgo de que una página web o un documento malicioso desvíe a tu agente.

## Dónde no gana

Vale la pena mirar las filas de abajo de la tabla. En **FrontierSWE v2** y **Terminal-Bench Science**, GPT-6 Astra le saca unos 10 puntos. En **Terminal-Bench 4.0** y **PostTrainBench**, el que lidera es Claude Opus 5.5. Si tu trabajo es sobre todo en la terminal, Argon no es automáticamente la mejor opción.

Los benchmarks te dicen dónde mirar, no qué elegir. Por eso el set de pruebas propio del paso 2 vale más que cualquier tabla.

## Conclusión

Gemini 4 Argon devuelve a Google al primer lugar en la mayoría de las comparaciones y llega con un precio introductorio agresivo. Pero hoy es un modelo para defensores de ciberseguridad, no para ti ni para mí. Lo que sí está claro es el orden: primero la API de pago y Google AI Ultra, después el resto.

Mientras tanto, deja tu facturación activa y tus pruebas listas. ¿Para qué lo vas a usar cuando se abra el acceso? Cuéntame en los comentarios qué tarea le vas a poner primero.
