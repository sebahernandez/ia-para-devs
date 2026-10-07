# Tasks

## 1. Redacción del contenido

- [x] 1.1 Escribir el `content_md` del post siguiendo la estructura de `design.md` (gancho → beneficios → tabla comparativa → casos de uso → seguridad → cierre con CTA); verificar que existe el borrador con todas esas secciones
- [x] 1.2 Incluir todas las cifras verificadas del spec (velocidad ~30%, costo −30%, precios $2/$10/$0.20, comparable a Opus 5.5, Terminal-Bench ≈70.6%, marca de agua y salvaguardas cyber); verificar cada dato contra las fuentes listadas en `design.md` y omitir cualquiera no confirmable
- [x] 1.3 Traducir cada capacidad técnica a un beneficio o caso de uso concreto para devs/creadores; verificar que ninguna mejora aparece sin su "por qué te importa"
- [x] 1.4 Añadir la tabla comparativa Sonnet 5 vs Sonnet 5.5 (con referencia a Opus 5.5); verificar que renderiza como tabla Markdown

## 2. Cumplimiento editorial

- [x] 2.1 Revisar el texto contra la capability `post-content` (español neutral, "tú", sin voseo/regionalismos, términos técnicos en inglés); verificar leyendo el borrador completo
- [x] 2.2 Redactar título atractivo, `description` para SEO/social y elegir tags (`Claude`, `Anthropic`, `Sonnet 5.5`, `LLM`); verificar que el título no suena a nota de prensa y la description resume el beneficio central

## 3. Publicación

- [x] 3.1 Definir `slug` (`claude-sonnet-5-5-casi-opus-mismo-precio`) y confirmar unicidad con `slugExists()`; verificar que devuelve `false`
- [x] 3.2 Crear el post con `createPost()` (o el panel admin) con `category_slug: modelos`, `pub_date: 2026-09-28`, `draft: false`; verificar que la fila existe y `content_html` se generó desde `content_md`
- [x] 3.3 Verificar en el sitio local (o preview) que el post aparece en la categoría `modelos`, se ve la tabla y las secciones, y no hay errores de render
- [x] 3.4 Disparar el rebuild según la capability `deployment` (`triggerRebuild` → Netlify); verificar que el post queda publicado en producción
