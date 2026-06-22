---
title: "Structured outputs avanzado: más allá del JSON básico"
description: "JSON mode y structured outputs son solo el principio. Patrones avanzados para extraer datos complejos, manejar casos edge, y construir pipelines de extracción robustos en producción."
pubDate: 2026-05-11
tags: ["structured-outputs", "json", "tutorial", "producción"]
category: tutorial
---

Structured outputs (JSON mode) resolvió el problema obvio: hacer que el LLM devuelva JSON válido en lugar de texto libre con JSON mezclado. Pero en producción, los casos de uso son más complejos: schemas anidados, arrays de longitud variable, campos opcionales, validación de dominio, y extracción de múltiples entidades de un mismo texto.

## Más allá del JSON básico

### Extracción con Pydantic y validación de dominio

```python
from pydantic import BaseModel, field_validator, EmailStr
from anthropic import Anthropic
import json

client = Anthropic()

class ContactInfo(BaseModel):
    nombre: str
    email: EmailStr | None = None
    telefono: str | None = None
    empresa: str | None = None
    
    @field_validator("telefono")
    @classmethod
    def validate_phone(cls, v):
        if v is not None:
            # Normalizar formato de teléfono
            digits = "".join(filter(str.isdigit, v))
            if len(digits) < 9:
                return None  # teléfono inválido, lo descartamos
        return v

class EmailAnalysis(BaseModel):
    remitente: ContactInfo
    asunto: str
    tipo: str  # "soporte", "ventas", "queja", "informacion"
    urgencia: int  # 1-5
    puntos_clave: list[str]
    accion_requerida: bool
    
def analyze_email(email_text: str) -> EmailAnalysis:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Analiza este email y extrae la información en JSON.

Email:
{email_text}

Devuelve SOLO JSON válido con esta estructura:
{{
  "remitente": {{
    "nombre": "...",
    "email": "...",
    "telefono": "...",
    "empresa": "..."
  }},
  "asunto": "...",
  "tipo": "soporte|ventas|queja|informacion",
  "urgencia": 1-5,
  "puntos_clave": ["...", "..."],
  "accion_requerida": true/false
}}

Usa null para campos que no están disponibles."""
        }]
    )
    
    # Parsear y validar con Pydantic
    data = json.loads(response.content[0].text)
    return EmailAnalysis(**data)
```

### Extracción de múltiples entidades

Para textos que contienen múltiples entidades del mismo tipo:

```python
class Producto(BaseModel):
    nombre: str
    precio: float | None
    cantidad: int | None
    sku: str | None

class PedidoExtraido(BaseModel):
    numero_pedido: str | None
    fecha: str | None
    cliente: str | None
    productos: list[Producto]
    total: float | None

def extract_order(text: str) -> PedidoExtraido:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""Extrae todos los datos del pedido de este texto.

{text}

JSON con estructura:
{{
  "numero_pedido": "...",
  "fecha": "YYYY-MM-DD o null",
  "cliente": "...",
  "productos": [
    {{"nombre": "...", "precio": 0.0, "cantidad": 0, "sku": "..."}},
    ...
  ],
  "total": 0.0
}}"""
        }]
    )
    
    data = json.loads(response.content[0].text)
    return PedidoExtraido(**data)
```

### Manejo robusto de errores de parsing

```python
import re
from typing import TypeVar, Type

T = TypeVar("T", bound=BaseModel)

def safe_extract(text: str, schema: Type[T], max_retries: int = 2) -> T | None:
    for attempt in range(max_retries + 1):
        try:
            # Intentar extraer JSON del texto (a veces el modelo añade texto extra)
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if not json_match:
                raise ValueError("No JSON encontrado en la respuesta")
            
            data = json.loads(json_match.group())
            return schema(**data)
        
        except (json.JSONDecodeError, ValueError) as e:
            if attempt < max_retries:
                # Reintentar con un prompt de corrección
                text = fix_json_with_llm(text, str(e))
            else:
                return None

def fix_json_with_llm(broken_text: str, error: str) -> str:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""El siguiente texto contiene JSON inválido. Error: {error}

Texto:
{broken_text}

Devuelve SOLO el JSON corregido y válido, sin explicaciones."""
        }]
    )
    return response.content[0].text
```

## Structured outputs con OpenAI (modo estricto)

OpenAI ofrece structured outputs en modo estricto que garantiza que el output coincide con el schema:

```python
from openai import OpenAI
from pydantic import BaseModel

openai_client = OpenAI()

class CalificacionResena(BaseModel):
    sentimiento: str  # "positivo", "negativo", "neutro"
    puntuacion: int   # 1-5
    aspectos_positivos: list[str]
    aspectos_negativos: list[str]
    resumen: str

def classify_review(review: str) -> CalificacionResena:
    completion = openai_client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Analiza reseñas de productos y extrae información estructurada."},
            {"role": "user", "content": review}
        ],
        response_format=CalificacionResena,
    )
    return completion.choices[0].message.parsed
```

El modo estricto de OpenAI garantiza JSON válido que cumple el schema. El tradeoff: el schema debe ser más simple (no todos los tipos de Pydantic están soportados).

## El pipeline de extracción en escala

Para procesar miles de documentos:

```python
import asyncio
from anthropic import AsyncAnthropic

async_client = AsyncAnthropic()

async def extract_batch(texts: list[str], schema: Type[T]) -> list[T | None]:
    semaphore = asyncio.Semaphore(10)  # máximo 10 requests concurrentes
    
    async def extract_one(text: str) -> T | None:
        async with semaphore:
            response = await async_client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=1024,
                messages=[{"role": "user", "content": f"Extrae en JSON: {text}"}]
            )
            return safe_extract(response.content[0].text, schema)
    
    return await asyncio.gather(*[extract_one(text) for text in texts])

# Uso
results = asyncio.run(extract_batch(documentos, MiSchema))
exitosos = [r for r in results if r is not None]
print(f"Extraídos: {len(exitosos)}/{len(documentos)}")
```

---

*Patrones validados en pipelines de extracción de datos en producción procesando miles de documentos diarios.*
