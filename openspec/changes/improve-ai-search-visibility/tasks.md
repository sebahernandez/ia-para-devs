# Tasks

## 1. Analítica

- [x] 1.1 En `src/layouts/BaseLayout.astro`, cargar el script de Umami Cloud solo si `PUBLIC_UMAMI_WEBSITE_ID` está definida, según `design.md`
- [x] 1.2 Verificar con `npm run build` que, sin la variable, ninguna página incluye el script, y con `PUBLIC_UMAMI_WEBSITE_ID=test npm run build` las páginas públicas sí lo incluyen y `/admin` no

## 2. Comando de actualización

- [x] 2.1 Crear `scripts/update-post.ts <slug>` según `design.md` (valida el archivo y el autor, aborta si el slug no existe, conserva `pubDate`, `featured` y `draft`, fija `updatedDate` y dispara el rebuild)
- [x] 2.2 Probarlo con un slug inexistente (debe terminar con error sin escribir nada)

## 3. Posts reescritos

- [x] 3.1 Exportar el `contentMd` y el frontmatter actuales de `mcp-servidores-propios-tutorial` y `vector-search-pgvector` a `src/content/posts/<slug>.md` y commitear esa versión
- [x] 3.2 Reescribir `mcp-servidores-propios-tutorial.md` según `design.md`: servidor MCP mínimo en TypeScript con una herramienta, paso a paso, verificando la API actual del SDK con context7
- [x] 3.3 Reescribir `vector-search-pgvector.md` según `design.md`: título con la búsqueda, introducción que responde qué es y cuándo usarlo, encabezados en forma de pregunta, código verificado con la documentación actual de pgvector
- [ ] 3.4 Mostrar los dos borradores al usuario y esperar su aprobación antes de publicarlos

## 4. Enlaces internos

- [x] 4.1 Exportar `anthropic-mcp-protocol`, `mcp-vs-herramientas-propias`, `embeddings-comparativa`, `reranking-rag-precision` y `embeddings-late-chunking`, y agregar a cada uno una oración con un enlace descriptivo al post reescrito que corresponde

## 5. Entrega

- [ ] 5.1 Con el visto bueno explícito del usuario: commit y `git push`; luego `update-post.ts` para cada post modificado (los dos reescritos y los cinco con enlaces); verificar en producción el título nuevo, la fecha de actualización y los enlaces internos
- [ ] 5.2 Pasos manuales del usuario: crear el sitio en Umami Cloud, copiar su ID a la variable `PUBLIC_UMAMI_WEBSITE_ID` en Netlify y disparar un rebuild; en Search Console, pedir la indexación de las dos URLs reescritas con "Inspeccionar URL"
- [ ] 5.3 A las tres o cuatro semanas, comparar en Search Console la posición y los clics de los dos posts contra los valores de `proposal.md`
