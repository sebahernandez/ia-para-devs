---
title: "Gemini 4 Hydrogen: 2,5 veces más rápido que Flash, precio, benchmarks y cómo usarlo"
description: "Google lanzó Gemini 4 Hydrogen: 2,5x más rápido que Gemini 3.8 Flash, 57% en Terminal-Bench 4.1 y contexto de 1M tokens. Benchmarks, precio, planes y si conviene para código y agentes."
pubDate: 2026-11-13
author: slagosdev
category: modelos
tags:
  - Gemini
  - Google
  - Gemini 4 Hydrogen
  - Agentes de IA
  - LLM
draft: false
featured: true
---

¿Y si tu asistente de código terminara las tareas 2,5 veces más rápido y además inventara cinco veces menos cosas? Eso es lo que promete Google con **Gemini 4 Hydrogen**, el modelo rápido de la familia Gemini 4, lanzado el 12 de noviembre de 2026.

Hydrogen no viene a competir con los modelos grandes de razonamiento profundo (ese es el trabajo de sus hermanos **Carbon** y **Argon**). Su papel es ser el motor rápido para el trabajo diario: escribir código, correr pruebas, arreglar bugs y mover agentes que ejecutan tareas de varios pasos. Reemplaza a Gemini 3.8 Flash y es el primero de esta línea que deja de llamarse "Flash".

## Resumen en 30 segundos

- **Más rápido:** Google dice que completa las tareas **2,5 veces más rápido** que Gemini 3.8 Flash. Artificial Analysis mide **236 tokens por segundo**, el doble que Flash (111).
- **Mucho mejor en agentes:** en **Terminal-Bench 4.1** pasa de **18,2% a 57%** frente a Flash.
- **Menos alucinaciones:** más de **5 veces menos afirmaciones inventadas**, porque avisa cuando le falta contexto en vez de adivinar.
- **Más caro por token, más barato por tarea:** cuesta **US$1,50 / US$7,50** por millón de tokens (el doble que Flash hoy), pero cada tarea sale en **US$1,87 frente a US$7,77**.
- **Contexto de 1 millón de tokens**, con precio fijo en toda la ventana.
- **Dónde está:** app de Gemini, Google Search, Gemini API, AI Studio, Antigravity y Gemini para empresas.

## Gemini 4 Hydrogen en cifras

| Dato | Valor |
|---|---|
| ID en la API | `gemini-4-hydrogen` |
| Ventana de contexto | 1.048.576 tokens (compartida entre entrada, razonamiento y salida) |
| Salida máxima por respuesta | 65.536 tokens |
| Entradas | Texto, imágenes, audio, video y PDF |
| Salida | Solo texto |
| Fecha de corte de conocimiento | Marzo de 2026 |
| Niveles de razonamiento | `low`, `medium`, `high` (por defecto) y el nuevo `xhigh` |
| Velocidad medida | 236 tokens/s en `high` (Artificial Analysis) |

<small>Fuentes: Google, VentureBeat, Fello AI y Artificial Analysis.</small>

## El salto frente a Gemini 3.8 Flash

La cifra que más llama la atención es la de **Terminal-Bench 4.1**, una prueba que mide si un agente puede completar tareas reales en una terminal: instalar dependencias, correr comandos, depurar. Flash resolvía menos de una de cada cinco. Hydrogen resuelve más de la mitad.

<figure>
<svg viewBox="0 0 640 110" width="100%" role="img" aria-labelledby="tb-title tb-desc" style="max-width:640px;font-family:inherit">
<title id="tb-title">Terminal-Bench 4.1: Gemini 4 Hydrogen frente a Gemini 3.8 Flash</title>
<desc id="tb-desc">Gemini 4 Hydrogen logra 57% de éxito y Gemini 3.8 Flash 18,2%.</desc>
<text x="170" y="37" text-anchor="end" font-size="14" fill="currentColor">Gemini 4 Hydrogen</text>
<rect x="180" y="18" width="380" height="28" rx="4" fill="#4285F4"/>
<text x="568" y="37" font-size="14" font-weight="700" fill="currentColor">57%</text>
<text x="170" y="83" text-anchor="end" font-size="14" fill="currentColor">Gemini 3.8 Flash</text>
<rect x="180" y="64" width="121" height="28" rx="4" fill="currentColor" opacity="0.35"/>
<text x="309" y="83" font-size="14" font-weight="700" fill="currentColor">18,2%</text>
</svg>
<figcaption><small>Porcentaje de tareas resueltas en Terminal-Bench 4.1. Fuente: Google.</small></figcaption>
</figure>

Es un **aumento de 3,1 veces**. Para quien usa agentes de código, eso se traduce en menos tareas abandonadas a mitad de camino y menos veces que tienes que intervenir.

Las pruebas de socios de Google van en la misma línea:

- En trabajo con grafos, SQL y datos, las tareas terminaron **entre 2 y 2,8 veces más rápido** y con **12% a 23% menos tokens**.
- **Box** subió la precisión de su evaluación de trabajo complejo de **74% a 79%**, en menos de la mitad del tiempo y con cerca de 12% menos tokens. Las mayores mejoras fueron en tablas y cálculos.

## Velocidad: el doble de tokens por segundo

Artificial Analysis, una firma independiente, midió la velocidad de salida de cada modelo. Hydrogen no solo supera a Flash: es el más rápido de su grupo, incluso en su nivel de razonamiento más alto.

<figure>
<svg viewBox="0 0 640 272" width="100%" role="img" aria-labelledby="sp-title sp-desc" style="max-width:640px;font-family:inherit">
<title id="sp-title">Velocidad de salida en tokens por segundo</title>
<desc id="sp-desc">Hydrogen high 236, Hydrogen xhigh 198, Claude Sonnet 5.5 144, Gemini 3.8 Flash 111, Gemini 4 Carbon 76, GPT-6.1 Terra 70, Gemini 4 Argon 64.</desc>
<text x="170" y="27" text-anchor="end" font-size="13" fill="currentColor">Hydrogen (high)</text>
<rect x="180" y="10" width="354" height="24" rx="4" fill="#4285F4"/>
<text x="542" y="27" font-size="13" font-weight="700" fill="currentColor">236</text>
<text x="170" y="63" text-anchor="end" font-size="13" fill="currentColor">Hydrogen (xhigh)</text>
<rect x="180" y="46" width="297" height="24" rx="4" fill="#4285F4" opacity="0.75"/>
<text x="485" y="63" font-size="13" font-weight="700" fill="currentColor">198</text>
<text x="170" y="99" text-anchor="end" font-size="13" fill="currentColor">Claude Sonnet 5.5</text>
<rect x="180" y="82" width="216" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="404" y="99" font-size="13" font-weight="700" fill="currentColor">144</text>
<text x="170" y="135" text-anchor="end" font-size="13" fill="currentColor">Gemini 3.8 Flash</text>
<rect x="180" y="118" width="167" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="355" y="135" font-size="13" font-weight="700" fill="currentColor">111</text>
<text x="170" y="171" text-anchor="end" font-size="13" fill="currentColor">Gemini 4 Carbon</text>
<rect x="180" y="154" width="114" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="302" y="171" font-size="13" font-weight="700" fill="currentColor">76</text>
<text x="170" y="207" text-anchor="end" font-size="13" fill="currentColor">GPT-6.1 Terra</text>
<rect x="180" y="190" width="105" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="293" y="207" font-size="13" font-weight="700" fill="currentColor">70</text>
<text x="170" y="243" text-anchor="end" font-size="13" fill="currentColor">Gemini 4 Argon</text>
<rect x="180" y="226" width="96" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="284" y="243" font-size="13" font-weight="700" fill="currentColor">64</text>
</svg>
<figcaption><small>Tokens de salida por segundo. Fuente: Artificial Analysis, vía Fello AI.</small></figcaption>
</figure>

## Inteligencia frente a costo: el índice de Artificial Analysis

Ser rápido no sirve de mucho si el modelo se equivoca. El **Intelligence Index** de Artificial Analysis combina varias pruebas en una sola nota. Junto a cada barra va el **costo por tarea**, que es lo que de verdad pagas.

<figure>
<svg viewBox="0 0 640 308" width="100%" role="img" aria-labelledby="ai-title ai-desc" style="max-width:640px;font-family:inherit">
<title id="ai-title">Artificial Analysis Intelligence Index y costo por tarea</title>
<desc id="ai-desc">Gemini 4 Carbon 60 a 7,76 dólares por tarea; Claude Sonnet 5.5 55 a 10,02; Hydrogen xhigh 54 a 3,16; Hydrogen high 51 a 1,87; GPT-6.1 Terra 51 a 0,96; Gemini 4 Argon 50 a 9,95; Claude Haiku 5.5 36 a 0,41; Gemini 3.8 Flash 31 a 7,77.</desc>
<text x="170" y="27" text-anchor="end" font-size="13" fill="currentColor">Gemini 4 Carbon</text>
<rect x="180" y="10" width="360" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="548" y="27" font-size="13" font-weight="700" fill="currentColor">60 · $7,76</text>
<text x="170" y="63" text-anchor="end" font-size="13" fill="currentColor">Claude Sonnet 5.5</text>
<rect x="180" y="46" width="330" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="518" y="63" font-size="13" font-weight="700" fill="currentColor">55 · $10,02</text>
<text x="170" y="99" text-anchor="end" font-size="13" fill="currentColor">Hydrogen (xhigh)</text>
<rect x="180" y="82" width="324" height="24" rx="4" fill="#4285F4" opacity="0.75"/>
<text x="512" y="99" font-size="13" font-weight="700" fill="currentColor">54 · $3,16</text>
<text x="170" y="135" text-anchor="end" font-size="13" fill="currentColor">Hydrogen (high)</text>
<rect x="180" y="118" width="306" height="24" rx="4" fill="#4285F4"/>
<text x="494" y="135" font-size="13" font-weight="700" fill="currentColor">51 · $1,87</text>
<text x="170" y="171" text-anchor="end" font-size="13" fill="currentColor">GPT-6.1 Terra</text>
<rect x="180" y="154" width="306" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="494" y="171" font-size="13" font-weight="700" fill="currentColor">51 · $0,96</text>
<text x="170" y="207" text-anchor="end" font-size="13" fill="currentColor">Gemini 4 Argon</text>
<rect x="180" y="190" width="300" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="488" y="207" font-size="13" font-weight="700" fill="currentColor">50 · $9,95</text>
<text x="170" y="243" text-anchor="end" font-size="13" fill="currentColor">Claude Haiku 5.5</text>
<rect x="180" y="226" width="216" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="404" y="243" font-size="13" font-weight="700" fill="currentColor">36 · $0,41</text>
<text x="170" y="279" text-anchor="end" font-size="13" fill="currentColor">Gemini 3.8 Flash</text>
<rect x="180" y="262" width="186" height="24" rx="4" fill="currentColor" opacity="0.35"/>
<text x="374" y="279" font-size="13" font-weight="700" fill="currentColor">31 · $7,77</text>
</svg>
<figcaption><small>Nota del índice (más alto es mejor) y costo en dólares por tarea. Fuente: Artificial Analysis Intelligence Index v5.0.1, vía VentureBeat.</small></figcaption>
</figure>

Tres lecturas rápidas:

- **Frente a Flash, no hay discusión:** Hydrogen sube de 31 a 51 puntos y cada tarea cuesta **76% menos** (US$1,87 frente a US$7,77).
- **El nivel `high` es el punto dulce.** Pasar a `xhigh` sube la nota de 51 a 54, pero el costo por tarea casi se duplica. En Terminal-Bench 4.0 ambos niveles sacan el mismo 54%.
- **No es el más barato de su liga.** GPT-6.1 Terra saca la misma nota (51) por la mitad del costo por tarea, aunque es mucho más lento (70 tokens/s frente a 236).

## Benchmarks oficiales de Google

Esta es la tabla que publicó Google, con Hydrogen en su nivel de razonamiento más alto. Son mediciones de la propia empresa, no evaluaciones independientes.

| Benchmark | Gemini 4 Hydrogen | Claude Sonnet 5.5 | GPT-6.1 Terra |
|---|---|---|---|
| SWE-sweep | **13,5%** | 3,1% | 5,8% |
| Terminal-Bench 4.1 | 57,0% | **63,9%** | — |
| Agents' Last Exam v1.1 | **71,6%** | 60,4% | 69,8% |
| AutomationBench-AA | **76,1%** | 71,8% | 60,2% |
| Vending-Bench 2 | **US$14.549** | US$11.165 | US$9.107 |
| OSWorld-2.1 | 77,6% | **83,9%** | 74,2% |
| MKA | **53,4%** | 52,0% | 43,8% |
| Chartography | **66,6%** | 61,6% | 63,2% |
| Terminal-Bench-Science 0.1 | 51,4% | **59,9%** | 58,3% |
| HLE-Diamond | **58,8%** | 53,3% | 47,3% |

<small>Fuente: Google, vía Fello AI. "—" indica que no se publicó el dato. Algunas cifras de Sonnet 5.5 son ejecuciones de Google.</small>

Hydrogen gana en **7 de 10** pruebas. Pierde frente a Claude Sonnet 5.5 justo en las más cercanas al trabajo de terminal y de uso del computador: Terminal-Bench 4.1, OSWorld-2.1 y Terminal-Bench-Science. Si tu caso es un agente que opera una terminal o una interfaz gráfica, conviene probar ambos.

## Precio: el doble por token, menos por tarea

| | Gemini 3.8 Flash (hasta el 31 dic 2026) | Gemini 3.8 Flash (desde el 1 ene 2027) | **Gemini 4 Hydrogen** |
|---|---|---|---|
| Entrada (1M tokens) | US$0,75 | US$1,50 | **US$1,50** |
| Salida (1M tokens) | US$3,75 | US$7,50 | **US$7,50** |
| Entrada en caché (1M tokens) | — | — | **US$0,075** |

<small>Fuente: Google, vía VentureBeat y Fello AI.</small>

Puntos a tener en cuenta:

- **Hoy Hydrogen cuesta el doble que Flash por token.** Desde el 1 de enero de 2027 Flash sube al mismo precio, así que la diferencia desaparece.
- **El precio es fijo en todo el contexto de 1 millón de tokens.** No hay recargo por usar prompts largos.
- **Los tokens de razonamiento se cobran como salida.** Con `xhigh`, el modelo piensa más y la factura sube.
- **Batch y Flex cuestan la mitad.** Si tu tarea no necesita respuesta inmediata, úsalos.
- **La caché automática arranca en 4.096 tokens** (antes 6.144 en Flash). La caché explícita no está disponible en el lanzamiento.

Para comparar: los modelos pequeños más baratos del mercado, como Claude Haiku 5.5, GPT-6 Luna o Muse Ember, cuestan US$0,10 / US$0,50. Hydrogen es **15 veces más caro** por token, pero también mucho más capaz. Si tu tarea es simple y repetitiva (clasificar textos, extraer datos), un modelo pequeño sigue siendo la opción lógica.

## Orchestrator en Antigravity: Carbon planifica, Hydrogen ejecuta

Junto con Hydrogen, Google lanzó **Orchestrator** en Antigravity, su entorno de desarrollo con agentes. La idea es simple: no todos los pasos de una tarea necesitan el modelo más caro.

1. **Gemini 4 Carbon** recibe la tarea y arma el plan.
2. **Gemini 4 Hydrogen** se encarga de editar archivos y correr pruebas.
3. El cambio de modelo ocurre solo, dentro de la misma sesión.

Según Google, así se logra un éxito **cercano al de Carbon** en Terminal-Bench 4.0, terminando **19% más rápido** y usando **24% menos cuota**. Google no publicó la cifra exacta de éxito.

Es el mismo patrón que se recomienda al armar agentes propios: un modelo grande para decidir y uno rápido para ejecutar. Si te interesa conectar herramientas a tus agentes, revisa nuestra [guía para crear tus propios servidores MCP](/blog/mcp-servidores-propios-tutorial/).

<small>Según Fello AI, Orchestrator está llegando primero a los suscriptores de Google AI Ultra. Usar Hydrogen en Antigravity requiere AI Pro o Ultra.</small>

## En qué planes está disponible

| Plan | Acceso a Hydrogen |
|---|---|
| Gratis | No se puede elegir. Solo responde cuando la selección automática lo considera adecuado; la mayoría de las respuestas siguen siendo de Flash-Lite |
| Google AI Plus (US$4,99/mes) | Modelo principal, seleccionable, con el doble de límite que el plan gratis |
| Google AI Pro (US$19,99/mes) | Hydrogen y Argon |
| Google AI Ultra | Hydrogen con los límites más altos, más Argon y Carbon |
| Gemini API y AI Studio | Disponible, con un nivel gratuito con límites (los datos de ese nivel se usan para mejorar los productos de Google) |

<small>Fuentes: Notebookcheck y Fello AI. Las páginas de Google no coinciden del todo sobre qué modelos incluye Plus.</small>

Dos detalles:

- **Gemini 3.8 Flash ya no aparece** en la lista de modelos de la app en ningún plan.
- **El nivel `xhigh` solo está en la API y en Antigravity.** La app de Gemini ofrece `low`, `medium` y `high`.

## Qué cambia en Google Search

Para el usuario común, el cambio llega sin hacer nada. Hydrogen ya está en Google Search para todos, a nivel global. Robby Stein, vicepresidente de producto de Search, lo llamó "la mayor actualización de modelo de Search hasta ahora".

- **Entiende mejor las preguntas largas**, con varias partes o con errores de tipeo.
- **Respuestas más visuales:** más tablas, imágenes y herramientas a medida en AI Mode, en todos los idiomas compatibles.
- **Busca en más fuentes** para cada pregunta, así que las respuestas enlazan a más sitios.

Ese último punto importa si publicas contenido: más sitios citados significa más oportunidades de aparecer en las respuestas de IA.

## Para desarrolladores: lo que cambia en la API

Si migras desde Gemini 3.8 Flash, revisa esto antes de cambiar el ID del modelo:

- **El nivel por defecto ahora es `high`** (en Flash era `medium`). Si no lo fijas, gastarás más tokens de razonamiento.
- **El parámetro `thinking_budget` y el nivel `MINIMAL` ya no existen.** Las llamadas que los usen fallan.
- **La salida comparte el contexto.** Entrada, razonamiento y salida salen del mismo millón de tokens; en Flash la salida tenía su propio límite de 64K.
- **`xhigh` puede pensar de más.** Google advierte que en prompts simples gasta tokens sin mejorar el resultado.

## Dónde no gana y letra chica

- **Pierde frente a Claude Sonnet 5.5** en Terminal-Bench 4.1, OSWorld-2.1 y Terminal-Bench-Science, y en el índice de Artificial Analysis (55 frente a 51).
- **No es el más barato por tarea.** GPT-6.1 Terra logra la misma nota por la mitad del costo.
- **Rechaza más pedidos sin razón.** Según la ficha técnica de Google, los rechazos injustificados subieron 5,57 puntos frente a Flash, sobre todo con imágenes.
- **Las cifras principales son de Google.** El 2,5x, Terminal-Bench 4.1, las 5 veces menos alucinaciones y los datos de Orchestrator no tienen todavía verificación independiente.

## Conclusión

Gemini 4 Hydrogen es una mejora clara frente a Gemini 3.8 Flash: más rápido, bastante más capaz en tareas de agentes y, aunque cuesta más por token, más barato por tarea terminada. No es el modelo más inteligente ni el más barato del mercado, pero sí uno de los mejores equilibrios entre velocidad, capacidad y precio.

Si tienes un proyecto con agentes o un flujo de código que se está volviendo lento o caro, esta semana es buen momento para probarlo. Empieza con el nivel `high`, mide el costo por tarea y no por token, y compáralo con lo que usas hoy.

¿Buscas más capacidad de razonamiento? Revisa nuestro análisis de [Gemini 4 Argon](/blog/gemini-4-argon-como-usarlo-planes-benchmarks/) o el de [Claude Fable 5.2](/blog/claude-fable-5-2-novedades-planes-precio/).

## Preguntas frecuentes

### ¿Qué es Gemini 4 Hydrogen?

Es el modelo rápido de la familia Gemini 4 de Google, lanzado el 12 de noviembre de 2026. Reemplaza a Gemini 3.8 Flash y está pensado para código, agentes de IA y uso diario.

### ¿Cuánto más rápido es Gemini 4 Hydrogen que Gemini 3.8 Flash?

Google dice que completa las tareas 2,5 veces más rápido. Artificial Analysis mide 236 tokens por segundo, frente a 111 de Flash.

### ¿Cuánto cuesta Gemini 4 Hydrogen en la API?

US$1,50 por millón de tokens de entrada y US$7,50 por millón de salida, con el mismo precio en todo su contexto de 1 millón de tokens. Batch y Flex cuestan la mitad.

### ¿Gemini 4 Hydrogen es gratis?

En la app de Gemini, el plan gratuito no permite elegirlo: solo lo usa cuando la selección automática lo decide. En la Gemini API y AI Studio hay un nivel gratuito con límites.

### ¿Cuál es el ID de Gemini 4 Hydrogen en la API?

`gemini-4-hydrogen`.

### ¿Qué diferencia hay entre Hydrogen, Carbon y Argon?

Hydrogen es el modelo rápido y eficiente para el trabajo diario. Carbon y Argon son los modelos grandes de razonamiento profundo: más capaces en tareas difíciles, pero más lentos y caros.

<small>Fuentes: [VentureBeat](https://venturebeat.com/technology/google-launches-gemini-4-hydrogen-a-faster-smarter-pricier-flash-successor), [Notebookcheck](https://www.notebookcheck.net/Gemini-4-Hydrogen-What-free-users-and-Google-AI-Plus-get.1449493.0.html), [Fello AI](https://felloai.com/gemini-4-hydrogen/) y Artificial Analysis.</small>
