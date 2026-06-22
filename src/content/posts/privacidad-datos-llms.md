---
title: "Qué le pasa a tu código cuando se lo envías a ChatGPT o Claude"
description: "Las políticas de uso de datos de OpenAI, Anthropic y Google son distintas entre sí y no siempre fáciles de entender. Resumen de lo que saben y lo que hacen con los datos que envías a sus APIs."
pubDate: 2025-10-25
tags: ["privacidad", "datos", "compliance", "seguridad"]
category: opinión
---

Cuando un desarrollador pega un fragmento de código en ChatGPT para pedir ayuda, está enviando ese código a los servidores de OpenAI. La pregunta que muchos no se hacen: ¿qué hace OpenAI con eso?

La respuesta varía según el producto que uses y la configuración de tu cuenta.

## OpenAI: el caso más común

**ChatGPT gratuito y Plus sin opt-out**: Los datos pueden usarse para mejorar los modelos, lo que en la práctica significa que podrían usarse en futuros entrenamientos. OpenAI permite desactivar esto en la configuración, pero está activado por defecto.

**API de OpenAI**: Los datos enviados a la API no se usan para entrenar modelos por defecto, según la política de datos de OpenAI. Los datos pueden retenerse hasta 30 días con fines de moderación y seguridad. Con un Data Processing Agreement (DPA), puedes reducir esto a cero.

**ChatGPT Enterprise**: Datos no se usan para entrenamiento, procesamiento en entornos aislados, DPA incluido.

## Anthropic

La política de Anthropic para la API establece que los datos no se usan para entrenar modelos, salvo que el cliente lo habilite explícitamente. La retención de datos se limita a 30 días para el modelo estándar, configurable.

Claude.ai (el producto de consumo) tiene políticas distintas: puede usar datos para mejoras del producto con el consentimiento del usuario.

## Google (Gemini API)

En Vertex AI (la oferta empresarial), los datos no se usan para entrenar modelos. En Google AI Studio (la oferta gratuita para desarrolladores), la política es más flexible.

## La pregunta que deberías hacerte antes de cada llamada

¿El código, texto o datos que estoy enviando contienen:

- **Credenciales o claves de API?** No deberían estar ahí de todas formas, pero revisa dos veces.
- **PII (información personal identificable)?** Nombres, emails, DNIs. Esto puede tener implicaciones de GDPR/CCPA.
- **Código propietario confidencial?** Dependiendo de tu contrato de trabajo, puede ser un problema enviarlo a APIs externas.
- **Datos de clientes?** Las implicaciones legales dependen del sector y la jurisdicción.

## La alternativa práctica

Para los casos donde los datos no pueden salir de tu infraestructura: modelos open-source ejecutados en servidores propios (Ollama, vLLM, TGI de Hugging Face). La calidad puede ser menor para casos complejos, pero la privacidad es total.

La decisión arquitectónica sobre qué datos puedes enviar a APIs externas debería tomarse antes de construir el sistema, no después de un incidente.

---

*Basado en las políticas de uso publicadas por OpenAI, Anthropic y Google. Las políticas cambian: verifica siempre la versión actual antes de tomar decisiones de compliance.*
