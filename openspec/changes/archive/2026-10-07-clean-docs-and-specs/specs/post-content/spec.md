# Spec Delta

## ADDED Requirements

### Requirement: Los datos de un post se verifican contra sus fuentes

Todo dato fáctico de un post (fechas, precios, cifras, benchmarks, disponibilidad) SHALL coincidir con una fuente consultada al redactarlo. Un dato que no pueda confirmarse SHALL omitirse o declararse como no conocido; SHALL NOT aproximarse ni inventarse.

#### Scenario: Dato confirmado

- **WHEN** el post afirma una fecha, un precio o una cifra
- **THEN** ese dato coincide con la fuente consultada para el post

#### Scenario: Dato no publicado o no confirmable

- **WHEN** un dato relevante no ha sido publicado o no puede confirmarse en las fuentes
- **THEN** el post lo omite o dice que aún no se conoce

#### Scenario: Cifras reportadas por el fabricante

- **WHEN** el post muestra benchmarks o cifras publicadas por la propia empresa que lanza el producto
- **THEN** el post atribuye esas cifras a esa empresa en lugar de presentarlas como mediciones independientes

### Requirement: Los videos de terceros llevan crédito y nota de autorización

Cuando un post incrusta un video de otra persona, SHALL mostrar justo debajo una nota en texto más pequeño que el cuerpo con el nombre de su creador, un enlace a su canal y la indicación de que se comparte con su autorización.

#### Scenario: Video incrustado con crédito

- **WHEN** se abre un post que incrusta un video de un tercero
- **THEN** debajo del video aparece la nota con el nombre del creador, el enlace a su canal y la mención de autorización

#### Scenario: Video sin autorización

- **WHEN** no se cuenta con la autorización del creador
- **THEN** el video no se incrusta en el post

### Requirement: Todo post lleva sus metadatos completos

Todo post SHALL tener título, descripción para SEO y redes, fecha de publicación, una categoría existente del blog y al menos un tag.

#### Scenario: Metadatos completos

- **WHEN** se prepara un post para publicar
- **THEN** tiene título, descripción, fecha de publicación, una categoría existente y al menos un tag

#### Scenario: Categoría que no existe

- **WHEN** el post indica una categoría que el blog no tiene
- **THEN** no cumple el estándar y debe corregirse antes de publicarse
