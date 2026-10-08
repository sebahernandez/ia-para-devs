# Spec Delta

## ADDED Requirements

### Requirement: Todo post se publica con el autor slagosdev

Todo post SHALL guardarse con el autor `slagosdev`. El sistema SHALL NOT crear ni modificar un post con un autor distinto, sea por el comando de publicación o por el panel admin. Cuando no se indica autor, el sistema SHALL usar `slagosdev`. Esta regla rige mientras el blog no tenga multiusuario ni colaboradores; integrar esa capacidad exige reemplazar este requisito.

#### Scenario: Archivo fuente sin autor

- **WHEN** se publica por slug un archivo fuente cuyo frontmatter no indica `author`
- **THEN** el post se crea con el autor `slagosdev`

#### Scenario: Archivo fuente con otro autor

- **WHEN** se publica por slug un archivo fuente cuyo frontmatter indica un `author` distinto de `slagosdev`
- **THEN** el comando termina con error, no se crea el post y no se dispara un rebuild

#### Scenario: Post creado o editado desde el panel admin

- **WHEN** se crea o edita un post desde el formulario del panel admin
- **THEN** el formulario no permite cambiar el autor y el post queda guardado con el autor `slagosdev`

#### Scenario: Petición al admin con otro autor

- **WHEN** la API del admin recibe una petición para crear o editar un post con un autor distinto de `slagosdev`
- **THEN** la petición se rechaza con un error de validación y el post no se crea ni se modifica

#### Scenario: Firma visible en el sitio

- **WHEN** se abre un post publicado, su tarjeta en un listado o su entrada en el RSS
- **THEN** el autor que se muestra es `slagosdev`
