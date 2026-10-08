import { createHash, timingSafeEqual } from 'node:crypto';
import { verifyPassword } from './password';

type Credentials = { username: string; password: string };
type Expected = { username: string; passwordHash: string };

const normalize = (username: string) => username.trim().toLowerCase();

// SHA-256 para que los dos búferes midan siempre lo mismo en timingSafeEqual.
const digest = (username: string) => createHash('sha256').update(normalize(username)).digest();

// Sin retorno temprano: la contraseña se verifica aunque el usuario no coincida,
// para que el tiempo de respuesta no delate cuál de los dos datos falló.
export function verifyCredentials(input: Credentials, expected: Expected): boolean {
  const passwordOk = verifyPassword(input.password, expected.passwordHash);
  const usernameOk = timingSafeEqual(digest(input.username), digest(expected.username));
  return usernameOk && passwordOk && normalize(input.username) !== '';
}
