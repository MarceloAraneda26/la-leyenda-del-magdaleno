const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
  const page=await browser.newPage({viewport:{width:1365,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/?qa=1');
  await page.waitForFunction(()=>window.Magdaleno?.state==='title'&&Magdaleno.chapterVersion==='0.3');
  const results=await page.evaluate(()=>{
    const a=__magdaleno,M=a.M; a.setManual();
    const routes=[],shots={};
    for(const hero of M.order)for(let zone=0;zone<3;zone++)for(let routeIndex=0;routeIndex<2;routeIndex++){
      a.start(hero);a.dismiss();M.loadZone(zone,3);M.setState('play');
      const s=M.session,route=s.routes[routeIndex];
      s.enemies=[];s.hazards=[];s.boss=null;
      const start=route.platforms[0][0];a.teleport((start-2)*M.T+M.T/2);
      const last=route.platforms.at(-1)[1];
      const waypoints=[...route.platforms,[last+1,last+3,10]];
      let waypoint=0,frames=0,jumpHold=0;
      while(waypoint<waypoints.length&&frames++<2000){
        const p=s.player,[first,end,row]=waypoints[waypoint],target=(first+end+1)/2*M.T;
        if(p.onGround&&Math.abs(p.y-row*M.T)<2&&p.x>first*M.T+5&&p.x<(end+1)*M.T-5){waypoint++;continue;}
        const distance=target-p.x,dir=Math.abs(distance)>10?Math.sign(distance):0;
        if(p.onGround&&jumpHold===0&&row*M.T<p.y-20&&Math.abs(distance)<150)jumpHold=19;
        a.key('ArrowRight',dir>0);a.key('ArrowLeft',dir<0);a.key('Space',jumpHold>0);if(jumpHold>0)jumpHold--;
        a.step();
        if(hero==='marcelo'&&route.done&&!shots[zone]){M.banner=0;M.notice=null;M.render();shots[zone]=document.getElementById('game').toDataURL('image/png').split(',')[1];}
      }
      M.clearInput();
      routes.push({hero,zone,route:route.id,returnedToMainRoute:waypoint===waypoints.length,visited:route.done,frames,health:s.player.hp,position:{x:Math.round(s.player.x),y:Math.round(s.player.y)},waypoint});
    }
    window.__chapterShots=shots;
    return routes;
  });
  const failed=results.filter(result=>!result.returnedToMainRoute||!result.visited||result.health!==100);
  fs.writeFileSync(path.join(__dirname,'../qa/rutas_opcionales.json'),JSON.stringify({status:failed.length?'failed':'passed',routes:results,notes:'Se sitúa al jugador al inicio de cada módulo y se aíslan enemigos y peligros. Se usan únicamente movimiento y salto para recorrer las plataformas.'},null,2));
  assert.deepEqual(failed,[],'Cada ruta debe poder recorrerse y abandonarse con salto normal');
  const screenshots=await page.evaluate(()=>window.__chapterShots);
  for(const [zone,data]of Object.entries(screenshots))fs.writeFileSync(path.join(__dirname,'../qa/'+['12_desvio_ciudad.png','13_desvio_carretera.png','14_desvio_montana.png'][zone]),Buffer.from(data,'base64'));
  const mechanics=await page.evaluate(()=>{
    const a=__magdaleno,M=a.M,output=[];
    for(let zone=0;zone<3;zone++){
      a.start('marcelo');a.dismiss();M.loadZone(zone,3);M.setState('play');
      const s=M.session,h=s.hazards[0];s.enemies=[];s.shots=[];
      M.progress.elapsed=(h.period-h.offset)%h.period+.2;
      const warning=M.hazardState(h,M.progress.elapsed);
      M.progress.elapsed=(h.period-h.offset)%h.period+h.warn+.3;
      const active=M.hazardState(h,M.progress.elapsed),box=active.box;
      a.teleport(box.x+box.w/2,box.y+box.h);s.player.inv=0;s.player.hp=100;
      a.step();const activeHealth=s.player.hp;
      M.pause();const pausedTime=M.progress.elapsed;a.step(30);const remainedPaused=M.progress.elapsed===pausedTime;
      output.push({zone,kind:h.kind,warningIsHarmless:warning.warning&&!warning.active,activeHealth,expectedHealth:100-h.damage,remainedPaused});
    }
    a.start('marcelo');a.dismiss();const s=M.session,r=s.rescues[0];s.enemies=[];s.hazards=[];
    a.teleport((r.col+3)*M.T-65);s.player.inv=99;a.key('ArrowRight',true);a.key('Space',true);a.step(18);a.key('Space',false);a.step(70);a.key('ArrowRight',false);
    const cannotSkip=s.player.x<(r.col+3)*M.T;
    a.start('marcelo');a.dismiss();M.loadZone(0,3);M.setState('play');
    a.teleport(31*M.T+M.T/2,8*M.T);a.key('ArrowDown',true);a.key('Space',true);a.step();a.key('Space',false);a.key('ArrowDown',false);a.step(45);
    const dropped=M.session.player.y>8*M.T+40;
    const aid=[];
    for(const hero of M.order){
      a.start(hero==='marcelo'?'ruzio':'marcelo');a.dismiss();
      const session=M.session,rescue=session.rescues[0];session.enemies=[];session.hazards=[];
      rescue.hero=hero;rescue.done=true;rescue.open=0;rescue.aidFinished=false;
      a.teleport((rescue.col+3)*M.T-90);
      const closedInitially=M.solidAt(rescue.col+3,7);
      a.step(30);const heldDuringAid=M.solidAt(rescue.col+3,7);
      a.step(32);const opensAfterAid=!M.solidAt(rescue.col+3,7)&&rescue.aidFinished;
      aid.push({hero,closedInitially,heldDuringAid,opensAfterAid});
    }
    const legacySaves=[];
    for(let zone=0;zone<3;zone++){
      const friends=M.order.slice(0,[2,4,5][zone]);
      const legacy={version:1,hero:'marcelo',zone,checkpoint:{zone,col:[55,47,55][zone]},friends,fichas:[...friends],rescued:friends.slice(1),collected:[],killed:[],score:0,elapsed:0,canCount:0,killCount:0,flags:{}};
      localStorage.setItem(M.SAVE_KEY,JSON.stringify(legacy));const accepted=!!M.readSave();a.start(null,true);
      const session=M.session,opened=session.rescues.filter(rescue=>rescue.done).every(rescue=>rescue.open===1);
      legacySaves.push({zone,accepted,opened,checkpointRestored:session.player.x===legacy.checkpoint.col*M.T+M.T/2,desvios:session.routes.filter(route=>route.done).length});
    }
    const oldTone=M.audio.tone,oldContext=M.audio.ctx,oldMuted=M.audio.muted,music=[];
    M.audio.ctx={state:'running'};M.audio.muted=false;
    for(let zone=0;zone<3;zone++){
      const notes=[];M.audio.zone=zone;M.audio.musicMode=null;M.session.boss=null;
      M.audio.tone=(...note)=>notes.push(note);
      for(let i=0;i<32;i++)M.audio.update(.5);
      const signature=JSON.stringify(notes),normalInterval=M.audio.timer;
      M.session.boss={id:zone===1?'carabinero':'matahombres',active:true,dead:false,phase:1};M.audio.update(.5);const phase1=M.audio.timer;
      M.session.boss.phase=2;M.audio.update(.5);const phase2=M.audio.timer;
      music.push({zone,signature,normalInterval,phase1,phase2,notes:notes.length});
    }
    M.audio.tone=oldTone;M.audio.ctx=oldContext;M.audio.muted=oldMuted;
    const uniqueMelodies=new Set(music.map(item=>item.signature)).size===3;
    return {hazards:output,cannotSkipRescueByJumping:cannotSkip,canDropFromLedge:dropped,aid,legacySaves,uniqueMelodies,music:music.map(({signature,...item})=>item)};
  });
  for(const h of mechanics.hazards){assert(h.warningIsHarmless);assert.equal(h.activeHealth,h.expectedHealth);assert(h.remainedPaused);}
  assert(mechanics.cannotSkipRescueByJumping);assert(mechanics.canDropFromLedge);
  for(const aid of mechanics.aid){assert(aid.closedInitially&&aid.heldDuringAid&&aid.opensAfterAid);}
  for(const save of mechanics.legacySaves){assert(save.accepted&&save.opened&&save.checkpointRestored);assert.equal(save.desvios,0);}
  assert(mechanics.uniqueMelodies);for(const music of mechanics.music){assert(music.notes>32);assert(music.phase2<music.phase1&&music.phase1<music.normalInterval);}
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(__dirname,'../qa/mecanicas_capitulo.json'),JSON.stringify({status:'passed',...mechanics,errors},null,2));
  console.log(JSON.stringify({status:'passed',optionalRoutes:results.length,...mechanics},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
