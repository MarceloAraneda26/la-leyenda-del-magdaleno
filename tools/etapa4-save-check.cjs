/* Guardado de la etapa 4: cada parte se recupera tras recargar, sin tocar otras partidas. Uso: node tools/etapa4-save-check.cjs */
const {chromium}=require('./browser.cjs'),unlock=require('./campaign-fixture.cjs'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const B=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/',out=path.join(__dirname,'../qa/etapa4');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const errors=[],r={};try{
 const c=await b.newContext({viewport:{width:1280,height:720}}),p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await unlock(p,3);
 const open=async()=>{await p.goto(B+'etapa4.html?qa=1');await p.waitForFunction(()=>window.Etapa4?.loaded);};
 const reload=async()=>{await p.reload();await p.waitForFunction(()=>window.Etapa4?.loaded);return{visible:await p.isVisible('#e4-continue'),texto:await p.textContent('#e4-continue')};};
 await open();const before=await p.evaluate(()=>Object.fromEntries(['magdaleno_campaign_v1','magdaleno_capitulo1_v1','magdaleno_parral_v1','magdaleno_scooter_v1'].map(k=>[k,localStorage.getItem(k)])));
 r.sinGuardado=await p.isVisible('#e4-continue');assert.equal(r.sinGuardado,false);
 // Huincha: dos recuerdos vistos.
 await p.evaluate(()=>{const a=__e4;a.setHero('tobi');a.begin(1);while(a.dialog())a.next();a.step(200);const walk=c=>{a.key('ArrowRight',true);let n=0;while(c()&&n++<60*600){a.step(1);if(a.hu.focus&&a.hu.ready){a.key('Enter',true);a.step(1);a.key('Enter',false);a.key('ArrowRight',true);}}a.key('ArrowRight',false);};walk(()=>a.hu.frames.filter(f=>f.seen).length<2);});
 let k=await reload();assert(k.visible&&k.texto.includes('TOBI')&&k.texto.includes('LOS RECUERDOS'),k.texto);await p.click('#e4-continue');
 r.huincha=await p.evaluate(()=>({mode:__e4.mode(),vistos:__e4.hu.frames.filter(f=>f.seen>.5).map(f=>f.id),x:Math.round(__e4.hu.x),siguiente:__e4.hu.frames.find(f=>!f.seen)?.x}));assert.equal(r.huincha.mode,'huincha');assert.equal(r.huincha.vistos.length,2);assert(r.huincha.x<r.huincha.siguiente);
 // Regreso.
 await p.evaluate(()=>{const a=__e4;const walk=c=>{a.key('ArrowRight',true);let n=0;while(c()&&n++<60*600){a.step(1);if(a.hu.focus&&a.hu.ready){a.key('Enter',true);a.step(1);a.key('Enter',false);a.key('ArrowRight',true);}}a.key('ArrowRight',false);};walk(()=>a.mode()==='huincha');});k=await reload();assert(k.texto.includes('EL REGRESO'),k.texto);await p.click('#e4-continue');await p.waitForTimeout(1200);
 r.regreso=await p.evaluate(()=>({mode:__e4.mode(),dialogo:__e4.dialog()?.n}));assert.equal(r.regreso.mode,'cut');assert(r.regreso.dialogo>0);
 // Calle: alcanzar el tramo 2.
 await p.evaluate(()=>{const a=__e4;while(a.dialog())a.next();a.step(1);a.st.p.x=2050;a.step(2);});k=await reload();assert(k.texto.includes('TRAMO 2 DE 3'),k.texto);await p.click('#e4-continue');
 r.calle=await p.evaluate(()=>({mode:__e4.mode(),tramo:__e4.st.tramo,x:Math.round(__e4.st.p.x)}));assert.deepEqual(r.calle,{mode:'street',tramo:1,x:2000});
 // PONG, con un punto en contra: se retoma 0 a 0.
 await p.evaluate(()=>{const a=__e4;a.st.p.x=5450;a.st.waves.forEach(w=>{w.spawned=true;w.done=true;});a.st.lock=null;a.st.enemies=[];a.step(1);});
 r.pongAntes=await p.evaluate(()=>__e4.mode());k=await reload();assert(k.texto.includes('EL PONG'),k.texto);await p.click('#e4-continue');
 r.pong=await p.evaluate(()=>({mode:__e4.mode(),me:__e4.pg.me,him:__e4.pg.him}));assert.deepEqual(r.pong,{mode:'pong',me:0,him:0});
 // Final.
 await p.evaluate(()=>__e4.begin(6));k=await reload();assert(k.texto.includes('EL FINAL'),k.texto);await p.click('#e4-continue');await p.waitForTimeout(1300);await p.evaluate(()=>__e4.step(80));r.final=await p.isVisible('#e4-end');assert(r.final);
 // Empezar de nuevo pide confirmación y no borra al primer toque.
 await p.click('#e4-again');await p.click('#e4-start');r.confirmacion=await p.textContent('#e4-start');assert.match(r.confirmacion,/BORRAR/);r.sigueEnMenu=await p.isVisible('#e4-title');assert(r.sigueEnMenu);
 // Guardado inválido: se descarta.
 await p.evaluate(()=>{localStorage.setItem('magdaleno_etapa4_v1','{"version":1,"hero":"extraño","part":"pong"}');sessionStorage.removeItem('magdaleno_etapa4_v1');});k=await reload();r.invalido=k.visible;assert.equal(k.visible,false);
 const after=await p.evaluate(()=>Object.fromEntries(['magdaleno_campaign_v1','magdaleno_capitulo1_v1','magdaleno_parral_v1','magdaleno_scooter_v1'].map(k=>[k,localStorage.getItem(k)])));
 r.otrasPartidas=JSON.stringify(before['magdaleno_capitulo1_v1'])===JSON.stringify(after['magdaleno_capitulo1_v1'])&&before['magdaleno_parral_v1']===after['magdaleno_parral_v1']&&before['magdaleno_scooter_v1']===after['magdaleno_scooter_v1'];assert(r.otrasPartidas);
 // Encuadres: punto más alto del salto de Marcelo y retrato de Don Mario.
 await p.evaluate(()=>{const a=__e4;a.setHero('pulga');a.begin(2);const f=a.hu.frames.find(f=>f.id==='marcelo');a.hu.x=f.x;a.step(1);f.t=3.0;a.render();});await p.screenshot({path:out+'/encuadre_marcelo_salto.png'});
 await p.evaluate(()=>__e4.begin(5));await p.waitForTimeout(700);await p.screenshot({path:out+'/encuadre_mario_retrato.png'});
 const m=await b.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2}),mp=await m.newPage();mp.on('pageerror',e=>errors.push(String(e)));await unlock(mp,3);await mp.goto(B+'etapa4.html?qa=1');await mp.waitForFunction(()=>window.Etapa4?.loaded);
 r.movilHuincha=await mp.evaluate(()=>{const a=__e4;a.begin(2);const f=a.hu.frames[0];a.hu.x=f.x;a.step(2);a.render();const cap=document.getElementById('e4-caption').getBoundingClientRect(),el=document.getElementById('game').getBoundingClientRect(),k=Math.min(el.width/960,el.height/540),ox=el.left+(el.width-960*k)/2,oy=el.top+(el.height-540*k)/2,hx=ox+(a.hu.x-Math.max(0,a.hu.x-330))*k,heroRight=hx+34*k,frameBottom=oy+350*k;return{noTapaHeroe:cap.left>heroRight,noTapaRecuerdo:cap.top>=frameBottom,cap:[Math.round(cap.left),Math.round(cap.top),Math.round(cap.right),Math.round(cap.bottom)],heroRight:Math.round(heroRight),frameBottom:Math.round(frameBottom)};});
 await mp.screenshot({path:out+'/encuadre_movil_huincha.png'});assert(r.movilHuincha.noTapaHeroe&&r.movilHuincha.noTapaRecuerdo,JSON.stringify(r.movilHuincha));await m.close();
 r.errores=errors;console.log(JSON.stringify(r,null,1));assert.equal(errors.length,0);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
