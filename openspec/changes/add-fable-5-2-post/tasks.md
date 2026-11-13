# Tasks

## 1. Verificación de datos

- [x] 1.1 Volver a consultar las fuentes de `design.md` (página de Fable y los dos artículos del centro de ayuda); verificar que precios, tabla de planes y oferta de lanzamiento siguen vigentes, o actualizar `design.md`

## 2. Redacción del post

- [x] 2.1 Crear `src/content/posts/claude-fable-5-2-novedades-planes-precio.md` con el frontmatter de `design.md` (`author: slagosdev`, `category: modelos`, `featured: true`, `draft: false`); verificar que `gray-matter` lo parsea con todos los campos
- [x] 2.2 Escribir el cuerpo con la estructura de `design.md` (gancho → resumen → qué es → novedades → benchmarks → precio → planes → oferta → desarrolladores → letra chica → cierre); verificar que están todas las secciones
- [x] 2.3 Añadir la tabla de planes, la tabla de benchmarks atribuida a Anthropic (con la nota de niveles de esfuerzo) y la comparación de precio con Fable 5.1; verificar cada cifra contra `design.md`
- [x] 2.4 Revisar título, `description` y cuerpo contra `post-content` (español neutral con "tú", términos técnicos en inglés, fechas absolutas para la oferta); verificar leyendo el borrador completo

## 3. Publicación

- [x] 3.1 Correr `npm test` y `npm run build`; verificar que terminan sin errores
- [x] 3.2 Con el visto bueno explícito del usuario: ejecutar `npx tsx scripts/publish-post.ts claude-fable-5-2-novedades-planes-precio`; verificar en la DB que la fila existe con `featured = true`, `draft = false`, `author = 'slagosdev'` y que es el único destacado
- [x] 3.3 Confirmar el rebuild según `deployment`; verificar que el post aparece destacado en la portada y en `modelos`, y que las tablas renderizan
