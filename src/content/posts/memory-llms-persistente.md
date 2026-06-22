---
title: "Memoria persistente en LLMs: el problema que nadie ha resuelto bien todavía"
description: "Los LLMs olvidan todo al terminar cada conversación. Varias aproximaciones intentan resolver esto con resultados muy dispares. Estado del arte y qué funciona en producción."
pubDate: 2026-06-08
tags: ["memoria", "persistencia", "agentes", "investigacion"]
category: investigacion
---

La memoria de los LLMs es una ilusión dentro de una conversación. Termina el contexto, termina el recuerdo. Para aplicaciones que necesitan persistencia (asistentes personales, agentes de larga duración, sistemas que aprenden de interacciones anteriores), esto es un problema fundamental que las arquitecturas actuales no resuelven de forma satisfactoria.

## Las aproximaciones existentes y sus limitaciones

### 1. Context stuffing: meter todo en el prompt

La solución más obvia: guarda el historial de conversaciones y agrégalo al contexto en cada llamada.

**Funciona para**: conversaciones cortas-medias con contexto limitado.

**Falla en**: historiales largos (el contexto se llena), coste (pagas por tokens de historial en cada llamada), información irrelevante que distrae al modelo.

El problema escalable: si un usuario ha tenido 100 conversaciones contigo, el historial completo puede ser varios millones de tokens. Eso no cabe en ningún contexto, y si cabe, es carísimo de enviar en cada request.

### 2. Resumen automático del historial

En lugar de guardar conversaciones completas, resumirlas periódicamente y guardar solo el resumen.

**Funciona para**: reducir el volumen de contexto histórico.

**Falla en**: los resúmenes pierden detalle. Los detalles que parecen irrelevantes para el resumen pueden ser importantes más tarde. La calidad del resumen determina la calidad de la memoria.

### 3. RAG sobre conversaciones anteriores

Guardar fragmentos de conversaciones anteriores como embeddings y recuperar los relevantes para la conversación actual.

**Funciona para**: recuperar información específica que el usuario mencionó antes ("¿no dijiste que prefieres respuestas cortas?").

**Falla en**: conexiones implícitas entre fragmentos, razonamiento sobre el historial completo, contexto que requiere ver varias conversaciones juntas.

### 4. Bases de datos de entidades explícitas

Mantener una base de datos estructurada de "hechos" sobre el usuario o el contexto (preferencias, datos relevantes, decisiones tomadas) y actualizarla durante las conversaciones.

**Funciona para**: información factual bien definida (nombre del usuario, preferencias explícitas, datos de cuenta).

**Falla en**: conocimiento implícito, contexto que no es fácilmente categorizable como "hecho", información contradictoria.

### 5. Memory de los proveedores (ChatGPT Memory, etc.)

OpenAI, Anthropic, y otros ofrecen funcionalidades de memoria gestionada por el proveedor. El modelo extrae automáticamente "memorias" de la conversación y las persiste.

**Funciona para**: el caso de uso de asistente personal general donde el usuario no quiere configurar nada.

**Falla en**: control granular (no sabes exactamente qué memoriza), uso en APIs propias (estas funcionalidades son de productos consumer, no siempre disponibles via API), privacidad (tus datos en la infraestructura del proveedor indefinidamente).

## El estado del arte en investigación

La investigación más prometedora en 2025-2026 trabaja en:

**MemGPT / arquitecturas de gestión de contexto**: sistemas que el modelo gestiona activamente qué mantener en el "contexto activo" y qué mover a "almacenamiento externo", similar a cómo un humano decide qué recordar conscientemente.

**Longterm memory con consolidación**: similar a cómo el sueño consolida memorias en humanos, modelos que periódicamente reorganizan y comprimen sus memorias para preservar lo más importante.

**Memoria asociativa**: almacenar memorias no como documentos independientes sino como redes de asociaciones, más similar a cómo funciona la memoria humana.

Ninguna de estas está lista para producción general todavía.

## Lo que funciona en producción hoy

Para aplicaciones reales que necesitan persistencia hoy, la combinación más efectiva:

```python
class PersistentAssistant:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.db = Database()
    
    def get_context_for_response(self, current_message: str) -> dict:
        # 1. Hechos explícitos del usuario (nombre, preferencias conocidas)
        user_facts = self.db.get_user_facts(self.user_id)
        
        # 2. Fragmentos relevantes de conversaciones anteriores (RAG)
        relevant_history = self.retrieve_relevant_history(current_message)
        
        # 3. Resumen de la conversación actual (si es larga)
        current_summary = self.summarize_if_needed(self.current_conversation)
        
        return {
            "user_facts": user_facts,
            "relevant_history": relevant_history,
            "current_summary": current_summary,
        }
    
    def update_after_response(self, conversation_turn: dict):
        # Extraer y guardar hechos nuevos
        new_facts = self.extract_facts(conversation_turn)
        self.db.upsert_user_facts(self.user_id, new_facts)
        
        # Guardar embedding del fragmento para retrieval futuro
        self.index_conversation_fragment(conversation_turn)
```

Es una solución parcial, no perfecta. Pero es lo que funciona hoy en producción con las herramientas disponibles.

## Por qué es un problema difícil

La memoria en LLMs no es solo un problema de ingeniería de software. Es un problema de representación: ¿cómo representar el conocimiento y el contexto de tal forma que un modelo de lenguaje pueda usarlo efectivamente?

Los embeddings vectoriales son buenos para recuperar fragmentos similares pero no para razonar sobre relaciones entre memorias. Las bases de datos relacionales son buenas para hechos estructurados pero no para contexto implícito. Los grafos de conocimiento son buenos para relaciones explícitas pero costosos de mantener.

La solución completa probablemente requiere avances en cómo los modelos representan y acceden al conocimiento, no solo mejores sistemas de almacenamiento externo.

Esto es un problema abierto. Si alguien afirma haberlo resuelto completamente, pide una demo con un caso de uso complejo.

---

*Estado del arte a junio 2026. El área está en desarrollo activo.*
