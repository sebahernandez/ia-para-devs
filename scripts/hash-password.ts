import { hashPassword } from '../src/lib/auth';

const password = process.argv[2];

if (!password) {
  console.error('Uso: npx tsx scripts/hash-password.ts "tu-contraseña"');
  process.exit(1);
}

console.log(hashPassword(password));
