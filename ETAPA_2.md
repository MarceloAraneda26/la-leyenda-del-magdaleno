# Etapa 2 · La Camanchaca de Parral

**Vecino Clandestino:** el botillero de «El Vecino» tiene unos 50 años, contextura robusta, peinado ochentero con volumen y pelo más largo en la nuca, y camisa azul petróleo entreabierta. Su retrato muestra hombros y cuello anchos, mejillas llenas y leves señales de edad. En los diálogos aparece con su apodo «Vecino Clandestino».

En la versión 0.9.3, llegar al acoplado abre una conversación de diez frases con el protagonista, dos amigos, Coté, la camanchaca y el botillero de El Vecino. El dato de El Muñeco y la salida en scooters se explican antes de habilitar la continuación. SEGUIR, Enter o espacio avanzan una frase; la carrera queda detenida.

El guardado conserva `endingDialogue` (identificador, índice de la frase y finalización). Continuar retoma la misma frase. El cierre permite volver a ver la conversación sin alterar el guardado ni los desbloqueos. Las partidas antiguas terminadas mantienen sus accesos.

Primera versión jugable: cámara frontal, tres carriles y carrera automática. Se desbloquea al completar la etapa 1; los enlaces directos también respetan ese requisito. Se puede correr con Marcelo, Ruzio, Pulga, Tobi o Pallo. Coté es la sexta integrante y acompaña como apoyo.

## Nuevo cierre de la etapa 1

El grupo supera al Matahombres y entrega sus fichas. Al pedir el Coñac Magdaleno, descubre que se agotó. El botillero cierra el local y les propone buscar en Parral. Los cinco se separan para revisar otras botillerías. No reciben licor, no brindan y la aventura sigue.

El guardado antiguo conserva su esquema. Una partida que ya había terminado la etapa 1 muestra el cierre nuevo y permite continuar en Parral con el mismo protagonista.

## Recorrido

La ciudad es una recreación ficticia de Parral para esta aventura: calles nocturnas, veredas, luminarias cálidas, cortinas metálicas cerradas y camanchaca que persigue desde el fondo. La cámara retrocede delante del protagonista: él corre hacia el espectador y la calle se aleja hacia arriba. Los obstáculos aparecen en el suelo de primer plano, coinciden con los pies al pasar y quedan atrás rumbo al horizonte.

| Tramo | Distancia | Acción |
|---|---:|---|
| Centro de Parral | 0–520 m | Primeras botillerías cerradas; obstáculos individuales. Coté se suma a los 220 m. |
| Las cortinas abajo | 520–1040 m | Aparecen combinaciones de obstáculos. Cruce de control y recuperación de resistencia. |
| Calles sin respuesta | 1040–1560 m | Continúa la búsqueda y crece la presión de la niebla. |
| La última cuadra | 1560–2100 m | Últimas botillerías cerradas, escape y refugio. |

Una carrera limpia tarda unos 102 segundos. Los puntos de control están en 0, 520, 1040 y 1560 metros. Hay al menos un carril libre en cada fila de obstáculos y separación suficiente para cambiar entre los tres carriles.

## Controles

| Acción | Teclado | Celular |
|---|---|---|
| Carril izquierdo/derecho | Flechas o A/D | Botones ◀ ▶; también admite deslizar sobre el escenario. |
| Saltar | Espacio, W o flecha arriba | SALTAR; también admite deslizar hacia arriba. |
| Grito de Coté | V | GRITO. |
| Pausa | Escape o P | PAUSA. Girar o salir de la aplicación también pausa. |

El menú funciona en vertical. La persecución pide el celular en horizontal. Los controles principales admiten dos toques simultáneos.

## Obstáculos y camanchaca

- **Hoyos:** se saltan o se esquivan. Caer hace perder ritmo y acerca la niebla.
- **Caca de perro:** un salto corto o un cambio de carril evita el patinazo.
- **Personas durmiendo:** aparecen en las veredas y también en la calle central. No se pueden saltar: se rodean cambiando de carril. No son enemigos y no reciben ataques.
- Cada tropiezo reduce la resistencia, ralentiza al protagonista y acerca la camanchaca. Tres tropiezos o ser alcanzado permiten reintentar desde el último cruce.
- Los cruces recuperan los tres puntos de resistencia y guardan el avance, pero no alejan la niebla. Los carteles y avisos anuncian los obstáculos cercanos.
- La niebla gana terreno cada vez más rápido (de 1,35 a 1,9 por segundo). Sin el grito de Coté alcanza al jugador antes de terminar, aunque esquive todo. Quedarse en el carril central saltando tampoco alcanza para llegar.

Balance simulado con bots en 0.8.2: esquivar todo sin gritar pierde a los 1454 m; esquivar y gritar gana con 2 o 3 gritos; un jugador simulado que deja pasar el 20 % de las filas gana 27 de 30 carreras sin reintentar, y el que deja pasar el 40 %, 15 de 30. Son cifras de referencia, no reemplazan la prueba con personas.

## Coté

Se usa el sprite de `Cote_referencias/16bit/Cote_96x160.png`, copiado a `assets/cote.png`: pelo oscuro recogido, blusa roja, pantalones y zapatos negros. La identidad procede de las referencias existentes del proyecto.

Coté tiene mucho carácter y, a la vez, es dulce y protectora con sus amigos. Su frase es **«CORREEEE!!»**. Al sumarse grita «¡Sigan, que yo la freno!»; después del estallido tranquiliza al protagonista: «Tranquilo, estoy contigo. Sigue avanzando». Los avisos de peligro conservan prioridad sobre estas intervenciones.

Coté se incorpora a los 220 metros y abre un primer espacio de respiro. Corre cerca del protagonista, con una altura visible de aproximadamente el 88 % de la suya y un margen para los brazos. El botón GRITO hace retroceder la niebla, la frena durante **6 segundos** y se recupera en **22 segundos**. Los obstáculos siguen activos. Las ondas salen de su rostro, el personaje abre los brazos y aparece «CORREEEE!!». El sonido sigue siendo un efecto del juego, sin grabación de voz personal.

## Cierre y etapa 3

Al escapar, el protagonista se refugia **debajo del acoplado de un camión (semirremolque/tráiler)**. Allí encuentra a sus otros cuatro amigos y a Coté: seis personajes distintos en la escena. La caja larga del acoplado tiene bogie trasero, patas recogidas y un enganche que la separa del tractocamión. Los seis se agachan bajo su chasis. Al frente se enciende una luz en el clandestino **El Vecino**.

La compra del Coñac Magdaleno queda pendiente para la etapa 3. El estado de la etapa 2 registra `liquorBought: false`; no se entregan botellas ni se muestra una celebración de compra. El botón VER ESCENA permite observar el reencuentro y volver al texto del cierre.

Coté cierra el reencuentro con «Ya, respiremos. Estamos todos». El refugio bajo el acoplado, la personalidad y frase de Coté y los controles de tres carriles, salto y ayuda quedaron confirmados por el usuario.

## Guardado y verificación

La etapa 2 usa `magdaleno_parral_v1`, separado del guardado de la etapa 1. Ante un bloqueo del almacenamiento, conserva el último cruce en memoria y avisa al pausar. Si el guardado es inválido, lo descarta. También se puede abrir directamente desde `etapa2.html`; los límites del sprite de Coté se incluyen junto a los de los demás personajes.

Se probaron las cinco carreras completas con entradas de carril y grito, sin invulnerabilidad ni saltos de distancia; colisiones con y sin salto; pausa; derrota por niebla; reintento; guardado; puente desde la etapa 1; controles táctiles emulados y apertura sin conexión. La comodidad y el rendimiento en teléfonos físicos requieren una sesión en esos dispositivos. El balance queda abierto al primer juego humano.

Para validar: `node tools/runner-camera-check.cjs`, `node tools/runner-check.cjs` y `node tools/runner-mobile-check.cjs`, con el servidor local iniciado. La lógica está en `src/runner.js`, los datos en `src/runner-data.js` y la perspectiva/escenarios en `src/runner-render.js`.
