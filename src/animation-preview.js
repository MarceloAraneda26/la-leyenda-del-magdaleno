(() => {
  'use strict';
  const M=window.Magdaleno;
  M.state='preview';
  const grid=document.getElementById('preview-grid');
  const status=document.getElementById('preview-status');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let action='walk',paused=reducedMotion,time=0,last=0;
  const labels={idle:'Reposo y respiración',walk:'Marcha con rodillas y tobillos',jump:'Subida, caída y aterrizaje',punch:'Preparación, impacto y recuperación',cast:'Preparación del especial',win:'Celebración de la junta'};
  const views=[];
  for(const id of M.order){
    const card=document.createElement('article');
    card.className='preview-person';
    const canvas=document.createElement('canvas');
    canvas.width=230;canvas.height=290;canvas.setAttribute('aria-label','Animación de '+M.heroes[id].name);
    const heading=document.createElement('h2');heading.textContent=M.heroes[id].name.toUpperCase();
    const description=document.createElement('p');description.textContent=M.heroes[id].role;
    card.append(canvas,heading,description);grid.appendChild(card);
    const context=canvas.getContext('2d');context.imageSmoothingEnabled=false;views.push({id,canvas,context});
  }
  function updateLabel(){status.textContent=labels[action]+(paused?' · EN PAUSA':'');document.getElementById('preview-pause').textContent=paused?'Reanudar':'Pausar';document.getElementById('preview-pause').setAttribute('aria-pressed',String(paused));}
  document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    action=button.dataset.action;time=0;
    document.querySelectorAll('[data-action]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    updateLabel();
  }));
  document.getElementById('preview-pause').onclick=()=>{paused=!paused;updateLabel()};
  function frame(now){
    if(!last)last=now;
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(!paused)time+=dt*Number(document.getElementById('preview-speed').value);
    for(const view of views){
      const t=time,loop=t%1.5;
      let y=255;
      const pose={time:t,dir:1};
      if(action==='walk'){pose.walk=true;pose.speed=1;}
      if(action==='jump'){
        const j=t%1.3;
        if(j<.8){pose.air=true;pose.rising=j<.4;y-=Math.sin(j/.8*Math.PI)*70;}
        else pose.landing=Math.max(0,1-(j-.8)/.14);
      }
      if(action==='punch')pose.attack=loop<.5?loop/.5:-1;
      if(action==='cast')pose.cast=true;
      if(action==='win')pose.win=true;
      M.ctx.clearRect(0,0,M.W,M.H);
      M.character(view.id,115,y,164,pose);
      view.context.clearRect(0,0,230,290);
      view.context.fillStyle='#314957';view.context.fillRect(30,258,170,2);
      view.context.drawImage(document.getElementById('game'),0,0,230,290,0,0,230,290);
    }
    requestAnimationFrame(frame);
  }
  M.loadAssets().then(()=>{updateLabel();requestAnimationFrame(frame)}).catch(error=>{status.textContent=error.message;console.error(error)});
})();
