# Etapa 2 · La Camanchaca de Parral

Primera versión jugable: cámara frontal, tres carriles y carrera automática. Continúa desde la montaña o entra directamente desde `etapa2.html`. Se puede correr con Marcelo, Ruzio, Pulga, Tobi o Pallo. Coté es la sexta integrante y acompaña como apoyo.

## Nuevo cierre de la etapa 1

El grupo supera al Matahombres y entrega sus fichas. Al pedir el Coñac Magdaleno, descubre que se agotó. El botillero cierra el local y les propone buscar en Parral. Los cinco se separan para revisar otras botillerías. No reciben licor, no brindan y la aventura sigue.

El guardado antiguo conserva su esquema. Una partida que ya había terminado la etapa 1 muestra el cierre nuevo y permite continuar en Parral con el mismo protagonista.

## Recorrido

La ciudad es una recreación ficticia de Parral para esta aventura: calles nocturnas, veredas, luminarias cálidas, cortinas metálicas cerradas y camanchaca que avanza desde el fondo hacia la cámara.

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
- **Personas durmiendo:** aparecen en las veredas laterales y se rodean cambiando de carril. No son enemigos y no reciben ataques.
- Cada tropiezo reduce la resistencia, ralentiza al protagonista y acerca la camanchaca. Tres tropiezos o ser alcanzado permiten reintentar desde el último cruce.
- Los cruces recuperan los tres puntos de resistencia y guardan el avance. Los carteles y avisos anuncian los obstáculos cercanos.

## Coté

Se usa el sprite de `Cote_referencias/16bit/Cote_96x160.png`, copiado a `assets/cote.png`: pelo oscuro recogido, blusa roja, pantalones y zapatos negros. La identidad procede de las referencias existentes del proyecto.

Coté se incorpora a los 220 metros y abre un primer espacio de respiro. El botón GRITO hace retroceder la niebla, la frena durante **6 segundos** y se recupera en **22 segundos**. Los obstáculos siguen activos. Las ondas salen de su rostro, el personaje abre los brazos y aparece «¡¡AAAAAAAH!!». El sonido es un efecto del juego, sin grabación de voz personal.

## Cierre y etapa 3

Al escapar, el protagonista se refugia bajo un camión. Allí encuentra a sus otros cuatro amigos y a Coté: seis personajes distintos en la escena. Al frente se enciende una luz en el clandestino **El Vecino**.

La compra del Coñac Magdaleno queda pendiente para la etapa 3. El estado de la etapa 2 registra `liquorBought: false`; no se entregan botellas ni se muestra una celebración de compra. El botón VER ESCENA permite observar el reencuentro y volver al texto del cierre.

Se interpretó provisionalmente «debajo de un cambio» como «debajo de un camión», a la espera de la aclaración del usuario. El grito usa una vocalización genérica hasta definir una frase propia de Coté.

## Guardado y verificación

La etapa 2 usa `magdaleno_parral_v1`, separado del guardado de la etapa 1. Ante un bloqueo del almacenamiento, conserva el último cruce en memoria y avisa al pausar. Si el guardado es inválido, lo descarta.

Se probaron las cinco carreras completas con entradas de carril y grito, sin invulnerabilidad ni saltos de distancia; colisiones con y sin salto; pausa; derrota por niebla; reintento; guardado; puente desde la etapa 1; controles táctiles emulados y apertura sin conexión. La comodidad y el rendimiento en teléfonos físicos requieren una sesión en esos dispositivos. El balance queda abierto al primer juego humano.

Para validar: `node tools/runner-check.cjs` y `node tools/runner-mobile-check.cjs`, con el servidor local iniciado. La lógica está en `src/runner.js`, los datos en `src/runner-data.js` y la perspectiva/escenarios en `src/runner-render.js`.
