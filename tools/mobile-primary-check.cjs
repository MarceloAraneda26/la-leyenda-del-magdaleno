/* Entrada real en Chrome táctil emulado. No sustituye Android/iPhone físicos. */
const {chromium}=require('./browser.cjs'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const base=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']}),results=[],errors=[];
 try{
  for(const [width,height]of [[320,568],[360,640],[393,852],[844,390],[740,360],[640,320],[1024,768]]){
   const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1,reducedMotion:'no-preference'}),page=await context.newPage();
   page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'?qa=1');await page.waitForFunction(()=>window.Magdaleno?.state==='title');
   const button=await page.locator('#start-button').boundingBox();assert(button.y>=0&&button.y+button.height<=height+1,'Comenzar fuera de pantalla '+width+'x'+height);
   for(const hero of ['ruzio','pulga','tobi','pallo','marcelo']){await page.locator('[data-hero='+hero+']').tap();assert.equal(await page.evaluate(()=>Magdaleno.selected),hero);}
   await page.locator('#start-button').tap();
   if(height>width){await page.waitForFunction(()=>!document.getElementById('rotate-screen').hidden);await page.screenshot({path:path.join(__dirname,'../qa/mobile_rotate_'+width+'.png')});await page.setViewportSize({width:height,height:width});await page.waitForFunction(()=>document.getElementById('rotate-screen').hidden);}
   for(let i=0;i<20&&await page.evaluate(()=>Magdaleno.state==='dialogue');i++)await page.locator('#dialogue-next').tap();
   if(await page.evaluate(()=>Magdaleno.state==='paused'))await page.locator('#resume-button').tap();
   if(await page.locator('#touch-onboarding-dismiss').isVisible())await page.locator('#touch-onboarding-dismiss').tap();
   await page.evaluate(()=>{__magdaleno.setManual();Magdaleno.session.enemies=[];Magdaleno.session.hazards=[];Magdaleno.render();});
   const layout=await page.evaluate(()=>{const stage=document.querySelector('.game-frame').getBoundingClientRect();return{width:innerWidth,height:innerHeight,stageWidth:stage.width,scrollX:document.documentElement.scrollWidth-innerWidth,scrollY:document.documentElement.scrollHeight-innerHeight,controls:[...document.querySelectorAll('.touch-controls button')].filter(b=>!b.hidden).map(b=>({key:b.dataset.key,...b.getBoundingClientRect().toJSON()}))};});
   assert(Math.abs(layout.stageWidth-layout.width)<2);assert(layout.scrollX<=1&&layout.scrollY<=1);
   assert.equal(layout.controls.length,5,'Cinco controles permanentes');
   for(const b of layout.controls){assert(b.width>=44&&b.height>=44);assert(b.x>=0&&b.y>=0&&b.right<=layout.width+1&&b.bottom<=layout.height+1,JSON.stringify(b));}
   const cdp=await context.newCDPSession(page);
   async function point(key,id){const r=await page.locator('[data-key='+key+']').boundingBox();assert(r,'Control visible '+key);return{x:r.x+r.width/2,y:r.y+r.height/2,id};}
   const right=await point('ArrowRight',0),jump=await point('Space',1),weapon=await point('KeyZ',2);
   const before=await page.evaluate(()=>Magdaleno.session.player.x);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right,jump]});await page.evaluate(()=>__magdaleno.step(2));
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[jump]});await page.evaluate(()=>__magdaleno.step(4));
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right,weapon]});await page.evaluate(()=>__magdaleno.step(4));
   const air=await page.evaluate(()=>({x:Magdaleno.session.player.x,y:Magdaleno.session.player.y,attack:Magdaleno.session.player.attack,grace:Magdaleno.touchJumpGrace}));assert(air.x>before&&air.y<430&&air.attack>0,'Saltar y atacar con dos pulgares '+JSON.stringify({air,before,layout}));
   await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert(await page.evaluate(()=>!Magdaleno.keys.ArrowRight&&!Magdaleno.keys.Space&&!Magdaleno.keys.KeyZ));
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[await point('ArrowLeft',0)]});await page.evaluate(()=>__magdaleno.step(3));assert(await page.evaluate(()=>Magdaleno.camLead===Magdaleno.W-330),'Anticipa hacia la izquierda');
   await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[await point('ArrowRight',0)]});await page.evaluate(()=>__magdaleno.step(3));assert(await page.evaluate(()=>Magdaleno.camLead===330),'Anticipa hacia la derecha');await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
   await page.evaluate(()=>{__magdaleno.teleport(31*45+22.5,360);Magdaleno.clearInput();Magdaleno.render();});assert(await page.locator('[data-key=ArrowDown]').isVisible());
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[await point('ArrowDown',0)]});await page.evaluate(()=>__magdaleno.step());
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.evaluate(()=>__magdaleno.step(45));assert(await page.evaluate(()=>Magdaleno.session.player.y>400),'Descender con un solo toque');
   await page.evaluate(()=>{const r=Magdaleno.session.rescues[0];__magdaleno.teleport(r.x-30);__magdaleno.step();});assert(await page.locator('[data-key=KeyE]').isVisible(),'Ayudar aparece cerca del rescate');
   await page.locator('#pause-button').tap();assert.equal(await page.evaluate(()=>Magdaleno.state),'paused');await page.locator('#resume-button').tap();
   await page.setViewportSize({width:393,height:852});await page.waitForFunction(()=>!document.getElementById('rotate-screen').hidden);assert.equal(await page.evaluate(()=>Magdaleno.state),'paused');assert(await page.evaluate(()=>Object.values(Magdaleno.keys).every(x=>!x)));
   await page.setViewportSize({width:layout.width,height:layout.height});await page.waitForFunction(()=>document.getElementById('rotate-screen').hidden);await page.locator('#resume-button').tap();
   await page.screenshot({path:path.join(__dirname,'../qa/mobile_primary_'+width+'x'+height+'.png')});results.push({initial:[width,height],landscape:[layout.width,layout.height],menuFits:true,fullWidth:true,twoThumbAirAttack:true,cancelReleases:true,oneTouchDrop:true,contextualInteraction:true,rotationPauses:true});await context.close();
  }
  const context=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'?qa=1');await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  const storage=await page.evaluate(()=>{__magdaleno.setManual();__magdaleno.start('marcelo');__magdaleno.dismiss();const original=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Test','QuotaExceededError');};try{const result=Magdaleno.saveCheckpoint(4);return{result,notice:Magdaleno.notice.text};}finally{Storage.prototype.setItem=original;}});assert.equal(storage.result,false);assert(storage.notice.includes('NO SE PUDO GUARDAR'));await context.close();
  const offline=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true}),p=await offline.newPage();await p.goto(base);await p.waitForFunction(()=>window.Magdaleno?.state==='title');await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();await p.waitForFunction(()=>!!navigator.serviceWorker.controller);await offline.setOffline(true);await p.reload();await p.waitForFunction(()=>window.Magdaleno?.state==='title');await p.locator('#start-button').tap();assert.equal(await p.evaluate(()=>Magdaleno.state),'dialogue');await offline.close();
  assert.deepEqual(errors,[]);const result={status:'passed',version:JSON.parse(fs.readFileSync(path.join(__dirname,'../VERSION.json'),'utf8')).gameVersion,physicalDevice:false,browser:'Chrome touch emulation',results,storage,offlineReload:true,errors};fs.writeFileSync(path.join(__dirname,'../qa/mobile.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
