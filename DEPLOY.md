# Proceso de deploy

Regla del proyecto (spec `deployment`): un cambio se publica **solo cuando está aprobado** — sus tareas están completas y hay visto bueno explícito para desplegar.

## Orden: GitHub → rebuild

1. **GitHub**: `git commit` y `git push` al remoto.
2. **Rebuild/deploy**: recién después del push, disparar el build de Netlify:
   ```bash
   node --env-file=.env -e 'fetch(process.env.NETLIFY_BUILD_HOOK_URL,{method:"POST"}).then(r=>console.log(r.status))'
   ```

Nunca dispares el rebuild antes de que el commit esté en el remoto: Netlify construiría un commit anterior. Si pasó, repetí el rebuild una vez completado el push.

## Contenido solo en la base de datos (posts en Neon)

Un cambio que solo edita/crea contenido en Neon (sin tocar archivos del repo) **no requiere commit**, pero **sí** requiere disparar el rebuild — el sitio es estático y no se actualiza sin un nuevo build.

## Verificación

Tras el rebuild, confirmar que el build hook respondió HTTP 2xx y, cuando aplique, que el contenido esperado ya está accesible en el sitio publicado.
