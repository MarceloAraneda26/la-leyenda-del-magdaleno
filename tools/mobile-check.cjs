const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
  const sizes=[[393,852],[360,740],[320,568],[844,390],[740,360],[768,1024]],results=[],errors=[];
  for(const [width,height]of sizes){
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
    const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/?qa=1');await page.waitForFunction(()=>window.Magdaleno?.state==='title');
    assert(await page.locator('#start-button').isVisible());
    for(const hero of ['marcelo','ruzio','pulga','tobi','pallo']){await page.locator('[data-hero="'+hero+'"]').tap();assert.equal(await page.evaluate(()=>Magdaleno.selected),hero);}
    const menu=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,cardBounds:[...document.querySelectorAll('.hero-card')].map(x=>x.getBoundingClientRect().toJSON())}));
    assert(!menu.overflow,'El menú no debe desbordar horizontalmente en '+width+'x'+height);
    await page.locator('#start-button').tap();
    assert.equal(await page.evaluate(()=>Magdaleno.state),'dialogue');
    const dialog=await page.locator('#dialogue').boundingBox();assert(dialog.x>=0&&dialog.x+dialog.width<=width+1);
    let lines=0;while(await page.locator('#dialogue-next').isVisible()&&lines++<20)await page.locator('#dialogue-next').tap();
    await page.evaluate(()=>{__magdaleno.setManual();Magdaleno.session.enemies=[];Magdaleno.session.hazards=[];});
    assert.equal(await page.evaluate(()=>Magdaleno.state),'play');
    const controls=await page.locator('.touch-controls button').evaluateAll(elements=>elements.map(x=>({key:x.dataset.key,...x.getBoundingClientRect().toJSON()})));
    for(const button of controls){assert(button.width>=44&&button.height>=44);assert(button.x>=0&&button.x+button.width<=width+1&&button.y>=0&&button.y+button.height<=height+1,'Control fuera de pantalla: '+button.key+' en '+width+'x'+height);}
    const cdp=await context.newCDPSession(page),point=(key,id)=>{const b=controls.find(x=>x.key===key);return{x:b.x+b.width/2,y:b.y+b.height/2,id};};
    const before=await page.evaluate(()=>Magdaleno.session.player.x);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point('ArrowRight',0),point('Space',1),point('KeyZ',2)]});
    await page.evaluate(()=>__magdaleno.step(18));
    const active=await page.evaluate(()=>({x:Magdaleno.session.player.x,y:Magdaleno.session.player.y,attack:Magdaleno.keys.KeyZ}));
    assert(active.x>before&&active.y<450&&active.attack,'Se puede mover, saltar y atacar simultáneamente');
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert(await page.evaluate(()=>!Magdaleno.keys.ArrowRight&&!Magdaleno.keys.Space&&!Magdaleno.keys.KeyZ));
    await page.locator('#pause-button').tap();assert.equal(await page.evaluate(()=>Magdaleno.state),'paused');
    await page.locator('#resume-button').tap();assert.equal(await page.evaluate(()=>Magdaleno.state),'play');
    await page.screenshot({path:path.join(__dirname,'../qa/mobile_'+width+'x'+height+'.png')});
    results.push({width,height,menuFits:true,selectsAllFive:true,dialogueUsable:true,controlsFit:true,multiTouch:true,pauseWorks:true});
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:393,height:852},isMobile:true,hasTouch:true}),page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>navigator.serviceWorker.controller);
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  await page.locator('#start-button').tap();assert.equal(await page.evaluate(()=>Magdaleno.state),'dialogue');
  await context.close();assert.deepEqual(errors,[]);
  const result={status:'passed',browser:'Chrome touch emulation',physicalDevice:false,results,offlineReload:true,errors};
  fs.writeFileSync(path.join(__dirname,'../qa/mobile.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
