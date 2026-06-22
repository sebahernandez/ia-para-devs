---
title: "Desplegar un modelo con Ollama en un servidor Linux: guía de producción"
description: "Ollama en tu laptop funciona bien para desarrollo. Para un servidor compartido con varios usuarios o para integrarlo en una aplicación, hay configuración extra necesaria. Esta guía cubre el setup completo."
pubDate: 2025-12-10
tags: ["ollama", "deployment", "linux", "self-hosted"]
category: tutorial
---

Ollama en local es simple: instalas, ejecutas, listo. Desplegarlo en un servidor para que múltiples servicios o usuarios lo usen requiere configuración adicional: systemd, exposición de red, seguridad y monitorización.

## Instalación en servidor Linux

```bash
# Instalar Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Verificar que el servicio está corriendo
systemctl status ollama
```

Ollama crea automáticamente un servicio systemd que se inicia con el sistema.

## Descargar modelos en el servidor

```bash
# Descargar Llama 3.1 8B (la versión más popular para servidores)
ollama pull llama3.1

# Descargar Mistral 7B
ollama pull mistral

# Listar modelos disponibles
ollama list
```

Los modelos se guardan en `/usr/share/ollama/.ollama/models/`.

## Exponer la API a la red local

Por defecto, Ollama escucha solo en `localhost:11434`. Para que otros servicios en la red puedan acceder, hay que cambiar la configuración:

```bash
# Editar la configuración del servicio systemd
sudo systemctl edit ollama
```

En el editor que abre:
```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

**Atención**: Esto expone la API sin autenticación. Solo hazlo si la red está protegida por firewall o si añades un proxy inverso con autenticación delante.

## Proxy inverso con nginx y autenticación básica

```bash
# Instalar nginx
sudo apt install nginx apache2-utils

# Crear usuario con contraseña
sudo htpasswd -c /etc/nginx/.htpasswd ollama_user

# Configuración nginx
sudo nano /etc/nginx/sites-available/ollama
```

```nginx
server {
    listen 443 ssl;
    server_name tu-servidor.com;

    ssl_certificate /etc/ssl/certs/tu-cert.pem;
    ssl_certificate_key /etc/ssl/private/tu-key.pem;

    location / {
        proxy_pass http://localhost:11434;
        proxy_set_header Host $host;
        
        auth_basic "Ollama API";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

## Usar la API desde tu aplicación

La API de Ollama es compatible con el formato de OpenAI:

```python
from openai import OpenAI

# Apuntar al servidor Ollama en lugar de a api.openai.com
client = OpenAI(
    base_url="http://tu-servidor:11434/v1",
    api_key="ollama",  # Ollama no requiere key, pero el campo es obligatorio
)

response = client.chat.completions.create(
    model="llama3.1",
    messages=[
        {"role": "user", "content": "Explica qué es un deadlock en bases de datos"}
    ]
)

print(response.choices[0].message.content)
```

## Monitorización

```bash
# Ver logs en tiempo real
journalctl -u ollama -f

# Ver uso de GPU
watch -n 1 nvidia-smi

# Ver modelos cargados en memoria
ollama ps
```

## Gestión de memoria GPU

Por defecto, Ollama carga el modelo en GPU cuando hay memoria disponible y lo descarga después de 5 minutos de inactividad. Puedes ajustar esto:

```bash
# Mantener el modelo en memoria indefinidamente
OLLAMA_KEEP_ALIVE=-1 ollama serve

# O por model al hacer la petición
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1",
  "keep_alive": -1,
  "prompt": "Hola"
}'
```

## Hardware mínimo recomendado para servidor

| Modelo | VRAM GPU | RAM CPU (si no hay GPU) |
|--------|----------|------------------------|
| Llama 3.1 8B Q4 | 6 GB | 8 GB |
| Mistral 7B Q4 | 5 GB | 7 GB |
| Llama 3.1 70B Q4 | 40 GB | 48 GB |

---

*Fuentes: Documentación oficial de Ollama, repositorio GitHub de Ollama, guías de la comunidad en /r/LocalLLaMA.*
