---
title: "Vibe coding: cuando dejar de entender el código que escribes empieza a ser un problema"
description: "El término 'vibe coding' describe desarrollar aceptando código de IA sin entenderlo completamente. Hay casos donde es una herramienta válida. Hay muchos más donde es una trampa."
pubDate: 2025-09-05
author: "Equipo Blog IA"
tags: ["opinión", "vibe-coding", "calidad", "deuda-técnica"]
category: opinión
---

Andrej Karpathy acuñó el término "vibe coding" a principios de 2025 para describir una forma de desarrollo donde dejas de luchar con los detalles del código y simplemente dejas que el modelo haga lo que parece correcto, ajustando cuando las cosas no funcionan. "Surrender to the vibes", dijo.

El concepto resonó porque describe algo que muchos developers hacen ya. Y aquí está el problema.

## Cuándo el vibe coding tiene sentido

Hay contextos donde aceptar código sin entenderlo completamente es una decisión razonable:

**Prototipado desechable**: Si estás construyendo algo que vas a tirar, la calidad del código no importa mucho. Un prototipo para validar una idea puede construirse rápido con IA aunque el código resultante sea difícil de mantener.

**Configuración de herramientas que no tocas más**: Un script de CI/CD, una configuración de webpack, un Dockerfile. Si funciona y no necesitas modificarlo, el nivel de comprensión no tiene que ser total.

**Dominio completamente nuevo para una tarea puntual**: Si necesitas generar un PDF en Python y nunca has tocado la librería, aceptar el ejemplo del modelo y verificar que hace lo que necesitas es eficiente.

## Donde el vibe coding se convierte en deuda

El problema aparece cuando el vibe coding se aplica al código que importa: el que va a producción, el que tiene que mantenerse, el que maneja datos sensibles, el que otros desarrolladores van a modificar.

**Bugs de seguridad ocultos**: Los LLMs generan código con vulnerabilidades. SQL injection, XSS, manejo incorrecto de autenticación. Si no entiendes el código, no detectas las vulnerabilidades.

**Deuda técnica que no ves**: El código generado por IA a menudo es funcional pero estructuralmente incorrecto para el contexto específico: usa patrones inadecuados, duplica lógica que ya existe, ignora abstracciones establecidas en el codebase.

**Bugs que no puedes debuggear**: Cuando algo falla en producción, necesitas entender el código. Si lo aceptaste sin entenderlo, el debugging se convierte en pedir más vibe al modelo, que puede introducir nuevos problemas.

## La pregunta que importa

Antes de aceptar código generado por IA, la pregunta a hacerse es: "¿Podría yo explicar qué hace este código y por qué toma estas decisiones específicas?"

Si la respuesta es no, hay dos opciones: dedicar el tiempo a entenderlo antes de integrarlo, o no usarlo. El camino de en medio —incluirlo sin entenderlo porque "parece funcionar"— es el que genera los problemas.

La IA es una herramienta de amplificación. Amplifica la productividad del desarrollador que entiende lo que hace. También amplifica el daño del que no.

---

*Opinión editorial. La referencia al término "vibe coding" es de Andrej Karpathy (Twitter/X, febrero 2025).*
