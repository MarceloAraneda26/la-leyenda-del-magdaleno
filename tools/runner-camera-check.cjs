/* Cámara frontal: el entorno se aleja, la colisión coincide con los pies y Coté mantiene escala humana. */
const {chromium}=require('./browser.cjs'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),base=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/';
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
 const page=await browser.newPage({viewport:{width:1280,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'etapa2.html?qa=1');await page.waitForFunction(()=>Parral.loaded);
 const report=await page.evaluate(()=>{const a=__parral,P=a.P,M=a.M,result=[];a.setManual();P.start('marcelo');
  for(const [W,H]of [[960,340],[960,540],[960,760],[720,1280]]){
   const canvas=document.getElementById('game');canvas.width=W;canvas.height=H;P.width=W;P.height=H;P.session.coteJoined=true;P.session.distance=60;P.session.obstacles=[{id:'camera',at:100,lane:0,kind:'hole'}];
   const actor=M.character,track=P.trackPoint,calls=[],points=[];
   M.character=(id,x,y,height,pose)=>{calls.push({id,x,y,height});return actor(id,x,y,height,pose);};
   P.trackPoint=(lane,remaining)=>{const point=track(lane,remaining);points.push({...point,remaining});return point;};
   P.render();const before=points.at(-1);P.session.distance=70;P.render();const after=points.at(-1);M.character=actor;P.trackPoint=track;
   const hero=calls.find(c=>c.id==='marcelo'),helper=calls.find(c=>c.id==='cote');
   result.push({size:[W,H],before,after,feet:P.trackPoint(0,0),ground:P.ground,behind:P.trackPoint(0,-30),hero,helper,ratio:helper.height/hero.height});
  }return result;
 });
 for(const r of report){assert(r.after.y<r.before.y,'El obstáculo debe alejarse hacia arriba al correr hacia la cámara');assert(r.after.k<r.before.k);assert(r.before.y>r.ground);assert.equal(r.feet.y,r.ground);assert(r.behind.y<r.ground);assert(r.ratio>=.85&&r.ratio<=1.05,'Coté debe conservar escala humana junto al corredor');assert(r.helper.x>0&&r.helper.x<r.size[0]);}
 fs.mkdirSync(path.join(root,'qa/camera'),{recursive:true});
 await page.evaluate(()=>{const P=Parral;P.width=960;P.height=540;const c=document.getElementById('game');c.width=960;c.height=540;P.session.distance=232;P.session.gap=32;P.session.relief=5;P.session.shoutAge=.3;P.session.obstacles=P.makeObstacles();P.render();});
 await page.locator('#game').screenshot({path:path.join(root,'qa/camera/carrera_frontal.png')});
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'qa/camera/report.json'),JSON.stringify({report,errors},null,2));console.log(JSON.stringify({status:'passed',sizes:report.length,helperRatio:report.map(r=>r.ratio),errors}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
