---
title: "Structured Outputs de OpenAI: JSON garantizado sin parsear texto libre"
description: "Con Structured Outputs, GPT-4o puede garantizar que su salida se ajuste exactamente a un schema JSON. Cómo implementarlo, cuándo usarlo y qué diferencia hay con el modo JSON anterior."
pubDate: 2025-07-28
tags: ["openai", "structured-outputs", "json", "tutorial"]
category: tutorial
---

Extraer información estructurada de texto con LLMs siempre tuvo el mismo problema: el modelo genera JSON casi correcto casi siempre, pero el "casi" es suficiente para que tu aplicación falle en producción. Structured Outputs de OpenAI, lanzado en agosto de 2024, resuelve esto con una garantía fuerte.

## La diferencia con el modo JSON anterior

El modo JSON de OpenAI (disponible desde 2023) garantiza que la respuesta es JSON válido. No garantiza que se ajuste a tu schema específico.

**Modo JSON**: la salida es `{"nombre": "Ana", "edad": "25"}` o `{"name": "Ana", "years": 25}` (el modelo inventa nombres de campos).

**Structured Outputs**: la salida es exactamente `{"nombre": "Ana", "edad": 25}` si ese es tu schema. Los campos existen, los tipos son correctos, no hay campos extra.

## Implementación con el SDK de Python

```python
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI()

class DatosPersona(BaseModel):
    nombre: str
    edad: int
    email: str
    experiencia_años: float

completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {
            "role": "user",
            "content": "Extrae los datos del siguiente CV: Ana García, 28 años, ana@example.com, 4.5 años en desarrollo backend."
        }
    ],
    response_format=DatosPersona,
)

persona = completion.choices[0].message.parsed
print(persona.nombre)  # "Ana García"
print(persona.edad)    # 28
```

## Implementación con TypeScript y Zod

```typescript
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const client = new OpenAI();

const DatosPersona = z.object({
  nombre: z.string(),
  edad: z.number().int(),
  email: z.string().email(),
  experiencia_años: z.number(),
});

const completion = await client.beta.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  messages: [
    {
      role: 'user',
      content: 'Extrae los datos: Ana García, 28 años, ana@example.com, 4.5 años backend.'
    }
  ],
  response_format: zodResponseFormat(DatosPersona, 'datos_persona'),
});

const persona = completion.choices[0].message.parsed;
// persona está tipado como { nombre: string, edad: number, email: string, ... }
```

## Casos de uso más comunes

**Extracción de información de documentos**: facturas, contratos, CVs, tickets de soporte.

**Clasificación con metadatos**: no solo la etiqueta, sino confianza, razonamiento y campos adicionales.

**Transformación de formatos**: convertir texto no estructurado a objetos para guardar en base de datos.

**Validación con razonamiento**: pedir al modelo que evalúe y justifique.

## Limitaciones

- No disponible en todos los modelos: requiere `gpt-4o-2024-08-06` o posterior
- Los schemas muy profundamente anidados pueden tener problemas
- El modelo puede devolver `null` en campos opcionales aunque haya información disponible
- Para casos con mucha ambigüedad, el modelo puede elegir interpretar el schema de formas inesperadas

---

*Fuentes: Documentación oficial de Structured Outputs de OpenAI, blog de lanzamiento de agosto 2024.*
