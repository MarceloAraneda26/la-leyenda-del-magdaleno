/* Etapa 2: tres carriles, cámara frontal, recorrido fijo y llegadas anunciadas. */
(() => {'use strict';
const P=window.Parral={length:2100,checkpoints:[0,520,1040,1560],saveKey:'magdaleno_parral_v1',coteAt:220,shoutDuration:6,shoutCooldown:22};
// La niebla gana terreno más rápido a medida que avanza la carrera; sin el grito de Coté termina alcanzando al jugador.
P.fogDecay=distance=>1.35+.55*distance/P.length;
P.cote={phrase:'CORREEEE!!',arrival:'¡Sigan, que yo la freno!',care:'Tranquilo, estoy contigo. Sigue avanzando.',welcomeCare:'Sigue, yo te cuido. Usa el GRITO si vuelve a acercarse.'};
P.kinds={hole:{name:'HOYO',hint:'SALTA O CAMBIA DE CARRIL',jump:28,reach:.46,penalty:19,slow:1.1},poop:{name:'CACA DE PERRO',hint:'SALTA O ESQUIVA',jump:13,reach:.26,penalty:13,slow:1.3},sleeper:{name:'PERSONA DURMIENDO',hint:'CAMBIA DE CARRIL',jump:Infinity,reach:.44,penalty:15,slow:.8}};
P.shops=[{at:180,name:'LA ESQUINA',line:'La primera botillería: cerrada. La camanchaca no espera.'},{at:690,name:'EL PUENTE',line:'Otra cortina abajo. Ni una luz, ni una botella.'},{at:1210,name:'LA ÚLTIMA',line:'Se llama «La Última». También está cerrada. Excelente señal.'},{at:1710,name:'EL RECREO',line:'Cerrado. Cerrado. Cerrado. Tiene que quedar algún vecino despierto.'}];
P.blocks=[{at:0,name:'CENTRO DE PARRAL'},{at:520,name:'LAS CORTINAS ABAJO'},{at:1040,name:'CALLES SIN RESPUESTA'},{at:1560,name:'LA ÚLTIMA CUADRA'}];
// El centro alterna obstáculos que se saltan con personas durmiendo: quedarse ahí saltando no alcanza para llegar.
P.makeObstacles=()=>{const rows=[],types=['hole','poop','sleeper','hole','poop','sleeper','hole'],center=['hole','sleeper','poop','sleeper','hole'];let i=0,c=0;
for(let at=80;at<P.length-100;at+=48){const safe=[0,1,-1,0,-1,1][i%6],blocked=[-1,0,1].filter(l=>l!==safe);const lanes=i<5?[blocked[i%2]]:i%4===0?blocked:[blocked[i%2]];for(const [j,lane]of lanes.entries())rows.push({id:'obstacle-'+i+'-'+j,at,lane,kind:lane===0?center[c++%center.length]:types[(i+j)%types.length]});i++;}return rows;};
P.ending={title:'UN VECINO DESPIERTO.',copy:'Bajo el acoplado del camión se reúnen los seis.\nCoté: «Ya, respiremos. Estamos todos».\nAl frente, una luz se enciende en «El Vecino», el clandestino.\nLa botella tendrá que esperar a la etapa 3.',teaser:'EL VECINO · CONTINUARÁ EN LA ETAPA 3'};
})();
