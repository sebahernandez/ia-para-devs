import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { categories } from '../src/db/schema';

const CATEGORIES = [
  {
    slug: 'modelos',
    label: 'Modelos',
    description: 'Lanzamientos, comparativas y benchmarks de modelos de lenguaje, visión, audio y código.',
    accentClass: 'cat-modelos',
    sortOrder: 0,
  },
  {
    slug: 'herramientas',
    label: 'Herramientas',
    description: 'SDKs, IDEs, agentes y utilidades prácticas para integrar IA en tu flujo de trabajo.',
    accentClass: 'cat-herramientas',
    sortOrder: 1,
  },
  {
    slug: 'investigacion',
    label: 'Investigación',
    description: 'Papers, técnicas nuevas y movimientos importantes que definen el estado del arte.',
    accentClass: 'cat-investigacion',
    sortOrder: 2,
  },
  {
    slug: 'opinión',
    label: 'Opinión',
    description: 'Análisis editorial sobre hacia dónde va la industria y qué significa para los devs.',
    accentClass: 'cat-opinion',
    sortOrder: 3,
  },
  {
    slug: 'tutorial',
    label: 'Tutoriales',
    description: 'Guías paso a paso con código, prompts y arquitecturas listas para producción.',
    accentClass: 'cat-tutorial',
    sortOrder: 4,
  },
] as const;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool);

  for (const c of CATEGORIES) {
    await db.insert(categories).values(c).onConflictDoNothing({ target: categories.slug });
  }

  console.log(`Sembradas ${CATEGORIES.length} categorías.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
