// Uso: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hashPassword, verifyPassword } from '~/features/auth/password';
import { createSessionCookieValue, verifySessionCookieValue } from '~/features/auth/session';
import { postInputSchema, toPostInput } from '~/features/posts/schema';
import { parseId } from '~/lib/http';

process.env.SESSION_SECRET = 'secreto-de-prueba';

test('parseId: acepta un id numérico y rechaza el resto', () => {
  assert.equal(parseId('42'), 42);
  assert.equal(parseId('abc'), null);
  assert.equal(parseId(undefined), null);
});

test('contraseña: verifica la correcta y rechaza el resto', () => {
  const stored = hashPassword('secreta');
  assert.equal(verifyPassword('secreta', stored), true);
  assert.equal(verifyPassword('otra', stored), false);
  assert.equal(verifyPassword('secreta', 'sin-separador'), false);
});

test('sesión: acepta una recién creada y rechaza manipuladas, mal formadas y vacías', () => {
  const value = createSessionCookieValue();
  assert.equal(verifySessionCookieValue(value), true);

  const [, sig] = value.split('.');
  const forged = Buffer.from(JSON.stringify({ exp: Date.now() + 1e12 })).toString('base64url');
  assert.equal(verifySessionCookieValue(`${forged}.${sig}`), false);
  assert.equal(verifySessionCookieValue('sin-punto'), false);
  assert.equal(verifySessionCookieValue(''), false);
  assert.equal(verifySessionCookieValue(undefined), false);
});

test('esquema de post: acepta una entrada válida y rechaza slug inválido o título vacío', () => {
  const valid = {
    title: 'Título',
    slug: 'un-slug-valido',
    description: 'Descripción',
    category: 'modelos',
    pubDate: '2026-10-08',
    tags: ['llm'],
    author: 'Sebacure',
    draft: true,
    featured: false,
    content: 'Cuerpo',
  };
  const parsed = postInputSchema.safeParse(valid);
  assert.equal(parsed.success, true);
  const input = toPostInput(parsed.data!, null);
  assert.equal(input.contentMd, 'Cuerpo');
  assert.equal(input.categorySlug, 'modelos');

  assert.equal(postInputSchema.safeParse({ ...valid, slug: 'Slug Inválido' }).success, false);
  assert.equal(postInputSchema.safeParse({ ...valid, title: '' }).success, false);
});
