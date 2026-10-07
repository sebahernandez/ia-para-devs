# Spec Delta

## Purpose

Define el contenido obligatorio y el listón de calidad del post sobre el lanzamiento de Gemini 4 Argon, para que sea exacto, honesto sobre quién puede usarlo hoy y publicable como destacado sin retrabajo.

## ADDED Requirements

### Requirement: El post presenta el lanzamiento con datos verificados

El post SHALL presentar el lanzamiento de Gemini 4 Argon (30 de septiembre de 2026) usando solo datos confirmados en las fuentes citadas en `design.md`. Cualquier dato no confirmable SHALL omitirse en lugar de aproximarse.

#### Scenario: Datos coinciden con las fuentes

- **WHEN** se revisa el cuerpo del post
- **THEN** la fecha, los precios y el límite de salida coinciden con las fuentes citadas en `design.md`

#### Scenario: Dato no publicado por Google

- **WHEN** un dato no ha sido publicado (p. ej. ventana de contexto, ID del modelo en la API, fecha de apertura general)
- **THEN** el post dice que aún no se conoce en vez de inventarlo

### Requirement: El post explica la disponibilidad y los planes sin exagerar

El post SHALL indicar quién puede usar Argon hoy (defensores de ciberseguridad verificados vía Fairwind Program), quién sigue según Google (clientes de API de pago y suscriptores de Google AI Ultra, luego desarrolladores, empresas y consumidores) y que no hay fecha pública. SHALL NOT afirmar que está disponible en un plan donde no lo está.

#### Scenario: Lector con plan gratuito o AI Pro

- **WHEN** un lector busca si Argon está en su plan
- **THEN** el post le deja claro que hoy no lo está y cuál es el orden de despliegue anunciado

#### Scenario: Precios

- **WHEN** el post menciona precios
- **THEN** distingue el precio introductorio ($2 / $10 por millón de tokens de entrada / salida) del precio posterior ($4 / $20) y aclara que la duración del periodo introductorio no está definida

### Requirement: El post explica cómo usar Argon

El post SHALL incluir una sección práctica de cómo usarlo: las vías de acceso anunciadas, qué puede hacer el lector hoy para prepararse y para qué tipo de tareas conviene según los resultados publicados.

#### Scenario: Sección práctica presente

- **WHEN** se revisa el post
- **THEN** contiene una sección de uso con pasos o recomendaciones accionables y sin instrucciones que dependan de datos no publicados

### Requirement: El post muestra los benchmarks con contexto

El post SHALL incluir una tabla de benchmarks de Argon frente a GPT-6 Astra y Claude Opus 5.5, aclarar que son cifras reportadas por Google y mostrar también al menos un benchmark donde Argon no lidera.

#### Scenario: Tabla equilibrada

- **WHEN** se revisa la tabla de benchmarks
- **THEN** renderiza como tabla, atribuye las cifras a Google e incluye al menos una fila donde gana un competidor

### Requirement: El post incrusta el video de Vitoria Ferreira con nota de autorización

El post SHALL incrustar el video `https://www.youtube.com/watch?v=MHr2L3N27Vw` y, justo debajo, una nota en texto pequeño que nombre a Vitoria Ferreira, enlace a su canal e indique que el video se comparte con su autorización.

#### Scenario: Video y crédito visibles

- **WHEN** se abre el post publicado
- **THEN** el video se reproduce incrustado y debajo aparece la nota de autorización en un tamaño de texto menor que el del cuerpo

### Requirement: El post se publica como destacado y cumple los estándares del blog

El post SHALL publicarse con `featured` en verdadero y `draft` en falso, en la categoría `modelos`, con `slug` único y `description`, en español neutral conforme a `post-content`. Los nombres de productos y benchmarks SHALL mantenerse en inglés.

#### Scenario: Post destacado en la portada

- **WHEN** termina el rebuild
- **THEN** el post aparece como el destacado del sitio y dentro de la categoría `modelos`

#### Scenario: Un solo destacado

- **WHEN** existía otro post destacado antes de publicar
- **THEN** ese post deja de estar destacado y solo queda el de Gemini 4 Argon
