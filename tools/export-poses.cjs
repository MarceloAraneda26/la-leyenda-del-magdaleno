/* Atlas exportados desde el renderizador del juego, sin alterar los PNG originales. */
const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:4173/?qa=1');
  await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  const assets=await page.evaluate(()=>{
    __magdaleno.setManual();
    const M=Magdaleno,output=[];
    for(const id of M.order){
      const poses=[
        {name:'reposo_0',pose:{time:0}},
        {name:'reposo_1',pose:{time:.8}},
        ...Array.from({length:8},(_,i)=>({name:'marcha_'+i,pose:{time:i*Math.PI*2/96,walk:true,speed:1,dir:1}})),
        {name:'salto_subida',pose:{air:true,rising:true,dir:1}},
        {name:'salto_caida',pose:{air:true,rising:false,dir:1}},
        {name:'aterrizaje',pose:{landing:1,dir:1}},
        {name:'golpe_preparacion',pose:{attack:.12,dir:1}},
        {name:'golpe_impacto',pose:{attack:.45,dir:1}},
        {name:'golpe_recuperacion',pose:{attack:.82,dir:1}},
        {name:'dano',pose:{hurt:true,dir:1}},
        {name:'celebracion_0',pose:{win:true,time:0}},
        {name:'celebracion_1',pose:{win:true,time:.4}},
        {name:'preparacion_especial',pose:{cast:true}}
      ];
      if(id==='tobi')for(const factor of [1.3,1.6,2])poses.push({name:'crecimiento_'+String(factor).replace('.','_'),pose:{giant:factor,cast:true}});
      const atlas=document.createElement('canvas');
      atlas.width=960;atlas.height=Math.ceil(poses.length/6)*224;
      const context=atlas.getContext('2d');context.imageSmoothingEnabled=false;
      poses.forEach(({pose},i)=>{
        M.ctx.clearRect(0,0,M.W,M.H);
        M.character(id,80,210,94,pose);
        context.drawImage(document.getElementById('game'),0,0,160,224,i%6*160,Math.floor(i/6)*224,160,224);
      });
      output.push({id,width:atlas.width,height:atlas.height,data:atlas.toDataURL('image/png').split(',')[1],frames:poses.map(({name},i)=>({name,x:i%6*160,y:Math.floor(i/6)*224,w:160,h:224,ax:80,ay:210}))});
    }
    M.render();return output;
  });
  const folder=path.join(__dirname,'../animaciones');
  fs.mkdirSync(folder,{recursive:true});
  for(const asset of assets){
    fs.writeFileSync(path.join(folder,asset.id+'_poses.png'),Buffer.from(asset.data,'base64'));
    fs.writeFileSync(path.join(folder,asset.id+'_poses.json'),JSON.stringify({version:'0.2',character:asset.id,source:'Render articulado del juego',size:[asset.width,asset.height],frameSize:[160,224],anchor:[80,210],frames:asset.frames},null,2));
  }
  console.log(JSON.stringify(assets.map(asset=>({personaje:asset.id,poses:asset.frames.length,size:[asset.width,asset.height]})),null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});

