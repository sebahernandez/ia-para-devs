/** Returns the cyberpunk CSS class for a given category slug. */
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
