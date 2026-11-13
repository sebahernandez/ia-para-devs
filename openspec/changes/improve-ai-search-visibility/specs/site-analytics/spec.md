## ADDED Requirements

### Requirement: Las páginas públicas registran visitas sin cookies

Toda página pública SHALL cargar el script de Umami Cloud cuando la variable `PUBLIC_UMAMI_WEBSITE_ID` está definida en el build. El script SHALL cargarse con `defer` para no bloquear el render. La analítica SHALL NOT usar cookies, por lo que el sitio no muestra banner de consentimiento.

#### Scenario: Build con ID configurado

- **WHEN** se genera el sitio con `PUBLIC_UMAMI_WEBSITE_ID` definida
- **THEN** cada página pública incluye `<script defer src="https://cloud.umami.is/script.js" data-website-id="<id>">`

#### Scenario: Build sin ID

- **WHEN** se genera el sitio sin `PUBLIC_UMAMI_WEBSITE_ID` (por ejemplo, en local)
- **THEN** ninguna página incluye el script de Umami y el sitio funciona igual

### Requirement: El panel admin no se mide

Las páginas de `/admin` SHALL NOT cargar el script de analítica.

#### Scenario: Página del admin

- **WHEN** se abre una página de `/admin`
- **THEN** el HTML no incluye el script de Umami

### Requirement: Se distingue el tráfico que llega desde buscadores con IA

La analítica SHALL registrar el referrer y los parámetros UTM de cada visita, de modo que las visitas con `utm_source=chatgpt.com` o con referrer de un buscador con IA se puedan filtrar.

#### Scenario: Visita desde ChatGPT

- **WHEN** un lector llega desde un enlace de ChatGPT con `utm_source=chatgpt.com`
- **THEN** la visita aparece en Umami con ese origen
