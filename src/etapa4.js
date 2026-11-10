/* Etapa 4: los recuerdos y el último Magdaleno. Huincha de recuerdos, camino a los arcades y PONG contra Don Mario. */
(() => {'use strict';
const M=window.Magdaleno,E=window.Etapa4,D=E.draw,$=id=>document.getElementById(id),R=D.R,T=D.T;
const g=M.ctx,W=960,H=540,G=455,qa=new URLSearchParams(location.search).has('qa');
let hero=(()=>{const q=new URLSearchParams(location.search).get('hero'),c=M.campaign?.snapshot().hero;return E.heroes.includes(q)?q:E.heroes.includes(c)?c:'marcelo';})(),mode='title',paused=false,time=0,dlg=null;const view={x:0};
const others=()=>E.friends.filter(id=>id!==hero);
const rand=M.rng(4242);
// ---------- Utilidades de interfaz ----------
function setMode(next){mode=next;$('e4-hu-next').hidden=!(next==='huincha'&&hu.focus&&hu.ready);document.documentElement.dataset.e4=next;M.state=['huincha','street','pong'].includes(next)&&!dlg&&!paused?'play':'paused';M.clearInput();}
function caption(text,secs=0){const c=$('e4-caption');c.hidden=!text;if(c.textContent!==text)c.textContent=text||'';c.dataset.until=secs?String(time+secs):'';}
function say(lines,done,opts={}){dlg={lines:lines.map(([who,text])=>({who:who==='hero'?hero:who,text})),i:0,done,location:opts.location||'',last:opts.last||'SEGUIR →'};$('e4-dialog').hidden=false;M.state='paused';M.clearInput();paintDialog();$('e4-next').focus({preventScroll:true});}
function paintDialog(){const l=dlg.lines[dlg.i],role=M.heroes[l.who]?.role||{cote:'AMIGA',mario:'DUEÑO DE LOS ARCADES',camanchaca:'LA VOZ DE LOS PENDIENTES'}[l.who]||'';$('e4-location').textContent=dlg.location;$('e4-count').textContent=(dlg.i+1)+' / '+dlg.lines.length;$('e4-speaker').textContent=E.names[l.who]||l.who;$('e4-role').textContent=role;$('e4-line').textContent=l.text;$('e4-next').textContent=dlg.i===dlg.lines.length-1?dlg.last:'SEGUIR →';D.portrait($('e4-portrait'),l.who);$('accessible-status').textContent=(E.names[l.who]||l.who)+': '+l.text;}
function nextLine(){if(!dlg)return;dlg.i++;if(dlg.i<dlg.lines.length){paintDialog();M.audio.sfx('dialog');return;}const done=dlg.done;dlg=null;$('e4-dialog').hidden=true;setMode(mode);done?.();}
$('e4-next').onclick=nextLine;
document.addEventListener('keydown',e=>{if(!dlg||!['Enter','Space'].includes(e.code))return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)nextLine();},true);
M.pause=()=>{if(M.state!=='play')return;paused=true;M.state='paused';$('e4-pause').hidden=false;M.clearInput();};
function resume(){if(!paused||rotated)return;paused=false;$('e4-pause').hidden=true;setMode(mode);}
$('e4-resume').onclick=resume;
// Esc o P también sacan de la pausa; se detiene aquí para que el motor no vuelva a pausar con la misma tecla.
document.addEventListener('keydown',e=>{if(!paused||!['Escape','KeyP'].includes(e.code))return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)resume();},true);
$('e4-menu').onclick=()=>{paused=false;$('e4-pause').hidden=true;toTitle();};
$('e4-pause-button').onclick=()=>M.pause();
$('sound-button').onclick=()=>M.audio.toggle();M.audio.reflect();
// Celular en vertical: aviso de girar y pausa, igual que en las otras etapas.
const touchMQ=matchMedia('(pointer:coarse), (any-pointer:coarse) and (max-width:900px)'),portraitMQ=matchMedia('(orientation:portrait)');let rotated=false;
function checkRotate(){rotated=touchMQ.matches&&portraitMQ.matches;$('e4-rotate').hidden=!rotated;if(rotated){M.clearInput();M.pause();}}
touchMQ.addEventListener('change',checkRotate);portraitMQ.addEventListener('change',checkRotate);
// ---------- Guardado: al pasar cada recuerdo, al entrar a cada parte y en cada tramo ----------
const SAVE_KEY='magdaleno_etapa4_v1',PARTS=['huincha','regreso','calle','pong','final'];let memorySave=null;
function validSave(r){return !!r&&r.version===1&&E.heroes.includes(r.hero)&&PARTS.includes(r.part)&&Number.isInteger(r.tramo)&&r.tramo>=0&&r.tramo<E.street.tramos.length&&Array.isArray(r.seen)&&r.seen.length<=E.friends.length&&r.seen.every(id=>E.friends.includes(id))&&new Set(r.seen).size===r.seen.length;}
function readSave(){for(const store of [()=>localStorage,()=>sessionStorage]){let r=null;try{r=JSON.parse(store().getItem(SAVE_KEY)||'null');}catch{}if(validSave(r))return r;}return validSave(memorySave)?memorySave:null;}
function save(part,extra={}){const r={version:1,hero,part,tramo:0,seen:[],...extra};memorySave=r;const value=JSON.stringify(r);try{localStorage.setItem(SAVE_KEY,value);}catch{}try{sessionStorage.setItem(SAVE_KEY,value);}catch{}refreshContinue();}
const partLabel=r=>({huincha:'LOS RECUERDOS',regreso:'EL REGRESO',calle:'TRAMO '+(r.tramo+1)+' DE 3',pong:'EL PONG',final:'EL FINAL'})[r.part];
function refreshContinue(){const r=readSave(),b=$('e4-continue');b.hidden=!r;if(r)b.textContent='CONTINUAR · '+E.names[r.hero].toUpperCase()+' · '+partLabel(r);}
function resumeSave(){const r=readSave();if(!r||!M.campaign.require(4))return false;hero=r.hero;heroButtons();$('e4-title').hidden=true;$('e4-end').hidden=true;M.audio.init();({huincha:()=>startHuincha(r.seen),regreso:part3,calle:()=>startStreet(r.tramo),pong:startPongIntro,final:part6})[r.part]();return true;}
// ---------- Parte 1 y 3: escenas en El Muñeco ----------
const cs={sub:'',t:0,fog:0};
function part1(){cs.sub='bottle';cs.t=0;cs.fog=.15;setMode('cut');caption('');say(E.fakeBottle,()=>{cs.sub='fog';cs.t=0;},{location:'BOTILLERÍA EL MUÑECO · BUENOS AIRES',last:'ENTRAR A LA CAMANCHACA'});}
function part3(){save('regreso');cs.sub='return';cs.t=0;cs.fog=1;setMode('cut');caption('');const lines=[['hero',E.reflection[hero]],...others().map(id=>[id,E.arrive[id]])];setTimeout(()=>{if(mode==='cut'&&cs.sub==='return')say(lines,()=>startStreet(0),{location:'BUENOS AIRES · DE VUELTA EN EL PRESENTE',last:'IR DONDE DON MARIO'});},qa?0:900);}
function street(g,cam,{neon=false,end=0}={}){const sky=g.createLinearGradient(0,0,0,G);sky.addColorStop(0,'#0e1a30');sky.addColorStop(1,'#3a3550');g.fillStyle=sky;g.fillRect(0,0,W,H);const sr=M.rng(77);for(let i=0;i<60;i++)R(g,(sr()*2400-cam*.05)%W+(sr()<0?W:0),sr()*230,2,2,'#9fb2c8');
 for(let i=-1;i<9;i++){const x=i*150-(cam*.4)%150;R(g,x,250,130,G-250,'#24304a');R(g,x+18,280,26,30,'#3c4a66');R(g,x+76,280,26,30,i%3?'#c69957':'#3c4a66');}
 for(let i=-1;i<6;i++){const wx=i*260-(cam%260),hue=['#5e6f7c','#7a6658','#5d6a59','#6b5f72'][((Math.floor(cam/260)+i)%4+4)%4];R(g,wx,215,230,G-215,hue);R(g,wx-6,205,242,14,'#3b3437');R(g,wx+24,270,46,52,'#2a3140');R(g,wx+28,274,38,44,((i+Math.floor(cam/260))%2)?'#d4a75e':'#38465c');R(g,wx+140,300,40,G-300,'#2c2522');R(g,wx+150,270,52,22,'#2a3140');}
 R(g,0,G,W,H-G,'#3a3f48');R(g,0,G,W,8,'#8f8d86');for(let i=0;i<12;i++)R(g,i*96-(cam%96),G+46,48,5,'#d8cf9a');
 if(end){const x=end-cam;R(g,x-30,170,420,G-170,'#1c1630');R(g,x-30,170,420,16,'#2f2547');const glow=.6+Math.sin(time*5)*.25;g.globalAlpha=glow;R(g,x-8,190,376,46,'#ff4fa3');g.globalAlpha=1;R(g,x-2,196,364,34,'#1c1630');T(g,'ARCADES DON MARIO',x+180,222,24,'#ff8fd0');R(g,x+120,300,120,G-300,'#0c0a14');R(g,x+128,308,104,G-316,'#5be3ff30');for(let i=0;i<3;i++){R(g,x+i*130-6,260,70,32,'#5be3ff');R(g,x+i*130-2,264,62,24,'#132033');}}}
function muneco(cam){street(g,cam);const x=520-cam;R(g,x,190,360,G-190,'#4d3a33');R(g,x,190,360,14,'#2e2320');R(g,x+30,210,300,40,'#1a1416');T(g,'EL MUÑECO',x+180,240,26,'#f0c27a');R(g,x+40,280,120,90,'#d6a35b');for(let i=0;i<4;i++)R(g,x+52+i*28,292,10,30,'#5a2a18');R(g,x+210,300,80,G-300,'#21181a');}
function fogLayer(a){if(a<=0)return;g.save();g.globalAlpha=Math.min(1,a);g.fillStyle='#9daaad';g.fillRect(0,0,W,H);g.restore();g.save();g.globalAlpha=Math.min(.8,a);for(let i=0;i<14;i++){const x=(i*173+time*30*(i%3+1))%(W+300)-150,y=60+(i*71)%420;g.fillStyle=['#82979d','#aeb8b6','#c3cbc8'][i%3];g.beginPath();g.ellipse(x,y,170,40,0,0,Math.PI*2);g.fill();}g.restore();}
function drawBottle(x,y){R(g,x,y,10,24,'#5a2a18');R(g,x+3,y-8,4,9,'#5a2a18');R(g,x+1,y+8,8,7,'#e6d29a');}
function updateCut(dt){cs.t+=dt;if(cs.sub==='fog'){cs.fog=Math.min(1.2,.15+cs.t*.7);if(cs.t>1.6)startHuincha();}if(cs.sub==='return')cs.fog=Math.max(0,1-cs.t*.8);if(cs.sub==='share'&&cs.t>.9&&$('e4-end').hidden){M.campaign.complete(4,hero);$('e4-end').hidden=false;$('e4-again').focus({preventScroll:true});}}
function drawCut(){if(cs.sub==='bottle'||cs.sub==='fog'){muneco(0);M.character(hero,360,G,140,{time,dir:1});drawBottle(382,G-78);fogLayer(cs.fog);return;}
 if(cs.sub==='return'){muneco(0);const list=others(),shown=dlg?Math.max(0,dlg.i):list.length;M.character(hero,360,G,140,{time,dir:1});if(dlg&&dlg.i===0)T(g,'?',360,G-160,30,'#ffe39a');list.slice(0,shown).forEach((id,i)=>M.character(id,i<3?120+i*72:560+(i-3)*80,G,id==='cote'?132:136,{time,dir:i<3?1:-1}));fogLayer(cs.fog);return;}
 if(cs.sub==='black'){R(g,0,0,W,H,'#000');return;}
 if(cs.sub==='share')drawShare();}
// ---------- Parte 2: la huincha de recuerdos ----------
const hu={};
function startHuincha(seen=[]){const order=E.memoryOrder.filter(id=>id!==hero).concat([hero]);hu.frames=order.map((id,i)=>({id,x:820+i*720,t:0,seen:seen.includes(id)?1:0}));const next=hu.frames.find(f=>!f.seen);hu.x=next?Math.max(160,next.x-340):hu.frames.at(-1).x+320;save('huincha',{seen:hu.frames.filter(f=>f.seen).map(f=>f.id)});hu.focus=null;hu.ready=false;hu.go=false;hu.end=hu.frames.at(-1).x+560;hu.dir=1;hu.walk=false;hu.leaving=0;view.x=0;setMode('huincha');caption(E.enter[hero]);hu.greet=time+4.5;}
function activeFrame(){return hu.frames.find(f=>Math.abs(hu.x-f.x)<300);}
// En el primer pase el protagonista se detiene frente a cada recuerdo: la escena corre completa y se sigue con SEGUIR.
// Su propio recuerdo dura un poco más. Después se puede volver a mirarlos caminando.
const LOOK={tobi:7,marcelo:6.5,pallo:5.5,ruzio:6.5,pulga:7,cote:5};
function finishFocus(){const f=hu.focus;f.seen=1;hu.focus=null;hu.ready=false;hu.go=false;$('e4-hu-next').hidden=true;M.clearInput();save('huincha',{seen:hu.frames.filter(x=>x.seen).map(x=>x.id)});}
function updateHuincha(dt){
 if(hu.focus){const f=hu.focus;f.t+=dt;hu.walk=false;hu.x=M.lerp(hu.x,f.x,Math.min(1,dt*6));caption(E.comments[f.id][hero]);
  if(!hu.ready&&f.t>=LOOK[f.id]*(f.id===hero?1.5:1)){hu.ready=true;$('e4-hu-next').hidden=false;$('accessible-status').textContent='Recuerdo completo. Pulsa SEGUIR para continuar.';}
  if(hu.ready&&(hu.go||M.tap('interact')||M.tap('jump')))finishFocus();hu.go=false;view.x=M.clamp(hu.x-330,0,hu.end+260-W);return;}
 const dir=(M.down('right')?1:0)-(M.down('left')?1:0);hu.walk=!!dir&&!hu.leaving;if(dir&&!hu.leaving){hu.dir=dir;hu.x=M.clamp(hu.x+dir*230*dt,80,hu.end);}
 const f=activeFrame();if(f&&!f.seen&&!hu.leaving&&Math.abs(hu.x-f.x)<40){hu.focus=f;f.t=0;hu.ready=false;hu.go=false;M.clearInput();caption(E.comments[f.id][hero]);return;}if(f)f.t+=dt;
 if(hu.leaving){if(time-hu.leaving>3.2)part3();}
 else if(hu.x>=hu.end-4){hu.leaving=time;caption(E.leave[hero]);}
 else if(f)caption(E.comments[f.id][hero]);else if(time<hu.greet)caption(E.enter[hero]);else caption(hu.frames.every(fr=>fr.seen>0)?'→ Sigue caminando':'→ Camina para ver los recuerdos');
 view.x=M.clamp(hu.x-330,0,hu.end+260-W);}
function drawHuincha(){const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#1b2733');bg.addColorStop(1,'#43545e');g.fillStyle=bg;g.fillRect(0,0,W,H);
 R(g,0,36,W,314,'#0d0d10');for(let i=0;i<40;i++){const x=i*26-(view.x%26);R(g,x,44,13,10,'#3a3934');R(g,x,333,13,10,'#3a3934');}
 const f0=hu.focus||activeFrame();for(const f of hu.frames){const sx=f.x-view.x-220;if(sx>W+40||sx<-480)continue;const act=f===f0;D.frame(g,sx,72,440,250,act);D.scene(g,f.id,f.t,sx,72,440,250,act);T(g,E.memoryTitle[f.id],f.x-view.x,26,15,act?'#f0ca8a':'#8b9aa3');}
 R(g,0,400,W,140,'#2f3e48');g.save();g.globalAlpha=.35;for(let i=0;i<8;i++){g.fillStyle='#aeb8b6';g.beginPath();g.ellipse((i*190-view.x*.6+time*20)%(W+240)-120,470+(i%3)*18,150,22,0,0,Math.PI*2);g.fill();}g.restore();
 M.character(hero,hu.x-view.x,470,130,{walk:hu.walk,dir:hu.dir,time});
 const seen=hu.frames.filter(f=>f.seen>.5).length;T(g,'RECUERDOS '+seen+' / '+hu.frames.length,20,388,13,'#d8cfb7','left');}
// ---------- Parte 4: camino a los arcades ----------
// Combate con el arma y la definitiva propias de cada amigo, las mismas de la etapa 1 (src/melee.js y src/powers.js).
// La geometría del arma se calcula a la escala de la etapa 1 (94 px) y se amplía desde los pies a la altura de esta calle.
const st={},HERO_H=124,K=HERO_H/94;
const ULT={marcelo:{range:200,dmg:2,stun:1.6},ruzio:{range:330,dmg:3},pulga:{range:200,dmg:3},tobi:{range:220,dmg:3},pallo:{range:420,dmg:2,front:true,heal:true}};
const HELP={marcelo:'PULSO',ruzio:'MARTILLAZO',pulga:'CLAVADA',tobi:'EMPUJÓN',pallo:'CURACIÓN'};
const boxOf=e=>{const w=e.kind==='sapa'?44:34;return{x:e.x-w/2,y:e.y-118,w,h:118};};
function segBox(a,b,box,r){const minX=box.x-r,maxX=box.x+box.w+r,minY=box.y-r,maxY=box.y+box.h+r;let enter=0,leave=1;const dx=b.x-a.x,dy=b.y-a.y;
 for(const [o,d,lo,hi] of [[a.x,dx,minX,maxX],[a.y,dy,minY,maxY]]){if(Math.abs(d)<1e-8){if(o<lo||o>hi)return false;continue;}let t0=(lo-o)/d,t1=(hi-o)/d;if(t0>t1)[t0,t1]=[t1,t0];enter=Math.max(enter,t0);leave=Math.min(leave,t1);if(enter>leave)return false;}return true;}
function weaponAt(p,elapsed){M.cam=0;const q=M.meleeGeometry(hero,{x:p.x,y:p.y,face:p.face,vx:p.vx,onGround:p.on,animT:time},elapsed),s=pt=>({x:p.x+(pt.x-p.x)*K,y:p.y+(pt.y-p.y)*K});return{grip:s(q.grip),tip:s(q.tip),r:q.radius*K};}
function weaponHits(p,box){const el=M.melee.duration-p.atk;if(el<M.melee.activeStart||el>M.melee.activeEnd)return false;if((box.x+box.w/2-p.x)*p.face< -box.w/2)return false;
 const c=weaponAt(p,el),o=weaponAt(p,Math.max(0,el-M.STEP));return segBox(c.grip,c.tip,box,c.r)||segBox(o.grip,o.tip,box,c.r)||segBox(o.tip,c.tip,box,c.r);}
function startStreet(tramo){st.tramo=tramo;const tr=E.street.tramos[tramo];st.p={x:tr.start,y:G,vx:0,vy:0,on:true,hp:100,energy:30,face:1,atk:0,atkCd:0,hits:new Set(),inv:0,walk:false,ult:0,ultUsed:false,ultBase:G};st.enemies=[];st.shots=[];st.fx=[];st.effects=[];st.pending=[];st.shake=0;st.lock=null;st.helpT=2.5;st.helpIdx=0;st.dead=0;st.comp=others().map((id,i)=>({id,x:tr.start-80-i*50,act:0}));
 save('calle',{tramo});st.waves=E.street.tramos.flatMap((t,i)=>i>=tramo?t.waves.map(w=>({...w,tramo:i,spawned:false,done:false})):[]);setMode('street');const tc=touchMQ.matches;caption('TRAMO '+(tramo+1)+' DE 3 · '+(tc?'✊ ':'Z ')+M.weapons[hero].name.toUpperCase()+(tc?' · ★ DEFINITIVA':' · V DEFINITIVA'),3.5);}
function spawn(wave){wave.spawned=true;st.lock={left:wave.at-480,right:wave.at+480,wave};wave.list.forEach((kind,i)=>{const right=kind==='sapa'||i%2===0;st.enemies.push({kind,wave,x:right?wave.at+520+i*50:wave.at-520-i*50,y:G,hp:kind==='sapa'?2:3,cd:.6+i*.4,wind:0,strike:0,windT:0,throwT:0,stun:0,hurt:0,face:right?-1:1,flee:false,t:rand()*3,say:'',sayT:0});});M.audio.sfx('checkpoint');}
function hurtPlayer(d,from){const p=st.p;if(p.inv>0||st.dead||p.ult>0)return;p.hp-=d;p.inv=.8;p.vx=Math.sign(p.x-from||1)*240;M.audio.sfx('hurt');if(p.hp<=0){p.hp=0;st.dead=time;caption('TE PILLARON. VUELVES AL INICIO DEL TRAMO.');}}
function hitEnemy(e,d,from){if(e.flee)return;e.hp-=d;e.hurt=.22;e.wind=0;e.windT=0;e.x+=Math.sign(e.x-from||1)*26;st.fx.push({x:e.x,y:G-80,t:.25,kind:'spark'});M.audio.sfx('hit');if(e.hp<=0){e.flee=true;e.stun=0;e.face=Math.sign(e.x-st.p.x)||1;const l=E.flee[e.kind];e.say=l[Math.floor(rand()*l.length)];e.sayT=1.8;st.p.energy=Math.min(100,st.p.energy+6);}}
function tryUltimate(){const p=st.p;if(p.ult>0||st.dead)return false;if(p.energy<100||!p.on){caption(p.energy<100?'LA DEFINITIVA NECESITA LA ENERGÍA LLENA':'ACTIVA LA DEFINITIVA DESDE EL SUELO',1.6);return false;}
 const def=M.powers[hero];p.energy=0;p.ult=def.duration;p.ultUsed=false;p.atk=0;p.vx=0;p.ultBase=p.y;M.audio.power(hero,'start');caption(M.heroes[hero].ultimate.toUpperCase(),2);return true;}
function applyUltimate(){const p=st.p,u=ULT[hero],contact=hero==='ruzio'?p.x+p.face*76*K:p.x;let dealt=0;
 for(const e of st.enemies){if(e.flee)continue;const dx=e.x-p.x;if(u.front?!(dx*p.face>=-20&&dx*p.face<u.range):Math.abs(dx)>=u.range)continue;
  const fn=()=>{if(e.flee)return;hitEnemy(e,u.dmg,p.x);if(u.stun&&!e.flee)e.stun=u.stun;dealt++;};
  // La onda del martillo avanza por el suelo: llega antes a quien está cerca.
  if(hero==='ruzio')st.pending.push({t:Math.abs(e.x-contact)/1140,fn});else fn();}
 let heal=0;if(u.heal){const before=p.hp;p.hp=Math.min(100,p.hp+Math.min(30,10+dealt*8));heal=Math.round(p.hp-before);if(heal>0){M.audio.power('pallo','heal');st.fx.push({x:p.x,y:G-180,t:1.3,kind:'text',text:'+'+heal+' VIDA'});}}
 const fx=M.powerEffect(hero,{x:p.x,y:p.y,face:p.face},contact,heal);if(fx.r)fx.r*=K;if(fx.range)fx.range*=K;if(fx.end!=null)fx.end=p.x+p.face*u.range;st.effects.push(fx);
 M.audio.power(hero,'impact');st.shake={tobi:9,ruzio:7,pulga:6}[hero]||4;}
// Ayudas del equipo: cada amigo aporta a su turno con su propio rasgo; Coté espanta con su grito.
function teamHelp(near){const p=st.p,list=others(),id=list[st.helpIdx++%list.length],first=near.slice().sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];st.helpT=3.2;let text='¡'+E.names[id].toUpperCase()+'! '+(HELP[id]||''),at=first.x;
 if(id==='cote'){near.forEach(e=>{e.x+=Math.sign(e.x-p.x||1)*90;e.hurt=.2;e.wind=0;e.windT=0;});text='CORREEEE!!';at=p.x;}
 else if(id==='marcelo'){hitEnemy(first,1,p.x);if(!first.flee)first.stun=1.2;}
 else if(id==='ruzio'){near.filter(e=>Math.abs(e.x-p.x)<220).forEach(e=>hitEnemy(e,1,p.x));st.effects.push({kind:'quake',x:p.x,ox:p.x,y:G,range:220,col:M.heroes.ruzio.color,life:.5,max:.5});at=p.x;}
 else if(id==='pulga'){hitEnemy(first,2,p.x);st.effects.push({kind:'slam',x:first.x,y:G,r:90,col:M.heroes.pulga.color,life:.45,max:.45});}
 else if(id==='tobi'){hitEnemy(first,1,p.x);near.forEach(e=>{e.x+=Math.sign(e.x-p.x||1)*120;});}
 else if(id==='pallo'){if(p.hp<100){p.hp=Math.min(100,p.hp+15);text='¡PALLO! +15 VIDA';at=p.x;}else hitEnemy(first,1,p.x);}
 st.fx.push({x:at,y:G-165,t:1.1,kind:'text',text});const c=st.comp.find(c=>c.id===id);if(c)c.act=.6;}
function updateStreet(dt){const p=st.p,S=E.street;if(st.dead){if(time-st.dead>1.6)startStreet(st.tramo);return;}
 st.shake=Math.max(0,st.shake-dt*24);for(const q of st.pending)q.t-=dt;const due=st.pending.filter(q=>q.t<=0);st.pending=st.pending.filter(q=>q.t>0);due.forEach(q=>q.fn());
 for(const fx of st.effects)fx.life-=dt;st.effects=st.effects.filter(fx=>fx.life>0);
 p.energy=Math.min(100,p.energy+dt*1.5);p.atkCd=Math.max(0,p.atkCd-dt);p.inv=Math.max(0,p.inv-dt);
 if(p.ult>0){const def=M.powers[hero];p.ult=Math.max(0,p.ult-dt);const el=def.duration-p.ult;p.vx=0;if(def.jumpHeight)p.y=p.ultBase-M.powerPose(hero,el).jump*def.jumpHeight*K;
  if(!p.ultUsed&&el>=def.impact-1e-6){p.ultUsed=true;p.y=p.ultBase;applyUltimate();}if(p.ult<=0){p.y=p.ultBase;p.on=true;p.inv=.3;}}
 else{const dir=(M.down('right')?1:0)-(M.down('left')?1:0);p.walk=!!dir;if(dir)p.face=dir;const speed=p.atk>0?150:260;p.vx=M.lerp(p.vx,dir*speed,Math.min(1,dt*12));
  if(M.tap('jump')&&p.on){p.vy=-640;p.on=false;M.audio.sfx('jump');}
  if((M.tap('attack')||M.down('attack'))&&p.atk<=0&&p.atkCd<=0){p.atk=M.melee.duration;p.atkCd=M.melee.cooldown;p.hits.clear();M.audio.melee(hero,'start');}
  if(M.tap('ultimate'))tryUltimate();
  p.vy+=1700*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>=G){p.y=G;p.vy=0;p.on=true;}}
 const lo=st.lock?st.lock.left+40:40,hi=st.lock?st.lock.right-40:S.length-40;p.x=M.clamp(p.x,lo,hi);
 if(p.atk>0){p.atk=Math.max(0,p.atk-dt);let n=0;for(const e of st.enemies){if(e.flee||p.hits.has(e)||!weaponHits(p,boxOf(e)))continue;p.hits.add(e);hitEnemy(e,1,p.x);n++;}if(n){p.energy=Math.min(100,p.energy+Math.min(8,n*4));M.audio.melee(hero,'impact');}}
 // Puntos de control al entrar a un tramo nuevo.
 S.tramos.forEach((tr,i)=>{if(i>st.tramo&&p.x>=tr.start){st.tramo=i;p.hp=100;save('calle',{tramo:i});caption('TRAMO '+(i+1)+' DE 3 · PUNTO DE CONTROL',3);}});
 if(!st.lock){const w=st.waves.find(w=>!w.spawned&&p.x>=w.at);if(w)spawn(w);}
 for(const e of st.enemies){e.t+=dt;e.hurt=Math.max(0,e.hurt-dt);e.sayT=Math.max(0,e.sayT-dt);const dx=p.x-e.x,ad=Math.abs(dx);
  if(e.flee){e.x+=e.face*340*dt;continue;}if(e.stun>0){e.stun-=dt;e.walk=false;continue;}e.face=Math.sign(dx)||e.face;e.cd-=dt;e.walk=false;
  if(e.kind==='pastero'){if(e.wind>0){e.wind-=dt;if(e.wind<=0){e.strike=.25;if(ad<92&&Math.abs(p.y-e.y)<80)hurtPlayer(12,e.x);}}else if(e.strike>0)e.strike-=dt;else if(ad>66){e.x+=Math.sign(dx)*95*dt;e.walk=true;}else if(e.cd<=0){e.wind=.5;e.cd=1.4;}}
  else{if(e.windT<=0){if(ad<230){e.x-=Math.sign(dx)*70*dt;e.walk=true;}else if(ad>330){e.x+=Math.sign(dx)*80*dt;e.walk=true;}}if(st.lock)e.x=M.clamp(e.x,st.lock.left+30,st.lock.right-30);e.throwT=Math.max(0,e.throwT-dt);
   // Anticipación: la vieja sapa se prepara medio segundo antes de soltar el chisme.
   if(e.windT>0){e.windT-=dt;if(e.windT<=0){e.throwT=.3;st.shots.push({x:e.x+e.face*20,y:G-82,vx:e.face*240,life:4,word:['BLA BLA','¡¿Y ESO?!','CHISME'][Math.floor(rand()*3)]});}}
   else if(e.cd<=0&&ad<520){e.cd=2.4;e.windT=.5;}}}
 // Separación simple entre enemigos.
 const live=st.enemies.filter(e=>!e.flee);for(let i=0;i<live.length;i++)for(let j=i+1;j<live.length;j++){const a=live[i],b=live[j],d=b.x-a.x;if(Math.abs(d)<34){const push=(34-Math.abs(d))/2*(Math.sign(d)||1);a.x-=push;b.x+=push;}}
 for(const s of st.shots){s.x+=s.vx*dt;s.life-=dt;if(Math.abs(s.x-p.x)<26&&s.y>p.y-112&&s.y<p.y-4){s.life=0;hurtPlayer(8,s.x-s.vx);}}st.shots=st.shots.filter(s=>s.life>0);
 st.enemies=st.enemies.filter(e=>!e.flee||Math.abs(e.x-p.x)<900);
 if(st.lock&&!st.enemies.some(e=>e.wave===st.lock.wave&&!e.flee)){st.lock.wave.done=true;st.lock=null;caption('¡SIGAN! → ARCADES DE DON MARIO',2);}
 st.helpT-=dt;const near=live.filter(e=>!e.flee&&Math.abs(e.x-p.x)<340);if(st.helpT<=0&&near.length)teamHelp(near);
 st.comp.forEach((c,i)=>{c.act=Math.max(0,c.act-dt);const tx=p.x-p.face*(80+i*46);c.x=M.lerp(c.x,tx,Math.min(1,dt*3));});
 st.fx.forEach(f=>f.t-=dt);st.fx=st.fx.filter(f=>f.t>0);
 if(!st.lock&&p.ult<=0&&st.waves.every(w=>w.done)&&p.x>=S.door){startPongIntro();return;}
 const cam=M.clamp(p.x-400,0,S.length-W);view.x=st.lock?M.clamp(cam,st.lock.left,st.lock.right-W):cam;}
function drawStreet(){const p=st.p;g.save();if(st.shake>0)g.translate((Math.random()-.5)*st.shake,(Math.random()-.5)*st.shake);street(g,view.x,{end:E.street.door-120});
 st.comp.forEach(c=>{const hop=c.act>0?Math.sin((.6-c.act)/.6*Math.PI)*26:0;M.character(c.id,c.x-view.x,G-hop,c.id==='cote'?112:116,{time,walk:Math.abs(c.x-(p.x-p.face*80))>8,dir:p.face,alpha:.92});});
 for(const e of st.enemies){const x=e.x-view.x;if(x<-80||x>W+80)continue;const o={t:e.t,dir:e.face,walk:e.walk||e.flee,hurt:e.hurt>0,wind:e.wind>0||e.windT>0,strike:e.strike>0,throw:e.throwT>0};if(e.kind==='pastero')D.pastero(g,x,e.y,o);else D.sapa(g,x,e.y,o);
  if(e.stun>0)for(let i=0;i<3;i++){const a=time*6+i*2.1;R(g,x+Math.cos(a)*16-3,e.y-132+Math.sin(a)*4,6,6,'#ffe39a');}
  if(e.sayT>0)T(g,e.say,x,e.y-138,13,'#ffe39a');}
 for(const s of st.shots){const x=s.x-view.x;R(g,x-34,s.y-14,68,24,'#f4efe2');R(g,x-6+Math.sign(s.vx)*-26,s.y+8,8,8,'#f4efe2');T(g,s.word,x,s.y+3,10,'#7a3b3b');}
 const rig=p.ult>0?M.powerPose(hero,M.powers[hero].duration-p.ult):M.meleePose(hero,p.atk>0?M.melee.duration-p.atk:-1),blink=p.inv>0&&p.ult<=0&&Math.floor(time*20)%2;
 if(!blink)M.character(hero,p.x-view.x,p.y,HERO_H,{time,walk:p.ult<=0&&p.walk&&p.on,speed:p.ult<=0&&p.on?Math.min(1,Math.abs(p.vx)/220):0,dir:p.face,hurt:p.inv>.6&&p.ult<=0,air:rig.air??!p.on,rising:rig.rising??p.vy<0,giant:rig.scale||1,attack:-1,rig});
 for(const fx of st.effects)M.drawEffect(fx,view.x);
 for(const f of st.fx){const x=f.x-view.x;if(f.kind==='spark'){for(let i=0;i<6;i++){const a=i*1.05+time*9;R(g,x+Math.cos(a)*(30-f.t*60),f.y+Math.sin(a)*(30-f.t*60),6,6,i%2?'#ffe39a':'#ff8a5b');}}else T(g,f.text,x,f.y-(1-f.t)*20,16,'#ffe39a');}
 g.restore();
 const ready=p.energy>=100;R(g,18,16,262,64,'#0b192ad8');T(g,E.names[hero].toUpperCase(),30,36,14,'#f0ca8a','left');R(g,30,44,220,8,'#2a3a48');R(g,30,44,220*p.hp/100,8,p.hp>35?'#7ec7a4':'#e07a5f');
 R(g,30,57,220,6,'#2a3a48');R(g,30,57,220*p.energy/100,6,ready?'#f0ca8a':'#6aa7d8');T(g,ready?(touchMQ.matches?'DEFINITIVA LISTA · ★':'DEFINITIVA LISTA · V'):'ENERGÍA',30,75,10,ready?'#f0ca8a':'#8fa5b5','left');
 const btn=$('e4-ult');if(btn&&btn.classList.contains('is-ready')!==ready)btn.classList.toggle('is-ready',ready);T(g,'TRAMO '+(st.tramo+1)+' / 3',W-24,36,14,'#d8cfb7','right');}
// ---------- Parte 5: PONG contra Don Mario ----------
// En pantallas táctiles el campo ocupa casi todo el lienzo, la pelota crece y las paletas mantienen su proporción; las velocidades se escalan con el campo para que el partido dure lo mismo.
const pg={k:1,sx:1,sy:1};const F={x:210,y:96,w:540,h:350};
function pongLayout(){const t=touchMQ.matches;Object.assign(F,t?{x:130,y:74,w:700,h:400}:{x:210,y:96,w:540,h:350});pg.touch=t;pg.k=t?1.45:1;pg.sx=F.w/540;pg.sy=F.h/350;}
function startPongIntro(){save('pong');setMode('pong');pongReset();pg.wait=99;say([['mario',E.mario.hello]],()=>{pg.wait=1.2;caption('PONG A '+E.pong.target+' PUNTOS · '+(touchMQ.matches?'▲ ▼':'↑ ↓')+' PARA MOVER',3);},{location:'ARCADES DON MARIO',last:'JUGAR'});}
function pongReset(){pongLayout();pg.me=0;pg.him=0;pg.py=F.y+F.h/2;pg.my=F.y+F.h/2;pg.ball=null;pg.wait=1.2;pg.err=0;pg.serve=1;pg.over=false;}
function serve(){pg.ball={x:F.x+F.w/2,y:F.y+F.h/2,vx:pg.serve*330*pg.sx,vy:(rand()-.5)*280*pg.sy};pg.serve*=-1;}
function updatePong(dt){if(pg.over)return;const k=pg.k,half=36*pg.sy,br=7*k,up=M.keys.ArrowUp||M.keys.KeyW,down=M.keys.ArrowDown||M.keys.KeyS;pg.py=M.clamp(pg.py+((down?1:0)-(up?1:0))*430*pg.sy*dt,F.y+half,F.y+F.h-half);
 const b=pg.ball,target=b&&b.vx>0?b.y+pg.err:F.y+F.h/2,ms=285*pg.sy*dt;pg.my+=M.clamp(target-pg.my,-ms,ms);pg.my=M.clamp(pg.my,F.y+half,F.y+F.h-half);
 if(!b){pg.wait-=dt;if(pg.wait<=0)serve();return;}
 b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y<F.y+br){b.y=F.y+br;b.vy=Math.abs(b.vy);}if(b.y>F.y+F.h-br){b.y=F.y+F.h-br;b.vy=-Math.abs(b.vy);}
 const hit=(px,py,dir)=>{if(Math.sign(b.vx)!==-dir)return;if(Math.abs(b.x-px)<14*k&&Math.abs(b.y-py)<half+6*k){b.vx=dir*Math.min(640*pg.sx,Math.abs(b.vx)*1.07);b.vy=(b.y-py)/(40*pg.sy)*330*pg.sy;b.x=px+dir*14*k;M.audio.tone(dir>0?520:390,dir>0?520:390,.05);if(dir>0)pg.err=(rand()-.5)*(60+Math.abs(b.vx)/pg.sx*.16)*pg.sy;}};
 hit(F.x+24*k,pg.py,1);hit(F.x+F.w-24*k,pg.my,-1);
 if(b.x<F.x){pg.him++;pg.ball=null;pg.wait=1;M.audio.sfx('hurt');}else if(b.x>F.x+F.w){pg.me++;pg.ball=null;pg.wait=1;M.audio.sfx('checkpoint');}
 if(pg.me>=E.pong.target){pg.over=true;say([['mario',E.mario.win],['hero','Gracias, Don Mario. Esta vez sabemos qué hacer con él.']],part6,{location:'ARCADES DON MARIO',last:'COMPARTIR EL MAGDALENO'});}
 else if(pg.him>=E.pong.target){pg.over=true;say([['mario',E.mario.lose]],()=>{pongReset();},{location:'ARCADES DON MARIO',last:'REVANCHA'});}}
function drawPong(){const k=pg.k,t=pg.touch,bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#160f26');bg.addColorStop(1,'#2a1d3d');g.fillStyle=bg;g.fillRect(0,0,W,H);for(let i=0;i<5;i++){R(g,20+i*200,120,120,300,'#21183a');R(g,34+i*200,140,92,70,'#5be3ff22');}
 R(g,F.x-40,F.y-56,F.w+80,F.h+150,'#3a2457');R(g,F.x-40,F.y-56,F.w+80,10,'#ff4fa3');R(g,F.x-14,F.y-14,F.w+28,F.h+28,'#0d0a12');R(g,F.x,F.y,F.w,F.h,'#04060a');
 for(let y=F.y+6;y<F.y+F.h;y+=22)R(g,F.x+F.w/2-2,y,4,12,'#3d4a52');T(g,String(pg.me),F.x+F.w/2-70*k,F.y+46*k,40*k,'#e8f4ff');T(g,String(pg.him),F.x+F.w/2+70*k,F.y+46*k,40*k,'#e8f4ff');
 const ph=36*pg.sy;R(g,F.x+18*k,pg.py-ph,10*k,ph*2,'#e8f4ff');R(g,F.x+F.w-28*k,pg.my-ph,10*k,ph*2,'#e8f4ff');
 if(pg.ball){const b=pg.ball,s=14*k;if(t){g.globalAlpha=.25;R(g,b.x-s/2-b.vx*.03,b.y-s/2-b.vy*.03,s,s,'#9fe7ff');g.globalAlpha=1;}R(g,b.x-s/2,b.y-s/2,s,s,'#ffffff');}
 g.globalAlpha=.08;for(let y=F.y;y<F.y+F.h;y+=4)R(g,F.x,y,F.w,1,'#9fe7ff');g.globalAlpha=1;
 if(t){R(g,F.x-40,F.y+F.h+16,F.w+80,44,'#2b1b42');T(g,E.names[hero].toUpperCase(),F.x+60,F.y+F.h+44,14,'#f0ca8a');T(g,'DON MARIO',F.x+F.w-60,F.y+F.h+44,14,'#ff8fd0');M.character(hero,62,H-8,112,{time,dir:1});D.mario(g,898,H-8,{h:132,t:time,dir:-1});return;}
 R(g,F.x-40,F.y+F.h+30,F.w+80,64,'#2b1b42');T(g,E.names[hero].toUpperCase(),F.x+60,F.y+F.h+66,14,'#f0ca8a');T(g,'DON MARIO',F.x+F.w-60,F.y+F.h+66,14,'#ff8fd0');
 M.character(hero,100,H-10,150,{time,dir:1});D.mario(g,875,H-10,{h:176,t:time,dir:-1});}
// ---------- Parte 6: final ----------
function part6(){save('final');cs.sub='black';cs.t=0;setMode('cut');caption('');setTimeout(()=>{cs.sub='share';cs.t=0;},qa?0:900);}
function drawShare(){const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#2b1d38');bg.addColorStop(1,'#5a3a3c');g.fillStyle=bg;g.fillRect(0,0,W,H);for(let i=0;i<4;i++){R(g,40+i*240,110,150,250,'#21183a');R(g,56+i*240,130,118,80,'#5be3ff2a');}R(g,0,G,W,H-G,'#3a2a2e');
 g.save();g.globalAlpha=.25;g.fillStyle='#ffd9a0';g.beginPath();g.ellipse(W/2,G-60,360,140,0,0,Math.PI*2);g.fill();g.restore();
 R(g,W/2-110,G-70,220,12,'#7b5c3a');R(g,W/2-100,G-58,10,58,'#5f4630');R(g,W/2+90,G-58,10,58,'#5f4630');drawBottle(W/2-5,G-104);for(let i=0;i<6;i++)R(g,W/2-96+i*36,G-86,10,16,'#e6eef4b0');
 const group=[hero,...others()];group.forEach((id,i)=>{const side=i%2?1:-1,slot=Math.floor(i/2),x=W/2+side*(170+slot*70),dir=-side;M.character(id,x,G,id==='cote'?136:140,{time,dir});});}
// ---------- Menú y bucle ----------
function toTitle(){refreshContinue();$('e4-parts').hidden=!(M.campaign.snapshot().completed>=4);setMode('title');caption('');$('e4-end').hidden=true;$('e4-dialog').hidden=true;dlg=null;$('e4-title').hidden=false;}
function begin(part){if(!M.campaign.require(4))return;$('e4-title').hidden=true;$('e4-end').hidden=true;M.audio.init();({1:part1,2:startHuincha,3:part3,4:()=>startStreet(0),5:startPongIntro,6:part6})[part]();}
function heroButtons(){const box=$('e4-heroes');box.innerHTML='';for(const id of E.heroes){const b=document.createElement('button');b.type='button';b.textContent=E.names[id].toUpperCase();b.setAttribute('aria-pressed',String(id===hero));b.onclick=()=>{hero=id;heroButtons();};box.append(b);}}
$('e4-start').onclick=()=>M.confirmRestart($('e4-start'),!!readSave(),()=>begin(1));$('e4-continue').onclick=resumeSave;$('e4-hu-next').onclick=()=>{if(hu.focus&&hu.ready)hu.go=true;};document.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>begin(+b.dataset.part));$('e4-again').onclick=toTitle;
function update(dt){if(M.tap('pause')&&M.state==='play'){M.pause();return;}if(mode==='cut')updateCut(dt);else if(mode==='huincha')updateHuincha(dt);else if(mode==='street')updateStreet(dt);else if(mode==='pong')updatePong(dt);const c=$('e4-caption');if(c.dataset.until&&time>+c.dataset.until)caption('');}
function render(){if(mode==='title'){street(g,time*20);fogLayer(.25);}else if(mode==='cut')drawCut();else if(mode==='huincha')drawHuincha();else if(mode==='street')drawStreet();else if(mode==='pong')drawPong();}
// El reloj solo avanza cuando el juego corre: en pausa no vencen avisos ni temporizadores.
function step(dt){if(rotated&&M.state==='play')M.pause();if(!paused&&(!dlg||mode==='cut')){time+=dt;update(dt);}M.pressed={};}
let last=performance.now(),acc=0;function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;if(!qa){acc+=dt;while(acc>=M.STEP){step(M.STEP);acc-=M.STEP;}}render();requestAnimationFrame(frame);}
async function load(){M.images={};M.bounds={};await Promise.all([...M.order,'cote'].map(id=>new Promise((ok,fail)=>{const i=new Image();i.onload=()=>{M.images[id]=i;M.bounds[id]=M.assetBounds?.[id]||{x:0,y:0,w:i.width,h:i.height};ok();};i.onerror=()=>fail(new Error(id));i.src='assets/'+id+'.png';})));}
load().then(()=>{checkRotate();heroButtons();$('e4-start').disabled=false;$('e4-start').textContent='COMENZAR LA ETAPA 4';toTitle();E.loaded=true;requestAnimationFrame(frame);}).catch(e=>{$('e4-start').textContent='NO SE PUDIERON CARGAR LOS SPRITES';console.error(e);});
// Ganchos de prueba con ?qa=1: paso manual y acceso al estado.
window.__e4={E,M,readSave,resumeSave,step:(n=1)=>{for(let i=0;i<n;i++)step(M.STEP);render();},render,begin,setHero:id=>{hero=id;},mode:()=>mode,dialog:()=>dlg&&{i:dlg.i,n:dlg.lines.length,who:dlg.lines[dlg.i].who},next:nextLine,hu,st,pg,cs,key:(c,down)=>M.input(c,down)};
})();
