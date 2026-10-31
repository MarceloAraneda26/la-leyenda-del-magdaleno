/* PNG transparentes de las armas dibujadas por el motor, sin cambiar los sprites. */
const {chromium}=require('./browser.cjs');const fs=require('fs'),path=require('path');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage();
  await page.goto((process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/')+'?qa=1');await page.waitForFunction(()=>window.Magdaleno?.weapons&&Magdaleno.state==='title');
  const result=await page.evaluate(()=>{
    const M=Magdaleno;__magdaleno.setManual();
    return M.order.map(id=>{
      M.ctx.setTransform(1,0,0,1,0,0);M.ctx.clearRect(0,0,M.W,M.H);M.ctx.save();M.ctx.translate(80,40);
      M.drawTool({kind:'melee',weapon:id,psi:0,show:1,motion:0},3,()=>{});M.ctx.restore();
      const c=document.createElement('canvas');c.width=160;c.height=180;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(document.getElementById('game'),0,0,160,180,0,0,160,180);
      const pixels=g.getImageData(0,0,160,180).data;let count=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)count++;
      if(count<50||pixels[3]!==0)throw new Error('Exportación inválida: '+id);
      return{id,name:M.weapons[id].name,data:c.toDataURL('image/png').split(',')[1],pixels:count};
    });
  });
  const out=path.resolve(__dirname,'../assets/armas');fs.mkdirSync(out,{recursive:true});
  for(const item of result)fs.writeFileSync(path.join(out,item.id+'.png'),Buffer.from(item.data,'base64'));
  console.log(JSON.stringify(result.map(({id,name,pixels})=>({id,name,pixels})),null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
