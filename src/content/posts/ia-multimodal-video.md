---
title: "IA multimodal y video: dónde está el estado del arte en 2026"
description: "El procesamiento de video por LLMs pasó de experimental a útil en casos específicos. Revisamos qué modelos pueden hacer con video, las limitaciones reales, y los casos de uso viables."
pubDate: 2026-04-09
tags: ["multimodal", "video", "gemini", "investigacion"]
category: investigacion
---

El procesamiento de imágenes por LLMs está maduro y en producción. El procesamiento de video es otro nivel: más datos, más complejidad temporal, más demanda de cómputo. En 2026, el estado del arte ha avanzado lo suficiente para que algunos casos de uso sean viables, aunque todavía hay limitaciones importantes.

## Quién puede procesar video actualmente

**Gemini 2.0/2.5**: la opción más completa. Puede procesar hasta 1 hora de video (dependiendo del plan), entiende contenido temporal, y puede responder preguntas que requieren razonamiento sobre secuencias de tiempo.

**GPT-4o**: procesa video a través de frames. No entiende el video como secuencia temporal nativa, sino como conjunto de imágenes. Para muchos casos funciona bien, para otros (donde el orden temporal importa) es insuficiente.

**Llama 4**: soporte de video en la familia Maverick y Behemoth. El soporte en la versión deployable localmente está todavía limitado.

## Qué pueden hacer bien

### Análisis de contenido de video

Dado un video de reunión, presentación, o tutorial, los modelos pueden:
- Transcribir lo que se dice (aunque para esto un modelo de ASR dedicado es más preciso)
- Resumir los temas cubiertos
- Responder preguntas sobre el contenido ("¿en qué minuto se habla de X?")
- Identificar momentos clave o cambios de tema

Para análisis de contenido empresarial (reuniones, webinars, cursos), esto es genuinamente útil.

### Comprensión de video técnico/demostraciones

Dado un video que muestra cómo hacer algo (tutorial de software, demostración de producto), los modelos pueden describir los pasos, identificar qué ocurre en pantalla, y responder sobre el procedimiento.

Para crear documentación a partir de demos en video, esto es muy útil.

### Detección de elementos visuales a lo largo del tiempo

Rastrear si un elemento (un objeto, una persona, un gráfico) aparece en diferentes momentos del video. Gemini 2.5 hace esto bien; otros modelos varían.

## Lo que todavía no funciona bien

### Razonamiento temporal preciso

"¿Cuánto tarda en pasar X a Y en el video?" es una pregunta que requiere razonamiento temporal preciso. Los modelos actuales tienen dificultades aquí: suelen ser imprecisos en la localización temporal.

### Video de alta resolución a largo plazo

Para analizar horas de video en alta calidad (seguridad, producción industrial), los costes y las ventanas de contexto actuales son limitantes.

### Comprensión de movimiento sutil

Detectar expresiones faciales sutiles, lenguaje corporal, o cambios imperceptibles en secuencias de frames: los modelos actuales no son confiables aquí.

### Generación de video

Sora, Runway, Kling: los modelos de generación de video existen pero son herramientas separadas, no integradas con los LLMs de texto. La integración está en progreso.

## Casos de uso viables hoy

**Procesamiento de reuniones**: transcribir, resumir y extraer action items de grabaciones de reuniones. Con Gemini 2.5, esto funciona bien y puede automatizarse.

**Análisis de contenido de e-learning**: extraer estructura, preguntas frecuentes, y resúmenes de cursos en video.

**QA de contenido**: verificar que un video de producto muestra correctamente las características descritas. Útil para equipos de contenido.

**Moderación de contenido**: identificar contenido problemático en escala. Los modelos multimodales pueden ser parte del pipeline, aunque no el único filtro.

## Implementación con Gemini

```python
import google.generativeai as genai
import time

genai.configure(api_key="TU_API_KEY")

def analyze_video(video_path: str, question: str) -> str:
    model = genai.GenerativeModel("gemini-2.5-pro")
    
    # Subir el video
    print("Subiendo video...")
    video_file = genai.upload_file(path=video_path)
    
    # Esperar a que esté procesado
    while video_file.state.name == "PROCESSING":
        time.sleep(2)
        video_file = genai.get_file(video_file.name)
    
    if video_file.state.name != "ACTIVE":
        raise ValueError(f"Error procesando video: {video_file.state.name}")
    
    # Hacer la pregunta
    response = model.generate_content([video_file, question])
    
    # Limpiar
    genai.delete_file(video_file.name)
    
    return response.text

# Uso
respuesta = analyze_video(
    "reunion.mp4",
    "Resume los puntos principales discutidos y lista los action items mencionados"
)
print(respuesta)
```

## El futuro cercano

La tendencia es hacia modelos que entiendan video de forma más nativa (no como frames) y que puedan procesar streams en tiempo real. Los modelos de Gemini 2.0 ya tienen capacidades de streaming de audio. El video en tiempo real es el siguiente paso obvio.

Para finales de 2026, espero que el análisis de video en tiempo real sea accesible vía API para casos de uso específicos.

---

*Estado del arte a abril 2026. El área evoluciona rápidamente.*
