# Etapa 3 · La Bajada de Buenos Aires

Etapa incluida en la versión 0.9.0. Abrir `etapa3.html` o continuar desde el cierre de la etapa 2. Se usan scooters eléctricos de pie y dos compañeros al azar, con Coté incluida en el sorteo, según lo confirmado por el usuario.

## Decisiones de cierre confirmadas

Estas decisiones están acordadas con el usuario y aplicadas en la versión 0.9.0:

- **Vieja Califa:** vendedora misteriosa y teatral, con ropa común de almacenera y mirada inquietante. El misterio está en su actuación, no en un disfraz de bruja.
- **Dificultad:** intermedia, con algo de práctica en la bajada y prioridad a los controles de celular.
- **Final:** el grupo sí recibe el Magdaleno a cambio de los scooters, pero el recibo dice **«Ahora me deben un favor»**. El cierre deja una sospecha.
- **Compañeros:** cada uno da una pequeña ayuda automática según su personalidad. No se agregan botones para activarla.

La duración objetivo confirmada es de **2–3 minutos**. Una pasada limpia simulada tarda unos **148 segundos** sin pausas de lectura. El último rótulo es **«Continuará…»**, sin mostrar la siguiente aventura.

## Historia

El grupo sale de debajo del acoplado y prueba en **El Vecino**. Tampoco queda Coñac Magdaleno. El dato siguiente los manda al **barrio Buenos Aires**, donde estaría la botillería **El Muñeco**. Se reparten scooters y se separan para revisar el camino.

El protagonista encuentra a dos amigos con el candado del scooter atascado. Se detiene, los libera y cada uno se suma conduciendo su propio scooter. Los otros tres amigos quedan fuera de este recorrido; no se los sustituye ni se duplican personajes.

El tramo final es **la Bajada de Buenos Aires**: pendiente visible hacia la derecha, mayor velocidad y autos en los carriles. En El Muñeco los espera **la Vieja Califa**:

> «Magdaleno tengo. Plata no quiero: déjenme los tres scooters y hacemos trato».

La llegada abre un trueque explícito. Al pulsar **ENTREGAR LOS TRES SCOOTERS**, el local se queda con los tres vehículos y el grupo consigue el licor. La Vieja Califa entrega entonces un recibo que dice **«Ahora me deben un favor»**. El cierre muestra **«CONTINUARÁ…»** y no revela la próxima aventura. La vuelta queda a pie. No hay consumo durante la conducción.

## Recorrido y controles

- Vista lateral con avance automático de izquierda a derecha. El fondo se desplaza a la izquierda; el grupo conduce hacia la derecha.
- Longitud: 5200 metros de juego; unos 148 segundos simulados si se esquiva sin frenar. La dificultad apunta a intermedia; falta validarla con jugadores.
- Rescates a los 620 y 1960 m. El scooter se detiene antes del candado: el jugador no puede perder al compañero por pasar de largo.
- Cruces de control a los 0, 900, 1800, 2700, 3500 y 4300 m. Se guarda el progreso y se recupera la resistencia.
- Bajada desde los 3500 m, con aceleración gradual y autos que obligan a esquivar.

| Acción | Teclado | Celular |
|---|---|---|
| Cambiar de carril | ↑ / ↓ o W / S | ▲ / ▼ |
| Saltar | Espacio | SALTAR |
| Frenar | Mantener Z o Shift | Mantener FRENO |
| Liberar al compañero | E o Enter | Botón LIBERAR al detenerse |
| Pausa | Escape o P | PAUSA |

Hoyos y conos de obra se saltan o esquivan. Los autos se rodean cambiando de carril; el salto no los evita. Cada fila deja al menos un carril libre. Tres golpes provocan reintento desde el cruce anterior. Frenar reduce velocidad, sin detener la carrera fuera de las paradas de rescate.

## Sorteo de compañeros

Se elige a Marcelo, Ruzio, Pulga, Tobi o Pallo como conductor. Al empezar una partida nueva se sortean **dos personajes diferentes** entre los otros cinco del grupo de seis, **con Coté incluida en el sorteo**. Coté puede salir, pero no es obligatoria. Los acompañantes siguen la trayectoria ya recorrida por el protagonista: cambian de carril y saltan al llegar al mismo punto del camino.

El sorteo usa una semilla guardada: reintentar, recargar o continuar conserva la pareja y los rescates obtenidos. «Otro recorrido» crea una partida nueva y vuelve a sortear. El protagonista nunca aparece también como compañero.

## Ayudas automáticas

Solo ayudan los amigos ya liberados. Cada uno tiene recuperación propia y hay una pausa compartida de 2,4 segundos entre intervenciones, para evitar que ambas ayudas se acumulen en el mismo instante. El HUD muestra cuándo están listas. No se añaden controles.

| Amigo | Ayuda | Recuperación |
|---|---|---:|
| Marcelo | Marca antes un carril seguro ante un obstáculo del carril elegido. El jugador sigue conduciendo. | 26 s |
| Ruzio | Absorbe un golpe sin perder resistencia. | 30 s |
| Pulga | Mejora la altura y duración de un salto iniciado por el jugador cerca de un hoyo. No permite saltar autos. | 24 s |
| Tobi | Recupera el equilibrio tras un golpe y elimina la ralentización; el golpe sí resta resistencia. | 26 s |
| Pallo | Recupera un punto cuando queda uno de resistencia. | 34 s |
| Coté | Grita «CORREEEE!!» y hace apartarse un auto cercano del carril elegido. | 32 s |

La recuperación se conserva al continuar una partida y se detiene durante pausa y paradas de rescate. Se incluyen sonidos breves de las ayudas, rodadura, frenado y un remate más inquietante al recibir el comprobante.

## Guardado y final

Se usa `magdaleno_scooter_v1`, independiente de las etapas 1 y 2. El formato 2 guarda protagonista, semilla, dos rescates, último cruce, tiempo, reintentos, recuperación de ayudas y estado del trueque. Las partidas de la primera versión local se migran al recorrido ampliado conservando la pareja, los rescates y el trueque. Si el almacenamiento falla, el recorrido permanece en memoria y se informa al pausar.

Antes del trueque hay tres scooters y no se ha adquirido licor. Tras aceptarlo hay cero scooters y el licor está adquirido. El trueque no se puede ejecutar dos veces. Continuar una partida terminada muestra ese mismo cierre.

## Arte y validación

Se conservan los sprites y rostros existentes de los seis amigos. Los scooters, autos, viviendas y El Muñeco son dibujos del motor. La Vieja Califa usa ropa común de almacenera: blusa apagada, delantal de trabajo, cabello recogido con canas y mirada sostenida. Sus pausas y el recibo dan el carácter misterioso y teatral acordado. El diseño se puede seguir afinando tras la revisión del usuario.

El piloto mantiene ambas manos junto a los puños del manillar mediante una pose calculada para cada cuerpo, con codos bajos y los dos antebrazos delante del torso. Las manos abiertas del sprite se recortan y se sustituyen por puños cerrados que rodean el manillar, usando tonos de piel tomados del propio sprite. En un golpe se inclina el scooter completo para conservar el agarre. El scooter entero salta; el personaje no corre encima de la tabla. Los acompañantes no reciben colisiones separadas en esta primera versión.

Validación: `node tools/scooter-check.cjs` para campañas completas con los cinco protagonistas, duración, sorteo y persistencia, rescates, frenado, colisiones y trueque; `node tools/scooter-assists-check.cjs` para las seis ayudas, sus límites, recuperación, migración y cierre; `node tools/scooter-mobile-check.cjs` para tacto simultáneo, giro/pausa, acceso offline, enlace desde la etapa 2, manos en el manillar y recibo legible. Admiten `MAGDALENO_BASE_URL`.

Las pruebas automáticas completaron las cinco campañas en unos 148 segundos y verificaron seis tamaños de pantalla emulados, sin errores de página. En simulación adicional, esquivar completó 12 de 12 recorridos; omitir la reacción en el 20 % de las filas también completó 12 de 12; no esquivar completó solo 1 de 12. Esto mide la lógica y su margen de error, no sustituye una prueba humana.

Pendiente para validar el cierre: prueba con personas y teléfonos Android/iPhone físicos. Las poses laterales dedicadas de los amigos y voces grabadas quedan como pulido adicional; se mantienen los sprites actuales. La versión local ya permite recorrer el nivel y ver el nuevo cierre de principio a fin.
