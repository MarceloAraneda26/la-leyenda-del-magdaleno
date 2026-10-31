(() => {
  'use strict';
  const M=window.Magdaleno;
  M.state='preview';
  const STEP=1/60;
  const grid=document.getElementById('preview-grid');
  const status=document.getElementById('preview-status');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let action=new URLSearchParams(location.search).get('accion')==='arma'?'punch':'walk',paused=reducedMotion,time=0,last=0,dir=1;
  const labels={idle:'Reposo y respiración',walk:'Marcha con rodillas y tobillos',jump:'Subida, caída y aterrizaje',punch:'Arma básica: preparación, barrido y recuperación',power:'Definitiva real: preparación, acción, impacto y recuperación',win:'Celebración de la junta'};
  const views=[];
  for(const id of M.order){
    const card=document.createElement('article');
    card.className='preview-person';
    const canvas=document.createElement('canvas');
    canvas.width=230;canvas.height=290;canvas.setAttribute('aria-label','Animación de '+M.heroes[id].name);
    const heading=document.createElement('h2');heading.textContent=M.heroes[id].name.toUpperCase();
    const description=document.createElement('p');description.textContent=M.heroes[id].role;
    if(action==='punch')description.textContent=M.weapons[id].name;
    card.append(canvas,heading,description);grid.appendChild(card);
    const context=canvas.getContext('2d');context.imageSmoothingEnabled=false;views.push({id,canvas,context,description,caption:''});
  }
  function updateLabel(){status.textContent=labels[action]+(paused?' · EN PAUSA':'');document.getElementById('preview-pause').textContent=paused?'Reanudar':'Pausar';document.getElementById('preview-pause').setAttribute('aria-pressed',String(paused));}
  document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    action=button.dataset.action;time=0;
    document.querySelectorAll('[data-action]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    for(const view of views){view.caption='';view.description.textContent=action==='punch'?M.weapons[view.id].name:M.heroes[view.id].role;}
    updateLabel();
  }));
  document.querySelectorAll('[data-action]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.action===action)));
  document.getElementById('preview-pause').onclick=()=>{paused=!paused;updateLabel()};
  // Avance cuadro a cuadro: pausa y mueve exactamente un paso de simulación.
  const stepBy=n=>{paused=true;time=Math.max(0,Math.round(time/STEP+n)*STEP);updateLabel()};
  document.getElementById('preview-back').onclick=()=>stepBy(-1);
  document.getElementById('preview-forward').onclick=()=>stepBy(1);
  const flip=document.getElementById('preview-flip');
  flip.onclick=()=>{dir=-dir;flip.setAttribute('aria-pressed',String(dir<0));flip.textContent=dir<0?'Mirar a la derecha':'Mirar a la izquierda'};
  const marks=document.getElementById('preview-marks');
  function cross(c,p,col){c.fillStyle=col;c.fillRect(Math.round(p.x)-4,Math.round(p.y)-1,9,3);c.fillRect(Math.round(p.x)-1,Math.round(p.y)-4,3,9);}
  function frame(now){
    if(!last)last=now;
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(!paused)time+=dt*Number(document.getElementById('preview-speed').value);
    for(const view of views){
      const t=time,loop=t%1.5;
      let y=255,height=164,rig=null,def=null,elapsed=0;
      const pose={time:t,dir,armed:action!=='power'&&action!=='win'};
      if(action==='walk'){pose.walk=true;pose.speed=1;}
      if(action==='jump'){
        const j=t%1.3;
        if(j<.8){pose.air=true;pose.rising=j<.4;y-=Math.sin(j/.8*Math.PI)*70;}
        else pose.landing=Math.max(0,1-(j-.8)/.14);
      }
      if(action==='punch'){height=110;const hit=t%.85;pose.attack=hit<M.melee.duration?hit/M.melee.duration:-1;}
      if(action==='power'){
        // Misma secuencia que el juego; altura menor para que el crecimiento de Tobi quepa.
        height=110;def=M.powers[view.id];elapsed=Math.min(def.duration,t%(def.duration+.6));
        rig=M.powerPose(view.id,elapsed);pose.rig=rig;pose.air=rig.air;pose.rising=rig.rising;pose.giant=rig.scale;
        y-=(def.jumpHeight||0)*rig.jump*height/94;
      }
      if(action==='win')pose.win=true;
      M.ctx.setTransform(1,0,0,1,0,0);M.ctx.clearRect(0,0,M.W,M.H);
      M.character(view.id,115,y,height,pose);
      const c=view.context;
      c.clearRect(0,0,230,290);
      c.fillStyle='#314957';c.fillRect(20,258,190,2);
      c.drawImage(document.getElementById('game'),0,0,230,290,0,0,230,290);
      if(rig){
        const out=M.rigOut[view.id],tool=out?.tool||{};
        const atImpact=elapsed>=def.impact&&elapsed<def.impact+STEP;
        if(marks.checked){
          if(tool.grip){c.fillStyle='#64d5be';c.fillRect(Math.round(tool.grip.x)-2,Math.round(tool.grip.y)-2,5,5);}
          const hit=tool.tip||tool.bottom||tool.center||tool.palm||(view.id==='tobi'?{x:115,y:255}:null);
          if(hit)cross(c,hit,atImpact?'#ff5a4f':'#e88f7a');
          if(elapsed>=def.impact&&elapsed<def.impact+.12){c.fillStyle='#ff5a4f';c.fillRect(20,257,190,4);c.font='bold 11px monospace';c.textAlign='center';c.fillText('IMPACTO Y DAÑO',115,276);}
        }
        const caption=rig.phase.toUpperCase()+' · '+elapsed.toFixed(2)+' s';
        if(caption!==view.caption){view.caption=caption;view.description.textContent=caption;}
      }
    }
    requestAnimationFrame(frame);
  }
  M.loadAssets().then(()=>{updateLabel();requestAnimationFrame(frame)}).catch(error=>{status.textContent=error.message;console.error(error)});
})();
