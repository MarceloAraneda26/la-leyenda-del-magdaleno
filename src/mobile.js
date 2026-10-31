/* Adaptación táctil, pantalla completa e instalación opcional. */
(() => {
  'use strict';
  const M=window.Magdaleno,root=document.documentElement,$=id=>document.getElementById(id);
  const touch=matchMedia('(pointer:coarse), (max-width:900px)'),status=$('mobile-health').closest('.mobile-status');
  // Vertical en celular: mobile.css recorta el lienzo para acercar la escena y oculta el marcador interno.
  // La cámara deja más espacio por delante del protagonista para compensar el recorte.
  const compact=matchMedia('(max-width:600px) and (orientation:portrait)');
  // En ese recorte, avisos e indicaciones del lienzo quedarían en 6 o 7 px: se muestran en HTML sobre la escena.
  function layout(){M.camLead=compact.matches?300:350;M.htmlCallouts=compact.matches;}
  compact.addEventListener('change',layout);layout();
  const setState=M.setState;
  function state(){root.dataset.gameState=M.state;status.hidden=!M.session||!['play','dialogue','paused'].includes(M.state);}
  M.setState=function(value){setState(value);state();};state();
  // Tocar cualquier parte del cuadro de diálogo avanza, no solo el botón SEGUIR.
  $('dialogue').addEventListener('click',event=>{if(!event.target.closest('#dialogue-next'))M.nextDialogue();});
  let last='',lastCallout='';const render=M.render,callout=$('mobile-callout');
  M.render=function(){
    render();
    const show=M.htmlCallouts&&M.state==='play'&&!!M.session,prompt=show?M.prompt||'':'',notice=show&&M.notice?.life>0?M.notice.text:'';
    const calloutValue=prompt+'|'+notice;
    if(calloutValue!==lastCallout){lastCallout=calloutValue;$('mobile-prompt').textContent=prompt;$('mobile-notice').textContent=notice;callout.hidden=!prompt&&!notice;}
    if(!M.session||!touch.matches)return;
    const s=M.session,p=s.player,hp=Math.max(0,Math.ceil(p.hp)),energy=Math.min(100,Math.floor(p.energy));
    const routes=Object.keys(M.progress.flags).filter(key=>key.startsWith('desvio_')&&M.progress.flags[key]).length;
    const value=[s.hero,hp,energy,s.fichas.length,s.score,routes,p.onGround].join(':');if(value===last)return;last=value;
    $('mobile-hero').textContent=M.heroes[s.hero].name.toUpperCase();$('mobile-health').textContent=hp;$('mobile-energy').textContent=energy;
    $('mobile-health-bar').style.width=hp+'%';$('mobile-energy-bar').style.width=energy+'%';
    const fichas=$('mobile-fichas');fichas.textContent=s.fichas.length+'/5 AMIGOS';fichas.append(document.createElement('br'),s.score+' PTS · '+routes+'/6 DESVÍOS');
    $('touch-energy').textContent=energy>=100?'LISTA':energy+'/100';const ultimate=document.querySelector('[data-key="KeyV"]');
    ultimate.classList.toggle('is-ready',energy>=100);ultimate.setAttribute('aria-disabled',String(energy<100||!p.onGround));
  };
  const fullscreen=$('fullscreen-button');fullscreen.hidden=!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
  fullscreen.onclick=async()=>{
    try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.webkitFullscreenElement)document.webkitExitFullscreen();else {const shell=document.querySelector('.shell');if(shell.requestFullscreen)await shell.requestFullscreen();else shell.webkitRequestFullscreen();}}
    catch{M.notify('Puedes girar el celular para ampliar el escenario.');}
  };
  function orientation(){M.clearInput();if(M.state==='play')M.pause();}
  matchMedia('(orientation:portrait)').addEventListener('change',orientation);
  document.getElementById('game').addEventListener('contextmenu',event=>event.preventDefault());
  document.querySelector('.touch-controls').addEventListener('contextmenu',event=>event.preventDefault());
  let installPrompt;const install=$('install-button');
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;install.hidden=false;});
  install.onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;install.hidden=true;};
  window.addEventListener('appinstalled',()=>{install.hidden=true;installPrompt=null;});
  // HTTP local remains usable; offline installation needs HTTPS or localhost.
  if('serviceWorker' in navigator&&window.isSecureContext&&!new URLSearchParams(location.search).has('qa'))window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{});});
})();
