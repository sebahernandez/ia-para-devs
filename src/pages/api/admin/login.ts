export const prerender = false;

import type { APIRoute } from 'astro';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE, createSessionCookieValue, verifyPassword } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');

  if (!verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!)) {
    return redirect('/admin/login?error=1');
  }

  cookies.set(SESSION_COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return redirect('/admin');
};
