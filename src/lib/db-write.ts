import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../db/schema';
import { env } from './env';

type WriteDb = ReturnType<typeof drizzle>;
export type WriteTx = Parameters<Parameters<WriteDb['transaction']>[0]>[0];

// Driver websocket (a diferencia de src/lib/db.ts, que usa el driver HTTP):
// las escrituras del admin necesitan transacciones reales (post + tags),
// algo que el driver HTTP no soporta.
export async function withWriteDb<T>(fn: (db: WriteDb) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: env('DATABASE_URL') });
  try {
    const db = drizzle(pool, { schema });
    return await fn(db);
  } finally {
    await pool.end();
  }
}
