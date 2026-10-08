# Spec Delta

## Purpose

Define cómo se accede al panel de administración del blog: qué credenciales se piden, qué rutas exigen una sesión iniciada, cuánto dura esa sesión y cómo se cierra.

## ADDED Requirements

### Requirement: El login exige usuario y contraseña

El sistema SHALL iniciar sesión únicamente cuando el usuario y la contraseña enviados coinciden con los de la cuenta de administrador configurada. El usuario SHALL compararse sin distinguir mayúsculas de minúsculas ni espacios al inicio o al final; la contraseña SHALL compararse de forma exacta.

#### Scenario: Credenciales correctas

- **WHEN** se envían el usuario y la contraseña correctos
- **THEN** se inicia la sesión y el navegador llega al listado de posts del panel

#### Scenario: Usuario con otra capitalización

- **WHEN** se envía el usuario correcto con distinta capitalización o con espacios alrededor, y la contraseña correcta
- **THEN** se inicia la sesión

#### Scenario: Contraseña incorrecta

- **WHEN** se envía el usuario correcto con una contraseña incorrecta
- **THEN** no se inicia sesión y se vuelve a la pantalla de login con un mensaje de error

#### Scenario: Usuario incorrecto

- **WHEN** se envía un usuario incorrecto con la contraseña correcta
- **THEN** no se inicia sesión y se vuelve a la pantalla de login con un mensaje de error

#### Scenario: Campo vacío

- **WHEN** se envía el formulario sin usuario o sin contraseña
- **THEN** no se inicia sesión

### Requirement: El error de login no revela qué dato falló

Ante credenciales incorrectas, el sistema SHALL mostrar el mismo mensaje y responder de la misma forma sin importar si falló el usuario, la contraseña o ambos.

#### Scenario: Mismo mensaje en todos los casos

- **WHEN** el login falla por usuario incorrecto, por contraseña incorrecta o por ambos
- **THEN** la pantalla muestra "Usuario o contraseña incorrectos." en los tres casos

### Requirement: El panel y su API exigen una sesión iniciada

Toda página bajo `/admin` y toda ruta bajo `/api/admin` SHALL exigir una sesión válida, con excepción de la pantalla de login y de la ruta que la procesa.

#### Scenario: Página del panel sin sesión

- **WHEN** se abre una página del panel sin sesión
- **THEN** el navegador es redirigido a la pantalla de login

#### Scenario: API del panel sin sesión

- **WHEN** se llama a una ruta de la API del panel sin sesión
- **THEN** la respuesta es 401 y no se ejecuta ninguna operación

#### Scenario: Sesión manipulada

- **WHEN** se presenta una cookie de sesión alterada o que no fue emitida por el sistema
- **THEN** se trata como si no hubiera sesión

### Requirement: La sesión caduca a los siete días

Una sesión SHALL ser válida durante siete días desde el inicio de sesión. Su cookie SHALL NOT ser legible desde scripts del navegador y SHALL enviarse solo por conexiones seguras.

#### Scenario: Sesión vigente

- **WHEN** se abre el panel antes de siete días desde el login
- **THEN** se accede sin volver a pedir credenciales

#### Scenario: Sesión caducada

- **WHEN** se abre el panel pasados siete días desde el login
- **THEN** el navegador es redirigido a la pantalla de login

### Requirement: Cerrar sesión termina el acceso

Al cerrar sesión, el sistema SHALL eliminar la sesión del navegador y llevarlo a la pantalla de login.

#### Scenario: Cierre de sesión

- **WHEN** se pulsa "Cerrar sesión" en el panel
- **THEN** el navegador llega a la pantalla de login y las páginas del panel vuelven a pedir credenciales

### Requirement: La pantalla de login es accesible y compatible con gestores de contraseñas

La pantalla de login SHALL mostrar una etiqueta visible para cada campo, identificar los campos como usuario y contraseña actual para los gestores de contraseñas, anunciar el mensaje de error a los lectores de pantalla y poder completarse solo con el teclado. SHALL verse correctamente en modo claro y en modo oscuro.

#### Scenario: Autocompletado del gestor de contraseñas

- **WHEN** se abre la pantalla de login en un navegador con las credenciales guardadas
- **THEN** el gestor ofrece completar el usuario y la contraseña en sus campos correspondientes

#### Scenario: Uso solo con teclado

- **WHEN** se abre la pantalla de login
- **THEN** el foco está en el campo de usuario, Tab recorre usuario, contraseña, mostrar contraseña y botón de entrar en ese orden con el foco visible, y Enter en un campo envía el formulario

#### Scenario: Mostrar y ocultar la contraseña

- **WHEN** se pulsa el botón de mostrar contraseña dentro del campo
- **THEN** la contraseña escrita se ve en texto, el botón pasa a ofrecer ocultarla, y al pulsarlo de nuevo vuelve a quedar oculta sin perder lo escrito ni enviar el formulario

#### Scenario: Error anunciado

- **WHEN** el login falla
- **THEN** el mensaje de error aparece junto al formulario y un lector de pantalla lo anuncia

#### Scenario: Modo claro y oscuro

- **WHEN** se abre la pantalla de login con el tema claro o con el tema oscuro
- **THEN** el texto, los campos, el botón y el mensaje de error se leen con contraste suficiente en ambos
