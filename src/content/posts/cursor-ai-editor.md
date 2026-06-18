---
title: "Cursor: el editor que convirtió la IA en parte del entorno de desarrollo"
description: "Cursor es un fork de VS Code con integración nativa de LLMs. Más que un plugin, cambia el modelo mental de cómo interactuar con el código. Repasamos qué lo diferencia de GitHub Copilot y cuándo merece el cambio."
pubDate: 2025-02-05
author: "Equipo Blog IA"
tags: ["cursor", "ide", "developer-tools", "productividad"]
category: herramientas
---

Cursor no es un plugin. Es un fork de VS Code que integra LLMs a nivel profundo: no solo para completado de código, sino para conversaciones sobre el codebase, edición de múltiples archivos simultáneos y comprensión del contexto del proyecto completo.

La diferencia entre Cursor y GitHub Copilot no es de calidad del modelo. Es de modelo mental.

## Las tres funciones que lo distinguen

**Cmd+K (edición en línea)**: Seleccionas código, describes el cambio y el modelo modifica exactamente ese fragmento. Sin abrir un chat lateral, sin copiar y pegar. La edición ocurre en el archivo directamente, con diff visual para aceptar o rechazar.

**Composer**: La función más potente. Describes una tarea más amplia y Cursor propone cambios en múltiples archivos. Piensa en él como la versión integrada en el editor de lo que GitHub Copilot Workspace intenta hacer desde GitHub.com.

**Codebase chat**: Puedes preguntar sobre el proyecto completo. "¿Dónde se maneja la autenticación?", "¿Qué función llama a este endpoint?". El modelo indexa el repositorio y usa esa información en las respuestas.

## Qué modelos usa

Cursor tiene sus propios contratos con OpenAI y Anthropic. Por defecto usa GPT-4o y Claude 3.5 Sonnet, y te deja elegir cuál prefieres para cada tarea. Puedes traer tu propia API key si prefieres.

En plan gratuito tienes 50 consultas rápidas y 10 respuestas lentas al mes. El plan Pro ($20/mes) da acceso ilimitado a modelos rápidos.

## GitHub Copilot vs Cursor: la decisión real

Si ya tienes GitHub Copilot y estás satisfecho con el autocompletado, el salto a Cursor merece evaluarse si haces cambios frecuentes que afectan múltiples archivos o si quieres navegar el código con lenguaje natural.

Para autocompletado solo, Copilot es suficiente. Para edición guiada por IA que va más allá de una línea o función, Cursor tiene ventaja estructural.

## La crítica razonable

Cursor envía tu código a sus servidores (y a los modelos de OpenAI/Anthropic). Para proyectos con restricciones de confidencialidad o compliance estricto, esto puede ser un bloqueador. La opción de self-hosting no existe todavía.

El pricing también cambia si usas mucho el Composer en modo agente: puede consumir muchos tokens rápido.

---

*Fuentes: Cursor changelog oficial, comparativas de usuarios en Hacker News, documentación de Cursor.*
