/* Móvil principal: horizontal, entrada de dos pulgares y cámara que acompaña los saltos. */
(() => {
  'use strict';
  const M=window.Magdaleno,root=document.documentElement,$=id=>document.getElementById(id);
  const mobile=matchMedia('(pointer:coarse), (max-width:900px)'),portrait=matchMedia('(orientation:portrait)');
  const stage=document.querySelector('.game-frame'),canvas=$('game'),status=$('mobile-health').closest('.mobile-status');
  const rotate=$('rotate-screen'),help=$('touch-onboarding'),interact=document.querySelector('[data-key=KeyE]'),drop=document.querySelector('[data-key=ArrowDown]');
  let scale=1,stageHeight=540,camY=0,helpClosed=false,helpUntil=0,last='',lastCallout='',lastTransform='';
  try{helpClosed=localStorage.getItem('magdaleno_touch_help_v1')==='seen';}catch{}
  function state(){root.dataset.gameState=M.state;if(M.state==='paused')$('pause-save-status').textContent=M.saveAvailable===false?'El navegador no permite guardar. Conserva esta pestaña abierta; la partida está solo en memoria.':'Tu progreso se guarda en los puntos de control y al reunir a cada amigo.';const active=!!M.session&&['play','dialogue','paused'].includes(M.state);status.hidden=!M.mobileUI||!active;rotate.hidden=!(M.mobileUI&&portrait.matches&&active);if(M.state!=='play'||!rotate.hidden)help.hidden=true;if(!M.mobileUI){canvas.style.transform='';lastTransform='';}}
  function layout(){M.mobileUI=mobile.matches;root.dataset.mobile=String(M.mobileUI);M.camLead=M.mobileUI?330:350;M.htmlCallouts=M.mobileUI;const rect=stage.getBoundingClientRect();scale=rect.width/M.W;stageHeight=rect.height;M.viewInset=M.mobileUI?{left:Math.min(240,Math.ceil(172/Math.max(.1,scale))),right:Math.min(250,Math.ceil(180/Math.max(.1,scale)))}:{left:0,right:0};state();}
  const setState=M.setState;M.setState=function(value){setState(value);state();reflectInstall();};
  const update=M.update;M.update=function(dt){if(M.mobileUI&&portrait.matches&&M.state==='play'){M.pause();return;}if(M.mobileUI&&M.session)M.camLead=M.session.player.face>0?330:M.W-330;update(dt);};
  function orientation(){M.clearInput();if(M.state==='play')M.pause();layout();}
  mobile.addEventListener('change',layout);portrait.addEventListener('change',orientation);new ResizeObserver(layout).observe(stage);window.visualViewport?.addEventListener('resize',layout);
  $('dialogue').addEventListener('click',event=>{if(!event.target.closest('#dialogue-next'))M.nextDialogue();});
  $('touch-onboarding-dismiss').onclick=()=>{helpClosed=true;help.hidden=true;try{localStorage.setItem('magdaleno_touch_help_v1','seen');}catch{}};
  const render=M.render;M.render=function(){
    render();if(!M.mobileUI)return;
    const s=M.session,playing=M.state==='play',p=s?.player;
    if(s&&['play','dialogue','paused','ending'].includes(M.state)){const visible=stageHeight/Math.max(.1,scale),base=Math.max(0,565-visible),target=Math.max(0,Math.min(base,p.y-170));camY=M.lerp(camY,target,.18);const offset=visible>=540?(stageHeight-540*scale)/2:-camY*scale;const transform='translate3d(0,'+offset.toFixed(1)+'px,0)';if(transform!==lastTransform){canvas.style.transform=transform;lastTransform=transform;}}
    const prompt=playing?M.prompt||'':'',notice=playing?(M.notice?.life>0?M.notice.text:M.banner>0?M.zones[s.zone].name:''):'';
    const value=prompt+'|'+notice;if(value!==lastCallout){lastCallout=value;$('mobile-prompt').textContent=prompt.replace(/^E · /,'').replace(/^Z · /,'ARMA · ');$('mobile-notice').textContent=notice.replace('Z: ARMA · V: DEFINITIVA · E: AYUDAR','MUEVE · SALTA · USA TU ARMA').replace('↓ + ESPACIO: BAJA DE UNA PLATAFORMA','BAJAR: TOCA ↓ SOBRE UNA PLATAFORMA').replace('ESPACIO: SALTA LOS ESCALONES','SALTAR: SUPERA LOS ESCALONES');$('mobile-callout').hidden=!prompt&&!notice;}
    interact.hidden=!playing||!/^E · /.test(prompt);if(!interact.hidden)interact.querySelector('small').textContent=prompt.includes('SEGUIR')?'SEGUIR':prompt.includes('HABLAR')||prompt.includes('FISCALIZACIÓN')?'HABLAR':'AYUDAR';
    const canDrop=playing&&p?.onGround&&M.oneWayAt(Math.floor(p.x/M.T),Math.floor((p.y+.5)/M.T));drop.hidden=!canDrop&&!drop.classList.contains('is-held');
    const boss=s?.boss,showBoss=!!(boss?.active&&!boss.dead&&['play','paused'].includes(M.state));root.dataset.boss=String(showBoss);$('mobile-boss').hidden=!showBoss;if(showBoss){$('mobile-boss-name').textContent=boss.id==='carabinero'?'FISCALIZACIÓN':'MATAHOMBRES';$('mobile-boss-health').style.width=Math.max(0,boss.hp/boss.max*100)+'%';}
    if(!s)return;const hp=Math.max(0,Math.ceil(p.hp)),energy=Math.min(100,Math.floor(p.energy)),routes=Object.keys(M.progress.flags).filter(key=>key.startsWith('desvio_')&&M.progress.flags[key]).length;
    const hud=[s.hero,hp,energy,s.fichas.length,s.score,routes,p.onGround,p.ult>0].join(':');if(hud!==last){last=hud;$('mobile-hero').textContent=M.heroes[s.hero].name.toUpperCase();$('mobile-health').textContent=hp;$('mobile-energy').textContent=energy;$('mobile-health-bar').style.width=hp+'%';$('mobile-energy-bar').style.width=energy+'%';$('mobile-fichas').textContent=s.fichas.length+'/5 AMIGOS';$('mobile-fichas').append(document.createElement('br'),s.score+' PTS · '+routes+'/6');$('touch-energy').textContent=energy>=100?'LISTA':energy+'/100';const ultimate=document.querySelector('[data-key=KeyV]');ultimate.classList.toggle('is-ready',energy>=100);ultimate.setAttribute('aria-disabled',String(energy<100||!p.onGround||p.ult>0));}
    if(!helpClosed&&playing&&!portrait.matches){if(!helpUntil)helpUntil=M.time+8;help.hidden=M.time>helpUntil||p.x>480;}else help.hidden=true;
  };
  const fullscreen=$('fullscreen-button');fullscreen.hidden=!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
  fullscreen.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.webkitFullscreenElement)document.webkitExitFullscreen();else{const shell=document.querySelector('.shell');if(shell.requestFullscreen)await shell.requestFullscreen();else shell.webkitRequestFullscreen();if(screen.orientation?.lock)await screen.orientation.lock('landscape').catch(()=>{});}}catch{M.notify('GIRA EL CELULAR PARA JUGAR EN HORIZONTAL');}};
  for(const element of [canvas,document.querySelector('.touch-controls')])element.addEventListener('contextmenu',event=>event.preventDefault());
  let installPrompt;const install=$('install-button');
  function reflectInstall(){install.hidden=!!M.session&&['play','dialogue','paused'].includes(M.state)||matchMedia('(display-mode:standalone)').matches||!!navigator.standalone;}
  install.onclick=async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;}else if(M.state==='title'){$('loading-message').textContent='INSTALAR: menú del navegador → Agregar a pantalla de inicio';$('loading-message').style.display='block';}else M.notify('INSTALAR: MENÚ DEL NAVEGADOR · AGREGAR A PANTALLA DE INICIO');};
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;reflectInstall();});window.addEventListener('appinstalled',()=>{install.hidden=true;installPrompt=null;});
  if('serviceWorker' in navigator&&window.isSecureContext&&!new URLSearchParams(location.search).has('qa'))window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{});});
  layout();reflectInstall();
})();
