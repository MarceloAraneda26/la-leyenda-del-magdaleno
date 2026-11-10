/* Recorrido automático de la etapa 4 con controles normales y capturas. Uso: node tools/etapa4-check.cjs [héroe] */
const {chromium}=require('./browser.cjs'),unlock=require('./campaign-fixture.cjs'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const B=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/',hero=process.argv[2]||'marcelo',out=process.env.E4_SHOTS||path.join(__dirname,'../qa/etapa4');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const errors=[];try{
 const p=await b.newPage({viewport:{width:1280,height:720}});await unlock(p,3);p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto(B+'etapa4.html?qa=1');await p.waitForFunction(()=>window.Etapa4?.loaded);await p.screenshot({path:out+'/0_menu.png'});
 const shot=async n=>{await p.evaluate(()=>__e4.render());await p.screenshot({path:out+'/'+n+'.png'});};
 const drain=async(max=40)=>{for(let i=0;i<max&&await p.evaluate(()=>!!__e4.dialog());i++)await p.evaluate(()=>__e4.next());};
 const r={hero};await p.evaluate(h=>{__e4.setHero(h);__e4.begin(1);},hero);await shot('1_botella');await drain();await p.evaluate(()=>__e4.step(200));assert.equal(await p.evaluate(()=>__e4.mode()),'huincha');
 // Huincha: caminar a la derecha con la flecha, deteniéndose en cada recuerdo.
 // Huincha: caminar a la derecha; en cada recuerdo el protagonista se detiene, la escena corre completa y se sigue con Enter.
 const mid={tobi:4.6,marcelo:3,pallo:2.5,ruzio:3,pulga:4,cote:2.5};await p.evaluate(()=>__e4.key('ArrowRight',true));let shots=0,frames=0;const taken=new Set();for(let i=0;i<2000;i++){const s=await p.evaluate(()=>{const a=__e4;a.step(10);return{mode:a.mode(),focus:a.hu.focus?.id,t:a.hu.focus?.t,ready:a.hu.ready,boton:!document.getElementById('e4-hu-next').hidden,cap:document.getElementById('e4-caption').textContent};});frames+=10;if(s.mode!=='huincha')break;if(s.focus&&!taken.has(s.focus)&&s.t>=mid[s.focus]){taken.add(s.focus);r['f_'+s.focus]=s.cap;assert.equal(s.boton,false,'SEGUIR aparece antes de terminar el recuerdo');await shot('2_recuerdo_'+(++shots)+'_'+s.focus);}if(s.focus&&s.ready){assert.equal(s.boton,true);await p.evaluate(()=>{const a=__e4;a.key('Enter',true);a.step(1);a.key('Enter',false);a.key('ArrowRight',true);});}}r.huinchaSegundos=Math.round(frames/60);
 await p.evaluate(()=>__e4.key('ArrowRight',false));r.recuerdos=shots;assert.equal(shots,6);
 for(let i=0;i<40&&await p.evaluate(()=>!__e4.dialog());i++)await p.evaluate(()=>__e4.step(20));await p.evaluate(()=>__e4.step(90));await p.waitForTimeout(400);await shot('3_regreso');await p.evaluate(()=>__e4.step(1));r.regresoLineas=await p.evaluate(()=>__e4.dialog().n);await drain();await p.evaluate(()=>__e4.step(1));
 // Calle: bot simple que avanza, golpea y salta los chismes.
 assert.equal(await p.evaluate(()=>__e4.mode()),'street');let shotStreet=false;
 const res=await p.evaluate(async()=>{const a=__e4;let f=0,deaths=0,last=0;while(a.mode()==='street'&&f++<60*240){const s=a.st,pl=s.p;if(s.dead&&!last){deaths++;}last=s.dead;const live=s.enemies.filter(e=>!e.flee);const near=live.sort((x,y)=>Math.abs(x.x-pl.x)-Math.abs(y.x-pl.x))[0];let right=true,left=false;if(near){const dx=near.x-pl.x;right=dx>40;left=dx<-40;if(Math.abs(dx)<70)a.key('KeyZ',f%10<5);else a.key('KeyZ',false);}else a.key('KeyZ',false);const shot=s.shots.find(q=>Math.abs(q.x-pl.x)<120&&Math.sign(pl.x-q.x)===Math.sign(q.vx));a.key('Space',!!shot&&pl.on);a.key('ArrowRight',right);a.key('ArrowLeft',left);a.step(1);}['KeyZ','Space','ArrowRight','ArrowLeft'].forEach(k=>a.key(k,false));return{frames:f,deaths,mode:a.mode(),tramo:a.st.tramo};});
 r.calle=res;assert.equal(res.mode,'pong');
 // PONG: el bot sigue la pelota.
 await shot('4_pong_inicio');await drain();const pong=await p.evaluate(()=>{const a=__e4;let f=0,matches=0;while(f++<60*300){const pg=a.pg;if(a.dialog()){a.next();matches++;continue;}if(a.mode()!=='pong')break;const target=pg.ball?pg.ball.y:300;a.key('ArrowUp',target<pg.py-8);a.key('ArrowDown',target>pg.py+8);a.step(1);if(f===600)a.render();}a.key('ArrowUp',false);a.key('ArrowDown',false);return{frames:f,me:a.pg.me,him:a.pg.him,mode:a.mode(),dialogs:matches};});
 r.pong=pong;
 // Cierre: entrega de Don Mario, brindis, créditos (se saltan con Enter) y pantalla final.
 await p.evaluate(()=>__e4.step(110));await shot('5_entrega');await p.evaluate(()=>__e4.step(100));await p.waitForTimeout(50);await p.evaluate(()=>__e4.step(140));await shot('5_brindis');
 r.campanaAntesDeCreditos=await p.evaluate(()=>__e4.M.campaign.snapshot().completed);await p.evaluate(()=>__e4.step(260));await shot('5_creditos');
 r.creditos=await p.evaluate(()=>({sub:__e4.cs.sub,saltar:!document.getElementById('e4-skip').hidden}));
 await p.evaluate(()=>{const a=__e4;a.key('Enter',true);a.step(1);a.key('Enter',false);a.step(2);});await shot('5_final');
 r.cierre=await p.evaluate(()=>({sub:__e4.cs.sub,fin:!document.getElementById('e4-end').hidden,nota:document.getElementById('e4-end-note').textContent,saltar:!document.getElementById('e4-skip').hidden}));
 assert.equal(r.campanaAntesDeCreditos,4);assert.deepEqual(r.creditos,{sub:'credits',saltar:true});assert(r.cierre.fin&&!r.cierre.saltar&&/4 de 4/.test(r.cierre.nota),JSON.stringify(r.cierre));
 // Mitad de una pelea, para revisar enemigos.
 await p.evaluate(()=>{__e4.begin(4);__e4.key('ArrowRight',true);__e4.step(170);__e4.key('ArrowRight',false);__e4.step(200);});await shot('4_calle_pelea');
 await p.evaluate(()=>{__e4.begin(5);});await drain();await p.evaluate(()=>{__e4.step(200);});await shot('4_pong_juego');
 // Móvil horizontal.
 const m=await b.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2});const mp=await m.newPage();await unlock(mp,3);mp.on('pageerror',e=>errors.push(String(e)));await mp.goto(B+'etapa4.html?qa=1');await mp.waitForFunction(()=>window.Etapa4?.loaded);await mp.screenshot({path:out+'/6_movil_menu.png'});await mp.evaluate(()=>{__e4.begin(4);__e4.step(30);__e4.render();});await mp.screenshot({path:out+'/6_movil_calle.png'});await mp.evaluate(()=>{__e4.begin(2);__e4.step(30);__e4.render();});await mp.screenshot({path:out+'/6_movil_huincha.png'});await m.close();
 r.errores=errors;console.log(JSON.stringify(r,null,1));assert.equal(errors.length,0,'Errores de página: '+errors.join(' | '));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
