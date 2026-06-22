---
title: "MCP vs herramientas propias: cuándo estandardizar y cuándo no"
description: "MCP tiene mucho hype pero no es la solución para todo. Analizamos cuándo tiene sentido adoptar el protocolo y cuándo tu implementación propia de herramientas es más pragmática."
pubDate: 2026-02-08
tags: ["mcp", "herramientas", "arquitectura", "opinión"]
category: opinión
---

MCP (Model Context Protocol) ganó mucha adopción en 2025 y el ecosistema de servidores MCP disponibles creció rápidamente. Pero hay una brecha entre "el protocolo es bueno" y "deberías usarlo para tu aplicación". Exploramos cuándo MCP tiene sentido y cuándo añade complejidad sin valor.

## Qué resuelve MCP bien

MCP brilla en dos escenarios concretos:

**1. Herramientas compartidas entre múltiples clientes.** Si tienes herramientas (acceso a base de datos, APIs internas, sistemas de archivos) que quieres usar desde Claude Desktop, Cursor, tu aplicación propia, y otros clientes compatibles, MCP te da interoperabilidad sin duplicar la implementación.

**2. Distribuir herramientas a terceros.** Si construyes un producto y quieres que los usuarios lo integren con sus LLMs preferidos, publicar un servidor MCP es más fácil que mantener SDKs para cada proveedor.

## Cuándo MCP añade complejidad innecesaria

**Si solo tienes un cliente.** Si tu aplicación llama a LLMs desde un único lugar, implementar el protocolo completo de MCP añade una capa de abstracción que no te da nada. Las herramientas en el formato nativo del proveedor (tool_use de Anthropic, function calling de OpenAI) son más simples.

**Si tus herramientas son simples y estables.** Para tres herramientas que nunca van a cambiar, el overhead de gestionar un servidor MCP separado no vale la pena. Hardcodear la implementación es más mantenible.

**Si la latencia de red importa.** MCP en modo HTTP añade un hop de red en cada llamada a herramienta. Para aplicaciones donde la latencia es crítica, la comunicación directa en proceso es mejor.

## La pregunta clave

¿Cuántos consumidores diferentes van a usar estas herramientas?

- **1 consumidor**: no uses MCP, usa el formato nativo
- **2-3 consumidores propios**: considera MCP si los consumidores son heterogéneos
- **Múltiples consumidores externos**: MCP es la opción correcta

## El overhead real de MCP

Para ser específicos: implementar un servidor MCP básico en TypeScript son unas 50-100 líneas. No es dramáticamente complejo. El overhead no es en la implementación inicial sino en:

- Gestionar el proceso del servidor (start/stop, logs, actualizaciones)
- Debuggear problemas de comunicación entre cliente y servidor
- Manejar versioning del protocolo a medida que MCP evoluciona

Si construyes una aplicación de producción, este overhead es manejable. Si estás prototipando, probablemente no vale la pena.

## El argumento a favor de MCP que me convence más

La compatibilidad futura. Si hoy implementas herramientas con el formato específico de OpenAI y mañana quieres usar Claude, tienes que reescribir. Con MCP, el servidor de herramientas es agnóstico al modelo. El coste inicial es real pero la flexibilidad a largo plazo también.

Para aplicaciones que van a vivir más de seis meses y donde la elección de modelo puede cambiar, ese argumento es sólido.

## Mi recomendación práctica

Empieza con herramientas en formato nativo del proveedor que estés usando. Si después de tres meses en producción te encuentras queriendo:
- Usar las mismas herramientas desde otro cliente
- Compartir las herramientas con el equipo de otra aplicación
- Publicar las herramientas para usuarios externos

Entonces migra a MCP. La migración no es difícil porque la lógica de negocio de las herramientas no cambia, solo el wrapper.

No construyas para la flexibilidad que no necesitas todavía.

---

*Evaluación basada en implementar ambos enfoques en proyectos reales durante 2025-2026.*
