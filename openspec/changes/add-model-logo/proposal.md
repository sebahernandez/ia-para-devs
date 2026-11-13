# Proposal

## Why

Los posts de la categoría `modelos` hablan casi siempre de un modelo concreto (Claude Fable 5.2, Gemini 4 Argon, Claude Sonnet 5.5), pero nada en la tarjeta ni en la página del post lo identifica a simple vista. Un logo del modelo en una esquina permite reconocer de qué IA trata cada artículo sin leer el título, y hace que los listados se vean más ordenados. Tiene que ser una regla del sistema, no algo que se agregue a mano en cada post.

## What Changes

- Todo post de la categoría `modelos` cuyo título nombre un modelo conocido muestra el logo SVG de ese modelo en la esquina superior derecha, sin tapar contenido, en dos lugares: la tarjeta de los listados (portada, `/blog`, categorías y tags) y la cabecera de la página del post.
- El modelo se deduce del título: si el título nombra varios modelos, gana el que aparece primero. No hace falta un campo nuevo ni cambiar la base de datos.
- Los logos se descargan una vez desde https://svgl.app/ y se guardan en el repositorio (`public/logos/`). El sitio no pide nada a svgl.app en tiempo de ejecución.
- Si el logo tiene variante clara y oscura en svgl, se muestra la que corresponde al tema activo del sitio.
- Un post sin modelo reconocible en el título, o de otra categoría, se ve igual que hoy.
- Agregar un modelo nuevo es agregar una entrada al mapa de modelos y su SVG.
- Los tres posts publicados quedan cubiertos: Sonnet 5.5 y Fable 5.2 con el logo de Claude, y Gemini 4 Argon con el de Gemini.

Fuera de alcance: logos en posts de otras categorías, elegir el logo a mano desde el admin y logos en el RSS o en imágenes Open Graph.

## Capabilities

### New Capabilities

- `post-model-logo`: qué posts muestran el logo de un modelo de IA, cómo se elige ese logo, de dónde salen los SVG y dónde y cómo se muestra.

### Modified Capabilities

Ninguna. `post-content` y `post-publishing` no cambian.

## Impact

- **Código**: un módulo nuevo `src/features/posts/model-logo.ts` (mapa de modelos y función que elige el logo), `src/components/PostCard.astro` y `src/layouts/PostLayout.astro` (renderizan el logo), `tests/features.test.ts` (pruebas de la elección).
- **Recursos**: SVG nuevos en `public/logos/`, descargados de svgl.app.
- **Sin cambios** de esquema, base de datos, admin ni scripts de publicación.
- **Sitio**: se ve después del siguiente deploy (ver `deployment`).
- **Marcas**: los logos pertenecen a sus empresas; se usan solo para identificar el modelo del que habla el artículo.
