import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../db/schema';

// Driver websocket (a diferencia de src/lib/db.ts, que usa el driver HTTP):
// las escrituras del admin necesitan transacciones reales (post + tags),
// algo que el driver HTTP no soporta.
export async function withWriteDb<T>(fn: (db: ReturnType<typeof drizzle>) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  try {
    const db = drizzle(pool, { schema });
    return await fn(db);
  } finally {
    await pool.end();
  }
}
