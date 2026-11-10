/* PONG de la etapa 4 en celular y escritorio: tamaño visible de pelota y paletas, nada tapa el campo, se puede ganar y perder. Uso: node tools/etapa4-pong-check.cjs */
const {chromium}=require('./browser.cjs'),unlock=require('./campaign-fixture.cjs'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const B=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/',out=path.join(__dirname,'../qa/etapa4');fs.mkdirSync(out,{recursive:true});
const SIZES=[['escritorio',1280,720,false],['movil_844',844,390,true],['movil_568',568,320,true]];
(async()=>{const b=await chromium.launch({headless:true,channel:'chrome'});const errors=[],r={};try{
 for(const [name,w,h,touch] of SIZES){const c=await b.newContext({viewport:{width:w,height:h},...(touch?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}),p=await c.newPage();p.on('pageerror',e=>errors.push(String(e)));await unlock(p,3);
  await p.goto(B+'etapa4.html?qa=1');await p.waitForFunction(()=>window.Etapa4?.loaded);
  await p.evaluate(()=>{__e4.setHero('pallo');__e4.begin(5);});await p.waitForTimeout(300);await p.evaluate(()=>{const a=__e4;while(a.dialog())a.next();a.step(90);});await p.waitForTimeout(200);
  const m=await p.evaluate(()=>{const a=__e4,pg=a.pg,el=document.getElementById('game').getBoundingClientRect(),k=Math.min(el.width/960,el.height/540),ox=el.left+(el.width-960*k)/2,oy=el.top+(el.height-540*k)/2;
   const cap=document.getElementById('e4-caption'),cr=cap.hidden?null:cap.getBoundingClientRect();
   const btns=[...document.querySelectorAll('.e4-pong button')].filter(b=>b.offsetParent).map(b=>b.getBoundingClientRect());
   const fieldTop=oy+(a.pg.touch?74:96)*k,fieldBottom=oy+(a.pg.touch?474:446)*k,paddleLeft=ox+((a.pg.touch?130:210)+18*pg.k)*k;
   return{escala:+k.toFixed(3),pelotaCss:+(14*pg.k*k).toFixed(1),paletaCss:+(72*pg.sy*k).toFixed(1),campoCss:Math.round((a.pg.touch?700:540)*k),
    avisoSobreCampo:cr?cr.bottom>fieldTop&&cr.top<fieldBottom:false,botonesTapanPaleta:btns.some(q=>q.right>paddleLeft),botones:btns.length,pelota:!!pg.ball};});
  await p.screenshot({path:`${out}/pong_${name}.png`});
  // Un jugador que sigue la pelota gana 5 a 0; uno que se aleja de ella pierde y recibe revancha desde 0 a 0.
  const gana=await p.evaluate(()=>{const a=__e4;a.begin(5);while(a.dialog())a.next();let f=0;while(f++<60*300&&a.mode()==='pong'&&!a.dialog()){const pg=a.pg,t=pg.ball?pg.ball.y:pg.my;a.key('ArrowUp',t<pg.py-8);a.key('ArrowDown',t>pg.py+8);a.step(1);}a.key('ArrowUp',false);a.key('ArrowDown',false);return{me:a.pg.me,him:a.pg.him,seg:Math.round(f/60)};});
  const pierde=await p.evaluate(()=>{const a=__e4;document.getElementById('e4-again').click();a.begin(5);while(a.dialog())a.next();let f=0;while(f++<60*300&&!a.dialog()){const pg=a.pg,t=pg.ball?pg.ball.y:pg.py;a.key('ArrowUp',t>=pg.py);a.key('ArrowDown',t<pg.py);a.step(1);}a.key('ArrowUp',false);a.key('ArrowDown',false);const lost=a.pg.him===5,d=a.dialog();a.next();return{perdio:lost,revancha:!!d,reinicio:a.pg.me===0&&a.pg.him===0,seg:Math.round(f/60)};});
  r[name]={...m,gana,pierde};await c.close();}
 r.errores=errors;console.log(JSON.stringify(r,null,1));
 for(const [name,,,touch] of SIZES){const x=r[name];assert(!x.avisoSobreCampo,name+' aviso');assert(!x.botonesTapanPaleta,name+' botones');assert.equal(x.gana.me,5,name+' gana');assert(x.pierde.perdio&&x.pierde.revancha&&x.pierde.reinicio,name+' revancha');if(touch){assert.equal(x.botones,2,name);assert(x.pelotaCss>=10,name+' pelota '+x.pelotaCss);}}
 assert.equal(errors.length,0);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
