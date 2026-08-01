---
title: "Structured outputs: por qué dejé de parsear JSON a mano de los LLMs"
description: "Los modelos ahora garantizan salida conforme a un JSON Schema. Se acabó el regex sobre respuestas rotas. Qué cambia para el dev y dónde sigue fallando."
pubDate: 2026-07-10
tags: ["structured-outputs", "json-schema", "tool-use", "integracion"]
category: tutorial
---

Durante años, sacar datos estructurados de un LLM era un ejercicio de fe: pedías JSON, rezabas, y montabas tres capas de reintentos por si el modelo devolvía markdown, una coma de más o una explicación no solicitada antes del `{`. Los structured outputs cierran ese capítulo.

## Qué garantiza realmente

Pasas un JSON Schema en la petición y el proveedor restringe la generación token a token para que la salida **siempre** valide contra ese schema. No es un post-procesado ni un "haz lo posible": es constrained decoding, el modelo no puede emitir un token que rompa la estructura.

```json
{
  "type": "object",
  "properties": {
    "sentimiento": { "type": "string", "enum": ["positivo", "neutro", "negativo"] },
    "confianza":   { "type": "number", "minimum": 0, "maximum": 1 }
  },
  "required": ["sentimiento", "confianza"],
  "additionalProperties": false
}
```

Con esto, `JSON.parse` nunca lanza. El `enum` nunca trae un valor inventado. Borras todo tu código defensivo de sanitización.

## Lo que garantiza la estructura, no el contenido

Aquí está el matiz que se le escapa a mucha gente: el schema garantiza la **forma**, no la **verdad**. `confianza: 0.99` valida perfectamente aunque el modelo esté equivocado. La validación estructural no sustituye a la evaluación de calidad; solo te quita el problema del parsing para que puedas centrarte en el de verdad.

## Coste que nadie menciona

Un schema muy anidado o con muchos `enum` grandes mete tokens y a veces empuja al modelo a razonar peor dentro de la jaula. Mantén los schemas planos y pequeños. Si necesitas un objeto gigante, probablemente quieras dos llamadas en vez de una.

## Regla práctica

Si vas a consumir la salida por código, usa structured outputs siempre. Si la salida la lee un humano, déjala en texto libre. Mezclar los dos —pedir JSON para luego mostrarlo como prosa— es el peor de los mundos.
