# Publicar La Leyenda del Magdaleno

El juego es una web estática. No necesita base de datos, cuentas de jugadores ni servidor de juego. El guardado vive en el navegador y dispositivo de cada jugador.

## GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub con rama `main`.
2. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions**.
3. Ejecuta el flujo **Publicar el Magdaleno** o sube un cambio a `main`.
4. Abre el enlace que entrega la acción de despliegue.

El archivo `.github/workflows/pages.yml` prepara `dist` y publica únicamente la web. Las rutas de imágenes, vídeo, scripts y el modo sin conexión son relativas para funcionar también dentro del nombre del repositorio.

GitHub Pages está disponible con GitHub Free para repositorios públicos. También existe en repositorios privados con planes compatibles. Fuente: [documentación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Vercel

1. Importa el repositorio en Vercel.
2. Conserva la raíz en esta carpeta y elige **Other** como framework.
3. La configuración `vercel.json` ejecuta `node tools/build-web.cjs` y publica `dist`.
4. Pulsa **Deploy** y abre la URL entregada por Vercel.

También puedes preparar `dist` localmente y desplegar esa carpeta como sitio estático. [Configuración de compilación de Vercel](https://vercel.com/docs/builds/configure-a-build).

## Preparar la carpeta web

```text
node tools/build-web.cjs
```

El resultado incluye juego, sprites, iconos, guía móvil y dos versiones del tráiler. Excluye las herramientas y evidencias de pruebas. `dist` puede entregarse a cualquier alojamiento estático con HTTPS.

## En el teléfono

Abre el enlace HTTPS en Chrome o Safari. El juego adapta el menú, los diálogos y los controles a vertical u horizontal. Puedes agregarlo a la pantalla de inicio; cuando el navegador lo permite, sus recursos quedan disponibles sin conexión después de la primera carga. Los vídeos del tráiler no se descargan automáticamente para jugar sin conexión.

No uses el enlace `127.0.0.1` del computador en el teléfono: cada dispositivo interpreta esa dirección como sí mismo. Usa el enlace publicado.

La adaptación fue comprobada en emulación táctil de Chrome a 320×568, 360×740, 393×852, 740×360, 844×390 y 768×1024. Queda pendiente confirmar comodidad y funciones de instalación en teléfonos físicos.
