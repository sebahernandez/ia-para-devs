# post-content Specification

## Purpose
Define los estándares editoriales que debe cumplir el contenido de los posts del blog para garantizar una voz consistente. Esta primera versión cubre el idioma.

## Requirements

### Requirement: Los posts deben escribirse en español neutral

Todo post del blog SHALL estar escrito en español neutral, entendible en toda Hispanoamérica y España, sin adoptar el acento, dialecto ni los regionalismos de un país en particular. La regla aplica al título, la descripción y el cuerpo (`content_md`) del post.

En la práctica, español neutral significa:
- Usar la segunda persona con "tú" (SHALL NOT usar voseo, p. ej. "vos tenés").
- Evitar modismos o jerga locales cuando exista una alternativa neutra equivalente.
- Preferir vocabulario comprensible en cualquier país hispanohablante.
- Los términos técnicos en inglés (p. ej. nombres de productos, APIs) se mantienen en inglés; la regla aplica a la prosa en español que los rodea.

#### Scenario: Post redactado en español neutral

- **WHEN** se redacta o genera un post nuevo
- **THEN** su título, descripción y cuerpo usan español neutral con "tú" y sin regionalismos de un país específico

#### Scenario: Post con regionalismos o voseo

- **WHEN** un post usa voseo, modismos locales o el acento de un país en particular (p. ej. "vos tenés que fijarte en el laburo")
- **THEN** no cumple el estándar y debe reescribirse en español neutral antes de publicarse

#### Scenario: Términos técnicos en inglés

- **WHEN** un post menciona nombres de productos, tecnologías o términos técnicos que no tienen traducción establecida (p. ej. "endpoint", "GPT-6")
- **THEN** esos términos se mantienen en inglés y la prosa que los rodea sigue en español neutral
