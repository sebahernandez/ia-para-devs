export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function parseId(value: string | undefined): number | null {
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}
