## ADDED Requirements

### Requirement: robots.txt apunta al sitemap del dominio de producción

`robots.txt` SHALL permitir el rastreo del sitio y SHALL declarar como sitemap la URL `sitemap-index.xml` del dominio configurado en `site` de Astro. SHALL NOT nombrar otro dominio.

#### Scenario: Buscador lee robots.txt

- **WHEN** un buscador pide `https://iaparadevs.com/robots.txt`
- **THEN** recibe `Sitemap: https://iaparadevs.com/sitemap-index.xml` y esa URL responde 200

### Requirement: Toda página tiene una imagen Open Graph que existe

Toda URL declarada en `og:image` y `twitter:image` SHALL responder 200 con un tipo de imagen. La imagen por defecto SHALL medir 1200×630 px.

#### Scenario: Post compartido en una red social

- **WHEN** se comparte la URL de un post
- **THEN** la imagen de `og:image` existe y se muestra en la vista previa

### Requirement: Los posts y la portada tienen datos estructurados

Cada página de post SHALL incluir un bloque JSON-LD `BlogPosting` con `headline`, `description`, `datePublished`, `author`, `publisher`, `image`, `url` y `inLanguage: "es"`. La portada SHALL incluir un bloque JSON-LD `WebSite` con `name`, `url` e `inLanguage: "es"`. Los valores SHALL coincidir con los del `title`, la `description`, el canonical y la fecha visibles en la página.

#### Scenario: Página de post

- **WHEN** se abre la página de un post
- **THEN** el HTML contiene un JSON-LD `BlogPosting` válido con el título, la fecha y el canonical del post

#### Scenario: Portada

- **WHEN** se abre la portada
- **THEN** el HTML contiene un JSON-LD `WebSite` con la URL del sitio

### Requirement: Las páginas de tag no se indexan

Las páginas `/tags/<tag>/` SHALL llevar `<meta name="robots" content="noindex, follow">` y SHALL NOT aparecer en el sitemap. Los posts, las categorías, `/blog/`, `/about/` y la portada SHALL seguir indexables y en el sitemap.

#### Scenario: Página de tag

- **WHEN** un buscador rastrea `/tags/llm/`
- **THEN** la página tiene `noindex, follow`, el buscador sigue sus enlaces a los posts y la URL no está en el sitemap

#### Scenario: Página de post

- **WHEN** se genera el sitemap
- **THEN** incluye todos los posts y categorías y ninguna URL de `/tags/`
