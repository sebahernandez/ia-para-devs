# Explicación de `src/utils/categories.ts`

Este archivo contiene una pequeña utilidad que traduce **slugs de categorías** del blog a **clases CSS** equivalentes, para poder aplicar estilos diferenciados a cada categoría.

## Contenido del archivo

```ts
export function getCatClass(slug: string): string {
  const map: Record<string, string> = {
    tutorial: 'cat-tutorial',
    herramientas: 'cat-herramientas',
    modelos: 'cat-modelos',
    investigacion: 'cat-investigacion',
    'opinión': 'cat-opinion',
  };
  return map[slug] ?? '';
}
```

## ¿Qué hace?

La función `getCatClass` recibe como parámetro un `slug` (identificador textual de una categoría, por ejemplo `tutorial` o `herramientas`) y devuelve la clase CSS asociada a esa categoría.

### Funcionamiento paso a paso

1. **Recibe un `slug`**: el identificador de la categoría, por ejemplo `'tutorial'`, `'herramientas'`, `'modelos'`, `'investigacion'` u `'opinión'`.
2. **Consulta un mapa interno** (`map`) que asocia cada slug conocido a su clase CSS:
   - `tutorial` → `cat-tutorial`
   - `herramientas` → `cat-herramientas`
   - `modelos` → `cat-modelos`
   - `investigacion` → `cat-investigacion`
   - `opinión` → `cat-opinion`
3. **Devuelve la clase correspondiente**. Si el slug no está en el mapa, el operador `??` (nullish coalescing) hace que la función retorne una cadena vacía `''`, evitando valores `undefined`.

## ¿Para qué se utiliza?

En el blog, cada artículo pertenece a una categoría. Para que cada categoría tenga un estilo visual propio (colores, bordes, etiquetas, etc.), se le asigna una clase CSS específica. Esta función centraliza esa relación, de modo que en los componentes solo sea necesario llamar a:

```ts
const cssClass = getCatClass(post.category);
```

y luego aplicar `cssClass` al elemento correspondiente en el template, por ejemplo:

```astro
<span class={getCatClass(category)}>{category}</span>
```

## Ventajas de este enfoque

- **Centralización**: el mapeo slug → clase vive en un único lugar, fácil de mantener.
- **Manejo de slugs desconocidos**: devuelve `''` en lugar de fallar, evitando errores en tiempo de ejecución.
- **Tipado estricto**: al usar `Record<string, string>`, TypeScript garantiza que el retorno siempre sea una cadena.
- **Extensibilidad**: agregar una nueva categoría es tan simple como añadir una nueva entrada al objeto `map`.
