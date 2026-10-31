# La Leyenda del Magdaleno

## Versión jugable 0.6.1 del capítulo 1

Una aventura de plataformas en pixel art: elige a uno de los cinco amigos, reúne al grupo y llega a la botillería escondida en la montaña para conseguir el Coñac Magdaleno.

La versión 0.6 añade un arma cuerpo a cuerpo por amigo para el ataque básico. Se usa con Z o ARMA, sin costo de energía y con 10 de daño. [Ver las armas](animaciones.html?accion=arma) · [Descripción de cada arma](ARMAS.md).

En la revisión 0.6.1, Marcelo usa un notebook, Pulga una regla de profesor, Tobi un taladro minero y Pallo un fonendoscopio. Los PNG transparentes se encuentran en `assets/armas/`.

La versión 0.4 adapta los menús, diálogos y controles a celulares en vertical y horizontal. Incluye instalación opcional, recursos disponibles sin conexión y un tráiler de 30 segundos en dos formatos. La revisión 0.4.1 retira el desenlace del tráiler. La 0.5 corrige las definitivas: cada poder tiene preparación, acción, impacto y recuperación; las herramientas siguen la mano y el daño ocurre en el contacto o el aterrizaje. El tráiler se capturó de nuevo con los poderes corregidos. [Ver tráiler sin desenlace](trailer.html?v=0.5.0) · [Análisis de animaciones](ANALISIS_ANIMACIONES.md) · [Jugar en celular](movil.html) · [Publicar](PUBLICAR.md).

## Cómo jugar

1. Conserva juntos index.html, styles.css, src y assets.
2. Abre **INICIAR_JUEGO.cmd** o haz doble clic en **index.html**.
3. Elige a Marcelo, Ruzio, Pulga, Tobi o Pallo y pulsa **SALIR DE AVENTURA**.
4. Usa **Enter**, **Espacio** o el botón **SEGUIR** para avanzar los diálogos.

Funciona en el navegador sin instalar paquetes ni conectarse a servicios externos. También puede servirse localmente con Node: desde esta carpeta, ejecutar `node tools/server.cjs` y abrir http://127.0.0.1:4173.

Se ha probado en Chrome en Windows, tanto por HTTP local como abriendo el archivo directamente, y en emulación táctil en seis tamaños de pantalla. La evaluación en Safari y Android físicos queda pendiente. Para abrirlo en otro dispositivo utiliza un enlace publicado; 127.0.0.1 del computador no sirve como dirección del juego en el teléfono.

La instalación y el modo sin conexión necesitan HTTPS o localhost. En Android puedes usar INSTALAR cuando el navegador lo ofrece; en iPhone, Compartir → Agregar a pantalla de inicio. El progreso queda en cada navegador y dispositivo. Consulta [la guía móvil](movil.html).

## Controles

| Acción | Tecla |
|---|---|
| Mover | Flechas izquierda/derecha o A/D |
| Saltar | Espacio, flecha arriba o W |
| Bajar de una plataforma de madera | Abajo o S + Espacio |
| Arma cuerpo a cuerpo | Z; se puede mantener pulsada |
| Definitiva | V, con 100 de energía y desde el suelo |
| Hablar, rescatar o continuar la ruta | E o Enter |
| Avanzar diálogo | Enter o Espacio |
| Pausa | Escape o P |
| Activar/silenciar sonido | M o botón SONIDO |

El salto tiene altura variable: mantener la tecla permite alcanzar más altura. Los avisos de los enemigos indican cuándo conviene saltar o acercarse para golpear.

## Qué contiene esta versión

- Selector de los cinco protagonistas con sus identidades y ropa de referencia.
- Animación por piezas de cabeza, torso, brazos y piernas a partir de los PNG originales.
- Reposo, marcha, salto, ataque con arma, reacción al daño, definitiva y celebración.
- Tres zonas con fondos por capas y terreno dibujado por código: ciudad, carretera y montaña.
- Dos desvíos de plataformas por zona, con latas adicionales y contador de exploración.
- Cable eléctrico, cruce de vehículo y caída de rocas con avisos previos.
- Siete enemigos geométricos, con movimiento, avisos y proyectiles propios.
- Cuatro rescates que se adaptan al protagonista elegido.
- Aliados que se suman visualmente y abren el paso después de su rescate.
- Cinco fichas únicas y latas que dan puntos y energía.
- Carabinero y Matahombres con patrones de ataque y segunda fase.
- Diálogos, intercambio final y celebración de los cinco.
- HUD, pausa, puntos de control, continuación y sonido chiptune sintetizado.
- Menú móvil en vertical y horizontal, botones de 44 píxeles o más, vida y energía legibles y entrada multitáctil.
- Controles debajo del escenario en vertical y a los lados en celulares horizontales.
- Pantalla completa en navegadores compatibles, instalación opcional y caché del juego sin conexión.
- Tráiler horizontal Full HD y vertical de 30 segundos, con música original.

## Definitivas

| Amigo | Definitiva | Efecto |
|---|---|---|
| Marcelo | Pulso de Emergencia | Daña en un área cercana y paraliza enemigos comunes. |
| Ruzio | Martillo del Cerro | Golpea el suelo y alcanza a enemigos bajos en ambos sentidos. |
| Pulga | Clavada del Desquite | Salto de básquet y daño de área al caer. |
| Tobi | Coloso de la Ruta | Crece durante la ejecución y descarga un golpe bestial. |
| Pallo | Sutura Arcana | Hechizo horizontal que recupera vida según el daño realmente infligido. |

La energía se recupera lentamente, acertando golpes y recogiendo latas. Las latas no curan; recuperarás salud al completar un rescate, alcanzar un punto de control o usar la definitiva de Pallo con éxito.

## Rescates y progreso

Empiezas con tu propia ficha. Acércate a un amigo atrapado y pulsa E. Despeja los enemigos del encuentro y golpea el nudo que lo mantiene atrapado. El amigo entrega su ficha y abre el paso correspondiente a su ayuda: tecnología, martillo, palanca, fuerza o magia.

El orden de rescates excluye siempre al protagonista. Hay dos rescates en ciudad, uno en carretera y uno en montaña. Para avanzar de zona debes reunir a los amigos de esa zona y superar el jefe cuando corresponda. Tras el diálogo, el aliado dedica un segundo a abrir el obstáculo: espera a que termine la animación.

Los seis desvíos son opcionales. Se pueden completar con el salto normal de cualquiera de los cinco personajes y volver al camino principal. Dan acceso a más latas; no sustituyen los rescates ni exigen gastar la definitiva. Abajo + Espacio permite atravesar las plataformas de madera hacia abajo. Los avisos amarillos de los peligros son inofensivos hasta que comienza su descarga, cruce o caída.

Las banderas marcan puntos de control. El guardado es automático, local al navegador y utiliza una clave propia, distinta de TIBOXIN. También se guarda al reunir un amigo y después de superar al carabinero.

Al perder toda la salud, vuelves al último punto con 100 de salud y 50 de energía. Las fichas, enemigos vencidos y objetos registrados en ese punto se restauran de forma coherente. **CONTINUAR** carga ese guardado; iniciar una nueva aventura lo reemplaza.

El cierre al amanecer es parte de la historia. No existe un contador que impida explorar.

## Desarrollo por etapas

Consulta [ETAPAS.md](ETAPAS.md) para ver qué se implementó, qué se verificó y qué corresponde al siguiente ciclo de pulido.

Esta es una primera versión jugable. Los escenarios reproducen la dirección visual mediante geometría y capas; las maquetas de imagen no se utilizan como fondos con personajes incrustados. Las animaciones son procedurales y conservan las imágenes de referencia, con espacio para mejorar articulaciones y preparar poses dibujadas a mano.

## Archivos

- index.html y styles.css: interfaz, selector, diálogos y controles.
- src/data.js: personajes, zonas, frases y guion.
- src/core.js: entrada, colisiones, carga de imágenes y audio.
- src/render.js: escenarios, enemigos y animación por piezas.
- src/visuals.js: articulaciones, detalle de escenarios y señales visuales de la versión 0.2.
- src/powers.js: secuencias de las cinco definitivas, herramientas en la mano, instante de impacto, efectos y sonidos propios.
- animaciones.html y src/animation-preview.js: vista comparativa de movimientos, con pausa y velocidad.
- src/game.js: campaña, combate, rescates, jefes, pausa y guardado.
- src/chapter.js: desvíos, escalones, peligros y apertura animada de pasos.
- src/soundtrack.js: melodías e instrumentos por zona y variaciones de jefe.
- mobile.css y src/mobile.js: interfaz móvil, estado legible, orientación, pantalla completa e instalación.
- manifest.webmanifest y sw.js: instalación y recursos del juego sin conexión.
- trailer.html y media: reproductor, dos vídeos, carteles y subtítulos opcionales.
- PUBLICAR.md, vercel.json y .github/workflows/pages.yml: opciones de publicación estática.
- tools/build-web.cjs: prepara la carpeta dist sin herramientas ni evidencias de QA.
- assets: siete PNG de personajes y jefes, más sus límites de dibujo.
- DISENO.md: documento narrativo de referencia.
- ANIMACIONES.md y animaciones: atlas de poses exportadas y datos de cada frame.
- qa: informes y capturas de las pruebas.
- tools: servidor local opcional y scripts de verificación de desarrollo.

## Verificación realizada

- Entrada real de teclado: movimiento, salto, pausa y definitiva.
- Campaña de cada uno de los cinco protagonistas: cuatro rescates, cinco fichas únicas, ambos jefes, segunda fase y final.
- Recorrido de plataformas de las tres zonas usando movimiento y salto.
- Curación de Pallo, retorno al tamaño normal de Tobi y definitiva inválida en el aire.
- Derrota, punto de control, continuación después del final y guardados inválidos.
- Apertura directa de index.html sin servidor.

Las pruebas de campaña aceleran el desplazamiento con una interfaz de QA y usan invulnerabilidad para aislar la lógica de los encuentros. Las pruebas de plataformas desactivan daño de enemigos y abren los pasos de rescate para comprobar únicamente la transitabilidad. No sustituyen una evaluación humana de dificultad, ritmo y comodidad.

Los scripts de navegador usan Playwright del entorno de desarrollo local. El juego distribuido no depende de Playwright.

En la versión 0.3 se completó una partida automatizada con cada uno de los cinco protagonistas usando controles normales y daño activo. Se acelera el reloj de simulación y se avanza el diálogo automáticamente, sin teletransporte ni invulnerabilidad. También se comprobaron los 30 recorridos opcionales (seis por personaje), los avisos y el daño de cada peligro, la ayuda de los cinco aliados y las variaciones musicales. Los controles táctiles se probaron mediante emulación de Chrome con dos dedos simultáneos; queda pendiente el dispositivo físico.

En la versión 0.4 se probaron seis resoluciones táctiles: selección de los cinco protagonistas, diálogos, movimiento + salto + golpe simultáneos, liberación de controles, pausa y reanudación. Se comprobó la recarga del juego sin conexión después de instalar el service worker. Las cinco campañas y la apertura local siguen pasando sus pruebas.

## Créditos técnicos

El núcleo de colisión por bloques y las ideas de paso fijo, coyote time y buffer de salto se adaptaron del archivo aportado **tiboxin_corregido.html**. La campaña del Magdaleno, interfaz, personajes, animación por piezas, enemigos, jefes, escenarios y guardado son una adaptación nueva. Los archivos originales de TIBOXIN se conservaron.

Los PNG de amigos y jefes proceden de los recursos generados y aprobados en este proyecto. El código dibuja las piezas de los PNG mediante recortes de origen en Canvas; no modifica los archivos originales. El audio se sintetiza en el navegador.

