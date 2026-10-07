# Tasks

## 1. Verificación de datos

- [x] 1.1 Volver a consultar las fuentes de `design.md` y buscar novedades de disponibilidad de Gemini 4 Argon; verificar que los hechos congelados siguen vigentes o actualizar `design.md` si Google abrió el acceso

## 2. Redacción del post

- [x] 2.1 Crear `src/content/posts/gemini-4-argon-como-usarlo-planes-benchmarks.md` con el frontmatter de `design.md` (`featured: true`, `draft: false`, `category: modelos`); verificar que `gray-matter` lo parsea con todos los campos
- [x] 2.2 Escribir el cuerpo siguiendo la estructura de `design.md` (gancho → video → qué es → disponibilidad y planes → precios → cómo usarlo → benchmarks → dónde no gana → cierre con CTA); verificar que están todas las secciones
- [x] 2.3 Insertar el `<iframe>` del video (`embed/MHr2L3N27Vw?start=14`) y debajo la nota `<small>` con el enlace al canal de Vitoria Ferreira y la mención de autorización de su creadora; verificar que el bloque coincide con el patrón del post de Sonnet 5.5
- [x] 2.4 Añadir la tabla de disponibilidad (quién / cuándo) y la tabla de benchmarks atribuida a Google con las filas donde Argon pierde; verificar cada cifra contra `design.md` y que lo no publicado se declara como desconocido
- [x] 2.5 Revisar título, `description` y cuerpo contra `post-content` (español neutral, "tú", términos técnicos en inglés); verificar leyendo el borrador completo

## 3. Publicación

- [x] 3.1 Renombrar `scripts/publish-sonnet-post.ts` a `scripts/publish-post.ts` y leer el slug de `process.argv[2]`; verificar que sin argumento sale con error y que con el slug de Sonnet aborta por "ya existe"
- [x] 3.2 Ejecutar `npx tsx scripts/publish-post.ts gemini-4-argon-como-usarlo-planes-benchmarks`; verificar en la DB que la fila existe con `featured = true`, `draft = false`, `content_html` generado y que es el único post destacado
- [x] 3.3 Abrir el post en local o preview; verificar que el video se reproduce, la nota de autorización se ve en texto pequeño, las tablas renderizan y el post aparece como destacado en la portada y en `modelos`
- [x] 3.4 Confirmar el rebuild según la capability `deployment`; verificar que el post está publicado y destacado en producción
