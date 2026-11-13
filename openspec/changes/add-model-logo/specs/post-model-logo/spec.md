## ADDED Requirements

### Requirement: Los posts de modelos muestran el logo del modelo del título

Todo post de la categoría `modelos` cuyo título nombre un modelo de IA reconocido SHALL mostrar el logo SVG de ese modelo. Un post de otra categoría, o uno cuyo título no nombre ningún modelo reconocido, SHALL NOT mostrar logo y se ve como antes.

#### Scenario: Post de modelos con un modelo en el título

- **WHEN** se muestra un post de la categoría `modelos` titulado "Claude Fable 5.2: qué trae de nuevo, cuánto cuesta y en qué planes está"
- **THEN** se ve el logo de Claude

#### Scenario: Post de otra categoría

- **WHEN** se muestra un post de la categoría `herramientas` cuyo título nombra a Claude
- **THEN** no se ve ningún logo

#### Scenario: Título sin modelo reconocido

- **WHEN** se muestra un post de la categoría `modelos` cuyo título no nombra ningún modelo del mapa de modelos
- **THEN** no se ve ningún logo y el post se muestra sin errores

### Requirement: El logo corresponde al modelo principal del título

El logo SHALL elegirse a partir del título del post, sin distinguir mayúsculas de minúsculas. Si el título nombra más de un modelo, SHALL usarse el que aparece primero. Los nombres de una misma familia (por ejemplo Fable, Opus, Sonnet, Haiku o Mythos para Claude) SHALL resolver al logo de esa familia.

#### Scenario: Varios modelos en el título

- **WHEN** el título es "Gemini 4 Argon frente a GPT-6 y Claude Opus 5.5"
- **THEN** se usa el logo de Gemini

#### Scenario: Modelo nombrado por su línea

- **WHEN** el título nombra "Sonnet 5.5" sin la palabra "Claude"
- **THEN** se usa el logo de Claude

### Requirement: Los logos salen de svgl.app y se sirven desde el sitio

Cada logo SHALL ser un SVG descargado de https://svgl.app/ y guardado en el repositorio. Si svgl no tiene el logo del modelo, el mapa MAY asociarlo al logo de la empresa que lo desarrolla, siempre que esa asociación se decida de forma explícita para ese modelo; si no se decide, el modelo queda sin logo. El sitio SHALL servirlo como archivo propio y SHALL NOT pedirlo a svgl.app cuando se carga una página. Cuando svgl ofrece variante clara y oscura, el sitio SHALL mostrar la variante que contrasta con el tema activo.

#### Scenario: Página cargada

- **WHEN** un lector abre una página que muestra un logo
- **THEN** el SVG se carga desde el dominio del blog, no desde svgl.app

#### Scenario: Cambio de tema

- **WHEN** el lector cambia entre tema claro y oscuro en un post cuyo logo tiene dos variantes
- **THEN** se ve la variante del logo que corresponde al tema activo

### Requirement: El logo va en la esquina superior sin tapar contenido

El logo SHALL mostrarse en la esquina superior derecha de la tarjeta del post en los listados y de la cabecera de la página del post. SHALL NOT superponerse al texto, la categoría, la fecha ni el título, en ningún ancho de pantalla. El logo SHALL ser decorativo: no recibe foco, no bloquea el clic de la tarjeta y los lectores de pantalla lo ignoran, porque el título ya nombra al modelo.

#### Scenario: Tarjeta en un listado

- **WHEN** la portada, `/blog`, una categoría o un tag muestran la tarjeta de un post con logo
- **THEN** el logo aparece en la esquina superior derecha de la tarjeta, sin tapar texto, y un clic sobre él abre el post igual que el resto de la tarjeta

#### Scenario: Página del post

- **WHEN** se abre la página de un post con logo
- **THEN** el logo aparece en la esquina superior derecha de la cabecera, sin tapar la categoría, la fecha ni el título

#### Scenario: Pantalla angosta

- **WHEN** se ve la tarjeta o la página en un ancho de 360 px
- **THEN** el logo sigue en la esquina y el texto no queda debajo de él

### Requirement: Agregar un modelo es agregar una entrada y su SVG

El conjunto de modelos reconocidos SHALL definirse en un único mapa que asocia nombres a un logo. Reconocer un modelo nuevo SHALL requerir solo agregar su entrada a ese mapa y su SVG, sin tocar componentes ni layouts.

#### Scenario: Modelo nuevo

- **WHEN** se agrega al mapa una entrada para un modelo nuevo con su SVG
- **THEN** los posts de `modelos` que lo nombran en el título muestran su logo tras el siguiente build, sin otros cambios de código
