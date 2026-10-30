# Cambios de versión

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
