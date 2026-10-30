/* Adaptación táctil, pantalla completa e instalación opcional. */
(() => {
  'use strict';
  const M=window.Magdaleno,root=document.documentElement,$=id=>document.getElementById(id);
  const touch=matchMedia('(pointer:coarse), (max-width:900px)'),status=$('mobile-health').closest('.mobile-status');
  const setState=M.setState;
  function state(){root.dataset.gameState=M.state;status.hidden=!M.session||!['play','dialogue','paused'].includes(M.state);}
  M.setState=function(value){setState(value);state();};state();
  let last='';const render=M.render;
  M.render=function(){
    render();if(!M.session||!touch.matches)return;
    const s=M.session,p=s.player,hp=Math.max(0,Math.ceil(p.hp)),energy=Math.min(100,Math.floor(p.energy));
    const value=[s.hero,hp,energy,s.fichas.length,p.onGround].join(':');if(value===last)return;last=value;
    $('mobile-hero').textContent=M.heroes[s.hero].name.toUpperCase();$('mobile-health').textContent=hp;$('mobile-energy').textContent=energy;
    $('mobile-health-bar').style.width=hp+'%';$('mobile-energy-bar').style.width=energy+'%';$('mobile-fichas').textContent=s.fichas.length+'/5 AMIGOS';
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
