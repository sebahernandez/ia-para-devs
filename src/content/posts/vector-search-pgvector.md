---
title: "pgvector en producción: búsqueda vectorial sin salir de PostgreSQL"
description: "Si ya usas PostgreSQL, pgvector te da búsqueda vectorial sin añadir otra base de datos. Tutorial de setup, indexación, y cuándo tiene sentido versus una base de datos vectorial dedicada."
pubDate: 2026-03-20
tags: ["pgvector", "postgresql", "rag", "tutorial"]
category: tutorial
---

El primer instinto cuando necesitas búsqueda vectorial para RAG suele ser "añado Pinecone o Weaviate". Si ya usas PostgreSQL, pgvector te da búsqueda vectorial sin añadir otra base de datos al stack, con las ventajas de ACID, joins SQL, y una sola infraestructura que mantener.

No es la solución para todo, pero para muchos casos es la más pragmática.

## Instalación

```bash
# En Debian/Ubuntu
sudo apt install postgresql-16-pgvector

# Con Docker
docker run -e POSTGRES_PASSWORD=password ankane/pgvector
```

```sql
-- En tu base de datos
CREATE EXTENSION vector;
```

## Crear la tabla con embeddings

```sql
CREATE TABLE documentos (
    id BIGSERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536),  -- dimensión según el modelo de embedding
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

La dimensión del vector debe coincidir con tu modelo de embedding:
- text-embedding-3-small (OpenAI): 1536
- text-embedding-ada-002 (OpenAI): 1536
- jina-embeddings-v2 (Jina): 768
- nomic-embed-text: 768

## Indexación

Sin índice, pgvector hace búsqueda exacta (costosa para colecciones grandes). Con índice, usa aproximación:

```sql
-- IVFFlat: bueno para la mayoría de casos
-- lists = sqrt(número de filas) es una buena heurística
CREATE INDEX ON documentos 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- HNSW: mejor recall, más memoria, más lento de construir
CREATE INDEX ON documentos 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

**IVFFlat**: mejor para datasets que cambian frecuentemente (el índice se actualiza bien). Peor recall a velocidades iguales que HNSW.

**HNSW**: mejor recall y velocidad de consulta. Más memoria y tiempo de construcción inicial. Ideal para datasets que cambian poco.

## Búsqueda vectorial

```sql
-- Top 5 documentos más similares a un embedding dado
SELECT id, contenido, metadata,
       1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similitud
FROM documentos
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;
```

Los operadores disponibles:
- `<=>`: distancia coseno (para texto, el más habitual)
- `<->`: distancia euclidiana
- `<#>`: producto interno negativo

## Implementación en Python

```python
import psycopg2
from openai import OpenAI
import numpy as np

openai_client = OpenAI()
conn = psycopg2.connect("postgresql://user:pass@localhost/dbname")

def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def insert_document(contenido: str, metadata: dict = None):
    embedding = get_embedding(contenido)
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO documentos (contenido, metadata, embedding) VALUES (%s, %s, %s)",
            (contenido, psycopg2.extras.Json(metadata), embedding)
        )
    conn.commit()

def search_similar(query: str, k: int = 5) -> list[dict]:
    query_embedding = get_embedding(query)
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, contenido, metadata,
                   1 - (embedding <=> %s::vector) AS similitud
            FROM documentos
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (query_embedding, query_embedding, k))
        
        rows = cur.fetchall()
    
    return [
        {"id": r[0], "contenido": r[1], "metadata": r[2], "similitud": r[3]}
        for r in rows
    ]
```

## Búsqueda híbrida: vectorial + texto completo

Una ventaja de estar en PostgreSQL: puedes combinar búsqueda vectorial con búsqueda de texto completo en una sola query:

```sql
SELECT id, contenido,
       (1 - (embedding <=> query_embedding)) * 0.7 +
       ts_rank(to_tsvector('spanish', contenido), plainto_tsquery('spanish', 'consulta')) * 0.3
       AS score_combinado
FROM documentos,
     (SELECT '[embedding aquí]'::vector AS query_embedding) params
WHERE to_tsvector('spanish', contenido) @@ plainto_tsquery('spanish', 'consulta')
   OR (1 - (embedding <=> query_embedding)) > 0.7
ORDER BY score_combinado DESC
LIMIT 10;
```

Esto implementa búsqueda híbrida sin necesidad de un sistema de búsqueda adicional como Elasticsearch.

## Cuándo usar pgvector vs base de datos vectorial dedicada

**Usa pgvector cuando:**
- Ya tienes PostgreSQL en tu stack
- Tu colección es de tamaño moderado (<10M vectores)
- Necesitas combinar búsqueda vectorial con queries SQL complejas
- Quieres simplicidad operacional

**Considera Pinecone/Weaviate/Qdrant cuando:**
- Escala muy grande (>100M vectores)
- Necesitas filtrado muy rápido sobre metadatos a escala
- Tu caso de uso es puramente búsqueda vectorial sin joins SQL
- Necesitas características específicas (multi-tenancy nativa, etc.)

Para la mayoría de aplicaciones de RAG con bases de conocimiento típicas (1K-1M documentos), pgvector es la opción más pragmática.

---

*pgvector v0.7+ requerido para índices HNSW. PostgreSQL 15+ recomendado.*
