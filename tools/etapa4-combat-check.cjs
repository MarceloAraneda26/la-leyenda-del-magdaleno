/* Combate de la calle (etapa 4): arma propia, definitiva con energía, ayudas distintas y aviso del chisme. Uso: node tools/etapa4-combat-check.cjs */
const {chromium}=require('./browser.cjs'),unlock=require('./campaign-fixture.cjs'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const B=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/',out=path.join(__dirname,'../qa/etapa4');fs.mkdirSync(out,{recursive:true});
const HEROES=['marcelo','ruzio','pulga','tobi','pallo'];
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const errors=[],r={};try{
 const c=await b.newContext({viewport:{width:1280,height:720}}),p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await unlock(p,3);
 await p.goto(B+'etapa4.html?qa=1');await p.waitForFunction(()=>window.Etapa4?.loaded);
 const prep=hero=>p.evaluate(hero=>{const a=__e4;document.getElementById('e4-again').click();a.setHero(hero);a.begin(4);while(a.dialog())a.next();a.step(1);const s=a.st;
  s.waves.forEach(w=>{w.spawned=true;w.done=true;});s.lock=null;s.enemies=[];s.shots=[];s.helpT=999;s.p.x=1000;s.p.face=1;s.p.energy=0;a.step(1);
  window.__foe=(kind,dx,extra={})=>{const e={kind,wave:{},x:s.p.x+dx,y:s.p.y,hp:9,cd:99,wind:0,strike:0,windT:0,throwT:0,stun:0,hurt:0,face:-1,flee:false,t:0,say:'',sayT:0,...extra};s.enemies.push(e);return e;};},hero);
 for(const hero of HEROES){await prep(hero);
  // Arma: un enemigo a 60 px por delante recibe un golpe; uno detrás no.
  r[hero]=await p.evaluate(()=>{const a=__e4,s=a.st,front=__foe('pastero',60),back=__foe('pastero',-70);a.key('KeyZ',true);a.step(1);a.key('KeyZ',false);a.step(8);
   const mid={hp:front.hp,atras:back.hp};a.step(20);return{golpeAdelante:9-front.hp,golpeAtras:9-back.hp,energiaPorGolpe:Math.round(s.p.energy),mid};});
  await p.evaluate(()=>{const a=__e4;a.st.enemies=[];__foe('pastero',60);a.key('KeyZ',true);a.step(1);a.key('KeyZ',false);a.step(9);a.render();});await p.screenshot({path:`${out}/combate_${hero}_arma.png`});
  // Definitiva sin energía: aviso y nada más.
  r[hero].sinEnergia=await p.evaluate(()=>{const a=__e4,s=a.st;a.step(30);s.enemies=[];s.p.energy=10;a.key('KeyV',true);a.step(1);a.key('KeyV',false);return{ult:s.p.ult,aviso:document.getElementById('e4-caption').textContent};});
  // Definitiva con energía llena: daña a los cercanos.
  r[hero].definitiva=await p.evaluate(hero=>{const a=__e4,s=a.st;s.enemies=[];s.p.hp=50;s.p.energy=100;const cerca=__foe('pastero',110,{hp:9}),lejos=__foe('pastero',-130,{hp:9}),muyLejos=__foe('pastero',600,{hp:9});
   a.key('KeyV',true);a.step(1);a.key('KeyV',false);const usada=s.p.ult>0,boton=document.getElementById('e4-ult').classList.contains('is-ready');let n=0,shot=false;while((s.p.ult>0||s.pending.length)&&n++<300){a.step(1);if(!shot&&s.effects.length){shot=true;}}
   return{usada,energia:Math.round(s.p.energy),cerca:9-cerca.hp,atras:9-lejos.hp,muyLejos:9-muyLejos.hp,aturdido:cerca.stun>0,vida:s.p.hp,efecto:shot,boton};},hero);
  await p.evaluate(()=>{const a=__e4,s=a.st;s.enemies=[];__foe('pastero',110);s.p.energy=100;a.key('KeyV',true);a.step(1);a.key('KeyV',false);let n=0;while(!s.p.ultUsed&&n++<200)a.step(1);a.step(4);});await p.screenshot({path:`${out}/combate_${hero}_definitiva.png`});
 }
 // Botón táctil listo cuando la energía está llena.
 r.botonListo=await p.evaluate(()=>{const a=__e4;a.st.p.energy=100;a.step(1);return document.getElementById('e4-ult').classList.contains('is-ready');});
 // Chisme: la vieja sapa avisa medio segundo antes de lanzar.
 r.chisme=await p.evaluate(()=>{const a=__e4,s=a.st;s.enemies=[];s.shots=[];const e=__foe('sapa',300,{cd:0});a.step(1);const aviso=e.windT>0,sinDisparo=s.shots.length===0;a.render();return{aviso,sinDisparo,windT:+e.windT.toFixed(2)};});
 await p.screenshot({path:`${out}/combate_chisme_aviso.png`});
 r.chismeLanzado=await p.evaluate(()=>{const a=__e4;a.step(32);return a.st.shots.length;});
 // Ayudas: cada compañero hace algo distinto (Pallo cura si hay vida perdida).
 r.ayudas=await p.evaluate(()=>{const a=__e4,s=a.st,out=[];a.setHero('marcelo');a.begin(4);while(a.dialog())a.next();a.step(1);s.waves.forEach(w=>{w.spawned=true;w.done=true;});s.lock=null;s.enemies=[];
  for(let i=0;i<5;i++){s.enemies=[];s.p.hp=60;const e=__foe('pastero',120,{hp:9});s.helpT=0;a.step(1);out.push({texto:s.fx.filter(f=>f.kind==='text').map(f=>f.text).pop(),danio:9-e.hp,aturdido:e.stun>0,vida:s.p.hp});s.fx=[];s.effects=[];}return out;});
 r.errores=errors;console.log(JSON.stringify(r,null,1));
 for(const h of HEROES){const x=r[h];assert.equal(x.golpeAdelante,1,h+' arma adelante');assert.equal(x.golpeAtras,0,h+' arma atrás');assert(x.energiaPorGolpe>0,h+' energía');assert.equal(x.sinEnergia.ult,0,h);assert.match(x.sinEnergia.aviso,/ENERGÍA/);
  assert(x.definitiva.usada&&x.definitiva.cerca>=2&&x.definitiva.muyLejos===0&&x.definitiva.efecto&&x.definitiva.energia<5,h+' definitiva '+JSON.stringify(x.definitiva));}
 assert(r.marcelo.definitiva.aturdido,'Marcelo aturde');assert(r.pallo.definitiva.vida>50,'Pallo cura');assert.equal(r.pallo.definitiva.atras,0,'Pallo solo hacia adelante');assert(r.ruzio.definitiva.atras>=2,'Ruzio en ambos lados');
 assert(r.botonListo);assert(r.chisme.aviso&&r.chisme.sinDisparo);assert.equal(r.chismeLanzado,1);
 assert.equal(new Set(r.ayudas.map(x=>x.texto)).size,5,'ayudas distintas');assert.equal(errors.length,0);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
