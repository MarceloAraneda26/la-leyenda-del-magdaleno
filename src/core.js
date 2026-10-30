/* Núcleo derivado de tiboxin_corregido.html: paso fijo, colisión por tiles,
 * salto con coyote time y buffer. Interfaz, campaña y combate son propios. */
(() => {
'use strict';const M=window.Magdaleno,T=M.T;
M.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));M.lerp=(a,b,t)=>a+(b-a)*t;
M.overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
M.rng=seed=>{let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)};
M.box=e=>({x:e.x-e.hw,y:e.y-e.h,w:e.hw*2,h:e.h});
M.solidAt=(c,r)=>{const s=M.session;if(!s)return false;if(c<0||c>=s.cols)return true;if(r<0||r>=12)return false;if((r===8||r===9)&&s.rescues?.some(q=>!q.done&&c===q.col+3))return true;return s.grid[r][c]==='#'};
M.oneWayAt=(c,r)=>!!M.session&&r>=0&&r<12&&c>=0&&c<M.session.cols&&M.session.grid[r][c]==='=';
M.moveX=function(e,dx){e.x+=dx;e.hitWall=false;const r0=Math.floor((e.y-e.h+.5)/T),r1=Math.floor((e.y-.5)/T);if(dx>0){const c=Math.floor((e.x+e.hw)/T);for(let r=r0;r<=r1;r++)if(M.solidAt(c,r)){e.x=c*T-e.hw-.001;e.vx=0;e.hitWall=true;break}}else if(dx<0){const c=Math.floor((e.x-e.hw)/T);for(let r=r0;r<=r1;r++)if(M.solidAt(c,r)){e.x=(c+1)*T+e.hw+.001;e.vx=0;e.hitWall=true;break}}};
M.moveY=function(e,dy){const prev=e.y;e.y+=dy;e.onGround=false;const c0=Math.floor((e.x-e.hw+.5)/T),c1=Math.floor((e.x+e.hw-.5)/T);if(dy>=0){const r=Math.floor(e.y/T);for(let c=c0;c<=c1;c++)if(M.solidAt(c,r)||(M.oneWayAt(c,r)&&!(e.dropT>0)&&prev<=r*T+1)){e.y=r*T;e.vy=0;e.onGround=true;break}}else{const r=Math.floor((e.y-e.h)/T);for(let c=c0;c<=c1;c++)if(M.solidAt(c,r)){e.y=(r+1)*T+e.h+.001;e.vy=0;break}}};
M.keys={};M.pressed={};
const map={down:['ArrowDown','KeyS'],left:['ArrowLeft','KeyA'],right:['ArrowRight','KeyD'],jump:['ArrowUp','KeyW','Space'],attack:['KeyZ'],ultimate:['KeyV'],interact:['KeyE','Enter'],pause:['Escape','KeyP']};
M.down=a=>map[a].some(k=>M.keys[k]);M.tap=a=>map[a].some(k=>M.pressed[k]);
M.clearInput=()=>{M.keys={};M.pressed={};document.querySelectorAll('.is-held').forEach(button=>button.classList.remove('is-held'))};
M.input=(code,down)=>{if(down&&!M.keys[code])M.pressed[code]=true;M.keys[code]=down};
window.addEventListener('keydown',e=>{if(e.target.closest('button')&&(e.code==='Enter'||e.code==='Space'))return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();M.input(e.code,true);if(e.code==='KeyM'&&!e.repeat)M.audio.toggle()});
window.addEventListener('keyup',e=>M.input(e.code,false));window.addEventListener('blur',()=>{M.clearInput();if(M.state==='play')M.pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){M.clearInput();if(M.state==='play')M.pause()}});
document.querySelectorAll('[data-key]').forEach(b=>{const pointers=new Set();b.addEventListener('pointerdown',e=>{e.preventDefault();pointers.add(e.pointerId);b.setPointerCapture(e.pointerId);b.classList.add('is-held');M.input(b.dataset.key,true)});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{pointers.delete(e.pointerId);if(!pointers.size){b.classList.remove('is-held');M.input(b.dataset.key,false)}})});
M.audio={muted:true,ctx:null,timer:0,tick:0,zone:0,init(){if(!this.ctx)try{this.ctx=new(window.AudioContext||window.webkitAudioContext)()}catch{}if(this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{})},toggle(){this.muted=!this.muted;if(!this.muted)this.init();const b=document.getElementById('sound-button');b.textContent='SONIDO: '+(this.muted?'NO':'SÍ');b.setAttribute('aria-label',this.muted?'Activar sonido':'Silenciar sonido')},tone(f,end,d,type='square',volume=.035,delay=0){if(this.muted||!this.ctx||this.ctx.state!=='running')return;const ac=this.ctx,t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+d);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d+.02)},sfx(kind){const bank={jump:[300,620,.12],hit:[180,55,.09],hurt:[130,45,.25],can:[620,1200,.12],token:[440,880,.3],ultimate:[180,900,.4],dialog:[330,460,.035],checkpoint:[440,660,.2],win:[520,1050,.6]};this.tone(...(bank[kind]||bank.hit))},update(dt){if(this.muted||!this.ctx)return;this.timer-=dt;if(this.timer>0)return;const boss=M.session?.boss?.active&&!M.session.boss.dead;this.timer=60/(boss?144:[112,128,104][this.zone])/2;const melody=[0,7,12,10,7,3,5,7,0,3,7,12,10,7,5,3],root=[146.83,164.81,130.81][this.zone],i=this.tick++;this.tone(root*Math.pow(2,melody[i%16]/12),root*Math.pow(2,melody[i%16]/12),this.timer*.7,'triangle',.025);if(i%2===0)this.tone(root/2,root/2,this.timer*.8,'triangle',.035);if(i%4===0)this.tone(95,35,.08,'sine',.04)}};
M.loadAssets=async()=>{M.images={};M.bounds={};await Promise.all([...M.order,'carabinero','matahombres'].map(id=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{M.images[id]=img;M.bounds[id]=M.assetBounds?.[id]||{x:0,y:0,w:img.width,h:img.height};resolve()};img.onerror=()=>reject(new Error('No se pudo cargar assets/'+id+'.png. Conserva la carpeta assets junto a index.html.'));img.src='assets/'+id+'.png'})))};
})();


