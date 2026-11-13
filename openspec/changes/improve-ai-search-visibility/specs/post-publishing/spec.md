## ADDED Requirements

### Requirement: Un post existente se actualiza desde su archivo fuente por slug

El comando `scripts/update-post.ts <slug>` SHALL reemplazar el título, la descripción, el contenido, la categoría y los tags del post con ese slug por los de `src/content/posts/<slug>.md`, y SHALL fijar `updatedDate` en la fecha del día. SHALL conservar el slug, `pubDate`, el autor y el estado de destacado. SHALL validar el archivo con las mismas reglas que la publicación, incluido el autor. Al terminar SHALL disparar el rebuild.

#### Scenario: Slug existente

- **WHEN** se ejecuta el comando con un slug que existe en la base de datos y un archivo fuente válido
- **THEN** el post queda con el contenido del archivo, `updatedDate` de hoy, el mismo `pubDate` y la misma URL, y se dispara el rebuild

#### Scenario: Slug inexistente

- **WHEN** se ejecuta el comando con un slug que no existe en la base de datos
- **THEN** el comando termina con error, no crea ningún post y no dispara el rebuild

#### Scenario: Archivo inválido

- **WHEN** al archivo fuente le falta un metadato obligatorio, su categoría no existe o el autor no es el permitido
- **THEN** el comando termina con error y el post no cambia
