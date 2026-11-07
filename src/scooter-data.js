/* Etapa 3 local: rumbo a Buenos Aires. Las semillas y los rescates sobreviven al reintento. */
(() => {'use strict';
const M=window.Magdaleno;
const S=window.Scooter={length:5200,downhillAt:3500,checkpoints:[0,900,1800,2700,3500,4300],saveKey:'magdaleno_scooter_v1',saveVersion:2,rescueAt:[620,1960],viewScale:1.6};
S.names={...Object.fromEntries(M.order.map(id=>[id,M.heroes[id].name])),cote:'Coté'};
S.blocks=[{at:0,name:'EL VECINO · SIN STOCK'},{at:900,name:'CALLES EN OBRAS'},{at:1800,name:'RUMBO A BUENOS AIRES'},{at:2700,name:'LA CIMA DEL BARRIO'},{at:3500,name:'LA BAJADA DE BUENOS AIRES'},{at:4300,name:'ÚLTIMAS CUADRAS · EL MUÑECO'}];
S.kinds={hole:{name:'HOYO',hint:'SALTA O CAMBIA DE CARRIL',jump:27,reach:.43,span:3},cone:{name:'OBRAS',hint:'SALTA O ESQUIVA',jump:20,reach:.39,span:3},car:{name:'AUTO',hint:'CAMBIA DE CARRIL · NO SE SALTA',jump:Infinity,reach:.45,span:40}};
S.pickCompanions=(hero,seed)=>{const pool=[...M.order,'cote'].filter(id=>id!==hero),random=M.rng(seed);for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,2);};
S.makeObstacles=seed=>{const random=M.rng(seed^0x78b3),rows=[];let i=0;for(let at=150;at<S.length-80;at+=at<S.downhillAt?112:140){
 if(S.rescueAt.some(r=>Math.abs(at-r)<125))continue;
 const safe=Math.floor(random()*3)-1,blocked=[-1,0,1].filter(l=>l!==safe),double=at>=S.downhillAt?i%4!==3:i%3===2,lanes=double?blocked:[blocked[Math.floor(random()*2)]];
 for(const [j,lane]of lanes.entries())rows.push({id:'scooter-'+i+'-'+j,at,lane,kind:at>=S.downhillAt?'car':i%4===0?'hole':i%4===1?'cone':'car',color:Math.floor(random()*5),checked:false});i++;
 }return rows;};
S.nominalSpeed=distance=>distance<S.downhillAt?25+Math.min(5,distance/350):46+Math.min(16,(distance-S.downhillAt)/36);
S.vendor='La Vieja Califa acomoda su delantal. Parece una almacenera cualquiera, pero los mira como si ya supiera a qué vienen.\n«Magdaleno tengo. Plata no quiero: déjenme los tres scooters y hacemos trato».\nHace una pausa demasiado larga. Después acerca la botella.';
})();
