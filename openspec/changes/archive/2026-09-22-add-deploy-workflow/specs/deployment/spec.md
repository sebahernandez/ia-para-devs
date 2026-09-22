# Spec Delta

## Purpose

Define el proceso por el cual un cambio aprobado llega a producción: commit y push a GitHub, seguido del rebuild/deploy en Netlify, con el orden y las precondiciones necesarias.

## ADDED Requirements

### Requirement: Un cambio solo se despliega cuando está aprobado

El proceso de release SHALL ejecutarse únicamente cuando el cambio está aprobado. Un cambio se considera aprobado cuando sus tareas están completas Y el usuario dio su visto bueno explícito para desplegar.

#### Scenario: Cambio aprobado

- **WHEN** las tareas del cambio están completas y el usuario aprueba explícitamente el deploy
- **THEN** se ejecuta el proceso de release (GitHub y luego rebuild/deploy)

#### Scenario: Cambio sin aprobar

- **WHEN** el usuario no ha dado el visto bueno, o quedan tareas incompletas
- **THEN** no se hace commit, push ni rebuild, y se espera la aprobación

### Requirement: Orden del proceso de release

El proceso de release SHALL ejecutar primero la publicación en GitHub y después el rebuild/deploy. El rebuild de Netlify SHALL dispararse solo después de que el push haya llegado al remoto, de modo que el build use el commit ya publicado y no uno anterior.

#### Scenario: Cambio de código

- **WHEN** un cambio de código está aprobado
- **THEN** se hace commit y `git push` al remoto, y solo después se dispara el rebuild de Netlify (`NETLIFY_BUILD_HOOK_URL`)

#### Scenario: Rebuild disparado antes del push

- **WHEN** se dispara el rebuild antes de que el commit esté en el remoto
- **THEN** el proceso no cumple el estándar, porque Netlify construiría un commit anterior; el rebuild debe repetirse una vez completado el push

### Requirement: Publicación de contenido guardado solo en la base de datos

Cuando un cambio aprobado modifica contenido que vive solo en la base de datos (por ejemplo, posts en Neon) y no genera cambios de código, el proceso SHALL disparar el rebuild/deploy de todos modos, ya que el sitio se genera de forma estática y no se actualiza sin un nuevo build.

#### Scenario: Cambio solo de contenido en la base de datos

- **WHEN** un cambio aprobado edita o crea contenido en Neon sin modificar archivos del repositorio
- **THEN** no se requiere commit, pero SÍ se dispara el rebuild/deploy de Netlify para publicar el contenido

### Requirement: Verificación del deploy

Tras disparar el rebuild/deploy, el proceso SHALL confirmar que la publicación fue exitosa antes de darla por terminada.

#### Scenario: Deploy confirmado

- **WHEN** se dispara el rebuild
- **THEN** se verifica que la petición al build hook respondió correctamente (HTTP 2xx) y, cuando aplique, que el contenido esperado está accesible en el sitio publicado
