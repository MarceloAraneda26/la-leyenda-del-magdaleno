/* Emulación táctil en Chrome; no sustituye una prueba en teléfono físico. */
const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
  const context=await browser.newContext({viewport:{width:740,height:420},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/?qa=1');
  await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  await page.evaluate(()=>{__magdaleno.setManual();__magdaleno.start('marcelo');__magdaleno.dismiss();Magdaleno.session.enemies=[];Magdaleno.session.hazards=[];});
  const buttons=await page.locator('.touch-controls button').evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();return{key:element.dataset.key,x:r.x+r.width/2,y:r.y+r.height/2,left:r.left,right:r.right,top:r.top,bottom:r.bottom,visible:getComputedStyle(element).display!=='none'};}));
  assert.equal(buttons.length,7);
  assert.equal(await page.locator('.touch-controls').isVisible(),true);
  for(const button of buttons){assert(button.visible&&button.right-button.left>=40);assert(button.left>=0&&button.right<=740&&button.top>=0&&button.bottom<=420,button.key+' debe estar en pantalla');}
  const cdp=await context.newCDPSession(page);
  const point=(key,id)=>{const b=buttons.find(button=>button.key===key);return{x:b.x,y:b.y,id};};
  const start=await page.evaluate(()=>Magdaleno.session.player.x);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point('ArrowRight',0)]});
  await page.evaluate(()=>__magdaleno.step(24));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const moved=await page.evaluate(()=>({x:Magdaleno.session.player.x,released:!Magdaleno.keys.ArrowRight}));
  assert(moved.x>start+40);assert(moved.released);
  await page.evaluate(()=>{__magdaleno.teleport(31*45+22.5,360);Magdaleno.clearInput();});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point('ArrowDown',0),point('Space',1)]});
  const simultaneous=await page.evaluate(()=>!!Magdaleno.keys.ArrowDown&&!!Magdaleno.keys.Space);
  assert(simultaneous,'Dos dedos deben mantener bajar y saltar simultáneamente');
  await page.evaluate(()=>__magdaleno.step());
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.evaluate(()=>__magdaleno.step(45));
  const dropped=await page.evaluate(()=>Magdaleno.session.player.y>400);
  assert(dropped);
  await page.screenshot({path:path.join(__dirname,'../qa/15_controles_tactiles.png')});
  assert.deepEqual(errors,[]);
  const result={status:'passed',emulated:true,physicalDevice:false,viewport:{width:740,height:420},allButtonsInViewport:true,movesAndReleases:true,twoFingerDrop:dropped,errors};
  fs.writeFileSync(path.join(__dirname,'../qa/controles_tactiles.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
