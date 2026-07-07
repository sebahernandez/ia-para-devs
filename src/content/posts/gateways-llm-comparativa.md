---
title: "Gateways de LLM en 2026: por qué casi nadie debería llamar a la API directamente"
description: "LiteLLM, Portkey, OpenRouter y compañía se han vuelto pieza estándar de cualquier despliegue serio. Qué resuelven y cuándo conviene cada enfoque."
pubDate: 2026-07-04
tags: ["gateway", "litellm", "herramientas", "infraestructura"]
category: herramientas
---

Hace dos años, integrar un LLM era llamar al SDK de un proveedor y listo. Hoy, cualquier despliegue medianamente serio pone un gateway por delante. No por moda: porque llamar a una sola API directamente se ha vuelto una decisión frágil. Veamos por qué y qué opciones hay.

## Qué problema resuelve un gateway

Un gateway de LLM se sitúa entre tu aplicación y los proveedores, y te da:

- **Una interfaz única** para hablar con OpenAI, Anthropic, Google, modelos open source, etc. Cambias de modelo sin cambiar código.
- **Fallback y reintentos** cuando un proveedor cae o rate-limitea.
- **Control de coste** con presupuestos, límites por usuario y visibilidad del gasto.
- **Caching** para no pagar dos veces por la misma petición.
- **Routing** hacia el modelo más barato que cumpla la tarea.

Todo esto lo puedes escribir tú. La pregunta es si quieres mantenerlo.

## Las opciones que importan

**LiteLLM** — Open source, se autohospeda, traduce a más de 100 proveedores con la misma interfaz estilo OpenAI. Es la opción por defecto si quieres control y no depender de un tercero. Su proxy añade presupuestos, claves virtuales y logging.

**Portkey** — Más orientado a producto: gateway gestionado con observabilidad, guardrails y gestión de prompts integrada. Menos que montar, más que confiar en un tercero para el camino crítico.

**OpenRouter** — Más un marketplace: acceso a muchísimos modelos con una sola cuenta y un solo billing, ideal para prototipar y comparar modelos sin abrir diez cuentas.

## Cómo elegir sin complicarte

La escalera es simple:

1. **¿Solo un modelo, un proveedor, bajo volumen?** No necesitas gateway. El SDK directo está bien. No añadas infraestructura para un problema que no tienes.
2. **¿Quieres cambiar de modelo sin tocar código, con fallback y control de coste?** LiteLLM autohospedado. El estándar razonable.
3. **¿No quieres mantener infraestructura y prefieres pagar por observabilidad y guardrails?** Un gateway gestionado como Portkey.
4. **¿Estás experimentando y comparando muchos modelos?** OpenRouter para no fragmentar cuentas.

## La trampa del sobre-diseño

He visto equipos montar un gateway con routing multi-proveedor, caching semántico y presupuestos por usuario para una app que llama a un solo modelo cien veces al día. Eso es infraestructura para un problema hipotético.

Empieza con el SDK directo. Añade el gateway el día que tengas un segundo modelo, un incidente de disponibilidad o una factura que necesites entender. Ese día llega para casi todos, pero no llega el día uno. Construir para él antes de tiempo es pagar complejidad a crédito.
