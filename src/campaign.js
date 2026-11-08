/* Progreso de campaña separado de los puntos de control de cada etapa. */
(() => {
'use strict';
const M=window.Magdaleno,key='magdaleno_campaign_v1',paths=['','index.html','etapa2.html','etapa3.html'];
const stage=Number(document.documentElement.dataset.campaignStage||1);
const C=M.campaign={key,stage},heroes=M.order;
let record={version:1,completed:0,hero:null},gate=null,permanent=false;
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch{return null;}};
const valid=r=>r?.version===1&&Number.isInteger(r.completed)&&r.completed>=0&&r.completed<=3&&(r.hero===null||heroes.includes(r.hero));
const nonnegative=n=>Number.isFinite(n)&&n>=0;

// Reconoce los formatos previos, sin modificar ni borrar sus puntos de control.
function legacy(){
 let completed=0,hero=null;
 const one=read(M.SAVE_KEY);
 if(one?.version===M.VERSION&&heroes.includes(one.hero)&&one.zone===2&&one.checkpoint?.zone===2&&Number.isInteger(one.checkpoint.col)&&one.checkpoint.col>0&&one.checkpoint.col<M.zones[2].length&&one.flags?.completed===true&&['friends','fichas','rescued','collected','killed'].every(k=>Array.isArray(one[k]))&&one.friends.length===5&&new Set(one.friends).size===5&&one.friends.every(id=>heroes.includes(id))&&one.fichas.length===5&&new Set(one.fichas).size===5&&one.fichas.every(id=>heroes.includes(id))&&one.rescued.length===4&&new Set(one.rescued).size===4&&one.rescued.every(id=>id!==one.hero&&heroes.includes(id))&&[one.score,one.elapsed,one.canCount,one.killCount].every(nonnegative)){completed=1;hero=one.hero;}
 const two=read('magdaleno_parral_v1');
 if(two?.version===1&&heroes.includes(two.hero)&&[0,520,1040,1560,2100].includes(two.checkpoint)&&typeof two.finished==='boolean'&&two.finished===(two.checkpoint===2100)&&[two.falls,two.time].every(nonnegative)){const seen=!Object.hasOwn(two,'endingDialogue')||(two.endingDialogue?.id==='parral-ending'&&two.endingDialogue.done===true&&two.endingDialogue.index===M.stories.parral(two.hero).lines.length);completed=two.finished&&seen?2:Math.max(1,completed);hero=two.hero;}
 const three=read('magdaleno_scooter_v1');
 if(three&&[1,2].includes(three.version)&&heroes.includes(three.hero)&&Number.isInteger(three.seed)&&three.seed>=0&&three.seed<=4294967295&&['play','vendor','ending'].includes(three.phase)&&Array.isArray(three.rescued)&&three.rescued.length<=2&&Number.isInteger(three.falls)&&three.falls>=0&&nonnegative(three.time)){
  const checkpoints=three.version===1?[0,700,1400,1680,2200,2600]:[0,900,1800,2700,3500,4300,5200],end=checkpoints.at(-1);
  const checkpoint=three.version===1?[0,900,2700,3500,4300,5200][checkpoints.indexOf(three.checkpoint)]:three.checkpoint;
  const pool=[...heroes,'cote'].filter(id=>id!==three.hero),random=M.rng(three.seed);
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  const cooldowns={marcelo:26,ruzio:30,pulga:24,tobi:26,pallo:34,cote:32};
  const helpersValid=three.version===1||(nonnegative(three.rideTime)&&nonnegative(three.helpLock)&&three.helpLock<=2.4&&three.helpCooldowns&&three.helpUses&&typeof three.helpCooldowns==='object'&&typeof three.helpUses==='object'&&Object.entries(three.helpCooldowns).every(([id,n])=>Object.hasOwn(cooldowns,id)&&nonnegative(n)&&n<=cooldowns[id])&&Object.entries(three.helpUses).every(([id,n])=>Object.hasOwn(cooldowns,id)&&Number.isInteger(n)&&n>=0));
  if(checkpoints.includes(three.checkpoint)&&(three.phase!=='play')===(three.checkpoint===end)&&three.traded===(three.phase==='ending')&&three.rescued.every((id,i)=>id===pool[i])&&three.rescued.length>=[620,1960].filter(at=>at<checkpoint).length&&(three.phase==='play'||three.rescued.length===2)&&helpersValid){const arrivalSeen=!Object.hasOwn(three,'arrivalDialogue')||(three.arrivalDialogue?.id==='califa-arrival'&&three.arrivalDialogue.done===true&&three.arrivalDialogue.index===M.stories.califa(three.hero,three.rescued).lines.length);const seen=arrivalSeen&&(!Object.hasOwn(three,'endingDialogue')||(three.endingDialogue?.id==='califa-ending'&&three.endingDialogue.done===true&&three.endingDialogue.index===M.stories.receipt(three.hero,three.rescued).lines.length));completed=three.traded&&seen?3:Math.max(2,completed);hero=three.hero;}
 }
 return{completed,hero};
}
function persist(){
 const value=JSON.stringify(record);let saved=false;
 try{localStorage.setItem(key,value);saved=true;}catch{}
 try{sessionStorage.setItem(key,value);saved=true;}catch{}
 C.saved=saved;return saved;
}
function sync(){
 const candidates=[read(key)];try{candidates.push(JSON.parse(sessionStorage.getItem(key)||'null'));}catch{}
 for(const r of candidates)if(valid(r)&&r.completed>=record.completed)record={...r};
 const old=legacy();if(old.completed>record.completed)record={version:1,...old};
 if(record.completed>0)persist();
 return record;
}
C.canEnter=n=>Number.isInteger(n)&&n>=1&&n<=3&&n<=sync().completed+1;
C.snapshot=()=>({...sync(),unlocked:Math.min(3,record.completed+1)});
C.href=(n,hero=record.hero)=>paths[n]+(heroes.includes(hero)?'?hero='+encodeURIComponent(hero):'');
C.complete=(n,hero)=>{if(!C.canEnter(n))return false;record={version:1,completed:Math.max(record.completed,n),hero:heroes.includes(hero)?hero:record.hero};persist();C.refresh();return true;};

function reason(n){return n===2?'Completa la etapa 1, en la montaña, para continuar hacia Parral.':record.completed<1?'Completa primero la etapa 1 y después la etapa 2 para llegar a Buenos Aires.':'Completa la etapa 2, en Parral, para subir al scooter.';}
function closeGate(){if(!gate)return;gate.remove();gate=null;document.querySelector('main').inert=false;document.documentElement.classList.remove('campaign-locked');}
C.showGate=(n,required=false)=>{
 sync();if(gate)gate.remove();permanent=required;
 gate=document.createElement('section');gate.id='campaign-gate';gate.className='campaign-gate';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-labelledby','campaign-gate-title');gate.tabIndex=-1;
 const card=document.createElement('div'),eyebrow=document.createElement('span'),title=document.createElement('h1'),copy=document.createElement('p'),link=document.createElement('a');
 eyebrow.className='eyebrow';eyebrow.textContent='LA LEYENDA DEL MAGDALENO · CAMPAÑA';title.id='campaign-gate-title';title.textContent='ETAPA '+n+' BLOQUEADA';copy.textContent=reason(n);
 const next=Math.min(n-1,record.completed+1);link.className='primary';link.href=C.href(next);link.textContent=(record.completed?'CONTINUAR EN':'JUGAR')+' LA ETAPA '+next+' →';
 card.append(eyebrow,title,copy,link);
 if(!required){const back=document.createElement('button');back.className='text-button';back.textContent='Volver al menú';back.onclick=()=>{closeGate();document.querySelector('[data-campaign-link="'+n+'"]')?.focus();};card.append(back);}
 gate.append(card);document.body.append(gate);document.querySelector('main').inert=true;document.documentElement.classList.add('campaign-locked');gate.focus({preventScroll:true});
};
C.require=n=>{if(C.canEnter(n))return true;C.showGate(n,true);return false;};
C.refresh=()=>{
 sync();document.documentElement.dataset.campaignReady='true';
 document.querySelectorAll('a[href]').forEach(link=>{
  const url=new URL(link.href,location.href);if(url.origin!==location.origin)return;
  const name=url.pathname.split('/').at(-1),n=name==='etapa2.html'?2:name==='etapa3.html'?3:0;if(!n)return;
  const locked=n>record.completed+1;link.dataset.campaignLink=n;link.setAttribute('aria-disabled',String(locked));link.classList.toggle('campaign-link-locked',locked);link.title=locked?reason(n):'Etapa '+n+' disponible';
 });
 document.querySelectorAll('[data-campaign-status]').forEach(label=>{label.textContent=record.completed===3?'CAMPAÑA COMPLETADA · PUEDES REPETIR LAS TRES ETAPAS':'CAMPAÑA · '+record.completed+'/3 ETAPAS COMPLETADAS';});
 document.querySelectorAll('.campaign-nav a').forEach(link=>{const n=Number(link.dataset.stage);link.href=C.href(n);link.textContent='ETAPA '+n+(n>record.completed+1?' · BLOQUEADA':n<=record.completed?' · ✓':' · JUGAR');if(n===stage)link.setAttribute('aria-current','page');});
 if(stage>record.completed+1){if(!gate||permanent)C.showGate(stage,true);}else if(gate&&permanent)closeGate();
};
const menu=document.querySelector('#title-screen .selection-heading,#start-menu .runner-heroes');
if(menu){const nav=document.createElement('nav');nav.className='campaign-nav';nav.setAttribute('aria-label','Progreso de la campaña');const status=document.createElement('span');status.dataset.campaignStatus='';nav.append(status);for(let n=1;n<=3;n++){const link=document.createElement('a');link.href=paths[n];link.dataset.stage=n;nav.append(link);}menu.before(nav);}
document.addEventListener('click',event=>{const link=event.target.closest('a[data-campaign-link]');if(link&&!C.canEnter(Number(link.dataset.campaignLink))){event.preventDefault();event.stopImmediatePropagation();C.showGate(Number(link.dataset.campaignLink),stage>record.completed+1);}},true);
document.addEventListener('keydown',event=>{if(!gate)return;if(event.key==='Escape'&&!permanent){closeGate();return;}if(event.key==='Tab'){const items=[...gate.querySelectorAll('a,button')],first=items[0],last=items.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===gate)){event.preventDefault();last.focus();}else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===gate)){event.preventDefault();first.focus();}}});
window.addEventListener('storage',event=>{if([key,M.SAVE_KEY,'magdaleno_parral_v1','magdaleno_scooter_v1',null].includes(event.key))C.refresh();});
window.addEventListener('pageshow',()=>C.refresh());
C.refresh();
})();
