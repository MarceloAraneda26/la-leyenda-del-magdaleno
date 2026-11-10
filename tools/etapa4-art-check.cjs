/* Arte de la calle (etapa 4): capturas de los enemigos en cada pose y de los hitos de los tres tramos. Uso: node tools/etapa4-art-check.cjs [carpeta] */
const {chromium}=require('./browser.cjs'),unlock=require('./campaign-fixture.cjs'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const B=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/',out=process.argv[2]||path.join(__dirname,'../qa/etapa4');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const errors=[],r={};try{
 const c=await b.newContext({viewport:{width:1280,height:720}}),p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await unlock(p,3);
 await p.goto(B+'etapa4.html?qa=1');await p.waitForFunction(()=>window.Etapa4?.loaded);
 await p.evaluate(()=>{const a=__e4;a.setHero('ruzio');a.begin(4);while(a.dialog())a.next();a.step(1);const s=a.st;s.waves.forEach(w=>{w.spawned=true;w.done=true;});s.lock=null;s.enemies=[];s.helpT=999;});
 // Enemigos: reposo, caminando, preparando, golpeando o lanzando, y huyendo.
 r.poses=await p.evaluate(()=>{const a=__e4,s=a.st;s.p.x=1300;s.p.face=1;a.step(1);const base={wave:{},y:s.p.y,hp:9,cd:99,wind:0,strike:0,windT:0,throwT:0,stun:0,hurt:0,face:-1,flee:false,t:.4,say:'',sayT:0,walk:false};
  s.enemies=[{...base,kind:'pastero',x:1420},{...base,kind:'pastero',x:1500,walk:true,t:.2},{...base,kind:'pastero',x:1580,wind:.3},{...base,kind:'pastero',x:1660,strike:.2},{...base,kind:'sapa',x:1740},{...base,kind:'sapa',x:1820,windT:.3},{...base,kind:'sapa',x:1900,throwT:.2}];
  s.comp=[];a.render();return s.enemies.length;});
 await p.screenshot({path:out+'/arte_enemigos_poses.png'});
 // Primer plano de los enemigos junto al protagonista.
 await p.evaluate(()=>{const a=__e4,s=a.st;s.enemies=s.enemies.slice(0,1).concat(s.enemies.slice(5,6));s.enemies[0].x=1400;s.enemies[1].x=1480;a.render();});
 await p.screenshot({path:out+'/arte_enemigos_detalle.png',clip:{x:300,y:360,width:520,height:300}});
 // Hitos de cada tramo.
 const spots=[['tramo1_almacen',700],['tramo1_paradero',1350],['tramo2_plaza',2600],['tramo2_kiosco',3300],['tramo3_fuente',4500],['tramo3_schop',5000],['tramo3_llegada',5400]];
 r.tramos={};for(const [name,x] of spots){r.tramos[name]=await p.evaluate(x=>{const a=__e4,s=a.st;s.enemies=[];s.p.x=x;a.step(2);return{tramo:s.tramo+1,hud:s.tramo};},x);await p.screenshot({path:`${out}/arte_${name}.png`});}
 r.errores=errors;console.log(JSON.stringify(r,null,1));assert.equal(r.poses,7);assert.equal(errors.length,0);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
