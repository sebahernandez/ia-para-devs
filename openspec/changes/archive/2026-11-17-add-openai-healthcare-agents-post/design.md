# Design

## Context

Ver `proposal.md` (Why). Los posts son filas en `posts`; la fuente vive en `src/content/posts/<slug>.md` y se publica con `scripts/publish-post.ts <slug>`, que valida el frontmatter (autor `slagosdev`, categoría existente), aborta si el slug ya existe, crea el post con `createPost()` (que deja un solo destacado) y dispara el rebuild. La portada (`src/pages/index.astro`) muestra en el bloque "Destacado" el post que devuelve `getFeaturedPost()`. Los posts recientes fijan el tono: gancho corto, "Resumen en 30 segundos", tablas para las cifras, sección honesta de letra chica y cierre.

## Goals / Non-Goals

**Goals:**
- Publicar el borrador del usuario adaptado al estilo del blog, con los datos verificados.
- Dejarlo como único destacado de la portada.
- Usar el flujo existente, sin código nuevo.

**Non-Goals:**
- Cambios de esquema, componentes, estilos o scripts.
- Gráficos SVG, videos o imágenes.
- Editar los archivos fuente de otros posts: su `featured` en el frontmatter no afecta a la base de datos (`update-post.ts` conserva el valor guardado).

## Decisions

**Categoría `herramientas`.** Las categorías existentes son `modelos`, `herramientas`, `investigacion`, `opinión` y `tutorial`. El anuncio es de agentes y de un producto (ChatGPT for Healthcare, API), y la descripción de `herramientas` nombra "agentes" de forma explícita. Alternativa descartada: `modelos`, porque GPT-6 Astra y Luna aparecen solo como el motor evaluado, no como lanzamiento.

**Destacado por el flujo normal.** `featured: true` en el frontmatter; `createPost()` desmarca el destacado anterior en la misma transacción. No hace falta tocar el admin ni el otro post.

**Ángulo: "de la IA que responde a la IA que opera el software".** Se conserva el del borrador y se agrega una sección corta para el lector del blog (desarrolladores): por qué importa un agente que opera interfaces sin API y qué controles lo hacen viable (log de auditoría, permisos, aprobación humana). Esa sección solo usa hechos presentes en las fuentes.

**Estructura:** gancho (el ejemplo de la resonancia) → resumen en 30 segundos → qué anunció OpenAI y dónde está disponible → el ejemplo paso a paso (dolor lumbar) → las cifras (tabla) y cómo leerlas → quién ya lo usa → el control: auditoría, permisos y aprobación humana → qué significa para quien desarrolla → letra chica → fuentes.

**Hechos del borrador (ver más abajo el resultado de la verificación, que prevalece):**
- Anuncio de OpenAI del 16-11-2026: agentes de uso de computadora para equipos de salud, disponibles por la API de OpenAI, ChatGPT for Healthcare y ChatGPT for Clinicians.
- Qué hacen: leen pantallas, hacen clic, teclean y se mueven entre la historia clínica electrónica y los portales de aseguradoras; trámites como autorizaciones, derivaciones y altas.
- Ejemplo de OpenAI: paciente con dolor lumbar → el agente revisa notas, fisioterapia e imágenes previas → redacta la orden de resonancia y la respuesta al paciente → prepara la autorización previa en el portal de la aseguradora, para revisión humana.
- Cifras:

  | Evaluación | Modelo | Resultado |
  |---|---|---|
  | Tareas de bandeja de historia clínica calificadas como clínicamente seguras por médicos revisores | GPT-6 Astra | 99% de 325 tareas |
  | Calificado muy o extremadamente útil | GPT-6 Astra | 93% de 646 evaluaciones |
  | HealthAdminBench (autorizaciones, apelaciones, pedidos de equipamiento) | GPT-6 Astra | 94,3% |
  | HealthAdminBench | GPT-6 Luna | 91,8%, a 8,5 centavos por tarea |

- HealthAdminBench: el borrador lo describe como benchmark independiente de Stanford. Confirmar quién creó el benchmark y quién corrió y publicó estos puntajes; el texto debe distinguir ambas cosas.
- Adopción: CVS Health los usa en producción (un agente despejó en un fin de semana un atraso de meses en el envío de documentos; otro gestiona los pasos de decenas de miles de consultas con especialistas al día). Cigna, Abridge y Ambience trabajan en flujos similares.
- Más de 20 plugins nuevos en ChatGPT for Healthcare, entre ellos verificación de cobertura y evidencia clínica de UpToDate.
- Control: cada acción queda en un log de auditoría; los equipos definen qué puede hacer el agente y qué pasos exigen aprobación humana.
- Límite: son evaluaciones publicadas por OpenAI, no resultados clínicos medidos ni aprobación regulatoria.
- Fuentes:
  - OpenAI — "Advancing computer-use agents for healthcare teams", 16-11-2026 — https://openai.com/index/advancing-computer-use-for-healthcare-teams/
  - OpenAI — "More ways to move care forward with ChatGPT for Healthcare", 16-11-2026 — https://openai.com/index/more-ways-to-move-care-forward-with-chatgpt-for-healthcare/
  - Unite.AI — "OpenAI Brings Computer-Use Agents to Healthcare Workflows", 16-11-2026 — https://www.unite.ai/openai-brings-computer-use-agents-to-healthcare-workflows/
  - Unite.AI — "OpenAI Adds Over 20 Healthcare Plugins and Upgrades Clinical Search", 16-11-2026 — https://www.unite.ai/openai-adds-over-20-healthcare-plugins-and-upgrades-clinical-search/
  - HIT Consultant, 16-11-2026 — https://hitconsultant.net/2026/11/16/openai-launches-healthcare-computer-use-agents-clinical-search-20-plugins/
  - HealthAdminBench — https://healthadminbench.stanford.edu/ y https://arxiv.org/abs/2604.09937

**Resultado de la verificación (17-11-2026).** Las dos páginas de OpenAI existen con ese título y fecha, pero devuelven 403 a la lectura automática: los datos se confirmaron en las dos notas de Unite.AI y en HIT Consultant, que reescriben el anuncio y atribuyen las cifras a OpenAI. Correcciones al borrador, que el post debe reflejar:
- El ejemplo del dolor lumbar es una demostración con un paciente sintético. El agente redacta también la nota de la consulta; la orden y la respuesta las revisa el clínico, y la autorización, un especialista en autorizaciones.
- 99% de 325 tareas revisadas de bandeja de historia clínica calificadas como clínicamente seguras (criterio: si un error u omisión podría causar daño al paciente); 93% de 646 evaluaciones de médicos en las dos categorías más altas de utilidad, en una escala de cinco puntos. No se publica el número de revisores.
- HealthAdminBench: lo crearon investigadores de Stanford con Kinetic Systems y Stanford Health Care (135 tareas, 1.698 subtareas; autorizaciones previas, apelaciones y pedidos de equipamiento médico). Los puntajes los corrió y reportó OpenAI: Astra 94,3% y Luna 91,8% de los puntos de rúbrica disponibles, ambos con esfuerzo de razonamiento máximo. Los 8,5 centavos por tarea son de Luna, 98% menos que Astra. No se pudo ver el leaderboard del benchmark. Contexto del paper original: el mejor agente completaba el 36,3% de las tareas (métrica distinta, no comparable de forma directa).
- Adopción: CVS Health en producción (confirmado tal cual, bajo supervisión humana). Cigna Healthcare pasó de la idea a producción en menos de ocho semanas. Abridge está desarrollando agentes para el alta. Ambience mostró una demostración de autorización previa.
- Disponibilidad: API de OpenAI, ChatGPT for Healthcare y ChatGPT for Clinicians; HIT Consultant agrega ChatGPT Work y Codex.
- Plugins: más de 20, en ChatGPT for Healthcare; los habilita el administrador del espacio de trabajo. Stedi verifica elegibilidad y beneficios del seguro; UpToDate Expert AI aporta evidencia clínica.
- Control: log de auditoría paso a paso, acciones y aplicaciones permitidas, pausas y pasos de aprobación. Para datos de salud protegidos se requiere un Business Associate Agreement con OpenAI (HIPAA).
- Ninguna fuente menciona aprobación regulatoria; el post lo dice así, sin afirmar nada más.
- Dato agregado para desarrolladores: CVS Health publicó su CUA Agent Kit (Apache-2.0, https://github.com/cvs-health/cua-agent-kit), que usa un agente de OpenAI para descubrir el flujo y convierte las ejecuciones exitosas en código Playwright o pywinauto que corre sin llamadas al modelo. Su repositorio advierte que las trazas pueden contener credenciales y datos visibles en pantalla.

Se agrega al final una sección corta de preguntas frecuentes, como en el último post publicado.

**Metadatos:** `slug: openai-agentes-uso-de-computadora-salud`; `title`: "La IA ya no solo responde: ahora hace clic, tramita y trabaja dentro del software de los hospitales"; `description`: "OpenAI lanzó agentes de uso de computadora para equipos de salud: operan la historia clínica y los portales de aseguradoras. Qué hacen, las cifras de GPT-6 Astra y quién ya los usa."; `category: herramientas`; `pubDate: 2026-11-17`; `author: slagosdev`; `draft: false`; `featured: true`; `tags`: `OpenAI`, `Agentes de IA`, `Computer use`, `GPT-6`, `Salud`.

## Risks / Trade-offs

- **Datos sin verificar** → La tarea 1.1 bloquea la redacción. Un dato que no aparezca en las fuentes se omite o se declara no confirmado (`post-content`).
- **Cifras del propio OpenAI** → Atribuirlas a OpenAI en el texto y decir que no son resultados clínicos ni aprobación regulatoria.
- **Tema de salud** → No presentar al agente como quien toma decisiones clínicas: prepara y un humano revisa, como dice el anuncio.
- **El título no nombra a OpenAI** → Se respeta el del usuario; `description` y el primer párrafo lo nombran para la búsqueda.
- **El destacado actual se desmarca** → Comportamiento pedido; se revierte desde el admin.
- **Rollback** → Pasar a borrador o borrar el post desde el admin, volver a marcar el destacado anterior y disparar el rebuild.
