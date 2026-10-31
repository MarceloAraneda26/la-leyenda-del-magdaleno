# Animación por piezas y atlas de revisión

La versión 0.6 añade armas básicas con agarre y barrido reales. [Verlas en el visor](animaciones.html?accion=arma) · [Diseño y reglas](ARMAS.md). Los atlas antiguos que se describen más abajo conservan las poses base exportadas; el arma básica se dibuja en tiempo real con el personaje.

Versión 0.2. [Abrir la vista de animaciones](animaciones.html) para comparar movimientos, pausar y cambiar la velocidad.

Los cinco amigos se dibujan desde sus PNG originales. El código recorta regiones de cabeza, torso, brazos y piernas al renderizar, y las mueve con pivotes e interpolación. Así se conserva la cara y la ropa entre poses.

## Poses exportadas

La carpeta animaciones contiene un PNG transparente y un JSON por amigo. Los atlas se exportaron del propio renderizador del juego; sirven para revisar las poses o usarlas como punto de partida para un atlas tradicional.

| Amigo | Atlas | Datos | Poses |
|---|---|---|---|
| Marcelo | [PNG](animaciones/marcelo_poses.png) | [JSON](animaciones/marcelo_poses.json) | 20 |
| Ruzio | [PNG](animaciones/ruzio_poses.png) | [JSON](animaciones/ruzio_poses.json) | 20 |
| Pulga | [PNG](animaciones/pulga_poses.png) | [JSON](animaciones/pulga_poses.json) | 20 |
| Tobi | [PNG](animaciones/tobi_poses.png) | [JSON](animaciones/tobi_poses.json) | 23 |
| Pallo | [PNG](animaciones/pallo_poses.png) | [JSON](animaciones/pallo_poses.json) | 20 |

Cada celda mide 160 × 224 píxeles y tiene el ancla de los pies en 80, 210. El atlas mide 960 × 896. Las celdas vacías mantienen la misma rejilla.

Orden: dos muestras de reposo, ocho pasos de marcha, subida, caída, aterrizaje, preparación del puñetazo, impacto, recuperación, daño, dos muestras de celebración y preparación del especial. Tobi añade tres escalas de crecimiento hasta el doble de tamaño.

Los atlas muestran poses base del cuerpo. El balón, el martillo, el dispositivo tecnológico, los proyectiles y las partículas se dibujan como elementos separados durante la ejecución del juego.

## Cómo se anima cada acción

- Reposo: oscilación mínima del torso y la cabeza.
- Marcha: caderas, rodillas, tobillos, hombros y codos alternan alrededor de sus pivotes; los pies compensan el giro al apoyarse.
- Salto: posiciones diferentes de subida y caída; al aterrizar se añade una amortiguación visual y pequeñas partículas. La trayectoria física se conserva.
- Puñetazo: preparación, extensión y regreso del brazo con interpolación; la zona y el tiempo real de daño se mantienen.
- Daño: inclinación breve y parpadeo de la ventana de protección.
- Definitiva: pose de preparación combinada con efectos propios y el tiempo de ejecución.
- Tobi: el crecimiento usa el ancla de los pies y vuelve al tamaño normal al terminar o entrar en un diálogo.
- Celebración: los cinco levantan los brazos junto a la mesa del final.

## Próximo pulido

El sistema 0.2 articula las extremidades y separa las fases del golpe. Un siguiente refinamiento puede añadir manos dibujadas para ataques y poses exclusivas más detalladas. Los atlas hacen visible el resultado del renderizador; el juego continúa utilizando las piezas, no una secuencia obligatoria de estos PNG.
