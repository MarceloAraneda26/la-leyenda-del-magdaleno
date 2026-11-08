/* Conversaciones de cierre: los interlocutores se adaptan al grupo de la partida. */
(() => {'use strict';
const M=window.Magdaleno,line=(who,text)=>({who,text});
const hello={marcelo:'Mira el weon… llegamos vivos. Mi plan contemplaba esto. Más o menos.',ruzio:'Chale. He subido cerros más tranquilos que esta calle.',pulga:'Pero weon… necesito un minuto para convencer a mis rodillas.',tobi:'¡Yaaaa la cagooo! Esto cuenta como entrenamiento, ¿cierto?',pallo:'La wea po weon. Primero respiramos. Después vemos qué nos duele.'};
const scooter={marcelo:'Hay scooters al lado del camión. Tecnología, amigos. Esta vez sí tengo un plan.',ruzio:'Con esos scooters llegamos. Pero yo revisaría los frenos antes de la bajada.',pulga:'Esos scooters me sirven. Mis rodillas acaban de votar por no correr más.',tobi:'¡En scooter! Yo los acompaño. Pero nada de hacerse el valiente con los autos.',pallo:'Podemos ir en esos scooters. Nadie cruza solo y nadie se queda atrás.'};
const suspicion={marcelo:'Qué raro. Acepta scooters y no acepta transferencia. Esto no pasó ninguna auditoría.',ruzio:'Chale. Yo quería el licor, no cambiar todo el parque de vehículos.',pulga:'Un momento. ¿Estamos seguros de que escuchamos bien el precio?',tobi:'¡Yaaaa la cagooo! Si entregamos los scooters, la vuelta será caminando.',pallo:'Puedo pagarle, señora. Eso de cobrar con nuestros scooters no me deja tranquilo.',cote:'¿Los tres scooters? Ya, pero nadie decide por los demás. Aquí seguimos juntos.'};
const ask={marcelo:'Probemos una pregunta fácil: ¿le queda Magdaleno? Estamos agotando el mapa.',ruzio:'¿Le queda Magdaleno, señora? Venimos de la montaña y estamos secos.',pulga:'Díganos que esta vez sí queda. Ya no me da la rodilla para otra botillería.',tobi:'¡Nos mandaron desde El Vecino! Después de esa bajada merecemos una buena noticia.',pallo:'Antes de negociar: estamos los tres bien. Ahora sí, ¿le queda Magdaleno?',cote:'Ya llegamos juntos. ¿Le queda Magdaleno? Que estos amigos ya han corrido bastante.'};
const relief={marcelo:'¡Al fin! Voy a registrar esto como una victoria. Todavía no sé en qué planilla.',ruzio:'Por fin. La próxima salida la organizo yo: al campo y sin camanchaca.',pulga:'Bien. Ahora podemos sentarnos. Eso incluye a mis rodillas.',tobi:'¡Llegamos todos! Yo ya estaba viendo venir otra bajada.',pallo:'Estamos todos bien y la botella está aquí. Por una vez, parece que resultó.',cote:'Ya. Respiren. Estoy con ustedes. ¿Vieron que podíamos llegar juntos?'};
const debt={marcelo:'«Ahora me deben un favor». Eso no estaba en los términos y condiciones.',ruzio:'«Ahora me deben un favor». Chale. Prefiero que me cobre en efectivo.',pulga:'«Ahora me deben un favor». Pero weon… ¿qué acabamos de firmar?',tobi:'«Ahora me deben un favor». ¡Yaaaa la cagooo! Este recibo viene con misión extra.',pallo:'«Ahora me deben un favor». Una deuda sin condiciones claras. Esto no me gusta.',cote:'«Ahora me deben un favor». Oiga, una cosa es el trueque y otra meter a mis amigos en algo raro.'};
M.stories={
 parral(hero){const others=M.order.filter(id=>id!==hero);return{id:'parral-ending',location:'BAJO EL ACOPLADO · EL VECINO',lastLabel:'CERRAR CONVERSACIÓN',lines:[
  line('cote','¡CORREEEE!! ¡Debajo del acoplado! Ya… acá no nos alcanza. Respiren, estamos todos.'),
  line(hero,hello[hero]),
  line('camanchaca','Mañana hay que madrugar… responder correos… pagar cuentas…'),
  line('cote','Ahora no. Mis amigos necesitan un respiro. ¡Sigue de largo!'),
  line(others[0],'Esperen. Al frente sigue una luz encendida. Dice «El Vecino».'),
  line('vecino','Bajen la voz. Me dicen el Vecino Clandestino por algo. ¿Qué andan buscando a esta hora?'),
  line(hero,'Coñac Magdaleno. Bajamos de la montaña, cruzamos la niebla… no nos diga que tampoco queda.'),
  line('vecino','Agotado. Pero prueben en «El Muñeco», en el barrio Buenos Aires. Está al otro lado de la bajada.'),
  line(others[1],scooter[others[1]]),
  line(hero,'Entonces seguimos. Si nos separamos, nos encontramos en El Muñeco. Y al que se quede atascado, lo vamos a buscar.')
 ]};},
 califa(hero,helpers){return{id:'califa-arrival',location:'BOTILLERÍA EL MUÑECO · LA VIEJA CALIFA',lastLabel:'ESCUCHAR EL TRATO',lines:[
  line('califa','Miren quiénes llegaron. Les costó la bajadita, ¿ah? Los estaba esperando.'),
  line(hero,hello[hero]),
  line(helpers[0],ask[helpers[0]]),
  line('califa','Magdaleno tengo. Plata no quiero. Déjenme los tres scooters y la botella es de ustedes.'),
  line(helpers[1],suspicion[helpers[1]]),
  line(hero,'¿Los tres scooters por una botella? Partimos buscando una botillería, no haciendo una liquidación.'),
  line('califa','Los tres. Sin apuro. Conversen entre ustedes… yo puedo esperar.')
 ]};},
 receipt(hero,helpers){return{id:'califa-ending',location:'EL MUÑECO · DESPUÉS DEL TRUEQUE',lastLabel:'VER EL RECIBO',lines:[
  line(hero,'Listo. Los tres scooters por el Magdaleno. Trato hecho… ¿cierto?'),
  line(helpers[0],relief[helpers[0]]),
  line('califa','Casi. Todo negocio lleva su comprobante. Tomen, para que no se les olvide.'),
  line(helpers[1],debt[helpers[1]]),
  line(hero,'Un momento. ¿Qué favor? Ya le entregamos los scooters.'),
  line('califa','Cuando llegue el momento, se van a acordar de mí. Por ahora… disfruten su Magdaleno.')
 ]};}
};
})();
