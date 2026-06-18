---
title: "Fine-tuning de GPT-4o Mini: cuándo hacerlo y cómo preparar los datos"
description: "OpenAI permite hacer fine-tuning de GPT-4o Mini con tus propios datos. Guía completa: preparación del dataset, formato JSONL, llamada a la API y evaluación del resultado."
pubDate: 2025-09-15
author: "Equipo Blog IA"
tags: ["fine-tuning", "openai", "gpt-4o-mini", "tutorial"]
category: tutorial
---

El fine-tuning permite adaptar GPT-4o Mini a un estilo, dominio o conjunto de tareas específico. Es útil cuando el prompt engineering ya no es suficiente para conseguir el comportamiento que necesitas de forma consistente.

## Cuándo tiene sentido hacer fine-tuning

El fine-tuning **no** es lo primero que hay que intentar. Antes de llegar ahí:

1. ¿Has probado con un system prompt detallado? Muchos comportamientos se controlan sin fine-tuning.
2. ¿Has probado few-shot con ejemplos en el prompt? Si 10-20 ejemplos en el prompt ya dan buen resultado, el fine-tuning puede mejorar pero la ganancia es menor.
3. ¿El problema es conocimiento fáctico que no está en el modelo? RAG es mejor que fine-tuning para añadir conocimiento.

**El fine-tuning sí tiene sentido cuando:**
- Necesitas un estilo muy específico que el modelo no reproduce bien con instrucciones
- Tienes un formato de salida complejo y consistencia es crítica
- Quieres reducir la longitud del prompt (el modelo aprende el contexto, necesitas menos ejemplos)
- Necesitas comportamiento muy específico en dominio técnico especializado

## Preparar el dataset: formato JSONL

OpenAI requiere el dataset en formato JSONL, con cada línea siendo una conversación completa:

```jsonl
{"messages": [{"role": "system", "content": "Eres un asistente de soporte técnico para la empresa Acme. Responde siempre en un tono profesional y conciso."}, {"role": "user", "content": "Mi factura del mes anterior no refleja el descuento prometido."}, {"role": "assistant", "content": "Entiendo la situación. Para revisar tu factura y aplicar el descuento correspondiente, necesito tu número de cuenta o el correo de registro. ¿Podrías proporcionarlo?"}]}
{"messages": [{"role": "system", "content": "Eres un asistente de soporte técnico para la empresa Acme. Responde siempre en un tono profesional y conciso."}, {"role": "user", "content": "¿Puedo cambiar mi plan mensual a anual en cualquier momento?"}, {"role": "assistant", "content": "Sí, el cambio de plan mensual a anual está disponible en cualquier momento desde el panel de configuración, sección 'Facturación'. El nuevo precio se aplica en el siguiente período."}]}
```

## Cantidad mínima de ejemplos

OpenAI recomienda al menos 10 ejemplos, con 50-100 siendo un punto de partida razonable. Para comportamiento muy específico, 500-1000 ejemplos dan resultados más consistentes.

La calidad de los ejemplos importa más que la cantidad: 100 ejemplos perfectos superan a 1000 mediocres.

## Crear el trabajo de fine-tuning con Python

```python
from openai import OpenAI
import json

client = OpenAI()

# Subir el archivo de training
with open('training_data.jsonl', 'rb') as f:
    training_file = client.files.create(file=f, purpose='fine-tune')

print(f"Archivo subido: {training_file.id}")

# Crear el trabajo de fine-tuning
job = client.fine_tuning.jobs.create(
    training_file=training_file.id,
    model='gpt-4o-mini-2024-07-18',
    hyperparameters={
        'n_epochs': 3,  # 3 es el valor por defecto, suficiente para empezar
    }
)

print(f"Job iniciado: {job.id}")

# Monitorizar el progreso
import time
while True:
    job_status = client.fine_tuning.jobs.retrieve(job.id)
    print(f"Estado: {job_status.status}")
    
    if job_status.status in ['succeeded', 'failed']:
        break
    
    time.sleep(60)

print(f"Modelo fine-tuned: {job_status.fine_tuned_model}")
```

## Usar el modelo fine-tuned

```python
response = client.chat.completions.create(
    model=job_status.fine_tuned_model,  # "ft:gpt-4o-mini-2024-07-18:acme::XXXXX"
    messages=[
        {"role": "user", "content": "¿Puedo cancelar mi suscripción?"}
    ]
)
```

## Costes

El fine-tuning de GPT-4o Mini cuesta $0.30 por millón de tokens de training. Un dataset de 1.000 ejemplos de 500 tokens cada uno = 500.000 tokens = $0.15 por época de entrenamiento.

La inferencia en el modelo fine-tuned cuesta $0.30/$1.20 por millón de tokens (entrada/salida), el doble que el modelo base.

---

*Fuentes: Documentación oficial de Fine-tuning de OpenAI, guías de mejores prácticas publicadas por el equipo de OpenAI.*
