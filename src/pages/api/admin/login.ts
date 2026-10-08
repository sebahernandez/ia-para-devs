export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyPassword } from '~/features/auth/password';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, createSessionCookieValue } from '~/features/auth/session';
import { env } from '~/lib/env';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');

  if (!verifyPassword(password, env('ADMIN_PASSWORD_HASH'))) {
    return redirect('/admin/login?error=1');
  }

  cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(), SESSION_COOKIE_OPTIONS);

  return redirect('/admin');
};
