---
title: "Tutorial: construye un agente de investigación con LangGraph"
description: "LangGraph es el framework más maduro para agentes con estado. Construimos un agente que busca información, la evalúa, y decide si necesita más investigación antes de responder."
pubDate: 2026-04-13
author: "Equipo Blog IA"
tags: ["langgraph", "agentes", "tutorial", "python"]
category: tutorial
---

LangGraph modela los agentes como grafos donde los nodos son funciones y las aristas son transiciones (incluyendo condicionales). Esto lo hace más explícito y debuggeable que los agentes de "caja negra" donde el modelo decide todo internamente.

En este tutorial construimos un agente de investigación que: busca información, evalúa si es suficiente, y decide si buscar más o responder.

## Setup

```bash
pip install langgraph langchain-anthropic langchain-community
```

## El estado del agente

En LangGraph, el estado es lo que se pasa entre nodos. Definimos explícitamente qué información lleva el agente:

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    search_results: list[str]
    iterations: int
    final_answer: str | None
```

## Los nodos del grafo

Cada nodo es una función que recibe el estado y devuelve actualizaciones:

```python
from langchain_anthropic import ChatAnthropic
from langchain_community.tools import DuckDuckGoSearchRun

llm = ChatAnthropic(model="claude-sonnet-4-6")
search = DuckDuckGoSearchRun()

def search_node(state: AgentState) -> dict:
    """Busca información relevante para la query del usuario."""
    # Extraer la query del último mensaje del usuario
    query = state["messages"][-1].content
    
    # Generar queries de búsqueda con el LLM
    search_prompt = f"Genera 2 queries de búsqueda concisas para responder: {query}"
    queries_response = llm.invoke(search_prompt)
    
    # Ejecutar búsquedas
    results = []
    for line in queries_response.content.split('\n'):
        if line.strip():
            result = search.run(line.strip())
            results.append(result)
    
    return {
        "search_results": results,
        "iterations": state.get("iterations", 0) + 1
    }

def evaluate_node(state: AgentState) -> dict:
    """Evalúa si la información recopilada es suficiente."""
    query = state["messages"][-1].content
    results = "\n\n".join(state["search_results"])
    
    eval_prompt = f"""Tienes esta información:
{results}

¿Es suficiente para responder la pregunta: "{query}"?
Responde SOLO con "SUFICIENTE" o "INSUFICIENTE"."""
    
    evaluation = llm.invoke(eval_prompt)
    return {"messages": [{"role": "assistant", "content": evaluation.content}]}

def answer_node(state: AgentState) -> dict:
    """Genera la respuesta final basada en la investigación."""
    query = state["messages"][-1].content
    results = "\n\n".join(state["search_results"])
    
    answer_prompt = f"""Basándote en esta información:
{results}

Responde de forma completa y precisa: {query}"""
    
    answer = llm.invoke(answer_prompt)
    return {
        "messages": [{"role": "assistant", "content": answer.content}],
        "final_answer": answer.content
    }
```

## La lógica de decisión

El nodo condicional decide si seguir buscando o responder:

```python
def should_continue(state: AgentState) -> str:
    """Decide si buscar más o responder."""
    # Evitar loops infinitos
    if state.get("iterations", 0) >= 3:
        return "answer"
    
    # Revisar el último mensaje (evaluación)
    last_message = state["messages"][-1]
    if "SUFICIENTE" in last_message.content:
        return "answer"
    else:
        return "search"
```

## Construir el grafo

```python
from langgraph.graph import StateGraph, END

# Crear el grafo
workflow = StateGraph(AgentState)

# Añadir nodos
workflow.add_node("search", search_node)
workflow.add_node("evaluate", evaluate_node)
workflow.add_node("answer", answer_node)

# Definir el flujo
workflow.set_entry_point("search")
workflow.add_edge("search", "evaluate")

# Arista condicional desde evaluate
workflow.add_conditional_edges(
    "evaluate",
    should_continue,
    {
        "search": "search",  # vuelve a buscar
        "answer": "answer",  # genera respuesta
    }
)

workflow.add_edge("answer", END)

# Compilar
agent = workflow.compile()
```

## Usar el agente

```python
from langchain_core.messages import HumanMessage

def run_research_agent(question: str) -> str:
    result = agent.invoke({
        "messages": [HumanMessage(content=question)],
        "search_results": [],
        "iterations": 0,
        "final_answer": None,
    })
    return result["final_answer"]

# Ejemplo
respuesta = run_research_agent(
    "¿Cuáles son las principales diferencias entre Llama 4 y GPT-4.1?"
)
print(respuesta)
```

## Visualizar el grafo

```python
from IPython.display import Image, display

# En un notebook Jupyter
display(Image(agent.get_graph().draw_mermaid_png()))
```

## Añadir persistencia

LangGraph soporta checkpointing para persistir el estado entre runs:

```python
from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
agent_with_memory = workflow.compile(checkpointer=memory)

# Usar con thread_id para sesiones independientes
config = {"configurable": {"thread_id": "sesion-usuario-123"}}
result = agent_with_memory.invoke(initial_state, config=config)
```

## Por qué LangGraph sobre alternativas

La ventaja de LangGraph sobre agentes basados en tool_use directo del modelo: el flujo de control es tuyo, no del modelo. El modelo puede ser reemplazado sin cambiar la lógica del agente. El grafo es debuggeable y testeable.

La desventaja: más boilerplate que dejar que el modelo decida todo. Para agentes simples con 2-3 herramientas, puede ser excesivo.

---

*LangGraph v0.2+. Documentación completa en langchain-ai.github.io/langgraph.*
