/* Evidencia del estado actual: poderes reales, no la pose genérica del visor. */
const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path');
const output=path.resolve(__dirname,'../auditoria_animaciones');fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
  const page=await browser.newPage();await page.goto('http://127.0.0.1:4173/?qa=1');await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  const results=await page.evaluate(()=>{
    const a=__magdaleno,M=a.M;a.setManual();const results=[],fractions=[0,.12,.26,.40,.53,.66,.82,.99,1.08];
    M.background=()=>{M.ctx.fillStyle='#102032';M.ctx.fillRect(0,0,M.W,M.H);};M.terrain=()=>{};M.props=()=>{};M.enemy=()=>{};
    const durations={marcelo:.8,ruzio:1,pulga:1.2,tobi:1.5,pallo:.9};
    for(const hero of M.order){
      a.start(hero);a.dismiss();M.loadZone(0,9);M.setState('play');
      const s=M.session,p=s.player,duration=durations[hero];s.rescues=[];s.hazards=[];s.cans=[];s.boss=null;
      a.teleport(400);p.energy=100;s.enemies=[M.makeEnemy('folder','audit-target',11)];s.enemies[0].hp=s.enemies[0].max=1000;
      M.progress.flags.tutorial_escalones=true;M.progress.flags.tutorial_plataforma=true;M.ultimate();
      const atlas=document.createElement('canvas');atlas.width=1980;atlas.height=320;const g=atlas.getContext('2d');g.imageSmoothingEnabled=false;
      let frame=0,impact=null;const samples=[];
      for(let index=0;index<fractions.length;index++){
        const desired=Math.round(fractions[index]*duration*60);
        while(frame<desired){a.step();frame++;if(p.ultUsed&&impact===null)impact={frame,seconds:frame/60,visualFootY:hero==='pulga'?p.y-Math.sin((1-p.ult/duration)*Math.PI)*110:p.y,physicalFootY:p.y,scale:hero==='tobi'?2:1};}
        M.cam=0;M.shake=0;M.banner=0;M.notice=null;M.prompt='';M.render();
        const x=index*220;g.fillStyle='#102032';g.fillRect(x,0,220,320);g.drawImage(document.getElementById('game'),290,180,220,280,x,8,220,280);
        g.fillStyle='#64798a';g.fillRect(x+3,279,214,1);g.fillStyle='#efc37d';g.textAlign='center';g.font='bold 13px monospace';g.fillText(Math.round(fractions[index]*100)+'% · '+(frame/60).toFixed(2)+' s',x+110,300);
        g.fillStyle='#b7cbd8';g.font='10px monospace';g.fillText(p.ultUsed?'DAÑO YA APLICADO':'ANTES DEL DAÑO',x+110,315);
        samples.push({fraction:fractions[index],frame,seconds:frame/60,physicalY:p.y,ultimate:p.ult,damageApplied:p.ultUsed});
      }
      if(hero==='ruzio'&&impact){const angle=impact.seconds*2.5-1;impact.hammerHeadCenterY=450-56-42.5*Math.cos(angle);impact.hammerHeadAboveFloor=450-impact.hammerHeadCenterY;}
      results.push({hero,duration,impact,samples,png:atlas.toDataURL('image/png').split(',')[1]});
    }
    return results;
  });
  for(const result of results)fs.writeFileSync(path.join(output,result.hero+'_secuencia_actual.png'),Buffer.from(result.png,'base64'));
  const clean=results.map(({png,...result})=>result);fs.writeFileSync(path.join(output,'mediciones.json'),JSON.stringify({source:'Motor real a 60 pasos por segundo. Escena aislada sin modificar poses ni reglas del poder.',characters:clean},null,2));
  console.log(JSON.stringify(clean.map(({hero,duration,impact})=>({hero,duration,impact})),null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
