export async function triggerRebuild(): Promise<void> {
  const url = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: 'POST' });
  } catch {
    // El contenido ya quedó guardado en Neon; un fallo del webhook no debe
    // hacer fallar el guardado, solo retrasar la publicación del rebuild.
  }
}
