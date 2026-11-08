/* Pantallas de conversación compartidas, con avance manual y progreso guardable. */
(() => {'use strict';
const M=window.Magdaleno,D=M.story={active:false},host=document.querySelector('.runner-stage');
const screen=document.createElement('section');screen.id='story-screen';screen.className='story-screen';screen.hidden=true;screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-labelledby','story-speaker');screen.setAttribute('aria-describedby','story-line');
screen.innerHTML='<div class="story-card"><div class="story-meta"><span id="story-location"></span><span id="story-count"></span></div><div class="story-content"><canvas id="story-portrait" width="96" height="96" aria-hidden="true"></canvas><div class="story-copy"><h2 id="story-speaker"></h2><span id="story-role"></span><p id="story-line"></p></div></div><div class="story-actions"><span>Sin apuro. Tú avanzas la conversación.</span><button id="story-next" class="primary" type="button">SEGUIR →</button></div></div>';
host.append(screen);
const $=id=>document.getElementById(id),g=$('story-portrait').getContext('2d');
const cast={cote:['Coté','AMIGA · EL GRITO QUE CUIDA AL GRUPO'],vecino:['El Vecino','BOTILLERO DEL CLANDESTINO'],camanchaca:['La Camanchaca','LA VOZ DE LOS PENDIENTES'],califa:['La Vieja Califa','ALMACENERA DE EL MUÑECO']};
function portrait(id){
 g.imageSmoothingEnabled=false;g.clearRect(0,0,96,96);g.fillStyle='#203748';g.fillRect(0,0,96,96);
 const img=M.images[id],b=M.bounds[id];
 if(img&&b){const sw=b.w*.64,sh=b.h*.34,k=Math.min(88/sw,90/sh);g.drawImage(img,b.x+(b.w-sw)/2,b.y,sw,sh,(96-sw*k)/2,96-sh*k,sw*k,sh*k);return;}
 // Retratos dibujados con la misma cuadrícula que los personajes del escenario.
 const rect=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x*3,y*3,w*3,h*3);};
 if(id==='camanchaca'){for(let i=0;i<7;i++){rect(2+i%3,4+i*3,25-i%2*4,4,['#82979d','#9daaad','#aeb8b6'][i%3]);}rect(7,10,3,2,'#dce0cc');rect(21,10,3,2,'#dce0cc');return;}
 rect(6,24,20,8,id==='califa'?'#59675e':'#3b4f60');rect(13,21,6,5,'#b58d79');
 if(id==='califa'){rect(4,6,6,7,'#77716a');rect(8,3,17,9,'#aaa395');rect(7,10,3,12,'#b2a99a');rect(24,10,2,12,'#817c75');rect(10,10,14,13,'#c89e85');rect(9,8,16,3,'#b5ac9b');rect(11,14,4,1,'#47413d');rect(20,14,3,1,'#47413d');rect(12,16,2,1,'#252b35');rect(21,16,2,1,'#252b35');rect(16,18,2,3,'#ae816d');rect(14,22,6,1,'#774c4b');rect(11,27,10,5,'#b7a88e');}
 else{rect(8,9,16,14,'#bb947c');rect(6,6,21,6,'#4d5660');rect(8,4,17,4,'#354650');rect(11,14,3,2,'#27313a');rect(20,14,3,2,'#27313a');rect(15,17,3,3,'#a27562');rect(11,21,12,3,'#5f524e');rect(14,21,6,1,'#b08773');}
}
D.validProgress=(value,script)=>!!value&&value.id===script.id&&Number.isInteger(value.index)&&value.index>=0&&value.index<=script.lines.length&&typeof value.done==='boolean'&&value.done===(value.index===script.lines.length);
function progress(){return{id:D.script.id,index:D.index,done:D.index===D.script.lines.length};}
function paint(){const l=D.script.lines[D.index],hero=M.heroes[l.who],meta=hero?[hero.name,hero.role]:cast[l.who]||[l.who,''];$('story-location').textContent=D.script.location;$('story-count').textContent=(D.index+1)+' / '+D.script.lines.length;$('story-speaker').textContent=meta[0];$('story-role').textContent=meta[1];$('story-line').textContent=l.text;$('story-next').textContent=D.index===D.script.lines.length-1?D.script.lastLabel:'SEGUIR →';portrait(l.who);$('accessible-status').textContent=meta[0]+': '+l.text;D.onProgress?.(progress());}
D.close=()=>{D.active=false;screen.hidden=true;host.querySelector('canvas').classList.remove('story-scene-enter');M.clearInput();};
D.open=({script,index=0,onProgress,onDone})=>{D.close();D.script=script;D.index=Math.min(Math.max(0,index),script.lines.length-1);D.onProgress=onProgress;D.onDone=onDone;D.active=true;screen.hidden=false;host.querySelector('canvas').classList.add('story-scene-enter');paint();$('story-next').focus({preventScroll:true});};
D.next=()=>{if(!D.active)return false;D.index++;if(D.index<D.script.lines.length){paint();M.audio.sfx('dialog');}else{const done=D.onDone;D.onProgress?.(progress());D.close();done?.();}return true;};
$('story-next').onclick=D.next;
document.addEventListener('keydown',e=>{if(!D.active)return;if(e.code==='Tab'){e.preventDefault();e.stopImmediatePropagation();$('story-next').focus({preventScroll:true});return;}if(!['Enter','Space'].includes(e.code)||!(screen.contains(e.target)||e.target===document.body||e.target.id==='game'))return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)D.next();},true);
})();
