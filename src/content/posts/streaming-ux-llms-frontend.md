---
title: "Streaming de respuestas: la diferencia entre una app de IA usable y una que aburre"
description: "La latencia percibida importa más que la real. Streaming de tokens, estados intermedios y tool-use visible: cómo hacer que esperar no duela en el frontend."
pubDate: 2026-07-27
tags: ["streaming", "frontend", "ux", "integracion"]
category: herramientas
---

Un modelo tarda 8 segundos en completar una respuesta larga. Si el usuario mira un spinner esos 8 segundos, tu app se siente rota. Si ve texto apareciendo a los 300 ms, se siente instantánea aunque el total sea idéntico. La latencia percibida es la única que le importa al usuario, y el streaming es cómo la controlas.

## Lo básico: token por token

Las APIs devuelven la respuesta como un stream de eventos. Renderiza cada fragmento en cuanto llega en vez de esperar al final. En el navegador esto son Server-Sent Events o un `ReadableStream`; en frontend moderno, la mayoría de SDKs ya te dan un hook que actualiza el estado por delta.

```js
for await (const chunk of stream) {
  setTexto(prev => prev + chunk.delta);
}
```

Coste de implementación: bajo. Impacto en percepción: enorme.

## El nivel que casi nadie hace: mostrar el proceso

Con agentes y razonamiento, hay segundos antes del primer token de respuesta en los que el modelo piensa o llama herramientas. No dejes ese hueco en blanco. Emite estados intermedios:

```text
🔎 Buscando en la documentación...
🛠  Consultando la API de precios...
✍️  Redactando respuesta...
```

Ver *qué* está haciendo el modelo convierte la espera en confianza. Es la diferencia entre "está colgado" y "está trabajando".

## Los detalles que se rompen

- **Cancelación**: si el usuario reformula, aborta el stream anterior (`AbortController`). Si no, verás dos respuestas entrelazándose.
- **Markdown a medias**: renderizar markdown token a token muestra sintaxis rota a ratos. Renderiza como texto durante el stream y pasa a markdown al cerrar, o usa un parser tolerante a incompleto.
- **Errores a mitad de stream**: la conexión puede caer con la respuesta empezada. Ten un estado para "respuesta parcial + reintentar".

El modelo lo eligió tu equipo de ML. La sensación de la app la eliges tú, en el frontend, con el streaming.
