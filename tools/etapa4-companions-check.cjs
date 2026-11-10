/* Escena de la botella falsa (etapa 4): aparecen los dos acompañantes de la etapa 3, o dos amigos fijos si no hay registro. Uso: node tools/etapa4-companions-check.cjs [carpeta] */
const {chromium}=require('./browser.cjs'),unlock=require('./campaign-fixture.cjs'),assert=require('assert/strict');
const out=process.argv[2]||require('path').join(__dirname,'../qa/etapa4');require('fs').mkdirSync(out,{recursive:true});const B=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/';
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const errs=[],r={};try{const p=await (await b.newContext({viewport:{width:1280,height:720}})).newPage();p.on('pageerror',e=>errs.push(String(e)));await unlock(p,3);
 await p.goto(B+'etapa4.html?qa=1');await p.waitForFunction(()=>window.Etapa4?.loaded);
 const run=async(hero,save,shot)=>{return p.evaluate(async([hero,save])=>{if(save)localStorage.setItem('magdaleno_scooter_v1',JSON.stringify(save));else localStorage.removeItem('magdaleno_scooter_v1');const a=__e4;a.setHero(hero);a.begin(1);a.step(.3);const lines=[];while(a.dialog()){const d=document;lines.push(d.getElementById('e4-speaker').textContent+': '+d.getElementById('e4-line').textContent);if(lines.length===2)break;a.next();}a.render();return{pair:a.pair(),lines};},[hero,save]).then(async v=>{if(shot){await p.waitForTimeout(500);await p.screenshot({path:out+'/'+shot});await p.evaluate(()=>{document.getElementById('e4-dialog').style.visibility='hidden';});await p.screenshot({path:out+'/escena_'+shot});await p.evaluate(()=>{document.getElementById('e4-dialog').style.visibility='';});}return v;});};
 const save={version:2,hero:'ruzio',seed:7,checkpoint:5200,phase:'ending',rescued:['pulga','cote'],traded:true};
 r.marcelo=await run('marcelo',save,'botella_falsa_marcelo.png');
 r.ruzio=await run('ruzio',save,'botella_falsa_ruzio.png');
 r.sinRegistro=await run('tobi',null,'botella_falsa_sin_registro.png');
 console.log(JSON.stringify(r,null,1));assert.deepEqual(r.marcelo.pair,['ruzio','pulga']);assert.deepEqual(r.ruzio.pair,['pulga','cote']);assert.equal(r.sinRegistro.pair.length,2);assert.ok(!r.sinRegistro.pair.includes('tobi'));assert.equal(errs.length,0);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
