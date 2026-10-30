/* Auditoría de definitivas 0.5: motor real a 60 pasos por segundo, con render en cada paso.
 * Mide agarre, contacto, momento del daño, saltos de pose y simetría. Requiere tools/server.cjs. */
const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path');
const output=path.resolve(__dirname,'../auditoria_animaciones');fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?qa=1');await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  const results=await page.evaluate(()=>{
    const a=__magdaleno,M=a.M;a.setManual();
    M.background=()=>{M.ctx.fillStyle='#102032';M.ctx.fillRect(0,0,M.W,M.H);};M.terrain=()=>{};M.props=()=>{};M.enemy=()=>{};
    const FLOOR=450,results=[];
    function run(hero,face,capture){
      a.start(hero);a.dismiss();M.loadZone(0,9);M.setState('play');
      const s=M.session,p=s.player,def=M.powers[hero];s.rescues=[];s.hazards=[];s.cans=[];s.boss=null;
      a.teleport(400);p.face=face;p.energy=100;s.enemies=[M.makeEnemy('folder','audit-target',face>0?11:6)];s.enemies[0].hp=s.enemies[0].max=1000;
      M.progress.flags.tutorial_escalones=true;M.progress.flags.tutorial_plataforma=true;M.ultimate();
      const frames=[];let frame=0;
      const strip=capture?document.createElement('canvas'):null,sg=strip?.getContext('2d');
      const impactFrame=Math.ceil(def.impact*60-1e-6),wanted=capture?[...new Set([1,Math.round(def.strikeStart*30),Math.round(def.strikeStart*60),impactFrame-2,impactFrame-1,impactFrame,impactFrame+6,Math.round((def.impact+(def.duration-def.impact)*.6)*60)+6,Math.round(def.duration*60)+14])].sort((a,b)=>a-b):[];
      if(strip){strip.width=wanted.length*220;strip.height=380;sg.imageSmoothingEnabled=false;sg.fillStyle='#102032';sg.fillRect(0,0,strip.width,strip.height);}
      while(frame<=Math.round(def.duration*60)+16){
        a.step();frame++;
        M.cam=M.clamp(p.x-350,0,s.cols*M.T-M.W);M.shake=0;M.banner=0;M.notice=null;M.prompt='';M.render();
        const o=M.rigOut[hero],rig=p.rig,fx=s.effects.find(f=>f.anchor);
        frames.push({frame,seconds:frame/60,phase:rig?.phase||'reposo',damage:p.ultUsed,physicalY:p.y,rig:rig?{front:rig.front,back:rig.back,lift:rig.lift,scale:rig.scale}:null,
          hand:o?.front||null,tool:o?.tool?JSON.parse(JSON.stringify(o.tool)):{},effect:fx?{kind:fx.kind,ox:fx.ox,oy:fx.oy}:null,cam:M.cam});
        const index=wanted.indexOf(frame);
        if(index>=0){const x=index*220,sx=p.x-M.cam-120;sg.drawImage(document.getElementById('game'),sx,100,240,360,x,0,220,330);
          sg.fillStyle='#64798a';sg.fillRect(x+3,Math.round((FLOOR-100)*330/360),214,1);
          sg.fillStyle='#efc37d';sg.textAlign='center';sg.font='bold 13px monospace';sg.fillText((frame/60).toFixed(2)+' s · '+(rig?.phase||'reposo').toUpperCase(),x+110,350);
          sg.fillStyle=p.ultUsed?'#f08f7a':'#b7cbd8';sg.font='10px monospace';sg.fillText(frame===impactFrame?'IMPACTO Y DAÑO':p.ultUsed?'DAÑO YA APLICADO':'ANTES DEL DAÑO',x+110,368);}
      }
      return {frames,impactFrame,png:strip?strip.toDataURL('image/png').split(',')[1]:null};
    }
    for(const hero of M.order){
      const def=M.powers[hero],sides={};
      for(const face of [1,-1]){
        const {frames,impactFrame,png}=run(hero,face,face===1);
        const impact=frames.find(f=>f.damage),before=frames[frames.indexOf(impact)-1];
        const contactPoint=f=>hero==='ruzio'?f.tool.tip:hero==='pulga'?f.tool.bottom:null;
        // Incluye la entrada desde el reposo y la vuelta a él: sin definitiva, la pose es la de reposo.
        const rest={front:[0,.07],back:[0,-.07]},timeline=[{phase:'reposo',rig:null,tool:{}},...frames];
        let grip=0,jump=0;
        for(let i=1;i<timeline.length;i++){const f=timeline[i],g=timeline[i-1];
          if(f.tool.grip&&f.hand)grip=Math.max(grip,Math.hypot(f.tool.grip.x-f.hand.x,f.tool.grip.y-f.hand.y));
          if(f.phase!=='acción'&&g.phase!=='acción'){const a=f.rig||rest,b=g.rig||rest;for(const k of ['front','back'])for(const j of [0,1])jump=Math.max(jump,Math.abs(a[k][j]-b[k][j]));}}
        const cp=contactPoint(impact),cpBefore=before&&contactPoint(before);
        const originPoint=hero==='marcelo'?impact.tool.center:hero==='pallo'?impact.tool.palm:null;
        const effectFrame=frames.find(f=>f.effect&&f.effect.ox!=null);
        sides[face]={
          impactSeconds:+impact.seconds.toFixed(3),designedImpact:def.impact,impactFrame:impact.frame,expectedFrame:impactFrame,
          contactGapPx:cp?+(450-cp.y).toFixed(1):null,gapPreviousFramePx:cpBefore?+(450-cpBefore.y).toFixed(1):null,
          physicalYAtImpact:impact.physicalY,maxPhysicalJumpPx:+Math.max(...frames.map(f=>450-f.physicalY)).toFixed(1),
          liftAtImpact:impact.rig?.lift??null,scaleAtImpact:impact.rig?.scale??null,
          effectOriginErrorPx:originPoint&&effectFrame?+Math.hypot(effectFrame.effect.ox-effectFrame.cam-originPoint.x,effectFrame.effect.oy-originPoint.y).toFixed(2):null,
          maxGripErrorPx:+grip.toFixed(3),maxPoseJumpOutsideStrikeRad:+jump.toFixed(3)
        };
        if(png)sides.png=png;
      }
      results.push({hero,duration:def.duration,impact:def.impact,strikeStart:def.strikeStart,right:sides[1],left:sides[-1],png:sides.png});
    }
    return results;
  });
  const criteria=[];
  for(const r of results){
    const R=r.right,L=r.left,check=(name,ok,detail)=>criteria.push({hero:r.hero,name,ok:!!ok,detail});
    check('Daño en el paso previsto',R.impactFrame===R.expectedFrame&&L.impactFrame===L.expectedFrame,R.impactSeconds+' s');
    if(R.contactGapPx!==null)check('Contacto con el suelo en el paso del daño (≤ 4 px) y sin contacto en el paso anterior',Math.abs(R.contactGapPx)<=4&&Math.abs(L.contactGapPx)<=4&&R.gapPreviousFramePx>4&&L.gapPreviousFramePx>4,R.contactGapPx+' / '+L.contactGapPx+' px');
    if(r.hero==='pulga')check('Posición física en el suelo al impactar',R.physicalYAtImpact===450&&L.physicalYAtImpact===450,'salto real '+R.maxPhysicalJumpPx+' px');
    if(r.hero==='tobi')check('Aterriza del salto en el impacto',R.liftAtImpact===0&&L.liftAtImpact===0,'escala '+R.scaleAtImpact);
    if(R.effectOriginErrorPx!==null)check('El efecto nace del objeto o la mano (≤ 2 px)',R.effectOriginErrorPx<=2&&L.effectOriginErrorPx<=2,R.effectOriginErrorPx+' / '+L.effectOriginErrorPx+' px');
    check('Agarre a menos de 2 px de la mano',R.maxGripErrorPx<2&&L.maxGripErrorPx<2,R.maxGripErrorPx+' px');
    check('Sin saltos de pose fuera del golpe (≤ 0,3 rad por paso)',R.maxPoseJumpOutsideStrikeRad<=.3&&L.maxPoseJumpOutsideStrikeRad<=.3,R.maxPoseJumpOutsideStrikeRad+' rad');
  }
  for(const r of results)if(r.png)fs.writeFileSync(path.join(output,r.hero+'_secuencia_v05.png'),Buffer.from(r.png,'base64'));
  const clean=results.map(({png,...r})=>r);
  const report={source:'Motor real 0.5 a 60 pasos por segundo, render en cada paso, fondo aislado. Derecha e izquierda.',status:criteria.every(c=>c.ok)&&!errors.length?'passed':'failed',errors,criteria,characters:clean};
  fs.writeFileSync(path.join(output,'mediciones_v05.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:report.status,errors,criteria},null,2));await browser.close();
  if(report.status!=='passed')process.exit(1);
})().catch(error=>{console.error(error);process.exit(1)});
