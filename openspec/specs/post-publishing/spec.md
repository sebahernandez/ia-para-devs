# post-publishing Specification

## Purpose
Define cómo un post pasa de archivo fuente a estar publicado en el blog: dónde vive el contenido, qué garantiza el comando de publicación y qué ve el lector en el sitio una vez publicado.

## Requirements

### Requirement: La base de datos es la fuente de verdad de los posts

El sitio público SHALL mostrar únicamente los posts guardados en la base de datos. Un archivo fuente en el repositorio SHALL NOT aparecer en el sitio hasta que se publique en la base de datos.

#### Scenario: Archivo fuente sin publicar

- **WHEN** existe `src/content/posts/<slug>.md` pero ese slug no está en la base de datos
- **THEN** el post no aparece en el sitio, aunque se haga un rebuild

#### Scenario: Post publicado

- **WHEN** el post está en la base de datos y se completa un rebuild
- **THEN** el post aparece en el sitio con su contenido Markdown renderizado

### Requirement: Un post se publica desde su archivo fuente por slug

El comando de publicación SHALL recibir un slug, leer `src/content/posts/<slug>.md` y crear el post con los metadatos de su frontmatter (título, descripción, fecha, autor, categoría, tags, borrador y destacado) y el cuerpo Markdown del archivo.

#### Scenario: Publicación correcta

- **WHEN** se ejecuta el comando con el slug de un archivo fuente válido que aún no está publicado
- **THEN** se crea un post con ese slug y los metadatos y el cuerpo del archivo

#### Scenario: Comando sin slug

- **WHEN** se ejecuta el comando sin indicar un slug
- **THEN** el comando muestra su forma de uso y termina con error sin crear nada

#### Scenario: Frontmatter incompleto o categoría inexistente

- **WHEN** al archivo fuente le falta un metadato obligatorio o su categoría no existe en el blog
- **THEN** la publicación falla y no se crea el post

### Requirement: La publicación es idempotente por slug

El comando de publicación SHALL NOT crear ni modificar un post cuyo slug ya existe en la base de datos.

#### Scenario: Slug ya publicado

- **WHEN** se ejecuta el comando con un slug que ya existe
- **THEN** el comando termina con error, el post existente no cambia y no se dispara un rebuild

### Requirement: Solo hay un post destacado a la vez

Al guardar un post como destacado, el sistema SHALL quitar el destacado a cualquier otro post en la misma operación.

#### Scenario: Nuevo destacado

- **WHEN** se publica o edita un post como destacado y ya había otro destacado
- **THEN** solo el post recién guardado queda destacado

### Requirement: Los borradores no se muestran en el sitio público

El sitio público SHALL excluir de sus listados y páginas los posts marcados como borrador.

#### Scenario: Post en borrador

- **WHEN** un post está guardado como borrador y se completa un rebuild
- **THEN** el post no aparece en la portada, el blog, las categorías ni los tags

### Requirement: Publicar un post dispara el rebuild

Tras crear el post, el comando de publicación SHALL disparar el rebuild del sitio. Como publicar despliega contenido, ejecutar el comando requiere la aprobación que exige `deployment`.

#### Scenario: Rebuild disparado

- **WHEN** el post se crea correctamente y el build hook está configurado
- **THEN** se dispara el rebuild del sitio

#### Scenario: Build hook no configurado o caído

- **WHEN** el post se crea pero el build hook no está configurado o no responde
- **THEN** el post queda guardado en la base de datos y el rebuild debe dispararse a mano según `deployment`
