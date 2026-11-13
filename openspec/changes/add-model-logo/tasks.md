# Tasks

## 1. Logos

- [x] 1.1 Descargar con `curl` a `public/logos/` los SVG del mapa de `design.md` desde `https://svgl.app/library/<archivo>`; verificar que cada archivo empieza con `<svg` y que no queda ninguno vacío

## 2. Elección del logo

- [x] 2.1 Crear `src/features/posts/model-logo.ts` con el mapa de `design.md` y `getModelLogo({ title, category })` (solo `modelos`, alias como palabra completa sin distinguir mayúsculas, gana el de menor posición, `null` si no hay coincidencia)
- [x] 2.2 En `tests/features.test.ts`, probar: Fable 5.2 → Claude; "Sonnet 5.5" sin "Claude" → Claude; "Gemini 4 Argon frente a GPT-6 y Claude Opus 5.5" → Gemini; "GPT-6" → OpenAI; otra categoría → `null`; título sin modelo → `null`; "la meta del año" → `null`. Verificar con `npm test`

## 3. Render

- [x] 3.1 En `src/components/PostCard.astro`, mostrar el logo en la esquina superior derecha según `design.md` (`pointer-events-none`, `alt=""`, `aria-hidden`, variantes por tema, `pr-10` en categoría y título solo con logo); verificar que un clic sobre el logo abre el post
- [x] 3.2 En `src/layouts/PostLayout.astro`, mostrar el logo en la cabecera según `design.md` (`header` relativo, 40 px, `pr-14` solo con logo); verificar que no tapa la categoría, la fecha ni el título
- [x] 3.3 Correr `npm run build` y revisar en `npm run preview`, en tema claro y oscuro y a 360 px de ancho: la portada, `/blog`, `/categorias/modelos` y los tres posts de `modelos`. Verificar que Sonnet 5.5 y Fable 5.2 muestran Claude, Gemini 4 Argon muestra Gemini, que ningún texto queda debajo del logo y que el HTML generado no enlaza a `svgl.app`

## 4. Entrega

- [x] 4.1 Con el visto bueno explícito del usuario: commit, `git push` y rebuild de Netlify según `deployment`; verificar en producción que las tarjetas y los tres posts muestran su logo
