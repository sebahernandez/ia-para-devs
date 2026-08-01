---
title: "Escribir tu propio servidor MCP: menos magia de la que crees"
description: "El Model Context Protocol se volvió el estándar para conectar herramientas a los LLMs. Montar un servidor propio es sorprendentemente sencillo. Qué expone y cómo diseñarlo."
pubDate: 2026-07-30
tags: ["mcp", "agentes", "tool-use", "tutorial"]
category: tutorial
---

El Model Context Protocol se consolidó como la forma estándar de darle herramientas a un modelo sin acoplar tu integración a un proveedor concreto. Escribes un servidor MCP una vez y cualquier cliente compatible —editor, agente, asistente— puede usar tus herramientas. La buena noticia para el dev: montar uno es mucho menos trabajo del que suena.

## Qué expone un servidor MCP

Tres tipos de cosas, y conviene no confundirlas:

- **Tools**: acciones que el modelo puede invocar (consultar tu API, escribir en tu DB, lanzar un job). Tienen efectos.
- **Resources**: datos que el modelo puede leer (un fichero, un registro, el resultado de una query). Son de solo lectura.
- **Prompts**: plantillas reutilizables que el usuario puede invocar.

La distinción tool/resource importa: las tools *hacen*, los resources *informan*. Meter una acción con efectos como resource es una fuente clásica de sorpresas.

## El diseño que hace o rompe la experiencia

El modelo elige qué herramienta usar leyendo su **descripción**. Esa descripción es tu interfaz de verdad, no la firma de la función. Reglas:

- Describe **cuándo** usar la herramienta, no solo qué hace. "Usa esto para X cuando el usuario pida Y."
- Nombres y parámetros explícitos. `buscar_pedido(id_pedido)` gana a `query(q)`.
- Pocas herramientas bien definidas baten a treinta que se solapan. El modelo se pierde eligiendo entre opciones ambiguas.

## Errores como datos, no como excepciones

Cuando una tool falla, no revientes la conexión: devuelve el error como resultado, en lenguaje que el modelo pueda entender y sobre el que pueda actuar. "No existe un pedido con ese ID, pídele al usuario que lo confirme" es infinitamente más útil que un stack trace o un 500 mudo. El servidor MCP no habla con humanos; habla con un modelo que va a leer ese texto y decidir el siguiente paso.

## Empieza con una sola herramienta

No diseñes el servidor definitivo. Expón una tool real, conéctala a un cliente, mira cómo la usa el modelo de verdad y ajusta la descripción según lo que veas. El bucle corto de "observa y corrige la descripción" te enseña más que cualquier especificación previa.
