# Desarrollo por etapas

## Etapa 1: base jugable de ciudad

Estado: implementada y probada.

- [x] Proyecto nuevo separado de los archivos de referencia.
- [x] Canvas de 960 × 540 y colisión por bloques de 45 píxeles, derivados de TIBOXIN.
- [x] Movimiento, salto variable, coyote time y buffer de salto.
- [x] Marcelo, puñetazo, pulso tecnológico, energía y latas.
- [x] Factura y teléfono enemigos.
- [x] Diálogo y rescate.
- [x] Animación por piezas conservando cara, barba y ropa.
- [x] Prueba con teclado real y captura del navegador.

## Etapa 2: campaña y elenco

Estado: implementada y probada.

- [x] Selector de cinco amigos y cinco definitivas.
- [x] Cuatro rescates variables según la elección.
- [x] Acompañamiento y pasos bloqueados hasta rescatar al aliado.
- [x] Ciudad, carretera y montaña con fondos por capas.
- [x] Catálogo completo de siete enemigos.
- [x] Cinco fichas únicas, latas y puntos de control.
- [x] Guardado local, continuación y recuperación tras derrota.

## Etapa 3: jefes y cierre del capítulo

Estado: implementada y probada.

- [x] Carabinero: escudo, silbato, formularios y conos.
- [x] Matahombres: manotazo, botellas, ondas y salto.
- [x] Segunda fase y diálogo de mitad de combate en ambos jefes.
- [x] Condiciones para reunir al grupo y entrar a la prueba final.
- [x] Intercambio de fichas, elixir, celebración y remate.
- [x] Sonido chiptune sintetizado y controles de pausa/sonido.
- [x] Campaña completa verificada con las cinco selecciones.

## Etapa 4A: pulido visual y animaciones

Estado: implementada y probada en la versión 0.2. Se priorizó aspecto visual y animaciones según la última elección del usuario.

- [x] Articular codos, rodillas y tobillos; compensar el apoyo de los pies al caminar.
- [x] Separar preparación, impacto y recuperación del puñetazo.
- [x] Diferenciar subida, caída y amortiguación al aterrizar.
- [x] Mejorar fachadas, luces, montañas, bosque y materiales del suelo.
- [x] Añadir una marca discreta al protagonista cuando viaja con aliados.
- [x] Mostrar brevemente la resistencia de enemigos golpeados y la cifra del impacto.
- [x] Exportar 20 poses base por amigo y 23 para Tobi.
- [x] Crear una vista de animaciones con pausa y control de velocidad.
- [x] Revisar la legibilidad de los cinco rostros y su ropa desde los PNG de referencia.
- [x] Completar una partida automatizada con controles normales, daño activo y recuperación normal de energía.
- [x] Revalidar las cinco selecciones, las plataformas y la apertura desde archivo local.

## Etapa 4B: recorridos, peligros y ayudas

Estado: implementada y probada en la versión 0.3.

- [x] Seis desvíos opcionales y escalones que varían cada zona.
- [x] Recompensas en rutas altas y contador de exploración.
- [x] Peligros anunciados: descarga, cruce y caída de rocas.
- [x] Descenso de plataformas con teclado y dos dedos en emulación táctil.
- [x] Apertura de pasos durante la ayuda animada de los cinco aliados.
- [x] Melodías, armonías e instrumentos por zona y variaciones de jefe.
- [x] Campañas completas con los cinco protagonistas usando controles normales y daño activo.
- [x] Treinta recorridos opcionales comprobados: seis por personaje.

## Etapa 5: móvil y tráiler

Estado: implementada y probada en la versión 0.4.

- [x] Menú adaptable y diálogos utilizables en vertical y horizontal.
- [x] Controles táctiles grandes fuera del escenario, con etiquetas y respuesta visual.
- [x] Movimiento, salto y ataque simultáneos, pausa y cambio de orientación.
- [x] Vida y energía legibles en pantallas verticales.
- [x] Instalación opcional y recarga sin conexión comprobada en Chrome.
- [x] Tráiler de 30 segundos en horizontal y vertical con música original.
- [x] Reproductor con descargas y guía para jugar en celular.
- [x] Exportación estática y configuración de GitHub Pages y Vercel.

## Etapa 6: definitivas

Estado: implementada y medida en la versión 0.5.

- [x] Puntos de agarre: martillo, balón y dispositivo comparten la transformación de la mano.
- [x] Secuencia común de preparación, acción, impacto y recuperación, con evento de daño propio por poder.
- [x] Ruzio y Pulga: contacto del martillo y aterrizaje de la clavada en el mismo paso del daño.
- [x] Tobi, Marcelo y Pallo: poses propias, transferencia de peso, uso del objeto y recuperación.
- [x] Efectos y sonidos propios, estela del golpe y pausa de impacto breve.
- [x] Ayudas de rescate con la misma secuencia del poder.
- [x] Vista de animaciones con definitiva real, avance cuadro a cuadro y ambos sentidos.
- [x] Auditoría automática con criterios de aceptación en ambos sentidos.
- [x] Capturar de nuevo el tráiler con las animaciones corregidas.
- [ ] Revisar la lectura de los poderes en un celular físico.

## Siguiente ciclo de acabado

- [ ] Evaluar dificultad y ritmo mediante partidas humanas y ajustar el balance.
- [ ] Incorporar tiles dibujados específicamente para el juego si se busca un acabado artístico más elaborado.
- [ ] Probar controles táctiles en un dispositivo físico y afinar botones y saltos.
- [ ] Añadir manos y poses exclusivas más detalladas para las definitivas.

## Evidencias

- [Prueba inicial](qa/smoke.json).
- [Campañas y casos de continuidad](qa/verificacion_completa.json).
- [Recorridos de plataformas](qa/recorridos.json).
- [Selector](qa/01_selector.png).
- [Ciudad](qa/03_ciudad_rescates.png).
- [Carretera](qa/04_carretera.png).
- [Montaña](qa/05_montana.png).
- [Interfaz compacta](qa/06_selector_compacto.png).
- [Rescate](qa/07_rescate.png).
- [Vista de animaciones](animaciones.html).
- [Pruebas del pulido visual](qa/pulido_visual.json).
- [Partida automatizada sin ayudas de combate](qa/partida_sin_ayudas.json).
- [Captura de las animaciones](qa/10_vista_animaciones.png).
- [Recorridos opcionales](qa/rutas_opcionales.json).
- [Peligros, ayudas y música](qa/mecanicas_capitulo.json).
- [Controles táctiles emulados](qa/controles_tactiles.json).
- [Adaptación móvil en seis resoluciones](qa/mobile.json).
- [Ver tráiler](trailer.html).
- Partidas normales: [Marcelo](qa/partida_marcelo_sin_ayudas.json), [Ruzio](qa/partida_ruzio_sin_ayudas.json), [Pulga](qa/partida_pulga_sin_ayudas.json), [Tobi](qa/partida_tobi_sin_ayudas.json), [Pallo](qa/partida_pallo_sin_ayudas.json).

Los informes de QA documentan las ayudas utilizadas para aislar sistemas. La prueba adicional de partida usa controles normales y un reloj acelerado; no utiliza invulnerabilidad, teletransporte ni cambios de salud o energía, y omite la espera entre líneas de diálogo. No sustituye la evaluación humana de dificultad. Las capturas son del juego ejecutándose en el navegador.
