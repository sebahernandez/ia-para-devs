type RequiredEnv = 'DATABASE_URL' | 'SESSION_SECRET' | 'ADMIN_PASSWORD_HASH';

// Único punto de lectura de las variables de entorno obligatorias.
export function env(name: RequiredEnv): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}
