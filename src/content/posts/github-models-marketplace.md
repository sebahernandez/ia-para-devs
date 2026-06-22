---
title: "GitHub Models: probar LLMs directamente desde tu repositorio"
description: "GitHub integró un marketplace de modelos donde puedes experimentar con GPT-4o, Llama 3 y otros directamente desde github.com, con créditos gratuitos para desarrollo y una API unificada."
pubDate: 2025-03-25
tags: ["github", "modelos", "api", "developer-tools"]
category: herramientas
---

GitHub Models llegó en beta en agosto de 2024 y apunta a algo específico: que los desarrolladores puedan experimentar con modelos de IA sin abrir otra cuenta, sin poner tarjeta de crédito, desde la plataforma donde ya tienen su código.

## Qué incluye el marketplace

GitHub Models ofrece acceso a un catálogo de modelos que incluye:

- **OpenAI**: GPT-4o, GPT-4o Mini, o1-preview, o1-mini
- **Meta**: Llama 3.1 (8B, 70B, 405B)
- **Microsoft**: Phi-3 Mini, Small, Medium
- **Mistral**: Mistral Large 2, Mistral Small
- **Cohere**: Command R, Command R+

La lista se actualiza con nuevos modelos regularmente.

## Cómo funciona el acceso

Desde github.com, navegas a la sección Models, eliges un modelo y puedes:

1. **Probar en el playground**: interfaz de chat directamente en el navegador
2. **Ver parámetros**: temperatura, top-p, longitud máxima
3. **Obtener código de ejemplo**: el playground genera el snippet para Python, JavaScript o cURL

Para usar los modelos en código, obtienes un token de GitHub (el mismo que ya tienes para la API de GitHub) y lo usas con un endpoint compatible con OpenAI.

## Ejemplo de código

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.environ["GITHUB_TOKEN"],
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hola"}],
)
```

No, no es broma: el endpoint de GitHub Models es de Azure (Microsoft es el proveedor de infraestructura de GitHub). El token de GitHub funciona porque GitHub valida el acceso antes de enviarlo a Azure AI.

## Límites del plan gratuito

Los créditos gratuitos son suficientes para desarrollo y pruebas, pero no para producción. Los límites exactos varían por modelo:

- GPT-4o: ~15 solicitudes por minuto, 1 millón de tokens al día
- Modelos más pequeños tienen límites más generosos

Para producción, hay que ir directamente a OpenAI, Azure OpenAI o los proveedores respectivos.

## El valor real

GitHub Models no reemplaza una cuenta en OpenAI ni en Anthropic. Su valor está en la reducción de fricción para empezar: un desarrollador que ya tiene GitHub puede probar 10 modelos diferentes en 30 minutos sin registrarse en nada nuevo.

Para equipos que evalúan qué modelo usar en un proyecto nuevo, es una forma rápida de hacer esa comparación.

---

*Fuentes: GitHub Blog, documentación oficial de GitHub Models, changelog de la beta.*
