# Armas de cuerpo a cuerpo

Versión 0.6.1. Las armas se usan con **Z** o con el botón táctil **ARMA**. Mantener el botón repite el ataque. Cada arma permanece en la mano al caminar y saltar.

| Amigo | Arma | Diseño |
|---|---|---|
| Marcelo | PC notebook | Notebook abierto con pantalla azul, bisagra y teclado, sujeto del borde. |
| Ruzio | Martillo de campo | Mango de madera y cabeza de acero; es más corto que el martillo de su definitiva. |
| Pulga | Regla de profesor | Regla de madera clara con graduaciones y números. |
| Tobi | Taladro minero | Taladro neumático amarillo con empuñadura y broca de acero. |
| Pallo | Fonendoscopio | Olivas, arcos metálicos, tubo flexible y diafragma; se balancea como arma de golpe. |

Todos los ataques básicos mantienen **10 de daño**, no gastan energía y conservan un tiempo de ejecución de 0,30 s con una separación mínima de 0,32 s entre ataques. Las definitivas conservan sus efectos propios y su costo de 100 de energía. El golpe básico de Pallo no cura.

La herramienta comparte la transformación de la mano. La palma se dibuja sobre el mango usando sus píxeles originales. El daño se comprueba contra el barrido de la herramienta, dentro de la ventana activa del ataque, y un mismo objetivo recibe como máximo un impacto por ejecución.

La longitud y el grosor de las herramientas varían. Su alcance corresponde al cuerpo y al objeto dibujados, en lugar de usar el rectángulo del puñetazo anterior. Esto conserva el daño por golpe, aunque el espacio útil del ataque cambia ligeramente.

[Ver las armas en movimiento](animaciones.html?accion=arma). El visor permite pausar, avanzar cuadro a cuadro y cambiar de sentido. El personaje usa su arma básica en reposo, marcha y salto; al seleccionar «Definitiva» muestra la secuencia de su poder.

![Las cinco armas en reposo y durante el ataque](assets/armas-basicas.png)

Los dibujos siguen definidos en `src/melee.js`. También se exportan PNG transparentes en `assets/armas/`: [Marcelo](assets/armas/marcelo.png), [Ruzio](assets/armas/ruzio.png), [Pulga](assets/armas/pulga.png), [Tobi](assets/armas/tobi.png) y [Pallo](assets/armas/pallo.png). Se generan desde el mismo dibujo que usa el juego con `node tools/export-weapons.cjs`.

## Verificación

- Los cinco amigos golpean hacia ambos lados, con un solo impacto de 10 de daño por ataque.
- No se alcanza al objetivo de detrás ni al que está fuera del alcance.
- La mano y el mango comparten su posición; la geometría de daño coincide con la herramienta dibujada en reposo, marcha y salto.
- El ataque funciona sin energía; la definitiva conserva su costo.
- La campaña de rescates y jefes se comprueba con cada personaje.
- Se mantiene una prueba separada de las definitivas y la adaptación móvil.

La animación continúa partiendo de los sprites frontales y recortes articulados. No reemplaza un pase de dibujo de manos y poses exclusivas en pixel art.
