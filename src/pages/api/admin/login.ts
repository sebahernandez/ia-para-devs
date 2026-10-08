export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyCredentials } from '~/features/auth/credentials';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, createSessionCookieValue } from '~/features/auth/session';
import { env } from '~/lib/env';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const input = {
    username: String(form.get('username') ?? ''),
    password: String(form.get('password') ?? ''),
  };
  const expected = { username: env('ADMIN_USERNAME'), passwordHash: env('ADMIN_PASSWORD_HASH') };

  if (!verifyCredentials(input, expected)) {
    return redirect('/admin/login?error=1');
  }

  cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(), SESSION_COOKIE_OPTIONS);

  return redirect('/admin');
};
