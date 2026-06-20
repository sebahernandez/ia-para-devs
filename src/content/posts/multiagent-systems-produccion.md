---
title: "Sistemas multiagente en producción: patrones que funcionan y los que fallan"
description: "Los sistemas con múltiples agentes de IA coordinándose son complejos de operar. Después de varios deployments, estos son los patrones arquitectónicos que sobreviven al contacto con producción."
pubDate: 2026-06-16
author: "Equipo Blog IA"
tags: ["multiagente", "arquitectura", "producción", "tutorial"]
category: tutorial
---

Los sistemas multiagente son la siguiente frontera en aplicaciones de IA: múltiples agentes especializados que se coordinan para completar tareas complejas. La promesa es real, pero la arquitectura de un sistema multiagente que funciona en producción es más delicada que la de un agente único.

## Los patrones que funcionan

### Orquestador-Worker

El patrón más probado: un agente orquestador que planifica y delega, y agentes worker especializados que ejecutan tareas específicas.

```python
from anthropic import Anthropic

client = Anthropic()

class OrchestratorAgent:
    def __init__(self):
        self.workers = {
            "research": ResearchWorker(),
            "code": CodeWorker(),
            "writer": WriterWorker(),
        }
    
    def run(self, task: str) -> str:
        # El orquestador planifica
        plan = self.plan_task(task)
        
        results = {}
        for step in plan.steps:
            worker = self.workers[step.worker_type]
            results[step.id] = worker.execute(
                task=step.task,
                context={k: results[k] for k in step.depends_on}
            )
        
        return self.synthesize(task, results)
    
    def plan_task(self, task: str) -> Plan:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            messages=[{
                "role": "user",
                "content": f"""Planifica cómo completar esta tarea usando los workers disponibles: 
                research, code, writer.
                
                Tarea: {task}
                
                Devuelve un JSON con steps: [{{id, worker_type, task, depends_on: []}}]"""
            }]
        )
        return Plan.from_json(response.content[0].text)
```

**Por qué funciona**: la separación entre planificación y ejecución hace el sistema más debuggeable. Puedes auditar el plan antes de ejecutarlo y reemplazar workers individuales sin cambiar el orquestador.

### Agentes con roles fijos

En lugar de un orquestador genérico, definir roles muy específicos para cada agente:

- **Agente Crítico**: revisa el trabajo del agente generador y señala problemas
- **Agente Verificador**: ejecuta código y verifica que funciona
- **Agente Redactor**: da formato y limpia el output final

Este patrón funciona bien porque cada agente tiene un propósito muy claro y las interfaces entre agentes son simples.

### Consenso en decisiones importantes

Para decisiones de alto impacto, hacer que múltiples agentes opinen y tomar la decisión más frecuente:

```python
async def consensus_decision(question: str, n_agents: int = 3) -> str:
    responses = await asyncio.gather(*[
        agent.decide(question) for agent in agents[:n_agents]
    ])
    # Voting por mayoría
    return max(set(responses), key=responses.count)
```

### Timeout y fallback explícitos

Nunca un sistema multiagente sin timeouts. Los agentes pueden quedar bloqueados, entrar en bucles, o esperar recursos que no llegan.

```python
async def run_agent_with_timeout(agent, task, timeout_seconds=60):
    try:
        return await asyncio.wait_for(agent.run(task), timeout=timeout_seconds)
    except asyncio.TimeoutError:
        logger.warning(f"Agent {agent.name} timed out on task: {task[:100]}")
        return agent.fallback_response(task)
```

## Los patrones que fallan

### Comunicación sin estructura

Agentes que se "hablan" con texto libre sin un esquema definido son una fuente de errores inacabables. El agente A produce un output en formato ligeramente diferente de lo que el agente B espera, y el resultado es silencioso y corrupto.

**Solución**: define interfaces explícitas entre agentes con schemas (Pydantic, TypedDict, o similar). El agente A devuelve un objeto validado que el agente B recibe con tipos garantizados.

### Loops sin condición de salida

Sistemas donde los agentes se pasan trabajo entre sí sin una condición clara de terminación. En producción, esto resulta en requests interminables y costes disparados.

**Solución**: máximo de iteraciones explícito en todos los loops. Sin excepción.

```python
MAX_ITERATIONS = 10

for i in range(MAX_ITERATIONS):
    result = agent.step(state)
    if result.is_complete:
        break
else:
    logger.error("Max iterations reached without completion")
    result = agent.generate_best_effort_response(state)
```

### Estado compartido mutable

Varios agentes que leen y escriben en el mismo estado sin coordinación. Condiciones de carrera, actualizaciones perdidas, estados inconsistentes.

**Solución**: cada agente recibe una copia inmutable del estado y devuelve un delta. El coordinador aplica los deltas en orden.

### Agentes que no reportan su estado

En un sistema multiagente, no sabes qué está pasando a menos que los agentes lo reporten explícitamente. El debugging sin logging de estado es casi imposible.

**Solución obligatoria en producción**: cada agente loguea al inicio y al final de cada tarea, con el input, el output, y el tiempo de ejecución.

## Observabilidad: lo que no puede faltar

```python
import structlog
from datetime import datetime

logger = structlog.get_logger()

class ObservableAgent:
    def __init__(self, name: str):
        self.name = name
    
    async def run(self, task: str, context: dict = None) -> dict:
        run_id = str(uuid.uuid4())[:8]
        start_time = datetime.now()
        
        logger.info("agent_start", 
                   agent=self.name, 
                   run_id=run_id,
                   task_preview=task[:100])
        
        try:
            result = await self._run_internal(task, context)
            
            logger.info("agent_complete",
                       agent=self.name,
                       run_id=run_id,
                       duration_ms=(datetime.now() - start_time).milliseconds,
                       tokens_used=result.get("tokens_used", 0))
            
            return result
        
        except Exception as e:
            logger.error("agent_error",
                        agent=self.name,
                        run_id=run_id,
                        error=str(e))
            raise
```

## La regla más importante

Los sistemas multiagente se vuelven más difíciles de depurar exponencialmente con el número de agentes. Empieza con dos agentes, no diez. Añade complejidad solo cuando hayas probado que el sistema más simple no puede resolver el problema.

Un sistema de dos agentes que funciona es más valioso que un sistema de diez que falla de formas que no entiendes.

---

*Patrones derivados de múltiples deployments de sistemas multiagente en producción durante 2025-2026.*
