# Etapa 4 · Los recuerdos y el último Magdaleno

Estado: publicada en la versión 0.10.0 (8 de noviembre de 2026) en `etapa4.html`. Se desbloquea al terminar la etapa 3. Los textos son la versión base y quedan por revisar.

Nota de nombres: en `ETAPAS.md` las secciones «Etapa 4A» y «Etapa 4B» son fases del desarrollo, no esta cuarta etapa del juego.

## Resumen (confirmado)

Es la cuarta y última etapa, y puede ser la más larga del juego. La botella que entregó la Vieja Califa en la etapa 3 era falsa: un truco para atraer a los jóvenes. Tras ese cierre, la camanchaca atrapa al protagonista y lo lleva al pasado, a la época del colegio. Ahí recorre los recuerdos de cada amigo como visitante, mirándolos pasar como en una huincha y comentándolos.

Al terminar los recuerdos vuelve al presente, confundido, y entiende que el objetivo nunca fue el Magdaleno, sino con quién se comparte. En ese momento aparece el resto del equipo y salen juntos desde Buenos Aires hacia el último Magdaleno, en los arcades de Don Mario. En el camino pelean contra «pasteros» y «viejas sapas». En el local, Don Mario solo entrega el Magdaleno a quien le gane en un PONG. Al ganarle, entrega la botella, se corta la escena y se ve al grupo compartiendo el Magdaleno, feliz.

## Estructura

| Parte | Contenido | Duración estimada (propuesta) |
|---|---|---|
| 1. La botella falsa | Se descubre el engaño de la Vieja Califa y llega la camanchaca | 30 a 45 s |
| 2. La huincha de recuerdos | Seis recuerdos vistos como visitante | 4 a 6 min |
| 3. El regreso | Despertar confundido, reflexión y llegada del equipo | 1 min |
| 4. Camino a Don Mario | Combate como en la etapa 1 contra pasteros y viejas sapas | 5 a 7 min |
| 5. El PONG | Partida contra Don Mario en su máquina | 1 a 2 min |
| 6. Final | Entrega del Magdaleno, corte y el grupo compartiendo | 1 min |

En total serían unos 13 a 18 minutos. Como referencia, una partida limpia de la etapa 3 dura unos 2 minutos y medio.

## Parte 1 · La botella falsa

**Confirmado:** la botella de la Vieja Califa era falsa, un truco para atraer a los jóvenes.

**Propuesta:** el grupo la abre o la mira de cerca y descubre el engaño; la Vieja Califa ya no está y la camanchaca entra por la calle y envuelve al protagonista. Así la etapa 3 queda conectada sin cambiar su final («Continuará…»).

## Parte 2 · La huincha de recuerdos

**Confirmado:** el protagonista no juega los recuerdos, los mira como visitante. Los recuerdos van pasando como en una huincha y él los va comentando: «ahh, esto es cuando Pulga se cayó…», «esto es cuando me pasó esto…».

**Propuesta de forma de juego:**
- El protagonista camina hacia la derecha por un pasillo de camanchaca donde cada recuerdo aparece como un cuadro de la huincha. Solo se puede caminar y avanzar el texto; no hay enemigos ni forma de perder.
- Al llegar a un cuadro, la escena se anima unos 30 a 50 segundos y aparece el comentario del protagonista.
- El comentario cambia según quién mire: si el recuerdo es de otro amigo, «esto es cuando…»; si es el propio, «esto es cuando me pasó…». La versión base está en la sección «Comentarios de la huincha».
- El recuerdo del protagonista elegido va al final, como el más personal.

| Recuerdo (confirmado) | Dueño | Qué muestra la escena (propuesta, sobre lo confirmado) |
|---|---|---|
| Baile folclórico del colegio: la mazamorrita, en parejas, dando vueltas como en la cueca y con trajes de huaso. Tobi se cayó bailando | Tobi | Varias parejas girando en el escenario del colegio; Tobi, con traje de huaso, se va al suelo en una vuelta. |
| Saltar una reja del estadio y herirse la mano | Marcelo | Marcelo trepa y salta la reja; al caer se ve la mano herida. |
| Arrancar tras un temblor; ya llevaba un cuello ortopédico muy notorio, y lo cómico era cómo se veía | Pallo | La sala tiembla y Pallo sale corriendo, rígido, con el cuello ortopédico bien visible. |
| Comer lentejas con alcohol, emborracharse y no poder caminar bien | Ruzio | Ruzio sale del comedor caminando en zigzag, chocando con sillas. |
| Jugar a perseguirse con compañeros, chocar con otros, caer y quedar tendido en el piso | Pulga | Carrera en el patio, choque con otros niños y Pulga tendido en el suelo. |
| Llevar el estandarte del colegio | Coté | Coté marchando con el estandarte en un desfile. |

Escenarios: escenario o gimnasio del baile, estadio, sala de clases, comedor, patio y desfile.

### Aspecto en los recuerdos (confirmado)

- Los amigos aparecen con el uniforme del colegio: pantalones grises, sweater azul marino y zapatos negros.
- Coté usa falda burdeo y blazer azul marino.
- El colegio tenía tonos burdeos, que se usarán en muros, puertas, cortinas y detalles de los escenarios.
- Compañeros y profesores son personajes genéricos, sin nombres reales. Los compañeros usan el mismo uniforme.
- **Propuesta:**
  - En la mazamorrita, Tobi lleva traje de huaso en lugar del uniforme.
  - El estandarte de Coté va en burdeo.
  - El protagonista, como visitante, conserva su aspecto actual, para que se note que viene del presente.

## Parte 3 · El regreso (propuesta)

El protagonista despierta en Buenos Aires, frente a El Muñeco, sin saber cuánto tiempo pasó, y dice la reflexión (texto base en «Comentarios de la huincha»). Llegan los demás uno por uno, con una frase cada uno (las de `src/story-data.js` sirven de base de tono), y parten juntos.

## Parte 4 · Camino a los arcades de Don Mario

**Confirmado:** los pasteros y las viejas sapas pelean como los enemigos de la etapa 1, con violencia gráfica de ficción, y salen corriendo al ser derrotados.

**Propuesta:**
- Recorrido de plataformas con el motor de la etapa 1, desde Buenos Aires hasta el local, con dos o tres tramos y puntos de control.
- Se controla al protagonista con sus armas y su definitiva; el resto del equipo acompaña y ayuda como en la etapa 3.
- **Pasteros:** atacan de cerca y en grupo.
- **Viejas sapas:** atacan desde ventanas y rejas, a distancia, para obligar a moverse y saltar.

## Parte 5 · El PONG contra Don Mario

**Confirmado:** Don Mario es una leyenda urbana, un personaje de ficción del juego. Tiene unos 60 años, melena larga y ondulada hasta los hombros, castaño oscuro bien canoso, barba gris oscura, polera gris sin mangas, short rojo y zapatillas blancas (definido por el usuario el 9 y el 10 de noviembre de 2026). Para entregar el Magdaleno hay que ganarle en un PONG en su máquina arcade.

**Propuesta:**
- La pantalla de la máquina ocupa el escenario, con estética retro.
- Controles: ▲ ▼ en el celular, ↑ ↓ en el teclado.
- Gana el primero que llegue a 5 puntos. Don Mario juega bien, pero comete errores para que se le pueda ganar.
- Si pierdes, revancha inmediata sin castigo y con una frase de Don Mario.
- Frases base: al llegar, «Nadie se lleva el último Magdaleno sin ganarme una partida»; si pierdes, «¿Otra? La máquina no se cansa y yo tampoco»; al ganarle, «Hace años que nadie me ganaba. Llévenselo, pero compártanlo».

## Parte 6 · Final (confirmado)

Don Mario entrega el Magdaleno. Se corta la escena y se ve al grupo compartiendo el Magdaleno, feliz. **Propuesta:** después vienen los créditos y el cierre del juego.

## Comentarios de la huincha (versión base para ajustar)

Escritos con las muletillas y el tono que el juego ya usa para cada uno. En cada recuerdo, la fila del dueño está en primera persona. Todo es ajustable: cambia lo que no suene a ustedes.

### Al entrar a la huincha

| Quién mira | Comentario |
|---|---|
| Marcelo | ¿Y esto? Mira el weon… es el colegio. Y los recuerdos pasan como en una huincha. |
| Ruzio | Chale. La camanchaca me trajo al colegio. Esto no lo tenía en la ruta. |
| Pulga | Pero weon… ¿el colegio? Mis rodillas recuerdan este patio. |
| Tobi | ¡Yaaaa la cagooo! Volví al colegio. Y nadie me avisó que había que traer uniforme. |
| Pallo | La wea po weon. El colegio. Primero respiro, después veo qué hago aquí. |
| Coté | ¿El colegio? Ya, tranquila. Si la camanchaca me trajo aquí, es por algo. |

### Tobi · La mazamorrita

| Quién mira | Comentario |
|---|---|
| Marcelo | Ahh, esto es cuando Tobi se sacó la cresta bailando la mazamorrita. Mira el weon, con traje de huaso y todo. |
| Ruzio | Chale, la mazamorrita. Tobi dando vueltas de huaso hasta que el suelo le ganó. |
| Pulga | Pero weon, esto es cuando Tobi se cayó bailando. Y yo que pensaba que el de las caídas era yo. |
| Tobi | ¡Yaaaa la cagooo! Esto es cuando me saqué la cresta bailando la mazamorrita. Traje de huaso impecable, aterrizaje no tanto. |
| Pallo | Esto es cuando Tobi se sacó la cresta en la mazamorrita. Se levantó solo, eso sí: puro orgullo de huaso. |
| Coté | Ay, la mazamorrita. Tobi tan elegante de huaso… hasta la vuelta en que se fue al suelo. |

### Marcelo · La reja del estadio

| Quién mira | Comentario |
|---|---|
| Marcelo | Mira el weon… esto es cuando salté la reja del estadio. El plan era perfecto hasta que llegó la mano. |
| Ruzio | Esto es cuando Marcelo saltó la reja del estadio. Chale, la reja ganó y se quedó con un pedazo de mano. |
| Pulga | Pero weon, esto es cuando Marcelo saltó la reja y se rajó la mano. Plan cero, consecuencias mil. |
| Tobi | ¡Yaaaa la cagooo! Marcelo saltando la reja del estadio. Pasó él; la mano, no tanto. |
| Pallo | Esto es cuando Marcelo saltó la reja del estadio y se hirió la mano. Primero salta, después pregunta. |
| Coté | Esto es cuando Marcelo saltó la reja del estadio. Ni lo pensó, y la mano pagó la cuenta. |

### Pallo · El temblor

| Quién mira | Comentario |
|---|---|
| Marcelo | Ahh, esto es cuando tembló y Pallo arrancó con el cuello ortopédico. Parecía jirafa en simulacro de evacuación. |
| Ruzio | Chale, el temblor. Pallo arrancando con ese cuello ortopédico, sin poder mirar para ningún lado. |
| Pulga | Pero weon, esto es cuando tembló y Pallo salió corriendo con el cuello. Corría mirando solo para adelante. |
| Tobi | ¡Yaaaa la cagooo! Pallo arrancando del temblor con el cuello ortopédico. Ese cuello se veía desde el otro patio. |
| Pallo | La wea po weon… esto es cuando tembló y yo arranqué con el cuello ortopédico. Evacuación de manual, mirando fijo al frente. |
| Coté | Esto es cuando tembló y Pallo salió corriendo con su cuello ortopédico. Pobrecito, pero cómo nos reímos. |

### Ruzio · Las lentejas

| Quién mira | Comentario |
|---|---|
| Marcelo | Esto es cuando Ruzio comió lentejas con alcohol. Nadie auditó esa receta. |
| Ruzio | Chale… esto es cuando comí lentejas con alcohol. Las piernas iban para un lado y yo para el otro. |
| Pulga | Pero weon, esto es cuando a Ruzio lo emborracharon las lentejas. Caminaba en zigzag por todo el comedor. |
| Tobi | ¡Yaaaa la cagooo! Ruzio curado con lentejas. El único almuerzo que había que comer con moderación. |
| Pallo | Esto es cuando Ruzio comió lentejas con alcohol y no podía caminar derecho. Las legumbres más peligrosas del colegio. |
| Coté | Las lentejas de Ruzio… venían con sorpresa. Chocó con tres sillas antes de llegar a la puerta. |

### Pulga · La caída en el patio

| Quién mira | Comentario |
|---|---|
| Marcelo | Ahh, esto es cuando Pulga jugaba a perseguirse, chocó con medio curso y quedó tendido en el patio. |
| Ruzio | Chale, la persecución del patio. Pulga chocó con otros y quedó planchado en el piso. |
| Pulga | Pero weon… esto es cuando me caí jugando a perseguirnos. Choqué con otros, vi el cielo y después vi el piso. Mucho rato. |
| Tobi | ¡Yaaaa la cagooo! Pulga corriendo, choque múltiple y al suelo. Ahí quedó, tendido como alfombra. |
| Pallo | Esto es cuando Pulga chocó jugando a perseguirse y quedó tendido en el piso. Ese silencio en el patio no se me olvida. |
| Coté | Esto es cuando Pulga se cayó jugando y quedó tendido. Qué susto nos dio. |

### Coté · El estandarte

| Quién mira | Comentario |
|---|---|
| Marcelo | Esto es cuando Coté llevó el estandarte del colegio. La única vez que el desfile tuvo jefa de verdad. |
| Ruzio | Chale, Coté con el estandarte. Más firme que el asta. |
| Pulga | Pero weon, Coté con el estandarte del colegio. Ni el viento se atrevía a moverlo. |
| Tobi | ¡Coté con el estandarte! Seria, derechita y todo el colegio siguiéndola. |
| Pallo | Esto es cuando Coté llevó el estandarte del colegio. Ya entonces iba adelante, cuidando a los demás. |
| Coté | Esto es cuando llevé el estandarte del colegio. Pesaba más de lo que parecía, pero no lo iba a soltar. |

### Al terminar la huincha

| Quién mira | Comentario |
|---|---|
| Marcelo | Todos estos recuerdos tienen algo en común: estábamos juntos. |
| Ruzio | Chale. En ninguno estaba solo. |
| Pulga | Pero weon… en todos aparece la misma gente. |
| Tobi | ¡En todos estamos nosotros! Hasta en las caídas. |
| Pallo | En cada recuerdo alguien estaba ahí para levantar al otro. |
| Coté | En todos estábamos juntos. Eso no lo cambia ninguna botella. |

### Reflexión del regreso (parte 3)

| Quién mira | Comentario |
|---|---|
| Marcelo | Mira el weon… corrí por montañas, camanchaca y bajadas por una botella. El Magdaleno nunca fue el objetivo: el objetivo es con quién lo compartes. |
| Ruzio | Chale. Tanto camino por una botella, y lo que valía la pena venía conmigo. El Magdaleno se comparte o no sirve. |
| Pulga | Pero weon… me duelen las rodillas y recién lo entiendo: no era la botella, eran ustedes. |
| Tobi | ¡Yaaaa la cagooo! Todo este viaje por un Magdaleno, y lo importante era con quién tomarlo. |
| Pallo | La wea po weon. El Magdaleno no es el objetivo. Lo importante es con quién lo compartimos. |
| Coté | Ya entendí. El Magdaleno nunca fue lo importante. Lo importante es con quién lo compartimos. |

## Implementación

Se juega en `etapa4.html` y el código está en `src/etapa4.js`, `src/etapa4-data.js`, `src/etapa4-draw.js` y `etapa4.css`. Al completar la campaña, el menú permite saltar a cualquiera de las seis partes.

Qué incluye:
- **Parte 1:** conversación de la botella falsa en El Muñeco y entrada de la camanchaca.
- **Parte 2:** huincha con los seis recuerdos animados. Desde 0.10.2 el protagonista se detiene frente a cada uno hasta que termina su escena y se sigue con SEGUIR. Los amigos aparecen con uniforme, con la cara de su sprite real. Desde 0.10.7 esa cara aparece sin barba ni bigote, para que se vean como escolares. El comentario cambia según el protagonista y su recuerdo va al final.
- **Parte 3:** reflexión del protagonista y llegada del equipo, uno por uno.
- **Parte 4:**
  - Tres tramos con dos oleadas cada uno contra pasteros (cuerpo a cuerpo) y viejas sapas (lanzan chismes que hay que saltar; desde 0.10.3 levantan el brazo con un «!» medio segundo antes).
  - Desde 0.10.3 el protagonista pelea con su arma de la etapa 1 (Z) y carga energía para su definitiva (V), con el mismo efecto que en la etapa 1.
  - Los enemigos huyen con una frase al ser derrotados.
  - Desde 0.10.6 los tramos se llaman El Barrio, La Plaza y La Avenida, cada uno con sus lugares, y los enemigos tienen contorno y sombreado como los amigos.
  - El equipo ayuda por turnos, cada uno a su manera: Marcelo aturde, Ruzio golpea el suelo, Pulga remata, Tobi empuja, Pallo cura y Coté espanta con su «CORREEEE!!».
- **Parte 5:** PONG a 5 puntos contra Don Mario, con revancha si pierdes. Desde 0.10.4, en celular el campo, la pelota y las paletas se ven más grandes.
- **Parte 6:** desde 0.10.5, Don Mario entrega la botella con un gesto, el grupo brinda con «¡SALUD!» y pasan los créditos, que se pueden saltar. La campaña queda registrada como completada al llegar a la mesa.

Controles: ← → caminar, Espacio saltar, Z arma, V definitiva, ↑ ↓ en el PONG, Esc pausa. En celular aparecen botones táctiles según la parte.

Prueba automática: `node tools/etapa4-check.cjs [protagonista]` recorre las seis partes con controles normales y guarda capturas en `qa/etapa4/`. Con Marcelo, Tobi y Pallo terminó sin errores de página: 6 recuerdos, calle en unos 51 s simulados sin morir y PONG ganado 5 a 0. El bot del PONG sigue la pelota a la perfección, así que ese marcador no mide la dificultad para una persona.

Limitaciones actuales:
- Figuras, escenarios, Don Mario, pasteros y viejas sapas están dibujados por código como borrador. Las figuras escolares reutilizan la cara de los sprites actuales.
- Sin música propia. Desde 0.10.1 el avance se guarda por recuerdo, parte y tramo; el PONG se retoma desde 0 a 0.
- Duración real menor a la estimada: la calle y el PONG son cortos.
- Balance sin probar con personas.

## Preguntas abiertas

1. **Comentarios, reflexión y frases de Don Mario:** revisar la versión base y ajustar lo que no suene a ustedes.

## Recursos nuevos que harían falta

- Escenarios: pasillo de la huincha con camanchaca, los seis lugares de los recuerdos, calles de Buenos Aires hacia los arcades e interior del local de Don Mario.
- Personajes: los seis amigos con uniforme escolar (Coté con falda burdeo y blazer azul marino), Tobi con traje de huaso, Pallo con cuello ortopédico, compañeros y profesores genéricos, Don Mario, pasteros y viejas sapas.
- Mecánicas nuevas: la huincha de recuerdos (caminar y mirar) y el PONG. El combate reutiliza el motor de la etapa 1 y las ayudas de la etapa 3.

## Próximo paso

Revisar los comentarios base. La etapa ya está publicada con esos textos; cualquier ajuste se hace en `src/etapa4-data.js`.
