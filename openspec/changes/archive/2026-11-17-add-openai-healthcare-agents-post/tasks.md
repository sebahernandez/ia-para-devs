# Tasks

## 1. Verificación de datos

- [x] 1.1 Ubicar y consultar las tres fuentes de `design.md` (dos de OpenAI y una de Unite.AI); verificar cada hecho de "Hechos a verificar" y anotar las URL en `design.md`. Corregir o quitar de `design.md` lo que no coincida o no aparezca
- [x] 1.2 Confirmar quién creó HealthAdminBench y quién publicó los puntajes de Astra y Luna; dejar la atribución correcta en `design.md`

## 2. Redacción del post

- [x] 2.1 Crear `src/content/posts/openai-agentes-uso-de-computadora-salud.md` con el frontmatter de `design.md` (`author: slagosdev`, `category: herramientas`, `featured: true`, `draft: false`); verificar que `gray-matter` lo parsea con todos los campos
- [x] 2.2 Escribir el cuerpo a partir del borrador del usuario con la estructura de `design.md` (gancho → resumen en 30 segundos → qué anunció → ejemplo → cifras → quién lo usa → control → para quien desarrolla → letra chica → fuentes); verificar que están todas las secciones
- [x] 2.3 Añadir la tabla de cifras atribuida a OpenAI y la lista de fuentes con enlace; verificar cada cifra contra `design.md`
- [x] 2.4 Revisar título, `description` y cuerpo contra `post-content` (español neutral con "tú", términos técnicos en inglés, cifras atribuidas, sin datos no confirmados); verificar leyendo el borrador completo

## 3. Publicación

- [x] 3.1 Correr `npm test` y `npm run build`; verificar que terminan sin errores
- [x] 3.2 Con el visto bueno explícito del usuario: ejecutar `npx tsx scripts/publish-post.ts openai-agentes-uso-de-computadora-salud`; verificar en la DB que la fila existe con `featured = true`, `draft = false`, `author = 'slagosdev'`, `category_slug = 'herramientas'` y que es el único destacado
- [x] 3.3 Confirmar el rebuild según `deployment`; verificar que el post aparece en el bloque "Destacado" de la portada en lugar del anterior, que aparece en `/categorias/herramientas/` y que la tabla renderiza
