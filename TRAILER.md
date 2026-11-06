# Mini tráiler de la etapa 2

Diez segundos de carrera en el motor real, en Full HD horizontal y vertical: `media/Magdaleno_etapa2_10s_16x9.mp4` y `media/Magdaleno_etapa2_10s_9x16.mp4`. Muestra los esquives, un patinazo, la niebla encima y el grito de Coté. No muestra el refugio ni El Vecino. La música y los efectos son originales y sintetizados, sin voz.

Para regenerarlo, iniciar `node tools/server.cjs` y ejecutar `node tools/trailer-etapa2.cjs`. Las muestras de revisión quedan en `qa/trailer_etapa2/`.

# Tráiler narrado

Montaje de 45 segundos del motor real, con la narración y la música aportadas por el usuario. Versiones Full HD horizontal (1920×1080) y vertical (1080×1920), H.264, 30 fps y audio AAC estéreo de 48 kHz. Se reproduce y descarga desde `trailer.html`.

La edición `patrulleros-20261103` muestra los siete enemigos humanoides de masilla del juego 0.7.1. Conserva el montaje, la narración y los ajustes musicales del tráiler narrado anterior.

## Mezcla

- Voz a 1×, sin acelerar ni cambiar su tono; entrada a los 0,35 segundos.
- Música a 0,92× con el tono conservado: pulso aproximado de 142 BPM. Se usa el inicio de la pista, recortado después del ajuste de tempo.
- Fondo musical con objetivo de −29 LUFS antes de la reducción automática. Se atenúa mientras habla el narrador y recupera volumen suavemente en las pausas.
- Entrada musical de 1,25 segundos y salida de 2 segundos.
- Máster con objetivo de −16 LUFS y techo de −2 dBTP antes de comprimir a AAC/MP3.
- Subtítulos opcionales en español que siguen las frases de la locución.

## Regeneración

Requiere Node, FFmpeg/FFprobe y Chrome con Playwright. Los originales se conservan fuera del repositorio. Se eligen explícitamente sus rutas al mezclar; no se descargan ni se envían a un servicio externo.

1. Iniciar el servidor con `node tools/server.cjs`.
2. Definir `MAGDALENO_TRAILER_CONFIG` con la ruta a `tools/trailer-narrado.json` y `MAGDALENO_TRAILER_OUTPUT` con la carpeta de exportación. Ejecutar `node tools/trailer.cjs`.
3. Ejecutar `node tools/mix-trailer-audio.cjs audio <voz> <música> <carpeta>` y luego el mismo comando con `mux` en lugar de `audio`. Las rutas con espacios deben ir entre comillas.
4. Ejecutar `node tools/trailer-audio-check.cjs <carpeta>` y revisar las muestras visuales.
5. Ejecutar `node tools/finalize-trailer.cjs <carpeta>` para actualizar los vídeos, carteles, subtítulos y reproductor de `media/`.

La carpeta de exportación incluye los vídeos narrados, la mezcla WAV/MP3, las pistas de control y los parámetros de mezcla. Solo se publican los vídeos finales, carteles y subtítulos. Las guardas durante la captura impiden mostrar celebración, estado final, prueba final y localización final.
