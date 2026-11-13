---
title: "Claude Fable 5.2: qué trae de nuevo, cuánto cuesta y en qué planes está"
description: "Anthropic lanzó Claude Fable 5.2: supera a Fable 5.1 en todos los benchmarks publicados y es 20% más barato en la API. Te explicamos las novedades, los benchmarks y en qué plan de Claude puedes usarlo."
pubDate: 2026-11-12
author: slagosdev
category: modelos
tags:
  - Claude
  - Anthropic
  - Fable 5.2
  - LLM
draft: false
featured: true
---

Lo normal es que un modelo nuevo y más capaz cueste más. Claude Fable 5.2 hace lo contrario: sube en casi todos los benchmarks y baja de precio. La letra chica está en otro lado: en qué plan estás y qué tipo de asiento tienes.

El 9 de noviembre de 2026, Anthropic presentó **Claude Fable 5.2**, que describe como su modelo más capaz para trabajo técnico. Viene junto a **Claude Mythos 5.2**, con las mismas capacidades pero disponible solo para organizaciones verificadas. Aquí nos enfocamos en Fable 5.2, que es el que puedes usar tú.

## Resumen en 30 segundos

- **Más capaz:** supera a Fable 5.1 en todos los benchmarks que publicó Anthropic, y en varios por mucho.
- **Más barato:** $8 / $40 por millón de tokens de entrada y salida en la API, frente a $10 / $50 de Fable 5.1.
- **No está en el plan Free.** En Pro se paga con créditos de uso; en Max, Ultra y los asientos premium está incluido hasta el 50% de tu límite semanal.
- **Hay oferta de lanzamiento** hasta el 16 de noviembre de 2026 para Pro y asientos estándar de Team.

## Qué es Fable 5.2

Fable es la línea más alta de Claude, por encima de Opus. Está pensada para el trabajo más exigente: razonamiento difícil, ingeniería de software de largo aliento y agentes que trabajan solos durante mucho tiempo. Fable 5.2 reemplaza a Fable 5.1 como el modelo más capaz que Anthropic ofrece al público general.

Datos básicos:

- **ID en la API:** `claude-fable-5-2`
- **Ventana de contexto:** 1 millón de tokens
- **Salida máxima:** 128K tokens
- **Dónde está:** Claude Platform, marketplaces, Amazon Web Services, Google Cloud y Microsoft Foundry

## Qué trae de nuevo

Según Anthropic y las empresas que lo probaron antes del lanzamiento, los avances van en tres direcciones:

- **Trabaja solo durante más tiempo.** Anthropic dice que puede llevar trabajo de ingeniería ambiguo "durante días" sin perder el hilo.
- **Coordina muchos agentes a la vez.** Puede orquestar cientos de subagentes en una misma tarea.
- **Revisa mejor su propio trabajo.** Los clientes destacan que verifica lo que hace antes de darlo por terminado.

Para ti, en la práctica: si usas agentes para tareas largas (migrar un proyecto, investigar un problema complejo, armar algo de punta a punta), Fable 5.2 debería necesitar menos intervención tuya para llegar al final.

## Benchmarks

Estas son las cifras que publicó Anthropic. Son mediciones de la propia empresa, no evaluaciones independientes.

| Benchmark | Fable 5.2 | Fable 5.1 | Opus 5.5 | GPT-6 Astra | Gemini 4 Carbon |
|---|---|---|---|---|---|
| FrontierCode 2.0 | **49.1%** | 32.4% | 45.5% | 42.8% | 41.1% |
| FrontierSWE v2 | **69.9%** | 56.3% | 62.3% | 65.5% | 61.2% |
| AutomationBench | 51.4% | 31.4% | 42.5% | 41.4% | **53.9%** |
| Terminal-Bench-Science 0.1 | **74.6%** | 52.6% | 58.7% | 68.1% | 64.8% |
| OSWorld 2.1 (parcial) | **89.3%** | 83.5% | 87.2% | 79.5% | 81.5% |
| RoboDojo Sim | **64.9%** | 27.6% | 39.4% | 29.8% | — |
| AA-Briefcase (rúbrica) | **66.1%** | 61.5% | 61.2% | 52.0% | 61.8% |
| AA-Briefcase (Elo) | 1785 | 1669 | **1800** | 1569 | 1611 |
| Remote Labor Index | **41.3%** | 17.9% | 21.3% | 20.8% | — |
| Humanity's Last Exam (con herramientas) | **74.2%** | 65.6% | 67.7% | 57.2% | — |
| Chartography (sin herramientas) | **73.4%** | 44.8% | 64.4% | 71.0% | 72.5% |

<small>Fuente: Anthropic. Algunas cifras usan niveles de esfuerzo distintos (FrontierCode 2.0 con esfuerzo `xhigh` en Fable; Remote Labor Index con `high` en Fable 5.2). "—" indica que no se publicó el dato.</small>

Lo que más llama la atención es el salto frente a Fable 5.1: en **Remote Labor Index** pasa de 17.9% a 41.3%, y en **RoboDojo Sim** de 27.6% a 64.9%. No es un ajuste menor: en esas dos pruebas más que duplica a su antecesor.

## Precio: el primer Fable que baja

| | Fable 5.1 | Fable 5.2 |
|---|---|---|
| Entrada | $10 / millón de tokens | **$8 / millón de tokens** |
| Salida | $50 / millón de tokens | **$40 / millón de tokens** |
| Lectura de caché | — | $0.20 / millón de tokens |

Es un 20% menos en entrada y salida. Además hay dos opciones extra:

- **Fast mode:** hasta 2.5 veces más rápido, a $16 / $80 por millón de tokens. También está disponible en Claude Code.
- **Inferencia solo en EE. UU.:** cuesta 1.1 veces el precio normal.

## En qué planes está disponible

Esta es la parte que más dudas genera. Depende del plan y, en Team y Enterprise, del tipo de asiento:

| Plan / asiento | Acceso a Fable 5.2 |
|---|---|
| Free | No disponible |
| Pro | Con créditos de uso (no cuenta dentro de los límites del plan) |
| Max y Ultra | Incluido, hasta el 50% de tus límites semanales |
| Team, asiento premium | Incluido, hasta el 50% de los límites semanales |
| Team, asiento estándar | Con créditos de uso, igual que Pro |
| Enterprise por asientos, premium | Incluido, hasta el 50% de los límites semanales |
| Enterprise por asientos, estándar | Con créditos de uso, si tu organización los habilitó |
| Enterprise por uso | Se cobra a tarifas estándar de la API |

<small>Fuente: centro de ayuda de Claude.</small>

Dos detalles importantes:

- **El 50% no es extra.** Es la parte de tu límite semanal que puedes gastar en Fable sin costo adicional. Si la superas, sigues con créditos de uso o cambias a otro modelo.
- **En Enterprise, Fable 5.2 viene apagado** hasta que un admin lo habilita. Siete días después del lanzamiento se agrega automáticamente a los roles que ya tenían algún modelo Fable, salvo que el admin lo excluya antes.

## La oferta de lanzamiento

Anthropic abrió dos ofertas desde el 9 de noviembre de 2026:

- **Pro y asientos estándar de Team:** hasta el **16 de noviembre de 2026 a las 11:59 p. m. (hora del Pacífico)** tienes todos los modelos Fable incluidos, hasta el 50% de tu límite semanal, más un reinicio del límite de Fable. Después vuelves a los créditos de uso.
- **Max, Ultra, asientos premium de Team y asientos premium de Enterprise por asientos:** recibes de uno a tres reinicios del límite de Fable según la antigüedad de tu suscripción (menos de 6 meses: uno; de 6 a 12 meses: dos; más de 12 meses: tres). Estos reinicios vencen el **8 de marzo de 2027**.

Para recibirla, tu cuenta debe tener facturación pagada activa desde antes del 9 de noviembre de 2026 a las 10:00 a. m. (hora del Pacífico). Quedan fuera el plan Free, los asientos estándar de Enterprise por asientos, los planes Enterprise self-serve y por uso, y los Enterprise HIPAA-ready.

## Novedades para desarrolladores

Si vas a usar Fable 5.2 desde la API o lo vas a cambiar en un proyecto que ya usa Fable 5.1, ten en cuenta:

- **El thinking siempre está activo.** No se puede desactivar; la profundidad se controla con el parámetro `effort` (de `low` a `max`). Anthropic recomienda empezar en `high`.
- **No hay `tool_choice` forzado.** Pedir `any` o una herramienta específica devuelve error; usa `auto` y guía al modelo desde el prompt.
- **Computer use cambia de herramienta.** Se usa `computer_toolset_20260801`; la versión anterior solo sigue funcionando en Amazon Bedrock.
- **Fast mode sin beta** en la Messages API: basta con `speed: "fast"`.
- **Claude Code:** necesitas la versión 2.1.321 o superior.

## Dónde no gana y letra chica

- **No lidera en todo.** En AutomationBench gana Gemini 4 Carbon (53.9% frente a 51.4%), y en el Elo de AA-Briefcase gana Opus 5.5 (1800 frente a 1785).
- **Retención de datos.** Usar Fable requiere por defecto retener los datos 30 días para monitoreo de seguridad. Las organizaciones con retención cero (ZDR) deben revisar las condiciones de su plan.
- **Temas sensibles.** Las consultas de ciberseguridad o biología que activen las salvaguardas pueden derivarse a un modelo menos capaz.
- **No es para todo.** Para tareas cortas y repetitivas, Sonnet 5.5 u Opus 5.5 siguen siendo más baratos. Fable 5.2 vale la pena cuando la tarea es larga y difícil.

## Conclusión

Fable 5.2 es la mejor noticia posible para quien ya pagaba por la línea Fable: más capacidad por menos dinero. Si estás en Max o en un asiento premium, ya lo tienes incluido. Si estás en Pro, aprovecha la oferta hasta el 16 de noviembre para probarlo sin gastar créditos y decidir si vale la pena para tu trabajo.

¿Ya lo probaste en alguna tarea larga? Cuéntame en los comentarios qué tal te fue y si notaste la diferencia frente a Fable 5.1.
