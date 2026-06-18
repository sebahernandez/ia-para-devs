---
title: "Claude Computer Use: el modelo que opera interfaces gráficas, con todas sus limitaciones"
description: "Anthropic lanzó en beta la capacidad de Claude para controlar un ordenador mediante capturas de pantalla. Revisamos cómo funciona, para qué sirve hoy y por qué todavía no reemplaza la automatización tradicional."
pubDate: 2025-04-22
author: "Equipo Blog IA"
tags: ["anthropic", "claude", "computer-use", "automatización"]
category: herramientas
---

En octubre de 2024, Anthropic añadió a Claude 3.5 Sonnet una capacidad que lleva años siendo el sueño de la automatización: operar una interfaz gráfica como lo haría un humano. Toma capturas de pantalla, interpreta lo que ve, mueve el cursor, hace clic y escribe.

Es una demostración impresionante. En producción todavía tiene muchas aristas. Aquí explicamos las dos cosas con honestidad.

## Cómo funciona técnicamente

Computer Use no usa accesibilidad ni hooking de sistema operativo. Funciona con:

1. Una captura de pantalla en cada paso
2. Claude interpreta la imagen y decide qué acción tomar
3. Las acciones disponibles: `screenshot`, `key`, `type`, `mouse_move`, `left_click`, `right_click`, `middle_click`, `double_click`, `left_click_drag`, `scroll`
4. Un entorno que ejecuta las acciones físicamente (típicamente una VM)

El modelo recibe la captura, genera la siguiente acción en JSON, el entorno la ejecuta y vuelve a tomar captura. Iteración tras iteración.

## Para qué funciona razonablemente hoy

- **Rellenar formularios web estándar** con información específica
- **Navegar por interfaces simples** con pasos bien definidos
- **Tareas de extracción** donde la interfaz no tiene API
- **QA básico** de flujos de usuario en aplicaciones web

Para tareas repetitivas con estructura clara y tolerancia a errores ocasionales, puede ahorrar tiempo real.

## Las limitaciones que importan

**Velocidad**: Cada iteración implica una llamada a la API con una imagen. Para flujos de 20 pasos, esto es caro y lento. La automatización tradicional con Selenium o Playwright sigue siendo 100x más rápida y barata para tareas definidas.

**Fiabilidad**: El modelo comete errores. A veces hace clic en el lugar equivocado, malinterpreta un estado de la interfaz o no reconoce un elemento de UI poco convencional. Sin supervisión humana, puede ejecutar acciones incorrectas.

**Seguridad**: Anthropic advierte explícitamente contra darle acceso a sistemas con datos sensibles sin supervisión. El modelo puede ser manipulado por contenido en la pantalla (prompt injection visual).

## Cuándo tiene sentido usarlo

La comparación relevante no es "Computer Use vs. Selenium para automatizar un flujo conocido". La comparación real es "Computer Use vs. construir desde cero una integración para una herramienta que no tiene API".

Si tienes una herramienta legacy sin API, con UI compleja, para un caso de uso poco frecuente que no justifica una integración técnica completa, Computer Use puede ser la forma más pragmática de automatizarlo.

---

*Fuentes: Documentación oficial de Computer Use de Anthropic, blog de lanzamiento, guía de seguridad oficial.*
