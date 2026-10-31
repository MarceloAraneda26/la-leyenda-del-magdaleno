const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto((process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/')+'animaciones.html');
  await page.waitForFunction(()=>!document.getElementById('preview-status').textContent.includes('Cargando'));
  assert.equal(await page.locator('.preview-person').count(),5);
  const first=await page.locator('.preview-person canvas').first().evaluate(canvas=>canvas.toDataURL());
  await page.waitForFunction(previous=>document.querySelector('.preview-person canvas').toDataURL()!==previous,first);
  const second=await page.locator('.preview-person canvas').first().evaluate(canvas=>canvas.toDataURL());
  assert(first!==second,'La marcha debe variar entre frames');
  const checks=['Cinco amigos visibles','Marcha con cuadros diferentes'];
  for(const action of ['Reposo','Salto','Ataque con arma','Definitiva','Celebración']){
    await page.getByRole('button',{name:action,exact:true}).click();
    await page.waitForTimeout(160);
    const pixels=await page.locator('.preview-person canvas').first().evaluate(canvas=>{
      const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
      let occupied=0;for(let i=3;i<data.length;i+=4)if(data[i]>0)occupied++;
      return occupied;
    });
    assert(pixels>2000,'La pose debe conservar un personaje completo: '+action);checks.push(action);
  }
  await page.getByRole('button',{name:'Marcha',exact:true}).click();
  await page.waitForTimeout(170);
  await page.getByRole('button',{name:'Pausar',exact:true}).click();
  const paused=await page.locator('.preview-person canvas').first().evaluate(canvas=>canvas.toDataURL());
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.preview-person canvas').first().evaluate(canvas=>canvas.toDataURL()),paused);
  checks.push('Pausa de la vista de animaciones');
  await page.screenshot({path:path.join(__dirname,'../qa/10_vista_animaciones.png'),fullPage:true});
  await page.setViewportSize({width:740,height:600});
  await page.screenshot({path:path.join(__dirname,'../qa/11_animaciones_compacto.png'),fullPage:true});
  await page.goto('file:///'+path.resolve(__dirname,'../animaciones.html').replace(/\\/g,'/'));
  await page.waitForFunction(()=>!document.getElementById('preview-status').textContent.includes('Cargando'));
  checks.push('Vista de animaciones disponible desde archivo local');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(__dirname,'../qa/pulido_visual.json'),JSON.stringify({status:'passed',version:'0.2',checks,errors},null,2));
  console.log(JSON.stringify({status:'passed',checks},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
