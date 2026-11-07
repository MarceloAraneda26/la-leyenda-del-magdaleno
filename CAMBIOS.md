# Cambios de versión

## 0.9.2: campaña lineal · 7 de noviembre de 2026

- Completar la etapa 1 desbloquea la 2; completar la 2 desbloquea la 3. El cierre del trueque completa la campaña.
- Menú de progreso con etapas disponibles y bloqueadas. Los enlaces directos y el inicio del motor respetan el mismo requisito.
- Registro de desbloqueos independiente de los puntos de control: repetir una etapa anterior no vuelve a bloquear las siguientes.
- Reconocimiento de partidas anteriores válidas, sin reescribirlas; respaldo en la sesión si no se puede guardar permanentemente. Actualización entre pestañas.
- Recursos de campaña incluidos en la caché sin conexión y en el paquete de publicación.
- Prueba dedicada de progresión, bloqueo, migraciones, pantallas móviles y funcionamiento sin conexión en `tools/campaign-check.cjs`. Las pruebas de etapas aisladas declaran sus etapas previas como completadas mediante una preparación exclusiva de las herramientas.

## 0.9.1: correcciones del QA de producción · 6 de noviembre de 2026

- Etapa 1 más liviana: los dos jefes pasan de 1,18 MB a 82 KB en total, reducidos a 512 px y con sus límites recalculados.
- Despertador: su pulso sale desde el primer salto, de modo que quedarse quieto golpeando ya no lo vence sin daño.
- Bajada de Buenos Aires: tres de cada cuatro filas bloquean dos carriles. Quedarse quieto deja de ser una estrategia viable y los errores normales se siguen perdonando.
- Etapa 3 sin deformación en pantallas altas (tablets y ventanas 4:3), suelo completo en la escena final y aviso «NECESITA UNA MANO» fuera del escenario, para no tapar las caras.
- Empezar de cero pide un segundo toque si hay avance guardado; el logo pausa la partida en lugar de salir sin aviso; el sonido recuerda la elección.
- Una ventana angosta de computador ya no pide girar el celular ni muestra controles táctiles.
- Modales accesibles en pantallas bajas: «Volver a elegir protagonista» ya no queda bajo el borde.
- Guía única para las tres etapas (movil.html), en lugar de un Markdown sin formato; el tráiler avisa cuando no hay conexión e incluye el mini tráiler de la etapa 2.
- Textos: sin «· E» en pantallas táctiles y «Usa el GRITO», válido para teclado y táctil. Enlaces a evidencias locales retirados de ETAPAS.md. Ícono de iPhone en la etapa 3.
- Pendientes las pruebas humanas y en teléfonos físicos. El balance se calibró con jugadores simulados.

## 0.9.0: tres etapas y cierre de Buenos Aires · 6 de noviembre de 2026

- Incluye la etapa 3 completa: scooters, dos rescates aleatorios, seis ayudas automáticas y cierre con la Vieja Califa.
- Integra la cámara frontal corregida de la etapa 2, mayor escala de Coté y su nueva frase «CORREEEE!!».
- Actualiza ambos mini tráilers de la etapa 2 con esos cambios y conserva el desenlace oculto.
- Caché y referencias de recursos 0.9.0. Se conservan los guardados de las primeras etapas y se migran los de la primera versión local de scooters.
- Preparación y publicación mediante el flujo existente de GitHub Pages, autorizadas por el usuario. Las pruebas humanas en teléfonos físicos siguen pendientes.

## Etapa 3 · cierre local 2 · 6 de noviembre de 2026

- Recorrido de 5200 m, unos 2 minutos y 28 segundos limpios, con dificultad orientada a intermedia y seis puntos de control.
- Seis ayudas automáticas según la personalidad del amigo rescatado, con recuperación propia y sin botones nuevos.
- Los acompañantes siguen la trayectoria recorrida al cambiar de carril y saltar. Sonidos suaves de rodadura y freno.
- La Vieja Califa lleva ropa común de almacenera y mantiene una mirada inquietante. Después del trueque entrega el recibo «Ahora me deben un favor»; cierre «Continuará…».
- Formato de guardado 2 y migración de las partidas locales previas, sin modificar los guardados de las etapas 1 y 2.
- Cinco campañas completas, seis ayudas y seis tamaños emulados comprobados. Pendientes las pruebas humanas y en teléfonos físicos. Sin despliegue a producción.

## Etapa 3 preparada en local: scooters y Buenos Aires · 6 de noviembre de 2026

- Recorrido lateral jugable de 2600 m desde la falta de stock en El Vecino hasta El Muñeco, con bajada final, autos, hoyos y obras.
- Dos compañeros sorteados entre los otros cinco del grupo, con Coté incluida. Dos paradas para liberarlos; cada uno acompaña en su propio scooter. El sorteo y los rescates se mantienen al reintentar.
- Cambios de carril, salto con el scooter y freno mantenido. Los autos no se pueden saltar. Tres golpes hacen volver al último cruce.
- La Vieja Califa propone entregar los tres scooters por el Coñac Magdaleno. Se puede aceptar el trueque y conservar el cierre al continuar.
- Guardado independiente, controles táctiles, pausa al girar/salir, recursos offline y continuación desde la etapa 2. Primera versión local, sin publicación; arte de la vendedora provisional y balance humano pendiente.
- Postura de scooter corregida: codos debajo de los hombros, dos brazos visibles delante del torso y puños cerrados sobre el manillar. El agarre se conserva en la bajada, el salto y la reacción a un golpe.

## Corrección preparada: carrera hacia la cámara y escala de Coté · 6 de noviembre de 2026

- La calle, las fachadas y los obstáculos se alejan hacia el horizonte, coherentes con una cámara que retrocede delante del corredor. Antes se acercaban desde el fondo y daban la impresión de avanzar hacia arriba.
- Se reserva suelo delante de los pies para anticipar los obstáculos que entran por abajo; la colisión coincide con su paso por los pies. Los avisos, carriles y reglas conservan sus tiempos.
- Coté pasa de aproximadamente el 41 % del tamaño del protagonista en el tráiler vertical al 88 %, con espacio para los brazos y las ondas del grito.
- Ambas exportaciones de 10 segundos se regeneraron sin mostrar el cierre. La corrección está en los archivos locales y aún no se ha desplegado.
- La frase de Coté cambia a «CORREEEE!!» en el juego y en ambos formatos del mini tráiler.
- Prueba de cámara en cuatro formatos, cinco carreras completas y controles táctiles en seis tamaños emulados. Pendiente validar la comodidad con personas en teléfonos físicos.

## 0.8.3: letreros de Parral y mini tráiler · 6 de noviembre de 2026

- El letrero de cada botillería se mantiene sobre su fachada. Antes, al acercarse, se estiraba como una barra verde sobre la calle.
- Mini tráiler de 10 segundos de la etapa 2, horizontal y vertical, sin mostrar el cierre.

## 0.8.2: la camanchaca aprieta · 6 de noviembre de 2026

- La niebla avanza más rápido y acelera durante la carrera. Los cruces recuperan la resistencia, pero ya no la alejan: sin el grito de Coté, alcanza al jugador.
- Personas durmiendo también en la calle central, donde no se pueden saltar. Quedarse en el centro saltando ya no termina la carrera.
- Escena final a mayor tamaño en celular horizontal, con el suelo hasta los bordes y las ruedas del acoplado unidas al chasis.
- En celular, el menú de Parral muestra los controles táctiles y el botón de inicio se ve sin desplazar en 320×568 y 360×640.
- El menú ya no dice «Corre hacia la cámara», porque los obstáculos llegan desde el fondo junto con la niebla.
- `runner-check` comprueba que esquivar sin gritar y saltar sin cambiar de carril pierdan, y que esquivar y gritar gane.
- Caché 0.8.2 y mismo esquema de guardado. Balance simulado con bots; queda pendiente la prueba con personas y en teléfonos físicos.

## 0.8.1: el acoplado y el carácter de Coté

- El refugio final está bajo un semirremolque articulado, con bogie trasero, enganche y tractocamión diferenciado. Los seis amigos se reúnen bajo el chasis del acoplado.
- Coté usa «¡POR LA MIERDA!» al incorporarse y al frenar la camanchaca. Después del grito, sus frases de apoyo muestran su lado dulce y protector.
- Las intervenciones de Coté ceden ante los avisos de obstáculos y peligro.
- Los tres carriles, el salto y la ayuda de Coté quedan confirmados. Se conserva el guardado de ambas etapas.

## 0.8.0: la camanchaca de Parral · 5 de noviembre de 2026

- Nuevo final de la etapa 1: el licor se agotó, el Matahombres cerró y los cinco bajan a Parral. Se retiran la botella, los vasos y el brindis de esa escena.
- Etapa 2 jugable con cámara frontal, carrera automática por tres carriles y elección de los cinco protagonistas.
- Hoyos, caca de perro y personas durmiendo que se esquivan; las botillerías intermedias tienen las cortinas cerradas.
- Coté se incorpora con su sprite de referencia. Su grito hace retroceder la camanchaca y la frena seis segundos, con recuperación de 22 segundos.
- Cuatro cruces de control, pausa, reintento y guardado independiente. Se conserva la partida de la etapa 1.
- Reencuentro de los seis bajo un camión, frente a «El Vecino». La compra del licor queda pendiente para la etapa 3.
- Caché 0.8.0 con recursos de ambas etapas. Controles y orientación comprobados en Chrome con emulación táctil; queda pendiente probar el balance y teléfonos físicos.

## 0.7.1: patrulleros humanoides

- Los siete objetos pequeños se convierten en esbirros humanoides de masilla: máscaras agrietadas, hombros, puños, rodillas y botas. Miden de 86 a 96 píxeles frente a los 94 píxeles visibles del protagonista.
- Cada tipo conserva su tema mediante emblemas y accesorios: factura, teléfono, carpeta, moneda, correo, reloj y despertador.
- Marcha articulada, guardia, preparación, golpe/lanzamiento, recuperación y reacción al daño. Los proyectiles salen de la mano al extender el brazo; el puño de la Carpeta solo daña durante el contacto activo.
- Cajas de colisión adaptadas al cuerpo. Los patrulleros de papel caminan y se detienen antes de los bordes de las plataformas; los disparos siguen bloqueados fuera de pantalla.
- Caché compartida y limitada de posturas para reutilizar los sprites articulados y reducir el dibujo repetido en celular.
- Tráiler narrado capturado de nuevo con los diseños nuevos en ambos formatos, conservando la narración, la mezcla y las guardas del desenlace.
- Caché offline 0.7.1 y esquema de guardado 1: la actualización conserva el progreso.

## Tráiler narrado · 3 de noviembre de 2026

- Nuevo montaje de 45 segundos para la locución aportada: voz a velocidad natural, con sus pausas completas.
- Fondo musical a 0,92× conservando el tono, con entrada/salida suave y reducción automática bajo la voz.
- Exportaciones Full HD 1920×1080 y 1080×1920 a 30 fps, audio estéreo de 48 kHz y subtítulos sincronizados con la narración.
- Se conservan las guardas por cuadro para no mostrar el desenlace, la recompensa ni la localización final. El juego sigue en 0.7.0.

## 0.7.0: el celular es la plataforma principal

- Partida horizontal que usa todo el ancho disponible, con HUD compacto y controles junto a los pulgares. El menú admite vertical; girar o salir de la aplicación pausa la partida.
- Cámara vertical que acompaña los saltos y las rutas altas. Los emisores consideran también las zonas reservadas a los controles.
- Cinco controles permanentes con iconos: izquierda, derecha, salto, arma y definitiva. AYUDAR aparece cerca de interacciones; BAJAR aparece sobre plataformas y funciona con un toque.
- Un pequeño margen al soltar el salto permite tocar después ARMA con el mismo pulgar. Las pulsaciones del arma tienen un buffer de 0,14 s para no perder una orden al terminar la recuperación.
- Ayuda inicial breve y botón de instalación con indicaciones cuando el navegador no ofrece su propio diálogo.
- Corregido GUARD-001: si el navegador rechaza el guardado, ya no se anuncia éxito. La pausa aclara que la partida está solo en memoria.
- Jefes en WebP sin pérdida: 1 181 626 bytes en lugar de 1 726 237 (31,5 % menos). Se conservan los PNG originales y sus dimensiones.
- Se omite decoración completamente fuera de pantalla y se limita el redibujado del menú/diálogo/pausa móvil a cuatro veces por segundo. La física y la partida mantienen su paso de 60 Hz.
- Caché offline 0.7.0 y mismo esquema de guardado 1. La actualización desde 0.6.4 conserva la partida.
- El build publica también ETAPAS.md y PUBLICAR.md para resolver los enlaces del README.

Las pruebas táctiles usan Chrome emulado. La comodidad, audio y rendimiento en Android/iPhone físicos siguen pendientes de una prueba en esos dispositivos.

## 0.6.4: cámara y pantalla (etapa 1 de la auditoría)

- Facturas, Correos y Teléfonos solo cargan, avisan y disparan cuando se ven en pantalla. En celular vertical se respeta el recorte de la escena; antes podían atacar desde fuera de la vista (MOV-001).
- En escritorio el juego, la cabecera y la barra de controles caben sin desplazar en 1366x768 (UI-002).
- En celulares bajos en vertical (320x568, 360x640) el menú se compacta y «SALIR DE AVENTURA» se ve sin desplazar (UI-001).
- En horizontal bajo ya no hay desplazamiento vertical: lo causaba el texto oculto para lectores de pantalla (UI-003).

## 0.6.3: correcciones rápidas

- En celular vertical, las indicaciones («E · AYUDAR A…», «DESPEJA A LOS ENEMIGOS») y los avisos se muestran en texto legible sobre la escena, en lugar de dibujarse a 6 o 7 px dentro del lienzo.
- La barra del celular vuelve a mostrar los desvíos visitados, junto a los puntos.
- Tocar cualquier parte del cuadro de diálogo avanza a la línea siguiente.
- La definitiva explica el motivo correcto cuando no se puede usar: falta de energía, estar en el aire o recuperarse de un golpe.
- La Carpeta Mordedora ya no vibra cuando está quieta en su lugar.
- Tráiler capturado de nuevo con las armas del ataque básico.

## 0.6.2: celular en vertical más limpio

- En vertical, la partida muestra un recorte más cercano del escenario: la escena se ve un 45 % más grande y la cámara deja más espacio por delante del protagonista.
- El marcador interno del lienzo queda fuera del recorte; la barra superior muestra vida, energía, amigos y puntos.
- Durante la partida y los diálogos se ocultan los textos de ayuda y los enlaces CELULAR, TRÁILER y GUÍA. Vuelven en el menú y en la pausa.
- Botones táctiles más grandes en vertical (64 × 58 y 68 × 58 px).
- En celulares angostos, la cabecera muestra solo la marca M para no ocupar dos líneas.
- Los aliados ya no quedan flotando: cada uno busca su propio suelo.
- Horizontal y escritorio no cambian, salvo el arreglo de los aliados.

## 0.6.1: armas personalizadas

- Marcelo usa un PC notebook con pantalla y teclado.
- Pulga usa una regla de profesor con graduaciones.
- Tobi usa un taladro minero con broca de acero.
- Pallo usa un fonendoscopio con tubo flexible.
- PNG transparentes individuales en `assets/armas/`, exportados desde los dibujos del juego.
- Se revisaron el agarre y el barrido del daño en ambos sentidos.

## 0.6: armas para el ataque básico

- Llave tecnológica de Marcelo, martillo de campo de Ruzio, bastón de cancha de Pulga, bomba de bicicleta de Tobi y bastón médico arcano de Pallo.
- Armas visibles al caminar y saltar, sujetas a la mano y con la palma delante del mango.
- Ataque con preparación, barrido y recuperación; el daño sigue la trayectoria dibujada de la herramienta.
- Se mantienen 10 de daño, costo cero de energía, 0,30 s por ejecución y 0,32 s entre ataques. Cada objetivo recibe un solo golpe por ejecución.
- El botón táctil se llama ARMA. El visor muestra el ataque básico real, también hacia la izquierda.
- Pruebas de agarre, barrido, dirección, alcance, daño único, campañas y controles móviles.

La prueba automatizada de campaña sigue la ruta principal; los guardias de desvíos no son objetivos de esa ruta. Las pruebas de plataformas opcionales se mantienen separadas. [Diseño de las cinco armas](ARMAS.md).

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

El tráiler se capturó de nuevo con las definitivas corregidas, en horizontal y vertical, con el mismo montaje, textos y música, y sin desenlace.

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
