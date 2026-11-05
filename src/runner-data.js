/* Etapa 2: tres carriles, cámara frontal, recorrido fijo y llegadas anunciadas. */
(() => {'use strict';
const P=window.Parral={length:2100,checkpoints:[0,520,1040,1560],saveKey:'magdaleno_parral_v1',coteAt:220,shoutDuration:6,shoutCooldown:22};
P.kinds={hole:{name:'HOYO',hint:'SALTA O CAMBIA DE CARRIL',jump:28,reach:.46,penalty:19,slow:1.1},poop:{name:'CACA DE PERRO',hint:'SALTA O ESQUIVA',jump:13,reach:.26,penalty:13,slow:1.3},sleeper:{name:'PERSONA DURMIENDO',hint:'CAMBIA DE CARRIL',jump:Infinity,reach:.44,penalty:15,slow:.8}};
P.shops=[{at:180,name:'LA ESQUINA',line:'La primera botillería: cerrada. La camanchaca no espera.'},{at:690,name:'EL PUENTE',line:'Otra cortina abajo. Ni una luz, ni una botella.'},{at:1210,name:'LA ÚLTIMA',line:'Se llama «La Última». También está cerrada. Excelente señal.'},{at:1710,name:'EL RECREO',line:'Cerrado. Cerrado. Cerrado. Tiene que quedar algún vecino despierto.'}];
P.blocks=[{at:0,name:'CENTRO DE PARRAL'},{at:520,name:'LAS CORTINAS ABAJO'},{at:1040,name:'CALLES SIN RESPUESTA'},{at:1560,name:'LA ÚLTIMA CUADRA'}];
P.makeObstacles=()=>{const rows=[],types=['hole','poop','sleeper','hole','poop','sleeper','hole'];let i=0;
for(let at=80;at<P.length-100;at+=48){const safe=[0,1,-1,0,-1,1][i%6],blocked=[-1,0,1].filter(l=>l!==safe);const lanes=i<5?[blocked[i%2]]:i%4===0?blocked:[blocked[i%2]];for(const [j,lane]of lanes.entries()){let kind=types[(i+j)%types.length];if(kind==='sleeper'&&lane===0)kind='hole';rows.push({id:'obstacle-'+i+'-'+j,at,lane,kind});}i++;}return rows;};
P.ending={title:'UN VECINO DESPIERTO.',copy:'Bajo el camión te esperan tus otros cuatro amigos… y Coté.\nAl frente, una luz se enciende en «El Vecino», el clandestino.\nTodavía no hay botella. Falta tocar esa puerta.',teaser:'EL VECINO · CONTINUARÁ EN LA ETAPA 3'};
})();
