// Uso: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { verifyCredentials } from '~/features/auth/credentials';
import { hashPassword, verifyPassword } from '~/features/auth/password';
import { createSessionCookieValue, verifySessionCookieValue } from '~/features/auth/session';
import { getModelLogo } from '~/features/posts/model-logo';
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
    author: 'slagosdev',
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

  const { author: _omit, ...sinAutor } = valid;
  assert.equal(postInputSchema.parse(sinAutor).author, 'slagosdev');
  assert.equal(postInputSchema.safeParse({ ...valid, author: 'Sebacure' }).success, false);
});

test('credenciales: exige usuario y contraseña correctos', () => {
  const expected = { username: 'Admin', passwordHash: hashPassword('secreta') };
  const check = (username: string, password: string) => verifyCredentials({ username, password }, expected);

  assert.equal(check('Admin', 'secreta'), true);
  assert.equal(check('  aDMIN ', 'secreta'), true);
  assert.equal(check('Admin', 'otra'), false);
  assert.equal(check('otro', 'secreta'), false);
  assert.equal(check('', 'secreta'), false);
  assert.equal(check('Admin', ''), false);
  assert.equal(verifyCredentials({ username: '', password: 'secreta' }, { ...expected, username: '' }), false);
});

test('logo del modelo: elige el primer modelo del título, solo en modelos', () => {
  const logo = (title: string, slug = 'modelos') => getModelLogo({ title, category: { slug } })?.name ?? null;

  assert.equal(logo('Claude Fable 5.2: qué trae de nuevo, cuánto cuesta y en qué planes está'), 'Claude');
  assert.equal(logo('Sonnet 5.5: casi tan bueno como Opus'), 'Claude');
  assert.equal(logo('Gemini 4 Argon frente a GPT-6 y Claude Opus 5.5'), 'Gemini');
  assert.equal(logo('GPT-6 Astra llega a la API'), 'OpenAI');
  assert.equal(logo('Gemma 2: los modelos ligeros de Google'), 'Google');
  assert.equal(logo('Phi-4 de Microsoft'), null);
  assert.equal(logo('Claude en tu editor', 'herramientas'), null);
  assert.equal(logo('Cómo elegir un modelo de lenguaje'), null);
  assert.equal(logo('La meta del año para los LLM'), null);
});
