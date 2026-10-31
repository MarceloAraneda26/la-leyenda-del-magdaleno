const {chromium}=require('./browser.cjs');const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
  const b=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']}),page=await b.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await page.goto((process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/')+'?qa=1');await page.waitForFunction(()=>window.Magdaleno?.weapons&&Magdaleno.state==='title');
  const report=await page.evaluate(()=>{
    const a=__magdaleno,M=a.M;a.setManual();const results=[];
    for(const hero of M.order)for(const dir of [-1,1]){
      a.start(hero);a.dismiss();const s=M.session,p=s.player;s.enemies=[];s.hazards=[];s.rescues=[];s.cans=[];a.teleport(400);p.face=dir;p.energy=0;p.inv=999;
      const target=M.makeEnemy('folder','target',0),behind=M.makeEnemy('folder','behind',0),far=M.makeEnemy('folder','far',0);
      for(const [enemy,distance]of [[target,55],[behind,-65],[far,170]]){enemy.x=enemy.home=p.x+dir*distance;enemy.hp=enemy.max=100;enemy.cd=99;}
      s.enemies=[target,behind,far];let maxGripError=0,maxGeometryError=0,firstHit=null,events=0,lastHP=100;
      a.key('KeyZ',true);a.step();a.key('KeyZ',false);
      for(let i=0;i<30;i++){
        if(target.hp!==lastHP){events++;if(firstHit==null)firstHit=(i+1)/60;lastHP=target.hp;}
        if(p.attack>0){const out=M.rigOut[hero],physical=M.meleeGeometry(hero,p,M.melee.duration-p.attack);maxGripError=Math.max(maxGripError,Math.hypot(out.front.x-out.tool.grip.x,out.front.y-out.tool.grip.y));maxGeometryError=Math.max(maxGeometryError,Math.hypot(out.tool.tip.x+M.cam-physical.tip.x,out.tool.tip.y-physical.tip.y));}
        a.step();
      }
      const hits={hero,dir,weapon:M.weapons[hero].name,targetHP:target.hp,behindHP:behind.hp,farHP:far.hp,events,firstHit,maxGripError,maxGeometryError,energy:p.energy};results.push(hits);
      // Igualdad de agarre y colisión también al caminar y saltar.
      for(const grounded of [true,false]){p.onGround=grounded;p.vx=225;p.y=grounded?450:350;p.attack=.16;p.animT=.7;M.shake=0;M.render();const out=M.rigOut[hero],physical=M.meleeGeometry(hero,p,.14);hits.maxGeometryError=Math.max(hits.maxGeometryError,Math.hypot(out.tool.tip.x+M.cam-physical.tip.x,out.tool.tip.y-physical.tip.y));}
    }
    return results;
  });
  for(const result of report){assert.equal(result.targetHP,90,JSON.stringify(result));assert.equal(result.behindHP,100);assert.equal(result.farHP,100);assert.equal(result.events,1);assert(result.firstHit>=.07&&result.firstHit<=.23);assert(result.maxGripError<.01);assert(result.maxGeometryError<2,JSON.stringify(result));assert(result.energy>=3);}
  const image=await page.evaluate(()=>{
    const M=Magdaleno,c=document.createElement('canvas');c.width=1400;c.height=440;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    const poses=[-1,.14];
    for(let row=0;row<2;row++)for(let i=0;i<5;i++){
      const id=M.order[i];M.ctx.setTransform(1,0,0,1,0,0);M.ctx.clearRect(0,0,M.W,M.H);M.character(id,120,190,116,{time:0,dir:1,rig:M.meleePose(id,poses[row])});
      g.fillStyle='#102032';g.fillRect(i*280,row*220,280,220);g.drawImage(document.getElementById('game'),0,0,260,200,i*280+10,row*220,260,200);
      g.fillStyle=M.heroes[id].color;g.font='bold 14px monospace';g.textAlign='center';g.fillText(row===0?M.heroes[id].name.toUpperCase():M.weapons[id].name,i*280+140,row*220+214);
    }
    return c.toDataURL('image/png').split(',')[1];
  });
  fs.writeFileSync(path.join(__dirname,'../qa/armas_basicas.png'),Buffer.from(image,'base64'));assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(__dirname,'../qa/armas_basicas.json'),JSON.stringify({status:'passed',cases:report,errors},null,2));console.log(JSON.stringify({status:'passed',cases:report},null,2));await b.close();
})().catch(error=>{console.error(error);process.exit(1)});
