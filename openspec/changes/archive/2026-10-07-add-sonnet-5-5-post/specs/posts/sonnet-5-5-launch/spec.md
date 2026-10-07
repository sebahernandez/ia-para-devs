# Spec Delta

## Purpose

Define el contenido obligatorio y el listón de calidad del post de blog sobre el lanzamiento de Claude Sonnet 5.5, para que sea exacto, centrado en beneficios y publicable sin retrabajo.

## ADDED Requirements

### Requirement: El post cubre el lanzamiento de Sonnet 5.5 con datos exactos

El post SHALL presentar el lanzamiento de Claude Sonnet 5.5 (28 de septiembre de 2026) e incluir, sin inventar ni exagerar, al menos estos hechos verificados contra las fuentes citadas en `design.md`:

- Salida ~30% más rápida que Sonnet 5 y hasta ~30% menos costo por tarea (por usar menos tokens para el mismo trabajo).
- Mismo precio por token que Sonnet 5: $2 por millón de tokens de entrada, $10 por millón de salida, $0.20 por millón de lectura de caché.
- Rinde de forma comparable a Opus 5.5 en varias evaluaciones cuando corre a máximo esfuerzo, sin ser un salto de frontera.
- Al menos un benchmark concreto (p. ej. Terminal-Bench 4.0 ≈ 70.6%).
- Es el primer Sonnet que llega con salvaguardas de ciberseguridad de nivel superior y con marca de agua invisible en el texto.

Cualquier cifra que no pueda confirmarse contra las fuentes SHALL omitirse en lugar de aproximarse.

#### Scenario: Cifras presentes y correctas

- **WHEN** se revisa el cuerpo del post publicado
- **THEN** contiene las cifras de velocidad, costo y precio anteriores y coinciden con las fuentes citadas en `design.md`

#### Scenario: Dato no verificable

- **WHEN** un dato sobre Sonnet 5.5 no puede confirmarse en las fuentes citadas
- **THEN** el post lo omite en vez de afirmarlo

### Requirement: El post está centrado en los beneficios para el lector

El post SHALL priorizar qué gana quien usa Sonnet 5.5 (ahorro de costo, respuestas más rápidas, mejor coding y trabajo de conocimiento, escritura más clara, mejor diseño de UI y slides, seguridad) por encima de la narrativa corporativa. Cada capacidad técnica mencionada SHALL traducirse a un beneficio práctico o caso de uso concreto para desarrolladores o creadores de contenido.

#### Scenario: Capacidad traducida a beneficio

- **WHEN** el post menciona una mejora técnica (p. ej. "30% más rápido")
- **THEN** la acompaña de por qué le importa al lector (p. ej. "agentes que iteran más barato y responden antes")

### Requirement: El post es atractivo, original y escaneable

El post SHALL tener un título llamativo (no una nota de prensa genérica), una entrada que enganche en las primeras líneas, subtítulos que permitan escanear, y al menos un elemento de apoyo como una tabla comparativa (Sonnet 5 vs Sonnet 5.5, o vs Opus 5.5) o una lista de casos de uso. SHALL cerrar con una conclusión y una llamada a la acción (probar el modelo / comentar).

#### Scenario: Estructura escaneable con comparativa

- **WHEN** se revisa el post
- **THEN** tiene título atractivo, subtítulos, al menos una tabla o lista comparativa, y un cierre con llamada a la acción

### Requirement: El post cumple los estándares editoriales y de publicación del blog

El post SHALL escribirse en español neutral conforme a la capability `post-content`, publicarse en la categoría `modelos`, llevar un `slug` único, `description` para SEO y social, y `pub_date` del 28 de septiembre de 2026. Los nombres de productos y términos técnicos (Sonnet 5.5, Opus 5.5, Terminal-Bench, API) SHALL mantenerse en inglés.

#### Scenario: Metadatos y categoría correctos

- **WHEN** se crea el post
- **THEN** su `category_slug` es `modelos`, tiene `slug` único, `description` y `pub_date` = 2026-09-28, y respeta el español neutral de `post-content`
