# Cambios de versión

## 0.5: definitivas corregidas

Aplica el plan de [ANALISIS_ANIMACIONES.md](ANALISIS_ANIMACIONES.md).

- Base común nueva en `src/powers.js`: cada definitiva es una secuencia de poses clave con preparación, acción, impacto y recuperación, interpolada con aceleración y frenado.
- El daño ocurre en el instante de impacto propio de cada poder, no en un porcentaje común.
- Martillo, balón y dispositivo se dibujan con la misma transformación de la mano: no pueden separarse de ella. Pasan por detrás de la cabeza por orden de capas.
- Ruzio levanta el martillo por detrás, lo descarga con aceleración y la cabeza toca el suelo en el mismo paso del daño. La onda nace en el punto de contacto y alcanza a cada objetivo según su distancia.
- Pulga salta de verdad: su posición física sube hasta 110 px, se adapta al espacio libre sobre la cabeza y el daño ocurre al aterrizar, con el balón contra el suelo.
- Tobi se agacha, crece por pasos de 1/16 con aceleración y frenado, levanta ambos brazos, salta y golpea al aterrizar.
- Marcelo sujeta el dispositivo, la pantalla se carga y el pulso nace del aparato. La otra mano queda en la cadera.
- Pallo se concentra, apunta y el hechizo nace de su palma. Si cura, el hilo vuelve en verde con la vida recuperada; si no acierta, vuelve en gris.
- Efectos y sonidos propios por poder, estela del golpe y pausa de impacto breve en los golpes pesados.
- Las ayudas de rescate reutilizan la misma secuencia y herramienta; Tobi empuja el bloque.
- Vista de animaciones con «Definitiva» real, avance cuadro a cuadro, velocidad hasta 0,1×, ambos sentidos y marcadores de agarre e impacto.
- Auditoría automática con criterios de aceptación y secuencias nuevas en `auditoria_animaciones`.

Cambian los tiempos de impacto: Marcelo 0,42 s, Ruzio 0,56 s, Pulga 0,92 s, Tobi 0,92 s y Pallo 0,44 s. La clavada de Pulga golpea más tarde que antes (0,65 s), porque ahora espera el aterrizaje. Daño, radio, costo y duración total se mantienen. El esquema de guardado sigue siendo 1.

El tráiler 0.4.1 todavía muestra las animaciones anteriores.

## 0.4.1: revisión de animaciones y tráiler sin desenlace

- Análisis de brechas de los poderes, con secuencias y mediciones obtenidas del motor real.
- Plan de corrección de agarres, poses propias y sincronización del impacto. Las animaciones todavía conservan su implementación anterior.
- Retirada del desenlace del tráiler, tanto en horizontal como en vertical. El montaje conserva el misterio de la búsqueda.
- Protección en el generador para rechazar cuadros de la celebración, la prueba final y su localización.

## 0.4: celular y tráiler

- Selector de personajes y diálogos adaptados a pantallas verticales y horizontales.
- Botones táctiles con etiquetas y estado pulsado; entrada simultánea para moverse, saltar y golpear.
- Controles fuera del escenario: debajo en vertical y a los lados en celulares horizontales.
- Indicadores móviles legibles de vida, energía y amigos reunidos; aviso de definitiva lista.
- Pausa al cambiar de orientación y pantalla completa cuando el navegador la admite.
- Manifest, iconos e instalación opcional; recursos del juego disponibles sin conexión después de la primera carga compatible.
- Tráiler de 30 segundos en 1920×1080 y 1080×1920, con música chiptune original, reproductor y subtítulos opcionales.
- Configuración de Vercel y GitHub Pages, y exportación de web estática.

El esquema de guardado sigue siendo 1. Se verificaron seis tamaños en emulación táctil de Chrome, entrada con tres dedos, pausa, recarga sin conexión y las cinco campañas. No se ha realizado una prueba en teléfonos físicos.

## 0.3: recorridos, peligros y ayudas

- Seis desvíos opcionales: azoteas y pasaje en ciudad, paradero y cerco en carretera, mirador y pinos en montaña.
- Escalones y encuentros adicionales que diferencian los recorridos.
- Latas de recompensa en las rutas altas y contador de desvíos visitados.
- Descarga eléctrica, vehículo y rocas con aviso previo; se detienen al pausar.
- Abajo + Espacio para descender de las plataformas de madera, con botón táctil de bajada.
- Un segundo de ayuda visible de cada aliado antes de abrir su obstáculo.
- Tres melodías de zona con armonía, arpegios y percusión, y variaciones durante ambas fases de los jefes.
- Avisos de salto y descenso al encontrar los primeros escalones y plataformas.

Se mantiene el esquema de guardado 1 y la longitud de las zonas. Las partidas anteriores pueden continuar; el guardado sigue ocurriendo en los puntos de control.

### Verificación

- Los cinco protagonistas completaron partidas automatizadas con daño activo, sin teletransporte ni invulnerabilidad.
- Los seis desvíos se recorrieron y abandonaron con cada personaje usando movimiento y salto normales; se aislaron enemigos y peligros para comprobar la geometría.
- Avisos inofensivos, daño activo y pausa de los tres tipos de peligro.
- Pasos cerrados durante la ayuda y abiertos al terminarla, para los cinco aliados.
- Bajar de plataformas con teclado y con dos dedos en emulación táctil de Chrome.
- Melodías distintas en las tres zonas y aceleración en la segunda fase de los jefes.

Estas pruebas aceleran el reloj y omiten las esperas de diálogo. Quedan para una sesión humana el balance y el ritmo, y para un dispositivo físico la comodidad táctil.

## 0.2: aspecto visual y animaciones

- Marcha con caderas, rodillas, tobillos, hombros y codos articulados.
- Puñetazo con preparación, impacto y recuperación.
- Poses de subida y caída, amortiguación visual del aterrizaje y pequeñas partículas de apoyo.
- Sombras discretas bajo los personajes y marcador del protagonista cuando viaja con aliados.
- Fachadas más detalladas, ventanales, persianas, postes y luz de calle por capas.
- Carretera con aspecto más rural, paraderos y cercos; bosque y montañas con más detalle.
- Materiales diferenciados para vereda, carretera, piedra, vegetación y madera.
- Resistencia visible brevemente en los enemigos golpeados y cifra del impacto.
- Atlas de 20 poses por amigo y 23 para Tobi, con metadatos actualizados.
- Vista de animaciones independiente: reposo, marcha, salto, golpe, preparación y celebración.

Los rostros y la ropa proceden de los mismos PNG. La distribución del nivel, las colisiones, la salud y los costos de energía conservan sus valores. El guardado utiliza el mismo esquema de la versión 0.1.

### Verificación

- Prueba de entrada real de teclado, salto, pausa y definitiva.
- Campaña automatizada con cada uno de los cinco personajes.
- Recorrido de plataformas en las tres zonas.
- Partida adicional de Marcelo con controles normales y daño activo, sin teletransporte ni invulnerabilidad.
- Vista de animaciones en escritorio, pantalla compacta y archivo local.

La partida automatizada omite la espera en diálogos y acelera el reloj; su duración no representa el tiempo esperado para una primera partida humana.

## 0.1: primera versión jugable

Selector de cinco protagonistas, tres zonas, cuatro rescates, siete enemigos, ambos jefes con segunda fase, definitivas, latas, fichas, guardado, diálogos y final.
