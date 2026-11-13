---
title: 'pgvector en PostgreSQL: cómo usarlo para búsqueda vectorial'
description: >-
  Guía de pgvector paso a paso: instalación, tabla con embeddings, índices HNSW
  e IVFFlat, búsqueda por similitud desde Python y búsqueda híbrida. Código
  probado con pgvector 0.8.
pubDate: '2026-03-20'
category: tutorial
tags:
  - pgvector
  - postgresql
  - rag
  - tutorial
author: slagosdev
---

**pgvector** es una extensión de PostgreSQL que agrega un tipo de dato `vector` y operadores para buscar por similitud. Con ella puedes guardar embeddings junto a tus datos y encontrar los más parecidos a una consulta con SQL, sin sumar otra base de datos.

Conviene usarlo si ya tienes PostgreSQL y tu colección tiene hasta unos pocos millones de vectores, que es el caso de la mayoría de los sistemas RAG. En esta guía vas a instalarlo, crear una tabla con embeddings, indexarla y consultarla desde Python. Todo el código está probado con pgvector 0.8.7.

## ¿Qué es pgvector y para qué sirve?

Un embedding es una lista de números que representa el significado de un texto: textos parecidos tienen vectores cercanos. pgvector permite guardar esos vectores en una columna y ordenar filas por distancia a otro vector.

Así resuelves, dentro de PostgreSQL, la búsqueda semántica de un RAG, recomendaciones de contenido parecido o detección de duplicados. Y puedes combinarla con `WHERE`, `JOIN` y transacciones, como cualquier otra consulta.

## Paso 1: instalar pgvector

**Con Docker**, usa la imagen oficial (cambia `18` por tu versión de PostgreSQL):

```bash
docker run -d --name pg -e POSTGRES_PASSWORD=clave -p 5432:5432 pgvector/pgvector:pg18
```

**En Debian o Ubuntu**, con el repositorio de PostgreSQL configurado:

```bash
sudo apt install postgresql-18-pgvector
```

**En un servicio administrado** como Neon, Supabase, Amazon RDS o Google Cloud SQL ya viene disponible; solo hay que activarlo.

Luego actívalo en tu base de datos:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Paso 2: crear una tabla con embeddings

```sql
CREATE TABLE documentos (
    id BIGSERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536),
    creado_en TIMESTAMPTZ DEFAULT now()
);
```

La dimensión del vector debe coincidir con la del modelo de embeddings que uses:

| Modelo | Dimensiones |
|---|---|
| `text-embedding-3-small` (OpenAI) | 1536 |
| `text-embedding-3-large` (OpenAI) | 3072 |
| `nomic-embed-text` | 768 |

## Paso 3: buscar los documentos más parecidos

```sql
SELECT id, contenido, 1 - (embedding <=> '[0.12, -0.03, ...]') AS similitud
FROM documentos
ORDER BY embedding <=> '[0.12, -0.03, ...]'
LIMIT 5;
```

pgvector tiene tres operadores de distancia principales:

- `<=>`: distancia coseno. Es la habitual para texto. `1 - distancia` da la similitud.
- `<->`: distancia euclidiana (L2).
- `<#>`: producto interno negativo. Útil si tus vectores están normalizados.

## Paso 4: crear un índice

Sin índice, pgvector compara la consulta con cada fila. Es exacto, pero lento con muchas filas. Un índice hace una búsqueda aproximada mucho más rápida.

**HNSW** es la mejor opción por defecto: buena precisión y consultas rápidas. Gasta más memoria y tarda más en construirse. Está disponible desde pgvector 0.5.

```sql
CREATE INDEX ON documentos USING hnsw (embedding vector_cosine_ops);
```

**IVFFlat** se construye más rápido y usa menos memoria, pero con menos precisión. Créalo **después** de cargar los datos, porque agrupa las filas que ya existen. Una regla habitual es `lists` = filas / 1000 hasta un millón de filas.

```sql
CREATE INDEX ON documentos USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Usa la clase de operador que coincide con tu operador: `vector_cosine_ops` para `<=>`, `vector_l2_ops` para `<->` y `vector_ip_ops` para `<#>`. Si no coinciden, PostgreSQL no usa el índice.

Para mejorar la precisión de HNSW a cambio de velocidad, sube `hnsw.ef_search` (40 por defecto):

```sql
SET hnsw.ef_search = 100;
```

### ¿Y si mi modelo tiene más de 2000 dimensiones?

Los índices sobre el tipo `vector` admiten hasta 2000 dimensiones. Para modelos como `text-embedding-3-large` (3072), indexa una versión en media precisión con `halfvec` (disponible desde pgvector 0.7), que admite hasta 4000:

```sql
CREATE INDEX ON documentos USING hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);
```

En ese caso, las consultas deben usar la misma expresión: `ORDER BY embedding::halfvec(3072) <=> ...`.

## Paso 5: usar pgvector desde Python

Instala las dependencias:

```bash
pip install "psycopg[binary]" pgvector numpy openai
```

```python
import numpy as np
import psycopg
from openai import OpenAI
from pgvector.psycopg import register_vector
from psycopg.types.json import Jsonb

openai_client = OpenAI()  # lee OPENAI_API_KEY del entorno
conn = psycopg.connect("postgresql://usuario:clave@localhost:5432/mi_base", autocommit=True)
register_vector(conn)


def get_embedding(texto: str) -> np.ndarray:
    respuesta = openai_client.embeddings.create(model="text-embedding-3-small", input=texto)
    return np.array(respuesta.data[0].embedding)


def guardar_documento(contenido: str, metadata: dict | None = None) -> None:
    conn.execute(
        "INSERT INTO documentos (contenido, metadata, embedding) VALUES (%s, %s, %s)",
        (contenido, Jsonb(metadata or {}), get_embedding(contenido)),
    )


def buscar_similares(consulta: str, k: int = 5) -> list[dict]:
    filas = conn.execute(
        """
        SELECT id, contenido, 1 - (embedding <=> %(q)s) AS similitud
        FROM documentos
        ORDER BY embedding <=> %(q)s
        LIMIT %(k)s
        """,
        {"q": get_embedding(consulta), "k": k},
    ).fetchall()
    return [{"id": f[0], "contenido": f[1], "similitud": f[2]} for f in filas]
```

`register_vector` le enseña a psycopg a convertir arrays de NumPy al tipo `vector` y de vuelta. Sin esa línea, PostgreSQL recibe una lista y la consulta falla.

## ¿Cómo hacer búsqueda híbrida con pgvector?

Una ventaja de estar en PostgreSQL es que puedes combinar la similitud de vectores con la búsqueda de texto completo en una sola consulta, sin Elasticsearch. Esta pondera 70% similitud semántica y 30% coincidencia de palabras:

```sql
SELECT id, contenido,
       0.7 * (1 - (embedding <=> %(q)s))
     + 0.3 * ts_rank(to_tsvector('spanish', contenido), plainto_tsquery('spanish', %(texto)s)) AS puntaje
FROM documentos
ORDER BY puntaje DESC
LIMIT 10;
```

Desde Python la ejecutas igual que la anterior, pasando `{"q": get_embedding(consulta), "texto": consulta}`. Ajusta los pesos según tus datos. Con tablas grandes, ordenar por una expresión combinada no usa el índice vectorial: primero trae unos 100 candidatos por similitud y luego reordénalos.

## ¿pgvector o una base de datos vectorial dedicada?

**Usa pgvector cuando:**
- Ya tienes PostgreSQL.
- Tu colección tiene hasta unos pocos millones de vectores.
- Necesitas combinar la búsqueda con filtros, joins o transacciones.
- Quieres una sola base de datos que mantener.

**Considera Pinecone, Qdrant o Weaviate cuando:**
- Tienes cientos de millones de vectores.
- Necesitas filtrar por metadatos muy rápido a esa escala.
- Tu caso es solo búsqueda vectorial, sin datos relacionales.
- Necesitas funciones específicas, como multitenencia nativa.

Para la mayoría de los sistemas RAG con bases de conocimiento típicas, de mil a un millón de documentos, pgvector es la opción más simple.

## Preguntas frecuentes

**¿pgvector es gratis?**
Sí. Es código abierto (licencia de PostgreSQL) y viene incluido en la mayoría de los servicios de PostgreSQL administrado.

**¿Qué versión de PostgreSQL necesito?**
pgvector 0.8 soporta PostgreSQL 13 a 18. Usa la versión más reciente que te permita tu proveedor.

**¿HNSW o IVFFlat?**
HNSW en casi todos los casos. IVFFlat solo si la memoria o el tiempo de construcción del índice son un problema.

**¿Cuántos vectores aguanta pgvector?**
Millones sin problema con un índice HNSW y memoria suficiente para que el índice quepa en RAM. Más allá de decenas de millones conviene medir con tus datos o evaluar una base dedicada.
