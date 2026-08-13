import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');

  if (!isAdminPage && !isAdminApi) return next();

  const authed = verifySessionCookieValue(context.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!authed) {
    if (isAdminApi) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return context.redirect('/admin/login');
  }

  return next();
});
