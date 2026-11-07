# Desarrollo por etapas

## Correcciones del QA de producción · 0.9.1

- [x] Hallazgos del QA sobre 0.9.0 corregidos; el detalle está en CAMBIOS.md.
- [x] Prueba de regresión en `tools/qa-091-check.cjs`.
- [ ] Prueba con personas y teléfonos físicos.

## Capítulo jugable 3: La Bajada de Buenos Aires · 0.9.0

- [x] Recorrido lateral en scooters, tres carriles, salto, freno y obstáculos.
- [x] Dos rescates aleatorios entre los otros cinco amigos, Coté incluida; sorteo y rescates persistentes.
- [x] Bajada final más rápida, autos que no se saltan y llegada a El Muñeco.
- [x] Trueque con la Vieja Califa: tres scooters por el Magdaleno, con guardado del cierre.
- [x] Continuación desde la etapa 2 y guardado propio. [Jugar](etapa3.html?v=0.9.0) · [Diseño y controles](ETAPA_3.md).
- [x] Confirmado: scooters eléctricos de pie y dos compañeros al azar, con Coté como opción del sorteo.
- [x] Cierre acordado: almacenera misteriosa y teatral con ropa común, dificultad intermedia, ayudas automáticas por amigo y recibo «Ahora me deben un favor».
- [x] Aplicados el aspecto de almacenera, las seis ayudas automáticas, el recibo sospechoso y «Continuará…».
- [x] Recorrido ampliado a 5200 m, unos 148 segundos limpios, con migración del guardado antiguo.
- [x] Comprobadas las ayudas y su recuperación, las cinco campañas y el recibo en seis tamaños emulados.
- [ ] Prueba humana de dificultad y revisión en teléfonos físicos.
- [x] Integrada en la entrega 0.9.0 para GitHub Pages, con autorización del usuario para hacer push.

## Capítulo jugable 2: la camanchaca de Parral (0.8.0)

- [x] Nuevo final del capítulo 1: el Magdaleno se agotó y el Matahombres cerró.
- [x] Persecución frontal de 2100 metros con tres carriles, salto, obstáculos y puntos de control.
- [x] Coté como sexta amiga de apoyo: grito que hace retroceder la niebla y da seis segundos de respiro.
- [x] Reencuentro de los seis frente a El Vecino, sin compra de licor y con cierre para la etapa 3.
- [x] Tacto, pausa al girar/salir, guardado propio y apertura offline.
- [x] Refugio bajo el acoplado del camión confirmado. Coté combina carácter y dulzura; su frase actual es «CORREEEE!!».
- [ ] Primera sesión humana de balance y prueba en teléfonos físicos.

Los rótulos «Etapa 1/2/3» de las secciones históricas siguientes describen hitos de desarrollo del primer capítulo, no niveles de la campaña. La narrativa y el recorrido del segundo capítulo están en [ETAPA_2.md](ETAPA_2.md).

## Etapa 8: celular como plataforma principal (0.7.0)

- [x] Escenario horizontal a todo el ancho, HUD compacto y zonas para dos pulgares.
- [x] Menú en vertical y pausa con indicación para girar durante la partida.
- [x] Cámara que acompaña los saltos a plataformas altas.
- [x] Salto seguido de arma con dos pulgares, buffer de ataque y descenso de un toque.
- [x] AYUDAR y BAJAR contextuales; iconos en lugar de teclas de escritorio.
- [x] Aviso fiable cuando falla el almacenamiento.
- [x] Jefes WebP sin pérdida y menos dibujo de elementos invisibles.
- [x] Instalación guiada, offline y continuidad del guardado al actualizar.
- [ ] Sesión de comodidad y rendimiento en Android e iPhone físicos.

Las pruebas automatizadas no sustituyen la validación física ni una evaluación de dificultad con personas nuevas.

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
- [x] Intercambio de fichas y remate; desde 0.8.0 descubre que no queda stock y enlaza con Parral.
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

Los reportes y capturas quedan en la carpeta local `qa/`, que no se publica.

- Prueba inicial.
- Campañas y casos de continuidad.
- Recorridos de plataformas.
- Selector.
- Ciudad.
- Carretera.
- Montaña.
- Interfaz compacta.
- Rescate.
- [Vista de animaciones](animaciones.html).
- Pruebas del pulido visual.
- Partida automatizada sin ayudas de combate.
- Captura de las animaciones.
- Recorridos opcionales.
- Peligros, ayudas y música.
- Controles táctiles emulados.
- Adaptación móvil en seis resoluciones.
- [Ver tráiler](trailer.html).
- Partidas normales: Marcelo, Ruzio, Pulga, Tobi, Pallo.

Los informes de QA documentan las ayudas utilizadas para aislar sistemas. La prueba adicional de partida usa controles normales y un reloj acelerado; no utiliza invulnerabilidad, teletransporte ni cambios de salud o energía, y omite la espera entre líneas de diálogo. No sustituye la evaluación humana de dificultad. Las capturas son del juego ejecutándose en el navegador.
