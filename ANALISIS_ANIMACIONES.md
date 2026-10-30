# Análisis de poderes y herramientas

Estado analizado: versión 0.4.0. La versión 0.5.0 aplicó la corrección; su resultado está en la sección siguiente. El diagnóstico original se conserva más abajo como referencia.

## Resultado de la corrección 0.5

La base común está en `src/powers.js`. Cada definitiva es una secuencia de poses clave (preparación, acción, impacto y recuperación) con su propio instante de impacto. Las herramientas se dibujan con la transformación de la mano y el daño se dispara en ese instante.

Medición con `node tools/audit-animation.cjs`: motor real a 60 pasos por segundo, render en cada paso, hacia la derecha y hacia la izquierda. Resultado completo en [mediciones_v05.json](auditoria_animaciones/mediciones_v05.json).

| Amigo | Impacto y daño | Contacto o evidencia | Agarre | Mayor salto de pose fuera del golpe |
|---|---|---|---|---|
| Marcelo | 0,433 s | El pulso nace del dispositivo (0 px) | 0 px | 0,20 rad |
| Ruzio | 0,567 s | Cabeza del martillo a 2,9 px del suelo; 57 px en el paso anterior | 0 px | 0,29 rad |
| Pulga | 0,933 s | Posición física en el suelo; balón a 0,7 y 2,7 px del suelo según el sentido (12 y 14 px en el paso anterior); salto real de 110 px | 0 px | 0,30 rad |
| Tobi | 0,933 s | Aterriza del salto (elevación 0) a escala 2 | sin objeto | 0,19 rad |
| Pallo | 0,450 s | El hechizo nace de la palma (0 px) | 0 px | 0,19 rad |

Criterios propuestos que ahora se cumplen:

- Agarre a menos de 2 px de la mano durante toda la acción.
- Contacto o aterrizaje y daño en el mismo paso de 60 Hz, sin contacto en el paso anterior.
- Entrada desde el reposo y vuelta a él sin saltos mayores a 0,3 rad por paso, salvo el golpe mismo.
- La herramienta pasa por detrás de la cabeza por orden de capas; no la atraviesa.
- La secuencia se mide en ambos sentidos. En el visor también se revisa con avance cuadro a cuadro y a tamaño reducido.

Secuencias nuevas: [Ruzio](auditoria_animaciones/ruzio_secuencia_v05.png), [Pulga](auditoria_animaciones/pulga_secuencia_v05.png), [Tobi](auditoria_animaciones/tobi_secuencia_v05.png), [Marcelo](auditoria_animaciones/marcelo_secuencia_v05.png) y [Pallo](auditoria_animaciones/pallo_secuencia_v05.png).

Límites que siguen abiertos:

- Los cuerpos parten del mismo sprite frontal. Las poses nuevas rotan recortes, sin manos ni torsos dibujados a mano. El gesto se lee, pero no reemplaza un pase de pixel art por personaje.
- Tobi golpea al aterrizar: sus puños bajan hasta la cintura, sin tocar el suelo, porque las proporciones frontales no lo permiten sin doblar el torso.
- El tráiler 0.4.1 muestra las animaciones anteriores. Conviene capturarlo de nuevo.
- La revisión de legibilidad en un celular físico sigue pendiente.

## Diagnóstico de la versión 0.4.0

El problema principal es la falta de coordinación entre cuerpo, objeto y efecto. Hay interpolación y articulaciones, pero las herramientas no siguen las manos y el daño no siempre coincide con el gesto que lo debería producir. Aumentar los cuadros por segundo no resolvería estas brechas.

## Evidencia

Se ejecutó cada definitiva dentro del motor real, a 60 pasos de simulación por segundo. Se aisló el fondo para observar al personaje, sin modificar su pose, trayectoria visual ni regla de activación. Cada secuencia muestra nueve momentos del poder. El último está después de su término.

- [Ruzio: martillo](auditoria_animaciones/ruzio_secuencia_actual.png).
- [Pulga: balón y salto](auditoria_animaciones/pulga_secuencia_actual.png).
- [Tobi: crecimiento](auditoria_animaciones/tobi_secuencia_actual.png).
- [Marcelo: dispositivo](auditoria_animaciones/marcelo_secuencia_actual.png).
- [Pallo: magia](auditoria_animaciones/pallo_secuencia_actual.png).
- [Mediciones reproducibles](auditoria_animaciones/mediciones.json).
- [Galería de revisión](auditoria_animaciones/index.html).

Las imágenes son observaciones del renderizador actual. No son dibujos propuestos para reemplazarlo. La prioridad siguiente evalúa claridad visual y coherencia de la acción; no implica que la campaña esté bloqueada.

## Brechas compartidas

| Prioridad | Brecha | Consecuencia | Corrección propuesta |
|---|---|---|---|
| Alta | Las herramientas se dibujan después del cuerpo, con posiciones independientes de las articulaciones. | El objeto parece flotar, gira sin arrastrar la mano y puede pasar por delante de la cara. | Definir un punto de agarre por mano; dibujar herramienta y mano con la misma transformación y con capas delante/detrás. |
| Alta | Se reutiliza una pose fija de brazos abiertos para Marcelo, Ruzio y Pallo. | La acción no comunica apuntar, sujetar, cargar o descargar fuerza. | Diseñar poses propias por habilidad, conservando rostro, barba, ropa y contextura. |
| Alta | Todos los poderes activan su efecto al superar aproximadamente el 53% de la duración. | El daño ocurre por un porcentaje común, no por contacto, aterrizaje o liberación del hechizo. | Una secuencia compartida de preparación, acción, impacto y recuperación, con un evento de daño definido para cada poder. |
| Alta | Los recortes parten de un único sprite frontal y usan proporciones de articulaciones comunes. | Al rotar los brazos aparecen siluetas rígidas y manos que no representan un agarre. El torso y las piernas apenas acompañan el esfuerzo. | Crear unas pocas poses clave y manos específicas; interpolar entre ellas sin depender únicamente de rotar recortes. |
| Media | El objeto y los brazos aparecen ya en su pose activa y desaparecen al terminar. | Faltan entrada y recuperación; se perciben saltos aunque el movimiento intermedio sea continuo. | Transiciones breves hacia y desde la pose; aparición del objeto comunicada por la acción o por un efecto intencional. |
| Media | Varios poderes comparten un anillo expansivo y el mismo sonido inicial. | Cuesta distinguir peso, tecnología, impacto y magia. El sonido no enfatiza el contacto. | Efectos y sonido propios, vinculados al evento de impacto, con una pausa de impacto corta cuando corresponda. |
| Media | Las ayudas de rescate también reutilizan ataque o lanzamiento genéricos. | La ayuda puede decir “martillo” o “tecnología” sin mostrar la acción correspondiente. | Reutilizar la misma secuencia y herramienta del personaje en una variante breve de ayuda. |
| Alta para revisión | El visor y las pruebas existentes no reproducen la definitiva completa. | Una pose puede verse completa y pasar las pruebas sin que funcionen el agarre, las capas ni el impacto. | Añadir revisión del poder real, avance cuadro a cuadro, orientación izquierda/derecha, puntos de agarre y marcador de daño. |

## Por personaje

### Ruzio: el martillo no golpea el suelo

La mano mantiene la pose genérica mientras el martillo rota desde un punto situado junto al torso. No hay levantamiento del peso, agarre ni descarga con el cuerpo. La herramienta también se dibuja por encima de la cara cuando cruza esa región.

En la prueba, el efecto se activa a los **0,533 s** de una acción de 1 s. En ese instante, el centro de la cabeza del martillo está aproximadamente **96 píxeles lógicos por encima del suelo**. Esa cifra se calcula con la transformación actual del objeto; corresponde a su centro, no a su borde inferior. La onda comienza sin un contacto visible.

Propuesta: mano cerrada sobre el mango, preparación hacia atrás, arco de bajada con aceleración, contacto y onda en el mismo momento, flexión de rodillas y recuperación del martillo. Es el primer poder que conviene rehacer junto con la base de agarres.

### Pulga: el daño ocurre en el aire

El salto especial solo desplaza el dibujo. La posición física del personaje permanece en el suelo durante la ejecución. El balón mantiene un desplazamiento fijo respecto del cuerpo y no pasa por una mano que lo cargue, eleve y descargue. Las piernas no representan una subida y una caída propias de la clavada.

El efecto se activa a los **0,650 s** de una acción de 1,2 s. Los pies dibujados están a unos **109 píxeles por encima del suelo**, cerca del punto más alto. La onda aparece abajo mientras Pulga sigue arriba.

Propuesta: cargar el salto, sostener el balón, ascender, preparar el descenso y producir el impacto al llegar al suelo. La posición visual y la lógica deben compartir la misma referencia. Mover el evento de daño cambia el tiempo de respuesta, así que habrá que revisar ese balance después de corregir la acción.

### Tobi: aumenta de tamaño sin ejecutar el golpe

El crecimiento duplica el sprite completo; no hay una pose nueva de esfuerzo. En la secuencia se mantiene de pie, con los brazos prácticamente en reposo, mientras aparece la onda. La escala usa tramos lineales con cambios bruscos de velocidad al comenzar y terminar el crecimiento.

El efecto se activa a los **0,800 s** de una acción de 1,5 s. Está a tamaño doble, pero falta un gesto de golpe que justifique el impacto. Su caja física conserva el tamaño normal: esto es una decisión de jugabilidad que debe hacerse visualmente comprensible, no cambiarse automáticamente.

Propuesta: anticipación con piernas y torso, crecimiento con aceleración y frenado, levantamiento de brazos, descarga y recuperación. Mantener los pies anclados y revisar la lectura del alcance.

### Marcelo: el dispositivo parece suspendido

El dispositivo aparece al lado del torso y los dos brazos adoptan la misma pose abierta del hechizo. No se distingue sujetar el aparato, tocar un control y liberar el pulso. Los pequeños cuadrados y el anillo comunican “efecto”, pero no su causa.

El efecto se activa a los **0,433 s** de una acción de 0,8 s.

Propuesta: una mano sujeta el dispositivo, la otra lo activa; un breve cambio de pantalla precede al pulso, seguido por una recuperación de brazos y torso. El pulso puede seguir siendo instantáneo; necesita una preparación visual legible.

### Pallo: el hechizo no nace de la mano

Los brazos permanecen abiertos y el haz aparece a una altura fija del cuerpo. No hay gesto de apuntar ni continuidad clara entre palma, carga y haz. La recuperación de vida funciona, pero el efecto actual no explica con claridad la relación entre acertar y curarse.

El efecto se activa a los **0,483 s** de una acción de 0,9 s.

Propuesta: pose de concentración, mano que apunta al lado correcto, haz que nace en esa mano y respuesta de curación diferenciada cuando realmente acierta. No es necesario convertir el haz en un proyectil: puede ser instantáneo con una salida bien comunicada.

## Límites de la revisión anterior

El visor `animaciones.html` llama directamente al dibujo del personaje. Su botón “Preparación” fija `pose.cast=true`; no ejecuta la definitiva ni dibuja las herramientas y efectos del juego. Las pruebas visuales comprueban que existan imágenes, que la marcha cambie y que la pausa funcione. No evaluaban el agarre ni la coincidencia entre gesto y daño. Esa fue una brecha de la validación anterior.

Las campañas completas verificadas siguen siendo evidencia de que las reglas y la progresión funcionan. No demuestran por sí mismas fluidez o calidad de animación.

## Orden de trabajo propuesto

1. **Base común:** puntos de agarre, orden de capas y una secuencia de fases que pueda disparar el impacto. Separar la dirección del ataque de la preservación del rostro frontal.
2. **Ruzio y Pulga:** corregir contacto del martillo y aterrizaje de la clavada. Son las contradicciones más visibles.
3. **Tobi, Marcelo y Pallo:** poses propias, transferencia de peso, uso de objetos y recuperación.
4. **Revisión y prueba:** visor con poderes reales, cámara lenta y avance por cuadro; comprobación en ambos sentidos y en tamaño móvil. Revalidar daño, energía, curación, tamaño y continuidad.
5. **Nuevo material promocional:** capturar estas acciones de nuevo cuando estén corregidas. No presentar el cambio de montaje del tráiler como un arreglo de los poderes.

### Criterios de aceptación propuestos

- El punto de agarre de un objeto sostenido se conserva a menos de 2 píxeles lógicos de su mano durante la acción, salvo una separación intencional visible.
- Contacto/aterrizaje y activación del daño coinciden dentro de un paso de simulación de 60 Hz.
- Se distinguen preparación, acción e incorporación a reposo; no hay cambios de pose sin transición cuando no estén justificados por el estilo.
- La herramienta no atraviesa cara o torso por un error de capas.
- La secuencia es legible hacia ambos lados y en el tamaño real de un celular.
- Se conserva la identidad de cada amigo y se revisan por separado las consecuencias de cambiar los tiempos de daño.

Estos criterios son una propuesta para el siguiente pulido; todavía no están implementados ni aprobados como pruebas superadas.

## Tráiler sin desenlace

Se retiraron las escenas y frases que revelaban el desenlace. La nueva secuencia muestra elenco, poderes, camino y un obstáculo intermedio; termina planteando qué espera en la montaña. No muestra la prueba final, el resultado de la búsqueda ni la celebración. El generador además rechaza cuadros que entren en el estado final, la celebración o su localización.

La corrección del tráiler se entrega en horizontal y vertical. Las animaciones conservan el estado analizado hasta su próximo trabajo de pulido.

## Referencias de implementación

- `src/visuals.js:53`: recortes de las piezas; `:112`: brazos; `:122`: pose común de lanzamiento.
- `src/render.js:56`: salto visual de Pulga y escala de Tobi; `:57`: herramientas dibujadas fuera del personaje; `:58`: efectos.
- `src/game.js:35`: inicio de definitiva; `:36`: aplicación del efecto; `:57`: activación al 53% aproximado.
- `src/animation-preview.js:43`: pose genérica del visor.
- `src/chapter.js:89`: ayudas guionizadas con poses genéricas.
- `tools/audit-animation.cjs`: reproducción de las mediciones y secuencias.
