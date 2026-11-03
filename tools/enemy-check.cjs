/* Inspección de siluetas, combate real, disparos y legibilidad de los patrulleros. */
const {chromium}=require('./browser.cjs'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'auditoria_villanos');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/')+'?qa=1');await page.waitForFunction(()=>window.Magdaleno?.enemyPose&&Magdaleno.state==='title');
  const report=await page.evaluate(()=>{
   const M=Magdaleno,a=__magdaleno;a.setManual();const types=Object.keys(M.enemyStats),hits=[],shots=[],bounds=[];
   function arena(hero){a.start(hero);a.dismiss();const s=M.session;s.enemies=[];s.hazards=[];s.rescues=[];s.cans=[];s.boss=null;a.teleport(400);s.player.inv=999;return s;}
   // Cada arma debe alcanzar el tronco nuevo y aplicar exactamente un golpe.
   for(const hero of M.order)for(const type of types)for(const dir of [-1,1]){
    const s=arena(hero),p=s.player;p.face=dir;const enemy=M.makeEnemy(type,'target',0);enemy.x=enemy.home=p.x+dir*55;enemy.hp=enemy.max=100;enemy.stun=99;s.enemies=[enemy];
    a.key('KeyZ',true);a.step();a.key('KeyZ',false);a.step(27);hits.push({hero,type,dir,hp:enemy.hp,h:enemy.h,hw:enemy.hw});
   }
   for(const type of ['bill','mail','phone']){
    let s=arena('marcelo'),p=s.player;const e=M.makeEnemy(type,'shooter',0);e.x=e.home=p.x+170;e.cd=.35;s.enemies=[e];let warning=false,firstShot=null;
    for(let i=0;i<60;i++){a.step();warning||=e.warn;if(s.shots.length&&firstShot===null)firstShot={elapsed:(i+1)/60,action:e.action,y:s.shots[0].y,hand:M.enemyHand(e).y};}
    const onScreen={type,warning,firstShot},originalView=M.viewWindow;s.shots=[];e.cd=.05;e.action=0;e.projectile=null;M.viewWindow=()=>[e.x+100,e.x+1060];a.step(60);M.viewWindow=originalView;onScreen.offscreenShots=s.shots.length;onScreen.offscreenCooldown=e.cd;shots.push(onScreen);
   }
   // Puño: la caja nace en la mano, desaparece al recuperar y no daña desde atrás.
   const fist=[];
   for(const action of [0,.31,.22,.10]){const e=M.makeEnemy('folder','fist',0);e.face=1;e.action=action;const hand=M.enemyHand(e),box=M.enemyStrikeBox(e);fist.push({action,active:!!box,centerError:box?Math.hypot(box.x+box.w/2-hand.x,box.y+box.h/2-hand.y):0});}
   const punches=[];
   for(const dir of [-1,1])for(const [distance,action,expectedHP] of [[65,.26,90],[120,.26,100],[65,.10,100]]){
    const s=arena('marcelo'),p=s.player,e=M.makeEnemy('folder','punch',0);e.x=e.home=700;e.face=dir;e.action=action;e.cd=2;p.x=e.x+dir*distance;p.inv=0;s.enemies=[e];a.step();punches.push({dir,distance,action,hp:p.hp,expectedHP});
   }
   // Los guardias de rutas altas permanecen sobre su plataforma al patrullar.
   const platforms=[];
   for(let zone=0;zone<3;zone++){const s=arena('marcelo');M.loadZone(zone);M.setState('play');M.session.hazards=[];M.session.player.inv=999;const guards=M.session.enemies.filter(e=>e.routeId);M.session.enemies=guards;const initial=guards.map(e=>e.baseY);a.step(300);platforms.push({zone,guards:guards.map((e,i)=>({id:e.id,y:e.y,expectedY:initial[i]}))});}
   // Caja y máscara visible tienen la misma altura; sin transparencia parcial por suavizado.
   for(const type of types){arena('marcelo');const e=M.makeEnemy(type,'outline',0);e.x=250;e.y=250;e.face=1;M.ctx.clearRect(0,0,M.W,M.H);M.enemy(e,0);const image=M.ctx.getImageData(0,0,M.W,M.H);let top=999,bottom=0,pixels=0,partial=0;for(let y=0;y<M.H;y++)for(let x=0;x<M.W;x++){const alpha=image.data[(y*M.W+x)*4+3];if(alpha){top=Math.min(top,y);bottom=Math.max(bottom,y);pixels++;if(alpha!==255)partial++;}}bounds.push({type,h:e.h,drawnHeight:bottom-top+1,pixels,partialAlphaPixels:partial});}
   let cachedPixelDifferences=0;
   for(const type of types)for(const dir of [-1,1]){
    const e={...M.makeEnemy(type,'cache',0),x:250,y:250,face:dir,vx:50,gaitSpeed:.5,walkT:.6,action:.20};M.enemySprites.clear();M.ctx.clearRect(0,0,M.W,M.H);M.enemy(e,0);const first=M.ctx.getImageData(100,100,300,200).data;M.ctx.clearRect(0,0,M.W,M.H);M.enemy(e,0);const second=M.ctx.getImageData(100,100,300,200).data;for(let i=0;i<first.length;i++)if(first[i]!==second[i])cachedPixelDifferences++;
   }
   for(const type of types)for(let i=0;i<100;i++)M.enemy({...M.makeEnemy(type,'cache-limit',0),x:250,y:250,walkT:i*.035,vx:100,gaitSpeed:1,action:i%2?.32-i*.003:0,warn:i%3===0,cd:.55-i*.005,hurt:i%4===0?.1:0},0);
   const cache={...M.enemySprites.info(),cachedPixelDifferences};
   const sheet=document.createElement('canvas');sheet.width=1400;sheet.height=920;const g=sheet.getContext('2d');g.imageSmoothingEnabled=false;
   const states=[{name:'GUARDIA',action:0},{name:'MARCHA',vx:100,gaitSpeed:1,walkT:.52},{name:'PREPARACIÓN',warn:true,cd:.06},{name:'GOLPE / LANZAMIENTO',action:.20}];
   for(let row=0;row<states.length;row++)for(let i=0;i<types.length;i++){
    const type=types[i],state=states[row],e={...M.makeEnemy(type,'sheet',0),...state,x:100,y:182,h:144,face:1};M.ctx.clearRect(0,0,M.W,M.H);M.enemy(e,0);g.fillStyle=(i+row)%2?'#16283a':'#102133';g.fillRect(i*200,row*230,200,230);g.drawImage(document.getElementById('game'),0,0,200,200,i*200,row*230,200,200);g.fillStyle='#e9be79';g.font='bold 12px monospace';g.textAlign='center';g.fillText(M.enemyStats[type].name.split(' ')[0].toUpperCase(),i*200+100,row*230+208);g.fillStyle='#9eb8c8';g.font='10px monospace';g.fillText(state.name,i*200+100,row*230+224);
   }
   window.__enemySheet=sheet.toDataURL('image/png').split(',')[1];
   arena('marcelo');const session=M.session;session.enemies=types.map((type,i)=>{const e=M.makeEnemy(type,'lineup'+i,0);e.x=e.home=350+i*80;return e;});session.player.x=240;session.player.inv=0;M.cam=90;M.banner=0;M.notice=null;M.time=1;M.shake=0;M.render();
   window.__enemyScene=document.getElementById('game').toDataURL('image/png').split(',')[1];
   return{hits,shots,fist,punches,platforms,bounds,cache};
  });
  for(const hit of report.hits)assert.equal(hit.hp,90,JSON.stringify(hit));
  for(const row of report.shots){assert(row.warning);assert(row.firstShot&&row.firstShot.action>0);assert(Math.abs(row.firstShot.y-row.firstShot.hand)<4);assert.equal(row.offscreenShots,0);assert.equal(row.offscreenCooldown,.05);}
  assert.deepEqual(report.fist.map(f=>f.active),[false,false,true,false]);assert(report.fist.every(f=>f.centerError<.001));
  for(const punch of report.punches)assert.equal(punch.hp,punch.expectedHP,JSON.stringify(punch));
  assert.equal(report.cache.cachedPixelDifferences,0);assert(report.cache.count<=report.cache.limit);assert(report.cache.maxBytes<4*1024*1024);
  for(const zone of report.platforms)for(const guard of zone.guards)assert(Math.abs(guard.y-guard.expectedY)<1,JSON.stringify(guard));
  for(const row of report.bounds){assert(row.h>=86&&row.h<=96);assert(row.drawnHeight>=row.h&&row.drawnHeight<=row.h+10);assert.equal(row.partialAlphaPixels,0);}
  const images=await page.evaluate(()=>({sheet:__enemySheet,scene:__enemyScene}));
  fs.writeFileSync(path.join(out,'patrulleros_humanoides.png'),Buffer.from(images.sheet,'base64'));fs.writeFileSync(path.join(out,'escala_en_juego.png'),Buffer.from(images.scene,'base64'));
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'qa/enemigos.json'),JSON.stringify({status:'passed',...report,errors},null,2));console.log(JSON.stringify({status:'passed',meleeCases:report.hits.length,projectiles:report.shots,platforms:report.platforms,bounds:report.bounds},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
