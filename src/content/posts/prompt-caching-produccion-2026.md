---
title: "Prompt caching en producción: la optimización que casi nadie mide bien"
description: "El caching de prompts puede recortar coste y latencia a la mitad, pero solo si estructuras las peticiones para que el cache acierte. Guía práctica para devs."
pubDate: 2026-07-08
tags: ["prompt-caching", "coste", "produccion", "latencia"]
category: herramientas
---

El prompt caching lleva un año siendo estándar en las APIs de los grandes modelos, pero la mayoría de integraciones lo activan sin cambiar nada más y luego se preguntan por qué el ahorro no aparece en la factura. El caching no es un flag que enciendes: es una forma de ordenar tus peticiones.

## Cómo funciona por dentro

El proveedor cachea el prefijo de tokens que ya ha procesado. Si dos peticiones comparten los primeros N tokens exactos, la segunda reutiliza el trabajo de atención sobre ese prefijo y solo paga el sufijo nuevo. La palabra clave es **exactos**: un solo carácter distinto al principio invalida todo el cache aguas abajo.

## El error que mata el hit rate

El patrón habitual es meter algo variable al inicio del prompt: un timestamp, el ID de la sesión, el nombre del usuario. Eso rompe el prefijo compartido y el cache nunca acierta.

La regla es simple: **lo estable arriba, lo variable abajo.**

```text
[ system prompt fijo ]        <- cacheable
[ herramientas / schema ]     <- cacheable
[ documentos de contexto ]    <- cacheable si no cambian
[ historial de conversación ] <- semi-estable
[ mensaje del usuario ]       <- siempre nuevo, al final
```

## Mídelo o no existe

Las APIs devuelven en la respuesta cuántos tokens salieron del cache y cuántos se procesaron de nuevo. Si no estás logueando esos campos, no sabes tu hit rate y estás optimizando a ciegas. Un dashboard mínimo con `cache_read_tokens / total_input_tokens` te dice en un día si tu estructura funciona.

## Cuándo no vale la pena

El cache tiene un TTL corto (minutos). Si tus peticiones llegan espaciadas y no comparten prefijo real, escribir en cache cuesta más que leerlo y sales perdiendo. El caching brilla en cargas con mucho contexto repetido: agentes, RAG con documentos fijos, chats largos. Para llamadas sueltas y variadas, ni lo mires.

El ahorro está ahí, pero es tuyo solo si diseñas para él.
